'use strict';

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _comm = require('./comm');

var _comm2 = _interopRequireDefault(_comm);

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
// @todo hide this into client

var oscListeners = [];

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
   * Express application
   * @type {Object}
   */
  expressApp: null,
  /**
   * Http server
   * @type {Object}
   */
  httpServer: null,

  /**
   * Application configuration information.
   * @type {Object}
   * @private
   */
  appConfig: {}, // host env config informations (dev / prod)

  /**
   * Environment configuration information (development / production).
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
   * @param {Object} [appConfig={}] Application configuration options.
   * @attribute {String} [appConfig.publicFolder='./public'] Path to the public folder.
   * @attribute {Object} [appConfig.socketIO={}] socket.io options. The socket.io config object can have the following properties:
   * - `transports:String`: communication transport (defaults to `'websocket'`);
   * - `pingTimeout:Number`: timeout (in milliseconds) before trying to reestablish a connection between a lost client and a server (defautls to `60000`);
   * - `pingInterval:Number`: time interval (in milliseconds) to send a ping to a client to check the connection (defaults to `50000`).
   * @param {Object} [envConfig={}] Environment configuration options.
   * @attribute {Number} [envConfig.port=8000] Port of the HTTP server.
   * @attribute {Object} [envConfig.osc={}] OSC options. The OSC config object can have the following properties:
   * - `localAddress:String`: address of the local machine to receive OSC messages (defaults to `'127.0.0.1'`);
   * - `localPort:Number`: port of the local machine to receive OSC messages (defaults to `57121`);
   * - `remoteAddress:String`: address of the device to send default OSC messages to (defaults to `'127.0.0.1'`);
   * - `remotePort:Number`: port of the device to send default OSC messages to (defaults to `57120`).
   */
  start: function start() {
    var appConfig = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var envConfig = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    appConfig = _Object$assign({
      publicFolder: _path2['default'].join(process.cwd(), 'public'),
      defaultClient: 'player',
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
    var expressApp = new _express2['default']();
    expressApp.set('port', process.env.PORT || envConfig.port);
    expressApp.set('view engine', 'ejs');
    expressApp.use(_express2['default']['static'](appConfig.publicFolder));

    var httpServer = _http2['default'].createServer(expressApp);
    httpServer.listen(expressApp.get('port'), function () {
      var url = 'http://127.0.0.1:' + expressApp.get('port');
      console.log('[HTTP SERVER] Server listening on', url);
    });

    this.expressApp = expressApp;
    this.httpServer = httpServer;

    // configure socket.io
    this.io = new _socketIo2['default'](httpServer, appConfig.socketIO);
    _comm2['default'].initialize(this.io);

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

    if (clientType !== this.appConfig.defaultClient) {
      url += clientType;
    }

    //
    this.expressApp.get(url, function (req, res) {
      res.send(tmpl({ envConfig: JSON.stringify(_this.envConfig) }));
    });

    this.io.of(clientType).on('connection', function (socket) {
      var client = new _Client2['default'](clientType, socket);
      client.index = _getClientIndex();

      modules.forEach(function (mod) {
        mod.connect(client);
      });

      // @todo - hide this into the client ?
      // global events for the client
      _comm2['default'].receive(client, 'disconnect', function () {
        // problem here for hide into clients
        modules.forEach(function (mod) {
          mod.disconnect(client);
        });

        _releaseClientIndex(client.index);
        client.index = -1;

        _logger2['default'].info({ socket: socket, clientType: clientType }, 'disconnect');
      });

      _comm2['default'].send(client, 'client:start', client.index); // the server is ready

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
  // broadcast(clientType, msg, ...args) {
  //   this.io.of('/' + clientType).emit(msg, ...args);
  //   log.info({ clientType: clientType, channel: msg, arguments: args }, 'broadcast');
  // },

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvc2VydmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBQWlCLFFBQVE7Ozs7bUJBQ1QsS0FBSzs7Ozt1QkFDRCxTQUFTOzs7O2tCQUNkLElBQUk7Ozs7b0JBQ0YsTUFBTTs7OztzQkFDUCxVQUFVOzs7O3dCQUNYLFdBQVc7Ozs7bUJBQ1YsS0FBSzs7OztvQkFDSixNQUFNOzs7O3NCQUNKLFVBQVU7Ozs7Ozs7QUFLN0IsSUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDOzs7Ozs7OztxQkFTVDs7Ozs7OztBQU9iLElBQUUsRUFBRSxJQUFJOzs7Ozs7QUFNUixZQUFVLEVBQUUsSUFBSTs7Ozs7QUFLaEIsWUFBVSxFQUFFLElBQUk7Ozs7Ozs7QUFPaEIsV0FBUyxFQUFFLEVBQUU7Ozs7Ozs7QUFPYixXQUFTLEVBQUUsRUFBRTs7Ozs7OztBQU9iLEtBQUcsRUFBRSxJQUFJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQlQsT0FBSyxFQUFBLGlCQUFpQztRQUFoQyxTQUFTLHlEQUFHLEVBQUU7UUFBRSxTQUFTLHlEQUFHLEVBQUU7O0FBQ2xDLGFBQVMsR0FBRyxlQUFjO0FBQ3hCLGtCQUFZLEVBQUUsa0JBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxRQUFRLENBQUM7QUFDaEQsbUJBQWEsRUFBRSxRQUFROzs7Ozs7QUFNdkIsY0FBUSxFQUFFO0FBQ1Isa0JBQVUsRUFBRSxDQUFDLFdBQVcsQ0FBQztBQUN6QixtQkFBVyxFQUFFLEtBQUs7QUFDbEIsb0JBQVksRUFBRSxLQUFLO09BQ3BCO0tBQ0YsRUFBRSxTQUFTLENBQUMsQ0FBQzs7QUFFZCxhQUFTLEdBQUcsZUFBYztBQUN4QixVQUFJLEVBQUUsSUFBSTtBQUNWLFNBQUcsRUFBRTtBQUNILG9CQUFZLEVBQUUsV0FBVztBQUN6QixpQkFBUyxFQUFFLEtBQUs7QUFDaEIscUJBQWEsRUFBRSxXQUFXO0FBQzFCLGtCQUFVLEVBQUUsS0FBSztPQUNsQjtLQUNG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LFFBQVEsRUFBRSxRQUFRLEVBQUU7QUFDN0IsUUFBTSxXQUFXLEdBQUc7QUFDbEIsY0FBUSxFQUFFLFFBQVE7QUFDbEIsY0FBUSxFQUFFLFFBQVE7S0FDbkIsQ0FBQzs7QUFFRixnQkFBWSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztHQUNoQztDQUNGIiwiZmlsZSI6InNyYy9zZXJ2ZXIvc2VydmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNvbW0gZnJvbSAnLi9jb21tJztcbmltcG9ydCBlanMgZnJvbSAnZWpzJztcbmltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBodHRwIGZyb20gJ2h0dHAnO1xuaW1wb3J0IGxvZyBmcm9tICcuL2xvZ2dlcic7XG5pbXBvcnQgSU8gZnJvbSAnc29ja2V0LmlvJztcbmltcG9ydCBvc2MgZnJvbSAnb3NjJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IENsaWVudCBmcm9tICcuL0NsaWVudCc7XG5cbi8vIGdsb2JhbHNcbi8vIEB0b2RvIGhpZGUgdGhpcyBpbnRvIGNsaWVudFxuXG5jb25zdCBvc2NMaXN0ZW5lcnMgPSBbXTtcblxuXG4vKipcbiAqIFRoZSBgc2VydmVyYCBvYmplY3QgY29udGFpbnMgdGhlIGJhc2ljIG1ldGhvZHMgb2YgdGhlIHNlcnZlci5cbiAqIEZvciBpbnN0YW5jZSwgdGhpcyBvYmplY3QgYWxsb3dzIHNldHRpbmcgdXAsIGNvbmZpZ3VyaW5nIGFuZCBzdGFydGluZyB0aGUgc2VydmVyIHdpdGggdGhlIG1ldGhvZCBgc3RhcnRgIHdoaWxlIHRoZSBtZXRob2QgYG1hcGAgYWxsb3dzIGZvciBtYW5hZ2luZyB0aGUgbWFwcGluZyBiZXR3ZWVuIGRpZmZlcmVudCB0eXBlcyBvZiBjbGllbnRzIGFuZCB0aGVpciByZXF1aXJlZCBzZXJ2ZXIgbW9kdWxlcy5cbiAqIEFkZGl0aW9uYWxseSwgdGhlIG1ldGhvZCBgYnJvYWRjYXN0YCBhbGxvd3MgdG8gc2VuZCBtZXNzYWdlcyB0byBhbGwgY29ubmVjdGVkIGNsaWVudHMgdmlhIFdlYlNvY2tldHMgb3IgT1NDLlxuICogQHR5cGUge09iamVjdH1cbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuXG4gIC8qKlxuICAgKiBXZWJTb2NrZXQgc2VydmVyLlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaW86IG51bGwsXG5cbiAgLyoqXG4gICAqIEV4cHJlc3MgYXBwbGljYXRpb25cbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG4gIGV4cHJlc3NBcHA6IG51bGwsXG4gIC8qKlxuICAgKiBIdHRwIHNlcnZlclxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgaHR0cFNlcnZlcjogbnVsbCxcblxuICAvKipcbiAgICogQXBwbGljYXRpb24gY29uZmlndXJhdGlvbiBpbmZvcm1hdGlvbi5cbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGFwcENvbmZpZzoge30sIC8vIGhvc3QgZW52IGNvbmZpZyBpbmZvcm1hdGlvbnMgKGRldiAvIHByb2QpXG5cbiAgLyoqXG4gICAqIEVudmlyb25tZW50IGNvbmZpZ3VyYXRpb24gaW5mb3JtYXRpb24gKGRldmVsb3BtZW50IC8gcHJvZHVjdGlvbikuXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBlbnZDb25maWc6IHt9LCAvLyBob3N0IGVudiBjb25maWcgaW5mb3JtYXRpb25zIChkZXYgLyBwcm9kKVxuXG4gIC8qKlxuICAgKiBPU0Mgb2JqZWN0LlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgb3NjOiBudWxsLFxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW2FwcENvbmZpZz17fV0gQXBwbGljYXRpb24gY29uZmlndXJhdGlvbiBvcHRpb25zLlxuICAgKiBAYXR0cmlidXRlIHtTdHJpbmd9IFthcHBDb25maWcucHVibGljRm9sZGVyPScuL3B1YmxpYyddIFBhdGggdG8gdGhlIHB1YmxpYyBmb2xkZXIuXG4gICAqIEBhdHRyaWJ1dGUge09iamVjdH0gW2FwcENvbmZpZy5zb2NrZXRJTz17fV0gc29ja2V0LmlvIG9wdGlvbnMuIFRoZSBzb2NrZXQuaW8gY29uZmlnIG9iamVjdCBjYW4gaGF2ZSB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gICAqIC0gYHRyYW5zcG9ydHM6U3RyaW5nYDogY29tbXVuaWNhdGlvbiB0cmFuc3BvcnQgKGRlZmF1bHRzIHRvIGAnd2Vic29ja2V0J2ApO1xuICAgKiAtIGBwaW5nVGltZW91dDpOdW1iZXJgOiB0aW1lb3V0IChpbiBtaWxsaXNlY29uZHMpIGJlZm9yZSB0cnlpbmcgdG8gcmVlc3RhYmxpc2ggYSBjb25uZWN0aW9uIGJldHdlZW4gYSBsb3N0IGNsaWVudCBhbmQgYSBzZXJ2ZXIgKGRlZmF1dGxzIHRvIGA2MDAwMGApO1xuICAgKiAtIGBwaW5nSW50ZXJ2YWw6TnVtYmVyYDogdGltZSBpbnRlcnZhbCAoaW4gbWlsbGlzZWNvbmRzKSB0byBzZW5kIGEgcGluZyB0byBhIGNsaWVudCB0byBjaGVjayB0aGUgY29ubmVjdGlvbiAoZGVmYXVsdHMgdG8gYDUwMDAwYCkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbZW52Q29uZmlnPXt9XSBFbnZpcm9ubWVudCBjb25maWd1cmF0aW9uIG9wdGlvbnMuXG4gICAqIEBhdHRyaWJ1dGUge051bWJlcn0gW2VudkNvbmZpZy5wb3J0PTgwMDBdIFBvcnQgb2YgdGhlIEhUVFAgc2VydmVyLlxuICAgKiBAYXR0cmlidXRlIHtPYmplY3R9IFtlbnZDb25maWcub3NjPXt9XSBPU0Mgb3B0aW9ucy4gVGhlIE9TQyBjb25maWcgb2JqZWN0IGNhbiBoYXZlIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAgICogLSBgbG9jYWxBZGRyZXNzOlN0cmluZ2A6IGFkZHJlc3Mgb2YgdGhlIGxvY2FsIG1hY2hpbmUgdG8gcmVjZWl2ZSBPU0MgbWVzc2FnZXMgKGRlZmF1bHRzIHRvIGAnMTI3LjAuMC4xJ2ApO1xuICAgKiAtIGBsb2NhbFBvcnQ6TnVtYmVyYDogcG9ydCBvZiB0aGUgbG9jYWwgbWFjaGluZSB0byByZWNlaXZlIE9TQyBtZXNzYWdlcyAoZGVmYXVsdHMgdG8gYDU3MTIxYCk7XG4gICAqIC0gYHJlbW90ZUFkZHJlc3M6U3RyaW5nYDogYWRkcmVzcyBvZiB0aGUgZGV2aWNlIHRvIHNlbmQgZGVmYXVsdCBPU0MgbWVzc2FnZXMgdG8gKGRlZmF1bHRzIHRvIGAnMTI3LjAuMC4xJ2ApO1xuICAgKiAtIGByZW1vdGVQb3J0Ok51bWJlcmA6IHBvcnQgb2YgdGhlIGRldmljZSB0byBzZW5kIGRlZmF1bHQgT1NDIG1lc3NhZ2VzIHRvIChkZWZhdWx0cyB0byBgNTcxMjBgKS5cbiAgICovXG4gIHN0YXJ0KGFwcENvbmZpZyA9IHt9LCBlbnZDb25maWcgPSB7fSkge1xuICAgIGFwcENvbmZpZyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgcHVibGljRm9sZGVyOiBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3B1YmxpYycpLFxuICAgICAgZGVmYXVsdENsaWVudDogJ3BsYXllcicsXG4gICAgICAvLyBAbm90ZTogRW5naW5lSU8gZGVmYXVsdHNcbiAgICAgIC8vIHRoaXMucGluZ1RpbWVvdXQgPSBvcHRzLnBpbmdUaW1lb3V0IHx8IDMwMDA7XG4gICAgICAvLyB0aGlzLnBpbmdJbnRlcnZhbCA9IG9wdHMucGluZ0ludGVydmFsIHx8IDEwMDA7XG4gICAgICAvLyB0aGlzLnVwZ3JhZGVUaW1lb3V0ID0gb3B0cy51cGdyYWRlVGltZW91dCB8fCAxMDAwMDtcbiAgICAgIC8vIHRoaXMubWF4SHR0cEJ1ZmZlclNpemUgPSBvcHRzLm1heEh0dHBCdWZmZXJTaXplIHx8IDEwRTc7XG4gICAgICBzb2NrZXRJTzoge1xuICAgICAgICB0cmFuc3BvcnRzOiBbJ3dlYnNvY2tldCddLFxuICAgICAgICBwaW5nVGltZW91dDogNjAwMDAsXG4gICAgICAgIHBpbmdJbnRlcnZhbDogNTAwMDBcbiAgICAgIH1cbiAgICB9LCBhcHBDb25maWcpO1xuXG4gICAgZW52Q29uZmlnID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICBwb3J0OiA4MDAwLFxuICAgICAgb3NjOiB7XG4gICAgICAgIGxvY2FsQWRkcmVzczogJzEyNy4wLjAuMScsXG4gICAgICAgIGxvY2FsUG9ydDogNTcxMjEsXG4gICAgICAgIHJlbW90ZUFkZHJlc3M6ICcxMjcuMC4wLjEnLFxuICAgICAgICByZW1vdGVQb3J0OiA1NzEyMFxuICAgICAgfVxuICAgIH0sIGVudkNvbmZpZyk7XG5cbiAgICB0aGlzLmVudkNvbmZpZyA9IGVudkNvbmZpZztcbiAgICB0aGlzLmFwcENvbmZpZyA9IGFwcENvbmZpZztcblxuICAgIC8vIGNvbmZpZ3VyZSBleHByZXNzIGFuZCBodHRwIHNlcnZlclxuICAgIGNvbnN0IGV4cHJlc3NBcHAgPSBuZXcgZXhwcmVzcygpO1xuICAgIGV4cHJlc3NBcHAuc2V0KCdwb3J0JywgcHJvY2Vzcy5lbnYuUE9SVCB8fCBlbnZDb25maWcucG9ydCk7XG4gICAgZXhwcmVzc0FwcC5zZXQoJ3ZpZXcgZW5naW5lJywgJ2VqcycpO1xuICAgIGV4cHJlc3NBcHAudXNlKGV4cHJlc3Muc3RhdGljKGFwcENvbmZpZy5wdWJsaWNGb2xkZXIpKTtcblxuICAgIGNvbnN0IGh0dHBTZXJ2ZXIgPSBodHRwLmNyZWF0ZVNlcnZlcihleHByZXNzQXBwKTtcbiAgICBodHRwU2VydmVyLmxpc3RlbihleHByZXNzQXBwLmdldCgncG9ydCcpLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHVybCA9IGBodHRwOi8vMTI3LjAuMC4xOiR7ZXhwcmVzc0FwcC5nZXQoJ3BvcnQnKX1gO1xuICAgICAgY29uc29sZS5sb2coJ1tIVFRQIFNFUlZFUl0gU2VydmVyIGxpc3RlbmluZyBvbicsIHVybCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmV4cHJlc3NBcHAgPSBleHByZXNzQXBwO1xuICAgIHRoaXMuaHR0cFNlcnZlciA9IGh0dHBTZXJ2ZXI7XG5cbiAgICAvLyBjb25maWd1cmUgc29ja2V0LmlvXG4gICAgdGhpcy5pbyA9IG5ldyBJTyhodHRwU2VydmVyLCBhcHBDb25maWcuc29ja2V0SU8pO1xuICAgIGNvbW0uaW5pdGlhbGl6ZSh0aGlzLmlvKTtcblxuICAgIC8vIGNvbmZpZ3VyZSBPU0NcbiAgICBpZiAoZW52Q29uZmlnLm9zYykge1xuICAgICAgdGhpcy5vc2MgPSBuZXcgb3NjLlVEUFBvcnQoe1xuICAgICAgICAvLyBUaGlzIGlzIHRoZSBwb3J0IHdlJ3JlIGxpc3RlbmluZyBvbi5cbiAgICAgICAgLy8gQG5vdGUgcmVuYW1lIHRvIHJlY2VpdmVBZGRyZXNzIC8gcmVjZWl2ZVBvcnRcbiAgICAgICAgbG9jYWxBZGRyZXNzOiBlbnZDb25maWcub3NjLmxvY2FsQWRkcmVzcyxcbiAgICAgICAgbG9jYWxQb3J0OiBlbnZDb25maWcub3NjLmxvY2FsUG9ydCxcbiAgICAgICAgLy8gVGhpcyBpcyB0aGUgcG9ydCB3ZSB1c2UgdG8gc2VuZCBtZXNzYWdlcy5cbiAgICAgICAgLy8gQG5vdGUgcmVuYW1lIHRvIHNlbmRBZGRyZXNzIC8gc2VuZFBvcnRcbiAgICAgICAgcmVtb3RlQWRkcmVzczogZW52Q29uZmlnLm9zYy5yZW1vdGVBZGRyZXNzLFxuICAgICAgICByZW1vdGVQb3J0OiBlbnZDb25maWcub3NjLnJlbW90ZVBvcnQsXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5vc2Mub24oJ3JlYWR5JywgKCkgPT4ge1xuICAgICAgICBjb25zdCByZWNlaXZlID0gYCR7ZW52Q29uZmlnLm9zYy5sb2NhbEFkZHJlc3N9OiR7ZW52Q29uZmlnLm9zYy5sb2NhbFBvcnR9YDtcbiAgICAgICAgY29uc3Qgc2VuZCA9IGAke2VudkNvbmZpZy5vc2MucmVtb3RlQWRkcmVzc306JHtlbnZDb25maWcub3NjLnJlbW90ZVBvcnR9YDtcbiAgICAgICAgY29uc29sZS5sb2coYFtPU0Mgb3ZlciBVRFBdIFJlY2VpdmluZyBvbiAke3JlY2VpdmV9YCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGBbT1NDIG92ZXIgVURQXSBTZW5kaW5nIG9uICR7c2VuZH1gKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm9zYy5vbignbWVzc2FnZScsIChvc2NNc2cpID0+IHtcbiAgICAgICAgY29uc3QgYWRkcmVzcyA9IG9zY01zZy5hZGRyZXNzO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3NjTGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGFkZHJlc3MgPT09IG9zY0xpc3RlbmVyc1tpXS53aWxkY2FyZClcbiAgICAgICAgICAgIG9zY0xpc3RlbmVyc1tpXS5jYWxsYmFjayhvc2NNc2cpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5vc2Mub3BlbigpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogSW5kaWNhdGUgdGhhdCB0aGUgY2xpZW50cyBvZiB0eXBlIGBjbGllbnRUeXBlYCByZXF1aXJlIHRoZSBtb2R1bGVzIGAuLi5tb2R1bGVzYCBvbiB0aGUgc2VydmVyIHNpZGUuXG4gICAqIEFkZGl0aW9uYWxseSwgdGhpcyBtZXRob2Qgcm91dGVzIHRoZSBjb25uZWN0aW9ucyBmcm9tIHRoZSBjb3JyZXNwb25kaW5nIFVSTCB0byB0aGUgY29ycmVzcG9uZGluZyB2aWV3LlxuICAgKiBNb3JlIHNwZWNpZmljYWxseTpcbiAgICogLSBBIGNsaWVudCBjb25uZWN0aW5nIHRvIHRoZSBzZXJ2ZXIgdGhyb3VnaCB0aGUgcm9vdCBVUkwgYGh0dHA6Ly9teS5zZXJ2ZXIuYWRkcmVzczpwb3J0L2AgaXMgY29uc2lkZXJlZCBhcyBhIGAncGxheWVyJ2AgY2xpZW50IGFuZCBkaXNwbGF5cyB0aGUgdmlldyBgcGxheWVyLmVqc2A7XG4gICAqIC0gQSBjbGllbnQgY29ubmVjdGluZyB0byB0aGUgc2VydmVyIHRocm91Z2ggdGhlIFVSTCBgaHR0cDovL215LnNlcnZlci5hZGRyZXNzOnBvcnQvY2xpZW50VHlwZWAgaXMgY29uc2lkZXJlZCBhcyBhIGBjbGllbnRUeXBlYCBjbGllbnQsIGFuZCBkaXNwbGF5cyB0aGUgdmlldyBgY2xpZW50VHlwZS5lanNgLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2xpZW50VHlwZSBDbGllbnQgdHlwZSAoYXMgZGVmaW5lZCBieSB0aGUgbWV0aG9kIHtAbGluayBjbGllbnQuaW5pdH0gb24gdGhlIGNsaWVudCBzaWRlKS5cbiAgICogQHBhcmFtIHsuLi5DbGllbnRNb2R1bGV9IG1vZHVsZXMgTW9kdWxlcyB0byBtYXAgdG8gdGhhdCBjbGllbnQgdHlwZS5cbiAgICovXG4gIG1hcChjbGllbnRUeXBlLCAuLi5tb2R1bGVzKSB7XG4gICAgbGV0IHVybCA9ICcvJztcblxuICAgIC8vIGNhY2hlIGNvbXBpbGVkIHRlbXBsYXRlXG4gICAgY29uc3QgdG1wbFBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3ZpZXdzJywgY2xpZW50VHlwZSArICcuZWpzJyk7XG4gICAgY29uc3QgdG1wbFN0cmluZyA9IGZzLnJlYWRGaWxlU3luYyh0bXBsUGF0aCwgeyBlbmNvZGluZzogJ3V0ZjgnIH0pO1xuICAgIGNvbnN0IHRtcGwgPSBlanMuY29tcGlsZSh0bXBsU3RyaW5nKTtcblxuICAgIGlmIChjbGllbnRUeXBlICE9PSB0aGlzLmFwcENvbmZpZy5kZWZhdWx0Q2xpZW50KSB7IHVybCArPSBjbGllbnRUeXBlOyB9XG5cbiAgICAvL1xuICAgIHRoaXMuZXhwcmVzc0FwcC5nZXQodXJsLCAocmVxLCByZXMpID0+IHtcbiAgICAgIHJlcy5zZW5kKHRtcGwoeyBlbnZDb25maWc6IEpTT04uc3RyaW5naWZ5KHRoaXMuZW52Q29uZmlnKSB9KSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmlvLm9mKGNsaWVudFR5cGUpLm9uKCdjb25uZWN0aW9uJywgKHNvY2tldCkgPT4ge1xuICAgICAgY29uc3QgY2xpZW50ID0gbmV3IENsaWVudChjbGllbnRUeXBlLCBzb2NrZXQpO1xuICAgICAgY2xpZW50LmluZGV4ID0gX2dldENsaWVudEluZGV4KCk7XG5cbiAgICAgIG1vZHVsZXMuZm9yRWFjaCgobW9kKSA9PiB7IG1vZC5jb25uZWN0KGNsaWVudCkgfSk7XG5cbiAgICAgIC8vIEB0b2RvIC0gaGlkZSB0aGlzIGludG8gdGhlIGNsaWVudCA/XG4gICAgICAvLyBnbG9iYWwgZXZlbnRzIGZvciB0aGUgY2xpZW50XG4gICAgICBjb21tLnJlY2VpdmUoY2xpZW50LCAnZGlzY29ubmVjdCcsICgpID0+IHtcbiAgICAgICAgLy8gcHJvYmxlbSBoZXJlIGZvciBoaWRlIGludG8gY2xpZW50c1xuICAgICAgICBtb2R1bGVzLmZvckVhY2goKG1vZCkgPT4geyBtb2QuZGlzY29ubmVjdChjbGllbnQpIH0pO1xuXG4gICAgICAgIF9yZWxlYXNlQ2xpZW50SW5kZXgoY2xpZW50LmluZGV4KTtcbiAgICAgICAgY2xpZW50LmluZGV4ID0gLTE7XG5cbiAgICAgICAgbG9nLmluZm8oeyBzb2NrZXQ6IHNvY2tldCwgY2xpZW50VHlwZTogY2xpZW50VHlwZSB9LCAnZGlzY29ubmVjdCcpO1xuICAgICAgfSk7XG5cbiAgICAgIGNvbW0uc2VuZChjbGllbnQsICdjbGllbnQ6c3RhcnQnLCBjbGllbnQuaW5kZXgpOyAvLyB0aGUgc2VydmVyIGlzIHJlYWR5XG5cbiAgICAgIGxvZy5pbmZvKHsgc29ja2V0OiBzb2NrZXQsIGNsaWVudFR5cGU6IGNsaWVudFR5cGUgfSwgJ2Nvbm5lY3Rpb24nKTtcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogU2VuZCBhIFdlYlNvY2tldCBtZXNzYWdlIHRvIGFsbCB0aGUgY2xpZW50cyBvZiB0eXBlIGBjbGllbnRUeXBlYC5cbiAgICpcbiAgICogKipOb3RlOioqIG9uIHRoZSBjbGllbnQgc2lkZSwgdGhlIGNsaWVudHMgcmVjZWl2ZSB0aGUgbWVzc2FnZSB3aXRoIHRoZSBtZXRob2Qge0BsaW5rIGNsaWVudC5yZWNlaXZlfS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNsaWVudFR5cGUgQ2xpZW50IHR5cGUgKGFzIGRlZmluZWQgYnkgdGhlIG1ldGhvZCB7QGxpbmsgY2xpZW50LmluaXR9IG9uIHRoZSBjbGllbnQgc2lkZSkuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBtc2cgTmFtZSBvZiB0aGUgbWVzc2FnZSB0byBzZW5kLlxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuICAgKiBAdG9kbyBzb2x2ZSAuLi4gcHJvYmxlbVxuICAgKi9cbiAgLy8gYnJvYWRjYXN0KGNsaWVudFR5cGUsIG1zZywgLi4uYXJncykge1xuICAvLyAgIHRoaXMuaW8ub2YoJy8nICsgY2xpZW50VHlwZSkuZW1pdChtc2csIC4uLmFyZ3MpO1xuICAvLyAgIGxvZy5pbmZvKHsgY2xpZW50VHlwZTogY2xpZW50VHlwZSwgY2hhbm5lbDogbXNnLCBhcmd1bWVudHM6IGFyZ3MgfSwgJ2Jyb2FkY2FzdCcpO1xuICAvLyB9LFxuXG4gIC8qKlxuICAgKiBTZW5kIGFuIE9TQyBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gd2lsZGNhcmQgV2lsZGNhcmQgb2YgdGhlIE9TQyBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge0FycmF5fSBhcmdzIEFyZ3VtZW50cyBvZiB0aGUgT1NDIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbdXJsPW51bGxdIFVSTCB0byBzZW5kIHRoZSBPU0MgbWVzc2FnZSB0byAoaWYgbm90IHNwZWNpZmllZCwgdXNlcyB0aGUgYWRkcmVzcyBkZWZpbmVkIGluIHRoZSBPU0MgY29uZmlnIG9yIGluIHRoZSBvcHRpb25zIG9mIHRoZSB7QGxpbmsgc2VydmVyLnN0YXJ0fSBtZXRob2QpLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW3BvcnQ9bnVsbF0gUG9ydCB0byBzZW5kIHRoZSBtZXNzYWdlIHRvIChpZiBub3Qgc3BlY2lmaWVkLCB1c2VzIHRoZSBwb3J0IGRlZmluZWQgaW4gdGhlIE9TQyBjb25maWcgb3IgaW4gdGhlIG9wdGlvbnMgb2YgdGhlIHtAbGluayBzZXJ2ZXIuc3RhcnR9IG1ldGhvZCkuXG4gICAqL1xuICBzZW5kT1NDKHdpbGRjYXJkLCBhcmdzLCB1cmwgPSBudWxsLCBwb3J0ID0gbnVsbCkge1xuICAgIGNvbnN0IG9zY01zZyA9IHtcbiAgICAgIGFkZHJlc3M6IHdpbGRjYXJkLFxuICAgICAgYXJnczogYXJnc1xuICAgIH07XG5cbiAgICB0cnkge1xuICAgICAgaWYgKHVybCAmJiBwb3J0KSB7XG4gICAgICAgIHRoaXMub3NjLnNlbmQob3NjTXNnLCB1cmwsIHBvcnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vc2Muc2VuZChvc2NNc2cpOyAvLyB1c2UgZGVmYXVsdHMgKGFzIGRlZmluZWQgaW4gdGhlIGNvbmZpZylcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZygnRXJyb3Igd2hpbGUgc2VuZGluZyBPU0MgbWVzc2FnZTonLCBlKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIExpc3RlbiBmb3IgT1NDIG1lc3NhZ2UgYW5kIGV4ZWN1dGUgYSBjYWxsYmFjayBmdW5jdGlvbi5cbiAgICogVGhlIHNlcnZlciBsaXN0ZW5zIHRvIE9TQyBtZXNzYWdlcyBhdCB0aGUgYWRkcmVzcyBhbmQgcG9ydCBkZWZpbmVkIGluIHRoZSBjb25maWcgb3IgaW4gdGhlIG9wdGlvbnMgb2YgdGhlIHtAbGluayBzZXJ2ZXIuc3RhcnR9IG1ldGhvZC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHdpbGRjYXJkIFdpbGRjYXJkIG9mIHRoZSBPU0MgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGJhY2sgZnVuY3Rpb24gZXhlY3V0ZWQgd2hlbiB0aGUgT1NDIG1lc3NhZ2UgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICByZWNlaXZlT1NDKHdpbGRjYXJkLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG9zY0xpc3RlbmVyID0ge1xuICAgICAgd2lsZGNhcmQ6IHdpbGRjYXJkLFxuICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gICAgfTtcblxuICAgIG9zY0xpc3RlbmVycy5wdXNoKG9zY0xpc3RlbmVyKTtcbiAgfVxufTtcblxuIl19