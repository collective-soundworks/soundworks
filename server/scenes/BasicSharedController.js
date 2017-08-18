'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _Scene2 = require('../core/Scene');

var _Scene3 = _interopRequireDefault(_Scene2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SCENE_ID = 'basic-shared-controller';

var BasicSharedController = function (_Scene) {
  (0, _inherits3.default)(BasicSharedController, _Scene);

  function BasicSharedController(clientType) {
    (0, _classCallCheck3.default)(this, BasicSharedController);

    /**
     * Instance of the server-side `shared-params` service.
     * @type {module:soundworks/server.SharedParams}
     * @name sharedParams
     * @instance
     * @memberof module:soundworks/server.SharedParams
     */
    var _this = (0, _possibleConstructorReturn3.default)(this, (BasicSharedController.__proto__ || (0, _getPrototypeOf2.default)(BasicSharedController)).call(this, SCENE_ID, clientType));

    _this.sharedParams = _this.require('shared-params');
    return _this;
  }

  return BasicSharedController;
}(_Scene3.default);

exports.default = BasicSharedController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJhc2ljU2hhcmVkQ29udHJvbGxlci5qcyJdLCJuYW1lcyI6WyJTQ0VORV9JRCIsIkJhc2ljU2hhcmVkQ29udHJvbGxlciIsImNsaWVudFR5cGUiLCJzaGFyZWRQYXJhbXMiLCJyZXF1aXJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztBQUVBLElBQU1BLFdBQVcseUJBQWpCOztJQUVxQkMscUI7OztBQUNuQixpQ0FBWUMsVUFBWixFQUF3QjtBQUFBOztBQUd0Qjs7Ozs7OztBQUhzQixvS0FDaEJGLFFBRGdCLEVBQ05FLFVBRE07O0FBVXRCLFVBQUtDLFlBQUwsR0FBb0IsTUFBS0MsT0FBTCxDQUFhLGVBQWIsQ0FBcEI7QUFWc0I7QUFXdkI7Ozs7O2tCQVprQkgscUIiLCJmaWxlIjoiQmFzaWNTaGFyZWRDb250cm9sbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNjZW5lIGZyb20gJy4uL2NvcmUvU2NlbmUnO1xuXG5jb25zdCBTQ0VORV9JRCA9ICdiYXNpYy1zaGFyZWQtY29udHJvbGxlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2ljU2hhcmVkQ29udHJvbGxlciBleHRlbmRzIFNjZW5lIHtcbiAgY29uc3RydWN0b3IoY2xpZW50VHlwZSkge1xuICAgIHN1cGVyKFNDRU5FX0lELCBjbGllbnRUeXBlKTtcblxuICAgIC8qKlxuICAgICAqIEluc3RhbmNlIG9mIHRoZSBzZXJ2ZXItc2lkZSBgc2hhcmVkLXBhcmFtc2Agc2VydmljZS5cbiAgICAgKiBAdHlwZSB7bW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLlNoYXJlZFBhcmFtc31cbiAgICAgKiBAbmFtZSBzaGFyZWRQYXJhbXNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLlNoYXJlZFBhcmFtc1xuICAgICAqL1xuICAgIHRoaXMuc2hhcmVkUGFyYW1zID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtcGFyYW1zJyk7XG4gIH1cbn1cbiJdfQ==