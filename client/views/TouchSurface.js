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
        return listener(touchId, normX, normY, touchEvent);
      });
    }
  }]);
  return TouchSurface;
}();

exports.default = TouchSurface;
//# sourceMappingURL=data:application/json;base64,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Z0JBQVUsT0FBVixDQUFrQixVQUFDLFFBQUQ7QUFBQSxlQUFjLFNBQVMsT0FBVCxFQUFrQixLQUFsQixFQUF5QixLQUF6QixFQUFnQyxVQUFoQyxDQUFkO0FBQUEsT0FBbEI7QUFDRDs7Ozs7a0JBN0ZrQixZIiwiZmlsZSI6IlRvdWNoU3VyZmFjZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQHRvZG9cbiAqIEBub3RlIC0gc29tZSBwcm9ibGVtcyBtaWdodCBvY2N1ciBiZXR3ZWVuIHRoZSB3YXlcbiAqIHRoaXMgaGVscGVyIGFuZCB0aGUgdmlld01hbmFnZXIgd29ya3MuLi5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVG91Y2hTdXJmYWNlIHtcbiAgY29uc3RydWN0b3IoJGVsKSB7XG4gICAgdGhpcy4kZWwgPSAkZWw7XG4gICAgdGhpcy50b3VjaGVzID0ge307XG5cbiAgICB0aGlzLl9lbEJvdW5kaW5nUmVjdCA9IG51bGw7XG4gICAgdGhpcy5fbGlzdGVuZXJzID0ge307XG5cbiAgICB0aGlzLl9ub3JtWCA9IDA7XG4gICAgdGhpcy5fbm9ybVkgPSAwO1xuXG4gICAgLy8gY2FjaGUgYm91bmRpbmcgcmVjdCB2YWx1ZXNcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fdXBkYXRlQm91bmRpbmdSZWN0LmJpbmQodGhpcykpO1xuXG4gICAgLy8gbGlzdGVuIGV2ZW50c1xuICAgIHRoaXMuJGVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9oYW5kbGVUb3VjaCgoaWQsIHgsIHksIGUpID0+IHtcbiAgICAgIHRoaXMudG91Y2hlc1tpZF0gPSBbeCwgeV07XG4gICAgICB0aGlzLl9wcm9wYWdhdGUoJ3RvdWNoc3RhcnQnLCBpZCwgeCwgeSwgZSk7XG4gICAgfSkpO1xuXG4gICAgdGhpcy4kZWwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5faGFuZGxlVG91Y2goKGlkLCB4LCB5LCBlKSA9PiB7XG4gICAgICB0aGlzLnRvdWNoZXNbaWRdID0gW3gsIHldO1xuICAgICAgdGhpcy5fcHJvcGFnYXRlKCd0b3VjaG1vdmUnLCBpZCwgeCwgeSwgZSk7XG4gICAgfSkpO1xuXG4gICAgdGhpcy4kZWwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLl9oYW5kbGVUb3VjaCgoaWQsIHgsIHksIGUpID0+IHtcbiAgICAgIGRlbGV0ZSB0aGlzLnRvdWNoZXNbaWRdO1xuICAgICAgdGhpcy5fcHJvcGFnYXRlKCd0b3VjaGVuZCcsIGlkLCB4LCB5LCBlKTtcbiAgICB9KSk7XG5cbiAgICB0aGlzLiRlbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIHRoaXMuX2hhbmRsZVRvdWNoKChpZCwgeCwgeSwgZSkgPT4ge1xuICAgICAgZGVsZXRlIHRoaXMudG91Y2hlc1tpZF07XG4gICAgICB0aGlzLl9wcm9wYWdhdGUoJ3RvdWNoZW5kJywgaWQsIHgsIHksIGUpO1xuICAgIH0pKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy4kZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuX2hhbmRsZVRvdWNoKTtcbiAgICB0aGlzLiRlbC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLl9oYW5kbGVUb3VjaCk7XG4gICAgdGhpcy4kZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLl9oYW5kbGVUb3VjaCk7XG4gICAgdGhpcy4kZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCB0aGlzLl9oYW5kbGVUb3VjaCk7XG4gIH1cblxuICBhZGRMaXN0ZW5lcihldmVudE5hbWUsIGNhbGxiYWNrKSB7XG4gICAgaWYgKCF0aGlzLl9saXN0ZW5lcnNbZXZlbnROYW1lXSkge1xuICAgICAgdGhpcy5fbGlzdGVuZXJzW2V2ZW50TmFtZV0gPSBbXTtcbiAgICB9XG5cbiAgICB0aGlzLl9saXN0ZW5lcnNbZXZlbnROYW1lXS5wdXNoKGNhbGxiYWNrKTtcbiAgfVxuXG4gIHJlbW92ZUxpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnNbZXZlbnROYW1lXTtcbiAgICBpZiAoIWxpc3RlbmVycykgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IGluZGV4ID0gbGlzdGVuZXJzLmluZGV4T2YoY2FsbGJhY2spO1xuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICBsaXN0ZW5lcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG4gIH1cblxuICBfdXBkYXRlQm91bmRpbmdSZWN0KCkge1xuICAgIHRoaXMuX2VsQm91bmRpbmdSZWN0ID0gdGhpcy4kZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIH1cblxuICBfaGFuZGxlVG91Y2goY2FsbGJhY2spIHtcbiAgICByZXR1cm4gKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgaWYgKCF0aGlzLl9lbEJvdW5kaW5nUmVjdClcbiAgICAgICAgdGhpcy5fdXBkYXRlQm91bmRpbmdSZWN0KCk7XG5cbiAgICAgIGNvbnN0IHRvdWNoZXMgPSBlLmNoYW5nZWRUb3VjaGVzO1xuICAgICAgY29uc3QgYm91bmRpbmdSZWN0ID0gdGhpcy5fZWxCb3VuZGluZ1JlY3Q7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCB0b3VjaEV2ZW50ID0gdG91Y2hlc1tpXTtcbiAgICAgICAgY29uc3QgdG91Y2hJZCA9IHRvdWNoRXZlbnQuaWRlbnRpZmllcjtcbiAgICAgICAgY29uc3QgcmVsWCA9IHRvdWNoRXZlbnQuY2xpZW50WCAtIGJvdW5kaW5nUmVjdC5sZWZ0O1xuICAgICAgICBjb25zdCByZWxZID0gdG91Y2hFdmVudC5jbGllbnRZIC0gYm91bmRpbmdSZWN0LnRvcDtcbiAgICAgICAgdGhpcy5fbm9ybVggPSByZWxYIC8gYm91bmRpbmdSZWN0LndpZHRoO1xuICAgICAgICB0aGlzLl9ub3JtWSA9IHJlbFkgLyBib3VuZGluZ1JlY3QuaGVpZ2h0O1xuXG4gICAgICAgIGNhbGxiYWNrKHRvdWNoSWQsIHRoaXMuX25vcm1YLCB0aGlzLl9ub3JtWSwgdG91Y2hFdmVudCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX3Byb3BhZ2F0ZShldmVudE5hbWUsIHRvdWNoSWQsIG5vcm1YLCBub3JtWSwgdG91Y2hFdmVudCkge1xuICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdO1xuICAgIGlmICghbGlzdGVuZXJzKSB7IHJldHVybjsgfVxuXG4gICAgbGlzdGVuZXJzLmZvckVhY2goKGxpc3RlbmVyKSA9PiBsaXN0ZW5lcih0b3VjaElkLCBub3JtWCwgbm9ybVksIHRvdWNoRXZlbnQpKTtcbiAgfVxufVxuIl19