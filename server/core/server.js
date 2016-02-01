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

// globals
// @todo hide this into client

var oscListeners = [];

/**
 * Set of configuration parameters defined by a particular application.
 * These parameters typically inclusd a setup and control parameters values.
 */
var exampleAppConfig = {
  appName: 'Soundworks', // title of the application (for <title> tag)
  version: '0.0.1', // version of the application (bypass browser cache)
  playerSetup: {
    width: 10, // width of the setup area in meters
    height: 10, // height of the setup area in meters
    labels: undefined, // predefined labels (optional)
    coordinates: undefined, // predefined coordinates on the setup area (optional)
    background: undefined },
  // URL of a background image fitting the setup area (optional)
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

  setMap: function setMap(clientTypes, activity) {
    var _this = this;

    clientTypes.forEach(function (clientType) {
      if (!_this._maps[clientType]) _this._maps[clientType] = new _Set();

      _this._maps[clientType].add(activity);
      _this._activities.add(activity);
    });
  },

  /**
   * Start the server.
   * @todo - rewrite doc for this method
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
  start: function start() {
    var _this2 = this;

    // merge default configuration objects
    this.config = _Object$assign(this.config, exampleAppConfig, defaultFwConfig, defaultEnvConfig);
    // merge given configurations objects with defaults

    for (var _len = arguments.length, configs = Array(_len), _key = 0; _key < _len; _key++) {
      configs[_key] = arguments[_key];
    }

    configs.forEach(function (config) {
      for (var key in config) {
        var entry = config[key];
        if (typeof entry === 'object' && entry !== null) {
          _this2.config[key] = _this2.config[key] || {};
          _this2.config[key] = _Object$assign(_this2.config[key], entry);
        } else {
          _this2.config[key] = entry;
        }
      }
    });

    // configure express and http server
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

    // start all activities
    this._activities.forEach(function (activity) {
      return activity.start();
    });
    // map `clientType` to their repsective modules
    for (var clientType in this._maps) {
      var modules = this._maps[clientType];
      this._map(clientType, modules);
    }

    // @todo - move into a proper service.
    // configure OSC - should be optionnal
    if (this.config.osc) {
      this.osc = new _osc2['default'].UDPPort({
        // This is the port we're listening on.
        localAddress: this.config.osc.receiveAddress,
        localPort: this.config.osc.receivePort,
        // This is the port we use to send messages.
        remoteAddress: this.config.osc.sendAddress,
        remotePort: this.config.osc.sendPort
      });

      this.osc.on('ready', function () {
        var receive = _this2.config.osc.receiveAddress + ':' + _this2.config.osc.receivePort;
        var send = _this2.config.osc.sendAddress + ':' + _this2.config.osc.sendPort;
        console.log('[OSC over UDP] Receiving on ' + receive);
        console.log('[OSC over UDP] Sending on ' + send);
      });

      this.osc.on('message', function (oscMsg) {
        var address = oscMsg.address;

        for (var i = 0; i < oscListeners.length; i++) {
          if (address === oscListeners[i].wildcard) oscListeners[i].callback(oscMsg);
        }
      });

      this.osc.open();
    }
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
    var _this3 = this;

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
        socketIO: JSON.stringify(_this3.config.socketIO),
        appName: _this3.config.appName,
        clientType: clientType,
        defaultType: _this3.config.defaultClient,
        assetsDomain: _this3.config.assetsDomain
      }));
    });

    // wait for socket connnection
    this.io.of(clientType).on('connection', this._onConnection(clientType, modules));
  },

  _onConnection: function _onConnection(clientType, modules) {
    return function (socket) {
      var client = new _Client2['default'](clientType, socket);
      modules.forEach(function (mod) {
        return mod.connect(client);
      });

      // global lifecycle of the client
      _sockets2['default'].receive(client, 'disconnect', function () {
        modules.forEach(function (mod) {
          return mod.disconnect(client);
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvY29yZS9zZXJ2ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O3VCQUFvQixXQUFXOzs7O21CQUNmLEtBQUs7Ozs7dUJBQ0QsU0FBUzs7OztrQkFDZCxJQUFJOzs7O29CQUNGLE1BQU07Ozs7MkJBQ0osaUJBQWlCOzs7O3dCQUNyQixXQUFXOzs7O21CQUNWLEtBQUs7Ozs7b0JBQ0osTUFBTTs7OztzQkFDSixVQUFVOzs7Ozs7O0FBSzdCLElBQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQzs7Ozs7O0FBTXhCLElBQU0sZ0JBQWdCLEdBQUc7QUFDdkIsU0FBTyxFQUFFLFlBQVk7QUFDckIsU0FBTyxFQUFFLE9BQU87QUFDaEIsYUFBVyxFQUFFO0FBQ1gsU0FBSyxFQUFFLEVBQUU7QUFDVCxVQUFNLEVBQUUsRUFBRTtBQUNWLFVBQU0sRUFBRSxTQUFTO0FBQ2pCLGVBQVcsRUFBRSxTQUFTO0FBQ3RCLGNBQVUsRUFBRSxTQUFTLEVBQ3RCOztBQUNELG1CQUFpQixFQUFFO0FBQ2pCLFNBQUssRUFBRSxHQUFHO0FBQ1YsVUFBTSxFQUFFLENBQUMsRUFDVjtDQUNGLENBQUM7Ozs7Ozs7QUFNRixJQUFNLGVBQWUsR0FBRztBQUN0QixjQUFZLEVBQUUsa0JBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxRQUFRLENBQUM7QUFDaEQsZ0JBQWMsRUFBRSxrQkFBSyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLE9BQU8sQ0FBQztBQUNqRCxlQUFhLEVBQUUsUUFBUTtBQUN2QixjQUFZLEVBQUUsRUFBRTtBQUNoQixVQUFRLEVBQUU7QUFDUixPQUFHLEVBQUUsRUFBRTtBQUNQLGNBQVUsRUFBRSxDQUFDLFdBQVcsQ0FBQztBQUN6QixlQUFXLEVBQUUsS0FBSztBQUNsQixnQkFBWSxFQUFFLEtBQUssRUFNcEI7Q0FDRixDQUFDOzs7Ozs7Ozs7Ozs7QUFNRixJQUFNLGdCQUFnQixHQUFHO0FBQ3ZC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QVEsRUFBRTtBQUM3QixRQUFNLFdBQVcsR0FBRztBQUNsQixjQUFRLEVBQUUsUUFBUTtBQUNsQixjQUFRLEVBQUUsUUFBUTtLQUNuQixDQUFDOztBQUVGLGdCQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0dBQ2hDO0NBQ0YiLCJmaWxlIjoic3JjL3NlcnZlci9jb3JlL3NlcnZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBzb2NrZXRzIGZyb20gJy4vc29ja2V0cyc7XG5pbXBvcnQgZWpzIGZyb20gJ2Vqcyc7XG5pbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgaHR0cCBmcm9tICdodHRwJztcbmltcG9ydCBsb2dnZXIgZnJvbSAnLi4vdXRpbHMvbG9nZ2VyJztcbmltcG9ydCBJTyBmcm9tICdzb2NrZXQuaW8nO1xuaW1wb3J0IG9zYyBmcm9tICdvc2MnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgQ2xpZW50IGZyb20gJy4vQ2xpZW50JztcblxuLy8gZ2xvYmFsc1xuLy8gQHRvZG8gaGlkZSB0aGlzIGludG8gY2xpZW50XG5cbmNvbnN0IG9zY0xpc3RlbmVycyA9IFtdO1xuXG4vKipcbiAqIFNldCBvZiBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnMgZGVmaW5lZCBieSBhIHBhcnRpY3VsYXIgYXBwbGljYXRpb24uXG4gKiBUaGVzZSBwYXJhbWV0ZXJzIHR5cGljYWxseSBpbmNsdXNkIGEgc2V0dXAgYW5kIGNvbnRyb2wgcGFyYW1ldGVycyB2YWx1ZXMuXG4gKi9cbmNvbnN0IGV4YW1wbGVBcHBDb25maWcgPSB7XG4gIGFwcE5hbWU6ICdTb3VuZHdvcmtzJywgLy8gdGl0bGUgb2YgdGhlIGFwcGxpY2F0aW9uIChmb3IgPHRpdGxlPiB0YWcpXG4gIHZlcnNpb246ICcwLjAuMScsIC8vIHZlcnNpb24gb2YgdGhlIGFwcGxpY2F0aW9uIChieXBhc3MgYnJvd3NlciBjYWNoZSlcbiAgcGxheWVyU2V0dXA6IHtcbiAgICB3aWR0aDogMTAsIC8vIHdpZHRoIG9mIHRoZSBzZXR1cCBhcmVhIGluIG1ldGVyc1xuICAgIGhlaWdodDogMTAsIC8vIGhlaWdodCBvZiB0aGUgc2V0dXAgYXJlYSBpbiBtZXRlcnNcbiAgICBsYWJlbHM6IHVuZGVmaW5lZCwgLy8gcHJlZGVmaW5lZCBsYWJlbHMgKG9wdGlvbmFsKVxuICAgIGNvb3JkaW5hdGVzOiB1bmRlZmluZWQsIC8vIHByZWRlZmluZWQgY29vcmRpbmF0ZXMgb24gdGhlIHNldHVwIGFyZWEgKG9wdGlvbmFsKVxuICAgIGJhY2tncm91bmQ6IHVuZGVmaW5lZCwgLy8gVVJMIG9mIGEgYmFja2dyb3VuZCBpbWFnZSBmaXR0aW5nIHRoZSBzZXR1cCBhcmVhIChvcHRpb25hbClcbiAgfSxcbiAgY29udHJvbFBhcmFtZXRlcnM6IHtcbiAgICB0ZW1wbzogMTIwLCAvLyB0ZW1wbyBpbiBCUE1cbiAgICB2b2x1bWU6IDAsIC8vIG1hc3RlciB2b2x1bWUgaW4gZEJcbiAgfSxcbn07XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzIG9mIHRoZSBTb3VuZHdvcmtzIGZyYW1ld29yay5cbiAqIFRoZXNlIHBhcmFtZXRlcnMgYWxsb3cgZm9yIGNvbmZpZ3VyaW5nIGNvbXBvbmVudHMgb2YgdGhlIGZyYW1ld29yayBzdWNoIGFzIEV4cHJlc3MgYW5kIFNvY2tldElPLlxuICovXG5jb25zdCBkZWZhdWx0RndDb25maWcgPSB7XG4gIHB1YmxpY0ZvbGRlcjogcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdwdWJsaWMnKSxcbiAgdGVtcGxhdGVGb2xkZXI6IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAndmlld3MnKSxcbiAgZGVmYXVsdENsaWVudDogJ3BsYXllcicsXG4gIGFzc2V0c0RvbWFpbjogJycsIC8vIG92ZXJyaWRlIHRvIGRvd25sb2FkIGFzc2V0cyBmcm9tIGEgZGlmZmVyZW50IHNlcnZldXIgKG5naW54KVxuICBzb2NrZXRJTzoge1xuICAgIHVybDogJycsXG4gICAgdHJhbnNwb3J0czogWyd3ZWJzb2NrZXQnXSxcbiAgICBwaW5nVGltZW91dDogNjAwMDAsIC8vIGNvbmZpZ3VyZSBjbGllbnQgc2lkZSB0b28gP1xuICAgIHBpbmdJbnRlcnZhbDogNTAwMDAsIC8vIGNvbmZpZ3VyZSBjbGllbnQgc2lkZSB0b28gP1xuICAgIC8vIEBub3RlOiBFbmdpbmVJTyBkZWZhdWx0c1xuICAgIC8vIHBpbmdUaW1lb3V0OiAzMDAwLFxuICAgIC8vIHBpbmdJbnRlcnZhbDogMTAwMCxcbiAgICAvLyB1cGdyYWRlVGltZW91dDogMTAwMDAsXG4gICAgLy8gbWF4SHR0cEJ1ZmZlclNpemU6IDEwRTcsXG4gIH0sXG59O1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gcGFyYW1ldGVycyBvZiB0aGUgU291bmR3b3JrcyBmcmFtZXdvcmsuXG4gKiBUaGVzZSBwYXJhbWV0ZXJzIGFsbG93IGZvciBjb25maWd1cmluZyBjb21wb25lbnRzIG9mIHRoZSBmcmFtZXdvcmsgc3VjaCBhcyBFeHByZXNzIGFuZCBTb2NrZXRJTy5cbiAqL1xuY29uc3QgZGVmYXVsdEVudkNvbmZpZyA9IHtcbiAgcG9ydDogODAwMCxcbiAgLy8gb3NjOiB7XG4gIC8vICAgcmVjZWl2ZUFkZHJlc3M6ICcxMjcuMC4wLjEnLFxuICAvLyAgIHJlY2VpdmVQb3J0OiA1NzEyMSxcbiAgLy8gICBzZW5kQWRkcmVzczogJzEyNy4wLjAuMScsXG4gIC8vICAgc2VuZFBvcnQ6IDU3MTIwLFxuICAvLyB9LFxuICBvc2M6IG51bGwsXG4gIGxvZ2dlcjoge1xuICAgIG5hbWU6ICdzb3VuZHdvcmtzJyxcbiAgICBsZXZlbDogJ2luZm8nLFxuICAgIHN0cmVhbXM6IFt7XG4gICAgICBsZXZlbDogJ2luZm8nLFxuICAgICAgc3RyZWFtOiBwcm9jZXNzLnN0ZG91dCxcbiAgICB9LCAvKntcbiAgICAgIGxldmVsOiAnaW5mbycsXG4gICAgICBwYXRoOiBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ2xvZ3MnLCAnc291bmR3b3Jrcy5sb2cnKSxcbiAgICB9Ki9dXG4gIH1cbn07XG5cbi8qKlxuICogVGhlIGBzZXJ2ZXJgIG9iamVjdCBjb250YWlucyB0aGUgYmFzaWMgbWV0aG9kcyBvZiB0aGUgc2VydmVyLlxuICogRm9yIGluc3RhbmNlLCB0aGlzIG9iamVjdCBhbGxvd3Mgc2V0dGluZyB1cCwgY29uZmlndXJpbmcgYW5kIHN0YXJ0aW5nIHRoZSBzZXJ2ZXIgd2l0aCB0aGUgbWV0aG9kIGBzdGFydGAgd2hpbGUgdGhlIG1ldGhvZCBgbWFwYCBhbGxvd3MgZm9yIG1hbmFnaW5nIHRoZSBtYXBwaW5nIGJldHdlZW4gZGlmZmVyZW50IHR5cGVzIG9mIGNsaWVudHMgYW5kIHRoZWlyIHJlcXVpcmVkIHNlcnZlciBtb2R1bGVzLlxuICogQHR5cGUge09iamVjdH1cbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuXG4gIC8qKlxuICAgKiBXZWJTb2NrZXQgc2VydmVyLlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaW86IG51bGwsXG5cbiAgLyoqXG4gICAqIEV4cHJlc3MgYXBwbGljYXRpb25cbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG4gIGV4cHJlc3NBcHA6IG51bGwsXG4gIC8qKlxuICAgKiBIdHRwIHNlcnZlclxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgaHR0cFNlcnZlcjogbnVsbCxcblxuICAvKipcbiAgICogQ29uZmlndXJhdGlvbiBpbmZvcm1hdGlvbnMuXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xuICBjb25maWc6IHt9LFxuXG4gIC8qKlxuICAgKiBPU0Mgb2JqZWN0LlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgb3NjOiBudWxsLFxuXG4gIC8qKlxuICAgKiBNYXBwaW5nIGJldHdlZW4gYSBgY2xpZW50VHlwZWAgYW5kIGl0cyByZWxhdGVkIGFjdGl2aXRpZXNcbiAgICovXG4gIF9tYXBzOiB7fSxcblxuICAvKipcbiAgICogQWN0aXZpdGllcyB0byBiZSBzdGFydGVkXG4gICAqL1xuICBfYWN0aXZpdGllczogbmV3IFNldCgpLFxuXG4gIHNldE1hcChjbGllbnRUeXBlcywgYWN0aXZpdHkpIHtcbiAgICBjbGllbnRUeXBlcy5mb3JFYWNoKChjbGllbnRUeXBlKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuX21hcHNbY2xpZW50VHlwZV0pXG4gICAgICAgIHRoaXMuX21hcHNbY2xpZW50VHlwZV0gPSBuZXcgU2V0KCk7XG5cbiAgICAgIHRoaXMuX21hcHNbY2xpZW50VHlwZV0uYWRkKGFjdGl2aXR5KTtcbiAgICAgIHRoaXMuX2FjdGl2aXRpZXMuYWRkKGFjdGl2aXR5KTtcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogU3RhcnQgdGhlIHNlcnZlci5cbiAgICogQHRvZG8gLSByZXdyaXRlIGRvYyBmb3IgdGhpcyBtZXRob2RcbiAgICogQHBhcmFtIHtPYmplY3R9IFthcHBDb25maWc9e31dIEFwcGxpY2F0aW9uIGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAgICogQGF0dHJpYnV0ZSB7U3RyaW5nfSBbYXBwQ29uZmlnLnB1YmxpY0ZvbGRlcj0nLi9wdWJsaWMnXSBQYXRoIHRvIHRoZSBwdWJsaWMgZm9sZGVyLlxuICAgKiBAYXR0cmlidXRlIHtPYmplY3R9IFthcHBDb25maWcuc29ja2V0SU89e31dIHNvY2tldC5pbyBvcHRpb25zLiBUaGUgc29ja2V0LmlvIGNvbmZpZyBvYmplY3QgY2FuIGhhdmUgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICAgKiAtIGB0cmFuc3BvcnRzOlN0cmluZ2A6IGNvbW11bmljYXRpb24gdHJhbnNwb3J0IChkZWZhdWx0cyB0byBgJ3dlYnNvY2tldCdgKTtcbiAgICogLSBgcGluZ1RpbWVvdXQ6TnVtYmVyYDogdGltZW91dCAoaW4gbWlsbGlzZWNvbmRzKSBiZWZvcmUgdHJ5aW5nIHRvIHJlZXN0YWJsaXNoIGEgY29ubmVjdGlvbiBiZXR3ZWVuIGEgbG9zdCBjbGllbnQgYW5kIGEgc2VydmVyIChkZWZhdXRscyB0byBgNjAwMDBgKTtcbiAgICogLSBgcGluZ0ludGVydmFsOk51bWJlcmA6IHRpbWUgaW50ZXJ2YWwgKGluIG1pbGxpc2Vjb25kcykgdG8gc2VuZCBhIHBpbmcgdG8gYSBjbGllbnQgdG8gY2hlY2sgdGhlIGNvbm5lY3Rpb24gKGRlZmF1bHRzIHRvIGA1MDAwMGApLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW2VudkNvbmZpZz17fV0gRW52aXJvbm1lbnQgY29uZmlndXJhdGlvbiBvcHRpb25zLlxuICAgKiBAYXR0cmlidXRlIHtOdW1iZXJ9IFtlbnZDb25maWcucG9ydD04MDAwXSBQb3J0IG9mIHRoZSBIVFRQIHNlcnZlci5cbiAgICogQGF0dHJpYnV0ZSB7T2JqZWN0fSBbZW52Q29uZmlnLm9zYz17fV0gT1NDIG9wdGlvbnMuIFRoZSBPU0MgY29uZmlnIG9iamVjdCBjYW4gaGF2ZSB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gICAqIC0gYGxvY2FsQWRkcmVzczpTdHJpbmdgOiBhZGRyZXNzIG9mIHRoZSBsb2NhbCBtYWNoaW5lIHRvIHJlY2VpdmUgT1NDIG1lc3NhZ2VzIChkZWZhdWx0cyB0byBgJzEyNy4wLjAuMSdgKTtcbiAgICogLSBgbG9jYWxQb3J0Ok51bWJlcmA6IHBvcnQgb2YgdGhlIGxvY2FsIG1hY2hpbmUgdG8gcmVjZWl2ZSBPU0MgbWVzc2FnZXMgKGRlZmF1bHRzIHRvIGA1NzEyMWApO1xuICAgKiAtIGByZW1vdGVBZGRyZXNzOlN0cmluZ2A6IGFkZHJlc3Mgb2YgdGhlIGRldmljZSB0byBzZW5kIGRlZmF1bHQgT1NDIG1lc3NhZ2VzIHRvIChkZWZhdWx0cyB0byBgJzEyNy4wLjAuMSdgKTtcbiAgICogLSBgcmVtb3RlUG9ydDpOdW1iZXJgOiBwb3J0IG9mIHRoZSBkZXZpY2UgdG8gc2VuZCBkZWZhdWx0IE9TQyBtZXNzYWdlcyB0byAoZGVmYXVsdHMgdG8gYDU3MTIwYCkuXG4gICAqL1xuICBzdGFydCguLi5jb25maWdzKSB7XG4gICAgLy8gbWVyZ2UgZGVmYXVsdCBjb25maWd1cmF0aW9uIG9iamVjdHNcbiAgICB0aGlzLmNvbmZpZyA9IE9iamVjdC5hc3NpZ24odGhpcy5jb25maWcsIGV4YW1wbGVBcHBDb25maWcsIGRlZmF1bHRGd0NvbmZpZywgZGVmYXVsdEVudkNvbmZpZyk7XG4gICAgLy8gbWVyZ2UgZ2l2ZW4gY29uZmlndXJhdGlvbnMgb2JqZWN0cyB3aXRoIGRlZmF1bHRzXG4gICAgY29uZmlncy5mb3JFYWNoKChjb25maWcpID0+IHtcbiAgICAgIGZvciAobGV0IGtleSBpbiBjb25maWcpIHtcbiAgICAgICAgY29uc3QgZW50cnkgPSBjb25maWdba2V5XTtcbiAgICAgICAgaWYgKHR5cGVvZiBlbnRyeSA9PT0gJ29iamVjdCcgJiYgZW50cnkgIT09IG51bGwpIHtcbiAgICAgICAgICB0aGlzLmNvbmZpZ1trZXldID0gdGhpcy5jb25maWdba2V5XSB8fMKge307XG4gICAgICAgICAgdGhpcy5jb25maWdba2V5XSA9IE9iamVjdC5hc3NpZ24odGhpcy5jb25maWdba2V5XSwgZW50cnkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuY29uZmlnW2tleV0gPSBlbnRyeTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gY29uZmlndXJlIGV4cHJlc3MgYW5kIGh0dHAgc2VydmVyXG4gICAgY29uc3QgZXhwcmVzc0FwcCA9IG5ldyBleHByZXNzKCk7XG4gICAgZXhwcmVzc0FwcC5zZXQoJ3BvcnQnLCBwcm9jZXNzLmVudi5QT1JUIHx8IHRoaXMuY29uZmlnLnBvcnQpO1xuICAgIGV4cHJlc3NBcHAuc2V0KCd2aWV3IGVuZ2luZScsICdlanMnKTtcbiAgICBleHByZXNzQXBwLnVzZShleHByZXNzLnN0YXRpYyh0aGlzLmNvbmZpZy5wdWJsaWNGb2xkZXIpKTtcblxuICAgIGNvbnN0IGh0dHBTZXJ2ZXIgPSBodHRwLmNyZWF0ZVNlcnZlcihleHByZXNzQXBwKTtcbiAgICBodHRwU2VydmVyLmxpc3RlbihleHByZXNzQXBwLmdldCgncG9ydCcpLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHVybCA9IGBodHRwOi8vMTI3LjAuMC4xOiR7ZXhwcmVzc0FwcC5nZXQoJ3BvcnQnKX1gO1xuICAgICAgY29uc29sZS5sb2coJ1tIVFRQIFNFUlZFUl0gU2VydmVyIGxpc3RlbmluZyBvbicsIHVybCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmV4cHJlc3NBcHAgPSBleHByZXNzQXBwO1xuICAgIHRoaXMuaHR0cFNlcnZlciA9IGh0dHBTZXJ2ZXI7XG5cbiAgICB0aGlzLmlvID0gbmV3IElPKGh0dHBTZXJ2ZXIsIHRoaXMuY29uZmlnLnNvY2tldElPKTtcbiAgICBzb2NrZXRzLmluaXRpYWxpemUodGhpcy5pbyk7XG4gICAgbG9nZ2VyLmluaXRpYWxpemUodGhpcy5jb25maWcubG9nZ2VyKTtcblxuICAgIC8vIHN0YXJ0IGFsbCBhY3Rpdml0aWVzXG4gICAgdGhpcy5fYWN0aXZpdGllcy5mb3JFYWNoKChhY3Rpdml0eSkgPT4gYWN0aXZpdHkuc3RhcnQoKSk7XG4gICAgLy8gbWFwIGBjbGllbnRUeXBlYCB0byB0aGVpciByZXBzZWN0aXZlIG1vZHVsZXNcbiAgICBmb3IgKGxldCBjbGllbnRUeXBlIGluIHRoaXMuX21hcHMpIHtcbiAgICAgIGNvbnN0IG1vZHVsZXMgPSB0aGlzLl9tYXBzW2NsaWVudFR5cGVdO1xuICAgICAgdGhpcy5fbWFwKGNsaWVudFR5cGUsIG1vZHVsZXMpO1xuICAgIH1cblxuICAgIC8vIEB0b2RvIC0gbW92ZSBpbnRvIGEgcHJvcGVyIHNlcnZpY2UuXG4gICAgLy8gY29uZmlndXJlIE9TQyAtIHNob3VsZCBiZSBvcHRpb25uYWxcbiAgICBpZiAodGhpcy5jb25maWcub3NjKSB7XG4gICAgICB0aGlzLm9zYyA9IG5ldyBvc2MuVURQUG9ydCh7XG4gICAgICAgIC8vIFRoaXMgaXMgdGhlIHBvcnQgd2UncmUgbGlzdGVuaW5nIG9uLlxuICAgICAgICBsb2NhbEFkZHJlc3M6IHRoaXMuY29uZmlnLm9zYy5yZWNlaXZlQWRkcmVzcyxcbiAgICAgICAgbG9jYWxQb3J0OiB0aGlzLmNvbmZpZy5vc2MucmVjZWl2ZVBvcnQsXG4gICAgICAgIC8vIFRoaXMgaXMgdGhlIHBvcnQgd2UgdXNlIHRvIHNlbmQgbWVzc2FnZXMuXG4gICAgICAgIHJlbW90ZUFkZHJlc3M6IHRoaXMuY29uZmlnLm9zYy5zZW5kQWRkcmVzcyxcbiAgICAgICAgcmVtb3RlUG9ydDogdGhpcy5jb25maWcub3NjLnNlbmRQb3J0LFxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMub3NjLm9uKCdyZWFkeScsICgpID0+IHtcbiAgICAgICAgY29uc3QgcmVjZWl2ZSA9IGAke3RoaXMuY29uZmlnLm9zYy5yZWNlaXZlQWRkcmVzc306JHt0aGlzLmNvbmZpZy5vc2MucmVjZWl2ZVBvcnR9YDtcbiAgICAgICAgY29uc3Qgc2VuZCA9IGAke3RoaXMuY29uZmlnLm9zYy5zZW5kQWRkcmVzc306JHt0aGlzLmNvbmZpZy5vc2Muc2VuZFBvcnR9YDtcbiAgICAgICAgY29uc29sZS5sb2coYFtPU0Mgb3ZlciBVRFBdIFJlY2VpdmluZyBvbiAke3JlY2VpdmV9YCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGBbT1NDIG92ZXIgVURQXSBTZW5kaW5nIG9uICR7c2VuZH1gKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm9zYy5vbignbWVzc2FnZScsIChvc2NNc2cpID0+IHtcbiAgICAgICAgY29uc3QgYWRkcmVzcyA9IG9zY01zZy5hZGRyZXNzO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3NjTGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGFkZHJlc3MgPT09IG9zY0xpc3RlbmVyc1tpXS53aWxkY2FyZClcbiAgICAgICAgICAgIG9zY0xpc3RlbmVyc1tpXS5jYWxsYmFjayhvc2NNc2cpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5vc2Mub3BlbigpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogSW5kaWNhdGUgdGhhdCB0aGUgY2xpZW50cyBvZiB0eXBlIGBjbGllbnRUeXBlYCByZXF1aXJlIHRoZSBtb2R1bGVzIGAuLi5tb2R1bGVzYCBvbiB0aGUgc2VydmVyIHNpZGUuXG4gICAqIEFkZGl0aW9uYWxseSwgdGhpcyBtZXRob2Qgcm91dGVzIHRoZSBjb25uZWN0aW9ucyBmcm9tIHRoZSBjb3JyZXNwb25kaW5nIFVSTCB0byB0aGUgY29ycmVzcG9uZGluZyB2aWV3LlxuICAgKiBNb3JlIHNwZWNpZmljYWxseTpcbiAgICogLSBBIGNsaWVudCBjb25uZWN0aW5nIHRvIHRoZSBzZXJ2ZXIgdGhyb3VnaCB0aGUgcm9vdCBVUkwgYGh0dHA6Ly9teS5zZXJ2ZXIuYWRkcmVzczpwb3J0L2AgaXMgY29uc2lkZXJlZCBhcyBhIGAncGxheWVyJ2AgY2xpZW50IGFuZCBkaXNwbGF5cyB0aGUgdmlldyBgcGxheWVyLmVqc2A7XG4gICAqIC0gQSBjbGllbnQgY29ubmVjdGluZyB0byB0aGUgc2VydmVyIHRocm91Z2ggdGhlIFVSTCBgaHR0cDovL215LnNlcnZlci5hZGRyZXNzOnBvcnQvY2xpZW50VHlwZWAgaXMgY29uc2lkZXJlZCBhcyBhIGBjbGllbnRUeXBlYCBjbGllbnQsIGFuZCBkaXNwbGF5cyB0aGUgdmlldyBgY2xpZW50VHlwZS5lanNgLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2xpZW50VHlwZSBDbGllbnQgdHlwZSAoYXMgZGVmaW5lZCBieSB0aGUgbWV0aG9kIHtAbGluayBjbGllbnQuaW5pdH0gb24gdGhlIGNsaWVudCBzaWRlKS5cbiAgICogQHBhcmFtIHsuLi5DbGllbnRNb2R1bGV9IG1vZHVsZXMgTW9kdWxlcyB0byBtYXAgdG8gdGhhdCBjbGllbnQgdHlwZS5cbiAgICovXG4gIF9tYXAoY2xpZW50VHlwZSwgbW9kdWxlcykge1xuICAgIC8vIEB0b2RvIC0gYWxsb3cgdG8gcGFzcyBzb21lIHZhcmlhYmxlIGluIHRoZSB1cmwgLT4gZGVmaW5lIGhvdyBiaW5kIGl0IHRvIHNvY2tldHMuLi5cbiAgICBjb25zdCB1cmwgPSAoY2xpZW50VHlwZSAhPT0gdGhpcy5jb25maWcuZGVmYXVsdENsaWVudCkgPyBgLyR7Y2xpZW50VHlwZX1gIDogJy8nO1xuXG4gICAgLy8gdXNlIHRlbXBsYXRlIHdpdGggYGNsaWVudFR5cGVgIG5hbWUgb3IgZGVmYXVsdCBpZiBub3QgZGVmaW5lZFxuICAgIGNvbnN0IGNsaWVudFRtcGwgPSBwYXRoLmpvaW4odGhpcy5jb25maWcudGVtcGxhdGVGb2xkZXIsIGAke2NsaWVudFR5cGV9LmVqc2ApO1xuICAgIGNvbnN0IGRlZmF1bHRUbXBsID0gcGF0aC5qb2luKHRoaXMuY29uZmlnLnRlbXBsYXRlRm9sZGVyLCBgZGVmYXVsdC5lanNgKTtcbiAgICBjb25zdCB0ZW1wbGF0ZSA9IGZzLmV4aXN0c1N5bmMoY2xpZW50VG1wbCkgPyBjbGllbnRUbXBsIDogZGVmYXVsdFRtcGw7XG5cbiAgICBjb25zdCB0bXBsU3RyaW5nID0gZnMucmVhZEZpbGVTeW5jKHRlbXBsYXRlLCB7IGVuY29kaW5nOiAndXRmOCcgfSk7XG4gICAgY29uc3QgdG1wbCA9IGVqcy5jb21waWxlKHRtcGxTdHJpbmcpO1xuXG4gICAgdGhpcy5leHByZXNzQXBwLmdldCh1cmwsIChyZXEsIHJlcykgPT4ge1xuICAgICAgcmVzLnNlbmQodG1wbCh7XG4gICAgICAgIHNvY2tldElPOiBKU09OLnN0cmluZ2lmeSh0aGlzLmNvbmZpZy5zb2NrZXRJTyksXG4gICAgICAgIGFwcE5hbWU6IHRoaXMuY29uZmlnLmFwcE5hbWUsXG4gICAgICAgIGNsaWVudFR5cGU6IGNsaWVudFR5cGUsXG4gICAgICAgIGRlZmF1bHRUeXBlOiB0aGlzLmNvbmZpZy5kZWZhdWx0Q2xpZW50LFxuICAgICAgICBhc3NldHNEb21haW46IHRoaXMuY29uZmlnLmFzc2V0c0RvbWFpbixcbiAgICAgIH0pKTtcbiAgICB9KTtcblxuICAgIC8vIHdhaXQgZm9yIHNvY2tldCBjb25ubmVjdGlvblxuICAgIHRoaXMuaW8ub2YoY2xpZW50VHlwZSkub24oJ2Nvbm5lY3Rpb24nLCB0aGlzLl9vbkNvbm5lY3Rpb24oY2xpZW50VHlwZSwgbW9kdWxlcykpO1xuICB9LFxuXG4gIF9vbkNvbm5lY3Rpb24oY2xpZW50VHlwZSwgbW9kdWxlcykge1xuICAgIHJldHVybiAoc29ja2V0KSA9PiB7XG4gICAgICBjb25zdCBjbGllbnQgPSBuZXcgQ2xpZW50KGNsaWVudFR5cGUsIHNvY2tldCk7XG4gICAgICBtb2R1bGVzLmZvckVhY2goKG1vZCkgPT4gbW9kLmNvbm5lY3QoY2xpZW50KSk7XG5cbiAgICAgIC8vIGdsb2JhbCBsaWZlY3ljbGUgb2YgdGhlIGNsaWVudFxuICAgICAgc29ja2V0cy5yZWNlaXZlKGNsaWVudCwgJ2Rpc2Nvbm5lY3QnLCAoKSA9PiB7XG4gICAgICAgIG1vZHVsZXMuZm9yRWFjaCgobW9kKSA9PiBtb2QuZGlzY29ubmVjdChjbGllbnQpKTtcbiAgICAgICAgY2xpZW50LmRlc3Ryb3koKTtcbiAgICAgICAgbG9nZ2VyLmluZm8oeyBzb2NrZXQsIGNsaWVudFR5cGUgfSwgJ2Rpc2Nvbm5lY3QnKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBAdG9kbyAtIHJlZmFjdG9yIGhhbmRzaGFrZSBhbmQgdWlkIGRlZmluaXRpb24uXG4gICAgICBzb2NrZXRzLnNlbmQoY2xpZW50LCAnY2xpZW50OnN0YXJ0JywgY2xpZW50LnVpZCk7IC8vIHRoZSBzZXJ2ZXIgaXMgcmVhZHlcbiAgICAgIGxvZ2dlci5pbmZvKHsgc29ja2V0LCBjbGllbnRUeXBlIH0sICdjb25uZWN0aW9uJyk7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBTZW5kIGFuIE9TQyBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gd2lsZGNhcmQgV2lsZGNhcmQgb2YgdGhlIE9TQyBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge0FycmF5fSBhcmdzIEFyZ3VtZW50cyBvZiB0aGUgT1NDIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbdXJsPW51bGxdIFVSTCB0byBzZW5kIHRoZSBPU0MgbWVzc2FnZSB0byAoaWYgbm90IHNwZWNpZmllZCwgdXNlcyB0aGUgYWRkcmVzcyBkZWZpbmVkIGluIHRoZSBPU0MgY29uZmlnIG9yIGluIHRoZSBvcHRpb25zIG9mIHRoZSB7QGxpbmsgc2VydmVyLnN0YXJ0fSBtZXRob2QpLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW3BvcnQ9bnVsbF0gUG9ydCB0byBzZW5kIHRoZSBtZXNzYWdlIHRvIChpZiBub3Qgc3BlY2lmaWVkLCB1c2VzIHRoZSBwb3J0IGRlZmluZWQgaW4gdGhlIE9TQyBjb25maWcgb3IgaW4gdGhlIG9wdGlvbnMgb2YgdGhlIHtAbGluayBzZXJ2ZXIuc3RhcnR9IG1ldGhvZCkuXG4gICAqL1xuICBzZW5kT1NDKHdpbGRjYXJkLCBhcmdzLCB1cmwgPSBudWxsLCBwb3J0ID0gbnVsbCkge1xuICAgIGNvbnN0IG9zY01zZyA9IHtcbiAgICAgIGFkZHJlc3M6IHdpbGRjYXJkLFxuICAgICAgYXJnczogYXJnc1xuICAgIH07XG5cbiAgICB0cnkge1xuICAgICAgaWYgKHVybCAmJiBwb3J0KSB7XG4gICAgICAgIHRoaXMub3NjLnNlbmQob3NjTXNnLCB1cmwsIHBvcnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vc2Muc2VuZChvc2NNc2cpOyAvLyB1c2UgZGVmYXVsdHMgKGFzIGRlZmluZWQgaW4gdGhlIGNvbmZpZylcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZygnRXJyb3Igd2hpbGUgc2VuZGluZyBPU0MgbWVzc2FnZTonLCBlKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIExpc3RlbiBmb3IgT1NDIG1lc3NhZ2UgYW5kIGV4ZWN1dGUgYSBjYWxsYmFjayBmdW5jdGlvbi5cbiAgICogVGhlIHNlcnZlciBsaXN0ZW5zIHRvIE9TQyBtZXNzYWdlcyBhdCB0aGUgYWRkcmVzcyBhbmQgcG9ydCBkZWZpbmVkIGluIHRoZSBjb25maWcgb3IgaW4gdGhlIG9wdGlvbnMgb2YgdGhlIHtAbGluayBzZXJ2ZXIuc3RhcnR9IG1ldGhvZC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHdpbGRjYXJkIFdpbGRjYXJkIG9mIHRoZSBPU0MgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGJhY2sgZnVuY3Rpb24gZXhlY3V0ZWQgd2hlbiB0aGUgT1NDIG1lc3NhZ2UgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICByZWNlaXZlT1NDKHdpbGRjYXJkLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG9zY0xpc3RlbmVyID0ge1xuICAgICAgd2lsZGNhcmQ6IHdpbGRjYXJkLFxuICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gICAgfTtcblxuICAgIG9zY0xpc3RlbmVycy5wdXNoKG9zY0xpc3RlbmVyKTtcbiAgfVxufTtcbiJdfQ==