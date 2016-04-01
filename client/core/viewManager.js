'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _debug2.default)('soundworks:viewManager');
var _stack = new _set2.default();
var _$container = null;

/**
 * Handle activities' (services and scenes) views according to their priorities.
 */
var viewManager = {
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
    _stack.delete(view);

    setTimeout(function () {
      _this2._updateView();
    }, 0);
  },


  /**
   * Sets the container of the views for all `Activity` instances. Is called by
   * {@link src/client/core/client.js~client}) during application bootstrap.
   * @param {Element} $el - The element to use as a container for the view.
   * @private
   */
  setViewContainer: function setViewContainer($el) {
    _$container = $el;
  },


  /**
   * Defines whether the view should be updated according to defined priorities.
   * @private
   */
  _updateView: function _updateView() {
    var visibleView = void 0;
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

exports.default = viewManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZXdNYW5hZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBRUEsSUFBTSxNQUFNLHFCQUFNLHdCQUFOLENBQU47QUFDTixJQUFNLFNBQVMsbUJBQVQ7QUFDTixJQUFJLGNBQWMsSUFBZDs7Ozs7QUFLSixJQUFNLGNBQWM7QUFDbEIsY0FBWSxJQUFaOzs7Ozs7O0FBT0EsOEJBQVMsTUFBTTs7O0FBQ2IsNkJBQXVCLEtBQUssT0FBTCxDQUFhLEVBQWIsc0JBQWdDLEtBQUssUUFBTCxDQUF2RCxDQURhOztBQUdiLFdBQU8sR0FBUCxDQUFXLElBQVgsRUFIYTtBQUliLFNBQUssSUFBTCxHQUphO0FBS2IsU0FBSyxRQUFMLENBQWMsV0FBZDs7O0FBTGEsUUFRVCxDQUFDLEtBQUssVUFBTCxFQUNILEtBQUssU0FBTCxHQUFpQixXQUFXLFlBQU07QUFBRSxZQUFLLFdBQUwsR0FBRjtLQUFOLEVBQStCLENBQTFDLENBQWpCLENBREY7R0FoQmdCOzs7Ozs7O0FBd0JsQiwwQkFBTyxNQUFNOzs7QUFDWCwyQkFBcUIsS0FBSyxPQUFMLENBQWEsRUFBYixzQkFBZ0MsS0FBSyxRQUFMLENBQXJELENBRFc7O0FBR1gsU0FBSyxNQUFMLEdBSFc7QUFJWCxXQUFPLE1BQVAsQ0FBYyxJQUFkLEVBSlc7O0FBTVgsZUFBVyxZQUFNO0FBQUUsYUFBSyxXQUFMLEdBQUY7S0FBTixFQUErQixDQUExQyxFQU5XO0dBeEJLOzs7Ozs7Ozs7QUF1Q2xCLDhDQUFpQixLQUFLO0FBQ3BCLGtCQUFjLEdBQWQsQ0FEb0I7R0F2Q0o7Ozs7Ozs7QUErQ2xCLHNDQUFjO0FBQ1osUUFBSSxvQkFBSixDQURZO0FBRVosUUFBSSxXQUFXLENBQUMsUUFBRCxDQUZIO0FBR1osUUFBSSxXQUFXLElBQVgsQ0FIUTs7QUFLWixXQUFPLE9BQVAsQ0FBZSxVQUFTLElBQVQsRUFBZTtBQUM1QixVQUFJLEtBQUssU0FBTCxFQUNGLGNBQWMsSUFBZCxDQURGOztBQUdBLFVBQUksS0FBSyxRQUFMLEdBQWdCLFFBQWhCLEVBQTBCO0FBQzVCLG1CQUFXLEtBQUssUUFBTCxDQURpQjtBQUU1QixtQkFBVyxJQUFYLENBRjRCO09BQTlCO0tBSmEsQ0FBZixDQUxZOztBQWVaLFFBQUksUUFBSixFQUFjO0FBQ1osVUFBSSxDQUFDLFdBQUQsRUFBYztBQUNoQixvQ0FBMEIsU0FBUyxPQUFULENBQWlCLEVBQWpCLHNCQUFvQyxRQUE5RCxFQURnQjs7QUFHaEIsaUJBQVMsSUFBVCxHQUhnQjtPQUFsQixNQUlPLElBQUksWUFBWSxRQUFaLEdBQXVCLFNBQVMsUUFBVCxFQUFtQjtBQUNuRCxvQ0FBMEIsU0FBUyxPQUFULENBQWlCLEVBQWpCLHNCQUFvQyxRQUE5RCxFQURtRDs7QUFHbkQsb0JBQVksSUFBWjtBQUhtRCxnQkFJbkQsQ0FBUyxJQUFULEdBSm1EO09BQTlDO0tBTFQ7O0FBYUEsU0FBSyxTQUFMLEdBQWlCLElBQWpCLENBNUJZO0dBL0NJO0NBQWQ7O2tCQStFUyIsImZpbGUiOiJ2aWV3TWFuYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5cbmNvbnN0IGxvZyA9IGRlYnVnKCdzb3VuZHdvcmtzOnZpZXdNYW5hZ2VyJyk7XG5jb25zdCBfc3RhY2sgPSBuZXcgU2V0KCk7XG5sZXQgXyRjb250YWluZXIgPSBudWxsO1xuXG4vKipcbiAqIEhhbmRsZSBhY3Rpdml0aWVzJyAoc2VydmljZXMgYW5kIHNjZW5lcykgdmlld3MgYWNjb3JkaW5nIHRvIHRoZWlyIHByaW9yaXRpZXMuXG4gKi9cbmNvbnN0IHZpZXdNYW5hZ2VyID0ge1xuICBfdGltZW91dElkOiBudWxsLFxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIHZpZXcgaW50byB0aGUgc3RhY2sgb2Ygdmlld3MgdG8gZGlzcGxheS4gVGhlIGZhY3QgdGhhdCB0aGUgdmlldyBpc1xuICAgKiBhY3R1YWxseSBkaXNwbGF5ZWQgaXMgZGVmaW5lZCBieSBpdHMgcHJpb3JpdHkgYW5kIGFjdGl2aXRpZXMgbGlmZWN5Y2xlLlxuICAgKiBAcGFyYW0ge1ZpZXd9IHZpZXcgLSBBIHZpZXcgdG8gYWRkIHRvIHRoZSBzdGFjay5cbiAgICovXG4gIHJlZ2lzdGVyKHZpZXcpIHtcbiAgICBsb2coYHJlZ2lzdGVyIC0gaWQ6IFwiJHt2aWV3Lm9wdGlvbnMuaWR9XCIgLSBwcmlvcml0eTogJHt2aWV3LnByaW9yaXR5fWApO1xuXG4gICAgX3N0YWNrLmFkZCh2aWV3KTtcbiAgICB2aWV3LmhpZGUoKTtcbiAgICB2aWV3LmFwcGVuZFRvKF8kY29udGFpbmVyKTtcblxuICAgIC8vIHRyaWdnZXIgYF91cGRhdGVWaWV3YCBvbmx5IG9uY2Ugd2hlbiBzZXZlcmFsIHZpZXcgYXJlIHJlZ2lzdGVyZWQgYXQgb25jZS5cbiAgICBpZiAoIXRoaXMuX3RpbWVvdXRJZClcbiAgICAgIHRoaXMudGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiB7IHRoaXMuX3VwZGF0ZVZpZXcoKTsgfSwgMCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlbW92ZSB2aWV3IGZyb20gdGhlIHN0YWNrIG9mIHZpZXdzIHRvIGRpc3BsYXkuXG4gICAqIEBwYXJhbSB7Vmlld30gdmlldyAtIEEgdmlldyB0byByZW1vdmUgZnJvbSB0aGUgc3RhY2suXG4gICAqL1xuICByZW1vdmUodmlldykge1xuICAgIGxvZyhgcmVtb3ZlIC0gaWQ6IFwiJHt2aWV3Lm9wdGlvbnMuaWR9XCIgLSBwcmlvcml0eTogJHt2aWV3LnByaW9yaXR5fWApO1xuXG4gICAgdmlldy5yZW1vdmUoKTtcbiAgICBfc3RhY2suZGVsZXRlKHZpZXcpO1xuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7IHRoaXMuX3VwZGF0ZVZpZXcoKTsgfSwgMCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGNvbnRhaW5lciBvZiB0aGUgdmlld3MgZm9yIGFsbCBgQWN0aXZpdHlgIGluc3RhbmNlcy4gSXMgY2FsbGVkIGJ5XG4gICAqIHtAbGluayBzcmMvY2xpZW50L2NvcmUvY2xpZW50LmpzfmNsaWVudH0pIGR1cmluZyBhcHBsaWNhdGlvbiBib290c3RyYXAuXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGVsIC0gVGhlIGVsZW1lbnQgdG8gdXNlIGFzIGEgY29udGFpbmVyIGZvciB0aGUgdmlldy5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNldFZpZXdDb250YWluZXIoJGVsKSB7XG4gICAgXyRjb250YWluZXIgPSAkZWw7XG4gIH0sXG5cbiAgLyoqXG4gICAqIERlZmluZXMgd2hldGhlciB0aGUgdmlldyBzaG91bGQgYmUgdXBkYXRlZCBhY2NvcmRpbmcgdG8gZGVmaW5lZCBwcmlvcml0aWVzLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3VwZGF0ZVZpZXcoKSB7XG4gICAgbGV0IHZpc2libGVWaWV3O1xuICAgIGxldCBwcmlvcml0eSA9IC1JbmZpbml0eTtcbiAgICBsZXQgbmV4dFZpZXcgPSBudWxsO1xuXG4gICAgX3N0YWNrLmZvckVhY2goZnVuY3Rpb24odmlldykge1xuICAgICAgaWYgKHZpZXcuaXNWaXNpYmxlKVxuICAgICAgICB2aXNpYmxlVmlldyA9IHRydWU7XG5cbiAgICAgIGlmICh2aWV3LnByaW9yaXR5ID4gcHJpb3JpdHkpIHtcbiAgICAgICAgcHJpb3JpdHkgPSB2aWV3LnByaW9yaXR5O1xuICAgICAgICBuZXh0VmlldyA9IHZpZXc7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAobmV4dFZpZXcpIHtcbiAgICAgIGlmICghdmlzaWJsZVZpZXcpIHtcbiAgICAgICAgbG9nKGB1cGRhdGUgdmlldyAtIGlkOiBcIiR7bmV4dFZpZXcub3B0aW9ucy5pZH1cIiAtIHByaW9yaXR5OiAke3ByaW9yaXR5fWApO1xuXG4gICAgICAgIG5leHRWaWV3LnNob3coKTtcbiAgICAgIH0gZWxzZSBpZiAodmlzaWJsZVZpZXcucHJpb3JpdHkgPCBuZXh0Vmlldy5wcmlvcml0eSkge1xuICAgICAgICBsb2coYHVwZGF0ZSB2aWV3IC0gaWQ6IFwiJHtuZXh0Vmlldy5vcHRpb25zLmlkfVwiIC0gcHJpb3JpdHk6ICR7cHJpb3JpdHl9YCk7XG5cbiAgICAgICAgdmlzaWJsZVZpZXcuaGlkZSgpOyAvLyBoaWRlIGJ1dCBrZWVwIGluIHN0YWNrXG4gICAgICAgIG5leHRWaWV3LnNob3coKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnRpbWVvdXRJZCA9IG51bGw7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCB2aWV3TWFuYWdlcjtcbiJdfQ==