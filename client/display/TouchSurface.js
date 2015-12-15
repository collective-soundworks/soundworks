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
    key: '_getNormalizedCoordinates',
    value: function _getNormalizedCoordinates(touchEvent) {
      // @TODO should be cached for performance
      var boundingRect = this._elBoundingRect;

      var relX = touchEvent.clientX - boundingRect.left;
      var relY = touchEvent.clientY - boundingRect.top;
      var normX = relX / boundingRect.width;
      var normY = relY / boundingRect.height;

      return { normX: normX, normY: normY };
    }
  }, {
    key: '_handleTouch',
    value: function _handleTouch(callback) {
      var _this2 = this;

      return function (e) {
        e.preventDefault();
        var touches = e.changedTouches;

        for (var i = 0; i < touches.length; i++) {
          var touchEvent = touches[i];
          var touchId = touchEvent.identifier;

          var _getNormalizedCoordinates2 = _this2._getNormalizedCoordinates(touchEvent);

          var normX = _getNormalizedCoordinates2.normX;
          var normY = _getNormalizedCoordinates2.normY;

          callback(touchId, normX, normY, touchEvent);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS9Ub3VjaFN1cmZhY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUNxQixZQUFZO0FBQ3BCLFdBRFEsWUFBWSxDQUNuQixHQUFHLEVBQUU7OzswQkFERSxZQUFZOztBQUU3QixRQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUNmLFFBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDOztBQUVsQixRQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztBQUM1QixRQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQzs7O0FBR3JCLFVBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ3ZFLFFBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDOzs7QUFHM0IsUUFBSSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBSztBQUN6RSxZQUFLLE9BQU8sQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMxQixZQUFLLFVBQVUsQ0FBQyxZQUFZLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDNUMsQ0FBQyxDQUFDLENBQUM7O0FBRUosUUFBSSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBSztBQUN4RSxZQUFLLE9BQU8sQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMxQixZQUFLLFVBQVUsQ0FBQyxX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S0FBSyxFQUFFLEtBQUssRUFBTCxLQUFLLEVBQUUsQ0FBQztLQUN6Qjs7O1dBRVcsc0JBQUMsUUFBUSxFQUFFOzs7QUFDckIsYUFBTyxVQUFDLENBQUMsRUFBSztBQUNaLFNBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNuQixZQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsY0FBYyxDQUFDOztBQUVqQyxhQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN2QyxjQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUIsY0FBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQzs7MkNBQ2IsT0FBSyx5QkFBeUIsQ0FBQyxVQUFVLENBQUM7O2NBQTNELEtBQUssOEJBQUwsS0FBSztjQUFFLEtBQUssOEJBQUwsS0FBSzs7QUFFcEIsa0JBQVEsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztTQUM3QztPQUNGLENBQUE7S0FDRjs7O1dBRVMsb0JBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRTtBQUN2RCxVQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzdDLFVBQUksQ0FBQyxTQUFTLEVBQUU7QUFBRSxlQUFPO09BQUU7O0FBRTNCLGVBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQyxRQUFRLEVBQUs7QUFDOUIsZ0JBQVEsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQTtPQUM1QyxDQUFDLENBQUM7S0FDSjs7O1NBakdrQixZQUFZOzs7cUJBQVosWUFBWSIsImZpbGUiOiJzcmMvY2xpZW50L2Rpc3BsYXkvVG91Y2hTdXJmYWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUb3VjaFN1cmZhY2Uge1xuICBjb25zdHJ1Y3RvcigkZWwpIHtcbiAgICB0aGlzLiRlbCA9ICRlbDtcbiAgICB0aGlzLnRvdWNoZXMgPSB7fTtcblxuICAgIHRoaXMuX2VsQm91bmRpbmdSZWN0ID0gbnVsbDtcbiAgICB0aGlzLl9saXN0ZW5lcnMgPSB7fTtcblxuICAgIC8vIGNhY2hlIGJvdW5kaW5nIHJlY3QgdmFsdWVzXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3VwZGF0ZUJvdW5kaW5nUmVjdC5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl91cGRhdGVCb3VuZGluZ1JlY3QoKTtcblxuICAgIC8vIGxpc3RlbiBldmVudHNcbiAgICB0aGlzLiRlbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5faGFuZGxlVG91Y2goKGlkLCB4LCB5LCBlKSA9PiB7XG4gICAgICB0aGlzLnRvdWNoZXNbaWRdID0gW3gsIHldO1xuICAgICAgdGhpcy5fcHJvcGFnYXRlKCd0b3VjaHN0YXJ0JywgaWQsIHgsIHksIGUpO1xuICAgIH0pKTtcblxuICAgIHRoaXMuJGVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMuX2hhbmRsZVRvdWNoKChpZCwgeCwgeSwgZSkgPT4ge1xuICAgICAgdGhpcy50b3VjaGVzW2lkXSA9IFt4LCB5XTtcbiAgICAgIHRoaXMuX3Byb3BhZ2F0ZSgndG91Y2htb3ZlJywgaWQsIHgsIHksIGUpO1xuICAgIH0pKTtcblxuICAgIHRoaXMuJGVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5faGFuZGxlVG91Y2goKGlkLCB4LCB5LCBlKSA9PiB7XG4gICAgICBkZWxldGUgdGhpcy50b3VjaGVzW2lkXTtcbiAgICAgIHRoaXMuX3Byb3BhZ2F0ZSgndG91Y2hlbmQnLCBpZCwgeCwgeSwgZSk7XG4gICAgfSkpO1xuXG4gICAgdGhpcy4kZWwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCB0aGlzLl9oYW5kbGVUb3VjaCgoaWQsIHgsIHksIGUpID0+IHtcbiAgICAgIGRlbGV0ZSB0aGlzLnRvdWNoZXNbaWRdO1xuICAgICAgdGhpcy5fcHJvcGFnYXRlKCd0b3VjaGVuZCcsIGlkLCB4LCB5LCBlKTtcbiAgICB9KSk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuJGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9oYW5kbGVUb3VjaCk7XG4gICAgdGhpcy4kZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5faGFuZGxlVG91Y2gpO1xuICAgIHRoaXMuJGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5faGFuZGxlVG91Y2gpO1xuICAgIHRoaXMuJGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgdGhpcy5faGFuZGxlVG91Y2gpO1xuICB9XG5cbiAgYWRkTGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjaykge1xuICAgIGlmICghdGhpcy5fbGlzdGVuZXJzW2V2ZW50TmFtZV0pIHtcbiAgICAgIHRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdID0gW107XG4gICAgfVxuXG4gICAgdGhpcy5fbGlzdGVuZXJzW2V2ZW50TmFtZV0ucHVzaChjYWxsYmFjayk7XG4gIH1cblxuICByZW1vdmVMaXN0ZW5lcihldmVudE5hbWUsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzW2V2ZW50TmFtZV07XG4gICAgaWYgKCFsaXN0ZW5lcnMpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBpbmRleCA9IGxpc3RlbmVycy5pbmRleE9mKGNhbGxiYWNrKTtcbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgbGlzdGVuZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuICB9XG5cbiAgX3VwZGF0ZUJvdW5kaW5nUmVjdCgpIHtcbiAgICB0aGlzLl9lbEJvdW5kaW5nUmVjdCA9IHRoaXMuJGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICB9XG5cbiAgX2dldE5vcm1hbGl6ZWRDb29yZGluYXRlcyh0b3VjaEV2ZW50KSB7XG4gICAgLy8gQFRPRE8gc2hvdWxkIGJlIGNhY2hlZCBmb3IgcGVyZm9ybWFuY2VcbiAgICBjb25zdCBib3VuZGluZ1JlY3QgPSB0aGlzLl9lbEJvdW5kaW5nUmVjdDtcblxuICAgIGNvbnN0IHJlbFggPSB0b3VjaEV2ZW50LmNsaWVudFggLSBib3VuZGluZ1JlY3QubGVmdDtcbiAgICBjb25zdCByZWxZID0gdG91Y2hFdmVudC5jbGllbnRZIC0gYm91bmRpbmdSZWN0LnRvcDtcbiAgICBjb25zdCBub3JtWCA9IHJlbFggLyBib3VuZGluZ1JlY3Qud2lkdGg7XG4gICAgY29uc3Qgbm9ybVkgPSByZWxZIC8gYm91bmRpbmdSZWN0LmhlaWdodDtcblxuICAgIHJldHVybiB7IG5vcm1YLCBub3JtWSB9O1xuICB9XG5cbiAgX2hhbmRsZVRvdWNoKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjb25zdCB0b3VjaGVzID0gZS5jaGFuZ2VkVG91Y2hlcztcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b3VjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHRvdWNoRXZlbnQgPSB0b3VjaGVzW2ldO1xuICAgICAgICBjb25zdCB0b3VjaElkID0gdG91Y2hFdmVudC5pZGVudGlmaWVyO1xuICAgICAgICBjb25zdCB7IG5vcm1YLCBub3JtWSB9ID0gdGhpcy5fZ2V0Tm9ybWFsaXplZENvb3JkaW5hdGVzKHRvdWNoRXZlbnQpO1xuXG4gICAgICAgIGNhbGxiYWNrKHRvdWNoSWQsIG5vcm1YLCBub3JtWSwgdG91Y2hFdmVudCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX3Byb3BhZ2F0ZShldmVudE5hbWUsIHRvdWNoSWQsIG5vcm1YLCBub3JtWSwgdG91Y2hFdmVudCkge1xuICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdO1xuICAgIGlmICghbGlzdGVuZXJzKSB7IHJldHVybjsgfVxuXG4gICAgbGlzdGVuZXJzLmZvckVhY2goKGxpc3RlbmVyKSA9PiB7XG4gICAgICBsaXN0ZW5lcih0b3VjaElkLCBub3JtWCwgbm9ybVksIHRvdWNoRXZlbnQpXG4gICAgfSk7XG4gIH1cbn0iXX0=