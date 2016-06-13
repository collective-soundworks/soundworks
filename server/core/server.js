'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _Client = require('./Client');

var _Client2 = _interopRequireDefault(_Client);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

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

var _serviceManager = require('./serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _sockets = require('./sockets');

var _sockets2 = _interopRequireDefault(_sockets);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef {Object} module:soundworks/server.server~serverConfig
 * @memberof module:soundworks/server.server
 *
 * @property {String} appName - Name of the application, used in the `.ejs`
 *  template and by default in the `platform` service to populate its view.
 * @property {String} env - Name of the environnement ('production' enable
 *  cache in express application).
 * @property {String} version - Version of application, can be used to force
 *  reload css and js files from server (cf. `html/default.ejs`)
 * @property {String} defaultClient - Name of the default client type,
 *  i.e. the client that can access the application at its root URL
 * @property {String} assetsDomain - Define from where the assets (static files)
 *  should be loaded, these value could also refer to a separate server for
 *  scalability reasons. This value should also be used client-side to configure
 *  the `loader` service.
 * @property {Number} port - Port used to open the http server, in production
 *  this value is typically 80
 *
 * @property {Object} setup - Describe the location where the experience takes
 *  places, theses values are used by the `placer`, `checkin` and `locator`
 *  services. If one of these service is required, this entry mandatory.
 * @property {Object} setup.area - Description of the area.
 * @property {Number} setup.area.width - Width of the area.
 * @property {Number} setup.area.height - Height of the area.
 * @property {String} setup.area.background - Path to an image to be used in
 *  the area representation.
 * @property {Array} setup.labels - Optionnal list of predefined labels.
 * @property {Array} setup.coordinates - Optionnal list of predefined coordinates.
 * @property {Array} setup.maxClientsPerPosition - Maximum number of clients
 *  allowed in a position.
 * @property {Number} setup.capacity - Maximum number of positions (may limit
 * or be limited by the number of labels and/or coordinates).
 *
 * @property {Object} socketIO - Socket.io configuration
 * @property {String} socketIO.url - Optionnal url where the socket should
 *  connect.
 * @property {Array} socketIO.transports - List of the transport mecanims that
 *  should be used to open or emulate the socket.
 *
 * @property {Boolean} useHttps -  Define if the HTTP server should be launched
 *  using secure connections. For development purposes when set to `true` and no
 *  certificates are given (cf. `httpsInfos`), a self-signed certificate is
 *  created.
 * @property {Object} httpsInfos - Paths to the key and certificate to be used
 *  in order to launch the https server. Both entries are required otherwise a
 *  self-signed certificate is generated.
 * @property {String} httpsInfos.cert - Path to the certificate.
 * @property {String} httpsInfos.key - Path to the key.
 *
 * @property {String} password - Password to be used by the `auth` service.
 *
 * @property {Object} osc - Configuration of the `osc` service.
 * @property {String} osc.receiveAddress - IP of the currently running server.
 * @property {Number} osc.receivePort - Port listening for incomming messages.
 * @property {String} osc.sendAddress - IP of the remote application.
 * @property {Number} osc.sendPort - Port where the remote application is
 *  listening for messages
 *
 * @property {Boolean} enableGZipCompression - Define if the server should use
 *  gzip compression for static files.
 * @property {String} publicDirectory - Location of the public directory
 *  (accessible through http(s) requests).
 * @property {String} templateDirectory - Directory where the server templating
 *  system looks for the `ejs` templates.
 * @property {Object} logger - Configuration of the logger service, cf. Bunyan
 *  documentation.
 * @property {String} errorReporterDirectory - Directory where error reported
 *  from the clients are written.
 */

/**
 * Server side entry point for a `soundworks` application.
 *
 * This object hosts configuration informations, as well as methods to
 * initialize and start the application. It is also responsible for creating
 * the static file (http) server as well as the socket server.
 *
 * @memberof module:soundworks/server
 * @namespace
 *
 * @example
 * import * as soundworks from 'soundworks/server';
 * import MyExperience from './MyExperience';
 *
 * soundworks.server.init(config);
 * const myExperience = new MyExperience();
 * soundworks.server.start();
 */
var server = {
  /**
   * SocketIO server.
   * @type {Object}
   * @private
   */
  io: null,

  /**
   * Configuration informations, all config objects passed to the
   * [`server.init`]{@link module:soundworks/server.server.init} are merged
   * into this object.
   * @type {module:soundworks/server.server~serverConfig}
   */
  config: {},

  /**
   * Mapping between a `clientType` and its related activities.
   * @private
   */
  _clientTypeActivitiesMap: {},

  /**
   * Required activities that must be started.
   * @private
   */
  _activities: new _set2.default(),

  /**
   * Optionnal routing defined for each client.
   * @private
   * @type {Object}
   */
  _routes: {},

  _clientConfigDefinition: function _clientConfigDefinition(clientType, serverConfig, httpRequest) {
    return { clientType: clientType };
  },

  /**
   * Map client types with an activity.
   * @param {Array<String>} clientTypes - List of client type.
   * @param {Activity} activity - Activity concerned with the given `clientTypes`.
   * @private
   */
  _setMap: function _setMap(clientTypes, activity) {
    var _this = this;

    clientTypes.forEach(function (clientType) {
      if (!_this._clientTypeActivitiesMap[clientType]) _this._clientTypeActivitiesMap[clientType] = new _set2.default();

      _this._clientTypeActivitiesMap[clientType].add(activity);
    });
  },


  /**
   * Function used by activities to register themselves as active activities
   * @param {Activity} activity - Activity to be registered.
   * @private
   */
  setActivity: function setActivity(activity) {
    this._activities.add(activity);
  },


  /**
   * Return a service configured with the given options.
   * @param {String} id - Identifier of the service.
   * @param {Object} options - Options to configure the service.
   */
  require: function require(id, options) {
    return _serviceManager2.default.require(id, null, options);
  },


  /**
   * Initialize the server with the given config objects.
   * @param {...module:soundworks/server.server~serverConfig} configs -
   *  Configuration of the application.
   */
  init: function init() {
    var _this2 = this;

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
  _populateDefaultConfig: function _populateDefaultConfig() {
    // mandatory configuration options
    if (this.config.port === undefined) this.config.port = 8000;

    if (this.config.enableGZipCompression === undefined) this.config.enableGZipCompression = true;

    if (this.config.publicDirectory === undefined) this.config.publicDirectory = _path2.default.join(process.cwd(), 'public');

    if (this.config.templateDirectory === undefined) this.config.templateDirectory = _path2.default.join(process.cwd(), 'html');

    if (this.config.defaultClient === undefined) this.config.defaultClient = 'player';

    if (this.config.socketIO === undefined) this.config.socketIO = {};
  },


  /**
   * Start the application:
   * - launch the http(s) server.
   * - launch the socket server.
   * - start all registered activities.
   * - define routes and activities mapping for all client types.
   */
  start: function start() {
    var _this3 = this;

    this._populateDefaultConfig();

    if (this.config.logger !== undefined) _logger2.default.initialize(this.config.logger);

    // configure express
    var expressApp = new _express2.default();
    expressApp.set('port', process.env.PORT || this.config.port);
    expressApp.set('view engine', 'ejs');

    // compression
    if (this.config.enableGZipCompression) expressApp.use((0, _compression2.default)());

    // public folder
    expressApp.use(_express2.default.static(this.config.publicDirectory));

    // use https
    var useHttps = this.config.useHttps || false;
    // launch http(s) server
    if (!useHttps) {
      this._runHttpServer(expressApp);
    } else {
      var httpsInfos = this.config.httpsInfos;

      // use given certificate
      if (httpsInfos.key && httpsInfos.cert) {
        var key = _fs2.default.readFileSync(httpsInfos.key);
        var cert = _fs2.default.readFileSync(httpsInfos.cert);

        this._runHttpsServer(expressApp, key, cert);
        // generate certificate on the fly (for development purposes)
      } else {
          _pem2.default.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
            _this3._runHttpsServer(expressApp, keys.serviceKey, keys.certificate);
          });
        }
    }
  },


  /**
   * Register a route for a given `clientType`, allow to define a more complex
   * routing (additionnal route parameters) for a given type of client.
   * @param {String} clientType - Type of the client.
   * @param {String|RegExp} route - Template of the route that should be append.
   *  to the client type
   * @example
   * ```
   * // allow `conductor` clients to connect to `http://site.com/conductor/1`
   * server.registerRoute('conductor', '/:param')
   * ```
   */
  defineRoute: function defineRoute(clientType, route) {
    this._routes[clientType] = route;
  },
  setClientConfigDefinition: function setClientConfigDefinition(func) {
    this._clientConfigDefinition = func;
  },


  /**
   * Launch a http server.
   * @private
   */
  _runHttpServer: function _runHttpServer(expressApp) {
    var httpServer = _http2.default.createServer(expressApp);
    this._initSockets(httpServer);
    this._initActivities(expressApp);

    httpServer.listen(expressApp.get('port'), function () {
      var url = 'http://127.0.0.1:' + expressApp.get('port');
      console.log('[HTTP SERVER] Server listening on', url);
    });
  },


  /**
   * Launch a https server.
   * @private
   */
  _runHttpsServer: function _runHttpsServer(expressApp, key, cert) {
    var httpsServer = _https2.default.createServer({ key: key, cert: cert }, expressApp);
    this._initSockets(httpsServer);
    this._initActivities(expressApp);

    httpsServer.listen(expressApp.get('port'), function () {
      var url = 'https://127.0.0.1:' + expressApp.get('port');
      console.log('[HTTPS SERVER] Server listening on', url);
    });
  },


  /**
   * Init websocket server.
   * @private
   */
  _initSockets: function _initSockets(httpServer) {
    this.io = new _socket2.default(httpServer, this.config.socketIO);

    if (this.config.cordova && this.config.cordova.socketIO) // IO add some configuration options to the object
      this.config.cordova.socketIO = (0, _assign2.default)({}, this.config.socketIO, this.config.cordova.socketIO);

    _sockets2.default.initialize(this.io);
  },


  /**
   * Start all activities and map the routes (clientType / activities mapping).
   * @private
   */
  _initActivities: function _initActivities(expressApp) {
    var _this4 = this;

    this._activities.forEach(function (activity) {
      return activity.start();
    });

    this._activities.forEach(function (activity) {
      _this4._setMap(activity.clientTypes, activity);
    });

    // map `clientType` to their respective activities
    for (var clientType in this._clientTypeActivitiesMap) {
      if (clientType !== this.config.defaultClient) {
        var activities = this._clientTypeActivitiesMap[clientType];
        this._map(clientType, activities, expressApp);
      }
    }

    // make sure `defaultClient` (aka `player`) is mapped last
    for (var _clientType in this._clientTypeActivitiesMap) {
      if (_clientType === this.config.defaultClient) {
        var _activities = this._clientTypeActivitiesMap[_clientType];
        this._map(_clientType, _activities, expressApp);
      }
    }
  },


  /**
   * Map a client type to a route, a set of activities.
   * Additionnally listen for their socket connection.
   * @private
   */
  _map: function _map(clientType, activities, expressApp) {
    var _this5 = this;

    var route = '';

    if (this._routes[clientType]) route += this._routes[clientType];

    if (clientType !== this.config.defaultClient) route = '/' + clientType + route;

    // define template filename: `${clientType}.ejs` or `default.ejs`
    var templateDirectory = this.config.templateDirectory;
    var clientTmpl = _path2.default.join(templateDirectory, clientType + '.ejs');
    var defaultTmpl = _path2.default.join(templateDirectory, 'default.ejs');

    _fs2.default.stat(clientTmpl, function (err, stats) {
      var template = void 0;

      if (err || !stats.isFile()) template = defaultTmpl;else template = clientTmpl;

      var tmplString = _fs2.default.readFileSync(template, { encoding: 'utf8' });
      var tmpl = _ejs2.default.compile(tmplString);

      // http request
      expressApp.get(route, function (req, res) {
        var data = _this5._clientConfigDefinition(clientType, _this5.config, req);
        var appIndex = tmpl({ data: data });
        res.send(appIndex);
      });

      // socket connnection
      _this5.io.of(clientType).on('connection', function (socket) {
        _this5._onSocketConnection(clientType, socket, activities);
      });
    });
  },


  /**
   * Socket connection callback.
   * @private
   */
  _onSocketConnection: function _onSocketConnection(clientType, socket, activities) {
    var client = new _Client2.default(clientType, socket);

    // global lifecycle of the client
    _sockets2.default.receive(client, 'disconnect', function () {
      activities.forEach(function (activity) {
        return activity.disconnect(client);
      });
      client.destroy();

      if (_logger2.default.info) _logger2.default.info({ socket: socket, clientType: clientType }, 'disconnect');
    });

    _sockets2.default.receive(client, 'handshake', function (data) {
      client.urlParams = data.urlParams;
      // @todo - handle reconnection (ex: `data` contains an `uuid`)
      activities.forEach(function (activity) {
        return activity.connect(client);
      });
      _sockets2.default.send(client, 'client:start', client.uuid);

      if (_logger2.default.info) _logger2.default.info({ socket: socket, clientType: clientType }, 'handshake');
    });
  }
};

