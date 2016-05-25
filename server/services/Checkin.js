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

var _Activity2 = require('../core/Activity');

var _Activity3 = _interopRequireDefault(_Activity2);

var _helpers = require('../../utils/helpers');

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:checkin';

/**
 * Interface of the server `'checkin'` service.
 *
 * This service is one of the provided services aimed at identifying clients inside
 * the experience along with the [`'locator'`]{@link module:soundworks/server.Locator}
 * and [`'placer'`]{@link module:soundworks/server.Placer} services.
 *
 * The `'checkin'` service is the more simple among these services as the server
 * simply assign a ticket to the client among the available ones. The ticket can
 * optionnaly be associated with coordinates or label according to the server
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

var Checkin = function (_Activity) {
  (0, _inherits3.default)(Checkin, _Activity);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */

  function Checkin() {
    (0, _classCallCheck3.default)(this, Checkin);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Checkin).call(this, SERVICE_ID));

    var defaults = {
      order: 'ascending',
      setupConfigItem: 'setup'
    };

    _this.configure(defaults);
    // use shared config service to share the setup
    _this._sharedConfigService = _this.require('shared-config');
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(Checkin, [{
    key: 'start',
    value: function start() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Checkin.prototype), 'start', this).call(this);

      /**
       * Setup retrieved from server configuration.
       * @type {Object}
       */
      this.setup = this._sharedConfigService.get(this.options.setupConfigItem);

      /**
       * Maximum number of clients checked in (may limit or be limited by the
       * number of predefined labels and/or coordinates).
       * @type {Number}
       */
      this.capacity = (0, _helpers.getOpt)(this.setup.capacity, Infinity, 1);

      /**
       * List of the clients checked in at their corresponding indices.
       * @type {Client[]}
       */
      this.clients = [];

      /** @private */
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

    /** @private */

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
}(_Activity3.default);

_serviceManager2.default.register(SERVICE_ID, Checkin);

