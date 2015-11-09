'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Module2 = require('./Module');

var _Module3 = _interopRequireDefault(_Module2);

/**
 * The {@link Placer} module allows to store the place of a client selected by the user through the interfacte provided by the {@link ClientPlacer}.
 */

var Placer = (function (_Module) {
  _inherits(Placer, _Module);

  /**
   * Creates an instance of the class.
   * @param {Object} [options={}] Options.
   * @param {Object} [options.name='placer'] Name of the module.
   */

  function Placer(options) {
    _classCallCheck(this, Placer);

    _get(Object.getPrototypeOf(Placer.prototype), 'constructor', this).call(this, options.name || 'placer');
  }

  /**
   * @private
   */

  _createClass(Placer, [{
    key: 'connect',
    value: function connect(client) {
      var _this = this;

      _get(Object.getPrototypeOf(Placer.prototype), 'connect', this).call(this, client);

      client.receive(this.name + ':information', function (index, label, coords) {
        client.modules[_this.name].index = index;
        client.modules[_this.name].label = label;
        client.coordinates = coords;
      });
    }
  }]);

  return Placer;
})(_Module3['default']);

exports['default'] = Placer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvUGxhY2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7dUJBQW1CLFVBQVU7Ozs7Ozs7O0lBTVIsTUFBTTtZQUFOLE1BQU07Ozs7Ozs7O0FBTWQsV0FOUSxNQUFNLENBTWIsT0FBTyxFQUFFOzBCQU5GLE1BQU07O0FBT3ZCLCtCQVBpQixNQUFNLDZDQU9qQixPQUFPLENBQUMsSUFBSSxJQUFJLFFBQVEsRUFBRTtHQUNqQzs7Ozs7O2VBUmtCLE1BQU07O1dBYWxCLGlCQUFDLE1BQU0sRUFBRTs7O0FBQ2QsaUNBZGlCLE1BQU0seUNBY1QsTUFBTSxFQUFFOztBQUV0QixZQUFNLENBQUMsT0FBTyxDQUFJLElBQUksQ0FBQyxJQUFJLG1CQUFnQixVQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFLO0FBQ25FLGNBQU0sQ0FBQyxPQUFPLENBQUMsTUFBSyxJQUFJLENBQUMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ3hDLGNBQU0sQ0FBQyxPQUFPLENBQUMsTUFBSyxJQUFJLENBQUMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ3hDLGNBQU0sQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDO09BQzdCLENBQUMsQ0FBQztLQUNKOzs7U0FyQmtCLE1BQU07OztxQkFBTixNQUFNIiwiZmlsZSI6InNyYy9zZXJ2ZXIvUGxhY2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE1vZHVsZSBmcm9tICcuL01vZHVsZSc7XG5cblxuLyoqXG4gKiBUaGUge0BsaW5rIFBsYWNlcn0gbW9kdWxlIGFsbG93cyB0byBzdG9yZSB0aGUgcGxhY2Ugb2YgYSBjbGllbnQgc2VsZWN0ZWQgYnkgdGhlIHVzZXIgdGhyb3VnaCB0aGUgaW50ZXJmYWN0ZSBwcm92aWRlZCBieSB0aGUge0BsaW5rIENsaWVudFBsYWNlcn0uXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYWNlciBleHRlbmRzIE1vZHVsZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMubmFtZT0ncGxhY2VyJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAncGxhY2VyJyk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgY2xpZW50LnJlY2VpdmUoYCR7dGhpcy5uYW1lfTppbmZvcm1hdGlvbmAsIChpbmRleCwgbGFiZWwsIGNvb3JkcykgPT4ge1xuICAgICAgY2xpZW50Lm1vZHVsZXNbdGhpcy5uYW1lXS5pbmRleCA9IGluZGV4O1xuICAgICAgY2xpZW50Lm1vZHVsZXNbdGhpcy5uYW1lXS5sYWJlbCA9IGxhYmVsO1xuICAgICAgY2xpZW50LmNvb3JkaW5hdGVzID0gY29vcmRzO1xuICAgIH0pO1xuICB9XG59XG5cbiJdfQ==