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

/**
 * Structure of the definition of a feature to be tested.
 *
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
    // functionnality that cannot brake the application
    return true;
  },
  interactionHook: function interactionHook() {
    if (_screenfull2.default.enabled) _screenfull2.default.request();
  }
}, {
  // adapted from https://github.com/richtr/NoSleep.js/blob/master/NoSleep.js
  id: 'wake-lock',
  check: function check() {
    // functionnality that cannot brake the application
    return true;
  },
  interactionHook: function interactionHook() {
    if (_client2.default.platform.os === 'ios') {
      setInterval(function () {
        window.location = window.location;
        setTimeout(window.stop, 0);
      }, 30000);
    } else {
      var medias = {
        webm: "data:video/webm;base64,GkXfo0AgQoaBAUL3gQFC8oEEQvOBCEKCQAR3ZWJtQoeBAkKFgQIYU4BnQI0VSalmQCgq17FAAw9CQE2AQAZ3aGFtbXlXQUAGd2hhbW15RIlACECPQAAAAAAAFlSua0AxrkAu14EBY8WBAZyBACK1nEADdW5khkAFVl9WUDglhohAA1ZQOIOBAeBABrCBCLqBCB9DtnVAIueBAKNAHIEAAIAwAQCdASoIAAgAAUAmJaQAA3AA/vz0AAA=",
        mp4: "data:video/mp4;base64,AAAAHGZ0eXBpc29tAAACAGlzb21pc28ybXA0MQAAAAhmcmVlAAAAG21kYXQAAAGzABAHAAABthADAowdbb9/AAAC6W1vb3YAAABsbXZoZAAAAAB8JbCAfCWwgAAAA+gAAAAAAAEAAAEAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAIVdHJhawAAAFx0a2hkAAAAD3wlsIB8JbCAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAIAAAACAAAAAABsW1kaWEAAAAgbWRoZAAAAAB8JbCAfCWwgAAAA+gAAAAAVcQAAAAAAC1oZGxyAAAAAAAAAAB2aWRlAAAAAAAAAAAAAAAAVmlkZW9IYW5kbGVyAAAAAVxtaW5mAAAAFHZtaGQAAAABAAAAAAAAAAAAAAAkZGluZgAAABxkcmVmAAAAAAAAAAEAAAAMdXJsIAAAAAEAAAEcc3RibAAAALhzdHNkAAAAAAAAAAEAAACobXA0dgAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAIAAgASAAAAEgAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABj//wAAAFJlc2RzAAAAAANEAAEABDwgEQAAAAADDUAAAAAABS0AAAGwAQAAAbWJEwAAAQAAAAEgAMSNiB9FAEQBFGMAAAGyTGF2YzUyLjg3LjQGAQIAAAAYc3R0cwAAAAAAAAABAAAAAQAAAAAAAAAcc3RzYwAAAAAAAAABAAAAAQAAAAEAAAABAAAAFHN0c3oAAAAAAAAAEwAAAAEAAAAUc3RjbwAAAAAAAAABAAAALAAAAGB1ZHRhAAAAWG1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXJhcHBsAAAAAAAAAAAAAAAAK2lsc3QAAAAjqXRvbwAAABtkYXRhAAAAAQAAAABMYXZmNTIuNzguMw=="
      };

      var $video = document.createElement('video');
      $video.setAttribute('loop', '');

      for (var type in medias) {
        var dataURI = medias[type];
        var $source = document.createElement('source');
        $source.src = dataURI;
        $source.type = 'video/' + type;

        $video.appendChild($source);
      }

      $video.play();
    }
  }
}];

var defaultViewTemplate = '\n<% if (!isCompatible) { %>\n  <div class="section-top"></div>\n  <div class="section-center flex-center">\n    <p><%= errorMessage %></p>\n  </div>\n  <div class="section-bottom"></div>\n<% } else { %>\n  <div class="section-top flex-middle"></div>\n  <div class="section-center flex-center">\n      <p class="big">\n        <%= intro %>\n        <br />\n        <b><%= globals.appName %></b>\n      </p>\n  </div>\n  <div class="section-bottom flex-middle">\n    <p class="small soft-blink"><%= instructions %></p>\n  </div>\n<% } %>';

var defaultViewContent = {
  isCompatible: null,
  errorMessage: 'Sorry,<br />Your device is not compatible with the application.',
  intro: 'Welcome to',
  instructions: 'Touch the screen to join!'
};

var SERVICE_ID = 'service:platform';

/**
 * Interface for the client `'platform'` service.
 *
 * This services is responsible for giving general informations about the user's
 * device (cf. [`client.device`]{@link module:soundworks/client.client.platform})
 * as well as checking availability and providing hooks in order to initialize
 * the features required by the application (audio, microphone, etc.).
 * If one of the required definitions is not available, a view is created with
 * an error message and the [`client.compatible`]{@link module:soundworks/client.client.compatible}
 * attribute is set to `false`.
 *
 * Available built-in definitions are:
 * - 'web-audio'
 * - 'mobile-device'
 * - 'audio-input'
 * - 'full-screen' (this feature won't block the application, just applied if available)
 * - 'wake-lock'
 *
 * Be carefull when setting `showDialog` option to `false` because most of these
 * features require an interaction or a confirmation from the user in order to
 * be initialized correctly,
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

    _this._defaultViewTemplate = defaultViewTemplate;
    _this._defaultViewContent = defaultViewContent;

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
  }]);
  return Platform;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, Platform);

exports.default = Platform;
//# sourceMappingURL=data:application/json;base64,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QStCLE1BQS9CO0FBQ0QsT0FGRCxNQUVPLElBQUksQ0FBQyxFQUFFLEVBQUUsV0FBRixJQUFpQixFQUFFLFdBQUYsQ0FBYyw0QkFBZCxDQUFuQixDQUFMLEVBQXNFO0FBQzNFLHlCQUFPLFFBQVAsQ0FBZ0IsWUFBaEIsR0FBK0IsTUFBL0I7QUFDRCxPQUZNLE1BRUE7QUFDTCx5QkFBTyxRQUFQLENBQWdCLFlBQWhCLEdBQStCLE1BQS9CO0FBQ0Q7QUFDRjs7Ozs7Ozs7O3NDQU1pQjtBQUNoQixVQUFNLEtBQUssT0FBTyxTQUFQLENBQWlCLFNBQTVCO0FBQ0EsVUFBTSxLQUFLLDJCQUFpQixFQUFqQixDQUFYOztBQUVBLHVCQUFPLFFBQVAsQ0FBZ0IsUUFBaEIsR0FBNEIsR0FBRyxNQUFILE9BQWdCLElBQTVDLEM7QUFDQSx1QkFBTyxRQUFQLENBQWdCLEVBQWhCLEdBQXNCLFlBQVc7QUFDL0IsWUFBTSxLQUFLLEdBQUcsRUFBSCxFQUFYOztBQUVBLFlBQUksT0FBTyxXQUFYLEVBQ0UsT0FBTyxTQUFQLENBREYsS0FFSyxJQUFJLE9BQU8sS0FBWCxFQUNILE9BQU8sS0FBUCxDQURHLEtBR0gsT0FBTyxPQUFQO0FBQ0gsT0FUb0IsRUFBckI7QUFVRDs7Ozs7QUFHSCx5QkFBZSxRQUFmLENBQXdCLFVBQXhCLEVBQW9DLFFBQXBDOztrQkFFZSxRIiwiZmlsZSI6IlBsYXRmb3JtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXVkaW9Db250ZXh0IH0gZnJvbSAnd2F2ZXMtYXVkaW8nO1xuaW1wb3J0IGNsaWVudCBmcm9tICcuLi9jb3JlL2NsaWVudCc7XG5pbXBvcnQgTW9iaWxlRGV0ZWN0IGZyb20gJ21vYmlsZS1kZXRlY3QnO1xuaW1wb3J0IHNjcmVlbmZ1bGwgZnJvbSAnc2NyZWVuZnVsbCc7XG5pbXBvcnQgU2VnbWVudGVkVmlldyBmcm9tICcuLi92aWV3cy9TZWdtZW50ZWRWaWV3JztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbi8qKlxuICogU3RydWN0dXJlIG9mIHRoZSBkZWZpbml0aW9uIG9mIGEgZmVhdHVyZSB0byBiZSB0ZXN0ZWQuXG4gKlxuICogQHR5cGVkZWYge09iamVjdH0gbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYXRmb3JtfmRlZmluaXRpb25cbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBpZCAtIElkIG9mIHRoZSBkZWZpbml0aW9uLlxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gY2hlY2sgLSBBIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIHJldHVybiBgdHJ1ZWAgaWYgdGhlXG4gKiAgZmVhdHVyZSBpcyBhdmFpbGFibGUgb24gdGhlIHBsYXRmb3JtLCBgZmFsc2VgIG90aGVyd2lzZS5cbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IFtpbnRlcmFjdGlvbkhvb2tdIC0gQSBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCBvbiB0aGVcbiAqICBmaXJzdCBpbnRlcmFjdGlvbiAoaS5lLiBgY2xpY2tgIG9yIGB0b3VjaHN0YXJ0YCkgb2YgdGhlIHVzZXIgd2l0aCBhcHBsaWNhdGlvblxuICogIChmb3IgZXhhbXBsZSwgdG8gaW5pdGlhbGl6ZSBBdWRpb0NvbnRleHQgb24gaU9TIGRldmljZXMpLlxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gW2ludGVyYWN0aW9uSG9va10gLSBBIGZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkIG9uIHN0YXJ0XG4gKiAgKGZvciBleGFtcGxlIHRvIGFzayBhY2Nlc3MgdG8gbWljcm9waG9uZSBvciBnZW9sb2NhdGlvbikuXG4gKi9cbmNvbnN0IGRlZmF1bHREZWZpbml0aW9ucyA9IFtcbiAge1xuICAgIGlkOiAnd2ViLWF1ZGlvJyxcbiAgICBjaGVjazogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gISFhdWRpb0NvbnRleHQ7XG4gICAgfSxcbiAgICBpbnRlcmFjdGlvbkhvb2s6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCFjbGllbnQucGxhdGZvcm0uaXNNb2JpbGUpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgY29uc3QgZyA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG4gICAgICBnLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcbiAgICAgIGcuZ2Fpbi52YWx1ZSA9IDAuMDAwMDAwMDAxOyAvLyAtMTgwZEIgP1xuXG4gICAgICBjb25zdCBvID0gYXVkaW9Db250ZXh0LmNyZWF0ZU9zY2lsbGF0b3IoKTtcbiAgICAgIG8uY29ubmVjdChnKTtcbiAgICAgIG8uZnJlcXVlbmN5LnZhbHVlID0gMjA7XG4gICAgICBvLnN0YXJ0KDApO1xuXG4gICAgICAvLyBwcmV2ZW50IGFuZHJvaWQgdG8gc3RvcCBhdWRpbyBieSBrZXBpbmcgdGhlIG9zY2lsbGF0b3IgYWN0aXZlXG4gICAgICBpZiAoY2xpZW50LnBsYXRmb3JtLm9zICE9PSAnYW5kcm9pZCcpXG4gICAgICAgIG8uc3RvcChhdWRpb0NvbnRleHQuY3VycmVudFRpbWUgKyAwLjAxKTtcbiAgICB9XG4gIH0sXG4gIHtcbiAgICAvLyBAbm90ZTogYHRvdWNoYCBmZWF0dXJlIHdvcmthcm91bmRcbiAgICAvLyBjZi4gaHR0cDovL3d3dy5zdHVjb3guY29tL2Jsb2cveW91LWNhbnQtZGV0ZWN0LWEtdG91Y2hzY3JlZW4vXG4gICAgaWQ6ICdtb2JpbGUtZGV2aWNlJyxcbiAgICBjaGVjazogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY2xpZW50LnBsYXRmb3JtLmlzTW9iaWxlO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGlkOiAnYXVkaW8taW5wdXQnLFxuICAgIGNoZWNrOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAhIW5hdmlnYXRvci5nZXRVc2VyTWVkaWE7XG4gICAgfSxcbiAgICBzdGFydEhvb2s6IGZ1bmN0aW9uKCkge1xuICAgICAgbmF2aWdhdG9yLmdldFVzZXJNZWRpYSh7IGF1ZGlvOiB0cnVlIH0sIGZ1bmN0aW9uKHN0cmVhbSkge1xuICAgICAgICBzdHJlYW0uZ2V0QXVkaW9UcmFja3MoKVswXS5zdG9wKCk7XG4gICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGlkOiAnZnVsbC1zY3JlZW4nLFxuICAgIGNoZWNrOiBmdW5jdGlvbigpIHtcbiAgICAgIC8vIGZ1bmN0aW9ubmFsaXR5IHRoYXQgY2Fubm90IGJyYWtlIHRoZSBhcHBsaWNhdGlvblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBpbnRlcmFjdGlvbkhvb2soKSB7XG4gICAgICBpZiAoc2NyZWVuZnVsbC5lbmFibGVkKVxuICAgICAgICBzY3JlZW5mdWxsLnJlcXVlc3QoKTtcbiAgICB9XG4gIH0sXG4gIHtcbiAgICAvLyBhZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL3JpY2h0ci9Ob1NsZWVwLmpzL2Jsb2IvbWFzdGVyL05vU2xlZXAuanNcbiAgICBpZDogJ3dha2UtbG9jaycsXG4gICAgY2hlY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gZnVuY3Rpb25uYWxpdHkgdGhhdCBjYW5ub3QgYnJha2UgdGhlIGFwcGxpY2F0aW9uXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIGludGVyYWN0aW9uSG9vazogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoY2xpZW50LnBsYXRmb3JtLm9zID09PSAnaW9zJykge1xuICAgICAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gd2luZG93LmxvY2F0aW9uO1xuICAgICAgICAgIHNldFRpbWVvdXQod2luZG93LnN0b3AsIDApO1xuICAgICAgICB9LCAzMDAwMClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBtZWRpYXMgPSB7XG4gICAgICAgICAgd2VibTogXCJkYXRhOnZpZGVvL3dlYm07YmFzZTY0LEdrWGZvMEFnUW9hQkFVTDNnUUZDOG9FRVF2T0JDRUtDUUFSM1pXSnRRb2VCQWtLRmdRSVlVNEJuUUkwVlNhbG1RQ2dxMTdGQUF3OUNRRTJBUUFaM2FHRnRiWGxYUVVBR2QyaGhiVzE1UklsQUNFQ1BRQUFBQUFBQUZsU3VhMEF4cmtBdTE0RUJZOFdCQVp5QkFDSzFuRUFEZFc1a2hrQUZWbDlXVURnbGhvaEFBMVpRT0lPQkFlQkFCckNCQ0xxQkNCOUR0blZBSXVlQkFLTkFISUVBQUlBd0FRQ2RBU29JQUFnQUFVQW1KYVFBQTNBQS92ejBBQUE9XCIsXG4gICAgICAgICAgbXA0OiBcImRhdGE6dmlkZW8vbXA0O2Jhc2U2NCxBQUFBSEdaMGVYQnBjMjl0QUFBQ0FHbHpiMjFwYzI4eWJYQTBNUUFBQUFobWNtVmxBQUFBRzIxa1lYUUFBQUd6QUJBSEFBQUJ0aEFEQW93ZGJiOS9BQUFDNlcxdmIzWUFBQUJzYlhab1pBQUFBQUI4SmJDQWZDV3dnQUFBQStnQUFBQUFBQUVBQUFFQUFBQUFBQUFBQUFBQUFBQUJBQUFBQUFBQUFBQUFBQUFBQUFBQUFRQUFBQUFBQUFBQUFBQUFBQUFBUUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBSUFBQUlWZEhKaGF3QUFBRngwYTJoa0FBQUFEM3dsc0lCOEpiQ0FBQUFBQVFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFCQUFBQUFBQUFBQUFBQUFBQUFBQUFBUUFBQUFBQUFBQUFBQUFBQUFBQVFBQUFBQUFJQUFBQUNBQUFBQUFCc1cxa2FXRUFBQUFnYldSb1pBQUFBQUI4SmJDQWZDV3dnQUFBQStnQUFBQUFWY1FBQUFBQUFDMW9aR3h5QUFBQUFBQUFBQUIyYVdSbEFBQUFBQUFBQUFBQUFBQUFWbWxrWlc5SVlXNWtiR1Z5QUFBQUFWeHRhVzVtQUFBQUZIWnRhR1FBQUFBQkFBQUFBQUFBQUFBQUFBQWtaR2x1WmdBQUFCeGtjbVZtQUFBQUFBQUFBQUVBQUFBTWRYSnNJQUFBQUFFQUFBRWNjM1JpYkFBQUFMaHpkSE5rQUFBQUFBQUFBQUVBQUFDb2JYQTBkZ0FBQUFBQUFBQUJBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUlBQWdBU0FBQUFFZ0FBQUFBQUFBQUFRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUJqLy93QUFBRkpsYzJSekFBQUFBQU5FQUFFQUJEd2dFUUFBQUFBRERVQUFBQUFBQlMwQUFBR3dBUUFBQWJXSkV3QUFBUUFBQUFFZ0FNU05pQjlGQUVRQkZHTUFBQUd5VEdGMll6VXlMamczTGpRR0FRSUFBQUFZYzNSMGN3QUFBQUFBQUFBQkFBQUFBUUFBQUFBQUFBQWNjM1J6WXdBQUFBQUFBQUFCQUFBQUFRQUFBQUVBQUFBQkFBQUFGSE4wYzNvQUFBQUFBQUFBRXdBQUFBRUFBQUFVYzNSamJ3QUFBQUFBQUFBQkFBQUFMQUFBQUdCMVpIUmhBQUFBV0cxbGRHRUFBQUFBQUFBQUlXaGtiSElBQUFBQUFBQUFBRzFrYVhKaGNIQnNBQUFBQUFBQUFBQUFBQUFBSzJsc2MzUUFBQUFqcVhSdmJ3QUFBQnRrWVhSaEFBQUFBUUFBQUFCTVlYWm1OVEl1TnpndU13PT1cIlxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0ICR2aWRlbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJyk7XG4gICAgICAgICR2aWRlby5zZXRBdHRyaWJ1dGUoJ2xvb3AnLCAnJyk7XG5cbiAgICAgICAgZm9yIChsZXQgdHlwZSBpbiBtZWRpYXMpIHtcbiAgICAgICAgICBjb25zdCBkYXRhVVJJID0gbWVkaWFzW3R5cGVdO1xuICAgICAgICAgIGNvbnN0ICRzb3VyY2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzb3VyY2UnKTtcbiAgICAgICAgICAkc291cmNlLnNyYyA9IGRhdGFVUkk7XG4gICAgICAgICAgJHNvdXJjZS50eXBlID0gYHZpZGVvLyR7dHlwZX1gO1xuXG4gICAgICAgICAgJHZpZGVvLmFwcGVuZENoaWxkKCRzb3VyY2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgJHZpZGVvLnBsYXkoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbl07XG5cblxuY29uc3QgZGVmYXVsdFZpZXdUZW1wbGF0ZSA9IGBcbjwlIGlmICghaXNDb21wYXRpYmxlKSB7ICU+XG4gIDxkaXYgY2xhc3M9XCJzZWN0aW9uLXRvcFwiPjwvZGl2PlxuICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1jZW50ZXIgZmxleC1jZW50ZXJcIj5cbiAgICA8cD48JT0gZXJyb3JNZXNzYWdlICU+PC9wPlxuICA8L2Rpdj5cbiAgPGRpdiBjbGFzcz1cInNlY3Rpb24tYm90dG9tXCI+PC9kaXY+XG48JSB9IGVsc2UgeyAlPlxuICA8ZGl2IGNsYXNzPVwic2VjdGlvbi10b3AgZmxleC1taWRkbGVcIj48L2Rpdj5cbiAgPGRpdiBjbGFzcz1cInNlY3Rpb24tY2VudGVyIGZsZXgtY2VudGVyXCI+XG4gICAgICA8cCBjbGFzcz1cImJpZ1wiPlxuICAgICAgICA8JT0gaW50cm8gJT5cbiAgICAgICAgPGJyIC8+XG4gICAgICAgIDxiPjwlPSBnbG9iYWxzLmFwcE5hbWUgJT48L2I+XG4gICAgICA8L3A+XG4gIDwvZGl2PlxuICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1ib3R0b20gZmxleC1taWRkbGVcIj5cbiAgICA8cCBjbGFzcz1cInNtYWxsIHNvZnQtYmxpbmtcIj48JT0gaW5zdHJ1Y3Rpb25zICU+PC9wPlxuICA8L2Rpdj5cbjwlIH0gJT5gO1xuXG5jb25zdCBkZWZhdWx0Vmlld0NvbnRlbnQgPSB7XG4gIGlzQ29tcGF0aWJsZTogbnVsbCxcbiAgZXJyb3JNZXNzYWdlOiAnU29ycnksPGJyIC8+WW91ciBkZXZpY2UgaXMgbm90IGNvbXBhdGlibGUgd2l0aCB0aGUgYXBwbGljYXRpb24uJyxcbiAgaW50cm86ICdXZWxjb21lIHRvJyxcbiAgaW5zdHJ1Y3Rpb25zOiAnVG91Y2ggdGhlIHNjcmVlbiB0byBqb2luIScsXG59O1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6cGxhdGZvcm0nO1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIGNsaWVudCBgJ3BsYXRmb3JtJ2Agc2VydmljZS5cbiAqXG4gKiBUaGlzIHNlcnZpY2VzIGlzIHJlc3BvbnNpYmxlIGZvciBnaXZpbmcgZ2VuZXJhbCBpbmZvcm1hdGlvbnMgYWJvdXQgdGhlIHVzZXInc1xuICogZGV2aWNlIChjZi4gW2BjbGllbnQuZGV2aWNlYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LmNsaWVudC5wbGF0Zm9ybX0pXG4gKiBhcyB3ZWxsIGFzIGNoZWNraW5nIGF2YWlsYWJpbGl0eSBhbmQgcHJvdmlkaW5nIGhvb2tzIGluIG9yZGVyIHRvIGluaXRpYWxpemVcbiAqIHRoZSBmZWF0dXJlcyByZXF1aXJlZCBieSB0aGUgYXBwbGljYXRpb24gKGF1ZGlvLCBtaWNyb3Bob25lLCBldGMuKS5cbiAqIElmIG9uZSBvZiB0aGUgcmVxdWlyZWQgZGVmaW5pdGlvbnMgaXMgbm90IGF2YWlsYWJsZSwgYSB2aWV3IGlzIGNyZWF0ZWQgd2l0aFxuICogYW4gZXJyb3IgbWVzc2FnZSBhbmQgdGhlIFtgY2xpZW50LmNvbXBhdGlibGVgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuY2xpZW50LmNvbXBhdGlibGV9XG4gKiBhdHRyaWJ1dGUgaXMgc2V0IHRvIGBmYWxzZWAuXG4gKlxuICogQXZhaWxhYmxlIGJ1aWx0LWluIGRlZmluaXRpb25zIGFyZTpcbiAqIC0gJ3dlYi1hdWRpbydcbiAqIC0gJ21vYmlsZS1kZXZpY2UnXG4gKiAtICdhdWRpby1pbnB1dCdcbiAqIC0gJ2Z1bGwtc2NyZWVuJyAodGhpcyBmZWF0dXJlIHdvbid0IGJsb2NrIHRoZSBhcHBsaWNhdGlvbiwganVzdCBhcHBsaWVkIGlmIGF2YWlsYWJsZSlcbiAqIC0gJ3dha2UtbG9jaydcbiAqXG4gKiBCZSBjYXJlZnVsbCB3aGVuIHNldHRpbmcgYHNob3dEaWFsb2dgIG9wdGlvbiB0byBgZmFsc2VgIGJlY2F1c2UgbW9zdCBvZiB0aGVzZVxuICogZmVhdHVyZXMgcmVxdWlyZSBhbiBpbnRlcmFjdGlvbiBvciBhIGNvbmZpcm1hdGlvbiBmcm9tIHRoZSB1c2VyIGluIG9yZGVyIHRvXG4gKiBiZSBpbml0aWFsaXplZCBjb3JyZWN0bHksXG4gKlxuICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LmNsaWVudH1cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtBcnJheTxTdHJpbmc+fFN0cmluZ30gb3B0aW9ucy5mZWF0dXJlcyAtIElkKHMpIG9mIHRoZSBmZWF0dXJlKHMpXG4gKiAgcmVxdWlyZWQgYnkgdGhlIGFwcGxpY2F0aW9uLlxuICogQHBhcmFtIHt9XG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQGV4YW1wbGVcbiAqIC8vIGluc2lkZSB0aGUgZXhwZXJpZW5jZSBjb25zdHJ1Y3RvclxuICogdGhpcy5wbGF0Zm9ybSA9IHRoaXMucmVxdWlyZSgncGxhdGZvcm0nLCB7IGZlYXR1cmVzOiAnd2ViLWF1ZGlvJyB9KTtcbiAqL1xuY2xhc3MgUGxhdGZvcm0gZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFuY2lhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCBmYWxzZSk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIC8vIHdha2VMb2NrOiBmYWxzZSwgLy8gQHRvZG8gLSBmaXggYW5kIHRyYW5zZm9ybSBpbnRvIGEgZmVhdHVyZVxuICAgICAgc2hvd0RpYWxvZzogdHJ1ZSxcbiAgICAgIHZpZXdDdG9yOiBTZWdtZW50ZWRWaWV3LFxuICAgICAgdmlld1ByaW9yaXR5OiAxMCxcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgdGhpcy5fZGVmYXVsdFZpZXdUZW1wbGF0ZSA9IGRlZmF1bHRWaWV3VGVtcGxhdGU7XG4gICAgdGhpcy5fZGVmYXVsdFZpZXdDb250ZW50ID0gZGVmYXVsdFZpZXdDb250ZW50O1xuXG4gICAgdGhpcy5fcmVxdWlyZWRGZWF0dXJlcyA9IG5ldyBTZXQoKTtcbiAgICB0aGlzLl9mZWF0dXJlRGVmaW5pdGlvbnMgPSB7fTtcblxuICAgIGRlZmF1bHREZWZpbml0aW9ucy5mb3JFYWNoKChkZWYpID0+IHRoaXMuYWRkRmVhdHVyZURlZmluaXRpb24oZGVmKSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgY29uZmlndXJlKG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy5mZWF0dXJlcykge1xuICAgICAgbGV0IGZlYXR1cmVzID0gb3B0aW9ucy5mZWF0dXJlcztcblxuICAgICAgaWYgKHR5cGVvZiBmZWF0dXJlcyA9PT0gJ3N0cmluZycpXG4gICAgICAgIGZlYXR1cmVzID0gW2ZlYXR1cmVzXTtcblxuICAgICAgdGhpcy5yZXF1aXJlRmVhdHVyZSguLi5mZWF0dXJlcyk7XG4gICAgICBkZWxldGUgb3B0aW9ucy5mZWF0dXJlcztcbiAgICB9XG5cbiAgICBzdXBlci5jb25maWd1cmUob3B0aW9ucyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgaW5pdCgpIHtcbiAgICB0aGlzLl9kZWZpbmVBdWRpb0ZpbGVFeHRlbnRpb24oKTtcbiAgICB0aGlzLl9kZWZpbmVQbGF0Zm9ybSgpO1xuICAgIC8vIHJlc29sdmUgcmVxdWlyZWQgZmVhdHVyZXMgZnJvbSB0aGUgYXBwbGljYXRpb25cbiAgICBjbGllbnQuY29tcGF0aWJsZSA9IHRoaXMucmVzb2x2ZVJlcXVpcmVkRmVhdHVyZXMoKTtcbiAgICB0aGlzLnZpZXdDb250ZW50LmlzQ29tcGF0aWJsZSA9IGNsaWVudC5jb21wYXRpYmxlO1xuXG4gICAgdGhpcy52aWV3Q3RvciA9IHRoaXMub3B0aW9ucy52aWV3Q3RvcjtcbiAgICB0aGlzLnZpZXcgPSB0aGlzLmNyZWF0ZVZpZXcoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgaWYgKCF0aGlzLmhhc1N0YXJ0ZWQpXG4gICAgICB0aGlzLmluaXQoKTtcblxuICAgIC8vIGV4ZWN1dGUgc3RhcnQgaG9va3MgZnJvbSB0aGUgZmVhdHVyZXMgZGVmaW5pdGlvbnNcbiAgICBpZihjbGllbnQuY29tcGF0aWJsZSkge1xuICAgICAgY29uc3Qgc3RhcnRIb29rcyA9IHRoaXMuZ2V0U3RhcnRIb29rcygpO1xuICAgICAgc3RhcnRIb29rcy5mb3JFYWNoKChob29rKSA9PiBob29rKCkpO1xuICAgIH1cblxuICAgIC8vIG9wdGlvbm5hbHkgc2tpcCB0aGUgdmlldyBpZiBjbGllbnQgaXMgY29tcGF0aWJsZVxuICAgIGlmIChjbGllbnQuY29tcGF0aWJsZSAmJiAhdGhpcy5vcHRpb25zLnNob3dEaWFsb2cpIHtcbiAgICAgIC8vIGJ5cGFzcyBpZiBmZWF0dXJlcyBjb250YWlucyAnd2ViLWF1ZGlvJyBhbmQgY2xpZW50LnBsYXRmb3JtLm9zID09PSAnaW9zJ1xuICAgICAgaWYgKHRoaXMuX3JlcXVpcmVkRmVhdHVyZXMuaGFzKCd3ZWItYXVkaW8nKSAmJiBjbGllbnQucGxhdGZvcm0ub3MgPT09ICdpb3MnKVxuICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgIGVsc2VcbiAgICAgICAgdGhpcy5yZWFkeSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNob3coKTtcbiAgICB9XG5cbiAgICAvLyBpbnN0YWxsIGV2ZW50cyBmb3IgaW50ZXJhY3Rpb24gaG9va1xuICAgIGlmIChjbGllbnQuY29tcGF0aWJsZSkge1xuICAgICAgY29uc3QgZXZlbnQgPSBjbGllbnQucGxhdGZvcm0uaXNNb2JpbGUgPyAndG91Y2hlbmQnIDogJ2NsaWNrJztcbiAgICAgIHRoaXMudmlldy5pbnN0YWxsRXZlbnRzKHsgW2V2ZW50XTogdGhpcy5fb25JbnRlcmFjdGlvbi5iaW5kKHRoaXMpIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdG9wKCkge1xuICAgIHRoaXMuaGlkZSgpO1xuICAgIHN1cGVyLnN0b3AoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBuZXcgZmVhdHVyZSBkZWZpbml0aW9uIG9yIG92ZXJyaWRlIGFuIGV4aXN0aW5nIG9uZS5cbiAgICogQHBhcmFtIHttb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhdGZvcm1+ZGVmaW5pdGlvbn0gb2JqIC0gRGVmaW5pdGlvbiBvZlxuICAgKiAgdGhlIGZlYXR1cmUgdG8gYWRkIHRvIHRoZSBleGlzdGluZyBvbmVzLlxuICAgKi9cbiAgYWRkRmVhdHVyZURlZmluaXRpb24ob2JqKSB7XG4gICAgdGhpcy5fZmVhdHVyZURlZmluaXRpb25zW29iai5pZF0gPSBvYmo7XG4gIH1cblxuICAvKipcbiAgICogUmVxdWlyZSBmZWF0dXJlcyBhdmFsYWJpbGl0eSBmb3IgdGhlIGFwcGxpY2F0aW9uLlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0gey4uLlN0cmluZ30gZmVhdHVyZXMgLSBUaGUgaWQocykgb2YgdGhlIGZlYXR1cmUocykgdG8gYmUgcmVxdWlyZWQuXG4gICAqL1xuICByZXF1aXJlRmVhdHVyZSguLi5mZWF0dXJlcykge1xuICAgIGZlYXR1cmVzLmZvckVhY2goKGlkKSA9PiB0aGlzLl9yZXF1aXJlZEZlYXR1cmVzLmFkZChpZCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGUgYWxsIGBjaGVja2AgZnVuY3Rpb25zIGZyb20gdGhlIGRlZmluaXRpb24gb2YgdGhlIHJlcXVpcmVkIGZlYXR1cmVzLlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcmV0dXJuIHtCb29sZWFufSAtIHRydWUgaWYgYWxsIGNoZWNrcyBwYXNzLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqXG4gICAqL1xuICByZXNvbHZlUmVxdWlyZWRGZWF0dXJlcygpIHtcbiAgICBsZXQgcmVzdWx0ID0gdHJ1ZTtcblxuICAgIHRoaXMuX3JlcXVpcmVkRmVhdHVyZXMuZm9yRWFjaCgoZmVhdHVyZSkgPT4ge1xuICAgICAgY29uc3QgY2hlY2tGdW5jdGlvbiA9IHRoaXMuX2ZlYXR1cmVEZWZpbml0aW9uc1tmZWF0dXJlXS5jaGVjaztcblxuICAgICAgaWYgKCEodHlwZW9mIGNoZWNrRnVuY3Rpb24gPT09ICdmdW5jdGlvbicpKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIGNoZWNrIGZ1bmN0aW9uIGRlZmluZWQgZm9yICR7ZmVhdHVyZX0gZmVhdHVyZWApO1xuXG4gICAgICByZXN1bHQgPSByZXN1bHQgJiYgY2hlY2tGdW5jdGlvbigpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBsaXN0IG9mIHRoZSBmdW5jdGlvbnMgdG8gYmUgZXhlY3V0ZWQgb24gYHN0YXJ0YCBsaWZlY3ljbGUuXG4gICAqIEBwcml2YXRlXG4gICAqIEByZXR1cm4ge0FycmF5fVxuICAgKi9cbiAgZ2V0U3RhcnRIb29rcygpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0SG9va3MoJ3N0YXJ0SG9vaycpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGxpc3Qgb2YgdGhlIGZ1bmN0aW9ucyB0byBiZSBleGVjdXRlZCB3aGVuIHRoZSB1c2VyXG4gICAqIGludGVyYWN0cyB3aXRoIHRoZSBhcHBsaWNhdGlvbiBmb3IgdGhlIGZpcnN0IHRpbWUuXG4gICAqIEBwcml2YXRlXG4gICAqIEByZXR1cm4ge0FycmF5fVxuICAgKi9cbiAgZ2V0SW50ZXJhY3Rpb25Ib29rcygpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0SG9va3MoJ2ludGVyYWN0aW9uSG9vaycpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9nZXRIb29rcyh0eXBlKSB7XG4gICAgY29uc3QgaG9va3MgPSBbXTtcblxuICAgIHRoaXMuX3JlcXVpcmVkRmVhdHVyZXMuZm9yRWFjaCgoZmVhdHVyZSkgPT4ge1xuICAgICAgY29uc3QgaG9vayA9IHRoaXMuX2ZlYXR1cmVEZWZpbml0aW9uc1tmZWF0dXJlXVt0eXBlXTtcblxuICAgICAgaWYgKGhvb2spXG4gICAgICAgIGhvb2tzLnB1c2goaG9vayk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gaG9va3M7XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZSBgaW50ZXJhY3Rpb25zYCBob29rcyBmcm9tIHRoZSBgcGxhdGZvcm1gIHNlcnZpY2UuXG4gICAqIEFsc28gYWN0aXZhdGUgdGhlIG1lZGlhIGFjY29yZGluZyB0byB0aGUgYG9wdGlvbnNgLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX29uSW50ZXJhY3Rpb24oKSB7XG4gICAgLy8gZXhlY3V0ZSBpbnRlcmFjdGlvbiBob29rcyBmcm9tIHRoZSBwbGF0Zm9ybVxuICAgIGNvbnN0IGludGVyYWN0aW9uSG9va3MgPSB0aGlzLmdldEludGVyYWN0aW9uSG9va3MoKTtcbiAgICBpbnRlcmFjdGlvbkhvb2tzLmZvckVhY2goKGhvb2spID0+IGhvb2soKSk7XG5cbiAgICB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICAvKipcbiAgICogUG9wdWxhdGUgYGNsaWVudC5wbGF0Zm9ybWAgd2l0aCB0aGUgcHJlZmVyZWQgYXVkaW8gZmlsZSBleHRlbnRpb24gZm9yIHRoZSBwbGF0Zm9ybS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9kZWZpbmVBdWRpb0ZpbGVFeHRlbnRpb24oKSB7XG4gICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2F1ZGlvJyk7XG4gICAgLy8gaHR0cDovL2RpdmVpbnRvaHRtbDUuaW5mby9ldmVyeXRoaW5nLmh0bWxcbiAgICBpZiAoISEoYS5jYW5QbGF5VHlwZSAmJiBhLmNhblBsYXlUeXBlKCdhdWRpby9tcGVnOycpKSkge1xuICAgICAgY2xpZW50LnBsYXRmb3JtLmF1ZGlvRmlsZUV4dCA9ICcubXAzJztcbiAgICB9IGVsc2UgaWYgKCEhKGEuY2FuUGxheVR5cGUgJiYgYS5jYW5QbGF5VHlwZSgnYXVkaW8vb2dnOyBjb2RlY3M9XCJ2b3JiaXNcIicpKSkge1xuICAgICAgY2xpZW50LnBsYXRmb3JtLmF1ZGlvRmlsZUV4dCA9ICcub2dnJztcbiAgICB9IGVsc2Uge1xuICAgICAgY2xpZW50LnBsYXRmb3JtLmF1ZGlvRmlsZUV4dCA9ICcud2F2JztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUG9wdWxhdGUgYGNsaWVudC5wbGF0Zm9ybWAgd2l0aCB0aGUgb3MgbmFtZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9kZWZpbmVQbGF0Zm9ybSgpIHtcbiAgICBjb25zdCB1YSA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50XG4gICAgY29uc3QgbWQgPSBuZXcgTW9iaWxlRGV0ZWN0KHVhKTtcblxuICAgIGNsaWVudC5wbGF0Zm9ybS5pc01vYmlsZSA9IChtZC5tb2JpbGUoKSAhPT0gbnVsbCk7IC8vIHRydWUgaWYgcGhvbmUgb3IgdGFibGV0XG4gICAgY2xpZW50LnBsYXRmb3JtLm9zID0gKGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3Qgb3MgPSBtZC5vcygpO1xuXG4gICAgICBpZiAob3MgPT09ICdBbmRyb2lkT1MnKVxuICAgICAgICByZXR1cm4gJ2FuZHJvaWQnO1xuICAgICAgZWxzZSBpZiAob3MgPT09ICdpT1MnKVxuICAgICAgICByZXR1cm4gJ2lvcyc7XG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiAnb3RoZXInO1xuICAgIH0pKCk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgUGxhdGZvcm0pO1xuXG5leHBvcnQgZGVmYXVsdCBQbGF0Zm9ybTtcbiJdfQ==