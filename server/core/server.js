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
   * @param {module:soundworks/server.server~serverConfig} config -
   *  Configuration of the application.
   */
  init: function init(config) {
    this.config = config;

    _serviceManager2.default.init();
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

    this._populateDefaultConfig();

    if (this.config.logger !== undefined) _logger2.default.init(this.config.logger);

    // configure express
    var expressMiddleware = new _express2.default();
    expressMiddleware.set('port', process.env.PORT || this.config.port);
    expressMiddleware.set('view engine', 'ejs');
    // compression
    if (this.config.enableGZipCompression) expressMiddleware.use((0, _compression2.default)());
    // public folder
    expressMiddleware.use(_express2.default.static(this.config.publicDirectory));

    this._initActivities();
    this._initRouting(expressMiddleware);
    // expose router to allow adding some routes (e.g. REST API)
    this.router = expressMiddleware;

    var useHttps = this.config.useHttps || false;

    return new _promise2.default(function (resolve, reject) {
      // launch http(s) server
      if (!useHttps) {
        var httpServer = _http2.default.createServer(expressMiddleware);
        resolve(httpServer);
      } else {
        var httpsInfos = _this.config.httpsInfos;
        // use given certificate
        if (httpsInfos.key && httpsInfos.cert) {
          var key = _fs2.default.readFileSync(httpsInfos.key);
          var cert = _fs2.default.readFileSync(httpsInfos.cert);
          var httpsServer = _https2.default.createServer({ key: key, cert: cert }, expressMiddleware);
          resolve(httpsServer);
          // generate certificate on the fly (for development purposes)
        } else {
          _pem2.default.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
            var httpsServer = _https2.default.createServer({
              key: keys.serviceKey,
              cert: keys.certificate
            }, expressMiddleware);

            resolve(httpsServer);
          });
        }
      }
    }).then(function (httpServer) {
      _this._initSockets(httpServer);

      _this.httpServer = httpServer;

      _serviceManager2.default.signals.ready.addObserver(function () {
        httpServer.listen(expressMiddleware.get('port'), function () {
          var protocol = useHttps ? 'https' : 'http';
          _this._address = protocol + '://127.0.0.1:' + expressMiddleware.get('port');
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
   * Init routing for each client. The default client must be opened last.
   * @private
   */
  _initRouting: function _initRouting(expressApp) {
    for (var clientType in this._clientTypeActivitiesMap) {
      if (clientType !== this.config.defaultClient) this._openClientRoute(clientType, expressApp);
    }

    for (var _clientType in this._clientTypeActivitiesMap) {
      if (_clientType === this.config.defaultClient) this._openClientRoute(_clientType, expressApp);
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
  _openClientRoute: function _openClientRoute(clientType, expressApp) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZlci5qcyJdLCJuYW1lcyI6WyJzZXJ2ZXIiLCJjb25maWciLCJfYWRkcmVzcyIsIl9jbGllbnRUeXBlQWN0aXZpdGllc01hcCIsInJvdXRlciIsImh0dHBTZXJ2ZXIiLCJfYWN0aXZpdGllcyIsIl9yb3V0ZXMiLCJjbGllbnRUeXBlcyIsInJlcXVpcmUiLCJpZCIsIm9wdGlvbnMiLCJfY2xpZW50Q29uZmlnRGVmaW5pdGlvbiIsImNsaWVudFR5cGUiLCJzZXJ2ZXJDb25maWciLCJodHRwUmVxdWVzdCIsInNldENsaWVudENvbmZpZ0RlZmluaXRpb24iLCJmdW5jIiwiZGVmaW5lUm91dGUiLCJyb3V0ZSIsInNldEFjdGl2aXR5IiwiYWN0aXZpdHkiLCJhZGQiLCJpbml0Iiwic3RhcnQiLCJfcG9wdWxhdGVEZWZhdWx0Q29uZmlnIiwibG9nZ2VyIiwidW5kZWZpbmVkIiwiZXhwcmVzc01pZGRsZXdhcmUiLCJzZXQiLCJwcm9jZXNzIiwiZW52IiwiUE9SVCIsInBvcnQiLCJlbmFibGVHWmlwQ29tcHJlc3Npb24iLCJ1c2UiLCJzdGF0aWMiLCJwdWJsaWNEaXJlY3RvcnkiLCJfaW5pdEFjdGl2aXRpZXMiLCJfaW5pdFJvdXRpbmciLCJ1c2VIdHRwcyIsInJlc29sdmUiLCJyZWplY3QiLCJjcmVhdGVTZXJ2ZXIiLCJodHRwc0luZm9zIiwia2V5IiwiY2VydCIsInJlYWRGaWxlU3luYyIsImh0dHBzU2VydmVyIiwiY3JlYXRlQ2VydGlmaWNhdGUiLCJkYXlzIiwic2VsZlNpZ25lZCIsImVyciIsImtleXMiLCJzZXJ2aWNlS2V5IiwiY2VydGlmaWNhdGUiLCJ0aGVuIiwiX2luaXRTb2NrZXRzIiwic2lnbmFscyIsInJlYWR5IiwiYWRkT2JzZXJ2ZXIiLCJsaXN0ZW4iLCJnZXQiLCJwcm90b2NvbCIsImNvbnNvbGUiLCJsb2ciLCJ0b1VwcGVyQ2FzZSIsImNhdGNoIiwiZXJyb3IiLCJzdGFjayIsImZvckVhY2giLCJfbWFwQ2xpZW50VHlwZXNUb0FjdGl2aXR5IiwiZXhwcmVzc0FwcCIsImRlZmF1bHRDbGllbnQiLCJfb3BlbkNsaWVudFJvdXRlIiwid2Vic29ja2V0cyIsIm9uQ29ubmVjdGlvbiIsInNvY2tldCIsIl9vblNvY2tldENvbm5lY3Rpb24iLCJqb2luIiwiY3dkIiwidGVtcGxhdGVEaXJlY3RvcnkiLCJjbGllbnRUbXBsIiwiZGVmYXVsdFRtcGwiLCJzdGF0Iiwic3RhdHMiLCJ0ZW1wbGF0ZSIsImlzRmlsZSIsInRtcGxTdHJpbmciLCJlbmNvZGluZyIsInRtcGwiLCJjb21waWxlIiwicmVxIiwicmVzIiwiZGF0YSIsImFwcEluZGV4Iiwic2VuZCIsImNsaWVudCIsImFjdGl2aXRpZXMiLCJyZWNlaXZlIiwiZGlzY29ubmVjdCIsImRlc3Ryb3kiLCJpbmZvIiwic2VydmVyUmVxdWlyZWRTZXJ2aWNlcyIsImdldFJlcXVpcmVkU2VydmljZXMiLCJzZXJ2ZXJTZXJ2aWNlc0xpc3QiLCJnZXRTZXJ2aWNlTGlzdCIsImNsaWVudFJlcXVpcmVkU2VydmljZXMiLCJyZXF1aXJlZFNlcnZpY2VzIiwibWlzc2luZ1NlcnZpY2VzIiwic2VydmljZUlkIiwiaW5kZXhPZiIsInB1c2giLCJsZW5ndGgiLCJ0eXBlIiwidXJsUGFyYW1zIiwiY29ubmVjdCIsInV1aWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBd0VBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQkEsSUFBTUEsU0FBUztBQUNiOzs7Ozs7QUFNQUMsVUFBUSxFQVBLOztBQVNiOzs7O0FBSUFDLFlBQVUsRUFiRzs7QUFlYjs7OztBQUlBQyw0QkFBMEIsRUFuQmI7O0FBcUJiOzs7O0FB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QUFTQSxZQUFJRCxnQkFBZ0JJLE1BQWhCLEdBQXlCLENBQTdCLEVBQWdDO0FBQzlCLDRCQUFRakIsSUFBUixDQUFhQyxNQUFiLEVBQXFCLGNBQXJCLEVBQXFDO0FBQ25DaUIsa0JBQU0sVUFENkI7QUFFbkNwQixrQkFBTWU7QUFGNkIsV0FBckM7QUFJQTtBQUNEO0FBQ0Y7O0FBRURaLGFBQU9rQixTQUFQLEdBQW1CckIsS0FBS3FCLFNBQXhCO0FBQ0E7QUFDQWpCLGlCQUFXNUIsT0FBWCxDQUFtQixVQUFDakQsUUFBRDtBQUFBLGVBQWNBLFNBQVMrRixPQUFULENBQWlCbkIsTUFBakIsQ0FBZDtBQUFBLE9BQW5CO0FBQ0Esd0JBQVFELElBQVIsQ0FBYUMsTUFBYixFQUFxQixjQUFyQixFQUFxQ0EsT0FBT29CLElBQTVDOztBQUVBLFVBQUksaUJBQU9mLElBQVgsRUFDRSxpQkFBT0EsSUFBUCxDQUFZLEVBQUV6QixjQUFGLEVBQVVoRSxzQkFBVixFQUFaLEVBQW9DLFdBQXBDO0FBQ0gsS0FoQ0Q7QUFpQ0Q7QUE3V1ksQ0FBZjs7a0JBZ1hlYixNIiwiZmlsZSI6InNlcnZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDbGllbnQgZnJvbSAnLi9DbGllbnQnO1xuaW1wb3J0IGNvbXByZXNzaW9uIGZyb20gJ2NvbXByZXNzaW9uJztcbmltcG9ydCBlanMgZnJvbSAnZWpzJztcbmltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBodHRwIGZyb20gJ2h0dHAnO1xuaW1wb3J0IGh0dHBzIGZyb20gJ2h0dHBzJztcbmltcG9ydCBsb2dnZXIgZnJvbSAnLi4vdXRpbHMvbG9nZ2VyJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHBlbSBmcm9tICdwZW0nO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4vc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IHNvY2tldHMgZnJvbSAnLi9zb2NrZXRzJztcblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuc2VydmVyfnNlcnZlckNvbmZpZ1xuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5zZXJ2ZXJcbiAqXG4gKiBAcHJvcGVydHkge1N0cmluZ30gYXBwTmFtZSAtIE5hbWUgb2YgdGhlIGFwcGxpY2F0aW9uLCB1c2VkIGluIHRoZSBgLmVqc2BcbiAqICB0ZW1wbGF0ZSBhbmQgYnkgZGVmYXVsdCBpbiB0aGUgYHBsYXRmb3JtYCBzZXJ2aWNlIHRvIHBvcHVsYXRlIGl0cyB2aWV3LlxuICogQHByb3BlcnR5IHtTdHJpbmd9IGVudiAtIE5hbWUgb2YgdGhlIGVudmlyb25uZW1lbnQgKCdwcm9kdWN0aW9uJyBlbmFibGVcbiAqICBjYWNoZSBpbiBleHByZXNzIGFwcGxpY2F0aW9uKS5cbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSB2ZXJzaW9uIC0gVmVyc2lvbiBvZiBhcHBsaWNhdGlvbiwgY2FuIGJlIHVzZWQgdG8gZm9yY2VcbiAqICByZWxvYWQgY3NzIGFuZCBqcyBmaWxlcyBmcm9tIHNlcnZlciAoY2YuIGBodG1sL2RlZmF1bHQuZWpzYClcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBkZWZhdWx0Q2xpZW50IC0gTmFtZSBvZiB0aGUgZGVmYXVsdCBjbGllbnQgdHlwZSxcbiAqICBpLmUuIHRoZSBjbGllbnQgdGhhdCBjYW4gYWNjZXNzIHRoZSBhcHBsaWNhdGlvbiBhdCBpdHMgcm9vdCBVUkxcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBhc3NldHNEb21haW4gLSBEZWZpbmUgZnJvbSB3aGVyZSB0aGUgYXNzZXRzIChzdGF0aWMgZmlsZXMpXG4gKiAgc2hvdWxkIGJlIGxvYWRlZCwgdGhpcyB2YWx1ZSBjYW4gcmVmZXIgdG8gYSBzZXBhcmF0ZSBzZXJ2ZXIgZm9yIHNjYWxhYmlsaXR5LlxuICogIFRoZSB2YWx1ZSBzaG91bGQgYmUgdXNlZCBjbGllbnQtc2lkZSB0byBjb25maWd1cmUgdGhlIGBhdWRpby1idWZmZXItbWFuYWdlcmBcbiAqICBzZXJ2aWNlLlxuICogQHByb3BlcnR5IHtOdW1iZXJ9IHBvcnQgLSBQb3J0IHVzZWQgdG8gb3BlbiB0aGUgaHR0cCBzZXJ2ZXIsIGluIHByb2R1Y3Rpb25cbiAqICB0aGlzIHZhbHVlIGlzIHR5cGljYWxseSA4MFxuICpcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBzZXR1cCAtIERlc2NyaWJlIHRoZSBsb2NhdGlvbiB3aGVyZSB0aGUgZXhwZXJpZW5jZSB0YWtlc1xuICogIHBsYWNlcywgdGhlc2VzIHZhbHVlcyBhcmUgdXNlZCBieSB0aGUgYHBsYWNlcmAsIGBjaGVja2luYCBhbmQgYGxvY2F0b3JgXG4gKiAgc2VydmljZXMuIElmIG9uZSBvZiB0aGVzZSBzZXJ2aWNlIGlzIHJlcXVpcmVkLCB0aGlzIGVudHJ5IG1hbmRhdG9yeS5cbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBzZXR1cC5hcmVhIC0gRGVzY3JpcHRpb24gb2YgdGhlIGFyZWEuXG4gKiBAcHJvcGVydHkge051bWJlcn0gc2V0dXAuYXJlYS53aWR0aCAtIFdpZHRoIG9mIHRoZSBhcmVhLlxuICogQHByb3BlcnR5IHtOdW1iZXJ9IHNldHVwLmFyZWEuaGVpZ2h0IC0gSGVpZ2h0IG9mIHRoZSBhcmVhLlxuICogQHByb3BlcnR5IHtTdHJpbmd9IHNldHVwLmFyZWEuYmFja2dyb3VuZCAtIFBhdGggdG8gYW4gaW1hZ2UgdG8gYmUgdXNlZCBpblxuICogIHRoZSBhcmVhIHJlcHJlc2VudGF0aW9uLlxuICogQHByb3BlcnR5IHtBcnJheX0gc2V0dXAubGFiZWxzIC0gT3B0aW9ubmFsIGxpc3Qgb2YgcHJlZGVmaW5lZCBsYWJlbHMuXG4gKiBAcHJvcGVydHkge0FycmF5fSBzZXR1cC5jb29yZGluYXRlcyAtIE9wdGlvbm5hbCBsaXN0IG9mIHByZWRlZmluZWQgY29vcmRpbmF0ZXMuXG4gKiBAcHJvcGVydHkge0FycmF5fSBzZXR1cC5tYXhDbGllbnRzUGVyUG9zaXRpb24gLSBNYXhpbXVtIG51bWJlciBvZiBjbGllbnRzXG4gKiAgYWxsb3dlZCBpbiBhIHBvc2l0aW9uLlxuICogQHByb3BlcnR5IHtOdW1iZXJ9IHNldHVwLmNhcGFjaXR5IC0gTWF4aW11bSBudW1iZXIgb2YgcG9zaXRpb25zIChtYXkgbGltaXRcbiAqIG9yIGJlIGxpbWl0ZWQgYnkgdGhlIG51bWJlciBvZiBsYWJlbHMgYW5kL29yIGNvb3JkaW5hdGVzKS5cbiAqXG4gKiBAcHJvcGVydHkge09iamVjdH0gd2Vic29ja2V0cyAtIFdlYnNvY2tldHMgY29uZmlndXJhdGlvbiAoc29ja2V0LmlvKVxuICogQHByb3BlcnR5IHtTdHJpbmd9IHdlYnNvY2tldHMudXJsIC0gT3B0aW9ubmFsIHVybCB3aGVyZSB0aGUgc29ja2V0IHNob3VsZFxuICogIGNvbm5lY3QuXG4gKiBAcHJvcGVydHkge0FycmF5fSB3ZWJzb2NrZXRzLnRyYW5zcG9ydHMgLSBMaXN0IG9mIHRoZSB0cmFuc3BvcnQgbWVjYW5pbXMgdGhhdFxuICogIHNob3VsZCBiZSB1c2VkIHRvIG9wZW4gb3IgZW11bGF0ZSB0aGUgc29ja2V0LlxuICpcbiAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gdXNlSHR0cHMgLSAgRGVmaW5lIGlmIHRoZSBIVFRQIHNlcnZlciBzaG91bGQgYmUgbGF1bmNoZWRcbiAqICB1c2luZyBzZWN1cmUgY29ubmVjdGlvbnMuIEZvciBkZXZlbG9wbWVudCBwdXJwb3NlcyB3aGVuIHNldCB0byBgdHJ1ZWAgYW5kIG5vXG4gKiAgY2VydGlmaWNhdGVzIGFyZSBnaXZlbiAoY2YuIGBodHRwc0luZm9zYCksIGEgc2VsZi1zaWduZWQgY2VydGlmaWNhdGUgaXNcbiAqICBjcmVhdGVkLlxuICogQHByb3BlcnR5IHtPYmplY3R9IGh0dHBzSW5mb3MgLSBQYXRocyB0byB0aGUga2V5IGFuZCBjZXJ0aWZpY2F0ZSB0byBiZSB1c2VkXG4gKiAgaW4gb3JkZXIgdG8gbGF1bmNoIHRoZSBodHRwcyBzZXJ2ZXIuIEJvdGggZW50cmllcyBhcmUgcmVxdWlyZWQgb3RoZXJ3aXNlIGFcbiAqICBzZWxmLXNpZ25lZCBjZXJ0aWZpY2F0ZSBpcyBnZW5lcmF0ZWQuXG4gKiBAcHJvcGVydHkge1N0cmluZ30gaHR0cHNJbmZvcy5jZXJ0IC0gUGF0aCB0byB0aGUgY2VydGlmaWNhdGUuXG4gKiBAcHJvcGVydHkge1N0cmluZ30gaHR0cHNJbmZvcy5rZXkgLSBQYXRoIHRvIHRoZSBrZXkuXG4gKlxuICogQHByb3BlcnR5IHtTdHJpbmd9IHBhc3N3b3JkIC0gUGFzc3dvcmQgdG8gYmUgdXNlZCBieSB0aGUgYGF1dGhgIHNlcnZpY2UuXG4gKlxuICogQHByb3BlcnR5IHtPYmplY3R9IG9zYyAtIENvbmZpZ3VyYXRpb24gb2YgdGhlIGBvc2NgIHNlcnZpY2UuXG4gKiBAcHJvcGVydHkge1N0cmluZ30gb3NjLnJlY2VpdmVBZGRyZXNzIC0gSVAgb2YgdGhlIGN1cnJlbnRseSBydW5uaW5nIHNlcnZlci5cbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBvc2MucmVjZWl2ZVBvcnQgLSBQb3J0IGxpc3RlbmluZyBmb3IgaW5jb21taW5nIG1lc3NhZ2VzLlxuICogQHByb3BlcnR5IHtTdHJpbmd9IG9zYy5zZW5kQWRkcmVzcyAtIElQIG9mIHRoZSByZW1vdGUgYXBwbGljYXRpb24uXG4gKiBAcHJvcGVydHkge051bWJlcn0gb3NjLnNlbmRQb3J0IC0gUG9ydCB3aGVyZSB0aGUgcmVtb3RlIGFwcGxpY2F0aW9uIGlzXG4gKiAgbGlzdGVuaW5nIGZvciBtZXNzYWdlc1xuICpcbiAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gZW5hYmxlR1ppcENvbXByZXNzaW9uIC0gRGVmaW5lIGlmIHRoZSBzZXJ2ZXIgc2hvdWxkIHVzZVxuICogIGd6aXAgY29tcHJlc3Npb24gZm9yIHN0YXRpYyBmaWxlcy5cbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBwdWJsaWNEaXJlY3RvcnkgLSBMb2NhdGlvbiBvZiB0aGUgcHVibGljIGRpcmVjdG9yeVxuICogIChhY2Nlc3NpYmxlIHRocm91Z2ggaHR0cChzKSByZXF1ZXN0cykuXG4gKiBAcHJvcGVydHkge1N0cmluZ30gdGVtcGxhdGVEaXJlY3RvcnkgLSBEaXJlY3Rvcnkgd2hlcmUgdGhlIHNlcnZlciB0ZW1wbGF0aW5nXG4gKiAgc3lzdGVtIGxvb2tzIGZvciB0aGUgYGVqc2AgdGVtcGxhdGVzLlxuICogQHByb3BlcnR5IHtPYmplY3R9IGxvZ2dlciAtIENvbmZpZ3VyYXRpb24gb2YgdGhlIGxvZ2dlciBzZXJ2aWNlLCBjZi4gQnVueWFuXG4gKiAgZG9jdW1lbnRhdGlvbi5cbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBlcnJvclJlcG9ydGVyRGlyZWN0b3J5IC0gRGlyZWN0b3J5IHdoZXJlIGVycm9yIHJlcG9ydGVkXG4gKiAgZnJvbSB0aGUgY2xpZW50cyBhcmUgd3JpdHRlbi5cbiAqL1xuXG5cbi8qKlxuICogU2VydmVyIHNpZGUgZW50cnkgcG9pbnQgZm9yIGEgYHNvdW5kd29ya3NgIGFwcGxpY2F0aW9uLlxuICpcbiAqIFRoaXMgb2JqZWN0IGhvc3RzIGNvbmZpZ3VyYXRpb24gaW5mb3JtYXRpb25zLCBhcyB3ZWxsIGFzIG1ldGhvZHMgdG9cbiAqIGluaXRpYWxpemUgYW5kIHN0YXJ0IHRoZSBhcHBsaWNhdGlvbi4gSXQgaXMgYWxzbyByZXNwb25zaWJsZSBmb3IgY3JlYXRpbmdcbiAqIHRoZSBzdGF0aWMgZmlsZSAoaHR0cCkgc2VydmVyIGFzIHdlbGwgYXMgdGhlIHNvY2tldCBzZXJ2ZXIuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlclxuICogQG5hbWVzcGFjZVxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBzb3VuZHdvcmtzIGZyb20gJ3NvdW5kd29ya3Mvc2VydmVyJztcbiAqIGltcG9ydCBNeUV4cGVyaWVuY2UgZnJvbSAnLi9NeUV4cGVyaWVuY2UnO1xuICpcbiAqIHNvdW5kd29ya3Muc2VydmVyLmluaXQoY29uZmlnKTtcbiAqIGNvbnN0IG15RXhwZXJpZW5jZSA9IG5ldyBNeUV4cGVyaWVuY2UoKTtcbiAqIHNvdW5kd29ya3Muc2VydmVyLnN0YXJ0KCk7XG4gKi9cbmNvbnN0IHNlcnZlciA9IHtcbiAgLyoqXG4gICAqIENvbmZpZ3VyYXRpb24gaW5mb3JtYXRpb25zLCBhbGwgY29uZmlnIG9iamVjdHMgcGFzc2VkIHRvIHRoZVxuICAgKiBbYHNlcnZlci5pbml0YF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLnNlcnZlci5pbml0fSBhcmUgbWVyZ2VkXG4gICAqIGludG8gdGhpcyBvYmplY3QuXG4gICAqIEB0eXBlIHttb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuc2VydmVyfnNlcnZlckNvbmZpZ31cbiAgICovXG4gIGNvbmZpZzoge30sXG5cbiAgLyoqXG4gICAqIFRoZSB1cmwgb2YgdGhlIG5vZGUgc2VydmVyIG9uIHRoZSBjdXJyZW50IG1hY2hpbmUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfYWRkcmVzczogJycsXG5cbiAgLyoqXG4gICAqIE1hcHBpbmcgYmV0d2VlbiBhIGBjbGllbnRUeXBlYCBhbmQgaXRzIHJlbGF0ZWQgYWN0aXZpdGllcy5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9jbGllbnRUeXBlQWN0aXZpdGllc01hcDoge30sXG5cbiAgLyoqXG4gICAqIGV4cHJlc3MgaW5zdGFuY2UsIGNhbiBhbGxvdyB0byBleHBvc2UgYWRkaXRpb25uYWwgcm91dGVzIChlLmcuIFJFU1QgQVBJKS5cbiAgICogQHVuc3RhYmxlXG4gICAqL1xuICByb3V0ZXI6IG51bGwsXG5cbiAgLyoqXG4gICAqIEhUVFAoUykgc2VydmVyIGluc3RhbmNlLlxuICAgKiBAdW5zdGFibGVcbiAgICovXG4gIGh0dHBTZXJ2ZXI6IG51bGwsXG5cbiAgLyoqXG4gICAqIFJlcXVpcmVkIGFjdGl2aXRpZXMgdGhhdCBtdXN0IGJlIHN0YXJ0ZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfYWN0aXZpdGllczogbmV3IFNldCgpLFxuXG4gIC8qKlxuICAgKiBPcHRpb25uYWwgcm91dGluZyBkZWZpbmVkIGZvciBlYWNoIGNsaWVudC5cbiAgICogQHByaXZhdGVcbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG4gIF9yb3V0ZXM6IHt9LFxuXG4gIGdldCBjbGllbnRUeXBlcygpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5fY2xpZW50VHlwZUFjdGl2aXRpZXNNYXApO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYSBzZXJ2aWNlIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gSWRlbnRpZmllciBvZiB0aGUgc2VydmljZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPcHRpb25zIHRvIGNvbmZpZ3VyZSB0aGUgc2VydmljZS5cbiAgICovXG4gIHJlcXVpcmUoaWQsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gc2VydmljZU1hbmFnZXIucmVxdWlyZShpZCwgb3B0aW9ucyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIERlZmF1bHQgZm9yIHRoZSBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuc2VydmVyfmNsaWVudENvbmZpZ0RlZmluaXRpb25cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9jbGllbnRDb25maWdEZWZpbml0aW9uOiAoY2xpZW50VHlwZSwgc2VydmVyQ29uZmlnLCBodHRwUmVxdWVzdCkgPT4ge1xuICAgIHJldHVybiB7IGNsaWVudFR5cGUgfTtcbiAgfSxcblxuICAvKipcbiAgICogQGNhbGxiYWNrIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5zZXJ2ZXJ+Y2xpZW50Q29uZmlnRGVmaW5pdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2xpZW50VHlwZSAtIFR5cGUgb2YgdGhlIGNsaWVudC5cbiAgICogQHBhcmFtIHtPYmplY3R9IHNlcnZlckNvbmZpZyAtIENvbmZpZ3VyYXRpb24gb2YgdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtPYmplY3R9IGh0dHBSZXF1ZXN0IC0gSHR0cCByZXF1ZXN0IGZvciB0aGUgYGluZGV4Lmh0bWxgXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG4gIC8qKlxuICAgKiBTZXQgdGhlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuc2VydmVyfmNsaWVudENvbmZpZ0RlZmluaXRpb259IHdpdGhcbiAgICogYSB1c2VyIGRlZmluZWQgZnVuY3Rpb24uXG4gICAqIEBwYXJhbSB7bW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLnNlcnZlcn5jbGllbnRDb25maWdEZWZpbml0aW9ufSBmdW5jIC0gQVxuICAgKiAgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBkYXRhIHRoYXQgd2lsbCBiZSB1c2VkIHRvIHBvcHVsYXRlIHRoZSBgaW5kZXguaHRtbGBcbiAgICogIHRlbXBsYXRlLiBUaGUgZnVuY3Rpb24gY291bGQgKGFuZCBzaG91bGQpIGJlIHVzZWQgdG8gcGFzcyBjb25maWd1cmF0aW9uXG4gICAqICB0byB0aGUgc291bmR3b3JrcyBjbGllbnQuXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5jbGllbnR+aW5pdH1cbiAgICovXG4gIHNldENsaWVudENvbmZpZ0RlZmluaXRpb24oZnVuYykge1xuICAgIHRoaXMuX2NsaWVudENvbmZpZ0RlZmluaXRpb24gPSBmdW5jO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIHJvdXRlIGZvciBhIGdpdmVuIGBjbGllbnRUeXBlYCwgYWxsb3cgdG8gZGVmaW5lIGEgbW9yZSBjb21wbGV4XG4gICAqIHJvdXRpbmcgKGFkZGl0aW9ubmFsIHJvdXRlIHBhcmFtZXRlcnMpIGZvciBhIGdpdmVuIHR5cGUgb2YgY2xpZW50LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2xpZW50VHlwZSAtIFR5cGUgb2YgdGhlIGNsaWVudC5cbiAgICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfSByb3V0ZSAtIFRlbXBsYXRlIG9mIHRoZSByb3V0ZSB0aGF0IHNob3VsZCBiZSBhcHBlbmQuXG4gICAqICB0byB0aGUgY2xpZW50IHR5cGVcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogYGBgXG4gICAqIC8vIGFsbG93IGBjb25kdWN0b3JgIGNsaWVudHMgdG8gY29ubmVjdCB0byBgaHR0cDovL3NpdGUuY29tL2NvbmR1Y3Rvci8xYFxuICAgKiBzZXJ2ZXIucmVnaXN0ZXJSb3V0ZSgnY29uZHVjdG9yJywgJy86cGFyYW0nKVxuICAgKiBgYGBcbiAgICovXG4gIGRlZmluZVJvdXRlKGNsaWVudFR5cGUsIHJvdXRlKSB7XG4gICAgdGhpcy5fcm91dGVzW2NsaWVudFR5cGVdID0gcm91dGU7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uIHVzZWQgYnkgYWN0aXZpdGllcyB0byByZWdpc3RlciB0aGVtc2VsdmVzIGFzIGFjdGl2ZSBhY3Rpdml0aWVzXG4gICAqIEBwYXJhbSB7QWN0aXZpdHl9IGFjdGl2aXR5IC0gQWN0aXZpdHkgdG8gYmUgcmVnaXN0ZXJlZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNldEFjdGl2aXR5KGFjdGl2aXR5KSB7XG4gICAgdGhpcy5fYWN0aXZpdGllcy5hZGQoYWN0aXZpdHkpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBzZXJ2ZXIgd2l0aCB0aGUgZ2l2ZW4gY29uZmlndXJhdGlvbi5cbiAgICogQHBhcmFtIHttb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuc2VydmVyfnNlcnZlckNvbmZpZ30gY29uZmlnIC1cbiAgICogIENvbmZpZ3VyYXRpb24gb2YgdGhlIGFwcGxpY2F0aW9uLlxuICAgKi9cbiAgaW5pdChjb25maWcpIHtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcblxuICAgIHNlcnZpY2VNYW5hZ2VyLmluaXQoKTtcbiAgfSxcblxuICAvKipcbiAgICogU3RhcnQgdGhlIGFwcGxpY2F0aW9uOlxuICAgKiAtIGxhdW5jaCB0aGUgaHR0cChzKSBzZXJ2ZXIuXG4gICAqIC0gbGF1bmNoIHRoZSBzb2NrZXQgc2VydmVyLlxuICAgKiAtIHN0YXJ0IGFsbCByZWdpc3RlcmVkIGFjdGl2aXRpZXMuXG4gICAqIC0gZGVmaW5lIHJvdXRlcyBhbmQgYWN0aXZpdGllcyBtYXBwaW5nIGZvciBhbGwgY2xpZW50IHR5cGVzLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5fcG9wdWxhdGVEZWZhdWx0Q29uZmlnKCk7XG5cbiAgICBpZiAodGhpcy5jb25maWcubG9nZ2VyICE9PSB1bmRlZmluZWQpXG4gICAgICBsb2dnZXIuaW5pdCh0aGlzLmNvbmZpZy5sb2dnZXIpO1xuXG4gICAgLy8gY29uZmlndXJlIGV4cHJlc3NcbiAgICBjb25zdCBleHByZXNzTWlkZGxld2FyZSA9IG5ldyBleHByZXNzKCk7XG4gICAgZXhwcmVzc01pZGRsZXdhcmUuc2V0KCdwb3J0JywgcHJvY2Vzcy5lbnYuUE9SVCB8fCB0aGlzLmNvbmZpZy5wb3J0KTtcbiAgICBleHByZXNzTWlkZGxld2FyZS5zZXQoJ3ZpZXcgZW5naW5lJywgJ2VqcycpO1xuICAgIC8vIGNvbXByZXNzaW9uXG4gICAgaWYgKHRoaXMuY29uZmlnLmVuYWJsZUdaaXBDb21wcmVzc2lvbilcbiAgICAgIGV4cHJlc3NNaWRkbGV3YXJlLnVzZShjb21wcmVzc2lvbigpKTtcbiAgICAvLyBwdWJsaWMgZm9sZGVyXG4gICAgZXhwcmVzc01pZGRsZXdhcmUudXNlKGV4cHJlc3Muc3RhdGljKHRoaXMuY29uZmlnLnB1YmxpY0RpcmVjdG9yeSkpO1xuXG4gICAgdGhpcy5faW5pdEFjdGl2aXRpZXMoKTtcbiAgICB0aGlzLl9pbml0Um91dGluZyhleHByZXNzTWlkZGxld2FyZSk7XG4gICAgLy8gZXhwb3NlIHJvdXRlciB0byBhbGxvdyBhZGRpbmcgc29tZSByb3V0ZXMgKGUuZy4gUkVTVCBBUEkpXG4gICAgdGhpcy5yb3V0ZXIgPSBleHByZXNzTWlkZGxld2FyZTtcblxuICAgIGNvbnN0IHVzZUh0dHBzID0gdGhpcy5jb25maWcudXNlSHR0cHMgfHzCoGZhbHNlO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIC8vIGxhdW5jaCBodHRwKHMpIHNlcnZlclxuICAgICAgaWYgKCF1c2VIdHRwcykge1xuICAgICAgICBjb25zdCBodHRwU2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoZXhwcmVzc01pZGRsZXdhcmUpO1xuICAgICAgICByZXNvbHZlKGh0dHBTZXJ2ZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgaHR0cHNJbmZvcyA9IHRoaXMuY29uZmlnLmh0dHBzSW5mb3M7XG4gICAgICAgIC8vIHVzZSBnaXZlbiBjZXJ0aWZpY2F0ZVxuICAgICAgICBpZiAoaHR0cHNJbmZvcy5rZXkgJiYgaHR0cHNJbmZvcy5jZXJ0KSB7XG4gICAgICAgICAgY29uc3Qga2V5ID0gZnMucmVhZEZpbGVTeW5jKGh0dHBzSW5mb3Mua2V5KTtcbiAgICAgICAgICBjb25zdCBjZXJ0ID0gZnMucmVhZEZpbGVTeW5jKGh0dHBzSW5mb3MuY2VydCk7XG4gICAgICAgICAgY29uc3QgaHR0cHNTZXJ2ZXIgPSBodHRwcy5jcmVhdGVTZXJ2ZXIoeyBrZXksIGNlcnQgfSwgZXhwcmVzc01pZGRsZXdhcmUpO1xuICAgICAgICAgIHJlc29sdmUoaHR0cHNTZXJ2ZXIpO1xuICAgICAgICAvLyBnZW5lcmF0ZSBjZXJ0aWZpY2F0ZSBvbiB0aGUgZmx5IChmb3IgZGV2ZWxvcG1lbnQgcHVycG9zZXMpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGVtLmNyZWF0ZUNlcnRpZmljYXRlKHsgZGF5czogMSwgc2VsZlNpZ25lZDogdHJ1ZSB9LCAoZXJyLCBrZXlzKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBodHRwc1NlcnZlciA9IGh0dHBzLmNyZWF0ZVNlcnZlcih7XG4gICAgICAgICAgICAgIGtleToga2V5cy5zZXJ2aWNlS2V5LFxuICAgICAgICAgICAgICBjZXJ0OiBrZXlzLmNlcnRpZmljYXRlLFxuICAgICAgICAgICAgfSwgZXhwcmVzc01pZGRsZXdhcmUpO1xuXG4gICAgICAgICAgICByZXNvbHZlKGh0dHBzU2VydmVyKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pLnRoZW4oKGh0dHBTZXJ2ZXIpID0+IHtcbiAgICAgIHRoaXMuX2luaXRTb2NrZXRzKGh0dHBTZXJ2ZXIpO1xuXG4gICAgICB0aGlzLmh0dHBTZXJ2ZXIgPSBodHRwU2VydmVyXG5cbiAgICAgIHNlcnZpY2VNYW5hZ2VyLnNpZ25hbHMucmVhZHkuYWRkT2JzZXJ2ZXIoKCkgPT4ge1xuICAgICAgICBodHRwU2VydmVyLmxpc3RlbihleHByZXNzTWlkZGxld2FyZS5nZXQoJ3BvcnQnKSwgKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHByb3RvY29sID0gdXNlSHR0cHMgPyAnaHR0cHMnIDogJ2h0dHAnO1xuICAgICAgICAgIHRoaXMuX2FkZHJlc3MgPSBgJHtwcm90b2NvbH06Ly8xMjcuMC4wLjE6JHtleHByZXNzTWlkZGxld2FyZS5nZXQoJ3BvcnQnKX1gO1xuICAgICAgICAgIGNvbnNvbGUubG9nKGBbJHtwcm90b2NvbC50b1VwcGVyQ2FzZSgpfSBTRVJWRVJdIFNlcnZlciBsaXN0ZW5pbmcgb25gLCB0aGlzLl9hZGRyZXNzKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgc2VydmljZU1hbmFnZXIuc3RhcnQoKTtcbiAgICB9KS5jYXRjaCgoZXJyKSA9PiBjb25zb2xlLmVycm9yKGVyci5zdGFjaykpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBNYXAgYWN0aXZpdGllcyB0byB0aGVpciByZXNwZWN0aXZlIGNsaWVudCB0eXBlKHMpIGFuZCBzdGFydCB0aGVtIGFsbC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9pbml0QWN0aXZpdGllcygpIHtcbiAgICB0aGlzLl9hY3Rpdml0aWVzLmZvckVhY2goKGFjdGl2aXR5KSA9PiB7XG4gICAgICB0aGlzLl9tYXBDbGllbnRUeXBlc1RvQWN0aXZpdHkoYWN0aXZpdHkuY2xpZW50VHlwZXMsIGFjdGl2aXR5KTtcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogSW5pdCByb3V0aW5nIGZvciBlYWNoIGNsaWVudC4gVGhlIGRlZmF1bHQgY2xpZW50IG11c3QgYmUgb3BlbmVkIGxhc3QuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaW5pdFJvdXRpbmcoZXhwcmVzc0FwcCkge1xuICAgIGZvciAobGV0IGNsaWVudFR5cGUgaW4gdGhpcy5fY2xpZW50VHlwZUFjdGl2aXRpZXNNYXApIHtcbiAgICAgIGlmIChjbGllbnRUeXBlICE9PSB0aGlzLmNvbmZpZy5kZWZhdWx0Q2xpZW50KVxuICAgICAgICB0aGlzLl9vcGVuQ2xpZW50Um91dGUoY2xpZW50VHlwZSwgZXhwcmVzc0FwcCk7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgY2xpZW50VHlwZSBpbiB0aGlzLl9jbGllbnRUeXBlQWN0aXZpdGllc01hcCkge1xuICAgICAgaWYgKGNsaWVudFR5cGUgPT09IHRoaXMuY29uZmlnLmRlZmF1bHRDbGllbnQpXG4gICAgICAgIHRoaXMuX29wZW5DbGllbnRSb3V0ZShjbGllbnRUeXBlLCBleHByZXNzQXBwKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEluaXQgd2Vic29ja2V0IHNlcnZlci5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9pbml0U29ja2V0cyhodHRwU2VydmVyKSB7XG4gICAgc29ja2V0cy5pbml0KGh0dHBTZXJ2ZXIsIHRoaXMuY29uZmlnLndlYnNvY2tldHMpO1xuICAgIC8vIHNvY2tldCBjb25ubmVjdGlvblxuICAgIHNvY2tldHMub25Db25uZWN0aW9uKHRoaXMuY2xpZW50VHlwZXMsIChjbGllbnRUeXBlLCBzb2NrZXQpID0+IHtcbiAgICAgIHRoaXMuX29uU29ja2V0Q29ubmVjdGlvbihjbGllbnRUeXBlLCBzb2NrZXQpO1xuICAgIH0pO1xuICB9LFxuXG4gICAvKipcbiAgICogUG9wdWxhdGUgbWFuZGF0b3J5IGNvbmZpZ3VyYXRpb24gb3B0aW9uc1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3BvcHVsYXRlRGVmYXVsdENvbmZpZygpIHtcbiAgICBpZiAodGhpcy5jb25maWcucG9ydCA9PT0gdW5kZWZpbmVkKVxuICAgICAgwqB0aGlzLmNvbmZpZy5wb3J0ID0gODAwMDtcblxuICAgIGlmICh0aGlzLmNvbmZpZy5lbmFibGVHWmlwQ29tcHJlc3Npb24gPT09IHVuZGVmaW5lZClcbiAgICAgIHRoaXMuY29uZmlnLmVuYWJsZUdaaXBDb21wcmVzc2lvbiA9IHRydWU7XG5cbiAgICBpZiAodGhpcy5jb25maWcucHVibGljRGlyZWN0b3J5ID09PSB1bmRlZmluZWQpXG4gICAgICB0aGlzLmNvbmZpZy5wdWJsaWNEaXJlY3RvcnkgPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3B1YmxpYycpO1xuXG4gICAgaWYgKHRoaXMuY29uZmlnLnRlbXBsYXRlRGlyZWN0b3J5ID09PSB1bmRlZmluZWQpXG4gICAgICB0aGlzLmNvbmZpZy50ZW1wbGF0ZURpcmVjdG9yeSA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnaHRtbCcpO1xuXG4gICAgaWYgKHRoaXMuY29uZmlnLmRlZmF1bHRDbGllbnQgPT09IHVuZGVmaW5lZClcbiAgICAgIHRoaXMuY29uZmlnLmRlZmF1bHRDbGllbnQgPSAncGxheWVyJztcblxuICAgIGlmICh0aGlzLmNvbmZpZy53ZWJzb2NrZXRzID09PSB1bmRlZmluZWQpXG4gICAgICB0aGlzLmNvbmZpZy53ZWJzb2NrZXRzID0ge307XG4gIH0sXG5cbiAgLyoqXG4gICAqIE1hcCBjbGllbnQgdHlwZXMgd2l0aCBhbiBhY3Rpdml0eS5cbiAgICogQHBhcmFtIHtBcnJheTxTdHJpbmc+fSBjbGllbnRUeXBlcyAtIExpc3Qgb2YgY2xpZW50IHR5cGUuXG4gICAqIEBwYXJhbSB7QWN0aXZpdHl9IGFjdGl2aXR5IC0gQWN0aXZpdHkgY29uY2VybmVkIHdpdGggdGhlIGdpdmVuIGBjbGllbnRUeXBlc2AuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfbWFwQ2xpZW50VHlwZXNUb0FjdGl2aXR5KGNsaWVudFR5cGVzLCBhY3Rpdml0eSkge1xuICAgIGNsaWVudFR5cGVzLmZvckVhY2goKGNsaWVudFR5cGUpID0+IHtcbiAgICAgIGlmICghdGhpcy5fY2xpZW50VHlwZUFjdGl2aXRpZXNNYXBbY2xpZW50VHlwZV0pXG4gICAgICAgIHRoaXMuX2NsaWVudFR5cGVBY3Rpdml0aWVzTWFwW2NsaWVudFR5cGVdID0gbmV3IFNldCgpO1xuXG4gICAgICB0aGlzLl9jbGllbnRUeXBlQWN0aXZpdGllc01hcFtjbGllbnRUeXBlXS5hZGQoYWN0aXZpdHkpO1xuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBPcGVuIHRoZSByb3V0ZSBmb3IgdGhlIGdpdmVuIGNsaWVudC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9vcGVuQ2xpZW50Um91dGUoY2xpZW50VHlwZSwgZXhwcmVzc0FwcCkge1xuICAgIGxldCByb3V0ZSA9ICcnO1xuXG4gICAgaWYgKHRoaXMuX3JvdXRlc1tjbGllbnRUeXBlXSlcbiAgICAgIHJvdXRlICs9IHRoaXMuX3JvdXRlc1tjbGllbnRUeXBlXTtcblxuICAgIGlmIChjbGllbnRUeXBlICE9PSB0aGlzLmNvbmZpZy5kZWZhdWx0Q2xpZW50KVxuICAgICAgcm91dGUgPSBgLyR7Y2xpZW50VHlwZX0ke3JvdXRlfWA7XG5cbiAgICAvLyBkZWZpbmUgdGVtcGxhdGUgZmlsZW5hbWU6IGAke2NsaWVudFR5cGV9LmVqc2Agb3IgYGRlZmF1bHQuZWpzYFxuICAgIGNvbnN0IHRlbXBsYXRlRGlyZWN0b3J5ID0gdGhpcy5jb25maWcudGVtcGxhdGVEaXJlY3Rvcnk7XG4gICAgY29uc3QgY2xpZW50VG1wbCA9IHBhdGguam9pbih0ZW1wbGF0ZURpcmVjdG9yeSwgYCR7Y2xpZW50VHlwZX0uZWpzYCk7XG4gICAgY29uc3QgZGVmYXVsdFRtcGwgPSBwYXRoLmpvaW4odGVtcGxhdGVEaXJlY3RvcnksIGBkZWZhdWx0LmVqc2ApO1xuXG4gICAgZnMuc3RhdChjbGllbnRUbXBsLCAoZXJyLCBzdGF0cykgPT4ge1xuICAgICAgbGV0IHRlbXBsYXRlO1xuXG4gICAgICBpZiAoZXJyIHx8ICFzdGF0cy5pc0ZpbGUoKSlcbiAgICAgICAgdGVtcGxhdGUgPSBkZWZhdWx0VG1wbDtcbiAgICAgIGVsc2VcbiAgICAgICAgdGVtcGxhdGUgPSBjbGllbnRUbXBsO1xuXG4gICAgICBjb25zdCB0bXBsU3RyaW5nID0gZnMucmVhZEZpbGVTeW5jKHRlbXBsYXRlLCB7IGVuY29kaW5nOiAndXRmOCcgfSk7XG4gICAgICBjb25zdCB0bXBsID0gZWpzLmNvbXBpbGUodG1wbFN0cmluZyk7XG5cbiAgICAgIC8vIGh0dHAgcmVxdWVzdFxuICAgICAgZXhwcmVzc0FwcC5nZXQocm91dGUsIChyZXEsIHJlcykgPT4ge1xuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5fY2xpZW50Q29uZmlnRGVmaW5pdGlvbihjbGllbnRUeXBlLCB0aGlzLmNvbmZpZywgcmVxKTtcbiAgICAgICAgY29uc3QgYXBwSW5kZXggPSB0bXBsKHsgZGF0YSB9KTtcbiAgICAgICAgcmVzLnNlbmQoYXBwSW5kZXgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNvY2tldCBjb25uZWN0aW9uIGNhbGxiYWNrLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX29uU29ja2V0Q29ubmVjdGlvbihjbGllbnRUeXBlLCBzb2NrZXQpIHtcbiAgICBjb25zdCBjbGllbnQgPSBuZXcgQ2xpZW50KGNsaWVudFR5cGUsIHNvY2tldCk7XG4gICAgY29uc3QgYWN0aXZpdGllcyA9IHRoaXMuX2NsaWVudFR5cGVBY3Rpdml0aWVzTWFwW2NsaWVudFR5cGVdO1xuXG4gICAgLy8gZ2xvYmFsIGxpZmVjeWNsZSBvZiB0aGUgY2xpZW50XG4gICAgc29ja2V0cy5yZWNlaXZlKGNsaWVudCwgJ2Rpc2Nvbm5lY3QnLCAoKSA9PiB7XG4gICAgICBhY3Rpdml0aWVzLmZvckVhY2goKGFjdGl2aXR5KSA9PiBhY3Rpdml0eS5kaXNjb25uZWN0KGNsaWVudCkpO1xuICAgICAgY2xpZW50LmRlc3Ryb3koKTtcblxuICAgICAgaWYgKGxvZ2dlci5pbmZvKVxuICAgICAgICBsb2dnZXIuaW5mbyh7IHNvY2tldCwgY2xpZW50VHlwZSB9LCAnZGlzY29ubmVjdCcpO1xuICAgIH0pO1xuXG4gICAgLy8gY2hlY2sgY29oZXJlbmNlIGJldHdlZW4gY2xpZW50LXNpZGUgYW5kIHNlcnZlci1zaWRlIHNlcnZpY2UgcmVxdWlyZW1lbnRzXG4gICAgY29uc3Qgc2VydmVyUmVxdWlyZWRTZXJ2aWNlcyA9IHNlcnZpY2VNYW5hZ2VyLmdldFJlcXVpcmVkU2VydmljZXMoY2xpZW50VHlwZSk7XG4gICAgY29uc3Qgc2VydmVyU2VydmljZXNMaXN0ID0gc2VydmljZU1hbmFnZXIuZ2V0U2VydmljZUxpc3QoKTtcblxuICAgIHNvY2tldHMucmVjZWl2ZShjbGllbnQsICdoYW5kc2hha2UnLCAoZGF0YSkgPT4ge1xuICAgICAgLy8gaW4gZGV2ZWxvcG1lbnQsIGlmIHNlcnZpY2UgcmVxdWlyZWQgY2xpZW50LXNpZGUgYnV0IG5vdCBzZXJ2ZXItc2lkZSxcbiAgICAgIC8vIGNvbXBsYWluIHByb3Blcmx5IGNsaWVudC1zaWRlLlxuICAgICAgaWYgKHRoaXMuY29uZmlnLmVudiAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgIGNvbnN0IGNsaWVudFJlcXVpcmVkU2VydmljZXMgPSBkYXRhLnJlcXVpcmVkU2VydmljZXMgfHzCoFtdO1xuICAgICAgICBjb25zdCBtaXNzaW5nU2VydmljZXMgPSBbXTtcblxuICAgICAgICBjbGllbnRSZXF1aXJlZFNlcnZpY2VzLmZvckVhY2goKHNlcnZpY2VJZCkgPT4ge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIHNlcnZlclNlcnZpY2VzTGlzdC5pbmRleE9mKHNlcnZpY2VJZCkgIT09IC0xICYmXG4gICAgICAgICAgICBzZXJ2ZXJSZXF1aXJlZFNlcnZpY2VzLmluZGV4T2Yoc2VydmljZUlkKSA9PT0gLTFcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIG1pc3NpbmdTZXJ2aWNlcy5wdXNoKHNlcnZpY2VJZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAobWlzc2luZ1NlcnZpY2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBzb2NrZXRzLnNlbmQoY2xpZW50LCAnY2xpZW50OmVycm9yJywge1xuICAgICAgICAgICAgdHlwZTogJ3NlcnZpY2VzJyxcbiAgICAgICAgICAgIGRhdGE6IG1pc3NpbmdTZXJ2aWNlcyxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY2xpZW50LnVybFBhcmFtcyA9IGRhdGEudXJsUGFyYW1zO1xuICAgICAgLy8gQHRvZG8gLSBoYW5kbGUgcmVjb25uZWN0aW9uIChleDogYGRhdGFgIGNvbnRhaW5zIGFuIGB1dWlkYClcbiAgICAgIGFjdGl2aXRpZXMuZm9yRWFjaCgoYWN0aXZpdHkpID0+IGFjdGl2aXR5LmNvbm5lY3QoY2xpZW50KSk7XG4gICAgICBzb2NrZXRzLnNlbmQoY2xpZW50LCAnY2xpZW50OnN0YXJ0JywgY2xpZW50LnV1aWQpO1xuXG4gICAgICBpZiAobG9nZ2VyLmluZm8pXG4gICAgICAgIGxvZ2dlci5pbmZvKHsgc29ja2V0LCBjbGllbnRUeXBlIH0sICdoYW5kc2hha2UnKTtcbiAgICB9KTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHNlcnZlcjtcbiJdfQ==