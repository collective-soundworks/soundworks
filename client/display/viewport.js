'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _events = require('events');

/**
 * Service to track the viewport size and orientation.
 */

var Viewport = (function (_EventEmitter) {
  _inherits(Viewport, _EventEmitter);

  function Viewport() {
    _classCallCheck(this, Viewport);

    _get(Object.getPrototypeOf(Viewport.prototype), 'constructor', this).call(this);

    /**
     * Width of the viewport.
     * @type {Number}
     */
    this.width = null;

    /**
     * Height of the viewport.
     * @type {Number}
     */
    this.height = null;

    /**
     * Orientation of the viewport ('portrait'|'landscape').
     * @type {String}
     */
    this.orientation = null;

    this._onResize = this._onResize.bind(this);
    window.addEventListener('resize', this._onResize, false);
    //
    this._onResize();

    this.cb;
  }

  /**
   * Middleware for the `EventEmitter` method which applies the callback with the current values.
   * @private
   */

  _createClass(Viewport, [{
    key: 'addListener',
    value: function addListener(channel, callback) {
      _get(Object.getPrototypeOf(Viewport.prototype), 'removeListener', this).call(this, channel, callback);
      _get(Object.getPrototypeOf(Viewport.prototype), 'addListener', this).call(this, channel, callback);
      callback(this.orientation, this.width, this.height);
    }
  }, {
    key: 'on',
    value: function on(channel, callback) {
      this.addListener(channel, callback);
    }
  }, {
    key: '_onResize',
    value: function _onResize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.orientation = this.width > this.height ? 'landscape' : 'portrait';

      this.emit('resize', this.orientation, this.width, this.height);
    }
  }]);

  return Viewport;
})(_events.EventEmitter);

;

/**
 * Singleton for the whole application to be used as a service.
 * @type {Viewport}
 */
var viewport = new Viewport();
exports['default'] = viewport;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztzQkFBNkIsUUFBUTs7Ozs7O0lBSy9CLFFBQVE7WUFBUixRQUFROztBQUNELFdBRFAsUUFBUSxHQUNFOzBCQURWLFFBQVE7O0FBRVYsK0JBRkUsUUFBUSw2Q0FFRjs7Ozs7O0FBTVIsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7Ozs7OztBQU1sQixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQzs7Ozs7O0FBTW5CLFFBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDOztBQUV4QixRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzNDLFVBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFekQsUUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDOztBQUVqQixRQUFJLENBQUMsRUFBRSxDQUFDO0dBQ1Q7Ozs7Ozs7ZUE1QkcsUUFBUTs7V0FrQ0QscUJBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUM3QixpQ0FuQ0UsUUFBUSxnREFtQ1csT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUN4QyxpQ0FwQ0UsUUFBUSw2Q0FvQ1EsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUNyQyxjQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUNyRDs7O1dBRUMsWUFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQ3BCLFVBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ3JDOzs7V0FFUSxxQkFBRztBQUNWLFVBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztBQUMvQixVQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7QUFDakMsVUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsV0FBVyxHQUFHLFVBQVUsQ0FBQzs7QUFFdkUsVUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUNoRTs7O1NBbERHLFFBQVE7OztBQW1EYixDQUFDOzs7Ozs7QUFNRixJQUFNLFFBQVEsR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO3FCQUNqQixRQUFRIiwiZmlsZSI6InNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5cbi8qKlxuICogU2VydmljZSB0byB0cmFjayB0aGUgdmlld3BvcnQgc2l6ZSBhbmQgb3JpZW50YXRpb24uXG4gKi9cbmNsYXNzIFZpZXdwb3J0IGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIC8qKlxuICAgICAqIFdpZHRoIG9mIHRoZSB2aWV3cG9ydC5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMud2lkdGggPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogSGVpZ2h0IG9mIHRoZSB2aWV3cG9ydC5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuaGVpZ2h0ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIE9yaWVudGF0aW9uIG9mIHRoZSB2aWV3cG9ydCAoJ3BvcnRyYWl0J3wnbGFuZHNjYXBlJykuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLm9yaWVudGF0aW9uID0gbnVsbDtcblxuICAgIHRoaXMuX29uUmVzaXplID0gdGhpcy5fb25SZXNpemUuYmluZCh0aGlzKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fb25SZXNpemUsIGZhbHNlKTtcbiAgICAvL1xuICAgIHRoaXMuX29uUmVzaXplKCk7XG5cbiAgICB0aGlzLmNiO1xuICB9XG5cbiAgLyoqXG4gICAqIE1pZGRsZXdhcmUgZm9yIHRoZSBgRXZlbnRFbWl0dGVyYCBtZXRob2Qgd2hpY2ggYXBwbGllcyB0aGUgY2FsbGJhY2sgd2l0aCB0aGUgY3VycmVudCB2YWx1ZXMuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBhZGRMaXN0ZW5lcihjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIHN1cGVyLnJlbW92ZUxpc3RlbmVyKGNoYW5uZWwsIGNhbGxiYWNrKTtcbiAgICBzdXBlci5hZGRMaXN0ZW5lcihjaGFubmVsLCBjYWxsYmFjayk7XG4gICAgY2FsbGJhY2sodGhpcy5vcmllbnRhdGlvbiwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICB9XG5cbiAgb24oY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICB0aGlzLmFkZExpc3RlbmVyKGNoYW5uZWwsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIF9vblJlc2l6ZSgpIHtcbiAgICB0aGlzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgdGhpcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgdGhpcy5vcmllbnRhdGlvbiA9IHRoaXMud2lkdGggPiB0aGlzLmhlaWdodCA/ICdsYW5kc2NhcGUnIDogJ3BvcnRyYWl0JztcblxuICAgIHRoaXMuZW1pdCgncmVzaXplJywgdGhpcy5vcmllbnRhdGlvbiwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICB9XG59O1xuXG4vKipcbiAqIFNpbmdsZXRvbiBmb3IgdGhlIHdob2xlIGFwcGxpY2F0aW9uIHRvIGJlIHVzZWQgYXMgYSBzZXJ2aWNlLlxuICogQHR5cGUge1ZpZXdwb3J0fVxuICovXG5jb25zdCB2aWV3cG9ydCA9IG5ldyBWaWV3cG9ydCgpO1xuZXhwb3J0IGRlZmF1bHQgdmlld3BvcnQ7XG4iXX0=