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

var _ServerActivity2 = require('../core/ServerActivity');

var _ServerActivity3 = _interopRequireDefault(_ServerActivity2);

var _serverServiceManager = require('../core/serverServiceManager');

var _serverServiceManager2 = _interopRequireDefault(_serverServiceManager);

var _helpers = require('../../utils/helpers');

var _server = require('../core/server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:placer';
var maxCapacity = 9999;

/**
 * [server] Allow to select a place within a set of predefined positions (i.e. labels and/or coordinates).
 * This service consumme a setup as defined in the server configuration
 * (see {@link src/server/core/server.js~appConfig} for details).
 *
 * (See also {@link src/client/services/ClientPlacer.js~ClientPlacer} on the client side)
 */

var ServerPlacer = function (_ServerActivity) {
  (0, _inherits3.default)(ServerPlacer, _ServerActivity);

  function ServerPlacer() {
    (0, _classCallCheck3.default)(this, ServerPlacer);


    /**
     * @type {Object} defaults - Defaults options of the service
     * @attribute {String} [defaults.setupConfigItem='setup'] - The path to the server's setup
     *  configuration entry (see {@link src/server/core/server.js~appConfig} for details).
     */

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ServerPlacer).call(this, SERVICE_ID));

    var defaults = {
      setupConfigItem: 'setup'
    };

    _this.configure(defaults);
    _this._sharedConfigService = _this.require('shared-config');
    return _this;
  }

  /** @inheritdoc */


  (0, _createClass3.default)(ServerPlacer, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      (0, _get3.default)((0, _getPrototypeOf2.default)(ServerPlacer.prototype), 'start', this).call(this);

      var setupConfigItem = this.options.setupConfigItem;

      /**
       * Setup defining dimensions and predefined positions (labels and/or coordinates).
       * @type {Object}
       */
      this.setup = this._sharedConfigService.get(setupConfigItem);

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
       * List of clients checked in with corresponing indices.
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
        _this2._sharedConfigService.addItem(setupConfigItem, clientType);
      });
    }

    /**
     * Store the client in a given position.
     * @returns {Boolean} - `true` if succeed, `false` if not
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
        var setupConfigItem = _this3.options.setupConfigItem;
        var disabledPositions = _this3.disabledPositions;
        // aknowledge
        if (_this3.numClients < _this3.setup.capacity) _this3.send(client, 'aknowlegde', setupConfigItem, disabledPositions);else _this3.send('reject', disabledPositions);
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

    /** @inheritdoc */

  }, {
    key: 'connect',
    value: function connect(client) {
      (0, _get3.default)((0, _getPrototypeOf2.default)(ServerPlacer.prototype), 'connect', this).call(this, client);

      this.receive(client, 'request', this._onRequest(client));
      this.receive(client, 'position', this._onPosition(client));
    }

    /** @inheritdoc */

  }, {
    key: 'disconnect',
    value: function disconnect(client) {
      (0, _get3.default)((0, _getPrototypeOf2.default)(ServerPlacer.prototype), 'disconnect', this).call(this, client);

      this._removeClientPosition(client.index, client);
      // @todo - check if something more subtile than a broadcast can be done.
      this.broadcast(null, client, 'client-leaved', this.disabledPositions);
    }
  }]);
  return ServerPlacer;
}(_ServerActivity3.default);

