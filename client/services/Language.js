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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkxhbmd1YWdlLmpzIl0sIm5hbWVzIjpbIlNFUlZJQ0VfSUQiLCJkZWZhdWx0Vmlld1RlbXBsYXRlIiwiTGFuZ3VhZ2UiLCJkZWZhdWx0cyIsInZpZXdQcmlvcml0eSIsIm9wdGlvbnMiLCJjb25maWd1cmUiLCJfb25TZWxlY3Rpb24iLCJiaW5kIiwidmlldyIsIm1vZGVsIiwic2V0U2VsZWN0aW9uQ2FsbGJhY2siLCJzaG93IiwiaGlkZSIsImlkIiwiY2xpZW50IiwibGFuZ3VhZ2UiLCJyZWFkeSIsIlNlcnZpY2UiLCJzZXJ2aWNlTWFuYWdlciIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsYUFBYSxrQkFBbkI7O0FBRUEsSUFBTUMsZ1NBQU47O0FBVUE7Ozs7Ozs7O0FBUUE7Ozs7Ozs7Ozs7Ozs7O0FBY0E7Ozs7Ozs7Ozs7QUFXQTs7Ozs7Ozs7Ozs7O0lBV01DLFE7OztBQUNKLHNCQUFjO0FBQUE7O0FBQUEsMElBQ05GLFVBRE0sRUFDTSxLQUROOztBQUdaLFFBQU1HLFdBQVc7QUFDZkMsb0JBQWMsQ0FEQztBQUVmQyxlQUFTO0FBRk0sS0FBakI7O0FBS0EsVUFBS0MsU0FBTCxDQUFlSCxRQUFmOztBQUVBLFVBQUtJLFlBQUwsR0FBb0IsTUFBS0EsWUFBTCxDQUFrQkMsSUFBbEIsT0FBcEI7QUFWWTtBQVdiOztBQUVEOzs7Ozs0QkFDUTtBQUNOOztBQUVBLFdBQUtDLElBQUwsQ0FBVUMsS0FBVixDQUFnQkwsT0FBaEIsR0FBMEIsS0FBS0EsT0FBTCxDQUFhQSxPQUF2QztBQUNBLFdBQUtJLElBQUwsQ0FBVUUsb0JBQVYsQ0FBK0IsS0FBS0osWUFBcEM7O0FBRUEsV0FBS0ssSUFBTDtBQUNEOztBQUVEOzs7OzJCQUNPO0FBQ0w7QUFDQSxXQUFLQyxJQUFMO0FBQ0Q7OztpQ0FFWUMsRSxFQUFJO0FBQ2ZDLHVCQUFPQyxRQUFQLEdBQWtCRixFQUFsQjtBQUNBLFdBQUtHLEtBQUw7QUFDRDs7O0VBakNvQkMsaUI7O0FBb0N2QkMseUJBQWVDLFFBQWYsQ0FBd0JwQixVQUF4QixFQUFvQ0UsUUFBcEM7O2tCQUVlQSxRIiwiZmlsZSI6Ikxhbmd1YWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsaWVudCBmcm9tICcuLi9jb3JlL2NsaWVudCc7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IFNlZ21lbnRlZFZpZXcgZnJvbSAnLi4vdmlld3MvU2VnbWVudGVkVmlldyc7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpsYW5ndWFnZSc7XG5cbmNvbnN0IGRlZmF1bHRWaWV3VGVtcGxhdGUgPSBgXG4gPGRpdiBjbGFzcz1cInNlY3Rpb24tdG9wXCI+PC9kaXY+XG4gPGRpdiBjbGFzcz1cInNlY3Rpb24tY2VudGVyXCI+XG4gICA8JSBPYmplY3Qua2V5cyhvcHRpb25zKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSxpbmRleCkgeyAlPlxuICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuXCIgZGF0YS1pZD1cIjwlPSBrZXkgJT5cIj48JT0gb3B0aW9uc1trZXldICU+PC9idXR0b24+XG4gICA8JSB9KTsgJT5cbiA8L2Rpdj5cbiA8ZGl2IGNsYXNzPVwic2VjdGlvbi1ib3R0b21cIj48L2Rpdj5cbmA7XG5cbi8qKlxuICogQVBJIG9mIGEgY29tcGxpYW50IHZpZXcgZm9yIHRoZSBgbGFuZ3VhZ2VgIHNlcnZpY2UuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQGludGVyZmFjZSBBYnN0cmFjdExhbmd1YWdlVmlld1xuICogQGV4dGVuZHMgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0Vmlld1xuICogQGFic3RyYWN0XG4gKi9cbi8qKlxuICogUmVnaXN0ZXIgdGhlIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIGJlIGV4ZWN1dGVkIHdoZW4gdGhlIHBhc3N3b3JkIGlzIHN1Ym1pdHRlZFxuICogYnkgdGhlIHVzZXIuXG4gKlxuICogQG5hbWUgc2V0U2VsZWN0aW9uQ2FsbGJhY2tcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWJzdHJhY3RMYW5ndWFnZVZpZXdcbiAqIEBmdW5jdGlvblxuICogQGFic3RyYWN0XG4gKiBAaW5zdGFuY2VcbiAqXG4gKiBAcGFyYW0ge3NlbGVjdGlvbkNhbGxiYWNrfSBjYWxsYmFjayAtIENhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiB0aGUgdXNlclxuICogIGNob29zZSBpdHMgbGFuZ3VhZ2VcbiAqL1xuXG4vKipcbiAqIENhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiB0aGUgdXNlciBjaG9vc2UgaXRzIGxhbmd1YWdlLlxuICpcbiAqIEBjYWxsYmFja1xuICogQG5hbWUgc2VsZWN0aW9uQ2FsbGJhY2tcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWJzdHJhY3RMYW5ndWFnZVZpZXdcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBpZCBvZiB0aGUgbGFuZ3VhZ2UuXG4gKi9cblxuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIGNsaWVudCBgbGFuZ3VhZ2VgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIHByZXNlbnQgYSB2aWV3IHRoYXQgYWxsb3dzIHRvIGRlZmluZSBhIGxhbmdhZ2UgZm9yIHRoZSBjbGllbnQuXG4gKiBVc2luZyB0aGlzIHNlcnZpY2UgaW1wbGllcyB0aGF0IHRoZSBhcHBsaWNhdGlvbiBzaG91bGQgaGFuZGxlIGl0c2VsZiB0aGlzXG4gKiBpbmZvcm1hdGlvbiBpbiB0aGUgdmlld3Mgb2YgdGhlIHRoZSBzZXJ2aWNlcyBhcyB3ZWxsIGFzIGluIHRoZSBleHBlcmllbmNlLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBleGFtcGxlXG4gKiB0aGlzLmxhbmd1YWdlID0gdGhpcy5yZXF1aXJlKCdsYW5ndWFnZScsIHsgb3B0aW9uczogeyBlbjogJ0VuZ2xpc2gnLCBmcjonRnJhbsOnYWlzJyB9fSk7XG4gKi9cbmNsYXNzIExhbmd1YWdlIGV4dGVuZHMgU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIGZhbHNlKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgdmlld1ByaW9yaXR5OiA5LFxuICAgICAgb3B0aW9uczoge30sXG4gICAgfVxuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgdGhpcy5fb25TZWxlY3Rpb24gPSB0aGlzLl9vblNlbGVjdGlvbi5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICB0aGlzLnZpZXcubW9kZWwub3B0aW9ucyA9IHRoaXMub3B0aW9ucy5vcHRpb25zO1xuICAgIHRoaXMudmlldy5zZXRTZWxlY3Rpb25DYWxsYmFjayh0aGlzLl9vblNlbGVjdGlvbik7XG5cbiAgICB0aGlzLnNob3coKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdG9wKCkge1xuICAgIHN1cGVyLnN0b3AoKTtcbiAgICB0aGlzLmhpZGUoKTtcbiAgfVxuXG4gIF9vblNlbGVjdGlvbihpZCkge1xuICAgIGNsaWVudC5sYW5ndWFnZSA9IGlkO1xuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBMYW5ndWFnZSk7XG5cbmV4cG9ydCBkZWZhdWx0IExhbmd1YWdlO1xuIl19