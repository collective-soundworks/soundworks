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

var _client = require('../core/client');

var _client2 = _interopRequireDefault(_client);

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _SegmentedView = require('../views/SegmentedView');

var _SegmentedView2 = _interopRequireDefault(_SegmentedView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:language';

var defaultViewTemplate = '\n <div class="section-top"></div>\n <div class="section-center">\n   <% Object.keys(options).forEach(function(key,index) { %>\n     <button class="btn" data-id="<%= key %>"><%= options[key] %></button>\n   <% }); %>\n </div>\n <div class="section-bottom"></div>\n';

/**
 * API of a compliant view for the `language` service.
 *
 * @memberof module:soundworks/client
 * @interface AbstractLanguageView
 * @extends module:soundworks/client.AbstractView
 * @abstract
 */
/**
 * Register the function that should be executed when the password is submitted
 * by the user.
 *
 * @name setSelectionCallback
 * @memberof module:soundworks/client.AbstractLanguageView
 * @function
 * @abstract
 * @instance
 *
 * @param {selectionCallback} callback - Callback to execute when the user
 *  choose its language
 */

/**
 * Callback to execute when the user choose its language.
 *
 * @callback
 * @name selectionCallback
 * @memberof module:soundworks/client.AbstractLanguageView
 *
 * @param {String} id - id of the language.
 */

/**
 * Interface for the client `language` service.
 *
 * This service present a view that allows to define a langage for the client.
 * Using this service implies that the application should handle itself this
 * information in the views of the the services as well as in the experience.
 *
 * @memberof module:soundworks/client
 * @example
 * this.language = this.require('language', { options: { en: 'English', fr:'Français' }});
 */

var Language = function (_Service) {
  (0, _inherits3.default)(Language, _Service);

  function Language() {
    (0, _classCallCheck3.default)(this, Language);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Language.__proto__ || (0, _getPrototypeOf2.default)(Language)).call(this, SERVICE_ID, false));

    var defaults = {
      viewPriority: 9,
      options: {}
    };

    _this.configure(defaults);

    _this._onSelection = _this._onSelection.bind(_this);
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(Language, [{
    key: 'start',
    value: function start() {
      (0, _get3.default)(Language.prototype.__proto__ || (0, _getPrototypeOf2.default)(Language.prototype), 'start', this).call(this);

      this.view.model.options = this.options.options;
      this.view.setSelectionCallback(this._onSelection);

      this.show();
    }

    /** @private */

  }, {
    key: 'stop',
    value: function stop() {
      (0, _get3.default)(Language.prototype.__proto__ || (0, _getPrototypeOf2.default)(Language.prototype), 'stop', this).call(this);
      this.hide();
    }
  }, {
    key: '_onSelection',
    value: function _onSelection(id) {
      _client2.default.language = id;
      this.ready();
    }
  }]);
  return Language;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, Language);

