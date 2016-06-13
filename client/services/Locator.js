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

var defaultViewTemplate = '\n<div class="section-square"></div>\n<div class="section-float flex-middle">\n  <% if (!showBtn) { %>\n    <p class="small"><%= instructions %></p>\n  <% } else { %>\n    <button class="btn"><%= send %></button>\n  <% } %>\n</div>';

var defaultViewContent = {
  instructions: 'Define your position in the area',
  send: 'Send',
  showBtn: false
};

/**
 * Interface for the view of the `locator` service.
 *
 * @interface AbstractLocatorView
 * @extends module:soundworks/client.View
 */
/**
 * Register the `area` definition to the view.
 *
 * @function
 * @name AbstractLocatorView.setArea
 * @param {Object} area - Definition of the area.
 * @property {Number} area.width - With of the area.
 * @property {Number} area.height - Height of the area.
 * @property {Number} [area.labels=[]] - Labels of the position.
 * @property {Number} [area.coordinates=[]] - Coordinates of the area.
 */
/**
 * Register the callback to be applied when the user select a position.
 *
 * @function
 * @name AbstractLocatorView.onSelect
 * @param {Function} callback - Callback to be applied when a position is selected.
 *  This callback should be called with the `index`, `label` and `coordinates` of
 *  the requested position.
 */

