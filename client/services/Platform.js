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

        console.log(features);
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
              _this2.view.setTouchStartCallback(_this2._onInteraction('touch'));
              _this2.view.setMouseDownCallback(_this2._onInteraction('mouse'));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYXRmb3JtLmpzIl0sIm5hbWVzIjpbImRlZmF1bHREZWZpbml0aW9ucyIsImlkIiwiY2hlY2siLCJpbnRlcmFjdGlvbkhvb2siLCJwbGF0Zm9ybSIsImlzTW9iaWxlIiwicmVzb2x2ZSIsImciLCJjcmVhdGVHYWluIiwiY29ubmVjdCIsImRlc3RpbmF0aW9uIiwiZ2FpbiIsInZhbHVlIiwibyIsImNyZWF0ZU9zY2lsbGF0b3IiLCJmcmVxdWVuY3kiLCJzdGFydCIsIm9zIiwic3RvcCIsImN1cnJlbnRUaW1lIiwibG9jYWxTdG9yYWdlS2V5Iiwic2FtcGxlUmF0ZSIsIndpbmRvdyIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJsb2NhdGlvbiIsInJlbG9hZCIsImhhc1JlbG9hZGVkIiwiZ2V0SXRlbSIsInJlbW92ZUl0ZW0iLCJuYXZpZ2F0b3IiLCJnZXRVc2VyTWVkaWEiLCJ3ZWJraXRHZXRVc2VyTWVkaWEiLCJtb3pHZXRVc2VyTWVkaWEiLCJtc0dldFVzZXJNZWRpYSIsInN0YXJ0SG9vayIsInJlamVjdCIsImF1ZGlvIiwic3RyZWFtIiwiZ2V0QXVkaW9UcmFja3MiLCJlcnIiLCJlbmFibGVkIiwicmVxdWVzdCIsImdlb2xvY2F0aW9uIiwiZ2V0Q3VycmVudFBvc2l0aW9uIiwicG9zaXRpb24iLCJjb29yZHMiLCJjb29yZGluYXRlcyIsImxhdGl0dWRlIiwibG9uZ2l0dWRlIiwiZ2VvcG9zaXRpb24iLCJsYXQiLCJNYXRoIiwicmFuZG9tIiwibG5nIiwic2V0SW50ZXJ2YWwiLCJzZXRUaW1lb3V0IiwibWVkaWFzIiwid2VibSIsIm1wNCIsIiR2aWRlbyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInNldEF0dHJpYnV0ZSIsInR5cGUiLCJkYXRhVVJJIiwiJHNvdXJjZSIsInNyYyIsImFwcGVuZENoaWxkIiwicGxheSIsIlNFUlZJQ0VfSUQiLCJQbGF0Zm9ybSIsImRlZmF1bHRzIiwic2hvd0RpYWxvZyIsInZpZXciLCJ2aWV3UHJpb3JpdHkiLCJjb25maWd1cmUiLCJfcmVxdWlyZWRGZWF0dXJlcyIsIl9mZWF0dXJlRGVmaW5pdGlvbnMiLCJmb3JFYWNoIiwiZGVmIiwiYWRkRmVhdHVyZURlZmluaXRpb24iLCJvcHRpb25zIiwiZmVhdHVyZXMiLCJpbmRleE9mIiwicHVzaCIsImNvbnNvbGUiLCJsb2ciLCJyZXF1aXJlRmVhdHVyZSIsIl9kZWZpbmVBdWRpb0ZpbGVFeHRlbnRpb24iLCJfZGVmaW5lUGxhdGZvcm0iLCJjb21wYXRpYmxlIiwiX2NoZWNrUmVxdWlyZWRGZWF0dXJlcyIsInN0YXJ0UHJvbWlzZXMiLCJfZ2V0SG9va3MiLCJpbnRlcmFjdGlvblByb21pc2VzIiwicHJvbWlzZXMiLCJjb25jYXQiLCJhbGwiLCJ0aGVuIiwicmVzb2x2ZWQiLCJyZXN1bHRzIiwiYm9vbCIsInJlYWR5IiwiRXJyb3IiLCJ1cGRhdGVDaGVja2luZ1N0YXR1cyIsInVwZGF0ZUlzQ29tcGF0aWJsZVN0YXR1cyIsInVwZGF0ZUhhc0F1dGhvcml6YXRpb25zU3RhdHVzIiwic2hvdyIsImhhc0F1dGhvcml6YXRpb25zIiwic3VjY2VzcyIsInNldFRvdWNoU3RhcnRDYWxsYmFjayIsIl9vbkludGVyYWN0aW9uIiwic2V0TW91c2VEb3duQ2FsbGJhY2siLCJjYXRjaCIsImVycm9yIiwic3RhY2siLCJoaWRlIiwib2JqIiwiYWRkIiwiZSIsInByZXZlbnREZWZhdWx0Iiwic3RvcFByb3BhZ2F0aW9uIiwiaW50ZXJhY3Rpb24iLCJyZXN1bHQiLCJjaGVja0Z1bmN0aW9uIiwiZmVhdHVyZSIsImhvb2tzIiwiaG9vayIsIm1hcCIsImEiLCJjYW5QbGF5VHlwZSIsImF1ZGlvRmlsZUV4dCIsInVhIiwidXNlckFnZW50IiwibWQiLCJtb2JpbGUiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUE7Ozs7Ozs7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S0FHSCxPQUFPLE9BQVA7QUFDSCxPQVRvQixFQUFyQjtBQVVEOzs7OztBQUdILHlCQUFld0gsUUFBZixDQUF3Qm5FLFVBQXhCLEVBQW9DQyxRQUFwQzs7a0JBRWVBLFEiLCJmaWxlIjoiUGxhdGZvcm0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhdWRpb0NvbnRleHQgfSBmcm9tICd3YXZlcy1hdWRpbyc7XG5pbXBvcnQgY2xpZW50IGZyb20gJy4uL2NvcmUvY2xpZW50JztcbmltcG9ydCBNb2JpbGVEZXRlY3QgZnJvbSAnbW9iaWxlLWRldGVjdCc7XG5pbXBvcnQgc2NyZWVuZnVsbCBmcm9tICdzY3JlZW5mdWxsJztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbi8qKlxuICogQVBJIG9mIGEgY29tcGxpYW50IHZpZXcgZm9yIHRoZSBgcGxhdGZvcm1gIHNlcnZpY2UuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQGludGVyZmFjZSBBYnN0cmFjdFBsYXRmb3JtVmlld1xuICogQGV4dGVuZHMgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0Vmlld1xuICogQGFic3RyYWN0XG4gKi9cbi8qKlxuICogUmVnaXN0ZXIgdGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiB0aGUgdXNlciB0b3VjaGVzIHRoZSBzY3JlZW4gZm9yIHRoZSBmaXJzdCB0aW1lLlxuICpcbiAqIEBuYW1lIHNldFRvdWNoU3RhcnRDYWxsYmFja1xuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BYnN0cmFjdFBsYXRmb3JtVmlld1xuICogQGZ1bmN0aW9uXG4gKiBAYWJzdHJhY3RcbiAqIEBpbnN0YW5jZVxuICpcbiAqIEBwYXJhbSB7dG91Y2hTdGFydENhbGxiYWNrfSBjYWxsYmFjayAtIENhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiB0aGUgdXNlclxuICogIHRvdWNoZXMgdGhlIHNjcmVlbiBmb3IgdGhlIGZpcnN0IHRpbWUuXG4gKi9cbi8qKlxuICogUmVnaXN0ZXIgdGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiB0aGUgdXNlciBjbGlja3MgdGhlIHNjcmVlbiBmb3IgdGhlIGZpcnN0IHRpbWUuXG4gKlxuICogQG5hbWUgc2V0TW91c2Vkb3duQ2FsbGJhY2tcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWJzdHJhY3RQbGF0Zm9ybVZpZXdcbiAqIEBmdW5jdGlvblxuICogQGFic3RyYWN0XG4gKiBAaW5zdGFuY2VcbiAqXG4gKiBAcGFyYW0ge21vdXNlRG93bkNhbGxiYWNrfSBjYWxsYmFjayAtIENhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiB0aGUgdXNlclxuICogIGNsaWNrcyB0aGUgc2NyZWVuIGZvciB0aGUgZmlyc3QgdGltZS5cbiAqL1xuLyoqXG4gKiBVcGRhdGUgdGhlIHZpZXcgdG8gbm90aWZ5IHRoYXQgdGhlIGNvbXBhdGliaWxpdHkgY2hlY2tzIGFyZSB0ZXJtaW5hdGVkLlxuICpcbiAqIEBuYW1lIHVwZGF0ZUNoZWNraW5nU3RhdHVzXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0UGxhdGZvcm1WaWV3XG4gKiBAZnVuY3Rpb25cbiAqIEBhYnN0cmFjdFxuICogQGluc3RhbmNlXG4gKlxuICogQHBhcmFtIHtCb29sZWFufSB2YWx1ZVxuICovXG4vKipcbiAqIFVwZGF0ZSB0aGUgdmlldyB0byBub3RpZnkgaWYgdGhlIGRldmljZSBpcyBjb21wYXRpYmxlIG9yIG5vdC5cbiAqXG4gKiBAbmFtZSB1cGRhdGVJc0NvbXBhdGlibGVTdGF0dXNcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWJzdHJhY3RQbGF0Zm9ybVZpZXdcbiAqIEBmdW5jdGlvblxuICogQGFic3RyYWN0XG4gKiBAaW5zdGFuY2VcbiAqXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHZhbHVlXG4gKi9cbi8qKlxuICogVXBkYXRlIHRoZSB2aWV3IHRvIG5vdGlmeSBpZiB0aGUgYXBwbGljYXRpb24gb2J0YWluZWQgYWxsIHRoZSBhdXRob3JpemF0aW9uc1xuICogb3Igbm90LlxuICpcbiAqIEBuYW1lIHVwZGF0ZUhhc0F1dGhvcml6YXRpb25zU3RhdHVzXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0UGxhdGZvcm1WaWV3XG4gKiBAZnVuY3Rpb25cbiAqIEBhYnN0cmFjdFxuICogQGluc3RhbmNlXG4gKlxuICogQHBhcmFtIHtCb29sZWFufSB2YWx1ZVxuICovXG5cbi8qKlxuICogQ2FsbGJhY2sgdG8gZXhlY3V0ZSB3aGVuIHRoZSB1c2VyIHRvdWNoZXMgdGhlIHNjcmVlbiBmb3IgdGhlIGZpcnN0IHRpbWUuXG4gKlxuICogQGNhbGxiYWNrXG4gKiBAbmFtZSB0b3VjaFN0YXJ0Q2FsbGJhY2tcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWJzdHJhY3RQbGF0Zm9ybVZpZXdcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcGFzc3dvcmQgLSBQYXNzd29yZCBnaXZlbiBieSB0aGUgdXNlci5cbiAqL1xuLyoqXG4gKiBDYWxsYmFjayB0byBleGVjdXRlIHdoZW4gdGhlIHVzZXIgY2xpY2tzIHRoZSBzY3JlZW4gZm9yIHRoZSBmaXJzdCB0aW1lLlxuICpcbiAqIEBjYWxsYmFja1xuICogQG5hbWUgbW91c2VEb3duQ2FsbGJhY2tcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWJzdHJhY3RQbGF0Zm9ybVZpZXdcbiAqL1xuXG5cblxuLyoqXG4gKiBTdHJ1Y3R1cmUgb2YgdGhlIGRlZmluaXRpb24gZm9yIHRoZSB0ZXN0IG9mIGEgZmVhdHVyZS5cbiAqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhdGZvcm1+ZGVmaW5pdGlvblxuICpcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBpZCAtIElkIG9mIHRoZSBkZWZpbml0aW9uLlxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gY2hlY2sgLSBBIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIHJldHVybiBgdHJ1ZWAgaWYgdGhlXG4gKiAgZmVhdHVyZSBpcyBhdmFpbGFibGUgb24gdGhlIHBsYXRmb3JtLCBgZmFsc2VgIG90aGVyd2lzZS5cbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IFtzdGFydEhvb2tdIC0gQSBmdW5jdGlvbiByZXR1cm5pbmcgYSBgUHJvbWlzZWAgdG8gYmVcbiAqICBleGVjdXRlZCBvbiBzdGFydCAoZm9yIGV4YW1wbGUgdG8gYXNrIGFjY2VzcyB0byBtaWNyb3Bob25lIG9yIGdlb2xvY2F0aW9uKS5cbiAqICBUaGUgcmV0dXJuZWQgcHJvbWlzZSBzaG91bGQgYmUgcmVzb2x2ZWQgb24gYHRydWVgIGlzIHRoZSBwcm9jZXNzIHN1Y2NlZGVkIG9yXG4gKiAgYGZhbHNlYCBpcyB0aGUgcHJlY2VzcyBmYWlsZWQgKGUuZy4gcGVybWlzc2lvbiBub3QgZ3JhbnRlZCkuXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBbaW50ZXJhY3Rpb25Ib29rXSAtIEEgZnVuY3Rpb24gcmV0dXJuaW5nIGEgUHJvbWlzZXRvIGJlXG4gKiAgZXhlY3V0ZWQgb24gdGhlIGZpcnN0IGludGVyYWN0aW9uIChpLmUuIGBjbGlja2Agb3IgYHRvdWNoc3RhcnRgKSBvZiB0aGUgdXNlclxuICogIHdpdGggYXBwbGljYXRpb24gKGZvciBleGFtcGxlLCB0byBpbml0aWFsaXplIEF1ZGlvQ29udGV4dCBvbiBpT1MgZGV2aWNlcykuXG4gKiAgVGhlIHJldHVybmVkIHByb21pc2Ugc2hvdWxkIGJlIHJlc29sdmVkIG9uIGB0cnVlYCBpcyB0aGUgcHJvY2VzcyBzdWNjZWRlZCBvclxuICogIGBmYWxzZWAgaXMgdGhlIHByZWNlc3MgZmFpbGVkIChlLmcuIHBlcm1pc3Npb24gbm90IGdyYW50ZWQpLlxuICovXG5jb25zdCBkZWZhdWx0RGVmaW5pdGlvbnMgPSBbXG4gIHtcbiAgICBpZDogJ3dlYi1hdWRpbycsXG4gICAgY2hlY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICEhYXVkaW9Db250ZXh0O1xuICAgIH0sXG4gICAgaW50ZXJhY3Rpb25Ib29rOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICghY2xpZW50LnBsYXRmb3JtLmlzTW9iaWxlKVxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuXG4gICAgICBjb25zdCBnID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgICAgIGcuY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuICAgICAgZy5nYWluLnZhbHVlID0gMC4wMDAwMDAwMDE7IC8vIC0xODBkQiA/XG5cbiAgICAgIGNvbnN0IG8gPSBhdWRpb0NvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xuICAgICAgby5jb25uZWN0KGcpO1xuICAgICAgby5mcmVxdWVuY3kudmFsdWUgPSAyMDtcbiAgICAgIG8uc3RhcnQoMCk7XG5cbiAgICAgIC8vIHByZXZlbnQgYW5kcm9pZCB0byBzdG9wIGF1ZGlvIGJ5IGtlZXBpbmcgdGhlIG9zY2lsbGF0b3IgYWN0aXZlXG4gICAgICBpZiAoY2xpZW50LnBsYXRmb3JtLm9zICE9PSAnYW5kcm9pZCcpXG4gICAgICAgIG8uc3RvcChhdWRpb0NvbnRleHQuY3VycmVudFRpbWUgKyAwLjAxKTtcblxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBpZDogJ2ZpeC1pb3Mtc2FtcGxlcmF0ZScsXG4gICAgY2hlY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBpbnRlcmFjdGlvbkhvb2s6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKGNsaWVudC5wbGF0Zm9ybS5vcyA9PT0gJ2lvcycpIHtcbiAgICAgICAgLy8gaW4gaXBvZCwgd2hlbiB0aGUgcHJvYmxlbSBvY2N1cnMsIHNhbXBsZVJhdGUgaGFzIGJlZW4gb2JzZXJ2ZWRcbiAgICAgICAgLy8gdG8gYmUgc2V0IGF0IDE2MDAwSHosIGFzIG5vIGV4aGF1c3RpdmUgdGVzdGluZyBoYXMgYmVlbiBkb25lXG4gICAgICAgIC8vIGFzc3VtZSA8IDQwMDAwIGlzIGEgYmFkIHZhbHVlLlxuICAgICAgICBjb25zdCBsb2NhbFN0b3JhZ2VLZXkgPSAnc291bmR3b3JrczpmaXgtaW9zLXNhbXBsZXJhdGUnO1xuXG4gICAgICAgIGlmIChhdWRpb0NvbnRleHQuc2FtcGxlUmF0ZSA8IDQwMDAwKSB7XG4gICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKGxvY2FsU3RvcmFnZUtleSwgdHJ1ZSk7XG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCh0cnVlKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBoYXNSZWxvYWRlZCA9ICEhd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKGxvY2FsU3RvcmFnZUtleSk7XG5cbiAgICAgICAgaWYgKGhhc1JlbG9hZGVkKSB7XG4gICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGxvY2FsU3RvcmFnZUtleSk7XG4gICAgICAgICAgY2xpZW50LnBsYXRmb3JtLmhhc1JlbG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuICAgIH0sXG4gIH0sXG4gIHtcbiAgICAvLyBAbm90ZTogYHRvdWNoYCBmZWF0dXJlIHdvcmthcm91bmRcbiAgICAvLyBjZi4gaHR0cDovL3d3dy5zdHVjb3guY29tL2Jsb2cveW91LWNhbnQtZGV0ZWN0LWEtdG91Y2hzY3JlZW4vXG4gICAgaWQ6ICdtb2JpbGUtZGV2aWNlJyxcbiAgICBjaGVjazogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY2xpZW50LnBsYXRmb3JtLmlzTW9iaWxlO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGlkOiAnYXVkaW8taW5wdXQnLFxuICAgIGNoZWNrOiBmdW5jdGlvbigpIHtcbiAgICAgIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEgPSAoXG4gICAgICAgIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEgfHxcbiAgICAgICAgbmF2aWdhdG9yLndlYmtpdEdldFVzZXJNZWRpYSB8fFxuICAgICAgICBuYXZpZ2F0b3IubW96R2V0VXNlck1lZGlhIHx8XG4gICAgICAgIG5hdmlnYXRvci5tc0dldFVzZXJNZWRpYVxuICAgICAgKTtcblxuICAgICAgcmV0dXJuICEhbmF2aWdhdG9yLmdldFVzZXJNZWRpYTtcbiAgICB9LFxuICAgIHN0YXJ0SG9vazogZnVuY3Rpb24oKSB7XG4gICAgICAvLyBAdG9kbyAtIHVzZSBuZXcgbmF2aWdhdG9yLm1lZGlhRGV2aWNlcyBpZiBhdmFpbGFibGVcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgbmF2aWdhdG9yLmdldFVzZXJNZWRpYSh7IGF1ZGlvOiB0cnVlIH0sIGZ1bmN0aW9uKHN0cmVhbSkge1xuICAgICAgICAgIHN0cmVhbS5nZXRBdWRpb1RyYWNrcygpWzBdLnN0b3AoKTtcbiAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGlkOiAnZnVsbC1zY3JlZW4nLFxuICAgIGNoZWNrOiBmdW5jdGlvbigpIHtcbiAgICAgIC8vIGZ1bmN0aW9ubmFsaXR5IHRoYXQgY2Fubm90IGJyYWtlIHRoZSBhcHBsaWNhdGlvblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBpbnRlcmFjdGlvbkhvb2soKSB7XG4gICAgICBpZiAoc2NyZWVuZnVsbC5lbmFibGVkKVxuICAgICAgICBzY3JlZW5mdWxsLnJlcXVlc3QoKTtcblxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBpZDogJ2dlb2xvY2F0aW9uJyxcbiAgICBjaGVjazogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gISFuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uO1xuICAgIH0sXG4gICAgc3RhcnRIb29rOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbigocG9zaXRpb24pID0+IHtcbiAgICAgICAgICAvLyBwb3B1bGF0ZSBjbGllbnQgd2l0aCBmaXJzdCB2YWx1ZVxuICAgICAgICAgIGNvbnN0IGNvb3JkcyA9IHBvc2l0aW9uLmNvb3JkcztcbiAgICAgICAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBbY29vcmRzLmxhdGl0dWRlLCBjb29yZHMubG9uZ2l0dWRlXTtcbiAgICAgICAgICBjbGllbnQuZ2VvcG9zaXRpb24gPSBwb3NpdGlvbjtcblxuICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgIH0sIChlcnIpID0+IHtcbiAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH0sIHt9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGlkOiAnZ2VvbG9jYXRpb24tbW9jaycsXG4gICAgY2hlY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBzdGFydEhvb2s6IGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbGF0ID0gTWF0aC5yYW5kb20oKSAqIDM2MCAtIDE4MDtcbiAgICAgIGNvbnN0IGxuZyA9IE1hdGgucmFuZG9tKCkgKiAxODAgLSA5MDtcbiAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IFtsYXQsIGxuZ107XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIC8vIGFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vcmljaHRyL05vU2xlZXAuanMvYmxvYi9tYXN0ZXIvTm9TbGVlcC5qc1xuICAgIC8vIHdhcm5pbmc6IGNhdXNlIDE1MCUgY3B1IHVzZSBpbiBjaHJvbWUgZGVza3RvcC4uLlxuICAgIGlkOiAnd2FrZS1sb2NrJyxcbiAgICBjaGVjazogZnVuY3Rpb24oKSB7XG4gICAgICAvLyBmdW5jdGlvbm5hbGl0eSB0aGF0IGNhbm5vdCBicmFrZSB0aGUgYXBwbGljYXRpb25cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgaW50ZXJhY3Rpb25Ib29rOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChjbGllbnQucGxhdGZvcm0ub3MgPT09ICdpb3MnKSB7XG4gICAgICAgIHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSB3aW5kb3cubG9jYXRpb247XG4gICAgICAgICAgc2V0VGltZW91dCh3aW5kb3cuc3RvcCwgMCk7XG4gICAgICAgIH0sIDMwMDAwKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIG1lZGlhcyA9IHtcbiAgICAgICAgICB3ZWJtOiBcImRhdGE6dmlkZW8vd2VibTtiYXNlNjQsR2tYZm8wQWdRb2FCQVVMM2dRRkM4b0VFUXZPQkNFS0NRQVIzWldKdFFvZUJBa0tGZ1FJWVU0Qm5RSTBWU2FsbVFDZ3ExN0ZBQXc5Q1FFMkFRQVozYUdGdGJYbFhRVUFHZDJoaGJXMTVSSWxBQ0VDUFFBQUFBQUFBRmxTdWEwQXhya0F1MTRFQlk4V0JBWnlCQUNLMW5FQURkVzVraGtBRlZsOVdVRGdsaG9oQUExWlFPSU9CQWVCQUJyQ0JDTHFCQ0I5RHRuVkFJdWVCQUtOQUhJRUFBSUF3QVFDZEFTb0lBQWdBQVVBbUphUUFBM0FBL3Z6MEFBQT1cIixcbiAgICAgICAgICBtcDQ6IFwiZGF0YTp2aWRlby9tcDQ7YmFzZTY0LEFBQUFIR1owZVhCcGMyOXRBQUFDQUdsemIyMXBjMjh5YlhBME1RQUFBQWhtY21WbEFBQUFHMjFrWVhRQUFBR3pBQkFIQUFBQnRoQURBb3dkYmI5L0FBQUM2VzF2YjNZQUFBQnNiWFpvWkFBQUFBQjhKYkNBZkNXd2dBQUFBK2dBQUFBQUFBRUFBQUVBQUFBQUFBQUFBQUFBQUFBQkFBQUFBQUFBQUFBQUFBQUFBQUFBQVFBQUFBQUFBQUFBQUFBQUFBQUFRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFJQUFBSVZkSEpoYXdBQUFGeDBhMmhrQUFBQUQzd2xzSUI4SmJDQUFBQUFBUUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUJBQUFBQUFBQUFBQUFBQUFBQUFBQUFRQUFBQUFBQUFBQUFBQUFBQUFBUUFBQUFBQUlBQUFBQ0FBQUFBQUJzVzFrYVdFQUFBQWdiV1JvWkFBQUFBQjhKYkNBZkNXd2dBQUFBK2dBQUFBQVZjUUFBQUFBQUMxb1pHeHlBQUFBQUFBQUFBQjJhV1JsQUFBQUFBQUFBQUFBQUFBQVZtbGtaVzlJWVc1a2JHVnlBQUFBQVZ4dGFXNW1BQUFBRkhadGFHUUFBQUFCQUFBQUFBQUFBQUFBQUFBa1pHbHVaZ0FBQUJ4a2NtVm1BQUFBQUFBQUFBRUFBQUFNZFhKc0lBQUFBQUVBQUFFY2MzUmliQUFBQUxoemRITmtBQUFBQUFBQUFBRUFBQUNvYlhBMGRnQUFBQUFBQUFBQkFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBSUFBZ0FTQUFBQUVnQUFBQUFBQUFBQVFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQmovL3dBQUFGSmxjMlJ6QUFBQUFBTkVBQUVBQkR3Z0VRQUFBQUFERFVBQUFBQUFCUzBBQUFHd0FRQUFBYldKRXdBQUFRQUFBQUVnQU1TTmlCOUZBRVFCRkdNQUFBR3lUR0YyWXpVeUxqZzNMalFHQVFJQUFBQVljM1IwY3dBQUFBQUFBQUFCQUFBQUFRQUFBQUFBQUFBY2MzUnpZd0FBQUFBQUFBQUJBQUFBQVFBQUFBRUFBQUFCQUFBQUZITjBjM29BQUFBQUFBQUFFd0FBQUFFQUFBQVVjM1JqYndBQUFBQUFBQUFCQUFBQUxBQUFBR0IxWkhSaEFBQUFXRzFsZEdFQUFBQUFBQUFBSVdoa2JISUFBQUFBQUFBQUFHMWthWEpoY0hCc0FBQUFBQUFBQUFBQUFBQUFLMmxzYzNRQUFBQWpxWFJ2YndBQUFCdGtZWFJoQUFBQUFRQUFBQUJNWVhabU5USXVOemd1TXc9PVwiXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgJHZpZGVvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKTtcbiAgICAgICAgJHZpZGVvLnNldEF0dHJpYnV0ZSgnbG9vcCcsICcnKTtcblxuICAgICAgICBmb3IgKGxldCB0eXBlIGluIG1lZGlhcykge1xuICAgICAgICAgIGNvbnN0IGRhdGFVUkkgPSBtZWRpYXNbdHlwZV07XG4gICAgICAgICAgY29uc3QgJHNvdXJjZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NvdXJjZScpO1xuICAgICAgICAgICRzb3VyY2Uuc3JjID0gZGF0YVVSSTtcbiAgICAgICAgICAkc291cmNlLnR5cGUgPSBgdmlkZW8vJHt0eXBlfWA7XG5cbiAgICAgICAgICAkdmlkZW8uYXBwZW5kQ2hpbGQoJHNvdXJjZSk7XG4gICAgICAgIH1cblxuICAgICAgICAkdmlkZW8ucGxheSgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuICAgIH1cbiAgfVxuXTtcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOnBsYXRmb3JtJztcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBjbGllbnQgYCdwbGF0Zm9ybSdgIHNlcnZpY2UuXG4gKlxuICogVGhlIGBwbGF0Zm9ybWAgc2VydmljZXMgaXMgcmVzcG9uc2libGUgZm9yIGdpdmluZyBnZW5lcmFsIGluZm9ybWF0aW9uc1xuICogYWJvdXQgdGhlIHVzZXIncyBkZXZpY2UgYXMgd2VsbCBhcyBjaGVja2luZyBhdmFpbGFiaWxpdHkgYW5kIHByb3ZpZGluZyBob29rc1xuICogaW4gb3JkZXIgdG8gaW5pdGlhbGl6ZSB0aGUgZmVhdHVyZXMgcmVxdWlyZWQgYnkgdGhlIGFwcGxpY2F0aW9uIChhdWRpbyxcbiAqIG1pY3JvcGhvbmUsIGV0Yy4pLlxuICogSWYgb25lIG9mIHRoZSByZXF1aXJlZCBkZWZpbml0aW9ucyBpcyBub3QgYXZhaWxhYmxlLCBhIHZpZXcgaXMgY3JlYXRlZCB3aXRoXG4gKiBhbiBlcnJvciBtZXNzYWdlIGFuZCBgY2xpZW50LmNvbXBhdGlibGVgIGlzIHNldCB0byBgZmFsc2VgLlxuICpcbiAqIEF2YWlsYWJsZSBidWlsdC1pbiBkZWZpbml0aW9ucyBhcmU6XG4gKiAtICd3ZWItYXVkaW8nXG4gKiAtICdtb2JpbGUtZGV2aWNlJzogb25seS1hY2NlcHQgbW9iaWxlIGRldmljZXMgaW4gdGhlIGFwcGxpY2F0aW9uIChiYXNlZCBvblxuICogICBVc2VyLUFnZW50IHNuaWZmaW5nKVxuICogLSAnYXVkaW8taW5wdXQnOiBBbmRyb2lkIE9ubHlcbiAqIC0gJ2Z1bGwtc2NyZWVuJzogQW5kcm9pZCBPbmx5LCB0aGlzIGZlYXR1cmUgd29uJ3QgYmxvY2sgdGhlIGFwcGxpY2F0aW9uIGlmXG4gKiAgIG5vdCBhdmFpbGFibGUuXG4gKiAtICdnZW9sb2NhdGlvbic6IGNoZWNrIGlmIHRoZSBuYXZpZ2F0b3Igc3VwcG9ydHMgZ2VvbG9jYXRpb24uIFRoZSBgY29vcmRpbmF0ZXNgXG4gKiAgIGFuZCBgZ2VvcG9zaXRpb25gIG9mIHRoZSBgY2xpZW50YCBhcmUgcG9wdWxhdGVkIHdoZW4gdGhlIHBsYWZvcm0gc2VydmljZVxuICogICByZXNvbHZlcy4gKGlmIG5vIHVwZGF0ZSBvZiB0aGUgY29vcmRpbmF0ZXMgYXJlIG5lZWRlZCBpbiB0aGUgYXBwbGljYXRpb24sXG4gKiAgIHJlcXVpcmluZyBnZW9sb2NhdGlvbiBmZWF0dXJlIHdpdGhvdXQgdXNpbmcgdGhlIEdlb2xvY2F0aW9uIHNlcnZpY2Ugc2hvdWxkXG4gKiAgIHN1ZmZpY2UpLlxuICogLSAnd2FrZS1sb2NrJzogdXNlIHdpdGggY2F1dGlvbiwgaGFzIGJlZW4gb2JzZXJ2ZWQgY29uc3VtbWluZ1xuICogICAxNTAlIGNwdSBpbiBjaHJvbWUgZGVza3RvcC5cbiAqXG4gKlxuICogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZVxuICogaW5zdGFuY2lhdGVkIG1hbnVhbGx5X1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge0FycmF5PFN0cmluZz58U3RyaW5nfSBvcHRpb25zLmZlYXR1cmVzIC0gSWQocykgb2YgdGhlIGZlYXR1cmUocylcbiAqICByZXF1aXJlZCBieSB0aGUgYXBwbGljYXRpb24uIEF2YWlsYWJsZSBidWlsZC1pbiBmZWF0dXJlcyBhcmU6XG4gKiAgLSAnd2ViLWF1ZGlvJ1xuICogIC0gJ21vYmlsZS1kZXZpY2UnOiBvbmx5IGFjY2VwdCBtb2JpbGUgZGV2aWNlcyAocmVjb2duaXRpb24gYmFzZWQgVXNlci1BZ2VudClcbiAqICAtICdhdWRpby1pbnB1dCc6IEFuZHJvaWQgb25seVxuICogIC0gJ2Z1bGwtc2NyZWVuJzogQW5kcm9pZCBvbmx5XG4gKiAgLSAnZ2VvbG9jYXRpb24nOiBhY2NlcHQgZ2VvbG9jYWxpemVkIGRldmljZXMuIFBvcHVsYXRlIHRoZSBjbGllbnQgd2l0aFxuICogICAgIGN1cnJlbnQgcG9zaXRpb25cbiAqICAtICd3YWtlLWxvY2snOiB0aGlzIGZlYXR1cmUgc2hvdWxkIGJlIHVzZWQgd2l0aCBjYXV0aW9uIGFzXG4gKiAgICAgaXQgaGFzIGJlZW4gb2JzZXJ2ZWQgdG8gdXNlIDE1MCUgb2YgY3B1IGluIGNocm9tZSBkZXNrdG9wLlxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5zaG93RGlhbG9nPXRydWVdIC0gSWYgc2V0IHRvIGBmYWxzZWAsIHRoZSBzZXJ2aWNlXG4gKiAgZXhlY3V0ZSBhbGwgaG9va3Mgd2l0aG91dCB3YWl0aW5nIGZvciBhIHVzZXIgaW50ZXJhY3Rpb24gYW5kIGRvZXNuJ3Qgc2hvd1xuICogIHRoZSBzZXJ2aWNlJ3Mgdmlldy4gVGhpcyBvcHRpb24gc2hvdWxkIG9ubHkgYmUgdXNlZCBvbiBjb250cm9sbGVkXG4gKiAgZW52aXJvbm5lbWVudHMgd2hlcmUgdGhlIHRhcmdldCBwbGF0Zm9ybSBpcyBrbm93biBmb3Igd29ya2luZyB3aXRob3V0XG4gKiAgdGhpcyBuZWVkIChlLmcuIGlzIG5vdCBpT1MpLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBleGFtcGxlXG4gKiAvLyBpbnNpZGUgdGhlIGV4cGVyaWVuY2UgY29uc3RydWN0b3JcbiAqIHRoaXMucGxhdGZvcm0gPSB0aGlzLnJlcXVpcmUoJ3BsYXRmb3JtJywgeyBmZWF0dXJlczogJ3dlYi1hdWRpbycgfSk7XG4gKlxuICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LmNsaWVudCNwbGF0Zm9ybX1cbiAqL1xuY2xhc3MgUGxhdGZvcm0gZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgZmFsc2UpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBzaG93RGlhbG9nOiB0cnVlLFxuICAgICAgdmlldzogbnVsbCxcbiAgICAgIHZpZXdQcmlvcml0eTogMTAsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIHRoaXMudmlldyA9IG51bGw7XG5cbiAgICAvLyB0aGlzLl9kZWZhdWx0Vmlld1RlbXBsYXRlID0gZGVmYXVsdFZpZXdUZW1wbGF0ZTtcbiAgICAvLyB0aGlzLl9kZWZhdWx0Vmlld0NvbnRlbnQgPSBkZWZhdWx0Vmlld0NvbnRlbnQ7XG5cbiAgICB0aGlzLl9yZXF1aXJlZEZlYXR1cmVzID0gbmV3IFNldCgpO1xuICAgIHRoaXMuX2ZlYXR1cmVEZWZpbml0aW9ucyA9IHt9O1xuXG4gICAgZGVmYXVsdERlZmluaXRpb25zLmZvckVhY2goKGRlZikgPT4gdGhpcy5hZGRGZWF0dXJlRGVmaW5pdGlvbihkZWYpKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBjb25maWd1cmUob3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zLmZlYXR1cmVzKSB7XG4gICAgICBsZXQgZmVhdHVyZXMgPSBvcHRpb25zLmZlYXR1cmVzO1xuXG4gICAgICBpZiAodHlwZW9mIGZlYXR1cmVzID09PSAnc3RyaW5nJylcbiAgICAgICAgZmVhdHVyZXMgPSBbZmVhdHVyZXNdO1xuXG4gICAgICBpZiAoZmVhdHVyZXMuaW5kZXhPZignd2ViLWF1ZGlvJykgIT09IC0xKVxuICAgICAgICBmZWF0dXJlcy5wdXNoKCdmaXgtaW9zLXNhbXBsZXJhdGUnKTtcblxuICAgICAgY29uc29sZS5sb2coZmVhdHVyZXMpO1xuICAgICAgdGhpcy5yZXF1aXJlRmVhdHVyZSguLi5mZWF0dXJlcyk7XG5cbiAgICAgIGRlbGV0ZSBvcHRpb25zLmZlYXR1cmVzO1xuICAgIH1cblxuICAgIHN1cGVyLmNvbmZpZ3VyZShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgU3RhcnQgdGhlIGNsaWVudC5cbiAgICogIEFsZ29yaXRobTpcbiAgICogIC0gY2hlY2sgcmVxdWlyZWQgZmVhdHVyZXNcbiAgICogIC0gaWYgKGZhbHNlKVxuICAgKiAgICAgc2hvdyAnc29ycnknIHNjcmVlblxuICAgKiAgLSBlbHNlXG4gICAqICAgICBzaG93ICd3ZWxjb21lJyBzY3JlZW5cbiAgICogICAgIGV4ZWN1dGUgc3RhcnQgaG9vayAocHJvbWlzZSlcbiAgICogICAgIC0gaWYgKHByb21pc2UgPT09IHRydWUpXG4gICAqICAgICAgICBzaG93IHRvdWNoIHRvIHN0YXJ0XG4gICAqICAgICAgICBiaW5kIGV2ZW50c1xuICAgKiAgICAgLSBlbHNlXG4gICAqICAgICAgICBzaG93ICdzb3JyeScgc2NyZWVuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgdGhpcy5fZGVmaW5lQXVkaW9GaWxlRXh0ZW50aW9uKCk7XG4gICAgdGhpcy5fZGVmaW5lUGxhdGZvcm0oKTtcblxuICAgIC8vIHJlc29sdmUgcmVxdWlyZWQgZmVhdHVyZXMgZnJvbSB0aGUgYXBwbGljYXRpb25cbiAgICBjbGllbnQuY29tcGF0aWJsZSA9IHRoaXMuX2NoZWNrUmVxdWlyZWRGZWF0dXJlcygpO1xuXG4gICAgLy8gaGFuZGxlIGBzaG93RGlhbG9nID09PSBmYWxzZWBcbiAgICBpZiAodGhpcy5vcHRpb25zLnNob3dEaWFsb2cgPT09IGZhbHNlKSB7XG4gICAgICBpZiAoY2xpZW50LmNvbXBhdGlibGUpIHtcbiAgICAgICAgY29uc3Qgc3RhcnRQcm9taXNlcyA9IHRoaXMuX2dldEhvb2tzKCdzdGFydEhvb2snKTtcbiAgICAgICAgY29uc3QgaW50ZXJhY3Rpb25Qcm9taXNlcyA9IHRoaXMuX2dldEhvb2tzKCdpbnRlcmFjdGlvbkhvb2snKTtcbiAgICAgICAgY29uc3QgcHJvbWlzZXMgPSBbXS5jb25jYXQoc3RhcnRQcm9taXNlcywgaW50ZXJhY3Rpb25Qcm9taXNlcyk7XG5cbiAgICAgICAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4ocmVzdWx0cyA9PiB7XG4gICAgICAgICAgbGV0IHJlc29sdmVkID0gdHJ1ZTtcbiAgICAgICAgICByZXN1bHRzLmZvckVhY2goYm9vbCA9PiByZXNvbHZlZCA9IHJlc29sdmVkICYmIGJvb2wpO1xuXG4gICAgICAgICAgaWYgKHJlc29sdmVkKVxuICAgICAgICAgICAgdGhpcy5yZWFkeSgpO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgc2VydmljZTpwbGF0Zm9ybSAtIGRpZG4ndCBvYnRhaW4gdGhlIG5lY2Vzc2FyeSBhdXRob3JpemF0aW9uc2ApO1xuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdzZXJ2aWNlOnBsYXRmb3JtIC0gY2xpZW50IG5vdCBjb21wYXRpYmxlJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGRlZmF1bHQgdmlldyB2YWx1ZXNcbiAgICAgIHRoaXMudmlldy51cGRhdGVDaGVja2luZ1N0YXR1cyhmYWxzZSk7XG4gICAgICB0aGlzLnZpZXcudXBkYXRlSXNDb21wYXRpYmxlU3RhdHVzKG51bGwpO1xuICAgICAgdGhpcy52aWV3LnVwZGF0ZUhhc0F1dGhvcml6YXRpb25zU3RhdHVzKG51bGwpO1xuXG4gICAgICBpZiAoIWNsaWVudC5jb21wYXRpYmxlKSB7XG4gICAgICAgIHRoaXMudmlldy51cGRhdGVJc0NvbXBhdGlibGVTdGF0dXMoZmFsc2UpO1xuICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudmlldy51cGRhdGVJc0NvbXBhdGlibGVTdGF0dXModHJ1ZSk7XG4gICAgICAgIHRoaXMudmlldy51cGRhdGVDaGVja2luZ1N0YXR1cyh0cnVlKTtcbiAgICAgICAgdGhpcy5zaG93KCk7XG5cbiAgICAgICAgLy8gZXhlY3V0ZSBzdGFydCBob29rXG4gICAgICAgIGNvbnN0IHN0YXJ0UHJvbWlzZXMgPSB0aGlzLl9nZXRIb29rcygnc3RhcnRIb29rJyk7XG5cbiAgICAgICAgUHJvbWlzZS5hbGwoc3RhcnRQcm9taXNlcykudGhlbihyZXN1bHRzID0+IHtcbiAgICAgICAgICAvLyBpZiBvbmUgb2YgdGhlIHN0YXJ0IGhvb2sgZmFpbGVkXG4gICAgICAgICAgbGV0IGhhc0F1dGhvcml6YXRpb25zID0gdHJ1ZTtcbiAgICAgICAgICByZXN1bHRzLmZvckVhY2goc3VjY2VzcyA9PiBoYXNBdXRob3JpemF0aW9ucyA9IGhhc0F1dGhvcml6YXRpb25zICYmIHN1Y2Nlc3MpO1xuXG4gICAgICAgICAgdGhpcy52aWV3LnVwZGF0ZUhhc0F1dGhvcml6YXRpb25zU3RhdHVzKGhhc0F1dGhvcml6YXRpb25zKTtcbiAgICAgICAgICB0aGlzLnZpZXcudXBkYXRlQ2hlY2tpbmdTdGF0dXMoZmFsc2UpO1xuXG4gICAgICAgICAgaWYgKGhhc0F1dGhvcml6YXRpb25zKSB7XG4gICAgICAgICAgICB0aGlzLnZpZXcuc2V0VG91Y2hTdGFydENhbGxiYWNrKHRoaXMuX29uSW50ZXJhY3Rpb24oJ3RvdWNoJykpO1xuICAgICAgICAgICAgdGhpcy52aWV3LnNldE1vdXNlRG93bkNhbGxiYWNrKHRoaXMuX29uSW50ZXJhY3Rpb24oJ21vdXNlJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkuY2F0Y2goKGVycikgPT4gY29uc29sZS5lcnJvcihlcnIuc3RhY2spKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RvcCgpIHtcbiAgICB0aGlzLmhpZGUoKTtcbiAgICBzdXBlci5zdG9wKCk7XG4gIH1cblxuICAvKipcbiAgICogU3RydWN0dXJlIG9mIHRoZSBkZWZpbml0aW9uIGZvciB0aGUgdGVzdCBvZiBhIGZlYXR1cmUuXG4gICAqXG4gICAqIEBwYXJhbSB7bW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYXRmb3JtfmRlZmluaXRpb259IG9iaiAtIERlZmluaXRpb24gb2ZcbiAqXG4gICAqICB0aGUgZmVhdHVyZS5cbiAgICovXG4gIGFkZEZlYXR1cmVEZWZpbml0aW9uKG9iaikge1xuICAgIHRoaXMuX2ZlYXR1cmVEZWZpbml0aW9uc1tvYmouaWRdID0gb2JqO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcXVpcmUgZmVhdHVyZXMgZm9yIHRoZSBhcHBsaWNhdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHsuLi5TdHJpbmd9IGZlYXR1cmVzIC0gSWQocykgb2YgdGhlIGZlYXR1cmUocykgdG8gYmUgcmVxdWlyZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXF1aXJlRmVhdHVyZSguLi5mZWF0dXJlcykge1xuICAgIGZlYXR1cmVzLmZvckVhY2goKGlkKSA9PiB0aGlzLl9yZXF1aXJlZEZlYXR1cmVzLmFkZChpZCkpO1xuICB9XG5cblxuICAvKipcbiAgICogRXhlY3V0ZSBgaW50ZXJhY3Rpb25zYCBob29rcyBmcm9tIHRoZSBgcGxhdGZvcm1gIHNlcnZpY2UuXG4gICAqIEFsc28gYWN0aXZhdGUgdGhlIG1lZGlhIGFjY29yZGluZyB0byB0aGUgYG9wdGlvbnNgLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX29uSW50ZXJhY3Rpb24odHlwZSkge1xuICAgIHJldHVybiAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgY2xpZW50LnBsYXRmb3JtLmludGVyYWN0aW9uID0gdHlwZTtcbiAgICAgIC8vIGV4ZWN1dGUgaW50ZXJhY3Rpb24gaG9va3MgZnJvbSB0aGUgcGxhdGZvcm1cbiAgICAgIGNvbnN0IGludGVyYWN0aW9uUHJvbWlzZXMgPSB0aGlzLl9nZXRIb29rcygnaW50ZXJhY3Rpb25Ib29rJyk7XG5cbiAgICAgIFByb21pc2UuYWxsKGludGVyYWN0aW9uUHJvbWlzZXMpLnRoZW4oKHJlc3VsdHMpID0+IHtcbiAgICAgICAgbGV0IHJlc29sdmVkID0gdHJ1ZTtcbiAgICAgICAgcmVzdWx0cy5mb3JFYWNoKGJvb2wgPT4gcmVzb2x2ZWQgPSByZXNvbHZlZCAmJiBib29sKTtcblxuICAgICAgICBpZiAocmVzb2x2ZWQpIHtcbiAgICAgICAgICB0aGlzLnJlYWR5KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy52aWV3LnVwZGF0ZUhhc0F1dGhvcml6YXRpb25zU3RhdHVzKHJlc29sdmVkKTtcbiAgICAgICAgfVxuICAgICAgfSkuY2F0Y2goKGVycikgPT4gY29uc29sZS5lcnJvcihlcnIuc3RhY2spKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZSBhbGwgYGNoZWNrYCBmdW5jdGlvbnMgZGVmaW5lZCBpbiB0aGUgcmVxdWlyZWQgZmVhdHVyZXMuXG4gICAqXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IC0gYHRydWVgIGlmIGFsbCBjaGVja3MgcGFzcywgYGZhbHNlYCBvdGhlcndpc2UuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfY2hlY2tSZXF1aXJlZEZlYXR1cmVzKCkge1xuICAgIGxldCByZXN1bHQgPSB0cnVlO1xuXG4gICAgdGhpcy5fcmVxdWlyZWRGZWF0dXJlcy5mb3JFYWNoKGZlYXR1cmUgPT4ge1xuICAgICAgY29uc3QgY2hlY2tGdW5jdGlvbiA9IHRoaXMuX2ZlYXR1cmVEZWZpbml0aW9uc1tmZWF0dXJlXS5jaGVjaztcblxuICAgICAgaWYgKCEodHlwZW9mIGNoZWNrRnVuY3Rpb24gPT09ICdmdW5jdGlvbicpKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIGNoZWNrIGZ1bmN0aW9uIGRlZmluZWQgZm9yICR7ZmVhdHVyZX0gZmVhdHVyZWApO1xuXG4gICAgICByZXN1bHQgPSByZXN1bHQgJiYgY2hlY2tGdW5jdGlvbigpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfZ2V0SG9va3ModHlwZSkge1xuICAgIGNvbnN0IGhvb2tzID0gW107XG5cbiAgICB0aGlzLl9yZXF1aXJlZEZlYXR1cmVzLmZvckVhY2goZmVhdHVyZSA9PiB7XG4gICAgICBjb25zdCBob29rID0gdGhpcy5fZmVhdHVyZURlZmluaXRpb25zW2ZlYXR1cmVdW3R5cGVdO1xuXG4gICAgICBpZiAoaG9vaylcbiAgICAgICAgaG9va3MucHVzaChob29rKTtcbiAgICB9KTtcblxuICAgIC8vIHJldHVybiBhbiBhcnJheSBvZiBQcm9taXNlcyBpbnN0ZWFkIG9mIGZ1bmN0aW9uXG4gICAgcmV0dXJuIGhvb2tzLm1hcChob29rID0+IGhvb2soKSk7XG4gIH1cblxuICAvKipcbiAgICogUG9wdWxhdGUgYGNsaWVudC5wbGF0Zm9ybWAgd2l0aCB0aGUgcHJlZmVyZWQgYXVkaW8gZmlsZSBleHRlbnRpb25cbiAgICogZm9yIHRoZSBwbGF0Zm9ybS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9kZWZpbmVBdWRpb0ZpbGVFeHRlbnRpb24oKSB7XG4gICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2F1ZGlvJyk7XG4gICAgLy8gaHR0cDovL2RpdmVpbnRvaHRtbDUuaW5mby9ldmVyeXRoaW5nLmh0bWxcbiAgICBpZiAoISEoYS5jYW5QbGF5VHlwZSAmJiBhLmNhblBsYXlUeXBlKCdhdWRpby9tcGVnOycpKSlcbiAgICAgIGNsaWVudC5wbGF0Zm9ybS5hdWRpb0ZpbGVFeHQgPSAnLm1wMyc7XG4gICAgZWxzZSBpZiAoISEoYS5jYW5QbGF5VHlwZSAmJiBhLmNhblBsYXlUeXBlKCdhdWRpby9vZ2c7IGNvZGVjcz1cInZvcmJpc1wiJykpKVxuICAgICAgY2xpZW50LnBsYXRmb3JtLmF1ZGlvRmlsZUV4dCA9ICcub2dnJztcbiAgICBlbHNlXG4gICAgICBjbGllbnQucGxhdGZvcm0uYXVkaW9GaWxlRXh0ID0gJy53YXYnO1xuICB9XG5cbiAgLyoqXG4gICAqIFBvcHVsYXRlIGBjbGllbnQucGxhdGZvcm1gIHdpdGggdGhlIG9zIG5hbWUuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfZGVmaW5lUGxhdGZvcm0oKSB7XG4gICAgY29uc3QgdWEgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudFxuICAgIGNvbnN0IG1kID0gbmV3IE1vYmlsZURldGVjdCh1YSk7XG5cbiAgICBjbGllbnQucGxhdGZvcm0uaXNNb2JpbGUgPSAobWQubW9iaWxlKCkgIT09IG51bGwpOyAvLyB0cnVlIGlmIHBob25lIG9yIHRhYmxldFxuICAgIGNsaWVudC5wbGF0Zm9ybS5vcyA9IChmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG9zID0gbWQub3MoKTtcblxuICAgICAgaWYgKG9zID09PSAnQW5kcm9pZE9TJylcbiAgICAgICAgcmV0dXJuICdhbmRyb2lkJztcbiAgICAgIGVsc2UgaWYgKG9zID09PSAnaU9TJylcbiAgICAgICAgcmV0dXJuICdpb3MnO1xuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gJ290aGVyJztcbiAgICB9KSgpO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFBsYXRmb3JtKTtcblxuZXhwb3J0IGRlZmF1bHQgUGxhdGZvcm07XG4iXX0=