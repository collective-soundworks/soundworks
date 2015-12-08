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

    // @todo - add 1 level of merging to Object.assign
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
      res.send(tmpl({
        envConfig: JSON.stringify(envConfigCopy)
      }));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvc2VydmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBQWlCLFFBQVE7Ozs7bUJBQ1QsS0FBSzs7Ozt1QkFDRCxTQUFTOzs7O2tCQUNkLElBQUk7Ozs7b0JBQ0YsTUFBTTs7OztzQkFDSixVQUFVOzs7O3dCQUNkLFdBQVc7Ozs7bUJBQ1YsS0FBSzs7OztvQkFDSixNQUFNOzs7O3NCQUNKLFVBQVU7Ozs7Ozs7QUFLN0IsSUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDOztBQUV4QixJQUFNLGdCQUFnQixHQUFHO0FBQ3ZCLGNBQVksRUFBRSxrQkFBSyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLFFBQVEsQ0FBQztBQUNoRCxlQUFhLEVBQUUsUUFBUTs7Ozs7O0FBTXZCLFVBQVEsRUFBRTtBQUNSLGNBQVUsRUFBRSxDQUFDLFdBQVcsQ0FBQztBQUN6QixlQUFXLEVBQUUsS0FBSztBQUNsQixnQkFBWSxFQUFFLEtBQUs7R0FDcEI7Q0FDRixDQUFDOztBQUVGLElBQU0sZ0JBQWdCLEdBQUc7QUFDdkIsTUFBSSxFQUFFLElBQUk7QUFDVixLQUFHLEVBQUU7QUFDSCxnQkFBWSxFQUFFLFdBQVc7QUFDekIsYUFBUyxFQUFFLEtBQUs7QUFDaEIsaUJBQWEsRUFBRSxXQUFXO0FBQzFCLGNBQVUsRUFBRSxLQUFLO0dBQ2xCO0FBQ0QsUUFBTSxFQUFFO0FBQ04sUUFBSSxFQUFFLFlBQVk7QUFDbEIsU0FBSyxFQUFFLE1BQU07QUFDYixXQUFPLEVBQUUsQ0FDUDtBQUNFLFdBQUssRUFBRSxNQUFNO0FBQ2IsWUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNO0tBQ3ZCLENBS0Y7R0FDRjtDQUNGLENBQUM7Ozs7Ozs7Ozs7Ozs7cUJBUWE7Ozs7Ozs7QUFPYixJQUFFLEVBQUUsSUFBSTs7Ozs7O0FBTVIsWUFBVSxFQUFFLElBQUk7Ozs7O0FBS2hCLFlBQVUsRUFBRSxJQUFJOzs7Ozs7O0FBT2hCLFdBQVMsRUFBRSxFQUFF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QUFDakIsVUFBSSxFQUFFLElBQUk7S0FDWCxDQUFDOztBQUVGLFFBQUk7QUFDRixVQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUU7QUFDZixZQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO09BQ2xDLE1BQU07QUFDTCxZQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztPQUN2QjtLQUNGLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDVixhQUFPLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3BEO0dBQ0Y7Ozs7Ozs7OztBQVNELFlBQVUsRUFBQSxvQkFBQyxRQUFRLEVBQUUsUUFBUSxFQUFFO0FBQzdCLFFBQU0sV0FBVyxHQUFHO0FBQ2xCLGNBQVEsRUFBRSxRQUFRO0FBQ2xCLGNBQVEsRUFBRSxRQUFRO0tBQ25CLENBQUM7O0FBRUYsZ0JBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7R0FDaEM7Q0FDRiIsImZpbGUiOiJzcmMvc2VydmVyL3NlcnZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjb21tIGZyb20gJy4vY29tbSc7XG5pbXBvcnQgZWpzIGZyb20gJ2Vqcyc7XG5pbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgaHR0cCBmcm9tICdodHRwJztcbmltcG9ydCBsb2dnZXIgZnJvbSAnLi9sb2dnZXInO1xuaW1wb3J0IElPIGZyb20gJ3NvY2tldC5pbyc7XG5pbXBvcnQgb3NjIGZyb20gJ29zYyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBDbGllbnQgZnJvbSAnLi9DbGllbnQnO1xuXG4vLyBnbG9iYWxzXG4vLyBAdG9kbyBoaWRlIHRoaXMgaW50byBjbGllbnRcblxuY29uc3Qgb3NjTGlzdGVuZXJzID0gW107XG5cbmNvbnN0IGRlZmF1bHRBcHBDb25maWcgPSB7XG4gIHB1YmxpY0ZvbGRlcjogcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdwdWJsaWMnKSxcbiAgZGVmYXVsdENsaWVudDogJ3BsYXllcicsXG4gIC8vIEBub3RlOiBFbmdpbmVJTyBkZWZhdWx0c1xuICAvLyB0aGlzLnBpbmdUaW1lb3V0ID0gb3B0cy5waW5nVGltZW91dCB8fCAzMDAwO1xuICAvLyB0aGlzLnBpbmdJbnRlcnZhbCA9IG9wdHMucGluZ0ludGVydmFsIHx8IDEwMDA7XG4gIC8vIHRoaXMudXBncmFkZVRpbWVvdXQgPSBvcHRzLnVwZ3JhZGVUaW1lb3V0IHx8IDEwMDAwO1xuICAvLyB0aGlzLm1heEh0dHBCdWZmZXJTaXplID0gb3B0cy5tYXhIdHRwQnVmZmVyU2l6ZSB8fCAxMEU3O1xuICBzb2NrZXRJTzoge1xuICAgIHRyYW5zcG9ydHM6IFsnd2Vic29ja2V0J10sXG4gICAgcGluZ1RpbWVvdXQ6IDYwMDAwLFxuICAgIHBpbmdJbnRlcnZhbDogNTAwMDBcbiAgfVxufTtcblxuY29uc3QgZGVmYXVsdEVudkNvbmZpZyA9IHtcbiAgcG9ydDogODAwMCxcbiAgb3NjOiB7XG4gICAgbG9jYWxBZGRyZXNzOiAnMTI3LjAuMC4xJyxcbiAgICBsb2NhbFBvcnQ6IDU3MTIxLFxuICAgIHJlbW90ZUFkZHJlc3M6ICcxMjcuMC4wLjEnLFxuICAgIHJlbW90ZVBvcnQ6IDU3MTIwXG4gIH0sXG4gIGxvZ2dlcjoge1xuICAgIG5hbWU6ICdzb3VuZHdvcmtzJyxcbiAgICBsZXZlbDogJ2luZm8nLFxuICAgIHN0cmVhbXM6IFtcbiAgICAgIHtcbiAgICAgICAgbGV2ZWw6ICdpbmZvJyxcbiAgICAgICAgc3RyZWFtOiBwcm9jZXNzLnN0ZG91dCxcbiAgICAgIH0sXG4gICAgICAvLyB7XG4gICAgICAvLyAgIGxldmVsOiAnaW5mbycsXG4gICAgICAvLyAgIHBhdGg6IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnbG9ncycsICdzb3VuZHdvcmtzLmxvZycpLFxuICAgICAgLy8gfVxuICAgIF1cbiAgfVxufTtcblxuLyoqXG4gKiBUaGUgYHNlcnZlcmAgb2JqZWN0IGNvbnRhaW5zIHRoZSBiYXNpYyBtZXRob2RzIG9mIHRoZSBzZXJ2ZXIuXG4gKiBGb3IgaW5zdGFuY2UsIHRoaXMgb2JqZWN0IGFsbG93cyBzZXR0aW5nIHVwLCBjb25maWd1cmluZyBhbmQgc3RhcnRpbmcgdGhlIHNlcnZlciB3aXRoIHRoZSBtZXRob2QgYHN0YXJ0YCB3aGlsZSB0aGUgbWV0aG9kIGBtYXBgIGFsbG93cyBmb3IgbWFuYWdpbmcgdGhlIG1hcHBpbmcgYmV0d2VlbiBkaWZmZXJlbnQgdHlwZXMgb2YgY2xpZW50cyBhbmQgdGhlaXIgcmVxdWlyZWQgc2VydmVyIG1vZHVsZXMuXG4gKiBBZGRpdGlvbmFsbHksIHRoZSBtZXRob2QgYGJyb2FkY2FzdGAgYWxsb3dzIHRvIHNlbmQgbWVzc2FnZXMgdG8gYWxsIGNvbm5lY3RlZCBjbGllbnRzIHZpYSBXZWJTb2NrZXRzIG9yIE9TQy5cbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IHtcblxuICAvKipcbiAgICogV2ViU29ja2V0IHNlcnZlci5cbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGlvOiBudWxsLFxuXG4gIC8qKlxuICAgKiBFeHByZXNzIGFwcGxpY2F0aW9uXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xuICBleHByZXNzQXBwOiBudWxsLFxuICAvKipcbiAgICogSHR0cCBzZXJ2ZXJcbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG4gIGh0dHBTZXJ2ZXI6IG51bGwsXG5cbiAgLyoqXG4gICAqIEFwcGxpY2F0aW9uIGNvbmZpZ3VyYXRpb24gaW5mb3JtYXRpb24uXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBhcHBDb25maWc6IHt9LCAvLyBob3N0IGVudiBjb25maWcgaW5mb3JtYXRpb25zIChkZXYgLyBwcm9kKVxuXG4gIC8qKlxuICAgKiBFbnZpcm9ubWVudCBjb25maWd1cmF0aW9uIGluZm9ybWF0aW9uIChkZXZlbG9wbWVudCAvIHByb2R1Y3Rpb24pLlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZW52Q29uZmlnOiB7fSwgLy8gaG9zdCBlbnYgY29uZmlnIGluZm9ybWF0aW9ucyAoZGV2IC8gcHJvZClcblxuICAvKipcbiAgICogT1NDIG9iamVjdC5cbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIG9zYzogbnVsbCxcblxuICAvKipcbiAgICogU3RhcnQgdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtPYmplY3R9IFthcHBDb25maWc9e31dIEFwcGxpY2F0aW9uIGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAgICogQGF0dHJpYnV0ZSB7U3RyaW5nfSBbYXBwQ29uZmlnLnB1YmxpY0ZvbGRlcj0nLi9wdWJsaWMnXSBQYXRoIHRvIHRoZSBwdWJsaWMgZm9sZGVyLlxuICAgKiBAYXR0cmlidXRlIHtPYmplY3R9IFthcHBDb25maWcuc29ja2V0SU89e31dIHNvY2tldC5pbyBvcHRpb25zLiBUaGUgc29ja2V0LmlvIGNvbmZpZyBvYmplY3QgY2FuIGhhdmUgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICAgKiAtIGB0cmFuc3BvcnRzOlN0cmluZ2A6IGNvbW11bmljYXRpb24gdHJhbnNwb3J0IChkZWZhdWx0cyB0byBgJ3dlYnNvY2tldCdgKTtcbiAgICogLSBgcGluZ1RpbWVvdXQ6TnVtYmVyYDogdGltZW91dCAoaW4gbWlsbGlzZWNvbmRzKSBiZWZvcmUgdHJ5aW5nIHRvIHJlZXN0YWJsaXNoIGEgY29ubmVjdGlvbiBiZXR3ZWVuIGEgbG9zdCBjbGllbnQgYW5kIGEgc2VydmVyIChkZWZhdXRscyB0byBgNjAwMDBgKTtcbiAgICogLSBgcGluZ0ludGVydmFsOk51bWJlcmA6IHRpbWUgaW50ZXJ2YWwgKGluIG1pbGxpc2Vjb25kcykgdG8gc2VuZCBhIHBpbmcgdG8gYSBjbGllbnQgdG8gY2hlY2sgdGhlIGNvbm5lY3Rpb24gKGRlZmF1bHRzIHRvIGA1MDAwMGApLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW2VudkNvbmZpZz17fV0gRW52aXJvbm1lbnQgY29uZmlndXJhdGlvbiBvcHRpb25zLlxuICAgKiBAYXR0cmlidXRlIHtOdW1iZXJ9IFtlbnZDb25maWcucG9ydD04MDAwXSBQb3J0IG9mIHRoZSBIVFRQIHNlcnZlci5cbiAgICogQGF0dHJpYnV0ZSB7T2JqZWN0fSBbZW52Q29uZmlnLm9zYz17fV0gT1NDIG9wdGlvbnMuIFRoZSBPU0MgY29uZmlnIG9iamVjdCBjYW4gaGF2ZSB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gICAqIC0gYGxvY2FsQWRkcmVzczpTdHJpbmdgOiBhZGRyZXNzIG9mIHRoZSBsb2NhbCBtYWNoaW5lIHRvIHJlY2VpdmUgT1NDIG1lc3NhZ2VzIChkZWZhdWx0cyB0byBgJzEyNy4wLjAuMSdgKTtcbiAgICogLSBgbG9jYWxQb3J0Ok51bWJlcmA6IHBvcnQgb2YgdGhlIGxvY2FsIG1hY2hpbmUgdG8gcmVjZWl2ZSBPU0MgbWVzc2FnZXMgKGRlZmF1bHRzIHRvIGA1NzEyMWApO1xuICAgKiAtIGByZW1vdGVBZGRyZXNzOlN0cmluZ2A6IGFkZHJlc3Mgb2YgdGhlIGRldmljZSB0byBzZW5kIGRlZmF1bHQgT1NDIG1lc3NhZ2VzIHRvIChkZWZhdWx0cyB0byBgJzEyNy4wLjAuMSdgKTtcbiAgICogLSBgcmVtb3RlUG9ydDpOdW1iZXJgOiBwb3J0IG9mIHRoZSBkZXZpY2UgdG8gc2VuZCBkZWZhdWx0IE9TQyBtZXNzYWdlcyB0byAoZGVmYXVsdHMgdG8gYDU3MTIwYCkuXG4gICAqL1xuICBzdGFydChhcHBDb25maWcgPSB7fSwgZW52Q29uZmlnID0ge30pIHtcbiAgICAvLyBAdG9kbyAtIGFkZCAxIGxldmVsIG9mIG1lcmdpbmcgdG8gT2JqZWN0LmFzc2lnblxuICAgIGFwcENvbmZpZyA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdEFwcENvbmZpZywgYXBwQ29uZmlnKTtcbiAgICBlbnZDb25maWcgPSBPYmplY3QuYXNzaWduKGRlZmF1bHRFbnZDb25maWcsIGVudkNvbmZpZyk7XG4gICAgdGhpcy5hcHBDb25maWcgPSBhcHBDb25maWc7XG4gICAgdGhpcy5lbnZDb25maWcgPSBlbnZDb25maWc7XG5cbiAgICAvLyBjb25maWd1cmUgZXhwcmVzcyBhbmQgaHR0cCBzZXJ2ZXJcbiAgICBjb25zdCBleHByZXNzQXBwID0gbmV3IGV4cHJlc3MoKTtcbiAgICBleHByZXNzQXBwLnNldCgncG9ydCcsIHByb2Nlc3MuZW52LlBPUlQgfHwgZW52Q29uZmlnLnBvcnQpO1xuICAgIGV4cHJlc3NBcHAuc2V0KCd2aWV3IGVuZ2luZScsICdlanMnKTtcbiAgICBleHByZXNzQXBwLnVzZShleHByZXNzLnN0YXRpYyhhcHBDb25maWcucHVibGljRm9sZGVyKSk7XG5cbiAgICBjb25zdCBodHRwU2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoZXhwcmVzc0FwcCk7XG4gICAgaHR0cFNlcnZlci5saXN0ZW4oZXhwcmVzc0FwcC5nZXQoJ3BvcnQnKSwgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCB1cmwgPSBgaHR0cDovLzEyNy4wLjAuMToke2V4cHJlc3NBcHAuZ2V0KCdwb3J0Jyl9YDtcbiAgICAgIGNvbnNvbGUubG9nKCdbSFRUUCBTRVJWRVJdIFNlcnZlciBsaXN0ZW5pbmcgb24nLCB1cmwpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5leHByZXNzQXBwID0gZXhwcmVzc0FwcDtcbiAgICB0aGlzLmh0dHBTZXJ2ZXIgPSBodHRwU2VydmVyO1xuXG4gICAgdGhpcy5pbyA9IG5ldyBJTyhodHRwU2VydmVyLCBhcHBDb25maWcuc29ja2V0SU8pO1xuICAgIGNvbW0uaW5pdGlhbGl6ZSh0aGlzLmlvKTtcbiAgICBsb2dnZXIuaW5pdGlhbGl6ZShlbnZDb25maWcubG9nZ2VyKTtcblxuICAgIC8vIGNvbmZpZ3VyZSBPU0NcbiAgICBpZiAoZW52Q29uZmlnLm9zYykge1xuICAgICAgdGhpcy5vc2MgPSBuZXcgb3NjLlVEUFBvcnQoe1xuICAgICAgICAvLyBUaGlzIGlzIHRoZSBwb3J0IHdlJ3JlIGxpc3RlbmluZyBvbi5cbiAgICAgICAgLy8gQG5vdGUgcmVuYW1lIHRvIHJlY2VpdmVBZGRyZXNzIC8gcmVjZWl2ZVBvcnRcbiAgICAgICAgbG9jYWxBZGRyZXNzOiBlbnZDb25maWcub3NjLmxvY2FsQWRkcmVzcyxcbiAgICAgICAgbG9jYWxQb3J0OiBlbnZDb25maWcub3NjLmxvY2FsUG9ydCxcbiAgICAgICAgLy8gVGhpcyBpcyB0aGUgcG9ydCB3ZSB1c2UgdG8gc2VuZCBtZXNzYWdlcy5cbiAgICAgICAgLy8gQG5vdGUgcmVuYW1lIHRvIHNlbmRBZGRyZXNzIC8gc2VuZFBvcnRcbiAgICAgICAgcmVtb3RlQWRkcmVzczogZW52Q29uZmlnLm9zYy5yZW1vdGVBZGRyZXNzLFxuICAgICAgICByZW1vdGVQb3J0OiBlbnZDb25maWcub3NjLnJlbW90ZVBvcnQsXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5vc2Mub24oJ3JlYWR5JywgKCkgPT4ge1xuICAgICAgICBjb25zdCByZWNlaXZlID0gYCR7ZW52Q29uZmlnLm9zYy5sb2NhbEFkZHJlc3N9OiR7ZW52Q29uZmlnLm9zYy5sb2NhbFBvcnR9YDtcbiAgICAgICAgY29uc3Qgc2VuZCA9IGAke2VudkNvbmZpZy5vc2MucmVtb3RlQWRkcmVzc306JHtlbnZDb25maWcub3NjLnJlbW90ZVBvcnR9YDtcbiAgICAgICAgY29uc29sZS5sb2coYFtPU0Mgb3ZlciBVRFBdIFJlY2VpdmluZyBvbiAke3JlY2VpdmV9YCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGBbT1NDIG92ZXIgVURQXSBTZW5kaW5nIG9uICR7c2VuZH1gKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm9zYy5vbignbWVzc2FnZScsIChvc2NNc2cpID0+IHtcbiAgICAgICAgY29uc3QgYWRkcmVzcyA9IG9zY01zZy5hZGRyZXNzO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3NjTGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGFkZHJlc3MgPT09IG9zY0xpc3RlbmVyc1tpXS53aWxkY2FyZClcbiAgICAgICAgICAgIG9zY0xpc3RlbmVyc1tpXS5jYWxsYmFjayhvc2NNc2cpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5vc2Mub3BlbigpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogSW5kaWNhdGUgdGhhdCB0aGUgY2xpZW50cyBvZiB0eXBlIGBjbGllbnRUeXBlYCByZXF1aXJlIHRoZSBtb2R1bGVzIGAuLi5tb2R1bGVzYCBvbiB0aGUgc2VydmVyIHNpZGUuXG4gICAqIEFkZGl0aW9uYWxseSwgdGhpcyBtZXRob2Qgcm91dGVzIHRoZSBjb25uZWN0aW9ucyBmcm9tIHRoZSBjb3JyZXNwb25kaW5nIFVSTCB0byB0aGUgY29ycmVzcG9uZGluZyB2aWV3LlxuICAgKiBNb3JlIHNwZWNpZmljYWxseTpcbiAgICogLSBBIGNsaWVudCBjb25uZWN0aW5nIHRvIHRoZSBzZXJ2ZXIgdGhyb3VnaCB0aGUgcm9vdCBVUkwgYGh0dHA6Ly9teS5zZXJ2ZXIuYWRkcmVzczpwb3J0L2AgaXMgY29uc2lkZXJlZCBhcyBhIGAncGxheWVyJ2AgY2xpZW50IGFuZCBkaXNwbGF5cyB0aGUgdmlldyBgcGxheWVyLmVqc2A7XG4gICAqIC0gQSBjbGllbnQgY29ubmVjdGluZyB0byB0aGUgc2VydmVyIHRocm91Z2ggdGhlIFVSTCBgaHR0cDovL215LnNlcnZlci5hZGRyZXNzOnBvcnQvY2xpZW50VHlwZWAgaXMgY29uc2lkZXJlZCBhcyBhIGBjbGllbnRUeXBlYCBjbGllbnQsIGFuZCBkaXNwbGF5cyB0aGUgdmlldyBgY2xpZW50VHlwZS5lanNgLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2xpZW50VHlwZSBDbGllbnQgdHlwZSAoYXMgZGVmaW5lZCBieSB0aGUgbWV0aG9kIHtAbGluayBjbGllbnQuaW5pdH0gb24gdGhlIGNsaWVudCBzaWRlKS5cbiAgICogQHBhcmFtIHsuLi5DbGllbnRNb2R1bGV9IG1vZHVsZXMgTW9kdWxlcyB0byBtYXAgdG8gdGhhdCBjbGllbnQgdHlwZS5cbiAgICovXG4gIG1hcChjbGllbnRUeXBlLCAuLi5tb2R1bGVzKSB7XG4gICAgY29uc3QgdXJsID0gKGNsaWVudFR5cGUgIT09IHRoaXMuYXBwQ29uZmlnLmRlZmF1bHRDbGllbnQpID8gYC8ke2NsaWVudFR5cGV9YCA6ICcvJztcbiAgICAvLyBjYWNoZSBjb21waWxlZCB0ZW1wbGF0ZVxuICAgIGNvbnN0IHRtcGxQYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICd2aWV3cycsIGNsaWVudFR5cGUgKyAnLmVqcycpO1xuICAgIGNvbnN0IHRtcGxTdHJpbmcgPSBmcy5yZWFkRmlsZVN5bmModG1wbFBhdGgsIHsgZW5jb2Rpbmc6ICd1dGY4JyB9KTtcbiAgICBjb25zdCB0bXBsID0gZWpzLmNvbXBpbGUodG1wbFN0cmluZyk7XG5cbiAgICAvLyBAdG9kbyByZWZhY3RvclxuICAgIC8vIHdyaXRlIGVudiBjb25maWcgaW50byB0ZW1wbGF0ZXNcbiAgICB0aGlzLmV4cHJlc3NBcHAuZ2V0KHVybCwgKHJlcSwgcmVzKSA9PiB7XG4gICAgICBjb25zdCBlbnZDb25maWdDb3B5ID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5lbnZDb25maWcpO1xuICAgICAgLy8gcmVtb3ZlIGxvZ2dlciBjb25maWd1cmF0aW9uXG4gICAgICBlbnZDb25maWdDb3B5LmxvZ2dlciA9IHVuZGVmaW5lZDtcbiAgICAgIHJlcy5zZW5kKHRtcGwoe1xuICAgICAgICBlbnZDb25maWc6IEpTT04uc3RyaW5naWZ5KGVudkNvbmZpZ0NvcHkpXG4gICAgICB9KSk7XG4gICAgfSk7XG5cbiAgICBtb2R1bGVzLmZvckVhY2goKG1vZCkgPT4geyBtb2QuY29uZmlndXJlKHRoaXMuYXBwQ29uZmlnLCB0aGlzLmVudkNvbmZpZykgfSlcblxuICAgIHRoaXMuaW8ub2YoY2xpZW50VHlwZSkub24oJ2Nvbm5lY3Rpb24nLCAoc29ja2V0KSA9PiB7XG4gICAgICBjb25zdCBjbGllbnQgPSBuZXcgQ2xpZW50KGNsaWVudFR5cGUsIHNvY2tldCk7XG4gICAgICBtb2R1bGVzLmZvckVhY2goKG1vZCkgPT4geyBtb2QuY29ubmVjdChjbGllbnQpIH0pO1xuXG4gICAgICAvLyBnbG9iYWwgbGlmZWN5Y2xlIG9mIHRoZSBjbGllbnRcbiAgICAgIGNvbW0ucmVjZWl2ZShjbGllbnQsICdkaXNjb25uZWN0JywgKCkgPT4ge1xuICAgICAgICBtb2R1bGVzLmZvckVhY2goKG1vZCkgPT4geyBtb2QuZGlzY29ubmVjdChjbGllbnQpIH0pO1xuICAgICAgICBjbGllbnQuZGVzdHJveSgpO1xuICAgICAgICBsb2dnZXIuaW5mbyh7IHNvY2tldDogc29ja2V0LCBjbGllbnRUeXBlOiBjbGllbnRUeXBlIH0sICdkaXNjb25uZWN0Jyk7XG4gICAgICB9KTtcblxuICAgICAgY29tbS5zZW5kKGNsaWVudCwgJ2NsaWVudDpzdGFydCcsIGNsaWVudC5pbmRleCk7IC8vIHRoZSBzZXJ2ZXIgaXMgcmVhZHlcbiAgICAgIGxvZ2dlci5pbmZvKHsgc29ja2V0OiBzb2NrZXQsIGNsaWVudFR5cGU6IGNsaWVudFR5cGUgfSwgJ2Nvbm5lY3Rpb24nKTtcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogU2VuZCBhbiBPU0MgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IHdpbGRjYXJkIFdpbGRjYXJkIG9mIHRoZSBPU0MgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtBcnJheX0gYXJncyBBcmd1bWVudHMgb2YgdGhlIE9TQyBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW3VybD1udWxsXSBVUkwgdG8gc2VuZCB0aGUgT1NDIG1lc3NhZ2UgdG8gKGlmIG5vdCBzcGVjaWZpZWQsIHVzZXMgdGhlIGFkZHJlc3MgZGVmaW5lZCBpbiB0aGUgT1NDIGNvbmZpZyBvciBpbiB0aGUgb3B0aW9ucyBvZiB0aGUge0BsaW5rIHNlcnZlci5zdGFydH0gbWV0aG9kKS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtwb3J0PW51bGxdIFBvcnQgdG8gc2VuZCB0aGUgbWVzc2FnZSB0byAoaWYgbm90IHNwZWNpZmllZCwgdXNlcyB0aGUgcG9ydCBkZWZpbmVkIGluIHRoZSBPU0MgY29uZmlnIG9yIGluIHRoZSBvcHRpb25zIG9mIHRoZSB7QGxpbmsgc2VydmVyLnN0YXJ0fSBtZXRob2QpLlxuICAgKi9cbiAgc2VuZE9TQyh3aWxkY2FyZCwgYXJncywgdXJsID0gbnVsbCwgcG9ydCA9IG51bGwpIHtcbiAgICBjb25zdCBvc2NNc2cgPSB7XG4gICAgICBhZGRyZXNzOiB3aWxkY2FyZCxcbiAgICAgIGFyZ3M6IGFyZ3NcbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgIGlmICh1cmwgJiYgcG9ydCkge1xuICAgICAgICB0aGlzLm9zYy5zZW5kKG9zY01zZywgdXJsLCBwb3J0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub3NjLnNlbmQob3NjTXNnKTsgLy8gdXNlIGRlZmF1bHRzIChhcyBkZWZpbmVkIGluIHRoZSBjb25maWcpXG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5sb2coJ0Vycm9yIHdoaWxlIHNlbmRpbmcgT1NDIG1lc3NhZ2U6JywgZSk7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBMaXN0ZW4gZm9yIE9TQyBtZXNzYWdlIGFuZCBleGVjdXRlIGEgY2FsbGJhY2sgZnVuY3Rpb24uXG4gICAqIFRoZSBzZXJ2ZXIgbGlzdGVucyB0byBPU0MgbWVzc2FnZXMgYXQgdGhlIGFkZHJlc3MgYW5kIHBvcnQgZGVmaW5lZCBpbiB0aGUgY29uZmlnIG9yIGluIHRoZSBvcHRpb25zIG9mIHRoZSB7QGxpbmsgc2VydmVyLnN0YXJ0fSBtZXRob2QuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB3aWxkY2FyZCBXaWxkY2FyZCBvZiB0aGUgT1NDIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIENhbGxiYWNrIGZ1bmN0aW9uIGV4ZWN1dGVkIHdoZW4gdGhlIE9TQyBtZXNzYWdlIGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgcmVjZWl2ZU9TQyh3aWxkY2FyZCwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBvc2NMaXN0ZW5lciA9IHtcbiAgICAgIHdpbGRjYXJkOiB3aWxkY2FyZCxcbiAgICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICAgIH07XG5cbiAgICBvc2NMaXN0ZW5lcnMucHVzaChvc2NMaXN0ZW5lcik7XG4gIH1cbn07XG5cbiJdfQ==