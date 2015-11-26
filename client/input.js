'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _events = require('events');

var _wavesAudio = require('waves-audio');

// TODO: add deviceMotion and deviceOrientation input.
/**
 * @private
 */

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

module.exports = new Input();
//# sourceMappingURL=data:application/json;base64,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QWEsRUFDeEIsSUFBSSxHQUFHLFVBQVUsQ0FBQzs7QUFFcEIsWUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztBQUMvQixpQkFBUyxDQUFDLFNBQVMsR0FBRyx5QkFBYSxXQUFXLENBQUM7QUFDL0MsaUJBQVMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7QUFDdEQsaUJBQVMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ3ZCLGlCQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO0FBQ3ZELGlCQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDOztBQUV2RCxZQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztPQUM1QjtLQUNGOzs7U0FwSEcsS0FBSzs7O0FBdUhYLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQyIsImZpbGUiOiJzcmMvY2xpZW50L2lucHV0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcbmltcG9ydCB7IGF1ZGlvQ29udGV4dCB9IGZyb20gJ3dhdmVzLWF1ZGlvJztcblxuLy8gVE9ETzogYWRkIGRldmljZU1vdGlvbiBhbmQgZGV2aWNlT3JpZW50YXRpb24gaW5wdXQuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmNsYXNzIElucHV0IGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMubW90aW9uRGF0YSA9IHtcbiAgICAgIHRpbWVzdGFtcDogMCxcbiAgICAgIGFjY2VsZXJhdGlvbjogMCxcbiAgICAgIGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHk6IDAsXG4gICAgICByb3RhdGlvblJhdGU6IDAsXG4gICAgfTtcblxuICAgIHRoaXMudG91Y2hEYXRhID0ge1xuICAgICAgdGltZXN0YW1wOiAwLFxuICAgICAgaWRlbnRpZmllcjogMCxcbiAgICAgIGV2ZW50OiAnJyxcbiAgICAgIGNvb3JkaW5hdGVzOiBbMCwgMF1cbiAgICB9O1xuXG4gICAgdGhpcy5vcmllbnRhdGlvbkRhdGEgPSB7XG4gICAgICBhbHBoYTogMCxcbiAgICAgIGJldGE6IDAsXG4gICAgICBnYW1tYTogMCxcbiAgICAgIHRpbWVzdGFtcDogMFxuICAgIH07XG5cbiAgICB0aGlzLmhhbmRsZURldmljZU9yaWVudGF0aW9uRXZlbnQgPSB0aGlzLmhhbmRsZURldmljZU9yaWVudGF0aW9uRXZlbnQuYmluZCh0aGlzKTsgLy8gc2luY2UgLmJpbmQoKSBjcmVhdGVzIGEgbmV3IGZ1bmN0aW9uLCB3ZSBjYW4ndCB1c2UgaXQgZGlyZWN0bHkgaW4gdGhlIGFkZC9yZW1vdmVFdmVudExpc3RlbmVyLlxuICAgIHRoaXMuaGFuZGxlRGV2aWNlTW90aW9uRXZlbnQgPSB0aGlzLmhhbmRsZURldmljZU1vdGlvbkV2ZW50LmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVUb3VjaEV2ZW50ID0gdGhpcy5oYW5kbGVUb3VjaEV2ZW50LmJpbmQodGhpcyk7XG4gIH1cblxuICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICogIERldmljZU1vdGlvblxuICAgKlxuICAgKiovXG5cbiAgZW5hYmxlRGV2aWNlTW90aW9uKCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2Vtb3Rpb24nLCB0aGlzLmhhbmRsZURldmljZU1vdGlvbkV2ZW50LCBmYWxzZSk7XG4gIH1cblxuICBkaXNhYmxlRGV2aWNlTW90aW9uKCkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdkZXZpY2Vtb3Rpb24nLCB0aGlzLmhhbmRsZURldmljZU1vdGlvbkV2ZW50LCBmYWxzZSk7XG4gIH1cblxuICBoYW5kbGVEZXZpY2VNb3Rpb25FdmVudChlKSB7XG4gICAgdmFyIG1vdGlvbkRhdGEgPSB0aGlzLm1vdGlvbkRhdGE7XG4gICAgbW90aW9uRGF0YS50aW1lc3RhbXAgPSBhdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG4gICAgbW90aW9uRGF0YS5hY2NlbGVyYXRpb24gPSBlLmFjY2VsZXJhdGlvbjtcbiAgICBtb3Rpb25EYXRhLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgPSBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHk7XG4gICAgbW90aW9uRGF0YS5yb3RhdGlvblJhdGUgPSBlLnJvdGF0aW9uUmF0ZTtcblxuICAgIHRoaXMuZW1pdCgnZGV2aWNlbW90aW9uJywgbW90aW9uRGF0YSk7XG4gIH1cblxuICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICpcbiAgICogIERldmljZU9yaWVudGF0aW9uXG4gICAqXG4gICAqKi9cblxuICBlbmFibGVEZXZpY2VPcmllbnRhdGlvbigpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZGV2aWNlb3JpZW50YXRpb24nLCB0aGlzLmhhbmRsZURldmljZU9yaWVudGF0aW9uRXZlbnQsIGZhbHNlKTtcbiAgfVxuXG4gIGRpc2FibGVEZXZpY2VPcmllbnRhdGlvbigpIHtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignZGV2aWNlb3JpZW50YXRpb24nLCB0aGlzLmhhbmRsZURldmljZU9yaWVudGF0aW9uRXZlbnQsIGZhbHNlKTtcbiAgfVxuXG4gIGhhbmRsZURldmljZU9yaWVudGF0aW9uRXZlbnQoZSkge1xuICAgIHZhciBvcmllbnRhdGlvbkRhdGEgPSB0aGlzLm9yaWVudGF0aW9uRGF0YTtcbiAgICBvcmllbnRhdGlvbkRhdGEudGltZXN0YW1wID0gYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lO1xuICAgIG9yaWVudGF0aW9uRGF0YS5hbHBoYSA9IGUuYWxwaGE7XG4gICAgb3JpZW50YXRpb25EYXRhLmJldGEgPSBlLmJldGE7XG4gICAgb3JpZW50YXRpb25EYXRhLmdhbW1hID0gZS5nYW1tYTtcblxuICAgIHRoaXMuZW1pdCgnZGV2aWNlb3JpZW50YXRpb24nLCBvcmllbnRhdGlvbkRhdGEpO1xuICB9XG5cbiAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqICAoTXVsdGkpVG91Y2hcbiAgICpcbiAgICoqL1xuXG4gIGVuYWJsZVRvdWNoKHN1cmZhY2UpIHtcbiAgICBzdXJmYWNlLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgdGhpcy5oYW5kbGVUb3VjaEV2ZW50LCBmYWxzZSk7XG4gICAgc3VyZmFjZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMuaGFuZGxlVG91Y2hFdmVudCwgZmFsc2UpO1xuICAgIHN1cmZhY2UuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5oYW5kbGVUb3VjaEV2ZW50LCBmYWxzZSk7XG4gICAgc3VyZmFjZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5oYW5kbGVUb3VjaEV2ZW50LCBmYWxzZSk7XG4gIH1cblxuICBkaXNhYmxlVG91Y2goc3VyZmFjZSkge1xuICAgIHN1cmZhY2UucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCB0aGlzLmhhbmRsZVRvdWNoRXZlbnQsIGZhbHNlKTtcbiAgICBzdXJmYWNlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5oYW5kbGVUb3VjaEV2ZW50LCBmYWxzZSk7XG4gICAgc3VyZmFjZS5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLmhhbmRsZVRvdWNoRXZlbnQsIGZhbHNlKTtcbiAgICBzdXJmYWNlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLmhhbmRsZVRvdWNoRXZlbnQsIGZhbHNlKTtcbiAgfVxuXG4gIGhhbmRsZVRvdWNoRXZlbnQoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTsgLy8gVG8gcHJldmVudCBzY3JvbGxpbmcuXG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGUuY2hhbmdlZFRvdWNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB0eXBlID0gZS50eXBlO1xuXG4gICAgICBpZiAodHlwZSA9PT0gJ3RvdWNoY2FuY2VsJylcbiAgICAgICAgdHlwZSA9ICd0b3VjaGVuZCc7XG5cbiAgICAgIHZhciB0b3VjaERhdGEgPSB0aGlzLnRvdWNoRGF0YTtcbiAgICAgIHRvdWNoRGF0YS50aW1lc3RhbXAgPSBhdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG4gICAgICB0b3VjaERhdGEuaWRlbnRpZmllciA9IGUuY2hhbmdlZFRvdWNoZXNbaV0uaWRlbnRpZmllcjtcbiAgICAgIHRvdWNoRGF0YS5ldmVudCA9IHR5cGU7XG4gICAgICB0b3VjaERhdGEuY29vcmRpbmF0ZXNbMF0gPSBlLmNoYW5nZWRUb3VjaGVzW2ldLmNsaWVudFg7XG4gICAgICB0b3VjaERhdGEuY29vcmRpbmF0ZXNbMV0gPSBlLmNoYW5nZWRUb3VjaGVzW2ldLmNsaWVudFk7XG5cbiAgICAgIHRoaXMuZW1pdCh0eXBlLCB0b3VjaERhdGEpO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBJbnB1dCgpO1xuIl19