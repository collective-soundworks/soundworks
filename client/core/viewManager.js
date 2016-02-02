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
  _timeoutId: null,

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

    if (!this._timeoutId) this.timeoutId = setTimeout(function () {
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

    this.timeoutId = null;
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY29yZS92aWV3TWFuYWdlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O3FCQUFrQixPQUFPOzs7O0FBRXpCLElBQU0sR0FBRyxHQUFHLHdCQUFNLHdCQUF3QixDQUFDLENBQUM7QUFDNUMsSUFBTSxLQUFLLEdBQUcsVUFBUyxDQUFDO0FBQ3hCLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQzs7Ozs7cUJBS1A7QUFDYixZQUFVLEVBQUUsSUFBSTs7Ozs7O0FBTWhCLGtCQUFnQixFQUFBLDBCQUFDLEdBQUcsRUFBRTtBQUNwQixjQUFVLEdBQUcsR0FBRyxDQUFDO0dBQ2xCOzs7OztBQUtELFVBQVEsRUFBQSxrQkFBQyxJQUFJLEVBQUU7OztBQUNiLE9BQUcsc0JBQW9CLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxzQkFBaUIsSUFBSSxDQUFDLFFBQVEsQ0FBRyxDQUFDOztBQUV4RSxTQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVoQixRQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWixRQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDOztBQUUxQixRQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFDbEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUMsWUFBTTtBQUFFLFlBQUssU0FBUyxFQUFFLENBQUM7S0FBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0dBQy9EOzs7OztBQUtELFFBQU0sRUFBQSxnQkFBQyxJQUFJLEVBQUU7OztBQUNYLE9BQUcsb0JBQWtCLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxzQkFBaUIsSUFBSSxDQUFDLFFBQVEsQ0FBRyxDQUFDO0FBQ3RFLFFBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNkLFNBQUssVUFBTyxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVuQixjQUFVLENBQUMsWUFBTTtBQUFFLGFBQUssU0FBUyxFQUFFLENBQUM7S0FBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0dBQzVDOzs7OztBQUtELFdBQVMsRUFBQSxxQkFBRztBQUNWLFFBQUksV0FBVyxZQUFBLENBQUM7QUFDaEIsUUFBSSxRQUFRLEdBQUcsQ0FBQyxRQUFRLENBQUM7QUFDekIsUUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDOztBQUVwQixTQUFLLENBQUMsT0FBTyxDQUFDLFVBQVMsSUFBSSxFQUFFO0FBQzNCLFVBQUksSUFBSSxDQUFDLFNBQVMsRUFDaEIsV0FBVyxHQUFHLElBQUksQ0FBQzs7QUFFckIsVUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsRUFBRTtBQUM1QixnQkFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDekIsZ0JBQVEsR0FBRyxJQUFJLENBQUM7T0FDakI7S0FDRixDQUFDLENBQUM7O0FBRUgsUUFBSSxRQUFRLEVBQUU7QUFDWixVQUFJLENBQUMsV0FBVyxJQUFLLFdBQVcsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLFFBQVEsQUFBQyxFQUFFO0FBQzlELFdBQUcsc0JBQW9CLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxzQkFBaUIsUUFBUSxDQUFHLENBQUM7QUFDdkUsZ0JBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztPQUNqQjtLQUNGOztBQUVELFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0dBQ3ZCO0NBQ0YiLCJmaWxlIjoic3JjL2NsaWVudC9jb3JlL3ZpZXdNYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGRlYnVnIGZyb20gJ2RlYnVnJztcblxuY29uc3QgbG9nID0gZGVidWcoJ3NvdW5kd29ya3M6dmlld01hbmFnZXInKTtcbmNvbnN0IHN0YWNrID0gbmV3IFNldCgpO1xubGV0ICRjb250YWluZXIgPSBudWxsO1xuXG4vKipcbiAqIEhhbmRsZSBzZXJ2aWNlcycgdmlld3MgYWNjb3JkaW5nIHRvIHRoZWlyIHByaW9yaXRpZXMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IHtcbiAgX3RpbWVvdXRJZDogbnVsbCxcblxuICAvKipcbiAgICogU2V0cyB0aGUgY29udGFpbmVyIG9mIHRoZSB2aWV3cyBmb3IgYWxsIGBBY3Rpdml0eWAgaW5zdGFuY2VzLlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRlbCAtIFRoZSBlbGVtZW50IHRvIHVzZSBhcyBhIGNvbnRhaW5lciBmb3IgdGhlIG1vZHVsZSdzIHZpZXcuXG4gICAqL1xuICBzZXRWaWV3Q29udGFpbmVyKCRlbCkge1xuICAgICRjb250YWluZXIgPSAkZWw7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgdmlldyBpbnRvIHRoZSBzdGFjayBvZiB2aWV3cyB0byBkaXNwbGF5LlxuICAgKi9cbiAgcmVnaXN0ZXIodmlldykge1xuICAgIGxvZyhgcmVnaXN0ZXIgLSBpZDogXCIke3ZpZXcub3B0aW9ucy5pZH1cIiAtIHByaW9yaXR5OiAke3ZpZXcucHJpb3JpdHl9YCk7XG4gICAgLy8gYWRkIHRvIHRoZSBzdGFja1xuICAgIHN0YWNrLmFkZCh2aWV3KTtcblxuICAgIHZpZXcuaGlkZSgpO1xuICAgIHZpZXcuYXBwZW5kVG8oJGNvbnRhaW5lcik7XG5cbiAgICBpZiAoIXRoaXMuX3RpbWVvdXRJZClcbiAgICAgIHRoaXMudGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiB7IHRoaXMuX3Nob3dOZXh0KCk7IH0sIDApO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZW1vdmUgdmlldyBmcm9tIHRoZSBzdGFjayBvZiB2aWV3cyB0byBkaXNwbGF5LlxuICAgKi9cbiAgcmVtb3ZlKHZpZXcpIHtcbiAgICBsb2coYHJlbW92ZSAtIGlkOiBcIiR7dmlldy5vcHRpb25zLmlkfVwiIC0gcHJpb3JpdHk6ICR7dmlldy5wcmlvcml0eX1gKTtcbiAgICB2aWV3LnJlbW92ZSgpO1xuICAgIHN0YWNrLmRlbGV0ZSh2aWV3KTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4geyB0aGlzLl9zaG93TmV4dCgpOyB9LCAwKTtcbiAgfSxcblxuICAvKipcbiAgICogU2hvdyB0aGUgdmlldyB3aXRoIHRoZS5cbiAgICovXG4gIF9zaG93TmV4dCgpIHtcbiAgICBsZXQgdmlzaWJsZVZpZXc7XG4gICAgbGV0IHByaW9yaXR5ID0gLUluZmluaXR5O1xuICAgIGxldCBuZXh0VmlldyA9IG51bGw7XG5cbiAgICBzdGFjay5mb3JFYWNoKGZ1bmN0aW9uKHZpZXcpIHtcbiAgICAgIGlmICh2aWV3LmlzVmlzaWJsZSlcbiAgICAgICAgdmlzaWJsZVZpZXcgPSB0cnVlO1xuXG4gICAgICBpZiAodmlldy5wcmlvcml0eSA+IHByaW9yaXR5KSB7XG4gICAgICAgIHByaW9yaXR5ID0gdmlldy5wcmlvcml0eTtcbiAgICAgICAgbmV4dFZpZXcgPSB2aWV3O1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKG5leHRWaWV3KSB7XG4gICAgICBpZiAoIXZpc2libGVWaWV3wqB8fCAodmlzaWJsZVZpZXcucHJpb3JpdHkgPCBuZXh0Vmlldy5wcmlvcml0eSkpIHtcbiAgICAgICAgbG9nKGBuZXh0VmlldyAtIGlkOiBcIiR7bmV4dFZpZXcub3B0aW9ucy5pZH1cIiAtIHByaW9yaXR5OiAke3ByaW9yaXR5fWApO1xuICAgICAgICBuZXh0Vmlldy5zaG93KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy50aW1lb3V0SWQgPSBudWxsO1xuICB9LFxufTtcbiJdfQ==