exports.default = Language;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkxhbmd1YWdlLmpzIl0sIm5hbWVzIjpbIlNFUlZJQ0VfSUQiLCJkZWZhdWx0Vmlld1RlbXBsYXRlIiwiTGFuZ3VhZ2UiLCJkZWZhdWx0cyIsInZpZXdQcmlvcml0eSIsIm9wdGlvbnMiLCJjb25maWd1cmUiLCJfb25TZWxlY3Rpb24iLCJiaW5kIiwidmlldyIsIm1vZGVsIiwic2V0U2VsZWN0aW9uQ2FsbGJhY2siLCJzaG93IiwiaGlkZSIsImlkIiwibGFuZ3VhZ2UiLCJyZWFkeSIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsYUFBYSxrQkFBbkI7O0FBRUEsSUFBTUMsZ1NBQU47O0FBVUE7Ozs7Ozs7O0FBUUE7Ozs7Ozs7Ozs7Ozs7O0FBY0E7Ozs7Ozs7Ozs7QUFXQTs7Ozs7Ozs7Ozs7O0lBV01DLFE7OztBQUNKLHNCQUFjO0FBQUE7O0FBQUEsMElBQ05GLFVBRE0sRUFDTSxLQUROOztBQUdaLFFBQU1HLFdBQVc7QUFDZkMsb0JBQWMsQ0FEQztBQUVmQyxlQUFTO0FBRk0sS0FBakI7O0FBS0EsVUFBS0MsU0FBTCxDQUFlSCxRQUFmOztBQUVBLFVBQUtJLFlBQUwsR0FBb0IsTUFBS0EsWUFBTCxDQUFrQkMsSUFBbEIsT0FBcEI7QUFWWTtBQVdiOztBQUVEOzs7Ozs0QkFDUTtBQUNOOztBQUVBLFdBQUtDLElBQUwsQ0FBVUMsS0FBVixDQUFnQkwsT0FBaEIsR0FBMEIsS0FBS0EsT0FBTCxDQUFhQSxPQUF2QztBQUNBLFdBQUtJLElBQUwsQ0FBVUUsb0JBQVYsQ0FBK0IsS0FBS0osWUFBcEM7O0FBRUEsV0FBS0ssSUFBTDtBQUNEOztBQUVEOzs7OzJCQUNPO0FBQ0w7QUFDQSxXQUFLQyxJQUFMO0FBQ0Q7OztpQ0FFWUMsRSxFQUFJO0FBQ2YsdUJBQU9DLFFBQVAsR0FBa0JELEVBQWxCO0FBQ0EsV0FBS0UsS0FBTDtBQUNEOzs7OztBQUdILHlCQUFlQyxRQUFmLENBQXdCakIsVUFBeEIsRUFBb0NFLFFBQXBDOztrQkFFZUEsUSIsImZpbGUiOiJMYW5ndWFnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbGllbnQgZnJvbSAnLi4vY29yZS9jbGllbnQnO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBTZWdtZW50ZWRWaWV3IGZyb20gJy4uL3ZpZXdzL1NlZ21lbnRlZFZpZXcnO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6bGFuZ3VhZ2UnO1xuXG5jb25zdCBkZWZhdWx0Vmlld1RlbXBsYXRlID0gYFxuIDxkaXYgY2xhc3M9XCJzZWN0aW9uLXRvcFwiPjwvZGl2PlxuIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWNlbnRlclwiPlxuICAgPCUgT2JqZWN0LmtleXMob3B0aW9ucykuZm9yRWFjaChmdW5jdGlvbihrZXksaW5kZXgpIHsgJT5cbiAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0blwiIGRhdGEtaWQ9XCI8JT0ga2V5ICU+XCI+PCU9IG9wdGlvbnNba2V5XSAlPjwvYnV0dG9uPlxuICAgPCUgfSk7ICU+XG4gPC9kaXY+XG4gPGRpdiBjbGFzcz1cInNlY3Rpb24tYm90dG9tXCI+PC9kaXY+XG5gO1xuXG4vKipcbiAqIEFQSSBvZiBhIGNvbXBsaWFudCB2aWV3IGZvciB0aGUgYGxhbmd1YWdlYCBzZXJ2aWNlLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBpbnRlcmZhY2UgQWJzdHJhY3RMYW5ndWFnZVZpZXdcbiAqIEBleHRlbmRzIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BYnN0cmFjdFZpZXdcbiAqIEBhYnN0cmFjdFxuICovXG4vKipcbiAqIFJlZ2lzdGVyIHRoZSBmdW5jdGlvbiB0aGF0IHNob3VsZCBiZSBleGVjdXRlZCB3aGVuIHRoZSBwYXNzd29yZCBpcyBzdWJtaXR0ZWRcbiAqIGJ5IHRoZSB1c2VyLlxuICpcbiAqIEBuYW1lIHNldFNlbGVjdGlvbkNhbGxiYWNrXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0TGFuZ3VhZ2VWaWV3XG4gKiBAZnVuY3Rpb25cbiAqIEBhYnN0cmFjdFxuICogQGluc3RhbmNlXG4gKlxuICogQHBhcmFtIHtzZWxlY3Rpb25DYWxsYmFja30gY2FsbGJhY2sgLSBDYWxsYmFjayB0byBleGVjdXRlIHdoZW4gdGhlIHVzZXJcbiAqICBjaG9vc2UgaXRzIGxhbmd1YWdlXG4gKi9cblxuLyoqXG4gKiBDYWxsYmFjayB0byBleGVjdXRlIHdoZW4gdGhlIHVzZXIgY2hvb3NlIGl0cyBsYW5ndWFnZS5cbiAqXG4gKiBAY2FsbGJhY2tcbiAqIEBuYW1lIHNlbGVjdGlvbkNhbGxiYWNrXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0TGFuZ3VhZ2VWaWV3XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gaWQgb2YgdGhlIGxhbmd1YWdlLlxuICovXG5cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBjbGllbnQgYGxhbmd1YWdlYCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmljZSBwcmVzZW50IGEgdmlldyB0aGF0IGFsbG93cyB0byBkZWZpbmUgYSBsYW5nYWdlIGZvciB0aGUgY2xpZW50LlxuICogVXNpbmcgdGhpcyBzZXJ2aWNlIGltcGxpZXMgdGhhdCB0aGUgYXBwbGljYXRpb24gc2hvdWxkIGhhbmRsZSBpdHNlbGYgdGhpc1xuICogaW5mb3JtYXRpb24gaW4gdGhlIHZpZXdzIG9mIHRoZSB0aGUgc2VydmljZXMgYXMgd2VsbCBhcyBpbiB0aGUgZXhwZXJpZW5jZS5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAZXhhbXBsZVxuICogdGhpcy5sYW5ndWFnZSA9IHRoaXMucmVxdWlyZSgnbGFuZ3VhZ2UnLCB7IG9wdGlvbnM6IHsgZW46ICdFbmdsaXNoJywgZnI6J0ZyYW7Dp2FpcycgfX0pO1xuICovXG5jbGFzcyBMYW5ndWFnZSBleHRlbmRzIFNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCBmYWxzZSk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIHZpZXdQcmlvcml0eTogOSxcbiAgICAgIG9wdGlvbnM6IHt9LFxuICAgIH1cblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIHRoaXMuX29uU2VsZWN0aW9uID0gdGhpcy5fb25TZWxlY3Rpb24uYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgdGhpcy52aWV3Lm1vZGVsLm9wdGlvbnMgPSB0aGlzLm9wdGlvbnMub3B0aW9ucztcbiAgICB0aGlzLnZpZXcuc2V0U2VsZWN0aW9uQ2FsbGJhY2sodGhpcy5fb25TZWxlY3Rpb24pO1xuXG4gICAgdGhpcy5zaG93KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RvcCgpIHtcbiAgICBzdXBlci5zdG9wKCk7XG4gICAgdGhpcy5oaWRlKCk7XG4gIH1cblxuICBfb25TZWxlY3Rpb24oaWQpIHtcbiAgICBjbGllbnQubGFuZ3VhZ2UgPSBpZDtcbiAgICB0aGlzLnJlYWR5KCk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgTGFuZ3VhZ2UpO1xuXG5leHBvcnQgZGVmYXVsdCBMYW5ndWFnZTtcbiJdfQ==