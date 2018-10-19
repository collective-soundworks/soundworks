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

var _SelectView = require('../prefabs/SelectView');

var _SelectView2 = _interopRequireDefault(_SelectView);

var _SpaceView = require('../prefabs/SpaceView');

var _SpaceView2 = _interopRequireDefault(_SpaceView);

var _SquaredView = require('../prefabs/SquaredView');

var _SquaredView2 = _interopRequireDefault(_SquaredView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * API of a compliant view for the `placer` service.
 *
 * @memberof module:soundworks/client
 * @interface AbstractPlacerView
 * @extends module:soundworks/client.AbstractView
 * @abstract
 */
/**
 * Set and display the `area` definition (as defined in server configuration).
 *
 * @name setReadyCallback
 * @memberof module:soundworks/client.AbstractPlacerView
 * @function
 * @abstract
 * @instance
 *
 * @param {Object} area - Definition of the area.
 * @param {Number} area.width - With of the area.
 * @param {Number} area.height - Height of the area.
 * @param {Number} [area.labels=[]] - Labels of the position.
 * @param {Number} [area.coordinates=[]] - Coordinates of the area.
 */
/**
 * Register the callback to be executed when the user select a position.
 *
 * @name setSelectCallback
 * @memberof module:soundworks/client.AbstractPlacerView
 * @function
 * @abstract
 * @instance
 *
 * @param {String} callback - Callback to execute when the user select a position.
 *  This callback should be called with the `index`, `label` and `coordinates` of
 *  the requested position.
 */
/**
 * Display the available positions.
 *
 * @name displayPosition
 * @memberof module:soundworks/client.AbstractPlacerView
 * @function
 * @abstract
 * @instance
 *
 * @param {Number} capacity - The maximum number of clients allowed.
 * @param {Array<String>} [labels=null] - An array of the labels for the positions
 * @param {Array<Array<Number>>} [coordinates=null] - An array of the coordinates of the positions
 * @param {Number} [maxClientsPerPosition=1] - Number of clients allowed for each position.
 */
/**
 * Update the view accroding to the disabled positions.
 *
 * @name updateDisabledPositions
 * @memberof module:soundworks/client.AbstractPlacerView
 * @function
 * @abstract
 * @instance
 *
 * @param {Array<Number>} disabledPositions - Array containing the indexes of
 *  the disabled positions.
 */
/**
 * Update the view when the position selected by the user is no longer available.
 *
 * @name reject
 * @memberof module:soundworks/client.AbstractPlacerView
 * @function
 * @abstract
 * @instance
 *
 * @param {Array<Number>} disabledPositions - Array containing the indexes of
 *  the disabled positions.
 */

/**
 * Callback to execute when the user select a position.
 *
 * @callback
 * @name selectCallback
 * @memberof module:soundworks/client.AbstractPlacerView
 * @param {Number} index - Index of the selected location.
 * @param {String} label - Label of the selected location if any.
 * @param {Array<Number>} coordinates - Coordinates (`[x, y]`) of the selected
 *  location if any.
 */

var SERVICE_ID = 'service:placer';

/**
 * Interface for the `'placer'` service.
 *
 * This service is one of the provided services aimed at identifying clients inside
 * the experience along with the [`'locator'`]{@link module:soundworks/client.Locator}
 * and [`'checkin'`]{@link module:soundworks/client.Checkin} services.
 *
 * The `'placer'` service allows a client to choose its location among a set of
 * positions defined in the server's `setup` configuration entry.
 *
 * __*The service must be used with its [server-side counterpart]{@link module:soundworks/server.Placer}*__
 *
 * @see {@link module:soundworks/client.Locator}
 * @see {@link module:soundworks/client.Checkin}
 *
 * @param {Object} options
 * @param {String} [options.mode='list'] - Sets the interaction mode for the
 *  client to choose its position, the `'list'` mode proposes a drop-down menu
 *  while the `'graphic'` mode (which requires located positions) proposes an
 *  interface representing the area and dots for each available location.
 *
 * @memberof module:soundworks/client
 * @example
 * // inside the experience constructor
 * this.placer = this.require('placer', { mode: 'graphic' });
 */

var Placer = function (_Service) {
  (0, _inherits3.default)(Placer, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  function Placer() {
    (0, _classCallCheck3.default)(this, Placer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Placer.__proto__ || (0, _getPrototypeOf2.default)(Placer)).call(this, SERVICE_ID, true));

    var defaults = {
      mode: 'list',
      viewPriority: 6
    };

    _this.configure(defaults);

    /**
     * Index of the position selected by the user.
     * @type {Number}
     */
    _this.index = null;

    /**
     * Label of the position selected by the user.
     * @type {String}
     */
    _this.label = null;

    _this._onAknowledgeResponse = _this._onAknowledgeResponse.bind(_this);
    _this._onClientJoined = _this._onClientJoined.bind(_this);
    _this._onClientLeaved = _this._onClientLeaved.bind(_this);
    _this._onSelect = _this._onSelect.bind(_this);
    _this._onConfirmResponse = _this._onConfirmResponse.bind(_this);
    _this._onRejectResponse = _this._onRejectResponse.bind(_this);

    _this._sharedConfigService = _this.require('shared-config');
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(Placer, [{
    key: 'start',
    value: function start() {
      (0, _get3.default)(Placer.prototype.__proto__ || (0, _getPrototypeOf2.default)(Placer.prototype), 'start', this).call(this);
      this.show();

      this.send('request');

      this.receive('aknowlegde', this._onAknowledgeResponse);
      this.receive('confirm', this._onConfirmResponse);
      this.receive('reject', this._onRejectResponse);
      this.receive('client-joined', this._onClientJoined);
      this.receive('client-leaved', this._onClientLeaved);
    }

    /** @private */

  }, {
    key: 'stop',
    value: function stop() {
      this.removeListener('aknowlegde', this._onAknowledgeResponse);
      this.removeListener('confirm', this._onConfirmResponse);
      this.removeListener('reject', this._onRejectResponse);
      this.removeListener('client-joined', this._onClientJoined);
      this.removeListener('client-leaved', this._onClientLeaved);

      this.hide();
    }

    /** @private */

  }, {
    key: '_onAknowledgeResponse',
    value: function _onAknowledgeResponse(setupConfigItem, disabledPositions) {
      var setup = this._sharedConfigService.get(setupConfigItem);
      var area = setup.area;
      var capacity = setup.capacity;
      var labels = setup.labels;
      var coordinates = setup.coordinates;
      var maxClientsPerPosition = setup.maxClientsPerPosition;

      this.nbrPositions = capacity / maxClientsPerPosition;

      if (area) this.view.setArea(area);

      this.view.displayPositions(capacity, labels, coordinates, maxClientsPerPosition);
      this.view.updateDisabledPositions(disabledPositions);
      this.view.setSelectCallack(this._onSelect);
    }

    /** @private */

  }, {
    key: '_onSelect',
    value: function _onSelect(index, label, coordinates) {
      this.send('position', index, label, coordinates);
    }

    /** @private */

  }, {
    key: '_onConfirmResponse',
    value: function _onConfirmResponse(index, label, coordinates) {
      _client2.default.index = this.index = index;
      _client2.default.label = this.label = label;
      _client2.default.coordinates = coordinates;

      this.ready();
    }

    /** @private */

  }, {
    key: '_onClientJoined',
    value: function _onClientJoined(disabledPositions) {
      if (disabledPositions.length >= this.nbrPositions) this.view.reject(disabledPositions);else this.view.updateDisabledPositions(disabledPositions);
    }

    /** @private */

  }, {
    key: '_onClientLeaved',
    value: function _onClientLeaved(disabledPositions) {
      this.view.updateDisabledPositions(disabledPositions);
    }

    /** @private */

  }, {
    key: '_onRejectResponse',
    value: function _onRejectResponse(disabledPositions) {
      if (disabledPositions.length >= this.nbrPositions) this.view.reject(disabledPositions);else this.view.updateDisabledPositions(disabledPositions);
    }
  }]);
  return Placer;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, Placer);

exports.default = Placer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYWNlci5qcyJdLCJuYW1lcyI6WyJTRVJWSUNFX0lEIiwiUGxhY2VyIiwiZGVmYXVsdHMiLCJtb2RlIiwidmlld1ByaW9yaXR5IiwiY29uZmlndXJlIiwiaW5kZXgiLCJsYWJlbCIsIl9vbkFrbm93bGVkZ2VSZXNwb25zZSIsImJpbmQiLCJfb25DbGllbnRKb2luZWQiLCJfb25DbGllbnRMZWF2ZWQiLCJfb25TZWxlY3QiLCJfb25Db25maXJtUmVzcG9uc2UiLCJfb25SZWplY3RSZXNwb25zZSIsIl9zaGFyZWRDb25maWdTZXJ2aWNlIiwicmVxdWlyZSIsInNob3ciLCJzZW5kIiwicmVjZWl2ZSIsInJlbW92ZUxpc3RlbmVyIiwiaGlkZSIsInNldHVwQ29uZmlnSXRlbSIsImRpc2FibGVkUG9zaXRpb25zIiwic2V0dXAiLCJnZXQiLCJhcmVhIiwiY2FwYWNpdHkiLCJsYWJlbHMiLCJjb29yZGluYXRlcyIsIm1heENsaWVudHNQZXJQb3NpdGlvbiIsIm5iclBvc2l0aW9ucyIsInZpZXciLCJzZXRBcmVhIiwiZGlzcGxheVBvc2l0aW9ucyIsInVwZGF0ZURpc2FibGVkUG9zaXRpb25zIiwic2V0U2VsZWN0Q2FsbGFjayIsImNsaWVudCIsInJlYWR5IiwibGVuZ3RoIiwicmVqZWN0IiwiU2VydmljZSIsInNlcnZpY2VNYW5hZ2VyIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUE7Ozs7Ozs7O0FBUUE7Ozs7Ozs7Ozs7Ozs7OztBQWVBOzs7Ozs7Ozs7Ozs7O0FBYUE7Ozs7Ozs7Ozs7Ozs7O0FBY0E7Ozs7Ozs7Ozs7OztBQVlBOzs7Ozs7Ozs7Ozs7O0FBYUE7Ozs7Ozs7Ozs7OztBQWFBLElBQU1BLGFBQWEsZ0JBQW5COztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUEwQk1DLE07OztBQUNKO0FBQ0Es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QWE7QUFDNUNRLHVCQUFPL0IsS0FBUCxHQUFlLEtBQUtBLEtBQUwsR0FBYUEsS0FBNUI7QUFDQStCLHVCQUFPOUIsS0FBUCxHQUFlLEtBQUtBLEtBQUwsR0FBYUEsS0FBNUI7QUFDQThCLHVCQUFPUixXQUFQLEdBQXFCQSxXQUFyQjs7QUFFQSxXQUFLUyxLQUFMO0FBQ0Q7O0FBRUQ7Ozs7b0NBQ2dCZixpQixFQUFtQjtBQUNqQyxVQUFJQSxrQkFBa0JnQixNQUFsQixJQUE0QixLQUFLUixZQUFyQyxFQUNFLEtBQUtDLElBQUwsQ0FBVVEsTUFBVixDQUFpQmpCLGlCQUFqQixFQURGLEtBR0UsS0FBS1MsSUFBTCxDQUFVRyx1QkFBVixDQUFrQ1osaUJBQWxDO0FBQ0g7O0FBRUQ7Ozs7b0NBQ2dCQSxpQixFQUFtQjtBQUNqQyxXQUFLUyxJQUFMLENBQVVHLHVCQUFWLENBQWtDWixpQkFBbEM7QUFDRDs7QUFFRDs7OztzQ0FDa0JBLGlCLEVBQW1CO0FBQ25DLFVBQUlBLGtCQUFrQmdCLE1BQWxCLElBQTRCLEtBQUtSLFlBQXJDLEVBQ0UsS0FBS0MsSUFBTCxDQUFVUSxNQUFWLENBQWlCakIsaUJBQWpCLEVBREYsS0FHRSxLQUFLUyxJQUFMLENBQVVHLHVCQUFWLENBQWtDWixpQkFBbEM7QUFDSDs7O0VBL0drQmtCLGlCOztBQWtIckJDLHlCQUFlQyxRQUFmLENBQXdCM0MsVUFBeEIsRUFBb0NDLE1BQXBDOztrQkFFZUEsTSIsImZpbGUiOiJQbGFjZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xpZW50IGZyb20gJy4uL2NvcmUvY2xpZW50JztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgU2VsZWN0VmlldyBmcm9tICcuLi9wcmVmYWJzL1NlbGVjdFZpZXcnO1xuaW1wb3J0IFNwYWNlVmlldyBmcm9tICcuLi9wcmVmYWJzL1NwYWNlVmlldyc7XG5pbXBvcnQgU3F1YXJlZFZpZXcgZnJvbSAnLi4vcHJlZmFicy9TcXVhcmVkVmlldyc7XG5cbi8qKlxuICogQVBJIG9mIGEgY29tcGxpYW50IHZpZXcgZm9yIHRoZSBgcGxhY2VyYCBzZXJ2aWNlLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBpbnRlcmZhY2UgQWJzdHJhY3RQbGFjZXJWaWV3XG4gKiBAZXh0ZW5kcyBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWJzdHJhY3RWaWV3XG4gKiBAYWJzdHJhY3RcbiAqL1xuLyoqXG4gKiBTZXQgYW5kIGRpc3BsYXkgdGhlIGBhcmVhYCBkZWZpbml0aW9uIChhcyBkZWZpbmVkIGluIHNlcnZlciBjb25maWd1cmF0aW9uKS5cbiAqXG4gKiBAbmFtZSBzZXRSZWFkeUNhbGxiYWNrXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0UGxhY2VyVmlld1xuICogQGZ1bmN0aW9uXG4gKiBAYWJzdHJhY3RcbiAqIEBpbnN0YW5jZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBhcmVhIC0gRGVmaW5pdGlvbiBvZiB0aGUgYXJlYS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBhcmVhLndpZHRoIC0gV2l0aCBvZiB0aGUgYXJlYS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBhcmVhLmhlaWdodCAtIEhlaWdodCBvZiB0aGUgYXJlYS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbYXJlYS5sYWJlbHM9W11dIC0gTGFiZWxzIG9mIHRoZSBwb3NpdGlvbi5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbYXJlYS5jb29yZGluYXRlcz1bXV0gLSBDb29yZGluYXRlcyBvZiB0aGUgYXJlYS5cbiAqL1xuLyoqXG4gKiBSZWdpc3RlciB0aGUgY2FsbGJhY2sgdG8gYmUgZXhlY3V0ZWQgd2hlbiB0aGUgdXNlciBzZWxlY3QgYSBwb3NpdGlvbi5cbiAqXG4gKiBAbmFtZSBzZXRTZWxlY3RDYWxsYmFja1xuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BYnN0cmFjdFBsYWNlclZpZXdcbiAqIEBmdW5jdGlvblxuICogQGFic3RyYWN0XG4gKiBAaW5zdGFuY2VcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gY2FsbGJhY2sgLSBDYWxsYmFjayB0byBleGVjdXRlIHdoZW4gdGhlIHVzZXIgc2VsZWN0IGEgcG9zaXRpb24uXG4gKiAgVGhpcyBjYWxsYmFjayBzaG91bGQgYmUgY2FsbGVkIHdpdGggdGhlIGBpbmRleGAsIGBsYWJlbGAgYW5kIGBjb29yZGluYXRlc2Agb2ZcbiAqICB0aGUgcmVxdWVzdGVkIHBvc2l0aW9uLlxuICovXG4vKipcbiAqIERpc3BsYXkgdGhlIGF2YWlsYWJsZSBwb3NpdGlvbnMuXG4gKlxuICogQG5hbWUgZGlzcGxheVBvc2l0aW9uXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0UGxhY2VyVmlld1xuICogQGZ1bmN0aW9uXG4gKiBAYWJzdHJhY3RcbiAqIEBpbnN0YW5jZVxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBjYXBhY2l0eSAtIFRoZSBtYXhpbXVtIG51bWJlciBvZiBjbGllbnRzIGFsbG93ZWQuXG4gKiBAcGFyYW0ge0FycmF5PFN0cmluZz59IFtsYWJlbHM9bnVsbF0gLSBBbiBhcnJheSBvZiB0aGUgbGFiZWxzIGZvciB0aGUgcG9zaXRpb25zXG4gKiBAcGFyYW0ge0FycmF5PEFycmF5PE51bWJlcj4+fSBbY29vcmRpbmF0ZXM9bnVsbF0gLSBBbiBhcnJheSBvZiB0aGUgY29vcmRpbmF0ZXMgb2YgdGhlIHBvc2l0aW9uc1xuICogQHBhcmFtIHtOdW1iZXJ9IFttYXhDbGllbnRzUGVyUG9zaXRpb249MV0gLSBOdW1iZXIgb2YgY2xpZW50cyBhbGxvd2VkIGZvciBlYWNoIHBvc2l0aW9uLlxuICovXG4vKipcbiAqIFVwZGF0ZSB0aGUgdmlldyBhY2Nyb2RpbmcgdG8gdGhlIGRpc2FibGVkIHBvc2l0aW9ucy5cbiAqXG4gKiBAbmFtZSB1cGRhdGVEaXNhYmxlZFBvc2l0aW9uc1xuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BYnN0cmFjdFBsYWNlclZpZXdcbiAqIEBmdW5jdGlvblxuICogQGFic3RyYWN0XG4gKiBAaW5zdGFuY2VcbiAqXG4gKiBAcGFyYW0ge0FycmF5PE51bWJlcj59IGRpc2FibGVkUG9zaXRpb25zIC0gQXJyYXkgY29udGFpbmluZyB0aGUgaW5kZXhlcyBvZlxuICogIHRoZSBkaXNhYmxlZCBwb3NpdGlvbnMuXG4gKi9cbi8qKlxuICogVXBkYXRlIHRoZSB2aWV3IHdoZW4gdGhlIHBvc2l0aW9uIHNlbGVjdGVkIGJ5IHRoZSB1c2VyIGlzIG5vIGxvbmdlciBhdmFpbGFibGUuXG4gKlxuICogQG5hbWUgcmVqZWN0XG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0UGxhY2VyVmlld1xuICogQGZ1bmN0aW9uXG4gKiBAYWJzdHJhY3RcbiAqIEBpbnN0YW5jZVxuICpcbiAqIEBwYXJhbSB7QXJyYXk8TnVtYmVyPn0gZGlzYWJsZWRQb3NpdGlvbnMgLSBBcnJheSBjb250YWluaW5nIHRoZSBpbmRleGVzIG9mXG4gKiAgdGhlIGRpc2FibGVkIHBvc2l0aW9ucy5cbiAqL1xuXG4vKipcbiAqIENhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiB0aGUgdXNlciBzZWxlY3QgYSBwb3NpdGlvbi5cbiAqXG4gKiBAY2FsbGJhY2tcbiAqIEBuYW1lIHNlbGVjdENhbGxiYWNrXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0UGxhY2VyVmlld1xuICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IC0gSW5kZXggb2YgdGhlIHNlbGVjdGVkIGxvY2F0aW9uLlxuICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsIC0gTGFiZWwgb2YgdGhlIHNlbGVjdGVkIGxvY2F0aW9uIGlmIGFueS5cbiAqIEBwYXJhbSB7QXJyYXk8TnVtYmVyPn0gY29vcmRpbmF0ZXMgLSBDb29yZGluYXRlcyAoYFt4LCB5XWApIG9mIHRoZSBzZWxlY3RlZFxuICogIGxvY2F0aW9uIGlmIGFueS5cbiAqL1xuXG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpwbGFjZXInO1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIGAncGxhY2VyJ2Agc2VydmljZS5cbiAqXG4gKiBUaGlzIHNlcnZpY2UgaXMgb25lIG9mIHRoZSBwcm92aWRlZCBzZXJ2aWNlcyBhaW1lZCBhdCBpZGVudGlmeWluZyBjbGllbnRzIGluc2lkZVxuICogdGhlIGV4cGVyaWVuY2UgYWxvbmcgd2l0aCB0aGUgW2AnbG9jYXRvcidgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuTG9jYXRvcn1cbiAqIGFuZCBbYCdjaGVja2luJ2Bde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DaGVja2lufSBzZXJ2aWNlcy5cbiAqXG4gKiBUaGUgYCdwbGFjZXInYCBzZXJ2aWNlIGFsbG93cyBhIGNsaWVudCB0byBjaG9vc2UgaXRzIGxvY2F0aW9uIGFtb25nIGEgc2V0IG9mXG4gKiBwb3NpdGlvbnMgZGVmaW5lZCBpbiB0aGUgc2VydmVyJ3MgYHNldHVwYCBjb25maWd1cmF0aW9uIGVudHJ5LlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIG11c3QgYmUgdXNlZCB3aXRoIGl0cyBbc2VydmVyLXNpZGUgY291bnRlcnBhcnRde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5QbGFjZXJ9Kl9fXG4gKlxuICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkxvY2F0b3J9XG4gKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2hlY2tpbn1cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm1vZGU9J2xpc3QnXSAtIFNldHMgdGhlIGludGVyYWN0aW9uIG1vZGUgZm9yIHRoZVxuICogIGNsaWVudCB0byBjaG9vc2UgaXRzIHBvc2l0aW9uLCB0aGUgYCdsaXN0J2AgbW9kZSBwcm9wb3NlcyBhIGRyb3AtZG93biBtZW51XG4gKiAgd2hpbGUgdGhlIGAnZ3JhcGhpYydgIG1vZGUgKHdoaWNoIHJlcXVpcmVzIGxvY2F0ZWQgcG9zaXRpb25zKSBwcm9wb3NlcyBhblxuICogIGludGVyZmFjZSByZXByZXNlbnRpbmcgdGhlIGFyZWEgYW5kIGRvdHMgZm9yIGVhY2ggYXZhaWxhYmxlIGxvY2F0aW9uLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBleGFtcGxlXG4gKiAvLyBpbnNpZGUgdGhlIGV4cGVyaWVuY2UgY29uc3RydWN0b3JcbiAqIHRoaXMucGxhY2VyID0gdGhpcy5yZXF1aXJlKCdwbGFjZXInLCB7IG1vZGU6ICdncmFwaGljJyB9KTtcbiAqL1xuY2xhc3MgUGxhY2VyIGV4dGVuZHMgU2VydmljZSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbmNpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgdHJ1ZSk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIG1vZGU6ICdsaXN0JyxcbiAgICAgIHZpZXdQcmlvcml0eTogNixcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgLyoqXG4gICAgICogSW5kZXggb2YgdGhlIHBvc2l0aW9uIHNlbGVjdGVkIGJ5IHRoZSB1c2VyLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5pbmRleCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBMYWJlbCBvZiB0aGUgcG9zaXRpb24gc2VsZWN0ZWQgYnkgdGhlIHVzZXIuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLmxhYmVsID0gbnVsbDtcblxuICAgIHRoaXMuX29uQWtub3dsZWRnZVJlc3BvbnNlID0gdGhpcy5fb25Ba25vd2xlZGdlUmVzcG9uc2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkNsaWVudEpvaW5lZCA9IHRoaXMuX29uQ2xpZW50Sm9pbmVkLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25DbGllbnRMZWF2ZWQgPSB0aGlzLl9vbkNsaWVudExlYXZlZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uU2VsZWN0ID0gdGhpcy5fb25TZWxlY3QuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkNvbmZpcm1SZXNwb25zZSA9IHRoaXMuX29uQ29uZmlybVJlc3BvbnNlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25SZWplY3RSZXNwb25zZSA9IHRoaXMuX29uUmVqZWN0UmVzcG9uc2UuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuX3NoYXJlZENvbmZpZ1NlcnZpY2UgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1jb25maWcnKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuICAgIHRoaXMuc2hvdygpO1xuXG4gICAgdGhpcy5zZW5kKCdyZXF1ZXN0Jyk7XG5cbiAgICB0aGlzLnJlY2VpdmUoJ2Frbm93bGVnZGUnLCB0aGlzLl9vbkFrbm93bGVkZ2VSZXNwb25zZSk7XG4gICAgdGhpcy5yZWNlaXZlKCdjb25maXJtJywgdGhpcy5fb25Db25maXJtUmVzcG9uc2UpO1xuICAgIHRoaXMucmVjZWl2ZSgncmVqZWN0JywgdGhpcy5fb25SZWplY3RSZXNwb25zZSk7XG4gICAgdGhpcy5yZWNlaXZlKCdjbGllbnQtam9pbmVkJywgdGhpcy5fb25DbGllbnRKb2luZWQpO1xuICAgIHRoaXMucmVjZWl2ZSgnY2xpZW50LWxlYXZlZCcsIHRoaXMuX29uQ2xpZW50TGVhdmVkKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdG9wKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ2Frbm93bGVnZGUnLCB0aGlzLl9vbkFrbm93bGVkZ2VSZXNwb25zZSk7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignY29uZmlybScsIHRoaXMuX29uQ29uZmlybVJlc3BvbnNlKTtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdyZWplY3QnLCB0aGlzLl9vblJlamVjdFJlc3BvbnNlKTtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdjbGllbnQtam9pbmVkJywgdGhpcy5fb25DbGllbnRKb2luZWQpO1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ2NsaWVudC1sZWF2ZWQnLCB0aGlzLl9vbkNsaWVudExlYXZlZCk7XG5cbiAgICB0aGlzLmhpZGUoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25Ba25vd2xlZGdlUmVzcG9uc2Uoc2V0dXBDb25maWdJdGVtLCBkaXNhYmxlZFBvc2l0aW9ucykge1xuICAgIGNvbnN0IHNldHVwID0gdGhpcy5fc2hhcmVkQ29uZmlnU2VydmljZS5nZXQoc2V0dXBDb25maWdJdGVtKTtcbiAgICBjb25zdCBhcmVhID0gc2V0dXAuYXJlYTtcbiAgICBjb25zdCBjYXBhY2l0eSA9IHNldHVwLmNhcGFjaXR5O1xuICAgIGNvbnN0IGxhYmVscyA9IHNldHVwLmxhYmVscztcbiAgICBjb25zdCBjb29yZGluYXRlcyA9IHNldHVwLmNvb3JkaW5hdGVzO1xuICAgIGNvbnN0IG1heENsaWVudHNQZXJQb3NpdGlvbiA9IHNldHVwLm1heENsaWVudHNQZXJQb3NpdGlvbjtcblxuICAgIHRoaXMubmJyUG9zaXRpb25zID0gY2FwYWNpdHkgLyBtYXhDbGllbnRzUGVyUG9zaXRpb247XG5cbiAgICBpZiAoYXJlYSlcbiAgICAgIHRoaXMudmlldy5zZXRBcmVhKGFyZWEpO1xuXG4gICAgdGhpcy52aWV3LmRpc3BsYXlQb3NpdGlvbnMoY2FwYWNpdHksIGxhYmVscywgY29vcmRpbmF0ZXMsIG1heENsaWVudHNQZXJQb3NpdGlvbik7XG4gICAgdGhpcy52aWV3LnVwZGF0ZURpc2FibGVkUG9zaXRpb25zKGRpc2FibGVkUG9zaXRpb25zKTtcbiAgICB0aGlzLnZpZXcuc2V0U2VsZWN0Q2FsbGFjayh0aGlzLl9vblNlbGVjdCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uU2VsZWN0KGluZGV4LCBsYWJlbCwgY29vcmRpbmF0ZXMpIHtcbiAgICB0aGlzLnNlbmQoJ3Bvc2l0aW9uJywgaW5kZXgsIGxhYmVsLCBjb29yZGluYXRlcyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uQ29uZmlybVJlc3BvbnNlKGluZGV4LCBsYWJlbCwgY29vcmRpbmF0ZXMpIHtcbiAgICBjbGllbnQuaW5kZXggPSB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgY2xpZW50LmxhYmVsID0gdGhpcy5sYWJlbCA9IGxhYmVsO1xuICAgIGNsaWVudC5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuXG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vbkNsaWVudEpvaW5lZChkaXNhYmxlZFBvc2l0aW9ucykge1xuICAgIGlmIChkaXNhYmxlZFBvc2l0aW9ucy5sZW5ndGggPj0gdGhpcy5uYnJQb3NpdGlvbnMpXG4gICAgICB0aGlzLnZpZXcucmVqZWN0KGRpc2FibGVkUG9zaXRpb25zKTtcbiAgICBlbHNlXG4gICAgICB0aGlzLnZpZXcudXBkYXRlRGlzYWJsZWRQb3NpdGlvbnMoZGlzYWJsZWRQb3NpdGlvbnMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vbkNsaWVudExlYXZlZChkaXNhYmxlZFBvc2l0aW9ucykge1xuICAgIHRoaXMudmlldy51cGRhdGVEaXNhYmxlZFBvc2l0aW9ucyhkaXNhYmxlZFBvc2l0aW9ucyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uUmVqZWN0UmVzcG9uc2UoZGlzYWJsZWRQb3NpdGlvbnMpIHtcbiAgICBpZiAoZGlzYWJsZWRQb3NpdGlvbnMubGVuZ3RoID49IHRoaXMubmJyUG9zaXRpb25zKVxuICAgICAgdGhpcy52aWV3LnJlamVjdChkaXNhYmxlZFBvc2l0aW9ucyk7XG4gICAgZWxzZVxuICAgICAgdGhpcy52aWV3LnVwZGF0ZURpc2FibGVkUG9zaXRpb25zKGRpc2FibGVkUG9zaXRpb25zKTtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBQbGFjZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBQbGFjZXI7XG4iXX0=