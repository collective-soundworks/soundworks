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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZXdNYW5hZ2VyLmpzIl0sIm5hbWVzIjpbImxvZyIsIl9zdGFjayIsIl8kY29udGFpbmVyIiwidmlld01hbmFnZXIiLCJfdGltZW91dElkIiwicmVnaXN0ZXIiLCJ2aWV3Iiwib3B0aW9ucyIsImlkIiwicHJpb3JpdHkiLCJhZGQiLCJoaWRlIiwiYXBwZW5kVG8iLCJ0aW1lb3V0SWQiLCJzZXRUaW1lb3V0IiwiX3VwZGF0ZVZpZXciLCJyZW1vdmUiLCJkZWxldGUiLCJzZXRWaWV3Q29udGFpbmVyIiwiJGVsIiwidmlzaWJsZVZpZXciLCJJbmZpbml0eSIsIm5leHRWaWV3IiwiZm9yRWFjaCIsImlzVmlzaWJsZSIsInNob3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBRUEsSUFBTUEsTUFBTSxxQkFBTSx3QkFBTixDQUFaO0FBQ0EsSUFBTUMsU0FBUyxtQkFBZjtBQUNBLElBQUlDLGNBQWMsSUFBbEI7O0FBRUE7OztBQUdBLElBQU1DLGNBQWM7QUFDbEJDLGNBQVksSUFETTs7QUFHbEI7Ozs7O0FBS0FDLFVBUmtCLG9CQVFUQyxJQVJTLEVBUUg7QUFBQTs7QUFDYk4sNkJBQXVCTSxLQUFLQyxPQUFMLENBQWFDLEVBQXBDLHNCQUF1REYsS0FBS0csUUFBNUQ7O0FBRUFSLFdBQU9TLEdBQVAsQ0FBV0osSUFBWDtBQUNBQSxTQUFLSyxJQUFMO0FBQ0FMLFNBQUtNLFFBQUwsQ0FBY1YsV0FBZDs7QUFFQTtBQUNBLFFBQUksQ0FBQyxLQUFLRSxVQUFWLEVBQ0UsS0FBS1MsU0FBTCxHQUFpQkMsV0FBVyxZQUFNO0FBQUUsWUFBS0MsV0FBTDtBQUFxQixLQUF4QyxFQUEwQyxDQUExQyxDQUFqQjtBQUNILEdBbEJpQjs7O0FBb0JsQjs7OztBQUlBQyxRQXhCa0Isa0JBd0JYVixJQXhCVyxFQXdCTDtBQUFBOztBQUNYTiwyQkFBcUJNLEtBQUtDLE9BQUwsQ0FBYUMsRUFBbEMsc0JBQXFERixLQUFLRyxRQUExRDs7QUFFQUgsU0FBS1UsTUFBTDtBQUNBZixXQUFPZ0IsTUFBUCxDQUFjWCxJQUFkOztBQUVBUSxlQUFXLFlBQU07QUFBRSxhQUFLQyxXQUFMO0FBQXFCLEtBQXhDLEVBQTBDLENBQTFDO0FBQ0QsR0EvQmlCOzs7QUFpQ2xCOzs7Ozs7QUFNQUcsa0JBdkNrQiw0QkF1Q0RDLEdBdkNDLEVBdUNJO0FBQ3BCakIsa0JBQWNpQixHQUFkO0FBQ0QsR0F6Q2lCOzs7QUEyQ2xCOzs7O0FBSUFKLGFBL0NrQix5QkErQ0o7QUFDWixRQUFJSyxvQkFBSjtBQUNBLFFBQUlYLFdBQVcsQ0FBQ1ksUUFBaEI7QUFDQSxRQUFJQyxXQUFXLElBQWY7O0FBRUFyQixXQUFPc0IsT0FBUCxDQUFlLFVBQVNqQixJQUFULEVBQWU7QUFDNUIsVUFBSUEsS0FBS2tCLFNBQVQsRUFDRUosY0FBYyxJQUFkOztBQUVGLFVBQUlkLEtBQUtHLFFBQUwsR0FBZ0JBLFFBQXBCLEVBQThCO0FBQzVCQSxtQkFBV0gsS0FBS0csUUFBaEI7QUFDQWEsbUJBQVdoQixJQUFYO0FBQ0Q7QUFDRixLQVJEOztBQVVBLFFBQUlnQixRQUFKLEVBQWM7QUFDWixVQUFJLENBQUNGLFdBQUwsRUFBa0I7QUFDaEJwQixvQ0FBMEJzQixTQUFTZixPQUFULENBQWlCQyxFQUEzQyxzQkFBOERDLFFBQTlEOztBQUVBYSxpQkFBU0csSUFBVDtBQUNELE9BSkQsTUFJTyxJQUFJTCxZQUFZWCxRQUFaLEdBQXVCYSxTQUFTYixRQUFwQyxFQUE4QztBQUNuRFQsb0NBQTBCc0IsU0FBU2YsT0FBVCxDQUFpQkMsRUFBM0Msc0JBQThEQyxRQUE5RDs7QUFFQVcsb0JBQVlULElBQVosR0FIbUQsQ0FHL0I7QUFDcEJXLGlCQUFTRyxJQUFUO0FBQ0Q7QUFDRjs7QUFFRCxTQUFLWixTQUFMLEdBQWlCLElBQWpCO0FBQ0Q7QUE1RWlCLENBQXBCOztrQkErRWVWLFciLCJmaWxlIjoidmlld01hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZGVidWcgZnJvbSAnZGVidWcnO1xuXG5jb25zdCBsb2cgPSBkZWJ1Zygnc291bmR3b3Jrczp2aWV3TWFuYWdlcicpO1xuY29uc3QgX3N0YWNrID0gbmV3IFNldCgpO1xubGV0IF8kY29udGFpbmVyID0gbnVsbDtcblxuLyoqXG4gKiBIYW5kbGUgYWN0aXZpdGllcycgKHNlcnZpY2VzIGFuZCBzY2VuZXMpIHZpZXdzIGFjY29yZGluZyB0byB0aGVpciBwcmlvcml0aWVzLlxuICovXG5jb25zdCB2aWV3TWFuYWdlciA9IHtcbiAgX3RpbWVvdXRJZDogbnVsbCxcblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSB2aWV3IGludG8gdGhlIHN0YWNrIG9mIHZpZXdzIHRvIGRpc3BsYXkuIFRoZSBmYWN0IHRoYXQgdGhlIHZpZXcgaXNcbiAgICogYWN0dWFsbHkgZGlzcGxheWVkIGlzIGRlZmluZWQgYnkgaXRzIHByaW9yaXR5IGFuZCBhY3Rpdml0aWVzIGxpZmVjeWNsZS5cbiAgICogQHBhcmFtIHtWaWV3fSB2aWV3IC0gQSB2aWV3IHRvIGFkZCB0byB0aGUgc3RhY2suXG4gICAqL1xuICByZWdpc3Rlcih2aWV3KSB7XG4gICAgbG9nKGByZWdpc3RlciAtIGlkOiBcIiR7dmlldy5vcHRpb25zLmlkfVwiIC0gcHJpb3JpdHk6ICR7dmlldy5wcmlvcml0eX1gKTtcblxuICAgIF9zdGFjay5hZGQodmlldyk7XG4gICAgdmlldy5oaWRlKCk7XG4gICAgdmlldy5hcHBlbmRUbyhfJGNvbnRhaW5lcik7XG5cbiAgICAvLyB0cmlnZ2VyIGBfdXBkYXRlVmlld2Agb25seSBvbmNlIHdoZW4gc2V2ZXJhbCB2aWV3IGFyZSByZWdpc3RlcmVkIGF0IG9uY2UuXG4gICAgaWYgKCF0aGlzLl90aW1lb3V0SWQpXG4gICAgICB0aGlzLnRpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4geyB0aGlzLl91cGRhdGVWaWV3KCk7IH0sIDApO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZW1vdmUgdmlldyBmcm9tIHRoZSBzdGFjayBvZiB2aWV3cyB0byBkaXNwbGF5LlxuICAgKiBAcGFyYW0ge1ZpZXd9IHZpZXcgLSBBIHZpZXcgdG8gcmVtb3ZlIGZyb20gdGhlIHN0YWNrLlxuICAgKi9cbiAgcmVtb3ZlKHZpZXcpIHtcbiAgICBsb2coYHJlbW92ZSAtIGlkOiBcIiR7dmlldy5vcHRpb25zLmlkfVwiIC0gcHJpb3JpdHk6ICR7dmlldy5wcmlvcml0eX1gKTtcblxuICAgIHZpZXcucmVtb3ZlKCk7XG4gICAgX3N0YWNrLmRlbGV0ZSh2aWV3KTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4geyB0aGlzLl91cGRhdGVWaWV3KCk7IH0sIDApO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBjb250YWluZXIgb2YgdGhlIHZpZXdzIGZvciBhbGwgYEFjdGl2aXR5YCBpbnN0YW5jZXMuIElzIGNhbGxlZCBieVxuICAgKiB7QGxpbmsgc3JjL2NsaWVudC9jb3JlL2NsaWVudC5qc35jbGllbnR9KSBkdXJpbmcgYXBwbGljYXRpb24gYm9vdHN0cmFwLlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRlbCAtIFRoZSBlbGVtZW50IHRvIHVzZSBhcyBhIGNvbnRhaW5lciBmb3IgdGhlIHZpZXcuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZXRWaWV3Q29udGFpbmVyKCRlbCkge1xuICAgIF8kY29udGFpbmVyID0gJGVsO1xuICB9LFxuXG4gIC8qKlxuICAgKiBEZWZpbmVzIHdoZXRoZXIgdGhlIHZpZXcgc2hvdWxkIGJlIHVwZGF0ZWQgYWNjb3JkaW5nIHRvIGRlZmluZWQgcHJpb3JpdGllcy5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF91cGRhdGVWaWV3KCkge1xuICAgIGxldCB2aXNpYmxlVmlldztcbiAgICBsZXQgcHJpb3JpdHkgPSAtSW5maW5pdHk7XG4gICAgbGV0IG5leHRWaWV3ID0gbnVsbDtcblxuICAgIF9zdGFjay5mb3JFYWNoKGZ1bmN0aW9uKHZpZXcpIHtcbiAgICAgIGlmICh2aWV3LmlzVmlzaWJsZSlcbiAgICAgICAgdmlzaWJsZVZpZXcgPSB0cnVlO1xuXG4gICAgICBpZiAodmlldy5wcmlvcml0eSA+IHByaW9yaXR5KSB7XG4gICAgICAgIHByaW9yaXR5ID0gdmlldy5wcmlvcml0eTtcbiAgICAgICAgbmV4dFZpZXcgPSB2aWV3O1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKG5leHRWaWV3KSB7XG4gICAgICBpZiAoIXZpc2libGVWaWV3KSB7XG4gICAgICAgIGxvZyhgdXBkYXRlIHZpZXcgLSBpZDogXCIke25leHRWaWV3Lm9wdGlvbnMuaWR9XCIgLSBwcmlvcml0eTogJHtwcmlvcml0eX1gKTtcblxuICAgICAgICBuZXh0Vmlldy5zaG93KCk7XG4gICAgICB9IGVsc2UgaWYgKHZpc2libGVWaWV3LnByaW9yaXR5IDwgbmV4dFZpZXcucHJpb3JpdHkpIHtcbiAgICAgICAgbG9nKGB1cGRhdGUgdmlldyAtIGlkOiBcIiR7bmV4dFZpZXcub3B0aW9ucy5pZH1cIiAtIHByaW9yaXR5OiAke3ByaW9yaXR5fWApO1xuXG4gICAgICAgIHZpc2libGVWaWV3LmhpZGUoKTsgLy8gaGlkZSBidXQga2VlcCBpbiBzdGFja1xuICAgICAgICBuZXh0Vmlldy5zaG93KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy50aW1lb3V0SWQgPSBudWxsO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgdmlld01hbmFnZXI7XG4iXX0=