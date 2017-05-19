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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYXRmb3JtLmpzIl0sIm5hbWVzIjpbImRlZmF1bHREZWZpbml0aW9ucyIsImlkIiwiY2hlY2siLCJpbnRlcmFjdGlvbkhvb2siLCJwbGF0Zm9ybSIsImlzTW9iaWxlIiwicmVzb2x2ZSIsImciLCJjcmVhdGVHYWluIiwiY29ubmVjdCIsImRlc3RpbmF0aW9uIiwiZ2FpbiIsInZhbHVlIiwibyIsImNyZWF0ZU9zY2lsbGF0b3IiLCJmcmVxdWVuY3kiLCJzdGFydCIsIm9zIiwic3RvcCIsImN1cnJlbnRUaW1lIiwibmF2aWdhdG9yIiwiZ2V0VXNlck1lZGlhIiwid2Via2l0R2V0VXNlck1lZGlhIiwibW96R2V0VXNlck1lZGlhIiwibXNHZXRVc2VyTWVkaWEiLCJzdGFydEhvb2siLCJyZWplY3QiLCJhdWRpbyIsInN0cmVhbSIsImdldEF1ZGlvVHJhY2tzIiwiZXJyIiwiZW5hYmxlZCIsInJlcXVlc3QiLCJnZW9sb2NhdGlvbiIsImdldEN1cnJlbnRQb3NpdGlvbiIsInBvc2l0aW9uIiwiY29vcmRzIiwiY29vcmRpbmF0ZXMiLCJsYXRpdHVkZSIsImxvbmdpdHVkZSIsImdlb3Bvc2l0aW9uIiwibGF0IiwiTWF0aCIsInJhbmRvbSIsImxuZyIsInNldEludGVydmFsIiwid2luZG93IiwibG9jYXRpb24iLCJzZXRUaW1lb3V0IiwibWVkaWFzIiwid2VibSIsIm1wNCIsIiR2aWRlbyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInNldEF0dHJpYnV0ZSIsInR5cGUiLCJkYXRhVVJJIiwiJHNvdXJjZSIsInNyYyIsImFwcGVuZENoaWxkIiwicGxheSIsIlNFUlZJQ0VfSUQiLCJQbGF0Zm9ybSIsImRlZmF1bHRzIiwic2hvd0RpYWxvZyIsInZpZXciLCJ2aWV3UHJpb3JpdHkiLCJjb25maWd1cmUiLCJfcmVxdWlyZWRGZWF0dXJlcyIsIl9mZWF0dXJlRGVmaW5pdGlvbnMiLCJmb3JFYWNoIiwiZGVmIiwiYWRkRmVhdHVyZURlZmluaXRpb24iLCJvcHRpb25zIiwiZmVhdHVyZXMiLCJyZXF1aXJlRmVhdHVyZSIsIl9kZWZpbmVBdWRpb0ZpbGVFeHRlbnRpb24iLCJfZGVmaW5lUGxhdGZvcm0iLCJjb21wYXRpYmxlIiwiX2NoZWNrUmVxdWlyZWRGZWF0dXJlcyIsInN0YXJ0UHJvbWlzZXMiLCJfZ2V0SG9va3MiLCJpbnRlcmFjdGlvblByb21pc2VzIiwicHJvbWlzZXMiLCJjb25jYXQiLCJhbGwiLCJ0aGVuIiwicmVzb2x2ZWQiLCJyZXN1bHRzIiwiYm9vbCIsInJlYWR5IiwiRXJyb3IiLCJ1cGRhdGVDaGVja2luZ1N0YXR1cyIsInVwZGF0ZUlzQ29tcGF0aWJsZVN0YXR1cyIsInVwZGF0ZUhhc0F1dGhvcml6YXRpb25zU3RhdHVzIiwic2hvdyIsImhhc0F1dGhvcml6YXRpb25zIiwic3VjY2VzcyIsInNldFRvdWNoU3RhcnRDYWxsYmFjayIsIl9vbkludGVyYWN0aW9uIiwic2V0TW91c2VEb3duQ2FsbGJhY2siLCJjYXRjaCIsImNvbnNvbGUiLCJlcnJvciIsInN0YWNrIiwiaGlkZSIsIm9iaiIsImFkZCIsImUiLCJwcmV2ZW50RGVmYXVsdCIsInN0b3BQcm9wYWdhdGlvbiIsImludGVyYWN0aW9uIiwicmVzdWx0IiwiY2hlY2tGdW5jdGlvbiIsImZlYXR1cmUiLCJob29rcyIsImhvb2siLCJwdXNoIiwibWFwIiwiYSIsImNhblBsYXlUeXBlIiwiYXVkaW9GaWxlRXh0IiwidWEiLCJ1c2VyQWdlbnQiLCJtZCIsIm1vYmlsZSIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQTs7Ozs7Ozs7QUFRQTs7Ozs7Ozs7Ozs7O0FBWUE7Ozs7Ozs7Ozs7OztBQVlBOzs7Ozs7Ozs7OztBQVdBOzs7Ozs7Ozs7OztBQVdBOzs7Ozs7Ozs7Ozs7O0FBYUE7Ozs7Ozs7OztBQVNBOzs7Ozs7OztBQVVBOzs7Ozs7Ozs7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QSxZQUFJQSxPQUFPLFdBQVgsRUFDRSxPQUFPLFNBQVAsQ0FERixLQUVLLElBQUlBLE9BQU8sS0FBWCxFQUNILE9BQU8sS0FBUCxDQURHLEtBR0gsT0FBTyxPQUFQO0FBQ0gsT0FUb0IsRUFBckI7QUFVRDs7Ozs7QUFHSCx5QkFBZThHLFFBQWYsQ0FBd0JqRSxVQUF4QixFQUFvQ0MsUUFBcEM7O2tCQUVlQSxRIiwiZmlsZSI6IlBsYXRmb3JtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXVkaW9Db250ZXh0IH0gZnJvbSAnd2F2ZXMtYXVkaW8nO1xuaW1wb3J0IGNsaWVudCBmcm9tICcuLi9jb3JlL2NsaWVudCc7XG5pbXBvcnQgTW9iaWxlRGV0ZWN0IGZyb20gJ21vYmlsZS1kZXRlY3QnO1xuaW1wb3J0IHNjcmVlbmZ1bGwgZnJvbSAnc2NyZWVuZnVsbCc7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuXG4vKipcbiAqIEFQSSBvZiBhIGNvbXBsaWFudCB2aWV3IGZvciB0aGUgYHBsYXRmb3JtYCBzZXJ2aWNlLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBpbnRlcmZhY2UgQWJzdHJhY3RQbGF0Zm9ybVZpZXdcbiAqIEBleHRlbmRzIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BYnN0cmFjdFZpZXdcbiAqIEBhYnN0cmFjdFxuICovXG4vKipcbiAqIFJlZ2lzdGVyIHRoZSBjYWxsYmFjayB0byBleGVjdXRlIHdoZW4gdGhlIHVzZXIgdG91Y2hlcyB0aGUgc2NyZWVuIGZvciB0aGUgZmlyc3QgdGltZS5cbiAqXG4gKiBAbmFtZSBzZXRUb3VjaFN0YXJ0Q2FsbGJhY2tcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWJzdHJhY3RQbGF0Zm9ybVZpZXdcbiAqIEBmdW5jdGlvblxuICogQGFic3RyYWN0XG4gKiBAaW5zdGFuY2VcbiAqXG4gKiBAcGFyYW0ge3RvdWNoU3RhcnRDYWxsYmFja30gY2FsbGJhY2sgLSBDYWxsYmFjayB0byBleGVjdXRlIHdoZW4gdGhlIHVzZXJcbiAqICB0b3VjaGVzIHRoZSBzY3JlZW4gZm9yIHRoZSBmaXJzdCB0aW1lLlxuICovXG4vKipcbiAqIFJlZ2lzdGVyIHRoZSBjYWxsYmFjayB0byBleGVjdXRlIHdoZW4gdGhlIHVzZXIgY2xpY2tzIHRoZSBzY3JlZW4gZm9yIHRoZSBmaXJzdCB0aW1lLlxuICpcbiAqIEBuYW1lIHNldE1vdXNlZG93bkNhbGxiYWNrXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0UGxhdGZvcm1WaWV3XG4gKiBAZnVuY3Rpb25cbiAqIEBhYnN0cmFjdFxuICogQGluc3RhbmNlXG4gKlxuICogQHBhcmFtIHttb3VzZURvd25DYWxsYmFja30gY2FsbGJhY2sgLSBDYWxsYmFjayB0byBleGVjdXRlIHdoZW4gdGhlIHVzZXJcbiAqICBjbGlja3MgdGhlIHNjcmVlbiBmb3IgdGhlIGZpcnN0IHRpbWUuXG4gKi9cbi8qKlxuICogVXBkYXRlIHRoZSB2aWV3IHRvIG5vdGlmeSB0aGF0IHRoZSBjb21wYXRpYmlsaXR5IGNoZWNrcyBhcmUgdGVybWluYXRlZC5cbiAqXG4gKiBAbmFtZSB1cGRhdGVDaGVja2luZ1N0YXR1c1xuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BYnN0cmFjdFBsYXRmb3JtVmlld1xuICogQGZ1bmN0aW9uXG4gKiBAYWJzdHJhY3RcbiAqIEBpbnN0YW5jZVxuICpcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gdmFsdWVcbiAqL1xuLyoqXG4gKiBVcGRhdGUgdGhlIHZpZXcgdG8gbm90aWZ5IGlmIHRoZSBkZXZpY2UgaXMgY29tcGF0aWJsZSBvciBub3QuXG4gKlxuICogQG5hbWUgdXBkYXRlSXNDb21wYXRpYmxlU3RhdHVzXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0UGxhdGZvcm1WaWV3XG4gKiBAZnVuY3Rpb25cbiAqIEBhYnN0cmFjdFxuICogQGluc3RhbmNlXG4gKlxuICogQHBhcmFtIHtCb29sZWFufSB2YWx1ZVxuICovXG4vKipcbiAqIFVwZGF0ZSB0aGUgdmlldyB0byBub3RpZnkgaWYgdGhlIGFwcGxpY2F0aW9uIG9idGFpbmVkIGFsbCB0aGUgYXV0aG9yaXphdGlvbnNcbiAqIG9yIG5vdC5cbiAqXG4gKiBAbmFtZSB1cGRhdGVIYXNBdXRob3JpemF0aW9uc1N0YXR1c1xuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BYnN0cmFjdFBsYXRmb3JtVmlld1xuICogQGZ1bmN0aW9uXG4gKiBAYWJzdHJhY3RcbiAqIEBpbnN0YW5jZVxuICpcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gdmFsdWVcbiAqL1xuXG4vKipcbiAqIENhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiB0aGUgdXNlciB0b3VjaGVzIHRoZSBzY3JlZW4gZm9yIHRoZSBmaXJzdCB0aW1lLlxuICpcbiAqIEBjYWxsYmFja1xuICogQG5hbWUgdG91Y2hTdGFydENhbGxiYWNrXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0UGxhdGZvcm1WaWV3XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHBhc3N3b3JkIC0gUGFzc3dvcmQgZ2l2ZW4gYnkgdGhlIHVzZXIuXG4gKi9cbi8qKlxuICogQ2FsbGJhY2sgdG8gZXhlY3V0ZSB3aGVuIHRoZSB1c2VyIGNsaWNrcyB0aGUgc2NyZWVuIGZvciB0aGUgZmlyc3QgdGltZS5cbiAqXG4gKiBAY2FsbGJhY2tcbiAqIEBuYW1lIG1vdXNlRG93bkNhbGxiYWNrXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0UGxhdGZvcm1WaWV3XG4gKi9cblxuXG5cbi8qKlxuICogU3RydWN0dXJlIG9mIHRoZSBkZWZpbml0aW9uIGZvciB0aGUgdGVzdCBvZiBhIGZlYXR1cmUuXG4gKlxuICogQHR5cGVkZWYge09iamVjdH0gbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYXRmb3JtfmRlZmluaXRpb25cbiAqXG4gKiBAcHJvcGVydHkge1N0cmluZ30gaWQgLSBJZCBvZiB0aGUgZGVmaW5pdGlvbi5cbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGNoZWNrIC0gQSBmdW5jdGlvbiB0aGF0IHNob3VsZCByZXR1cm4gYHRydWVgIGlmIHRoZVxuICogIGZlYXR1cmUgaXMgYXZhaWxhYmxlIG9uIHRoZSBwbGF0Zm9ybSwgYGZhbHNlYCBvdGhlcndpc2UuXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBbc3RhcnRIb29rXSAtIEEgZnVuY3Rpb24gcmV0dXJuaW5nIGEgYFByb21pc2VgIHRvIGJlXG4gKiAgZXhlY3V0ZWQgb24gc3RhcnQgKGZvciBleGFtcGxlIHRvIGFzayBhY2Nlc3MgdG8gbWljcm9waG9uZSBvciBnZW9sb2NhdGlvbikuXG4gKiAgVGhlIHJldHVybmVkIHByb21pc2Ugc2hvdWxkIGJlIHJlc29sdmVkIG9uIGB0cnVlYCBpcyB0aGUgcHJvY2VzcyBzdWNjZWRlZCBvclxuICogIGBmYWxzZWAgaXMgdGhlIHByZWNlc3MgZmFpbGVkIChlLmcuIHBlcm1pc3Npb24gbm90IGdyYW50ZWQpLlxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gW2ludGVyYWN0aW9uSG9va10gLSBBIGZ1bmN0aW9uIHJldHVybmluZyBhIFByb21pc2V0byBiZVxuICogIGV4ZWN1dGVkIG9uIHRoZSBmaXJzdCBpbnRlcmFjdGlvbiAoaS5lLiBgY2xpY2tgIG9yIGB0b3VjaHN0YXJ0YCkgb2YgdGhlIHVzZXJcbiAqICB3aXRoIGFwcGxpY2F0aW9uIChmb3IgZXhhbXBsZSwgdG8gaW5pdGlhbGl6ZSBBdWRpb0NvbnRleHQgb24gaU9TIGRldmljZXMpLlxuICogIFRoZSByZXR1cm5lZCBwcm9taXNlIHNob3VsZCBiZSByZXNvbHZlZCBvbiBgdHJ1ZWAgaXMgdGhlIHByb2Nlc3Mgc3VjY2VkZWQgb3JcbiAqICBgZmFsc2VgIGlzIHRoZSBwcmVjZXNzIGZhaWxlZCAoZS5nLiBwZXJtaXNzaW9uIG5vdCBncmFudGVkKS5cbiAqL1xuY29uc3QgZGVmYXVsdERlZmluaXRpb25zID0gW1xuICB7XG4gICAgaWQ6ICd3ZWItYXVkaW8nLFxuICAgIGNoZWNrOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAhIWF1ZGlvQ29udGV4dDtcbiAgICB9LFxuICAgIGludGVyYWN0aW9uSG9vazogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIWNsaWVudC5wbGF0Zm9ybS5pc01vYmlsZSlcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcblxuICAgICAgY29uc3QgZyA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG4gICAgICBnLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcbiAgICAgIGcuZ2Fpbi52YWx1ZSA9IDAuMDAwMDAwMDAxOyAvLyAtMTgwZEIgP1xuXG4gICAgICBjb25zdCBvID0gYXVkaW9Db250ZXh0LmNyZWF0ZU9zY2lsbGF0b3IoKTtcbiAgICAgIG8uY29ubmVjdChnKTtcbiAgICAgIG8uZnJlcXVlbmN5LnZhbHVlID0gMjA7XG4gICAgICBvLnN0YXJ0KDApO1xuXG4gICAgICAvLyBwcmV2ZW50IGFuZHJvaWQgdG8gc3RvcCBhdWRpbyBieSBrZWVwaW5nIHRoZSBvc2NpbGxhdG9yIGFjdGl2ZVxuICAgICAgaWYgKGNsaWVudC5wbGF0Zm9ybS5vcyAhPT0gJ2FuZHJvaWQnKVxuICAgICAgICBvLnN0b3AoYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lICsgMC4wMSk7XG5cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XG4gICAgfVxuICB9LFxuICB7XG4gICAgLy8gQG5vdGU6IGB0b3VjaGAgZmVhdHVyZSB3b3JrYXJvdW5kXG4gICAgLy8gY2YuIGh0dHA6Ly93d3cuc3R1Y294LmNvbS9ibG9nL3lvdS1jYW50LWRldGVjdC1hLXRvdWNoc2NyZWVuL1xuICAgIGlkOiAnbW9iaWxlLWRldmljZScsXG4gICAgY2hlY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNsaWVudC5wbGF0Zm9ybS5pc01vYmlsZTtcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBpZDogJ2F1ZGlvLWlucHV0JyxcbiAgICBjaGVjazogZnVuY3Rpb24oKSB7XG4gICAgICBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhID0gKFxuICAgICAgICBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhIHx8XG4gICAgICAgIG5hdmlnYXRvci53ZWJraXRHZXRVc2VyTWVkaWEgfHxcbiAgICAgICAgbmF2aWdhdG9yLm1vekdldFVzZXJNZWRpYSB8fFxuICAgICAgICBuYXZpZ2F0b3IubXNHZXRVc2VyTWVkaWFcbiAgICAgICk7XG5cbiAgICAgIHJldHVybiAhIW5hdmlnYXRvci5nZXRVc2VyTWVkaWE7XG4gICAgfSxcbiAgICBzdGFydEhvb2s6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhKHsgYXVkaW86IHRydWUgfSwgZnVuY3Rpb24oc3RyZWFtKSB7XG4gICAgICAgICAgc3RyZWFtLmdldEF1ZGlvVHJhY2tzKClbMF0uc3RvcCgpO1xuICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9LFxuICB7XG4gICAgaWQ6ICdmdWxsLXNjcmVlbicsXG4gICAgY2hlY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gZnVuY3Rpb25uYWxpdHkgdGhhdCBjYW5ub3QgYnJha2UgdGhlIGFwcGxpY2F0aW9uXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIGludGVyYWN0aW9uSG9vaygpIHtcbiAgICAgIGlmIChzY3JlZW5mdWxsLmVuYWJsZWQpXG4gICAgICAgIHNjcmVlbmZ1bGwucmVxdWVzdCgpO1xuXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGlkOiAnZ2VvbG9jYXRpb24nLFxuICAgIGNoZWNrOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAhIW5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb247XG4gICAgfSxcbiAgICBzdGFydEhvb2s6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKChwb3NpdGlvbikgPT4ge1xuICAgICAgICAgIC8vIHBvcHVsYXRlIGNsaWVudCB3aXRoIGZpcnN0IHZhbHVlXG4gICAgICAgICAgY29uc3QgY29vcmRzID0gcG9zaXRpb24uY29vcmRzO1xuICAgICAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IFtjb29yZHMubGF0aXR1ZGUsIGNvb3Jkcy5sb25naXR1ZGVdO1xuICAgICAgICAgIGNsaWVudC5nZW9wb3NpdGlvbiA9IHBvc2l0aW9uO1xuXG4gICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgfSwgKGVycikgPT4ge1xuICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfSwge30pO1xuICAgICAgfSk7XG4gICAgfVxuICB9LFxuICB7XG4gICAgaWQ6ICdnZW9sb2NhdGlvbi1tb2NrJyxcbiAgICBjaGVjazogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIHN0YXJ0SG9vazogZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBsYXQgPSBNYXRoLnJhbmRvbSgpICogMzYwIC0gMTgwO1xuICAgICAgY29uc3QgbG5nID0gTWF0aC5yYW5kb20oKSAqIDE4MCAtIDkwO1xuICAgICAgY2xpZW50LmNvb3JkaW5hdGVzID0gW2xhdCwgbG5nXTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XG4gICAgfVxuICB9LFxuICB7XG4gICAgLy8gYWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9yaWNodHIvTm9TbGVlcC5qcy9ibG9iL21hc3Rlci9Ob1NsZWVwLmpzXG4gICAgLy8gd2FybmluZzogY2F1c2UgMTUwJSBjcHUgdXNlIGluIGNocm9tZSBkZXNrdG9wLi4uXG4gICAgaWQ6ICd3YWtlLWxvY2snLFxuICAgIGNoZWNrOiBmdW5jdGlvbigpIHtcbiAgICAgIC8vIGZ1bmN0aW9ubmFsaXR5IHRoYXQgY2Fubm90IGJyYWtlIHRoZSBhcHBsaWNhdGlvblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBpbnRlcmFjdGlvbkhvb2s6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKGNsaWVudC5wbGF0Zm9ybS5vcyA9PT0gJ2lvcycpIHtcbiAgICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IHdpbmRvdy5sb2NhdGlvbjtcbiAgICAgICAgICBzZXRUaW1lb3V0KHdpbmRvdy5zdG9wLCAwKTtcbiAgICAgICAgfSwgMzAwMDApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgbWVkaWFzID0ge1xuICAgICAgICAgIHdlYm06IFwiZGF0YTp2aWRlby93ZWJtO2Jhc2U2NCxHa1hmbzBBZ1FvYUJBVUwzZ1FGQzhvRUVRdk9CQ0VLQ1FBUjNaV0p0UW9lQkFrS0ZnUUlZVTRCblFJMFZTYWxtUUNncTE3RkFBdzlDUUUyQVFBWjNhR0Z0YlhsWFFVQUdkMmhoYlcxNVJJbEFDRUNQUUFBQUFBQUFGbFN1YTBBeHJrQXUxNEVCWThXQkFaeUJBQ0sxbkVBRGRXNWtoa0FGVmw5V1VEZ2xob2hBQTFaUU9JT0JBZUJBQnJDQkNMcUJDQjlEdG5WQUl1ZUJBS05BSElFQUFJQXdBUUNkQVNvSUFBZ0FBVUFtSmFRQUEzQUEvdnowQUFBPVwiLFxuICAgICAgICAgIG1wNDogXCJkYXRhOnZpZGVvL21wNDtiYXNlNjQsQUFBQUhHWjBlWEJwYzI5dEFBQUNBR2x6YjIxcGMyOHliWEEwTVFBQUFBaG1jbVZsQUFBQUcyMWtZWFFBQUFHekFCQUhBQUFCdGhBREFvd2RiYjkvQUFBQzZXMXZiM1lBQUFCc2JYWm9aQUFBQUFCOEpiQ0FmQ1d3Z0FBQUErZ0FBQUFBQUFFQUFBRUFBQUFBQUFBQUFBQUFBQUFCQUFBQUFBQUFBQUFBQUFBQUFBQUFBUUFBQUFBQUFBQUFBQUFBQUFBQVFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUlBQUFJVmRISmhhd0FBQUZ4MGEyaGtBQUFBRDN3bHNJQjhKYkNBQUFBQUFRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQkFBQUFBQUFBQUFBQUFBQUFBQUFBQVFBQUFBQUFBQUFBQUFBQUFBQUFRQUFBQUFBSUFBQUFDQUFBQUFBQnNXMWthV0VBQUFBZ2JXUm9aQUFBQUFCOEpiQ0FmQ1d3Z0FBQUErZ0FBQUFBVmNRQUFBQUFBQzFvWkd4eUFBQUFBQUFBQUFCMmFXUmxBQUFBQUFBQUFBQUFBQUFBVm1sa1pXOUlZVzVrYkdWeUFBQUFBVnh0YVc1bUFBQUFGSFp0YUdRQUFBQUJBQUFBQUFBQUFBQUFBQUFrWkdsdVpnQUFBQnhrY21WbUFBQUFBQUFBQUFFQUFBQU1kWEpzSUFBQUFBRUFBQUVjYzNSaWJBQUFBTGh6ZEhOa0FBQUFBQUFBQUFFQUFBQ29iWEEwZGdBQUFBQUFBQUFCQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFJQUFnQVNBQUFBRWdBQUFBQUFBQUFBUUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFCai8vd0FBQUZKbGMyUnpBQUFBQUFORUFBRUFCRHdnRVFBQUFBQUREVUFBQUFBQUJTMEFBQUd3QVFBQUFiV0pFd0FBQVFBQUFBRWdBTVNOaUI5RkFFUUJGR01BQUFHeVRHRjJZelV5TGpnM0xqUUdBUUlBQUFBWWMzUjBjd0FBQUFBQUFBQUJBQUFBQVFBQUFBQUFBQUFjYzNSell3QUFBQUFBQUFBQkFBQUFBUUFBQUFFQUFBQUJBQUFBRkhOMGMzb0FBQUFBQUFBQUV3QUFBQUVBQUFBVWMzUmpid0FBQUFBQUFBQUJBQUFBTEFBQUFHQjFaSFJoQUFBQVdHMWxkR0VBQUFBQUFBQUFJV2hrYkhJQUFBQUFBQUFBQUcxa2FYSmhjSEJzQUFBQUFBQUFBQUFBQUFBQUsybHNjM1FBQUFBanFYUnZid0FBQUJ0a1lYUmhBQUFBQVFBQUFBQk1ZWFptTlRJdU56Z3VNdz09XCJcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCAkdmlkZW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd2aWRlbycpO1xuICAgICAgICAkdmlkZW8uc2V0QXR0cmlidXRlKCdsb29wJywgJycpO1xuXG4gICAgICAgIGZvciAobGV0IHR5cGUgaW4gbWVkaWFzKSB7XG4gICAgICAgICAgY29uc3QgZGF0YVVSSSA9IG1lZGlhc1t0eXBlXTtcbiAgICAgICAgICBjb25zdCAkc291cmNlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc291cmNlJyk7XG4gICAgICAgICAgJHNvdXJjZS5zcmMgPSBkYXRhVVJJO1xuICAgICAgICAgICRzb3VyY2UudHlwZSA9IGB2aWRlby8ke3R5cGV9YDtcblxuICAgICAgICAgICR2aWRlby5hcHBlbmRDaGlsZCgkc291cmNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgICR2aWRlby5wbGF5KCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XG4gICAgfVxuICB9XG5dO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6cGxhdGZvcm0nO1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIGNsaWVudCBgJ3BsYXRmb3JtJ2Agc2VydmljZS5cbiAqXG4gKiBUaGUgYHBsYXRmb3JtYCBzZXJ2aWNlcyBpcyByZXNwb25zaWJsZSBmb3IgZ2l2aW5nIGdlbmVyYWwgaW5mb3JtYXRpb25zXG4gKiBhYm91dCB0aGUgdXNlcidzIGRldmljZSBhcyB3ZWxsIGFzIGNoZWNraW5nIGF2YWlsYWJpbGl0eSBhbmQgcHJvdmlkaW5nIGhvb2tzXG4gKiBpbiBvcmRlciB0byBpbml0aWFsaXplIHRoZSBmZWF0dXJlcyByZXF1aXJlZCBieSB0aGUgYXBwbGljYXRpb24gKGF1ZGlvLFxuICogbWljcm9waG9uZSwgZXRjLikuXG4gKiBJZiBvbmUgb2YgdGhlIHJlcXVpcmVkIGRlZmluaXRpb25zIGlzIG5vdCBhdmFpbGFibGUsIGEgdmlldyBpcyBjcmVhdGVkIHdpdGhcbiAqIGFuIGVycm9yIG1lc3NhZ2UgYW5kIGBjbGllbnQuY29tcGF0aWJsZWAgaXMgc2V0IHRvIGBmYWxzZWAuXG4gKlxuICogQXZhaWxhYmxlIGJ1aWx0LWluIGRlZmluaXRpb25zIGFyZTpcbiAqIC0gJ3dlYi1hdWRpbydcbiAqIC0gJ21vYmlsZS1kZXZpY2UnOiBvbmx5LWFjY2VwdCBtb2JpbGUgZGV2aWNlcyBpbiB0aGUgYXBwbGljYXRpb24gKGJhc2VkIG9uXG4gKiAgIFVzZXItQWdlbnQgc25pZmZpbmcpXG4gKiAtICdhdWRpby1pbnB1dCc6IEFuZHJvaWQgT25seVxuICogLSAnZnVsbC1zY3JlZW4nOiBBbmRyb2lkIE9ubHksIHRoaXMgZmVhdHVyZSB3b24ndCBibG9jayB0aGUgYXBwbGljYXRpb24gaWZcbiAqICAgbm90IGF2YWlsYWJsZS5cbiAqIC0gJ2dlb2xvY2F0aW9uJzogY2hlY2sgaWYgdGhlIG5hdmlnYXRvciBzdXBwb3J0cyBnZW9sb2NhdGlvbi4gVGhlIGBjb29yZGluYXRlc2BcbiAqICAgYW5kIGBnZW9wb3NpdGlvbmAgb2YgdGhlIGBjbGllbnRgIGFyZSBwb3B1bGF0ZWQgd2hlbiB0aGUgcGxhZm9ybSBzZXJ2aWNlXG4gKiAgIHJlc29sdmVzLiAoaWYgbm8gdXBkYXRlIG9mIHRoZSBjb29yZGluYXRlcyBhcmUgbmVlZGVkIGluIHRoZSBhcHBsaWNhdGlvbixcbiAqICAgcmVxdWlyaW5nIGdlb2xvY2F0aW9uIGZlYXR1cmUgd2l0aG91dCB1c2luZyB0aGUgR2VvbG9jYXRpb24gc2VydmljZSBzaG91bGRcbiAqICAgc3VmZmljZSkuXG4gKiAtICd3YWtlLWxvY2snOiB1c2Ugd2l0aCBjYXV0aW9uLCBoYXMgYmVlbiBvYnNlcnZlZCBjb25zdW1taW5nXG4gKiAgIDE1MCUgY3B1IGluIGNocm9tZSBkZXNrdG9wLlxuICpcbiAqXG4gKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlXG4gKiBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7QXJyYXk8U3RyaW5nPnxTdHJpbmd9IG9wdGlvbnMuZmVhdHVyZXMgLSBJZChzKSBvZiB0aGUgZmVhdHVyZShzKVxuICogIHJlcXVpcmVkIGJ5IHRoZSBhcHBsaWNhdGlvbi4gQXZhaWxhYmxlIGJ1aWxkLWluIGZlYXR1cmVzIGFyZTpcbiAqICAtICd3ZWItYXVkaW8nXG4gKiAgLSAnbW9iaWxlLWRldmljZSc6IG9ubHkgYWNjZXB0IG1vYmlsZSBkZXZpY2VzIChyZWNvZ25pdGlvbiBiYXNlZCBVc2VyLUFnZW50KVxuICogIC0gJ2F1ZGlvLWlucHV0JzogQW5kcm9pZCBvbmx5XG4gKiAgLSAnZnVsbC1zY3JlZW4nOiBBbmRyb2lkIG9ubHlcbiAqICAtICdnZW9sb2NhdGlvbic6IGFjY2VwdCBnZW9sb2NhbGl6ZWQgZGV2aWNlcy4gUG9wdWxhdGUgdGhlIGNsaWVudCB3aXRoXG4gKiAgICAgY3VycmVudCBwb3NpdGlvblxuICogIC0gJ3dha2UtbG9jayc6IHRoaXMgZmVhdHVyZSBzaG91bGQgYmUgdXNlZCB3aXRoIGNhdXRpb24gYXNcbiAqICAgICBpdCBoYXMgYmVlbiBvYnNlcnZlZCB0byB1c2UgMTUwJSBvZiBjcHUgaW4gY2hyb21lIGRlc2t0b3AuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnNob3dEaWFsb2c9dHJ1ZV0gLSBJZiBzZXQgdG8gYGZhbHNlYCwgdGhlIHNlcnZpY2VcbiAqICBleGVjdXRlIGFsbCBob29rcyB3aXRob3V0IHdhaXRpbmcgZm9yIGEgdXNlciBpbnRlcmFjdGlvbiBhbmQgZG9lc24ndCBzaG93XG4gKiAgdGhlIHNlcnZpY2UncyB2aWV3LiBUaGlzIG9wdGlvbiBzaG91bGQgb25seSBiZSB1c2VkIG9uIGNvbnRyb2xsZWRcbiAqICBlbnZpcm9ubmVtZW50cyB3aGVyZSB0aGUgdGFyZ2V0IHBsYXRmb3JtIGlzIGtub3duIGZvciB3b3JraW5nIHdpdGhvdXRcbiAqICB0aGlzIG5lZWQgKGUuZy4gaXMgbm90IGlPUykuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQGV4YW1wbGVcbiAqIC8vIGluc2lkZSB0aGUgZXhwZXJpZW5jZSBjb25zdHJ1Y3RvclxuICogdGhpcy5wbGF0Zm9ybSA9IHRoaXMucmVxdWlyZSgncGxhdGZvcm0nLCB7IGZlYXR1cmVzOiAnd2ViLWF1ZGlvJyB9KTtcbiAqXG4gKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuY2xpZW50I3BsYXRmb3JtfVxuICovXG5jbGFzcyBQbGF0Zm9ybSBleHRlbmRzIFNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCBmYWxzZSk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIHNob3dEaWFsb2c6IHRydWUsXG4gICAgICB2aWV3OiBudWxsLFxuICAgICAgdmlld1ByaW9yaXR5OiAxMCxcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgdGhpcy52aWV3ID0gbnVsbDtcblxuICAgIC8vIHRoaXMuX2RlZmF1bHRWaWV3VGVtcGxhdGUgPSBkZWZhdWx0Vmlld1RlbXBsYXRlO1xuICAgIC8vIHRoaXMuX2RlZmF1bHRWaWV3Q29udGVudCA9IGRlZmF1bHRWaWV3Q29udGVudDtcblxuICAgIHRoaXMuX3JlcXVpcmVkRmVhdHVyZXMgPSBuZXcgU2V0KCk7XG4gICAgdGhpcy5fZmVhdHVyZURlZmluaXRpb25zID0ge307XG5cbiAgICBkZWZhdWx0RGVmaW5pdGlvbnMuZm9yRWFjaCgoZGVmKSA9PiB0aGlzLmFkZEZlYXR1cmVEZWZpbml0aW9uKGRlZikpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGNvbmZpZ3VyZShvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMuZmVhdHVyZXMpIHtcbiAgICAgIGxldCBmZWF0dXJlcyA9IG9wdGlvbnMuZmVhdHVyZXM7XG5cbiAgICAgIGlmICh0eXBlb2YgZmVhdHVyZXMgPT09ICdzdHJpbmcnKVxuICAgICAgICBmZWF0dXJlcyA9IFtmZWF0dXJlc107XG5cbiAgICAgIHRoaXMucmVxdWlyZUZlYXR1cmUoLi4uZmVhdHVyZXMpO1xuICAgICAgZGVsZXRlIG9wdGlvbnMuZmVhdHVyZXM7XG4gICAgfVxuXG4gICAgc3VwZXIuY29uZmlndXJlKG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqICBTdGFydCB0aGUgY2xpZW50LlxuICAgKiAgQWxnb3JpdGhtOlxuICAgKiAgLSBjaGVjayByZXF1aXJlZCBmZWF0dXJlc1xuICAgKiAgLSBpZiAoZmFsc2UpXG4gICAqICAgICBzaG93ICdzb3JyeScgc2NyZWVuXG4gICAqICAtIGVsc2VcbiAgICogICAgIHNob3cgJ3dlbGNvbWUnIHNjcmVlblxuICAgKiAgICAgZXhlY3V0ZSBzdGFydCBob29rIChwcm9taXNlKVxuICAgKiAgICAgLSBpZiAocHJvbWlzZSA9PT0gdHJ1ZSlcbiAgICogICAgICAgIHNob3cgdG91Y2ggdG8gc3RhcnRcbiAgICogICAgICAgIGJpbmQgZXZlbnRzXG4gICAqICAgICAtIGVsc2VcbiAgICogICAgICAgIHNob3cgJ3NvcnJ5JyBzY3JlZW5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICB0aGlzLl9kZWZpbmVBdWRpb0ZpbGVFeHRlbnRpb24oKTtcbiAgICB0aGlzLl9kZWZpbmVQbGF0Zm9ybSgpO1xuXG4gICAgLy8gcmVzb2x2ZSByZXF1aXJlZCBmZWF0dXJlcyBmcm9tIHRoZSBhcHBsaWNhdGlvblxuICAgIGNsaWVudC5jb21wYXRpYmxlID0gdGhpcy5fY2hlY2tSZXF1aXJlZEZlYXR1cmVzKCk7XG5cbiAgICAvLyBoYW5kbGUgYHNob3dEaWFsb2cgPT09IGZhbHNlYFxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0RpYWxvZyA9PT0gZmFsc2UpIHtcbiAgICAgIGlmIChjbGllbnQuY29tcGF0aWJsZSkge1xuICAgICAgICBjb25zdCBzdGFydFByb21pc2VzID0gdGhpcy5fZ2V0SG9va3MoJ3N0YXJ0SG9vaycpO1xuICAgICAgICBjb25zdCBpbnRlcmFjdGlvblByb21pc2VzID0gdGhpcy5fZ2V0SG9va3MoJ2ludGVyYWN0aW9uSG9vaycpO1xuICAgICAgICBjb25zdCBwcm9taXNlcyA9IFtdLmNvbmNhdChzdGFydFByb21pc2VzLCBpbnRlcmFjdGlvblByb21pc2VzKTtcblxuICAgICAgICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbihyZXN1bHRzID0+IHtcbiAgICAgICAgICBsZXQgcmVzb2x2ZWQgPSB0cnVlO1xuICAgICAgICAgIHJlc3VsdHMuZm9yRWFjaChib29sID0+IHJlc29sdmVkID0gcmVzb2x2ZWQgJiYgYm9vbCk7XG5cbiAgICAgICAgICBpZiAocmVzb2x2ZWQpXG4gICAgICAgICAgICB0aGlzLnJlYWR5KCk7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBzZXJ2aWNlOnBsYXRmb3JtIC0gZGlkbid0IG9idGFpbiB0aGUgbmVjZXNzYXJ5IGF1dGhvcml6YXRpb25zYCk7XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3NlcnZpY2U6cGxhdGZvcm0gLSBjbGllbnQgbm90IGNvbXBhdGlibGUnKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gZGVmYXVsdCB2aWV3IHZhbHVlc1xuICAgICAgdGhpcy52aWV3LnVwZGF0ZUNoZWNraW5nU3RhdHVzKGZhbHNlKTtcbiAgICAgIHRoaXMudmlldy51cGRhdGVJc0NvbXBhdGlibGVTdGF0dXMobnVsbCk7XG4gICAgICB0aGlzLnZpZXcudXBkYXRlSGFzQXV0aG9yaXphdGlvbnNTdGF0dXMobnVsbCk7XG5cbiAgICAgIGlmICghY2xpZW50LmNvbXBhdGlibGUpIHtcbiAgICAgICAgdGhpcy52aWV3LnVwZGF0ZUlzQ29tcGF0aWJsZVN0YXR1cyhmYWxzZSk7XG4gICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy52aWV3LnVwZGF0ZUlzQ29tcGF0aWJsZVN0YXR1cyh0cnVlKTtcbiAgICAgICAgdGhpcy52aWV3LnVwZGF0ZUNoZWNraW5nU3RhdHVzKHRydWUpO1xuICAgICAgICB0aGlzLnNob3coKTtcblxuICAgICAgICAvLyBleGVjdXRlIHN0YXJ0IGhvb2tcbiAgICAgICAgY29uc3Qgc3RhcnRQcm9taXNlcyA9IHRoaXMuX2dldEhvb2tzKCdzdGFydEhvb2snKTtcblxuICAgICAgICBQcm9taXNlLmFsbChzdGFydFByb21pc2VzKS50aGVuKHJlc3VsdHMgPT4ge1xuICAgICAgICAgIC8vIGlmIG9uZSBvZiB0aGUgc3RhcnQgaG9vayBmYWlsZWRcbiAgICAgICAgICBsZXQgaGFzQXV0aG9yaXphdGlvbnMgPSB0cnVlO1xuICAgICAgICAgIHJlc3VsdHMuZm9yRWFjaChzdWNjZXNzID0+IGhhc0F1dGhvcml6YXRpb25zID0gaGFzQXV0aG9yaXphdGlvbnMgJiYgc3VjY2Vzcyk7XG5cbiAgICAgICAgICB0aGlzLnZpZXcudXBkYXRlSGFzQXV0aG9yaXphdGlvbnNTdGF0dXMoaGFzQXV0aG9yaXphdGlvbnMpO1xuICAgICAgICAgIHRoaXMudmlldy51cGRhdGVDaGVja2luZ1N0YXR1cyhmYWxzZSk7XG5cbiAgICAgICAgICBpZiAoaGFzQXV0aG9yaXphdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMudmlldy5zZXRUb3VjaFN0YXJ0Q2FsbGJhY2sodGhpcy5fb25JbnRlcmFjdGlvbigndG91Y2gnKSk7XG4gICAgICAgICAgICB0aGlzLnZpZXcuc2V0TW91c2VEb3duQ2FsbGJhY2sodGhpcy5fb25JbnRlcmFjdGlvbignbW91c2UnKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiBjb25zb2xlLmVycm9yKGVyci5zdGFjaykpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdG9wKCkge1xuICAgIHRoaXMuaGlkZSgpO1xuICAgIHN1cGVyLnN0b3AoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdHJ1Y3R1cmUgb2YgdGhlIGRlZmluaXRpb24gZm9yIHRoZSB0ZXN0IG9mIGEgZmVhdHVyZS5cbiAgICpcbiAgICogQHBhcmFtIHttb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhdGZvcm1+ZGVmaW5pdGlvbn0gb2JqIC0gRGVmaW5pdGlvbiBvZlxuICpcbiAgICogIHRoZSBmZWF0dXJlLlxuICAgKi9cbiAgYWRkRmVhdHVyZURlZmluaXRpb24ob2JqKSB7XG4gICAgdGhpcy5fZmVhdHVyZURlZmluaXRpb25zW29iai5pZF0gPSBvYmo7XG4gIH1cblxuICAvKipcbiAgICogUmVxdWlyZSBmZWF0dXJlcyBmb3IgdGhlIGFwcGxpY2F0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gey4uLlN0cmluZ30gZmVhdHVyZXMgLSBJZChzKSBvZiB0aGUgZmVhdHVyZShzKSB0byBiZSByZXF1aXJlZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlcXVpcmVGZWF0dXJlKC4uLmZlYXR1cmVzKSB7XG4gICAgZmVhdHVyZXMuZm9yRWFjaCgoaWQpID0+IHRoaXMuX3JlcXVpcmVkRmVhdHVyZXMuYWRkKGlkKSk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBFeGVjdXRlIGBpbnRlcmFjdGlvbnNgIGhvb2tzIGZyb20gdGhlIGBwbGF0Zm9ybWAgc2VydmljZS5cbiAgICogQWxzbyBhY3RpdmF0ZSB0aGUgbWVkaWEgYWNjb3JkaW5nIHRvIHRoZSBgb3B0aW9uc2AuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfb25JbnRlcmFjdGlvbih0eXBlKSB7XG4gICAgcmV0dXJuIChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICBjbGllbnQucGxhdGZvcm0uaW50ZXJhY3Rpb24gPSB0eXBlO1xuICAgICAgLy8gZXhlY3V0ZSBpbnRlcmFjdGlvbiBob29rcyBmcm9tIHRoZSBwbGF0Zm9ybVxuICAgICAgY29uc3QgaW50ZXJhY3Rpb25Qcm9taXNlcyA9IHRoaXMuX2dldEhvb2tzKCdpbnRlcmFjdGlvbkhvb2snKTtcblxuICAgICAgUHJvbWlzZS5hbGwoaW50ZXJhY3Rpb25Qcm9taXNlcykudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICBsZXQgcmVzb2x2ZWQgPSB0cnVlO1xuICAgICAgICByZXN1bHRzLmZvckVhY2goYm9vbCA9PiByZXNvbHZlZCA9IHJlc29sdmVkICYmIGJvb2wpO1xuXG4gICAgICAgIGlmIChyZXNvbHZlZCkge1xuICAgICAgICAgIHRoaXMucmVhZHkoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnZpZXcudXBkYXRlSGFzQXV0aG9yaXphdGlvbnNTdGF0dXMocmVzb2x2ZWQpO1xuICAgICAgICB9XG4gICAgICB9KS5jYXRjaCgoZXJyKSA9PiBjb25zb2xlLmVycm9yKGVyci5zdGFjaykpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlIGFsbCBgY2hlY2tgIGZ1bmN0aW9ucyBkZWZpbmVkIGluIHRoZSByZXF1aXJlZCBmZWF0dXJlcy5cbiAgICpcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gLSBgdHJ1ZWAgaWYgYWxsIGNoZWNrcyBwYXNzLCBgZmFsc2VgIG90aGVyd2lzZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9jaGVja1JlcXVpcmVkRmVhdHVyZXMoKSB7XG4gICAgbGV0IHJlc3VsdCA9IHRydWU7XG5cbiAgICB0aGlzLl9yZXF1aXJlZEZlYXR1cmVzLmZvckVhY2goZmVhdHVyZSA9PiB7XG4gICAgICBjb25zdCBjaGVja0Z1bmN0aW9uID0gdGhpcy5fZmVhdHVyZURlZmluaXRpb25zW2ZlYXR1cmVdLmNoZWNrO1xuXG4gICAgICBpZiAoISh0eXBlb2YgY2hlY2tGdW5jdGlvbiA9PT0gJ2Z1bmN0aW9uJykpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gY2hlY2sgZnVuY3Rpb24gZGVmaW5lZCBmb3IgJHtmZWF0dXJlfSBmZWF0dXJlYCk7XG5cbiAgICAgIHJlc3VsdCA9IHJlc3VsdCAmJiBjaGVja0Z1bmN0aW9uKCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9nZXRIb29rcyh0eXBlKSB7XG4gICAgY29uc3QgaG9va3MgPSBbXTtcblxuICAgIHRoaXMuX3JlcXVpcmVkRmVhdHVyZXMuZm9yRWFjaChmZWF0dXJlID0+IHtcbiAgICAgIGNvbnN0IGhvb2sgPSB0aGlzLl9mZWF0dXJlRGVmaW5pdGlvbnNbZmVhdHVyZV1bdHlwZV07XG5cbiAgICAgIGlmIChob29rKVxuICAgICAgICBob29rcy5wdXNoKGhvb2spO1xuICAgIH0pO1xuXG4gICAgLy8gcmV0dXJuIGFuIGFycmF5IG9mIFByb21pc2VzIGluc3RlYWQgb2YgZnVuY3Rpb25cbiAgICByZXR1cm4gaG9va3MubWFwKGhvb2sgPT4gaG9vaygpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQb3B1bGF0ZSBgY2xpZW50LnBsYXRmb3JtYCB3aXRoIHRoZSBwcmVmZXJlZCBhdWRpbyBmaWxlIGV4dGVudGlvblxuICAgKiBmb3IgdGhlIHBsYXRmb3JtLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2RlZmluZUF1ZGlvRmlsZUV4dGVudGlvbigpIHtcbiAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYXVkaW8nKTtcbiAgICAvLyBodHRwOi8vZGl2ZWludG9odG1sNS5pbmZvL2V2ZXJ5dGhpbmcuaHRtbFxuICAgIGlmICghIShhLmNhblBsYXlUeXBlICYmIGEuY2FuUGxheVR5cGUoJ2F1ZGlvL21wZWc7JykpKVxuICAgICAgY2xpZW50LnBsYXRmb3JtLmF1ZGlvRmlsZUV4dCA9ICcubXAzJztcbiAgICBlbHNlIGlmICghIShhLmNhblBsYXlUeXBlICYmIGEuY2FuUGxheVR5cGUoJ2F1ZGlvL29nZzsgY29kZWNzPVwidm9yYmlzXCInKSkpXG4gICAgICBjbGllbnQucGxhdGZvcm0uYXVkaW9GaWxlRXh0ID0gJy5vZ2cnO1xuICAgIGVsc2VcbiAgICAgIGNsaWVudC5wbGF0Zm9ybS5hdWRpb0ZpbGVFeHQgPSAnLndhdic7XG4gIH1cblxuICAvKipcbiAgICogUG9wdWxhdGUgYGNsaWVudC5wbGF0Zm9ybWAgd2l0aCB0aGUgb3MgbmFtZS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9kZWZpbmVQbGF0Zm9ybSgpIHtcbiAgICBjb25zdCB1YSA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50XG4gICAgY29uc3QgbWQgPSBuZXcgTW9iaWxlRGV0ZWN0KHVhKTtcblxuICAgIGNsaWVudC5wbGF0Zm9ybS5pc01vYmlsZSA9IChtZC5tb2JpbGUoKSAhPT0gbnVsbCk7IC8vIHRydWUgaWYgcGhvbmUgb3IgdGFibGV0XG4gICAgY2xpZW50LnBsYXRmb3JtLm9zID0gKGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3Qgb3MgPSBtZC5vcygpO1xuXG4gICAgICBpZiAob3MgPT09ICdBbmRyb2lkT1MnKVxuICAgICAgICByZXR1cm4gJ2FuZHJvaWQnO1xuICAgICAgZWxzZSBpZiAob3MgPT09ICdpT1MnKVxuICAgICAgICByZXR1cm4gJ2lvcyc7XG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiAnb3RoZXInO1xuICAgIH0pKCk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgUGxhdGZvcm0pO1xuXG5leHBvcnQgZGVmYXVsdCBQbGF0Zm9ybTtcbiJdfQ==