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

var _ServerActivity2 = require('../core/ServerActivity');

var _ServerActivity3 = _interopRequireDefault(_ServerActivity2);

var _helpers = require('../../utils/helpers');

var _serverServiceManager = require('../core/serverServiceManager');

var _serverServiceManager2 = _interopRequireDefault(_serverServiceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:checkin';

/**
 * Assign places among a set of predefined positions (i.e. labels and/or coordinates).
 *
 * The module assigns a position to a client upon request of the client-side module.
 *
 * (See also {@link src/client/ClientCheckin.js~ClientCheckin} on the client side.)
 *
 * @example
 * const checkin = new ServerCheckin({ capacity: 100, order: 'random' });
 */

var ServerCheckin = function (_ServerActivity) {
  (0, _inherits3.default)(ServerCheckin, _ServerActivity);

  /**
   * @param {Object} [options={}] Options.
   * @attribute {String} [defaults.setupConfigItem='setup'] - The path to the server's
   *  setup configuration entry (see {@link src/server/core/server.js~appConfig} for details).
   * @param {Object} [options.order='ascending'] - The order in which indices are assigned.
   *  Currently supported values are:
   * - `'ascending'`: indices are assigned in ascending order
   * - `'random'`: indices are assigned in random order
   */

  function ServerCheckin() {
    (0, _classCallCheck3.default)(this, ServerCheckin);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ServerCheckin).call(this, SERVICE_ID));

    var defaults = {
      order: 'ascending',
      setupConfigItem: 'setup'
    };

    _this.configure(defaults);

    // use shared config service to share the setup
    _this._sharedConfigService = _this.require('shared-config');
    return _this;
  }

  (0, _createClass3.default)(ServerCheckin, [{
    key: 'start',
    value: function start() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(ServerCheckin.prototype), 'start', this).call(this);

      /**
       * Setup defining predefined positions (labels and/or coordinates).
       * @type {Object}
       */
      this.setup = this._sharedConfigService.get(this.options.setupConfigItem);

      /**
       * Maximum number of clients checked in (may limit or be limited by the number of predefined labels and/or coordinates).
       * @type {Number}
       */
      this.capacity = (0, _helpers.getOpt)(this.setup.capacity, Infinity, 1);

      /**
       * List of the clients checked in with corresponing indices.
       * @type {Client[]}
       */
      this.clients = [];

      /**
       * Order in which indices are assigned. Currently supported values are:
       * - `'ascending'`: assigns indices in ascending order;
       * - `'random'`: assigns indices in random order.
       * @type {[type]}
       */
      this.order = this.options; // 'ascending' | 'random'

      this._availableIndices = [];
      this._nextAscendingIndex = 0;

      var setup = this.options.setup;

      if (setup) {
        var numLabels = setup.labels ? setup.labels.length : Infinity;
        var numCoordinates = setup.coordinates ? setup.coordinates.length : Infinity;
        var numPositions = Math.min(numLabels, numCoordinates);

        if (this.capacity > numPositions) this.capacity = numPositions;
      }

      if (this.capacity === Infinity) this.order = 'ascending';else if (this.order === 'random') {
        this._nextAscendingIndex = this.capacity;

        for (var i = 0; i < this.capacity; i++) {
          this._availableIndices.push(i);
        }
      }
    }
  }, {
    key: '_getRandomIndex',
    value: function _getRandomIndex() {
      var numAvailable = this._availableIndices.length;

      if (numAvailable > 0) {
        var random = Math.floor(Math.random() * numAvailable);
        return this._availableIndices.splice(random, 1)[0];
      }

      return -1;
    }
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
  }, {
    key: '_releaseIndex',
    value: function _releaseIndex(index) {
      if ((0, _isInteger2.default)(index)) this._availableIndices.push(index);
    }
  }, {
    key: '_onRequest',
    value: function _onRequest(client) {
      var _this2 = this;

      return function () {
        var index = -1;

        if (_this2.order === 'random') index = _this2._getRandomIndex();else // if (order === 'acsending')
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

    /** @inheritdoc */

  }, {
    key: 'connect',
    value: function connect(client) {
      (0, _get3.default)((0, _getPrototypeOf2.default)(ServerCheckin.prototype), 'connect', this).call(this, client);

      this.receive(client, 'request', this._onRequest(client));
    }

    /** @inheritdoc */

  }, {
    key: 'disconnect',
    value: function disconnect(client) {
      (0, _get3.default)((0, _getPrototypeOf2.default)(ServerCheckin.prototype), 'disconnect', this).call(this, client);

      var index = client.index;

      if (index >= 0) {
        delete this.clients[index];
        this._releaseIndex(index);
      }
    }
  }]);
  return ServerCheckin;
}(_ServerActivity3.default);

