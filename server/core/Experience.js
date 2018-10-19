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

var _serviceManager = require('./serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Base class used to build a experience on the server side.
 *
 * Along with the classic {@link src/server/core/Activity#connect} and {@link src/server/core/Activity#disconnect} methods, the base class has two additional methods:
 * - {@link Experience#enter}: called when the client enters the `Experience` (*i.e.* when the {@link src/client/scene/Experience.js~Experience} on the client side calls its {@link src/client/scene/Experience.js~Experience#start} method);
 * - {@link Experience#exit}: called when the client leaves the `Experience` (*i.e.* when the {@link src/client/scene/Experience.js~Experience} on the client side calls its {@link src/client/scene/Experience.js~Experience#done} method, or if the client disconnected from the server).
 *
 * The base class also keeps track of the clients who are currently in the performance (*i.e.* who entered but not exited yet) in the array `this.clients`.
 *
 * (See also {@link src/client/scene/Experience.js~Experience} on the client side.)
 *
 * @memberof module:soundworks/server
 */
var Experience = function (_Activity) {
  (0, _inherits3.default)(Experience, _Activity);

  function Experience(clientTypes) {
    (0, _classCallCheck3.default)(this, Experience);

    /**
     * List of the clients who are currently in the performance (*i.e.* who entered the performance and have not exited it yet).
     * @type {Client[]}
     */
    var _this = (0, _possibleConstructorReturn3.default)(this, (Experience.__proto__ || (0, _getPrototypeOf2.default)(Experience)).call(this, 'experience'));

    _this.clients = [];

    _this.addClientTypes(clientTypes);
    _this.waitFor(_serviceManager2.default.signals.ready);

    _this._errorReporter = _this.require('error-reporter');
    return _this;
  }

  /**
   * Called when the client connects to the server.
   * @param {Client} client Connected client.
   */


  (0, _createClass3.default)(Experience, [{
    key: 'connect',
    value: function connect(client) {
      var _this2 = this;

      (0, _get3.default)(Experience.prototype.__proto__ || (0, _getPrototypeOf2.default)(Experience.prototype), 'connect', this).call(this, client);

      // Listen for the `'enter'` and `'exit'` socket messages from the client.
      this.receive(client, 'enter', function () {
        return _this2.enter(client);
      });
      this.receive(client, 'exit', function () {
        return _this2.exit(client);
      });
    }

    /**
     * Called when the client disconnects from the server.
     * @param {Client} client Disconnected client.
     */

  }, {
    key: 'disconnect',
    value: function disconnect(client) {
      (0, _get3.default)(Experience.prototype.__proto__ || (0, _getPrototypeOf2.default)(Experience.prototype), 'disconnect', this).call(this, client);

      // Call the `exit` method if the client previously entered the performance.
      if (client.activities[this.id] && client.activities[this.id].entered) this.exit(client);
    }

    /**
     * Called when the client starts the performance on the client side.
     * @param {Client} client Client who enters the performance.
     */

  }, {
    key: 'enter',
    value: function enter(client) {
      // add the client to the `this.clients` array
      this.clients.push(client);
      // set flag
      client.activities[this.id].entered = true;
    }

    /**
     * Called when the client exits the performance on the client side (*i.e.*
     * when the `done` method of the client side experience is called, or when
     * the client disconnects from the server).
     * @param {Client} client - Client who exits the performance.
     */

  }, {
    key: 'exit',
    value: function exit(client) {
      // Remove the client from the `this.clients` array.
      var index = this.clients.indexOf(client);

      if (index >= 0) this.clients.splice(index, 1);

      // Remove flag.
      client.activities[this.id].entered = false;
    }
  }]);
  return Experience;
}(_Activity3.default);

exports.default = Experience;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV4cGVyaWVuY2UuanMiXSwibmFtZXMiOlsiRXhwZXJpZW5jZSIsImNsaWVudFR5cGVzIiwiY2xpZW50cyIsImFkZENsaWVudFR5cGVzIiwid2FpdEZvciIsInNlcnZpY2VNYW5hZ2VyIiwic2lnbmFscyIsInJlYWR5IiwiX2Vycm9yUmVwb3J0ZXIiLCJyZXF1aXJlIiwiY2xpZW50IiwicmVjZWl2ZSIsImVudGVyIiwiZXhpdCIsImFjdGl2aXRpZXMiLCJpZCIsImVudGVyZWQiLCJwdXNoIiwiaW5kZXgiLCJpbmRleE9mIiwic3BsaWNlIiwiQWN0aXZpdHkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUVBOzs7Ozs7Ozs7Ozs7O0lBYU1BLFU7OztBQUNKLHNCQUFZQyxXQUFaLEVBQXlCO0FBQUE7O0FBR3ZCOzs7O0FBSHVCLDhJQUNqQixZQURpQjs7QUFPdkIsVUFBS0MsT0FBTCxHQUFlLEVBQWY7O0FBRUEsVUFBS0MsY0FBTCxDQUFvQkYsV0FBcEI7QUFDQSxVQUFLRyxPQUFMLENBQWFDLHlCQUFlQyxPQUFmLENBQXVCQyxLQUFwQzs7QUFFQSxVQUFLQyxjQUFMLEdBQXNCLE1BQUtDLE9BQUwsQ0FBYSxnQkFBYixDQUF0QjtBQVp1QjtBQWF4Qjs7QUFHRDs7Ozs7Ozs7NEJBSVFDLE0sRUFBUTtBQUFBOztBQUNkLDRJQUFjQSxNQUFkOztBQUVBO0FBQ0EsV0FBS0MsT0FBTCxDQUFhRCxNQUFiLEVBQXFCLE9BQXJCLEVBQThCO0FBQUEsZUFBTSxPQUFLRSxLQUFMLENBQVdGLE1BQVgsQ0FBTjtBQUFBLE9BQTlCO0FBQ0EsV0FBS0MsT0FBTCxDQUFhRCxNQUFiLEVBQXFCLE1BQXJCLEVBQTZCO0FBQUEsZUFBTSxPQUFLRyxJQUFMLENBQVVILE1BQVYsQ0FBTjtBQUFBLE9BQTdCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7K0JBSVdBLE0sRUFBUTtBQUNqQiwrSUFBaUJBLE1BQWpCOztBQUVBO0FBQ0EsVUFBSUEsT0FBT0ksVUFBUCxDQUFrQixLQUFLQyxFQUF2QixLQUE4QkwsT0FBT0ksVUFBUCxDQUFrQixLQUFLQyxFQUF2QixFQUEyQkMsT0FBN0QsRUFDRSxLQUFLSCxJQUFMLENBQVVILE1BQVY7QUFDSDs7QUFFRDs7Ozs7OzswQkFJTUEsTSxFQUFRO0FBQ1o7QUFDQSxXQUFLUixPQUFMLENBQWFlLElBQWIsQ0FBa0JQLE1BQWxCO0FBQ0E7QUFDQUEsYUFBT0ksVUFBUCxDQUFrQixLQUFLQyxFQUF2QixFQUEyQkMsT0FBM0IsR0FBcUMsSUFBckM7QUFDRDs7QUFFRDs7Ozs7Ozs7O3lCQU1LTixNLEVBQVE7QUFDWDtBQUNBLFVBQU1RLFFBQVEsS0FBS2hCLE9BQUwsQ0FBYWlCLE9BQWIsQ0FBcUJULE1BQXJCLENBQWQ7O0FBRUEsVUFBSVEsU0FBUyxDQUFiLEVBQ0UsS0FBS2hCLE9BQUwsQ0FBYWtCLE1BQWIsQ0FBb0JGLEtBQXBCLEVBQTJCLENBQTNCOztBQUVGO0FBQ0FSLGFBQU9JLFVBQVAsQ0FBa0IsS0FBS0MsRUFBdkIsRUFBMkJDLE9BQTNCLEdBQXFDLEtBQXJDO0FBQ0Q7OztFQW5Fc0JLLGtCOztrQkFzRVZyQixVIiwiZmlsZSI6IkV4cGVyaWVuY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWN0aXZpdHkgZnJvbSAnLi9BY3Rpdml0eSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi9zZXJ2aWNlTWFuYWdlcic7XG5cbi8qKlxuICogQmFzZSBjbGFzcyB1c2VkIHRvIGJ1aWxkIGEgZXhwZXJpZW5jZSBvbiB0aGUgc2VydmVyIHNpZGUuXG4gKlxuICogQWxvbmcgd2l0aCB0aGUgY2xhc3NpYyB7QGxpbmsgc3JjL3NlcnZlci9jb3JlL0FjdGl2aXR5I2Nvbm5lY3R9IGFuZCB7QGxpbmsgc3JjL3NlcnZlci9jb3JlL0FjdGl2aXR5I2Rpc2Nvbm5lY3R9IG1ldGhvZHMsIHRoZSBiYXNlIGNsYXNzIGhhcyB0d28gYWRkaXRpb25hbCBtZXRob2RzOlxuICogLSB7QGxpbmsgRXhwZXJpZW5jZSNlbnRlcn06IGNhbGxlZCB3aGVuIHRoZSBjbGllbnQgZW50ZXJzIHRoZSBgRXhwZXJpZW5jZWAgKCppLmUuKiB3aGVuIHRoZSB7QGxpbmsgc3JjL2NsaWVudC9zY2VuZS9FeHBlcmllbmNlLmpzfkV4cGVyaWVuY2V9IG9uIHRoZSBjbGllbnQgc2lkZSBjYWxscyBpdHMge0BsaW5rIHNyYy9jbGllbnQvc2NlbmUvRXhwZXJpZW5jZS5qc35FeHBlcmllbmNlI3N0YXJ0fSBtZXRob2QpO1xuICogLSB7QGxpbmsgRXhwZXJpZW5jZSNleGl0fTogY2FsbGVkIHdoZW4gdGhlIGNsaWVudCBsZWF2ZXMgdGhlIGBFeHBlcmllbmNlYCAoKmkuZS4qIHdoZW4gdGhlIHtAbGluayBzcmMvY2xpZW50L3NjZW5lL0V4cGVyaWVuY2UuanN+RXhwZXJpZW5jZX0gb24gdGhlIGNsaWVudCBzaWRlIGNhbGxzIGl0cyB7QGxpbmsgc3JjL2NsaWVudC9zY2VuZS9FeHBlcmllbmNlLmpzfkV4cGVyaWVuY2UjZG9uZX0gbWV0aG9kLCBvciBpZiB0aGUgY2xpZW50IGRpc2Nvbm5lY3RlZCBmcm9tIHRoZSBzZXJ2ZXIpLlxuICpcbiAqIFRoZSBiYXNlIGNsYXNzIGFsc28ga2VlcHMgdHJhY2sgb2YgdGhlIGNsaWVudHMgd2hvIGFyZSBjdXJyZW50bHkgaW4gdGhlIHBlcmZvcm1hbmNlICgqaS5lLiogd2hvIGVudGVyZWQgYnV0IG5vdCBleGl0ZWQgeWV0KSBpbiB0aGUgYXJyYXkgYHRoaXMuY2xpZW50c2AuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvY2xpZW50L3NjZW5lL0V4cGVyaWVuY2UuanN+RXhwZXJpZW5jZX0gb24gdGhlIGNsaWVudCBzaWRlLilcbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyXG4gKi9cbmNsYXNzIEV4cGVyaWVuY2UgZXh0ZW5kcyBBY3Rpdml0eSB7XG4gIGNvbnN0cnVjdG9yKGNsaWVudFR5cGVzKSB7XG4gICAgc3VwZXIoJ2V4cGVyaWVuY2UnKTtcblxuICAgIC8qKlxuICAgICAqIExpc3Qgb2YgdGhlIGNsaWVudHMgd2hvIGFyZSBjdXJyZW50bHkgaW4gdGhlIHBlcmZvcm1hbmNlICgqaS5lLiogd2hvIGVudGVyZWQgdGhlIHBlcmZvcm1hbmNlIGFuZCBoYXZlIG5vdCBleGl0ZWQgaXQgeWV0KS5cbiAgICAgKiBAdHlwZSB7Q2xpZW50W119XG4gICAgICovXG4gICAgdGhpcy5jbGllbnRzID0gW107XG5cbiAgICB0aGlzLmFkZENsaWVudFR5cGVzKGNsaWVudFR5cGVzKTtcbiAgICB0aGlzLndhaXRGb3Ioc2VydmljZU1hbmFnZXIuc2lnbmFscy5yZWFkeSk7XG5cbiAgICB0aGlzLl9lcnJvclJlcG9ydGVyID0gdGhpcy5yZXF1aXJlKCdlcnJvci1yZXBvcnRlcicpO1xuICB9XG5cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGNsaWVudCBjb25uZWN0cyB0byB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IENvbm5lY3RlZCBjbGllbnQuXG4gICAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIC8vIExpc3RlbiBmb3IgdGhlIGAnZW50ZXInYCBhbmQgYCdleGl0J2Agc29ja2V0IG1lc3NhZ2VzIGZyb20gdGhlIGNsaWVudC5cbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAnZW50ZXInLCAoKSA9PiB0aGlzLmVudGVyKGNsaWVudCkpO1xuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdleGl0JywgKCkgPT4gdGhpcy5leGl0KGNsaWVudCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBjbGllbnQgZGlzY29ubmVjdHMgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IERpc2Nvbm5lY3RlZCBjbGllbnQuXG4gICAqL1xuICBkaXNjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmRpc2Nvbm5lY3QoY2xpZW50KTtcblxuICAgIC8vIENhbGwgdGhlIGBleGl0YCBtZXRob2QgaWYgdGhlIGNsaWVudCBwcmV2aW91c2x5IGVudGVyZWQgdGhlIHBlcmZvcm1hbmNlLlxuICAgIGlmIChjbGllbnQuYWN0aXZpdGllc1t0aGlzLmlkXSAmJiBjbGllbnQuYWN0aXZpdGllc1t0aGlzLmlkXS5lbnRlcmVkKVxuICAgICAgdGhpcy5leGl0KGNsaWVudCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGNsaWVudCBzdGFydHMgdGhlIHBlcmZvcm1hbmNlIG9uIHRoZSBjbGllbnQgc2lkZS5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCBDbGllbnQgd2hvIGVudGVycyB0aGUgcGVyZm9ybWFuY2UuXG4gICAqL1xuICBlbnRlcihjbGllbnQpIHtcbiAgICAvLyBhZGQgdGhlIGNsaWVudCB0byB0aGUgYHRoaXMuY2xpZW50c2AgYXJyYXlcbiAgICB0aGlzLmNsaWVudHMucHVzaChjbGllbnQpO1xuICAgIC8vIHNldCBmbGFnXG4gICAgY2xpZW50LmFjdGl2aXRpZXNbdGhpcy5pZF0uZW50ZXJlZCA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGNsaWVudCBleGl0cyB0aGUgcGVyZm9ybWFuY2Ugb24gdGhlIGNsaWVudCBzaWRlICgqaS5lLipcbiAgICogd2hlbiB0aGUgYGRvbmVgIG1ldGhvZCBvZiB0aGUgY2xpZW50IHNpZGUgZXhwZXJpZW5jZSBpcyBjYWxsZWQsIG9yIHdoZW5cbiAgICogdGhlIGNsaWVudCBkaXNjb25uZWN0cyBmcm9tIHRoZSBzZXJ2ZXIpLlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IC0gQ2xpZW50IHdobyBleGl0cyB0aGUgcGVyZm9ybWFuY2UuXG4gICAqL1xuICBleGl0KGNsaWVudCkge1xuICAgIC8vIFJlbW92ZSB0aGUgY2xpZW50IGZyb20gdGhlIGB0aGlzLmNsaWVudHNgIGFycmF5LlxuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5jbGllbnRzLmluZGV4T2YoY2xpZW50KTtcblxuICAgIGlmIChpbmRleCA+PSAwKVxuICAgICAgdGhpcy5jbGllbnRzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICAvLyBSZW1vdmUgZmxhZy5cbiAgICBjbGllbnQuYWN0aXZpdGllc1t0aGlzLmlkXS5lbnRlcmVkID0gZmFsc2U7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRXhwZXJpZW5jZTtcbiJdfQ==