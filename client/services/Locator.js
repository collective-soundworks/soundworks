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
 * @example
 * const locator = new Locator();
 */


var Locator = function (_Service) {
  (0, _inherits3.default)(Locator, _Service);

  function Locator() {
    (0, _classCallCheck3.default)(this, Locator);


    /**
     * @param {Object} [defaults={}] - Defaults configuration of the service.
     * @param {Boolean} [defaults.random=false] - Send random position to the server
     *  and call `this.done()` (for development purpose)
     * @param {View} [defaults.viewCtor=_LocatorView] - The contructor of the view to be used.
     *  The view must implement the `AbstractLocatorView` interface
     */

    var _this3 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Locator).call(this, SERVICE_ID, true));

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


  (0, _createClass3.default)(Locator, [{
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
      (0, _get3.default)((0, _getPrototypeOf2.default)(Locator.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      this.show();

      this.send('request');
      this.receive('aknowledge', this._onAknowledgeResponse);
    }

    /** @inheritdoc */

  }, {
    key: 'stop',
    value: function stop() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Locator.prototype), 'stop', this).call(this);
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
  return Locator;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, Locator);

exports.default = Locator;
//# sourceMappingURL=data:application/json;base64,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TCxDQUFsQyxDQUZLOztBQUlMLFdBQUssSUFBTCxHQUpLOzs7Ozs7Ozs7Ozs7OzBDQWNlLGdCQUFnQjtBQUNwQyxVQUFNLE9BQU8sS0FBSyxvQkFBTCxDQUEwQixHQUExQixDQUE4QixjQUE5QixDQUFQLENBRDhCO0FBRXBDLFdBQUssSUFBTCxDQUFVLE9BQVYsQ0FBa0IsSUFBbEIsRUFGb0M7QUFHcEMsV0FBSyxJQUFMLENBQVUsUUFBVixDQUFtQixLQUFLLGdCQUFMLENBQW5CLENBSG9DOztBQUtwQyxVQUFJLEtBQUssT0FBTCxDQUFhLE1BQWIsRUFBcUI7QUFDdkIsWUFBTSxJQUFJLEtBQUssTUFBTCxLQUFnQixLQUFLLEtBQUwsQ0FESDtBQUV2QixZQUFNLElBQUksS0FBSyxNQUFMLEtBQWdCLEtBQUssTUFBTCxDQUZIO0FBR3ZCLGFBQUssZ0JBQUwsQ0FBc0IsQ0FBdEIsRUFBeUIsQ0FBekIsRUFIdUI7T0FBekI7Ozs7Ozs7Ozs7OztxQ0FhZSxHQUFHLEdBQUc7QUFDckIsdUJBQU8sV0FBUCxHQUFxQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQXJCLENBRHFCOztBQUdyQixXQUFLLElBQUwsQ0FBVSxhQUFWLEVBQXlCLGlCQUFPLFdBQVAsQ0FBekIsQ0FIcUI7QUFJckIsV0FBSyxLQUFMLEdBSnFCOzs7U0E5RW5COzs7QUFzRk4seUJBQWUsUUFBZixDQUF3QixVQUF4QixFQUFvQyxPQUFwQzs7a0JBRWUiLCJmaWxlIjoiTG9jYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbGllbnQgZnJvbSAnLi4vY29yZS9jbGllbnQnO1xuLy8gaW1wb3J0IGxvY2FsU3RvcmFnZSBmcm9tICcuL2xvY2FsU3RvcmFnZSc7IC8vIEB0b2RvIC0gcmV0aGluayB0aGlzIHdpdGggZGJcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgU3BhY2VWaWV3IGZyb20gJy4uL3ZpZXdzL1NwYWNlVmlldyc7XG5pbXBvcnQgU3F1YXJlZFZpZXcgZnJvbSAnLi4vdmlld3MvU3F1YXJlZFZpZXcnO1xuaW1wb3J0IFRvdWNoU3VyZmFjZSBmcm9tICcuLi92aWV3cy9Ub3VjaFN1cmZhY2UnO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6bG9jYXRvcic7XG5cbmNsYXNzIF9Mb2NhdG9yVmlldyBleHRlbmRzIFNxdWFyZWRWaWV3IHtcbiAgY29uc3RydWN0b3IodGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cywgb3B0aW9ucykge1xuICAgIHN1cGVyKHRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5hcmVhID0gbnVsbDtcblxuICAgIHRoaXMuX29uQXJlYVRvdWNoU3RhcnQgPSB0aGlzLl9vbkFyZWFUb3VjaFN0YXJ0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25BcmVhVG91Y2hNb3ZlID0gdGhpcy5fb25BcmVhVG91Y2hNb3ZlLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgYGFyZWFgIGRlZmluaXRpb24uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhcmVhIC0gT2JqZWN0IGNvbnRhaW5pbmcgdGhlIGFyZWEgZGVmaW5pdGlvbi5cbiAgICovXG4gIHNldEFyZWEoYXJlYSkge1xuICAgIHRoaXMuX2FyZWEgPSBhcmVhO1xuICAgIHRoaXMuX3JlbmRlckFyZWEoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciB0aGUgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIHdoZW4gdGhlIGxvY2F0aW9uIGlzIGNob29zZW4uXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqL1xuICBvblNlbGVjdChjYWxsYmFjaykge1xuICAgIHRoaXMuX29uU2VsZWN0ID0gY2FsbGJhY2s7XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgcmVtb3ZlKCkge1xuICAgIHN1cGVyLnJlbW92ZSgpO1xuXG4gICAgdGhpcy5zdXJmYWNlLnJlbW92ZUxpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5fb25BcmVhVG91Y2hTdGFydCk7XG4gICAgdGhpcy5zdXJmYWNlLnJlbW92ZUxpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLl9vbkFyZWFUb3VjaE1vdmUpO1xuICB9XG5cbiAgX3JlbmRlckFyZWEoKSB7XG4gICAgdGhpcy5zZWxlY3RvciA9IG5ldyBTcGFjZVZpZXcoKTtcbiAgICB0aGlzLnNlbGVjdG9yLnNldEFyZWEodGhpcy5fYXJlYSk7XG4gICAgdGhpcy5zZXRWaWV3Q29tcG9uZW50KCcuc2VjdGlvbi1zcXVhcmUnLCB0aGlzLnNlbGVjdG9yKTtcbiAgICB0aGlzLnJlbmRlcignLnNlY3Rpb24tc3F1YXJlJyk7XG5cbiAgICB0aGlzLnN1cmZhY2UgPSBuZXcgVG91Y2hTdXJmYWNlKHRoaXMuc2VsZWN0b3IuJHN2Zyk7XG4gICAgdGhpcy5zdXJmYWNlLmFkZExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5fb25BcmVhVG91Y2hTdGFydCk7XG4gICAgdGhpcy5zdXJmYWNlLmFkZExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLl9vbkFyZWFUb3VjaE1vdmUpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIG9mIHRoZSBgdG91Y2hzdGFydGAgZXZlbnQuXG4gICAqL1xuICBfb25BcmVhVG91Y2hTdGFydChpZCwgbm9ybVgsIG5vcm1ZKSB7XG4gICAgaWYgKCF0aGlzLnBvc2l0aW9uKSB7XG4gICAgICB0aGlzLl9jcmVhdGVQb3NpdGlvbihub3JtWCwgbm9ybVkpO1xuXG4gICAgICB0aGlzLmNvbnRlbnQuc2hvd0J0biA9IHRydWU7XG4gICAgICB0aGlzLnJlbmRlcignLnNlY3Rpb24tZmxvYXQnKTtcbiAgICAgIHRoaXMuaW5zdGFsbEV2ZW50cyh7XG4gICAgICAgICdjbGljayAuYnRuJzogKGUpID0+IHRoaXMuX29uU2VsZWN0KHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55KSxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl91cGRhdGVQb3NpdGlvbihub3JtWCwgbm9ybVkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBvZiB0aGUgYHRvdWNobW92ZWAgZXZlbnQuXG4gICAqL1xuICBfb25BcmVhVG91Y2hNb3ZlKGlkLCBub3JtWCwgbm9ybVkpIHtcbiAgICB0aGlzLl91cGRhdGVQb3NpdGlvbihub3JtWCwgbm9ybVkpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgdGhlIHBvc2l0aW9uIG9iamVjdCBhY2NvcmRpbmcgdG8gbm9ybWFsaXplZCBjb29yZGluYXRlcy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IG5vcm1YIC0gVGhlIG5vcm1hbGl6ZWQgY29vcmRpbmF0ZSBpbiB0aGUgeCBheGlzLlxuICAgKiBAcGFyYW0ge051bWJlcn0gbm9ybVkgLSBUaGUgbm9ybWFsaXplZCBjb29yZGluYXRlIGluIHRoZSB5IGF4aXMuXG4gICAqL1xuICBfY3JlYXRlUG9zaXRpb24obm9ybVgsIG5vcm1ZKSB7XG4gICAgdGhpcy5wb3NpdGlvbiA9IHtcbiAgICAgIGlkOiAnbG9jYXRvcicsXG4gICAgICB4OiBub3JtWCAqIHRoaXMuX2FyZWEud2lkdGgsXG4gICAgICB5OiBub3JtWSAqIHRoaXMuX2FyZWEuaGVpZ2h0LFxuICAgIH1cblxuICAgIHRoaXMuc2VsZWN0b3IuYWRkUG9pbnQodGhpcy5wb3NpdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgcG9zaXRpb24gb2JqZWN0IGFjY29yZGluZyB0byBub3JtYWxpemVkIGNvb3JkaW5hdGVzLlxuICAgKiBAcGFyYW0ge051bWJlcn0gbm9ybVggLSBUaGUgbm9ybWFsaXplZCBjb29yZGluYXRlIGluIHRoZSB4IGF4aXMuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBub3JtWSAtIFRoZSBub3JtYWxpemVkIGNvb3JkaW5hdGUgaW4gdGhlIHkgYXhpcy5cbiAgICovXG4gIF91cGRhdGVQb3NpdGlvbihub3JtWCwgbm9ybVkpIHtcbiAgICB0aGlzLnBvc2l0aW9uLnggPSBub3JtWCAqIHRoaXMuX2FyZWEud2lkdGg7XG4gICAgdGhpcy5wb3NpdGlvbi55ID0gbm9ybVkgKiB0aGlzLl9hcmVhLmhlaWdodDtcblxuICAgIHRoaXMuc2VsZWN0b3IudXBkYXRlUG9pbnQodGhpcy5wb3NpdGlvbik7XG4gIH1cbn1cblxuLyoqXG4gKiBbY2xpZW50XSBBbGxvdyB0byBpbmRpY2F0ZSB0aGUgYXBwcm94aW1hdGUgbG9jYXRpb24gb2YgdGhlIGNsaWVudCBvbiBhIG1hcC5cbiAqXG4gKiBUaGUgbW9kdWxlIGFsd2F5cyBoYXMgYSB2aWV3IHRoYXQgZGlzcGxheXMgdGhlIG1hcCBhbmQgYSBidXR0b24gdG8gdmFsaWRhdGUgdGhlIGxvY2F0aW9uLlxuICpcbiAqIFRoZSBtb2R1bGUgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uIGFmdGVyIHRoZSB1c2VyIGNvbmZpcm1zIGhpcyAvIGhlciBhcHByb3hpbWF0ZSBsb2NhdGlvbiBieSBjbGlja2luZyBvbiB0aGUg4oCcVmFsaWRhdGXigJ0gYnV0dG9uLiBGb3IgZGV2ZWxvcG1lbnQgcHVycG9zZXMgaXQgY2FuIGJlIGNvbmZpZ3VyZWQgdG8gc2VuZCByYW5kb20gY29vcmRpbmF0ZXMgb3IgcmV0cmlldmluZyBwcmV2aW91c2x5IHN0b3JlZCBsb2NhdGlvbiAoc2VlIGBvcHRpb25zLnJhbmRvbWAgYW5kIGBvcHRpb25zLnBlcnNpc3RgLlxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCBsb2NhdG9yID0gbmV3IExvY2F0b3IoKTtcbiAqL1xuY2xhc3MgTG9jYXRvciBleHRlbmRzIFNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCB0cnVlKTtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbZGVmYXVsdHM9e31dIC0gRGVmYXVsdHMgY29uZmlndXJhdGlvbiBvZiB0aGUgc2VydmljZS5cbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtkZWZhdWx0cy5yYW5kb209ZmFsc2VdIC0gU2VuZCByYW5kb20gcG9zaXRpb24gdG8gdGhlIHNlcnZlclxuICAgICAqICBhbmQgY2FsbCBgdGhpcy5kb25lKClgIChmb3IgZGV2ZWxvcG1lbnQgcHVycG9zZSlcbiAgICAgKiBAcGFyYW0ge1ZpZXd9IFtkZWZhdWx0cy52aWV3Q3Rvcj1fTG9jYXRvclZpZXddIC0gVGhlIGNvbnRydWN0b3Igb2YgdGhlIHZpZXcgdG8gYmUgdXNlZC5cbiAgICAgKiAgVGhlIHZpZXcgbXVzdCBpbXBsZW1lbnQgdGhlIGBBYnN0cmFjdExvY2F0b3JWaWV3YCBpbnRlcmZhY2VcbiAgICAgKi9cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIHJhbmRvbTogZmFsc2UsXG4gICAgICAvLyBwZXJzaXN0OiBmYWxzZSwgLy8gQHRvZG8gLSByZS10aGluayB0aGlzIHdpdGggZGJcbiAgICAgIHZpZXdDdG9yOiBfTG9jYXRvclZpZXcsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIHRoaXMuX3NoYXJlZENvbmZpZ1NlcnZpY2UgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1jb25maWcnKTtcblxuICAgIHRoaXMuX29uQWtub3dsZWRnZVJlc3BvbnNlID0gdGhpcy5fb25Ba25vd2xlZGdlUmVzcG9uc2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9zZW5kQ29vcmRpbmF0ZXMgPSB0aGlzLl9zZW5kQ29vcmRpbmF0ZXMuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICBpbml0KCkge1xuICAgIHRoaXMudmlld0N0b3IgPSB0aGlzLm9wdGlvbnMudmlld0N0b3I7XG4gICAgLy8gdGhpcy52aWV3T3B0aW9uc1xuICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlVmlldygpO1xuICB9XG5cbiAgLyoqIEBpbmhlcml0ZG9jICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAoIXRoaXMuaGFzU3RhcnRlZClcbiAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgdGhpcy5zaG93KCk7XG5cbiAgICB0aGlzLnNlbmQoJ3JlcXVlc3QnKTtcbiAgICB0aGlzLnJlY2VpdmUoJ2Frbm93bGVkZ2UnLCB0aGlzLl9vbkFrbm93bGVkZ2VSZXNwb25zZSk7XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgc3RvcCgpIHtcbiAgICBzdXBlci5zdG9wKCk7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignYWtub3dsZWRnZScsIHRoaXMuX29uQWtub3dsZWRnZVJlc3BvbnNlKTtcblxuICAgIHRoaXMuaGlkZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEJ5cGFzcyB0aGUgbG9jYXRvciBhY2NvcmRpbmcgdG8gbW9kdWxlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAgICogSWYgYG9wdGlvbnMucmFuZG9tYCBpcyBzZXQgdG8gdHJ1ZSwgY3JlYXRlIHJhbmRvbSBjb29yZGluYXRlcyBhbmQgc2VuZCBpdFxuICAgKiAgdG8gdGhlIHNlcnZlciAobWFpbmx5IGZvciBkZXZlbG9wbWVudCBwdXJwb3NlcykuXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhcmVhIC0gVGhlIGFyZWEgYXMgZGVmaW5lZCBpbiBzZXJ2ZXIgY29uZmlndXJhdGlvbi5cbiAgICovXG4gIF9vbkFrbm93bGVkZ2VSZXNwb25zZShhcmVhQ29uZmlnUGF0aCkge1xuICAgIGNvbnN0IGFyZWEgPSB0aGlzLl9zaGFyZWRDb25maWdTZXJ2aWNlLmdldChhcmVhQ29uZmlnUGF0aCk7XG4gICAgdGhpcy52aWV3LnNldEFyZWEoYXJlYSk7XG4gICAgdGhpcy52aWV3Lm9uU2VsZWN0KHRoaXMuX3NlbmRDb29yZGluYXRlcyk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnJhbmRvbSkge1xuICAgICAgY29uc3QgeCA9IE1hdGgucmFuZG9tKCkgKiBhcmVhLndpZHRoO1xuICAgICAgY29uc3QgeSA9IE1hdGgucmFuZG9tKCkgKiBhcmVhLmhlaWdodDtcbiAgICAgIHRoaXMuX3NlbmRDb29yZGluYXRlcyh4LCB5KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBjb29yZGluYXRlcyB0byB0aGUgc2VydmVyLlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge051bWJlcn0geCAtIFRoZSBgeGAgY29vcmRpbmF0ZSBvZiB0aGUgY2xpZW50LlxuICAgKiBAcGFyYW0ge051bWJlcn0geSAtIFRoZSBgeWAgY29vcmRpbmF0ZSBvZiB0aGUgY2xpZW50LlxuICAgKi9cbiAgX3NlbmRDb29yZGluYXRlcyh4LCB5KSB7XG4gICAgY2xpZW50LmNvb3JkaW5hdGVzID0gW3gsIHldO1xuXG4gICAgdGhpcy5zZW5kKCdjb29yZGluYXRlcycsIGNsaWVudC5jb29yZGluYXRlcyk7XG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIExvY2F0b3IpO1xuXG5leHBvcnQgZGVmYXVsdCBMb2NhdG9yO1xuIl19