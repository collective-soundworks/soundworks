'use strict';

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _ejs = require('ejs');

var _ejs2 = _interopRequireDefault(_ejs);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _socketIo = require('socket.io');

var _socketIo2 = _interopRequireDefault(_socketIo);

var _osc = require('osc');

var _osc2 = _interopRequireDefault(_osc);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _Client = require('./Client');

var _Client2 = _interopRequireDefault(_Client);

/**
 * The `server` object contains the basic methods of the server.
 * For instance, this object allows setting up, configuring and starting the server with the method `start` while the method `map` allows for managing the mapping between different types of clients and their required server modules.
 * Additionally, the method `broadcast` allows to send messages to all connected clients via WebSockets or OSC.
 */
var server = {
  io: null,
  start: start,
  map: map,
  broadcast: broadcast,
  envConfig: {}, // host env config informations (dev / prod)
  osc: null,
  sendOSC: sendOSC,
  receiveOSC: receiveOSC
};

var availableClientIndices = [];
var nextClientIndex = 0;
var oscListeners = [];
var expressApp = null;
var httpServer = null;

function _getClientIndex() {
  var index = -1;

  if (availableClientIndices.length > 0) {
    availableClientIndices.sort(function (a, b) {
      return a - b;
    });

    index = availableClientIndices.splice(0, 1)[0];
  } else {
    index = nextClientIndex++;
  }

  return index;
}

function _releaseClientIndex(index) {
  availableClientIndices.push(index);
}

/**
 * Starts the server.
 * @param {Object} app Express application.
 * @param {String} publicPath Public static directory of the Express app.
 * @param {Number} port Port.
 * @param {Object} [options={}] Options.
 * @param {Object} [options.socketIO={}] socket.io options. The socket.io config object can have the following properties:
 * - `transports:String`: communication transport (defaults to `'websocket'`);
 * - `pingTimeout:Number`: timeout (in milliseconds) before trying to reestablish a connection between a lost client and a server (defautls to `60000`);
 * - `pingInterval:Number`: time interval (in milliseconds) to send a ping to a client to check the connection (defaults to `50000`).
 * @param {Object} [options.osc={}] OSC options. The OSC config object can have the following properties:
 * - `localAddress:String`: address of the local machine to receive OSC messages (defaults to `'127.0.0.1'`);
 * - `localPort:Number`: port of the local machine to receive OSC messages (defaults to `57121`);
 * - `remoteAddress:String`: address of the device to send default OSC messages to (defaults to `'127.0.0.1'`);
 * - `remotePort:Number`: port of the device to send default OSC messages to (defaults to `57120`).
 * @param {Object} [options.env={}] Environnement options (set by the user, depends on the scenario).
 */
function start(app, publicPath, port) {
  var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

  var socketIOOptions = options.socketIO || {};
  var socketConfig = {
    transports: socketIOOptions.transports || ['websocket'],
    pingTimeout: socketIOOptions.pingTimeout || 60000,
    pingInterval: socketIOOptions.pingInterval || 50000
  };

  server.envConfig = options.env;

  app.set('port', process.env.PORT || port || 8000);
  app.set('view engine', 'ejs');
  app.use(_express2['default']['static'](publicPath));

  httpServer = _http2['default'].createServer(app);
  expressApp = app;

  httpServer.listen(app.get('port'), function () {
    var url = 'http://127.0.0.1:' + app.get('port');
    console.log('Server listening on', url);
  });

  // Engine IO defaults
  // this.pingTimeout = opts.pingTimeout || 3000;
  // this.pingInterval = opts.pingInterval || 1000;
  // this.upgradeTimeout = opts.upgradeTimeout || 10000;
  // this.maxHttpBufferSize = opts.maxHttpBufferSize || 10E7;

  if (httpServer) {
    server.io = new _socketIo2['default'](httpServer, socketConfig);
  }

  // OSC
  if (options.osc) {
    server.osc = new _osc2['default'].UDPPort({
      // This is the port we're listening on.
      localAddress: options.osc.localAddress || '127.0.0.1',
      localPort: options.osc.localPort || 57121,

      // This is the port we use to send messages.
      remoteAddress: options.osc.remoteAddress || '127.0.0.1',
      remotePort: options.osc.remotePort || 57120
    });

    server.osc.on('ready', function () {
      console.log('Listening for OSC over UDP on port ' + options.osc.localPort + '.');
    });

    server.osc.on('message', function (oscMsg) {
      var address = oscMsg.address;

      for (var i = 0; i < oscListeners.length; i++) {
        if (address === oscListeners[i].wildcard) oscListeners[i].callback(oscMsg);
      }
    });

    server.osc.open();
  }
}

