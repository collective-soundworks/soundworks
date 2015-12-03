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

    var url = clientType !== this.appConfig.defaultClient ? '/' + clientType : '/';
    // cache compiled template
    var tmplPath = _path2['default'].join(process.cwd(), 'views', clientType + '.ejs');
    var tmplString = _fs2['default'].readFileSync(tmplPath, { encoding: 'utf8' });
    var tmpl = _ejs2['default'].compile(tmplString);

    // write env config into templates
    this.expressApp.get(url, function (req, res) {
      res.send(tmpl({ envConfig: JSON.stringify(_this.envConfig) }));
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
        // log.info({ socket: socket, clientType: clientType }, 'disconnect');
      });

      _comm2['default'].send(client, 'client:start', client.index); // the server is ready
      // log.info({ socket: socket, clientType: clientType }, 'connection');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvc2VydmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBQWlCLFFBQVE7Ozs7bUJBQ1QsS0FBSzs7Ozt1QkFDRCxTQUFTOzs7O2tCQUNkLElBQUk7Ozs7b0JBQ0YsTUFBTTs7OztzQkFDUCxVQUFVOzs7O3dCQUNYLFdBQVc7Ozs7bUJBQ1YsS0FBSzs7OztvQkFDSixNQUFNOzs7O3NCQUNKLFVBQVU7Ozs7Ozs7QUFLN0IsSUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDOzs7Ozs7OztxQkFTVDs7Ozs7OztBQU9iLElBQUUsRUFBRSxJQUFJOzs7Ozs7QUFNUixZQUFVLEVBQUUsSUFBSTs7Ozs7QUFLaEIsWUFBVSxFQUFFLElBQUk7Ozs7Ozs7QUFPaEIsV0FBUyxFQUFFLEVBQUU7Ozs7Ozs7QUFPYixXQUFTLEVBQUUsRUFBRTs7Ozs7OztBQU9iLEtBQUcsRUFBRSxJQUFJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQlQsT0FBSyxFQUFBLGlCQUFpQztRQUFoQyxTQUFTLHlEQUFHLEVBQUU7UUFBRSxTQUFTLHlEQUFHLEVBQUU7O0FBQ2xDLGFBQVMsR0FBRyxlQUFjO0FBQ3hCLGtCQUFZLEVBQUUsa0JBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxRQUFRLENBQUM7QUFDaEQsbUJBQWEsRUFBRSxRQUFROzs7Ozs7QUFNdkIsY0FBUSxFQUFFO0FBQ1Isa0JBQVUsRUFBRSxDQUFDLFdBQVcsQ0FBQztBQUN6QixtQkFBVyxFQUFFLEtBQUs7QUFDbEIsb0JBQVksRUFBRSxLQUFLO09BQ3BCO0tBQ0YsRUFBRSxTQUFTLENBQUMsQ0FBQzs7QUFFZCxhQUFTLEdBQUcsZUFBYztBQUN4QixVQUFJLEVBQUUsSUFBSTtBQUNWLFNBQUcsRUFBRTtBQUNILG9CQUFZLEVBQUUsV0FBVztBQUN6QixpQkFBUyxFQUFFLEtBQUs7QUFDaEIscUJBQWEsRUFBRSxXQUFXO0FBQzFCLGtCQUFVLEVBQUUsS0FBSztPQUNsQjtLQUNGLEVBQUUsU0FBUyxDQUFDLENBQUM7O0FBRWQsUUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7QUFDM0IsUUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7OztBQUczQixRQUFNLFVBQVUsR0FBRywwQkFBYSxDQUFDO0FBQ2pDLGNBQVUsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMzRCxjQUFVLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNyQyxjQUFVLENBQUMsR0FBRyxDQUFDLDhCQUFjLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7O0FBRXZELFFBQU0sVUFBVSxHQUFHLGtCQUFLLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNqRCxjQUFVLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsWUFBVztBQUNuRCxVQUFNLEdBQUcseUJBQXVCLFVBQVUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEFBQUUsQ0FBQztBQUN6RCxhQUFPLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBQ3ZELENBQUMsQ0FBQzs7QUFFSCxRQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztBQUM3QixRQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQzs7O0FBRzdCLFFBQUksQ0FBQyxFQUFFLEdBQUcsMEJBQU8sVUFBVSxFQUFFLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNqRCxzQkFBSyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDOzs7QUFHekIsUUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFO0FBQ2pCLFVBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxpQkFBSSxPQUFPLENBQUM7OztBQUd6QixvQkFBWSxFQUFFLFNBQVMsQ0FBQyxHQUFHLENBQUMsWUFBWTtBQUN4QyxpQkFBUyxFQUFFLFNBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUzs7O0FBR2xDLHFCQUFhLEVBQUUsU0FBUyxDQUFDLEdBQUcsQ0FBQyxhQUFhO0FBQzFDLGtCQUFVLEVBQUUsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVO09BQ3JDLENBQUMsQ0FBQzs7QUFFSCxVQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsWUFBTTtBQUN6QixZQUFNLE9BQU8sR0FBTSxTQUFTLENBQUMsR0FBRyxDQUFDLFlBQVksU0FBSSxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQUFBRSxDQUFDO0FBQzNFLFlBQU0sSUFBSSxHQUFNLFNBQVMsQ0FBQyxHQUFHLENBQUMsYUFBYSxTQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxBQUFFLENBQUM7QUFDMUUsZUFBTyxDQUFDLEdBQUcsa0NBQWdDLE9BQU8sQ0FBRyxDQUFDO0FBQ3RELGVBQU8sQ0FBQyxHQUFHLGdDQUE4QixJQUFJLENBQUcsQ0FBQztPQUNsRCxDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLFVBQUMsTUFBTSxFQUFLO0FBQ2pDLFlBQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7O0FBRS9CLGFBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzVDLGNBQUksT0FBTyxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQ3RDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDcEM7T0FDRixDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNqQjtHQUNGOzs7Ozs7Ozs7OztBQVdELEtBQUcsRUFBQSxhQUFDLFVBQVUsRUFBYzs7O3NDQUFULE9BQU87QUFBUCxhQUFPOzs7QUFDeEIsUUFBTSxHQUFHLEdBQUcsQUFBQyxVQUFVLEtBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLFNBQVEsVUFBVSxHQUFLLEdBQUcsQ0FBQzs7QUFFbkYsUUFBTSxRQUFRLEdBQUcsa0JBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsVUFBVSxHQUFHLE1BQU0sQ0FBQyxDQUFDO0FBQ3hFLFFBQU0sVUFBVSxHQUFHLGdCQUFHLFlBQVksQ0FBQyxRQUFRLEVBQUUsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztBQUNuRSxRQUFNLElBQUksR0FBRyxpQkFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7OztBQUdyQyxRQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsVUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFLO0FBQ3JDLFNBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBSyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUMvRCxDQUFDLENBQUM7O0FBRUgsUUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxVQUFDLE1BQU0sRUFBSztBQUNsRCxVQUFNLE1BQU0sR0FBRyx3QkFBVyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDOUMsYUFBTyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUcsRUFBSztBQUFFLFdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7T0FBRSxDQUFDLENBQUM7OztBQUdsRCx3QkFBSyxPQUFPLENBQUMsTUFBTSxFQUFFLFlBQVksRUFBRSxZQUFNO0FBQ3ZDLGVBQU8sQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHLEVBQUs7QUFBRSxhQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1NBQUUsQ0FBQyxDQUFDO0FBQ3JELGNBQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7T0FFbEIsQ0FBQyxDQUFDOztBQUVILHdCQUFLLElBQUksQ0FBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQzs7S0FFakQsQ0FBQyxDQUFDO0dBQ0o7Ozs7Ozs7OztBQVNELFNBQU8sRUFBQSxpQkFBQyxRQUFRLEVBQUUsSUFBSSxFQUEyQjtRQUF6QixHQUFHLHlEQUFHLElBQUk7UUFBRSxJQUFJLHlEQUFHLElBQUk7O0FBQzdDLFFBQU0sTUFBTSxHQUFHO0FBQ2IsYUFBTyxFQUFFLFFBQVE7QUFDakIsVUFBSSxFQUFFLElBQUk7S0FDWCxDQUFDOztBQUVGLFFBQUk7QUFDRixVQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUU7QUFDZixZQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO09BQ2xDLE1BQU07QUFDTCxZQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztPQUN2QjtLQUNGLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDVixhQUFPLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3BEO0dBQ0Y7Ozs7Ozs7OztBQVNELFlBQVUsRUFBQSxvQkFBQyxRQUFRLEVBQUUsUUFBUSxFQUFFO0FBQzdCLFFBQU0sV0FBVyxHQUFHO0FBQ2xCLGNBQVEsRUFBRSxRQUFRO0FBQ2xCLGNBQVEsRUFBRSxRQUFRO0tBQ25CLENBQUM7O0FBRUYsZ0JBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7R0FDaEM7Q0FDRiIsImZpbGUiOiJzcmMvc2VydmVyL3NlcnZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjb21tIGZyb20gJy4vY29tbSc7XG5pbXBvcnQgZWpzIGZyb20gJ2Vqcyc7XG5pbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgaHR0cCBmcm9tICdodHRwJztcbmltcG9ydCBsb2cgZnJvbSAnLi9sb2dnZXInO1xuaW1wb3J0IElPIGZyb20gJ3NvY2tldC5pbyc7XG5pbXBvcnQgb3NjIGZyb20gJ29zYyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBDbGllbnQgZnJvbSAnLi9DbGllbnQnO1xuXG4vLyBnbG9iYWxzXG4vLyBAdG9kbyBoaWRlIHRoaXMgaW50byBjbGllbnRcblxuY29uc3Qgb3NjTGlzdGVuZXJzID0gW107XG5cblxuLyoqXG4gKiBUaGUgYHNlcnZlcmAgb2JqZWN0IGNvbnRhaW5zIHRoZSBiYXNpYyBtZXRob2RzIG9mIHRoZSBzZXJ2ZXIuXG4gKiBGb3IgaW5zdGFuY2UsIHRoaXMgb2JqZWN0IGFsbG93cyBzZXR0aW5nIHVwLCBjb25maWd1cmluZyBhbmQgc3RhcnRpbmcgdGhlIHNlcnZlciB3aXRoIHRoZSBtZXRob2QgYHN0YXJ0YCB3aGlsZSB0aGUgbWV0aG9kIGBtYXBgIGFsbG93cyBmb3IgbWFuYWdpbmcgdGhlIG1hcHBpbmcgYmV0d2VlbiBkaWZmZXJlbnQgdHlwZXMgb2YgY2xpZW50cyBhbmQgdGhlaXIgcmVxdWlyZWQgc2VydmVyIG1vZHVsZXMuXG4gKiBBZGRpdGlvbmFsbHksIHRoZSBtZXRob2QgYGJyb2FkY2FzdGAgYWxsb3dzIHRvIHNlbmQgbWVzc2FnZXMgdG8gYWxsIGNvbm5lY3RlZCBjbGllbnRzIHZpYSBXZWJTb2NrZXRzIG9yIE9TQy5cbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IHtcblxuICAvKipcbiAgICogV2ViU29ja2V0IHNlcnZlci5cbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGlvOiBudWxsLFxuXG4gIC8qKlxuICAgKiBFeHByZXNzIGFwcGxpY2F0aW9uXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xuICBleHByZXNzQXBwOiBudWxsLFxuICAvKipcbiAgICogSHR0cCBzZXJ2ZXJcbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG4gIGh0dHBTZXJ2ZXI6IG51bGwsXG5cbiAgLyoqXG4gICAqIEFwcGxpY2F0aW9uIGNvbmZpZ3VyYXRpb24gaW5mb3JtYXRpb24uXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBhcHBDb25maWc6IHt9LCAvLyBob3N0IGVudiBjb25maWcgaW5mb3JtYXRpb25zIChkZXYgLyBwcm9kKVxuXG4gIC8qKlxuICAgKiBFbnZpcm9ubWVudCBjb25maWd1cmF0aW9uIGluZm9ybWF0aW9uIChkZXZlbG9wbWVudCAvIHByb2R1Y3Rpb24pLlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZW52Q29uZmlnOiB7fSwgLy8gaG9zdCBlbnYgY29uZmlnIGluZm9ybWF0aW9ucyAoZGV2IC8gcHJvZClcblxuICAvKipcbiAgICogT1NDIG9iamVjdC5cbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIG9zYzogbnVsbCxcblxuICAvKipcbiAgICogU3RhcnQgdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtPYmplY3R9IFthcHBDb25maWc9e31dIEFwcGxpY2F0aW9uIGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAgICogQGF0dHJpYnV0ZSB7U3RyaW5nfSBbYXBwQ29uZmlnLnB1YmxpY0ZvbGRlcj0nLi9wdWJsaWMnXSBQYXRoIHRvIHRoZSBwdWJsaWMgZm9sZGVyLlxuICAgKiBAYXR0cmlidXRlIHtPYmplY3R9IFthcHBDb25maWcuc29ja2V0SU89e31dIHNvY2tldC5pbyBvcHRpb25zLiBUaGUgc29ja2V0LmlvIGNvbmZpZyBvYmplY3QgY2FuIGhhdmUgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICAgKiAtIGB0cmFuc3BvcnRzOlN0cmluZ2A6IGNvbW11bmljYXRpb24gdHJhbnNwb3J0IChkZWZhdWx0cyB0byBgJ3dlYnNvY2tldCdgKTtcbiAgICogLSBgcGluZ1RpbWVvdXQ6TnVtYmVyYDogdGltZW91dCAoaW4gbWlsbGlzZWNvbmRzKSBiZWZvcmUgdHJ5aW5nIHRvIHJlZXN0YWJsaXNoIGEgY29ubmVjdGlvbiBiZXR3ZWVuIGEgbG9zdCBjbGllbnQgYW5kIGEgc2VydmVyIChkZWZhdXRscyB0byBgNjAwMDBgKTtcbiAgICogLSBgcGluZ0ludGVydmFsOk51bWJlcmA6IHRpbWUgaW50ZXJ2YWwgKGluIG1pbGxpc2Vjb25kcykgdG8gc2VuZCBhIHBpbmcgdG8gYSBjbGllbnQgdG8gY2hlY2sgdGhlIGNvbm5lY3Rpb24gKGRlZmF1bHRzIHRvIGA1MDAwMGApLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW2VudkNvbmZpZz17fV0gRW52aXJvbm1lbnQgY29uZmlndXJhdGlvbiBvcHRpb25zLlxuICAgKiBAYXR0cmlidXRlIHtOdW1iZXJ9IFtlbnZDb25maWcucG9ydD04MDAwXSBQb3J0IG9mIHRoZSBIVFRQIHNlcnZlci5cbiAgICogQGF0dHJpYnV0ZSB7T2JqZWN0fSBbZW52Q29uZmlnLm9zYz17fV0gT1NDIG9wdGlvbnMuIFRoZSBPU0MgY29uZmlnIG9iamVjdCBjYW4gaGF2ZSB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gICAqIC0gYGxvY2FsQWRkcmVzczpTdHJpbmdgOiBhZGRyZXNzIG9mIHRoZSBsb2NhbCBtYWNoaW5lIHRvIHJlY2VpdmUgT1NDIG1lc3NhZ2VzIChkZWZhdWx0cyB0byBgJzEyNy4wLjAuMSdgKTtcbiAgICogLSBgbG9jYWxQb3J0Ok51bWJlcmA6IHBvcnQgb2YgdGhlIGxvY2FsIG1hY2hpbmUgdG8gcmVjZWl2ZSBPU0MgbWVzc2FnZXMgKGRlZmF1bHRzIHRvIGA1NzEyMWApO1xuICAgKiAtIGByZW1vdGVBZGRyZXNzOlN0cmluZ2A6IGFkZHJlc3Mgb2YgdGhlIGRldmljZSB0byBzZW5kIGRlZmF1bHQgT1NDIG1lc3NhZ2VzIHRvIChkZWZhdWx0cyB0byBgJzEyNy4wLjAuMSdgKTtcbiAgICogLSBgcmVtb3RlUG9ydDpOdW1iZXJgOiBwb3J0IG9mIHRoZSBkZXZpY2UgdG8gc2VuZCBkZWZhdWx0IE9TQyBtZXNzYWdlcyB0byAoZGVmYXVsdHMgdG8gYDU3MTIwYCkuXG4gICAqL1xuICBzdGFydChhcHBDb25maWcgPSB7fSwgZW52Q29uZmlnID0ge30pIHtcbiAgICBhcHBDb25maWcgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIHB1YmxpY0ZvbGRlcjogcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdwdWJsaWMnKSxcbiAgICAgIGRlZmF1bHRDbGllbnQ6ICdwbGF5ZXInLFxuICAgICAgLy8gQG5vdGU6IEVuZ2luZUlPIGRlZmF1bHRzXG4gICAgICAvLyB0aGlzLnBpbmdUaW1lb3V0ID0gb3B0cy5waW5nVGltZW91dCB8fCAzMDAwO1xuICAgICAgLy8gdGhpcy5waW5nSW50ZXJ2YWwgPSBvcHRzLnBpbmdJbnRlcnZhbCB8fCAxMDAwO1xuICAgICAgLy8gdGhpcy51cGdyYWRlVGltZW91dCA9IG9wdHMudXBncmFkZVRpbWVvdXQgfHwgMTAwMDA7XG4gICAgICAvLyB0aGlzLm1heEh0dHBCdWZmZXJTaXplID0gb3B0cy5tYXhIdHRwQnVmZmVyU2l6ZSB8fCAxMEU3O1xuICAgICAgc29ja2V0SU86IHtcbiAgICAgICAgdHJhbnNwb3J0czogWyd3ZWJzb2NrZXQnXSxcbiAgICAgICAgcGluZ1RpbWVvdXQ6IDYwMDAwLFxuICAgICAgICBwaW5nSW50ZXJ2YWw6IDUwMDAwXG4gICAgICB9XG4gICAgfSwgYXBwQ29uZmlnKTtcblxuICAgIGVudkNvbmZpZyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgcG9ydDogODAwMCxcbiAgICAgIG9zYzoge1xuICAgICAgICBsb2NhbEFkZHJlc3M6ICcxMjcuMC4wLjEnLFxuICAgICAgICBsb2NhbFBvcnQ6IDU3MTIxLFxuICAgICAgICByZW1vdGVBZGRyZXNzOiAnMTI3LjAuMC4xJyxcbiAgICAgICAgcmVtb3RlUG9ydDogNTcxMjBcbiAgICAgIH1cbiAgICB9LCBlbnZDb25maWcpO1xuXG4gICAgdGhpcy5lbnZDb25maWcgPSBlbnZDb25maWc7XG4gICAgdGhpcy5hcHBDb25maWcgPSBhcHBDb25maWc7XG5cbiAgICAvLyBjb25maWd1cmUgZXhwcmVzcyBhbmQgaHR0cCBzZXJ2ZXJcbiAgICBjb25zdCBleHByZXNzQXBwID0gbmV3IGV4cHJlc3MoKTtcbiAgICBleHByZXNzQXBwLnNldCgncG9ydCcsIHByb2Nlc3MuZW52LlBPUlQgfHwgZW52Q29uZmlnLnBvcnQpO1xuICAgIGV4cHJlc3NBcHAuc2V0KCd2aWV3IGVuZ2luZScsICdlanMnKTtcbiAgICBleHByZXNzQXBwLnVzZShleHByZXNzLnN0YXRpYyhhcHBDb25maWcucHVibGljRm9sZGVyKSk7XG5cbiAgICBjb25zdCBodHRwU2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoZXhwcmVzc0FwcCk7XG4gICAgaHR0cFNlcnZlci5saXN0ZW4oZXhwcmVzc0FwcC5nZXQoJ3BvcnQnKSwgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCB1cmwgPSBgaHR0cDovLzEyNy4wLjAuMToke2V4cHJlc3NBcHAuZ2V0KCdwb3J0Jyl9YDtcbiAgICAgIGNvbnNvbGUubG9nKCdbSFRUUCBTRVJWRVJdIFNlcnZlciBsaXN0ZW5pbmcgb24nLCB1cmwpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5leHByZXNzQXBwID0gZXhwcmVzc0FwcDtcbiAgICB0aGlzLmh0dHBTZXJ2ZXIgPSBodHRwU2VydmVyO1xuXG4gICAgLy8gY29uZmlndXJlIHNvY2tldC5pb1xuICAgIHRoaXMuaW8gPSBuZXcgSU8oaHR0cFNlcnZlciwgYXBwQ29uZmlnLnNvY2tldElPKTtcbiAgICBjb21tLmluaXRpYWxpemUodGhpcy5pbyk7XG5cbiAgICAvLyBjb25maWd1cmUgT1NDXG4gICAgaWYgKGVudkNvbmZpZy5vc2MpIHtcbiAgICAgIHRoaXMub3NjID0gbmV3IG9zYy5VRFBQb3J0KHtcbiAgICAgICAgLy8gVGhpcyBpcyB0aGUgcG9ydCB3ZSdyZSBsaXN0ZW5pbmcgb24uXG4gICAgICAgIC8vIEBub3RlIHJlbmFtZSB0byByZWNlaXZlQWRkcmVzcyAvIHJlY2VpdmVQb3J0XG4gICAgICAgIGxvY2FsQWRkcmVzczogZW52Q29uZmlnLm9zYy5sb2NhbEFkZHJlc3MsXG4gICAgICAgIGxvY2FsUG9ydDogZW52Q29uZmlnLm9zYy5sb2NhbFBvcnQsXG4gICAgICAgIC8vIFRoaXMgaXMgdGhlIHBvcnQgd2UgdXNlIHRvIHNlbmQgbWVzc2FnZXMuXG4gICAgICAgIC8vIEBub3RlIHJlbmFtZSB0byBzZW5kQWRkcmVzcyAvIHNlbmRQb3J0XG4gICAgICAgIHJlbW90ZUFkZHJlc3M6IGVudkNvbmZpZy5vc2MucmVtb3RlQWRkcmVzcyxcbiAgICAgICAgcmVtb3RlUG9ydDogZW52Q29uZmlnLm9zYy5yZW1vdGVQb3J0LFxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMub3NjLm9uKCdyZWFkeScsICgpID0+IHtcbiAgICAgICAgY29uc3QgcmVjZWl2ZSA9IGAke2VudkNvbmZpZy5vc2MubG9jYWxBZGRyZXNzfToke2VudkNvbmZpZy5vc2MubG9jYWxQb3J0fWA7XG4gICAgICAgIGNvbnN0IHNlbmQgPSBgJHtlbnZDb25maWcub3NjLnJlbW90ZUFkZHJlc3N9OiR7ZW52Q29uZmlnLm9zYy5yZW1vdGVQb3J0fWA7XG4gICAgICAgIGNvbnNvbGUubG9nKGBbT1NDIG92ZXIgVURQXSBSZWNlaXZpbmcgb24gJHtyZWNlaXZlfWApO1xuICAgICAgICBjb25zb2xlLmxvZyhgW09TQyBvdmVyIFVEUF0gU2VuZGluZyBvbiAke3NlbmR9YCk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5vc2Mub24oJ21lc3NhZ2UnLCAob3NjTXNnKSA9PiB7XG4gICAgICAgIGNvbnN0IGFkZHJlc3MgPSBvc2NNc2cuYWRkcmVzcztcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9zY0xpc3RlbmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChhZGRyZXNzID09PSBvc2NMaXN0ZW5lcnNbaV0ud2lsZGNhcmQpXG4gICAgICAgICAgICBvc2NMaXN0ZW5lcnNbaV0uY2FsbGJhY2sob3NjTXNnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMub3NjLm9wZW4oKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEluZGljYXRlIHRoYXQgdGhlIGNsaWVudHMgb2YgdHlwZSBgY2xpZW50VHlwZWAgcmVxdWlyZSB0aGUgbW9kdWxlcyBgLi4ubW9kdWxlc2Agb24gdGhlIHNlcnZlciBzaWRlLlxuICAgKiBBZGRpdGlvbmFsbHksIHRoaXMgbWV0aG9kIHJvdXRlcyB0aGUgY29ubmVjdGlvbnMgZnJvbSB0aGUgY29ycmVzcG9uZGluZyBVUkwgdG8gdGhlIGNvcnJlc3BvbmRpbmcgdmlldy5cbiAgICogTW9yZSBzcGVjaWZpY2FsbHk6XG4gICAqIC0gQSBjbGllbnQgY29ubmVjdGluZyB0byB0aGUgc2VydmVyIHRocm91Z2ggdGhlIHJvb3QgVVJMIGBodHRwOi8vbXkuc2VydmVyLmFkZHJlc3M6cG9ydC9gIGlzIGNvbnNpZGVyZWQgYXMgYSBgJ3BsYXllcidgIGNsaWVudCBhbmQgZGlzcGxheXMgdGhlIHZpZXcgYHBsYXllci5lanNgO1xuICAgKiAtIEEgY2xpZW50IGNvbm5lY3RpbmcgdG8gdGhlIHNlcnZlciB0aHJvdWdoIHRoZSBVUkwgYGh0dHA6Ly9teS5zZXJ2ZXIuYWRkcmVzczpwb3J0L2NsaWVudFR5cGVgIGlzIGNvbnNpZGVyZWQgYXMgYSBgY2xpZW50VHlwZWAgY2xpZW50LCBhbmQgZGlzcGxheXMgdGhlIHZpZXcgYGNsaWVudFR5cGUuZWpzYC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNsaWVudFR5cGUgQ2xpZW50IHR5cGUgKGFzIGRlZmluZWQgYnkgdGhlIG1ldGhvZCB7QGxpbmsgY2xpZW50LmluaXR9IG9uIHRoZSBjbGllbnQgc2lkZSkuXG4gICAqIEBwYXJhbSB7Li4uQ2xpZW50TW9kdWxlfSBtb2R1bGVzIE1vZHVsZXMgdG8gbWFwIHRvIHRoYXQgY2xpZW50IHR5cGUuXG4gICAqL1xuICBtYXAoY2xpZW50VHlwZSwgLi4ubW9kdWxlcykge1xuICAgIGNvbnN0IHVybCA9IChjbGllbnRUeXBlICE9PSB0aGlzLmFwcENvbmZpZy5kZWZhdWx0Q2xpZW50KSA/IGAvJHtjbGllbnRUeXBlfWAgOiAnLyc7XG4gICAgLy8gY2FjaGUgY29tcGlsZWQgdGVtcGxhdGVcbiAgICBjb25zdCB0bXBsUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAndmlld3MnLCBjbGllbnRUeXBlICsgJy5lanMnKTtcbiAgICBjb25zdCB0bXBsU3RyaW5nID0gZnMucmVhZEZpbGVTeW5jKHRtcGxQYXRoLCB7IGVuY29kaW5nOiAndXRmOCcgfSk7XG4gICAgY29uc3QgdG1wbCA9IGVqcy5jb21waWxlKHRtcGxTdHJpbmcpO1xuXG4gICAgLy8gd3JpdGUgZW52IGNvbmZpZyBpbnRvIHRlbXBsYXRlc1xuICAgIHRoaXMuZXhwcmVzc0FwcC5nZXQodXJsLCAocmVxLCByZXMpID0+IHtcbiAgICAgIHJlcy5zZW5kKHRtcGwoeyBlbnZDb25maWc6IEpTT04uc3RyaW5naWZ5KHRoaXMuZW52Q29uZmlnKSB9KSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmlvLm9mKGNsaWVudFR5cGUpLm9uKCdjb25uZWN0aW9uJywgKHNvY2tldCkgPT4ge1xuICAgICAgY29uc3QgY2xpZW50ID0gbmV3IENsaWVudChjbGllbnRUeXBlLCBzb2NrZXQpO1xuICAgICAgbW9kdWxlcy5mb3JFYWNoKChtb2QpID0+IHsgbW9kLmNvbm5lY3QoY2xpZW50KSB9KTtcblxuICAgICAgLy8gZ2xvYmFsIGxpZmVjeWNsZSBvZiB0aGUgY2xpZW50XG4gICAgICBjb21tLnJlY2VpdmUoY2xpZW50LCAnZGlzY29ubmVjdCcsICgpID0+IHtcbiAgICAgICAgbW9kdWxlcy5mb3JFYWNoKChtb2QpID0+IHsgbW9kLmRpc2Nvbm5lY3QoY2xpZW50KSB9KTtcbiAgICAgICAgY2xpZW50LmRlc3Ryb3koKTtcbiAgICAgICAgLy8gbG9nLmluZm8oeyBzb2NrZXQ6IHNvY2tldCwgY2xpZW50VHlwZTogY2xpZW50VHlwZSB9LCAnZGlzY29ubmVjdCcpO1xuICAgICAgfSk7XG5cbiAgICAgIGNvbW0uc2VuZChjbGllbnQsICdjbGllbnQ6c3RhcnQnLCBjbGllbnQuaW5kZXgpOyAvLyB0aGUgc2VydmVyIGlzIHJlYWR5XG4gICAgICAvLyBsb2cuaW5mbyh7IHNvY2tldDogc29ja2V0LCBjbGllbnRUeXBlOiBjbGllbnRUeXBlIH0sICdjb25uZWN0aW9uJyk7XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNlbmQgYW4gT1NDIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB3aWxkY2FyZCBXaWxkY2FyZCBvZiB0aGUgT1NDIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7QXJyYXl9IGFyZ3MgQXJndW1lbnRzIG9mIHRoZSBPU0MgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFt1cmw9bnVsbF0gVVJMIHRvIHNlbmQgdGhlIE9TQyBtZXNzYWdlIHRvIChpZiBub3Qgc3BlY2lmaWVkLCB1c2VzIHRoZSBhZGRyZXNzIGRlZmluZWQgaW4gdGhlIE9TQyBjb25maWcgb3IgaW4gdGhlIG9wdGlvbnMgb2YgdGhlIHtAbGluayBzZXJ2ZXIuc3RhcnR9IG1ldGhvZCkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbcG9ydD1udWxsXSBQb3J0IHRvIHNlbmQgdGhlIG1lc3NhZ2UgdG8gKGlmIG5vdCBzcGVjaWZpZWQsIHVzZXMgdGhlIHBvcnQgZGVmaW5lZCBpbiB0aGUgT1NDIGNvbmZpZyBvciBpbiB0aGUgb3B0aW9ucyBvZiB0aGUge0BsaW5rIHNlcnZlci5zdGFydH0gbWV0aG9kKS5cbiAgICovXG4gIHNlbmRPU0Mod2lsZGNhcmQsIGFyZ3MsIHVybCA9IG51bGwsIHBvcnQgPSBudWxsKSB7XG4gICAgY29uc3Qgb3NjTXNnID0ge1xuICAgICAgYWRkcmVzczogd2lsZGNhcmQsXG4gICAgICBhcmdzOiBhcmdzXG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICBpZiAodXJsICYmIHBvcnQpIHtcbiAgICAgICAgdGhpcy5vc2Muc2VuZChvc2NNc2csIHVybCwgcG9ydCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9zYy5zZW5kKG9zY01zZyk7IC8vIHVzZSBkZWZhdWx0cyAoYXMgZGVmaW5lZCBpbiB0aGUgY29uZmlnKVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdFcnJvciB3aGlsZSBzZW5kaW5nIE9TQyBtZXNzYWdlOicsIGUpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogTGlzdGVuIGZvciBPU0MgbWVzc2FnZSBhbmQgZXhlY3V0ZSBhIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICAgKiBUaGUgc2VydmVyIGxpc3RlbnMgdG8gT1NDIG1lc3NhZ2VzIGF0IHRoZSBhZGRyZXNzIGFuZCBwb3J0IGRlZmluZWQgaW4gdGhlIGNvbmZpZyBvciBpbiB0aGUgb3B0aW9ucyBvZiB0aGUge0BsaW5rIHNlcnZlci5zdGFydH0gbWV0aG9kLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gd2lsZGNhcmQgV2lsZGNhcmQgb2YgdGhlIE9TQyBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsYmFjayBmdW5jdGlvbiBleGVjdXRlZCB3aGVuIHRoZSBPU0MgbWVzc2FnZSBpcyByZWNlaXZlZC5cbiAgICovXG4gIHJlY2VpdmVPU0Mod2lsZGNhcmQsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb3NjTGlzdGVuZXIgPSB7XG4gICAgICB3aWxkY2FyZDogd2lsZGNhcmQsXG4gICAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgICB9O1xuXG4gICAgb3NjTGlzdGVuZXJzLnB1c2gob3NjTGlzdGVuZXIpO1xuICB9XG59O1xuXG4iXX0=