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

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _Client = require('./Client');

var _Client2 = _interopRequireDefault(_Client);

var _serverServiceManager = require('./serverServiceManager');

var _serverServiceManager2 = _interopRequireDefault(_serverServiceManager);

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
   * Mapping between a `clientType` and its related activities
   */
  _clientTypeActivitiesMap: {},

  /**
   * Activities to be started
   */
  _activities: new _Set(),

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9zZXJ2ZXIvY29yZS9zZXJ2ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O3VCQUFvQixXQUFXOzs7O21CQUNmLEtBQUs7Ozs7dUJBQ0QsU0FBUzs7OztrQkFDZCxJQUFJOzs7O29CQUNGLE1BQU07Ozs7MkJBQ0osaUJBQWlCOzs7O3dCQUNyQixXQUFXOzs7O29CQUNULE1BQU07Ozs7c0JBQ0osVUFBVTs7OztvQ0FDSSx3QkFBd0I7Ozs7Ozs7O0FBT3pELElBQU0sZ0JBQWdCLEdBQUc7QUFDdkIsU0FBTyxFQUFFLFlBQVk7QUFDckIsU0FBTyxFQUFFLE9BQU87Ozs7Ozs7Ozs7Ozs7OztBQWVoQixPQUFLLEVBQUU7QUFDTCxRQUFJLEVBQUU7QUFDSixXQUFLLEVBQUUsRUFBRTtBQUNULFlBQU0sRUFBRSxFQUFFO0FBQ1YsZ0JBQVUsRUFBRSxTQUFTO0tBQ3RCO0FBQ0QsVUFBTSxFQUFFLFNBQVM7QUFDakIsZUFBVyxFQUFFLFNBQVM7QUFDdEIseUJBQXFCLEVBQUUsQ0FBQztBQUN4QixZQUFRLEVBQUUsUUFBUTtHQUNuQjtBQUNELG1CQUFpQixFQUFFO0FBQ2pCLFNBQUssRUFBRSxHQUFHO0FBQ1YsVUFBTSxFQUFFLENBQUMsRUFDVjtDQUNGLENBQUM7Ozs7Ozs7QUFNRixJQUFNLGVBQWUsR0FBRztBQUN0QixjQUFZLEVBQUUsa0JBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxRQUFRLENBQUM7QUFDaEQsZ0JBQWMsRUFBRSxrQkFBSyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLE9BQU8sQ0FBQztBQUNqRCxlQUFhLEVBQUUsUUFBUTtBQUN2QixjQUFZLEVBQUUsRUFBRTtBQUNoQixVQUFRLEVBQUU7QUFDUixPQUFHLEVBQUUsRUFBRTtBQUNQLGNBQVUsRUFBRSxDQUFDLFdBQVcsQ0FBQztBQUN6QixlQUFXLEVBQUUsS0FBSztBQUNsQixnQkFBWSxFQUFFLEtBQUssRUFNcEI7Ozs7Ozs7QUFDRCx3QkFBc0IsRUFBRSxjQUFjO0FBQ3RDLGFBQVcsRUFBRSxJQUFJO0NBQ2xCLENBQUM7Ozs7OztBQU1GLElBQU0sZ0JBQWdCLEdBQUc7QUFDdkIsTUFBSSxFQUFFLElBQUk7QUFDVixLQUFHLEVBQUU7QUFDSCxrQkFBYyxFQUFFLFdBQVc7QUFDM0IsZUFBVyxFQUFFLEtBQUs7QUFDbEIsZUFBVyxFQUFFLFdBQVc7QUFDeEIsWUFBUSxFQUFFLEtBQUs7R0FDaEI7QUFDRCxRQUFNLEVBQUU7QUFDTixRQUFJLEVBQUUsWUFBWTtBQUNsQixTQUFLLEVBQUUsTUFBTTtBQUNiLFdBQU8sRUFBRSxDQUFDO0FBQ1IsV0FBSyxFQUFFLE1BQU07QUFDYixZQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU07S0FDdkIsQ0FHRztHQUNMO0NBQ0YsQ0FBQzs7Ozs7Ozs7Ozt3QkFPYTs7Ozs7OztBQU9iLElBQUUsRUFBRSxJQUFJOzs7Ozs7QUFNUixZQUFVLEVBQUUsSUFBSTs7Ozs7O0FBTWhCLFlBQVUsRUFBRSxJQUFJOzs7Ozs7QUFNaEIsUUFBTSxFQUFFLEVBQUU7Ozs7O0FBS1YsMEJBQXdCLEVBQUUsRUFBRTs7Ozs7QUFLNUIsYUFBVyxFQUFFLFVBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUJ0QixNQUFJLEVBQUEsZ0JBQWE7Ozs7QUFFZixRQUFJLENBQUMsTUFBTSxHQUFHLGVBQWMsSUFBSSxDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxlQUFlLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQzs7O3NDQUZ4RixPQUFPO0FBQVAsYUFBTzs7O0FBSWIsV0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE1BQU0sRUFBSztBQUMxQixXQUFLLElBQUksR0FBRyxJQUFJLE1BQU0sRUFBRTtBQUN0QixZQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDMUIsWUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksS0FBSyxLQUFLLElBQUksRUFBRTtBQUMvQyxnQkFBSyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBSyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzFDLGdCQUFLLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxlQUFjLE1BQUssTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQzNELE1BQU07QUFDTCxnQkFBSyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO1NBQzFCO09BQ0Y7S0FDRixDQUFDLENBQUM7R0FDSjs7Ozs7Ozs7O0FBU0QsT0FBSyxFQUFBLGlCQUFHOzs7Ozs7O0FBS04sUUFBTSxVQUFVLEdBQUcsMEJBQWEsQ0FBQztBQUNqQyxjQUFVLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdELGNBQVUsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3JDLGNBQVUsQ0FBQyxHQUFHLENBQUMsOEJBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7O0FBRXpELFFBQU0sVUFBVSxHQUFHLGtCQUFLLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNqRCxjQUFVLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsWUFBVztBQUNuRCxVQUFNLEdBQUcseUJBQXVCLFVBQVUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEFBQUUsQ0FBQztBQUN6RCxhQUFPLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBQ3ZELENBQUMsQ0FBQzs7QUFFSCxRQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztBQUM3QixRQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQzs7QUFFN0IsUUFBSSxDQUFDLEVBQUUsR0FBRywwQkFBTyxVQUFVLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNuRCx5QkFBUSxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzVCLDZCQUFPLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDOzs7Ozs7QUFNdEMsUUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBQyxRQUFRO2FBQUssUUFBUSxDQUFDLEtBQUssRUFBRTtLQUFBLENBQUMsQ0FBQzs7QUFFekQsUUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBQyxRQUFRLEVBQUs7QUFDckMsYUFBSyxNQUFNLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUM1QyxDQUFDLENBQUM7OztBQUdILFNBQUssSUFBSSxVQUFVLElBQUksSUFBSSxDQUFDLHdCQUF3QixFQUFFO0FBQ3BELFVBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUMzRCxVQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUNqQztHQUNGOzs7Ozs7O0FBT0QsU0FBTyxFQUFBLGlCQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUU7QUFDbkIsV0FBTyxrQ0FBcUIsT0FBTyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7R0FDeEQ7Ozs7Ozs7O0FBUUQsUUFBTSxFQUFBLGdCQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUU7OztBQUM1QixlQUFXLENBQUMsT0FBTyxDQUFDLFVBQUMsVUFBVSxFQUFLO0FBQ2xDLFVBQUksQ0FBQyxPQUFLLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxFQUM1QyxPQUFLLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxHQUFHLFVBQVMsQ0FBQzs7QUFFeEQsYUFBSyx3QkFBd0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDekQsQ0FBQyxDQUFDO0dBQ0o7Ozs7Ozs7QUFPRCxhQUFXLEVBQUEscUJBQUMsUUFBUSxFQUFFO0FBQ3BCLFFBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0dBQ2hDOzs7Ozs7Ozs7OztBQVdELE1BQUksRUFBQSxjQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUU7Ozs7QUFFeEIsUUFBTSxHQUFHLEdBQUcsQUFBQyxVQUFVLEtBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLFNBQVEsVUFBVSxHQUFLLEdBQUcsQ0FBQzs7O0FBR2hGLFFBQU0sVUFBVSxHQUFHLGtCQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBSyxVQUFVLFVBQU8sQ0FBQztBQUM5RSxRQUFNLFdBQVcsR0FBRyxrQkFBSyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLGdCQUFnQixDQUFDO0FBQ3pFLFFBQU0sUUFBUSxHQUFHLGdCQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsR0FBRyxVQUFVLEdBQUcsV0FBVyxDQUFDOztBQUV0RSxRQUFNLFVBQVUsR0FBRyxnQkFBRyxZQUFZLENBQUMsUUFBUSxFQUFFLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDbkUsUUFBTSxJQUFJLEdBQUcsaUJBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDOztBQUVyQyxRQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsVUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFLO0FBQ3JDLFNBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ1osZ0JBQVEsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQUssTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUM5QyxlQUFPLEVBQUUsT0FBSyxNQUFNLENBQUMsT0FBTztBQUM1QixrQkFBVSxFQUFFLFVBQVU7QUFDdEIsbUJBQVcsRUFBRSxPQUFLLE1BQU0sQ0FBQyxhQUFhO0FBQ3RDLG9CQUFZLEVBQUUsT0FBSyxNQUFNLENBQUMsWUFBWTtPQUN2QyxDQUFDLENBQUMsQ0FBQztLQUNMLENBQUMsQ0FBQzs7O0FBR0gsUUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0dBQ2xGOzs7OztBQUtELGVBQWEsRUFBQSx1QkFBQyxVQUFVLEVBQUUsVUFBVSxFQUFFO0FBQ3BDLFdBQU8sVUFBQyxNQUFNLEVBQUs7QUFDakIsVUFBTSxNQUFNLEdBQUcsd0JBQVcsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzlDLGdCQUFVLENBQUMsT0FBTyxDQUFDLFVBQUMsUUFBUTtlQUFLLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO09BQUEsQ0FBQyxDQUFDOzs7QUFHM0QsMkJBQVEsT0FBTyxDQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUUsWUFBTTtBQUMxQyxrQkFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFDLFFBQVE7aUJBQUssUUFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7U0FBQSxDQUFDLENBQUM7O0FBRTlELGNBQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNqQixpQ0FBTyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLFVBQVUsRUFBVixVQUFVLEVBQUUsRUFBRSxZQUFZLENBQUMsQ0FBQztPQUNuRCxDQUFDLENBQUM7OztBQUdILDJCQUFRLElBQUksQ0FBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNsRCwrQkFBTyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLFVBQVUsRUFBVixVQUFVLEVBQUUsRUFBRSxZQUFZLENBQUMsQ0FBQztLQUNuRCxDQUFBO0dBQ0Y7Q0FDRiIsImZpbGUiOiIvVXNlcnMvbWF0dXN6ZXdza2kvZGV2L2Nvc2ltYS9saWIvc291bmR3b3Jrcy9zcmMvc2VydmVyL2NvcmUvc2VydmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNvY2tldHMgZnJvbSAnLi9zb2NrZXRzJztcbmltcG9ydCBlanMgZnJvbSAnZWpzJztcbmltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBodHRwIGZyb20gJ2h0dHAnO1xuaW1wb3J0IGxvZ2dlciBmcm9tICcuLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IElPIGZyb20gJ3NvY2tldC5pbyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBDbGllbnQgZnJvbSAnLi9DbGllbnQnO1xuaW1wb3J0IHNlcnZlclNlcnZpY2VNYW5hZ2VyIGZyb20gJy4vc2VydmVyU2VydmljZU1hbmFnZXInO1xuXG5cbi8qKlxuICogU2V0IG9mIGNvbmZpZ3VyYXRpb24gcGFyYW1ldGVycyBkZWZpbmVkIGJ5IGEgcGFydGljdWxhciBhcHBsaWNhdGlvbi5cbiAqIFRoZXNlIHBhcmFtZXRlcnMgdHlwaWNhbGx5IGluY2x1c2QgYSBzZXR1cCBhbmQgY29udHJvbCBwYXJhbWV0ZXJzIHZhbHVlcy5cbiAqL1xuY29uc3QgZXhhbXBsZUFwcENvbmZpZyA9IHtcbiAgYXBwTmFtZTogJ1NvdW5kd29ya3MnLCAvLyB0aXRsZSBvZiB0aGUgYXBwbGljYXRpb24gKGZvciA8dGl0bGU+IHRhZylcbiAgdmVyc2lvbjogJzAuMC4xJywgLy8gdmVyc2lvbiBvZiB0aGUgYXBwbGljYXRpb24gKGFsbG93IHRvIGJ5cGFzcyBicm93c2VyIGNhY2hlKVxuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtzZXR1cD17fV0gLSBTZXR1cCBkZWZpbmluZyBkaW1lbnNpb25zIGFuZCBwcmVkZWZpbmVkIHBvc2l0aW9ucyAobGFiZWxzIGFuZC9vciBjb29yZGluYXRlcykuXG4gICAqIEBhdHRyaWJ1dGUge09iamVjdH0gW3NldHVwLmFyZWE9bnVsbF0gLSBUaGUgZGltZW5zaW9ucyBvZiB0aGUgYXJlYS5cbiAgICogQGF0dHJpYnV0ZSB7TnVtYmVyfSBbc2V0dXAuYXJlYS5oZWlnaHRdIC0gVGhlIGhlaWdodCBvZiB0aGUgYXJlYS5cbiAgICogQGF0dHJpYnV0ZSB7TnVtYmVyfSBbc2V0dXAuYXJlYS53aWR0aF0gLSBUaGUgd2lkdGggb2YgdGhlIGFyZWEuXG4gICAqIEBhdHRyaWJ1dGUge1N0cmluZ30gW3NldHVwLmFyZWEuYmFja2dyb3VuZF0gLSBUaGUgb3B0aW9ubmFsIGJhY2tncm91bmQgKGltYWdlKSBvZiB0aGUgYXJlYS5cbiAgICogQGF0dHJpYnV0ZSB7QXJyYXk8U3RyaW5nPn0gW3NldHVwLmxhYmVsc10gLSBMaXN0IG9mIHByZWRlZmluZWQgbGFiZWxzLlxuICAgKiBAYXR0cmlidXRlIHtBcnJheTxBcnJheT59IFtzZXR1cC5jb29yZGluYXRlc10gLSBMaXN0IG9mIHByZWRlZmluZWQgY29vcmRpbmF0ZXNcbiAgICogIGdpdmVuIGFzIGFuIGFycmF5IGBbeDpOdW1iZXIsIHk6TnVtYmVyXWAuXG4gICAqIEBhdHRyaWJ1dGUge051bWJlcn0gW3NldHVwLmNhcGFjaXR5PUluZmluaXR5XSAtIE1heGltdW0gbnVtYmVyIG9mIHBsYWNlc1xuICAgKiAgKG1heSBsaW1pdCBvciBiZSBsaW1pdGVkIGJ5IHRoZSBudW1iZXIgb2YgbGFiZWxzIGFuZC9vciBjb29yZGluYXRlcyBkZWZpbmVkIGJ5IHRoZSBzZXR1cCkuXG4gICAqIEB0dHJpYnV0ZSB7TnVtYmVyfSBbc2V0dXAubWF4Q2xpZW50c1BlclBvc2l0aW9uPTFdIC0gVGhlIG1heGltdW0gbnVtYmVyIG9mIGNsaWVudHNcbiAgICogIGFsbG93ZWQgaW4gb25lIHBvc2l0aW9uLlxuICAgKi9cbiAgc2V0dXA6IHtcbiAgICBhcmVhOiB7XG4gICAgICB3aWR0aDogMTAsXG4gICAgICBoZWlnaHQ6IDEwLFxuICAgICAgYmFja2dyb3VuZDogdW5kZWZpbmVkLFxuICAgIH0sXG4gICAgbGFiZWxzOiB1bmRlZmluZWQsXG4gICAgY29vcmRpbmF0ZXM6IHVuZGVmaW5lZCxcbiAgICBtYXhDbGllbnRzUGVyUG9zaXRpb246IDEsXG4gICAgY2FwYWNpdHk6IEluZmluaXR5LFxuICB9LFxuICBjb250cm9sUGFyYW1ldGVyczoge1xuICAgIHRlbXBvOiAxMjAsIC8vIHRlbXBvIGluIEJQTVxuICAgIHZvbHVtZTogMCwgLy8gbWFzdGVyIHZvbHVtZSBpbiBkQlxuICB9LFxufTtcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIHBhcmFtZXRlcnMgb2YgdGhlIFNvdW5kd29ya3MgZnJhbWV3b3JrLlxuICogVGhlc2UgcGFyYW1ldGVycyBhbGxvdyBmb3IgY29uZmlndXJpbmcgY29tcG9uZW50cyBvZiB0aGUgZnJhbWV3b3JrIHN1Y2ggYXMgRXhwcmVzcyBhbmQgU29ja2V0SU8uXG4gKi9cbmNvbnN0IGRlZmF1bHRGd0NvbmZpZyA9IHtcbiAgcHVibGljRm9sZGVyOiBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3B1YmxpYycpLFxuICB0ZW1wbGF0ZUZvbGRlcjogcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICd2aWV3cycpLFxuICBkZWZhdWx0Q2xpZW50OiAncGxheWVyJyxcbiAgYXNzZXRzRG9tYWluOiAnJywgLy8gb3ZlcnJpZGUgdG8gZG93bmxvYWQgYXNzZXRzIGZyb20gYSBkaWZmZXJlbnQgc2VydmV1ciAobmdpbngpXG4gIHNvY2tldElPOiB7XG4gICAgdXJsOiAnJyxcbiAgICB0cmFuc3BvcnRzOiBbJ3dlYnNvY2tldCddLFxuICAgIHBpbmdUaW1lb3V0OiA2MDAwMCwgLy8gY29uZmlndXJlIGNsaWVudCBzaWRlIHRvbyA/XG4gICAgcGluZ0ludGVydmFsOiA1MDAwMCwgLy8gY29uZmlndXJlIGNsaWVudCBzaWRlIHRvbyA/XG4gICAgLy8gQG5vdGU6IEVuZ2luZUlPIGRlZmF1bHRzXG4gICAgLy8gcGluZ1RpbWVvdXQ6IDMwMDAsXG4gICAgLy8gcGluZ0ludGVydmFsOiAxMDAwLFxuICAgIC8vIHVwZ3JhZGVUaW1lb3V0OiAxMDAwMCxcbiAgICAvLyBtYXhIdHRwQnVmZmVyU2l6ZTogMTBFNyxcbiAgfSxcbiAgZXJyb3JSZXBvcnRlckRpcmVjdG9yeTogJ2xvZ3MvY2xpZW50cycsXG4gIGRiRGlyZWN0b3J5OiAnZGInLFxufTtcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIHBhcmFtZXRlcnMgb2YgdGhlIFNvdW5kd29ya3MgZnJhbWV3b3JrLlxuICogVGhlc2UgcGFyYW1ldGVycyBhbGxvdyBmb3IgY29uZmlndXJpbmcgY29tcG9uZW50cyBvZiB0aGUgZnJhbWV3b3JrIHN1Y2ggYXMgRXhwcmVzcyBhbmQgU29ja2V0SU8uXG4gKi9cbmNvbnN0IGRlZmF1bHRFbnZDb25maWcgPSB7XG4gIHBvcnQ6IDgwMDAsXG4gIG9zYzoge1xuICAgIHJlY2VpdmVBZGRyZXNzOiAnMTI3LjAuMC4xJyxcbiAgICByZWNlaXZlUG9ydDogNTcxMjEsXG4gICAgc2VuZEFkZHJlc3M6ICcxMjcuMC4wLjEnLFxuICAgIHNlbmRQb3J0OiA1NzEyMCxcbiAgfSxcbiAgbG9nZ2VyOiB7XG4gICAgbmFtZTogJ3NvdW5kd29ya3MnLFxuICAgIGxldmVsOiAnaW5mbycsXG4gICAgc3RyZWFtczogW3tcbiAgICAgIGxldmVsOiAnaW5mbycsXG4gICAgICBzdHJlYW06IHByb2Nlc3Muc3Rkb3V0LFxuICAgIH0sIC8qe1xuICAgICAgbGV2ZWw6ICdpbmZvJyxcbiAgICAgIHBhdGg6IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnbG9ncycsICdzb3VuZHdvcmtzLmxvZycpLFxuICAgIH0qL11cbiAgfVxufTtcblxuLyoqXG4gKiBUaGUgYHNlcnZlcmAgb2JqZWN0IGNvbnRhaW5zIHRoZSBiYXNpYyBtZXRob2RzIG9mIHRoZSBzZXJ2ZXIuXG4gKiBGb3IgaW5zdGFuY2UsIHRoaXMgb2JqZWN0IGFsbG93cyBzZXR0aW5nIHVwLCBjb25maWd1cmluZyBhbmQgc3RhcnRpbmcgdGhlIHNlcnZlciB3aXRoIHRoZSBtZXRob2QgYHN0YXJ0YCB3aGlsZSB0aGUgbWV0aG9kIGBtYXBgIGFsbG93cyBmb3IgbWFuYWdpbmcgdGhlIG1hcHBpbmcgYmV0d2VlbiBkaWZmZXJlbnQgdHlwZXMgb2YgY2xpZW50cyBhbmQgdGhlaXIgcmVxdWlyZWQgc2VydmVyIG1vZHVsZXMuXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5leHBvcnQgZGVmYXVsdCB7XG5cbiAgLyoqXG4gICAqIFdlYlNvY2tldCBzZXJ2ZXIuXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBpbzogbnVsbCxcblxuICAvKipcbiAgICogRXhwcmVzcyBhcHBsaWNhdGlvblxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgZXhwcmVzc0FwcDogbnVsbCxcblxuICAvKipcbiAgICogSHR0cCBzZXJ2ZXJcbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG4gIGh0dHBTZXJ2ZXI6IG51bGwsXG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyYXRpb24gaW5mb3JtYXRpb25zLlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgY29uZmlnOiB7fSxcblxuICAvKipcbiAgICogTWFwcGluZyBiZXR3ZWVuIGEgYGNsaWVudFR5cGVgIGFuZCBpdHMgcmVsYXRlZCBhY3Rpdml0aWVzXG4gICAqL1xuICBfY2xpZW50VHlwZUFjdGl2aXRpZXNNYXA6IHt9LFxuXG4gIC8qKlxuICAgKiBBY3Rpdml0aWVzIHRvIGJlIHN0YXJ0ZWRcbiAgICovXG4gIF9hY3Rpdml0aWVzOiBuZXcgU2V0KCksXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIHNlcnZlciB3aXRoIHRoZSBnaXZlbiBjb25maWcgb2JqZWN0cy5cbiAgICogQHRvZG8gLSBtb3ZlIHRoaXMgZG9jIHRvIGNvbmZpZ3VyYXRpb24gb2JqZWN0cy5cbiAgICpcbiAgICogQHBhcmFtIHsuLi5PYmplY3R9IGNvbmZpZ3MgLSBPYmplY3Qgb2YgYXBwbGljYXRpb24gY29uZmlndXJhdGlvbi5cbiAgICpcbiAgICogQHRvZG8gLSByZXdyaXRlIGRvYyBwcm9wZXJseSBmb3IgdGhpcyBtZXRob2QuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbYXBwQ29uZmlnPXt9XSBBcHBsaWNhdGlvbiBjb25maWd1cmF0aW9uIG9wdGlvbnMuXG4gICAqIEBhdHRyaWJ1dGUge1N0cmluZ30gW2FwcENvbmZpZy5wdWJsaWNGb2xkZXI9Jy4vcHVibGljJ10gUGF0aCB0byB0aGUgcHVibGljIGZvbGRlci5cbiAgICogQGF0dHJpYnV0ZSB7T2JqZWN0fSBbYXBwQ29uZmlnLnNvY2tldElPPXt9XSBzb2NrZXQuaW8gb3B0aW9ucy4gVGhlIHNvY2tldC5pbyBjb25maWcgb2JqZWN0IGNhbiBoYXZlIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAgICogLSBgdHJhbnNwb3J0czpTdHJpbmdgOiBjb21tdW5pY2F0aW9uIHRyYW5zcG9ydCAoZGVmYXVsdHMgdG8gYCd3ZWJzb2NrZXQnYCk7XG4gICAqIC0gYHBpbmdUaW1lb3V0Ok51bWJlcmA6IHRpbWVvdXQgKGluIG1pbGxpc2Vjb25kcykgYmVmb3JlIHRyeWluZyB0byByZWVzdGFibGlzaCBhIGNvbm5lY3Rpb24gYmV0d2VlbiBhIGxvc3QgY2xpZW50IGFuZCBhIHNlcnZlciAoZGVmYXV0bHMgdG8gYDYwMDAwYCk7XG4gICAqIC0gYHBpbmdJbnRlcnZhbDpOdW1iZXJgOiB0aW1lIGludGVydmFsIChpbiBtaWxsaXNlY29uZHMpIHRvIHNlbmQgYSBwaW5nIHRvIGEgY2xpZW50IHRvIGNoZWNrIHRoZSBjb25uZWN0aW9uIChkZWZhdWx0cyB0byBgNTAwMDBgKS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtlbnZDb25maWc9e31dIEVudmlyb25tZW50IGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAgICogQGF0dHJpYnV0ZSB7TnVtYmVyfSBbZW52Q29uZmlnLnBvcnQ9ODAwMF0gUG9ydCBvZiB0aGUgSFRUUCBzZXJ2ZXIuXG4gICAqIEBhdHRyaWJ1dGUge09iamVjdH0gW2VudkNvbmZpZy5vc2M9e31dIE9TQyBvcHRpb25zLiBUaGUgT1NDIGNvbmZpZyBvYmplY3QgY2FuIGhhdmUgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICAgKiAtIGBsb2NhbEFkZHJlc3M6U3RyaW5nYDogYWRkcmVzcyBvZiB0aGUgbG9jYWwgbWFjaGluZSB0byByZWNlaXZlIE9TQyBtZXNzYWdlcyAoZGVmYXVsdHMgdG8gYCcxMjcuMC4wLjEnYCk7XG4gICAqIC0gYGxvY2FsUG9ydDpOdW1iZXJgOiBwb3J0IG9mIHRoZSBsb2NhbCBtYWNoaW5lIHRvIHJlY2VpdmUgT1NDIG1lc3NhZ2VzIChkZWZhdWx0cyB0byBgNTcxMjFgKTtcbiAgICogLSBgcmVtb3RlQWRkcmVzczpTdHJpbmdgOiBhZGRyZXNzIG9mIHRoZSBkZXZpY2UgdG8gc2VuZCBkZWZhdWx0IE9TQyBtZXNzYWdlcyB0byAoZGVmYXVsdHMgdG8gYCcxMjcuMC4wLjEnYCk7XG4gICAqIC0gYHJlbW90ZVBvcnQ6TnVtYmVyYDogcG9ydCBvZiB0aGUgZGV2aWNlIHRvIHNlbmQgZGVmYXVsdCBPU0MgbWVzc2FnZXMgdG8gKGRlZmF1bHRzIHRvIGA1NzEyMGApLlxuICAgKi9cbiAgaW5pdCguLi5jb25maWdzKSB7XG4gICAgICAgIC8vIG1lcmdlIGRlZmF1bHQgY29uZmlndXJhdGlvbiBvYmplY3RzXG4gICAgdGhpcy5jb25maWcgPSBPYmplY3QuYXNzaWduKHRoaXMuY29uZmlnLCBleGFtcGxlQXBwQ29uZmlnLCBkZWZhdWx0RndDb25maWcsIGRlZmF1bHRFbnZDb25maWcpO1xuICAgIC8vIG1lcmdlIGdpdmVuIGNvbmZpZ3VyYXRpb25zIG9iamVjdHMgd2l0aCBkZWZhdWx0cyAoMSBsZXZlbCBkZXB0aClcbiAgICBjb25maWdzLmZvckVhY2goKGNvbmZpZykgPT4ge1xuICAgICAgZm9yIChsZXQga2V5IGluIGNvbmZpZykge1xuICAgICAgICBjb25zdCBlbnRyeSA9IGNvbmZpZ1trZXldO1xuICAgICAgICBpZiAodHlwZW9mIGVudHJ5ID09PSAnb2JqZWN0JyAmJiBlbnRyeSAhPT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMuY29uZmlnW2tleV0gPSB0aGlzLmNvbmZpZ1trZXldIHx8wqB7fTtcbiAgICAgICAgICB0aGlzLmNvbmZpZ1trZXldID0gT2JqZWN0LmFzc2lnbih0aGlzLmNvbmZpZ1trZXldLCBlbnRyeSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5jb25maWdba2V5XSA9IGVudHJ5O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBzZXJ2ZXI6XG4gICAqIC0gbGF1bmNoIHRoZSBIVFRQIHNlcnZlci5cbiAgICogLSBsYXVuY2ggdGhlIHNvY2tldCBzZXJ2ZXIuXG4gICAqIC0gc3RhcnQgYWxsIHJlZ2lzdGVyZWQgYWN0aXZpdGllcy5cbiAgICogLSBkZWZpbmUgcm91dGVzIGFuZCBhc3NvY2lhdGUgY2xpZW50IHR5cGVzIGFuZCBhY3Rpdml0aWVzLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBjb25maWd1cmUgZXhwcmVzcyBhbmQgaHR0cCBzZXJ2ZXJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgY29uc3QgZXhwcmVzc0FwcCA9IG5ldyBleHByZXNzKCk7XG4gICAgZXhwcmVzc0FwcC5zZXQoJ3BvcnQnLCBwcm9jZXNzLmVudi5QT1JUIHx8IHRoaXMuY29uZmlnLnBvcnQpO1xuICAgIGV4cHJlc3NBcHAuc2V0KCd2aWV3IGVuZ2luZScsICdlanMnKTtcbiAgICBleHByZXNzQXBwLnVzZShleHByZXNzLnN0YXRpYyh0aGlzLmNvbmZpZy5wdWJsaWNGb2xkZXIpKTtcblxuICAgIGNvbnN0IGh0dHBTZXJ2ZXIgPSBodHRwLmNyZWF0ZVNlcnZlcihleHByZXNzQXBwKTtcbiAgICBodHRwU2VydmVyLmxpc3RlbihleHByZXNzQXBwLmdldCgncG9ydCcpLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHVybCA9IGBodHRwOi8vMTI3LjAuMC4xOiR7ZXhwcmVzc0FwcC5nZXQoJ3BvcnQnKX1gO1xuICAgICAgY29uc29sZS5sb2coJ1tIVFRQIFNFUlZFUl0gU2VydmVyIGxpc3RlbmluZyBvbicsIHVybCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmV4cHJlc3NBcHAgPSBleHByZXNzQXBwO1xuICAgIHRoaXMuaHR0cFNlcnZlciA9IGh0dHBTZXJ2ZXI7XG5cbiAgICB0aGlzLmlvID0gbmV3IElPKGh0dHBTZXJ2ZXIsIHRoaXMuY29uZmlnLnNvY2tldElPKTtcbiAgICBzb2NrZXRzLmluaXRpYWxpemUodGhpcy5pbyk7XG4gICAgbG9nZ2VyLmluaXRpYWxpemUodGhpcy5jb25maWcubG9nZ2VyKTtcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gc3RhcnQgYWxsIGFjdGl2aXRpZXMgYW5kIG1hcCB0aGUgcm91dGVzIChjbGllbnRUeXBlIC8gYWN0aXZpdGllcyBtYXBwaW5nKVxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICB0aGlzLl9hY3Rpdml0aWVzLmZvckVhY2goKGFjdGl2aXR5KSA9PiBhY3Rpdml0eS5zdGFydCgpKTtcblxuICAgIHRoaXMuX2FjdGl2aXRpZXMuZm9yRWFjaCgoYWN0aXZpdHkpID0+IHtcbiAgICAgIHRoaXMuc2V0TWFwKGFjdGl2aXR5LmNsaWVudFR5cGVzLCBhY3Rpdml0eSlcbiAgICB9KTtcblxuICAgIC8vIG1hcCBgY2xpZW50VHlwZWAgdG8gdGhlaXIgcmVzcGVjdGl2ZSBhY3Rpdml0aWVzXG4gICAgZm9yIChsZXQgY2xpZW50VHlwZSBpbiB0aGlzLl9jbGllbnRUeXBlQWN0aXZpdGllc01hcCkge1xuICAgICAgY29uc3QgYWN0aXZpdHkgPSB0aGlzLl9jbGllbnRUeXBlQWN0aXZpdGllc01hcFtjbGllbnRUeXBlXTtcbiAgICAgIHRoaXMuX21hcChjbGllbnRUeXBlLCBhY3Rpdml0eSk7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc2VydmljZSBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIFRoZSBpZGVudGlmaWVyIG9mIHRoZSBzZXJ2aWNlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFRoZSBvcHRpb25zIHRvIGNvbmZpZ3VyZSB0aGUgc2VydmljZS5cbiAgICovXG4gIHJlcXVpcmUoaWQsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gc2VydmVyU2VydmljZU1hbmFnZXIucmVxdWlyZShpZCwgbnVsbCwgb3B0aW9ucyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uIHVzZWQgYnkgYWN0aXZpdGllcyB0byByZWdpc3RlcmVkIHRoZWlyIGNvbmNlcm5lZCBjbGllbnQgdHlwZSBpbnRvIHRoZSBzZXJ2ZXJcbiAgICogQHBhcmFtIHtBcnJheTxTdHJpbmc+fSBjbGllbnRUeXBlcyAtIEFuIGFycmF5IG9mIGNsaWVudCB0eXBlLlxuICAgKiBAcGFyYW0ge0FjdGl2aXR5fSBhY3Rpdml0eSAtIFRoZSBhY3Rpdml0eSBjb25jZXJuZWQgd2l0aCB0aGUgZ2l2ZW4gYGNsaWVudFR5cGVzYC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNldE1hcChjbGllbnRUeXBlcywgYWN0aXZpdHkpIHtcbiAgICBjbGllbnRUeXBlcy5mb3JFYWNoKChjbGllbnRUeXBlKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuX2NsaWVudFR5cGVBY3Rpdml0aWVzTWFwW2NsaWVudFR5cGVdKVxuICAgICAgICB0aGlzLl9jbGllbnRUeXBlQWN0aXZpdGllc01hcFtjbGllbnRUeXBlXSA9IG5ldyBTZXQoKTtcblxuICAgICAgdGhpcy5fY2xpZW50VHlwZUFjdGl2aXRpZXNNYXBbY2xpZW50VHlwZV0uYWRkKGFjdGl2aXR5KTtcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogRnVuY3Rpb24gdXNlZCBieSBhY3Rpdml0aWVzIHRvIHJlZ2lzdGVyIHRoZW1zZWx2ZXMgYXMgYWN0aXZlIGFjdGl2aXRpZXNcbiAgICogQHBhcmFtIHtBY3Rpdml0eX0gYWN0aXZpdHlcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNldEFjdGl2aXR5KGFjdGl2aXR5KSB7XG4gICAgdGhpcy5fYWN0aXZpdGllcy5hZGQoYWN0aXZpdHkpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZSB0aGF0IHRoZSBjbGllbnRzIG9mIHR5cGUgYGNsaWVudFR5cGVgIHJlcXVpcmUgdGhlIG1vZHVsZXMgYC4uLm1vZHVsZXNgIG9uIHRoZSBzZXJ2ZXIgc2lkZS5cbiAgICogQWRkaXRpb25hbGx5LCB0aGlzIG1ldGhvZCByb3V0ZXMgdGhlIGNvbm5lY3Rpb25zIGZyb20gdGhlIGNvcnJlc3BvbmRpbmcgVVJMIHRvIHRoZSBjb3JyZXNwb25kaW5nIHZpZXcuXG4gICAqIE1vcmUgc3BlY2lmaWNhbGx5OlxuICAgKiAtIEEgY2xpZW50IGNvbm5lY3RpbmcgdG8gdGhlIHNlcnZlciB0aHJvdWdoIHRoZSByb290IFVSTCBgaHR0cDovL215LnNlcnZlci5hZGRyZXNzOnBvcnQvYCBpcyBjb25zaWRlcmVkIGFzIGEgYCdwbGF5ZXInYCBjbGllbnQgYW5kIGRpc3BsYXlzIHRoZSB2aWV3IGBwbGF5ZXIuZWpzYDtcbiAgICogLSBBIGNsaWVudCBjb25uZWN0aW5nIHRvIHRoZSBzZXJ2ZXIgdGhyb3VnaCB0aGUgVVJMIGBodHRwOi8vbXkuc2VydmVyLmFkZHJlc3M6cG9ydC9jbGllbnRUeXBlYCBpcyBjb25zaWRlcmVkIGFzIGEgYGNsaWVudFR5cGVgIGNsaWVudCwgYW5kIGRpc3BsYXlzIHRoZSB2aWV3IGBjbGllbnRUeXBlLmVqc2AuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjbGllbnRUeXBlIENsaWVudCB0eXBlIChhcyBkZWZpbmVkIGJ5IHRoZSBtZXRob2Qge0BsaW5rIGNsaWVudC5pbml0fSBvbiB0aGUgY2xpZW50IHNpZGUpLlxuICAgKiBAcGFyYW0gey4uLkNsaWVudE1vZHVsZX0gbW9kdWxlcyBNb2R1bGVzIHRvIG1hcCB0byB0aGF0IGNsaWVudCB0eXBlLlxuICAgKi9cbiAgX21hcChjbGllbnRUeXBlLCBtb2R1bGVzKSB7XG4gICAgLy8gQHRvZG8gLSBhbGxvdyB0byBwYXNzIHNvbWUgdmFyaWFibGUgaW4gdGhlIHVybCAtPiBkZWZpbmUgaG93IGJpbmQgaXQgdG8gc29ja2V0cy4uLlxuICAgIGNvbnN0IHVybCA9IChjbGllbnRUeXBlICE9PSB0aGlzLmNvbmZpZy5kZWZhdWx0Q2xpZW50KSA/IGAvJHtjbGllbnRUeXBlfWAgOiAnLyc7XG5cbiAgICAvLyB1c2UgdGVtcGxhdGUgd2l0aCBgY2xpZW50VHlwZWAgbmFtZSBvciBkZWZhdWx0IGlmIG5vdCBkZWZpbmVkXG4gICAgY29uc3QgY2xpZW50VG1wbCA9IHBhdGguam9pbih0aGlzLmNvbmZpZy50ZW1wbGF0ZUZvbGRlciwgYCR7Y2xpZW50VHlwZX0uZWpzYCk7XG4gICAgY29uc3QgZGVmYXVsdFRtcGwgPSBwYXRoLmpvaW4odGhpcy5jb25maWcudGVtcGxhdGVGb2xkZXIsIGBkZWZhdWx0LmVqc2ApO1xuICAgIGNvbnN0IHRlbXBsYXRlID0gZnMuZXhpc3RzU3luYyhjbGllbnRUbXBsKSA/IGNsaWVudFRtcGwgOiBkZWZhdWx0VG1wbDtcblxuICAgIGNvbnN0IHRtcGxTdHJpbmcgPSBmcy5yZWFkRmlsZVN5bmModGVtcGxhdGUsIHsgZW5jb2Rpbmc6ICd1dGY4JyB9KTtcbiAgICBjb25zdCB0bXBsID0gZWpzLmNvbXBpbGUodG1wbFN0cmluZyk7XG5cbiAgICB0aGlzLmV4cHJlc3NBcHAuZ2V0KHVybCwgKHJlcSwgcmVzKSA9PiB7XG4gICAgICByZXMuc2VuZCh0bXBsKHtcbiAgICAgICAgc29ja2V0SU86IEpTT04uc3RyaW5naWZ5KHRoaXMuY29uZmlnLnNvY2tldElPKSxcbiAgICAgICAgYXBwTmFtZTogdGhpcy5jb25maWcuYXBwTmFtZSxcbiAgICAgICAgY2xpZW50VHlwZTogY2xpZW50VHlwZSxcbiAgICAgICAgZGVmYXVsdFR5cGU6IHRoaXMuY29uZmlnLmRlZmF1bHRDbGllbnQsXG4gICAgICAgIGFzc2V0c0RvbWFpbjogdGhpcy5jb25maWcuYXNzZXRzRG9tYWluLFxuICAgICAgfSkpO1xuICAgIH0pO1xuXG4gICAgLy8gd2FpdCBmb3Igc29ja2V0IGNvbm5uZWN0aW9uXG4gICAgdGhpcy5pby5vZihjbGllbnRUeXBlKS5vbignY29ubmVjdGlvbicsIHRoaXMuX29uQ29ubmVjdGlvbihjbGllbnRUeXBlLCBtb2R1bGVzKSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNvY2tldCBjb25uZWN0aW9uIGNhbGxiYWNrLlxuICAgKi9cbiAgX29uQ29ubmVjdGlvbihjbGllbnRUeXBlLCBhY3Rpdml0aWVzKSB7XG4gICAgcmV0dXJuIChzb2NrZXQpID0+IHtcbiAgICAgIGNvbnN0IGNsaWVudCA9IG5ldyBDbGllbnQoY2xpZW50VHlwZSwgc29ja2V0KTtcbiAgICAgIGFjdGl2aXRpZXMuZm9yRWFjaCgoYWN0aXZpdHkpID0+IGFjdGl2aXR5LmNvbm5lY3QoY2xpZW50KSk7XG5cbiAgICAgIC8vIGdsb2JhbCBsaWZlY3ljbGUgb2YgdGhlIGNsaWVudFxuICAgICAgc29ja2V0cy5yZWNlaXZlKGNsaWVudCwgJ2Rpc2Nvbm5lY3QnLCAoKSA9PiB7XG4gICAgICAgIGFjdGl2aXRpZXMuZm9yRWFjaCgoYWN0aXZpdHkpID0+IGFjdGl2aXR5LmRpc2Nvbm5lY3QoY2xpZW50KSk7XG4gICAgICAgIC8vIEB0b2RvIC0gc2hvdWxkIHJlbW92ZSBhbGwgbGlzdGVuZXJzIG9uIHRoZSBjbGllbnRcbiAgICAgICAgY2xpZW50LmRlc3Ryb3koKTtcbiAgICAgICAgbG9nZ2VyLmluZm8oeyBzb2NrZXQsIGNsaWVudFR5cGUgfSwgJ2Rpc2Nvbm5lY3QnKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBAdG9kbyAtIHJlZmFjdG9yIGhhbmRzaGFrZSBhbmQgdXVpZCBkZWZpbml0aW9uLlxuICAgICAgc29ja2V0cy5zZW5kKGNsaWVudCwgJ2NsaWVudDpzdGFydCcsIGNsaWVudC51dWlkKTsgLy8gdGhlIHNlcnZlciBpcyByZWFkeVxuICAgICAgbG9nZ2VyLmluZm8oeyBzb2NrZXQsIGNsaWVudFR5cGUgfSwgJ2Nvbm5lY3Rpb24nKTtcbiAgICB9XG4gIH0sXG59O1xuIl19