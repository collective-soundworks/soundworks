'use strict';

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Module = require('./Module');

var _Module2 = _interopRequireDefault(_Module);

var _mobileDetect = require('mobile-detect');

var _mobileDetect2 = _interopRequireDefault(_mobileDetect);

// debug - http://socket.io/docs/logging-and-debugging/#available-debugging-scopes
// localStorage.debug = '*';

/**
 * The `client` object contains the basic methods of the client. For instance, the object initializes the client type with `init` and establishes WebSocket communications with the server through the methods `send` and `receive`. Additionally, it starts the scenario and sequences the modules using the methods `start`, `serial` and `parallel`.
 * @type {Object}
 */
var client = {
  type: null,
  ready: null,
  index: -1,
  coordinates: null,
  init: init,
  start: start,
  // deprecated functions
  serial: serial,
  parallel: parallel,

  io: null,
  socket: null,
  send: send,
  receive: receive,
  removeListener: removeListener,
  platform: {
    os: null,
    isMobile: null,
    audioFileExt: '',
    isForbidden: false
  }
};

// get informations about client
var ua = window.navigator.userAgent;
var md = new _mobileDetect2['default'](ua);
client.platform.isMobile = md.mobile() !== null; // true if phone or tablet
client.platform.os = (function () {
  var os = md.os();

  if (os === 'AndroidOS') {
    return 'android';
  } else if (os === 'iOS') {
    return 'ios';
  } else {
    return 'other';
  }
})();

// audio file extention check
var a = document.createElement('audio');
// http://diveintohtml5.info/everything.html
if (!!(a.canPlayType && a.canPlayType('audio/mpeg;'))) {
  client.platform.audioFileExt = '.mp3';
} else if (!!(a.canPlayType && a.canPlayType('audio/ogg; codecs="vorbis"'))) {
  client.platform.audioFileExt = '.ogg';
} else {
  client.platform.audioFileExt = '.wav';
}

/**
 * The `init` method sets the client type and initializes a WebSocket connection associated with the given type.
 * @param {String} [clientType = 'player'] The client type.
 * @todo clarify clientType.
 * @param {Object} [options = {}] The options to initialize a client
 * @param {Boolean} [options.io] By default, a Soundworks application has a client and a server side. For a standalone application (client side only), use `options.io = false`.
 * @todo use default value for options.io in the documentation?
 * @param {String} [options.socketUrl] The URL of the WebSocket server.
 */
function init() {
  var clientType = arguments.length <= 0 || arguments[0] === undefined ? 'player' : arguments[0];
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  client.type = clientType;
  client.io = null;

  if (options.io === undefined) {
    options.io = true;
  }
  if (options.socketUrl === undefined) {
    options.socketUrl = '';
  }

  if (options.io !== false) {
    var io = require('socket.io-client');

    client.io = io;
    client.socket = client.io(options.socketUrl + '/' + clientType, {
      transports: ['websocket']
    });

    client.ready = new _Promise(function (resolve) {
      client.receive('client:start', function (index) {
        client.index = index;
        resolve();
      });
    });
  }
}

/**
 * Starts the module logic (*i.e.* the application).
 * @param {Function} startFun [todo]
 * @todo Clarify the param.
 * @return {Promise} The Promise return value.
 * @todo Clarify return value (promise).
 * @todo example
 */
function start(startFun) {
  var module = startFun; // be compatible with previous version

  if (typeof startFun === 'function') module = startFun(_Module2['default'].sequential, _Module2['default'].parallel);

  var promise = module.createPromise();

  if (client.io) {
    client.ready.then(function () {
      return module.launch();
    });

    client.receive('disconnect', function () {
      // console.log('disconnect', client.index);
    });

    client.receive('reconnect', function () {
      // console.log('reconnect', client.index);
    });
  } else {
      // no client i/o, no server
      module.launch();
    }

  return promise;
}

/**
 * The `serial` method returns a `Module` that starts the given `...modules` in series. After starting the first module (by calling its `start` method), the next module in the series is started (with its `start` method) when the last module called its `done` method. When the last module calls `done`, the returned serial module calls its own `done` method.
 *
 * **Note:** you can compound serial module sequences with parallel module combinations (*e.g.* `client.serial(module1, client.parallel(module2, module3), module4);`).
 * @deprecated Use the new API with the {@link start} method.
 * @param {...Module} ...modules The modules to run in serial.
 * @return {Promise} [description]
 * @todo Clarify return value
 */
