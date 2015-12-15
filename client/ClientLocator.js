'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _ClientModule2 = require('./ClientModule');

var _ClientModule3 = _interopRequireDefault(_ClientModule2);

var _displayView = require('./display/View');

var _displayView2 = _interopRequireDefault(_displayView);

var _displaySquaredView = require('./display/SquaredView');

var _displaySquaredView2 = _interopRequireDefault(_displaySquaredView);

var _displaySpaceView = require('./display/SpaceView');

var _displaySpaceView2 = _interopRequireDefault(_displaySpaceView);

var _displayTouchSurface = require('./display/TouchSurface');

var _displayTouchSurface2 = _interopRequireDefault(_displayTouchSurface);

/**
 * [client] Allow to indicate the approximate location of the client on a map.
 *
 * The module always has a view (that displays the map and a button to validate the location) and requires the SASS partial `_77-locator.scss`.
 *
 * The module finishes its initialization after the user confirms his / her approximate location by clicking on the “Validate” button.
 *
 * (See also {@link src/server/ServerLocator.js~ServerLocator} on the server side.)
 *
 * @example
 * const locator = new ClientLocator();
 */

var ClientLocator = (function (_ClientModule) {
  _inherits(ClientLocator, _ClientModule);

  /**
   * @param {Object} [options={}] - Options.
   * @param {String} [options.name='locator'] - Name of the module.
   * @param {Boolean} [options.showBackground=false] - Indicates whether to show the space background image or not.
   */

  function ClientLocator() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ClientLocator);

    _get(Object.getPrototypeOf(ClientLocator.prototype), 'constructor', this).call(this, options.name || 'locator', options);

    this._attachArea = this._attachArea.bind(this);
    this._onAreaTouchStart = this._onAreaTouchStart.bind(this);
    this._onAreaTouchMove = this._onAreaTouchMove.bind(this);
    this._sendCoordinates = this._sendCoordinates.bind(this);

    this.viewCtor = _displaySquaredView2['default'];
    this.init();
  }

  _createClass(ClientLocator, [{
    key: 'init',
    value: function init() {
      this.content.activateBtn = false;
      this.view = this.createDefaultView();
    }

    /**
     * Start the module.
     * @private
     */
  }, {
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(ClientLocator.prototype), 'start', this).call(this);

      this.send('request');
      this.receive('area', this._attachArea, false);
    }

    /**
     * Done method.
     * Remove the `'resize'` listener on the `window`.
     * @private
     */
  }, {
    key: 'done',
    value: function done() {
      _get(Object.getPrototypeOf(ClientLocator.prototype), 'done', this).call(this);
    }

    /**
     * Create a SpaceView and display it in the square section of the view
     */
  }, {
    key: '_attachArea',
    value: function _attachArea(area) {
      this.area = area;
      this.space = new _displaySpaceView2['default'](area);

      this.view.setViewComponent('.section-square', this.space);
      this.view.render('.section-square');
      // touchSurface on $svg
      this.surface = new _displayTouchSurface2['default'](this.space.$svg);
      this.surface.addListener('touchstart', this._onAreaTouchStart);
      this.surface.addListener('touchmove', this._onAreaTouchMove);
    }
  }, {
    key: '_onAreaTouchStart',
    value: function _onAreaTouchStart(id, normX, normY) {
      if (id !== 0) {
        return;
      }

      if (!this.position) {
        this._createPosition(normX, normY);

        this.content.activateBtn = true;
        this.view.render('.section-float');
        this.view.installEvents({
          'click .btn': this._sendCoordinates
        });
      } else {
        this._updatePosition(normX, normY);
      }
    }
  }, {
    key: '_onAreaTouchMove',
    value: function _onAreaTouchMove(id, normX, normY) {
      if (id !== 0) {
        return;
      }
      this._updatePosition(normX, normY);
    }
  }, {
    key: '_createPosition',
    value: function _createPosition(normX, normY) {
      this.position = {
        id: 'locator',
        x: normX * this.area.width,
        y: normY * this.area.height
      };

      this.space.addPosition(this.position);
    }
  }, {
    key: '_updatePosition',
    value: function _updatePosition(normX, normY) {
      this.position.x = normX * this.area.width;
      this.position.y = normY * this.area.height;

      this.space.updatePosition(this.position);
    }
  }, {
    key: '_sendCoordinates',
    value: function _sendCoordinates() {
      var $btn = this.view.$el.querySelector('.btn');
      $btn.setAttribute('disabled', true);

      _client2['default'].coordinates = this.position;
      this.send('coordinates', _client2['default'].coordinates);
      this.done();
    }
  }]);

  return ClientLocator;
})(_ClientModule3['default']);

