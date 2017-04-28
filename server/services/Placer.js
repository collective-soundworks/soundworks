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

      this.ready();
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
        // acknowledge
        if (_this3.numClients < _this3.setup.capacity) _this3.send(client, 'aknowlegde', configItem, disabledPositions);else _this3.send(client, 'reject', disabledPositions);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYWNlci5qcyJdLCJuYW1lcyI6WyJTRVJWSUNFX0lEIiwibWF4Q2FwYWNpdHkiLCJQbGFjZXIiLCJkZWZhdWx0cyIsImNvbmZpZ0l0ZW0iLCJjb25maWd1cmUiLCJfc2hhcmVkQ29uZmlnIiwicmVxdWlyZSIsIm9wdGlvbnMiLCJzZXR1cCIsImdldCIsIkVycm9yIiwibWF4Q2xpZW50c1BlclBvc2l0aW9uIiwiY2FwYWNpdHkiLCJJbmZpbml0eSIsIm51bUxhYmVscyIsImxhYmVscyIsImxlbmd0aCIsIm51bUNvb3JkaW5hdGVzIiwiY29vcmRpbmF0ZXMiLCJudW1Qb3NpdGlvbnMiLCJNYXRoIiwibWluIiwiY2xpZW50cyIsIm51bUNsaWVudHMiLCJkaXNhYmxlZFBvc2l0aW9ucyIsImNsaWVudFR5cGVzIiwiZm9yRWFjaCIsImNsaWVudFR5cGUiLCJzaGFyZSIsInJlYWR5IiwicG9zaXRpb25JbmRleCIsImNsaWVudCIsImxpc3QiLCJwdXNoIiwiY2xpZW50SW5kZXgiLCJpbmRleE9mIiwic3BsaWNlIiwiZGlzYWJsZWRJbmRleCIsInNlbmQiLCJpbmRleCIsImxhYmVsIiwic3VjY2VzcyIsIl9zdG9yZUNsaWVudFBvc2l0aW9uIiwiYnJvYWRjYXN0IiwicmVjZWl2ZSIsIl9vblJlcXVlc3QiLCJfb25Qb3NpdGlvbiIsIl9yZW1vdmVDbGllbnRQb3NpdGlvbiIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFFQTs7Ozs7O0FBRUEsSUFBTUEsYUFBYSxnQkFBbkI7QUFDQSxJQUFNQyxjQUFjLElBQXBCOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBaUNNQyxNOzs7QUFDSjtBQUNBLG9CQUFjO0FBQUE7O0FBQUEsc0lBQ05GLFVBRE07O0FBR1osUUFBTUcsV0FBVztBQUNmQyxrQkFBWTtBQURHLEtBQWpCOztBQUlBLFVBQUtDLFNBQUwsQ0FB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QUFFQSxpQkFBS29CLElBQUwsQ0FBVVAsTUFBVixFQUFrQixTQUFsQixFQUE2QlEsS0FBN0IsRUFBb0NDLEtBQXBDLEVBQTJDdEIsV0FBM0M7QUFDQTtBQUNBLGlCQUFLeUIsU0FBTCxDQUFlLElBQWYsRUFBcUJaLE1BQXJCLEVBQTZCLGVBQTdCLEVBQThDLE9BQUtQLGlCQUFuRDtBQUNELFNBUkQsTUFRTztBQUNMLGlCQUFLYyxJQUFMLENBQVVQLE1BQVYsRUFBa0IsUUFBbEIsRUFBNEIsT0FBS1AsaUJBQWpDO0FBQ0Q7QUFDRixPQWREO0FBZUQ7O0FBRUQ7Ozs7NEJBQ1FPLE0sRUFBUTtBQUNkLG9JQUFjQSxNQUFkOztBQUVBLFdBQUthLE9BQUwsQ0FBYWIsTUFBYixFQUFxQixTQUFyQixFQUFnQyxLQUFLYyxVQUFMLENBQWdCZCxNQUFoQixDQUFoQztBQUNBLFdBQUthLE9BQUwsQ0FBYWIsTUFBYixFQUFxQixVQUFyQixFQUFpQyxLQUFLZSxXQUFMLENBQWlCZixNQUFqQixDQUFqQztBQUNEOztBQUVEOzs7OytCQUNXQSxNLEVBQVE7QUFDakIsdUlBQWlCQSxNQUFqQjs7QUFFQSxXQUFLZ0IscUJBQUwsQ0FBMkJoQixPQUFPUSxLQUFsQyxFQUF5Q1IsTUFBekM7QUFDQTtBQUNBLFdBQUtZLFNBQUwsQ0FBZSxJQUFmLEVBQXFCWixNQUFyQixFQUE2QixlQUE3QixFQUE4QyxLQUFLUCxpQkFBbkQ7QUFDRDs7Ozs7QUFHSCx5QkFBZXdCLFFBQWYsQ0FBd0JqRCxVQUF4QixFQUFvQ0UsTUFBcEMiLCJmaWxlIjoiUGxhY2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCB7IGdldE9wdCB9IGZyb20gJy4uLy4uL3V0aWxzL2hlbHBlcnMnO1xuXG5pbXBvcnQgc2VydmVyIGZyb20gJy4uL2NvcmUvc2VydmVyJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOnBsYWNlcic7XG5jb25zdCBtYXhDYXBhY2l0eSA9IDk5OTk7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgc2VydmVyIGAncGxhY2VyJ2Agc2VydmljZS5cbiAqXG4gKiBUaGlzIHNlcnZpY2UgaXMgb25lIG9mIHRoZSBwcm92aWRlZCBzZXJ2aWNlcyBhaW1lZCBhdCBpZGVudGlmeWluZyBjbGllbnRzIGluc2lkZVxuICogdGhlIGV4cGVyaWVuY2UgYWxvbmcgd2l0aCB0aGUgW2AnbG9jYXRvcidgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuTG9jYXRvcn1cbiAqIGFuZCBbYCdjaGVja2luJ2Bde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5DaGVja2lufSBzZXJ2aWNlcy5cbiAqXG4gKiBUaGUgcGxhY2VyIHNlcnZpY2UgaXMgd2VsbC1zdWl0ZWQgZm9yIHNpdHVhdGlvbnMgd2hlcmUgdGhlIGV4cGVyaWVuY2UgaGFzIGEgc2V0IG9mXG4gKiBwcmVkZWZpbmVkIHBsYWNlcyAobG9jYXRlZCBvciBub3QpIGFuZCBzaGFsbCByZWZ1c2UgY2xpZW50cyB3aGVuIGFsbCBwbGFjZXNcbiAqIGFyZSBhbHJlYWR5IGFzc2lnbmVkIHRvIGEgY2xpZW50LlxuICogVGhlIGNhcGFjaXR5LCBtYXhpbXVtIGNsaWVudHMgcGVyIGF2YWlsYWJsZSBwb3NpdGlvbnMsIG9wdGlvbm5hbCBsYWJlbHNcbiAqIGFuZCBjb29yZGluYXRlcyB1c2VkIGJ5IHRoZSBzZXJ2aWNlLCBzaG91bGQgYmUgZGVmaW5lZCBpbiB0aGUgYHNldHVwYFxuICogZW50cnkgb2YgdGhlIHNlcnZlciBjb25maWd1cmF0aW9uIGFuZCBtdXN0IGZvbGxvdyB0aGUgZm9ybWF0IHNwZWNpZmllZCBpblxuICoge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5hcHBDb25maWcuc2V0dXB9LiBJZiBubyBsYWJlbCBpcyBwcm92aWRlZFxuICogdGhlIHNlcnZpY2Ugd2lsbCBnZW5lcmF0ZSBpbmNyZW1lbnRhbCBudW1iZXJzIG1hdGNoaW5nIHRoZSBnaXZlbiBjYXBhY2l0eS5cbiAqXG4gKiBfXypUaGUgc2VydmljZSBtdXN0IGJlIHVzZWQgd2l0aCBpdHMgW2NsaWVudC1zaWRlIGNvdW50ZXJwYXJ0XXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhY2VyfSpfX1xuICpcbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5Mb2NhdG9yfVxuICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLkNoZWNraW59XG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlclxuICogQGV4YW1wbGVcbiAqIC8vIGluaXRpYWxpemUgdGhlIHNlcnZlciB3aXRoIGEgY3VzdG9tIHNldHVwXG4gKiBjb25zdCBzZXR1cCA9IHtcbiAqICAgY2FwYWNpdHk6IDgsXG4gKiAgIGxhYmVsczogWydhJywgJ2InLCAnYycsICdkJywgJ2UnLCAnZicsICdnJywgJ2gnXSxcbiAqIH07XG4gKiBzb3VuZHdvcmtzLnNlcnZlci5pbml0KHsgc2V0dXAgfSk7XG4gKlxuICogLy8gaW5zaWRlIHRoZSBleHBlcmllbmNlIGNvbnN0cnVjdG9yXG4gKiB0aGlzLnBsYWNlciA9IHRoaXMucmVxdWlyZSgncGxhY2VyJyk7XG4gKi9cbmNsYXNzIFBsYWNlciBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBjb25maWdJdGVtOiAnc2V0dXAnLFxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG4gICAgdGhpcy5fc2hhcmVkQ29uZmlnID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtY29uZmlnJyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgICBjb25zdCBjb25maWdJdGVtID0gdGhpcy5vcHRpb25zLmNvbmZpZ0l0ZW07XG5cbiAgICAvKipcbiAgICAgKiBTZXR1cCBkZWZpbmluZyBkaW1lbnNpb25zIGFuZCBwcmVkZWZpbmVkIHBvc2l0aW9ucyAobGFiZWxzIGFuZC9vciBjb29yZGluYXRlcykuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLnNldHVwID0gdGhpcy5fc2hhcmVkQ29uZmlnLmdldChjb25maWdJdGVtKTtcblxuICAgIGlmICh0aGlzLnNldHVwID09PSBudWxsKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcInNlcnZpY2U6cGxhY2VyXCI6IHNlcnZlci5jb25maWcuJHtjb25maWdJdGVtfSBpcyBub3QgZGVmaW5lZGApO1xuXG4gICAgaWYgKCF0aGlzLnNldHVwLm1heENsaWVudHNQZXJQb3NpdGlvbilcbiAgICAgIHRoaXMuc2V0dXAubWF4Q2xpZW50c1BlclBvc2l0aW9uID0gMTtcblxuICAgIC8qKlxuICAgICAqIE1heGltdW0gbnVtYmVyIG9mIHBsYWNlcy5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuY2FwYWNpdHkgPSBnZXRPcHQodGhpcy5zZXR1cC5jYXBhY2l0eSwgSW5maW5pdHksIDEpO1xuXG4gICAgaWYgKHRoaXMuc2V0dXApIHtcbiAgICAgIGNvbnN0IHNldHVwID0gdGhpcy5zZXR1cDtcbiAgICAgIGNvbnN0IG1heENsaWVudHNQZXJQb3NpdGlvbiA9IHNldHVwLm1heENsaWVudHNQZXJQb3NpdGlvbjtcbiAgICAgIGNvbnN0IG51bUxhYmVscyA9IHNldHVwLmxhYmVscyA/IHNldHVwLmxhYmVscy5sZW5ndGggOiBJbmZpbml0eTtcbiAgICAgIGNvbnN0IG51bUNvb3JkaW5hdGVzID0gc2V0dXAuY29vcmRpbmF0ZXMgPyBzZXR1cC5jb29yZGluYXRlcy5sZW5ndGggOiBJbmZpbml0eTtcbiAgICAgIGNvbnN0IG51bVBvc2l0aW9ucyA9IE1hdGgubWluKG51bUxhYmVscywgbnVtQ29vcmRpbmF0ZXMpICogbWF4Q2xpZW50c1BlclBvc2l0aW9uO1xuXG4gICAgICBpZiAodGhpcy5jYXBhY2l0eSA+IG51bVBvc2l0aW9ucylcbiAgICAgICAgdGhpcy5jYXBhY2l0eSA9IG51bVBvc2l0aW9ucztcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jYXBhY2l0eSA+IG1heENhcGFjaXR5KVxuICAgICAgdGhpcy5jYXBhY2l0eSA9IG1heENhcGFjaXR5O1xuXG4gICAgLyoqXG4gICAgICogTGlzdCBvZiBjbGllbnRzIGNoZWNrZWQgaW4gd2l0aCBjb3JyZXNwb25kaW5nIGluZGljZXMuXG4gICAgICogQHR5cGUge09iamVjdDxOdW1iZXIsIEFycmF5Pn1cbiAgICAgKi9cbiAgICB0aGlzLmNsaWVudHMgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIE51bWJlciBvZiBjb25uZWN0ZWQgY2xpZW50cy5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMubnVtQ2xpZW50cyA9IDA7XG5cbiAgICAvKipcbiAgICAgKiBMaXN0IG9mIHRoZSBpbmRleGVzIG9mIHRoZSBkaXNhYmxlZCBwb3NpdGlvbnMuXG4gICAgICogQHR5cGUge0FycmF5fVxuICAgICAqL1xuICAgIHRoaXMuZGlzYWJsZWRQb3NpdGlvbnMgPSBbXTtcblxuICAgIC8vIHVwZGF0ZSBjb25maWcgY2FwYWNpdHkgd2l0aCBjb21wdXRlZCBvbmVcbiAgICB0aGlzLnNldHVwLmNhcGFjaXR5ID0gdGhpcy5jYXBhY2l0eTtcblxuICAgIC8vIGFkZCBwYXRoIHRvIHNoYXJlZCBjb25maWcgcmVxdWlyZW1lbnRzIGZvciBhbGwgY2xpZW50IHR5cGVcbiAgICB0aGlzLmNsaWVudFR5cGVzLmZvckVhY2goKGNsaWVudFR5cGUpID0+IHtcbiAgICAgIHRoaXMuX3NoYXJlZENvbmZpZy5zaGFyZSh0aGlzLm9wdGlvbnMuY29uZmlnSXRlbSwgY2xpZW50VHlwZSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICAvKipcbiAgICogU3RvcmUgdGhlIGNsaWVudCBpbiBhIGdpdmVuIHBvc2l0aW9uLlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zaXRpb25JbmRleCAtIEluZGV4IG9mIGNob3NlbiBwb3NpdGlvbi5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNsaWVudCAtIENsaWVudCBhc3NvY2lhdGVkIHRvIHRoZSBwb3NpdGlvbi5cbiAgICogQHJldHVybnMge0Jvb2xlYW59IC0gYHRydWVgIGlmIHN1Y2NlZWQsIGBmYWxzZWAgaWYgbm90LlxuICAgKi9cbiAgX3N0b3JlQ2xpZW50UG9zaXRpb24ocG9zaXRpb25JbmRleCwgY2xpZW50KSB7XG4gICAgaWYgKCF0aGlzLmNsaWVudHNbcG9zaXRpb25JbmRleF0pXG4gICAgICB0aGlzLmNsaWVudHNbcG9zaXRpb25JbmRleF0gPSBbXTtcblxuICAgIGNvbnN0IGxpc3QgPSB0aGlzLmNsaWVudHNbcG9zaXRpb25JbmRleF07XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPCB0aGlzLnNldHVwLm1heENsaWVudHNQZXJQb3NpdGlvbiAmJlxuICAgICAgICB0aGlzLm51bUNsaWVudHMgPCB0aGlzLmNhcGFjaXR5XG4gICAgKSB7XG4gICAgICBsaXN0LnB1c2goY2xpZW50KTtcbiAgICAgIHRoaXMubnVtQ2xpZW50cyArPSAxO1xuXG4gICAgICAvLyBpZiBsYXN0IGF2YWlsYWJsZSBwbGFjZSBmb3IgdGhpcyBwb3NpdGlvbiwgbG9jayBpdFxuICAgICAgaWYgKGxpc3QubGVuZ3RoID49IHRoaXMuc2V0dXAubWF4Q2xpZW50c1BlclBvc2l0aW9uKVxuICAgICAgICB0aGlzLmRpc2FibGVkUG9zaXRpb25zLnB1c2gocG9zaXRpb25JbmRleCk7XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgdGhlIGNsaWVudCBmcm9tIGEgZ2l2ZW4gcG9zaXRpb24uXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NpdGlvbkluZGV4IC0gSW5kZXggb2YgY2hvc2VuIHBvc2l0aW9uLlxuICAgKiBAcGFyYW0ge09iamVjdH0gY2xpZW50IC0gQ2xpZW50IGFzc29jaWF0ZWQgdG8gdGhlIHBvc2l0aW9uLlxuICAgKi9cbiAgX3JlbW92ZUNsaWVudFBvc2l0aW9uKHBvc2l0aW9uSW5kZXgsIGNsaWVudCkge1xuICAgIGNvbnN0IGxpc3QgPSB0aGlzLmNsaWVudHNbcG9zaXRpb25JbmRleF0gfHzCoFtdO1xuICAgIGNvbnN0IGNsaWVudEluZGV4ID0gbGlzdC5pbmRleE9mKGNsaWVudCk7XG5cbiAgICBpZiAoY2xpZW50SW5kZXggIT09IC0xKSB7XG4gICAgICBsaXN0LnNwbGljZShjbGllbnRJbmRleCwgMSk7XG4gICAgICAvLyBjaGVjayBpZiB0aGUgbGlzdCB3YXMgbWFya2VkIGFzIGRpc2FibGVkXG4gICAgICBpZiAobGlzdC5sZW5ndGggPCB0aGlzLnNldHVwLm1heENsaWVudHNQZXJQb3NpdGlvbikge1xuICAgICAgICBjb25zdCBkaXNhYmxlZEluZGV4ID0gdGhpcy5kaXNhYmxlZFBvc2l0aW9ucy5pbmRleE9mKHBvc2l0aW9uSW5kZXgpO1xuXG4gICAgICAgIGlmIChkaXNhYmxlZEluZGV4ICE9PSAtMSlcbiAgICAgICAgICB0aGlzLmRpc2FibGVkUG9zaXRpb25zLnNwbGljZShkaXNhYmxlZEluZGV4LCAxKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5udW1DbGllbnRzIC09IDE7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vblJlcXVlc3QoY2xpZW50KSB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGNvbnN0IGNvbmZpZ0l0ZW0gPSB0aGlzLm9wdGlvbnMuY29uZmlnSXRlbTtcbiAgICAgIGNvbnN0IGRpc2FibGVkUG9zaXRpb25zID0gdGhpcy5kaXNhYmxlZFBvc2l0aW9ucztcbiAgICAgIC8vIGFja25vd2xlZGdlXG4gICAgICBpZiAodGhpcy5udW1DbGllbnRzIDwgdGhpcy5zZXR1cC5jYXBhY2l0eSlcbiAgICAgICAgdGhpcy5zZW5kKGNsaWVudCwgJ2Frbm93bGVnZGUnLCBjb25maWdJdGVtLCBkaXNhYmxlZFBvc2l0aW9ucyk7XG4gICAgICBlbHNlXG4gICAgICAgIHRoaXMuc2VuZChjbGllbnQsICdyZWplY3QnLCBkaXNhYmxlZFBvc2l0aW9ucyk7XG4gICAgfTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25Qb3NpdGlvbihjbGllbnQpIHtcbiAgICByZXR1cm4gKGluZGV4LCBsYWJlbCwgY29vcmRpbmF0ZXMpID0+IHtcbiAgICAgIGNvbnN0IHN1Y2Nlc3MgPSB0aGlzLl9zdG9yZUNsaWVudFBvc2l0aW9uKGluZGV4LCBjbGllbnQpO1xuXG4gICAgICBpZiAoc3VjY2Vzcykge1xuICAgICAgICBjbGllbnQuaW5kZXggPSBpbmRleDtcbiAgICAgICAgY2xpZW50LmxhYmVsID0gbGFiZWw7XG4gICAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuXG4gICAgICAgIHRoaXMuc2VuZChjbGllbnQsICdjb25maXJtJywgaW5kZXgsIGxhYmVsLCBjb29yZGluYXRlcyk7XG4gICAgICAgIC8vIEB0b2RvIC0gY2hlY2sgaWYgc29tZXRoaW5nIG1vcmUgc3VidGlsZSB0aGFuIGEgYnJvYWRjYXN0IGNhbiBiZSBkb25lLlxuICAgICAgICB0aGlzLmJyb2FkY2FzdChudWxsLCBjbGllbnQsICdjbGllbnQtam9pbmVkJywgdGhpcy5kaXNhYmxlZFBvc2l0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNlbmQoY2xpZW50LCAncmVqZWN0JywgdGhpcy5kaXNhYmxlZFBvc2l0aW9ucyk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXF1ZXN0JywgdGhpcy5fb25SZXF1ZXN0KGNsaWVudCkpO1xuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdwb3NpdGlvbicsIHRoaXMuX29uUG9zaXRpb24oY2xpZW50KSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgZGlzY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5kaXNjb25uZWN0KGNsaWVudCk7XG5cbiAgICB0aGlzLl9yZW1vdmVDbGllbnRQb3NpdGlvbihjbGllbnQuaW5kZXgsIGNsaWVudCk7XG4gICAgLy8gQHRvZG8gLSBjaGVjayBpZiBzb21ldGhpbmcgbW9yZSBzdWJ0aWxlIHRoYW4gYSBicm9hZGNhc3QgY2FuIGJlIGRvbmUuXG4gICAgdGhpcy5icm9hZGNhc3QobnVsbCwgY2xpZW50LCAnY2xpZW50LWxlYXZlZCcsIHRoaXMuZGlzYWJsZWRQb3NpdGlvbnMpO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFBsYWNlcik7XG4iXX0=