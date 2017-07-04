'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

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
 *  should be loaded, this value can refer to a separate server for scalability.
 *  The value should be used client-side to configure the `audio-buffer-manager`
 *  service.
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
 * @property {Object} websockets - Websockets configuration (socket.io)
 * @property {String} websockets.url - Optionnal url where the socket should
 *  connect.
 * @property {Array} websockets.transports - List of the transport mecanims that
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
   * Configuration informations, all config objects passed to the
   * [`server.init`]{@link module:soundworks/server.server.init} are merged
   * into this object.
   * @type {module:soundworks/server.server~serverConfig}
   */
  config: {},

  /**
   * The url of the node server on the current machine.
   * @private
   */
  _address: '',

  /**
   * Mapping between a `clientType` and its related activities.
   * @private
   */
  _clientTypeActivitiesMap: {},

  /**
   * express instance, can allow to expose additionnal routes (e.g. REST API).
   * @unstable
   */
  router: null,

  /**
   * HTTP(S) server instance.
   * @unstable
   */
  httpServer: null,

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

  get clientTypes() {
    return (0, _keys2.default)(this._clientTypeActivitiesMap);
  },

  /**
   * Return a service configured with the given options.
   * @param {String} id - Identifier of the service.
   * @param {Object} options - Options to configure the service.
   */
  require: function require(id, options) {
    return _serviceManager2.default.require(id, options);
  },


  /**
   * Default for the module:soundworks/server.server~clientConfigDefinition
   * @private
   */
  _clientConfigDefinition: function _clientConfigDefinition(clientType, serverConfig, httpRequest) {
    return { clientType: clientType };
  },

  /**
   * @callback module:soundworks/server.server~clientConfigDefinition
   * @param {String} clientType - Type of the client.
   * @param {Object} serverConfig - Configuration of the server.
   * @param {Object} httpRequest - Http request for the `index.html`
   * @return {Object}
   */
  /**
   * Set the {@link module:soundworks/server.server~clientConfigDefinition} with
   * a user defined function.
   * @param {module:soundworks/server.server~clientConfigDefinition} func - A
   *  function that returns the data that will be used to populate the `index.html`
   *  template. The function could (and should) be used to pass configuration
   *  to the soundworks client.
   * @see {@link module:soundworks/client.client~init}
   */
  setClientConfigDefinition: function setClientConfigDefinition(func) {
    this._clientConfigDefinition = func;
  },


  /**
   * Register a route for a given `clientType`, allow to define a more complex
   * routing (additionnal route parameters) for a given type of client.
   * @param {String} clientType - Type of the client.
   * @param {String|RegExp} route - Template of the route that should be append.
   *  to the client type
   *
   * @example
   * ```
   * // allow `conductor` clients to connect to `http://site.com/conductor/1`
   * server.registerRoute('conductor', '/:param')
   * ```
   */
  defineRoute: function defineRoute(clientType, route) {
    this._routes[clientType] = route;
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
   * Initialize the server with the given configuration.
   * At the end of the init step the express router is available.
   *
   * @param {module:soundworks/server.server~serverConfig} config -
   *  Configuration of the application.
   */
  init: function init(config) {
    this.config = config;
    this._populateDefaultConfig();

    _serviceManager2.default.init();

    if (this.config.logger !== undefined) _logger2.default.init(this.config.logger);

    // instanciate and configure express
    // this allows to hook middleware and routes (e.g. cors) in the express
    // instance between `server.init` and `server.start`
    this.router = new _express2.default();
    this.router.set('port', process.env.PORT || this.config.port);
    this.router.set('view engine', 'ejs');
    // allow promise based syntax for server initialization
    return _promise2.default.resolve();
  },


  /**
   * Start the application:
   * - launch the http(s) server.
   * - launch the socket server.
   * - start all registered activities.
   * - define routes and activities mapping for all client types.
   */
  start: function start() {
    var _this = this;

    // compression
    if (this.config.enableGZipCompression) this.router.use((0, _compression2.default)());

    // public folder
    this.router.use(_express2.default.static(this.config.publicDirectory));

    this._initActivities();
    this._initRouting(this.router);
    // expose router to allow adding some routes (e.g. REST API)
    var useHttps = this.config.useHttps || false;

    return new _promise2.default(function (resolve, reject) {
      // launch http(s) server
      if (!useHttps) {
        var httpServer = _http2.default.createServer(_this.router);
        resolve(httpServer);
      } else {
        var httpsInfos = _this.config.httpsInfos;
        // use given certificate
        if (httpsInfos.key && httpsInfos.cert) {
          var key = _fs2.default.readFileSync(httpsInfos.key);
          var cert = _fs2.default.readFileSync(httpsInfos.cert);
          var httpsServer = _https2.default.createServer({ key: key, cert: cert }, _this.router);
          resolve(httpsServer);
          // generate certificate on the fly (for development purposes)
        } else {
          _pem2.default.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
            var httpsServer = _https2.default.createServer({
              key: keys.serviceKey,
              cert: keys.certificate
            }, _this.router);

            resolve(httpsServer);
          });
        }
      }
    }).then(function (httpServer) {
      _this._initSockets(httpServer);

      _this.httpServer = httpServer;

      _serviceManager2.default.signals.ready.addObserver(function () {
        httpServer.listen(_this.router.get('port'), function () {
          var protocol = useHttps ? 'https' : 'http';
          _this._address = protocol + '://127.0.0.1:' + _this.router.get('port');
          console.log('[' + protocol.toUpperCase() + ' SERVER] Server listening on', _this._address);
        });
      });

      _serviceManager2.default.start();
    }).catch(function (err) {
      return console.error(err.stack);
    });
  },


  /**
   * Map activities to their respective client type(s) and start them all.
   * @private
   */
  _initActivities: function _initActivities() {
    var _this2 = this;

    this._activities.forEach(function (activity) {
      _this2._mapClientTypesToActivity(activity.clientTypes, activity);
    });
  },


  /**
   * Init routing for each client. The default client route must be created last.
   * @private
   */
  _initRouting: function _initRouting(router) {
    for (var clientType in this._clientTypeActivitiesMap) {
      if (clientType !== this.config.defaultClient) this._openClientRoute(clientType, router);
    }

    for (var _clientType in this._clientTypeActivitiesMap) {
      if (_clientType === this.config.defaultClient) this._openClientRoute(_clientType, router);
    }
  },


  /**
   * Init websocket server.
   * @private
   */
  _initSockets: function _initSockets(httpServer) {
    var _this3 = this;

    _sockets2.default.init(httpServer, this.config.websockets);
    // socket connnection
    _sockets2.default.onConnection(this.clientTypes, function (clientType, socket) {
      _this3._onSocketConnection(clientType, socket);
    });
  },


  /**
  * Populate mandatory configuration options
  * @private
  */
  _populateDefaultConfig: function _populateDefaultConfig() {
    if (this.config.port === undefined) this.config.port = 8000;

    if (this.config.enableGZipCompression === undefined) this.config.enableGZipCompression = true;

    if (this.config.publicDirectory === undefined) this.config.publicDirectory = _path2.default.join(process.cwd(), 'public');

    if (this.config.templateDirectory === undefined) this.config.templateDirectory = _path2.default.join(process.cwd(), 'html');

    if (this.config.defaultClient === undefined) this.config.defaultClient = 'player';

    if (this.config.websockets === undefined) this.config.websockets = {};
  },


  /**
   * Map client types with an activity.
   * @param {Array<String>} clientTypes - List of client type.
   * @param {Activity} activity - Activity concerned with the given `clientTypes`.
   * @private
   */
  _mapClientTypesToActivity: function _mapClientTypesToActivity(clientTypes, activity) {
    var _this4 = this;

    clientTypes.forEach(function (clientType) {
      if (!_this4._clientTypeActivitiesMap[clientType]) _this4._clientTypeActivitiesMap[clientType] = new _set2.default();

      _this4._clientTypeActivitiesMap[clientType].add(activity);
    });
  },


  /**
   * Open the route for the given client.
   * @private
   */
  _openClientRoute: function _openClientRoute(clientType, router) {
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
      router.get(route, function (req, res) {
        var data = _this5._clientConfigDefinition(clientType, _this5.config, req);
        var appIndex = tmpl({ data: data });
        res.send(appIndex);
      });
    });
  },


  /**
   * Socket connection callback.
   * @private
   */
  _onSocketConnection: function _onSocketConnection(clientType, socket) {
    var _this6 = this;

    var client = new _Client2.default(clientType, socket);
    var activities = this._clientTypeActivitiesMap[clientType];

    // global lifecycle of the client
    _sockets2.default.receive(client, 'disconnect', function () {
      activities.forEach(function (activity) {
        return activity.disconnect(client);
      });
      client.destroy();

      if (_logger2.default.info) _logger2.default.info({ socket: socket, clientType: clientType }, 'disconnect');
    });

    // check coherence between client-side and server-side service requirements
    var serverRequiredServices = _serviceManager2.default.getRequiredServices(clientType);
    var serverServicesList = _serviceManager2.default.getServiceList();

    _sockets2.default.receive(client, 'handshake', function (data) {
      // in development, if service required client-side but not server-side,
      // complain properly client-side.
      if (_this6.config.env !== 'production') {
        var clientRequiredServices = data.requiredServices || [];
        var missingServices = [];

        clientRequiredServices.forEach(function (serviceId) {
          if (serverServicesList.indexOf(serviceId) !== -1 && serverRequiredServices.indexOf(serviceId) === -1) {
            missingServices.push(serviceId);
          }
        });

        if (missingServices.length > 0) {
          _sockets2.default.send(client, 'client:error', {
            type: 'services',
            data: missingServices
          });
          return;
        }
      }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZlci5qcyJdLCJuYW1lcyI6WyJzZXJ2ZXIiLCJjb25maWciLCJfYWRkcmVzcyIsIl9jbGllbnRUeXBlQWN0aXZpdGllc01hcCIsInJvdXRlciIsImh0dHBTZXJ2ZXIiLCJfYWN0aXZpdGllcyIsIl9yb3V0ZXMiLCJjbGllbnRUeXBlcyIsInJlcXVpcmUiLCJpZCIsIm9wdGlvbnMiLCJfY2xpZW50Q29uZmlnRGVmaW5pdGlvbiIsImNsaWVudFR5cGUiLCJzZXJ2ZXJDb25maWciLCJodHRwUmVxdWVzdCIsInNldENsaWVudENvbmZpZ0RlZmluaXRpb24iLCJmdW5jIiwiZGVmaW5lUm91dGUiLCJyb3V0ZSIsInNldEFjdGl2aXR5IiwiYWN0aXZpdHkiLCJhZGQiLCJpbml0IiwiX3BvcHVsYXRlRGVmYXVsdENvbmZpZyIsImxvZ2dlciIsInVuZGVmaW5lZCIsInNldCIsInByb2Nlc3MiLCJlbnYiLCJQT1JUIiwicG9ydCIsInJlc29sdmUiLCJzdGFydCIsImVuYWJsZUdaaXBDb21wcmVzc2lvbiIsInVzZSIsInN0YXRpYyIsInB1YmxpY0RpcmVjdG9yeSIsIl9pbml0QWN0aXZpdGllcyIsIl9pbml0Um91dGluZyIsInVzZUh0dHBzIiwicmVqZWN0IiwiY3JlYXRlU2VydmVyIiwiaHR0cHNJbmZvcyIsImtleSIsImNlcnQiLCJyZWFkRmlsZVN5bmMiLCJodHRwc1NlcnZlciIsImNyZWF0ZUNlcnRpZmljYXRlIiwiZGF5cyIsInNlbGZTaWduZWQiLCJlcnIiLCJrZXlzIiwic2VydmljZUtleSIsImNlcnRpZmljYXRlIiwidGhlbiIsIl9pbml0U29ja2V0cyIsInNpZ25hbHMiLCJyZWFkeSIsImFkZE9ic2VydmVyIiwibGlzdGVuIiwiZ2V0IiwicHJvdG9jb2wiLCJjb25zb2xlIiwibG9nIiwidG9VcHBlckNhc2UiLCJjYXRjaCIsImVycm9yIiwic3RhY2siLCJmb3JFYWNoIiwiX21hcENsaWVudFR5cGVzVG9BY3Rpdml0eSIsImRlZmF1bHRDbGllbnQiLCJfb3BlbkNsaWVudFJvdXRlIiwid2Vic29ja2V0cyIsIm9uQ29ubmVjdGlvbiIsInNvY2tldCIsIl9vblNvY2tldENvbm5lY3Rpb24iLCJqb2luIiwiY3dkIiwidGVtcGxhdGVEaXJlY3RvcnkiLCJjbGllbnRUbXBsIiwiZGVmYXVsdFRtcGwiLCJzdGF0Iiwic3RhdHMiLCJ0ZW1wbGF0ZSIsImlzRmlsZSIsInRtcGxTdHJpbmciLCJlbmNvZGluZyIsInRtcGwiLCJjb21waWxlIiwicmVxIiwicmVzIiwiZGF0YSIsImFwcEluZGV4Iiwic2VuZCIsImNsaWVudCIsImFjdGl2aXRpZXMiLCJyZWNlaXZlIiwiZGlzY29ubmVjdCIsImRlc3Ryb3kiLCJpbmZvIiwic2VydmVyUmVxdWlyZWRTZXJ2aWNlcyIsImdldFJlcXVpcmVkU2VydmljZXMiLCJzZXJ2ZXJTZXJ2aWNlc0xpc3QiLCJnZXRTZXJ2aWNlTGlzdCIsImNsaWVudFJlcXVpcmVkU2VydmljZXMiLCJyZXF1aXJlZFNlcnZpY2VzIiwibWlzc2luZ1NlcnZpY2VzIiwic2VydmljZUlkIiwiaW5kZXhPZiIsInB1c2giLCJsZW5ndGgiLCJ0eXBlIiwidXJsUGFyYW1zIiwiY29ubmVjdCIsInV1aWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBd0VBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQkEsSUFBTUEsU0FBUztBQUNiOzs7Ozs7QUFNQUMsVUFBUSxFQVBLOztBQVNiOzs7O0FBSUFDLFlBQVUsRUFiRzs7QUFlYjs7OztBQUlBQyw0QkFBMEIsRUFuQmI7O0FBcUJiOzs7O0FBSUFDLFVBQVEsSUF6Qks7O0FBMkJiOzs7O0FBSUFDLGNB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QUFDQUQsNEJBQWdCRyxJQUFoQixDQUFxQkYsU0FBckI7QUFDRDtBQUNGLFNBUEQ7O0FBU0EsWUFBSUQsZ0JBQWdCSSxNQUFoQixHQUF5QixDQUE3QixFQUFnQztBQUM5Qiw0QkFBUWpCLElBQVIsQ0FBYUMsTUFBYixFQUFxQixjQUFyQixFQUFxQztBQUNuQ2lCLGtCQUFNLFVBRDZCO0FBRW5DcEIsa0JBQU1lO0FBRjZCLFdBQXJDO0FBSUE7QUFDRDtBQUNGOztBQUVEWixhQUFPa0IsU0FBUCxHQUFtQnJCLEtBQUtxQixTQUF4QjtBQUNBO0FBQ0FqQixpQkFBVzNCLE9BQVgsQ0FBbUIsVUFBQ2hELFFBQUQ7QUFBQSxlQUFjQSxTQUFTNkYsT0FBVCxDQUFpQm5CLE1BQWpCLENBQWQ7QUFBQSxPQUFuQjtBQUNBLHdCQUFRRCxJQUFSLENBQWFDLE1BQWIsRUFBcUIsY0FBckIsRUFBcUNBLE9BQU9vQixJQUE1Qzs7QUFFQSxVQUFJLGlCQUFPZixJQUFYLEVBQ0UsaUJBQU9BLElBQVAsQ0FBWSxFQUFFekIsY0FBRixFQUFVOUQsc0JBQVYsRUFBWixFQUFvQyxXQUFwQztBQUNILEtBaENEO0FBaUNEO0FBbFhZLENBQWY7O2tCQXFYZWIsTSIsImZpbGUiOiJzZXJ2ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ2xpZW50IGZyb20gJy4vQ2xpZW50JztcbmltcG9ydCBjb21wcmVzc2lvbiBmcm9tICdjb21wcmVzc2lvbic7XG5pbXBvcnQgZWpzIGZyb20gJ2Vqcyc7XG5pbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgaHR0cCBmcm9tICdodHRwJztcbmltcG9ydCBodHRwcyBmcm9tICdodHRwcyc7XG5pbXBvcnQgbG9nZ2VyIGZyb20gJy4uL3V0aWxzL2xvZ2dlcic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBwZW0gZnJvbSAncGVtJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBzb2NrZXRzIGZyb20gJy4vc29ja2V0cyc7XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLnNlcnZlcn5zZXJ2ZXJDb25maWdcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuc2VydmVyXG4gKlxuICogQHByb3BlcnR5IHtTdHJpbmd9IGFwcE5hbWUgLSBOYW1lIG9mIHRoZSBhcHBsaWNhdGlvbiwgdXNlZCBpbiB0aGUgYC5lanNgXG4gKiAgdGVtcGxhdGUgYW5kIGJ5IGRlZmF1bHQgaW4gdGhlIGBwbGF0Zm9ybWAgc2VydmljZSB0byBwb3B1bGF0ZSBpdHMgdmlldy5cbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBlbnYgLSBOYW1lIG9mIHRoZSBlbnZpcm9ubmVtZW50ICgncHJvZHVjdGlvbicgZW5hYmxlXG4gKiAgY2FjaGUgaW4gZXhwcmVzcyBhcHBsaWNhdGlvbikuXG4gKiBAcHJvcGVydHkge1N0cmluZ30gdmVyc2lvbiAtIFZlcnNpb24gb2YgYXBwbGljYXRpb24sIGNhbiBiZSB1c2VkIHRvIGZvcmNlXG4gKiAgcmVsb2FkIGNzcyBhbmQganMgZmlsZXMgZnJvbSBzZXJ2ZXIgKGNmLiBgaHRtbC9kZWZhdWx0LmVqc2ApXG4gKiBAcHJvcGVydHkge1N0cmluZ30gZGVmYXVsdENsaWVudCAtIE5hbWUgb2YgdGhlIGRlZmF1bHQgY2xpZW50IHR5cGUsXG4gKiAgaS5lLiB0aGUgY2xpZW50IHRoYXQgY2FuIGFjY2VzcyB0aGUgYXBwbGljYXRpb24gYXQgaXRzIHJvb3QgVVJMXG4gKiBAcHJvcGVydHkge1N0cmluZ30gYXNzZXRzRG9tYWluIC0gRGVmaW5lIGZyb20gd2hlcmUgdGhlIGFzc2V0cyAoc3RhdGljIGZpbGVzKVxuICogIHNob3VsZCBiZSBsb2FkZWQsIHRoaXMgdmFsdWUgY2FuIHJlZmVyIHRvIGEgc2VwYXJhdGUgc2VydmVyIGZvciBzY2FsYWJpbGl0eS5cbiAqICBUaGUgdmFsdWUgc2hvdWxkIGJlIHVzZWQgY2xpZW50LXNpZGUgdG8gY29uZmlndXJlIHRoZSBgYXVkaW8tYnVmZmVyLW1hbmFnZXJgXG4gKiAgc2VydmljZS5cbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBwb3J0IC0gUG9ydCB1c2VkIHRvIG9wZW4gdGhlIGh0dHAgc2VydmVyLCBpbiBwcm9kdWN0aW9uXG4gKiAgdGhpcyB2YWx1ZSBpcyB0eXBpY2FsbHkgODBcbiAqXG4gKiBAcHJvcGVydHkge09iamVjdH0gc2V0dXAgLSBEZXNjcmliZSB0aGUgbG9jYXRpb24gd2hlcmUgdGhlIGV4cGVyaWVuY2UgdGFrZXNcbiAqICBwbGFjZXMsIHRoZXNlcyB2YWx1ZXMgYXJlIHVzZWQgYnkgdGhlIGBwbGFjZXJgLCBgY2hlY2tpbmAgYW5kIGBsb2NhdG9yYFxuICogIHNlcnZpY2VzLiBJZiBvbmUgb2YgdGhlc2Ugc2VydmljZSBpcyByZXF1aXJlZCwgdGhpcyBlbnRyeSBtYW5kYXRvcnkuXG4gKiBAcHJvcGVydHkge09iamVjdH0gc2V0dXAuYXJlYSAtIERlc2NyaXB0aW9uIG9mIHRoZSBhcmVhLlxuICogQHByb3BlcnR5IHtOdW1iZXJ9IHNldHVwLmFyZWEud2lkdGggLSBXaWR0aCBvZiB0aGUgYXJlYS5cbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBzZXR1cC5hcmVhLmhlaWdodCAtIEhlaWdodCBvZiB0aGUgYXJlYS5cbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBzZXR1cC5hcmVhLmJhY2tncm91bmQgLSBQYXRoIHRvIGFuIGltYWdlIHRvIGJlIHVzZWQgaW5cbiAqICB0aGUgYXJlYSByZXByZXNlbnRhdGlvbi5cbiAqIEBwcm9wZXJ0eSB7QXJyYXl9IHNldHVwLmxhYmVscyAtIE9wdGlvbm5hbCBsaXN0IG9mIHByZWRlZmluZWQgbGFiZWxzLlxuICogQHByb3BlcnR5IHtBcnJheX0gc2V0dXAuY29vcmRpbmF0ZXMgLSBPcHRpb25uYWwgbGlzdCBvZiBwcmVkZWZpbmVkIGNvb3JkaW5hdGVzLlxuICogQHByb3BlcnR5IHtBcnJheX0gc2V0dXAubWF4Q2xpZW50c1BlclBvc2l0aW9uIC0gTWF4aW11bSBudW1iZXIgb2YgY2xpZW50c1xuICogIGFsbG93ZWQgaW4gYSBwb3NpdGlvbi5cbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBzZXR1cC5jYXBhY2l0eSAtIE1heGltdW0gbnVtYmVyIG9mIHBvc2l0aW9ucyAobWF5IGxpbWl0XG4gKiBvciBiZSBsaW1pdGVkIGJ5IHRoZSBudW1iZXIgb2YgbGFiZWxzIGFuZC9vciBjb29yZGluYXRlcykuXG4gKlxuICogQHByb3BlcnR5IHtPYmplY3R9IHdlYnNvY2tldHMgLSBXZWJzb2NrZXRzIGNvbmZpZ3VyYXRpb24gKHNvY2tldC5pbylcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSB3ZWJzb2NrZXRzLnVybCAtIE9wdGlvbm5hbCB1cmwgd2hlcmUgdGhlIHNvY2tldCBzaG91bGRcbiAqICBjb25uZWN0LlxuICogQHByb3BlcnR5IHtBcnJheX0gd2Vic29ja2V0cy50cmFuc3BvcnRzIC0gTGlzdCBvZiB0aGUgdHJhbnNwb3J0IG1lY2FuaW1zIHRoYXRcbiAqICBzaG91bGQgYmUgdXNlZCB0byBvcGVuIG9yIGVtdWxhdGUgdGhlIHNvY2tldC5cbiAqXG4gKiBAcHJvcGVydHkge0Jvb2xlYW59IHVzZUh0dHBzIC0gIERlZmluZSBpZiB0aGUgSFRUUCBzZXJ2ZXIgc2hvdWxkIGJlIGxhdW5jaGVkXG4gKiAgdXNpbmcgc2VjdXJlIGNvbm5lY3Rpb25zLiBGb3IgZGV2ZWxvcG1lbnQgcHVycG9zZXMgd2hlbiBzZXQgdG8gYHRydWVgIGFuZCBub1xuICogIGNlcnRpZmljYXRlcyBhcmUgZ2l2ZW4gKGNmLiBgaHR0cHNJbmZvc2ApLCBhIHNlbGYtc2lnbmVkIGNlcnRpZmljYXRlIGlzXG4gKiAgY3JlYXRlZC5cbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBodHRwc0luZm9zIC0gUGF0aHMgdG8gdGhlIGtleSBhbmQgY2VydGlmaWNhdGUgdG8gYmUgdXNlZFxuICogIGluIG9yZGVyIHRvIGxhdW5jaCB0aGUgaHR0cHMgc2VydmVyLiBCb3RoIGVudHJpZXMgYXJlIHJlcXVpcmVkIG90aGVyd2lzZSBhXG4gKiAgc2VsZi1zaWduZWQgY2VydGlmaWNhdGUgaXMgZ2VuZXJhdGVkLlxuICogQHByb3BlcnR5IHtTdHJpbmd9IGh0dHBzSW5mb3MuY2VydCAtIFBhdGggdG8gdGhlIGNlcnRpZmljYXRlLlxuICogQHByb3BlcnR5IHtTdHJpbmd9IGh0dHBzSW5mb3Mua2V5IC0gUGF0aCB0byB0aGUga2V5LlxuICpcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBwYXNzd29yZCAtIFBhc3N3b3JkIHRvIGJlIHVzZWQgYnkgdGhlIGBhdXRoYCBzZXJ2aWNlLlxuICpcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBvc2MgLSBDb25maWd1cmF0aW9uIG9mIHRoZSBgb3NjYCBzZXJ2aWNlLlxuICogQHByb3BlcnR5IHtTdHJpbmd9IG9zYy5yZWNlaXZlQWRkcmVzcyAtIElQIG9mIHRoZSBjdXJyZW50bHkgcnVubmluZyBzZXJ2ZXIuXG4gKiBAcHJvcGVydHkge051bWJlcn0gb3NjLnJlY2VpdmVQb3J0IC0gUG9ydCBsaXN0ZW5pbmcgZm9yIGluY29tbWluZyBtZXNzYWdlcy5cbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBvc2Muc2VuZEFkZHJlc3MgLSBJUCBvZiB0aGUgcmVtb3RlIGFwcGxpY2F0aW9uLlxuICogQHByb3BlcnR5IHtOdW1iZXJ9IG9zYy5zZW5kUG9ydCAtIFBvcnQgd2hlcmUgdGhlIHJlbW90ZSBhcHBsaWNhdGlvbiBpc1xuICogIGxpc3RlbmluZyBmb3IgbWVzc2FnZXNcbiAqXG4gKiBAcHJvcGVydHkge0Jvb2xlYW59IGVuYWJsZUdaaXBDb21wcmVzc2lvbiAtIERlZmluZSBpZiB0aGUgc2VydmVyIHNob3VsZCB1c2VcbiAqICBnemlwIGNvbXByZXNzaW9uIGZvciBzdGF0aWMgZmlsZXMuXG4gKiBAcHJvcGVydHkge1N0cmluZ30gcHVibGljRGlyZWN0b3J5IC0gTG9jYXRpb24gb2YgdGhlIHB1YmxpYyBkaXJlY3RvcnlcbiAqICAoYWNjZXNzaWJsZSB0aHJvdWdoIGh0dHAocykgcmVxdWVzdHMpLlxuICogQHByb3BlcnR5IHtTdHJpbmd9IHRlbXBsYXRlRGlyZWN0b3J5IC0gRGlyZWN0b3J5IHdoZXJlIHRoZSBzZXJ2ZXIgdGVtcGxhdGluZ1xuICogIHN5c3RlbSBsb29rcyBmb3IgdGhlIGBlanNgIHRlbXBsYXRlcy5cbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBsb2dnZXIgLSBDb25maWd1cmF0aW9uIG9mIHRoZSBsb2dnZXIgc2VydmljZSwgY2YuIEJ1bnlhblxuICogIGRvY3VtZW50YXRpb24uXG4gKiBAcHJvcGVydHkge1N0cmluZ30gZXJyb3JSZXBvcnRlckRpcmVjdG9yeSAtIERpcmVjdG9yeSB3aGVyZSBlcnJvciByZXBvcnRlZFxuICogIGZyb20gdGhlIGNsaWVudHMgYXJlIHdyaXR0ZW4uXG4gKi9cblxuXG4vKipcbiAqIFNlcnZlciBzaWRlIGVudHJ5IHBvaW50IGZvciBhIGBzb3VuZHdvcmtzYCBhcHBsaWNhdGlvbi5cbiAqXG4gKiBUaGlzIG9iamVjdCBob3N0cyBjb25maWd1cmF0aW9uIGluZm9ybWF0aW9ucywgYXMgd2VsbCBhcyBtZXRob2RzIHRvXG4gKiBpbml0aWFsaXplIGFuZCBzdGFydCB0aGUgYXBwbGljYXRpb24uIEl0IGlzIGFsc28gcmVzcG9uc2libGUgZm9yIGNyZWF0aW5nXG4gKiB0aGUgc3RhdGljIGZpbGUgKGh0dHApIHNlcnZlciBhcyB3ZWxsIGFzIHRoZSBzb2NrZXQgc2VydmVyLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXJcbiAqIEBuYW1lc3BhY2VcbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgc291bmR3b3JrcyBmcm9tICdzb3VuZHdvcmtzL3NlcnZlcic7XG4gKiBpbXBvcnQgTXlFeHBlcmllbmNlIGZyb20gJy4vTXlFeHBlcmllbmNlJztcbiAqXG4gKiBzb3VuZHdvcmtzLnNlcnZlci5pbml0KGNvbmZpZyk7XG4gKiBjb25zdCBteUV4cGVyaWVuY2UgPSBuZXcgTXlFeHBlcmllbmNlKCk7XG4gKiBzb3VuZHdvcmtzLnNlcnZlci5zdGFydCgpO1xuICovXG5jb25zdCBzZXJ2ZXIgPSB7XG4gIC8qKlxuICAgKiBDb25maWd1cmF0aW9uIGluZm9ybWF0aW9ucywgYWxsIGNvbmZpZyBvYmplY3RzIHBhc3NlZCB0byB0aGVcbiAgICogW2BzZXJ2ZXIuaW5pdGBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5zZXJ2ZXIuaW5pdH0gYXJlIG1lcmdlZFxuICAgKiBpbnRvIHRoaXMgb2JqZWN0LlxuICAgKiBAdHlwZSB7bW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLnNlcnZlcn5zZXJ2ZXJDb25maWd9XG4gICAqL1xuICBjb25maWc6IHt9LFxuXG4gIC8qKlxuICAgKiBUaGUgdXJsIG9mIHRoZSBub2RlIHNlcnZlciBvbiB0aGUgY3VycmVudCBtYWNoaW5lLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2FkZHJlc3M6ICcnLFxuXG4gIC8qKlxuICAgKiBNYXBwaW5nIGJldHdlZW4gYSBgY2xpZW50VHlwZWAgYW5kIGl0cyByZWxhdGVkIGFjdGl2aXRpZXMuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfY2xpZW50VHlwZUFjdGl2aXRpZXNNYXA6IHt9LFxuXG4gIC8qKlxuICAgKiBleHByZXNzIGluc3RhbmNlLCBjYW4gYWxsb3cgdG8gZXhwb3NlIGFkZGl0aW9ubmFsIHJvdXRlcyAoZS5nLiBSRVNUIEFQSSkuXG4gICAqIEB1bnN0YWJsZVxuICAgKi9cbiAgcm91dGVyOiBudWxsLFxuXG4gIC8qKlxuICAgKiBIVFRQKFMpIHNlcnZlciBpbnN0YW5jZS5cbiAgICogQHVuc3RhYmxlXG4gICAqL1xuICBodHRwU2VydmVyOiBudWxsLFxuXG4gIC8qKlxuICAgKiBSZXF1aXJlZCBhY3Rpdml0aWVzIHRoYXQgbXVzdCBiZSBzdGFydGVkLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2FjdGl2aXRpZXM6IG5ldyBTZXQoKSxcblxuICAvKipcbiAgICogT3B0aW9ubmFsIHJvdXRpbmcgZGVmaW5lZCBmb3IgZWFjaCBjbGllbnQuXG4gICAqIEBwcml2YXRlXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xuICBfcm91dGVzOiB7fSxcblxuICBnZXQgY2xpZW50VHlwZXMoKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuX2NsaWVudFR5cGVBY3Rpdml0aWVzTWFwKTtcbiAgfSxcblxuICAvKipcbiAgICogUmV0dXJuIGEgc2VydmljZSBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIElkZW50aWZpZXIgb2YgdGhlIHNlcnZpY2UuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3B0aW9ucyB0byBjb25maWd1cmUgdGhlIHNlcnZpY2UuXG4gICAqL1xuICByZXF1aXJlKGlkLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIHNlcnZpY2VNYW5hZ2VyLnJlcXVpcmUoaWQsIG9wdGlvbnMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBEZWZhdWx0IGZvciB0aGUgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLnNlcnZlcn5jbGllbnRDb25maWdEZWZpbml0aW9uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfY2xpZW50Q29uZmlnRGVmaW5pdGlvbjogKGNsaWVudFR5cGUsIHNlcnZlckNvbmZpZywgaHR0cFJlcXVlc3QpID0+IHtcbiAgICByZXR1cm4geyBjbGllbnRUeXBlIH07XG4gIH0sXG5cbiAgLyoqXG4gICAqIEBjYWxsYmFjayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuc2VydmVyfmNsaWVudENvbmZpZ0RlZmluaXRpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNsaWVudFR5cGUgLSBUeXBlIG9mIHRoZSBjbGllbnQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzZXJ2ZXJDb25maWcgLSBDb25maWd1cmF0aW9uIG9mIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBodHRwUmVxdWVzdCAtIEh0dHAgcmVxdWVzdCBmb3IgdGhlIGBpbmRleC5odG1sYFxuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqL1xuICAvKipcbiAgICogU2V0IHRoZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLnNlcnZlcn5jbGllbnRDb25maWdEZWZpbml0aW9ufSB3aXRoXG4gICAqIGEgdXNlciBkZWZpbmVkIGZ1bmN0aW9uLlxuICAgKiBAcGFyYW0ge21vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5zZXJ2ZXJ+Y2xpZW50Q29uZmlnRGVmaW5pdGlvbn0gZnVuYyAtIEFcbiAgICogIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgZGF0YSB0aGF0IHdpbGwgYmUgdXNlZCB0byBwb3B1bGF0ZSB0aGUgYGluZGV4Lmh0bWxgXG4gICAqICB0ZW1wbGF0ZS4gVGhlIGZ1bmN0aW9uIGNvdWxkIChhbmQgc2hvdWxkKSBiZSB1c2VkIHRvIHBhc3MgY29uZmlndXJhdGlvblxuICAgKiAgdG8gdGhlIHNvdW5kd29ya3MgY2xpZW50LlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuY2xpZW50fmluaXR9XG4gICAqL1xuICBzZXRDbGllbnRDb25maWdEZWZpbml0aW9uKGZ1bmMpIHtcbiAgICB0aGlzLl9jbGllbnRDb25maWdEZWZpbml0aW9uID0gZnVuYztcbiAgfSxcblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSByb3V0ZSBmb3IgYSBnaXZlbiBgY2xpZW50VHlwZWAsIGFsbG93IHRvIGRlZmluZSBhIG1vcmUgY29tcGxleFxuICAgKiByb3V0aW5nIChhZGRpdGlvbm5hbCByb3V0ZSBwYXJhbWV0ZXJzKSBmb3IgYSBnaXZlbiB0eXBlIG9mIGNsaWVudC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNsaWVudFR5cGUgLSBUeXBlIG9mIHRoZSBjbGllbnQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfFJlZ0V4cH0gcm91dGUgLSBUZW1wbGF0ZSBvZiB0aGUgcm91dGUgdGhhdCBzaG91bGQgYmUgYXBwZW5kLlxuICAgKiAgdG8gdGhlIGNsaWVudCB0eXBlXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGBgYFxuICAgKiAvLyBhbGxvdyBgY29uZHVjdG9yYCBjbGllbnRzIHRvIGNvbm5lY3QgdG8gYGh0dHA6Ly9zaXRlLmNvbS9jb25kdWN0b3IvMWBcbiAgICogc2VydmVyLnJlZ2lzdGVyUm91dGUoJ2NvbmR1Y3RvcicsICcvOnBhcmFtJylcbiAgICogYGBgXG4gICAqL1xuICBkZWZpbmVSb3V0ZShjbGllbnRUeXBlLCByb3V0ZSkge1xuICAgIHRoaXMuX3JvdXRlc1tjbGllbnRUeXBlXSA9IHJvdXRlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiB1c2VkIGJ5IGFjdGl2aXRpZXMgdG8gcmVnaXN0ZXIgdGhlbXNlbHZlcyBhcyBhY3RpdmUgYWN0aXZpdGllc1xuICAgKiBAcGFyYW0ge0FjdGl2aXR5fSBhY3Rpdml0eSAtIEFjdGl2aXR5IHRvIGJlIHJlZ2lzdGVyZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZXRBY3Rpdml0eShhY3Rpdml0eSkge1xuICAgIHRoaXMuX2FjdGl2aXRpZXMuYWRkKGFjdGl2aXR5KTtcbiAgfSxcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgc2VydmVyIHdpdGggdGhlIGdpdmVuIGNvbmZpZ3VyYXRpb24uXG4gICAqIEF0IHRoZSBlbmQgb2YgdGhlIGluaXQgc3RlcCB0aGUgZXhwcmVzcyByb3V0ZXIgaXMgYXZhaWxhYmxlLlxuICAgKlxuICAgKiBAcGFyYW0ge21vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5zZXJ2ZXJ+c2VydmVyQ29uZmlnfSBjb25maWcgLVxuICAgKiAgQ29uZmlndXJhdGlvbiBvZiB0aGUgYXBwbGljYXRpb24uXG4gICAqL1xuICBpbml0KGNvbmZpZykge1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMuX3BvcHVsYXRlRGVmYXVsdENvbmZpZygpO1xuXG4gICAgc2VydmljZU1hbmFnZXIuaW5pdCgpO1xuXG4gICAgaWYgKHRoaXMuY29uZmlnLmxvZ2dlciAhPT0gdW5kZWZpbmVkKVxuICAgICAgbG9nZ2VyLmluaXQodGhpcy5jb25maWcubG9nZ2VyKTtcblxuICAgIC8vIGluc3RhbmNpYXRlIGFuZCBjb25maWd1cmUgZXhwcmVzc1xuICAgIC8vIHRoaXMgYWxsb3dzIHRvIGhvb2sgbWlkZGxld2FyZSBhbmQgcm91dGVzIChlLmcuIGNvcnMpIGluIHRoZSBleHByZXNzXG4gICAgLy8gaW5zdGFuY2UgYmV0d2VlbiBgc2VydmVyLmluaXRgIGFuZCBgc2VydmVyLnN0YXJ0YFxuICAgIHRoaXMucm91dGVyID0gbmV3IGV4cHJlc3MoKTtcbiAgICB0aGlzLnJvdXRlci5zZXQoJ3BvcnQnLCBwcm9jZXNzLmVudi5QT1JUIHx8IHRoaXMuY29uZmlnLnBvcnQpO1xuICAgIHRoaXMucm91dGVyLnNldCgndmlldyBlbmdpbmUnLCAnZWpzJyk7XG4gICAgLy8gYWxsb3cgcHJvbWlzZSBiYXNlZCBzeW50YXggZm9yIHNlcnZlciBpbml0aWFsaXphdGlvblxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfSxcblxuICAvKipcbiAgICogU3RhcnQgdGhlIGFwcGxpY2F0aW9uOlxuICAgKiAtIGxhdW5jaCB0aGUgaHR0cChzKSBzZXJ2ZXIuXG4gICAqIC0gbGF1bmNoIHRoZSBzb2NrZXQgc2VydmVyLlxuICAgKiAtIHN0YXJ0IGFsbCByZWdpc3RlcmVkIGFjdGl2aXRpZXMuXG4gICAqIC0gZGVmaW5lIHJvdXRlcyBhbmQgYWN0aXZpdGllcyBtYXBwaW5nIGZvciBhbGwgY2xpZW50IHR5cGVzLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgLy8gY29tcHJlc3Npb25cbiAgICBpZiAodGhpcy5jb25maWcuZW5hYmxlR1ppcENvbXByZXNzaW9uKVxuICAgICAgdGhpcy5yb3V0ZXIudXNlKGNvbXByZXNzaW9uKCkpO1xuXG4gICAgLy8gcHVibGljIGZvbGRlclxuICAgIHRoaXMucm91dGVyLnVzZShleHByZXNzLnN0YXRpYyh0aGlzLmNvbmZpZy5wdWJsaWNEaXJlY3RvcnkpKTtcblxuICAgIHRoaXMuX2luaXRBY3Rpdml0aWVzKCk7XG4gICAgdGhpcy5faW5pdFJvdXRpbmcodGhpcy5yb3V0ZXIpO1xuICAgIC8vIGV4cG9zZSByb3V0ZXIgdG8gYWxsb3cgYWRkaW5nIHNvbWUgcm91dGVzIChlLmcuIFJFU1QgQVBJKVxuICAgIGNvbnN0IHVzZUh0dHBzID0gdGhpcy5jb25maWcudXNlSHR0cHMgfHzCoGZhbHNlO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIC8vIGxhdW5jaCBodHRwKHMpIHNlcnZlclxuICAgICAgaWYgKCF1c2VIdHRwcykge1xuICAgICAgICBjb25zdCBodHRwU2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIodGhpcy5yb3V0ZXIpO1xuICAgICAgICByZXNvbHZlKGh0dHBTZXJ2ZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgaHR0cHNJbmZvcyA9IHRoaXMuY29uZmlnLmh0dHBzSW5mb3M7XG4gICAgICAgIC8vIHVzZSBnaXZlbiBjZXJ0aWZpY2F0ZVxuICAgICAgICBpZiAoaHR0cHNJbmZvcy5rZXkgJiYgaHR0cHNJbmZvcy5jZXJ0KSB7XG4gICAgICAgICAgY29uc3Qga2V5ID0gZnMucmVhZEZpbGVTeW5jKGh0dHBzSW5mb3Mua2V5KTtcbiAgICAgICAgICBjb25zdCBjZXJ0ID0gZnMucmVhZEZpbGVTeW5jKGh0dHBzSW5mb3MuY2VydCk7XG4gICAgICAgICAgY29uc3QgaHR0cHNTZXJ2ZXIgPSBodHRwcy5jcmVhdGVTZXJ2ZXIoeyBrZXksIGNlcnQgfSwgdGhpcy5yb3V0ZXIpO1xuICAgICAgICAgIHJlc29sdmUoaHR0cHNTZXJ2ZXIpO1xuICAgICAgICAvLyBnZW5lcmF0ZSBjZXJ0aWZpY2F0ZSBvbiB0aGUgZmx5IChmb3IgZGV2ZWxvcG1lbnQgcHVycG9zZXMpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGVtLmNyZWF0ZUNlcnRpZmljYXRlKHsgZGF5czogMSwgc2VsZlNpZ25lZDogdHJ1ZSB9LCAoZXJyLCBrZXlzKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBodHRwc1NlcnZlciA9IGh0dHBzLmNyZWF0ZVNlcnZlcih7XG4gICAgICAgICAgICAgIGtleToga2V5cy5zZXJ2aWNlS2V5LFxuICAgICAgICAgICAgICBjZXJ0OiBrZXlzLmNlcnRpZmljYXRlLFxuICAgICAgICAgICAgfSwgdGhpcy5yb3V0ZXIpO1xuXG4gICAgICAgICAgICByZXNvbHZlKGh0dHBzU2VydmVyKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pLnRoZW4oKGh0dHBTZXJ2ZXIpID0+IHtcbiAgICAgIHRoaXMuX2luaXRTb2NrZXRzKGh0dHBTZXJ2ZXIpO1xuXG4gICAgICB0aGlzLmh0dHBTZXJ2ZXIgPSBodHRwU2VydmVyXG5cbiAgICAgIHNlcnZpY2VNYW5hZ2VyLnNpZ25hbHMucmVhZHkuYWRkT2JzZXJ2ZXIoKCkgPT4ge1xuICAgICAgICBodHRwU2VydmVyLmxpc3Rlbih0aGlzLnJvdXRlci5nZXQoJ3BvcnQnKSwgKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHByb3RvY29sID0gdXNlSHR0cHMgPyAnaHR0cHMnIDogJ2h0dHAnO1xuICAgICAgICAgIHRoaXMuX2FkZHJlc3MgPSBgJHtwcm90b2NvbH06Ly8xMjcuMC4wLjE6JHt0aGlzLnJvdXRlci5nZXQoJ3BvcnQnKX1gO1xuICAgICAgICAgIGNvbnNvbGUubG9nKGBbJHtwcm90b2NvbC50b1VwcGVyQ2FzZSgpfSBTRVJWRVJdIFNlcnZlciBsaXN0ZW5pbmcgb25gLCB0aGlzLl9hZGRyZXNzKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgc2VydmljZU1hbmFnZXIuc3RhcnQoKTtcbiAgICB9KS5jYXRjaCgoZXJyKSA9PiBjb25zb2xlLmVycm9yKGVyci5zdGFjaykpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBNYXAgYWN0aXZpdGllcyB0byB0aGVpciByZXNwZWN0aXZlIGNsaWVudCB0eXBlKHMpIGFuZCBzdGFydCB0aGVtIGFsbC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9pbml0QWN0aXZpdGllcygpIHtcbiAgICB0aGlzLl9hY3Rpdml0aWVzLmZvckVhY2goKGFjdGl2aXR5KSA9PiB7XG4gICAgICB0aGlzLl9tYXBDbGllbnRUeXBlc1RvQWN0aXZpdHkoYWN0aXZpdHkuY2xpZW50VHlwZXMsIGFjdGl2aXR5KTtcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogSW5pdCByb3V0aW5nIGZvciBlYWNoIGNsaWVudC4gVGhlIGRlZmF1bHQgY2xpZW50IHJvdXRlIG11c3QgYmUgY3JlYXRlZCBsYXN0LlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2luaXRSb3V0aW5nKHJvdXRlcikge1xuICAgIGZvciAobGV0IGNsaWVudFR5cGUgaW4gdGhpcy5fY2xpZW50VHlwZUFjdGl2aXRpZXNNYXApIHtcbiAgICAgIGlmIChjbGllbnRUeXBlICE9PSB0aGlzLmNvbmZpZy5kZWZhdWx0Q2xpZW50KVxuICAgICAgICB0aGlzLl9vcGVuQ2xpZW50Um91dGUoY2xpZW50VHlwZSwgcm91dGVyKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBjbGllbnRUeXBlIGluIHRoaXMuX2NsaWVudFR5cGVBY3Rpdml0aWVzTWFwKSB7XG4gICAgICBpZiAoY2xpZW50VHlwZSA9PT0gdGhpcy5jb25maWcuZGVmYXVsdENsaWVudClcbiAgICAgICAgdGhpcy5fb3BlbkNsaWVudFJvdXRlKGNsaWVudFR5cGUsIHJvdXRlcik7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBJbml0IHdlYnNvY2tldCBzZXJ2ZXIuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaW5pdFNvY2tldHMoaHR0cFNlcnZlcikge1xuICAgIHNvY2tldHMuaW5pdChodHRwU2VydmVyLCB0aGlzLmNvbmZpZy53ZWJzb2NrZXRzKTtcbiAgICAvLyBzb2NrZXQgY29ubm5lY3Rpb25cbiAgICBzb2NrZXRzLm9uQ29ubmVjdGlvbih0aGlzLmNsaWVudFR5cGVzLCAoY2xpZW50VHlwZSwgc29ja2V0KSA9PiB7XG4gICAgICB0aGlzLl9vblNvY2tldENvbm5lY3Rpb24oY2xpZW50VHlwZSwgc29ja2V0KTtcbiAgICB9KTtcbiAgfSxcblxuICAgLyoqXG4gICAqIFBvcHVsYXRlIG1hbmRhdG9yeSBjb25maWd1cmF0aW9uIG9wdGlvbnNcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9wb3B1bGF0ZURlZmF1bHRDb25maWcoKSB7XG4gICAgaWYgKHRoaXMuY29uZmlnLnBvcnQgPT09IHVuZGVmaW5lZClcbiAgICAgIMKgdGhpcy5jb25maWcucG9ydCA9IDgwMDA7XG5cbiAgICBpZiAodGhpcy5jb25maWcuZW5hYmxlR1ppcENvbXByZXNzaW9uID09PSB1bmRlZmluZWQpXG4gICAgICB0aGlzLmNvbmZpZy5lbmFibGVHWmlwQ29tcHJlc3Npb24gPSB0cnVlO1xuXG4gICAgaWYgKHRoaXMuY29uZmlnLnB1YmxpY0RpcmVjdG9yeSA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhpcy5jb25maWcucHVibGljRGlyZWN0b3J5ID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdwdWJsaWMnKTtcblxuICAgIGlmICh0aGlzLmNvbmZpZy50ZW1wbGF0ZURpcmVjdG9yeSA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhpcy5jb25maWcudGVtcGxhdGVEaXJlY3RvcnkgPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ2h0bWwnKTtcblxuICAgIGlmICh0aGlzLmNvbmZpZy5kZWZhdWx0Q2xpZW50ID09PSB1bmRlZmluZWQpXG4gICAgICB0aGlzLmNvbmZpZy5kZWZhdWx0Q2xpZW50ID0gJ3BsYXllcic7XG5cbiAgICBpZiAodGhpcy5jb25maWcud2Vic29ja2V0cyA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhpcy5jb25maWcud2Vic29ja2V0cyA9IHt9O1xuICB9LFxuXG4gIC8qKlxuICAgKiBNYXAgY2xpZW50IHR5cGVzIHdpdGggYW4gYWN0aXZpdHkuXG4gICAqIEBwYXJhbSB7QXJyYXk8U3RyaW5nPn0gY2xpZW50VHlwZXMgLSBMaXN0IG9mIGNsaWVudCB0eXBlLlxuICAgKiBAcGFyYW0ge0FjdGl2aXR5fSBhY3Rpdml0eSAtIEFjdGl2aXR5IGNvbmNlcm5lZCB3aXRoIHRoZSBnaXZlbiBgY2xpZW50VHlwZXNgLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX21hcENsaWVudFR5cGVzVG9BY3Rpdml0eShjbGllbnRUeXBlcywgYWN0aXZpdHkpIHtcbiAgICBjbGllbnRUeXBlcy5mb3JFYWNoKChjbGllbnRUeXBlKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuX2NsaWVudFR5cGVBY3Rpdml0aWVzTWFwW2NsaWVudFR5cGVdKVxuICAgICAgICB0aGlzLl9jbGllbnRUeXBlQWN0aXZpdGllc01hcFtjbGllbnRUeXBlXSA9IG5ldyBTZXQoKTtcblxuICAgICAgdGhpcy5fY2xpZW50VHlwZUFjdGl2aXRpZXNNYXBbY2xpZW50VHlwZV0uYWRkKGFjdGl2aXR5KTtcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogT3BlbiB0aGUgcm91dGUgZm9yIHRoZSBnaXZlbiBjbGllbnQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfb3BlbkNsaWVudFJvdXRlKGNsaWVudFR5cGUsIHJvdXRlcikge1xuICAgIGxldCByb3V0ZSA9ICcnO1xuXG4gICAgaWYgKHRoaXMuX3JvdXRlc1tjbGllbnRUeXBlXSlcbiAgICAgIHJvdXRlICs9IHRoaXMuX3JvdXRlc1tjbGllbnRUeXBlXTtcblxuICAgIGlmIChjbGllbnRUeXBlICE9PSB0aGlzLmNvbmZpZy5kZWZhdWx0Q2xpZW50KVxuICAgICAgcm91dGUgPSBgLyR7Y2xpZW50VHlwZX0ke3JvdXRlfWA7XG5cbiAgICAvLyBkZWZpbmUgdGVtcGxhdGUgZmlsZW5hbWU6IGAke2NsaWVudFR5cGV9LmVqc2Agb3IgYGRlZmF1bHQuZWpzYFxuICAgIGNvbnN0IHRlbXBsYXRlRGlyZWN0b3J5ID0gdGhpcy5jb25maWcudGVtcGxhdGVEaXJlY3Rvcnk7XG4gICAgY29uc3QgY2xpZW50VG1wbCA9IHBhdGguam9pbih0ZW1wbGF0ZURpcmVjdG9yeSwgYCR7Y2xpZW50VHlwZX0uZWpzYCk7XG4gICAgY29uc3QgZGVmYXVsdFRtcGwgPSBwYXRoLmpvaW4odGVtcGxhdGVEaXJlY3RvcnksIGBkZWZhdWx0LmVqc2ApO1xuXG4gICAgZnMuc3RhdChjbGllbnRUbXBsLCAoZXJyLCBzdGF0cykgPT4ge1xuICAgICAgbGV0IHRlbXBsYXRlO1xuXG4gICAgICBpZiAoZXJyIHx8ICFzdGF0cy5pc0ZpbGUoKSlcbiAgICAgICAgdGVtcGxhdGUgPSBkZWZhdWx0VG1wbDtcbiAgICAgIGVsc2VcbiAgICAgICAgdGVtcGxhdGUgPSBjbGllbnRUbXBsO1xuXG4gICAgICBjb25zdCB0bXBsU3RyaW5nID0gZnMucmVhZEZpbGVTeW5jKHRlbXBsYXRlLCB7IGVuY29kaW5nOiAndXRmOCcgfSk7XG4gICAgICBjb25zdCB0bXBsID0gZWpzLmNvbXBpbGUodG1wbFN0cmluZyk7XG5cbiAgICAgIC8vIGh0dHAgcmVxdWVzdFxuICAgICAgcm91dGVyLmdldChyb3V0ZSwgKHJlcSwgcmVzKSA9PiB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLl9jbGllbnRDb25maWdEZWZpbml0aW9uKGNsaWVudFR5cGUsIHRoaXMuY29uZmlnLCByZXEpO1xuICAgICAgICBjb25zdCBhcHBJbmRleCA9IHRtcGwoeyBkYXRhIH0pO1xuICAgICAgICByZXMuc2VuZChhcHBJbmRleCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogU29ja2V0IGNvbm5lY3Rpb24gY2FsbGJhY2suXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfb25Tb2NrZXRDb25uZWN0aW9uKGNsaWVudFR5cGUsIHNvY2tldCkge1xuICAgIGNvbnN0IGNsaWVudCA9IG5ldyBDbGllbnQoY2xpZW50VHlwZSwgc29ja2V0KTtcbiAgICBjb25zdCBhY3Rpdml0aWVzID0gdGhpcy5fY2xpZW50VHlwZUFjdGl2aXRpZXNNYXBbY2xpZW50VHlwZV07XG5cbiAgICAvLyBnbG9iYWwgbGlmZWN5Y2xlIG9mIHRoZSBjbGllbnRcbiAgICBzb2NrZXRzLnJlY2VpdmUoY2xpZW50LCAnZGlzY29ubmVjdCcsICgpID0+IHtcbiAgICAgIGFjdGl2aXRpZXMuZm9yRWFjaCgoYWN0aXZpdHkpID0+IGFjdGl2aXR5LmRpc2Nvbm5lY3QoY2xpZW50KSk7XG4gICAgICBjbGllbnQuZGVzdHJveSgpO1xuXG4gICAgICBpZiAobG9nZ2VyLmluZm8pXG4gICAgICAgIGxvZ2dlci5pbmZvKHsgc29ja2V0LCBjbGllbnRUeXBlIH0sICdkaXNjb25uZWN0Jyk7XG4gICAgfSk7XG5cbiAgICAvLyBjaGVjayBjb2hlcmVuY2UgYmV0d2VlbiBjbGllbnQtc2lkZSBhbmQgc2VydmVyLXNpZGUgc2VydmljZSByZXF1aXJlbWVudHNcbiAgICBjb25zdCBzZXJ2ZXJSZXF1aXJlZFNlcnZpY2VzID0gc2VydmljZU1hbmFnZXIuZ2V0UmVxdWlyZWRTZXJ2aWNlcyhjbGllbnRUeXBlKTtcbiAgICBjb25zdCBzZXJ2ZXJTZXJ2aWNlc0xpc3QgPSBzZXJ2aWNlTWFuYWdlci5nZXRTZXJ2aWNlTGlzdCgpO1xuXG4gICAgc29ja2V0cy5yZWNlaXZlKGNsaWVudCwgJ2hhbmRzaGFrZScsIChkYXRhKSA9PiB7XG4gICAgICAvLyBpbiBkZXZlbG9wbWVudCwgaWYgc2VydmljZSByZXF1aXJlZCBjbGllbnQtc2lkZSBidXQgbm90IHNlcnZlci1zaWRlLFxuICAgICAgLy8gY29tcGxhaW4gcHJvcGVybHkgY2xpZW50LXNpZGUuXG4gICAgICBpZiAodGhpcy5jb25maWcuZW52ICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgY29uc3QgY2xpZW50UmVxdWlyZWRTZXJ2aWNlcyA9IGRhdGEucmVxdWlyZWRTZXJ2aWNlcyB8fMKgW107XG4gICAgICAgIGNvbnN0IG1pc3NpbmdTZXJ2aWNlcyA9IFtdO1xuXG4gICAgICAgIGNsaWVudFJlcXVpcmVkU2VydmljZXMuZm9yRWFjaCgoc2VydmljZUlkKSA9PiB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgc2VydmVyU2VydmljZXNMaXN0LmluZGV4T2Yoc2VydmljZUlkKSAhPT0gLTEgJiZcbiAgICAgICAgICAgIHNlcnZlclJlcXVpcmVkU2VydmljZXMuaW5kZXhPZihzZXJ2aWNlSWQpID09PSAtMVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgbWlzc2luZ1NlcnZpY2VzLnB1c2goc2VydmljZUlkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChtaXNzaW5nU2VydmljZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHNvY2tldHMuc2VuZChjbGllbnQsICdjbGllbnQ6ZXJyb3InLCB7XG4gICAgICAgICAgICB0eXBlOiAnc2VydmljZXMnLFxuICAgICAgICAgICAgZGF0YTogbWlzc2luZ1NlcnZpY2VzLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjbGllbnQudXJsUGFyYW1zID0gZGF0YS51cmxQYXJhbXM7XG4gICAgICAvLyBAdG9kbyAtIGhhbmRsZSByZWNvbm5lY3Rpb24gKGV4OiBgZGF0YWAgY29udGFpbnMgYW4gYHV1aWRgKVxuICAgICAgYWN0aXZpdGllcy5mb3JFYWNoKChhY3Rpdml0eSkgPT4gYWN0aXZpdHkuY29ubmVjdChjbGllbnQpKTtcbiAgICAgIHNvY2tldHMuc2VuZChjbGllbnQsICdjbGllbnQ6c3RhcnQnLCBjbGllbnQudXVpZCk7XG5cbiAgICAgIGlmIChsb2dnZXIuaW5mbylcbiAgICAgICAgbG9nZ2VyLmluZm8oeyBzb2NrZXQsIGNsaWVudFR5cGUgfSwgJ2hhbmRzaGFrZScpO1xuICAgIH0pO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgc2VydmVyO1xuIl19