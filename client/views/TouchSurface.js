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
      if (index >= 0) {
        listeners.splice(index, 1);
      }
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
        e.preventDefault();

        if (!_this2._elBoundingRect) _this2._updateBoundingRect();

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
        listener(touchId, normX, normY, touchEvent);
      });
    }
  }]);
  return TouchSurface;
}();

exports.default = TouchSurface;
//# sourceMappingURL=data:application/json;base64,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QVF2QyxtQkFBUyxPQUFULEVBQWtCLE9BQUssTUFBTCxFQUFhLE9BQUssTUFBTCxFQUFhLFVBQTVDLEVBUnVDO1NBQXpDO09BVEssQ0FEYzs7OzsrQkF1QlosV0FBVyxTQUFTLE9BQU8sT0FBTyxZQUFZO0FBQ3ZELFVBQU0sWUFBWSxLQUFLLFVBQUwsQ0FBZ0IsU0FBaEIsQ0FBWixDQURpRDtBQUV2RCxVQUFJLENBQUMsU0FBRCxFQUFZO0FBQUUsZUFBRjtPQUFoQjs7QUFFQSxnQkFBVSxPQUFWLENBQWtCLFVBQUMsUUFBRCxFQUFjO0FBQzlCLGlCQUFTLE9BQVQsRUFBa0IsS0FBbEIsRUFBeUIsS0FBekIsRUFBZ0MsVUFBaEMsRUFEOEI7T0FBZCxDQUFsQixDQUp1RDs7O1NBeEZ0QyIsImZpbGUiOiJUb3VjaFN1cmZhY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEB0b2RvXG4gKiBAbm90ZSAtIHNvbWUgcHJvYmxlbXMgbWlnaHQgb2NjdXIgYmV0d2VlbiB0aGUgd2F5XG4gKiB0aGlzIGhlbHBlciBhbmQgdGhlIHZpZXdNYW5hZ2VyIHdvcmtzLi4uXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRvdWNoU3VyZmFjZSB7XG4gIGNvbnN0cnVjdG9yKCRlbCkge1xuICAgIHRoaXMuJGVsID0gJGVsO1xuICAgIHRoaXMudG91Y2hlcyA9IHt9O1xuXG4gICAgdGhpcy5fZWxCb3VuZGluZ1JlY3QgPSBudWxsO1xuICAgIHRoaXMuX2xpc3RlbmVycyA9IHt9O1xuXG4gICAgdGhpcy5fbm9ybVggPSAwO1xuICAgIHRoaXMuX25vcm1ZID0gMDtcblxuICAgIC8vIGNhY2hlIGJvdW5kaW5nIHJlY3QgdmFsdWVzXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3VwZGF0ZUJvdW5kaW5nUmVjdC5iaW5kKHRoaXMpKTtcblxuICAgIC8vIGxpc3RlbiBldmVudHNcbiAgICB0aGlzLiRlbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5faGFuZGxlVG91Y2goKGlkLCB4LCB5LCBlKSA9PiB7XG4gICAgICB0aGlzLnRvdWNoZXNbaWRdID0gW3gsIHldO1xuICAgICAgdGhpcy5fcHJvcGFnYXRlKCd0b3VjaHN0YXJ0JywgaWQsIHgsIHksIGUpO1xuICAgIH0pKTtcblxuICAgIHRoaXMuJGVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMuX2hhbmRsZVRvdWNoKChpZCwgeCwgeSwgZSkgPT4ge1xuICAgICAgdGhpcy50b3VjaGVzW2lkXSA9IFt4LCB5XTtcbiAgICAgIHRoaXMuX3Byb3BhZ2F0ZSgndG91Y2htb3ZlJywgaWQsIHgsIHksIGUpO1xuICAgIH0pKTtcblxuICAgIHRoaXMuJGVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5faGFuZGxlVG91Y2goKGlkLCB4LCB5LCBlKSA9PiB7XG4gICAgICBkZWxldGUgdGhpcy50b3VjaGVzW2lkXTtcbiAgICAgIHRoaXMuX3Byb3BhZ2F0ZSgndG91Y2hlbmQnLCBpZCwgeCwgeSwgZSk7XG4gICAgfSkpO1xuXG4gICAgdGhpcy4kZWwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCB0aGlzLl9oYW5kbGVUb3VjaCgoaWQsIHgsIHksIGUpID0+IHtcbiAgICAgIGRlbGV0ZSB0aGlzLnRvdWNoZXNbaWRdO1xuICAgICAgdGhpcy5fcHJvcGFnYXRlKCd0b3VjaGVuZCcsIGlkLCB4LCB5LCBlKTtcbiAgICB9KSk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuJGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9oYW5kbGVUb3VjaCk7XG4gICAgdGhpcy4kZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5faGFuZGxlVG91Y2gpO1xuICAgIHRoaXMuJGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5faGFuZGxlVG91Y2gpO1xuICAgIHRoaXMuJGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgdGhpcy5faGFuZGxlVG91Y2gpO1xuICB9XG5cbiAgYWRkTGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjaykge1xuICAgIGlmICghdGhpcy5fbGlzdGVuZXJzW2V2ZW50TmFtZV0pIHtcbiAgICAgIHRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdID0gW107XG4gICAgfVxuXG4gICAgdGhpcy5fbGlzdGVuZXJzW2V2ZW50TmFtZV0ucHVzaChjYWxsYmFjayk7XG4gIH1cblxuICByZW1vdmVMaXN0ZW5lcihldmVudE5hbWUsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzW2V2ZW50TmFtZV07XG4gICAgaWYgKCFsaXN0ZW5lcnMpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBpbmRleCA9IGxpc3RlbmVycy5pbmRleE9mKGNhbGxiYWNrKTtcbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgbGlzdGVuZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuICB9XG5cbiAgX3VwZGF0ZUJvdW5kaW5nUmVjdCgpIHtcbiAgICB0aGlzLl9lbEJvdW5kaW5nUmVjdCA9IHRoaXMuJGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICB9XG5cbiAgX2hhbmRsZVRvdWNoKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIGlmICghdGhpcy5fZWxCb3VuZGluZ1JlY3QpXG4gICAgICAgIHRoaXMuX3VwZGF0ZUJvdW5kaW5nUmVjdCgpO1xuXG4gICAgICBjb25zdCB0b3VjaGVzID0gZS5jaGFuZ2VkVG91Y2hlcztcbiAgICAgIGNvbnN0IGJvdW5kaW5nUmVjdCA9IHRoaXMuX2VsQm91bmRpbmdSZWN0O1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvdWNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgdG91Y2hFdmVudCA9IHRvdWNoZXNbaV07XG4gICAgICAgIGNvbnN0IHRvdWNoSWQgPSB0b3VjaEV2ZW50LmlkZW50aWZpZXI7XG4gICAgICAgIGNvbnN0IHJlbFggPSB0b3VjaEV2ZW50LmNsaWVudFggLSBib3VuZGluZ1JlY3QubGVmdDtcbiAgICAgICAgY29uc3QgcmVsWSA9IHRvdWNoRXZlbnQuY2xpZW50WSAtIGJvdW5kaW5nUmVjdC50b3A7XG4gICAgICAgIHRoaXMuX25vcm1YID0gcmVsWCAvIGJvdW5kaW5nUmVjdC53aWR0aDtcbiAgICAgICAgdGhpcy5fbm9ybVkgPSByZWxZIC8gYm91bmRpbmdSZWN0LmhlaWdodDtcblxuICAgICAgICBjYWxsYmFjayh0b3VjaElkLCB0aGlzLl9ub3JtWCwgdGhpcy5fbm9ybVksIHRvdWNoRXZlbnQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9wcm9wYWdhdGUoZXZlbnROYW1lLCB0b3VjaElkLCBub3JtWCwgbm9ybVksIHRvdWNoRXZlbnQpIHtcbiAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnNbZXZlbnROYW1lXTtcbiAgICBpZiAoIWxpc3RlbmVycykgeyByZXR1cm47IH1cblxuICAgIGxpc3RlbmVycy5mb3JFYWNoKChsaXN0ZW5lcikgPT4ge1xuICAgICAgbGlzdGVuZXIodG91Y2hJZCwgbm9ybVgsIG5vcm1ZLCB0b3VjaEV2ZW50KTtcbiAgICB9KTtcbiAgfVxufVxuIl19