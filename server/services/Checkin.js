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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNoZWNraW4uanMiXSwibmFtZXMiOlsiU0VSVklDRV9JRCIsIkNoZWNraW4iLCJkZWZhdWx0cyIsImNvbmZpZ0l0ZW0iLCJjb25maWd1cmUiLCJfc2hhcmVkQ29uZmlnIiwicmVxdWlyZSIsIm9wdGlvbnMiLCJzZXR1cCIsImdldCIsIkVycm9yIiwiY2FwYWNpdHkiLCJJbmZpbml0eSIsImNsaWVudHMiLCJfYXZhaWxhYmxlSW5kaWNlcyIsIl9uZXh0QXNjZW5kaW5nSW5kZXgiLCJudW1MYWJlbHMiLCJsYWJlbHMiLCJsZW5ndGgiLCJudW1Db29yZGluYXRlcyIsImNvb3JkaW5hdGVzIiwibnVtUG9zaXRpb25zIiwiTWF0aCIsIm1pbiIsInJlYWR5IiwiaSIsInB1c2giLCJudW1BdmFpbGFibGUiLCJyYW5kb20iLCJmbG9vciIsInNwbGljZSIsInNvcnQiLCJhIiwiYiIsImluZGV4IiwiY2xpZW50Iiwib3JkZXIiLCJfZ2V0UmFuZG9tSW5kZXgiLCJfZ2V0QXNjZW5kaW5nSW5kZXgiLCJsYWJlbCIsInVuZGVmaW5lZCIsInNlbmQiLCJyZWNlaXZlIiwiX29uUmVxdWVzdCIsIl9yZWxlYXNlSW5kZXgiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLGFBQWEsaUJBQW5COztBQUdBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQTRCTUMsTzs7O0FBQ0o7QUFDQSxxQkFBYztBQUFBOztBQUFBLHdJQUNORCxVQURNOztBQUdaLFFBQU1FLFdBQVc7QUFDZkMsa0JBQVk7QUFERyxLQUFqQjs7QUFJQSxVQUFLQyxTQUFMLENBQWVGLFFBQWY7QUFDQTtBQUNBLFVBQUtHLGFBQUwsR0FBcUIsTUFBS0MsT0FBTCxDQUFhLGVBQWIsQ0FBckI7QUFUWTtBQVViOztBQUVEOzs7Ozs0QkFDUTtBQUNOO0FBQ0EsVUFBTUgsYUFBYSxLQUFLSSxPQUFMLENBQWFKLFVBQWhDOztBQUVBOzs7O0FBSUEsV0FBS0ssS0FBTCxHQUFhLEtBQUtILGFBQUwsQ0FBbUJJLEdBQW5CLENBQXVCTixVQUF2QixDQUFiOztBQUVBLFVBQUksS0FBS0ssS0FBTCxLQUFlLElBQW5CLEVBQ0UsTUFBTSxJQUFJRSxLQUFKLE9BQWNWLFVBQWQseUJBQTRDRyxVQUE1QyxxQkFBTjs7QUFFRjs7Ozs7QUFLQSxXQUFLUSxRQUFMLEdBQWdCLHFCQUFPLEtBQUtILEtBQUwsSUFBYyxLQUFLQSxLQUFMLENBQVdHLFFBQWhDLEVBQTBDQyxRQUExQyxFQUFvRCxDQUFwRCxDQUFoQjs7QUFFQTs7OztBQUlBLFdBQUtDLE9BQUwsR0FBZSxFQUFmOztBQUVBO0FBQ0EsV0FBS0MsaUJBQUwsR0FBeUIsRUFBekIsQ0EzQk0sQ0EyQnVCO0FBQzdCLFdBQUtDLG1CQUFMLEdBQTJCLENBQTNCLENBNUJNLENBNEJ3Qjs7QUFFOUIsVUFBTVAsUUFBUSxLQUFLRCxPQUFMLENBQWFDLEtBQTNCOztBQUVBLFVBQUlBLEtBQUosRUFBVztBQUNULFlBQU1RLFlBQVlSLE1BQU1TLE1BQU4sR0FBZVQsTUFBTVMsTUFBTixDQUFhQyxNQUE1QixHQUFxQ04sUUFBdkQ7QUFDQSxZQUFNTyxpQkFBaUJYLE1BQU1ZLFdBQU4sR0FBb0JaLE1BQU1ZLFdBQU4sQ0FBa0JGLE1BQXRDLEdBQStDTixRQUF0RTtBQUNBLFlBQU1TLGVBQWVDLEtBQUtDLEdBQUwsQ0FBU1AsU0FBVCxFQUFvQkcsY0FBcEIsQ0FBckI7O0FBRUEsWUFBSSxLQUFLUixRQUFMLEdBQWdCVSxZQUFwQixFQUNFLEtBQUtWLFFBQUwsR0FBZ0JVLFlBQWhCO0FBQ0g7O0FBRUQsV0FBS0csS0FBTDtBQUNEOztBQUVEOzs7O3NDQUNrQjtBQUNoQixXQUFLLElBQUlDLElBQUksS0FBS1YsbUJBQWxCLEVBQXVDVSxJQUFJLEtBQUtkLFFBQWhELEVBQTBEYyxHQUExRDtBQUNFLGFBQUtYLGlCQUFMLENBQXVCWSxJQUF2QixDQUE0QkQsQ0FBNUI7QUFERixPQUdBLEtBQUtWLG1CQUFMLEdBQTJCLEtBQUtKLFFBQWhDO0FBQ0EsVUFBTWdCLGVBQWUsS0FBS2IsaUJBQUwsQ0FBdUJJLE1BQTVDOztBQUVBLFVBQUlTLGVBQWUsQ0FBbkIsRUFBc0I7QUFDcEIsWUFBTUMsU0FBU04sS0FBS08sS0FBTCxDQUFXUCxLQUFLTSxNQUFMLEtBQWdCRCxZQUEzQixDQUFmO0FBQ0EsZUFBTyxLQUFLYixpQkFBTCxDQUF1QmdCLE1BQXZCLENBQThCRixNQUE5QixFQUFzQyxDQUF0QyxFQUF5QyxDQUF6QyxDQUFQO0FBQ0Q7O0FBRUQsYUFBTyxDQUFDLENBQVI7QUFDRDs7QUFFRDs7Ozt5Q0FDcUI7QUFDbkIsVUFBSSxLQUFLZCxpQkFBTCxDQUF1QkksTUFBdkIsR0FBZ0MsQ0FBcEMsRUFBdUM7QUFDckMsYUFBS0osaUJBQUwsQ0FBdUJpQixJQUF2QixDQUE0QixVQUFTQyxDQUFULEVBQVlDLENBQVosRUFBZTtBQUN6QyxpQkFBT0QsSUFBSUMsQ0FBWDtBQUNELFNBRkQ7O0FBSUEsZUFBTyxLQUFLbkIsaUJBQUwsQ0FBdUJnQixNQUF2QixDQUE4QixDQUE5QixFQUFpQyxDQUFqQyxFQUFvQyxDQUFwQyxDQUFQO0FBQ0QsT0FORCxNQU1PLElBQUksS0FBS2YsbUJBQUwsR0FBMkIsS0FBS0osUUFBcEMsRUFBOEM7QUFDbkQsZUFBTyxLQUFLSSxtQkFBTCxFQUFQO0FBQ0Q7O0FBRUQsYUFBTyxDQUFDLENBQVI7QUFDRDs7QUFFRDs7OztrQ0FDY21CLEssRUFBTztBQUNuQixVQUFJLHlCQUFpQkEsS0FBakIsQ0FBSixFQUNFLEtBQUtwQixpQkFBTCxDQUF1QlksSUFBdkIsQ0FBNEJRLEtBQTVCO0FBQ0g7O0FBRUQ7Ozs7K0JBQ1dDLE0sRUFBUTtBQUFBOztBQUNqQixhQUFPLFVBQUNDLEtBQUQsRUFBVztBQUNoQixZQUFJRixRQUFRLENBQUMsQ0FBYjs7QUFFQSxZQUFJRSxVQUFVLFFBQVYsSUFBc0IsT0FBS3pCLFFBQUwsS0FBa0JDLFFBQTVDLEVBQ0VzQixRQUFRLE9BQUtHLGVBQUwsRUFBUixDQURGLEtBRUs7QUFDSEgsa0JBQVEsT0FBS0ksa0JBQUwsRUFBUjs7QUFFRkgsZUFBT0QsS0FBUCxHQUFlQSxLQUFmOztBQUVBLFlBQUlBLFNBQVMsQ0FBYixFQUFnQjtBQUNkLGNBQU0xQixRQUFRLE9BQUtBLEtBQW5CO0FBQ0EsY0FBSStCLGNBQUo7QUFDQSxjQUFJbkIsb0JBQUo7O0FBRUEsY0FBSVosS0FBSixFQUFXO0FBQ1QrQixvQkFBUS9CLE1BQU1TLE1BQU4sR0FBZVQsTUFBTVMsTUFBTixDQUFhaUIsS0FBYixDQUFmLEdBQXFDTSxTQUE3QztBQUNBcEIsMEJBQWNaLE1BQU1ZLFdBQU4sR0FBb0JaLE1BQU1ZLFdBQU4sQ0FBa0JjLEtBQWxCLENBQXBCLEdBQStDTSxTQUE3RDs7QUFFQUwsbUJBQU9JLEtBQVAsR0FBZUEsS0FBZjs7QUFFQSxnQkFBSUosT0FBT2YsV0FBUCxLQUF1QixJQUEzQixFQUNFZSxPQUFPZixXQUFQLEdBQXFCQSxXQUFyQjtBQUNIOztBQUVELGlCQUFLUCxPQUFMLENBQWFxQixLQUFiLElBQXNCQyxNQUF0QjtBQUNBLGlCQUFLTSxJQUFMLENBQVVOLE1BQVYsRUFBa0IsVUFBbEIsRUFBOEJELEtBQTlCLEVBQXFDSyxLQUFyQyxFQUE0Q25CLFdBQTVDO0FBQ0QsU0FqQkQsTUFpQk87QUFDTCxpQkFBS3FCLElBQUwsQ0FBVU4sTUFBVixFQUFrQixhQUFsQjtBQUNEO0FBQ0YsT0E5QkQ7QUErQkQ7O0FBRUQ7Ozs7NEJBQ1FBLE0sRUFBUTtBQUNkLHNJQUFjQSxNQUFkOztBQUVBLFdBQUtPLE9BQUwsQ0FBYVAsTUFBYixFQUFxQixTQUFyQixFQUFnQyxLQUFLUSxVQUFMLENBQWdCUixNQUFoQixDQUFoQztBQUNEOztBQUVEOzs7OytCQUNXQSxNLEVBQVE7QUFDakIseUlBQWlCQSxNQUFqQjs7QUFFQSxVQUFNRCxRQUFRQyxPQUFPRCxLQUFyQjs7QUFFQSxVQUFJQSxTQUFTLENBQWIsRUFBZ0I7QUFDZCxlQUFPLEtBQUtyQixPQUFMLENBQWFxQixLQUFiLENBQVA7QUFDQSxhQUFLVSxhQUFMLENBQW1CVixLQUFuQjtBQUNEO0FBQ0Y7Ozs7O0FBR0gseUJBQWVXLFFBQWYsQ0FBd0I3QyxVQUF4QixFQUFvQ0MsT0FBcEM7O2tCQUVlQSxPIiwiZmlsZSI6IkNoZWNraW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHsgZ2V0T3B0IH0gZnJvbSAnLi4vLi4vdXRpbHMvaGVscGVycyc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpjaGVja2luJztcblxuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIHNlcnZlciBgJ2NoZWNraW4nYCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmljZSBpcyBvbmUgb2YgdGhlIHByb3ZpZGVkIHNlcnZpY2VzIGFpbWVkIGF0IGlkZW50aWZ5aW5nIGNsaWVudHMgaW5zaWRlXG4gKiB0aGUgZXhwZXJpZW5jZSBhbG9uZyB3aXRoIHRoZSBbYCdsb2NhdG9yJ2Bde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5Mb2NhdG9yfVxuICogYW5kIFtgJ3BsYWNlcidgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuUGxhY2VyfSBzZXJ2aWNlcy5cbiAqXG4gKiBUaGUgYCdjaGVja2luJ2Agc2VydmljZSBpcyB0aGUgbW9zdCBzaW1wbGUgYW1vbmcgdGhlc2Ugc2VydmljZXMgYXMgdGhlIHNlcnZlclxuICogc2ltcGx5IGFzc2lnbnMgYSB0aWNrZXQgdG8gdGhlIGNsaWVudCBhbW9uZyB0aGUgYXZhaWxhYmxlIG9uZXMuIFRoZSB0aWNrZXQgY2FuXG4gKiBvcHRpb25hbGx5IGJlIGFzc29jaWF0ZWQgd2l0aCBjb29yZGluYXRlcyBvciBsYWJlbCBhY2NvcmRpbmcgdG8gdGhlIHNlcnZlclxuICogYHNldHVwYCBjb25maWd1cmF0aW9uLlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIG11c3QgYmUgdXNlZCB3aXRoIGl0cyBbY2xpZW50LXNpZGUgY291bnRlcnBhcnRde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DaGVja2lufSpfX1xuICpcbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5Mb2NhdG9yfVxuICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLlBsYWNlcn1cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtCb29sZWFufSAgW29wdGlvbnMub3JkZXI9J2FzY2VuZGluZyddIC0gVGhlIG9yZGVyIGluIHdoaWNoIGluZGljZXNcbiAqIGFyZSBhc3NpZ25lZC4gQ3VycmVudGx5IHN1cHBvcnRlZCB2YWx1ZXMgYXJlOlxuICogLSBgJ2FzY2VuZGluZydgOiBpbmRpY2VzIGFyZSBhc3NpZ25lZCBpbiBhc2NlbmRpbmcgb3JkZXJcbiAqIC0gYCdyYW5kb20nYDogaW5kaWNlcyBhcmUgYXNzaWduZWQgaW4gcmFuZG9tIG9yZGVyXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlclxuICogQGV4YW1wbGVcbiAqIC8vIGluc2lkZSB0aGUgZXhwZXJpZW5jZSBjb25zdHJ1Y3RvclxuICogdGhpcy5jaGVja2luID0gdGhpcy5yZXF1aXJlKCdjaGVja2luJyk7XG4gKi9cbmNsYXNzIENoZWNraW4gZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFuY2lhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lEKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgY29uZmlnSXRlbTogJ3NldHVwJyxcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuICAgIC8vIHVzZSBzaGFyZWQgY29uZmlnIHNlcnZpY2UgdG8gc2hhcmUgdGhlIHNldHVwXG4gICAgdGhpcy5fc2hhcmVkQ29uZmlnID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtY29uZmlnJyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgICBjb25zdCBjb25maWdJdGVtID0gdGhpcy5vcHRpb25zLmNvbmZpZ0l0ZW07XG5cbiAgICAvKipcbiAgICAgKiBTZXR1cCByZXRyaWV2ZWQgZnJvbSB0aGUgc2VydmVyIGNvbmZpZ3VyYXRpb24uXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLnNldHVwID0gdGhpcy5fc2hhcmVkQ29uZmlnLmdldChjb25maWdJdGVtKTtcblxuICAgIGlmICh0aGlzLnNldHVwID09PSBudWxsKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcIiR7U0VSVklDRV9JRH1cIjogc2VydmVyLmNvbmZpZy4ke2NvbmZpZ0l0ZW19IGlzIG5vdCBkZWZpbmVkYCk7XG5cbiAgICAvKipcbiAgICAgKiBNYXhpbXVtIG51bWJlciBvZiBjbGllbnRzIGNoZWNrZWQgaW4gKG1heSBsaW1pdCBvciBiZSBsaW1pdGVkIGJ5IHRoZVxuICAgICAqIG51bWJlciBvZiBwcmVkZWZpbmVkIGxhYmVscyBhbmQvb3IgY29vcmRpbmF0ZXMpLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5jYXBhY2l0eSA9IGdldE9wdCh0aGlzLnNldHVwICYmIHRoaXMuc2V0dXAuY2FwYWNpdHksIEluZmluaXR5LCAxKTtcblxuICAgIC8qKlxuICAgICAqIExpc3Qgb2YgdGhlIGNsaWVudHMgY2hlY2tlZCBpbiBhdCB0aGVpciBjb3JyZXNwb25kaW5nIGluZGljZXMuXG4gICAgICogQHR5cGUge0NsaWVudFtdfVxuICAgICAqL1xuICAgIHRoaXMuY2xpZW50cyA9IFtdO1xuXG4gICAgLyoqIEBwcml2YXRlICovXG4gICAgdGhpcy5fYXZhaWxhYmxlSW5kaWNlcyA9IFtdOyAvLyBhcnJheSBvZiBhdmFpbGFibGUgaW5kaWNlc1xuICAgIHRoaXMuX25leHRBc2NlbmRpbmdJbmRleCA9IDA7IC8vIG5leHQgaW5kZXggd2hlbiBfYXZhaWxhYmxlSW5kaWNlcyBpcyBlbXB0eVxuXG4gICAgY29uc3Qgc2V0dXAgPSB0aGlzLm9wdGlvbnMuc2V0dXA7XG5cbiAgICBpZiAoc2V0dXApIHtcbiAgICAgIGNvbnN0IG51bUxhYmVscyA9IHNldHVwLmxhYmVscyA/IHNldHVwLmxhYmVscy5sZW5ndGggOiBJbmZpbml0eTtcbiAgICAgIGNvbnN0IG51bUNvb3JkaW5hdGVzID0gc2V0dXAuY29vcmRpbmF0ZXMgPyBzZXR1cC5jb29yZGluYXRlcy5sZW5ndGggOiBJbmZpbml0eTtcbiAgICAgIGNvbnN0IG51bVBvc2l0aW9ucyA9IE1hdGgubWluKG51bUxhYmVscywgbnVtQ29vcmRpbmF0ZXMpO1xuXG4gICAgICBpZiAodGhpcy5jYXBhY2l0eSA+IG51bVBvc2l0aW9ucylcbiAgICAgICAgdGhpcy5jYXBhY2l0eSA9IG51bVBvc2l0aW9ucztcbiAgICB9XG5cbiAgICB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX2dldFJhbmRvbUluZGV4KCkge1xuICAgIGZvciAobGV0IGkgPSB0aGlzLl9uZXh0QXNjZW5kaW5nSW5kZXg7IGkgPCB0aGlzLmNhcGFjaXR5OyBpKyspXG4gICAgICB0aGlzLl9hdmFpbGFibGVJbmRpY2VzLnB1c2goaSk7XG5cbiAgICB0aGlzLl9uZXh0QXNjZW5kaW5nSW5kZXggPSB0aGlzLmNhcGFjaXR5O1xuICAgIGNvbnN0IG51bUF2YWlsYWJsZSA9IHRoaXMuX2F2YWlsYWJsZUluZGljZXMubGVuZ3RoO1xuXG4gICAgaWYgKG51bUF2YWlsYWJsZSA+IDApIHtcbiAgICAgIGNvbnN0IHJhbmRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG51bUF2YWlsYWJsZSk7XG4gICAgICByZXR1cm4gdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5zcGxpY2UocmFuZG9tLCAxKVswXTtcbiAgICB9XG5cbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX2dldEFzY2VuZGluZ0luZGV4KCkge1xuICAgIGlmICh0aGlzLl9hdmFpbGFibGVJbmRpY2VzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuX2F2YWlsYWJsZUluZGljZXMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgIHJldHVybiBhIC0gYjtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5zcGxpY2UoMCwgMSlbMF07XG4gICAgfSBlbHNlIGlmICh0aGlzLl9uZXh0QXNjZW5kaW5nSW5kZXggPCB0aGlzLmNhcGFjaXR5KSB7XG4gICAgICByZXR1cm4gdGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4Kys7XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9yZWxlYXNlSW5kZXgoaW5kZXgpIHtcbiAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihpbmRleCkpXG4gICAgICB0aGlzLl9hdmFpbGFibGVJbmRpY2VzLnB1c2goaW5kZXgpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vblJlcXVlc3QoY2xpZW50KSB7XG4gICAgcmV0dXJuIChvcmRlcikgPT4ge1xuICAgICAgbGV0IGluZGV4ID0gLTE7XG5cbiAgICAgIGlmIChvcmRlciA9PT0gJ3JhbmRvbScgJiYgdGhpcy5jYXBhY2l0eSAhPT0gSW5maW5pdHkpXG4gICAgICAgIGluZGV4ID0gdGhpcy5fZ2V0UmFuZG9tSW5kZXgoKTtcbiAgICAgIGVsc2UgLy8gaWYgKG9yZGVyID09PSAnYWNzZW5kaW5nJylcbiAgICAgICAgaW5kZXggPSB0aGlzLl9nZXRBc2NlbmRpbmdJbmRleCgpO1xuXG4gICAgICBjbGllbnQuaW5kZXggPSBpbmRleDtcblxuICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgY29uc3Qgc2V0dXAgPSB0aGlzLnNldHVwO1xuICAgICAgICBsZXQgbGFiZWw7XG4gICAgICAgIGxldCBjb29yZGluYXRlcztcblxuICAgICAgICBpZiAoc2V0dXApIHtcbiAgICAgICAgICBsYWJlbCA9IHNldHVwLmxhYmVscyA/IHNldHVwLmxhYmVsc1tpbmRleF0gOiB1bmRlZmluZWQ7XG4gICAgICAgICAgY29vcmRpbmF0ZXMgPSBzZXR1cC5jb29yZGluYXRlcyA/IHNldHVwLmNvb3JkaW5hdGVzW2luZGV4XSA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgIGNsaWVudC5sYWJlbCA9IGxhYmVsO1xuXG4gICAgICAgICAgaWYgKGNsaWVudC5jb29yZGluYXRlcyA9PT0gbnVsbClcbiAgICAgICAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jbGllbnRzW2luZGV4XSA9IGNsaWVudDtcbiAgICAgICAgdGhpcy5zZW5kKGNsaWVudCwgJ3Bvc2l0aW9uJywgaW5kZXgsIGxhYmVsLCBjb29yZGluYXRlcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNlbmQoY2xpZW50LCAndW5hdmFpbGFibGUnKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3JlcXVlc3QnLCB0aGlzLl9vblJlcXVlc3QoY2xpZW50KSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgZGlzY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5kaXNjb25uZWN0KGNsaWVudCk7XG5cbiAgICBjb25zdCBpbmRleCA9IGNsaWVudC5pbmRleDtcblxuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICBkZWxldGUgdGhpcy5jbGllbnRzW2luZGV4XTtcbiAgICAgIHRoaXMuX3JlbGVhc2VJbmRleChpbmRleCk7XG4gICAgfVxuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIENoZWNraW4pO1xuXG5leHBvcnQgZGVmYXVsdCBDaGVja2luO1xuIl19