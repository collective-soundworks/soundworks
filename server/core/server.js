'use strict';

var _Set = require('babel-runtime/core-js/set')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _sockets = require('./sockets');

var _sockets2 = _interopRequireDefault(_sockets);

var _ejs = require('ejs');

var _ejs2 = _interopRequireDefault(_ejs);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _utilsLogger = require('../utils/logger');

var _utilsLogger2 = _interopRequireDefault(_utilsLogger);

var _socketIo = require('socket.io');

var _socketIo2 = _interopRequireDefault(_socketIo);

var _osc = require('osc');

var _osc2 = _interopRequireDefault(_osc);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _Client = require('./Client');

var _Client2 = _interopRequireDefault(_Client);

var _serverServiceManager = require('./serverServiceManager');

var _serverServiceManager2 = _interopRequireDefault(_serverServiceManager);

// @todo - move into osc service.
var oscListeners = [];

/**
 * Set of configuration parameters defined by a particular application.
 * These parameters typically inclusd a setup and control parameters values.
 */
var exampleAppConfig = {
  appName: 'Soundworks', // title of the application (for <title> tag)
  version: '0.0.1', // version of the application (bypass browser cache)
  playerSetup: {
    width: 10, // width of the setup area in meters
    height: 10, // height of the setup area in meters
    labels: undefined, // predefined labels (optional)
    coordinates: undefined, // predefined coordinates on the setup area (optional)
    background: undefined },
  // URL of a background image fitting the setup area (optional)
  controlParameters: {
    tempo: 120, // tempo in BPM
    volume: 0 }
};

/**
 * Configuration parameters of the Soundworks framework.
 * These parameters allow for configuring components of the framework such as Express and SocketIO.
 */
// master volume in dB
var defaultFwConfig = {
  publicFolder: _path2['default'].join(process.cwd(), 'public'),
  templateFolder: _path2['default'].join(process.cwd(), 'views'),
  defaultClient: 'player',
  assetsDomain: '', // override to download assets from a different serveur (nginx)
  socketIO: {
    url: '',
    transports: ['websocket'],
    pingTimeout: 60000, // configure client side too ?
    pingInterval: 50000 }
};

/**
 * Configuration parameters of the Soundworks framework.
 * These parameters allow for configuring components of the framework such as Express and SocketIO.
 */
// configure client side too ?
// @note: EngineIO defaults
// pingTimeout: 3000,
// pingInterval: 1000,
// upgradeTimeout: 10000,
// maxHttpBufferSize: 10E7,
var defaultEnvConfig = {
  port: 8000,
  // osc: {
  //   receiveAddress: '127.0.0.1',
  //   receivePort: 57121,
  //   sendAddress: '127.0.0.1',
  //   sendPort: 57120,
  // },
  osc: null,
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
   * Configuration informations.
   * @type {Object}
   */
  config: {},

  /**
   * OSC object.
   * @todo - Move into service
   * @type {Object}
   * @private
   */
  osc: null,

  /**
   * Mapping between a `clientType` and its related activities
   */
  _maps: {},

  /**
   * Activities to be started
   */
  _activities: new _Set(),

  /**
   * Initialize the server with the given config objects.
   * @param {...Object} configs - Object of application configuration.
   *
   * @todo - rewrite doc properly for this method.
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
  init: function init() {
    var _this = this;

    // merge default configuration objects
    this.config = _Object$assign(this.config, exampleAppConfig, defaultFwConfig, defaultEnvConfig);
    // merge given configurations objects with defaults (1 level depth)

    for (var _len = arguments.length, configs = Array(_len), _key = 0; _key < _len; _key++) {
      configs[_key] = arguments[_key];
    }

    configs.forEach(function (config) {
      for (var key in config) {
        var entry = config[key];
        if (typeof entry === 'object' && entry !== null) {
          _this.config[key] = _this.config[key] || {};
          _this.config[key] = _Object$assign(_this.config[key], entry);
        } else {
          _this.config[key] = entry;
        }
      }
    });
  },

  /**
   * Start the server:
   * - launch the HTTP server.
   * - launch the socket server.
   * - start all registered activities.
   * - define routes and associate client types and activities.
   */
  start: function start() {
    var _this2 = this;

    // --------------------------------------------------
    // configure express and http server
    // --------------------------------------------------

    var expressApp = new _express2['default']();
    expressApp.set('port', process.env.PORT || this.config.port);
    expressApp.set('view engine', 'ejs');
    expressApp.use(_express2['default']['static'](this.config.publicFolder));

    var httpServer = _http2['default'].createServer(expressApp);
    httpServer.listen(expressApp.get('port'), function () {
      var url = 'http://127.0.0.1:' + expressApp.get('port');
      console.log('[HTTP SERVER] Server listening on', url);
    });

    this.expressApp = expressApp;
    this.httpServer = httpServer;

    this.io = new _socketIo2['default'](httpServer, this.config.socketIO);
    _sockets2['default'].initialize(this.io);
    _utilsLogger2['default'].initialize(this.config.logger);

    // --------------------------------------------------
    // start all activities and create routes
    // --------------------------------------------------

    this._activities.forEach(function (activity) {
      return activity.start();
    });
    // map `clientType` to their respective activities
    for (var clientType in this._maps) {
      var activity = this._maps[clientType];
      this._map(clientType, activity);
    }

    // --------------------------------------------------
    // @todo - move into a proper service.
    // configure OSC - should be optionnal
    if (this.config.osc) {
      (function () {
        var oscConfig = _this2.config.osc;

        _this2.osc = new _osc2['default'].UDPPort({
          // This is the port we're listening on.
          localAddress: oscConfig.receiveAddress,
          localPort: oscConfig.receivePort,
          // This is the port we use to send messages.
          remoteAddress: oscConfig.sendAddress,
          remotePort: oscConfig.sendPort
        });

        _this2.osc.on('ready', function () {
          var receive = oscConfig.receiveAddress + ':' + oscConfig.receivePort;
          var send = oscConfig.sendAddress + ':' + oscConfig.sendPort;
          console.log('[OSC over UDP] Receiving on ' + receive);
          console.log('[OSC over UDP] Sending on ' + send);
        });

        _this2.osc.on('message', function (oscMsg) {
          var address = oscMsg.address;

          for (var i = 0; i < oscListeners.length; i++) {
            if (address === oscListeners[i].wildcard) oscListeners[i].callback(oscMsg);
          }
        });

        _this2.osc.open();
      })();
    }
    // --------------------------------------------------
  },

  /**
   * Returns a service configured with the given options.
   * @param {String} id - The identifier of the service.
   * @param {Object} options - The options to configure the service.
   */
  require: function require(id, options) {
    return _serverServiceManager2['default'].require(id, options);
  },

  /**
   * Function used by activities to registered their concerned client type into the server
   * @param {Array<String>} clientTypes - An array of client type.
   * @param {Activity} activity - The activity concerned with the given `clientTypes`.
   * @private
   */
  setMap: function setMap(clientTypes, activity) {
    var _this3 = this;

    clientTypes.forEach(function (clientType) {
      if (!_this3._maps[clientType]) _this3._maps[clientType] = new _Set();

      _this3._maps[clientType].add(activity);
    });
  },

  /**
   * Function used by activities to register themselves as active activities
   * @param {Activity} activity
   * @private
   */
  setActivity: function setActivity(activity) {
    this._activities.add(activity);
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
  _map: function _map(clientType, modules) {
    var _this4 = this;

    // @todo - allow to pass some variable in the url -> define how bind it to sockets...
    var url = clientType !== this.config.defaultClient ? '/' + clientType : '/';

    // use template with `clientType` name or default if not defined
    var clientTmpl = _path2['default'].join(this.config.templateFolder, clientType + '.ejs');
    var defaultTmpl = _path2['default'].join(this.config.templateFolder, 'default.ejs');
    var template = _fs2['default'].existsSync(clientTmpl) ? clientTmpl : defaultTmpl;

    var tmplString = _fs2['default'].readFileSync(template, { encoding: 'utf8' });
    var tmpl = _ejs2['default'].compile(tmplString);

    this.expressApp.get(url, function (req, res) {
      res.send(tmpl({
        socketIO: JSON.stringify(_this4.config.socketIO),
        appName: _this4.config.appName,
        clientType: clientType,
        defaultType: _this4.config.defaultClient,
        assetsDomain: _this4.config.assetsDomain
      }));
    });

    // wait for socket connnection
    this.io.of(clientType).on('connection', this._onConnection(clientType, modules));
  },

  /**
   * Socket connection callback.
   */
  _onConnection: function _onConnection(clientType, modules) {
    return function (socket) {
      var client = new _Client2['default'](clientType, socket);
      modules.forEach(function (mod) {
        return mod.connect(client);
      });

      // global lifecycle of the client
      _sockets2['default'].receive(client, 'disconnect', function () {
        modules.forEach(function (mod) {
          return mod.disconnect(client);
        });
        // @todo - should remove all listeners on the client
        client.destroy();
        _utilsLogger2['default'].info({ socket: socket, clientType: clientType }, 'disconnect');
      });

      // @todo - refactor handshake and uid definition.
      _sockets2['default'].send(client, 'client:start', client.uid); // the server is ready
      _utilsLogger2['default'].info({ socket: socket, clientType: clientType }, 'connection');
    };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvY29yZS9zZXJ2ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O3VCQUFvQixXQUFXOzs7O21CQUNmLEtBQUs7Ozs7dUJBQ0QsU0FBUzs7OztrQkFDZCxJQUFJOzs7O29CQUNGLE1BQU07Ozs7MkJBQ0osaUJBQWlCOzs7O3dCQUNyQixXQUFXOzs7O21CQUNWLEtBQUs7Ozs7b0JBQ0osTUFBTTs7OztzQkFDSixVQUFVOzs7O29DQUNJLHdCQUF3Qjs7Ozs7QUFHekQsSUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDOzs7Ozs7QUFNeEIsSUFBTSxnQkFBZ0IsR0FBRztBQUN2QixTQUFPLEVBQUUsWUFBWTtBQUNyQixTQUFPLEVBQUUsT0FBTztBQUNoQixhQUFXLEVBQUU7QUFDWCxTQUFLLEVBQUUsRUFBRTtBQUNULFVBQU0sRUFBRSxFQUFFO0FBQ1YsVUFBTSxFQUFFLFNBQVM7QUFDakIsZUFBVyxFQUFFLFNBQVM7QUFDdEIsY0FBVSxFQUFFLFNBQVMsRUFDdEI7O0FBQ0QsbUJBQWlCLEVBQUU7QUFDakIsU0FBSyxFQUFFLEdBQUc7QUFDVixVQUFNLEVBQUUsQ0FBQyxFQUNWO0NBQ0YsQ0FBQzs7Ozs7OztBQU1GLElBQU0sZUFBZSxHQUFHO0FBQ3RCLGNBQVksRUFBRSxrQkFBSyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLFFBQVEsQ0FBQztBQUNoRCxnQkFBYyxFQUFFLGtCQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsT0FBTyxDQUFDO0FBQ2pELGVBQWEsRUFBRSxRQUFRO0FBQ3ZCLGNBQVksRUFBRSxFQUFFO0FBQ2hCLFVBQVEsRUFBRTtBQUNSLE9BQUcsRUFBRSxFQUFFO0FBQ1AsY0FBVSxFQUFFLENBQUMsV0FBVyxDQUFDO0FBQ3pCLGVBQVcsRUFBRSxLQUFLO0FBQ2xCLGdCQUFZLEVBQUUsS0FBSyxFQU1wQjtDQUNGLENBQUM7Ozs7Ozs7Ozs7OztBQU1GLElBQU0sZ0JBQWdCLEdBQUc7QUFDdkIsTUFBSSxFQUFFLElBQUk7Ozs7Ozs7QUFPVixLQUFHLEVBQUUsSUFBSTtBQUNULFFBQU0sRUFBRTtBQUNOLFFBQUksRUFBRSxZQUFZO0FBQ2xCLFNBQUssRUFBRSxNQUFNO0FBQ2IsV0FBTyxFQUFFLENBQUM7QUFDUixXQUFLLEVBQUUsTUFBTTtBQUNiLFlBQU0sRUFBRSxPQUFPLENBQUMsTUFBTTtLQUN2QixDQUdHO0dBQ0w7Q0FDRixDQUFDOzs7Ozs7Ozs7O3dCQU9hOzs7Ozs7O0FBT2IsSUFBRSxFQUFFLElBQUk7Ozs7OztBQU1SLFlBQVUsRUFBRSxJQUFJOzs7OztBQUtoQixZQUFVLEVBQUUsSUFBSTs7Ozs7O0FBTWhCLFFBQU0sRUFBRSxFQUFFOzs7Ozs7OztBQVFWLEtBQUcsRUFBRSxJQUFJOzs7OztBQUtULE9BQUssRUFBRSxFQUFFOzs7OztBQUtULGFBQVcsRUFBRSxVQUFTOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQnRCLE1BQUksRUFBQSxnQkFBYTs7OztBQUVmLFFBQUksQ0FBQyxNQUFNLEdBQUcsZUFBYyxJQUFJLENBQUMsTUFBTSxFQUFFLGdCQUFnQixFQUFFLGVBQWUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDOzs7c0NBRnhGLE9BQU87QUFBUCxhQUFPOzs7QUFJYixXQUFPLENBQUMsT0FBTyxDQUFDLFVBQUMsTUFBTSxFQUFLO0FBQzFCLFdBQUssSUFBSSxHQUFHLElBQUksTUFBTSxFQUFFO0FBQ3RCLFlBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMxQixZQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxLQUFLLEtBQUssSUFBSSxFQUFFO0FBQy9DLGdCQUFLLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFLLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDMUMsZ0JBQUssTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLGVBQWMsTUFBSyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDM0QsTUFBTTtBQUNMLGdCQUFLLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7U0FDMUI7T0FDRjtLQUNGLENBQUMsQ0FBQztHQUNKOzs7Ozs7Ozs7QUFTRCxPQUFLLEVBQUEsaUJBQUc7Ozs7Ozs7QUFLTixRQUFNLFVBQVUsR0FBRywwQkFBYSxDQUFDO0FBQ2pDLGNBQVUsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDN0QsY0FBVSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDckMsY0FBVSxDQUFDLEdBQUcsQ0FBQyw4QkFBYyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQzs7QUFFekQsUUFBTSxVQUFVLEdBQUcsa0JBQUssWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2pELGNBQVUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxZQUFXO0FBQ25ELFVBQU0sR0FBRyx5QkFBdUIsVUFBVSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQUFBRSxDQUFDO0FBQ3pELGFBQU8sQ0FBQyxHQUFHLENBQUMsbUNBQW1DLEVBQUUsR0FBRyxDQUFDLENBQUM7S0FDdkQsQ0FBQyxDQUFDOztBQUVILFFBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0FBQzdCLFFBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDOztBQUU3QixRQUFJLENBQUMsRUFBRSxHQUFHLDBCQUFPLFVBQVUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ25ELHlCQUFRLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDNUIsNkJBQU8sVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7Ozs7OztBQU10QyxRQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFFBQVE7YUFBSyxRQUFRLENBQUMsS0FBSyxFQUFFO0tBQUEsQ0FBQyxDQUFDOztBQUV6RCxTQUFLLElBQUksVUFBVSxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDakMsVUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN4QyxVQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUNqQzs7Ozs7QUFLRCxRQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFOztBQUNuQixZQUFNLFNBQVMsR0FBRyxPQUFLLE1BQU0sQ0FBQyxHQUFHLENBQUM7O0FBRWxDLGVBQUssR0FBRyxHQUFHLElBQUksaUJBQUksT0FBTyxDQUFDOztBQUV6QixzQkFBWSxFQUFFLFNBQVMsQ0FBQyxjQUFjO0FBQ3RDLG1CQUFTLEVBQUUsU0FBUyxDQUFDLFdBQVc7O0FBRWhDLHVCQUFhLEVBQUUsU0FBUyxDQUFDLFdBQVc7QUFDcEMsb0JBQVUsRUFBRSxTQUFTLENBQUMsUUFBUTtTQUMvQixDQUFDLENBQUM7O0FBRUgsZUFBSyxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxZQUFNO0FBQ3pCLGNBQU0sT0FBTyxHQUFNLFNBQVMsQ0FBQyxjQUFjLFNBQUksU0FBUyxDQUFDLFdBQVcsQUFBRSxDQUFDO0FBQ3ZFLGNBQU0sSUFBSSxHQUFNLFNBQVMsQ0FBQyxXQUFXLFNBQUksU0FBUyxDQUFDLFFBQVEsQUFBRSxDQUFDO0FBQzlELGlCQUFPLENBQUMsR0FBRyxrQ0FBZ0MsT0FBTyxDQUFHLENBQUM7QUFDdEQsaUJBQU8sQ0FBQyxHQUFHLGdDQUE4QixJQUFJLENBQUcsQ0FBQztTQUNsRCxDQUFDLENBQUM7O0FBRUgsZUFBSyxHQUFHLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxVQUFDLE1BQU0sRUFBSztBQUNqQyxjQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDOztBQUUvQixlQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUM1QyxnQkFBSSxPQUFPLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFDdEMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztXQUNwQztTQUNGLENBQUMsQ0FBQzs7QUFFSCxlQUFLLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7S0FDakI7O0dBRUY7Ozs7Ozs7QUFPRCxTQUFPLEVBQUEsaUJBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRTtBQUNuQixXQUFPLGtDQUFxQixPQUFPLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0dBQ2xEOzs7Ozs7OztBQVFELFFBQU0sRUFBQSxnQkFBQyxXQUFXLEVBQUUsUUFBUSxFQUFFOzs7QUFDNUIsZUFBVyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFVBQVUsRUFBSztBQUNsQyxVQUFJLENBQUMsT0FBSyxLQUFLLENBQUMsVUFBVSxDQUFDLEVBQ3pCLE9BQUssS0FBSyxDQUFDLFVBQVUsQ0FBQyxHQUFHLFVBQVMsQ0FBQzs7QUFFckMsYUFBSyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ3RDLENBQUMsQ0FBQztHQUNKOzs7Ozs7O0FBT0QsYUFBVyxFQUFBLHFCQUFDLFFBQVEsRUFBRTtBQUNwQixRQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztHQUNoQzs7Ozs7Ozs7Ozs7QUFXRCxNQUFJLEVBQUEsY0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFOzs7O0FBRXhCLFFBQU0sR0FBRyxHQUFHLEFBQUMsVUFBVSxLQUFLLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxTQUFRLFVBQVUsR0FBSyxHQUFHLENBQUM7OztBQUdoRixRQUFNLFVBQVUsR0FBRyxrQkFBSyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUssVUFBVSxVQUFPLENBQUM7QUFDOUUsUUFBTSxXQUFXLEdBQUcsa0JBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxnQkFBZ0IsQ0FBQztBQUN6RSxRQUFNLFFBQVEsR0FBRyxnQkFBRyxVQUFVLENBQUMsVUFBVSxDQUFDLEdBQUcsVUFBVSxHQUFHLFdBQVcsQ0FBQzs7QUFFdEUsUUFBTSxVQUFVLEdBQUcsZ0JBQUcsWUFBWSxDQUFDLFFBQVEsRUFBRSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQ25FLFFBQU0sSUFBSSxHQUFHLGlCQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQzs7QUFFckMsUUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLFVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBSztBQUNyQyxTQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztBQUNaLGdCQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFLLE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFDOUMsZUFBTyxFQUFFLE9BQUssTUFBTSxDQUFDLE9BQU87QUFDNUIsa0JBQVUsRUFBRSxVQUFVO0FBQ3RCLG1CQUFXLEVBQUUsT0FBSyxNQUFNLENBQUMsYUFBYTtBQUN0QyxvQkFBWSxFQUFFLE9BQUssTUFBTSxDQUFDLFlBQVk7T0FDdkMsQ0FBQyxDQUFDLENBQUM7S0FDTCxDQUFDLENBQUM7OztBQUdILFFBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztHQUNsRjs7Ozs7QUFLRCxlQUFhLEVBQUEsdUJBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRTtBQUNqQyxXQUFPLFVBQUMsTUFBTSxFQUFLO0FBQ2pCLFVBQU0sTUFBTSxHQUFHLHdCQUFXLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUM5QyxhQUFPLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRztlQUFLLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO09BQUEsQ0FBQyxDQUFDOzs7QUFHOUMsMkJBQVEsT0FBTyxDQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUUsWUFBTTtBQUMxQyxlQUFPLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRztpQkFBSyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztTQUFBLENBQUMsQ0FBQzs7QUFFakQsY0FBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2pCLGlDQUFPLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsVUFBVSxFQUFWLFVBQVUsRUFBRSxFQUFFLFlBQVksQ0FBQyxDQUFDO09BQ25ELENBQUMsQ0FBQzs7O0FBR0gsMkJBQVEsSUFBSSxDQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2pELCtCQUFPLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsVUFBVSxFQUFWLFVBQVUsRUFBRSxFQUFFLFlBQVksQ0FBQyxDQUFDO0tBQ25ELENBQUE7R0FDRjs7Ozs7Ozs7O0FBU0QsU0FBTyxFQUFBLGlCQUFDLFFBQVEsRUFBRSxJQUFJLEVBQTJCO1FBQXpCLEdBQUcseURBQUcsSUFBSTtRQUFFLElBQUkseURBQUcsSUFBSTs7QUFDN0MsUUFBTSxNQUFNLEdBQUc7QUFDYixhQUFPLEVBQUUsUUFBUTtBQUNqQixVQUFJLEVBQUUsSUFBSTtLQUNYLENBQUM7O0FBRUYsUUFBSTtBQUNGLFVBQUksR0FBRyxJQUFJLElBQUksRUFBRTtBQUNmLFlBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7T0FDbEMsTUFBTTtBQUNMLFlBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO09BQ3ZCO0tBQ0YsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNWLGFBQU8sQ0FBQyxHQUFHLENBQUMsa0NBQWtDLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDcEQ7R0FDRjs7Ozs7Ozs7O0FBU0QsWUFBVSxFQUFBLG9CQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUU7QUFDN0IsUUFBTSxXQUFXLEdBQUc7QUFDbEIsY0FBUSxFQUFFLFFBQVE7QUFDbEIsY0FBUSxFQUFFLFFBQVE7S0FDbkIsQ0FBQzs7QUFFRixnQkFBWSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztHQUNoQztDQUNGIiwiZmlsZSI6InNyYy9zZXJ2ZXIvY29yZS9zZXJ2ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc29ja2V0cyBmcm9tICcuL3NvY2tldHMnO1xuaW1wb3J0IGVqcyBmcm9tICdlanMnO1xuaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IGh0dHAgZnJvbSAnaHR0cCc7XG5pbXBvcnQgbG9nZ2VyIGZyb20gJy4uL3V0aWxzL2xvZ2dlcic7XG5pbXBvcnQgSU8gZnJvbSAnc29ja2V0LmlvJztcbmltcG9ydCBvc2MgZnJvbSAnb3NjJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IENsaWVudCBmcm9tICcuL0NsaWVudCc7XG5pbXBvcnQgc2VydmVyU2VydmljZU1hbmFnZXIgZnJvbSAnLi9zZXJ2ZXJTZXJ2aWNlTWFuYWdlcic7XG5cbi8vIEB0b2RvIC0gbW92ZSBpbnRvIG9zYyBzZXJ2aWNlLlxuY29uc3Qgb3NjTGlzdGVuZXJzID0gW107XG5cbi8qKlxuICogU2V0IG9mIGNvbmZpZ3VyYXRpb24gcGFyYW1ldGVycyBkZWZpbmVkIGJ5IGEgcGFydGljdWxhciBhcHBsaWNhdGlvbi5cbiAqIFRoZXNlIHBhcmFtZXRlcnMgdHlwaWNhbGx5IGluY2x1c2QgYSBzZXR1cCBhbmQgY29udHJvbCBwYXJhbWV0ZXJzIHZhbHVlcy5cbiAqL1xuY29uc3QgZXhhbXBsZUFwcENvbmZpZyA9IHtcbiAgYXBwTmFtZTogJ1NvdW5kd29ya3MnLCAvLyB0aXRsZSBvZiB0aGUgYXBwbGljYXRpb24gKGZvciA8dGl0bGU+IHRhZylcbiAgdmVyc2lvbjogJzAuMC4xJywgLy8gdmVyc2lvbiBvZiB0aGUgYXBwbGljYXRpb24gKGJ5cGFzcyBicm93c2VyIGNhY2hlKVxuICBwbGF5ZXJTZXR1cDoge1xuICAgIHdpZHRoOiAxMCwgLy8gd2lkdGggb2YgdGhlIHNldHVwIGFyZWEgaW4gbWV0ZXJzXG4gICAgaGVpZ2h0OiAxMCwgLy8gaGVpZ2h0IG9mIHRoZSBzZXR1cCBhcmVhIGluIG1ldGVyc1xuICAgIGxhYmVsczogdW5kZWZpbmVkLCAvLyBwcmVkZWZpbmVkIGxhYmVscyAob3B0aW9uYWwpXG4gICAgY29vcmRpbmF0ZXM6IHVuZGVmaW5lZCwgLy8gcHJlZGVmaW5lZCBjb29yZGluYXRlcyBvbiB0aGUgc2V0dXAgYXJlYSAob3B0aW9uYWwpXG4gICAgYmFja2dyb3VuZDogdW5kZWZpbmVkLCAvLyBVUkwgb2YgYSBiYWNrZ3JvdW5kIGltYWdlIGZpdHRpbmcgdGhlIHNldHVwIGFyZWEgKG9wdGlvbmFsKVxuICB9LFxuICBjb250cm9sUGFyYW1ldGVyczoge1xuICAgIHRlbXBvOiAxMjAsIC8vIHRlbXBvIGluIEJQTVxuICAgIHZvbHVtZTogMCwgLy8gbWFzdGVyIHZvbHVtZSBpbiBkQlxuICB9LFxufTtcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIHBhcmFtZXRlcnMgb2YgdGhlIFNvdW5kd29ya3MgZnJhbWV3b3JrLlxuICogVGhlc2UgcGFyYW1ldGVycyBhbGxvdyBmb3IgY29uZmlndXJpbmcgY29tcG9uZW50cyBvZiB0aGUgZnJhbWV3b3JrIHN1Y2ggYXMgRXhwcmVzcyBhbmQgU29ja2V0SU8uXG4gKi9cbmNvbnN0IGRlZmF1bHRGd0NvbmZpZyA9IHtcbiAgcHVibGljRm9sZGVyOiBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3B1YmxpYycpLFxuICB0ZW1wbGF0ZUZvbGRlcjogcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICd2aWV3cycpLFxuICBkZWZhdWx0Q2xpZW50OiAncGxheWVyJyxcbiAgYXNzZXRzRG9tYWluOiAnJywgLy8gb3ZlcnJpZGUgdG8gZG93bmxvYWQgYXNzZXRzIGZyb20gYSBkaWZmZXJlbnQgc2VydmV1ciAobmdpbngpXG4gIHNvY2tldElPOiB7XG4gICAgdXJsOiAnJyxcbiAgICB0cmFuc3BvcnRzOiBbJ3dlYnNvY2tldCddLFxuICAgIHBpbmdUaW1lb3V0OiA2MDAwMCwgLy8gY29uZmlndXJlIGNsaWVudCBzaWRlIHRvbyA/XG4gICAgcGluZ0ludGVydmFsOiA1MDAwMCwgLy8gY29uZmlndXJlIGNsaWVudCBzaWRlIHRvbyA/XG4gICAgLy8gQG5vdGU6IEVuZ2luZUlPIGRlZmF1bHRzXG4gICAgLy8gcGluZ1RpbWVvdXQ6IDMwMDAsXG4gICAgLy8gcGluZ0ludGVydmFsOiAxMDAwLFxuICAgIC8vIHVwZ3JhZGVUaW1lb3V0OiAxMDAwMCxcbiAgICAvLyBtYXhIdHRwQnVmZmVyU2l6ZTogMTBFNyxcbiAgfSxcbn07XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzIG9mIHRoZSBTb3VuZHdvcmtzIGZyYW1ld29yay5cbiAqIFRoZXNlIHBhcmFtZXRlcnMgYWxsb3cgZm9yIGNvbmZpZ3VyaW5nIGNvbXBvbmVudHMgb2YgdGhlIGZyYW1ld29yayBzdWNoIGFzIEV4cHJlc3MgYW5kIFNvY2tldElPLlxuICovXG5jb25zdCBkZWZhdWx0RW52Q29uZmlnID0ge1xuICBwb3J0OiA4MDAwLFxuICAvLyBvc2M6IHtcbiAgLy8gICByZWNlaXZlQWRkcmVzczogJzEyNy4wLjAuMScsXG4gIC8vICAgcmVjZWl2ZVBvcnQ6IDU3MTIxLFxuICAvLyAgIHNlbmRBZGRyZXNzOiAnMTI3LjAuMC4xJyxcbiAgLy8gICBzZW5kUG9ydDogNTcxMjAsXG4gIC8vIH0sXG4gIG9zYzogbnVsbCxcbiAgbG9nZ2VyOiB7XG4gICAgbmFtZTogJ3NvdW5kd29ya3MnLFxuICAgIGxldmVsOiAnaW5mbycsXG4gICAgc3RyZWFtczogW3tcbiAgICAgIGxldmVsOiAnaW5mbycsXG4gICAgICBzdHJlYW06IHByb2Nlc3Muc3Rkb3V0LFxuICAgIH0sIC8qe1xuICAgICAgbGV2ZWw6ICdpbmZvJyxcbiAgICAgIHBhdGg6IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnbG9ncycsICdzb3VuZHdvcmtzLmxvZycpLFxuICAgIH0qL11cbiAgfVxufTtcblxuLyoqXG4gKiBUaGUgYHNlcnZlcmAgb2JqZWN0IGNvbnRhaW5zIHRoZSBiYXNpYyBtZXRob2RzIG9mIHRoZSBzZXJ2ZXIuXG4gKiBGb3IgaW5zdGFuY2UsIHRoaXMgb2JqZWN0IGFsbG93cyBzZXR0aW5nIHVwLCBjb25maWd1cmluZyBhbmQgc3RhcnRpbmcgdGhlIHNlcnZlciB3aXRoIHRoZSBtZXRob2QgYHN0YXJ0YCB3aGlsZSB0aGUgbWV0aG9kIGBtYXBgIGFsbG93cyBmb3IgbWFuYWdpbmcgdGhlIG1hcHBpbmcgYmV0d2VlbiBkaWZmZXJlbnQgdHlwZXMgb2YgY2xpZW50cyBhbmQgdGhlaXIgcmVxdWlyZWQgc2VydmVyIG1vZHVsZXMuXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5leHBvcnQgZGVmYXVsdCB7XG5cbiAgLyoqXG4gICAqIFdlYlNvY2tldCBzZXJ2ZXIuXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBpbzogbnVsbCxcblxuICAvKipcbiAgICogRXhwcmVzcyBhcHBsaWNhdGlvblxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgZXhwcmVzc0FwcDogbnVsbCxcbiAgLyoqXG4gICAqIEh0dHAgc2VydmVyXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xuICBodHRwU2VydmVyOiBudWxsLFxuXG4gIC8qKlxuICAgKiBDb25maWd1cmF0aW9uIGluZm9ybWF0aW9ucy5cbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG4gIGNvbmZpZzoge30sXG5cbiAgLyoqXG4gICAqIE9TQyBvYmplY3QuXG4gICAqIEB0b2RvIC0gTW92ZSBpbnRvIHNlcnZpY2VcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIG9zYzogbnVsbCxcblxuICAvKipcbiAgICogTWFwcGluZyBiZXR3ZWVuIGEgYGNsaWVudFR5cGVgIGFuZCBpdHMgcmVsYXRlZCBhY3Rpdml0aWVzXG4gICAqL1xuICBfbWFwczoge30sXG5cbiAgLyoqXG4gICAqIEFjdGl2aXRpZXMgdG8gYmUgc3RhcnRlZFxuICAgKi9cbiAgX2FjdGl2aXRpZXM6IG5ldyBTZXQoKSxcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgc2VydmVyIHdpdGggdGhlIGdpdmVuIGNvbmZpZyBvYmplY3RzLlxuICAgKiBAcGFyYW0gey4uLk9iamVjdH0gY29uZmlncyAtIE9iamVjdCBvZiBhcHBsaWNhdGlvbiBjb25maWd1cmF0aW9uLlxuICAgKlxuICAgKiBAdG9kbyAtIHJld3JpdGUgZG9jIHByb3Blcmx5IGZvciB0aGlzIG1ldGhvZC5cbiAgICogQHBhcmFtIHtPYmplY3R9IFthcHBDb25maWc9e31dIEFwcGxpY2F0aW9uIGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAgICogQGF0dHJpYnV0ZSB7U3RyaW5nfSBbYXBwQ29uZmlnLnB1YmxpY0ZvbGRlcj0nLi9wdWJsaWMnXSBQYXRoIHRvIHRoZSBwdWJsaWMgZm9sZGVyLlxuICAgKiBAYXR0cmlidXRlIHtPYmplY3R9IFthcHBDb25maWcuc29ja2V0SU89e31dIHNvY2tldC5pbyBvcHRpb25zLiBUaGUgc29ja2V0LmlvIGNvbmZpZyBvYmplY3QgY2FuIGhhdmUgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICAgKiAtIGB0cmFuc3BvcnRzOlN0cmluZ2A6IGNvbW11bmljYXRpb24gdHJhbnNwb3J0IChkZWZhdWx0cyB0byBgJ3dlYnNvY2tldCdgKTtcbiAgICogLSBgcGluZ1RpbWVvdXQ6TnVtYmVyYDogdGltZW91dCAoaW4gbWlsbGlzZWNvbmRzKSBiZWZvcmUgdHJ5aW5nIHRvIHJlZXN0YWJsaXNoIGEgY29ubmVjdGlvbiBiZXR3ZWVuIGEgbG9zdCBjbGllbnQgYW5kIGEgc2VydmVyIChkZWZhdXRscyB0byBgNjAwMDBgKTtcbiAgICogLSBgcGluZ0ludGVydmFsOk51bWJlcmA6IHRpbWUgaW50ZXJ2YWwgKGluIG1pbGxpc2Vjb25kcykgdG8gc2VuZCBhIHBpbmcgdG8gYSBjbGllbnQgdG8gY2hlY2sgdGhlIGNvbm5lY3Rpb24gKGRlZmF1bHRzIHRvIGA1MDAwMGApLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW2VudkNvbmZpZz17fV0gRW52aXJvbm1lbnQgY29uZmlndXJhdGlvbiBvcHRpb25zLlxuICAgKiBAYXR0cmlidXRlIHtOdW1iZXJ9IFtlbnZDb25maWcucG9ydD04MDAwXSBQb3J0IG9mIHRoZSBIVFRQIHNlcnZlci5cbiAgICogQGF0dHJpYnV0ZSB7T2JqZWN0fSBbZW52Q29uZmlnLm9zYz17fV0gT1NDIG9wdGlvbnMuIFRoZSBPU0MgY29uZmlnIG9iamVjdCBjYW4gaGF2ZSB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gICAqIC0gYGxvY2FsQWRkcmVzczpTdHJpbmdgOiBhZGRyZXNzIG9mIHRoZSBsb2NhbCBtYWNoaW5lIHRvIHJlY2VpdmUgT1NDIG1lc3NhZ2VzIChkZWZhdWx0cyB0byBgJzEyNy4wLjAuMSdgKTtcbiAgICogLSBgbG9jYWxQb3J0Ok51bWJlcmA6IHBvcnQgb2YgdGhlIGxvY2FsIG1hY2hpbmUgdG8gcmVjZWl2ZSBPU0MgbWVzc2FnZXMgKGRlZmF1bHRzIHRvIGA1NzEyMWApO1xuICAgKiAtIGByZW1vdGVBZGRyZXNzOlN0cmluZ2A6IGFkZHJlc3Mgb2YgdGhlIGRldmljZSB0byBzZW5kIGRlZmF1bHQgT1NDIG1lc3NhZ2VzIHRvIChkZWZhdWx0cyB0byBgJzEyNy4wLjAuMSdgKTtcbiAgICogLSBgcmVtb3RlUG9ydDpOdW1iZXJgOiBwb3J0IG9mIHRoZSBkZXZpY2UgdG8gc2VuZCBkZWZhdWx0IE9TQyBtZXNzYWdlcyB0byAoZGVmYXVsdHMgdG8gYDU3MTIwYCkuXG4gICAqL1xuICBpbml0KC4uLmNvbmZpZ3MpIHtcbiAgICAgICAgLy8gbWVyZ2UgZGVmYXVsdCBjb25maWd1cmF0aW9uIG9iamVjdHNcbiAgICB0aGlzLmNvbmZpZyA9IE9iamVjdC5hc3NpZ24odGhpcy5jb25maWcsIGV4YW1wbGVBcHBDb25maWcsIGRlZmF1bHRGd0NvbmZpZywgZGVmYXVsdEVudkNvbmZpZyk7XG4gICAgLy8gbWVyZ2UgZ2l2ZW4gY29uZmlndXJhdGlvbnMgb2JqZWN0cyB3aXRoIGRlZmF1bHRzICgxIGxldmVsIGRlcHRoKVxuICAgIGNvbmZpZ3MuZm9yRWFjaCgoY29uZmlnKSA9PiB7XG4gICAgICBmb3IgKGxldCBrZXkgaW4gY29uZmlnKSB7XG4gICAgICAgIGNvbnN0IGVudHJ5ID0gY29uZmlnW2tleV07XG4gICAgICAgIGlmICh0eXBlb2YgZW50cnkgPT09ICdvYmplY3QnICYmIGVudHJ5ICE9PSBudWxsKSB7XG4gICAgICAgICAgdGhpcy5jb25maWdba2V5XSA9IHRoaXMuY29uZmlnW2tleV0gfHzCoHt9O1xuICAgICAgICAgIHRoaXMuY29uZmlnW2tleV0gPSBPYmplY3QuYXNzaWduKHRoaXMuY29uZmlnW2tleV0sIGVudHJ5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmNvbmZpZ1trZXldID0gZW50cnk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogU3RhcnQgdGhlIHNlcnZlcjpcbiAgICogLSBsYXVuY2ggdGhlIEhUVFAgc2VydmVyLlxuICAgKiAtIGxhdW5jaCB0aGUgc29ja2V0IHNlcnZlci5cbiAgICogLSBzdGFydCBhbGwgcmVnaXN0ZXJlZCBhY3Rpdml0aWVzLlxuICAgKiAtIGRlZmluZSByb3V0ZXMgYW5kIGFzc29jaWF0ZSBjbGllbnQgdHlwZXMgYW5kIGFjdGl2aXRpZXMuXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIGNvbmZpZ3VyZSBleHByZXNzIGFuZCBodHRwIHNlcnZlclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBjb25zdCBleHByZXNzQXBwID0gbmV3IGV4cHJlc3MoKTtcbiAgICBleHByZXNzQXBwLnNldCgncG9ydCcsIHByb2Nlc3MuZW52LlBPUlQgfHwgdGhpcy5jb25maWcucG9ydCk7XG4gICAgZXhwcmVzc0FwcC5zZXQoJ3ZpZXcgZW5naW5lJywgJ2VqcycpO1xuICAgIGV4cHJlc3NBcHAudXNlKGV4cHJlc3Muc3RhdGljKHRoaXMuY29uZmlnLnB1YmxpY0ZvbGRlcikpO1xuXG4gICAgY29uc3QgaHR0cFNlcnZlciA9IGh0dHAuY3JlYXRlU2VydmVyKGV4cHJlc3NBcHApO1xuICAgIGh0dHBTZXJ2ZXIubGlzdGVuKGV4cHJlc3NBcHAuZ2V0KCdwb3J0JyksIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgdXJsID0gYGh0dHA6Ly8xMjcuMC4wLjE6JHtleHByZXNzQXBwLmdldCgncG9ydCcpfWA7XG4gICAgICBjb25zb2xlLmxvZygnW0hUVFAgU0VSVkVSXSBTZXJ2ZXIgbGlzdGVuaW5nIG9uJywgdXJsKTtcbiAgICB9KTtcblxuICAgIHRoaXMuZXhwcmVzc0FwcCA9IGV4cHJlc3NBcHA7XG4gICAgdGhpcy5odHRwU2VydmVyID0gaHR0cFNlcnZlcjtcblxuICAgIHRoaXMuaW8gPSBuZXcgSU8oaHR0cFNlcnZlciwgdGhpcy5jb25maWcuc29ja2V0SU8pO1xuICAgIHNvY2tldHMuaW5pdGlhbGl6ZSh0aGlzLmlvKTtcbiAgICBsb2dnZXIuaW5pdGlhbGl6ZSh0aGlzLmNvbmZpZy5sb2dnZXIpO1xuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBzdGFydCBhbGwgYWN0aXZpdGllcyBhbmQgY3JlYXRlIHJvdXRlc1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICB0aGlzLl9hY3Rpdml0aWVzLmZvckVhY2goKGFjdGl2aXR5KSA9PiBhY3Rpdml0eS5zdGFydCgpKTtcbiAgICAvLyBtYXAgYGNsaWVudFR5cGVgIHRvIHRoZWlyIHJlc3BlY3RpdmUgYWN0aXZpdGllc1xuICAgIGZvciAobGV0IGNsaWVudFR5cGUgaW4gdGhpcy5fbWFwcykge1xuICAgICAgY29uc3QgYWN0aXZpdHkgPSB0aGlzLl9tYXBzW2NsaWVudFR5cGVdO1xuICAgICAgdGhpcy5fbWFwKGNsaWVudFR5cGUsIGFjdGl2aXR5KTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIEB0b2RvIC0gbW92ZSBpbnRvIGEgcHJvcGVyIHNlcnZpY2UuXG4gICAgLy8gY29uZmlndXJlIE9TQyAtIHNob3VsZCBiZSBvcHRpb25uYWxcbiAgICBpZiAodGhpcy5jb25maWcub3NjKSB7XG4gICAgICBjb25zdCBvc2NDb25maWcgPSB0aGlzLmNvbmZpZy5vc2M7XG5cbiAgICAgIHRoaXMub3NjID0gbmV3IG9zYy5VRFBQb3J0KHtcbiAgICAgICAgLy8gVGhpcyBpcyB0aGUgcG9ydCB3ZSdyZSBsaXN0ZW5pbmcgb24uXG4gICAgICAgIGxvY2FsQWRkcmVzczogb3NjQ29uZmlnLnJlY2VpdmVBZGRyZXNzLFxuICAgICAgICBsb2NhbFBvcnQ6IG9zY0NvbmZpZy5yZWNlaXZlUG9ydCxcbiAgICAgICAgLy8gVGhpcyBpcyB0aGUgcG9ydCB3ZSB1c2UgdG8gc2VuZCBtZXNzYWdlcy5cbiAgICAgICAgcmVtb3RlQWRkcmVzczogb3NjQ29uZmlnLnNlbmRBZGRyZXNzLFxuICAgICAgICByZW1vdGVQb3J0OiBvc2NDb25maWcuc2VuZFBvcnQsXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5vc2Mub24oJ3JlYWR5JywgKCkgPT4ge1xuICAgICAgICBjb25zdCByZWNlaXZlID0gYCR7b3NjQ29uZmlnLnJlY2VpdmVBZGRyZXNzfToke29zY0NvbmZpZy5yZWNlaXZlUG9ydH1gO1xuICAgICAgICBjb25zdCBzZW5kID0gYCR7b3NjQ29uZmlnLnNlbmRBZGRyZXNzfToke29zY0NvbmZpZy5zZW5kUG9ydH1gO1xuICAgICAgICBjb25zb2xlLmxvZyhgW09TQyBvdmVyIFVEUF0gUmVjZWl2aW5nIG9uICR7cmVjZWl2ZX1gKTtcbiAgICAgICAgY29uc29sZS5sb2coYFtPU0Mgb3ZlciBVRFBdIFNlbmRpbmcgb24gJHtzZW5kfWApO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMub3NjLm9uKCdtZXNzYWdlJywgKG9zY01zZykgPT4ge1xuICAgICAgICBjb25zdCBhZGRyZXNzID0gb3NjTXNnLmFkZHJlc3M7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvc2NMaXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAoYWRkcmVzcyA9PT0gb3NjTGlzdGVuZXJzW2ldLndpbGRjYXJkKVxuICAgICAgICAgICAgb3NjTGlzdGVuZXJzW2ldLmNhbGxiYWNrKG9zY01zZyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm9zYy5vcGVuKCk7XG4gICAgfVxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIH0sXG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzZXJ2aWNlIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gVGhlIGlkZW50aWZpZXIgb2YgdGhlIHNlcnZpY2UuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gVGhlIG9wdGlvbnMgdG8gY29uZmlndXJlIHRoZSBzZXJ2aWNlLlxuICAgKi9cbiAgcmVxdWlyZShpZCwgb3B0aW9ucykge1xuICAgIHJldHVybiBzZXJ2ZXJTZXJ2aWNlTWFuYWdlci5yZXF1aXJlKGlkLCBvcHRpb25zKTtcbiAgfSxcblxuICAvKipcbiAgICogRnVuY3Rpb24gdXNlZCBieSBhY3Rpdml0aWVzIHRvIHJlZ2lzdGVyZWQgdGhlaXIgY29uY2VybmVkIGNsaWVudCB0eXBlIGludG8gdGhlIHNlcnZlclxuICAgKiBAcGFyYW0ge0FycmF5PFN0cmluZz59IGNsaWVudFR5cGVzIC0gQW4gYXJyYXkgb2YgY2xpZW50IHR5cGUuXG4gICAqIEBwYXJhbSB7QWN0aXZpdHl9IGFjdGl2aXR5IC0gVGhlIGFjdGl2aXR5IGNvbmNlcm5lZCB3aXRoIHRoZSBnaXZlbiBgY2xpZW50VHlwZXNgLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0TWFwKGNsaWVudFR5cGVzLCBhY3Rpdml0eSkge1xuICAgIGNsaWVudFR5cGVzLmZvckVhY2goKGNsaWVudFR5cGUpID0+IHtcbiAgICAgIGlmICghdGhpcy5fbWFwc1tjbGllbnRUeXBlXSlcbiAgICAgICAgdGhpcy5fbWFwc1tjbGllbnRUeXBlXSA9IG5ldyBTZXQoKTtcblxuICAgICAgdGhpcy5fbWFwc1tjbGllbnRUeXBlXS5hZGQoYWN0aXZpdHkpO1xuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiB1c2VkIGJ5IGFjdGl2aXRpZXMgdG8gcmVnaXN0ZXIgdGhlbXNlbHZlcyBhcyBhY3RpdmUgYWN0aXZpdGllc1xuICAgKiBAcGFyYW0ge0FjdGl2aXR5fSBhY3Rpdml0eVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0QWN0aXZpdHkoYWN0aXZpdHkpIHtcbiAgICB0aGlzLl9hY3Rpdml0aWVzLmFkZChhY3Rpdml0eSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEluZGljYXRlIHRoYXQgdGhlIGNsaWVudHMgb2YgdHlwZSBgY2xpZW50VHlwZWAgcmVxdWlyZSB0aGUgbW9kdWxlcyBgLi4ubW9kdWxlc2Agb24gdGhlIHNlcnZlciBzaWRlLlxuICAgKiBBZGRpdGlvbmFsbHksIHRoaXMgbWV0aG9kIHJvdXRlcyB0aGUgY29ubmVjdGlvbnMgZnJvbSB0aGUgY29ycmVzcG9uZGluZyBVUkwgdG8gdGhlIGNvcnJlc3BvbmRpbmcgdmlldy5cbiAgICogTW9yZSBzcGVjaWZpY2FsbHk6XG4gICAqIC0gQSBjbGllbnQgY29ubmVjdGluZyB0byB0aGUgc2VydmVyIHRocm91Z2ggdGhlIHJvb3QgVVJMIGBodHRwOi8vbXkuc2VydmVyLmFkZHJlc3M6cG9ydC9gIGlzIGNvbnNpZGVyZWQgYXMgYSBgJ3BsYXllcidgIGNsaWVudCBhbmQgZGlzcGxheXMgdGhlIHZpZXcgYHBsYXllci5lanNgO1xuICAgKiAtIEEgY2xpZW50IGNvbm5lY3RpbmcgdG8gdGhlIHNlcnZlciB0aHJvdWdoIHRoZSBVUkwgYGh0dHA6Ly9teS5zZXJ2ZXIuYWRkcmVzczpwb3J0L2NsaWVudFR5cGVgIGlzIGNvbnNpZGVyZWQgYXMgYSBgY2xpZW50VHlwZWAgY2xpZW50LCBhbmQgZGlzcGxheXMgdGhlIHZpZXcgYGNsaWVudFR5cGUuZWpzYC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNsaWVudFR5cGUgQ2xpZW50IHR5cGUgKGFzIGRlZmluZWQgYnkgdGhlIG1ldGhvZCB7QGxpbmsgY2xpZW50LmluaXR9IG9uIHRoZSBjbGllbnQgc2lkZSkuXG4gICAqIEBwYXJhbSB7Li4uQ2xpZW50TW9kdWxlfSBtb2R1bGVzIE1vZHVsZXMgdG8gbWFwIHRvIHRoYXQgY2xpZW50IHR5cGUuXG4gICAqL1xuICBfbWFwKGNsaWVudFR5cGUsIG1vZHVsZXMpIHtcbiAgICAvLyBAdG9kbyAtIGFsbG93IHRvIHBhc3Mgc29tZSB2YXJpYWJsZSBpbiB0aGUgdXJsIC0+IGRlZmluZSBob3cgYmluZCBpdCB0byBzb2NrZXRzLi4uXG4gICAgY29uc3QgdXJsID0gKGNsaWVudFR5cGUgIT09IHRoaXMuY29uZmlnLmRlZmF1bHRDbGllbnQpID8gYC8ke2NsaWVudFR5cGV9YCA6ICcvJztcblxuICAgIC8vIHVzZSB0ZW1wbGF0ZSB3aXRoIGBjbGllbnRUeXBlYCBuYW1lIG9yIGRlZmF1bHQgaWYgbm90IGRlZmluZWRcbiAgICBjb25zdCBjbGllbnRUbXBsID0gcGF0aC5qb2luKHRoaXMuY29uZmlnLnRlbXBsYXRlRm9sZGVyLCBgJHtjbGllbnRUeXBlfS5lanNgKTtcbiAgICBjb25zdCBkZWZhdWx0VG1wbCA9IHBhdGguam9pbih0aGlzLmNvbmZpZy50ZW1wbGF0ZUZvbGRlciwgYGRlZmF1bHQuZWpzYCk7XG4gICAgY29uc3QgdGVtcGxhdGUgPSBmcy5leGlzdHNTeW5jKGNsaWVudFRtcGwpID8gY2xpZW50VG1wbCA6IGRlZmF1bHRUbXBsO1xuXG4gICAgY29uc3QgdG1wbFN0cmluZyA9IGZzLnJlYWRGaWxlU3luYyh0ZW1wbGF0ZSwgeyBlbmNvZGluZzogJ3V0ZjgnIH0pO1xuICAgIGNvbnN0IHRtcGwgPSBlanMuY29tcGlsZSh0bXBsU3RyaW5nKTtcblxuICAgIHRoaXMuZXhwcmVzc0FwcC5nZXQodXJsLCAocmVxLCByZXMpID0+IHtcbiAgICAgIHJlcy5zZW5kKHRtcGwoe1xuICAgICAgICBzb2NrZXRJTzogSlNPTi5zdHJpbmdpZnkodGhpcy5jb25maWcuc29ja2V0SU8pLFxuICAgICAgICBhcHBOYW1lOiB0aGlzLmNvbmZpZy5hcHBOYW1lLFxuICAgICAgICBjbGllbnRUeXBlOiBjbGllbnRUeXBlLFxuICAgICAgICBkZWZhdWx0VHlwZTogdGhpcy5jb25maWcuZGVmYXVsdENsaWVudCxcbiAgICAgICAgYXNzZXRzRG9tYWluOiB0aGlzLmNvbmZpZy5hc3NldHNEb21haW4sXG4gICAgICB9KSk7XG4gICAgfSk7XG5cbiAgICAvLyB3YWl0IGZvciBzb2NrZXQgY29ubm5lY3Rpb25cbiAgICB0aGlzLmlvLm9mKGNsaWVudFR5cGUpLm9uKCdjb25uZWN0aW9uJywgdGhpcy5fb25Db25uZWN0aW9uKGNsaWVudFR5cGUsIG1vZHVsZXMpKTtcbiAgfSxcblxuICAvKipcbiAgICogU29ja2V0IGNvbm5lY3Rpb24gY2FsbGJhY2suXG4gICAqL1xuICBfb25Db25uZWN0aW9uKGNsaWVudFR5cGUsIG1vZHVsZXMpIHtcbiAgICByZXR1cm4gKHNvY2tldCkgPT4ge1xuICAgICAgY29uc3QgY2xpZW50ID0gbmV3IENsaWVudChjbGllbnRUeXBlLCBzb2NrZXQpO1xuICAgICAgbW9kdWxlcy5mb3JFYWNoKChtb2QpID0+IG1vZC5jb25uZWN0KGNsaWVudCkpO1xuXG4gICAgICAvLyBnbG9iYWwgbGlmZWN5Y2xlIG9mIHRoZSBjbGllbnRcbiAgICAgIHNvY2tldHMucmVjZWl2ZShjbGllbnQsICdkaXNjb25uZWN0JywgKCkgPT4ge1xuICAgICAgICBtb2R1bGVzLmZvckVhY2goKG1vZCkgPT4gbW9kLmRpc2Nvbm5lY3QoY2xpZW50KSk7XG4gICAgICAgIC8vIEB0b2RvIC0gc2hvdWxkIHJlbW92ZSBhbGwgbGlzdGVuZXJzIG9uIHRoZSBjbGllbnRcbiAgICAgICAgY2xpZW50LmRlc3Ryb3koKTtcbiAgICAgICAgbG9nZ2VyLmluZm8oeyBzb2NrZXQsIGNsaWVudFR5cGUgfSwgJ2Rpc2Nvbm5lY3QnKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBAdG9kbyAtIHJlZmFjdG9yIGhhbmRzaGFrZSBhbmQgdWlkIGRlZmluaXRpb24uXG4gICAgICBzb2NrZXRzLnNlbmQoY2xpZW50LCAnY2xpZW50OnN0YXJ0JywgY2xpZW50LnVpZCk7IC8vIHRoZSBzZXJ2ZXIgaXMgcmVhZHlcbiAgICAgIGxvZ2dlci5pbmZvKHsgc29ja2V0LCBjbGllbnRUeXBlIH0sICdjb25uZWN0aW9uJyk7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBTZW5kIGFuIE9TQyBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gd2lsZGNhcmQgV2lsZGNhcmQgb2YgdGhlIE9TQyBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge0FycmF5fSBhcmdzIEFyZ3VtZW50cyBvZiB0aGUgT1NDIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbdXJsPW51bGxdIFVSTCB0byBzZW5kIHRoZSBPU0MgbWVzc2FnZSB0byAoaWYgbm90IHNwZWNpZmllZCwgdXNlcyB0aGUgYWRkcmVzcyBkZWZpbmVkIGluIHRoZSBPU0MgY29uZmlnIG9yIGluIHRoZSBvcHRpb25zIG9mIHRoZSB7QGxpbmsgc2VydmVyLnN0YXJ0fSBtZXRob2QpLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW3BvcnQ9bnVsbF0gUG9ydCB0byBzZW5kIHRoZSBtZXNzYWdlIHRvIChpZiBub3Qgc3BlY2lmaWVkLCB1c2VzIHRoZSBwb3J0IGRlZmluZWQgaW4gdGhlIE9TQyBjb25maWcgb3IgaW4gdGhlIG9wdGlvbnMgb2YgdGhlIHtAbGluayBzZXJ2ZXIuc3RhcnR9IG1ldGhvZCkuXG4gICAqL1xuICBzZW5kT1NDKHdpbGRjYXJkLCBhcmdzLCB1cmwgPSBudWxsLCBwb3J0ID0gbnVsbCkge1xuICAgIGNvbnN0IG9zY01zZyA9IHtcbiAgICAgIGFkZHJlc3M6IHdpbGRjYXJkLFxuICAgICAgYXJnczogYXJnc1xuICAgIH07XG5cbiAgICB0cnkge1xuICAgICAgaWYgKHVybCAmJiBwb3J0KSB7XG4gICAgICAgIHRoaXMub3NjLnNlbmQob3NjTXNnLCB1cmwsIHBvcnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vc2Muc2VuZChvc2NNc2cpOyAvLyB1c2UgZGVmYXVsdHMgKGFzIGRlZmluZWQgaW4gdGhlIGNvbmZpZylcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZygnRXJyb3Igd2hpbGUgc2VuZGluZyBPU0MgbWVzc2FnZTonLCBlKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIExpc3RlbiBmb3IgT1NDIG1lc3NhZ2UgYW5kIGV4ZWN1dGUgYSBjYWxsYmFjayBmdW5jdGlvbi5cbiAgICogVGhlIHNlcnZlciBsaXN0ZW5zIHRvIE9TQyBtZXNzYWdlcyBhdCB0aGUgYWRkcmVzcyBhbmQgcG9ydCBkZWZpbmVkIGluIHRoZSBjb25maWcgb3IgaW4gdGhlIG9wdGlvbnMgb2YgdGhlIHtAbGluayBzZXJ2ZXIuc3RhcnR9IG1ldGhvZC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHdpbGRjYXJkIFdpbGRjYXJkIG9mIHRoZSBPU0MgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGJhY2sgZnVuY3Rpb24gZXhlY3V0ZWQgd2hlbiB0aGUgT1NDIG1lc3NhZ2UgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICByZWNlaXZlT1NDKHdpbGRjYXJkLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG9zY0xpc3RlbmVyID0ge1xuICAgICAgd2lsZGNhcmQ6IHdpbGRjYXJkLFxuICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gICAgfTtcblxuICAgIG9zY0xpc3RlbmVycy5wdXNoKG9zY0xpc3RlbmVyKTtcbiAgfVxufTtcbiJdfQ==