exports.default = Checkin;
//# sourceMappingURL=data:application/json;base64,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akI7O0FBRUEsVUFBTSxRQUFRLE9BQU8sS0FBckI7O0FBRUEsVUFBSSxTQUFTLENBQWIsRUFBZ0I7QUFDZCxlQUFPLEtBQUssT0FBTCxDQUFhLEtBQWIsQ0FBUDtBQUNBLGFBQUssYUFBTCxDQUFtQixLQUFuQjtBQUNEO0FBQ0Y7Ozs7O0FBR0gseUJBQWUsUUFBZixDQUF3QixVQUF4QixFQUFvQyxPQUFwQzs7a0JBRWUsTyIsImZpbGUiOiJDaGVja2luLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFjdGl2aXR5IGZyb20gJy4uL2NvcmUvQWN0aXZpdHknO1xuaW1wb3J0IHsgZ2V0T3B0IH0gZnJvbSAnLi4vLi4vdXRpbHMvaGVscGVycyc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpjaGVja2luJztcblxuXG4vKipcbiAqIEludGVyZmFjZSBvZiB0aGUgc2VydmVyIGAnY2hlY2tpbidgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGlzIG9uZSBvZiB0aGUgcHJvdmlkZWQgc2VydmljZXMgYWltZWQgYXQgaWRlbnRpZnlpbmcgY2xpZW50cyBpbnNpZGVcbiAqIHRoZSBleHBlcmllbmNlIGFsb25nIHdpdGggdGhlIFtgJ2xvY2F0b3InYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLkxvY2F0b3J9XG4gKiBhbmQgW2AncGxhY2VyJ2Bde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5QbGFjZXJ9IHNlcnZpY2VzLlxuICpcbiAqIFRoZSBgJ2NoZWNraW4nYCBzZXJ2aWNlIGlzIHRoZSBtb3JlIHNpbXBsZSBhbW9uZyB0aGVzZSBzZXJ2aWNlcyBhcyB0aGUgc2VydmVyXG4gKiBzaW1wbHkgYXNzaWduIGEgdGlja2V0IHRvIHRoZSBjbGllbnQgYW1vbmcgdGhlIGF2YWlsYWJsZSBvbmVzLiBUaGUgdGlja2V0IGNhblxuICogb3B0aW9ubmFseSBiZSBhc3NvY2lhdGVkIHdpdGggY29vcmRpbmF0ZXMgb3IgbGFiZWwgYWNjb3JkaW5nIHRvIHRoZSBzZXJ2ZXJcbiAqIGBzZXR1cGAgY29uZmlndXJhdGlvbi5cbiAqXG4gKiBfXypUaGUgc2VydmljZSBtdXN0IGJlIHVzZWQgd2l0aCBpdHMgW2NsaWVudC1zaWRlIGNvdW50ZXJwYXJ0XXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2hlY2tpbn0qX19cbiAqXG4gKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuTG9jYXRvcn1cbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5QbGFjZXJ9XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gIFtvcHRpb25zLm9yZGVyPSdhc2NlbmRpbmcnXSAtIFRoZSBvcmRlciBpbiB3aGljaCBpbmRpY2VzXG4gKiBhcmUgYXNzaWduZWQuIEN1cnJlbnRseSBzdXBwb3J0ZWQgdmFsdWVzIGFyZTpcbiAqIC0gYCdhc2NlbmRpbmcnYDogaW5kaWNlcyBhcmUgYXNzaWduZWQgaW4gYXNjZW5kaW5nIG9yZGVyXG4gKiAtIGAncmFuZG9tJ2A6IGluZGljZXMgYXJlIGFzc2lnbmVkIGluIHJhbmRvbSBvcmRlclxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXJcbiAqIEBleGFtcGxlXG4gKiAvLyBpbnNpZGUgdGhlIGV4cGVyaWVuY2UgY29uc3RydWN0b3JcbiAqIHRoaXMuY2hlY2tpbiA9IHRoaXMucmVxdWlyZSgnY2hlY2tpbicpO1xuICovXG5jbGFzcyBDaGVja2luIGV4dGVuZHMgQWN0aXZpdHkge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBvcmRlcjogJ2FzY2VuZGluZycsXG4gICAgICBzZXR1cENvbmZpZ0l0ZW06ICdzZXR1cCcsXG4gICAgfVxuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuICAgIC8vIHVzZSBzaGFyZWQgY29uZmlnIHNlcnZpY2UgdG8gc2hhcmUgdGhlIHNldHVwXG4gICAgdGhpcy5fc2hhcmVkQ29uZmlnU2VydmljZSA9IHRoaXMucmVxdWlyZSgnc2hhcmVkLWNvbmZpZycpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICAvKipcbiAgICAgKiBTZXR1cCByZXRyaWV2ZWQgZnJvbSBzZXJ2ZXIgY29uZmlndXJhdGlvbi5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuc2V0dXAgPSB0aGlzLl9zaGFyZWRDb25maWdTZXJ2aWNlLmdldCh0aGlzLm9wdGlvbnMuc2V0dXBDb25maWdJdGVtKTtcblxuICAgIC8qKlxuICAgICAqIE1heGltdW0gbnVtYmVyIG9mIGNsaWVudHMgY2hlY2tlZCBpbiAobWF5IGxpbWl0IG9yIGJlIGxpbWl0ZWQgYnkgdGhlXG4gICAgICogbnVtYmVyIG9mIHByZWRlZmluZWQgbGFiZWxzIGFuZC9vciBjb29yZGluYXRlcykuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmNhcGFjaXR5ID0gZ2V0T3B0KHRoaXMuc2V0dXAuY2FwYWNpdHksIEluZmluaXR5LCAxKTtcblxuICAgIC8qKlxuICAgICAqIExpc3Qgb2YgdGhlIGNsaWVudHMgY2hlY2tlZCBpbiBhdCB0aGVpciBjb3JyZXNwb25kaW5nIGluZGljZXMuXG4gICAgICogQHR5cGUge0NsaWVudFtdfVxuICAgICAqL1xuICAgIHRoaXMuY2xpZW50cyA9IFtdO1xuXG4gICAgLyoqIEBwcml2YXRlICovXG4gICAgdGhpcy5vcmRlciA9IHRoaXMub3B0aW9uczsgLy8gJ2FzY2VuZGluZycgfCAncmFuZG9tJ1xuXG4gICAgdGhpcy5fYXZhaWxhYmxlSW5kaWNlcyA9IFtdO1xuICAgIHRoaXMuX25leHRBc2NlbmRpbmdJbmRleCA9IDA7XG5cbiAgICBjb25zdCBzZXR1cCA9IHRoaXMub3B0aW9ucy5zZXR1cDtcblxuICAgIGlmIChzZXR1cCkge1xuICAgICAgY29uc3QgbnVtTGFiZWxzID0gc2V0dXAubGFiZWxzID8gc2V0dXAubGFiZWxzLmxlbmd0aCA6IEluZmluaXR5O1xuICAgICAgY29uc3QgbnVtQ29vcmRpbmF0ZXMgPSBzZXR1cC5jb29yZGluYXRlcyA/IHNldHVwLmNvb3JkaW5hdGVzLmxlbmd0aCA6IEluZmluaXR5O1xuICAgICAgY29uc3QgbnVtUG9zaXRpb25zID0gTWF0aC5taW4obnVtTGFiZWxzLCBudW1Db29yZGluYXRlcyk7XG5cbiAgICAgIGlmICh0aGlzLmNhcGFjaXR5ID4gbnVtUG9zaXRpb25zKVxuICAgICAgICB0aGlzLmNhcGFjaXR5ID0gbnVtUG9zaXRpb25zO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNhcGFjaXR5ID09PSBJbmZpbml0eSlcbiAgICAgIHRoaXMub3JkZXIgPSAnYXNjZW5kaW5nJztcbiAgICBlbHNlIGlmICh0aGlzLm9yZGVyID09PSAncmFuZG9tJykge1xuICAgICAgdGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4ID0gdGhpcy5jYXBhY2l0eTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhcGFjaXR5OyBpKyspXG4gICAgICAgIHRoaXMuX2F2YWlsYWJsZUluZGljZXMucHVzaChpKTtcbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX2dldFJhbmRvbUluZGV4KCkge1xuICAgIGNvbnN0IG51bUF2YWlsYWJsZSA9IHRoaXMuX2F2YWlsYWJsZUluZGljZXMubGVuZ3RoO1xuXG4gICAgaWYgKG51bUF2YWlsYWJsZSA+IDApIHtcbiAgICAgIGNvbnN0IHJhbmRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG51bUF2YWlsYWJsZSk7XG4gICAgICByZXR1cm4gdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5zcGxpY2UocmFuZG9tLCAxKVswXTtcbiAgICB9XG5cbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX2dldEFzY2VuZGluZ0luZGV4KCkge1xuICAgIGlmICh0aGlzLl9hdmFpbGFibGVJbmRpY2VzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuX2F2YWlsYWJsZUluZGljZXMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgIHJldHVybiBhIC0gYjtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5zcGxpY2UoMCwgMSlbMF07XG4gICAgfSBlbHNlIGlmICh0aGlzLl9uZXh0QXNjZW5kaW5nSW5kZXggPCB0aGlzLmNhcGFjaXR5KSB7XG4gICAgICByZXR1cm4gdGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4Kys7XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9yZWxlYXNlSW5kZXgoaW5kZXgpIHtcbiAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihpbmRleCkpXG4gICAgICB0aGlzLl9hdmFpbGFibGVJbmRpY2VzLnB1c2goaW5kZXgpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vblJlcXVlc3QoY2xpZW50KSB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGxldCBpbmRleCA9IC0xO1xuXG4gICAgICBpZiAodGhpcy5vcmRlciA9PT0gJ3JhbmRvbScpXG4gICAgICAgIGluZGV4ID0gdGhpcy5fZ2V0UmFuZG9tSW5kZXgoKTtcbiAgICAgIGVsc2UgLy8gaWYgKG9yZGVyID09PSAnYWNzZW5kaW5nJylcbiAgICAgICAgaW5kZXggPSB0aGlzLl9nZXRBc2NlbmRpbmdJbmRleCgpO1xuXG4gICAgICBjbGllbnQuaW5kZXggPSBpbmRleDtcblxuICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgY29uc3Qgc2V0dXAgPSB0aGlzLnNldHVwO1xuICAgICAgICBsZXQgbGFiZWw7XG4gICAgICAgIGxldCBjb29yZGluYXRlcztcblxuICAgICAgICBpZiAoc2V0dXApIHtcbiAgICAgICAgICBsYWJlbCA9IHNldHVwLmxhYmVscyA/IHNldHVwLmxhYmVsc1tpbmRleF0gOiB1bmRlZmluZWQ7XG4gICAgICAgICAgY29vcmRpbmF0ZXMgPSBzZXR1cC5jb29yZGluYXRlcyA/IHNldHVwLmNvb3JkaW5hdGVzW2luZGV4XSA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgIGNsaWVudC5sYWJlbCA9IGxhYmVsO1xuICAgICAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jbGllbnRzW2luZGV4XSA9IGNsaWVudDtcbiAgICAgICAgdGhpcy5zZW5kKGNsaWVudCwgJ3Bvc2l0aW9uJywgaW5kZXgsIGxhYmVsLCBjb29yZGluYXRlcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNlbmQoY2xpZW50LCAndW5hdmFpbGFibGUnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncmVxdWVzdCcsIHRoaXMuX29uUmVxdWVzdChjbGllbnQpKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBkaXNjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmRpc2Nvbm5lY3QoY2xpZW50KTtcblxuICAgIGNvbnN0IGluZGV4ID0gY2xpZW50LmluZGV4O1xuXG4gICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgIGRlbGV0ZSB0aGlzLmNsaWVudHNbaW5kZXhdO1xuICAgICAgdGhpcy5fcmVsZWFzZUluZGV4KGluZGV4KTtcbiAgICB9XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgQ2hlY2tpbik7XG5cbmV4cG9ydCBkZWZhdWx0IENoZWNraW47XG4iXX0=