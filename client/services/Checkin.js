'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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

var _SegmentedView = require('../views/SegmentedView');

var _SegmentedView2 = _interopRequireDefault(_SegmentedView);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:checkin';

/**
 * Interface of the client `'checkin'` service.
 *
 * This service is one of the provided services aimed at identifying clients inside
 * the experience along with the [`'locator'`]{@link module:soundworks/client.Locator}
 * and [`'placer'`]{@link module:soundworks/client.Placer} services.
 *
 * The `'checkin'` service is the more simple among these services as the server
 * simply assign a ticket to the client among the available ones. The ticket can
 * optionnaly be associated with coordinates or label according to the server
 * `setup` configuration.
 *
 * The service requires the ['platform']{@link module:soundworks/client.Platform}
 * service, as it is considered that an index should be given only to clients who
 * actively entered the application.
 *
 * __*The service must be used with its [server-side counterpart]{@link module:soundworks/server.Checkin}*__
 *
 * @see {@link module:soundworks/client.Locator}
 * @see {@link module:soundworks/client.Placer}
 *
 * @param {Object} options
 * @param {Boolean} [options.showDialog=false] - Define if the service should
 *  display a view informaing the client of it's position.
 *
 * @memberof module:soundworks/client
 * @example
 * // inside the experience constructor
 * this.checkin = this.require('checkin', { showDialog: true });
 */

var Checkin = function (_Service) {
  (0, _inherits3.default)(Checkin, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */

  function Checkin() {
    (0, _classCallCheck3.default)(this, Checkin);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Checkin).call(this, SERVICE_ID, true));

    var defaults = {
      showDialog: false,
      viewCtor: _SegmentedView2.default,
      viewPriority: 6
    };

    _this.configure(defaults);

    _this.require('platform', { showDialog: true });
    // bind callbacks to the current instance
    _this._onPositionResponse = _this._onPositionResponse.bind(_this);
    _this._onUnavailableResponse = _this._onUnavailableResponse.bind(_this);
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(Checkin, [{
    key: 'init',
    value: function init() {
      /**
       * Index given by the server.
       * @type {Number}
       */
      this.index = -1;

      /**
       * Optionnal label given by the server.
       * @type {String}
       */
      this.label = null;

      /**
       * Optionnal coordinates given by the server.
       * @type {String}
       */
      this.coordinates = null;

      // view should be always be created in case of unavailability
      this.viewCtor = this.options.viewCtor;
      this.view = this.createView();
    }

    /** @private */

  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Checkin.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      this.setup = this._sharedConfigService;
      // send request to the server
      this.send('request');
      // setup listeners for the server's response
      this.receive('position', this._onPositionResponse);
      this.receive('unavailable', this._onUnavailableResponse);

      this.show();
    }

    /** @private */

  }, {
    key: 'stop',
    value: function stop() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Checkin.prototype), 'stop', this).call(this);
      // Remove listeners for the server's response
      this.removeListener('position', this._onPositionResponse);
      this.removeListener('unavailable', this._onUnavailableResponse);

      this.hide();
    }

    /** @private */

  }, {
    key: '_onPositionResponse',
    value: function _onPositionResponse(index, label, coordinates) {
      var _this2 = this;

      _client2.default.index = this.index = index;
      _client2.default.label = this.label = label;
      _client2.default.coordinates = this.coordinates = coordinates;

      if (this.options.showDialog) {
        var displayLabel = label || (index + 1).toString();
        var eventName = _client2.default.platform.isMobile ? 'click' : 'touchstart';

        this.viewContent.label = displayLabel;
        this.view.installEvents((0, _defineProperty3.default)({}, eventName, function () {
          return _this2.ready();
        }));
        this.view.render();
      } else {
        this.ready();
      }
    }

    /** @private */

  }, {
    key: '_onUnavailableResponse',
    value: function _onUnavailableResponse() {
      this.viewContent.error = true;
      this.view.render();
    }
  }]);
  return Checkin;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, Checkin);

