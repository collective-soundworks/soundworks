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

var _app = require('../config/app');

var _app2 = _interopRequireDefault(_app);

var _fw = require('../config/fw');

var _fw2 = _interopRequireDefault(_fw);

var _env = require('../config/env');

var _env2 = _interopRequireDefault(_env);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The `server` object contains the basic methods of the server.
 * For instance, this object allows setting up, configuring and starting the server with the method `start` while the method `map` allows for managing the mapping between different types of clients and their required server activities.
 * @type {Object}
 */
exports.default = {

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
  _activities: new _set2.default(),

  /**
   * Returns a service configured with the given options.
   * @param {String} id - The identifier of the service.
   * @param {Object} options - The options to configure the service.
   */
  require: function require(id, options) {
    return _serviceManager2.default.require(id, null, options);
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
      if (!_this._clientTypeActivitiesMap[clientType]) _this._clientTypeActivitiesMap[clientType] = new _set2.default();

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
    this.config = (0, _assign2.default)(this.config, _app2.default, _fw2.default, _env2.default);
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
   * Start the server:
   * - launch the HTTP server.
   * - launch the socket server.
   * - start all registered activities.
   * - define routes and associate client types and activities.
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
      _pem2.default.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
        httpServer = _https2.default.createServer({
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
    this.io = new _socket2.default(httpServer, this.config.socketIO);

    if (this.config.cordova && this.config.cordova.socketIO) // IO add some configuration options to the object
      this.config.cordova.socketIO = (0, _assign2.default)({}, this.config.socketIO, this.config.cordova.socketIO);

    _sockets2.default.initialize(this.io);
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
   * Indicate that the clients of type `clientType` require the activities `...activities` on the server side.
   * Additionally, this method routes the connections from the corresponding URL to the corresponding view.
   * More specifically:
   * - A client connecting to the server through the root URL `http://my.server.address:port/` is considered as a `'player'` client and displays the view `player.ejs`;
   * - A client connecting to the server through the URL `http://my.server.address:port/clientType` is considered as a `clientType` client, and displays the view `clientType.ejs`.
   * @param {String} clientType Client type (as defined by the method {@link client.init} on the client side).
   * @param {...Activity} activities Activities to map to that client type.
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
        clientType: clientType,
        defaultType: _this5.config.defaultClient,
        assetsDomain: _this5.config.assetsDomain,
        // export html for cordova use
        includeCordovaTags: includeCordovaTags
      }));
    });

    // wait for socket connnection
    this.io.of(clientType).on('connection', this._onConnection(clientType, activities));
  },


  /**
   * Socket connection callback.
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
        // @todo - should remove all listeners on the client
        client.destroy();
        _logger2.default.info({ socket: socket, clientType: clientType }, 'disconnect');
      });

      // @todo - refactor handshake and uuid definition.
      _sockets2.default.send(client, 'client:start', client.uuid); // the server is ready
      _logger2.default.info({ socket: socket, clientType: clientType }, 'connection');
    };
  }
};

// import default configuration
//# sourceMappingURL=data:application/json;base64,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Q0FBbkI7O0FBRDBDLGNBRzFDLENBQU8sT0FBUCxHQUgwQztBQUkxQyx5QkFBTyxJQUFQLENBQVksRUFBRSxjQUFGLEVBQVUsc0JBQVYsRUFBWixFQUFvQyxZQUFwQyxFQUowQztPQUFOLENBQXRDOzs7QUFMaUIsdUJBYWpCLENBQVEsSUFBUixDQUFhLE1BQWIsRUFBcUIsY0FBckIsRUFBcUMsT0FBTyxJQUFQLENBQXJDO0FBYmlCLHNCQWNqQixDQUFPLElBQVAsQ0FBWSxFQUFFLGNBQUYsRUFBVSxzQkFBVixFQUFaLEVBQW9DLFlBQXBDLEVBZGlCO0tBQVosQ0FENkI7R0E5T3pCIiwiZmlsZSI6InNlcnZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDbGllbnQgZnJvbSAnLi9DbGllbnQnO1xuaW1wb3J0IGVqcyBmcm9tICdlanMnO1xuaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IGh0dHAgZnJvbSAnaHR0cCc7XG5pbXBvcnQgaHR0cHMgZnJvbSAnaHR0cHMnO1xuaW1wb3J0IElPIGZyb20gJ3NvY2tldC5pbyc7XG5pbXBvcnQgbG9nZ2VyIGZyb20gJy4uL3V0aWxzL2xvZ2dlcic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBwZW0gZnJvbSAncGVtJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBzb2NrZXRzIGZyb20gJy4vc29ja2V0cyc7XG5cbi8vIGltcG9ydCBkZWZhdWx0IGNvbmZpZ3VyYXRpb25cbmltcG9ydCB7IGRlZmF1bHQgYXMgZGVmYXVsdEFwcENvbmZpZyB9IGZyb20gJy4uL2NvbmZpZy9hcHAnO1xuaW1wb3J0IHsgZGVmYXVsdCBhcyBkZWZhdWx0RndDb25maWcgfSBmcm9tICcuLi9jb25maWcvZncnO1xuaW1wb3J0IHsgZGVmYXVsdCBhcyBkZWZhdWx0RW52Q29uZmlnIH0gZnJvbSAnLi4vY29uZmlnL2Vudic7XG5cbi8qKlxuICogVGhlIGBzZXJ2ZXJgIG9iamVjdCBjb250YWlucyB0aGUgYmFzaWMgbWV0aG9kcyBvZiB0aGUgc2VydmVyLlxuICogRm9yIGluc3RhbmNlLCB0aGlzIG9iamVjdCBhbGxvd3Mgc2V0dGluZyB1cCwgY29uZmlndXJpbmcgYW5kIHN0YXJ0aW5nIHRoZSBzZXJ2ZXIgd2l0aCB0aGUgbWV0aG9kIGBzdGFydGAgd2hpbGUgdGhlIG1ldGhvZCBgbWFwYCBhbGxvd3MgZm9yIG1hbmFnaW5nIHRoZSBtYXBwaW5nIGJldHdlZW4gZGlmZmVyZW50IHR5cGVzIG9mIGNsaWVudHMgYW5kIHRoZWlyIHJlcXVpcmVkIHNlcnZlciBhY3Rpdml0aWVzLlxuICogQHR5cGUge09iamVjdH1cbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuXG4gIC8qKlxuICAgKiBXZWJTb2NrZXQgc2VydmVyLlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaW86IG51bGwsXG5cbiAgLyoqXG4gICAqIEV4cHJlc3MgYXBwbGljYXRpb25cbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIC8vIGV4cHJlc3NBcHA6IG51bGwsXG5cbiAgLyoqXG4gICAqIEh0dHAgc2VydmVyXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICAvLyBodHRwU2VydmVyOiBudWxsLFxuXG4gIC8qKlxuICAgKiBDb25maWd1cmF0aW9uIGluZm9ybWF0aW9ucy5cbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG4gIGNvbmZpZzoge30sXG5cbiAgLyoqXG4gICAqIE1hcHBpbmcgYmV0d2VlbiBhIGBjbGllbnRUeXBlYCBhbmQgaXRzIHJlbGF0ZWQgYWN0aXZpdGllc1xuICAgKi9cbiAgX2NsaWVudFR5cGVBY3Rpdml0aWVzTWFwOiB7fSxcblxuICAvKipcbiAgICogQWN0aXZpdGllcyB0byBiZSBzdGFydGVkXG4gICAqL1xuICBfYWN0aXZpdGllczogbmV3IFNldCgpLFxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc2VydmljZSBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIFRoZSBpZGVudGlmaWVyIG9mIHRoZSBzZXJ2aWNlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFRoZSBvcHRpb25zIHRvIGNvbmZpZ3VyZSB0aGUgc2VydmljZS5cbiAgICovXG4gIHJlcXVpcmUoaWQsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gc2VydmljZU1hbmFnZXIucmVxdWlyZShpZCwgbnVsbCwgb3B0aW9ucyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uIHVzZWQgYnkgYWN0aXZpdGllcyB0byByZWdpc3RlcmVkIHRoZWlyIGNvbmNlcm5lZCBjbGllbnQgdHlwZSBpbnRvIHRoZSBzZXJ2ZXJcbiAgICogQHBhcmFtIHtBcnJheTxTdHJpbmc+fSBjbGllbnRUeXBlcyAtIEFuIGFycmF5IG9mIGNsaWVudCB0eXBlLlxuICAgKiBAcGFyYW0ge0FjdGl2aXR5fSBhY3Rpdml0eSAtIFRoZSBhY3Rpdml0eSBjb25jZXJuZWQgd2l0aCB0aGUgZ2l2ZW4gYGNsaWVudFR5cGVzYC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNldE1hcChjbGllbnRUeXBlcywgYWN0aXZpdHkpIHtcbiAgICBjbGllbnRUeXBlcy5mb3JFYWNoKChjbGllbnRUeXBlKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuX2NsaWVudFR5cGVBY3Rpdml0aWVzTWFwW2NsaWVudFR5cGVdKVxuICAgICAgICB0aGlzLl9jbGllbnRUeXBlQWN0aXZpdGllc01hcFtjbGllbnRUeXBlXSA9IG5ldyBTZXQoKTtcblxuICAgICAgdGhpcy5fY2xpZW50VHlwZUFjdGl2aXRpZXNNYXBbY2xpZW50VHlwZV0uYWRkKGFjdGl2aXR5KTtcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogRnVuY3Rpb24gdXNlZCBieSBhY3Rpdml0aWVzIHRvIHJlZ2lzdGVyIHRoZW1zZWx2ZXMgYXMgYWN0aXZlIGFjdGl2aXRpZXNcbiAgICogQHBhcmFtIHtBY3Rpdml0eX0gYWN0aXZpdHlcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNldEFjdGl2aXR5KGFjdGl2aXR5KSB7XG4gICAgdGhpcy5fYWN0aXZpdGllcy5hZGQoYWN0aXZpdHkpO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIHNlcnZlciB3aXRoIHRoZSBnaXZlbiBjb25maWcgb2JqZWN0cy5cbiAgICogQHRvZG8gLSBtb3ZlIHRoaXMgZG9jIHRvIGNvbmZpZ3VyYXRpb24gb2JqZWN0cy5cbiAgICpcbiAgICogQHBhcmFtIHsuLi5PYmplY3R9IGNvbmZpZ3MgLSBPYmplY3Qgb2YgYXBwbGljYXRpb24gY29uZmlndXJhdGlvbi5cbiAgICpcbiAgICogQHRvZG8gLSByZXdyaXRlIGRvYyBwcm9wZXJseSBmb3IgdGhpcyBtZXRob2QuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbYXBwQ29uZmlnPXt9XSBBcHBsaWNhdGlvbiBjb25maWd1cmF0aW9uIG9wdGlvbnMuXG4gICAqIEBhdHRyaWJ1dGUge1N0cmluZ30gW2FwcENvbmZpZy5wdWJsaWNGb2xkZXI9Jy4vcHVibGljJ10gUGF0aCB0byB0aGUgcHVibGljIGZvbGRlci5cbiAgICogQGF0dHJpYnV0ZSB7T2JqZWN0fSBbYXBwQ29uZmlnLnNvY2tldElPPXt9XSBzb2NrZXQuaW8gb3B0aW9ucy4gVGhlIHNvY2tldC5pbyBjb25maWcgb2JqZWN0IGNhbiBoYXZlIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAgICogLSBgdHJhbnNwb3J0czpTdHJpbmdgOiBjb21tdW5pY2F0aW9uIHRyYW5zcG9ydCAoZGVmYXVsdHMgdG8gYCd3ZWJzb2NrZXQnYCk7XG4gICAqIC0gYHBpbmdUaW1lb3V0Ok51bWJlcmA6IHRpbWVvdXQgKGluIG1pbGxpc2Vjb25kcykgYmVmb3JlIHRyeWluZyB0byByZWVzdGFibGlzaCBhIGNvbm5lY3Rpb24gYmV0d2VlbiBhIGxvc3QgY2xpZW50IGFuZCBhIHNlcnZlciAoZGVmYXV0bHMgdG8gYDYwMDAwYCk7XG4gICAqIC0gYHBpbmdJbnRlcnZhbDpOdW1iZXJgOiB0aW1lIGludGVydmFsIChpbiBtaWxsaXNlY29uZHMpIHRvIHNlbmQgYSBwaW5nIHRvIGEgY2xpZW50IHRvIGNoZWNrIHRoZSBjb25uZWN0aW9uIChkZWZhdWx0cyB0byBgNTAwMDBgKS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtlbnZDb25maWc9e31dIEVudmlyb25tZW50IGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAgICogQGF0dHJpYnV0ZSB7TnVtYmVyfSBbZW52Q29uZmlnLnBvcnQ9ODAwMF0gUG9ydCBvZiB0aGUgSFRUUCBzZXJ2ZXIuXG4gICAqIEBhdHRyaWJ1dGUge09iamVjdH0gW2VudkNvbmZpZy5vc2M9e31dIE9TQyBvcHRpb25zLiBUaGUgT1NDIGNvbmZpZyBvYmplY3QgY2FuIGhhdmUgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICAgKiAtIGBsb2NhbEFkZHJlc3M6U3RyaW5nYDogYWRkcmVzcyBvZiB0aGUgbG9jYWwgbWFjaGluZSB0byByZWNlaXZlIE9TQyBtZXNzYWdlcyAoZGVmYXVsdHMgdG8gYCcxMjcuMC4wLjEnYCk7XG4gICAqIC0gYGxvY2FsUG9ydDpOdW1iZXJgOiBwb3J0IG9mIHRoZSBsb2NhbCBtYWNoaW5lIHRvIHJlY2VpdmUgT1NDIG1lc3NhZ2VzIChkZWZhdWx0cyB0byBgNTcxMjFgKTtcbiAgICogLSBgcmVtb3RlQWRkcmVzczpTdHJpbmdgOiBhZGRyZXNzIG9mIHRoZSBkZXZpY2UgdG8gc2VuZCBkZWZhdWx0IE9TQyBtZXNzYWdlcyB0byAoZGVmYXVsdHMgdG8gYCcxMjcuMC4wLjEnYCk7XG4gICAqIC0gYHJlbW90ZVBvcnQ6TnVtYmVyYDogcG9ydCBvZiB0aGUgZGV2aWNlIHRvIHNlbmQgZGVmYXVsdCBPU0MgbWVzc2FnZXMgdG8gKGRlZmF1bHRzIHRvIGA1NzEyMGApLlxuICAgKi9cbiAgaW5pdCguLi5jb25maWdzKSB7XG4gICAgICAgIC8vIG1lcmdlIGRlZmF1bHQgY29uZmlndXJhdGlvbiBvYmplY3RzXG4gICAgdGhpcy5jb25maWcgPSBPYmplY3QuYXNzaWduKHRoaXMuY29uZmlnLCBkZWZhdWx0QXBwQ29uZmlnLCBkZWZhdWx0RndDb25maWcsIGRlZmF1bHRFbnZDb25maWcpO1xuICAgIC8vIG1lcmdlIGdpdmVuIGNvbmZpZ3VyYXRpb25zIG9iamVjdHMgd2l0aCBkZWZhdWx0cyAoMSBsZXZlbCBkZXB0aClcbiAgICBjb25maWdzLmZvckVhY2goKGNvbmZpZykgPT4ge1xuICAgICAgZm9yIChsZXQga2V5IGluIGNvbmZpZykge1xuICAgICAgICBjb25zdCBlbnRyeSA9IGNvbmZpZ1trZXldO1xuICAgICAgICBpZiAodHlwZW9mIGVudHJ5ID09PSAnb2JqZWN0JyAmJiBlbnRyeSAhPT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMuY29uZmlnW2tleV0gPSB0aGlzLmNvbmZpZ1trZXldIHx8wqB7fTtcbiAgICAgICAgICB0aGlzLmNvbmZpZ1trZXldID0gT2JqZWN0LmFzc2lnbih0aGlzLmNvbmZpZ1trZXldLCBlbnRyeSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5jb25maWdba2V5XSA9IGVudHJ5O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBzZXJ2ZXI6XG4gICAqIC0gbGF1bmNoIHRoZSBIVFRQIHNlcnZlci5cbiAgICogLSBsYXVuY2ggdGhlIHNvY2tldCBzZXJ2ZXIuXG4gICAqIC0gc3RhcnQgYWxsIHJlZ2lzdGVyZWQgYWN0aXZpdGllcy5cbiAgICogLSBkZWZpbmUgcm91dGVzIGFuZCBhc3NvY2lhdGUgY2xpZW50IHR5cGVzIGFuZCBhY3Rpdml0aWVzLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgbG9nZ2VyLmluaXRpYWxpemUodGhpcy5jb25maWcubG9nZ2VyKTtcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gY29uZmlndXJlIGV4cHJlc3MgYW5kIGh0dHAocykgc2VydmVyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBjb25zdCBleHByZXNzQXBwID0gbmV3IGV4cHJlc3MoKTtcbiAgICBleHByZXNzQXBwLnNldCgncG9ydCcsIHByb2Nlc3MuZW52LlBPUlQgfHwgdGhpcy5jb25maWcucG9ydCk7XG4gICAgZXhwcmVzc0FwcC5zZXQoJ3ZpZXcgZW5naW5lJywgJ2VqcycpO1xuICAgIGV4cHJlc3NBcHAudXNlKGV4cHJlc3Muc3RhdGljKHRoaXMuY29uZmlnLnB1YmxpY0ZvbGRlcikpO1xuXG4gICAgbGV0IGh0dHBTZXJ2ZXI7XG5cbiAgICBpZiAoIXRoaXMuY29uZmlnLnVzZUh0dHBzKSB7XG4gICAgICBodHRwU2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoZXhwcmVzc0FwcCk7XG4gICAgICB0aGlzLl9pbml0U29ja2V0cyhodHRwU2VydmVyKTtcbiAgICAgIHRoaXMuX2luaXRBY3Rpdml0aWVzKGV4cHJlc3NBcHApO1xuXG4gICAgICBodHRwU2VydmVyLmxpc3RlbihleHByZXNzQXBwLmdldCgncG9ydCcpLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgdXJsID0gYGh0dHA6Ly8xMjcuMC4wLjE6JHtleHByZXNzQXBwLmdldCgncG9ydCcpfWA7XG4gICAgICAgIGNvbnNvbGUubG9nKCdbSFRUUCBTRVJWRVJdIFNlcnZlciBsaXN0ZW5pbmcgb24nLCB1cmwpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBlbS5jcmVhdGVDZXJ0aWZpY2F0ZSh7IGRheXM6IDEsIHNlbGZTaWduZWQ6IHRydWUgfSwgKGVyciwga2V5cykgPT4ge1xuICAgICAgICBodHRwU2VydmVyID0gaHR0cHMuY3JlYXRlU2VydmVyKHtcbiAgICAgICAgICBrZXk6IGtleXMuc2VydmljZUtleSxcbiAgICAgICAgICBjZXJ0OiBrZXlzLmNlcnRpZmljYXRlXG4gICAgICAgIH0sIGV4cHJlc3NBcHApO1xuXG4gICAgICAgIHRoaXMuX2luaXRTb2NrZXRzKGh0dHBTZXJ2ZXIpO1xuICAgICAgICB0aGlzLl9pbml0QWN0aXZpdGllcyhleHByZXNzQXBwKTtcblxuICAgICAgICBodHRwU2VydmVyLmxpc3RlbihleHByZXNzQXBwLmdldCgncG9ydCcpLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBjb25zdCB1cmwgPSBgaHR0cHM6Ly8xMjcuMC4wLjE6JHtleHByZXNzQXBwLmdldCgncG9ydCcpfWA7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1tIVFRQIFNFUlZFUl0gU2VydmVyIGxpc3RlbmluZyBvbicsIHVybCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBJbml0IHdlYnNvY2tldCBzZXJ2ZXIuXG4gICAqL1xuICBfaW5pdFNvY2tldHMoaHR0cFNlcnZlcikge1xuICAgIHRoaXMuaW8gPSBuZXcgSU8oaHR0cFNlcnZlciwgdGhpcy5jb25maWcuc29ja2V0SU8pO1xuXG4gICAgaWYgKHRoaXMuY29uZmlnLmNvcmRvdmEgJiYgdGhpcy5jb25maWcuY29yZG92YS5zb2NrZXRJTykgLy8gSU8gYWRkIHNvbWUgY29uZmlndXJhdGlvbiBvcHRpb25zIHRvIHRoZSBvYmplY3RcbiAgICAgIHRoaXMuY29uZmlnLmNvcmRvdmEuc29ja2V0SU8gPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmNvbmZpZy5zb2NrZXRJTywgdGhpcy5jb25maWcuY29yZG92YS5zb2NrZXRJTyk7XG5cbiAgICBzb2NrZXRzLmluaXRpYWxpemUodGhpcy5pbyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFN0YXJ0IGFsbCBhY3Rpdml0aWVzIGFuZCBtYXAgdGhlIHJvdXRlcyAoY2xpZW50VHlwZSAvIGFjdGl2aXRpZXMgbWFwcGluZykuXG4gICAqL1xuICBfaW5pdEFjdGl2aXRpZXMoZXhwcmVzc0FwcCkge1xuICAgIHRoaXMuX2FjdGl2aXRpZXMuZm9yRWFjaCgoYWN0aXZpdHkpID0+IGFjdGl2aXR5LnN0YXJ0KCkpO1xuXG4gICAgdGhpcy5fYWN0aXZpdGllcy5mb3JFYWNoKChhY3Rpdml0eSkgPT4ge1xuICAgICAgdGhpcy5zZXRNYXAoYWN0aXZpdHkuY2xpZW50VHlwZXMsIGFjdGl2aXR5KVxuICAgIH0pO1xuXG4gICAgLy8gbWFwIGBjbGllbnRUeXBlYCB0byB0aGVpciByZXNwZWN0aXZlIGFjdGl2aXRpZXNcbiAgICBmb3IgKGxldCBjbGllbnRUeXBlIGluIHRoaXMuX2NsaWVudFR5cGVBY3Rpdml0aWVzTWFwKSB7XG4gICAgICBjb25zdCBhY3Rpdml0eSA9IHRoaXMuX2NsaWVudFR5cGVBY3Rpdml0aWVzTWFwW2NsaWVudFR5cGVdO1xuICAgICAgdGhpcy5fbWFwKGNsaWVudFR5cGUsIGFjdGl2aXR5LCBleHByZXNzQXBwKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEluZGljYXRlIHRoYXQgdGhlIGNsaWVudHMgb2YgdHlwZSBgY2xpZW50VHlwZWAgcmVxdWlyZSB0aGUgYWN0aXZpdGllcyBgLi4uYWN0aXZpdGllc2Agb24gdGhlIHNlcnZlciBzaWRlLlxuICAgKiBBZGRpdGlvbmFsbHksIHRoaXMgbWV0aG9kIHJvdXRlcyB0aGUgY29ubmVjdGlvbnMgZnJvbSB0aGUgY29ycmVzcG9uZGluZyBVUkwgdG8gdGhlIGNvcnJlc3BvbmRpbmcgdmlldy5cbiAgICogTW9yZSBzcGVjaWZpY2FsbHk6XG4gICAqIC0gQSBjbGllbnQgY29ubmVjdGluZyB0byB0aGUgc2VydmVyIHRocm91Z2ggdGhlIHJvb3QgVVJMIGBodHRwOi8vbXkuc2VydmVyLmFkZHJlc3M6cG9ydC9gIGlzIGNvbnNpZGVyZWQgYXMgYSBgJ3BsYXllcidgIGNsaWVudCBhbmQgZGlzcGxheXMgdGhlIHZpZXcgYHBsYXllci5lanNgO1xuICAgKiAtIEEgY2xpZW50IGNvbm5lY3RpbmcgdG8gdGhlIHNlcnZlciB0aHJvdWdoIHRoZSBVUkwgYGh0dHA6Ly9teS5zZXJ2ZXIuYWRkcmVzczpwb3J0L2NsaWVudFR5cGVgIGlzIGNvbnNpZGVyZWQgYXMgYSBgY2xpZW50VHlwZWAgY2xpZW50LCBhbmQgZGlzcGxheXMgdGhlIHZpZXcgYGNsaWVudFR5cGUuZWpzYC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNsaWVudFR5cGUgQ2xpZW50IHR5cGUgKGFzIGRlZmluZWQgYnkgdGhlIG1ldGhvZCB7QGxpbmsgY2xpZW50LmluaXR9IG9uIHRoZSBjbGllbnQgc2lkZSkuXG4gICAqIEBwYXJhbSB7Li4uQWN0aXZpdHl9IGFjdGl2aXRpZXMgQWN0aXZpdGllcyB0byBtYXAgdG8gdGhhdCBjbGllbnQgdHlwZS5cbiAgICovXG4gIF9tYXAoY2xpZW50VHlwZSwgYWN0aXZpdGllcywgZXhwcmVzc0FwcCkge1xuICAgIC8vIEB0b2RvIC0gYWxsb3cgdG8gcGFzcyBzb21lIHZhcmlhYmxlIGluIHRoZSB1cmwgLT4gZGVmaW5lIGhvdyBiaW5kIGl0IHRvIHNvY2tldHMuLi5cbiAgICBjb25zdCB1cmwgPSAoY2xpZW50VHlwZSAhPT0gdGhpcy5jb25maWcuZGVmYXVsdENsaWVudCkgPyBgLyR7Y2xpZW50VHlwZX1gIDogJy8nO1xuXG4gICAgLy8gdXNlIHRlbXBsYXRlIHdpdGggYGNsaWVudFR5cGVgIG5hbWUgb3IgZGVmYXVsdCBpZiBub3QgZGVmaW5lZFxuICAgIGNvbnN0IGNsaWVudFRtcGwgPSBwYXRoLmpvaW4odGhpcy5jb25maWcudGVtcGxhdGVGb2xkZXIsIGAke2NsaWVudFR5cGV9LmVqc2ApO1xuICAgIGNvbnN0IGRlZmF1bHRUbXBsID0gcGF0aC5qb2luKHRoaXMuY29uZmlnLnRlbXBsYXRlRm9sZGVyLCBgZGVmYXVsdC5lanNgKTtcbiAgICBjb25zdCB0ZW1wbGF0ZSA9IGZzLmV4aXN0c1N5bmMoY2xpZW50VG1wbCkgPyBjbGllbnRUbXBsIDogZGVmYXVsdFRtcGw7XG5cbiAgICBjb25zdCB0bXBsU3RyaW5nID0gZnMucmVhZEZpbGVTeW5jKHRlbXBsYXRlLCB7IGVuY29kaW5nOiAndXRmOCcgfSk7XG4gICAgY29uc3QgdG1wbCA9IGVqcy5jb21waWxlKHRtcGxTdHJpbmcpO1xuXG4gICAgZXhwcmVzc0FwcC5nZXQodXJsLCAocmVxLCByZXMpID0+IHtcbiAgICAgIGxldCBpbmNsdWRlQ29yZG92YVRhZ3MgPSBmYWxzZTtcbiAgICAgIGxldCBzb2NrZXRDb25maWcgPSBKU09OLnN0cmluZ2lmeSh0aGlzLmNvbmZpZy5zb2NrZXRJTyk7XG5cbiAgICAgIGlmIChyZXEucXVlcnkuY29yZG92YSkge1xuICAgICAgICBpbmNsdWRlQ29yZG92YVRhZ3MgPSB0cnVlO1xuICAgICAgICBzb2NrZXRDb25maWcgPSBKU09OLnN0cmluZ2lmeSh0aGlzLmNvbmZpZy5jb3Jkb3ZhLnNvY2tldElPKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlcS5xdWVyeS5jbGllbnRUeXBlKVxuICAgICAgICBjbGllbnRUeXBlID0gcmVxLnF1ZXJ5LmNsaWVudFR5cGU7XG5cbiAgICAgIHJlcy5zZW5kKHRtcGwoe1xuICAgICAgICBzb2NrZXRJTzogc29ja2V0Q29uZmlnLFxuICAgICAgICBhcHBOYW1lOiB0aGlzLmNvbmZpZy5hcHBOYW1lLFxuICAgICAgICBjbGllbnRUeXBlOiBjbGllbnRUeXBlLFxuICAgICAgICBkZWZhdWx0VHlwZTogdGhpcy5jb25maWcuZGVmYXVsdENsaWVudCxcbiAgICAgICAgYXNzZXRzRG9tYWluOiB0aGlzLmNvbmZpZy5hc3NldHNEb21haW4sXG4gICAgICAgIC8vIGV4cG9ydCBodG1sIGZvciBjb3Jkb3ZhIHVzZVxuICAgICAgICBpbmNsdWRlQ29yZG92YVRhZ3M6IGluY2x1ZGVDb3Jkb3ZhVGFncyxcbiAgICAgIH0pKTtcbiAgICB9KTtcblxuICAgIC8vIHdhaXQgZm9yIHNvY2tldCBjb25ubmVjdGlvblxuICAgIHRoaXMuaW8ub2YoY2xpZW50VHlwZSkub24oJ2Nvbm5lY3Rpb24nLCB0aGlzLl9vbkNvbm5lY3Rpb24oY2xpZW50VHlwZSwgYWN0aXZpdGllcykpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTb2NrZXQgY29ubmVjdGlvbiBjYWxsYmFjay5cbiAgICovXG4gIF9vbkNvbm5lY3Rpb24oY2xpZW50VHlwZSwgYWN0aXZpdGllcykge1xuICAgIHJldHVybiAoc29ja2V0KSA9PiB7XG4gICAgICBjb25zdCBjbGllbnQgPSBuZXcgQ2xpZW50KGNsaWVudFR5cGUsIHNvY2tldCk7XG4gICAgICBhY3Rpdml0aWVzLmZvckVhY2goKGFjdGl2aXR5KSA9PiBhY3Rpdml0eS5jb25uZWN0KGNsaWVudCkpO1xuXG4gICAgICAvLyBnbG9iYWwgbGlmZWN5Y2xlIG9mIHRoZSBjbGllbnRcbiAgICAgIHNvY2tldHMucmVjZWl2ZShjbGllbnQsICdkaXNjb25uZWN0JywgKCkgPT4ge1xuICAgICAgICBhY3Rpdml0aWVzLmZvckVhY2goKGFjdGl2aXR5KSA9PiBhY3Rpdml0eS5kaXNjb25uZWN0KGNsaWVudCkpO1xuICAgICAgICAvLyBAdG9kbyAtIHNob3VsZCByZW1vdmUgYWxsIGxpc3RlbmVycyBvbiB0aGUgY2xpZW50XG4gICAgICAgIGNsaWVudC5kZXN0cm95KCk7XG4gICAgICAgIGxvZ2dlci5pbmZvKHsgc29ja2V0LCBjbGllbnRUeXBlIH0sICdkaXNjb25uZWN0Jyk7XG4gICAgICB9KTtcblxuICAgICAgLy8gQHRvZG8gLSByZWZhY3RvciBoYW5kc2hha2UgYW5kIHV1aWQgZGVmaW5pdGlvbi5cbiAgICAgIHNvY2tldHMuc2VuZChjbGllbnQsICdjbGllbnQ6c3RhcnQnLCBjbGllbnQudXVpZCk7IC8vIHRoZSBzZXJ2ZXIgaXMgcmVhZHlcbiAgICAgIGxvZ2dlci5pbmZvKHsgc29ja2V0LCBjbGllbnRUeXBlIH0sICdjb25uZWN0aW9uJyk7XG4gICAgfVxuICB9LFxufTtcbiJdfQ==