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

var _nosleep = require('nosleep.js');

var _nosleep2 = _interopRequireDefault(_nosleep);

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
    var noSleep = new _nosleep2.default();
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

        var noSleep = new _nosleep2.default();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYXRmb3JtLmpzIl0sIm5hbWVzIjpbImRlZmF1bHREZWZpbml0aW9ucyIsImlkIiwiY2hlY2siLCJpbnRlcmFjdGlvbkhvb2siLCJwbGF0Zm9ybSIsImlzTW9iaWxlIiwicmVzb2x2ZSIsImciLCJjcmVhdGVHYWluIiwiY29ubmVjdCIsImRlc3RpbmF0aW9uIiwiZ2FpbiIsInZhbHVlIiwibyIsImNyZWF0ZU9zY2lsbGF0b3IiLCJmcmVxdWVuY3kiLCJzdGFydCIsIm9zIiwic3RvcCIsImN1cnJlbnRUaW1lIiwibG9jYWxTdG9yYWdlS2V5Iiwic2FtcGxlUmF0ZSIsIndpbmRvdyIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJsb2NhdGlvbiIsInJlbG9hZCIsImhhc1JlbG9hZGVkIiwiZ2V0SXRlbSIsInJlbW92ZUl0ZW0iLCJuYXZpZ2F0b3IiLCJnZXRVc2VyTWVkaWEiLCJ3ZWJraXRHZXRVc2VyTWVkaWEiLCJtb3pHZXRVc2VyTWVkaWEiLCJtc0dldFVzZXJNZWRpYSIsInN0YXJ0SG9vayIsInJlamVjdCIsImF1ZGlvIiwic3RyZWFtIiwiZ2V0QXVkaW9UcmFja3MiLCJlcnIiLCJlbmFibGVkIiwicmVxdWVzdCIsImdlb2xvY2F0aW9uIiwiZ2V0Q3VycmVudFBvc2l0aW9uIiwicG9zaXRpb24iLCJjb29yZHMiLCJjb29yZGluYXRlcyIsImxhdGl0dWRlIiwibG9uZ2l0dWRlIiwiZ2VvcG9zaXRpb24iLCJsYXQiLCJNYXRoIiwicmFuZG9tIiwibG5nIiwibm9TbGVlcCIsImVuYWJsZSIsIlNFUlZJQ0VfSUQiLCJQbGF0Zm9ybSIsImRlZmF1bHRzIiwic2hvd0RpYWxvZyIsInZpZXciLCJ2aWV3UHJpb3JpdHkiLCJjb25maWd1cmUiLCJfcmVxdWlyZWRGZWF0dXJlcyIsIl9mZWF0dXJlRGVmaW5pdGlvbnMiLCJmb3JFYWNoIiwiZGVmIiwiYWRkRmVhdHVyZURlZmluaXRpb24iLCJvcHRpb25zIiwiZmVhdHVyZXMiLCJpbmRleE9mIiwicHVzaCIsInJlcXVpcmVGZWF0dXJlIiwiX2RlZmluZUF1ZGlvRmlsZUV4dGVudGlvbiIsIl9kZWZpbmVQbGF0Zm9ybSIsImNvbXBhdGlibGUiLCJfY2hlY2tSZXF1aXJlZEZlYXR1cmVzIiwic3RhcnRQcm9taXNlcyIsIl9nZXRIb29rcyIsImludGVyYWN0aW9uUHJvbWlzZXMiLCJwcm9taXNlcyIsImNvbmNhdCIsImFsbCIsInRoZW4iLCJyZXNvbHZlZCIsInJlc3VsdHMiLCJib29sIiwicmVhZHkiLCJFcnJvciIsInVwZGF0ZUNoZWNraW5nU3RhdHVzIiwidXBkYXRlSXNDb21wYXRpYmxlU3RhdHVzIiwidXBkYXRlSGFzQXV0aG9yaXphdGlvbnNTdGF0dXMiLCJzaG93IiwiaGFzQXV0aG9yaXphdGlvbnMiLCJzdWNjZXNzIiwiJGVsIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vbkludGVyYWN0aW9uIiwiY2F0Y2giLCJjb25zb2xlIiwiZXJyb3IiLCJzdGFjayIsImhpZGUiLCJvYmoiLCJhZGQiLCJ0eXBlIiwiZSIsInByZXZlbnREZWZhdWx0Iiwic3RvcFByb3BhZ2F0aW9uIiwiaW50ZXJhY3Rpb24iLCJyZXN1bHQiLCJjaGVja0Z1bmN0aW9uIiwiZmVhdHVyZSIsImhvb2tzIiwiaG9vayIsIm1hcCIsImEiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJjYW5QbGF5VHlwZSIsImF1ZGlvRmlsZUV4dCIsInVhIiwidXNlckFnZW50IiwibWQiLCJtb2JpbGUiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQTs7Ozs7Ozs7QUFRQTs7Ozs7Ozs7Ozs7O0FBWUE7Ozs7Ozs7Ozs7OztBQVlBOzs7Ozs7Ozs7OztBQVdBOzs7Ozs7Ozs7OztBQVdBOzs7Ozs7Ozs7Ozs7O0FBYUE7Ozs7Ozs7OztBQVNBOzs7Ozs7OztBQVVBOzs7Ozs7Ozs7Ozs7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c0NBS2tCO0FBQ2hCLFVBQU1DLEtBQUtwRyxPQUFPUSxTQUFQLENBQWlCNkYsU0FBNUI7QUFDQSxVQUFNQyxLQUFLLDJCQUFpQkYsRUFBakIsQ0FBWDs7QUFFQSx1QkFBT3RILFFBQVAsQ0FBZ0JDLFFBQWhCLEdBQTRCdUgsR0FBR0MsTUFBSCxPQUFnQixJQUE1QyxDQUpnQixDQUltQztBQUNuRCx1QkFBT3pILFFBQVAsQ0FBZ0JhLEVBQWhCLEdBQXNCLFlBQVc7QUFDL0IsWUFBTUEsS0FBSzJHLEdBQUczRyxFQUFILEVBQVg7O0FBRUEsWUFBSUEsT0FBTyxXQUFYLEVBQ0UsT0FBTyxTQUFQLENBREYsS0FFSyxJQUFJQSxPQUFPLEtBQVgsRUFDSCxPQUFPLEtBQVAsQ0FERyxLQUdILE9BQU8sT0FBUDtBQUNILE9BVG9CLEVBQXJCO0FBVUQ7Ozs7O0FBR0gseUJBQWU2RyxRQUFmLENBQXdCckUsVUFBeEIsRUFBb0NDLFFBQXBDOztrQkFFZUEsUSIsImZpbGUiOiJQbGF0Zm9ybS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGF1ZGlvQ29udGV4dCB9IGZyb20gJ3dhdmVzLWF1ZGlvJztcbmltcG9ydCBjbGllbnQgZnJvbSAnLi4vY29yZS9jbGllbnQnO1xuaW1wb3J0IE1vYmlsZURldGVjdCBmcm9tICdtb2JpbGUtZGV0ZWN0JztcbmltcG9ydCBOb1NsZWVwIGZyb20gJ25vc2xlZXAuanMnO1xuaW1wb3J0IHNjcmVlbmZ1bGwgZnJvbSAnc2NyZWVuZnVsbCc7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuXG4vKipcbiAqIEFQSSBvZiBhIGNvbXBsaWFudCB2aWV3IGZvciB0aGUgYHBsYXRmb3JtYCBzZXJ2aWNlLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBpbnRlcmZhY2UgQWJzdHJhY3RQbGF0Zm9ybVZpZXdcbiAqIEBleHRlbmRzIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BYnN0cmFjdFZpZXdcbiAqIEBhYnN0cmFjdFxuICovXG4vKipcbiAqIFJlZ2lzdGVyIHRoZSBjYWxsYmFjayB0byBleGVjdXRlIHdoZW4gdGhlIHVzZXIgdG91Y2hlcyB0aGUgc2NyZWVuIGZvciB0aGUgZmlyc3QgdGltZS5cbiAqXG4gKiBAbmFtZSBzZXRUb3VjaFN0YXJ0Q2FsbGJhY2tcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWJzdHJhY3RQbGF0Zm9ybVZpZXdcbiAqIEBmdW5jdGlvblxuICogQGFic3RyYWN0XG4gKiBAaW5zdGFuY2VcbiAqXG4gKiBAcGFyYW0ge3RvdWNoU3RhcnRDYWxsYmFja30gY2FsbGJhY2sgLSBDYWxsYmFjayB0byBleGVjdXRlIHdoZW4gdGhlIHVzZXJcbiAqICB0b3VjaGVzIHRoZSBzY3JlZW4gZm9yIHRoZSBmaXJzdCB0aW1lLlxuICovXG4vKipcbiAqIFJlZ2lzdGVyIHRoZSBjYWxsYmFjayB0byBleGVjdXRlIHdoZW4gdGhlIHVzZXIgY2xpY2tzIHRoZSBzY3JlZW4gZm9yIHRoZSBmaXJzdCB0aW1lLlxuICpcbiAqIEBuYW1lIHNldE1vdXNlZG93bkNhbGxiYWNrXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0UGxhdGZvcm1WaWV3XG4gKiBAZnVuY3Rpb25cbiAqIEBhYnN0cmFjdFxuICogQGluc3RhbmNlXG4gKlxuICogQHBhcmFtIHttb3VzZURvd25DYWxsYmFja30gY2FsbGJhY2sgLSBDYWxsYmFjayB0byBleGVjdXRlIHdoZW4gdGhlIHVzZXJcbiAqICBjbGlja3MgdGhlIHNjcmVlbiBmb3IgdGhlIGZpcnN0IHRpbWUuXG4gKi9cbi8qKlxuICogVXBkYXRlIHRoZSB2aWV3IHRvIG5vdGlmeSB0aGF0IHRoZSBjb21wYXRpYmlsaXR5IGNoZWNrcyBhcmUgdGVybWluYXRlZC5cbiAqXG4gKiBAbmFtZSB1cGRhdGVDaGVja2luZ1N0YXR1c1xuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BYnN0cmFjdFBsYXRmb3JtVmlld1xuICogQGZ1bmN0aW9uXG4gKiBAYWJzdHJhY3RcbiAqIEBpbnN0YW5jZVxuICpcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gdmFsdWVcbiAqL1xuLyoqXG4gKiBVcGRhdGUgdGhlIHZpZXcgdG8gbm90aWZ5IGlmIHRoZSBkZXZpY2UgaXMgY29tcGF0aWJsZSBvciBub3QuXG4gKlxuICogQG5hbWUgdXBkYXRlSXNDb21wYXRpYmxlU3RhdHVzXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0UGxhdGZvcm1WaWV3XG4gKiBAZnVuY3Rpb25cbiAqIEBhYnN0cmFjdFxuICogQGluc3RhbmNlXG4gKlxuICogQHBhcmFtIHtCb29sZWFufSB2YWx1ZVxuICovXG4vKipcbiAqIFVwZGF0ZSB0aGUgdmlldyB0byBub3RpZnkgaWYgdGhlIGFwcGxpY2F0aW9uIG9idGFpbmVkIGFsbCB0aGUgYXV0aG9yaXphdGlvbnNcbiAqIG9yIG5vdC5cbiAqXG4gKiBAbmFtZSB1cGRhdGVIYXNBdXRob3JpemF0aW9uc1N0YXR1c1xuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BYnN0cmFjdFBsYXRmb3JtVmlld1xuICogQGZ1bmN0aW9uXG4gKiBAYWJzdHJhY3RcbiAqIEBpbnN0YW5jZVxuICpcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gdmFsdWVcbiAqL1xuXG4vKipcbiAqIENhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiB0aGUgdXNlciB0b3VjaGVzIHRoZSBzY3JlZW4gZm9yIHRoZSBmaXJzdCB0aW1lLlxuICpcbiAqIEBjYWxsYmFja1xuICogQG5hbWUgdG91Y2hTdGFydENhbGxiYWNrXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0UGxhdGZvcm1WaWV3XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHBhc3N3b3JkIC0gUGFzc3dvcmQgZ2l2ZW4gYnkgdGhlIHVzZXIuXG4gKi9cbi8qKlxuICogQ2FsbGJhY2sgdG8gZXhlY3V0ZSB3aGVuIHRoZSB1c2VyIGNsaWNrcyB0aGUgc2NyZWVuIGZvciB0aGUgZmlyc3QgdGltZS5cbiAqXG4gKiBAY2FsbGJhY2tcbiAqIEBuYW1lIG1vdXNlRG93bkNhbGxiYWNrXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0UGxhdGZvcm1WaWV3XG4gKi9cblxuXG5cbi8qKlxuICogU3RydWN0dXJlIG9mIHRoZSBkZWZpbml0aW9uIGZvciB0aGUgdGVzdCBvZiBhIGZlYXR1cmUuXG4gKlxuICogQHR5cGVkZWYge09iamVjdH0gbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYXRmb3JtfmRlZmluaXRpb25cbiAqXG4gKiBAcHJvcGVydHkge1N0cmluZ30gaWQgLSBJZCBvZiB0aGUgZGVmaW5pdGlvbi5cbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGNoZWNrIC0gQSBmdW5jdGlvbiB0aGF0IHNob3VsZCByZXR1cm4gYHRydWVgIGlmIHRoZVxuICogIGZlYXR1cmUgaXMgYXZhaWxhYmxlIG9uIHRoZSBwbGF0Zm9ybSwgYGZhbHNlYCBvdGhlcndpc2UuXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBbc3RhcnRIb29rXSAtIEEgZnVuY3Rpb24gcmV0dXJuaW5nIGEgYFByb21pc2VgIHRvIGJlXG4gKiAgZXhlY3V0ZWQgb24gc3RhcnQgKGZvciBleGFtcGxlIHRvIGFzayBhY2Nlc3MgdG8gbWljcm9waG9uZSBvciBnZW9sb2NhdGlvbikuXG4gKiAgVGhlIHJldHVybmVkIHByb21pc2Ugc2hvdWxkIGJlIHJlc29sdmVkIG9uIGB0cnVlYCBpcyB0aGUgcHJvY2VzcyBzdWNjZWRlZCBvclxuICogIGBmYWxzZWAgaXMgdGhlIHByZWNlc3MgZmFpbGVkIChlLmcuIHBlcm1pc3Npb24gbm90IGdyYW50ZWQpLlxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gW2ludGVyYWN0aW9uSG9va10gLSBBIGZ1bmN0aW9uIHJldHVybmluZyBhIFByb21pc2V0byBiZVxuICogIGV4ZWN1dGVkIG9uIHRoZSBmaXJzdCBpbnRlcmFjdGlvbiAoaS5lLiBgY2xpY2tgIG9yIGB0b3VjaHN0YXJ0YCkgb2YgdGhlIHVzZXJcbiAqICB3aXRoIGFwcGxpY2F0aW9uIChmb3IgZXhhbXBsZSwgdG8gaW5pdGlhbGl6ZSBBdWRpb0NvbnRleHQgb24gaU9TIGRldmljZXMpLlxuICogIFRoZSByZXR1cm5lZCBwcm9taXNlIHNob3VsZCBiZSByZXNvbHZlZCBvbiBgdHJ1ZWAgaXMgdGhlIHByb2Nlc3Mgc3VjY2VkZWQgb3JcbiAqICBgZmFsc2VgIGlzIHRoZSBwcmVjZXNzIGZhaWxlZCAoZS5nLiBwZXJtaXNzaW9uIG5vdCBncmFudGVkKS5cbiAqL1xuY29uc3QgZGVmYXVsdERlZmluaXRpb25zID0gW1xuICB7XG4gICAgaWQ6ICd3ZWItYXVkaW8nLFxuICAgIGNoZWNrOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAhIWF1ZGlvQ29udGV4dDtcbiAgICB9LFxuICAgIGludGVyYWN0aW9uSG9vazogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIWNsaWVudC5wbGF0Zm9ybS5pc01vYmlsZSlcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcblxuICAgICAgY29uc3QgZyA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG4gICAgICBnLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcbiAgICAgIGcuZ2Fpbi52YWx1ZSA9IDAuMDAwMDAwMDAxOyAvLyAtMTgwZEIgP1xuXG4gICAgICBjb25zdCBvID0gYXVkaW9Db250ZXh0LmNyZWF0ZU9zY2lsbGF0b3IoKTtcbiAgICAgIG8uY29ubmVjdChnKTtcbiAgICAgIG8uZnJlcXVlbmN5LnZhbHVlID0gMjA7XG4gICAgICBvLnN0YXJ0KDApO1xuXG4gICAgICAvLyBwcmV2ZW50IGFuZHJvaWQgdG8gc3RvcCBhdWRpbyBieSBrZWVwaW5nIHRoZSBvc2NpbGxhdG9yIGFjdGl2ZVxuICAgICAgaWYgKGNsaWVudC5wbGF0Zm9ybS5vcyAhPT0gJ2FuZHJvaWQnKVxuICAgICAgICBvLnN0b3AoYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lICsgMC4wMSk7XG5cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XG4gICAgfVxuICB9LFxuICB7XG4gICAgaWQ6ICdmaXgtaW9zLXNhbXBsZXJhdGUnLFxuICAgIGNoZWNrOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgaW50ZXJhY3Rpb25Ib29rOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChjbGllbnQucGxhdGZvcm0ub3MgPT09ICdpb3MnKSB7XG4gICAgICAgIC8vIGluIGlwb2QsIHdoZW4gdGhlIHByb2JsZW0gb2NjdXJzLCBzYW1wbGVSYXRlIGhhcyBiZWVuIG9ic2VydmVkXG4gICAgICAgIC8vIHRvIGJlIHNldCBhdCAxNjAwMEh6LCBhcyBubyBleGhhdXN0aXZlIHRlc3RpbmcgaGFzIGJlZW4gZG9uZVxuICAgICAgICAvLyBhc3N1bWUgPCA0MDAwMCBpcyBhIGJhZCB2YWx1ZS5cbiAgICAgICAgY29uc3QgbG9jYWxTdG9yYWdlS2V5ID0gJ3NvdW5kd29ya3M6Zml4LWlvcy1zYW1wbGVyYXRlJztcblxuICAgICAgICBpZiAoYXVkaW9Db250ZXh0LnNhbXBsZVJhdGUgPCA0MDAwMCkge1xuICAgICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShsb2NhbFN0b3JhZ2VLZXksIHRydWUpO1xuICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQodHJ1ZSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaGFzUmVsb2FkZWQgPSAhIXdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShsb2NhbFN0b3JhZ2VLZXkpO1xuXG4gICAgICAgIGlmIChoYXNSZWxvYWRlZCkge1xuICAgICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShsb2NhbFN0b3JhZ2VLZXkpO1xuICAgICAgICAgIGNsaWVudC5wbGF0Zm9ybS5oYXNSZWxvYWRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICB9LFxuICB9LFxuICB7XG4gICAgLy8gQG5vdGU6IGB0b3VjaGAgZmVhdHVyZSB3b3JrYXJvdW5kXG4gICAgLy8gY2YuIGh0dHA6Ly93d3cuc3R1Y294LmNvbS9ibG9nL3lvdS1jYW50LWRldGVjdC1hLXRvdWNoc2NyZWVuL1xuICAgIGlkOiAnbW9iaWxlLWRldmljZScsXG4gICAgY2hlY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNsaWVudC5wbGF0Zm9ybS5pc01vYmlsZTtcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBpZDogJ2F1ZGlvLWlucHV0JyxcbiAgICBjaGVjazogZnVuY3Rpb24oKSB7XG4gICAgICBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhID0gKFxuICAgICAgICBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhIHx8XG4gICAgICAgIG5hdmlnYXRvci53ZWJraXRHZXRVc2VyTWVkaWEgfHxcbiAgICAgICAgbmF2aWdhdG9yLm1vekdldFVzZXJNZWRpYSB8fFxuICAgICAgICBuYXZpZ2F0b3IubXNHZXRVc2VyTWVkaWFcbiAgICAgICk7XG5cbiAgICAgIHJldHVybiAhIW5hdmlnYXRvci5nZXRVc2VyTWVkaWE7XG4gICAgfSxcbiAgICBzdGFydEhvb2s6IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gQHRvZG8gLSB1c2UgbmV3IG5hdmlnYXRvci5tZWRpYURldmljZXMgaWYgYXZhaWxhYmxlXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEoeyBhdWRpbzogdHJ1ZSB9LCBmdW5jdGlvbihzdHJlYW0pIHtcbiAgICAgICAgICBzdHJlYW0uZ2V0QXVkaW9UcmFja3MoKVswXS5zdG9wKCk7XG4gICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBpZDogJ2Z1bGwtc2NyZWVuJyxcbiAgICBjaGVjazogZnVuY3Rpb24oKSB7XG4gICAgICAvLyBmdW5jdGlvbm5hbGl0eSB0aGF0IGNhbm5vdCBicmFrZSB0aGUgYXBwbGljYXRpb25cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgaW50ZXJhY3Rpb25Ib29rKCkge1xuICAgICAgaWYgKHNjcmVlbmZ1bGwuZW5hYmxlZClcbiAgICAgICAgc2NyZWVuZnVsbC5yZXF1ZXN0KCk7XG5cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XG4gICAgfVxuICB9LFxuICB7XG4gICAgaWQ6ICdnZW9sb2NhdGlvbicsXG4gICAgY2hlY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICEhbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbjtcbiAgICB9LFxuICAgIHN0YXJ0SG9vazogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oKHBvc2l0aW9uKSA9PiB7XG4gICAgICAgICAgLy8gcG9wdWxhdGUgY2xpZW50IHdpdGggZmlyc3QgdmFsdWVcbiAgICAgICAgICBjb25zdCBjb29yZHMgPSBwb3NpdGlvbi5jb29yZHM7XG4gICAgICAgICAgY2xpZW50LmNvb3JkaW5hdGVzID0gW2Nvb3Jkcy5sYXRpdHVkZSwgY29vcmRzLmxvbmdpdHVkZV07XG4gICAgICAgICAgY2xpZW50Lmdlb3Bvc2l0aW9uID0gcG9zaXRpb247XG5cbiAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICB9LCAoZXJyKSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9LCB7fSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBpZDogJ2dlb2xvY2F0aW9uLW1vY2snLFxuICAgIGNoZWNrOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgc3RhcnRIb29rOiBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGxhdCA9IE1hdGgucmFuZG9tKCkgKiAzNjAgLSAxODA7XG4gICAgICBjb25zdCBsbmcgPSBNYXRoLnJhbmRvbSgpICogMTgwIC0gOTA7XG4gICAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBbbGF0LCBsbmddO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICB9XG4gIH0sXG4gIHtcbiAgICAvLyBhZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL3JpY2h0ci9Ob1NsZWVwLmpzL2Jsb2IvbWFzdGVyL05vU2xlZXAuanNcbiAgICAvLyB3YXJuaW5nOiBjYXVzZSAxNTAlIGNwdSB1c2UgaW4gY2hyb21lIGRlc2t0b3AuLi5cbiAgICBpZDogJ3dha2UtbG9jaycsXG4gICAgY2hlY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gZnVuY3Rpb25uYWxpdHkgdGhhdCBjYW5ub3QgYnJha2UgdGhlIGFwcGxpY2F0aW9uXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIGludGVyYWN0aW9uSG9vazogZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBub1NsZWVwID0gbmV3IE5vU2xlZXAoKTtcbiAgICAgIG5vU2xlZXAuZW5hYmxlKCk7XG5cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XG4gICAgfVxuICB9XG5dO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6cGxhdGZvcm0nO1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIGNsaWVudCBgJ3BsYXRmb3JtJ2Agc2VydmljZS5cbiAqXG4gKiBUaGUgYHBsYXRmb3JtYCBzZXJ2aWNlcyBpcyByZXNwb25zaWJsZSBmb3IgZ2l2aW5nIGdlbmVyYWwgaW5mb3JtYXRpb25zXG4gKiBhYm91dCB0aGUgdXNlcidzIGRldmljZSBhcyB3ZWxsIGFzIGNoZWNraW5nIGF2YWlsYWJpbGl0eSBhbmQgcHJvdmlkaW5nIGhvb2tzXG4gKiBpbiBvcmRlciB0byBpbml0aWFsaXplIHRoZSBmZWF0dXJlcyByZXF1aXJlZCBieSB0aGUgYXBwbGljYXRpb24gKGF1ZGlvLFxuICogbWljcm9waG9uZSwgZXRjLikuXG4gKiBJZiBvbmUgb2YgdGhlIHJlcXVpcmVkIGRlZmluaXRpb25zIGlzIG5vdCBhdmFpbGFibGUsIGEgdmlldyBpcyBjcmVhdGVkIHdpdGhcbiAqIGFuIGVycm9yIG1lc3NhZ2UgYW5kIGBjbGllbnQuY29tcGF0aWJsZWAgaXMgc2V0IHRvIGBmYWxzZWAuXG4gKlxuICogQXZhaWxhYmxlIGJ1aWx0LWluIGRlZmluaXRpb25zIGFyZTpcbiAqIC0gJ3dlYi1hdWRpbydcbiAqIC0gJ21vYmlsZS1kZXZpY2UnOiBvbmx5LWFjY2VwdCBtb2JpbGUgZGV2aWNlcyBpbiB0aGUgYXBwbGljYXRpb24gKGJhc2VkIG9uXG4gKiAgIFVzZXItQWdlbnQgc25pZmZpbmcpXG4gKiAtICdhdWRpby1pbnB1dCc6IEFuZHJvaWQgT25seVxuICogLSAnZnVsbC1zY3JlZW4nOiBBbmRyb2lkIE9ubHksIHRoaXMgZmVhdHVyZSB3b24ndCBibG9jayB0aGUgYXBwbGljYXRpb24gaWZcbiAqICAgbm90IGF2YWlsYWJsZS5cbiAqIC0gJ2dlb2xvY2F0aW9uJzogY2hlY2sgaWYgdGhlIG5hdmlnYXRvciBzdXBwb3J0cyBnZW9sb2NhdGlvbi4gVGhlIGBjb29yZGluYXRlc2BcbiAqICAgYW5kIGBnZW9wb3NpdGlvbmAgb2YgdGhlIGBjbGllbnRgIGFyZSBwb3B1bGF0ZWQgd2hlbiB0aGUgcGxhZm9ybSBzZXJ2aWNlXG4gKiAgIHJlc29sdmVzLiAoaWYgbm8gdXBkYXRlIG9mIHRoZSBjb29yZGluYXRlcyBhcmUgbmVlZGVkIGluIHRoZSBhcHBsaWNhdGlvbixcbiAqICAgcmVxdWlyaW5nIGdlb2xvY2F0aW9uIGZlYXR1cmUgd2l0aG91dCB1c2luZyB0aGUgR2VvbG9jYXRpb24gc2VydmljZSBzaG91bGRcbiAqICAgc3VmZmljZSkuXG4gKiAtICd3YWtlLWxvY2snOiB1c2Ugd2l0aCBjYXV0aW9uLCBoYXMgYmVlbiBvYnNlcnZlZCBjb25zdW1taW5nXG4gKiAgIDE1MCUgY3B1IGluIGNocm9tZSBkZXNrdG9wLlxuICpcbiAqXG4gKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlXG4gKiBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7QXJyYXk8U3RyaW5nPnxTdHJpbmd9IG9wdGlvbnMuZmVhdHVyZXMgLSBJZChzKSBvZiB0aGUgZmVhdHVyZShzKVxuICogIHJlcXVpcmVkIGJ5IHRoZSBhcHBsaWNhdGlvbi4gQXZhaWxhYmxlIGJ1aWxkLWluIGZlYXR1cmVzIGFyZTpcbiAqICAtICd3ZWItYXVkaW8nXG4gKiAgLSAnbW9iaWxlLWRldmljZSc6IG9ubHkgYWNjZXB0IG1vYmlsZSBkZXZpY2VzIChyZWNvZ25pdGlvbiBiYXNlZCBVc2VyLUFnZW50KVxuICogIC0gJ2F1ZGlvLWlucHV0JzogQW5kcm9pZCBvbmx5XG4gKiAgLSAnZnVsbC1zY3JlZW4nOiBBbmRyb2lkIG9ubHlcbiAqICAtICdnZW9sb2NhdGlvbic6IGFjY2VwdCBnZW9sb2NhbGl6ZWQgZGV2aWNlcy4gUG9wdWxhdGUgdGhlIGNsaWVudCB3aXRoXG4gKiAgICAgY3VycmVudCBwb3NpdGlvblxuICogIC0gJ3dha2UtbG9jayc6IHRoaXMgZmVhdHVyZSBzaG91bGQgYmUgdXNlZCB3aXRoIGNhdXRpb24gYXNcbiAqICAgICBpdCBoYXMgYmVlbiBvYnNlcnZlZCB0byB1c2UgMTUwJSBvZiBjcHUgaW4gY2hyb21lIGRlc2t0b3AuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnNob3dEaWFsb2c9dHJ1ZV0gLSBJZiBzZXQgdG8gYGZhbHNlYCwgdGhlIHNlcnZpY2VcbiAqICBleGVjdXRlIGFsbCBob29rcyB3aXRob3V0IHdhaXRpbmcgZm9yIGEgdXNlciBpbnRlcmFjdGlvbiBhbmQgZG9lc24ndCBzaG93XG4gKiAgdGhlIHNlcnZpY2UncyB2aWV3LiBUaGlzIG9wdGlvbiBzaG91bGQgb25seSBiZSB1c2VkIG9uIGNvbnRyb2xsZWRcbiAqICBlbnZpcm9ubmVtZW50cyB3aGVyZSB0aGUgdGFyZ2V0IHBsYXRmb3JtIGlzIGtub3duIGZvciB3b3JraW5nIHdpdGhvdXRcbiAqICB0aGlzIG5lZWQgKGUuZy4gaXMgbm90IGlPUykuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQGV4YW1wbGVcbiAqIC8vIGluc2lkZSB0aGUgZXhwZXJpZW5jZSBjb25zdHJ1Y3RvclxuICogdGhpcy5wbGF0Zm9ybSA9IHRoaXMucmVxdWlyZSgncGxhdGZvcm0nLCB7IGZlYXR1cmVzOiAnd2ViLWF1ZGlvJyB9KTtcbiAqXG4gKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuY2xpZW50I3BsYXRmb3JtfVxuICovXG5jbGFzcyBQbGF0Zm9ybSBleHRlbmRzIFNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCBmYWxzZSk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIHNob3dEaWFsb2c6IHRydWUsXG4gICAgICB2aWV3OiBudWxsLFxuICAgICAgdmlld1ByaW9yaXR5OiAxMCxcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgdGhpcy52aWV3ID0gbnVsbDtcblxuICAgIC8vIHRoaXMuX2RlZmF1bHRWaWV3VGVtcGxhdGUgPSBkZWZhdWx0Vmlld1RlbXBsYXRlO1xuICAgIC8vIHRoaXMuX2RlZmF1bHRWaWV3Q29udGVudCA9IGRlZmF1bHRWaWV3Q29udGVudDtcblxuICAgIHRoaXMuX3JlcXVpcmVkRmVhdHVyZXMgPSBuZXcgU2V0KCk7XG4gICAgdGhpcy5fZmVhdHVyZURlZmluaXRpb25zID0ge307XG5cbiAgICBkZWZhdWx0RGVmaW5pdGlvbnMuZm9yRWFjaCgoZGVmKSA9PiB0aGlzLmFkZEZlYXR1cmVEZWZpbml0aW9uKGRlZikpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGNvbmZpZ3VyZShvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMuZmVhdHVyZXMpIHtcbiAgICAgIGxldCBmZWF0dXJlcyA9IG9wdGlvbnMuZmVhdHVyZXM7XG5cbiAgICAgIGlmICh0eXBlb2YgZmVhdHVyZXMgPT09ICdzdHJpbmcnKVxuICAgICAgICBmZWF0dXJlcyA9IFtmZWF0dXJlc107XG5cbiAgICAgIGlmIChmZWF0dXJlcy5pbmRleE9mKCd3ZWItYXVkaW8nKSAhPT0gLTEpXG4gICAgICAgIGZlYXR1cmVzLnB1c2goJ2ZpeC1pb3Mtc2FtcGxlcmF0ZScpO1xuXG4gICAgICB0aGlzLnJlcXVpcmVGZWF0dXJlKC4uLmZlYXR1cmVzKTtcblxuICAgICAgZGVsZXRlIG9wdGlvbnMuZmVhdHVyZXM7XG4gICAgfVxuXG4gICAgc3VwZXIuY29uZmlndXJlKG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqICBTdGFydCB0aGUgY2xpZW50LlxuICAgKiAgQWxnb3JpdGhtOlxuICAgKiAgLSBjaGVjayByZXF1aXJlZCBmZWF0dXJlc1xuICAgKiAgLSBpZiAoZmFsc2UpXG4gICAqICAgICBzaG93ICdzb3JyeScgc2NyZWVuXG4gICAqICAtIGVsc2VcbiAgICogICAgIHNob3cgJ3dlbGNvbWUnIHNjcmVlblxuICAgKiAgICAgZXhlY3V0ZSBzdGFydCBob29rIChwcm9taXNlKVxuICAgKiAgICAgLSBpZiAocHJvbWlzZSA9PT0gdHJ1ZSlcbiAgICogICAgICAgIHNob3cgdG91Y2ggdG8gc3RhcnRcbiAgICogICAgICAgIGJpbmQgZXZlbnRzXG4gICAqICAgICAtIGVsc2VcbiAgICogICAgICAgIHNob3cgJ3NvcnJ5JyBzY3JlZW5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICB0aGlzLl9kZWZpbmVBdWRpb0ZpbGVFeHRlbnRpb24oKTtcbiAgICB0aGlzLl9kZWZpbmVQbGF0Zm9ybSgpO1xuXG4gICAgLy8gcmVzb2x2ZSByZXF1aXJlZCBmZWF0dXJlcyBmcm9tIHRoZSBhcHBsaWNhdGlvblxuICAgIGNsaWVudC5jb21wYXRpYmxlID0gdGhpcy5fY2hlY2tSZXF1aXJlZEZlYXR1cmVzKCk7XG5cbiAgICAvLyBoYW5kbGUgYHNob3dEaWFsb2cgPT09IGZhbHNlYFxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0RpYWxvZyA9PT0gZmFsc2UpIHtcbiAgICAgIGlmIChjbGllbnQuY29tcGF0aWJsZSkge1xuICAgICAgICBjb25zdCBzdGFydFByb21pc2VzID0gdGhpcy5fZ2V0SG9va3MoJ3N0YXJ0SG9vaycpO1xuICAgICAgICBjb25zdCBpbnRlcmFjdGlvblByb21pc2VzID0gdGhpcy5fZ2V0SG9va3MoJ2ludGVyYWN0aW9uSG9vaycpO1xuICAgICAgICBjb25zdCBwcm9taXNlcyA9IFtdLmNvbmNhdChzdGFydFByb21pc2VzLCBpbnRlcmFjdGlvblByb21pc2VzKTtcblxuICAgICAgICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbihyZXN1bHRzID0+IHtcbiAgICAgICAgICBsZXQgcmVzb2x2ZWQgPSB0cnVlO1xuICAgICAgICAgIHJlc3VsdHMuZm9yRWFjaChib29sID0+IHJlc29sdmVkID0gcmVzb2x2ZWQgJiYgYm9vbCk7XG5cbiAgICAgICAgICBpZiAocmVzb2x2ZWQpXG4gICAgICAgICAgICB0aGlzLnJlYWR5KCk7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBzZXJ2aWNlOnBsYXRmb3JtIC0gZGlkbid0IG9idGFpbiB0aGUgbmVjZXNzYXJ5IGF1dGhvcml6YXRpb25zYCk7XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3NlcnZpY2U6cGxhdGZvcm0gLSBjbGllbnQgbm90IGNvbXBhdGlibGUnKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gZGVmYXVsdCB2aWV3IHZhbHVlc1xuICAgICAgdGhpcy52aWV3LnVwZGF0ZUNoZWNraW5nU3RhdHVzKGZhbHNlKTtcbiAgICAgIHRoaXMudmlldy51cGRhdGVJc0NvbXBhdGlibGVTdGF0dXMobnVsbCk7XG4gICAgICB0aGlzLnZpZXcudXBkYXRlSGFzQXV0aG9yaXphdGlvbnNTdGF0dXMobnVsbCk7XG5cbiAgICAgIGlmICghY2xpZW50LmNvbXBhdGlibGUpIHtcbiAgICAgICAgdGhpcy52aWV3LnVwZGF0ZUlzQ29tcGF0aWJsZVN0YXR1cyhmYWxzZSk7XG4gICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy52aWV3LnVwZGF0ZUlzQ29tcGF0aWJsZVN0YXR1cyh0cnVlKTtcbiAgICAgICAgdGhpcy52aWV3LnVwZGF0ZUNoZWNraW5nU3RhdHVzKHRydWUpO1xuICAgICAgICB0aGlzLnNob3coKTtcblxuICAgICAgICAvLyBleGVjdXRlIHN0YXJ0IGhvb2tcbiAgICAgICAgY29uc3Qgc3RhcnRQcm9taXNlcyA9IHRoaXMuX2dldEhvb2tzKCdzdGFydEhvb2snKTtcblxuICAgICAgICBQcm9taXNlLmFsbChzdGFydFByb21pc2VzKS50aGVuKHJlc3VsdHMgPT4ge1xuICAgICAgICAgIC8vIGlmIG9uZSBvZiB0aGUgc3RhcnQgaG9vayBmYWlsZWRcbiAgICAgICAgICBsZXQgaGFzQXV0aG9yaXphdGlvbnMgPSB0cnVlO1xuICAgICAgICAgIHJlc3VsdHMuZm9yRWFjaChzdWNjZXNzID0+IGhhc0F1dGhvcml6YXRpb25zID0gaGFzQXV0aG9yaXphdGlvbnMgJiYgc3VjY2Vzcyk7XG5cbiAgICAgICAgICB0aGlzLnZpZXcudXBkYXRlSGFzQXV0aG9yaXphdGlvbnNTdGF0dXMoaGFzQXV0aG9yaXphdGlvbnMpO1xuICAgICAgICAgIHRoaXMudmlldy51cGRhdGVDaGVja2luZ1N0YXR1cyhmYWxzZSk7XG5cbiAgICAgICAgICBpZiAoaGFzQXV0aG9yaXphdGlvbnMpIHtcbiAgICAgICAgICAgIC8vIG1vdmUgdG8gJ3RvdWNoZW5kJyBhbmQgJ21vdXNldXAnIGJlY2F1c2UgJ3RvdWNoc3RhcnQnIGlzIG5vXG4gICAgICAgICAgICAvLyBsb25nZXIgcmVjb2duaXplZCBhcyBhIHVzZXIgZ2VzdHVyZSBpbiBhbmRyb2lkXG4gICAgICAgICAgICAvLyBAdG9kbyAtIGRlZmluZSB3aGF0IHRvIGRvIHdpdGggdGhlIHRlbXBsYXRlLi4uXG4gICAgICAgICAgICAvLyBjZi4gaHR0cHM6Ly9kb2NzLmdvb2dsZS5jb20vZG9jdW1lbnQvZC8xb0YxVDNPN19FNHQxUFlIVjZneUN3SHhPaTN5c3RtMGVTTDV4WnU3bnZPZy9lZGl0I2hlYWRpbmc9aC5xcTU5ZXYzdThmYmFcbiAgICAgICAgICAgIHRoaXMudmlldy4kZWwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLl9vbkludGVyYWN0aW9uKCd0b3VjaCcpKTtcbiAgICAgICAgICAgIHRoaXMudmlldy4kZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuX29uSW50ZXJhY3Rpb24oJ21vdXNlJykpO1xuICAgICAgICAgICAgLy8gdGhpcy52aWV3LnNldFRvdWNoU3RhcnRDYWxsYmFjayh0aGlzLl9vbkludGVyYWN0aW9uKCd0b3VjaCcpKTtcbiAgICAgICAgICAgIC8vIHRoaXMudmlldy5zZXRNb3VzZURvd25DYWxsYmFjayh0aGlzLl9vbkludGVyYWN0aW9uKCdtb3VzZScpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmNhdGNoKChlcnIpID0+IGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5oaWRlKCk7XG4gICAgc3VwZXIuc3RvcCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0cnVjdHVyZSBvZiB0aGUgZGVmaW5pdGlvbiBmb3IgdGhlIHRlc3Qgb2YgYSBmZWF0dXJlLlxuICAgKlxuICAgKiBAcGFyYW0ge21vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGF0Zm9ybX5kZWZpbml0aW9ufSBvYmogLSBEZWZpbml0aW9uIG9mXG4gICAqICB0aGUgZmVhdHVyZS5cbiAgICovXG4gIGFkZEZlYXR1cmVEZWZpbml0aW9uKG9iaikge1xuICAgIHRoaXMuX2ZlYXR1cmVEZWZpbml0aW9uc1tvYmouaWRdID0gb2JqO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcXVpcmUgZmVhdHVyZXMgZm9yIHRoZSBhcHBsaWNhdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHsuLi5TdHJpbmd9IGZlYXR1cmVzIC0gSWQocykgb2YgdGhlIGZlYXR1cmUocykgdG8gYmUgcmVxdWlyZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXF1aXJlRmVhdHVyZSguLi5mZWF0dXJlcykge1xuICAgIGZlYXR1cmVzLmZvckVhY2goKGlkKSA9PiB0aGlzLl9yZXF1aXJlZEZlYXR1cmVzLmFkZChpZCkpO1xuICB9XG5cblxuICAvKipcbiAgICogRXhlY3V0ZSBgaW50ZXJhY3Rpb25zYCBob29rcyBmcm9tIHRoZSBgcGxhdGZvcm1gIHNlcnZpY2UuXG4gICAqIEFsc28gYWN0aXZhdGUgdGhlIG1lZGlhIGFjY29yZGluZyB0byB0aGUgYG9wdGlvbnNgLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX29uSW50ZXJhY3Rpb24odHlwZSkge1xuICAgIHJldHVybiAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgY29uc3Qgbm9TbGVlcCA9IG5ldyBOb1NsZWVwKCk7XG4gICAgICBub1NsZWVwLmVuYWJsZSgpO1xuXG4gICAgICBjbGllbnQucGxhdGZvcm0uaW50ZXJhY3Rpb24gPSB0eXBlO1xuICAgICAgLy8gZXhlY3V0ZSBpbnRlcmFjdGlvbiBob29rcyBmcm9tIHRoZSBwbGF0Zm9ybVxuICAgICAgY29uc3QgaW50ZXJhY3Rpb25Qcm9taXNlcyA9IHRoaXMuX2dldEhvb2tzKCdpbnRlcmFjdGlvbkhvb2snKTtcblxuICAgICAgUHJvbWlzZS5hbGwoaW50ZXJhY3Rpb25Qcm9taXNlcykudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICBsZXQgcmVzb2x2ZWQgPSB0cnVlO1xuICAgICAgICByZXN1bHRzLmZvckVhY2goYm9vbCA9PiByZXNvbHZlZCA9IHJlc29sdmVkICYmIGJvb2wpO1xuXG4gICAgICAgIGlmIChyZXNvbHZlZCkge1xuICAgICAgICAgIHRoaXMucmVhZHkoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnZpZXcudXBkYXRlSGFzQXV0aG9yaXphdGlvbnNTdGF0dXMocmVzb2x2ZWQpO1xuICAgICAgICB9XG4gICAgICB9KS5jYXRjaChlcnIgPT4gY29uc29sZS5lcnJvcihlcnIuc3RhY2spKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZSBhbGwgYGNoZWNrYCBmdW5jdGlvbnMgZGVmaW5lZCBpbiB0aGUgcmVxdWlyZWQgZmVhdHVyZXMuXG4gICAqXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IC0gYHRydWVgIGlmIGFsbCBjaGVja3MgcGFzcywgYGZhbHNlYCBvdGhlcndpc2UuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfY2hlY2tSZXF1aXJlZEZlYXR1cmVzKCkge1xuICAgIGxldCByZXN1bHQgPSB0cnVlO1xuXG4gICAgdGhpcy5fcmVxdWlyZWRGZWF0dXJlcy5mb3JFYWNoKGZlYXR1cmUgPT4ge1xuICAgICAgY29uc3QgY2hlY2tGdW5jdGlvbiA9IHRoaXMuX2ZlYXR1cmVEZWZpbml0aW9uc1tmZWF0dXJlXS5jaGVjaztcblxuICAgICAgaWYgKCEodHlwZW9mIGNoZWNrRnVuY3Rpb24gPT09ICdmdW5jdGlvbicpKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIGNoZWNrIGZ1bmN0aW9uIGRlZmluZWQgZm9yICR7ZmVhdHVyZX0gZmVhdHVyZWApO1xuXG4gICAgICByZXN1bHQgPSByZXN1bHQgJiYgY2hlY2tGdW5jdGlvbigpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfZ2V0SG9va3ModHlwZSkge1xuICAgIGNvbnN0IGhvb2tzID0gW107XG5cbiAgICB0aGlzLl9yZXF1aXJlZEZlYXR1cmVzLmZvckVhY2goZmVhdHVyZSA9PiB7XG4gICAgICBjb25zdCBob29rID0gdGhpcy5fZmVhdHVyZURlZmluaXRpb25zW2ZlYXR1cmVdW3R5cGVdO1xuXG4gICAgICBpZiAoaG9vaylcbiAgICAgICAgaG9va3MucHVzaChob29rKTtcbiAgICB9KTtcblxuICAgIC8vIHJldHVybiBhbiBhcnJheSBvZiBQcm9taXNlcyBpbnN0ZWFkIG9mIGZ1bmN0aW9uXG4gICAgcmV0dXJuIGhvb2tzLm1hcChob29rID0+IGhvb2soKSk7XG4gIH1cblxuICAvKipcbiAgICogUG9wdWxhdGUgYGNsaWVudC5wbGF0Zm9ybWAgd2l0aCB0aGUgcHJlZmVyZWQgYXVkaW8gZmlsZSBleHRlbnRpb25cbiAgICogZm9yIHRoZSBwbGF0Zm9ybS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9kZWZpbmVBdWRpb0ZpbGVFeHRlbnRpb24oKSB7XG4gICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2F1ZGlvJyk7XG4gICAgLy8gaHR0cDovL2RpdmVpbnRvaHRtbDUuaW5mby9ldmVyeXRoaW5nLmh0bWxcbiAgICBpZiAoISEoYS5jYW5QbGF5VHlwZSAmJiBhLmNhblBsYXlUeXBlKCdhdWRpby9tcGVnOycpKSlcbiAgICAgIGNsaWVudC5wbGF0Zm9ybS5hdWRpb0ZpbGVFeHQgPSAnLm1wMyc7XG4gICAgZWxzZSBpZiAoISEoYS5jYW5QbGF5VHlwZSAmJiBhLmNhblBsYXlUeXBlKCdhdWRpby9vZ2c7IGNvZGVjcz1cInZvcmJpc1wiJykpKVxuICAgICAgY2xpZW50LnBsYXRmb3JtLmF1ZGlvRmlsZUV4dCA9ICcub2dnJztcbiAgICBlbHNlXG4gICAgICBjbGllbnQucGxhdGZvcm0uYXVkaW9GaWxlRXh0ID0gJy53YXYnO1xuICB9XG5cbiAgLyoqXG4gICAqIFBvcHVsYXRlIGBjbGllbnQucGxhdGZvcm1gIHdpdGggdGhlIG9zIG5hbWUuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfZGVmaW5lUGxhdGZvcm0oKSB7XG4gICAgY29uc3QgdWEgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudFxuICAgIGNvbnN0IG1kID0gbmV3IE1vYmlsZURldGVjdCh1YSk7XG5cbiAgICBjbGllbnQucGxhdGZvcm0uaXNNb2JpbGUgPSAobWQubW9iaWxlKCkgIT09IG51bGwpOyAvLyB0cnVlIGlmIHBob25lIG9yIHRhYmxldFxuICAgIGNsaWVudC5wbGF0Zm9ybS5vcyA9IChmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG9zID0gbWQub3MoKTtcblxuICAgICAgaWYgKG9zID09PSAnQW5kcm9pZE9TJylcbiAgICAgICAgcmV0dXJuICdhbmRyb2lkJztcbiAgICAgIGVsc2UgaWYgKG9zID09PSAnaU9TJylcbiAgICAgICAgcmV0dXJuICdpb3MnO1xuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gJ290aGVyJztcbiAgICB9KSgpO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFBsYXRmb3JtKTtcblxuZXhwb3J0IGRlZmF1bHQgUGxhdGZvcm07XG4iXX0=