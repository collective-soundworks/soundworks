'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreClient = require('../core/client');

var _coreClient2 = _interopRequireDefault(_coreClient);

// import localStorage from './localStorage'; // @todo - rethink this with db

var _coreService = require('../core/Service');

var _coreService2 = _interopRequireDefault(_coreService);

var _coreServiceManager = require('../core/serviceManager');

var _coreServiceManager2 = _interopRequireDefault(_coreServiceManager);

var _displaySpaceView = require('../display/SpaceView');

var _displaySpaceView2 = _interopRequireDefault(_displaySpaceView);

var _displaySquaredView = require('../display/SquaredView');

var _displaySquaredView2 = _interopRequireDefault(_displaySquaredView);

var _displayTouchSurface = require('../display/TouchSurface');

var _displayTouchSurface2 = _interopRequireDefault(_displayTouchSurface);

var SERVICE_ID = 'service:locator';

var _LocatorView = (function (_SquaredView) {
  _inherits(_LocatorView, _SquaredView);

  function _LocatorView(template, content, events, options) {
    _classCallCheck(this, _LocatorView);

    _get(Object.getPrototypeOf(_LocatorView.prototype), 'constructor', this).call(this, template, content, events, options);

    this.area = null;

    this._onAreaTouchStart = this._onAreaTouchStart.bind(this);
    this._onAreaTouchMove = this._onAreaTouchMove.bind(this);
  }

  /**
   * [client] Allow to indicate the approximate location of the client on a map.
   *
   * The module always has a view that displays the map and a button to validate the location.
   *
   * The module finishes its initialization after the user confirms his / her approximate location by clicking on the “Validate” button. For development purposes it can be configured to send random coordinates or retrieving previously stored location (see `options.random` and `options.persist`.
   *
   * (See also {@link src/server/ServerLocator.js~ServerLocator} on the server side.)
   *
   * @example
   * const locator = new ClientLocator();
   */

  /**
   * Sets the `area` definition.
   * @param {Object} area - Object containing the area definition.
   */

  _createClass(_LocatorView, [{
    key: 'setArea',
    value: function setArea(area) {
      this._area = area;
      this._renderArea();
    }

    /**
     * Register the function to be called when the location is choosen.
     * @param {Function} callback
     */
  }, {
    key: 'onSelect',
    value: function onSelect(callback) {
      this._onSelect = callback;
    }

    /** @inheritdoc */
  }, {
    key: 'remove',
    value: function remove() {
      _get(Object.getPrototypeOf(_LocatorView.prototype), 'remove', this).call(this);

      this.surface.removeListener('touchstart', this._onAreaTouchStart);
      this.surface.removeListener('touchmove', this._onAreaTouchMove);
    }
  }, {
    key: '_renderArea',
    value: function _renderArea() {
      this.selector = new _displaySpaceView2['default']();
      this.selector.setArea(this._area);
      this.setViewComponent('.section-square', this.selector);
      this.render('.section-square');

      this.surface = new _displayTouchSurface2['default'](this.selector.$svg);
      this.surface.addListener('touchstart', this._onAreaTouchStart);
      this.surface.addListener('touchmove', this._onAreaTouchMove);
    }

    /**
     * Callback of the `touchstart` event.
     */
  }, {
    key: '_onAreaTouchStart',
    value: function _onAreaTouchStart(id, normX, normY) {
      var _this = this;

      if (!this.position) {
        this._createPosition(normX, normY);

        this.content.showBtn = true;
        this.render('.section-float');
        this.installEvents({
          'click .btn': function clickBtn(e) {
            return _this._onSelect(_this.position.x, _this.position.y);
          }
        });
      } else {
        this._updatePosition(normX, normY);
      }
    }

    /**
     * Callback of the `touchmove` event.
     */
  }, {
    key: '_onAreaTouchMove',
    value: function _onAreaTouchMove(id, normX, normY) {
      this._updatePosition(normX, normY);
    }

    /**
     * Creates the position object according to normalized coordinates.
     * @param {Number} normX - The normalized coordinate in the x axis.
     * @param {Number} normY - The normalized coordinate in the y axis.
     */
  }, {
    key: '_createPosition',
    value: function _createPosition(normX, normY) {
      this.position = {
        id: 'locator',
        x: normX * this._area.width,
        y: normY * this._area.height
      };

      this.selector.addPoint(this.position);
    }

    /**
     * Updates the position object according to normalized coordinates.
     * @param {Number} normX - The normalized coordinate in the x axis.
     * @param {Number} normY - The normalized coordinate in the y axis.
     */
  }, {
    key: '_updatePosition',
    value: function _updatePosition(normX, normY) {
      this.position.x = normX * this._area.width;
      this.position.y = normY * this._area.height;

      this.selector.updatePoint(this.position);
    }
  }]);

  return _LocatorView;
})(_displaySquaredView2['default']);

