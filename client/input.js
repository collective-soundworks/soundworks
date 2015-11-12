'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _events = require('events');

var _wavesAudio = require('waves-audio');

// TODO: add deviceMotion and deviceOrientation input.

var Input = (function (_EventEmitter) {
  _inherits(Input, _EventEmitter);

  function Input() {
    _classCallCheck(this, Input);

    _get(Object.getPrototypeOf(Input.prototype), 'constructor', this).call(this);

    this.motionData = {
      timestamp: 0,
      acceleration: 0,
      accelerationIncludingGravity: 0,
      rotationRate: 0
    };

    this.touchData = {
      timestamp: 0,
      identifier: 0,
      event: '',
      coordinates: [0, 0]
    };

    this.orientationData = {
      alpha: 0,
      beta: 0,
      gamma: 0,
      timestamp: 0
    };

    this.handleDeviceOrientationEvent = this.handleDeviceOrientationEvent.bind(this); // since .bind() creates a new function, we can't use it directly in the add/removeEventListener.
    this.handleDeviceMotionEvent = this.handleDeviceMotionEvent.bind(this);
    this.handleTouchEvent = this.handleTouchEvent.bind(this);
  }

  /********************************
   *
   *  DeviceMotion
   *
   **/

  _createClass(Input, [{
    key: 'enableDeviceMotion',
    value: function enableDeviceMotion() {
      window.addEventListener('devicemotion', this.handleDeviceMotionEvent, false);
    }
  }, {
    key: 'disableDeviceMotion',
    value: function disableDeviceMotion() {
      window.removeEventListener('devicemotion', this.handleDeviceMotionEvent, false);
    }
  }, {
    key: 'handleDeviceMotionEvent',
    value: function handleDeviceMotionEvent(e) {
      var motionData = this.motionData;
      motionData.timestamp = _wavesAudio.audioContext.currentTime;
      motionData.acceleration = e.acceleration;
      motionData.accelerationIncludingGravity = e.accelerationIncludingGravity;
      motionData.rotationRate = e.rotationRate;

      this.emit('devicemotion', motionData);
    }

    /********************************
     *
     *  DeviceOrientation
     *
     **/

  }, {
    key: 'enableDeviceOrientation',
    value: function enableDeviceOrientation() {
      window.addEventListener('deviceorientation', this.handleDeviceOrientationEvent, false);
    }
  }, {
    key: 'disableDeviceOrientation',
    value: function disableDeviceOrientation() {
      window.removeEventListener('deviceorientation', this.handleDeviceOrientationEvent, false);
    }
  }, {
    key: 'handleDeviceOrientationEvent',
    value: function handleDeviceOrientationEvent(e) {
      var orientationData = this.orientationData;
      orientationData.timestamp = _wavesAudio.audioContext.currentTime;
      orientationData.alpha = e.alpha;
      orientationData.beta = e.beta;
      orientationData.gamma = e.gamma;

      this.emit('deviceorientation', orientationData);
    }

    /********************************
     *
     *  (Multi)Touch
     *
     **/

  }, {
    key: 'enableTouch',
    value: function enableTouch(surface) {
      surface.addEventListener('touchcancel', this.handleTouchEvent, false);
      surface.addEventListener('touchend', this.handleTouchEvent, false);
      surface.addEventListener('touchmove', this.handleTouchEvent, false);
      surface.addEventListener('touchstart', this.handleTouchEvent, false);
    }
  }, {
    key: 'disableTouch',
    value: function disableTouch(surface) {
      surface.removeEventListener('touchcancel', this.handleTouchEvent, false);
      surface.removeEventListener('touchend', this.handleTouchEvent, false);
      surface.removeEventListener('touchmove', this.handleTouchEvent, false);
      surface.removeEventListener('touchstart', this.handleTouchEvent, false);
    }
  }, {
    key: 'handleTouchEvent',
    value: function handleTouchEvent(e) {
      e.preventDefault(); // To prevent scrolling.

      for (var i = 0; i < e.changedTouches.length; i++) {
        var type = e.type;

        if (type === 'touchcancel') type = 'touchend';

        var touchData = this.touchData;
        touchData.timestamp = _wavesAudio.audioContext.currentTime;
        touchData.identifier = e.changedTouches[i].identifier;
        touchData.event = type;
        touchData.coordinates[0] = e.changedTouches[i].clientX;
        touchData.coordinates[1] = e.changedTouches[i].clientY;

        this.emit(type, touchData);
      }
    }
  }]);

  return Input;
})(_events.EventEmitter);

