'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isInteger = require('babel-runtime/core-js/number/is-integer');

var _isInteger2 = _interopRequireDefault(_isInteger);

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

var _helpers = require('../../utils/helpers');

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:checkin';

/**
 * Interface for the server `'checkin'` service.
 *
 * This service is one of the provided services aimed at identifying clients inside
 * the experience along with the [`'locator'`]{@link module:soundworks/server.Locator}
 * and [`'placer'`]{@link module:soundworks/server.Placer} services.
 *
 * The `'checkin'` service is the most simple among these services as the server
 * simply assigns a ticket to the client among the available ones. The ticket can
 * optionally be associated with coordinates or label according to the server
 * `setup` configuration.
 *
 * __*The service must be used with its [client-side counterpart]{@link module:soundworks/client.Checkin}*__
 *
 * @see {@link module:soundworks/server.Locator}
 * @see {@link module:soundworks/server.Placer}
 *
 * @param {Object} options
 * @param {Boolean}  [options.order='ascending'] - The order in which indices
 * are assigned. Currently supported values are:
 * - `'ascending'`: indices are assigned in ascending order
 * - `'random'`: indices are assigned in random order
 *
 * @memberof module:soundworks/server
 * @example
 * // inside the experience constructor
 * this.checkin = this.require('checkin');
 */

var Checkin = function (_Service) {
  (0, _inherits3.default)(Checkin, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */

  function Checkin() {
    (0, _classCallCheck3.default)(this, Checkin);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Checkin).call(this, SERVICE_ID));

    var defaults = {
      configItem: 'setup'
    };

    _this.configure(defaults);
    // use shared config service to share the setup
    _this._sharedConfig = _this.require('shared-config');
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(Checkin, [{
    key: 'start',
    value: function start() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Checkin.prototype), 'start', this).call(this);
      var configItem = this.options.configItem;

      /**
       * Setup retrieved from the server configuration.
       * @type {Object}
       */
      this.setup = this._sharedConfig.get(configItem);

      if (this.setup === null) throw new Error('"service:checkin": server.config.' + configItem + ' is not defined');

      /**
       * Maximum number of clients checked in (may limit or be limited by the
       * number of predefined labels and/or coordinates).
       * @type {Number}
       */
      this.capacity = (0, _helpers.getOpt)(this.setup && this.setup.capacity, Infinity, 1);

      /**
       * List of the clients checked in at their corresponding indices.
       * @type {Client[]}
       */
      this.clients = [];

      /** @private */
      this._availableIndices = []; // array of available indices
      this._nextAscendingIndex = 0; // next index when _availableIndices is empty

      var setup = this.options.setup;

      if (setup) {
        var numLabels = setup.labels ? setup.labels.length : Infinity;
        var numCoordinates = setup.coordinates ? setup.coordinates.length : Infinity;
        var numPositions = Math.min(numLabels, numCoordinates);

        if (this.capacity > numPositions) this.capacity = numPositions;
      }
    }

    /** @private */

  }, {
    key: '_getRandomIndex',
    value: function _getRandomIndex() {
      for (var i = this._nextAscendingIndex; i < this.capacity; i++) {
        this._availableIndices.push(i);
      }this._nextAscendingIndex = this.capacity;
      var numAvailable = this._availableIndices.length;

      if (numAvailable > 0) {
        var random = Math.floor(Math.random() * numAvailable);
        return this._availableIndices.splice(random, 1)[0];
      }

      return -1;
    }

    /** @private */

  }, {
    key: '_getAscendingIndex',
    value: function _getAscendingIndex() {
      if (this._availableIndices.length > 0) {
        this._availableIndices.sort(function (a, b) {
          return a - b;
        });

        return this._availableIndices.splice(0, 1)[0];
      } else if (this._nextAscendingIndex < this.capacity) {
        return this._nextAscendingIndex++;
      }

      return -1;
    }

    /** @private */

  }, {
    key: '_releaseIndex',
    value: function _releaseIndex(index) {
      if ((0, _isInteger2.default)(index)) this._availableIndices.push(index);
    }

    /** @private */

  }, {
    key: '_onRequest',
    value: function _onRequest(client) {
      var _this2 = this;

      return function (order) {
        var index = -1;

        if (order === 'random' && _this2.capacity !== Infinity) index = _this2._getRandomIndex();else // if (order === 'acsending')
          index = _this2._getAscendingIndex();

        client.index = index;

        if (index >= 0) {
          var setup = _this2.setup;
          var label = void 0;
          var coordinates = void 0;

          if (setup) {
            label = setup.labels ? setup.labels[index] : undefined;
            coordinates = setup.coordinates ? setup.coordinates[index] : undefined;

            client.label = label;
            client.coordinates = coordinates;
          }

          _this2.clients[index] = client;
          _this2.send(client, 'position', index, label, coordinates);
        } else {
          _this2.send(client, 'unavailable');
        }
      };
    }

    /** @private */

  }, {
    key: 'connect',
    value: function connect(client) {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Checkin.prototype), 'connect', this).call(this, client);

      this.receive(client, 'request', this._onRequest(client));
    }

    /** @private */

  }, {
    key: 'disconnect',
    value: function disconnect(client) {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Checkin.prototype), 'disconnect', this).call(this, client);

      var index = client.index;

      if (index >= 0) {
        delete this.clients[index];
        this._releaseIndex(index);
      }
    }
  }]);
  return Checkin;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, Checkin);

