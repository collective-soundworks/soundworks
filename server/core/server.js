'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _serviceManager = require('./serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _sockets = require('./sockets');

var _sockets2 = _interopRequireDefault(_sockets);

var _defaultAppConfig = require('../config/defaultAppConfig');

var _defaultAppConfig2 = _interopRequireDefault(_defaultAppConfig);

var _defaultEnvConfig = require('../config/defaultEnvConfig');

var _defaultEnvConfig2 = _interopRequireDefault(_defaultEnvConfig);

var _defaultFwConfig = require('../config/defaultFwConfig');

var _defaultFwConfig2 = _interopRequireDefault(_defaultFwConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Server side entry point for a `soundworks` application.
 *
 * This object host configuration informations, as well as methods to
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
 * soundworks.server.init({ appName: 'MyApplication' });
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
   * @type {Object}
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
   * @param {...Object} configs - configuration object to be merge with the
   *  default `soundworks` config. (_Note:_ given objects are merged at 2 levels
   *  of depth)
   *
   * @see {@link module:soundworks/server.app}
   * @see {@link module:soundworks/server.env}
   * @see {@link module:soundworks/server.fw}
   */
  init: function init() {
    var _this2 = this;

    // merge default configuration objects
    this.config = (0, _assign2.default)(this.config, _defaultAppConfig2.default, _defaultFwConfig2.default, _defaultEnvConfig2.default);
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
   * Start the application:
   * - launch the HTTP server.
   * - launch the socket server.
   * - start all registered activities.
   * - define routes and and activities mapping for all client types.
   */
  start: function start() {
    var _this3 = this;

    _logger2.default.initialize(this.config.logger);

    // configure express
    var expressApp = new _express2.default();
    expressApp.set('port', process.env.PORT || this.config.port);
    expressApp.set('view engine', 'ejs');
    expressApp.use(_express2.default.static(this.config.publicFolder));

    // launch http(s) server
    if (!this.config.useHttps) {
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

    // define `index.html` template filename:
    // `${clientType}.ejs` or `default.ejs` if file not exists
    var templateDirectory = this.config.templateDirectory;
    var clientTmpl = _path2.default.join(templateDirectory, clientType + '.ejs');
    var defaultTmpl = _path2.default.join(templateDirectory, 'default.ejs');
    // @todo - check `existsSync` deprecation
    var template = _fs2.default.existsSync(clientTmpl) ? clientTmpl : defaultTmpl;

    var tmplString = _fs2.default.readFileSync(template, { encoding: 'utf8' });
    var tmpl = _ejs2.default.compile(tmplString);

    // http request
    expressApp.get(route, function (req, res) {
      var data = _this5._clientConfigDefinition(clientType, _this5.config, req);
      var appIndex = tmpl({ data: data });
      res.send(appIndex);
    });

    // socket connnection
    this.io.of(clientType).on('connection', function (socket) {
      _this5._onSocketConnection(clientType, socket, activities);
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

      _logger2.default.info({ socket: socket, clientType: clientType }, 'disconnect');
    });

    _sockets2.default.receive(client, 'handshake', function (data) {
      client.urlParams = data.urlParams;
      // @todo - handle reconnection (ex: `data` contains an `uuid`)
      activities.forEach(function (activity) {
        return activity.connect(client);
      });
      _sockets2.default.send(client, 'client:start', client.uuid);

      _logger2.default.info({ socket: socket, clientType: clientType }, 'handshake');
    });
  }
};

// import default configuration


exports.default = server;
//# sourceMappingURL=data:application/json;base64,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aUIsTUFBakIsQ0FBZDtBQUFBLE9BQW5CO0FBQ0Esd0JBQVEsSUFBUixDQUFhLE1BQWIsRUFBcUIsY0FBckIsRUFBcUMsT0FBTyxJQUE1Qzs7QUFFQSx1QkFBTyxJQUFQLENBQVksRUFBRSxjQUFGLEVBQVUsc0JBQVYsRUFBWixFQUFvQyxXQUFwQztBQUNELEtBUEQ7QUFRRDtBQWpTWSxDQUFmOzs7OztrQkFvU2UsTSIsImZpbGUiOiJzZXJ2ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ2xpZW50IGZyb20gJy4vQ2xpZW50JztcbmltcG9ydCBlanMgZnJvbSAnZWpzJztcbmltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBodHRwIGZyb20gJ2h0dHAnO1xuaW1wb3J0IGh0dHBzIGZyb20gJ2h0dHBzJztcbmltcG9ydCBJTyBmcm9tICdzb2NrZXQuaW8nO1xuaW1wb3J0IGxvZ2dlciBmcm9tICcuLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgcGVtIGZyb20gJ3BlbSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgc29ja2V0cyBmcm9tICcuL3NvY2tldHMnO1xuXG4vLyBpbXBvcnQgZGVmYXVsdCBjb25maWd1cmF0aW9uXG5pbXBvcnQgeyBkZWZhdWx0IGFzIGRlZmF1bHRBcHBDb25maWcgfSBmcm9tICcuLi9jb25maWcvZGVmYXVsdEFwcENvbmZpZyc7XG5pbXBvcnQgeyBkZWZhdWx0IGFzIGRlZmF1bHRFbnZDb25maWcgfSBmcm9tICcuLi9jb25maWcvZGVmYXVsdEVudkNvbmZpZyc7XG5pbXBvcnQgeyBkZWZhdWx0IGFzIGRlZmF1bHRGd0NvbmZpZyB9IGZyb20gJy4uL2NvbmZpZy9kZWZhdWx0RndDb25maWcnO1xuXG5cbi8qKlxuICogU2VydmVyIHNpZGUgZW50cnkgcG9pbnQgZm9yIGEgYHNvdW5kd29ya3NgIGFwcGxpY2F0aW9uLlxuICpcbiAqIFRoaXMgb2JqZWN0IGhvc3QgY29uZmlndXJhdGlvbiBpbmZvcm1hdGlvbnMsIGFzIHdlbGwgYXMgbWV0aG9kcyB0b1xuICogaW5pdGlhbGl6ZSBhbmQgc3RhcnQgdGhlIGFwcGxpY2F0aW9uLiBJdCBpcyBhbHNvIHJlc3BvbnNpYmxlIGZvciBjcmVhdGluZ1xuICogdGhlIHN0YXRpYyBmaWxlIChodHRwKSBzZXJ2ZXIgYXMgd2VsbCBhcyB0aGUgc29ja2V0IHNlcnZlci5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyXG4gKiBAbmFtZXNwYWNlXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIHNvdW5kd29ya3MgZnJvbSAnc291bmR3b3Jrcy9zZXJ2ZXInO1xuICogaW1wb3J0IE15RXhwZXJpZW5jZSBmcm9tICcuL015RXhwZXJpZW5jZSc7XG4gKlxuICogc291bmR3b3Jrcy5zZXJ2ZXIuaW5pdCh7IGFwcE5hbWU6ICdNeUFwcGxpY2F0aW9uJyB9KTtcbiAqIGNvbnN0IG15RXhwZXJpZW5jZSA9IG5ldyBNeUV4cGVyaWVuY2UoKTtcbiAqIHNvdW5kd29ya3Muc2VydmVyLnN0YXJ0KCk7XG4gKi9cbmNvbnN0IHNlcnZlciA9IHtcbiAgLyoqXG4gICAqIFNvY2tldElPIHNlcnZlci5cbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGlvOiBudWxsLFxuXG4gIC8qKlxuICAgKiBDb25maWd1cmF0aW9uIGluZm9ybWF0aW9ucywgYWxsIGNvbmZpZyBvYmplY3RzIHBhc3NlZCB0byB0aGVcbiAgICogW2BzZXJ2ZXIuaW5pdGBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5zZXJ2ZXIuaW5pdH0gYXJlIG1lcmdlZFxuICAgKiBpbnRvIHRoaXMgb2JqZWN0LlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgY29uZmlnOiB7fSxcblxuICAvKipcbiAgICogTWFwcGluZyBiZXR3ZWVuIGEgYGNsaWVudFR5cGVgIGFuZCBpdHMgcmVsYXRlZCBhY3Rpdml0aWVzLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2NsaWVudFR5cGVBY3Rpdml0aWVzTWFwOiB7fSxcblxuICAvKipcbiAgICogUmVxdWlyZWQgYWN0aXZpdGllcyB0aGF0IG11c3QgYmUgc3RhcnRlZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9hY3Rpdml0aWVzOiBuZXcgU2V0KCksXG5cbiAgLyoqXG4gICAqIE9wdGlvbm5hbCByb3V0aW5nIGRlZmluZWQgZm9yIGVhY2ggY2xpZW50LlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgX3JvdXRlczoge30sXG5cblxuICBfY2xpZW50Q29uZmlnRGVmaW5pdGlvbjogKGNsaWVudFR5cGUsIHNlcnZlckNvbmZpZywgaHR0cFJlcXVlc3QpID0+IHtcbiAgICByZXR1cm4geyBjbGllbnRUeXBlIH07XG4gIH0sXG5cbiAgLyoqXG4gICAqIE1hcCBjbGllbnQgdHlwZXMgd2l0aCBhbiBhY3Rpdml0eS5cbiAgICogQHBhcmFtIHtBcnJheTxTdHJpbmc+fSBjbGllbnRUeXBlcyAtIExpc3Qgb2YgY2xpZW50IHR5cGUuXG4gICAqIEBwYXJhbSB7QWN0aXZpdHl9IGFjdGl2aXR5IC0gQWN0aXZpdHkgY29uY2VybmVkIHdpdGggdGhlIGdpdmVuIGBjbGllbnRUeXBlc2AuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfc2V0TWFwKGNsaWVudFR5cGVzLCBhY3Rpdml0eSkge1xuICAgIGNsaWVudFR5cGVzLmZvckVhY2goKGNsaWVudFR5cGUpID0+IHtcbiAgICAgIGlmICghdGhpcy5fY2xpZW50VHlwZUFjdGl2aXRpZXNNYXBbY2xpZW50VHlwZV0pXG4gICAgICAgIHRoaXMuX2NsaWVudFR5cGVBY3Rpdml0aWVzTWFwW2NsaWVudFR5cGVdID0gbmV3IFNldCgpO1xuXG4gICAgICB0aGlzLl9jbGllbnRUeXBlQWN0aXZpdGllc01hcFtjbGllbnRUeXBlXS5hZGQoYWN0aXZpdHkpO1xuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiB1c2VkIGJ5IGFjdGl2aXRpZXMgdG8gcmVnaXN0ZXIgdGhlbXNlbHZlcyBhcyBhY3RpdmUgYWN0aXZpdGllc1xuICAgKiBAcGFyYW0ge0FjdGl2aXR5fSBhY3Rpdml0eSAtIEFjdGl2aXR5IHRvIGJlIHJlZ2lzdGVyZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZXRBY3Rpdml0eShhY3Rpdml0eSkge1xuICAgIHRoaXMuX2FjdGl2aXRpZXMuYWRkKGFjdGl2aXR5KTtcbiAgfSxcblxuICAvKipcbiAgICogUmV0dXJuIGEgc2VydmljZSBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIElkZW50aWZpZXIgb2YgdGhlIHNlcnZpY2UuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3B0aW9ucyB0byBjb25maWd1cmUgdGhlIHNlcnZpY2UuXG4gICAqL1xuICByZXF1aXJlKGlkLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIHNlcnZpY2VNYW5hZ2VyLnJlcXVpcmUoaWQsIG51bGwsIG9wdGlvbnMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBzZXJ2ZXIgd2l0aCB0aGUgZ2l2ZW4gY29uZmlnIG9iamVjdHMuXG4gICAqIEBwYXJhbSB7Li4uT2JqZWN0fSBjb25maWdzIC0gY29uZmlndXJhdGlvbiBvYmplY3QgdG8gYmUgbWVyZ2Ugd2l0aCB0aGVcbiAgICogIGRlZmF1bHQgYHNvdW5kd29ya3NgIGNvbmZpZy4gKF9Ob3RlOl8gZ2l2ZW4gb2JqZWN0cyBhcmUgbWVyZ2VkIGF0IDIgbGV2ZWxzXG4gICAqICBvZiBkZXB0aClcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLmFwcH1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLmVudn1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLmZ3fVxuICAgKi9cbiAgaW5pdCguLi5jb25maWdzKSB7XG4gICAgLy8gbWVyZ2UgZGVmYXVsdCBjb25maWd1cmF0aW9uIG9iamVjdHNcbiAgICB0aGlzLmNvbmZpZyA9IE9iamVjdC5hc3NpZ24odGhpcy5jb25maWcsIGRlZmF1bHRBcHBDb25maWcsIGRlZmF1bHRGd0NvbmZpZywgZGVmYXVsdEVudkNvbmZpZyk7XG4gICAgLy8gbWVyZ2UgZ2l2ZW4gY29uZmlndXJhdGlvbnMgb2JqZWN0cyB3aXRoIGRlZmF1bHRzICgxIGxldmVsIGRlcHRoKVxuICAgIGNvbmZpZ3MuZm9yRWFjaCgoY29uZmlnKSA9PiB7XG4gICAgICBmb3IgKGxldCBrZXkgaW4gY29uZmlnKSB7XG4gICAgICAgIGNvbnN0IGVudHJ5ID0gY29uZmlnW2tleV07XG5cbiAgICAgICAgaWYgKHR5cGVvZiBlbnRyeSA9PT0gJ29iamVjdCcgJiYgZW50cnkgIT09IG51bGwpIHtcbiAgICAgICAgICB0aGlzLmNvbmZpZ1trZXldID0gdGhpcy5jb25maWdba2V5XSB8fMKge307XG4gICAgICAgICAgdGhpcy5jb25maWdba2V5XSA9IE9iamVjdC5hc3NpZ24odGhpcy5jb25maWdba2V5XSwgZW50cnkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuY29uZmlnW2tleV0gPSBlbnRyeTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgYXBwbGljYXRpb246XG4gICAqIC0gbGF1bmNoIHRoZSBIVFRQIHNlcnZlci5cbiAgICogLSBsYXVuY2ggdGhlIHNvY2tldCBzZXJ2ZXIuXG4gICAqIC0gc3RhcnQgYWxsIHJlZ2lzdGVyZWQgYWN0aXZpdGllcy5cbiAgICogLSBkZWZpbmUgcm91dGVzIGFuZCBhbmQgYWN0aXZpdGllcyBtYXBwaW5nIGZvciBhbGwgY2xpZW50IHR5cGVzLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgbG9nZ2VyLmluaXRpYWxpemUodGhpcy5jb25maWcubG9nZ2VyKTtcblxuICAgIC8vIGNvbmZpZ3VyZSBleHByZXNzXG4gICAgY29uc3QgZXhwcmVzc0FwcCA9IG5ldyBleHByZXNzKCk7XG4gICAgZXhwcmVzc0FwcC5zZXQoJ3BvcnQnLCBwcm9jZXNzLmVudi5QT1JUIHx8IHRoaXMuY29uZmlnLnBvcnQpO1xuICAgIGV4cHJlc3NBcHAuc2V0KCd2aWV3IGVuZ2luZScsICdlanMnKTtcbiAgICBleHByZXNzQXBwLnVzZShleHByZXNzLnN0YXRpYyh0aGlzLmNvbmZpZy5wdWJsaWNGb2xkZXIpKTtcblxuICAgIC8vIGxhdW5jaCBodHRwKHMpIHNlcnZlclxuICAgIGlmICghdGhpcy5jb25maWcudXNlSHR0cHMpIHtcbiAgICAgIHRoaXMuX3J1bkh0dHBTZXJ2ZXIoZXhwcmVzc0FwcCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGh0dHBzSW5mb3MgPSB0aGlzLmNvbmZpZy5odHRwc0luZm9zO1xuXG4gICAgICAvLyB1c2UgZ2l2ZW4gY2VydGlmaWNhdGVcbiAgICAgIGlmIChodHRwc0luZm9zLmtleSAmJiBodHRwc0luZm9zLmNlcnQpIHtcbiAgICAgICAgY29uc3Qga2V5ID0gZnMucmVhZEZpbGVTeW5jKGh0dHBzSW5mb3Mua2V5KTtcbiAgICAgICAgY29uc3QgY2VydCA9IGZzLnJlYWRGaWxlU3luYyhodHRwc0luZm9zLmNlcnQpO1xuXG4gICAgICAgIHRoaXMuX3J1bkh0dHBzU2VydmVyKGV4cHJlc3NBcHAsIGtleSwgY2VydCk7XG4gICAgICAvLyBnZW5lcmF0ZSBjZXJ0aWZpY2F0ZSBvbiB0aGUgZmx5IChmb3IgZGV2ZWxvcG1lbnQgcHVycG9zZXMpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwZW0uY3JlYXRlQ2VydGlmaWNhdGUoeyBkYXlzOiAxLCBzZWxmU2lnbmVkOiB0cnVlIH0sIChlcnIsIGtleXMpID0+IHtcbiAgICAgICAgICB0aGlzLl9ydW5IdHRwc1NlcnZlcihleHByZXNzQXBwLCBrZXlzLnNlcnZpY2VLZXksIGtleXMuY2VydGlmaWNhdGUpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgcm91dGUgZm9yIGEgZ2l2ZW4gYGNsaWVudFR5cGVgLCBhbGxvdyB0byBkZWZpbmUgYSBtb3JlIGNvbXBsZXhcbiAgICogcm91dGluZyAoYWRkaXRpb25uYWwgcm91dGUgcGFyYW1ldGVycykgZm9yIGEgZ2l2ZW4gdHlwZSBvZiBjbGllbnQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjbGllbnRUeXBlIC0gVHlwZSBvZiB0aGUgY2xpZW50LlxuICAgKiBAcGFyYW0ge1N0cmluZ3xSZWdFeHB9IHJvdXRlIC0gVGVtcGxhdGUgb2YgdGhlIHJvdXRlIHRoYXQgc2hvdWxkIGJlIGFwcGVuZC5cbiAgICogIHRvIHRoZSBjbGllbnQgdHlwZVxuICAgKiBAZXhhbXBsZVxuICAgKiBgYGBcbiAgICogLy8gYWxsb3cgYGNvbmR1Y3RvcmAgY2xpZW50cyB0byBjb25uZWN0IHRvIGBodHRwOi8vc2l0ZS5jb20vY29uZHVjdG9yLzFgXG4gICAqIHNlcnZlci5yZWdpc3RlclJvdXRlKCdjb25kdWN0b3InLCAnLzpwYXJhbScpXG4gICAqIGBgYFxuICAgKi9cbiAgZGVmaW5lUm91dGUoY2xpZW50VHlwZSwgcm91dGUpIHtcbiAgICB0aGlzLl9yb3V0ZXNbY2xpZW50VHlwZV0gPSByb3V0ZTtcbiAgfSxcblxuXG4gIHNldENsaWVudENvbmZpZ0RlZmluaXRpb24oZnVuYykge1xuICAgIHRoaXMuX2NsaWVudENvbmZpZ0RlZmluaXRpb24gPSBmdW5jO1xuICB9LFxuXG4gIC8qKlxuICAgKiBMYXVuY2ggYSBodHRwIHNlcnZlci5cbiAgICovXG4gIF9ydW5IdHRwU2VydmVyKGV4cHJlc3NBcHApIHtcbiAgICBjb25zdCBodHRwU2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoZXhwcmVzc0FwcCk7XG4gICAgdGhpcy5faW5pdFNvY2tldHMoaHR0cFNlcnZlcik7XG4gICAgdGhpcy5faW5pdEFjdGl2aXRpZXMoZXhwcmVzc0FwcCk7XG5cbiAgICBodHRwU2VydmVyLmxpc3RlbihleHByZXNzQXBwLmdldCgncG9ydCcpLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHVybCA9IGBodHRwOi8vMTI3LjAuMC4xOiR7ZXhwcmVzc0FwcC5nZXQoJ3BvcnQnKX1gO1xuICAgICAgY29uc29sZS5sb2coJ1tIVFRQIFNFUlZFUl0gU2VydmVyIGxpc3RlbmluZyBvbicsIHVybCk7XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIExhdW5jaCBhIGh0dHBzIHNlcnZlci5cbiAgICovXG4gIF9ydW5IdHRwc1NlcnZlcihleHByZXNzQXBwLCBrZXksIGNlcnQpIHtcbiAgICBjb25zdCBodHRwc1NlcnZlciA9IGh0dHBzLmNyZWF0ZVNlcnZlcih7IGtleSwgY2VydCB9LCBleHByZXNzQXBwKTtcbiAgICB0aGlzLl9pbml0U29ja2V0cyhodHRwc1NlcnZlcik7XG4gICAgdGhpcy5faW5pdEFjdGl2aXRpZXMoZXhwcmVzc0FwcCk7XG5cbiAgICBodHRwc1NlcnZlci5saXN0ZW4oZXhwcmVzc0FwcC5nZXQoJ3BvcnQnKSwgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCB1cmwgPSBgaHR0cHM6Ly8xMjcuMC4wLjE6JHtleHByZXNzQXBwLmdldCgncG9ydCcpfWA7XG4gICAgICBjb25zb2xlLmxvZygnW0hUVFBTIFNFUlZFUl0gU2VydmVyIGxpc3RlbmluZyBvbicsIHVybCk7XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEluaXQgd2Vic29ja2V0IHNlcnZlci5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9pbml0U29ja2V0cyhodHRwU2VydmVyKSB7XG4gICAgdGhpcy5pbyA9IG5ldyBJTyhodHRwU2VydmVyLCB0aGlzLmNvbmZpZy5zb2NrZXRJTyk7XG5cbiAgICBpZiAodGhpcy5jb25maWcuY29yZG92YSAmJiB0aGlzLmNvbmZpZy5jb3Jkb3ZhLnNvY2tldElPKSAvLyBJTyBhZGQgc29tZSBjb25maWd1cmF0aW9uIG9wdGlvbnMgdG8gdGhlIG9iamVjdFxuICAgICAgdGhpcy5jb25maWcuY29yZG92YS5zb2NrZXRJTyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuY29uZmlnLnNvY2tldElPLCB0aGlzLmNvbmZpZy5jb3Jkb3ZhLnNvY2tldElPKTtcblxuICAgIHNvY2tldHMuaW5pdGlhbGl6ZSh0aGlzLmlvKTtcbiAgfSxcblxuICAvKipcbiAgICogU3RhcnQgYWxsIGFjdGl2aXRpZXMgYW5kIG1hcCB0aGUgcm91dGVzIChjbGllbnRUeXBlIC8gYWN0aXZpdGllcyBtYXBwaW5nKS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9pbml0QWN0aXZpdGllcyhleHByZXNzQXBwKSB7XG4gICAgdGhpcy5fYWN0aXZpdGllcy5mb3JFYWNoKChhY3Rpdml0eSkgPT4gYWN0aXZpdHkuc3RhcnQoKSk7XG5cbiAgICB0aGlzLl9hY3Rpdml0aWVzLmZvckVhY2goKGFjdGl2aXR5KSA9PiB7XG4gICAgICB0aGlzLl9zZXRNYXAoYWN0aXZpdHkuY2xpZW50VHlwZXMsIGFjdGl2aXR5KTtcbiAgICB9KTtcblxuICAgIC8vIG1hcCBgY2xpZW50VHlwZWAgdG8gdGhlaXIgcmVzcGVjdGl2ZSBhY3Rpdml0aWVzXG4gICAgZm9yIChsZXQgY2xpZW50VHlwZSBpbiB0aGlzLl9jbGllbnRUeXBlQWN0aXZpdGllc01hcCkge1xuICAgICAgaWYgKGNsaWVudFR5cGUgIT09IHRoaXMuY29uZmlnLmRlZmF1bHRDbGllbnQpIHtcbiAgICAgICAgY29uc3QgYWN0aXZpdGllcyA9IHRoaXMuX2NsaWVudFR5cGVBY3Rpdml0aWVzTWFwW2NsaWVudFR5cGVdO1xuICAgICAgICB0aGlzLl9tYXAoY2xpZW50VHlwZSwgYWN0aXZpdGllcywgZXhwcmVzc0FwcCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gbWFrZSBzdXJlIGBkZWZhdWx0Q2xpZW50YCAoYWthIGBwbGF5ZXJgKSBpcyBtYXBwZWQgbGFzdFxuICAgIGZvciAobGV0IGNsaWVudFR5cGUgaW4gdGhpcy5fY2xpZW50VHlwZUFjdGl2aXRpZXNNYXApIHtcbiAgICAgIGlmIChjbGllbnRUeXBlID09PSB0aGlzLmNvbmZpZy5kZWZhdWx0Q2xpZW50KSB7XG4gICAgICAgIGNvbnN0IGFjdGl2aXRpZXMgPSB0aGlzLl9jbGllbnRUeXBlQWN0aXZpdGllc01hcFtjbGllbnRUeXBlXTtcbiAgICAgICAgdGhpcy5fbWFwKGNsaWVudFR5cGUsIGFjdGl2aXRpZXMsIGV4cHJlc3NBcHApO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogTWFwIGEgY2xpZW50IHR5cGUgdG8gYSByb3V0ZSwgYSBzZXQgb2YgYWN0aXZpdGllcy5cbiAgICogQWRkaXRpb25uYWxseSBsaXN0ZW4gZm9yIHRoZWlyIHNvY2tldCBjb25uZWN0aW9uLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX21hcChjbGllbnRUeXBlLCBhY3Rpdml0aWVzLCBleHByZXNzQXBwKSB7XG4gICAgbGV0IHJvdXRlID0gJyc7XG5cbiAgICBpZiAodGhpcy5fcm91dGVzW2NsaWVudFR5cGVdKVxuICAgICAgcm91dGUgKz0gdGhpcy5fcm91dGVzW2NsaWVudFR5cGVdO1xuXG4gICAgaWYgKGNsaWVudFR5cGUgIT09IHRoaXMuY29uZmlnLmRlZmF1bHRDbGllbnQpXG4gICAgICByb3V0ZSA9IGAvJHtjbGllbnRUeXBlfSR7cm91dGV9YDtcblxuICAgIC8vIGRlZmluZSBgaW5kZXguaHRtbGAgdGVtcGxhdGUgZmlsZW5hbWU6XG4gICAgLy8gYCR7Y2xpZW50VHlwZX0uZWpzYCBvciBgZGVmYXVsdC5lanNgIGlmIGZpbGUgbm90IGV4aXN0c1xuICAgIGNvbnN0IHRlbXBsYXRlRGlyZWN0b3J5ID0gdGhpcy5jb25maWcudGVtcGxhdGVEaXJlY3Rvcnk7XG4gICAgY29uc3QgY2xpZW50VG1wbCA9IHBhdGguam9pbih0ZW1wbGF0ZURpcmVjdG9yeSwgYCR7Y2xpZW50VHlwZX0uZWpzYCk7XG4gICAgY29uc3QgZGVmYXVsdFRtcGwgPSBwYXRoLmpvaW4odGVtcGxhdGVEaXJlY3RvcnksIGBkZWZhdWx0LmVqc2ApO1xuICAgIC8vIEB0b2RvIC0gY2hlY2sgYGV4aXN0c1N5bmNgIGRlcHJlY2F0aW9uXG4gICAgY29uc3QgdGVtcGxhdGUgPSBmcy5leGlzdHNTeW5jKGNsaWVudFRtcGwpID8gY2xpZW50VG1wbCA6IGRlZmF1bHRUbXBsO1xuXG4gICAgY29uc3QgdG1wbFN0cmluZyA9IGZzLnJlYWRGaWxlU3luYyh0ZW1wbGF0ZSwgeyBlbmNvZGluZzogJ3V0ZjgnIH0pO1xuICAgIGNvbnN0IHRtcGwgPSBlanMuY29tcGlsZSh0bXBsU3RyaW5nKTtcblxuICAgIC8vIGh0dHAgcmVxdWVzdFxuICAgIGV4cHJlc3NBcHAuZ2V0KHJvdXRlLCAocmVxLCByZXMpID0+IHtcbiAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLl9jbGllbnRDb25maWdEZWZpbml0aW9uKGNsaWVudFR5cGUsIHRoaXMuY29uZmlnLCByZXEpO1xuICAgICAgY29uc3QgYXBwSW5kZXggPSB0bXBsKHsgZGF0YSB9KTtcbiAgICAgIHJlcy5zZW5kKGFwcEluZGV4KTtcbiAgICB9KTtcblxuICAgIC8vIHNvY2tldCBjb25ubmVjdGlvblxuICAgIHRoaXMuaW8ub2YoY2xpZW50VHlwZSkub24oJ2Nvbm5lY3Rpb24nLCAoc29ja2V0KSA9PiB7XG4gICAgICB0aGlzLl9vblNvY2tldENvbm5lY3Rpb24oY2xpZW50VHlwZSwgc29ja2V0LCBhY3Rpdml0aWVzKTtcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogU29ja2V0IGNvbm5lY3Rpb24gY2FsbGJhY2suXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfb25Tb2NrZXRDb25uZWN0aW9uKGNsaWVudFR5cGUsIHNvY2tldCwgYWN0aXZpdGllcykge1xuICAgIGNvbnN0IGNsaWVudCA9IG5ldyBDbGllbnQoY2xpZW50VHlwZSwgc29ja2V0KTtcblxuICAgIC8vIGdsb2JhbCBsaWZlY3ljbGUgb2YgdGhlIGNsaWVudFxuICAgIHNvY2tldHMucmVjZWl2ZShjbGllbnQsICdkaXNjb25uZWN0JywgKCkgPT4ge1xuICAgICAgYWN0aXZpdGllcy5mb3JFYWNoKChhY3Rpdml0eSkgPT4gYWN0aXZpdHkuZGlzY29ubmVjdChjbGllbnQpKTtcbiAgICAgIGNsaWVudC5kZXN0cm95KCk7XG5cbiAgICAgIGxvZ2dlci5pbmZvKHsgc29ja2V0LCBjbGllbnRUeXBlIH0sICdkaXNjb25uZWN0Jyk7XG4gICAgfSk7XG5cbiAgICBzb2NrZXRzLnJlY2VpdmUoY2xpZW50LCAnaGFuZHNoYWtlJywgKGRhdGEpID0+IHtcbiAgICAgIGNsaWVudC51cmxQYXJhbXMgPSBkYXRhLnVybFBhcmFtcztcbiAgICAgIC8vIEB0b2RvIC0gaGFuZGxlIHJlY29ubmVjdGlvbiAoZXg6IGBkYXRhYCBjb250YWlucyBhbiBgdXVpZGApXG4gICAgICBhY3Rpdml0aWVzLmZvckVhY2goKGFjdGl2aXR5KSA9PiBhY3Rpdml0eS5jb25uZWN0KGNsaWVudCkpO1xuICAgICAgc29ja2V0cy5zZW5kKGNsaWVudCwgJ2NsaWVudDpzdGFydCcsIGNsaWVudC51dWlkKTtcblxuICAgICAgbG9nZ2VyLmluZm8oeyBzb2NrZXQsIGNsaWVudFR5cGUgfSwgJ2hhbmRzaGFrZScpO1xuICAgIH0pO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgc2VydmVyO1xuIl19