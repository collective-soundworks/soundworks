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

var _Scene2 = require('../core/Scene');

var _Scene3 = _interopRequireDefault(_Scene2);

var _client = require('../core/client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Base class to be extended in order to create the client-side of a custom
 * experience.
 *
 * The user defined `Experience` is the main component of a soundworks application.
 *
 * @memberof module:soundworks/client
 * @extends module:soundworks/client.Scene
 */

var Experience = function (_Scene) {
  (0, _inherits3.default)(Experience, _Scene);

  /**
   * @param {Boolean} [hasNetwork=true] - Define if the experience needs a
   *  socket connection or not.
   */

  function Experience() {
    var hasNetwork = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
    (0, _classCallCheck3.default)(this, Experience);

    // if the experience has network, require errorReporter service by default

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Experience).call(this, 'experience', hasNetwork));

    if (hasNetwork) _this._errorReporter = _this.require('error-reporter');
    return _this;
  }

  /**
   * Interface method to implement in each experience. This method is part of the
   * experience lifecycle and should be called when
   * [`Experience#start`]{@link module:soundworks/client.Experience#start}
   * is called for the first time.
   *
   * @example
   * // in MyExperience#start
   * if (this.hasStarted)
   *   this.init();
   */


  (0, _createClass3.default)(Experience, [{
    key: 'init',
    value: function init() {}
  }, {
    key: 'createView',
    value: function createView() {
      if (this.viewOptions) {
        if (Array.isArray(this.viewOptions.className)) this.viewOptions.clientType.push(_client2.default.type);else if (typeof this.viewOptions.className === 'string') this.viewOptions.className = [this.viewOptions.className, _client2.default.type];else this.viewOptions.className = _client2.default.type;
      }

      return (0, _get3.default)((0, _getPrototypeOf2.default)(Experience.prototype), 'createView', this).call(this);
    }

    /**
     * Start the experience. This lifecycle method is called when all the
     * required services are `ready` and thus the experience can begin with all
     * the necessary informations and services ready to be consumed.
     */

  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Experience.prototype), 'start', this).call(this);

      if (this.hasNetwork) this.send('enter');
    }

    /** @private */

  }, {
    key: 'done',
    value: function done() {
      if (this.hasNetwork) this.send('exit');

      (0, _get3.default)((0, _getPrototypeOf2.default)(Experience.prototype), 'done', this).call(this);
    }
  }]);
  return Experience;
}(_Scene3.default);