function serial() {
  console.log('The function "client.serial" is deprecated. Please use the new API instead.');
  return _Module2['default'].sequential.apply(_Module2['default'], arguments);
}

/**
 * The `Module` returned by the `parallel` method starts the given `...modules` in parallel (with their `start` methods), and calls its `done` method after all modules called their own `done` methods.
 *
 * **Note:** you can compound parallel module combinations with serial module sequences (*e.g.* `client.parallel(module1, client.serial(module2, module3), module4);`).
 *
 * **Note:** the `view` of a module is always full screen, so in the case where modules run in parallel, their `view`s are stacked on top of each other using the `z-index` CSS property.
 * We use the order of the `parallel` method's arguments to determine the order of the stack (*e.g.* in `client.parallel(module1, module2, module3)`, the `view` of `module1` is displayed on top of the `view` of `module2`, which is displayed on top of the `view` of `module3`).
 * @deprecated Use the new API with the {@link start} method.
 * @param {...Module} modules The modules to run in parallel.
 * @return {Promise} [description]
 * @todo Clarify return value
 */
function parallel() {
  console.log('The function "client.parallel" is deprecated. Please use the new API instead.');
  return _Module2['default'].parallel.apply(_Module2['default'], arguments);
}

/**
 * Sends a WebSocket message to the server.
 *
 * **Note:** on the server side, the server receives the message with the command {@link ServerClient#receive}.
 * @param {String} msg Name of the message to send.
 * @param {...*} args Arguments of the message (as many as needed, of any type).
 */
function send(msg) {
  var _client$socket;

  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  if (client.socket) (_client$socket = client.socket).emit.apply(_client$socket, [msg].concat(args));
}

/**
 * Executes a callback function when it receives a WebSocket message from the server.
 *
 * **Note:** on the server side, the server sends the message with the command {@link server.send}`.
 * @param {String} msg Name of the received message.
 * @param {Function} callback Callback function executed when the message is received.
 */
function receive(msg, callback) {
  if (client.socket) {
    client.socket.removeListener(msg, callback);
    client.socket.on(msg, callback);
  }
}

/**
 * [removeListener description]
 * @private
 * @param {[type]} msg [description]
 * @param {Function} callback [description]
 * @todo doc
 */
function removeListener(msg, callback) {
  if (client.socket) client.socket.removeListener(msg, callback);
}

