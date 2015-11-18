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
 * The `client` object contains the basic methods of the client.
 * For instance, the object initializes the client type with `init` and
 * establishes WebSocket communications with the server through the methods
 * `send` and `receive`. Additionally, it starts the scenario and sequences the
 * modules using the methods `start`, `serial` and `parallel`.
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
 * Start the module logic (*i.e.* the application).
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
      var promise = module.createPromise();
      module.launch();
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
 * Send a WebSocket message to the server.
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
 * Execute a callback function when it receives a WebSocket message from the server.
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
//# sourceMappingURL=data:application/json;base64,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Ozs7Ozs7OztBQVdELFNBQVMsTUFBTSxHQUFhO0FBQzFCLFNBQU8sQ0FBQyxHQUFHLENBQUMsNkVBQTZFLENBQUMsQ0FBQztBQUMzRixTQUFPLG9CQUFPLFVBQVUsTUFBQSxnQ0FBWSxDQUFDO0NBQ3RDOzs7Ozs7Ozs7Ozs7OztBQWNELFNBQVMsUUFBUSxHQUFhO0FBQzVCLFNBQU8sQ0FBQyxHQUFHLENBQUMsK0VBQStFLENBQUMsQ0FBQztBQUM3RixTQUFPLG9CQUFPLFFBQVEsTUFBQSxnQ0FBWSxDQUFDO0NBQ3BDOzs7Ozs7Ozs7QUFTRCxTQUFTLElBQUksQ0FBQyxHQUFHLEVBQVc7OztvQ0FBTixJQUFJO0FBQUosUUFBSTs7O0FBQ3hCLE1BQUksTUFBTSxDQUFDLE1BQU0sRUFDZixrQkFBQSxNQUFNLENBQUMsTUFBTSxFQUFDLElBQUksTUFBQSxrQkFBQyxHQUFHLFNBQUssSUFBSSxFQUFDLENBQUM7Q0FDcEM7Ozs7Ozs7OztBQVNELFNBQVMsT0FBTyxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUU7QUFDOUIsTUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFO0FBQ2pCLFVBQU0sQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUM1QyxVQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7R0FDakM7Q0FDRjs7Ozs7Ozs7O0FBU0QsU0FBUyxjQUFjLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRTtBQUNyQyxNQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQ2YsTUFBTSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0NBQy9DOztxQkFFYyxNQUFNIiwiZmlsZSI6InNyYy9jbGllbnQvY2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE1vZHVsZSBmcm9tICcuL01vZHVsZSc7XG5pbXBvcnQgTW9iaWxlRGV0ZWN0IGZyb20gJ21vYmlsZS1kZXRlY3QnO1xuXG4vLyBkZWJ1ZyAtIGh0dHA6Ly9zb2NrZXQuaW8vZG9jcy9sb2dnaW5nLWFuZC1kZWJ1Z2dpbmcvI2F2YWlsYWJsZS1kZWJ1Z2dpbmctc2NvcGVzXG4vLyBsb2NhbFN0b3JhZ2UuZGVidWcgPSAnKic7XG5cbi8qKlxuICogVGhlIGBjbGllbnRgIG9iamVjdCBjb250YWlucyB0aGUgYmFzaWMgbWV0aG9kcyBvZiB0aGUgY2xpZW50LlxuICogRm9yIGluc3RhbmNlLCB0aGUgb2JqZWN0IGluaXRpYWxpemVzIHRoZSBjbGllbnQgdHlwZSB3aXRoIGBpbml0YCBhbmRcbiAqIGVzdGFibGlzaGVzIFdlYlNvY2tldCBjb21tdW5pY2F0aW9ucyB3aXRoIHRoZSBzZXJ2ZXIgdGhyb3VnaCB0aGUgbWV0aG9kc1xuICogYHNlbmRgIGFuZCBgcmVjZWl2ZWAuIEFkZGl0aW9uYWxseSwgaXQgc3RhcnRzIHRoZSBzY2VuYXJpbyBhbmQgc2VxdWVuY2VzIHRoZVxuICogbW9kdWxlcyB1c2luZyB0aGUgbWV0aG9kcyBgc3RhcnRgLCBgc2VyaWFsYCBhbmQgYHBhcmFsbGVsYC5cbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbnZhciBjbGllbnQgPSB7XG4gIHR5cGU6IG51bGwsXG4gIHJlYWR5OiBudWxsLFxuICBpbmRleDogLTEsXG4gIGNvb3JkaW5hdGVzOiBudWxsLFxuICBpbml0OiBpbml0LFxuICBzdGFydDogc3RhcnQsXG4gIC8vIGRlcHJlY2F0ZWQgZnVuY3Rpb25zXG4gIHNlcmlhbDogc2VyaWFsLFxuICBwYXJhbGxlbDogcGFyYWxsZWwsXG5cbiAgaW86IG51bGwsXG4gIHNvY2tldDogbnVsbCxcbiAgc2VuZDogc2VuZCxcbiAgcmVjZWl2ZTogcmVjZWl2ZSxcbiAgcmVtb3ZlTGlzdGVuZXI6IHJlbW92ZUxpc3RlbmVyLFxuICBwbGF0Zm9ybToge1xuICAgIG9zOiBudWxsLFxuICAgIGlzTW9iaWxlOiBudWxsLFxuICAgIGF1ZGlvRmlsZUV4dDogJycsXG4gICAgaXNGb3JiaWRkZW46IGZhbHNlXG4gIH1cbn07XG5cbi8vIGdldCBpbmZvcm1hdGlvbnMgYWJvdXQgY2xpZW50XG5jb25zdCB1YSA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50XG5jb25zdCBtZCA9IG5ldyBNb2JpbGVEZXRlY3QodWEpO1xuY2xpZW50LnBsYXRmb3JtLmlzTW9iaWxlID0gKG1kLm1vYmlsZSgpICE9PSBudWxsKTsgLy8gdHJ1ZSBpZiBwaG9uZSBvciB0YWJsZXRcbmNsaWVudC5wbGF0Zm9ybS5vcyA9ICgoKSA9PiB7XG4gIGxldCBvcyA9IG1kLm9zKCk7XG5cbiAgaWYgKG9zID09PSAnQW5kcm9pZE9TJykge1xuICAgIHJldHVybiAnYW5kcm9pZCc7XG4gIH0gZWxzZSBpZiAob3MgPT09ICdpT1MnKSB7XG4gICAgcmV0dXJuICdpb3MnO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnb3RoZXInO1xuICB9XG59KSgpO1xuXG4vLyBhdWRpbyBmaWxlIGV4dGVudGlvbiBjaGVja1xuY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2F1ZGlvJyk7XG4vLyBodHRwOi8vZGl2ZWludG9odG1sNS5pbmZvL2V2ZXJ5dGhpbmcuaHRtbFxuaWYgKCEhKGEuY2FuUGxheVR5cGUgJiYgYS5jYW5QbGF5VHlwZSgnYXVkaW8vbXBlZzsnKSkpIHtcbiAgY2xpZW50LnBsYXRmb3JtLmF1ZGlvRmlsZUV4dCA9ICcubXAzJztcbn0gZWxzZSBpZiAoISEoYS5jYW5QbGF5VHlwZSAmJiBhLmNhblBsYXlUeXBlKCdhdWRpby9vZ2c7IGNvZGVjcz1cInZvcmJpc1wiJykpKSB7XG4gIGNsaWVudC5wbGF0Zm9ybS5hdWRpb0ZpbGVFeHQgPSAnLm9nZyc7XG59IGVsc2Uge1xuICBjbGllbnQucGxhdGZvcm0uYXVkaW9GaWxlRXh0ID0gJy53YXYnO1xufVxuXG4vKipcbiAqIFRoZSBgaW5pdGAgbWV0aG9kIHNldHMgdGhlIGNsaWVudCB0eXBlIGFuZCBpbml0aWFsaXplcyBhIFdlYlNvY2tldCBjb25uZWN0aW9uIGFzc29jaWF0ZWQgd2l0aCB0aGUgZ2l2ZW4gdHlwZS5cbiAqIEBwYXJhbSB7U3RyaW5nfSBbY2xpZW50VHlwZSA9ICdwbGF5ZXInXSBUaGUgY2xpZW50IHR5cGUuXG4gKiBAdG9kbyBjbGFyaWZ5IGNsaWVudFR5cGUuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMgPSB7fV0gVGhlIG9wdGlvbnMgdG8gaW5pdGlhbGl6ZSBhIGNsaWVudFxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5pb10gQnkgZGVmYXVsdCwgYSBTb3VuZHdvcmtzIGFwcGxpY2F0aW9uIGhhcyBhIGNsaWVudCBhbmQgYSBzZXJ2ZXIgc2lkZS4gRm9yIGEgc3RhbmRhbG9uZSBhcHBsaWNhdGlvbiAoY2xpZW50IHNpZGUgb25seSksIHVzZSBgb3B0aW9ucy5pbyA9IGZhbHNlYC5cbiAqIEB0b2RvIHVzZSBkZWZhdWx0IHZhbHVlIGZvciBvcHRpb25zLmlvIGluIHRoZSBkb2N1bWVudGF0aW9uP1xuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLnNvY2tldFVybF0gVGhlIFVSTCBvZiB0aGUgV2ViU29ja2V0IHNlcnZlci5cbiAqL1xuZnVuY3Rpb24gaW5pdChjbGllbnRUeXBlID0gJ3BsYXllcicsIG9wdGlvbnMgPSB7fSkge1xuICBjbGllbnQudHlwZSA9IGNsaWVudFR5cGU7XG4gIGNsaWVudC5pbyA9IG51bGw7XG5cbiAgaWYgKG9wdGlvbnMuaW8gPT09IHVuZGVmaW5lZCkgeyBvcHRpb25zLmlvID0gdHJ1ZTsgfVxuICBpZiAob3B0aW9ucy5zb2NrZXRVcmwgPT09IHVuZGVmaW5lZCkgeyBvcHRpb25zLnNvY2tldFVybCA9ICcnOyB9XG5cbiAgaWYgKG9wdGlvbnMuaW8gIT09IGZhbHNlKSB7XG4gICAgdmFyIGlvID0gcmVxdWlyZSgnc29ja2V0LmlvLWNsaWVudCcpO1xuXG4gICAgY2xpZW50LmlvID0gaW87XG4gICAgY2xpZW50LnNvY2tldCA9IGNsaWVudC5pbyhvcHRpb25zLnNvY2tldFVybCArICcvJyArIGNsaWVudFR5cGUsIHtcbiAgICAgIHRyYW5zcG9ydHM6IFsnd2Vic29ja2V0J11cbiAgICB9KTtcblxuICAgIGNsaWVudC5yZWFkeSA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICBjbGllbnQucmVjZWl2ZSgnY2xpZW50OnN0YXJ0JywgKGluZGV4KSA9PiB7XG4gICAgICAgIGNsaWVudC5pbmRleCA9IGluZGV4O1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIFN0YXJ0IHRoZSBtb2R1bGUgbG9naWMgKCppLmUuKiB0aGUgYXBwbGljYXRpb24pLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gc3RhcnRGdW4gW3RvZG9dXG4gKiBAdG9kbyBDbGFyaWZ5IHRoZSBwYXJhbS5cbiAqIEByZXR1cm4ge1Byb21pc2V9IFRoZSBQcm9taXNlIHJldHVybiB2YWx1ZS5cbiAqIEB0b2RvIENsYXJpZnkgcmV0dXJuIHZhbHVlIChwcm9taXNlKS5cbiAqIEB0b2RvIGV4YW1wbGVcbiAqL1xuZnVuY3Rpb24gc3RhcnQoc3RhcnRGdW4pIHtcbiAgbGV0IG1vZHVsZSA9IHN0YXJ0RnVuOyAvLyBiZSBjb21wYXRpYmxlIHdpdGggcHJldmlvdXMgdmVyc2lvblxuXG4gIGlmICh0eXBlb2Ygc3RhcnRGdW4gPT09ICdmdW5jdGlvbicpXG4gICAgbW9kdWxlID0gc3RhcnRGdW4oTW9kdWxlLnNlcXVlbnRpYWwsIE1vZHVsZS5wYXJhbGxlbCk7XG5cbiAgbGV0IHByb21pc2UgPSBtb2R1bGUuY3JlYXRlUHJvbWlzZSgpO1xuXG4gIGlmIChjbGllbnQuaW8pIHtcbiAgICBjbGllbnQucmVhZHlcbiAgICAgIC50aGVuKCgpID0+IG1vZHVsZS5sYXVuY2goKSk7XG5cbiAgICBjbGllbnQucmVjZWl2ZSgnZGlzY29ubmVjdCcsICgpID0+IHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdkaXNjb25uZWN0JywgY2xpZW50LmluZGV4KTtcbiAgICB9KTtcblxuICAgIGNsaWVudC5yZWNlaXZlKCdyZWNvbm5lY3QnLCAoKSA9PiB7XG4gICAgICAvLyBjb25zb2xlLmxvZygncmVjb25uZWN0JywgY2xpZW50LmluZGV4KTtcbiAgICAgIGxldCBwcm9taXNlID0gbW9kdWxlLmNyZWF0ZVByb21pc2UoKTtcbiAgICAgIG1vZHVsZS5sYXVuY2goKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICAvLyBubyBjbGllbnQgaS9vLCBubyBzZXJ2ZXJcbiAgICBtb2R1bGUubGF1bmNoKCk7XG4gIH1cblxuICByZXR1cm4gcHJvbWlzZTtcbn1cblxuLyoqXG4gKiBUaGUgYHNlcmlhbGAgbWV0aG9kIHJldHVybnMgYSBgTW9kdWxlYCB0aGF0IHN0YXJ0cyB0aGUgZ2l2ZW4gYC4uLm1vZHVsZXNgIGluIHNlcmllcy4gQWZ0ZXIgc3RhcnRpbmcgdGhlIGZpcnN0IG1vZHVsZSAoYnkgY2FsbGluZyBpdHMgYHN0YXJ0YCBtZXRob2QpLCB0aGUgbmV4dCBtb2R1bGUgaW4gdGhlIHNlcmllcyBpcyBzdGFydGVkICh3aXRoIGl0cyBgc3RhcnRgIG1ldGhvZCkgd2hlbiB0aGUgbGFzdCBtb2R1bGUgY2FsbGVkIGl0cyBgZG9uZWAgbWV0aG9kLiBXaGVuIHRoZSBsYXN0IG1vZHVsZSBjYWxscyBgZG9uZWAsIHRoZSByZXR1cm5lZCBzZXJpYWwgbW9kdWxlIGNhbGxzIGl0cyBvd24gYGRvbmVgIG1ldGhvZC5cbiAqXG4gKiAqKk5vdGU6KiogeW91IGNhbiBjb21wb3VuZCBzZXJpYWwgbW9kdWxlIHNlcXVlbmNlcyB3aXRoIHBhcmFsbGVsIG1vZHVsZSBjb21iaW5hdGlvbnMgKCplLmcuKiBgY2xpZW50LnNlcmlhbChtb2R1bGUxLCBjbGllbnQucGFyYWxsZWwobW9kdWxlMiwgbW9kdWxlMyksIG1vZHVsZTQpO2ApLlxuICogQGRlcHJlY2F0ZWQgVXNlIHRoZSBuZXcgQVBJIHdpdGggdGhlIHtAbGluayBzdGFydH0gbWV0aG9kLlxuICogQHBhcmFtIHsuLi5Nb2R1bGV9IC4uLm1vZHVsZXMgVGhlIG1vZHVsZXMgdG8gcnVuIGluIHNlcmlhbC5cbiAqIEByZXR1cm4ge1Byb21pc2V9IFtkZXNjcmlwdGlvbl1cbiAqIEB0b2RvIENsYXJpZnkgcmV0dXJuIHZhbHVlXG4gKi9cbmZ1bmN0aW9uIHNlcmlhbCguLi5tb2R1bGVzKSB7XG4gIGNvbnNvbGUubG9nKCdUaGUgZnVuY3Rpb24gXCJjbGllbnQuc2VyaWFsXCIgaXMgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSB0aGUgbmV3IEFQSSBpbnN0ZWFkLicpO1xuICByZXR1cm4gTW9kdWxlLnNlcXVlbnRpYWwoLi4ubW9kdWxlcyk7XG59XG5cbi8qKlxuICogVGhlIGBNb2R1bGVgIHJldHVybmVkIGJ5IHRoZSBgcGFyYWxsZWxgIG1ldGhvZCBzdGFydHMgdGhlIGdpdmVuIGAuLi5tb2R1bGVzYCBpbiBwYXJhbGxlbCAod2l0aCB0aGVpciBgc3RhcnRgIG1ldGhvZHMpLCBhbmQgY2FsbHMgaXRzIGBkb25lYCBtZXRob2QgYWZ0ZXIgYWxsIG1vZHVsZXMgY2FsbGVkIHRoZWlyIG93biBgZG9uZWAgbWV0aG9kcy5cbiAqXG4gKiAqKk5vdGU6KiogeW91IGNhbiBjb21wb3VuZCBwYXJhbGxlbCBtb2R1bGUgY29tYmluYXRpb25zIHdpdGggc2VyaWFsIG1vZHVsZSBzZXF1ZW5jZXMgKCplLmcuKiBgY2xpZW50LnBhcmFsbGVsKG1vZHVsZTEsIGNsaWVudC5zZXJpYWwobW9kdWxlMiwgbW9kdWxlMyksIG1vZHVsZTQpO2ApLlxuICpcbiAqICoqTm90ZToqKiB0aGUgYHZpZXdgIG9mIGEgbW9kdWxlIGlzIGFsd2F5cyBmdWxsIHNjcmVlbiwgc28gaW4gdGhlIGNhc2Ugd2hlcmUgbW9kdWxlcyBydW4gaW4gcGFyYWxsZWwsIHRoZWlyIGB2aWV3YHMgYXJlIHN0YWNrZWQgb24gdG9wIG9mIGVhY2ggb3RoZXIgdXNpbmcgdGhlIGB6LWluZGV4YCBDU1MgcHJvcGVydHkuXG4gKiBXZSB1c2UgdGhlIG9yZGVyIG9mIHRoZSBgcGFyYWxsZWxgIG1ldGhvZCdzIGFyZ3VtZW50cyB0byBkZXRlcm1pbmUgdGhlIG9yZGVyIG9mIHRoZSBzdGFjayAoKmUuZy4qIGluIGBjbGllbnQucGFyYWxsZWwobW9kdWxlMSwgbW9kdWxlMiwgbW9kdWxlMylgLCB0aGUgYHZpZXdgIG9mIGBtb2R1bGUxYCBpcyBkaXNwbGF5ZWQgb24gdG9wIG9mIHRoZSBgdmlld2Agb2YgYG1vZHVsZTJgLCB3aGljaCBpcyBkaXNwbGF5ZWQgb24gdG9wIG9mIHRoZSBgdmlld2Agb2YgYG1vZHVsZTNgKS5cbiAqIEBkZXByZWNhdGVkIFVzZSB0aGUgbmV3IEFQSSB3aXRoIHRoZSB7QGxpbmsgc3RhcnR9IG1ldGhvZC5cbiAqIEBwYXJhbSB7Li4uTW9kdWxlfSBtb2R1bGVzIFRoZSBtb2R1bGVzIHRvIHJ1biBpbiBwYXJhbGxlbC5cbiAqIEByZXR1cm4ge1Byb21pc2V9IFtkZXNjcmlwdGlvbl1cbiAqIEB0b2RvIENsYXJpZnkgcmV0dXJuIHZhbHVlXG4gKi9cbmZ1bmN0aW9uIHBhcmFsbGVsKC4uLm1vZHVsZXMpIHtcbiAgY29uc29sZS5sb2coJ1RoZSBmdW5jdGlvbiBcImNsaWVudC5wYXJhbGxlbFwiIGlzIGRlcHJlY2F0ZWQuIFBsZWFzZSB1c2UgdGhlIG5ldyBBUEkgaW5zdGVhZC4nKTtcbiAgcmV0dXJuIE1vZHVsZS5wYXJhbGxlbCguLi5tb2R1bGVzKTtcbn1cblxuLyoqXG4gKiBTZW5kIGEgV2ViU29ja2V0IG1lc3NhZ2UgdG8gdGhlIHNlcnZlci5cbiAqXG4gKiAqKk5vdGU6Kiogb24gdGhlIHNlcnZlciBzaWRlLCB0aGUgc2VydmVyIHJlY2VpdmVzIHRoZSBtZXNzYWdlIHdpdGggdGhlIGNvbW1hbmQge0BsaW5rIFNlcnZlckNsaWVudCNyZWNlaXZlfS5cbiAqIEBwYXJhbSB7U3RyaW5nfSBtc2cgTmFtZSBvZiB0aGUgbWVzc2FnZSB0byBzZW5kLlxuICogQHBhcmFtIHsuLi4qfSBhcmdzIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAqL1xuZnVuY3Rpb24gc2VuZChtc2csIC4uLmFyZ3MpIHtcbiAgaWYgKGNsaWVudC5zb2NrZXQpXG4gICAgY2xpZW50LnNvY2tldC5lbWl0KG1zZywgLi4uYXJncyk7XG59XG5cbi8qKlxuICogRXhlY3V0ZSBhIGNhbGxiYWNrIGZ1bmN0aW9uIHdoZW4gaXQgcmVjZWl2ZXMgYSBXZWJTb2NrZXQgbWVzc2FnZSBmcm9tIHRoZSBzZXJ2ZXIuXG4gKlxuICogKipOb3RlOioqIG9uIHRoZSBzZXJ2ZXIgc2lkZSwgdGhlIHNlcnZlciBzZW5kcyB0aGUgbWVzc2FnZSB3aXRoIHRoZSBjb21tYW5kIHtAbGluayBzZXJ2ZXIuc2VuZH1gLlxuICogQHBhcmFtIHtTdHJpbmd9IG1zZyBOYW1lIG9mIHRoZSByZWNlaXZlZCBtZXNzYWdlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGJhY2sgZnVuY3Rpb24gZXhlY3V0ZWQgd2hlbiB0aGUgbWVzc2FnZSBpcyByZWNlaXZlZC5cbiAqL1xuZnVuY3Rpb24gcmVjZWl2ZShtc2csIGNhbGxiYWNrKSB7XG4gIGlmIChjbGllbnQuc29ja2V0KSB7XG4gICAgY2xpZW50LnNvY2tldC5yZW1vdmVMaXN0ZW5lcihtc2csIGNhbGxiYWNrKTtcbiAgICBjbGllbnQuc29ja2V0Lm9uKG1zZywgY2FsbGJhY2spO1xuICB9XG59XG5cbi8qKlxuICogW3JlbW92ZUxpc3RlbmVyIGRlc2NyaXB0aW9uXVxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7W3R5cGVdfSBtc2cgW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgW2Rlc2NyaXB0aW9uXVxuICogQHRvZG8gZG9jXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVyKG1zZywgY2FsbGJhY2spIHtcbiAgaWYgKGNsaWVudC5zb2NrZXQpXG4gICAgY2xpZW50LnNvY2tldC5yZW1vdmVMaXN0ZW5lcihtc2csIGNhbGxiYWNrKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xpZW50O1xuIl19