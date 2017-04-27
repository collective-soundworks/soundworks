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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * API of a compliant view for the `checkin` service.
 *
 * @memberof module:soundworks/client
 * @interface AbstractCheckinView
 * @extends module:soundworks/client.AbstractView
 * @abstract
 */
/**
 * Register the function that should be executed when the user is ready to
 * continue.
 *
 * @name setReadyCallback
 * @memberof module:soundworks/client.AbstractCheckinView
 * @function
 * @abstract
 * @instance
 *
 * @param {readyCallback} callback - Callback to execute when the user
 *  is ready to continue.
 */
/**
 * Update the label retrieved by the server.
 *
 * @name updateLabel
 * @memberof module:soundworks/client.AbstractCheckinView
 * @function
 * @abstract
 * @instance
 *
 * @param {String} label - Label to be displayed in the view.
 */
/**
 * Method executed when an error is received from the server (when no place is
 * is available in the experience).
 *
 * @name updateErrorStatus
 * @memberof module:soundworks/client.AbstractCheckinView
 * @function
 * @abstract
 * @instance
 *
 * @param {Boolean} value
 */

/**
 * Callback to execute when the user is ready to continue.
 *
 * @callback
 * @name readyCallback
 * @memberof module:soundworks/client.AbstractCheckinView
 */

var SERVICE_ID = 'service:checkin';

/**
 * Interface for the client `'checkin'` service.
 *
 * This service is one of the provided services aimed at identifying clients inside
 * the experience along with the [`'locator'`]{@link module:soundworks/client.Locator}
 * and [`'placer'`]{@link module:soundworks/client.Placer} services.
 *
 * The `'checkin'` service is the most simple among these services as the server
 * simply assigns a ticket to the client among the available ones. The ticket can
 * optionally be associated with coordinates or labels according to the server
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
 *  display a view informing the client of its position.
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

    var _this = (0, _possibleConstructorReturn3.default)(this, (Checkin.__proto__ || (0, _getPrototypeOf2.default)(Checkin)).call(this, SERVICE_ID, true));

    var defaults = {
      showDialog: false,
      order: 'ascending',
      viewPriority: 6
    };

    _this.configure(defaults);

    _this.require('platform');

    /**
     * Index given by the server.
     * @type {Number}
     */
    _this.index = -1;

    /**
     * Optionnal label given by the server.
     * @type {String}
     */
    _this.label = null;

    /**
     * Optionnal coordinates given by the server.
     * @type {String}
     */
    _this.coordinates = null;

    // bind callbacks to the current instance
    _this._onPositionResponse = _this._onPositionResponse.bind(_this);
    _this._onUnavailableResponse = _this._onUnavailableResponse.bind(_this);
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(Checkin, [{
    key: 'start',
    value: function start() {
      (0, _get3.default)(Checkin.prototype.__proto__ || (0, _getPrototypeOf2.default)(Checkin.prototype), 'start', this).call(this);

      this.setup = this._sharedConfigService;

      // send request to the server
      this.send('request', this.options.order);

      // setup listeners for the server's response
      this.receive('position', this._onPositionResponse);
      this.receive('unavailable', this._onUnavailableResponse);

      this.show();
    }

    /** @private */

  }, {
    key: 'stop',
    value: function stop() {
      (0, _get3.default)(Checkin.prototype.__proto__ || (0, _getPrototypeOf2.default)(Checkin.prototype), 'stop', this).call(this);
      // Remove listeners for the server's response
      this.removeListener('position', this._onPositionResponse);
      this.removeListener('unavailable', this._onUnavailableResponse);

      this.hide();
    }

    /** @private */

  }, {
    key: '_onPositionResponse',
    value: function _onPositionResponse(index, label, coordinates) {
      _client2.default.index = this.index = index;
      _client2.default.label = this.label = label;
      this.coordinates = coordinates;

      if (coordinates !== null && !_client2.default.coordinates) _client2.default.coordinates = coordinates;

      if (this.options.showDialog) {
        var displayLabel = label || (index + 1).toString();
        this.view.updateLabel(displayLabel);
        this.view.setReadyCallback(this.ready.bind(this));
      } else {
        this.ready();
      }
    }

    /** @private */

  }, {
    key: '_onUnavailableResponse',
    value: function _onUnavailableResponse() {
      this.view.updateErrorStatus(true);
    }
  }]);
  return Checkin;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, Checkin);

