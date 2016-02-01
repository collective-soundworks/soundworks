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
      log('nextView - id: "' + nextView.options.id + '" - priority: ' + priority);
      nextView.show();
    }
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY29yZS92aWV3TWFuYWdlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O3FCQUFrQixPQUFPOzs7O0FBRXpCLElBQU0sR0FBRyxHQUFHLHdCQUFNLHdCQUF3QixDQUFDLENBQUM7QUFDNUMsSUFBTSxLQUFLLEdBQUcsVUFBUyxDQUFDO0FBQ3hCLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQzs7Ozs7cUJBS1A7Ozs7O0FBS2Isa0JBQWdCLEVBQUEsMEJBQUMsR0FBRyxFQUFFO0FBQ3BCLGNBQVUsR0FBRyxHQUFHLENBQUM7R0FDbEI7Ozs7O0FBS0QsVUFBUSxFQUFBLGtCQUFDLElBQUksRUFBRTs7O0FBQ2IsT0FBRyxzQkFBb0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLHNCQUFpQixJQUFJLENBQUMsUUFBUSxDQUFHLENBQUM7O0FBRXhFLFNBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRWhCLFFBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNaLFFBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7O0FBRTFCLGNBQVUsQ0FBQyxZQUFNO0FBQUUsWUFBSyxTQUFTLEVBQUUsQ0FBQztLQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7R0FDNUM7Ozs7O0FBS0QsUUFBTSxFQUFBLGdCQUFDLElBQUksRUFBRTs7O0FBQ1gsT0FBRyxvQkFBa0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLHNCQUFpQixJQUFJLENBQUMsUUFBUSxDQUFHLENBQUM7QUFDdEUsUUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2QsU0FBSyxVQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRW5CLGNBQVUsQ0FBQyxZQUFNO0FBQUUsYUFBSyxTQUFTLEVBQUUsQ0FBQztLQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7R0FDNUM7Ozs7O0FBS0QsV0FBUyxFQUFBLHFCQUFHO0FBQ1YsUUFBSSxjQUFjLFlBQUEsQ0FBQztBQUNuQixRQUFJLFFBQVEsR0FBRyxDQUFDLFFBQVEsQ0FBQztBQUN6QixRQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7O0FBRXBCLFNBQUssQ0FBQyxPQUFPLENBQUMsVUFBUyxJQUFJLEVBQUU7QUFDM0IsVUFBSSxJQUFJLENBQUMsU0FBUyxFQUNoQixjQUFjLEdBQUcsSUFBSSxDQUFDOztBQUV4QixVQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxFQUFFO0FBQzVCLGdCQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztBQUN6QixnQkFBUSxHQUFHLElBQUksQ0FBQztPQUNqQjtLQUNGLENBQUMsQ0FBQzs7QUFHSCxRQUFJLFFBQVEsSUFBSSxDQUFDLGNBQWMsRUFBRTtBQUMvQixTQUFHLHNCQUFvQixRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsc0JBQWlCLFFBQVEsQ0FBRyxDQUFDO0FBQ3ZFLGNBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNqQjtHQUNGO0NBQ0YiLCJmaWxlIjoic3JjL2NsaWVudC9jb3JlL3ZpZXdNYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGRlYnVnIGZyb20gJ2RlYnVnJztcblxuY29uc3QgbG9nID0gZGVidWcoJ3NvdW5kd29ya3M6dmlld01hbmFnZXInKTtcbmNvbnN0IHN0YWNrID0gbmV3IFNldCgpO1xubGV0ICRjb250YWluZXIgPSBudWxsO1xuXG4vKipcbiAqIEhhbmRsZSBzZXJ2aWNlcycgdmlld3MgYWNjb3JkaW5nIHRvIHRoZWlyIHByaW9yaXRpZXMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IHtcbiAgLyoqXG4gICAqIFNldHMgdGhlIGNvbnRhaW5lciBvZiB0aGUgdmlld3MgZm9yIGFsbCBgQWN0aXZpdHlgIGluc3RhbmNlcy5cbiAgICogQHBhcmFtIHtFbGVtZW50fSAkZWwgLSBUaGUgZWxlbWVudCB0byB1c2UgYXMgYSBjb250YWluZXIgZm9yIHRoZSBtb2R1bGUncyB2aWV3LlxuICAgKi9cbiAgc2V0Vmlld0NvbnRhaW5lcigkZWwpIHtcbiAgICAkY29udGFpbmVyID0gJGVsO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIHZpZXcgaW50byB0aGUgc3RhY2sgb2Ygdmlld3MgdG8gZGlzcGxheS5cbiAgICovXG4gIHJlZ2lzdGVyKHZpZXcpIHtcbiAgICBsb2coYHJlZ2lzdGVyIC0gaWQ6IFwiJHt2aWV3Lm9wdGlvbnMuaWR9XCIgLSBwcmlvcml0eTogJHt2aWV3LnByaW9yaXR5fWApO1xuICAgIC8vIGFkZCB0byB0aGUgc3RhY2tcbiAgICBzdGFjay5hZGQodmlldyk7XG5cbiAgICB2aWV3LmhpZGUoKTtcbiAgICB2aWV3LmFwcGVuZFRvKCRjb250YWluZXIpO1xuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7IHRoaXMuX3Nob3dOZXh0KCk7IH0sIDApO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZW1vdmUgdmlldyBmcm9tIHRoZSBzdGFjayBvZiB2aWV3cyB0byBkaXNwbGF5LlxuICAgKi9cbiAgcmVtb3ZlKHZpZXcpIHtcbiAgICBsb2coYHJlbW92ZSAtIGlkOiBcIiR7dmlldy5vcHRpb25zLmlkfVwiIC0gcHJpb3JpdHk6ICR7dmlldy5wcmlvcml0eX1gKTtcbiAgICB2aWV3LnJlbW92ZSgpO1xuICAgIHN0YWNrLmRlbGV0ZSh2aWV3KTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4geyB0aGlzLl9zaG93TmV4dCgpOyB9LCAwKTtcbiAgfSxcblxuICAvKipcbiAgICogU2hvdyB0aGUgdmlldyB3aXRoIHRoZS5cbiAgICovXG4gIF9zaG93TmV4dCgpIHtcbiAgICBsZXQgaGFzVmlzaWJsZVZpZXc7XG4gICAgbGV0IHByaW9yaXR5ID0gLUluZmluaXR5O1xuICAgIGxldCBuZXh0VmlldyA9IG51bGw7XG5cbiAgICBzdGFjay5mb3JFYWNoKGZ1bmN0aW9uKHZpZXcpIHtcbiAgICAgIGlmICh2aWV3LmlzVmlzaWJsZSlcbiAgICAgICAgaGFzVmlzaWJsZVZpZXcgPSB0cnVlO1xuXG4gICAgICBpZiAodmlldy5wcmlvcml0eSA+IHByaW9yaXR5KSB7XG4gICAgICAgIHByaW9yaXR5ID0gdmlldy5wcmlvcml0eTtcbiAgICAgICAgbmV4dFZpZXcgPSB2aWV3O1xuICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICBpZiAobmV4dFZpZXcgJiYgIWhhc1Zpc2libGVWaWV3KSB7XG4gICAgICBsb2coYG5leHRWaWV3IC0gaWQ6IFwiJHtuZXh0Vmlldy5vcHRpb25zLmlkfVwiIC0gcHJpb3JpdHk6ICR7cHJpb3JpdHl9YCk7XG4gICAgICBuZXh0Vmlldy5zaG93KCk7XG4gICAgfVxuICB9LFxufTtcbiJdfQ==