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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZlci5qcyJdLCJuYW1lcyI6WyJzZXJ2ZXIiLCJpbyIsImNvbmZpZyIsIl9jbGllbnRUeXBlQWN0aXZpdGllc01hcCIsIl9hY3Rpdml0aWVzIiwiX3JvdXRlcyIsIl9jbGllbnRDb25maWdEZWZpbml0aW9uIiwiY2xpZW50VHlwZSIsInNlcnZlckNvbmZpZyIsImh0dHBSZXF1ZXN0IiwiX3NldE1hcCIsImNsaWVudFR5cGVzIiwiYWN0aXZpdHkiLCJmb3JFYWNoIiwiYWRkIiwic2V0QWN0aXZpdHkiLCJyZXF1aXJlIiwiaWQiLCJvcHRpb25zIiwiaW5pdCIsImNvbmZpZ3MiLCJrZXkiLCJlbnRyeSIsIl9wb3B1bGF0ZURlZmF1bHRDb25maWciLCJwb3J0IiwidW5kZWZpbmVkIiwiZW5hYmxlR1ppcENvbXByZXNzaW9uIiwicHVibGljRGlyZWN0b3J5Iiwiam9pbiIsInByb2Nlc3MiLCJjd2QiLCJ0ZW1wbGF0ZURpcmVjdG9yeSIsImRlZmF1bHRDbGllbnQiLCJzb2NrZXRJTyIsInN0YXJ0IiwibG9nZ2VyIiwiaW5pdGlhbGl6ZSIsImV4cHJlc3NBcHAiLCJzZXQiLCJlbnYiLCJQT1JUIiwidXNlIiwic3RhdGljIiwidXNlSHR0cHMiLCJfcnVuSHR0cFNlcnZlciIsImh0dHBzSW5mb3MiLCJjZXJ0IiwicmVhZEZpbGVTeW5jIiwiX3J1bkh0dHBzU2VydmVyIiwiY3JlYXRlQ2VydGlmaWNhdGUiLCJkYXlzIiwic2VsZlNpZ25lZCIsImVyciIsImtleXMiLCJzZXJ2aWNlS2V5IiwiY2VydGlmaWNhdGUiLCJkZWZpbmVSb3V0ZSIsInJvdXRlIiwic2V0Q2xpZW50Q29uZmlnRGVmaW5pdGlvbiIsImZ1bmMiLCJodHRwU2VydmVyIiwiY3JlYXRlU2VydmVyIiwiX2luaXRTb2NrZXRzIiwiX2luaXRBY3Rpdml0aWVzIiwibGlzdGVuIiwiZ2V0IiwidXJsIiwiY29uc29sZSIsImxvZyIsImh0dHBzU2VydmVyIiwiY29yZG92YSIsImFjdGl2aXRpZXMiLCJfbWFwIiwiY2xpZW50VG1wbCIsImRlZmF1bHRUbXBsIiwic3RhdCIsInN0YXRzIiwidGVtcGxhdGUiLCJpc0ZpbGUiLCJ0bXBsU3RyaW5nIiwiZW5jb2RpbmciLCJ0bXBsIiwiY29tcGlsZSIsInJlcSIsInJlcyIsImRhdGEiLCJhcHBJbmRleCIsInNlbmQiLCJvZiIsIm9uIiwic29ja2V0IiwiX29uU29ja2V0Q29ubmVjdGlvbiIsImNsaWVudCIsInJlY2VpdmUiLCJkaXNjb25uZWN0IiwiZGVzdHJveSIsImluZm8iLCJ1cmxQYXJhbXMiLCJjb25uZWN0IiwidXVpZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0JBLElBQU1BLFNBQVM7QUFDYjs7Ozs7QUFLQUMsTUFBSSxJQU5TOztBQVFiOzs7Ozs7QUFNQUMsVUFBUSxFQWRLOztBQWdCYjs7OztBQUlBQyw0QkFBMEIsRUFwQmI7O0FBc0JiOzs7O0FBSUFDLGVBQWEsbUJBMUJBOztBQTRCYjs7Ozs7QUFLQUMsV0FBUyxFQWpDSTs7QUFvQ2JDLDJCQUF5QixpQ0FBQ0MsVUFBRCxFQUFhQyxZQUFiLEVBQTJCQyxXQUEzQixFQUEyQztBQUNsRSxXQUFPLEVBQUVGLHNCQUFGLEVBQVA7QUFDRCxHQXRDWTs7QUF3Q2I7Ozs7OztBQU1BRyxTQTlDYSxtQkE4Q0xDLFdBOUNLLEVBOENRQyxRQTlDUixFQThDa0I7QUFBQTs7QUFDN0JELGdCQUFZRSxPQUFaLENBQW9CLFVBQUNOLFVBQUQsRUFBZ0I7QUFDbEMsVUFBSSxDQUFDLE1BQUtKLHdCQUFMLENBQThCSSxVQUE5QixDQUFMLEVB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QixDQUFkO0FBQUEsT0FBbkI7QUFDQSx3QkFBUUwsSUFBUixDQUFhSyxNQUFiLEVBQXFCLGNBQXJCLEVBQXFDQSxPQUFPTyxJQUE1Qzs7QUFFQSxVQUFJLGlCQUFPSCxJQUFYLEVBQ0UsaUJBQU9BLElBQVAsQ0FBWSxFQUFFTixjQUFGLEVBQVVuRixzQkFBVixFQUFaLEVBQW9DLFdBQXBDO0FBQ0gsS0FSRDtBQVNEO0FBblVZLENBQWY7O2tCQXNVZVAsTSIsImZpbGUiOiJzZXJ2ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ2xpZW50IGZyb20gJy4vQ2xpZW50JztcbmltcG9ydCBjb21wcmVzc2lvbiBmcm9tICdjb21wcmVzc2lvbic7XG5pbXBvcnQgZWpzIGZyb20gJ2Vqcyc7XG5pbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgaHR0cCBmcm9tICdodHRwJztcbmltcG9ydCBodHRwcyBmcm9tICdodHRwcyc7XG5pbXBvcnQgSU8gZnJvbSAnc29ja2V0LmlvJztcbmltcG9ydCBsb2dnZXIgZnJvbSAnLi4vdXRpbHMvbG9nZ2VyJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHBlbSBmcm9tICdwZW0nO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4vc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IHNvY2tldHMgZnJvbSAnLi9zb2NrZXRzJztcblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuc2VydmVyfnNlcnZlckNvbmZpZ1xuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5zZXJ2ZXJcbiAqXG4gKiBAcHJvcGVydHkge1N0cmluZ30gYXBwTmFtZSAtIE5hbWUgb2YgdGhlIGFwcGxpY2F0aW9uLCB1c2VkIGluIHRoZSBgLmVqc2BcbiAqICB0ZW1wbGF0ZSBhbmQgYnkgZGVmYXVsdCBpbiB0aGUgYHBsYXRmb3JtYCBzZXJ2aWNlIHRvIHBvcHVsYXRlIGl0cyB2aWV3LlxuICogQHByb3BlcnR5IHtTdHJpbmd9IGVudiAtIE5hbWUgb2YgdGhlIGVudmlyb25uZW1lbnQgKCdwcm9kdWN0aW9uJyBlbmFibGVcbiAqICBjYWNoZSBpbiBleHByZXNzIGFwcGxpY2F0aW9uKS5cbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSB2ZXJzaW9uIC0gVmVyc2lvbiBvZiBhcHBsaWNhdGlvbiwgY2FuIGJlIHVzZWQgdG8gZm9yY2VcbiAqICByZWxvYWQgY3NzIGFuZCBqcyBmaWxlcyBmcm9tIHNlcnZlciAoY2YuIGBodG1sL2RlZmF1bHQuZWpzYClcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBkZWZhdWx0Q2xpZW50IC0gTmFtZSBvZiB0aGUgZGVmYXVsdCBjbGllbnQgdHlwZSxcbiAqICBpLmUuIHRoZSBjbGllbnQgdGhhdCBjYW4gYWNjZXNzIHRoZSBhcHBsaWNhdGlvbiBhdCBpdHMgcm9vdCBVUkxcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBhc3NldHNEb21haW4gLSBEZWZpbmUgZnJvbSB3aGVyZSB0aGUgYXNzZXRzIChzdGF0aWMgZmlsZXMpXG4gKiAgc2hvdWxkIGJlIGxvYWRlZCwgdGhlc2UgdmFsdWUgY291bGQgYWxzbyByZWZlciB0byBhIHNlcGFyYXRlIHNlcnZlciBmb3JcbiAqICBzY2FsYWJpbGl0eSByZWFzb25zLiBUaGlzIHZhbHVlIHNob3VsZCBhbHNvIGJlIHVzZWQgY2xpZW50LXNpZGUgdG8gY29uZmlndXJlXG4gKiAgdGhlIGBsb2FkZXJgIHNlcnZpY2UuXG4gKiBAcHJvcGVydHkge051bWJlcn0gcG9ydCAtIFBvcnQgdXNlZCB0byBvcGVuIHRoZSBodHRwIHNlcnZlciwgaW4gcHJvZHVjdGlvblxuICogIHRoaXMgdmFsdWUgaXMgdHlwaWNhbGx5IDgwXG4gKlxuICogQHByb3BlcnR5IHtPYmplY3R9IHNldHVwIC0gRGVzY3JpYmUgdGhlIGxvY2F0aW9uIHdoZXJlIHRoZSBleHBlcmllbmNlIHRha2VzXG4gKiAgcGxhY2VzLCB0aGVzZXMgdmFsdWVzIGFyZSB1c2VkIGJ5IHRoZSBgcGxhY2VyYCwgYGNoZWNraW5gIGFuZCBgbG9jYXRvcmBcbiAqICBzZXJ2aWNlcy4gSWYgb25lIG9mIHRoZXNlIHNlcnZpY2UgaXMgcmVxdWlyZWQsIHRoaXMgZW50cnkgbWFuZGF0b3J5LlxuICogQHByb3BlcnR5IHtPYmplY3R9IHNldHVwLmFyZWEgLSBEZXNjcmlwdGlvbiBvZiB0aGUgYXJlYS5cbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBzZXR1cC5hcmVhLndpZHRoIC0gV2lkdGggb2YgdGhlIGFyZWEuXG4gKiBAcHJvcGVydHkge051bWJlcn0gc2V0dXAuYXJlYS5oZWlnaHQgLSBIZWlnaHQgb2YgdGhlIGFyZWEuXG4gKiBAcHJvcGVydHkge1N0cmluZ30gc2V0dXAuYXJlYS5iYWNrZ3JvdW5kIC0gUGF0aCB0byBhbiBpbWFnZSB0byBiZSB1c2VkIGluXG4gKiAgdGhlIGFyZWEgcmVwcmVzZW50YXRpb24uXG4gKiBAcHJvcGVydHkge0FycmF5fSBzZXR1cC5sYWJlbHMgLSBPcHRpb25uYWwgbGlzdCBvZiBwcmVkZWZpbmVkIGxhYmVscy5cbiAqIEBwcm9wZXJ0eSB7QXJyYXl9IHNldHVwLmNvb3JkaW5hdGVzIC0gT3B0aW9ubmFsIGxpc3Qgb2YgcHJlZGVmaW5lZCBjb29yZGluYXRlcy5cbiAqIEBwcm9wZXJ0eSB7QXJyYXl9IHNldHVwLm1heENsaWVudHNQZXJQb3NpdGlvbiAtIE1heGltdW0gbnVtYmVyIG9mIGNsaWVudHNcbiAqICBhbGxvd2VkIGluIGEgcG9zaXRpb24uXG4gKiBAcHJvcGVydHkge051bWJlcn0gc2V0dXAuY2FwYWNpdHkgLSBNYXhpbXVtIG51bWJlciBvZiBwb3NpdGlvbnMgKG1heSBsaW1pdFxuICogb3IgYmUgbGltaXRlZCBieSB0aGUgbnVtYmVyIG9mIGxhYmVscyBhbmQvb3IgY29vcmRpbmF0ZXMpLlxuICpcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBzb2NrZXRJTyAtIFNvY2tldC5pbyBjb25maWd1cmF0aW9uXG4gKiBAcHJvcGVydHkge1N0cmluZ30gc29ja2V0SU8udXJsIC0gT3B0aW9ubmFsIHVybCB3aGVyZSB0aGUgc29ja2V0IHNob3VsZFxuICogIGNvbm5lY3QuXG4gKiBAcHJvcGVydHkge0FycmF5fSBzb2NrZXRJTy50cmFuc3BvcnRzIC0gTGlzdCBvZiB0aGUgdHJhbnNwb3J0IG1lY2FuaW1zIHRoYXRcbiAqICBzaG91bGQgYmUgdXNlZCB0byBvcGVuIG9yIGVtdWxhdGUgdGhlIHNvY2tldC5cbiAqXG4gKiBAcHJvcGVydHkge0Jvb2xlYW59IHVzZUh0dHBzIC0gIERlZmluZSBpZiB0aGUgSFRUUCBzZXJ2ZXIgc2hvdWxkIGJlIGxhdW5jaGVkXG4gKiAgdXNpbmcgc2VjdXJlIGNvbm5lY3Rpb25zLiBGb3IgZGV2ZWxvcG1lbnQgcHVycG9zZXMgd2hlbiBzZXQgdG8gYHRydWVgIGFuZCBub1xuICogIGNlcnRpZmljYXRlcyBhcmUgZ2l2ZW4gKGNmLiBgaHR0cHNJbmZvc2ApLCBhIHNlbGYtc2lnbmVkIGNlcnRpZmljYXRlIGlzXG4gKiAgY3JlYXRlZC5cbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBodHRwc0luZm9zIC0gUGF0aHMgdG8gdGhlIGtleSBhbmQgY2VydGlmaWNhdGUgdG8gYmUgdXNlZFxuICogIGluIG9yZGVyIHRvIGxhdW5jaCB0aGUgaHR0cHMgc2VydmVyLiBCb3RoIGVudHJpZXMgYXJlIHJlcXVpcmVkIG90aGVyd2lzZSBhXG4gKiAgc2VsZi1zaWduZWQgY2VydGlmaWNhdGUgaXMgZ2VuZXJhdGVkLlxuICogQHByb3BlcnR5IHtTdHJpbmd9IGh0dHBzSW5mb3MuY2VydCAtIFBhdGggdG8gdGhlIGNlcnRpZmljYXRlLlxuICogQHByb3BlcnR5IHtTdHJpbmd9IGh0dHBzSW5mb3Mua2V5IC0gUGF0aCB0byB0aGUga2V5LlxuICpcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBwYXNzd29yZCAtIFBhc3N3b3JkIHRvIGJlIHVzZWQgYnkgdGhlIGBhdXRoYCBzZXJ2aWNlLlxuICpcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBvc2MgLSBDb25maWd1cmF0aW9uIG9mIHRoZSBgb3NjYCBzZXJ2aWNlLlxuICogQHByb3BlcnR5IHtTdHJpbmd9IG9zYy5yZWNlaXZlQWRkcmVzcyAtIElQIG9mIHRoZSBjdXJyZW50bHkgcnVubmluZyBzZXJ2ZXIuXG4gKiBAcHJvcGVydHkge051bWJlcn0gb3NjLnJlY2VpdmVQb3J0IC0gUG9ydCBsaXN0ZW5pbmcgZm9yIGluY29tbWluZyBtZXNzYWdlcy5cbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBvc2Muc2VuZEFkZHJlc3MgLSBJUCBvZiB0aGUgcmVtb3RlIGFwcGxpY2F0aW9uLlxuICogQHByb3BlcnR5IHtOdW1iZXJ9IG9zYy5zZW5kUG9ydCAtIFBvcnQgd2hlcmUgdGhlIHJlbW90ZSBhcHBsaWNhdGlvbiBpc1xuICogIGxpc3RlbmluZyBmb3IgbWVzc2FnZXNcbiAqXG4gKiBAcHJvcGVydHkge0Jvb2xlYW59IGVuYWJsZUdaaXBDb21wcmVzc2lvbiAtIERlZmluZSBpZiB0aGUgc2VydmVyIHNob3VsZCB1c2VcbiAqICBnemlwIGNvbXByZXNzaW9uIGZvciBzdGF0aWMgZmlsZXMuXG4gKiBAcHJvcGVydHkge1N0cmluZ30gcHVibGljRGlyZWN0b3J5IC0gTG9jYXRpb24gb2YgdGhlIHB1YmxpYyBkaXJlY3RvcnlcbiAqICAoYWNjZXNzaWJsZSB0aHJvdWdoIGh0dHAocykgcmVxdWVzdHMpLlxuICogQHByb3BlcnR5IHtTdHJpbmd9IHRlbXBsYXRlRGlyZWN0b3J5IC0gRGlyZWN0b3J5IHdoZXJlIHRoZSBzZXJ2ZXIgdGVtcGxhdGluZ1xuICogIHN5c3RlbSBsb29rcyBmb3IgdGhlIGBlanNgIHRlbXBsYXRlcy5cbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBsb2dnZXIgLSBDb25maWd1cmF0aW9uIG9mIHRoZSBsb2dnZXIgc2VydmljZSwgY2YuIEJ1bnlhblxuICogIGRvY3VtZW50YXRpb24uXG4gKiBAcHJvcGVydHkge1N0cmluZ30gZXJyb3JSZXBvcnRlckRpcmVjdG9yeSAtIERpcmVjdG9yeSB3aGVyZSBlcnJvciByZXBvcnRlZFxuICogIGZyb20gdGhlIGNsaWVudHMgYXJlIHdyaXR0ZW4uXG4gKi9cblxuXG4vKipcbiAqIFNlcnZlciBzaWRlIGVudHJ5IHBvaW50IGZvciBhIGBzb3VuZHdvcmtzYCBhcHBsaWNhdGlvbi5cbiAqXG4gKiBUaGlzIG9iamVjdCBob3N0cyBjb25maWd1cmF0aW9uIGluZm9ybWF0aW9ucywgYXMgd2VsbCBhcyBtZXRob2RzIHRvXG4gKiBpbml0aWFsaXplIGFuZCBzdGFydCB0aGUgYXBwbGljYXRpb24uIEl0IGlzIGFsc28gcmVzcG9uc2libGUgZm9yIGNyZWF0aW5nXG4gKiB0aGUgc3RhdGljIGZpbGUgKGh0dHApIHNlcnZlciBhcyB3ZWxsIGFzIHRoZSBzb2NrZXQgc2VydmVyLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXJcbiAqIEBuYW1lc3BhY2VcbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgc291bmR3b3JrcyBmcm9tICdzb3VuZHdvcmtzL3NlcnZlcic7XG4gKiBpbXBvcnQgTXlFeHBlcmllbmNlIGZyb20gJy4vTXlFeHBlcmllbmNlJztcbiAqXG4gKiBzb3VuZHdvcmtzLnNlcnZlci5pbml0KGNvbmZpZyk7XG4gKiBjb25zdCBteUV4cGVyaWVuY2UgPSBuZXcgTXlFeHBlcmllbmNlKCk7XG4gKiBzb3VuZHdvcmtzLnNlcnZlci5zdGFydCgpO1xuICovXG5jb25zdCBzZXJ2ZXIgPSB7XG4gIC8qKlxuICAgKiBTb2NrZXRJTyBzZXJ2ZXIuXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBpbzogbnVsbCxcblxuICAvKipcbiAgICogQ29uZmlndXJhdGlvbiBpbmZvcm1hdGlvbnMsIGFsbCBjb25maWcgb2JqZWN0cyBwYXNzZWQgdG8gdGhlXG4gICAqIFtgc2VydmVyLmluaXRgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuc2VydmVyLmluaXR9IGFyZSBtZXJnZWRcbiAgICogaW50byB0aGlzIG9iamVjdC5cbiAgICogQHR5cGUge21vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5zZXJ2ZXJ+c2VydmVyQ29uZmlnfVxuICAgKi9cbiAgY29uZmlnOiB7fSxcblxuICAvKipcbiAgICogTWFwcGluZyBiZXR3ZWVuIGEgYGNsaWVudFR5cGVgIGFuZCBpdHMgcmVsYXRlZCBhY3Rpdml0aWVzLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2NsaWVudFR5cGVBY3Rpdml0aWVzTWFwOiB7fSxcblxuICAvKipcbiAgICogUmVxdWlyZWQgYWN0aXZpdGllcyB0aGF0IG11c3QgYmUgc3RhcnRlZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9hY3Rpdml0aWVzOiBuZXcgU2V0KCksXG5cbiAgLyoqXG4gICAqIE9wdGlvbm5hbCByb3V0aW5nIGRlZmluZWQgZm9yIGVhY2ggY2xpZW50LlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgX3JvdXRlczoge30sXG5cblxuICBfY2xpZW50Q29uZmlnRGVmaW5pdGlvbjogKGNsaWVudFR5cGUsIHNlcnZlckNvbmZpZywgaHR0cFJlcXVlc3QpID0+IHtcbiAgICByZXR1cm4geyBjbGllbnRUeXBlIH07XG4gIH0sXG5cbiAgLyoqXG4gICAqIE1hcCBjbGllbnQgdHlwZXMgd2l0aCBhbiBhY3Rpdml0eS5cbiAgICogQHBhcmFtIHtBcnJheTxTdHJpbmc+fSBjbGllbnRUeXBlcyAtIExpc3Qgb2YgY2xpZW50IHR5cGUuXG4gICAqIEBwYXJhbSB7QWN0aXZpdHl9IGFjdGl2aXR5IC0gQWN0aXZpdHkgY29uY2VybmVkIHdpdGggdGhlIGdpdmVuIGBjbGllbnRUeXBlc2AuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfc2V0TWFwKGNsaWVudFR5cGVzLCBhY3Rpdml0eSkge1xuICAgIGNsaWVudFR5cGVzLmZvckVhY2goKGNsaWVudFR5cGUpID0+IHtcbiAgICAgIGlmICghdGhpcy5fY2xpZW50VHlwZUFjdGl2aXRpZXNNYXBbY2xpZW50VHlwZV0pXG4gICAgICAgIHRoaXMuX2NsaWVudFR5cGVBY3Rpdml0aWVzTWFwW2NsaWVudFR5cGVdID0gbmV3IFNldCgpO1xuXG4gICAgICB0aGlzLl9jbGllbnRUeXBlQWN0aXZpdGllc01hcFtjbGllbnRUeXBlXS5hZGQoYWN0aXZpdHkpO1xuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiB1c2VkIGJ5IGFjdGl2aXRpZXMgdG8gcmVnaXN0ZXIgdGhlbXNlbHZlcyBhcyBhY3RpdmUgYWN0aXZpdGllc1xuICAgKiBAcGFyYW0ge0FjdGl2aXR5fSBhY3Rpdml0eSAtIEFjdGl2aXR5IHRvIGJlIHJlZ2lzdGVyZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZXRBY3Rpdml0eShhY3Rpdml0eSkge1xuICAgIHRoaXMuX2FjdGl2aXRpZXMuYWRkKGFjdGl2aXR5KTtcbiAgfSxcblxuICAvKipcbiAgICogUmV0dXJuIGEgc2VydmljZSBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIElkZW50aWZpZXIgb2YgdGhlIHNlcnZpY2UuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3B0aW9ucyB0byBjb25maWd1cmUgdGhlIHNlcnZpY2UuXG4gICAqL1xuICByZXF1aXJlKGlkLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIHNlcnZpY2VNYW5hZ2VyLnJlcXVpcmUoaWQsIG51bGwsIG9wdGlvbnMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBzZXJ2ZXIgd2l0aCB0aGUgZ2l2ZW4gY29uZmlnIG9iamVjdHMuXG4gICAqIEBwYXJhbSB7Li4ubW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLnNlcnZlcn5zZXJ2ZXJDb25maWd9IGNvbmZpZ3MgLVxuICAgKiAgQ29uZmlndXJhdGlvbiBvZiB0aGUgYXBwbGljYXRpb24uXG4gICAqL1xuICBpbml0KC4uLmNvbmZpZ3MpIHtcbiAgICBjb25maWdzLmZvckVhY2goKGNvbmZpZykgPT4ge1xuICAgICAgZm9yIChsZXQga2V5IGluIGNvbmZpZykge1xuICAgICAgICBjb25zdCBlbnRyeSA9IGNvbmZpZ1trZXldO1xuXG4gICAgICAgIGlmICh0eXBlb2YgZW50cnkgPT09ICdvYmplY3QnICYmIGVudHJ5ICE9PSBudWxsKSB7XG4gICAgICAgICAgdGhpcy5jb25maWdba2V5XSA9IHRoaXMuY29uZmlnW2tleV0gfHzCoHt9O1xuICAgICAgICAgIHRoaXMuY29uZmlnW2tleV0gPSBPYmplY3QuYXNzaWduKHRoaXMuY29uZmlnW2tleV0sIGVudHJ5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmNvbmZpZ1trZXldID0gZW50cnk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuICBfcG9wdWxhdGVEZWZhdWx0Q29uZmlnKCkge1xuICAgIC8vIG1hbmRhdG9yeSBjb25maWd1cmF0aW9uIG9wdGlvbnNcbiAgICBpZiAodGhpcy5jb25maWcucG9ydCA9PT0gdW5kZWZpbmVkKVxuICAgICAgwqB0aGlzLmNvbmZpZy5wb3J0ID0gODAwMDtcblxuICAgIGlmICh0aGlzLmNvbmZpZy5lbmFibGVHWmlwQ29tcHJlc3Npb24gPT09IHVuZGVmaW5lZClcbiAgICAgIHRoaXMuY29uZmlnLmVuYWJsZUdaaXBDb21wcmVzc2lvbiA9IHRydWU7XG5cbiAgICBpZiAodGhpcy5jb25maWcucHVibGljRGlyZWN0b3J5ID09PSB1bmRlZmluZWQpXG4gICAgICB0aGlzLmNvbmZpZy5wdWJsaWNEaXJlY3RvcnkgPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3B1YmxpYycpO1xuXG4gICAgaWYgKHRoaXMuY29uZmlnLnRlbXBsYXRlRGlyZWN0b3J5ID09PSB1bmRlZmluZWQpXG4gICAgICB0aGlzLmNvbmZpZy50ZW1wbGF0ZURpcmVjdG9yeSA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnaHRtbCcpO1xuXG4gICAgaWYgKHRoaXMuY29uZmlnLmRlZmF1bHRDbGllbnQgPT09IHVuZGVmaW5lZClcbiAgICAgIHRoaXMuY29uZmlnLmRlZmF1bHRDbGllbnQgPSAncGxheWVyJztcblxuICAgIGlmICh0aGlzLmNvbmZpZy5zb2NrZXRJTyA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhpcy5jb25maWcuc29ja2V0SU8gPSB7fTtcbiAgfSxcblxuICAvKipcbiAgICogU3RhcnQgdGhlIGFwcGxpY2F0aW9uOlxuICAgKiAtIGxhdW5jaCB0aGUgaHR0cChzKSBzZXJ2ZXIuXG4gICAqIC0gbGF1bmNoIHRoZSBzb2NrZXQgc2VydmVyLlxuICAgKiAtIHN0YXJ0IGFsbCByZWdpc3RlcmVkIGFjdGl2aXRpZXMuXG4gICAqIC0gZGVmaW5lIHJvdXRlcyBhbmQgYWN0aXZpdGllcyBtYXBwaW5nIGZvciBhbGwgY2xpZW50IHR5cGVzLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5fcG9wdWxhdGVEZWZhdWx0Q29uZmlnKCk7XG5cbiAgICBpZiAodGhpcy5jb25maWcubG9nZ2VyICE9PSB1bmRlZmluZWQpXG4gICAgICBsb2dnZXIuaW5pdGlhbGl6ZSh0aGlzLmNvbmZpZy5sb2dnZXIpO1xuXG4gICAgLy8gY29uZmlndXJlIGV4cHJlc3NcbiAgICBjb25zdCBleHByZXNzQXBwID0gbmV3IGV4cHJlc3MoKTtcbiAgICBleHByZXNzQXBwLnNldCgncG9ydCcsIHByb2Nlc3MuZW52LlBPUlQgfHwgdGhpcy5jb25maWcucG9ydCk7XG4gICAgZXhwcmVzc0FwcC5zZXQoJ3ZpZXcgZW5naW5lJywgJ2VqcycpO1xuXG4gICAgLy8gY29tcHJlc3Npb25cbiAgICBpZiAodGhpcy5jb25maWcuZW5hYmxlR1ppcENvbXByZXNzaW9uKVxuICAgICAgZXhwcmVzc0FwcC51c2UoY29tcHJlc3Npb24oKSk7XG5cbiAgICAvLyBwdWJsaWMgZm9sZGVyXG4gICAgZXhwcmVzc0FwcC51c2UoZXhwcmVzcy5zdGF0aWModGhpcy5jb25maWcucHVibGljRGlyZWN0b3J5KSk7XG5cbiAgICAvLyB1c2UgaHR0cHNcbiAgICBjb25zdCB1c2VIdHRwcyA9IHRoaXMuY29uZmlnLnVzZUh0dHBzIHx8wqBmYWxzZTtcbiAgICAvLyBsYXVuY2ggaHR0cChzKSBzZXJ2ZXJcbiAgICBpZiAoIXVzZUh0dHBzKSB7XG4gICAgICB0aGlzLl9ydW5IdHRwU2VydmVyKGV4cHJlc3NBcHApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBodHRwc0luZm9zID0gdGhpcy5jb25maWcuaHR0cHNJbmZvcztcblxuICAgICAgLy8gdXNlIGdpdmVuIGNlcnRpZmljYXRlXG4gICAgICBpZiAoaHR0cHNJbmZvcy5rZXkgJiYgaHR0cHNJbmZvcy5jZXJ0KSB7XG4gICAgICAgIGNvbnN0IGtleSA9IGZzLnJlYWRGaWxlU3luYyhodHRwc0luZm9zLmtleSk7XG4gICAgICAgIGNvbnN0IGNlcnQgPSBmcy5yZWFkRmlsZVN5bmMoaHR0cHNJbmZvcy5jZXJ0KTtcblxuICAgICAgICB0aGlzLl9ydW5IdHRwc1NlcnZlcihleHByZXNzQXBwLCBrZXksIGNlcnQpO1xuICAgICAgLy8gZ2VuZXJhdGUgY2VydGlmaWNhdGUgb24gdGhlIGZseSAoZm9yIGRldmVsb3BtZW50IHB1cnBvc2VzKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGVtLmNyZWF0ZUNlcnRpZmljYXRlKHsgZGF5czogMSwgc2VsZlNpZ25lZDogdHJ1ZSB9LCAoZXJyLCBrZXlzKSA9PiB7XG4gICAgICAgICAgdGhpcy5fcnVuSHR0cHNTZXJ2ZXIoZXhwcmVzc0FwcCwga2V5cy5zZXJ2aWNlS2V5LCBrZXlzLmNlcnRpZmljYXRlKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIHJvdXRlIGZvciBhIGdpdmVuIGBjbGllbnRUeXBlYCwgYWxsb3cgdG8gZGVmaW5lIGEgbW9yZSBjb21wbGV4XG4gICAqIHJvdXRpbmcgKGFkZGl0aW9ubmFsIHJvdXRlIHBhcmFtZXRlcnMpIGZvciBhIGdpdmVuIHR5cGUgb2YgY2xpZW50LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2xpZW50VHlwZSAtIFR5cGUgb2YgdGhlIGNsaWVudC5cbiAgICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfSByb3V0ZSAtIFRlbXBsYXRlIG9mIHRoZSByb3V0ZSB0aGF0IHNob3VsZCBiZSBhcHBlbmQuXG4gICAqICB0byB0aGUgY2xpZW50IHR5cGVcbiAgICogQGV4YW1wbGVcbiAgICogYGBgXG4gICAqIC8vIGFsbG93IGBjb25kdWN0b3JgIGNsaWVudHMgdG8gY29ubmVjdCB0byBgaHR0cDovL3NpdGUuY29tL2NvbmR1Y3Rvci8xYFxuICAgKiBzZXJ2ZXIucmVnaXN0ZXJSb3V0ZSgnY29uZHVjdG9yJywgJy86cGFyYW0nKVxuICAgKiBgYGBcbiAgICovXG4gIGRlZmluZVJvdXRlKGNsaWVudFR5cGUsIHJvdXRlKSB7XG4gICAgdGhpcy5fcm91dGVzW2NsaWVudFR5cGVdID0gcm91dGU7XG4gIH0sXG5cblxuICBzZXRDbGllbnRDb25maWdEZWZpbml0aW9uKGZ1bmMpIHtcbiAgICB0aGlzLl9jbGllbnRDb25maWdEZWZpbml0aW9uID0gZnVuYztcbiAgfSxcblxuICAvKipcbiAgICogTGF1bmNoIGEgaHR0cCBzZXJ2ZXIuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfcnVuSHR0cFNlcnZlcihleHByZXNzQXBwKSB7XG4gICAgY29uc3QgaHR0cFNlcnZlciA9IGh0dHAuY3JlYXRlU2VydmVyKGV4cHJlc3NBcHApO1xuICAgIHRoaXMuX2luaXRTb2NrZXRzKGh0dHBTZXJ2ZXIpO1xuICAgIHRoaXMuX2luaXRBY3Rpdml0aWVzKGV4cHJlc3NBcHApO1xuXG4gICAgaHR0cFNlcnZlci5saXN0ZW4oZXhwcmVzc0FwcC5nZXQoJ3BvcnQnKSwgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCB1cmwgPSBgaHR0cDovLzEyNy4wLjAuMToke2V4cHJlc3NBcHAuZ2V0KCdwb3J0Jyl9YDtcbiAgICAgIGNvbnNvbGUubG9nKCdbSFRUUCBTRVJWRVJdIFNlcnZlciBsaXN0ZW5pbmcgb24nLCB1cmwpO1xuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBMYXVuY2ggYSBodHRwcyBzZXJ2ZXIuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfcnVuSHR0cHNTZXJ2ZXIoZXhwcmVzc0FwcCwga2V5LCBjZXJ0KSB7XG4gICAgY29uc3QgaHR0cHNTZXJ2ZXIgPSBodHRwcy5jcmVhdGVTZXJ2ZXIoeyBrZXksIGNlcnQgfSwgZXhwcmVzc0FwcCk7XG4gICAgdGhpcy5faW5pdFNvY2tldHMoaHR0cHNTZXJ2ZXIpO1xuICAgIHRoaXMuX2luaXRBY3Rpdml0aWVzKGV4cHJlc3NBcHApO1xuXG4gICAgaHR0cHNTZXJ2ZXIubGlzdGVuKGV4cHJlc3NBcHAuZ2V0KCdwb3J0JyksIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgdXJsID0gYGh0dHBzOi8vMTI3LjAuMC4xOiR7ZXhwcmVzc0FwcC5nZXQoJ3BvcnQnKX1gO1xuICAgICAgY29uc29sZS5sb2coJ1tIVFRQUyBTRVJWRVJdIFNlcnZlciBsaXN0ZW5pbmcgb24nLCB1cmwpO1xuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBJbml0IHdlYnNvY2tldCBzZXJ2ZXIuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaW5pdFNvY2tldHMoaHR0cFNlcnZlcikge1xuICAgIHRoaXMuaW8gPSBuZXcgSU8oaHR0cFNlcnZlciwgdGhpcy5jb25maWcuc29ja2V0SU8pO1xuXG4gICAgaWYgKHRoaXMuY29uZmlnLmNvcmRvdmEgJiYgdGhpcy5jb25maWcuY29yZG92YS5zb2NrZXRJTykgLy8gSU8gYWRkIHNvbWUgY29uZmlndXJhdGlvbiBvcHRpb25zIHRvIHRoZSBvYmplY3RcbiAgICAgIHRoaXMuY29uZmlnLmNvcmRvdmEuc29ja2V0SU8gPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmNvbmZpZy5zb2NrZXRJTywgdGhpcy5jb25maWcuY29yZG92YS5zb2NrZXRJTyk7XG5cbiAgICBzb2NrZXRzLmluaXRpYWxpemUodGhpcy5pbyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFN0YXJ0IGFsbCBhY3Rpdml0aWVzIGFuZCBtYXAgdGhlIHJvdXRlcyAoY2xpZW50VHlwZSAvIGFjdGl2aXRpZXMgbWFwcGluZykuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaW5pdEFjdGl2aXRpZXMoZXhwcmVzc0FwcCkge1xuICAgIHRoaXMuX2FjdGl2aXRpZXMuZm9yRWFjaCgoYWN0aXZpdHkpID0+IGFjdGl2aXR5LnN0YXJ0KCkpO1xuXG4gICAgdGhpcy5fYWN0aXZpdGllcy5mb3JFYWNoKChhY3Rpdml0eSkgPT4ge1xuICAgICAgdGhpcy5fc2V0TWFwKGFjdGl2aXR5LmNsaWVudFR5cGVzLCBhY3Rpdml0eSk7XG4gICAgfSk7XG5cbiAgICAvLyBtYXAgYGNsaWVudFR5cGVgIHRvIHRoZWlyIHJlc3BlY3RpdmUgYWN0aXZpdGllc1xuICAgIGZvciAobGV0IGNsaWVudFR5cGUgaW4gdGhpcy5fY2xpZW50VHlwZUFjdGl2aXRpZXNNYXApIHtcbiAgICAgIGlmIChjbGllbnRUeXBlICE9PSB0aGlzLmNvbmZpZy5kZWZhdWx0Q2xpZW50KSB7XG4gICAgICAgIGNvbnN0IGFjdGl2aXRpZXMgPSB0aGlzLl9jbGllbnRUeXBlQWN0aXZpdGllc01hcFtjbGllbnRUeXBlXTtcbiAgICAgICAgdGhpcy5fbWFwKGNsaWVudFR5cGUsIGFjdGl2aXRpZXMsIGV4cHJlc3NBcHApO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIG1ha2Ugc3VyZSBgZGVmYXVsdENsaWVudGAgKGFrYSBgcGxheWVyYCkgaXMgbWFwcGVkIGxhc3RcbiAgICBmb3IgKGxldCBjbGllbnRUeXBlIGluIHRoaXMuX2NsaWVudFR5cGVBY3Rpdml0aWVzTWFwKSB7XG4gICAgICBpZiAoY2xpZW50VHlwZSA9PT0gdGhpcy5jb25maWcuZGVmYXVsdENsaWVudCkge1xuICAgICAgICBjb25zdCBhY3Rpdml0aWVzID0gdGhpcy5fY2xpZW50VHlwZUFjdGl2aXRpZXNNYXBbY2xpZW50VHlwZV07XG4gICAgICAgIHRoaXMuX21hcChjbGllbnRUeXBlLCBhY3Rpdml0aWVzLCBleHByZXNzQXBwKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIE1hcCBhIGNsaWVudCB0eXBlIHRvIGEgcm91dGUsIGEgc2V0IG9mIGFjdGl2aXRpZXMuXG4gICAqIEFkZGl0aW9ubmFsbHkgbGlzdGVuIGZvciB0aGVpciBzb2NrZXQgY29ubmVjdGlvbi5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9tYXAoY2xpZW50VHlwZSwgYWN0aXZpdGllcywgZXhwcmVzc0FwcCkge1xuICAgIGxldCByb3V0ZSA9ICcnO1xuXG4gICAgaWYgKHRoaXMuX3JvdXRlc1tjbGllbnRUeXBlXSlcbiAgICAgIHJvdXRlICs9IHRoaXMuX3JvdXRlc1tjbGllbnRUeXBlXTtcblxuICAgIGlmIChjbGllbnRUeXBlICE9PSB0aGlzLmNvbmZpZy5kZWZhdWx0Q2xpZW50KVxuICAgICAgcm91dGUgPSBgLyR7Y2xpZW50VHlwZX0ke3JvdXRlfWA7XG5cbiAgICAvLyBkZWZpbmUgdGVtcGxhdGUgZmlsZW5hbWU6IGAke2NsaWVudFR5cGV9LmVqc2Agb3IgYGRlZmF1bHQuZWpzYFxuICAgIGNvbnN0IHRlbXBsYXRlRGlyZWN0b3J5ID0gdGhpcy5jb25maWcudGVtcGxhdGVEaXJlY3Rvcnk7XG4gICAgY29uc3QgY2xpZW50VG1wbCA9IHBhdGguam9pbih0ZW1wbGF0ZURpcmVjdG9yeSwgYCR7Y2xpZW50VHlwZX0uZWpzYCk7XG4gICAgY29uc3QgZGVmYXVsdFRtcGwgPSBwYXRoLmpvaW4odGVtcGxhdGVEaXJlY3RvcnksIGBkZWZhdWx0LmVqc2ApO1xuXG4gICAgZnMuc3RhdChjbGllbnRUbXBsLCAoZXJyLCBzdGF0cykgPT4ge1xuICAgICAgbGV0IHRlbXBsYXRlO1xuXG4gICAgICBpZiAoZXJyIHx8ICFzdGF0cy5pc0ZpbGUoKSlcbiAgICAgICAgdGVtcGxhdGUgPSBkZWZhdWx0VG1wbDtcbiAgICAgIGVsc2VcbiAgICAgICAgdGVtcGxhdGUgPSBjbGllbnRUbXBsO1xuXG4gICAgICBjb25zdCB0bXBsU3RyaW5nID0gZnMucmVhZEZpbGVTeW5jKHRlbXBsYXRlLCB7IGVuY29kaW5nOiAndXRmOCcgfSk7XG4gICAgICBjb25zdCB0bXBsID0gZWpzLmNvbXBpbGUodG1wbFN0cmluZyk7XG5cbiAgICAgIC8vIGh0dHAgcmVxdWVzdFxuICAgICAgZXhwcmVzc0FwcC5nZXQocm91dGUsIChyZXEsIHJlcykgPT4ge1xuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5fY2xpZW50Q29uZmlnRGVmaW5pdGlvbihjbGllbnRUeXBlLCB0aGlzLmNvbmZpZywgcmVxKTtcbiAgICAgICAgY29uc3QgYXBwSW5kZXggPSB0bXBsKHsgZGF0YSB9KTtcbiAgICAgICAgcmVzLnNlbmQoYXBwSW5kZXgpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIHNvY2tldCBjb25ubmVjdGlvblxuICAgICAgdGhpcy5pby5vZihjbGllbnRUeXBlKS5vbignY29ubmVjdGlvbicsIChzb2NrZXQpID0+IHtcbiAgICAgICAgdGhpcy5fb25Tb2NrZXRDb25uZWN0aW9uKGNsaWVudFR5cGUsIHNvY2tldCwgYWN0aXZpdGllcyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogU29ja2V0IGNvbm5lY3Rpb24gY2FsbGJhY2suXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfb25Tb2NrZXRDb25uZWN0aW9uKGNsaWVudFR5cGUsIHNvY2tldCwgYWN0aXZpdGllcykge1xuICAgIGNvbnN0IGNsaWVudCA9IG5ldyBDbGllbnQoY2xpZW50VHlwZSwgc29ja2V0KTtcblxuICAgIC8vIGdsb2JhbCBsaWZlY3ljbGUgb2YgdGhlIGNsaWVudFxuICAgIHNvY2tldHMucmVjZWl2ZShjbGllbnQsICdkaXNjb25uZWN0JywgKCkgPT4ge1xuICAgICAgYWN0aXZpdGllcy5mb3JFYWNoKChhY3Rpdml0eSkgPT4gYWN0aXZpdHkuZGlzY29ubmVjdChjbGllbnQpKTtcbiAgICAgIGNsaWVudC5kZXN0cm95KCk7XG5cbiAgICAgIGlmIChsb2dnZXIuaW5mbylcbiAgICAgICAgbG9nZ2VyLmluZm8oeyBzb2NrZXQsIGNsaWVudFR5cGUgfSwgJ2Rpc2Nvbm5lY3QnKTtcbiAgICB9KTtcblxuICAgIHNvY2tldHMucmVjZWl2ZShjbGllbnQsICdoYW5kc2hha2UnLCAoZGF0YSkgPT4ge1xuICAgICAgY2xpZW50LnVybFBhcmFtcyA9IGRhdGEudXJsUGFyYW1zO1xuICAgICAgLy8gQHRvZG8gLSBoYW5kbGUgcmVjb25uZWN0aW9uIChleDogYGRhdGFgIGNvbnRhaW5zIGFuIGB1dWlkYClcbiAgICAgIGFjdGl2aXRpZXMuZm9yRWFjaCgoYWN0aXZpdHkpID0+IGFjdGl2aXR5LmNvbm5lY3QoY2xpZW50KSk7XG4gICAgICBzb2NrZXRzLnNlbmQoY2xpZW50LCAnY2xpZW50OnN0YXJ0JywgY2xpZW50LnV1aWQpO1xuXG4gICAgICBpZiAobG9nZ2VyLmluZm8pXG4gICAgICAgIGxvZ2dlci5pbmZvKHsgc29ja2V0LCBjbGllbnRUeXBlIH0sICdoYW5kc2hha2UnKTtcbiAgICB9KTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHNlcnZlcjtcbiJdfQ==