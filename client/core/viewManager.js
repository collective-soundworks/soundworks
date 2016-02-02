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
 * Handle services' views according to their priorities.
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
   * Sets the container of the views for all `Activity` instances. (is called in {@link client})
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY29yZS92aWV3TWFuYWdlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O3FCQUFrQixPQUFPOzs7O0FBRXpCLElBQU0sR0FBRyxHQUFHLHdCQUFNLHdCQUF3QixDQUFDLENBQUM7QUFDNUMsSUFBTSxNQUFNLEdBQUcsVUFBUyxDQUFDO0FBQ3pCLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQzs7Ozs7cUJBS1I7QUFDYixZQUFVLEVBQUUsSUFBSTs7Ozs7OztBQU9oQixVQUFRLEVBQUEsa0JBQUMsSUFBSSxFQUFFOzs7QUFDYixPQUFHLHNCQUFvQixJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsc0JBQWlCLElBQUksQ0FBQyxRQUFRLENBQUcsQ0FBQzs7QUFFeEUsVUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqQixRQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWixRQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUUzQixRQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFDbEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUMsWUFBTTtBQUFFLFlBQUssV0FBVyxFQUFFLENBQUM7S0FBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0dBQ2pFOzs7Ozs7QUFNRCxRQUFNLEVBQUEsZ0JBQUMsSUFBSSxFQUFFOzs7QUFDWCxPQUFHLG9CQUFrQixJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsc0JBQWlCLElBQUksQ0FBQyxRQUFRLENBQUcsQ0FBQztBQUN0RSxRQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDZCxVQUFNLFVBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFcEIsY0FBVSxDQUFDLFlBQU07QUFBRSxhQUFLLFdBQVcsRUFBRSxDQUFDO0tBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztHQUM5Qzs7Ozs7OztBQU9ELGtCQUFnQixFQUFBLDBCQUFDLEdBQUcsRUFBRTtBQUNwQixlQUFXLEdBQUcsR0FBRyxDQUFDO0dBQ25COzs7Ozs7QUFNRCxhQUFXLEVBQUEsdUJBQUc7QUFDWixRQUFJLFdBQVcsWUFBQSxDQUFDO0FBQ2hCLFFBQUksUUFBUSxHQUFHLENBQUMsUUFBUSxDQUFDO0FBQ3pCLFFBQUksUUFBUSxHQUFHLElBQUksQ0FBQzs7QUFFcEIsVUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFTLElBQUksRUFBRTtBQUM1QixVQUFJLElBQUksQ0FBQyxTQUFTLEVBQ2hCLFdBQVcsR0FBRyxJQUFJLENBQUM7O0FBRXJCLFVBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLEVBQUU7QUFDNUIsZ0JBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQ3pCLGdCQUFRLEdBQUcsSUFBSSxDQUFDO09BQ2pCO0tBQ0YsQ0FBQyxDQUFDOztBQUVILFFBQUksUUFBUSxFQUFFO0FBQ1osVUFBSSxDQUFDLFdBQVcsRUFBRTtBQUNoQixXQUFHLHlCQUF1QixRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsc0JBQWlCLFFBQVEsQ0FBRyxDQUFDO0FBQzFFLGdCQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7T0FDakIsTUFBTSxJQUFJLFdBQVcsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLFFBQVEsRUFBRTtBQUNuRCxXQUFHLHlCQUF1QixRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsc0JBQWlCLFFBQVEsQ0FBRyxDQUFDO0FBQzFFLG1CQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDbkIsZ0JBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztPQUNqQjtLQUNGOztBQUVELFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0dBQ3ZCO0NBQ0YiLCJmaWxlIjoic3JjL2NsaWVudC9jb3JlL3ZpZXdNYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGRlYnVnIGZyb20gJ2RlYnVnJztcblxuY29uc3QgbG9nID0gZGVidWcoJ3NvdW5kd29ya3M6dmlld01hbmFnZXInKTtcbmNvbnN0IF9zdGFjayA9IG5ldyBTZXQoKTtcbmxldCBfJGNvbnRhaW5lciA9IG51bGw7XG5cbi8qKlxuICogSGFuZGxlIHNlcnZpY2VzJyB2aWV3cyBhY2NvcmRpbmcgdG8gdGhlaXIgcHJpb3JpdGllcy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuICBfdGltZW91dElkOiBudWxsLFxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIHZpZXcgaW50byB0aGUgc3RhY2sgb2Ygdmlld3MgdG8gZGlzcGxheS4gVGhlIGZhY3QgdGhhdCB0aGUgdmlldyBpc1xuICAgKiBhY3R1YWxseSBkaXNwbGF5ZWQgaXMgZGVmaW5lZCBieSBpdHMgcHJpb3JpdHkgYW5kIGFjdGl2aXRpZXMgbGlmZWN5Y2xlLlxuICAgKiBAcGFyYW0ge1ZpZXd9IHZpZXcgLSBBIHZpZXcgdG8gYWRkIHRvIHRoZSBzdGFjay5cbiAgICovXG4gIHJlZ2lzdGVyKHZpZXcpIHtcbiAgICBsb2coYHJlZ2lzdGVyIC0gaWQ6IFwiJHt2aWV3Lm9wdGlvbnMuaWR9XCIgLSBwcmlvcml0eTogJHt2aWV3LnByaW9yaXR5fWApO1xuXG4gICAgX3N0YWNrLmFkZCh2aWV3KTtcbiAgICB2aWV3LmhpZGUoKTtcbiAgICB2aWV3LmFwcGVuZFRvKF8kY29udGFpbmVyKTtcblxuICAgIGlmICghdGhpcy5fdGltZW91dElkKVxuICAgICAgdGhpcy50aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHsgdGhpcy5fdXBkYXRlVmlldygpOyB9LCAwKTtcbiAgfSxcblxuICAvKipcbiAgICogUmVtb3ZlIHZpZXcgZnJvbSB0aGUgc3RhY2sgb2Ygdmlld3MgdG8gZGlzcGxheS5cbiAgICogQHBhcmFtIHtWaWV3fSB2aWV3IC0gQSB2aWV3IHRvIHJlbW92ZSBmcm9tIHRoZSBzdGFjay5cbiAgICovXG4gIHJlbW92ZSh2aWV3KSB7XG4gICAgbG9nKGByZW1vdmUgLSBpZDogXCIke3ZpZXcub3B0aW9ucy5pZH1cIiAtIHByaW9yaXR5OiAke3ZpZXcucHJpb3JpdHl9YCk7XG4gICAgdmlldy5yZW1vdmUoKTtcbiAgICBfc3RhY2suZGVsZXRlKHZpZXcpO1xuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7IHRoaXMuX3VwZGF0ZVZpZXcoKTsgfSwgMCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGNvbnRhaW5lciBvZiB0aGUgdmlld3MgZm9yIGFsbCBgQWN0aXZpdHlgIGluc3RhbmNlcy4gKGlzIGNhbGxlZCBpbiB7QGxpbmsgY2xpZW50fSlcbiAgICogQHBhcmFtIHtFbGVtZW50fSAkZWwgLSBUaGUgZWxlbWVudCB0byB1c2UgYXMgYSBjb250YWluZXIgZm9yIHRoZSBtb2R1bGUncyB2aWV3LlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0Vmlld0NvbnRhaW5lcigkZWwpIHtcbiAgICBfJGNvbnRhaW5lciA9ICRlbDtcbiAgfSxcblxuICAvKipcbiAgICogRGVmaW5lcyBpZiB0aGUgdmlldyBzaG91bGQgYmUgdXBkYXRlZCBhY2NvcmRpbmcgdG8gZGVmaW5lZCBwcmlvcml0aWVzLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3VwZGF0ZVZpZXcoKSB7XG4gICAgbGV0IHZpc2libGVWaWV3O1xuICAgIGxldCBwcmlvcml0eSA9IC1JbmZpbml0eTtcbiAgICBsZXQgbmV4dFZpZXcgPSBudWxsO1xuXG4gICAgX3N0YWNrLmZvckVhY2goZnVuY3Rpb24odmlldykge1xuICAgICAgaWYgKHZpZXcuaXNWaXNpYmxlKVxuICAgICAgICB2aXNpYmxlVmlldyA9IHRydWU7XG5cbiAgICAgIGlmICh2aWV3LnByaW9yaXR5ID4gcHJpb3JpdHkpIHtcbiAgICAgICAgcHJpb3JpdHkgPSB2aWV3LnByaW9yaXR5O1xuICAgICAgICBuZXh0VmlldyA9IHZpZXc7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAobmV4dFZpZXcpIHtcbiAgICAgIGlmICghdmlzaWJsZVZpZXcpIHtcbiAgICAgICAgbG9nKGB1cGRhdGUgdmlldyAtIGlkOiBcIiR7bmV4dFZpZXcub3B0aW9ucy5pZH1cIiAtIHByaW9yaXR5OiAke3ByaW9yaXR5fWApO1xuICAgICAgICBuZXh0Vmlldy5zaG93KCk7XG4gICAgICB9IGVsc2UgaWYgKHZpc2libGVWaWV3LnByaW9yaXR5IDwgbmV4dFZpZXcucHJpb3JpdHkpIHtcbiAgICAgICAgbG9nKGB1cGRhdGUgdmlldyAtIGlkOiBcIiR7bmV4dFZpZXcub3B0aW9ucy5pZH1cIiAtIHByaW9yaXR5OiAke3ByaW9yaXR5fWApO1xuICAgICAgICB2aXNpYmxlVmlldy5oaWRlKCk7IC8vIGhpZGUgYnV0IGtlZXAgaW4gc3RhY2tcbiAgICAgICAgbmV4dFZpZXcuc2hvdygpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMudGltZW91dElkID0gbnVsbDtcbiAgfSxcbn07XG4iXX0=