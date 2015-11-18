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
//# sourceMappingURL=data:application/json;base64,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U0FBTyxvQkFBTyxVQUFVLE1BQUEsZ0NBQVksQ0FBQztDQUN0Qzs7Ozs7Ozs7Ozs7Ozs7QUFjRCxTQUFTLFFBQVEsR0FBYTtBQUM1QixTQUFPLENBQUMsR0FBRyxDQUFDLCtFQUErRSxDQUFDLENBQUM7QUFDN0YsU0FBTyxvQkFBTyxRQUFRLE1BQUEsZ0NBQVksQ0FBQztDQUNwQzs7Ozs7Ozs7O0FBU0QsU0FBUyxJQUFJLENBQUMsR0FBRyxFQUFXOzs7b0NBQU4sSUFBSTtBQUFKLFFBQUk7OztBQUN4QixNQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQ2Ysa0JBQUEsTUFBTSxDQUFDLE1BQU0sRUFBQyxJQUFJLE1BQUEsa0JBQUMsR0FBRyxTQUFLLElBQUksRUFBQyxDQUFDO0NBQ3BDOzs7Ozs7Ozs7QUFTRCxTQUFTLE9BQU8sQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFO0FBQzlCLE1BQUksTUFBTSxDQUFDLE1BQU0sRUFBRTtBQUNqQixVQUFNLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDNUMsVUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0dBQ2pDO0NBQ0Y7Ozs7Ozs7OztBQVNELFNBQVMsY0FBYyxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUU7QUFDckMsTUFBSSxNQUFNLENBQUMsTUFBTSxFQUNmLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztDQUMvQzs7cUJBRWMsTUFBTSIsImZpbGUiOiJzcmMvY2xpZW50L2NsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBNb2R1bGUgZnJvbSAnLi9Nb2R1bGUnO1xuaW1wb3J0IE1vYmlsZURldGVjdCBmcm9tICdtb2JpbGUtZGV0ZWN0JztcblxuLy8gZGVidWcgLSBodHRwOi8vc29ja2V0LmlvL2RvY3MvbG9nZ2luZy1hbmQtZGVidWdnaW5nLyNhdmFpbGFibGUtZGVidWdnaW5nLXNjb3Blc1xuLy8gbG9jYWxTdG9yYWdlLmRlYnVnID0gJyonO1xuXG4vKipcbiAqIFRoZSBgY2xpZW50YCBvYmplY3QgY29udGFpbnMgdGhlIGJhc2ljIG1ldGhvZHMgb2YgdGhlIGNsaWVudC5cbiAqIEZvciBpbnN0YW5jZSwgdGhlIG9iamVjdCBpbml0aWFsaXplcyB0aGUgY2xpZW50IHR5cGUgd2l0aCBgaW5pdGAgYW5kXG4gKiBlc3RhYmxpc2hlcyBXZWJTb2NrZXQgY29tbXVuaWNhdGlvbnMgd2l0aCB0aGUgc2VydmVyIHRocm91Z2ggdGhlIG1ldGhvZHNcbiAqIGBzZW5kYCBhbmQgYHJlY2VpdmVgLiBBZGRpdGlvbmFsbHksIGl0IHN0YXJ0cyB0aGUgc2NlbmFyaW8gYW5kIHNlcXVlbmNlcyB0aGVcbiAqIG1vZHVsZXMgdXNpbmcgdGhlIG1ldGhvZHMgYHN0YXJ0YCwgYHNlcmlhbGAgYW5kIGBwYXJhbGxlbGAuXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG52YXIgY2xpZW50ID0ge1xuICB0eXBlOiBudWxsLFxuICByZWFkeTogbnVsbCxcbiAgaW5kZXg6IC0xLFxuICBjb29yZGluYXRlczogbnVsbCxcbiAgaW5pdDogaW5pdCxcbiAgc3RhcnQ6IHN0YXJ0LFxuICAvLyBkZXByZWNhdGVkIGZ1bmN0aW9uc1xuICBzZXJpYWw6IHNlcmlhbCxcbiAgcGFyYWxsZWw6IHBhcmFsbGVsLFxuXG4gIGlvOiBudWxsLFxuICBzb2NrZXQ6IG51bGwsXG4gIHNlbmQ6IHNlbmQsXG4gIHJlY2VpdmU6IHJlY2VpdmUsXG4gIHJlbW92ZUxpc3RlbmVyOiByZW1vdmVMaXN0ZW5lcixcbiAgcGxhdGZvcm06IHtcbiAgICBvczogbnVsbCxcbiAgICBpc01vYmlsZTogbnVsbCxcbiAgICBhdWRpb0ZpbGVFeHQ6ICcnLFxuICAgIGlzRm9yYmlkZGVuOiBmYWxzZVxuICB9XG59O1xuXG4vLyBnZXQgaW5mb3JtYXRpb25zIGFib3V0IGNsaWVudFxuY29uc3QgdWEgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudFxuY29uc3QgbWQgPSBuZXcgTW9iaWxlRGV0ZWN0KHVhKTtcbmNsaWVudC5wbGF0Zm9ybS5pc01vYmlsZSA9IChtZC5tb2JpbGUoKSAhPT0gbnVsbCk7IC8vIHRydWUgaWYgcGhvbmUgb3IgdGFibGV0XG5jbGllbnQucGxhdGZvcm0ub3MgPSAoKCkgPT4ge1xuICBsZXQgb3MgPSBtZC5vcygpO1xuXG4gIGlmIChvcyA9PT0gJ0FuZHJvaWRPUycpIHtcbiAgICByZXR1cm4gJ2FuZHJvaWQnO1xuICB9IGVsc2UgaWYgKG9zID09PSAnaU9TJykge1xuICAgIHJldHVybiAnaW9zJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJ290aGVyJztcbiAgfVxufSkoKTtcblxuLy8gYXVkaW8gZmlsZSBleHRlbnRpb24gY2hlY2tcbmNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhdWRpbycpO1xuLy8gaHR0cDovL2RpdmVpbnRvaHRtbDUuaW5mby9ldmVyeXRoaW5nLmh0bWxcbmlmICghIShhLmNhblBsYXlUeXBlICYmIGEuY2FuUGxheVR5cGUoJ2F1ZGlvL21wZWc7JykpKSB7XG4gIGNsaWVudC5wbGF0Zm9ybS5hdWRpb0ZpbGVFeHQgPSAnLm1wMyc7XG59IGVsc2UgaWYgKCEhKGEuY2FuUGxheVR5cGUgJiYgYS5jYW5QbGF5VHlwZSgnYXVkaW8vb2dnOyBjb2RlY3M9XCJ2b3JiaXNcIicpKSkge1xuICBjbGllbnQucGxhdGZvcm0uYXVkaW9GaWxlRXh0ID0gJy5vZ2cnO1xufSBlbHNlIHtcbiAgY2xpZW50LnBsYXRmb3JtLmF1ZGlvRmlsZUV4dCA9ICcud2F2Jztcbn1cblxuLyoqXG4gKiBUaGUgYGluaXRgIG1ldGhvZCBzZXRzIHRoZSBjbGllbnQgdHlwZSBhbmQgaW5pdGlhbGl6ZXMgYSBXZWJTb2NrZXQgY29ubmVjdGlvbiBhc3NvY2lhdGVkIHdpdGggdGhlIGdpdmVuIHR5cGUuXG4gKiBAcGFyYW0ge1N0cmluZ30gW2NsaWVudFR5cGUgPSAncGxheWVyJ10gVGhlIGNsaWVudCB0eXBlLlxuICogQHRvZG8gY2xhcmlmeSBjbGllbnRUeXBlLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zID0ge31dIFRoZSBvcHRpb25zIHRvIGluaXRpYWxpemUgYSBjbGllbnRcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuaW9dIEJ5IGRlZmF1bHQsIGEgU291bmR3b3JrcyBhcHBsaWNhdGlvbiBoYXMgYSBjbGllbnQgYW5kIGEgc2VydmVyIHNpZGUuIEZvciBhIHN0YW5kYWxvbmUgYXBwbGljYXRpb24gKGNsaWVudCBzaWRlIG9ubHkpLCB1c2UgYG9wdGlvbnMuaW8gPSBmYWxzZWAuXG4gKiBAdG9kbyB1c2UgZGVmYXVsdCB2YWx1ZSBmb3Igb3B0aW9ucy5pbyBpbiB0aGUgZG9jdW1lbnRhdGlvbj9cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5zb2NrZXRVcmxdIFRoZSBVUkwgb2YgdGhlIFdlYlNvY2tldCBzZXJ2ZXIuXG4gKi9cbmZ1bmN0aW9uIGluaXQoY2xpZW50VHlwZSA9ICdwbGF5ZXInLCBvcHRpb25zID0ge30pIHtcbiAgY2xpZW50LnR5cGUgPSBjbGllbnRUeXBlO1xuICBjbGllbnQuaW8gPSBudWxsO1xuXG4gIGlmIChvcHRpb25zLmlvID09PSB1bmRlZmluZWQpIHsgb3B0aW9ucy5pbyA9IHRydWU7IH1cbiAgaWYgKG9wdGlvbnMuc29ja2V0VXJsID09PSB1bmRlZmluZWQpIHsgb3B0aW9ucy5zb2NrZXRVcmwgPSAnJzsgfVxuXG4gIGlmIChvcHRpb25zLmlvICE9PSBmYWxzZSkge1xuICAgIHZhciBpbyA9IHJlcXVpcmUoJ3NvY2tldC5pby1jbGllbnQnKTtcblxuICAgIGNsaWVudC5pbyA9IGlvO1xuICAgIGNsaWVudC5zb2NrZXQgPSBjbGllbnQuaW8ob3B0aW9ucy5zb2NrZXRVcmwgKyAnLycgKyBjbGllbnRUeXBlLCB7XG4gICAgICB0cmFuc3BvcnRzOiBbJ3dlYnNvY2tldCddXG4gICAgfSk7XG5cbiAgICBjbGllbnQucmVhZHkgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgY2xpZW50LnJlY2VpdmUoJ2NsaWVudDpzdGFydCcsIChpbmRleCkgPT4ge1xuICAgICAgICBjbGllbnQuaW5kZXggPSBpbmRleDtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBTdGFydCB0aGUgbW9kdWxlIGxvZ2ljICgqaS5lLiogdGhlIGFwcGxpY2F0aW9uKS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN0YXJ0RnVuIFt0b2RvXVxuICogQHRvZG8gQ2xhcmlmeSB0aGUgcGFyYW0uXG4gKiBAcmV0dXJuIHtQcm9taXNlfSBUaGUgUHJvbWlzZSByZXR1cm4gdmFsdWUuXG4gKiBAdG9kbyBDbGFyaWZ5IHJldHVybiB2YWx1ZSAocHJvbWlzZSkuXG4gKiBAdG9kbyBleGFtcGxlXG4gKi9cbmZ1bmN0aW9uIHN0YXJ0KHN0YXJ0RnVuKSB7XG4gIGxldCBtb2R1bGUgPSBzdGFydEZ1bjsgLy8gYmUgY29tcGF0aWJsZSB3aXRoIHByZXZpb3VzIHZlcnNpb25cblxuICBpZiAodHlwZW9mIHN0YXJ0RnVuID09PSAnZnVuY3Rpb24nKVxuICAgIG1vZHVsZSA9IHN0YXJ0RnVuKE1vZHVsZS5zZXF1ZW50aWFsLCBNb2R1bGUucGFyYWxsZWwpO1xuXG4gIGxldCBwcm9taXNlID0gbW9kdWxlLmNyZWF0ZVByb21pc2UoKTtcblxuICBpZiAoY2xpZW50LmlvKSB7XG4gICAgY2xpZW50LnJlYWR5XG4gICAgICAudGhlbigoKSA9PiBtb2R1bGUubGF1bmNoKCkpO1xuXG4gICAgY2xpZW50LnJlY2VpdmUoJ2Rpc2Nvbm5lY3QnLCAoKSA9PiB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnZGlzY29ubmVjdCcsIGNsaWVudC5pbmRleCk7XG4gICAgfSk7XG5cbiAgICBjbGllbnQucmVjZWl2ZSgncmVjb25uZWN0JywgKCkgPT4ge1xuICAgICAgLy8gY29uc29sZS5sb2coJ3JlY29ubmVjdCcsIGNsaWVudC5pbmRleCk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gbm8gY2xpZW50IGkvbywgbm8gc2VydmVyXG4gICAgbW9kdWxlLmxhdW5jaCgpO1xuICB9XG5cbiAgcmV0dXJuIHByb21pc2U7XG59XG5cbi8qKlxuICogVGhlIGBzZXJpYWxgIG1ldGhvZCByZXR1cm5zIGEgYE1vZHVsZWAgdGhhdCBzdGFydHMgdGhlIGdpdmVuIGAuLi5tb2R1bGVzYCBpbiBzZXJpZXMuIEFmdGVyIHN0YXJ0aW5nIHRoZSBmaXJzdCBtb2R1bGUgKGJ5IGNhbGxpbmcgaXRzIGBzdGFydGAgbWV0aG9kKSwgdGhlIG5leHQgbW9kdWxlIGluIHRoZSBzZXJpZXMgaXMgc3RhcnRlZCAod2l0aCBpdHMgYHN0YXJ0YCBtZXRob2QpIHdoZW4gdGhlIGxhc3QgbW9kdWxlIGNhbGxlZCBpdHMgYGRvbmVgIG1ldGhvZC4gV2hlbiB0aGUgbGFzdCBtb2R1bGUgY2FsbHMgYGRvbmVgLCB0aGUgcmV0dXJuZWQgc2VyaWFsIG1vZHVsZSBjYWxscyBpdHMgb3duIGBkb25lYCBtZXRob2QuXG4gKlxuICogKipOb3RlOioqIHlvdSBjYW4gY29tcG91bmQgc2VyaWFsIG1vZHVsZSBzZXF1ZW5jZXMgd2l0aCBwYXJhbGxlbCBtb2R1bGUgY29tYmluYXRpb25zICgqZS5nLiogYGNsaWVudC5zZXJpYWwobW9kdWxlMSwgY2xpZW50LnBhcmFsbGVsKG1vZHVsZTIsIG1vZHVsZTMpLCBtb2R1bGU0KTtgKS5cbiAqIEBkZXByZWNhdGVkIFVzZSB0aGUgbmV3IEFQSSB3aXRoIHRoZSB7QGxpbmsgc3RhcnR9IG1ldGhvZC5cbiAqIEBwYXJhbSB7Li4uTW9kdWxlfSAuLi5tb2R1bGVzIFRoZSBtb2R1bGVzIHRvIHJ1biBpbiBzZXJpYWwuXG4gKiBAcmV0dXJuIHtQcm9taXNlfSBbZGVzY3JpcHRpb25dXG4gKiBAdG9kbyBDbGFyaWZ5IHJldHVybiB2YWx1ZVxuICovXG5mdW5jdGlvbiBzZXJpYWwoLi4ubW9kdWxlcykge1xuICBjb25zb2xlLmxvZygnVGhlIGZ1bmN0aW9uIFwiY2xpZW50LnNlcmlhbFwiIGlzIGRlcHJlY2F0ZWQuIFBsZWFzZSB1c2UgdGhlIG5ldyBBUEkgaW5zdGVhZC4nKTtcbiAgcmV0dXJuIE1vZHVsZS5zZXF1ZW50aWFsKC4uLm1vZHVsZXMpO1xufVxuXG4vKipcbiAqIFRoZSBgTW9kdWxlYCByZXR1cm5lZCBieSB0aGUgYHBhcmFsbGVsYCBtZXRob2Qgc3RhcnRzIHRoZSBnaXZlbiBgLi4ubW9kdWxlc2AgaW4gcGFyYWxsZWwgKHdpdGggdGhlaXIgYHN0YXJ0YCBtZXRob2RzKSwgYW5kIGNhbGxzIGl0cyBgZG9uZWAgbWV0aG9kIGFmdGVyIGFsbCBtb2R1bGVzIGNhbGxlZCB0aGVpciBvd24gYGRvbmVgIG1ldGhvZHMuXG4gKlxuICogKipOb3RlOioqIHlvdSBjYW4gY29tcG91bmQgcGFyYWxsZWwgbW9kdWxlIGNvbWJpbmF0aW9ucyB3aXRoIHNlcmlhbCBtb2R1bGUgc2VxdWVuY2VzICgqZS5nLiogYGNsaWVudC5wYXJhbGxlbChtb2R1bGUxLCBjbGllbnQuc2VyaWFsKG1vZHVsZTIsIG1vZHVsZTMpLCBtb2R1bGU0KTtgKS5cbiAqXG4gKiAqKk5vdGU6KiogdGhlIGB2aWV3YCBvZiBhIG1vZHVsZSBpcyBhbHdheXMgZnVsbCBzY3JlZW4sIHNvIGluIHRoZSBjYXNlIHdoZXJlIG1vZHVsZXMgcnVuIGluIHBhcmFsbGVsLCB0aGVpciBgdmlld2BzIGFyZSBzdGFja2VkIG9uIHRvcCBvZiBlYWNoIG90aGVyIHVzaW5nIHRoZSBgei1pbmRleGAgQ1NTIHByb3BlcnR5LlxuICogV2UgdXNlIHRoZSBvcmRlciBvZiB0aGUgYHBhcmFsbGVsYCBtZXRob2QncyBhcmd1bWVudHMgdG8gZGV0ZXJtaW5lIHRoZSBvcmRlciBvZiB0aGUgc3RhY2sgKCplLmcuKiBpbiBgY2xpZW50LnBhcmFsbGVsKG1vZHVsZTEsIG1vZHVsZTIsIG1vZHVsZTMpYCwgdGhlIGB2aWV3YCBvZiBgbW9kdWxlMWAgaXMgZGlzcGxheWVkIG9uIHRvcCBvZiB0aGUgYHZpZXdgIG9mIGBtb2R1bGUyYCwgd2hpY2ggaXMgZGlzcGxheWVkIG9uIHRvcCBvZiB0aGUgYHZpZXdgIG9mIGBtb2R1bGUzYCkuXG4gKiBAZGVwcmVjYXRlZCBVc2UgdGhlIG5ldyBBUEkgd2l0aCB0aGUge0BsaW5rIHN0YXJ0fSBtZXRob2QuXG4gKiBAcGFyYW0gey4uLk1vZHVsZX0gbW9kdWxlcyBUaGUgbW9kdWxlcyB0byBydW4gaW4gcGFyYWxsZWwuXG4gKiBAcmV0dXJuIHtQcm9taXNlfSBbZGVzY3JpcHRpb25dXG4gKiBAdG9kbyBDbGFyaWZ5IHJldHVybiB2YWx1ZVxuICovXG5mdW5jdGlvbiBwYXJhbGxlbCguLi5tb2R1bGVzKSB7XG4gIGNvbnNvbGUubG9nKCdUaGUgZnVuY3Rpb24gXCJjbGllbnQucGFyYWxsZWxcIiBpcyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIHRoZSBuZXcgQVBJIGluc3RlYWQuJyk7XG4gIHJldHVybiBNb2R1bGUucGFyYWxsZWwoLi4ubW9kdWxlcyk7XG59XG5cbi8qKlxuICogU2VuZCBhIFdlYlNvY2tldCBtZXNzYWdlIHRvIHRoZSBzZXJ2ZXIuXG4gKlxuICogKipOb3RlOioqIG9uIHRoZSBzZXJ2ZXIgc2lkZSwgdGhlIHNlcnZlciByZWNlaXZlcyB0aGUgbWVzc2FnZSB3aXRoIHRoZSBjb21tYW5kIHtAbGluayBTZXJ2ZXJDbGllbnQjcmVjZWl2ZX0uXG4gKiBAcGFyYW0ge1N0cmluZ30gbXNnIE5hbWUgb2YgdGhlIG1lc3NhZ2UgdG8gc2VuZC5cbiAqIEBwYXJhbSB7Li4uKn0gYXJncyBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gKi9cbmZ1bmN0aW9uIHNlbmQobXNnLCAuLi5hcmdzKSB7XG4gIGlmIChjbGllbnQuc29ja2V0KVxuICAgIGNsaWVudC5zb2NrZXQuZW1pdChtc2csIC4uLmFyZ3MpO1xufVxuXG4vKipcbiAqIEV4ZWN1dGUgYSBjYWxsYmFjayBmdW5jdGlvbiB3aGVuIGl0IHJlY2VpdmVzIGEgV2ViU29ja2V0IG1lc3NhZ2UgZnJvbSB0aGUgc2VydmVyLlxuICpcbiAqICoqTm90ZToqKiBvbiB0aGUgc2VydmVyIHNpZGUsIHRoZSBzZXJ2ZXIgc2VuZHMgdGhlIG1lc3NhZ2Ugd2l0aCB0aGUgY29tbWFuZCB7QGxpbmsgc2VydmVyLnNlbmR9YC5cbiAqIEBwYXJhbSB7U3RyaW5nfSBtc2cgTmFtZSBvZiB0aGUgcmVjZWl2ZWQgbWVzc2FnZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIENhbGxiYWNrIGZ1bmN0aW9uIGV4ZWN1dGVkIHdoZW4gdGhlIG1lc3NhZ2UgaXMgcmVjZWl2ZWQuXG4gKi9cbmZ1bmN0aW9uIHJlY2VpdmUobXNnLCBjYWxsYmFjaykge1xuICBpZiAoY2xpZW50LnNvY2tldCkge1xuICAgIGNsaWVudC5zb2NrZXQucmVtb3ZlTGlzdGVuZXIobXNnLCBjYWxsYmFjayk7XG4gICAgY2xpZW50LnNvY2tldC5vbihtc2csIGNhbGxiYWNrKTtcbiAgfVxufVxuXG4vKipcbiAqIFtyZW1vdmVMaXN0ZW5lciBkZXNjcmlwdGlvbl1cbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge1t0eXBlXX0gbXNnIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFtkZXNjcmlwdGlvbl1cbiAqIEB0b2RvIGRvY1xuICovXG5mdW5jdGlvbiByZW1vdmVMaXN0ZW5lcihtc2csIGNhbGxiYWNrKSB7XG4gIGlmIChjbGllbnQuc29ja2V0KVxuICAgIGNsaWVudC5zb2NrZXQucmVtb3ZlTGlzdGVuZXIobXNnLCBjYWxsYmFjayk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsaWVudDtcbiJdfQ==