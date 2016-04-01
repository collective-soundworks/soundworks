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

      if (this.options.showDialog) {
        this.viewCtor = this.options.viewCtor;
        this.view = this.createView();
      }
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

      if (this.options.showDialog) this.show();
    }

    /** @private */

  }, {
    key: 'stop',
    value: function stop() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Checkin.prototype), 'stop', this).call(this);
      // Remove listeners for the server's response
      this.removeListener('position', this._onPositionResponse);
      this.removeListener('unavailable', this._onUnavailableResponse);

      if (this.options.showDialog) this.hide();
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
//# sourceMappingURL=data:application/json;base64,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Q0wsYUFBSyxLQUFMLEdBREs7T0FQUDs7Ozs7Ozs2Q0FhdUI7QUFDdkIsV0FBSyxXQUFMLENBQWlCLEtBQWpCLEdBQXlCLElBQXpCLENBRHVCO0FBRXZCLFdBQUssSUFBTCxDQUFVLE1BQVYsR0FGdUI7OztTQTdGckI7OztBQW1HTix5QkFBZSxRQUFmLENBQXdCLFVBQXhCLEVBQW9DLE9BQXBDOztrQkFFZSIsImZpbGUiOiJDaGVja2luLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsaWVudCBmcm9tICcuLi9jb3JlL2NsaWVudCc7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IFNlZ21lbnRlZFZpZXcgZnJvbSAnLi4vdmlld3MvU2VnbWVudGVkVmlldyc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOmNoZWNraW4nO1xuXG4vKipcbiAqIEludGVyZmFjZSBvZiB0aGUgY2xpZW50IGAnY2hlY2tpbidgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGlzIG9uZSBvZiB0aGUgcHJvdmlkZWQgc2VydmljZXMgYWltZWQgYXQgaWRlbnRpZnlpbmcgY2xpZW50cyBpbnNpZGVcbiAqIHRoZSBleHBlcmllbmNlIGFsb25nIHdpdGggdGhlIFtgJ2xvY2F0b3InYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkxvY2F0b3J9XG4gKiBhbmQgW2AncGxhY2VyJ2Bde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGFjZXJ9IHNlcnZpY2VzLlxuICpcbiAqIFRoZSBgJ2NoZWNraW4nYCBzZXJ2aWNlIGlzIHRoZSBtb3JlIHNpbXBsZSBhbW9uZyB0aGVzZSBzZXJ2aWNlcyBhcyB0aGUgc2VydmVyXG4gKiBzaW1wbHkgYXNzaWduIGEgdGlja2V0IHRvIHRoZSBjbGllbnQgYW1vbmcgdGhlIGF2YWlsYWJsZSBvbmVzLiBUaGUgdGlja2V0IGNhblxuICogb3B0aW9ubmFseSBiZSBhc3NvY2lhdGVkIHdpdGggY29vcmRpbmF0ZXMgb3IgbGFiZWwgYWNjb3JkaW5nIHRvIHRoZSBzZXJ2ZXJcbiAqIGBzZXR1cGAgY29uZmlndXJhdGlvbi5cbiAqXG4gKiBUaGUgc2VydmljZSByZXF1aXJlcyB0aGUgWydwbGF0Zm9ybSdde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGF0Zm9ybX1cbiAqIHNlcnZpY2UsIGFzIGl0IGlzIGNvbnNpZGVyZWQgdGhhdCBhbiBpbmRleCBzaG91bGQgYmUgZ2l2ZW4gb25seSB0byBjbGllbnRzIHdob1xuICogYWN0aXZlbHkgZW50ZXJlZCB0aGUgYXBwbGljYXRpb24uXG4gKlxuICogX18qVGhlIHNlcnZpY2UgbXVzdCBiZSB1c2VkIHdpdGggaXRzIFtzZXJ2ZXItc2lkZSBjb3VudGVycGFydF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLkNoZWNraW59Kl9fXG4gKlxuICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkxvY2F0b3J9XG4gKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhY2VyfVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnNob3dEaWFsb2c9ZmFsc2VdIC0gRGVmaW5lIGlmIHRoZSBzZXJ2aWNlIHNob3VsZFxuICogIGRpc3BsYXkgYSB2aWV3IGluZm9ybWFpbmcgdGhlIGNsaWVudCBvZiBpdCdzIHBvc2l0aW9uLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBleGFtcGxlXG4gKiAvLyBpbnNpZGUgdGhlIGV4cGVyaWVuY2UgY29uc3RydWN0b3JcbiAqIHRoaXMuY2hlY2tpbiA9IHRoaXMucmVxdWlyZSgnY2hlY2tpbicsIHsgc2hvd0RpYWxvZzogdHJ1ZSB9KTtcbiAqL1xuY2xhc3MgQ2hlY2tpbiBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIHRydWUpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBzaG93RGlhbG9nOiBmYWxzZSxcbiAgICAgIHZpZXdDdG9yOiBTZWdtZW50ZWRWaWV3LFxuICAgICAgdmlld1ByaW9yaXR5OiA2LFxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICB0aGlzLnJlcXVpcmUoJ3BsYXRmb3JtJywgeyBzaG93RGlhbG9nOiB0cnVlIH0pO1xuICAgIC8vIGJpbmQgY2FsbGJhY2tzIHRvIHRoZSBjdXJyZW50IGluc3RhbmNlXG4gICAgdGhpcy5fb25Qb3NpdGlvblJlc3BvbnNlID0gdGhpcy5fb25Qb3NpdGlvblJlc3BvbnNlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25VbmF2YWlsYWJsZVJlc3BvbnNlID0gdGhpcy5fb25VbmF2YWlsYWJsZVJlc3BvbnNlLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgaW5pdCgpIHtcbiAgICAvKipcbiAgICAgKiBJbmRleCBnaXZlbiBieSB0aGUgc2VydmVyLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5pbmRleCA9IC0xO1xuXG4gICAgLyoqXG4gICAgICogT3B0aW9ubmFsIGxhYmVsIGdpdmVuIGJ5IHRoZSBzZXJ2ZXIuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLmxhYmVsID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIE9wdGlvbm5hbCBjb29yZGluYXRlcyBnaXZlbiBieSB0aGUgc2VydmVyLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5jb29yZGluYXRlcyA9IG51bGw7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnNob3dEaWFsb2cpIHtcbiAgICAgIHRoaXMudmlld0N0b3IgPSB0aGlzLm9wdGlvbnMudmlld0N0b3I7XG4gICAgICB0aGlzLnZpZXcgPSB0aGlzLmNyZWF0ZVZpZXcoKTtcbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICghdGhpcy5oYXNTdGFydGVkKVxuICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB0aGlzLnNldHVwID0gdGhpcy5fc2hhcmVkQ29uZmlnU2VydmljZVxuICAgIC8vIHNlbmQgcmVxdWVzdCB0byB0aGUgc2VydmVyXG4gICAgdGhpcy5zZW5kKCdyZXF1ZXN0Jyk7XG4gICAgLy8gc2V0dXAgbGlzdGVuZXJzIGZvciB0aGUgc2VydmVyJ3MgcmVzcG9uc2VcbiAgICB0aGlzLnJlY2VpdmUoJ3Bvc2l0aW9uJywgdGhpcy5fb25Qb3NpdGlvblJlc3BvbnNlKTtcbiAgICB0aGlzLnJlY2VpdmUoJ3VuYXZhaWxhYmxlJywgdGhpcy5fb25VbmF2YWlsYWJsZVJlc3BvbnNlKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0RpYWxvZylcbiAgICAgIHRoaXMuc2hvdygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0b3AoKSB7XG4gICAgc3VwZXIuc3RvcCgpO1xuICAgIC8vIFJlbW92ZSBsaXN0ZW5lcnMgZm9yIHRoZSBzZXJ2ZXIncyByZXNwb25zZVxuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ3Bvc2l0aW9uJywgdGhpcy5fb25Qb3NpdGlvblJlc3BvbnNlKTtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCd1bmF2YWlsYWJsZScsIHRoaXMuX29uVW5hdmFpbGFibGVSZXNwb25zZSk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnNob3dEaWFsb2cpXG4gICAgICB0aGlzLmhpZGUoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25Qb3NpdGlvblJlc3BvbnNlKGluZGV4LCBsYWJlbCwgY29vcmRpbmF0ZXMpIHtcbiAgICBjbGllbnQuaW5kZXggPSB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgY2xpZW50LmxhYmVsID0gdGhpcy5sYWJlbCA9IGxhYmVsO1xuICAgIGNsaWVudC5jb29yZGluYXRlcyA9IHRoaXMuY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcztcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0RpYWxvZykge1xuICAgICAgY29uc3QgZGlzcGxheUxhYmVsID0gbGFiZWwgfHwgKGluZGV4ICsgMSkudG9TdHJpbmcoKTtcbiAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IGNsaWVudC5wbGF0Zm9ybS5pc01vYmlsZSA/ICdjbGljaycgOiAndG91Y2hzdGFydCc7XG5cbiAgICAgIHRoaXMudmlld0NvbnRlbnQubGFiZWwgPSBkaXNwbGF5TGFiZWw7XG4gICAgICB0aGlzLnZpZXcuaW5zdGFsbEV2ZW50cyh7IFtldmVudE5hbWVdOiAoKSA9PiB0aGlzLnJlYWR5KCkgfSk7XG4gICAgICB0aGlzLnZpZXcucmVuZGVyKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVhZHkoKTtcbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uVW5hdmFpbGFibGVSZXNwb25zZSgpIHtcbiAgICB0aGlzLnZpZXdDb250ZW50LmVycm9yID0gdHJ1ZTtcbiAgICB0aGlzLnZpZXcucmVuZGVyKCk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgQ2hlY2tpbik7XG5cbmV4cG9ydCBkZWZhdWx0IENoZWNraW47XG4iXX0=