var LocatorView = function (_SquaredView) {
  (0, _inherits3.default)(LocatorView, _SquaredView);

  function LocatorView(template, content, events, options) {
    (0, _classCallCheck3.default)(this, LocatorView);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(LocatorView).call(this, template, content, events, options));

    _this.area = null;

    _this._onAreaTouchStart = _this._onAreaTouchStart.bind(_this);
    _this._onAreaTouchMove = _this._onAreaTouchMove.bind(_this);
    return _this;
  }

  /**
   * Sets the `area` definition.
   * @param {Object} area - Object containing the area definition.
   */


  (0, _createClass3.default)(LocatorView, [{
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
  }, {
    key: 'remove',
    value: function remove() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(LocatorView.prototype), 'remove', this).call(this);

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

      this.surface = new _TouchSurface2.default(this.selector.$svgContainer);
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
  return LocatorView;
}(_SquaredView3.default);

/**
 * Interface for the client `'locator'` service.
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
      viewCtor: LocatorView,
      viewPriority: 6
    };

    _this3.configure(defaults);

    _this3._defaultViewTemplate = defaultViewTemplate;
    _this3._defaultViewContent = defaultViewContent;

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
//# sourceMappingURL=data:application/json;base64,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TXFCLGMsRUFBZ0I7QUFDcEMsVUFBTSxPQUFPLEtBQUssYUFBTCxDQUFtQixHQUFuQixDQUF1QixjQUF2QixDQUFiO0FBQ0EsV0FBSyxJQUFMLENBQVUsT0FBVixDQUFrQixJQUFsQjtBQUNBLFdBQUssSUFBTCxDQUFVLFFBQVYsQ0FBbUIsS0FBSyxnQkFBeEI7O0FBRUEsVUFBSSxLQUFLLE9BQUwsQ0FBYSxNQUFqQixFQUF5QjtBQUN2QixZQUFNLElBQUksS0FBSyxNQUFMLEtBQWdCLEtBQUssS0FBL0I7QUFDQSxZQUFNLElBQUksS0FBSyxNQUFMLEtBQWdCLEtBQUssTUFBL0I7QUFDQSxhQUFLLGdCQUFMLENBQXNCLENBQXRCLEVBQXlCLENBQXpCO0FBQ0Q7QUFDRjs7Ozs7Ozs7Ozs7cUNBUWdCLEMsRUFBRyxDLEVBQUc7QUFDckIsdUJBQU8sV0FBUCxHQUFxQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQXJCOztBQUVBLFdBQUssSUFBTCxDQUFVLGFBQVYsRUFBeUIsaUJBQU8sV0FBaEM7QUFDQSxXQUFLLEtBQUw7QUFDRDs7Ozs7QUFHSCx5QkFBZSxRQUFmLENBQXdCLFVBQXhCLEVBQW9DLE9BQXBDOztrQkFFZSxPIiwiZmlsZSI6IkxvY2F0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xpZW50IGZyb20gJy4uL2NvcmUvY2xpZW50JztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgU3BhY2VWaWV3IGZyb20gJy4uL3ZpZXdzL1NwYWNlVmlldyc7XG5pbXBvcnQgU3F1YXJlZFZpZXcgZnJvbSAnLi4vdmlld3MvU3F1YXJlZFZpZXcnO1xuaW1wb3J0IFRvdWNoU3VyZmFjZSBmcm9tICcuLi92aWV3cy9Ub3VjaFN1cmZhY2UnO1xuXG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpsb2NhdG9yJztcblxuY29uc3QgZGVmYXVsdFZpZXdUZW1wbGF0ZSA9IGBcbjxkaXYgY2xhc3M9XCJzZWN0aW9uLXNxdWFyZVwiPjwvZGl2PlxuPGRpdiBjbGFzcz1cInNlY3Rpb24tZmxvYXQgZmxleC1taWRkbGVcIj5cbiAgPCUgaWYgKCFzaG93QnRuKSB7ICU+XG4gICAgPHAgY2xhc3M9XCJzbWFsbFwiPjwlPSBpbnN0cnVjdGlvbnMgJT48L3A+XG4gIDwlIH0gZWxzZSB7ICU+XG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ0blwiPjwlPSBzZW5kICU+PC9idXR0b24+XG4gIDwlIH0gJT5cbjwvZGl2PmA7XG5cbmNvbnN0IGRlZmF1bHRWaWV3Q29udGVudCA9IHtcbiAgaW5zdHJ1Y3Rpb25zOiAnRGVmaW5lIHlvdXIgcG9zaXRpb24gaW4gdGhlIGFyZWEnLFxuICBzZW5kOiAnU2VuZCcsXG4gIHNob3dCdG46IGZhbHNlLFxufTtcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSB2aWV3IG9mIHRoZSBgbG9jYXRvcmAgc2VydmljZS5cbiAqXG4gKiBAaW50ZXJmYWNlIEFic3RyYWN0TG9jYXRvclZpZXdcbiAqIEBleHRlbmRzIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3XG4gKi9cbi8qKlxuICogUmVnaXN0ZXIgdGhlIGBhcmVhYCBkZWZpbml0aW9uIHRvIHRoZSB2aWV3LlxuICpcbiAqIEBmdW5jdGlvblxuICogQG5hbWUgQWJzdHJhY3RMb2NhdG9yVmlldy5zZXRBcmVhXG4gKiBAcGFyYW0ge09iamVjdH0gYXJlYSAtIERlZmluaXRpb24gb2YgdGhlIGFyZWEuXG4gKiBAcHJvcGVydHkge051bWJlcn0gYXJlYS53aWR0aCAtIFdpdGggb2YgdGhlIGFyZWEuXG4gKiBAcHJvcGVydHkge051bWJlcn0gYXJlYS5oZWlnaHQgLSBIZWlnaHQgb2YgdGhlIGFyZWEuXG4gKiBAcHJvcGVydHkge051bWJlcn0gW2FyZWEubGFiZWxzPVtdXSAtIExhYmVscyBvZiB0aGUgcG9zaXRpb24uXG4gKiBAcHJvcGVydHkge051bWJlcn0gW2FyZWEuY29vcmRpbmF0ZXM9W11dIC0gQ29vcmRpbmF0ZXMgb2YgdGhlIGFyZWEuXG4gKi9cbi8qKlxuICogUmVnaXN0ZXIgdGhlIGNhbGxiYWNrIHRvIGJlIGFwcGxpZWQgd2hlbiB0aGUgdXNlciBzZWxlY3QgYSBwb3NpdGlvbi5cbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEBuYW1lIEFic3RyYWN0TG9jYXRvclZpZXcub25TZWxlY3RcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gQ2FsbGJhY2sgdG8gYmUgYXBwbGllZCB3aGVuIGEgcG9zaXRpb24gaXMgc2VsZWN0ZWQuXG4gKiAgVGhpcyBjYWxsYmFjayBzaG91bGQgYmUgY2FsbGVkIHdpdGggdGhlIGBpbmRleGAsIGBsYWJlbGAgYW5kIGBjb29yZGluYXRlc2Agb2ZcbiAqICB0aGUgcmVxdWVzdGVkIHBvc2l0aW9uLlxuICovXG5jbGFzcyBMb2NhdG9yVmlldyBleHRlbmRzIFNxdWFyZWRWaWV3IHtcbiAgY29uc3RydWN0b3IodGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cywgb3B0aW9ucykge1xuICAgIHN1cGVyKHRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5hcmVhID0gbnVsbDtcblxuICAgIHRoaXMuX29uQXJlYVRvdWNoU3RhcnQgPSB0aGlzLl9vbkFyZWFUb3VjaFN0YXJ0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25BcmVhVG91Y2hNb3ZlID0gdGhpcy5fb25BcmVhVG91Y2hNb3ZlLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgYGFyZWFgIGRlZmluaXRpb24uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhcmVhIC0gT2JqZWN0IGNvbnRhaW5pbmcgdGhlIGFyZWEgZGVmaW5pdGlvbi5cbiAgICovXG4gIHNldEFyZWEoYXJlYSkge1xuICAgIHRoaXMuX2FyZWEgPSBhcmVhO1xuICAgIHRoaXMuX3JlbmRlckFyZWEoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciB0aGUgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIHdoZW4gdGhlIGxvY2F0aW9uIGlzIGNob29zZW4uXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqL1xuICBvblNlbGVjdChjYWxsYmFjaykge1xuICAgIHRoaXMuX29uU2VsZWN0ID0gY2FsbGJhY2s7XG4gIH1cblxuICByZW1vdmUoKSB7XG4gICAgc3VwZXIucmVtb3ZlKCk7XG5cbiAgICB0aGlzLnN1cmZhY2UucmVtb3ZlTGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9vbkFyZWFUb3VjaFN0YXJ0KTtcbiAgICB0aGlzLnN1cmZhY2UucmVtb3ZlTGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMuX29uQXJlYVRvdWNoTW92ZSk7XG4gIH1cblxuICBfcmVuZGVyQXJlYSgpIHtcbiAgICB0aGlzLnNlbGVjdG9yID0gbmV3IFNwYWNlVmlldygpO1xuICAgIHRoaXMuc2VsZWN0b3Iuc2V0QXJlYSh0aGlzLl9hcmVhKTtcbiAgICB0aGlzLnNldFZpZXdDb21wb25lbnQoJy5zZWN0aW9uLXNxdWFyZScsIHRoaXMuc2VsZWN0b3IpO1xuICAgIHRoaXMucmVuZGVyKCcuc2VjdGlvbi1zcXVhcmUnKTtcblxuICAgIHRoaXMuc3VyZmFjZSA9IG5ldyBUb3VjaFN1cmZhY2UodGhpcy5zZWxlY3Rvci4kc3ZnQ29udGFpbmVyKTtcbiAgICB0aGlzLnN1cmZhY2UuYWRkTGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9vbkFyZWFUb3VjaFN0YXJ0KTtcbiAgICB0aGlzLnN1cmZhY2UuYWRkTGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMuX29uQXJlYVRvdWNoTW92ZSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgb2YgdGhlIGB0b3VjaHN0YXJ0YCBldmVudC5cbiAgICovXG4gIF9vbkFyZWFUb3VjaFN0YXJ0KGlkLCBub3JtWCwgbm9ybVkpIHtcbiAgICBpZiAoIXRoaXMucG9zaXRpb24pIHtcbiAgICAgIHRoaXMuX2NyZWF0ZVBvc2l0aW9uKG5vcm1YLCBub3JtWSk7XG5cbiAgICAgIHRoaXMuY29udGVudC5zaG93QnRuID0gdHJ1ZTtcbiAgICAgIHRoaXMucmVuZGVyKCcuc2VjdGlvbi1mbG9hdCcpO1xuICAgICAgdGhpcy5pbnN0YWxsRXZlbnRzKHtcbiAgICAgICAgJ2NsaWNrIC5idG4nOiAoZSkgPT4gdGhpcy5fb25TZWxlY3QodGhpcy5wb3NpdGlvbi54LCB0aGlzLnBvc2l0aW9uLnkpLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVBvc2l0aW9uKG5vcm1YLCBub3JtWSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIG9mIHRoZSBgdG91Y2htb3ZlYCBldmVudC5cbiAgICovXG4gIF9vbkFyZWFUb3VjaE1vdmUoaWQsIG5vcm1YLCBub3JtWSkge1xuICAgIHRoaXMuX3VwZGF0ZVBvc2l0aW9uKG5vcm1YLCBub3JtWSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyB0aGUgcG9zaXRpb24gb2JqZWN0IGFjY29yZGluZyB0byBub3JtYWxpemVkIGNvb3JkaW5hdGVzLlxuICAgKiBAcGFyYW0ge051bWJlcn0gbm9ybVggLSBUaGUgbm9ybWFsaXplZCBjb29yZGluYXRlIGluIHRoZSB4IGF4aXMuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBub3JtWSAtIFRoZSBub3JtYWxpemVkIGNvb3JkaW5hdGUgaW4gdGhlIHkgYXhpcy5cbiAgICovXG4gIF9jcmVhdGVQb3NpdGlvbihub3JtWCwgbm9ybVkpIHtcbiAgICB0aGlzLnBvc2l0aW9uID0ge1xuICAgICAgaWQ6ICdsb2NhdG9yJyxcbiAgICAgIHg6IG5vcm1YICogdGhpcy5fYXJlYS53aWR0aCxcbiAgICAgIHk6IG5vcm1ZICogdGhpcy5fYXJlYS5oZWlnaHQsXG4gICAgfVxuXG4gICAgdGhpcy5zZWxlY3Rvci5hZGRQb2ludCh0aGlzLnBvc2l0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBwb3NpdGlvbiBvYmplY3QgYWNjb3JkaW5nIHRvIG5vcm1hbGl6ZWQgY29vcmRpbmF0ZXMuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBub3JtWCAtIFRoZSBub3JtYWxpemVkIGNvb3JkaW5hdGUgaW4gdGhlIHggYXhpcy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IG5vcm1ZIC0gVGhlIG5vcm1hbGl6ZWQgY29vcmRpbmF0ZSBpbiB0aGUgeSBheGlzLlxuICAgKi9cbiAgX3VwZGF0ZVBvc2l0aW9uKG5vcm1YLCBub3JtWSkge1xuICAgIHRoaXMucG9zaXRpb24ueCA9IG5vcm1YICogdGhpcy5fYXJlYS53aWR0aDtcbiAgICB0aGlzLnBvc2l0aW9uLnkgPSBub3JtWSAqIHRoaXMuX2FyZWEuaGVpZ2h0O1xuXG4gICAgdGhpcy5zZWxlY3Rvci51cGRhdGVQb2ludCh0aGlzLnBvc2l0aW9uKTtcbiAgfVxufVxuXG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgY2xpZW50IGAnbG9jYXRvcidgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGlzIG9uZSBvZiB0aGUgcHJvdmlkZWQgc2VydmljZXMgYWltZWQgYXQgaWRlbnRpZnlpbmcgY2xpZW50cyBpbnNpZGVcbiAqIHRoZSBleHBlcmllbmNlIGFsb25nIHdpdGggdGhlIFtgJ3BsYWNlcidgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhY2VyfVxuICogYW5kIFtgJ2NoZWNraW4nYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNoZWNraW59IHNlcnZpY2VzLlxuICpcbiAqIFRoZSBgJ2xvY2F0b3InYCBzZXJ2aWNlIGFsbG93cyBhIGNsaWVudCB0byBnaXZlIGl0cyBhcHByb3hpbWF0ZSBsb2NhdGlvbiBpbnNpZGVcbiAqIGEgZ3JhcGhpY2FsIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBgYXJlYWAgYXMgZGVmaW5lZCBpbiB0aGUgc2VydmVyJ3MgYHNldHVwYFxuICogY29uZmlndXJhdGlvbiBlbnRyeS5cbiAqXG4gKiBfXypUaGUgc2VydmljZSBtdXN0IGJlIHVzZWQgd2l0aCBpdHMgW3NlcnZlci1zaWRlIGNvdW50ZXJwYXJ0XXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuTG9jYXRvcn0qX19cbiAqXG4gKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhY2VyfVxuICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNoZWNraW59XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMucmFuZG9tPWZhbHNlXSAtIERlZmluZXMgd2hldGhlciB0aGUgbG9jYXRpb24gaXNcbiAqICBzZXQgcmFuZG9tbHkgKG1haW5seSBmb3IgZGV2ZWxvcG1lbnQgcHVycG9zZXMpLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBleGFtcGxlXG4gKiAvLyBpbnNpZGUgdGhlIGV4cGVyaWVuY2UgY29uc3RydWN0b3JcbiAqIHRoaXMubG9jYXRvciA9IHRoaXMucmVxdWlyZSgnbG9jYXRvcicpO1xuICovXG5jbGFzcyBMb2NhdG9yIGV4dGVuZHMgU2VydmljZSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbmNpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgdHJ1ZSk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIHJhbmRvbTogZmFsc2UsXG4gICAgICB2aWV3Q3RvcjogTG9jYXRvclZpZXcsXG4gICAgICB2aWV3UHJpb3JpdHk6IDYsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIHRoaXMuX2RlZmF1bHRWaWV3VGVtcGxhdGUgPSBkZWZhdWx0Vmlld1RlbXBsYXRlO1xuICAgIHRoaXMuX2RlZmF1bHRWaWV3Q29udGVudCA9IGRlZmF1bHRWaWV3Q29udGVudDtcblxuICAgIHRoaXMuX3NoYXJlZENvbmZpZyA9IHRoaXMucmVxdWlyZSgnc2hhcmVkLWNvbmZpZycpO1xuXG4gICAgdGhpcy5fb25Ba25vd2xlZGdlUmVzcG9uc2UgPSB0aGlzLl9vbkFrbm93bGVkZ2VSZXNwb25zZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX3NlbmRDb29yZGluYXRlcyA9IHRoaXMuX3NlbmRDb29yZGluYXRlcy5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGluaXQoKSB7XG4gICAgdGhpcy52aWV3Q3RvciA9IHRoaXMub3B0aW9ucy52aWV3Q3RvcjtcbiAgICB0aGlzLnZpZXcgPSB0aGlzLmNyZWF0ZVZpZXcoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgaWYgKCF0aGlzLmhhc1N0YXJ0ZWQpXG4gICAgICB0aGlzLmluaXQoKTtcblxuICAgIHRoaXMuc2hvdygpO1xuXG4gICAgdGhpcy5zZW5kKCdyZXF1ZXN0Jyk7XG4gICAgdGhpcy5yZWNlaXZlKCdha25vd2xlZGdlJywgdGhpcy5fb25Ba25vd2xlZGdlUmVzcG9uc2UpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0b3AoKSB7XG4gICAgc3VwZXIuc3RvcCgpO1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ2Frbm93bGVkZ2UnLCB0aGlzLl9vbkFrbm93bGVkZ2VSZXNwb25zZSk7XG5cbiAgICB0aGlzLmhpZGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gYXJlYUNvbmZpZ1BhdGggLSBQYXRoIHRvIHRoZSBhcmVhIGluIHRoZSBjb25maWd1cmF0aW9uLlxuICAgKi9cbiAgX29uQWtub3dsZWRnZVJlc3BvbnNlKGFyZWFDb25maWdQYXRoKSB7XG4gICAgY29uc3QgYXJlYSA9IHRoaXMuX3NoYXJlZENvbmZpZy5nZXQoYXJlYUNvbmZpZ1BhdGgpO1xuICAgIHRoaXMudmlldy5zZXRBcmVhKGFyZWEpO1xuICAgIHRoaXMudmlldy5vblNlbGVjdCh0aGlzLl9zZW5kQ29vcmRpbmF0ZXMpO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5yYW5kb20pIHtcbiAgICAgIGNvbnN0IHggPSBNYXRoLnJhbmRvbSgpICogYXJlYS53aWR0aDtcbiAgICAgIGNvbnN0IHkgPSBNYXRoLnJhbmRvbSgpICogYXJlYS5oZWlnaHQ7XG4gICAgICB0aGlzLl9zZW5kQ29vcmRpbmF0ZXMoeCwgeSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgY29vcmRpbmF0ZXMgdG8gdGhlIHNlcnZlci5cbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHggLSBUaGUgYHhgIGNvb3JkaW5hdGUgb2YgdGhlIGNsaWVudC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHkgLSBUaGUgYHlgIGNvb3JkaW5hdGUgb2YgdGhlIGNsaWVudC5cbiAgICovXG4gIF9zZW5kQ29vcmRpbmF0ZXMoeCwgeSkge1xuICAgIGNsaWVudC5jb29yZGluYXRlcyA9IFt4LCB5XTtcblxuICAgIHRoaXMuc2VuZCgnY29vcmRpbmF0ZXMnLCBjbGllbnQuY29vcmRpbmF0ZXMpO1xuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBMb2NhdG9yKTtcblxuZXhwb3J0IGRlZmF1bHQgTG9jYXRvcjtcbiJdfQ==