/**
 * Indicates that the clients of type `clientType` require the modules `...modules` on the server side.
 * Additionally, this method routes the connections from the corresponding URL to the corresponding view.
 * More specifically:
 * - A client connecting to the server through the root URL `http://my.server.address:port/` is considered as a `'player'` client and displays the view `player.ejs`;
 * - A client connecting to the server through the URL `http://my.server.address:port/clientType` is considered as a `clientType` client, and displays the view `clientType.ejs`.
 * @param {String} clientType Client type (as defined by the method {@link client.init} on the client side).
 * @param {...ClientModule} modules Modules to map to that client type.
 */
function map(clientType) {
  for (var _len = arguments.length, modules = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    modules[_key - 1] = arguments[_key];
  }

  var url = '/';

  // cache compiled template
  var tmplPath = _path2['default'].join(process.cwd(), 'views', clientType + '.ejs');
  var tmplString = _fs2['default'].readFileSync(tmplPath, { encoding: 'utf8' });
  var tmpl = _ejs2['default'].compile(tmplString);

  if (clientType !== 'player') url += clientType;

  expressApp.get(url, function (req, res) {
    res.send(tmpl({ envConfig: JSON.stringify(server.envConfig) }));
  });

  server.io.of(clientType).on('connection', function (socket) {
    _logger2['default'].info({ socket: socket, clientType: clientType }, 'connection');
    var client = new _Client2['default'](clientType, socket);

    var index = _getClientIndex();
    client.index = index;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = _getIterator(modules), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var mod = _step.value;

        mod.connect(client);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator['return']) {
          _iterator['return']();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    client.receive('disconnect', function () {
      _logger2['default'].info({ socket: socket, clientType: clientType }, 'disconnect');
      for (var i = modules.length - 1; i >= 0; i--) {
        var mod = modules[i];
        mod.disconnect(client);
      }

      _releaseClientIndex(client.index);
      client.index = -1;
    });

    client.send('client:start', index); // the server is ready
  });
}

/**
 * Sends a WebSocket message to all the clients of type `clientType`.
 *
 * **Note:** on the client side, the clients receive the message with the method {@link client.receive}.
 * @param {String} clientType Client type (as defined by the method {@link client.init} on the client side).
 * @param {String} msg Name of the message to send.
 * @param {...*} args Arguments of the message (as many as needed, of any type).
 * @todo solve ... problem
 */
function broadcast(clientType, msg) {
  for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    args[_key2 - 2] = arguments[_key2];
  }

  if (server.io) {
    var _server$io$of;

    _logger2['default'].info({ clientType: clientType, channel: msg, arguments: args }, 'broadcast');
    (_server$io$of = server.io.of('/' + clientType)).emit.apply(_server$io$of, [msg].concat(args));
  }
}

/**
 * Sends an OSC message.
 * @param {String} wildcard Wildcard of the OSC message.
 * @param {Array} args Arguments of the OSC message.
 * @param {String} [url=null] URL to send the OSC message to (if not specified, uses the address defined in the OSC config or in the options of the {@link server.start} method).
 * @param {Number} [port=null] Port to send the message to (if not specified, uses the port defined in the OSC config or in the options of the {@link server.start} method).
 */
function sendOSC(wildcard, args) {
  var url = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
  var port = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

  var oscMsg = {
    address: wildcard,
    args: args
  };

  try {
    if (url && port) server.osc.send(oscMsg, url, port);else server.osc.send(oscMsg); // use defaults (as defined in the config)
  } catch (e) {
    console.log('Error while sending OSC message:', e);
  }
}

/**
 * Executes a callback function when it receives an OSC message.
 * The server listens to OSC messages at the address and port defined in the config or in the options of the {@link server.start} method.
 *
 * @param {String} wildcard Wildcard of the OSC message.
 * @param {Function} callback Callback function executed when the OSC message is received.
 */
function receiveOSC(wildcard, callback) {
  var oscListener = {
    wildcard: wildcard,
    callback: callback
  };

  oscListeners.push(oscListener);
}

