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

      if (this.setup === null) throw new Error('"' + SERVICE_ID + '": server.config.' + configItem + ' is not defined');

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

      this.ready();
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

            if (client.coordinates === null) client.coordinates = coordinates;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNoZWNraW4uanMiXSwibmFtZXMiOlsiU0VSVklDRV9JRCIsIkNoZWNraW4iLCJkZWZhdWx0cyIsImNvbmZpZ0l0ZW0iLCJjb25maWd1cmUiLCJfc2hhcmVkQ29uZmlnIiwicmVxdWlyZSIsIm9wdGlvbnMiLCJzZXR1cCIsImdldCIsIkVycm9yIiwiY2FwYWNpdHkiLCJJbmZpbml0eSIsImNsaWVudHMiLCJfYXZhaWxhYmxlSW5kaWNlcyIsIl9uZXh0QXNjZW5kaW5nSW5kZXgiLCJudW1MYWJlbHMiLCJsYWJlbHMiLCJsZW5ndGgiLCJudW1Db29yZGluYXRlcyIsImNvb3JkaW5hdGVzIiwibnVtUG9zaXRpb25zIiwiTWF0aCIsIm1pbiIsInJlYWR5IiwiaSIsInB1c2giLCJudW1BdmFpbGFibGUiLCJyYW5kb20iLCJmbG9vciIsInNwbGljZSIsInNvcnQiLCJhIiwiYiIsImluZGV4IiwiY2xpZW50Iiwib3JkZXIiLCJfZ2V0UmFuZG9tSW5kZXgiLCJfZ2V0QXNjZW5kaW5nSW5kZXgiLCJsYWJlbCIsInVuZGVmaW5lZCIsInNlbmQiLCJyZWNlaXZlIiwiX29uUmVxdWVzdCIsIl9yZWxlYXNlSW5kZXgiLCJTZXJ2aWNlIiwic2VydmljZU1hbmFnZXIiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLGFBQWEsaUJBQW5COztBQUdBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQTRCTUMsTzs7O0FBQ0o7QUFDQSxxQkFBYztBQUFBOztBQUFBLHdJQUNORCxVQURNOztBQUdaLFFBQU1FLFdBQVc7QUFDZkMsa0JBQVk7QUFERyxLQUFqQjs7QUFJQSxVQUFLQyxTQUFMLENBQWVGLFFBQWY7QUFDQTtBQUNBLFVBQUtHLGFBQUwsR0FBcUIsTUFBS0MsT0FBTCxDQUFhLGVBQWIsQ0FBckI7QUFUWTtBQVViOztBQUVEOzs7Ozs0QkFDUTtBQUNO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QUtyQixPQUFMLENBQWFxQixLQUFiLENBQVA7QUFDQSxhQUFLVSxhQUFMLENBQW1CVixLQUFuQjtBQUNEO0FBQ0Y7OztFQXBKbUJXLGlCOztBQXVKdEJDLHlCQUFlQyxRQUFmLENBQXdCL0MsVUFBeEIsRUFBb0NDLE9BQXBDOztrQkFFZUEsTyIsImZpbGUiOiJDaGVja2luLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCB7IGdldE9wdCB9IGZyb20gJy4uLy4uL3V0aWxzL2hlbHBlcnMnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6Y2hlY2tpbic7XG5cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBzZXJ2ZXIgYCdjaGVja2luJ2Agc2VydmljZS5cbiAqXG4gKiBUaGlzIHNlcnZpY2UgaXMgb25lIG9mIHRoZSBwcm92aWRlZCBzZXJ2aWNlcyBhaW1lZCBhdCBpZGVudGlmeWluZyBjbGllbnRzIGluc2lkZVxuICogdGhlIGV4cGVyaWVuY2UgYWxvbmcgd2l0aCB0aGUgW2AnbG9jYXRvcidgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuTG9jYXRvcn1cbiAqIGFuZCBbYCdwbGFjZXInYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLlBsYWNlcn0gc2VydmljZXMuXG4gKlxuICogVGhlIGAnY2hlY2tpbidgIHNlcnZpY2UgaXMgdGhlIG1vc3Qgc2ltcGxlIGFtb25nIHRoZXNlIHNlcnZpY2VzIGFzIHRoZSBzZXJ2ZXJcbiAqIHNpbXBseSBhc3NpZ25zIGEgdGlja2V0IHRvIHRoZSBjbGllbnQgYW1vbmcgdGhlIGF2YWlsYWJsZSBvbmVzLiBUaGUgdGlja2V0IGNhblxuICogb3B0aW9uYWxseSBiZSBhc3NvY2lhdGVkIHdpdGggY29vcmRpbmF0ZXMgb3IgbGFiZWwgYWNjb3JkaW5nIHRvIHRoZSBzZXJ2ZXJcbiAqIGBzZXR1cGAgY29uZmlndXJhdGlvbi5cbiAqXG4gKiBfXypUaGUgc2VydmljZSBtdXN0IGJlIHVzZWQgd2l0aCBpdHMgW2NsaWVudC1zaWRlIGNvdW50ZXJwYXJ0XXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2hlY2tpbn0qX19cbiAqXG4gKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuTG9jYXRvcn1cbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5QbGFjZXJ9XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gIFtvcHRpb25zLm9yZGVyPSdhc2NlbmRpbmcnXSAtIFRoZSBvcmRlciBpbiB3aGljaCBpbmRpY2VzXG4gKiBhcmUgYXNzaWduZWQuIEN1cnJlbnRseSBzdXBwb3J0ZWQgdmFsdWVzIGFyZTpcbiAqIC0gYCdhc2NlbmRpbmcnYDogaW5kaWNlcyBhcmUgYXNzaWduZWQgaW4gYXNjZW5kaW5nIG9yZGVyXG4gKiAtIGAncmFuZG9tJ2A6IGluZGljZXMgYXJlIGFzc2lnbmVkIGluIHJhbmRvbSBvcmRlclxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXJcbiAqIEBleGFtcGxlXG4gKiAvLyBpbnNpZGUgdGhlIGV4cGVyaWVuY2UgY29uc3RydWN0b3JcbiAqIHRoaXMuY2hlY2tpbiA9IHRoaXMucmVxdWlyZSgnY2hlY2tpbicpO1xuICovXG5jbGFzcyBDaGVja2luIGV4dGVuZHMgU2VydmljZSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbmNpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGNvbmZpZ0l0ZW06ICdzZXR1cCcsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcbiAgICAvLyB1c2Ugc2hhcmVkIGNvbmZpZyBzZXJ2aWNlIHRvIHNoYXJlIHRoZSBzZXR1cFxuICAgIHRoaXMuX3NoYXJlZENvbmZpZyA9IHRoaXMucmVxdWlyZSgnc2hhcmVkLWNvbmZpZycpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG4gICAgY29uc3QgY29uZmlnSXRlbSA9IHRoaXMub3B0aW9ucy5jb25maWdJdGVtO1xuXG4gICAgLyoqXG4gICAgICogU2V0dXAgcmV0cmlldmVkIGZyb20gdGhlIHNlcnZlciBjb25maWd1cmF0aW9uLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5zZXR1cCA9IHRoaXMuX3NoYXJlZENvbmZpZy5nZXQoY29uZmlnSXRlbSk7XG5cbiAgICBpZiAodGhpcy5zZXR1cCA9PT0gbnVsbClcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXCIke1NFUlZJQ0VfSUR9XCI6IHNlcnZlci5jb25maWcuJHtjb25maWdJdGVtfSBpcyBub3QgZGVmaW5lZGApO1xuXG4gICAgLyoqXG4gICAgICogTWF4aW11bSBudW1iZXIgb2YgY2xpZW50cyBjaGVja2VkIGluIChtYXkgbGltaXQgb3IgYmUgbGltaXRlZCBieSB0aGVcbiAgICAgKiBudW1iZXIgb2YgcHJlZGVmaW5lZCBsYWJlbHMgYW5kL29yIGNvb3JkaW5hdGVzKS5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuY2FwYWNpdHkgPSBnZXRPcHQodGhpcy5zZXR1cCAmJiB0aGlzLnNldHVwLmNhcGFjaXR5LCBJbmZpbml0eSwgMSk7XG5cbiAgICAvKipcbiAgICAgKiBMaXN0IG9mIHRoZSBjbGllbnRzIGNoZWNrZWQgaW4gYXQgdGhlaXIgY29ycmVzcG9uZGluZyBpbmRpY2VzLlxuICAgICAqIEB0eXBlIHtDbGllbnRbXX1cbiAgICAgKi9cbiAgICB0aGlzLmNsaWVudHMgPSBbXTtcblxuICAgIC8qKiBAcHJpdmF0ZSAqL1xuICAgIHRoaXMuX2F2YWlsYWJsZUluZGljZXMgPSBbXTsgLy8gYXJyYXkgb2YgYXZhaWxhYmxlIGluZGljZXNcbiAgICB0aGlzLl9uZXh0QXNjZW5kaW5nSW5kZXggPSAwOyAvLyBuZXh0IGluZGV4IHdoZW4gX2F2YWlsYWJsZUluZGljZXMgaXMgZW1wdHlcblxuICAgIGNvbnN0IHNldHVwID0gdGhpcy5vcHRpb25zLnNldHVwO1xuXG4gICAgaWYgKHNldHVwKSB7XG4gICAgICBjb25zdCBudW1MYWJlbHMgPSBzZXR1cC5sYWJlbHMgPyBzZXR1cC5sYWJlbHMubGVuZ3RoIDogSW5maW5pdHk7XG4gICAgICBjb25zdCBudW1Db29yZGluYXRlcyA9IHNldHVwLmNvb3JkaW5hdGVzID8gc2V0dXAuY29vcmRpbmF0ZXMubGVuZ3RoIDogSW5maW5pdHk7XG4gICAgICBjb25zdCBudW1Qb3NpdGlvbnMgPSBNYXRoLm1pbihudW1MYWJlbHMsIG51bUNvb3JkaW5hdGVzKTtcblxuICAgICAgaWYgKHRoaXMuY2FwYWNpdHkgPiBudW1Qb3NpdGlvbnMpXG4gICAgICAgIHRoaXMuY2FwYWNpdHkgPSBudW1Qb3NpdGlvbnM7XG4gICAgfVxuXG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9nZXRSYW5kb21JbmRleCgpIHtcbiAgICBmb3IgKGxldCBpID0gdGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4OyBpIDwgdGhpcy5jYXBhY2l0eTsgaSsrKVxuICAgICAgdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5wdXNoKGkpO1xuXG4gICAgdGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4ID0gdGhpcy5jYXBhY2l0eTtcbiAgICBjb25zdCBudW1BdmFpbGFibGUgPSB0aGlzLl9hdmFpbGFibGVJbmRpY2VzLmxlbmd0aDtcblxuICAgIGlmIChudW1BdmFpbGFibGUgPiAwKSB7XG4gICAgICBjb25zdCByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBudW1BdmFpbGFibGUpO1xuICAgICAgcmV0dXJuIHRoaXMuX2F2YWlsYWJsZUluZGljZXMuc3BsaWNlKHJhbmRvbSwgMSlbMF07XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9nZXRBc2NlbmRpbmdJbmRleCgpIHtcbiAgICBpZiAodGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLl9hdmFpbGFibGVJbmRpY2VzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICByZXR1cm4gYSAtIGI7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHRoaXMuX2F2YWlsYWJsZUluZGljZXMuc3BsaWNlKDAsIDEpWzBdO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4IDwgdGhpcy5jYXBhY2l0eSkge1xuICAgICAgcmV0dXJuIHRoaXMuX25leHRBc2NlbmRpbmdJbmRleCsrO1xuICAgIH1cblxuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfcmVsZWFzZUluZGV4KGluZGV4KSB7XG4gICAgaWYgKE51bWJlci5pc0ludGVnZXIoaW5kZXgpKVxuICAgICAgdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5wdXNoKGluZGV4KTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25SZXF1ZXN0KGNsaWVudCkge1xuICAgIHJldHVybiAob3JkZXIpID0+IHtcbiAgICAgIGxldCBpbmRleCA9IC0xO1xuXG4gICAgICBpZiAob3JkZXIgPT09ICdyYW5kb20nICYmIHRoaXMuY2FwYWNpdHkgIT09IEluZmluaXR5KVxuICAgICAgICBpbmRleCA9IHRoaXMuX2dldFJhbmRvbUluZGV4KCk7XG4gICAgICBlbHNlIC8vIGlmIChvcmRlciA9PT0gJ2Fjc2VuZGluZycpXG4gICAgICAgIGluZGV4ID0gdGhpcy5fZ2V0QXNjZW5kaW5nSW5kZXgoKTtcblxuICAgICAgY2xpZW50LmluZGV4ID0gaW5kZXg7XG5cbiAgICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgIGNvbnN0IHNldHVwID0gdGhpcy5zZXR1cDtcbiAgICAgICAgbGV0IGxhYmVsO1xuICAgICAgICBsZXQgY29vcmRpbmF0ZXM7XG5cbiAgICAgICAgaWYgKHNldHVwKSB7XG4gICAgICAgICAgbGFiZWwgPSBzZXR1cC5sYWJlbHMgPyBzZXR1cC5sYWJlbHNbaW5kZXhdIDogdW5kZWZpbmVkO1xuICAgICAgICAgIGNvb3JkaW5hdGVzID0gc2V0dXAuY29vcmRpbmF0ZXMgPyBzZXR1cC5jb29yZGluYXRlc1tpbmRleF0gOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgICBjbGllbnQubGFiZWwgPSBsYWJlbDtcblxuICAgICAgICAgIGlmIChjbGllbnQuY29vcmRpbmF0ZXMgPT09IG51bGwpXG4gICAgICAgICAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2xpZW50c1tpbmRleF0gPSBjbGllbnQ7XG4gICAgICAgIHRoaXMuc2VuZChjbGllbnQsICdwb3NpdGlvbicsIGluZGV4LCBsYWJlbCwgY29vcmRpbmF0ZXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZW5kKGNsaWVudCwgJ3VuYXZhaWxhYmxlJyk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXF1ZXN0JywgdGhpcy5fb25SZXF1ZXN0KGNsaWVudCkpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGRpc2Nvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuZGlzY29ubmVjdChjbGllbnQpO1xuXG4gICAgY29uc3QgaW5kZXggPSBjbGllbnQuaW5kZXg7XG5cbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgZGVsZXRlIHRoaXMuY2xpZW50c1tpbmRleF07XG4gICAgICB0aGlzLl9yZWxlYXNlSW5kZXgoaW5kZXgpO1xuICAgIH1cbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBDaGVja2luKTtcblxuZXhwb3J0IGRlZmF1bHQgQ2hlY2tpbjtcbiJdfQ==