exports['default'] = client;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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LG9CQUFPLFVBQVUsTUFBQSxnQ0FBWSxDQUFDO0NBQ3RDOzs7Ozs7Ozs7Ozs7OztBQWNELFNBQVMsUUFBUSxHQUFhO0FBQzVCLFNBQU8sQ0FBQyxHQUFHLENBQUMsK0VBQStFLENBQUMsQ0FBQztBQUM3RixTQUFPLG9CQUFPLFFBQVEsTUFBQSxnQ0FBWSxDQUFDO0NBQ3BDOzs7Ozs7Ozs7QUFTRCxTQUFTLElBQUksQ0FBQyxHQUFHLEVBQVc7OztvQ0FBTixJQUFJO0FBQUosUUFBSTs7O0FBQ3hCLE1BQUksTUFBTSxDQUFDLE1BQU0sRUFDZixrQkFBQSxNQUFNLENBQUMsTUFBTSxFQUFDLElBQUksTUFBQSxrQkFBQyxHQUFHLFNBQUssSUFBSSxFQUFDLENBQUM7Q0FDcEM7Ozs7Ozs7OztBQVNELFNBQVMsT0FBTyxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUU7QUFDOUIsTUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFO0FBQ2pCLFVBQU0sQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUM1QyxVQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7R0FDakM7Q0FDRjs7Ozs7Ozs7O0FBU0QsU0FBUyxjQUFjLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRTtBQUNyQyxNQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQ2YsTUFBTSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0NBQy9DOztxQkFFYyxNQUFNIiwiZmlsZSI6InNyYy9jbGllbnQvY2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE1vZHVsZSBmcm9tICcuL01vZHVsZSc7XG5pbXBvcnQgTW9iaWxlRGV0ZWN0IGZyb20gJ21vYmlsZS1kZXRlY3QnO1xuXG4vLyBkZWJ1ZyAtIGh0dHA6Ly9zb2NrZXQuaW8vZG9jcy9sb2dnaW5nLWFuZC1kZWJ1Z2dpbmcvI2F2YWlsYWJsZS1kZWJ1Z2dpbmctc2NvcGVzXG4vLyBsb2NhbFN0b3JhZ2UuZGVidWcgPSAnKic7XG5cbi8qKlxuICogVGhlIGBjbGllbnRgIG9iamVjdCBjb250YWlucyB0aGUgYmFzaWMgbWV0aG9kcyBvZiB0aGUgY2xpZW50LiBGb3IgaW5zdGFuY2UsIHRoZSBvYmplY3QgaW5pdGlhbGl6ZXMgdGhlIGNsaWVudCB0eXBlIHdpdGggYGluaXRgIGFuZCBlc3RhYmxpc2hlcyBXZWJTb2NrZXQgY29tbXVuaWNhdGlvbnMgd2l0aCB0aGUgc2VydmVyIHRocm91Z2ggdGhlIG1ldGhvZHMgYHNlbmRgIGFuZCBgcmVjZWl2ZWAuIEFkZGl0aW9uYWxseSwgaXQgc3RhcnRzIHRoZSBzY2VuYXJpbyBhbmQgc2VxdWVuY2VzIHRoZSBtb2R1bGVzIHVzaW5nIHRoZSBtZXRob2RzIGBzdGFydGAsIGBzZXJpYWxgIGFuZCBgcGFyYWxsZWxgLlxuICogQHR5cGUge09iamVjdH1cbiAqL1xudmFyIGNsaWVudCA9IHtcbiAgdHlwZTogbnVsbCxcbiAgcmVhZHk6IG51bGwsXG4gIGluZGV4OiAtMSxcbiAgY29vcmRpbmF0ZXM6IG51bGwsXG4gIGluaXQ6IGluaXQsXG4gIHN0YXJ0OiBzdGFydCxcbiAgLy8gZGVwcmVjYXRlZCBmdW5jdGlvbnNcbiAgc2VyaWFsOiBzZXJpYWwsXG4gIHBhcmFsbGVsOiBwYXJhbGxlbCxcblxuICBpbzogbnVsbCxcbiAgc29ja2V0OiBudWxsLFxuICBzZW5kOiBzZW5kLFxuICByZWNlaXZlOiByZWNlaXZlLFxuICByZW1vdmVMaXN0ZW5lcjogcmVtb3ZlTGlzdGVuZXIsXG4gIHBsYXRmb3JtOiB7XG4gICAgb3M6IG51bGwsXG4gICAgaXNNb2JpbGU6IG51bGwsXG4gICAgYXVkaW9GaWxlRXh0OiAnJyxcbiAgICBpc0ZvcmJpZGRlbjogZmFsc2VcbiAgfVxufTtcblxuLy8gZ2V0IGluZm9ybWF0aW9ucyBhYm91dCBjbGllbnRcbmNvbnN0IHVhID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnRcbmNvbnN0IG1kID0gbmV3IE1vYmlsZURldGVjdCh1YSk7XG5jbGllbnQucGxhdGZvcm0uaXNNb2JpbGUgPSAobWQubW9iaWxlKCkgIT09IG51bGwpOyAvLyB0cnVlIGlmIHBob25lIG9yIHRhYmxldFxuY2xpZW50LnBsYXRmb3JtLm9zID0gKCgpID0+IHtcbiAgbGV0IG9zID0gbWQub3MoKTtcblxuICBpZiAob3MgPT09ICdBbmRyb2lkT1MnKSB7XG4gICAgcmV0dXJuICdhbmRyb2lkJztcbiAgfSBlbHNlIGlmIChvcyA9PT0gJ2lPUycpIHtcbiAgICByZXR1cm4gJ2lvcyc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICdvdGhlcic7XG4gIH1cbn0pKCk7XG5cbi8vIGF1ZGlvIGZpbGUgZXh0ZW50aW9uIGNoZWNrXG5jb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYXVkaW8nKTtcbi8vIGh0dHA6Ly9kaXZlaW50b2h0bWw1LmluZm8vZXZlcnl0aGluZy5odG1sXG5pZiAoISEoYS5jYW5QbGF5VHlwZSAmJiBhLmNhblBsYXlUeXBlKCdhdWRpby9tcGVnOycpKSkge1xuICBjbGllbnQucGxhdGZvcm0uYXVkaW9GaWxlRXh0ID0gJy5tcDMnO1xufSBlbHNlIGlmICghIShhLmNhblBsYXlUeXBlICYmIGEuY2FuUGxheVR5cGUoJ2F1ZGlvL29nZzsgY29kZWNzPVwidm9yYmlzXCInKSkpIHtcbiAgY2xpZW50LnBsYXRmb3JtLmF1ZGlvRmlsZUV4dCA9ICcub2dnJztcbn0gZWxzZSB7XG4gIGNsaWVudC5wbGF0Zm9ybS5hdWRpb0ZpbGVFeHQgPSAnLndhdic7XG59XG5cbi8qKlxuICogVGhlIGBpbml0YCBtZXRob2Qgc2V0cyB0aGUgY2xpZW50IHR5cGUgYW5kIGluaXRpYWxpemVzIGEgV2ViU29ja2V0IGNvbm5lY3Rpb24gYXNzb2NpYXRlZCB3aXRoIHRoZSBnaXZlbiB0eXBlLlxuICogQHBhcmFtIHtTdHJpbmd9IFtjbGllbnRUeXBlID0gJ3BsYXllciddIFRoZSBjbGllbnQgdHlwZS5cbiAqIEB0b2RvIGNsYXJpZnkgY2xpZW50VHlwZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucyA9IHt9XSBUaGUgb3B0aW9ucyB0byBpbml0aWFsaXplIGEgY2xpZW50XG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmlvXSBCeSBkZWZhdWx0LCBhIFNvdW5kd29ya3MgYXBwbGljYXRpb24gaGFzIGEgY2xpZW50IGFuZCBhIHNlcnZlciBzaWRlLiBGb3IgYSBzdGFuZGFsb25lIGFwcGxpY2F0aW9uIChjbGllbnQgc2lkZSBvbmx5KSwgdXNlIGBvcHRpb25zLmlvID0gZmFsc2VgLlxuICogQHRvZG8gdXNlIGRlZmF1bHQgdmFsdWUgZm9yIG9wdGlvbnMuaW8gaW4gdGhlIGRvY3VtZW50YXRpb24/XG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuc29ja2V0VXJsXSBUaGUgVVJMIG9mIHRoZSBXZWJTb2NrZXQgc2VydmVyLlxuICovXG5mdW5jdGlvbiBpbml0KGNsaWVudFR5cGUgPSAncGxheWVyJywgb3B0aW9ucyA9IHt9KSB7XG4gIGNsaWVudC50eXBlID0gY2xpZW50VHlwZTtcbiAgY2xpZW50LmlvID0gbnVsbDtcblxuICBpZiAob3B0aW9ucy5pbyA9PT0gdW5kZWZpbmVkKSB7IG9wdGlvbnMuaW8gPSB0cnVlOyB9XG4gIGlmIChvcHRpb25zLnNvY2tldFVybCA9PT0gdW5kZWZpbmVkKSB7IG9wdGlvbnMuc29ja2V0VXJsID0gJyc7IH1cblxuICBpZiAob3B0aW9ucy5pbyAhPT0gZmFsc2UpIHtcbiAgICB2YXIgaW8gPSByZXF1aXJlKCdzb2NrZXQuaW8tY2xpZW50Jyk7XG5cbiAgICBjbGllbnQuaW8gPSBpbztcbiAgICBjbGllbnQuc29ja2V0ID0gY2xpZW50LmlvKG9wdGlvbnMuc29ja2V0VXJsICsgJy8nICsgY2xpZW50VHlwZSwge1xuICAgICAgdHJhbnNwb3J0czogWyd3ZWJzb2NrZXQnXVxuICAgIH0pO1xuXG4gICAgY2xpZW50LnJlYWR5ID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgIGNsaWVudC5yZWNlaXZlKCdjbGllbnQ6c3RhcnQnLCAoaW5kZXgpID0+IHtcbiAgICAgICAgY2xpZW50LmluZGV4ID0gaW5kZXg7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogU3RhcnRzIHRoZSBtb2R1bGUgbG9naWMgKCppLmUuKiB0aGUgYXBwbGljYXRpb24pLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gc3RhcnRGdW4gW3RvZG9dXG4gKiBAdG9kbyBDbGFyaWZ5IHRoZSBwYXJhbS5cbiAqIEByZXR1cm4ge1Byb21pc2V9IFRoZSBQcm9taXNlIHJldHVybiB2YWx1ZS5cbiAqIEB0b2RvIENsYXJpZnkgcmV0dXJuIHZhbHVlIChwcm9taXNlKS5cbiAqIEB0b2RvIGV4YW1wbGVcbiAqL1xuZnVuY3Rpb24gc3RhcnQoc3RhcnRGdW4pIHtcbiAgbGV0IG1vZHVsZSA9IHN0YXJ0RnVuOyAvLyBiZSBjb21wYXRpYmxlIHdpdGggcHJldmlvdXMgdmVyc2lvblxuXG4gIGlmICh0eXBlb2Ygc3RhcnRGdW4gPT09ICdmdW5jdGlvbicpXG4gICAgbW9kdWxlID0gc3RhcnRGdW4oTW9kdWxlLnNlcXVlbnRpYWwsIE1vZHVsZS5wYXJhbGxlbCk7XG5cbiAgbGV0IHByb21pc2UgPSBtb2R1bGUuY3JlYXRlUHJvbWlzZSgpO1xuXG4gIGlmIChjbGllbnQuaW8pIHtcbiAgICBjbGllbnQucmVhZHlcbiAgICAgIC50aGVuKCgpID0+IG1vZHVsZS5sYXVuY2goKSk7XG5cbiAgICBjbGllbnQucmVjZWl2ZSgnZGlzY29ubmVjdCcsICgpID0+IHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdkaXNjb25uZWN0JywgY2xpZW50LmluZGV4KTtcbiAgICB9KTtcblxuICAgIGNsaWVudC5yZWNlaXZlKCdyZWNvbm5lY3QnLCAoKSA9PiB7XG4gICAgICAvLyBjb25zb2xlLmxvZygncmVjb25uZWN0JywgY2xpZW50LmluZGV4KTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICAvLyBubyBjbGllbnQgaS9vLCBubyBzZXJ2ZXJcbiAgICBtb2R1bGUubGF1bmNoKCk7XG4gIH1cblxuICByZXR1cm4gcHJvbWlzZTtcbn1cblxuLyoqXG4gKiBUaGUgYHNlcmlhbGAgbWV0aG9kIHJldHVybnMgYSBgTW9kdWxlYCB0aGF0IHN0YXJ0cyB0aGUgZ2l2ZW4gYC4uLm1vZHVsZXNgIGluIHNlcmllcy4gQWZ0ZXIgc3RhcnRpbmcgdGhlIGZpcnN0IG1vZHVsZSAoYnkgY2FsbGluZyBpdHMgYHN0YXJ0YCBtZXRob2QpLCB0aGUgbmV4dCBtb2R1bGUgaW4gdGhlIHNlcmllcyBpcyBzdGFydGVkICh3aXRoIGl0cyBgc3RhcnRgIG1ldGhvZCkgd2hlbiB0aGUgbGFzdCBtb2R1bGUgY2FsbGVkIGl0cyBgZG9uZWAgbWV0aG9kLiBXaGVuIHRoZSBsYXN0IG1vZHVsZSBjYWxscyBgZG9uZWAsIHRoZSByZXR1cm5lZCBzZXJpYWwgbW9kdWxlIGNhbGxzIGl0cyBvd24gYGRvbmVgIG1ldGhvZC5cbiAqXG4gKiAqKk5vdGU6KiogeW91IGNhbiBjb21wb3VuZCBzZXJpYWwgbW9kdWxlIHNlcXVlbmNlcyB3aXRoIHBhcmFsbGVsIG1vZHVsZSBjb21iaW5hdGlvbnMgKCplLmcuKiBgY2xpZW50LnNlcmlhbChtb2R1bGUxLCBjbGllbnQucGFyYWxsZWwobW9kdWxlMiwgbW9kdWxlMyksIG1vZHVsZTQpO2ApLlxuICogQGRlcHJlY2F0ZWQgVXNlIHRoZSBuZXcgQVBJIHdpdGggdGhlIHtAbGluayBzdGFydH0gbWV0aG9kLlxuICogQHBhcmFtIHsuLi5Nb2R1bGV9IC4uLm1vZHVsZXMgVGhlIG1vZHVsZXMgdG8gcnVuIGluIHNlcmlhbC5cbiAqIEByZXR1cm4ge1Byb21pc2V9IFtkZXNjcmlwdGlvbl1cbiAqIEB0b2RvIENsYXJpZnkgcmV0dXJuIHZhbHVlXG4gKi9cbmZ1bmN0aW9uIHNlcmlhbCguLi5tb2R1bGVzKSB7XG4gIGNvbnNvbGUubG9nKCdUaGUgZnVuY3Rpb24gXCJjbGllbnQuc2VyaWFsXCIgaXMgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSB0aGUgbmV3IEFQSSBpbnN0ZWFkLicpO1xuICByZXR1cm4gTW9kdWxlLnNlcXVlbnRpYWwoLi4ubW9kdWxlcyk7XG59XG5cbi8qKlxuICogVGhlIGBNb2R1bGVgIHJldHVybmVkIGJ5IHRoZSBgcGFyYWxsZWxgIG1ldGhvZCBzdGFydHMgdGhlIGdpdmVuIGAuLi5tb2R1bGVzYCBpbiBwYXJhbGxlbCAod2l0aCB0aGVpciBgc3RhcnRgIG1ldGhvZHMpLCBhbmQgY2FsbHMgaXRzIGBkb25lYCBtZXRob2QgYWZ0ZXIgYWxsIG1vZHVsZXMgY2FsbGVkIHRoZWlyIG93biBgZG9uZWAgbWV0aG9kcy5cbiAqXG4gKiAqKk5vdGU6KiogeW91IGNhbiBjb21wb3VuZCBwYXJhbGxlbCBtb2R1bGUgY29tYmluYXRpb25zIHdpdGggc2VyaWFsIG1vZHVsZSBzZXF1ZW5jZXMgKCplLmcuKiBgY2xpZW50LnBhcmFsbGVsKG1vZHVsZTEsIGNsaWVudC5zZXJpYWwobW9kdWxlMiwgbW9kdWxlMyksIG1vZHVsZTQpO2ApLlxuICpcbiAqICoqTm90ZToqKiB0aGUgYHZpZXdgIG9mIGEgbW9kdWxlIGlzIGFsd2F5cyBmdWxsIHNjcmVlbiwgc28gaW4gdGhlIGNhc2Ugd2hlcmUgbW9kdWxlcyBydW4gaW4gcGFyYWxsZWwsIHRoZWlyIGB2aWV3YHMgYXJlIHN0YWNrZWQgb24gdG9wIG9mIGVhY2ggb3RoZXIgdXNpbmcgdGhlIGB6LWluZGV4YCBDU1MgcHJvcGVydHkuXG4gKiBXZSB1c2UgdGhlIG9yZGVyIG9mIHRoZSBgcGFyYWxsZWxgIG1ldGhvZCdzIGFyZ3VtZW50cyB0byBkZXRlcm1pbmUgdGhlIG9yZGVyIG9mIHRoZSBzdGFjayAoKmUuZy4qIGluIGBjbGllbnQucGFyYWxsZWwobW9kdWxlMSwgbW9kdWxlMiwgbW9kdWxlMylgLCB0aGUgYHZpZXdgIG9mIGBtb2R1bGUxYCBpcyBkaXNwbGF5ZWQgb24gdG9wIG9mIHRoZSBgdmlld2Agb2YgYG1vZHVsZTJgLCB3aGljaCBpcyBkaXNwbGF5ZWQgb24gdG9wIG9mIHRoZSBgdmlld2Agb2YgYG1vZHVsZTNgKS5cbiAqIEBkZXByZWNhdGVkIFVzZSB0aGUgbmV3IEFQSSB3aXRoIHRoZSB7QGxpbmsgc3RhcnR9IG1ldGhvZC5cbiAqIEBwYXJhbSB7Li4uTW9kdWxlfSBtb2R1bGVzIFRoZSBtb2R1bGVzIHRvIHJ1biBpbiBwYXJhbGxlbC5cbiAqIEByZXR1cm4ge1Byb21pc2V9IFtkZXNjcmlwdGlvbl1cbiAqIEB0b2RvIENsYXJpZnkgcmV0dXJuIHZhbHVlXG4gKi9cbmZ1bmN0aW9uIHBhcmFsbGVsKC4uLm1vZHVsZXMpIHtcbiAgY29uc29sZS5sb2coJ1RoZSBmdW5jdGlvbiBcImNsaWVudC5wYXJhbGxlbFwiIGlzIGRlcHJlY2F0ZWQuIFBsZWFzZSB1c2UgdGhlIG5ldyBBUEkgaW5zdGVhZC4nKTtcbiAgcmV0dXJuIE1vZHVsZS5wYXJhbGxlbCguLi5tb2R1bGVzKTtcbn1cblxuLyoqXG4gKiBTZW5kcyBhIFdlYlNvY2tldCBtZXNzYWdlIHRvIHRoZSBzZXJ2ZXIuXG4gKlxuICogKipOb3RlOioqIG9uIHRoZSBzZXJ2ZXIgc2lkZSwgdGhlIHNlcnZlciByZWNlaXZlcyB0aGUgbWVzc2FnZSB3aXRoIHRoZSBjb21tYW5kIHtAbGluayBTZXJ2ZXJDbGllbnQjcmVjZWl2ZX0uXG4gKiBAcGFyYW0ge1N0cmluZ30gbXNnIE5hbWUgb2YgdGhlIG1lc3NhZ2UgdG8gc2VuZC5cbiAqIEBwYXJhbSB7Li4uKn0gYXJncyBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gKi9cbmZ1bmN0aW9uIHNlbmQobXNnLCAuLi5hcmdzKSB7XG4gIGlmIChjbGllbnQuc29ja2V0KVxuICAgIGNsaWVudC5zb2NrZXQuZW1pdChtc2csIC4uLmFyZ3MpO1xufVxuXG4vKipcbiAqIEV4ZWN1dGVzIGEgY2FsbGJhY2sgZnVuY3Rpb24gd2hlbiBpdCByZWNlaXZlcyBhIFdlYlNvY2tldCBtZXNzYWdlIGZyb20gdGhlIHNlcnZlci5cbiAqXG4gKiAqKk5vdGU6Kiogb24gdGhlIHNlcnZlciBzaWRlLCB0aGUgc2VydmVyIHNlbmRzIHRoZSBtZXNzYWdlIHdpdGggdGhlIGNvbW1hbmQge0BsaW5rIHNlcnZlci5zZW5kfWAuXG4gKiBAcGFyYW0ge1N0cmluZ30gbXNnIE5hbWUgb2YgdGhlIHJlY2VpdmVkIG1lc3NhZ2UuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsYmFjayBmdW5jdGlvbiBleGVjdXRlZCB3aGVuIHRoZSBtZXNzYWdlIGlzIHJlY2VpdmVkLlxuICovXG5mdW5jdGlvbiByZWNlaXZlKG1zZywgY2FsbGJhY2spIHtcbiAgaWYgKGNsaWVudC5zb2NrZXQpIHtcbiAgICBjbGllbnQuc29ja2V0LnJlbW92ZUxpc3RlbmVyKG1zZywgY2FsbGJhY2spO1xuICAgIGNsaWVudC5zb2NrZXQub24obXNnLCBjYWxsYmFjayk7XG4gIH1cbn1cblxuLyoqXG4gKiBbcmVtb3ZlTGlzdGVuZXIgZGVzY3JpcHRpb25dXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtbdHlwZV19IG1zZyBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBbZGVzY3JpcHRpb25dXG4gKiBAdG9kbyBkb2NcbiAqL1xuZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXIobXNnLCBjYWxsYmFjaykge1xuICBpZiAoY2xpZW50LnNvY2tldClcbiAgICBjbGllbnQuc29ja2V0LnJlbW92ZUxpc3RlbmVyKG1zZywgY2FsbGJhY2spO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGllbnQ7XG4iXX0=