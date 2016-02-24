/**
 * @todo
 * @note - some problems might occur between the way
 * this helper and the viewManager works...
 */
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var TouchSurface = (function () {
  function TouchSurface($el) {
    var _this = this;

    _classCallCheck(this, TouchSurface);

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

  _createClass(TouchSurface, [{
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
})();

exports['default'] = TouchSurface;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L2Rpc3BsYXkvVG91Y2hTdXJmYWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztJQUtxQixZQUFZO0FBQ3BCLFdBRFEsWUFBWSxDQUNuQixHQUFHLEVBQUU7OzswQkFERSxZQUFZOztBQUU3QixRQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUNmLFFBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDOztBQUVsQixRQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztBQUM1QixRQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQzs7QUFFckIsUUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDaEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7OztBQUdoQixVQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7O0FBR3ZFLFFBQUksQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUs7QUFDekUsWUFBSyxPQUFPLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDMUIsWUFBSyxVQUFVLENBQUMsWUFBWSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQzVDLENBQUMsQ0FBQyxDQUFDOztBQUVKLFFBQUksQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBQyxFQUFFLEVBQUUsQ0FBQyxFQUFF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Q0FBQzs7QUFFMUMsYUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDdkMsY0FBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzlCLGNBQU0sT0FBTyxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUM7QUFDdEMsY0FBTSxJQUFJLEdBQUcsVUFBVSxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDO0FBQ3BELGNBQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQztBQUNuRCxpQkFBSyxNQUFNLEdBQUcsSUFBSSxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUM7QUFDeEMsaUJBQUssTUFBTSxHQUFHLElBQUksR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDOztBQUV6QyxrQkFBUSxDQUFDLE9BQU8sRUFBRSxPQUFLLE1BQU0sRUFBRSxPQUFLLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQztTQUN6RDtPQUNGLENBQUE7S0FDRjs7O1dBRVMsb0JBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRTtBQUN2RCxVQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzdDLFVBQUksQ0FBQyxTQUFTLEVBQUU7QUFBRSxlQUFPO09BQUU7O0FBRTNCLGVBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQyxRQUFRLEVBQUs7QUFDOUIsZ0JBQVEsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztPQUM3QyxDQUFDLENBQUM7S0FDSjs7O1NBL0ZrQixZQUFZOzs7cUJBQVosWUFBWSIsImZpbGUiOiIvVXNlcnMvc2NobmVsbC9EZXZlbG9wbWVudC93ZWIvY29sbGVjdGl2ZS1zb3VuZHdvcmtzL3NvdW5kd29ya3Mvc3JjL2NsaWVudC9kaXNwbGF5L1RvdWNoU3VyZmFjZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQHRvZG9cbiAqIEBub3RlIC0gc29tZSBwcm9ibGVtcyBtaWdodCBvY2N1ciBiZXR3ZWVuIHRoZSB3YXlcbiAqIHRoaXMgaGVscGVyIGFuZCB0aGUgdmlld01hbmFnZXIgd29ya3MuLi5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVG91Y2hTdXJmYWNlIHtcbiAgY29uc3RydWN0b3IoJGVsKSB7XG4gICAgdGhpcy4kZWwgPSAkZWw7XG4gICAgdGhpcy50b3VjaGVzID0ge307XG5cbiAgICB0aGlzLl9lbEJvdW5kaW5nUmVjdCA9IG51bGw7XG4gICAgdGhpcy5fbGlzdGVuZXJzID0ge307XG5cbiAgICB0aGlzLl9ub3JtWCA9IDA7XG4gICAgdGhpcy5fbm9ybVkgPSAwO1xuXG4gICAgLy8gY2FjaGUgYm91bmRpbmcgcmVjdCB2YWx1ZXNcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fdXBkYXRlQm91bmRpbmdSZWN0LmJpbmQodGhpcykpO1xuXG4gICAgLy8gbGlzdGVuIGV2ZW50c1xuICAgIHRoaXMuJGVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9oYW5kbGVUb3VjaCgoaWQsIHgsIHksIGUpID0+IHtcbiAgICAgIHRoaXMudG91Y2hlc1tpZF0gPSBbeCwgeV07XG4gICAgICB0aGlzLl9wcm9wYWdhdGUoJ3RvdWNoc3RhcnQnLCBpZCwgeCwgeSwgZSk7XG4gICAgfSkpO1xuXG4gICAgdGhpcy4kZWwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5faGFuZGxlVG91Y2goKGlkLCB4LCB5LCBlKSA9PiB7XG4gICAgICB0aGlzLnRvdWNoZXNbaWRdID0gW3gsIHldO1xuICAgICAgdGhpcy5fcHJvcGFnYXRlKCd0b3VjaG1vdmUnLCBpZCwgeCwgeSwgZSk7XG4gICAgfSkpO1xuXG4gICAgdGhpcy4kZWwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLl9oYW5kbGVUb3VjaCgoaWQsIHgsIHksIGUpID0+IHtcbiAgICAgIGRlbGV0ZSB0aGlzLnRvdWNoZXNbaWRdO1xuICAgICAgdGhpcy5fcHJvcGFnYXRlKCd0b3VjaGVuZCcsIGlkLCB4LCB5LCBlKTtcbiAgICB9KSk7XG5cbiAgICB0aGlzLiRlbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIHRoaXMuX2hhbmRsZVRvdWNoKChpZCwgeCwgeSwgZSkgPT4ge1xuICAgICAgZGVsZXRlIHRoaXMudG91Y2hlc1tpZF07XG4gICAgICB0aGlzLl9wcm9wYWdhdGUoJ3RvdWNoZW5kJywgaWQsIHgsIHksIGUpO1xuICAgIH0pKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy4kZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuX2hhbmRsZVRvdWNoKTtcbiAgICB0aGlzLiRlbC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLl9oYW5kbGVUb3VjaCk7XG4gICAgdGhpcy4kZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLl9oYW5kbGVUb3VjaCk7XG4gICAgdGhpcy4kZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCB0aGlzLl9oYW5kbGVUb3VjaCk7XG4gIH1cblxuICBhZGRMaXN0ZW5lcihldmVudE5hbWUsIGNhbGxiYWNrKSB7XG4gICAgaWYgKCF0aGlzLl9saXN0ZW5lcnNbZXZlbnROYW1lXSkge1xuICAgICAgdGhpcy5fbGlzdGVuZXJzW2V2ZW50TmFtZV0gPSBbXTtcbiAgICB9XG5cbiAgICB0aGlzLl9saXN0ZW5lcnNbZXZlbnROYW1lXS5wdXNoKGNhbGxiYWNrKTtcbiAgfVxuXG4gIHJlbW92ZUxpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnNbZXZlbnROYW1lXTtcbiAgICBpZiAoIWxpc3RlbmVycykgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IGluZGV4ID0gbGlzdGVuZXJzLmluZGV4T2YoY2FsbGJhY2spO1xuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICBsaXN0ZW5lcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG4gIH1cblxuICBfdXBkYXRlQm91bmRpbmdSZWN0KCkge1xuICAgIHRoaXMuX2VsQm91bmRpbmdSZWN0ID0gdGhpcy4kZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIH1cblxuICBfaGFuZGxlVG91Y2goY2FsbGJhY2spIHtcbiAgICByZXR1cm4gKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgaWYgKCF0aGlzLl9lbEJvdW5kaW5nUmVjdClcbiAgICAgICAgdGhpcy5fdXBkYXRlQm91bmRpbmdSZWN0KCk7XG5cbiAgICAgIGNvbnN0IHRvdWNoZXMgPSBlLmNoYW5nZWRUb3VjaGVzO1xuICAgICAgY29uc3QgYm91bmRpbmdSZWN0ID0gdGhpcy5fZWxCb3VuZGluZ1JlY3Q7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCB0b3VjaEV2ZW50ID0gdG91Y2hlc1tpXTtcbiAgICAgICAgY29uc3QgdG91Y2hJZCA9IHRvdWNoRXZlbnQuaWRlbnRpZmllcjtcbiAgICAgICAgY29uc3QgcmVsWCA9IHRvdWNoRXZlbnQuY2xpZW50WCAtIGJvdW5kaW5nUmVjdC5sZWZ0O1xuICAgICAgICBjb25zdCByZWxZID0gdG91Y2hFdmVudC5jbGllbnRZIC0gYm91bmRpbmdSZWN0LnRvcDtcbiAgICAgICAgdGhpcy5fbm9ybVggPSByZWxYIC8gYm91bmRpbmdSZWN0LndpZHRoO1xuICAgICAgICB0aGlzLl9ub3JtWSA9IHJlbFkgLyBib3VuZGluZ1JlY3QuaGVpZ2h0O1xuXG4gICAgICAgIGNhbGxiYWNrKHRvdWNoSWQsIHRoaXMuX25vcm1YLCB0aGlzLl9ub3JtWSwgdG91Y2hFdmVudCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX3Byb3BhZ2F0ZShldmVudE5hbWUsIHRvdWNoSWQsIG5vcm1YLCBub3JtWSwgdG91Y2hFdmVudCkge1xuICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdO1xuICAgIGlmICghbGlzdGVuZXJzKSB7IHJldHVybjsgfVxuXG4gICAgbGlzdGVuZXJzLmZvckVhY2goKGxpc3RlbmVyKSA9PiB7XG4gICAgICBsaXN0ZW5lcih0b3VjaElkLCBub3JtWCwgbm9ybVksIHRvdWNoRXZlbnQpO1xuICAgIH0pO1xuICB9XG59XG4iXX0=