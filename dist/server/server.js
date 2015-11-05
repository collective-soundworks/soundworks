'use strict';

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var ejs = require('ejs');
var express = require('express');
var fs = require('fs');
var http = require('http');
var log = require('./logger');
var IO = require('socket.io');
var osc = require('osc');
var path = require('path');

var ServerClient = require('./ServerClient');
// import ServerClient from './ServerClient.es6.js';

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
  app.use(express['static'](publicPath));

  httpServer = http.createServer(app);
  expressApp = app;

  httpServer.listen(app.get('port'), function () {
    console.log('Server listening on port', app.get('port'));
  });

  // Engine IO defaults
  // this.pingTimeout = opts.pingTimeout || 3000;
  // this.pingInterval = opts.pingInterval || 1000;
  // this.upgradeTimeout = opts.upgradeTimeout || 10000;
  // this.maxHttpBufferSize = opts.maxHttpBufferSize || 10E7;

  if (httpServer) {
    server.io = new IO(httpServer, socketConfig);
  }

  // OSC
  if (options.osc) {
    server.osc = new osc.UDPPort({
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
  var tmplPath = path.join(process.cwd(), 'views', clientType + '.ejs');
  var tmplString = fs.readFileSync(tmplPath, { encoding: 'utf8' });
  var tmpl = ejs.compile(tmplString);

  if (clientType !== 'player') url += clientType;

  expressApp.get(url, function (req, res) {
    res.send(tmpl({ envConfig: JSON.stringify(server.envConfig) }));
  });

  server.io.of(clientType).on('connection', function (socket) {
    log.info({ socket: socket, clientType: clientType }, 'connection');
    var client = new ServerClient(clientType, socket);

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
      log.info({ socket: socket, clientType: clientType }, 'disconnect');
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

    log.info({ clientType: clientType, channel: msg, arguments: args }, 'broadcast');
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

// export default server;
module.exports = server;
//# sourceMappingURL=data:application/json;base64,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QUFDLENBQUM7Q0FDaEM7OztBQUdELE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDIiwiZmlsZSI6InNyYy9zZXJ2ZXIvc2VydmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBlanMgPSByZXF1aXJlKCdlanMnKTtcbmNvbnN0IGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzJyk7XG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5jb25zdCBodHRwID0gcmVxdWlyZSgnaHR0cCcpO1xuY29uc3QgbG9nID0gcmVxdWlyZSgnLi9sb2dnZXInKTtcbmNvbnN0IElPID0gcmVxdWlyZSgnc29ja2V0LmlvJyk7XG5jb25zdCBvc2MgPSByZXF1aXJlKCdvc2MnKTtcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5cbmNvbnN0IFNlcnZlckNsaWVudCA9IHJlcXVpcmUoJy4vU2VydmVyQ2xpZW50Jyk7XG4vLyBpbXBvcnQgU2VydmVyQ2xpZW50IGZyb20gJy4vU2VydmVyQ2xpZW50LmVzNi5qcyc7XG5cbi8qKlxuICogVGhlIGBzZXJ2ZXJgIG9iamVjdCBjb250YWlucyB0aGUgYmFzaWMgbWV0aG9kcyBvZiB0aGUgc2VydmVyLlxuICogRm9yIGluc3RhbmNlLCB0aGlzIG9iamVjdCBhbGxvd3Mgc2V0dGluZyB1cCwgY29uZmlndXJpbmcgYW5kIHN0YXJ0aW5nIHRoZSBzZXJ2ZXIgd2l0aCB0aGUgbWV0aG9kIGBzdGFydGAgd2hpbGUgdGhlIG1ldGhvZCBgbWFwYCBhbGxvd3MgZm9yIG1hbmFnaW5nIHRoZSBtYXBwaW5nIGJldHdlZW4gZGlmZmVyZW50IHR5cGVzIG9mIGNsaWVudHMgYW5kIHRoZWlyIHJlcXVpcmVkIHNlcnZlciBtb2R1bGVzLlxuICogQWRkaXRpb25hbGx5LCB0aGUgbWV0aG9kIGBicm9hZGNhc3RgIGFsbG93cyB0byBzZW5kIG1lc3NhZ2VzIHRvIGFsbCBjb25uZWN0ZWQgY2xpZW50cyB2aWEgV2ViU29ja2V0cyBvciBPU0MuXG4gKi9cbmNvbnN0IHNlcnZlciA9IHtcbiAgaW86IG51bGwsXG4gIHN0YXJ0OiBzdGFydCxcbiAgbWFwOiBtYXAsXG4gIGJyb2FkY2FzdDogYnJvYWRjYXN0LFxuICBlbnZDb25maWc6IHt9LCAvLyBob3N0IGVudiBjb25maWcgaW5mb3JtYXRpb25zIChkZXYgLyBwcm9kKVxuICBvc2M6IG51bGwsXG4gIHNlbmRPU0M6IHNlbmRPU0MsXG4gIHJlY2VpdmVPU0M6IHJlY2VpdmVPU0Ncbn07XG5cbmxldCBhdmFpbGFibGVDbGllbnRJbmRpY2VzID0gW107XG5sZXQgbmV4dENsaWVudEluZGV4ID0gMDtcbmxldCBvc2NMaXN0ZW5lcnMgPSBbXTtcbmxldCBleHByZXNzQXBwID0gbnVsbDtcbmxldCBodHRwU2VydmVyID0gbnVsbDtcblxuZnVuY3Rpb24gX2dldENsaWVudEluZGV4KCkge1xuICB2YXIgaW5kZXggPSAtMTtcblxuICBpZiAoYXZhaWxhYmxlQ2xpZW50SW5kaWNlcy5sZW5ndGggPiAwKSB7XG4gICAgYXZhaWxhYmxlQ2xpZW50SW5kaWNlcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgIHJldHVybiBhIC0gYjtcbiAgICB9KTtcblxuICAgIGluZGV4ID0gYXZhaWxhYmxlQ2xpZW50SW5kaWNlcy5zcGxpY2UoMCwgMSlbMF07XG4gIH0gZWxzZSB7XG4gICAgaW5kZXggPSBuZXh0Q2xpZW50SW5kZXgrKztcbiAgfVxuXG4gIHJldHVybiBpbmRleDtcbn1cblxuZnVuY3Rpb24gX3JlbGVhc2VDbGllbnRJbmRleChpbmRleCkge1xuICBhdmFpbGFibGVDbGllbnRJbmRpY2VzLnB1c2goaW5kZXgpO1xufVxuXG4vKipcbiAqIFN0YXJ0cyB0aGUgc2VydmVyLlxuICogQHBhcmFtIHtPYmplY3R9IGFwcCBFeHByZXNzIGFwcGxpY2F0aW9uLlxuICogQHBhcmFtIHtTdHJpbmd9IHB1YmxpY1BhdGggUHVibGljIHN0YXRpYyBkaXJlY3Rvcnkgb2YgdGhlIEV4cHJlc3MgYXBwLlxuICogQHBhcmFtIHtOdW1iZXJ9IHBvcnQgUG9ydC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5zb2NrZXRJTz17fV0gc29ja2V0LmlvIG9wdGlvbnMuIFRoZSBzb2NrZXQuaW8gY29uZmlnIG9iamVjdCBjYW4gaGF2ZSB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKiAtIGB0cmFuc3BvcnRzOlN0cmluZ2A6IGNvbW11bmljYXRpb24gdHJhbnNwb3J0IChkZWZhdWx0cyB0byBgJ3dlYnNvY2tldCdgKTtcbiAqIC0gYHBpbmdUaW1lb3V0Ok51bWJlcmA6IHRpbWVvdXQgKGluIG1pbGxpc2Vjb25kcykgYmVmb3JlIHRyeWluZyB0byByZWVzdGFibGlzaCBhIGNvbm5lY3Rpb24gYmV0d2VlbiBhIGxvc3QgY2xpZW50IGFuZCBhIHNlcnZlciAoZGVmYXV0bHMgdG8gYDYwMDAwYCk7XG4gKiAtIGBwaW5nSW50ZXJ2YWw6TnVtYmVyYDogdGltZSBpbnRlcnZhbCAoaW4gbWlsbGlzZWNvbmRzKSB0byBzZW5kIGEgcGluZyB0byBhIGNsaWVudCB0byBjaGVjayB0aGUgY29ubmVjdGlvbiAoZGVmYXVsdHMgdG8gYDUwMDAwYCkuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMub3NjPXt9XSBPU0Mgb3B0aW9ucy4gVGhlIE9TQyBjb25maWcgb2JqZWN0IGNhbiBoYXZlIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqIC0gYGxvY2FsQWRkcmVzczpTdHJpbmdgOiBhZGRyZXNzIG9mIHRoZSBsb2NhbCBtYWNoaW5lIHRvIHJlY2VpdmUgT1NDIG1lc3NhZ2VzIChkZWZhdWx0cyB0byBgJzEyNy4wLjAuMSdgKTtcbiAqIC0gYGxvY2FsUG9ydDpOdW1iZXJgOiBwb3J0IG9mIHRoZSBsb2NhbCBtYWNoaW5lIHRvIHJlY2VpdmUgT1NDIG1lc3NhZ2VzIChkZWZhdWx0cyB0byBgNTcxMjFgKTtcbiAqIC0gYHJlbW90ZUFkZHJlc3M6U3RyaW5nYDogYWRkcmVzcyBvZiB0aGUgZGV2aWNlIHRvIHNlbmQgZGVmYXVsdCBPU0MgbWVzc2FnZXMgdG8gKGRlZmF1bHRzIHRvIGAnMTI3LjAuMC4xJ2ApO1xuICogLSBgcmVtb3RlUG9ydDpOdW1iZXJgOiBwb3J0IG9mIHRoZSBkZXZpY2UgdG8gc2VuZCBkZWZhdWx0IE9TQyBtZXNzYWdlcyB0byAoZGVmYXVsdHMgdG8gYDU3MTIwYCkuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMuZW52PXt9XSBFbnZpcm9ubmVtZW50IG9wdGlvbnMgKHNldCBieSB0aGUgdXNlciwgZGVwZW5kcyBvbiB0aGUgc2NlbmFyaW8pLlxuICovXG5mdW5jdGlvbiBzdGFydChhcHAsIHB1YmxpY1BhdGgsIHBvcnQsIG9wdGlvbnMgPSB7fSkge1xuICBjb25zdCBzb2NrZXRJT09wdGlvbnMgPSAob3B0aW9ucy5zb2NrZXRJTyB8fMKge30pO1xuICBjb25zdCBzb2NrZXRDb25maWcgPSB7XG4gICAgdHJhbnNwb3J0czogc29ja2V0SU9PcHRpb25zLnRyYW5zcG9ydHMgfHzCoFsnd2Vic29ja2V0J10sXG4gICAgcGluZ1RpbWVvdXQ6IHNvY2tldElPT3B0aW9ucy5waW5nVGltZW91dCB8fMKgNjAwMDAsXG4gICAgcGluZ0ludGVydmFsOiBzb2NrZXRJT09wdGlvbnMucGluZ0ludGVydmFsIHx8wqA1MDAwMCxcbiAgfTtcblxuICBzZXJ2ZXIuZW52Q29uZmlnID0gb3B0aW9ucy5lbnY7XG5cbiAgYXBwLnNldCgncG9ydCcsIHByb2Nlc3MuZW52LlBPUlQgfHwgcG9ydCB8fCA4MDAwKTtcbiAgYXBwLnNldCgndmlldyBlbmdpbmUnLCAnZWpzJyk7XG4gIGFwcC51c2UoZXhwcmVzcy5zdGF0aWMocHVibGljUGF0aCkpO1xuXG4gIGh0dHBTZXJ2ZXIgPSBodHRwLmNyZWF0ZVNlcnZlcihhcHApO1xuICBleHByZXNzQXBwID0gYXBwO1xuXG4gIGh0dHBTZXJ2ZXIubGlzdGVuKGFwcC5nZXQoJ3BvcnQnKSwgZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5sb2coJ1NlcnZlciBsaXN0ZW5pbmcgb24gcG9ydCcsIGFwcC5nZXQoJ3BvcnQnKSk7XG4gIH0pO1xuXG4gIC8vIEVuZ2luZSBJTyBkZWZhdWx0c1xuICAvLyB0aGlzLnBpbmdUaW1lb3V0ID0gb3B0cy5waW5nVGltZW91dCB8fCAzMDAwO1xuICAvLyB0aGlzLnBpbmdJbnRlcnZhbCA9IG9wdHMucGluZ0ludGVydmFsIHx8IDEwMDA7XG4gIC8vIHRoaXMudXBncmFkZVRpbWVvdXQgPSBvcHRzLnVwZ3JhZGVUaW1lb3V0IHx8IDEwMDAwO1xuICAvLyB0aGlzLm1heEh0dHBCdWZmZXJTaXplID0gb3B0cy5tYXhIdHRwQnVmZmVyU2l6ZSB8fCAxMEU3O1xuXG4gIGlmIChodHRwU2VydmVyKSB7XG4gICAgc2VydmVyLmlvID0gbmV3IElPKGh0dHBTZXJ2ZXIsIHNvY2tldENvbmZpZyk7XG4gIH1cblxuICAvLyBPU0NcbiAgaWYgKG9wdGlvbnMub3NjKSB7XG4gICAgc2VydmVyLm9zYyA9IG5ldyBvc2MuVURQUG9ydCh7XG4gICAgICAvLyBUaGlzIGlzIHRoZSBwb3J0IHdlJ3JlIGxpc3RlbmluZyBvbi5cbiAgICAgIGxvY2FsQWRkcmVzczogb3B0aW9ucy5vc2MubG9jYWxBZGRyZXNzIHx8ICcxMjcuMC4wLjEnLFxuICAgICAgbG9jYWxQb3J0OiBvcHRpb25zLm9zYy5sb2NhbFBvcnQgfHwgNTcxMjEsXG5cbiAgICAgIC8vIFRoaXMgaXMgdGhlIHBvcnQgd2UgdXNlIHRvIHNlbmQgbWVzc2FnZXMuXG4gICAgICByZW1vdGVBZGRyZXNzOiBvcHRpb25zLm9zYy5yZW1vdGVBZGRyZXNzIHx8ICcxMjcuMC4wLjEnLFxuICAgICAgcmVtb3RlUG9ydDogb3B0aW9ucy5vc2MucmVtb3RlUG9ydCB8fCA1NzEyMCxcbiAgICB9KTtcblxuICAgIHNlcnZlci5vc2Mub24oJ3JlYWR5JywgKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ0xpc3RlbmluZyBmb3IgT1NDIG92ZXIgVURQIG9uIHBvcnQgJyArIG9wdGlvbnMub3NjLmxvY2FsUG9ydCArICcuJyk7XG4gICAgfSk7XG5cbiAgICBzZXJ2ZXIub3NjLm9uKCdtZXNzYWdlJywgKG9zY01zZykgPT4ge1xuICAgICAgY29uc3QgYWRkcmVzcyA9IG9zY01zZy5hZGRyZXNzO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9zY0xpc3RlbmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoYWRkcmVzcyA9PT0gb3NjTGlzdGVuZXJzW2ldLndpbGRjYXJkKVxuICAgICAgICAgIG9zY0xpc3RlbmVyc1tpXS5jYWxsYmFjayhvc2NNc2cpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgc2VydmVyLm9zYy5vcGVuKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBJbmRpY2F0ZXMgdGhhdCB0aGUgY2xpZW50cyBvZiB0eXBlIGBjbGllbnRUeXBlYCByZXF1aXJlIHRoZSBtb2R1bGVzIGAuLi5tb2R1bGVzYCBvbiB0aGUgc2VydmVyIHNpZGUuXG4gKiBBZGRpdGlvbmFsbHksIHRoaXMgbWV0aG9kIHJvdXRlcyB0aGUgY29ubmVjdGlvbnMgZnJvbSB0aGUgY29ycmVzcG9uZGluZyBVUkwgdG8gdGhlIGNvcnJlc3BvbmRpbmcgdmlldy5cbiAqIE1vcmUgc3BlY2lmaWNhbGx5OlxuICogLSBBIGNsaWVudCBjb25uZWN0aW5nIHRvIHRoZSBzZXJ2ZXIgdGhyb3VnaCB0aGUgcm9vdCBVUkwgYGh0dHA6Ly9teS5zZXJ2ZXIuYWRkcmVzczpwb3J0L2AgaXMgY29uc2lkZXJlZCBhcyBhIGAncGxheWVyJ2AgY2xpZW50IGFuZCBkaXNwbGF5cyB0aGUgdmlldyBgcGxheWVyLmVqc2A7XG4gKiAtIEEgY2xpZW50IGNvbm5lY3RpbmcgdG8gdGhlIHNlcnZlciB0aHJvdWdoIHRoZSBVUkwgYGh0dHA6Ly9teS5zZXJ2ZXIuYWRkcmVzczpwb3J0L2NsaWVudFR5cGVgIGlzIGNvbnNpZGVyZWQgYXMgYSBgY2xpZW50VHlwZWAgY2xpZW50LCBhbmQgZGlzcGxheXMgdGhlIHZpZXcgYGNsaWVudFR5cGUuZWpzYC5cbiAqIEBwYXJhbSB7U3RyaW5nfSBjbGllbnRUeXBlIENsaWVudCB0eXBlIChhcyBkZWZpbmVkIGJ5IHRoZSBtZXRob2Qge0BsaW5rIGNsaWVudC5pbml0fSBvbiB0aGUgY2xpZW50IHNpZGUpLlxuICogQHBhcmFtIHsuLi5DbGllbnRNb2R1bGV9IG1vZHVsZXMgTW9kdWxlcyB0byBtYXAgdG8gdGhhdCBjbGllbnQgdHlwZS5cbiAqL1xuZnVuY3Rpb24gbWFwKGNsaWVudFR5cGUsIC4uLm1vZHVsZXMpIHtcbiAgdmFyIHVybCA9ICcvJztcblxuICAvLyBjYWNoZSBjb21waWxlZCB0ZW1wbGF0ZVxuICBjb25zdCB0bXBsUGF0aD0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICd2aWV3cycsIGNsaWVudFR5cGUgKyAnLmVqcycpO1xuICBjb25zdCB0bXBsU3RyaW5nID0gZnMucmVhZEZpbGVTeW5jKHRtcGxQYXRoLCB7IGVuY29kaW5nOiAndXRmOCcgfSk7XG4gIGNvbnN0IHRtcGwgPSBlanMuY29tcGlsZSh0bXBsU3RyaW5nKTtcblxuICBpZiAoY2xpZW50VHlwZSAhPT0gJ3BsYXllcicpXG4gICAgdXJsICs9IGNsaWVudFR5cGU7XG5cbiAgZXhwcmVzc0FwcC5nZXQodXJsLCBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgIHJlcy5zZW5kKHRtcGwoeyBlbnZDb25maWc6IEpTT04uc3RyaW5naWZ5KHNlcnZlci5lbnZDb25maWcpIH0pKTtcbiAgfSk7XG5cbiAgc2VydmVyLmlvLm9mKGNsaWVudFR5cGUpLm9uKCdjb25uZWN0aW9uJywgKHNvY2tldCkgPT4ge1xuICAgIGxvZy5pbmZvKHsgc29ja2V0OiBzb2NrZXQsIGNsaWVudFR5cGU6IGNsaWVudFR5cGUgfSwgJ2Nvbm5lY3Rpb24nKTtcbiAgICB2YXIgY2xpZW50ID0gbmV3IFNlcnZlckNsaWVudChjbGllbnRUeXBlLCBzb2NrZXQpO1xuXG4gICAgdmFyIGluZGV4ID0gX2dldENsaWVudEluZGV4KCk7XG4gICAgY2xpZW50LmluZGV4ID0gaW5kZXg7XG5cbiAgICBmb3IgKGxldCBtb2Qgb2YgbW9kdWxlcykge1xuICAgICAgbW9kLmNvbm5lY3QoY2xpZW50KTtcbiAgICB9XG5cbiAgICBjbGllbnQucmVjZWl2ZSgnZGlzY29ubmVjdCcsICgpID0+IHtcbiAgICAgIGxvZy5pbmZvKHsgc29ja2V0OiBzb2NrZXQsIGNsaWVudFR5cGU6IGNsaWVudFR5cGUgfSwgJ2Rpc2Nvbm5lY3QnKTtcbiAgICAgIGZvciAobGV0IGkgPSBtb2R1bGVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIHZhciBtb2QgPSBtb2R1bGVzW2ldO1xuICAgICAgICBtb2QuZGlzY29ubmVjdChjbGllbnQpO1xuICAgICAgfVxuXG4gICAgICBfcmVsZWFzZUNsaWVudEluZGV4KGNsaWVudC5pbmRleCk7XG4gICAgICBjbGllbnQuaW5kZXggPSAtMTtcbiAgICB9KTtcblxuICAgIGNsaWVudC5zZW5kKCdjbGllbnQ6c3RhcnQnLCBpbmRleCk7IC8vIHRoZSBzZXJ2ZXIgaXMgcmVhZHlcbiAgfSk7XG59XG5cbi8qKlxuICogU2VuZHMgYSBXZWJTb2NrZXQgbWVzc2FnZSB0byBhbGwgdGhlIGNsaWVudHMgb2YgdHlwZSBgY2xpZW50VHlwZWAuXG4gKlxuICogKipOb3RlOioqIG9uIHRoZSBjbGllbnQgc2lkZSwgdGhlIGNsaWVudHMgcmVjZWl2ZSB0aGUgbWVzc2FnZSB3aXRoIHRoZSBtZXRob2Qge0BsaW5rIGNsaWVudC5yZWNlaXZlfS5cbiAqIEBwYXJhbSB7U3RyaW5nfSBjbGllbnRUeXBlIENsaWVudCB0eXBlIChhcyBkZWZpbmVkIGJ5IHRoZSBtZXRob2Qge0BsaW5rIGNsaWVudC5pbml0fSBvbiB0aGUgY2xpZW50IHNpZGUpLlxuICogQHBhcmFtIHtTdHJpbmd9IG1zZyBOYW1lIG9mIHRoZSBtZXNzYWdlIHRvIHNlbmQuXG4gKiBAcGFyYW0gey4uLip9IGFyZ3MgQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuICogQHRvZG8gc29sdmUgLi4uIHByb2JsZW1cbiAqL1xuZnVuY3Rpb24gYnJvYWRjYXN0KGNsaWVudFR5cGUsIG1zZywgLi4uYXJncykge1xuICBpZiAoc2VydmVyLmlvKSB7XG4gICAgbG9nLmluZm8oeyBjbGllbnRUeXBlOiBjbGllbnRUeXBlLCBjaGFubmVsOiBtc2csIGFyZ3VtZW50czogYXJncyB9LCAnYnJvYWRjYXN0Jyk7XG4gICAgc2VydmVyLmlvLm9mKCcvJyArIGNsaWVudFR5cGUpLmVtaXQobXNnLCAuLi5hcmdzKTtcbiAgfVxufVxuXG4vKipcbiAqIFNlbmRzIGFuIE9TQyBtZXNzYWdlLlxuICogQHBhcmFtIHtTdHJpbmd9IHdpbGRjYXJkIFdpbGRjYXJkIG9mIHRoZSBPU0MgbWVzc2FnZS5cbiAqIEBwYXJhbSB7QXJyYXl9IGFyZ3MgQXJndW1lbnRzIG9mIHRoZSBPU0MgbWVzc2FnZS5cbiAqIEBwYXJhbSB7U3RyaW5nfSBbdXJsPW51bGxdIFVSTCB0byBzZW5kIHRoZSBPU0MgbWVzc2FnZSB0byAoaWYgbm90IHNwZWNpZmllZCwgdXNlcyB0aGUgYWRkcmVzcyBkZWZpbmVkIGluIHRoZSBPU0MgY29uZmlnIG9yIGluIHRoZSBvcHRpb25zIG9mIHRoZSB7QGxpbmsgc2VydmVyLnN0YXJ0fSBtZXRob2QpLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtwb3J0PW51bGxdIFBvcnQgdG8gc2VuZCB0aGUgbWVzc2FnZSB0byAoaWYgbm90IHNwZWNpZmllZCwgdXNlcyB0aGUgcG9ydCBkZWZpbmVkIGluIHRoZSBPU0MgY29uZmlnIG9yIGluIHRoZSBvcHRpb25zIG9mIHRoZSB7QGxpbmsgc2VydmVyLnN0YXJ0fSBtZXRob2QpLlxuICovXG5mdW5jdGlvbiBzZW5kT1NDKHdpbGRjYXJkLCBhcmdzLCB1cmwgPSBudWxsLCBwb3J0ID0gbnVsbCkge1xuICBjb25zdCBvc2NNc2cgPSB7XG4gICAgYWRkcmVzczogd2lsZGNhcmQsXG4gICAgYXJnczogYXJnc1xuICB9O1xuXG4gIHRyeSB7XG4gICAgaWYgKHVybCAmJiBwb3J0KVxuICAgICAgc2VydmVyLm9zYy5zZW5kKG9zY01zZywgdXJsLCBwb3J0KTtcbiAgICBlbHNlXG4gICAgICBzZXJ2ZXIub3NjLnNlbmQob3NjTXNnKTsgLy8gdXNlIGRlZmF1bHRzIChhcyBkZWZpbmVkIGluIHRoZSBjb25maWcpXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmxvZygnRXJyb3Igd2hpbGUgc2VuZGluZyBPU0MgbWVzc2FnZTonLCBlKTtcbiAgfVxufVxuXG4vKipcbiAqIEV4ZWN1dGVzIGEgY2FsbGJhY2sgZnVuY3Rpb24gd2hlbiBpdCByZWNlaXZlcyBhbiBPU0MgbWVzc2FnZS5cbiAqIFRoZSBzZXJ2ZXIgbGlzdGVucyB0byBPU0MgbWVzc2FnZXMgYXQgdGhlIGFkZHJlc3MgYW5kIHBvcnQgZGVmaW5lZCBpbiB0aGUgY29uZmlnIG9yIGluIHRoZSBvcHRpb25zIG9mIHRoZSB7QGxpbmsgc2VydmVyLnN0YXJ0fSBtZXRob2QuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHdpbGRjYXJkIFdpbGRjYXJkIG9mIHRoZSBPU0MgbWVzc2FnZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIENhbGxiYWNrIGZ1bmN0aW9uIGV4ZWN1dGVkIHdoZW4gdGhlIE9TQyBtZXNzYWdlIGlzIHJlY2VpdmVkLlxuICovXG5mdW5jdGlvbiByZWNlaXZlT1NDKHdpbGRjYXJkLCBjYWxsYmFjaykge1xuICBjb25zdCBvc2NMaXN0ZW5lciA9IHtcbiAgICB3aWxkY2FyZDogd2lsZGNhcmQsXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gIH07XG5cbiAgb3NjTGlzdGVuZXJzLnB1c2gob3NjTGlzdGVuZXIpO1xufVxuXG4vLyBleHBvcnQgZGVmYXVsdCBzZXJ2ZXI7XG5tb2R1bGUuZXhwb3J0cyA9IHNlcnZlcjtcbiJdfQ==