exports.default = server;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE0RkEsSUFBTSxTQUFTOzs7Ozs7QUFNYixNQUFJLElBTlM7Ozs7Ozs7O0FBY2IsVUFBUSxFQWRLOzs7Ozs7QUFvQmIsNEJBQTBCLEVBcEJiOzs7Ozs7QUEwQmIsZUFBYSxtQkExQkE7Ozs7Ozs7QUFpQ2IsV0FBUyxFQWpDSTs7QUFvQ2IsMkJBQXlCLGlDQUFDLFVBQUQsRUFBYSxZQUFiLEVBQTJCLFdBQTNCLEVBQTJDO0FBQ2xFLFdBQU8sRUFBRSxzQkFBRixFQUFQO0FBQ0QsR0F0Q1k7Ozs7Ozs7O0FBOENiLFNBOUNhLG1CQThDTCxXQTlDSyxFQThDUSxRQTlDUixFQThDa0I7QUFBQTs7QUFDN0IsZ0JBQVksT0FBWixDQUFvQixVQUFDLFVBQUQsRUFBZ0I7QUFDbEMsVUFBSSxDQUFDLE1BQUssd0JBQUwsQ0FBOEIsVUFBOUIsQ0FBTCxFQUNFLE1BQUssd0JBQUwsQ0FBOEIsVUFBOUIsSUFBNEMsbUJBQTVDOztBQUVGLFlBQUssd0JBQUwsQ0FBOEIsVUFBOUIsRUFBMEMsR0FBMUMsQ0FBOEMsUUFBOUM7QUFDRCxLQUxEO0FBTUQsR0FyRFk7Ozs7Ozs7O0FBNERiLGFBNURhLHVCQTRERCxRQTVEQyxFQTREUztBQUNwQixTQUFLLFdBQUwsQ0FBaUIsR0FBakIsQ0FBcUIsUUFBckI7QUFDRCxHQTlEWTs7Ozs7Ozs7QUFxRWIsU0FyRWEsbUJBcUVMLEVBckVLLEVBcUVELE9BckVDLEVBcUVRO0FBQ25CLFdBQU8seUJBQWUsT0FBZixDQUF1QixFQUF2QixFQUEyQixJQUEzQixFQUFpQyxPQUFqQyxDQUFQO0FBQ0QsR0F2RVk7Ozs7Ozs7O0FBOEViLE1BOUVhLGtCQThFSTtBQUFBOztBQUFBLHNDQUFULE9BQVM7QUFBVCxhQUFTO0FBQUE7O0FBQ2YsWUFBUSxPQUFSLENBQWdCLFVBQUMsTUFBRCxFQUFZO0FBQzFCLFdBQUssSUFBSSxHQUFULElBQWdCLE1BQWhCLEVBQXdCO0FBQ3RCLFlBQU0sUUFBUSxPQUFPLEdBQVAsQ0FBZDs7QUFFQSxZQUFJLFFBQU8sS0FBUCx1REFBTyxLQUFQLE9BQWlCLFFBQWpCLElBQTZCLFVBQVUsSUFBM0MsRUFBaUQ7QUFDL0MsaUJBQUssTUFBTCxDQUFZLEdBQVosSUFBbUIsT0FBSyxNQUFMLENBQVksR0FBWixLQUFvQixFQUF2QztBQUNBLGlCQUFLLE1BQUwsQ0FBWSxHQUFaLElBQW1CLHNCQUFjLE9BQUssTUFBTCxDQUFZLEdBQVosQ0FBZCxFQUFnQyxLQUFoQyxDQUFuQjtBQUNELFNBSEQsTUFHTztBQUNMLGlCQUFLLE1BQUwsQ0FBWSxHQUFaLElBQW1CLEtBQW5CO0FBQ0Q7QUFDRjtBQUNGLEtBWEQ7QUFZRCxHQTNGWTtBQTZGYix3QkE3RmEsb0NBNkZZOztBQUV2QixRQUFJLEtBQUssTUFBTCxDQUFZLElBQVosS0FBcUIsU0FBekIsRUFDRyxLQUFLLE1BQUwsQ0FBWSxJQUFaLEdBQW1CLElBQW5COztBQUVILFFBQUksS0FBSyxNQUFMLENBQVkscUJBQVosS0FBc0MsU0FBMUMsRUFDRSxLQUFLLE1BQUwsQ0FBWSxxQkFBWixHQUFvQyxJQUFwQzs7QUFFRixRQUFJLEtBQUssTUFBTCxDQUFZLGVBQVosS0FBZ0MsU0FBcEMsRUFDRSxLQUFLLE1BQUwsQ0FBWSxlQUFaLEdBQThCLGVBQUssSUFBTCxDQUFVLFFBQVEsR0FBUixFQUFWLEVBQXlCLFFBQXpCLENBQTlCOztBQUVGLFFBQUksS0FBSyxNQUFMLENBQVksaUJBQVosS0FBa0MsU0FBdEMsRUFDRSxLQUFLLE1BQUwsQ0FBWSxpQkFBWixHQUFnQyxlQUFLLElBQUwsQ0FBVSxRQUFRLEdBQVIsRUFBVixFQUF5QixNQUF6QixDQUFoQzs7QUFFRixRQUFJLEtBQUssTUFBTCxDQUFZLGFBQVosS0FBOEIsU0FBbEMsRUFDRSxLQUFLLE1BQUwsQ0FBWSxhQUFaLEdBQTRCLFFBQTVCOztBQUVGLFFBQUksS0FBSyxNQUFMLENBQVksUUFBWixLQUF5QixTQUE3QixFQUNFLEtBQUssTUFBTCxDQUFZLFFBQVosR0FBdUIsRUFBdkI7QUFDSCxHQWhIWTs7Ozs7Ozs7OztBQXlIYixPQXpIYSxtQkF5SEw7QUFBQTs7QUFDTixTQUFLLHNCQUFMOztBQUVBLFFBQUksS0FBSyxNQUFMLENBQVksTUFBWixLQUF1QixTQUEzQixFQUNFLGlCQUFPLFVBQVAsQ0FBa0IsS0FBSyxNQUFMLENBQVksTUFBOUI7OztBQUdGLFFBQU0sYUFBYSx1QkFBbkI7QUFDQSxlQUFXLEdBQVgsQ0FBZSxNQUFmLEVBQXVCLFFBQVEsR0FBUixDQUFZLElBQVosSUFBb0IsS0FBSyxNQUFMLENBQVksSUFBdkQ7QUFDQSxlQUFXLEdBQVgsQ0FBZSxhQUFmLEVBQThCLEtBQTlCOzs7QUFHQSxRQUFJLEtBQUssTUFBTCxDQUFZLHFCQUFoQixFQUNFLFdBQVcsR0FBWCxDQUFlLDRCQUFmOzs7QUFHRixlQUFXLEdBQVgsQ0FBZSxrQkFBUSxNQUFSLENBQWUsS0FBSyxNQUFMLENBQVksZUFBM0IsQ0FBZjs7O0FBR0EsUUFBTSxXQUFXLEtBQUssTUFBTCxDQUFZLFFBQVosSUFBd0IsS0FBekM7O0FBRUEsUUFBSSxDQUFDLFFBQUwsRUFBZTtBQUNiLFdBQUssY0FBTCxDQUFvQixVQUFwQjtBQUNELEtBRkQsTUFFTztBQUNMLFVBQU0sYUFBYSxLQUFLLE1BQUwsQ0FBWSxVQUEvQjs7O0FBR0EsVUFBSSxXQUFXLEdBQVgsSUFBa0IsV0FBVyxJQUFqQyxFQUF1QztBQUNyQyxZQUFNLE1BQU0sYUFBRyxZQUFILENBQWdCLFdBQVcsR0FBM0IsQ0FBWjtBQUNBLFlBQU0sT0FBTyxhQUFHLFlBQUgsQ0FBZ0IsV0FBVyxJQUEzQixDQUFiOztBQUVBLGFBQUssZUFBTCxDQUFxQixVQUFyQixFQUFpQyxHQUFqQyxFQUFzQyxJQUF0Qzs7QUFFRCxPQU5ELE1BTU87QUFDTCx3QkFBSSxpQkFBSixDQUFzQixFQUFFLE1BQU0sQ0FBUixFQUFXLFlBQVksSUFBdkIsRUFBdEIsRUFBcUQsVUFBQyxHQUFELEVBQU0sSUFBTixFQUFlO0FBQ2xFLG1CQUFLLGVBQUwsQ0FBcUIsVUFBckIsRUFBaUMsS0FBSyxVQUF0QyxFQUFrRCxLQUFLLFdBQXZEO0FBQ0QsV0FGRDtBQUdEO0FBQ0Y7QUFDRixHQWhLWTs7Ozs7Ozs7Ozs7Ozs7O0FBOEtiLGFBOUthLHVCQThLRCxVQTlLQyxFQThLVyxLQTlLWCxFQThLa0I7QUFDN0IsU0FBSyxPQUFMLENBQWEsVUFBYixJQUEyQixLQUEzQjtBQUNELEdBaExZO0FBbUxiLDJCQW5MYSxxQ0FtTGEsSUFuTGIsRUFtTG1CO0FBQzlCLFNBQUssdUJBQUwsR0FBK0IsSUFBL0I7QUFDRCxHQXJMWTs7Ozs7OztBQTJMYixnQkEzTGEsMEJBMkxFLFVBM0xGLEVBMkxjO0FBQ3pCLFFBQU0sYUFBYSxlQUFLLFlBQUwsQ0FBa0IsVUFBbEIsQ0FBbkI7QUFDQSxTQUFLLFlBQUwsQ0FBa0IsVUFBbEI7QUFDQSxTQUFLLGVBQUwsQ0FBcUIsVUFBckI7O0FBRUEsZUFBVyxNQUFYLENBQWtCLFdBQVcsR0FBWCxDQUFlLE1BQWYsQ0FBbEIsRUFBMEMsWUFBVztBQUNuRCxVQUFNLDRCQUEwQixXQUFXLEdBQVgsQ0FBZSxNQUFmLENBQWhDO0FBQ0EsY0FBUSxHQUFSLENBQVksbUNBQVosRUFBaUQsR0FBakQ7QUFDRCxLQUhEO0FBSUQsR0FwTVk7Ozs7Ozs7QUEwTWIsaUJBMU1hLDJCQTBNRyxVQTFNSCxFQTBNZSxHQTFNZixFQTBNb0IsSUExTXBCLEVBME0wQjtBQUNyQyxRQUFNLGNBQWMsZ0JBQU0sWUFBTixDQUFtQixFQUFFLFFBQUYsRUFBTyxVQUFQLEVBQW5CLEVBQWtDLFVBQWxDLENBQXBCO0FBQ0EsU0FBSyxZQUFMLENBQWtCLFdBQWxCO0FBQ0EsU0FBSyxlQUFMLENBQXFCLFVBQXJCOztBQUVBLGdCQUFZLE1BQVosQ0FBbUIsV0FBVyxHQUFYLENBQWUsTUFBZixDQUFuQixFQUEyQyxZQUFXO0FBQ3BELFVBQU0sNkJBQTJCLFdBQVcsR0FBWCxDQUFlLE1BQWYsQ0FBakM7QUFDQSxjQUFRLEdBQVIsQ0FBWSxvQ0FBWixFQUFrRCxHQUFsRDtBQUNELEtBSEQ7QUFJRCxHQW5OWTs7Ozs7OztBQXlOYixjQXpOYSx3QkF5TkEsVUF6TkEsRUF5Tlk7QUFDdkIsU0FBSyxFQUFMLEdBQVUscUJBQU8sVUFBUCxFQUFtQixLQUFLLE1BQUwsQ0FBWSxRQUEvQixDQUFWOztBQUVBLFFBQUksS0FBSyxNQUFMLENBQVksT0FBWixJQUF1QixLQUFLLE1BQUwsQ0FBWSxPQUFaLENBQW9CLFFBQS9DLEU7QUFDRSxXQUFLLE1BQUwsQ0FBWSxPQUFaLENBQW9CLFFBQXBCLEdBQStCLHNCQUFjLEVBQWQsRUFBa0IsS0FBSyxNQUFMLENBQVksUUFBOUIsRUFBd0MsS0FBSyxNQUFMLENBQVksT0FBWixDQUFvQixRQUE1RCxDQUEvQjs7QUFFRixzQkFBUSxVQUFSLENBQW1CLEtBQUssRUFBeEI7QUFDRCxHQWhPWTs7Ozs7OztBQXNPYixpQkF0T2EsMkJBc09HLFVBdE9ILEVBc09lO0FBQUE7O0FBQzFCLFNBQUssV0FBTCxDQUFpQixPQUFqQixDQUF5QixVQUFDLFFBQUQ7QUFBQSxhQUFjLFNBQVMsS0FBVCxFQUFkO0FBQUEsS0FBekI7O0FBRUEsU0FBSyxXQUFMLENBQWlCLE9BQWpCLENBQXlCLFVBQUMsUUFBRCxFQUFjO0FBQ3JDLGFBQUssT0FBTCxDQUFhLFNBQVMsV0FBdEIsRUFBbUMsUUFBbkM7QUFDRCxLQUZEOzs7QUFLQSxTQUFLLElBQUksVUFBVCxJQUF1QixLQUFLLHdCQUE1QixFQUFzRDtBQUNwRCxVQUFJLGVBQWUsS0FBSyxNQUFMLENBQVksYUFBL0IsRUFBOEM7QUFDNUMsWUFBTSxhQUFhLEtBQUssd0JBQUwsQ0FBOEIsVUFBOUIsQ0FBbkI7QUFDQSxhQUFLLElBQUwsQ0FBVSxVQUFWLEVBQXNCLFVBQXRCLEVBQWtDLFVBQWxDO0FBQ0Q7QUFDRjs7O0FBR0QsU0FBSyxJQUFJLFdBQVQsSUFBdUIsS0FBSyx3QkFBNUIsRUFBc0Q7QUFDcEQsVUFBSSxnQkFBZSxLQUFLLE1BQUwsQ0FBWSxhQUEvQixFQUE4QztBQUM1QyxZQUFNLGNBQWEsS0FBSyx3QkFBTCxDQUE4QixXQUE5QixDQUFuQjtBQUNBLGFBQUssSUFBTCxDQUFVLFdBQVYsRUFBc0IsV0FBdEIsRUFBa0MsVUFBbEM7QUFDRDtBQUNGO0FBQ0YsR0E1UFk7Ozs7Ozs7O0FBbVFiLE1BblFhLGdCQW1RUixVQW5RUSxFQW1RSSxVQW5RSixFQW1RZ0IsVUFuUWhCLEVBbVE0QjtBQUFBOztBQUN2QyxRQUFJLFFBQVEsRUFBWjs7QUFFQSxRQUFJLEtBQUssT0FBTCxDQUFhLFVBQWIsQ0FBSixFQUNFLFNBQVMsS0FBSyxPQUFMLENBQWEsVUFBYixDQUFUOztBQUVGLFFBQUksZUFBZSxLQUFLLE1BQUwsQ0FBWSxhQUEvQixFQUNFLGNBQVksVUFBWixHQUF5QixLQUF6Qjs7O0FBR0YsUUFBTSxvQkFBb0IsS0FBSyxNQUFMLENBQVksaUJBQXRDO0FBQ0EsUUFBTSxhQUFhLGVBQUssSUFBTCxDQUFVLGlCQUFWLEVBQWdDLFVBQWhDLFVBQW5CO0FBQ0EsUUFBTSxjQUFjLGVBQUssSUFBTCxDQUFVLGlCQUFWLGdCQUFwQjs7QUFFQSxpQkFBRyxJQUFILENBQVEsVUFBUixFQUFvQixVQUFDLEdBQUQsRUFBTSxLQUFOLEVBQWdCO0FBQ2xDLFVBQUksaUJBQUo7O0FBRUEsVUFBSSxPQUFPLENBQUMsTUFBTSxNQUFOLEVBQVosRUFDRSxXQUFXLFdBQVgsQ0FERixLQUdFLFdBQVcsVUFBWDs7QUFFRixVQUFNLGFBQWEsYUFBRyxZQUFILENBQWdCLFFBQWhCLEVBQTBCLEVBQUUsVUFBVSxNQUFaLEVBQTFCLENBQW5CO0FBQ0EsVUFBTSxPQUFPLGNBQUksT0FBSixDQUFZLFVBQVosQ0FBYjs7O0FBR0EsaUJBQVcsR0FBWCxDQUFlLEtBQWYsRUFBc0IsVUFBQyxHQUFELEVBQU0sR0FBTixFQUFjO0FBQ2xDLFlBQU0sT0FBTyxPQUFLLHVCQUFMLENBQTZCLFVBQTdCLEVBQXlDLE9BQUssTUFBOUMsRUFBc0QsR0FBdEQsQ0FBYjtBQUNBLFlBQU0sV0FBVyxLQUFLLEVBQUUsVUFBRixFQUFMLENBQWpCO0FBQ0EsWUFBSSxJQUFKLENBQVMsUUFBVDtBQUNELE9BSkQ7OztBQU9BLGFBQUssRUFBTCxDQUFRLEVBQVIsQ0FBVyxVQUFYLEVBQXVCLEVBQXZCLENBQTBCLFlBQTFCLEVBQXdDLFVBQUMsTUFBRCxFQUFZO0FBQ2xELGVBQUssbUJBQUwsQ0FBeUIsVUFBekIsRUFBcUMsTUFBckMsRUFBNkMsVUFBN0M7QUFDRCxPQUZEO0FBR0QsS0F0QkQ7QUF1QkQsR0F4U1k7Ozs7Ozs7QUE4U2IscUJBOVNhLCtCQThTTyxVQTlTUCxFQThTbUIsTUE5U25CLEVBOFMyQixVQTlTM0IsRUE4U3VDO0FBQ2xELFFBQU0sU0FBUyxxQkFBVyxVQUFYLEVBQXVCLE1BQXZCLENBQWY7OztBQUdBLHNCQUFRLE9BQVIsQ0FBZ0IsTUFBaEIsRUFBd0IsWUFBeEIsRUFBc0MsWUFBTTtBQUMxQyxpQkFBVyxPQUFYLENBQW1CLFVBQUMsUUFBRDtBQUFBLGVBQWMsU0FBUyxVQUFULENBQW9CLE1BQXBCLENBQWQ7QUFBQSxPQUFuQjtBQUNBLGFBQU8sT0FBUDs7QUFFQSxVQUFJLGlCQUFPLElBQVgsRUFDRSxpQkFBTyxJQUFQLENBQVksRUFBRSxjQUFGLEVBQVUsc0JBQVYsRUFBWixFQUFvQyxZQUFwQztBQUNILEtBTkQ7O0FBUUEsc0JBQVEsT0FBUixDQUFnQixNQUFoQixFQUF3QixXQUF4QixFQUFxQyxVQUFDLElBQUQsRUFBVTtBQUM3QyxhQUFPLFNBQVAsR0FBbUIsS0FBSyxTQUF4Qjs7QUFFQSxpQkFBVyxPQUFYLENBQW1CLFVBQUMsUUFBRDtBQUFBLGVBQWMsU0FBUyxPQUFULENBQWlCLE1BQWpCLENBQWQ7QUFBQSxPQUFuQjtBQUNBLHdCQUFRLElBQVIsQ0FBYSxNQUFiLEVBQXFCLGNBQXJCLEVBQXFDLE9BQU8sSUFBNUM7O0FBRUEsVUFBSSxpQkFBTyxJQUFYLEVBQ0UsaUJBQU8sSUFBUCxDQUFZLEVBQUUsY0FBRixFQUFVLHNCQUFWLEVBQVosRUFBb0MsV0FBcEM7QUFDSCxLQVJEO0FBU0Q7QUFuVVksQ0FBZjs7a0JBc1VlLE0iLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENsaWVudCBmcm9tICcuL0NsaWVudCc7XG5pbXBvcnQgY29tcHJlc3Npb24gZnJvbSAnY29tcHJlc3Npb24nO1xuaW1wb3J0IGVqcyBmcm9tICdlanMnO1xuaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IGh0dHAgZnJvbSAnaHR0cCc7XG5pbXBvcnQgaHR0cHMgZnJvbSAnaHR0cHMnO1xuaW1wb3J0IElPIGZyb20gJ3NvY2tldC5pbyc7XG5pbXBvcnQgbG9nZ2VyIGZyb20gJy4uL3V0aWxzL2xvZ2dlcic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBwZW0gZnJvbSAncGVtJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBzb2NrZXRzIGZyb20gJy4vc29ja2V0cyc7XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLnNlcnZlcn5zZXJ2ZXJDb25maWdcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuc2VydmVyXG4gKlxuICogQHByb3BlcnR5IHtTdHJpbmd9IGFwcE5hbWUgLSBOYW1lIG9mIHRoZSBhcHBsaWNhdGlvbiwgdXNlZCBpbiB0aGUgYC5lanNgXG4gKiAgdGVtcGxhdGUgYW5kIGJ5IGRlZmF1bHQgaW4gdGhlIGBwbGF0Zm9ybWAgc2VydmljZSB0byBwb3B1bGF0ZSBpdHMgdmlldy5cbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBlbnYgLSBOYW1lIG9mIHRoZSBlbnZpcm9ubmVtZW50ICgncHJvZHVjdGlvbicgZW5hYmxlXG4gKiAgY2FjaGUgaW4gZXhwcmVzcyBhcHBsaWNhdGlvbikuXG4gKiBAcHJvcGVydHkge1N0cmluZ30gdmVyc2lvbiAtIFZlcnNpb24gb2YgYXBwbGljYXRpb24sIGNhbiBiZSB1c2VkIHRvIGZvcmNlXG4gKiAgcmVsb2FkIGNzcyBhbmQganMgZmlsZXMgZnJvbSBzZXJ2ZXIgKGNmLiBgaHRtbC9kZWZhdWx0LmVqc2ApXG4gKiBAcHJvcGVydHkge1N0cmluZ30gZGVmYXVsdENsaWVudCAtIE5hbWUgb2YgdGhlIGRlZmF1bHQgY2xpZW50IHR5cGUsXG4gKiAgaS5lLiB0aGUgY2xpZW50IHRoYXQgY2FuIGFjY2VzcyB0aGUgYXBwbGljYXRpb24gYXQgaXRzIHJvb3QgVVJMXG4gKiBAcHJvcGVydHkge1N0cmluZ30gYXNzZXRzRG9tYWluIC0gRGVmaW5lIGZyb20gd2hlcmUgdGhlIGFzc2V0cyAoc3RhdGljIGZpbGVzKVxuICogIHNob3VsZCBiZSBsb2FkZWQsIHRoZXNlIHZhbHVlIGNvdWxkIGFsc28gcmVmZXIgdG8gYSBzZXBhcmF0ZSBzZXJ2ZXIgZm9yXG4gKiAgc2NhbGFiaWxpdHkgcmVhc29ucy4gVGhpcyB2YWx1ZSBzaG91bGQgYWxzbyBiZSB1c2VkIGNsaWVudC1zaWRlIHRvIGNvbmZpZ3VyZVxuICogIHRoZSBgbG9hZGVyYCBzZXJ2aWNlLlxuICogQHByb3BlcnR5IHtOdW1iZXJ9IHBvcnQgLSBQb3J0IHVzZWQgdG8gb3BlbiB0aGUgaHR0cCBzZXJ2ZXIsIGluIHByb2R1Y3Rpb25cbiAqICB0aGlzIHZhbHVlIGlzIHR5cGljYWxseSA4MFxuICpcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBzZXR1cCAtIERlc2NyaWJlIHRoZSBsb2NhdGlvbiB3aGVyZSB0aGUgZXhwZXJpZW5jZSB0YWtlc1xuICogIHBsYWNlcywgdGhlc2VzIHZhbHVlcyBhcmUgdXNlZCBieSB0aGUgYHBsYWNlcmAsIGBjaGVja2luYCBhbmQgYGxvY2F0b3JgXG4gKiAgc2VydmljZXMuIElmIG9uZSBvZiB0aGVzZSBzZXJ2aWNlIGlzIHJlcXVpcmVkLCB0aGlzIGVudHJ5IG1hbmRhdG9yeS5cbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBzZXR1cC5hcmVhIC0gRGVzY3JpcHRpb24gb2YgdGhlIGFyZWEuXG4gKiBAcHJvcGVydHkge051bWJlcn0gc2V0dXAuYXJlYS53aWR0aCAtIFdpZHRoIG9mIHRoZSBhcmVhLlxuICogQHByb3BlcnR5IHtOdW1iZXJ9IHNldHVwLmFyZWEuaGVpZ2h0IC0gSGVpZ2h0IG9mIHRoZSBhcmVhLlxuICogQHByb3BlcnR5IHtTdHJpbmd9IHNldHVwLmFyZWEuYmFja2dyb3VuZCAtIFBhdGggdG8gYW4gaW1hZ2UgdG8gYmUgdXNlZCBpblxuICogIHRoZSBhcmVhIHJlcHJlc2VudGF0aW9uLlxuICogQHByb3BlcnR5IHtBcnJheX0gc2V0dXAubGFiZWxzIC0gT3B0aW9ubmFsIGxpc3Qgb2YgcHJlZGVmaW5lZCBsYWJlbHMuXG4gKiBAcHJvcGVydHkge0FycmF5fSBzZXR1cC5jb29yZGluYXRlcyAtIE9wdGlvbm5hbCBsaXN0IG9mIHByZWRlZmluZWQgY29vcmRpbmF0ZXMuXG4gKiBAcHJvcGVydHkge0FycmF5fSBzZXR1cC5tYXhDbGllbnRzUGVyUG9zaXRpb24gLSBNYXhpbXVtIG51bWJlciBvZiBjbGllbnRzXG4gKiAgYWxsb3dlZCBpbiBhIHBvc2l0aW9uLlxuICogQHByb3BlcnR5IHtOdW1iZXJ9IHNldHVwLmNhcGFjaXR5IC0gTWF4aW11bSBudW1iZXIgb2YgcG9zaXRpb25zIChtYXkgbGltaXRcbiAqIG9yIGJlIGxpbWl0ZWQgYnkgdGhlIG51bWJlciBvZiBsYWJlbHMgYW5kL29yIGNvb3JkaW5hdGVzKS5cbiAqXG4gKiBAcHJvcGVydHkge09iamVjdH0gc29ja2V0SU8gLSBTb2NrZXQuaW8gY29uZmlndXJhdGlvblxuICogQHByb3BlcnR5IHtTdHJpbmd9IHNvY2tldElPLnVybCAtIE9wdGlvbm5hbCB1cmwgd2hlcmUgdGhlIHNvY2tldCBzaG91bGRcbiAqICBjb25uZWN0LlxuICogQHByb3BlcnR5IHtBcnJheX0gc29ja2V0SU8udHJhbnNwb3J0cyAtIExpc3Qgb2YgdGhlIHRyYW5zcG9ydCBtZWNhbmltcyB0aGF0XG4gKiAgc2hvdWxkIGJlIHVzZWQgdG8gb3BlbiBvciBlbXVsYXRlIHRoZSBzb2NrZXQuXG4gKlxuICogQHByb3BlcnR5IHtCb29sZWFufSB1c2VIdHRwcyAtICBEZWZpbmUgaWYgdGhlIEhUVFAgc2VydmVyIHNob3VsZCBiZSBsYXVuY2hlZFxuICogIHVzaW5nIHNlY3VyZSBjb25uZWN0aW9ucy4gRm9yIGRldmVsb3BtZW50IHB1cnBvc2VzIHdoZW4gc2V0IHRvIGB0cnVlYCBhbmQgbm9cbiAqICBjZXJ0aWZpY2F0ZXMgYXJlIGdpdmVuIChjZi4gYGh0dHBzSW5mb3NgKSwgYSBzZWxmLXNpZ25lZCBjZXJ0aWZpY2F0ZSBpc1xuICogIGNyZWF0ZWQuXG4gKiBAcHJvcGVydHkge09iamVjdH0gaHR0cHNJbmZvcyAtIFBhdGhzIHRvIHRoZSBrZXkgYW5kIGNlcnRpZmljYXRlIHRvIGJlIHVzZWRcbiAqICBpbiBvcmRlciB0byBsYXVuY2ggdGhlIGh0dHBzIHNlcnZlci4gQm90aCBlbnRyaWVzIGFyZSByZXF1aXJlZCBvdGhlcndpc2UgYVxuICogIHNlbGYtc2lnbmVkIGNlcnRpZmljYXRlIGlzIGdlbmVyYXRlZC5cbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBodHRwc0luZm9zLmNlcnQgLSBQYXRoIHRvIHRoZSBjZXJ0aWZpY2F0ZS5cbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBodHRwc0luZm9zLmtleSAtIFBhdGggdG8gdGhlIGtleS5cbiAqXG4gKiBAcHJvcGVydHkge1N0cmluZ30gcGFzc3dvcmQgLSBQYXNzd29yZCB0byBiZSB1c2VkIGJ5IHRoZSBgYXV0aGAgc2VydmljZS5cbiAqXG4gKiBAcHJvcGVydHkge09iamVjdH0gb3NjIC0gQ29uZmlndXJhdGlvbiBvZiB0aGUgYG9zY2Agc2VydmljZS5cbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBvc2MucmVjZWl2ZUFkZHJlc3MgLSBJUCBvZiB0aGUgY3VycmVudGx5IHJ1bm5pbmcgc2VydmVyLlxuICogQHByb3BlcnR5IHtOdW1iZXJ9IG9zYy5yZWNlaXZlUG9ydCAtIFBvcnQgbGlzdGVuaW5nIGZvciBpbmNvbW1pbmcgbWVzc2FnZXMuXG4gKiBAcHJvcGVydHkge1N0cmluZ30gb3NjLnNlbmRBZGRyZXNzIC0gSVAgb2YgdGhlIHJlbW90ZSBhcHBsaWNhdGlvbi5cbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBvc2Muc2VuZFBvcnQgLSBQb3J0IHdoZXJlIHRoZSByZW1vdGUgYXBwbGljYXRpb24gaXNcbiAqICBsaXN0ZW5pbmcgZm9yIG1lc3NhZ2VzXG4gKlxuICogQHByb3BlcnR5IHtCb29sZWFufSBlbmFibGVHWmlwQ29tcHJlc3Npb24gLSBEZWZpbmUgaWYgdGhlIHNlcnZlciBzaG91bGQgdXNlXG4gKiAgZ3ppcCBjb21wcmVzc2lvbiBmb3Igc3RhdGljIGZpbGVzLlxuICogQHByb3BlcnR5IHtTdHJpbmd9IHB1YmxpY0RpcmVjdG9yeSAtIExvY2F0aW9uIG9mIHRoZSBwdWJsaWMgZGlyZWN0b3J5XG4gKiAgKGFjY2Vzc2libGUgdGhyb3VnaCBodHRwKHMpIHJlcXVlc3RzKS5cbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSB0ZW1wbGF0ZURpcmVjdG9yeSAtIERpcmVjdG9yeSB3aGVyZSB0aGUgc2VydmVyIHRlbXBsYXRpbmdcbiAqICBzeXN0ZW0gbG9va3MgZm9yIHRoZSBgZWpzYCB0ZW1wbGF0ZXMuXG4gKiBAcHJvcGVydHkge09iamVjdH0gbG9nZ2VyIC0gQ29uZmlndXJhdGlvbiBvZiB0aGUgbG9nZ2VyIHNlcnZpY2UsIGNmLiBCdW55YW5cbiAqICBkb2N1bWVudGF0aW9uLlxuICogQHByb3BlcnR5IHtTdHJpbmd9IGVycm9yUmVwb3J0ZXJEaXJlY3RvcnkgLSBEaXJlY3Rvcnkgd2hlcmUgZXJyb3IgcmVwb3J0ZWRcbiAqICBmcm9tIHRoZSBjbGllbnRzIGFyZSB3cml0dGVuLlxuICovXG5cblxuLyoqXG4gKiBTZXJ2ZXIgc2lkZSBlbnRyeSBwb2ludCBmb3IgYSBgc291bmR3b3Jrc2AgYXBwbGljYXRpb24uXG4gKlxuICogVGhpcyBvYmplY3QgaG9zdHMgY29uZmlndXJhdGlvbiBpbmZvcm1hdGlvbnMsIGFzIHdlbGwgYXMgbWV0aG9kcyB0b1xuICogaW5pdGlhbGl6ZSBhbmQgc3RhcnQgdGhlIGFwcGxpY2F0aW9uLiBJdCBpcyBhbHNvIHJlc3BvbnNpYmxlIGZvciBjcmVhdGluZ1xuICogdGhlIHN0YXRpYyBmaWxlIChodHRwKSBzZXJ2ZXIgYXMgd2VsbCBhcyB0aGUgc29ja2V0IHNlcnZlci5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyXG4gKiBAbmFtZXNwYWNlXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIHNvdW5kd29ya3MgZnJvbSAnc291bmR3b3Jrcy9zZXJ2ZXInO1xuICogaW1wb3J0IE15RXhwZXJpZW5jZSBmcm9tICcuL015RXhwZXJpZW5jZSc7XG4gKlxuICogc291bmR3b3Jrcy5zZXJ2ZXIuaW5pdChjb25maWcpO1xuICogY29uc3QgbXlFeHBlcmllbmNlID0gbmV3IE15RXhwZXJpZW5jZSgpO1xuICogc291bmR3b3Jrcy5zZXJ2ZXIuc3RhcnQoKTtcbiAqL1xuY29uc3Qgc2VydmVyID0ge1xuICAvKipcbiAgICogU29ja2V0SU8gc2VydmVyLlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaW86IG51bGwsXG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyYXRpb24gaW5mb3JtYXRpb25zLCBhbGwgY29uZmlnIG9iamVjdHMgcGFzc2VkIHRvIHRoZVxuICAgKiBbYHNlcnZlci5pbml0YF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLnNlcnZlci5pbml0fSBhcmUgbWVyZ2VkXG4gICAqIGludG8gdGhpcyBvYmplY3QuXG4gICAqIEB0eXBlIHttb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuc2VydmVyfnNlcnZlckNvbmZpZ31cbiAgICovXG4gIGNvbmZpZzoge30sXG5cbiAgLyoqXG4gICAqIE1hcHBpbmcgYmV0d2VlbiBhIGBjbGllbnRUeXBlYCBhbmQgaXRzIHJlbGF0ZWQgYWN0aXZpdGllcy5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9jbGllbnRUeXBlQWN0aXZpdGllc01hcDoge30sXG5cbiAgLyoqXG4gICAqIFJlcXVpcmVkIGFjdGl2aXRpZXMgdGhhdCBtdXN0IGJlIHN0YXJ0ZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfYWN0aXZpdGllczogbmV3IFNldCgpLFxuXG4gIC8qKlxuICAgKiBPcHRpb25uYWwgcm91dGluZyBkZWZpbmVkIGZvciBlYWNoIGNsaWVudC5cbiAgICogQHByaXZhdGVcbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG4gIF9yb3V0ZXM6IHt9LFxuXG5cbiAgX2NsaWVudENvbmZpZ0RlZmluaXRpb246IChjbGllbnRUeXBlLCBzZXJ2ZXJDb25maWcsIGh0dHBSZXF1ZXN0KSA9PiB7XG4gICAgcmV0dXJuIHsgY2xpZW50VHlwZSB9O1xuICB9LFxuXG4gIC8qKlxuICAgKiBNYXAgY2xpZW50IHR5cGVzIHdpdGggYW4gYWN0aXZpdHkuXG4gICAqIEBwYXJhbSB7QXJyYXk8U3RyaW5nPn0gY2xpZW50VHlwZXMgLSBMaXN0IG9mIGNsaWVudCB0eXBlLlxuICAgKiBAcGFyYW0ge0FjdGl2aXR5fSBhY3Rpdml0eSAtIEFjdGl2aXR5IGNvbmNlcm5lZCB3aXRoIHRoZSBnaXZlbiBgY2xpZW50VHlwZXNgLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3NldE1hcChjbGllbnRUeXBlcywgYWN0aXZpdHkpIHtcbiAgICBjbGllbnRUeXBlcy5mb3JFYWNoKChjbGllbnRUeXBlKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuX2NsaWVudFR5cGVBY3Rpdml0aWVzTWFwW2NsaWVudFR5cGVdKVxuICAgICAgICB0aGlzLl9jbGllbnRUeXBlQWN0aXZpdGllc01hcFtjbGllbnRUeXBlXSA9IG5ldyBTZXQoKTtcblxuICAgICAgdGhpcy5fY2xpZW50VHlwZUFjdGl2aXRpZXNNYXBbY2xpZW50VHlwZV0uYWRkKGFjdGl2aXR5KTtcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogRnVuY3Rpb24gdXNlZCBieSBhY3Rpdml0aWVzIHRvIHJlZ2lzdGVyIHRoZW1zZWx2ZXMgYXMgYWN0aXZlIGFjdGl2aXRpZXNcbiAgICogQHBhcmFtIHtBY3Rpdml0eX0gYWN0aXZpdHkgLSBBY3Rpdml0eSB0byBiZSByZWdpc3RlcmVkLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0QWN0aXZpdHkoYWN0aXZpdHkpIHtcbiAgICB0aGlzLl9hY3Rpdml0aWVzLmFkZChhY3Rpdml0eSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJldHVybiBhIHNlcnZpY2UgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBJZGVudGlmaWVyIG9mIHRoZSBzZXJ2aWNlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE9wdGlvbnMgdG8gY29uZmlndXJlIHRoZSBzZXJ2aWNlLlxuICAgKi9cbiAgcmVxdWlyZShpZCwgb3B0aW9ucykge1xuICAgIHJldHVybiBzZXJ2aWNlTWFuYWdlci5yZXF1aXJlKGlkLCBudWxsLCBvcHRpb25zKTtcbiAgfSxcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgc2VydmVyIHdpdGggdGhlIGdpdmVuIGNvbmZpZyBvYmplY3RzLlxuICAgKiBAcGFyYW0gey4uLm1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5zZXJ2ZXJ+c2VydmVyQ29uZmlnfSBjb25maWdzIC1cbiAgICogIENvbmZpZ3VyYXRpb24gb2YgdGhlIGFwcGxpY2F0aW9uLlxuICAgKi9cbiAgaW5pdCguLi5jb25maWdzKSB7XG4gICAgY29uZmlncy5mb3JFYWNoKChjb25maWcpID0+IHtcbiAgICAgIGZvciAobGV0IGtleSBpbiBjb25maWcpIHtcbiAgICAgICAgY29uc3QgZW50cnkgPSBjb25maWdba2V5XTtcblxuICAgICAgICBpZiAodHlwZW9mIGVudHJ5ID09PSAnb2JqZWN0JyAmJiBlbnRyeSAhPT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMuY29uZmlnW2tleV0gPSB0aGlzLmNvbmZpZ1trZXldIHx8wqB7fTtcbiAgICAgICAgICB0aGlzLmNvbmZpZ1trZXldID0gT2JqZWN0LmFzc2lnbih0aGlzLmNvbmZpZ1trZXldLCBlbnRyeSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5jb25maWdba2V5XSA9IGVudHJ5O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgX3BvcHVsYXRlRGVmYXVsdENvbmZpZygpIHtcbiAgICAvLyBtYW5kYXRvcnkgY29uZmlndXJhdGlvbiBvcHRpb25zXG4gICAgaWYgKHRoaXMuY29uZmlnLnBvcnQgPT09IHVuZGVmaW5lZClcbiAgICAgIMKgdGhpcy5jb25maWcucG9ydCA9IDgwMDA7XG5cbiAgICBpZiAodGhpcy5jb25maWcuZW5hYmxlR1ppcENvbXByZXNzaW9uID09PSB1bmRlZmluZWQpXG4gICAgICB0aGlzLmNvbmZpZy5lbmFibGVHWmlwQ29tcHJlc3Npb24gPSB0cnVlO1xuXG4gICAgaWYgKHRoaXMuY29uZmlnLnB1YmxpY0RpcmVjdG9yeSA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhpcy5jb25maWcucHVibGljRGlyZWN0b3J5ID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdwdWJsaWMnKTtcblxuICAgIGlmICh0aGlzLmNvbmZpZy50ZW1wbGF0ZURpcmVjdG9yeSA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhpcy5jb25maWcudGVtcGxhdGVEaXJlY3RvcnkgPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ2h0bWwnKTtcblxuICAgIGlmICh0aGlzLmNvbmZpZy5kZWZhdWx0Q2xpZW50ID09PSB1bmRlZmluZWQpXG4gICAgICB0aGlzLmNvbmZpZy5kZWZhdWx0Q2xpZW50ID0gJ3BsYXllcic7XG5cbiAgICBpZiAodGhpcy5jb25maWcuc29ja2V0SU8gPT09IHVuZGVmaW5lZClcbiAgICAgIHRoaXMuY29uZmlnLnNvY2tldElPID0ge307XG4gIH0sXG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBhcHBsaWNhdGlvbjpcbiAgICogLSBsYXVuY2ggdGhlIGh0dHAocykgc2VydmVyLlxuICAgKiAtIGxhdW5jaCB0aGUgc29ja2V0IHNlcnZlci5cbiAgICogLSBzdGFydCBhbGwgcmVnaXN0ZXJlZCBhY3Rpdml0aWVzLlxuICAgKiAtIGRlZmluZSByb3V0ZXMgYW5kIGFjdGl2aXRpZXMgbWFwcGluZyBmb3IgYWxsIGNsaWVudCB0eXBlcy5cbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMuX3BvcHVsYXRlRGVmYXVsdENvbmZpZygpO1xuXG4gICAgaWYgKHRoaXMuY29uZmlnLmxvZ2dlciAhPT0gdW5kZWZpbmVkKVxuICAgICAgbG9nZ2VyLmluaXRpYWxpemUodGhpcy5jb25maWcubG9nZ2VyKTtcblxuICAgIC8vIGNvbmZpZ3VyZSBleHByZXNzXG4gICAgY29uc3QgZXhwcmVzc0FwcCA9IG5ldyBleHByZXNzKCk7XG4gICAgZXhwcmVzc0FwcC5zZXQoJ3BvcnQnLCBwcm9jZXNzLmVudi5QT1JUIHx8IHRoaXMuY29uZmlnLnBvcnQpO1xuICAgIGV4cHJlc3NBcHAuc2V0KCd2aWV3IGVuZ2luZScsICdlanMnKTtcblxuICAgIC8vIGNvbXByZXNzaW9uXG4gICAgaWYgKHRoaXMuY29uZmlnLmVuYWJsZUdaaXBDb21wcmVzc2lvbilcbiAgICAgIGV4cHJlc3NBcHAudXNlKGNvbXByZXNzaW9uKCkpO1xuXG4gICAgLy8gcHVibGljIGZvbGRlclxuICAgIGV4cHJlc3NBcHAudXNlKGV4cHJlc3Muc3RhdGljKHRoaXMuY29uZmlnLnB1YmxpY0RpcmVjdG9yeSkpO1xuXG4gICAgLy8gdXNlIGh0dHBzXG4gICAgY29uc3QgdXNlSHR0cHMgPSB0aGlzLmNvbmZpZy51c2VIdHRwcyB8fMKgZmFsc2U7XG4gICAgLy8gbGF1bmNoIGh0dHAocykgc2VydmVyXG4gICAgaWYgKCF1c2VIdHRwcykge1xuICAgICAgdGhpcy5fcnVuSHR0cFNlcnZlcihleHByZXNzQXBwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgaHR0cHNJbmZvcyA9IHRoaXMuY29uZmlnLmh0dHBzSW5mb3M7XG5cbiAgICAgIC8vIHVzZSBnaXZlbiBjZXJ0aWZpY2F0ZVxuICAgICAgaWYgKGh0dHBzSW5mb3Mua2V5ICYmIGh0dHBzSW5mb3MuY2VydCkge1xuICAgICAgICBjb25zdCBrZXkgPSBmcy5yZWFkRmlsZVN5bmMoaHR0cHNJbmZvcy5rZXkpO1xuICAgICAgICBjb25zdCBjZXJ0ID0gZnMucmVhZEZpbGVTeW5jKGh0dHBzSW5mb3MuY2VydCk7XG5cbiAgICAgICAgdGhpcy5fcnVuSHR0cHNTZXJ2ZXIoZXhwcmVzc0FwcCwga2V5LCBjZXJ0KTtcbiAgICAgIC8vIGdlbmVyYXRlIGNlcnRpZmljYXRlIG9uIHRoZSBmbHkgKGZvciBkZXZlbG9wbWVudCBwdXJwb3NlcylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBlbS5jcmVhdGVDZXJ0aWZpY2F0ZSh7IGRheXM6IDEsIHNlbGZTaWduZWQ6IHRydWUgfSwgKGVyciwga2V5cykgPT4ge1xuICAgICAgICAgIHRoaXMuX3J1bkh0dHBzU2VydmVyKGV4cHJlc3NBcHAsIGtleXMuc2VydmljZUtleSwga2V5cy5jZXJ0aWZpY2F0ZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSByb3V0ZSBmb3IgYSBnaXZlbiBgY2xpZW50VHlwZWAsIGFsbG93IHRvIGRlZmluZSBhIG1vcmUgY29tcGxleFxuICAgKiByb3V0aW5nIChhZGRpdGlvbm5hbCByb3V0ZSBwYXJhbWV0ZXJzKSBmb3IgYSBnaXZlbiB0eXBlIG9mIGNsaWVudC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNsaWVudFR5cGUgLSBUeXBlIG9mIHRoZSBjbGllbnQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfFJlZ0V4cH0gcm91dGUgLSBUZW1wbGF0ZSBvZiB0aGUgcm91dGUgdGhhdCBzaG91bGQgYmUgYXBwZW5kLlxuICAgKiAgdG8gdGhlIGNsaWVudCB0eXBlXG4gICAqIEBleGFtcGxlXG4gICAqIGBgYFxuICAgKiAvLyBhbGxvdyBgY29uZHVjdG9yYCBjbGllbnRzIHRvIGNvbm5lY3QgdG8gYGh0dHA6Ly9zaXRlLmNvbS9jb25kdWN0b3IvMWBcbiAgICogc2VydmVyLnJlZ2lzdGVyUm91dGUoJ2NvbmR1Y3RvcicsICcvOnBhcmFtJylcbiAgICogYGBgXG4gICAqL1xuICBkZWZpbmVSb3V0ZShjbGllbnRUeXBlLCByb3V0ZSkge1xuICAgIHRoaXMuX3JvdXRlc1tjbGllbnRUeXBlXSA9IHJvdXRlO1xuICB9LFxuXG5cbiAgc2V0Q2xpZW50Q29uZmlnRGVmaW5pdGlvbihmdW5jKSB7XG4gICAgdGhpcy5fY2xpZW50Q29uZmlnRGVmaW5pdGlvbiA9IGZ1bmM7XG4gIH0sXG5cbiAgLyoqXG4gICAqIExhdW5jaCBhIGh0dHAgc2VydmVyLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3J1bkh0dHBTZXJ2ZXIoZXhwcmVzc0FwcCkge1xuICAgIGNvbnN0IGh0dHBTZXJ2ZXIgPSBodHRwLmNyZWF0ZVNlcnZlcihleHByZXNzQXBwKTtcbiAgICB0aGlzLl9pbml0U29ja2V0cyhodHRwU2VydmVyKTtcbiAgICB0aGlzLl9pbml0QWN0aXZpdGllcyhleHByZXNzQXBwKTtcblxuICAgIGh0dHBTZXJ2ZXIubGlzdGVuKGV4cHJlc3NBcHAuZ2V0KCdwb3J0JyksIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgdXJsID0gYGh0dHA6Ly8xMjcuMC4wLjE6JHtleHByZXNzQXBwLmdldCgncG9ydCcpfWA7XG4gICAgICBjb25zb2xlLmxvZygnW0hUVFAgU0VSVkVSXSBTZXJ2ZXIgbGlzdGVuaW5nIG9uJywgdXJsKTtcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogTGF1bmNoIGEgaHR0cHMgc2VydmVyLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3J1bkh0dHBzU2VydmVyKGV4cHJlc3NBcHAsIGtleSwgY2VydCkge1xuICAgIGNvbnN0IGh0dHBzU2VydmVyID0gaHR0cHMuY3JlYXRlU2VydmVyKHsga2V5LCBjZXJ0IH0sIGV4cHJlc3NBcHApO1xuICAgIHRoaXMuX2luaXRTb2NrZXRzKGh0dHBzU2VydmVyKTtcbiAgICB0aGlzLl9pbml0QWN0aXZpdGllcyhleHByZXNzQXBwKTtcblxuICAgIGh0dHBzU2VydmVyLmxpc3RlbihleHByZXNzQXBwLmdldCgncG9ydCcpLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHVybCA9IGBodHRwczovLzEyNy4wLjAuMToke2V4cHJlc3NBcHAuZ2V0KCdwb3J0Jyl9YDtcbiAgICAgIGNvbnNvbGUubG9nKCdbSFRUUFMgU0VSVkVSXSBTZXJ2ZXIgbGlzdGVuaW5nIG9uJywgdXJsKTtcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogSW5pdCB3ZWJzb2NrZXQgc2VydmVyLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2luaXRTb2NrZXRzKGh0dHBTZXJ2ZXIpIHtcbiAgICB0aGlzLmlvID0gbmV3IElPKGh0dHBTZXJ2ZXIsIHRoaXMuY29uZmlnLnNvY2tldElPKTtcblxuICAgIGlmICh0aGlzLmNvbmZpZy5jb3Jkb3ZhICYmIHRoaXMuY29uZmlnLmNvcmRvdmEuc29ja2V0SU8pIC8vIElPIGFkZCBzb21lIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyB0byB0aGUgb2JqZWN0XG4gICAgICB0aGlzLmNvbmZpZy5jb3Jkb3ZhLnNvY2tldElPID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5jb25maWcuc29ja2V0SU8sIHRoaXMuY29uZmlnLmNvcmRvdmEuc29ja2V0SU8pO1xuXG4gICAgc29ja2V0cy5pbml0aWFsaXplKHRoaXMuaW8pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTdGFydCBhbGwgYWN0aXZpdGllcyBhbmQgbWFwIHRoZSByb3V0ZXMgKGNsaWVudFR5cGUgLyBhY3Rpdml0aWVzIG1hcHBpbmcpLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2luaXRBY3Rpdml0aWVzKGV4cHJlc3NBcHApIHtcbiAgICB0aGlzLl9hY3Rpdml0aWVzLmZvckVhY2goKGFjdGl2aXR5KSA9PiBhY3Rpdml0eS5zdGFydCgpKTtcblxuICAgIHRoaXMuX2FjdGl2aXRpZXMuZm9yRWFjaCgoYWN0aXZpdHkpID0+IHtcbiAgICAgIHRoaXMuX3NldE1hcChhY3Rpdml0eS5jbGllbnRUeXBlcywgYWN0aXZpdHkpO1xuICAgIH0pO1xuXG4gICAgLy8gbWFwIGBjbGllbnRUeXBlYCB0byB0aGVpciByZXNwZWN0aXZlIGFjdGl2aXRpZXNcbiAgICBmb3IgKGxldCBjbGllbnRUeXBlIGluIHRoaXMuX2NsaWVudFR5cGVBY3Rpdml0aWVzTWFwKSB7XG4gICAgICBpZiAoY2xpZW50VHlwZSAhPT0gdGhpcy5jb25maWcuZGVmYXVsdENsaWVudCkge1xuICAgICAgICBjb25zdCBhY3Rpdml0aWVzID0gdGhpcy5fY2xpZW50VHlwZUFjdGl2aXRpZXNNYXBbY2xpZW50VHlwZV07XG4gICAgICAgIHRoaXMuX21hcChjbGllbnRUeXBlLCBhY3Rpdml0aWVzLCBleHByZXNzQXBwKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBtYWtlIHN1cmUgYGRlZmF1bHRDbGllbnRgIChha2EgYHBsYXllcmApIGlzIG1hcHBlZCBsYXN0XG4gICAgZm9yIChsZXQgY2xpZW50VHlwZSBpbiB0aGlzLl9jbGllbnRUeXBlQWN0aXZpdGllc01hcCkge1xuICAgICAgaWYgKGNsaWVudFR5cGUgPT09IHRoaXMuY29uZmlnLmRlZmF1bHRDbGllbnQpIHtcbiAgICAgICAgY29uc3QgYWN0aXZpdGllcyA9IHRoaXMuX2NsaWVudFR5cGVBY3Rpdml0aWVzTWFwW2NsaWVudFR5cGVdO1xuICAgICAgICB0aGlzLl9tYXAoY2xpZW50VHlwZSwgYWN0aXZpdGllcywgZXhwcmVzc0FwcCk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBNYXAgYSBjbGllbnQgdHlwZSB0byBhIHJvdXRlLCBhIHNldCBvZiBhY3Rpdml0aWVzLlxuICAgKiBBZGRpdGlvbm5hbGx5IGxpc3RlbiBmb3IgdGhlaXIgc29ja2V0IGNvbm5lY3Rpb24uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfbWFwKGNsaWVudFR5cGUsIGFjdGl2aXRpZXMsIGV4cHJlc3NBcHApIHtcbiAgICBsZXQgcm91dGUgPSAnJztcblxuICAgIGlmICh0aGlzLl9yb3V0ZXNbY2xpZW50VHlwZV0pXG4gICAgICByb3V0ZSArPSB0aGlzLl9yb3V0ZXNbY2xpZW50VHlwZV07XG5cbiAgICBpZiAoY2xpZW50VHlwZSAhPT0gdGhpcy5jb25maWcuZGVmYXVsdENsaWVudClcbiAgICAgIHJvdXRlID0gYC8ke2NsaWVudFR5cGV9JHtyb3V0ZX1gO1xuXG4gICAgLy8gZGVmaW5lIHRlbXBsYXRlIGZpbGVuYW1lOiBgJHtjbGllbnRUeXBlfS5lanNgIG9yIGBkZWZhdWx0LmVqc2BcbiAgICBjb25zdCB0ZW1wbGF0ZURpcmVjdG9yeSA9IHRoaXMuY29uZmlnLnRlbXBsYXRlRGlyZWN0b3J5O1xuICAgIGNvbnN0IGNsaWVudFRtcGwgPSBwYXRoLmpvaW4odGVtcGxhdGVEaXJlY3RvcnksIGAke2NsaWVudFR5cGV9LmVqc2ApO1xuICAgIGNvbnN0IGRlZmF1bHRUbXBsID0gcGF0aC5qb2luKHRlbXBsYXRlRGlyZWN0b3J5LCBgZGVmYXVsdC5lanNgKTtcblxuICAgIGZzLnN0YXQoY2xpZW50VG1wbCwgKGVyciwgc3RhdHMpID0+IHtcbiAgICAgIGxldCB0ZW1wbGF0ZTtcblxuICAgICAgaWYgKGVyciB8fCAhc3RhdHMuaXNGaWxlKCkpXG4gICAgICAgIHRlbXBsYXRlID0gZGVmYXVsdFRtcGw7XG4gICAgICBlbHNlXG4gICAgICAgIHRlbXBsYXRlID0gY2xpZW50VG1wbDtcblxuICAgICAgY29uc3QgdG1wbFN0cmluZyA9IGZzLnJlYWRGaWxlU3luYyh0ZW1wbGF0ZSwgeyBlbmNvZGluZzogJ3V0ZjgnIH0pO1xuICAgICAgY29uc3QgdG1wbCA9IGVqcy5jb21waWxlKHRtcGxTdHJpbmcpO1xuXG4gICAgICAvLyBodHRwIHJlcXVlc3RcbiAgICAgIGV4cHJlc3NBcHAuZ2V0KHJvdXRlLCAocmVxLCByZXMpID0+IHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuX2NsaWVudENvbmZpZ0RlZmluaXRpb24oY2xpZW50VHlwZSwgdGhpcy5jb25maWcsIHJlcSk7XG4gICAgICAgIGNvbnN0IGFwcEluZGV4ID0gdG1wbCh7IGRhdGEgfSk7XG4gICAgICAgIHJlcy5zZW5kKGFwcEluZGV4KTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBzb2NrZXQgY29ubm5lY3Rpb25cbiAgICAgIHRoaXMuaW8ub2YoY2xpZW50VHlwZSkub24oJ2Nvbm5lY3Rpb24nLCAoc29ja2V0KSA9PiB7XG4gICAgICAgIHRoaXMuX29uU29ja2V0Q29ubmVjdGlvbihjbGllbnRUeXBlLCBzb2NrZXQsIGFjdGl2aXRpZXMpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNvY2tldCBjb25uZWN0aW9uIGNhbGxiYWNrLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX29uU29ja2V0Q29ubmVjdGlvbihjbGllbnRUeXBlLCBzb2NrZXQsIGFjdGl2aXRpZXMpIHtcbiAgICBjb25zdCBjbGllbnQgPSBuZXcgQ2xpZW50KGNsaWVudFR5cGUsIHNvY2tldCk7XG5cbiAgICAvLyBnbG9iYWwgbGlmZWN5Y2xlIG9mIHRoZSBjbGllbnRcbiAgICBzb2NrZXRzLnJlY2VpdmUoY2xpZW50LCAnZGlzY29ubmVjdCcsICgpID0+IHtcbiAgICAgIGFjdGl2aXRpZXMuZm9yRWFjaCgoYWN0aXZpdHkpID0+IGFjdGl2aXR5LmRpc2Nvbm5lY3QoY2xpZW50KSk7XG4gICAgICBjbGllbnQuZGVzdHJveSgpO1xuXG4gICAgICBpZiAobG9nZ2VyLmluZm8pXG4gICAgICAgIGxvZ2dlci5pbmZvKHsgc29ja2V0LCBjbGllbnRUeXBlIH0sICdkaXNjb25uZWN0Jyk7XG4gICAgfSk7XG5cbiAgICBzb2NrZXRzLnJlY2VpdmUoY2xpZW50LCAnaGFuZHNoYWtlJywgKGRhdGEpID0+IHtcbiAgICAgIGNsaWVudC51cmxQYXJhbXMgPSBkYXRhLnVybFBhcmFtcztcbiAgICAgIC8vIEB0b2RvIC0gaGFuZGxlIHJlY29ubmVjdGlvbiAoZXg6IGBkYXRhYCBjb250YWlucyBhbiBgdXVpZGApXG4gICAgICBhY3Rpdml0aWVzLmZvckVhY2goKGFjdGl2aXR5KSA9PiBhY3Rpdml0eS5jb25uZWN0KGNsaWVudCkpO1xuICAgICAgc29ja2V0cy5zZW5kKGNsaWVudCwgJ2NsaWVudDpzdGFydCcsIGNsaWVudC51dWlkKTtcblxuICAgICAgaWYgKGxvZ2dlci5pbmZvKVxuICAgICAgICBsb2dnZXIuaW5mbyh7IHNvY2tldCwgY2xpZW50VHlwZSB9LCAnaGFuZHNoYWtlJyk7XG4gICAgfSk7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBzZXJ2ZXI7XG4iXX0=