exports.default = Checkin;
//# sourceMappingURL=data:application/json;base64,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LFFBQVEsT0FBTyxLQUFyQjs7QUFFQSxVQUFJLFNBQVMsQ0FBYixFQUFnQjtBQUNkLGVBQU8sS0FBSyxPQUFMLENBQWEsS0FBYixDQUFQO0FBQ0EsYUFBSyxhQUFMLENBQW1CLEtBQW5CO0FBQ0Q7QUFDRjs7Ozs7QUFHSCx5QkFBZSxRQUFmLENBQXdCLFVBQXhCLEVBQW9DLE9BQXBDOztrQkFFZSxPIiwiZmlsZSI6IkNoZWNraW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHsgZ2V0T3B0IH0gZnJvbSAnLi4vLi4vdXRpbHMvaGVscGVycyc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpjaGVja2luJztcblxuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIHNlcnZlciBgJ2NoZWNraW4nYCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmljZSBpcyBvbmUgb2YgdGhlIHByb3ZpZGVkIHNlcnZpY2VzIGFpbWVkIGF0IGlkZW50aWZ5aW5nIGNsaWVudHMgaW5zaWRlXG4gKiB0aGUgZXhwZXJpZW5jZSBhbG9uZyB3aXRoIHRoZSBbYCdsb2NhdG9yJ2Bde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5Mb2NhdG9yfVxuICogYW5kIFtgJ3BsYWNlcidgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuUGxhY2VyfSBzZXJ2aWNlcy5cbiAqXG4gKiBUaGUgYCdjaGVja2luJ2Agc2VydmljZSBpcyB0aGUgbW9zdCBzaW1wbGUgYW1vbmcgdGhlc2Ugc2VydmljZXMgYXMgdGhlIHNlcnZlclxuICogc2ltcGx5IGFzc2lnbnMgYSB0aWNrZXQgdG8gdGhlIGNsaWVudCBhbW9uZyB0aGUgYXZhaWxhYmxlIG9uZXMuIFRoZSB0aWNrZXQgY2FuXG4gKiBvcHRpb25hbGx5IGJlIGFzc29jaWF0ZWQgd2l0aCBjb29yZGluYXRlcyBvciBsYWJlbCBhY2NvcmRpbmcgdG8gdGhlIHNlcnZlclxuICogYHNldHVwYCBjb25maWd1cmF0aW9uLlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIG11c3QgYmUgdXNlZCB3aXRoIGl0cyBbY2xpZW50LXNpZGUgY291bnRlcnBhcnRde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DaGVja2lufSpfX1xuICpcbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5Mb2NhdG9yfVxuICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLlBsYWNlcn1cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtCb29sZWFufSAgW29wdGlvbnMub3JkZXI9J2FzY2VuZGluZyddIC0gVGhlIG9yZGVyIGluIHdoaWNoIGluZGljZXNcbiAqIGFyZSBhc3NpZ25lZC4gQ3VycmVudGx5IHN1cHBvcnRlZCB2YWx1ZXMgYXJlOlxuICogLSBgJ2FzY2VuZGluZydgOiBpbmRpY2VzIGFyZSBhc3NpZ25lZCBpbiBhc2NlbmRpbmcgb3JkZXJcbiAqIC0gYCdyYW5kb20nYDogaW5kaWNlcyBhcmUgYXNzaWduZWQgaW4gcmFuZG9tIG9yZGVyXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlclxuICogQGV4YW1wbGVcbiAqIC8vIGluc2lkZSB0aGUgZXhwZXJpZW5jZSBjb25zdHJ1Y3RvclxuICogdGhpcy5jaGVja2luID0gdGhpcy5yZXF1aXJlKCdjaGVja2luJyk7XG4gKi9cbmNsYXNzIENoZWNraW4gZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFuY2lhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lEKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgY29uZmlnSXRlbTogJ3NldHVwJyxcbiAgICB9XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG4gICAgLy8gdXNlIHNoYXJlZCBjb25maWcgc2VydmljZSB0byBzaGFyZSB0aGUgc2V0dXBcbiAgICB0aGlzLl9zaGFyZWRDb25maWcgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1jb25maWcnKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuICAgIGNvbnN0IGNvbmZpZ0l0ZW0gPSB0aGlzLm9wdGlvbnMuY29uZmlnSXRlbTtcblxuICAgIC8qKlxuICAgICAqIFNldHVwIHJldHJpZXZlZCBmcm9tIHRoZSBzZXJ2ZXIgY29uZmlndXJhdGlvbi5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuc2V0dXAgPSB0aGlzLl9zaGFyZWRDb25maWcuZ2V0KGNvbmZpZ0l0ZW0pO1xuXG4gICAgaWYgKHRoaXMuc2V0dXAgPT09IG51bGwpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFwic2VydmljZTpjaGVja2luXCI6IHNlcnZlci5jb25maWcuJHtjb25maWdJdGVtfSBpcyBub3QgZGVmaW5lZGApO1xuXG4gICAgLyoqXG4gICAgICogTWF4aW11bSBudW1iZXIgb2YgY2xpZW50cyBjaGVja2VkIGluIChtYXkgbGltaXQgb3IgYmUgbGltaXRlZCBieSB0aGVcbiAgICAgKiBudW1iZXIgb2YgcHJlZGVmaW5lZCBsYWJlbHMgYW5kL29yIGNvb3JkaW5hdGVzKS5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuY2FwYWNpdHkgPSBnZXRPcHQodGhpcy5zZXR1cCAmJiB0aGlzLnNldHVwLmNhcGFjaXR5LCBJbmZpbml0eSwgMSk7XG5cbiAgICAvKipcbiAgICAgKiBMaXN0IG9mIHRoZSBjbGllbnRzIGNoZWNrZWQgaW4gYXQgdGhlaXIgY29ycmVzcG9uZGluZyBpbmRpY2VzLlxuICAgICAqIEB0eXBlIHtDbGllbnRbXX1cbiAgICAgKi9cbiAgICB0aGlzLmNsaWVudHMgPSBbXTtcblxuICAgIC8qKiBAcHJpdmF0ZSAqL1xuICAgIHRoaXMuX2F2YWlsYWJsZUluZGljZXMgPSBbXTsgLy8gYXJyYXkgb2YgYXZhaWxhYmxlIGluZGljZXNcbiAgICB0aGlzLl9uZXh0QXNjZW5kaW5nSW5kZXggPSAwOyAvLyBuZXh0IGluZGV4IHdoZW4gX2F2YWlsYWJsZUluZGljZXMgaXMgZW1wdHlcblxuICAgIGNvbnN0IHNldHVwID0gdGhpcy5vcHRpb25zLnNldHVwO1xuXG4gICAgaWYgKHNldHVwKSB7XG4gICAgICBjb25zdCBudW1MYWJlbHMgPSBzZXR1cC5sYWJlbHMgPyBzZXR1cC5sYWJlbHMubGVuZ3RoIDogSW5maW5pdHk7XG4gICAgICBjb25zdCBudW1Db29yZGluYXRlcyA9IHNldHVwLmNvb3JkaW5hdGVzID8gc2V0dXAuY29vcmRpbmF0ZXMubGVuZ3RoIDogSW5maW5pdHk7XG4gICAgICBjb25zdCBudW1Qb3NpdGlvbnMgPSBNYXRoLm1pbihudW1MYWJlbHMsIG51bUNvb3JkaW5hdGVzKTtcblxuICAgICAgaWYgKHRoaXMuY2FwYWNpdHkgPiBudW1Qb3NpdGlvbnMpXG4gICAgICAgIHRoaXMuY2FwYWNpdHkgPSBudW1Qb3NpdGlvbnM7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9nZXRSYW5kb21JbmRleCgpIHtcbiAgICBmb3IgKGxldCBpID0gdGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4OyBpIDwgdGhpcy5jYXBhY2l0eTsgaSsrKVxuICAgICAgdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5wdXNoKGkpO1xuXG4gICAgdGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4ID0gdGhpcy5jYXBhY2l0eTtcbiAgICBjb25zdCBudW1BdmFpbGFibGUgPSB0aGlzLl9hdmFpbGFibGVJbmRpY2VzLmxlbmd0aDtcblxuICAgIGlmIChudW1BdmFpbGFibGUgPiAwKSB7XG4gICAgICBjb25zdCByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBudW1BdmFpbGFibGUpO1xuICAgICAgcmV0dXJuIHRoaXMuX2F2YWlsYWJsZUluZGljZXMuc3BsaWNlKHJhbmRvbSwgMSlbMF07XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9nZXRBc2NlbmRpbmdJbmRleCgpIHtcbiAgICBpZiAodGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLl9hdmFpbGFibGVJbmRpY2VzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICByZXR1cm4gYSAtIGI7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHRoaXMuX2F2YWlsYWJsZUluZGljZXMuc3BsaWNlKDAsIDEpWzBdO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4IDwgdGhpcy5jYXBhY2l0eSkge1xuICAgICAgcmV0dXJuIHRoaXMuX25leHRBc2NlbmRpbmdJbmRleCsrO1xuICAgIH1cblxuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfcmVsZWFzZUluZGV4KGluZGV4KSB7XG4gICAgaWYgKE51bWJlci5pc0ludGVnZXIoaW5kZXgpKVxuICAgICAgdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5wdXNoKGluZGV4KTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25SZXF1ZXN0KGNsaWVudCkge1xuICAgIHJldHVybiAob3JkZXIpID0+IHtcbiAgICAgIGxldCBpbmRleCA9IC0xO1xuXG4gICAgICBpZiAob3JkZXIgPT09ICdyYW5kb20nICYmIHRoaXMuY2FwYWNpdHkgIT09IEluZmluaXR5KVxuICAgICAgICBpbmRleCA9IHRoaXMuX2dldFJhbmRvbUluZGV4KCk7XG4gICAgICBlbHNlIC8vIGlmIChvcmRlciA9PT0gJ2Fjc2VuZGluZycpXG4gICAgICAgIGluZGV4ID0gdGhpcy5fZ2V0QXNjZW5kaW5nSW5kZXgoKTtcblxuICAgICAgY2xpZW50LmluZGV4ID0gaW5kZXg7XG5cbiAgICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgIGNvbnN0IHNldHVwID0gdGhpcy5zZXR1cDtcbiAgICAgICAgbGV0IGxhYmVsO1xuICAgICAgICBsZXQgY29vcmRpbmF0ZXM7XG5cbiAgICAgICAgaWYgKHNldHVwKSB7XG4gICAgICAgICAgbGFiZWwgPSBzZXR1cC5sYWJlbHMgPyBzZXR1cC5sYWJlbHNbaW5kZXhdIDogdW5kZWZpbmVkO1xuICAgICAgICAgIGNvb3JkaW5hdGVzID0gc2V0dXAuY29vcmRpbmF0ZXMgPyBzZXR1cC5jb29yZGluYXRlc1tpbmRleF0gOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgICBjbGllbnQubGFiZWwgPSBsYWJlbDtcbiAgICAgICAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2xpZW50c1tpbmRleF0gPSBjbGllbnQ7XG4gICAgICAgIHRoaXMuc2VuZChjbGllbnQsICdwb3NpdGlvbicsIGluZGV4LCBsYWJlbCwgY29vcmRpbmF0ZXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZW5kKGNsaWVudCwgJ3VuYXZhaWxhYmxlJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3JlcXVlc3QnLCB0aGlzLl9vblJlcXVlc3QoY2xpZW50KSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgZGlzY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5kaXNjb25uZWN0KGNsaWVudCk7XG5cbiAgICBjb25zdCBpbmRleCA9IGNsaWVudC5pbmRleDtcblxuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICBkZWxldGUgdGhpcy5jbGllbnRzW2luZGV4XTtcbiAgICAgIHRoaXMuX3JlbGVhc2VJbmRleChpbmRleCk7XG4gICAgfVxuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIENoZWNraW4pO1xuXG5leHBvcnQgZGVmYXVsdCBDaGVja2luO1xuIl19