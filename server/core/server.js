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

var _osc = require('osc');

var _osc2 = _interopRequireDefault(_osc);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _Client = require('./Client');

var _Client2 = _interopRequireDefault(_Client);

var _serverServiceManager = require('./serverServiceManager');

var _serverServiceManager2 = _interopRequireDefault(_serverServiceManager);

// @todo - move into osc service.
var oscListeners = [];

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
    pingInterval: 50000 }
};

/**
 * Configuration parameters of the Soundworks framework.
 * These parameters allow for configuring components of the framework such as Express and SocketIO.
 */
// configure client side too ?
// @note: EngineIO defaults
// pingTimeout: 3000,
// pingInterval: 1000,
// upgradeTimeout: 10000,
// maxHttpBufferSize: 10E7,
var defaultEnvConfig = {
  port: 8000,
  // osc: {
  //   receiveAddress: '127.0.0.1',
  //   receivePort: 57121,
  //   sendAddress: '127.0.0.1',
  //   sendPort: 57120,
  // },
  osc: null,
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
   * OSC object.
   * @todo - Move into service
   * @type {Object}
   * @private
   */
  osc: null,

  /**
   * Mapping between a `clientType` and its related activities
   */
  _maps: {},

  /**
   * Activities to be started
   */
  _activities: new _Set(),

  /**
   * Initialize the server with the given config objects.
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
    // start all activities and create routes
    // --------------------------------------------------

    this._activities.forEach(function (activity) {
      return activity.start();
    });
    // map `clientType` to their respective activities
    for (var clientType in this._maps) {
      var activity = this._maps[clientType];
      this._map(clientType, activity);
    }

    // --------------------------------------------------
    // @todo - move into a proper service.
    // configure OSC - should be optionnal
    if (this.config.osc) {
      (function () {
        var oscConfig = _this2.config.osc;

        _this2.osc = new _osc2['default'].UDPPort({
          // This is the port we're listening on.
          localAddress: oscConfig.receiveAddress,
          localPort: oscConfig.receivePort,
          // This is the port we use to send messages.
          remoteAddress: oscConfig.sendAddress,
          remotePort: oscConfig.sendPort
        });

        _this2.osc.on('ready', function () {
          var receive = oscConfig.receiveAddress + ':' + oscConfig.receivePort;
          var send = oscConfig.sendAddress + ':' + oscConfig.sendPort;
          console.log('[OSC over UDP] Receiving on ' + receive);
          console.log('[OSC over UDP] Sending on ' + send);
        });

        _this2.osc.on('message', function (oscMsg) {
          var address = oscMsg.address;

          for (var i = 0; i < oscListeners.length; i++) {
            if (address === oscListeners[i].wildcard) oscListeners[i].callback(oscMsg);
          }
        });

        _this2.osc.open();
      })();
    }
    // --------------------------------------------------
  },

  /**
   * Returns a service configured with the given options.
   * @param {String} id - The identifier of the service.
   * @param {Object} options - The options to configure the service.
   */
  require: function require(id, options) {
    return _serverServiceManager2['default'].require(id, options);
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
      if (!_this3._maps[clientType]) _this3._maps[clientType] = new _Set();

      _this3._maps[clientType].add(activity);
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

      // this.io.of(clientType).on('connection', this._onConnection(clientType, modules));
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

      // @todo - refactor handshake and uid definition.
      _sockets2['default'].send(client, 'client:start', client.uid); // the server is ready
      _utilsLogger2['default'].info({ socket: socket, clientType: clientType }, 'connection');
    };
  },

  /**
   * Send an OSC message.
   * @param {String} wildcard Wildcard of the OSC message.
   * @param {Array} args Arguments of the OSC message.
   * @param {String} [url=null] URL to send the OSC message to (if not specified, uses the address defined in the OSC config or in the options of the {@link server.start} method).
   * @param {Number} [port=null] Port to send the message to (if not specified, uses the port defined in the OSC config or in the options of the {@link server.start} method).
   */
  sendOSC: function sendOSC(wildcard, args) {
    var url = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
    var port = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

    var oscMsg = {
      address: wildcard,
      args: args
    };

    try {
      if (url && port) {
        this.osc.send(oscMsg, url, port);
      } else {
        this.osc.send(oscMsg); // use defaults (as defined in the config)
      }
    } catch (e) {
      console.log('Error while sending OSC message:', e);
    }
  },

  /**
   * Listen for OSC message and execute a callback function.
   * The server listens to OSC messages at the address and port defined in the config or in the options of the {@link server.start} method.
   *
   * @param {String} wildcard Wildcard of the OSC message.
   * @param {Function} callback Callback function executed when the OSC message is received.
   */
  receiveOSC: function receiveOSC(wildcard, callback) {
    var oscListener = {
      wildcard: wildcard,
      callback: callback
    };

    oscListeners.push(oscListener);
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvY29yZS9zZXJ2ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O3VCQUFvQixXQUFXOzs7O21CQUNmLEtBQUs7Ozs7dUJBQ0QsU0FBUzs7OztrQkFDZCxJQUFJOzs7O29CQUNGLE1BQU07Ozs7MkJBQ0osaUJBQWlCOzs7O3dCQUNyQixXQUFXOzs7O21CQUNWLEtBQUs7Ozs7b0JBQ0osTUFBTTs7OztzQkFDSixVQUFVOzs7O29DQUNJLHdCQUF3Qjs7Ozs7QUFHekQsSUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDOzs7Ozs7QUFNeEIsSUFBTSxnQkFBZ0IsR0FBRztBQUN2QixTQUFPLEVBQUUsWUFBWTtBQUNyQixTQUFPLEVBQUUsT0FBTzs7Ozs7Ozs7Ozs7Ozs7O0FBZWhCLE9BQUssRUFBRTtBQUNMLFFBQUksRUFBRTtBQUNKLFdBQUssRUFBRSxFQUFFO0FBQ1QsWUFBTSxFQUFFLEVBQUU7QUFDVixnQkFBVSxFQUFFLFNBQVM7S0FDdEI7QUFDRCxVQUFNLEVBQUUsU0FBUztBQUNqQixlQUFXLEVBQUUsU0FBUztBQUN0Qix5QkFBcUIsRUFBRSxDQUFDO0FBQ3hCLFlBQVEsRUFBRSxRQUFRO0dBQ25CO0FBQ0QsbUJBQWlCLEVBQUU7QUFDakIsU0FBSyxFQUFFLEdBQUc7QUFDVixVQUFNLEVBQUUsQ0FBQyxFQUNWO0NBQ0YsQ0FBQzs7Ozs7OztBQU1GLElBQU0sZUFBZSxHQUFHO0FBQ3RCLGNBQVksRUFBRSxrQkFBSyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLFFBQVEsQ0FBQztBQUNoRCxnQkFBYyxFQUFFLGtCQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsT0FBTyxDQUFDO0FBQ2pELGVBQWEsRUFBRSxRQUFRO0FBQ3ZCLGNBQVksRUFBRSxFQUFFO0FBQ2hCLFVBQVEsRUFBRTtBQUNSLE9BQUcsRUFBRSxFQUFFO0FBQ1AsY0FBVSxFQUFFLENBQUMsV0FBVyxDQUFDO0FBQ3pC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O09BQ2xDLE1BQU07QUFDTCxZQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztPQUN2QjtLQUNGLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDVixhQUFPLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3BEO0dBQ0Y7Ozs7Ozs7OztBQVNELFlBQVUsRUFBQSxvQkFBQyxRQUFRLEVBQUUsUUFBUSxFQUFFO0FBQzdCLFFBQU0sV0FBVyxHQUFHO0FBQ2xCLGNBQVEsRUFBRSxRQUFRO0FBQ2xCLGNBQVEsRUFBRSxRQUFRO0tBQ25CLENBQUM7O0FBRUYsZ0JBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7R0FDaEM7Q0FDRiIsImZpbGUiOiJzcmMvc2VydmVyL2NvcmUvc2VydmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNvY2tldHMgZnJvbSAnLi9zb2NrZXRzJztcbmltcG9ydCBlanMgZnJvbSAnZWpzJztcbmltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBodHRwIGZyb20gJ2h0dHAnO1xuaW1wb3J0IGxvZ2dlciBmcm9tICcuLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IElPIGZyb20gJ3NvY2tldC5pbyc7XG5pbXBvcnQgb3NjIGZyb20gJ29zYyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBDbGllbnQgZnJvbSAnLi9DbGllbnQnO1xuaW1wb3J0IHNlcnZlclNlcnZpY2VNYW5hZ2VyIGZyb20gJy4vc2VydmVyU2VydmljZU1hbmFnZXInO1xuXG4vLyBAdG9kbyAtIG1vdmUgaW50byBvc2Mgc2VydmljZS5cbmNvbnN0IG9zY0xpc3RlbmVycyA9IFtdO1xuXG4vKipcbiAqIFNldCBvZiBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnMgZGVmaW5lZCBieSBhIHBhcnRpY3VsYXIgYXBwbGljYXRpb24uXG4gKiBUaGVzZSBwYXJhbWV0ZXJzIHR5cGljYWxseSBpbmNsdXNkIGEgc2V0dXAgYW5kIGNvbnRyb2wgcGFyYW1ldGVycyB2YWx1ZXMuXG4gKi9cbmNvbnN0IGV4YW1wbGVBcHBDb25maWcgPSB7XG4gIGFwcE5hbWU6ICdTb3VuZHdvcmtzJywgLy8gdGl0bGUgb2YgdGhlIGFwcGxpY2F0aW9uIChmb3IgPHRpdGxlPiB0YWcpXG4gIHZlcnNpb246ICcwLjAuMScsIC8vIHZlcnNpb24gb2YgdGhlIGFwcGxpY2F0aW9uIChhbGxvdyB0byBieXBhc3MgYnJvd3NlciBjYWNoZSlcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbc2V0dXA9e31dIC0gU2V0dXAgZGVmaW5pbmcgZGltZW5zaW9ucyBhbmQgcHJlZGVmaW5lZCBwb3NpdGlvbnMgKGxhYmVscyBhbmQvb3IgY29vcmRpbmF0ZXMpLlxuICAgKiBAYXR0cmlidXRlIHtPYmplY3R9IFtzZXR1cC5hcmVhPW51bGxdIC0gVGhlIGRpbWVuc2lvbnMgb2YgdGhlIGFyZWEuXG4gICAqIEBhdHRyaWJ1dGUge051bWJlcn0gW3NldHVwLmFyZWEuaGVpZ2h0XSAtIFRoZSBoZWlnaHQgb2YgdGhlIGFyZWEuXG4gICAqIEBhdHRyaWJ1dGUge051bWJlcn0gW3NldHVwLmFyZWEud2lkdGhdIC0gVGhlIHdpZHRoIG9mIHRoZSBhcmVhLlxuICAgKiBAYXR0cmlidXRlIHtTdHJpbmd9IFtzZXR1cC5hcmVhLmJhY2tncm91bmRdIC0gVGhlIG9wdGlvbm5hbCBiYWNrZ3JvdW5kIChpbWFnZSkgb2YgdGhlIGFyZWEuXG4gICAqIEBhdHRyaWJ1dGUge0FycmF5PFN0cmluZz59IFtzZXR1cC5sYWJlbHNdIC0gTGlzdCBvZiBwcmVkZWZpbmVkIGxhYmVscy5cbiAgICogQGF0dHJpYnV0ZSB7QXJyYXk8QXJyYXk+fSBbc2V0dXAuY29vcmRpbmF0ZXNdIC0gTGlzdCBvZiBwcmVkZWZpbmVkIGNvb3JkaW5hdGVzXG4gICAqICBnaXZlbiBhcyBhbiBhcnJheSBgW3g6TnVtYmVyLCB5Ok51bWJlcl1gLlxuICAgKiBAYXR0cmlidXRlIHtOdW1iZXJ9IFtzZXR1cC5jYXBhY2l0eT1JbmZpbml0eV0gLSBNYXhpbXVtIG51bWJlciBvZiBwbGFjZXNcbiAgICogIChtYXkgbGltaXQgb3IgYmUgbGltaXRlZCBieSB0aGUgbnVtYmVyIG9mIGxhYmVscyBhbmQvb3IgY29vcmRpbmF0ZXMgZGVmaW5lZCBieSB0aGUgc2V0dXApLlxuICAgKiBAdHRyaWJ1dGUge051bWJlcn0gW3NldHVwLm1heENsaWVudHNQZXJQb3NpdGlvbj0xXSAtIFRoZSBtYXhpbXVtIG51bWJlciBvZiBjbGllbnRzXG4gICAqICBhbGxvd2VkIGluIG9uZSBwb3NpdGlvbi5cbiAgICovXG4gIHNldHVwOiB7XG4gICAgYXJlYToge1xuICAgICAgd2lkdGg6IDEwLFxuICAgICAgaGVpZ2h0OiAxMCxcbiAgICAgIGJhY2tncm91bmQ6IHVuZGVmaW5lZCxcbiAgICB9LFxuICAgIGxhYmVsczogdW5kZWZpbmVkLFxuICAgIGNvb3JkaW5hdGVzOiB1bmRlZmluZWQsXG4gICAgbWF4Q2xpZW50c1BlclBvc2l0aW9uOiAxLFxuICAgIGNhcGFjaXR5OiBJbmZpbml0eSxcbiAgfSxcbiAgY29udHJvbFBhcmFtZXRlcnM6IHtcbiAgICB0ZW1wbzogMTIwLCAvLyB0ZW1wbyBpbiBCUE1cbiAgICB2b2x1bWU6IDAsIC8vIG1hc3RlciB2b2x1bWUgaW4gZEJcbiAgfSxcbn07XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzIG9mIHRoZSBTb3VuZHdvcmtzIGZyYW1ld29yay5cbiAqIFRoZXNlIHBhcmFtZXRlcnMgYWxsb3cgZm9yIGNvbmZpZ3VyaW5nIGNvbXBvbmVudHMgb2YgdGhlIGZyYW1ld29yayBzdWNoIGFzIEV4cHJlc3MgYW5kIFNvY2tldElPLlxuICovXG5jb25zdCBkZWZhdWx0RndDb25maWcgPSB7XG4gIHB1YmxpY0ZvbGRlcjogcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdwdWJsaWMnKSxcbiAgdGVtcGxhdGVGb2xkZXI6IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAndmlld3MnKSxcbiAgZGVmYXVsdENsaWVudDogJ3BsYXllcicsXG4gIGFzc2V0c0RvbWFpbjogJycsIC8vIG92ZXJyaWRlIHRvIGRvd25sb2FkIGFzc2V0cyBmcm9tIGEgZGlmZmVyZW50IHNlcnZldXIgKG5naW54KVxuICBzb2NrZXRJTzoge1xuICAgIHVybDogJycsXG4gICAgdHJhbnNwb3J0czogWyd3ZWJzb2NrZXQnXSxcbiAgICBwaW5nVGltZW91dDogNjAwMDAsIC8vIGNvbmZpZ3VyZSBjbGllbnQgc2lkZSB0b28gP1xuICAgIHBpbmdJbnRlcnZhbDogNTAwMDAsIC8vIGNvbmZpZ3VyZSBjbGllbnQgc2lkZSB0b28gP1xuICAgIC8vIEBub3RlOiBFbmdpbmVJTyBkZWZhdWx0c1xuICAgIC8vIHBpbmdUaW1lb3V0OiAzMDAwLFxuICAgIC8vIHBpbmdJbnRlcnZhbDogMTAwMCxcbiAgICAvLyB1cGdyYWRlVGltZW91dDogMTAwMDAsXG4gICAgLy8gbWF4SHR0cEJ1ZmZlclNpemU6IDEwRTcsXG4gIH0sXG59O1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gcGFyYW1ldGVycyBvZiB0aGUgU291bmR3b3JrcyBmcmFtZXdvcmsuXG4gKiBUaGVzZSBwYXJhbWV0ZXJzIGFsbG93IGZvciBjb25maWd1cmluZyBjb21wb25lbnRzIG9mIHRoZSBmcmFtZXdvcmsgc3VjaCBhcyBFeHByZXNzIGFuZCBTb2NrZXRJTy5cbiAqL1xuY29uc3QgZGVmYXVsdEVudkNvbmZpZyA9IHtcbiAgcG9ydDogODAwMCxcbiAgLy8gb3NjOiB7XG4gIC8vICAgcmVjZWl2ZUFkZHJlc3M6ICcxMjcuMC4wLjEnLFxuICAvLyAgIHJlY2VpdmVQb3J0OiA1NzEyMSxcbiAgLy8gICBzZW5kQWRkcmVzczogJzEyNy4wLjAuMScsXG4gIC8vICAgc2VuZFBvcnQ6IDU3MTIwLFxuICAvLyB9LFxuICBvc2M6IG51bGwsXG4gIGxvZ2dlcjoge1xuICAgIG5hbWU6ICdzb3VuZHdvcmtzJyxcbiAgICBsZXZlbDogJ2luZm8nLFxuICAgIHN0cmVhbXM6IFt7XG4gICAgICBsZXZlbDogJ2luZm8nLFxuICAgICAgc3RyZWFtOiBwcm9jZXNzLnN0ZG91dCxcbiAgICB9LCAvKntcbiAgICAgIGxldmVsOiAnaW5mbycsXG4gICAgICBwYXRoOiBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ2xvZ3MnLCAnc291bmR3b3Jrcy5sb2cnKSxcbiAgICB9Ki9dXG4gIH1cbn07XG5cbi8qKlxuICogVGhlIGBzZXJ2ZXJgIG9iamVjdCBjb250YWlucyB0aGUgYmFzaWMgbWV0aG9kcyBvZiB0aGUgc2VydmVyLlxuICogRm9yIGluc3RhbmNlLCB0aGlzIG9iamVjdCBhbGxvd3Mgc2V0dGluZyB1cCwgY29uZmlndXJpbmcgYW5kIHN0YXJ0aW5nIHRoZSBzZXJ2ZXIgd2l0aCB0aGUgbWV0aG9kIGBzdGFydGAgd2hpbGUgdGhlIG1ldGhvZCBgbWFwYCBhbGxvd3MgZm9yIG1hbmFnaW5nIHRoZSBtYXBwaW5nIGJldHdlZW4gZGlmZmVyZW50IHR5cGVzIG9mIGNsaWVudHMgYW5kIHRoZWlyIHJlcXVpcmVkIHNlcnZlciBtb2R1bGVzLlxuICogQHR5cGUge09iamVjdH1cbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuXG4gIC8qKlxuICAgKiBXZWJTb2NrZXQgc2VydmVyLlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaW86IG51bGwsXG5cbiAgLyoqXG4gICAqIEV4cHJlc3MgYXBwbGljYXRpb25cbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG4gIGV4cHJlc3NBcHA6IG51bGwsXG4gIC8qKlxuICAgKiBIdHRwIHNlcnZlclxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgaHR0cFNlcnZlcjogbnVsbCxcblxuICAvKipcbiAgICogQ29uZmlndXJhdGlvbiBpbmZvcm1hdGlvbnMuXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xuICBjb25maWc6IHt9LFxuXG4gIC8qKlxuICAgKiBPU0Mgb2JqZWN0LlxuICAgKiBAdG9kbyAtIE1vdmUgaW50byBzZXJ2aWNlXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBvc2M6IG51bGwsXG5cbiAgLyoqXG4gICAqIE1hcHBpbmcgYmV0d2VlbiBhIGBjbGllbnRUeXBlYCBhbmQgaXRzIHJlbGF0ZWQgYWN0aXZpdGllc1xuICAgKi9cbiAgX21hcHM6IHt9LFxuXG4gIC8qKlxuICAgKiBBY3Rpdml0aWVzIHRvIGJlIHN0YXJ0ZWRcbiAgICovXG4gIF9hY3Rpdml0aWVzOiBuZXcgU2V0KCksXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIHNlcnZlciB3aXRoIHRoZSBnaXZlbiBjb25maWcgb2JqZWN0cy5cbiAgICogQHBhcmFtIHsuLi5PYmplY3R9IGNvbmZpZ3MgLSBPYmplY3Qgb2YgYXBwbGljYXRpb24gY29uZmlndXJhdGlvbi5cbiAgICpcbiAgICogQHRvZG8gLSByZXdyaXRlIGRvYyBwcm9wZXJseSBmb3IgdGhpcyBtZXRob2QuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbYXBwQ29uZmlnPXt9XSBBcHBsaWNhdGlvbiBjb25maWd1cmF0aW9uIG9wdGlvbnMuXG4gICAqIEBhdHRyaWJ1dGUge1N0cmluZ30gW2FwcENvbmZpZy5wdWJsaWNGb2xkZXI9Jy4vcHVibGljJ10gUGF0aCB0byB0aGUgcHVibGljIGZvbGRlci5cbiAgICogQGF0dHJpYnV0ZSB7T2JqZWN0fSBbYXBwQ29uZmlnLnNvY2tldElPPXt9XSBzb2NrZXQuaW8gb3B0aW9ucy4gVGhlIHNvY2tldC5pbyBjb25maWcgb2JqZWN0IGNhbiBoYXZlIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAgICogLSBgdHJhbnNwb3J0czpTdHJpbmdgOiBjb21tdW5pY2F0aW9uIHRyYW5zcG9ydCAoZGVmYXVsdHMgdG8gYCd3ZWJzb2NrZXQnYCk7XG4gICAqIC0gYHBpbmdUaW1lb3V0Ok51bWJlcmA6IHRpbWVvdXQgKGluIG1pbGxpc2Vjb25kcykgYmVmb3JlIHRyeWluZyB0byByZWVzdGFibGlzaCBhIGNvbm5lY3Rpb24gYmV0d2VlbiBhIGxvc3QgY2xpZW50IGFuZCBhIHNlcnZlciAoZGVmYXV0bHMgdG8gYDYwMDAwYCk7XG4gICAqIC0gYHBpbmdJbnRlcnZhbDpOdW1iZXJgOiB0aW1lIGludGVydmFsIChpbiBtaWxsaXNlY29uZHMpIHRvIHNlbmQgYSBwaW5nIHRvIGEgY2xpZW50IHRvIGNoZWNrIHRoZSBjb25uZWN0aW9uIChkZWZhdWx0cyB0byBgNTAwMDBgKS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtlbnZDb25maWc9e31dIEVudmlyb25tZW50IGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAgICogQGF0dHJpYnV0ZSB7TnVtYmVyfSBbZW52Q29uZmlnLnBvcnQ9ODAwMF0gUG9ydCBvZiB0aGUgSFRUUCBzZXJ2ZXIuXG4gICAqIEBhdHRyaWJ1dGUge09iamVjdH0gW2VudkNvbmZpZy5vc2M9e31dIE9TQyBvcHRpb25zLiBUaGUgT1NDIGNvbmZpZyBvYmplY3QgY2FuIGhhdmUgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICAgKiAtIGBsb2NhbEFkZHJlc3M6U3RyaW5nYDogYWRkcmVzcyBvZiB0aGUgbG9jYWwgbWFjaGluZSB0byByZWNlaXZlIE9TQyBtZXNzYWdlcyAoZGVmYXVsdHMgdG8gYCcxMjcuMC4wLjEnYCk7XG4gICAqIC0gYGxvY2FsUG9ydDpOdW1iZXJgOiBwb3J0IG9mIHRoZSBsb2NhbCBtYWNoaW5lIHRvIHJlY2VpdmUgT1NDIG1lc3NhZ2VzIChkZWZhdWx0cyB0byBgNTcxMjFgKTtcbiAgICogLSBgcmVtb3RlQWRkcmVzczpTdHJpbmdgOiBhZGRyZXNzIG9mIHRoZSBkZXZpY2UgdG8gc2VuZCBkZWZhdWx0IE9TQyBtZXNzYWdlcyB0byAoZGVmYXVsdHMgdG8gYCcxMjcuMC4wLjEnYCk7XG4gICAqIC0gYHJlbW90ZVBvcnQ6TnVtYmVyYDogcG9ydCBvZiB0aGUgZGV2aWNlIHRvIHNlbmQgZGVmYXVsdCBPU0MgbWVzc2FnZXMgdG8gKGRlZmF1bHRzIHRvIGA1NzEyMGApLlxuICAgKi9cbiAgaW5pdCguLi5jb25maWdzKSB7XG4gICAgICAgIC8vIG1lcmdlIGRlZmF1bHQgY29uZmlndXJhdGlvbiBvYmplY3RzXG4gICAgdGhpcy5jb25maWcgPSBPYmplY3QuYXNzaWduKHRoaXMuY29uZmlnLCBleGFtcGxlQXBwQ29uZmlnLCBkZWZhdWx0RndDb25maWcsIGRlZmF1bHRFbnZDb25maWcpO1xuICAgIC8vIG1lcmdlIGdpdmVuIGNvbmZpZ3VyYXRpb25zIG9iamVjdHMgd2l0aCBkZWZhdWx0cyAoMSBsZXZlbCBkZXB0aClcbiAgICBjb25maWdzLmZvckVhY2goKGNvbmZpZykgPT4ge1xuICAgICAgZm9yIChsZXQga2V5IGluIGNvbmZpZykge1xuICAgICAgICBjb25zdCBlbnRyeSA9IGNvbmZpZ1trZXldO1xuICAgICAgICBpZiAodHlwZW9mIGVudHJ5ID09PSAnb2JqZWN0JyAmJiBlbnRyeSAhPT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMuY29uZmlnW2tleV0gPSB0aGlzLmNvbmZpZ1trZXldIHx8wqB7fTtcbiAgICAgICAgICB0aGlzLmNvbmZpZ1trZXldID0gT2JqZWN0LmFzc2lnbih0aGlzLmNvbmZpZ1trZXldLCBlbnRyeSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5jb25maWdba2V5XSA9IGVudHJ5O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBzZXJ2ZXI6XG4gICAqIC0gbGF1bmNoIHRoZSBIVFRQIHNlcnZlci5cbiAgICogLSBsYXVuY2ggdGhlIHNvY2tldCBzZXJ2ZXIuXG4gICAqIC0gc3RhcnQgYWxsIHJlZ2lzdGVyZWQgYWN0aXZpdGllcy5cbiAgICogLSBkZWZpbmUgcm91dGVzIGFuZCBhc3NvY2lhdGUgY2xpZW50IHR5cGVzIGFuZCBhY3Rpdml0aWVzLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBjb25maWd1cmUgZXhwcmVzcyBhbmQgaHR0cCBzZXJ2ZXJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgY29uc3QgZXhwcmVzc0FwcCA9IG5ldyBleHByZXNzKCk7XG4gICAgZXhwcmVzc0FwcC5zZXQoJ3BvcnQnLCBwcm9jZXNzLmVudi5QT1JUIHx8IHRoaXMuY29uZmlnLnBvcnQpO1xuICAgIGV4cHJlc3NBcHAuc2V0KCd2aWV3IGVuZ2luZScsICdlanMnKTtcbiAgICBleHByZXNzQXBwLnVzZShleHByZXNzLnN0YXRpYyh0aGlzLmNvbmZpZy5wdWJsaWNGb2xkZXIpKTtcblxuICAgIGNvbnN0IGh0dHBTZXJ2ZXIgPSBodHRwLmNyZWF0ZVNlcnZlcihleHByZXNzQXBwKTtcbiAgICBodHRwU2VydmVyLmxpc3RlbihleHByZXNzQXBwLmdldCgncG9ydCcpLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHVybCA9IGBodHRwOi8vMTI3LjAuMC4xOiR7ZXhwcmVzc0FwcC5nZXQoJ3BvcnQnKX1gO1xuICAgICAgY29uc29sZS5sb2coJ1tIVFRQIFNFUlZFUl0gU2VydmVyIGxpc3RlbmluZyBvbicsIHVybCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmV4cHJlc3NBcHAgPSBleHByZXNzQXBwO1xuICAgIHRoaXMuaHR0cFNlcnZlciA9IGh0dHBTZXJ2ZXI7XG5cbiAgICB0aGlzLmlvID0gbmV3IElPKGh0dHBTZXJ2ZXIsIHRoaXMuY29uZmlnLnNvY2tldElPKTtcbiAgICBzb2NrZXRzLmluaXRpYWxpemUodGhpcy5pbyk7XG4gICAgbG9nZ2VyLmluaXRpYWxpemUodGhpcy5jb25maWcubG9nZ2VyKTtcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gc3RhcnQgYWxsIGFjdGl2aXRpZXMgYW5kIGNyZWF0ZSByb3V0ZXNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgdGhpcy5fYWN0aXZpdGllcy5mb3JFYWNoKChhY3Rpdml0eSkgPT4gYWN0aXZpdHkuc3RhcnQoKSk7XG4gICAgLy8gbWFwIGBjbGllbnRUeXBlYCB0byB0aGVpciByZXNwZWN0aXZlIGFjdGl2aXRpZXNcbiAgICBmb3IgKGxldCBjbGllbnRUeXBlIGluIHRoaXMuX21hcHMpIHtcbiAgICAgIGNvbnN0IGFjdGl2aXR5ID0gdGhpcy5fbWFwc1tjbGllbnRUeXBlXTtcbiAgICAgIHRoaXMuX21hcChjbGllbnRUeXBlLCBhY3Rpdml0eSk7XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBAdG9kbyAtIG1vdmUgaW50byBhIHByb3BlciBzZXJ2aWNlLlxuICAgIC8vIGNvbmZpZ3VyZSBPU0MgLSBzaG91bGQgYmUgb3B0aW9ubmFsXG4gICAgaWYgKHRoaXMuY29uZmlnLm9zYykge1xuICAgICAgY29uc3Qgb3NjQ29uZmlnID0gdGhpcy5jb25maWcub3NjO1xuXG4gICAgICB0aGlzLm9zYyA9IG5ldyBvc2MuVURQUG9ydCh7XG4gICAgICAgIC8vIFRoaXMgaXMgdGhlIHBvcnQgd2UncmUgbGlzdGVuaW5nIG9uLlxuICAgICAgICBsb2NhbEFkZHJlc3M6IG9zY0NvbmZpZy5yZWNlaXZlQWRkcmVzcyxcbiAgICAgICAgbG9jYWxQb3J0OiBvc2NDb25maWcucmVjZWl2ZVBvcnQsXG4gICAgICAgIC8vIFRoaXMgaXMgdGhlIHBvcnQgd2UgdXNlIHRvIHNlbmQgbWVzc2FnZXMuXG4gICAgICAgIHJlbW90ZUFkZHJlc3M6IG9zY0NvbmZpZy5zZW5kQWRkcmVzcyxcbiAgICAgICAgcmVtb3RlUG9ydDogb3NjQ29uZmlnLnNlbmRQb3J0LFxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMub3NjLm9uKCdyZWFkeScsICgpID0+IHtcbiAgICAgICAgY29uc3QgcmVjZWl2ZSA9IGAke29zY0NvbmZpZy5yZWNlaXZlQWRkcmVzc306JHtvc2NDb25maWcucmVjZWl2ZVBvcnR9YDtcbiAgICAgICAgY29uc3Qgc2VuZCA9IGAke29zY0NvbmZpZy5zZW5kQWRkcmVzc306JHtvc2NDb25maWcuc2VuZFBvcnR9YDtcbiAgICAgICAgY29uc29sZS5sb2coYFtPU0Mgb3ZlciBVRFBdIFJlY2VpdmluZyBvbiAke3JlY2VpdmV9YCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGBbT1NDIG92ZXIgVURQXSBTZW5kaW5nIG9uICR7c2VuZH1gKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm9zYy5vbignbWVzc2FnZScsIChvc2NNc2cpID0+IHtcbiAgICAgICAgY29uc3QgYWRkcmVzcyA9IG9zY01zZy5hZGRyZXNzO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3NjTGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGFkZHJlc3MgPT09IG9zY0xpc3RlbmVyc1tpXS53aWxkY2FyZClcbiAgICAgICAgICAgIG9zY0xpc3RlbmVyc1tpXS5jYWxsYmFjayhvc2NNc2cpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5vc2Mub3BlbigpO1xuICAgIH1cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICB9LFxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc2VydmljZSBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIFRoZSBpZGVudGlmaWVyIG9mIHRoZSBzZXJ2aWNlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFRoZSBvcHRpb25zIHRvIGNvbmZpZ3VyZSB0aGUgc2VydmljZS5cbiAgICovXG4gIHJlcXVpcmUoaWQsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gc2VydmVyU2VydmljZU1hbmFnZXIucmVxdWlyZShpZCwgb3B0aW9ucyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uIHVzZWQgYnkgYWN0aXZpdGllcyB0byByZWdpc3RlcmVkIHRoZWlyIGNvbmNlcm5lZCBjbGllbnQgdHlwZSBpbnRvIHRoZSBzZXJ2ZXJcbiAgICogQHBhcmFtIHtBcnJheTxTdHJpbmc+fSBjbGllbnRUeXBlcyAtIEFuIGFycmF5IG9mIGNsaWVudCB0eXBlLlxuICAgKiBAcGFyYW0ge0FjdGl2aXR5fSBhY3Rpdml0eSAtIFRoZSBhY3Rpdml0eSBjb25jZXJuZWQgd2l0aCB0aGUgZ2l2ZW4gYGNsaWVudFR5cGVzYC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNldE1hcChjbGllbnRUeXBlcywgYWN0aXZpdHkpIHtcbiAgICBjbGllbnRUeXBlcy5mb3JFYWNoKChjbGllbnRUeXBlKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuX21hcHNbY2xpZW50VHlwZV0pXG4gICAgICAgIHRoaXMuX21hcHNbY2xpZW50VHlwZV0gPSBuZXcgU2V0KCk7XG5cbiAgICAgIHRoaXMuX21hcHNbY2xpZW50VHlwZV0uYWRkKGFjdGl2aXR5KTtcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogRnVuY3Rpb24gdXNlZCBieSBhY3Rpdml0aWVzIHRvIHJlZ2lzdGVyIHRoZW1zZWx2ZXMgYXMgYWN0aXZlIGFjdGl2aXRpZXNcbiAgICogQHBhcmFtIHtBY3Rpdml0eX0gYWN0aXZpdHlcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNldEFjdGl2aXR5KGFjdGl2aXR5KSB7XG4gICAgdGhpcy5fYWN0aXZpdGllcy5hZGQoYWN0aXZpdHkpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZSB0aGF0IHRoZSBjbGllbnRzIG9mIHR5cGUgYGNsaWVudFR5cGVgIHJlcXVpcmUgdGhlIG1vZHVsZXMgYC4uLm1vZHVsZXNgIG9uIHRoZSBzZXJ2ZXIgc2lkZS5cbiAgICogQWRkaXRpb25hbGx5LCB0aGlzIG1ldGhvZCByb3V0ZXMgdGhlIGNvbm5lY3Rpb25zIGZyb20gdGhlIGNvcnJlc3BvbmRpbmcgVVJMIHRvIHRoZSBjb3JyZXNwb25kaW5nIHZpZXcuXG4gICAqIE1vcmUgc3BlY2lmaWNhbGx5OlxuICAgKiAtIEEgY2xpZW50IGNvbm5lY3RpbmcgdG8gdGhlIHNlcnZlciB0aHJvdWdoIHRoZSByb290IFVSTCBgaHR0cDovL215LnNlcnZlci5hZGRyZXNzOnBvcnQvYCBpcyBjb25zaWRlcmVkIGFzIGEgYCdwbGF5ZXInYCBjbGllbnQgYW5kIGRpc3BsYXlzIHRoZSB2aWV3IGBwbGF5ZXIuZWpzYDtcbiAgICogLSBBIGNsaWVudCBjb25uZWN0aW5nIHRvIHRoZSBzZXJ2ZXIgdGhyb3VnaCB0aGUgVVJMIGBodHRwOi8vbXkuc2VydmVyLmFkZHJlc3M6cG9ydC9jbGllbnRUeXBlYCBpcyBjb25zaWRlcmVkIGFzIGEgYGNsaWVudFR5cGVgIGNsaWVudCwgYW5kIGRpc3BsYXlzIHRoZSB2aWV3IGBjbGllbnRUeXBlLmVqc2AuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjbGllbnRUeXBlIENsaWVudCB0eXBlIChhcyBkZWZpbmVkIGJ5IHRoZSBtZXRob2Qge0BsaW5rIGNsaWVudC5pbml0fSBvbiB0aGUgY2xpZW50IHNpZGUpLlxuICAgKiBAcGFyYW0gey4uLkNsaWVudE1vZHVsZX0gbW9kdWxlcyBNb2R1bGVzIHRvIG1hcCB0byB0aGF0IGNsaWVudCB0eXBlLlxuICAgKi9cbiAgX21hcChjbGllbnRUeXBlLCBtb2R1bGVzKSB7XG4gICAgLy8gQHRvZG8gLSBhbGxvdyB0byBwYXNzIHNvbWUgdmFyaWFibGUgaW4gdGhlIHVybCAtPiBkZWZpbmUgaG93IGJpbmQgaXQgdG8gc29ja2V0cy4uLlxuICAgIGNvbnN0IHVybCA9IChjbGllbnRUeXBlICE9PSB0aGlzLmNvbmZpZy5kZWZhdWx0Q2xpZW50KSA/IGAvJHtjbGllbnRUeXBlfWAgOiAnLyc7XG5cbiAgICAvLyB1c2UgdGVtcGxhdGUgd2l0aCBgY2xpZW50VHlwZWAgbmFtZSBvciBkZWZhdWx0IGlmIG5vdCBkZWZpbmVkXG4gICAgY29uc3QgY2xpZW50VG1wbCA9IHBhdGguam9pbih0aGlzLmNvbmZpZy50ZW1wbGF0ZUZvbGRlciwgYCR7Y2xpZW50VHlwZX0uZWpzYCk7XG4gICAgY29uc3QgZGVmYXVsdFRtcGwgPSBwYXRoLmpvaW4odGhpcy5jb25maWcudGVtcGxhdGVGb2xkZXIsIGBkZWZhdWx0LmVqc2ApO1xuICAgIGNvbnN0IHRlbXBsYXRlID0gZnMuZXhpc3RzU3luYyhjbGllbnRUbXBsKSA/IGNsaWVudFRtcGwgOiBkZWZhdWx0VG1wbDtcblxuICAgIGNvbnN0IHRtcGxTdHJpbmcgPSBmcy5yZWFkRmlsZVN5bmModGVtcGxhdGUsIHsgZW5jb2Rpbmc6ICd1dGY4JyB9KTtcbiAgICBjb25zdCB0bXBsID0gZWpzLmNvbXBpbGUodG1wbFN0cmluZyk7XG5cbiAgICB0aGlzLmV4cHJlc3NBcHAuZ2V0KHVybCwgKHJlcSwgcmVzKSA9PiB7XG4gICAgICByZXMuc2VuZCh0bXBsKHtcbiAgICAgICAgc29ja2V0SU86IEpTT04uc3RyaW5naWZ5KHRoaXMuY29uZmlnLnNvY2tldElPKSxcbiAgICAgICAgYXBwTmFtZTogdGhpcy5jb25maWcuYXBwTmFtZSxcbiAgICAgICAgY2xpZW50VHlwZTogY2xpZW50VHlwZSxcbiAgICAgICAgZGVmYXVsdFR5cGU6IHRoaXMuY29uZmlnLmRlZmF1bHRDbGllbnQsXG4gICAgICAgIGFzc2V0c0RvbWFpbjogdGhpcy5jb25maWcuYXNzZXRzRG9tYWluLFxuICAgICAgfSkpO1xuXG4gICAgICAvLyB0aGlzLmlvLm9mKGNsaWVudFR5cGUpLm9uKCdjb25uZWN0aW9uJywgdGhpcy5fb25Db25uZWN0aW9uKGNsaWVudFR5cGUsIG1vZHVsZXMpKTtcbiAgICB9KTtcblxuICAgIC8vIHdhaXQgZm9yIHNvY2tldCBjb25ubmVjdGlvblxuICAgIHRoaXMuaW8ub2YoY2xpZW50VHlwZSkub24oJ2Nvbm5lY3Rpb24nLCB0aGlzLl9vbkNvbm5lY3Rpb24oY2xpZW50VHlwZSwgbW9kdWxlcykpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTb2NrZXQgY29ubmVjdGlvbiBjYWxsYmFjay5cbiAgICovXG4gIF9vbkNvbm5lY3Rpb24oY2xpZW50VHlwZSwgYWN0aXZpdGllcykge1xuICAgIHJldHVybiAoc29ja2V0KSA9PiB7XG4gICAgICBjb25zdCBjbGllbnQgPSBuZXcgQ2xpZW50KGNsaWVudFR5cGUsIHNvY2tldCk7XG4gICAgICBhY3Rpdml0aWVzLmZvckVhY2goKGFjdGl2aXR5KSA9PiBhY3Rpdml0eS5jb25uZWN0KGNsaWVudCkpO1xuXG4gICAgICAvLyBnbG9iYWwgbGlmZWN5Y2xlIG9mIHRoZSBjbGllbnRcbiAgICAgIHNvY2tldHMucmVjZWl2ZShjbGllbnQsICdkaXNjb25uZWN0JywgKCkgPT4ge1xuICAgICAgICBhY3Rpdml0aWVzLmZvckVhY2goKGFjdGl2aXR5KSA9PiBhY3Rpdml0eS5kaXNjb25uZWN0KGNsaWVudCkpO1xuICAgICAgICAvLyBAdG9kbyAtIHNob3VsZCByZW1vdmUgYWxsIGxpc3RlbmVycyBvbiB0aGUgY2xpZW50XG4gICAgICAgIGNsaWVudC5kZXN0cm95KCk7XG4gICAgICAgIGxvZ2dlci5pbmZvKHsgc29ja2V0LCBjbGllbnRUeXBlIH0sICdkaXNjb25uZWN0Jyk7XG4gICAgICB9KTtcblxuICAgICAgLy8gQHRvZG8gLSByZWZhY3RvciBoYW5kc2hha2UgYW5kIHVpZCBkZWZpbml0aW9uLlxuICAgICAgc29ja2V0cy5zZW5kKGNsaWVudCwgJ2NsaWVudDpzdGFydCcsIGNsaWVudC51aWQpOyAvLyB0aGUgc2VydmVyIGlzIHJlYWR5XG4gICAgICBsb2dnZXIuaW5mbyh7IHNvY2tldCwgY2xpZW50VHlwZSB9LCAnY29ubmVjdGlvbicpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogU2VuZCBhbiBPU0MgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IHdpbGRjYXJkIFdpbGRjYXJkIG9mIHRoZSBPU0MgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtBcnJheX0gYXJncyBBcmd1bWVudHMgb2YgdGhlIE9TQyBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW3VybD1udWxsXSBVUkwgdG8gc2VuZCB0aGUgT1NDIG1lc3NhZ2UgdG8gKGlmIG5vdCBzcGVjaWZpZWQsIHVzZXMgdGhlIGFkZHJlc3MgZGVmaW5lZCBpbiB0aGUgT1NDIGNvbmZpZyBvciBpbiB0aGUgb3B0aW9ucyBvZiB0aGUge0BsaW5rIHNlcnZlci5zdGFydH0gbWV0aG9kKS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtwb3J0PW51bGxdIFBvcnQgdG8gc2VuZCB0aGUgbWVzc2FnZSB0byAoaWYgbm90IHNwZWNpZmllZCwgdXNlcyB0aGUgcG9ydCBkZWZpbmVkIGluIHRoZSBPU0MgY29uZmlnIG9yIGluIHRoZSBvcHRpb25zIG9mIHRoZSB7QGxpbmsgc2VydmVyLnN0YXJ0fSBtZXRob2QpLlxuICAgKi9cbiAgc2VuZE9TQyh3aWxkY2FyZCwgYXJncywgdXJsID0gbnVsbCwgcG9ydCA9IG51bGwpIHtcbiAgICBjb25zdCBvc2NNc2cgPSB7XG4gICAgICBhZGRyZXNzOiB3aWxkY2FyZCxcbiAgICAgIGFyZ3M6IGFyZ3NcbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgIGlmICh1cmwgJiYgcG9ydCkge1xuICAgICAgICB0aGlzLm9zYy5zZW5kKG9zY01zZywgdXJsLCBwb3J0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub3NjLnNlbmQob3NjTXNnKTsgLy8gdXNlIGRlZmF1bHRzIChhcyBkZWZpbmVkIGluIHRoZSBjb25maWcpXG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5sb2coJ0Vycm9yIHdoaWxlIHNlbmRpbmcgT1NDIG1lc3NhZ2U6JywgZSk7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBMaXN0ZW4gZm9yIE9TQyBtZXNzYWdlIGFuZCBleGVjdXRlIGEgY2FsbGJhY2sgZnVuY3Rpb24uXG4gICAqIFRoZSBzZXJ2ZXIgbGlzdGVucyB0byBPU0MgbWVzc2FnZXMgYXQgdGhlIGFkZHJlc3MgYW5kIHBvcnQgZGVmaW5lZCBpbiB0aGUgY29uZmlnIG9yIGluIHRoZSBvcHRpb25zIG9mIHRoZSB7QGxpbmsgc2VydmVyLnN0YXJ0fSBtZXRob2QuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB3aWxkY2FyZCBXaWxkY2FyZCBvZiB0aGUgT1NDIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIENhbGxiYWNrIGZ1bmN0aW9uIGV4ZWN1dGVkIHdoZW4gdGhlIE9TQyBtZXNzYWdlIGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgcmVjZWl2ZU9TQyh3aWxkY2FyZCwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBvc2NMaXN0ZW5lciA9IHtcbiAgICAgIHdpbGRjYXJkOiB3aWxkY2FyZCxcbiAgICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICAgIH07XG5cbiAgICBvc2NMaXN0ZW5lcnMucHVzaChvc2NMaXN0ZW5lcik7XG4gIH1cbn07XG4iXX0=