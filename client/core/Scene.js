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

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _Activity2 = require('./Activity');

var _Activity3 = _interopRequireDefault(_Activity2);

var _serviceManager = require('./serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _Signal = require('./Signal');

var _Signal2 = _interopRequireDefault(_Signal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Base class to be extended in order to create a new scene.
 *
 * @memberof module:soundworks/client
 * @extends module:soundworks/client.Activity
 */
var Scene = function (_Activity) {
  (0, _inherits3.default)(Scene, _Activity);

  function Scene(id, hasNetwork) {
    (0, _classCallCheck3.default)(this, Scene);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Scene.__proto__ || (0, _getPrototypeOf2.default)(Scene)).call(this, id, hasNetwork));

    _this.requiredSignals.addObserver(function (value) {
      if (value) {
        _this.start();
        _this.hasStarted = true;
      } /* else {
        this.hold(); // pause / resume
        } */
    });

    _this.signals.done = new _Signal2.default();
    _this.requiredSignals.add(_serviceManager2.default.signals.ready);
    return _this;
  }

  /**
   * Returns a service configured with the given options.
   * @param {String} id - The identifier of the service.
   * @param {Object} options - The options to configure the service.
   */


  (0, _createClass3.default)(Scene, [{
    key: 'require',
    value: function require(id, options) {
      return _serviceManager2.default.require(id, options);
    }

    /**
     * Add a signal to the required signals in order for the `Scene` instance
     * to start.
     * @param {Signal} signal - The signal that must be waited for.
     * @private
     */

  }, {
    key: 'waitFor',
    value: function waitFor(signal) {
      this.requiredSignals.add(signal);
    }

    /**
     * Mark the `Scene` as terminated. The call of this method is a
     * responsibility of the client code.
     * @private
     */

  }, {
    key: 'done',
    value: function done() {
      this.hide();
      this.signals.done.set(true);
    }
  }]);
  return Scene;
}(_Activity3.default);

