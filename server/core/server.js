'use strict';

var _Set = require('babel-runtime/core-js/set')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

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

var _socketIo = require('socket.io');

var _socketIo2 = _interopRequireDefault(_socketIo);

var _utilsLogger = require('../utils/logger');

var _utilsLogger2 = _interopRequireDefault(_utilsLogger);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _pem = require('pem');

var _pem2 = _interopRequireDefault(_pem);

var _serverServiceManager = require('./serverServiceManager');

var _serverServiceManager2 = _interopRequireDefault(_serverServiceManager);

var _sockets = require('./sockets');

var _sockets2 = _interopRequireDefault(_sockets);

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
  publicFolder: _path2['default'].join(process.cwd(), 'public'),
  templateFolder: _path2['default'].join(process.cwd(), 'views'),
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
  _activities: new _Set(),

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
    var _this = this;

    clientTypes.forEach(function (clientType) {
      if (!_this._clientTypeActivitiesMap[clientType]) _this._clientTypeActivitiesMap[clientType] = new _Set();

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
    this.config = _Object$assign(this.config, exampleAppConfig, defaultFwConfig, defaultEnvConfig);
    // merge given configurations objects with defaults (1 level depth)

    for (var _len = arguments.length, configs = Array(_len), _key = 0; _key < _len; _key++) {
      configs[_key] = arguments[_key];
    }

    configs.forEach(function (config) {
      for (var key in config) {
        var entry = config[key];
        if (typeof entry === 'object' && entry !== null) {
          _this2.config[key] = _this2.config[key] || {};
          _this2.config[key] = _Object$assign(_this2.config[key], entry);
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

    _utilsLogger2['default'].initialize(this.config.logger);

    // --------------------------------------------------
    // configure express and http(s) server
    // --------------------------------------------------
    var expressApp = new _express2['default']();
    expressApp.set('port', process.env.PORT || this.config.port);
    expressApp.set('view engine', 'ejs');
    expressApp.use(_express2['default']['static'](this.config.publicFolder));

    var httpServer = undefined;

    if (!this.config.useHttps) {
      httpServer = _http2['default'].createServer(expressApp);
      this._initSockets(httpServer);
      this._initActivities(expressApp);

      httpServer.listen(expressApp.get('port'), function () {
        var url = 'http://127.0.0.1:' + expressApp.get('port');
        console.log('[HTTP SERVER] Server listening on', url);
      });
    } else {
      _pem2['default'].createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
        httpServer = _https2['default'].createServer({
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
    this.io = new _socketIo2['default'](httpServer, this.config.socketIO);
    _sockets2['default'].initialize(this.io);
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
    var clientTmpl = _path2['default'].join(this.config.templateFolder, clientType + '.ejs');
    var defaultTmpl = _path2['default'].join(this.config.templateFolder, 'default.ejs');
    var template = _fs2['default'].existsSync(clientTmpl) ? clientTmpl : defaultTmpl;

    var tmplString = _fs2['default'].readFileSync(template, { encoding: 'utf8' });
    var tmpl = _ejs2['default'].compile(tmplString);

    expressApp.get(url, function (req, res) {
      res.send(tmpl({
        socketIO: JSON.stringify(_this5.config.socketIO),
        appName: _this5.config.appName,
        clientType: clientType,
        defaultType: _this5.config.defaultClient,
        assetsDomain: _this5.config.assetsDomain
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

      // @todo - refactor handshake and uuid definition.
      _sockets2['default'].send(client, 'client:start', client.uuid); // the server is ready
      _utilsLogger2['default'].info({ socket: socket, clientType: clientType }, 'connection');
    };
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9zZXJ2ZXIvY29yZS9zZXJ2ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O3NCQUFtQixVQUFVOzs7O21CQUNiLEtBQUs7Ozs7dUJBQ0QsU0FBUzs7OztrQkFDZCxJQUFJOzs7O29CQUNGLE1BQU07Ozs7cUJBQ0wsT0FBTzs7Ozt3QkFDVixXQUFXOzs7OzJCQUNQLGlCQUFpQjs7OztvQkFDbkIsTUFBTTs7OzttQkFDUCxLQUFLOzs7O29DQUNZLHdCQUF3Qjs7Ozt1QkFDckMsV0FBVzs7Ozs7Ozs7QUFRL0IsSUFBTSxnQkFBZ0IsR0FBRztBQUN2QixTQUFPLEVBQUUsWUFBWTtBQUNyQixTQUFPLEVBQUUsT0FBTzs7Ozs7Ozs7Ozs7Ozs7O0FBZWhCLE9BQUssRUFBRTtBQUNMLFFBQUksRUFBRTtBQUNKLFdBQUssRUFBRSxFQUFFO0FBQ1QsWUFBTSxFQUFFLEVBQUU7QUFDVixnQkFBVSxFQUFFLFNBQVM7S0FDdEI7QUFDRCxVQUFNLEVBQUUsU0FBUztBQUNqQixlQUFXLEVBQUUsU0FBUztBQUN0Qix5QkFBcUIsRUFBRSxDQUFDO0FBQ3hCLFlBQVEsRUFBRSxRQUFRO0dBQ25CO0FBQ0QsbUJBQWlCLEVBQUU7QUFDakIsU0FBSyxFQUFFLEdBQUc7QUFDVixVQUFNLEVBQUUsQ0FBQyxFQUNWO0NBQ0YsQ0FBQzs7Ozs7OztBQU1GLElBQU0sZUFBZSxHQUFHO0FBQ3RCLFVBQVEsRUFBRSxLQUFLO0FBQ2YsY0FBWSxFQUFFLGtCQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsUUFBUSxDQUFDO0FBQ2hELGdCQUFjLEVBQUUsa0JBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxPQUFPLENBQUM7QUFDakQsZUFBYSxFQUFFLFFBQVE7QUFDdkIsY0FBWSxFQUFFLEVBQUU7QUFDaEIsVUFBUSxFQUFFO0FBQ1IsT0FB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Ozs7OztBQUtELGVBQWEsRUFBQSx1QkFBQyxVQUFVLEVBQUUsVUFBVSxFQUFFO0FBQ3BDLFdBQU8sVUFBQyxNQUFNLEVBQUs7QUFDakIsVUFBTSxNQUFNLEdBQUcsd0JBQVcsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzlDLGdCQUFVLENBQUMsT0FBTyxDQUFDLFVBQUMsUUFBUTtlQUFLLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO09BQUEsQ0FBQyxDQUFDOzs7QUFHM0QsMkJBQVEsT0FBTyxDQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUUsWUFBTTtBQUMxQyxrQkFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFDLFFBQVE7aUJBQUssUUFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7U0FBQSxDQUFDLENBQUM7O0FBRTlELGNBQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNqQixpQ0FBTyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLFVBQVUsRUFBVixVQUFVLEVBQUUsRUFBRSxZQUFZLENBQUMsQ0FBQztPQUNuRCxDQUFDLENBQUM7OztBQUdILDJCQUFRLElBQUksQ0FBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNsRCwrQkFBTyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLFVBQVUsRUFBVixVQUFVLEVBQUUsRUFBRSxZQUFZLENBQUMsQ0FBQztLQUNuRCxDQUFBO0dBQ0Y7Q0FDRiIsImZpbGUiOiIvVXNlcnMvbWF0dXN6ZXdza2kvZGV2L2Nvc2ltYS9saWIvc291bmR3b3Jrcy9zcmMvc2VydmVyL2NvcmUvc2VydmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENsaWVudCBmcm9tICcuL0NsaWVudCc7XG5pbXBvcnQgZWpzIGZyb20gJ2Vqcyc7XG5pbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgaHR0cCBmcm9tICdodHRwJztcbmltcG9ydCBodHRwcyBmcm9tICdodHRwcyc7XG5pbXBvcnQgSU8gZnJvbSAnc29ja2V0LmlvJztcbmltcG9ydCBsb2dnZXIgZnJvbSAnLi4vdXRpbHMvbG9nZ2VyJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHBlbSBmcm9tICdwZW0nO1xuaW1wb3J0IHNlcnZlclNlcnZpY2VNYW5hZ2VyIGZyb20gJy4vc2VydmVyU2VydmljZU1hbmFnZXInO1xuaW1wb3J0IHNvY2tldHMgZnJvbSAnLi9zb2NrZXRzJztcblxuXG5cbi8qKlxuICogU2V0IG9mIGNvbmZpZ3VyYXRpb24gcGFyYW1ldGVycyBkZWZpbmVkIGJ5IGEgcGFydGljdWxhciBhcHBsaWNhdGlvbi5cbiAqIFRoZXNlIHBhcmFtZXRlcnMgdHlwaWNhbGx5IGluY2x1c2QgYSBzZXR1cCBhbmQgY29udHJvbCBwYXJhbWV0ZXJzIHZhbHVlcy5cbiAqL1xuY29uc3QgZXhhbXBsZUFwcENvbmZpZyA9IHtcbiAgYXBwTmFtZTogJ1NvdW5kd29ya3MnLCAvLyB0aXRsZSBvZiB0aGUgYXBwbGljYXRpb24gKGZvciA8dGl0bGU+IHRhZylcbiAgdmVyc2lvbjogJzAuMC4xJywgLy8gdmVyc2lvbiBvZiB0aGUgYXBwbGljYXRpb24gKGFsbG93IHRvIGJ5cGFzcyBicm93c2VyIGNhY2hlKVxuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtzZXR1cD17fV0gLSBTZXR1cCBkZWZpbmluZyBkaW1lbnNpb25zIGFuZCBwcmVkZWZpbmVkIHBvc2l0aW9ucyAobGFiZWxzIGFuZC9vciBjb29yZGluYXRlcykuXG4gICAqIEBhdHRyaWJ1dGUge09iamVjdH0gW3NldHVwLmFyZWE9bnVsbF0gLSBUaGUgZGltZW5zaW9ucyBvZiB0aGUgYXJlYS5cbiAgICogQGF0dHJpYnV0ZSB7TnVtYmVyfSBbc2V0dXAuYXJlYS5oZWlnaHRdIC0gVGhlIGhlaWdodCBvZiB0aGUgYXJlYS5cbiAgICogQGF0dHJpYnV0ZSB7TnVtYmVyfSBbc2V0dXAuYXJlYS53aWR0aF0gLSBUaGUgd2lkdGggb2YgdGhlIGFyZWEuXG4gICAqIEBhdHRyaWJ1dGUge1N0cmluZ30gW3NldHVwLmFyZWEuYmFja2dyb3VuZF0gLSBUaGUgb3B0aW9ubmFsIGJhY2tncm91bmQgKGltYWdlKSBvZiB0aGUgYXJlYS5cbiAgICogQGF0dHJpYnV0ZSB7QXJyYXk8U3RyaW5nPn0gW3NldHVwLmxhYmVsc10gLSBMaXN0IG9mIHByZWRlZmluZWQgbGFiZWxzLlxuICAgKiBAYXR0cmlidXRlIHtBcnJheTxBcnJheT59IFtzZXR1cC5jb29yZGluYXRlc10gLSBMaXN0IG9mIHByZWRlZmluZWQgY29vcmRpbmF0ZXNcbiAgICogIGdpdmVuIGFzIGFuIGFycmF5IGBbeDpOdW1iZXIsIHk6TnVtYmVyXWAuXG4gICAqIEBhdHRyaWJ1dGUge051bWJlcn0gW3NldHVwLmNhcGFjaXR5PUluZmluaXR5XSAtIE1heGltdW0gbnVtYmVyIG9mIHBsYWNlc1xuICAgKiAgKG1heSBsaW1pdCBvciBiZSBsaW1pdGVkIGJ5IHRoZSBudW1iZXIgb2YgbGFiZWxzIGFuZC9vciBjb29yZGluYXRlcyBkZWZpbmVkIGJ5IHRoZSBzZXR1cCkuXG4gICAqIEB0dHJpYnV0ZSB7TnVtYmVyfSBbc2V0dXAubWF4Q2xpZW50c1BlclBvc2l0aW9uPTFdIC0gVGhlIG1heGltdW0gbnVtYmVyIG9mIGNsaWVudHNcbiAgICogIGFsbG93ZWQgaW4gb25lIHBvc2l0aW9uLlxuICAgKi9cbiAgc2V0dXA6IHtcbiAgICBhcmVhOiB7XG4gICAgICB3aWR0aDogMTAsXG4gICAgICBoZWlnaHQ6IDEwLFxuICAgICAgYmFja2dyb3VuZDogdW5kZWZpbmVkLFxuICAgIH0sXG4gICAgbGFiZWxzOiB1bmRlZmluZWQsXG4gICAgY29vcmRpbmF0ZXM6IHVuZGVmaW5lZCxcbiAgICBtYXhDbGllbnRzUGVyUG9zaXRpb246IDEsXG4gICAgY2FwYWNpdHk6IEluZmluaXR5LFxuICB9LFxuICBjb250cm9sUGFyYW1ldGVyczoge1xuICAgIHRlbXBvOiAxMjAsIC8vIHRlbXBvIGluIEJQTVxuICAgIHZvbHVtZTogMCwgLy8gbWFzdGVyIHZvbHVtZSBpbiBkQlxuICB9LFxufTtcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIHBhcmFtZXRlcnMgb2YgdGhlIFNvdW5kd29ya3MgZnJhbWV3b3JrLlxuICogVGhlc2UgcGFyYW1ldGVycyBhbGxvdyBmb3IgY29uZmlndXJpbmcgY29tcG9uZW50cyBvZiB0aGUgZnJhbWV3b3JrIHN1Y2ggYXMgRXhwcmVzcyBhbmQgU29ja2V0SU8uXG4gKi9cbmNvbnN0IGRlZmF1bHRGd0NvbmZpZyA9IHtcbiAgdXNlSHR0cHM6IGZhbHNlLFxuICBwdWJsaWNGb2xkZXI6IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAncHVibGljJyksXG4gIHRlbXBsYXRlRm9sZGVyOiBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3ZpZXdzJyksXG4gIGRlZmF1bHRDbGllbnQ6ICdwbGF5ZXInLFxuICBhc3NldHNEb21haW46ICcnLCAvLyBvdmVycmlkZSB0byBkb3dubG9hZCBhc3NldHMgZnJvbSBhIGRpZmZlcmVudCBzZXJ2ZXVyIChuZ2lueClcbiAgc29ja2V0SU86IHtcbiAgICB1cmw6ICcnLFxuICAgIHRyYW5zcG9ydHM6IFsnd2Vic29ja2V0J10sXG4gICAgcGluZ1RpbWVvdXQ6IDYwMDAwLCAvLyBjb25maWd1cmUgY2xpZW50IHNpZGUgdG9vID9cbiAgICBwaW5nSW50ZXJ2YWw6IDUwMDAwLCAvLyBjb25maWd1cmUgY2xpZW50IHNpZGUgdG9vID9cbiAgICAvLyBAbm90ZTogRW5naW5lSU8gZGVmYXVsdHNcbiAgICAvLyBwaW5nVGltZW91dDogMzAwMCxcbiAgICAvLyBwaW5nSW50ZXJ2YWw6IDEwMDAsXG4gICAgLy8gdXBncmFkZVRpbWVvdXQ6IDEwMDAwLFxuICAgIC8vIG1heEh0dHBCdWZmZXJTaXplOiAxMEU3LFxuICB9LFxuICBlcnJvclJlcG9ydGVyRGlyZWN0b3J5OiAnbG9ncy9jbGllbnRzJyxcbiAgZGJEaXJlY3Rvcnk6ICdkYicsXG59O1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gcGFyYW1ldGVycyBvZiB0aGUgU291bmR3b3JrcyBmcmFtZXdvcmsuXG4gKiBUaGVzZSBwYXJhbWV0ZXJzIGFsbG93IGZvciBjb25maWd1cmluZyBjb21wb25lbnRzIG9mIHRoZSBmcmFtZXdvcmsgc3VjaCBhcyBFeHByZXNzIGFuZCBTb2NrZXRJTy5cbiAqL1xuY29uc3QgZGVmYXVsdEVudkNvbmZpZyA9IHtcbiAgcG9ydDogODAwMCxcbiAgb3NjOiB7XG4gICAgcmVjZWl2ZUFkZHJlc3M6ICcxMjcuMC4wLjEnLFxuICAgIHJlY2VpdmVQb3J0OiA1NzEyMSxcbiAgICBzZW5kQWRkcmVzczogJzEyNy4wLjAuMScsXG4gICAgc2VuZFBvcnQ6IDU3MTIwLFxuICB9LFxuICBsb2dnZXI6IHtcbiAgICBuYW1lOiAnc291bmR3b3JrcycsXG4gICAgbGV2ZWw6ICdpbmZvJyxcbiAgICBzdHJlYW1zOiBbe1xuICAgICAgbGV2ZWw6ICdpbmZvJyxcbiAgICAgIHN0cmVhbTogcHJvY2Vzcy5zdGRvdXQsXG4gICAgfSwgLyp7XG4gICAgICBsZXZlbDogJ2luZm8nLFxuICAgICAgcGF0aDogcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdsb2dzJywgJ3NvdW5kd29ya3MubG9nJyksXG4gICAgfSovXVxuICB9XG59O1xuXG4vKipcbiAqIFRoZSBgc2VydmVyYCBvYmplY3QgY29udGFpbnMgdGhlIGJhc2ljIG1ldGhvZHMgb2YgdGhlIHNlcnZlci5cbiAqIEZvciBpbnN0YW5jZSwgdGhpcyBvYmplY3QgYWxsb3dzIHNldHRpbmcgdXAsIGNvbmZpZ3VyaW5nIGFuZCBzdGFydGluZyB0aGUgc2VydmVyIHdpdGggdGhlIG1ldGhvZCBgc3RhcnRgIHdoaWxlIHRoZSBtZXRob2QgYG1hcGAgYWxsb3dzIGZvciBtYW5hZ2luZyB0aGUgbWFwcGluZyBiZXR3ZWVuIGRpZmZlcmVudCB0eXBlcyBvZiBjbGllbnRzIGFuZCB0aGVpciByZXF1aXJlZCBzZXJ2ZXIgbW9kdWxlcy5cbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IHtcblxuICAvKipcbiAgICogV2ViU29ja2V0IHNlcnZlci5cbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGlvOiBudWxsLFxuXG4gIC8qKlxuICAgKiBFeHByZXNzIGFwcGxpY2F0aW9uXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICAvLyBleHByZXNzQXBwOiBudWxsLFxuXG4gIC8qKlxuICAgKiBIdHRwIHNlcnZlclxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgLy8gaHR0cFNlcnZlcjogbnVsbCxcblxuICAvKipcbiAgICogQ29uZmlndXJhdGlvbiBpbmZvcm1hdGlvbnMuXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xuICBjb25maWc6IHt9LFxuXG4gIC8qKlxuICAgKiBNYXBwaW5nIGJldHdlZW4gYSBgY2xpZW50VHlwZWAgYW5kIGl0cyByZWxhdGVkIGFjdGl2aXRpZXNcbiAgICovXG4gIF9jbGllbnRUeXBlQWN0aXZpdGllc01hcDoge30sXG5cbiAgLyoqXG4gICAqIEFjdGl2aXRpZXMgdG8gYmUgc3RhcnRlZFxuICAgKi9cbiAgX2FjdGl2aXRpZXM6IG5ldyBTZXQoKSxcblxuICAvKipcbiAgICogUmV0dXJucyBhIHNlcnZpY2UgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBUaGUgaWRlbnRpZmllciBvZiB0aGUgc2VydmljZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBUaGUgb3B0aW9ucyB0byBjb25maWd1cmUgdGhlIHNlcnZpY2UuXG4gICAqL1xuICByZXF1aXJlKGlkLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIHNlcnZlclNlcnZpY2VNYW5hZ2VyLnJlcXVpcmUoaWQsIG51bGwsIG9wdGlvbnMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiB1c2VkIGJ5IGFjdGl2aXRpZXMgdG8gcmVnaXN0ZXJlZCB0aGVpciBjb25jZXJuZWQgY2xpZW50IHR5cGUgaW50byB0aGUgc2VydmVyXG4gICAqIEBwYXJhbSB7QXJyYXk8U3RyaW5nPn0gY2xpZW50VHlwZXMgLSBBbiBhcnJheSBvZiBjbGllbnQgdHlwZS5cbiAgICogQHBhcmFtIHtBY3Rpdml0eX0gYWN0aXZpdHkgLSBUaGUgYWN0aXZpdHkgY29uY2VybmVkIHdpdGggdGhlIGdpdmVuIGBjbGllbnRUeXBlc2AuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZXRNYXAoY2xpZW50VHlwZXMsIGFjdGl2aXR5KSB7XG4gICAgY2xpZW50VHlwZXMuZm9yRWFjaCgoY2xpZW50VHlwZSkgPT4ge1xuICAgICAgaWYgKCF0aGlzLl9jbGllbnRUeXBlQWN0aXZpdGllc01hcFtjbGllbnRUeXBlXSlcbiAgICAgICAgdGhpcy5fY2xpZW50VHlwZUFjdGl2aXRpZXNNYXBbY2xpZW50VHlwZV0gPSBuZXcgU2V0KCk7XG5cbiAgICAgIHRoaXMuX2NsaWVudFR5cGVBY3Rpdml0aWVzTWFwW2NsaWVudFR5cGVdLmFkZChhY3Rpdml0eSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uIHVzZWQgYnkgYWN0aXZpdGllcyB0byByZWdpc3RlciB0aGVtc2VsdmVzIGFzIGFjdGl2ZSBhY3Rpdml0aWVzXG4gICAqIEBwYXJhbSB7QWN0aXZpdHl9IGFjdGl2aXR5XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZXRBY3Rpdml0eShhY3Rpdml0eSkge1xuICAgIHRoaXMuX2FjdGl2aXRpZXMuYWRkKGFjdGl2aXR5KTtcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBzZXJ2ZXIgd2l0aCB0aGUgZ2l2ZW4gY29uZmlnIG9iamVjdHMuXG4gICAqIEB0b2RvIC0gbW92ZSB0aGlzIGRvYyB0byBjb25maWd1cmF0aW9uIG9iamVjdHMuXG4gICAqXG4gICAqIEBwYXJhbSB7Li4uT2JqZWN0fSBjb25maWdzIC0gT2JqZWN0IG9mIGFwcGxpY2F0aW9uIGNvbmZpZ3VyYXRpb24uXG4gICAqXG4gICAqIEB0b2RvIC0gcmV3cml0ZSBkb2MgcHJvcGVybHkgZm9yIHRoaXMgbWV0aG9kLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW2FwcENvbmZpZz17fV0gQXBwbGljYXRpb24gY29uZmlndXJhdGlvbiBvcHRpb25zLlxuICAgKiBAYXR0cmlidXRlIHtTdHJpbmd9IFthcHBDb25maWcucHVibGljRm9sZGVyPScuL3B1YmxpYyddIFBhdGggdG8gdGhlIHB1YmxpYyBmb2xkZXIuXG4gICAqIEBhdHRyaWJ1dGUge09iamVjdH0gW2FwcENvbmZpZy5zb2NrZXRJTz17fV0gc29ja2V0LmlvIG9wdGlvbnMuIFRoZSBzb2NrZXQuaW8gY29uZmlnIG9iamVjdCBjYW4gaGF2ZSB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gICAqIC0gYHRyYW5zcG9ydHM6U3RyaW5nYDogY29tbXVuaWNhdGlvbiB0cmFuc3BvcnQgKGRlZmF1bHRzIHRvIGAnd2Vic29ja2V0J2ApO1xuICAgKiAtIGBwaW5nVGltZW91dDpOdW1iZXJgOiB0aW1lb3V0IChpbiBtaWxsaXNlY29uZHMpIGJlZm9yZSB0cnlpbmcgdG8gcmVlc3RhYmxpc2ggYSBjb25uZWN0aW9uIGJldHdlZW4gYSBsb3N0IGNsaWVudCBhbmQgYSBzZXJ2ZXIgKGRlZmF1dGxzIHRvIGA2MDAwMGApO1xuICAgKiAtIGBwaW5nSW50ZXJ2YWw6TnVtYmVyYDogdGltZSBpbnRlcnZhbCAoaW4gbWlsbGlzZWNvbmRzKSB0byBzZW5kIGEgcGluZyB0byBhIGNsaWVudCB0byBjaGVjayB0aGUgY29ubmVjdGlvbiAoZGVmYXVsdHMgdG8gYDUwMDAwYCkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbZW52Q29uZmlnPXt9XSBFbnZpcm9ubWVudCBjb25maWd1cmF0aW9uIG9wdGlvbnMuXG4gICAqIEBhdHRyaWJ1dGUge051bWJlcn0gW2VudkNvbmZpZy5wb3J0PTgwMDBdIFBvcnQgb2YgdGhlIEhUVFAgc2VydmVyLlxuICAgKiBAYXR0cmlidXRlIHtPYmplY3R9IFtlbnZDb25maWcub3NjPXt9XSBPU0Mgb3B0aW9ucy4gVGhlIE9TQyBjb25maWcgb2JqZWN0IGNhbiBoYXZlIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAgICogLSBgbG9jYWxBZGRyZXNzOlN0cmluZ2A6IGFkZHJlc3Mgb2YgdGhlIGxvY2FsIG1hY2hpbmUgdG8gcmVjZWl2ZSBPU0MgbWVzc2FnZXMgKGRlZmF1bHRzIHRvIGAnMTI3LjAuMC4xJ2ApO1xuICAgKiAtIGBsb2NhbFBvcnQ6TnVtYmVyYDogcG9ydCBvZiB0aGUgbG9jYWwgbWFjaGluZSB0byByZWNlaXZlIE9TQyBtZXNzYWdlcyAoZGVmYXVsdHMgdG8gYDU3MTIxYCk7XG4gICAqIC0gYHJlbW90ZUFkZHJlc3M6U3RyaW5nYDogYWRkcmVzcyBvZiB0aGUgZGV2aWNlIHRvIHNlbmQgZGVmYXVsdCBPU0MgbWVzc2FnZXMgdG8gKGRlZmF1bHRzIHRvIGAnMTI3LjAuMC4xJ2ApO1xuICAgKiAtIGByZW1vdGVQb3J0Ok51bWJlcmA6IHBvcnQgb2YgdGhlIGRldmljZSB0byBzZW5kIGRlZmF1bHQgT1NDIG1lc3NhZ2VzIHRvIChkZWZhdWx0cyB0byBgNTcxMjBgKS5cbiAgICovXG4gIGluaXQoLi4uY29uZmlncykge1xuICAgICAgICAvLyBtZXJnZSBkZWZhdWx0IGNvbmZpZ3VyYXRpb24gb2JqZWN0c1xuICAgIHRoaXMuY29uZmlnID0gT2JqZWN0LmFzc2lnbih0aGlzLmNvbmZpZywgZXhhbXBsZUFwcENvbmZpZywgZGVmYXVsdEZ3Q29uZmlnLCBkZWZhdWx0RW52Q29uZmlnKTtcbiAgICAvLyBtZXJnZSBnaXZlbiBjb25maWd1cmF0aW9ucyBvYmplY3RzIHdpdGggZGVmYXVsdHMgKDEgbGV2ZWwgZGVwdGgpXG4gICAgY29uZmlncy5mb3JFYWNoKChjb25maWcpID0+IHtcbiAgICAgIGZvciAobGV0IGtleSBpbiBjb25maWcpIHtcbiAgICAgICAgY29uc3QgZW50cnkgPSBjb25maWdba2V5XTtcbiAgICAgICAgaWYgKHR5cGVvZiBlbnRyeSA9PT0gJ29iamVjdCcgJiYgZW50cnkgIT09IG51bGwpIHtcbiAgICAgICAgICB0aGlzLmNvbmZpZ1trZXldID0gdGhpcy5jb25maWdba2V5XSB8fMKge307XG4gICAgICAgICAgdGhpcy5jb25maWdba2V5XSA9IE9iamVjdC5hc3NpZ24odGhpcy5jb25maWdba2V5XSwgZW50cnkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuY29uZmlnW2tleV0gPSBlbnRyeTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgc2VydmVyOlxuICAgKiAtIGxhdW5jaCB0aGUgSFRUUCBzZXJ2ZXIuXG4gICAqIC0gbGF1bmNoIHRoZSBzb2NrZXQgc2VydmVyLlxuICAgKiAtIHN0YXJ0IGFsbCByZWdpc3RlcmVkIGFjdGl2aXRpZXMuXG4gICAqIC0gZGVmaW5lIHJvdXRlcyBhbmQgYXNzb2NpYXRlIGNsaWVudCB0eXBlcyBhbmQgYWN0aXZpdGllcy5cbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIGxvZ2dlci5pbml0aWFsaXplKHRoaXMuY29uZmlnLmxvZ2dlcik7XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIGNvbmZpZ3VyZSBleHByZXNzIGFuZCBodHRwKHMpIHNlcnZlclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgY29uc3QgZXhwcmVzc0FwcCA9IG5ldyBleHByZXNzKCk7XG4gICAgZXhwcmVzc0FwcC5zZXQoJ3BvcnQnLCBwcm9jZXNzLmVudi5QT1JUIHx8IHRoaXMuY29uZmlnLnBvcnQpO1xuICAgIGV4cHJlc3NBcHAuc2V0KCd2aWV3IGVuZ2luZScsICdlanMnKTtcbiAgICBleHByZXNzQXBwLnVzZShleHByZXNzLnN0YXRpYyh0aGlzLmNvbmZpZy5wdWJsaWNGb2xkZXIpKTtcblxuICAgIGxldCBodHRwU2VydmVyO1xuXG4gICAgaWYgKCF0aGlzLmNvbmZpZy51c2VIdHRwcykge1xuICAgICAgaHR0cFNlcnZlciA9IGh0dHAuY3JlYXRlU2VydmVyKGV4cHJlc3NBcHApO1xuICAgICAgdGhpcy5faW5pdFNvY2tldHMoaHR0cFNlcnZlcik7XG4gICAgICB0aGlzLl9pbml0QWN0aXZpdGllcyhleHByZXNzQXBwKTtcblxuICAgICAgaHR0cFNlcnZlci5saXN0ZW4oZXhwcmVzc0FwcC5nZXQoJ3BvcnQnKSwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHVybCA9IGBodHRwOi8vMTI3LjAuMC4xOiR7ZXhwcmVzc0FwcC5nZXQoJ3BvcnQnKX1gO1xuICAgICAgICBjb25zb2xlLmxvZygnW0hUVFAgU0VSVkVSXSBTZXJ2ZXIgbGlzdGVuaW5nIG9uJywgdXJsKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBwZW0uY3JlYXRlQ2VydGlmaWNhdGUoeyBkYXlzOiAxLCBzZWxmU2lnbmVkOiB0cnVlIH0sIChlcnIsIGtleXMpID0+IHtcbiAgICAgICAgaHR0cFNlcnZlciA9IGh0dHBzLmNyZWF0ZVNlcnZlcih7XG4gICAgICAgICAga2V5OiBrZXlzLnNlcnZpY2VLZXksXG4gICAgICAgICAgY2VydDoga2V5cy5jZXJ0aWZpY2F0ZVxuICAgICAgICB9LCBleHByZXNzQXBwKTtcblxuICAgICAgICB0aGlzLl9pbml0U29ja2V0cyhodHRwU2VydmVyKTtcbiAgICAgICAgdGhpcy5faW5pdEFjdGl2aXRpZXMoZXhwcmVzc0FwcCk7XG5cbiAgICAgICAgaHR0cFNlcnZlci5saXN0ZW4oZXhwcmVzc0FwcC5nZXQoJ3BvcnQnKSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgY29uc3QgdXJsID0gYGh0dHBzOi8vMTI3LjAuMC4xOiR7ZXhwcmVzc0FwcC5nZXQoJ3BvcnQnKX1gO1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdbSFRUUCBTRVJWRVJdIFNlcnZlciBsaXN0ZW5pbmcgb24nLCB1cmwpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogSW5pdCB3ZWJzb2NrZXQgc2VydmVyLlxuICAgKi9cbiAgX2luaXRTb2NrZXRzKGh0dHBTZXJ2ZXIpIHtcbiAgICB0aGlzLmlvID0gbmV3IElPKGh0dHBTZXJ2ZXIsIHRoaXMuY29uZmlnLnNvY2tldElPKTtcbiAgICBzb2NrZXRzLmluaXRpYWxpemUodGhpcy5pbyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFN0YXJ0IGFsbCBhY3Rpdml0aWVzIGFuZCBtYXAgdGhlIHJvdXRlcyAoY2xpZW50VHlwZSAvIGFjdGl2aXRpZXMgbWFwcGluZykuXG4gICAqL1xuICBfaW5pdEFjdGl2aXRpZXMoZXhwcmVzc0FwcCkge1xuICAgIHRoaXMuX2FjdGl2aXRpZXMuZm9yRWFjaCgoYWN0aXZpdHkpID0+IGFjdGl2aXR5LnN0YXJ0KCkpO1xuXG4gICAgdGhpcy5fYWN0aXZpdGllcy5mb3JFYWNoKChhY3Rpdml0eSkgPT4ge1xuICAgICAgdGhpcy5zZXRNYXAoYWN0aXZpdHkuY2xpZW50VHlwZXMsIGFjdGl2aXR5KVxuICAgIH0pO1xuXG4gICAgLy8gbWFwIGBjbGllbnRUeXBlYCB0byB0aGVpciByZXNwZWN0aXZlIGFjdGl2aXRpZXNcbiAgICBmb3IgKGxldCBjbGllbnRUeXBlIGluIHRoaXMuX2NsaWVudFR5cGVBY3Rpdml0aWVzTWFwKSB7XG4gICAgICBjb25zdCBhY3Rpdml0eSA9IHRoaXMuX2NsaWVudFR5cGVBY3Rpdml0aWVzTWFwW2NsaWVudFR5cGVdO1xuICAgICAgdGhpcy5fbWFwKGNsaWVudFR5cGUsIGFjdGl2aXR5LCBleHByZXNzQXBwKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEluZGljYXRlIHRoYXQgdGhlIGNsaWVudHMgb2YgdHlwZSBgY2xpZW50VHlwZWAgcmVxdWlyZSB0aGUgbW9kdWxlcyBgLi4ubW9kdWxlc2Agb24gdGhlIHNlcnZlciBzaWRlLlxuICAgKiBBZGRpdGlvbmFsbHksIHRoaXMgbWV0aG9kIHJvdXRlcyB0aGUgY29ubmVjdGlvbnMgZnJvbSB0aGUgY29ycmVzcG9uZGluZyBVUkwgdG8gdGhlIGNvcnJlc3BvbmRpbmcgdmlldy5cbiAgICogTW9yZSBzcGVjaWZpY2FsbHk6XG4gICAqIC0gQSBjbGllbnQgY29ubmVjdGluZyB0byB0aGUgc2VydmVyIHRocm91Z2ggdGhlIHJvb3QgVVJMIGBodHRwOi8vbXkuc2VydmVyLmFkZHJlc3M6cG9ydC9gIGlzIGNvbnNpZGVyZWQgYXMgYSBgJ3BsYXllcidgIGNsaWVudCBhbmQgZGlzcGxheXMgdGhlIHZpZXcgYHBsYXllci5lanNgO1xuICAgKiAtIEEgY2xpZW50IGNvbm5lY3RpbmcgdG8gdGhlIHNlcnZlciB0aHJvdWdoIHRoZSBVUkwgYGh0dHA6Ly9teS5zZXJ2ZXIuYWRkcmVzczpwb3J0L2NsaWVudFR5cGVgIGlzIGNvbnNpZGVyZWQgYXMgYSBgY2xpZW50VHlwZWAgY2xpZW50LCBhbmQgZGlzcGxheXMgdGhlIHZpZXcgYGNsaWVudFR5cGUuZWpzYC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNsaWVudFR5cGUgQ2xpZW50IHR5cGUgKGFzIGRlZmluZWQgYnkgdGhlIG1ldGhvZCB7QGxpbmsgY2xpZW50LmluaXR9IG9uIHRoZSBjbGllbnQgc2lkZSkuXG4gICAqIEBwYXJhbSB7Li4uQ2xpZW50TW9kdWxlfSBtb2R1bGVzIE1vZHVsZXMgdG8gbWFwIHRvIHRoYXQgY2xpZW50IHR5cGUuXG4gICAqL1xuICBfbWFwKGNsaWVudFR5cGUsIG1vZHVsZXMsIGV4cHJlc3NBcHApIHtcbiAgICAvLyBAdG9kbyAtIGFsbG93IHRvIHBhc3Mgc29tZSB2YXJpYWJsZSBpbiB0aGUgdXJsIC0+IGRlZmluZSBob3cgYmluZCBpdCB0byBzb2NrZXRzLi4uXG4gICAgY29uc3QgdXJsID0gKGNsaWVudFR5cGUgIT09IHRoaXMuY29uZmlnLmRlZmF1bHRDbGllbnQpID8gYC8ke2NsaWVudFR5cGV9YCA6ICcvJztcblxuICAgIC8vIHVzZSB0ZW1wbGF0ZSB3aXRoIGBjbGllbnRUeXBlYCBuYW1lIG9yIGRlZmF1bHQgaWYgbm90IGRlZmluZWRcbiAgICBjb25zdCBjbGllbnRUbXBsID0gcGF0aC5qb2luKHRoaXMuY29uZmlnLnRlbXBsYXRlRm9sZGVyLCBgJHtjbGllbnRUeXBlfS5lanNgKTtcbiAgICBjb25zdCBkZWZhdWx0VG1wbCA9IHBhdGguam9pbih0aGlzLmNvbmZpZy50ZW1wbGF0ZUZvbGRlciwgYGRlZmF1bHQuZWpzYCk7XG4gICAgY29uc3QgdGVtcGxhdGUgPSBmcy5leGlzdHNTeW5jKGNsaWVudFRtcGwpID8gY2xpZW50VG1wbCA6IGRlZmF1bHRUbXBsO1xuXG4gICAgY29uc3QgdG1wbFN0cmluZyA9IGZzLnJlYWRGaWxlU3luYyh0ZW1wbGF0ZSwgeyBlbmNvZGluZzogJ3V0ZjgnIH0pO1xuICAgIGNvbnN0IHRtcGwgPSBlanMuY29tcGlsZSh0bXBsU3RyaW5nKTtcblxuICAgIGV4cHJlc3NBcHAuZ2V0KHVybCwgKHJlcSwgcmVzKSA9PiB7XG4gICAgICByZXMuc2VuZCh0bXBsKHtcbiAgICAgICAgc29ja2V0SU86IEpTT04uc3RyaW5naWZ5KHRoaXMuY29uZmlnLnNvY2tldElPKSxcbiAgICAgICAgYXBwTmFtZTogdGhpcy5jb25maWcuYXBwTmFtZSxcbiAgICAgICAgY2xpZW50VHlwZTogY2xpZW50VHlwZSxcbiAgICAgICAgZGVmYXVsdFR5cGU6IHRoaXMuY29uZmlnLmRlZmF1bHRDbGllbnQsXG4gICAgICAgIGFzc2V0c0RvbWFpbjogdGhpcy5jb25maWcuYXNzZXRzRG9tYWluLFxuICAgICAgfSkpO1xuICAgIH0pO1xuXG4gICAgLy8gd2FpdCBmb3Igc29ja2V0IGNvbm5uZWN0aW9uXG4gICAgdGhpcy5pby5vZihjbGllbnRUeXBlKS5vbignY29ubmVjdGlvbicsIHRoaXMuX29uQ29ubmVjdGlvbihjbGllbnRUeXBlLCBtb2R1bGVzKSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNvY2tldCBjb25uZWN0aW9uIGNhbGxiYWNrLlxuICAgKi9cbiAgX29uQ29ubmVjdGlvbihjbGllbnRUeXBlLCBhY3Rpdml0aWVzKSB7XG4gICAgcmV0dXJuIChzb2NrZXQpID0+IHtcbiAgICAgIGNvbnN0IGNsaWVudCA9IG5ldyBDbGllbnQoY2xpZW50VHlwZSwgc29ja2V0KTtcbiAgICAgIGFjdGl2aXRpZXMuZm9yRWFjaCgoYWN0aXZpdHkpID0+IGFjdGl2aXR5LmNvbm5lY3QoY2xpZW50KSk7XG5cbiAgICAgIC8vIGdsb2JhbCBsaWZlY3ljbGUgb2YgdGhlIGNsaWVudFxuICAgICAgc29ja2V0cy5yZWNlaXZlKGNsaWVudCwgJ2Rpc2Nvbm5lY3QnLCAoKSA9PiB7XG4gICAgICAgIGFjdGl2aXRpZXMuZm9yRWFjaCgoYWN0aXZpdHkpID0+IGFjdGl2aXR5LmRpc2Nvbm5lY3QoY2xpZW50KSk7XG4gICAgICAgIC8vIEB0b2RvIC0gc2hvdWxkIHJlbW92ZSBhbGwgbGlzdGVuZXJzIG9uIHRoZSBjbGllbnRcbiAgICAgICAgY2xpZW50LmRlc3Ryb3koKTtcbiAgICAgICAgbG9nZ2VyLmluZm8oeyBzb2NrZXQsIGNsaWVudFR5cGUgfSwgJ2Rpc2Nvbm5lY3QnKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBAdG9kbyAtIHJlZmFjdG9yIGhhbmRzaGFrZSBhbmQgdXVpZCBkZWZpbml0aW9uLlxuICAgICAgc29ja2V0cy5zZW5kKGNsaWVudCwgJ2NsaWVudDpzdGFydCcsIGNsaWVudC51dWlkKTsgLy8gdGhlIHNlcnZlciBpcyByZWFkeVxuICAgICAgbG9nZ2VyLmluZm8oeyBzb2NrZXQsIGNsaWVudFR5cGUgfSwgJ2Nvbm5lY3Rpb24nKTtcbiAgICB9XG4gIH0sXG59O1xuIl19