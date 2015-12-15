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
      this.space = new this.spaceCtor(area);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50TG9jYXRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3NCQUFtQixVQUFVOzs7OzZCQUNKLGdCQUFnQjs7OzsyQkFFeEIsZ0JBQWdCOzs7O2tDQUNULHVCQUF1Qjs7OztnQ0FDekIscUJBQXFCOzs7O21DQUNsQix3QkFBd0I7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBZTVCLGFBQWE7WUFBYixhQUFhOzs7Ozs7OztBQU1yQixXQU5RLGFBQWEsR0FNTjtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBTkwsYUFBYTs7QUFPOUIsK0JBUGlCLGFBQWEsNkNBT3hCLE9BQU8sQ0FBQyxJQUFJLElBQUksU0FBUyxFQUFFLE9BQU8sRUFBRTs7QUFFMUMsUUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMvQyxRQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMzRCxRQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6RCxRQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFekQsUUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxpQ0FBYSxDQUFDO0FBQ2hELFFBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsbUNBQWUsQ0FBQztBQUNoRCxRQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7R0FDYjs7ZUFqQmtCLGFBQWE7O1dBbUI1QixnQkFBRztBQUNMLFVBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztBQUNqQyxVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxp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QUMxQzs7O1dBRWUsNEJBQUc7QUFDakIsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2pELFVBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDOztBQUVwQywwQkFBTyxXQUFXLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztBQUNuQyxVQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxvQkFBTyxXQUFXLENBQUMsQ0FBQztBQUM3QyxVQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDYjs7O1NBeEdrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiJzcmMvY2xpZW50L0NsaWVudExvY2F0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCBDbGllbnRNb2R1bGUgZnJvbSAnLi9DbGllbnRNb2R1bGUnO1xuXG5pbXBvcnQgVmlldyBmcm9tICcuL2Rpc3BsYXkvVmlldyc7XG5pbXBvcnQgU3F1YXJlZFZpZXcgZnJvbSAnLi9kaXNwbGF5L1NxdWFyZWRWaWV3JztcbmltcG9ydCBTcGFjZVZpZXcgZnJvbSAnLi9kaXNwbGF5L1NwYWNlVmlldyc7XG5pbXBvcnQgVG91Y2hTdXJmYWNlIGZyb20gJy4vZGlzcGxheS9Ub3VjaFN1cmZhY2UnO1xuXG5cbi8qKlxuICogW2NsaWVudF0gQWxsb3cgdG8gaW5kaWNhdGUgdGhlIGFwcHJveGltYXRlIGxvY2F0aW9uIG9mIHRoZSBjbGllbnQgb24gYSBtYXAuXG4gKlxuICogVGhlIG1vZHVsZSBhbHdheXMgaGFzIGEgdmlldyAodGhhdCBkaXNwbGF5cyB0aGUgbWFwIGFuZCBhIGJ1dHRvbiB0byB2YWxpZGF0ZSB0aGUgbG9jYXRpb24pIGFuZCByZXF1aXJlcyB0aGUgU0FTUyBwYXJ0aWFsIGBfNzctbG9jYXRvci5zY3NzYC5cbiAqXG4gKiBUaGUgbW9kdWxlIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbiBhZnRlciB0aGUgdXNlciBjb25maXJtcyBoaXMgLyBoZXIgYXBwcm94aW1hdGUgbG9jYXRpb24gYnkgY2xpY2tpbmcgb24gdGhlIOKAnFZhbGlkYXRl4oCdIGJ1dHRvbi5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9zZXJ2ZXIvU2VydmVyTG9jYXRvci5qc35TZXJ2ZXJMb2NhdG9yfSBvbiB0aGUgc2VydmVyIHNpZGUuKVxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCBsb2NhdG9yID0gbmV3IENsaWVudExvY2F0b3IoKTtcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50TG9jYXRvciBleHRlbmRzIENsaWVudE1vZHVsZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIC0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm5hbWU9J2xvY2F0b3InXSAtIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5zaG93QmFja2dyb3VuZD1mYWxzZV0gLSBJbmRpY2F0ZXMgd2hldGhlciB0byBzaG93IHRoZSBzcGFjZSBiYWNrZ3JvdW5kIGltYWdlIG9yIG5vdC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnbG9jYXRvcicsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5fYXR0YWNoQXJlYSA9IHRoaXMuX2F0dGFjaEFyZWEuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkFyZWFUb3VjaFN0YXJ0ID0gdGhpcy5fb25BcmVhVG91Y2hTdGFydC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uQXJlYVRvdWNoTW92ZSA9IHRoaXMuX29uQXJlYVRvdWNoTW92ZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX3NlbmRDb29yZGluYXRlcyA9IHRoaXMuX3NlbmRDb29yZGluYXRlcy5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5zcGFjZUN0b3IgPSBvcHRpb25zLnNwYWNlQ3RvciB8fMKgU3BhY2VWaWV3O1xuICAgIHRoaXMudmlld0N0b3IgPSBvcHRpb25zLnZpZXdDdG9yIHx8wqBTcXVhcmVkVmlldztcbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy5jb250ZW50LmFjdGl2YXRlQnRuID0gZmFsc2U7XG4gICAgdGhpcy52aWV3ID0gdGhpcy5jcmVhdGVEZWZhdWx0VmlldygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBtb2R1bGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgdGhpcy5zZW5kKCdyZXF1ZXN0Jyk7XG4gICAgdGhpcy5yZWNlaXZlKCdhcmVhJywgdGhpcy5fYXR0YWNoQXJlYSwgZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIERvbmUgbWV0aG9kLlxuICAgKiBSZW1vdmUgdGhlIGAncmVzaXplJ2AgbGlzdGVuZXIgb24gdGhlIGB3aW5kb3dgLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZG9uZSgpIHtcbiAgICBzdXBlci5kb25lKCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgU3BhY2VWaWV3IGFuZCBkaXNwbGF5IGl0IGluIHRoZSBzcXVhcmUgc2VjdGlvbiBvZiB0aGUgdmlld1xuICAgKi9cbiAgX2F0dGFjaEFyZWEoYXJlYSkge1xuICAgIHRoaXMuYXJlYSA9IGFyZWE7XG4gICAgdGhpcy5zcGFjZSA9IG5ldyB0aGlzLnNwYWNlQ3RvcihhcmVhKTtcblxuICAgIHRoaXMudmlldy5zZXRWaWV3Q29tcG9uZW50KCcuc2VjdGlvbi1zcXVhcmUnLCB0aGlzLnNwYWNlKTtcbiAgICB0aGlzLnZpZXcucmVuZGVyKCcuc2VjdGlvbi1zcXVhcmUnKTtcbiAgICAvLyB0b3VjaFN1cmZhY2Ugb24gJHN2Z1xuICAgIHRoaXMuc3VyZmFjZSA9IG5ldyBUb3VjaFN1cmZhY2UodGhpcy5zcGFjZS4kc3ZnKTtcbiAgICB0aGlzLnN1cmZhY2UuYWRkTGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9vbkFyZWFUb3VjaFN0YXJ0KTtcbiAgICB0aGlzLnN1cmZhY2UuYWRkTGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMuX29uQXJlYVRvdWNoTW92ZSk7XG4gIH1cblxuICBfb25BcmVhVG91Y2hTdGFydChpZCwgbm9ybVgsIG5vcm1ZKSB7XG4gICAgaWYgKGlkICE9PSAwKSB7IHJldHVybjsgfVxuXG4gICAgaWYgKCF0aGlzLnBvc2l0aW9uKSB7XG4gICAgICB0aGlzLl9jcmVhdGVQb3NpdGlvbihub3JtWCwgbm9ybVkpO1xuXG4gICAgICB0aGlzLmNvbnRlbnQuYWN0aXZhdGVCdG4gPSB0cnVlO1xuICAgICAgdGhpcy52aWV3LnJlbmRlcignLnNlY3Rpb24tZmxvYXQnKTtcbiAgICAgIHRoaXMudmlldy5pbnN0YWxsRXZlbnRzKHtcbiAgICAgICAgJ2NsaWNrIC5idG4nOiB0aGlzLl9zZW5kQ29vcmRpbmF0ZXMsXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl91cGRhdGVQb3NpdGlvbihub3JtWCwgbm9ybVkpO1xuICAgIH1cbiAgfVxuXG4gIF9vbkFyZWFUb3VjaE1vdmUoaWQsIG5vcm1YLCBub3JtWSkge1xuICAgIGlmIChpZCAhPT0gMCkgeyByZXR1cm47IH1cbiAgICB0aGlzLl91cGRhdGVQb3NpdGlvbihub3JtWCwgbm9ybVkpO1xuICB9XG5cbiAgX2NyZWF0ZVBvc2l0aW9uKG5vcm1YLCBub3JtWSkge1xuICAgIHRoaXMucG9zaXRpb24gPSB7XG4gICAgICBpZDogJ2xvY2F0b3InLFxuICAgICAgeDogbm9ybVggKiB0aGlzLmFyZWEud2lkdGgsXG4gICAgICB5OiBub3JtWSAqIHRoaXMuYXJlYS5oZWlnaHQsXG4gICAgfVxuXG4gICAgdGhpcy5zcGFjZS5hZGRQb3NpdGlvbih0aGlzLnBvc2l0aW9uKTtcbiAgfVxuXG4gIF91cGRhdGVQb3NpdGlvbihub3JtWCwgbm9ybVkpIHtcbiAgICB0aGlzLnBvc2l0aW9uLnggPSBub3JtWCAqIHRoaXMuYXJlYS53aWR0aDtcbiAgICB0aGlzLnBvc2l0aW9uLnkgPSBub3JtWSAqIHRoaXMuYXJlYS5oZWlnaHQ7XG5cbiAgICB0aGlzLnNwYWNlLnVwZGF0ZVBvc2l0aW9uKHRoaXMucG9zaXRpb24pO1xuICB9XG5cbiAgX3NlbmRDb29yZGluYXRlcygpIHtcbiAgICBjb25zdCAkYnRuID0gdGhpcy52aWV3LiRlbC5xdWVyeVNlbGVjdG9yKCcuYnRuJyk7XG4gICAgJGJ0bi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgdHJ1ZSk7XG5cbiAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSB0aGlzLnBvc2l0aW9uO1xuICAgIHRoaXMuc2VuZCgnY29vcmRpbmF0ZXMnLCBjbGllbnQuY29vcmRpbmF0ZXMpO1xuICAgIHRoaXMuZG9uZSgpO1xuICB9XG59XG4iXX0=