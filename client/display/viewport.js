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

      // console.log(this.width, this.height);
      // document.body.style.width = `${this.width}px`;
      // document.body.style.height = `${this.height}px`;
      // try on iOS
      // document.body.style.marginTop = '1px';
      // window.scrollTo(0, 1);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS92aWV3cG9ydC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztzQkFBNkIsUUFBUTs7Ozs7O0lBSy9CLFFBQVE7WUFBUixRQUFROztBQUNELFdBRFAsUUFBUSxHQUNFOzBCQURWLFFBQVE7O0FBRVYsK0JBRkUsUUFBUSw2Q0FFRjs7Ozs7O0FBTVIsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7Ozs7OztBQU1sQixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQzs7Ozs7O0FBTW5CLFFBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDOztBQUV4QixRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzNDLFVBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFekQsUUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDOztBQUVqQixRQUFJLENBQUMsRUFBRSxDQUFDO0dBQ1Q7Ozs7Ozs7ZUE1QkcsUUFBUTs7V0FrQ0QscUJBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUM3QixpQ0FuQ0UsUUFBUSxnREFtQ1csT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUN4QyxpQ0FwQ0UsUUFBUSw2Q0FvQ1EsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUNyQyxjQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUNyRDs7O1dBRUMsWUFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQ3BCLFVBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ3JDOzs7V0FFUSxxQkFBRztBQUNWLFVBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztBQUMvQixVQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7QUFDakMsVUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsV0FBVyxHQUFHLFVBQVUsQ0FBQzs7Ozs7Ozs7O0FBU3ZFLFVBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDaEU7OztTQXpERyxRQUFROzs7QUEwRGIsQ0FBQzs7Ozs7O0FBTUYsSUFBTSxRQUFRLEdBQUcsSUFBSSxRQUFRLEVBQUUsQ0FBQztxQkFDakIsUUFBUSIsImZpbGUiOiJzcmMvY2xpZW50L2Rpc3BsYXkvdmlld3BvcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuXG4vKipcbiAqIFNlcnZpY2UgdG8gdHJhY2sgdGhlIHZpZXdwb3J0IHNpemUgYW5kIG9yaWVudGF0aW9uLlxuICovXG5jbGFzcyBWaWV3cG9ydCBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICAvKipcbiAgICAgKiBXaWR0aCBvZiB0aGUgdmlld3BvcnQuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLndpZHRoID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEhlaWdodCBvZiB0aGUgdmlld3BvcnQuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmhlaWdodCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBPcmllbnRhdGlvbiBvZiB0aGUgdmlld3BvcnQgKCdwb3J0cmFpdCd8J2xhbmRzY2FwZScpLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5vcmllbnRhdGlvbiA9IG51bGw7XG5cbiAgICB0aGlzLl9vblJlc2l6ZSA9IHRoaXMuX29uUmVzaXplLmJpbmQodGhpcyk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX29uUmVzaXplLCBmYWxzZSk7XG4gICAgLy9cbiAgICB0aGlzLl9vblJlc2l6ZSgpO1xuXG4gICAgdGhpcy5jYjtcbiAgfVxuXG4gIC8qKlxuICAgKiBNaWRkbGV3YXJlIGZvciB0aGUgYEV2ZW50RW1pdHRlcmAgbWV0aG9kIHdoaWNoIGFwcGxpZXMgdGhlIGNhbGxiYWNrIHdpdGggdGhlIGN1cnJlbnQgdmFsdWVzLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgYWRkTGlzdGVuZXIoY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBzdXBlci5yZW1vdmVMaXN0ZW5lcihjaGFubmVsLCBjYWxsYmFjayk7XG4gICAgc3VwZXIuYWRkTGlzdGVuZXIoY2hhbm5lbCwgY2FsbGJhY2spO1xuICAgIGNhbGxiYWNrKHRoaXMub3JpZW50YXRpb24sIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgfVxuXG4gIG9uKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5hZGRMaXN0ZW5lcihjaGFubmVsLCBjYWxsYmFjayk7XG4gIH1cblxuICBfb25SZXNpemUoKSB7XG4gICAgdGhpcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIHRoaXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIHRoaXMub3JpZW50YXRpb24gPSB0aGlzLndpZHRoID4gdGhpcy5oZWlnaHQgPyAnbGFuZHNjYXBlJyA6ICdwb3J0cmFpdCc7XG5cbiAgICAvLyBjb25zb2xlLmxvZyh0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgLy8gZG9jdW1lbnQuYm9keS5zdHlsZS53aWR0aCA9IGAke3RoaXMud2lkdGh9cHhgO1xuICAgIC8vIGRvY3VtZW50LmJvZHkuc3R5bGUuaGVpZ2h0ID0gYCR7dGhpcy5oZWlnaHR9cHhgO1xuICAgIC8vIHRyeSBvbiBpT1NcbiAgICAvLyBkb2N1bWVudC5ib2R5LnN0eWxlLm1hcmdpblRvcCA9ICcxcHgnO1xuICAgIC8vIHdpbmRvdy5zY3JvbGxUbygwLCAxKTtcblxuICAgIHRoaXMuZW1pdCgncmVzaXplJywgdGhpcy5vcmllbnRhdGlvbiwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICB9XG59O1xuXG4vKipcbiAqIFNpbmdsZXRvbiBmb3IgdGhlIHdob2xlIGFwcGxpY2F0aW9uIHRvIGJlIHVzZWQgYXMgYSBzZXJ2aWNlLlxuICogQHR5cGUge1ZpZXdwb3J0fVxuICovXG5jb25zdCB2aWV3cG9ydCA9IG5ldyBWaWV3cG9ydCgpO1xuZXhwb3J0IGRlZmF1bHQgdmlld3BvcnQ7XG4iXX0=