var ClientLocator = (function (_Service) {
  _inherits(ClientLocator, _Service);

  function ClientLocator() {
    _classCallCheck(this, ClientLocator);

    _get(Object.getPrototypeOf(ClientLocator.prototype), 'constructor', this).call(this, SERVICE_ID, true);

    /**
     * @param {Object} [defaults={}] - Defaults configuration of the service.
     * @param {Boolean} [defaults.random=false] - Send random position to the server
     *  and call `this.done()` (for development purpose)
     * @param {View} [defaults.viewCtor=_LocatorView] - The contructor of the view to be used.
     *  The view must implement the `AbstractLocatorView` interface
     */
    var defaults = {
      random: false,
      // persist: false, // @todo - re-think this with db
      viewCtor: _LocatorView
    };

    this.configure(defaults);

    this._sharedConfigService = this.require('shared-config');

    this._onAknowledgeResponse = this._onAknowledgeResponse.bind(this);
    this._sendCoordinates = this._sendCoordinates.bind(this);
  }

  /** @inheritdoc */

  _createClass(ClientLocator, [{
    key: 'init',
    value: function init() {
      this.viewCtor = this.options.viewCtor;
      // this.viewOptions
      this.view = this.createView();
    }

    /** @inheritdoc */
  }, {
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(ClientLocator.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      this.show();

      this.send('request');
      this.receive('aknowledge', this._onAknowledgeResponse);
    }

    /** @inheritdoc */
  }, {
    key: 'stop',
    value: function stop() {
      _get(Object.getPrototypeOf(ClientLocator.prototype), 'stop', this).call(this);
      this.removeListener('aknowledge', this._onAknowledgeResponse);

      this.hide();
    }

    /**
     * Bypass the locator according to module configuration options.
     * If `options.random` is set to true, create random coordinates and send it
     *  to the server (mainly for development purposes).
     * @private
     * @param {Object} area - The area as defined in server configuration.
     */
  }, {
    key: '_onAknowledgeResponse',
    value: function _onAknowledgeResponse(areaConfigPath) {
      var area = this._sharedConfigService.get(areaConfigPath);
      this.view.setArea(area);
      this.view.onSelect(this._sendCoordinates);

      if (this.options.random) {
        var x = Math.random() * area.width;
        var y = Math.random() * area.height;
        this._sendCoordinates(x, y);
      }
    }

    /**
     * Send coordinates to the server.
     * @private
     * @param {Number} x - The `x` coordinate of the client.
     * @param {Number} y - The `y` coordinate of the client.
     */
  }, {
    key: '_sendCoordinates',
    value: function _sendCoordinates(x, y) {
      _coreClient2['default'].coordinates = [x, y];

      this.send('coordinates', _coreClient2['default'].coordinates);
      this.ready();
    }
  }]);

  return ClientLocator;
})(_coreService2['default']);

_coreServiceManager2['default'].register(SERVICE_ID, ClientLocator);

