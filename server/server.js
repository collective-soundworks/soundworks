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
  socketIO: {
    transports: ['websocket'],
    pingTimeout: 60000,
    pingInterval: 50000
    // @note: EngineIO defaults
    // pingTimeout: 3000,
    // pingInterval: 1000,
    // upgradeTimeout: 10000,
    // maxHttpBufferSize: 10E7,
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
/*{
level: 'info',
path: path.join(process.cwd(), 'logs', 'soundworks.log'),
}*/exports['default'] = {

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvc2VydmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBQWlCLFFBQVE7Ozs7bUJBQ1QsS0FBSzs7Ozt1QkFDRCxTQUFTOzs7O2tCQUNkLElBQUk7Ozs7b0JBQ0YsTUFBTTs7OztzQkFDSixVQUFVOzs7O3dCQUNkLFdBQVc7Ozs7bUJBQ1YsS0FBSzs7OztvQkFDSixNQUFNOzs7O3NCQUNKLFVBQVU7Ozs7Ozs7QUFLN0IsSUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDOztBQUV4QixJQUFNLGdCQUFnQixHQUFHO0FBQ3ZCLGNBQVksRUFBRSxrQkFBSyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLFFBQVEsQ0FBQztBQUNoRCxlQUFhLEVBQUUsUUFBUTtBQUN2QixVQUFRLEVBQUU7QUFDUixjQUFVLEVBQUUsQ0FBQyxXQUFXLENBQUM7QUFDekIsZUFBVyxFQUFFLEtBQUs7QUFDbEIsZ0JBQVksRUFBRSxLQUFLOzs7Ozs7R0FNcEI7Q0FDRixDQUFDOztBQUVGLElBQU0sZ0JBQWdCLEdBQUc7QUFDdkIsTUFBSSxFQUFFLElBQUk7QUFDVixLQUFHLEVBQUU7QUFDSCxnQkFBWSxFQUFFLFdBQVc7QUFDekIsYUFBUyxFQUFFLEtBQUs7QUFDaEIsaUJBQWEsRUFBRSxXQUFXO0FBQzFCLGNBQVUsRUFBRSxLQUFLO0dBQ2xCO0FBQ0QsUUFBTSxFQUFFO0FBQ04sUUFBSSxFQUFFLFlBQVk7QUFDbEIsU0FBSyxFQUFFLE1BQU07QUFDYixXQUFPLEVBQUUsQ0FBQztBQUNSLFdBQUssRUFBRSxNQUFNO0FBQ2IsWUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNO0tBQ3ZCLENBR0c7R0FDTDtDQUNGLENBQUM7Ozs7Ozs7Ozs7O3dCQVFhOzs7Ozs7O0FBT2IsSUFBRSxFQUFFLElBQUk7Ozs7OztBQU1SLFlBQVUsRUFBRSxJQUFJOzs7OztBQUtoQixZQUFVLEVBQUUsSUFBSTs7Ozs7OztBQU9oQixXQUFTLEVBQUUsRUFBRTs7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QixVQUFJLEVBQUUsSUFBSTtLQUNYLENBQUM7O0FBRUYsUUFBSTtBQUNGLFVBQUksR0FBRyxJQUFJLElBQUksRUFBRTtBQUNmLFlBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7T0FDbEMsTUFBTTtBQUNMLFlBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO09BQ3ZCO0tBQ0YsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNWLGFBQU8sQ0FBQyxHQUFHLENBQUMsa0NBQWtDLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDcEQ7R0FDRjs7Ozs7Ozs7O0FBU0QsWUFBVSxFQUFBLG9CQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUU7QUFDN0IsUUFBTSxXQUFXLEdBQUc7QUFDbEIsY0FBUSxFQUFFLFFBQVE7QUFDbEIsY0FBUSxFQUFFLFFBQVE7S0FDbkIsQ0FBQzs7QUFFRixnQkFBWSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztHQUNoQztDQUNGIiwiZmlsZSI6InNyYy9zZXJ2ZXIvc2VydmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNvbW0gZnJvbSAnLi9jb21tJztcbmltcG9ydCBlanMgZnJvbSAnZWpzJztcbmltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBodHRwIGZyb20gJ2h0dHAnO1xuaW1wb3J0IGxvZ2dlciBmcm9tICcuL2xvZ2dlcic7XG5pbXBvcnQgSU8gZnJvbSAnc29ja2V0LmlvJztcbmltcG9ydCBvc2MgZnJvbSAnb3NjJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IENsaWVudCBmcm9tICcuL0NsaWVudCc7XG5cbi8vIGdsb2JhbHNcbi8vIEB0b2RvIGhpZGUgdGhpcyBpbnRvIGNsaWVudFxuXG5jb25zdCBvc2NMaXN0ZW5lcnMgPSBbXTtcblxuY29uc3QgZGVmYXVsdEFwcENvbmZpZyA9IHtcbiAgcHVibGljRm9sZGVyOiBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3B1YmxpYycpLFxuICBkZWZhdWx0Q2xpZW50OiAncGxheWVyJyxcbiAgc29ja2V0SU86IHtcbiAgICB0cmFuc3BvcnRzOiBbJ3dlYnNvY2tldCddLFxuICAgIHBpbmdUaW1lb3V0OiA2MDAwMCxcbiAgICBwaW5nSW50ZXJ2YWw6IDUwMDAwXG4gICAgLy8gQG5vdGU6IEVuZ2luZUlPIGRlZmF1bHRzXG4gICAgLy8gcGluZ1RpbWVvdXQ6IDMwMDAsXG4gICAgLy8gcGluZ0ludGVydmFsOiAxMDAwLFxuICAgIC8vIHVwZ3JhZGVUaW1lb3V0OiAxMDAwMCxcbiAgICAvLyBtYXhIdHRwQnVmZmVyU2l6ZTogMTBFNyxcbiAgfSxcbn07XG5cbmNvbnN0IGRlZmF1bHRFbnZDb25maWcgPSB7XG4gIHBvcnQ6IDgwMDAsXG4gIG9zYzoge1xuICAgIGxvY2FsQWRkcmVzczogJzEyNy4wLjAuMScsXG4gICAgbG9jYWxQb3J0OiA1NzEyMSxcbiAgICByZW1vdGVBZGRyZXNzOiAnMTI3LjAuMC4xJyxcbiAgICByZW1vdGVQb3J0OiA1NzEyMCxcbiAgfSxcbiAgbG9nZ2VyOiB7XG4gICAgbmFtZTogJ3NvdW5kd29ya3MnLFxuICAgIGxldmVsOiAnaW5mbycsXG4gICAgc3RyZWFtczogW3tcbiAgICAgIGxldmVsOiAnaW5mbycsXG4gICAgICBzdHJlYW06IHByb2Nlc3Muc3Rkb3V0LFxuICAgIH0sIC8qe1xuICAgICAgbGV2ZWw6ICdpbmZvJyxcbiAgICAgIHBhdGg6IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnbG9ncycsICdzb3VuZHdvcmtzLmxvZycpLFxuICAgIH0qL11cbiAgfVxufTtcblxuLyoqXG4gKiBUaGUgYHNlcnZlcmAgb2JqZWN0IGNvbnRhaW5zIHRoZSBiYXNpYyBtZXRob2RzIG9mIHRoZSBzZXJ2ZXIuXG4gKiBGb3IgaW5zdGFuY2UsIHRoaXMgb2JqZWN0IGFsbG93cyBzZXR0aW5nIHVwLCBjb25maWd1cmluZyBhbmQgc3RhcnRpbmcgdGhlIHNlcnZlciB3aXRoIHRoZSBtZXRob2QgYHN0YXJ0YCB3aGlsZSB0aGUgbWV0aG9kIGBtYXBgIGFsbG93cyBmb3IgbWFuYWdpbmcgdGhlIG1hcHBpbmcgYmV0d2VlbiBkaWZmZXJlbnQgdHlwZXMgb2YgY2xpZW50cyBhbmQgdGhlaXIgcmVxdWlyZWQgc2VydmVyIG1vZHVsZXMuXG4gKiBBZGRpdGlvbmFsbHksIHRoZSBtZXRob2QgYGJyb2FkY2FzdGAgYWxsb3dzIHRvIHNlbmQgbWVzc2FnZXMgdG8gYWxsIGNvbm5lY3RlZCBjbGllbnRzIHZpYSBXZWJTb2NrZXRzIG9yIE9TQy5cbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IHtcblxuICAvKipcbiAgICogV2ViU29ja2V0IHNlcnZlci5cbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGlvOiBudWxsLFxuXG4gIC8qKlxuICAgKiBFeHByZXNzIGFwcGxpY2F0aW9uXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xuICBleHByZXNzQXBwOiBudWxsLFxuICAvKipcbiAgICogSHR0cCBzZXJ2ZXJcbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG4gIGh0dHBTZXJ2ZXI6IG51bGwsXG5cbiAgLyoqXG4gICAqIEFwcGxpY2F0aW9uIGNvbmZpZ3VyYXRpb24gaW5mb3JtYXRpb24uXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBhcHBDb25maWc6IHt9LCAvLyBob3N0IGVudiBjb25maWcgaW5mb3JtYXRpb25zIChkZXYgLyBwcm9kKVxuXG4gIC8qKlxuICAgKiBFbnZpcm9ubWVudCBjb25maWd1cmF0aW9uIGluZm9ybWF0aW9uIChkZXZlbG9wbWVudCAvIHByb2R1Y3Rpb24pLlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZW52Q29uZmlnOiB7fSwgLy8gaG9zdCBlbnYgY29uZmlnIGluZm9ybWF0aW9ucyAoZGV2IC8gcHJvZClcblxuICAvKipcbiAgICogT1NDIG9iamVjdC5cbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIG9zYzogbnVsbCxcblxuICAvKipcbiAgICogU3RhcnQgdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtPYmplY3R9IFthcHBDb25maWc9e31dIEFwcGxpY2F0aW9uIGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAgICogQGF0dHJpYnV0ZSB7U3RyaW5nfSBbYXBwQ29uZmlnLnB1YmxpY0ZvbGRlcj0nLi9wdWJsaWMnXSBQYXRoIHRvIHRoZSBwdWJsaWMgZm9sZGVyLlxuICAgKiBAYXR0cmlidXRlIHtPYmplY3R9IFthcHBDb25maWcuc29ja2V0SU89e31dIHNvY2tldC5pbyBvcHRpb25zLiBUaGUgc29ja2V0LmlvIGNvbmZpZyBvYmplY3QgY2FuIGhhdmUgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICAgKiAtIGB0cmFuc3BvcnRzOlN0cmluZ2A6IGNvbW11bmljYXRpb24gdHJhbnNwb3J0IChkZWZhdWx0cyB0byBgJ3dlYnNvY2tldCdgKTtcbiAgICogLSBgcGluZ1RpbWVvdXQ6TnVtYmVyYDogdGltZW91dCAoaW4gbWlsbGlzZWNvbmRzKSBiZWZvcmUgdHJ5aW5nIHRvIHJlZXN0YWJsaXNoIGEgY29ubmVjdGlvbiBiZXR3ZWVuIGEgbG9zdCBjbGllbnQgYW5kIGEgc2VydmVyIChkZWZhdXRscyB0byBgNjAwMDBgKTtcbiAgICogLSBgcGluZ0ludGVydmFsOk51bWJlcmA6IHRpbWUgaW50ZXJ2YWwgKGluIG1pbGxpc2Vjb25kcykgdG8gc2VuZCBhIHBpbmcgdG8gYSBjbGllbnQgdG8gY2hlY2sgdGhlIGNvbm5lY3Rpb24gKGRlZmF1bHRzIHRvIGA1MDAwMGApLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW2VudkNvbmZpZz17fV0gRW52aXJvbm1lbnQgY29uZmlndXJhdGlvbiBvcHRpb25zLlxuICAgKiBAYXR0cmlidXRlIHtOdW1iZXJ9IFtlbnZDb25maWcucG9ydD04MDAwXSBQb3J0IG9mIHRoZSBIVFRQIHNlcnZlci5cbiAgICogQGF0dHJpYnV0ZSB7T2JqZWN0fSBbZW52Q29uZmlnLm9zYz17fV0gT1NDIG9wdGlvbnMuIFRoZSBPU0MgY29uZmlnIG9iamVjdCBjYW4gaGF2ZSB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gICAqIC0gYGxvY2FsQWRkcmVzczpTdHJpbmdgOiBhZGRyZXNzIG9mIHRoZSBsb2NhbCBtYWNoaW5lIHRvIHJlY2VpdmUgT1NDIG1lc3NhZ2VzIChkZWZhdWx0cyB0byBgJzEyNy4wLjAuMSdgKTtcbiAgICogLSBgbG9jYWxQb3J0Ok51bWJlcmA6IHBvcnQgb2YgdGhlIGxvY2FsIG1hY2hpbmUgdG8gcmVjZWl2ZSBPU0MgbWVzc2FnZXMgKGRlZmF1bHRzIHRvIGA1NzEyMWApO1xuICAgKiAtIGByZW1vdGVBZGRyZXNzOlN0cmluZ2A6IGFkZHJlc3Mgb2YgdGhlIGRldmljZSB0byBzZW5kIGRlZmF1bHQgT1NDIG1lc3NhZ2VzIHRvIChkZWZhdWx0cyB0byBgJzEyNy4wLjAuMSdgKTtcbiAgICogLSBgcmVtb3RlUG9ydDpOdW1iZXJgOiBwb3J0IG9mIHRoZSBkZXZpY2UgdG8gc2VuZCBkZWZhdWx0IE9TQyBtZXNzYWdlcyB0byAoZGVmYXVsdHMgdG8gYDU3MTIwYCkuXG4gICAqL1xuICBzdGFydChhcHBDb25maWcgPSB7fSwgZW52Q29uZmlnID0ge30pIHtcbiAgICBhcHBDb25maWcgPSBPYmplY3QuYXNzaWduKGRlZmF1bHRBcHBDb25maWcsIGFwcENvbmZpZyk7XG4gICAgZW52Q29uZmlnID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0RW52Q29uZmlnLCBlbnZDb25maWcpO1xuICAgIHRoaXMuYXBwQ29uZmlnID0gYXBwQ29uZmlnO1xuICAgIHRoaXMuZW52Q29uZmlnID0gZW52Q29uZmlnO1xuXG4gICAgLy8gY29uZmlndXJlIGV4cHJlc3MgYW5kIGh0dHAgc2VydmVyXG4gICAgY29uc3QgZXhwcmVzc0FwcCA9IG5ldyBleHByZXNzKCk7XG4gICAgZXhwcmVzc0FwcC5zZXQoJ3BvcnQnLCBwcm9jZXNzLmVudi5QT1JUIHx8IGVudkNvbmZpZy5wb3J0KTtcbiAgICBleHByZXNzQXBwLnNldCgndmlldyBlbmdpbmUnLCAnZWpzJyk7XG4gICAgZXhwcmVzc0FwcC51c2UoZXhwcmVzcy5zdGF0aWMoYXBwQ29uZmlnLnB1YmxpY0ZvbGRlcikpO1xuXG4gICAgY29uc3QgaHR0cFNlcnZlciA9IGh0dHAuY3JlYXRlU2VydmVyKGV4cHJlc3NBcHApO1xuICAgIGh0dHBTZXJ2ZXIubGlzdGVuKGV4cHJlc3NBcHAuZ2V0KCdwb3J0JyksIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgdXJsID0gYGh0dHA6Ly8xMjcuMC4wLjE6JHtleHByZXNzQXBwLmdldCgncG9ydCcpfWA7XG4gICAgICBjb25zb2xlLmxvZygnW0hUVFAgU0VSVkVSXSBTZXJ2ZXIgbGlzdGVuaW5nIG9uJywgdXJsKTtcbiAgICB9KTtcblxuICAgIHRoaXMuZXhwcmVzc0FwcCA9IGV4cHJlc3NBcHA7XG4gICAgdGhpcy5odHRwU2VydmVyID0gaHR0cFNlcnZlcjtcblxuICAgIHRoaXMuaW8gPSBuZXcgSU8oaHR0cFNlcnZlciwgYXBwQ29uZmlnLnNvY2tldElPKTtcbiAgICBjb21tLmluaXRpYWxpemUodGhpcy5pbyk7XG4gICAgbG9nZ2VyLmluaXRpYWxpemUoZW52Q29uZmlnLmxvZ2dlcik7XG5cbiAgICAvLyBjb25maWd1cmUgT1NDXG4gICAgaWYgKGVudkNvbmZpZy5vc2MpIHtcbiAgICAgIHRoaXMub3NjID0gbmV3IG9zYy5VRFBQb3J0KHtcbiAgICAgICAgLy8gVGhpcyBpcyB0aGUgcG9ydCB3ZSdyZSBsaXN0ZW5pbmcgb24uXG4gICAgICAgIC8vIEBub3RlIHJlbmFtZSB0byByZWNlaXZlQWRkcmVzcyAvIHJlY2VpdmVQb3J0XG4gICAgICAgIGxvY2FsQWRkcmVzczogZW52Q29uZmlnLm9zYy5sb2NhbEFkZHJlc3MsXG4gICAgICAgIGxvY2FsUG9ydDogZW52Q29uZmlnLm9zYy5sb2NhbFBvcnQsXG4gICAgICAgIC8vIFRoaXMgaXMgdGhlIHBvcnQgd2UgdXNlIHRvIHNlbmQgbWVzc2FnZXMuXG4gICAgICAgIC8vIEBub3RlIHJlbmFtZSB0byBzZW5kQWRkcmVzcyAvIHNlbmRQb3J0XG4gICAgICAgIHJlbW90ZUFkZHJlc3M6IGVudkNvbmZpZy5vc2MucmVtb3RlQWRkcmVzcyxcbiAgICAgICAgcmVtb3RlUG9ydDogZW52Q29uZmlnLm9zYy5yZW1vdGVQb3J0LFxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMub3NjLm9uKCdyZWFkeScsICgpID0+IHtcbiAgICAgICAgY29uc3QgcmVjZWl2ZSA9IGAke2VudkNvbmZpZy5vc2MubG9jYWxBZGRyZXNzfToke2VudkNvbmZpZy5vc2MubG9jYWxQb3J0fWA7XG4gICAgICAgIGNvbnN0IHNlbmQgPSBgJHtlbnZDb25maWcub3NjLnJlbW90ZUFkZHJlc3N9OiR7ZW52Q29uZmlnLm9zYy5yZW1vdGVQb3J0fWA7XG4gICAgICAgIGNvbnNvbGUubG9nKGBbT1NDIG92ZXIgVURQXSBSZWNlaXZpbmcgb24gJHtyZWNlaXZlfWApO1xuICAgICAgICBjb25zb2xlLmxvZyhgW09TQyBvdmVyIFVEUF0gU2VuZGluZyBvbiAke3NlbmR9YCk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5vc2Mub24oJ21lc3NhZ2UnLCAob3NjTXNnKSA9PiB7XG4gICAgICAgIGNvbnN0IGFkZHJlc3MgPSBvc2NNc2cuYWRkcmVzcztcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9zY0xpc3RlbmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChhZGRyZXNzID09PSBvc2NMaXN0ZW5lcnNbaV0ud2lsZGNhcmQpXG4gICAgICAgICAgICBvc2NMaXN0ZW5lcnNbaV0uY2FsbGJhY2sob3NjTXNnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMub3NjLm9wZW4oKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEluZGljYXRlIHRoYXQgdGhlIGNsaWVudHMgb2YgdHlwZSBgY2xpZW50VHlwZWAgcmVxdWlyZSB0aGUgbW9kdWxlcyBgLi4ubW9kdWxlc2Agb24gdGhlIHNlcnZlciBzaWRlLlxuICAgKiBBZGRpdGlvbmFsbHksIHRoaXMgbWV0aG9kIHJvdXRlcyB0aGUgY29ubmVjdGlvbnMgZnJvbSB0aGUgY29ycmVzcG9uZGluZyBVUkwgdG8gdGhlIGNvcnJlc3BvbmRpbmcgdmlldy5cbiAgICogTW9yZSBzcGVjaWZpY2FsbHk6XG4gICAqIC0gQSBjbGllbnQgY29ubmVjdGluZyB0byB0aGUgc2VydmVyIHRocm91Z2ggdGhlIHJvb3QgVVJMIGBodHRwOi8vbXkuc2VydmVyLmFkZHJlc3M6cG9ydC9gIGlzIGNvbnNpZGVyZWQgYXMgYSBgJ3BsYXllcidgIGNsaWVudCBhbmQgZGlzcGxheXMgdGhlIHZpZXcgYHBsYXllci5lanNgO1xuICAgKiAtIEEgY2xpZW50IGNvbm5lY3RpbmcgdG8gdGhlIHNlcnZlciB0aHJvdWdoIHRoZSBVUkwgYGh0dHA6Ly9teS5zZXJ2ZXIuYWRkcmVzczpwb3J0L2NsaWVudFR5cGVgIGlzIGNvbnNpZGVyZWQgYXMgYSBgY2xpZW50VHlwZWAgY2xpZW50LCBhbmQgZGlzcGxheXMgdGhlIHZpZXcgYGNsaWVudFR5cGUuZWpzYC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNsaWVudFR5cGUgQ2xpZW50IHR5cGUgKGFzIGRlZmluZWQgYnkgdGhlIG1ldGhvZCB7QGxpbmsgY2xpZW50LmluaXR9IG9uIHRoZSBjbGllbnQgc2lkZSkuXG4gICAqIEBwYXJhbSB7Li4uQ2xpZW50TW9kdWxlfSBtb2R1bGVzIE1vZHVsZXMgdG8gbWFwIHRvIHRoYXQgY2xpZW50IHR5cGUuXG4gICAqL1xuICBtYXAoY2xpZW50VHlwZSwgLi4ubW9kdWxlcykge1xuICAgIGNvbnN0IHVybCA9IChjbGllbnRUeXBlICE9PSB0aGlzLmFwcENvbmZpZy5kZWZhdWx0Q2xpZW50KSA/IGAvJHtjbGllbnRUeXBlfWAgOiAnLyc7XG4gICAgLy8gY2FjaGUgY29tcGlsZWQgdGVtcGxhdGVcbiAgICBjb25zdCB0bXBsUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAndmlld3MnLCBjbGllbnRUeXBlICsgJy5lanMnKTtcbiAgICBjb25zdCB0bXBsU3RyaW5nID0gZnMucmVhZEZpbGVTeW5jKHRtcGxQYXRoLCB7IGVuY29kaW5nOiAndXRmOCcgfSk7XG4gICAgY29uc3QgdG1wbCA9IGVqcy5jb21waWxlKHRtcGxTdHJpbmcpO1xuXG4gICAgLy8gQHRvZG8gcmVmYWN0b3JcbiAgICAvLyB3cml0ZSBlbnYgY29uZmlnIGludG8gdGVtcGxhdGVzXG4gICAgdGhpcy5leHByZXNzQXBwLmdldCh1cmwsIChyZXEsIHJlcykgPT4ge1xuICAgICAgY29uc3QgZW52Q29uZmlnQ29weSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZW52Q29uZmlnKTtcbiAgICAgIC8vIHJlbW92ZSBsb2dnZXIgY29uZmlndXJhdGlvblxuICAgICAgZW52Q29uZmlnQ29weS5sb2dnZXIgPSB1bmRlZmluZWQ7XG4gICAgICByZXMuc2VuZCh0bXBsKHsgZW52Q29uZmlnOiBKU09OLnN0cmluZ2lmeShlbnZDb25maWdDb3B5KSB9KSk7XG4gICAgfSk7XG5cbiAgICBtb2R1bGVzLmZvckVhY2goKG1vZCkgPT4geyBtb2QuY29uZmlndXJlKHRoaXMuYXBwQ29uZmlnLCB0aGlzLmVudkNvbmZpZykgfSlcblxuICAgIHRoaXMuaW8ub2YoY2xpZW50VHlwZSkub24oJ2Nvbm5lY3Rpb24nLCAoc29ja2V0KSA9PiB7XG4gICAgICBjb25zdCBjbGllbnQgPSBuZXcgQ2xpZW50KGNsaWVudFR5cGUsIHNvY2tldCk7XG4gICAgICBtb2R1bGVzLmZvckVhY2goKG1vZCkgPT4geyBtb2QuY29ubmVjdChjbGllbnQpIH0pO1xuXG4gICAgICAvLyBnbG9iYWwgbGlmZWN5Y2xlIG9mIHRoZSBjbGllbnRcbiAgICAgIGNvbW0ucmVjZWl2ZShjbGllbnQsICdkaXNjb25uZWN0JywgKCkgPT4ge1xuICAgICAgICBtb2R1bGVzLmZvckVhY2goKG1vZCkgPT4geyBtb2QuZGlzY29ubmVjdChjbGllbnQpIH0pO1xuICAgICAgICBjbGllbnQuZGVzdHJveSgpO1xuICAgICAgICBsb2dnZXIuaW5mbyh7IHNvY2tldDogc29ja2V0LCBjbGllbnRUeXBlOiBjbGllbnRUeXBlIH0sICdkaXNjb25uZWN0Jyk7XG4gICAgICB9KTtcblxuICAgICAgY29tbS5zZW5kKGNsaWVudCwgJ2NsaWVudDpzdGFydCcsIGNsaWVudC5pbmRleCk7IC8vIHRoZSBzZXJ2ZXIgaXMgcmVhZHlcbiAgICAgIGxvZ2dlci5pbmZvKHsgc29ja2V0OiBzb2NrZXQsIGNsaWVudFR5cGU6IGNsaWVudFR5cGUgfSwgJ2Nvbm5lY3Rpb24nKTtcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogU2VuZCBhbiBPU0MgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IHdpbGRjYXJkIFdpbGRjYXJkIG9mIHRoZSBPU0MgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtBcnJheX0gYXJncyBBcmd1bWVudHMgb2YgdGhlIE9TQyBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW3VybD1udWxsXSBVUkwgdG8gc2VuZCB0aGUgT1NDIG1lc3NhZ2UgdG8gKGlmIG5vdCBzcGVjaWZpZWQsIHVzZXMgdGhlIGFkZHJlc3MgZGVmaW5lZCBpbiB0aGUgT1NDIGNvbmZpZyBvciBpbiB0aGUgb3B0aW9ucyBvZiB0aGUge0BsaW5rIHNlcnZlci5zdGFydH0gbWV0aG9kKS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtwb3J0PW51bGxdIFBvcnQgdG8gc2VuZCB0aGUgbWVzc2FnZSB0byAoaWYgbm90IHNwZWNpZmllZCwgdXNlcyB0aGUgcG9ydCBkZWZpbmVkIGluIHRoZSBPU0MgY29uZmlnIG9yIGluIHRoZSBvcHRpb25zIG9mIHRoZSB7QGxpbmsgc2VydmVyLnN0YXJ0fSBtZXRob2QpLlxuICAgKi9cbiAgc2VuZE9TQyh3aWxkY2FyZCwgYXJncywgdXJsID0gbnVsbCwgcG9ydCA9IG51bGwpIHtcbiAgICBjb25zdCBvc2NNc2cgPSB7XG4gICAgICBhZGRyZXNzOiB3aWxkY2FyZCxcbiAgICAgIGFyZ3M6IGFyZ3NcbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgIGlmICh1cmwgJiYgcG9ydCkge1xuICAgICAgICB0aGlzLm9zYy5zZW5kKG9zY01zZywgdXJsLCBwb3J0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub3NjLnNlbmQob3NjTXNnKTsgLy8gdXNlIGRlZmF1bHRzIChhcyBkZWZpbmVkIGluIHRoZSBjb25maWcpXG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5sb2coJ0Vycm9yIHdoaWxlIHNlbmRpbmcgT1NDIG1lc3NhZ2U6JywgZSk7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBMaXN0ZW4gZm9yIE9TQyBtZXNzYWdlIGFuZCBleGVjdXRlIGEgY2FsbGJhY2sgZnVuY3Rpb24uXG4gICAqIFRoZSBzZXJ2ZXIgbGlzdGVucyB0byBPU0MgbWVzc2FnZXMgYXQgdGhlIGFkZHJlc3MgYW5kIHBvcnQgZGVmaW5lZCBpbiB0aGUgY29uZmlnIG9yIGluIHRoZSBvcHRpb25zIG9mIHRoZSB7QGxpbmsgc2VydmVyLnN0YXJ0fSBtZXRob2QuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB3aWxkY2FyZCBXaWxkY2FyZCBvZiB0aGUgT1NDIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIENhbGxiYWNrIGZ1bmN0aW9uIGV4ZWN1dGVkIHdoZW4gdGhlIE9TQyBtZXNzYWdlIGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgcmVjZWl2ZU9TQyh3aWxkY2FyZCwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBvc2NMaXN0ZW5lciA9IHtcbiAgICAgIHdpbGRjYXJkOiB3aWxkY2FyZCxcbiAgICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICAgIH07XG5cbiAgICBvc2NMaXN0ZW5lcnMucHVzaChvc2NMaXN0ZW5lcik7XG4gIH1cbn07XG4iXX0=