var instance = new Input();
exports['default'] = instance;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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QUFhLEVBQ3hCLElBQUksR0FBRyxVQUFVLENBQUM7O0FBRXBCLFlBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7QUFDL0IsaUJBQVMsQ0FBQyxTQUFTLEdBQUcseUJBQWEsV0FBVyxDQUFDO0FBQy9DLGlCQUFTLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO0FBQ3RELGlCQUFTLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUN2QixpQkFBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUN2RCxpQkFBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQzs7QUFFdkQsWUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7T0FDNUI7S0FDRjs7O1NBcEhHLEtBQUs7OztBQXVIWCxJQUFNLFFBQVEsR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO3FCQUNkLFFBQVEiLCJmaWxlIjoic3JjL2NsaWVudC9pbnB1dC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgeyBhdWRpb0NvbnRleHQgfSBmcm9tICd3YXZlcy1hdWRpbyc7XG5cbi8vIFRPRE86IGFkZCBkZXZpY2VNb3Rpb24gYW5kIGRldmljZU9yaWVudGF0aW9uIGlucHV0LlxuY2xhc3MgSW5wdXQgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5tb3Rpb25EYXRhID0ge1xuICAgICAgdGltZXN0YW1wOiAwLFxuICAgICAgYWNjZWxlcmF0aW9uOiAwLFxuICAgICAgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eTogMCxcbiAgICAgIHJvdGF0aW9uUmF0ZTogMCxcbiAgICB9O1xuXG4gICAgdGhpcy50b3VjaERhdGEgPSB7XG4gICAgICB0aW1lc3RhbXA6IDAsXG4gICAgICBpZGVudGlmaWVyOiAwLFxuICAgICAgZXZlbnQ6ICcnLFxuICAgICAgY29vcmRpbmF0ZXM6IFswLCAwXVxuICAgIH07XG5cbiAgICB0aGlzLm9yaWVudGF0aW9uRGF0YSA9IHtcbiAgICAgIGFscGhhOiAwLFxuICAgICAgYmV0YTogMCxcbiAgICAgIGdhbW1hOiAwLFxuICAgICAgdGltZXN0YW1wOiAwXG4gICAgfTtcblxuICAgIHRoaXMuaGFuZGxlRGV2aWNlT3JpZW50YXRpb25FdmVudCA9IHRoaXMuaGFuZGxlRGV2aWNlT3JpZW50YXRpb25FdmVudC5iaW5kKHRoaXMpOyAvLyBzaW5jZSAuYmluZCgpIGNyZWF0ZXMgYSBuZXcgZnVuY3Rpb24sIHdlIGNhbid0IHVzZSBpdCBkaXJlY3RseSBpbiB0aGUgYWRkL3JlbW92ZUV2ZW50TGlzdGVuZXIuXG4gICAgdGhpcy5oYW5kbGVEZXZpY2VNb3Rpb25FdmVudCA9IHRoaXMuaGFuZGxlRGV2aWNlTW90aW9uRXZlbnQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZVRvdWNoRXZlbnQgPSB0aGlzLmhhbmRsZVRvdWNoRXZlbnQuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiAgRGV2aWNlTW90aW9uXG4gICAqXG4gICAqKi9cblxuICBlbmFibGVEZXZpY2VNb3Rpb24oKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZW1vdGlvbicsIHRoaXMuaGFuZGxlRGV2aWNlTW90aW9uRXZlbnQsIGZhbHNlKTtcbiAgfVxuXG4gIGRpc2FibGVEZXZpY2VNb3Rpb24oKSB7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RldmljZW1vdGlvbicsIHRoaXMuaGFuZGxlRGV2aWNlTW90aW9uRXZlbnQsIGZhbHNlKTtcbiAgfVxuXG4gIGhhbmRsZURldmljZU1vdGlvbkV2ZW50KGUpIHtcbiAgICB2YXIgbW90aW9uRGF0YSA9IHRoaXMubW90aW9uRGF0YTtcbiAgICBtb3Rpb25EYXRhLnRpbWVzdGFtcCA9IGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcbiAgICBtb3Rpb25EYXRhLmFjY2VsZXJhdGlvbiA9IGUuYWNjZWxlcmF0aW9uO1xuICAgIG1vdGlvbkRhdGEuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSA9IGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eTtcbiAgICBtb3Rpb25EYXRhLnJvdGF0aW9uUmF0ZSA9IGUucm90YXRpb25SYXRlO1xuXG4gICAgdGhpcy5lbWl0KCdkZXZpY2Vtb3Rpb24nLCBtb3Rpb25EYXRhKTtcbiAgfVxuXG4gIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiAgRGV2aWNlT3JpZW50YXRpb25cbiAgICpcbiAgICoqL1xuXG4gIGVuYWJsZURldmljZU9yaWVudGF0aW9uKCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2VvcmllbnRhdGlvbicsIHRoaXMuaGFuZGxlRGV2aWNlT3JpZW50YXRpb25FdmVudCwgZmFsc2UpO1xuICB9XG5cbiAgZGlzYWJsZURldmljZU9yaWVudGF0aW9uKCkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdkZXZpY2VvcmllbnRhdGlvbicsIHRoaXMuaGFuZGxlRGV2aWNlT3JpZW50YXRpb25FdmVudCwgZmFsc2UpO1xuICB9XG5cbiAgaGFuZGxlRGV2aWNlT3JpZW50YXRpb25FdmVudChlKSB7XG4gICAgdmFyIG9yaWVudGF0aW9uRGF0YSA9IHRoaXMub3JpZW50YXRpb25EYXRhO1xuICAgIG9yaWVudGF0aW9uRGF0YS50aW1lc3RhbXAgPSBhdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG4gICAgb3JpZW50YXRpb25EYXRhLmFscGhhID0gZS5hbHBoYTtcbiAgICBvcmllbnRhdGlvbkRhdGEuYmV0YSA9IGUuYmV0YTtcbiAgICBvcmllbnRhdGlvbkRhdGEuZ2FtbWEgPSBlLmdhbW1hO1xuXG4gICAgdGhpcy5lbWl0KCdkZXZpY2VvcmllbnRhdGlvbicsIG9yaWVudGF0aW9uRGF0YSk7XG4gIH1cblxuICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICogIChNdWx0aSlUb3VjaFxuICAgKlxuICAgKiovXG5cbiAgZW5hYmxlVG91Y2goc3VyZmFjZSkge1xuICAgIHN1cmZhY2UuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCB0aGlzLmhhbmRsZVRvdWNoRXZlbnQsIGZhbHNlKTtcbiAgICBzdXJmYWNlLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5oYW5kbGVUb3VjaEV2ZW50LCBmYWxzZSk7XG4gICAgc3VyZmFjZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLmhhbmRsZVRvdWNoRXZlbnQsIGZhbHNlKTtcbiAgICBzdXJmYWNlLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLmhhbmRsZVRvdWNoRXZlbnQsIGZhbHNlKTtcbiAgfVxuXG4gIGRpc2FibGVUb3VjaChzdXJmYWNlKSB7XG4gICAgc3VyZmFjZS5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIHRoaXMuaGFuZGxlVG91Y2hFdmVudCwgZmFsc2UpO1xuICAgIHN1cmZhY2UucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLmhhbmRsZVRvdWNoRXZlbnQsIGZhbHNlKTtcbiAgICBzdXJmYWNlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMuaGFuZGxlVG91Y2hFdmVudCwgZmFsc2UpO1xuICAgIHN1cmZhY2UucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuaGFuZGxlVG91Y2hFdmVudCwgZmFsc2UpO1xuICB9XG5cbiAgaGFuZGxlVG91Y2hFdmVudChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpOyAvLyBUbyBwcmV2ZW50IHNjcm9sbGluZy5cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZS5jaGFuZ2VkVG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHR5cGUgPSBlLnR5cGU7XG5cbiAgICAgIGlmICh0eXBlID09PSAndG91Y2hjYW5jZWwnKVxuICAgICAgICB0eXBlID0gJ3RvdWNoZW5kJztcblxuICAgICAgdmFyIHRvdWNoRGF0YSA9IHRoaXMudG91Y2hEYXRhO1xuICAgICAgdG91Y2hEYXRhLnRpbWVzdGFtcCA9IGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcbiAgICAgIHRvdWNoRGF0YS5pZGVudGlmaWVyID0gZS5jaGFuZ2VkVG91Y2hlc1tpXS5pZGVudGlmaWVyO1xuICAgICAgdG91Y2hEYXRhLmV2ZW50ID0gdHlwZTtcbiAgICAgIHRvdWNoRGF0YS5jb29yZGluYXRlc1swXSA9IGUuY2hhbmdlZFRvdWNoZXNbaV0uY2xpZW50WDtcbiAgICAgIHRvdWNoRGF0YS5jb29yZGluYXRlc1sxXSA9IGUuY2hhbmdlZFRvdWNoZXNbaV0uY2xpZW50WTtcblxuICAgICAgdGhpcy5lbWl0KHR5cGUsIHRvdWNoRGF0YSk7XG4gICAgfVxuICB9XG59XG5cbmNvbnN0IGluc3RhbmNlID0gbmV3IElucHV0KCk7XG5leHBvcnQgZGVmYXVsdCBpbnN0YW5jZTtcbiJdfQ==