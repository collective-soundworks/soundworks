'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Track the viewport size and orientation.
 * All views add their {@link module:soundworks/client.View#onResize} method as
 * listener of this helper.
 *
 * @namespace
 * @memberof module:soundworks/client
 *
 * @see {@link module:soundworks/client.View#onResize}
 */
var viewport = {
  /**
   * Width of the viewport.
   *
   * @type {Number}
   */
  width: null,

  /**
   * Height of the viewport.
   *
   * @type {Number}
   */
  height: null,

  /**
   * Orientation of the viewport (`'portrait'|'landscape'`).
   *
   * @type {String}
   */
  orientation: null,

  /**
   * List of callbacks to execute on each `resize` event.
   *
   * @type {Set}
   * @private
   */
  _callbacks: new _set2.default(),

  /**
   * Initialize the service, is called in `client._initViews`.
   * @private
   */
  init: function init() {
    this._onResize = this._onResize.bind(this);

    this._onResize();
    window.addEventListener('resize', this._onResize, false);
  },


  /** @private */
  _onResize: function _onResize() {
    var _this = this;

    this.width = document.documentElement.clientWidth || window.innerWidth;
    this.height = document.documentElement.clientHeight || window.innerHeight;
    this.orientation = this.width > this.height ? 'landscape' : 'portrait';

    this._callbacks.forEach(function (callback) {
      callback(_this.width, _this.height, _this.orientation);
    });
  },


  /**
   * Callback to execute on a `resize` event.
   *
   * @callback module:soundworks/client.viewport~resizeCallback
   * @param {Number} width - Width of the viewport.
   * @param {Number} height - Height of the viewport.
   * @param {String} orientation - Orientation of the viewport.
   */

  /**
   * Add a listener to the `resize` event. The callback is immediately
   * invoked with the current `width`, `height` and `orientation` values.
   *
   * @param {module:soundworks/client.viewport~resizeCallback} callback -
   *  Callback to add to listeners.
   */
  addResizeListener: function addResizeListener(callback) {
    this._callbacks.add(callback);
    // execute immediatly with current values
    callback(this.width, this.height, this.orientation);
  },


  /**
   * Remove a listener from the `resize` event.
   *
   * @param {module:soundworks/client.viewport~resizeCallback} callback -
   *  Callback to remove from listeners.
   */
  removeResizeListener: function removeResizeListener(callback) {
    this._callbacks.delete(callback);
  }
};

exports.default = viewport;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZXdwb3J0LmpzIl0sIm5hbWVzIjpbInZpZXdwb3J0Iiwid2lkdGgiLCJoZWlnaHQiLCJvcmllbnRhdGlvbiIsIl9jYWxsYmFja3MiLCJpbml0IiwiX29uUmVzaXplIiwiYmluZCIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJkb2N1bWVudCIsImRvY3VtZW50RWxlbWVudCIsImNsaWVudFdpZHRoIiwiaW5uZXJXaWR0aCIsImNsaWVudEhlaWdodCIsImlubmVySGVpZ2h0IiwiZm9yRWFjaCIsImNhbGxiYWNrIiwiYWRkUmVzaXplTGlzdGVuZXIiLCJhZGQiLCJyZW1vdmVSZXNpemVMaXN0ZW5lciIsImRlbGV0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7QUFVQSxJQUFNQSxXQUFXO0FBQ2Y7Ozs7O0FBS0FDLFNBQU8sSUFOUTs7QUFRZjs7Ozs7QUFLQUMsVUFBUSxJQWJPOztBQWVmOzs7OztBQUtBQyxlQUFhLElBcEJFOztBQXNCZjs7Ozs7O0FBTUFDLGNBQVksbUJBNUJHOztBQThCZjs7OztBQUlBQyxNQWxDZSxrQkFrQ1I7QUFDTCxTQUFLQyxTQUFMLEdBQWlCLEtBQUtBLFNBQUwsQ0FBZUMsSUFBZixDQUFvQixJQUFwQixDQUFqQjs7QUFFQSxTQUFLRCxTQUFMO0FBQ0FFLFdBQU9DLGdCQUFQLENBQXdCLFFBQXhCLEVBQWtDLEtBQUtILFNBQXZDLEVBQWtELEtBQWxEO0FBQ0QsR0F2Q2M7OztBQXlDZjtBQUNBQSxXQTFDZSx1QkEwQ0g7QUFBQTs7QUFDVixTQUFLTCxLQUFMLEdBQWFTLFNBQVNDLGVBQVQsQ0FBeUJDLFdBQXpCLElBQXdDSixPQUFPSyxVQUE1RDtBQUNBLFNBQUtYLE1BQUwsR0FBY1EsU0FBU0MsZUFBVCxDQUF5QkcsWUFBekIsSUFBeUNOLE9BQU9PLFdBQTlEO0FBQ0EsU0FBS1osV0FBTCxHQUFtQixLQUFLRixLQUFMLEdBQWEsS0FBS0MsTUFBbEIsR0FBMkIsV0FBM0IsR0FBeUMsVUFBNUQ7O0FBRUEsU0FBS0UsVUFBTCxDQUFnQlksT0FBaEIsQ0FBd0IsVUFBQ0MsUUFBRCxFQUFjO0FBQ3BDQSxlQUFTLE1BQUtoQixLQUFkLEVBQXFCLE1BQUtDLE1BQTFCLEVBQWtDLE1BQUtDLFdBQXZDO0FBQ0QsS0FGRDtBQUdELEdBbERjOzs7QUFvRGY7Ozs7Ozs7OztBQVNBOzs7Ozs7O0FBT0FlLG1CQXBFZSw2QkFvRUdELFFBcEVILEVBb0VhO0FBQzFCLFNBQUtiLFVBQUwsQ0FBZ0JlLEdBQWhCLENBQW9CRixRQUFwQjtBQUNBO0FBQ0FBLGFBQVMsS0FBS2hCLEtBQWQsRUFBcUIsS0FBS0MsTUFBMUIsRUFBa0MsS0FBS0MsV0FBdkM7QUFDRCxHQXhFYzs7O0FBMEVmOzs7Ozs7QUFNQWlCLHNCQWhGZSxnQ0FnRk1ILFFBaEZOLEVBZ0ZnQjtBQUM3QixTQUFLYixVQUFMLENBQWdCaUIsTUFBaEIsQ0FBdUJKLFFBQXZCO0FBQ0Q7QUFsRmMsQ0FBakI7O2tCQXFGZWpCLFEiLCJmaWxlIjoidmlld3BvcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRyYWNrIHRoZSB2aWV3cG9ydCBzaXplIGFuZCBvcmllbnRhdGlvbi5cbiAqIEFsbCB2aWV3cyBhZGQgdGhlaXIge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3I29uUmVzaXplfSBtZXRob2QgYXNcbiAqIGxpc3RlbmVyIG9mIHRoaXMgaGVscGVyLlxuICpcbiAqIEBuYW1lc3BhY2VcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqXG4gKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlldyNvblJlc2l6ZX1cbiAqL1xuY29uc3Qgdmlld3BvcnQgPSB7XG4gIC8qKlxuICAgKiBXaWR0aCBvZiB0aGUgdmlld3BvcnQuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICB3aWR0aDogbnVsbCxcblxuICAvKipcbiAgICogSGVpZ2h0IG9mIHRoZSB2aWV3cG9ydC5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGhlaWdodDogbnVsbCxcblxuICAvKipcbiAgICogT3JpZW50YXRpb24gb2YgdGhlIHZpZXdwb3J0IChgJ3BvcnRyYWl0J3wnbGFuZHNjYXBlJ2ApLlxuICAgKlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgb3JpZW50YXRpb246IG51bGwsXG5cbiAgLyoqXG4gICAqIExpc3Qgb2YgY2FsbGJhY2tzIHRvIGV4ZWN1dGUgb24gZWFjaCBgcmVzaXplYCBldmVudC5cbiAgICpcbiAgICogQHR5cGUge1NldH1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9jYWxsYmFja3M6IG5ldyBTZXQoKSxcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgc2VydmljZSwgaXMgY2FsbGVkIGluIGBjbGllbnQuX2luaXRWaWV3c2AuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBpbml0KCkge1xuICAgIHRoaXMuX29uUmVzaXplID0gdGhpcy5fb25SZXNpemUuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuX29uUmVzaXplKCk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX29uUmVzaXplLCBmYWxzZSk7XG4gIH0sXG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vblJlc2l6ZSgpIHtcbiAgICB0aGlzLndpZHRoID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIHx8wqB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQgfHzCoHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICB0aGlzLm9yaWVudGF0aW9uID0gdGhpcy53aWR0aCA+IHRoaXMuaGVpZ2h0ID8gJ2xhbmRzY2FwZScgOiAncG9ydHJhaXQnO1xuXG4gICAgdGhpcy5fY2FsbGJhY2tzLmZvckVhY2goKGNhbGxiYWNrKSA9PiB7XG4gICAgICBjYWxsYmFjayh0aGlzLndpZHRoLCB0aGlzLmhlaWdodCwgdGhpcy5vcmllbnRhdGlvbik7XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIGV4ZWN1dGUgb24gYSBgcmVzaXplYCBldmVudC5cbiAgICpcbiAgICogQGNhbGxiYWNrIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC52aWV3cG9ydH5yZXNpemVDYWxsYmFja1xuICAgKiBAcGFyYW0ge051bWJlcn0gd2lkdGggLSBXaWR0aCBvZiB0aGUgdmlld3BvcnQuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHQgLSBIZWlnaHQgb2YgdGhlIHZpZXdwb3J0LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gb3JpZW50YXRpb24gLSBPcmllbnRhdGlvbiBvZiB0aGUgdmlld3BvcnQuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBBZGQgYSBsaXN0ZW5lciB0byB0aGUgYHJlc2l6ZWAgZXZlbnQuIFRoZSBjYWxsYmFjayBpcyBpbW1lZGlhdGVseVxuICAgKiBpbnZva2VkIHdpdGggdGhlIGN1cnJlbnQgYHdpZHRoYCwgYGhlaWdodGAgYW5kIGBvcmllbnRhdGlvbmAgdmFsdWVzLlxuICAgKlxuICAgKiBAcGFyYW0ge21vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC52aWV3cG9ydH5yZXNpemVDYWxsYmFja30gY2FsbGJhY2sgLVxuICAgKiAgQ2FsbGJhY2sgdG8gYWRkIHRvIGxpc3RlbmVycy5cbiAgICovXG4gIGFkZFJlc2l6ZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzLmFkZChjYWxsYmFjayk7XG4gICAgLy8gZXhlY3V0ZSBpbW1lZGlhdGx5IHdpdGggY3VycmVudCB2YWx1ZXNcbiAgICBjYWxsYmFjayh0aGlzLndpZHRoLCB0aGlzLmhlaWdodCwgdGhpcy5vcmllbnRhdGlvbik7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIGxpc3RlbmVyIGZyb20gdGhlIGByZXNpemVgIGV2ZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge21vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC52aWV3cG9ydH5yZXNpemVDYWxsYmFja30gY2FsbGJhY2sgLVxuICAgKiAgQ2FsbGJhY2sgdG8gcmVtb3ZlIGZyb20gbGlzdGVuZXJzLlxuICAgKi9cbiAgcmVtb3ZlUmVzaXplTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLl9jYWxsYmFja3MuZGVsZXRlKGNhbGxiYWNrKTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHZpZXdwb3J0O1xuIl19