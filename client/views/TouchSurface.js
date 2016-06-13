'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @todo
 * @note - some problems might occur between the way
 * this helper and the viewManager works...
 */

var TouchSurface = function () {
  function TouchSurface($el) {
    var _this = this;

    (0, _classCallCheck3.default)(this, TouchSurface);

    this.$el = $el;
    this.touches = {};

    this._elBoundingRect = null;
    this._listeners = {};

    this._normX = 0;
    this._normY = 0;

    // cache bounding rect values
    window.addEventListener('resize', this._updateBoundingRect.bind(this));
    this._updateBoundingRect();

    // listen events
    this.$el.addEventListener('touchstart', this._handleTouch(function (id, x, y, e) {
      _this.touches[id] = [x, y];
      _this._propagate('touchstart', id, x, y, e);
    }));

    this.$el.addEventListener('touchmove', this._handleTouch(function (id, x, y, e) {
      _this.touches[id] = [x, y];
      _this._propagate('touchmove', id, x, y, e);
    }));

    this.$el.addEventListener('touchend', this._handleTouch(function (id, x, y, e) {
      delete _this.touches[id];
      _this._propagate('touchend', id, x, y, e);
    }));

    this.$el.addEventListener('touchcancel', this._handleTouch(function (id, x, y, e) {
      delete _this.touches[id];
      _this._propagate('touchend', id, x, y, e);
    }));
  }

  (0, _createClass3.default)(TouchSurface, [{
    key: 'destroy',
    value: function destroy() {
      this.$el.removeEventListener('touchstart', this._handleTouch);
      this.$el.removeEventListener('touchmove', this._handleTouch);
      this.$el.removeEventListener('touchend', this._handleTouch);
      this.$el.removeEventListener('touchcancel', this._handleTouch);
    }
  }, {
    key: 'addListener',
    value: function addListener(eventName, callback) {
      if (!this._listeners[eventName]) {
        this._listeners[eventName] = [];
      }

      this._listeners[eventName].push(callback);
    }
  }, {
    key: 'removeListener',
    value: function removeListener(eventName, callback) {
      var listeners = this._listeners[eventName];
      if (!listeners) {
        return;
      }

      var index = listeners.indexOf(callback);

      if (index !== -1) listeners.splice(index, 1);
    }
  }, {
    key: '_updateBoundingRect',
    value: function _updateBoundingRect() {
      this._elBoundingRect = this.$el.getBoundingClientRect();
    }
  }, {
    key: '_handleTouch',
    value: function _handleTouch(callback) {
      var _this2 = this;

      return function (e) {
        // if `_updateBoundingRect` has not been been called or
        // has been called when $el was in `display:none` state
        if (!_this2._elBoundingRect || _this2._elBoundingRect.width === 0 && _this2._elBoundingRect.height === 0) {
          _this2._updateBoundingRect();
        }

        var touches = e.changedTouches;
        var boundingRect = _this2._elBoundingRect;

        for (var i = 0; i < touches.length; i++) {
          var touchEvent = touches[i];
          var touchId = touchEvent.identifier;
          var relX = touchEvent.clientX - boundingRect.left;
          var relY = touchEvent.clientY - boundingRect.top;
          _this2._normX = relX / boundingRect.width;
          _this2._normY = relY / boundingRect.height;

          callback(touchId, _this2._normX, _this2._normY, touchEvent);
        }
      };
    }
  }, {
    key: '_propagate',
    value: function _propagate(eventName, touchId, normX, normY, touchEvent) {
      var listeners = this._listeners[eventName];
      if (!listeners) {
        return;
      }

      listeners.forEach(function (listener) {
        return listener(touchId, normX, normY, touchEvent);
      });
    }
  }]);
  return TouchSurface;
}();

