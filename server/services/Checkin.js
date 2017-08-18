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

    var _this = (0, _possibleConstructorReturn3.default)(this, (Checkin.__proto__ || (0, _getPrototypeOf2.default)(Checkin)).call(this, SERVICE_ID));

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
      (0, _get3.default)(Checkin.prototype.__proto__ || (0, _getPrototypeOf2.default)(Checkin.prototype), 'start', this).call(this);
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
      (0, _get3.default)(Checkin.prototype.__proto__ || (0, _getPrototypeOf2.default)(Checkin.prototype), 'connect', this).call(this, client);

      this.receive(client, 'request', this._onRequest(client));
    }

    /** @private */

  }, {
    key: 'disconnect',
    value: function disconnect(client) {
      (0, _get3.default)(Checkin.prototype.__proto__ || (0, _getPrototypeOf2.default)(Checkin.prototype), 'disconnect', this).call(this, client);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNoZWNraW4uanMiXSwibmFtZXMiOlsiU0VSVklDRV9JRCIsIkNoZWNraW4iLCJkZWZhdWx0cyIsImNvbmZpZ0l0ZW0iLCJjb25maWd1cmUiLCJfc2hhcmVkQ29uZmlnIiwicmVxdWlyZSIsIm9wdGlvbnMiLCJzZXR1cCIsImdldCIsIkVycm9yIiwiY2FwYWNpdHkiLCJJbmZpbml0eSIsImNsaWVudHMiLCJfYXZhaWxhYmxlSW5kaWNlcyIsIl9uZXh0QXNjZW5kaW5nSW5kZXgiLCJudW1MYWJlbHMiLCJsYWJlbHMiLCJsZW5ndGgiLCJudW1Db29yZGluYXRlcyIsImNvb3JkaW5hdGVzIiwibnVtUG9zaXRpb25zIiwiTWF0aCIsIm1pbiIsImkiLCJwdXNoIiwibnVtQXZhaWxhYmxlIiwicmFuZG9tIiwiZmxvb3IiLCJzcGxpY2UiLCJzb3J0IiwiYSIsImIiLCJpbmRleCIsImNsaWVudCIsIm9yZGVyIiwiX2dldFJhbmRvbUluZGV4IiwiX2dldEFzY2VuZGluZ0luZGV4IiwibGFiZWwiLCJ1bmRlZmluZWQiLCJzZW5kIiwicmVjZWl2ZSIsIl9vblJlcXVlc3QiLCJfcmVsZWFzZUluZGV4IiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxhQUFhLGlCQUFuQjs7QUFHQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUE0Qk1DLE87OztBQUNKO0FBQ0EscUJBQWM7QUFBQTs7QUFBQSx3SUFDTkQsVUFETTs7QUFHWixRQUFNRSxXQUFXO0FBQ2ZDLGtCQUFZO0FBREcsS0FBakI7O0FBSUEsVUFBS0MsU0FBTCxDQUFlRixRQUFmO0FBQ0E7QUFDQSxVQUFLRyxhQUFMLEdBQXFCLE1BQUtDLE9BQUwsQ0FBYSxlQUFiLENBQXJCO0FBVFk7QUFVYjs7QUFFRDs7Ozs7NEJBQ1E7QUFDTjtBQUNBLFVBQU1ILGFBQWEsS0FBS0ksT0FBTCxDQUFhSixV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QW9DQyxPQUFwQzs7a0JBRWVBLE8iLCJmaWxlIjoiQ2hlY2tpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgeyBnZXRPcHQgfSBmcm9tICcuLi8uLi91dGlscy9oZWxwZXJzJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOmNoZWNraW4nO1xuXG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgc2VydmVyIGAnY2hlY2tpbidgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGlzIG9uZSBvZiB0aGUgcHJvdmlkZWQgc2VydmljZXMgYWltZWQgYXQgaWRlbnRpZnlpbmcgY2xpZW50cyBpbnNpZGVcbiAqIHRoZSBleHBlcmllbmNlIGFsb25nIHdpdGggdGhlIFtgJ2xvY2F0b3InYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLkxvY2F0b3J9XG4gKiBhbmQgW2AncGxhY2VyJ2Bde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5QbGFjZXJ9IHNlcnZpY2VzLlxuICpcbiAqIFRoZSBgJ2NoZWNraW4nYCBzZXJ2aWNlIGlzIHRoZSBtb3N0IHNpbXBsZSBhbW9uZyB0aGVzZSBzZXJ2aWNlcyBhcyB0aGUgc2VydmVyXG4gKiBzaW1wbHkgYXNzaWducyBhIHRpY2tldCB0byB0aGUgY2xpZW50IGFtb25nIHRoZSBhdmFpbGFibGUgb25lcy4gVGhlIHRpY2tldCBjYW5cbiAqIG9wdGlvbmFsbHkgYmUgYXNzb2NpYXRlZCB3aXRoIGNvb3JkaW5hdGVzIG9yIGxhYmVsIGFjY29yZGluZyB0byB0aGUgc2VydmVyXG4gKiBgc2V0dXBgIGNvbmZpZ3VyYXRpb24uXG4gKlxuICogX18qVGhlIHNlcnZpY2UgbXVzdCBiZSB1c2VkIHdpdGggaXRzIFtjbGllbnQtc2lkZSBjb3VudGVycGFydF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNoZWNraW59Kl9fXG4gKlxuICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLkxvY2F0b3J9XG4gKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuUGxhY2VyfVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge0Jvb2xlYW59ICBbb3B0aW9ucy5vcmRlcj0nYXNjZW5kaW5nJ10gLSBUaGUgb3JkZXIgaW4gd2hpY2ggaW5kaWNlc1xuICogYXJlIGFzc2lnbmVkLiBDdXJyZW50bHkgc3VwcG9ydGVkIHZhbHVlcyBhcmU6XG4gKiAtIGAnYXNjZW5kaW5nJ2A6IGluZGljZXMgYXJlIGFzc2lnbmVkIGluIGFzY2VuZGluZyBvcmRlclxuICogLSBgJ3JhbmRvbSdgOiBpbmRpY2VzIGFyZSBhc3NpZ25lZCBpbiByYW5kb20gb3JkZXJcbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyXG4gKiBAZXhhbXBsZVxuICogLy8gaW5zaWRlIHRoZSBleHBlcmllbmNlIGNvbnN0cnVjdG9yXG4gKiB0aGlzLmNoZWNraW4gPSB0aGlzLnJlcXVpcmUoJ2NoZWNraW4nKTtcbiAqL1xuY2xhc3MgQ2hlY2tpbiBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBjb25maWdJdGVtOiAnc2V0dXAnLFxuICAgIH1cblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcbiAgICAvLyB1c2Ugc2hhcmVkIGNvbmZpZyBzZXJ2aWNlIHRvIHNoYXJlIHRoZSBzZXR1cFxuICAgIHRoaXMuX3NoYXJlZENvbmZpZyA9IHRoaXMucmVxdWlyZSgnc2hhcmVkLWNvbmZpZycpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG4gICAgY29uc3QgY29uZmlnSXRlbSA9IHRoaXMub3B0aW9ucy5jb25maWdJdGVtO1xuXG4gICAgLyoqXG4gICAgICogU2V0dXAgcmV0cmlldmVkIGZyb20gdGhlIHNlcnZlciBjb25maWd1cmF0aW9uLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5zZXR1cCA9IHRoaXMuX3NoYXJlZENvbmZpZy5nZXQoY29uZmlnSXRlbSk7XG5cbiAgICBpZiAodGhpcy5zZXR1cCA9PT0gbnVsbClcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXCJzZXJ2aWNlOmNoZWNraW5cIjogc2VydmVyLmNvbmZpZy4ke2NvbmZpZ0l0ZW19IGlzIG5vdCBkZWZpbmVkYCk7XG5cbiAgICAvKipcbiAgICAgKiBNYXhpbXVtIG51bWJlciBvZiBjbGllbnRzIGNoZWNrZWQgaW4gKG1heSBsaW1pdCBvciBiZSBsaW1pdGVkIGJ5IHRoZVxuICAgICAqIG51bWJlciBvZiBwcmVkZWZpbmVkIGxhYmVscyBhbmQvb3IgY29vcmRpbmF0ZXMpLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5jYXBhY2l0eSA9IGdldE9wdCh0aGlzLnNldHVwICYmIHRoaXMuc2V0dXAuY2FwYWNpdHksIEluZmluaXR5LCAxKTtcblxuICAgIC8qKlxuICAgICAqIExpc3Qgb2YgdGhlIGNsaWVudHMgY2hlY2tlZCBpbiBhdCB0aGVpciBjb3JyZXNwb25kaW5nIGluZGljZXMuXG4gICAgICogQHR5cGUge0NsaWVudFtdfVxuICAgICAqL1xuICAgIHRoaXMuY2xpZW50cyA9IFtdO1xuXG4gICAgLyoqIEBwcml2YXRlICovXG4gICAgdGhpcy5fYXZhaWxhYmxlSW5kaWNlcyA9IFtdOyAvLyBhcnJheSBvZiBhdmFpbGFibGUgaW5kaWNlc1xuICAgIHRoaXMuX25leHRBc2NlbmRpbmdJbmRleCA9IDA7IC8vIG5leHQgaW5kZXggd2hlbiBfYXZhaWxhYmxlSW5kaWNlcyBpcyBlbXB0eVxuXG4gICAgY29uc3Qgc2V0dXAgPSB0aGlzLm9wdGlvbnMuc2V0dXA7XG5cbiAgICBpZiAoc2V0dXApIHtcbiAgICAgIGNvbnN0IG51bUxhYmVscyA9IHNldHVwLmxhYmVscyA/IHNldHVwLmxhYmVscy5sZW5ndGggOiBJbmZpbml0eTtcbiAgICAgIGNvbnN0IG51bUNvb3JkaW5hdGVzID0gc2V0dXAuY29vcmRpbmF0ZXMgPyBzZXR1cC5jb29yZGluYXRlcy5sZW5ndGggOiBJbmZpbml0eTtcbiAgICAgIGNvbnN0IG51bVBvc2l0aW9ucyA9IE1hdGgubWluKG51bUxhYmVscywgbnVtQ29vcmRpbmF0ZXMpO1xuXG4gICAgICBpZiAodGhpcy5jYXBhY2l0eSA+IG51bVBvc2l0aW9ucylcbiAgICAgICAgdGhpcy5jYXBhY2l0eSA9IG51bVBvc2l0aW9ucztcbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX2dldFJhbmRvbUluZGV4KCkge1xuICAgIGZvciAobGV0IGkgPSB0aGlzLl9uZXh0QXNjZW5kaW5nSW5kZXg7IGkgPCB0aGlzLmNhcGFjaXR5OyBpKyspXG4gICAgICB0aGlzLl9hdmFpbGFibGVJbmRpY2VzLnB1c2goaSk7XG5cbiAgICB0aGlzLl9uZXh0QXNjZW5kaW5nSW5kZXggPSB0aGlzLmNhcGFjaXR5O1xuICAgIGNvbnN0IG51bUF2YWlsYWJsZSA9IHRoaXMuX2F2YWlsYWJsZUluZGljZXMubGVuZ3RoO1xuXG4gICAgaWYgKG51bUF2YWlsYWJsZSA+IDApIHtcbiAgICAgIGNvbnN0IHJhbmRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG51bUF2YWlsYWJsZSk7XG4gICAgICByZXR1cm4gdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5zcGxpY2UocmFuZG9tLCAxKVswXTtcbiAgICB9XG5cbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX2dldEFzY2VuZGluZ0luZGV4KCkge1xuICAgIGlmICh0aGlzLl9hdmFpbGFibGVJbmRpY2VzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuX2F2YWlsYWJsZUluZGljZXMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgIHJldHVybiBhIC0gYjtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5zcGxpY2UoMCwgMSlbMF07XG4gICAgfSBlbHNlIGlmICh0aGlzLl9uZXh0QXNjZW5kaW5nSW5kZXggPCB0aGlzLmNhcGFjaXR5KSB7XG4gICAgICByZXR1cm4gdGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4Kys7XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9yZWxlYXNlSW5kZXgoaW5kZXgpIHtcbiAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihpbmRleCkpXG4gICAgICB0aGlzLl9hdmFpbGFibGVJbmRpY2VzLnB1c2goaW5kZXgpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vblJlcXVlc3QoY2xpZW50KSB7XG4gICAgcmV0dXJuIChvcmRlcikgPT4ge1xuICAgICAgbGV0IGluZGV4ID0gLTE7XG5cbiAgICAgIGlmIChvcmRlciA9PT0gJ3JhbmRvbScgJiYgdGhpcy5jYXBhY2l0eSAhPT0gSW5maW5pdHkpXG4gICAgICAgIGluZGV4ID0gdGhpcy5fZ2V0UmFuZG9tSW5kZXgoKTtcbiAgICAgIGVsc2UgLy8gaWYgKG9yZGVyID09PSAnYWNzZW5kaW5nJylcbiAgICAgICAgaW5kZXggPSB0aGlzLl9nZXRBc2NlbmRpbmdJbmRleCgpO1xuXG4gICAgICBjbGllbnQuaW5kZXggPSBpbmRleDtcblxuICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgY29uc3Qgc2V0dXAgPSB0aGlzLnNldHVwO1xuICAgICAgICBsZXQgbGFiZWw7XG4gICAgICAgIGxldCBjb29yZGluYXRlcztcblxuICAgICAgICBpZiAoc2V0dXApIHtcbiAgICAgICAgICBsYWJlbCA9IHNldHVwLmxhYmVscyA/IHNldHVwLmxhYmVsc1tpbmRleF0gOiB1bmRlZmluZWQ7XG4gICAgICAgICAgY29vcmRpbmF0ZXMgPSBzZXR1cC5jb29yZGluYXRlcyA/IHNldHVwLmNvb3JkaW5hdGVzW2luZGV4XSA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgIGNsaWVudC5sYWJlbCA9IGxhYmVsO1xuICAgICAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jbGllbnRzW2luZGV4XSA9IGNsaWVudDtcbiAgICAgICAgdGhpcy5zZW5kKGNsaWVudCwgJ3Bvc2l0aW9uJywgaW5kZXgsIGxhYmVsLCBjb29yZGluYXRlcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNlbmQoY2xpZW50LCAndW5hdmFpbGFibGUnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncmVxdWVzdCcsIHRoaXMuX29uUmVxdWVzdChjbGllbnQpKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBkaXNjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmRpc2Nvbm5lY3QoY2xpZW50KTtcblxuICAgIGNvbnN0IGluZGV4ID0gY2xpZW50LmluZGV4O1xuXG4gICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgIGRlbGV0ZSB0aGlzLmNsaWVudHNbaW5kZXhdO1xuICAgICAgdGhpcy5fcmVsZWFzZUluZGV4KGluZGV4KTtcbiAgICB9XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgQ2hlY2tpbik7XG5cbmV4cG9ydCBkZWZhdWx0IENoZWNraW47XG4iXX0=