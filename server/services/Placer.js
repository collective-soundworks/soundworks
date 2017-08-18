'use strict';

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

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _helpers = require('../../utils/helpers');

var _server = require('../core/server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:placer';
var maxCapacity = 9999;

/**
 * Interface for the server `'placer'` service.
 *
 * This service is one of the provided services aimed at identifying clients inside
 * the experience along with the [`'locator'`]{@link module:soundworks/server.Locator}
 * and [`'checkin'`]{@link module:soundworks/server.Checkin} services.
 *
 * The placer service is well-suited for situations where the experience has a set of
 * predefined places (located or not) and shall refuse clients when all places
 * are already assigned to a client.
 * The capacity, maximum clients per available positions, optionnal labels
 * and coordinates used by the service, should be defined in the `setup`
 * entry of the server configuration and must follow the format specified in
 * {@link module:soundworks/server.appConfig.setup}. If no label is provided
 * the service will generate incremental numbers matching the given capacity.
 *
 * __*The service must be used with its [client-side counterpart]{@link module:soundworks/client.Placer}*__
 *
 * @see {@link module:soundworks/server.Locator}
 * @see {@link module:soundworks/server.Checkin}
 *
 * @memberof module:soundworks/server
 * @example
 * // initialize the server with a custom setup
 * const setup = {
 *   capacity: 8,
 *   labels: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
 * };
 * soundworks.server.init({ setup });
 *
 * // inside the experience constructor
 * this.placer = this.require('placer');
 */

var Placer = function (_Service) {
  (0, _inherits3.default)(Placer, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  function Placer() {
    (0, _classCallCheck3.default)(this, Placer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Placer.__proto__ || (0, _getPrototypeOf2.default)(Placer)).call(this, SERVICE_ID));

    var defaults = {
      configItem: 'setup'
    };

    _this.configure(defaults);
    _this._sharedConfig = _this.require('shared-config');
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(Placer, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      (0, _get3.default)(Placer.prototype.__proto__ || (0, _getPrototypeOf2.default)(Placer.prototype), 'start', this).call(this);
      var configItem = this.options.configItem;

      /**
       * Setup defining dimensions and predefined positions (labels and/or coordinates).
       * @type {Object}
       */
      this.setup = this._sharedConfig.get(configItem);

      if (this.setup === null) throw new Error('"service:placer": server.config.' + configItem + ' is not defined');

      if (!this.setup.maxClientsPerPosition) this.setup.maxClientsPerPosition = 1;

      /**
       * Maximum number of places.
       * @type {Number}
       */
      this.capacity = (0, _helpers.getOpt)(this.setup.capacity, Infinity, 1);

      if (this.setup) {
        var setup = this.setup;
        var maxClientsPerPosition = setup.maxClientsPerPosition;
        var numLabels = setup.labels ? setup.labels.length : Infinity;
        var numCoordinates = setup.coordinates ? setup.coordinates.length : Infinity;
        var numPositions = Math.min(numLabels, numCoordinates) * maxClientsPerPosition;

        if (this.capacity > numPositions) this.capacity = numPositions;
      }

      if (this.capacity > maxCapacity) this.capacity = maxCapacity;

      /**
       * List of clients checked in with corresponding indices.
       * @type {Object<Number, Array>}
       */
      this.clients = {};

      /**
       * Number of connected clients.
       * @type {Number}
       */
      this.numClients = 0;

      /**
       * List of the indexes of the disabled positions.
       * @type {Array}
       */
      this.disabledPositions = [];

      // update config capacity with computed one
      this.setup.capacity = this.capacity;

      // add path to shared config requirements for all client type
      this.clientTypes.forEach(function (clientType) {
        _this2._sharedConfig.share(_this2.options.configItem, clientType);
      });
    }

    /**
     * Store the client in a given position.
     * @private
     * @param {Number} positionIndex - Index of chosen position.
     * @param {Object} client - Client associated to the position.
     * @returns {Boolean} - `true` if succeed, `false` if not.
     */

  }, {
    key: '_storeClientPosition',
    value: function _storeClientPosition(positionIndex, client) {
      if (!this.clients[positionIndex]) this.clients[positionIndex] = [];

      var list = this.clients[positionIndex];

      if (list.length < this.setup.maxClientsPerPosition && this.numClients < this.capacity) {
        list.push(client);
        this.numClients += 1;

        // if last available place for this position, lock it
        if (list.length >= this.setup.maxClientsPerPosition) this.disabledPositions.push(positionIndex);

        return true;
      }

      return false;
    }

    /**
     * Remove the client from a given position.
     * @private
     * @param {Number} positionIndex - Index of chosen position.
     * @param {Object} client - Client associated to the position.
     */

  }, {
    key: '_removeClientPosition',
    value: function _removeClientPosition(positionIndex, client) {
      var list = this.clients[positionIndex] || [];
      var clientIndex = list.indexOf(client);

      if (clientIndex !== -1) {
        list.splice(clientIndex, 1);
        // check if the list was marked as disabled
        if (list.length < this.setup.maxClientsPerPosition) {
          var disabledIndex = this.disabledPositions.indexOf(positionIndex);

          if (disabledIndex !== -1) this.disabledPositions.splice(disabledIndex, 1);
        }

        this.numClients -= 1;
      }
    }

    /** @private */

  }, {
    key: '_onRequest',
    value: function _onRequest(client) {
      var _this3 = this;

      return function () {
        var configItem = _this3.options.configItem;
        var disabledPositions = _this3.disabledPositions;
        // aknowledge
        if (_this3.numClients < _this3.setup.capacity) {
          _this3.send(client, 'aknowlegde', configItem, disabledPositions);
        } else {
          _this3.send(client, 'aknowlegde', configItem, disabledPositions);
          _this3.send(client, 'reject', disabledPositions);
        }
      };
    }

    /** @private */

  }, {
    key: '_onPosition',
    value: function _onPosition(client) {
      var _this4 = this;

      return function (index, label, coordinates) {
        var success = _this4._storeClientPosition(index, client);

        if (success) {
          client.index = index;
          client.label = label;
          client.coordinates = coordinates;

          _this4.send(client, 'confirm', index, label, coordinates);
          // @todo - check if something more subtile than a broadcast can be done.
          _this4.broadcast(null, client, 'client-joined', _this4.disabledPositions);
        } else {
          _this4.send(client, 'reject', _this4.disabledPositions);
        }
      };
    }

    /** @private */

  }, {
    key: 'connect',
    value: function connect(client) {
      (0, _get3.default)(Placer.prototype.__proto__ || (0, _getPrototypeOf2.default)(Placer.prototype), 'connect', this).call(this, client);

      this.receive(client, 'request', this._onRequest(client));
      this.receive(client, 'position', this._onPosition(client));
    }

    /** @private */

  }, {
    key: 'disconnect',
    value: function disconnect(client) {
      (0, _get3.default)(Placer.prototype.__proto__ || (0, _getPrototypeOf2.default)(Placer.prototype), 'disconnect', this).call(this, client);

      this._removeClientPosition(client.index, client);
      // @todo - check if something more subtile than a broadcast can be done.
      this.broadcast(null, client, 'client-leaved', this.disabledPositions);
    }
  }]);
  return Placer;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, Placer);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYWNlci5qcyJdLCJuYW1lcyI6WyJTRVJWSUNFX0lEIiwibWF4Q2FwYWNpdHkiLCJQbGFjZXIiLCJkZWZhdWx0cyIsImNvbmZpZ0l0ZW0iLCJjb25maWd1cmUiLCJfc2hhcmVkQ29uZmlnIiwicmVxdWlyZSIsIm9wdGlvbnMiLCJzZXR1cCIsImdldCIsIkVycm9yIiwibWF4Q2xpZW50c1BlclBvc2l0aW9uIiwiY2FwYWNpdHkiLCJJbmZpbml0eSIsIm51bUxhYmVscyIsImxhYmVscyIsImxlbmd0aCIsIm51bUNvb3JkaW5hdGVzIiwiY29vcmRpbmF0ZXMiLCJudW1Qb3NpdGlvbnMiLCJNYXRoIiwibWluIiwiY2xpZW50cyIsIm51bUNsaWVudHMiLCJkaXNhYmxlZFBvc2l0aW9ucyIsImNsaWVudFR5cGVzIiwiZm9yRWFjaCIsImNsaWVudFR5cGUiLCJzaGFyZSIsInBvc2l0aW9uSW5kZXgiLCJjbGllbnQiLCJsaXN0IiwicHVzaCIsImNsaWVudEluZGV4IiwiaW5kZXhPZiIsInNwbGljZSIsImRpc2FibGVkSW5kZXgiLCJzZW5kIiwiaW5kZXgiLCJsYWJlbCIsInN1Y2Nlc3MiLCJfc3RvcmVDbGllbnRQb3NpdGlvbiIsImJyb2FkY2FzdCIsInJlY2VpdmUiLCJfb25SZXF1ZXN0IiwiX29uUG9zaXRpb24iLCJfcmVtb3ZlQ2xpZW50UG9zaXRpb24iLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7O0FBRUE7Ozs7OztBQUVBLElBQU1BLGFBQWEsZ0JBQW5CO0FBQ0EsSUFBTUMsY0FBYyxJQUFwQjs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWlDTUMsTTs7O0FBQ0o7QUFDQSxvQkFBYztBQUFBOztBQUFBLHNJQUNORixVQURNOztBQUdaLFFBQU1HLFdBQVc7QUFDZkMsa0JBQVk7QUFERyxLQUFqQjs7QUFJQSxVQUFLQyxTQUFMLENBQWVGLFFBQWY7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QUFmO0FBQ0FSLGlCQUFPUyxLQUFQLEdBQWVBLEtBQWY7QUFDQVQsaUJBQU9aLFdBQVAsR0FBcUJBLFdBQXJCOztBQUVBLGlCQUFLbUIsSUFBTCxDQUFVUCxNQUFWLEVBQWtCLFNBQWxCLEVBQTZCUSxLQUE3QixFQUFvQ0MsS0FBcEMsRUFBMkNyQixXQUEzQztBQUNBO0FBQ0EsaUJBQUt3QixTQUFMLENBQWUsSUFBZixFQUFxQlosTUFBckIsRUFBNkIsZUFBN0IsRUFBOEMsT0FBS04saUJBQW5EO0FBQ0QsU0FSRCxNQVFPO0FBQ0wsaUJBQUthLElBQUwsQ0FBVVAsTUFBVixFQUFrQixRQUFsQixFQUE0QixPQUFLTixpQkFBakM7QUFDRDtBQUNGLE9BZEQ7QUFlRDs7QUFFRDs7Ozs0QkFDUU0sTSxFQUFRO0FBQ2Qsb0lBQWNBLE1BQWQ7O0FBRUEsV0FBS2EsT0FBTCxDQUFhYixNQUFiLEVBQXFCLFNBQXJCLEVBQWdDLEtBQUtjLFVBQUwsQ0FBZ0JkLE1BQWhCLENBQWhDO0FBQ0EsV0FBS2EsT0FBTCxDQUFhYixNQUFiLEVBQXFCLFVBQXJCLEVBQWlDLEtBQUtlLFdBQUwsQ0FBaUJmLE1BQWpCLENBQWpDO0FBQ0Q7O0FBRUQ7Ozs7K0JBQ1dBLE0sRUFBUTtBQUNqQix1SUFBaUJBLE1BQWpCOztBQUVBLFdBQUtnQixxQkFBTCxDQUEyQmhCLE9BQU9RLEtBQWxDLEVBQXlDUixNQUF6QztBQUNBO0FBQ0EsV0FBS1ksU0FBTCxDQUFlLElBQWYsRUFBcUJaLE1BQXJCLEVBQTZCLGVBQTdCLEVBQThDLEtBQUtOLGlCQUFuRDtBQUNEOzs7OztBQUdILHlCQUFldUIsUUFBZixDQUF3QmhELFVBQXhCLEVBQW9DRSxNQUFwQyIsImZpbGUiOiJQbGFjZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IHsgZ2V0T3B0IH0gZnJvbSAnLi4vLi4vdXRpbHMvaGVscGVycyc7XG5cbmltcG9ydCBzZXJ2ZXIgZnJvbSAnLi4vY29yZS9zZXJ2ZXInO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6cGxhY2VyJztcbmNvbnN0IG1heENhcGFjaXR5ID0gOTk5OTtcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBzZXJ2ZXIgYCdwbGFjZXInYCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmljZSBpcyBvbmUgb2YgdGhlIHByb3ZpZGVkIHNlcnZpY2VzIGFpbWVkIGF0IGlkZW50aWZ5aW5nIGNsaWVudHMgaW5zaWRlXG4gKiB0aGUgZXhwZXJpZW5jZSBhbG9uZyB3aXRoIHRoZSBbYCdsb2NhdG9yJ2Bde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5Mb2NhdG9yfVxuICogYW5kIFtgJ2NoZWNraW4nYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLkNoZWNraW59IHNlcnZpY2VzLlxuICpcbiAqIFRoZSBwbGFjZXIgc2VydmljZSBpcyB3ZWxsLXN1aXRlZCBmb3Igc2l0dWF0aW9ucyB3aGVyZSB0aGUgZXhwZXJpZW5jZSBoYXMgYSBzZXQgb2ZcbiAqIHByZWRlZmluZWQgcGxhY2VzIChsb2NhdGVkIG9yIG5vdCkgYW5kIHNoYWxsIHJlZnVzZSBjbGllbnRzIHdoZW4gYWxsIHBsYWNlc1xuICogYXJlIGFscmVhZHkgYXNzaWduZWQgdG8gYSBjbGllbnQuXG4gKiBUaGUgY2FwYWNpdHksIG1heGltdW0gY2xpZW50cyBwZXIgYXZhaWxhYmxlIHBvc2l0aW9ucywgb3B0aW9ubmFsIGxhYmVsc1xuICogYW5kIGNvb3JkaW5hdGVzIHVzZWQgYnkgdGhlIHNlcnZpY2UsIHNob3VsZCBiZSBkZWZpbmVkIGluIHRoZSBgc2V0dXBgXG4gKiBlbnRyeSBvZiB0aGUgc2VydmVyIGNvbmZpZ3VyYXRpb24gYW5kIG11c3QgZm9sbG93IHRoZSBmb3JtYXQgc3BlY2lmaWVkIGluXG4gKiB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLmFwcENvbmZpZy5zZXR1cH0uIElmIG5vIGxhYmVsIGlzIHByb3ZpZGVkXG4gKiB0aGUgc2VydmljZSB3aWxsIGdlbmVyYXRlIGluY3JlbWVudGFsIG51bWJlcnMgbWF0Y2hpbmcgdGhlIGdpdmVuIGNhcGFjaXR5LlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIG11c3QgYmUgdXNlZCB3aXRoIGl0cyBbY2xpZW50LXNpZGUgY291bnRlcnBhcnRde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGFjZXJ9Kl9fXG4gKlxuICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLkxvY2F0b3J9XG4gKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuQ2hlY2tpbn1cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyXG4gKiBAZXhhbXBsZVxuICogLy8gaW5pdGlhbGl6ZSB0aGUgc2VydmVyIHdpdGggYSBjdXN0b20gc2V0dXBcbiAqIGNvbnN0IHNldHVwID0ge1xuICogICBjYXBhY2l0eTogOCxcbiAqICAgbGFiZWxzOiBbJ2EnLCAnYicsICdjJywgJ2QnLCAnZScsICdmJywgJ2cnLCAnaCddLFxuICogfTtcbiAqIHNvdW5kd29ya3Muc2VydmVyLmluaXQoeyBzZXR1cCB9KTtcbiAqXG4gKiAvLyBpbnNpZGUgdGhlIGV4cGVyaWVuY2UgY29uc3RydWN0b3JcbiAqIHRoaXMucGxhY2VyID0gdGhpcy5yZXF1aXJlKCdwbGFjZXInKTtcbiAqL1xuY2xhc3MgUGxhY2VyIGV4dGVuZHMgU2VydmljZSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbmNpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGNvbmZpZ0l0ZW06ICdzZXR1cCcsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcbiAgICB0aGlzLl9zaGFyZWRDb25maWcgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1jb25maWcnKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuICAgIGNvbnN0IGNvbmZpZ0l0ZW0gPSB0aGlzLm9wdGlvbnMuY29uZmlnSXRlbTtcblxuICAgIC8qKlxuICAgICAqIFNldHVwIGRlZmluaW5nIGRpbWVuc2lvbnMgYW5kIHByZWRlZmluZWQgcG9zaXRpb25zIChsYWJlbHMgYW5kL29yIGNvb3JkaW5hdGVzKS5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuc2V0dXAgPSB0aGlzLl9zaGFyZWRDb25maWcuZ2V0KGNvbmZpZ0l0ZW0pO1xuXG4gICAgaWYgKHRoaXMuc2V0dXAgPT09IG51bGwpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFwic2VydmljZTpwbGFjZXJcIjogc2VydmVyLmNvbmZpZy4ke2NvbmZpZ0l0ZW19IGlzIG5vdCBkZWZpbmVkYCk7XG5cbiAgICBpZiAoIXRoaXMuc2V0dXAubWF4Q2xpZW50c1BlclBvc2l0aW9uKVxuICAgICAgdGhpcy5zZXR1cC5tYXhDbGllbnRzUGVyUG9zaXRpb24gPSAxO1xuXG4gICAgLyoqXG4gICAgICogTWF4aW11bSBudW1iZXIgb2YgcGxhY2VzLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5jYXBhY2l0eSA9IGdldE9wdCh0aGlzLnNldHVwLmNhcGFjaXR5LCBJbmZpbml0eSwgMSk7XG5cbiAgICBpZiAodGhpcy5zZXR1cCkge1xuICAgICAgY29uc3Qgc2V0dXAgPSB0aGlzLnNldHVwO1xuICAgICAgY29uc3QgbWF4Q2xpZW50c1BlclBvc2l0aW9uID0gc2V0dXAubWF4Q2xpZW50c1BlclBvc2l0aW9uO1xuICAgICAgY29uc3QgbnVtTGFiZWxzID0gc2V0dXAubGFiZWxzID8gc2V0dXAubGFiZWxzLmxlbmd0aCA6IEluZmluaXR5O1xuICAgICAgY29uc3QgbnVtQ29vcmRpbmF0ZXMgPSBzZXR1cC5jb29yZGluYXRlcyA/IHNldHVwLmNvb3JkaW5hdGVzLmxlbmd0aCA6IEluZmluaXR5O1xuICAgICAgY29uc3QgbnVtUG9zaXRpb25zID0gTWF0aC5taW4obnVtTGFiZWxzLCBudW1Db29yZGluYXRlcykgKiBtYXhDbGllbnRzUGVyUG9zaXRpb247XG5cbiAgICAgIGlmICh0aGlzLmNhcGFjaXR5ID4gbnVtUG9zaXRpb25zKVxuICAgICAgICB0aGlzLmNhcGFjaXR5ID0gbnVtUG9zaXRpb25zO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNhcGFjaXR5ID4gbWF4Q2FwYWNpdHkpXG4gICAgICB0aGlzLmNhcGFjaXR5ID0gbWF4Q2FwYWNpdHk7XG5cbiAgICAvKipcbiAgICAgKiBMaXN0IG9mIGNsaWVudHMgY2hlY2tlZCBpbiB3aXRoIGNvcnJlc3BvbmRpbmcgaW5kaWNlcy5cbiAgICAgKiBAdHlwZSB7T2JqZWN0PE51bWJlciwgQXJyYXk+fVxuICAgICAqL1xuICAgIHRoaXMuY2xpZW50cyA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogTnVtYmVyIG9mIGNvbm5lY3RlZCBjbGllbnRzLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5udW1DbGllbnRzID0gMDtcblxuICAgIC8qKlxuICAgICAqIExpc3Qgb2YgdGhlIGluZGV4ZXMgb2YgdGhlIGRpc2FibGVkIHBvc2l0aW9ucy5cbiAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICovXG4gICAgdGhpcy5kaXNhYmxlZFBvc2l0aW9ucyA9IFtdO1xuXG4gICAgLy8gdXBkYXRlIGNvbmZpZyBjYXBhY2l0eSB3aXRoIGNvbXB1dGVkIG9uZVxuICAgIHRoaXMuc2V0dXAuY2FwYWNpdHkgPSB0aGlzLmNhcGFjaXR5O1xuXG4gICAgLy8gYWRkIHBhdGggdG8gc2hhcmVkIGNvbmZpZyByZXF1aXJlbWVudHMgZm9yIGFsbCBjbGllbnQgdHlwZVxuICAgIHRoaXMuY2xpZW50VHlwZXMuZm9yRWFjaCgoY2xpZW50VHlwZSkgPT4ge1xuICAgICAgdGhpcy5fc2hhcmVkQ29uZmlnLnNoYXJlKHRoaXMub3B0aW9ucy5jb25maWdJdGVtLCBjbGllbnRUeXBlKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9yZSB0aGUgY2xpZW50IGluIGEgZ2l2ZW4gcG9zaXRpb24uXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NpdGlvbkluZGV4IC0gSW5kZXggb2YgY2hvc2VuIHBvc2l0aW9uLlxuICAgKiBAcGFyYW0ge09iamVjdH0gY2xpZW50IC0gQ2xpZW50IGFzc29jaWF0ZWQgdG8gdGhlIHBvc2l0aW9uLlxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gLSBgdHJ1ZWAgaWYgc3VjY2VlZCwgYGZhbHNlYCBpZiBub3QuXG4gICAqL1xuICBfc3RvcmVDbGllbnRQb3NpdGlvbihwb3NpdGlvbkluZGV4LCBjbGllbnQpIHtcbiAgICBpZiAoIXRoaXMuY2xpZW50c1twb3NpdGlvbkluZGV4XSlcbiAgICAgIHRoaXMuY2xpZW50c1twb3NpdGlvbkluZGV4XSA9IFtdO1xuXG4gICAgY29uc3QgbGlzdCA9IHRoaXMuY2xpZW50c1twb3NpdGlvbkluZGV4XTtcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA8IHRoaXMuc2V0dXAubWF4Q2xpZW50c1BlclBvc2l0aW9uICYmXG4gICAgICAgIHRoaXMubnVtQ2xpZW50cyA8IHRoaXMuY2FwYWNpdHlcbiAgICApIHtcbiAgICAgIGxpc3QucHVzaChjbGllbnQpO1xuICAgICAgdGhpcy5udW1DbGllbnRzICs9IDE7XG5cbiAgICAgIC8vIGlmIGxhc3QgYXZhaWxhYmxlIHBsYWNlIGZvciB0aGlzIHBvc2l0aW9uLCBsb2NrIGl0XG4gICAgICBpZiAobGlzdC5sZW5ndGggPj0gdGhpcy5zZXR1cC5tYXhDbGllbnRzUGVyUG9zaXRpb24pXG4gICAgICAgIHRoaXMuZGlzYWJsZWRQb3NpdGlvbnMucHVzaChwb3NpdGlvbkluZGV4KTtcblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSB0aGUgY2xpZW50IGZyb20gYSBnaXZlbiBwb3NpdGlvbi5cbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc2l0aW9uSW5kZXggLSBJbmRleCBvZiBjaG9zZW4gcG9zaXRpb24uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjbGllbnQgLSBDbGllbnQgYXNzb2NpYXRlZCB0byB0aGUgcG9zaXRpb24uXG4gICAqL1xuICBfcmVtb3ZlQ2xpZW50UG9zaXRpb24ocG9zaXRpb25JbmRleCwgY2xpZW50KSB7XG4gICAgY29uc3QgbGlzdCA9IHRoaXMuY2xpZW50c1twb3NpdGlvbkluZGV4XSB8fMKgW107XG4gICAgY29uc3QgY2xpZW50SW5kZXggPSBsaXN0LmluZGV4T2YoY2xpZW50KTtcblxuICAgIGlmIChjbGllbnRJbmRleCAhPT0gLTEpIHtcbiAgICAgIGxpc3Quc3BsaWNlKGNsaWVudEluZGV4LCAxKTtcbiAgICAgIC8vIGNoZWNrIGlmIHRoZSBsaXN0IHdhcyBtYXJrZWQgYXMgZGlzYWJsZWRcbiAgICAgIGlmIChsaXN0Lmxlbmd0aCA8IHRoaXMuc2V0dXAubWF4Q2xpZW50c1BlclBvc2l0aW9uKSB7XG4gICAgICAgIGNvbnN0IGRpc2FibGVkSW5kZXggPSB0aGlzLmRpc2FibGVkUG9zaXRpb25zLmluZGV4T2YocG9zaXRpb25JbmRleCk7XG5cbiAgICAgICAgaWYgKGRpc2FibGVkSW5kZXggIT09IC0xKVxuICAgICAgICAgIHRoaXMuZGlzYWJsZWRQb3NpdGlvbnMuc3BsaWNlKGRpc2FibGVkSW5kZXgsIDEpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLm51bUNsaWVudHMgLT0gMTtcbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uUmVxdWVzdChjbGllbnQpIHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgY29uc3QgY29uZmlnSXRlbSA9IHRoaXMub3B0aW9ucy5jb25maWdJdGVtO1xuICAgICAgY29uc3QgZGlzYWJsZWRQb3NpdGlvbnMgPSB0aGlzLmRpc2FibGVkUG9zaXRpb25zO1xuICAgICAgLy8gYWtub3dsZWRnZVxuICAgICAgaWYgKHRoaXMubnVtQ2xpZW50cyA8IHRoaXMuc2V0dXAuY2FwYWNpdHkpIHtcbiAgICAgICAgdGhpcy5zZW5kKGNsaWVudCwgJ2Frbm93bGVnZGUnLCBjb25maWdJdGVtLCBkaXNhYmxlZFBvc2l0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNlbmQoY2xpZW50LCAnYWtub3dsZWdkZScsIGNvbmZpZ0l0ZW0sIGRpc2FibGVkUG9zaXRpb25zKTtcbiAgICAgICAgdGhpcy5zZW5kKGNsaWVudCwgJ3JlamVjdCcsIGRpc2FibGVkUG9zaXRpb25zKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uUG9zaXRpb24oY2xpZW50KSB7XG4gICAgcmV0dXJuIChpbmRleCwgbGFiZWwsIGNvb3JkaW5hdGVzKSA9PiB7XG4gICAgICBjb25zdCBzdWNjZXNzID0gdGhpcy5fc3RvcmVDbGllbnRQb3NpdGlvbihpbmRleCwgY2xpZW50KTtcblxuICAgICAgaWYgKHN1Y2Nlc3MpIHtcbiAgICAgICAgY2xpZW50LmluZGV4ID0gaW5kZXg7XG4gICAgICAgIGNsaWVudC5sYWJlbCA9IGxhYmVsO1xuICAgICAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcztcblxuICAgICAgICB0aGlzLnNlbmQoY2xpZW50LCAnY29uZmlybScsIGluZGV4LCBsYWJlbCwgY29vcmRpbmF0ZXMpO1xuICAgICAgICAvLyBAdG9kbyAtIGNoZWNrIGlmIHNvbWV0aGluZyBtb3JlIHN1YnRpbGUgdGhhbiBhIGJyb2FkY2FzdCBjYW4gYmUgZG9uZS5cbiAgICAgICAgdGhpcy5icm9hZGNhc3QobnVsbCwgY2xpZW50LCAnY2xpZW50LWpvaW5lZCcsIHRoaXMuZGlzYWJsZWRQb3NpdGlvbnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZW5kKGNsaWVudCwgJ3JlamVjdCcsIHRoaXMuZGlzYWJsZWRQb3NpdGlvbnMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXF1ZXN0JywgdGhpcy5fb25SZXF1ZXN0KGNsaWVudCkpO1xuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdwb3NpdGlvbicsIHRoaXMuX29uUG9zaXRpb24oY2xpZW50KSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgZGlzY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5kaXNjb25uZWN0KGNsaWVudCk7XG5cbiAgICB0aGlzLl9yZW1vdmVDbGllbnRQb3NpdGlvbihjbGllbnQuaW5kZXgsIGNsaWVudCk7XG4gICAgLy8gQHRvZG8gLSBjaGVjayBpZiBzb21ldGhpbmcgbW9yZSBzdWJ0aWxlIHRoYW4gYSBicm9hZGNhc3QgY2FuIGJlIGRvbmUuXG4gICAgdGhpcy5icm9hZGNhc3QobnVsbCwgY2xpZW50LCAnY2xpZW50LWxlYXZlZCcsIHRoaXMuZGlzYWJsZWRQb3NpdGlvbnMpO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFBsYWNlcik7XG4iXX0=