exports.default = Checkin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNoZWNraW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFHQSxJQUFNLGFBQWEsaUJBQW5COzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFnQ00sTzs7Ozs7QUFFSixxQkFBYztBQUFBOztBQUFBLGlIQUNOLFVBRE0sRUFDTSxJQUROOztBQUdaLFFBQU0sV0FBVztBQUNmLGtCQUFZLEtBREc7QUFFZix1Q0FGZTtBQUdmLG9CQUFjO0FBSEMsS0FBakI7O0FBTUEsVUFBSyxTQUFMLENBQWUsUUFBZjs7QUFFQSxVQUFLLE9BQUwsQ0FBYSxVQUFiLEVBQXlCLEVBQUUsWUFBWSxJQUFkLEVBQXpCOztBQUVBLFVBQUssbUJBQUwsR0FBMkIsTUFBSyxtQkFBTCxDQUF5QixJQUF6QixPQUEzQjtBQUNBLFVBQUssc0JBQUwsR0FBOEIsTUFBSyxzQkFBTCxDQUE0QixJQUE1QixPQUE5QjtBQWRZO0FBZWI7Ozs7Ozs7MkJBR007Ozs7O0FBS0wsV0FBSyxLQUFMLEdBQWEsQ0FBQyxDQUFkOzs7Ozs7QUFNQSxXQUFLLEtBQUwsR0FBYSxJQUFiOzs7Ozs7QUFNQSxXQUFLLFdBQUwsR0FBbUIsSUFBbkI7OztBQUdBLFdBQUssUUFBTCxHQUFnQixLQUFLLE9BQUwsQ0FBYSxRQUE3QjtBQUNBLFdBQUssSUFBTCxHQUFZLEtBQUssVUFBTCxFQUFaO0FBQ0Q7Ozs7Ozs0QkFHTztBQUNOOztBQUVBLFVBQUksQ0FBQyxLQUFLLFVBQVYsRUFDRSxLQUFLLElBQUw7O0FBRUYsV0FBSyxLQUFMLEdBQWEsS0FBSyxvQkFBbEI7O0FBRUEsV0FBSyxJQUFMLENBQVUsU0FBVjs7QUFFQSxXQUFLLE9BQUwsQ0FBYSxVQUFiLEVBQXlCLEtBQUssbUJBQTlCO0FBQ0EsV0FBSyxPQUFMLENBQWEsYUFBYixFQUE0QixLQUFLLHNCQUFqQzs7QUFFQSxXQUFLLElBQUw7QUFDRDs7Ozs7OzJCQUdNO0FBQ0w7O0FBRUEsV0FBSyxjQUFMLENBQW9CLFVBQXBCLEVBQWdDLEtBQUssbUJBQXJDO0FBQ0EsV0FBSyxjQUFMLENBQW9CLGFBQXBCLEVBQW1DLEtBQUssc0JBQXhDOztBQUVBLFdBQUssSUFBTDtBQUNEOzs7Ozs7d0NBR21CLEssRUFBTyxLLEVBQU8sVyxFQUFhO0FBQUE7O0FBQzdDLHVCQUFPLEtBQVAsR0FBZSxLQUFLLEtBQUwsR0FBYSxLQUE1QjtBQUNBLHVCQUFPLEtBQVAsR0FBZSxLQUFLLEtBQUwsR0FBYSxLQUE1QjtBQUNBLHVCQUFPLFdBQVAsR0FBcUIsS0FBSyxXQUFMLEdBQW1CLFdBQXhDOztBQUVBLFVBQUksS0FBSyxPQUFMLENBQWEsVUFBakIsRUFBNkI7QUFDM0IsWUFBTSxlQUFlLFNBQVMsQ0FBQyxRQUFRLENBQVQsRUFBWSxRQUFaLEVBQTlCO0FBQ0EsWUFBTSxZQUFZLGlCQUFPLFFBQVAsQ0FBZ0IsUUFBaEIsR0FBMkIsT0FBM0IsR0FBcUMsWUFBdkQ7O0FBRUEsYUFBSyxXQUFMLENBQWlCLEtBQWpCLEdBQXlCLFlBQXpCO0FBQ0EsYUFBSyxJQUFMLENBQVUsYUFBVixtQ0FBMkIsU0FBM0IsRUFBdUM7QUFBQSxpQkFBTSxPQUFLLEtBQUwsRUFBTjtBQUFBLFNBQXZDO0FBQ0EsYUFBSyxJQUFMLENBQVUsTUFBVjtBQUNELE9BUEQsTUFPTztBQUNMLGFBQUssS0FBTDtBQUNEO0FBQ0Y7Ozs7Ozs2Q0FHd0I7QUFDdkIsV0FBSyxXQUFMLENBQWlCLEtBQWpCLEdBQXlCLElBQXpCO0FBQ0EsV0FBSyxJQUFMLENBQVUsTUFBVjtBQUNEOzs7OztBQUdILHlCQUFlLFFBQWYsQ0FBd0IsVUFBeEIsRUFBb0MsT0FBcEM7O2tCQUVlLE8iLCJmaWxlIjoiQ2hlY2tpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbGllbnQgZnJvbSAnLi4vY29yZS9jbGllbnQnO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBTZWdtZW50ZWRWaWV3IGZyb20gJy4uL3ZpZXdzL1NlZ21lbnRlZFZpZXcnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuXG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpjaGVja2luJztcblxuLyoqXG4gKiBJbnRlcmZhY2Ugb2YgdGhlIGNsaWVudCBgJ2NoZWNraW4nYCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmljZSBpcyBvbmUgb2YgdGhlIHByb3ZpZGVkIHNlcnZpY2VzIGFpbWVkIGF0IGlkZW50aWZ5aW5nIGNsaWVudHMgaW5zaWRlXG4gKiB0aGUgZXhwZXJpZW5jZSBhbG9uZyB3aXRoIHRoZSBbYCdsb2NhdG9yJ2Bde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5Mb2NhdG9yfVxuICogYW5kIFtgJ3BsYWNlcidgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhY2VyfSBzZXJ2aWNlcy5cbiAqXG4gKiBUaGUgYCdjaGVja2luJ2Agc2VydmljZSBpcyB0aGUgbW9yZSBzaW1wbGUgYW1vbmcgdGhlc2Ugc2VydmljZXMgYXMgdGhlIHNlcnZlclxuICogc2ltcGx5IGFzc2lnbiBhIHRpY2tldCB0byB0aGUgY2xpZW50IGFtb25nIHRoZSBhdmFpbGFibGUgb25lcy4gVGhlIHRpY2tldCBjYW5cbiAqIG9wdGlvbm5hbHkgYmUgYXNzb2NpYXRlZCB3aXRoIGNvb3JkaW5hdGVzIG9yIGxhYmVsIGFjY29yZGluZyB0byB0aGUgc2VydmVyXG4gKiBgc2V0dXBgIGNvbmZpZ3VyYXRpb24uXG4gKlxuICogVGhlIHNlcnZpY2UgcmVxdWlyZXMgdGhlIFsncGxhdGZvcm0nXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhdGZvcm19XG4gKiBzZXJ2aWNlLCBhcyBpdCBpcyBjb25zaWRlcmVkIHRoYXQgYW4gaW5kZXggc2hvdWxkIGJlIGdpdmVuIG9ubHkgdG8gY2xpZW50cyB3aG9cbiAqIGFjdGl2ZWx5IGVudGVyZWQgdGhlIGFwcGxpY2F0aW9uLlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIG11c3QgYmUgdXNlZCB3aXRoIGl0cyBbc2VydmVyLXNpZGUgY291bnRlcnBhcnRde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5DaGVja2lufSpfX1xuICpcbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5Mb2NhdG9yfVxuICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYWNlcn1cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5zaG93RGlhbG9nPWZhbHNlXSAtIERlZmluZSBpZiB0aGUgc2VydmljZSBzaG91bGRcbiAqICBkaXNwbGF5IGEgdmlldyBpbmZvcm1haW5nIHRoZSBjbGllbnQgb2YgaXQncyBwb3NpdGlvbi5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAZXhhbXBsZVxuICogLy8gaW5zaWRlIHRoZSBleHBlcmllbmNlIGNvbnN0cnVjdG9yXG4gKiB0aGlzLmNoZWNraW4gPSB0aGlzLnJlcXVpcmUoJ2NoZWNraW4nLCB7IHNob3dEaWFsb2c6IHRydWUgfSk7XG4gKi9cbmNsYXNzIENoZWNraW4gZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFuY2lhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCB0cnVlKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgc2hvd0RpYWxvZzogZmFsc2UsXG4gICAgICB2aWV3Q3RvcjogU2VnbWVudGVkVmlldyxcbiAgICAgIHZpZXdQcmlvcml0eTogNixcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgdGhpcy5yZXF1aXJlKCdwbGF0Zm9ybScsIHsgc2hvd0RpYWxvZzogdHJ1ZSB9KTtcbiAgICAvLyBiaW5kIGNhbGxiYWNrcyB0byB0aGUgY3VycmVudCBpbnN0YW5jZVxuICAgIHRoaXMuX29uUG9zaXRpb25SZXNwb25zZSA9IHRoaXMuX29uUG9zaXRpb25SZXNwb25zZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uVW5hdmFpbGFibGVSZXNwb25zZSA9IHRoaXMuX29uVW5hdmFpbGFibGVSZXNwb25zZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGluaXQoKSB7XG4gICAgLyoqXG4gICAgICogSW5kZXggZ2l2ZW4gYnkgdGhlIHNlcnZlci5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuaW5kZXggPSAtMTtcblxuICAgIC8qKlxuICAgICAqIE9wdGlvbm5hbCBsYWJlbCBnaXZlbiBieSB0aGUgc2VydmVyLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5sYWJlbCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBPcHRpb25uYWwgY29vcmRpbmF0ZXMgZ2l2ZW4gYnkgdGhlIHNlcnZlci5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBudWxsO1xuXG4gICAgLy8gdmlldyBzaG91bGQgYmUgYWx3YXlzIGJlIGNyZWF0ZWQgaW4gY2FzZSBvZiB1bmF2YWlsYWJpbGl0eVxuICAgIHRoaXMudmlld0N0b3IgPSB0aGlzLm9wdGlvbnMudmlld0N0b3I7XG4gICAgdGhpcy52aWV3ID0gdGhpcy5jcmVhdGVWaWV3KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICghdGhpcy5oYXNTdGFydGVkKVxuICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB0aGlzLnNldHVwID0gdGhpcy5fc2hhcmVkQ29uZmlnU2VydmljZVxuICAgIC8vIHNlbmQgcmVxdWVzdCB0byB0aGUgc2VydmVyXG4gICAgdGhpcy5zZW5kKCdyZXF1ZXN0Jyk7XG4gICAgLy8gc2V0dXAgbGlzdGVuZXJzIGZvciB0aGUgc2VydmVyJ3MgcmVzcG9uc2VcbiAgICB0aGlzLnJlY2VpdmUoJ3Bvc2l0aW9uJywgdGhpcy5fb25Qb3NpdGlvblJlc3BvbnNlKTtcbiAgICB0aGlzLnJlY2VpdmUoJ3VuYXZhaWxhYmxlJywgdGhpcy5fb25VbmF2YWlsYWJsZVJlc3BvbnNlKTtcblxuICAgIHRoaXMuc2hvdygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0b3AoKSB7XG4gICAgc3VwZXIuc3RvcCgpO1xuICAgIC8vIFJlbW92ZSBsaXN0ZW5lcnMgZm9yIHRoZSBzZXJ2ZXIncyByZXNwb25zZVxuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ3Bvc2l0aW9uJywgdGhpcy5fb25Qb3NpdGlvblJlc3BvbnNlKTtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCd1bmF2YWlsYWJsZScsIHRoaXMuX29uVW5hdmFpbGFibGVSZXNwb25zZSk7XG5cbiAgICB0aGlzLmhpZGUoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25Qb3NpdGlvblJlc3BvbnNlKGluZGV4LCBsYWJlbCwgY29vcmRpbmF0ZXMpIHtcbiAgICBjbGllbnQuaW5kZXggPSB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgY2xpZW50LmxhYmVsID0gdGhpcy5sYWJlbCA9IGxhYmVsO1xuICAgIGNsaWVudC5jb29yZGluYXRlcyA9IHRoaXMuY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcztcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0RpYWxvZykge1xuICAgICAgY29uc3QgZGlzcGxheUxhYmVsID0gbGFiZWwgfHwgKGluZGV4ICsgMSkudG9TdHJpbmcoKTtcbiAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IGNsaWVudC5wbGF0Zm9ybS5pc01vYmlsZSA/ICdjbGljaycgOiAndG91Y2hzdGFydCc7XG5cbiAgICAgIHRoaXMudmlld0NvbnRlbnQubGFiZWwgPSBkaXNwbGF5TGFiZWw7XG4gICAgICB0aGlzLnZpZXcuaW5zdGFsbEV2ZW50cyh7IFtldmVudE5hbWVdOiAoKSA9PiB0aGlzLnJlYWR5KCkgfSk7XG4gICAgICB0aGlzLnZpZXcucmVuZGVyKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVhZHkoKTtcbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uVW5hdmFpbGFibGVSZXNwb25zZSgpIHtcbiAgICB0aGlzLnZpZXdDb250ZW50LmVycm9yID0gdHJ1ZTtcbiAgICB0aGlzLnZpZXcucmVuZGVyKCk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgQ2hlY2tpbik7XG5cbmV4cG9ydCBkZWZhdWx0IENoZWNraW47XG4iXX0=