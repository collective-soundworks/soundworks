'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _wavesAudio = require('waves-audio');

var _client = require('../core/client');

var _client2 = _interopRequireDefault(_client);

var _mobileDetect = require('mobile-detect');

var _mobileDetect2 = _interopRequireDefault(_mobileDetect);

var _screenfull = require('screenfull');

var _screenfull2 = _interopRequireDefault(_screenfull);

var _SegmentedView = require('../views/SegmentedView');

var _SegmentedView2 = _interopRequireDefault(_SegmentedView);

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @todo - define if we keep this in defaults
// import * as adapter from 'webrtc-adapter';
// adapter.disableLog(true);

// @todo - to be added
// + “video-input”: needs video input
// + “video-audio-input”: needs video input
// + DeviceMotion/Orientation conditions generated by the motion-input module

/**
 * Structure of the definition of a feature to be tested.
 * @typedef {Object} module:soundworks/client.Platform~definition
 * @property {String} id - Id of the definition.
 * @property {Function} check - A function that should return `true` if the
 *  feature is available on the platform, `false` otherwise.
 * @property {Function} [interactionHook] - A function to be executed on the
 *  first interaction (i.e. `click` or `touchstart`) of the user with application
 *  (for example, to initialize AudioContext on iOS devices).
 * @property {Function} [interactionHook] - A function to be executed on start
 *  (for example to ask access to microphone or geolocation).
 */
var defaultDefinitions = [{
  id: 'web-audio',
  check: function check() {
    return !!_wavesAudio.audioContext;
  },
  interactionHook: function interactionHook() {
    if (!_client2.default.platform.isMobile) return;

    var g = _wavesAudio.audioContext.createGain();
    g.connect(_wavesAudio.audioContext.destination);
    g.gain.value = 0.000000001; // -180dB ?

    var o = _wavesAudio.audioContext.createOscillator();
    o.connect(g);
    o.frequency.value = 20;
    o.start(0);

    // prevent android to stop audio by keping the oscillator active
    if (_client2.default.platform.os !== 'android') o.stop(_wavesAudio.audioContext.currentTime + 0.01);
  }
}, {
  // @note: `touch` feature workaround
  // cf. http://www.stucox.com/blog/you-cant-detect-a-touchscreen/
  id: 'mobile-device',
  check: function check() {
    return _client2.default.platform.isMobile;
  }
}, {
  id: 'audio-input',
  check: function check() {
    return !!navigator.getUserMedia;
  },
  startHook: function startHook() {
    navigator.getUserMedia({ audio: true }, function (stream) {
      stream.getAudioTracks()[0].stop();
    }, function (err) {
      throw err;
    });
  }
}, {
  id: 'full-screen',
  check: function check() {
    // check later, is not a functionnality that can brake the application
    return true;
  },
  interactionHook: function interactionHook() {
    if (_screenfull2.default.enabled) _screenfull2.default.request();
  }
}];

var SERVICE_ID = 'service:platform';

/**
 * Interface for the client `'platform'` service.
 *
 * This services is responsible to give general informations about the user's
 * device (cf. [`client.device`]{@link module:soundworks/client.client.platform})
 * as well as check availability and provide hooks to initialize the features
 * required by the application (audio, microphone, etc.).
 * If one of the required definitions is not available, an view is created with
 * an error message and the [`client.compatible`]{@link module:soundworks/client.client.compatible}
 * attribute is set to `false`.
 *
 * Available built-in definitions are:
 * - 'web-audio'
 * - 'mobile-device'
 * - 'audio-input'
 * - 'full-screen' (this feature don't block the application, just applied if available)
 *
 * Most of these feature requiring an interaction or a confirmation from the
 * user in order to be initialized correctly, be carefull when setting
 * `showDialog` option to `false`.
 *
 * @see {@link module:soundworks/client.client}
 *
 * @param {Object} options
 * @param {Array<String>|String} options.features - Id(s) of the feature(s)
 *  required by the application.
 * @param {}
 *
 * @memberof module:soundworks/client
 * @example
 * // inside the experience constructor
 * this.platform = this.require('platform', { features: 'web-audio' });
 */