_serverServiceManager2.default.register(SERVICE_ID, ServerPlacer);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlcnZlclBsYWNlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFFQTs7Ozs7O0FBRUEsSUFBTSxhQUFhLGdCQUFiO0FBQ04sSUFBTSxjQUFjLElBQWQ7Ozs7Ozs7Ozs7SUFTQTs7O0FBQ0osV0FESSxZQUNKLEdBQWM7d0NBRFYsY0FDVTs7Ozs7Ozs7OzZGQURWLHlCQUVJLGFBRE07O0FBUVosUUFBTSxXQUFXO0FBQ2YsdUJBQWlCLE9BQWpCO0tBREksQ0FSTTs7QUFZWixVQUFLLFNBQUwsQ0FBZSxRQUFmLEVBWlk7QUFhWixVQUFLLG9CQUFMLEdBQTRCLE1BQUssT0FBTCxDQUFhLGVBQWIsQ0FBNUIsQ0FiWTs7R0FBZDs7Ozs7NkJBREk7OzRCQWtCSTs7O0FBQ04sdURBbkJFLGtEQW1CRixDQURNOztBQUdOLFVBQU0sa0JBQWtCLEtBQUssT0FBTCxDQUFhLGVBQWI7Ozs7OztBQUhsQixVQVNOLENBQUssS0FBTCxHQUFhLEtBQUssb0JBQUwsQ0FBMEIsR0FBMUIsQ0FBOEIsZUFBOUIsQ0FBYixDQVRNOztBQVdOLFVBQUksQ0FBQyxLQUFLLEtBQUwsQ0FBVyxxQkFBWCxFQUNILEtBQUssS0FBTCxDQUFXLHFCQUFYLEdBQW1DLENBQW5DLENBREY7Ozs7OztBQVhNLFVBa0JOLENBQUssUUFBTCxHQUFnQixxQkFBTyxLQUFLLEtBQUwsQ0FBVyxRQUFYLEVBQXFCLFFBQTVCLEVBQXNDLENBQXRDLENBQWhCLENBbEJNOztBQW9CTixVQUFJLEtBQUssS0FBTCxFQUFZO0FBQ2QsWUFBTSxRQUFRLEtBQUssS0FBTCxDQURBO0FBRWQsWUFBTSx3QkFBd0IsTUFBTSxxQkFBTixDQUZoQjtBQUdkLFlBQU0sWUFBWSxNQUFNLE1BQU4sR0FBZSxNQUFNLE1BQU4sQ0FBYSxNQUFiLEdBQXNCLFFBQXJDLENBSEo7QUFJZCxZQUFNLGlCQUFpQixNQUFNLFdBQU4sR0FBb0IsTUFBTSxXQUFOLENBQWtCLE1BQWxCLEdBQTJCLFFBQS9DLENBSlQ7QUFLZCxZQUFNLGVBQWUsS0FBSyxHQUFMLENBQVMsU0FBVCxFQUFvQixjQUFwQixJQUFzQyxxQkFBdEMsQ0FMUDs7QUFPZCxZQUFJLEtBQUssUUFBTCxHQUFnQixZQUFoQixFQUNGLEtBQUssUUFBTCxHQUFnQixZQUFoQixDQURGO09BUEY7O0FBV0EsVUFBSSxLQUFLLFFBQUwsR0FBZ0IsV0FBaEIsRUFDRixLQUFLLFFBQUwsR0FBZ0IsV0FBaEIsQ0FERjs7Ozs7O0FBL0JNLFVBc0NOLENBQUssT0FBTCxHQUFlLEVBQWY7Ozs7OztBQXRDTSxVQTRDTixDQUFLLFVBQUwsR0FBa0IsQ0FBbEI7Ozs7OztBQTVDTSxVQWtETixDQUFLLGlCQUFMLEdBQXlCLEVBQXpCOzs7QUFsRE0sVUFxRE4sQ0FBSyxLQUFMLENBQVcsUUFBWCxHQUFzQixLQUFLLFFBQUw7OztBQXJEaEIsVUF3RE4sQ0FBSyxXQUFMLENBQWlCLE9BQWpCLENBQXlCLFVBQUMsVUFBRCxFQUFnQjtBQUN2QyxlQUFLLG9CQUFMLENBQTBCLE9BQTFCLENBQWtDLGVBQWxDLEVBQW1ELFVBQW5ELEVBRHVDO09BQWhCLENBQXpCLENBeERNOzs7Ozs7Ozs7O3lDQWlFYSxlQUFlLFFBQVE7QUFDMUMsVUFBSSxDQUFDLEtBQUssT0FBTCxDQUFhLGFBQWIsQ0FBRCxFQUNGLEtBQUssT0FBTCxDQUFhLGFBQWIsSUFBOEIsRUFBOUIsQ0FERjs7QUFHQSxVQUFNLE9BQU8sS0FBSyxPQUFMLENBQWEsYUFBYixDQUFQLENBSm9DOztBQU0xQyxVQUFJLEtBQUssTUFBTCxHQUFjLEtBQUssS0FBTCxDQUFXLHFCQUFYLElBQ2QsS0FBSyxVQUFMLEdBQWtCLEtBQUssUUFBTCxFQUNwQjtBQUNBLGFBQUssSUFBTCxDQUFVLE1BQVYsRUFEQTtBQUVBLGFBQUssVUFBTCxJQUFtQixDQUFuQjs7O0FBRkEsWUFLSSxLQUFLLE1BQUwsSUFBZSxLQUFLLEtBQUwsQ0FBVyxxQkFBWCxFQUNqQixLQUFLLGlCQUFMLENBQXVCLElBQXZCLENBQTRCLGFBQTVCLEVBREY7O0FBR0EsZUFBTyxJQUFQLENBUkE7T0FGRjs7QUFhQSxhQUFPLEtBQVAsQ0FuQjBDOzs7Ozs7Ozs7MENBeUJ0QixlQUFlLFFBQVE7QUFDM0MsVUFBTSxPQUFPLEtBQUssT0FBTCxDQUFhLGFBQWIsS0FBK0IsRUFBL0IsQ0FEOEI7QUFFM0MsVUFBTSxjQUFjLEtBQUssT0FBTCxDQUFhLE1BQWIsQ0FBZCxDQUZxQzs7QUFJM0MsVUFBSSxnQkFBZ0IsQ0FBQyxDQUFELEVBQUk7QUFDdEIsYUFBSyxNQUFMLENBQVksV0FBWixFQUF5QixDQUF6Qjs7QUFEc0IsWUFHbEIsS0FBSyxNQUFMLEdBQWMsS0FBSyxLQUFMLENBQVcscUJBQVgsRUFBa0M7QUFDbEQsY0FBTSxnQkFBZ0IsS0FBSyxpQkFBTCxDQUF1QixPQUF2QixDQUErQixhQUEvQixDQUFoQixDQUQ0Qzs7QUFHbEQsY0FBSSxrQkFBa0IsQ0FBQyxDQUFELEVBQ3BCLEtBQUssaUJBQUwsQ0FBdUIsTUFBdkIsQ0FBOEIsYUFBOUIsRUFBNkMsQ0FBN0MsRUFERjtTQUhGOztBQU9BLGFBQUssVUFBTCxJQUFtQixDQUFuQixDQVZzQjtPQUF4Qjs7Ozs7OzsrQkFlUyxRQUFROzs7QUFDakIsYUFBTyxZQUFNO0FBQ1gsWUFBTSxrQkFBa0IsT0FBSyxPQUFMLENBQWEsZUFBYixDQURiO0FBRVgsWUFBTSxvQkFBb0IsT0FBSyxpQkFBTDs7QUFGZixZQUlQLE9BQUssVUFBTCxHQUFrQixPQUFLLEtBQUwsQ0FBVyxRQUFYLEVBQ3BCLE9BQUssSUFBTCxDQUFVLE1BQVYsRUFBa0IsWUFBbEIsRUFBZ0MsZUFBaEMsRUFBaUQsaUJBQWpELEVBREYsS0FHRSxPQUFLLElBQUwsQ0FBVSxRQUFWLEVBQW9CLGlCQUFwQixFQUhGO09BSkssQ0FEVTs7Ozs7OztnQ0FhUCxRQUFROzs7QUFDbEIsYUFBTyxVQUFDLEtBQUQsRUFBUSxLQUFSLEVBQWUsV0FBZixFQUErQjtBQUNwQyxZQUFNLFVBQVUsT0FBSyxvQkFBTCxDQUEwQixLQUExQixFQUFpQyxNQUFqQyxDQUFWLENBRDhCOztBQUdwQyxZQUFJLE9BQUosRUFBYTtBQUNYLGlCQUFPLEtBQVAsR0FBZSxLQUFmLENBRFc7QUFFWCxpQkFBTyxLQUFQLEdBQWUsS0FBZixDQUZXO0FBR1gsaUJBQU8sV0FBUCxHQUFxQixXQUFyQixDQUhXOztBQUtYLGlCQUFLLElBQUwsQ0FBVSxNQUFWLEVBQWtCLFNBQWxCLEVBQTZCLEtBQTdCLEVBQW9DLEtBQXBDLEVBQTJDLFdBQTNDOztBQUxXLGdCQU9YLENBQUssU0FBTCxDQUFlLElBQWYsRUFBcUIsTUFBckIsRUFBNkIsZUFBN0IsRUFBOEMsT0FBSyxpQkFBTCxDQUE5QyxDQVBXO1NBQWIsTUFRTztBQUNMLGlCQUFLLElBQUwsQ0FBVSxNQUFWLEVBQWtCLFFBQWxCLEVBQTRCLE9BQUssaUJBQUwsQ0FBNUIsQ0FESztTQVJQO09BSEssQ0FEVzs7Ozs7Ozs0QkFtQlosUUFBUTtBQUNkLHVEQWhLRSxxREFnS1ksT0FBZCxDQURjOztBQUdkLFdBQUssT0FBTCxDQUFhLE1BQWIsRUFBcUIsU0FBckIsRUFBZ0MsS0FBSyxVQUFMLENBQWdCLE1BQWhCLENBQWhDLEVBSGM7QUFJZCxXQUFLLE9BQUwsQ0FBYSxNQUFiLEVBQXFCLFVBQXJCLEVBQWlDLEtBQUssV0FBTCxDQUFpQixNQUFqQixDQUFqQyxFQUpjOzs7Ozs7OytCQVFMLFFBQVE7QUFDakIsdURBeEtFLHdEQXdLZSxPQUFqQixDQURpQjs7QUFHakIsV0FBSyxxQkFBTCxDQUEyQixPQUFPLEtBQVAsRUFBYyxNQUF6Qzs7QUFIaUIsVUFLakIsQ0FBSyxTQUFMLENBQWUsSUFBZixFQUFxQixNQUFyQixFQUE2QixlQUE3QixFQUE4QyxLQUFLLGlCQUFMLENBQTlDLENBTGlCOzs7U0F2S2Y7OztBQWdMTiwrQkFBcUIsUUFBckIsQ0FBOEIsVUFBOUIsRUFBMEMsWUFBMUMiLCJmaWxlIjoiU2VydmVyUGxhY2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZlckFjdGl2aXR5IGZyb20gJy4uL2NvcmUvU2VydmVyQWN0aXZpdHknO1xuaW1wb3J0IHNlcnZlclNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmVyU2VydmljZU1hbmFnZXInO1xuaW1wb3J0IHsgZ2V0T3B0IH0gZnJvbSAnLi4vLi4vdXRpbHMvaGVscGVycyc7XG5cbmltcG9ydCBzZXJ2ZXIgZnJvbSAnLi4vY29yZS9zZXJ2ZXInO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6cGxhY2VyJztcbmNvbnN0IG1heENhcGFjaXR5ID0gOTk5OTtcblxuLyoqXG4gKiBbc2VydmVyXSBBbGxvdyB0byBzZWxlY3QgYSBwbGFjZSB3aXRoaW4gYSBzZXQgb2YgcHJlZGVmaW5lZCBwb3NpdGlvbnMgKGkuZS4gbGFiZWxzIGFuZC9vciBjb29yZGluYXRlcykuXG4gKiBUaGlzIHNlcnZpY2UgY29uc3VtbWUgYSBzZXR1cCBhcyBkZWZpbmVkIGluIHRoZSBzZXJ2ZXIgY29uZmlndXJhdGlvblxuICogKHNlZSB7QGxpbmsgc3JjL3NlcnZlci9jb3JlL3NlcnZlci5qc35hcHBDb25maWd9IGZvciBkZXRhaWxzKS5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9jbGllbnQvc2VydmljZXMvQ2xpZW50UGxhY2VyLmpzfkNsaWVudFBsYWNlcn0gb24gdGhlIGNsaWVudCBzaWRlKVxuICovXG5jbGFzcyBTZXJ2ZXJQbGFjZXIgZXh0ZW5kcyBTZXJ2ZXJBY3Rpdml0eSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQpO1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge09iamVjdH0gZGVmYXVsdHMgLSBEZWZhdWx0cyBvcHRpb25zIG9mIHRoZSBzZXJ2aWNlXG4gICAgICogQGF0dHJpYnV0ZSB7U3RyaW5nfSBbZGVmYXVsdHMuc2V0dXBDb25maWdJdGVtPSdzZXR1cCddIC0gVGhlIHBhdGggdG8gdGhlIHNlcnZlcidzIHNldHVwXG4gICAgICogIGNvbmZpZ3VyYXRpb24gZW50cnkgKHNlZSB7QGxpbmsgc3JjL3NlcnZlci9jb3JlL3NlcnZlci5qc35hcHBDb25maWd9IGZvciBkZXRhaWxzKS5cbiAgICAgKi9cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIHNldHVwQ29uZmlnSXRlbTogJ3NldHVwJyxcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuICAgIHRoaXMuX3NoYXJlZENvbmZpZ1NlcnZpY2UgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1jb25maWcnKTtcbiAgfVxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgY29uc3Qgc2V0dXBDb25maWdJdGVtID0gdGhpcy5vcHRpb25zLnNldHVwQ29uZmlnSXRlbTtcblxuICAgIC8qKlxuICAgICAqIFNldHVwIGRlZmluaW5nIGRpbWVuc2lvbnMgYW5kIHByZWRlZmluZWQgcG9zaXRpb25zIChsYWJlbHMgYW5kL29yIGNvb3JkaW5hdGVzKS5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuc2V0dXAgPSB0aGlzLl9zaGFyZWRDb25maWdTZXJ2aWNlLmdldChzZXR1cENvbmZpZ0l0ZW0pO1xuXG4gICAgaWYgKCF0aGlzLnNldHVwLm1heENsaWVudHNQZXJQb3NpdGlvbilcbiAgICAgIHRoaXMuc2V0dXAubWF4Q2xpZW50c1BlclBvc2l0aW9uID0gMTtcblxuICAgIC8qKlxuICAgICAqIE1heGltdW0gbnVtYmVyIG9mIHBsYWNlcy5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuY2FwYWNpdHkgPSBnZXRPcHQodGhpcy5zZXR1cC5jYXBhY2l0eSwgSW5maW5pdHksIDEpO1xuXG4gICAgaWYgKHRoaXMuc2V0dXApIHtcbiAgICAgIGNvbnN0IHNldHVwID0gdGhpcy5zZXR1cDtcbiAgICAgIGNvbnN0IG1heENsaWVudHNQZXJQb3NpdGlvbiA9IHNldHVwLm1heENsaWVudHNQZXJQb3NpdGlvbjtcbiAgICAgIGNvbnN0IG51bUxhYmVscyA9IHNldHVwLmxhYmVscyA/IHNldHVwLmxhYmVscy5sZW5ndGggOiBJbmZpbml0eTtcbiAgICAgIGNvbnN0IG51bUNvb3JkaW5hdGVzID0gc2V0dXAuY29vcmRpbmF0ZXMgPyBzZXR1cC5jb29yZGluYXRlcy5sZW5ndGggOiBJbmZpbml0eTtcbiAgICAgIGNvbnN0IG51bVBvc2l0aW9ucyA9IE1hdGgubWluKG51bUxhYmVscywgbnVtQ29vcmRpbmF0ZXMpICogbWF4Q2xpZW50c1BlclBvc2l0aW9uO1xuXG4gICAgICBpZiAodGhpcy5jYXBhY2l0eSA+IG51bVBvc2l0aW9ucylcbiAgICAgICAgdGhpcy5jYXBhY2l0eSA9IG51bVBvc2l0aW9ucztcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jYXBhY2l0eSA+IG1heENhcGFjaXR5KVxuICAgICAgdGhpcy5jYXBhY2l0eSA9IG1heENhcGFjaXR5O1xuXG4gICAgLyoqXG4gICAgICogTGlzdCBvZiBjbGllbnRzIGNoZWNrZWQgaW4gd2l0aCBjb3JyZXNwb25pbmcgaW5kaWNlcy5cbiAgICAgKiBAdHlwZSB7T2JqZWN0PE51bWJlciwgQXJyYXk+fVxuICAgICAqL1xuICAgIHRoaXMuY2xpZW50cyA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogTnVtYmVyIG9mIGNvbm5lY3RlZCBjbGllbnRzLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5udW1DbGllbnRzID0gMDtcblxuICAgIC8qKlxuICAgICAqIExpc3Qgb2YgdGhlIGluZGV4ZXMgb2YgdGhlIGRpc2FibGVkIHBvc2l0aW9ucy5cbiAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICovXG4gICAgdGhpcy5kaXNhYmxlZFBvc2l0aW9ucyA9IFtdO1xuXG4gICAgLy8gdXBkYXRlIGNvbmZpZyBjYXBhY2l0eSB3aXRoIGNvbXB1dGVkIG9uZVxuICAgIHRoaXMuc2V0dXAuY2FwYWNpdHkgPSB0aGlzLmNhcGFjaXR5O1xuXG4gICAgLy8gYWRkIHBhdGggdG8gc2hhcmVkIGNvbmZpZyByZXF1aXJlbWVudHMgZm9yIGFsbCBjbGllbnQgdHlwZVxuICAgIHRoaXMuY2xpZW50VHlwZXMuZm9yRWFjaCgoY2xpZW50VHlwZSkgPT4ge1xuICAgICAgdGhpcy5fc2hhcmVkQ29uZmlnU2VydmljZS5hZGRJdGVtKHNldHVwQ29uZmlnSXRlbSwgY2xpZW50VHlwZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU3RvcmUgdGhlIGNsaWVudCBpbiBhIGdpdmVuIHBvc2l0aW9uLlxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gLSBgdHJ1ZWAgaWYgc3VjY2VlZCwgYGZhbHNlYCBpZiBub3RcbiAgICovXG4gIF9zdG9yZUNsaWVudFBvc2l0aW9uKHBvc2l0aW9uSW5kZXgsIGNsaWVudCkge1xuICAgIGlmICghdGhpcy5jbGllbnRzW3Bvc2l0aW9uSW5kZXhdKVxuICAgICAgdGhpcy5jbGllbnRzW3Bvc2l0aW9uSW5kZXhdID0gW107XG5cbiAgICBjb25zdCBsaXN0ID0gdGhpcy5jbGllbnRzW3Bvc2l0aW9uSW5kZXhdO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoIDwgdGhpcy5zZXR1cC5tYXhDbGllbnRzUGVyUG9zaXRpb24gJiZcbiAgICAgICAgdGhpcy5udW1DbGllbnRzIDwgdGhpcy5jYXBhY2l0eVxuICAgICkge1xuICAgICAgbGlzdC5wdXNoKGNsaWVudCk7XG4gICAgICB0aGlzLm51bUNsaWVudHMgKz0gMTtcblxuICAgICAgLy8gaWYgbGFzdCBhdmFpbGFibGUgcGxhY2UgZm9yIHRoaXMgcG9zaXRpb24sIGxvY2sgaXRcbiAgICAgIGlmIChsaXN0Lmxlbmd0aCA+PSB0aGlzLnNldHVwLm1heENsaWVudHNQZXJQb3NpdGlvbilcbiAgICAgICAgdGhpcy5kaXNhYmxlZFBvc2l0aW9ucy5wdXNoKHBvc2l0aW9uSW5kZXgpO1xuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHRoZSBjbGllbnQgZnJvbSBhIGdpdmVuIHBvc2l0aW9uLlxuICAgKi9cbiAgX3JlbW92ZUNsaWVudFBvc2l0aW9uKHBvc2l0aW9uSW5kZXgsIGNsaWVudCkge1xuICAgIGNvbnN0IGxpc3QgPSB0aGlzLmNsaWVudHNbcG9zaXRpb25JbmRleF0gfHzCoFtdO1xuICAgIGNvbnN0IGNsaWVudEluZGV4ID0gbGlzdC5pbmRleE9mKGNsaWVudCk7XG5cbiAgICBpZiAoY2xpZW50SW5kZXggIT09IC0xKSB7XG4gICAgICBsaXN0LnNwbGljZShjbGllbnRJbmRleCwgMSk7XG4gICAgICAvLyBjaGVjayBpZiB0aGUgbGlzdCB3YXMgbWFya2VkIGFzIGRpc2FibGVkXG4gICAgICBpZiAobGlzdC5sZW5ndGggPCB0aGlzLnNldHVwLm1heENsaWVudHNQZXJQb3NpdGlvbikge1xuICAgICAgICBjb25zdCBkaXNhYmxlZEluZGV4ID0gdGhpcy5kaXNhYmxlZFBvc2l0aW9ucy5pbmRleE9mKHBvc2l0aW9uSW5kZXgpO1xuXG4gICAgICAgIGlmIChkaXNhYmxlZEluZGV4ICE9PSAtMSlcbiAgICAgICAgICB0aGlzLmRpc2FibGVkUG9zaXRpb25zLnNwbGljZShkaXNhYmxlZEluZGV4LCAxKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5udW1DbGllbnRzIC09IDE7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vblJlcXVlc3QoY2xpZW50KSB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGNvbnN0IHNldHVwQ29uZmlnSXRlbSA9IHRoaXMub3B0aW9ucy5zZXR1cENvbmZpZ0l0ZW07XG4gICAgICBjb25zdCBkaXNhYmxlZFBvc2l0aW9ucyA9IHRoaXMuZGlzYWJsZWRQb3NpdGlvbnM7XG4gICAgICAvLyBha25vd2xlZGdlXG4gICAgICBpZiAodGhpcy5udW1DbGllbnRzIDwgdGhpcy5zZXR1cC5jYXBhY2l0eSlcbiAgICAgICAgdGhpcy5zZW5kKGNsaWVudCwgJ2Frbm93bGVnZGUnLCBzZXR1cENvbmZpZ0l0ZW0sIGRpc2FibGVkUG9zaXRpb25zKTtcbiAgICAgIGVsc2VcbiAgICAgICAgdGhpcy5zZW5kKCdyZWplY3QnLCBkaXNhYmxlZFBvc2l0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vblBvc2l0aW9uKGNsaWVudCkge1xuICAgIHJldHVybiAoaW5kZXgsIGxhYmVsLCBjb29yZGluYXRlcykgPT4ge1xuICAgICAgY29uc3Qgc3VjY2VzcyA9IHRoaXMuX3N0b3JlQ2xpZW50UG9zaXRpb24oaW5kZXgsIGNsaWVudCk7XG5cbiAgICAgIGlmIChzdWNjZXNzKSB7XG4gICAgICAgIGNsaWVudC5pbmRleCA9IGluZGV4O1xuICAgICAgICBjbGllbnQubGFiZWwgPSBsYWJlbDtcbiAgICAgICAgY2xpZW50LmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XG5cbiAgICAgICAgdGhpcy5zZW5kKGNsaWVudCwgJ2NvbmZpcm0nLCBpbmRleCwgbGFiZWwsIGNvb3JkaW5hdGVzKTtcbiAgICAgICAgLy8gQHRvZG8gLSBjaGVjayBpZiBzb21ldGhpbmcgbW9yZSBzdWJ0aWxlIHRoYW4gYSBicm9hZGNhc3QgY2FuIGJlIGRvbmUuXG4gICAgICAgIHRoaXMuYnJvYWRjYXN0KG51bGwsIGNsaWVudCwgJ2NsaWVudC1qb2luZWQnLCB0aGlzLmRpc2FibGVkUG9zaXRpb25zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2VuZChjbGllbnQsICdyZWplY3QnLCB0aGlzLmRpc2FibGVkUG9zaXRpb25zKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncmVxdWVzdCcsIHRoaXMuX29uUmVxdWVzdChjbGllbnQpKTtcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncG9zaXRpb24nLCB0aGlzLl9vblBvc2l0aW9uKGNsaWVudCkpO1xuICB9XG5cbiAgLyoqIEBpbmhlcml0ZG9jICovXG4gIGRpc2Nvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuZGlzY29ubmVjdChjbGllbnQpO1xuXG4gICAgdGhpcy5fcmVtb3ZlQ2xpZW50UG9zaXRpb24oY2xpZW50LmluZGV4LCBjbGllbnQpO1xuICAgIC8vIEB0b2RvIC0gY2hlY2sgaWYgc29tZXRoaW5nIG1vcmUgc3VidGlsZSB0aGFuIGEgYnJvYWRjYXN0IGNhbiBiZSBkb25lLlxuICAgIHRoaXMuYnJvYWRjYXN0KG51bGwsIGNsaWVudCwgJ2NsaWVudC1sZWF2ZWQnLCB0aGlzLmRpc2FibGVkUG9zaXRpb25zKTtcbiAgfVxufVxuXG5zZXJ2ZXJTZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBTZXJ2ZXJQbGFjZXIpO1xuIl19