exports.default = Experience;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV4cGVyaWVuY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztJQVdNLFU7Ozs7Ozs7O0FBS0osd0JBQStCO0FBQUEsUUFBbkIsVUFBbUIseURBQU4sSUFBTTtBQUFBOzs7O0FBQUEsb0hBQ3ZCLFlBRHVCLEVBQ1QsVUFEUzs7QUFHN0IsUUFBSSxVQUFKLEVBQ0UsTUFBSyxjQUFMLEdBQXNCLE1BQUssT0FBTCxDQUFhLGdCQUFiLENBQXRCO0FBSjJCO0FBSzlCOzs7Ozs7Ozs7Ozs7Ozs7OzsyQkFhTSxDQUFFOzs7aUNBRUk7QUFDWCxVQUFJLEtBQUssV0FBVCxFQUFzQjtBQUNwQixZQUFJLE1BQU0sT0FBTixDQUFjLEtBQUssV0FBTCxDQUFpQixTQUEvQixDQUFKLEVBQ0UsS0FBSyxXQUFMLENBQWlCLFVBQWpCLENBQTRCLElBQTVCLENBQWlDLGlCQUFPLElBQXhDLEVBREYsS0FFSyxJQUFJLE9BQU8sS0FBSyxXQUFMLENBQWlCLFNBQXhCLEtBQXNDLFFBQTFDLEVBQ0gsS0FBSyxXQUFMLENBQWlCLFNBQWpCLEdBQTZCLENBQUMsS0FBSyxXQUFMLENBQWlCLFNBQWxCLEVBQTZCLGlCQUFPLElBQXBDLENBQTdCLENBREcsS0FHSCxLQUFLLFdBQUwsQ0FBaUIsU0FBakIsR0FBNkIsaUJBQU8sSUFBcEM7QUFDSDs7QUFFRDtBQUNEOzs7Ozs7Ozs7OzRCQU9PO0FBQ047O0FBRUEsVUFBSSxLQUFLLFVBQVQsRUFDRSxLQUFLLElBQUwsQ0FBVSxPQUFWO0FBQ0g7Ozs7OzsyQkFHTTtBQUNMLFVBQUksS0FBSyxVQUFULEVBQ0UsS0FBSyxJQUFMLENBQVUsTUFBVjs7QUFFRjtBQUNEOzs7OztrQkFHWSxVIiwiZmlsZSI6IkV4cGVyaWVuY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2NlbmUgZnJvbSAnLi4vY29yZS9TY2VuZSc7XG5pbXBvcnQgY2xpZW50IGZyb20gJy4uL2NvcmUvY2xpZW50JztcblxuLyoqXG4gKiBCYXNlIGNsYXNzIHRvIGJlIGV4dGVuZGVkIGluIG9yZGVyIHRvIGNyZWF0ZSB0aGUgY2xpZW50LXNpZGUgb2YgYSBjdXN0b21cbiAqIGV4cGVyaWVuY2UuXG4gKlxuICogVGhlIHVzZXIgZGVmaW5lZCBgRXhwZXJpZW5jZWAgaXMgdGhlIG1haW4gY29tcG9uZW50IG9mIGEgc291bmR3b3JrcyBhcHBsaWNhdGlvbi5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAZXh0ZW5kcyBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuU2NlbmVcbiAqL1xuY2xhc3MgRXhwZXJpZW5jZSBleHRlbmRzIFNjZW5lIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2hhc05ldHdvcms9dHJ1ZV0gLSBEZWZpbmUgaWYgdGhlIGV4cGVyaWVuY2UgbmVlZHMgYVxuICAgKiAgc29ja2V0IGNvbm5lY3Rpb24gb3Igbm90LlxuICAgKi9cbiAgY29uc3RydWN0b3IoaGFzTmV0d29yayA9IHRydWUpIHtcbiAgICBzdXBlcignZXhwZXJpZW5jZScsIGhhc05ldHdvcmspO1xuICAgIC8vIGlmIHRoZSBleHBlcmllbmNlIGhhcyBuZXR3b3JrLCByZXF1aXJlIGVycm9yUmVwb3J0ZXIgc2VydmljZSBieSBkZWZhdWx0XG4gICAgaWYgKGhhc05ldHdvcmspXG4gICAgICB0aGlzLl9lcnJvclJlcG9ydGVyID0gdGhpcy5yZXF1aXJlKCdlcnJvci1yZXBvcnRlcicpO1xuICB9XG5cbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgdG8gaW1wbGVtZW50IGluIGVhY2ggZXhwZXJpZW5jZS4gVGhpcyBtZXRob2QgaXMgcGFydCBvZiB0aGVcbiAgICogZXhwZXJpZW5jZSBsaWZlY3ljbGUgYW5kIHNob3VsZCBiZSBjYWxsZWQgd2hlblxuICAgKiBbYEV4cGVyaWVuY2Ujc3RhcnRgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuRXhwZXJpZW5jZSNzdGFydH1cbiAgICogaXMgY2FsbGVkIGZvciB0aGUgZmlyc3QgdGltZS5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogLy8gaW4gTXlFeHBlcmllbmNlI3N0YXJ0XG4gICAqIGlmICh0aGlzLmhhc1N0YXJ0ZWQpXG4gICAqICAgdGhpcy5pbml0KCk7XG4gICAqL1xuICBpbml0KCkge31cblxuICBjcmVhdGVWaWV3KCkge1xuICAgIGlmICh0aGlzLnZpZXdPcHRpb25zKSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLnZpZXdPcHRpb25zLmNsYXNzTmFtZSkpXG4gICAgICAgIHRoaXMudmlld09wdGlvbnMuY2xpZW50VHlwZS5wdXNoKGNsaWVudC50eXBlKTtcbiAgICAgIGVsc2UgaWYgKHR5cGVvZiB0aGlzLnZpZXdPcHRpb25zLmNsYXNzTmFtZSA9PT0gJ3N0cmluZycpXG4gICAgICAgIHRoaXMudmlld09wdGlvbnMuY2xhc3NOYW1lID0gW3RoaXMudmlld09wdGlvbnMuY2xhc3NOYW1lLCBjbGllbnQudHlwZV07XG4gICAgICBlbHNlXG4gICAgICAgIHRoaXMudmlld09wdGlvbnMuY2xhc3NOYW1lID0gY2xpZW50LnR5cGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN1cGVyLmNyZWF0ZVZpZXcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgZXhwZXJpZW5jZS4gVGhpcyBsaWZlY3ljbGUgbWV0aG9kIGlzIGNhbGxlZCB3aGVuIGFsbCB0aGVcbiAgICogcmVxdWlyZWQgc2VydmljZXMgYXJlIGByZWFkeWAgYW5kIHRodXMgdGhlIGV4cGVyaWVuY2UgY2FuIGJlZ2luIHdpdGggYWxsXG4gICAqIHRoZSBuZWNlc3NhcnkgaW5mb3JtYXRpb25zIGFuZCBzZXJ2aWNlcyByZWFkeSB0byBiZSBjb25zdW1lZC5cbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAodGhpcy5oYXNOZXR3b3JrKVxuICAgICAgdGhpcy5zZW5kKCdlbnRlcicpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGRvbmUoKSB7XG4gICAgaWYgKHRoaXMuaGFzTmV0d29yaylcbiAgICAgIHRoaXMuc2VuZCgnZXhpdCcpO1xuXG4gICAgc3VwZXIuZG9uZSgpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEV4cGVyaWVuY2U7XG4iXX0=