var Platform = function (_Service) {
  (0, _inherits3.default)(Platform, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */

  function Platform() {
    (0, _classCallCheck3.default)(this, Platform);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Platform).call(this, SERVICE_ID, false));

    var defaults = {
      // wakeLock: false, // @todo - fix and transform into a feature
      showDialog: true,
      viewCtor: _SegmentedView2.default,
      viewPriority: 10
    };

    _this.configure(defaults);

    _this._requiredFeatures = new _set2.default();
    _this._featureDefinitions = {};

    defaultDefinitions.forEach(function (def) {
      return _this.addFeatureDefinition(def);
    });
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(Platform, [{
    key: 'configure',
    value: function configure(options) {
      if (options.features) {
        var features = options.features;

        if (typeof features === 'string') features = [features];

        this.requireFeature.apply(this, (0, _toConsumableArray3.default)(features));
        delete options.features;
      }

      (0, _get3.default)((0, _getPrototypeOf2.default)(Platform.prototype), 'configure', this).call(this, options);
    }

    /** @private */

  }, {
    key: 'init',
    value: function init() {
      this._defineAudioFileExtention();
      this._definePlatform();
      // resolve required features from the application
      _client2.default.compatible = this.resolveRequiredFeatures();
      this.viewContent.isCompatible = _client2.default.compatible;

      this.viewCtor = this.options.viewCtor;
      this.view = this.createView();
    }

    /** @private */

  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Platform.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      // execute start hooks from the features definitions
      if (_client2.default.compatible) {
        var startHooks = this.getStartHooks();
        startHooks.forEach(function (hook) {
          return hook();
        });
      }

      // optionnaly skip the view if client is compatible
      if (_client2.default.compatible && !this.options.showDialog) {
        // bypass if features contains 'web-audio' and client.platform.os === 'ios'
        if (this._requiredFeatures.has('web-audio') && _client2.default.platform.os === 'ios') this.show();else this.ready();
      } else {
        this.show();
      }

      // install events for interaction hook
      if (_client2.default.compatible) {
        var event = _client2.default.platform.isMobile ? 'touchend' : 'click';
        this.view.installEvents((0, _defineProperty3.default)({}, event, this._onInteraction.bind(this)));
      }
    }

    /** @private */

  }, {
    key: 'stop',
    value: function stop() {
      this.hide();
      (0, _get3.default)((0, _getPrototypeOf2.default)(Platform.prototype), 'stop', this).call(this);
    }

    /**
     * Add a new feature definition or override an existing one.
     * @param {module:soundworks/client.Platform~definition} obj - Definition of
     *  the feature to add to the existing ones.
     */

  }, {
    key: 'addFeatureDefinition',
    value: function addFeatureDefinition(obj) {
      this._featureDefinitions[obj.id] = obj;
    }

    /**
     * Require features avalability for the application.
     * @private
     * @param {...String} features - The id(s) of the feature(s) to be required.
     */

  }, {
    key: 'requireFeature',
    value: function requireFeature() {
      var _this2 = this;

      for (var _len = arguments.length, features = Array(_len), _key = 0; _key < _len; _key++) {
        features[_key] = arguments[_key];
      }

      features.forEach(function (id) {
        return _this2._requiredFeatures.add(id);
      });
    }

    /**
     * Execute all `check` functions from the definition of the required features.
     * @private
     * @return {Boolean} - true if all checks pass, false otherwise.
     *
     */

  }, {
    key: 'resolveRequiredFeatures',
    value: function resolveRequiredFeatures() {
      var _this3 = this;

      var result = true;

      this._requiredFeatures.forEach(function (feature) {
        var checkFunction = _this3._featureDefinitions[feature].check;

        if (!(typeof checkFunction === 'function')) throw new Error('No check function defined for ' + feature + ' feature');

        result = result && checkFunction();
      });

      return result;
    }

    /**
     * Returns the list of the functions to be executed on `start` lifecycle.
     * @private
     * @return {Array}
     */

  }, {
    key: 'getStartHooks',
    value: function getStartHooks() {
      return this._getHooks('startHook');
    }

    /**
     * Returns the list of the functions to be executed when the user
     * interacts with the application for the first time.
     * @private
     * @return {Array}
     */

  }, {
    key: 'getInteractionHooks',
    value: function getInteractionHooks() {
      return this._getHooks('interactionHook');
    }

    /** @private */

  }, {
    key: '_getHooks',
    value: function _getHooks(type) {
      var _this4 = this;

      var hooks = [];

      this._requiredFeatures.forEach(function (feature) {
        var hook = _this4._featureDefinitions[feature][type];

        if (hook) hooks.push(hook);
      });

      return hooks;
    }

    /**
     * Execute `interactions` hooks from the `platform` service.
     * Also activate the media according to the `options`.
     * @private
     */

  }, {
    key: '_onInteraction',
    value: function _onInteraction() {
      // execute interaction hooks from the platform
      var interactionHooks = this.getInteractionHooks();
      interactionHooks.forEach(function (hook) {
        return hook();
      });

      // @todo - fix and transform into a feature
      // if (this.options.wakeLock)
      //   this._initWakeLock();

      this.ready();
    }

    /**
     * Populate `client.platform` with the prefered audio file extention for the platform.
     * @private
     */

  }, {
    key: '_defineAudioFileExtention',
    value: function _defineAudioFileExtention() {
      var a = document.createElement('audio');
      // http://diveintohtml5.info/everything.html
      if (!!(a.canPlayType && a.canPlayType('audio/mpeg;'))) {
        _client2.default.platform.audioFileExt = '.mp3';
      } else if (!!(a.canPlayType && a.canPlayType('audio/ogg; codecs="vorbis"'))) {
        _client2.default.platform.audioFileExt = '.ogg';
      } else {
        _client2.default.platform.audioFileExt = '.wav';
      }
    }

    /**
     * Populate `client.platform` with the os name.
     * @private
     */

  }, {
    key: '_definePlatform',
    value: function _definePlatform() {
      var ua = window.navigator.userAgent;
      var md = new _mobileDetect2.default(ua);

      _client2.default.platform.isMobile = md.mobile() !== null; // true if phone or tablet
      _client2.default.platform.os = function () {
        var os = md.os();

        if (os === 'AndroidOS') return 'android';else if (os === 'iOS') return 'ios';else return 'other';
      }();
    }

    // @todo - fix transform into feature definition
    // hacks to keep the device awake...
    // cf. https://github.com/borismus/webvr-boilerplate/blob/8abbc74cfa5976b9ab0c388cb0c51944008c6989/js/webvr-manager.js#L268-L289

  }, {
    key: '_initWakeLock',
    value: function _initWakeLock() {
      var _this5 = this;

      this._wakeLockVideo = document.createElement('video');

      this._wakeLockVideo.addEventListener('ended', function () {
        _this5._wakeLockVideo.play();
      });
    }
  }, {
    key: '_requestWakeLock',
    value: function _requestWakeLock() {
      var os = _client2.default.platform.os;
      this._releaseWakeClock();

      if (os === 'ios') {
        if (this._wakeLockTimer) return;

        this._wakeLockTimer = setInterval(function () {
          window.location = window.location;
          setTimeout(window.stop, 0);
        }, 30000);
      } else if (os === 'android') {
        if (this._wakeLockVideo.paused === false) return;

        this._wakeLockVideo.src = _base64('video/webm', 'GkXfowEAAAAAAAAfQoaBAUL3gQFC8oEEQvOBCEKChHdlYm1Ch4ECQoWBAhhTgGcBAAAAAAACWxFNm3RALE27i1OrhBVJqWZTrIHfTbuMU6uEFlSua1OsggEuTbuMU6uEHFO7a1OsggI+7AEAAAAAAACkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVSalmAQAAAAAAAEMq17GDD0JATYCMTGF2ZjU2LjQuMTAxV0GMTGF2ZjU2LjQuMTAxc6SQ20Yv/Elws73A/+KfEjM11ESJiEBkwAAAAAAAFlSuawEAAAAAAABHrgEAAAAAAAA+14EBc8WBAZyBACK1nIN1bmSGhVZfVlA4g4EBI+ODhAT3kNXgAQAAAAAAABKwgRC6gRBTwIEBVLCBEFS6gRAfQ7Z1AQAAAAAAALHngQCgAQAAAAAAAFyho4EAAIAQAgCdASoQABAAAEcIhYWIhYSIAgIADA1gAP7/q1CAdaEBAAAAAAAALaYBAAAAAAAAJO6BAaWfEAIAnQEqEAAQAABHCIWFiIWEiAICAAwNYAD+/7r/QKABAAAAAAAAQKGVgQBTALEBAAEQEAAYABhYL/QACAAAdaEBAAAAAAAAH6YBAAAAAAAAFu6BAaWRsQEAARAQABgAGFgv9AAIAAAcU7trAQAAAAAAABG7j7OBALeK94EB8YIBgfCBAw==');
        this._wakeLockVideo.play();
      }
    }
  }, {
    key: '_releaseWakeClock',
    value: function _releaseWakeClock() {
      var os = _client2.default.platform.os;

      if (os === 'ios') {
        if (this._wakeLockTimer) {
          clearInterval(this._wakeLockTimer);
          this._wakeLockTimer = null;
        }
      } else if (os === 'android') {
        this._wakeLockVideo.pause();
        this._wakeLockVideo.src = '';
      }
    }
  }]);
  return Platform;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, Platform);

