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

var _NoSleep = require('nosleep.js/dist/NoSleep.min');

var _NoSleep2 = _interopRequireDefault(_NoSleep);

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
    return _wavesAudio.audioContext.resume().then(function () {
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
    });
  }
}, {
  id: 'fix-ios-samplerate',
  check: function check() {
    return true;
  },
  interactionHook: function interactionHook() {
    if (_client2.default.platform.os === 'ios') {
      // in ipod, when the problem occurs, sampleRate has been observed
      // to be set at 16000Hz, as no exhaustive testing has been done
      // assume < 40000 is a bad value.
      var localStorageKey = 'soundworks:fix-ios-samplerate';

      if (_wavesAudio.audioContext.sampleRate < 40000) {
        window.localStorage.setItem(localStorageKey, true);
        window.location.reload(true);
        return;
      }

      var hasReloaded = !!window.localStorage.getItem(localStorageKey);

      if (hasReloaded) {
        window.localStorage.removeItem(localStorageKey);
        _client2.default.platform.hasReloaded = true;
      }
    }

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
    // @todo - use new navigator.mediaDevices if available
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
    var noSleep = new _NoSleep2.default();
    noSleep.enable();

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
 * @param {Boolean} [options.showDialog=true] - If set to `false`, the service
 *  execute all hooks without waiting for a user interaction and doesn't show
 *  the service's view. This option should only be used on controlled
 *  environnements where the target platform is known for working without
 *  this need (e.g. is not iOS).
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

        if (features.indexOf('web-audio') !== -1) features.push('fix-ios-samplerate');

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

      // handle `showDialog === false`
      if (this.options.showDialog === false) {
        if (_client2.default.compatible) {
          var startPromises = this._getHooks('startHook');
          var interactionPromises = this._getHooks('interactionHook');
          var promises = [].concat(startPromises, interactionPromises);

          _promise2.default.all(promises).then(function (results) {
            var resolved = true;
            results.forEach(function (bool) {
              return resolved = resolved && bool;
            });

            if (resolved) _this2.ready();else throw new Error('service:platform - didn\'t obtain the necessary authorizations');
          });
        } else {
          throw new Error('service:platform - client not compatible');
        }
      } else {
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
          var _startPromises = this._getHooks('startHook');

          _promise2.default.all(_startPromises).then(function (results) {
            // if one of the start hook failed
            var hasAuthorizations = true;
            results.forEach(function (success) {
              return hasAuthorizations = hasAuthorizations && success;
            });

            _this2.view.updateHasAuthorizationsStatus(hasAuthorizations);
            _this2.view.updateCheckingStatus(false);

            if (hasAuthorizations) {
              // move to 'touchend' and 'mouseup' because 'touchstart' is no
              // longer recognized as a user gesture in android
              // @todo - define what to do with the template...
              // cf. https://docs.google.com/document/d/1oF1T3O7_E4t1PYHV6gyCwHxOi3ystm0eSL5xZu7nvOg/edit#heading=h.qq59ev3u8fba
              _this2.view.$el.addEventListener('touchend', _this2._onInteraction('touch'));
              _this2.view.$el.addEventListener('mouseup', _this2._onInteraction('mouse'));
              // this.view.setTouchStartCallback(this._onInteraction('touch'));
              // this.view.setMouseDownCallback(this._onInteraction('mouse'));
            }
          }).catch(function (err) {
            return console.error(err.stack);
          });
        }
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

        var noSleep = new _NoSleep2.default();
        noSleep.enable();

        _client2.default.platform.interaction = type;
        // execute interaction hooks from the platform
        var interactionPromises = _this4._getHooks('interactionHook');

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

      // return an array of Promises instead of function
      return hooks.map(function (hook) {
        return hook();
      });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYXRmb3JtLmpzIl0sIm5hbWVzIjpbImRlZmF1bHREZWZpbml0aW9ucyIsImlkIiwiY2hlY2siLCJpbnRlcmFjdGlvbkhvb2siLCJyZXN1bWUiLCJ0aGVuIiwicGxhdGZvcm0iLCJpc01vYmlsZSIsInJlc29sdmUiLCJnIiwiY3JlYXRlR2FpbiIsImNvbm5lY3QiLCJkZXN0aW5hdGlvbiIsImdhaW4iLCJ2YWx1ZSIsIm8iLCJjcmVhdGVPc2NpbGxhdG9yIiwiZnJlcXVlbmN5Iiwic3RhcnQiLCJvcyIsInN0b3AiLCJjdXJyZW50VGltZSIsImxvY2FsU3RvcmFnZUtleSIsInNhbXBsZVJhdGUiLCJ3aW5kb3ciLCJsb2NhbFN0b3JhZ2UiLCJzZXRJdGVtIiwibG9jYXRpb24iLCJyZWxvYWQiLCJoYXNSZWxvYWRlZCIsImdldEl0ZW0iLCJyZW1vdmVJdGVtIiwibmF2aWdhdG9yIiwiZ2V0VXNlck1lZGlhIiwid2Via2l0R2V0VXNlck1lZGlhIiwibW96R2V0VXNlck1lZGlhIiwibXNHZXRVc2VyTWVkaWEiLCJzdGFydEhvb2siLCJyZWplY3QiLCJhdWRpbyIsInN0cmVhbSIsImdldEF1ZGlvVHJhY2tzIiwiZXJyIiwiZW5hYmxlZCIsInJlcXVlc3QiLCJnZW9sb2NhdGlvbiIsImdldEN1cnJlbnRQb3NpdGlvbiIsInBvc2l0aW9uIiwiY29vcmRzIiwiY29vcmRpbmF0ZXMiLCJsYXRpdHVkZSIsImxvbmdpdHVkZSIsImdlb3Bvc2l0aW9uIiwibGF0IiwiTWF0aCIsInJhbmRvbSIsImxuZyIsIm5vU2xlZXAiLCJlbmFibGUiLCJTRVJWSUNFX0lEIiwiUGxhdGZvcm0iLCJkZWZhdWx0cyIsInNob3dEaWFsb2ciLCJ2aWV3Iiwidmlld1ByaW9yaXR5IiwiY29uZmlndXJlIiwiX3JlcXVpcmVkRmVhdHVyZXMiLCJfZmVhdHVyZURlZmluaXRpb25zIiwiZm9yRWFjaCIsImRlZiIsImFkZEZlYXR1cmVEZWZpbml0aW9uIiwib3B0aW9ucyIsImZlYXR1cmVzIiwiaW5kZXhPZiIsInB1c2giLCJyZXF1aXJlRmVhdHVyZSIsIl9kZWZpbmVBdWRpb0ZpbGVFeHRlbnRpb24iLCJfZGVmaW5lUGxhdGZvcm0iLCJjb21wYXRpYmxlIiwiX2NoZWNrUmVxdWlyZWRGZWF0dXJlcyIsInN0YXJ0UHJvbWlzZXMiLCJfZ2V0SG9va3MiLCJpbnRlcmFjdGlvblByb21pc2VzIiwicHJvbWlzZXMiLCJjb25jYXQiLCJhbGwiLCJyZXNvbHZlZCIsInJlc3VsdHMiLCJib29sIiwicmVhZHkiLCJFcnJvciIsInVwZGF0ZUNoZWNraW5nU3RhdHVzIiwidXBkYXRlSXNDb21wYXRpYmxlU3RhdHVzIiwidXBkYXRlSGFzQXV0aG9yaXphdGlvbnNTdGF0dXMiLCJzaG93IiwiaGFzQXV0aG9yaXphdGlvbnMiLCJzdWNjZXNzIiwiJGVsIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vbkludGVyYWN0aW9uIiwiY2F0Y2giLCJjb25zb2xlIiwiZXJyb3IiLCJzdGFjayIsImhpZGUiLCJvYmoiLCJhZGQiLCJ0eXBlIiwiZSIsInByZXZlbnREZWZhdWx0Iiwic3RvcFByb3BhZ2F0aW9uIiwiaW50ZXJhY3Rpb24iLCJyZXN1bHQiLCJjaGVja0Z1bmN0aW9uIiwiZmVhdHVyZSIsImhvb2tzIiwiaG9vayIsIm1hcCIsImEiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJjYW5QbGF5VHlwZSIsImF1ZGlvRmlsZUV4dCIsInVhIiwidXNlckFnZW50IiwibWQiLCJtb2JpbGUiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQTs7Ozs7Ozs7QUFRQTs7Ozs7Ozs7Ozs7O0FBWUE7Ozs7Ozs7Ozs7OztBQVlBOzs7Ozs7Ozs7OztBQVdBOzs7Ozs7Ozs7OztBQVdBOzs7Ozs7Ozs7Ozs7O0FBYUE7Ozs7Ozs7OztBQVNBOzs7Ozs7OztBQVVBOzs7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QUErQixNQUEvQixDQURHLEtBR0gsaUJBQU9wSCxRQUFQLENBQWdCb0gsWUFBaEIsR0FBK0IsTUFBL0I7QUFDSDs7QUFFRDs7Ozs7Ozs7c0NBS2tCO0FBQ2hCLFVBQU1DLEtBQUtuRyxPQUFPUSxTQUFQLENBQWlCNEYsU0FBNUI7QUFDQSxVQUFNQyxLQUFLLDJCQUFpQkYsRUFBakIsQ0FBWDs7QUFFQSx1QkFBT3JILFFBQVAsQ0FBZ0JDLFFBQWhCLEdBQTRCc0gsR0FBR0MsTUFBSCxPQUFnQixJQUE1QyxDQUpnQixDQUltQztBQUNuRCx1QkFBT3hILFFBQVAsQ0FBZ0JhLEVBQWhCLEdBQXNCLFlBQVc7QUFDL0IsWUFBTUEsS0FBSzBHLEdBQUcxRyxFQUFILEVBQVg7O0FBRUEsWUFBSUEsT0FBTyxXQUFYLEVBQ0UsT0FBTyxTQUFQLENBREYsS0FFSyxJQUFJQSxPQUFPLEtBQVgsRUFDSCxPQUFPLEtBQVAsQ0FERyxLQUdILE9BQU8sT0FBUDtBQUNILE9BVG9CLEVBQXJCO0FBVUQ7Ozs7O0FBR0gseUJBQWU0RyxRQUFmLENBQXdCcEUsVUFBeEIsRUFBb0NDLFFBQXBDOztrQkFFZUEsUSIsImZpbGUiOiJQbGF0Zm9ybS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGF1ZGlvQ29udGV4dCB9IGZyb20gJ3dhdmVzLWF1ZGlvJztcbmltcG9ydCBjbGllbnQgZnJvbSAnLi4vY29yZS9jbGllbnQnO1xuaW1wb3J0IE1vYmlsZURldGVjdCBmcm9tICdtb2JpbGUtZGV0ZWN0JztcbmltcG9ydCBOb1NsZWVwIGZyb20gJ25vc2xlZXAuanMvZGlzdC9Ob1NsZWVwLm1pbic7XG5pbXBvcnQgc2NyZWVuZnVsbCBmcm9tICdzY3JlZW5mdWxsJztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbi8qKlxuICogQVBJIG9mIGEgY29tcGxpYW50IHZpZXcgZm9yIHRoZSBgcGxhdGZvcm1gIHNlcnZpY2UuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQGludGVyZmFjZSBBYnN0cmFjdFBsYXRmb3JtVmlld1xuICogQGV4dGVuZHMgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0Vmlld1xuICogQGFic3RyYWN0XG4gKi9cbi8qKlxuICogUmVnaXN0ZXIgdGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiB0aGUgdXNlciB0b3VjaGVzIHRoZSBzY3JlZW4gZm9yIHRoZSBmaXJzdCB0aW1lLlxuICpcbiAqIEBuYW1lIHNldFRvdWNoU3RhcnRDYWxsYmFja1xuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BYnN0cmFjdFBsYXRmb3JtVmlld1xuICogQGZ1bmN0aW9uXG4gKiBAYWJzdHJhY3RcbiAqIEBpbnN0YW5jZVxuICpcbiAqIEBwYXJhbSB7dG91Y2hTdGFydENhbGxiYWNrfSBjYWxsYmFjayAtIENhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiB0aGUgdXNlclxuICogIHRvdWNoZXMgdGhlIHNjcmVlbiBmb3IgdGhlIGZpcnN0IHRpbWUuXG4gKi9cbi8qKlxuICogUmVnaXN0ZXIgdGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiB0aGUgdXNlciBjbGlja3MgdGhlIHNjcmVlbiBmb3IgdGhlIGZpcnN0IHRpbWUuXG4gKlxuICogQG5hbWUgc2V0TW91c2Vkb3duQ2FsbGJhY2tcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWJzdHJhY3RQbGF0Zm9ybVZpZXdcbiAqIEBmdW5jdGlvblxuICogQGFic3RyYWN0XG4gKiBAaW5zdGFuY2VcbiAqXG4gKiBAcGFyYW0ge21vdXNlRG93bkNhbGxiYWNrfSBjYWxsYmFjayAtIENhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiB0aGUgdXNlclxuICogIGNsaWNrcyB0aGUgc2NyZWVuIGZvciB0aGUgZmlyc3QgdGltZS5cbiAqL1xuLyoqXG4gKiBVcGRhdGUgdGhlIHZpZXcgdG8gbm90aWZ5IHRoYXQgdGhlIGNvbXBhdGliaWxpdHkgY2hlY2tzIGFyZSB0ZXJtaW5hdGVkLlxuICpcbiAqIEBuYW1lIHVwZGF0ZUNoZWNraW5nU3RhdHVzXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0UGxhdGZvcm1WaWV3XG4gKiBAZnVuY3Rpb25cbiAqIEBhYnN0cmFjdFxuICogQGluc3RhbmNlXG4gKlxuICogQHBhcmFtIHtCb29sZWFufSB2YWx1ZVxuICovXG4vKipcbiAqIFVwZGF0ZSB0aGUgdmlldyB0byBub3RpZnkgaWYgdGhlIGRldmljZSBpcyBjb21wYXRpYmxlIG9yIG5vdC5cbiAqXG4gKiBAbmFtZSB1cGRhdGVJc0NvbXBhdGlibGVTdGF0dXNcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWJzdHJhY3RQbGF0Zm9ybVZpZXdcbiAqIEBmdW5jdGlvblxuICogQGFic3RyYWN0XG4gKiBAaW5zdGFuY2VcbiAqXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHZhbHVlXG4gKi9cbi8qKlxuICogVXBkYXRlIHRoZSB2aWV3IHRvIG5vdGlmeSBpZiB0aGUgYXBwbGljYXRpb24gb2J0YWluZWQgYWxsIHRoZSBhdXRob3JpemF0aW9uc1xuICogb3Igbm90LlxuICpcbiAqIEBuYW1lIHVwZGF0ZUhhc0F1dGhvcml6YXRpb25zU3RhdHVzXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0UGxhdGZvcm1WaWV3XG4gKiBAZnVuY3Rpb25cbiAqIEBhYnN0cmFjdFxuICogQGluc3RhbmNlXG4gKlxuICogQHBhcmFtIHtCb29sZWFufSB2YWx1ZVxuICovXG5cbi8qKlxuICogQ2FsbGJhY2sgdG8gZXhlY3V0ZSB3aGVuIHRoZSB1c2VyIHRvdWNoZXMgdGhlIHNjcmVlbiBmb3IgdGhlIGZpcnN0IHRpbWUuXG4gKlxuICogQGNhbGxiYWNrXG4gKiBAbmFtZSB0b3VjaFN0YXJ0Q2FsbGJhY2tcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWJzdHJhY3RQbGF0Zm9ybVZpZXdcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcGFzc3dvcmQgLSBQYXNzd29yZCBnaXZlbiBieSB0aGUgdXNlci5cbiAqL1xuLyoqXG4gKiBDYWxsYmFjayB0byBleGVjdXRlIHdoZW4gdGhlIHVzZXIgY2xpY2tzIHRoZSBzY3JlZW4gZm9yIHRoZSBmaXJzdCB0aW1lLlxuICpcbiAqIEBjYWxsYmFja1xuICogQG5hbWUgbW91c2VEb3duQ2FsbGJhY2tcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWJzdHJhY3RQbGF0Zm9ybVZpZXdcbiAqL1xuXG5cblxuLyoqXG4gKiBTdHJ1Y3R1cmUgb2YgdGhlIGRlZmluaXRpb24gZm9yIHRoZSB0ZXN0IG9mIGEgZmVhdHVyZS5cbiAqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhdGZvcm1+ZGVmaW5pdGlvblxuICpcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBpZCAtIElkIG9mIHRoZSBkZWZpbml0aW9uLlxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gY2hlY2sgLSBBIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIHJldHVybiBgdHJ1ZWAgaWYgdGhlXG4gKiAgZmVhdHVyZSBpcyBhdmFpbGFibGUgb24gdGhlIHBsYXRmb3JtLCBgZmFsc2VgIG90aGVyd2lzZS5cbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IFtzdGFydEhvb2tdIC0gQSBmdW5jdGlvbiByZXR1cm5pbmcgYSBgUHJvbWlzZWAgdG8gYmVcbiAqICBleGVjdXRlZCBvbiBzdGFydCAoZm9yIGV4YW1wbGUgdG8gYXNrIGFjY2VzcyB0byBtaWNyb3Bob25lIG9yIGdlb2xvY2F0aW9uKS5cbiAqICBUaGUgcmV0dXJuZWQgcHJvbWlzZSBzaG91bGQgYmUgcmVzb2x2ZWQgb24gYHRydWVgIGlzIHRoZSBwcm9jZXNzIHN1Y2NlZGVkIG9yXG4gKiAgYGZhbHNlYCBpcyB0aGUgcHJlY2VzcyBmYWlsZWQgKGUuZy4gcGVybWlzc2lvbiBub3QgZ3JhbnRlZCkuXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBbaW50ZXJhY3Rpb25Ib29rXSAtIEEgZnVuY3Rpb24gcmV0dXJuaW5nIGEgUHJvbWlzZXRvIGJlXG4gKiAgZXhlY3V0ZWQgb24gdGhlIGZpcnN0IGludGVyYWN0aW9uIChpLmUuIGBjbGlja2Agb3IgYHRvdWNoc3RhcnRgKSBvZiB0aGUgdXNlclxuICogIHdpdGggYXBwbGljYXRpb24gKGZvciBleGFtcGxlLCB0byBpbml0aWFsaXplIEF1ZGlvQ29udGV4dCBvbiBpT1MgZGV2aWNlcykuXG4gKiAgVGhlIHJldHVybmVkIHByb21pc2Ugc2hvdWxkIGJlIHJlc29sdmVkIG9uIGB0cnVlYCBpcyB0aGUgcHJvY2VzcyBzdWNjZWRlZCBvclxuICogIGBmYWxzZWAgaXMgdGhlIHByZWNlc3MgZmFpbGVkIChlLmcuIHBlcm1pc3Npb24gbm90IGdyYW50ZWQpLlxuICovXG5jb25zdCBkZWZhdWx0RGVmaW5pdGlvbnMgPSBbXG4gIHtcbiAgICBpZDogJ3dlYi1hdWRpbycsXG4gICAgY2hlY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICEhYXVkaW9Db250ZXh0O1xuICAgIH0sXG4gICAgaW50ZXJhY3Rpb25Ib29rOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBhdWRpb0NvbnRleHQucmVzdW1lKCkudGhlbigoKSA9PiB7XG4gICAgICAgIGlmICghY2xpZW50LnBsYXRmb3JtLmlzTW9iaWxlKVxuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XG5cbiAgICAgICAgY29uc3QgZyA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG4gICAgICAgIGcuY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuICAgICAgICBnLmdhaW4udmFsdWUgPSAwLjAwMDAwMDAwMTsgLy8gLTE4MGRCID9cblxuICAgICAgICBjb25zdCBvID0gYXVkaW9Db250ZXh0LmNyZWF0ZU9zY2lsbGF0b3IoKTtcbiAgICAgICAgby5jb25uZWN0KGcpO1xuICAgICAgICBvLmZyZXF1ZW5jeS52YWx1ZSA9IDIwO1xuICAgICAgICBvLnN0YXJ0KDApO1xuXG4gICAgICAgIC8vIHByZXZlbnQgYW5kcm9pZCB0byBzdG9wIGF1ZGlvIGJ5IGtlZXBpbmcgdGhlIG9zY2lsbGF0b3IgYWN0aXZlXG4gICAgICAgIGlmIChjbGllbnQucGxhdGZvcm0ub3MgIT09ICdhbmRyb2lkJylcbiAgICAgICAgICBvLnN0b3AoYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lICsgMC4wMSk7XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGlkOiAnZml4LWlvcy1zYW1wbGVyYXRlJyxcbiAgICBjaGVjazogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIGludGVyYWN0aW9uSG9vazogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoY2xpZW50LnBsYXRmb3JtLm9zID09PSAnaW9zJykge1xuICAgICAgICAvLyBpbiBpcG9kLCB3aGVuIHRoZSBwcm9ibGVtIG9jY3Vycywgc2FtcGxlUmF0ZSBoYXMgYmVlbiBvYnNlcnZlZFxuICAgICAgICAvLyB0byBiZSBzZXQgYXQgMTYwMDBIeiwgYXMgbm8gZXhoYXVzdGl2ZSB0ZXN0aW5nIGhhcyBiZWVuIGRvbmVcbiAgICAgICAgLy8gYXNzdW1lIDwgNDAwMDAgaXMgYSBiYWQgdmFsdWUuXG4gICAgICAgIGNvbnN0IGxvY2FsU3RvcmFnZUtleSA9ICdzb3VuZHdvcmtzOmZpeC1pb3Mtc2FtcGxlcmF0ZSc7XG5cbiAgICAgICAgaWYgKGF1ZGlvQ29udGV4dC5zYW1wbGVSYXRlIDwgNDAwMDApIHtcbiAgICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0obG9jYWxTdG9yYWdlS2V5LCB0cnVlKTtcbiAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKHRydWUpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGhhc1JlbG9hZGVkID0gISF3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0obG9jYWxTdG9yYWdlS2V5KTtcblxuICAgICAgICBpZiAoaGFzUmVsb2FkZWQpIHtcbiAgICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0obG9jYWxTdG9yYWdlS2V5KTtcbiAgICAgICAgICBjbGllbnQucGxhdGZvcm0uaGFzUmVsb2FkZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XG4gICAgfSxcbiAgfSxcbiAge1xuICAgIC8vIEBub3RlOiBgdG91Y2hgIGZlYXR1cmUgd29ya2Fyb3VuZFxuICAgIC8vIGNmLiBodHRwOi8vd3d3LnN0dWNveC5jb20vYmxvZy95b3UtY2FudC1kZXRlY3QtYS10b3VjaHNjcmVlbi9cbiAgICBpZDogJ21vYmlsZS1kZXZpY2UnLFxuICAgIGNoZWNrOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjbGllbnQucGxhdGZvcm0uaXNNb2JpbGU7XG4gICAgfVxuICB9LFxuICB7XG4gICAgaWQ6ICdhdWRpby1pbnB1dCcsXG4gICAgY2hlY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgbmF2aWdhdG9yLmdldFVzZXJNZWRpYSA9IChcbiAgICAgICAgbmF2aWdhdG9yLmdldFVzZXJNZWRpYSB8fFxuICAgICAgICBuYXZpZ2F0b3Iud2Via2l0R2V0VXNlck1lZGlhIHx8XG4gICAgICAgIG5hdmlnYXRvci5tb3pHZXRVc2VyTWVkaWEgfHxcbiAgICAgICAgbmF2aWdhdG9yLm1zR2V0VXNlck1lZGlhXG4gICAgICApO1xuXG4gICAgICByZXR1cm4gISFuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhO1xuICAgIH0sXG4gICAgc3RhcnRIb29rOiBmdW5jdGlvbigpIHtcbiAgICAgIC8vIEB0b2RvIC0gdXNlIG5ldyBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzIGlmIGF2YWlsYWJsZVxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhKHsgYXVkaW86IHRydWUgfSwgZnVuY3Rpb24oc3RyZWFtKSB7XG4gICAgICAgICAgc3RyZWFtLmdldEF1ZGlvVHJhY2tzKClbMF0uc3RvcCgpO1xuICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9LFxuICB7XG4gICAgaWQ6ICdmdWxsLXNjcmVlbicsXG4gICAgY2hlY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gZnVuY3Rpb25uYWxpdHkgdGhhdCBjYW5ub3QgYnJha2UgdGhlIGFwcGxpY2F0aW9uXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIGludGVyYWN0aW9uSG9vaygpIHtcbiAgICAgIGlmIChzY3JlZW5mdWxsLmVuYWJsZWQpXG4gICAgICAgIHNjcmVlbmZ1bGwucmVxdWVzdCgpO1xuXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGlkOiAnZ2VvbG9jYXRpb24nLFxuICAgIGNoZWNrOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAhIW5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb247XG4gICAgfSxcbiAgICBzdGFydEhvb2s6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKChwb3NpdGlvbikgPT4ge1xuICAgICAgICAgIC8vIHBvcHVsYXRlIGNsaWVudCB3aXRoIGZpcnN0IHZhbHVlXG4gICAgICAgICAgY29uc3QgY29vcmRzID0gcG9zaXRpb24uY29vcmRzO1xuICAgICAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IFtjb29yZHMubGF0aXR1ZGUsIGNvb3Jkcy5sb25naXR1ZGVdO1xuICAgICAgICAgIGNsaWVudC5nZW9wb3NpdGlvbiA9IHBvc2l0aW9uO1xuXG4gICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgfSwgKGVycikgPT4ge1xuICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfSwge30pO1xuICAgICAgfSk7XG4gICAgfVxuICB9LFxuICB7XG4gICAgaWQ6ICdnZW9sb2NhdGlvbi1tb2NrJyxcbiAgICBjaGVjazogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIHN0YXJ0SG9vazogZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBsYXQgPSBNYXRoLnJhbmRvbSgpICogMzYwIC0gMTgwO1xuICAgICAgY29uc3QgbG5nID0gTWF0aC5yYW5kb20oKSAqIDE4MCAtIDkwO1xuICAgICAgY2xpZW50LmNvb3JkaW5hdGVzID0gW2xhdCwgbG5nXTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XG4gICAgfVxuICB9LFxuICB7XG4gICAgLy8gYWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9yaWNodHIvTm9TbGVlcC5qcy9ibG9iL21hc3Rlci9Ob1NsZWVwLmpzXG4gICAgLy8gd2FybmluZzogY2F1c2UgMTUwJSBjcHUgdXNlIGluIGNocm9tZSBkZXNrdG9wLi4uXG4gICAgaWQ6ICd3YWtlLWxvY2snLFxuICAgIGNoZWNrOiBmdW5jdGlvbigpIHtcbiAgICAgIC8vIGZ1bmN0aW9ubmFsaXR5IHRoYXQgY2Fubm90IGJyYWtlIHRoZSBhcHBsaWNhdGlvblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBpbnRlcmFjdGlvbkhvb2s6IGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3Qgbm9TbGVlcCA9IG5ldyBOb1NsZWVwKCk7XG4gICAgICBub1NsZWVwLmVuYWJsZSgpO1xuXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuICAgIH1cbiAgfVxuXTtcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOnBsYXRmb3JtJztcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBjbGllbnQgYCdwbGF0Zm9ybSdgIHNlcnZpY2UuXG4gKlxuICogVGhlIGBwbGF0Zm9ybWAgc2VydmljZXMgaXMgcmVzcG9uc2libGUgZm9yIGdpdmluZyBnZW5lcmFsIGluZm9ybWF0aW9uc1xuICogYWJvdXQgdGhlIHVzZXIncyBkZXZpY2UgYXMgd2VsbCBhcyBjaGVja2luZyBhdmFpbGFiaWxpdHkgYW5kIHByb3ZpZGluZyBob29rc1xuICogaW4gb3JkZXIgdG8gaW5pdGlhbGl6ZSB0aGUgZmVhdHVyZXMgcmVxdWlyZWQgYnkgdGhlIGFwcGxpY2F0aW9uIChhdWRpbyxcbiAqIG1pY3JvcGhvbmUsIGV0Yy4pLlxuICogSWYgb25lIG9mIHRoZSByZXF1aXJlZCBkZWZpbml0aW9ucyBpcyBub3QgYXZhaWxhYmxlLCBhIHZpZXcgaXMgY3JlYXRlZCB3aXRoXG4gKiBhbiBlcnJvciBtZXNzYWdlIGFuZCBgY2xpZW50LmNvbXBhdGlibGVgIGlzIHNldCB0byBgZmFsc2VgLlxuICpcbiAqIEF2YWlsYWJsZSBidWlsdC1pbiBkZWZpbml0aW9ucyBhcmU6XG4gKiAtICd3ZWItYXVkaW8nXG4gKiAtICdtb2JpbGUtZGV2aWNlJzogb25seS1hY2NlcHQgbW9iaWxlIGRldmljZXMgaW4gdGhlIGFwcGxpY2F0aW9uIChiYXNlZCBvblxuICogICBVc2VyLUFnZW50IHNuaWZmaW5nKVxuICogLSAnYXVkaW8taW5wdXQnOiBBbmRyb2lkIE9ubHlcbiAqIC0gJ2Z1bGwtc2NyZWVuJzogQW5kcm9pZCBPbmx5LCB0aGlzIGZlYXR1cmUgd29uJ3QgYmxvY2sgdGhlIGFwcGxpY2F0aW9uIGlmXG4gKiAgIG5vdCBhdmFpbGFibGUuXG4gKiAtICdnZW9sb2NhdGlvbic6IGNoZWNrIGlmIHRoZSBuYXZpZ2F0b3Igc3VwcG9ydHMgZ2VvbG9jYXRpb24uIFRoZSBgY29vcmRpbmF0ZXNgXG4gKiAgIGFuZCBgZ2VvcG9zaXRpb25gIG9mIHRoZSBgY2xpZW50YCBhcmUgcG9wdWxhdGVkIHdoZW4gdGhlIHBsYWZvcm0gc2VydmljZVxuICogICByZXNvbHZlcy4gKGlmIG5vIHVwZGF0ZSBvZiB0aGUgY29vcmRpbmF0ZXMgYXJlIG5lZWRlZCBpbiB0aGUgYXBwbGljYXRpb24sXG4gKiAgIHJlcXVpcmluZyBnZW9sb2NhdGlvbiBmZWF0dXJlIHdpdGhvdXQgdXNpbmcgdGhlIEdlb2xvY2F0aW9uIHNlcnZpY2Ugc2hvdWxkXG4gKiAgIHN1ZmZpY2UpLlxuICogLSAnd2FrZS1sb2NrJzogdXNlIHdpdGggY2F1dGlvbiwgaGFzIGJlZW4gb2JzZXJ2ZWQgY29uc3VtbWluZ1xuICogICAxNTAlIGNwdSBpbiBjaHJvbWUgZGVza3RvcC5cbiAqXG4gKlxuICogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZVxuICogaW5zdGFuY2lhdGVkIG1hbnVhbGx5X1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge0FycmF5PFN0cmluZz58U3RyaW5nfSBvcHRpb25zLmZlYXR1cmVzIC0gSWQocykgb2YgdGhlIGZlYXR1cmUocylcbiAqICByZXF1aXJlZCBieSB0aGUgYXBwbGljYXRpb24uIEF2YWlsYWJsZSBidWlsZC1pbiBmZWF0dXJlcyBhcmU6XG4gKiAgLSAnd2ViLWF1ZGlvJ1xuICogIC0gJ21vYmlsZS1kZXZpY2UnOiBvbmx5IGFjY2VwdCBtb2JpbGUgZGV2aWNlcyAocmVjb2duaXRpb24gYmFzZWQgVXNlci1BZ2VudClcbiAqICAtICdhdWRpby1pbnB1dCc6IEFuZHJvaWQgb25seVxuICogIC0gJ2Z1bGwtc2NyZWVuJzogQW5kcm9pZCBvbmx5XG4gKiAgLSAnZ2VvbG9jYXRpb24nOiBhY2NlcHQgZ2VvbG9jYWxpemVkIGRldmljZXMuIFBvcHVsYXRlIHRoZSBjbGllbnQgd2l0aFxuICogICAgIGN1cnJlbnQgcG9zaXRpb25cbiAqICAtICd3YWtlLWxvY2snOiB0aGlzIGZlYXR1cmUgc2hvdWxkIGJlIHVzZWQgd2l0aCBjYXV0aW9uIGFzXG4gKiAgICAgaXQgaGFzIGJlZW4gb2JzZXJ2ZWQgdG8gdXNlIDE1MCUgb2YgY3B1IGluIGNocm9tZSBkZXNrdG9wLlxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5zaG93RGlhbG9nPXRydWVdIC0gSWYgc2V0IHRvIGBmYWxzZWAsIHRoZSBzZXJ2aWNlXG4gKiAgZXhlY3V0ZSBhbGwgaG9va3Mgd2l0aG91dCB3YWl0aW5nIGZvciBhIHVzZXIgaW50ZXJhY3Rpb24gYW5kIGRvZXNuJ3Qgc2hvd1xuICogIHRoZSBzZXJ2aWNlJ3Mgdmlldy4gVGhpcyBvcHRpb24gc2hvdWxkIG9ubHkgYmUgdXNlZCBvbiBjb250cm9sbGVkXG4gKiAgZW52aXJvbm5lbWVudHMgd2hlcmUgdGhlIHRhcmdldCBwbGF0Zm9ybSBpcyBrbm93biBmb3Igd29ya2luZyB3aXRob3V0XG4gKiAgdGhpcyBuZWVkIChlLmcuIGlzIG5vdCBpT1MpLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBleGFtcGxlXG4gKiAvLyBpbnNpZGUgdGhlIGV4cGVyaWVuY2UgY29uc3RydWN0b3JcbiAqIHRoaXMucGxhdGZvcm0gPSB0aGlzLnJlcXVpcmUoJ3BsYXRmb3JtJywgeyBmZWF0dXJlczogJ3dlYi1hdWRpbycgfSk7XG4gKlxuICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LmNsaWVudCNwbGF0Zm9ybX1cbiAqL1xuY2xhc3MgUGxhdGZvcm0gZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgZmFsc2UpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBzaG93RGlhbG9nOiB0cnVlLFxuICAgICAgdmlldzogbnVsbCxcbiAgICAgIHZpZXdQcmlvcml0eTogMTAsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIHRoaXMudmlldyA9IG51bGw7XG5cbiAgICAvLyB0aGlzLl9kZWZhdWx0Vmlld1RlbXBsYXRlID0gZGVmYXVsdFZpZXdUZW1wbGF0ZTtcbiAgICAvLyB0aGlzLl9kZWZhdWx0Vmlld0NvbnRlbnQgPSBkZWZhdWx0Vmlld0NvbnRlbnQ7XG5cbiAgICB0aGlzLl9yZXF1aXJlZEZlYXR1cmVzID0gbmV3IFNldCgpO1xuICAgIHRoaXMuX2ZlYXR1cmVEZWZpbml0aW9ucyA9IHt9O1xuXG4gICAgZGVmYXVsdERlZmluaXRpb25zLmZvckVhY2goKGRlZikgPT4gdGhpcy5hZGRGZWF0dXJlRGVmaW5pdGlvbihkZWYpKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBjb25maWd1cmUob3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zLmZlYXR1cmVzKSB7XG4gICAgICBsZXQgZmVhdHVyZXMgPSBvcHRpb25zLmZlYXR1cmVzO1xuXG4gICAgICBpZiAodHlwZW9mIGZlYXR1cmVzID09PSAnc3RyaW5nJylcbiAgICAgICAgZmVhdHVyZXMgPSBbZmVhdHVyZXNdO1xuXG4gICAgICBpZiAoZmVhdHVyZXMuaW5kZXhPZignd2ViLWF1ZGlvJykgIT09IC0xKVxuICAgICAgICBmZWF0dXJlcy5wdXNoKCdmaXgtaW9zLXNhbXBsZXJhdGUnKTtcblxuICAgICAgdGhpcy5yZXF1aXJlRmVhdHVyZSguLi5mZWF0dXJlcyk7XG5cbiAgICAgIGRlbGV0ZSBvcHRpb25zLmZlYXR1cmVzO1xuICAgIH1cblxuICAgIHN1cGVyLmNvbmZpZ3VyZShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgU3RhcnQgdGhlIGNsaWVudC5cbiAgICogIEFsZ29yaXRobTpcbiAgICogIC0gY2hlY2sgcmVxdWlyZWQgZmVhdHVyZXNcbiAgICogIC0gaWYgKGZhbHNlKVxuICAgKiAgICAgc2hvdyAnc29ycnknIHNjcmVlblxuICAgKiAgLSBlbHNlXG4gICAqICAgICBzaG93ICd3ZWxjb21lJyBzY3JlZW5cbiAgICogICAgIGV4ZWN1dGUgc3RhcnQgaG9vayAocHJvbWlzZSlcbiAgICogICAgIC0gaWYgKHByb21pc2UgPT09IHRydWUpXG4gICAqICAgICAgICBzaG93IHRvdWNoIHRvIHN0YXJ0XG4gICAqICAgICAgICBiaW5kIGV2ZW50c1xuICAgKiAgICAgLSBlbHNlXG4gICAqICAgICAgICBzaG93ICdzb3JyeScgc2NyZWVuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgdGhpcy5fZGVmaW5lQXVkaW9GaWxlRXh0ZW50aW9uKCk7XG4gICAgdGhpcy5fZGVmaW5lUGxhdGZvcm0oKTtcblxuICAgIC8vIHJlc29sdmUgcmVxdWlyZWQgZmVhdHVyZXMgZnJvbSB0aGUgYXBwbGljYXRpb25cbiAgICBjbGllbnQuY29tcGF0aWJsZSA9IHRoaXMuX2NoZWNrUmVxdWlyZWRGZWF0dXJlcygpO1xuXG4gICAgLy8gaGFuZGxlIGBzaG93RGlhbG9nID09PSBmYWxzZWBcbiAgICBpZiAodGhpcy5vcHRpb25zLnNob3dEaWFsb2cgPT09IGZhbHNlKSB7XG4gICAgICBpZiAoY2xpZW50LmNvbXBhdGlibGUpIHtcbiAgICAgICAgY29uc3Qgc3RhcnRQcm9taXNlcyA9IHRoaXMuX2dldEhvb2tzKCdzdGFydEhvb2snKTtcbiAgICAgICAgY29uc3QgaW50ZXJhY3Rpb25Qcm9taXNlcyA9IHRoaXMuX2dldEhvb2tzKCdpbnRlcmFjdGlvbkhvb2snKTtcbiAgICAgICAgY29uc3QgcHJvbWlzZXMgPSBbXS5jb25jYXQoc3RhcnRQcm9taXNlcywgaW50ZXJhY3Rpb25Qcm9taXNlcyk7XG5cbiAgICAgICAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4ocmVzdWx0cyA9PiB7XG4gICAgICAgICAgbGV0IHJlc29sdmVkID0gdHJ1ZTtcbiAgICAgICAgICByZXN1bHRzLmZvckVhY2goYm9vbCA9PiByZXNvbHZlZCA9IHJlc29sdmVkICYmIGJvb2wpO1xuXG4gICAgICAgICAgaWYgKHJlc29sdmVkKVxuICAgICAgICAgICAgdGhpcy5yZWFkeSgpO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgc2VydmljZTpwbGF0Zm9ybSAtIGRpZG4ndCBvYnRhaW4gdGhlIG5lY2Vzc2FyeSBhdXRob3JpemF0aW9uc2ApO1xuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdzZXJ2aWNlOnBsYXRmb3JtIC0gY2xpZW50IG5vdCBjb21wYXRpYmxlJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGRlZmF1bHQgdmlldyB2YWx1ZXNcbiAgICAgIHRoaXMudmlldy51cGRhdGVDaGVja2luZ1N0YXR1cyhmYWxzZSk7XG4gICAgICB0aGlzLnZpZXcudXBkYXRlSXNDb21wYXRpYmxlU3RhdHVzKG51bGwpO1xuICAgICAgdGhpcy52aWV3LnVwZGF0ZUhhc0F1dGhvcml6YXRpb25zU3RhdHVzKG51bGwpO1xuXG4gICAgICBpZiAoIWNsaWVudC5jb21wYXRpYmxlKSB7XG4gICAgICAgIHRoaXMudmlldy51cGRhdGVJc0NvbXBhdGlibGVTdGF0dXMoZmFsc2UpO1xuICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudmlldy51cGRhdGVJc0NvbXBhdGlibGVTdGF0dXModHJ1ZSk7XG4gICAgICAgIHRoaXMudmlldy51cGRhdGVDaGVja2luZ1N0YXR1cyh0cnVlKTtcbiAgICAgICAgdGhpcy5zaG93KCk7XG5cbiAgICAgICAgLy8gZXhlY3V0ZSBzdGFydCBob29rXG4gICAgICAgIGNvbnN0IHN0YXJ0UHJvbWlzZXMgPSB0aGlzLl9nZXRIb29rcygnc3RhcnRIb29rJyk7XG5cbiAgICAgICAgUHJvbWlzZS5hbGwoc3RhcnRQcm9taXNlcykudGhlbihyZXN1bHRzID0+IHtcbiAgICAgICAgICAvLyBpZiBvbmUgb2YgdGhlIHN0YXJ0IGhvb2sgZmFpbGVkXG4gICAgICAgICAgbGV0IGhhc0F1dGhvcml6YXRpb25zID0gdHJ1ZTtcbiAgICAgICAgICByZXN1bHRzLmZvckVhY2goc3VjY2VzcyA9PiBoYXNBdXRob3JpemF0aW9ucyA9IGhhc0F1dGhvcml6YXRpb25zICYmIHN1Y2Nlc3MpO1xuXG4gICAgICAgICAgdGhpcy52aWV3LnVwZGF0ZUhhc0F1dGhvcml6YXRpb25zU3RhdHVzKGhhc0F1dGhvcml6YXRpb25zKTtcbiAgICAgICAgICB0aGlzLnZpZXcudXBkYXRlQ2hlY2tpbmdTdGF0dXMoZmFsc2UpO1xuXG4gICAgICAgICAgaWYgKGhhc0F1dGhvcml6YXRpb25zKSB7XG4gICAgICAgICAgICAvLyBtb3ZlIHRvICd0b3VjaGVuZCcgYW5kICdtb3VzZXVwJyBiZWNhdXNlICd0b3VjaHN0YXJ0JyBpcyBub1xuICAgICAgICAgICAgLy8gbG9uZ2VyIHJlY29nbml6ZWQgYXMgYSB1c2VyIGdlc3R1cmUgaW4gYW5kcm9pZFxuICAgICAgICAgICAgLy8gQHRvZG8gLSBkZWZpbmUgd2hhdCB0byBkbyB3aXRoIHRoZSB0ZW1wbGF0ZS4uLlxuICAgICAgICAgICAgLy8gY2YuIGh0dHBzOi8vZG9jcy5nb29nbGUuY29tL2RvY3VtZW50L2QvMW9GMVQzTzdfRTR0MVBZSFY2Z3lDd0h4T2kzeXN0bTBlU0w1eFp1N252T2cvZWRpdCNoZWFkaW5nPWgucXE1OWV2M3U4ZmJhXG4gICAgICAgICAgICB0aGlzLnZpZXcuJGVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5fb25JbnRlcmFjdGlvbigndG91Y2gnKSk7XG4gICAgICAgICAgICB0aGlzLnZpZXcuJGVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLl9vbkludGVyYWN0aW9uKCdtb3VzZScpKTtcbiAgICAgICAgICAgIC8vIHRoaXMudmlldy5zZXRUb3VjaFN0YXJ0Q2FsbGJhY2sodGhpcy5fb25JbnRlcmFjdGlvbigndG91Y2gnKSk7XG4gICAgICAgICAgICAvLyB0aGlzLnZpZXcuc2V0TW91c2VEb3duQ2FsbGJhY2sodGhpcy5fb25JbnRlcmFjdGlvbignbW91c2UnKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiBjb25zb2xlLmVycm9yKGVyci5zdGFjaykpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdG9wKCkge1xuICAgIHRoaXMuaGlkZSgpO1xuICAgIHN1cGVyLnN0b3AoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdHJ1Y3R1cmUgb2YgdGhlIGRlZmluaXRpb24gZm9yIHRoZSB0ZXN0IG9mIGEgZmVhdHVyZS5cbiAgICpcbiAgICogQHBhcmFtIHttb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhdGZvcm1+ZGVmaW5pdGlvbn0gb2JqIC0gRGVmaW5pdGlvbiBvZlxuICAgKiAgdGhlIGZlYXR1cmUuXG4gICAqL1xuICBhZGRGZWF0dXJlRGVmaW5pdGlvbihvYmopIHtcbiAgICB0aGlzLl9mZWF0dXJlRGVmaW5pdGlvbnNbb2JqLmlkXSA9IG9iajtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXF1aXJlIGZlYXR1cmVzIGZvciB0aGUgYXBwbGljYXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7Li4uU3RyaW5nfSBmZWF0dXJlcyAtIElkKHMpIG9mIHRoZSBmZWF0dXJlKHMpIHRvIGJlIHJlcXVpcmVkLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVxdWlyZUZlYXR1cmUoLi4uZmVhdHVyZXMpIHtcbiAgICBmZWF0dXJlcy5mb3JFYWNoKChpZCkgPT4gdGhpcy5fcmVxdWlyZWRGZWF0dXJlcy5hZGQoaWQpKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIEV4ZWN1dGUgYGludGVyYWN0aW9uc2AgaG9va3MgZnJvbSB0aGUgYHBsYXRmb3JtYCBzZXJ2aWNlLlxuICAgKiBBbHNvIGFjdGl2YXRlIHRoZSBtZWRpYSBhY2NvcmRpbmcgdG8gdGhlIGBvcHRpb25zYC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9vbkludGVyYWN0aW9uKHR5cGUpIHtcbiAgICByZXR1cm4gKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIGNvbnN0IG5vU2xlZXAgPSBuZXcgTm9TbGVlcCgpO1xuICAgICAgbm9TbGVlcC5lbmFibGUoKTtcblxuICAgICAgY2xpZW50LnBsYXRmb3JtLmludGVyYWN0aW9uID0gdHlwZTtcbiAgICAgIC8vIGV4ZWN1dGUgaW50ZXJhY3Rpb24gaG9va3MgZnJvbSB0aGUgcGxhdGZvcm1cbiAgICAgIGNvbnN0IGludGVyYWN0aW9uUHJvbWlzZXMgPSB0aGlzLl9nZXRIb29rcygnaW50ZXJhY3Rpb25Ib29rJyk7XG5cbiAgICAgIFByb21pc2UuYWxsKGludGVyYWN0aW9uUHJvbWlzZXMpLnRoZW4oKHJlc3VsdHMpID0+IHtcbiAgICAgICAgbGV0IHJlc29sdmVkID0gdHJ1ZTtcbiAgICAgICAgcmVzdWx0cy5mb3JFYWNoKGJvb2wgPT4gcmVzb2x2ZWQgPSByZXNvbHZlZCAmJiBib29sKTtcblxuICAgICAgICBpZiAocmVzb2x2ZWQpIHtcbiAgICAgICAgICB0aGlzLnJlYWR5KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy52aWV3LnVwZGF0ZUhhc0F1dGhvcml6YXRpb25zU3RhdHVzKHJlc29sdmVkKTtcbiAgICAgICAgfVxuICAgICAgfSkuY2F0Y2goZXJyID0+IGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGUgYWxsIGBjaGVja2AgZnVuY3Rpb25zIGRlZmluZWQgaW4gdGhlIHJlcXVpcmVkIGZlYXR1cmVzLlxuICAgKlxuICAgKiBAcmV0dXJuIHtCb29sZWFufSAtIGB0cnVlYCBpZiBhbGwgY2hlY2tzIHBhc3MsIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2NoZWNrUmVxdWlyZWRGZWF0dXJlcygpIHtcbiAgICBsZXQgcmVzdWx0ID0gdHJ1ZTtcblxuICAgIHRoaXMuX3JlcXVpcmVkRmVhdHVyZXMuZm9yRWFjaChmZWF0dXJlID0+IHtcbiAgICAgIGNvbnN0IGNoZWNrRnVuY3Rpb24gPSB0aGlzLl9mZWF0dXJlRGVmaW5pdGlvbnNbZmVhdHVyZV0uY2hlY2s7XG5cbiAgICAgIGlmICghKHR5cGVvZiBjaGVja0Z1bmN0aW9uID09PSAnZnVuY3Rpb24nKSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBjaGVjayBmdW5jdGlvbiBkZWZpbmVkIGZvciAke2ZlYXR1cmV9IGZlYXR1cmVgKTtcblxuICAgICAgcmVzdWx0ID0gcmVzdWx0ICYmIGNoZWNrRnVuY3Rpb24oKTtcbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX2dldEhvb2tzKHR5cGUpIHtcbiAgICBjb25zdCBob29rcyA9IFtdO1xuXG4gICAgdGhpcy5fcmVxdWlyZWRGZWF0dXJlcy5mb3JFYWNoKGZlYXR1cmUgPT4ge1xuICAgICAgY29uc3QgaG9vayA9IHRoaXMuX2ZlYXR1cmVEZWZpbml0aW9uc1tmZWF0dXJlXVt0eXBlXTtcblxuICAgICAgaWYgKGhvb2spXG4gICAgICAgIGhvb2tzLnB1c2goaG9vayk7XG4gICAgfSk7XG5cbiAgICAvLyByZXR1cm4gYW4gYXJyYXkgb2YgUHJvbWlzZXMgaW5zdGVhZCBvZiBmdW5jdGlvblxuICAgIHJldHVybiBob29rcy5tYXAoaG9vayA9PiBob29rKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBvcHVsYXRlIGBjbGllbnQucGxhdGZvcm1gIHdpdGggdGhlIHByZWZlcmVkIGF1ZGlvIGZpbGUgZXh0ZW50aW9uXG4gICAqIGZvciB0aGUgcGxhdGZvcm0uXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfZGVmaW5lQXVkaW9GaWxlRXh0ZW50aW9uKCkge1xuICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhdWRpbycpO1xuICAgIC8vIGh0dHA6Ly9kaXZlaW50b2h0bWw1LmluZm8vZXZlcnl0aGluZy5odG1sXG4gICAgaWYgKCEhKGEuY2FuUGxheVR5cGUgJiYgYS5jYW5QbGF5VHlwZSgnYXVkaW8vbXBlZzsnKSkpXG4gICAgICBjbGllbnQucGxhdGZvcm0uYXVkaW9GaWxlRXh0ID0gJy5tcDMnO1xuICAgIGVsc2UgaWYgKCEhKGEuY2FuUGxheVR5cGUgJiYgYS5jYW5QbGF5VHlwZSgnYXVkaW8vb2dnOyBjb2RlY3M9XCJ2b3JiaXNcIicpKSlcbiAgICAgIGNsaWVudC5wbGF0Zm9ybS5hdWRpb0ZpbGVFeHQgPSAnLm9nZyc7XG4gICAgZWxzZVxuICAgICAgY2xpZW50LnBsYXRmb3JtLmF1ZGlvRmlsZUV4dCA9ICcud2F2JztcbiAgfVxuXG4gIC8qKlxuICAgKiBQb3B1bGF0ZSBgY2xpZW50LnBsYXRmb3JtYCB3aXRoIHRoZSBvcyBuYW1lLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2RlZmluZVBsYXRmb3JtKCkge1xuICAgIGNvbnN0IHVhID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnRcbiAgICBjb25zdCBtZCA9IG5ldyBNb2JpbGVEZXRlY3QodWEpO1xuXG4gICAgY2xpZW50LnBsYXRmb3JtLmlzTW9iaWxlID0gKG1kLm1vYmlsZSgpICE9PSBudWxsKTsgLy8gdHJ1ZSBpZiBwaG9uZSBvciB0YWJsZXRcbiAgICBjbGllbnQucGxhdGZvcm0ub3MgPSAoZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBvcyA9IG1kLm9zKCk7XG5cbiAgICAgIGlmIChvcyA9PT0gJ0FuZHJvaWRPUycpXG4gICAgICAgIHJldHVybiAnYW5kcm9pZCc7XG4gICAgICBlbHNlIGlmIChvcyA9PT0gJ2lPUycpXG4gICAgICAgIHJldHVybiAnaW9zJztcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuICdvdGhlcic7XG4gICAgfSkoKTtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBQbGF0Zm9ybSk7XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXRmb3JtO1xuIl19