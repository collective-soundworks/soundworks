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
    window.addEventListener('resize', this._onResize);
    //
    this._onResize();
  }

  /**
   * Alias/Middleware for the `EventEmitter` method which applies the callback with current values.
   * @private
   */

  _createClass(Viewport, [{
    key: 'on',
    value: function on(channel, callback) {
      _get(Object.getPrototypeOf(Viewport.prototype), 'on', this).call(this, channel, callback);
      callback(this.orientation, this.width, this.height);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS92aWV3cG9ydC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztzQkFBNkIsUUFBUTs7Ozs7O0lBSy9CLFFBQVE7WUFBUixRQUFROztBQUNELFdBRFAsUUFBUSxHQUNFOzBCQURWLFFBQVE7O0FBRVYsK0JBRkUsUUFBUSw2Q0FFRjs7Ozs7O0FBTVIsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7Ozs7OztBQU1sQixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQzs7Ozs7O0FBTW5CLFFBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDOztBQUV4QixRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzNDLFVBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDOztBQUVsRCxRQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7R0FDbEI7Ozs7Ozs7ZUExQkcsUUFBUTs7V0FnQ1YsWUFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQ3BCLGlDQWpDRSxRQUFRLG9DQWlDRCxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQzVCLGNBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ3JEOzs7V0FFUSxxQkFBRztBQUNWLFVBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztBQUMvQixVQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7QUFDakMsVUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsV0FBVyxHQUFHLFVBQVUsQ0FBQzs7QUFFdkUsVUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUNoRTs7O1NBM0NHLFFBQVE7OztBQTRDYixDQUFDOzs7Ozs7QUFNRixJQUFNLFFBQVEsR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO3FCQUNqQixRQUFRIiwiZmlsZSI6InNyYy9jbGllbnQvZGlzcGxheS92aWV3cG9ydC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5cbi8qKlxuICogU2VydmljZSB0byB0cmFjayB0aGUgdmlld3BvcnQgc2l6ZSBhbmQgb3JpZW50YXRpb24uXG4gKi9cbmNsYXNzIFZpZXdwb3J0IGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIC8qKlxuICAgICAqIFdpZHRoIG9mIHRoZSB2aWV3cG9ydC5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMud2lkdGggPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogSGVpZ2h0IG9mIHRoZSB2aWV3cG9ydC5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuaGVpZ2h0ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIE9yaWVudGF0aW9uIG9mIHRoZSB2aWV3cG9ydCAoJ3BvcnRyYWl0J3wnbGFuZHNjYXBlJykuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLm9yaWVudGF0aW9uID0gbnVsbDtcblxuICAgIHRoaXMuX29uUmVzaXplID0gdGhpcy5fb25SZXNpemUuYmluZCh0aGlzKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fb25SZXNpemUpO1xuICAgIC8vXG4gICAgdGhpcy5fb25SZXNpemUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbGlhcy9NaWRkbGV3YXJlIGZvciB0aGUgYEV2ZW50RW1pdHRlcmAgbWV0aG9kIHdoaWNoIGFwcGxpZXMgdGhlIGNhbGxiYWNrIHdpdGggY3VycmVudCB2YWx1ZXMuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBvbihjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIHN1cGVyLm9uKGNoYW5uZWwsIGNhbGxiYWNrKTtcbiAgICBjYWxsYmFjayh0aGlzLm9yaWVudGF0aW9uLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gIH1cblxuICBfb25SZXNpemUoKSB7XG4gICAgdGhpcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIHRoaXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIHRoaXMub3JpZW50YXRpb24gPSB0aGlzLndpZHRoID4gdGhpcy5oZWlnaHQgPyAnbGFuZHNjYXBlJyA6ICdwb3J0cmFpdCc7XG5cbiAgICB0aGlzLmVtaXQoJ3Jlc2l6ZScsIHRoaXMub3JpZW50YXRpb24sIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgfVxufTtcblxuLyoqXG4gKiBTaW5nbGV0b24gZm9yIHRoZSB3aG9sZSBhcHBsaWNhdGlvbiB0byBiZSB1c2VkIGFzIGEgc2VydmljZS5cbiAqIEB0eXBlIHtWaWV3cG9ydH1cbiAqL1xuY29uc3Qgdmlld3BvcnQgPSBuZXcgVmlld3BvcnQoKTtcbmV4cG9ydCBkZWZhdWx0IHZpZXdwb3J0O1xuIl19