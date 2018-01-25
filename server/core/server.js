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
 * @property {Object} serveStaticOptions - Options for the serve static middleware
 *  cf. [https://github.com/expressjs/serve-static](https://github.com/expressjs/serve-static)
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
   * Constructor used to instanciate `Client` instances.
   * @type {module:soundworks/server.Client}
   * @default module:soundworks/server.Client
   */
  clientCtor: _Client2.default,

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
    var _config = this.config,
        publicDirectory = _config.publicDirectory,
        serveStaticOptions = _config.serveStaticOptions;

    var staticMiddleware = _express2.default.static(publicDirectory, serveStaticOptions);
    this.router.use(staticMiddleware);

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

    if (this.config.serveStaticOptions === undefined) this.config.serveStaticOptions = {};

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

    var client = new this.clientCtor(clientType, socket);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZlci5qcyJdLCJuYW1lcyI6WyJzZXJ2ZXIiLCJjb25maWciLCJjbGllbnRDdG9yIiwiX2FkZHJlc3MiLCJfY2xpZW50VHlwZUFjdGl2aXRpZXNNYXAiLCJyb3V0ZXIiLCJodHRwU2VydmVyIiwiX2FjdGl2aXRpZXMiLCJfcm91dGVzIiwiY2xpZW50VHlwZXMiLCJyZXF1aXJlIiwiaWQiLCJvcHRpb25zIiwiX2NsaWVudENvbmZpZ0RlZmluaXRpb24iLCJjbGllbnRUeXBlIiwic2VydmVyQ29uZmlnIiwiaHR0cFJlcXVlc3QiLCJzZXRDbGllbnRDb25maWdEZWZpbml0aW9uIiwiZnVuYyIsImRlZmluZVJvdXRlIiwicm91dGUiLCJzZXRBY3Rpdml0eSIsImFjdGl2aXR5IiwiYWRkIiwiaW5pdCIsIl9wb3B1bGF0ZURlZmF1bHRDb25maWciLCJsb2dnZXIiLCJ1bmRlZmluZWQiLCJzZXQiLCJwcm9jZXNzIiwiZW52IiwiUE9SVCIsInBvcnQiLCJyZXNvbHZlIiwic3RhcnQiLCJlbmFibGVHWmlwQ29tcHJlc3Npb24iLCJ1c2UiLCJwdWJsaWNEaXJlY3RvcnkiLCJzZXJ2ZVN0YXRpY09wdGlvbnMiLCJzdGF0aWNNaWRkbGV3YXJlIiwic3RhdGljIiwiX2luaXRBY3Rpdml0aWVzIiwiX2luaXRSb3V0aW5nIiwidXNlSHR0cHMiLCJyZWplY3QiLCJjcmVhdGVTZXJ2ZXIiLCJodHRwc0luZm9zIiwia2V5IiwiY2VydCIsInJlYWRGaWxlU3luYyIsImh0dHBzU2VydmVyIiwiY3JlYXRlQ2VydGlmaWNhdGUiLCJkYXlzIiwic2VsZlNpZ25lZCIsImVyciIsImtleXMiLCJzZXJ2aWNlS2V5IiwiY2VydGlmaWNhdGUiLCJ0aGVuIiwiX2luaXRTb2NrZXRzIiwic2lnbmFscyIsInJlYWR5IiwiYWRkT2JzZXJ2ZXIiLCJsaXN0ZW4iLCJnZXQiLCJwcm90b2NvbCIsImNvbnNvbGUiLCJsb2ciLCJ0b1VwcGVyQ2FzZSIsImNhdGNoIiwiZXJyb3IiLCJzdGFjayIsImZvckVhY2giLCJfbWFwQ2xpZW50VHlwZXNUb0FjdGl2aXR5IiwiZGVmYXVsdENsaWVudCIsIl9vcGVuQ2xpZW50Um91dGUiLCJ3ZWJzb2NrZXRzIiwib25Db25uZWN0aW9uIiwic29ja2V0IiwiX29uU29ja2V0Q29ubmVjdGlvbiIsImpvaW4iLCJjd2QiLCJ0ZW1wbGF0ZURpcmVjdG9yeSIsImNsaWVudFRtcGwiLCJkZWZhdWx0VG1wbCIsInN0YXQiLCJzdGF0cyIsInRlbXBsYXRlIiwiaXNGaWxlIiwidG1wbFN0cmluZyIsImVuY29kaW5nIiwidG1wbCIsImNvbXBpbGUiLCJyZXEiLCJyZXMiLCJkYXRhIiwiYXBwSW5kZXgiLCJzZW5kIiwiY2xpZW50IiwiYWN0aXZpdGllcyIsInJlY2VpdmUiLCJkaXNjb25uZWN0IiwiZGVzdHJveSIsImluZm8iLCJzZXJ2ZXJSZXF1aXJlZFNlcnZpY2VzIiwiZ2V0UmVxdWlyZWRTZXJ2aWNlcyIsInNlcnZlclNlcnZpY2VzTGlzdCIsImdldFNlcnZpY2VMaXN0IiwiY2xpZW50UmVxdWlyZWRTZXJ2aWNlcyIsInJlcXVpcmVkU2VydmljZXMiLCJtaXNzaW5nU2VydmljZXMiLCJzZXJ2aWNlSWQiLCJpbmRleE9mIiwicHVzaCIsImxlbmd0aCIsInR5cGUiLCJ1cmxQYXJhbXMiLCJjb25uZWN0IiwidXVpZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0JBLElBQU1BLFNBQVM7QUFDYjs7Ozs7O0FBTUFDLFVBQVEsRUFQSzs7QUFTYjs7Ozs7QUFLQUMsOEJBZGE7O0FBZ0JiOzs7O0FBSUFDLFlBQVUs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SUFBRCxFQUFVO0FBQzdDO0FBQ0E7QUFDQSxVQUFJLE9BQUs5RixNQUFMLENBQVk2QixHQUFaLEtBQW9CLFlBQXhCLEVBQXNDO0FBQ3BDLFlBQU04RSx5QkFBeUJiLEtBQUtjLGdCQUFMLElBQXlCLEVBQXhEO0FBQ0EsWUFBTUMsa0JBQWtCLEVBQXhCOztBQUVBRiwrQkFBdUJwQyxPQUF2QixDQUErQixVQUFDdUMsU0FBRCxFQUFlO0FBQzVDLGNBQ0VMLG1CQUFtQk0sT0FBbkIsQ0FBMkJELFNBQTNCLE1BQTBDLENBQUMsQ0FBM0MsSUFDQVAsdUJBQXVCUSxPQUF2QixDQUErQkQsU0FBL0IsTUFBOEMsQ0FBQyxDQUZqRCxFQUdFO0FBQ0FELDRCQUFnQkcsSUFBaEIsQ0FBcUJGLFNBQXJCO0FBQ0Q7QUFDRixTQVBEOztBQVNBLFlBQUlELGdCQUFnQkksTUFBaEIsR0FBeUIsQ0FBN0IsRUFBZ0M7QUFDOUIsNEJBQVFqQixJQUFSLENBQWFDLE1BQWIsRUFBcUIsY0FBckIsRUFBcUM7QUFDbkNpQixrQkFBTSxVQUQ2QjtBQUVuQ3BCLGtCQUFNZTtBQUY2QixXQUFyQztBQUlBO0FBQ0Q7QUFDRjs7QUFFRFosYUFBT2tCLFNBQVAsR0FBbUJyQixLQUFLcUIsU0FBeEI7QUFDQTtBQUNBakIsaUJBQVczQixPQUFYLENBQW1CLFVBQUNsRCxRQUFEO0FBQUEsZUFBY0EsU0FBUytGLE9BQVQsQ0FBaUJuQixNQUFqQixDQUFkO0FBQUEsT0FBbkI7QUFDQSx3QkFBUUQsSUFBUixDQUFhQyxNQUFiLEVBQXFCLGNBQXJCLEVBQXFDQSxPQUFPb0IsSUFBNUM7O0FBRUEsVUFBSSxpQkFBT2YsSUFBWCxFQUNFLGlCQUFPQSxJQUFQLENBQVksRUFBRXpCLGNBQUYsRUFBVWhFLHNCQUFWLEVBQVosRUFBb0MsV0FBcEM7QUFDSCxLQWhDRDtBQWlDRDtBQTlYWSxDQUFmOztrQkFpWWVkLE0iLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENsaWVudCBmcm9tICcuL0NsaWVudCc7XG5pbXBvcnQgY29tcHJlc3Npb24gZnJvbSAnY29tcHJlc3Npb24nO1xuaW1wb3J0IGVqcyBmcm9tICdlanMnO1xuaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IGh0dHAgZnJvbSAnaHR0cCc7XG5pbXBvcnQgaHR0cHMgZnJvbSAnaHR0cHMnO1xuaW1wb3J0IGxvZ2dlciBmcm9tICcuLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgcGVtIGZyb20gJ3BlbSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgc29ja2V0cyBmcm9tICcuL3NvY2tldHMnO1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5zZXJ2ZXJ+c2VydmVyQ29uZmlnXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLnNlcnZlclxuICpcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBhcHBOYW1lIC0gTmFtZSBvZiB0aGUgYXBwbGljYXRpb24sIHVzZWQgaW4gdGhlIGAuZWpzYFxuICogIHRlbXBsYXRlIGFuZCBieSBkZWZhdWx0IGluIHRoZSBgcGxhdGZvcm1gIHNlcnZpY2UgdG8gcG9wdWxhdGUgaXRzIHZpZXcuXG4gKiBAcHJvcGVydHkge1N0cmluZ30gZW52IC0gTmFtZSBvZiB0aGUgZW52aXJvbm5lbWVudCAoJ3Byb2R1Y3Rpb24nIGVuYWJsZVxuICogIGNhY2hlIGluIGV4cHJlc3MgYXBwbGljYXRpb24pLlxuICogQHByb3BlcnR5IHtTdHJpbmd9IHZlcnNpb24gLSBWZXJzaW9uIG9mIGFwcGxpY2F0aW9uLCBjYW4gYmUgdXNlZCB0byBmb3JjZVxuICogIHJlbG9hZCBjc3MgYW5kIGpzIGZpbGVzIGZyb20gc2VydmVyIChjZi4gYGh0bWwvZGVmYXVsdC5lanNgKVxuICogQHByb3BlcnR5IHtTdHJpbmd9IGRlZmF1bHRDbGllbnQgLSBOYW1lIG9mIHRoZSBkZWZhdWx0IGNsaWVudCB0eXBlLFxuICogIGkuZS4gdGhlIGNsaWVudCB0aGF0IGNhbiBhY2Nlc3MgdGhlIGFwcGxpY2F0aW9uIGF0IGl0cyByb290IFVSTFxuICogQHByb3BlcnR5IHtTdHJpbmd9IGFzc2V0c0RvbWFpbiAtIERlZmluZSBmcm9tIHdoZXJlIHRoZSBhc3NldHMgKHN0YXRpYyBmaWxlcylcbiAqICBzaG91bGQgYmUgbG9hZGVkLCB0aGlzIHZhbHVlIGNhbiByZWZlciB0byBhIHNlcGFyYXRlIHNlcnZlciBmb3Igc2NhbGFiaWxpdHkuXG4gKiAgVGhlIHZhbHVlIHNob3VsZCBiZSB1c2VkIGNsaWVudC1zaWRlIHRvIGNvbmZpZ3VyZSB0aGUgYGF1ZGlvLWJ1ZmZlci1tYW5hZ2VyYFxuICogIHNlcnZpY2UuXG4gKiBAcHJvcGVydHkge051bWJlcn0gcG9ydCAtIFBvcnQgdXNlZCB0byBvcGVuIHRoZSBodHRwIHNlcnZlciwgaW4gcHJvZHVjdGlvblxuICogIHRoaXMgdmFsdWUgaXMgdHlwaWNhbGx5IDgwXG4gKlxuICogQHByb3BlcnR5IHtPYmplY3R9IHNldHVwIC0gRGVzY3JpYmUgdGhlIGxvY2F0aW9uIHdoZXJlIHRoZSBleHBlcmllbmNlIHRha2VzXG4gKiAgcGxhY2VzLCB0aGVzZXMgdmFsdWVzIGFyZSB1c2VkIGJ5IHRoZSBgcGxhY2VyYCwgYGNoZWNraW5gIGFuZCBgbG9jYXRvcmBcbiAqICBzZXJ2aWNlcy4gSWYgb25lIG9mIHRoZXNlIHNlcnZpY2UgaXMgcmVxdWlyZWQsIHRoaXMgZW50cnkgbWFuZGF0b3J5LlxuICogQHByb3BlcnR5IHtPYmplY3R9IHNldHVwLmFyZWEgLSBEZXNjcmlwdGlvbiBvZiB0aGUgYXJlYS5cbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBzZXR1cC5hcmVhLndpZHRoIC0gV2lkdGggb2YgdGhlIGFyZWEuXG4gKiBAcHJvcGVydHkge051bWJlcn0gc2V0dXAuYXJlYS5oZWlnaHQgLSBIZWlnaHQgb2YgdGhlIGFyZWEuXG4gKiBAcHJvcGVydHkge1N0cmluZ30gc2V0dXAuYXJlYS5iYWNrZ3JvdW5kIC0gUGF0aCB0byBhbiBpbWFnZSB0byBiZSB1c2VkIGluXG4gKiAgdGhlIGFyZWEgcmVwcmVzZW50YXRpb24uXG4gKiBAcHJvcGVydHkge0FycmF5fSBzZXR1cC5sYWJlbHMgLSBPcHRpb25uYWwgbGlzdCBvZiBwcmVkZWZpbmVkIGxhYmVscy5cbiAqIEBwcm9wZXJ0eSB7QXJyYXl9IHNldHVwLmNvb3JkaW5hdGVzIC0gT3B0aW9ubmFsIGxpc3Qgb2YgcHJlZGVmaW5lZCBjb29yZGluYXRlcy5cbiAqIEBwcm9wZXJ0eSB7QXJyYXl9IHNldHVwLm1heENsaWVudHNQZXJQb3NpdGlvbiAtIE1heGltdW0gbnVtYmVyIG9mIGNsaWVudHNcbiAqICBhbGxvd2VkIGluIGEgcG9zaXRpb24uXG4gKiBAcHJvcGVydHkge051bWJlcn0gc2V0dXAuY2FwYWNpdHkgLSBNYXhpbXVtIG51bWJlciBvZiBwb3NpdGlvbnMgKG1heSBsaW1pdFxuICogb3IgYmUgbGltaXRlZCBieSB0aGUgbnVtYmVyIG9mIGxhYmVscyBhbmQvb3IgY29vcmRpbmF0ZXMpLlxuICpcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSB3ZWJzb2NrZXRzIC0gV2Vic29ja2V0cyBjb25maWd1cmF0aW9uIChzb2NrZXQuaW8pXG4gKiBAcHJvcGVydHkge1N0cmluZ30gd2Vic29ja2V0cy51cmwgLSBPcHRpb25uYWwgdXJsIHdoZXJlIHRoZSBzb2NrZXQgc2hvdWxkXG4gKiAgY29ubmVjdC5cbiAqIEBwcm9wZXJ0eSB7QXJyYXl9IHdlYnNvY2tldHMudHJhbnNwb3J0cyAtIExpc3Qgb2YgdGhlIHRyYW5zcG9ydCBtZWNhbmltcyB0aGF0XG4gKiAgc2hvdWxkIGJlIHVzZWQgdG8gb3BlbiBvciBlbXVsYXRlIHRoZSBzb2NrZXQuXG4gKlxuICogQHByb3BlcnR5IHtCb29sZWFufSB1c2VIdHRwcyAtICBEZWZpbmUgaWYgdGhlIEhUVFAgc2VydmVyIHNob3VsZCBiZSBsYXVuY2hlZFxuICogIHVzaW5nIHNlY3VyZSBjb25uZWN0aW9ucy4gRm9yIGRldmVsb3BtZW50IHB1cnBvc2VzIHdoZW4gc2V0IHRvIGB0cnVlYCBhbmQgbm9cbiAqICBjZXJ0aWZpY2F0ZXMgYXJlIGdpdmVuIChjZi4gYGh0dHBzSW5mb3NgKSwgYSBzZWxmLXNpZ25lZCBjZXJ0aWZpY2F0ZSBpc1xuICogIGNyZWF0ZWQuXG4gKiBAcHJvcGVydHkge09iamVjdH0gaHR0cHNJbmZvcyAtIFBhdGhzIHRvIHRoZSBrZXkgYW5kIGNlcnRpZmljYXRlIHRvIGJlIHVzZWRcbiAqICBpbiBvcmRlciB0byBsYXVuY2ggdGhlIGh0dHBzIHNlcnZlci4gQm90aCBlbnRyaWVzIGFyZSByZXF1aXJlZCBvdGhlcndpc2UgYVxuICogIHNlbGYtc2lnbmVkIGNlcnRpZmljYXRlIGlzIGdlbmVyYXRlZC5cbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBodHRwc0luZm9zLmNlcnQgLSBQYXRoIHRvIHRoZSBjZXJ0aWZpY2F0ZS5cbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBodHRwc0luZm9zLmtleSAtIFBhdGggdG8gdGhlIGtleS5cbiAqXG4gKiBAcHJvcGVydHkge1N0cmluZ30gcGFzc3dvcmQgLSBQYXNzd29yZCB0byBiZSB1c2VkIGJ5IHRoZSBgYXV0aGAgc2VydmljZS5cbiAqXG4gKiBAcHJvcGVydHkge09iamVjdH0gb3NjIC0gQ29uZmlndXJhdGlvbiBvZiB0aGUgYG9zY2Agc2VydmljZS5cbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBvc2MucmVjZWl2ZUFkZHJlc3MgLSBJUCBvZiB0aGUgY3VycmVudGx5IHJ1bm5pbmcgc2VydmVyLlxuICogQHByb3BlcnR5IHtOdW1iZXJ9IG9zYy5yZWNlaXZlUG9ydCAtIFBvcnQgbGlzdGVuaW5nIGZvciBpbmNvbW1pbmcgbWVzc2FnZXMuXG4gKiBAcHJvcGVydHkge1N0cmluZ30gb3NjLnNlbmRBZGRyZXNzIC0gSVAgb2YgdGhlIHJlbW90ZSBhcHBsaWNhdGlvbi5cbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBvc2Muc2VuZFBvcnQgLSBQb3J0IHdoZXJlIHRoZSByZW1vdGUgYXBwbGljYXRpb24gaXNcbiAqICBsaXN0ZW5pbmcgZm9yIG1lc3NhZ2VzXG4gKlxuICogQHByb3BlcnR5IHtCb29sZWFufSBlbmFibGVHWmlwQ29tcHJlc3Npb24gLSBEZWZpbmUgaWYgdGhlIHNlcnZlciBzaG91bGQgdXNlXG4gKiAgZ3ppcCBjb21wcmVzc2lvbiBmb3Igc3RhdGljIGZpbGVzLlxuICogQHByb3BlcnR5IHtTdHJpbmd9IHB1YmxpY0RpcmVjdG9yeSAtIExvY2F0aW9uIG9mIHRoZSBwdWJsaWMgZGlyZWN0b3J5XG4gKiAgKGFjY2Vzc2libGUgdGhyb3VnaCBodHRwKHMpIHJlcXVlc3RzKS5cbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBzZXJ2ZVN0YXRpY09wdGlvbnMgLSBPcHRpb25zIGZvciB0aGUgc2VydmUgc3RhdGljIG1pZGRsZXdhcmVcbiAqICBjZi4gW2h0dHBzOi8vZ2l0aHViLmNvbS9leHByZXNzanMvc2VydmUtc3RhdGljXShodHRwczovL2dpdGh1Yi5jb20vZXhwcmVzc2pzL3NlcnZlLXN0YXRpYylcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSB0ZW1wbGF0ZURpcmVjdG9yeSAtIERpcmVjdG9yeSB3aGVyZSB0aGUgc2VydmVyIHRlbXBsYXRpbmdcbiAqICBzeXN0ZW0gbG9va3MgZm9yIHRoZSBgZWpzYCB0ZW1wbGF0ZXMuXG4gKiBAcHJvcGVydHkge09iamVjdH0gbG9nZ2VyIC0gQ29uZmlndXJhdGlvbiBvZiB0aGUgbG9nZ2VyIHNlcnZpY2UsIGNmLiBCdW55YW5cbiAqICBkb2N1bWVudGF0aW9uLlxuICogQHByb3BlcnR5IHtTdHJpbmd9IGVycm9yUmVwb3J0ZXJEaXJlY3RvcnkgLSBEaXJlY3Rvcnkgd2hlcmUgZXJyb3IgcmVwb3J0ZWRcbiAqICBmcm9tIHRoZSBjbGllbnRzIGFyZSB3cml0dGVuLlxuICovXG5cblxuLyoqXG4gKiBTZXJ2ZXIgc2lkZSBlbnRyeSBwb2ludCBmb3IgYSBgc291bmR3b3Jrc2AgYXBwbGljYXRpb24uXG4gKlxuICogVGhpcyBvYmplY3QgaG9zdHMgY29uZmlndXJhdGlvbiBpbmZvcm1hdGlvbnMsIGFzIHdlbGwgYXMgbWV0aG9kcyB0b1xuICogaW5pdGlhbGl6ZSBhbmQgc3RhcnQgdGhlIGFwcGxpY2F0aW9uLiBJdCBpcyBhbHNvIHJlc3BvbnNpYmxlIGZvciBjcmVhdGluZ1xuICogdGhlIHN0YXRpYyBmaWxlIChodHRwKSBzZXJ2ZXIgYXMgd2VsbCBhcyB0aGUgc29ja2V0IHNlcnZlci5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyXG4gKiBAbmFtZXNwYWNlXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIHNvdW5kd29ya3MgZnJvbSAnc291bmR3b3Jrcy9zZXJ2ZXInO1xuICogaW1wb3J0IE15RXhwZXJpZW5jZSBmcm9tICcuL015RXhwZXJpZW5jZSc7XG4gKlxuICogc291bmR3b3Jrcy5zZXJ2ZXIuaW5pdChjb25maWcpO1xuICogY29uc3QgbXlFeHBlcmllbmNlID0gbmV3IE15RXhwZXJpZW5jZSgpO1xuICogc291bmR3b3Jrcy5zZXJ2ZXIuc3RhcnQoKTtcbiAqL1xuY29uc3Qgc2VydmVyID0ge1xuICAvKipcbiAgICogQ29uZmlndXJhdGlvbiBpbmZvcm1hdGlvbnMsIGFsbCBjb25maWcgb2JqZWN0cyBwYXNzZWQgdG8gdGhlXG4gICAqIFtgc2VydmVyLmluaXRgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuc2VydmVyLmluaXR9IGFyZSBtZXJnZWRcbiAgICogaW50byB0aGlzIG9iamVjdC5cbiAgICogQHR5cGUge21vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5zZXJ2ZXJ+c2VydmVyQ29uZmlnfVxuICAgKi9cbiAgY29uZmlnOiB7fSxcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgdXNlZCB0byBpbnN0YW5jaWF0ZSBgQ2xpZW50YCBpbnN0YW5jZXMuXG4gICAqIEB0eXBlIHttb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuQ2xpZW50fVxuICAgKiBAZGVmYXVsdCBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuQ2xpZW50XG4gICAqL1xuICBjbGllbnRDdG9yOiBDbGllbnQsXG5cbiAgLyoqXG4gICAqIFRoZSB1cmwgb2YgdGhlIG5vZGUgc2VydmVyIG9uIHRoZSBjdXJyZW50IG1hY2hpbmUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfYWRkcmVzczogJycsXG5cbiAgLyoqXG4gICAqIE1hcHBpbmcgYmV0d2VlbiBhIGBjbGllbnRUeXBlYCBhbmQgaXRzIHJlbGF0ZWQgYWN0aXZpdGllcy5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9jbGllbnRUeXBlQWN0aXZpdGllc01hcDoge30sXG5cbiAgLyoqXG4gICAqIGV4cHJlc3MgaW5zdGFuY2UsIGNhbiBhbGxvdyB0byBleHBvc2UgYWRkaXRpb25uYWwgcm91dGVzIChlLmcuIFJFU1QgQVBJKS5cbiAgICogQHVuc3RhYmxlXG4gICAqL1xuICByb3V0ZXI6IG51bGwsXG5cbiAgLyoqXG4gICAqIEhUVFAoUykgc2VydmVyIGluc3RhbmNlLlxuICAgKiBAdW5zdGFibGVcbiAgICovXG4gIGh0dHBTZXJ2ZXI6IG51bGwsXG5cbiAgLyoqXG4gICAqIFJlcXVpcmVkIGFjdGl2aXRpZXMgdGhhdCBtdXN0IGJlIHN0YXJ0ZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfYWN0aXZpdGllczogbmV3IFNldCgpLFxuXG4gIC8qKlxuICAgKiBPcHRpb25uYWwgcm91dGluZyBkZWZpbmVkIGZvciBlYWNoIGNsaWVudC5cbiAgICogQHByaXZhdGVcbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG4gIF9yb3V0ZXM6IHt9LFxuXG4gIGdldCBjbGllbnRUeXBlcygpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5fY2xpZW50VHlwZUFjdGl2aXRpZXNNYXApO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYSBzZXJ2aWNlIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gSWRlbnRpZmllciBvZiB0aGUgc2VydmljZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPcHRpb25zIHRvIGNvbmZpZ3VyZSB0aGUgc2VydmljZS5cbiAgICovXG4gIHJlcXVpcmUoaWQsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gc2VydmljZU1hbmFnZXIucmVxdWlyZShpZCwgb3B0aW9ucyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIERlZmF1bHQgZm9yIHRoZSBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuc2VydmVyfmNsaWVudENvbmZpZ0RlZmluaXRpb25cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9jbGllbnRDb25maWdEZWZpbml0aW9uOiAoY2xpZW50VHlwZSwgc2VydmVyQ29uZmlnLCBodHRwUmVxdWVzdCkgPT4ge1xuICAgIHJldHVybiB7IGNsaWVudFR5cGUgfTtcbiAgfSxcblxuICAvKipcbiAgICogQGNhbGxiYWNrIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5zZXJ2ZXJ+Y2xpZW50Q29uZmlnRGVmaW5pdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2xpZW50VHlwZSAtIFR5cGUgb2YgdGhlIGNsaWVudC5cbiAgICogQHBhcmFtIHtPYmplY3R9IHNlcnZlckNvbmZpZyAtIENvbmZpZ3VyYXRpb24gb2YgdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtPYmplY3R9IGh0dHBSZXF1ZXN0IC0gSHR0cCByZXF1ZXN0IGZvciB0aGUgYGluZGV4Lmh0bWxgXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG4gIC8qKlxuICAgKiBTZXQgdGhlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuc2VydmVyfmNsaWVudENvbmZpZ0RlZmluaXRpb259IHdpdGhcbiAgICogYSB1c2VyIGRlZmluZWQgZnVuY3Rpb24uXG4gICAqIEBwYXJhbSB7bW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLnNlcnZlcn5jbGllbnRDb25maWdEZWZpbml0aW9ufSBmdW5jIC0gQVxuICAgKiAgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBkYXRhIHRoYXQgd2lsbCBiZSB1c2VkIHRvIHBvcHVsYXRlIHRoZSBgaW5kZXguaHRtbGBcbiAgICogIHRlbXBsYXRlLiBUaGUgZnVuY3Rpb24gY291bGQgKGFuZCBzaG91bGQpIGJlIHVzZWQgdG8gcGFzcyBjb25maWd1cmF0aW9uXG4gICAqICB0byB0aGUgc291bmR3b3JrcyBjbGllbnQuXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5jbGllbnR+aW5pdH1cbiAgICovXG4gIHNldENsaWVudENvbmZpZ0RlZmluaXRpb24oZnVuYykge1xuICAgIHRoaXMuX2NsaWVudENvbmZpZ0RlZmluaXRpb24gPSBmdW5jO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIHJvdXRlIGZvciBhIGdpdmVuIGBjbGllbnRUeXBlYCwgYWxsb3cgdG8gZGVmaW5lIGEgbW9yZSBjb21wbGV4XG4gICAqIHJvdXRpbmcgKGFkZGl0aW9ubmFsIHJvdXRlIHBhcmFtZXRlcnMpIGZvciBhIGdpdmVuIHR5cGUgb2YgY2xpZW50LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2xpZW50VHlwZSAtIFR5cGUgb2YgdGhlIGNsaWVudC5cbiAgICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfSByb3V0ZSAtIFRlbXBsYXRlIG9mIHRoZSByb3V0ZSB0aGF0IHNob3VsZCBiZSBhcHBlbmQuXG4gICAqICB0byB0aGUgY2xpZW50IHR5cGVcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogYGBgXG4gICAqIC8vIGFsbG93IGBjb25kdWN0b3JgIGNsaWVudHMgdG8gY29ubmVjdCB0byBgaHR0cDovL3NpdGUuY29tL2NvbmR1Y3Rvci8xYFxuICAgKiBzZXJ2ZXIucmVnaXN0ZXJSb3V0ZSgnY29uZHVjdG9yJywgJy86cGFyYW0nKVxuICAgKiBgYGBcbiAgICovXG4gIGRlZmluZVJvdXRlKGNsaWVudFR5cGUsIHJvdXRlKSB7XG4gICAgdGhpcy5fcm91dGVzW2NsaWVudFR5cGVdID0gcm91dGU7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uIHVzZWQgYnkgYWN0aXZpdGllcyB0byByZWdpc3RlciB0aGVtc2VsdmVzIGFzIGFjdGl2ZSBhY3Rpdml0aWVzXG4gICAqIEBwYXJhbSB7QWN0aXZpdHl9IGFjdGl2aXR5IC0gQWN0aXZpdHkgdG8gYmUgcmVnaXN0ZXJlZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNldEFjdGl2aXR5KGFjdGl2aXR5KSB7XG4gICAgdGhpcy5fYWN0aXZpdGllcy5hZGQoYWN0aXZpdHkpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBzZXJ2ZXIgd2l0aCB0aGUgZ2l2ZW4gY29uZmlndXJhdGlvbi5cbiAgICogQXQgdGhlIGVuZCBvZiB0aGUgaW5pdCBzdGVwIHRoZSBleHByZXNzIHJvdXRlciBpcyBhdmFpbGFibGUuXG4gICAqXG4gICAqIEBwYXJhbSB7bW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLnNlcnZlcn5zZXJ2ZXJDb25maWd9IGNvbmZpZyAtXG4gICAqICBDb25maWd1cmF0aW9uIG9mIHRoZSBhcHBsaWNhdGlvbi5cbiAgICovXG4gIGluaXQoY29uZmlnKSB7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy5fcG9wdWxhdGVEZWZhdWx0Q29uZmlnKCk7XG5cbiAgICBzZXJ2aWNlTWFuYWdlci5pbml0KCk7XG5cbiAgICBpZiAodGhpcy5jb25maWcubG9nZ2VyICE9PSB1bmRlZmluZWQpXG4gICAgICBsb2dnZXIuaW5pdCh0aGlzLmNvbmZpZy5sb2dnZXIpO1xuXG4gICAgLy8gaW5zdGFuY2lhdGUgYW5kIGNvbmZpZ3VyZSBleHByZXNzXG4gICAgLy8gdGhpcyBhbGxvd3MgdG8gaG9vayBtaWRkbGV3YXJlIGFuZCByb3V0ZXMgKGUuZy4gY29ycykgaW4gdGhlIGV4cHJlc3NcbiAgICAvLyBpbnN0YW5jZSBiZXR3ZWVuIGBzZXJ2ZXIuaW5pdGAgYW5kIGBzZXJ2ZXIuc3RhcnRgXG4gICAgdGhpcy5yb3V0ZXIgPSBuZXcgZXhwcmVzcygpO1xuICAgIHRoaXMucm91dGVyLnNldCgncG9ydCcsIHByb2Nlc3MuZW52LlBPUlQgfHwgdGhpcy5jb25maWcucG9ydCk7XG4gICAgdGhpcy5yb3V0ZXIuc2V0KCd2aWV3IGVuZ2luZScsICdlanMnKTtcbiAgICAvLyBhbGxvdyBwcm9taXNlIGJhc2VkIHN5bnRheCBmb3Igc2VydmVyIGluaXRpYWxpemF0aW9uXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgYXBwbGljYXRpb246XG4gICAqIC0gbGF1bmNoIHRoZSBodHRwKHMpIHNlcnZlci5cbiAgICogLSBsYXVuY2ggdGhlIHNvY2tldCBzZXJ2ZXIuXG4gICAqIC0gc3RhcnQgYWxsIHJlZ2lzdGVyZWQgYWN0aXZpdGllcy5cbiAgICogLSBkZWZpbmUgcm91dGVzIGFuZCBhY3Rpdml0aWVzIG1hcHBpbmcgZm9yIGFsbCBjbGllbnQgdHlwZXMuXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICAvLyBjb21wcmVzc2lvblxuICAgIGlmICh0aGlzLmNvbmZpZy5lbmFibGVHWmlwQ29tcHJlc3Npb24pXG4gICAgICB0aGlzLnJvdXRlci51c2UoY29tcHJlc3Npb24oKSk7XG5cbiAgICAvLyBwdWJsaWMgZm9sZGVyXG4gICAgY29uc3QgeyBwdWJsaWNEaXJlY3RvcnksIHNlcnZlU3RhdGljT3B0aW9ucyB9ID0gdGhpcy5jb25maWc7XG4gICAgY29uc3Qgc3RhdGljTWlkZGxld2FyZSA9IGV4cHJlc3Muc3RhdGljKHB1YmxpY0RpcmVjdG9yeSwgc2VydmVTdGF0aWNPcHRpb25zKTtcbiAgICB0aGlzLnJvdXRlci51c2Uoc3RhdGljTWlkZGxld2FyZSk7XG5cbiAgICB0aGlzLl9pbml0QWN0aXZpdGllcygpO1xuICAgIHRoaXMuX2luaXRSb3V0aW5nKHRoaXMucm91dGVyKTtcbiAgICAvLyBleHBvc2Ugcm91dGVyIHRvIGFsbG93IGFkZGluZyBzb21lIHJvdXRlcyAoZS5nLiBSRVNUIEFQSSlcbiAgICBjb25zdCB1c2VIdHRwcyA9IHRoaXMuY29uZmlnLnVzZUh0dHBzIHx8wqBmYWxzZTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAvLyBsYXVuY2ggaHR0cChzKSBzZXJ2ZXJcbiAgICAgIGlmICghdXNlSHR0cHMpIHtcbiAgICAgICAgY29uc3QgaHR0cFNlcnZlciA9IGh0dHAuY3JlYXRlU2VydmVyKHRoaXMucm91dGVyKTtcbiAgICAgICAgcmVzb2x2ZShodHRwU2VydmVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGh0dHBzSW5mb3MgPSB0aGlzLmNvbmZpZy5odHRwc0luZm9zO1xuICAgICAgICAvLyB1c2UgZ2l2ZW4gY2VydGlmaWNhdGVcbiAgICAgICAgaWYgKGh0dHBzSW5mb3Mua2V5ICYmIGh0dHBzSW5mb3MuY2VydCkge1xuICAgICAgICAgIGNvbnN0IGtleSA9IGZzLnJlYWRGaWxlU3luYyhodHRwc0luZm9zLmtleSk7XG4gICAgICAgICAgY29uc3QgY2VydCA9IGZzLnJlYWRGaWxlU3luYyhodHRwc0luZm9zLmNlcnQpO1xuICAgICAgICAgIGNvbnN0IGh0dHBzU2VydmVyID0gaHR0cHMuY3JlYXRlU2VydmVyKHsga2V5LCBjZXJ0IH0sIHRoaXMucm91dGVyKTtcbiAgICAgICAgICByZXNvbHZlKGh0dHBzU2VydmVyKTtcbiAgICAgICAgLy8gZ2VuZXJhdGUgY2VydGlmaWNhdGUgb24gdGhlIGZseSAoZm9yIGRldmVsb3BtZW50IHB1cnBvc2VzKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBlbS5jcmVhdGVDZXJ0aWZpY2F0ZSh7IGRheXM6IDEsIHNlbGZTaWduZWQ6IHRydWUgfSwgKGVyciwga2V5cykgPT4ge1xuICAgICAgICAgICAgY29uc3QgaHR0cHNTZXJ2ZXIgPSBodHRwcy5jcmVhdGVTZXJ2ZXIoe1xuICAgICAgICAgICAgICBrZXk6IGtleXMuc2VydmljZUtleSxcbiAgICAgICAgICAgICAgY2VydDoga2V5cy5jZXJ0aWZpY2F0ZSxcbiAgICAgICAgICAgIH0sIHRoaXMucm91dGVyKTtcblxuICAgICAgICAgICAgcmVzb2x2ZShodHRwc1NlcnZlcik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KS50aGVuKChodHRwU2VydmVyKSA9PiB7XG4gICAgICB0aGlzLl9pbml0U29ja2V0cyhodHRwU2VydmVyKTtcblxuICAgICAgdGhpcy5odHRwU2VydmVyID0gaHR0cFNlcnZlclxuXG4gICAgICBzZXJ2aWNlTWFuYWdlci5zaWduYWxzLnJlYWR5LmFkZE9ic2VydmVyKCgpID0+IHtcbiAgICAgICAgaHR0cFNlcnZlci5saXN0ZW4odGhpcy5yb3V0ZXIuZ2V0KCdwb3J0JyksICgpID0+IHtcbiAgICAgICAgICBjb25zdCBwcm90b2NvbCA9IHVzZUh0dHBzID8gJ2h0dHBzJyA6ICdodHRwJztcbiAgICAgICAgICB0aGlzLl9hZGRyZXNzID0gYCR7cHJvdG9jb2x9Oi8vMTI3LjAuMC4xOiR7dGhpcy5yb3V0ZXIuZ2V0KCdwb3J0Jyl9YDtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgWyR7cHJvdG9jb2wudG9VcHBlckNhc2UoKX0gU0VSVkVSXSBTZXJ2ZXIgbGlzdGVuaW5nIG9uYCwgdGhpcy5fYWRkcmVzcyk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHNlcnZpY2VNYW5hZ2VyLnN0YXJ0KCk7XG4gICAgfSkuY2F0Y2goKGVycikgPT4gY29uc29sZS5lcnJvcihlcnIuc3RhY2spKTtcbiAgfSxcblxuICAvKipcbiAgICogTWFwIGFjdGl2aXRpZXMgdG8gdGhlaXIgcmVzcGVjdGl2ZSBjbGllbnQgdHlwZShzKSBhbmQgc3RhcnQgdGhlbSBhbGwuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaW5pdEFjdGl2aXRpZXMoKSB7XG4gICAgdGhpcy5fYWN0aXZpdGllcy5mb3JFYWNoKChhY3Rpdml0eSkgPT4ge1xuICAgICAgdGhpcy5fbWFwQ2xpZW50VHlwZXNUb0FjdGl2aXR5KGFjdGl2aXR5LmNsaWVudFR5cGVzLCBhY3Rpdml0eSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEluaXQgcm91dGluZyBmb3IgZWFjaCBjbGllbnQuIFRoZSBkZWZhdWx0IGNsaWVudCByb3V0ZSBtdXN0IGJlIGNyZWF0ZWQgbGFzdC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9pbml0Um91dGluZyhyb3V0ZXIpIHtcbiAgICBmb3IgKGxldCBjbGllbnRUeXBlIGluIHRoaXMuX2NsaWVudFR5cGVBY3Rpdml0aWVzTWFwKSB7XG4gICAgICBpZiAoY2xpZW50VHlwZSAhPT0gdGhpcy5jb25maWcuZGVmYXVsdENsaWVudClcbiAgICAgICAgdGhpcy5fb3BlbkNsaWVudFJvdXRlKGNsaWVudFR5cGUsIHJvdXRlcik7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgY2xpZW50VHlwZSBpbiB0aGlzLl9jbGllbnRUeXBlQWN0aXZpdGllc01hcCkge1xuICAgICAgaWYgKGNsaWVudFR5cGUgPT09IHRoaXMuY29uZmlnLmRlZmF1bHRDbGllbnQpXG4gICAgICAgIHRoaXMuX29wZW5DbGllbnRSb3V0ZShjbGllbnRUeXBlLCByb3V0ZXIpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogSW5pdCB3ZWJzb2NrZXQgc2VydmVyLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2luaXRTb2NrZXRzKGh0dHBTZXJ2ZXIpIHtcbiAgICBzb2NrZXRzLmluaXQoaHR0cFNlcnZlciwgdGhpcy5jb25maWcud2Vic29ja2V0cyk7XG4gICAgLy8gc29ja2V0IGNvbm5uZWN0aW9uXG4gICAgc29ja2V0cy5vbkNvbm5lY3Rpb24odGhpcy5jbGllbnRUeXBlcywgKGNsaWVudFR5cGUsIHNvY2tldCkgPT4ge1xuICAgICAgdGhpcy5fb25Tb2NrZXRDb25uZWN0aW9uKGNsaWVudFR5cGUsIHNvY2tldCk7XG4gICAgfSk7XG4gIH0sXG5cbiAgIC8qKlxuICAgKiBQb3B1bGF0ZSBtYW5kYXRvcnkgY29uZmlndXJhdGlvbiBvcHRpb25zXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfcG9wdWxhdGVEZWZhdWx0Q29uZmlnKCkge1xuICAgIGlmICh0aGlzLmNvbmZpZy5wb3J0ID09PSB1bmRlZmluZWQpXG4gICAgICDCoHRoaXMuY29uZmlnLnBvcnQgPSA4MDAwO1xuXG4gICAgaWYgKHRoaXMuY29uZmlnLmVuYWJsZUdaaXBDb21wcmVzc2lvbiA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhpcy5jb25maWcuZW5hYmxlR1ppcENvbXByZXNzaW9uID0gdHJ1ZTtcblxuICAgIGlmICh0aGlzLmNvbmZpZy5wdWJsaWNEaXJlY3RvcnkgPT09IHVuZGVmaW5lZClcbiAgICAgIHRoaXMuY29uZmlnLnB1YmxpY0RpcmVjdG9yeSA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAncHVibGljJyk7XG5cbiAgICBpZiAodGhpcy5jb25maWcuc2VydmVTdGF0aWNPcHRpb25zID09PSB1bmRlZmluZWQpXG4gICAgICB0aGlzLmNvbmZpZy5zZXJ2ZVN0YXRpY09wdGlvbnMgPSB7fTtcblxuICAgIGlmICh0aGlzLmNvbmZpZy50ZW1wbGF0ZURpcmVjdG9yeSA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhpcy5jb25maWcudGVtcGxhdGVEaXJlY3RvcnkgPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ2h0bWwnKTtcblxuICAgIGlmICh0aGlzLmNvbmZpZy5kZWZhdWx0Q2xpZW50ID09PSB1bmRlZmluZWQpXG4gICAgICB0aGlzLmNvbmZpZy5kZWZhdWx0Q2xpZW50ID0gJ3BsYXllcic7XG5cbiAgICBpZiAodGhpcy5jb25maWcud2Vic29ja2V0cyA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhpcy5jb25maWcud2Vic29ja2V0cyA9IHt9O1xuICB9LFxuXG4gIC8qKlxuICAgKiBNYXAgY2xpZW50IHR5cGVzIHdpdGggYW4gYWN0aXZpdHkuXG4gICAqIEBwYXJhbSB7QXJyYXk8U3RyaW5nPn0gY2xpZW50VHlwZXMgLSBMaXN0IG9mIGNsaWVudCB0eXBlLlxuICAgKiBAcGFyYW0ge0FjdGl2aXR5fSBhY3Rpdml0eSAtIEFjdGl2aXR5IGNvbmNlcm5lZCB3aXRoIHRoZSBnaXZlbiBgY2xpZW50VHlwZXNgLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX21hcENsaWVudFR5cGVzVG9BY3Rpdml0eShjbGllbnRUeXBlcywgYWN0aXZpdHkpIHtcbiAgICBjbGllbnRUeXBlcy5mb3JFYWNoKChjbGllbnRUeXBlKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuX2NsaWVudFR5cGVBY3Rpdml0aWVzTWFwW2NsaWVudFR5cGVdKVxuICAgICAgICB0aGlzLl9jbGllbnRUeXBlQWN0aXZpdGllc01hcFtjbGllbnRUeXBlXSA9IG5ldyBTZXQoKTtcblxuICAgICAgdGhpcy5fY2xpZW50VHlwZUFjdGl2aXRpZXNNYXBbY2xpZW50VHlwZV0uYWRkKGFjdGl2aXR5KTtcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogT3BlbiB0aGUgcm91dGUgZm9yIHRoZSBnaXZlbiBjbGllbnQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfb3BlbkNsaWVudFJvdXRlKGNsaWVudFR5cGUsIHJvdXRlcikge1xuICAgIGxldCByb3V0ZSA9ICcnO1xuXG4gICAgaWYgKHRoaXMuX3JvdXRlc1tjbGllbnRUeXBlXSlcbiAgICAgIHJvdXRlICs9IHRoaXMuX3JvdXRlc1tjbGllbnRUeXBlXTtcblxuICAgIGlmIChjbGllbnRUeXBlICE9PSB0aGlzLmNvbmZpZy5kZWZhdWx0Q2xpZW50KVxuICAgICAgcm91dGUgPSBgLyR7Y2xpZW50VHlwZX0ke3JvdXRlfWA7XG5cbiAgICAvLyBkZWZpbmUgdGVtcGxhdGUgZmlsZW5hbWU6IGAke2NsaWVudFR5cGV9LmVqc2Agb3IgYGRlZmF1bHQuZWpzYFxuICAgIGNvbnN0IHRlbXBsYXRlRGlyZWN0b3J5ID0gdGhpcy5jb25maWcudGVtcGxhdGVEaXJlY3Rvcnk7XG4gICAgY29uc3QgY2xpZW50VG1wbCA9IHBhdGguam9pbih0ZW1wbGF0ZURpcmVjdG9yeSwgYCR7Y2xpZW50VHlwZX0uZWpzYCk7XG4gICAgY29uc3QgZGVmYXVsdFRtcGwgPSBwYXRoLmpvaW4odGVtcGxhdGVEaXJlY3RvcnksIGBkZWZhdWx0LmVqc2ApO1xuXG4gICAgZnMuc3RhdChjbGllbnRUbXBsLCAoZXJyLCBzdGF0cykgPT4ge1xuICAgICAgbGV0IHRlbXBsYXRlO1xuXG4gICAgICBpZiAoZXJyIHx8ICFzdGF0cy5pc0ZpbGUoKSlcbiAgICAgICAgdGVtcGxhdGUgPSBkZWZhdWx0VG1wbDtcbiAgICAgIGVsc2VcbiAgICAgICAgdGVtcGxhdGUgPSBjbGllbnRUbXBsO1xuXG4gICAgICBjb25zdCB0bXBsU3RyaW5nID0gZnMucmVhZEZpbGVTeW5jKHRlbXBsYXRlLCB7IGVuY29kaW5nOiAndXRmOCcgfSk7XG4gICAgICBjb25zdCB0bXBsID0gZWpzLmNvbXBpbGUodG1wbFN0cmluZyk7XG5cbiAgICAgIC8vIGh0dHAgcmVxdWVzdFxuICAgICAgcm91dGVyLmdldChyb3V0ZSwgKHJlcSwgcmVzKSA9PiB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLl9jbGllbnRDb25maWdEZWZpbml0aW9uKGNsaWVudFR5cGUsIHRoaXMuY29uZmlnLCByZXEpO1xuICAgICAgICBjb25zdCBhcHBJbmRleCA9IHRtcGwoeyBkYXRhIH0pO1xuICAgICAgICByZXMuc2VuZChhcHBJbmRleCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogU29ja2V0IGNvbm5lY3Rpb24gY2FsbGJhY2suXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfb25Tb2NrZXRDb25uZWN0aW9uKGNsaWVudFR5cGUsIHNvY2tldCkge1xuICAgIGNvbnN0IGNsaWVudCA9IG5ldyB0aGlzLmNsaWVudEN0b3IoY2xpZW50VHlwZSwgc29ja2V0KTtcbiAgICBjb25zdCBhY3Rpdml0aWVzID0gdGhpcy5fY2xpZW50VHlwZUFjdGl2aXRpZXNNYXBbY2xpZW50VHlwZV07XG5cbiAgICAvLyBnbG9iYWwgbGlmZWN5Y2xlIG9mIHRoZSBjbGllbnRcbiAgICBzb2NrZXRzLnJlY2VpdmUoY2xpZW50LCAnZGlzY29ubmVjdCcsICgpID0+IHtcbiAgICAgIGFjdGl2aXRpZXMuZm9yRWFjaCgoYWN0aXZpdHkpID0+IGFjdGl2aXR5LmRpc2Nvbm5lY3QoY2xpZW50KSk7XG4gICAgICBjbGllbnQuZGVzdHJveSgpO1xuXG4gICAgICBpZiAobG9nZ2VyLmluZm8pXG4gICAgICAgIGxvZ2dlci5pbmZvKHsgc29ja2V0LCBjbGllbnRUeXBlIH0sICdkaXNjb25uZWN0Jyk7XG4gICAgfSk7XG5cbiAgICAvLyBjaGVjayBjb2hlcmVuY2UgYmV0d2VlbiBjbGllbnQtc2lkZSBhbmQgc2VydmVyLXNpZGUgc2VydmljZSByZXF1aXJlbWVudHNcbiAgICBjb25zdCBzZXJ2ZXJSZXF1aXJlZFNlcnZpY2VzID0gc2VydmljZU1hbmFnZXIuZ2V0UmVxdWlyZWRTZXJ2aWNlcyhjbGllbnRUeXBlKTtcbiAgICBjb25zdCBzZXJ2ZXJTZXJ2aWNlc0xpc3QgPSBzZXJ2aWNlTWFuYWdlci5nZXRTZXJ2aWNlTGlzdCgpO1xuXG4gICAgc29ja2V0cy5yZWNlaXZlKGNsaWVudCwgJ2hhbmRzaGFrZScsIChkYXRhKSA9PiB7XG4gICAgICAvLyBpbiBkZXZlbG9wbWVudCwgaWYgc2VydmljZSByZXF1aXJlZCBjbGllbnQtc2lkZSBidXQgbm90IHNlcnZlci1zaWRlLFxuICAgICAgLy8gY29tcGxhaW4gcHJvcGVybHkgY2xpZW50LXNpZGUuXG4gICAgICBpZiAodGhpcy5jb25maWcuZW52ICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgY29uc3QgY2xpZW50UmVxdWlyZWRTZXJ2aWNlcyA9IGRhdGEucmVxdWlyZWRTZXJ2aWNlcyB8fMKgW107XG4gICAgICAgIGNvbnN0IG1pc3NpbmdTZXJ2aWNlcyA9IFtdO1xuXG4gICAgICAgIGNsaWVudFJlcXVpcmVkU2VydmljZXMuZm9yRWFjaCgoc2VydmljZUlkKSA9PiB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgc2VydmVyU2VydmljZXNMaXN0LmluZGV4T2Yoc2VydmljZUlkKSAhPT0gLTEgJiZcbiAgICAgICAgICAgIHNlcnZlclJlcXVpcmVkU2VydmljZXMuaW5kZXhPZihzZXJ2aWNlSWQpID09PSAtMVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgbWlzc2luZ1NlcnZpY2VzLnB1c2goc2VydmljZUlkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChtaXNzaW5nU2VydmljZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHNvY2tldHMuc2VuZChjbGllbnQsICdjbGllbnQ6ZXJyb3InLCB7XG4gICAgICAgICAgICB0eXBlOiAnc2VydmljZXMnLFxuICAgICAgICAgICAgZGF0YTogbWlzc2luZ1NlcnZpY2VzLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjbGllbnQudXJsUGFyYW1zID0gZGF0YS51cmxQYXJhbXM7XG4gICAgICAvLyBAdG9kbyAtIGhhbmRsZSByZWNvbm5lY3Rpb24gKGV4OiBgZGF0YWAgY29udGFpbnMgYW4gYHV1aWRgKVxuICAgICAgYWN0aXZpdGllcy5mb3JFYWNoKChhY3Rpdml0eSkgPT4gYWN0aXZpdHkuY29ubmVjdChjbGllbnQpKTtcbiAgICAgIHNvY2tldHMuc2VuZChjbGllbnQsICdjbGllbnQ6c3RhcnQnLCBjbGllbnQudXVpZCk7XG5cbiAgICAgIGlmIChsb2dnZXIuaW5mbylcbiAgICAgICAgbG9nZ2VyLmluZm8oeyBzb2NrZXQsIGNsaWVudFR5cGUgfSwgJ2hhbmRzaGFrZScpO1xuICAgIH0pO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgc2VydmVyO1xuIl19