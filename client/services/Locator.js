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

var SERVICE_ID = 'service:locator';

/**
 * Interface of the client `'locator'` service.
 *
 * This service is one of the provided services aimed at identifying clients inside
 * the experience along with the [`'placer'`]{@link module:soundworks/client.Placer}
 * and [`'checkin'`]{@link module:soundworks/client.Checkin} services.
 *
 * The `'locator'` service allows a client to give its approximate location inside
 * a graphical representation of the `area` as defined in the server's `setup`
 * configuration entry.
 *
 * __*The service must be used with its [server-side counterpart]{@link module:soundworks/server.Locator}*__
 *
 * @see {@link module:soundworks/client.Placer}
 * @see {@link module:soundworks/client.Checkin}
 *
 * @param {Object} options
 * @param {Boolean} [options.random=false] - Defines whether the location is
 *  set randomly (mainly for development purposes).
 *
 * @memberof module:soundworks/client
 * @example
 * // inside the experience constructor
 * this.locator = this.require('locator');
 */

var Locator = function (_Service) {
  (0, _inherits3.default)(Locator, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */

  function Locator() {
    (0, _classCallCheck3.default)(this, Locator);

    var _this3 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Locator).call(this, SERVICE_ID, true));

    var defaults = {
      random: false,
      viewCtor: _LocatorView
    };

    _this3.configure(defaults);

    _this3._sharedConfig = _this3.require('shared-config');

    _this3._onAknowledgeResponse = _this3._onAknowledgeResponse.bind(_this3);
    _this3._sendCoordinates = _this3._sendCoordinates.bind(_this3);
    return _this3;
  }

  /** @private */


  (0, _createClass3.default)(Locator, [{
    key: 'init',
    value: function init() {
      this.viewCtor = this.options.viewCtor;
      this.view = this.createView();
    }

    /** @private */

  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Locator.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      this.show();

      this.send('request');
      this.receive('aknowledge', this._onAknowledgeResponse);
    }

    /** @private */

  }, {
    key: 'stop',
    value: function stop() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Locator.prototype), 'stop', this).call(this);
      this.removeListener('aknowledge', this._onAknowledgeResponse);

      this.hide();
    }

    /**
     * @private
     * @param {Object} areaConfigPath - Path to the area in the configuration.
     */

  }, {
    key: '_onAknowledgeResponse',
    value: function _onAknowledgeResponse(areaConfigPath) {
      var area = this._sharedConfig.get(areaConfigPath);
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
  return Locator;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, Locator);

exports.default = Locator;
//# sourceMappingURL=data:application/json;base64,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bEMsQ0FGSzs7QUFJTCxXQUFLLElBQUwsR0FKSzs7Ozs7Ozs7OzswQ0FXZSxnQkFBZ0I7QUFDcEMsVUFBTSxPQUFPLEtBQUssYUFBTCxDQUFtQixHQUFuQixDQUF1QixjQUF2QixDQUFQLENBRDhCO0FBRXBDLFdBQUssSUFBTCxDQUFVLE9BQVYsQ0FBa0IsSUFBbEIsRUFGb0M7QUFHcEMsV0FBSyxJQUFMLENBQVUsUUFBVixDQUFtQixLQUFLLGdCQUFMLENBQW5CLENBSG9DOztBQUtwQyxVQUFJLEtBQUssT0FBTCxDQUFhLE1BQWIsRUFBcUI7QUFDdkIsWUFBTSxJQUFJLEtBQUssTUFBTCxLQUFnQixLQUFLLEtBQUwsQ0FESDtBQUV2QixZQUFNLElBQUksS0FBSyxNQUFMLEtBQWdCLEtBQUssTUFBTCxDQUZIO0FBR3ZCLGFBQUssZ0JBQUwsQ0FBc0IsQ0FBdEIsRUFBeUIsQ0FBekIsRUFIdUI7T0FBekI7Ozs7Ozs7Ozs7OztxQ0FhZSxHQUFHLEdBQUc7QUFDckIsdUJBQU8sV0FBUCxHQUFxQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQXJCLENBRHFCOztBQUdyQixXQUFLLElBQUwsQ0FBVSxhQUFWLEVBQXlCLGlCQUFPLFdBQVAsQ0FBekIsQ0FIcUI7QUFJckIsV0FBSyxLQUFMLEdBSnFCOzs7U0FuRW5COzs7QUEyRU4seUJBQWUsUUFBZixDQUF3QixVQUF4QixFQUFvQyxPQUFwQzs7a0JBRWUiLCJmaWxlIjoiTG9jYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbGllbnQgZnJvbSAnLi4vY29yZS9jbGllbnQnO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBTcGFjZVZpZXcgZnJvbSAnLi4vdmlld3MvU3BhY2VWaWV3JztcbmltcG9ydCBTcXVhcmVkVmlldyBmcm9tICcuLi92aWV3cy9TcXVhcmVkVmlldyc7XG5pbXBvcnQgVG91Y2hTdXJmYWNlIGZyb20gJy4uL3ZpZXdzL1RvdWNoU3VyZmFjZSc7XG5cblxuY2xhc3MgX0xvY2F0b3JWaWV3IGV4dGVuZHMgU3F1YXJlZFZpZXcge1xuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKSB7XG4gICAgc3VwZXIodGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmFyZWEgPSBudWxsO1xuXG4gICAgdGhpcy5fb25BcmVhVG91Y2hTdGFydCA9IHRoaXMuX29uQXJlYVRvdWNoU3RhcnQuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkFyZWFUb3VjaE1vdmUgPSB0aGlzLl9vbkFyZWFUb3VjaE1vdmUuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBgYXJlYWAgZGVmaW5pdGlvbi5cbiAgICogQHBhcmFtIHtPYmplY3R9IGFyZWEgLSBPYmplY3QgY29udGFpbmluZyB0aGUgYXJlYSBkZWZpbml0aW9uLlxuICAgKi9cbiAgc2V0QXJlYShhcmVhKSB7XG4gICAgdGhpcy5fYXJlYSA9IGFyZWE7XG4gICAgdGhpcy5fcmVuZGVyQXJlYSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIHRoZSBmdW5jdGlvbiB0byBiZSBjYWxsZWQgd2hlbiB0aGUgbG9jYXRpb24gaXMgY2hvb3Nlbi5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIG9uU2VsZWN0KGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fb25TZWxlY3QgPSBjYWxsYmFjaztcbiAgfVxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICByZW1vdmUoKSB7XG4gICAgc3VwZXIucmVtb3ZlKCk7XG5cbiAgICB0aGlzLnN1cmZhY2UucmVtb3ZlTGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9vbkFyZWFUb3VjaFN0YXJ0KTtcbiAgICB0aGlzLnN1cmZhY2UucmVtb3ZlTGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMuX29uQXJlYVRvdWNoTW92ZSk7XG4gIH1cblxuICBfcmVuZGVyQXJlYSgpIHtcbiAgICB0aGlzLnNlbGVjdG9yID0gbmV3IFNwYWNlVmlldygpO1xuICAgIHRoaXMuc2VsZWN0b3Iuc2V0QXJlYSh0aGlzLl9hcmVhKTtcbiAgICB0aGlzLnNldFZpZXdDb21wb25lbnQoJy5zZWN0aW9uLXNxdWFyZScsIHRoaXMuc2VsZWN0b3IpO1xuICAgIHRoaXMucmVuZGVyKCcuc2VjdGlvbi1zcXVhcmUnKTtcblxuICAgIHRoaXMuc3VyZmFjZSA9IG5ldyBUb3VjaFN1cmZhY2UodGhpcy5zZWxlY3Rvci4kc3ZnKTtcbiAgICB0aGlzLnN1cmZhY2UuYWRkTGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9vbkFyZWFUb3VjaFN0YXJ0KTtcbiAgICB0aGlzLnN1cmZhY2UuYWRkTGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMuX29uQXJlYVRvdWNoTW92ZSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgb2YgdGhlIGB0b3VjaHN0YXJ0YCBldmVudC5cbiAgICovXG4gIF9vbkFyZWFUb3VjaFN0YXJ0KGlkLCBub3JtWCwgbm9ybVkpIHtcbiAgICBpZiAoIXRoaXMucG9zaXRpb24pIHtcbiAgICAgIHRoaXMuX2NyZWF0ZVBvc2l0aW9uKG5vcm1YLCBub3JtWSk7XG5cbiAgICAgIHRoaXMuY29udGVudC5zaG93QnRuID0gdHJ1ZTtcbiAgICAgIHRoaXMucmVuZGVyKCcuc2VjdGlvbi1mbG9hdCcpO1xuICAgICAgdGhpcy5pbnN0YWxsRXZlbnRzKHtcbiAgICAgICAgJ2NsaWNrIC5idG4nOiAoZSkgPT4gdGhpcy5fb25TZWxlY3QodGhpcy5wb3NpdGlvbi54LCB0aGlzLnBvc2l0aW9uLnkpLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVBvc2l0aW9uKG5vcm1YLCBub3JtWSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIG9mIHRoZSBgdG91Y2htb3ZlYCBldmVudC5cbiAgICovXG4gIF9vbkFyZWFUb3VjaE1vdmUoaWQsIG5vcm1YLCBub3JtWSkge1xuICAgIHRoaXMuX3VwZGF0ZVBvc2l0aW9uKG5vcm1YLCBub3JtWSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyB0aGUgcG9zaXRpb24gb2JqZWN0IGFjY29yZGluZyB0byBub3JtYWxpemVkIGNvb3JkaW5hdGVzLlxuICAgKiBAcGFyYW0ge051bWJlcn0gbm9ybVggLSBUaGUgbm9ybWFsaXplZCBjb29yZGluYXRlIGluIHRoZSB4IGF4aXMuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBub3JtWSAtIFRoZSBub3JtYWxpemVkIGNvb3JkaW5hdGUgaW4gdGhlIHkgYXhpcy5cbiAgICovXG4gIF9jcmVhdGVQb3NpdGlvbihub3JtWCwgbm9ybVkpIHtcbiAgICB0aGlzLnBvc2l0aW9uID0ge1xuICAgICAgaWQ6ICdsb2NhdG9yJyxcbiAgICAgIHg6IG5vcm1YICogdGhpcy5fYXJlYS53aWR0aCxcbiAgICAgIHk6IG5vcm1ZICogdGhpcy5fYXJlYS5oZWlnaHQsXG4gICAgfVxuXG4gICAgdGhpcy5zZWxlY3Rvci5hZGRQb2ludCh0aGlzLnBvc2l0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBwb3NpdGlvbiBvYmplY3QgYWNjb3JkaW5nIHRvIG5vcm1hbGl6ZWQgY29vcmRpbmF0ZXMuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBub3JtWCAtIFRoZSBub3JtYWxpemVkIGNvb3JkaW5hdGUgaW4gdGhlIHggYXhpcy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IG5vcm1ZIC0gVGhlIG5vcm1hbGl6ZWQgY29vcmRpbmF0ZSBpbiB0aGUgeSBheGlzLlxuICAgKi9cbiAgX3VwZGF0ZVBvc2l0aW9uKG5vcm1YLCBub3JtWSkge1xuICAgIHRoaXMucG9zaXRpb24ueCA9IG5vcm1YICogdGhpcy5fYXJlYS53aWR0aDtcbiAgICB0aGlzLnBvc2l0aW9uLnkgPSBub3JtWSAqIHRoaXMuX2FyZWEuaGVpZ2h0O1xuXG4gICAgdGhpcy5zZWxlY3Rvci51cGRhdGVQb2ludCh0aGlzLnBvc2l0aW9uKTtcbiAgfVxufVxuXG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpsb2NhdG9yJztcblxuLyoqXG4gKiBJbnRlcmZhY2Ugb2YgdGhlIGNsaWVudCBgJ2xvY2F0b3InYCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmljZSBpcyBvbmUgb2YgdGhlIHByb3ZpZGVkIHNlcnZpY2VzIGFpbWVkIGF0IGlkZW50aWZ5aW5nIGNsaWVudHMgaW5zaWRlXG4gKiB0aGUgZXhwZXJpZW5jZSBhbG9uZyB3aXRoIHRoZSBbYCdwbGFjZXInYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYWNlcn1cbiAqIGFuZCBbYCdjaGVja2luJ2Bde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DaGVja2lufSBzZXJ2aWNlcy5cbiAqXG4gKiBUaGUgYCdsb2NhdG9yJ2Agc2VydmljZSBhbGxvd3MgYSBjbGllbnQgdG8gZ2l2ZSBpdHMgYXBwcm94aW1hdGUgbG9jYXRpb24gaW5zaWRlXG4gKiBhIGdyYXBoaWNhbCByZXByZXNlbnRhdGlvbiBvZiB0aGUgYGFyZWFgIGFzIGRlZmluZWQgaW4gdGhlIHNlcnZlcidzIGBzZXR1cGBcbiAqIGNvbmZpZ3VyYXRpb24gZW50cnkuXG4gKlxuICogX18qVGhlIHNlcnZpY2UgbXVzdCBiZSB1c2VkIHdpdGggaXRzIFtzZXJ2ZXItc2lkZSBjb3VudGVycGFydF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLkxvY2F0b3J9Kl9fXG4gKlxuICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYWNlcn1cbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DaGVja2lufVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnJhbmRvbT1mYWxzZV0gLSBEZWZpbmVzIHdoZXRoZXIgdGhlIGxvY2F0aW9uIGlzXG4gKiAgc2V0IHJhbmRvbWx5IChtYWlubHkgZm9yIGRldmVsb3BtZW50IHB1cnBvc2VzKS5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAZXhhbXBsZVxuICogLy8gaW5zaWRlIHRoZSBleHBlcmllbmNlIGNvbnN0cnVjdG9yXG4gKiB0aGlzLmxvY2F0b3IgPSB0aGlzLnJlcXVpcmUoJ2xvY2F0b3InKTtcbiAqL1xuY2xhc3MgTG9jYXRvciBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIHRydWUpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICByYW5kb206IGZhbHNlLFxuICAgICAgdmlld0N0b3I6IF9Mb2NhdG9yVmlldyxcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgdGhpcy5fc2hhcmVkQ29uZmlnID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtY29uZmlnJyk7XG5cbiAgICB0aGlzLl9vbkFrbm93bGVkZ2VSZXNwb25zZSA9IHRoaXMuX29uQWtub3dsZWRnZVJlc3BvbnNlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fc2VuZENvb3JkaW5hdGVzID0gdGhpcy5fc2VuZENvb3JkaW5hdGVzLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgaW5pdCgpIHtcbiAgICB0aGlzLnZpZXdDdG9yID0gdGhpcy5vcHRpb25zLnZpZXdDdG9yO1xuICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlVmlldygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAoIXRoaXMuaGFzU3RhcnRlZClcbiAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgdGhpcy5zaG93KCk7XG5cbiAgICB0aGlzLnNlbmQoJ3JlcXVlc3QnKTtcbiAgICB0aGlzLnJlY2VpdmUoJ2Frbm93bGVkZ2UnLCB0aGlzLl9vbkFrbm93bGVkZ2VSZXNwb25zZSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RvcCgpIHtcbiAgICBzdXBlci5zdG9wKCk7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignYWtub3dsZWRnZScsIHRoaXMuX29uQWtub3dsZWRnZVJlc3BvbnNlKTtcblxuICAgIHRoaXMuaGlkZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhcmVhQ29uZmlnUGF0aCAtIFBhdGggdG8gdGhlIGFyZWEgaW4gdGhlIGNvbmZpZ3VyYXRpb24uXG4gICAqL1xuICBfb25Ba25vd2xlZGdlUmVzcG9uc2UoYXJlYUNvbmZpZ1BhdGgpIHtcbiAgICBjb25zdCBhcmVhID0gdGhpcy5fc2hhcmVkQ29uZmlnLmdldChhcmVhQ29uZmlnUGF0aCk7XG4gICAgdGhpcy52aWV3LnNldEFyZWEoYXJlYSk7XG4gICAgdGhpcy52aWV3Lm9uU2VsZWN0KHRoaXMuX3NlbmRDb29yZGluYXRlcyk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnJhbmRvbSkge1xuICAgICAgY29uc3QgeCA9IE1hdGgucmFuZG9tKCkgKiBhcmVhLndpZHRoO1xuICAgICAgY29uc3QgeSA9IE1hdGgucmFuZG9tKCkgKiBhcmVhLmhlaWdodDtcbiAgICAgIHRoaXMuX3NlbmRDb29yZGluYXRlcyh4LCB5KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBjb29yZGluYXRlcyB0byB0aGUgc2VydmVyLlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge051bWJlcn0geCAtIFRoZSBgeGAgY29vcmRpbmF0ZSBvZiB0aGUgY2xpZW50LlxuICAgKiBAcGFyYW0ge051bWJlcn0geSAtIFRoZSBgeWAgY29vcmRpbmF0ZSBvZiB0aGUgY2xpZW50LlxuICAgKi9cbiAgX3NlbmRDb29yZGluYXRlcyh4LCB5KSB7XG4gICAgY2xpZW50LmNvb3JkaW5hdGVzID0gW3gsIHldO1xuXG4gICAgdGhpcy5zZW5kKCdjb29yZGluYXRlcycsIGNsaWVudC5jb29yZGluYXRlcyk7XG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIExvY2F0b3IpO1xuXG5leHBvcnQgZGVmYXVsdCBMb2NhdG9yO1xuIl19