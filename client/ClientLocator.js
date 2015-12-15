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

    this.spaceCtor = options.spaceCtor || _displaySpaceView2['default'];
    this.viewCtor = options.viewCtor || _displaySquaredView2['default'];
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
      this.space = new this.spaceCtor(area, {}, { isSubView: true });
      // @todo - find a way to remove these hardcoded selectors
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50TG9jYXRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3NCQUFtQixVQUFVOzs7OzZCQUNKLGdCQUFnQjs7OzsyQkFFeEIsZ0JBQWdCOzs7O2tDQUNULHVCQUF1Qjs7OztnQ0FDekIscUJBQXFCOzs7O21DQUNsQix3QkFBd0I7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBZTVCLGFBQWE7WUFBYixhQUFhOzs7Ozs7OztBQU1yQixXQU5RLGFBQWEsR0FNTjtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBTkwsYUFBYTs7QUFPOUIsK0JBUGlCLGFBQWEsNkNBT3hCLE9BQU8sQ0FBQyxJQUFJLElBQUksU0FBUyxFQUFFLE9BQU8sRUFBRTs7QUFFMUMsUUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMvQyxRQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMzRCxRQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6RCxRQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFekQsUUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxpQ0FBYSxDQUFDO0FBQ2hELFFBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsbUNBQWUsQ0FBQztBQUNoRCxRQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7R0FDYjs7ZUFqQmtCLGFBQWE7O1dBbUI1QixnQkFBRztBQUNMLFVBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztBQUNqQyxVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxp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QUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDMUM7OztXQUVlLDRCQUFHO0FBQ2pCLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNqRCxVQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQzs7QUFFcEMsMEJBQU8sV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDbkMsVUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsb0JBQU8sV0FBVyxDQUFDLENBQUM7QUFDN0MsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2I7OztTQXhHa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoic3JjL2NsaWVudC9DbGllbnRMb2NhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgQ2xpZW50TW9kdWxlIGZyb20gJy4vQ2xpZW50TW9kdWxlJztcblxuaW1wb3J0IFZpZXcgZnJvbSAnLi9kaXNwbGF5L1ZpZXcnO1xuaW1wb3J0IFNxdWFyZWRWaWV3IGZyb20gJy4vZGlzcGxheS9TcXVhcmVkVmlldyc7XG5pbXBvcnQgU3BhY2VWaWV3IGZyb20gJy4vZGlzcGxheS9TcGFjZVZpZXcnO1xuaW1wb3J0IFRvdWNoU3VyZmFjZSBmcm9tICcuL2Rpc3BsYXkvVG91Y2hTdXJmYWNlJztcblxuXG4vKipcbiAqIFtjbGllbnRdIEFsbG93IHRvIGluZGljYXRlIHRoZSBhcHByb3hpbWF0ZSBsb2NhdGlvbiBvZiB0aGUgY2xpZW50IG9uIGEgbWFwLlxuICpcbiAqIFRoZSBtb2R1bGUgYWx3YXlzIGhhcyBhIHZpZXcgKHRoYXQgZGlzcGxheXMgdGhlIG1hcCBhbmQgYSBidXR0b24gdG8gdmFsaWRhdGUgdGhlIGxvY2F0aW9uKSBhbmQgcmVxdWlyZXMgdGhlIFNBU1MgcGFydGlhbCBgXzc3LWxvY2F0b3Iuc2Nzc2AuXG4gKlxuICogVGhlIG1vZHVsZSBmaW5pc2hlcyBpdHMgaW5pdGlhbGl6YXRpb24gYWZ0ZXIgdGhlIHVzZXIgY29uZmlybXMgaGlzIC8gaGVyIGFwcHJveGltYXRlIGxvY2F0aW9uIGJ5IGNsaWNraW5nIG9uIHRoZSDigJxWYWxpZGF0ZeKAnSBidXR0b24uXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvc2VydmVyL1NlcnZlckxvY2F0b3IuanN+U2VydmVyTG9jYXRvcn0gb24gdGhlIHNlcnZlciBzaWRlLilcbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgbG9jYXRvciA9IG5ldyBDbGllbnRMb2NhdG9yKCk7XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudExvY2F0b3IgZXh0ZW5kcyBDbGllbnRNb2R1bGUge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSAtIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdsb2NhdG9yJ10gLSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuc2hvd0JhY2tncm91bmQ9ZmFsc2VdIC0gSW5kaWNhdGVzIHdoZXRoZXIgdG8gc2hvdyB0aGUgc3BhY2UgYmFja2dyb3VuZCBpbWFnZSBvciBub3QuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ2xvY2F0b3InLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX2F0dGFjaEFyZWEgPSB0aGlzLl9hdHRhY2hBcmVhLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25BcmVhVG91Y2hTdGFydCA9IHRoaXMuX29uQXJlYVRvdWNoU3RhcnQuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkFyZWFUb3VjaE1vdmUgPSB0aGlzLl9vbkFyZWFUb3VjaE1vdmUuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9zZW5kQ29vcmRpbmF0ZXMgPSB0aGlzLl9zZW5kQ29vcmRpbmF0ZXMuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuc3BhY2VDdG9yID0gb3B0aW9ucy5zcGFjZUN0b3IgfHzCoFNwYWNlVmlldztcbiAgICB0aGlzLnZpZXdDdG9yID0gb3B0aW9ucy52aWV3Q3RvciB8fMKgU3F1YXJlZFZpZXc7XG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIHRoaXMuY29udGVudC5hY3RpdmF0ZUJ0biA9IGZhbHNlO1xuICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlRGVmYXVsdFZpZXcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgbW9kdWxlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIHRoaXMuc2VuZCgncmVxdWVzdCcpO1xuICAgIHRoaXMucmVjZWl2ZSgnYXJlYScsIHRoaXMuX2F0dGFjaEFyZWEsIGZhbHNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEb25lIG1ldGhvZC5cbiAgICogUmVtb3ZlIHRoZSBgJ3Jlc2l6ZSdgIGxpc3RlbmVyIG9uIHRoZSBgd2luZG93YC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRvbmUoKSB7XG4gICAgc3VwZXIuZG9uZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIFNwYWNlVmlldyBhbmQgZGlzcGxheSBpdCBpbiB0aGUgc3F1YXJlIHNlY3Rpb24gb2YgdGhlIHZpZXdcbiAgICovXG4gIF9hdHRhY2hBcmVhKGFyZWEpIHtcbiAgICB0aGlzLmFyZWEgPSBhcmVhO1xuICAgIHRoaXMuc3BhY2UgPSBuZXcgdGhpcy5zcGFjZUN0b3IoYXJlYSwge30sIHsgaXNTdWJWaWV3OiB0cnVlIH0pO1xuICAgIC8vIEB0b2RvIC0gZmluZCBhIHdheSB0byByZW1vdmUgdGhlc2UgaGFyZGNvZGVkIHNlbGVjdG9yc1xuICAgIHRoaXMudmlldy5zZXRWaWV3Q29tcG9uZW50KCcuc2VjdGlvbi1zcXVhcmUnLCB0aGlzLnNwYWNlKTtcbiAgICB0aGlzLnZpZXcucmVuZGVyKCcuc2VjdGlvbi1zcXVhcmUnKTtcbiAgICAvLyB0b3VjaFN1cmZhY2Ugb24gJHN2Z1xuICAgIHRoaXMuc3VyZmFjZSA9IG5ldyBUb3VjaFN1cmZhY2UodGhpcy5zcGFjZS4kc3ZnKTtcbiAgICB0aGlzLnN1cmZhY2UuYWRkTGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9vbkFyZWFUb3VjaFN0YXJ0KTtcbiAgICB0aGlzLnN1cmZhY2UuYWRkTGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMuX29uQXJlYVRvdWNoTW92ZSk7XG4gIH1cblxuICBfb25BcmVhVG91Y2hTdGFydChpZCwgbm9ybVgsIG5vcm1ZKSB7XG4gICAgaWYgKGlkICE9PSAwKSB7IHJldHVybjsgfVxuXG4gICAgaWYgKCF0aGlzLnBvc2l0aW9uKSB7XG4gICAgICB0aGlzLl9jcmVhdGVQb3NpdGlvbihub3JtWCwgbm9ybVkpO1xuXG4gICAgICB0aGlzLmNvbnRlbnQuYWN0aXZhdGVCdG4gPSB0cnVlO1xuICAgICAgdGhpcy52aWV3LnJlbmRlcignLnNlY3Rpb24tZmxvYXQnKTtcbiAgICAgIHRoaXMudmlldy5pbnN0YWxsRXZlbnRzKHtcbiAgICAgICAgJ2NsaWNrIC5idG4nOiB0aGlzLl9zZW5kQ29vcmRpbmF0ZXMsXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl91cGRhdGVQb3NpdGlvbihub3JtWCwgbm9ybVkpO1xuICAgIH1cbiAgfVxuXG4gIF9vbkFyZWFUb3VjaE1vdmUoaWQsIG5vcm1YLCBub3JtWSkge1xuICAgIGlmIChpZCAhPT0gMCkgeyByZXR1cm47IH1cbiAgICB0aGlzLl91cGRhdGVQb3NpdGlvbihub3JtWCwgbm9ybVkpO1xuICB9XG5cbiAgX2NyZWF0ZVBvc2l0aW9uKG5vcm1YLCBub3JtWSkge1xuICAgIHRoaXMucG9zaXRpb24gPSB7XG4gICAgICBpZDogJ2xvY2F0b3InLFxuICAgICAgeDogbm9ybVggKiB0aGlzLmFyZWEud2lkdGgsXG4gICAgICB5OiBub3JtWSAqIHRoaXMuYXJlYS5oZWlnaHQsXG4gICAgfVxuXG4gICAgdGhpcy5zcGFjZS5hZGRQb3NpdGlvbih0aGlzLnBvc2l0aW9uKTtcbiAgfVxuXG4gIF91cGRhdGVQb3NpdGlvbihub3JtWCwgbm9ybVkpIHtcbiAgICB0aGlzLnBvc2l0aW9uLnggPSBub3JtWCAqIHRoaXMuYXJlYS53aWR0aDtcbiAgICB0aGlzLnBvc2l0aW9uLnkgPSBub3JtWSAqIHRoaXMuYXJlYS5oZWlnaHQ7XG5cbiAgICB0aGlzLnNwYWNlLnVwZGF0ZVBvc2l0aW9uKHRoaXMucG9zaXRpb24pO1xuICB9XG5cbiAgX3NlbmRDb29yZGluYXRlcygpIHtcbiAgICBjb25zdCAkYnRuID0gdGhpcy52aWV3LiRlbC5xdWVyeVNlbGVjdG9yKCcuYnRuJyk7XG4gICAgJGJ0bi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgdHJ1ZSk7XG5cbiAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSB0aGlzLnBvc2l0aW9uO1xuICAgIHRoaXMuc2VuZCgnY29vcmRpbmF0ZXMnLCBjbGllbnQuY29vcmRpbmF0ZXMpO1xuICAgIHRoaXMuZG9uZSgpO1xuICB9XG59XG4iXX0=