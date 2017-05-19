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

      // handle `showDisplay === false`
      if (this.options.showDisplay === false) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYXRmb3JtLmpzIl0sIm5hbWVzIjpbImRlZmF1bHREZWZpbml0aW9ucyIsImlkIiwiY2hlY2siLCJpbnRlcmFjdGlvbkhvb2siLCJwbGF0Zm9ybSIsImlzTW9iaWxlIiwicmVzb2x2ZSIsImciLCJjcmVhdGVHYWluIiwiY29ubmVjdCIsImRlc3RpbmF0aW9uIiwiZ2FpbiIsInZhbHVlIiwibyIsImNyZWF0ZU9zY2lsbGF0b3IiLCJmcmVxdWVuY3kiLCJzdGFydCIsIm9zIiwic3RvcCIsImN1cnJlbnRUaW1lIiwibmF2aWdhdG9yIiwiZ2V0VXNlck1lZGlhIiwid2Via2l0R2V0VXNlck1lZGlhIiwibW96R2V0VXNlck1lZGlhIiwibXNHZXRVc2VyTWVkaWEiLCJzdGFydEhvb2siLCJyZWplY3QiLCJhdWRpbyIsInN0cmVhbSIsImdldEF1ZGlvVHJhY2tzIiwiZXJyIiwiZW5hYmxlZCIsInJlcXVlc3QiLCJnZW9sb2NhdGlvbiIsImdldEN1cnJlbnRQb3NpdGlvbiIsInBvc2l0aW9uIiwiY29vcmRzIiwiY29vcmRpbmF0ZXMiLCJsYXRpdHVkZSIsImxvbmdpdHVkZSIsImdlb3Bvc2l0aW9uIiwibGF0IiwiTWF0aCIsInJhbmRvbSIsImxuZyIsInNldEludGVydmFsIiwid2luZG93IiwibG9jYXRpb24iLCJzZXRUaW1lb3V0IiwibWVkaWFzIiwid2VibSIsIm1wNCIsIiR2aWRlbyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInNldEF0dHJpYnV0ZSIsInR5cGUiLCJkYXRhVVJJIiwiJHNvdXJjZSIsInNyYyIsImFwcGVuZENoaWxkIiwicGxheSIsIlNFUlZJQ0VfSUQiLCJQbGF0Zm9ybSIsImRlZmF1bHRzIiwic2hvd0RpYWxvZyIsInZpZXciLCJ2aWV3UHJpb3JpdHkiLCJjb25maWd1cmUiLCJfcmVxdWlyZWRGZWF0dXJlcyIsIl9mZWF0dXJlRGVmaW5pdGlvbnMiLCJmb3JFYWNoIiwiZGVmIiwiYWRkRmVhdHVyZURlZmluaXRpb24iLCJvcHRpb25zIiwiZmVhdHVyZXMiLCJyZXF1aXJlRmVhdHVyZSIsIl9kZWZpbmVBdWRpb0ZpbGVFeHRlbnRpb24iLCJfZGVmaW5lUGxhdGZvcm0iLCJjb21wYXRpYmxlIiwiX2NoZWNrUmVxdWlyZWRGZWF0dXJlcyIsInNob3dEaXNwbGF5Iiwic3RhcnRQcm9taXNlcyIsIl9nZXRIb29rcyIsImludGVyYWN0aW9uUHJvbWlzZXMiLCJwcm9taXNlcyIsImNvbmNhdCIsImFsbCIsInRoZW4iLCJyZXNvbHZlZCIsInJlc3VsdHMiLCJib29sIiwicmVhZHkiLCJFcnJvciIsInVwZGF0ZUNoZWNraW5nU3RhdHVzIiwidXBkYXRlSXNDb21wYXRpYmxlU3RhdHVzIiwidXBkYXRlSGFzQXV0aG9yaXphdGlvbnNTdGF0dXMiLCJzaG93IiwiaGFzQXV0aG9yaXphdGlvbnMiLCJzdWNjZXNzIiwic2V0VG91Y2hTdGFydENhbGxiYWNrIiwiX29uSW50ZXJhY3Rpb24iLCJzZXRNb3VzZURvd25DYWxsYmFjayIsImNhdGNoIiwiY29uc29sZSIsImVycm9yIiwic3RhY2siLCJoaWRlIiwib2JqIiwiYWRkIiwiZSIsInByZXZlbnREZWZhdWx0Iiwic3RvcFByb3BhZ2F0aW9uIiwiaW50ZXJhY3Rpb24iLCJyZXN1bHQiLCJjaGVja0Z1bmN0aW9uIiwiZmVhdHVyZSIsImhvb2tzIiwiaG9vayIsInB1c2giLCJtYXAiLCJhIiwiY2FuUGxheVR5cGUiLCJhdWRpb0ZpbGVFeHQiLCJ1YSIsInVzZXJBZ2VudCIsIm1kIiwibW9iaWxlIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBOzs7Ozs7OztBQVFBOzs7Ozs7Ozs7Ozs7QUFZQTs7Ozs7Ozs7Ozs7O0FBWUE7Ozs7Ozs7Ozs7O0FBV0E7Ozs7Ozs7Ozs7O0FBV0E7Ozs7Ozs7Ozs7Ozs7QUFhQTs7Ozs7Ozs7O0FBU0E7Ozs7Ozs7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RUFBSCxFQUFYOztBQUVBLFlBQUlBLE9BQU8sV0FBWCxFQUNFLE9BQU8sU0FBUCxDQURGLEtBRUssSUFBSUEsT0FBTyxLQUFYLEVBQ0gsT0FBTyxLQUFQLENBREcsS0FHSCxPQUFPLE9BQVA7QUFDSCxPQVRvQixFQUFyQjtBQVVEOzs7OztBQUdILHlCQUFlK0csUUFBZixDQUF3QmxFLFVBQXhCLEVBQW9DQyxRQUFwQzs7a0JBRWVBLFEiLCJmaWxlIjoiUGxhdGZvcm0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhdWRpb0NvbnRleHQgfSBmcm9tICd3YXZlcy1hdWRpbyc7XG5pbXBvcnQgY2xpZW50IGZyb20gJy4uL2NvcmUvY2xpZW50JztcbmltcG9ydCBNb2JpbGVEZXRlY3QgZnJvbSAnbW9iaWxlLWRldGVjdCc7XG5pbXBvcnQgc2NyZWVuZnVsbCBmcm9tICdzY3JlZW5mdWxsJztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbi8qKlxuICogQVBJIG9mIGEgY29tcGxpYW50IHZpZXcgZm9yIHRoZSBgcGxhdGZvcm1gIHNlcnZpY2UuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQGludGVyZmFjZSBBYnN0cmFjdFBsYXRmb3JtVmlld1xuICogQGV4dGVuZHMgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0Vmlld1xuICogQGFic3RyYWN0XG4gKi9cbi8qKlxuICogUmVnaXN0ZXIgdGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiB0aGUgdXNlciB0b3VjaGVzIHRoZSBzY3JlZW4gZm9yIHRoZSBmaXJzdCB0aW1lLlxuICpcbiAqIEBuYW1lIHNldFRvdWNoU3RhcnRDYWxsYmFja1xuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BYnN0cmFjdFBsYXRmb3JtVmlld1xuICogQGZ1bmN0aW9uXG4gKiBAYWJzdHJhY3RcbiAqIEBpbnN0YW5jZVxuICpcbiAqIEBwYXJhbSB7dG91Y2hTdGFydENhbGxiYWNrfSBjYWxsYmFjayAtIENhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiB0aGUgdXNlclxuICogIHRvdWNoZXMgdGhlIHNjcmVlbiBmb3IgdGhlIGZpcnN0IHRpbWUuXG4gKi9cbi8qKlxuICogUmVnaXN0ZXIgdGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiB0aGUgdXNlciBjbGlja3MgdGhlIHNjcmVlbiBmb3IgdGhlIGZpcnN0IHRpbWUuXG4gKlxuICogQG5hbWUgc2V0TW91c2Vkb3duQ2FsbGJhY2tcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWJzdHJhY3RQbGF0Zm9ybVZpZXdcbiAqIEBmdW5jdGlvblxuICogQGFic3RyYWN0XG4gKiBAaW5zdGFuY2VcbiAqXG4gKiBAcGFyYW0ge21vdXNlRG93bkNhbGxiYWNrfSBjYWxsYmFjayAtIENhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiB0aGUgdXNlclxuICogIGNsaWNrcyB0aGUgc2NyZWVuIGZvciB0aGUgZmlyc3QgdGltZS5cbiAqL1xuLyoqXG4gKiBVcGRhdGUgdGhlIHZpZXcgdG8gbm90aWZ5IHRoYXQgdGhlIGNvbXBhdGliaWxpdHkgY2hlY2tzIGFyZSB0ZXJtaW5hdGVkLlxuICpcbiAqIEBuYW1lIHVwZGF0ZUNoZWNraW5nU3RhdHVzXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0UGxhdGZvcm1WaWV3XG4gKiBAZnVuY3Rpb25cbiAqIEBhYnN0cmFjdFxuICogQGluc3RhbmNlXG4gKlxuICogQHBhcmFtIHtCb29sZWFufSB2YWx1ZVxuICovXG4vKipcbiAqIFVwZGF0ZSB0aGUgdmlldyB0byBub3RpZnkgaWYgdGhlIGRldmljZSBpcyBjb21wYXRpYmxlIG9yIG5vdC5cbiAqXG4gKiBAbmFtZSB1cGRhdGVJc0NvbXBhdGlibGVTdGF0dXNcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWJzdHJhY3RQbGF0Zm9ybVZpZXdcbiAqIEBmdW5jdGlvblxuICogQGFic3RyYWN0XG4gKiBAaW5zdGFuY2VcbiAqXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHZhbHVlXG4gKi9cbi8qKlxuICogVXBkYXRlIHRoZSB2aWV3IHRvIG5vdGlmeSBpZiB0aGUgYXBwbGljYXRpb24gb2J0YWluZWQgYWxsIHRoZSBhdXRob3JpemF0aW9uc1xuICogb3Igbm90LlxuICpcbiAqIEBuYW1lIHVwZGF0ZUhhc0F1dGhvcml6YXRpb25zU3RhdHVzXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0UGxhdGZvcm1WaWV3XG4gKiBAZnVuY3Rpb25cbiAqIEBhYnN0cmFjdFxuICogQGluc3RhbmNlXG4gKlxuICogQHBhcmFtIHtCb29sZWFufSB2YWx1ZVxuICovXG5cbi8qKlxuICogQ2FsbGJhY2sgdG8gZXhlY3V0ZSB3aGVuIHRoZSB1c2VyIHRvdWNoZXMgdGhlIHNjcmVlbiBmb3IgdGhlIGZpcnN0IHRpbWUuXG4gKlxuICogQGNhbGxiYWNrXG4gKiBAbmFtZSB0b3VjaFN0YXJ0Q2FsbGJhY2tcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWJzdHJhY3RQbGF0Zm9ybVZpZXdcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcGFzc3dvcmQgLSBQYXNzd29yZCBnaXZlbiBieSB0aGUgdXNlci5cbiAqL1xuLyoqXG4gKiBDYWxsYmFjayB0byBleGVjdXRlIHdoZW4gdGhlIHVzZXIgY2xpY2tzIHRoZSBzY3JlZW4gZm9yIHRoZSBmaXJzdCB0aW1lLlxuICpcbiAqIEBjYWxsYmFja1xuICogQG5hbWUgbW91c2VEb3duQ2FsbGJhY2tcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWJzdHJhY3RQbGF0Zm9ybVZpZXdcbiAqL1xuXG5cblxuLyoqXG4gKiBTdHJ1Y3R1cmUgb2YgdGhlIGRlZmluaXRpb24gZm9yIHRoZSB0ZXN0IG9mIGEgZmVhdHVyZS5cbiAqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhdGZvcm1+ZGVmaW5pdGlvblxuICpcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBpZCAtIElkIG9mIHRoZSBkZWZpbml0aW9uLlxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gY2hlY2sgLSBBIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIHJldHVybiBgdHJ1ZWAgaWYgdGhlXG4gKiAgZmVhdHVyZSBpcyBhdmFpbGFibGUgb24gdGhlIHBsYXRmb3JtLCBgZmFsc2VgIG90aGVyd2lzZS5cbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IFtzdGFydEhvb2tdIC0gQSBmdW5jdGlvbiByZXR1cm5pbmcgYSBgUHJvbWlzZWAgdG8gYmVcbiAqICBleGVjdXRlZCBvbiBzdGFydCAoZm9yIGV4YW1wbGUgdG8gYXNrIGFjY2VzcyB0byBtaWNyb3Bob25lIG9yIGdlb2xvY2F0aW9uKS5cbiAqICBUaGUgcmV0dXJuZWQgcHJvbWlzZSBzaG91bGQgYmUgcmVzb2x2ZWQgb24gYHRydWVgIGlzIHRoZSBwcm9jZXNzIHN1Y2NlZGVkIG9yXG4gKiAgYGZhbHNlYCBpcyB0aGUgcHJlY2VzcyBmYWlsZWQgKGUuZy4gcGVybWlzc2lvbiBub3QgZ3JhbnRlZCkuXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBbaW50ZXJhY3Rpb25Ib29rXSAtIEEgZnVuY3Rpb24gcmV0dXJuaW5nIGEgUHJvbWlzZXRvIGJlXG4gKiAgZXhlY3V0ZWQgb24gdGhlIGZpcnN0IGludGVyYWN0aW9uIChpLmUuIGBjbGlja2Agb3IgYHRvdWNoc3RhcnRgKSBvZiB0aGUgdXNlclxuICogIHdpdGggYXBwbGljYXRpb24gKGZvciBleGFtcGxlLCB0byBpbml0aWFsaXplIEF1ZGlvQ29udGV4dCBvbiBpT1MgZGV2aWNlcykuXG4gKiAgVGhlIHJldHVybmVkIHByb21pc2Ugc2hvdWxkIGJlIHJlc29sdmVkIG9uIGB0cnVlYCBpcyB0aGUgcHJvY2VzcyBzdWNjZWRlZCBvclxuICogIGBmYWxzZWAgaXMgdGhlIHByZWNlc3MgZmFpbGVkIChlLmcuIHBlcm1pc3Npb24gbm90IGdyYW50ZWQpLlxuICovXG5jb25zdCBkZWZhdWx0RGVmaW5pdGlvbnMgPSBbXG4gIHtcbiAgICBpZDogJ3dlYi1hdWRpbycsXG4gICAgY2hlY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICEhYXVkaW9Db250ZXh0O1xuICAgIH0sXG4gICAgaW50ZXJhY3Rpb25Ib29rOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICghY2xpZW50LnBsYXRmb3JtLmlzTW9iaWxlKVxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuXG4gICAgICBjb25zdCBnID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgICAgIGcuY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuICAgICAgZy5nYWluLnZhbHVlID0gMC4wMDAwMDAwMDE7IC8vIC0xODBkQiA/XG5cbiAgICAgIGNvbnN0IG8gPSBhdWRpb0NvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xuICAgICAgby5jb25uZWN0KGcpO1xuICAgICAgby5mcmVxdWVuY3kudmFsdWUgPSAyMDtcbiAgICAgIG8uc3RhcnQoMCk7XG5cbiAgICAgIC8vIHByZXZlbnQgYW5kcm9pZCB0byBzdG9wIGF1ZGlvIGJ5IGtlZXBpbmcgdGhlIG9zY2lsbGF0b3IgYWN0aXZlXG4gICAgICBpZiAoY2xpZW50LnBsYXRmb3JtLm9zICE9PSAnYW5kcm9pZCcpXG4gICAgICAgIG8uc3RvcChhdWRpb0NvbnRleHQuY3VycmVudFRpbWUgKyAwLjAxKTtcblxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICB9XG4gIH0sXG4gIHtcbiAgICAvLyBAbm90ZTogYHRvdWNoYCBmZWF0dXJlIHdvcmthcm91bmRcbiAgICAvLyBjZi4gaHR0cDovL3d3dy5zdHVjb3guY29tL2Jsb2cveW91LWNhbnQtZGV0ZWN0LWEtdG91Y2hzY3JlZW4vXG4gICAgaWQ6ICdtb2JpbGUtZGV2aWNlJyxcbiAgICBjaGVjazogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY2xpZW50LnBsYXRmb3JtLmlzTW9iaWxlO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGlkOiAnYXVkaW8taW5wdXQnLFxuICAgIGNoZWNrOiBmdW5jdGlvbigpIHtcbiAgICAgIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEgPSAoXG4gICAgICAgIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEgfHxcbiAgICAgICAgbmF2aWdhdG9yLndlYmtpdEdldFVzZXJNZWRpYSB8fFxuICAgICAgICBuYXZpZ2F0b3IubW96R2V0VXNlck1lZGlhIHx8XG4gICAgICAgIG5hdmlnYXRvci5tc0dldFVzZXJNZWRpYVxuICAgICAgKTtcblxuICAgICAgcmV0dXJuICEhbmF2aWdhdG9yLmdldFVzZXJNZWRpYTtcbiAgICB9LFxuICAgIHN0YXJ0SG9vazogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEoeyBhdWRpbzogdHJ1ZSB9LCBmdW5jdGlvbihzdHJlYW0pIHtcbiAgICAgICAgICBzdHJlYW0uZ2V0QXVkaW9UcmFja3MoKVswXS5zdG9wKCk7XG4gICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBpZDogJ2Z1bGwtc2NyZWVuJyxcbiAgICBjaGVjazogZnVuY3Rpb24oKSB7XG4gICAgICAvLyBmdW5jdGlvbm5hbGl0eSB0aGF0IGNhbm5vdCBicmFrZSB0aGUgYXBwbGljYXRpb25cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgaW50ZXJhY3Rpb25Ib29rKCkge1xuICAgICAgaWYgKHNjcmVlbmZ1bGwuZW5hYmxlZClcbiAgICAgICAgc2NyZWVuZnVsbC5yZXF1ZXN0KCk7XG5cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XG4gICAgfVxuICB9LFxuICB7XG4gICAgaWQ6ICdnZW9sb2NhdGlvbicsXG4gICAgY2hlY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICEhbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbjtcbiAgICB9LFxuICAgIHN0YXJ0SG9vazogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oKHBvc2l0aW9uKSA9PiB7XG4gICAgICAgICAgLy8gcG9wdWxhdGUgY2xpZW50IHdpdGggZmlyc3QgdmFsdWVcbiAgICAgICAgICBjb25zdCBjb29yZHMgPSBwb3NpdGlvbi5jb29yZHM7XG4gICAgICAgICAgY2xpZW50LmNvb3JkaW5hdGVzID0gW2Nvb3Jkcy5sYXRpdHVkZSwgY29vcmRzLmxvbmdpdHVkZV07XG4gICAgICAgICAgY2xpZW50Lmdlb3Bvc2l0aW9uID0gcG9zaXRpb247XG5cbiAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICB9LCAoZXJyKSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9LCB7fSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBpZDogJ2dlb2xvY2F0aW9uLW1vY2snLFxuICAgIGNoZWNrOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgc3RhcnRIb29rOiBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGxhdCA9IE1hdGgucmFuZG9tKCkgKiAzNjAgLSAxODA7XG4gICAgICBjb25zdCBsbmcgPSBNYXRoLnJhbmRvbSgpICogMTgwIC0gOTA7XG4gICAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBbbGF0LCBsbmddO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICB9XG4gIH0sXG4gIHtcbiAgICAvLyBhZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL3JpY2h0ci9Ob1NsZWVwLmpzL2Jsb2IvbWFzdGVyL05vU2xlZXAuanNcbiAgICAvLyB3YXJuaW5nOiBjYXVzZSAxNTAlIGNwdSB1c2UgaW4gY2hyb21lIGRlc2t0b3AuLi5cbiAgICBpZDogJ3dha2UtbG9jaycsXG4gICAgY2hlY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gZnVuY3Rpb25uYWxpdHkgdGhhdCBjYW5ub3QgYnJha2UgdGhlIGFwcGxpY2F0aW9uXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIGludGVyYWN0aW9uSG9vazogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoY2xpZW50LnBsYXRmb3JtLm9zID09PSAnaW9zJykge1xuICAgICAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gd2luZG93LmxvY2F0aW9uO1xuICAgICAgICAgIHNldFRpbWVvdXQod2luZG93LnN0b3AsIDApO1xuICAgICAgICB9LCAzMDAwMClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBtZWRpYXMgPSB7XG4gICAgICAgICAgd2VibTogXCJkYXRhOnZpZGVvL3dlYm07YmFzZTY0LEdrWGZvMEFnUW9hQkFVTDNnUUZDOG9FRVF2T0JDRUtDUUFSM1pXSnRRb2VCQWtLRmdRSVlVNEJuUUkwVlNhbG1RQ2dxMTdGQUF3OUNRRTJBUUFaM2FHRnRiWGxYUVVBR2QyaGhiVzE1UklsQUNFQ1BRQUFBQUFBQUZsU3VhMEF4cmtBdTE0RUJZOFdCQVp5QkFDSzFuRUFEZFc1a2hrQUZWbDlXVURnbGhvaEFBMVpRT0lPQkFlQkFCckNCQ0xxQkNCOUR0blZBSXVlQkFLTkFISUVBQUlBd0FRQ2RBU29JQUFnQUFVQW1KYVFBQTNBQS92ejBBQUE9XCIsXG4gICAgICAgICAgbXA0OiBcImRhdGE6dmlkZW8vbXA0O2Jhc2U2NCxBQUFBSEdaMGVYQnBjMjl0QUFBQ0FHbHpiMjFwYzI4eWJYQTBNUUFBQUFobWNtVmxBQUFBRzIxa1lYUUFBQUd6QUJBSEFBQUJ0aEFEQW93ZGJiOS9BQUFDNlcxdmIzWUFBQUJzYlhab1pBQUFBQUI4SmJDQWZDV3dnQUFBQStnQUFBQUFBQUVBQUFFQUFBQUFBQUFBQUFBQUFBQUJBQUFBQUFBQUFBQUFBQUFBQUFBQUFRQUFBQUFBQUFBQUFBQUFBQUFBUUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBSUFBQUlWZEhKaGF3QUFBRngwYTJoa0FBQUFEM3dsc0lCOEpiQ0FBQUFBQVFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFCQUFBQUFBQUFBQUFBQUFBQUFBQUFBUUFBQUFBQUFBQUFBQUFBQUFBQVFBQUFBQUFJQUFBQUNBQUFBQUFCc1cxa2FXRUFBQUFnYldSb1pBQUFBQUI4SmJDQWZDV3dnQUFBQStnQUFBQUFWY1FBQUFBQUFDMW9aR3h5QUFBQUFBQUFBQUIyYVdSbEFBQUFBQUFBQUFBQUFBQUFWbWxrWlc5SVlXNWtiR1Z5QUFBQUFWeHRhVzVtQUFBQUZIWnRhR1FBQUFBQkFBQUFBQUFBQUFBQUFBQWtaR2x1WmdBQUFCeGtjbVZtQUFBQUFBQUFBQUVBQUFBTWRYSnNJQUFBQUFFQUFBRWNjM1JpYkFBQUFMaHpkSE5rQUFBQUFBQUFBQUVBQUFDb2JYQTBkZ0FBQUFBQUFBQUJBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUlBQWdBU0FBQUFFZ0FBQUFBQUFBQUFRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUJqLy93QUFBRkpsYzJSekFBQUFBQU5FQUFFQUJEd2dFUUFBQUFBRERVQUFBQUFBQlMwQUFBR3dBUUFBQWJXSkV3QUFBUUFBQUFFZ0FNU05pQjlGQUVRQkZHTUFBQUd5VEdGMll6VXlMamczTGpRR0FRSUFBQUFZYzNSMGN3QUFBQUFBQUFBQkFBQUFBUUFBQUFBQUFBQWNjM1J6WXdBQUFBQUFBQUFCQUFBQUFRQUFBQUVBQUFBQkFBQUFGSE4wYzNvQUFBQUFBQUFBRXdBQUFBRUFBQUFVYzNSamJ3QUFBQUFBQUFBQkFBQUFMQUFBQUdCMVpIUmhBQUFBV0cxbGRHRUFBQUFBQUFBQUlXaGtiSElBQUFBQUFBQUFBRzFrYVhKaGNIQnNBQUFBQUFBQUFBQUFBQUFBSzJsc2MzUUFBQUFqcVhSdmJ3QUFBQnRrWVhSaEFBQUFBUUFBQUFCTVlYWm1OVEl1TnpndU13PT1cIlxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0ICR2aWRlbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJyk7XG4gICAgICAgICR2aWRlby5zZXRBdHRyaWJ1dGUoJ2xvb3AnLCAnJyk7XG5cbiAgICAgICAgZm9yIChsZXQgdHlwZSBpbiBtZWRpYXMpIHtcbiAgICAgICAgICBjb25zdCBkYXRhVVJJID0gbWVkaWFzW3R5cGVdO1xuICAgICAgICAgIGNvbnN0ICRzb3VyY2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzb3VyY2UnKTtcbiAgICAgICAgICAkc291cmNlLnNyYyA9IGRhdGFVUkk7XG4gICAgICAgICAgJHNvdXJjZS50eXBlID0gYHZpZGVvLyR7dHlwZX1gO1xuXG4gICAgICAgICAgJHZpZGVvLmFwcGVuZENoaWxkKCRzb3VyY2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgJHZpZGVvLnBsYXkoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICB9XG4gIH1cbl07XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpwbGF0Zm9ybSc7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgY2xpZW50IGAncGxhdGZvcm0nYCBzZXJ2aWNlLlxuICpcbiAqIFRoZSBgcGxhdGZvcm1gIHNlcnZpY2VzIGlzIHJlc3BvbnNpYmxlIGZvciBnaXZpbmcgZ2VuZXJhbCBpbmZvcm1hdGlvbnNcbiAqIGFib3V0IHRoZSB1c2VyJ3MgZGV2aWNlIGFzIHdlbGwgYXMgY2hlY2tpbmcgYXZhaWxhYmlsaXR5IGFuZCBwcm92aWRpbmcgaG9va3NcbiAqIGluIG9yZGVyIHRvIGluaXRpYWxpemUgdGhlIGZlYXR1cmVzIHJlcXVpcmVkIGJ5IHRoZSBhcHBsaWNhdGlvbiAoYXVkaW8sXG4gKiBtaWNyb3Bob25lLCBldGMuKS5cbiAqIElmIG9uZSBvZiB0aGUgcmVxdWlyZWQgZGVmaW5pdGlvbnMgaXMgbm90IGF2YWlsYWJsZSwgYSB2aWV3IGlzIGNyZWF0ZWQgd2l0aFxuICogYW4gZXJyb3IgbWVzc2FnZSBhbmQgYGNsaWVudC5jb21wYXRpYmxlYCBpcyBzZXQgdG8gYGZhbHNlYC5cbiAqXG4gKiBBdmFpbGFibGUgYnVpbHQtaW4gZGVmaW5pdGlvbnMgYXJlOlxuICogLSAnd2ViLWF1ZGlvJ1xuICogLSAnbW9iaWxlLWRldmljZSc6IG9ubHktYWNjZXB0IG1vYmlsZSBkZXZpY2VzIGluIHRoZSBhcHBsaWNhdGlvbiAoYmFzZWQgb25cbiAqICAgVXNlci1BZ2VudCBzbmlmZmluZylcbiAqIC0gJ2F1ZGlvLWlucHV0JzogQW5kcm9pZCBPbmx5XG4gKiAtICdmdWxsLXNjcmVlbic6IEFuZHJvaWQgT25seSwgdGhpcyBmZWF0dXJlIHdvbid0IGJsb2NrIHRoZSBhcHBsaWNhdGlvbiBpZlxuICogICBub3QgYXZhaWxhYmxlLlxuICogLSAnZ2VvbG9jYXRpb24nOiBjaGVjayBpZiB0aGUgbmF2aWdhdG9yIHN1cHBvcnRzIGdlb2xvY2F0aW9uLiBUaGUgYGNvb3JkaW5hdGVzYFxuICogICBhbmQgYGdlb3Bvc2l0aW9uYCBvZiB0aGUgYGNsaWVudGAgYXJlIHBvcHVsYXRlZCB3aGVuIHRoZSBwbGFmb3JtIHNlcnZpY2VcbiAqICAgcmVzb2x2ZXMuIChpZiBubyB1cGRhdGUgb2YgdGhlIGNvb3JkaW5hdGVzIGFyZSBuZWVkZWQgaW4gdGhlIGFwcGxpY2F0aW9uLFxuICogICByZXF1aXJpbmcgZ2VvbG9jYXRpb24gZmVhdHVyZSB3aXRob3V0IHVzaW5nIHRoZSBHZW9sb2NhdGlvbiBzZXJ2aWNlIHNob3VsZFxuICogICBzdWZmaWNlKS5cbiAqIC0gJ3dha2UtbG9jayc6IHVzZSB3aXRoIGNhdXRpb24sIGhhcyBiZWVuIG9ic2VydmVkIGNvbnN1bW1pbmdcbiAqICAgMTUwJSBjcHUgaW4gY2hyb21lIGRlc2t0b3AuXG4gKlxuICpcbiAqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmVcbiAqIGluc3RhbmNpYXRlZCBtYW51YWxseV9cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtBcnJheTxTdHJpbmc+fFN0cmluZ30gb3B0aW9ucy5mZWF0dXJlcyAtIElkKHMpIG9mIHRoZSBmZWF0dXJlKHMpXG4gKiAgcmVxdWlyZWQgYnkgdGhlIGFwcGxpY2F0aW9uLiBBdmFpbGFibGUgYnVpbGQtaW4gZmVhdHVyZXMgYXJlOlxuICogIC0gJ3dlYi1hdWRpbydcbiAqICAtICdtb2JpbGUtZGV2aWNlJzogb25seSBhY2NlcHQgbW9iaWxlIGRldmljZXMgKHJlY29nbml0aW9uIGJhc2VkIFVzZXItQWdlbnQpXG4gKiAgLSAnYXVkaW8taW5wdXQnOiBBbmRyb2lkIG9ubHlcbiAqICAtICdmdWxsLXNjcmVlbic6IEFuZHJvaWQgb25seVxuICogIC0gJ2dlb2xvY2F0aW9uJzogYWNjZXB0IGdlb2xvY2FsaXplZCBkZXZpY2VzLiBQb3B1bGF0ZSB0aGUgY2xpZW50IHdpdGhcbiAqICAgICBjdXJyZW50IHBvc2l0aW9uXG4gKiAgLSAnd2FrZS1sb2NrJzogdGhpcyBmZWF0dXJlIHNob3VsZCBiZSB1c2VkIHdpdGggY2F1dGlvbiBhc1xuICogICAgIGl0IGhhcyBiZWVuIG9ic2VydmVkIHRvIHVzZSAxNTAlIG9mIGNwdSBpbiBjaHJvbWUgZGVza3RvcC5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuc2hvd0RpYWxvZz10cnVlXSAtIElmIHNldCB0byBgZmFsc2VgLCB0aGUgc2VydmljZVxuICogIGV4ZWN1dGUgYWxsIGhvb2tzIHdpdGhvdXQgd2FpdGluZyBmb3IgYSB1c2VyIGludGVyYWN0aW9uIGFuZCBkb2Vzbid0IHNob3dcbiAqICB0aGUgc2VydmljZSdzIHZpZXcuIFRoaXMgb3B0aW9uIHNob3VsZCBvbmx5IGJlIHVzZWQgb24gY29udHJvbGxlZFxuICogIGVudmlyb25uZW1lbnRzIHdoZXJlIHRoZSB0YXJnZXQgcGxhdGZvcm0gaXMga25vd24gZm9yIHdvcmtpbmcgd2l0aG91dFxuICogIHRoaXMgbmVlZCAoZS5nLiBpcyBub3QgaU9TKS5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAZXhhbXBsZVxuICogLy8gaW5zaWRlIHRoZSBleHBlcmllbmNlIGNvbnN0cnVjdG9yXG4gKiB0aGlzLnBsYXRmb3JtID0gdGhpcy5yZXF1aXJlKCdwbGF0Zm9ybScsIHsgZmVhdHVyZXM6ICd3ZWItYXVkaW8nIH0pO1xuICpcbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5jbGllbnQjcGxhdGZvcm19XG4gKi9cbmNsYXNzIFBsYXRmb3JtIGV4dGVuZHMgU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIGZhbHNlKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgc2hvd0RpYWxvZzogdHJ1ZSxcbiAgICAgIHZpZXc6IG51bGwsXG4gICAgICB2aWV3UHJpb3JpdHk6IDEwLFxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICB0aGlzLnZpZXcgPSBudWxsO1xuXG4gICAgLy8gdGhpcy5fZGVmYXVsdFZpZXdUZW1wbGF0ZSA9IGRlZmF1bHRWaWV3VGVtcGxhdGU7XG4gICAgLy8gdGhpcy5fZGVmYXVsdFZpZXdDb250ZW50ID0gZGVmYXVsdFZpZXdDb250ZW50O1xuXG4gICAgdGhpcy5fcmVxdWlyZWRGZWF0dXJlcyA9IG5ldyBTZXQoKTtcbiAgICB0aGlzLl9mZWF0dXJlRGVmaW5pdGlvbnMgPSB7fTtcblxuICAgIGRlZmF1bHREZWZpbml0aW9ucy5mb3JFYWNoKChkZWYpID0+IHRoaXMuYWRkRmVhdHVyZURlZmluaXRpb24oZGVmKSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgY29uZmlndXJlKG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy5mZWF0dXJlcykge1xuICAgICAgbGV0IGZlYXR1cmVzID0gb3B0aW9ucy5mZWF0dXJlcztcblxuICAgICAgaWYgKHR5cGVvZiBmZWF0dXJlcyA9PT0gJ3N0cmluZycpXG4gICAgICAgIGZlYXR1cmVzID0gW2ZlYXR1cmVzXTtcblxuICAgICAgdGhpcy5yZXF1aXJlRmVhdHVyZSguLi5mZWF0dXJlcyk7XG4gICAgICBkZWxldGUgb3B0aW9ucy5mZWF0dXJlcztcbiAgICB9XG5cbiAgICBzdXBlci5jb25maWd1cmUob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogIFN0YXJ0IHRoZSBjbGllbnQuXG4gICAqICBBbGdvcml0aG06XG4gICAqICAtIGNoZWNrIHJlcXVpcmVkIGZlYXR1cmVzXG4gICAqICAtIGlmIChmYWxzZSlcbiAgICogICAgIHNob3cgJ3NvcnJ5JyBzY3JlZW5cbiAgICogIC0gZWxzZVxuICAgKiAgICAgc2hvdyAnd2VsY29tZScgc2NyZWVuXG4gICAqICAgICBleGVjdXRlIHN0YXJ0IGhvb2sgKHByb21pc2UpXG4gICAqICAgICAtIGlmIChwcm9taXNlID09PSB0cnVlKVxuICAgKiAgICAgICAgc2hvdyB0b3VjaCB0byBzdGFydFxuICAgKiAgICAgICAgYmluZCBldmVudHNcbiAgICogICAgIC0gZWxzZVxuICAgKiAgICAgICAgc2hvdyAnc29ycnknIHNjcmVlblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIHRoaXMuX2RlZmluZUF1ZGlvRmlsZUV4dGVudGlvbigpO1xuICAgIHRoaXMuX2RlZmluZVBsYXRmb3JtKCk7XG5cbiAgICAvLyByZXNvbHZlIHJlcXVpcmVkIGZlYXR1cmVzIGZyb20gdGhlIGFwcGxpY2F0aW9uXG4gICAgY2xpZW50LmNvbXBhdGlibGUgPSB0aGlzLl9jaGVja1JlcXVpcmVkRmVhdHVyZXMoKTtcblxuICAgIC8vIGhhbmRsZSBgc2hvd0Rpc3BsYXkgPT09IGZhbHNlYFxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0Rpc3BsYXkgPT09IGZhbHNlKSB7XG4gICAgICBpZiAoY2xpZW50LmNvbXBhdGlibGUpIHtcbiAgICAgICAgY29uc3Qgc3RhcnRQcm9taXNlcyA9IHRoaXMuX2dldEhvb2tzKCdzdGFydEhvb2snKTtcbiAgICAgICAgY29uc3QgaW50ZXJhY3Rpb25Qcm9taXNlcyA9IHRoaXMuX2dldEhvb2tzKCdpbnRlcmFjdGlvbkhvb2snKTtcbiAgICAgICAgY29uc3QgcHJvbWlzZXMgPSBbXS5jb25jYXQoc3RhcnRQcm9taXNlcywgaW50ZXJhY3Rpb25Qcm9taXNlcyk7XG5cbiAgICAgICAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4ocmVzdWx0cyA9PiB7XG4gICAgICAgICAgbGV0IHJlc29sdmVkID0gdHJ1ZTtcbiAgICAgICAgICByZXN1bHRzLmZvckVhY2goYm9vbCA9PiByZXNvbHZlZCA9IHJlc29sdmVkICYmIGJvb2wpO1xuXG4gICAgICAgICAgaWYgKHJlc29sdmVkKVxuICAgICAgICAgICAgdGhpcy5yZWFkeSgpO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgc2VydmljZTpwbGF0Zm9ybSAtIGRpZG4ndCBvYnRhaW4gdGhlIG5lY2Vzc2FyeSBhdXRob3JpemF0aW9uc2ApO1xuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdzZXJ2aWNlOnBsYXRmb3JtIC0gY2xpZW50IG5vdCBjb21wYXRpYmxlJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGRlZmF1bHQgdmlldyB2YWx1ZXNcbiAgICAgIHRoaXMudmlldy51cGRhdGVDaGVja2luZ1N0YXR1cyhmYWxzZSk7XG4gICAgICB0aGlzLnZpZXcudXBkYXRlSXNDb21wYXRpYmxlU3RhdHVzKG51bGwpO1xuICAgICAgdGhpcy52aWV3LnVwZGF0ZUhhc0F1dGhvcml6YXRpb25zU3RhdHVzKG51bGwpO1xuXG4gICAgICBpZiAoIWNsaWVudC5jb21wYXRpYmxlKSB7XG4gICAgICAgIHRoaXMudmlldy51cGRhdGVJc0NvbXBhdGlibGVTdGF0dXMoZmFsc2UpO1xuICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudmlldy51cGRhdGVJc0NvbXBhdGlibGVTdGF0dXModHJ1ZSk7XG4gICAgICAgIHRoaXMudmlldy51cGRhdGVDaGVja2luZ1N0YXR1cyh0cnVlKTtcbiAgICAgICAgdGhpcy5zaG93KCk7XG5cbiAgICAgICAgLy8gZXhlY3V0ZSBzdGFydCBob29rXG4gICAgICAgIGNvbnN0IHN0YXJ0UHJvbWlzZXMgPSB0aGlzLl9nZXRIb29rcygnc3RhcnRIb29rJyk7XG5cbiAgICAgICAgUHJvbWlzZS5hbGwoc3RhcnRQcm9taXNlcykudGhlbihyZXN1bHRzID0+IHtcbiAgICAgICAgICAvLyBpZiBvbmUgb2YgdGhlIHN0YXJ0IGhvb2sgZmFpbGVkXG4gICAgICAgICAgbGV0IGhhc0F1dGhvcml6YXRpb25zID0gdHJ1ZTtcbiAgICAgICAgICByZXN1bHRzLmZvckVhY2goc3VjY2VzcyA9PiBoYXNBdXRob3JpemF0aW9ucyA9IGhhc0F1dGhvcml6YXRpb25zICYmIHN1Y2Nlc3MpO1xuXG4gICAgICAgICAgdGhpcy52aWV3LnVwZGF0ZUhhc0F1dGhvcml6YXRpb25zU3RhdHVzKGhhc0F1dGhvcml6YXRpb25zKTtcbiAgICAgICAgICB0aGlzLnZpZXcudXBkYXRlQ2hlY2tpbmdTdGF0dXMoZmFsc2UpO1xuXG4gICAgICAgICAgaWYgKGhhc0F1dGhvcml6YXRpb25zKSB7XG4gICAgICAgICAgICB0aGlzLnZpZXcuc2V0VG91Y2hTdGFydENhbGxiYWNrKHRoaXMuX29uSW50ZXJhY3Rpb24oJ3RvdWNoJykpO1xuICAgICAgICAgICAgdGhpcy52aWV3LnNldE1vdXNlRG93bkNhbGxiYWNrKHRoaXMuX29uSW50ZXJhY3Rpb24oJ21vdXNlJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkuY2F0Y2goKGVycikgPT4gY29uc29sZS5lcnJvcihlcnIuc3RhY2spKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RvcCgpIHtcbiAgICB0aGlzLmhpZGUoKTtcbiAgICBzdXBlci5zdG9wKCk7XG4gIH1cblxuICAvKipcbiAgICogU3RydWN0dXJlIG9mIHRoZSBkZWZpbml0aW9uIGZvciB0aGUgdGVzdCBvZiBhIGZlYXR1cmUuXG4gICAqXG4gICAqIEBwYXJhbSB7bW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYXRmb3JtfmRlZmluaXRpb259IG9iaiAtIERlZmluaXRpb24gb2ZcbiAqXG4gICAqICB0aGUgZmVhdHVyZS5cbiAgICovXG4gIGFkZEZlYXR1cmVEZWZpbml0aW9uKG9iaikge1xuICAgIHRoaXMuX2ZlYXR1cmVEZWZpbml0aW9uc1tvYmouaWRdID0gb2JqO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcXVpcmUgZmVhdHVyZXMgZm9yIHRoZSBhcHBsaWNhdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHsuLi5TdHJpbmd9IGZlYXR1cmVzIC0gSWQocykgb2YgdGhlIGZlYXR1cmUocykgdG8gYmUgcmVxdWlyZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXF1aXJlRmVhdHVyZSguLi5mZWF0dXJlcykge1xuICAgIGZlYXR1cmVzLmZvckVhY2goKGlkKSA9PiB0aGlzLl9yZXF1aXJlZEZlYXR1cmVzLmFkZChpZCkpO1xuICB9XG5cblxuICAvKipcbiAgICogRXhlY3V0ZSBgaW50ZXJhY3Rpb25zYCBob29rcyBmcm9tIHRoZSBgcGxhdGZvcm1gIHNlcnZpY2UuXG4gICAqIEFsc28gYWN0aXZhdGUgdGhlIG1lZGlhIGFjY29yZGluZyB0byB0aGUgYG9wdGlvbnNgLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX29uSW50ZXJhY3Rpb24odHlwZSkge1xuICAgIHJldHVybiAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgY2xpZW50LnBsYXRmb3JtLmludGVyYWN0aW9uID0gdHlwZTtcbiAgICAgIC8vIGV4ZWN1dGUgaW50ZXJhY3Rpb24gaG9va3MgZnJvbSB0aGUgcGxhdGZvcm1cbiAgICAgIGNvbnN0IGludGVyYWN0aW9uUHJvbWlzZXMgPSB0aGlzLl9nZXRIb29rcygnaW50ZXJhY3Rpb25Ib29rJyk7XG5cbiAgICAgIFByb21pc2UuYWxsKGludGVyYWN0aW9uUHJvbWlzZXMpLnRoZW4oKHJlc3VsdHMpID0+IHtcbiAgICAgICAgbGV0IHJlc29sdmVkID0gdHJ1ZTtcbiAgICAgICAgcmVzdWx0cy5mb3JFYWNoKGJvb2wgPT4gcmVzb2x2ZWQgPSByZXNvbHZlZCAmJiBib29sKTtcblxuICAgICAgICBpZiAocmVzb2x2ZWQpIHtcbiAgICAgICAgICB0aGlzLnJlYWR5KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy52aWV3LnVwZGF0ZUhhc0F1dGhvcml6YXRpb25zU3RhdHVzKHJlc29sdmVkKTtcbiAgICAgICAgfVxuICAgICAgfSkuY2F0Y2goKGVycikgPT4gY29uc29sZS5lcnJvcihlcnIuc3RhY2spKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZSBhbGwgYGNoZWNrYCBmdW5jdGlvbnMgZGVmaW5lZCBpbiB0aGUgcmVxdWlyZWQgZmVhdHVyZXMuXG4gICAqXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IC0gYHRydWVgIGlmIGFsbCBjaGVja3MgcGFzcywgYGZhbHNlYCBvdGhlcndpc2UuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfY2hlY2tSZXF1aXJlZEZlYXR1cmVzKCkge1xuICAgIGxldCByZXN1bHQgPSB0cnVlO1xuXG4gICAgdGhpcy5fcmVxdWlyZWRGZWF0dXJlcy5mb3JFYWNoKGZlYXR1cmUgPT4ge1xuICAgICAgY29uc3QgY2hlY2tGdW5jdGlvbiA9IHRoaXMuX2ZlYXR1cmVEZWZpbml0aW9uc1tmZWF0dXJlXS5jaGVjaztcblxuICAgICAgaWYgKCEodHlwZW9mIGNoZWNrRnVuY3Rpb24gPT09ICdmdW5jdGlvbicpKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIGNoZWNrIGZ1bmN0aW9uIGRlZmluZWQgZm9yICR7ZmVhdHVyZX0gZmVhdHVyZWApO1xuXG4gICAgICByZXN1bHQgPSByZXN1bHQgJiYgY2hlY2tGdW5jdGlvbigpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfZ2V0SG9va3ModHlwZSkge1xuICAgIGNvbnN0IGhvb2tzID0gW107XG5cbiAgICB0aGlzLl9yZXF1aXJlZEZlYXR1cmVzLmZvckVhY2goZmVhdHVyZSA9PiB7XG4gICAgICBjb25zdCBob29rID0gdGhpcy5fZmVhdHVyZURlZmluaXRpb25zW2ZlYXR1cmVdW3R5cGVdO1xuXG4gICAgICBpZiAoaG9vaylcbiAgICAgICAgaG9va3MucHVzaChob29rKTtcbiAgICB9KTtcblxuICAgIC8vIHJldHVybiBhbiBhcnJheSBvZiBQcm9taXNlcyBpbnN0ZWFkIG9mIGZ1bmN0aW9uXG4gICAgcmV0dXJuIGhvb2tzLm1hcChob29rID0+IGhvb2soKSk7XG4gIH1cblxuICAvKipcbiAgICogUG9wdWxhdGUgYGNsaWVudC5wbGF0Zm9ybWAgd2l0aCB0aGUgcHJlZmVyZWQgYXVkaW8gZmlsZSBleHRlbnRpb25cbiAgICogZm9yIHRoZSBwbGF0Zm9ybS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9kZWZpbmVBdWRpb0ZpbGVFeHRlbnRpb24oKSB7XG4gICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2F1ZGlvJyk7XG4gICAgLy8gaHR0cDovL2RpdmVpbnRvaHRtbDUuaW5mby9ldmVyeXRoaW5nLmh0bWxcbiAgICBpZiAoISEoYS5jYW5QbGF5VHlwZSAmJiBhLmNhblBsYXlUeXBlKCdhdWRpby9tcGVnOycpKSlcbiAgICAgIGNsaWVudC5wbGF0Zm9ybS5hdWRpb0ZpbGVFeHQgPSAnLm1wMyc7XG4gICAgZWxzZSBpZiAoISEoYS5jYW5QbGF5VHlwZSAmJiBhLmNhblBsYXlUeXBlKCdhdWRpby9vZ2c7IGNvZGVjcz1cInZvcmJpc1wiJykpKVxuICAgICAgY2xpZW50LnBsYXRmb3JtLmF1ZGlvRmlsZUV4dCA9ICcub2dnJztcbiAgICBlbHNlXG4gICAgICBjbGllbnQucGxhdGZvcm0uYXVkaW9GaWxlRXh0ID0gJy53YXYnO1xuICB9XG5cbiAgLyoqXG4gICAqIFBvcHVsYXRlIGBjbGllbnQucGxhdGZvcm1gIHdpdGggdGhlIG9zIG5hbWUuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfZGVmaW5lUGxhdGZvcm0oKSB7XG4gICAgY29uc3QgdWEgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudFxuICAgIGNvbnN0IG1kID0gbmV3IE1vYmlsZURldGVjdCh1YSk7XG5cbiAgICBjbGllbnQucGxhdGZvcm0uaXNNb2JpbGUgPSAobWQubW9iaWxlKCkgIT09IG51bGwpOyAvLyB0cnVlIGlmIHBob25lIG9yIHRhYmxldFxuICAgIGNsaWVudC5wbGF0Zm9ybS5vcyA9IChmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG9zID0gbWQub3MoKTtcblxuICAgICAgaWYgKG9zID09PSAnQW5kcm9pZE9TJylcbiAgICAgICAgcmV0dXJuICdhbmRyb2lkJztcbiAgICAgIGVsc2UgaWYgKG9zID09PSAnaU9TJylcbiAgICAgICAgcmV0dXJuICdpb3MnO1xuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gJ290aGVyJztcbiAgICB9KSgpO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFBsYXRmb3JtKTtcblxuZXhwb3J0IGRlZmF1bHQgUGxhdGZvcm07XG4iXX0=