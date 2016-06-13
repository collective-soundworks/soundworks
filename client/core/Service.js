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

var _Activity2 = require('./Activity');

var _Activity3 = _interopRequireDefault(_Activity2);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _serviceManager = require('./serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _Signal = require('./Signal');

var _Signal2 = _interopRequireDefault(_Signal);

var _SignalAll = require('./SignalAll');

var _SignalAll2 = _interopRequireDefault(_SignalAll);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _debug2.default)('soundworks:services');

/**
 * Base class to be extended in order to create a new service.
 *
 * @memberof module:soundworks/client
 * @extends module:soundworks/client.Activity
 */

var Service = function (_Activity) {
  (0, _inherits3.default)(Service, _Activity);

  /**
   * @param {String} id - The id of the service (should be prefixed with `'service:'`).
   * @param {Boolean} hasNetwork - Define if the service needs an access to the socket
   *  connection.
   */

  function Service(id, hasNetwork) {
    (0, _classCallCheck3.default)(this, Service);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Service).call(this, id, hasNetwork));

    _this.requiredSignals.addObserver(function (value) {
      if (value) {
        _this.start();
        _this.hasStarted = true;
      } else {
        _this.stop();
      }
    });

    /**
     * Is set to `true` when a signal is ready to be consumed.
     * @type {Signal}
     */
    _this.signals.ready = new _Signal2.default();
    // add the serviceManager bootstart signal to the required signals
    _this.requiredSignals.add(_serviceManager2.default.signals.start);
    return _this;
  }

  /**
   * Method to call in the service lifecycle when it should be considered as
   * `ready` and thus allows all its dependent activities to start themselves.
   */


  (0, _createClass3.default)(Service, [{
    key: 'ready',
    value: function ready() {
      this.stop();
      log('"' + this.id + '" ready');
      this.signals.ready.set(true);
    }

    /**
     * Allow to require another service as a dependencies. When a service is
     * dependent from another service its `start` method is delayed until all
     * its dependencies are themselves `ready`.
     * @param {String} id - id of the service to require.
     * @param {Object} options - configuration object to be passed to the service.
     */

  }, {
    key: 'require',
    value: function require(id, options) {
      var service = _serviceManager2.default.require(id, options);
      var signal = service.signals.ready;

      if (signal) this.requiredSignals.add(signal);else throw new Error('signal "continue" doesn\'t exist on service :', service);

      return service;
    }

    /**
     * Lifecycle method to initialize the service. Must be called manually.
     * @example
     * // in the `start` method implementation
     * if (!this.hasStarted)
     *   this.init();
     */

  }, {
    key: 'init',
    value: function init() {}

    /** @inheritdoc */

  }, {
    key: 'start',
    value: function start() {
      log('"' + this.id + '" started');
      (0, _get3.default)((0, _getPrototypeOf2.default)(Service.prototype), 'start', this).call(this);
    }

    /** @inheritdoc */

  }, {
    key: 'stop',
    value: function stop() {
      log('"' + this.id + '" stopped');
      (0, _get3.default)((0, _getPrototypeOf2.default)(Service.prototype), 'stop', this).call(this);
    }
  }]);
  return Service;
}(_Activity3.default);