exports.default = Scene;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNjZW5lLmpzIl0sIm5hbWVzIjpbIlNjZW5lIiwiaWQiLCJoYXNOZXR3b3JrIiwicmVxdWlyZWRTaWduYWxzIiwiYWRkT2JzZXJ2ZXIiLCJ2YWx1ZSIsInN0YXJ0IiwiaGFzU3RhcnRlZCIsInNpZ25hbHMiLCJkb25lIiwiYWRkIiwicmVhZHkiLCJvcHRpb25zIiwicmVxdWlyZSIsInNpZ25hbCIsImhpZGUiLCJzZXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQTs7Ozs7O0lBTU1BLEs7OztBQUNKLGlCQUFZQyxFQUFaLEVBQWdCQyxVQUFoQixFQUE0QjtBQUFBOztBQUFBLG9JQUNwQkQsRUFEb0IsRUFDaEJDLFVBRGdCOztBQUcxQixVQUFLQyxlQUFMLENBQXFCQyxXQUFyQixDQUFpQyxVQUFDQyxLQUFELEVBQVc7QUFDMUMsVUFBSUEsS0FBSixFQUFXO0FBQ1QsY0FBS0MsS0FBTDtBQUNBLGNBQUtDLFVBQUwsR0FBa0IsSUFBbEI7QUFDRCxPQUp5QyxDQUl4Qzs7O0FBR0gsS0FQRDs7QUFVQSxVQUFLQyxPQUFMLENBQWFDLElBQWIsR0FBb0Isc0JBQXBCO0FBQ0EsVUFBS04sZUFBTCxDQUFxQk8sR0FBckIsQ0FBeUIseUJBQWVGLE9BQWYsQ0FBdUJHLEtBQWhEO0FBZDBCO0FBZTNCOztBQUVEOzs7Ozs7Ozs7NEJBS1FWLEUsRUFBSVcsTyxFQUFTO0FBQ25CLGFBQU8seUJBQWVDLE9BQWYsQ0FBdUJaLEVBQXZCLEVBQTJCVyxPQUEzQixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs0QkFNUUUsTSxFQUFRO0FBQ2QsV0FBS1gsZUFBTCxDQUFxQk8sR0FBckIsQ0FBeUJJLE1BQXpCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OzJCQUtPO0FBQ0wsV0FBS0MsSUFBTDtBQUNBLFdBQUtQLE9BQUwsQ0FBYUMsSUFBYixDQUFrQk8sR0FBbEIsQ0FBc0IsSUFBdEI7QUFDRDs7Ozs7a0JBR1loQixLIiwiZmlsZSI6IlNjZW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFjdGl2aXR5IGZyb20gJy4vQWN0aXZpdHknO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4vc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IFNpZ25hbCBmcm9tICcuL1NpZ25hbCc7XG5cbi8qKlxuICogQmFzZSBjbGFzcyB0byBiZSBleHRlbmRlZCBpbiBvcmRlciB0byBjcmVhdGUgYSBuZXcgc2NlbmUuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQGV4dGVuZHMgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFjdGl2aXR5XG4gKi9cbmNsYXNzIFNjZW5lIGV4dGVuZHMgQWN0aXZpdHkge1xuICBjb25zdHJ1Y3RvcihpZCwgaGFzTmV0d29yaykge1xuICAgIHN1cGVyKGlkLCBoYXNOZXR3b3JrKTtcblxuICAgIHRoaXMucmVxdWlyZWRTaWduYWxzLmFkZE9ic2VydmVyKCh2YWx1ZSkgPT4ge1xuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICAgICAgdGhpcy5oYXNTdGFydGVkID0gdHJ1ZTtcbiAgICAgIH0gLyogZWxzZSB7XG4gICAgICAgIHRoaXMuaG9sZCgpOyAvLyBwYXVzZSAvIHJlc3VtZVxuICAgICAgfSAqL1xuICAgIH0pO1xuXG5cbiAgICB0aGlzLnNpZ25hbHMuZG9uZSA9IG5ldyBTaWduYWwoKTtcbiAgICB0aGlzLnJlcXVpcmVkU2lnbmFscy5hZGQoc2VydmljZU1hbmFnZXIuc2lnbmFscy5yZWFkeSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHNlcnZpY2UgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBUaGUgaWRlbnRpZmllciBvZiB0aGUgc2VydmljZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBUaGUgb3B0aW9ucyB0byBjb25maWd1cmUgdGhlIHNlcnZpY2UuXG4gICAqL1xuICByZXF1aXJlKGlkLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIHNlcnZpY2VNYW5hZ2VyLnJlcXVpcmUoaWQsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIHNpZ25hbCB0byB0aGUgcmVxdWlyZWQgc2lnbmFscyBpbiBvcmRlciBmb3IgdGhlIGBTY2VuZWAgaW5zdGFuY2VcbiAgICogdG8gc3RhcnQuXG4gICAqIEBwYXJhbSB7U2lnbmFsfSBzaWduYWwgLSBUaGUgc2lnbmFsIHRoYXQgbXVzdCBiZSB3YWl0ZWQgZm9yLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgd2FpdEZvcihzaWduYWwpIHtcbiAgICB0aGlzLnJlcXVpcmVkU2lnbmFscy5hZGQoc2lnbmFsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrIHRoZSBgU2NlbmVgIGFzIHRlcm1pbmF0ZWQuIFRoZSBjYWxsIG9mIHRoaXMgbWV0aG9kIGlzIGFcbiAgICogcmVzcG9uc2liaWxpdHkgb2YgdGhlIGNsaWVudCBjb2RlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZG9uZSgpIHtcbiAgICB0aGlzLmhpZGUoKTtcbiAgICB0aGlzLnNpZ25hbHMuZG9uZS5zZXQodHJ1ZSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2NlbmU7XG4iXX0=