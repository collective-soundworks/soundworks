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
    _classCallCheck(this, Scene);

    _get(Object.getPrototypeOf(Scene.prototype), 'constructor', this).call(this, id, hasNetwork);

    this.signals.done = new _Signal2['default']();
    this.requiredSignals.add(_serviceManager2['default'].signals.ready);
  }

  _createClass(Scene, [{
    key: 'require',
    value: function require(id, options) {
      return _serviceManager2['default'].require(id, options);
    }
  }]);

  return Scene;
})(_Activity3['default']);

exports['default'] = Scene;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY29yZS9TY2VuZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3lCQUFxQixZQUFZOzs7OzhCQUNOLGtCQUFrQjs7OztzQkFDMUIsVUFBVTs7OztJQUdSLEtBQUs7WUFBTCxLQUFLOztBQUNiLFdBRFEsS0FBSyxDQUNaLEVBQUUsRUFBRSxVQUFVLEVBQUU7MEJBRFQsS0FBSzs7QUFFdEIsK0JBRmlCLEtBQUssNkNBRWhCLEVBQUUsRUFBRSxVQUFVLEVBQUU7O0FBRXRCLFFBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLHlCQUFZLENBQUM7QUFDakMsUUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsNEJBQWUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0dBQ3hEOztlQU5rQixLQUFLOztXQVFqQixpQkFBQyxFQUFFLEVBQUUsT0FBTyxFQUFFO0FBQ25CLGFBQU8sNEJBQWUsT0FBTyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztLQUM1Qzs7O1NBVmtCLEtBQUs7OztxQkFBTCxLQUFLIiwiZmlsZSI6InNyYy9jbGllbnQvY29yZS9TY2VuZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBY3Rpdml0eSBmcm9tICcuL0FjdGl2aXR5JztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBTaWduYWwgZnJvbSAnLi9TaWduYWwnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjZW5lIGV4dGVuZHMgQWN0aXZpdHkge1xuICBjb25zdHJ1Y3RvcihpZCwgaGFzTmV0d29yaykge1xuICAgIHN1cGVyKGlkLCBoYXNOZXR3b3JrKTtcblxuICAgIHRoaXMuc2lnbmFscy5kb25lID0gbmV3IFNpZ25hbCgpO1xuICAgIHRoaXMucmVxdWlyZWRTaWduYWxzLmFkZChzZXJ2aWNlTWFuYWdlci5zaWduYWxzLnJlYWR5KTtcbiAgfVxuXG4gIHJlcXVpcmUoaWQsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gc2VydmljZU1hbmFnZXIucmVxdWlyZShpZCwgb3B0aW9ucyk7XG4gIH1cbn1cbiJdfQ==