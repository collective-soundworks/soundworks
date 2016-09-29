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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRvdWNoU3VyZmFjZS5qcyJdLCJuYW1lcyI6WyJUb3VjaFN1cmZhY2UiLCIkZWwiLCJ0b3VjaGVzIiwiX2VsQm91bmRpbmdSZWN0IiwiX2xpc3RlbmVycyIsIl9ub3JtWCIsIl9ub3JtWSIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJfdXBkYXRlQm91bmRpbmdSZWN0IiwiYmluZCIsIl9oYW5kbGVUb3VjaCIsImlkIiwieCIsInkiLCJlIiwiX3Byb3BhZ2F0ZSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJldmVudE5hbWUiLCJjYWxsYmFjayIsInB1c2giLCJsaXN0ZW5lcnMiLCJpbmRleCIsImluZGV4T2YiLCJzcGxpY2UiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJ3aWR0aCIsImhlaWdodCIsImNoYW5nZWRUb3VjaGVzIiwiYm91bmRpbmdSZWN0IiwiaSIsImxlbmd0aCIsInRvdWNoRXZlbnQiLCJ0b3VjaElkIiwiaWRlbnRpZmllciIsInJlbFgiLCJjbGllbnRYIiwibGVmdCIsInJlbFkiLCJjbGllbnRZIiwidG9wIiwibm9ybVgiLCJub3JtWSIsImZvckVhY2giLCJsaXN0ZW5lciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7OztJQUtxQkEsWTtBQUNuQix3QkFBWUMsR0FBWixFQUFpQjtBQUFBOztBQUFBOztBQUNmLFNBQUtBLEdBQUwsR0FBV0EsR0FBWDtBQUNBLFNBQUtDLE9BQUwsR0FBZSxFQUFmOztBQUVBLFNBQUtDLGVBQUwsR0FBdUIsSUFBdkI7QUFDQSxTQUFLQyxVQUFMLEdBQWtCLEVBQWxCOztBQUVBLFNBQUtDLE1BQUwsR0FBYyxDQUFkO0FBQ0EsU0FBS0MsTUFBTCxHQUFjLENBQWQ7O0FBRUE7QUFDQUMsV0FBT0MsZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsS0FBS0MsbUJBQUwsQ0FBeUJDLElBQXpCLENBQThCLElBQTlCLENBQWxDO0FBQ0EsU0FBS0QsbUJBQUw7O0FBRUE7QUFDQSxTQUFLUixHQUFM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a0JoQyxZIiwiZmlsZSI6IlRvdWNoU3VyZmFjZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQHRvZG9cbiAqIEBub3RlIC0gc29tZSBwcm9ibGVtcyBtaWdodCBvY2N1ciBiZXR3ZWVuIHRoZSB3YXlcbiAqIHRoaXMgaGVscGVyIGFuZCB0aGUgdmlld01hbmFnZXIgd29ya3MuLi5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVG91Y2hTdXJmYWNlIHtcbiAgY29uc3RydWN0b3IoJGVsKSB7XG4gICAgdGhpcy4kZWwgPSAkZWw7XG4gICAgdGhpcy50b3VjaGVzID0ge307XG5cbiAgICB0aGlzLl9lbEJvdW5kaW5nUmVjdCA9IG51bGw7XG4gICAgdGhpcy5fbGlzdGVuZXJzID0ge307XG5cbiAgICB0aGlzLl9ub3JtWCA9IDA7XG4gICAgdGhpcy5fbm9ybVkgPSAwO1xuXG4gICAgLy8gY2FjaGUgYm91bmRpbmcgcmVjdCB2YWx1ZXNcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fdXBkYXRlQm91bmRpbmdSZWN0LmJpbmQodGhpcykpO1xuICAgIHRoaXMuX3VwZGF0ZUJvdW5kaW5nUmVjdCgpO1xuXG4gICAgLy8gbGlzdGVuIGV2ZW50c1xuICAgIHRoaXMuJGVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9oYW5kbGVUb3VjaCgoaWQsIHgsIHksIGUpID0+IHtcbiAgICAgIHRoaXMudG91Y2hlc1tpZF0gPSBbeCwgeV07XG4gICAgICB0aGlzLl9wcm9wYWdhdGUoJ3RvdWNoc3RhcnQnLCBpZCwgeCwgeSwgZSk7XG4gICAgfSkpO1xuXG4gICAgdGhpcy4kZWwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5faGFuZGxlVG91Y2goKGlkLCB4LCB5LCBlKSA9PiB7XG4gICAgICB0aGlzLnRvdWNoZXNbaWRdID0gW3gsIHldO1xuICAgICAgdGhpcy5fcHJvcGFnYXRlKCd0b3VjaG1vdmUnLCBpZCwgeCwgeSwgZSk7XG4gICAgfSkpO1xuXG4gICAgdGhpcy4kZWwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLl9oYW5kbGVUb3VjaCgoaWQsIHgsIHksIGUpID0+IHtcbiAgICAgIGRlbGV0ZSB0aGlzLnRvdWNoZXNbaWRdO1xuICAgICAgdGhpcy5fcHJvcGFnYXRlKCd0b3VjaGVuZCcsIGlkLCB4LCB5LCBlKTtcbiAgICB9KSk7XG5cbiAgICB0aGlzLiRlbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIHRoaXMuX2hhbmRsZVRvdWNoKChpZCwgeCwgeSwgZSkgPT4ge1xuICAgICAgZGVsZXRlIHRoaXMudG91Y2hlc1tpZF07XG4gICAgICB0aGlzLl9wcm9wYWdhdGUoJ3RvdWNoZW5kJywgaWQsIHgsIHksIGUpO1xuICAgIH0pKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy4kZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuX2hhbmRsZVRvdWNoKTtcbiAgICB0aGlzLiRlbC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLl9oYW5kbGVUb3VjaCk7XG4gICAgdGhpcy4kZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLl9oYW5kbGVUb3VjaCk7XG4gICAgdGhpcy4kZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCB0aGlzLl9oYW5kbGVUb3VjaCk7XG4gIH1cblxuICBhZGRMaXN0ZW5lcihldmVudE5hbWUsIGNhbGxiYWNrKSB7XG4gICAgaWYgKCF0aGlzLl9saXN0ZW5lcnNbZXZlbnROYW1lXSkge1xuICAgICAgdGhpcy5fbGlzdGVuZXJzW2V2ZW50TmFtZV0gPSBbXTtcbiAgICB9XG5cbiAgICB0aGlzLl9saXN0ZW5lcnNbZXZlbnROYW1lXS5wdXNoKGNhbGxiYWNrKTtcbiAgfVxuXG4gIHJlbW92ZUxpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnNbZXZlbnROYW1lXTtcbiAgICBpZiAoIWxpc3RlbmVycykgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IGluZGV4ID0gbGlzdGVuZXJzLmluZGV4T2YoY2FsbGJhY2spO1xuXG4gICAgaWYgKGluZGV4ICE9PSAtMSlcbiAgICAgIGxpc3RlbmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICB9XG5cbiAgX3VwZGF0ZUJvdW5kaW5nUmVjdCgpIHtcbiAgICB0aGlzLl9lbEJvdW5kaW5nUmVjdCA9IHRoaXMuJGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICB9XG5cbiAgX2hhbmRsZVRvdWNoKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIChlKSA9PiB7XG4gICAgICAvLyBpZiBgX3VwZGF0ZUJvdW5kaW5nUmVjdGAgaGFzIG5vdCBiZWVuIGJlZW4gY2FsbGVkIG9yXG4gICAgICAvLyBoYXMgYmVlbiBjYWxsZWQgd2hlbiAkZWwgd2FzIGluIGBkaXNwbGF5Om5vbmVgIHN0YXRlXG4gICAgICBpZiAoIXRoaXMuX2VsQm91bmRpbmdSZWN0IHx8wqBcbiAgICAgICAgICAodGhpcy5fZWxCb3VuZGluZ1JlY3Qud2lkdGggPT09IDAgJiYgdGhpcy5fZWxCb3VuZGluZ1JlY3QuaGVpZ2h0ID09PSAwKSkge1xuICAgICAgICB0aGlzLl91cGRhdGVCb3VuZGluZ1JlY3QoKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdG91Y2hlcyA9IGUuY2hhbmdlZFRvdWNoZXM7XG4gICAgICBjb25zdCBib3VuZGluZ1JlY3QgPSB0aGlzLl9lbEJvdW5kaW5nUmVjdDtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b3VjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHRvdWNoRXZlbnQgPSB0b3VjaGVzW2ldO1xuICAgICAgICBjb25zdCB0b3VjaElkID0gdG91Y2hFdmVudC5pZGVudGlmaWVyO1xuICAgICAgICBjb25zdCByZWxYID0gdG91Y2hFdmVudC5jbGllbnRYIC0gYm91bmRpbmdSZWN0LmxlZnQ7XG4gICAgICAgIGNvbnN0IHJlbFkgPSB0b3VjaEV2ZW50LmNsaWVudFkgLSBib3VuZGluZ1JlY3QudG9wO1xuICAgICAgICB0aGlzLl9ub3JtWCA9IHJlbFggLyBib3VuZGluZ1JlY3Qud2lkdGg7XG4gICAgICAgIHRoaXMuX25vcm1ZID0gcmVsWSAvIGJvdW5kaW5nUmVjdC5oZWlnaHQ7XG5cbiAgICAgICAgY2FsbGJhY2sodG91Y2hJZCwgdGhpcy5fbm9ybVgsIHRoaXMuX25vcm1ZLCB0b3VjaEV2ZW50KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfcHJvcGFnYXRlKGV2ZW50TmFtZSwgdG91Y2hJZCwgbm9ybVgsIG5vcm1ZLCB0b3VjaEV2ZW50KSB7XG4gICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzW2V2ZW50TmFtZV07XG4gICAgaWYgKCFsaXN0ZW5lcnMpIHsgcmV0dXJuOyB9XG5cbiAgICBsaXN0ZW5lcnMuZm9yRWFjaCgobGlzdGVuZXIpID0+IGxpc3RlbmVyKHRvdWNoSWQsIG5vcm1YLCBub3JtWSwgdG91Y2hFdmVudCkpO1xuICB9XG59XG4iXX0=