exports['default'] = ClientLocator;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9jbGllbnQvc2VydmljZXMvQ2xpZW50TG9jYXRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzBCQUFtQixnQkFBZ0I7Ozs7OzsyQkFFZixpQkFBaUI7Ozs7a0NBQ1Ysd0JBQXdCOzs7O2dDQUM3QixzQkFBc0I7Ozs7a0NBQ3BCLHdCQUF3Qjs7OzttQ0FDdkIseUJBQXlCOzs7O0FBRWxELElBQU0sVUFBVSxHQUFHLGlCQUFpQixDQUFDOztJQUUvQixZQUFZO1lBQVosWUFBWTs7QUFDTCxXQURQLFlBQVksQ0FDSixRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUU7MEJBRDVDLFlBQVk7O0FBRWQsK0JBRkUsWUFBWSw2Q0FFUixRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUU7O0FBRTFDLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVqQixRQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMzRCxRQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUMxRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7ZUFSRyxZQUFZOztXQWNULGlCQUFDLElBQUksRUFBRTtBQUNaLFVBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLFVBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztLQUNwQjs7Ozs7Ozs7V0FNTyxrQkFBQyxRQUFRLEVBQUU7QUFDakIsVUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7S0FDM0I7Ozs7O1dBR0ssa0JBQUc7QUFDUCxpQ0E3QkUsWUFBWSx3Q0E2QkM7O0FBRWYsVUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENB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QUM7QUFDM0QsVUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDeEIsVUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7O0FBRTFDLFVBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7QUFDdkIsWUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDckMsWUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDdEMsWUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztPQUM3QjtLQUNGOzs7Ozs7Ozs7O1dBUWUsMEJBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNyQiw4QkFBTyxXQUFXLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRTVCLFVBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLHdCQUFPLFdBQVcsQ0FBQyxDQUFDO0FBQzdDLFVBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUNkOzs7U0FuRkcsYUFBYTs7O0FBc0ZuQixnQ0FBZSxRQUFRLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDOztxQkFFcEMsYUFBYSIsImZpbGUiOiIvVXNlcnMvbWF0dXN6ZXdza2kvZGV2L2Nvc2ltYS9saWIvc291bmR3b3Jrcy9zcmMvY2xpZW50L3NlcnZpY2VzL0NsaWVudExvY2F0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xpZW50IGZyb20gJy4uL2NvcmUvY2xpZW50Jztcbi8vIGltcG9ydCBsb2NhbFN0b3JhZ2UgZnJvbSAnLi9sb2NhbFN0b3JhZ2UnOyAvLyBAdG9kbyAtIHJldGhpbmsgdGhpcyB3aXRoIGRiXG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IFNwYWNlVmlldyBmcm9tICcuLi9kaXNwbGF5L1NwYWNlVmlldyc7XG5pbXBvcnQgU3F1YXJlZFZpZXcgZnJvbSAnLi4vZGlzcGxheS9TcXVhcmVkVmlldyc7XG5pbXBvcnQgVG91Y2hTdXJmYWNlIGZyb20gJy4uL2Rpc3BsYXkvVG91Y2hTdXJmYWNlJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOmxvY2F0b3InO1xuXG5jbGFzcyBfTG9jYXRvclZpZXcgZXh0ZW5kcyBTcXVhcmVkVmlldyB7XG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpIHtcbiAgICBzdXBlcih0ZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKTtcblxuICAgIHRoaXMuYXJlYSA9IG51bGw7XG5cbiAgICB0aGlzLl9vbkFyZWFUb3VjaFN0YXJ0ID0gdGhpcy5fb25BcmVhVG91Y2hTdGFydC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uQXJlYVRvdWNoTW92ZSA9IHRoaXMuX29uQXJlYVRvdWNoTW92ZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGBhcmVhYCBkZWZpbml0aW9uLlxuICAgKiBAcGFyYW0ge09iamVjdH0gYXJlYSAtIE9iamVjdCBjb250YWluaW5nIHRoZSBhcmVhIGRlZmluaXRpb24uXG4gICAqL1xuICBzZXRBcmVhKGFyZWEpIHtcbiAgICB0aGlzLl9hcmVhID0gYXJlYTtcbiAgICB0aGlzLl9yZW5kZXJBcmVhKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgdGhlIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBsb2NhdGlvbiBpcyBjaG9vc2VuLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgb25TZWxlY3QoY2FsbGJhY2spIHtcbiAgICB0aGlzLl9vblNlbGVjdCA9IGNhbGxiYWNrO1xuICB9XG5cbiAgLyoqIEBpbmhlcml0ZG9jICovXG4gIHJlbW92ZSgpIHtcbiAgICBzdXBlci5yZW1vdmUoKTtcblxuICAgIHRoaXMuc3VyZmFjZS5yZW1vdmVMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuX29uQXJlYVRvdWNoU3RhcnQpO1xuICAgIHRoaXMuc3VyZmFjZS5yZW1vdmVMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5fb25BcmVhVG91Y2hNb3ZlKTtcbiAgfVxuXG4gIF9yZW5kZXJBcmVhKCkge1xuICAgIHRoaXMuc2VsZWN0b3IgPSBuZXcgU3BhY2VWaWV3KCk7XG4gICAgdGhpcy5zZWxlY3Rvci5zZXRBcmVhKHRoaXMuX2FyZWEpO1xuICAgIHRoaXMuc2V0Vmlld0NvbXBvbmVudCgnLnNlY3Rpb24tc3F1YXJlJywgdGhpcy5zZWxlY3Rvcik7XG4gICAgdGhpcy5yZW5kZXIoJy5zZWN0aW9uLXNxdWFyZScpO1xuXG4gICAgdGhpcy5zdXJmYWNlID0gbmV3IFRvdWNoU3VyZmFjZSh0aGlzLnNlbGVjdG9yLiRzdmcpO1xuICAgIHRoaXMuc3VyZmFjZS5hZGRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuX29uQXJlYVRvdWNoU3RhcnQpO1xuICAgIHRoaXMuc3VyZmFjZS5hZGRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5fb25BcmVhVG91Y2hNb3ZlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBvZiB0aGUgYHRvdWNoc3RhcnRgIGV2ZW50LlxuICAgKi9cbiAgX29uQXJlYVRvdWNoU3RhcnQoaWQsIG5vcm1YLCBub3JtWSkge1xuICAgIGlmICghdGhpcy5wb3NpdGlvbikge1xuICAgICAgdGhpcy5fY3JlYXRlUG9zaXRpb24obm9ybVgsIG5vcm1ZKTtcblxuICAgICAgdGhpcy5jb250ZW50LnNob3dCdG4gPSB0cnVlO1xuICAgICAgdGhpcy5yZW5kZXIoJy5zZWN0aW9uLWZsb2F0Jyk7XG4gICAgICB0aGlzLmluc3RhbGxFdmVudHMoe1xuICAgICAgICAnY2xpY2sgLmJ0bic6IChlKSA9PiB0aGlzLl9vblNlbGVjdCh0aGlzLnBvc2l0aW9uLngsIHRoaXMucG9zaXRpb24ueSksXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdXBkYXRlUG9zaXRpb24obm9ybVgsIG5vcm1ZKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgb2YgdGhlIGB0b3VjaG1vdmVgIGV2ZW50LlxuICAgKi9cbiAgX29uQXJlYVRvdWNoTW92ZShpZCwgbm9ybVgsIG5vcm1ZKSB7XG4gICAgdGhpcy5fdXBkYXRlUG9zaXRpb24obm9ybVgsIG5vcm1ZKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIHRoZSBwb3NpdGlvbiBvYmplY3QgYWNjb3JkaW5nIHRvIG5vcm1hbGl6ZWQgY29vcmRpbmF0ZXMuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBub3JtWCAtIFRoZSBub3JtYWxpemVkIGNvb3JkaW5hdGUgaW4gdGhlIHggYXhpcy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IG5vcm1ZIC0gVGhlIG5vcm1hbGl6ZWQgY29vcmRpbmF0ZSBpbiB0aGUgeSBheGlzLlxuICAgKi9cbiAgX2NyZWF0ZVBvc2l0aW9uKG5vcm1YLCBub3JtWSkge1xuICAgIHRoaXMucG9zaXRpb24gPSB7XG4gICAgICBpZDogJ2xvY2F0b3InLFxuICAgICAgeDogbm9ybVggKiB0aGlzLl9hcmVhLndpZHRoLFxuICAgICAgeTogbm9ybVkgKiB0aGlzLl9hcmVhLmhlaWdodCxcbiAgICB9XG5cbiAgICB0aGlzLnNlbGVjdG9yLmFkZFBvaW50KHRoaXMucG9zaXRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHBvc2l0aW9uIG9iamVjdCBhY2NvcmRpbmcgdG8gbm9ybWFsaXplZCBjb29yZGluYXRlcy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IG5vcm1YIC0gVGhlIG5vcm1hbGl6ZWQgY29vcmRpbmF0ZSBpbiB0aGUgeCBheGlzLlxuICAgKiBAcGFyYW0ge051bWJlcn0gbm9ybVkgLSBUaGUgbm9ybWFsaXplZCBjb29yZGluYXRlIGluIHRoZSB5IGF4aXMuXG4gICAqL1xuICBfdXBkYXRlUG9zaXRpb24obm9ybVgsIG5vcm1ZKSB7XG4gICAgdGhpcy5wb3NpdGlvbi54ID0gbm9ybVggKiB0aGlzLl9hcmVhLndpZHRoO1xuICAgIHRoaXMucG9zaXRpb24ueSA9IG5vcm1ZICogdGhpcy5fYXJlYS5oZWlnaHQ7XG5cbiAgICB0aGlzLnNlbGVjdG9yLnVwZGF0ZVBvaW50KHRoaXMucG9zaXRpb24pO1xuICB9XG59XG5cbi8qKlxuICogW2NsaWVudF0gQWxsb3cgdG8gaW5kaWNhdGUgdGhlIGFwcHJveGltYXRlIGxvY2F0aW9uIG9mIHRoZSBjbGllbnQgb24gYSBtYXAuXG4gKlxuICogVGhlIG1vZHVsZSBhbHdheXMgaGFzIGEgdmlldyB0aGF0IGRpc3BsYXlzIHRoZSBtYXAgYW5kIGEgYnV0dG9uIHRvIHZhbGlkYXRlIHRoZSBsb2NhdGlvbi5cbiAqXG4gKiBUaGUgbW9kdWxlIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbiBhZnRlciB0aGUgdXNlciBjb25maXJtcyBoaXMgLyBoZXIgYXBwcm94aW1hdGUgbG9jYXRpb24gYnkgY2xpY2tpbmcgb24gdGhlIOKAnFZhbGlkYXRl4oCdIGJ1dHRvbi4gRm9yIGRldmVsb3BtZW50IHB1cnBvc2VzIGl0IGNhbiBiZSBjb25maWd1cmVkIHRvIHNlbmQgcmFuZG9tIGNvb3JkaW5hdGVzIG9yIHJldHJpZXZpbmcgcHJldmlvdXNseSBzdG9yZWQgbG9jYXRpb24gKHNlZSBgb3B0aW9ucy5yYW5kb21gIGFuZCBgb3B0aW9ucy5wZXJzaXN0YC5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9zZXJ2ZXIvU2VydmVyTG9jYXRvci5qc35TZXJ2ZXJMb2NhdG9yfSBvbiB0aGUgc2VydmVyIHNpZGUuKVxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCBsb2NhdG9yID0gbmV3IENsaWVudExvY2F0b3IoKTtcbiAqL1xuY2xhc3MgQ2xpZW50TG9jYXRvciBleHRlbmRzIFNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCB0cnVlKTtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbZGVmYXVsdHM9e31dIC0gRGVmYXVsdHMgY29uZmlndXJhdGlvbiBvZiB0aGUgc2VydmljZS5cbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtkZWZhdWx0cy5yYW5kb209ZmFsc2VdIC0gU2VuZCByYW5kb20gcG9zaXRpb24gdG8gdGhlIHNlcnZlclxuICAgICAqICBhbmQgY2FsbCBgdGhpcy5kb25lKClgIChmb3IgZGV2ZWxvcG1lbnQgcHVycG9zZSlcbiAgICAgKiBAcGFyYW0ge1ZpZXd9IFtkZWZhdWx0cy52aWV3Q3Rvcj1fTG9jYXRvclZpZXddIC0gVGhlIGNvbnRydWN0b3Igb2YgdGhlIHZpZXcgdG8gYmUgdXNlZC5cbiAgICAgKiAgVGhlIHZpZXcgbXVzdCBpbXBsZW1lbnQgdGhlIGBBYnN0cmFjdExvY2F0b3JWaWV3YCBpbnRlcmZhY2VcbiAgICAgKi9cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIHJhbmRvbTogZmFsc2UsXG4gICAgICAvLyBwZXJzaXN0OiBmYWxzZSwgLy8gQHRvZG8gLSByZS10aGluayB0aGlzIHdpdGggZGJcbiAgICAgIHZpZXdDdG9yOiBfTG9jYXRvclZpZXcsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIHRoaXMuX3NoYXJlZENvbmZpZ1NlcnZpY2UgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1jb25maWcnKTtcblxuICAgIHRoaXMuX29uQWtub3dsZWRnZVJlc3BvbnNlID0gdGhpcy5fb25Ba25vd2xlZGdlUmVzcG9uc2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9zZW5kQ29vcmRpbmF0ZXMgPSB0aGlzLl9zZW5kQ29vcmRpbmF0ZXMuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICBpbml0KCkge1xuICAgIHRoaXMudmlld0N0b3IgPSB0aGlzLm9wdGlvbnMudmlld0N0b3I7XG4gICAgLy8gdGhpcy52aWV3T3B0aW9uc1xuICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlVmlldygpO1xuICB9XG5cbiAgLyoqIEBpbmhlcml0ZG9jICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAoIXRoaXMuaGFzU3RhcnRlZClcbiAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgdGhpcy5zaG93KCk7XG5cbiAgICB0aGlzLnNlbmQoJ3JlcXVlc3QnKTtcbiAgICB0aGlzLnJlY2VpdmUoJ2Frbm93bGVkZ2UnLCB0aGlzLl9vbkFrbm93bGVkZ2VSZXNwb25zZSk7XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgc3RvcCgpIHtcbiAgICBzdXBlci5zdG9wKCk7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignYWtub3dsZWRnZScsIHRoaXMuX29uQWtub3dsZWRnZVJlc3BvbnNlKTtcblxuICAgIHRoaXMuaGlkZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEJ5cGFzcyB0aGUgbG9jYXRvciBhY2NvcmRpbmcgdG8gbW9kdWxlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAgICogSWYgYG9wdGlvbnMucmFuZG9tYCBpcyBzZXQgdG8gdHJ1ZSwgY3JlYXRlIHJhbmRvbSBjb29yZGluYXRlcyBhbmQgc2VuZCBpdFxuICAgKiAgdG8gdGhlIHNlcnZlciAobWFpbmx5IGZvciBkZXZlbG9wbWVudCBwdXJwb3NlcykuXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhcmVhIC0gVGhlIGFyZWEgYXMgZGVmaW5lZCBpbiBzZXJ2ZXIgY29uZmlndXJhdGlvbi5cbiAgICovXG4gIF9vbkFrbm93bGVkZ2VSZXNwb25zZShhcmVhQ29uZmlnUGF0aCkge1xuICAgIGNvbnN0IGFyZWEgPSB0aGlzLl9zaGFyZWRDb25maWdTZXJ2aWNlLmdldChhcmVhQ29uZmlnUGF0aCk7XG4gICAgdGhpcy52aWV3LnNldEFyZWEoYXJlYSk7XG4gICAgdGhpcy52aWV3Lm9uU2VsZWN0KHRoaXMuX3NlbmRDb29yZGluYXRlcyk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnJhbmRvbSkge1xuICAgICAgY29uc3QgeCA9IE1hdGgucmFuZG9tKCkgKiBhcmVhLndpZHRoO1xuICAgICAgY29uc3QgeSA9IE1hdGgucmFuZG9tKCkgKiBhcmVhLmhlaWdodDtcbiAgICAgIHRoaXMuX3NlbmRDb29yZGluYXRlcyh4LCB5KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBjb29yZGluYXRlcyB0byB0aGUgc2VydmVyLlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge051bWJlcn0geCAtIFRoZSBgeGAgY29vcmRpbmF0ZSBvZiB0aGUgY2xpZW50LlxuICAgKiBAcGFyYW0ge051bWJlcn0geSAtIFRoZSBgeWAgY29vcmRpbmF0ZSBvZiB0aGUgY2xpZW50LlxuICAgKi9cbiAgX3NlbmRDb29yZGluYXRlcyh4LCB5KSB7XG4gICAgY2xpZW50LmNvb3JkaW5hdGVzID0gW3gsIHldO1xuXG4gICAgdGhpcy5zZW5kKCdjb29yZGluYXRlcycsIGNsaWVudC5jb29yZGluYXRlcyk7XG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIENsaWVudExvY2F0b3IpO1xuXG5leHBvcnQgZGVmYXVsdCBDbGllbnRMb2NhdG9yO1xuIl19