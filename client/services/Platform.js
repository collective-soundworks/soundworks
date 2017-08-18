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

    var _this = (0, _possibleConstructorReturn3.default)(this, (Platform.__proto__ || (0, _getPrototypeOf2.default)(Platform)).call(this, SERVICE_ID, false));

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

      (0, _get3.default)(Platform.prototype.__proto__ || (0, _getPrototypeOf2.default)(Platform.prototype), 'configure', this).call(this, options);
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
      (0, _get3.default)(Platform.prototype.__proto__ || (0, _getPrototypeOf2.default)(Platform.prototype), 'start', this).call(this);

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
      (0, _get3.default)(Platform.prototype.__proto__ || (0, _getPrototypeOf2.default)(Platform.prototype), 'stop', this).call(this);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYXRmb3JtLmpzIl0sIm5hbWVzIjpbImRlZmF1bHREZWZpbml0aW9ucyIsImlkIiwiY2hlY2siLCJpbnRlcmFjdGlvbkhvb2siLCJwbGF0Zm9ybSIsImlzTW9iaWxlIiwiZyIsImNyZWF0ZUdhaW4iLCJjb25uZWN0IiwiZGVzdGluYXRpb24iLCJnYWluIiwidmFsdWUiLCJvIiwiY3JlYXRlT3NjaWxsYXRvciIsImZyZXF1ZW5jeSIsInN0YXJ0Iiwib3MiLCJzdG9wIiwiY3VycmVudFRpbWUiLCJuYXZpZ2F0b3IiLCJnZXRVc2VyTWVkaWEiLCJzdGFydEhvb2siLCJhdWRpbyIsInN0cmVhbSIsImdldEF1ZGlvVHJhY2tzIiwiZXJyIiwiZW5hYmxlZCIsInJlcXVlc3QiLCJzZXRJbnRlcnZhbCIsIndpbmRvdyIsImxvY2F0aW9uIiwic2V0VGltZW91dCIsIm1lZGlhcyIsIndlYm0iLCJtcDQiLCIkdmlkZW8iLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJzZXRBdHRyaWJ1dGUiLCJ0eXBlIiwiZGF0YVVSSSIsIiRzb3VyY2UiLCJzcmMiLCJhcHBlbmRDaGlsZCIsInBsYXkiLCJkZWZhdWx0Vmlld1RlbXBsYXRlIiwiZGVmYXVsdFZpZXdDb250ZW50IiwiaXNDb21wYXRpYmxlIiwiZXJyb3JNZXNzYWdlIiwiaW50cm8iLCJpbnN0cnVjdGlvbnMiLCJTRVJWSUNFX0lEIiwiUGxhdGZvcm0iLCJkZWZhdWx0cyIsInNob3dEaWFsb2ciLCJ2aWV3Q3RvciIsInZpZXdQcmlvcml0eSIsImNvbmZpZ3VyZSIsIl9kZWZhdWx0Vmlld1RlbXBsYXRlIiwiX2RlZmF1bHRWaWV3Q29udGVudCIsIl9yZXF1aXJlZEZlYXR1cmVzIiwiX2ZlYXR1cmVEZWZpbml0aW9ucyIsImZvckVhY2giLCJkZWYiLCJhZGRGZWF0dXJlRGVmaW5pdGlvbiIsIm9wdGlvbnMiLCJmZWF0dXJlcyIsInJlcXVpcmVGZWF0dXJlIiwiX2RlZmluZUF1ZGlvRmlsZUV4dGVudGlvbiIsIl9kZWZpbmVQbGF0Zm9ybSIsImNvbXBhdGlibGUiLCJyZXNvbHZlUmVxdWlyZWRGZWF0dXJlcyIsInZpZXdDb250ZW50IiwidmlldyIsImNyZWF0ZVZpZXciLCJoYXNTdGFydGVkIiwiaW5pdCIsInN0YXJ0SG9va3MiLCJnZXRTdGFydEhvb2tzIiwiaG9vayIsImhhcyIsInNob3ciLCJyZWFkeSIsImV2ZW50IiwiaW5zdGFsbEV2ZW50cyIsIl9vbkludGVyYWN0aW9uIiwiYmluZCIsImhpZGUiLCJvYmoiLCJhZGQiLCJyZXN1bHQiLCJmZWF0dXJlIiwiY2hlY2tGdW5jdGlvbiIsIkVycm9yIiwiX2dldEhvb2tzIiwiaG9va3MiLCJwdXNoIiwiaW50ZXJhY3Rpb25Ib29rcyIsImdldEludGVyYWN0aW9uSG9va3MiLCJhIiwiY2FuUGxheVR5cGUiLCJhdWRpb0ZpbGVFeHQiLCJ1YSIsInVzZXJBZ2VudCIsIm1kIiwibW9iaWxlIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7Ozs7QUFhQSxJQUFNQSxxQkFBcUIsQ0FDekI7QUFDRUMsTUFBSSxXQUROO0FBRUVDLFNBQU8saUJBQVc7QUFDaEIsV0FBTyxDQUFDLHlCQUFSO0FBQ0QsR0FKSDtBQUtFQyxtQkFBaUIsMkJBQVc7QUFDMUIsUUFBSSxDQUFDLGlCQUFPQyxRQUFQLENBQWdCQyxRQUFyQixFQUNFOztBQUVGLFFBQU1DLElBQUkseUJBQWFDLFVBQWIsRUFBVjtBQUNBRCxNQUFFRSxPQUFGLENBQVUseUJBQWFDLFdBQXZCO0FBQ0FILE1BQUVJLElBQUYsQ0FBT0MsS0FBUCxHQUFlLFdBQWYsQ0FOMEIsQ0FNRTs7QUFFNUIsUUFBTUMsSUFBSSx5QkFBYUMsZ0JBQWIsRUFBVjtBQUNBRCxNQUFFSixPQUFGLENBQVVGLENBQVY7QUFDQU0sTUFBRUUsU0FBRixDQUFZ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WUFBaEIsR0FBK0IsTUFBL0I7QUFDRCxPQUZNLE1BRUE7QUFDTCx5QkFBT2pHLFFBQVAsQ0FBZ0JpRyxZQUFoQixHQUErQixNQUEvQjtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7Ozs7c0NBSWtCO0FBQ2hCLFVBQU1DLEtBQUt6RSxPQUFPVixTQUFQLENBQWlCb0YsU0FBNUI7QUFDQSxVQUFNQyxLQUFLLDJCQUFpQkYsRUFBakIsQ0FBWDs7QUFFQSx1QkFBT2xHLFFBQVAsQ0FBZ0JDLFFBQWhCLEdBQTRCbUcsR0FBR0MsTUFBSCxPQUFnQixJQUE1QyxDQUpnQixDQUltQztBQUNuRCx1QkFBT3JHLFFBQVAsQ0FBZ0JZLEVBQWhCLEdBQXNCLFlBQVc7QUFDL0IsWUFBTUEsS0FBS3dGLEdBQUd4RixFQUFILEVBQVg7O0FBRUEsWUFBSUEsT0FBTyxXQUFYLEVBQ0UsT0FBTyxTQUFQLENBREYsS0FFSyxJQUFJQSxPQUFPLEtBQVgsRUFDSCxPQUFPLEtBQVAsQ0FERyxLQUdILE9BQU8sT0FBUDtBQUNILE9BVG9CLEVBQXJCO0FBVUQ7Ozs7O0FBR0gseUJBQWUwRixRQUFmLENBQXdCdkQsVUFBeEIsRUFBb0NDLFFBQXBDOztrQkFFZUEsUSIsImZpbGUiOiJQbGF0Zm9ybS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGF1ZGlvQ29udGV4dCB9IGZyb20gJ3dhdmVzLWF1ZGlvJztcbmltcG9ydCBjbGllbnQgZnJvbSAnLi4vY29yZS9jbGllbnQnO1xuaW1wb3J0IE1vYmlsZURldGVjdCBmcm9tICdtb2JpbGUtZGV0ZWN0JztcbmltcG9ydCBzY3JlZW5mdWxsIGZyb20gJ3NjcmVlbmZ1bGwnO1xuaW1wb3J0IFNlZ21lbnRlZFZpZXcgZnJvbSAnLi4vdmlld3MvU2VnbWVudGVkVmlldyc7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuXG4vKipcbiAqIFN0cnVjdHVyZSBvZiB0aGUgZGVmaW5pdGlvbiBvZiBhIGZlYXR1cmUgdG8gYmUgdGVzdGVkLlxuICpcbiAqIEB0eXBlZGVmIHtPYmplY3R9IG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGF0Zm9ybX5kZWZpbml0aW9uXG4gKiBAcHJvcGVydHkge1N0cmluZ30gaWQgLSBJZCBvZiB0aGUgZGVmaW5pdGlvbi5cbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGNoZWNrIC0gQSBmdW5jdGlvbiB0aGF0IHNob3VsZCByZXR1cm4gYHRydWVgIGlmIHRoZVxuICogIGZlYXR1cmUgaXMgYXZhaWxhYmxlIG9uIHRoZSBwbGF0Zm9ybSwgYGZhbHNlYCBvdGhlcndpc2UuXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBbaW50ZXJhY3Rpb25Ib29rXSAtIEEgZnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQgb24gdGhlXG4gKiAgZmlyc3QgaW50ZXJhY3Rpb24gKGkuZS4gYGNsaWNrYCBvciBgdG91Y2hzdGFydGApIG9mIHRoZSB1c2VyIHdpdGggYXBwbGljYXRpb25cbiAqICAoZm9yIGV4YW1wbGUsIHRvIGluaXRpYWxpemUgQXVkaW9Db250ZXh0IG9uIGlPUyBkZXZpY2VzKS5cbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IFtpbnRlcmFjdGlvbkhvb2tdIC0gQSBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCBvbiBzdGFydFxuICogIChmb3IgZXhhbXBsZSB0byBhc2sgYWNjZXNzIHRvIG1pY3JvcGhvbmUgb3IgZ2VvbG9jYXRpb24pLlxuICovXG5jb25zdCBkZWZhdWx0RGVmaW5pdGlvbnMgPSBbXG4gIHtcbiAgICBpZDogJ3dlYi1hdWRpbycsXG4gICAgY2hlY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICEhYXVkaW9Db250ZXh0O1xuICAgIH0sXG4gICAgaW50ZXJhY3Rpb25Ib29rOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICghY2xpZW50LnBsYXRmb3JtLmlzTW9iaWxlKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIGNvbnN0IGcgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuICAgICAgZy5jb25uZWN0KGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7XG4gICAgICBnLmdhaW4udmFsdWUgPSAwLjAwMDAwMDAwMTsgLy8gLTE4MGRCID9cblxuICAgICAgY29uc3QgbyA9IGF1ZGlvQ29udGV4dC5jcmVhdGVPc2NpbGxhdG9yKCk7XG4gICAgICBvLmNvbm5lY3QoZyk7XG4gICAgICBvLmZyZXF1ZW5jeS52YWx1ZSA9IDIwO1xuICAgICAgby5zdGFydCgwKTtcblxuICAgICAgLy8gcHJldmVudCBhbmRyb2lkIHRvIHN0b3AgYXVkaW8gYnkga2VwaW5nIHRoZSBvc2NpbGxhdG9yIGFjdGl2ZVxuICAgICAgaWYgKGNsaWVudC5wbGF0Zm9ybS5vcyAhPT0gJ2FuZHJvaWQnKVxuICAgICAgICBvLnN0b3AoYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lICsgMC4wMSk7XG4gICAgfVxuICB9LFxuICB7XG4gICAgLy8gQG5vdGU6IGB0b3VjaGAgZmVhdHVyZSB3b3JrYXJvdW5kXG4gICAgLy8gY2YuIGh0dHA6Ly93d3cuc3R1Y294LmNvbS9ibG9nL3lvdS1jYW50LWRldGVjdC1hLXRvdWNoc2NyZWVuL1xuICAgIGlkOiAnbW9iaWxlLWRldmljZScsXG4gICAgY2hlY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNsaWVudC5wbGF0Zm9ybS5pc01vYmlsZTtcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBpZDogJ2F1ZGlvLWlucHV0JyxcbiAgICBjaGVjazogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gISFuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhO1xuICAgIH0sXG4gICAgc3RhcnRIb29rOiBmdW5jdGlvbigpIHtcbiAgICAgIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEoeyBhdWRpbzogdHJ1ZSB9LCBmdW5jdGlvbihzdHJlYW0pIHtcbiAgICAgICAgc3RyZWFtLmdldEF1ZGlvVHJhY2tzKClbMF0uc3RvcCgpO1xuICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBpZDogJ2Z1bGwtc2NyZWVuJyxcbiAgICBjaGVjazogZnVuY3Rpb24oKSB7XG4gICAgICAvLyBmdW5jdGlvbm5hbGl0eSB0aGF0IGNhbm5vdCBicmFrZSB0aGUgYXBwbGljYXRpb25cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgaW50ZXJhY3Rpb25Ib29rKCkge1xuICAgICAgaWYgKHNjcmVlbmZ1bGwuZW5hYmxlZClcbiAgICAgICAgc2NyZWVuZnVsbC5yZXF1ZXN0KCk7XG4gICAgfVxuICB9LFxuICB7XG4gICAgLy8gYWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9yaWNodHIvTm9TbGVlcC5qcy9ibG9iL21hc3Rlci9Ob1NsZWVwLmpzXG4gICAgaWQ6ICd3YWtlLWxvY2snLFxuICAgIGNoZWNrOiBmdW5jdGlvbigpIHtcbiAgICAgIC8vIGZ1bmN0aW9ubmFsaXR5IHRoYXQgY2Fubm90IGJyYWtlIHRoZSBhcHBsaWNhdGlvblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBpbnRlcmFjdGlvbkhvb2s6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKGNsaWVudC5wbGF0Zm9ybS5vcyA9PT0gJ2lvcycpIHtcbiAgICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IHdpbmRvdy5sb2NhdGlvbjtcbiAgICAgICAgICBzZXRUaW1lb3V0KHdpbmRvdy5zdG9wLCAwKTtcbiAgICAgICAgfSwgMzAwMDApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgbWVkaWFzID0ge1xuICAgICAgICAgIHdlYm06IFwiZGF0YTp2aWRlby93ZWJtO2Jhc2U2NCxHa1hmbzBBZ1FvYUJBVUwzZ1FGQzhvRUVRdk9CQ0VLQ1FBUjNaV0p0UW9lQkFrS0ZnUUlZVTRCblFJMFZTYWxtUUNncTE3RkFBdzlDUUUyQVFBWjNhR0Z0YlhsWFFVQUdkMmhoYlcxNVJJbEFDRUNQUUFBQUFBQUFGbFN1YTBBeHJrQXUxNEVCWThXQkFaeUJBQ0sxbkVBRGRXNWtoa0FGVmw5V1VEZ2xob2hBQTFaUU9JT0JBZUJBQnJDQkNMcUJDQjlEdG5WQUl1ZUJBS05BSElFQUFJQXdBUUNkQVNvSUFBZ0FBVUFtSmFRQUEzQUEvdnowQUFBPVwiLFxuICAgICAgICAgIG1wNDogXCJkYXRhOnZpZGVvL21wNDtiYXNlNjQsQUFBQUhHWjBlWEJwYzI5dEFBQUNBR2x6YjIxcGMyOHliWEEwTVFBQUFBaG1jbVZsQUFBQUcyMWtZWFFBQUFHekFCQUhBQUFCdGhBREFvd2RiYjkvQUFBQzZXMXZiM1lBQUFCc2JYWm9aQUFBQUFCOEpiQ0FmQ1d3Z0FBQUErZ0FBQUFBQUFFQUFBRUFBQUFBQUFBQUFBQUFBQUFCQUFBQUFBQUFBQUFBQUFBQUFBQUFBUUFBQUFBQUFBQUFBQUFBQUFBQVFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUlBQUFJVmRISmhhd0FBQUZ4MGEyaGtBQUFBRDN3bHNJQjhKYkNBQUFBQUFRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQkFBQUFBQUFBQUFBQUFBQUFBQUFBQVFBQUFBQUFBQUFBQUFBQUFBQUFRQUFBQUFBSUFBQUFDQUFBQUFBQnNXMWthV0VBQUFBZ2JXUm9aQUFBQUFCOEpiQ0FmQ1d3Z0FBQUErZ0FBQUFBVmNRQUFBQUFBQzFvWkd4eUFBQUFBQUFBQUFCMmFXUmxBQUFBQUFBQUFBQUFBQUFBVm1sa1pXOUlZVzVrYkdWeUFBQUFBVnh0YVc1bUFBQUFGSFp0YUdRQUFBQUJBQUFBQUFBQUFBQUFBQUFrWkdsdVpnQUFBQnhrY21WbUFBQUFBQUFBQUFFQUFBQU1kWEpzSUFBQUFBRUFBQUVjYzNSaWJBQUFBTGh6ZEhOa0FBQUFBQUFBQUFFQUFBQ29iWEEwZGdBQUFBQUFBQUFCQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFJQUFnQVNBQUFBRWdBQUFBQUFBQUFBUUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFCai8vd0FBQUZKbGMyUnpBQUFBQUFORUFBRUFCRHdnRVFBQUFBQUREVUFBQUFBQUJTMEFBQUd3QVFBQUFiV0pFd0FBQVFBQUFBRWdBTVNOaUI5RkFFUUJGR01BQUFHeVRHRjJZelV5TGpnM0xqUUdBUUlBQUFBWWMzUjBjd0FBQUFBQUFBQUJBQUFBQVFBQUFBQUFBQUFjYzNSell3QUFBQUFBQUFBQkFBQUFBUUFBQUFFQUFBQUJBQUFBRkhOMGMzb0FBQUFBQUFBQUV3QUFBQUVBQUFBVWMzUmpid0FBQUFBQUFBQUJBQUFBTEFBQUFHQjFaSFJoQUFBQVdHMWxkR0VBQUFBQUFBQUFJV2hrYkhJQUFBQUFBQUFBQUcxa2FYSmhjSEJzQUFBQUFBQUFBQUFBQUFBQUsybHNjM1FBQUFBanFYUnZid0FBQUJ0a1lYUmhBQUFBQVFBQUFBQk1ZWFptTlRJdU56Z3VNdz09XCJcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCAkdmlkZW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd2aWRlbycpO1xuICAgICAgICAkdmlkZW8uc2V0QXR0cmlidXRlKCdsb29wJywgJycpO1xuXG4gICAgICAgIGZvciAobGV0IHR5cGUgaW4gbWVkaWFzKSB7XG4gICAgICAgICAgY29uc3QgZGF0YVVSSSA9IG1lZGlhc1t0eXBlXTtcbiAgICAgICAgICBjb25zdCAkc291cmNlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc291cmNlJyk7XG4gICAgICAgICAgJHNvdXJjZS5zcmMgPSBkYXRhVVJJO1xuICAgICAgICAgICRzb3VyY2UudHlwZSA9IGB2aWRlby8ke3R5cGV9YDtcblxuICAgICAgICAgICR2aWRlby5hcHBlbmRDaGlsZCgkc291cmNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgICR2aWRlby5wbGF5KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5dO1xuXG5cbmNvbnN0IGRlZmF1bHRWaWV3VGVtcGxhdGUgPSBgXG48JSBpZiAoIWlzQ29tcGF0aWJsZSkgeyAlPlxuICA8ZGl2IGNsYXNzPVwic2VjdGlvbi10b3BcIj48L2Rpdj5cbiAgPGRpdiBjbGFzcz1cInNlY3Rpb24tY2VudGVyIGZsZXgtY2VudGVyXCI+XG4gICAgPHA+PCU9IGVycm9yTWVzc2FnZSAlPjwvcD5cbiAgPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWJvdHRvbVwiPjwvZGl2PlxuPCUgfSBlbHNlIHsgJT5cbiAgPGRpdiBjbGFzcz1cInNlY3Rpb24tdG9wIGZsZXgtbWlkZGxlXCI+PC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWNlbnRlciBmbGV4LWNlbnRlclwiPlxuICAgICAgPHAgY2xhc3M9XCJiaWdcIj5cbiAgICAgICAgPCU9IGludHJvICU+XG4gICAgICAgIDxiciAvPlxuICAgICAgICA8Yj48JT0gZ2xvYmFscy5hcHBOYW1lICU+PC9iPlxuICAgICAgPC9wPlxuICA8L2Rpdj5cbiAgPGRpdiBjbGFzcz1cInNlY3Rpb24tYm90dG9tIGZsZXgtbWlkZGxlXCI+XG4gICAgPHAgY2xhc3M9XCJzbWFsbCBzb2Z0LWJsaW5rXCI+PCU9IGluc3RydWN0aW9ucyAlPjwvcD5cbiAgPC9kaXY+XG48JSB9ICU+YDtcblxuY29uc3QgZGVmYXVsdFZpZXdDb250ZW50ID0ge1xuICBpc0NvbXBhdGlibGU6IG51bGwsXG4gIGVycm9yTWVzc2FnZTogJ1NvcnJ5LDxiciAvPllvdXIgZGV2aWNlIGlzIG5vdCBjb21wYXRpYmxlIHdpdGggdGhlIGFwcGxpY2F0aW9uLicsXG4gIGludHJvOiAnV2VsY29tZSB0bycsXG4gIGluc3RydWN0aW9uczogJ1RvdWNoIHRoZSBzY3JlZW4gdG8gam9pbiEnLFxufTtcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOnBsYXRmb3JtJztcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBjbGllbnQgYCdwbGF0Zm9ybSdgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlcyBpcyByZXNwb25zaWJsZSBmb3IgZ2l2aW5nIGdlbmVyYWwgaW5mb3JtYXRpb25zIGFib3V0IHRoZSB1c2VyJ3NcbiAqIGRldmljZSAoY2YuIFtgY2xpZW50LmRldmljZWBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5jbGllbnQucGxhdGZvcm19KVxuICogYXMgd2VsbCBhcyBjaGVja2luZyBhdmFpbGFiaWxpdHkgYW5kIHByb3ZpZGluZyBob29rcyBpbiBvcmRlciB0byBpbml0aWFsaXplXG4gKiB0aGUgZmVhdHVyZXMgcmVxdWlyZWQgYnkgdGhlIGFwcGxpY2F0aW9uIChhdWRpbywgbWljcm9waG9uZSwgZXRjLikuXG4gKiBJZiBvbmUgb2YgdGhlIHJlcXVpcmVkIGRlZmluaXRpb25zIGlzIG5vdCBhdmFpbGFibGUsIGEgdmlldyBpcyBjcmVhdGVkIHdpdGhcbiAqIGFuIGVycm9yIG1lc3NhZ2UgYW5kIHRoZSBbYGNsaWVudC5jb21wYXRpYmxlYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LmNsaWVudC5jb21wYXRpYmxlfVxuICogYXR0cmlidXRlIGlzIHNldCB0byBgZmFsc2VgLlxuICpcbiAqIEF2YWlsYWJsZSBidWlsdC1pbiBkZWZpbml0aW9ucyBhcmU6XG4gKiAtICd3ZWItYXVkaW8nXG4gKiAtICdtb2JpbGUtZGV2aWNlJ1xuICogLSAnYXVkaW8taW5wdXQnXG4gKiAtICdmdWxsLXNjcmVlbicgKHRoaXMgZmVhdHVyZSB3b24ndCBibG9jayB0aGUgYXBwbGljYXRpb24sIGp1c3QgYXBwbGllZCBpZiBhdmFpbGFibGUpXG4gKiAtICd3YWtlLWxvY2snXG4gKlxuICogQmUgY2FyZWZ1bGwgd2hlbiBzZXR0aW5nIGBzaG93RGlhbG9nYCBvcHRpb24gdG8gYGZhbHNlYCBiZWNhdXNlIG1vc3Qgb2YgdGhlc2VcbiAqIGZlYXR1cmVzIHJlcXVpcmUgYW4gaW50ZXJhY3Rpb24gb3IgYSBjb25maXJtYXRpb24gZnJvbSB0aGUgdXNlciBpbiBvcmRlciB0b1xuICogYmUgaW5pdGlhbGl6ZWQgY29ycmVjdGx5LFxuICpcbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5jbGllbnR9XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7QXJyYXk8U3RyaW5nPnxTdHJpbmd9IG9wdGlvbnMuZmVhdHVyZXMgLSBJZChzKSBvZiB0aGUgZmVhdHVyZShzKVxuICogIHJlcXVpcmVkIGJ5IHRoZSBhcHBsaWNhdGlvbi5cbiAqIEBwYXJhbSB7fVxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBleGFtcGxlXG4gKiAvLyBpbnNpZGUgdGhlIGV4cGVyaWVuY2UgY29uc3RydWN0b3JcbiAqIHRoaXMucGxhdGZvcm0gPSB0aGlzLnJlcXVpcmUoJ3BsYXRmb3JtJywgeyBmZWF0dXJlczogJ3dlYi1hdWRpbycgfSk7XG4gKi9cbmNsYXNzIFBsYXRmb3JtIGV4dGVuZHMgU2VydmljZSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbmNpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgZmFsc2UpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICAvLyB3YWtlTG9jazogZmFsc2UsIC8vIEB0b2RvIC0gZml4IGFuZCB0cmFuc2Zvcm0gaW50byBhIGZlYXR1cmVcbiAgICAgIHNob3dEaWFsb2c6IHRydWUsXG4gICAgICB2aWV3Q3RvcjogU2VnbWVudGVkVmlldyxcbiAgICAgIHZpZXdQcmlvcml0eTogMTAsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIHRoaXMuX2RlZmF1bHRWaWV3VGVtcGxhdGUgPSBkZWZhdWx0Vmlld1RlbXBsYXRlO1xuICAgIHRoaXMuX2RlZmF1bHRWaWV3Q29udGVudCA9IGRlZmF1bHRWaWV3Q29udGVudDtcblxuICAgIHRoaXMuX3JlcXVpcmVkRmVhdHVyZXMgPSBuZXcgU2V0KCk7XG4gICAgdGhpcy5fZmVhdHVyZURlZmluaXRpb25zID0ge307XG5cbiAgICBkZWZhdWx0RGVmaW5pdGlvbnMuZm9yRWFjaCgoZGVmKSA9PiB0aGlzLmFkZEZlYXR1cmVEZWZpbml0aW9uKGRlZikpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGNvbmZpZ3VyZShvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMuZmVhdHVyZXMpIHtcbiAgICAgIGxldCBmZWF0dXJlcyA9IG9wdGlvbnMuZmVhdHVyZXM7XG5cbiAgICAgIGlmICh0eXBlb2YgZmVhdHVyZXMgPT09ICdzdHJpbmcnKVxuICAgICAgICBmZWF0dXJlcyA9IFtmZWF0dXJlc107XG5cbiAgICAgIHRoaXMucmVxdWlyZUZlYXR1cmUoLi4uZmVhdHVyZXMpO1xuICAgICAgZGVsZXRlIG9wdGlvbnMuZmVhdHVyZXM7XG4gICAgfVxuXG4gICAgc3VwZXIuY29uZmlndXJlKG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGluaXQoKSB7XG4gICAgdGhpcy5fZGVmaW5lQXVkaW9GaWxlRXh0ZW50aW9uKCk7XG4gICAgdGhpcy5fZGVmaW5lUGxhdGZvcm0oKTtcbiAgICAvLyByZXNvbHZlIHJlcXVpcmVkIGZlYXR1cmVzIGZyb20gdGhlIGFwcGxpY2F0aW9uXG4gICAgY2xpZW50LmNvbXBhdGlibGUgPSB0aGlzLnJlc29sdmVSZXF1aXJlZEZlYXR1cmVzKCk7XG4gICAgdGhpcy52aWV3Q29udGVudC5pc0NvbXBhdGlibGUgPSBjbGllbnQuY29tcGF0aWJsZTtcblxuICAgIHRoaXMudmlld0N0b3IgPSB0aGlzLm9wdGlvbnMudmlld0N0b3I7XG4gICAgdGhpcy52aWV3ID0gdGhpcy5jcmVhdGVWaWV3KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICghdGhpcy5oYXNTdGFydGVkKVxuICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICAvLyBleGVjdXRlIHN0YXJ0IGhvb2tzIGZyb20gdGhlIGZlYXR1cmVzIGRlZmluaXRpb25zXG4gICAgaWYoY2xpZW50LmNvbXBhdGlibGUpIHtcbiAgICAgIGNvbnN0IHN0YXJ0SG9va3MgPSB0aGlzLmdldFN0YXJ0SG9va3MoKTtcbiAgICAgIHN0YXJ0SG9va3MuZm9yRWFjaCgoaG9vaykgPT4gaG9vaygpKTtcbiAgICB9XG5cbiAgICAvLyBvcHRpb25uYWx5IHNraXAgdGhlIHZpZXcgaWYgY2xpZW50IGlzIGNvbXBhdGlibGVcbiAgICBpZiAoY2xpZW50LmNvbXBhdGlibGUgJiYgIXRoaXMub3B0aW9ucy5zaG93RGlhbG9nKSB7XG4gICAgICAvLyBieXBhc3MgaWYgZmVhdHVyZXMgY29udGFpbnMgJ3dlYi1hdWRpbycgYW5kIGNsaWVudC5wbGF0Zm9ybS5vcyA9PT0gJ2lvcydcbiAgICAgIGlmICh0aGlzLl9yZXF1aXJlZEZlYXR1cmVzLmhhcygnd2ViLWF1ZGlvJykgJiYgY2xpZW50LnBsYXRmb3JtLm9zID09PSAnaW9zJylcbiAgICAgICAgdGhpcy5zaG93KCk7XG4gICAgICBlbHNlXG4gICAgICAgIHRoaXMucmVhZHkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zaG93KCk7XG4gICAgfVxuXG4gICAgLy8gaW5zdGFsbCBldmVudHMgZm9yIGludGVyYWN0aW9uIGhvb2tcbiAgICBpZiAoY2xpZW50LmNvbXBhdGlibGUpIHtcbiAgICAgIGNvbnN0IGV2ZW50ID0gY2xpZW50LnBsYXRmb3JtLmlzTW9iaWxlID8gJ3RvdWNoZW5kJyA6ICdjbGljayc7XG4gICAgICB0aGlzLnZpZXcuaW5zdGFsbEV2ZW50cyh7IFtldmVudF06IHRoaXMuX29uSW50ZXJhY3Rpb24uYmluZCh0aGlzKSB9KTtcbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RvcCgpIHtcbiAgICB0aGlzLmhpZGUoKTtcbiAgICBzdXBlci5zdG9wKCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgbmV3IGZlYXR1cmUgZGVmaW5pdGlvbiBvciBvdmVycmlkZSBhbiBleGlzdGluZyBvbmUuXG4gICAqIEBwYXJhbSB7bW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYXRmb3JtfmRlZmluaXRpb259IG9iaiAtIERlZmluaXRpb24gb2ZcbiAgICogIHRoZSBmZWF0dXJlIHRvIGFkZCB0byB0aGUgZXhpc3Rpbmcgb25lcy5cbiAgICovXG4gIGFkZEZlYXR1cmVEZWZpbml0aW9uKG9iaikge1xuICAgIHRoaXMuX2ZlYXR1cmVEZWZpbml0aW9uc1tvYmouaWRdID0gb2JqO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcXVpcmUgZmVhdHVyZXMgYXZhbGFiaWxpdHkgZm9yIHRoZSBhcHBsaWNhdGlvbi5cbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHsuLi5TdHJpbmd9IGZlYXR1cmVzIC0gVGhlIGlkKHMpIG9mIHRoZSBmZWF0dXJlKHMpIHRvIGJlIHJlcXVpcmVkLlxuICAgKi9cbiAgcmVxdWlyZUZlYXR1cmUoLi4uZmVhdHVyZXMpIHtcbiAgICBmZWF0dXJlcy5mb3JFYWNoKChpZCkgPT4gdGhpcy5fcmVxdWlyZWRGZWF0dXJlcy5hZGQoaWQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlIGFsbCBgY2hlY2tgIGZ1bmN0aW9ucyBmcm9tIHRoZSBkZWZpbml0aW9uIG9mIHRoZSByZXF1aXJlZCBmZWF0dXJlcy5cbiAgICogQHByaXZhdGVcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gLSB0cnVlIGlmIGFsbCBjaGVja3MgcGFzcywgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKlxuICAgKi9cbiAgcmVzb2x2ZVJlcXVpcmVkRmVhdHVyZXMoKSB7XG4gICAgbGV0IHJlc3VsdCA9IHRydWU7XG5cbiAgICB0aGlzLl9yZXF1aXJlZEZlYXR1cmVzLmZvckVhY2goKGZlYXR1cmUpID0+IHtcbiAgICAgIGNvbnN0IGNoZWNrRnVuY3Rpb24gPSB0aGlzLl9mZWF0dXJlRGVmaW5pdGlvbnNbZmVhdHVyZV0uY2hlY2s7XG5cbiAgICAgIGlmICghKHR5cGVvZiBjaGVja0Z1bmN0aW9uID09PSAnZnVuY3Rpb24nKSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBjaGVjayBmdW5jdGlvbiBkZWZpbmVkIGZvciAke2ZlYXR1cmV9IGZlYXR1cmVgKTtcblxuICAgICAgcmVzdWx0ID0gcmVzdWx0ICYmIGNoZWNrRnVuY3Rpb24oKTtcbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbGlzdCBvZiB0aGUgZnVuY3Rpb25zIHRvIGJlIGV4ZWN1dGVkIG9uIGBzdGFydGAgbGlmZWN5Y2xlLlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICovXG4gIGdldFN0YXJ0SG9va3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dldEhvb2tzKCdzdGFydEhvb2snKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBsaXN0IG9mIHRoZSBmdW5jdGlvbnMgdG8gYmUgZXhlY3V0ZWQgd2hlbiB0aGUgdXNlclxuICAgKiBpbnRlcmFjdHMgd2l0aCB0aGUgYXBwbGljYXRpb24gZm9yIHRoZSBmaXJzdCB0aW1lLlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICovXG4gIGdldEludGVyYWN0aW9uSG9va3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dldEhvb2tzKCdpbnRlcmFjdGlvbkhvb2snKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfZ2V0SG9va3ModHlwZSkge1xuICAgIGNvbnN0IGhvb2tzID0gW107XG5cbiAgICB0aGlzLl9yZXF1aXJlZEZlYXR1cmVzLmZvckVhY2goKGZlYXR1cmUpID0+IHtcbiAgICAgIGNvbnN0IGhvb2sgPSB0aGlzLl9mZWF0dXJlRGVmaW5pdGlvbnNbZmVhdHVyZV1bdHlwZV07XG5cbiAgICAgIGlmIChob29rKVxuICAgICAgICBob29rcy5wdXNoKGhvb2spO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGhvb2tzO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGUgYGludGVyYWN0aW9uc2AgaG9va3MgZnJvbSB0aGUgYHBsYXRmb3JtYCBzZXJ2aWNlLlxuICAgKiBBbHNvIGFjdGl2YXRlIHRoZSBtZWRpYSBhY2NvcmRpbmcgdG8gdGhlIGBvcHRpb25zYC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9vbkludGVyYWN0aW9uKCkge1xuICAgIC8vIGV4ZWN1dGUgaW50ZXJhY3Rpb24gaG9va3MgZnJvbSB0aGUgcGxhdGZvcm1cbiAgICBjb25zdCBpbnRlcmFjdGlvbkhvb2tzID0gdGhpcy5nZXRJbnRlcmFjdGlvbkhvb2tzKCk7XG4gICAgaW50ZXJhY3Rpb25Ib29rcy5mb3JFYWNoKChob29rKSA9PiBob29rKCkpO1xuXG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBvcHVsYXRlIGBjbGllbnQucGxhdGZvcm1gIHdpdGggdGhlIHByZWZlcmVkIGF1ZGlvIGZpbGUgZXh0ZW50aW9uIGZvciB0aGUgcGxhdGZvcm0uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfZGVmaW5lQXVkaW9GaWxlRXh0ZW50aW9uKCkge1xuICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhdWRpbycpO1xuICAgIC8vIGh0dHA6Ly9kaXZlaW50b2h0bWw1LmluZm8vZXZlcnl0aGluZy5odG1sXG4gICAgaWYgKCEhKGEuY2FuUGxheVR5cGUgJiYgYS5jYW5QbGF5VHlwZSgnYXVkaW8vbXBlZzsnKSkpIHtcbiAgICAgIGNsaWVudC5wbGF0Zm9ybS5hdWRpb0ZpbGVFeHQgPSAnLm1wMyc7XG4gICAgfSBlbHNlIGlmICghIShhLmNhblBsYXlUeXBlICYmIGEuY2FuUGxheVR5cGUoJ2F1ZGlvL29nZzsgY29kZWNzPVwidm9yYmlzXCInKSkpIHtcbiAgICAgIGNsaWVudC5wbGF0Zm9ybS5hdWRpb0ZpbGVFeHQgPSAnLm9nZyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNsaWVudC5wbGF0Zm9ybS5hdWRpb0ZpbGVFeHQgPSAnLndhdic7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFBvcHVsYXRlIGBjbGllbnQucGxhdGZvcm1gIHdpdGggdGhlIG9zIG5hbWUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfZGVmaW5lUGxhdGZvcm0oKSB7XG4gICAgY29uc3QgdWEgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudFxuICAgIGNvbnN0IG1kID0gbmV3IE1vYmlsZURldGVjdCh1YSk7XG5cbiAgICBjbGllbnQucGxhdGZvcm0uaXNNb2JpbGUgPSAobWQubW9iaWxlKCkgIT09IG51bGwpOyAvLyB0cnVlIGlmIHBob25lIG9yIHRhYmxldFxuICAgIGNsaWVudC5wbGF0Zm9ybS5vcyA9IChmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG9zID0gbWQub3MoKTtcblxuICAgICAgaWYgKG9zID09PSAnQW5kcm9pZE9TJylcbiAgICAgICAgcmV0dXJuICdhbmRyb2lkJztcbiAgICAgIGVsc2UgaWYgKG9zID09PSAnaU9TJylcbiAgICAgICAgcmV0dXJuICdpb3MnO1xuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gJ290aGVyJztcbiAgICB9KSgpO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFBsYXRmb3JtKTtcblxuZXhwb3J0IGRlZmF1bHQgUGxhdGZvcm07XG4iXX0=