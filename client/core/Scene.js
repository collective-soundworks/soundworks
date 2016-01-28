'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Activity2 = require('./Activity');

var _Activity3 = _interopRequireDefault(_Activity2);

var _Signal = require('./Signal');

var _Signal2 = _interopRequireDefault(_Signal);

var Scene = (function (_Activity) {
  _inherits(Scene, _Activity);

  function Scene(id, hasNetwork) {
    _classCallCheck(this, Scene);

    _get(Object.getPrototypeOf(Scene.prototype), 'constructor', this).call(this, id, hasNetwork);

    this.signals.done = new _Signal2['default']();
  }

  return Scene;
})(_Activity3['default']);

exports['default'] = Scene;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY29yZS9TY2VuZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozt5QkFBcUIsWUFBWTs7OztzQkFDZCxVQUFVOzs7O0lBR1IsS0FBSztZQUFMLEtBQUs7O0FBQ2IsV0FEUSxLQUFLLENBQ1osRUFBRSxFQUFFLFVBQVUsRUFBRTswQkFEVCxLQUFLOztBQUV0QiwrQkFGaUIsS0FBSyw2Q0FFaEIsRUFBRSxFQUFFLFVBQVUsRUFBRTs7QUFFdEIsUUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcseUJBQVksQ0FBQztHQUNsQzs7U0FMa0IsS0FBSzs7O3FCQUFMLEtBQUsiLCJmaWxlIjoic3JjL2NsaWVudC9jb3JlL1NjZW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFjdGl2aXR5IGZyb20gJy4vQWN0aXZpdHknO1xuaW1wb3J0IFNpZ25hbCBmcm9tICcuL1NpZ25hbCc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NlbmUgZXh0ZW5kcyBBY3Rpdml0eSB7XG4gIGNvbnN0cnVjdG9yKGlkLCBoYXNOZXR3b3JrKSB7XG4gICAgc3VwZXIoaWQsIGhhc05ldHdvcmspO1xuXG4gICAgdGhpcy5zaWduYWxzLmRvbmUgPSBuZXcgU2lnbmFsKCk7XG4gIH1cbn1cbiJdfQ==