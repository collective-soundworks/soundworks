'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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

var _client = require('../core/client');

var _client2 = _interopRequireDefault(_client);

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
 * @private
 */
function _base64(format, base64) {
  return 'data:' + format + ';base64,' + base64;
}

var SERVICE_ID = 'service:welcome';

/**
 * [client] Check whether the device is compatible with the technologies used in the *Soundworks* library.
 * The service should used at the very beginning of a scenario to activate the Web Audio API on iOS devices (with the `activateAudio` option).
 *
 * The service requires the participant to tap the screen in order to initialize the webAudio on iOS devices and to make the view disappear.
 *
 * Compatible devices are running on iOS 7 or above, or on Android 4.2 or above with the Chrome browser in version 35 or above.
 * If that is not the case, the service displays a blocking `view` and prevents the participant to go any further in the scenario.
 *
 * The service finishes its initialization when the user touches the screen if the device passes the platform test, and never otherwise.
 */

var Welcome = function (_Service) {
  (0, _inherits3.default)(Welcome, _Service);

  function Welcome() {
    (0, _classCallCheck3.default)(this, Welcome);


    /**
     * @type {Object} [defaults={}] - Options.
     * @type {String} [defaults.name='welcome'] - Name of the service.
     * @type {Boolean} [defaults.activateAudio=true] - Indicates whether the service activates the Web Audio API when the participant touches the screen (useful on iOS devices).
     * @type {Boolean} [defaults.requireMobile=true] - Defines if the application requires the use of a mobile device.
     * @type {Boolean} [defaults.wakeLock=false] - Indicates whether the service activates an ever-looping 1-pixel video to prevent the device from going idle.
     */

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Welcome).call(this, SERVICE_ID, false));

    var defaults = {
      fullScreen: false,
      wakeLock: false,
      showDialog: true,
      viewCtor: _SegmentedView2.default,
      viewPriority: 10
    };

    _this.configure(defaults);

    _this._platform = _this.require('platform');
    return _this;
  }

  (0, _createClass3.default)(Welcome, [{
    key: 'init',
    value: function init() {
      if (this.options.showDialog) {
        this.viewCtor = this.options.viewCtor;
        this.view = this.createView();
      }
    }
  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Welcome.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      // execute start hooks from the platform
      var startHooks = this._platform.getStartHooks();
      startHooks.forEach(function (hook) {
        return hook();
      });

      if (!this.options.showDialog) this.ready();else this.show();

      // install events for interaction hook
      var event = _client2.default.platform.isMobile ? 'touchend' : 'click';
      this.view.installEvents((0, _defineProperty3.default)({}, event, this._onInteraction.bind(this)));
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.hide();
      (0, _get3.default)((0, _getPrototypeOf2.default)(Welcome.prototype), 'stop', this).call(this);
    }

    /**
     * Execute `interactions` hooks from the `platform` service.
     * Also activate the media according to the `options`.
     */

  }, {
    key: '_onInteraction',
    value: function _onInteraction() {
      // execute interaction hooks from the platform
      var interactionHooks = this._platform.getInteractionHooks();
      interactionHooks.forEach(function (hook) {
        return hook();
      });

      // http://www.html5rocks.com/en/mobile/fullscreen/?redirect_from_locale=fr
      if (this.options.fullScreen && _screenfull2.default.enabled) _screenfull2.default.request();

      if (this.options.wakeLock) this._initWakeLock();

      this.ready();
    }

    // hacks to keep the device awake...
    // cf. https://github.com/borismus/webvr-boilerplate/blob/8abbc74cfa5976b9ab0c388cb0c51944008c6989/js/webvr-manager.js#L268-L289

  }, {
    key: '_initWakeLock',
    value: function _initWakeLock() {
      var _this2 = this;

      this._wakeLockVideo = document.createElement('video');

      this._wakeLockVideo.addEventListener('ended', function () {
        _this2._wakeLockVideo.play();
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
  return Welcome;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, Welcome);

exports.default = Welcome;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIldlbGNvbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7OztBQU1BLFNBQVMsT0FBVCxDQUFpQixNQUFqQixFQUF5QixNQUF6QixFQUFpQztBQUMvQixtQkFBZSxzQkFBaUIsTUFBaEMsQ0FEK0I7Q0FBakM7O0FBSUEsSUFBTSxhQUFhLGlCQUFiOzs7Ozs7Ozs7Ozs7OztJQWFBOzs7QUFDSixXQURJLE9BQ0osR0FBYzt3Q0FEVixTQUNVOzs7Ozs7Ozs7Ozs2RkFEVixvQkFFSSxZQUFZLFFBRE47O0FBVVosUUFBTSxXQUFXO0FBQ2Ysa0JBQVksS0FBWjtBQUNBLGdCQUFVLEtBQVY7QUFDQSxrQkFBWSxJQUFaO0FBQ0EsdUNBSmU7QUFLZixvQkFBYyxFQUFkO0tBTEksQ0FWTTs7QUFrQlosVUFBSyxTQUFMLENBQWUsUUFBZixFQWxCWTs7QUFvQlosVUFBSyxTQUFMLEdBQWlCLE1BQUssT0FBTCxDQUFhLFVBQWIsQ0FBakIsQ0FwQlk7O0dBQWQ7OzZCQURJOzsyQkF3Qkc7QUFDTCxVQUFJLEtBQUssT0FBTCxDQUFhLFVBQWIsRUFBeUI7QUFDM0IsYUFBSyxRQUFMLEdBQWdCLEtBQUssT0FBTCxDQUFhLFFBQWIsQ0FEVztBQUUzQixhQUFLLElBQUwsR0FBWSxLQUFLLFVBQUwsRUFBWixDQUYyQjtPQUE3Qjs7Ozs0QkFNTTtBQUNOLHVEQWhDRSw2Q0FnQ0YsQ0FETTs7QUFHTixVQUFJLENBQUMsS0FBSyxVQUFMLEVBQ0gsS0FBSyxJQUFMLEdBREY7OztBQUhNLFVBT0EsYUFBYSxLQUFLLFNBQUwsQ0FBZSxhQUFmLEVBQWIsQ0FQQTtBQVFOLGlCQUFXLE9BQVgsQ0FBbUIsVUFBQyxJQUFEO2VBQVU7T0FBVixDQUFuQixDQVJNOztBQVVOLFVBQUksQ0FBQyxLQUFLLE9BQUwsQ0FBYSxVQUFiLEVBQ0gsS0FBSyxLQUFMLEdBREYsS0FHRSxLQUFLLElBQUwsR0FIRjs7O0FBVk0sVUFnQkEsUUFBUSxpQkFBTyxRQUFQLENBQWdCLFFBQWhCLEdBQTJCLFVBQTNCLEdBQXdDLE9BQXhDLENBaEJSO0FBaUJOLFdBQUssSUFBTCxDQUFVLGFBQVYsbUNBQTJCLE9BQVEsS0FBSyxjQUFMLENBQW9CLElBQXBCLENBQXlCLElBQXpCLEVBQW5DLEVBakJNOzs7OzJCQW9CRDtBQUNMLFdBQUssSUFBTCxHQURLO0FBRUwsdURBckRFLDRDQXFERixDQUZLOzs7Ozs7Ozs7O3FDQVNVOztBQUVmLFVBQU0sbUJBQW1CLEtBQUssU0FBTCxDQUFlLG1CQUFmLEVBQW5CLENBRlM7QUFHZix1QkFBaUIsT0FBakIsQ0FBeUIsVUFBQyxJQUFEO2VBQVU7T0FBVixDQUF6Qjs7O0FBSGUsVUFNWCxLQUFLLE9BQUwsQ0FBYSxVQUFiLElBQTJCLHFCQUFXLE9BQVgsRUFDN0IscUJBQVcsT0FBWCxHQURGOztBQUdBLFVBQUksS0FBSyxPQUFMLENBQWEsUUFBYixFQUNGLEtBQUssYUFBTCxHQURGOztBQUdBLFdBQUssS0FBTCxHQVplOzs7Ozs7OztvQ0FpQkQ7OztBQUNkLFdBQUssY0FBTCxHQUFzQixTQUFTLGFBQVQsQ0FBdUIsT0FBdkIsQ0FBdEIsQ0FEYzs7QUFHZCxXQUFLLGNBQUwsQ0FBb0IsZ0JBQXBCLENBQXFDLE9BQXJDLEVBQThDLFlBQU07QUFDbEQsZUFBSyxjQUFMLENBQW9CLElBQXBCLEdBRGtEO09BQU4sQ0FBOUMsQ0FIYzs7Ozt1Q0FRRztBQUNqQixVQUFNLEtBQUssaUJBQU8sUUFBUCxDQUFnQixFQUFoQixDQURNO0FBRWpCLFdBQUssaUJBQUwsR0FGaUI7O0FBSWpCLFVBQUksT0FBTyxLQUFQLEVBQWM7QUFDaEIsWUFBSSxLQUFLLGNBQUwsRUFBcUIsT0FBekI7O0FBRUEsYUFBSyxjQUFMLEdBQXNCLFlBQVksWUFBTTtBQUN0QyxpQkFBTyxRQUFQLEdBQWtCLE9BQU8sUUFBUCxDQURvQjtBQUV0QyxxQkFBVyxPQUFPLElBQVAsRUFBYSxDQUF4QixFQUZzQztTQUFOLEVBRy9CLEtBSG1CLENBQXRCLENBSGdCO09BQWxCLE1BT08sSUFBSSxPQUFPLFNBQVAsRUFBa0I7QUFDM0IsWUFBSSxLQUFLLGNBQUwsQ0FBb0IsTUFBcEIsS0FBK0IsS0FBL0IsRUFBc0MsT0FBMUM7O0FBRUEsYUFBSyxjQUFMLENBQW9CLEdBQXBCLEdBQTBCLFFBQVEsWUFBUixFQUFzQixrM0JBQXRCLENBQTFCLENBSDJCO0FBSTNCLGFBQUssY0FBTCxDQUFvQixJQUFwQixHQUoyQjtPQUF0Qjs7Ozt3Q0FRVztBQUNsQixVQUFNLEtBQUssaUJBQU8sUUFBUCxDQUFnQixFQUFoQixDQURPOztBQUdsQixVQUFJLE9BQU8sS0FBUCxFQUFjO0FBQ2hCLFlBQUksS0FBSyxjQUFMLEVBQXFCO0FBQ3ZCLHdCQUFjLEtBQUssY0FBTCxDQUFkLENBRHVCO0FBRXZCLGVBQUssY0FBTCxHQUFzQixJQUF0QixDQUZ1QjtTQUF6QjtPQURGLE1BS08sSUFBSSxPQUFPLFNBQVAsRUFBa0I7QUFDM0IsYUFBSyxjQUFMLENBQW9CLEtBQXBCLEdBRDJCO0FBRTNCLGFBQUssY0FBTCxDQUFvQixHQUFwQixHQUEwQixFQUExQixDQUYyQjtPQUF0Qjs7O1NBaEhMOzs7QUF1SE4seUJBQWUsUUFBZixDQUF3QixVQUF4QixFQUFvQyxPQUFwQzs7a0JBRWUiLCJmaWxlIjoiV2VsY29tZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbGllbnQgZnJvbSAnLi4vY29yZS9jbGllbnQnO1xuaW1wb3J0IHNjcmVlbmZ1bGwgZnJvbSAnc2NyZWVuZnVsbCc7XG5pbXBvcnQgU2VnbWVudGVkVmlldyBmcm9tICcuLi92aWV3cy9TZWdtZW50ZWRWaWV3JztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBfYmFzZTY0KGZvcm1hdCwgYmFzZTY0KSB7XG4gIHJldHVybiBgZGF0YToke2Zvcm1hdH07YmFzZTY0LCR7YmFzZTY0fWA7XG59XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTp3ZWxjb21lJztcblxuLyoqXG4gKiBbY2xpZW50XSBDaGVjayB3aGV0aGVyIHRoZSBkZXZpY2UgaXMgY29tcGF0aWJsZSB3aXRoIHRoZSB0ZWNobm9sb2dpZXMgdXNlZCBpbiB0aGUgKlNvdW5kd29ya3MqIGxpYnJhcnkuXG4gKiBUaGUgc2VydmljZSBzaG91bGQgdXNlZCBhdCB0aGUgdmVyeSBiZWdpbm5pbmcgb2YgYSBzY2VuYXJpbyB0byBhY3RpdmF0ZSB0aGUgV2ViIEF1ZGlvIEFQSSBvbiBpT1MgZGV2aWNlcyAod2l0aCB0aGUgYGFjdGl2YXRlQXVkaW9gIG9wdGlvbikuXG4gKlxuICogVGhlIHNlcnZpY2UgcmVxdWlyZXMgdGhlIHBhcnRpY2lwYW50IHRvIHRhcCB0aGUgc2NyZWVuIGluIG9yZGVyIHRvIGluaXRpYWxpemUgdGhlIHdlYkF1ZGlvIG9uIGlPUyBkZXZpY2VzIGFuZCB0byBtYWtlIHRoZSB2aWV3IGRpc2FwcGVhci5cbiAqXG4gKiBDb21wYXRpYmxlIGRldmljZXMgYXJlIHJ1bm5pbmcgb24gaU9TIDcgb3IgYWJvdmUsIG9yIG9uIEFuZHJvaWQgNC4yIG9yIGFib3ZlIHdpdGggdGhlIENocm9tZSBicm93c2VyIGluIHZlcnNpb24gMzUgb3IgYWJvdmUuXG4gKiBJZiB0aGF0IGlzIG5vdCB0aGUgY2FzZSwgdGhlIHNlcnZpY2UgZGlzcGxheXMgYSBibG9ja2luZyBgdmlld2AgYW5kIHByZXZlbnRzIHRoZSBwYXJ0aWNpcGFudCB0byBnbyBhbnkgZnVydGhlciBpbiB0aGUgc2NlbmFyaW8uXG4gKlxuICogVGhlIHNlcnZpY2UgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uIHdoZW4gdGhlIHVzZXIgdG91Y2hlcyB0aGUgc2NyZWVuIGlmIHRoZSBkZXZpY2UgcGFzc2VzIHRoZSBwbGF0Zm9ybSB0ZXN0LCBhbmQgbmV2ZXIgb3RoZXJ3aXNlLlxuICovXG5jbGFzcyBXZWxjb21lIGV4dGVuZHMgU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIGZhbHNlKTtcblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtPYmplY3R9IFtkZWZhdWx0cz17fV0gLSBPcHRpb25zLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9IFtkZWZhdWx0cy5uYW1lPSd3ZWxjb21lJ10gLSBOYW1lIG9mIHRoZSBzZXJ2aWNlLlxuICAgICAqIEB0eXBlIHtCb29sZWFufSBbZGVmYXVsdHMuYWN0aXZhdGVBdWRpbz10cnVlXSAtIEluZGljYXRlcyB3aGV0aGVyIHRoZSBzZXJ2aWNlIGFjdGl2YXRlcyB0aGUgV2ViIEF1ZGlvIEFQSSB3aGVuIHRoZSBwYXJ0aWNpcGFudCB0b3VjaGVzIHRoZSBzY3JlZW4gKHVzZWZ1bCBvbiBpT1MgZGV2aWNlcykuXG4gICAgICogQHR5cGUge0Jvb2xlYW59IFtkZWZhdWx0cy5yZXF1aXJlTW9iaWxlPXRydWVdIC0gRGVmaW5lcyBpZiB0aGUgYXBwbGljYXRpb24gcmVxdWlyZXMgdGhlIHVzZSBvZiBhIG1vYmlsZSBkZXZpY2UuXG4gICAgICogQHR5cGUge0Jvb2xlYW59IFtkZWZhdWx0cy53YWtlTG9jaz1mYWxzZV0gLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgc2VydmljZSBhY3RpdmF0ZXMgYW4gZXZlci1sb29waW5nIDEtcGl4ZWwgdmlkZW8gdG8gcHJldmVudCB0aGUgZGV2aWNlIGZyb20gZ29pbmcgaWRsZS5cbiAgICAgKi9cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGZ1bGxTY3JlZW46IGZhbHNlLFxuICAgICAgd2FrZUxvY2s6IGZhbHNlLFxuICAgICAgc2hvd0RpYWxvZzogdHJ1ZSxcbiAgICAgIHZpZXdDdG9yOiBTZWdtZW50ZWRWaWV3LFxuICAgICAgdmlld1ByaW9yaXR5OiAxMCxcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgdGhpcy5fcGxhdGZvcm0gPSB0aGlzLnJlcXVpcmUoJ3BsYXRmb3JtJyk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0RpYWxvZykge1xuICAgICAgdGhpcy52aWV3Q3RvciA9IHRoaXMub3B0aW9ucy52aWV3Q3RvcjtcbiAgICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlVmlldygpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAoIXRoaXMuaGFzU3RhcnRlZClcbiAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgLy8gZXhlY3V0ZSBzdGFydCBob29rcyBmcm9tIHRoZSBwbGF0Zm9ybVxuICAgIGNvbnN0IHN0YXJ0SG9va3MgPSB0aGlzLl9wbGF0Zm9ybS5nZXRTdGFydEhvb2tzKCk7XG4gICAgc3RhcnRIb29rcy5mb3JFYWNoKChob29rKSA9PiBob29rKCkpO1xuXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuc2hvd0RpYWxvZylcbiAgICAgIHRoaXMucmVhZHkoKTtcbiAgICBlbHNlXG4gICAgICB0aGlzLnNob3coKTtcblxuICAgIC8vIGluc3RhbGwgZXZlbnRzIGZvciBpbnRlcmFjdGlvbiBob29rXG4gICAgY29uc3QgZXZlbnQgPSBjbGllbnQucGxhdGZvcm0uaXNNb2JpbGUgPyAndG91Y2hlbmQnIDogJ2NsaWNrJztcbiAgICB0aGlzLnZpZXcuaW5zdGFsbEV2ZW50cyh7IFtldmVudF06IHRoaXMuX29uSW50ZXJhY3Rpb24uYmluZCh0aGlzKSB9KTtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5oaWRlKCk7XG4gICAgc3VwZXIuc3RvcCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGUgYGludGVyYWN0aW9uc2AgaG9va3MgZnJvbSB0aGUgYHBsYXRmb3JtYCBzZXJ2aWNlLlxuICAgKiBBbHNvIGFjdGl2YXRlIHRoZSBtZWRpYSBhY2NvcmRpbmcgdG8gdGhlIGBvcHRpb25zYC5cbiAgICovXG4gIF9vbkludGVyYWN0aW9uKCkge1xuICAgIC8vIGV4ZWN1dGUgaW50ZXJhY3Rpb24gaG9va3MgZnJvbSB0aGUgcGxhdGZvcm1cbiAgICBjb25zdCBpbnRlcmFjdGlvbkhvb2tzID0gdGhpcy5fcGxhdGZvcm0uZ2V0SW50ZXJhY3Rpb25Ib29rcygpO1xuICAgIGludGVyYWN0aW9uSG9va3MuZm9yRWFjaCgoaG9vaykgPT4gaG9vaygpKTtcblxuICAgIC8vIGh0dHA6Ly93d3cuaHRtbDVyb2Nrcy5jb20vZW4vbW9iaWxlL2Z1bGxzY3JlZW4vP3JlZGlyZWN0X2Zyb21fbG9jYWxlPWZyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5mdWxsU2NyZWVuICYmIHNjcmVlbmZ1bGwuZW5hYmxlZClcbiAgICAgIHNjcmVlbmZ1bGwucmVxdWVzdCgpO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy53YWtlTG9jaylcbiAgICAgIHRoaXMuX2luaXRXYWtlTG9jaygpO1xuXG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG5cbiAgLy8gaGFja3MgdG8ga2VlcCB0aGUgZGV2aWNlIGF3YWtlLi4uXG4gIC8vIGNmLiBodHRwczovL2dpdGh1Yi5jb20vYm9yaXNtdXMvd2VidnItYm9pbGVycGxhdGUvYmxvYi84YWJiYzc0Y2ZhNTk3NmI5YWIwYzM4OGNiMGM1MTk0NDAwOGM2OTg5L2pzL3dlYnZyLW1hbmFnZXIuanMjTDI2OC1MMjg5XG4gIF9pbml0V2FrZUxvY2soKSB7XG4gICAgdGhpcy5fd2FrZUxvY2tWaWRlbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJyk7XG5cbiAgICB0aGlzLl93YWtlTG9ja1ZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ2VuZGVkJywgKCkgPT4ge1xuICAgICAgdGhpcy5fd2FrZUxvY2tWaWRlby5wbGF5KCk7XG4gICAgfSk7XG4gIH1cblxuICBfcmVxdWVzdFdha2VMb2NrKCkge1xuICAgIGNvbnN0IG9zID0gY2xpZW50LnBsYXRmb3JtLm9zO1xuICAgIHRoaXMuX3JlbGVhc2VXYWtlQ2xvY2soKTtcblxuICAgIGlmIChvcyA9PT0gJ2lvcycpIHtcbiAgICAgIGlmICh0aGlzLl93YWtlTG9ja1RpbWVyKSByZXR1cm47XG5cbiAgICAgIHRoaXMuX3dha2VMb2NrVGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IHdpbmRvdy5sb2NhdGlvbjtcbiAgICAgICAgc2V0VGltZW91dCh3aW5kb3cuc3RvcCwgMCk7XG4gICAgICB9LCAzMDAwMCk7XG4gICAgfSBlbHNlIGlmIChvcyA9PT0gJ2FuZHJvaWQnKSB7XG4gICAgICBpZiAodGhpcy5fd2FrZUxvY2tWaWRlby5wYXVzZWQgPT09IGZhbHNlKSByZXR1cm47XG5cbiAgICAgIHRoaXMuX3dha2VMb2NrVmlkZW8uc3JjID0gX2Jhc2U2NCgndmlkZW8vd2VibScsICdHa1hmb3dFQUFBQUFBQUFmUW9hQkFVTDNnUUZDOG9FRVF2T0JDRUtDaEhkbFltMUNoNEVDUW9XQkFoaFRnR2NCQUFBQUFBQUNXeEZObTNSQUxFMjdpMU9yaEJWSnFXWlRySUhmVGJ1TVU2dUVGbFN1YTFPc2dnRXVUYnVNVTZ1RUhGTzdhMU9zZ2dJKzdBRUFBQUFBQUFDa0FBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQVZTYWxtQVFBQUFBQUFBRU1xMTdHREQwSkFUWUNNVEdGMlpqVTJMalF1TVRBeFYwR01UR0YyWmpVMkxqUXVNVEF4YzZTUTIwWXYvRWx3czczQS8rS2ZFak0xMUVTSmlFQmt3QUFBQUFBQUZsU3Vhd0VBQUFBQUFBQkhyZ0VBQUFBQUFBQSsxNEVCYzhXQkFaeUJBQ0sxbklOMWJtU0doVlpmVmxBNGc0RUJJK09EaEFUM2tOWGdBUUFBQUFBQUFCS3dnUkM2Z1JCVHdJRUJWTENCRUZTNmdSQWZRN1oxQVFBQUFBQUFBTEhuZ1FDZ0FRQUFBQUFBQUZ5aG80RUFBSUFRQWdDZEFTb1FBQkFBQUVjSWhZV0loWVNJQWdJQURBMWdBUDcvcTFDQWRhRUJBQUFBQUFBQUxhWUJBQUFBQUFBQUpPNkJBYVdmRUFJQW5RRXFFQUFRQUFCSENJV0ZpSVdFaUFJQ0FBd05ZQUQrLzdyL1FLQUJBQUFBQUFBQVFLR1ZnUUJUQUxFQkFBRVFFQUFZQUJoWUwvUUFDQUFBZGFFQkFBQUFBQUFBSDZZQkFBQUFBQUFBRnU2QkFhV1JzUUVBQVJBUUFCZ0FHRmd2OUFBSUFBQWNVN3RyQVFBQUFBQUFBQkc3ajdPQkFMZUs5NEVCOFlJQmdmQ0JBdz09Jyk7XG4gICAgICB0aGlzLl93YWtlTG9ja1ZpZGVvLnBsYXkoKTtcbiAgICB9XG4gIH1cblxuICBfcmVsZWFzZVdha2VDbG9jaygpIHtcbiAgICBjb25zdCBvcyA9IGNsaWVudC5wbGF0Zm9ybS5vcztcblxuICAgIGlmIChvcyA9PT0gJ2lvcycpIHtcbiAgICAgIGlmICh0aGlzLl93YWtlTG9ja1RpbWVyKSB7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5fd2FrZUxvY2tUaW1lcik7XG4gICAgICAgIHRoaXMuX3dha2VMb2NrVGltZXIgPSBudWxsO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAob3MgPT09ICdhbmRyb2lkJykge1xuICAgICAgdGhpcy5fd2FrZUxvY2tWaWRlby5wYXVzZSgpO1xuICAgICAgdGhpcy5fd2FrZUxvY2tWaWRlby5zcmMgPSAnJztcbiAgICB9XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgV2VsY29tZSk7XG5cbmV4cG9ydCBkZWZhdWx0IFdlbGNvbWU7XG4iXX0=