exports.default = TouchSurface;
//# sourceMappingURL=data:application/json;base64,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O0FBQ3ZELFVBQU0sWUFBWSxLQUFLLFVBQUwsQ0FBZ0IsU0FBaEIsQ0FBbEI7QUFDQSxVQUFJLENBQUMsU0FBTCxFQUFnQjtBQUFFO0FBQVM7O0FBRTNCLGdCQUFVLE9BQVYsQ0FBa0IsVUFBQyxRQUFEO0FBQUEsZUFBYyxTQUFTLE9BQVQsRUFBa0IsS0FBbEIsRUFBeUIsS0FBekIsRUFBZ0MsVUFBaEMsQ0FBZDtBQUFBLE9BQWxCO0FBQ0Q7Ozs7O2tCQWhHa0IsWSIsImZpbGUiOiJUb3VjaFN1cmZhY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEB0b2RvXG4gKiBAbm90ZSAtIHNvbWUgcHJvYmxlbXMgbWlnaHQgb2NjdXIgYmV0d2VlbiB0aGUgd2F5XG4gKiB0aGlzIGhlbHBlciBhbmQgdGhlIHZpZXdNYW5hZ2VyIHdvcmtzLi4uXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRvdWNoU3VyZmFjZSB7XG4gIGNvbnN0cnVjdG9yKCRlbCkge1xuICAgIHRoaXMuJGVsID0gJGVsO1xuICAgIHRoaXMudG91Y2hlcyA9IHt9O1xuXG4gICAgdGhpcy5fZWxCb3VuZGluZ1JlY3QgPSBudWxsO1xuICAgIHRoaXMuX2xpc3RlbmVycyA9IHt9O1xuXG4gICAgdGhpcy5fbm9ybVggPSAwO1xuICAgIHRoaXMuX25vcm1ZID0gMDtcblxuICAgIC8vIGNhY2hlIGJvdW5kaW5nIHJlY3QgdmFsdWVzXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3VwZGF0ZUJvdW5kaW5nUmVjdC5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl91cGRhdGVCb3VuZGluZ1JlY3QoKTtcblxuICAgIC8vIGxpc3RlbiBldmVudHNcbiAgICB0aGlzLiRlbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5faGFuZGxlVG91Y2goKGlkLCB4LCB5LCBlKSA9PiB7XG4gICAgICB0aGlzLnRvdWNoZXNbaWRdID0gW3gsIHldO1xuICAgICAgdGhpcy5fcHJvcGFnYXRlKCd0b3VjaHN0YXJ0JywgaWQsIHgsIHksIGUpO1xuICAgIH0pKTtcblxuICAgIHRoaXMuJGVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMuX2hhbmRsZVRvdWNoKChpZCwgeCwgeSwgZSkgPT4ge1xuICAgICAgdGhpcy50b3VjaGVzW2lkXSA9IFt4LCB5XTtcbiAgICAgIHRoaXMuX3Byb3BhZ2F0ZSgndG91Y2htb3ZlJywgaWQsIHgsIHksIGUpO1xuICAgIH0pKTtcblxuICAgIHRoaXMuJGVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5faGFuZGxlVG91Y2goKGlkLCB4LCB5LCBlKSA9PiB7XG4gICAgICBkZWxldGUgdGhpcy50b3VjaGVzW2lkXTtcbiAgICAgIHRoaXMuX3Byb3BhZ2F0ZSgndG91Y2hlbmQnLCBpZCwgeCwgeSwgZSk7XG4gICAgfSkpO1xuXG4gICAgdGhpcy4kZWwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCB0aGlzLl9oYW5kbGVUb3VjaCgoaWQsIHgsIHksIGUpID0+IHtcbiAgICAgIGRlbGV0ZSB0aGlzLnRvdWNoZXNbaWRdO1xuICAgICAgdGhpcy5fcHJvcGFnYXRlKCd0b3VjaGVuZCcsIGlkLCB4LCB5LCBlKTtcbiAgICB9KSk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuJGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9oYW5kbGVUb3VjaCk7XG4gICAgdGhpcy4kZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5faGFuZGxlVG91Y2gpO1xuICAgIHRoaXMuJGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5faGFuZGxlVG91Y2gpO1xuICAgIHRoaXMuJGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgdGhpcy5faGFuZGxlVG91Y2gpO1xuICB9XG5cbiAgYWRkTGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjaykge1xuICAgIGlmICghdGhpcy5fbGlzdGVuZXJzW2V2ZW50TmFtZV0pIHtcbiAgICAgIHRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdID0gW107XG4gICAgfVxuXG4gICAgdGhpcy5fbGlzdGVuZXJzW2V2ZW50TmFtZV0ucHVzaChjYWxsYmFjayk7XG4gIH1cblxuICByZW1vdmVMaXN0ZW5lcihldmVudE5hbWUsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzW2V2ZW50TmFtZV07XG4gICAgaWYgKCFsaXN0ZW5lcnMpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBpbmRleCA9IGxpc3RlbmVycy5pbmRleE9mKGNhbGxiYWNrKTtcblxuICAgIGlmIChpbmRleCAhPT0gLTEpXG4gICAgICBsaXN0ZW5lcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgfVxuXG4gIF91cGRhdGVCb3VuZGluZ1JlY3QoKSB7XG4gICAgdGhpcy5fZWxCb3VuZGluZ1JlY3QgPSB0aGlzLiRlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgfVxuXG4gIF9oYW5kbGVUb3VjaChjYWxsYmFjaykge1xuICAgIHJldHVybiAoZSkgPT4ge1xuICAgICAgLy8gaWYgYF91cGRhdGVCb3VuZGluZ1JlY3RgIGhhcyBub3QgYmVlbiBiZWVuIGNhbGxlZCBvclxuICAgICAgLy8gaGFzIGJlZW4gY2FsbGVkIHdoZW4gJGVsIHdhcyBpbiBgZGlzcGxheTpub25lYCBzdGF0ZVxuICAgICAgaWYgKCF0aGlzLl9lbEJvdW5kaW5nUmVjdCB8fMKgXG4gICAgICAgICAgKHRoaXMuX2VsQm91bmRpbmdSZWN0LndpZHRoID09PSAwICYmIHRoaXMuX2VsQm91bmRpbmdSZWN0LmhlaWdodCA9PT0gMCkpIHtcbiAgICAgICAgdGhpcy5fdXBkYXRlQm91bmRpbmdSZWN0KCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRvdWNoZXMgPSBlLmNoYW5nZWRUb3VjaGVzO1xuICAgICAgY29uc3QgYm91bmRpbmdSZWN0ID0gdGhpcy5fZWxCb3VuZGluZ1JlY3Q7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCB0b3VjaEV2ZW50ID0gdG91Y2hlc1tpXTtcbiAgICAgICAgY29uc3QgdG91Y2hJZCA9IHRvdWNoRXZlbnQuaWRlbnRpZmllcjtcbiAgICAgICAgY29uc3QgcmVsWCA9IHRvdWNoRXZlbnQuY2xpZW50WCAtIGJvdW5kaW5nUmVjdC5sZWZ0O1xuICAgICAgICBjb25zdCByZWxZID0gdG91Y2hFdmVudC5jbGllbnRZIC0gYm91bmRpbmdSZWN0LnRvcDtcbiAgICAgICAgdGhpcy5fbm9ybVggPSByZWxYIC8gYm91bmRpbmdSZWN0LndpZHRoO1xuICAgICAgICB0aGlzLl9ub3JtWSA9IHJlbFkgLyBib3VuZGluZ1JlY3QuaGVpZ2h0O1xuXG4gICAgICAgIGNhbGxiYWNrKHRvdWNoSWQsIHRoaXMuX25vcm1YLCB0aGlzLl9ub3JtWSwgdG91Y2hFdmVudCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX3Byb3BhZ2F0ZShldmVudE5hbWUsIHRvdWNoSWQsIG5vcm1YLCBub3JtWSwgdG91Y2hFdmVudCkge1xuICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdO1xuICAgIGlmICghbGlzdGVuZXJzKSB7IHJldHVybjsgfVxuXG4gICAgbGlzdGVuZXJzLmZvckVhY2goKGxpc3RlbmVyKSA9PiBsaXN0ZW5lcih0b3VjaElkLCBub3JtWCwgbm9ybVksIHRvdWNoRXZlbnQpKTtcbiAgfVxufVxuIl19