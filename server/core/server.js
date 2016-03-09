'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _Client = require('./Client');

var _Client2 = _interopRequireDefault(_Client);

var _ejs = require('ejs');

var _ejs2 = _interopRequireDefault(_ejs);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _logger = require('../utils/logger');

var _logger2 = _interopRequireDefault(_logger);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _pem = require('pem');

var _pem2 = _interopRequireDefault(_pem);

var _serverServiceManager = require('./serverServiceManager');

var _serverServiceManager2 = _interopRequireDefault(_serverServiceManager);

var _sockets = require('./sockets');

var _sockets2 = _interopRequireDefault(_sockets);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  useHttps: false,
  publicFolder: _path2.default.join(process.cwd(), 'public'),
  templateFolder: _path2.default.join(process.cwd(), 'views'),
  defaultClient: 'player',
  assetsDomain: '', // override to download assets from a different serveur (nginx)
  socketIO: {
    url: '',
    transports: ['websocket'],
    pingTimeout: 60000, // configure client side too ?
    pingInterval: 50000 },
  // configure client side too ?
  // @note: EngineIO defaults
  // pingTimeout: 3000,
  // pingInterval: 1000,
  // upgradeTimeout: 10000,
  // maxHttpBufferSize: 10E7,
  errorReporterDirectory: 'logs/clients',
  dbDirectory: 'db'
};

/**
 * Configuration parameters of the Soundworks framework.
 * These parameters allow for configuring components of the framework such as Express and SocketIO.
 */
