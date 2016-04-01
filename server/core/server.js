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
      (function () {
        var launchHttpsServer = function launchHttpsServer(key, cert) {
          httpServer = _https2.default.createServer({ key: key, cert: cert }, expressApp);
          _this3._initSockets(httpServer);
          _this3._initActivities(expressApp);

          httpServer.listen(expressApp.get('port'), function () {
            var url = 'https://127.0.0.1:' + expressApp.get('port');
            console.log('[HTTPS SERVER] Server listening on', url);
          });
        };

        var httpsInfos = _this3.config.httpsInfos;

        if (httpsInfos.key && httpsInfos.cert) {
          var key = _fs2.default.readFileSync(httpsInfos.key);
          var cert = _fs2.default.readFileSync(httpsInfos.cert);

          launchHttpsServer(key, cert);
        } else {
          // generate https certificate (for development usage)
          _pem2.default.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
            launchHttpsServer(keys.serviceKey, keys.certificate);
          });
        }
      })();
    }
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
      var activity = this._clientTypeActivitiesMap[clientType];
      this._map(clientType, activity, expressApp);
    }
  },


  /**
   * Map a client type to a route, a set of activities.
   * Additionnally listen for their socket connection.
   * @private
   */
  _map: function _map(clientType, activities, expressApp) {
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
        version: _this5.config.version,
        clientType: clientType,
        defaultType: _this5.config.defaultClient,
        assetsDomain: _this5.config.assetsDomain,
        // export html for cordova or client only usage
        includeCordovaTags: includeCordovaTags
      }));
    });

    // wait for socket connnection
    this.io.of(clientType).on('connection', this._onConnection(clientType, activities));
  },


  /**
   * Socket connection callback.
   * @private
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
        client.destroy();
        _logger2.default.info({ socket: socket, clientType: clientType }, 'disconnect');
      });

      // @todo - refactor handshake and uuid definition.
      _sockets2.default.send(client, 'client:start', client.uuid);
      _logger2.default.info({ socket: socket, clientType: clientType }, 'connection');
    };
  }
};

// import default configuration


exports.default = server;
//# sourceMappingURL=data:application/json;base64,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dkIsQ0FBMEIsWUFBMUIsRUFBd0MsS0FBSyxhQUFMLENBQW1CLFVBQW5CLEVBQStCLFVBQS9CLENBQXhDLEVBckN1QztHQXJMNUI7Ozs7Ozs7QUFpT2Isd0NBQWMsWUFBWSxZQUFZO0FBQ3BDLFdBQU8sVUFBQyxNQUFELEVBQVk7QUFDakIsVUFBTSxTQUFTLHFCQUFXLFVBQVgsRUFBdUIsTUFBdkIsQ0FBVCxDQURXO0FBRWpCLGlCQUFXLE9BQVgsQ0FBbUIsVUFBQyxRQUFEO2VBQWMsU0FBUyxPQUFULENBQWlCLE1BQWpCO09BQWQsQ0FBbkI7OztBQUZpQix1QkFLakIsQ0FBUSxPQUFSLENBQWdCLE1BQWhCLEVBQXdCLFlBQXhCLEVBQXNDLFlBQU07QUFDMUMsbUJBQVcsT0FBWCxDQUFtQixVQUFDLFFBQUQ7aUJBQWMsU0FBUyxVQUFULENBQW9CLE1BQXBCO1NBQWQsQ0FBbkIsQ0FEMEM7QUFFMUMsZUFBTyxPQUFQLEdBRjBDO0FBRzFDLHlCQUFPLElBQVAsQ0FBWSxFQUFFLGNBQUYsRUFBVSxzQkFBVixFQUFaLEVBQW9DLFlBQXBDLEVBSDBDO09BQU4sQ0FBdEM7OztBQUxpQix1QkFZakIsQ0FBUSxJQUFSLENBQWEsTUFBYixFQUFxQixjQUFyQixFQUFxQyxPQUFPLElBQVAsQ0FBckMsQ0FaaUI7QUFhakIsdUJBQU8sSUFBUCxDQUFZLEVBQUUsY0FBRixFQUFVLHNCQUFWLEVBQVosRUFBb0MsWUFBcEMsRUFiaUI7S0FBWixDQUQ2QjtHQWpPekI7Q0FBVDs7Ozs7a0JBb1BTIiwiZmlsZSI6InNlcnZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDbGllbnQgZnJvbSAnLi9DbGllbnQnO1xuaW1wb3J0IGVqcyBmcm9tICdlanMnO1xuaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IGh0dHAgZnJvbSAnaHR0cCc7XG5pbXBvcnQgaHR0cHMgZnJvbSAnaHR0cHMnO1xuaW1wb3J0IElPIGZyb20gJ3NvY2tldC5pbyc7XG5pbXBvcnQgbG9nZ2VyIGZyb20gJy4uL3V0aWxzL2xvZ2dlcic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBwZW0gZnJvbSAncGVtJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBzb2NrZXRzIGZyb20gJy4vc29ja2V0cyc7XG5cbi8vIGltcG9ydCBkZWZhdWx0IGNvbmZpZ3VyYXRpb25cbmltcG9ydCB7IGRlZmF1bHQgYXMgZGVmYXVsdEFwcENvbmZpZyB9IGZyb20gJy4uL2NvbmZpZy9kZWZhdWx0QXBwQ29uZmlnJztcbmltcG9ydCB7IGRlZmF1bHQgYXMgZGVmYXVsdEVudkNvbmZpZyB9IGZyb20gJy4uL2NvbmZpZy9kZWZhdWx0RW52Q29uZmlnJztcbmltcG9ydCB7IGRlZmF1bHQgYXMgZGVmYXVsdEZ3Q29uZmlnIH0gZnJvbSAnLi4vY29uZmlnL2RlZmF1bHRGd0NvbmZpZyc7XG5cblxuLyoqXG4gKiBTZXJ2ZXIgc2lkZSBlbnRyeSBwb2ludCBmb3IgYSBgc291bmR3b3Jrc2AgYXBwbGljYXRpb24uXG4gKlxuICogVGhpcyBvYmplY3QgaG9zdCBjb25maWd1cmF0aW9uIGluZm9ybWF0aW9ucywgYXMgd2VsbCBhcyBtZXRob2RzIHRvXG4gKiBpbml0aWFsaXplIGFuZCBzdGFydCB0aGUgYXBwbGljYXRpb24uIEl0IGlzIGFsc28gcmVzcG9uc2libGUgZm9yIGNyZWF0aW5nXG4gKiB0aGUgc3RhdGljIGZpbGUgKGh0dHApIHNlcnZlciBhcyB3ZWxsIGFzIHRoZSBzb2NrZXQgc2VydmVyLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXJcbiAqIEBuYW1lc3BhY2VcbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgc291bmR3b3JrcyBmcm9tICdzb3VuZHdvcmtzL3NlcnZlcic7XG4gKiBpbXBvcnQgTXlFeHBlcmllbmNlIGZyb20gJy4vTXlFeHBlcmllbmNlJztcbiAqXG4gKiBzb3VuZHdvcmtzLnNlcnZlci5pbml0KHsgYXBwTmFtZTogJ015QXBwbGljYXRpb24nIH0pO1xuICogY29uc3QgbXlFeHBlcmllbmNlID0gbmV3IE15RXhwZXJpZW5jZSgpO1xuICogc291bmR3b3Jrcy5zZXJ2ZXIuc3RhcnQoKTtcbiAqL1xuY29uc3Qgc2VydmVyID0ge1xuICAvKipcbiAgICogU29ja2V0SU8gc2VydmVyLlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaW86IG51bGwsXG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyYXRpb24gaW5mb3JtYXRpb25zLCBhbGwgY29uZmlnIG9iamVjdHMgcGFzc2VkIHRvIHRoZVxuICAgKiBbYHNlcnZlci5pbml0YF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLnNlcnZlci5pbml0fSBhcmUgbWVyZ2VkXG4gICAqIGludG8gdGhpcyBvYmplY3QuXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xuICBjb25maWc6IHt9LFxuXG4gIC8qKlxuICAgKiBNYXBwaW5nIGJldHdlZW4gYSBgY2xpZW50VHlwZWAgYW5kIGl0cyByZWxhdGVkIGFjdGl2aXRpZXMuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfY2xpZW50VHlwZUFjdGl2aXRpZXNNYXA6IHt9LFxuXG4gIC8qKlxuICAgKiBSZXF1aXJlZCBhY3Rpdml0aWVzIHRoYXQgbXVzdCBiZSBzdGFydGVkLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2FjdGl2aXRpZXM6IG5ldyBTZXQoKSxcblxuICAvKipcbiAgICogTWFwIGNsaWVudCB0eXBlcyB3aXRoIGFuIGFjdGl2aXR5LlxuICAgKiBAcGFyYW0ge0FycmF5PFN0cmluZz59IGNsaWVudFR5cGVzIC0gTGlzdCBvZiBjbGllbnQgdHlwZS5cbiAgICogQHBhcmFtIHtBY3Rpdml0eX0gYWN0aXZpdHkgLSBBY3Rpdml0eSBjb25jZXJuZWQgd2l0aCB0aGUgZ2l2ZW4gYGNsaWVudFR5cGVzYC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9zZXRNYXAoY2xpZW50VHlwZXMsIGFjdGl2aXR5KSB7XG4gICAgY2xpZW50VHlwZXMuZm9yRWFjaCgoY2xpZW50VHlwZSkgPT4ge1xuICAgICAgaWYgKCF0aGlzLl9jbGllbnRUeXBlQWN0aXZpdGllc01hcFtjbGllbnRUeXBlXSlcbiAgICAgICAgdGhpcy5fY2xpZW50VHlwZUFjdGl2aXRpZXNNYXBbY2xpZW50VHlwZV0gPSBuZXcgU2V0KCk7XG5cbiAgICAgIHRoaXMuX2NsaWVudFR5cGVBY3Rpdml0aWVzTWFwW2NsaWVudFR5cGVdLmFkZChhY3Rpdml0eSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uIHVzZWQgYnkgYWN0aXZpdGllcyB0byByZWdpc3RlciB0aGVtc2VsdmVzIGFzIGFjdGl2ZSBhY3Rpdml0aWVzXG4gICAqIEBwYXJhbSB7QWN0aXZpdHl9IGFjdGl2aXR5IC0gQWN0aXZpdHkgdG8gYmUgcmVnaXN0ZXJlZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNldEFjdGl2aXR5KGFjdGl2aXR5KSB7XG4gICAgdGhpcy5fYWN0aXZpdGllcy5hZGQoYWN0aXZpdHkpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYSBzZXJ2aWNlIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gSWRlbnRpZmllciBvZiB0aGUgc2VydmljZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPcHRpb25zIHRvIGNvbmZpZ3VyZSB0aGUgc2VydmljZS5cbiAgICovXG4gIHJlcXVpcmUoaWQsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gc2VydmljZU1hbmFnZXIucmVxdWlyZShpZCwgbnVsbCwgb3B0aW9ucyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIHNlcnZlciB3aXRoIHRoZSBnaXZlbiBjb25maWcgb2JqZWN0cy5cbiAgICogQHBhcmFtIHsuLi5PYmplY3R9IGNvbmZpZ3MgLSBjb25maWd1cmF0aW9uIG9iamVjdCB0byBiZSBtZXJnZSB3aXRoIHRoZVxuICAgKiAgZGVmYXVsdCBgc291bmR3b3Jrc2AgY29uZmlnLiAoX05vdGU6XyBnaXZlbiBvYmplY3RzIGFyZSBtZXJnZWQgYXQgMiBsZXZlbHNcbiAgICogIG9mIGRlcHRoKVxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuYXBwfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuZW52fVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuZnd9XG4gICAqL1xuICBpbml0KC4uLmNvbmZpZ3MpIHtcbiAgICAvLyBtZXJnZSBkZWZhdWx0IGNvbmZpZ3VyYXRpb24gb2JqZWN0c1xuICAgIHRoaXMuY29uZmlnID0gT2JqZWN0LmFzc2lnbih0aGlzLmNvbmZpZywgZGVmYXVsdEFwcENvbmZpZywgZGVmYXVsdEZ3Q29uZmlnLCBkZWZhdWx0RW52Q29uZmlnKTtcbiAgICAvLyBtZXJnZSBnaXZlbiBjb25maWd1cmF0aW9ucyBvYmplY3RzIHdpdGggZGVmYXVsdHMgKDEgbGV2ZWwgZGVwdGgpXG4gICAgY29uZmlncy5mb3JFYWNoKChjb25maWcpID0+IHtcbiAgICAgIGZvciAobGV0IGtleSBpbiBjb25maWcpIHtcbiAgICAgICAgY29uc3QgZW50cnkgPSBjb25maWdba2V5XTtcbiAgICAgICAgaWYgKHR5cGVvZiBlbnRyeSA9PT0gJ29iamVjdCcgJiYgZW50cnkgIT09IG51bGwpIHtcbiAgICAgICAgICB0aGlzLmNvbmZpZ1trZXldID0gdGhpcy5jb25maWdba2V5XSB8fMKge307XG4gICAgICAgICAgdGhpcy5jb25maWdba2V5XSA9IE9iamVjdC5hc3NpZ24odGhpcy5jb25maWdba2V5XSwgZW50cnkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuY29uZmlnW2tleV0gPSBlbnRyeTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgYXBwbGljYXRpb246XG4gICAqIC0gbGF1bmNoIHRoZSBIVFRQIHNlcnZlci5cbiAgICogLSBsYXVuY2ggdGhlIHNvY2tldCBzZXJ2ZXIuXG4gICAqIC0gc3RhcnQgYWxsIHJlZ2lzdGVyZWQgYWN0aXZpdGllcy5cbiAgICogLSBkZWZpbmUgcm91dGVzIGFuZCBhbmQgYWN0aXZpdGllcyBtYXBwaW5nIGZvciBhbGwgY2xpZW50IHR5cGVzLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgbG9nZ2VyLmluaXRpYWxpemUodGhpcy5jb25maWcubG9nZ2VyKTtcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gY29uZmlndXJlIGV4cHJlc3MgYW5kIGh0dHAocykgc2VydmVyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBjb25zdCBleHByZXNzQXBwID0gbmV3IGV4cHJlc3MoKTtcbiAgICBleHByZXNzQXBwLnNldCgncG9ydCcsIHByb2Nlc3MuZW52LlBPUlQgfHwgdGhpcy5jb25maWcucG9ydCk7XG4gICAgZXhwcmVzc0FwcC5zZXQoJ3ZpZXcgZW5naW5lJywgJ2VqcycpO1xuICAgIGV4cHJlc3NBcHAudXNlKGV4cHJlc3Muc3RhdGljKHRoaXMuY29uZmlnLnB1YmxpY0ZvbGRlcikpO1xuXG4gICAgbGV0IGh0dHBTZXJ2ZXI7XG5cbiAgICBpZiAoIXRoaXMuY29uZmlnLnVzZUh0dHBzKSB7XG4gICAgICBodHRwU2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoZXhwcmVzc0FwcCk7XG4gICAgICB0aGlzLl9pbml0U29ja2V0cyhodHRwU2VydmVyKTtcbiAgICAgIHRoaXMuX2luaXRBY3Rpdml0aWVzKGV4cHJlc3NBcHApO1xuXG4gICAgICBodHRwU2VydmVyLmxpc3RlbihleHByZXNzQXBwLmdldCgncG9ydCcpLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgdXJsID0gYGh0dHA6Ly8xMjcuMC4wLjE6JHtleHByZXNzQXBwLmdldCgncG9ydCcpfWA7XG4gICAgICAgIGNvbnNvbGUubG9nKCdbSFRUUCBTRVJWRVJdIFNlcnZlciBsaXN0ZW5pbmcgb24nLCB1cmwpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGxhdW5jaEh0dHBzU2VydmVyID0gKGtleSwgY2VydCkgPT4ge1xuICAgICAgICBodHRwU2VydmVyID0gaHR0cHMuY3JlYXRlU2VydmVyKHsga2V5LCBjZXJ0IH0sIGV4cHJlc3NBcHApO1xuICAgICAgICB0aGlzLl9pbml0U29ja2V0cyhodHRwU2VydmVyKTtcbiAgICAgICAgdGhpcy5faW5pdEFjdGl2aXRpZXMoZXhwcmVzc0FwcCk7XG5cbiAgICAgICAgaHR0cFNlcnZlci5saXN0ZW4oZXhwcmVzc0FwcC5nZXQoJ3BvcnQnKSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgY29uc3QgdXJsID0gYGh0dHBzOi8vMTI3LjAuMC4xOiR7ZXhwcmVzc0FwcC5nZXQoJ3BvcnQnKX1gO1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdbSFRUUFMgU0VSVkVSXSBTZXJ2ZXIgbGlzdGVuaW5nIG9uJywgdXJsKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGh0dHBzSW5mb3MgPSB0aGlzLmNvbmZpZy5odHRwc0luZm9zO1xuXG4gICAgICBpZiAoaHR0cHNJbmZvcy5rZXkgJiYgaHR0cHNJbmZvcy5jZXJ0KSB7XG4gICAgICAgIGNvbnN0IGtleSA9IGZzLnJlYWRGaWxlU3luYyhodHRwc0luZm9zLmtleSk7XG4gICAgICAgIGNvbnN0IGNlcnQgPSBmcy5yZWFkRmlsZVN5bmMoaHR0cHNJbmZvcy5jZXJ0KTtcblxuICAgICAgICBsYXVuY2hIdHRwc1NlcnZlcihrZXksIGNlcnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gZ2VuZXJhdGUgaHR0cHMgY2VydGlmaWNhdGUgKGZvciBkZXZlbG9wbWVudCB1c2FnZSlcbiAgICAgICAgcGVtLmNyZWF0ZUNlcnRpZmljYXRlKHsgZGF5czogMSwgc2VsZlNpZ25lZDogdHJ1ZSB9LCAoZXJyLCBrZXlzKSA9PiB7XG4gICAgICAgICAgbGF1bmNoSHR0cHNTZXJ2ZXIoa2V5cy5zZXJ2aWNlS2V5LCBrZXlzLmNlcnRpZmljYXRlKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBJbml0IHdlYnNvY2tldCBzZXJ2ZXIuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaW5pdFNvY2tldHMoaHR0cFNlcnZlcikge1xuICAgIHRoaXMuaW8gPSBuZXcgSU8oaHR0cFNlcnZlciwgdGhpcy5jb25maWcuc29ja2V0SU8pO1xuXG4gICAgaWYgKHRoaXMuY29uZmlnLmNvcmRvdmEgJiYgdGhpcy5jb25maWcuY29yZG92YS5zb2NrZXRJTykgLy8gSU8gYWRkIHNvbWUgY29uZmlndXJhdGlvbiBvcHRpb25zIHRvIHRoZSBvYmplY3RcbiAgICAgIHRoaXMuY29uZmlnLmNvcmRvdmEuc29ja2V0SU8gPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmNvbmZpZy5zb2NrZXRJTywgdGhpcy5jb25maWcuY29yZG92YS5zb2NrZXRJTyk7XG5cbiAgICBzb2NrZXRzLmluaXRpYWxpemUodGhpcy5pbyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFN0YXJ0IGFsbCBhY3Rpdml0aWVzIGFuZCBtYXAgdGhlIHJvdXRlcyAoY2xpZW50VHlwZSAvIGFjdGl2aXRpZXMgbWFwcGluZykuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaW5pdEFjdGl2aXRpZXMoZXhwcmVzc0FwcCkge1xuICAgIHRoaXMuX2FjdGl2aXRpZXMuZm9yRWFjaCgoYWN0aXZpdHkpID0+IGFjdGl2aXR5LnN0YXJ0KCkpO1xuXG4gICAgdGhpcy5fYWN0aXZpdGllcy5mb3JFYWNoKChhY3Rpdml0eSkgPT4ge1xuICAgICAgdGhpcy5fc2V0TWFwKGFjdGl2aXR5LmNsaWVudFR5cGVzLCBhY3Rpdml0eSlcbiAgICB9KTtcblxuICAgIC8vIG1hcCBgY2xpZW50VHlwZWAgdG8gdGhlaXIgcmVzcGVjdGl2ZSBhY3Rpdml0aWVzXG4gICAgZm9yIChsZXQgY2xpZW50VHlwZSBpbiB0aGlzLl9jbGllbnRUeXBlQWN0aXZpdGllc01hcCkge1xuICAgICAgY29uc3QgYWN0aXZpdHkgPSB0aGlzLl9jbGllbnRUeXBlQWN0aXZpdGllc01hcFtjbGllbnRUeXBlXTtcbiAgICAgIHRoaXMuX21hcChjbGllbnRUeXBlLCBhY3Rpdml0eSwgZXhwcmVzc0FwcCk7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBNYXAgYSBjbGllbnQgdHlwZSB0byBhIHJvdXRlLCBhIHNldCBvZiBhY3Rpdml0aWVzLlxuICAgKiBBZGRpdGlvbm5hbGx5IGxpc3RlbiBmb3IgdGhlaXIgc29ja2V0IGNvbm5lY3Rpb24uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfbWFwKGNsaWVudFR5cGUsIGFjdGl2aXRpZXMsIGV4cHJlc3NBcHApIHtcbiAgICAvLyBAdG9kbyAtIGFsbG93IHRvIHBhc3Mgc29tZSB2YXJpYWJsZSBpbiB0aGUgdXJsIC0+IGRlZmluZSBob3cgYmluZCBpdCB0byBzb2NrZXRzLi4uXG4gICAgY29uc3QgdXJsID0gKGNsaWVudFR5cGUgIT09IHRoaXMuY29uZmlnLmRlZmF1bHRDbGllbnQpID8gYC8ke2NsaWVudFR5cGV9YCA6ICcvJztcblxuICAgIC8vIHVzZSB0ZW1wbGF0ZSB3aXRoIGBjbGllbnRUeXBlYCBuYW1lIG9yIGRlZmF1bHQgaWYgbm90IGRlZmluZWRcbiAgICBjb25zdCBjbGllbnRUbXBsID0gcGF0aC5qb2luKHRoaXMuY29uZmlnLnRlbXBsYXRlRm9sZGVyLCBgJHtjbGllbnRUeXBlfS5lanNgKTtcbiAgICBjb25zdCBkZWZhdWx0VG1wbCA9IHBhdGguam9pbih0aGlzLmNvbmZpZy50ZW1wbGF0ZUZvbGRlciwgYGRlZmF1bHQuZWpzYCk7XG4gICAgY29uc3QgdGVtcGxhdGUgPSBmcy5leGlzdHNTeW5jKGNsaWVudFRtcGwpID8gY2xpZW50VG1wbCA6IGRlZmF1bHRUbXBsO1xuXG4gICAgY29uc3QgdG1wbFN0cmluZyA9IGZzLnJlYWRGaWxlU3luYyh0ZW1wbGF0ZSwgeyBlbmNvZGluZzogJ3V0ZjgnIH0pO1xuICAgIGNvbnN0IHRtcGwgPSBlanMuY29tcGlsZSh0bXBsU3RyaW5nKTtcblxuICAgIGV4cHJlc3NBcHAuZ2V0KHVybCwgKHJlcSwgcmVzKSA9PiB7XG4gICAgICBsZXQgaW5jbHVkZUNvcmRvdmFUYWdzID0gZmFsc2U7XG4gICAgICBsZXQgc29ja2V0Q29uZmlnID0gSlNPTi5zdHJpbmdpZnkodGhpcy5jb25maWcuc29ja2V0SU8pO1xuXG4gICAgICBpZiAocmVxLnF1ZXJ5LmNvcmRvdmEpIHtcbiAgICAgICAgaW5jbHVkZUNvcmRvdmFUYWdzID0gdHJ1ZTtcbiAgICAgICAgc29ja2V0Q29uZmlnID0gSlNPTi5zdHJpbmdpZnkodGhpcy5jb25maWcuY29yZG92YS5zb2NrZXRJTyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXEucXVlcnkuY2xpZW50VHlwZSlcbiAgICAgICAgY2xpZW50VHlwZSA9IHJlcS5xdWVyeS5jbGllbnRUeXBlO1xuXG4gICAgICByZXMuc2VuZCh0bXBsKHtcbiAgICAgICAgc29ja2V0SU86IHNvY2tldENvbmZpZyxcbiAgICAgICAgYXBwTmFtZTogdGhpcy5jb25maWcuYXBwTmFtZSxcbiAgICAgICAgdmVyc2lvbjogdGhpcy5jb25maWcudmVyc2lvbixcbiAgICAgICAgY2xpZW50VHlwZTogY2xpZW50VHlwZSxcbiAgICAgICAgZGVmYXVsdFR5cGU6IHRoaXMuY29uZmlnLmRlZmF1bHRDbGllbnQsXG4gICAgICAgIGFzc2V0c0RvbWFpbjogdGhpcy5jb25maWcuYXNzZXRzRG9tYWluLFxuICAgICAgICAvLyBleHBvcnQgaHRtbCBmb3IgY29yZG92YSBvciBjbGllbnQgb25seSB1c2FnZVxuICAgICAgICBpbmNsdWRlQ29yZG92YVRhZ3M6IGluY2x1ZGVDb3Jkb3ZhVGFncyxcbiAgICAgIH0pKTtcbiAgICB9KTtcblxuICAgIC8vIHdhaXQgZm9yIHNvY2tldCBjb25ubmVjdGlvblxuICAgIHRoaXMuaW8ub2YoY2xpZW50VHlwZSkub24oJ2Nvbm5lY3Rpb24nLCB0aGlzLl9vbkNvbm5lY3Rpb24oY2xpZW50VHlwZSwgYWN0aXZpdGllcykpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTb2NrZXQgY29ubmVjdGlvbiBjYWxsYmFjay5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9vbkNvbm5lY3Rpb24oY2xpZW50VHlwZSwgYWN0aXZpdGllcykge1xuICAgIHJldHVybiAoc29ja2V0KSA9PiB7XG4gICAgICBjb25zdCBjbGllbnQgPSBuZXcgQ2xpZW50KGNsaWVudFR5cGUsIHNvY2tldCk7XG4gICAgICBhY3Rpdml0aWVzLmZvckVhY2goKGFjdGl2aXR5KSA9PiBhY3Rpdml0eS5jb25uZWN0KGNsaWVudCkpO1xuXG4gICAgICAvLyBnbG9iYWwgbGlmZWN5Y2xlIG9mIHRoZSBjbGllbnRcbiAgICAgIHNvY2tldHMucmVjZWl2ZShjbGllbnQsICdkaXNjb25uZWN0JywgKCkgPT4ge1xuICAgICAgICBhY3Rpdml0aWVzLmZvckVhY2goKGFjdGl2aXR5KSA9PiBhY3Rpdml0eS5kaXNjb25uZWN0KGNsaWVudCkpO1xuICAgICAgICBjbGllbnQuZGVzdHJveSgpO1xuICAgICAgICBsb2dnZXIuaW5mbyh7IHNvY2tldCwgY2xpZW50VHlwZSB9LCAnZGlzY29ubmVjdCcpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIEB0b2RvIC0gcmVmYWN0b3IgaGFuZHNoYWtlIGFuZCB1dWlkIGRlZmluaXRpb24uXG4gICAgICBzb2NrZXRzLnNlbmQoY2xpZW50LCAnY2xpZW50OnN0YXJ0JywgY2xpZW50LnV1aWQpO1xuICAgICAgbG9nZ2VyLmluZm8oeyBzb2NrZXQsIGNsaWVudFR5cGUgfSwgJ2Nvbm5lY3Rpb24nKTtcbiAgICB9XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBzZXJ2ZXI7XG4iXX0=