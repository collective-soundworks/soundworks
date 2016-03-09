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
exports.default = {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZXdNYW5hZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBRUEsSUFBTSxNQUFNLHFCQUFNLHdCQUFOLENBQU47QUFDTixJQUFNLFNBQVMsbUJBQVQ7QUFDTixJQUFJLGNBQWMsSUFBZDs7Ozs7a0JBS1c7QUFDYixjQUFZLElBQVo7Ozs7Ozs7QUFPQSw4QkFBUyxNQUFNOzs7QUFDYiw2QkFBdUIsS0FBSyxPQUFMLENBQWEsRUFBYixzQkFBZ0MsS0FBSyxRQUFMLENBQXZELENBRGE7O0FBR2IsV0FBTyxHQUFQLENBQVcsSUFBWCxFQUhhO0FBSWIsU0FBSyxJQUFMLEdBSmE7QUFLYixTQUFLLFFBQUwsQ0FBYyxXQUFkOzs7QUFMYSxRQVFULENBQUMsS0FBSyxVQUFMLEVBQ0gsS0FBSyxTQUFMLEdBQWlCLFdBQVcsWUFBTTtBQUFFLFlBQUssV0FBTCxHQUFGO0tBQU4sRUFBK0IsQ0FBMUMsQ0FBakIsQ0FERjtHQWhCVzs7Ozs7OztBQXdCYiwwQkFBTyxNQUFNOzs7QUFDWCwyQkFBcUIsS0FBSyxPQUFMLENBQWEsRUFBYixzQkFBZ0MsS0FBSyxRQUFMLENBQXJELENBRFc7O0FBR1gsU0FBSyxNQUFMLEdBSFc7QUFJWCxXQUFPLE1BQVAsQ0FBYyxJQUFkLEVBSlc7O0FBTVgsZUFBVyxZQUFNO0FBQUUsYUFBSyxXQUFMLEdBQUY7S0FBTixFQUErQixDQUExQyxFQU5XO0dBeEJBOzs7Ozs7Ozs7QUF1Q2IsOENBQWlCLEtBQUs7QUFDcEIsa0JBQWMsR0FBZCxDQURvQjtHQXZDVDs7Ozs7OztBQStDYixzQ0FBYztBQUNaLFFBQUksb0JBQUosQ0FEWTtBQUVaLFFBQUksV0FBVyxDQUFDLFFBQUQsQ0FGSDtBQUdaLFFBQUksV0FBVyxJQUFYLENBSFE7O0FBS1osV0FBTyxPQUFQLENBQWUsVUFBUyxJQUFULEVBQWU7QUFDNUIsVUFBSSxLQUFLLFNBQUwsRUFDRixjQUFjLElBQWQsQ0FERjs7QUFHQSxVQUFJLEtBQUssUUFBTCxHQUFnQixRQUFoQixFQUEwQjtBQUM1QixtQkFBVyxLQUFLLFFBQUwsQ0FEaUI7QUFFNUIsbUJBQVcsSUFBWCxDQUY0QjtPQUE5QjtLQUphLENBQWYsQ0FMWTs7QUFlWixRQUFJLFFBQUosRUFBYztBQUNaLFVBQUksQ0FBQyxXQUFELEVBQWM7QUFDaEIsb0NBQTBCLFNBQVMsT0FBVCxDQUFpQixFQUFqQixzQkFBb0MsUUFBOUQsRUFEZ0I7O0FBR2hCLGlCQUFTLElBQVQsR0FIZ0I7T0FBbEIsTUFJTyxJQUFJLFlBQVksUUFBWixHQUF1QixTQUFTLFFBQVQsRUFBbUI7QUFDbkQsb0NBQTBCLFNBQVMsT0FBVCxDQUFpQixFQUFqQixzQkFBb0MsUUFBOUQsRUFEbUQ7O0FBR25ELG9CQUFZLElBQVo7QUFIbUQsZ0JBSW5ELENBQVMsSUFBVCxHQUptRDtPQUE5QztLQUxUOztBQWFBLFNBQUssU0FBTCxHQUFpQixJQUFqQixDQTVCWTtHQS9DRCIsImZpbGUiOiJ2aWV3TWFuYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5cbmNvbnN0IGxvZyA9IGRlYnVnKCdzb3VuZHdvcmtzOnZpZXdNYW5hZ2VyJyk7XG5jb25zdCBfc3RhY2sgPSBuZXcgU2V0KCk7XG5sZXQgXyRjb250YWluZXIgPSBudWxsO1xuXG4vKipcbiAqIEhhbmRsZSBhY3Rpdml0aWVzJyAoc2VydmljZXMgYW5kIHNjZW5lcykgdmlld3MgYWNjb3JkaW5nIHRvIHRoZWlyIHByaW9yaXRpZXMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IHtcbiAgX3RpbWVvdXRJZDogbnVsbCxcblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSB2aWV3IGludG8gdGhlIHN0YWNrIG9mIHZpZXdzIHRvIGRpc3BsYXkuIFRoZSBmYWN0IHRoYXQgdGhlIHZpZXcgaXNcbiAgICogYWN0dWFsbHkgZGlzcGxheWVkIGlzIGRlZmluZWQgYnkgaXRzIHByaW9yaXR5IGFuZCBhY3Rpdml0aWVzIGxpZmVjeWNsZS5cbiAgICogQHBhcmFtIHtWaWV3fSB2aWV3IC0gQSB2aWV3IHRvIGFkZCB0byB0aGUgc3RhY2suXG4gICAqL1xuICByZWdpc3Rlcih2aWV3KSB7XG4gICAgbG9nKGByZWdpc3RlciAtIGlkOiBcIiR7dmlldy5vcHRpb25zLmlkfVwiIC0gcHJpb3JpdHk6ICR7dmlldy5wcmlvcml0eX1gKTtcblxuICAgIF9zdGFjay5hZGQodmlldyk7XG4gICAgdmlldy5oaWRlKCk7XG4gICAgdmlldy5hcHBlbmRUbyhfJGNvbnRhaW5lcik7XG5cbiAgICAvLyB0cmlnZ2VyIGBfdXBkYXRlVmlld2Agb25seSBvbmNlIHdoZW4gc2V2ZXJhbCB2aWV3IGFyZSByZWdpc3RlcmVkIGF0IG9uY2UuXG4gICAgaWYgKCF0aGlzLl90aW1lb3V0SWQpXG4gICAgICB0aGlzLnRpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4geyB0aGlzLl91cGRhdGVWaWV3KCk7IH0sIDApO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZW1vdmUgdmlldyBmcm9tIHRoZSBzdGFjayBvZiB2aWV3cyB0byBkaXNwbGF5LlxuICAgKiBAcGFyYW0ge1ZpZXd9IHZpZXcgLSBBIHZpZXcgdG8gcmVtb3ZlIGZyb20gdGhlIHN0YWNrLlxuICAgKi9cbiAgcmVtb3ZlKHZpZXcpIHtcbiAgICBsb2coYHJlbW92ZSAtIGlkOiBcIiR7dmlldy5vcHRpb25zLmlkfVwiIC0gcHJpb3JpdHk6ICR7dmlldy5wcmlvcml0eX1gKTtcblxuICAgIHZpZXcucmVtb3ZlKCk7XG4gICAgX3N0YWNrLmRlbGV0ZSh2aWV3KTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4geyB0aGlzLl91cGRhdGVWaWV3KCk7IH0sIDApO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBjb250YWluZXIgb2YgdGhlIHZpZXdzIGZvciBhbGwgYEFjdGl2aXR5YCBpbnN0YW5jZXMuIElzIGNhbGxlZCBieVxuICAgKiB7QGxpbmsgc3JjL2NsaWVudC9jb3JlL2NsaWVudC5qc35jbGllbnR9KSBkdXJpbmcgYXBwbGljYXRpb24gYm9vdHN0cmFwLlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRlbCAtIFRoZSBlbGVtZW50IHRvIHVzZSBhcyBhIGNvbnRhaW5lciBmb3IgdGhlIG1vZHVsZSdzIHZpZXcuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZXRWaWV3Q29udGFpbmVyKCRlbCkge1xuICAgIF8kY29udGFpbmVyID0gJGVsO1xuICB9LFxuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGlmIHRoZSB2aWV3IHNob3VsZCBiZSB1cGRhdGVkIGFjY29yZGluZyB0byBkZWZpbmVkIHByaW9yaXRpZXMuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfdXBkYXRlVmlldygpIHtcbiAgICBsZXQgdmlzaWJsZVZpZXc7XG4gICAgbGV0IHByaW9yaXR5ID0gLUluZmluaXR5O1xuICAgIGxldCBuZXh0VmlldyA9IG51bGw7XG5cbiAgICBfc3RhY2suZm9yRWFjaChmdW5jdGlvbih2aWV3KSB7XG4gICAgICBpZiAodmlldy5pc1Zpc2libGUpXG4gICAgICAgIHZpc2libGVWaWV3ID0gdHJ1ZTtcblxuICAgICAgaWYgKHZpZXcucHJpb3JpdHkgPiBwcmlvcml0eSkge1xuICAgICAgICBwcmlvcml0eSA9IHZpZXcucHJpb3JpdHk7XG4gICAgICAgIG5leHRWaWV3ID0gdmlldztcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChuZXh0Vmlldykge1xuICAgICAgaWYgKCF2aXNpYmxlVmlldykge1xuICAgICAgICBsb2coYHVwZGF0ZSB2aWV3IC0gaWQ6IFwiJHtuZXh0Vmlldy5vcHRpb25zLmlkfVwiIC0gcHJpb3JpdHk6ICR7cHJpb3JpdHl9YCk7XG5cbiAgICAgICAgbmV4dFZpZXcuc2hvdygpO1xuICAgICAgfSBlbHNlIGlmICh2aXNpYmxlVmlldy5wcmlvcml0eSA8IG5leHRWaWV3LnByaW9yaXR5KSB7XG4gICAgICAgIGxvZyhgdXBkYXRlIHZpZXcgLSBpZDogXCIke25leHRWaWV3Lm9wdGlvbnMuaWR9XCIgLSBwcmlvcml0eTogJHtwcmlvcml0eX1gKTtcblxuICAgICAgICB2aXNpYmxlVmlldy5oaWRlKCk7IC8vIGhpZGUgYnV0IGtlZXAgaW4gc3RhY2tcbiAgICAgICAgbmV4dFZpZXcuc2hvdygpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMudGltZW91dElkID0gbnVsbDtcbiAgfSxcbn07XG4iXX0=