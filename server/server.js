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
 * @type {Object}
 */
var server = {

  /**
   * WebSocket server.
   * @type {Object}
   * @private
   */
  io: null,

  /**
   * Envirnment configuration information (development / production).
   * @type {Object}
   * @private
   */
  envConfig: {}, // host env config informations (dev / prod)

  /**
   * OSC object.
   * @type {Object}
   * @private
   */
  osc: null,

  /**
   * Start the server.
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
  start: function start(app, publicPath, port) {
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
  map: function map(clientType) {
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
  },

  /**
   * Send a WebSocket message to all the clients of type `clientType`.
   *
   * **Note:** on the client side, the clients receive the message with the method {@link client.receive}.
   * @param {String} clientType Client type (as defined by the method {@link client.init} on the client side).
   * @param {String} msg Name of the message to send.
   * @param {...*} args Arguments of the message (as many as needed, of any type).
   * @todo solve ... problem
   */
  broadcast: function broadcast(clientType, msg) {
    for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      args[_key2 - 2] = arguments[_key2];
    }

    if (server.io) {
      var _server$io$of;

      _logger2['default'].info({ clientType: clientType, channel: msg, arguments: args }, 'broadcast');
      (_server$io$of = server.io.of('/' + clientType)).emit.apply(_server$io$of, [msg].concat(args));
    }
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
      if (url && port) server.osc.send(oscMsg, url, port);else server.osc.send(oscMsg); // use defaults (as defined in the config)
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

exports['default'] = server;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvc2VydmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7bUJBQWdCLEtBQUs7Ozs7dUJBQ0QsU0FBUzs7OztrQkFDZCxJQUFJOzs7O29CQUNGLE1BQU07Ozs7c0JBQ1AsVUFBVTs7Ozt3QkFDWCxXQUFXOzs7O21CQUNWLEtBQUs7Ozs7b0JBQ0osTUFBTTs7OztzQkFDSixVQUFVOzs7Ozs7Ozs7O0FBUTdCLElBQUksTUFBTSxHQUFHOzs7Ozs7O0FBT1gsSUFBRSxFQUFFLElBQUk7Ozs7Ozs7QUFPUixXQUFTLEVBQUUsRUFBRTs7Ozs7OztBQU9iLEtBQUcsRUFBRSxJQUFJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJULE9BQUssRUFBRSxlQUFDLEdBQUcsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFtQjtRQUFqQixPQUFPLHlEQUFHLEVBQUU7O0FBQ3pDLFFBQU0sZUFBZSxHQUFJLE9BQU8sQ0FBQyxRQUFRLElBQUksRUFBRSxBQUFDLENBQUM7QUFDakQsUUFBTSxZQUFZLEdBQUc7QUFDbkIsZ0JBQVUsRUFBRSxlQUFlLENBQUMsVUFBVSxJQUFJLENBQUMsV0FBVyxDQUFDO0FBQ3ZELGlCQUFXLEVBQUUsZUFBZSxDQUFDLFdBQVcsSUFBSSxLQUFLO0FBQ2pELGtCQUFZLEVBQUUsZUFBZSxDQUFDLFlBQVksSUFBSSxLQUFLO0tBQ3BELENBQUM7O0FBRUYsVUFBTSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDOztBQUUvQixPQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLENBQUM7QUFDbEQsT0FBRyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDOUIsT0FBRyxDQUFDLEdBQUcsQ0FBQyw4QkFBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7O0FBRXBDLGNBQVUsR0FBRyxrQkFBSyxZ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QUFDO0FBQ3hCLElBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQztBQUN0QixJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUM7QUFDdEIsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDOztBQUV0QixTQUFTLGVBQWUsR0FBRztBQUN6QixNQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQzs7QUFFZixNQUFJLHNCQUFzQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDckMsMEJBQXNCLENBQUMsSUFBSSxDQUFDLFVBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUN6QyxhQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDZCxDQUFDLENBQUM7O0FBRUgsU0FBSyxHQUFHLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDaEQsTUFBTTtBQUNMLFNBQUssR0FBRyxlQUFlLEVBQUUsQ0FBQztHQUMzQjs7QUFFRCxTQUFPLEtBQUssQ0FBQztDQUNkOztBQUVELFNBQVMsbUJBQW1CLENBQUMsS0FBSyxFQUFFO0FBQ2xDLHdCQUFzQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztDQUNwQzs7cUJBRWMsTUFBTSIsImZpbGUiOiJzcmMvc2VydmVyL3NlcnZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBlanMgZnJvbSAnZWpzJztcbmltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBodHRwIGZyb20gJ2h0dHAnO1xuaW1wb3J0IGxvZyBmcm9tICcuL2xvZ2dlcic7XG5pbXBvcnQgSU8gZnJvbSAnc29ja2V0LmlvJztcbmltcG9ydCBvc2MgZnJvbSAnb3NjJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IENsaWVudCBmcm9tICcuL0NsaWVudCc7XG5cbi8qKlxuICogVGhlIGBzZXJ2ZXJgIG9iamVjdCBjb250YWlucyB0aGUgYmFzaWMgbWV0aG9kcyBvZiB0aGUgc2VydmVyLlxuICogRm9yIGluc3RhbmNlLCB0aGlzIG9iamVjdCBhbGxvd3Mgc2V0dGluZyB1cCwgY29uZmlndXJpbmcgYW5kIHN0YXJ0aW5nIHRoZSBzZXJ2ZXIgd2l0aCB0aGUgbWV0aG9kIGBzdGFydGAgd2hpbGUgdGhlIG1ldGhvZCBgbWFwYCBhbGxvd3MgZm9yIG1hbmFnaW5nIHRoZSBtYXBwaW5nIGJldHdlZW4gZGlmZmVyZW50IHR5cGVzIG9mIGNsaWVudHMgYW5kIHRoZWlyIHJlcXVpcmVkIHNlcnZlciBtb2R1bGVzLlxuICogQWRkaXRpb25hbGx5LCB0aGUgbWV0aG9kIGBicm9hZGNhc3RgIGFsbG93cyB0byBzZW5kIG1lc3NhZ2VzIHRvIGFsbCBjb25uZWN0ZWQgY2xpZW50cyB2aWEgV2ViU29ja2V0cyBvciBPU0MuXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG52YXIgc2VydmVyID0ge1xuXG4gIC8qKlxuICAgKiBXZWJTb2NrZXQgc2VydmVyLlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaW86IG51bGwsXG5cbiAgLyoqXG4gICAqIEVudmlybm1lbnQgY29uZmlndXJhdGlvbiBpbmZvcm1hdGlvbiAoZGV2ZWxvcG1lbnQgLyBwcm9kdWN0aW9uKS5cbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGVudkNvbmZpZzoge30sIC8vIGhvc3QgZW52IGNvbmZpZyBpbmZvcm1hdGlvbnMgKGRldiAvIHByb2QpXG5cbiAgLyoqXG4gICAqIE9TQyBvYmplY3QuXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBvc2M6IG51bGwsXG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhcHAgRXhwcmVzcyBhcHBsaWNhdGlvbi5cbiAgICogQHBhcmFtIHtTdHJpbmd9IHB1YmxpY1BhdGggUHVibGljIHN0YXRpYyBkaXJlY3Rvcnkgb2YgdGhlIEV4cHJlc3MgYXBwLlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9ydCBQb3J0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5zb2NrZXRJTz17fV0gc29ja2V0LmlvIG9wdGlvbnMuIFRoZSBzb2NrZXQuaW8gY29uZmlnIG9iamVjdCBjYW4gaGF2ZSB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gICAqIC0gYHRyYW5zcG9ydHM6U3RyaW5nYDogY29tbXVuaWNhdGlvbiB0cmFuc3BvcnQgKGRlZmF1bHRzIHRvIGAnd2Vic29ja2V0J2ApO1xuICAgKiAtIGBwaW5nVGltZW91dDpOdW1iZXJgOiB0aW1lb3V0IChpbiBtaWxsaXNlY29uZHMpIGJlZm9yZSB0cnlpbmcgdG8gcmVlc3RhYmxpc2ggYSBjb25uZWN0aW9uIGJldHdlZW4gYSBsb3N0IGNsaWVudCBhbmQgYSBzZXJ2ZXIgKGRlZmF1dGxzIHRvIGA2MDAwMGApO1xuICAgKiAtIGBwaW5nSW50ZXJ2YWw6TnVtYmVyYDogdGltZSBpbnRlcnZhbCAoaW4gbWlsbGlzZWNvbmRzKSB0byBzZW5kIGEgcGluZyB0byBhIGNsaWVudCB0byBjaGVjayB0aGUgY29ubmVjdGlvbiAoZGVmYXVsdHMgdG8gYDUwMDAwYCkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5vc2M9e31dIE9TQyBvcHRpb25zLiBUaGUgT1NDIGNvbmZpZyBvYmplY3QgY2FuIGhhdmUgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICAgKiAtIGBsb2NhbEFkZHJlc3M6U3RyaW5nYDogYWRkcmVzcyBvZiB0aGUgbG9jYWwgbWFjaGluZSB0byByZWNlaXZlIE9TQyBtZXNzYWdlcyAoZGVmYXVsdHMgdG8gYCcxMjcuMC4wLjEnYCk7XG4gICAqIC0gYGxvY2FsUG9ydDpOdW1iZXJgOiBwb3J0IG9mIHRoZSBsb2NhbCBtYWNoaW5lIHRvIHJlY2VpdmUgT1NDIG1lc3NhZ2VzIChkZWZhdWx0cyB0byBgNTcxMjFgKTtcbiAgICogLSBgcmVtb3RlQWRkcmVzczpTdHJpbmdgOiBhZGRyZXNzIG9mIHRoZSBkZXZpY2UgdG8gc2VuZCBkZWZhdWx0IE9TQyBtZXNzYWdlcyB0byAoZGVmYXVsdHMgdG8gYCcxMjcuMC4wLjEnYCk7XG4gICAqIC0gYHJlbW90ZVBvcnQ6TnVtYmVyYDogcG9ydCBvZiB0aGUgZGV2aWNlIHRvIHNlbmQgZGVmYXVsdCBPU0MgbWVzc2FnZXMgdG8gKGRlZmF1bHRzIHRvIGA1NzEyMGApLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMuZW52PXt9XSBFbnZpcm9ubmVtZW50IG9wdGlvbnMgKHNldCBieSB0aGUgdXNlciwgZGVwZW5kcyBvbiB0aGUgc2NlbmFyaW8pLlxuICAgKi9cbiAgc3RhcnQ6IChhcHAsIHB1YmxpY1BhdGgsIHBvcnQsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICAgIGNvbnN0IHNvY2tldElPT3B0aW9ucyA9IChvcHRpb25zLnNvY2tldElPIHx8wqB7fSk7XG4gICAgY29uc3Qgc29ja2V0Q29uZmlnID0ge1xuICAgICAgdHJhbnNwb3J0czogc29ja2V0SU9PcHRpb25zLnRyYW5zcG9ydHMgfHzCoFsnd2Vic29ja2V0J10sXG4gICAgICBwaW5nVGltZW91dDogc29ja2V0SU9PcHRpb25zLnBpbmdUaW1lb3V0IHx8wqA2MDAwMCxcbiAgICAgIHBpbmdJbnRlcnZhbDogc29ja2V0SU9PcHRpb25zLnBpbmdJbnRlcnZhbCB8fMKgNTAwMDAsXG4gICAgfTtcblxuICAgIHNlcnZlci5lbnZDb25maWcgPSBvcHRpb25zLmVudjtcblxuICAgIGFwcC5zZXQoJ3BvcnQnLCBwcm9jZXNzLmVudi5QT1JUIHx8IHBvcnQgfHwgODAwMCk7XG4gICAgYXBwLnNldCgndmlldyBlbmdpbmUnLCAnZWpzJyk7XG4gICAgYXBwLnVzZShleHByZXNzLnN0YXRpYyhwdWJsaWNQYXRoKSk7XG5cbiAgICBodHRwU2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoYXBwKTtcbiAgICBleHByZXNzQXBwID0gYXBwO1xuXG4gICAgaHR0cFNlcnZlci5saXN0ZW4oYXBwLmdldCgncG9ydCcpLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB1cmwgPSAnaHR0cDovLzEyNy4wLjAuMTonICsgYXBwLmdldCgncG9ydCcpO1xuICAgICAgY29uc29sZS5sb2coJ1NlcnZlciBsaXN0ZW5pbmcgb24nLCB1cmwpO1xuICAgIH0pO1xuXG4gICAgLy8gRW5naW5lIElPIGRlZmF1bHRzXG4gICAgLy8gdGhpcy5waW5nVGltZW91dCA9IG9wdHMucGluZ1RpbWVvdXQgfHwgMzAwMDtcbiAgICAvLyB0aGlzLnBpbmdJbnRlcnZhbCA9IG9wdHMucGluZ0ludGVydmFsIHx8IDEwMDA7XG4gICAgLy8gdGhpcy51cGdyYWRlVGltZW91dCA9IG9wdHMudXBncmFkZVRpbWVvdXQgfHwgMTAwMDA7XG4gICAgLy8gdGhpcy5tYXhIdHRwQnVmZmVyU2l6ZSA9IG9wdHMubWF4SHR0cEJ1ZmZlclNpemUgfHwgMTBFNztcblxuICAgIGlmIChodHRwU2VydmVyKSB7XG4gICAgICBzZXJ2ZXIuaW8gPSBuZXcgSU8oaHR0cFNlcnZlciwgc29ja2V0Q29uZmlnKTtcbiAgICB9XG5cbiAgICAvLyBPU0NcbiAgICBpZiAob3B0aW9ucy5vc2MpIHtcbiAgICAgIHNlcnZlci5vc2MgPSBuZXcgb3NjLlVEUFBvcnQoe1xuICAgICAgICAvLyBUaGlzIGlzIHRoZSBwb3J0IHdlJ3JlIGxpc3RlbmluZyBvbi5cbiAgICAgICAgbG9jYWxBZGRyZXNzOiBvcHRpb25zLm9zYy5sb2NhbEFkZHJlc3MgfHwgJzEyNy4wLjAuMScsXG4gICAgICAgIGxvY2FsUG9ydDogb3B0aW9ucy5vc2MubG9jYWxQb3J0IHx8IDU3MTIxLFxuXG4gICAgICAgIC8vIFRoaXMgaXMgdGhlIHBvcnQgd2UgdXNlIHRvIHNlbmQgbWVzc2FnZXMuXG4gICAgICAgIHJlbW90ZUFkZHJlc3M6IG9wdGlvbnMub3NjLnJlbW90ZUFkZHJlc3MgfHwgJzEyNy4wLjAuMScsXG4gICAgICAgIHJlbW90ZVBvcnQ6IG9wdGlvbnMub3NjLnJlbW90ZVBvcnQgfHwgNTcxMjAsXG4gICAgICB9KTtcblxuICAgICAgc2VydmVyLm9zYy5vbigncmVhZHknLCAoKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdMaXN0ZW5pbmcgZm9yIE9TQyBvdmVyIFVEUCBvbiBwb3J0ICcgKyBvcHRpb25zLm9zYy5sb2NhbFBvcnQgKyAnLicpO1xuICAgICAgfSk7XG5cbiAgICAgIHNlcnZlci5vc2Mub24oJ21lc3NhZ2UnLCAob3NjTXNnKSA9PiB7XG4gICAgICAgIGNvbnN0IGFkZHJlc3MgPSBvc2NNc2cuYWRkcmVzcztcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9zY0xpc3RlbmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChhZGRyZXNzID09PSBvc2NMaXN0ZW5lcnNbaV0ud2lsZGNhcmQpXG4gICAgICAgICAgICBvc2NMaXN0ZW5lcnNbaV0uY2FsbGJhY2sob3NjTXNnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHNlcnZlci5vc2Mub3BlbigpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogSW5kaWNhdGUgdGhhdCB0aGUgY2xpZW50cyBvZiB0eXBlIGBjbGllbnRUeXBlYCByZXF1aXJlIHRoZSBtb2R1bGVzIGAuLi5tb2R1bGVzYCBvbiB0aGUgc2VydmVyIHNpZGUuXG4gICAqIEFkZGl0aW9uYWxseSwgdGhpcyBtZXRob2Qgcm91dGVzIHRoZSBjb25uZWN0aW9ucyBmcm9tIHRoZSBjb3JyZXNwb25kaW5nIFVSTCB0byB0aGUgY29ycmVzcG9uZGluZyB2aWV3LlxuICAgKiBNb3JlIHNwZWNpZmljYWxseTpcbiAgICogLSBBIGNsaWVudCBjb25uZWN0aW5nIHRvIHRoZSBzZXJ2ZXIgdGhyb3VnaCB0aGUgcm9vdCBVUkwgYGh0dHA6Ly9teS5zZXJ2ZXIuYWRkcmVzczpwb3J0L2AgaXMgY29uc2lkZXJlZCBhcyBhIGAncGxheWVyJ2AgY2xpZW50IGFuZCBkaXNwbGF5cyB0aGUgdmlldyBgcGxheWVyLmVqc2A7XG4gICAqIC0gQSBjbGllbnQgY29ubmVjdGluZyB0byB0aGUgc2VydmVyIHRocm91Z2ggdGhlIFVSTCBgaHR0cDovL215LnNlcnZlci5hZGRyZXNzOnBvcnQvY2xpZW50VHlwZWAgaXMgY29uc2lkZXJlZCBhcyBhIGBjbGllbnRUeXBlYCBjbGllbnQsIGFuZCBkaXNwbGF5cyB0aGUgdmlldyBgY2xpZW50VHlwZS5lanNgLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2xpZW50VHlwZSBDbGllbnQgdHlwZSAoYXMgZGVmaW5lZCBieSB0aGUgbWV0aG9kIHtAbGluayBjbGllbnQuaW5pdH0gb24gdGhlIGNsaWVudCBzaWRlKS5cbiAgICogQHBhcmFtIHsuLi5DbGllbnRNb2R1bGV9IG1vZHVsZXMgTW9kdWxlcyB0byBtYXAgdG8gdGhhdCBjbGllbnQgdHlwZS5cbiAgICovXG4gIG1hcDogKGNsaWVudFR5cGUsIC4uLm1vZHVsZXMpID0+IHtcbiAgICB2YXIgdXJsID0gJy8nO1xuXG4gICAgLy8gY2FjaGUgY29tcGlsZWQgdGVtcGxhdGVcbiAgICBjb25zdCB0bXBsUGF0aD0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICd2aWV3cycsIGNsaWVudFR5cGUgKyAnLmVqcycpO1xuICAgIGNvbnN0IHRtcGxTdHJpbmcgPSBmcy5yZWFkRmlsZVN5bmModG1wbFBhdGgsIHsgZW5jb2Rpbmc6ICd1dGY4JyB9KTtcbiAgICBjb25zdCB0bXBsID0gZWpzLmNvbXBpbGUodG1wbFN0cmluZyk7XG5cbiAgICBpZiAoY2xpZW50VHlwZSAhPT0gJ3BsYXllcicpXG4gICAgICB1cmwgKz0gY2xpZW50VHlwZTtcblxuICAgIGV4cHJlc3NBcHAuZ2V0KHVybCwgZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICAgIHJlcy5zZW5kKHRtcGwoeyBlbnZDb25maWc6IEpTT04uc3RyaW5naWZ5KHNlcnZlci5lbnZDb25maWcpIH0pKTtcbiAgICB9KTtcblxuICAgIHNlcnZlci5pby5vZihjbGllbnRUeXBlKS5vbignY29ubmVjdGlvbicsIChzb2NrZXQpID0+IHtcbiAgICAgIGxvZy5pbmZvKHsgc29ja2V0OiBzb2NrZXQsIGNsaWVudFR5cGU6IGNsaWVudFR5cGUgfSwgJ2Nvbm5lY3Rpb24nKTtcbiAgICAgIHZhciBjbGllbnQgPSBuZXcgQ2xpZW50KGNsaWVudFR5cGUsIHNvY2tldCk7XG5cbiAgICAgIHZhciBpbmRleCA9IF9nZXRDbGllbnRJbmRleCgpO1xuICAgICAgY2xpZW50LmluZGV4ID0gaW5kZXg7XG5cbiAgICAgIGZvciAobGV0IG1vZCBvZiBtb2R1bGVzKSB7XG4gICAgICAgIG1vZC5jb25uZWN0KGNsaWVudCk7XG4gICAgICB9XG5cbiAgICAgIGNsaWVudC5yZWNlaXZlKCdkaXNjb25uZWN0JywgKCkgPT4ge1xuICAgICAgICBsb2cuaW5mbyh7IHNvY2tldDogc29ja2V0LCBjbGllbnRUeXBlOiBjbGllbnRUeXBlIH0sICdkaXNjb25uZWN0Jyk7XG4gICAgICAgIGZvciAobGV0IGkgPSBtb2R1bGVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgdmFyIG1vZCA9IG1vZHVsZXNbaV07XG4gICAgICAgICAgbW9kLmRpc2Nvbm5lY3QoY2xpZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9yZWxlYXNlQ2xpZW50SW5kZXgoY2xpZW50LmluZGV4KTtcbiAgICAgICAgY2xpZW50LmluZGV4ID0gLTE7XG4gICAgICB9KTtcblxuICAgICAgY2xpZW50LnNlbmQoJ2NsaWVudDpzdGFydCcsIGluZGV4KTsgLy8gdGhlIHNlcnZlciBpcyByZWFkeVxuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTZW5kIGEgV2ViU29ja2V0IG1lc3NhZ2UgdG8gYWxsIHRoZSBjbGllbnRzIG9mIHR5cGUgYGNsaWVudFR5cGVgLlxuICAgKlxuICAgKiAqKk5vdGU6Kiogb24gdGhlIGNsaWVudCBzaWRlLCB0aGUgY2xpZW50cyByZWNlaXZlIHRoZSBtZXNzYWdlIHdpdGggdGhlIG1ldGhvZCB7QGxpbmsgY2xpZW50LnJlY2VpdmV9LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2xpZW50VHlwZSBDbGllbnQgdHlwZSAoYXMgZGVmaW5lZCBieSB0aGUgbWV0aG9kIHtAbGluayBjbGllbnQuaW5pdH0gb24gdGhlIGNsaWVudCBzaWRlKS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG1zZyBOYW1lIG9mIHRoZSBtZXNzYWdlIHRvIHNlbmQuXG4gICAqIEBwYXJhbSB7Li4uKn0gYXJncyBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqIEB0b2RvIHNvbHZlIC4uLiBwcm9ibGVtXG4gICAqL1xuICBicm9hZGNhc3Q6IChjbGllbnRUeXBlLCBtc2csIC4uLmFyZ3MpID0+IHtcbiAgICBpZiAoc2VydmVyLmlvKSB7XG4gICAgICBsb2cuaW5mbyh7IGNsaWVudFR5cGU6IGNsaWVudFR5cGUsIGNoYW5uZWw6IG1zZywgYXJndW1lbnRzOiBhcmdzIH0sICdicm9hZGNhc3QnKTtcbiAgICAgIHNlcnZlci5pby5vZignLycgKyBjbGllbnRUeXBlKS5lbWl0KG1zZywgLi4uYXJncyk7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBTZW5kIGFuIE9TQyBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gd2lsZGNhcmQgV2lsZGNhcmQgb2YgdGhlIE9TQyBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge0FycmF5fSBhcmdzIEFyZ3VtZW50cyBvZiB0aGUgT1NDIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbdXJsPW51bGxdIFVSTCB0byBzZW5kIHRoZSBPU0MgbWVzc2FnZSB0byAoaWYgbm90IHNwZWNpZmllZCwgdXNlcyB0aGUgYWRkcmVzcyBkZWZpbmVkIGluIHRoZSBPU0MgY29uZmlnIG9yIGluIHRoZSBvcHRpb25zIG9mIHRoZSB7QGxpbmsgc2VydmVyLnN0YXJ0fSBtZXRob2QpLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW3BvcnQ9bnVsbF0gUG9ydCB0byBzZW5kIHRoZSBtZXNzYWdlIHRvIChpZiBub3Qgc3BlY2lmaWVkLCB1c2VzIHRoZSBwb3J0IGRlZmluZWQgaW4gdGhlIE9TQyBjb25maWcgb3IgaW4gdGhlIG9wdGlvbnMgb2YgdGhlIHtAbGluayBzZXJ2ZXIuc3RhcnR9IG1ldGhvZCkuXG4gICAqL1xuICBzZW5kT1NDOiAod2lsZGNhcmQsIGFyZ3MsIHVybCA9IG51bGwsIHBvcnQgPSBudWxsKSA9PiB7XG4gICAgY29uc3Qgb3NjTXNnID0ge1xuICAgICAgYWRkcmVzczogd2lsZGNhcmQsXG4gICAgICBhcmdzOiBhcmdzXG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICBpZiAodXJsICYmIHBvcnQpXG4gICAgICAgIHNlcnZlci5vc2Muc2VuZChvc2NNc2csIHVybCwgcG9ydCk7XG4gICAgICBlbHNlXG4gICAgICAgIHNlcnZlci5vc2Muc2VuZChvc2NNc2cpOyAvLyB1c2UgZGVmYXVsdHMgKGFzIGRlZmluZWQgaW4gdGhlIGNvbmZpZylcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZygnRXJyb3Igd2hpbGUgc2VuZGluZyBPU0MgbWVzc2FnZTonLCBlKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIExpc3RlbiBmb3IgT1NDIG1lc3NhZ2UgYW5kIGV4ZWN1dGUgYSBjYWxsYmFjayBmdW5jdGlvbi5cbiAgICogVGhlIHNlcnZlciBsaXN0ZW5zIHRvIE9TQyBtZXNzYWdlcyBhdCB0aGUgYWRkcmVzcyBhbmQgcG9ydCBkZWZpbmVkIGluIHRoZSBjb25maWcgb3IgaW4gdGhlIG9wdGlvbnMgb2YgdGhlIHtAbGluayBzZXJ2ZXIuc3RhcnR9IG1ldGhvZC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHdpbGRjYXJkIFdpbGRjYXJkIG9mIHRoZSBPU0MgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGJhY2sgZnVuY3Rpb24gZXhlY3V0ZWQgd2hlbiB0aGUgT1NDIG1lc3NhZ2UgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICByZWNlaXZlT1NDOiAod2lsZGNhcmQsIGNhbGxiYWNrKSA9PiB7XG4gICAgY29uc3Qgb3NjTGlzdGVuZXIgPSB7XG4gICAgICB3aWxkY2FyZDogd2lsZGNhcmQsXG4gICAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgICB9O1xuXG4gICAgb3NjTGlzdGVuZXJzLnB1c2gob3NjTGlzdGVuZXIpO1xuICB9XG59O1xuXG5sZXQgYXZhaWxhYmxlQ2xpZW50SW5kaWNlcyA9IFtdO1xubGV0IG5leHRDbGllbnRJbmRleCA9IDA7XG5sZXQgb3NjTGlzdGVuZXJzID0gW107XG5sZXQgZXhwcmVzc0FwcCA9IG51bGw7XG5sZXQgaHR0cFNlcnZlciA9IG51bGw7XG5cbmZ1bmN0aW9uIF9nZXRDbGllbnRJbmRleCgpIHtcbiAgdmFyIGluZGV4ID0gLTE7XG5cbiAgaWYgKGF2YWlsYWJsZUNsaWVudEluZGljZXMubGVuZ3RoID4gMCkge1xuICAgIGF2YWlsYWJsZUNsaWVudEluZGljZXMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICByZXR1cm4gYSAtIGI7XG4gICAgfSk7XG5cbiAgICBpbmRleCA9IGF2YWlsYWJsZUNsaWVudEluZGljZXMuc3BsaWNlKDAsIDEpWzBdO1xuICB9IGVsc2Uge1xuICAgIGluZGV4ID0gbmV4dENsaWVudEluZGV4Kys7XG4gIH1cblxuICByZXR1cm4gaW5kZXg7XG59XG5cbmZ1bmN0aW9uIF9yZWxlYXNlQ2xpZW50SW5kZXgoaW5kZXgpIHtcbiAgYXZhaWxhYmxlQ2xpZW50SW5kaWNlcy5wdXNoKGluZGV4KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc2VydmVyO1xuIl19