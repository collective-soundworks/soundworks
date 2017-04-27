'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _wavesAudio = require('waves-audio');

var _client = require('../core/client');

var _client2 = _interopRequireDefault(_client);

var _mobileDetect = require('mobile-detect');

var _mobileDetect2 = _interopRequireDefault(_mobileDetect);

var _screenfull = require('screenfull');

var _screenfull2 = _interopRequireDefault(_screenfull);

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * API of a compliant view for the `platform` service.
 *
 * @memberof module:soundworks/client
 * @interface AbstractPlatformView
 * @extends module:soundworks/client.AbstractView
 * @abstract
 */
/**
 * Register the callback to execute when the user touches the screen for the first time.
 *
 * @name setTouchStartCallback
 * @memberof module:soundworks/client.AbstractPlatformView
 * @function
 * @abstract
 * @instance
 *
 * @param {touchStartCallback} callback - Callback to execute when the user
 *  touches the screen for the first time.
 */
/**
 * Register the callback to execute when the user clicks the screen for the first time.
 *
 * @name setMousedownCallback
 * @memberof module:soundworks/client.AbstractPlatformView
 * @function
 * @abstract
 * @instance
 *
 * @param {mouseDownCallback} callback - Callback to execute when the user
 *  clicks the screen for the first time.
 */
/**
 * Update the view to notify that the compatibility checks are terminated.
 *
 * @name updateCheckingStatus
 * @memberof module:soundworks/client.AbstractPlatformView
 * @function
 * @abstract
 * @instance
 *
 * @param {Boolean} value
 */
/**
 * Update the view to notify if the device is compatible or not.
 *
 * @name updateIsCompatibleStatus
 * @memberof module:soundworks/client.AbstractPlatformView
 * @function
 * @abstract
 * @instance
 *
 * @param {Boolean} value
 */
/**
 * Update the view to notify if the application obtained all the authorizations
 * or not.
 *
 * @name updateHasAuthorizationsStatus
 * @memberof module:soundworks/client.AbstractPlatformView
 * @function
 * @abstract
 * @instance
 *
 * @param {Boolean} value
 */

/**
 * Callback to execute when the user touches the screen for the first time.
 *
 * @callback
 * @name touchStartCallback
 * @memberof module:soundworks/client.AbstractPlatformView
 *
 * @param {String} password - Password given by the user.
 */
/**
 * Callback to execute when the user clicks the screen for the first time.
 *
 * @callback
 * @name mouseDownCallback
 * @memberof module:soundworks/client.AbstractPlatformView
 */

/**
 * Structure of the definition for the test of a feature.
 *
 * @typedef {Object} module:soundworks/client.Platform~definition
 *
 * @property {String} id - Id of the definition.
 * @property {Function} check - A function that should return `true` if the
 *  feature is available on the platform, `false` otherwise.
 * @property {Function} [startHook] - A function returning a `Promise` to be
 *  executed on start (for example to ask access to microphone or geolocation).
 *  The returned promise should be resolved on `true` is the process succeded or
 *  `false` is the precess failed (e.g. permission not granted).
 * @property {Function} [interactionHook] - A function returning a Promiseto be
 *  executed on the first interaction (i.e. `click` or `touchstart`) of the user
 *  with application (for example, to initialize AudioContext on iOS devices).
 *  The returned promise should be resolved on `true` is the process succeded or
 *  `false` is the precess failed (e.g. permission not granted).
 */
var defaultDefinitions = [{
  id: 'web-audio',
  check: function check() {
    return !!_wavesAudio.audioContext;
  },
  interactionHook: function interactionHook() {
    if (!_client2.default.platform.isMobile) return _promise2.default.resolve(true);

    var g = _wavesAudio.audioContext.createGain();
    g.connect(_wavesAudio.audioContext.destination);
    g.gain.value = 0.000000001; // -180dB ?

    var o = _wavesAudio.audioContext.createOscillator();
    o.connect(g);
    o.frequency.value = 20;
    o.start(0);

    // prevent android to stop audio by keeping the oscillator active
    if (_client2.default.platform.os !== 'android') o.stop(_wavesAudio.audioContext.currentTime + 0.01);

    return _promise2.default.resolve(true);
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
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

    return !!navigator.getUserMedia;
  },
  startHook: function startHook() {
    return new _promise2.default(function (resolve, reject) {
      navigator.getUserMedia({ audio: true }, function (stream) {
        stream.getAudioTracks()[0].stop();
        resolve(true);
      }, function (err) {
        resolve(false);
        throw err;
      });
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

    return _promise2.default.resolve(true);
  }
}, {
  id: 'geolocation',
  check: function check() {
    return !!navigator.geolocation.getCurrentPosition;
  },
  startHook: function startHook() {
    return new _promise2.default(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(function (position) {
        // populate client with first value
        var coords = position.coords;
        _client2.default.coordinates = [coords.latitude, coords.longitude];
        _client2.default.geoposition = position;

        resolve(true);
      }, function (err) {
        resolve(false);
        throw err;
      }, {});
    });
  }
}, {
  id: 'geolocation-mock',
  check: function check() {
    return true;
  },
  startHook: function startHook() {
    var lat = Math.random() * 360 - 180;
    var lng = Math.random() * 180 - 90;
    _client2.default.coordinates = [lat, lng];
    return _promise2.default.resolve(true);
  }
}, {
  // adapted from https://github.com/richtr/NoSleep.js/blob/master/NoSleep.js
  // warning: cause 150% cpu use in chrome desktop...
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

    return _promise2.default.resolve(true);
  }
}];

var SERVICE_ID = 'service:platform';

/**
 * Interface for the client `'platform'` service.
 *
 * The `platform` services is responsible for giving general informations
 * about the user's device as well as checking availability and providing hooks
 * in order to initialize the features required by the application (audio,
 * microphone, etc.).
 * If one of the required definitions is not available, a view is created with
 * an error message and `client.compatible` is set to `false`.
 *
 * Available built-in definitions are:
 * - 'web-audio'
 * - 'mobile-device': only-accept mobile devices in the application (based on
 *   User-Agent sniffing)
 * - 'audio-input': Android Only
 * - 'full-screen': Android Only, this feature won't block the application if
 *   not available.
 * - 'geolocation': check if the navigator supports geolocation. The `coordinates`
 *   and `geoposition` of the `client` are populated when the plaform service
 *   resolves. (if no update of the coordinates are needed in the application,
 *   requiring geolocation feature without using the Geolocation service should
 *   suffice).
 * - 'wake-lock': use with caution, has been observed consumming
 *   150% cpu in chrome desktop.
 *
 *
 * _<span class="warning">__WARNING__</span> This class should never be
 * instanciated manually_
 *
 * @param {Object} options
 * @param {Array<String>|String} options.features - Id(s) of the feature(s)
 *  required by the application. Available build-in features are:
 *  - 'web-audio'
 *  - 'mobile-device': only accept mobile devices (recognition based User-Agent)
 *  - 'audio-input': Android only
 *  - 'full-screen': Android only
 *  - 'geolocation': accept geolocalized devices. Populate the client with
 *     current position
 *  - 'wake-lock': this feature should be used with caution as
 *     it has been observed to use 150% of cpu in chrome desktop.
 *
 * <!--
 * Warning: when setting `showDialog` option to `false`, unexpected behaviors
 * might occur because most of the features require an interaction or a
 * confirmation from the user in order to be initialized correctly.
 * -->
 *
 * @memberof module:soundworks/client
 * @example
 * // inside the experience constructor
 * this.platform = this.require('platform', { features: 'web-audio' });
 *
 * @see {@link module:soundworks/client.client#platform}
 */

