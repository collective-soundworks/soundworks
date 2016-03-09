'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _client = require('../core/client');

var _client2 = _interopRequireDefault(_client);

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _SpaceView = require('../views/SpaceView');

var _SpaceView2 = _interopRequireDefault(_SpaceView);

var _SquaredView2 = require('../views/SquaredView');

var _SquaredView3 = _interopRequireDefault(_SquaredView2);

var _TouchSurface = require('../views/TouchSurface');

var _TouchSurface2 = _interopRequireDefault(_TouchSurface);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:locator';
// import localStorage from './localStorage'; // @todo - rethink this with db


var _LocatorView = function (_SquaredView) {
  (0, _inherits3.default)(_LocatorView, _SquaredView);

  function _LocatorView(template, content, events, options) {
    (0, _classCallCheck3.default)(this, _LocatorView);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(_LocatorView).call(this, template, content, events, options));

    _this.area = null;

    _this._onAreaTouchStart = _this._onAreaTouchStart.bind(_this);
    _this._onAreaTouchMove = _this._onAreaTouchMove.bind(_this);
    return _this;
  }

  /**
   * Sets the `area` definition.
   * @param {Object} area - Object containing the area definition.
   */


  (0, _createClass3.default)(_LocatorView, [{
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
      (0, _get3.default)((0, _getPrototypeOf2.default)(_LocatorView.prototype), 'remove', this).call(this);

      this.surface.removeListener('touchstart', this._onAreaTouchStart);
      this.surface.removeListener('touchmove', this._onAreaTouchMove);
    }
  }, {
    key: '_renderArea',
    value: function _renderArea() {
      this.selector = new _SpaceView2.default();
      this.selector.setArea(this._area);
      this.setViewComponent('.section-square', this.selector);
      this.render('.section-square');

      this.surface = new _TouchSurface2.default(this.selector.$svg);
      this.surface.addListener('touchstart', this._onAreaTouchStart);
      this.surface.addListener('touchmove', this._onAreaTouchMove);
    }

    /**
     * Callback of the `touchstart` event.
     */

  }, {
    key: '_onAreaTouchStart',
    value: function _onAreaTouchStart(id, normX, normY) {
      var _this2 = this;

      if (!this.position) {
        this._createPosition(normX, normY);

        this.content.showBtn = true;
        this.render('.section-float');
        this.installEvents({
          'click .btn': function clickBtn(e) {
            return _this2._onSelect(_this2.position.x, _this2.position.y);
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
}(_SquaredView3.default);

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


var ClientLocator = function (_Service) {
  (0, _inherits3.default)(ClientLocator, _Service);

  function ClientLocator() {
    (0, _classCallCheck3.default)(this, ClientLocator);


    /**
     * @param {Object} [defaults={}] - Defaults configuration of the service.
     * @param {Boolean} [defaults.random=false] - Send random position to the server
     *  and call `this.done()` (for development purpose)
     * @param {View} [defaults.viewCtor=_LocatorView] - The contructor of the view to be used.
     *  The view must implement the `AbstractLocatorView` interface
     */

    var _this3 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ClientLocator).call(this, SERVICE_ID, true));

    var defaults = {
      random: false,
      // persist: false, // @todo - re-think this with db
      viewCtor: _LocatorView
    };

    _this3.configure(defaults);

    _this3._sharedConfigService = _this3.require('shared-config');

    _this3._onAknowledgeResponse = _this3._onAknowledgeResponse.bind(_this3);
    _this3._sendCoordinates = _this3._sendCoordinates.bind(_this3);
    return _this3;
  }

  /** @inheritdoc */


  (0, _createClass3.default)(ClientLocator, [{
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
      (0, _get3.default)((0, _getPrototypeOf2.default)(ClientLocator.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      this.show();

      this.send('request');
      this.receive('aknowledge', this._onAknowledgeResponse);
    }

    /** @inheritdoc */

  }, {
    key: 'stop',
    value: function stop() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(ClientLocator.prototype), 'stop', this).call(this);
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
      _client2.default.coordinates = [x, y];

      this.send('coordinates', _client2.default.coordinates);
      this.ready();
    }
  }]);
  return ClientLocator;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, ClientLocator);

exports.default = ClientLocator;
//# sourceMappingURL=data:application/json;base64,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QUFLLHFCQUFMLENBQWxDLENBRks7O0FBSUwsV0FBSyxJQUFMLEdBSks7Ozs7Ozs7Ozs7Ozs7MENBY2UsZ0JBQWdCO0FBQ3BDLFVBQU0sT0FBTyxLQUFLLG9CQUFMLENBQTBCLEdBQTFCLENBQThCLGNBQTlCLENBQVAsQ0FEOEI7QUFFcEMsV0FBSyxJQUFMLENBQVUsT0FBVixDQUFrQixJQUFsQixFQUZvQztBQUdwQyxXQUFLLElBQUwsQ0FBVSxRQUFWLENBQW1CLEtBQUssZ0JBQUwsQ0FBbkIsQ0FIb0M7O0FBS3BDLFVBQUksS0FBSyxPQUFMLENBQWEsTUFBYixFQUFxQjtBQUN2QixZQUFNLElBQUksS0FBSyxNQUFMLEtBQWdCLEtBQUssS0FBTCxDQURIO0FBRXZCLFlBQU0sSUFBSSxLQUFLLE1BQUwsS0FBZ0IsS0FBSyxNQUFMLENBRkg7QUFHdkIsYUFBSyxnQkFBTCxDQUFzQixDQUF0QixFQUF5QixDQUF6QixFQUh1QjtPQUF6Qjs7Ozs7Ozs7Ozs7O3FDQWFlLEdBQUcsR0FBRztBQUNyQix1QkFBTyxXQUFQLEdBQXFCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBckIsQ0FEcUI7O0FBR3JCLFdBQUssSUFBTCxDQUFVLGFBQVYsRUFBeUIsaUJBQU8sV0FBUCxDQUF6QixDQUhxQjtBQUlyQixXQUFLLEtBQUwsR0FKcUI7OztTQTlFbkI7OztBQXNGTix5QkFBZSxRQUFmLENBQXdCLFVBQXhCLEVBQW9DLGFBQXBDOztrQkFFZSIsImZpbGUiOiJDbGllbnRMb2NhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsaWVudCBmcm9tICcuLi9jb3JlL2NsaWVudCc7XG4vLyBpbXBvcnQgbG9jYWxTdG9yYWdlIGZyb20gJy4vbG9jYWxTdG9yYWdlJzsgLy8gQHRvZG8gLSByZXRoaW5rIHRoaXMgd2l0aCBkYlxuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBTcGFjZVZpZXcgZnJvbSAnLi4vdmlld3MvU3BhY2VWaWV3JztcbmltcG9ydCBTcXVhcmVkVmlldyBmcm9tICcuLi92aWV3cy9TcXVhcmVkVmlldyc7XG5pbXBvcnQgVG91Y2hTdXJmYWNlIGZyb20gJy4uL3ZpZXdzL1RvdWNoU3VyZmFjZSc7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpsb2NhdG9yJztcblxuY2xhc3MgX0xvY2F0b3JWaWV3IGV4dGVuZHMgU3F1YXJlZFZpZXcge1xuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKSB7XG4gICAgc3VwZXIodGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmFyZWEgPSBudWxsO1xuXG4gICAgdGhpcy5fb25BcmVhVG91Y2hTdGFydCA9IHRoaXMuX29uQXJlYVRvdWNoU3RhcnQuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkFyZWFUb3VjaE1vdmUgPSB0aGlzLl9vbkFyZWFUb3VjaE1vdmUuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBgYXJlYWAgZGVmaW5pdGlvbi5cbiAgICogQHBhcmFtIHtPYmplY3R9IGFyZWEgLSBPYmplY3QgY29udGFpbmluZyB0aGUgYXJlYSBkZWZpbml0aW9uLlxuICAgKi9cbiAgc2V0QXJlYShhcmVhKSB7XG4gICAgdGhpcy5fYXJlYSA9IGFyZWE7XG4gICAgdGhpcy5fcmVuZGVyQXJlYSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIHRoZSBmdW5jdGlvbiB0byBiZSBjYWxsZWQgd2hlbiB0aGUgbG9jYXRpb24gaXMgY2hvb3Nlbi5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIG9uU2VsZWN0KGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fb25TZWxlY3QgPSBjYWxsYmFjaztcbiAgfVxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICByZW1vdmUoKSB7XG4gICAgc3VwZXIucmVtb3ZlKCk7XG5cbiAgICB0aGlzLnN1cmZhY2UucmVtb3ZlTGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9vbkFyZWFUb3VjaFN0YXJ0KTtcbiAgICB0aGlzLnN1cmZhY2UucmVtb3ZlTGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMuX29uQXJlYVRvdWNoTW92ZSk7XG4gIH1cblxuICBfcmVuZGVyQXJlYSgpIHtcbiAgICB0aGlzLnNlbGVjdG9yID0gbmV3IFNwYWNlVmlldygpO1xuICAgIHRoaXMuc2VsZWN0b3Iuc2V0QXJlYSh0aGlzLl9hcmVhKTtcbiAgICB0aGlzLnNldFZpZXdDb21wb25lbnQoJy5zZWN0aW9uLXNxdWFyZScsIHRoaXMuc2VsZWN0b3IpO1xuICAgIHRoaXMucmVuZGVyKCcuc2VjdGlvbi1zcXVhcmUnKTtcblxuICAgIHRoaXMuc3VyZmFjZSA9IG5ldyBUb3VjaFN1cmZhY2UodGhpcy5zZWxlY3Rvci4kc3ZnKTtcbiAgICB0aGlzLnN1cmZhY2UuYWRkTGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9vbkFyZWFUb3VjaFN0YXJ0KTtcbiAgICB0aGlzLnN1cmZhY2UuYWRkTGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMuX29uQXJlYVRvdWNoTW92ZSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgb2YgdGhlIGB0b3VjaHN0YXJ0YCBldmVudC5cbiAgICovXG4gIF9vbkFyZWFUb3VjaFN0YXJ0KGlkLCBub3JtWCwgbm9ybVkpIHtcbiAgICBpZiAoIXRoaXMucG9zaXRpb24pIHtcbiAgICAgIHRoaXMuX2NyZWF0ZVBvc2l0aW9uKG5vcm1YLCBub3JtWSk7XG5cbiAgICAgIHRoaXMuY29udGVudC5zaG93QnRuID0gdHJ1ZTtcbiAgICAgIHRoaXMucmVuZGVyKCcuc2VjdGlvbi1mbG9hdCcpO1xuICAgICAgdGhpcy5pbnN0YWxsRXZlbnRzKHtcbiAgICAgICAgJ2NsaWNrIC5idG4nOiAoZSkgPT4gdGhpcy5fb25TZWxlY3QodGhpcy5wb3NpdGlvbi54LCB0aGlzLnBvc2l0aW9uLnkpLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVBvc2l0aW9uKG5vcm1YLCBub3JtWSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIG9mIHRoZSBgdG91Y2htb3ZlYCBldmVudC5cbiAgICovXG4gIF9vbkFyZWFUb3VjaE1vdmUoaWQsIG5vcm1YLCBub3JtWSkge1xuICAgIHRoaXMuX3VwZGF0ZVBvc2l0aW9uKG5vcm1YLCBub3JtWSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyB0aGUgcG9zaXRpb24gb2JqZWN0IGFjY29yZGluZyB0byBub3JtYWxpemVkIGNvb3JkaW5hdGVzLlxuICAgKiBAcGFyYW0ge051bWJlcn0gbm9ybVggLSBUaGUgbm9ybWFsaXplZCBjb29yZGluYXRlIGluIHRoZSB4IGF4aXMuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBub3JtWSAtIFRoZSBub3JtYWxpemVkIGNvb3JkaW5hdGUgaW4gdGhlIHkgYXhpcy5cbiAgICovXG4gIF9jcmVhdGVQb3NpdGlvbihub3JtWCwgbm9ybVkpIHtcbiAgICB0aGlzLnBvc2l0aW9uID0ge1xuICAgICAgaWQ6ICdsb2NhdG9yJyxcbiAgICAgIHg6IG5vcm1YICogdGhpcy5fYXJlYS53aWR0aCxcbiAgICAgIHk6IG5vcm1ZICogdGhpcy5fYXJlYS5oZWlnaHQsXG4gICAgfVxuXG4gICAgdGhpcy5zZWxlY3Rvci5hZGRQb2ludCh0aGlzLnBvc2l0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBwb3NpdGlvbiBvYmplY3QgYWNjb3JkaW5nIHRvIG5vcm1hbGl6ZWQgY29vcmRpbmF0ZXMuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBub3JtWCAtIFRoZSBub3JtYWxpemVkIGNvb3JkaW5hdGUgaW4gdGhlIHggYXhpcy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IG5vcm1ZIC0gVGhlIG5vcm1hbGl6ZWQgY29vcmRpbmF0ZSBpbiB0aGUgeSBheGlzLlxuICAgKi9cbiAgX3VwZGF0ZVBvc2l0aW9uKG5vcm1YLCBub3JtWSkge1xuICAgIHRoaXMucG9zaXRpb24ueCA9IG5vcm1YICogdGhpcy5fYXJlYS53aWR0aDtcbiAgICB0aGlzLnBvc2l0aW9uLnkgPSBub3JtWSAqIHRoaXMuX2FyZWEuaGVpZ2h0O1xuXG4gICAgdGhpcy5zZWxlY3Rvci51cGRhdGVQb2ludCh0aGlzLnBvc2l0aW9uKTtcbiAgfVxufVxuXG4vKipcbiAqIFtjbGllbnRdIEFsbG93IHRvIGluZGljYXRlIHRoZSBhcHByb3hpbWF0ZSBsb2NhdGlvbiBvZiB0aGUgY2xpZW50IG9uIGEgbWFwLlxuICpcbiAqIFRoZSBtb2R1bGUgYWx3YXlzIGhhcyBhIHZpZXcgdGhhdCBkaXNwbGF5cyB0aGUgbWFwIGFuZCBhIGJ1dHRvbiB0byB2YWxpZGF0ZSB0aGUgbG9jYXRpb24uXG4gKlxuICogVGhlIG1vZHVsZSBmaW5pc2hlcyBpdHMgaW5pdGlhbGl6YXRpb24gYWZ0ZXIgdGhlIHVzZXIgY29uZmlybXMgaGlzIC8gaGVyIGFwcHJveGltYXRlIGxvY2F0aW9uIGJ5IGNsaWNraW5nIG9uIHRoZSDigJxWYWxpZGF0ZeKAnSBidXR0b24uIEZvciBkZXZlbG9wbWVudCBwdXJwb3NlcyBpdCBjYW4gYmUgY29uZmlndXJlZCB0byBzZW5kIHJhbmRvbSBjb29yZGluYXRlcyBvciByZXRyaWV2aW5nIHByZXZpb3VzbHkgc3RvcmVkIGxvY2F0aW9uIChzZWUgYG9wdGlvbnMucmFuZG9tYCBhbmQgYG9wdGlvbnMucGVyc2lzdGAuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvc2VydmVyL1NlcnZlckxvY2F0b3IuanN+U2VydmVyTG9jYXRvcn0gb24gdGhlIHNlcnZlciBzaWRlLilcbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgbG9jYXRvciA9IG5ldyBDbGllbnRMb2NhdG9yKCk7XG4gKi9cbmNsYXNzIENsaWVudExvY2F0b3IgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgdHJ1ZSk7XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW2RlZmF1bHRzPXt9XSAtIERlZmF1bHRzIGNvbmZpZ3VyYXRpb24gb2YgdGhlIHNlcnZpY2UuXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbZGVmYXVsdHMucmFuZG9tPWZhbHNlXSAtIFNlbmQgcmFuZG9tIHBvc2l0aW9uIHRvIHRoZSBzZXJ2ZXJcbiAgICAgKiAgYW5kIGNhbGwgYHRoaXMuZG9uZSgpYCAoZm9yIGRldmVsb3BtZW50IHB1cnBvc2UpXG4gICAgICogQHBhcmFtIHtWaWV3fSBbZGVmYXVsdHMudmlld0N0b3I9X0xvY2F0b3JWaWV3XSAtIFRoZSBjb250cnVjdG9yIG9mIHRoZSB2aWV3IHRvIGJlIHVzZWQuXG4gICAgICogIFRoZSB2aWV3IG11c3QgaW1wbGVtZW50IHRoZSBgQWJzdHJhY3RMb2NhdG9yVmlld2AgaW50ZXJmYWNlXG4gICAgICovXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICByYW5kb206IGZhbHNlLFxuICAgICAgLy8gcGVyc2lzdDogZmFsc2UsIC8vIEB0b2RvIC0gcmUtdGhpbmsgdGhpcyB3aXRoIGRiXG4gICAgICB2aWV3Q3RvcjogX0xvY2F0b3JWaWV3LFxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICB0aGlzLl9zaGFyZWRDb25maWdTZXJ2aWNlID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtY29uZmlnJyk7XG5cbiAgICB0aGlzLl9vbkFrbm93bGVkZ2VSZXNwb25zZSA9IHRoaXMuX29uQWtub3dsZWRnZVJlc3BvbnNlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fc2VuZENvb3JkaW5hdGVzID0gdGhpcy5fc2VuZENvb3JkaW5hdGVzLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgaW5pdCgpIHtcbiAgICB0aGlzLnZpZXdDdG9yID0gdGhpcy5vcHRpb25zLnZpZXdDdG9yO1xuICAgIC8vIHRoaXMudmlld09wdGlvbnNcbiAgICB0aGlzLnZpZXcgPSB0aGlzLmNyZWF0ZVZpZXcoKTtcbiAgfVxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgaWYgKCF0aGlzLmhhc1N0YXJ0ZWQpXG4gICAgICB0aGlzLmluaXQoKTtcblxuICAgIHRoaXMuc2hvdygpO1xuXG4gICAgdGhpcy5zZW5kKCdyZXF1ZXN0Jyk7XG4gICAgdGhpcy5yZWNlaXZlKCdha25vd2xlZGdlJywgdGhpcy5fb25Ba25vd2xlZGdlUmVzcG9uc2UpO1xuICB9XG5cbiAgLyoqIEBpbmhlcml0ZG9jICovXG4gIHN0b3AoKSB7XG4gICAgc3VwZXIuc3RvcCgpO1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ2Frbm93bGVkZ2UnLCB0aGlzLl9vbkFrbm93bGVkZ2VSZXNwb25zZSk7XG5cbiAgICB0aGlzLmhpZGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCeXBhc3MgdGhlIGxvY2F0b3IgYWNjb3JkaW5nIHRvIG1vZHVsZSBjb25maWd1cmF0aW9uIG9wdGlvbnMuXG4gICAqIElmIGBvcHRpb25zLnJhbmRvbWAgaXMgc2V0IHRvIHRydWUsIGNyZWF0ZSByYW5kb20gY29vcmRpbmF0ZXMgYW5kIHNlbmQgaXRcbiAgICogIHRvIHRoZSBzZXJ2ZXIgKG1haW5seSBmb3IgZGV2ZWxvcG1lbnQgcHVycG9zZXMpLlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gYXJlYSAtIFRoZSBhcmVhIGFzIGRlZmluZWQgaW4gc2VydmVyIGNvbmZpZ3VyYXRpb24uXG4gICAqL1xuICBfb25Ba25vd2xlZGdlUmVzcG9uc2UoYXJlYUNvbmZpZ1BhdGgpIHtcbiAgICBjb25zdCBhcmVhID0gdGhpcy5fc2hhcmVkQ29uZmlnU2VydmljZS5nZXQoYXJlYUNvbmZpZ1BhdGgpO1xuICAgIHRoaXMudmlldy5zZXRBcmVhKGFyZWEpO1xuICAgIHRoaXMudmlldy5vblNlbGVjdCh0aGlzLl9zZW5kQ29vcmRpbmF0ZXMpO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5yYW5kb20pIHtcbiAgICAgIGNvbnN0IHggPSBNYXRoLnJhbmRvbSgpICogYXJlYS53aWR0aDtcbiAgICAgIGNvbnN0IHkgPSBNYXRoLnJhbmRvbSgpICogYXJlYS5oZWlnaHQ7XG4gICAgICB0aGlzLl9zZW5kQ29vcmRpbmF0ZXMoeCwgeSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgY29vcmRpbmF0ZXMgdG8gdGhlIHNlcnZlci5cbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHggLSBUaGUgYHhgIGNvb3JkaW5hdGUgb2YgdGhlIGNsaWVudC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHkgLSBUaGUgYHlgIGNvb3JkaW5hdGUgb2YgdGhlIGNsaWVudC5cbiAgICovXG4gIF9zZW5kQ29vcmRpbmF0ZXMoeCwgeSkge1xuICAgIGNsaWVudC5jb29yZGluYXRlcyA9IFt4LCB5XTtcblxuICAgIHRoaXMuc2VuZCgnY29vcmRpbmF0ZXMnLCBjbGllbnQuY29vcmRpbmF0ZXMpO1xuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBDbGllbnRMb2NhdG9yKTtcblxuZXhwb3J0IGRlZmF1bHQgQ2xpZW50TG9jYXRvcjtcbiJdfQ==