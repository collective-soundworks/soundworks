'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _events = require('events');

// const emitter = new EventEmitter();

var Viewport = (function (_EventEmitter) {
  _inherits(Viewport, _EventEmitter);

  function Viewport() {
    _classCallCheck(this, Viewport);

    _get(Object.getPrototypeOf(Viewport.prototype), 'constructor', this).call(this);
    console.log('viewport ctor');

    this._onResize();
    window.addEventListener('resize', this._onResize.bind(this));
  }

  _createClass(Viewport, [{
    key: 'on',
    value: function on(channel, callback) {
      _get(Object.getPrototypeOf(Viewport.prototype), 'on', this).call(this, channel, callback);
      this._onResize();
    }
  }, {
    key: '_onResize',
    value: function _onResize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.orientation = this.width > this.height ? 'landscape' : 'portrait';

      this.emit('resize', this.orientation, this.width, this.height);
    }
  }]);

  return Viewport;
})(_events.EventEmitter);

;

var viewport = new Viewport();
console.log(viewport);
exports['default'] = viewport;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS92aWV3cG9ydC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztzQkFBNkIsUUFBUTs7OztJQUkvQixRQUFRO1lBQVIsUUFBUTs7QUFDRCxXQURQLFFBQVEsR0FDRTswQkFEVixRQUFROztBQUVWLCtCQUZFLFFBQVEsNkNBRUY7QUFDUixXQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDOztBQUU3QixRQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDakIsVUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0dBQzlEOztlQVBHLFFBQVE7O1dBU1YsWUFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQ3BCLGlDQVZFLFFBQVEsb0NBVUQsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUM1QixVQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7S0FDbEI7OztXQUVRLHFCQUFHO0FBQ1YsVUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO0FBQy9CLFVBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQztBQUNqQyxVQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxXQUFXLEdBQUcsVUFBVSxDQUFDOztBQUV2RSxVQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ2hFOzs7U0FwQkcsUUFBUTs7O0FBcUJiLENBQUM7O0FBRUYsSUFBTSxRQUFRLEdBQUcsSUFBSSxRQUFRLEVBQUUsQ0FBQztBQUNoQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO3FCQUNQLFFBQVEiLCJmaWxlIjoic3JjL2NsaWVudC9kaXNwbGF5L3ZpZXdwb3J0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcblxuLy8gY29uc3QgZW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuY2xhc3MgVmlld3BvcnQgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIGNvbnNvbGUubG9nKCd2aWV3cG9ydCBjdG9yJyk7XG5cbiAgICB0aGlzLl9vblJlc2l6ZSgpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9vblJlc2l6ZS5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIG9uKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgc3VwZXIub24oY2hhbm5lbCwgY2FsbGJhY2spO1xuICAgIHRoaXMuX29uUmVzaXplKCk7XG4gIH1cblxuICBfb25SZXNpemUoKSB7XG4gICAgdGhpcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIHRoaXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIHRoaXMub3JpZW50YXRpb24gPSB0aGlzLndpZHRoID4gdGhpcy5oZWlnaHQgPyAnbGFuZHNjYXBlJyA6ICdwb3J0cmFpdCc7XG5cbiAgICB0aGlzLmVtaXQoJ3Jlc2l6ZScsIHRoaXMub3JpZW50YXRpb24sIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgfVxufTtcblxuY29uc3Qgdmlld3BvcnQgPSBuZXcgVmlld3BvcnQoKTtcbmNvbnNvbGUubG9nKHZpZXdwb3J0KTtcbmV4cG9ydCBkZWZhdWx0IHZpZXdwb3J0O1xuIl19