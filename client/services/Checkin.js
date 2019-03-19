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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNoZWNraW4uanMiXSwibmFtZXMiOlsiU0VSVklDRV9JRCIsIkNoZWNraW4iLCJkZWZhdWx0cyIsInNob3dEaWFsb2ciLCJvcmRlciIsInZpZXdQcmlvcml0eSIsImNvbmZpZ3VyZSIsInJlcXVpcmUiLCJpbmRleCIsImxhYmVsIiwiY29vcmRpbmF0ZXMiLCJfb25Qb3NpdGlvblJlc3BvbnNlIiwiYmluZCIsIl9vblVuYXZhaWxhYmxlUmVzcG9uc2UiLCJzZXR1cCIsIl9zaGFyZWRDb25maWdTZXJ2aWNlIiwic2VuZCIsIm9wdGlvbnMiLCJyZWNlaXZlIiwic2hvdyIsInJlbW92ZUxpc3RlbmVyIiwiaGlkZSIsImNsaWVudCIsImRpc3BsYXlMYWJlbCIsInRvU3RyaW5nIiwidmlldyIsInVwZGF0ZUxhYmVsIiwic2V0UmVhZHlDYWxsYmFjayIsInJlYWR5IiwidXBkYXRlRXJyb3JTdGF0dXMiLCJTZXJ2aWNlIiwic2VydmljZU1hbmFnZXIiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQTs7Ozs7Ozs7QUFRQTs7Ozs7Ozs7Ozs7OztBQWFBOzs7Ozs7Ozs7OztBQVdBOzs7Ozs7Ozs7Ozs7O0FBYUE7Ozs7Ozs7O0FBU0EsSUFBTUEsYUFBYSxpQkFBbkI7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUE4Qk1DLE87OztBQUNKO0FBQ0EscUJBQWM7QUFBQTs7QUFBQSx3SUFDTkQsVUFETSxFQUNNLElBRE47O0FBR1osUUFBTUUsV0FBVztBQUNmQyxrQkFBWSxLQURHO0FBRWZDLGFBQU8sV0FGUTtBQUdmQyxvQkFBYztBQUhDLEtBQWpCOztBQU1BLFVBQUtDLFNBQUwsQ0FBZUosUUFBZjs7QUFFQSxVQUFLSyxPQUFMLENBQWEsVUFBYjs7QUFFQTs7OztBQUlBLFVBQUtDLEtBQUwsR0FBYSxDQUFDLENBQWQ7O0FBRUE7Ozs7QUFJQSxVQUFLQyxLQUFMLEdBQWEsSUFBYjs7QUFFQTs7OztBQUlBLFVBQUtDLFdBQUwsR0FBbUIsSUFBbkI7O0FBRUE7QUFDQSxVQUFLQyxtQkFBTCxHQUEyQixNQUFLQSxtQkFBTCxDQUF5QkMsSUFBekIsT0FBM0I7QUFDQSxVQUFLQyxzQkFBTCxHQUE4QixNQUFLQSxzQkFBTCxDQUE0QkQsSUFBNUIsT0FBOUI7QUFqQ1k7QUFrQ2I7O0FBRUQ7Ozs7OzRCQUNRO0FBQ047O0FBRUEsV0FBS0UsS0FBTCxHQUFhLEtBQUtDLG9CQUFsQjs7QUFFQTtBQUNBLFdBQUtDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLEtBQUtDLE9BQUwsQ0FBYWIsS0FBbEM7O0FBRUE7QUFDQSxXQUFLYyxPQUFMLENBQWEsVUFBYixFQUF5QixLQUFLUCxtQkFBOUI7QUFDQSxXQUFLTyxPQUFMLENBQWEsYUFBYixFQUE0QixLQUFLTCxzQkFBakM7O0FBRUEsV0FBS00sSUFBTDtBQUNEOztBQUVEOzs7OzJCQUNPO0FBQ0w7QUFDQTtBQUNBLFdBQUtDLGNBQUwsQ0FBb0IsVUFBcEIsRUFBZ0MsS0FBS1QsbUJBQXJDO0FBQ0EsV0FBS1MsY0FBTCxDQUFvQixhQUFwQixFQUFtQyxLQUFLUCxzQkFBeEM7O0FBRUEsV0FBS1EsSUFBTDtBQUNEOztBQUVEOzs7O3dDQUNvQmIsSyxFQUFPQyxLLEVBQU9DLFcsRUFBYTtBQUM3Q1ksdUJBQU9kLEtBQVAsR0FBZSxLQUFLQSxLQUFMLEdBQWFBLEtBQTVCO0FBQ0FjLHVCQUFPYixLQUFQLEdBQWUsS0FBS0EsS0FBTCxHQUFhQSxLQUE1QjtBQUNBLFdBQUtDLFdBQUwsR0FBbUJBLFdBQW5COztBQUVBLFVBQUlBLGdCQUFnQixJQUFoQixJQUF3QixDQUFDWSxpQkFBT1osV0FBcEMsRUFDRVksaUJBQU9aLFdBQVAsR0FBcUJBLFdBQXJCOztBQUVGLFVBQUksS0FBS08sT0FBTCxDQUFhZCxVQUFqQixFQUE2QjtBQUMzQixZQUFNb0IsZUFBZWQsU0FBUyxDQUFDRCxRQUFRLENBQVQsRUFBWWdCLFFBQVosRUFBOUI7QUFDQSxhQUFLQyxJQUFMLENBQVVDLFdBQVYsQ0FBc0JILFlBQXRCO0FBQ0EsYUFBS0UsSUFBTCxDQUFVRSxnQkFBVixDQUEyQixLQUFLQyxLQUFMLENBQVdoQixJQUFYLENBQWdCLElBQWhCLENBQTNCO0FBQ0QsT0FKRCxNQUlPO0FBQ0wsYUFBS2dCLEtBQUw7QUFDRDtBQUNGOztBQUVEOzs7OzZDQUN5QjtBQUN2QixXQUFLSCxJQUFMLENBQVVJLGlCQUFWLENBQTRCLElBQTVCO0FBQ0Q7OztFQXJGbUJDLGlCOztBQXdGdEJDLHlCQUFlQyxRQUFmLENBQXdCaEMsVUFBeEIsRUFBb0NDLE9BQXBDOztrQkFFZUEsTyIsImZpbGUiOiJDaGVja2luLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsaWVudCBmcm9tICcuLi9jb3JlL2NsaWVudCc7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuXG4vKipcbiAqIEFQSSBvZiBhIGNvbXBsaWFudCB2aWV3IGZvciB0aGUgYGNoZWNraW5gIHNlcnZpY2UuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQGludGVyZmFjZSBBYnN0cmFjdENoZWNraW5WaWV3XG4gKiBAZXh0ZW5kcyBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWJzdHJhY3RWaWV3XG4gKiBAYWJzdHJhY3RcbiAqL1xuLyoqXG4gKiBSZWdpc3RlciB0aGUgZnVuY3Rpb24gdGhhdCBzaG91bGQgYmUgZXhlY3V0ZWQgd2hlbiB0aGUgdXNlciBpcyByZWFkeSB0b1xuICogY29udGludWUuXG4gKlxuICogQG5hbWUgc2V0UmVhZHlDYWxsYmFja1xuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BYnN0cmFjdENoZWNraW5WaWV3XG4gKiBAZnVuY3Rpb25cbiAqIEBhYnN0cmFjdFxuICogQGluc3RhbmNlXG4gKlxuICogQHBhcmFtIHtyZWFkeUNhbGxiYWNrfSBjYWxsYmFjayAtIENhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiB0aGUgdXNlclxuICogIGlzIHJlYWR5IHRvIGNvbnRpbnVlLlxuICovXG4vKipcbiAqIFVwZGF0ZSB0aGUgbGFiZWwgcmV0cmlldmVkIGJ5IHRoZSBzZXJ2ZXIuXG4gKlxuICogQG5hbWUgdXBkYXRlTGFiZWxcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWJzdHJhY3RDaGVja2luVmlld1xuICogQGZ1bmN0aW9uXG4gKiBAYWJzdHJhY3RcbiAqIEBpbnN0YW5jZVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCAtIExhYmVsIHRvIGJlIGRpc3BsYXllZCBpbiB0aGUgdmlldy5cbiAqL1xuLyoqXG4gKiBNZXRob2QgZXhlY3V0ZWQgd2hlbiBhbiBlcnJvciBpcyByZWNlaXZlZCBmcm9tIHRoZSBzZXJ2ZXIgKHdoZW4gbm8gcGxhY2UgaXNcbiAqIGlzIGF2YWlsYWJsZSBpbiB0aGUgZXhwZXJpZW5jZSkuXG4gKlxuICogQG5hbWUgdXBkYXRlRXJyb3JTdGF0dXNcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWJzdHJhY3RDaGVja2luVmlld1xuICogQGZ1bmN0aW9uXG4gKiBAYWJzdHJhY3RcbiAqIEBpbnN0YW5jZVxuICpcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gdmFsdWVcbiAqL1xuXG4vKipcbiAqIENhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiB0aGUgdXNlciBpcyByZWFkeSB0byBjb250aW51ZS5cbiAqXG4gKiBAY2FsbGJhY2tcbiAqIEBuYW1lIHJlYWR5Q2FsbGJhY2tcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWJzdHJhY3RDaGVja2luVmlld1xuICovXG5cblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOmNoZWNraW4nO1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIGNsaWVudCBgJ2NoZWNraW4nYCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmljZSBpcyBvbmUgb2YgdGhlIHByb3ZpZGVkIHNlcnZpY2VzIGFpbWVkIGF0IGlkZW50aWZ5aW5nIGNsaWVudHMgaW5zaWRlXG4gKiB0aGUgZXhwZXJpZW5jZSBhbG9uZyB3aXRoIHRoZSBbYCdsb2NhdG9yJ2Bde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5Mb2NhdG9yfVxuICogYW5kIFtgJ3BsYWNlcidgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhY2VyfSBzZXJ2aWNlcy5cbiAqXG4gKiBUaGUgYCdjaGVja2luJ2Agc2VydmljZSBpcyB0aGUgbW9zdCBzaW1wbGUgYW1vbmcgdGhlc2Ugc2VydmljZXMgYXMgdGhlIHNlcnZlclxuICogc2ltcGx5IGFzc2lnbnMgYSB0aWNrZXQgdG8gdGhlIGNsaWVudCBhbW9uZyB0aGUgYXZhaWxhYmxlIG9uZXMuIFRoZSB0aWNrZXQgY2FuXG4gKiBvcHRpb25hbGx5IGJlIGFzc29jaWF0ZWQgd2l0aCBjb29yZGluYXRlcyBvciBsYWJlbHMgYWNjb3JkaW5nIHRvIHRoZSBzZXJ2ZXJcbiAqIGBzZXR1cGAgY29uZmlndXJhdGlvbi5cbiAqXG4gKiBUaGUgc2VydmljZSByZXF1aXJlcyB0aGUgWydwbGF0Zm9ybSdde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGF0Zm9ybX1cbiAqIHNlcnZpY2UsIGFzIGl0IGlzIGNvbnNpZGVyZWQgdGhhdCBhbiBpbmRleCBzaG91bGQgYmUgZ2l2ZW4gb25seSB0byBjbGllbnRzIHdob1xuICogYWN0aXZlbHkgZW50ZXJlZCB0aGUgYXBwbGljYXRpb24uXG4gKlxuICogX18qVGhlIHNlcnZpY2UgbXVzdCBiZSB1c2VkIHdpdGggaXRzIFtzZXJ2ZXItc2lkZSBjb3VudGVycGFydF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLkNoZWNraW59Kl9fXG4gKlxuICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkxvY2F0b3J9XG4gKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhY2VyfVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnNob3dEaWFsb2c9ZmFsc2VdIC0gRGVmaW5lIGlmIHRoZSBzZXJ2aWNlIHNob3VsZFxuICogIGRpc3BsYXkgYSB2aWV3IGluZm9ybWluZyB0aGUgY2xpZW50IG9mIGl0cyBwb3NpdGlvbi5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAZXhhbXBsZVxuICogLy8gaW5zaWRlIHRoZSBleHBlcmllbmNlIGNvbnN0cnVjdG9yXG4gKiB0aGlzLmNoZWNraW4gPSB0aGlzLnJlcXVpcmUoJ2NoZWNraW4nLCB7IHNob3dEaWFsb2c6IHRydWUgfSk7XG4gKi9cbmNsYXNzIENoZWNraW4gZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFuY2lhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCB0cnVlKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgc2hvd0RpYWxvZzogZmFsc2UsXG4gICAgICBvcmRlcjogJ2FzY2VuZGluZycsXG4gICAgICB2aWV3UHJpb3JpdHk6IDYsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIHRoaXMucmVxdWlyZSgncGxhdGZvcm0nKTtcblxuICAgIC8qKlxuICAgICAqIEluZGV4IGdpdmVuIGJ5IHRoZSBzZXJ2ZXIuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmluZGV4ID0gLTE7XG5cbiAgICAvKipcbiAgICAgKiBPcHRpb25uYWwgbGFiZWwgZ2l2ZW4gYnkgdGhlIHNlcnZlci5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMubGFiZWwgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogT3B0aW9ubmFsIGNvb3JkaW5hdGVzIGdpdmVuIGJ5IHRoZSBzZXJ2ZXIuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLmNvb3JkaW5hdGVzID0gbnVsbDtcblxuICAgIC8vIGJpbmQgY2FsbGJhY2tzIHRvIHRoZSBjdXJyZW50IGluc3RhbmNlXG4gICAgdGhpcy5fb25Qb3NpdGlvblJlc3BvbnNlID0gdGhpcy5fb25Qb3NpdGlvblJlc3BvbnNlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25VbmF2YWlsYWJsZVJlc3BvbnNlID0gdGhpcy5fb25VbmF2YWlsYWJsZVJlc3BvbnNlLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIHRoaXMuc2V0dXAgPSB0aGlzLl9zaGFyZWRDb25maWdTZXJ2aWNlO1xuXG4gICAgLy8gc2VuZCByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXJcbiAgICB0aGlzLnNlbmQoJ3JlcXVlc3QnLCB0aGlzLm9wdGlvbnMub3JkZXIpO1xuXG4gICAgLy8gc2V0dXAgbGlzdGVuZXJzIGZvciB0aGUgc2VydmVyJ3MgcmVzcG9uc2VcbiAgICB0aGlzLnJlY2VpdmUoJ3Bvc2l0aW9uJywgdGhpcy5fb25Qb3NpdGlvblJlc3BvbnNlKTtcbiAgICB0aGlzLnJlY2VpdmUoJ3VuYXZhaWxhYmxlJywgdGhpcy5fb25VbmF2YWlsYWJsZVJlc3BvbnNlKTtcblxuICAgIHRoaXMuc2hvdygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0b3AoKSB7XG4gICAgc3VwZXIuc3RvcCgpO1xuICAgIC8vIFJlbW92ZSBsaXN0ZW5lcnMgZm9yIHRoZSBzZXJ2ZXIncyByZXNwb25zZVxuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ3Bvc2l0aW9uJywgdGhpcy5fb25Qb3NpdGlvblJlc3BvbnNlKTtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCd1bmF2YWlsYWJsZScsIHRoaXMuX29uVW5hdmFpbGFibGVSZXNwb25zZSk7XG5cbiAgICB0aGlzLmhpZGUoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25Qb3NpdGlvblJlc3BvbnNlKGluZGV4LCBsYWJlbCwgY29vcmRpbmF0ZXMpIHtcbiAgICBjbGllbnQuaW5kZXggPSB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgY2xpZW50LmxhYmVsID0gdGhpcy5sYWJlbCA9IGxhYmVsO1xuICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcztcblxuICAgIGlmIChjb29yZGluYXRlcyAhPT0gbnVsbCAmJiAhY2xpZW50LmNvb3JkaW5hdGVzKVxuICAgICAgY2xpZW50LmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnNob3dEaWFsb2cpIHtcbiAgICAgIGNvbnN0IGRpc3BsYXlMYWJlbCA9IGxhYmVsIHx8IChpbmRleCArIDEpLnRvU3RyaW5nKCk7XG4gICAgICB0aGlzLnZpZXcudXBkYXRlTGFiZWwoZGlzcGxheUxhYmVsKTtcbiAgICAgIHRoaXMudmlldy5zZXRSZWFkeUNhbGxiYWNrKHRoaXMucmVhZHkuYmluZCh0aGlzKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVhZHkoKTtcbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uVW5hdmFpbGFibGVSZXNwb25zZSgpIHtcbiAgICB0aGlzLnZpZXcudXBkYXRlRXJyb3JTdGF0dXModHJ1ZSk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgQ2hlY2tpbik7XG5cbmV4cG9ydCBkZWZhdWx0IENoZWNraW47XG4iXX0=