var Platform = function (_Service) {
  (0, _inherits3.default)(Platform, _Service);

  function Platform() {
    (0, _classCallCheck3.default)(this, Platform);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Platform.__proto__ || (0, _getPrototypeOf2.default)(Platform)).call(this, SERVICE_ID, false));

    var defaults = {
      showDialog: true,
      view: null,
      viewPriority: 10
    };

    _this.configure(defaults);

    _this.view = null;

    // this._defaultViewTemplate = defaultViewTemplate;
    // this._defaultViewContent = defaultViewContent;

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

    /**
     *  Start the client.
     *  Algorithm:
     *  - check required features
     *  - if (false)
     *     show 'sorry' screen
     *  - else
     *     show 'welcome' screen
     *     execute start hook (promise)
     *     - if (promise === true)
     *        show touch to start
     *        bind events
     *     - else
     *        show 'sorry' screen
     * @private
     */

  }, {
    key: 'start',
    value: function start() {
      var _this2 = this;

      (0, _get3.default)(Platform.prototype.__proto__ || (0, _getPrototypeOf2.default)(Platform.prototype), 'start', this).call(this);

      this._defineAudioFileExtention();
      this._definePlatform();

      // resolve required features from the application
      _client2.default.compatible = this._checkRequiredFeatures();

      // default view values
      this.view.updateCheckingStatus(false);
      this.view.updateIsCompatibleStatus(null);
      this.view.updateHasAuthorizationsStatus(null);

      if (!_client2.default.compatible) {
        this.view.updateIsCompatibleStatus(false);
        this.show();
      } else {
        this.view.updateIsCompatibleStatus(true);
        this.view.updateCheckingStatus(true);
        this.show();

        // execute start hook
        var startHooks = this._getHooks('startHook');
        var startPromises = startHooks.map(function (hook) {
          return hook();
        });

        _promise2.default.all(startPromises).then(function (results) {
          // if one of the start hook failed
          var hasAuthorizations = true;
          results.forEach(function (success) {
            return hasAuthorizations = hasAuthorizations && success;
          });

          _this2.view.updateHasAuthorizationsStatus(hasAuthorizations);
          _this2.view.updateCheckingStatus(false);

          if (hasAuthorizations) {
            _this2.view.setTouchStartCallback(_this2._onInteraction('touch'));
            _this2.view.setMouseDownCallback(_this2._onInteraction('mouse'));
          }
        }).catch(function (err) {
          return console.error(err.stack);
        });
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
     * Structure of the definition for the test of a feature.
     *
     * @param {module:soundworks/client.Platform~definition} obj - Definition of
    *
     *  the feature.
     */

  }, {
    key: 'addFeatureDefinition',
    value: function addFeatureDefinition(obj) {
      this._featureDefinitions[obj.id] = obj;
    }

    /**
     * Require features for the application.
     *
     * @param {...String} features - Id(s) of the feature(s) to be required.
     * @private
     */

  }, {
    key: 'requireFeature',
    value: function requireFeature() {
      var _this3 = this;

      for (var _len = arguments.length, features = Array(_len), _key = 0; _key < _len; _key++) {
        features[_key] = arguments[_key];
      }

      features.forEach(function (id) {
        return _this3._requiredFeatures.add(id);
      });
    }

    /**
     * Execute `interactions` hooks from the `platform` service.
     * Also activate the media according to the `options`.
     *
     * @private
     */

  }, {
    key: '_onInteraction',
    value: function _onInteraction(type) {
      var _this4 = this;

      return function (e) {
        e.preventDefault();
        e.stopPropagation();

        _client2.default.platform.interaction = type;
        // execute interaction hooks from the platform
        var interactionHooks = _this4._getHooks('interactionHook');
        var interactionPromises = interactionHooks.map(function (hook) {
          return hook();
        });

        _promise2.default.all(interactionPromises).then(function (results) {
          var resolved = true;
          results.forEach(function (bool) {
            return resolved = resolved && bool;
          });

          if (resolved) {
            _this4.ready();
          } else {
            _this4.view.updateHasAuthorizationsStatus(resolved);
          }
        }).catch(function (err) {
          return console.error(err.stack);
        });
      };
    }

    /**
     * Execute all `check` functions defined in the required features.
     *
     * @return {Boolean} - `true` if all checks pass, `false` otherwise.
     * @private
     */

  }, {
    key: '_checkRequiredFeatures',
    value: function _checkRequiredFeatures() {
      var _this5 = this;

      var result = true;

      this._requiredFeatures.forEach(function (feature) {
        var checkFunction = _this5._featureDefinitions[feature].check;

        if (!(typeof checkFunction === 'function')) throw new Error('No check function defined for ' + feature + ' feature');

        result = result && checkFunction();
      });

      return result;
    }

    /** @private */

  }, {
    key: '_getHooks',
    value: function _getHooks(type) {
      var _this6 = this;

      var hooks = [];

      this._requiredFeatures.forEach(function (feature) {
        var hook = _this6._featureDefinitions[feature][type];

        if (hook) hooks.push(hook);
      });

      return hooks;
    }

    /**
     * Populate `client.platform` with the prefered audio file extention
     * for the platform.
     *
     * @private
     */

  }, {
    key: '_defineAudioFileExtention',
    value: function _defineAudioFileExtention() {
      var a = document.createElement('audio');
      // http://diveintohtml5.info/everything.html
      if (!!(a.canPlayType && a.canPlayType('audio/mpeg;'))) _client2.default.platform.audioFileExt = '.mp3';else if (!!(a.canPlayType && a.canPlayType('audio/ogg; codecs="vorbis"'))) _client2.default.platform.audioFileExt = '.ogg';else _client2.default.platform.audioFileExt = '.wav';
    }

    /**
     * Populate `client.platform` with the os name.
     *
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYXRmb3JtLmpzIl0sIm5hbWVzIjpbImRlZmF1bHREZWZpbml0aW9ucyIsImlkIiwiY2hlY2siLCJpbnRlcmFjdGlvbkhvb2siLCJwbGF0Zm9ybSIsImlzTW9iaWxlIiwicmVzb2x2ZSIsImciLCJjcmVhdGVHYWluIiwiY29ubmVjdCIsImRlc3RpbmF0aW9uIiwiZ2FpbiIsInZhbHVlIiwibyIsImNyZWF0ZU9zY2lsbGF0b3IiLCJmcmVxdWVuY3kiLCJzdGFydCIsIm9zIiwic3RvcCIsImN1cnJlbnRUaW1lIiwibmF2aWdhdG9yIiwiZ2V0VXNlck1lZGlhIiwid2Via2l0R2V0VXNlck1lZGlhIiwibW96R2V0VXNlck1lZGlhIiwibXNHZXRVc2VyTWVkaWEiLCJzdGFydEhvb2siLCJyZWplY3QiLCJhdWRpbyIsInN0cmVhbSIsImdldEF1ZGlvVHJhY2tzIiwiZXJyIiwiZW5hYmxlZCIsInJlcXVlc3QiLCJnZW9sb2NhdGlvbiIsImdldEN1cnJlbnRQb3NpdGlvbiIsInBvc2l0aW9uIiwiY29vcmRzIiwiY29vcmRpbmF0ZXMiLCJsYXRpdHVkZSIsImxvbmdpdHVkZSIsImdlb3Bvc2l0aW9uIiwibGF0IiwiTWF0aCIsInJhbmRvbSIsImxuZyIsInNldEludGVydmFsIiwid2luZG93IiwibG9jYXRpb24iLCJzZXRUaW1lb3V0IiwibWVkaWFzIiwid2VibSIsIm1wNCIsIiR2aWRlbyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInNldEF0dHJpYnV0ZSIsInR5cGUiLCJkYXRhVVJJIiwiJHNvdXJjZSIsInNyYyIsImFwcGVuZENoaWxkIiwicGxheSIsIlNFUlZJQ0VfSUQiLCJQbGF0Zm9ybSIsImRlZmF1bHRzIiwic2hvd0RpYWxvZyIsInZpZXciLCJ2aWV3UHJpb3JpdHkiLCJjb25maWd1cmUiLCJfcmVxdWlyZWRGZWF0dXJlcyIsIl9mZWF0dXJlRGVmaW5pdGlvbnMiLCJmb3JFYWNoIiwiZGVmIiwiYWRkRmVhdHVyZURlZmluaXRpb24iLCJvcHRpb25zIiwiZmVhdHVyZXMiLCJyZXF1aXJlRmVhdHVyZSIsIl9kZWZpbmVBdWRpb0ZpbGVFeHRlbnRpb24iLCJfZGVmaW5lUGxhdGZvcm0iLCJjb21wYXRpYmxlIiwiX2NoZWNrUmVxdWlyZWRGZWF0dXJlcyIsInVwZGF0ZUNoZWNraW5nU3RhdHVzIiwidXBkYXRlSXNDb21wYXRpYmxlU3RhdHVzIiwidXBkYXRlSGFzQXV0aG9yaXphdGlvbnNTdGF0dXMiLCJzaG93Iiwic3RhcnRIb29rcyIsIl9nZXRIb29rcyIsInN0YXJ0UHJvbWlzZXMiLCJtYXAiLCJob29rIiwiYWxsIiwidGhlbiIsInJlc3VsdHMiLCJoYXNBdXRob3JpemF0aW9ucyIsInN1Y2Nlc3MiLCJzZXRUb3VjaFN0YXJ0Q2FsbGJhY2siLCJfb25JbnRlcmFjdGlvbiIsInNldE1vdXNlRG93bkNhbGxiYWNrIiwiY2F0Y2giLCJjb25zb2xlIiwiZXJyb3IiLCJzdGFjayIsImhpZGUiLCJvYmoiLCJhZGQiLCJlIiwicHJldmVudERlZmF1bHQiLCJzdG9wUHJvcGFnYXRpb24iLCJpbnRlcmFjdGlvbiIsImludGVyYWN0aW9uSG9va3MiLCJpbnRlcmFjdGlvblByb21pc2VzIiwicmVzb2x2ZWQiLCJib29sIiwicmVhZHkiLCJyZXN1bHQiLCJmZWF0dXJlIiwiY2hlY2tGdW5jdGlvbiIsIkVycm9yIiwiaG9va3MiLCJwdXNoIiwiYSIsImNhblBsYXlUeXBlIiwiYXVkaW9GaWxlRXh0IiwidWEiLCJ1c2VyQWdlbnQiLCJtZCIsIm1vYmlsZSIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQTs7Ozs7Ozs7QUFRQTs7Ozs7Ozs7Ozs7O0FBWUE7Ozs7Ozs7Ozs7OztBQVlBOzs7Ozs7Ozs7OztBQVdBOzs7Ozs7Ozs7OztBQVdBOzs7Ozs7Ozs7Ozs7O0FBYUE7Ozs7Ozs7OztBQVNBOzs7Ozs7OztB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QyxFQUFFa0UsRUFBRUMsV0FBRixJQUFpQkQsRUFBRUMsV0FBRixDQUFjLGFBQWQsQ0FBbkIsQ0FBTCxFQUNFLGlCQUFPckgsUUFBUCxDQUFnQnNILFlBQWhCLEdBQStCLE1BQS9CLENBREYsS0FFSyxJQUFJLENBQUMsRUFBRUYsRUFBRUMsV0FBRixJQUFpQkQsRUFBRUMsV0FBRixDQUFjLDRCQUFkLENBQW5CLENBQUwsRUFDSCxpQkFBT3JILFFBQVAsQ0FBZ0JzSCxZQUFoQixHQUErQixNQUEvQixDQURHLEtBR0gsaUJBQU90SCxRQUFQLENBQWdCc0gsWUFBaEIsR0FBK0IsTUFBL0I7QUFDSDs7QUFFRDs7Ozs7Ozs7c0NBS2tCO0FBQ2hCLFVBQU1DLEtBQUs3RSxPQUFPMUIsU0FBUCxDQUFpQndHLFNBQTVCO0FBQ0EsVUFBTUMsS0FBSywyQkFBaUJGLEVBQWpCLENBQVg7O0FBRUEsdUJBQU92SCxRQUFQLENBQWdCQyxRQUFoQixHQUE0QndILEdBQUdDLE1BQUgsT0FBZ0IsSUFBNUMsQ0FKZ0IsQ0FJbUM7QUFDbkQsdUJBQU8xSCxRQUFQLENBQWdCYSxFQUFoQixHQUFzQixZQUFXO0FBQy9CLFlBQU1BLEtBQUs0RyxHQUFHNUcsRUFBSCxFQUFYOztBQUVBLFlBQUlBLE9BQU8sV0FBWCxFQUNFLE9BQU8sU0FBUCxDQURGLEtBRUssSUFBSUEsT0FBTyxLQUFYLEVBQ0gsT0FBTyxLQUFQLENBREcsS0FHSCxPQUFPLE9BQVA7QUFDSCxPQVRvQixFQUFyQjtBQVVEOzs7OztBQUdILHlCQUFlOEcsUUFBZixDQUF3QmpFLFVBQXhCLEVBQW9DQyxRQUFwQzs7a0JBRWVBLFEiLCJmaWxlIjoiUGxhdGZvcm0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhdWRpb0NvbnRleHQgfSBmcm9tICd3YXZlcy1hdWRpbyc7XG5pbXBvcnQgY2xpZW50IGZyb20gJy4uL2NvcmUvY2xpZW50JztcbmltcG9ydCBNb2JpbGVEZXRlY3QgZnJvbSAnbW9iaWxlLWRldGVjdCc7XG5pbXBvcnQgc2NyZWVuZnVsbCBmcm9tICdzY3JlZW5mdWxsJztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbi8qKlxuICogQVBJIG9mIGEgY29tcGxpYW50IHZpZXcgZm9yIHRoZSBgcGxhdGZvcm1gIHNlcnZpY2UuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQGludGVyZmFjZSBBYnN0cmFjdFBsYXRmb3JtVmlld1xuICogQGV4dGVuZHMgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0Vmlld1xuICogQGFic3RyYWN0XG4gKi9cbi8qKlxuICogUmVnaXN0ZXIgdGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiB0aGUgdXNlciB0b3VjaGVzIHRoZSBzY3JlZW4gZm9yIHRoZSBmaXJzdCB0aW1lLlxuICpcbiAqIEBuYW1lIHNldFRvdWNoU3RhcnRDYWxsYmFja1xuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BYnN0cmFjdFBsYXRmb3JtVmlld1xuICogQGZ1bmN0aW9uXG4gKiBAYWJzdHJhY3RcbiAqIEBpbnN0YW5jZVxuICpcbiAqIEBwYXJhbSB7dG91Y2hTdGFydENhbGxiYWNrfSBjYWxsYmFjayAtIENhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiB0aGUgdXNlclxuICogIHRvdWNoZXMgdGhlIHNjcmVlbiBmb3IgdGhlIGZpcnN0IHRpbWUuXG4gKi9cbi8qKlxuICogUmVnaXN0ZXIgdGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiB0aGUgdXNlciBjbGlja3MgdGhlIHNjcmVlbiBmb3IgdGhlIGZpcnN0IHRpbWUuXG4gKlxuICogQG5hbWUgc2V0TW91c2Vkb3duQ2FsbGJhY2tcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWJzdHJhY3RQbGF0Zm9ybVZpZXdcbiAqIEBmdW5jdGlvblxuICogQGFic3RyYWN0XG4gKiBAaW5zdGFuY2VcbiAqXG4gKiBAcGFyYW0ge21vdXNlRG93bkNhbGxiYWNrfSBjYWxsYmFjayAtIENhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiB0aGUgdXNlclxuICogIGNsaWNrcyB0aGUgc2NyZWVuIGZvciB0aGUgZmlyc3QgdGltZS5cbiAqL1xuLyoqXG4gKiBVcGRhdGUgdGhlIHZpZXcgdG8gbm90aWZ5IHRoYXQgdGhlIGNvbXBhdGliaWxpdHkgY2hlY2tzIGFyZSB0ZXJtaW5hdGVkLlxuICpcbiAqIEBuYW1lIHVwZGF0ZUNoZWNraW5nU3RhdHVzXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0UGxhdGZvcm1WaWV3XG4gKiBAZnVuY3Rpb25cbiAqIEBhYnN0cmFjdFxuICogQGluc3RhbmNlXG4gKlxuICogQHBhcmFtIHtCb29sZWFufSB2YWx1ZVxuICovXG4vKipcbiAqIFVwZGF0ZSB0aGUgdmlldyB0byBub3RpZnkgaWYgdGhlIGRldmljZSBpcyBjb21wYXRpYmxlIG9yIG5vdC5cbiAqXG4gKiBAbmFtZSB1cGRhdGVJc0NvbXBhdGlibGVTdGF0dXNcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWJzdHJhY3RQbGF0Zm9ybVZpZXdcbiAqIEBmdW5jdGlvblxuICogQGFic3RyYWN0XG4gKiBAaW5zdGFuY2VcbiAqXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHZhbHVlXG4gKi9cbi8qKlxuICogVXBkYXRlIHRoZSB2aWV3IHRvIG5vdGlmeSBpZiB0aGUgYXBwbGljYXRpb24gb2J0YWluZWQgYWxsIHRoZSBhdXRob3JpemF0aW9uc1xuICogb3Igbm90LlxuICpcbiAqIEBuYW1lIHVwZGF0ZUhhc0F1dGhvcml6YXRpb25zU3RhdHVzXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0UGxhdGZvcm1WaWV3XG4gKiBAZnVuY3Rpb25cbiAqIEBhYnN0cmFjdFxuICogQGluc3RhbmNlXG4gKlxuICogQHBhcmFtIHtCb29sZWFufSB2YWx1ZVxuICovXG5cbi8qKlxuICogQ2FsbGJhY2sgdG8gZXhlY3V0ZSB3aGVuIHRoZSB1c2VyIHRvdWNoZXMgdGhlIHNjcmVlbiBmb3IgdGhlIGZpcnN0IHRpbWUuXG4gKlxuICogQGNhbGxiYWNrXG4gKiBAbmFtZSB0b3VjaFN0YXJ0Q2FsbGJhY2tcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWJzdHJhY3RQbGF0Zm9ybVZpZXdcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcGFzc3dvcmQgLSBQYXNzd29yZCBnaXZlbiBieSB0aGUgdXNlci5cbiAqL1xuLyoqXG4gKiBDYWxsYmFjayB0byBleGVjdXRlIHdoZW4gdGhlIHVzZXIgY2xpY2tzIHRoZSBzY3JlZW4gZm9yIHRoZSBmaXJzdCB0aW1lLlxuICpcbiAqIEBjYWxsYmFja1xuICogQG5hbWUgbW91c2VEb3duQ2FsbGJhY2tcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWJzdHJhY3RQbGF0Zm9ybVZpZXdcbiAqL1xuXG5cblxuLyoqXG4gKiBTdHJ1Y3R1cmUgb2YgdGhlIGRlZmluaXRpb24gZm9yIHRoZSB0ZXN0IG9mIGEgZmVhdHVyZS5cbiAqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhdGZvcm1+ZGVmaW5pdGlvblxuICpcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBpZCAtIElkIG9mIHRoZSBkZWZpbml0aW9uLlxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gY2hlY2sgLSBBIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIHJldHVybiBgdHJ1ZWAgaWYgdGhlXG4gKiAgZmVhdHVyZSBpcyBhdmFpbGFibGUgb24gdGhlIHBsYXRmb3JtLCBgZmFsc2VgIG90aGVyd2lzZS5cbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IFtzdGFydEhvb2tdIC0gQSBmdW5jdGlvbiByZXR1cm5pbmcgYSBgUHJvbWlzZWAgdG8gYmVcbiAqICBleGVjdXRlZCBvbiBzdGFydCAoZm9yIGV4YW1wbGUgdG8gYXNrIGFjY2VzcyB0byBtaWNyb3Bob25lIG9yIGdlb2xvY2F0aW9uKS5cbiAqICBUaGUgcmV0dXJuZWQgcHJvbWlzZSBzaG91bGQgYmUgcmVzb2x2ZWQgb24gYHRydWVgIGlzIHRoZSBwcm9jZXNzIHN1Y2NlZGVkIG9yXG4gKiAgYGZhbHNlYCBpcyB0aGUgcHJlY2VzcyBmYWlsZWQgKGUuZy4gcGVybWlzc2lvbiBub3QgZ3JhbnRlZCkuXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBbaW50ZXJhY3Rpb25Ib29rXSAtIEEgZnVuY3Rpb24gcmV0dXJuaW5nIGEgUHJvbWlzZXRvIGJlXG4gKiAgZXhlY3V0ZWQgb24gdGhlIGZpcnN0IGludGVyYWN0aW9uIChpLmUuIGBjbGlja2Agb3IgYHRvdWNoc3RhcnRgKSBvZiB0aGUgdXNlclxuICogIHdpdGggYXBwbGljYXRpb24gKGZvciBleGFtcGxlLCB0byBpbml0aWFsaXplIEF1ZGlvQ29udGV4dCBvbiBpT1MgZGV2aWNlcykuXG4gKiAgVGhlIHJldHVybmVkIHByb21pc2Ugc2hvdWxkIGJlIHJlc29sdmVkIG9uIGB0cnVlYCBpcyB0aGUgcHJvY2VzcyBzdWNjZWRlZCBvclxuICogIGBmYWxzZWAgaXMgdGhlIHByZWNlc3MgZmFpbGVkIChlLmcuIHBlcm1pc3Npb24gbm90IGdyYW50ZWQpLlxuICovXG5jb25zdCBkZWZhdWx0RGVmaW5pdGlvbnMgPSBbXG4gIHtcbiAgICBpZDogJ3dlYi1hdWRpbycsXG4gICAgY2hlY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICEhYXVkaW9Db250ZXh0O1xuICAgIH0sXG4gICAgaW50ZXJhY3Rpb25Ib29rOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICghY2xpZW50LnBsYXRmb3JtLmlzTW9iaWxlKVxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuXG4gICAgICBjb25zdCBnID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgICAgIGcuY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuICAgICAgZy5nYWluLnZhbHVlID0gMC4wMDAwMDAwMDE7IC8vIC0xODBkQiA/XG5cbiAgICAgIGNvbnN0IG8gPSBhdWRpb0NvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xuICAgICAgby5jb25uZWN0KGcpO1xuICAgICAgby5mcmVxdWVuY3kudmFsdWUgPSAyMDtcbiAgICAgIG8uc3RhcnQoMCk7XG5cbiAgICAgIC8vIHByZXZlbnQgYW5kcm9pZCB0byBzdG9wIGF1ZGlvIGJ5IGtlZXBpbmcgdGhlIG9zY2lsbGF0b3IgYWN0aXZlXG4gICAgICBpZiAoY2xpZW50LnBsYXRmb3JtLm9zICE9PSAnYW5kcm9pZCcpXG4gICAgICAgIG8uc3RvcChhdWRpb0NvbnRleHQuY3VycmVudFRpbWUgKyAwLjAxKTtcblxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICB9XG4gIH0sXG4gIHtcbiAgICAvLyBAbm90ZTogYHRvdWNoYCBmZWF0dXJlIHdvcmthcm91bmRcbiAgICAvLyBjZi4gaHR0cDovL3d3dy5zdHVjb3guY29tL2Jsb2cveW91LWNhbnQtZGV0ZWN0LWEtdG91Y2hzY3JlZW4vXG4gICAgaWQ6ICdtb2JpbGUtZGV2aWNlJyxcbiAgICBjaGVjazogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY2xpZW50LnBsYXRmb3JtLmlzTW9iaWxlO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGlkOiAnYXVkaW8taW5wdXQnLFxuICAgIGNoZWNrOiBmdW5jdGlvbigpIHtcbiAgICAgIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEgPSAoXG4gICAgICAgIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEgfHxcbiAgICAgICAgbmF2aWdhdG9yLndlYmtpdEdldFVzZXJNZWRpYSB8fFxuICAgICAgICBuYXZpZ2F0b3IubW96R2V0VXNlck1lZGlhIHx8XG4gICAgICAgIG5hdmlnYXRvci5tc0dldFVzZXJNZWRpYVxuICAgICAgKTtcblxuICAgICAgcmV0dXJuICEhbmF2aWdhdG9yLmdldFVzZXJNZWRpYTtcbiAgICB9LFxuICAgIHN0YXJ0SG9vazogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEoeyBhdWRpbzogdHJ1ZSB9LCBmdW5jdGlvbihzdHJlYW0pIHtcbiAgICAgICAgICBzdHJlYW0uZ2V0QXVkaW9UcmFja3MoKVswXS5zdG9wKCk7XG4gICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBpZDogJ2Z1bGwtc2NyZWVuJyxcbiAgICBjaGVjazogZnVuY3Rpb24oKSB7XG4gICAgICAvLyBmdW5jdGlvbm5hbGl0eSB0aGF0IGNhbm5vdCBicmFrZSB0aGUgYXBwbGljYXRpb25cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgaW50ZXJhY3Rpb25Ib29rKCkge1xuICAgICAgaWYgKHNjcmVlbmZ1bGwuZW5hYmxlZClcbiAgICAgICAgc2NyZWVuZnVsbC5yZXF1ZXN0KCk7XG5cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XG4gICAgfVxuICB9LFxuICB7XG4gICAgaWQ6ICdnZW9sb2NhdGlvbicsXG4gICAgY2hlY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICEhbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbjtcbiAgICB9LFxuICAgIHN0YXJ0SG9vazogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oKHBvc2l0aW9uKSA9PiB7XG4gICAgICAgICAgLy8gcG9wdWxhdGUgY2xpZW50IHdpdGggZmlyc3QgdmFsdWVcbiAgICAgICAgICBjb25zdCBjb29yZHMgPSBwb3NpdGlvbi5jb29yZHM7XG4gICAgICAgICAgY2xpZW50LmNvb3JkaW5hdGVzID0gW2Nvb3Jkcy5sYXRpdHVkZSwgY29vcmRzLmxvbmdpdHVkZV07XG4gICAgICAgICAgY2xpZW50Lmdlb3Bvc2l0aW9uID0gcG9zaXRpb247XG5cbiAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICB9LCAoZXJyKSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9LCB7fSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBpZDogJ2dlb2xvY2F0aW9uLW1vY2snLFxuICAgIGNoZWNrOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgc3RhcnRIb29rOiBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGxhdCA9IE1hdGgucmFuZG9tKCkgKiAzNjAgLSAxODA7XG4gICAgICBjb25zdCBsbmcgPSBNYXRoLnJhbmRvbSgpICogMTgwIC0gOTA7XG4gICAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBbbGF0LCBsbmddO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICB9XG4gIH0sXG4gIHtcbiAgICAvLyBhZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL3JpY2h0ci9Ob1NsZWVwLmpzL2Jsb2IvbWFzdGVyL05vU2xlZXAuanNcbiAgICAvLyB3YXJuaW5nOiBjYXVzZSAxNTAlIGNwdSB1c2UgaW4gY2hyb21lIGRlc2t0b3AuLi5cbiAgICBpZDogJ3dha2UtbG9jaycsXG4gICAgY2hlY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gZnVuY3Rpb25uYWxpdHkgdGhhdCBjYW5ub3QgYnJha2UgdGhlIGFwcGxpY2F0aW9uXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIGludGVyYWN0aW9uSG9vazogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoY2xpZW50LnBsYXRmb3JtLm9zID09PSAnaW9zJykge1xuICAgICAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gd2luZG93LmxvY2F0aW9uO1xuICAgICAgICAgIHNldFRpbWVvdXQod2luZG93LnN0b3AsIDApO1xuICAgICAgICB9LCAzMDAwMClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBtZWRpYXMgPSB7XG4gICAgICAgICAgd2VibTogXCJkYXRhOnZpZGVvL3dlYm07YmFzZTY0LEdrWGZvMEFnUW9hQkFVTDNnUUZDOG9FRVF2T0JDRUtDUUFSM1pXSnRRb2VCQWtLRmdRSVlVNEJuUUkwVlNhbG1RQ2dxMTdGQUF3OUNRRTJBUUFaM2FHRnRiWGxYUVVBR2QyaGhiVzE1UklsQUNFQ1BRQUFBQUFBQUZsU3VhMEF4cmtBdTE0RUJZOFdCQVp5QkFDSzFuRUFEZFc1a2hrQUZWbDlXVURnbGhvaEFBMVpRT0lPQkFlQkFCckNCQ0xxQkNCOUR0blZBSXVlQkFLTkFISUVBQUlBd0FRQ2RBU29JQUFnQUFVQW1KYVFBQTNBQS92ejBBQUE9XCIsXG4gICAgICAgICAgbXA0OiBcImRhdGE6dmlkZW8vbXA0O2Jhc2U2NCxBQUFBSEdaMGVYQnBjMjl0QUFBQ0FHbHpiMjFwYzI4eWJYQTBNUUFBQUFobWNtVmxBQUFBRzIxa1lYUUFBQUd6QUJBSEFBQUJ0aEFEQW93ZGJiOS9BQUFDNlcxdmIzWUFBQUJzYlhab1pBQUFBQUI4SmJDQWZDV3dnQUFBQStnQUFBQUFBQUVBQUFFQUFBQUFBQUFBQUFBQUFBQUJBQUFBQUFBQUFBQUFBQUFBQUFBQUFRQUFBQUFBQUFBQUFBQUFBQUFBUUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBSUFBQUlWZEhKaGF3QUFBRngwYTJoa0FBQUFEM3dsc0lCOEpiQ0FBQUFBQVFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFCQUFBQUFBQUFBQUFBQUFBQUFBQUFBUUFBQUFBQUFBQUFBQUFBQUFBQVFBQUFBQUFJQUFBQUNBQUFBQUFCc1cxa2FXRUFBQUFnYldSb1pBQUFBQUI4SmJDQWZDV3dnQUFBQStnQUFBQUFWY1FBQUFBQUFDMW9aR3h5QUFBQUFBQUFBQUIyYVdSbEFBQUFBQUFBQUFBQUFBQUFWbWxrWlc5SVlXNWtiR1Z5QUFBQUFWeHRhVzVtQUFBQUZIWnRhR1FBQUFBQkFBQUFBQUFBQUFBQUFBQWtaR2x1WmdBQUFCeGtjbVZtQUFBQUFBQUFBQUVBQUFBTWRYSnNJQUFBQUFFQUFBRWNjM1JpYkFBQUFMaHpkSE5rQUFBQUFBQUFBQUVBQUFDb2JYQTBkZ0FBQUFBQUFBQUJBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUlBQWdBU0FBQUFFZ0FBQUFBQUFBQUFRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUJqLy93QUFBRkpsYzJSekFBQUFBQU5FQUFFQUJEd2dFUUFBQUFBRERVQUFBQUFBQlMwQUFBR3dBUUFBQWJXSkV3QUFBUUFBQUFFZ0FNU05pQjlGQUVRQkZHTUFBQUd5VEdGMll6VXlMamczTGpRR0FRSUFBQUFZYzNSMGN3QUFBQUFBQUFBQkFBQUFBUUFBQUFBQUFBQWNjM1J6WXdBQUFBQUFBQUFCQUFBQUFRQUFBQUVBQUFBQkFBQUFGSE4wYzNvQUFBQUFBQUFBRXdBQUFBRUFBQUFVYzNSamJ3QUFBQUFBQUFBQkFBQUFMQUFBQUdCMVpIUmhBQUFBV0cxbGRHRUFBQUFBQUFBQUlXaGtiSElBQUFBQUFBQUFBRzFrYVhKaGNIQnNBQUFBQUFBQUFBQUFBQUFBSzJsc2MzUUFBQUFqcVhSdmJ3QUFBQnRrWVhSaEFBQUFBUUFBQUFCTVlYWm1OVEl1TnpndU13PT1cIlxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0ICR2aWRlbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJyk7XG4gICAgICAgICR2aWRlby5zZXRBdHRyaWJ1dGUoJ2xvb3AnLCAnJyk7XG5cbiAgICAgICAgZm9yIChsZXQgdHlwZSBpbiBtZWRpYXMpIHtcbiAgICAgICAgICBjb25zdCBkYXRhVVJJID0gbWVkaWFzW3R5cGVdO1xuICAgICAgICAgIGNvbnN0ICRzb3VyY2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzb3VyY2UnKTtcbiAgICAgICAgICAkc291cmNlLnNyYyA9IGRhdGFVUkk7XG4gICAgICAgICAgJHNvdXJjZS50eXBlID0gYHZpZGVvLyR7dHlwZX1gO1xuXG4gICAgICAgICAgJHZpZGVvLmFwcGVuZENoaWxkKCRzb3VyY2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgJHZpZGVvLnBsYXkoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICB9XG4gIH1cbl07XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpwbGF0Zm9ybSc7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgY2xpZW50IGAncGxhdGZvcm0nYCBzZXJ2aWNlLlxuICpcbiAqIFRoZSBgcGxhdGZvcm1gIHNlcnZpY2VzIGlzIHJlc3BvbnNpYmxlIGZvciBnaXZpbmcgZ2VuZXJhbCBpbmZvcm1hdGlvbnNcbiAqIGFib3V0IHRoZSB1c2VyJ3MgZGV2aWNlIGFzIHdlbGwgYXMgY2hlY2tpbmcgYXZhaWxhYmlsaXR5IGFuZCBwcm92aWRpbmcgaG9va3NcbiAqIGluIG9yZGVyIHRvIGluaXRpYWxpemUgdGhlIGZlYXR1cmVzIHJlcXVpcmVkIGJ5IHRoZSBhcHBsaWNhdGlvbiAoYXVkaW8sXG4gKiBtaWNyb3Bob25lLCBldGMuKS5cbiAqIElmIG9uZSBvZiB0aGUgcmVxdWlyZWQgZGVmaW5pdGlvbnMgaXMgbm90IGF2YWlsYWJsZSwgYSB2aWV3IGlzIGNyZWF0ZWQgd2l0aFxuICogYW4gZXJyb3IgbWVzc2FnZSBhbmQgYGNsaWVudC5jb21wYXRpYmxlYCBpcyBzZXQgdG8gYGZhbHNlYC5cbiAqXG4gKiBBdmFpbGFibGUgYnVpbHQtaW4gZGVmaW5pdGlvbnMgYXJlOlxuICogLSAnd2ViLWF1ZGlvJ1xuICogLSAnbW9iaWxlLWRldmljZSc6IG9ubHktYWNjZXB0IG1vYmlsZSBkZXZpY2VzIGluIHRoZSBhcHBsaWNhdGlvbiAoYmFzZWQgb25cbiAqICAgVXNlci1BZ2VudCBzbmlmZmluZylcbiAqIC0gJ2F1ZGlvLWlucHV0JzogQW5kcm9pZCBPbmx5XG4gKiAtICdmdWxsLXNjcmVlbic6IEFuZHJvaWQgT25seSwgdGhpcyBmZWF0dXJlIHdvbid0IGJsb2NrIHRoZSBhcHBsaWNhdGlvbiBpZlxuICogICBub3QgYXZhaWxhYmxlLlxuICogLSAnZ2VvbG9jYXRpb24nOiBjaGVjayBpZiB0aGUgbmF2aWdhdG9yIHN1cHBvcnRzIGdlb2xvY2F0aW9uLiBUaGUgYGNvb3JkaW5hdGVzYFxuICogICBhbmQgYGdlb3Bvc2l0aW9uYCBvZiB0aGUgYGNsaWVudGAgYXJlIHBvcHVsYXRlZCB3aGVuIHRoZSBwbGFmb3JtIHNlcnZpY2VcbiAqICAgcmVzb2x2ZXMuIChpZiBubyB1cGRhdGUgb2YgdGhlIGNvb3JkaW5hdGVzIGFyZSBuZWVkZWQgaW4gdGhlIGFwcGxpY2F0aW9uLFxuICogICByZXF1aXJpbmcgZ2VvbG9jYXRpb24gZmVhdHVyZSB3aXRob3V0IHVzaW5nIHRoZSBHZW9sb2NhdGlvbiBzZXJ2aWNlIHNob3VsZFxuICogICBzdWZmaWNlKS5cbiAqIC0gJ3dha2UtbG9jayc6IHVzZSB3aXRoIGNhdXRpb24sIGhhcyBiZWVuIG9ic2VydmVkIGNvbnN1bW1pbmdcbiAqICAgMTUwJSBjcHUgaW4gY2hyb21lIGRlc2t0b3AuXG4gKlxuICpcbiAqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmVcbiAqIGluc3RhbmNpYXRlZCBtYW51YWxseV9cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtBcnJheTxTdHJpbmc+fFN0cmluZ30gb3B0aW9ucy5mZWF0dXJlcyAtIElkKHMpIG9mIHRoZSBmZWF0dXJlKHMpXG4gKiAgcmVxdWlyZWQgYnkgdGhlIGFwcGxpY2F0aW9uLiBBdmFpbGFibGUgYnVpbGQtaW4gZmVhdHVyZXMgYXJlOlxuICogIC0gJ3dlYi1hdWRpbydcbiAqICAtICdtb2JpbGUtZGV2aWNlJzogb25seSBhY2NlcHQgbW9iaWxlIGRldmljZXMgKHJlY29nbml0aW9uIGJhc2VkIFVzZXItQWdlbnQpXG4gKiAgLSAnYXVkaW8taW5wdXQnOiBBbmRyb2lkIG9ubHlcbiAqICAtICdmdWxsLXNjcmVlbic6IEFuZHJvaWQgb25seVxuICogIC0gJ2dlb2xvY2F0aW9uJzogYWNjZXB0IGdlb2xvY2FsaXplZCBkZXZpY2VzLiBQb3B1bGF0ZSB0aGUgY2xpZW50IHdpdGhcbiAqICAgICBjdXJyZW50IHBvc2l0aW9uXG4gKiAgLSAnd2FrZS1sb2NrJzogdGhpcyBmZWF0dXJlIHNob3VsZCBiZSB1c2VkIHdpdGggY2F1dGlvbiBhc1xuICogICAgIGl0IGhhcyBiZWVuIG9ic2VydmVkIHRvIHVzZSAxNTAlIG9mIGNwdSBpbiBjaHJvbWUgZGVza3RvcC5cbiAqXG4gKiA8IS0tXG4gKiBXYXJuaW5nOiB3aGVuIHNldHRpbmcgYHNob3dEaWFsb2dgIG9wdGlvbiB0byBgZmFsc2VgLCB1bmV4cGVjdGVkIGJlaGF2aW9yc1xuICogbWlnaHQgb2NjdXIgYmVjYXVzZSBtb3N0IG9mIHRoZSBmZWF0dXJlcyByZXF1aXJlIGFuIGludGVyYWN0aW9uIG9yIGFcbiAqIGNvbmZpcm1hdGlvbiBmcm9tIHRoZSB1c2VyIGluIG9yZGVyIHRvIGJlIGluaXRpYWxpemVkIGNvcnJlY3RseS5cbiAqIC0tPlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBleGFtcGxlXG4gKiAvLyBpbnNpZGUgdGhlIGV4cGVyaWVuY2UgY29uc3RydWN0b3JcbiAqIHRoaXMucGxhdGZvcm0gPSB0aGlzLnJlcXVpcmUoJ3BsYXRmb3JtJywgeyBmZWF0dXJlczogJ3dlYi1hdWRpbycgfSk7XG4gKlxuICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LmNsaWVudCNwbGF0Zm9ybX1cbiAqL1xuY2xhc3MgUGxhdGZvcm0gZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgZmFsc2UpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBzaG93RGlhbG9nOiB0cnVlLFxuICAgICAgdmlldzogbnVsbCxcbiAgICAgIHZpZXdQcmlvcml0eTogMTAsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIHRoaXMudmlldyA9IG51bGw7XG5cbiAgICAvLyB0aGlzLl9kZWZhdWx0Vmlld1RlbXBsYXRlID0gZGVmYXVsdFZpZXdUZW1wbGF0ZTtcbiAgICAvLyB0aGlzLl9kZWZhdWx0Vmlld0NvbnRlbnQgPSBkZWZhdWx0Vmlld0NvbnRlbnQ7XG5cbiAgICB0aGlzLl9yZXF1aXJlZEZlYXR1cmVzID0gbmV3IFNldCgpO1xuICAgIHRoaXMuX2ZlYXR1cmVEZWZpbml0aW9ucyA9IHt9O1xuXG4gICAgZGVmYXVsdERlZmluaXRpb25zLmZvckVhY2goKGRlZikgPT4gdGhpcy5hZGRGZWF0dXJlRGVmaW5pdGlvbihkZWYpKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBjb25maWd1cmUob3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zLmZlYXR1cmVzKSB7XG4gICAgICBsZXQgZmVhdHVyZXMgPSBvcHRpb25zLmZlYXR1cmVzO1xuXG4gICAgICBpZiAodHlwZW9mIGZlYXR1cmVzID09PSAnc3RyaW5nJylcbiAgICAgICAgZmVhdHVyZXMgPSBbZmVhdHVyZXNdO1xuXG4gICAgICB0aGlzLnJlcXVpcmVGZWF0dXJlKC4uLmZlYXR1cmVzKTtcbiAgICAgIGRlbGV0ZSBvcHRpb25zLmZlYXR1cmVzO1xuICAgIH1cblxuICAgIHN1cGVyLmNvbmZpZ3VyZShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgU3RhcnQgdGhlIGNsaWVudC5cbiAgICogIEFsZ29yaXRobTpcbiAgICogIC0gY2hlY2sgcmVxdWlyZWQgZmVhdHVyZXNcbiAgICogIC0gaWYgKGZhbHNlKVxuICAgKiAgICAgc2hvdyAnc29ycnknIHNjcmVlblxuICAgKiAgLSBlbHNlXG4gICAqICAgICBzaG93ICd3ZWxjb21lJyBzY3JlZW5cbiAgICogICAgIGV4ZWN1dGUgc3RhcnQgaG9vayAocHJvbWlzZSlcbiAgICogICAgIC0gaWYgKHByb21pc2UgPT09IHRydWUpXG4gICAqICAgICAgICBzaG93IHRvdWNoIHRvIHN0YXJ0XG4gICAqICAgICAgICBiaW5kIGV2ZW50c1xuICAgKiAgICAgLSBlbHNlXG4gICAqICAgICAgICBzaG93ICdzb3JyeScgc2NyZWVuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgdGhpcy5fZGVmaW5lQXVkaW9GaWxlRXh0ZW50aW9uKCk7XG4gICAgdGhpcy5fZGVmaW5lUGxhdGZvcm0oKTtcblxuICAgIC8vIHJlc29sdmUgcmVxdWlyZWQgZmVhdHVyZXMgZnJvbSB0aGUgYXBwbGljYXRpb25cbiAgICBjbGllbnQuY29tcGF0aWJsZSA9IHRoaXMuX2NoZWNrUmVxdWlyZWRGZWF0dXJlcygpO1xuXG4gICAgLy8gZGVmYXVsdCB2aWV3IHZhbHVlc1xuICAgIHRoaXMudmlldy51cGRhdGVDaGVja2luZ1N0YXR1cyhmYWxzZSk7XG4gICAgdGhpcy52aWV3LnVwZGF0ZUlzQ29tcGF0aWJsZVN0YXR1cyhudWxsKTtcbiAgICB0aGlzLnZpZXcudXBkYXRlSGFzQXV0aG9yaXphdGlvbnNTdGF0dXMobnVsbCk7XG5cbiAgICBpZiAoIWNsaWVudC5jb21wYXRpYmxlKSB7XG4gICAgICB0aGlzLnZpZXcudXBkYXRlSXNDb21wYXRpYmxlU3RhdHVzKGZhbHNlKTtcbiAgICAgIHRoaXMuc2hvdygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnZpZXcudXBkYXRlSXNDb21wYXRpYmxlU3RhdHVzKHRydWUpO1xuICAgICAgdGhpcy52aWV3LnVwZGF0ZUNoZWNraW5nU3RhdHVzKHRydWUpO1xuICAgICAgdGhpcy5zaG93KCk7XG5cbiAgICAgIC8vIGV4ZWN1dGUgc3RhcnQgaG9va1xuICAgICAgY29uc3Qgc3RhcnRIb29rcyA9IHRoaXMuX2dldEhvb2tzKCdzdGFydEhvb2snKTtcbiAgICAgIGNvbnN0IHN0YXJ0UHJvbWlzZXMgPSBzdGFydEhvb2tzLm1hcChob29rID0+IGhvb2soKSk7XG5cbiAgICAgIFByb21pc2UuYWxsKHN0YXJ0UHJvbWlzZXMpLnRoZW4oKHJlc3VsdHMpID0+IHtcbiAgICAgICAgLy8gaWYgb25lIG9mIHRoZSBzdGFydCBob29rIGZhaWxlZFxuICAgICAgICBsZXQgaGFzQXV0aG9yaXphdGlvbnMgPSB0cnVlO1xuICAgICAgICByZXN1bHRzLmZvckVhY2goKHN1Y2Nlc3MpID0+IGhhc0F1dGhvcml6YXRpb25zID0gaGFzQXV0aG9yaXphdGlvbnMgJiYgc3VjY2Vzcyk7XG5cbiAgICAgICAgdGhpcy52aWV3LnVwZGF0ZUhhc0F1dGhvcml6YXRpb25zU3RhdHVzKGhhc0F1dGhvcml6YXRpb25zKTtcbiAgICAgICAgdGhpcy52aWV3LnVwZGF0ZUNoZWNraW5nU3RhdHVzKGZhbHNlKTtcblxuICAgICAgICBpZiAoaGFzQXV0aG9yaXphdGlvbnMpIHtcbiAgICAgICAgICB0aGlzLnZpZXcuc2V0VG91Y2hTdGFydENhbGxiYWNrKHRoaXMuX29uSW50ZXJhY3Rpb24oJ3RvdWNoJykpO1xuICAgICAgICAgIHRoaXMudmlldy5zZXRNb3VzZURvd25DYWxsYmFjayh0aGlzLl9vbkludGVyYWN0aW9uKCdtb3VzZScpKTtcbiAgICAgICAgfVxuICAgICAgfSkuY2F0Y2goKGVycikgPT4gY29uc29sZS5lcnJvcihlcnIuc3RhY2spKTtcbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RvcCgpIHtcbiAgICB0aGlzLmhpZGUoKTtcbiAgICBzdXBlci5zdG9wKCk7XG4gIH1cblxuICAvKipcbiAgICogU3RydWN0dXJlIG9mIHRoZSBkZWZpbml0aW9uIGZvciB0aGUgdGVzdCBvZiBhIGZlYXR1cmUuXG4gICAqXG4gICAqIEBwYXJhbSB7bW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYXRmb3JtfmRlZmluaXRpb259IG9iaiAtIERlZmluaXRpb24gb2ZcbiAqXG4gICAqICB0aGUgZmVhdHVyZS5cbiAgICovXG4gIGFkZEZlYXR1cmVEZWZpbml0aW9uKG9iaikge1xuICAgIHRoaXMuX2ZlYXR1cmVEZWZpbml0aW9uc1tvYmouaWRdID0gb2JqO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcXVpcmUgZmVhdHVyZXMgZm9yIHRoZSBhcHBsaWNhdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHsuLi5TdHJpbmd9IGZlYXR1cmVzIC0gSWQocykgb2YgdGhlIGZlYXR1cmUocykgdG8gYmUgcmVxdWlyZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXF1aXJlRmVhdHVyZSguLi5mZWF0dXJlcykge1xuICAgIGZlYXR1cmVzLmZvckVhY2goKGlkKSA9PiB0aGlzLl9yZXF1aXJlZEZlYXR1cmVzLmFkZChpZCkpO1xuICB9XG5cblxuICAvKipcbiAgICogRXhlY3V0ZSBgaW50ZXJhY3Rpb25zYCBob29rcyBmcm9tIHRoZSBgcGxhdGZvcm1gIHNlcnZpY2UuXG4gICAqIEFsc28gYWN0aXZhdGUgdGhlIG1lZGlhIGFjY29yZGluZyB0byB0aGUgYG9wdGlvbnNgLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX29uSW50ZXJhY3Rpb24odHlwZSkge1xuICAgIHJldHVybiAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgY2xpZW50LnBsYXRmb3JtLmludGVyYWN0aW9uID0gdHlwZTtcbiAgICAgIC8vIGV4ZWN1dGUgaW50ZXJhY3Rpb24gaG9va3MgZnJvbSB0aGUgcGxhdGZvcm1cbiAgICAgIGNvbnN0IGludGVyYWN0aW9uSG9va3MgPSB0aGlzLl9nZXRIb29rcygnaW50ZXJhY3Rpb25Ib29rJyk7XG4gICAgICBjb25zdCBpbnRlcmFjdGlvblByb21pc2VzID0gaW50ZXJhY3Rpb25Ib29rcy5tYXAoKGhvb2spID0+IGhvb2soKSk7XG5cbiAgICAgIFByb21pc2UuYWxsKGludGVyYWN0aW9uUHJvbWlzZXMpLnRoZW4oKHJlc3VsdHMpID0+IHtcbiAgICAgICAgbGV0IHJlc29sdmVkID0gdHJ1ZTtcbiAgICAgICAgcmVzdWx0cy5mb3JFYWNoKChib29sKSA9PiByZXNvbHZlZCA9IHJlc29sdmVkICYmIGJvb2wpO1xuXG4gICAgICAgIGlmIChyZXNvbHZlZCkge1xuICAgICAgICAgIHRoaXMucmVhZHkoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnZpZXcudXBkYXRlSGFzQXV0aG9yaXphdGlvbnNTdGF0dXMocmVzb2x2ZWQpO1xuICAgICAgICB9XG4gICAgICB9KS5jYXRjaCgoZXJyKSA9PiBjb25zb2xlLmVycm9yKGVyci5zdGFjaykpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlIGFsbCBgY2hlY2tgIGZ1bmN0aW9ucyBkZWZpbmVkIGluIHRoZSByZXF1aXJlZCBmZWF0dXJlcy5cbiAgICpcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gLSBgdHJ1ZWAgaWYgYWxsIGNoZWNrcyBwYXNzLCBgZmFsc2VgIG90aGVyd2lzZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9jaGVja1JlcXVpcmVkRmVhdHVyZXMoKSB7XG4gICAgbGV0IHJlc3VsdCA9IHRydWU7XG5cbiAgICB0aGlzLl9yZXF1aXJlZEZlYXR1cmVzLmZvckVhY2goKGZlYXR1cmUpID0+IHtcbiAgICAgIGNvbnN0IGNoZWNrRnVuY3Rpb24gPSB0aGlzLl9mZWF0dXJlRGVmaW5pdGlvbnNbZmVhdHVyZV0uY2hlY2s7XG5cbiAgICAgIGlmICghKHR5cGVvZiBjaGVja0Z1bmN0aW9uID09PSAnZnVuY3Rpb24nKSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBjaGVjayBmdW5jdGlvbiBkZWZpbmVkIGZvciAke2ZlYXR1cmV9IGZlYXR1cmVgKTtcblxuICAgICAgcmVzdWx0ID0gcmVzdWx0ICYmIGNoZWNrRnVuY3Rpb24oKTtcbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX2dldEhvb2tzKHR5cGUpIHtcbiAgICBjb25zdCBob29rcyA9IFtdO1xuXG4gICAgdGhpcy5fcmVxdWlyZWRGZWF0dXJlcy5mb3JFYWNoKChmZWF0dXJlKSA9PiB7XG4gICAgICBjb25zdCBob29rID0gdGhpcy5fZmVhdHVyZURlZmluaXRpb25zW2ZlYXR1cmVdW3R5cGVdO1xuXG4gICAgICBpZiAoaG9vaylcbiAgICAgICAgaG9va3MucHVzaChob29rKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBob29rcztcbiAgfVxuXG4gIC8qKlxuICAgKiBQb3B1bGF0ZSBgY2xpZW50LnBsYXRmb3JtYCB3aXRoIHRoZSBwcmVmZXJlZCBhdWRpbyBmaWxlIGV4dGVudGlvblxuICAgKiBmb3IgdGhlIHBsYXRmb3JtLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2RlZmluZUF1ZGlvRmlsZUV4dGVudGlvbigpIHtcbiAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYXVkaW8nKTtcbiAgICAvLyBodHRwOi8vZGl2ZWludG9odG1sNS5pbmZvL2V2ZXJ5dGhpbmcuaHRtbFxuICAgIGlmICghIShhLmNhblBsYXlUeXBlICYmIGEuY2FuUGxheVR5cGUoJ2F1ZGlvL21wZWc7JykpKVxuICAgICAgY2xpZW50LnBsYXRmb3JtLmF1ZGlvRmlsZUV4dCA9ICcubXAzJztcbiAgICBlbHNlIGlmICghIShhLmNhblBsYXlUeXBlICYmIGEuY2FuUGxheVR5cGUoJ2F1ZGlvL29nZzsgY29kZWNzPVwidm9yYmlzXCInKSkpXG4gICAgICBjbGllbnQucGxhdGZvcm0uYXVkaW9GaWxlRXh0ID0gJy5vZ2cnO1xuICAgIGVsc2VcbiAgICAgIGNsaWVudC5wbGF0Zm9ybS5hdWRpb0ZpbGVFeHQgPSAnLndhdic7XG4gIH1cblxuICAvKipcbiAgICogUG9wdWxhdGUgYGNsaWVudC5wbGF0Zm9ybWAgd2l0aCB0aGUgb3MgbmFtZS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9kZWZpbmVQbGF0Zm9ybSgpIHtcbiAgICBjb25zdCB1YSA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50XG4gICAgY29uc3QgbWQgPSBuZXcgTW9iaWxlRGV0ZWN0KHVhKTtcblxuICAgIGNsaWVudC5wbGF0Zm9ybS5pc01vYmlsZSA9IChtZC5tb2JpbGUoKSAhPT0gbnVsbCk7IC8vIHRydWUgaWYgcGhvbmUgb3IgdGFibGV0XG4gICAgY2xpZW50LnBsYXRmb3JtLm9zID0gKGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3Qgb3MgPSBtZC5vcygpO1xuXG4gICAgICBpZiAob3MgPT09ICdBbmRyb2lkT1MnKVxuICAgICAgICByZXR1cm4gJ2FuZHJvaWQnO1xuICAgICAgZWxzZSBpZiAob3MgPT09ICdpT1MnKVxuICAgICAgICByZXR1cm4gJ2lvcyc7XG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiAnb3RoZXInO1xuICAgIH0pKCk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgUGxhdGZvcm0pO1xuXG5leHBvcnQgZGVmYXVsdCBQbGF0Zm9ybTtcbiJdfQ==