exports.default = Platform;
//# sourceMappingURL=data:application/json;base64,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QUNoQixZQUFJLEtBQUssY0FBVCxFQUF5Qjs7QUFFekIsYUFBSyxjQUFMLEdBQXNCLFlBQVksWUFBTTtBQUN0QyxpQkFBTyxRQUFQLEdBQWtCLE9BQU8sUUFBekI7QUFDQSxxQkFBVyxPQUFPLElBQWxCLEVBQXdCLENBQXhCO0FBQ0QsU0FIcUIsRUFHbkIsS0FIbUIsQ0FBdEI7QUFJRCxPQVBELE1BT08sSUFBSSxPQUFPLFNBQVgsRUFBc0I7QUFDM0IsWUFBSSxLQUFLLGNBQUwsQ0FBb0IsTUFBcEIsS0FBK0IsS0FBbkMsRUFBMEM7O0FBRTFDLGFBQUssY0FBTCxDQUFvQixHQUFwQixHQUEwQixRQUFRLFlBQVIsRUFBc0IsazNCQUF0QixDQUExQjtBQUNBLGFBQUssY0FBTCxDQUFvQixJQUFwQjtBQUNEO0FBQ0Y7Ozt3Q0FFbUI7QUFDbEIsVUFBTSxLQUFLLGlCQUFPLFFBQVAsQ0FBZ0IsRUFBM0I7O0FBRUEsVUFBSSxPQUFPLEtBQVgsRUFBa0I7QUFDaEIsWUFBSSxLQUFLLGNBQVQsRUFBeUI7QUFDdkIsd0JBQWMsS0FBSyxjQUFuQjtBQUNBLGVBQUssY0FBTCxHQUFzQixJQUF0QjtBQUNEO0FBQ0YsT0FMRCxNQUtPLElBQUksT0FBTyxTQUFYLEVBQXNCO0FBQzNCLGFBQUssY0FBTCxDQUFvQixLQUFwQjtBQUNBLGFBQUssY0FBTCxDQUFvQixHQUFwQixHQUEwQixFQUExQjtBQUNEO0FBQ0Y7Ozs7O0FBR0gseUJBQWUsUUFBZixDQUF3QixVQUF4QixFQUFvQyxRQUFwQzs7a0JBRWUsUSIsImZpbGUiOiJQbGF0Zm9ybS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGF1ZGlvQ29udGV4dCB9IGZyb20gJ3dhdmVzLWF1ZGlvJztcbmltcG9ydCBjbGllbnQgZnJvbSAnLi4vY29yZS9jbGllbnQnO1xuaW1wb3J0IE1vYmlsZURldGVjdCBmcm9tICdtb2JpbGUtZGV0ZWN0JztcbmltcG9ydCBzY3JlZW5mdWxsIGZyb20gJ3NjcmVlbmZ1bGwnO1xuaW1wb3J0IFNlZ21lbnRlZFZpZXcgZnJvbSAnLi4vdmlld3MvU2VnbWVudGVkVmlldyc7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuXG4vLyBAdG9kbyAtIGRlZmluZSBpZiB3ZSBrZWVwIHRoaXMgaW4gZGVmYXVsdHNcbi8vIGltcG9ydCAqIGFzIGFkYXB0ZXIgZnJvbSAnd2VicnRjLWFkYXB0ZXInO1xuLy8gYWRhcHRlci5kaXNhYmxlTG9nKHRydWUpO1xuXG4vLyBAdG9kbyAtIHRvIGJlIGFkZGVkXG4vLyArIOKAnHZpZGVvLWlucHV04oCdOiBuZWVkcyB2aWRlbyBpbnB1dFxuLy8gKyDigJx2aWRlby1hdWRpby1pbnB1dOKAnTogbmVlZHMgdmlkZW8gaW5wdXRcbi8vICsgRGV2aWNlTW90aW9uL09yaWVudGF0aW9uIGNvbmRpdGlvbnMgZ2VuZXJhdGVkIGJ5IHRoZSBtb3Rpb24taW5wdXQgbW9kdWxlXG5cbi8qKlxuICogU3RydWN0dXJlIG9mIHRoZSBkZWZpbml0aW9uIG9mIGEgZmVhdHVyZSB0byBiZSB0ZXN0ZWQuXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhdGZvcm1+ZGVmaW5pdGlvblxuICogQHByb3BlcnR5IHtTdHJpbmd9IGlkIC0gSWQgb2YgdGhlIGRlZmluaXRpb24uXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBjaGVjayAtIEEgZnVuY3Rpb24gdGhhdCBzaG91bGQgcmV0dXJuIGB0cnVlYCBpZiB0aGVcbiAqICBmZWF0dXJlIGlzIGF2YWlsYWJsZSBvbiB0aGUgcGxhdGZvcm0sIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gW2ludGVyYWN0aW9uSG9va10gLSBBIGZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkIG9uIHRoZVxuICogIGZpcnN0IGludGVyYWN0aW9uIChpLmUuIGBjbGlja2Agb3IgYHRvdWNoc3RhcnRgKSBvZiB0aGUgdXNlciB3aXRoIGFwcGxpY2F0aW9uXG4gKiAgKGZvciBleGFtcGxlLCB0byBpbml0aWFsaXplIEF1ZGlvQ29udGV4dCBvbiBpT1MgZGV2aWNlcykuXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBbaW50ZXJhY3Rpb25Ib29rXSAtIEEgZnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQgb24gc3RhcnRcbiAqICAoZm9yIGV4YW1wbGUgdG8gYXNrIGFjY2VzcyB0byBtaWNyb3Bob25lIG9yIGdlb2xvY2F0aW9uKS5cbiAqL1xuY29uc3QgZGVmYXVsdERlZmluaXRpb25zID0gW1xuICB7XG4gICAgaWQ6ICd3ZWItYXVkaW8nLFxuICAgIGNoZWNrOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAhIWF1ZGlvQ29udGV4dDtcbiAgICB9LFxuICAgIGludGVyYWN0aW9uSG9vazogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIWNsaWVudC5wbGF0Zm9ybS5pc01vYmlsZSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBjb25zdCBnID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgICAgIGcuY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuICAgICAgZy5nYWluLnZhbHVlID0gMC4wMDAwMDAwMDE7IC8vIC0xODBkQiA/XG5cbiAgICAgIGNvbnN0IG8gPSBhdWRpb0NvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xuICAgICAgby5jb25uZWN0KGcpO1xuICAgICAgby5mcmVxdWVuY3kudmFsdWUgPSAyMDtcbiAgICAgIG8uc3RhcnQoMCk7XG5cbiAgICAgIC8vIHByZXZlbnQgYW5kcm9pZCB0byBzdG9wIGF1ZGlvIGJ5IGtlcGluZyB0aGUgb3NjaWxsYXRvciBhY3RpdmVcbiAgICAgIGlmIChjbGllbnQucGxhdGZvcm0ub3MgIT09ICdhbmRyb2lkJylcbiAgICAgICAgby5zdG9wKGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSArIDAuMDEpO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIC8vIEBub3RlOiBgdG91Y2hgIGZlYXR1cmUgd29ya2Fyb3VuZFxuICAgIC8vIGNmLiBodHRwOi8vd3d3LnN0dWNveC5jb20vYmxvZy95b3UtY2FudC1kZXRlY3QtYS10b3VjaHNjcmVlbi9cbiAgICBpZDogJ21vYmlsZS1kZXZpY2UnLFxuICAgIGNoZWNrOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjbGllbnQucGxhdGZvcm0uaXNNb2JpbGU7XG4gICAgfVxuICB9LFxuICB7XG4gICAgaWQ6ICdhdWRpby1pbnB1dCcsXG4gICAgY2hlY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICEhbmF2aWdhdG9yLmdldFVzZXJNZWRpYTtcbiAgICB9LFxuICAgIHN0YXJ0SG9vazogZnVuY3Rpb24oKSB7XG4gICAgICBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhKHsgYXVkaW86IHRydWUgfSwgZnVuY3Rpb24oc3RyZWFtKSB7XG4gICAgICAgIHN0cmVhbS5nZXRBdWRpb1RyYWNrcygpWzBdLnN0b3AoKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfSk7XG4gICAgfVxuICB9LFxuICB7XG4gICAgaWQ6ICdmdWxsLXNjcmVlbicsXG4gICAgY2hlY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gY2hlY2sgbGF0ZXIsIGlzIG5vdCBhIGZ1bmN0aW9ubmFsaXR5IHRoYXQgY2FuIGJyYWtlIHRoZSBhcHBsaWNhdGlvblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBpbnRlcmFjdGlvbkhvb2soKSB7XG4gICAgICBpZiAoc2NyZWVuZnVsbC5lbmFibGVkKVxuICAgICAgICBzY3JlZW5mdWxsLnJlcXVlc3QoKTtcbiAgICB9XG4gIH1cbl07XG5cblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOnBsYXRmb3JtJztcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBjbGllbnQgYCdwbGF0Zm9ybSdgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlcyBpcyByZXNwb25zaWJsZSB0byBnaXZlIGdlbmVyYWwgaW5mb3JtYXRpb25zIGFib3V0IHRoZSB1c2VyJ3NcbiAqIGRldmljZSAoY2YuIFtgY2xpZW50LmRldmljZWBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5jbGllbnQucGxhdGZvcm19KVxuICogYXMgd2VsbCBhcyBjaGVjayBhdmFpbGFiaWxpdHkgYW5kIHByb3ZpZGUgaG9va3MgdG8gaW5pdGlhbGl6ZSB0aGUgZmVhdHVyZXNcbiAqIHJlcXVpcmVkIGJ5IHRoZSBhcHBsaWNhdGlvbiAoYXVkaW8sIG1pY3JvcGhvbmUsIGV0Yy4pLlxuICogSWYgb25lIG9mIHRoZSByZXF1aXJlZCBkZWZpbml0aW9ucyBpcyBub3QgYXZhaWxhYmxlLCBhbiB2aWV3IGlzIGNyZWF0ZWQgd2l0aFxuICogYW4gZXJyb3IgbWVzc2FnZSBhbmQgdGhlIFtgY2xpZW50LmNvbXBhdGlibGVgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuY2xpZW50LmNvbXBhdGlibGV9XG4gKiBhdHRyaWJ1dGUgaXMgc2V0IHRvIGBmYWxzZWAuXG4gKlxuICogQXZhaWxhYmxlIGJ1aWx0LWluIGRlZmluaXRpb25zIGFyZTpcbiAqIC0gJ3dlYi1hdWRpbydcbiAqIC0gJ21vYmlsZS1kZXZpY2UnXG4gKiAtICdhdWRpby1pbnB1dCdcbiAqIC0gJ2Z1bGwtc2NyZWVuJyAodGhpcyBmZWF0dXJlIGRvbid0IGJsb2NrIHRoZSBhcHBsaWNhdGlvbiwganVzdCBhcHBsaWVkIGlmIGF2YWlsYWJsZSlcbiAqXG4gKiBNb3N0IG9mIHRoZXNlIGZlYXR1cmUgcmVxdWlyaW5nIGFuIGludGVyYWN0aW9uIG9yIGEgY29uZmlybWF0aW9uIGZyb20gdGhlXG4gKiB1c2VyIGluIG9yZGVyIHRvIGJlIGluaXRpYWxpemVkIGNvcnJlY3RseSwgYmUgY2FyZWZ1bGwgd2hlbiBzZXR0aW5nXG4gKiBgc2hvd0RpYWxvZ2Agb3B0aW9uIHRvIGBmYWxzZWAuXG4gKlxuICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LmNsaWVudH1cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtBcnJheTxTdHJpbmc+fFN0cmluZ30gb3B0aW9ucy5mZWF0dXJlcyAtIElkKHMpIG9mIHRoZSBmZWF0dXJlKHMpXG4gKiAgcmVxdWlyZWQgYnkgdGhlIGFwcGxpY2F0aW9uLlxuICogQHBhcmFtIHt9XG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQGV4YW1wbGVcbiAqIC8vIGluc2lkZSB0aGUgZXhwZXJpZW5jZSBjb25zdHJ1Y3RvclxuICogdGhpcy5wbGF0Zm9ybSA9IHRoaXMucmVxdWlyZSgncGxhdGZvcm0nLCB7IGZlYXR1cmVzOiAnd2ViLWF1ZGlvJyB9KTtcbiAqL1xuY2xhc3MgUGxhdGZvcm0gZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFuY2lhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCBmYWxzZSk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIC8vIHdha2VMb2NrOiBmYWxzZSwgLy8gQHRvZG8gLSBmaXggYW5kIHRyYW5zZm9ybSBpbnRvIGEgZmVhdHVyZVxuICAgICAgc2hvd0RpYWxvZzogdHJ1ZSxcbiAgICAgIHZpZXdDdG9yOiBTZWdtZW50ZWRWaWV3LFxuICAgICAgdmlld1ByaW9yaXR5OiAxMCxcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgdGhpcy5fcmVxdWlyZWRGZWF0dXJlcyA9IG5ldyBTZXQoKTtcbiAgICB0aGlzLl9mZWF0dXJlRGVmaW5pdGlvbnMgPSB7fTtcblxuICAgIGRlZmF1bHREZWZpbml0aW9ucy5mb3JFYWNoKChkZWYpID0+IHRoaXMuYWRkRmVhdHVyZURlZmluaXRpb24oZGVmKSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgY29uZmlndXJlKG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy5mZWF0dXJlcykge1xuICAgICAgbGV0IGZlYXR1cmVzID0gb3B0aW9ucy5mZWF0dXJlcztcblxuICAgICAgaWYgKHR5cGVvZiBmZWF0dXJlcyA9PT0gJ3N0cmluZycpXG4gICAgICAgIGZlYXR1cmVzID0gW2ZlYXR1cmVzXTtcblxuICAgICAgdGhpcy5yZXF1aXJlRmVhdHVyZSguLi5mZWF0dXJlcyk7XG4gICAgICBkZWxldGUgb3B0aW9ucy5mZWF0dXJlcztcbiAgICB9XG5cbiAgICBzdXBlci5jb25maWd1cmUob3B0aW9ucyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgaW5pdCgpIHtcbiAgICB0aGlzLl9kZWZpbmVBdWRpb0ZpbGVFeHRlbnRpb24oKTtcbiAgICB0aGlzLl9kZWZpbmVQbGF0Zm9ybSgpO1xuICAgIC8vIHJlc29sdmUgcmVxdWlyZWQgZmVhdHVyZXMgZnJvbSB0aGUgYXBwbGljYXRpb25cbiAgICBjbGllbnQuY29tcGF0aWJsZSA9IHRoaXMucmVzb2x2ZVJlcXVpcmVkRmVhdHVyZXMoKTtcbiAgICB0aGlzLnZpZXdDb250ZW50LmlzQ29tcGF0aWJsZSA9IGNsaWVudC5jb21wYXRpYmxlO1xuXG4gICAgdGhpcy52aWV3Q3RvciA9IHRoaXMub3B0aW9ucy52aWV3Q3RvcjtcbiAgICB0aGlzLnZpZXcgPSB0aGlzLmNyZWF0ZVZpZXcoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgaWYgKCF0aGlzLmhhc1N0YXJ0ZWQpXG4gICAgICB0aGlzLmluaXQoKTtcblxuICAgIC8vIGV4ZWN1dGUgc3RhcnQgaG9va3MgZnJvbSB0aGUgZmVhdHVyZXMgZGVmaW5pdGlvbnNcbiAgICBpZihjbGllbnQuY29tcGF0aWJsZSkge1xuICAgICAgY29uc3Qgc3RhcnRIb29rcyA9IHRoaXMuZ2V0U3RhcnRIb29rcygpO1xuICAgICAgc3RhcnRIb29rcy5mb3JFYWNoKChob29rKSA9PiBob29rKCkpO1xuICAgIH1cblxuICAgIC8vIG9wdGlvbm5hbHkgc2tpcCB0aGUgdmlldyBpZiBjbGllbnQgaXMgY29tcGF0aWJsZVxuICAgIGlmIChjbGllbnQuY29tcGF0aWJsZSAmJiAhdGhpcy5vcHRpb25zLnNob3dEaWFsb2cpIHtcbiAgICAgIC8vIGJ5cGFzcyBpZiBmZWF0dXJlcyBjb250YWlucyAnd2ViLWF1ZGlvJyBhbmQgY2xpZW50LnBsYXRmb3JtLm9zID09PSAnaW9zJ1xuICAgICAgaWYgKHRoaXMuX3JlcXVpcmVkRmVhdHVyZXMuaGFzKCd3ZWItYXVkaW8nKSAmJiBjbGllbnQucGxhdGZvcm0ub3MgPT09ICdpb3MnKVxuICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgIGVsc2VcbiAgICAgICAgdGhpcy5yZWFkeSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNob3coKTtcbiAgICB9XG5cbiAgICAvLyBpbnN0YWxsIGV2ZW50cyBmb3IgaW50ZXJhY3Rpb24gaG9va1xuICAgIGlmIChjbGllbnQuY29tcGF0aWJsZSkge1xuICAgICAgY29uc3QgZXZlbnQgPSBjbGllbnQucGxhdGZvcm0uaXNNb2JpbGUgPyAndG91Y2hlbmQnIDogJ2NsaWNrJztcbiAgICAgIHRoaXMudmlldy5pbnN0YWxsRXZlbnRzKHsgW2V2ZW50XTogdGhpcy5fb25JbnRlcmFjdGlvbi5iaW5kKHRoaXMpIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdG9wKCkge1xuICAgIHRoaXMuaGlkZSgpO1xuICAgIHN1cGVyLnN0b3AoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBuZXcgZmVhdHVyZSBkZWZpbml0aW9uIG9yIG92ZXJyaWRlIGFuIGV4aXN0aW5nIG9uZS5cbiAgICogQHBhcmFtIHttb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhdGZvcm1+ZGVmaW5pdGlvbn0gb2JqIC0gRGVmaW5pdGlvbiBvZlxuICAgKiAgdGhlIGZlYXR1cmUgdG8gYWRkIHRvIHRoZSBleGlzdGluZyBvbmVzLlxuICAgKi9cbiAgYWRkRmVhdHVyZURlZmluaXRpb24ob2JqKSB7XG4gICAgdGhpcy5fZmVhdHVyZURlZmluaXRpb25zW29iai5pZF0gPSBvYmo7XG4gIH1cblxuICAvKipcbiAgICogUmVxdWlyZSBmZWF0dXJlcyBhdmFsYWJpbGl0eSBmb3IgdGhlIGFwcGxpY2F0aW9uLlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0gey4uLlN0cmluZ30gZmVhdHVyZXMgLSBUaGUgaWQocykgb2YgdGhlIGZlYXR1cmUocykgdG8gYmUgcmVxdWlyZWQuXG4gICAqL1xuICByZXF1aXJlRmVhdHVyZSguLi5mZWF0dXJlcykge1xuICAgIGZlYXR1cmVzLmZvckVhY2goKGlkKSA9PiB0aGlzLl9yZXF1aXJlZEZlYXR1cmVzLmFkZChpZCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGUgYWxsIGBjaGVja2AgZnVuY3Rpb25zIGZyb20gdGhlIGRlZmluaXRpb24gb2YgdGhlIHJlcXVpcmVkIGZlYXR1cmVzLlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcmV0dXJuIHtCb29sZWFufSAtIHRydWUgaWYgYWxsIGNoZWNrcyBwYXNzLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqXG4gICAqL1xuICByZXNvbHZlUmVxdWlyZWRGZWF0dXJlcygpIHtcbiAgICBsZXQgcmVzdWx0ID0gdHJ1ZTtcblxuICAgIHRoaXMuX3JlcXVpcmVkRmVhdHVyZXMuZm9yRWFjaCgoZmVhdHVyZSkgPT4ge1xuICAgICAgY29uc3QgY2hlY2tGdW5jdGlvbiA9IHRoaXMuX2ZlYXR1cmVEZWZpbml0aW9uc1tmZWF0dXJlXS5jaGVjaztcblxuICAgICAgaWYgKCEodHlwZW9mIGNoZWNrRnVuY3Rpb24gPT09ICdmdW5jdGlvbicpKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIGNoZWNrIGZ1bmN0aW9uIGRlZmluZWQgZm9yICR7ZmVhdHVyZX0gZmVhdHVyZWApO1xuXG4gICAgICByZXN1bHQgPSByZXN1bHQgJiYgY2hlY2tGdW5jdGlvbigpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBsaXN0IG9mIHRoZSBmdW5jdGlvbnMgdG8gYmUgZXhlY3V0ZWQgb24gYHN0YXJ0YCBsaWZlY3ljbGUuXG4gICAqIEBwcml2YXRlXG4gICAqIEByZXR1cm4ge0FycmF5fVxuICAgKi9cbiAgZ2V0U3RhcnRIb29rcygpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0SG9va3MoJ3N0YXJ0SG9vaycpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGxpc3Qgb2YgdGhlIGZ1bmN0aW9ucyB0byBiZSBleGVjdXRlZCB3aGVuIHRoZSB1c2VyXG4gICAqIGludGVyYWN0cyB3aXRoIHRoZSBhcHBsaWNhdGlvbiBmb3IgdGhlIGZpcnN0IHRpbWUuXG4gICAqIEBwcml2YXRlXG4gICAqIEByZXR1cm4ge0FycmF5fVxuICAgKi9cbiAgZ2V0SW50ZXJhY3Rpb25Ib29rcygpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0SG9va3MoJ2ludGVyYWN0aW9uSG9vaycpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9nZXRIb29rcyh0eXBlKSB7XG4gICAgY29uc3QgaG9va3MgPSBbXTtcblxuICAgIHRoaXMuX3JlcXVpcmVkRmVhdHVyZXMuZm9yRWFjaCgoZmVhdHVyZSkgPT4ge1xuICAgICAgY29uc3QgaG9vayA9IHRoaXMuX2ZlYXR1cmVEZWZpbml0aW9uc1tmZWF0dXJlXVt0eXBlXTtcblxuICAgICAgaWYgKGhvb2spXG4gICAgICAgIGhvb2tzLnB1c2goaG9vayk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gaG9va3M7XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZSBgaW50ZXJhY3Rpb25zYCBob29rcyBmcm9tIHRoZSBgcGxhdGZvcm1gIHNlcnZpY2UuXG4gICAqIEFsc28gYWN0aXZhdGUgdGhlIG1lZGlhIGFjY29yZGluZyB0byB0aGUgYG9wdGlvbnNgLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX29uSW50ZXJhY3Rpb24oKSB7XG4gICAgLy8gZXhlY3V0ZSBpbnRlcmFjdGlvbiBob29rcyBmcm9tIHRoZSBwbGF0Zm9ybVxuICAgIGNvbnN0IGludGVyYWN0aW9uSG9va3MgPSB0aGlzLmdldEludGVyYWN0aW9uSG9va3MoKTtcbiAgICBpbnRlcmFjdGlvbkhvb2tzLmZvckVhY2goKGhvb2spID0+IGhvb2soKSk7XG5cbiAgICAvLyBAdG9kbyAtIGZpeCBhbmQgdHJhbnNmb3JtIGludG8gYSBmZWF0dXJlXG4gICAgLy8gaWYgKHRoaXMub3B0aW9ucy53YWtlTG9jaylcbiAgICAvLyAgIHRoaXMuX2luaXRXYWtlTG9jaygpO1xuXG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBvcHVsYXRlIGBjbGllbnQucGxhdGZvcm1gIHdpdGggdGhlIHByZWZlcmVkIGF1ZGlvIGZpbGUgZXh0ZW50aW9uIGZvciB0aGUgcGxhdGZvcm0uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfZGVmaW5lQXVkaW9GaWxlRXh0ZW50aW9uKCkge1xuICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhdWRpbycpO1xuICAgIC8vIGh0dHA6Ly9kaXZlaW50b2h0bWw1LmluZm8vZXZlcnl0aGluZy5odG1sXG4gICAgaWYgKCEhKGEuY2FuUGxheVR5cGUgJiYgYS5jYW5QbGF5VHlwZSgnYXVkaW8vbXBlZzsnKSkpIHtcbiAgICAgIGNsaWVudC5wbGF0Zm9ybS5hdWRpb0ZpbGVFeHQgPSAnLm1wMyc7XG4gICAgfSBlbHNlIGlmICghIShhLmNhblBsYXlUeXBlICYmIGEuY2FuUGxheVR5cGUoJ2F1ZGlvL29nZzsgY29kZWNzPVwidm9yYmlzXCInKSkpIHtcbiAgICAgIGNsaWVudC5wbGF0Zm9ybS5hdWRpb0ZpbGVFeHQgPSAnLm9nZyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNsaWVudC5wbGF0Zm9ybS5hdWRpb0ZpbGVFeHQgPSAnLndhdic7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFBvcHVsYXRlIGBjbGllbnQucGxhdGZvcm1gIHdpdGggdGhlIG9zIG5hbWUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfZGVmaW5lUGxhdGZvcm0oKSB7XG4gICAgY29uc3QgdWEgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudFxuICAgIGNvbnN0IG1kID0gbmV3IE1vYmlsZURldGVjdCh1YSk7XG5cbiAgICBjbGllbnQucGxhdGZvcm0uaXNNb2JpbGUgPSAobWQubW9iaWxlKCkgIT09IG51bGwpOyAvLyB0cnVlIGlmIHBob25lIG9yIHRhYmxldFxuICAgIGNsaWVudC5wbGF0Zm9ybS5vcyA9IChmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG9zID0gbWQub3MoKTtcblxuICAgICAgaWYgKG9zID09PSAnQW5kcm9pZE9TJylcbiAgICAgICAgcmV0dXJuICdhbmRyb2lkJztcbiAgICAgIGVsc2UgaWYgKG9zID09PSAnaU9TJylcbiAgICAgICAgcmV0dXJuICdpb3MnO1xuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gJ290aGVyJztcbiAgICB9KSgpO1xuICB9XG5cbiAgLy8gQHRvZG8gLSBmaXggdHJhbnNmb3JtIGludG8gZmVhdHVyZSBkZWZpbml0aW9uXG4gIC8vIGhhY2tzIHRvIGtlZXAgdGhlIGRldmljZSBhd2FrZS4uLlxuICAvLyBjZi4gaHR0cHM6Ly9naXRodWIuY29tL2JvcmlzbXVzL3dlYnZyLWJvaWxlcnBsYXRlL2Jsb2IvOGFiYmM3NGNmYTU5NzZiOWFiMGMzODhjYjBjNTE5NDQwMDhjNjk4OS9qcy93ZWJ2ci1tYW5hZ2VyLmpzI0wyNjgtTDI4OVxuICBfaW5pdFdha2VMb2NrKCkge1xuICAgIHRoaXMuX3dha2VMb2NrVmlkZW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd2aWRlbycpO1xuXG4gICAgdGhpcy5fd2FrZUxvY2tWaWRlby5hZGRFdmVudExpc3RlbmVyKCdlbmRlZCcsICgpID0+IHtcbiAgICAgIHRoaXMuX3dha2VMb2NrVmlkZW8ucGxheSgpO1xuICAgIH0pO1xuICB9XG5cbiAgX3JlcXVlc3RXYWtlTG9jaygpIHtcbiAgICBjb25zdCBvcyA9IGNsaWVudC5wbGF0Zm9ybS5vcztcbiAgICB0aGlzLl9yZWxlYXNlV2FrZUNsb2NrKCk7XG5cbiAgICBpZiAob3MgPT09ICdpb3MnKSB7XG4gICAgICBpZiAodGhpcy5fd2FrZUxvY2tUaW1lcikgcmV0dXJuO1xuXG4gICAgICB0aGlzLl93YWtlTG9ja1RpbWVyID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24gPSB3aW5kb3cubG9jYXRpb247XG4gICAgICAgIHNldFRpbWVvdXQod2luZG93LnN0b3AsIDApO1xuICAgICAgfSwgMzAwMDApO1xuICAgIH0gZWxzZSBpZiAob3MgPT09ICdhbmRyb2lkJykge1xuICAgICAgaWYgKHRoaXMuX3dha2VMb2NrVmlkZW8ucGF1c2VkID09PSBmYWxzZSkgcmV0dXJuO1xuXG4gICAgICB0aGlzLl93YWtlTG9ja1ZpZGVvLnNyYyA9IF9iYXNlNjQoJ3ZpZGVvL3dlYm0nLCAnR2tYZm93RUFBQUFBQUFBZlFvYUJBVUwzZ1FGQzhvRUVRdk9CQ0VLQ2hIZGxZbTFDaDRFQ1FvV0JBaGhUZ0djQkFBQUFBQUFDV3hGTm0zUkFMRTI3aTFPcmhCVkpxV1pUcklIZlRidU1VNnVFRmxTdWExT3NnZ0V1VGJ1TVU2dUVIRk83YTFPc2dnSSs3QUVBQUFBQUFBQ2tBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFWU2FsbUFRQUFBQUFBQUVNcTE3R0REMEpBVFlDTVRHRjJaalUyTGpRdU1UQXhWMEdNVEdGMlpqVTJMalF1TVRBeGM2U1EyMFl2L0Vsd3M3M0EvK0tmRWpNMTFFU0ppRUJrd0FBQUFBQUFGbFN1YXdFQUFBQUFBQUJIcmdFQUFBQUFBQUErMTRFQmM4V0JBWnlCQUNLMW5JTjFibVNHaFZaZlZsQTRnNEVCSStPRGhBVDNrTlhnQVFBQUFBQUFBQkt3Z1JDNmdSQlR3SUVCVkxDQkVGUzZnUkFmUTdaMUFRQUFBQUFBQUxIbmdRQ2dBUUFBQUFBQUFGeWhvNEVBQUlBUUFnQ2RBU29RQUJBQUFFY0loWVdJaFlTSUFnSUFEQTFnQVA3L3ExQ0FkYUVCQUFBQUFBQUFMYVlCQUFBQUFBQUFKTzZCQWFXZkVBSUFuUUVxRUFBUUFBQkhDSVdGaUlXRWlBSUNBQXdOWUFEKy83ci9RS0FCQUFBQUFBQUFRS0dWZ1FCVEFMRUJBQUVRRUFBWUFCaFlML1FBQ0FBQWRhRUJBQUFBQUFBQUg2WUJBQUFBQUFBQUZ1NkJBYVdSc1FFQUFSQVFBQmdBR0ZndjlBQUlBQUFjVTd0ckFRQUFBQUFBQUJHN2o3T0JBTGVLOTRFQjhZSUJnZkNCQXc9PScpO1xuICAgICAgdGhpcy5fd2FrZUxvY2tWaWRlby5wbGF5KCk7XG4gICAgfVxuICB9XG5cbiAgX3JlbGVhc2VXYWtlQ2xvY2soKSB7XG4gICAgY29uc3Qgb3MgPSBjbGllbnQucGxhdGZvcm0ub3M7XG5cbiAgICBpZiAob3MgPT09ICdpb3MnKSB7XG4gICAgICBpZiAodGhpcy5fd2FrZUxvY2tUaW1lcikge1xuICAgICAgICBjbGVhckludGVydmFsKHRoaXMuX3dha2VMb2NrVGltZXIpO1xuICAgICAgICB0aGlzLl93YWtlTG9ja1RpbWVyID0gbnVsbDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9zID09PSAnYW5kcm9pZCcpIHtcbiAgICAgIHRoaXMuX3dha2VMb2NrVmlkZW8ucGF1c2UoKTtcbiAgICAgIHRoaXMuX3dha2VMb2NrVmlkZW8uc3JjID0gJyc7XG4gICAgfVxuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFBsYXRmb3JtKTtcblxuZXhwb3J0IGRlZmF1bHQgUGxhdGZvcm07XG4iXX0=