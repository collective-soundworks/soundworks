'use strict';

var _Set = require('babel-runtime/core-js/set')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var log = (0, _debug2['default'])('soundworks:viewManager');
var stack = new _Set();
var $container = null;

/**
 * Handle services' views according to their priorities.
 */
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

    log('register - id: "' + view.options.id + '" - priority: ' + view.priority);
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

    log('remove - id: "' + view.options.id + '" - priority: ' + view.priority);
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
    var visibleView = undefined;
    var priority = -Infinity;
    var nextView = null;

    stack.forEach(function (view) {
      if (view.isVisible) visibleView = true;

      if (view.priority > priority) {
        priority = view.priority;
        nextView = view;
      }
    });

    if (nextView) {
      if (!visibleView || visibleView.priority < nextView.priority) {
        log('nextView - id: "' + nextView.options.id + '" - priority: ' + priority);
        nextView.show();
      }
    }
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY29yZS92aWV3TWFuYWdlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O3FCQUFrQixPQUFPOzs7O0FBRXpCLElBQU0sR0FBRyxHQUFHLHdCQUFNLHdCQUF3QixDQUFDLENBQUM7QUFDNUMsSUFBTSxLQUFLLEdBQUcsVUFBUyxDQUFDO0FBQ3hCLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQzs7Ozs7cUJBS1A7Ozs7O0FBS2Isa0JBQWdCLEVBQUEsMEJBQUMsR0FBRyxFQUFFO0FBQ3BCLGNBQVUsR0FBRyxHQUFHLENBQUM7R0FDbEI7Ozs7O0FBS0QsVUFBUSxFQUFBLGtCQUFDLElBQUksRUFBRTs7O0FBQ2IsT0FBRyxzQkFBb0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLHNCQUFpQixJQUFJLENBQUMsUUFBUSxDQUFHLENBQUM7O0FBRXhFLFNBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRWhCLFFBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNaLFFBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7O0FBRTFCLGNBQVUsQ0FBQyxZQUFNO0FBQUUsWUFBSyxTQUFTLEVBQUUsQ0FBQztLQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7R0FDNUM7Ozs7O0FBS0QsUUFBTSxFQUFBLGdCQUFDLElBQUksRUFBRTs7O0FBQ1gsT0FBRyxvQkFBa0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLHNCQUFpQixJQUFJLENBQUMsUUFBUSxDQUFHLENBQUM7QUFDdEUsUUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2QsU0FBSyxVQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRW5CLGNBQVUsQ0FBQyxZQUFNO0FBQUUsYUFBSyxTQUFTLEVBQUUsQ0FBQztLQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7R0FDNUM7Ozs7O0FBS0QsV0FBUyxFQUFBLHFCQUFHO0FBQ1YsUUFBSSxXQUFXLFlBQUEsQ0FBQztBQUNoQixRQUFJLFFBQVEsR0FBRyxDQUFDLFFBQVEsQ0FBQztBQUN6QixRQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7O0FBRXBCLFNBQUssQ0FBQyxPQUFPLENBQUMsVUFBUyxJQUFJLEVBQUU7QUFDM0IsVUFBSSxJQUFJLENBQUMsU0FBUyxFQUNoQixXQUFXLEdBQUcsSUFBSSxDQUFDOztBQUVyQixVQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxFQUFFO0FBQzVCLGdCQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztBQUN6QixnQkFBUSxHQUFHLElBQUksQ0FBQztPQUNqQjtLQUNGLENBQUMsQ0FBQzs7QUFFSCxRQUFJLFFBQVEsRUFBRTtBQUNaLFVBQUksQ0FBQyxXQUFXLElBQUssV0FBVyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsUUFBUSxBQUFDLEVBQUU7QUFDOUQsV0FBRyxzQkFBb0IsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLHNCQUFpQixRQUFRLENBQUcsQ0FBQztBQUN2RSxnQkFBUSxDQUFDLElBQUksRUFBRSxDQUFDO09BQ2pCO0tBQ0Y7R0FDRjtDQUNGIiwiZmlsZSI6InNyYy9jbGllbnQvY29yZS92aWV3TWFuYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5cbmNvbnN0IGxvZyA9IGRlYnVnKCdzb3VuZHdvcmtzOnZpZXdNYW5hZ2VyJyk7XG5jb25zdCBzdGFjayA9IG5ldyBTZXQoKTtcbmxldCAkY29udGFpbmVyID0gbnVsbDtcblxuLyoqXG4gKiBIYW5kbGUgc2VydmljZXMnIHZpZXdzIGFjY29yZGluZyB0byB0aGVpciBwcmlvcml0aWVzLlxuICovXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qKlxuICAgKiBTZXRzIHRoZSBjb250YWluZXIgb2YgdGhlIHZpZXdzIGZvciBhbGwgYEFjdGl2aXR5YCBpbnN0YW5jZXMuXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGVsIC0gVGhlIGVsZW1lbnQgdG8gdXNlIGFzIGEgY29udGFpbmVyIGZvciB0aGUgbW9kdWxlJ3Mgdmlldy5cbiAgICovXG4gIHNldFZpZXdDb250YWluZXIoJGVsKSB7XG4gICAgJGNvbnRhaW5lciA9ICRlbDtcbiAgfSxcblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSB2aWV3IGludG8gdGhlIHN0YWNrIG9mIHZpZXdzIHRvIGRpc3BsYXkuXG4gICAqL1xuICByZWdpc3Rlcih2aWV3KSB7XG4gICAgbG9nKGByZWdpc3RlciAtIGlkOiBcIiR7dmlldy5vcHRpb25zLmlkfVwiIC0gcHJpb3JpdHk6ICR7dmlldy5wcmlvcml0eX1gKTtcbiAgICAvLyBhZGQgdG8gdGhlIHN0YWNrXG4gICAgc3RhY2suYWRkKHZpZXcpO1xuXG4gICAgdmlldy5oaWRlKCk7XG4gICAgdmlldy5hcHBlbmRUbygkY29udGFpbmVyKTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4geyB0aGlzLl9zaG93TmV4dCgpOyB9LCAwKTtcbiAgfSxcblxuICAvKipcbiAgICogUmVtb3ZlIHZpZXcgZnJvbSB0aGUgc3RhY2sgb2Ygdmlld3MgdG8gZGlzcGxheS5cbiAgICovXG4gIHJlbW92ZSh2aWV3KSB7XG4gICAgbG9nKGByZW1vdmUgLSBpZDogXCIke3ZpZXcub3B0aW9ucy5pZH1cIiAtIHByaW9yaXR5OiAke3ZpZXcucHJpb3JpdHl9YCk7XG4gICAgdmlldy5yZW1vdmUoKTtcbiAgICBzdGFjay5kZWxldGUodmlldyk7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHsgdGhpcy5fc2hvd05leHQoKTsgfSwgMCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNob3cgdGhlIHZpZXcgd2l0aCB0aGUuXG4gICAqL1xuICBfc2hvd05leHQoKSB7XG4gICAgbGV0IHZpc2libGVWaWV3O1xuICAgIGxldCBwcmlvcml0eSA9IC1JbmZpbml0eTtcbiAgICBsZXQgbmV4dFZpZXcgPSBudWxsO1xuXG4gICAgc3RhY2suZm9yRWFjaChmdW5jdGlvbih2aWV3KSB7XG4gICAgICBpZiAodmlldy5pc1Zpc2libGUpXG4gICAgICAgIHZpc2libGVWaWV3ID0gdHJ1ZTtcblxuICAgICAgaWYgKHZpZXcucHJpb3JpdHkgPiBwcmlvcml0eSkge1xuICAgICAgICBwcmlvcml0eSA9IHZpZXcucHJpb3JpdHk7XG4gICAgICAgIG5leHRWaWV3ID0gdmlldztcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChuZXh0Vmlldykge1xuICAgICAgaWYgKCF2aXNpYmxlVmlld8KgfHwgKHZpc2libGVWaWV3LnByaW9yaXR5IDwgbmV4dFZpZXcucHJpb3JpdHkpKSB7XG4gICAgICAgIGxvZyhgbmV4dFZpZXcgLSBpZDogXCIke25leHRWaWV3Lm9wdGlvbnMuaWR9XCIgLSBwcmlvcml0eTogJHtwcmlvcml0eX1gKTtcbiAgICAgICAgbmV4dFZpZXcuc2hvdygpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbn07XG4iXX0=