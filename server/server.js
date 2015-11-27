'use strict';

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _ejs = require('ejs');

var _ejs2 = _interopRequireDefault(_ejs);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _socketIo = require('socket.io');

var _socketIo2 = _interopRequireDefault(_socketIo);

var _osc = require('osc');

var _osc2 = _interopRequireDefault(_osc);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _Client = require('./Client');

var _Client2 = _interopRequireDefault(_Client);

// globals
var availableClientIndices = [];
var oscListeners = [];
var nextClientIndex = 0;
var expressApp = null;
var httpServer = null;

function _getClientIndex() {
  var index = -1;

  if (availableClientIndices.length > 0) {
    availableClientIndices.sort(function (a, b) {
      return a - b;
    });

    index = availableClientIndices.splice(0, 1)[0];
  } else {
    index = nextClientIndex++;
  }

  return index;
}

function _releaseClientIndex(index) {
  availableClientIndices.push(index);
}

/**
 * The `server` object contains the basic methods of the server.
 * For instance, this object allows setting up, configuring and starting the server with the method `start` while the method `map` allows for managing the mapping between different types of clients and their required server modules.
 * Additionally, the method `broadcast` allows to send messages to all connected clients via WebSockets or OSC.
 * @type {Object}
 */
exports['default'] = {

  /**
   * WebSocket server.
   * @type {Object}
   * @private
   */
  io: null,

  /**
   * Envirnment configuration information (development / production).
   * @type {Object}
   * @private
   */
  envConfig: {}, // host env config informations (dev / prod)

  /**
   * OSC object.
   * @type {Object}
   * @private
   */
  osc: null,

  /**
   * Start the server.
   * @param {Object} app Express application.
   * @param {String} publicPath Public static directory of the Express app.
   * @param {Number} port Port.
   * @param {Object} [options={}] Options.
   * @param {Object} [options.socketIO={}] socket.io options. The socket.io config object can have the following properties:
   * - `transports:String`: communication transport (defaults to `'websocket'`);
   * - `pingTimeout:Number`: timeout (in milliseconds) before trying to reestablish a connection between a lost client and a server (defautls to `60000`);
   * - `pingInterval:Number`: time interval (in milliseconds) to send a ping to a client to check the connection (defaults to `50000`).
   * @param {Object} [options.osc={}] OSC options. The OSC config object can have the following properties:
   * - `localAddress:String`: address of the local machine to receive OSC messages (defaults to `'127.0.0.1'`);
   * - `localPort:Number`: port of the local machine to receive OSC messages (defaults to `57121`);
   * - `remoteAddress:String`: address of the device to send default OSC messages to (defaults to `'127.0.0.1'`);
   * - `remotePort:Number`: port of the device to send default OSC messages to (defaults to `57120`).
   * @param {Object} [options.env={}] Environnement options (set by the user, depends on the scenario).
   */
  // start: (app, publicPath, port, options = {}) => {
  start: function start() {
    var appConfig = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var envConfig = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    appConfig = _Object$assign({
      publicPath: _path2['default'].join(process.cwd(), 'public'),
      // @note: EngineIO defaults
      // this.pingTimeout = opts.pingTimeout || 3000;
      // this.pingInterval = opts.pingInterval || 1000;
      // this.upgradeTimeout = opts.upgradeTimeout || 10000;
      // this.maxHttpBufferSize = opts.maxHttpBufferSize || 10E7;
      socketIO: {
        transports: ['websocket'],
        pingTimeout: 60000,
        pingInterval: 50000
      }
    }, appConfig);

    envConfig = _Object$assign({
      port: 8000,
      osc: {
        localAddress: '127.0.0.1',
        localPort: 57121,
        remoteAddress: '127.0.0.1',
        remotePort: 57120
      }
    }, envConfig);

    this.envConfig = envConfig;
    this.appConfig = appConfig;

    // configure express and http server
    expressApp = new _express2['default']();
    expressApp.set('port', process.env.PORT || envConfig.port);
    expressApp.set('view engine', 'ejs');
    expressApp.use(_express2['default']['static'](appConfig.publicPath));

    httpServer = _http2['default'].createServer(expressApp);
    httpServer.listen(expressApp.get('port'), function () {
      var url = 'http://127.0.0.1:' + expressApp.get('port');
      console.log('[HTTP SERVER] Server listening on', url);
    });

    this.expressApp = expressApp;
    this.httpServer = httpServer;

    // configure socket.io
    this.io = new _socketIo2['default'](httpServer, appConfig.socketIO);

    // configure OSC
    if (envConfig.osc) {
      this.osc = new _osc2['default'].UDPPort({
        // This is the port we're listening on.
        // @note rename to receiveAddress / receivePort
        localAddress: envConfig.osc.localAddress,
        localPort: envConfig.osc.localPort,
        // This is the port we use to send messages.
        // @note rename to sendAddress / sendPort
        remoteAddress: envConfig.osc.remoteAddress,
        remotePort: envConfig.osc.remotePort
      });

      this.osc.on('ready', function () {
        var receive = envConfig.osc.localAddress + ':' + envConfig.osc.localPort;
        var send = envConfig.osc.remoteAddress + ':' + envConfig.osc.remotePort;
        console.log('[OSC over UDP] Receiving on ' + receive);
        console.log('[OSC over UDP] Sending on ' + send);
      });

      this.osc.on('message', function (oscMsg) {
        var address = oscMsg.address;

        for (var i = 0; i < oscListeners.length; i++) {
          if (address === oscListeners[i].wildcard) oscListeners[i].callback(oscMsg);
        }
      });

      this.osc.open();
    }
  },

  /**
   * Indicate that the clients of type `clientType` require the modules `...modules` on the server side.
   * Additionally, this method routes the connections from the corresponding URL to the corresponding view.
   * More specifically:
   * - A client connecting to the server through the root URL `http://my.server.address:port/` is considered as a `'player'` client and displays the view `player.ejs`;
   * - A client connecting to the server through the URL `http://my.server.address:port/clientType` is considered as a `clientType` client, and displays the view `clientType.ejs`.
   * @param {String} clientType Client type (as defined by the method {@link client.init} on the client side).
   * @param {...ClientModule} modules Modules to map to that client type.
   */
  map: function map(clientType) {
    var _this = this;

    for (var _len = arguments.length, modules = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      modules[_key - 1] = arguments[_key];
    }

    var url = '/';

    // cache compiled template
    var tmplPath = _path2['default'].join(process.cwd(), 'views', clientType + '.ejs');
    var tmplString = _fs2['default'].readFileSync(tmplPath, { encoding: 'utf8' });
    var tmpl = _ejs2['default'].compile(tmplString);

    if (clientType !== 'player') {
      url += clientType;
    }

    expressApp.get(url, function (req, res) {
      res.send(tmpl({ envConfig: JSON.stringify(_this.envConfig) }));
    });

    this.io.of(clientType).on('connection', function (socket) {
      var client = new _Client2['default'](clientType, socket);
      client.index = _getClientIndex();

      modules.forEach(function (mod) {
        mod.connect(client);
      });

      client.receive('disconnect', function () {
        modules.forEach(function (mod) {
          mod.disconnect(client);
        });

        _releaseClientIndex(client.index);
        client.index = -1;

        _logger2['default'].info({ socket: socket, clientType: clientType }, 'disconnect');
      });

      client.send('client:start', client.index); // the server is ready
      _logger2['default'].info({ socket: socket, clientType: clientType }, 'connection');
    });
  },

  /**
   * Send a WebSocket message to all the clients of type `clientType`.
   *
   * **Note:** on the client side, the clients receive the message with the method {@link client.receive}.
   * @param {String} clientType Client type (as defined by the method {@link client.init} on the client side).
   * @param {String} msg Name of the message to send.
   * @param {...*} args Arguments of the message (as many as needed, of any type).
   * @todo solve ... problem
   */
  broadcast: function broadcast(clientType, msg) {
    for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      args[_key2 - 2] = arguments[_key2];
    }

    var _io$of;

    (_io$of = this.io.of('/' + clientType)).emit.apply(_io$of, [msg].concat(args));
    _logger2['default'].info({ clientType: clientType, channel: msg, arguments: args }, 'broadcast');
  },

  /**
   * Send an OSC message.
   * @param {String} wildcard Wildcard of the OSC message.
   * @param {Array} args Arguments of the OSC message.
   * @param {String} [url=null] URL to send the OSC message to (if not specified, uses the address defined in the OSC config or in the options of the {@link server.start} method).
   * @param {Number} [port=null] Port to send the message to (if not specified, uses the port defined in the OSC config or in the options of the {@link server.start} method).
   */
  sendOSC: function sendOSC(wildcard, args) {
    var url = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
    var port = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

    var oscMsg = {
      address: wildcard,
      args: args
    };

    try {
      if (url && port) {
        this.osc.send(oscMsg, url, port);
      } else {
        this.osc.send(oscMsg); // use defaults (as defined in the config)
      }
    } catch (e) {
      console.log('Error while sending OSC message:', e);
    }
  },

  /**
   * Listen for OSC message and execute a callback function.
   * The server listens to OSC messages at the address and port defined in the config or in the options of the {@link server.start} method.
   *
   * @param {String} wildcard Wildcard of the OSC message.
   * @param {Function} callback Callback function executed when the OSC message is received.
   */
  receiveOSC: function receiveOSC(wildcard, callback) {
    var oscListener = {
      wildcard: wildcard,
      callback: callback
    };

    oscListeners.push(oscListener);
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvc2VydmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7bUJBQWdCLEtBQUs7Ozs7dUJBQ0QsU0FBUzs7OztrQkFDZCxJQUFJOzs7O29CQUNGLE1BQU07Ozs7c0JBQ1AsVUFBVTs7Ozt3QkFDWCxXQUFXOzs7O21CQUNWLEtBQUs7Ozs7b0JBQ0osTUFBTTs7OztzQkFDSixVQUFVOzs7OztBQUc3QixJQUFNLHNCQUFzQixHQUFHLEVBQUUsQ0FBQztBQUNsQyxJQUFNLFlBQVksR0FBRyxFQUFFLENBQUM7QUFDeEIsSUFBSSxlQUFlLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQztBQUN0QixJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUM7O0FBRXRCLFNBQVMsZUFBZSxHQUFHO0FBQ3pCLE1BQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDOztBQUVmLE1BQUksc0JBQXNCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUNyQywwQkFBc0IsQ0FBQyxJQUFJLENBQUMsVUFBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3pDLGFBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNkLENBQUMsQ0FBQzs7QUFFSCxTQUFLLEdBQUcsc0JBQXNCLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUNoRCxNQUFNO0FBQ0wsU0FBSyxHQUFHLGVBQWUsRUFBRSxDQUFDO0dBQzNCOztBQUVELFNBQU8sS0FBSyxDQUFDO0NBQ2Q7O0FBRUQsU0FBUyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUU7QUFDbEMsd0JBQXNCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0NBQ3BDOzs7Ozs7OztxQkFTYzs7Ozs7OztBQU9iLElBQUUsRUFBRSxJQUFJOzs7Ozs7O0FBT1IsV0FBUyxFQUFFLEVBQUU7Ozs7Ozs7QUFPYixLQUFHLEVBQUUsSUFBSTs7Ozs7Ozs7Ozs7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QUFDLEVBQUMsSUFBSSxNQUFBLFVBQUMsR0FBRyxTQUFLLElBQUksRUFBQyxDQUFDO0FBQ2hELHdCQUFJLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUsV0FBVyxDQUFDLENBQUM7R0FDbEY7Ozs7Ozs7OztBQVNELFNBQU8sRUFBQSxpQkFBQyxRQUFRLEVBQUUsSUFBSSxFQUEyQjtRQUF6QixHQUFHLHlEQUFHLElBQUk7UUFBRSxJQUFJLHlEQUFHLElBQUk7O0FBQzdDLFFBQU0sTUFBTSxHQUFHO0FBQ2IsYUFBTyxFQUFFLFFBQVE7QUFDakIsVUFBSSxFQUFFLElBQUk7S0FDWCxDQUFDOztBQUVGLFFBQUk7QUFDRixVQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUU7QUFDZixZQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO09BQ2xDLE1BQU07QUFDTCxZQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztPQUN2QjtLQUNGLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDVixhQUFPLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3BEO0dBQ0Y7Ozs7Ozs7OztBQVNELFlBQVUsRUFBQSxvQkFBQyxRQUFRLEVBQUUsUUFBUSxFQUFFO0FBQzdCLFFBQU0sV0FBVyxHQUFHO0FBQ2xCLGNBQVEsRUFBRSxRQUFRO0FBQ2xCLGNBQVEsRUFBRSxRQUFRO0tBQ25CLENBQUM7O0FBRUYsZ0JBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7R0FDaEM7Q0FDRiIsImZpbGUiOiJzcmMvc2VydmVyL3NlcnZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBlanMgZnJvbSAnZWpzJztcbmltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBodHRwIGZyb20gJ2h0dHAnO1xuaW1wb3J0IGxvZyBmcm9tICcuL2xvZ2dlcic7XG5pbXBvcnQgSU8gZnJvbSAnc29ja2V0LmlvJztcbmltcG9ydCBvc2MgZnJvbSAnb3NjJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IENsaWVudCBmcm9tICcuL0NsaWVudCc7XG5cbi8vIGdsb2JhbHNcbmNvbnN0IGF2YWlsYWJsZUNsaWVudEluZGljZXMgPSBbXTtcbmNvbnN0IG9zY0xpc3RlbmVycyA9IFtdO1xubGV0IG5leHRDbGllbnRJbmRleCA9IDA7XG5sZXQgZXhwcmVzc0FwcCA9IG51bGw7XG5sZXQgaHR0cFNlcnZlciA9IG51bGw7XG5cbmZ1bmN0aW9uIF9nZXRDbGllbnRJbmRleCgpIHtcbiAgdmFyIGluZGV4ID0gLTE7XG5cbiAgaWYgKGF2YWlsYWJsZUNsaWVudEluZGljZXMubGVuZ3RoID4gMCkge1xuICAgIGF2YWlsYWJsZUNsaWVudEluZGljZXMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICByZXR1cm4gYSAtIGI7XG4gICAgfSk7XG5cbiAgICBpbmRleCA9IGF2YWlsYWJsZUNsaWVudEluZGljZXMuc3BsaWNlKDAsIDEpWzBdO1xuICB9IGVsc2Uge1xuICAgIGluZGV4ID0gbmV4dENsaWVudEluZGV4Kys7XG4gIH1cblxuICByZXR1cm4gaW5kZXg7XG59XG5cbmZ1bmN0aW9uIF9yZWxlYXNlQ2xpZW50SW5kZXgoaW5kZXgpIHtcbiAgYXZhaWxhYmxlQ2xpZW50SW5kaWNlcy5wdXNoKGluZGV4KTtcbn1cblxuXG4vKipcbiAqIFRoZSBgc2VydmVyYCBvYmplY3QgY29udGFpbnMgdGhlIGJhc2ljIG1ldGhvZHMgb2YgdGhlIHNlcnZlci5cbiAqIEZvciBpbnN0YW5jZSwgdGhpcyBvYmplY3QgYWxsb3dzIHNldHRpbmcgdXAsIGNvbmZpZ3VyaW5nIGFuZCBzdGFydGluZyB0aGUgc2VydmVyIHdpdGggdGhlIG1ldGhvZCBgc3RhcnRgIHdoaWxlIHRoZSBtZXRob2QgYG1hcGAgYWxsb3dzIGZvciBtYW5hZ2luZyB0aGUgbWFwcGluZyBiZXR3ZWVuIGRpZmZlcmVudCB0eXBlcyBvZiBjbGllbnRzIGFuZCB0aGVpciByZXF1aXJlZCBzZXJ2ZXIgbW9kdWxlcy5cbiAqIEFkZGl0aW9uYWxseSwgdGhlIG1ldGhvZCBgYnJvYWRjYXN0YCBhbGxvd3MgdG8gc2VuZCBtZXNzYWdlcyB0byBhbGwgY29ubmVjdGVkIGNsaWVudHMgdmlhIFdlYlNvY2tldHMgb3IgT1NDLlxuICogQHR5cGUge09iamVjdH1cbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuXG4gIC8qKlxuICAgKiBXZWJTb2NrZXQgc2VydmVyLlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaW86IG51bGwsXG5cbiAgLyoqXG4gICAqIEVudmlybm1lbnQgY29uZmlndXJhdGlvbiBpbmZvcm1hdGlvbiAoZGV2ZWxvcG1lbnQgLyBwcm9kdWN0aW9uKS5cbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGVudkNvbmZpZzoge30sIC8vIGhvc3QgZW52IGNvbmZpZyBpbmZvcm1hdGlvbnMgKGRldiAvIHByb2QpXG5cbiAgLyoqXG4gICAqIE9TQyBvYmplY3QuXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBvc2M6IG51bGwsXG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhcHAgRXhwcmVzcyBhcHBsaWNhdGlvbi5cbiAgICogQHBhcmFtIHtTdHJpbmd9IHB1YmxpY1BhdGggUHVibGljIHN0YXRpYyBkaXJlY3Rvcnkgb2YgdGhlIEV4cHJlc3MgYXBwLlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9ydCBQb3J0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5zb2NrZXRJTz17fV0gc29ja2V0LmlvIG9wdGlvbnMuIFRoZSBzb2NrZXQuaW8gY29uZmlnIG9iamVjdCBjYW4gaGF2ZSB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gICAqIC0gYHRyYW5zcG9ydHM6U3RyaW5nYDogY29tbXVuaWNhdGlvbiB0cmFuc3BvcnQgKGRlZmF1bHRzIHRvIGAnd2Vic29ja2V0J2ApO1xuICAgKiAtIGBwaW5nVGltZW91dDpOdW1iZXJgOiB0aW1lb3V0IChpbiBtaWxsaXNlY29uZHMpIGJlZm9yZSB0cnlpbmcgdG8gcmVlc3RhYmxpc2ggYSBjb25uZWN0aW9uIGJldHdlZW4gYSBsb3N0IGNsaWVudCBhbmQgYSBzZXJ2ZXIgKGRlZmF1dGxzIHRvIGA2MDAwMGApO1xuICAgKiAtIGBwaW5nSW50ZXJ2YWw6TnVtYmVyYDogdGltZSBpbnRlcnZhbCAoaW4gbWlsbGlzZWNvbmRzKSB0byBzZW5kIGEgcGluZyB0byBhIGNsaWVudCB0byBjaGVjayB0aGUgY29ubmVjdGlvbiAoZGVmYXVsdHMgdG8gYDUwMDAwYCkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5vc2M9e31dIE9TQyBvcHRpb25zLiBUaGUgT1NDIGNvbmZpZyBvYmplY3QgY2FuIGhhdmUgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICAgKiAtIGBsb2NhbEFkZHJlc3M6U3RyaW5nYDogYWRkcmVzcyBvZiB0aGUgbG9jYWwgbWFjaGluZSB0byByZWNlaXZlIE9TQyBtZXNzYWdlcyAoZGVmYXVsdHMgdG8gYCcxMjcuMC4wLjEnYCk7XG4gICAqIC0gYGxvY2FsUG9ydDpOdW1iZXJgOiBwb3J0IG9mIHRoZSBsb2NhbCBtYWNoaW5lIHRvIHJlY2VpdmUgT1NDIG1lc3NhZ2VzIChkZWZhdWx0cyB0byBgNTcxMjFgKTtcbiAgICogLSBgcmVtb3RlQWRkcmVzczpTdHJpbmdgOiBhZGRyZXNzIG9mIHRoZSBkZXZpY2UgdG8gc2VuZCBkZWZhdWx0IE9TQyBtZXNzYWdlcyB0byAoZGVmYXVsdHMgdG8gYCcxMjcuMC4wLjEnYCk7XG4gICAqIC0gYHJlbW90ZVBvcnQ6TnVtYmVyYDogcG9ydCBvZiB0aGUgZGV2aWNlIHRvIHNlbmQgZGVmYXVsdCBPU0MgbWVzc2FnZXMgdG8gKGRlZmF1bHRzIHRvIGA1NzEyMGApLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMuZW52PXt9XSBFbnZpcm9ubmVtZW50IG9wdGlvbnMgKHNldCBieSB0aGUgdXNlciwgZGVwZW5kcyBvbiB0aGUgc2NlbmFyaW8pLlxuICAgKi9cbiAgLy8gc3RhcnQ6IChhcHAsIHB1YmxpY1BhdGgsIHBvcnQsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBzdGFydChhcHBDb25maWcgPSB7fSwgZW52Q29uZmlnID0ge30pIHtcbiAgICBhcHBDb25maWcgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIHB1YmxpY1BhdGg6IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAncHVibGljJyksXG4gICAgICAvLyBAbm90ZTogRW5naW5lSU8gZGVmYXVsdHNcbiAgICAgIC8vIHRoaXMucGluZ1RpbWVvdXQgPSBvcHRzLnBpbmdUaW1lb3V0IHx8IDMwMDA7XG4gICAgICAvLyB0aGlzLnBpbmdJbnRlcnZhbCA9IG9wdHMucGluZ0ludGVydmFsIHx8IDEwMDA7XG4gICAgICAvLyB0aGlzLnVwZ3JhZGVUaW1lb3V0ID0gb3B0cy51cGdyYWRlVGltZW91dCB8fCAxMDAwMDtcbiAgICAgIC8vIHRoaXMubWF4SHR0cEJ1ZmZlclNpemUgPSBvcHRzLm1heEh0dHBCdWZmZXJTaXplIHx8IDEwRTc7XG4gICAgICBzb2NrZXRJTzoge1xuICAgICAgICB0cmFuc3BvcnRzOiBbJ3dlYnNvY2tldCddLFxuICAgICAgICBwaW5nVGltZW91dDogNjAwMDAsXG4gICAgICAgIHBpbmdJbnRlcnZhbDogNTAwMDBcbiAgICAgIH1cbiAgICB9LCBhcHBDb25maWcpO1xuXG4gICAgZW52Q29uZmlnID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICBwb3J0OiA4MDAwLFxuICAgICAgb3NjOiB7XG4gICAgICAgIGxvY2FsQWRkcmVzczogJzEyNy4wLjAuMScsXG4gICAgICAgIGxvY2FsUG9ydDogNTcxMjEsXG4gICAgICAgIHJlbW90ZUFkZHJlc3M6ICcxMjcuMC4wLjEnLFxuICAgICAgICByZW1vdGVQb3J0OiA1NzEyMFxuICAgICAgfVxuICAgIH0sIGVudkNvbmZpZyk7XG5cbiAgICB0aGlzLmVudkNvbmZpZyA9IGVudkNvbmZpZztcbiAgICB0aGlzLmFwcENvbmZpZyA9IGFwcENvbmZpZztcblxuICAgIC8vIGNvbmZpZ3VyZSBleHByZXNzIGFuZCBodHRwIHNlcnZlclxuICAgIGV4cHJlc3NBcHAgPSBuZXcgZXhwcmVzcygpO1xuICAgIGV4cHJlc3NBcHAuc2V0KCdwb3J0JywgcHJvY2Vzcy5lbnYuUE9SVCB8fCBlbnZDb25maWcucG9ydCk7XG4gICAgZXhwcmVzc0FwcC5zZXQoJ3ZpZXcgZW5naW5lJywgJ2VqcycpO1xuICAgIGV4cHJlc3NBcHAudXNlKGV4cHJlc3Muc3RhdGljKGFwcENvbmZpZy5wdWJsaWNQYXRoKSk7XG5cbiAgICBodHRwU2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoZXhwcmVzc0FwcCk7XG4gICAgaHR0cFNlcnZlci5saXN0ZW4oZXhwcmVzc0FwcC5nZXQoJ3BvcnQnKSwgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCB1cmwgPSBgaHR0cDovLzEyNy4wLjAuMToke2V4cHJlc3NBcHAuZ2V0KCdwb3J0Jyl9YDtcbiAgICAgIGNvbnNvbGUubG9nKCdbSFRUUCBTRVJWRVJdIFNlcnZlciBsaXN0ZW5pbmcgb24nLCB1cmwpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5leHByZXNzQXBwID0gZXhwcmVzc0FwcDtcbiAgICB0aGlzLmh0dHBTZXJ2ZXIgPSBodHRwU2VydmVyO1xuXG4gICAgLy8gY29uZmlndXJlIHNvY2tldC5pb1xuICAgIHRoaXMuaW8gPSBuZXcgSU8oaHR0cFNlcnZlciwgYXBwQ29uZmlnLnNvY2tldElPKTtcblxuICAgIC8vIGNvbmZpZ3VyZSBPU0NcbiAgICBpZiAoZW52Q29uZmlnLm9zYykge1xuICAgICAgdGhpcy5vc2MgPSBuZXcgb3NjLlVEUFBvcnQoe1xuICAgICAgICAvLyBUaGlzIGlzIHRoZSBwb3J0IHdlJ3JlIGxpc3RlbmluZyBvbi5cbiAgICAgICAgLy8gQG5vdGUgcmVuYW1lIHRvIHJlY2VpdmVBZGRyZXNzIC8gcmVjZWl2ZVBvcnRcbiAgICAgICAgbG9jYWxBZGRyZXNzOiBlbnZDb25maWcub3NjLmxvY2FsQWRkcmVzcyxcbiAgICAgICAgbG9jYWxQb3J0OiBlbnZDb25maWcub3NjLmxvY2FsUG9ydCxcbiAgICAgICAgLy8gVGhpcyBpcyB0aGUgcG9ydCB3ZSB1c2UgdG8gc2VuZCBtZXNzYWdlcy5cbiAgICAgICAgLy8gQG5vdGUgcmVuYW1lIHRvIHNlbmRBZGRyZXNzIC8gc2VuZFBvcnRcbiAgICAgICAgcmVtb3RlQWRkcmVzczogZW52Q29uZmlnLm9zYy5yZW1vdGVBZGRyZXNzLFxuICAgICAgICByZW1vdGVQb3J0OiBlbnZDb25maWcub3NjLnJlbW90ZVBvcnQsXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5vc2Mub24oJ3JlYWR5JywgKCkgPT4ge1xuICAgICAgICBjb25zdCByZWNlaXZlID0gYCR7ZW52Q29uZmlnLm9zYy5sb2NhbEFkZHJlc3N9OiR7ZW52Q29uZmlnLm9zYy5sb2NhbFBvcnR9YDtcbiAgICAgICAgY29uc3Qgc2VuZCA9IGAke2VudkNvbmZpZy5vc2MucmVtb3RlQWRkcmVzc306JHtlbnZDb25maWcub3NjLnJlbW90ZVBvcnR9YDtcbiAgICAgICAgY29uc29sZS5sb2coYFtPU0Mgb3ZlciBVRFBdIFJlY2VpdmluZyBvbiAke3JlY2VpdmV9YCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGBbT1NDIG92ZXIgVURQXSBTZW5kaW5nIG9uICR7c2VuZH1gKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm9zYy5vbignbWVzc2FnZScsIChvc2NNc2cpID0+IHtcbiAgICAgICAgY29uc3QgYWRkcmVzcyA9IG9zY01zZy5hZGRyZXNzO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3NjTGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGFkZHJlc3MgPT09IG9zY0xpc3RlbmVyc1tpXS53aWxkY2FyZClcbiAgICAgICAgICAgIG9zY0xpc3RlbmVyc1tpXS5jYWxsYmFjayhvc2NNc2cpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5vc2Mub3BlbigpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogSW5kaWNhdGUgdGhhdCB0aGUgY2xpZW50cyBvZiB0eXBlIGBjbGllbnRUeXBlYCByZXF1aXJlIHRoZSBtb2R1bGVzIGAuLi5tb2R1bGVzYCBvbiB0aGUgc2VydmVyIHNpZGUuXG4gICAqIEFkZGl0aW9uYWxseSwgdGhpcyBtZXRob2Qgcm91dGVzIHRoZSBjb25uZWN0aW9ucyBmcm9tIHRoZSBjb3JyZXNwb25kaW5nIFVSTCB0byB0aGUgY29ycmVzcG9uZGluZyB2aWV3LlxuICAgKiBNb3JlIHNwZWNpZmljYWxseTpcbiAgICogLSBBIGNsaWVudCBjb25uZWN0aW5nIHRvIHRoZSBzZXJ2ZXIgdGhyb3VnaCB0aGUgcm9vdCBVUkwgYGh0dHA6Ly9teS5zZXJ2ZXIuYWRkcmVzczpwb3J0L2AgaXMgY29uc2lkZXJlZCBhcyBhIGAncGxheWVyJ2AgY2xpZW50IGFuZCBkaXNwbGF5cyB0aGUgdmlldyBgcGxheWVyLmVqc2A7XG4gICAqIC0gQSBjbGllbnQgY29ubmVjdGluZyB0byB0aGUgc2VydmVyIHRocm91Z2ggdGhlIFVSTCBgaHR0cDovL215LnNlcnZlci5hZGRyZXNzOnBvcnQvY2xpZW50VHlwZWAgaXMgY29uc2lkZXJlZCBhcyBhIGBjbGllbnRUeXBlYCBjbGllbnQsIGFuZCBkaXNwbGF5cyB0aGUgdmlldyBgY2xpZW50VHlwZS5lanNgLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2xpZW50VHlwZSBDbGllbnQgdHlwZSAoYXMgZGVmaW5lZCBieSB0aGUgbWV0aG9kIHtAbGluayBjbGllbnQuaW5pdH0gb24gdGhlIGNsaWVudCBzaWRlKS5cbiAgICogQHBhcmFtIHsuLi5DbGllbnRNb2R1bGV9IG1vZHVsZXMgTW9kdWxlcyB0byBtYXAgdG8gdGhhdCBjbGllbnQgdHlwZS5cbiAgICovXG4gIG1hcChjbGllbnRUeXBlLCAuLi5tb2R1bGVzKSB7XG4gICAgbGV0IHVybCA9ICcvJztcblxuICAgIC8vIGNhY2hlIGNvbXBpbGVkIHRlbXBsYXRlXG4gICAgY29uc3QgdG1wbFBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3ZpZXdzJywgY2xpZW50VHlwZSArICcuZWpzJyk7XG4gICAgY29uc3QgdG1wbFN0cmluZyA9IGZzLnJlYWRGaWxlU3luYyh0bXBsUGF0aCwgeyBlbmNvZGluZzogJ3V0ZjgnIH0pO1xuICAgIGNvbnN0IHRtcGwgPSBlanMuY29tcGlsZSh0bXBsU3RyaW5nKTtcblxuICAgIGlmIChjbGllbnRUeXBlICE9PSAncGxheWVyJykgeyB1cmwgKz0gY2xpZW50VHlwZTsgfVxuXG4gICAgZXhwcmVzc0FwcC5nZXQodXJsLCAocmVxLCByZXMpID0+IHtcbiAgICAgIHJlcy5zZW5kKHRtcGwoeyBlbnZDb25maWc6IEpTT04uc3RyaW5naWZ5KHRoaXMuZW52Q29uZmlnKSB9KSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmlvLm9mKGNsaWVudFR5cGUpLm9uKCdjb25uZWN0aW9uJywgKHNvY2tldCkgPT4ge1xuICAgICAgY29uc3QgY2xpZW50ID0gbmV3IENsaWVudChjbGllbnRUeXBlLCBzb2NrZXQpO1xuICAgICAgY2xpZW50LmluZGV4ID0gX2dldENsaWVudEluZGV4KCk7XG5cbiAgICAgIG1vZHVsZXMuZm9yRWFjaCgobW9kKSA9PiB7IG1vZC5jb25uZWN0KGNsaWVudCkgfSk7XG5cbiAgICAgIGNsaWVudC5yZWNlaXZlKCdkaXNjb25uZWN0JywgKCkgPT4ge1xuICAgICAgICBtb2R1bGVzLmZvckVhY2goKG1vZCkgPT4geyBtb2QuZGlzY29ubmVjdChjbGllbnQpIH0pO1xuXG4gICAgICAgIF9yZWxlYXNlQ2xpZW50SW5kZXgoY2xpZW50LmluZGV4KTtcbiAgICAgICAgY2xpZW50LmluZGV4ID0gLTE7XG5cbiAgICAgICAgbG9nLmluZm8oeyBzb2NrZXQ6IHNvY2tldCwgY2xpZW50VHlwZTogY2xpZW50VHlwZSB9LCAnZGlzY29ubmVjdCcpO1xuICAgICAgfSk7XG5cbiAgICAgIGNsaWVudC5zZW5kKCdjbGllbnQ6c3RhcnQnLCBjbGllbnQuaW5kZXgpOyAvLyB0aGUgc2VydmVyIGlzIHJlYWR5XG4gICAgICBsb2cuaW5mbyh7IHNvY2tldDogc29ja2V0LCBjbGllbnRUeXBlOiBjbGllbnRUeXBlIH0sICdjb25uZWN0aW9uJyk7XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNlbmQgYSBXZWJTb2NrZXQgbWVzc2FnZSB0byBhbGwgdGhlIGNsaWVudHMgb2YgdHlwZSBgY2xpZW50VHlwZWAuXG4gICAqXG4gICAqICoqTm90ZToqKiBvbiB0aGUgY2xpZW50IHNpZGUsIHRoZSBjbGllbnRzIHJlY2VpdmUgdGhlIG1lc3NhZ2Ugd2l0aCB0aGUgbWV0aG9kIHtAbGluayBjbGllbnQucmVjZWl2ZX0uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjbGllbnRUeXBlIENsaWVudCB0eXBlIChhcyBkZWZpbmVkIGJ5IHRoZSBtZXRob2Qge0BsaW5rIGNsaWVudC5pbml0fSBvbiB0aGUgY2xpZW50IHNpZGUpLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbXNnIE5hbWUgb2YgdGhlIG1lc3NhZ2UgdG8gc2VuZC5cbiAgICogQHBhcmFtIHsuLi4qfSBhcmdzIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAgICogQHRvZG8gc29sdmUgLi4uIHByb2JsZW1cbiAgICovXG4gIGJyb2FkY2FzdChjbGllbnRUeXBlLCBtc2csIC4uLmFyZ3MpIHtcbiAgICB0aGlzLmlvLm9mKCcvJyArIGNsaWVudFR5cGUpLmVtaXQobXNnLCAuLi5hcmdzKTtcbiAgICBsb2cuaW5mbyh7IGNsaWVudFR5cGU6IGNsaWVudFR5cGUsIGNoYW5uZWw6IG1zZywgYXJndW1lbnRzOiBhcmdzIH0sICdicm9hZGNhc3QnKTtcbiAgfSxcblxuICAvKipcbiAgICogU2VuZCBhbiBPU0MgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IHdpbGRjYXJkIFdpbGRjYXJkIG9mIHRoZSBPU0MgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtBcnJheX0gYXJncyBBcmd1bWVudHMgb2YgdGhlIE9TQyBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW3VybD1udWxsXSBVUkwgdG8gc2VuZCB0aGUgT1NDIG1lc3NhZ2UgdG8gKGlmIG5vdCBzcGVjaWZpZWQsIHVzZXMgdGhlIGFkZHJlc3MgZGVmaW5lZCBpbiB0aGUgT1NDIGNvbmZpZyBvciBpbiB0aGUgb3B0aW9ucyBvZiB0aGUge0BsaW5rIHNlcnZlci5zdGFydH0gbWV0aG9kKS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtwb3J0PW51bGxdIFBvcnQgdG8gc2VuZCB0aGUgbWVzc2FnZSB0byAoaWYgbm90IHNwZWNpZmllZCwgdXNlcyB0aGUgcG9ydCBkZWZpbmVkIGluIHRoZSBPU0MgY29uZmlnIG9yIGluIHRoZSBvcHRpb25zIG9mIHRoZSB7QGxpbmsgc2VydmVyLnN0YXJ0fSBtZXRob2QpLlxuICAgKi9cbiAgc2VuZE9TQyh3aWxkY2FyZCwgYXJncywgdXJsID0gbnVsbCwgcG9ydCA9IG51bGwpIHtcbiAgICBjb25zdCBvc2NNc2cgPSB7XG4gICAgICBhZGRyZXNzOiB3aWxkY2FyZCxcbiAgICAgIGFyZ3M6IGFyZ3NcbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgIGlmICh1cmwgJiYgcG9ydCkge1xuICAgICAgICB0aGlzLm9zYy5zZW5kKG9zY01zZywgdXJsLCBwb3J0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub3NjLnNlbmQob3NjTXNnKTsgLy8gdXNlIGRlZmF1bHRzIChhcyBkZWZpbmVkIGluIHRoZSBjb25maWcpXG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5sb2coJ0Vycm9yIHdoaWxlIHNlbmRpbmcgT1NDIG1lc3NhZ2U6JywgZSk7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBMaXN0ZW4gZm9yIE9TQyBtZXNzYWdlIGFuZCBleGVjdXRlIGEgY2FsbGJhY2sgZnVuY3Rpb24uXG4gICAqIFRoZSBzZXJ2ZXIgbGlzdGVucyB0byBPU0MgbWVzc2FnZXMgYXQgdGhlIGFkZHJlc3MgYW5kIHBvcnQgZGVmaW5lZCBpbiB0aGUgY29uZmlnIG9yIGluIHRoZSBvcHRpb25zIG9mIHRoZSB7QGxpbmsgc2VydmVyLnN0YXJ0fSBtZXRob2QuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB3aWxkY2FyZCBXaWxkY2FyZCBvZiB0aGUgT1NDIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIENhbGxiYWNrIGZ1bmN0aW9uIGV4ZWN1dGVkIHdoZW4gdGhlIE9TQyBtZXNzYWdlIGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgcmVjZWl2ZU9TQyh3aWxkY2FyZCwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBvc2NMaXN0ZW5lciA9IHtcbiAgICAgIHdpbGRjYXJkOiB3aWxkY2FyZCxcbiAgICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICAgIH07XG5cbiAgICBvc2NMaXN0ZW5lcnMucHVzaChvc2NMaXN0ZW5lcik7XG4gIH1cbn07XG5cbiJdfQ==