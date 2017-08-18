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

var _Activity2 = require('../core/Activity');

var _Activity3 = _interopRequireDefault(_Activity2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Base class to be extended in order to create a new scene.
 *
 * @memberof module:soundworks/server
 * @extends module:soundworks/server.Activity
 */
var Scene = function (_Activity) {
  (0, _inherits3.default)(Scene, _Activity);

  function Scene(id, clientType) {
    (0, _classCallCheck3.default)(this, Scene);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Scene.__proto__ || (0, _getPrototypeOf2.default)(Scene)).call(this, id));

    _this.addClientType(clientType);
    return _this;
  }

  return Scene;
}(_Activity3.default);

exports.default = Scene;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNjZW5lLmpzIl0sIm5hbWVzIjpbIlNjZW5lIiwiaWQiLCJjbGllbnRUeXBlIiwiYWRkQ2xpZW50VHlwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFFQTs7Ozs7O0lBTU1BLEs7OztBQUNKLGlCQUFZQyxFQUFaLEVBQWdCQyxVQUFoQixFQUE0QjtBQUFBOztBQUFBLG9JQUNwQkQsRUFEb0I7O0FBRzFCLFVBQUtFLGFBQUwsQ0FBbUJELFVBQW5CO0FBSDBCO0FBSTNCOzs7OztrQkFHWUYsSyIsImZpbGUiOiJTY2VuZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBY3Rpdml0eSBmcm9tICcuLi9jb3JlL0FjdGl2aXR5JztcblxuLyoqXG4gKiBCYXNlIGNsYXNzIHRvIGJlIGV4dGVuZGVkIGluIG9yZGVyIHRvIGNyZWF0ZSBhIG5ldyBzY2VuZS5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyXG4gKiBAZXh0ZW5kcyBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuQWN0aXZpdHlcbiAqL1xuY2xhc3MgU2NlbmUgZXh0ZW5kcyBBY3Rpdml0eSB7XG4gIGNvbnN0cnVjdG9yKGlkLCBjbGllbnRUeXBlKSB7XG4gICAgc3VwZXIoaWQpO1xuXG4gICAgdGhpcy5hZGRDbGllbnRUeXBlKGNsaWVudFR5cGUpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNjZW5lO1xuIl19