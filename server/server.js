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

var defaultAppConfig = {
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
};

var defaultEnvConfig = {
  port: 8000,
  osc: {
    localAddress: '127.0.0.1',
    localPort: 57121,
    remoteAddress: '127.0.0.1',
    remotePort: 57120
  },
  logger: {
    name: 'soundworks',
    level: 'info',
    streams: [{
      level: 'info',
      stream: process.stdout
    }]
  }
};

/**
 * The `server` object contains the basic methods of the server.
 * For instance, this object allows setting up, configuring and starting the server with the method `start` while the method `map` allows for managing the mapping between different types of clients and their required server modules.
 * Additionally, the method `broadcast` allows to send messages to all connected clients via WebSockets or OSC.
 * @type {Object}
 */

// {
//   level: 'info',
//   path: path.join(process.cwd(), 'logs', 'soundworks.log'),
// }
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

    appConfig = _Object$assign(defaultAppConfig, appConfig);
    envConfig = _Object$assign(defaultEnvConfig, envConfig);
    this.appConfig = appConfig;
    this.envConfig = envConfig;

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

    this.io = new _socketIo2['default'](httpServer, appConfig.socketIO);
    _comm2['default'].initialize(this.io);
    _logger2['default'].initialize(envConfig.logger);

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

    var url = clientType !== this.appConfig.defaultClient ? '/' + clientType : '/';
    // cache compiled template
    var tmplPath = _path2['default'].join(process.cwd(), 'views', clientType + '.ejs');
    var tmplString = _fs2['default'].readFileSync(tmplPath, { encoding: 'utf8' });
    var tmpl = _ejs2['default'].compile(tmplString);

    // @todo refactor
    // write env config into templates
    this.expressApp.get(url, function (req, res) {
      var envConfigCopy = _Object$assign({}, _this.envConfig);
      // remove logger configuration
      envConfigCopy.logger = undefined;
      res.send(tmpl({ envConfig: JSON.stringify(envConfigCopy) }));
    });

    modules.forEach(function (mod) {
      mod.configure(_this.appConfig, _this.envConfig);
    });

    this.io.of(clientType).on('connection', function (socket) {
      var client = new _Client2['default'](clientType, socket);
      modules.forEach(function (mod) {
        mod.connect(client);
      });

      // global lifecycle of the client
      _comm2['default'].receive(client, 'disconnect', function () {
        modules.forEach(function (mod) {
          mod.disconnect(client);
        });
        client.destroy();
        _logger2['default'].info({ socket: socket, clientType: clientType }, 'disconnect');
      });

      _comm2['default'].send(client, 'client:start', client.index); // the server is ready
      _logger2['default'].info({ socket: socket, clientType: clientType }, 'connection');
    });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvc2VydmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBQWlCLFFBQVE7Ozs7bUJBQ1QsS0FBSzs7Ozt1QkFDRCxTQUFTOzs7O2tCQUNkLElBQUk7Ozs7b0JBQ0YsTUFBTTs7OztzQkFDSixVQUFVOzs7O3dCQUNkLFdBQVc7Ozs7bUJBQ1YsS0FBSzs7OztvQkFDSixNQUFNOzs7O3NCQUNKLFVBQVU7Ozs7Ozs7QUFLN0IsSUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDOztBQUV4QixJQUFNLGdCQUFnQixHQUFHO0FBQ3ZCLGNBQVksRUFBRSxrQkFBSyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLFFBQVEsQ0FBQztBQUNoRCxlQUFhLEVBQUUsUUFBUTs7Ozs7O0FBTXZCLFVBQVEsRUFBRTtBQUNSLGNBQVUsRUFBRSxDQUFDLFdBQVcsQ0FBQztBQUN6QixlQUFXLEVBQUUsS0FBSztBQUNsQixnQkFBWSxFQUFFLEtBQUs7R0FDcEI7Q0FDRixDQUFDOztBQUVGLElBQU0sZ0JBQWdCLEdBQUc7QUFDdkIsTUFBSSxFQUFFLElBQUk7QUFDVixLQUFHLEVBQUU7QUFDSCxnQkFBWSxFQUFFLFdBQVc7QUFDekIsYUFBUyxFQUFFLEtBQUs7QUFDaEIsaUJBQWEsRUFBRSxXQUFXO0FBQzFCLGNBQVUsRUFBRSxLQUFLO0dBQ2xCO0FBQ0QsUUFBTSxFQUFFO0FBQ04sUUFBSSxFQUFFLFlBQVk7QUFDbEIsU0FBSyxFQUFFLE1BQU07QUFDYixXQUFPLEVBQUUsQ0FDUDtBQUNFLFdBQUssRUFBRSxNQUFNO0FBQ2IsWUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNO0tBQ3ZCLENBS0Y7R0FDRjtDQUNGLENBQUM7Ozs7Ozs7Ozs7Ozs7cUJBUWE7Ozs7Ozs7QUFPYixJQUFFLEVBQUUsSUFBSTs7Ozs7O0FBTVIsWUFBVSxFQUFFLElBQUk7Ozs7O0FBS2hCLFlBQVUsRUFBRSxJQUFJOzs7Ozs7O0FBT2hCLFdBQVMsRUFBRSxFQUFF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Q2pCLFVBQUksRUFBRSxJQUFJO0tBQ1gsQ0FBQzs7QUFFRixRQUFJO0FBQ0YsVUFBSSxHQUFHLElBQUksSUFBSSxFQUFFO0FBQ2YsWUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztPQUNsQyxNQUFNO0FBQ0wsWUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7T0FDdkI7S0FDRixDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ1YsYUFBTyxDQUFDLEdBQUcsQ0FBQyxrQ0FBa0MsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUNwRDtHQUNGOzs7Ozs7Ozs7QUFTRCxZQUFVLEVBQUEsb0JBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRTtBQUM3QixRQUFNLFdBQVcsR0FBRztBQUNsQixjQUFRLEVBQUUsUUFBUTtBQUNsQixjQUFRLEVBQUUsUUFBUTtLQUNuQixDQUFDOztBQUVGLGdCQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0dBQ2hDO0NBQ0YiLCJmaWxlIjoic3JjL3NlcnZlci9zZXJ2ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY29tbSBmcm9tICcuL2NvbW0nO1xuaW1wb3J0IGVqcyBmcm9tICdlanMnO1xuaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IGh0dHAgZnJvbSAnaHR0cCc7XG5pbXBvcnQgbG9nZ2VyIGZyb20gJy4vbG9nZ2VyJztcbmltcG9ydCBJTyBmcm9tICdzb2NrZXQuaW8nO1xuaW1wb3J0IG9zYyBmcm9tICdvc2MnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgQ2xpZW50IGZyb20gJy4vQ2xpZW50JztcblxuLy8gZ2xvYmFsc1xuLy8gQHRvZG8gaGlkZSB0aGlzIGludG8gY2xpZW50XG5cbmNvbnN0IG9zY0xpc3RlbmVycyA9IFtdO1xuXG5jb25zdCBkZWZhdWx0QXBwQ29uZmlnID0ge1xuICBwdWJsaWNGb2xkZXI6IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAncHVibGljJyksXG4gIGRlZmF1bHRDbGllbnQ6ICdwbGF5ZXInLFxuICAvLyBAbm90ZTogRW5naW5lSU8gZGVmYXVsdHNcbiAgLy8gdGhpcy5waW5nVGltZW91dCA9IG9wdHMucGluZ1RpbWVvdXQgfHwgMzAwMDtcbiAgLy8gdGhpcy5waW5nSW50ZXJ2YWwgPSBvcHRzLnBpbmdJbnRlcnZhbCB8fCAxMDAwO1xuICAvLyB0aGlzLnVwZ3JhZGVUaW1lb3V0ID0gb3B0cy51cGdyYWRlVGltZW91dCB8fCAxMDAwMDtcbiAgLy8gdGhpcy5tYXhIdHRwQnVmZmVyU2l6ZSA9IG9wdHMubWF4SHR0cEJ1ZmZlclNpemUgfHwgMTBFNztcbiAgc29ja2V0SU86IHtcbiAgICB0cmFuc3BvcnRzOiBbJ3dlYnNvY2tldCddLFxuICAgIHBpbmdUaW1lb3V0OiA2MDAwMCxcbiAgICBwaW5nSW50ZXJ2YWw6IDUwMDAwXG4gIH1cbn07XG5cbmNvbnN0IGRlZmF1bHRFbnZDb25maWcgPSB7XG4gIHBvcnQ6IDgwMDAsXG4gIG9zYzoge1xuICAgIGxvY2FsQWRkcmVzczogJzEyNy4wLjAuMScsXG4gICAgbG9jYWxQb3J0OiA1NzEyMSxcbiAgICByZW1vdGVBZGRyZXNzOiAnMTI3LjAuMC4xJyxcbiAgICByZW1vdGVQb3J0OiA1NzEyMFxuICB9LFxuICBsb2dnZXI6IHtcbiAgICBuYW1lOiAnc291bmR3b3JrcycsXG4gICAgbGV2ZWw6ICdpbmZvJyxcbiAgICBzdHJlYW1zOiBbXG4gICAgICB7XG4gICAgICAgIGxldmVsOiAnaW5mbycsXG4gICAgICAgIHN0cmVhbTogcHJvY2Vzcy5zdGRvdXQsXG4gICAgICB9LFxuICAgICAgLy8ge1xuICAgICAgLy8gICBsZXZlbDogJ2luZm8nLFxuICAgICAgLy8gICBwYXRoOiBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ2xvZ3MnLCAnc291bmR3b3Jrcy5sb2cnKSxcbiAgICAgIC8vIH1cbiAgICBdXG4gIH1cbn07XG5cbi8qKlxuICogVGhlIGBzZXJ2ZXJgIG9iamVjdCBjb250YWlucyB0aGUgYmFzaWMgbWV0aG9kcyBvZiB0aGUgc2VydmVyLlxuICogRm9yIGluc3RhbmNlLCB0aGlzIG9iamVjdCBhbGxvd3Mgc2V0dGluZyB1cCwgY29uZmlndXJpbmcgYW5kIHN0YXJ0aW5nIHRoZSBzZXJ2ZXIgd2l0aCB0aGUgbWV0aG9kIGBzdGFydGAgd2hpbGUgdGhlIG1ldGhvZCBgbWFwYCBhbGxvd3MgZm9yIG1hbmFnaW5nIHRoZSBtYXBwaW5nIGJldHdlZW4gZGlmZmVyZW50IHR5cGVzIG9mIGNsaWVudHMgYW5kIHRoZWlyIHJlcXVpcmVkIHNlcnZlciBtb2R1bGVzLlxuICogQWRkaXRpb25hbGx5LCB0aGUgbWV0aG9kIGBicm9hZGNhc3RgIGFsbG93cyB0byBzZW5kIG1lc3NhZ2VzIHRvIGFsbCBjb25uZWN0ZWQgY2xpZW50cyB2aWEgV2ViU29ja2V0cyBvciBPU0MuXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5leHBvcnQgZGVmYXVsdCB7XG5cbiAgLyoqXG4gICAqIFdlYlNvY2tldCBzZXJ2ZXIuXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBpbzogbnVsbCxcblxuICAvKipcbiAgICogRXhwcmVzcyBhcHBsaWNhdGlvblxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgZXhwcmVzc0FwcDogbnVsbCxcbiAgLyoqXG4gICAqIEh0dHAgc2VydmVyXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xuICBodHRwU2VydmVyOiBudWxsLFxuXG4gIC8qKlxuICAgKiBBcHBsaWNhdGlvbiBjb25maWd1cmF0aW9uIGluZm9ybWF0aW9uLlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgYXBwQ29uZmlnOiB7fSwgLy8gaG9zdCBlbnYgY29uZmlnIGluZm9ybWF0aW9ucyAoZGV2IC8gcHJvZClcblxuICAvKipcbiAgICogRW52aXJvbm1lbnQgY29uZmlndXJhdGlvbiBpbmZvcm1hdGlvbiAoZGV2ZWxvcG1lbnQgLyBwcm9kdWN0aW9uKS5cbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGVudkNvbmZpZzoge30sIC8vIGhvc3QgZW52IGNvbmZpZyBpbmZvcm1hdGlvbnMgKGRldiAvIHByb2QpXG5cbiAgLyoqXG4gICAqIE9TQyBvYmplY3QuXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBvc2M6IG51bGwsXG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbYXBwQ29uZmlnPXt9XSBBcHBsaWNhdGlvbiBjb25maWd1cmF0aW9uIG9wdGlvbnMuXG4gICAqIEBhdHRyaWJ1dGUge1N0cmluZ30gW2FwcENvbmZpZy5wdWJsaWNGb2xkZXI9Jy4vcHVibGljJ10gUGF0aCB0byB0aGUgcHVibGljIGZvbGRlci5cbiAgICogQGF0dHJpYnV0ZSB7T2JqZWN0fSBbYXBwQ29uZmlnLnNvY2tldElPPXt9XSBzb2NrZXQuaW8gb3B0aW9ucy4gVGhlIHNvY2tldC5pbyBjb25maWcgb2JqZWN0IGNhbiBoYXZlIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAgICogLSBgdHJhbnNwb3J0czpTdHJpbmdgOiBjb21tdW5pY2F0aW9uIHRyYW5zcG9ydCAoZGVmYXVsdHMgdG8gYCd3ZWJzb2NrZXQnYCk7XG4gICAqIC0gYHBpbmdUaW1lb3V0Ok51bWJlcmA6IHRpbWVvdXQgKGluIG1pbGxpc2Vjb25kcykgYmVmb3JlIHRyeWluZyB0byByZWVzdGFibGlzaCBhIGNvbm5lY3Rpb24gYmV0d2VlbiBhIGxvc3QgY2xpZW50IGFuZCBhIHNlcnZlciAoZGVmYXV0bHMgdG8gYDYwMDAwYCk7XG4gICAqIC0gYHBpbmdJbnRlcnZhbDpOdW1iZXJgOiB0aW1lIGludGVydmFsIChpbiBtaWxsaXNlY29uZHMpIHRvIHNlbmQgYSBwaW5nIHRvIGEgY2xpZW50IHRvIGNoZWNrIHRoZSBjb25uZWN0aW9uIChkZWZhdWx0cyB0byBgNTAwMDBgKS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtlbnZDb25maWc9e31dIEVudmlyb25tZW50IGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAgICogQGF0dHJpYnV0ZSB7TnVtYmVyfSBbZW52Q29uZmlnLnBvcnQ9ODAwMF0gUG9ydCBvZiB0aGUgSFRUUCBzZXJ2ZXIuXG4gICAqIEBhdHRyaWJ1dGUge09iamVjdH0gW2VudkNvbmZpZy5vc2M9e31dIE9TQyBvcHRpb25zLiBUaGUgT1NDIGNvbmZpZyBvYmplY3QgY2FuIGhhdmUgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICAgKiAtIGBsb2NhbEFkZHJlc3M6U3RyaW5nYDogYWRkcmVzcyBvZiB0aGUgbG9jYWwgbWFjaGluZSB0byByZWNlaXZlIE9TQyBtZXNzYWdlcyAoZGVmYXVsdHMgdG8gYCcxMjcuMC4wLjEnYCk7XG4gICAqIC0gYGxvY2FsUG9ydDpOdW1iZXJgOiBwb3J0IG9mIHRoZSBsb2NhbCBtYWNoaW5lIHRvIHJlY2VpdmUgT1NDIG1lc3NhZ2VzIChkZWZhdWx0cyB0byBgNTcxMjFgKTtcbiAgICogLSBgcmVtb3RlQWRkcmVzczpTdHJpbmdgOiBhZGRyZXNzIG9mIHRoZSBkZXZpY2UgdG8gc2VuZCBkZWZhdWx0IE9TQyBtZXNzYWdlcyB0byAoZGVmYXVsdHMgdG8gYCcxMjcuMC4wLjEnYCk7XG4gICAqIC0gYHJlbW90ZVBvcnQ6TnVtYmVyYDogcG9ydCBvZiB0aGUgZGV2aWNlIHRvIHNlbmQgZGVmYXVsdCBPU0MgbWVzc2FnZXMgdG8gKGRlZmF1bHRzIHRvIGA1NzEyMGApLlxuICAgKi9cbiAgc3RhcnQoYXBwQ29uZmlnID0ge30sIGVudkNvbmZpZyA9IHt9KSB7XG4gICAgYXBwQ29uZmlnID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0QXBwQ29uZmlnLCBhcHBDb25maWcpO1xuICAgIGVudkNvbmZpZyA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdEVudkNvbmZpZywgZW52Q29uZmlnKTtcbiAgICB0aGlzLmFwcENvbmZpZyA9IGFwcENvbmZpZztcbiAgICB0aGlzLmVudkNvbmZpZyA9IGVudkNvbmZpZztcblxuICAgIC8vIGNvbmZpZ3VyZSBleHByZXNzIGFuZCBodHRwIHNlcnZlclxuICAgIGNvbnN0IGV4cHJlc3NBcHAgPSBuZXcgZXhwcmVzcygpO1xuICAgIGV4cHJlc3NBcHAuc2V0KCdwb3J0JywgcHJvY2Vzcy5lbnYuUE9SVCB8fCBlbnZDb25maWcucG9ydCk7XG4gICAgZXhwcmVzc0FwcC5zZXQoJ3ZpZXcgZW5naW5lJywgJ2VqcycpO1xuICAgIGV4cHJlc3NBcHAudXNlKGV4cHJlc3Muc3RhdGljKGFwcENvbmZpZy5wdWJsaWNGb2xkZXIpKTtcblxuICAgIGNvbnN0IGh0dHBTZXJ2ZXIgPSBodHRwLmNyZWF0ZVNlcnZlcihleHByZXNzQXBwKTtcbiAgICBodHRwU2VydmVyLmxpc3RlbihleHByZXNzQXBwLmdldCgncG9ydCcpLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHVybCA9IGBodHRwOi8vMTI3LjAuMC4xOiR7ZXhwcmVzc0FwcC5nZXQoJ3BvcnQnKX1gO1xuICAgICAgY29uc29sZS5sb2coJ1tIVFRQIFNFUlZFUl0gU2VydmVyIGxpc3RlbmluZyBvbicsIHVybCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmV4cHJlc3NBcHAgPSBleHByZXNzQXBwO1xuICAgIHRoaXMuaHR0cFNlcnZlciA9IGh0dHBTZXJ2ZXI7XG5cbiAgICB0aGlzLmlvID0gbmV3IElPKGh0dHBTZXJ2ZXIsIGFwcENvbmZpZy5zb2NrZXRJTyk7XG4gICAgY29tbS5pbml0aWFsaXplKHRoaXMuaW8pO1xuICAgIGxvZ2dlci5pbml0aWFsaXplKGVudkNvbmZpZy5sb2dnZXIpO1xuXG4gICAgLy8gY29uZmlndXJlIE9TQ1xuICAgIGlmIChlbnZDb25maWcub3NjKSB7XG4gICAgICB0aGlzLm9zYyA9IG5ldyBvc2MuVURQUG9ydCh7XG4gICAgICAgIC8vIFRoaXMgaXMgdGhlIHBvcnQgd2UncmUgbGlzdGVuaW5nIG9uLlxuICAgICAgICAvLyBAbm90ZSByZW5hbWUgdG8gcmVjZWl2ZUFkZHJlc3MgLyByZWNlaXZlUG9ydFxuICAgICAgICBsb2NhbEFkZHJlc3M6IGVudkNvbmZpZy5vc2MubG9jYWxBZGRyZXNzLFxuICAgICAgICBsb2NhbFBvcnQ6IGVudkNvbmZpZy5vc2MubG9jYWxQb3J0LFxuICAgICAgICAvLyBUaGlzIGlzIHRoZSBwb3J0IHdlIHVzZSB0byBzZW5kIG1lc3NhZ2VzLlxuICAgICAgICAvLyBAbm90ZSByZW5hbWUgdG8gc2VuZEFkZHJlc3MgLyBzZW5kUG9ydFxuICAgICAgICByZW1vdGVBZGRyZXNzOiBlbnZDb25maWcub3NjLnJlbW90ZUFkZHJlc3MsXG4gICAgICAgIHJlbW90ZVBvcnQ6IGVudkNvbmZpZy5vc2MucmVtb3RlUG9ydCxcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm9zYy5vbigncmVhZHknLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlY2VpdmUgPSBgJHtlbnZDb25maWcub3NjLmxvY2FsQWRkcmVzc306JHtlbnZDb25maWcub3NjLmxvY2FsUG9ydH1gO1xuICAgICAgICBjb25zdCBzZW5kID0gYCR7ZW52Q29uZmlnLm9zYy5yZW1vdGVBZGRyZXNzfToke2VudkNvbmZpZy5vc2MucmVtb3RlUG9ydH1gO1xuICAgICAgICBjb25zb2xlLmxvZyhgW09TQyBvdmVyIFVEUF0gUmVjZWl2aW5nIG9uICR7cmVjZWl2ZX1gKTtcbiAgICAgICAgY29uc29sZS5sb2coYFtPU0Mgb3ZlciBVRFBdIFNlbmRpbmcgb24gJHtzZW5kfWApO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMub3NjLm9uKCdtZXNzYWdlJywgKG9zY01zZykgPT4ge1xuICAgICAgICBjb25zdCBhZGRyZXNzID0gb3NjTXNnLmFkZHJlc3M7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvc2NMaXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAoYWRkcmVzcyA9PT0gb3NjTGlzdGVuZXJzW2ldLndpbGRjYXJkKVxuICAgICAgICAgICAgb3NjTGlzdGVuZXJzW2ldLmNhbGxiYWNrKG9zY01zZyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm9zYy5vcGVuKCk7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZSB0aGF0IHRoZSBjbGllbnRzIG9mIHR5cGUgYGNsaWVudFR5cGVgIHJlcXVpcmUgdGhlIG1vZHVsZXMgYC4uLm1vZHVsZXNgIG9uIHRoZSBzZXJ2ZXIgc2lkZS5cbiAgICogQWRkaXRpb25hbGx5LCB0aGlzIG1ldGhvZCByb3V0ZXMgdGhlIGNvbm5lY3Rpb25zIGZyb20gdGhlIGNvcnJlc3BvbmRpbmcgVVJMIHRvIHRoZSBjb3JyZXNwb25kaW5nIHZpZXcuXG4gICAqIE1vcmUgc3BlY2lmaWNhbGx5OlxuICAgKiAtIEEgY2xpZW50IGNvbm5lY3RpbmcgdG8gdGhlIHNlcnZlciB0aHJvdWdoIHRoZSByb290IFVSTCBgaHR0cDovL215LnNlcnZlci5hZGRyZXNzOnBvcnQvYCBpcyBjb25zaWRlcmVkIGFzIGEgYCdwbGF5ZXInYCBjbGllbnQgYW5kIGRpc3BsYXlzIHRoZSB2aWV3IGBwbGF5ZXIuZWpzYDtcbiAgICogLSBBIGNsaWVudCBjb25uZWN0aW5nIHRvIHRoZSBzZXJ2ZXIgdGhyb3VnaCB0aGUgVVJMIGBodHRwOi8vbXkuc2VydmVyLmFkZHJlc3M6cG9ydC9jbGllbnRUeXBlYCBpcyBjb25zaWRlcmVkIGFzIGEgYGNsaWVudFR5cGVgIGNsaWVudCwgYW5kIGRpc3BsYXlzIHRoZSB2aWV3IGBjbGllbnRUeXBlLmVqc2AuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjbGllbnRUeXBlIENsaWVudCB0eXBlIChhcyBkZWZpbmVkIGJ5IHRoZSBtZXRob2Qge0BsaW5rIGNsaWVudC5pbml0fSBvbiB0aGUgY2xpZW50IHNpZGUpLlxuICAgKiBAcGFyYW0gey4uLkNsaWVudE1vZHVsZX0gbW9kdWxlcyBNb2R1bGVzIHRvIG1hcCB0byB0aGF0IGNsaWVudCB0eXBlLlxuICAgKi9cbiAgbWFwKGNsaWVudFR5cGUsIC4uLm1vZHVsZXMpIHtcbiAgICBjb25zdCB1cmwgPSAoY2xpZW50VHlwZSAhPT0gdGhpcy5hcHBDb25maWcuZGVmYXVsdENsaWVudCkgPyBgLyR7Y2xpZW50VHlwZX1gIDogJy8nO1xuICAgIC8vIGNhY2hlIGNvbXBpbGVkIHRlbXBsYXRlXG4gICAgY29uc3QgdG1wbFBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3ZpZXdzJywgY2xpZW50VHlwZSArICcuZWpzJyk7XG4gICAgY29uc3QgdG1wbFN0cmluZyA9IGZzLnJlYWRGaWxlU3luYyh0bXBsUGF0aCwgeyBlbmNvZGluZzogJ3V0ZjgnIH0pO1xuICAgIGNvbnN0IHRtcGwgPSBlanMuY29tcGlsZSh0bXBsU3RyaW5nKTtcblxuICAgIC8vIEB0b2RvIHJlZmFjdG9yXG4gICAgLy8gd3JpdGUgZW52IGNvbmZpZyBpbnRvIHRlbXBsYXRlc1xuICAgIHRoaXMuZXhwcmVzc0FwcC5nZXQodXJsLCAocmVxLCByZXMpID0+IHtcbiAgICAgIGNvbnN0IGVudkNvbmZpZ0NvcHkgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmVudkNvbmZpZyk7XG4gICAgICAvLyByZW1vdmUgbG9nZ2VyIGNvbmZpZ3VyYXRpb25cbiAgICAgIGVudkNvbmZpZ0NvcHkubG9nZ2VyID0gdW5kZWZpbmVkO1xuICAgICAgcmVzLnNlbmQodG1wbCh7IGVudkNvbmZpZzogSlNPTi5zdHJpbmdpZnkoZW52Q29uZmlnQ29weSkgfSkpO1xuICAgIH0pO1xuXG4gICAgbW9kdWxlcy5mb3JFYWNoKChtb2QpID0+IHsgbW9kLmNvbmZpZ3VyZSh0aGlzLmFwcENvbmZpZywgdGhpcy5lbnZDb25maWcpIH0pXG5cbiAgICB0aGlzLmlvLm9mKGNsaWVudFR5cGUpLm9uKCdjb25uZWN0aW9uJywgKHNvY2tldCkgPT4ge1xuICAgICAgY29uc3QgY2xpZW50ID0gbmV3IENsaWVudChjbGllbnRUeXBlLCBzb2NrZXQpO1xuICAgICAgbW9kdWxlcy5mb3JFYWNoKChtb2QpID0+IHsgbW9kLmNvbm5lY3QoY2xpZW50KSB9KTtcblxuICAgICAgLy8gZ2xvYmFsIGxpZmVjeWNsZSBvZiB0aGUgY2xpZW50XG4gICAgICBjb21tLnJlY2VpdmUoY2xpZW50LCAnZGlzY29ubmVjdCcsICgpID0+IHtcbiAgICAgICAgbW9kdWxlcy5mb3JFYWNoKChtb2QpID0+IHsgbW9kLmRpc2Nvbm5lY3QoY2xpZW50KSB9KTtcbiAgICAgICAgY2xpZW50LmRlc3Ryb3koKTtcbiAgICAgICAgbG9nZ2VyLmluZm8oeyBzb2NrZXQ6IHNvY2tldCwgY2xpZW50VHlwZTogY2xpZW50VHlwZSB9LCAnZGlzY29ubmVjdCcpO1xuICAgICAgfSk7XG5cbiAgICAgIGNvbW0uc2VuZChjbGllbnQsICdjbGllbnQ6c3RhcnQnLCBjbGllbnQuaW5kZXgpOyAvLyB0aGUgc2VydmVyIGlzIHJlYWR5XG4gICAgICBsb2dnZXIuaW5mbyh7IHNvY2tldDogc29ja2V0LCBjbGllbnRUeXBlOiBjbGllbnRUeXBlIH0sICdjb25uZWN0aW9uJyk7XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNlbmQgYW4gT1NDIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB3aWxkY2FyZCBXaWxkY2FyZCBvZiB0aGUgT1NDIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7QXJyYXl9IGFyZ3MgQXJndW1lbnRzIG9mIHRoZSBPU0MgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFt1cmw9bnVsbF0gVVJMIHRvIHNlbmQgdGhlIE9TQyBtZXNzYWdlIHRvIChpZiBub3Qgc3BlY2lmaWVkLCB1c2VzIHRoZSBhZGRyZXNzIGRlZmluZWQgaW4gdGhlIE9TQyBjb25maWcgb3IgaW4gdGhlIG9wdGlvbnMgb2YgdGhlIHtAbGluayBzZXJ2ZXIuc3RhcnR9IG1ldGhvZCkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbcG9ydD1udWxsXSBQb3J0IHRvIHNlbmQgdGhlIG1lc3NhZ2UgdG8gKGlmIG5vdCBzcGVjaWZpZWQsIHVzZXMgdGhlIHBvcnQgZGVmaW5lZCBpbiB0aGUgT1NDIGNvbmZpZyBvciBpbiB0aGUgb3B0aW9ucyBvZiB0aGUge0BsaW5rIHNlcnZlci5zdGFydH0gbWV0aG9kKS5cbiAgICovXG4gIHNlbmRPU0Mod2lsZGNhcmQsIGFyZ3MsIHVybCA9IG51bGwsIHBvcnQgPSBudWxsKSB7XG4gICAgY29uc3Qgb3NjTXNnID0ge1xuICAgICAgYWRkcmVzczogd2lsZGNhcmQsXG4gICAgICBhcmdzOiBhcmdzXG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICBpZiAodXJsICYmIHBvcnQpIHtcbiAgICAgICAgdGhpcy5vc2Muc2VuZChvc2NNc2csIHVybCwgcG9ydCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9zYy5zZW5kKG9zY01zZyk7IC8vIHVzZSBkZWZhdWx0cyAoYXMgZGVmaW5lZCBpbiB0aGUgY29uZmlnKVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdFcnJvciB3aGlsZSBzZW5kaW5nIE9TQyBtZXNzYWdlOicsIGUpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogTGlzdGVuIGZvciBPU0MgbWVzc2FnZSBhbmQgZXhlY3V0ZSBhIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICAgKiBUaGUgc2VydmVyIGxpc3RlbnMgdG8gT1NDIG1lc3NhZ2VzIGF0IHRoZSBhZGRyZXNzIGFuZCBwb3J0IGRlZmluZWQgaW4gdGhlIGNvbmZpZyBvciBpbiB0aGUgb3B0aW9ucyBvZiB0aGUge0BsaW5rIHNlcnZlci5zdGFydH0gbWV0aG9kLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gd2lsZGNhcmQgV2lsZGNhcmQgb2YgdGhlIE9TQyBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsYmFjayBmdW5jdGlvbiBleGVjdXRlZCB3aGVuIHRoZSBPU0MgbWVzc2FnZSBpcyByZWNlaXZlZC5cbiAgICovXG4gIHJlY2VpdmVPU0Mod2lsZGNhcmQsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb3NjTGlzdGVuZXIgPSB7XG4gICAgICB3aWxkY2FyZDogd2lsZGNhcmQsXG4gICAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgICB9O1xuXG4gICAgb3NjTGlzdGVuZXJzLnB1c2gob3NjTGlzdGVuZXIpO1xuICB9XG59O1xuXG4iXX0=