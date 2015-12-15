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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQ3FCLFlBQVk7QUFDcEIsV0FEUSxZQUFZLENBQ25CLEdBQUcsRUFBRTs7OzBCQURFLFlBQVk7O0FBRTdCLFFBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ2YsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7O0FBRWxCLFFBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO0FBQzVCLFFBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDOzs7QUFHckIsVUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDdkUsUUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7OztBQUczQixRQUFJLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFLO0FBQ3pFLFlBQUssT0FBTyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzFCLFlBQUssVUFBVSxDQUFDLFlBQVksRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUM1QyxDQUFDLENBQUMsQ0FBQzs7QUFFSixRQUFJLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFLO0FBQ3hFLFlBQUssT0FBTyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzFCLFlBQUssVUFBVSxDQUFDLFdBQVcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUMzQyxDQUFDLENBQUMsQ0FBQzs7QUFFSixRQUFJLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFLO0FBQ3ZFLGFBQU8sTUFBSyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDeEIsWUFBSyxVQUFVLENBQUMsVUFBVSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQzFDLENBQUMsQ0FBQyxDQUFDOztBQUVKLFFBQUksQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUs7QUFDMUUsYUFBTyxNQUFLLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN4QixZQUFLLFVBQVUsQ0FBQyxVQUFVLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDMUMsQ0FBQyxDQUFDLENBQUM7R0FDTDs7ZUFoQ2tCLFlBQVk7O1dBa0N4QixtQkFBRztBQUNSLFVBQUksQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUM5RCxVQUFJLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDN0QsVUFBSSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzVELFVBQUksQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUNoRTs7O1dBRVUscUJBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRTtBQUMvQixVQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsRUFBRTtBQUMvQixZQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztPQUNqQzs7QUFFRCxVQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUMzQzs7O1dBRWEsd0JBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRTtBQUNsQyxVQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzdDLFVBQUksQ0FBQyxTQUFTLEVBQUU7QUFBRSxlQUFPO09BQUU7O0FBRTNCLFVBQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDMUMsVUFBSSxLQUFLLElBQUksQ0FBQyxFQUFFO0FBQ2QsaUJBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO09BQzVCO0tBQ0Y7OztXQUVrQiwrQkFBRztBQUNwQixVQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsQ0FBQztLQUN6RDs7O1dBRXdCLG1DQUFDLFVBQVUsRUFBRTs7QUFFcEMsVUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQzs7QUFFMUMsVUFBTSxJQUFJLEdBQUcsVUFBVSxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDO0FBQ3BELFVBQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQztBQUNuRCxVQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQztBQUN4QyxVQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQzs7QUFFekMsYUFBTyxFQUFFLEtBQUssRUFBTCxLQUFLLEVBQUUsS0FBSyxFQUFMLEtBQUssRUFBRSxDQUFDO0tBQ3pCOzs7V0FFVyxzQkFBQyxRQUFRLEVBQUU7OztBQUNyQixhQUFPLFVBQUMsQ0FBQyxFQUFLO0FBQ1osU0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ25CLFlBQU0sT0FBTyxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUM7O0FBRWpDLGFBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3ZDLGNBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5QixjQUFNLE9BQU8sR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDOzsyQ0FDYixPQUFLLHlCQUF5QixDQUFDLFVBQVUsQ0FBQzs7Y0FBM0QsS0FBSyw4QkFBTCxLQUFLO2NBQUUsS0FBSyw4QkFBTCxLQUFLOztBQUVwQixrQkFBUSxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1NBQzdDO09BQ0YsQ0FBQTtLQUNGOzs7V0FFUyxvQkFBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFO0FBQ3ZELFVBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDN0MsVUFBSSxDQUFDLFNBQVMsRUFBRTtBQUFFLGVBQU87T0FBRTs7QUFFM0IsZUFBUyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFFBQVEsRUFBSztBQUM5QixnQkFBUSxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFBO09BQzVDLENBQUMsQ0FBQztLQUNKOzs7U0FqR2tCLFlBQVk7OztxQkFBWixZQUFZIiwiZmlsZSI6InNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVG91Y2hTdXJmYWNlIHtcbiAgY29uc3RydWN0b3IoJGVsKSB7XG4gICAgdGhpcy4kZWwgPSAkZWw7XG4gICAgdGhpcy50b3VjaGVzID0ge307XG5cbiAgICB0aGlzLl9lbEJvdW5kaW5nUmVjdCA9IG51bGw7XG4gICAgdGhpcy5fbGlzdGVuZXJzID0ge307XG5cbiAgICAvLyBjYWNoZSBib3VuZGluZyByZWN0IHZhbHVlc1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl91cGRhdGVCb3VuZGluZ1JlY3QuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5fdXBkYXRlQm91bmRpbmdSZWN0KCk7XG5cbiAgICAvLyBsaXN0ZW4gZXZlbnRzXG4gICAgdGhpcy4kZWwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuX2hhbmRsZVRvdWNoKChpZCwgeCwgeSwgZSkgPT4ge1xuICAgICAgdGhpcy50b3VjaGVzW2lkXSA9IFt4LCB5XTtcbiAgICAgIHRoaXMuX3Byb3BhZ2F0ZSgndG91Y2hzdGFydCcsIGlkLCB4LCB5LCBlKTtcbiAgICB9KSk7XG5cbiAgICB0aGlzLiRlbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLl9oYW5kbGVUb3VjaCgoaWQsIHgsIHksIGUpID0+IHtcbiAgICAgIHRoaXMudG91Y2hlc1tpZF0gPSBbeCwgeV07XG4gICAgICB0aGlzLl9wcm9wYWdhdGUoJ3RvdWNobW92ZScsIGlkLCB4LCB5LCBlKTtcbiAgICB9KSk7XG5cbiAgICB0aGlzLiRlbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMuX2hhbmRsZVRvdWNoKChpZCwgeCwgeSwgZSkgPT4ge1xuICAgICAgZGVsZXRlIHRoaXMudG91Y2hlc1tpZF07XG4gICAgICB0aGlzLl9wcm9wYWdhdGUoJ3RvdWNoZW5kJywgaWQsIHgsIHksIGUpO1xuICAgIH0pKTtcblxuICAgIHRoaXMuJGVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgdGhpcy5faGFuZGxlVG91Y2goKGlkLCB4LCB5LCBlKSA9PiB7XG4gICAgICBkZWxldGUgdGhpcy50b3VjaGVzW2lkXTtcbiAgICAgIHRoaXMuX3Byb3BhZ2F0ZSgndG91Y2hlbmQnLCBpZCwgeCwgeSwgZSk7XG4gICAgfSkpO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLiRlbC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5faGFuZGxlVG91Y2gpO1xuICAgIHRoaXMuJGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMuX2hhbmRsZVRvdWNoKTtcbiAgICB0aGlzLiRlbC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMuX2hhbmRsZVRvdWNoKTtcbiAgICB0aGlzLiRlbC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIHRoaXMuX2hhbmRsZVRvdWNoKTtcbiAgfVxuXG4gIGFkZExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2spIHtcbiAgICBpZiAoIXRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdKSB7XG4gICAgICB0aGlzLl9saXN0ZW5lcnNbZXZlbnROYW1lXSA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdLnB1c2goY2FsbGJhY2spO1xuICB9XG5cbiAgcmVtb3ZlTGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdO1xuICAgIGlmICghbGlzdGVuZXJzKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgaW5kZXggPSBsaXN0ZW5lcnMuaW5kZXhPZihjYWxsYmFjayk7XG4gICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgIGxpc3RlbmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgfVxuXG4gIF91cGRhdGVCb3VuZGluZ1JlY3QoKSB7XG4gICAgdGhpcy5fZWxCb3VuZGluZ1JlY3QgPSB0aGlzLiRlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgfVxuXG4gIF9nZXROb3JtYWxpemVkQ29vcmRpbmF0ZXModG91Y2hFdmVudCkge1xuICAgIC8vIEBUT0RPIHNob3VsZCBiZSBjYWNoZWQgZm9yIHBlcmZvcm1hbmNlXG4gICAgY29uc3QgYm91bmRpbmdSZWN0ID0gdGhpcy5fZWxCb3VuZGluZ1JlY3Q7XG5cbiAgICBjb25zdCByZWxYID0gdG91Y2hFdmVudC5jbGllbnRYIC0gYm91bmRpbmdSZWN0LmxlZnQ7XG4gICAgY29uc3QgcmVsWSA9IHRvdWNoRXZlbnQuY2xpZW50WSAtIGJvdW5kaW5nUmVjdC50b3A7XG4gICAgY29uc3Qgbm9ybVggPSByZWxYIC8gYm91bmRpbmdSZWN0LndpZHRoO1xuICAgIGNvbnN0IG5vcm1ZID0gcmVsWSAvIGJvdW5kaW5nUmVjdC5oZWlnaHQ7XG5cbiAgICByZXR1cm4geyBub3JtWCwgbm9ybVkgfTtcbiAgfVxuXG4gIF9oYW5kbGVUb3VjaChjYWxsYmFjaykge1xuICAgIHJldHVybiAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY29uc3QgdG91Y2hlcyA9IGUuY2hhbmdlZFRvdWNoZXM7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCB0b3VjaEV2ZW50ID0gdG91Y2hlc1tpXTtcbiAgICAgICAgY29uc3QgdG91Y2hJZCA9IHRvdWNoRXZlbnQuaWRlbnRpZmllcjtcbiAgICAgICAgY29uc3QgeyBub3JtWCwgbm9ybVkgfSA9IHRoaXMuX2dldE5vcm1hbGl6ZWRDb29yZGluYXRlcyh0b3VjaEV2ZW50KTtcblxuICAgICAgICBjYWxsYmFjayh0b3VjaElkLCBub3JtWCwgbm9ybVksIHRvdWNoRXZlbnQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9wcm9wYWdhdGUoZXZlbnROYW1lLCB0b3VjaElkLCBub3JtWCwgbm9ybVksIHRvdWNoRXZlbnQpIHtcbiAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnNbZXZlbnROYW1lXTtcbiAgICBpZiAoIWxpc3RlbmVycykgeyByZXR1cm47IH1cblxuICAgIGxpc3RlbmVycy5mb3JFYWNoKChsaXN0ZW5lcikgPT4ge1xuICAgICAgbGlzdGVuZXIodG91Y2hJZCwgbm9ybVgsIG5vcm1ZLCB0b3VjaEV2ZW50KVxuICAgIH0pO1xuICB9XG59Il19