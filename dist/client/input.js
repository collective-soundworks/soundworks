'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var EventEmitter = require('events').EventEmitter;
var audioContext = require('waves-audio').audioContext;

// TODO: add deviceMotion and deviceOrientation input.

var InputModule = (function (_EventEmitter) {
  _inherits(InputModule, _EventEmitter);

  // export default class InputModule extends EventEmitter {
  function InputModule() {
    _classCallCheck(this, InputModule);

    _get(Object.getPrototypeOf(InputModule.prototype), 'constructor', this).call(this);

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

  _createClass(InputModule, [{
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
      motionData.timestamp = audioContext.currentTime;
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
      orientationData.timestamp = audioContext.currentTime;
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
        touchData.timestamp = audioContext.currentTime;
        touchData.identifier = e.changedTouches[i].identifier;
        touchData.event = type;
        touchData.coordinates[0] = e.changedTouches[i].clientX;
        touchData.coordinates[1] = e.changedTouches[i].clientY;

        this.emit(type, touchData);
      }
    }
  }]);

  return InputModule;
})(EventEmitter);

module.exports = new InputModule();
//# sourceMappingURL=data:application/json;base64,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QyxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDaEQsWUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQzs7QUFFbEIsWUFBSSxJQUFJLEtBQUssYUFBYSxFQUN4QixJQUFJLEdBQUcsVUFBVSxDQUFDOztBQUVwQixZQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO0FBQy9CLGlCQUFTLENBQUMsU0FBUyxHQUFHLFlBQVksQ0FBQyxXQUFXLENBQUM7QUFDL0MsaUJBQVMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7QUFDdEQsaUJBQVMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ3ZCLGlCQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO0FBQ3ZELGlCQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDOztBQUV2RCxZQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztPQUM1QjtLQUNGOzs7U0FySEcsV0FBVztHQUFTLFlBQVk7O0FBd0h0QyxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUMiLCJmaWxlIjoic3JjL2NsaWVudC9pbnB1dC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcbnZhciBhdWRpb0NvbnRleHQgPSByZXF1aXJlKCd3YXZlcy1hdWRpbycpLmF1ZGlvQ29udGV4dDtcblxuLy8gVE9ETzogYWRkIGRldmljZU1vdGlvbiBhbmQgZGV2aWNlT3JpZW50YXRpb24gaW5wdXQuXG5jbGFzcyBJbnB1dE1vZHVsZSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4vLyBleHBvcnQgZGVmYXVsdCBjbGFzcyBJbnB1dE1vZHVsZSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLm1vdGlvbkRhdGEgPSB7XG4gICAgICB0aW1lc3RhbXA6IDAsXG4gICAgICBhY2NlbGVyYXRpb246IDAsXG4gICAgICBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5OiAwLFxuICAgICAgcm90YXRpb25SYXRlOiAwLFxuICAgIH07XG5cbiAgICB0aGlzLnRvdWNoRGF0YSA9IHtcbiAgICAgIHRpbWVzdGFtcDogMCxcbiAgICAgIGlkZW50aWZpZXI6IDAsXG4gICAgICBldmVudDogJycsXG4gICAgICBjb29yZGluYXRlczogWzAsIDBdXG4gICAgfTtcblxuICAgIHRoaXMub3JpZW50YXRpb25EYXRhID0ge1xuICAgICAgYWxwaGE6IDAsXG4gICAgICBiZXRhOiAwLFxuICAgICAgZ2FtbWE6IDAsXG4gICAgICB0aW1lc3RhbXA6IDBcbiAgICB9O1xuXG4gICAgdGhpcy5oYW5kbGVEZXZpY2VPcmllbnRhdGlvbkV2ZW50ID0gdGhpcy5oYW5kbGVEZXZpY2VPcmllbnRhdGlvbkV2ZW50LmJpbmQodGhpcyk7IC8vIHNpbmNlIC5iaW5kKCkgY3JlYXRlcyBhIG5ldyBmdW5jdGlvbiwgd2UgY2FuJ3QgdXNlIGl0IGRpcmVjdGx5IGluIHRoZSBhZGQvcmVtb3ZlRXZlbnRMaXN0ZW5lci5cbiAgICB0aGlzLmhhbmRsZURldmljZU1vdGlvbkV2ZW50ID0gdGhpcy5oYW5kbGVEZXZpY2VNb3Rpb25FdmVudC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlVG91Y2hFdmVudCA9IHRoaXMuaGFuZGxlVG91Y2hFdmVudC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqICBEZXZpY2VNb3Rpb25cbiAgICpcbiAgICoqL1xuXG4gIGVuYWJsZURldmljZU1vdGlvbigpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZGV2aWNlbW90aW9uJywgdGhpcy5oYW5kbGVEZXZpY2VNb3Rpb25FdmVudCwgZmFsc2UpO1xuICB9XG5cbiAgZGlzYWJsZURldmljZU1vdGlvbigpIHtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignZGV2aWNlbW90aW9uJywgdGhpcy5oYW5kbGVEZXZpY2VNb3Rpb25FdmVudCwgZmFsc2UpO1xuICB9XG5cbiAgaGFuZGxlRGV2aWNlTW90aW9uRXZlbnQoZSkge1xuICAgIHZhciBtb3Rpb25EYXRhID0gdGhpcy5tb3Rpb25EYXRhO1xuICAgIG1vdGlvbkRhdGEudGltZXN0YW1wID0gYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lO1xuICAgIG1vdGlvbkRhdGEuYWNjZWxlcmF0aW9uID0gZS5hY2NlbGVyYXRpb247XG4gICAgbW90aW9uRGF0YS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5ID0gZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5O1xuICAgIG1vdGlvbkRhdGEucm90YXRpb25SYXRlID0gZS5yb3RhdGlvblJhdGU7XG5cbiAgICB0aGlzLmVtaXQoJ2RldmljZW1vdGlvbicsIG1vdGlvbkRhdGEpO1xuICB9XG5cbiAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqXG4gICAqICBEZXZpY2VPcmllbnRhdGlvblxuICAgKlxuICAgKiovXG5cbiAgZW5hYmxlRGV2aWNlT3JpZW50YXRpb24oKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZW9yaWVudGF0aW9uJywgdGhpcy5oYW5kbGVEZXZpY2VPcmllbnRhdGlvbkV2ZW50LCBmYWxzZSk7XG4gIH1cblxuICBkaXNhYmxlRGV2aWNlT3JpZW50YXRpb24oKSB7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RldmljZW9yaWVudGF0aW9uJywgdGhpcy5oYW5kbGVEZXZpY2VPcmllbnRhdGlvbkV2ZW50LCBmYWxzZSk7XG4gIH1cblxuICBoYW5kbGVEZXZpY2VPcmllbnRhdGlvbkV2ZW50KGUpIHtcbiAgICB2YXIgb3JpZW50YXRpb25EYXRhID0gdGhpcy5vcmllbnRhdGlvbkRhdGE7XG4gICAgb3JpZW50YXRpb25EYXRhLnRpbWVzdGFtcCA9IGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcbiAgICBvcmllbnRhdGlvbkRhdGEuYWxwaGEgPSBlLmFscGhhO1xuICAgIG9yaWVudGF0aW9uRGF0YS5iZXRhID0gZS5iZXRhO1xuICAgIG9yaWVudGF0aW9uRGF0YS5nYW1tYSA9IGUuZ2FtbWE7XG5cbiAgICB0aGlzLmVtaXQoJ2RldmljZW9yaWVudGF0aW9uJywgb3JpZW50YXRpb25EYXRhKTtcbiAgfVxuXG4gIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKlxuICAgKiAgKE11bHRpKVRvdWNoXG4gICAqXG4gICAqKi9cblxuICBlbmFibGVUb3VjaChzdXJmYWNlKSB7XG4gICAgc3VyZmFjZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIHRoaXMuaGFuZGxlVG91Y2hFdmVudCwgZmFsc2UpO1xuICAgIHN1cmZhY2UuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLmhhbmRsZVRvdWNoRXZlbnQsIGZhbHNlKTtcbiAgICBzdXJmYWNlLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMuaGFuZGxlVG91Y2hFdmVudCwgZmFsc2UpO1xuICAgIHN1cmZhY2UuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuaGFuZGxlVG91Y2hFdmVudCwgZmFsc2UpO1xuICB9XG5cbiAgZGlzYWJsZVRvdWNoKHN1cmZhY2UpIHtcbiAgICBzdXJmYWNlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgdGhpcy5oYW5kbGVUb3VjaEV2ZW50LCBmYWxzZSk7XG4gICAgc3VyZmFjZS5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMuaGFuZGxlVG91Y2hFdmVudCwgZmFsc2UpO1xuICAgIHN1cmZhY2UucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5oYW5kbGVUb3VjaEV2ZW50LCBmYWxzZSk7XG4gICAgc3VyZmFjZS5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5oYW5kbGVUb3VjaEV2ZW50LCBmYWxzZSk7XG4gIH1cblxuICBoYW5kbGVUb3VjaEV2ZW50KGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7IC8vIFRvIHByZXZlbnQgc2Nyb2xsaW5nLlxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlLmNoYW5nZWRUb3VjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdHlwZSA9IGUudHlwZTtcblxuICAgICAgaWYgKHR5cGUgPT09ICd0b3VjaGNhbmNlbCcpXG4gICAgICAgIHR5cGUgPSAndG91Y2hlbmQnO1xuXG4gICAgICB2YXIgdG91Y2hEYXRhID0gdGhpcy50b3VjaERhdGE7XG4gICAgICB0b3VjaERhdGEudGltZXN0YW1wID0gYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lO1xuICAgICAgdG91Y2hEYXRhLmlkZW50aWZpZXIgPSBlLmNoYW5nZWRUb3VjaGVzW2ldLmlkZW50aWZpZXI7XG4gICAgICB0b3VjaERhdGEuZXZlbnQgPSB0eXBlO1xuICAgICAgdG91Y2hEYXRhLmNvb3JkaW5hdGVzWzBdID0gZS5jaGFuZ2VkVG91Y2hlc1tpXS5jbGllbnRYO1xuICAgICAgdG91Y2hEYXRhLmNvb3JkaW5hdGVzWzFdID0gZS5jaGFuZ2VkVG91Y2hlc1tpXS5jbGllbnRZO1xuXG4gICAgICB0aGlzLmVtaXQodHlwZSwgdG91Y2hEYXRhKTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgSW5wdXRNb2R1bGUoKTtcbiJdfQ==