_serverServiceManager2.default.register(SERVICE_ID, ServerCheckin);

exports.default = ServerCheckin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlcnZlckNoZWNraW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBLElBQU0sYUFBYSxpQkFBYjs7Ozs7Ozs7Ozs7OztJQVlBOzs7Ozs7Ozs7Ozs7O0FBVUosV0FWSSxhQVVKLEdBQWM7d0NBVlYsZUFVVTs7NkZBVlYsMEJBV0ksYUFETTs7QUFHWixRQUFNLFdBQVc7QUFDZixhQUFPLFdBQVA7QUFDQSx1QkFBaUIsT0FBakI7S0FGSSxDQUhNOztBQVFaLFVBQUssU0FBTCxDQUFlLFFBQWY7OztBQVJZLFNBV1osQ0FBSyxvQkFBTCxHQUE0QixNQUFLLE9BQUwsQ0FBYSxlQUFiLENBQTVCLENBWFk7O0dBQWQ7OzZCQVZJOzs0QkF3Qkk7QUFDTix1REF6QkUsbURBeUJGOzs7Ozs7QUFETSxVQU9OLENBQUssS0FBTCxHQUFhLEtBQUssb0JBQUwsQ0FBMEIsR0FBMUIsQ0FBOEIsS0FBSyxPQUFMLENBQWEsZUFBYixDQUEzQzs7Ozs7O0FBUE0sVUFhTixDQUFLLFFBQUwsR0FBZ0IscUJBQU8sS0FBSyxLQUFMLENBQVcsUUFBWCxFQUFxQixRQUE1QixFQUFzQyxDQUF0QyxDQUFoQjs7Ozs7O0FBYk0sVUFtQk4sQ0FBSyxPQUFMLEdBQWUsRUFBZjs7Ozs7Ozs7QUFuQk0sVUEyQk4sQ0FBSyxLQUFMLEdBQWEsS0FBSyxPQUFMOztBQTNCUCxVQTZCTixDQUFLLGlCQUFMLEdBQXlCLEVBQXpCLENBN0JNO0FBOEJOLFdBQUssbUJBQUwsR0FBMkIsQ0FBM0IsQ0E5Qk07O0FBZ0NOLFVBQU0sUUFBUSxLQUFLLE9BQUwsQ0FBYSxLQUFiLENBaENSOztBQWtDTixVQUFJLEtBQUosRUFBVztBQUNULFlBQU0sWUFBWSxNQUFNLE1BQU4sR0FBZSxNQUFNLE1BQU4sQ0FBYSxNQUFiLEdBQXNCLFFBQXJDLENBRFQ7QUFFVCxZQUFNLGlCQUFpQixNQUFNLFdBQU4sR0FB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LGFBQWxCLEVBREs7U0FmUDtPQVZLLENBRFU7Ozs7Ozs7NEJBa0NYLFFBQVE7QUFDZCx1REE5SUUsc0RBOElZLE9BQWQsQ0FEYzs7QUFHZCxXQUFLLE9BQUwsQ0FBYSxNQUFiLEVBQXFCLFNBQXJCLEVBQWdDLEtBQUssVUFBTCxDQUFnQixNQUFoQixDQUFoQyxFQUhjOzs7Ozs7OytCQU9MLFFBQVE7QUFDakIsdURBckpFLHlEQXFKZSxPQUFqQixDQURpQjs7QUFHakIsVUFBTSxRQUFRLE9BQU8sS0FBUCxDQUhHOztBQUtqQixVQUFJLFNBQVMsQ0FBVCxFQUFZO0FBQ2QsZUFBTyxLQUFLLE9BQUwsQ0FBYSxLQUFiLENBQVAsQ0FEYztBQUVkLGFBQUssYUFBTCxDQUFtQixLQUFuQixFQUZjO09BQWhCOzs7U0F6SkU7OztBQWdLTiwrQkFBcUIsUUFBckIsQ0FBOEIsVUFBOUIsRUFBMEMsYUFBMUM7O2tCQUVlIiwiZmlsZSI6IlNlcnZlckNoZWNraW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmVyQWN0aXZpdHkgZnJvbSAnLi4vY29yZS9TZXJ2ZXJBY3Rpdml0eSc7XG5pbXBvcnQgeyBnZXRPcHQgfSBmcm9tICcuLi8uLi91dGlscy9oZWxwZXJzJztcbmltcG9ydCBzZXJ2ZXJTZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZlclNlcnZpY2VNYW5hZ2VyJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOmNoZWNraW4nO1xuXG4vKipcbiAqIEFzc2lnbiBwbGFjZXMgYW1vbmcgYSBzZXQgb2YgcHJlZGVmaW5lZCBwb3NpdGlvbnMgKGkuZS4gbGFiZWxzIGFuZC9vciBjb29yZGluYXRlcykuXG4gKlxuICogVGhlIG1vZHVsZSBhc3NpZ25zIGEgcG9zaXRpb24gdG8gYSBjbGllbnQgdXBvbiByZXF1ZXN0IG9mIHRoZSBjbGllbnQtc2lkZSBtb2R1bGUuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvY2xpZW50L0NsaWVudENoZWNraW4uanN+Q2xpZW50Q2hlY2tpbn0gb24gdGhlIGNsaWVudCBzaWRlLilcbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgY2hlY2tpbiA9IG5ldyBTZXJ2ZXJDaGVja2luKHsgY2FwYWNpdHk6IDEwMCwgb3JkZXI6ICdyYW5kb20nIH0pO1xuICovXG5jbGFzcyBTZXJ2ZXJDaGVja2luIGV4dGVuZHMgU2VydmVyQWN0aXZpdHkge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAYXR0cmlidXRlIHtTdHJpbmd9IFtkZWZhdWx0cy5zZXR1cENvbmZpZ0l0ZW09J3NldHVwJ10gLSBUaGUgcGF0aCB0byB0aGUgc2VydmVyJ3NcbiAgICogIHNldHVwIGNvbmZpZ3VyYXRpb24gZW50cnkgKHNlZSB7QGxpbmsgc3JjL3NlcnZlci9jb3JlL3NlcnZlci5qc35hcHBDb25maWd9IGZvciBkZXRhaWxzKS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLm9yZGVyPSdhc2NlbmRpbmcnXSAtIFRoZSBvcmRlciBpbiB3aGljaCBpbmRpY2VzIGFyZSBhc3NpZ25lZC5cbiAgICogIEN1cnJlbnRseSBzdXBwb3J0ZWQgdmFsdWVzIGFyZTpcbiAgICogLSBgJ2FzY2VuZGluZydgOiBpbmRpY2VzIGFyZSBhc3NpZ25lZCBpbiBhc2NlbmRpbmcgb3JkZXJcbiAgICogLSBgJ3JhbmRvbSdgOiBpbmRpY2VzIGFyZSBhc3NpZ25lZCBpbiByYW5kb20gb3JkZXJcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBvcmRlcjogJ2FzY2VuZGluZycsXG4gICAgICBzZXR1cENvbmZpZ0l0ZW06ICdzZXR1cCcsXG4gICAgfVxuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgLy8gdXNlIHNoYXJlZCBjb25maWcgc2VydmljZSB0byBzaGFyZSB0aGUgc2V0dXBcbiAgICB0aGlzLl9zaGFyZWRDb25maWdTZXJ2aWNlID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtY29uZmlnJyk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgLyoqXG4gICAgICogU2V0dXAgZGVmaW5pbmcgcHJlZGVmaW5lZCBwb3NpdGlvbnMgKGxhYmVscyBhbmQvb3IgY29vcmRpbmF0ZXMpLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5zZXR1cCA9IHRoaXMuX3NoYXJlZENvbmZpZ1NlcnZpY2UuZ2V0KHRoaXMub3B0aW9ucy5zZXR1cENvbmZpZ0l0ZW0pO1xuXG4gICAgLyoqXG4gICAgICogTWF4aW11bSBudW1iZXIgb2YgY2xpZW50cyBjaGVja2VkIGluIChtYXkgbGltaXQgb3IgYmUgbGltaXRlZCBieSB0aGUgbnVtYmVyIG9mIHByZWRlZmluZWQgbGFiZWxzIGFuZC9vciBjb29yZGluYXRlcykuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmNhcGFjaXR5ID0gZ2V0T3B0KHRoaXMuc2V0dXAuY2FwYWNpdHksIEluZmluaXR5LCAxKTtcblxuICAgIC8qKlxuICAgICAqIExpc3Qgb2YgdGhlIGNsaWVudHMgY2hlY2tlZCBpbiB3aXRoIGNvcnJlc3BvbmluZyBpbmRpY2VzLlxuICAgICAqIEB0eXBlIHtDbGllbnRbXX1cbiAgICAgKi9cbiAgICB0aGlzLmNsaWVudHMgPSBbXTtcblxuICAgIC8qKlxuICAgICAqIE9yZGVyIGluIHdoaWNoIGluZGljZXMgYXJlIGFzc2lnbmVkLiBDdXJyZW50bHkgc3VwcG9ydGVkIHZhbHVlcyBhcmU6XG4gICAgICogLSBgJ2FzY2VuZGluZydgOiBhc3NpZ25zIGluZGljZXMgaW4gYXNjZW5kaW5nIG9yZGVyO1xuICAgICAqIC0gYCdyYW5kb20nYDogYXNzaWducyBpbmRpY2VzIGluIHJhbmRvbSBvcmRlci5cbiAgICAgKiBAdHlwZSB7W3R5cGVdfVxuICAgICAqL1xuICAgIHRoaXMub3JkZXIgPSB0aGlzLm9wdGlvbnM7IC8vICdhc2NlbmRpbmcnIHwgJ3JhbmRvbSdcblxuICAgIHRoaXMuX2F2YWlsYWJsZUluZGljZXMgPSBbXTtcbiAgICB0aGlzLl9uZXh0QXNjZW5kaW5nSW5kZXggPSAwO1xuXG4gICAgY29uc3Qgc2V0dXAgPSB0aGlzLm9wdGlvbnMuc2V0dXA7XG5cbiAgICBpZiAoc2V0dXApIHtcbiAgICAgIGNvbnN0IG51bUxhYmVscyA9IHNldHVwLmxhYmVscyA/IHNldHVwLmxhYmVscy5sZW5ndGggOiBJbmZpbml0eTtcbiAgICAgIGNvbnN0IG51bUNvb3JkaW5hdGVzID0gc2V0dXAuY29vcmRpbmF0ZXMgPyBzZXR1cC5jb29yZGluYXRlcy5sZW5ndGggOiBJbmZpbml0eTtcbiAgICAgIGNvbnN0IG51bVBvc2l0aW9ucyA9IE1hdGgubWluKG51bUxhYmVscywgbnVtQ29vcmRpbmF0ZXMpO1xuXG4gICAgICBpZiAodGhpcy5jYXBhY2l0eSA+IG51bVBvc2l0aW9ucylcbiAgICAgICAgdGhpcy5jYXBhY2l0eSA9IG51bVBvc2l0aW9ucztcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jYXBhY2l0eSA9PT0gSW5maW5pdHkpXG4gICAgICB0aGlzLm9yZGVyID0gJ2FzY2VuZGluZyc7XG4gICAgZWxzZSBpZiAodGhpcy5vcmRlciA9PT0gJ3JhbmRvbScpIHtcbiAgICAgIHRoaXMuX25leHRBc2NlbmRpbmdJbmRleCA9IHRoaXMuY2FwYWNpdHk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jYXBhY2l0eTsgaSsrKVxuICAgICAgICB0aGlzLl9hdmFpbGFibGVJbmRpY2VzLnB1c2goaSk7XG4gICAgfVxuICB9XG5cbiAgX2dldFJhbmRvbUluZGV4KCkge1xuICAgIGNvbnN0IG51bUF2YWlsYWJsZSA9IHRoaXMuX2F2YWlsYWJsZUluZGljZXMubGVuZ3RoO1xuXG4gICAgaWYgKG51bUF2YWlsYWJsZSA+IDApIHtcbiAgICAgIGNvbnN0IHJhbmRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG51bUF2YWlsYWJsZSk7XG4gICAgICByZXR1cm4gdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5zcGxpY2UocmFuZG9tLCAxKVswXTtcbiAgICB9XG5cbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICBfZ2V0QXNjZW5kaW5nSW5kZXgoKSB7XG4gICAgaWYgKHRoaXMuX2F2YWlsYWJsZUluZGljZXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGEgLSBiO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiB0aGlzLl9hdmFpbGFibGVJbmRpY2VzLnNwbGljZSgwLCAxKVswXTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX25leHRBc2NlbmRpbmdJbmRleCA8IHRoaXMuY2FwYWNpdHkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9uZXh0QXNjZW5kaW5nSW5kZXgrKztcbiAgICB9XG5cbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICBfcmVsZWFzZUluZGV4KGluZGV4KSB7XG4gICAgaWYgKE51bWJlci5pc0ludGVnZXIoaW5kZXgpKVxuICAgICAgdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5wdXNoKGluZGV4KTtcbiAgfVxuXG4gIF9vblJlcXVlc3QoY2xpZW50KSB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGxldCBpbmRleCA9IC0xO1xuXG4gICAgICBpZiAodGhpcy5vcmRlciA9PT0gJ3JhbmRvbScpXG4gICAgICAgIGluZGV4ID0gdGhpcy5fZ2V0UmFuZG9tSW5kZXgoKTtcbiAgICAgIGVsc2UgLy8gaWYgKG9yZGVyID09PSAnYWNzZW5kaW5nJylcbiAgICAgICAgaW5kZXggPSB0aGlzLl9nZXRBc2NlbmRpbmdJbmRleCgpO1xuXG4gICAgICBjbGllbnQuaW5kZXggPSBpbmRleDtcblxuICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgY29uc3Qgc2V0dXAgPSB0aGlzLnNldHVwO1xuICAgICAgICBsZXQgbGFiZWw7XG4gICAgICAgIGxldCBjb29yZGluYXRlcztcblxuICAgICAgICBpZiAoc2V0dXApIHtcbiAgICAgICAgICBsYWJlbCA9IHNldHVwLmxhYmVscyA/IHNldHVwLmxhYmVsc1tpbmRleF0gOiB1bmRlZmluZWQ7XG4gICAgICAgICAgY29vcmRpbmF0ZXMgPSBzZXR1cC5jb29yZGluYXRlcyA/IHNldHVwLmNvb3JkaW5hdGVzW2luZGV4XSA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgIGNsaWVudC5sYWJlbCA9IGxhYmVsO1xuICAgICAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jbGllbnRzW2luZGV4XSA9IGNsaWVudDtcbiAgICAgICAgdGhpcy5zZW5kKGNsaWVudCwgJ3Bvc2l0aW9uJywgaW5kZXgsIGxhYmVsLCBjb29yZGluYXRlcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNlbmQoY2xpZW50LCAndW5hdmFpbGFibGUnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXF1ZXN0JywgdGhpcy5fb25SZXF1ZXN0KGNsaWVudCkpO1xuICB9XG5cbiAgLyoqIEBpbmhlcml0ZG9jICovXG4gIGRpc2Nvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuZGlzY29ubmVjdChjbGllbnQpO1xuXG4gICAgY29uc3QgaW5kZXggPSBjbGllbnQuaW5kZXg7XG5cbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgZGVsZXRlIHRoaXMuY2xpZW50c1tpbmRleF07XG4gICAgICB0aGlzLl9yZWxlYXNlSW5kZXgoaW5kZXgpO1xuICAgIH1cbiAgfVxufVxuXG5zZXJ2ZXJTZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBTZXJ2ZXJDaGVja2luKTtcblxuZXhwb3J0IGRlZmF1bHQgU2VydmVyQ2hlY2tpbjtcbiJdfQ==