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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYWNlci5qcyJdLCJuYW1lcyI6WyJTRVJWSUNFX0lEIiwiUGxhY2VyIiwiZGVmYXVsdHMiLCJtb2RlIiwidmlld1ByaW9yaXR5IiwiY29uZmlndXJlIiwiaW5kZXgiLCJsYWJlbCIsIl9vbkFrbm93bGVkZ2VSZXNwb25zZSIsImJpbmQiLCJfb25DbGllbnRKb2luZWQiLCJfb25DbGllbnRMZWF2ZWQiLCJfb25TZWxlY3QiLCJfb25Db25maXJtUmVzcG9uc2UiLCJfb25SZWplY3RSZXNwb25zZSIsIl9zaGFyZWRDb25maWdTZXJ2aWNlIiwicmVxdWlyZSIsInNob3ciLCJzZW5kIiwicmVjZWl2ZSIsInJlbW92ZUxpc3RlbmVyIiwiaGlkZSIsInNldHVwQ29uZmlnSXRlbSIsImRpc2FibGVkUG9zaXRpb25zIiwic2V0dXAiLCJnZXQiLCJhcmVhIiwiY2FwYWNpdHkiLCJsYWJlbHMiLCJjb29yZGluYXRlcyIsIm1heENsaWVudHNQZXJQb3NpdGlvbiIsIm5iclBvc2l0aW9ucyIsInZpZXciLCJzZXRBcmVhIiwiZGlzcGxheVBvc2l0aW9ucyIsInVwZGF0ZURpc2FibGVkUG9zaXRpb25zIiwic2V0U2VsZWN0Q2FsbGFjayIsInJlYWR5IiwibGVuZ3RoIiwicmVqZWN0IiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUE7Ozs7Ozs7O0FBUUE7Ozs7Ozs7Ozs7Ozs7OztBQWVBOzs7Ozs7Ozs7Ozs7O0FBYUE7Ozs7Ozs7Ozs7Ozs7O0FBY0E7Ozs7Ozs7Ozs7OztBQVlBOzs7Ozs7Ozs7Ozs7O0FBYUE7Ozs7Ozs7Ozs7OztBQWFBLElBQU1BLGFBQWEsZ0JBQW5COztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUEwQk1DLE07OztBQUNKO0FBQ0Esb0JBQWM7QUFBQTs7QUFBQSxzSUFDTkQsVUFETSxFQUNNLElB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TCxHQUFhQSxLQUE1QjtBQUNBLHVCQUFPQyxLQUFQLEdBQWUsS0FBS0EsS0FBTCxHQUFhQSxLQUE1QjtBQUNBLHVCQUFPc0IsV0FBUCxHQUFxQkEsV0FBckI7O0FBRUEsV0FBS1EsS0FBTDtBQUNEOztBQUVEOzs7O29DQUNnQmQsaUIsRUFBbUI7QUFDakMsVUFBSUEsa0JBQWtCZSxNQUFsQixJQUE0QixLQUFLUCxZQUFyQyxFQUNFLEtBQUtDLElBQUwsQ0FBVU8sTUFBVixDQUFpQmhCLGlCQUFqQixFQURGLEtBR0UsS0FBS1MsSUFBTCxDQUFVRyx1QkFBVixDQUFrQ1osaUJBQWxDO0FBQ0g7O0FBRUQ7Ozs7b0NBQ2dCQSxpQixFQUFtQjtBQUNqQyxXQUFLUyxJQUFMLENBQVVHLHVCQUFWLENBQWtDWixpQkFBbEM7QUFDRDs7QUFFRDs7OztzQ0FDa0JBLGlCLEVBQW1CO0FBQ25DLFVBQUlBLGtCQUFrQmUsTUFBbEIsSUFBNEIsS0FBS1AsWUFBckMsRUFDRSxLQUFLQyxJQUFMLENBQVVPLE1BQVYsQ0FBaUJoQixpQkFBakIsRUFERixLQUdFLEtBQUtTLElBQUwsQ0FBVUcsdUJBQVYsQ0FBa0NaLGlCQUFsQztBQUNIOzs7OztBQUdILHlCQUFlaUIsUUFBZixDQUF3QnhDLFVBQXhCLEVBQW9DQyxNQUFwQzs7a0JBRWVBLE0iLCJmaWxlIjoiUGxhY2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsaWVudCBmcm9tICcuLi9jb3JlL2NsaWVudCc7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IFNlbGVjdFZpZXcgZnJvbSAnLi4vcHJlZmFicy9TZWxlY3RWaWV3JztcbmltcG9ydCBTcGFjZVZpZXcgZnJvbSAnLi4vcHJlZmFicy9TcGFjZVZpZXcnO1xuaW1wb3J0IFNxdWFyZWRWaWV3IGZyb20gJy4uL3ByZWZhYnMvU3F1YXJlZFZpZXcnO1xuXG4vKipcbiAqIEFQSSBvZiBhIGNvbXBsaWFudCB2aWV3IGZvciB0aGUgYHBsYWNlcmAgc2VydmljZS5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAaW50ZXJmYWNlIEFic3RyYWN0UGxhY2VyVmlld1xuICogQGV4dGVuZHMgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0Vmlld1xuICogQGFic3RyYWN0XG4gKi9cbi8qKlxuICogU2V0IGFuZCBkaXNwbGF5IHRoZSBgYXJlYWAgZGVmaW5pdGlvbiAoYXMgZGVmaW5lZCBpbiBzZXJ2ZXIgY29uZmlndXJhdGlvbikuXG4gKlxuICogQG5hbWUgc2V0UmVhZHlDYWxsYmFja1xuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BYnN0cmFjdFBsYWNlclZpZXdcbiAqIEBmdW5jdGlvblxuICogQGFic3RyYWN0XG4gKiBAaW5zdGFuY2VcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYXJlYSAtIERlZmluaXRpb24gb2YgdGhlIGFyZWEuXG4gKiBAcGFyYW0ge051bWJlcn0gYXJlYS53aWR0aCAtIFdpdGggb2YgdGhlIGFyZWEuXG4gKiBAcGFyYW0ge051bWJlcn0gYXJlYS5oZWlnaHQgLSBIZWlnaHQgb2YgdGhlIGFyZWEuXG4gKiBAcGFyYW0ge051bWJlcn0gW2FyZWEubGFiZWxzPVtdXSAtIExhYmVscyBvZiB0aGUgcG9zaXRpb24uXG4gKiBAcGFyYW0ge051bWJlcn0gW2FyZWEuY29vcmRpbmF0ZXM9W11dIC0gQ29vcmRpbmF0ZXMgb2YgdGhlIGFyZWEuXG4gKi9cbi8qKlxuICogUmVnaXN0ZXIgdGhlIGNhbGxiYWNrIHRvIGJlIGV4ZWN1dGVkIHdoZW4gdGhlIHVzZXIgc2VsZWN0IGEgcG9zaXRpb24uXG4gKlxuICogQG5hbWUgc2V0U2VsZWN0Q2FsbGJhY2tcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWJzdHJhY3RQbGFjZXJWaWV3XG4gKiBAZnVuY3Rpb25cbiAqIEBhYnN0cmFjdFxuICogQGluc3RhbmNlXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGNhbGxiYWNrIC0gQ2FsbGJhY2sgdG8gZXhlY3V0ZSB3aGVuIHRoZSB1c2VyIHNlbGVjdCBhIHBvc2l0aW9uLlxuICogIFRoaXMgY2FsbGJhY2sgc2hvdWxkIGJlIGNhbGxlZCB3aXRoIHRoZSBgaW5kZXhgLCBgbGFiZWxgIGFuZCBgY29vcmRpbmF0ZXNgIG9mXG4gKiAgdGhlIHJlcXVlc3RlZCBwb3NpdGlvbi5cbiAqL1xuLyoqXG4gKiBEaXNwbGF5IHRoZSBhdmFpbGFibGUgcG9zaXRpb25zLlxuICpcbiAqIEBuYW1lIGRpc3BsYXlQb3NpdGlvblxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BYnN0cmFjdFBsYWNlclZpZXdcbiAqIEBmdW5jdGlvblxuICogQGFic3RyYWN0XG4gKiBAaW5zdGFuY2VcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gY2FwYWNpdHkgLSBUaGUgbWF4aW11bSBudW1iZXIgb2YgY2xpZW50cyBhbGxvd2VkLlxuICogQHBhcmFtIHtBcnJheTxTdHJpbmc+fSBbbGFiZWxzPW51bGxdIC0gQW4gYXJyYXkgb2YgdGhlIGxhYmVscyBmb3IgdGhlIHBvc2l0aW9uc1xuICogQHBhcmFtIHtBcnJheTxBcnJheTxOdW1iZXI+Pn0gW2Nvb3JkaW5hdGVzPW51bGxdIC0gQW4gYXJyYXkgb2YgdGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBwb3NpdGlvbnNcbiAqIEBwYXJhbSB7TnVtYmVyfSBbbWF4Q2xpZW50c1BlclBvc2l0aW9uPTFdIC0gTnVtYmVyIG9mIGNsaWVudHMgYWxsb3dlZCBmb3IgZWFjaCBwb3NpdGlvbi5cbiAqL1xuLyoqXG4gKiBVcGRhdGUgdGhlIHZpZXcgYWNjcm9kaW5nIHRvIHRoZSBkaXNhYmxlZCBwb3NpdGlvbnMuXG4gKlxuICogQG5hbWUgdXBkYXRlRGlzYWJsZWRQb3NpdGlvbnNcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWJzdHJhY3RQbGFjZXJWaWV3XG4gKiBAZnVuY3Rpb25cbiAqIEBhYnN0cmFjdFxuICogQGluc3RhbmNlXG4gKlxuICogQHBhcmFtIHtBcnJheTxOdW1iZXI+fSBkaXNhYmxlZFBvc2l0aW9ucyAtIEFycmF5IGNvbnRhaW5pbmcgdGhlIGluZGV4ZXMgb2ZcbiAqICB0aGUgZGlzYWJsZWQgcG9zaXRpb25zLlxuICovXG4vKipcbiAqIFVwZGF0ZSB0aGUgdmlldyB3aGVuIHRoZSBwb3NpdGlvbiBzZWxlY3RlZCBieSB0aGUgdXNlciBpcyBubyBsb25nZXIgYXZhaWxhYmxlLlxuICpcbiAqIEBuYW1lIHJlamVjdFxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BYnN0cmFjdFBsYWNlclZpZXdcbiAqIEBmdW5jdGlvblxuICogQGFic3RyYWN0XG4gKiBAaW5zdGFuY2VcbiAqXG4gKiBAcGFyYW0ge0FycmF5PE51bWJlcj59IGRpc2FibGVkUG9zaXRpb25zIC0gQXJyYXkgY29udGFpbmluZyB0aGUgaW5kZXhlcyBvZlxuICogIHRoZSBkaXNhYmxlZCBwb3NpdGlvbnMuXG4gKi9cblxuLyoqXG4gKiBDYWxsYmFjayB0byBleGVjdXRlIHdoZW4gdGhlIHVzZXIgc2VsZWN0IGEgcG9zaXRpb24uXG4gKlxuICogQGNhbGxiYWNrXG4gKiBAbmFtZSBzZWxlY3RDYWxsYmFja1xuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BYnN0cmFjdFBsYWNlclZpZXdcbiAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCAtIEluZGV4IG9mIHRoZSBzZWxlY3RlZCBsb2NhdGlvbi5cbiAqIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCAtIExhYmVsIG9mIHRoZSBzZWxlY3RlZCBsb2NhdGlvbiBpZiBhbnkuXG4gKiBAcGFyYW0ge0FycmF5PE51bWJlcj59IGNvb3JkaW5hdGVzIC0gQ29vcmRpbmF0ZXMgKGBbeCwgeV1gKSBvZiB0aGUgc2VsZWN0ZWRcbiAqICBsb2NhdGlvbiBpZiBhbnkuXG4gKi9cblxuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6cGxhY2VyJztcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBgJ3BsYWNlcidgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGlzIG9uZSBvZiB0aGUgcHJvdmlkZWQgc2VydmljZXMgYWltZWQgYXQgaWRlbnRpZnlpbmcgY2xpZW50cyBpbnNpZGVcbiAqIHRoZSBleHBlcmllbmNlIGFsb25nIHdpdGggdGhlIFtgJ2xvY2F0b3InYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkxvY2F0b3J9XG4gKiBhbmQgW2AnY2hlY2tpbidgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2hlY2tpbn0gc2VydmljZXMuXG4gKlxuICogVGhlIGAncGxhY2VyJ2Agc2VydmljZSBhbGxvd3MgYSBjbGllbnQgdG8gY2hvb3NlIGl0cyBsb2NhdGlvbiBhbW9uZyBhIHNldCBvZlxuICogcG9zaXRpb25zIGRlZmluZWQgaW4gdGhlIHNlcnZlcidzIGBzZXR1cGAgY29uZmlndXJhdGlvbiBlbnRyeS5cbiAqXG4gKiBfXypUaGUgc2VydmljZSBtdXN0IGJlIHVzZWQgd2l0aCBpdHMgW3NlcnZlci1zaWRlIGNvdW50ZXJwYXJ0XXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuUGxhY2VyfSpfX1xuICpcbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5Mb2NhdG9yfVxuICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNoZWNraW59XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5tb2RlPSdsaXN0J10gLSBTZXRzIHRoZSBpbnRlcmFjdGlvbiBtb2RlIGZvciB0aGVcbiAqICBjbGllbnQgdG8gY2hvb3NlIGl0cyBwb3NpdGlvbiwgdGhlIGAnbGlzdCdgIG1vZGUgcHJvcG9zZXMgYSBkcm9wLWRvd24gbWVudVxuICogIHdoaWxlIHRoZSBgJ2dyYXBoaWMnYCBtb2RlICh3aGljaCByZXF1aXJlcyBsb2NhdGVkIHBvc2l0aW9ucykgcHJvcG9zZXMgYW5cbiAqICBpbnRlcmZhY2UgcmVwcmVzZW50aW5nIHRoZSBhcmVhIGFuZCBkb3RzIGZvciBlYWNoIGF2YWlsYWJsZSBsb2NhdGlvbi5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAZXhhbXBsZVxuICogLy8gaW5zaWRlIHRoZSBleHBlcmllbmNlIGNvbnN0cnVjdG9yXG4gKiB0aGlzLnBsYWNlciA9IHRoaXMucmVxdWlyZSgncGxhY2VyJywgeyBtb2RlOiAnZ3JhcGhpYycgfSk7XG4gKi9cbmNsYXNzIFBsYWNlciBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIHRydWUpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBtb2RlOiAnbGlzdCcsXG4gICAgICB2aWV3UHJpb3JpdHk6IDYsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIC8qKlxuICAgICAqIEluZGV4IG9mIHRoZSBwb3NpdGlvbiBzZWxlY3RlZCBieSB0aGUgdXNlci5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuaW5kZXggPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogTGFiZWwgb2YgdGhlIHBvc2l0aW9uIHNlbGVjdGVkIGJ5IHRoZSB1c2VyLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5sYWJlbCA9IG51bGw7XG5cbiAgICB0aGlzLl9vbkFrbm93bGVkZ2VSZXNwb25zZSA9IHRoaXMuX29uQWtub3dsZWRnZVJlc3BvbnNlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25DbGllbnRKb2luZWQgPSB0aGlzLl9vbkNsaWVudEpvaW5lZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uQ2xpZW50TGVhdmVkID0gdGhpcy5fb25DbGllbnRMZWF2ZWQuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vblNlbGVjdCA9IHRoaXMuX29uU2VsZWN0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25Db25maXJtUmVzcG9uc2UgPSB0aGlzLl9vbkNvbmZpcm1SZXNwb25zZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uUmVqZWN0UmVzcG9uc2UgPSB0aGlzLl9vblJlamVjdFJlc3BvbnNlLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLl9zaGFyZWRDb25maWdTZXJ2aWNlID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtY29uZmlnJyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgICB0aGlzLnNob3coKTtcblxuICAgIHRoaXMuc2VuZCgncmVxdWVzdCcpO1xuXG4gICAgdGhpcy5yZWNlaXZlKCdha25vd2xlZ2RlJywgdGhpcy5fb25Ba25vd2xlZGdlUmVzcG9uc2UpO1xuICAgIHRoaXMucmVjZWl2ZSgnY29uZmlybScsIHRoaXMuX29uQ29uZmlybVJlc3BvbnNlKTtcbiAgICB0aGlzLnJlY2VpdmUoJ3JlamVjdCcsIHRoaXMuX29uUmVqZWN0UmVzcG9uc2UpO1xuICAgIHRoaXMucmVjZWl2ZSgnY2xpZW50LWpvaW5lZCcsIHRoaXMuX29uQ2xpZW50Sm9pbmVkKTtcbiAgICB0aGlzLnJlY2VpdmUoJ2NsaWVudC1sZWF2ZWQnLCB0aGlzLl9vbkNsaWVudExlYXZlZCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RvcCgpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdha25vd2xlZ2RlJywgdGhpcy5fb25Ba25vd2xlZGdlUmVzcG9uc2UpO1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ2NvbmZpcm0nLCB0aGlzLl9vbkNvbmZpcm1SZXNwb25zZSk7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcigncmVqZWN0JywgdGhpcy5fb25SZWplY3RSZXNwb25zZSk7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignY2xpZW50LWpvaW5lZCcsIHRoaXMuX29uQ2xpZW50Sm9pbmVkKTtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdjbGllbnQtbGVhdmVkJywgdGhpcy5fb25DbGllbnRMZWF2ZWQpO1xuXG4gICAgdGhpcy5oaWRlKCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uQWtub3dsZWRnZVJlc3BvbnNlKHNldHVwQ29uZmlnSXRlbSwgZGlzYWJsZWRQb3NpdGlvbnMpIHtcbiAgICBjb25zdCBzZXR1cCA9IHRoaXMuX3NoYXJlZENvbmZpZ1NlcnZpY2UuZ2V0KHNldHVwQ29uZmlnSXRlbSk7XG4gICAgY29uc3QgYXJlYSA9IHNldHVwLmFyZWE7XG4gICAgY29uc3QgY2FwYWNpdHkgPSBzZXR1cC5jYXBhY2l0eTtcbiAgICBjb25zdCBsYWJlbHMgPSBzZXR1cC5sYWJlbHM7XG4gICAgY29uc3QgY29vcmRpbmF0ZXMgPSBzZXR1cC5jb29yZGluYXRlcztcbiAgICBjb25zdCBtYXhDbGllbnRzUGVyUG9zaXRpb24gPSBzZXR1cC5tYXhDbGllbnRzUGVyUG9zaXRpb247XG5cbiAgICB0aGlzLm5iclBvc2l0aW9ucyA9IGNhcGFjaXR5IC8gbWF4Q2xpZW50c1BlclBvc2l0aW9uO1xuXG4gICAgaWYgKGFyZWEpXG4gICAgICB0aGlzLnZpZXcuc2V0QXJlYShhcmVhKTtcblxuICAgIHRoaXMudmlldy5kaXNwbGF5UG9zaXRpb25zKGNhcGFjaXR5LCBsYWJlbHMsIGNvb3JkaW5hdGVzLCBtYXhDbGllbnRzUGVyUG9zaXRpb24pO1xuICAgIHRoaXMudmlldy51cGRhdGVEaXNhYmxlZFBvc2l0aW9ucyhkaXNhYmxlZFBvc2l0aW9ucyk7XG4gICAgdGhpcy52aWV3LnNldFNlbGVjdENhbGxhY2sodGhpcy5fb25TZWxlY3QpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vblNlbGVjdChpbmRleCwgbGFiZWwsIGNvb3JkaW5hdGVzKSB7XG4gICAgdGhpcy5zZW5kKCdwb3NpdGlvbicsIGluZGV4LCBsYWJlbCwgY29vcmRpbmF0ZXMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vbkNvbmZpcm1SZXNwb25zZShpbmRleCwgbGFiZWwsIGNvb3JkaW5hdGVzKSB7XG4gICAgY2xpZW50LmluZGV4ID0gdGhpcy5pbmRleCA9IGluZGV4O1xuICAgIGNsaWVudC5sYWJlbCA9IHRoaXMubGFiZWwgPSBsYWJlbDtcbiAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcztcblxuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25DbGllbnRKb2luZWQoZGlzYWJsZWRQb3NpdGlvbnMpIHtcbiAgICBpZiAoZGlzYWJsZWRQb3NpdGlvbnMubGVuZ3RoID49IHRoaXMubmJyUG9zaXRpb25zKVxuICAgICAgdGhpcy52aWV3LnJlamVjdChkaXNhYmxlZFBvc2l0aW9ucyk7XG4gICAgZWxzZVxuICAgICAgdGhpcy52aWV3LnVwZGF0ZURpc2FibGVkUG9zaXRpb25zKGRpc2FibGVkUG9zaXRpb25zKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25DbGllbnRMZWF2ZWQoZGlzYWJsZWRQb3NpdGlvbnMpIHtcbiAgICB0aGlzLnZpZXcudXBkYXRlRGlzYWJsZWRQb3NpdGlvbnMoZGlzYWJsZWRQb3NpdGlvbnMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vblJlamVjdFJlc3BvbnNlKGRpc2FibGVkUG9zaXRpb25zKSB7XG4gICAgaWYgKGRpc2FibGVkUG9zaXRpb25zLmxlbmd0aCA+PSB0aGlzLm5iclBvc2l0aW9ucylcbiAgICAgIHRoaXMudmlldy5yZWplY3QoZGlzYWJsZWRQb3NpdGlvbnMpO1xuICAgIGVsc2VcbiAgICAgIHRoaXMudmlldy51cGRhdGVEaXNhYmxlZFBvc2l0aW9ucyhkaXNhYmxlZFBvc2l0aW9ucyk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgUGxhY2VyKTtcblxuZXhwb3J0IGRlZmF1bHQgUGxhY2VyO1xuIl19