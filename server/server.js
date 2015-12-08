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
  },
  wallSetup: {
    width: 10,
    height: 10,
    background: null,
    spacing: 1,
    capacity: 100,
    coordinates: [],
    labels: [],
    generator: {
      type: 'matrix',
      cols: 3,
      rows: 4
    }
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
    _logger2['default'].initialize(envConfig.loggerConfiguration);

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

    // write env config into templates
    this.expressApp.get(url, function (req, res) {
      res.send(tmpl({ envConfig: JSON.stringify(_this.envConfig) }));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvc2VydmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBQWlCLFFBQVE7Ozs7bUJBQ1QsS0FBSzs7Ozt1QkFDRCxTQUFTOzs7O2tCQUNkLElBQUk7Ozs7b0JBQ0YsTUFBTTs7OztzQkFDSixVQUFVOzs7O3dCQUNkLFdBQVc7Ozs7bUJBQ1YsS0FBSzs7OztvQkFDSixNQUFNOzs7O3NCQUNKLFVBQVU7Ozs7Ozs7QUFLN0IsSUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDOztBQUV4QixJQUFNLGdCQUFnQixHQUFHO0FBQ3ZCLGNBQVksRUFBRSxrQkFBSyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLFFBQVEsQ0FBQztBQUNoRCxlQUFhLEVBQUUsUUFBUTtBQUN2QixVQUFRLEVBQUU7QUFDUixjQUFVLEVBQUUsQ0FBQyxXQUFXLENBQUM7QUFDekIsZUFBVyxFQUFFLEtBQUs7QUFDbEIsZ0JBQVksRUFBRSxLQUFLOzs7Ozs7R0FNcEI7QUFDRCxXQUFTLEVBQUU7QUFDVCxTQUFLLEVBQUUsRUFBRTtBQUNULFVBQU0sRUFBRSxFQUFFO0FBQ1YsY0FBVSxFQUFFLElBQUk7QUFDaEIsV0FBTyxFQUFFLENBQUM7QUFDVixZQUFRLEVBQUUsR0FBRztBQUNiLGVBQVcsRUFBRSxFQUFFO0FBQ2YsVUFBTSxFQUFFLEVBQUU7QUFDVixhQUFTLEVBQUU7QUFDVCxVQUFJLEVBQUUsUUFBUTtBQUNkLFVBQUksRUFBRSxDQUFDO0FBQ1AsVUFBSSxFQUFFLENBQUM7S0FDUjtHQUNGO0NBQ0YsQ0FBQzs7QUFFRixJQUFNLGdCQUFnQixHQUFHO0FBQ3ZCLE1BQUksRUFBRSxJQUFJO0FBQ1YsS0FBRyxFQUFFO0FBQ0gsZ0JBQVksRUFBRSxXQUFXO0FBQ3pCLGFBQVMsRUFBRSxLQUFLO0FBQ2hCLGlCQUFhLEVBQUUsV0FBVztBQUMxQixjQUFVLEVBQUUsS0FBSztHQUNsQjtBQUNELFFBQU0sRUFBRTtBQUNOLFFBQUksRUFBRSxZQUFZO0FBQ2xCLFNBQUssRUFBRSxNQUFNO0FBQ2IsV0FBTyxFQUFFLENBQUM7QUFDUixXQUFLLEVBQUUsTUFBTTtBQUNiLFlBQU0sRUFBRSxPQUFPLENBQUMsTUFBTTtLQUN2QixDQUdHO0dBQ0w7Q0FDRixDQUFDOzs7Ozs7Ozs7Ozt3QkFRYTs7Ozs7OztBQU9iLElBQUUsRUFBRSxJQUFJOzs7Ozs7QUFNUixZQUFVLEVBQUUsSUFBSTs7Ozs7QUFLaEIsWUFBVSxFQUFFLElBQUk7Ozs7Ozs7QUFPaEIsV0FBUyxFQUFFLEVBQUU7Ozs7Ozs7QUFPYixXQUFTLEVBQUUsRUFBRTs7Ozs7OztBQU9iLEtBQUcsRUFBRSxJQUFJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQlQsT0FBSyxFQUFBLGlCQUFpQztRQUFoQyxTQUFTLHlEQUFHLEVBQUU7UUFBRSxTQUFTLHlEQUFHLEVBQUU7O0FBQ2xDLGFBQVMsR0FBRyxlQUFjLGdCQUFnQixFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3ZELGFBQVMsR0FBRyxlQUFjLGdCQUFnQixFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3ZELFFBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQzNCLFFBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDOzs7QUFHM0IsUUFBTSxVQUFVLEdBQUcsMEJBQWEsQ0FBQztBQUNqQyxjQUFVLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDM0QsY0FBVSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDckMsY0FBVSxDQUFDLEdBQUcsQ0FBQyw4QkFBYyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDOztBQUV2RCxRQUFNLFVBQVUsR0FBRyxrQkFBSyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDakQsY0FBVSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFlBQVc7QUFDbkQsVUFBTSxHQUFHLHlCQUF1QixVQUFVLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxBQUFFLENBQUM7QUFDekQsYUFBTyxDQUFDLEdBQUcsQ0FBQyxtQ0FBbUMsRUFBRSxHQUFHLENBQUMsQ0FBQztLQUN2RCxDQUFDLENBQUM7O0FBRUgsUUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7QUFDN0IsUUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7O0FBRTdCLFFBQUksQ0FBQyxFQUFFLEdBQUcsMEJBQU8sVUFBVSxFQUFFLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNqRCxzQkFBSyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3pCLHdCQUFPLFVBQVUsQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQUMsQ0FBQzs7O0FBR2pELFFBQUksU0FBUyxDQUFDLEdBQUcsRUFBRTtBQUNqQixVQUFJLENBQUMsR0FBRyxHQUFHLElBQUksaUJBQUksT0FBTyxDQUFDOzs7QUFHekIsb0JBQVksRUFBRSxTQUFTLENBQUMsR0FBRyxDQUFDLFlBQVk7QUFDeEMsaUJBQVMsRUFBRSxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVM7OztBQUdsQyxxQkFBYSxFQUFFLFNBQVMsQ0FBQyxHQUFHLENBQUMsYUFBYTtBQUMxQyxrQkFBVSxFQUFFLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVTtPQUNyQyxDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFlBQU07QUFDekIsWUFBTSxPQUFPLEdBQU0sU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLFNBQUksU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEFBQUUsQ0FBQztBQUMzRSxZQUFNLElBQUksR0FBTSxTQUFTLENBQUMsR0FBRyxDQUFDLGFBQWEsU0FBSSxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQUFBRSxDQUFDO0FBQzFFLGVBQU8sQ0FBQyxHQUFHLGtDQUFnQyxPQUFPLENBQUcsQ0FBQztBQUN0RCxlQUFPLENBQUMsR0FBRyxnQ0FBOEIsSUFBSSxDQUFHLENBQUM7T0FDbEQsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxVQUFDLE1BQU0sRUFBSztBQUNqQyxZQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDOztBQUUvQixhQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUM1QyxjQUFJLE9BQU8sS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUN0QyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3BDO09BQ0YsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDakI7R0FDRjs7Ozs7Ozs7Ozs7QUFXRCxLQUFHLEVBQUEsYUFBQyxVQUFVLEVBQWM7OztzQ0FBVCxPQUFPO0FBQVAsYUFBTzs7O0FBQ3hCLFFBQU0sR0FBRyxHQUFHLEFBQUMsVUFBVSxLQUFLLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxTQUFRLFVBQVUsR0FBSyxHQUFHLENBQUM7O0FBRW5GLFFBQU0sUUFBUSxHQUFHLGtCQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLFVBQVUsR0FBRyxNQUFNLENBQUMsQ0FBQztBQUN4RSxRQUFNLFVBQVUsR0FBRyxnQkFBRyxZQUFZLENBQUMsUUFBUSxFQUFFLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDbkUsUUFBTSxJQUFJLEdBQUcsaUJBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDOzs7QUFHckMsUUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLFVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBSztBQUNyQyxTQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQUssU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDL0QsQ0FBQyxDQUFDOztBQUVILFdBQU8sQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHLEVBQUs7QUFBRSxTQUFHLENBQUMsU0FBUyxDQUFDLE1BQUssU0FBUyxFQUFFLE1BQUssU0FBUyxDQUFDLENBQUE7S0FBRSxDQUFDLENBQUE7O0FBRTNFLFFBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsVUFBQyxNQUFNLEVBQUs7QUFDbEQsVUFBTSxNQUFNLEdBQUcsd0JBQVcsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzlDLGFBQU8sQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHLEVBQUs7QUFBRSxXQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO09BQUUsQ0FBQyxDQUFDOzs7QUFHbEQsd0JBQUssT0FBTyxDQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUUsWUFBTTtBQUN2QyxlQUFPLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRyxFQUFLO0FBQUUsYUFBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQTtTQUFFLENBQUMsQ0FBQztBQUNyRCxjQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDakIsNEJBQU8sSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLEVBQUUsWUFBWSxDQUFDLENBQUM7T0FDdkUsQ0FBQyxDQUFDOztBQUVILHdCQUFLLElBQUksQ0FBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNoRCwwQkFBTyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsRUFBRSxZQUFZLENBQUMsQ0FBQztLQUN2RSxDQUFDLENBQUM7R0FDSjs7Ozs7Ozs7O0FBU0QsU0FBTyxFQUFBLGlCQUFDLFFBQVEsRUFBRSxJQUFJLEVBQTJCO1FBQXpCLEdBQUcseURBQUcsSUFBSTtRQUFFLElBQUkseURBQUcsSUFBSTs7QUFDN0MsUUFBTSxNQUFNLEdBQUc7QUFDYixhQUFPLEVBQUUsUUFBUTtBQUNqQixVQUFJLEVBQUUsSUFBSTtLQUNYLENBQUM7O0FBRUYsUUFBSTtBQUNGLFVBQUksR0FBRyxJQUFJLElBQUksRUFBRTtBQUNmLFlBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7T0FDbEMsTUFBTTtBQUNMLFlBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO09BQ3ZCO0tBQ0YsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNWLGFBQU8sQ0FBQyxHQUFHLENBQUMsa0NBQWtDLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDcEQ7R0FDRjs7Ozs7Ozs7O0FBU0QsWUFBVSxFQUFBLG9CQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUU7QUFDN0IsUUFBTSxXQUFXLEdBQUc7QUFDbEIsY0FBUSxFQUFFLFFBQVE7QUFDbEIsY0FBUSxFQUFFLFFBQVE7S0FDbkIsQ0FBQzs7QUFFRixnQkFBWSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztHQUNoQztDQUNGIiwiZmlsZSI6InNyYy9zZXJ2ZXIvc2VydmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNvbW0gZnJvbSAnLi9jb21tJztcbmltcG9ydCBlanMgZnJvbSAnZWpzJztcbmltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBodHRwIGZyb20gJ2h0dHAnO1xuaW1wb3J0IGxvZ2dlciBmcm9tICcuL2xvZ2dlcic7XG5pbXBvcnQgSU8gZnJvbSAnc29ja2V0LmlvJztcbmltcG9ydCBvc2MgZnJvbSAnb3NjJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IENsaWVudCBmcm9tICcuL0NsaWVudCc7XG5cbi8vIGdsb2JhbHNcbi8vIEB0b2RvIGhpZGUgdGhpcyBpbnRvIGNsaWVudFxuXG5jb25zdCBvc2NMaXN0ZW5lcnMgPSBbXTtcblxuY29uc3QgZGVmYXVsdEFwcENvbmZpZyA9IHtcbiAgcHVibGljRm9sZGVyOiBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3B1YmxpYycpLFxuICBkZWZhdWx0Q2xpZW50OiAncGxheWVyJyxcbiAgc29ja2V0SU86IHtcbiAgICB0cmFuc3BvcnRzOiBbJ3dlYnNvY2tldCddLFxuICAgIHBpbmdUaW1lb3V0OiA2MDAwMCxcbiAgICBwaW5nSW50ZXJ2YWw6IDUwMDAwXG4gICAgLy8gQG5vdGU6IEVuZ2luZUlPIGRlZmF1bHRzXG4gICAgLy8gcGluZ1RpbWVvdXQ6IDMwMDAsXG4gICAgLy8gcGluZ0ludGVydmFsOiAxMDAwLFxuICAgIC8vIHVwZ3JhZGVUaW1lb3V0OiAxMDAwMCxcbiAgICAvLyBtYXhIdHRwQnVmZmVyU2l6ZTogMTBFNyxcbiAgfSxcbiAgd2FsbFNldHVwOiB7XG4gICAgd2lkdGg6IDEwLFxuICAgIGhlaWdodDogMTAsXG4gICAgYmFja2dyb3VuZDogbnVsbCxcbiAgICBzcGFjaW5nOiAxLFxuICAgIGNhcGFjaXR5OiAxMDAsXG4gICAgY29vcmRpbmF0ZXM6IFtdLFxuICAgIGxhYmVsczogW10sXG4gICAgZ2VuZXJhdG9yOiB7XG4gICAgICB0eXBlOiAnbWF0cml4JyxcbiAgICAgIGNvbHM6IDMsXG4gICAgICByb3dzOiA0LFxuICAgIH0sXG4gIH0sXG59O1xuXG5jb25zdCBkZWZhdWx0RW52Q29uZmlnID0ge1xuICBwb3J0OiA4MDAwLFxuICBvc2M6IHtcbiAgICBsb2NhbEFkZHJlc3M6ICcxMjcuMC4wLjEnLFxuICAgIGxvY2FsUG9ydDogNTcxMjEsXG4gICAgcmVtb3RlQWRkcmVzczogJzEyNy4wLjAuMScsXG4gICAgcmVtb3RlUG9ydDogNTcxMjAsXG4gIH0sXG4gIGxvZ2dlcjoge1xuICAgIG5hbWU6ICdzb3VuZHdvcmtzJyxcbiAgICBsZXZlbDogJ2luZm8nLFxuICAgIHN0cmVhbXM6IFt7XG4gICAgICBsZXZlbDogJ2luZm8nLFxuICAgICAgc3RyZWFtOiBwcm9jZXNzLnN0ZG91dCxcbiAgICB9LCAvKntcbiAgICAgIGxldmVsOiAnaW5mbycsXG4gICAgICBwYXRoOiBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ2xvZ3MnLCAnc291bmR3b3Jrcy5sb2cnKSxcbiAgICB9Ki9dXG4gIH1cbn07XG5cbi8qKlxuICogVGhlIGBzZXJ2ZXJgIG9iamVjdCBjb250YWlucyB0aGUgYmFzaWMgbWV0aG9kcyBvZiB0aGUgc2VydmVyLlxuICogRm9yIGluc3RhbmNlLCB0aGlzIG9iamVjdCBhbGxvd3Mgc2V0dGluZyB1cCwgY29uZmlndXJpbmcgYW5kIHN0YXJ0aW5nIHRoZSBzZXJ2ZXIgd2l0aCB0aGUgbWV0aG9kIGBzdGFydGAgd2hpbGUgdGhlIG1ldGhvZCBgbWFwYCBhbGxvd3MgZm9yIG1hbmFnaW5nIHRoZSBtYXBwaW5nIGJldHdlZW4gZGlmZmVyZW50IHR5cGVzIG9mIGNsaWVudHMgYW5kIHRoZWlyIHJlcXVpcmVkIHNlcnZlciBtb2R1bGVzLlxuICogQWRkaXRpb25hbGx5LCB0aGUgbWV0aG9kIGBicm9hZGNhc3RgIGFsbG93cyB0byBzZW5kIG1lc3NhZ2VzIHRvIGFsbCBjb25uZWN0ZWQgY2xpZW50cyB2aWEgV2ViU29ja2V0cyBvciBPU0MuXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5leHBvcnQgZGVmYXVsdCB7XG5cbiAgLyoqXG4gICAqIFdlYlNvY2tldCBzZXJ2ZXIuXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBpbzogbnVsbCxcblxuICAvKipcbiAgICogRXhwcmVzcyBhcHBsaWNhdGlvblxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgZXhwcmVzc0FwcDogbnVsbCxcbiAgLyoqXG4gICAqIEh0dHAgc2VydmVyXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xuICBodHRwU2VydmVyOiBudWxsLFxuXG4gIC8qKlxuICAgKiBBcHBsaWNhdGlvbiBjb25maWd1cmF0aW9uIGluZm9ybWF0aW9uLlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgYXBwQ29uZmlnOiB7fSwgLy8gaG9zdCBlbnYgY29uZmlnIGluZm9ybWF0aW9ucyAoZGV2IC8gcHJvZClcblxuICAvKipcbiAgICogRW52aXJvbm1lbnQgY29uZmlndXJhdGlvbiBpbmZvcm1hdGlvbiAoZGV2ZWxvcG1lbnQgLyBwcm9kdWN0aW9uKS5cbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGVudkNvbmZpZzoge30sIC8vIGhvc3QgZW52IGNvbmZpZyBpbmZvcm1hdGlvbnMgKGRldiAvIHByb2QpXG5cbiAgLyoqXG4gICAqIE9TQyBvYmplY3QuXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBvc2M6IG51bGwsXG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbYXBwQ29uZmlnPXt9XSBBcHBsaWNhdGlvbiBjb25maWd1cmF0aW9uIG9wdGlvbnMuXG4gICAqIEBhdHRyaWJ1dGUge1N0cmluZ30gW2FwcENvbmZpZy5wdWJsaWNGb2xkZXI9Jy4vcHVibGljJ10gUGF0aCB0byB0aGUgcHVibGljIGZvbGRlci5cbiAgICogQGF0dHJpYnV0ZSB7T2JqZWN0fSBbYXBwQ29uZmlnLnNvY2tldElPPXt9XSBzb2NrZXQuaW8gb3B0aW9ucy4gVGhlIHNvY2tldC5pbyBjb25maWcgb2JqZWN0IGNhbiBoYXZlIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAgICogLSBgdHJhbnNwb3J0czpTdHJpbmdgOiBjb21tdW5pY2F0aW9uIHRyYW5zcG9ydCAoZGVmYXVsdHMgdG8gYCd3ZWJzb2NrZXQnYCk7XG4gICAqIC0gYHBpbmdUaW1lb3V0Ok51bWJlcmA6IHRpbWVvdXQgKGluIG1pbGxpc2Vjb25kcykgYmVmb3JlIHRyeWluZyB0byByZWVzdGFibGlzaCBhIGNvbm5lY3Rpb24gYmV0d2VlbiBhIGxvc3QgY2xpZW50IGFuZCBhIHNlcnZlciAoZGVmYXV0bHMgdG8gYDYwMDAwYCk7XG4gICAqIC0gYHBpbmdJbnRlcnZhbDpOdW1iZXJgOiB0aW1lIGludGVydmFsIChpbiBtaWxsaXNlY29uZHMpIHRvIHNlbmQgYSBwaW5nIHRvIGEgY2xpZW50IHRvIGNoZWNrIHRoZSBjb25uZWN0aW9uIChkZWZhdWx0cyB0byBgNTAwMDBgKS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtlbnZDb25maWc9e31dIEVudmlyb25tZW50IGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAgICogQGF0dHJpYnV0ZSB7TnVtYmVyfSBbZW52Q29uZmlnLnBvcnQ9ODAwMF0gUG9ydCBvZiB0aGUgSFRUUCBzZXJ2ZXIuXG4gICAqIEBhdHRyaWJ1dGUge09iamVjdH0gW2VudkNvbmZpZy5vc2M9e31dIE9TQyBvcHRpb25zLiBUaGUgT1NDIGNvbmZpZyBvYmplY3QgY2FuIGhhdmUgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICAgKiAtIGBsb2NhbEFkZHJlc3M6U3RyaW5nYDogYWRkcmVzcyBvZiB0aGUgbG9jYWwgbWFjaGluZSB0byByZWNlaXZlIE9TQyBtZXNzYWdlcyAoZGVmYXVsdHMgdG8gYCcxMjcuMC4wLjEnYCk7XG4gICAqIC0gYGxvY2FsUG9ydDpOdW1iZXJgOiBwb3J0IG9mIHRoZSBsb2NhbCBtYWNoaW5lIHRvIHJlY2VpdmUgT1NDIG1lc3NhZ2VzIChkZWZhdWx0cyB0byBgNTcxMjFgKTtcbiAgICogLSBgcmVtb3RlQWRkcmVzczpTdHJpbmdgOiBhZGRyZXNzIG9mIHRoZSBkZXZpY2UgdG8gc2VuZCBkZWZhdWx0IE9TQyBtZXNzYWdlcyB0byAoZGVmYXVsdHMgdG8gYCcxMjcuMC4wLjEnYCk7XG4gICAqIC0gYHJlbW90ZVBvcnQ6TnVtYmVyYDogcG9ydCBvZiB0aGUgZGV2aWNlIHRvIHNlbmQgZGVmYXVsdCBPU0MgbWVzc2FnZXMgdG8gKGRlZmF1bHRzIHRvIGA1NzEyMGApLlxuICAgKi9cbiAgc3RhcnQoYXBwQ29uZmlnID0ge30sIGVudkNvbmZpZyA9IHt9KSB7XG4gICAgYXBwQ29uZmlnID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0QXBwQ29uZmlnLCBhcHBDb25maWcpO1xuICAgIGVudkNvbmZpZyA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdEVudkNvbmZpZywgZW52Q29uZmlnKTtcbiAgICB0aGlzLmFwcENvbmZpZyA9IGFwcENvbmZpZztcbiAgICB0aGlzLmVudkNvbmZpZyA9IGVudkNvbmZpZztcblxuICAgIC8vIGNvbmZpZ3VyZSBleHByZXNzIGFuZCBodHRwIHNlcnZlclxuICAgIGNvbnN0IGV4cHJlc3NBcHAgPSBuZXcgZXhwcmVzcygpO1xuICAgIGV4cHJlc3NBcHAuc2V0KCdwb3J0JywgcHJvY2Vzcy5lbnYuUE9SVCB8fCBlbnZDb25maWcucG9ydCk7XG4gICAgZXhwcmVzc0FwcC5zZXQoJ3ZpZXcgZW5naW5lJywgJ2VqcycpO1xuICAgIGV4cHJlc3NBcHAudXNlKGV4cHJlc3Muc3RhdGljKGFwcENvbmZpZy5wdWJsaWNGb2xkZXIpKTtcblxuICAgIGNvbnN0IGh0dHBTZXJ2ZXIgPSBodHRwLmNyZWF0ZVNlcnZlcihleHByZXNzQXBwKTtcbiAgICBodHRwU2VydmVyLmxpc3RlbihleHByZXNzQXBwLmdldCgncG9ydCcpLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHVybCA9IGBodHRwOi8vMTI3LjAuMC4xOiR7ZXhwcmVzc0FwcC5nZXQoJ3BvcnQnKX1gO1xuICAgICAgY29uc29sZS5sb2coJ1tIVFRQIFNFUlZFUl0gU2VydmVyIGxpc3RlbmluZyBvbicsIHVybCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmV4cHJlc3NBcHAgPSBleHByZXNzQXBwO1xuICAgIHRoaXMuaHR0cFNlcnZlciA9IGh0dHBTZXJ2ZXI7XG5cbiAgICB0aGlzLmlvID0gbmV3IElPKGh0dHBTZXJ2ZXIsIGFwcENvbmZpZy5zb2NrZXRJTyk7XG4gICAgY29tbS5pbml0aWFsaXplKHRoaXMuaW8pO1xuICAgIGxvZ2dlci5pbml0aWFsaXplKGVudkNvbmZpZy5sb2dnZXJDb25maWd1cmF0aW9uKTtcblxuICAgIC8vIGNvbmZpZ3VyZSBPU0NcbiAgICBpZiAoZW52Q29uZmlnLm9zYykge1xuICAgICAgdGhpcy5vc2MgPSBuZXcgb3NjLlVEUFBvcnQoe1xuICAgICAgICAvLyBUaGlzIGlzIHRoZSBwb3J0IHdlJ3JlIGxpc3RlbmluZyBvbi5cbiAgICAgICAgLy8gQG5vdGUgcmVuYW1lIHRvIHJlY2VpdmVBZGRyZXNzIC8gcmVjZWl2ZVBvcnRcbiAgICAgICAgbG9jYWxBZGRyZXNzOiBlbnZDb25maWcub3NjLmxvY2FsQWRkcmVzcyxcbiAgICAgICAgbG9jYWxQb3J0OiBlbnZDb25maWcub3NjLmxvY2FsUG9ydCxcbiAgICAgICAgLy8gVGhpcyBpcyB0aGUgcG9ydCB3ZSB1c2UgdG8gc2VuZCBtZXNzYWdlcy5cbiAgICAgICAgLy8gQG5vdGUgcmVuYW1lIHRvIHNlbmRBZGRyZXNzIC8gc2VuZFBvcnRcbiAgICAgICAgcmVtb3RlQWRkcmVzczogZW52Q29uZmlnLm9zYy5yZW1vdGVBZGRyZXNzLFxuICAgICAgICByZW1vdGVQb3J0OiBlbnZDb25maWcub3NjLnJlbW90ZVBvcnQsXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5vc2Mub24oJ3JlYWR5JywgKCkgPT4ge1xuICAgICAgICBjb25zdCByZWNlaXZlID0gYCR7ZW52Q29uZmlnLm9zYy5sb2NhbEFkZHJlc3N9OiR7ZW52Q29uZmlnLm9zYy5sb2NhbFBvcnR9YDtcbiAgICAgICAgY29uc3Qgc2VuZCA9IGAke2VudkNvbmZpZy5vc2MucmVtb3RlQWRkcmVzc306JHtlbnZDb25maWcub3NjLnJlbW90ZVBvcnR9YDtcbiAgICAgICAgY29uc29sZS5sb2coYFtPU0Mgb3ZlciBVRFBdIFJlY2VpdmluZyBvbiAke3JlY2VpdmV9YCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGBbT1NDIG92ZXIgVURQXSBTZW5kaW5nIG9uICR7c2VuZH1gKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm9zYy5vbignbWVzc2FnZScsIChvc2NNc2cpID0+IHtcbiAgICAgICAgY29uc3QgYWRkcmVzcyA9IG9zY01zZy5hZGRyZXNzO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3NjTGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGFkZHJlc3MgPT09IG9zY0xpc3RlbmVyc1tpXS53aWxkY2FyZClcbiAgICAgICAgICAgIG9zY0xpc3RlbmVyc1tpXS5jYWxsYmFjayhvc2NNc2cpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5vc2Mub3BlbigpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogSW5kaWNhdGUgdGhhdCB0aGUgY2xpZW50cyBvZiB0eXBlIGBjbGllbnRUeXBlYCByZXF1aXJlIHRoZSBtb2R1bGVzIGAuLi5tb2R1bGVzYCBvbiB0aGUgc2VydmVyIHNpZGUuXG4gICAqIEFkZGl0aW9uYWxseSwgdGhpcyBtZXRob2Qgcm91dGVzIHRoZSBjb25uZWN0aW9ucyBmcm9tIHRoZSBjb3JyZXNwb25kaW5nIFVSTCB0byB0aGUgY29ycmVzcG9uZGluZyB2aWV3LlxuICAgKiBNb3JlIHNwZWNpZmljYWxseTpcbiAgICogLSBBIGNsaWVudCBjb25uZWN0aW5nIHRvIHRoZSBzZXJ2ZXIgdGhyb3VnaCB0aGUgcm9vdCBVUkwgYGh0dHA6Ly9teS5zZXJ2ZXIuYWRkcmVzczpwb3J0L2AgaXMgY29uc2lkZXJlZCBhcyBhIGAncGxheWVyJ2AgY2xpZW50IGFuZCBkaXNwbGF5cyB0aGUgdmlldyBgcGxheWVyLmVqc2A7XG4gICAqIC0gQSBjbGllbnQgY29ubmVjdGluZyB0byB0aGUgc2VydmVyIHRocm91Z2ggdGhlIFVSTCBgaHR0cDovL215LnNlcnZlci5hZGRyZXNzOnBvcnQvY2xpZW50VHlwZWAgaXMgY29uc2lkZXJlZCBhcyBhIGBjbGllbnRUeXBlYCBjbGllbnQsIGFuZCBkaXNwbGF5cyB0aGUgdmlldyBgY2xpZW50VHlwZS5lanNgLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2xpZW50VHlwZSBDbGllbnQgdHlwZSAoYXMgZGVmaW5lZCBieSB0aGUgbWV0aG9kIHtAbGluayBjbGllbnQuaW5pdH0gb24gdGhlIGNsaWVudCBzaWRlKS5cbiAgICogQHBhcmFtIHsuLi5DbGllbnRNb2R1bGV9IG1vZHVsZXMgTW9kdWxlcyB0byBtYXAgdG8gdGhhdCBjbGllbnQgdHlwZS5cbiAgICovXG4gIG1hcChjbGllbnRUeXBlLCAuLi5tb2R1bGVzKSB7XG4gICAgY29uc3QgdXJsID0gKGNsaWVudFR5cGUgIT09IHRoaXMuYXBwQ29uZmlnLmRlZmF1bHRDbGllbnQpID8gYC8ke2NsaWVudFR5cGV9YCA6ICcvJztcbiAgICAvLyBjYWNoZSBjb21waWxlZCB0ZW1wbGF0ZVxuICAgIGNvbnN0IHRtcGxQYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICd2aWV3cycsIGNsaWVudFR5cGUgKyAnLmVqcycpO1xuICAgIGNvbnN0IHRtcGxTdHJpbmcgPSBmcy5yZWFkRmlsZVN5bmModG1wbFBhdGgsIHsgZW5jb2Rpbmc6ICd1dGY4JyB9KTtcbiAgICBjb25zdCB0bXBsID0gZWpzLmNvbXBpbGUodG1wbFN0cmluZyk7XG5cbiAgICAvLyB3cml0ZSBlbnYgY29uZmlnIGludG8gdGVtcGxhdGVzXG4gICAgdGhpcy5leHByZXNzQXBwLmdldCh1cmwsIChyZXEsIHJlcykgPT4ge1xuICAgICAgcmVzLnNlbmQodG1wbCh7IGVudkNvbmZpZzogSlNPTi5zdHJpbmdpZnkodGhpcy5lbnZDb25maWcpIH0pKTtcbiAgICB9KTtcblxuICAgIG1vZHVsZXMuZm9yRWFjaCgobW9kKSA9PiB7IG1vZC5jb25maWd1cmUodGhpcy5hcHBDb25maWcsIHRoaXMuZW52Q29uZmlnKSB9KVxuXG4gICAgdGhpcy5pby5vZihjbGllbnRUeXBlKS5vbignY29ubmVjdGlvbicsIChzb2NrZXQpID0+IHtcbiAgICAgIGNvbnN0IGNsaWVudCA9IG5ldyBDbGllbnQoY2xpZW50VHlwZSwgc29ja2V0KTtcbiAgICAgIG1vZHVsZXMuZm9yRWFjaCgobW9kKSA9PiB7IG1vZC5jb25uZWN0KGNsaWVudCkgfSk7XG5cbiAgICAgIC8vIGdsb2JhbCBsaWZlY3ljbGUgb2YgdGhlIGNsaWVudFxuICAgICAgY29tbS5yZWNlaXZlKGNsaWVudCwgJ2Rpc2Nvbm5lY3QnLCAoKSA9PiB7XG4gICAgICAgIG1vZHVsZXMuZm9yRWFjaCgobW9kKSA9PiB7IG1vZC5kaXNjb25uZWN0KGNsaWVudCkgfSk7XG4gICAgICAgIGNsaWVudC5kZXN0cm95KCk7XG4gICAgICAgIGxvZ2dlci5pbmZvKHsgc29ja2V0OiBzb2NrZXQsIGNsaWVudFR5cGU6IGNsaWVudFR5cGUgfSwgJ2Rpc2Nvbm5lY3QnKTtcbiAgICAgIH0pO1xuXG4gICAgICBjb21tLnNlbmQoY2xpZW50LCAnY2xpZW50OnN0YXJ0JywgY2xpZW50LmluZGV4KTsgLy8gdGhlIHNlcnZlciBpcyByZWFkeVxuICAgICAgbG9nZ2VyLmluZm8oeyBzb2NrZXQ6IHNvY2tldCwgY2xpZW50VHlwZTogY2xpZW50VHlwZSB9LCAnY29ubmVjdGlvbicpO1xuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTZW5kIGFuIE9TQyBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gd2lsZGNhcmQgV2lsZGNhcmQgb2YgdGhlIE9TQyBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge0FycmF5fSBhcmdzIEFyZ3VtZW50cyBvZiB0aGUgT1NDIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbdXJsPW51bGxdIFVSTCB0byBzZW5kIHRoZSBPU0MgbWVzc2FnZSB0byAoaWYgbm90IHNwZWNpZmllZCwgdXNlcyB0aGUgYWRkcmVzcyBkZWZpbmVkIGluIHRoZSBPU0MgY29uZmlnIG9yIGluIHRoZSBvcHRpb25zIG9mIHRoZSB7QGxpbmsgc2VydmVyLnN0YXJ0fSBtZXRob2QpLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW3BvcnQ9bnVsbF0gUG9ydCB0byBzZW5kIHRoZSBtZXNzYWdlIHRvIChpZiBub3Qgc3BlY2lmaWVkLCB1c2VzIHRoZSBwb3J0IGRlZmluZWQgaW4gdGhlIE9TQyBjb25maWcgb3IgaW4gdGhlIG9wdGlvbnMgb2YgdGhlIHtAbGluayBzZXJ2ZXIuc3RhcnR9IG1ldGhvZCkuXG4gICAqL1xuICBzZW5kT1NDKHdpbGRjYXJkLCBhcmdzLCB1cmwgPSBudWxsLCBwb3J0ID0gbnVsbCkge1xuICAgIGNvbnN0IG9zY01zZyA9IHtcbiAgICAgIGFkZHJlc3M6IHdpbGRjYXJkLFxuICAgICAgYXJnczogYXJnc1xuICAgIH07XG5cbiAgICB0cnkge1xuICAgICAgaWYgKHVybCAmJiBwb3J0KSB7XG4gICAgICAgIHRoaXMub3NjLnNlbmQob3NjTXNnLCB1cmwsIHBvcnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vc2Muc2VuZChvc2NNc2cpOyAvLyB1c2UgZGVmYXVsdHMgKGFzIGRlZmluZWQgaW4gdGhlIGNvbmZpZylcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZygnRXJyb3Igd2hpbGUgc2VuZGluZyBPU0MgbWVzc2FnZTonLCBlKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIExpc3RlbiBmb3IgT1NDIG1lc3NhZ2UgYW5kIGV4ZWN1dGUgYSBjYWxsYmFjayBmdW5jdGlvbi5cbiAgICogVGhlIHNlcnZlciBsaXN0ZW5zIHRvIE9TQyBtZXNzYWdlcyBhdCB0aGUgYWRkcmVzcyBhbmQgcG9ydCBkZWZpbmVkIGluIHRoZSBjb25maWcgb3IgaW4gdGhlIG9wdGlvbnMgb2YgdGhlIHtAbGluayBzZXJ2ZXIuc3RhcnR9IG1ldGhvZC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHdpbGRjYXJkIFdpbGRjYXJkIG9mIHRoZSBPU0MgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGJhY2sgZnVuY3Rpb24gZXhlY3V0ZWQgd2hlbiB0aGUgT1NDIG1lc3NhZ2UgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICByZWNlaXZlT1NDKHdpbGRjYXJkLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG9zY0xpc3RlbmVyID0ge1xuICAgICAgd2lsZGNhcmQ6IHdpbGRjYXJkLFxuICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gICAgfTtcblxuICAgIG9zY0xpc3RlbmVycy5wdXNoKG9zY0xpc3RlbmVyKTtcbiAgfVxufTtcbiJdfQ==