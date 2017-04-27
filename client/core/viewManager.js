'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _debug2.default)('soundworks:viewManager');
var viewInfosMap = new _map2.default();

var $container = null;

/**
 * Handle activities' (services and scenes) views according to their priorities.
 */
var viewManager = {
  _timeoutId: null,

  _visibleView: null,

  /**
   * Sets the container of the views for all `Activity` instances. Is called by
   * {@link src/client/core/client.js~client}) during application bootstrap.
   * @param {Element} $el - The element to use as a container for the view.
   * @private
   */
  setAppContainer: function setAppContainer($el) {
    $container = $el;
  },


  /**
   * Register a view into the stack of views to display. The fact that the view is
   * actually displayed is defined by its priority and activities lifecycle.
   * @param {View} view - A view to add to the stack.
   */
  register: function register(view, priority) {
    var _this = this;

    log('register - id: "' + view.options.id + '" - priority: ' + priority);

    var infos = {};
    infos.$el = view.render();
    infos.priority = priority;
    var promise = new _promise2.default(function (resolve, reject) {
      return infos.promise = resolve;
    });

    viewInfosMap.set(view, infos);

    // trigger `_updateView` only once when several view are registered at once.
    clearTimeout(this._timeoutId);
    this._timeoutId = setTimeout(function () {
      return _this._updateView();
    }, 0);

    return promise;
  },


  /**
   * Remove view from the stack of views to display.
   * @param {View} view - A view to remove from the stack.
   */
  remove: function remove(view) {
    var _this2 = this;

    log('remove - id: "' + view.options.id + '"');

    // clean dictionnary
    viewInfosMap.delete(view);

    if (this._visibleView === view) {
      this._visibleView.remove();
      this._visibleView = null;
    }

    clearTimeout(this._timeoutId);
    this._timeoutId = setTimeout(function () {
      return _this2._updateView();
    }, 0);
  },


  /**
   * Defines whether the view should be updated according to defined priorities.
   * @private
   */
  _updateView: function _updateView() {
    var visibleView = this._visibleView;
    var nextViewPriority = -Infinity;
    var nextView = null;

    viewInfosMap.forEach(function (infos, view) {
      if (infos.priority > nextViewPriority) {
        nextViewPriority = infos.priority;
        nextView = view;
      }
    });

    log('update view - next: "' + nextView.options.id + '" - visible: "' + (visibleView ? visibleView.options.id : 'Ø') + '"');

    if (nextView) {
      if (visibleView === null) {
        $container.appendChild(viewInfosMap.get(nextView).$el);
        nextView.show();
        // resolve the promise created when the view were registered
        viewInfosMap.get(nextView).promise();
        this._visibleView = nextView;
      } else {
        var visibleViewPriority = viewInfosMap.get(this._visibleView).priority;

        if (visibleViewPriority < nextViewPriority) {
          visibleView.remove(); // hide but keep in stack

          $container.appendChild(viewInfosMap.get(nextView).$el);
          nextView.show();

          viewInfosMap.get(nextView).promise();
          this._visibleView = nextView;
        }
      }
    }
  }
};

exports.default = viewManager;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZXdNYW5hZ2VyLmpzIl0sIm5hbWVzIjpbImxvZyIsInZpZXdJbmZvc01hcCIsIiRjb250YWluZXIiLCJ2aWV3TWFuYWdlciIsIl90aW1lb3V0SWQiLCJfdmlzaWJsZVZpZXciLCJzZXRBcHBDb250YWluZXIiLCIkZWwiLCJyZWdpc3RlciIsInZpZXciLCJwcmlvcml0eSIsIm9wdGlvbnMiLCJpZCIsImluZm9zIiwicmVuZGVyIiwicHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJzZXQiLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwiX3VwZGF0ZVZpZXciLCJyZW1vdmUiLCJkZWxldGUiLCJ2aXNpYmxlVmlldyIsIm5leHRWaWV3UHJpb3JpdHkiLCJJbmZpbml0eSIsIm5leHRWaWV3IiwiZm9yRWFjaCIsImFwcGVuZENoaWxkIiwiZ2V0Iiwic2hvdyIsInZpc2libGVWaWV3UHJpb3JpdHkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztBQUVBLElBQU1BLE1BQU0scUJBQU0sd0JBQU4sQ0FBWjtBQUNBLElBQU1DLGVBQWUsbUJBQXJCOztBQUVBLElBQUlDLGFBQWEsSUFBakI7O0FBRUE7OztBQUdBLElBQU1DLGNBQWM7QUFDbEJDLGNBQVksSUFETTs7QUFHbEJDLGdCQUFjLElBSEk7O0FBS2xCOzs7Ozs7QUFNQUMsaUJBWGtCLDJCQVdGQyxHQVhFLEVBV0c7QUFDbkJMLGlCQUFhSyxHQUFiO0FBQ0QsR0FiaUI7OztBQWVsQjs7Ozs7QUFLQUMsVUFwQmtCLG9CQW9CVEMsSUFwQlMsRUFvQkhDLFFBcEJHLEVBb0JPO0FBQUE7O0FBQ3ZCViw2QkFBdUJTLEtBQUtFLE9BQUwsQ0FBYUMsRUFBcEMsc0JBQXVERixRQUF2RDs7QUFFQSxRQUFNRyxRQUFRLEVBQWQ7QUFDQUEsVUFBTU4sR0FBTixHQUFZRSxLQUFLSyxNQUFMLEVBQVo7QUFDQUQsVUFBTUgsUUFBTixHQUFpQkEsUUFBakI7QUFDQSxRQUFNSyxVQUFVLHNCQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVjtBQUFBLGFBQXFCSixNQUFNRSxPQUFOLEdBQWdCQyxPQUFyQztBQUFBLEtBQVosQ0FBaEI7O0FBRUFmLGlCQUFhaUIsR0FBYixDQUFpQlQsSUFBakIsRUFBdUJJLEtBQXZCOztBQUVBO0FBQ0FNLGlCQUFhLEtBQUtmLFVBQWxCO0FBQ0EsU0FBS0EsVUFBTCxHQUFrQmdCLFdBQVc7QUFBQSxhQUFNLE1BQUtDLFdBQUwsRUFBTjtBQUFBLEtBQVgsRUFBcUMsQ0FBckMsQ0FBbEI7O0FBRUEsV0FBT04sT0FBUDtBQUNELEdBbkNpQjs7O0FBcUNsQjs7OztBQUlBTyxRQXpDa0Isa0JBeUNYYixJQXpDVyxFQXlDTDtBQUFBOztBQUNYVCwyQkFBcUJTLEtBQUtFLE9BQUwsQ0FBYUMsRUFBbEM7O0FBRUE7QUFDQVgsaUJBQWFzQixNQUFiLENBQW9CZCxJQUFwQjs7QUFFQSxRQUFJLEtBQUtKLFlBQUwsS0FBc0JJLElBQTFCLEVBQWdDO0FBQzlCLFdBQUtKLFlBQUwsQ0FBa0JpQixNQUFsQjtBQUNBLFdBQUtqQixZQUFMLEdBQW9CLElBQXBCO0FBQ0Q7O0FBRURjLGlCQUFhLEtBQUtmLFVBQWxCO0FBQ0EsU0FBS0EsVUFBTCxHQUFrQmdCLFdBQVc7QUFBQSxhQUFNLE9BQUtDLFdBQUwsRUFBTjtBQUFBLEtBQVgsRUFBcUMsQ0FBckMsQ0FBbEI7QUFDRCxHQXREaUI7OztBQXdEbEI7Ozs7QUFJQUEsYUE1RGtCLHlCQTRESjtBQUNaLFFBQU1HLGNBQWMsS0FBS25CLFlBQXpCO0FBQ0EsUUFBSW9CLG1CQUFtQixDQUFDQyxRQUF4QjtBQUNBLFFBQUlDLFdBQVcsSUFBZjs7QUFFQTFCLGlCQUFhMkIsT0FBYixDQUFxQixVQUFDZixLQUFELEVBQVFKLElBQVIsRUFBaUI7QUFDcEMsVUFBSUksTUFBTUgsUUFBTixHQUFpQmUsZ0JBQXJCLEVBQXVDO0FBQ3JDQSwyQkFBbUJaLE1BQU1ILFFBQXpCO0FBQ0FpQixtQkFBV2xCLElBQVg7QUFDRDtBQUNGLEtBTEQ7O0FBT0FULGtDQUE0QjJCLFNBQVNoQixPQUFULENBQWlCQyxFQUE3Qyx1QkFBZ0VZLGNBQWNBLFlBQVliLE9BQVosQ0FBb0JDLEVBQWxDLEdBQXVDLEdBQXZHOztBQUVBLFFBQUllLFFBQUosRUFBYztBQUNaLFVBQUlILGdCQUFnQixJQUFwQixFQUEwQjtBQUN4QnRCLG1CQUFXMkIsV0FBWCxDQUF1QjVCLGFBQWE2QixHQUFiLENBQWlCSCxRQUFqQixFQUEyQnBCLEdBQWxEO0FBQ0FvQixpQkFBU0ksSUFBVDtBQUNBO0FBQ0E5QixxQkFBYTZCLEdBQWIsQ0FBaUJILFFBQWpCLEVBQTJCWixPQUEzQjtBQUNBLGFBQUtWLFlBQUwsR0FBb0JzQixRQUFwQjtBQUNELE9BTkQsTUFNTztBQUNMLFlBQU1LLHNCQUFzQi9CLGFBQWE2QixHQUFiLENBQWlCLEtBQUt6QixZQUF0QixFQUFvQ0ssUUFBaEU7O0FBRUEsWUFBSXNCLHNCQUFzQlAsZ0JBQTFCLEVBQTRDO0FBQzFDRCxzQkFBWUYsTUFBWixHQUQwQyxDQUNwQjs7QUFFdEJwQixxQkFBVzJCLFdBQVgsQ0FBdUI1QixhQUFhNkIsR0FBYixDQUFpQkgsUUFBakIsRUFBMkJwQixHQUFsRDtBQUNBb0IsbUJBQVNJLElBQVQ7O0FBRUE5Qix1QkFBYTZCLEdBQWIsQ0FBaUJILFFBQWpCLEVBQTJCWixPQUEzQjtBQUNBLGVBQUtWLFlBQUwsR0FBb0JzQixRQUFwQjtBQUNEO0FBQ0Y7QUFDRjtBQUNGO0FBL0ZpQixDQUFwQjs7a0JBa0dleEIsVyIsImZpbGUiOiJ2aWV3TWFuYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5cbmNvbnN0IGxvZyA9IGRlYnVnKCdzb3VuZHdvcmtzOnZpZXdNYW5hZ2VyJyk7XG5jb25zdCB2aWV3SW5mb3NNYXAgPSBuZXcgTWFwKCk7XG5cbmxldCAkY29udGFpbmVyID0gbnVsbDtcblxuLyoqXG4gKiBIYW5kbGUgYWN0aXZpdGllcycgKHNlcnZpY2VzIGFuZCBzY2VuZXMpIHZpZXdzIGFjY29yZGluZyB0byB0aGVpciBwcmlvcml0aWVzLlxuICovXG5jb25zdCB2aWV3TWFuYWdlciA9IHtcbiAgX3RpbWVvdXRJZDogbnVsbCxcblxuICBfdmlzaWJsZVZpZXc6IG51bGwsXG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGNvbnRhaW5lciBvZiB0aGUgdmlld3MgZm9yIGFsbCBgQWN0aXZpdHlgIGluc3RhbmNlcy4gSXMgY2FsbGVkIGJ5XG4gICAqIHtAbGluayBzcmMvY2xpZW50L2NvcmUvY2xpZW50LmpzfmNsaWVudH0pIGR1cmluZyBhcHBsaWNhdGlvbiBib290c3RyYXAuXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGVsIC0gVGhlIGVsZW1lbnQgdG8gdXNlIGFzIGEgY29udGFpbmVyIGZvciB0aGUgdmlldy5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNldEFwcENvbnRhaW5lcigkZWwpIHtcbiAgICAkY29udGFpbmVyID0gJGVsO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIHZpZXcgaW50byB0aGUgc3RhY2sgb2Ygdmlld3MgdG8gZGlzcGxheS4gVGhlIGZhY3QgdGhhdCB0aGUgdmlldyBpc1xuICAgKiBhY3R1YWxseSBkaXNwbGF5ZWQgaXMgZGVmaW5lZCBieSBpdHMgcHJpb3JpdHkgYW5kIGFjdGl2aXRpZXMgbGlmZWN5Y2xlLlxuICAgKiBAcGFyYW0ge1ZpZXd9IHZpZXcgLSBBIHZpZXcgdG8gYWRkIHRvIHRoZSBzdGFjay5cbiAgICovXG4gIHJlZ2lzdGVyKHZpZXcsIHByaW9yaXR5KSB7XG4gICAgbG9nKGByZWdpc3RlciAtIGlkOiBcIiR7dmlldy5vcHRpb25zLmlkfVwiIC0gcHJpb3JpdHk6ICR7cHJpb3JpdHl9YCk7XG5cbiAgICBjb25zdCBpbmZvcyA9IHt9O1xuICAgIGluZm9zLiRlbCA9IHZpZXcucmVuZGVyKCk7XG4gICAgaW5mb3MucHJpb3JpdHkgPSBwcmlvcml0eTtcbiAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4gaW5mb3MucHJvbWlzZSA9IHJlc29sdmUpO1xuXG4gICAgdmlld0luZm9zTWFwLnNldCh2aWV3LCBpbmZvcyk7XG5cbiAgICAvLyB0cmlnZ2VyIGBfdXBkYXRlVmlld2Agb25seSBvbmNlIHdoZW4gc2V2ZXJhbCB2aWV3IGFyZSByZWdpc3RlcmVkIGF0IG9uY2UuXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVvdXRJZCk7XG4gICAgdGhpcy5fdGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLl91cGRhdGVWaWV3KCksIDApO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlbW92ZSB2aWV3IGZyb20gdGhlIHN0YWNrIG9mIHZpZXdzIHRvIGRpc3BsYXkuXG4gICAqIEBwYXJhbSB7Vmlld30gdmlldyAtIEEgdmlldyB0byByZW1vdmUgZnJvbSB0aGUgc3RhY2suXG4gICAqL1xuICByZW1vdmUodmlldykge1xuICAgIGxvZyhgcmVtb3ZlIC0gaWQ6IFwiJHt2aWV3Lm9wdGlvbnMuaWR9XCJgKTtcblxuICAgIC8vIGNsZWFuIGRpY3Rpb25uYXJ5XG4gICAgdmlld0luZm9zTWFwLmRlbGV0ZSh2aWV3KTtcblxuICAgIGlmICh0aGlzLl92aXNpYmxlVmlldyA9PT0gdmlldykge1xuICAgICAgdGhpcy5fdmlzaWJsZVZpZXcucmVtb3ZlKCk7XG4gICAgICB0aGlzLl92aXNpYmxlVmlldyA9IG51bGw7XG4gICAgfVxuXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVvdXRJZCk7XG4gICAgdGhpcy5fdGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLl91cGRhdGVWaWV3KCksIDApO1xuICB9LFxuXG4gIC8qKlxuICAgKiBEZWZpbmVzIHdoZXRoZXIgdGhlIHZpZXcgc2hvdWxkIGJlIHVwZGF0ZWQgYWNjb3JkaW5nIHRvIGRlZmluZWQgcHJpb3JpdGllcy5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF91cGRhdGVWaWV3KCkge1xuICAgIGNvbnN0IHZpc2libGVWaWV3ID0gdGhpcy5fdmlzaWJsZVZpZXc7XG4gICAgbGV0IG5leHRWaWV3UHJpb3JpdHkgPSAtSW5maW5pdHk7XG4gICAgbGV0IG5leHRWaWV3ID0gbnVsbDtcblxuICAgIHZpZXdJbmZvc01hcC5mb3JFYWNoKChpbmZvcywgdmlldykgPT4ge1xuICAgICAgaWYgKGluZm9zLnByaW9yaXR5ID4gbmV4dFZpZXdQcmlvcml0eSkge1xuICAgICAgICBuZXh0Vmlld1ByaW9yaXR5ID0gaW5mb3MucHJpb3JpdHk7XG4gICAgICAgIG5leHRWaWV3ID0gdmlldztcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGxvZyhgdXBkYXRlIHZpZXcgLSBuZXh0OiBcIiR7bmV4dFZpZXcub3B0aW9ucy5pZH1cIiAtIHZpc2libGU6IFwiJHt2aXNpYmxlVmlldyA/IHZpc2libGVWaWV3Lm9wdGlvbnMuaWQgOiAnw5gnfVwiYCk7XG5cbiAgICBpZiAobmV4dFZpZXcpIHtcbiAgICAgIGlmICh2aXNpYmxlVmlldyA9PT0gbnVsbCkge1xuICAgICAgICAkY29udGFpbmVyLmFwcGVuZENoaWxkKHZpZXdJbmZvc01hcC5nZXQobmV4dFZpZXcpLiRlbCk7XG4gICAgICAgIG5leHRWaWV3LnNob3coKTtcbiAgICAgICAgLy8gcmVzb2x2ZSB0aGUgcHJvbWlzZSBjcmVhdGVkIHdoZW4gdGhlIHZpZXcgd2VyZSByZWdpc3RlcmVkXG4gICAgICAgIHZpZXdJbmZvc01hcC5nZXQobmV4dFZpZXcpLnByb21pc2UoKTtcbiAgICAgICAgdGhpcy5fdmlzaWJsZVZpZXcgPSBuZXh0VmlldztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHZpc2libGVWaWV3UHJpb3JpdHkgPSB2aWV3SW5mb3NNYXAuZ2V0KHRoaXMuX3Zpc2libGVWaWV3KS5wcmlvcml0eTtcblxuICAgICAgICBpZiAodmlzaWJsZVZpZXdQcmlvcml0eSA8IG5leHRWaWV3UHJpb3JpdHkpIHtcbiAgICAgICAgICB2aXNpYmxlVmlldy5yZW1vdmUoKTsgLy8gaGlkZSBidXQga2VlcCBpbiBzdGFja1xuXG4gICAgICAgICAgJGNvbnRhaW5lci5hcHBlbmRDaGlsZCh2aWV3SW5mb3NNYXAuZ2V0KG5leHRWaWV3KS4kZWwpO1xuICAgICAgICAgIG5leHRWaWV3LnNob3coKTtcblxuICAgICAgICAgIHZpZXdJbmZvc01hcC5nZXQobmV4dFZpZXcpLnByb21pc2UoKTtcbiAgICAgICAgICB0aGlzLl92aXNpYmxlVmlldyA9IG5leHRWaWV3O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgdmlld01hbmFnZXI7XG4iXX0=