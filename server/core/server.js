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

      var promise = new _promise2.default(function (resolve, reject) {
        _serviceManager2.default.signals.ready.addObserver(function () {
          httpServer.listen(_this.router.get('port'), function () {
            var protocol = useHttps ? 'https' : 'http';
            _this._address = protocol + '://127.0.0.1:' + _this.router.get('port');
            console.log('[' + protocol.toUpperCase() + ' SERVER] Server listening on', _this._address);

            resolve();
          });
        });
      });

      _serviceManager2.default.start();

      return promise;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZlci5qcyJdLCJuYW1lcyI6WyJzZXJ2ZXIiLCJjb25maWciLCJjbGllbnRDdG9yIiwiQ2xpZW50IiwiX2FkZHJlc3MiLCJfY2xpZW50VHlwZUFjdGl2aXRpZXNNYXAiLCJyb3V0ZXIiLCJodHRwU2VydmVyIiwiX2FjdGl2aXRpZXMiLCJfcm91dGVzIiwiY2xpZW50VHlwZXMiLCJyZXF1aXJlIiwiaWQiLCJvcHRpb25zIiwic2VydmljZU1hbmFnZXIiLCJfY2xpZW50Q29uZmlnRGVmaW5pdGlvbiIsImNsaWVudFR5cGUiLCJzZXJ2ZXJDb25maWciLCJodHRwUmVxdWVzdCIsInNldENsaWVudENvbmZpZ0RlZmluaXRpb24iLCJmdW5jIiwiZGVmaW5lUm91dGUiLCJyb3V0ZSIsInNldEFjdGl2aXR5IiwiYWN0aXZpdHkiLCJhZGQiLCJpbml0IiwiX3BvcHVsYXRlRGVmYXVsdENvbmZpZyIsImxvZ2dlciIsInVuZGVmaW5lZCIsImV4cHJlc3MiLCJzZXQiLCJwcm9jZXNzIiwiZW52IiwiUE9SVCIsInBvcnQiLCJyZXNvbHZlIiwic3RhcnQiLCJlbmFibGVHWmlwQ29tcHJlc3Npb24iLCJ1c2UiLCJwdWJsaWNEaXJlY3RvcnkiLCJzZXJ2ZVN0YXRpY09wdGlvbnMiLCJzdGF0aWNNaWRkbGV3YXJlIiwic3RhdGljIiwiX2luaXRBY3Rpdml0aWVzIiwiX2luaXRSb3V0aW5nIiwidXNlSHR0cHMiLCJyZWplY3QiLCJodHRwIiwiY3JlYXRlU2VydmVyIiwiaHR0cHNJbmZvcyIsImtleSIsImNlcnQiLCJmcyIsInJlYWRGaWxlU3luYyIsImh0dHBzU2VydmVyIiwiaHR0cHMiLCJwZW0iLCJjcmVhdGVDZXJ0aWZpY2F0ZSIsImRheXMiLCJzZWxmU2lnbmVkIiwiZXJyIiwia2V5cyIsInNlcnZpY2VLZXkiLCJjZXJ0aWZpY2F0ZSIsInRoZW4iLCJfaW5pdFNvY2tldHMiLCJwcm9taXNlIiwic2lnbmFscyIsInJlYWR5IiwiYWRkT2JzZXJ2ZXIiLCJsaXN0ZW4iLCJnZXQiLCJwcm90b2NvbCIsImNvbnNvbGUiLCJsb2ciLCJ0b1VwcGVyQ2FzZSIsImNhdGNoIiwiZXJyb3IiLCJzdGFjayIsImZvckVhY2giLCJfbWFwQ2xpZW50VHlwZXNUb0FjdGl2aXR5IiwiZGVmYXVsdENsaWVudCIsIl9vcGVuQ2xpZW50Um91dGUiLCJzb2NrZXRzIiwid2Vic29ja2V0cyIsIm9uQ29ubmVjdGlvbiIsInNvY2tldCIsIl9vblNvY2tldENvbm5lY3Rpb24iLCJwYXRoIiwiam9pbiIsImN3ZCIsInRlbXBsYXRlRGlyZWN0b3J5IiwiY2xpZW50VG1wbCIsImRlZmF1bHRUbXBsIiwic3RhdCIsInN0YXRzIiwidGVtcGxhdGUiLCJpc0ZpbGUiLCJ0bXBsU3RyaW5nIiwiZW5jb2RpbmciLCJ0bXBsIiwiZWpzIiwiY29tcGlsZSIsInJlcSIsInJlcyIsImRhdGEiLCJhcHBJbmRleCIsInNlbmQiLCJjbGllbnQiLCJhY3Rpdml0aWVzIiwicmVjZWl2ZSIsImRpc2Nvbm5lY3QiLCJkZXN0cm95IiwiaW5mbyIsInNlcnZlclJlcXVpcmVkU2VydmljZXMiLCJnZXRSZXF1aXJlZFNlcnZpY2VzIiwic2VydmVyU2VydmljZXNMaXN0IiwiZ2V0U2VydmljZUxpc3QiLCJjbGllbnRSZXF1aXJlZFNlcnZpY2VzIiwicmVxdWlyZWRTZXJ2aWNlcyIsIm1pc3NpbmdTZXJ2aWNlcyIsInNlcnZpY2VJZCIsImluZGV4T2YiLCJwdXNoIiwibGVuZ3RoIiwidHlwZSIsInVybFBhcmFtcyIsImNvbm5lY3QiLCJ1dWlkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEVBOzs7Ozs7Ozs7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d0JBQVF3QixJQUFSLENBQWFDLE1BQWIsRUFBcUIsY0FBckIsRUFBcUNBLE9BQU9vQixJQUE1Qzs7QUFFQSxVQUFJckcsaUJBQU9zRixJQUFYLEVBQ0V0RixpQkFBT3NGLElBQVAsQ0FBWSxFQUFFM0IsY0FBRixFQUFVdkUsc0JBQVYsRUFBWixFQUFvQyxXQUFwQztBQUNILEtBaENEO0FBaUNEO0FBcFlZLENBQWY7O2tCQXVZZWhCLE0iLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENsaWVudCBmcm9tICcuL0NsaWVudCc7XG5pbXBvcnQgY29tcHJlc3Npb24gZnJvbSAnY29tcHJlc3Npb24nO1xuaW1wb3J0IGVqcyBmcm9tICdlanMnO1xuaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IGh0dHAgZnJvbSAnaHR0cCc7XG5pbXBvcnQgaHR0cHMgZnJvbSAnaHR0cHMnO1xuaW1wb3J0IGxvZ2dlciBmcm9tICcuLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgcGVtIGZyb20gJ3BlbSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgc29ja2V0cyBmcm9tICcuL3NvY2tldHMnO1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5zZXJ2ZXJ+c2VydmVyQ29uZmlnXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLnNlcnZlclxuICpcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBhcHBOYW1lIC0gTmFtZSBvZiB0aGUgYXBwbGljYXRpb24sIHVzZWQgaW4gdGhlIGAuZWpzYFxuICogIHRlbXBsYXRlIGFuZCBieSBkZWZhdWx0IGluIHRoZSBgcGxhdGZvcm1gIHNlcnZpY2UgdG8gcG9wdWxhdGUgaXRzIHZpZXcuXG4gKiBAcHJvcGVydHkge1N0cmluZ30gZW52IC0gTmFtZSBvZiB0aGUgZW52aXJvbm5lbWVudCAoJ3Byb2R1Y3Rpb24nIGVuYWJsZVxuICogIGNhY2hlIGluIGV4cHJlc3MgYXBwbGljYXRpb24pLlxuICogQHByb3BlcnR5IHtTdHJpbmd9IHZlcnNpb24gLSBWZXJzaW9uIG9mIGFwcGxpY2F0aW9uLCBjYW4gYmUgdXNlZCB0byBmb3JjZVxuICogIHJlbG9hZCBjc3MgYW5kIGpzIGZpbGVzIGZyb20gc2VydmVyIChjZi4gYGh0bWwvZGVmYXVsdC5lanNgKVxuICogQHByb3BlcnR5IHtTdHJpbmd9IGRlZmF1bHRDbGllbnQgLSBOYW1lIG9mIHRoZSBkZWZhdWx0IGNsaWVudCB0eXBlLFxuICogIGkuZS4gdGhlIGNsaWVudCB0aGF0IGNhbiBhY2Nlc3MgdGhlIGFwcGxpY2F0aW9uIGF0IGl0cyByb290IFVSTFxuICogQHByb3BlcnR5IHtTdHJpbmd9IGFzc2V0c0RvbWFpbiAtIERlZmluZSBmcm9tIHdoZXJlIHRoZSBhc3NldHMgKHN0YXRpYyBmaWxlcylcbiAqICBzaG91bGQgYmUgbG9hZGVkLCB0aGlzIHZhbHVlIGNhbiByZWZlciB0byBhIHNlcGFyYXRlIHNlcnZlciBmb3Igc2NhbGFiaWxpdHkuXG4gKiAgVGhlIHZhbHVlIHNob3VsZCBiZSB1c2VkIGNsaWVudC1zaWRlIHRvIGNvbmZpZ3VyZSB0aGUgYGF1ZGlvLWJ1ZmZlci1tYW5hZ2VyYFxuICogIHNlcnZpY2UuXG4gKiBAcHJvcGVydHkge051bWJlcn0gcG9ydCAtIFBvcnQgdXNlZCB0byBvcGVuIHRoZSBodHRwIHNlcnZlciwgaW4gcHJvZHVjdGlvblxuICogIHRoaXMgdmFsdWUgaXMgdHlwaWNhbGx5IDgwXG4gKlxuICogQHByb3BlcnR5IHtPYmplY3R9IHNldHVwIC0gRGVzY3JpYmUgdGhlIGxvY2F0aW9uIHdoZXJlIHRoZSBleHBlcmllbmNlIHRha2VzXG4gKiAgcGxhY2VzLCB0aGVzZXMgdmFsdWVzIGFyZSB1c2VkIGJ5IHRoZSBgcGxhY2VyYCwgYGNoZWNraW5gIGFuZCBgbG9jYXRvcmBcbiAqICBzZXJ2aWNlcy4gSWYgb25lIG9mIHRoZXNlIHNlcnZpY2UgaXMgcmVxdWlyZWQsIHRoaXMgZW50cnkgbWFuZGF0b3J5LlxuICogQHByb3BlcnR5IHtPYmplY3R9IHNldHVwLmFyZWEgLSBEZXNjcmlwdGlvbiBvZiB0aGUgYXJlYS5cbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBzZXR1cC5hcmVhLndpZHRoIC0gV2lkdGggb2YgdGhlIGFyZWEuXG4gKiBAcHJvcGVydHkge051bWJlcn0gc2V0dXAuYXJlYS5oZWlnaHQgLSBIZWlnaHQgb2YgdGhlIGFyZWEuXG4gKiBAcHJvcGVydHkge1N0cmluZ30gc2V0dXAuYXJlYS5iYWNrZ3JvdW5kIC0gUGF0aCB0byBhbiBpbWFnZSB0byBiZSB1c2VkIGluXG4gKiAgdGhlIGFyZWEgcmVwcmVzZW50YXRpb24uXG4gKiBAcHJvcGVydHkge0FycmF5fSBzZXR1cC5sYWJlbHMgLSBPcHRpb25uYWwgbGlzdCBvZiBwcmVkZWZpbmVkIGxhYmVscy5cbiAqIEBwcm9wZXJ0eSB7QXJyYXl9IHNldHVwLmNvb3JkaW5hdGVzIC0gT3B0aW9ubmFsIGxpc3Qgb2YgcHJlZGVmaW5lZCBjb29yZGluYXRlcy5cbiAqIEBwcm9wZXJ0eSB7QXJyYXl9IHNldHVwLm1heENsaWVudHNQZXJQb3NpdGlvbiAtIE1heGltdW0gbnVtYmVyIG9mIGNsaWVudHNcbiAqICBhbGxvd2VkIGluIGEgcG9zaXRpb24uXG4gKiBAcHJvcGVydHkge051bWJlcn0gc2V0dXAuY2FwYWNpdHkgLSBNYXhpbXVtIG51bWJlciBvZiBwb3NpdGlvbnMgKG1heSBsaW1pdFxuICogb3IgYmUgbGltaXRlZCBieSB0aGUgbnVtYmVyIG9mIGxhYmVscyBhbmQvb3IgY29vcmRpbmF0ZXMpLlxuICpcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSB3ZWJzb2NrZXRzIC0gV2Vic29ja2V0cyBjb25maWd1cmF0aW9uIChzb2NrZXQuaW8pXG4gKiBAcHJvcGVydHkge1N0cmluZ30gd2Vic29ja2V0cy51cmwgLSBPcHRpb25uYWwgdXJsIHdoZXJlIHRoZSBzb2NrZXQgc2hvdWxkXG4gKiAgY29ubmVjdC5cbiAqIEBwcm9wZXJ0eSB7QXJyYXl9IHdlYnNvY2tldHMudHJhbnNwb3J0cyAtIExpc3Qgb2YgdGhlIHRyYW5zcG9ydCBtZWNhbmltcyB0aGF0XG4gKiAgc2hvdWxkIGJlIHVzZWQgdG8gb3BlbiBvciBlbXVsYXRlIHRoZSBzb2NrZXQuXG4gKlxuICogQHByb3BlcnR5IHtCb29sZWFufSB1c2VIdHRwcyAtICBEZWZpbmUgaWYgdGhlIEhUVFAgc2VydmVyIHNob3VsZCBiZSBsYXVuY2hlZFxuICogIHVzaW5nIHNlY3VyZSBjb25uZWN0aW9ucy4gRm9yIGRldmVsb3BtZW50IHB1cnBvc2VzIHdoZW4gc2V0IHRvIGB0cnVlYCBhbmQgbm9cbiAqICBjZXJ0aWZpY2F0ZXMgYXJlIGdpdmVuIChjZi4gYGh0dHBzSW5mb3NgKSwgYSBzZWxmLXNpZ25lZCBjZXJ0aWZpY2F0ZSBpc1xuICogIGNyZWF0ZWQuXG4gKiBAcHJvcGVydHkge09iamVjdH0gaHR0cHNJbmZvcyAtIFBhdGhzIHRvIHRoZSBrZXkgYW5kIGNlcnRpZmljYXRlIHRvIGJlIHVzZWRcbiAqICBpbiBvcmRlciB0byBsYXVuY2ggdGhlIGh0dHBzIHNlcnZlci4gQm90aCBlbnRyaWVzIGFyZSByZXF1aXJlZCBvdGhlcndpc2UgYVxuICogIHNlbGYtc2lnbmVkIGNlcnRpZmljYXRlIGlzIGdlbmVyYXRlZC5cbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBodHRwc0luZm9zLmNlcnQgLSBQYXRoIHRvIHRoZSBjZXJ0aWZpY2F0ZS5cbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBodHRwc0luZm9zLmtleSAtIFBhdGggdG8gdGhlIGtleS5cbiAqXG4gKiBAcHJvcGVydHkge1N0cmluZ30gcGFzc3dvcmQgLSBQYXNzd29yZCB0byBiZSB1c2VkIGJ5IHRoZSBgYXV0aGAgc2VydmljZS5cbiAqXG4gKiBAcHJvcGVydHkge09iamVjdH0gb3NjIC0gQ29uZmlndXJhdGlvbiBvZiB0aGUgYG9zY2Agc2VydmljZS5cbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBvc2MucmVjZWl2ZUFkZHJlc3MgLSBJUCBvZiB0aGUgY3VycmVudGx5IHJ1bm5pbmcgc2VydmVyLlxuICogQHByb3BlcnR5IHtOdW1iZXJ9IG9zYy5yZWNlaXZlUG9ydCAtIFBvcnQgbGlzdGVuaW5nIGZvciBpbmNvbW1pbmcgbWVzc2FnZXMuXG4gKiBAcHJvcGVydHkge1N0cmluZ30gb3NjLnNlbmRBZGRyZXNzIC0gSVAgb2YgdGhlIHJlbW90ZSBhcHBsaWNhdGlvbi5cbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBvc2Muc2VuZFBvcnQgLSBQb3J0IHdoZXJlIHRoZSByZW1vdGUgYXBwbGljYXRpb24gaXNcbiAqICBsaXN0ZW5pbmcgZm9yIG1lc3NhZ2VzXG4gKlxuICogQHByb3BlcnR5IHtCb29sZWFufSBlbmFibGVHWmlwQ29tcHJlc3Npb24gLSBEZWZpbmUgaWYgdGhlIHNlcnZlciBzaG91bGQgdXNlXG4gKiAgZ3ppcCBjb21wcmVzc2lvbiBmb3Igc3RhdGljIGZpbGVzLlxuICogQHByb3BlcnR5IHtTdHJpbmd9IHB1YmxpY0RpcmVjdG9yeSAtIExvY2F0aW9uIG9mIHRoZSBwdWJsaWMgZGlyZWN0b3J5XG4gKiAgKGFjY2Vzc2libGUgdGhyb3VnaCBodHRwKHMpIHJlcXVlc3RzKS5cbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBzZXJ2ZVN0YXRpY09wdGlvbnMgLSBPcHRpb25zIGZvciB0aGUgc2VydmUgc3RhdGljIG1pZGRsZXdhcmVcbiAqICBjZi4gW2h0dHBzOi8vZ2l0aHViLmNvbS9leHByZXNzanMvc2VydmUtc3RhdGljXShodHRwczovL2dpdGh1Yi5jb20vZXhwcmVzc2pzL3NlcnZlLXN0YXRpYylcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSB0ZW1wbGF0ZURpcmVjdG9yeSAtIERpcmVjdG9yeSB3aGVyZSB0aGUgc2VydmVyIHRlbXBsYXRpbmdcbiAqICBzeXN0ZW0gbG9va3MgZm9yIHRoZSBgZWpzYCB0ZW1wbGF0ZXMuXG4gKiBAcHJvcGVydHkge09iamVjdH0gbG9nZ2VyIC0gQ29uZmlndXJhdGlvbiBvZiB0aGUgbG9nZ2VyIHNlcnZpY2UsIGNmLiBCdW55YW5cbiAqICBkb2N1bWVudGF0aW9uLlxuICogQHByb3BlcnR5IHtTdHJpbmd9IGVycm9yUmVwb3J0ZXJEaXJlY3RvcnkgLSBEaXJlY3Rvcnkgd2hlcmUgZXJyb3IgcmVwb3J0ZWRcbiAqICBmcm9tIHRoZSBjbGllbnRzIGFyZSB3cml0dGVuLlxuICovXG5cblxuLyoqXG4gKiBTZXJ2ZXIgc2lkZSBlbnRyeSBwb2ludCBmb3IgYSBgc291bmR3b3Jrc2AgYXBwbGljYXRpb24uXG4gKlxuICogVGhpcyBvYmplY3QgaG9zdHMgY29uZmlndXJhdGlvbiBpbmZvcm1hdGlvbnMsIGFzIHdlbGwgYXMgbWV0aG9kcyB0b1xuICogaW5pdGlhbGl6ZSBhbmQgc3RhcnQgdGhlIGFwcGxpY2F0aW9uLiBJdCBpcyBhbHNvIHJlc3BvbnNpYmxlIGZvciBjcmVhdGluZ1xuICogdGhlIHN0YXRpYyBmaWxlIChodHRwKSBzZXJ2ZXIgYXMgd2VsbCBhcyB0aGUgc29ja2V0IHNlcnZlci5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyXG4gKiBAbmFtZXNwYWNlXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIHNvdW5kd29ya3MgZnJvbSAnc291bmR3b3Jrcy9zZXJ2ZXInO1xuICogaW1wb3J0IE15RXhwZXJpZW5jZSBmcm9tICcuL015RXhwZXJpZW5jZSc7XG4gKlxuICogc291bmR3b3Jrcy5zZXJ2ZXIuaW5pdChjb25maWcpO1xuICogY29uc3QgbXlFeHBlcmllbmNlID0gbmV3IE15RXhwZXJpZW5jZSgpO1xuICogc291bmR3b3Jrcy5zZXJ2ZXIuc3RhcnQoKTtcbiAqL1xuY29uc3Qgc2VydmVyID0ge1xuICAvKipcbiAgICogQ29uZmlndXJhdGlvbiBpbmZvcm1hdGlvbnMsIGFsbCBjb25maWcgb2JqZWN0cyBwYXNzZWQgdG8gdGhlXG4gICAqIFtgc2VydmVyLmluaXRgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuc2VydmVyLmluaXR9IGFyZSBtZXJnZWRcbiAgICogaW50byB0aGlzIG9iamVjdC5cbiAgICogQHR5cGUge21vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5zZXJ2ZXJ+c2VydmVyQ29uZmlnfVxuICAgKi9cbiAgY29uZmlnOiB7fSxcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgdXNlZCB0byBpbnN0YW5jaWF0ZSBgQ2xpZW50YCBpbnN0YW5jZXMuXG4gICAqIEB0eXBlIHttb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuQ2xpZW50fVxuICAgKiBAZGVmYXVsdCBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuQ2xpZW50XG4gICAqL1xuICBjbGllbnRDdG9yOiBDbGllbnQsXG5cbiAgLyoqXG4gICAqIFRoZSB1cmwgb2YgdGhlIG5vZGUgc2VydmVyIG9uIHRoZSBjdXJyZW50IG1hY2hpbmUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfYWRkcmVzczogJycsXG5cbiAgLyoqXG4gICAqIE1hcHBpbmcgYmV0d2VlbiBhIGBjbGllbnRUeXBlYCBhbmQgaXRzIHJlbGF0ZWQgYWN0aXZpdGllcy5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9jbGllbnRUeXBlQWN0aXZpdGllc01hcDoge30sXG5cbiAgLyoqXG4gICAqIGV4cHJlc3MgaW5zdGFuY2UsIGNhbiBhbGxvdyB0byBleHBvc2UgYWRkaXRpb25uYWwgcm91dGVzIChlLmcuIFJFU1QgQVBJKS5cbiAgICogQHVuc3RhYmxlXG4gICAqL1xuICByb3V0ZXI6IG51bGwsXG5cbiAgLyoqXG4gICAqIEhUVFAoUykgc2VydmVyIGluc3RhbmNlLlxuICAgKiBAdW5zdGFibGVcbiAgICovXG4gIGh0dHBTZXJ2ZXI6IG51bGwsXG5cbiAgLyoqXG4gICAqIFJlcXVpcmVkIGFjdGl2aXRpZXMgdGhhdCBtdXN0IGJlIHN0YXJ0ZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfYWN0aXZpdGllczogbmV3IFNldCgpLFxuXG4gIC8qKlxuICAgKiBPcHRpb25uYWwgcm91dGluZyBkZWZpbmVkIGZvciBlYWNoIGNsaWVudC5cbiAgICogQHByaXZhdGVcbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG4gIF9yb3V0ZXM6IHt9LFxuXG4gIGdldCBjbGllbnRUeXBlcygpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5fY2xpZW50VHlwZUFjdGl2aXRpZXNNYXApO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYSBzZXJ2aWNlIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gSWRlbnRpZmllciBvZiB0aGUgc2VydmljZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPcHRpb25zIHRvIGNvbmZpZ3VyZSB0aGUgc2VydmljZS5cbiAgICovXG4gIHJlcXVpcmUoaWQsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gc2VydmljZU1hbmFnZXIucmVxdWlyZShpZCwgb3B0aW9ucyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIERlZmF1bHQgZm9yIHRoZSBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuc2VydmVyfmNsaWVudENvbmZpZ0RlZmluaXRpb25cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9jbGllbnRDb25maWdEZWZpbml0aW9uOiAoY2xpZW50VHlwZSwgc2VydmVyQ29uZmlnLCBodHRwUmVxdWVzdCkgPT4ge1xuICAgIHJldHVybiB7IGNsaWVudFR5cGUgfTtcbiAgfSxcblxuICAvKipcbiAgICogQGNhbGxiYWNrIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5zZXJ2ZXJ+Y2xpZW50Q29uZmlnRGVmaW5pdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2xpZW50VHlwZSAtIFR5cGUgb2YgdGhlIGNsaWVudC5cbiAgICogQHBhcmFtIHtPYmplY3R9IHNlcnZlckNvbmZpZyAtIENvbmZpZ3VyYXRpb24gb2YgdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtPYmplY3R9IGh0dHBSZXF1ZXN0IC0gSHR0cCByZXF1ZXN0IGZvciB0aGUgYGluZGV4Lmh0bWxgXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG4gIC8qKlxuICAgKiBTZXQgdGhlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuc2VydmVyfmNsaWVudENvbmZpZ0RlZmluaXRpb259IHdpdGhcbiAgICogYSB1c2VyIGRlZmluZWQgZnVuY3Rpb24uXG4gICAqIEBwYXJhbSB7bW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLnNlcnZlcn5jbGllbnRDb25maWdEZWZpbml0aW9ufSBmdW5jIC0gQVxuICAgKiAgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBkYXRhIHRoYXQgd2lsbCBiZSB1c2VkIHRvIHBvcHVsYXRlIHRoZSBgaW5kZXguaHRtbGBcbiAgICogIHRlbXBsYXRlLiBUaGUgZnVuY3Rpb24gY291bGQgKGFuZCBzaG91bGQpIGJlIHVzZWQgdG8gcGFzcyBjb25maWd1cmF0aW9uXG4gICAqICB0byB0aGUgc291bmR3b3JrcyBjbGllbnQuXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5jbGllbnR+aW5pdH1cbiAgICovXG4gIHNldENsaWVudENvbmZpZ0RlZmluaXRpb24oZnVuYykge1xuICAgIHRoaXMuX2NsaWVudENvbmZpZ0RlZmluaXRpb24gPSBmdW5jO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIHJvdXRlIGZvciBhIGdpdmVuIGBjbGllbnRUeXBlYCwgYWxsb3cgdG8gZGVmaW5lIGEgbW9yZSBjb21wbGV4XG4gICAqIHJvdXRpbmcgKGFkZGl0aW9ubmFsIHJvdXRlIHBhcmFtZXRlcnMpIGZvciBhIGdpdmVuIHR5cGUgb2YgY2xpZW50LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2xpZW50VHlwZSAtIFR5cGUgb2YgdGhlIGNsaWVudC5cbiAgICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfSByb3V0ZSAtIFRlbXBsYXRlIG9mIHRoZSByb3V0ZSB0aGF0IHNob3VsZCBiZSBhcHBlbmQuXG4gICAqICB0byB0aGUgY2xpZW50IHR5cGVcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogYGBgXG4gICAqIC8vIGFsbG93IGBjb25kdWN0b3JgIGNsaWVudHMgdG8gY29ubmVjdCB0byBgaHR0cDovL3NpdGUuY29tL2NvbmR1Y3Rvci8xYFxuICAgKiBzZXJ2ZXIucmVnaXN0ZXJSb3V0ZSgnY29uZHVjdG9yJywgJy86cGFyYW0nKVxuICAgKiBgYGBcbiAgICovXG4gIGRlZmluZVJvdXRlKGNsaWVudFR5cGUsIHJvdXRlKSB7XG4gICAgdGhpcy5fcm91dGVzW2NsaWVudFR5cGVdID0gcm91dGU7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uIHVzZWQgYnkgYWN0aXZpdGllcyB0byByZWdpc3RlciB0aGVtc2VsdmVzIGFzIGFjdGl2ZSBhY3Rpdml0aWVzXG4gICAqIEBwYXJhbSB7QWN0aXZpdHl9IGFjdGl2aXR5IC0gQWN0aXZpdHkgdG8gYmUgcmVnaXN0ZXJlZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNldEFjdGl2aXR5KGFjdGl2aXR5KSB7XG4gICAgdGhpcy5fYWN0aXZpdGllcy5hZGQoYWN0aXZpdHkpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBzZXJ2ZXIgd2l0aCB0aGUgZ2l2ZW4gY29uZmlndXJhdGlvbi5cbiAgICogQXQgdGhlIGVuZCBvZiB0aGUgaW5pdCBzdGVwIHRoZSBleHByZXNzIHJvdXRlciBpcyBhdmFpbGFibGUuXG4gICAqXG4gICAqIEBwYXJhbSB7bW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLnNlcnZlcn5zZXJ2ZXJDb25maWd9IGNvbmZpZyAtXG4gICAqICBDb25maWd1cmF0aW9uIG9mIHRoZSBhcHBsaWNhdGlvbi5cbiAgICovXG4gIGluaXQoY29uZmlnKSB7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy5fcG9wdWxhdGVEZWZhdWx0Q29uZmlnKCk7XG5cbiAgICBzZXJ2aWNlTWFuYWdlci5pbml0KCk7XG5cbiAgICBpZiAodGhpcy5jb25maWcubG9nZ2VyICE9PSB1bmRlZmluZWQpXG4gICAgICBsb2dnZXIuaW5pdCh0aGlzLmNvbmZpZy5sb2dnZXIpO1xuXG4gICAgLy8gaW5zdGFuY2lhdGUgYW5kIGNvbmZpZ3VyZSBleHByZXNzXG4gICAgLy8gdGhpcyBhbGxvd3MgdG8gaG9vayBtaWRkbGV3YXJlIGFuZCByb3V0ZXMgKGUuZy4gY29ycykgaW4gdGhlIGV4cHJlc3NcbiAgICAvLyBpbnN0YW5jZSBiZXR3ZWVuIGBzZXJ2ZXIuaW5pdGAgYW5kIGBzZXJ2ZXIuc3RhcnRgXG4gICAgdGhpcy5yb3V0ZXIgPSBuZXcgZXhwcmVzcygpO1xuICAgIHRoaXMucm91dGVyLnNldCgncG9ydCcsIHByb2Nlc3MuZW52LlBPUlQgfHwgdGhpcy5jb25maWcucG9ydCk7XG4gICAgdGhpcy5yb3V0ZXIuc2V0KCd2aWV3IGVuZ2luZScsICdlanMnKTtcbiAgICAvLyBhbGxvdyBwcm9taXNlIGJhc2VkIHN5bnRheCBmb3Igc2VydmVyIGluaXRpYWxpemF0aW9uXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgYXBwbGljYXRpb246XG4gICAqIC0gbGF1bmNoIHRoZSBodHRwKHMpIHNlcnZlci5cbiAgICogLSBsYXVuY2ggdGhlIHNvY2tldCBzZXJ2ZXIuXG4gICAqIC0gc3RhcnQgYWxsIHJlZ2lzdGVyZWQgYWN0aXZpdGllcy5cbiAgICogLSBkZWZpbmUgcm91dGVzIGFuZCBhY3Rpdml0aWVzIG1hcHBpbmcgZm9yIGFsbCBjbGllbnQgdHlwZXMuXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICAvLyBjb21wcmVzc2lvblxuICAgIGlmICh0aGlzLmNvbmZpZy5lbmFibGVHWmlwQ29tcHJlc3Npb24pXG4gICAgICB0aGlzLnJvdXRlci51c2UoY29tcHJlc3Npb24oKSk7XG5cbiAgICAvLyBwdWJsaWMgZm9sZGVyXG4gICAgY29uc3QgeyBwdWJsaWNEaXJlY3RvcnksIHNlcnZlU3RhdGljT3B0aW9ucyB9ID0gdGhpcy5jb25maWc7XG4gICAgY29uc3Qgc3RhdGljTWlkZGxld2FyZSA9IGV4cHJlc3Muc3RhdGljKHB1YmxpY0RpcmVjdG9yeSwgc2VydmVTdGF0aWNPcHRpb25zKTtcbiAgICB0aGlzLnJvdXRlci51c2Uoc3RhdGljTWlkZGxld2FyZSk7XG5cbiAgICB0aGlzLl9pbml0QWN0aXZpdGllcygpO1xuICAgIHRoaXMuX2luaXRSb3V0aW5nKHRoaXMucm91dGVyKTtcbiAgICAvLyBleHBvc2Ugcm91dGVyIHRvIGFsbG93IGFkZGluZyBzb21lIHJvdXRlcyAoZS5nLiBSRVNUIEFQSSlcbiAgICBjb25zdCB1c2VIdHRwcyA9IHRoaXMuY29uZmlnLnVzZUh0dHBzIHx8wqBmYWxzZTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAvLyBsYXVuY2ggaHR0cChzKSBzZXJ2ZXJcbiAgICAgIGlmICghdXNlSHR0cHMpIHtcbiAgICAgICAgY29uc3QgaHR0cFNlcnZlciA9IGh0dHAuY3JlYXRlU2VydmVyKHRoaXMucm91dGVyKTtcbiAgICAgICAgcmVzb2x2ZShodHRwU2VydmVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGh0dHBzSW5mb3MgPSB0aGlzLmNvbmZpZy5odHRwc0luZm9zO1xuICAgICAgICAvLyB1c2UgZ2l2ZW4gY2VydGlmaWNhdGVcbiAgICAgICAgaWYgKGh0dHBzSW5mb3Mua2V5ICYmIGh0dHBzSW5mb3MuY2VydCkge1xuICAgICAgICAgIGNvbnN0IGtleSA9IGZzLnJlYWRGaWxlU3luYyhodHRwc0luZm9zLmtleSk7XG4gICAgICAgICAgY29uc3QgY2VydCA9IGZzLnJlYWRGaWxlU3luYyhodHRwc0luZm9zLmNlcnQpO1xuICAgICAgICAgIGNvbnN0IGh0dHBzU2VydmVyID0gaHR0cHMuY3JlYXRlU2VydmVyKHsga2V5LCBjZXJ0IH0sIHRoaXMucm91dGVyKTtcbiAgICAgICAgICByZXNvbHZlKGh0dHBzU2VydmVyKTtcbiAgICAgICAgLy8gZ2VuZXJhdGUgY2VydGlmaWNhdGUgb24gdGhlIGZseSAoZm9yIGRldmVsb3BtZW50IHB1cnBvc2VzKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBlbS5jcmVhdGVDZXJ0aWZpY2F0ZSh7IGRheXM6IDEsIHNlbGZTaWduZWQ6IHRydWUgfSwgKGVyciwga2V5cykgPT4ge1xuICAgICAgICAgICAgY29uc3QgaHR0cHNTZXJ2ZXIgPSBodHRwcy5jcmVhdGVTZXJ2ZXIoe1xuICAgICAgICAgICAgICBrZXk6IGtleXMuc2VydmljZUtleSxcbiAgICAgICAgICAgICAgY2VydDoga2V5cy5jZXJ0aWZpY2F0ZSxcbiAgICAgICAgICAgIH0sIHRoaXMucm91dGVyKTtcblxuICAgICAgICAgICAgcmVzb2x2ZShodHRwc1NlcnZlcik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KS50aGVuKChodHRwU2VydmVyKSA9PiB7XG4gICAgICB0aGlzLl9pbml0U29ja2V0cyhodHRwU2VydmVyKTtcblxuICAgICAgdGhpcy5odHRwU2VydmVyID0gaHR0cFNlcnZlcjtcblxuICAgICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgc2VydmljZU1hbmFnZXIuc2lnbmFscy5yZWFkeS5hZGRPYnNlcnZlcigoKSA9PiB7XG4gICAgICAgICAgaHR0cFNlcnZlci5saXN0ZW4odGhpcy5yb3V0ZXIuZ2V0KCdwb3J0JyksICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHByb3RvY29sID0gdXNlSHR0cHMgPyAnaHR0cHMnIDogJ2h0dHAnO1xuICAgICAgICAgICAgdGhpcy5fYWRkcmVzcyA9IGAke3Byb3RvY29sfTovLzEyNy4wLjAuMToke3RoaXMucm91dGVyLmdldCgncG9ydCcpfWA7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgWyR7cHJvdG9jb2wudG9VcHBlckNhc2UoKX0gU0VSVkVSXSBTZXJ2ZXIgbGlzdGVuaW5nIG9uYCwgdGhpcy5fYWRkcmVzcyk7XG5cbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgc2VydmljZU1hbmFnZXIuc3RhcnQoKTtcblxuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfSkuY2F0Y2goKGVycikgPT4gY29uc29sZS5lcnJvcihlcnIuc3RhY2spKTtcbiAgfSxcblxuICAvKipcbiAgICogTWFwIGFjdGl2aXRpZXMgdG8gdGhlaXIgcmVzcGVjdGl2ZSBjbGllbnQgdHlwZShzKSBhbmQgc3RhcnQgdGhlbSBhbGwuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaW5pdEFjdGl2aXRpZXMoKSB7XG4gICAgdGhpcy5fYWN0aXZpdGllcy5mb3JFYWNoKChhY3Rpdml0eSkgPT4ge1xuICAgICAgdGhpcy5fbWFwQ2xpZW50VHlwZXNUb0FjdGl2aXR5KGFjdGl2aXR5LmNsaWVudFR5cGVzLCBhY3Rpdml0eSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEluaXQgcm91dGluZyBmb3IgZWFjaCBjbGllbnQuIFRoZSBkZWZhdWx0IGNsaWVudCByb3V0ZSBtdXN0IGJlIGNyZWF0ZWQgbGFzdC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9pbml0Um91dGluZyhyb3V0ZXIpIHtcbiAgICBmb3IgKGxldCBjbGllbnRUeXBlIGluIHRoaXMuX2NsaWVudFR5cGVBY3Rpdml0aWVzTWFwKSB7XG4gICAgICBpZiAoY2xpZW50VHlwZSAhPT0gdGhpcy5jb25maWcuZGVmYXVsdENsaWVudClcbiAgICAgICAgdGhpcy5fb3BlbkNsaWVudFJvdXRlKGNsaWVudFR5cGUsIHJvdXRlcik7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgY2xpZW50VHlwZSBpbiB0aGlzLl9jbGllbnRUeXBlQWN0aXZpdGllc01hcCkge1xuICAgICAgaWYgKGNsaWVudFR5cGUgPT09IHRoaXMuY29uZmlnLmRlZmF1bHRDbGllbnQpXG4gICAgICAgIHRoaXMuX29wZW5DbGllbnRSb3V0ZShjbGllbnRUeXBlLCByb3V0ZXIpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogSW5pdCB3ZWJzb2NrZXQgc2VydmVyLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2luaXRTb2NrZXRzKGh0dHBTZXJ2ZXIpIHtcbiAgICBzb2NrZXRzLmluaXQoaHR0cFNlcnZlciwgdGhpcy5jb25maWcud2Vic29ja2V0cyk7XG4gICAgLy8gc29ja2V0IGNvbm5uZWN0aW9uXG4gICAgc29ja2V0cy5vbkNvbm5lY3Rpb24odGhpcy5jbGllbnRUeXBlcywgKGNsaWVudFR5cGUsIHNvY2tldCkgPT4ge1xuICAgICAgdGhpcy5fb25Tb2NrZXRDb25uZWN0aW9uKGNsaWVudFR5cGUsIHNvY2tldCk7XG4gICAgfSk7XG4gIH0sXG5cbiAgIC8qKlxuICAgKiBQb3B1bGF0ZSBtYW5kYXRvcnkgY29uZmlndXJhdGlvbiBvcHRpb25zXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfcG9wdWxhdGVEZWZhdWx0Q29uZmlnKCkge1xuICAgIGlmICh0aGlzLmNvbmZpZy5wb3J0ID09PSB1bmRlZmluZWQpXG4gICAgICDCoHRoaXMuY29uZmlnLnBvcnQgPSA4MDAwO1xuXG4gICAgaWYgKHRoaXMuY29uZmlnLmVuYWJsZUdaaXBDb21wcmVzc2lvbiA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhpcy5jb25maWcuZW5hYmxlR1ppcENvbXByZXNzaW9uID0gdHJ1ZTtcblxuICAgIGlmICh0aGlzLmNvbmZpZy5wdWJsaWNEaXJlY3RvcnkgPT09IHVuZGVmaW5lZClcbiAgICAgIHRoaXMuY29uZmlnLnB1YmxpY0RpcmVjdG9yeSA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAncHVibGljJyk7XG5cbiAgICBpZiAodGhpcy5jb25maWcuc2VydmVTdGF0aWNPcHRpb25zID09PSB1bmRlZmluZWQpXG4gICAgICB0aGlzLmNvbmZpZy5zZXJ2ZVN0YXRpY09wdGlvbnMgPSB7fTtcblxuICAgIGlmICh0aGlzLmNvbmZpZy50ZW1wbGF0ZURpcmVjdG9yeSA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhpcy5jb25maWcudGVtcGxhdGVEaXJlY3RvcnkgPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ2h0bWwnKTtcblxuICAgIGlmICh0aGlzLmNvbmZpZy5kZWZhdWx0Q2xpZW50ID09PSB1bmRlZmluZWQpXG4gICAgICB0aGlzLmNvbmZpZy5kZWZhdWx0Q2xpZW50ID0gJ3BsYXllcic7XG5cbiAgICBpZiAodGhpcy5jb25maWcud2Vic29ja2V0cyA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhpcy5jb25maWcud2Vic29ja2V0cyA9IHt9O1xuICB9LFxuXG4gIC8qKlxuICAgKiBNYXAgY2xpZW50IHR5cGVzIHdpdGggYW4gYWN0aXZpdHkuXG4gICAqIEBwYXJhbSB7QXJyYXk8U3RyaW5nPn0gY2xpZW50VHlwZXMgLSBMaXN0IG9mIGNsaWVudCB0eXBlLlxuICAgKiBAcGFyYW0ge0FjdGl2aXR5fSBhY3Rpdml0eSAtIEFjdGl2aXR5IGNvbmNlcm5lZCB3aXRoIHRoZSBnaXZlbiBgY2xpZW50VHlwZXNgLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX21hcENsaWVudFR5cGVzVG9BY3Rpdml0eShjbGllbnRUeXBlcywgYWN0aXZpdHkpIHtcbiAgICBjbGllbnRUeXBlcy5mb3JFYWNoKChjbGllbnRUeXBlKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuX2NsaWVudFR5cGVBY3Rpdml0aWVzTWFwW2NsaWVudFR5cGVdKVxuICAgICAgICB0aGlzLl9jbGllbnRUeXBlQWN0aXZpdGllc01hcFtjbGllbnRUeXBlXSA9IG5ldyBTZXQoKTtcblxuICAgICAgdGhpcy5fY2xpZW50VHlwZUFjdGl2aXRpZXNNYXBbY2xpZW50VHlwZV0uYWRkKGFjdGl2aXR5KTtcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogT3BlbiB0aGUgcm91dGUgZm9yIHRoZSBnaXZlbiBjbGllbnQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfb3BlbkNsaWVudFJvdXRlKGNsaWVudFR5cGUsIHJvdXRlcikge1xuICAgIGxldCByb3V0ZSA9ICcnO1xuXG4gICAgaWYgKHRoaXMuX3JvdXRlc1tjbGllbnRUeXBlXSlcbiAgICAgIHJvdXRlICs9IHRoaXMuX3JvdXRlc1tjbGllbnRUeXBlXTtcblxuICAgIGlmIChjbGllbnRUeXBlICE9PSB0aGlzLmNvbmZpZy5kZWZhdWx0Q2xpZW50KVxuICAgICAgcm91dGUgPSBgLyR7Y2xpZW50VHlwZX0ke3JvdXRlfWA7XG5cbiAgICAvLyBkZWZpbmUgdGVtcGxhdGUgZmlsZW5hbWU6IGAke2NsaWVudFR5cGV9LmVqc2Agb3IgYGRlZmF1bHQuZWpzYFxuICAgIGNvbnN0IHRlbXBsYXRlRGlyZWN0b3J5ID0gdGhpcy5jb25maWcudGVtcGxhdGVEaXJlY3Rvcnk7XG4gICAgY29uc3QgY2xpZW50VG1wbCA9IHBhdGguam9pbih0ZW1wbGF0ZURpcmVjdG9yeSwgYCR7Y2xpZW50VHlwZX0uZWpzYCk7XG4gICAgY29uc3QgZGVmYXVsdFRtcGwgPSBwYXRoLmpvaW4odGVtcGxhdGVEaXJlY3RvcnksIGBkZWZhdWx0LmVqc2ApO1xuXG4gICAgZnMuc3RhdChjbGllbnRUbXBsLCAoZXJyLCBzdGF0cykgPT4ge1xuICAgICAgbGV0IHRlbXBsYXRlO1xuXG4gICAgICBpZiAoZXJyIHx8ICFzdGF0cy5pc0ZpbGUoKSlcbiAgICAgICAgdGVtcGxhdGUgPSBkZWZhdWx0VG1wbDtcbiAgICAgIGVsc2VcbiAgICAgICAgdGVtcGxhdGUgPSBjbGllbnRUbXBsO1xuXG4gICAgICBjb25zdCB0bXBsU3RyaW5nID0gZnMucmVhZEZpbGVTeW5jKHRlbXBsYXRlLCB7IGVuY29kaW5nOiAndXRmOCcgfSk7XG4gICAgICBjb25zdCB0bXBsID0gZWpzLmNvbXBpbGUodG1wbFN0cmluZyk7XG5cbiAgICAgIC8vIGh0dHAgcmVxdWVzdFxuICAgICAgcm91dGVyLmdldChyb3V0ZSwgKHJlcSwgcmVzKSA9PiB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLl9jbGllbnRDb25maWdEZWZpbml0aW9uKGNsaWVudFR5cGUsIHRoaXMuY29uZmlnLCByZXEpO1xuICAgICAgICBjb25zdCBhcHBJbmRleCA9IHRtcGwoeyBkYXRhIH0pO1xuICAgICAgICByZXMuc2VuZChhcHBJbmRleCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogU29ja2V0IGNvbm5lY3Rpb24gY2FsbGJhY2suXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfb25Tb2NrZXRDb25uZWN0aW9uKGNsaWVudFR5cGUsIHNvY2tldCkge1xuICAgIGNvbnN0IGNsaWVudCA9IG5ldyB0aGlzLmNsaWVudEN0b3IoY2xpZW50VHlwZSwgc29ja2V0KTtcbiAgICBjb25zdCBhY3Rpdml0aWVzID0gdGhpcy5fY2xpZW50VHlwZUFjdGl2aXRpZXNNYXBbY2xpZW50VHlwZV07XG5cbiAgICAvLyBnbG9iYWwgbGlmZWN5Y2xlIG9mIHRoZSBjbGllbnRcbiAgICBzb2NrZXRzLnJlY2VpdmUoY2xpZW50LCAnZGlzY29ubmVjdCcsICgpID0+IHtcbiAgICAgIGFjdGl2aXRpZXMuZm9yRWFjaCgoYWN0aXZpdHkpID0+IGFjdGl2aXR5LmRpc2Nvbm5lY3QoY2xpZW50KSk7XG4gICAgICBjbGllbnQuZGVzdHJveSgpO1xuXG4gICAgICBpZiAobG9nZ2VyLmluZm8pXG4gICAgICAgIGxvZ2dlci5pbmZvKHsgc29ja2V0LCBjbGllbnRUeXBlIH0sICdkaXNjb25uZWN0Jyk7XG4gICAgfSk7XG5cbiAgICAvLyBjaGVjayBjb2hlcmVuY2UgYmV0d2VlbiBjbGllbnQtc2lkZSBhbmQgc2VydmVyLXNpZGUgc2VydmljZSByZXF1aXJlbWVudHNcbiAgICBjb25zdCBzZXJ2ZXJSZXF1aXJlZFNlcnZpY2VzID0gc2VydmljZU1hbmFnZXIuZ2V0UmVxdWlyZWRTZXJ2aWNlcyhjbGllbnRUeXBlKTtcbiAgICBjb25zdCBzZXJ2ZXJTZXJ2aWNlc0xpc3QgPSBzZXJ2aWNlTWFuYWdlci5nZXRTZXJ2aWNlTGlzdCgpO1xuXG4gICAgc29ja2V0cy5yZWNlaXZlKGNsaWVudCwgJ2hhbmRzaGFrZScsIChkYXRhKSA9PiB7XG4gICAgICAvLyBpbiBkZXZlbG9wbWVudCwgaWYgc2VydmljZSByZXF1aXJlZCBjbGllbnQtc2lkZSBidXQgbm90IHNlcnZlci1zaWRlLFxuICAgICAgLy8gY29tcGxhaW4gcHJvcGVybHkgY2xpZW50LXNpZGUuXG4gICAgICBpZiAodGhpcy5jb25maWcuZW52ICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgY29uc3QgY2xpZW50UmVxdWlyZWRTZXJ2aWNlcyA9IGRhdGEucmVxdWlyZWRTZXJ2aWNlcyB8fMKgW107XG4gICAgICAgIGNvbnN0IG1pc3NpbmdTZXJ2aWNlcyA9IFtdO1xuXG4gICAgICAgIGNsaWVudFJlcXVpcmVkU2VydmljZXMuZm9yRWFjaCgoc2VydmljZUlkKSA9PiB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgc2VydmVyU2VydmljZXNMaXN0LmluZGV4T2Yoc2VydmljZUlkKSAhPT0gLTEgJiZcbiAgICAgICAgICAgIHNlcnZlclJlcXVpcmVkU2VydmljZXMuaW5kZXhPZihzZXJ2aWNlSWQpID09PSAtMVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgbWlzc2luZ1NlcnZpY2VzLnB1c2goc2VydmljZUlkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChtaXNzaW5nU2VydmljZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHNvY2tldHMuc2VuZChjbGllbnQsICdjbGllbnQ6ZXJyb3InLCB7XG4gICAgICAgICAgICB0eXBlOiAnc2VydmljZXMnLFxuICAgICAgICAgICAgZGF0YTogbWlzc2luZ1NlcnZpY2VzLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjbGllbnQudXJsUGFyYW1zID0gZGF0YS51cmxQYXJhbXM7XG4gICAgICAvLyBAdG9kbyAtIGhhbmRsZSByZWNvbm5lY3Rpb24gKGV4OiBgZGF0YWAgY29udGFpbnMgYW4gYHV1aWRgKVxuICAgICAgYWN0aXZpdGllcy5mb3JFYWNoKChhY3Rpdml0eSkgPT4gYWN0aXZpdHkuY29ubmVjdChjbGllbnQpKTtcbiAgICAgIHNvY2tldHMuc2VuZChjbGllbnQsICdjbGllbnQ6c3RhcnQnLCBjbGllbnQudXVpZCk7XG5cbiAgICAgIGlmIChsb2dnZXIuaW5mbylcbiAgICAgICAgbG9nZ2VyLmluZm8oeyBzb2NrZXQsIGNsaWVudFR5cGUgfSwgJ2hhbmRzaGFrZScpO1xuICAgIH0pO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgc2VydmVyO1xuIl19