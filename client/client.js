'use strict';

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Module = require('./Module');

var _Module2 = _interopRequireDefault(_Module);

var _com2 = require('./com');

var _com3 = _interopRequireDefault(_com2);

var _mobileDetect = require('mobile-detect');

var _mobileDetect2 = _interopRequireDefault(_mobileDetect);

// debug - http://socket.io/docs/logging-and-debugging/#available-debugging-scopes
// localStorage.debug = '*';

/**
 * The `client` object contains the basic methods and attributes of the client.
 * @type {Object}
 */
exports['default'] = {

  /**
   * socket.io library client object, if any.
   * @type {Object}
   * @private
   */
  // io: null,

  /**
   * Socket used to communicate with the server, if any.
   * @type {Socket}
   * @private
   */
  // socket: null,

  com: null,

  /**
   * Information about the client platform.
   * @type {Object}
   * @property {String} os Operating system.
   * @property {Boolean} isMobile Indicates whether the client is running on a
   * mobile platform or not.
   * @property {String} audioFileExt Audio file extension to use, depending on
   * the platform ()
   */
  platform: {
    os: null,
    isMobile: null,
    audioFileExt: '',
    isForbidden: false
  },

  /**
   * Client type.
   * The client type is speficied in the argument of the `init` method. For
   * instance, `'player'` is the client type you should be using by default.
   * @type {String}
   */
  type: null,

  /**
   * Promise resolved when the server sends a message indicating that the client
   * can start the first mdule.
   * @type {Promise}
   * @private
   */
  ready: null,

  /**
   * Client index, given by the server.
   * @type {Number}
   */
  index: -1,

  /**
   * Client coordinates (if any) given by a {@link Locator}, {@link Placer} or
   * {@link Checkin} module. (Format: `[x:Number, y:Number]`.)
   * @type {Number[]}
   */
  coordinates: null,

  /**
   * The `init` method sets the client type and initializes a WebSocket connection associated with the given type.
   * @param {String} [clientType = 'player'] The client type.
   * @todo clarify clientType.
   * @param {Object} [options = {}] The options to initialize a client
   * @param {Boolean} [options.io] By default, a Soundworks application has a client and a server side. For a standalone application (client side only), use `options.io = false`.
   * @todo use default value for options.io in the documentation?
   * @param {String} [options.socketUrl] The URL of the WebSocket server.
   */
  init: function init() {
    var _this = this;

    var clientType = arguments.length <= 0 || arguments[0] === undefined ? 'player' : arguments[0];
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    this.send = this.send.bind(this);
    this.receive = this.receive.bind(this);
    this.removeListener = this.removeListener.bind(this);

    this.type = clientType;

    options = _Object$assign({
      io: true,
      socketUrl: '',
      transports: ['websocket']
    }, options);

    if (options.io !== false) {
      // initialize socket communications
      this.com = _com3['default'].initialize(clientType, options);

      this.ready = new _Promise(function (resolve) {
        console.log('????');
        _this.com.receive('client:start', function (index) {
          _this.index = index;
          resolve();
        });
      });
    } else {
      this.ready = _Promise.resolve(true);
    }

    // --------------------------------------------------------------------
    // @note: move into Platform ? create a dedicated service ?
    // get informations about client
    var ua = window.navigator.userAgent;
    var md = new _mobileDetect2['default'](ua);
    this.platform.isMobile = md.mobile() !== null; // true if phone or tablet
    this.platform.os = (function () {
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
      this.platform.audioFileExt = '.mp3';
    } else if (!!(a.canPlayType && a.canPlayType('audio/ogg; codecs="vorbis"'))) {
      this.platform.audioFileExt = '.ogg';
    } else {
      this.platform.audioFileExt = '.wav';
    }
    // --------------------------------------------------------------------
  },

  /**
   * Start the module logic (*i.e.* the application).
   * @param {Function} startFun [todo]
   * @todo Clarify the param.
   * @return {Promise} The Promise return value.
   * @todo Clarify return value (promise).
   * @todo example
   */
  start: function start(startFun) {
    var module = startFun; // be compatible with previous version

    if (typeof startFun === 'function') {
      module = startFun(_Module2['default'].sequential, _Module2['default'].parallel);
    }

    var promise = module.createPromise();
    this.ready.then(function () {
      return module.launch();
    });

    return promise;
  },

  /**
   * The `serial` method returns a `Module` that starts the given `...modules` in series. After starting the first module (by calling its `start` method), the next module in the series is started (with its `start` method) when the last module called its `done` method. When the last module calls `done`, the returned serial module calls its own `done` method.
   *
   * **Note:** you can compound serial module sequences with parallel module combinations (*e.g.* `client.serial(module1, client.parallel(module2, module3), module4);`).
   * @deprecated Use the new API with the {@link start} method.
   * @param {...Module} ...modules The modules to run in serial.
   * @return {Promise} [description]
   * @todo Clarify return value
   * @todo Remove
   */
  serial: function serial() {
    console.log('The function "client.serial" is deprecated. Please use the new API instead.');
    return _Module2['default'].sequential.apply(_Module2['default'], arguments);
  },

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
   * @todo Remove
   */
  parallel: function parallel() {
    console.log('The function "client.parallel" is deprecated. Please use the new API instead.');
    return _Module2['default'].parallel.apply(_Module2['default'], arguments);
  },

  /**
   * Send a WebSocket message to the server.
   *
   * **Note:** on the server side, the server receives the message with the command {@link ServerClient#receive}.
   * @param {String} msg Name of the message to send.
   * @param {...*} args Arguments of the message (as many as needed, of any type).
   */
  send: function send(msg) {
    var _com;

    if (!this.com) {
      return;
    }

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    (_com = this.com).send.apply(_com, [msg].concat(args));
  },

  /**
   * Listen for a WebSocket message from the server and execute a callback
   * function.
   *
   * **Note:** on the server side, the server sends the message with the command
   * {@link server.send}`.
   * @param {String} msg Name of the received message.
   * @param {Function} callback Callback function executed when the message is
   * received.
   */
  receive: function receive(msg, callback) {
    if (!this.com) {
      return;
    }
    this.com.receive(msg, callback);
  },

  /**
   * Remove a WebSocket message listener (set with the method {@link
   * client.receive}).
   * @param {String} msg Name of the received message.
   * @param {Function} callback Callback function executed when the message is
   * received.
   */
  removeListener: function removeListener(msg, callback) {
    if (!this.com) {
      return;
    }
    this.com.removeListener(msg, callback);
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvUGxhdGZvcm0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O3NCQUFtQixVQUFVOzs7O29CQUNiLE9BQU87Ozs7NEJBQ0UsZUFBZTs7Ozs7Ozs7Ozs7cUJBU3pCOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JiLEtBQUcsRUFBRSxJQUFJOzs7Ozs7Ozs7OztBQVdULFVBQVEsRUFBRTtBQUNSLE1BQUUsRUFBRSxJQUFJO0FBQ1IsWUFBUSxFQUFFLElBQUk7QUFDZCxnQkFBWSxFQUFFLEVBQUU7QUFDaEIsZUFBVyxFQUFFLEtBQUs7R0FDbkI7Ozs7Ozs7O0FBUUQsTUFBSSxFQUFFLElBQUk7Ozs7Ozs7O0FBUVYsT0FBSyxFQUFFLElBQUk7Ozs7OztBQU1YLE9BQUssRUFBRSxDQUFDLENBQUM7Ozs7Ozs7QUFPVCxhQUFXLEVBQUUsSUFBSTs7Ozs7Ozs7Ozs7QUFXakIsTUFBSSxFQUFBLGdCQUFzQzs7O1FBQXJDLFVBQVUseURBQUcsUUFBUTtRQUFFLE9BQU8seURBQUcsRUFBRTs7QUFDdEMsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqQyxRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZDLFFBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXJELFFBQUksQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDOztBQUV2QixXQUFPLEdBQUcsZUFBYztBQUN0QixRQUFFLEVBQUUsSUFBSTtBQUNSLGVBQVMsRUFBRSxFQUFFO0FBQ2IsZ0JBQVUsRUFBRSxDQUFDLFdBQVcsQ0FBQztLQUMxQixFQUFFLE9BQU8sQ0FBQyxDQUFDOztBQUVaLFFBQUksT0FBTyxDQUFDLEVBQUUsS0FBSyxLQUFLLEVBQUU7O0FBRXhCLFVBQUksQ0FBQyxHQUFHLEdBQUcsaUJBQUksVUFBVSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFFL0MsVUFBSSxDQUFDLEtBQUssR0FBRyxhQUFZLFVBQUMsT0FBTyxFQUFLO0FBQ3BDLGVBQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDcEIsY0FBSyxHQUFHLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxVQUFDLEtBQUssRUFBSztBQUMxQyxnQkFBSyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ25CLGlCQUFPLEVBQUUsQ0FBQztTQUNYLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUNKLE1BQU07QUFDTCxVQUFJLENBQUMsS0FBSyxHQUFHLFNBQVEsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3BDOzs7OztBQUtELFFBQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFBO0FBQ3JDLFFBQU0sRUFBRSxHQUFHLDhCQUFpQixFQUFFLENBQUMsQ0FBQztBQUNoQyxRQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsR0FBSSxFQUFFLENBQUMsTUFBTSxFQUFFLEtBQUssSUFBSSxBQUFDLENBQUM7QUFDaEQsUUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxZQUFNO0FBQ3hCLFVBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQzs7QUFFakIsVUFBSSxFQUFFLEtBQUssV0FBVyxFQUFFO0FBQ3RCLGVBQU8sU0FBUyxDQUFDO09BQ2xCLE1BQU0sSUFBSSxFQUFFLEtBQUssS0FBSyxFQUFFO0FBQ3ZCLGVBQU8sS0FBSyxDQUFDO09BQ2QsTUFBTTtBQUNMLGVBQU8sT0FBTyxDQUFDO09BQ2hCO0tBQ0YsQ0FBQSxFQUFHLENBQUM7OztBQUdMLFFBQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTFDLFFBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxXQUFXLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQSxBQUFDLEVBQUU7QUFDckQsVUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDO0tBQ3JDLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDLDRCQUE0QixDQUFDLENBQUEsQUFBQyxFQUFFO0FBQzNFLFVBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQztLQUNyQyxNQUFNO0FBQ0wsVUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDO0tBQ3JDOztHQUVGOzs7Ozs7Ozs7O0FBVUQsT0FBSyxFQUFBLGVBQUMsUUFBUSxFQUFFO0FBQ2QsUUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDOztBQUV0QixRQUFJLE9BQU8sUUFBUSxLQUFLLFVBQVUsRUFBRTtBQUNsQyxZQUFNLEdBQUcsUUFBUSxDQUFDLG9CQUFPLFVBQVUsRUFBRSxvQkFBTyxRQUFRLENBQUMsQ0FBQztLQUN2RDs7QUFFRCxRQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7QUFDckMsUUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7YUFBTSxNQUFNLENBQUMsTUFBTSxFQUFFO0tBQUEsQ0FBQyxDQUFDOztBQUV2QyxXQUFPLE9BQU8sQ0FBQztHQUNoQjs7Ozs7Ozs7Ozs7O0FBWUQsUUFBTSxFQUFBLGtCQUFhO0FBQ2pCLFdBQU8sQ0FBQyxHQUFHLENBQUMsNkVBQTZFLENBQUMsQ0FBQztBQUMzRixXQUFPLG9CQUFPLFVBQVUsTUFBQSxnQ0FBWSxDQUFDO0dBQ3RDOzs7Ozs7Ozs7Ozs7Ozs7QUFlRCxVQUFRLEVBQUEsb0JBQWE7QUFDbkIsV0FBTyxDQUFDLEdBQUcsQ0FBQywrRUFBK0UsQ0FBQyxDQUFDO0FBQzdGLFdBQU8sb0JBQU8sUUFBUSxNQUFBLGdDQUFZLENBQUM7R0FDcEM7Ozs7Ozs7OztBQVNELE1BQUksRUFBQSxjQUFDLEdBQUcsRUFBVzs7O0FBQ2pCLFFBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO0FBQUUsYUFBTztLQUFFOztzQ0FEZixJQUFJO0FBQUosVUFBSTs7O0FBRWYsWUFBQSxJQUFJLENBQUMsR0FBRyxFQUFDLElBQUksTUFBQSxRQUFDLEdBQUcsU0FBSyxJQUFJLEVBQUMsQ0FBQztHQUM3Qjs7Ozs7Ozs7Ozs7O0FBWUQsU0FBTyxFQUFBLGlCQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUU7QUFDckIsUUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7QUFBRSxhQUFPO0tBQUU7QUFDMUIsUUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0dBQ2pDOzs7Ozs7Ozs7QUFTRCxnQkFBYyxFQUFBLHdCQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUU7QUFDNUIsUUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7QUFBRSxhQUFPO0tBQUU7QUFDMUIsUUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0dBQ3hDO0NBQ0YiLCJmaWxlIjoic3JjL2NsaWVudC9QbGF0Zm9ybS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBNb2R1bGUgZnJvbSAnLi9Nb2R1bGUnO1xuaW1wb3J0IGNvbSBmcm9tICcuL2NvbSc7XG5pbXBvcnQgTW9iaWxlRGV0ZWN0IGZyb20gJ21vYmlsZS1kZXRlY3QnO1xuXG4vLyBkZWJ1ZyAtIGh0dHA6Ly9zb2NrZXQuaW8vZG9jcy9sb2dnaW5nLWFuZC1kZWJ1Z2dpbmcvI2F2YWlsYWJsZS1kZWJ1Z2dpbmctc2NvcGVzXG4vLyBsb2NhbFN0b3JhZ2UuZGVidWcgPSAnKic7XG5cbi8qKlxuICogVGhlIGBjbGllbnRgIG9iamVjdCBjb250YWlucyB0aGUgYmFzaWMgbWV0aG9kcyBhbmQgYXR0cmlidXRlcyBvZiB0aGUgY2xpZW50LlxuICogQHR5cGUge09iamVjdH1cbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuXG4gIC8qKlxuICAgKiBzb2NrZXQuaW8gbGlicmFyeSBjbGllbnQgb2JqZWN0LCBpZiBhbnkuXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICAvLyBpbzogbnVsbCxcblxuICAvKipcbiAgICogU29ja2V0IHVzZWQgdG8gY29tbXVuaWNhdGUgd2l0aCB0aGUgc2VydmVyLCBpZiBhbnkuXG4gICAqIEB0eXBlIHtTb2NrZXR9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICAvLyBzb2NrZXQ6IG51bGwsXG5cbiAgY29tOiBudWxsLFxuXG4gIC8qKlxuICAgKiBJbmZvcm1hdGlvbiBhYm91dCB0aGUgY2xpZW50IHBsYXRmb3JtLlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gb3MgT3BlcmF0aW5nIHN5c3RlbS5cbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBpc01vYmlsZSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgY2xpZW50IGlzIHJ1bm5pbmcgb24gYVxuICAgKiBtb2JpbGUgcGxhdGZvcm0gb3Igbm90LlxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gYXVkaW9GaWxlRXh0IEF1ZGlvIGZpbGUgZXh0ZW5zaW9uIHRvIHVzZSwgZGVwZW5kaW5nIG9uXG4gICAqIHRoZSBwbGF0Zm9ybSAoKVxuICAgKi9cbiAgcGxhdGZvcm06IHtcbiAgICBvczogbnVsbCxcbiAgICBpc01vYmlsZTogbnVsbCxcbiAgICBhdWRpb0ZpbGVFeHQ6ICcnLFxuICAgIGlzRm9yYmlkZGVuOiBmYWxzZVxuICB9LFxuXG4gIC8qKlxuICAgKiBDbGllbnQgdHlwZS5cbiAgICogVGhlIGNsaWVudCB0eXBlIGlzIHNwZWZpY2llZCBpbiB0aGUgYXJndW1lbnQgb2YgdGhlIGBpbml0YCBtZXRob2QuIEZvclxuICAgKiBpbnN0YW5jZSwgYCdwbGF5ZXInYCBpcyB0aGUgY2xpZW50IHR5cGUgeW91IHNob3VsZCBiZSB1c2luZyBieSBkZWZhdWx0LlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgdHlwZTogbnVsbCxcblxuICAvKipcbiAgICogUHJvbWlzZSByZXNvbHZlZCB3aGVuIHRoZSBzZXJ2ZXIgc2VuZHMgYSBtZXNzYWdlIGluZGljYXRpbmcgdGhhdCB0aGUgY2xpZW50XG4gICAqIGNhbiBzdGFydCB0aGUgZmlyc3QgbWR1bGUuXG4gICAqIEB0eXBlIHtQcm9taXNlfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVhZHk6IG51bGwsXG5cbiAgLyoqXG4gICAqIENsaWVudCBpbmRleCwgZ2l2ZW4gYnkgdGhlIHNlcnZlci5cbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGluZGV4OiAtMSxcblxuICAvKipcbiAgICogQ2xpZW50IGNvb3JkaW5hdGVzIChpZiBhbnkpIGdpdmVuIGJ5IGEge0BsaW5rIExvY2F0b3J9LCB7QGxpbmsgUGxhY2VyfSBvclxuICAgKiB7QGxpbmsgQ2hlY2tpbn0gbW9kdWxlLiAoRm9ybWF0OiBgW3g6TnVtYmVyLCB5Ok51bWJlcl1gLilcbiAgICogQHR5cGUge051bWJlcltdfVxuICAgKi9cbiAgY29vcmRpbmF0ZXM6IG51bGwsXG5cbiAgLyoqXG4gICAqIFRoZSBgaW5pdGAgbWV0aG9kIHNldHMgdGhlIGNsaWVudCB0eXBlIGFuZCBpbml0aWFsaXplcyBhIFdlYlNvY2tldCBjb25uZWN0aW9uIGFzc29jaWF0ZWQgd2l0aCB0aGUgZ2l2ZW4gdHlwZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtjbGllbnRUeXBlID0gJ3BsYXllciddIFRoZSBjbGllbnQgdHlwZS5cbiAgICogQHRvZG8gY2xhcmlmeSBjbGllbnRUeXBlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMgPSB7fV0gVGhlIG9wdGlvbnMgdG8gaW5pdGlhbGl6ZSBhIGNsaWVudFxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmlvXSBCeSBkZWZhdWx0LCBhIFNvdW5kd29ya3MgYXBwbGljYXRpb24gaGFzIGEgY2xpZW50IGFuZCBhIHNlcnZlciBzaWRlLiBGb3IgYSBzdGFuZGFsb25lIGFwcGxpY2F0aW9uIChjbGllbnQgc2lkZSBvbmx5KSwgdXNlIGBvcHRpb25zLmlvID0gZmFsc2VgLlxuICAgKiBAdG9kbyB1c2UgZGVmYXVsdCB2YWx1ZSBmb3Igb3B0aW9ucy5pbyBpbiB0aGUgZG9jdW1lbnRhdGlvbj9cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLnNvY2tldFVybF0gVGhlIFVSTCBvZiB0aGUgV2ViU29ja2V0IHNlcnZlci5cbiAgICovXG4gIGluaXQoY2xpZW50VHlwZSA9ICdwbGF5ZXInLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLnNlbmQgPSB0aGlzLnNlbmQuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJlY2VpdmUgPSB0aGlzLnJlY2VpdmUuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyID0gdGhpcy5yZW1vdmVMaXN0ZW5lci5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy50eXBlID0gY2xpZW50VHlwZTtcblxuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIGlvOiB0cnVlLFxuICAgICAgc29ja2V0VXJsOiAnJyxcbiAgICAgIHRyYW5zcG9ydHM6IFsnd2Vic29ja2V0J10sXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICBpZiAob3B0aW9ucy5pbyAhPT0gZmFsc2UpIHtcbiAgICAgIC8vIGluaXRpYWxpemUgc29ja2V0IGNvbW11bmljYXRpb25zXG4gICAgICB0aGlzLmNvbSA9IGNvbS5pbml0aWFsaXplKGNsaWVudFR5cGUsIG9wdGlvbnMpO1xuXG4gICAgICB0aGlzLnJlYWR5ID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJz8/Pz8nKTtcbiAgICAgICAgdGhpcy5jb20ucmVjZWl2ZSgnY2xpZW50OnN0YXJ0JywgKGluZGV4KSA9PiB7XG4gICAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZWFkeSA9IFByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIEBub3RlOiBtb3ZlIGludG8gUGxhdGZvcm0gPyBjcmVhdGUgYSBkZWRpY2F0ZWQgc2VydmljZSA/XG4gICAgLy8gZ2V0IGluZm9ybWF0aW9ucyBhYm91dCBjbGllbnRcbiAgICBjb25zdCB1YSA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50XG4gICAgY29uc3QgbWQgPSBuZXcgTW9iaWxlRGV0ZWN0KHVhKTtcbiAgICB0aGlzLnBsYXRmb3JtLmlzTW9iaWxlID0gKG1kLm1vYmlsZSgpICE9PSBudWxsKTsgLy8gdHJ1ZSBpZiBwaG9uZSBvciB0YWJsZXRcbiAgICB0aGlzLnBsYXRmb3JtLm9zID0gKCgpID0+IHtcbiAgICAgIGxldCBvcyA9IG1kLm9zKCk7XG5cbiAgICAgIGlmIChvcyA9PT0gJ0FuZHJvaWRPUycpIHtcbiAgICAgICAgcmV0dXJuICdhbmRyb2lkJztcbiAgICAgIH0gZWxzZSBpZiAob3MgPT09ICdpT1MnKSB7XG4gICAgICAgIHJldHVybiAnaW9zJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAnb3RoZXInO1xuICAgICAgfVxuICAgIH0pKCk7XG5cbiAgICAvLyBhdWRpbyBmaWxlIGV4dGVudGlvbiBjaGVja1xuICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhdWRpbycpO1xuICAgIC8vIGh0dHA6Ly9kaXZlaW50b2h0bWw1LmluZm8vZXZlcnl0aGluZy5odG1sXG4gICAgaWYgKCEhKGEuY2FuUGxheVR5cGUgJiYgYS5jYW5QbGF5VHlwZSgnYXVkaW8vbXBlZzsnKSkpIHtcbiAgICAgIHRoaXMucGxhdGZvcm0uYXVkaW9GaWxlRXh0ID0gJy5tcDMnO1xuICAgIH0gZWxzZSBpZiAoISEoYS5jYW5QbGF5VHlwZSAmJiBhLmNhblBsYXlUeXBlKCdhdWRpby9vZ2c7IGNvZGVjcz1cInZvcmJpc1wiJykpKSB7XG4gICAgICB0aGlzLnBsYXRmb3JtLmF1ZGlvRmlsZUV4dCA9ICcub2dnJztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wbGF0Zm9ybS5hdWRpb0ZpbGVFeHQgPSAnLndhdic7XG4gICAgfVxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIH0sXG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBtb2R1bGUgbG9naWMgKCppLmUuKiB0aGUgYXBwbGljYXRpb24pLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdGFydEZ1biBbdG9kb11cbiAgICogQHRvZG8gQ2xhcmlmeSB0aGUgcGFyYW0uXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IFRoZSBQcm9taXNlIHJldHVybiB2YWx1ZS5cbiAgICogQHRvZG8gQ2xhcmlmeSByZXR1cm4gdmFsdWUgKHByb21pc2UpLlxuICAgKiBAdG9kbyBleGFtcGxlXG4gICAqL1xuICBzdGFydChzdGFydEZ1bikge1xuICAgIGxldCBtb2R1bGUgPSBzdGFydEZ1bjsgLy8gYmUgY29tcGF0aWJsZSB3aXRoIHByZXZpb3VzIHZlcnNpb25cblxuICAgIGlmICh0eXBlb2Ygc3RhcnRGdW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIG1vZHVsZSA9IHN0YXJ0RnVuKE1vZHVsZS5zZXF1ZW50aWFsLCBNb2R1bGUucGFyYWxsZWwpO1xuICAgIH1cblxuICAgIGxldCBwcm9taXNlID0gbW9kdWxlLmNyZWF0ZVByb21pc2UoKTtcbiAgICB0aGlzLnJlYWR5LnRoZW4oKCkgPT4gbW9kdWxlLmxhdW5jaCgpKTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBUaGUgYHNlcmlhbGAgbWV0aG9kIHJldHVybnMgYSBgTW9kdWxlYCB0aGF0IHN0YXJ0cyB0aGUgZ2l2ZW4gYC4uLm1vZHVsZXNgIGluIHNlcmllcy4gQWZ0ZXIgc3RhcnRpbmcgdGhlIGZpcnN0IG1vZHVsZSAoYnkgY2FsbGluZyBpdHMgYHN0YXJ0YCBtZXRob2QpLCB0aGUgbmV4dCBtb2R1bGUgaW4gdGhlIHNlcmllcyBpcyBzdGFydGVkICh3aXRoIGl0cyBgc3RhcnRgIG1ldGhvZCkgd2hlbiB0aGUgbGFzdCBtb2R1bGUgY2FsbGVkIGl0cyBgZG9uZWAgbWV0aG9kLiBXaGVuIHRoZSBsYXN0IG1vZHVsZSBjYWxscyBgZG9uZWAsIHRoZSByZXR1cm5lZCBzZXJpYWwgbW9kdWxlIGNhbGxzIGl0cyBvd24gYGRvbmVgIG1ldGhvZC5cbiAgICpcbiAgICogKipOb3RlOioqIHlvdSBjYW4gY29tcG91bmQgc2VyaWFsIG1vZHVsZSBzZXF1ZW5jZXMgd2l0aCBwYXJhbGxlbCBtb2R1bGUgY29tYmluYXRpb25zICgqZS5nLiogYGNsaWVudC5zZXJpYWwobW9kdWxlMSwgY2xpZW50LnBhcmFsbGVsKG1vZHVsZTIsIG1vZHVsZTMpLCBtb2R1bGU0KTtgKS5cbiAgICogQGRlcHJlY2F0ZWQgVXNlIHRoZSBuZXcgQVBJIHdpdGggdGhlIHtAbGluayBzdGFydH0gbWV0aG9kLlxuICAgKiBAcGFyYW0gey4uLk1vZHVsZX0gLi4ubW9kdWxlcyBUaGUgbW9kdWxlcyB0byBydW4gaW4gc2VyaWFsLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBbZGVzY3JpcHRpb25dXG4gICAqIEB0b2RvIENsYXJpZnkgcmV0dXJuIHZhbHVlXG4gICAqIEB0b2RvIFJlbW92ZVxuICAgKi9cbiAgc2VyaWFsKC4uLm1vZHVsZXMpIHtcbiAgICBjb25zb2xlLmxvZygnVGhlIGZ1bmN0aW9uIFwiY2xpZW50LnNlcmlhbFwiIGlzIGRlcHJlY2F0ZWQuIFBsZWFzZSB1c2UgdGhlIG5ldyBBUEkgaW5zdGVhZC4nKTtcbiAgICByZXR1cm4gTW9kdWxlLnNlcXVlbnRpYWwoLi4ubW9kdWxlcyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFRoZSBgTW9kdWxlYCByZXR1cm5lZCBieSB0aGUgYHBhcmFsbGVsYCBtZXRob2Qgc3RhcnRzIHRoZSBnaXZlbiBgLi4ubW9kdWxlc2AgaW4gcGFyYWxsZWwgKHdpdGggdGhlaXIgYHN0YXJ0YCBtZXRob2RzKSwgYW5kIGNhbGxzIGl0cyBgZG9uZWAgbWV0aG9kIGFmdGVyIGFsbCBtb2R1bGVzIGNhbGxlZCB0aGVpciBvd24gYGRvbmVgIG1ldGhvZHMuXG4gICAqXG4gICAqICoqTm90ZToqKiB5b3UgY2FuIGNvbXBvdW5kIHBhcmFsbGVsIG1vZHVsZSBjb21iaW5hdGlvbnMgd2l0aCBzZXJpYWwgbW9kdWxlIHNlcXVlbmNlcyAoKmUuZy4qIGBjbGllbnQucGFyYWxsZWwobW9kdWxlMSwgY2xpZW50LnNlcmlhbChtb2R1bGUyLCBtb2R1bGUzKSwgbW9kdWxlNCk7YCkuXG4gICAqXG4gICAqICoqTm90ZToqKiB0aGUgYHZpZXdgIG9mIGEgbW9kdWxlIGlzIGFsd2F5cyBmdWxsIHNjcmVlbiwgc28gaW4gdGhlIGNhc2Ugd2hlcmUgbW9kdWxlcyBydW4gaW4gcGFyYWxsZWwsIHRoZWlyIGB2aWV3YHMgYXJlIHN0YWNrZWQgb24gdG9wIG9mIGVhY2ggb3RoZXIgdXNpbmcgdGhlIGB6LWluZGV4YCBDU1MgcHJvcGVydHkuXG4gICAqIFdlIHVzZSB0aGUgb3JkZXIgb2YgdGhlIGBwYXJhbGxlbGAgbWV0aG9kJ3MgYXJndW1lbnRzIHRvIGRldGVybWluZSB0aGUgb3JkZXIgb2YgdGhlIHN0YWNrICgqZS5nLiogaW4gYGNsaWVudC5wYXJhbGxlbChtb2R1bGUxLCBtb2R1bGUyLCBtb2R1bGUzKWAsIHRoZSBgdmlld2Agb2YgYG1vZHVsZTFgIGlzIGRpc3BsYXllZCBvbiB0b3Agb2YgdGhlIGB2aWV3YCBvZiBgbW9kdWxlMmAsIHdoaWNoIGlzIGRpc3BsYXllZCBvbiB0b3Agb2YgdGhlIGB2aWV3YCBvZiBgbW9kdWxlM2ApLlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgdGhlIG5ldyBBUEkgd2l0aCB0aGUge0BsaW5rIHN0YXJ0fSBtZXRob2QuXG4gICAqIEBwYXJhbSB7Li4uTW9kdWxlfSBtb2R1bGVzIFRoZSBtb2R1bGVzIHRvIHJ1biBpbiBwYXJhbGxlbC5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gW2Rlc2NyaXB0aW9uXVxuICAgKiBAdG9kbyBDbGFyaWZ5IHJldHVybiB2YWx1ZVxuICAgKiBAdG9kbyBSZW1vdmVcbiAgICovXG4gIHBhcmFsbGVsKC4uLm1vZHVsZXMpIHtcbiAgICBjb25zb2xlLmxvZygnVGhlIGZ1bmN0aW9uIFwiY2xpZW50LnBhcmFsbGVsXCIgaXMgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSB0aGUgbmV3IEFQSSBpbnN0ZWFkLicpO1xuICAgIHJldHVybiBNb2R1bGUucGFyYWxsZWwoLi4ubW9kdWxlcyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNlbmQgYSBXZWJTb2NrZXQgbWVzc2FnZSB0byB0aGUgc2VydmVyLlxuICAgKlxuICAgKiAqKk5vdGU6Kiogb24gdGhlIHNlcnZlciBzaWRlLCB0aGUgc2VydmVyIHJlY2VpdmVzIHRoZSBtZXNzYWdlIHdpdGggdGhlIGNvbW1hbmQge0BsaW5rIFNlcnZlckNsaWVudCNyZWNlaXZlfS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG1zZyBOYW1lIG9mIHRoZSBtZXNzYWdlIHRvIHNlbmQuXG4gICAqIEBwYXJhbSB7Li4uKn0gYXJncyBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqL1xuICBzZW5kKG1zZywgLi4uYXJncykge1xuICAgIGlmICghdGhpcy5jb20pIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5jb20uc2VuZChtc2csIC4uLmFyZ3MpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBMaXN0ZW4gZm9yIGEgV2ViU29ja2V0IG1lc3NhZ2UgZnJvbSB0aGUgc2VydmVyIGFuZCBleGVjdXRlIGEgY2FsbGJhY2tcbiAgICogZnVuY3Rpb24uXG4gICAqXG4gICAqICoqTm90ZToqKiBvbiB0aGUgc2VydmVyIHNpZGUsIHRoZSBzZXJ2ZXIgc2VuZHMgdGhlIG1lc3NhZ2Ugd2l0aCB0aGUgY29tbWFuZFxuICAgKiB7QGxpbmsgc2VydmVyLnNlbmR9YC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG1zZyBOYW1lIG9mIHRoZSByZWNlaXZlZCBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsYmFjayBmdW5jdGlvbiBleGVjdXRlZCB3aGVuIHRoZSBtZXNzYWdlIGlzXG4gICAqIHJlY2VpdmVkLlxuICAgKi9cbiAgcmVjZWl2ZShtc2csIGNhbGxiYWNrKSB7XG4gICAgaWYgKCF0aGlzLmNvbSkgeyByZXR1cm47IH1cbiAgICB0aGlzLmNvbS5yZWNlaXZlKG1zZywgY2FsbGJhY2spO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBXZWJTb2NrZXQgbWVzc2FnZSBsaXN0ZW5lciAoc2V0IHdpdGggdGhlIG1ldGhvZCB7QGxpbmtcbiAgICogY2xpZW50LnJlY2VpdmV9KS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG1zZyBOYW1lIG9mIHRoZSByZWNlaXZlZCBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsYmFjayBmdW5jdGlvbiBleGVjdXRlZCB3aGVuIHRoZSBtZXNzYWdlIGlzXG4gICAqIHJlY2VpdmVkLlxuICAgKi9cbiAgcmVtb3ZlTGlzdGVuZXIobXNnLCBjYWxsYmFjaykge1xuICAgIGlmICghdGhpcy5jb20pIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5jb20ucmVtb3ZlTGlzdGVuZXIobXNnLCBjYWxsYmFjayk7XG4gIH1cbn07XG5cbiJdfQ==