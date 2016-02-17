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
  version: '0.0.1', // version of the application (allow to bypass browser cache)
  /**
   * @param {Object} [setup={}] - Setup defining dimensions and predefined positions (labels and/or coordinates).
   * @attribute {Object} [setup.area=null] - The dimensions of the area.
   * @attribute {Number} [setup.area.height] - The height of the area.
   * @attribute {Number} [setup.area.width] - The width of the area.
   * @attribute {String} [setup.area.background] - The optionnal background (image) of the area.
   * @attribute {Array<String>} [setup.labels] - List of predefined labels.
   * @attribute {Array<Array>} [setup.coordinates] - List of predefined coordinates
   *  given as an array `[x:Number, y:Number]`.
   * @attribute {Number} [setup.capacity=Infinity] - Maximum number of places
   *  (may limit or be limited by the number of labels and/or coordinates defined by the setup).
   * @ttribute {Number} [setup.maxClientsPerPosition=1] - The maximum number of clients
   *  allowed in one position.
   */
  setup: {
    area: {
      width: 10,
      height: 10,
      background: undefined
    },
    labels: undefined,
    coordinates: undefined,
    maxClientsPerPosition: 1,
    capacity: Infinity
  },
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
  _clientTypeActivitiesMap: {},

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
    // start all activities and map the routes (clientType / activities mapping)
    // --------------------------------------------------

    this._activities.forEach(function (activity) {
      return activity.start();
    });

    this._activities.forEach(function (activity) {
      _this2.setMap(activity.clientTypes, activity);
    });

    // map `clientType` to their respective activities
    for (var clientType in this._clientTypeActivitiesMap) {
      var activity = this._clientTypeActivitiesMap[clientType];
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
    return _serverServiceManager2['default'].require(id, null, options);
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
      if (!_this3._clientTypeActivitiesMap[clientType]) _this3._clientTypeActivitiesMap[clientType] = new _Set();

      _this3._clientTypeActivitiesMap[clientType].add(activity);
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

      // this.io.of(clientType).on('connection', this._onConnection(clientType, modules));
    });

    // wait for socket connnection
    this.io.of(clientType).on('connection', this._onConnection(clientType, modules));
  },

  /**
   * Socket connection callback.
   */
  _onConnection: function _onConnection(clientType, activities) {
    return function (socket) {
      var client = new _Client2['default'](clientType, socket);
      activities.forEach(function (activity) {
        return activity.connect(client);
      });

      // global lifecycle of the client
      _sockets2['default'].receive(client, 'disconnect', function () {
        activities.forEach(function (activity) {
          return activity.disconnect(client);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvY29yZS9zZXJ2ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O3VCQUFvQixXQUFXOzs7O21CQUNmLEtBQUs7Ozs7dUJBQ0QsU0FBUzs7OztrQkFDZCxJQUFJOzs7O29CQUNGLE1BQU07Ozs7MkJBQ0osaUJBQWlCOzs7O3dCQUNyQixXQUFXOzs7O21CQUNWLEtBQUs7Ozs7b0JBQ0osTUFBTTs7OztzQkFDSixVQUFVOzs7O29DQUNJLHdCQUF3Qjs7Ozs7QUFHekQsSUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDOzs7Ozs7QUFNeEIsSUFBTSxnQkFBZ0IsR0FBRztBQUN2QixTQUFPLEVBQUUsWUFBWTtBQUNyQixTQUFPLEVBQUUsT0FBTzs7Ozs7Ozs7Ozs7Ozs7O0FBZWhCLE9BQUssRUFBRTtBQUNMLFFBQUksRUFBRTtBQUNKLFdBQUssRUFBRSxFQUFFO0FBQ1QsWUFBTSxFQUFFLEVBQUU7QUFDVixnQkFBVSxFQUFFLFNBQVM7S0FDdEI7QUFDRCxVQUFNLEVBQUUsU0FBUztBQUNqQixlQUFXLEVBQUUsU0FBUztBQUN0Qix5QkFBcUIsRUFBRSxDQUFDO0FBQ3hCLFlBQVEsRUFBRSxRQUFRO0dBQ25CO0FBQ0QsbUJBQWlCLEVBQUU7QUFDakIsU0FBSyxFQUFFLEdBQUc7QUFDVixVQUFNLEVBQUUsQ0FBQyxFQUNWO0NBQ0YsQ0FBQzs7Ozs7OztBQU1GLElBQU0sZUFBZSxHQUFHO0FBQ3RCLGNBQVksRUFBRSxrQkFBSyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLFFBQVEsQ0FBQztBQUNoRCxnQkFBYyxFQUFFLGtCQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsT0FBTyxDQUFDO0FBQ2pELGVBQWEsRUFBRSxRQUFRO0FBQ3ZCLGNBQVksRUFBRSxFQUFFO0FBQ2hCLFVBQVEsRUFBRTtBQUNSLE9BQUcsRUFBRSxFQUFFO0FBQ1AsY0FBVSxFQUFFLENBQUMsV0FBVyxDQUFDO0FBQ3pC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LFFBQVE7QUFDakIsVUFBSSxFQUFFLElBQUk7S0FDWCxDQUFDOztBQUVGLFFBQUk7QUFDRixVQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUU7QUFDZixZQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO09BQ2xDLE1BQU07QUFDTCxZQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztPQUN2QjtLQUNGLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDVixhQUFPLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3BEO0dBQ0Y7Ozs7Ozs7OztBQVNELFlBQVUsRUFBQSxvQkFBQyxRQUFRLEVBQUUsUUFBUSxFQUFFO0FBQzdCLFFBQU0sV0FBVyxHQUFHO0FBQ2xCLGNBQVEsRUFBRSxRQUFRO0FBQ2xCLGNBQVEsRUFBRSxRQUFRO0tBQ25CLENBQUM7O0FBRUYsZ0JBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7R0FDaEM7Q0FDRiIsImZpbGUiOiJzcmMvc2VydmVyL2NvcmUvc2VydmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNvY2tldHMgZnJvbSAnLi9zb2NrZXRzJztcbmltcG9ydCBlanMgZnJvbSAnZWpzJztcbmltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBodHRwIGZyb20gJ2h0dHAnO1xuaW1wb3J0IGxvZ2dlciBmcm9tICcuLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IElPIGZyb20gJ3NvY2tldC5pbyc7XG5pbXBvcnQgb3NjIGZyb20gJ29zYyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBDbGllbnQgZnJvbSAnLi9DbGllbnQnO1xuaW1wb3J0IHNlcnZlclNlcnZpY2VNYW5hZ2VyIGZyb20gJy4vc2VydmVyU2VydmljZU1hbmFnZXInO1xuXG4vLyBAdG9kbyAtIG1vdmUgaW50byBvc2Mgc2VydmljZS5cbmNvbnN0IG9zY0xpc3RlbmVycyA9IFtdO1xuXG4vKipcbiAqIFNldCBvZiBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnMgZGVmaW5lZCBieSBhIHBhcnRpY3VsYXIgYXBwbGljYXRpb24uXG4gKiBUaGVzZSBwYXJhbWV0ZXJzIHR5cGljYWxseSBpbmNsdXNkIGEgc2V0dXAgYW5kIGNvbnRyb2wgcGFyYW1ldGVycyB2YWx1ZXMuXG4gKi9cbmNvbnN0IGV4YW1wbGVBcHBDb25maWcgPSB7XG4gIGFwcE5hbWU6ICdTb3VuZHdvcmtzJywgLy8gdGl0bGUgb2YgdGhlIGFwcGxpY2F0aW9uIChmb3IgPHRpdGxlPiB0YWcpXG4gIHZlcnNpb246ICcwLjAuMScsIC8vIHZlcnNpb24gb2YgdGhlIGFwcGxpY2F0aW9uIChhbGxvdyB0byBieXBhc3MgYnJvd3NlciBjYWNoZSlcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbc2V0dXA9e31dIC0gU2V0dXAgZGVmaW5pbmcgZGltZW5zaW9ucyBhbmQgcHJlZGVmaW5lZCBwb3NpdGlvbnMgKGxhYmVscyBhbmQvb3IgY29vcmRpbmF0ZXMpLlxuICAgKiBAYXR0cmlidXRlIHtPYmplY3R9IFtzZXR1cC5hcmVhPW51bGxdIC0gVGhlIGRpbWVuc2lvbnMgb2YgdGhlIGFyZWEuXG4gICAqIEBhdHRyaWJ1dGUge051bWJlcn0gW3NldHVwLmFyZWEuaGVpZ2h0XSAtIFRoZSBoZWlnaHQgb2YgdGhlIGFyZWEuXG4gICAqIEBhdHRyaWJ1dGUge051bWJlcn0gW3NldHVwLmFyZWEud2lkdGhdIC0gVGhlIHdpZHRoIG9mIHRoZSBhcmVhLlxuICAgKiBAYXR0cmlidXRlIHtTdHJpbmd9IFtzZXR1cC5hcmVhLmJhY2tncm91bmRdIC0gVGhlIG9wdGlvbm5hbCBiYWNrZ3JvdW5kIChpbWFnZSkgb2YgdGhlIGFyZWEuXG4gICAqIEBhdHRyaWJ1dGUge0FycmF5PFN0cmluZz59IFtzZXR1cC5sYWJlbHNdIC0gTGlzdCBvZiBwcmVkZWZpbmVkIGxhYmVscy5cbiAgICogQGF0dHJpYnV0ZSB7QXJyYXk8QXJyYXk+fSBbc2V0dXAuY29vcmRpbmF0ZXNdIC0gTGlzdCBvZiBwcmVkZWZpbmVkIGNvb3JkaW5hdGVzXG4gICAqICBnaXZlbiBhcyBhbiBhcnJheSBgW3g6TnVtYmVyLCB5Ok51bWJlcl1gLlxuICAgKiBAYXR0cmlidXRlIHtOdW1iZXJ9IFtzZXR1cC5jYXBhY2l0eT1JbmZpbml0eV0gLSBNYXhpbXVtIG51bWJlciBvZiBwbGFjZXNcbiAgICogIChtYXkgbGltaXQgb3IgYmUgbGltaXRlZCBieSB0aGUgbnVtYmVyIG9mIGxhYmVscyBhbmQvb3IgY29vcmRpbmF0ZXMgZGVmaW5lZCBieSB0aGUgc2V0dXApLlxuICAgKiBAdHRyaWJ1dGUge051bWJlcn0gW3NldHVwLm1heENsaWVudHNQZXJQb3NpdGlvbj0xXSAtIFRoZSBtYXhpbXVtIG51bWJlciBvZiBjbGllbnRzXG4gICAqICBhbGxvd2VkIGluIG9uZSBwb3NpdGlvbi5cbiAgICovXG4gIHNldHVwOiB7XG4gICAgYXJlYToge1xuICAgICAgd2lkdGg6IDEwLFxuICAgICAgaGVpZ2h0OiAxMCxcbiAgICAgIGJhY2tncm91bmQ6IHVuZGVmaW5lZCxcbiAgICB9LFxuICAgIGxhYmVsczogdW5kZWZpbmVkLFxuICAgIGNvb3JkaW5hdGVzOiB1bmRlZmluZWQsXG4gICAgbWF4Q2xpZW50c1BlclBvc2l0aW9uOiAxLFxuICAgIGNhcGFjaXR5OiBJbmZpbml0eSxcbiAgfSxcbiAgY29udHJvbFBhcmFtZXRlcnM6IHtcbiAgICB0ZW1wbzogMTIwLCAvLyB0ZW1wbyBpbiBCUE1cbiAgICB2b2x1bWU6IDAsIC8vIG1hc3RlciB2b2x1bWUgaW4gZEJcbiAgfSxcbn07XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzIG9mIHRoZSBTb3VuZHdvcmtzIGZyYW1ld29yay5cbiAqIFRoZXNlIHBhcmFtZXRlcnMgYWxsb3cgZm9yIGNvbmZpZ3VyaW5nIGNvbXBvbmVudHMgb2YgdGhlIGZyYW1ld29yayBzdWNoIGFzIEV4cHJlc3MgYW5kIFNvY2tldElPLlxuICovXG5jb25zdCBkZWZhdWx0RndDb25maWcgPSB7XG4gIHB1YmxpY0ZvbGRlcjogcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdwdWJsaWMnKSxcbiAgdGVtcGxhdGVGb2xkZXI6IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAndmlld3MnKSxcbiAgZGVmYXVsdENsaWVudDogJ3BsYXllcicsXG4gIGFzc2V0c0RvbWFpbjogJycsIC8vIG92ZXJyaWRlIHRvIGRvd25sb2FkIGFzc2V0cyBmcm9tIGEgZGlmZmVyZW50IHNlcnZldXIgKG5naW54KVxuICBzb2NrZXRJTzoge1xuICAgIHVybDogJycsXG4gICAgdHJhbnNwb3J0czogWyd3ZWJzb2NrZXQnXSxcbiAgICBwaW5nVGltZW91dDogNjAwMDAsIC8vIGNvbmZpZ3VyZSBjbGllbnQgc2lkZSB0b28gP1xuICAgIHBpbmdJbnRlcnZhbDogNTAwMDAsIC8vIGNvbmZpZ3VyZSBjbGllbnQgc2lkZSB0b28gP1xuICAgIC8vIEBub3RlOiBFbmdpbmVJTyBkZWZhdWx0c1xuICAgIC8vIHBpbmdUaW1lb3V0OiAzMDAwLFxuICAgIC8vIHBpbmdJbnRlcnZhbDogMTAwMCxcbiAgICAvLyB1cGdyYWRlVGltZW91dDogMTAwMDAsXG4gICAgLy8gbWF4SHR0cEJ1ZmZlclNpemU6IDEwRTcsXG4gIH0sXG59O1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gcGFyYW1ldGVycyBvZiB0aGUgU291bmR3b3JrcyBmcmFtZXdvcmsuXG4gKiBUaGVzZSBwYXJhbWV0ZXJzIGFsbG93IGZvciBjb25maWd1cmluZyBjb21wb25lbnRzIG9mIHRoZSBmcmFtZXdvcmsgc3VjaCBhcyBFeHByZXNzIGFuZCBTb2NrZXRJTy5cbiAqL1xuY29uc3QgZGVmYXVsdEVudkNvbmZpZyA9IHtcbiAgcG9ydDogODAwMCxcbiAgLy8gb3NjOiB7XG4gIC8vICAgcmVjZWl2ZUFkZHJlc3M6ICcxMjcuMC4wLjEnLFxuICAvLyAgIHJlY2VpdmVQb3J0OiA1NzEyMSxcbiAgLy8gICBzZW5kQWRkcmVzczogJzEyNy4wLjAuMScsXG4gIC8vICAgc2VuZFBvcnQ6IDU3MTIwLFxuICAvLyB9LFxuICBvc2M6IG51bGwsXG4gIGxvZ2dlcjoge1xuICAgIG5hbWU6ICdzb3VuZHdvcmtzJyxcbiAgICBsZXZlbDogJ2luZm8nLFxuICAgIHN0cmVhbXM6IFt7XG4gICAgICBsZXZlbDogJ2luZm8nLFxuICAgICAgc3RyZWFtOiBwcm9jZXNzLnN0ZG91dCxcbiAgICB9LCAvKntcbiAgICAgIGxldmVsOiAnaW5mbycsXG4gICAgICBwYXRoOiBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ2xvZ3MnLCAnc291bmR3b3Jrcy5sb2cnKSxcbiAgICB9Ki9dXG4gIH1cbn07XG5cbi8qKlxuICogVGhlIGBzZXJ2ZXJgIG9iamVjdCBjb250YWlucyB0aGUgYmFzaWMgbWV0aG9kcyBvZiB0aGUgc2VydmVyLlxuICogRm9yIGluc3RhbmNlLCB0aGlzIG9iamVjdCBhbGxvd3Mgc2V0dGluZyB1cCwgY29uZmlndXJpbmcgYW5kIHN0YXJ0aW5nIHRoZSBzZXJ2ZXIgd2l0aCB0aGUgbWV0aG9kIGBzdGFydGAgd2hpbGUgdGhlIG1ldGhvZCBgbWFwYCBhbGxvd3MgZm9yIG1hbmFnaW5nIHRoZSBtYXBwaW5nIGJldHdlZW4gZGlmZmVyZW50IHR5cGVzIG9mIGNsaWVudHMgYW5kIHRoZWlyIHJlcXVpcmVkIHNlcnZlciBtb2R1bGVzLlxuICogQHR5cGUge09iamVjdH1cbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuXG4gIC8qKlxuICAgKiBXZWJTb2NrZXQgc2VydmVyLlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaW86IG51bGwsXG5cbiAgLyoqXG4gICAqIEV4cHJlc3MgYXBwbGljYXRpb25cbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG4gIGV4cHJlc3NBcHA6IG51bGwsXG4gIC8qKlxuICAgKiBIdHRwIHNlcnZlclxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgaHR0cFNlcnZlcjogbnVsbCxcblxuICAvKipcbiAgICogQ29uZmlndXJhdGlvbiBpbmZvcm1hdGlvbnMuXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xuICBjb25maWc6IHt9LFxuXG4gIC8qKlxuICAgKiBPU0Mgb2JqZWN0LlxuICAgKiBAdG9kbyAtIE1vdmUgaW50byBzZXJ2aWNlXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBvc2M6IG51bGwsXG5cbiAgLyoqXG4gICAqIE1hcHBpbmcgYmV0d2VlbiBhIGBjbGllbnRUeXBlYCBhbmQgaXRzIHJlbGF0ZWQgYWN0aXZpdGllc1xuICAgKi9cbiAgX2NsaWVudFR5cGVBY3Rpdml0aWVzTWFwOiB7fSxcblxuICAvKipcbiAgICogQWN0aXZpdGllcyB0byBiZSBzdGFydGVkXG4gICAqL1xuICBfYWN0aXZpdGllczogbmV3IFNldCgpLFxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBzZXJ2ZXIgd2l0aCB0aGUgZ2l2ZW4gY29uZmlnIG9iamVjdHMuXG4gICAqIEBwYXJhbSB7Li4uT2JqZWN0fSBjb25maWdzIC0gT2JqZWN0IG9mIGFwcGxpY2F0aW9uIGNvbmZpZ3VyYXRpb24uXG4gICAqXG4gICAqIEB0b2RvIC0gcmV3cml0ZSBkb2MgcHJvcGVybHkgZm9yIHRoaXMgbWV0aG9kLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW2FwcENvbmZpZz17fV0gQXBwbGljYXRpb24gY29uZmlndXJhdGlvbiBvcHRpb25zLlxuICAgKiBAYXR0cmlidXRlIHtTdHJpbmd9IFthcHBDb25maWcucHVibGljRm9sZGVyPScuL3B1YmxpYyddIFBhdGggdG8gdGhlIHB1YmxpYyBmb2xkZXIuXG4gICAqIEBhdHRyaWJ1dGUge09iamVjdH0gW2FwcENvbmZpZy5zb2NrZXRJTz17fV0gc29ja2V0LmlvIG9wdGlvbnMuIFRoZSBzb2NrZXQuaW8gY29uZmlnIG9iamVjdCBjYW4gaGF2ZSB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gICAqIC0gYHRyYW5zcG9ydHM6U3RyaW5nYDogY29tbXVuaWNhdGlvbiB0cmFuc3BvcnQgKGRlZmF1bHRzIHRvIGAnd2Vic29ja2V0J2ApO1xuICAgKiAtIGBwaW5nVGltZW91dDpOdW1iZXJgOiB0aW1lb3V0IChpbiBtaWxsaXNlY29uZHMpIGJlZm9yZSB0cnlpbmcgdG8gcmVlc3RhYmxpc2ggYSBjb25uZWN0aW9uIGJldHdlZW4gYSBsb3N0IGNsaWVudCBhbmQgYSBzZXJ2ZXIgKGRlZmF1dGxzIHRvIGA2MDAwMGApO1xuICAgKiAtIGBwaW5nSW50ZXJ2YWw6TnVtYmVyYDogdGltZSBpbnRlcnZhbCAoaW4gbWlsbGlzZWNvbmRzKSB0byBzZW5kIGEgcGluZyB0byBhIGNsaWVudCB0byBjaGVjayB0aGUgY29ubmVjdGlvbiAoZGVmYXVsdHMgdG8gYDUwMDAwYCkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbZW52Q29uZmlnPXt9XSBFbnZpcm9ubWVudCBjb25maWd1cmF0aW9uIG9wdGlvbnMuXG4gICAqIEBhdHRyaWJ1dGUge051bWJlcn0gW2VudkNvbmZpZy5wb3J0PTgwMDBdIFBvcnQgb2YgdGhlIEhUVFAgc2VydmVyLlxuICAgKiBAYXR0cmlidXRlIHtPYmplY3R9IFtlbnZDb25maWcub3NjPXt9XSBPU0Mgb3B0aW9ucy4gVGhlIE9TQyBjb25maWcgb2JqZWN0IGNhbiBoYXZlIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAgICogLSBgbG9jYWxBZGRyZXNzOlN0cmluZ2A6IGFkZHJlc3Mgb2YgdGhlIGxvY2FsIG1hY2hpbmUgdG8gcmVjZWl2ZSBPU0MgbWVzc2FnZXMgKGRlZmF1bHRzIHRvIGAnMTI3LjAuMC4xJ2ApO1xuICAgKiAtIGBsb2NhbFBvcnQ6TnVtYmVyYDogcG9ydCBvZiB0aGUgbG9jYWwgbWFjaGluZSB0byByZWNlaXZlIE9TQyBtZXNzYWdlcyAoZGVmYXVsdHMgdG8gYDU3MTIxYCk7XG4gICAqIC0gYHJlbW90ZUFkZHJlc3M6U3RyaW5nYDogYWRkcmVzcyBvZiB0aGUgZGV2aWNlIHRvIHNlbmQgZGVmYXVsdCBPU0MgbWVzc2FnZXMgdG8gKGRlZmF1bHRzIHRvIGAnMTI3LjAuMC4xJ2ApO1xuICAgKiAtIGByZW1vdGVQb3J0Ok51bWJlcmA6IHBvcnQgb2YgdGhlIGRldmljZSB0byBzZW5kIGRlZmF1bHQgT1NDIG1lc3NhZ2VzIHRvIChkZWZhdWx0cyB0byBgNTcxMjBgKS5cbiAgICovXG4gIGluaXQoLi4uY29uZmlncykge1xuICAgICAgICAvLyBtZXJnZSBkZWZhdWx0IGNvbmZpZ3VyYXRpb24gb2JqZWN0c1xuICAgIHRoaXMuY29uZmlnID0gT2JqZWN0LmFzc2lnbih0aGlzLmNvbmZpZywgZXhhbXBsZUFwcENvbmZpZywgZGVmYXVsdEZ3Q29uZmlnLCBkZWZhdWx0RW52Q29uZmlnKTtcbiAgICAvLyBtZXJnZSBnaXZlbiBjb25maWd1cmF0aW9ucyBvYmplY3RzIHdpdGggZGVmYXVsdHMgKDEgbGV2ZWwgZGVwdGgpXG4gICAgY29uZmlncy5mb3JFYWNoKChjb25maWcpID0+IHtcbiAgICAgIGZvciAobGV0IGtleSBpbiBjb25maWcpIHtcbiAgICAgICAgY29uc3QgZW50cnkgPSBjb25maWdba2V5XTtcbiAgICAgICAgaWYgKHR5cGVvZiBlbnRyeSA9PT0gJ29iamVjdCcgJiYgZW50cnkgIT09IG51bGwpIHtcbiAgICAgICAgICB0aGlzLmNvbmZpZ1trZXldID0gdGhpcy5jb25maWdba2V5XSB8fMKge307XG4gICAgICAgICAgdGhpcy5jb25maWdba2V5XSA9IE9iamVjdC5hc3NpZ24odGhpcy5jb25maWdba2V5XSwgZW50cnkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuY29uZmlnW2tleV0gPSBlbnRyeTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgc2VydmVyOlxuICAgKiAtIGxhdW5jaCB0aGUgSFRUUCBzZXJ2ZXIuXG4gICAqIC0gbGF1bmNoIHRoZSBzb2NrZXQgc2VydmVyLlxuICAgKiAtIHN0YXJ0IGFsbCByZWdpc3RlcmVkIGFjdGl2aXRpZXMuXG4gICAqIC0gZGVmaW5lIHJvdXRlcyBhbmQgYXNzb2NpYXRlIGNsaWVudCB0eXBlcyBhbmQgYWN0aXZpdGllcy5cbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gY29uZmlndXJlIGV4cHJlc3MgYW5kIGh0dHAgc2VydmVyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGNvbnN0IGV4cHJlc3NBcHAgPSBuZXcgZXhwcmVzcygpO1xuICAgIGV4cHJlc3NBcHAuc2V0KCdwb3J0JywgcHJvY2Vzcy5lbnYuUE9SVCB8fCB0aGlzLmNvbmZpZy5wb3J0KTtcbiAgICBleHByZXNzQXBwLnNldCgndmlldyBlbmdpbmUnLCAnZWpzJyk7XG4gICAgZXhwcmVzc0FwcC51c2UoZXhwcmVzcy5zdGF0aWModGhpcy5jb25maWcucHVibGljRm9sZGVyKSk7XG5cbiAgICBjb25zdCBodHRwU2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoZXhwcmVzc0FwcCk7XG4gICAgaHR0cFNlcnZlci5saXN0ZW4oZXhwcmVzc0FwcC5nZXQoJ3BvcnQnKSwgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCB1cmwgPSBgaHR0cDovLzEyNy4wLjAuMToke2V4cHJlc3NBcHAuZ2V0KCdwb3J0Jyl9YDtcbiAgICAgIGNvbnNvbGUubG9nKCdbSFRUUCBTRVJWRVJdIFNlcnZlciBsaXN0ZW5pbmcgb24nLCB1cmwpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5leHByZXNzQXBwID0gZXhwcmVzc0FwcDtcbiAgICB0aGlzLmh0dHBTZXJ2ZXIgPSBodHRwU2VydmVyO1xuXG4gICAgdGhpcy5pbyA9IG5ldyBJTyhodHRwU2VydmVyLCB0aGlzLmNvbmZpZy5zb2NrZXRJTyk7XG4gICAgc29ja2V0cy5pbml0aWFsaXplKHRoaXMuaW8pO1xuICAgIGxvZ2dlci5pbml0aWFsaXplKHRoaXMuY29uZmlnLmxvZ2dlcik7XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIHN0YXJ0IGFsbCBhY3Rpdml0aWVzIGFuZCBtYXAgdGhlIHJvdXRlcyAoY2xpZW50VHlwZSAvIGFjdGl2aXRpZXMgbWFwcGluZylcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgdGhpcy5fYWN0aXZpdGllcy5mb3JFYWNoKChhY3Rpdml0eSkgPT4gYWN0aXZpdHkuc3RhcnQoKSk7XG5cbiAgICB0aGlzLl9hY3Rpdml0aWVzLmZvckVhY2goKGFjdGl2aXR5KSA9PiB7XG4gICAgICB0aGlzLnNldE1hcChhY3Rpdml0eS5jbGllbnRUeXBlcywgYWN0aXZpdHkpXG4gICAgfSk7XG5cbiAgICAvLyBtYXAgYGNsaWVudFR5cGVgIHRvIHRoZWlyIHJlc3BlY3RpdmUgYWN0aXZpdGllc1xuICAgIGZvciAobGV0IGNsaWVudFR5cGUgaW4gdGhpcy5fY2xpZW50VHlwZUFjdGl2aXRpZXNNYXApIHtcbiAgICAgIGNvbnN0IGFjdGl2aXR5ID0gdGhpcy5fY2xpZW50VHlwZUFjdGl2aXRpZXNNYXBbY2xpZW50VHlwZV07XG4gICAgICB0aGlzLl9tYXAoY2xpZW50VHlwZSwgYWN0aXZpdHkpO1xuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gQHRvZG8gLSBtb3ZlIGludG8gYSBwcm9wZXIgc2VydmljZS5cbiAgICAvLyBjb25maWd1cmUgT1NDIC0gc2hvdWxkIGJlIG9wdGlvbm5hbFxuICAgIGlmICh0aGlzLmNvbmZpZy5vc2MpIHtcbiAgICAgIGNvbnN0IG9zY0NvbmZpZyA9IHRoaXMuY29uZmlnLm9zYztcblxuICAgICAgdGhpcy5vc2MgPSBuZXcgb3NjLlVEUFBvcnQoe1xuICAgICAgICAvLyBUaGlzIGlzIHRoZSBwb3J0IHdlJ3JlIGxpc3RlbmluZyBvbi5cbiAgICAgICAgbG9jYWxBZGRyZXNzOiBvc2NDb25maWcucmVjZWl2ZUFkZHJlc3MsXG4gICAgICAgIGxvY2FsUG9ydDogb3NjQ29uZmlnLnJlY2VpdmVQb3J0LFxuICAgICAgICAvLyBUaGlzIGlzIHRoZSBwb3J0IHdlIHVzZSB0byBzZW5kIG1lc3NhZ2VzLlxuICAgICAgICByZW1vdGVBZGRyZXNzOiBvc2NDb25maWcuc2VuZEFkZHJlc3MsXG4gICAgICAgIHJlbW90ZVBvcnQ6IG9zY0NvbmZpZy5zZW5kUG9ydCxcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm9zYy5vbigncmVhZHknLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlY2VpdmUgPSBgJHtvc2NDb25maWcucmVjZWl2ZUFkZHJlc3N9OiR7b3NjQ29uZmlnLnJlY2VpdmVQb3J0fWA7XG4gICAgICAgIGNvbnN0IHNlbmQgPSBgJHtvc2NDb25maWcuc2VuZEFkZHJlc3N9OiR7b3NjQ29uZmlnLnNlbmRQb3J0fWA7XG4gICAgICAgIGNvbnNvbGUubG9nKGBbT1NDIG92ZXIgVURQXSBSZWNlaXZpbmcgb24gJHtyZWNlaXZlfWApO1xuICAgICAgICBjb25zb2xlLmxvZyhgW09TQyBvdmVyIFVEUF0gU2VuZGluZyBvbiAke3NlbmR9YCk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5vc2Mub24oJ21lc3NhZ2UnLCAob3NjTXNnKSA9PiB7XG4gICAgICAgIGNvbnN0IGFkZHJlc3MgPSBvc2NNc2cuYWRkcmVzcztcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9zY0xpc3RlbmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChhZGRyZXNzID09PSBvc2NMaXN0ZW5lcnNbaV0ud2lsZGNhcmQpXG4gICAgICAgICAgICBvc2NMaXN0ZW5lcnNbaV0uY2FsbGJhY2sob3NjTXNnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMub3NjLm9wZW4oKTtcbiAgICB9XG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgfSxcblxuICAvKipcbiAgICogUmV0dXJucyBhIHNlcnZpY2UgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBUaGUgaWRlbnRpZmllciBvZiB0aGUgc2VydmljZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBUaGUgb3B0aW9ucyB0byBjb25maWd1cmUgdGhlIHNlcnZpY2UuXG4gICAqL1xuICByZXF1aXJlKGlkLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIHNlcnZlclNlcnZpY2VNYW5hZ2VyLnJlcXVpcmUoaWQsIG51bGwsIG9wdGlvbnMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiB1c2VkIGJ5IGFjdGl2aXRpZXMgdG8gcmVnaXN0ZXJlZCB0aGVpciBjb25jZXJuZWQgY2xpZW50IHR5cGUgaW50byB0aGUgc2VydmVyXG4gICAqIEBwYXJhbSB7QXJyYXk8U3RyaW5nPn0gY2xpZW50VHlwZXMgLSBBbiBhcnJheSBvZiBjbGllbnQgdHlwZS5cbiAgICogQHBhcmFtIHtBY3Rpdml0eX0gYWN0aXZpdHkgLSBUaGUgYWN0aXZpdHkgY29uY2VybmVkIHdpdGggdGhlIGdpdmVuIGBjbGllbnRUeXBlc2AuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZXRNYXAoY2xpZW50VHlwZXMsIGFjdGl2aXR5KSB7XG4gICAgY2xpZW50VHlwZXMuZm9yRWFjaCgoY2xpZW50VHlwZSkgPT4ge1xuICAgICAgaWYgKCF0aGlzLl9jbGllbnRUeXBlQWN0aXZpdGllc01hcFtjbGllbnRUeXBlXSlcbiAgICAgICAgdGhpcy5fY2xpZW50VHlwZUFjdGl2aXRpZXNNYXBbY2xpZW50VHlwZV0gPSBuZXcgU2V0KCk7XG5cbiAgICAgIHRoaXMuX2NsaWVudFR5cGVBY3Rpdml0aWVzTWFwW2NsaWVudFR5cGVdLmFkZChhY3Rpdml0eSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uIHVzZWQgYnkgYWN0aXZpdGllcyB0byByZWdpc3RlciB0aGVtc2VsdmVzIGFzIGFjdGl2ZSBhY3Rpdml0aWVzXG4gICAqIEBwYXJhbSB7QWN0aXZpdHl9IGFjdGl2aXR5XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZXRBY3Rpdml0eShhY3Rpdml0eSkge1xuICAgIHRoaXMuX2FjdGl2aXRpZXMuYWRkKGFjdGl2aXR5KTtcbiAgfSxcblxuICAvKipcbiAgICogSW5kaWNhdGUgdGhhdCB0aGUgY2xpZW50cyBvZiB0eXBlIGBjbGllbnRUeXBlYCByZXF1aXJlIHRoZSBtb2R1bGVzIGAuLi5tb2R1bGVzYCBvbiB0aGUgc2VydmVyIHNpZGUuXG4gICAqIEFkZGl0aW9uYWxseSwgdGhpcyBtZXRob2Qgcm91dGVzIHRoZSBjb25uZWN0aW9ucyBmcm9tIHRoZSBjb3JyZXNwb25kaW5nIFVSTCB0byB0aGUgY29ycmVzcG9uZGluZyB2aWV3LlxuICAgKiBNb3JlIHNwZWNpZmljYWxseTpcbiAgICogLSBBIGNsaWVudCBjb25uZWN0aW5nIHRvIHRoZSBzZXJ2ZXIgdGhyb3VnaCB0aGUgcm9vdCBVUkwgYGh0dHA6Ly9teS5zZXJ2ZXIuYWRkcmVzczpwb3J0L2AgaXMgY29uc2lkZXJlZCBhcyBhIGAncGxheWVyJ2AgY2xpZW50IGFuZCBkaXNwbGF5cyB0aGUgdmlldyBgcGxheWVyLmVqc2A7XG4gICAqIC0gQSBjbGllbnQgY29ubmVjdGluZyB0byB0aGUgc2VydmVyIHRocm91Z2ggdGhlIFVSTCBgaHR0cDovL215LnNlcnZlci5hZGRyZXNzOnBvcnQvY2xpZW50VHlwZWAgaXMgY29uc2lkZXJlZCBhcyBhIGBjbGllbnRUeXBlYCBjbGllbnQsIGFuZCBkaXNwbGF5cyB0aGUgdmlldyBgY2xpZW50VHlwZS5lanNgLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2xpZW50VHlwZSBDbGllbnQgdHlwZSAoYXMgZGVmaW5lZCBieSB0aGUgbWV0aG9kIHtAbGluayBjbGllbnQuaW5pdH0gb24gdGhlIGNsaWVudCBzaWRlKS5cbiAgICogQHBhcmFtIHsuLi5DbGllbnRNb2R1bGV9IG1vZHVsZXMgTW9kdWxlcyB0byBtYXAgdG8gdGhhdCBjbGllbnQgdHlwZS5cbiAgICovXG4gIF9tYXAoY2xpZW50VHlwZSwgbW9kdWxlcykge1xuICAgIC8vIEB0b2RvIC0gYWxsb3cgdG8gcGFzcyBzb21lIHZhcmlhYmxlIGluIHRoZSB1cmwgLT4gZGVmaW5lIGhvdyBiaW5kIGl0IHRvIHNvY2tldHMuLi5cbiAgICBjb25zdCB1cmwgPSAoY2xpZW50VHlwZSAhPT0gdGhpcy5jb25maWcuZGVmYXVsdENsaWVudCkgPyBgLyR7Y2xpZW50VHlwZX1gIDogJy8nO1xuXG4gICAgLy8gdXNlIHRlbXBsYXRlIHdpdGggYGNsaWVudFR5cGVgIG5hbWUgb3IgZGVmYXVsdCBpZiBub3QgZGVmaW5lZFxuICAgIGNvbnN0IGNsaWVudFRtcGwgPSBwYXRoLmpvaW4odGhpcy5jb25maWcudGVtcGxhdGVGb2xkZXIsIGAke2NsaWVudFR5cGV9LmVqc2ApO1xuICAgIGNvbnN0IGRlZmF1bHRUbXBsID0gcGF0aC5qb2luKHRoaXMuY29uZmlnLnRlbXBsYXRlRm9sZGVyLCBgZGVmYXVsdC5lanNgKTtcbiAgICBjb25zdCB0ZW1wbGF0ZSA9IGZzLmV4aXN0c1N5bmMoY2xpZW50VG1wbCkgPyBjbGllbnRUbXBsIDogZGVmYXVsdFRtcGw7XG5cbiAgICBjb25zdCB0bXBsU3RyaW5nID0gZnMucmVhZEZpbGVTeW5jKHRlbXBsYXRlLCB7IGVuY29kaW5nOiAndXRmOCcgfSk7XG4gICAgY29uc3QgdG1wbCA9IGVqcy5jb21waWxlKHRtcGxTdHJpbmcpO1xuXG4gICAgdGhpcy5leHByZXNzQXBwLmdldCh1cmwsIChyZXEsIHJlcykgPT4ge1xuICAgICAgcmVzLnNlbmQodG1wbCh7XG4gICAgICAgIHNvY2tldElPOiBKU09OLnN0cmluZ2lmeSh0aGlzLmNvbmZpZy5zb2NrZXRJTyksXG4gICAgICAgIGFwcE5hbWU6IHRoaXMuY29uZmlnLmFwcE5hbWUsXG4gICAgICAgIGNsaWVudFR5cGU6IGNsaWVudFR5cGUsXG4gICAgICAgIGRlZmF1bHRUeXBlOiB0aGlzLmNvbmZpZy5kZWZhdWx0Q2xpZW50LFxuICAgICAgICBhc3NldHNEb21haW46IHRoaXMuY29uZmlnLmFzc2V0c0RvbWFpbixcbiAgICAgIH0pKTtcblxuICAgICAgLy8gdGhpcy5pby5vZihjbGllbnRUeXBlKS5vbignY29ubmVjdGlvbicsIHRoaXMuX29uQ29ubmVjdGlvbihjbGllbnRUeXBlLCBtb2R1bGVzKSk7XG4gICAgfSk7XG5cbiAgICAvLyB3YWl0IGZvciBzb2NrZXQgY29ubm5lY3Rpb25cbiAgICB0aGlzLmlvLm9mKGNsaWVudFR5cGUpLm9uKCdjb25uZWN0aW9uJywgdGhpcy5fb25Db25uZWN0aW9uKGNsaWVudFR5cGUsIG1vZHVsZXMpKTtcbiAgfSxcblxuICAvKipcbiAgICogU29ja2V0IGNvbm5lY3Rpb24gY2FsbGJhY2suXG4gICAqL1xuICBfb25Db25uZWN0aW9uKGNsaWVudFR5cGUsIGFjdGl2aXRpZXMpIHtcbiAgICByZXR1cm4gKHNvY2tldCkgPT4ge1xuICAgICAgY29uc3QgY2xpZW50ID0gbmV3IENsaWVudChjbGllbnRUeXBlLCBzb2NrZXQpO1xuICAgICAgYWN0aXZpdGllcy5mb3JFYWNoKChhY3Rpdml0eSkgPT4gYWN0aXZpdHkuY29ubmVjdChjbGllbnQpKTtcblxuICAgICAgLy8gZ2xvYmFsIGxpZmVjeWNsZSBvZiB0aGUgY2xpZW50XG4gICAgICBzb2NrZXRzLnJlY2VpdmUoY2xpZW50LCAnZGlzY29ubmVjdCcsICgpID0+IHtcbiAgICAgICAgYWN0aXZpdGllcy5mb3JFYWNoKChhY3Rpdml0eSkgPT4gYWN0aXZpdHkuZGlzY29ubmVjdChjbGllbnQpKTtcbiAgICAgICAgLy8gQHRvZG8gLSBzaG91bGQgcmVtb3ZlIGFsbCBsaXN0ZW5lcnMgb24gdGhlIGNsaWVudFxuICAgICAgICBjbGllbnQuZGVzdHJveSgpO1xuICAgICAgICBsb2dnZXIuaW5mbyh7IHNvY2tldCwgY2xpZW50VHlwZSB9LCAnZGlzY29ubmVjdCcpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIEB0b2RvIC0gcmVmYWN0b3IgaGFuZHNoYWtlIGFuZCB1aWQgZGVmaW5pdGlvbi5cbiAgICAgIHNvY2tldHMuc2VuZChjbGllbnQsICdjbGllbnQ6c3RhcnQnLCBjbGllbnQudWlkKTsgLy8gdGhlIHNlcnZlciBpcyByZWFkeVxuICAgICAgbG9nZ2VyLmluZm8oeyBzb2NrZXQsIGNsaWVudFR5cGUgfSwgJ2Nvbm5lY3Rpb24nKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNlbmQgYW4gT1NDIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB3aWxkY2FyZCBXaWxkY2FyZCBvZiB0aGUgT1NDIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7QXJyYXl9IGFyZ3MgQXJndW1lbnRzIG9mIHRoZSBPU0MgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFt1cmw9bnVsbF0gVVJMIHRvIHNlbmQgdGhlIE9TQyBtZXNzYWdlIHRvIChpZiBub3Qgc3BlY2lmaWVkLCB1c2VzIHRoZSBhZGRyZXNzIGRlZmluZWQgaW4gdGhlIE9TQyBjb25maWcgb3IgaW4gdGhlIG9wdGlvbnMgb2YgdGhlIHtAbGluayBzZXJ2ZXIuc3RhcnR9IG1ldGhvZCkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbcG9ydD1udWxsXSBQb3J0IHRvIHNlbmQgdGhlIG1lc3NhZ2UgdG8gKGlmIG5vdCBzcGVjaWZpZWQsIHVzZXMgdGhlIHBvcnQgZGVmaW5lZCBpbiB0aGUgT1NDIGNvbmZpZyBvciBpbiB0aGUgb3B0aW9ucyBvZiB0aGUge0BsaW5rIHNlcnZlci5zdGFydH0gbWV0aG9kKS5cbiAgICovXG4gIHNlbmRPU0Mod2lsZGNhcmQsIGFyZ3MsIHVybCA9IG51bGwsIHBvcnQgPSBudWxsKSB7XG4gICAgY29uc3Qgb3NjTXNnID0ge1xuICAgICAgYWRkcmVzczogd2lsZGNhcmQsXG4gICAgICBhcmdzOiBhcmdzXG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICBpZiAodXJsICYmIHBvcnQpIHtcbiAgICAgICAgdGhpcy5vc2Muc2VuZChvc2NNc2csIHVybCwgcG9ydCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9zYy5zZW5kKG9zY01zZyk7IC8vIHVzZSBkZWZhdWx0cyAoYXMgZGVmaW5lZCBpbiB0aGUgY29uZmlnKVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdFcnJvciB3aGlsZSBzZW5kaW5nIE9TQyBtZXNzYWdlOicsIGUpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogTGlzdGVuIGZvciBPU0MgbWVzc2FnZSBhbmQgZXhlY3V0ZSBhIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICAgKiBUaGUgc2VydmVyIGxpc3RlbnMgdG8gT1NDIG1lc3NhZ2VzIGF0IHRoZSBhZGRyZXNzIGFuZCBwb3J0IGRlZmluZWQgaW4gdGhlIGNvbmZpZyBvciBpbiB0aGUgb3B0aW9ucyBvZiB0aGUge0BsaW5rIHNlcnZlci5zdGFydH0gbWV0aG9kLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gd2lsZGNhcmQgV2lsZGNhcmQgb2YgdGhlIE9TQyBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsYmFjayBmdW5jdGlvbiBleGVjdXRlZCB3aGVuIHRoZSBPU0MgbWVzc2FnZSBpcyByZWNlaXZlZC5cbiAgICovXG4gIHJlY2VpdmVPU0Mod2lsZGNhcmQsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb3NjTGlzdGVuZXIgPSB7XG4gICAgICB3aWxkY2FyZDogd2lsZGNhcmQsXG4gICAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgICB9O1xuXG4gICAgb3NjTGlzdGVuZXJzLnB1c2gob3NjTGlzdGVuZXIpO1xuICB9XG59O1xuIl19