exports['default'] = ClientLocator;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3NCQUFtQixVQUFVOzs7OzZCQUNKLGdCQUFnQjs7OzsyQkFFeEIsZ0JBQWdCOzs7O2tDQUNULHVCQUF1Qjs7OztnQ0FDekIscUJBQXFCOzs7O21DQUNsQix3QkFBd0I7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBZTVCLGFBQWE7WUFBYixhQUFhOzs7Ozs7OztBQU1yQixXQU5RLGFBQWEsR0FNTjtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBTkwsYUFBYTs7QUFPOUIsK0JBUGlCLGFBQWEsNkNBT3hCLE9BQU8sQ0FBQyxJQUFJLElBQUksU0FBUyxFQUFFLE9BQU8sRUFBRTs7QUFFMUMsUUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMvQyxRQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMzRCxRQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6RCxRQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFekQsUUFBSSxDQUFDLFFBQVEsa0NBQWMsQ0FBQztBQUM1QixRQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7R0FDYjs7ZUFoQmtCLGFBQWE7O1dBa0I1QixnQkFBRztBQUNMLFVBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztBQUNqQyxVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0tBQ3RDOzs7Ozs7OztXQU1JLGlCQUFHO0FBQ04saUNBNUJpQixhQUFhLHVDQTRCaEI7O0FBRWQsVUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNyQixVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQy9DOzs7Ozs7Ozs7V0FPRyxnQkFBRztBQUNMLGlDQXhDaUIsYUFBYSxzQ0F3Q2pCO0tBQ2Q7Ozs7Ozs7V0FLVSxxQkFBQyxJQUFJLEVBQUU7QUFDaEIsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsVUFBSSxDQUFDLEtBQUssR0FBRyxrQ0FBYyxJQUFJLENBQUMsQ0FBQzs7QUFFakMsVUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDMUQsVUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQzs7QUFFcEMsVUFBSSxDQUFDLE9BQU8sR0FBRyxxQ0FBaUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqRCxVQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDL0QsVUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0tBQzlEOzs7V0FFZ0IsMkJBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDbEMsVUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFFO0FBQUUsZUFBTztPQUFFOztBQUV6QixVQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNsQixZQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFbkMsWUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0FBQ2hDLFlBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDbkMsWUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7QUFDdEIsc0JBQVksRUFBRSxJQUFJLENBQUMsZ0JBQWdCO1NBQ3BDLENBQUMsQ0FBQTtPQUNILE1BQU07QUFDTCxZQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztPQUNwQztLQUNGOzs7V0FFZSwwQkFBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtBQUNqQyxVQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUU7QUFBRSxlQUFPO09BQUU7QUFDekIsVUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDcEM7OztXQUVjLHlCQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDNUIsVUFBSSxDQUFDLFFBQVEsR0FBRztBQUNkLFVBQUUsRUFBRSxTQUFTO0FBQ2IsU0FBQyxFQUFFLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUs7QUFDMUIsU0FBQyxFQUFFLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU07T0FDNUIsQ0FBQTs7QUFFRCxVQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDdkM7OztXQUVjLHlCQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDNUIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQzFDLFVBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7QUFFM0MsVUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQzFDOzs7V0FFZSw0QkFBRztBQUNqQixVQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDakQsVUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7O0FBRXBDLDBCQUFPLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQ25DLFVBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLG9CQUFPLFdBQVcsQ0FBQyxDQUFDO0FBQzdDLFVBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNiOzs7U0F2R2tCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6InNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IENsaWVudE1vZHVsZSBmcm9tICcuL0NsaWVudE1vZHVsZSc7XG5cbmltcG9ydCBWaWV3IGZyb20gJy4vZGlzcGxheS9WaWV3JztcbmltcG9ydCBTcXVhcmVkVmlldyBmcm9tICcuL2Rpc3BsYXkvU3F1YXJlZFZpZXcnO1xuaW1wb3J0IFNwYWNlVmlldyBmcm9tICcuL2Rpc3BsYXkvU3BhY2VWaWV3JztcbmltcG9ydCBUb3VjaFN1cmZhY2UgZnJvbSAnLi9kaXNwbGF5L1RvdWNoU3VyZmFjZSc7XG5cblxuLyoqXG4gKiBbY2xpZW50XSBBbGxvdyB0byBpbmRpY2F0ZSB0aGUgYXBwcm94aW1hdGUgbG9jYXRpb24gb2YgdGhlIGNsaWVudCBvbiBhIG1hcC5cbiAqXG4gKiBUaGUgbW9kdWxlIGFsd2F5cyBoYXMgYSB2aWV3ICh0aGF0IGRpc3BsYXlzIHRoZSBtYXAgYW5kIGEgYnV0dG9uIHRvIHZhbGlkYXRlIHRoZSBsb2NhdGlvbikgYW5kIHJlcXVpcmVzIHRoZSBTQVNTIHBhcnRpYWwgYF83Ny1sb2NhdG9yLnNjc3NgLlxuICpcbiAqIFRoZSBtb2R1bGUgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uIGFmdGVyIHRoZSB1c2VyIGNvbmZpcm1zIGhpcyAvIGhlciBhcHByb3hpbWF0ZSBsb2NhdGlvbiBieSBjbGlja2luZyBvbiB0aGUg4oCcVmFsaWRhdGXigJ0gYnV0dG9uLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL3NlcnZlci9TZXJ2ZXJMb2NhdG9yLmpzflNlcnZlckxvY2F0b3J9IG9uIHRoZSBzZXJ2ZXIgc2lkZS4pXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IGxvY2F0b3IgPSBuZXcgQ2xpZW50TG9jYXRvcigpO1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnRMb2NhdG9yIGV4dGVuZHMgQ2xpZW50TW9kdWxlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gLSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nbG9jYXRvciddIC0gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnNob3dCYWNrZ3JvdW5kPWZhbHNlXSAtIEluZGljYXRlcyB3aGV0aGVyIHRvIHNob3cgdGhlIHNwYWNlIGJhY2tncm91bmQgaW1hZ2Ugb3Igbm90LlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdsb2NhdG9yJywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9hdHRhY2hBcmVhID0gdGhpcy5fYXR0YWNoQXJlYS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uQXJlYVRvdWNoU3RhcnQgPSB0aGlzLl9vbkFyZWFUb3VjaFN0YXJ0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25BcmVhVG91Y2hNb3ZlID0gdGhpcy5fb25BcmVhVG91Y2hNb3ZlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fc2VuZENvb3JkaW5hdGVzID0gdGhpcy5fc2VuZENvb3JkaW5hdGVzLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLnZpZXdDdG9yID0gU3F1YXJlZFZpZXc7XG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIHRoaXMuY29udGVudC5hY3RpdmF0ZUJ0biA9IGZhbHNlO1xuICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlRGVmYXVsdFZpZXcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgbW9kdWxlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIHRoaXMuc2VuZCgncmVxdWVzdCcpO1xuICAgIHRoaXMucmVjZWl2ZSgnYXJlYScsIHRoaXMuX2F0dGFjaEFyZWEsIGZhbHNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEb25lIG1ldGhvZC5cbiAgICogUmVtb3ZlIHRoZSBgJ3Jlc2l6ZSdgIGxpc3RlbmVyIG9uIHRoZSBgd2luZG93YC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRvbmUoKSB7XG4gICAgc3VwZXIuZG9uZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIFNwYWNlVmlldyBhbmQgZGlzcGxheSBpdCBpbiB0aGUgc3F1YXJlIHNlY3Rpb24gb2YgdGhlIHZpZXdcbiAgICovXG4gIF9hdHRhY2hBcmVhKGFyZWEpIHtcbiAgICB0aGlzLmFyZWEgPSBhcmVhO1xuICAgIHRoaXMuc3BhY2UgPSBuZXcgU3BhY2VWaWV3KGFyZWEpO1xuXG4gICAgdGhpcy52aWV3LnNldFZpZXdDb21wb25lbnQoJy5zZWN0aW9uLXNxdWFyZScsIHRoaXMuc3BhY2UpO1xuICAgIHRoaXMudmlldy5yZW5kZXIoJy5zZWN0aW9uLXNxdWFyZScpO1xuICAgIC8vIHRvdWNoU3VyZmFjZSBvbiAkc3ZnXG4gICAgdGhpcy5zdXJmYWNlID0gbmV3IFRvdWNoU3VyZmFjZSh0aGlzLnNwYWNlLiRzdmcpO1xuICAgIHRoaXMuc3VyZmFjZS5hZGRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuX29uQXJlYVRvdWNoU3RhcnQpO1xuICAgIHRoaXMuc3VyZmFjZS5hZGRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5fb25BcmVhVG91Y2hNb3ZlKTtcbiAgfVxuXG4gIF9vbkFyZWFUb3VjaFN0YXJ0KGlkLCBub3JtWCwgbm9ybVkpIHtcbiAgICBpZiAoaWQgIT09IDApIHsgcmV0dXJuOyB9XG5cbiAgICBpZiAoIXRoaXMucG9zaXRpb24pIHtcbiAgICAgIHRoaXMuX2NyZWF0ZVBvc2l0aW9uKG5vcm1YLCBub3JtWSk7XG5cbiAgICAgIHRoaXMuY29udGVudC5hY3RpdmF0ZUJ0biA9IHRydWU7XG4gICAgICB0aGlzLnZpZXcucmVuZGVyKCcuc2VjdGlvbi1mbG9hdCcpO1xuICAgICAgdGhpcy52aWV3Lmluc3RhbGxFdmVudHMoe1xuICAgICAgICAnY2xpY2sgLmJ0bic6IHRoaXMuX3NlbmRDb29yZGluYXRlcyxcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVBvc2l0aW9uKG5vcm1YLCBub3JtWSk7XG4gICAgfVxuICB9XG5cbiAgX29uQXJlYVRvdWNoTW92ZShpZCwgbm9ybVgsIG5vcm1ZKSB7XG4gICAgaWYgKGlkICE9PSAwKSB7IHJldHVybjsgfVxuICAgIHRoaXMuX3VwZGF0ZVBvc2l0aW9uKG5vcm1YLCBub3JtWSk7XG4gIH1cblxuICBfY3JlYXRlUG9zaXRpb24obm9ybVgsIG5vcm1ZKSB7XG4gICAgdGhpcy5wb3NpdGlvbiA9IHtcbiAgICAgIGlkOiAnbG9jYXRvcicsXG4gICAgICB4OiBub3JtWCAqIHRoaXMuYXJlYS53aWR0aCxcbiAgICAgIHk6IG5vcm1ZICogdGhpcy5hcmVhLmhlaWdodCxcbiAgICB9XG5cbiAgICB0aGlzLnNwYWNlLmFkZFBvc2l0aW9uKHRoaXMucG9zaXRpb24pO1xuICB9XG5cbiAgX3VwZGF0ZVBvc2l0aW9uKG5vcm1YLCBub3JtWSkge1xuICAgIHRoaXMucG9zaXRpb24ueCA9IG5vcm1YICogdGhpcy5hcmVhLndpZHRoO1xuICAgIHRoaXMucG9zaXRpb24ueSA9IG5vcm1ZICogdGhpcy5hcmVhLmhlaWdodDtcblxuICAgIHRoaXMuc3BhY2UudXBkYXRlUG9zaXRpb24odGhpcy5wb3NpdGlvbik7XG4gIH1cblxuICBfc2VuZENvb3JkaW5hdGVzKCkge1xuICAgIGNvbnN0ICRidG4gPSB0aGlzLnZpZXcuJGVsLnF1ZXJ5U2VsZWN0b3IoJy5idG4nKTtcbiAgICAkYnRuLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCB0cnVlKTtcblxuICAgIGNsaWVudC5jb29yZGluYXRlcyA9IHRoaXMucG9zaXRpb247XG4gICAgdGhpcy5zZW5kKCdjb29yZGluYXRlcycsIGNsaWVudC5jb29yZGluYXRlcyk7XG4gICAgdGhpcy5kb25lKCk7XG4gIH1cbn1cbiJdfQ==