exports['default'] = server;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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QUFJLEVBQUMsQ0FBQztHQUNuRDtDQUNGOzs7Ozs7Ozs7QUFTRCxTQUFTLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUEyQjtNQUF6QixHQUFHLHlEQUFHLElBQUk7TUFBRSxJQUFJLHlEQUFHLElBQUk7O0FBQ3RELE1BQU0sTUFBTSxHQUFHO0FBQ2IsV0FBTyxFQUFFLFFBQVE7QUFDakIsUUFBSSxFQUFFLElBQUk7R0FDWCxDQUFDOztBQUVGLE1BQUk7QUFDRixRQUFJLEdBQUcsSUFBSSxJQUFJLEVBQ2IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxLQUVuQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztHQUMzQixDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ1YsV0FBTyxDQUFDLEdBQUcsQ0FBQyxrQ0FBa0MsRUFBRSxDQUFDLENBQUMsQ0FBQztHQUNwRDtDQUNGOzs7Ozs7Ozs7QUFTRCxTQUFTLFVBQVUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFO0FBQ3RDLE1BQU0sV0FBVyxHQUFHO0FBQ2xCLFlBQVEsRUFBRSxRQUFRO0FBQ2xCLFlBQVEsRUFBRSxRQUFRO0dBQ25CLENBQUM7O0FBRUYsY0FBWSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztDQUNoQzs7cUJBRWMsTUFBTSIsImZpbGUiOiJzcmMvc2VydmVyL3NlcnZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBlanMgZnJvbSAnZWpzJztcbmltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBodHRwIGZyb20gJ2h0dHAnO1xuaW1wb3J0IGxvZyBmcm9tICcuL2xvZ2dlcic7XG5pbXBvcnQgSU8gZnJvbSAnc29ja2V0LmlvJztcbmltcG9ydCBvc2MgZnJvbSAnb3NjJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IENsaWVudCBmcm9tICcuL0NsaWVudCc7XG5cblxuLyoqXG4gKiBUaGUgYHNlcnZlcmAgb2JqZWN0IGNvbnRhaW5zIHRoZSBiYXNpYyBtZXRob2RzIG9mIHRoZSBzZXJ2ZXIuXG4gKiBGb3IgaW5zdGFuY2UsIHRoaXMgb2JqZWN0IGFsbG93cyBzZXR0aW5nIHVwLCBjb25maWd1cmluZyBhbmQgc3RhcnRpbmcgdGhlIHNlcnZlciB3aXRoIHRoZSBtZXRob2QgYHN0YXJ0YCB3aGlsZSB0aGUgbWV0aG9kIGBtYXBgIGFsbG93cyBmb3IgbWFuYWdpbmcgdGhlIG1hcHBpbmcgYmV0d2VlbiBkaWZmZXJlbnQgdHlwZXMgb2YgY2xpZW50cyBhbmQgdGhlaXIgcmVxdWlyZWQgc2VydmVyIG1vZHVsZXMuXG4gKiBBZGRpdGlvbmFsbHksIHRoZSBtZXRob2QgYGJyb2FkY2FzdGAgYWxsb3dzIHRvIHNlbmQgbWVzc2FnZXMgdG8gYWxsIGNvbm5lY3RlZCBjbGllbnRzIHZpYSBXZWJTb2NrZXRzIG9yIE9TQy5cbiAqL1xuY29uc3Qgc2VydmVyID0ge1xuICBpbzogbnVsbCxcbiAgc3RhcnQ6IHN0YXJ0LFxuICBtYXA6IG1hcCxcbiAgYnJvYWRjYXN0OiBicm9hZGNhc3QsXG4gIGVudkNvbmZpZzoge30sIC8vIGhvc3QgZW52IGNvbmZpZyBpbmZvcm1hdGlvbnMgKGRldiAvIHByb2QpXG4gIG9zYzogbnVsbCxcbiAgc2VuZE9TQzogc2VuZE9TQyxcbiAgcmVjZWl2ZU9TQzogcmVjZWl2ZU9TQ1xufTtcblxubGV0IGF2YWlsYWJsZUNsaWVudEluZGljZXMgPSBbXTtcbmxldCBuZXh0Q2xpZW50SW5kZXggPSAwO1xubGV0IG9zY0xpc3RlbmVycyA9IFtdO1xubGV0IGV4cHJlc3NBcHAgPSBudWxsO1xubGV0IGh0dHBTZXJ2ZXIgPSBudWxsO1xuXG5mdW5jdGlvbiBfZ2V0Q2xpZW50SW5kZXgoKSB7XG4gIHZhciBpbmRleCA9IC0xO1xuXG4gIGlmIChhdmFpbGFibGVDbGllbnRJbmRpY2VzLmxlbmd0aCA+IDApIHtcbiAgICBhdmFpbGFibGVDbGllbnRJbmRpY2VzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgcmV0dXJuIGEgLSBiO1xuICAgIH0pO1xuXG4gICAgaW5kZXggPSBhdmFpbGFibGVDbGllbnRJbmRpY2VzLnNwbGljZSgwLCAxKVswXTtcbiAgfSBlbHNlIHtcbiAgICBpbmRleCA9IG5leHRDbGllbnRJbmRleCsrO1xuICB9XG5cbiAgcmV0dXJuIGluZGV4O1xufVxuXG5mdW5jdGlvbiBfcmVsZWFzZUNsaWVudEluZGV4KGluZGV4KSB7XG4gIGF2YWlsYWJsZUNsaWVudEluZGljZXMucHVzaChpbmRleCk7XG59XG5cbi8qKlxuICogU3RhcnRzIHRoZSBzZXJ2ZXIuXG4gKiBAcGFyYW0ge09iamVjdH0gYXBwIEV4cHJlc3MgYXBwbGljYXRpb24uXG4gKiBAcGFyYW0ge1N0cmluZ30gcHVibGljUGF0aCBQdWJsaWMgc3RhdGljIGRpcmVjdG9yeSBvZiB0aGUgRXhwcmVzcyBhcHAuXG4gKiBAcGFyYW0ge051bWJlcn0gcG9ydCBQb3J0LlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLnNvY2tldElPPXt9XSBzb2NrZXQuaW8gb3B0aW9ucy4gVGhlIHNvY2tldC5pbyBjb25maWcgb2JqZWN0IGNhbiBoYXZlIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqIC0gYHRyYW5zcG9ydHM6U3RyaW5nYDogY29tbXVuaWNhdGlvbiB0cmFuc3BvcnQgKGRlZmF1bHRzIHRvIGAnd2Vic29ja2V0J2ApO1xuICogLSBgcGluZ1RpbWVvdXQ6TnVtYmVyYDogdGltZW91dCAoaW4gbWlsbGlzZWNvbmRzKSBiZWZvcmUgdHJ5aW5nIHRvIHJlZXN0YWJsaXNoIGEgY29ubmVjdGlvbiBiZXR3ZWVuIGEgbG9zdCBjbGllbnQgYW5kIGEgc2VydmVyIChkZWZhdXRscyB0byBgNjAwMDBgKTtcbiAqIC0gYHBpbmdJbnRlcnZhbDpOdW1iZXJgOiB0aW1lIGludGVydmFsIChpbiBtaWxsaXNlY29uZHMpIHRvIHNlbmQgYSBwaW5nIHRvIGEgY2xpZW50IHRvIGNoZWNrIHRoZSBjb25uZWN0aW9uIChkZWZhdWx0cyB0byBgNTAwMDBgKS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5vc2M9e31dIE9TQyBvcHRpb25zLiBUaGUgT1NDIGNvbmZpZyBvYmplY3QgY2FuIGhhdmUgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICogLSBgbG9jYWxBZGRyZXNzOlN0cmluZ2A6IGFkZHJlc3Mgb2YgdGhlIGxvY2FsIG1hY2hpbmUgdG8gcmVjZWl2ZSBPU0MgbWVzc2FnZXMgKGRlZmF1bHRzIHRvIGAnMTI3LjAuMC4xJ2ApO1xuICogLSBgbG9jYWxQb3J0Ok51bWJlcmA6IHBvcnQgb2YgdGhlIGxvY2FsIG1hY2hpbmUgdG8gcmVjZWl2ZSBPU0MgbWVzc2FnZXMgKGRlZmF1bHRzIHRvIGA1NzEyMWApO1xuICogLSBgcmVtb3RlQWRkcmVzczpTdHJpbmdgOiBhZGRyZXNzIG9mIHRoZSBkZXZpY2UgdG8gc2VuZCBkZWZhdWx0IE9TQyBtZXNzYWdlcyB0byAoZGVmYXVsdHMgdG8gYCcxMjcuMC4wLjEnYCk7XG4gKiAtIGByZW1vdGVQb3J0Ok51bWJlcmA6IHBvcnQgb2YgdGhlIGRldmljZSB0byBzZW5kIGRlZmF1bHQgT1NDIG1lc3NhZ2VzIHRvIChkZWZhdWx0cyB0byBgNTcxMjBgKS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5lbnY9e31dIEVudmlyb25uZW1lbnQgb3B0aW9ucyAoc2V0IGJ5IHRoZSB1c2VyLCBkZXBlbmRzIG9uIHRoZSBzY2VuYXJpbykuXG4gKi9cbmZ1bmN0aW9uIHN0YXJ0KGFwcCwgcHVibGljUGF0aCwgcG9ydCwgb3B0aW9ucyA9IHt9KSB7XG4gIGNvbnN0IHNvY2tldElPT3B0aW9ucyA9IChvcHRpb25zLnNvY2tldElPIHx8wqB7fSk7XG4gIGNvbnN0IHNvY2tldENvbmZpZyA9IHtcbiAgICB0cmFuc3BvcnRzOiBzb2NrZXRJT09wdGlvbnMudHJhbnNwb3J0cyB8fMKgWyd3ZWJzb2NrZXQnXSxcbiAgICBwaW5nVGltZW91dDogc29ja2V0SU9PcHRpb25zLnBpbmdUaW1lb3V0IHx8wqA2MDAwMCxcbiAgICBwaW5nSW50ZXJ2YWw6IHNvY2tldElPT3B0aW9ucy5waW5nSW50ZXJ2YWwgfHzCoDUwMDAwLFxuICB9O1xuXG4gIHNlcnZlci5lbnZDb25maWcgPSBvcHRpb25zLmVudjtcblxuICBhcHAuc2V0KCdwb3J0JywgcHJvY2Vzcy5lbnYuUE9SVCB8fCBwb3J0IHx8IDgwMDApO1xuICBhcHAuc2V0KCd2aWV3IGVuZ2luZScsICdlanMnKTtcbiAgYXBwLnVzZShleHByZXNzLnN0YXRpYyhwdWJsaWNQYXRoKSk7XG5cbiAgaHR0cFNlcnZlciA9IGh0dHAuY3JlYXRlU2VydmVyKGFwcCk7XG4gIGV4cHJlc3NBcHAgPSBhcHA7XG5cbiAgaHR0cFNlcnZlci5saXN0ZW4oYXBwLmdldCgncG9ydCcpLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgdXJsID0gJ2h0dHA6Ly8xMjcuMC4wLjE6JyArIGFwcC5nZXQoJ3BvcnQnKTtcbiAgICBjb25zb2xlLmxvZygnU2VydmVyIGxpc3RlbmluZyBvbicsIHVybCk7XG4gIH0pO1xuXG4gIC8vIEVuZ2luZSBJTyBkZWZhdWx0c1xuICAvLyB0aGlzLnBpbmdUaW1lb3V0ID0gb3B0cy5waW5nVGltZW91dCB8fCAzMDAwO1xuICAvLyB0aGlzLnBpbmdJbnRlcnZhbCA9IG9wdHMucGluZ0ludGVydmFsIHx8IDEwMDA7XG4gIC8vIHRoaXMudXBncmFkZVRpbWVvdXQgPSBvcHRzLnVwZ3JhZGVUaW1lb3V0IHx8IDEwMDAwO1xuICAvLyB0aGlzLm1heEh0dHBCdWZmZXJTaXplID0gb3B0cy5tYXhIdHRwQnVmZmVyU2l6ZSB8fCAxMEU3O1xuXG4gIGlmIChodHRwU2VydmVyKSB7XG4gICAgc2VydmVyLmlvID0gbmV3IElPKGh0dHBTZXJ2ZXIsIHNvY2tldENvbmZpZyk7XG4gIH1cblxuICAvLyBPU0NcbiAgaWYgKG9wdGlvbnMub3NjKSB7XG4gICAgc2VydmVyLm9zYyA9IG5ldyBvc2MuVURQUG9ydCh7XG4gICAgICAvLyBUaGlzIGlzIHRoZSBwb3J0IHdlJ3JlIGxpc3RlbmluZyBvbi5cbiAgICAgIGxvY2FsQWRkcmVzczogb3B0aW9ucy5vc2MubG9jYWxBZGRyZXNzIHx8ICcxMjcuMC4wLjEnLFxuICAgICAgbG9jYWxQb3J0OiBvcHRpb25zLm9zYy5sb2NhbFBvcnQgfHwgNTcxMjEsXG5cbiAgICAgIC8vIFRoaXMgaXMgdGhlIHBvcnQgd2UgdXNlIHRvIHNlbmQgbWVzc2FnZXMuXG4gICAgICByZW1vdGVBZGRyZXNzOiBvcHRpb25zLm9zYy5yZW1vdGVBZGRyZXNzIHx8ICcxMjcuMC4wLjEnLFxuICAgICAgcmVtb3RlUG9ydDogb3B0aW9ucy5vc2MucmVtb3RlUG9ydCB8fCA1NzEyMCxcbiAgICB9KTtcblxuICAgIHNlcnZlci5vc2Mub24oJ3JlYWR5JywgKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ0xpc3RlbmluZyBmb3IgT1NDIG92ZXIgVURQIG9uIHBvcnQgJyArIG9wdGlvbnMub3NjLmxvY2FsUG9ydCArICcuJyk7XG4gICAgfSk7XG5cbiAgICBzZXJ2ZXIub3NjLm9uKCdtZXNzYWdlJywgKG9zY01zZykgPT4ge1xuICAgICAgY29uc3QgYWRkcmVzcyA9IG9zY01zZy5hZGRyZXNzO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9zY0xpc3RlbmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoYWRkcmVzcyA9PT0gb3NjTGlzdGVuZXJzW2ldLndpbGRjYXJkKVxuICAgICAgICAgIG9zY0xpc3RlbmVyc1tpXS5jYWxsYmFjayhvc2NNc2cpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgc2VydmVyLm9zYy5vcGVuKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBJbmRpY2F0ZXMgdGhhdCB0aGUgY2xpZW50cyBvZiB0eXBlIGBjbGllbnRUeXBlYCByZXF1aXJlIHRoZSBtb2R1bGVzIGAuLi5tb2R1bGVzYCBvbiB0aGUgc2VydmVyIHNpZGUuXG4gKiBBZGRpdGlvbmFsbHksIHRoaXMgbWV0aG9kIHJvdXRlcyB0aGUgY29ubmVjdGlvbnMgZnJvbSB0aGUgY29ycmVzcG9uZGluZyBVUkwgdG8gdGhlIGNvcnJlc3BvbmRpbmcgdmlldy5cbiAqIE1vcmUgc3BlY2lmaWNhbGx5OlxuICogLSBBIGNsaWVudCBjb25uZWN0aW5nIHRvIHRoZSBzZXJ2ZXIgdGhyb3VnaCB0aGUgcm9vdCBVUkwgYGh0dHA6Ly9teS5zZXJ2ZXIuYWRkcmVzczpwb3J0L2AgaXMgY29uc2lkZXJlZCBhcyBhIGAncGxheWVyJ2AgY2xpZW50IGFuZCBkaXNwbGF5cyB0aGUgdmlldyBgcGxheWVyLmVqc2A7XG4gKiAtIEEgY2xpZW50IGNvbm5lY3RpbmcgdG8gdGhlIHNlcnZlciB0aHJvdWdoIHRoZSBVUkwgYGh0dHA6Ly9teS5zZXJ2ZXIuYWRkcmVzczpwb3J0L2NsaWVudFR5cGVgIGlzIGNvbnNpZGVyZWQgYXMgYSBgY2xpZW50VHlwZWAgY2xpZW50LCBhbmQgZGlzcGxheXMgdGhlIHZpZXcgYGNsaWVudFR5cGUuZWpzYC5cbiAqIEBwYXJhbSB7U3RyaW5nfSBjbGllbnRUeXBlIENsaWVudCB0eXBlIChhcyBkZWZpbmVkIGJ5IHRoZSBtZXRob2Qge0BsaW5rIGNsaWVudC5pbml0fSBvbiB0aGUgY2xpZW50IHNpZGUpLlxuICogQHBhcmFtIHsuLi5DbGllbnRNb2R1bGV9IG1vZHVsZXMgTW9kdWxlcyB0byBtYXAgdG8gdGhhdCBjbGllbnQgdHlwZS5cbiAqL1xuZnVuY3Rpb24gbWFwKGNsaWVudFR5cGUsIC4uLm1vZHVsZXMpIHtcbiAgdmFyIHVybCA9ICcvJztcblxuICAvLyBjYWNoZSBjb21waWxlZCB0ZW1wbGF0ZVxuICBjb25zdCB0bXBsUGF0aD0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICd2aWV3cycsIGNsaWVudFR5cGUgKyAnLmVqcycpO1xuICBjb25zdCB0bXBsU3RyaW5nID0gZnMucmVhZEZpbGVTeW5jKHRtcGxQYXRoLCB7IGVuY29kaW5nOiAndXRmOCcgfSk7XG4gIGNvbnN0IHRtcGwgPSBlanMuY29tcGlsZSh0bXBsU3RyaW5nKTtcblxuICBpZiAoY2xpZW50VHlwZSAhPT0gJ3BsYXllcicpXG4gICAgdXJsICs9IGNsaWVudFR5cGU7XG5cbiAgZXhwcmVzc0FwcC5nZXQodXJsLCBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgIHJlcy5zZW5kKHRtcGwoeyBlbnZDb25maWc6IEpTT04uc3RyaW5naWZ5KHNlcnZlci5lbnZDb25maWcpIH0pKTtcbiAgfSk7XG5cbiAgc2VydmVyLmlvLm9mKGNsaWVudFR5cGUpLm9uKCdjb25uZWN0aW9uJywgKHNvY2tldCkgPT4ge1xuICAgIGxvZy5pbmZvKHsgc29ja2V0OiBzb2NrZXQsIGNsaWVudFR5cGU6IGNsaWVudFR5cGUgfSwgJ2Nvbm5lY3Rpb24nKTtcbiAgICB2YXIgY2xpZW50ID0gbmV3IENsaWVudChjbGllbnRUeXBlLCBzb2NrZXQpO1xuXG4gICAgdmFyIGluZGV4ID0gX2dldENsaWVudEluZGV4KCk7XG4gICAgY2xpZW50LmluZGV4ID0gaW5kZXg7XG5cbiAgICBmb3IgKGxldCBtb2Qgb2YgbW9kdWxlcykge1xuICAgICAgbW9kLmNvbm5lY3QoY2xpZW50KTtcbiAgICB9XG5cbiAgICBjbGllbnQucmVjZWl2ZSgnZGlzY29ubmVjdCcsICgpID0+IHtcbiAgICAgIGxvZy5pbmZvKHsgc29ja2V0OiBzb2NrZXQsIGNsaWVudFR5cGU6IGNsaWVudFR5cGUgfSwgJ2Rpc2Nvbm5lY3QnKTtcbiAgICAgIGZvciAobGV0IGkgPSBtb2R1bGVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIHZhciBtb2QgPSBtb2R1bGVzW2ldO1xuICAgICAgICBtb2QuZGlzY29ubmVjdChjbGllbnQpO1xuICAgICAgfVxuXG4gICAgICBfcmVsZWFzZUNsaWVudEluZGV4KGNsaWVudC5pbmRleCk7XG4gICAgICBjbGllbnQuaW5kZXggPSAtMTtcbiAgICB9KTtcblxuICAgIGNsaWVudC5zZW5kKCdjbGllbnQ6c3RhcnQnLCBpbmRleCk7IC8vIHRoZSBzZXJ2ZXIgaXMgcmVhZHlcbiAgfSk7XG59XG5cbi8qKlxuICogU2VuZHMgYSBXZWJTb2NrZXQgbWVzc2FnZSB0byBhbGwgdGhlIGNsaWVudHMgb2YgdHlwZSBgY2xpZW50VHlwZWAuXG4gKlxuICogKipOb3RlOioqIG9uIHRoZSBjbGllbnQgc2lkZSwgdGhlIGNsaWVudHMgcmVjZWl2ZSB0aGUgbWVzc2FnZSB3aXRoIHRoZSBtZXRob2Qge0BsaW5rIGNsaWVudC5yZWNlaXZlfS5cbiAqIEBwYXJhbSB7U3RyaW5nfSBjbGllbnRUeXBlIENsaWVudCB0eXBlIChhcyBkZWZpbmVkIGJ5IHRoZSBtZXRob2Qge0BsaW5rIGNsaWVudC5pbml0fSBvbiB0aGUgY2xpZW50IHNpZGUpLlxuICogQHBhcmFtIHtTdHJpbmd9IG1zZyBOYW1lIG9mIHRoZSBtZXNzYWdlIHRvIHNlbmQuXG4gKiBAcGFyYW0gey4uLip9IGFyZ3MgQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuICogQHRvZG8gc29sdmUgLi4uIHByb2JsZW1cbiAqL1xuZnVuY3Rpb24gYnJvYWRjYXN0KGNsaWVudFR5cGUsIG1zZywgLi4uYXJncykge1xuICBpZiAoc2VydmVyLmlvKSB7XG4gICAgbG9nLmluZm8oeyBjbGllbnRUeXBlOiBjbGllbnRUeXBlLCBjaGFubmVsOiBtc2csIGFyZ3VtZW50czogYXJncyB9LCAnYnJvYWRjYXN0Jyk7XG4gICAgc2VydmVyLmlvLm9mKCcvJyArIGNsaWVudFR5cGUpLmVtaXQobXNnLCAuLi5hcmdzKTtcbiAgfVxufVxuXG4vKipcbiAqIFNlbmRzIGFuIE9TQyBtZXNzYWdlLlxuICogQHBhcmFtIHtTdHJpbmd9IHdpbGRjYXJkIFdpbGRjYXJkIG9mIHRoZSBPU0MgbWVzc2FnZS5cbiAqIEBwYXJhbSB7QXJyYXl9IGFyZ3MgQXJndW1lbnRzIG9mIHRoZSBPU0MgbWVzc2FnZS5cbiAqIEBwYXJhbSB7U3RyaW5nfSBbdXJsPW51bGxdIFVSTCB0byBzZW5kIHRoZSBPU0MgbWVzc2FnZSB0byAoaWYgbm90IHNwZWNpZmllZCwgdXNlcyB0aGUgYWRkcmVzcyBkZWZpbmVkIGluIHRoZSBPU0MgY29uZmlnIG9yIGluIHRoZSBvcHRpb25zIG9mIHRoZSB7QGxpbmsgc2VydmVyLnN0YXJ0fSBtZXRob2QpLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtwb3J0PW51bGxdIFBvcnQgdG8gc2VuZCB0aGUgbWVzc2FnZSB0byAoaWYgbm90IHNwZWNpZmllZCwgdXNlcyB0aGUgcG9ydCBkZWZpbmVkIGluIHRoZSBPU0MgY29uZmlnIG9yIGluIHRoZSBvcHRpb25zIG9mIHRoZSB7QGxpbmsgc2VydmVyLnN0YXJ0fSBtZXRob2QpLlxuICovXG5mdW5jdGlvbiBzZW5kT1NDKHdpbGRjYXJkLCBhcmdzLCB1cmwgPSBudWxsLCBwb3J0ID0gbnVsbCkge1xuICBjb25zdCBvc2NNc2cgPSB7XG4gICAgYWRkcmVzczogd2lsZGNhcmQsXG4gICAgYXJnczogYXJnc1xuICB9O1xuXG4gIHRyeSB7XG4gICAgaWYgKHVybCAmJiBwb3J0KVxuICAgICAgc2VydmVyLm9zYy5zZW5kKG9zY01zZywgdXJsLCBwb3J0KTtcbiAgICBlbHNlXG4gICAgICBzZXJ2ZXIub3NjLnNlbmQob3NjTXNnKTsgLy8gdXNlIGRlZmF1bHRzIChhcyBkZWZpbmVkIGluIHRoZSBjb25maWcpXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmxvZygnRXJyb3Igd2hpbGUgc2VuZGluZyBPU0MgbWVzc2FnZTonLCBlKTtcbiAgfVxufVxuXG4vKipcbiAqIEV4ZWN1dGVzIGEgY2FsbGJhY2sgZnVuY3Rpb24gd2hlbiBpdCByZWNlaXZlcyBhbiBPU0MgbWVzc2FnZS5cbiAqIFRoZSBzZXJ2ZXIgbGlzdGVucyB0byBPU0MgbWVzc2FnZXMgYXQgdGhlIGFkZHJlc3MgYW5kIHBvcnQgZGVmaW5lZCBpbiB0aGUgY29uZmlnIG9yIGluIHRoZSBvcHRpb25zIG9mIHRoZSB7QGxpbmsgc2VydmVyLnN0YXJ0fSBtZXRob2QuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHdpbGRjYXJkIFdpbGRjYXJkIG9mIHRoZSBPU0MgbWVzc2FnZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIENhbGxiYWNrIGZ1bmN0aW9uIGV4ZWN1dGVkIHdoZW4gdGhlIE9TQyBtZXNzYWdlIGlzIHJlY2VpdmVkLlxuICovXG5mdW5jdGlvbiByZWNlaXZlT1NDKHdpbGRjYXJkLCBjYWxsYmFjaykge1xuICBjb25zdCBvc2NMaXN0ZW5lciA9IHtcbiAgICB3aWxkY2FyZDogd2lsZGNhcmQsXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gIH07XG5cbiAgb3NjTGlzdGVuZXJzLnB1c2gob3NjTGlzdGVuZXIpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBzZXJ2ZXI7XG5cbiJdfQ==