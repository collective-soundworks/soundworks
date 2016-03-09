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
  templateFolder: _path2.default.join(process.cwd(), 'html'),
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
//# sourceMappingURL=data:application/json;base64,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QUFWLEVBQVosRUFBb0MsWUFBcEMsRUFKMEM7T0FBTixDQUF0Qzs7O0FBTGlCLHVCQWFqQixDQUFRLElBQVIsQ0FBYSxNQUFiLEVBQXFCLGNBQXJCLEVBQXFDLE9BQU8sSUFBUCxDQUFyQztBQWJpQixzQkFjakIsQ0FBTyxJQUFQLENBQVksRUFBRSxjQUFGLEVBQVUsc0JBQVYsRUFBWixFQUFvQyxZQUFwQyxFQWRpQjtLQUFaLENBRDZCO0dBOU96QiIsImZpbGUiOiJzZXJ2ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ2xpZW50IGZyb20gJy4vQ2xpZW50JztcbmltcG9ydCBlanMgZnJvbSAnZWpzJztcbmltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBodHRwIGZyb20gJ2h0dHAnO1xuaW1wb3J0IGh0dHBzIGZyb20gJ2h0dHBzJztcbmltcG9ydCBJTyBmcm9tICdzb2NrZXQuaW8nO1xuaW1wb3J0IGxvZ2dlciBmcm9tICcuLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgcGVtIGZyb20gJ3BlbSc7XG5pbXBvcnQgc2VydmVyU2VydmljZU1hbmFnZXIgZnJvbSAnLi9zZXJ2ZXJTZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgc29ja2V0cyBmcm9tICcuL3NvY2tldHMnO1xuXG5cblxuLyoqXG4gKiBTZXQgb2YgY29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzIGRlZmluZWQgYnkgYSBwYXJ0aWN1bGFyIGFwcGxpY2F0aW9uLlxuICogVGhlc2UgcGFyYW1ldGVycyB0eXBpY2FsbHkgaW5jbHVzZCBhIHNldHVwIGFuZCBjb250cm9sIHBhcmFtZXRlcnMgdmFsdWVzLlxuICovXG5jb25zdCBleGFtcGxlQXBwQ29uZmlnID0ge1xuICBhcHBOYW1lOiAnU291bmR3b3JrcycsIC8vIHRpdGxlIG9mIHRoZSBhcHBsaWNhdGlvbiAoZm9yIDx0aXRsZT4gdGFnKVxuICB2ZXJzaW9uOiAnMC4wLjEnLCAvLyB2ZXJzaW9uIG9mIHRoZSBhcHBsaWNhdGlvbiAoYWxsb3cgdG8gYnlwYXNzIGJyb3dzZXIgY2FjaGUpXG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW3NldHVwPXt9XSAtIFNldHVwIGRlZmluaW5nIGRpbWVuc2lvbnMgYW5kIHByZWRlZmluZWQgcG9zaXRpb25zIChsYWJlbHMgYW5kL29yIGNvb3JkaW5hdGVzKS5cbiAgICogQGF0dHJpYnV0ZSB7T2JqZWN0fSBbc2V0dXAuYXJlYT1udWxsXSAtIFRoZSBkaW1lbnNpb25zIG9mIHRoZSBhcmVhLlxuICAgKiBAYXR0cmlidXRlIHtOdW1iZXJ9IFtzZXR1cC5hcmVhLmhlaWdodF0gLSBUaGUgaGVpZ2h0IG9mIHRoZSBhcmVhLlxuICAgKiBAYXR0cmlidXRlIHtOdW1iZXJ9IFtzZXR1cC5hcmVhLndpZHRoXSAtIFRoZSB3aWR0aCBvZiB0aGUgYXJlYS5cbiAgICogQGF0dHJpYnV0ZSB7U3RyaW5nfSBbc2V0dXAuYXJlYS5iYWNrZ3JvdW5kXSAtIFRoZSBvcHRpb25uYWwgYmFja2dyb3VuZCAoaW1hZ2UpIG9mIHRoZSBhcmVhLlxuICAgKiBAYXR0cmlidXRlIHtBcnJheTxTdHJpbmc+fSBbc2V0dXAubGFiZWxzXSAtIExpc3Qgb2YgcHJlZGVmaW5lZCBsYWJlbHMuXG4gICAqIEBhdHRyaWJ1dGUge0FycmF5PEFycmF5Pn0gW3NldHVwLmNvb3JkaW5hdGVzXSAtIExpc3Qgb2YgcHJlZGVmaW5lZCBjb29yZGluYXRlc1xuICAgKiAgZ2l2ZW4gYXMgYW4gYXJyYXkgYFt4Ok51bWJlciwgeTpOdW1iZXJdYC5cbiAgICogQGF0dHJpYnV0ZSB7TnVtYmVyfSBbc2V0dXAuY2FwYWNpdHk9SW5maW5pdHldIC0gTWF4aW11bSBudW1iZXIgb2YgcGxhY2VzXG4gICAqICAobWF5IGxpbWl0IG9yIGJlIGxpbWl0ZWQgYnkgdGhlIG51bWJlciBvZiBsYWJlbHMgYW5kL29yIGNvb3JkaW5hdGVzIGRlZmluZWQgYnkgdGhlIHNldHVwKS5cbiAgICogQHR0cmlidXRlIHtOdW1iZXJ9IFtzZXR1cC5tYXhDbGllbnRzUGVyUG9zaXRpb249MV0gLSBUaGUgbWF4aW11bSBudW1iZXIgb2YgY2xpZW50c1xuICAgKiAgYWxsb3dlZCBpbiBvbmUgcG9zaXRpb24uXG4gICAqL1xuICBzZXR1cDoge1xuICAgIGFyZWE6IHtcbiAgICAgIHdpZHRoOiAxMCxcbiAgICAgIGhlaWdodDogMTAsXG4gICAgICBiYWNrZ3JvdW5kOiB1bmRlZmluZWQsXG4gICAgfSxcbiAgICBsYWJlbHM6IHVuZGVmaW5lZCxcbiAgICBjb29yZGluYXRlczogdW5kZWZpbmVkLFxuICAgIG1heENsaWVudHNQZXJQb3NpdGlvbjogMSxcbiAgICBjYXBhY2l0eTogSW5maW5pdHksXG4gIH0sXG4gIGNvbnRyb2xQYXJhbWV0ZXJzOiB7XG4gICAgdGVtcG86IDEyMCwgLy8gdGVtcG8gaW4gQlBNXG4gICAgdm9sdW1lOiAwLCAvLyBtYXN0ZXIgdm9sdW1lIGluIGRCXG4gIH0sXG59O1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gcGFyYW1ldGVycyBvZiB0aGUgU291bmR3b3JrcyBmcmFtZXdvcmsuXG4gKiBUaGVzZSBwYXJhbWV0ZXJzIGFsbG93IGZvciBjb25maWd1cmluZyBjb21wb25lbnRzIG9mIHRoZSBmcmFtZXdvcmsgc3VjaCBhcyBFeHByZXNzIGFuZCBTb2NrZXRJTy5cbiAqL1xuY29uc3QgZGVmYXVsdEZ3Q29uZmlnID0ge1xuICB1c2VIdHRwczogZmFsc2UsXG4gIHB1YmxpY0ZvbGRlcjogcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdwdWJsaWMnKSxcbiAgdGVtcGxhdGVGb2xkZXI6IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnaHRtbCcpLFxuICBkZWZhdWx0Q2xpZW50OiAncGxheWVyJyxcbiAgYXNzZXRzRG9tYWluOiAnJywgLy8gb3ZlcnJpZGUgdG8gZG93bmxvYWQgYXNzZXRzIGZyb20gYSBkaWZmZXJlbnQgc2VydmV1ciAobmdpbngpXG4gIHNvY2tldElPOiB7XG4gICAgdXJsOiAnJyxcbiAgICB0cmFuc3BvcnRzOiBbJ3dlYnNvY2tldCddLFxuICAgIHBpbmdUaW1lb3V0OiA2MDAwMCwgLy8gY29uZmlndXJlIGNsaWVudCBzaWRlIHRvbyA/XG4gICAgcGluZ0ludGVydmFsOiA1MDAwMCwgLy8gY29uZmlndXJlIGNsaWVudCBzaWRlIHRvbyA/XG4gICAgLy8gQG5vdGU6IEVuZ2luZUlPIGRlZmF1bHRzXG4gICAgLy8gcGluZ1RpbWVvdXQ6IDMwMDAsXG4gICAgLy8gcGluZ0ludGVydmFsOiAxMDAwLFxuICAgIC8vIHVwZ3JhZGVUaW1lb3V0OiAxMDAwMCxcbiAgICAvLyBtYXhIdHRwQnVmZmVyU2l6ZTogMTBFNyxcbiAgfSxcbiAgZXJyb3JSZXBvcnRlckRpcmVjdG9yeTogJ2xvZ3MvY2xpZW50cycsXG4gIGRiRGlyZWN0b3J5OiAnZGInLFxufTtcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIHBhcmFtZXRlcnMgb2YgdGhlIFNvdW5kd29ya3MgZnJhbWV3b3JrLlxuICogVGhlc2UgcGFyYW1ldGVycyBhbGxvdyBmb3IgY29uZmlndXJpbmcgY29tcG9uZW50cyBvZiB0aGUgZnJhbWV3b3JrIHN1Y2ggYXMgRXhwcmVzcyBhbmQgU29ja2V0SU8uXG4gKi9cbmNvbnN0IGRlZmF1bHRFbnZDb25maWcgPSB7XG4gIHBvcnQ6IDgwMDAsXG4gIG9zYzoge1xuICAgIHJlY2VpdmVBZGRyZXNzOiAnMTI3LjAuMC4xJyxcbiAgICByZWNlaXZlUG9ydDogNTcxMjEsXG4gICAgc2VuZEFkZHJlc3M6ICcxMjcuMC4wLjEnLFxuICAgIHNlbmRQb3J0OiA1NzEyMCxcbiAgfSxcbiAgbG9nZ2VyOiB7XG4gICAgbmFtZTogJ3NvdW5kd29ya3MnLFxuICAgIGxldmVsOiAnaW5mbycsXG4gICAgc3RyZWFtczogW3tcbiAgICAgIGxldmVsOiAnaW5mbycsXG4gICAgICBzdHJlYW06IHByb2Nlc3Muc3Rkb3V0LFxuICAgIH0sIC8qe1xuICAgICAgbGV2ZWw6ICdpbmZvJyxcbiAgICAgIHBhdGg6IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnbG9ncycsICdzb3VuZHdvcmtzLmxvZycpLFxuICAgIH0qL11cbiAgfVxufTtcblxuLyoqXG4gKiBUaGUgYHNlcnZlcmAgb2JqZWN0IGNvbnRhaW5zIHRoZSBiYXNpYyBtZXRob2RzIG9mIHRoZSBzZXJ2ZXIuXG4gKiBGb3IgaW5zdGFuY2UsIHRoaXMgb2JqZWN0IGFsbG93cyBzZXR0aW5nIHVwLCBjb25maWd1cmluZyBhbmQgc3RhcnRpbmcgdGhlIHNlcnZlciB3aXRoIHRoZSBtZXRob2QgYHN0YXJ0YCB3aGlsZSB0aGUgbWV0aG9kIGBtYXBgIGFsbG93cyBmb3IgbWFuYWdpbmcgdGhlIG1hcHBpbmcgYmV0d2VlbiBkaWZmZXJlbnQgdHlwZXMgb2YgY2xpZW50cyBhbmQgdGhlaXIgcmVxdWlyZWQgc2VydmVyIG1vZHVsZXMuXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5leHBvcnQgZGVmYXVsdCB7XG5cbiAgLyoqXG4gICAqIFdlYlNvY2tldCBzZXJ2ZXIuXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBpbzogbnVsbCxcblxuICAvKipcbiAgICogRXhwcmVzcyBhcHBsaWNhdGlvblxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgLy8gZXhwcmVzc0FwcDogbnVsbCxcblxuICAvKipcbiAgICogSHR0cCBzZXJ2ZXJcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIC8vIGh0dHBTZXJ2ZXI6IG51bGwsXG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyYXRpb24gaW5mb3JtYXRpb25zLlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgY29uZmlnOiB7fSxcblxuICAvKipcbiAgICogTWFwcGluZyBiZXR3ZWVuIGEgYGNsaWVudFR5cGVgIGFuZCBpdHMgcmVsYXRlZCBhY3Rpdml0aWVzXG4gICAqL1xuICBfY2xpZW50VHlwZUFjdGl2aXRpZXNNYXA6IHt9LFxuXG4gIC8qKlxuICAgKiBBY3Rpdml0aWVzIHRvIGJlIHN0YXJ0ZWRcbiAgICovXG4gIF9hY3Rpdml0aWVzOiBuZXcgU2V0KCksXG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzZXJ2aWNlIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gVGhlIGlkZW50aWZpZXIgb2YgdGhlIHNlcnZpY2UuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gVGhlIG9wdGlvbnMgdG8gY29uZmlndXJlIHRoZSBzZXJ2aWNlLlxuICAgKi9cbiAgcmVxdWlyZShpZCwgb3B0aW9ucykge1xuICAgIHJldHVybiBzZXJ2ZXJTZXJ2aWNlTWFuYWdlci5yZXF1aXJlKGlkLCBudWxsLCBvcHRpb25zKTtcbiAgfSxcblxuICAvKipcbiAgICogRnVuY3Rpb24gdXNlZCBieSBhY3Rpdml0aWVzIHRvIHJlZ2lzdGVyZWQgdGhlaXIgY29uY2VybmVkIGNsaWVudCB0eXBlIGludG8gdGhlIHNlcnZlclxuICAgKiBAcGFyYW0ge0FycmF5PFN0cmluZz59IGNsaWVudFR5cGVzIC0gQW4gYXJyYXkgb2YgY2xpZW50IHR5cGUuXG4gICAqIEBwYXJhbSB7QWN0aXZpdHl9IGFjdGl2aXR5IC0gVGhlIGFjdGl2aXR5IGNvbmNlcm5lZCB3aXRoIHRoZSBnaXZlbiBgY2xpZW50VHlwZXNgLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0TWFwKGNsaWVudFR5cGVzLCBhY3Rpdml0eSkge1xuICAgIGNsaWVudFR5cGVzLmZvckVhY2goKGNsaWVudFR5cGUpID0+IHtcbiAgICAgIGlmICghdGhpcy5fY2xpZW50VHlwZUFjdGl2aXRpZXNNYXBbY2xpZW50VHlwZV0pXG4gICAgICAgIHRoaXMuX2NsaWVudFR5cGVBY3Rpdml0aWVzTWFwW2NsaWVudFR5cGVdID0gbmV3IFNldCgpO1xuXG4gICAgICB0aGlzLl9jbGllbnRUeXBlQWN0aXZpdGllc01hcFtjbGllbnRUeXBlXS5hZGQoYWN0aXZpdHkpO1xuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiB1c2VkIGJ5IGFjdGl2aXRpZXMgdG8gcmVnaXN0ZXIgdGhlbXNlbHZlcyBhcyBhY3RpdmUgYWN0aXZpdGllc1xuICAgKiBAcGFyYW0ge0FjdGl2aXR5fSBhY3Rpdml0eVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0QWN0aXZpdHkoYWN0aXZpdHkpIHtcbiAgICB0aGlzLl9hY3Rpdml0aWVzLmFkZChhY3Rpdml0eSk7XG4gIH0sXG5cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgc2VydmVyIHdpdGggdGhlIGdpdmVuIGNvbmZpZyBvYmplY3RzLlxuICAgKiBAdG9kbyAtIG1vdmUgdGhpcyBkb2MgdG8gY29uZmlndXJhdGlvbiBvYmplY3RzLlxuICAgKlxuICAgKiBAcGFyYW0gey4uLk9iamVjdH0gY29uZmlncyAtIE9iamVjdCBvZiBhcHBsaWNhdGlvbiBjb25maWd1cmF0aW9uLlxuICAgKlxuICAgKiBAdG9kbyAtIHJld3JpdGUgZG9jIHByb3Blcmx5IGZvciB0aGlzIG1ldGhvZC5cbiAgICogQHBhcmFtIHtPYmplY3R9IFthcHBDb25maWc9e31dIEFwcGxpY2F0aW9uIGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAgICogQGF0dHJpYnV0ZSB7U3RyaW5nfSBbYXBwQ29uZmlnLnB1YmxpY0ZvbGRlcj0nLi9wdWJsaWMnXSBQYXRoIHRvIHRoZSBwdWJsaWMgZm9sZGVyLlxuICAgKiBAYXR0cmlidXRlIHtPYmplY3R9IFthcHBDb25maWcuc29ja2V0SU89e31dIHNvY2tldC5pbyBvcHRpb25zLiBUaGUgc29ja2V0LmlvIGNvbmZpZyBvYmplY3QgY2FuIGhhdmUgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICAgKiAtIGB0cmFuc3BvcnRzOlN0cmluZ2A6IGNvbW11bmljYXRpb24gdHJhbnNwb3J0IChkZWZhdWx0cyB0byBgJ3dlYnNvY2tldCdgKTtcbiAgICogLSBgcGluZ1RpbWVvdXQ6TnVtYmVyYDogdGltZW91dCAoaW4gbWlsbGlzZWNvbmRzKSBiZWZvcmUgdHJ5aW5nIHRvIHJlZXN0YWJsaXNoIGEgY29ubmVjdGlvbiBiZXR3ZWVuIGEgbG9zdCBjbGllbnQgYW5kIGEgc2VydmVyIChkZWZhdXRscyB0byBgNjAwMDBgKTtcbiAgICogLSBgcGluZ0ludGVydmFsOk51bWJlcmA6IHRpbWUgaW50ZXJ2YWwgKGluIG1pbGxpc2Vjb25kcykgdG8gc2VuZCBhIHBpbmcgdG8gYSBjbGllbnQgdG8gY2hlY2sgdGhlIGNvbm5lY3Rpb24gKGRlZmF1bHRzIHRvIGA1MDAwMGApLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW2VudkNvbmZpZz17fV0gRW52aXJvbm1lbnQgY29uZmlndXJhdGlvbiBvcHRpb25zLlxuICAgKiBAYXR0cmlidXRlIHtOdW1iZXJ9IFtlbnZDb25maWcucG9ydD04MDAwXSBQb3J0IG9mIHRoZSBIVFRQIHNlcnZlci5cbiAgICogQGF0dHJpYnV0ZSB7T2JqZWN0fSBbZW52Q29uZmlnLm9zYz17fV0gT1NDIG9wdGlvbnMuIFRoZSBPU0MgY29uZmlnIG9iamVjdCBjYW4gaGF2ZSB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gICAqIC0gYGxvY2FsQWRkcmVzczpTdHJpbmdgOiBhZGRyZXNzIG9mIHRoZSBsb2NhbCBtYWNoaW5lIHRvIHJlY2VpdmUgT1NDIG1lc3NhZ2VzIChkZWZhdWx0cyB0byBgJzEyNy4wLjAuMSdgKTtcbiAgICogLSBgbG9jYWxQb3J0Ok51bWJlcmA6IHBvcnQgb2YgdGhlIGxvY2FsIG1hY2hpbmUgdG8gcmVjZWl2ZSBPU0MgbWVzc2FnZXMgKGRlZmF1bHRzIHRvIGA1NzEyMWApO1xuICAgKiAtIGByZW1vdGVBZGRyZXNzOlN0cmluZ2A6IGFkZHJlc3Mgb2YgdGhlIGRldmljZSB0byBzZW5kIGRlZmF1bHQgT1NDIG1lc3NhZ2VzIHRvIChkZWZhdWx0cyB0byBgJzEyNy4wLjAuMSdgKTtcbiAgICogLSBgcmVtb3RlUG9ydDpOdW1iZXJgOiBwb3J0IG9mIHRoZSBkZXZpY2UgdG8gc2VuZCBkZWZhdWx0IE9TQyBtZXNzYWdlcyB0byAoZGVmYXVsdHMgdG8gYDU3MTIwYCkuXG4gICAqL1xuICBpbml0KC4uLmNvbmZpZ3MpIHtcbiAgICAgICAgLy8gbWVyZ2UgZGVmYXVsdCBjb25maWd1cmF0aW9uIG9iamVjdHNcbiAgICB0aGlzLmNvbmZpZyA9IE9iamVjdC5hc3NpZ24odGhpcy5jb25maWcsIGV4YW1wbGVBcHBDb25maWcsIGRlZmF1bHRGd0NvbmZpZywgZGVmYXVsdEVudkNvbmZpZyk7XG4gICAgLy8gbWVyZ2UgZ2l2ZW4gY29uZmlndXJhdGlvbnMgb2JqZWN0cyB3aXRoIGRlZmF1bHRzICgxIGxldmVsIGRlcHRoKVxuICAgIGNvbmZpZ3MuZm9yRWFjaCgoY29uZmlnKSA9PiB7XG4gICAgICBmb3IgKGxldCBrZXkgaW4gY29uZmlnKSB7XG4gICAgICAgIGNvbnN0IGVudHJ5ID0gY29uZmlnW2tleV07XG4gICAgICAgIGlmICh0eXBlb2YgZW50cnkgPT09ICdvYmplY3QnICYmIGVudHJ5ICE9PSBudWxsKSB7XG4gICAgICAgICAgdGhpcy5jb25maWdba2V5XSA9IHRoaXMuY29uZmlnW2tleV0gfHzCoHt9O1xuICAgICAgICAgIHRoaXMuY29uZmlnW2tleV0gPSBPYmplY3QuYXNzaWduKHRoaXMuY29uZmlnW2tleV0sIGVudHJ5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmNvbmZpZ1trZXldID0gZW50cnk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogU3RhcnQgdGhlIHNlcnZlcjpcbiAgICogLSBsYXVuY2ggdGhlIEhUVFAgc2VydmVyLlxuICAgKiAtIGxhdW5jaCB0aGUgc29ja2V0IHNlcnZlci5cbiAgICogLSBzdGFydCBhbGwgcmVnaXN0ZXJlZCBhY3Rpdml0aWVzLlxuICAgKiAtIGRlZmluZSByb3V0ZXMgYW5kIGFzc29jaWF0ZSBjbGllbnQgdHlwZXMgYW5kIGFjdGl2aXRpZXMuXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBsb2dnZXIuaW5pdGlhbGl6ZSh0aGlzLmNvbmZpZy5sb2dnZXIpO1xuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBjb25maWd1cmUgZXhwcmVzcyBhbmQgaHR0cChzKSBzZXJ2ZXJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGNvbnN0IGV4cHJlc3NBcHAgPSBuZXcgZXhwcmVzcygpO1xuICAgIGV4cHJlc3NBcHAuc2V0KCdwb3J0JywgcHJvY2Vzcy5lbnYuUE9SVCB8fCB0aGlzLmNvbmZpZy5wb3J0KTtcbiAgICBleHByZXNzQXBwLnNldCgndmlldyBlbmdpbmUnLCAnZWpzJyk7XG4gICAgZXhwcmVzc0FwcC51c2UoZXhwcmVzcy5zdGF0aWModGhpcy5jb25maWcucHVibGljRm9sZGVyKSk7XG5cbiAgICBsZXQgaHR0cFNlcnZlcjtcblxuICAgIGlmICghdGhpcy5jb25maWcudXNlSHR0cHMpIHtcbiAgICAgIGh0dHBTZXJ2ZXIgPSBodHRwLmNyZWF0ZVNlcnZlcihleHByZXNzQXBwKTtcbiAgICAgIHRoaXMuX2luaXRTb2NrZXRzKGh0dHBTZXJ2ZXIpO1xuICAgICAgdGhpcy5faW5pdEFjdGl2aXRpZXMoZXhwcmVzc0FwcCk7XG5cbiAgICAgIGh0dHBTZXJ2ZXIubGlzdGVuKGV4cHJlc3NBcHAuZ2V0KCdwb3J0JyksIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCB1cmwgPSBgaHR0cDovLzEyNy4wLjAuMToke2V4cHJlc3NBcHAuZ2V0KCdwb3J0Jyl9YDtcbiAgICAgICAgY29uc29sZS5sb2coJ1tIVFRQIFNFUlZFUl0gU2VydmVyIGxpc3RlbmluZyBvbicsIHVybCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGVtLmNyZWF0ZUNlcnRpZmljYXRlKHsgZGF5czogMSwgc2VsZlNpZ25lZDogdHJ1ZSB9LCAoZXJyLCBrZXlzKSA9PiB7XG4gICAgICAgIGh0dHBTZXJ2ZXIgPSBodHRwcy5jcmVhdGVTZXJ2ZXIoe1xuICAgICAgICAgIGtleToga2V5cy5zZXJ2aWNlS2V5LFxuICAgICAgICAgIGNlcnQ6IGtleXMuY2VydGlmaWNhdGVcbiAgICAgICAgfSwgZXhwcmVzc0FwcCk7XG5cbiAgICAgICAgdGhpcy5faW5pdFNvY2tldHMoaHR0cFNlcnZlcik7XG4gICAgICAgIHRoaXMuX2luaXRBY3Rpdml0aWVzKGV4cHJlc3NBcHApO1xuXG4gICAgICAgIGh0dHBTZXJ2ZXIubGlzdGVuKGV4cHJlc3NBcHAuZ2V0KCdwb3J0JyksIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGNvbnN0IHVybCA9IGBodHRwczovLzEyNy4wLjAuMToke2V4cHJlc3NBcHAuZ2V0KCdwb3J0Jyl9YDtcbiAgICAgICAgICBjb25zb2xlLmxvZygnW0hUVFAgU0VSVkVSXSBTZXJ2ZXIgbGlzdGVuaW5nIG9uJywgdXJsKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEluaXQgd2Vic29ja2V0IHNlcnZlci5cbiAgICovXG4gIF9pbml0U29ja2V0cyhodHRwU2VydmVyKSB7XG4gICAgdGhpcy5pbyA9IG5ldyBJTyhodHRwU2VydmVyLCB0aGlzLmNvbmZpZy5zb2NrZXRJTyk7XG5cbiAgICBpZiAodGhpcy5jb25maWcuY29yZG92YSAmJiB0aGlzLmNvbmZpZy5jb3Jkb3ZhLnNvY2tldElPKSAvLyBJTyBhZGQgc29tZSBjb25maWd1cmF0aW9uIG9wdGlvbnMgdG8gdGhlIG9iamVjdFxuICAgICAgdGhpcy5jb25maWcuY29yZG92YS5zb2NrZXRJTyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuY29uZmlnLnNvY2tldElPLCB0aGlzLmNvbmZpZy5jb3Jkb3ZhLnNvY2tldElPKTtcblxuICAgIHNvY2tldHMuaW5pdGlhbGl6ZSh0aGlzLmlvKTtcbiAgfSxcblxuICAvKipcbiAgICogU3RhcnQgYWxsIGFjdGl2aXRpZXMgYW5kIG1hcCB0aGUgcm91dGVzIChjbGllbnRUeXBlIC8gYWN0aXZpdGllcyBtYXBwaW5nKS5cbiAgICovXG4gIF9pbml0QWN0aXZpdGllcyhleHByZXNzQXBwKSB7XG4gICAgdGhpcy5fYWN0aXZpdGllcy5mb3JFYWNoKChhY3Rpdml0eSkgPT4gYWN0aXZpdHkuc3RhcnQoKSk7XG5cbiAgICB0aGlzLl9hY3Rpdml0aWVzLmZvckVhY2goKGFjdGl2aXR5KSA9PiB7XG4gICAgICB0aGlzLnNldE1hcChhY3Rpdml0eS5jbGllbnRUeXBlcywgYWN0aXZpdHkpXG4gICAgfSk7XG5cbiAgICAvLyBtYXAgYGNsaWVudFR5cGVgIHRvIHRoZWlyIHJlc3BlY3RpdmUgYWN0aXZpdGllc1xuICAgIGZvciAobGV0IGNsaWVudFR5cGUgaW4gdGhpcy5fY2xpZW50VHlwZUFjdGl2aXRpZXNNYXApIHtcbiAgICAgIGNvbnN0IGFjdGl2aXR5ID0gdGhpcy5fY2xpZW50VHlwZUFjdGl2aXRpZXNNYXBbY2xpZW50VHlwZV07XG4gICAgICB0aGlzLl9tYXAoY2xpZW50VHlwZSwgYWN0aXZpdHksIGV4cHJlc3NBcHApO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogSW5kaWNhdGUgdGhhdCB0aGUgY2xpZW50cyBvZiB0eXBlIGBjbGllbnRUeXBlYCByZXF1aXJlIHRoZSBtb2R1bGVzIGAuLi5tb2R1bGVzYCBvbiB0aGUgc2VydmVyIHNpZGUuXG4gICAqIEFkZGl0aW9uYWxseSwgdGhpcyBtZXRob2Qgcm91dGVzIHRoZSBjb25uZWN0aW9ucyBmcm9tIHRoZSBjb3JyZXNwb25kaW5nIFVSTCB0byB0aGUgY29ycmVzcG9uZGluZyB2aWV3LlxuICAgKiBNb3JlIHNwZWNpZmljYWxseTpcbiAgICogLSBBIGNsaWVudCBjb25uZWN0aW5nIHRvIHRoZSBzZXJ2ZXIgdGhyb3VnaCB0aGUgcm9vdCBVUkwgYGh0dHA6Ly9teS5zZXJ2ZXIuYWRkcmVzczpwb3J0L2AgaXMgY29uc2lkZXJlZCBhcyBhIGAncGxheWVyJ2AgY2xpZW50IGFuZCBkaXNwbGF5cyB0aGUgdmlldyBgcGxheWVyLmVqc2A7XG4gICAqIC0gQSBjbGllbnQgY29ubmVjdGluZyB0byB0aGUgc2VydmVyIHRocm91Z2ggdGhlIFVSTCBgaHR0cDovL215LnNlcnZlci5hZGRyZXNzOnBvcnQvY2xpZW50VHlwZWAgaXMgY29uc2lkZXJlZCBhcyBhIGBjbGllbnRUeXBlYCBjbGllbnQsIGFuZCBkaXNwbGF5cyB0aGUgdmlldyBgY2xpZW50VHlwZS5lanNgLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2xpZW50VHlwZSBDbGllbnQgdHlwZSAoYXMgZGVmaW5lZCBieSB0aGUgbWV0aG9kIHtAbGluayBjbGllbnQuaW5pdH0gb24gdGhlIGNsaWVudCBzaWRlKS5cbiAgICogQHBhcmFtIHsuLi5DbGllbnRNb2R1bGV9IG1vZHVsZXMgTW9kdWxlcyB0byBtYXAgdG8gdGhhdCBjbGllbnQgdHlwZS5cbiAgICovXG4gIF9tYXAoY2xpZW50VHlwZSwgbW9kdWxlcywgZXhwcmVzc0FwcCkge1xuICAgIC8vIEB0b2RvIC0gYWxsb3cgdG8gcGFzcyBzb21lIHZhcmlhYmxlIGluIHRoZSB1cmwgLT4gZGVmaW5lIGhvdyBiaW5kIGl0IHRvIHNvY2tldHMuLi5cbiAgICBjb25zdCB1cmwgPSAoY2xpZW50VHlwZSAhPT0gdGhpcy5jb25maWcuZGVmYXVsdENsaWVudCkgPyBgLyR7Y2xpZW50VHlwZX1gIDogJy8nO1xuXG4gICAgLy8gdXNlIHRlbXBsYXRlIHdpdGggYGNsaWVudFR5cGVgIG5hbWUgb3IgZGVmYXVsdCBpZiBub3QgZGVmaW5lZFxuICAgIGNvbnN0IGNsaWVudFRtcGwgPSBwYXRoLmpvaW4odGhpcy5jb25maWcudGVtcGxhdGVGb2xkZXIsIGAke2NsaWVudFR5cGV9LmVqc2ApO1xuICAgIGNvbnN0IGRlZmF1bHRUbXBsID0gcGF0aC5qb2luKHRoaXMuY29uZmlnLnRlbXBsYXRlRm9sZGVyLCBgZGVmYXVsdC5lanNgKTtcbiAgICBjb25zdCB0ZW1wbGF0ZSA9IGZzLmV4aXN0c1N5bmMoY2xpZW50VG1wbCkgPyBjbGllbnRUbXBsIDogZGVmYXVsdFRtcGw7XG5cbiAgICBjb25zdCB0bXBsU3RyaW5nID0gZnMucmVhZEZpbGVTeW5jKHRlbXBsYXRlLCB7IGVuY29kaW5nOiAndXRmOCcgfSk7XG4gICAgY29uc3QgdG1wbCA9IGVqcy5jb21waWxlKHRtcGxTdHJpbmcpO1xuXG4gICAgZXhwcmVzc0FwcC5nZXQodXJsLCAocmVxLCByZXMpID0+IHtcbiAgICAgIGxldCBpbmNsdWRlQ29yZG92YVRhZ3MgPSBmYWxzZTtcbiAgICAgIGxldCBzb2NrZXRDb25maWcgPSBKU09OLnN0cmluZ2lmeSh0aGlzLmNvbmZpZy5zb2NrZXRJTyk7XG5cbiAgICAgIGlmIChyZXEucXVlcnkuY29yZG92YSkge1xuICAgICAgICBpbmNsdWRlQ29yZG92YVRhZ3MgPSB0cnVlO1xuICAgICAgICBzb2NrZXRDb25maWcgPSBKU09OLnN0cmluZ2lmeSh0aGlzLmNvbmZpZy5jb3Jkb3ZhLnNvY2tldElPKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlcS5xdWVyeS5jbGllbnRUeXBlKVxuICAgICAgICBjbGllbnRUeXBlID0gcmVxLnF1ZXJ5LmNsaWVudFR5cGU7XG5cbiAgICAgIHJlcy5zZW5kKHRtcGwoe1xuICAgICAgICBzb2NrZXRJTzogc29ja2V0Q29uZmlnLFxuICAgICAgICBhcHBOYW1lOiB0aGlzLmNvbmZpZy5hcHBOYW1lLFxuICAgICAgICBjbGllbnRUeXBlOiBjbGllbnRUeXBlLFxuICAgICAgICBkZWZhdWx0VHlwZTogdGhpcy5jb25maWcuZGVmYXVsdENsaWVudCxcbiAgICAgICAgYXNzZXRzRG9tYWluOiB0aGlzLmNvbmZpZy5hc3NldHNEb21haW4sXG4gICAgICAgIC8vIGV4cG9ydCBodG1sIGZvciBjb3Jkb3ZhIHVzZVxuICAgICAgICBpbmNsdWRlQ29yZG92YVRhZ3M6IGluY2x1ZGVDb3Jkb3ZhVGFncyxcbiAgICAgIH0pKTtcbiAgICB9KTtcblxuICAgIC8vIHdhaXQgZm9yIHNvY2tldCBjb25ubmVjdGlvblxuICAgIHRoaXMuaW8ub2YoY2xpZW50VHlwZSkub24oJ2Nvbm5lY3Rpb24nLCB0aGlzLl9vbkNvbm5lY3Rpb24oY2xpZW50VHlwZSwgbW9kdWxlcykpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTb2NrZXQgY29ubmVjdGlvbiBjYWxsYmFjay5cbiAgICovXG4gIF9vbkNvbm5lY3Rpb24oY2xpZW50VHlwZSwgYWN0aXZpdGllcykge1xuICAgIHJldHVybiAoc29ja2V0KSA9PiB7XG4gICAgICBjb25zdCBjbGllbnQgPSBuZXcgQ2xpZW50KGNsaWVudFR5cGUsIHNvY2tldCk7XG4gICAgICBhY3Rpdml0aWVzLmZvckVhY2goKGFjdGl2aXR5KSA9PiBhY3Rpdml0eS5jb25uZWN0KGNsaWVudCkpO1xuXG4gICAgICAvLyBnbG9iYWwgbGlmZWN5Y2xlIG9mIHRoZSBjbGllbnRcbiAgICAgIHNvY2tldHMucmVjZWl2ZShjbGllbnQsICdkaXNjb25uZWN0JywgKCkgPT4ge1xuICAgICAgICBhY3Rpdml0aWVzLmZvckVhY2goKGFjdGl2aXR5KSA9PiBhY3Rpdml0eS5kaXNjb25uZWN0KGNsaWVudCkpO1xuICAgICAgICAvLyBAdG9kbyAtIHNob3VsZCByZW1vdmUgYWxsIGxpc3RlbmVycyBvbiB0aGUgY2xpZW50XG4gICAgICAgIGNsaWVudC5kZXN0cm95KCk7XG4gICAgICAgIGxvZ2dlci5pbmZvKHsgc29ja2V0LCBjbGllbnRUeXBlIH0sICdkaXNjb25uZWN0Jyk7XG4gICAgICB9KTtcblxuICAgICAgLy8gQHRvZG8gLSByZWZhY3RvciBoYW5kc2hha2UgYW5kIHV1aWQgZGVmaW5pdGlvbi5cbiAgICAgIHNvY2tldHMuc2VuZChjbGllbnQsICdjbGllbnQ6c3RhcnQnLCBjbGllbnQudXVpZCk7IC8vIHRoZSBzZXJ2ZXIgaXMgcmVhZHlcbiAgICAgIGxvZ2dlci5pbmZvKHsgc29ja2V0LCBjbGllbnRUeXBlIH0sICdjb25uZWN0aW9uJyk7XG4gICAgfVxuICB9LFxufTtcbiJdfQ==