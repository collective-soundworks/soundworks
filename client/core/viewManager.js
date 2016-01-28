// handle views according to their priority
// should throttle on start to wait for several module starting at the same time (ex parallel) to define the higher priority.
// should then displayviews according to their priority.

// should only deal with show and hide.

'use strict';

var _Set = require('babel-runtime/core-js/set')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
var stack = new _Set();
var $container = null;

exports['default'] = {
  /**
   * Sets the container of the views for all `Activity` instances.
   * @param {Element} $el - The element to use as a container for the module's view.
   */
  setViewContainer: function setViewContainer($el) {
    $container = $el;
  },

  /**
   * Register a view into the stack of views to display.
   */
  register: function register(view) {
    var _this = this;

    console.log('==> viewManager:register', view.options.id);
    // add to the stack
    stack.add(view);

    view.hide();
    view.appendTo($container);

    setTimeout(function () {
      _this._showNext();
    }, 0);
  },

  /**
   * Remove view from the stack of views to display.
   */
  remove: function remove(view) {
    var _this2 = this;

    console.log('==> viewManager:remove', view.options.id);
    view.remove();
    stack['delete'](view);

    setTimeout(function () {
      _this2._showNext();
    }, 0);
  },

  /**
   * Show the view with the.
   */
  _showNext: function _showNext() {
    var hasVisibleView = undefined;
    var priority = -Infinity;
    var nextView = null;

    stack.forEach(function (view) {
      if (view.isVisible) hasVisibleView = true;

      if (view.priority > priority) {
        priority = view.priority;
        nextView = view;
      }
    });

    if (nextView && !hasVisibleView) {
      console.log('==> viewManager:nextView', nextView.options.id, priority);
      nextView.show();
    }
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY29yZS92aWV3TWFuYWdlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBTUEsSUFBTSxLQUFLLEdBQUcsVUFBUyxDQUFDO0FBQ3hCLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQzs7cUJBRVA7Ozs7O0FBS2Isa0JBQWdCLEVBQUEsMEJBQUMsR0FBRyxFQUFFO0FBQ3BCLGNBQVUsR0FBRyxHQUFHLENBQUM7R0FDbEI7Ozs7O0FBS0QsVUFBUSxFQUFBLGtCQUFDLElBQUksRUFBRTs7O0FBQ2IsV0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDOztBQUV6RCxTQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVoQixRQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWixRQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDOztBQUUxQixjQUFVLENBQUMsWUFBTTtBQUFFLFlBQUssU0FBUyxFQUFFLENBQUM7S0FBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0dBQzVDOzs7OztBQUtELFFBQU0sRUFBQSxnQkFBQyxJQUFJLEVBQUU7OztBQUNYLFdBQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN2RCxRQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDZCxTQUFLLFVBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFbkIsY0FBVSxDQUFDLFlBQU07QUFBRSxhQUFLLFNBQVMsRUFBRSxDQUFDO0tBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztHQUM1Qzs7Ozs7QUFLRCxXQUFTLEVBQUEscUJBQUc7QUFDVixRQUFJLGNBQWMsWUFBQSxDQUFDO0FBQ25CLFFBQUksUUFBUSxHQUFHLENBQUMsUUFBUSxDQUFDO0FBQ3pCLFFBQUksUUFBUSxHQUFHLElBQUksQ0FBQzs7QUFFcEIsU0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFTLElBQUksRUFBRTtBQUMzQixVQUFJLElBQUksQ0FBQyxTQUFTLEVBQ2hCLGNBQWMsR0FBRyxJQUFJLENBQUM7O0FBRXhCLFVBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLEVBQUU7QUFDNUIsZ0JBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQ3pCLGdCQUFRLEdBQUcsSUFBSSxDQUFDO09BQ2pCO0tBQ0YsQ0FBQyxDQUFDOztBQUdILFFBQUksUUFBUSxJQUFJLENBQUMsY0FBYyxFQUFFO0FBQy9CLGFBQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDdkUsY0FBUSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2pCO0dBQ0Y7Q0FDRiIsImZpbGUiOiJzcmMvY2xpZW50L2NvcmUvdmlld01hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBoYW5kbGUgdmlld3MgYWNjb3JkaW5nIHRvIHRoZWlyIHByaW9yaXR5XG4vLyBzaG91bGQgdGhyb3R0bGUgb24gc3RhcnQgdG8gd2FpdCBmb3Igc2V2ZXJhbCBtb2R1bGUgc3RhcnRpbmcgYXQgdGhlIHNhbWUgdGltZSAoZXggcGFyYWxsZWwpIHRvIGRlZmluZSB0aGUgaGlnaGVyIHByaW9yaXR5LlxuLy8gc2hvdWxkIHRoZW4gZGlzcGxheXZpZXdzIGFjY29yZGluZyB0byB0aGVpciBwcmlvcml0eS5cblxuLy8gc2hvdWxkIG9ubHkgZGVhbCB3aXRoIHNob3cgYW5kIGhpZGUuXG5cbmNvbnN0IHN0YWNrID0gbmV3IFNldCgpO1xubGV0ICRjb250YWluZXIgPSBudWxsO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qKlxuICAgKiBTZXRzIHRoZSBjb250YWluZXIgb2YgdGhlIHZpZXdzIGZvciBhbGwgYEFjdGl2aXR5YCBpbnN0YW5jZXMuXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGVsIC0gVGhlIGVsZW1lbnQgdG8gdXNlIGFzIGEgY29udGFpbmVyIGZvciB0aGUgbW9kdWxlJ3Mgdmlldy5cbiAgICovXG4gIHNldFZpZXdDb250YWluZXIoJGVsKSB7XG4gICAgJGNvbnRhaW5lciA9ICRlbDtcbiAgfSxcblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSB2aWV3IGludG8gdGhlIHN0YWNrIG9mIHZpZXdzIHRvIGRpc3BsYXkuXG4gICAqL1xuICByZWdpc3Rlcih2aWV3KSB7XG4gICAgY29uc29sZS5sb2coJz09PiB2aWV3TWFuYWdlcjpyZWdpc3RlcicsIHZpZXcub3B0aW9ucy5pZCk7XG4gICAgLy8gYWRkIHRvIHRoZSBzdGFja1xuICAgIHN0YWNrLmFkZCh2aWV3KTtcblxuICAgIHZpZXcuaGlkZSgpO1xuICAgIHZpZXcuYXBwZW5kVG8oJGNvbnRhaW5lcik7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHsgdGhpcy5fc2hvd05leHQoKTsgfSwgMCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlbW92ZSB2aWV3IGZyb20gdGhlIHN0YWNrIG9mIHZpZXdzIHRvIGRpc3BsYXkuXG4gICAqL1xuICByZW1vdmUodmlldykge1xuICAgIGNvbnNvbGUubG9nKCc9PT4gdmlld01hbmFnZXI6cmVtb3ZlJywgdmlldy5vcHRpb25zLmlkKTtcbiAgICB2aWV3LnJlbW92ZSgpO1xuICAgIHN0YWNrLmRlbGV0ZSh2aWV3KTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4geyB0aGlzLl9zaG93TmV4dCgpOyB9LCAwKTtcbiAgfSxcblxuICAvKipcbiAgICogU2hvdyB0aGUgdmlldyB3aXRoIHRoZS5cbiAgICovXG4gIF9zaG93TmV4dCgpIHtcbiAgICBsZXQgaGFzVmlzaWJsZVZpZXc7XG4gICAgbGV0IHByaW9yaXR5ID0gLUluZmluaXR5O1xuICAgIGxldCBuZXh0VmlldyA9IG51bGw7XG5cbiAgICBzdGFjay5mb3JFYWNoKGZ1bmN0aW9uKHZpZXcpIHtcbiAgICAgIGlmICh2aWV3LmlzVmlzaWJsZSlcbiAgICAgICAgaGFzVmlzaWJsZVZpZXcgPSB0cnVlO1xuXG4gICAgICBpZiAodmlldy5wcmlvcml0eSA+IHByaW9yaXR5KSB7XG4gICAgICAgIHByaW9yaXR5ID0gdmlldy5wcmlvcml0eTtcbiAgICAgICAgbmV4dFZpZXcgPSB2aWV3O1xuICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICBpZiAobmV4dFZpZXcgJiYgIWhhc1Zpc2libGVWaWV3KSB7XG4gICAgICBjb25zb2xlLmxvZygnPT0+IHZpZXdNYW5hZ2VyOm5leHRWaWV3JywgbmV4dFZpZXcub3B0aW9ucy5pZCwgcHJpb3JpdHkpO1xuICAgICAgbmV4dFZpZXcuc2hvdygpO1xuICAgIH1cbiAgfSxcbn07XG4iXX0=