exports.default = Checkin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNoZWNraW4uanMiXSwibmFtZXMiOlsiU0VSVklDRV9JRCIsIkNoZWNraW4iLCJkZWZhdWx0cyIsInNob3dEaWFsb2ciLCJvcmRlciIsInZpZXdQcmlvcml0eSIsImNvbmZpZ3VyZSIsInJlcXVpcmUiLCJpbmRleCIsImxhYmVsIiwiY29vcmRpbmF0ZXMiLCJfb25Qb3NpdGlvblJlc3BvbnNlIiwiYmluZCIsIl9vblVuYXZhaWxhYmxlUmVzcG9uc2UiLCJzZXR1cCIsIl9zaGFyZWRDb25maWdTZXJ2aWNlIiwic2VuZCIsIm9wdGlvbnMiLCJyZWNlaXZlIiwic2hvdyIsInJlbW92ZUxpc3RlbmVyIiwiaGlkZSIsImRpc3BsYXlMYWJlbCIsInRvU3RyaW5nIiwidmlldyIsInVwZGF0ZUxhYmVsIiwic2V0UmVhZHlDYWxsYmFjayIsInJlYWR5IiwidXBkYXRlRXJyb3JTdGF0dXMiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQTs7Ozs7Ozs7QUFRQTs7Ozs7Ozs7Ozs7OztBQWFBOzs7Ozs7Ozs7OztBQVdBOzs7Ozs7Ozs7Ozs7O0FBYUE7Ozs7Ozs7O0FBU0EsSUFBTUEsYUFBYSxpQkFBbkI7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUE4Qk1DLE87OztBQUNKO0FBQ0EscUJBQWM7QUFBQTs7QUFBQSx3SUFDTkQsVUFETSxFQUNNLElBRE47O0FBR1osUUFBTUUsV0FBVztBQUNmQyxrQkFBWSxLQURHO0FBRWZDLGFBQU8sV0FGUTtBQUdmQyxvQkFBYztBQUhDLEtBQWpCOztBQU1BLFVBQUtDLFNBQUwsQ0FBZUosUUFBZjs7QUFFQSxVQUFLSyxPQUFMLENBQWEsVUFBYjs7QUFFQTs7OztBQUlBLFVBQUtDLEtBQUwsR0FBYSxDQUFDLENBQWQ7O0FBRUE7Ozs7QUFJQSxVQUFLQyxLQUFMLEdBQWEsSUFBYjs7QUFFQTs7OztBQUlBLFVBQUtDLFdBQUwsR0FBbUIsSUFBbkI7O0FBRUE7QUFDQSxVQUFLQyxtQkFBTCxHQUEyQixNQUFLQSxtQkFBTCxDQUF5QkMsSUFBekIsT0FBM0I7QUFDQSxVQUFLQyxzQkFBTCxHQUE4QixNQUFLQSxzQkFBTCxDQUE0QkQsSUFBNUIsT0FBOUI7QUFqQ1k7QUFrQ2I7O0FBRUQ7Ozs7OzRCQUNRO0FBQ047O0FBRUEsV0FBS0UsS0FBTCxHQUFhLEtBQUtDLG9CQUFsQjs7QUFFQTtBQUNBLFdBQUtDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLEtBQUtDLE9BQUwsQ0FBYWIsS0FBbEM7O0FBRUE7QUFDQSxXQUFLYyxPQUFMLENBQWEsVUFBYixFQUF5QixLQUFLUCxtQkFBOUI7QUFDQSxXQUFLTyxPQUFMLENBQWEsYUFBYixFQUE0QixLQUFLTCxzQkFBakM7O0FBRUEsV0FBS00sSUFBTDtBQUNEOztBQUVEOzs7OzJCQUNPO0FBQ0w7QUFDQTtBQUNBLFdBQUtDLGNBQUwsQ0FBb0IsVUFBcEIsRUFBZ0MsS0FBS1QsbUJBQXJDO0FBQ0EsV0FBS1MsY0FBTCxDQUFvQixhQUFwQixFQUFtQyxLQUFLUCxzQkFBeEM7O0FBRUEsV0FBS1EsSUFBTDtBQUNEOztBQUVEOzs7O3dDQUNvQmIsSyxFQUFPQyxLLEVBQU9DLFcsRUFBYTtBQUM3Qyx1QkFBT0YsS0FBUCxHQUFlLEtBQUtBLEtBQUwsR0FBYUEsS0FBNUI7QUFDQSx1QkFBT0MsS0FBUCxHQUFlLEtBQUtBLEtBQUwsR0FBYUEsS0FBNUI7QUFDQSxXQUFLQyxXQUFMLEdBQW1CQSxXQUFuQjs7QUFFQSxVQUFJQSxnQkFBZ0IsSUFBaEIsSUFBd0IsQ0FBQyxpQkFBT0EsV0FBcEMsRUFDRSxpQkFBT0EsV0FBUCxHQUFxQkEsV0FBckI7O0FBRUYsVUFBSSxLQUFLTyxPQUFMLENBQWFkLFVBQWpCLEVBQTZCO0FBQzNCLFlBQU1tQixlQUFlYixTQUFTLENBQUNELFFBQVEsQ0FBVCxFQUFZZSxRQUFaLEVBQTlCO0FBQ0EsYUFBS0MsSUFBTCxDQUFVQyxXQUFWLENBQXNCSCxZQUF0QjtBQUNBLGFBQUtFLElBQUwsQ0FBVUUsZ0JBQVYsQ0FBMkIsS0FBS0MsS0FBTCxDQUFXZixJQUFYLENBQWdCLElBQWhCLENBQTNCO0FBQ0QsT0FKRCxNQUlPO0FBQ0wsYUFBS2UsS0FBTDtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7NkNBQ3lCO0FBQ3ZCLFdBQUtILElBQUwsQ0FBVUksaUJBQVYsQ0FBNEIsSUFBNUI7QUFDRDs7Ozs7QUFHSCx5QkFBZUMsUUFBZixDQUF3QjdCLFVBQXhCLEVBQW9DQyxPQUFwQzs7a0JBRWVBLE8iLCJmaWxlIjoiQ2hlY2tpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbGllbnQgZnJvbSAnLi4vY29yZS9jbGllbnQnO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuLyoqXG4gKiBBUEkgb2YgYSBjb21wbGlhbnQgdmlldyBmb3IgdGhlIGBjaGVja2luYCBzZXJ2aWNlLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBpbnRlcmZhY2UgQWJzdHJhY3RDaGVja2luVmlld1xuICogQGV4dGVuZHMgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0Vmlld1xuICogQGFic3RyYWN0XG4gKi9cbi8qKlxuICogUmVnaXN0ZXIgdGhlIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIGJlIGV4ZWN1dGVkIHdoZW4gdGhlIHVzZXIgaXMgcmVhZHkgdG9cbiAqIGNvbnRpbnVlLlxuICpcbiAqIEBuYW1lIHNldFJlYWR5Q2FsbGJhY2tcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWJzdHJhY3RDaGVja2luVmlld1xuICogQGZ1bmN0aW9uXG4gKiBAYWJzdHJhY3RcbiAqIEBpbnN0YW5jZVxuICpcbiAqIEBwYXJhbSB7cmVhZHlDYWxsYmFja30gY2FsbGJhY2sgLSBDYWxsYmFjayB0byBleGVjdXRlIHdoZW4gdGhlIHVzZXJcbiAqICBpcyByZWFkeSB0byBjb250aW51ZS5cbiAqL1xuLyoqXG4gKiBVcGRhdGUgdGhlIGxhYmVsIHJldHJpZXZlZCBieSB0aGUgc2VydmVyLlxuICpcbiAqIEBuYW1lIHVwZGF0ZUxhYmVsXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0Q2hlY2tpblZpZXdcbiAqIEBmdW5jdGlvblxuICogQGFic3RyYWN0XG4gKiBAaW5zdGFuY2VcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbGFiZWwgLSBMYWJlbCB0byBiZSBkaXNwbGF5ZWQgaW4gdGhlIHZpZXcuXG4gKi9cbi8qKlxuICogTWV0aG9kIGV4ZWN1dGVkIHdoZW4gYW4gZXJyb3IgaXMgcmVjZWl2ZWQgZnJvbSB0aGUgc2VydmVyICh3aGVuIG5vIHBsYWNlIGlzXG4gKiBpcyBhdmFpbGFibGUgaW4gdGhlIGV4cGVyaWVuY2UpLlxuICpcbiAqIEBuYW1lIHVwZGF0ZUVycm9yU3RhdHVzXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0Q2hlY2tpblZpZXdcbiAqIEBmdW5jdGlvblxuICogQGFic3RyYWN0XG4gKiBAaW5zdGFuY2VcbiAqXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHZhbHVlXG4gKi9cblxuLyoqXG4gKiBDYWxsYmFjayB0byBleGVjdXRlIHdoZW4gdGhlIHVzZXIgaXMgcmVhZHkgdG8gY29udGludWUuXG4gKlxuICogQGNhbGxiYWNrXG4gKiBAbmFtZSByZWFkeUNhbGxiYWNrXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0Q2hlY2tpblZpZXdcbiAqL1xuXG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpjaGVja2luJztcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBjbGllbnQgYCdjaGVja2luJ2Agc2VydmljZS5cbiAqXG4gKiBUaGlzIHNlcnZpY2UgaXMgb25lIG9mIHRoZSBwcm92aWRlZCBzZXJ2aWNlcyBhaW1lZCBhdCBpZGVudGlmeWluZyBjbGllbnRzIGluc2lkZVxuICogdGhlIGV4cGVyaWVuY2UgYWxvbmcgd2l0aCB0aGUgW2AnbG9jYXRvcidgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuTG9jYXRvcn1cbiAqIGFuZCBbYCdwbGFjZXInYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYWNlcn0gc2VydmljZXMuXG4gKlxuICogVGhlIGAnY2hlY2tpbidgIHNlcnZpY2UgaXMgdGhlIG1vc3Qgc2ltcGxlIGFtb25nIHRoZXNlIHNlcnZpY2VzIGFzIHRoZSBzZXJ2ZXJcbiAqIHNpbXBseSBhc3NpZ25zIGEgdGlja2V0IHRvIHRoZSBjbGllbnQgYW1vbmcgdGhlIGF2YWlsYWJsZSBvbmVzLiBUaGUgdGlja2V0IGNhblxuICogb3B0aW9uYWxseSBiZSBhc3NvY2lhdGVkIHdpdGggY29vcmRpbmF0ZXMgb3IgbGFiZWxzIGFjY29yZGluZyB0byB0aGUgc2VydmVyXG4gKiBgc2V0dXBgIGNvbmZpZ3VyYXRpb24uXG4gKlxuICogVGhlIHNlcnZpY2UgcmVxdWlyZXMgdGhlIFsncGxhdGZvcm0nXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhdGZvcm19XG4gKiBzZXJ2aWNlLCBhcyBpdCBpcyBjb25zaWRlcmVkIHRoYXQgYW4gaW5kZXggc2hvdWxkIGJlIGdpdmVuIG9ubHkgdG8gY2xpZW50cyB3aG9cbiAqIGFjdGl2ZWx5IGVudGVyZWQgdGhlIGFwcGxpY2F0aW9uLlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIG11c3QgYmUgdXNlZCB3aXRoIGl0cyBbc2VydmVyLXNpZGUgY291bnRlcnBhcnRde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5DaGVja2lufSpfX1xuICpcbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5Mb2NhdG9yfVxuICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYWNlcn1cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5zaG93RGlhbG9nPWZhbHNlXSAtIERlZmluZSBpZiB0aGUgc2VydmljZSBzaG91bGRcbiAqICBkaXNwbGF5IGEgdmlldyBpbmZvcm1pbmcgdGhlIGNsaWVudCBvZiBpdHMgcG9zaXRpb24uXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQGV4YW1wbGVcbiAqIC8vIGluc2lkZSB0aGUgZXhwZXJpZW5jZSBjb25zdHJ1Y3RvclxuICogdGhpcy5jaGVja2luID0gdGhpcy5yZXF1aXJlKCdjaGVja2luJywgeyBzaG93RGlhbG9nOiB0cnVlIH0pO1xuICovXG5jbGFzcyBDaGVja2luIGV4dGVuZHMgU2VydmljZSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbmNpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgdHJ1ZSk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIHNob3dEaWFsb2c6IGZhbHNlLFxuICAgICAgb3JkZXI6ICdhc2NlbmRpbmcnLFxuICAgICAgdmlld1ByaW9yaXR5OiA2LFxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICB0aGlzLnJlcXVpcmUoJ3BsYXRmb3JtJyk7XG5cbiAgICAvKipcbiAgICAgKiBJbmRleCBnaXZlbiBieSB0aGUgc2VydmVyLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5pbmRleCA9IC0xO1xuXG4gICAgLyoqXG4gICAgICogT3B0aW9ubmFsIGxhYmVsIGdpdmVuIGJ5IHRoZSBzZXJ2ZXIuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLmxhYmVsID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIE9wdGlvbm5hbCBjb29yZGluYXRlcyBnaXZlbiBieSB0aGUgc2VydmVyLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5jb29yZGluYXRlcyA9IG51bGw7XG5cbiAgICAvLyBiaW5kIGNhbGxiYWNrcyB0byB0aGUgY3VycmVudCBpbnN0YW5jZVxuICAgIHRoaXMuX29uUG9zaXRpb25SZXNwb25zZSA9IHRoaXMuX29uUG9zaXRpb25SZXNwb25zZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uVW5hdmFpbGFibGVSZXNwb25zZSA9IHRoaXMuX29uVW5hdmFpbGFibGVSZXNwb25zZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICB0aGlzLnNldHVwID0gdGhpcy5fc2hhcmVkQ29uZmlnU2VydmljZTtcblxuICAgIC8vIHNlbmQgcmVxdWVzdCB0byB0aGUgc2VydmVyXG4gICAgdGhpcy5zZW5kKCdyZXF1ZXN0JywgdGhpcy5vcHRpb25zLm9yZGVyKTtcblxuICAgIC8vIHNldHVwIGxpc3RlbmVycyBmb3IgdGhlIHNlcnZlcidzIHJlc3BvbnNlXG4gICAgdGhpcy5yZWNlaXZlKCdwb3NpdGlvbicsIHRoaXMuX29uUG9zaXRpb25SZXNwb25zZSk7XG4gICAgdGhpcy5yZWNlaXZlKCd1bmF2YWlsYWJsZScsIHRoaXMuX29uVW5hdmFpbGFibGVSZXNwb25zZSk7XG5cbiAgICB0aGlzLnNob3coKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdG9wKCkge1xuICAgIHN1cGVyLnN0b3AoKTtcbiAgICAvLyBSZW1vdmUgbGlzdGVuZXJzIGZvciB0aGUgc2VydmVyJ3MgcmVzcG9uc2VcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdwb3NpdGlvbicsIHRoaXMuX29uUG9zaXRpb25SZXNwb25zZSk7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcigndW5hdmFpbGFibGUnLCB0aGlzLl9vblVuYXZhaWxhYmxlUmVzcG9uc2UpO1xuXG4gICAgdGhpcy5oaWRlKCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uUG9zaXRpb25SZXNwb25zZShpbmRleCwgbGFiZWwsIGNvb3JkaW5hdGVzKSB7XG4gICAgY2xpZW50LmluZGV4ID0gdGhpcy5pbmRleCA9IGluZGV4O1xuICAgIGNsaWVudC5sYWJlbCA9IHRoaXMubGFiZWwgPSBsYWJlbDtcbiAgICB0aGlzLmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XG5cbiAgICBpZiAoY29vcmRpbmF0ZXMgIT09IG51bGwgJiYgIWNsaWVudC5jb29yZGluYXRlcylcbiAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5zaG93RGlhbG9nKSB7XG4gICAgICBjb25zdCBkaXNwbGF5TGFiZWwgPSBsYWJlbCB8fCAoaW5kZXggKyAxKS50b1N0cmluZygpO1xuICAgICAgdGhpcy52aWV3LnVwZGF0ZUxhYmVsKGRpc3BsYXlMYWJlbCk7XG4gICAgICB0aGlzLnZpZXcuc2V0UmVhZHlDYWxsYmFjayh0aGlzLnJlYWR5LmJpbmQodGhpcykpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlYWR5KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vblVuYXZhaWxhYmxlUmVzcG9uc2UoKSB7XG4gICAgdGhpcy52aWV3LnVwZGF0ZUVycm9yU3RhdHVzKHRydWUpO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIENoZWNraW4pO1xuXG5leHBvcnQgZGVmYXVsdCBDaGVja2luO1xuIl19