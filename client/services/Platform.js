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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYXRmb3JtLmpzIl0sIm5hbWVzIjpbImRlZmF1bHREZWZpbml0aW9ucyIsImlkIiwiY2hlY2siLCJhdWRpb0NvbnRleHQiLCJpbnRlcmFjdGlvbkhvb2siLCJyZXN1bWUiLCJ0aGVuIiwiY2xpZW50IiwicGxhdGZvcm0iLCJpc01vYmlsZSIsInJlc29sdmUiLCJnIiwiY3JlYXRlR2FpbiIsImNvbm5lY3QiLCJkZXN0aW5hdGlvbiIsImdhaW4iLCJ2YWx1ZSIsIm8iLCJjcmVhdGVPc2NpbGxhdG9yIiwiZnJlcXVlbmN5Iiwic3RhcnQiLCJvcyIsInN0b3AiLCJjdXJyZW50VGltZSIsImxvY2FsU3RvcmFnZUtleSIsInNhbXBsZVJhdGUiLCJ3aW5kb3ciLCJsb2NhbFN0b3JhZ2UiLCJzZXRJdGVtIiwibG9jYXRpb24iLCJyZWxvYWQiLCJoYXNSZWxvYWRlZCIsImdldEl0ZW0iLCJyZW1vdmVJdGVtIiwibmF2aWdhdG9yIiwiZ2V0VXNlck1lZGlhIiwid2Via2l0R2V0VXNlck1lZGlhIiwibW96R2V0VXNlck1lZGlhIiwibXNHZXRVc2VyTWVkaWEiLCJzdGFydEhvb2siLCJyZWplY3QiLCJhdWRpbyIsInN0cmVhbSIsImdldEF1ZGlvVHJhY2tzIiwiZXJyIiwic2NyZWVuZnVsbCIsImVuYWJsZWQiLCJyZXF1ZXN0IiwiZ2VvbG9jYXRpb24iLCJnZXRDdXJyZW50UG9zaXRpb24iLCJwb3NpdGlvbiIsImNvb3JkcyIsImNvb3JkaW5hdGVzIiwibGF0aXR1ZGUiLCJsb25naXR1ZGUiLCJnZW9wb3NpdGlvbiIsImxhdCIsIk1hdGgiLCJyYW5kb20iLCJsbmciLCJub1NsZWVwIiwiTm9TbGVlcCIsImVuYWJsZSIsIlNFUlZJQ0VfSUQiLCJQbGF0Zm9ybSIsImRlZmF1bHRzIiwic2hvd0RpYWxvZyIsInZpZXciLCJ2aWV3UHJpb3JpdHkiLCJjb25maWd1cmUiLCJfcmVxdWlyZWRGZWF0dXJlcyIsIl9mZWF0dXJlRGVmaW5pdGlvbnMiLCJmb3JFYWNoIiwiZGVmIiwiYWRkRmVhdHVyZURlZmluaXRpb24iLCJvcHRpb25zIiwiZmVhdHVyZXMiLCJpbmRleE9mIiwicHVzaCIsInJlcXVpcmVGZWF0dXJlIiwiX2RlZmluZUF1ZGlvRmlsZUV4dGVudGlvbiIsIl9kZWZpbmVQbGF0Zm9ybSIsImNvbXBhdGlibGUiLCJfY2hlY2tSZXF1aXJlZEZlYXR1cmVzIiwic3RhcnRQcm9taXNlcyIsIl9nZXRIb29rcyIsImludGVyYWN0aW9uUHJvbWlzZXMiLCJwcm9taXNlcyIsImNvbmNhdCIsImFsbCIsInJlc29sdmVkIiwicmVzdWx0cyIsImJvb2wiLCJyZWFkeSIsIkVycm9yIiwidXBkYXRlQ2hlY2tpbmdTdGF0dXMiLCJ1cGRhdGVJc0NvbXBhdGlibGVTdGF0dXMiLCJ1cGRhdGVIYXNBdXRob3JpemF0aW9uc1N0YXR1cyIsInNob3ciLCJoYXNBdXRob3JpemF0aW9ucyIsInN1Y2Nlc3MiLCIkZWwiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uSW50ZXJhY3Rpb24iLCJjYXRjaCIsImNvbnNvbGUiLCJlcnJvciIsInN0YWNrIiwiaGlkZSIsIm9iaiIsImFkZCIsInR5cGUiLCJlIiwicHJldmVudERlZmF1bHQiLCJzdG9wUHJvcGFnYXRpb24iLCJpbnRlcmFjdGlvbiIsInJlc3VsdCIsImNoZWNrRnVuY3Rpb24iLCJmZWF0dXJlIiwiaG9va3MiLCJob29rIiwibWFwIiwiYSIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImNhblBsYXlUeXBlIiwiYXVkaW9GaWxlRXh0IiwidWEiLCJ1c2VyQWdlbnQiLCJtZCIsIk1vYmlsZURldGVjdCIsIm1vYmlsZSIsIlNlcnZpY2UiLCJzZXJ2aWNlTWFuYWdlciIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBOzs7Ozs7OztBQVFBOzs7Ozs7Ozs7Ozs7QUFZQTs7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Q0V0SCxpQkFBT0MsUUFBUCxDQUFnQnNILFlBQWhCLEdBQStCLE1BQS9CLENBREYsS0FFSyxJQUFJLENBQUMsRUFBRUosRUFBRUcsV0FBRixJQUFpQkgsRUFBRUcsV0FBRixDQUFjLDRCQUFkLENBQW5CLENBQUwsRUFDSHRILGlCQUFPQyxRQUFQLENBQWdCc0gsWUFBaEIsR0FBK0IsTUFBL0IsQ0FERyxLQUdIdkgsaUJBQU9DLFFBQVAsQ0FBZ0JzSCxZQUFoQixHQUErQixNQUEvQjtBQUNIOztBQUVEOzs7Ozs7OztzQ0FLa0I7QUFDaEIsVUFBTUMsS0FBS3JHLE9BQU9RLFNBQVAsQ0FBaUI4RixTQUE1QjtBQUNBLFVBQU1DLEtBQUssSUFBSUMsc0JBQUosQ0FBaUJILEVBQWpCLENBQVg7O0FBRUF4SCx1QkFBT0MsUUFBUCxDQUFnQkMsUUFBaEIsR0FBNEJ3SCxHQUFHRSxNQUFILE9BQWdCLElBQTVDLENBSmdCLENBSW1DO0FBQ25ENUgsdUJBQU9DLFFBQVAsQ0FBZ0JhLEVBQWhCLEdBQXNCLFlBQVc7QUFDL0IsWUFBTUEsS0FBSzRHLEdBQUc1RyxFQUFILEVBQVg7O0FBRUEsWUFBSUEsT0FBTyxXQUFYLEVBQ0UsT0FBTyxTQUFQLENBREYsS0FFSyxJQUFJQSxPQUFPLEtBQVgsRUFDSCxPQUFPLEtBQVAsQ0FERyxLQUdILE9BQU8sT0FBUDtBQUNILE9BVG9CLEVBQXJCO0FBVUQ7OztFQWpRb0IrRyxpQjs7QUFvUXZCQyx5QkFBZUMsUUFBZixDQUF3QnZFLFVBQXhCLEVBQW9DQyxRQUFwQzs7a0JBRWVBLFEiLCJmaWxlIjoiUGxhdGZvcm0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhdWRpb0NvbnRleHQgfSBmcm9tICd3YXZlcy1hdWRpbyc7XG5pbXBvcnQgY2xpZW50IGZyb20gJy4uL2NvcmUvY2xpZW50JztcbmltcG9ydCBNb2JpbGVEZXRlY3QgZnJvbSAnbW9iaWxlLWRldGVjdCc7XG5pbXBvcnQgTm9TbGVlcCBmcm9tICdub3NsZWVwLmpzL2Rpc3QvTm9TbGVlcC5taW4nO1xuaW1wb3J0IHNjcmVlbmZ1bGwgZnJvbSAnc2NyZWVuZnVsbCc7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuXG4vKipcbiAqIEFQSSBvZiBhIGNvbXBsaWFudCB2aWV3IGZvciB0aGUgYHBsYXRmb3JtYCBzZXJ2aWNlLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBpbnRlcmZhY2UgQWJzdHJhY3RQbGF0Zm9ybVZpZXdcbiAqIEBleHRlbmRzIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BYnN0cmFjdFZpZXdcbiAqIEBhYnN0cmFjdFxuICovXG4vKipcbiAqIFJlZ2lzdGVyIHRoZSBjYWxsYmFjayB0byBleGVjdXRlIHdoZW4gdGhlIHVzZXIgdG91Y2hlcyB0aGUgc2NyZWVuIGZvciB0aGUgZmlyc3QgdGltZS5cbiAqXG4gKiBAbmFtZSBzZXRUb3VjaFN0YXJ0Q2FsbGJhY2tcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWJzdHJhY3RQbGF0Zm9ybVZpZXdcbiAqIEBmdW5jdGlvblxuICogQGFic3RyYWN0XG4gKiBAaW5zdGFuY2VcbiAqXG4gKiBAcGFyYW0ge3RvdWNoU3RhcnRDYWxsYmFja30gY2FsbGJhY2sgLSBDYWxsYmFjayB0byBleGVjdXRlIHdoZW4gdGhlIHVzZXJcbiAqICB0b3VjaGVzIHRoZSBzY3JlZW4gZm9yIHRoZSBmaXJzdCB0aW1lLlxuICovXG4vKipcbiAqIFJlZ2lzdGVyIHRoZSBjYWxsYmFjayB0byBleGVjdXRlIHdoZW4gdGhlIHVzZXIgY2xpY2tzIHRoZSBzY3JlZW4gZm9yIHRoZSBmaXJzdCB0aW1lLlxuICpcbiAqIEBuYW1lIHNldE1vdXNlZG93bkNhbGxiYWNrXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0UGxhdGZvcm1WaWV3XG4gKiBAZnVuY3Rpb25cbiAqIEBhYnN0cmFjdFxuICogQGluc3RhbmNlXG4gKlxuICogQHBhcmFtIHttb3VzZURvd25DYWxsYmFja30gY2FsbGJhY2sgLSBDYWxsYmFjayB0byBleGVjdXRlIHdoZW4gdGhlIHVzZXJcbiAqICBjbGlja3MgdGhlIHNjcmVlbiBmb3IgdGhlIGZpcnN0IHRpbWUuXG4gKi9cbi8qKlxuICogVXBkYXRlIHRoZSB2aWV3IHRvIG5vdGlmeSB0aGF0IHRoZSBjb21wYXRpYmlsaXR5IGNoZWNrcyBhcmUgdGVybWluYXRlZC5cbiAqXG4gKiBAbmFtZSB1cGRhdGVDaGVja2luZ1N0YXR1c1xuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BYnN0cmFjdFBsYXRmb3JtVmlld1xuICogQGZ1bmN0aW9uXG4gKiBAYWJzdHJhY3RcbiAqIEBpbnN0YW5jZVxuICpcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gdmFsdWVcbiAqL1xuLyoqXG4gKiBVcGRhdGUgdGhlIHZpZXcgdG8gbm90aWZ5IGlmIHRoZSBkZXZpY2UgaXMgY29tcGF0aWJsZSBvciBub3QuXG4gKlxuICogQG5hbWUgdXBkYXRlSXNDb21wYXRpYmxlU3RhdHVzXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0UGxhdGZvcm1WaWV3XG4gKiBAZnVuY3Rpb25cbiAqIEBhYnN0cmFjdFxuICogQGluc3RhbmNlXG4gKlxuICogQHBhcmFtIHtCb29sZWFufSB2YWx1ZVxuICovXG4vKipcbiAqIFVwZGF0ZSB0aGUgdmlldyB0byBub3RpZnkgaWYgdGhlIGFwcGxpY2F0aW9uIG9idGFpbmVkIGFsbCB0aGUgYXV0aG9yaXphdGlvbnNcbiAqIG9yIG5vdC5cbiAqXG4gKiBAbmFtZSB1cGRhdGVIYXNBdXRob3JpemF0aW9uc1N0YXR1c1xuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BYnN0cmFjdFBsYXRmb3JtVmlld1xuICogQGZ1bmN0aW9uXG4gKiBAYWJzdHJhY3RcbiAqIEBpbnN0YW5jZVxuICpcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gdmFsdWVcbiAqL1xuXG4vKipcbiAqIENhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiB0aGUgdXNlciB0b3VjaGVzIHRoZSBzY3JlZW4gZm9yIHRoZSBmaXJzdCB0aW1lLlxuICpcbiAqIEBjYWxsYmFja1xuICogQG5hbWUgdG91Y2hTdGFydENhbGxiYWNrXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0UGxhdGZvcm1WaWV3XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHBhc3N3b3JkIC0gUGFzc3dvcmQgZ2l2ZW4gYnkgdGhlIHVzZXIuXG4gKi9cbi8qKlxuICogQ2FsbGJhY2sgdG8gZXhlY3V0ZSB3aGVuIHRoZSB1c2VyIGNsaWNrcyB0aGUgc2NyZWVuIGZvciB0aGUgZmlyc3QgdGltZS5cbiAqXG4gKiBAY2FsbGJhY2tcbiAqIEBuYW1lIG1vdXNlRG93bkNhbGxiYWNrXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0UGxhdGZvcm1WaWV3XG4gKi9cblxuXG5cbi8qKlxuICogU3RydWN0dXJlIG9mIHRoZSBkZWZpbml0aW9uIGZvciB0aGUgdGVzdCBvZiBhIGZlYXR1cmUuXG4gKlxuICogQHR5cGVkZWYge09iamVjdH0gbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYXRmb3JtfmRlZmluaXRpb25cbiAqXG4gKiBAcHJvcGVydHkge1N0cmluZ30gaWQgLSBJZCBvZiB0aGUgZGVmaW5pdGlvbi5cbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGNoZWNrIC0gQSBmdW5jdGlvbiB0aGF0IHNob3VsZCByZXR1cm4gYHRydWVgIGlmIHRoZVxuICogIGZlYXR1cmUgaXMgYXZhaWxhYmxlIG9uIHRoZSBwbGF0Zm9ybSwgYGZhbHNlYCBvdGhlcndpc2UuXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBbc3RhcnRIb29rXSAtIEEgZnVuY3Rpb24gcmV0dXJuaW5nIGEgYFByb21pc2VgIHRvIGJlXG4gKiAgZXhlY3V0ZWQgb24gc3RhcnQgKGZvciBleGFtcGxlIHRvIGFzayBhY2Nlc3MgdG8gbWljcm9waG9uZSBvciBnZW9sb2NhdGlvbikuXG4gKiAgVGhlIHJldHVybmVkIHByb21pc2Ugc2hvdWxkIGJlIHJlc29sdmVkIG9uIGB0cnVlYCBpcyB0aGUgcHJvY2VzcyBzdWNjZWRlZCBvclxuICogIGBmYWxzZWAgaXMgdGhlIHByZWNlc3MgZmFpbGVkIChlLmcuIHBlcm1pc3Npb24gbm90IGdyYW50ZWQpLlxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gW2ludGVyYWN0aW9uSG9va10gLSBBIGZ1bmN0aW9uIHJldHVybmluZyBhIFByb21pc2V0byBiZVxuICogIGV4ZWN1dGVkIG9uIHRoZSBmaXJzdCBpbnRlcmFjdGlvbiAoaS5lLiBgY2xpY2tgIG9yIGB0b3VjaHN0YXJ0YCkgb2YgdGhlIHVzZXJcbiAqICB3aXRoIGFwcGxpY2F0aW9uIChmb3IgZXhhbXBsZSwgdG8gaW5pdGlhbGl6ZSBBdWRpb0NvbnRleHQgb24gaU9TIGRldmljZXMpLlxuICogIFRoZSByZXR1cm5lZCBwcm9taXNlIHNob3VsZCBiZSByZXNvbHZlZCBvbiBgdHJ1ZWAgaXMgdGhlIHByb2Nlc3Mgc3VjY2VkZWQgb3JcbiAqICBgZmFsc2VgIGlzIHRoZSBwcmVjZXNzIGZhaWxlZCAoZS5nLiBwZXJtaXNzaW9uIG5vdCBncmFudGVkKS5cbiAqL1xuY29uc3QgZGVmYXVsdERlZmluaXRpb25zID0gW1xuICB7XG4gICAgaWQ6ICd3ZWItYXVkaW8nLFxuICAgIGNoZWNrOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAhIWF1ZGlvQ29udGV4dDtcbiAgICB9LFxuICAgIGludGVyYWN0aW9uSG9vazogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gYXVkaW9Db250ZXh0LnJlc3VtZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICBpZiAoIWNsaWVudC5wbGF0Zm9ybS5pc01vYmlsZSlcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuXG4gICAgICAgIGNvbnN0IGcgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuICAgICAgICBnLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcbiAgICAgICAgZy5nYWluLnZhbHVlID0gMC4wMDAwMDAwMDE7IC8vIC0xODBkQiA/XG5cbiAgICAgICAgY29uc3QgbyA9IGF1ZGlvQ29udGV4dC5jcmVhdGVPc2NpbGxhdG9yKCk7XG4gICAgICAgIG8uY29ubmVjdChnKTtcbiAgICAgICAgby5mcmVxdWVuY3kudmFsdWUgPSAyMDtcbiAgICAgICAgby5zdGFydCgwKTtcblxuICAgICAgICAvLyBwcmV2ZW50IGFuZHJvaWQgdG8gc3RvcCBhdWRpbyBieSBrZWVwaW5nIHRoZSBvc2NpbGxhdG9yIGFjdGl2ZVxuICAgICAgICBpZiAoY2xpZW50LnBsYXRmb3JtLm9zICE9PSAnYW5kcm9pZCcpXG4gICAgICAgICAgby5zdG9wKGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSArIDAuMDEpO1xuXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBpZDogJ2ZpeC1pb3Mtc2FtcGxlcmF0ZScsXG4gICAgY2hlY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBpbnRlcmFjdGlvbkhvb2s6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKGNsaWVudC5wbGF0Zm9ybS5vcyA9PT0gJ2lvcycpIHtcbiAgICAgICAgLy8gaW4gaXBvZCwgd2hlbiB0aGUgcHJvYmxlbSBvY2N1cnMsIHNhbXBsZVJhdGUgaGFzIGJlZW4gb2JzZXJ2ZWRcbiAgICAgICAgLy8gdG8gYmUgc2V0IGF0IDE2MDAwSHosIGFzIG5vIGV4aGF1c3RpdmUgdGVzdGluZyBoYXMgYmVlbiBkb25lXG4gICAgICAgIC8vIGFzc3VtZSA8IDQwMDAwIGlzIGEgYmFkIHZhbHVlLlxuICAgICAgICBjb25zdCBsb2NhbFN0b3JhZ2VLZXkgPSAnc291bmR3b3JrczpmaXgtaW9zLXNhbXBsZXJhdGUnO1xuXG4gICAgICAgIGlmIChhdWRpb0NvbnRleHQuc2FtcGxlUmF0ZSA8IDQwMDAwKSB7XG4gICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKGxvY2FsU3RvcmFnZUtleSwgdHJ1ZSk7XG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCh0cnVlKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBoYXNSZWxvYWRlZCA9ICEhd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKGxvY2FsU3RvcmFnZUtleSk7XG5cbiAgICAgICAgaWYgKGhhc1JlbG9hZGVkKSB7XG4gICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGxvY2FsU3RvcmFnZUtleSk7XG4gICAgICAgICAgY2xpZW50LnBsYXRmb3JtLmhhc1JlbG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuICAgIH0sXG4gIH0sXG4gIHtcbiAgICAvLyBAbm90ZTogYHRvdWNoYCBmZWF0dXJlIHdvcmthcm91bmRcbiAgICAvLyBjZi4gaHR0cDovL3d3dy5zdHVjb3guY29tL2Jsb2cveW91LWNhbnQtZGV0ZWN0LWEtdG91Y2hzY3JlZW4vXG4gICAgaWQ6ICdtb2JpbGUtZGV2aWNlJyxcbiAgICBjaGVjazogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY2xpZW50LnBsYXRmb3JtLmlzTW9iaWxlO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGlkOiAnYXVkaW8taW5wdXQnLFxuICAgIGNoZWNrOiBmdW5jdGlvbigpIHtcbiAgICAgIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEgPSAoXG4gICAgICAgIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEgfHxcbiAgICAgICAgbmF2aWdhdG9yLndlYmtpdEdldFVzZXJNZWRpYSB8fFxuICAgICAgICBuYXZpZ2F0b3IubW96R2V0VXNlck1lZGlhIHx8XG4gICAgICAgIG5hdmlnYXRvci5tc0dldFVzZXJNZWRpYVxuICAgICAgKTtcblxuICAgICAgcmV0dXJuICEhbmF2aWdhdG9yLmdldFVzZXJNZWRpYTtcbiAgICB9LFxuICAgIHN0YXJ0SG9vazogZnVuY3Rpb24oKSB7XG4gICAgICAvLyBAdG9kbyAtIHVzZSBuZXcgbmF2aWdhdG9yLm1lZGlhRGV2aWNlcyBpZiBhdmFpbGFibGVcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgbmF2aWdhdG9yLmdldFVzZXJNZWRpYSh7IGF1ZGlvOiB0cnVlIH0sIGZ1bmN0aW9uKHN0cmVhbSkge1xuICAgICAgICAgIHN0cmVhbS5nZXRBdWRpb1RyYWNrcygpWzBdLnN0b3AoKTtcbiAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGlkOiAnZnVsbC1zY3JlZW4nLFxuICAgIGNoZWNrOiBmdW5jdGlvbigpIHtcbiAgICAgIC8vIGZ1bmN0aW9ubmFsaXR5IHRoYXQgY2Fubm90IGJyYWtlIHRoZSBhcHBsaWNhdGlvblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBpbnRlcmFjdGlvbkhvb2soKSB7XG4gICAgICBpZiAoc2NyZWVuZnVsbC5lbmFibGVkKVxuICAgICAgICBzY3JlZW5mdWxsLnJlcXVlc3QoKTtcblxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBpZDogJ2dlb2xvY2F0aW9uJyxcbiAgICBjaGVjazogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gISFuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uO1xuICAgIH0sXG4gICAgc3RhcnRIb29rOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbigocG9zaXRpb24pID0+IHtcbiAgICAgICAgICAvLyBwb3B1bGF0ZSBjbGllbnQgd2l0aCBmaXJzdCB2YWx1ZVxuICAgICAgICAgIGNvbnN0IGNvb3JkcyA9IHBvc2l0aW9uLmNvb3JkcztcbiAgICAgICAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBbY29vcmRzLmxhdGl0dWRlLCBjb29yZHMubG9uZ2l0dWRlXTtcbiAgICAgICAgICBjbGllbnQuZ2VvcG9zaXRpb24gPSBwb3NpdGlvbjtcblxuICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgIH0sIChlcnIpID0+IHtcbiAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH0sIHt9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGlkOiAnZ2VvbG9jYXRpb24tbW9jaycsXG4gICAgY2hlY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBzdGFydEhvb2s6IGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbGF0ID0gTWF0aC5yYW5kb20oKSAqIDM2MCAtIDE4MDtcbiAgICAgIGNvbnN0IGxuZyA9IE1hdGgucmFuZG9tKCkgKiAxODAgLSA5MDtcbiAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IFtsYXQsIGxuZ107XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIC8vIGFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vcmljaHRyL05vU2xlZXAuanMvYmxvYi9tYXN0ZXIvTm9TbGVlcC5qc1xuICAgIC8vIHdhcm5pbmc6IGNhdXNlIDE1MCUgY3B1IHVzZSBpbiBjaHJvbWUgZGVza3RvcC4uLlxuICAgIGlkOiAnd2FrZS1sb2NrJyxcbiAgICBjaGVjazogZnVuY3Rpb24oKSB7XG4gICAgICAvLyBmdW5jdGlvbm5hbGl0eSB0aGF0IGNhbm5vdCBicmFrZSB0aGUgYXBwbGljYXRpb25cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgaW50ZXJhY3Rpb25Ib29rOiBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG5vU2xlZXAgPSBuZXcgTm9TbGVlcCgpO1xuICAgICAgbm9TbGVlcC5lbmFibGUoKTtcblxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICB9XG4gIH1cbl07XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpwbGF0Zm9ybSc7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgY2xpZW50IGAncGxhdGZvcm0nYCBzZXJ2aWNlLlxuICpcbiAqIFRoZSBgcGxhdGZvcm1gIHNlcnZpY2VzIGlzIHJlc3BvbnNpYmxlIGZvciBnaXZpbmcgZ2VuZXJhbCBpbmZvcm1hdGlvbnNcbiAqIGFib3V0IHRoZSB1c2VyJ3MgZGV2aWNlIGFzIHdlbGwgYXMgY2hlY2tpbmcgYXZhaWxhYmlsaXR5IGFuZCBwcm92aWRpbmcgaG9va3NcbiAqIGluIG9yZGVyIHRvIGluaXRpYWxpemUgdGhlIGZlYXR1cmVzIHJlcXVpcmVkIGJ5IHRoZSBhcHBsaWNhdGlvbiAoYXVkaW8sXG4gKiBtaWNyb3Bob25lLCBldGMuKS5cbiAqIElmIG9uZSBvZiB0aGUgcmVxdWlyZWQgZGVmaW5pdGlvbnMgaXMgbm90IGF2YWlsYWJsZSwgYSB2aWV3IGlzIGNyZWF0ZWQgd2l0aFxuICogYW4gZXJyb3IgbWVzc2FnZSBhbmQgYGNsaWVudC5jb21wYXRpYmxlYCBpcyBzZXQgdG8gYGZhbHNlYC5cbiAqXG4gKiBBdmFpbGFibGUgYnVpbHQtaW4gZGVmaW5pdGlvbnMgYXJlOlxuICogLSAnd2ViLWF1ZGlvJ1xuICogLSAnbW9iaWxlLWRldmljZSc6IG9ubHktYWNjZXB0IG1vYmlsZSBkZXZpY2VzIGluIHRoZSBhcHBsaWNhdGlvbiAoYmFzZWQgb25cbiAqICAgVXNlci1BZ2VudCBzbmlmZmluZylcbiAqIC0gJ2F1ZGlvLWlucHV0JzogQW5kcm9pZCBPbmx5XG4gKiAtICdmdWxsLXNjcmVlbic6IEFuZHJvaWQgT25seSwgdGhpcyBmZWF0dXJlIHdvbid0IGJsb2NrIHRoZSBhcHBsaWNhdGlvbiBpZlxuICogICBub3QgYXZhaWxhYmxlLlxuICogLSAnZ2VvbG9jYXRpb24nOiBjaGVjayBpZiB0aGUgbmF2aWdhdG9yIHN1cHBvcnRzIGdlb2xvY2F0aW9uLiBUaGUgYGNvb3JkaW5hdGVzYFxuICogICBhbmQgYGdlb3Bvc2l0aW9uYCBvZiB0aGUgYGNsaWVudGAgYXJlIHBvcHVsYXRlZCB3aGVuIHRoZSBwbGFmb3JtIHNlcnZpY2VcbiAqICAgcmVzb2x2ZXMuIChpZiBubyB1cGRhdGUgb2YgdGhlIGNvb3JkaW5hdGVzIGFyZSBuZWVkZWQgaW4gdGhlIGFwcGxpY2F0aW9uLFxuICogICByZXF1aXJpbmcgZ2VvbG9jYXRpb24gZmVhdHVyZSB3aXRob3V0IHVzaW5nIHRoZSBHZW9sb2NhdGlvbiBzZXJ2aWNlIHNob3VsZFxuICogICBzdWZmaWNlKS5cbiAqIC0gJ3dha2UtbG9jayc6IHVzZSB3aXRoIGNhdXRpb24sIGhhcyBiZWVuIG9ic2VydmVkIGNvbnN1bW1pbmdcbiAqICAgMTUwJSBjcHUgaW4gY2hyb21lIGRlc2t0b3AuXG4gKlxuICpcbiAqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmVcbiAqIGluc3RhbmNpYXRlZCBtYW51YWxseV9cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtBcnJheTxTdHJpbmc+fFN0cmluZ30gb3B0aW9ucy5mZWF0dXJlcyAtIElkKHMpIG9mIHRoZSBmZWF0dXJlKHMpXG4gKiAgcmVxdWlyZWQgYnkgdGhlIGFwcGxpY2F0aW9uLiBBdmFpbGFibGUgYnVpbGQtaW4gZmVhdHVyZXMgYXJlOlxuICogIC0gJ3dlYi1hdWRpbydcbiAqICAtICdtb2JpbGUtZGV2aWNlJzogb25seSBhY2NlcHQgbW9iaWxlIGRldmljZXMgKHJlY29nbml0aW9uIGJhc2VkIFVzZXItQWdlbnQpXG4gKiAgLSAnYXVkaW8taW5wdXQnOiBBbmRyb2lkIG9ubHlcbiAqICAtICdmdWxsLXNjcmVlbic6IEFuZHJvaWQgb25seVxuICogIC0gJ2dlb2xvY2F0aW9uJzogYWNjZXB0IGdlb2xvY2FsaXplZCBkZXZpY2VzLiBQb3B1bGF0ZSB0aGUgY2xpZW50IHdpdGhcbiAqICAgICBjdXJyZW50IHBvc2l0aW9uXG4gKiAgLSAnd2FrZS1sb2NrJzogdGhpcyBmZWF0dXJlIHNob3VsZCBiZSB1c2VkIHdpdGggY2F1dGlvbiBhc1xuICogICAgIGl0IGhhcyBiZWVuIG9ic2VydmVkIHRvIHVzZSAxNTAlIG9mIGNwdSBpbiBjaHJvbWUgZGVza3RvcC5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuc2hvd0RpYWxvZz10cnVlXSAtIElmIHNldCB0byBgZmFsc2VgLCB0aGUgc2VydmljZVxuICogIGV4ZWN1dGUgYWxsIGhvb2tzIHdpdGhvdXQgd2FpdGluZyBmb3IgYSB1c2VyIGludGVyYWN0aW9uIGFuZCBkb2Vzbid0IHNob3dcbiAqICB0aGUgc2VydmljZSdzIHZpZXcuIFRoaXMgb3B0aW9uIHNob3VsZCBvbmx5IGJlIHVzZWQgb24gY29udHJvbGxlZFxuICogIGVudmlyb25uZW1lbnRzIHdoZXJlIHRoZSB0YXJnZXQgcGxhdGZvcm0gaXMga25vd24gZm9yIHdvcmtpbmcgd2l0aG91dFxuICogIHRoaXMgbmVlZCAoZS5nLiBpcyBub3QgaU9TKS5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAZXhhbXBsZVxuICogLy8gaW5zaWRlIHRoZSBleHBlcmllbmNlIGNvbnN0cnVjdG9yXG4gKiB0aGlzLnBsYXRmb3JtID0gdGhpcy5yZXF1aXJlKCdwbGF0Zm9ybScsIHsgZmVhdHVyZXM6ICd3ZWItYXVkaW8nIH0pO1xuICpcbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5jbGllbnQjcGxhdGZvcm19XG4gKi9cbmNsYXNzIFBsYXRmb3JtIGV4dGVuZHMgU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIGZhbHNlKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgc2hvd0RpYWxvZzogdHJ1ZSxcbiAgICAgIHZpZXc6IG51bGwsXG4gICAgICB2aWV3UHJpb3JpdHk6IDEwLFxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICB0aGlzLnZpZXcgPSBudWxsO1xuXG4gICAgLy8gdGhpcy5fZGVmYXVsdFZpZXdUZW1wbGF0ZSA9IGRlZmF1bHRWaWV3VGVtcGxhdGU7XG4gICAgLy8gdGhpcy5fZGVmYXVsdFZpZXdDb250ZW50ID0gZGVmYXVsdFZpZXdDb250ZW50O1xuXG4gICAgdGhpcy5fcmVxdWlyZWRGZWF0dXJlcyA9IG5ldyBTZXQoKTtcbiAgICB0aGlzLl9mZWF0dXJlRGVmaW5pdGlvbnMgPSB7fTtcblxuICAgIGRlZmF1bHREZWZpbml0aW9ucy5mb3JFYWNoKChkZWYpID0+IHRoaXMuYWRkRmVhdHVyZURlZmluaXRpb24oZGVmKSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgY29uZmlndXJlKG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy5mZWF0dXJlcykge1xuICAgICAgbGV0IGZlYXR1cmVzID0gb3B0aW9ucy5mZWF0dXJlcztcblxuICAgICAgaWYgKHR5cGVvZiBmZWF0dXJlcyA9PT0gJ3N0cmluZycpXG4gICAgICAgIGZlYXR1cmVzID0gW2ZlYXR1cmVzXTtcblxuICAgICAgaWYgKGZlYXR1cmVzLmluZGV4T2YoJ3dlYi1hdWRpbycpICE9PSAtMSlcbiAgICAgICAgZmVhdHVyZXMucHVzaCgnZml4LWlvcy1zYW1wbGVyYXRlJyk7XG5cbiAgICAgIHRoaXMucmVxdWlyZUZlYXR1cmUoLi4uZmVhdHVyZXMpO1xuXG4gICAgICBkZWxldGUgb3B0aW9ucy5mZWF0dXJlcztcbiAgICB9XG5cbiAgICBzdXBlci5jb25maWd1cmUob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogIFN0YXJ0IHRoZSBjbGllbnQuXG4gICAqICBBbGdvcml0aG06XG4gICAqICAtIGNoZWNrIHJlcXVpcmVkIGZlYXR1cmVzXG4gICAqICAtIGlmIChmYWxzZSlcbiAgICogICAgIHNob3cgJ3NvcnJ5JyBzY3JlZW5cbiAgICogIC0gZWxzZVxuICAgKiAgICAgc2hvdyAnd2VsY29tZScgc2NyZWVuXG4gICAqICAgICBleGVjdXRlIHN0YXJ0IGhvb2sgKHByb21pc2UpXG4gICAqICAgICAtIGlmIChwcm9taXNlID09PSB0cnVlKVxuICAgKiAgICAgICAgc2hvdyB0b3VjaCB0byBzdGFydFxuICAgKiAgICAgICAgYmluZCBldmVudHNcbiAgICogICAgIC0gZWxzZVxuICAgKiAgICAgICAgc2hvdyAnc29ycnknIHNjcmVlblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIHRoaXMuX2RlZmluZUF1ZGlvRmlsZUV4dGVudGlvbigpO1xuICAgIHRoaXMuX2RlZmluZVBsYXRmb3JtKCk7XG5cbiAgICAvLyByZXNvbHZlIHJlcXVpcmVkIGZlYXR1cmVzIGZyb20gdGhlIGFwcGxpY2F0aW9uXG4gICAgY2xpZW50LmNvbXBhdGlibGUgPSB0aGlzLl9jaGVja1JlcXVpcmVkRmVhdHVyZXMoKTtcblxuICAgIC8vIGhhbmRsZSBgc2hvd0RpYWxvZyA9PT0gZmFsc2VgXG4gICAgaWYgKHRoaXMub3B0aW9ucy5zaG93RGlhbG9nID09PSBmYWxzZSkge1xuICAgICAgaWYgKGNsaWVudC5jb21wYXRpYmxlKSB7XG4gICAgICAgIGNvbnN0IHN0YXJ0UHJvbWlzZXMgPSB0aGlzLl9nZXRIb29rcygnc3RhcnRIb29rJyk7XG4gICAgICAgIGNvbnN0IGludGVyYWN0aW9uUHJvbWlzZXMgPSB0aGlzLl9nZXRIb29rcygnaW50ZXJhY3Rpb25Ib29rJyk7XG4gICAgICAgIGNvbnN0IHByb21pc2VzID0gW10uY29uY2F0KHN0YXJ0UHJvbWlzZXMsIGludGVyYWN0aW9uUHJvbWlzZXMpO1xuXG4gICAgICAgIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKHJlc3VsdHMgPT4ge1xuICAgICAgICAgIGxldCByZXNvbHZlZCA9IHRydWU7XG4gICAgICAgICAgcmVzdWx0cy5mb3JFYWNoKGJvb2wgPT4gcmVzb2x2ZWQgPSByZXNvbHZlZCAmJiBib29sKTtcblxuICAgICAgICAgIGlmIChyZXNvbHZlZClcbiAgICAgICAgICAgIHRoaXMucmVhZHkoKTtcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYHNlcnZpY2U6cGxhdGZvcm0gLSBkaWRuJ3Qgb2J0YWluIHRoZSBuZWNlc3NhcnkgYXV0aG9yaXphdGlvbnNgKTtcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignc2VydmljZTpwbGF0Zm9ybSAtIGNsaWVudCBub3QgY29tcGF0aWJsZScpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBkZWZhdWx0IHZpZXcgdmFsdWVzXG4gICAgICB0aGlzLnZpZXcudXBkYXRlQ2hlY2tpbmdTdGF0dXMoZmFsc2UpO1xuICAgICAgdGhpcy52aWV3LnVwZGF0ZUlzQ29tcGF0aWJsZVN0YXR1cyhudWxsKTtcbiAgICAgIHRoaXMudmlldy51cGRhdGVIYXNBdXRob3JpemF0aW9uc1N0YXR1cyhudWxsKTtcblxuICAgICAgaWYgKCFjbGllbnQuY29tcGF0aWJsZSkge1xuICAgICAgICB0aGlzLnZpZXcudXBkYXRlSXNDb21wYXRpYmxlU3RhdHVzKGZhbHNlKTtcbiAgICAgICAgdGhpcy5zaG93KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnZpZXcudXBkYXRlSXNDb21wYXRpYmxlU3RhdHVzKHRydWUpO1xuICAgICAgICB0aGlzLnZpZXcudXBkYXRlQ2hlY2tpbmdTdGF0dXModHJ1ZSk7XG4gICAgICAgIHRoaXMuc2hvdygpO1xuXG4gICAgICAgIC8vIGV4ZWN1dGUgc3RhcnQgaG9va1xuICAgICAgICBjb25zdCBzdGFydFByb21pc2VzID0gdGhpcy5fZ2V0SG9va3MoJ3N0YXJ0SG9vaycpO1xuXG4gICAgICAgIFByb21pc2UuYWxsKHN0YXJ0UHJvbWlzZXMpLnRoZW4ocmVzdWx0cyA9PiB7XG4gICAgICAgICAgLy8gaWYgb25lIG9mIHRoZSBzdGFydCBob29rIGZhaWxlZFxuICAgICAgICAgIGxldCBoYXNBdXRob3JpemF0aW9ucyA9IHRydWU7XG4gICAgICAgICAgcmVzdWx0cy5mb3JFYWNoKHN1Y2Nlc3MgPT4gaGFzQXV0aG9yaXphdGlvbnMgPSBoYXNBdXRob3JpemF0aW9ucyAmJiBzdWNjZXNzKTtcblxuICAgICAgICAgIHRoaXMudmlldy51cGRhdGVIYXNBdXRob3JpemF0aW9uc1N0YXR1cyhoYXNBdXRob3JpemF0aW9ucyk7XG4gICAgICAgICAgdGhpcy52aWV3LnVwZGF0ZUNoZWNraW5nU3RhdHVzKGZhbHNlKTtcblxuICAgICAgICAgIGlmIChoYXNBdXRob3JpemF0aW9ucykge1xuICAgICAgICAgICAgLy8gbW92ZSB0byAndG91Y2hlbmQnIGFuZCAnbW91c2V1cCcgYmVjYXVzZSAndG91Y2hzdGFydCcgaXMgbm9cbiAgICAgICAgICAgIC8vIGxvbmdlciByZWNvZ25pemVkIGFzIGEgdXNlciBnZXN0dXJlIGluIGFuZHJvaWRcbiAgICAgICAgICAgIC8vIEB0b2RvIC0gZGVmaW5lIHdoYXQgdG8gZG8gd2l0aCB0aGUgdGVtcGxhdGUuLi5cbiAgICAgICAgICAgIC8vIGNmLiBodHRwczovL2RvY3MuZ29vZ2xlLmNvbS9kb2N1bWVudC9kLzFvRjFUM083X0U0dDFQWUhWNmd5Q3dIeE9pM3lzdG0wZVNMNXhadTdudk9nL2VkaXQjaGVhZGluZz1oLnFxNTlldjN1OGZiYVxuICAgICAgICAgICAgdGhpcy52aWV3LiRlbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMuX29uSW50ZXJhY3Rpb24oJ3RvdWNoJykpO1xuICAgICAgICAgICAgdGhpcy52aWV3LiRlbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5fb25JbnRlcmFjdGlvbignbW91c2UnKSk7XG4gICAgICAgICAgICAvLyB0aGlzLnZpZXcuc2V0VG91Y2hTdGFydENhbGxiYWNrKHRoaXMuX29uSW50ZXJhY3Rpb24oJ3RvdWNoJykpO1xuICAgICAgICAgICAgLy8gdGhpcy52aWV3LnNldE1vdXNlRG93bkNhbGxiYWNrKHRoaXMuX29uSW50ZXJhY3Rpb24oJ21vdXNlJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkuY2F0Y2goKGVycikgPT4gY29uc29sZS5lcnJvcihlcnIuc3RhY2spKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RvcCgpIHtcbiAgICB0aGlzLmhpZGUoKTtcbiAgICBzdXBlci5zdG9wKCk7XG4gIH1cblxuICAvKipcbiAgICogU3RydWN0dXJlIG9mIHRoZSBkZWZpbml0aW9uIGZvciB0aGUgdGVzdCBvZiBhIGZlYXR1cmUuXG4gICAqXG4gICAqIEBwYXJhbSB7bW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYXRmb3JtfmRlZmluaXRpb259IG9iaiAtIERlZmluaXRpb24gb2ZcbiAgICogIHRoZSBmZWF0dXJlLlxuICAgKi9cbiAgYWRkRmVhdHVyZURlZmluaXRpb24ob2JqKSB7XG4gICAgdGhpcy5fZmVhdHVyZURlZmluaXRpb25zW29iai5pZF0gPSBvYmo7XG4gIH1cblxuICAvKipcbiAgICogUmVxdWlyZSBmZWF0dXJlcyBmb3IgdGhlIGFwcGxpY2F0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gey4uLlN0cmluZ30gZmVhdHVyZXMgLSBJZChzKSBvZiB0aGUgZmVhdHVyZShzKSB0byBiZSByZXF1aXJlZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlcXVpcmVGZWF0dXJlKC4uLmZlYXR1cmVzKSB7XG4gICAgZmVhdHVyZXMuZm9yRWFjaCgoaWQpID0+IHRoaXMuX3JlcXVpcmVkRmVhdHVyZXMuYWRkKGlkKSk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBFeGVjdXRlIGBpbnRlcmFjdGlvbnNgIGhvb2tzIGZyb20gdGhlIGBwbGF0Zm9ybWAgc2VydmljZS5cbiAgICogQWxzbyBhY3RpdmF0ZSB0aGUgbWVkaWEgYWNjb3JkaW5nIHRvIHRoZSBgb3B0aW9uc2AuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfb25JbnRlcmFjdGlvbih0eXBlKSB7XG4gICAgcmV0dXJuIChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICBjb25zdCBub1NsZWVwID0gbmV3IE5vU2xlZXAoKTtcbiAgICAgIG5vU2xlZXAuZW5hYmxlKCk7XG5cbiAgICAgIGNsaWVudC5wbGF0Zm9ybS5pbnRlcmFjdGlvbiA9IHR5cGU7XG4gICAgICAvLyBleGVjdXRlIGludGVyYWN0aW9uIGhvb2tzIGZyb20gdGhlIHBsYXRmb3JtXG4gICAgICBjb25zdCBpbnRlcmFjdGlvblByb21pc2VzID0gdGhpcy5fZ2V0SG9va3MoJ2ludGVyYWN0aW9uSG9vaycpO1xuXG4gICAgICBQcm9taXNlLmFsbChpbnRlcmFjdGlvblByb21pc2VzKS50aGVuKChyZXN1bHRzKSA9PiB7XG4gICAgICAgIGxldCByZXNvbHZlZCA9IHRydWU7XG4gICAgICAgIHJlc3VsdHMuZm9yRWFjaChib29sID0+IHJlc29sdmVkID0gcmVzb2x2ZWQgJiYgYm9vbCk7XG5cbiAgICAgICAgaWYgKHJlc29sdmVkKSB7XG4gICAgICAgICAgdGhpcy5yZWFkeSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMudmlldy51cGRhdGVIYXNBdXRob3JpemF0aW9uc1N0YXR1cyhyZXNvbHZlZCk7XG4gICAgICAgIH1cbiAgICAgIH0pLmNhdGNoKGVyciA9PiBjb25zb2xlLmVycm9yKGVyci5zdGFjaykpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlIGFsbCBgY2hlY2tgIGZ1bmN0aW9ucyBkZWZpbmVkIGluIHRoZSByZXF1aXJlZCBmZWF0dXJlcy5cbiAgICpcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gLSBgdHJ1ZWAgaWYgYWxsIGNoZWNrcyBwYXNzLCBgZmFsc2VgIG90aGVyd2lzZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9jaGVja1JlcXVpcmVkRmVhdHVyZXMoKSB7XG4gICAgbGV0IHJlc3VsdCA9IHRydWU7XG5cbiAgICB0aGlzLl9yZXF1aXJlZEZlYXR1cmVzLmZvckVhY2goZmVhdHVyZSA9PiB7XG4gICAgICBjb25zdCBjaGVja0Z1bmN0aW9uID0gdGhpcy5fZmVhdHVyZURlZmluaXRpb25zW2ZlYXR1cmVdLmNoZWNrO1xuXG4gICAgICBpZiAoISh0eXBlb2YgY2hlY2tGdW5jdGlvbiA9PT0gJ2Z1bmN0aW9uJykpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gY2hlY2sgZnVuY3Rpb24gZGVmaW5lZCBmb3IgJHtmZWF0dXJlfSBmZWF0dXJlYCk7XG5cbiAgICAgIHJlc3VsdCA9IHJlc3VsdCAmJiBjaGVja0Z1bmN0aW9uKCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9nZXRIb29rcyh0eXBlKSB7XG4gICAgY29uc3QgaG9va3MgPSBbXTtcblxuICAgIHRoaXMuX3JlcXVpcmVkRmVhdHVyZXMuZm9yRWFjaChmZWF0dXJlID0+IHtcbiAgICAgIGNvbnN0IGhvb2sgPSB0aGlzLl9mZWF0dXJlRGVmaW5pdGlvbnNbZmVhdHVyZV1bdHlwZV07XG5cbiAgICAgIGlmIChob29rKVxuICAgICAgICBob29rcy5wdXNoKGhvb2spO1xuICAgIH0pO1xuXG4gICAgLy8gcmV0dXJuIGFuIGFycmF5IG9mIFByb21pc2VzIGluc3RlYWQgb2YgZnVuY3Rpb25cbiAgICByZXR1cm4gaG9va3MubWFwKGhvb2sgPT4gaG9vaygpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQb3B1bGF0ZSBgY2xpZW50LnBsYXRmb3JtYCB3aXRoIHRoZSBwcmVmZXJlZCBhdWRpbyBmaWxlIGV4dGVudGlvblxuICAgKiBmb3IgdGhlIHBsYXRmb3JtLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2RlZmluZUF1ZGlvRmlsZUV4dGVudGlvbigpIHtcbiAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYXVkaW8nKTtcbiAgICAvLyBodHRwOi8vZGl2ZWludG9odG1sNS5pbmZvL2V2ZXJ5dGhpbmcuaHRtbFxuICAgIGlmICghIShhLmNhblBsYXlUeXBlICYmIGEuY2FuUGxheVR5cGUoJ2F1ZGlvL21wZWc7JykpKVxuICAgICAgY2xpZW50LnBsYXRmb3JtLmF1ZGlvRmlsZUV4dCA9ICcubXAzJztcbiAgICBlbHNlIGlmICghIShhLmNhblBsYXlUeXBlICYmIGEuY2FuUGxheVR5cGUoJ2F1ZGlvL29nZzsgY29kZWNzPVwidm9yYmlzXCInKSkpXG4gICAgICBjbGllbnQucGxhdGZvcm0uYXVkaW9GaWxlRXh0ID0gJy5vZ2cnO1xuICAgIGVsc2VcbiAgICAgIGNsaWVudC5wbGF0Zm9ybS5hdWRpb0ZpbGVFeHQgPSAnLndhdic7XG4gIH1cblxuICAvKipcbiAgICogUG9wdWxhdGUgYGNsaWVudC5wbGF0Zm9ybWAgd2l0aCB0aGUgb3MgbmFtZS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9kZWZpbmVQbGF0Zm9ybSgpIHtcbiAgICBjb25zdCB1YSA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50XG4gICAgY29uc3QgbWQgPSBuZXcgTW9iaWxlRGV0ZWN0KHVhKTtcblxuICAgIGNsaWVudC5wbGF0Zm9ybS5pc01vYmlsZSA9IChtZC5tb2JpbGUoKSAhPT0gbnVsbCk7IC8vIHRydWUgaWYgcGhvbmUgb3IgdGFibGV0XG4gICAgY2xpZW50LnBsYXRmb3JtLm9zID0gKGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3Qgb3MgPSBtZC5vcygpO1xuXG4gICAgICBpZiAob3MgPT09ICdBbmRyb2lkT1MnKVxuICAgICAgICByZXR1cm4gJ2FuZHJvaWQnO1xuICAgICAgZWxzZSBpZiAob3MgPT09ICdpT1MnKVxuICAgICAgICByZXR1cm4gJ2lvcyc7XG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiAnb3RoZXInO1xuICAgIH0pKCk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgUGxhdGZvcm0pO1xuXG5leHBvcnQgZGVmYXVsdCBQbGF0Zm9ybTtcbiJdfQ==