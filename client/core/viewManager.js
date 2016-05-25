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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZXdNYW5hZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBRUEsSUFBTSxNQUFNLHFCQUFNLHdCQUFOLENBQVo7QUFDQSxJQUFNLFNBQVMsbUJBQWY7QUFDQSxJQUFJLGNBQWMsSUFBbEI7Ozs7O0FBS0EsSUFBTSxjQUFjO0FBQ2xCLGNBQVksSUFETTs7Ozs7OztBQVFsQixVQVJrQixvQkFRVCxJQVJTLEVBUUg7QUFBQTs7QUFDYiw2QkFBdUIsS0FBSyxPQUFMLENBQWEsRUFBcEMsc0JBQXVELEtBQUssUUFBNUQ7O0FBRUEsV0FBTyxHQUFQLENBQVcsSUFBWDtBQUNBLFNBQUssSUFBTDtBQUNBLFNBQUssUUFBTCxDQUFjLFdBQWQ7OztBQUdBLFFBQUksQ0FBQyxLQUFLLFVBQVYsRUFDRSxLQUFLLFNBQUwsR0FBaUIsV0FBVyxZQUFNO0FBQUUsWUFBSyxXQUFMO0FBQXFCLEtBQXhDLEVBQTBDLENBQTFDLENBQWpCO0FBQ0gsR0FsQmlCOzs7Ozs7O0FBd0JsQixRQXhCa0Isa0JBd0JYLElBeEJXLEVBd0JMO0FBQUE7O0FBQ1gsMkJBQXFCLEtBQUssT0FBTCxDQUFhLEVBQWxDLHNCQUFxRCxLQUFLLFFBQTFEOztBQUVBLFNBQUssTUFBTDtBQUNBLFdBQU8sTUFBUCxDQUFjLElBQWQ7O0FBRUEsZUFBVyxZQUFNO0FBQUUsYUFBSyxXQUFMO0FBQXFCLEtBQXhDLEVBQTBDLENBQTFDO0FBQ0QsR0EvQmlCOzs7Ozs7Ozs7QUF1Q2xCLGtCQXZDa0IsNEJBdUNELEdBdkNDLEVBdUNJO0FBQ3BCLGtCQUFjLEdBQWQ7QUFDRCxHQXpDaUI7Ozs7Ozs7QUErQ2xCLGFBL0NrQix5QkErQ0o7QUFDWixRQUFJLG9CQUFKO0FBQ0EsUUFBSSxXQUFXLENBQUMsUUFBaEI7QUFDQSxRQUFJLFdBQVcsSUFBZjs7QUFFQSxXQUFPLE9BQVAsQ0FBZSxVQUFTLElBQVQsRUFBZTtBQUM1QixVQUFJLEtBQUssU0FBVCxFQUNFLGNBQWMsSUFBZDs7QUFFRixVQUFJLEtBQUssUUFBTCxHQUFnQixRQUFwQixFQUE4QjtBQUM1QixtQkFBVyxLQUFLLFFBQWhCO0FBQ0EsbUJBQVcsSUFBWDtBQUNEO0FBQ0YsS0FSRDs7QUFVQSxRQUFJLFFBQUosRUFBYztBQUNaLFVBQUksQ0FBQyxXQUFMLEVBQWtCO0FBQ2hCLG9DQUEwQixTQUFTLE9BQVQsQ0FBaUIsRUFBM0Msc0JBQThELFFBQTlEOztBQUVBLGlCQUFTLElBQVQ7QUFDRCxPQUpELE1BSU8sSUFBSSxZQUFZLFFBQVosR0FBdUIsU0FBUyxRQUFwQyxFQUE4QztBQUNuRCxvQ0FBMEIsU0FBUyxPQUFULENBQWlCLEVBQTNDLHNCQUE4RCxRQUE5RDs7QUFFQSxvQkFBWSxJQUFaLEc7QUFDQSxpQkFBUyxJQUFUO0FBQ0Q7QUFDRjs7QUFFRCxTQUFLLFNBQUwsR0FBaUIsSUFBakI7QUFDRDtBQTVFaUIsQ0FBcEI7O2tCQStFZSxXIiwiZmlsZSI6InZpZXdNYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGRlYnVnIGZyb20gJ2RlYnVnJztcblxuY29uc3QgbG9nID0gZGVidWcoJ3NvdW5kd29ya3M6dmlld01hbmFnZXInKTtcbmNvbnN0IF9zdGFjayA9IG5ldyBTZXQoKTtcbmxldCBfJGNvbnRhaW5lciA9IG51bGw7XG5cbi8qKlxuICogSGFuZGxlIGFjdGl2aXRpZXMnIChzZXJ2aWNlcyBhbmQgc2NlbmVzKSB2aWV3cyBhY2NvcmRpbmcgdG8gdGhlaXIgcHJpb3JpdGllcy5cbiAqL1xuY29uc3Qgdmlld01hbmFnZXIgPSB7XG4gIF90aW1lb3V0SWQ6IG51bGwsXG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgdmlldyBpbnRvIHRoZSBzdGFjayBvZiB2aWV3cyB0byBkaXNwbGF5LiBUaGUgZmFjdCB0aGF0IHRoZSB2aWV3IGlzXG4gICAqIGFjdHVhbGx5IGRpc3BsYXllZCBpcyBkZWZpbmVkIGJ5IGl0cyBwcmlvcml0eSBhbmQgYWN0aXZpdGllcyBsaWZlY3ljbGUuXG4gICAqIEBwYXJhbSB7Vmlld30gdmlldyAtIEEgdmlldyB0byBhZGQgdG8gdGhlIHN0YWNrLlxuICAgKi9cbiAgcmVnaXN0ZXIodmlldykge1xuICAgIGxvZyhgcmVnaXN0ZXIgLSBpZDogXCIke3ZpZXcub3B0aW9ucy5pZH1cIiAtIHByaW9yaXR5OiAke3ZpZXcucHJpb3JpdHl9YCk7XG5cbiAgICBfc3RhY2suYWRkKHZpZXcpO1xuICAgIHZpZXcuaGlkZSgpO1xuICAgIHZpZXcuYXBwZW5kVG8oXyRjb250YWluZXIpO1xuXG4gICAgLy8gdHJpZ2dlciBgX3VwZGF0ZVZpZXdgIG9ubHkgb25jZSB3aGVuIHNldmVyYWwgdmlldyBhcmUgcmVnaXN0ZXJlZCBhdCBvbmNlLlxuICAgIGlmICghdGhpcy5fdGltZW91dElkKVxuICAgICAgdGhpcy50aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHsgdGhpcy5fdXBkYXRlVmlldygpOyB9LCAwKTtcbiAgfSxcblxuICAvKipcbiAgICogUmVtb3ZlIHZpZXcgZnJvbSB0aGUgc3RhY2sgb2Ygdmlld3MgdG8gZGlzcGxheS5cbiAgICogQHBhcmFtIHtWaWV3fSB2aWV3IC0gQSB2aWV3IHRvIHJlbW92ZSBmcm9tIHRoZSBzdGFjay5cbiAgICovXG4gIHJlbW92ZSh2aWV3KSB7XG4gICAgbG9nKGByZW1vdmUgLSBpZDogXCIke3ZpZXcub3B0aW9ucy5pZH1cIiAtIHByaW9yaXR5OiAke3ZpZXcucHJpb3JpdHl9YCk7XG5cbiAgICB2aWV3LnJlbW92ZSgpO1xuICAgIF9zdGFjay5kZWxldGUodmlldyk7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHsgdGhpcy5fdXBkYXRlVmlldygpOyB9LCAwKTtcbiAgfSxcblxuICAvKipcbiAgICogU2V0cyB0aGUgY29udGFpbmVyIG9mIHRoZSB2aWV3cyBmb3IgYWxsIGBBY3Rpdml0eWAgaW5zdGFuY2VzLiBJcyBjYWxsZWQgYnlcbiAgICoge0BsaW5rIHNyYy9jbGllbnQvY29yZS9jbGllbnQuanN+Y2xpZW50fSkgZHVyaW5nIGFwcGxpY2F0aW9uIGJvb3RzdHJhcC5cbiAgICogQHBhcmFtIHtFbGVtZW50fSAkZWwgLSBUaGUgZWxlbWVudCB0byB1c2UgYXMgYSBjb250YWluZXIgZm9yIHRoZSB2aWV3LlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0Vmlld0NvbnRhaW5lcigkZWwpIHtcbiAgICBfJGNvbnRhaW5lciA9ICRlbDtcbiAgfSxcblxuICAvKipcbiAgICogRGVmaW5lcyB3aGV0aGVyIHRoZSB2aWV3IHNob3VsZCBiZSB1cGRhdGVkIGFjY29yZGluZyB0byBkZWZpbmVkIHByaW9yaXRpZXMuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfdXBkYXRlVmlldygpIHtcbiAgICBsZXQgdmlzaWJsZVZpZXc7XG4gICAgbGV0IHByaW9yaXR5ID0gLUluZmluaXR5O1xuICAgIGxldCBuZXh0VmlldyA9IG51bGw7XG5cbiAgICBfc3RhY2suZm9yRWFjaChmdW5jdGlvbih2aWV3KSB7XG4gICAgICBpZiAodmlldy5pc1Zpc2libGUpXG4gICAgICAgIHZpc2libGVWaWV3ID0gdHJ1ZTtcblxuICAgICAgaWYgKHZpZXcucHJpb3JpdHkgPiBwcmlvcml0eSkge1xuICAgICAgICBwcmlvcml0eSA9IHZpZXcucHJpb3JpdHk7XG4gICAgICAgIG5leHRWaWV3ID0gdmlldztcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChuZXh0Vmlldykge1xuICAgICAgaWYgKCF2aXNpYmxlVmlldykge1xuICAgICAgICBsb2coYHVwZGF0ZSB2aWV3IC0gaWQ6IFwiJHtuZXh0Vmlldy5vcHRpb25zLmlkfVwiIC0gcHJpb3JpdHk6ICR7cHJpb3JpdHl9YCk7XG5cbiAgICAgICAgbmV4dFZpZXcuc2hvdygpO1xuICAgICAgfSBlbHNlIGlmICh2aXNpYmxlVmlldy5wcmlvcml0eSA8IG5leHRWaWV3LnByaW9yaXR5KSB7XG4gICAgICAgIGxvZyhgdXBkYXRlIHZpZXcgLSBpZDogXCIke25leHRWaWV3Lm9wdGlvbnMuaWR9XCIgLSBwcmlvcml0eTogJHtwcmlvcml0eX1gKTtcblxuICAgICAgICB2aXNpYmxlVmlldy5oaWRlKCk7IC8vIGhpZGUgYnV0IGtlZXAgaW4gc3RhY2tcbiAgICAgICAgbmV4dFZpZXcuc2hvdygpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMudGltZW91dElkID0gbnVsbDtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHZpZXdNYW5hZ2VyO1xuIl19