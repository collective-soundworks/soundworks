'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Activity2 = require('./Activity');

var _Activity3 = _interopRequireDefault(_Activity2);

var _serviceManager = require('./serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _Signal = require('./Signal');

var _Signal2 = _interopRequireDefault(_Signal);

var Scene = (function (_Activity) {
  _inherits(Scene, _Activity);

  function Scene(id, hasNetwork) {
    var _this = this;

    _classCallCheck(this, Scene);

    _get(Object.getPrototypeOf(Scene.prototype), 'constructor', this).call(this, id, hasNetwork);

    this.requiredSignals.addObserver(function (value) {
      if (value) {
        _this.start();
        _this.hasStarted = true;
      } /* else {
        this.hold(); // pause / resume
        } */
    });

    this.signals.done = new _Signal2['default']();
    this.requiredSignals.add(_serviceManager2['default'].signals.ready);
  }

  /**
   * Returns a service configured with the given options.
   * @param {String} id - The identifier of the service.
   * @param {Object} options - The options to configure the service.
   */

  _createClass(Scene, [{
    key: 'require',
    value: function require(id, options) {
      return _serviceManager2['default'].require(id, options);
    }

    /**
     * Add a signal to the required signals for start.
     * @param {Signal} signal - The signal that must be waited for.
     */
  }, {
    key: 'waitFor',
    value: function waitFor(signal) {
      this.requiredSignals.add(signal);
    }

    /**
     * Mark the `Scene` as terminated. The call of this method is a responsibility
     * of the client code.
     */
  }, {
    key: 'done',
    value: function done() {
      this.hide();
      this.signals.done.set(true);
    }
  }]);

  return Scene;
})(_Activity3['default']);

exports['default'] = Scene;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY29yZS9TY2VuZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3lCQUFxQixZQUFZOzs7OzhCQUNOLGtCQUFrQjs7OztzQkFDMUIsVUFBVTs7OztJQUdSLEtBQUs7WUFBTCxLQUFLOztBQUNiLFdBRFEsS0FBSyxDQUNaLEVBQUUsRUFBRSxVQUFVLEVBQUU7OzswQkFEVCxLQUFLOztBQUV0QiwrQkFGaUIsS0FBSyw2Q0FFaEIsRUFBRSxFQUFFLFVBQVUsRUFBRTs7QUFFdEIsUUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsVUFBQyxLQUFLLEVBQUs7QUFDMUMsVUFBSSxLQUFLLEVBQUU7QUFDVCxjQUFLLEtBQUssRUFBRSxDQUFDO0FBQ2IsY0FBSyxVQUFVLEdBQUcsSUFBSSxDQUFDO09BQ3hCOzs7S0FHRixDQUFDLENBQUM7O0FBR0gsUUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcseUJBQVksQ0FBQztBQUNqQyxRQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyw0QkFBZSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7R0FDeEQ7Ozs7Ozs7O2VBaEJrQixLQUFLOztXQXVCakIsaUJBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRTtBQUNuQixhQUFPLDRCQUFlLE9BQU8sQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDNUM7Ozs7Ozs7O1dBTU0saUJBQUMsTUFBTSxFQUFFO0FBQ2QsVUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDbEM7Ozs7Ozs7O1dBTUcsZ0JBQUc7QUFDTCxVQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWixVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDN0I7OztTQTFDa0IsS0FBSzs7O3FCQUFMLEtBQUsiLCJmaWxlIjoic3JjL2NsaWVudC9jb3JlL1NjZW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFjdGl2aXR5IGZyb20gJy4vQWN0aXZpdHknO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4vc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IFNpZ25hbCBmcm9tICcuL1NpZ25hbCc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NlbmUgZXh0ZW5kcyBBY3Rpdml0eSB7XG4gIGNvbnN0cnVjdG9yKGlkLCBoYXNOZXR3b3JrKSB7XG4gICAgc3VwZXIoaWQsIGhhc05ldHdvcmspO1xuXG4gICAgdGhpcy5yZXF1aXJlZFNpZ25hbHMuYWRkT2JzZXJ2ZXIoKHZhbHVlKSA9PiB7XG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgICAgICB0aGlzLmhhc1N0YXJ0ZWQgPSB0cnVlO1xuICAgICAgfSAvKiBlbHNlIHtcbiAgICAgICAgdGhpcy5ob2xkKCk7IC8vIHBhdXNlIC8gcmVzdW1lXG4gICAgICB9ICovXG4gICAgfSk7XG5cblxuICAgIHRoaXMuc2lnbmFscy5kb25lID0gbmV3IFNpZ25hbCgpO1xuICAgIHRoaXMucmVxdWlyZWRTaWduYWxzLmFkZChzZXJ2aWNlTWFuYWdlci5zaWduYWxzLnJlYWR5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc2VydmljZSBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIFRoZSBpZGVudGlmaWVyIG9mIHRoZSBzZXJ2aWNlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFRoZSBvcHRpb25zIHRvIGNvbmZpZ3VyZSB0aGUgc2VydmljZS5cbiAgICovXG4gIHJlcXVpcmUoaWQsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gc2VydmljZU1hbmFnZXIucmVxdWlyZShpZCwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgc2lnbmFsIHRvIHRoZSByZXF1aXJlZCBzaWduYWxzIGZvciBzdGFydC5cbiAgICogQHBhcmFtIHtTaWduYWx9IHNpZ25hbCAtIFRoZSBzaWduYWwgdGhhdCBtdXN0IGJlIHdhaXRlZCBmb3IuXG4gICAqL1xuICB3YWl0Rm9yKHNpZ25hbCkge1xuICAgIHRoaXMucmVxdWlyZWRTaWduYWxzLmFkZChzaWduYWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcmsgdGhlIGBTY2VuZWAgYXMgdGVybWluYXRlZC4gVGhlIGNhbGwgb2YgdGhpcyBtZXRob2QgaXMgYSByZXNwb25zaWJpbGl0eVxuICAgKiBvZiB0aGUgY2xpZW50IGNvZGUuXG4gICAqL1xuICBkb25lKCkge1xuICAgIHRoaXMuaGlkZSgpO1xuICAgIHRoaXMuc2lnbmFscy5kb25lLnNldCh0cnVlKTtcbiAgfVxufVxuIl19