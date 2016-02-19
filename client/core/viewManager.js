'use strict';

var _Set = require('babel-runtime/core-js/set')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var log = (0, _debug2['default'])('soundworks:viewManager');
var _stack = new _Set();
var _$container = null;

/**
 * Handle activities' (services and scenes) views according to their priorities.
 */
exports['default'] = {
  _timeoutId: null,

  /**
   * Register a view into the stack of views to display. The fact that the view is
   * actually displayed is defined by its priority and activities lifecycle.
   * @param {View} view - A view to add to the stack.
   */
  register: function register(view) {
    var _this = this;

    log('register - id: "' + view.options.id + '" - priority: ' + view.priority);

    _stack.add(view);
    view.hide();
    view.appendTo(_$container);

    // trigger `_updateView` only once when several view are registered at once.
    if (!this._timeoutId) this.timeoutId = setTimeout(function () {
      _this._updateView();
    }, 0);
  },

  /**
   * Remove view from the stack of views to display.
   * @param {View} view - A view to remove from the stack.
   */
  remove: function remove(view) {
    var _this2 = this;

    log('remove - id: "' + view.options.id + '" - priority: ' + view.priority);

    view.remove();
    _stack['delete'](view);

    setTimeout(function () {
      _this2._updateView();
    }, 0);
  },

  /**
   * Sets the container of the views for all `Activity` instances. Is called by
   * {@link src/client/core/client.js~client}) during application bootstrap.
   * @param {Element} $el - The element to use as a container for the module's view.
   * @private
   */
  setViewContainer: function setViewContainer($el) {
    _$container = $el;
  },

  /**
   * Defines if the view should be updated according to defined priorities.
   * @private
   */
  _updateView: function _updateView() {
    var visibleView = undefined;
    var priority = -Infinity;
    var nextView = null;

    _stack.forEach(function (view) {
      if (view.isVisible) visibleView = true;

      if (view.priority > priority) {
        priority = view.priority;
        nextView = view;
      }
    });

    if (nextView) {
      if (!visibleView) {
        log('update view - id: "' + nextView.options.id + '" - priority: ' + priority);

        nextView.show();
      } else if (visibleView.priority < nextView.priority) {
        log('update view - id: "' + nextView.options.id + '" - priority: ' + priority);

        visibleView.hide(); // hide but keep in stack
        nextView.show();
      }
    }

    this.timeoutId = null;
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY29yZS92aWV3TWFuYWdlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O3FCQUFrQixPQUFPOzs7O0FBRXpCLElBQU0sR0FBRyxHQUFHLHdCQUFNLHdCQUF3QixDQUFDLENBQUM7QUFDNUMsSUFBTSxNQUFNLEdBQUcsVUFBUyxDQUFDO0FBQ3pCLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQzs7Ozs7cUJBS1I7QUFDYixZQUFVLEVBQUUsSUFBSTs7Ozs7OztBQU9oQixVQUFRLEVBQUEsa0JBQUMsSUFBSSxFQUFFOzs7QUFDYixPQUFHLHNCQUFvQixJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsc0JBQWlCLElBQUksQ0FBQyxRQUFRLENBQUcsQ0FBQzs7QUFFeEUsVUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqQixRQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWixRQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDOzs7QUFHM0IsUUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQ2xCLElBQUksQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUFDLFlBQU07QUFBRSxZQUFLLFdBQVcsRUFBRSxDQUFDO0tBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztHQUNqRTs7Ozs7O0FBTUQsUUFBTSxFQUFBLGdCQUFDLElBQUksRUFBRTs7O0FBQ1gsT0FBRyxvQkFBa0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLHNCQUFpQixJQUFJLENBQUMsUUFBUSxDQUFHLENBQUM7O0FBRXRFLFFBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNkLFVBQU0sVUFBTyxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVwQixjQUFVLENBQUMsWUFBTTtBQUFFLGFBQUssV0FBVyxFQUFFLENBQUM7S0FBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0dBQzlDOzs7Ozs7OztBQVFELGtCQUFnQixFQUFBLDBCQUFDLEdBQUcsRUFBRTtBQUNwQixlQUFXLEdBQUcsR0FBRyxDQUFDO0dBQ25COzs7Ozs7QUFNRCxhQUFXLEVBQUEsdUJBQUc7QUFDWixRQUFJLFdBQVcsWUFBQSxDQUFDO0FBQ2hCLFFBQUksUUFBUSxHQUFHLENBQUMsUUFBUSxDQUFDO0FBQ3pCLFFBQUksUUFBUSxHQUFHLElBQUksQ0FBQzs7QUFFcEIsVUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFTLElBQUksRUFBRTtBQUM1QixVQUFJLElBQUksQ0FBQyxTQUFTLEVBQ2hCLFdBQVcsR0FBRyxJQUFJLENBQUM7O0FBRXJCLFVBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLEVBQUU7QUFDNUIsZ0JBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQ3pCLGdCQUFRLEdBQUcsSUFBSSxDQUFDO09BQ2pCO0tBQ0YsQ0FBQyxDQUFDOztBQUVILFFBQUksUUFBUSxFQUFFO0FBQ1osVUFBSSxDQUFDLFdBQVcsRUFBRTtBQUNoQixXQUFHLHlCQUF1QixRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsc0JBQWlCLFFBQVEsQ0FBRyxDQUFDOztBQUUxRSxnQkFBUSxDQUFDLElBQUksRUFBRSxDQUFDO09BQ2pCLE1BQU0sSUFBSSxXQUFXLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxRQUFRLEVBQUU7QUFDbkQsV0FBRyx5QkFBdUIsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLHNCQUFpQixRQUFRLENBQUcsQ0FBQzs7QUFFMUUsbUJBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNuQixnQkFBUSxDQUFDLElBQUksRUFBRSxDQUFDO09BQ2pCO0tBQ0Y7O0FBRUQsUUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7R0FDdkI7Q0FDRiIsImZpbGUiOiJzcmMvY2xpZW50L2NvcmUvdmlld01hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZGVidWcgZnJvbSAnZGVidWcnO1xuXG5jb25zdCBsb2cgPSBkZWJ1Zygnc291bmR3b3Jrczp2aWV3TWFuYWdlcicpO1xuY29uc3QgX3N0YWNrID0gbmV3IFNldCgpO1xubGV0IF8kY29udGFpbmVyID0gbnVsbDtcblxuLyoqXG4gKiBIYW5kbGUgYWN0aXZpdGllcycgKHNlcnZpY2VzIGFuZCBzY2VuZXMpIHZpZXdzIGFjY29yZGluZyB0byB0aGVpciBwcmlvcml0aWVzLlxuICovXG5leHBvcnQgZGVmYXVsdCB7XG4gIF90aW1lb3V0SWQ6IG51bGwsXG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgdmlldyBpbnRvIHRoZSBzdGFjayBvZiB2aWV3cyB0byBkaXNwbGF5LiBUaGUgZmFjdCB0aGF0IHRoZSB2aWV3IGlzXG4gICAqIGFjdHVhbGx5IGRpc3BsYXllZCBpcyBkZWZpbmVkIGJ5IGl0cyBwcmlvcml0eSBhbmQgYWN0aXZpdGllcyBsaWZlY3ljbGUuXG4gICAqIEBwYXJhbSB7Vmlld30gdmlldyAtIEEgdmlldyB0byBhZGQgdG8gdGhlIHN0YWNrLlxuICAgKi9cbiAgcmVnaXN0ZXIodmlldykge1xuICAgIGxvZyhgcmVnaXN0ZXIgLSBpZDogXCIke3ZpZXcub3B0aW9ucy5pZH1cIiAtIHByaW9yaXR5OiAke3ZpZXcucHJpb3JpdHl9YCk7XG5cbiAgICBfc3RhY2suYWRkKHZpZXcpO1xuICAgIHZpZXcuaGlkZSgpO1xuICAgIHZpZXcuYXBwZW5kVG8oXyRjb250YWluZXIpO1xuXG4gICAgLy8gdHJpZ2dlciBgX3VwZGF0ZVZpZXdgIG9ubHkgb25jZSB3aGVuIHNldmVyYWwgdmlldyBhcmUgcmVnaXN0ZXJlZCBhdCBvbmNlLlxuICAgIGlmICghdGhpcy5fdGltZW91dElkKVxuICAgICAgdGhpcy50aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHsgdGhpcy5fdXBkYXRlVmlldygpOyB9LCAwKTtcbiAgfSxcblxuICAvKipcbiAgICogUmVtb3ZlIHZpZXcgZnJvbSB0aGUgc3RhY2sgb2Ygdmlld3MgdG8gZGlzcGxheS5cbiAgICogQHBhcmFtIHtWaWV3fSB2aWV3IC0gQSB2aWV3IHRvIHJlbW92ZSBmcm9tIHRoZSBzdGFjay5cbiAgICovXG4gIHJlbW92ZSh2aWV3KSB7XG4gICAgbG9nKGByZW1vdmUgLSBpZDogXCIke3ZpZXcub3B0aW9ucy5pZH1cIiAtIHByaW9yaXR5OiAke3ZpZXcucHJpb3JpdHl9YCk7XG5cbiAgICB2aWV3LnJlbW92ZSgpO1xuICAgIF9zdGFjay5kZWxldGUodmlldyk7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHsgdGhpcy5fdXBkYXRlVmlldygpOyB9LCAwKTtcbiAgfSxcblxuICAvKipcbiAgICogU2V0cyB0aGUgY29udGFpbmVyIG9mIHRoZSB2aWV3cyBmb3IgYWxsIGBBY3Rpdml0eWAgaW5zdGFuY2VzLiBJcyBjYWxsZWQgYnlcbiAgICoge0BsaW5rIHNyYy9jbGllbnQvY29yZS9jbGllbnQuanN+Y2xpZW50fSkgZHVyaW5nIGFwcGxpY2F0aW9uIGJvb3RzdHJhcC5cbiAgICogQHBhcmFtIHtFbGVtZW50fSAkZWwgLSBUaGUgZWxlbWVudCB0byB1c2UgYXMgYSBjb250YWluZXIgZm9yIHRoZSBtb2R1bGUncyB2aWV3LlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0Vmlld0NvbnRhaW5lcigkZWwpIHtcbiAgICBfJGNvbnRhaW5lciA9ICRlbDtcbiAgfSxcblxuICAvKipcbiAgICogRGVmaW5lcyBpZiB0aGUgdmlldyBzaG91bGQgYmUgdXBkYXRlZCBhY2NvcmRpbmcgdG8gZGVmaW5lZCBwcmlvcml0aWVzLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3VwZGF0ZVZpZXcoKSB7XG4gICAgbGV0IHZpc2libGVWaWV3O1xuICAgIGxldCBwcmlvcml0eSA9IC1JbmZpbml0eTtcbiAgICBsZXQgbmV4dFZpZXcgPSBudWxsO1xuXG4gICAgX3N0YWNrLmZvckVhY2goZnVuY3Rpb24odmlldykge1xuICAgICAgaWYgKHZpZXcuaXNWaXNpYmxlKVxuICAgICAgICB2aXNpYmxlVmlldyA9IHRydWU7XG5cbiAgICAgIGlmICh2aWV3LnByaW9yaXR5ID4gcHJpb3JpdHkpIHtcbiAgICAgICAgcHJpb3JpdHkgPSB2aWV3LnByaW9yaXR5O1xuICAgICAgICBuZXh0VmlldyA9IHZpZXc7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAobmV4dFZpZXcpIHtcbiAgICAgIGlmICghdmlzaWJsZVZpZXcpIHtcbiAgICAgICAgbG9nKGB1cGRhdGUgdmlldyAtIGlkOiBcIiR7bmV4dFZpZXcub3B0aW9ucy5pZH1cIiAtIHByaW9yaXR5OiAke3ByaW9yaXR5fWApO1xuXG4gICAgICAgIG5leHRWaWV3LnNob3coKTtcbiAgICAgIH0gZWxzZSBpZiAodmlzaWJsZVZpZXcucHJpb3JpdHkgPCBuZXh0Vmlldy5wcmlvcml0eSkge1xuICAgICAgICBsb2coYHVwZGF0ZSB2aWV3IC0gaWQ6IFwiJHtuZXh0Vmlldy5vcHRpb25zLmlkfVwiIC0gcHJpb3JpdHk6ICR7cHJpb3JpdHl9YCk7XG5cbiAgICAgICAgdmlzaWJsZVZpZXcuaGlkZSgpOyAvLyBoaWRlIGJ1dCBrZWVwIGluIHN0YWNrXG4gICAgICAgIG5leHRWaWV3LnNob3coKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnRpbWVvdXRJZCA9IG51bGw7XG4gIH0sXG59O1xuIl19