var defaultEnvConfig = {
  port: 8000,
  osc: {
    receiveAddress: '127.0.0.1',
    receivePort: 57121,
    sendAddress: '127.0.0.1',
    sendPort: 57120
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
 * @type {Object}
 */
/*{
level: 'info',
path: path.join(process.cwd(), 'logs', 'soundworks.log'),
}*/exports.default = {

  /**
   * WebSocket server.
   * @type {Object}
   * @private
   */
  io: null,

  /**
   * Express application
   * @type {Object}
   * @private
   */
  // expressApp: null,

  /**
   * Http server
   * @type {Object}
   * @private
   */
  // httpServer: null,

  /**
   * Configuration informations.
   * @type {Object}
   */
  config: {},

  /**
   * Mapping between a `clientType` and its related activities
   */
  _clientTypeActivitiesMap: {},

  /**
   * Activities to be started
   */
  _activities: new _set2.default(),

  /**
   * Returns a service configured with the given options.
   * @param {String} id - The identifier of the service.
   * @param {Object} options - The options to configure the service.
   */
  require: function require(id, options) {
    return _serverServiceManager2.default.require(id, null, options);
  },


  /**
   * Function used by activities to registered their concerned client type into the server
   * @param {Array<String>} clientTypes - An array of client type.
   * @param {Activity} activity - The activity concerned with the given `clientTypes`.
   * @private
   */
  setMap: function setMap(clientTypes, activity) {
    var _this = this;

    clientTypes.forEach(function (clientType) {
      if (!_this._clientTypeActivitiesMap[clientType]) _this._clientTypeActivitiesMap[clientType] = new _set2.default();

      _this._clientTypeActivitiesMap[clientType].add(activity);
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
   * Initialize the server with the given config objects.
   * @todo - move this doc to configuration objects.
   *
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
    var _this2 = this;

    // merge default configuration objects
    this.config = (0, _assign2.default)(this.config, exampleAppConfig, defaultFwConfig, defaultEnvConfig);
    // merge given configurations objects with defaults (1 level depth)

    for (var _len = arguments.length, configs = Array(_len), _key = 0; _key < _len; _key++) {
      configs[_key] = arguments[_key];
    }

    configs.forEach(function (config) {
      for (var key in config) {
        var entry = config[key];
        if ((typeof entry === 'undefined' ? 'undefined' : (0, _typeof3.default)(entry)) === 'object' && entry !== null) {
          _this2.config[key] = _this2.config[key] || {};
          _this2.config[key] = (0, _assign2.default)(_this2.config[key], entry);
        } else {
          _this2.config[key] = entry;
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
    var _this3 = this;

    _logger2.default.initialize(this.config.logger);

    // --------------------------------------------------
    // configure express and http(s) server
    // --------------------------------------------------
    var expressApp = new _express2.default();
    expressApp.set('port', process.env.PORT || this.config.port);
    expressApp.set('view engine', 'ejs');
    expressApp.use(_express2.default.static(this.config.publicFolder));

    var httpServer = void 0;

    if (!this.config.useHttps) {
      httpServer = _http2.default.createServer(expressApp);
      this._initSockets(httpServer);
      this._initActivities(expressApp);

      httpServer.listen(expressApp.get('port'), function () {
        var url = 'http://127.0.0.1:' + expressApp.get('port');
        console.log('[HTTP SERVER] Server listening on', url);
      });
    } else {
      _pem2.default.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
        httpServer = _https2.default.createServer({
          key: keys.serviceKey,
          cert: keys.certificate
        }, expressApp);

        _this3._initSockets(httpServer);
        _this3._initActivities(expressApp);

        httpServer.listen(expressApp.get('port'), function () {
          var url = 'https://127.0.0.1:' + expressApp.get('port');
          console.log('[HTTP SERVER] Server listening on', url);
        });
      });
    }
  },


  /**
   * Init websocket server.
   */
  _initSockets: function _initSockets(httpServer) {
    this.io = new _socket2.default(httpServer, this.config.socketIO);

    if (this.config.cordova && this.config.cordova.socketIO) // IO add some configuration options to the object
      this.config.cordova.socketIO = (0, _assign2.default)({}, this.config.socketIO, this.config.cordova.socketIO);

    _sockets2.default.initialize(this.io);
  },


  /**
   * Start all activities and map the routes (clientType / activities mapping).
   */
  _initActivities: function _initActivities(expressApp) {
    var _this4 = this;

    this._activities.forEach(function (activity) {
      return activity.start();
    });

    this._activities.forEach(function (activity) {
      _this4.setMap(activity.clientTypes, activity);
    });

    // map `clientType` to their respective activities
    for (var clientType in this._clientTypeActivitiesMap) {
      var activity = this._clientTypeActivitiesMap[clientType];
      this._map(clientType, activity, expressApp);
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
  _map: function _map(clientType, modules, expressApp) {
    var _this5 = this;

    // @todo - allow to pass some variable in the url -> define how bind it to sockets...
    var url = clientType !== this.config.defaultClient ? '/' + clientType : '/';

    // use template with `clientType` name or default if not defined
    var clientTmpl = _path2.default.join(this.config.templateFolder, clientType + '.ejs');
    var defaultTmpl = _path2.default.join(this.config.templateFolder, 'default.ejs');
    var template = _fs2.default.existsSync(clientTmpl) ? clientTmpl : defaultTmpl;

    var tmplString = _fs2.default.readFileSync(template, { encoding: 'utf8' });
    var tmpl = _ejs2.default.compile(tmplString);

    expressApp.get(url, function (req, res) {
      var includeCordovaTags = false;
      var socketConfig = (0, _stringify2.default)(_this5.config.socketIO);

      if (req.query.cordova) {
        includeCordovaTags = true;
        socketConfig = (0, _stringify2.default)(_this5.config.cordova.socketIO);
      }

      if (req.query.clientType) clientType = req.query.clientType;

      res.send(tmpl({
        socketIO: socketConfig,
        appName: _this5.config.appName,
        clientType: clientType,
        defaultType: _this5.config.defaultClient,
        assetsDomain: _this5.config.assetsDomain,
        // export html for cordova use
        includeCordovaTags: includeCordovaTags
      }));
    });

    // wait for socket connnection
    this.io.of(clientType).on('connection', this._onConnection(clientType, modules));
  },


  /**
   * Socket connection callback.
   */
  _onConnection: function _onConnection(clientType, activities) {
    return function (socket) {
      var client = new _Client2.default(clientType, socket);
      activities.forEach(function (activity) {
        return activity.connect(client);
      });

      // global lifecycle of the client
      _sockets2.default.receive(client, 'disconnect', function () {
        activities.forEach(function (activity) {
          return activity.disconnect(client);
        });
        // @todo - should remove all listeners on the client
        client.destroy();
        _logger2.default.info({ socket: socket, clientType: clientType }, 'disconnect');
      });

      // @todo - refactor handshake and uuid definition.
      _sockets2.default.send(client, 'client:start', client.uuid); // the server is ready
      _logger2.default.info({ socket: socket, clientType: clientType }, 'connection');
    };
  }
};
//# sourceMappingURL=data:application/json;base64,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QUFWLEVBQVosRUFBb0MsWUFBcEMsRUFKMEM7T0FBTixDQUF0Qzs7O0FBTGlCLHVCQWFqQixDQUFRLElBQVIsQ0FBYSxNQUFiLEVBQXFCLGNBQXJCLEVBQXFDLE9BQU8sSUFBUCxDQUFyQztBQWJpQixzQkFjakIsQ0FBTyxJQUFQLENBQVksRUFBRSxjQUFGLEVBQVUsc0JBQVYsRUFBWixFQUFvQyxZQUFwQyxFQWRpQjtLQUFaLENBRDZCO0dBOU96QiIsImZpbGUiOiJzZXJ2ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ2xpZW50IGZyb20gJy4vQ2xpZW50JztcbmltcG9ydCBlanMgZnJvbSAnZWpzJztcbmltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBodHRwIGZyb20gJ2h0dHAnO1xuaW1wb3J0IGh0dHBzIGZyb20gJ2h0dHBzJztcbmltcG9ydCBJTyBmcm9tICdzb2NrZXQuaW8nO1xuaW1wb3J0IGxvZ2dlciBmcm9tICcuLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgcGVtIGZyb20gJ3BlbSc7XG5pbXBvcnQgc2VydmVyU2VydmljZU1hbmFnZXIgZnJvbSAnLi9zZXJ2ZXJTZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgc29ja2V0cyBmcm9tICcuL3NvY2tldHMnO1xuXG5cblxuLyoqXG4gKiBTZXQgb2YgY29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzIGRlZmluZWQgYnkgYSBwYXJ0aWN1bGFyIGFwcGxpY2F0aW9uLlxuICogVGhlc2UgcGFyYW1ldGVycyB0eXBpY2FsbHkgaW5jbHVzZCBhIHNldHVwIGFuZCBjb250cm9sIHBhcmFtZXRlcnMgdmFsdWVzLlxuICovXG5jb25zdCBleGFtcGxlQXBwQ29uZmlnID0ge1xuICBhcHBOYW1lOiAnU291bmR3b3JrcycsIC8vIHRpdGxlIG9mIHRoZSBhcHBsaWNhdGlvbiAoZm9yIDx0aXRsZT4gdGFnKVxuICB2ZXJzaW9uOiAnMC4wLjEnLCAvLyB2ZXJzaW9uIG9mIHRoZSBhcHBsaWNhdGlvbiAoYWxsb3cgdG8gYnlwYXNzIGJyb3dzZXIgY2FjaGUpXG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW3NldHVwPXt9XSAtIFNldHVwIGRlZmluaW5nIGRpbWVuc2lvbnMgYW5kIHByZWRlZmluZWQgcG9zaXRpb25zIChsYWJlbHMgYW5kL29yIGNvb3JkaW5hdGVzKS5cbiAgICogQGF0dHJpYnV0ZSB7T2JqZWN0fSBbc2V0dXAuYXJlYT1udWxsXSAtIFRoZSBkaW1lbnNpb25zIG9mIHRoZSBhcmVhLlxuICAgKiBAYXR0cmlidXRlIHtOdW1iZXJ9IFtzZXR1cC5hcmVhLmhlaWdodF0gLSBUaGUgaGVpZ2h0IG9mIHRoZSBhcmVhLlxuICAgKiBAYXR0cmlidXRlIHtOdW1iZXJ9IFtzZXR1cC5hcmVhLndpZHRoXSAtIFRoZSB3aWR0aCBvZiB0aGUgYXJlYS5cbiAgICogQGF0dHJpYnV0ZSB7U3RyaW5nfSBbc2V0dXAuYXJlYS5iYWNrZ3JvdW5kXSAtIFRoZSBvcHRpb25uYWwgYmFja2dyb3VuZCAoaW1hZ2UpIG9mIHRoZSBhcmVhLlxuICAgKiBAYXR0cmlidXRlIHtBcnJheTxTdHJpbmc+fSBbc2V0dXAubGFiZWxzXSAtIExpc3Qgb2YgcHJlZGVmaW5lZCBsYWJlbHMuXG4gICAqIEBhdHRyaWJ1dGUge0FycmF5PEFycmF5Pn0gW3NldHVwLmNvb3JkaW5hdGVzXSAtIExpc3Qgb2YgcHJlZGVmaW5lZCBjb29yZGluYXRlc1xuICAgKiAgZ2l2ZW4gYXMgYW4gYXJyYXkgYFt4Ok51bWJlciwgeTpOdW1iZXJdYC5cbiAgICogQGF0dHJpYnV0ZSB7TnVtYmVyfSBbc2V0dXAuY2FwYWNpdHk9SW5maW5pdHldIC0gTWF4aW11bSBudW1iZXIgb2YgcGxhY2VzXG4gICAqICAobWF5IGxpbWl0IG9yIGJlIGxpbWl0ZWQgYnkgdGhlIG51bWJlciBvZiBsYWJlbHMgYW5kL29yIGNvb3JkaW5hdGVzIGRlZmluZWQgYnkgdGhlIHNldHVwKS5cbiAgICogQHR0cmlidXRlIHtOdW1iZXJ9IFtzZXR1cC5tYXhDbGllbnRzUGVyUG9zaXRpb249MV0gLSBUaGUgbWF4aW11bSBudW1iZXIgb2YgY2xpZW50c1xuICAgKiAgYWxsb3dlZCBpbiBvbmUgcG9zaXRpb24uXG4gICAqL1xuICBzZXR1cDoge1xuICAgIGFyZWE6IHtcbiAgICAgIHdpZHRoOiAxMCxcbiAgICAgIGhlaWdodDogMTAsXG4gICAgICBiYWNrZ3JvdW5kOiB1bmRlZmluZWQsXG4gICAgfSxcbiAgICBsYWJlbHM6IHVuZGVmaW5lZCxcbiAgICBjb29yZGluYXRlczogdW5kZWZpbmVkLFxuICAgIG1heENsaWVudHNQZXJQb3NpdGlvbjogMSxcbiAgICBjYXBhY2l0eTogSW5maW5pdHksXG4gIH0sXG4gIGNvbnRyb2xQYXJhbWV0ZXJzOiB7XG4gICAgdGVtcG86IDEyMCwgLy8gdGVtcG8gaW4gQlBNXG4gICAgdm9sdW1lOiAwLCAvLyBtYXN0ZXIgdm9sdW1lIGluIGRCXG4gIH0sXG59O1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gcGFyYW1ldGVycyBvZiB0aGUgU291bmR3b3JrcyBmcmFtZXdvcmsuXG4gKiBUaGVzZSBwYXJhbWV0ZXJzIGFsbG93IGZvciBjb25maWd1cmluZyBjb21wb25lbnRzIG9mIHRoZSBmcmFtZXdvcmsgc3VjaCBhcyBFeHByZXNzIGFuZCBTb2NrZXRJTy5cbiAqL1xuY29uc3QgZGVmYXVsdEZ3Q29uZmlnID0ge1xuICB1c2VIdHRwczogZmFsc2UsXG4gIHB1YmxpY0ZvbGRlcjogcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdwdWJsaWMnKSxcbiAgdGVtcGxhdGVGb2xkZXI6IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAndmlld3MnKSxcbiAgZGVmYXVsdENsaWVudDogJ3BsYXllcicsXG4gIGFzc2V0c0RvbWFpbjogJycsIC8vIG92ZXJyaWRlIHRvIGRvd25sb2FkIGFzc2V0cyBmcm9tIGEgZGlmZmVyZW50IHNlcnZldXIgKG5naW54KVxuICBzb2NrZXRJTzoge1xuICAgIHVybDogJycsXG4gICAgdHJhbnNwb3J0czogWyd3ZWJzb2NrZXQnXSxcbiAgICBwaW5nVGltZW91dDogNjAwMDAsIC8vIGNvbmZpZ3VyZSBjbGllbnQgc2lkZSB0b28gP1xuICAgIHBpbmdJbnRlcnZhbDogNTAwMDAsIC8vIGNvbmZpZ3VyZSBjbGllbnQgc2lkZSB0b28gP1xuICAgIC8vIEBub3RlOiBFbmdpbmVJTyBkZWZhdWx0c1xuICAgIC8vIHBpbmdUaW1lb3V0OiAzMDAwLFxuICAgIC8vIHBpbmdJbnRlcnZhbDogMTAwMCxcbiAgICAvLyB1cGdyYWRlVGltZW91dDogMTAwMDAsXG4gICAgLy8gbWF4SHR0cEJ1ZmZlclNpemU6IDEwRTcsXG4gIH0sXG4gIGVycm9yUmVwb3J0ZXJEaXJlY3Rvcnk6ICdsb2dzL2NsaWVudHMnLFxuICBkYkRpcmVjdG9yeTogJ2RiJyxcbn07XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzIG9mIHRoZSBTb3VuZHdvcmtzIGZyYW1ld29yay5cbiAqIFRoZXNlIHBhcmFtZXRlcnMgYWxsb3cgZm9yIGNvbmZpZ3VyaW5nIGNvbXBvbmVudHMgb2YgdGhlIGZyYW1ld29yayBzdWNoIGFzIEV4cHJlc3MgYW5kIFNvY2tldElPLlxuICovXG5jb25zdCBkZWZhdWx0RW52Q29uZmlnID0ge1xuICBwb3J0OiA4MDAwLFxuICBvc2M6IHtcbiAgICByZWNlaXZlQWRkcmVzczogJzEyNy4wLjAuMScsXG4gICAgcmVjZWl2ZVBvcnQ6IDU3MTIxLFxuICAgIHNlbmRBZGRyZXNzOiAnMTI3LjAuMC4xJyxcbiAgICBzZW5kUG9ydDogNTcxMjAsXG4gIH0sXG4gIGxvZ2dlcjoge1xuICAgIG5hbWU6ICdzb3VuZHdvcmtzJyxcbiAgICBsZXZlbDogJ2luZm8nLFxuICAgIHN0cmVhbXM6IFt7XG4gICAgICBsZXZlbDogJ2luZm8nLFxuICAgICAgc3RyZWFtOiBwcm9jZXNzLnN0ZG91dCxcbiAgICB9LCAvKntcbiAgICAgIGxldmVsOiAnaW5mbycsXG4gICAgICBwYXRoOiBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ2xvZ3MnLCAnc291bmR3b3Jrcy5sb2cnKSxcbiAgICB9Ki9dXG4gIH1cbn07XG5cbi8qKlxuICogVGhlIGBzZXJ2ZXJgIG9iamVjdCBjb250YWlucyB0aGUgYmFzaWMgbWV0aG9kcyBvZiB0aGUgc2VydmVyLlxuICogRm9yIGluc3RhbmNlLCB0aGlzIG9iamVjdCBhbGxvd3Mgc2V0dGluZyB1cCwgY29uZmlndXJpbmcgYW5kIHN0YXJ0aW5nIHRoZSBzZXJ2ZXIgd2l0aCB0aGUgbWV0aG9kIGBzdGFydGAgd2hpbGUgdGhlIG1ldGhvZCBgbWFwYCBhbGxvd3MgZm9yIG1hbmFnaW5nIHRoZSBtYXBwaW5nIGJldHdlZW4gZGlmZmVyZW50IHR5cGVzIG9mIGNsaWVudHMgYW5kIHRoZWlyIHJlcXVpcmVkIHNlcnZlciBtb2R1bGVzLlxuICogQHR5cGUge09iamVjdH1cbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuXG4gIC8qKlxuICAgKiBXZWJTb2NrZXQgc2VydmVyLlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaW86IG51bGwsXG5cbiAgLyoqXG4gICAqIEV4cHJlc3MgYXBwbGljYXRpb25cbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIC8vIGV4cHJlc3NBcHA6IG51bGwsXG5cbiAgLyoqXG4gICAqIEh0dHAgc2VydmVyXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICAvLyBodHRwU2VydmVyOiBudWxsLFxuXG4gIC8qKlxuICAgKiBDb25maWd1cmF0aW9uIGluZm9ybWF0aW9ucy5cbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG4gIGNvbmZpZzoge30sXG5cbiAgLyoqXG4gICAqIE1hcHBpbmcgYmV0d2VlbiBhIGBjbGllbnRUeXBlYCBhbmQgaXRzIHJlbGF0ZWQgYWN0aXZpdGllc1xuICAgKi9cbiAgX2NsaWVudFR5cGVBY3Rpdml0aWVzTWFwOiB7fSxcblxuICAvKipcbiAgICogQWN0aXZpdGllcyB0byBiZSBzdGFydGVkXG4gICAqL1xuICBfYWN0aXZpdGllczogbmV3IFNldCgpLFxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc2VydmljZSBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIFRoZSBpZGVudGlmaWVyIG9mIHRoZSBzZXJ2aWNlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFRoZSBvcHRpb25zIHRvIGNvbmZpZ3VyZSB0aGUgc2VydmljZS5cbiAgICovXG4gIHJlcXVpcmUoaWQsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gc2VydmVyU2VydmljZU1hbmFnZXIucmVxdWlyZShpZCwgbnVsbCwgb3B0aW9ucyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uIHVzZWQgYnkgYWN0aXZpdGllcyB0byByZWdpc3RlcmVkIHRoZWlyIGNvbmNlcm5lZCBjbGllbnQgdHlwZSBpbnRvIHRoZSBzZXJ2ZXJcbiAgICogQHBhcmFtIHtBcnJheTxTdHJpbmc+fSBjbGllbnRUeXBlcyAtIEFuIGFycmF5IG9mIGNsaWVudCB0eXBlLlxuICAgKiBAcGFyYW0ge0FjdGl2aXR5fSBhY3Rpdml0eSAtIFRoZSBhY3Rpdml0eSBjb25jZXJuZWQgd2l0aCB0aGUgZ2l2ZW4gYGNsaWVudFR5cGVzYC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNldE1hcChjbGllbnRUeXBlcywgYWN0aXZpdHkpIHtcbiAgICBjbGllbnRUeXBlcy5mb3JFYWNoKChjbGllbnRUeXBlKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuX2NsaWVudFR5cGVBY3Rpdml0aWVzTWFwW2NsaWVudFR5cGVdKVxuICAgICAgICB0aGlzLl9jbGllbnRUeXBlQWN0aXZpdGllc01hcFtjbGllbnRUeXBlXSA9IG5ldyBTZXQoKTtcblxuICAgICAgdGhpcy5fY2xpZW50VHlwZUFjdGl2aXRpZXNNYXBbY2xpZW50VHlwZV0uYWRkKGFjdGl2aXR5KTtcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogRnVuY3Rpb24gdXNlZCBieSBhY3Rpdml0aWVzIHRvIHJlZ2lzdGVyIHRoZW1zZWx2ZXMgYXMgYWN0aXZlIGFjdGl2aXRpZXNcbiAgICogQHBhcmFtIHtBY3Rpdml0eX0gYWN0aXZpdHlcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNldEFjdGl2aXR5KGFjdGl2aXR5KSB7XG4gICAgdGhpcy5fYWN0aXZpdGllcy5hZGQoYWN0aXZpdHkpO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIHNlcnZlciB3aXRoIHRoZSBnaXZlbiBjb25maWcgb2JqZWN0cy5cbiAgICogQHRvZG8gLSBtb3ZlIHRoaXMgZG9jIHRvIGNvbmZpZ3VyYXRpb24gb2JqZWN0cy5cbiAgICpcbiAgICogQHBhcmFtIHsuLi5PYmplY3R9IGNvbmZpZ3MgLSBPYmplY3Qgb2YgYXBwbGljYXRpb24gY29uZmlndXJhdGlvbi5cbiAgICpcbiAgICogQHRvZG8gLSByZXdyaXRlIGRvYyBwcm9wZXJseSBmb3IgdGhpcyBtZXRob2QuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbYXBwQ29uZmlnPXt9XSBBcHBsaWNhdGlvbiBjb25maWd1cmF0aW9uIG9wdGlvbnMuXG4gICAqIEBhdHRyaWJ1dGUge1N0cmluZ30gW2FwcENvbmZpZy5wdWJsaWNGb2xkZXI9Jy4vcHVibGljJ10gUGF0aCB0byB0aGUgcHVibGljIGZvbGRlci5cbiAgICogQGF0dHJpYnV0ZSB7T2JqZWN0fSBbYXBwQ29uZmlnLnNvY2tldElPPXt9XSBzb2NrZXQuaW8gb3B0aW9ucy4gVGhlIHNvY2tldC5pbyBjb25maWcgb2JqZWN0IGNhbiBoYXZlIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAgICogLSBgdHJhbnNwb3J0czpTdHJpbmdgOiBjb21tdW5pY2F0aW9uIHRyYW5zcG9ydCAoZGVmYXVsdHMgdG8gYCd3ZWJzb2NrZXQnYCk7XG4gICAqIC0gYHBpbmdUaW1lb3V0Ok51bWJlcmA6IHRpbWVvdXQgKGluIG1pbGxpc2Vjb25kcykgYmVmb3JlIHRyeWluZyB0byByZWVzdGFibGlzaCBhIGNvbm5lY3Rpb24gYmV0d2VlbiBhIGxvc3QgY2xpZW50IGFuZCBhIHNlcnZlciAoZGVmYXV0bHMgdG8gYDYwMDAwYCk7XG4gICAqIC0gYHBpbmdJbnRlcnZhbDpOdW1iZXJgOiB0aW1lIGludGVydmFsIChpbiBtaWxsaXNlY29uZHMpIHRvIHNlbmQgYSBwaW5nIHRvIGEgY2xpZW50IHRvIGNoZWNrIHRoZSBjb25uZWN0aW9uIChkZWZhdWx0cyB0byBgNTAwMDBgKS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtlbnZDb25maWc9e31dIEVudmlyb25tZW50IGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAgICogQGF0dHJpYnV0ZSB7TnVtYmVyfSBbZW52Q29uZmlnLnBvcnQ9ODAwMF0gUG9ydCBvZiB0aGUgSFRUUCBzZXJ2ZXIuXG4gICAqIEBhdHRyaWJ1dGUge09iamVjdH0gW2VudkNvbmZpZy5vc2M9e31dIE9TQyBvcHRpb25zLiBUaGUgT1NDIGNvbmZpZyBvYmplY3QgY2FuIGhhdmUgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICAgKiAtIGBsb2NhbEFkZHJlc3M6U3RyaW5nYDogYWRkcmVzcyBvZiB0aGUgbG9jYWwgbWFjaGluZSB0byByZWNlaXZlIE9TQyBtZXNzYWdlcyAoZGVmYXVsdHMgdG8gYCcxMjcuMC4wLjEnYCk7XG4gICAqIC0gYGxvY2FsUG9ydDpOdW1iZXJgOiBwb3J0IG9mIHRoZSBsb2NhbCBtYWNoaW5lIHRvIHJlY2VpdmUgT1NDIG1lc3NhZ2VzIChkZWZhdWx0cyB0byBgNTcxMjFgKTtcbiAgICogLSBgcmVtb3RlQWRkcmVzczpTdHJpbmdgOiBhZGRyZXNzIG9mIHRoZSBkZXZpY2UgdG8gc2VuZCBkZWZhdWx0IE9TQyBtZXNzYWdlcyB0byAoZGVmYXVsdHMgdG8gYCcxMjcuMC4wLjEnYCk7XG4gICAqIC0gYHJlbW90ZVBvcnQ6TnVtYmVyYDogcG9ydCBvZiB0aGUgZGV2aWNlIHRvIHNlbmQgZGVmYXVsdCBPU0MgbWVzc2FnZXMgdG8gKGRlZmF1bHRzIHRvIGA1NzEyMGApLlxuICAgKi9cbiAgaW5pdCguLi5jb25maWdzKSB7XG4gICAgICAgIC8vIG1lcmdlIGRlZmF1bHQgY29uZmlndXJhdGlvbiBvYmplY3RzXG4gICAgdGhpcy5jb25maWcgPSBPYmplY3QuYXNzaWduKHRoaXMuY29uZmlnLCBleGFtcGxlQXBwQ29uZmlnLCBkZWZhdWx0RndDb25maWcsIGRlZmF1bHRFbnZDb25maWcpO1xuICAgIC8vIG1lcmdlIGdpdmVuIGNvbmZpZ3VyYXRpb25zIG9iamVjdHMgd2l0aCBkZWZhdWx0cyAoMSBsZXZlbCBkZXB0aClcbiAgICBjb25maWdzLmZvckVhY2goKGNvbmZpZykgPT4ge1xuICAgICAgZm9yIChsZXQga2V5IGluIGNvbmZpZykge1xuICAgICAgICBjb25zdCBlbnRyeSA9IGNvbmZpZ1trZXldO1xuICAgICAgICBpZiAodHlwZW9mIGVudHJ5ID09PSAnb2JqZWN0JyAmJiBlbnRyeSAhPT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMuY29uZmlnW2tleV0gPSB0aGlzLmNvbmZpZ1trZXldIHx8wqB7fTtcbiAgICAgICAgICB0aGlzLmNvbmZpZ1trZXldID0gT2JqZWN0LmFzc2lnbih0aGlzLmNvbmZpZ1trZXldLCBlbnRyeSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5jb25maWdba2V5XSA9IGVudHJ5O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBzZXJ2ZXI6XG4gICAqIC0gbGF1bmNoIHRoZSBIVFRQIHNlcnZlci5cbiAgICogLSBsYXVuY2ggdGhlIHNvY2tldCBzZXJ2ZXIuXG4gICAqIC0gc3RhcnQgYWxsIHJlZ2lzdGVyZWQgYWN0aXZpdGllcy5cbiAgICogLSBkZWZpbmUgcm91dGVzIGFuZCBhc3NvY2lhdGUgY2xpZW50IHR5cGVzIGFuZCBhY3Rpdml0aWVzLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgbG9nZ2VyLmluaXRpYWxpemUodGhpcy5jb25maWcubG9nZ2VyKTtcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gY29uZmlndXJlIGV4cHJlc3MgYW5kIGh0dHAocykgc2VydmVyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBjb25zdCBleHByZXNzQXBwID0gbmV3IGV4cHJlc3MoKTtcbiAgICBleHByZXNzQXBwLnNldCgncG9ydCcsIHByb2Nlc3MuZW52LlBPUlQgfHwgdGhpcy5jb25maWcucG9ydCk7XG4gICAgZXhwcmVzc0FwcC5zZXQoJ3ZpZXcgZW5naW5lJywgJ2VqcycpO1xuICAgIGV4cHJlc3NBcHAudXNlKGV4cHJlc3Muc3RhdGljKHRoaXMuY29uZmlnLnB1YmxpY0ZvbGRlcikpO1xuXG4gICAgbGV0IGh0dHBTZXJ2ZXI7XG5cbiAgICBpZiAoIXRoaXMuY29uZmlnLnVzZUh0dHBzKSB7XG4gICAgICBodHRwU2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoZXhwcmVzc0FwcCk7XG4gICAgICB0aGlzLl9pbml0U29ja2V0cyhodHRwU2VydmVyKTtcbiAgICAgIHRoaXMuX2luaXRBY3Rpdml0aWVzKGV4cHJlc3NBcHApO1xuXG4gICAgICBodHRwU2VydmVyLmxpc3RlbihleHByZXNzQXBwLmdldCgncG9ydCcpLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgdXJsID0gYGh0dHA6Ly8xMjcuMC4wLjE6JHtleHByZXNzQXBwLmdldCgncG9ydCcpfWA7XG4gICAgICAgIGNvbnNvbGUubG9nKCdbSFRUUCBTRVJWRVJdIFNlcnZlciBsaXN0ZW5pbmcgb24nLCB1cmwpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBlbS5jcmVhdGVDZXJ0aWZpY2F0ZSh7IGRheXM6IDEsIHNlbGZTaWduZWQ6IHRydWUgfSwgKGVyciwga2V5cykgPT4ge1xuICAgICAgICBodHRwU2VydmVyID0gaHR0cHMuY3JlYXRlU2VydmVyKHtcbiAgICAgICAgICBrZXk6IGtleXMuc2VydmljZUtleSxcbiAgICAgICAgICBjZXJ0OiBrZXlzLmNlcnRpZmljYXRlXG4gICAgICAgIH0sIGV4cHJlc3NBcHApO1xuXG4gICAgICAgIHRoaXMuX2luaXRTb2NrZXRzKGh0dHBTZXJ2ZXIpO1xuICAgICAgICB0aGlzLl9pbml0QWN0aXZpdGllcyhleHByZXNzQXBwKTtcblxuICAgICAgICBodHRwU2VydmVyLmxpc3RlbihleHByZXNzQXBwLmdldCgncG9ydCcpLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBjb25zdCB1cmwgPSBgaHR0cHM6Ly8xMjcuMC4wLjE6JHtleHByZXNzQXBwLmdldCgncG9ydCcpfWA7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1tIVFRQIFNFUlZFUl0gU2VydmVyIGxpc3RlbmluZyBvbicsIHVybCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBJbml0IHdlYnNvY2tldCBzZXJ2ZXIuXG4gICAqL1xuICBfaW5pdFNvY2tldHMoaHR0cFNlcnZlcikge1xuICAgIHRoaXMuaW8gPSBuZXcgSU8oaHR0cFNlcnZlciwgdGhpcy5jb25maWcuc29ja2V0SU8pO1xuXG4gICAgaWYgKHRoaXMuY29uZmlnLmNvcmRvdmEgJiYgdGhpcy5jb25maWcuY29yZG92YS5zb2NrZXRJTykgLy8gSU8gYWRkIHNvbWUgY29uZmlndXJhdGlvbiBvcHRpb25zIHRvIHRoZSBvYmplY3RcbiAgICAgIHRoaXMuY29uZmlnLmNvcmRvdmEuc29ja2V0SU8gPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmNvbmZpZy5zb2NrZXRJTywgdGhpcy5jb25maWcuY29yZG92YS5zb2NrZXRJTyk7XG5cbiAgICBzb2NrZXRzLmluaXRpYWxpemUodGhpcy5pbyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFN0YXJ0IGFsbCBhY3Rpdml0aWVzIGFuZCBtYXAgdGhlIHJvdXRlcyAoY2xpZW50VHlwZSAvIGFjdGl2aXRpZXMgbWFwcGluZykuXG4gICAqL1xuICBfaW5pdEFjdGl2aXRpZXMoZXhwcmVzc0FwcCkge1xuICAgIHRoaXMuX2FjdGl2aXRpZXMuZm9yRWFjaCgoYWN0aXZpdHkpID0+IGFjdGl2aXR5LnN0YXJ0KCkpO1xuXG4gICAgdGhpcy5fYWN0aXZpdGllcy5mb3JFYWNoKChhY3Rpdml0eSkgPT4ge1xuICAgICAgdGhpcy5zZXRNYXAoYWN0aXZpdHkuY2xpZW50VHlwZXMsIGFjdGl2aXR5KVxuICAgIH0pO1xuXG4gICAgLy8gbWFwIGBjbGllbnRUeXBlYCB0byB0aGVpciByZXNwZWN0aXZlIGFjdGl2aXRpZXNcbiAgICBmb3IgKGxldCBjbGllbnRUeXBlIGluIHRoaXMuX2NsaWVudFR5cGVBY3Rpdml0aWVzTWFwKSB7XG4gICAgICBjb25zdCBhY3Rpdml0eSA9IHRoaXMuX2NsaWVudFR5cGVBY3Rpdml0aWVzTWFwW2NsaWVudFR5cGVdO1xuICAgICAgdGhpcy5fbWFwKGNsaWVudFR5cGUsIGFjdGl2aXR5LCBleHByZXNzQXBwKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEluZGljYXRlIHRoYXQgdGhlIGNsaWVudHMgb2YgdHlwZSBgY2xpZW50VHlwZWAgcmVxdWlyZSB0aGUgbW9kdWxlcyBgLi4ubW9kdWxlc2Agb24gdGhlIHNlcnZlciBzaWRlLlxuICAgKiBBZGRpdGlvbmFsbHksIHRoaXMgbWV0aG9kIHJvdXRlcyB0aGUgY29ubmVjdGlvbnMgZnJvbSB0aGUgY29ycmVzcG9uZGluZyBVUkwgdG8gdGhlIGNvcnJlc3BvbmRpbmcgdmlldy5cbiAgICogTW9yZSBzcGVjaWZpY2FsbHk6XG4gICAqIC0gQSBjbGllbnQgY29ubmVjdGluZyB0byB0aGUgc2VydmVyIHRocm91Z2ggdGhlIHJvb3QgVVJMIGBodHRwOi8vbXkuc2VydmVyLmFkZHJlc3M6cG9ydC9gIGlzIGNvbnNpZGVyZWQgYXMgYSBgJ3BsYXllcidgIGNsaWVudCBhbmQgZGlzcGxheXMgdGhlIHZpZXcgYHBsYXllci5lanNgO1xuICAgKiAtIEEgY2xpZW50IGNvbm5lY3RpbmcgdG8gdGhlIHNlcnZlciB0aHJvdWdoIHRoZSBVUkwgYGh0dHA6Ly9teS5zZXJ2ZXIuYWRkcmVzczpwb3J0L2NsaWVudFR5cGVgIGlzIGNvbnNpZGVyZWQgYXMgYSBgY2xpZW50VHlwZWAgY2xpZW50LCBhbmQgZGlzcGxheXMgdGhlIHZpZXcgYGNsaWVudFR5cGUuZWpzYC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNsaWVudFR5cGUgQ2xpZW50IHR5cGUgKGFzIGRlZmluZWQgYnkgdGhlIG1ldGhvZCB7QGxpbmsgY2xpZW50LmluaXR9IG9uIHRoZSBjbGllbnQgc2lkZSkuXG4gICAqIEBwYXJhbSB7Li4uQ2xpZW50TW9kdWxlfSBtb2R1bGVzIE1vZHVsZXMgdG8gbWFwIHRvIHRoYXQgY2xpZW50IHR5cGUuXG4gICAqL1xuICBfbWFwKGNsaWVudFR5cGUsIG1vZHVsZXMsIGV4cHJlc3NBcHApIHtcbiAgICAvLyBAdG9kbyAtIGFsbG93IHRvIHBhc3Mgc29tZSB2YXJpYWJsZSBpbiB0aGUgdXJsIC0+IGRlZmluZSBob3cgYmluZCBpdCB0byBzb2NrZXRzLi4uXG4gICAgY29uc3QgdXJsID0gKGNsaWVudFR5cGUgIT09IHRoaXMuY29uZmlnLmRlZmF1bHRDbGllbnQpID8gYC8ke2NsaWVudFR5cGV9YCA6ICcvJztcblxuICAgIC8vIHVzZSB0ZW1wbGF0ZSB3aXRoIGBjbGllbnRUeXBlYCBuYW1lIG9yIGRlZmF1bHQgaWYgbm90IGRlZmluZWRcbiAgICBjb25zdCBjbGllbnRUbXBsID0gcGF0aC5qb2luKHRoaXMuY29uZmlnLnRlbXBsYXRlRm9sZGVyLCBgJHtjbGllbnRUeXBlfS5lanNgKTtcbiAgICBjb25zdCBkZWZhdWx0VG1wbCA9IHBhdGguam9pbih0aGlzLmNvbmZpZy50ZW1wbGF0ZUZvbGRlciwgYGRlZmF1bHQuZWpzYCk7XG4gICAgY29uc3QgdGVtcGxhdGUgPSBmcy5leGlzdHNTeW5jKGNsaWVudFRtcGwpID8gY2xpZW50VG1wbCA6IGRlZmF1bHRUbXBsO1xuXG4gICAgY29uc3QgdG1wbFN0cmluZyA9IGZzLnJlYWRGaWxlU3luYyh0ZW1wbGF0ZSwgeyBlbmNvZGluZzogJ3V0ZjgnIH0pO1xuICAgIGNvbnN0IHRtcGwgPSBlanMuY29tcGlsZSh0bXBsU3RyaW5nKTtcblxuICAgIGV4cHJlc3NBcHAuZ2V0KHVybCwgKHJlcSwgcmVzKSA9PiB7XG4gICAgICBsZXQgaW5jbHVkZUNvcmRvdmFUYWdzID0gZmFsc2U7XG4gICAgICBsZXQgc29ja2V0Q29uZmlnID0gSlNPTi5zdHJpbmdpZnkodGhpcy5jb25maWcuc29ja2V0SU8pO1xuXG4gICAgICBpZiAocmVxLnF1ZXJ5LmNvcmRvdmEpIHtcbiAgICAgICAgaW5jbHVkZUNvcmRvdmFUYWdzID0gdHJ1ZTtcbiAgICAgICAgc29ja2V0Q29uZmlnID0gSlNPTi5zdHJpbmdpZnkodGhpcy5jb25maWcuY29yZG92YS5zb2NrZXRJTyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXEucXVlcnkuY2xpZW50VHlwZSlcbiAgICAgICAgY2xpZW50VHlwZSA9IHJlcS5xdWVyeS5jbGllbnRUeXBlO1xuXG4gICAgICByZXMuc2VuZCh0bXBsKHtcbiAgICAgICAgc29ja2V0SU86IHNvY2tldENvbmZpZyxcbiAgICAgICAgYXBwTmFtZTogdGhpcy5jb25maWcuYXBwTmFtZSxcbiAgICAgICAgY2xpZW50VHlwZTogY2xpZW50VHlwZSxcbiAgICAgICAgZGVmYXVsdFR5cGU6IHRoaXMuY29uZmlnLmRlZmF1bHRDbGllbnQsXG4gICAgICAgIGFzc2V0c0RvbWFpbjogdGhpcy5jb25maWcuYXNzZXRzRG9tYWluLFxuICAgICAgICAvLyBleHBvcnQgaHRtbCBmb3IgY29yZG92YSB1c2VcbiAgICAgICAgaW5jbHVkZUNvcmRvdmFUYWdzOiBpbmNsdWRlQ29yZG92YVRhZ3MsXG4gICAgICB9KSk7XG4gICAgfSk7XG5cbiAgICAvLyB3YWl0IGZvciBzb2NrZXQgY29ubm5lY3Rpb25cbiAgICB0aGlzLmlvLm9mKGNsaWVudFR5cGUpLm9uKCdjb25uZWN0aW9uJywgdGhpcy5fb25Db25uZWN0aW9uKGNsaWVudFR5cGUsIG1vZHVsZXMpKTtcbiAgfSxcblxuICAvKipcbiAgICogU29ja2V0IGNvbm5lY3Rpb24gY2FsbGJhY2suXG4gICAqL1xuICBfb25Db25uZWN0aW9uKGNsaWVudFR5cGUsIGFjdGl2aXRpZXMpIHtcbiAgICByZXR1cm4gKHNvY2tldCkgPT4ge1xuICAgICAgY29uc3QgY2xpZW50ID0gbmV3IENsaWVudChjbGllbnRUeXBlLCBzb2NrZXQpO1xuICAgICAgYWN0aXZpdGllcy5mb3JFYWNoKChhY3Rpdml0eSkgPT4gYWN0aXZpdHkuY29ubmVjdChjbGllbnQpKTtcblxuICAgICAgLy8gZ2xvYmFsIGxpZmVjeWNsZSBvZiB0aGUgY2xpZW50XG4gICAgICBzb2NrZXRzLnJlY2VpdmUoY2xpZW50LCAnZGlzY29ubmVjdCcsICgpID0+IHtcbiAgICAgICAgYWN0aXZpdGllcy5mb3JFYWNoKChhY3Rpdml0eSkgPT4gYWN0aXZpdHkuZGlzY29ubmVjdChjbGllbnQpKTtcbiAgICAgICAgLy8gQHRvZG8gLSBzaG91bGQgcmVtb3ZlIGFsbCBsaXN0ZW5lcnMgb24gdGhlIGNsaWVudFxuICAgICAgICBjbGllbnQuZGVzdHJveSgpO1xuICAgICAgICBsb2dnZXIuaW5mbyh7IHNvY2tldCwgY2xpZW50VHlwZSB9LCAnZGlzY29ubmVjdCcpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIEB0b2RvIC0gcmVmYWN0b3IgaGFuZHNoYWtlIGFuZCB1dWlkIGRlZmluaXRpb24uXG4gICAgICBzb2NrZXRzLnNlbmQoY2xpZW50LCAnY2xpZW50OnN0YXJ0JywgY2xpZW50LnV1aWQpOyAvLyB0aGUgc2VydmVyIGlzIHJlYWR5XG4gICAgICBsb2dnZXIuaW5mbyh7IHNvY2tldCwgY2xpZW50VHlwZSB9LCAnY29ubmVjdGlvbicpO1xuICAgIH1cbiAgfSxcbn07XG4iXX0=