exports.default = Service;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTSxNQUFNLHFCQUFNLHFCQUFOLENBQVo7Ozs7Ozs7OztJQVNNLE87Ozs7Ozs7OztBQU1KLG1CQUFZLEVBQVosRUFBZ0IsVUFBaEIsRUFBNEI7QUFBQTs7QUFBQSxpSEFDcEIsRUFEb0IsRUFDaEIsVUFEZ0I7O0FBRzFCLFVBQUssZUFBTCxDQUFxQixXQUFyQixDQUFpQyxVQUFDLEtBQUQsRUFBVztBQUMxQyxVQUFJLEtBQUosRUFBVztBQUNULGNBQUssS0FBTDtBQUNBLGNBQUssVUFBTCxHQUFrQixJQUFsQjtBQUNELE9BSEQsTUFHTztBQUNMLGNBQUssSUFBTDtBQUNEO0FBQ0YsS0FQRDs7Ozs7O0FBYUEsVUFBSyxPQUFMLENBQWEsS0FBYixHQUFxQixzQkFBckI7O0FBRUEsVUFBSyxlQUFMLENBQXFCLEdBQXJCLENBQXlCLHlCQUFlLE9BQWYsQ0FBdUIsS0FBaEQ7QUFsQjBCO0FBbUIzQjs7Ozs7Ozs7Ozs0QkFNTztBQUNOLFdBQUssSUFBTDtBQUNBLGdCQUFRLEtBQUssRUFBYjtBQUNBLFdBQUssT0FBTCxDQUFhLEtBQWIsQ0FBbUIsR0FBbkIsQ0FBdUIsSUFBdkI7QUFDRDs7Ozs7Ozs7Ozs7OzRCQVNPLEUsRUFBSSxPLEVBQVM7QUFDbkIsVUFBTSxVQUFVLHlCQUFlLE9BQWYsQ0FBdUIsRUFBdkIsRUFBMkIsT0FBM0IsQ0FBaEI7QUFDQSxVQUFNLFNBQVMsUUFBUSxPQUFSLENBQWdCLEtBQS9COztBQUVBLFVBQUksTUFBSixFQUNFLEtBQUssZUFBTCxDQUFxQixHQUFyQixDQUF5QixNQUF6QixFQURGLEtBR0UsTUFBTSxJQUFJLEtBQUosa0RBQTBELE9BQTFELENBQU47O0FBRUYsYUFBTyxPQUFQO0FBQ0Q7Ozs7Ozs7Ozs7OzsyQkFTTSxDQUFFOzs7Ozs7NEJBR0Q7QUFDTixnQkFBUSxLQUFLLEVBQWI7QUFDQTtBQUNEOzs7Ozs7MkJBR007QUFDTCxnQkFBUSxLQUFLLEVBQWI7QUFDQTtBQUNEOzs7OztrQkFHWSxPIiwiZmlsZSI6IlNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWN0aXZpdHkgZnJvbSAnLi9BY3Rpdml0eSc7XG5pbXBvcnQgZGVidWcgZnJvbSAnZGVidWcnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4vc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IFNpZ25hbCBmcm9tICcuL1NpZ25hbCc7XG5pbXBvcnQgU2lnbmFsQWxsIGZyb20gJy4vU2lnbmFsQWxsJztcblxuY29uc3QgbG9nID0gZGVidWcoJ3NvdW5kd29ya3M6c2VydmljZXMnKTtcblxuXG4vKipcbiAqIEJhc2UgY2xhc3MgdG8gYmUgZXh0ZW5kZWQgaW4gb3JkZXIgdG8gY3JlYXRlIGEgbmV3IHNlcnZpY2UuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQGV4dGVuZHMgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFjdGl2aXR5XG4gKi9cbmNsYXNzIFNlcnZpY2UgZXh0ZW5kcyBBY3Rpdml0eSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBUaGUgaWQgb2YgdGhlIHNlcnZpY2UgKHNob3VsZCBiZSBwcmVmaXhlZCB3aXRoIGAnc2VydmljZTonYCkuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gaGFzTmV0d29yayAtIERlZmluZSBpZiB0aGUgc2VydmljZSBuZWVkcyBhbiBhY2Nlc3MgdG8gdGhlIHNvY2tldFxuICAgKiAgY29ubmVjdGlvbi5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGlkLCBoYXNOZXR3b3JrKSB7XG4gICAgc3VwZXIoaWQsIGhhc05ldHdvcmspO1xuXG4gICAgdGhpcy5yZXF1aXJlZFNpZ25hbHMuYWRkT2JzZXJ2ZXIoKHZhbHVlKSA9PiB7XG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgICAgICB0aGlzLmhhc1N0YXJ0ZWQgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBJcyBzZXQgdG8gYHRydWVgIHdoZW4gYSBzaWduYWwgaXMgcmVhZHkgdG8gYmUgY29uc3VtZWQuXG4gICAgICogQHR5cGUge1NpZ25hbH1cbiAgICAgKi9cbiAgICB0aGlzLnNpZ25hbHMucmVhZHkgPSBuZXcgU2lnbmFsKCk7XG4gICAgLy8gYWRkIHRoZSBzZXJ2aWNlTWFuYWdlciBib290c3RhcnQgc2lnbmFsIHRvIHRoZSByZXF1aXJlZCBzaWduYWxzXG4gICAgdGhpcy5yZXF1aXJlZFNpZ25hbHMuYWRkKHNlcnZpY2VNYW5hZ2VyLnNpZ25hbHMuc3RhcnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ldGhvZCB0byBjYWxsIGluIHRoZSBzZXJ2aWNlIGxpZmVjeWNsZSB3aGVuIGl0IHNob3VsZCBiZSBjb25zaWRlcmVkIGFzXG4gICAqIGByZWFkeWAgYW5kIHRodXMgYWxsb3dzIGFsbCBpdHMgZGVwZW5kZW50IGFjdGl2aXRpZXMgdG8gc3RhcnQgdGhlbXNlbHZlcy5cbiAgICovXG4gIHJlYWR5KCkge1xuICAgIHRoaXMuc3RvcCgpO1xuICAgIGxvZyhgXCIke3RoaXMuaWR9XCIgcmVhZHlgKTtcbiAgICB0aGlzLnNpZ25hbHMucmVhZHkuc2V0KHRydWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFsbG93IHRvIHJlcXVpcmUgYW5vdGhlciBzZXJ2aWNlIGFzIGEgZGVwZW5kZW5jaWVzLiBXaGVuIGEgc2VydmljZSBpc1xuICAgKiBkZXBlbmRlbnQgZnJvbSBhbm90aGVyIHNlcnZpY2UgaXRzIGBzdGFydGAgbWV0aG9kIGlzIGRlbGF5ZWQgdW50aWwgYWxsXG4gICAqIGl0cyBkZXBlbmRlbmNpZXMgYXJlIHRoZW1zZWx2ZXMgYHJlYWR5YC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gaWQgb2YgdGhlIHNlcnZpY2UgdG8gcmVxdWlyZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBjb25maWd1cmF0aW9uIG9iamVjdCB0byBiZSBwYXNzZWQgdG8gdGhlIHNlcnZpY2UuXG4gICAqL1xuICByZXF1aXJlKGlkLCBvcHRpb25zKSB7XG4gICAgY29uc3Qgc2VydmljZSA9IHNlcnZpY2VNYW5hZ2VyLnJlcXVpcmUoaWQsIG9wdGlvbnMpO1xuICAgIGNvbnN0IHNpZ25hbCA9IHNlcnZpY2Uuc2lnbmFscy5yZWFkeTtcblxuICAgIGlmIChzaWduYWwpXG4gICAgICB0aGlzLnJlcXVpcmVkU2lnbmFscy5hZGQoc2lnbmFsKTtcbiAgICBlbHNlXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHNpZ25hbCBcImNvbnRpbnVlXCIgZG9lc24ndCBleGlzdCBvbiBzZXJ2aWNlIDpgLCBzZXJ2aWNlKTtcblxuICAgIHJldHVybiBzZXJ2aWNlO1xuICB9XG5cbiAgLyoqXG4gICAqIExpZmVjeWNsZSBtZXRob2QgdG8gaW5pdGlhbGl6ZSB0aGUgc2VydmljZS4gTXVzdCBiZSBjYWxsZWQgbWFudWFsbHkuXG4gICAqIEBleGFtcGxlXG4gICAqIC8vIGluIHRoZSBgc3RhcnRgIG1ldGhvZCBpbXBsZW1lbnRhdGlvblxuICAgKiBpZiAoIXRoaXMuaGFzU3RhcnRlZClcbiAgICogICB0aGlzLmluaXQoKTtcbiAgICovXG4gIGluaXQoKSB7fVxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICBzdGFydCgpIHtcbiAgICBsb2coYFwiJHt0aGlzLmlkfVwiIHN0YXJ0ZWRgKTtcbiAgICBzdXBlci5zdGFydCgpO1xuICB9XG5cbiAgLyoqIEBpbmhlcml0ZG9jICovXG4gIHN0b3AoKSB7XG4gICAgbG9nKGBcIiR7dGhpcy5pZH1cIiBzdG9wcGVkYCk7XG4gICAgc3VwZXIuc3RvcCgpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNlcnZpY2U7XG5cbiJdfQ==