'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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

var _SegmentedView = require('../views/SegmentedView');

var _SegmentedView2 = _interopRequireDefault(_SegmentedView);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:checkin';

var defaultViewTemplate = '\n<% if (label) { %>\n  <div class="section-top flex-middle">\n    <p class="big"><%= labelPrefix %></p>\n  </div>\n  <div class="section-center flex-center">\n    <div class="checkin-label">\n      <p class="huge bold"><%= label %></p>\n    </div>\n  </div>\n  <div class="section-bottom flex-middle">\n    <p class="small"><%= labelPostfix %></p>\n  </div>\n<% } else { %>\n  <div class="section-top"></div>\n  <div class="section-center flex-center">\n    <p><%= error ? errorMessage : wait %></p>\n  </div>\n  <div class="section-bottom"></div>\n<% } %>';

var defaultViewContent = {
  labelPrefix: 'Go to',
  labelPostfix: 'Touch the screen<br class="portrait-only" />when you are ready.',
  error: false,
  errorMessage: 'Sorry,<br/>no place available',
  wait: 'Please wait...',
  label: ''
};

/**
 * Interface for the client `'checkin'` service.
 *
 * This service is one of the provided services aimed at identifying clients inside
 * the experience along with the [`'locator'`]{@link module:soundworks/client.Locator}
 * and [`'placer'`]{@link module:soundworks/client.Placer} services.
 *
 * The `'checkin'` service is the most simple among these services as the server
 * simply assigns a ticket to the client among the available ones. The ticket can
 * optionally be associated with coordinates or labels according to the server
 * `setup` configuration.
 *
 * The service requires the ['platform']{@link module:soundworks/client.Platform}
 * service, as it is considered that an index should be given only to clients who
 * actively entered the application.
 *
 * __*The service must be used with its [server-side counterpart]{@link module:soundworks/server.Checkin}*__
 *
 * @see {@link module:soundworks/client.Locator}
 * @see {@link module:soundworks/client.Placer}
 *
 * @param {Object} options
 * @param {Boolean} [options.showDialog=false] - Define if the service should
 *  display a view informing the client of its position.
 *
 * @memberof module:soundworks/client
 * @example
 * // inside the experience constructor
 * this.checkin = this.require('checkin', { showDialog: true });
 */

var Checkin = function (_Service) {
  (0, _inherits3.default)(Checkin, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  function Checkin() {
    (0, _classCallCheck3.default)(this, Checkin);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Checkin.__proto__ || (0, _getPrototypeOf2.default)(Checkin)).call(this, SERVICE_ID, true));

    var defaults = {
      showDialog: false,
      order: 'ascending',
      viewCtor: _SegmentedView2.default,
      viewPriority: 6
    };

    _this.configure(defaults);

    _this._defaultViewTemplate = defaultViewTemplate;
    _this._defaultViewContent = defaultViewContent;

    _this.require('platform', { showDialog: true });
    // bind callbacks to the current instance
    _this._onPositionResponse = _this._onPositionResponse.bind(_this);
    _this._onUnavailableResponse = _this._onUnavailableResponse.bind(_this);
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(Checkin, [{
    key: 'init',
    value: function init() {
      /**
       * Index given by the server.
       * @type {Number}
       */
      this.index = -1;

      /**
       * Optionnal label given by the server.
       * @type {String}
       */
      this.label = null;

      /**
       * Optionnal coordinates given by the server.
       * @type {String}
       */
      this.coordinates = null;

      // view should be always be created in case of unavailability
      this.viewCtor = this.options.viewCtor;
      this.view = this.createView();
    }

    /** @private */

  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)(Checkin.prototype.__proto__ || (0, _getPrototypeOf2.default)(Checkin.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      this.setup = this._sharedConfigService;
      // send request to the server
      this.send('request', this.options.order);
      // setup listeners for the server's response
      this.receive('position', this._onPositionResponse);
      this.receive('unavailable', this._onUnavailableResponse);

      this.show();
    }

    /** @private */

  }, {
    key: 'stop',
    value: function stop() {
      (0, _get3.default)(Checkin.prototype.__proto__ || (0, _getPrototypeOf2.default)(Checkin.prototype), 'stop', this).call(this);
      // Remove listeners for the server's response
      this.removeListener('position', this._onPositionResponse);
      this.removeListener('unavailable', this._onUnavailableResponse);

      this.hide();
    }

    /** @private */

  }, {
    key: '_onPositionResponse',
    value: function _onPositionResponse(index, label, coordinates) {
      var _this2 = this;

      _client2.default.index = this.index = index;
      _client2.default.label = this.label = label;
      _client2.default.coordinates = this.coordinates = coordinates;

      if (this.options.showDialog) {
        var displayLabel = label || (index + 1).toString();
        var eventName = _client2.default.platform.isMobile ? 'click' : 'touchstart';

        this.viewContent.label = displayLabel;
        this.view.installEvents((0, _defineProperty3.default)({}, eventName, function () {
          return _this2.ready();
        }));
        this.view.render();
      } else {
        this.ready();
      }
    }

    /** @private */

  }, {
    key: '_onUnavailableResponse',
    value: function _onUnavailableResponse() {
      this.viewContent.error = true;
      this.view.render();
    }
  }]);
  return Checkin;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, Checkin);

exports.default = Checkin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNoZWNraW4uanMiXSwibmFtZXMiOlsiU0VSVklDRV9JRCIsImRlZmF1bHRWaWV3VGVtcGxhdGUiLCJkZWZhdWx0Vmlld0NvbnRlbnQiLCJsYWJlbFByZWZpeCIsImxhYmVsUG9zdGZpeCIsImVycm9yIiwiZXJyb3JNZXNzYWdlIiwid2FpdCIsImxhYmVsIiwiQ2hlY2tpbiIsImRlZmF1bHRzIiwic2hvd0RpYWxvZyIsIm9yZGVyIiwidmlld0N0b3IiLCJ2aWV3UHJpb3JpdHkiLCJjb25maWd1cmUiLCJfZGVmYXVsdFZpZXdUZW1wbGF0ZSIsIl9kZWZhdWx0Vmlld0NvbnRlbnQiLCJyZXF1aXJlIiwiX29uUG9zaXRpb25SZXNwb25zZSIsImJpbmQiLCJfb25VbmF2YWlsYWJsZVJlc3BvbnNlIiwiaW5kZXgiLCJjb29yZGluYXRlcyIsIm9wdGlvbnMiLCJ2aWV3IiwiY3JlYXRlVmlldyIsImhhc1N0YXJ0ZWQiLCJpbml0Iiwic2V0dXAiLCJfc2hhcmVkQ29uZmlnU2VydmljZSIsInNlbmQiLCJyZWNlaXZlIiwic2hvdyIsInJlbW92ZUxpc3RlbmVyIiwiaGlkZSIsImRpc3BsYXlMYWJlbCIsInRvU3RyaW5nIiwiZXZlbnROYW1lIiwicGxhdGZvcm0iLCJpc01vYmlsZSIsInZpZXdDb250ZW50IiwiaW5zdGFsbEV2ZW50cyIsInJlYWR5IiwicmVuZGVyIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBR0EsSUFBTUEsYUFBYSxpQkFBbkI7O0FBRUEsSUFBTUMscWtCQUFOOztBQXFCQSxJQUFNQyxxQkFBcUI7QUFDekJDLGVBQWEsT0FEWTtBQUV6QkMsZ0JBQWMsaUVBRlc7QUFHekJDLFNBQU8sS0FIa0I7QUFJekJDLGdCQUFjLCtCQUpXO0FBS3pCQyxRQUFNLGdCQUxtQjtBQU16QkMsU0FBTztBQU5rQixDQUEzQjs7QUFTQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQThCTUMsTzs7O0FBQ0o7QUFDQSxxQkFBYztBQUFBOztBQUFBLHdJQUNOVCxVQURNLEVBQ00sSUFETjs7QUFHWixRQUFNVSxXQUFXO0FBQ2ZDLGtCQUFZLEtBREc7QUFFZkMsYUFBTyxXQUZRO0FBR2ZDLHVDQUhlO0FBSWZDLG9CQUFjO0FBSkMsS0FBakI7O0FBT0EsVUFBS0MsU0FBTCxDQUFlTCxRQUFmOztBQUVBLFVBQUtNLG9CQUFMLEdBQTRCZixtQkFBNUI7QUFDQSxVQUFLZ0IsbUJBQUwsR0FBMkJmLGtCQUEzQjs7QUFFQSxVQUFLZ0IsT0FBTCxDQUFhLFVBQWIsRUFBeUIsRUFBRVAsWUFBWSxJQUFkLEVBQXpCO0FBQ0E7QUFDQSxVQUFLUSxtQkFBTCxHQUEyQixNQUFLQSxtQkFBTCxDQUF5QkMsSUFBekIsT0FBM0I7QUFDQSxVQUFLQyxzQkFBTCxHQUE4QixNQUFLQSxzQkFBTCxDQUE0QkQsSUFBNUIsT0FBOUI7QUFsQlk7QUFtQmI7O0FBRUQ7Ozs7OzJCQUNPO0FBQ0w7Ozs7QUFJQSxXQUFLRSxLQUFMLEdBQWEsQ0FBQyxDQUFkOztBQUVBOzs7O0FBSUEsV0FBS2QsS0FBTCxHQUFhLElBQWI7O0FBRUE7Ozs7QUFJQSxXQUFLZSxXQUFMLEdBQW1CLElBQW5COztBQUVBO0FBQ0EsV0FBS1YsUUFBTCxHQUFnQixLQUFLVyxPQUFMLENBQWFYLFFBQTdCO0FBQ0EsV0FBS1ksSUFBTCxHQUFZLEtBQUtDLFVBQUwsRUFBWjtBQUNEOztBQUVEOzs7OzRCQUNRO0FBQ047O0FBRUEsVUFBSSxDQUFDLEtBQUtDLFVBQVYsRUFDRSxLQUFLQyxJQUFMOztBQUVGLFdBQUtDLEtBQUwsR0FBYSxLQUFLQyxvQkFBbEI7QUFDQTtBQUNBLFdBQUtDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLEtBQUtQLE9BQUwsQ0FBYVosS0FBbEM7QUFDQTtBQUNBLFdBQUtvQixPQUFMLENBQWEsVUFBYixFQUF5QixLQUFLYixtQkFBOUI7QUFDQSxXQUFLYSxPQUFMLENBQWEsYUFBYixFQUE0QixLQUFLWCxzQkFBakM7O0FBRUEsV0FBS1ksSUFBTDtBQUNEOztBQUVEOzs7OzJCQUNPO0FBQ0w7QUFDQTtBQUNBLFdBQUtDLGNBQUwsQ0FBb0IsVUFBcEIsRUFBZ0MsS0FBS2YsbUJBQXJDO0FBQ0EsV0FBS2UsY0FBTCxDQUFvQixhQUFwQixFQUFtQyxLQUFLYixzQkFBeEM7O0FBRUEsV0FBS2MsSUFBTDtBQUNEOztBQUVEOzs7O3dDQUNvQmIsSyxFQUFPZCxLLEVBQU9lLFcsRUFBYTtBQUFBOztBQUM3Qyx1QkFBT0QsS0FBUCxHQUFlLEtBQUtBLEtBQUwsR0FBYUEsS0FBNUI7QUFDQSx1QkFBT2QsS0FBUCxHQUFlLEtBQUtBLEtBQUwsR0FBYUEsS0FBNUI7QUFDQSx1QkFBT2UsV0FBUCxHQUFxQixLQUFLQSxXQUFMLEdBQW1CQSxXQUF4Qzs7QUFFQSxVQUFJLEtBQUtDLE9BQUwsQ0FBYWIsVUFBakIsRUFBNkI7QUFDM0IsWUFBTXlCLGVBQWU1QixTQUFTLENBQUNjLFFBQVEsQ0FBVCxFQUFZZSxRQUFaLEVBQTlCO0FBQ0EsWUFBTUMsWUFBWSxpQkFBT0MsUUFBUCxDQUFnQkMsUUFBaEIsR0FBMkIsT0FBM0IsR0FBcUMsWUFBdkQ7O0FBRUEsYUFBS0MsV0FBTCxDQUFpQmpDLEtBQWpCLEdBQXlCNEIsWUFBekI7QUFDQSxhQUFLWCxJQUFMLENBQVVpQixhQUFWLG1DQUEyQkosU0FBM0IsRUFBdUM7QUFBQSxpQkFBTSxPQUFLSyxLQUFMLEVBQU47QUFBQSxTQUF2QztBQUNBLGFBQUtsQixJQUFMLENBQVVtQixNQUFWO0FBQ0QsT0FQRCxNQU9PO0FBQ0wsYUFBS0QsS0FBTDtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7NkNBQ3lCO0FBQ3ZCLFdBQUtGLFdBQUwsQ0FBaUJwQyxLQUFqQixHQUF5QixJQUF6QjtBQUNBLFdBQUtvQixJQUFMLENBQVVtQixNQUFWO0FBQ0Q7Ozs7O0FBR0gseUJBQWVDLFFBQWYsQ0FBd0I3QyxVQUF4QixFQUFvQ1MsT0FBcEM7O2tCQUVlQSxPIiwiZmlsZSI6IkNoZWNraW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xpZW50IGZyb20gJy4uL2NvcmUvY2xpZW50JztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgU2VnbWVudGVkVmlldyBmcm9tICcuLi92aWV3cy9TZWdtZW50ZWRWaWV3JztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6Y2hlY2tpbic7XG5cbmNvbnN0IGRlZmF1bHRWaWV3VGVtcGxhdGUgPSBgXG48JSBpZiAobGFiZWwpIHsgJT5cbiAgPGRpdiBjbGFzcz1cInNlY3Rpb24tdG9wIGZsZXgtbWlkZGxlXCI+XG4gICAgPHAgY2xhc3M9XCJiaWdcIj48JT0gbGFiZWxQcmVmaXggJT48L3A+XG4gIDwvZGl2PlxuICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1jZW50ZXIgZmxleC1jZW50ZXJcIj5cbiAgICA8ZGl2IGNsYXNzPVwiY2hlY2tpbi1sYWJlbFwiPlxuICAgICAgPHAgY2xhc3M9XCJodWdlIGJvbGRcIj48JT0gbGFiZWwgJT48L3A+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1ib3R0b20gZmxleC1taWRkbGVcIj5cbiAgICA8cCBjbGFzcz1cInNtYWxsXCI+PCU9IGxhYmVsUG9zdGZpeCAlPjwvcD5cbiAgPC9kaXY+XG48JSB9IGVsc2UgeyAlPlxuICA8ZGl2IGNsYXNzPVwic2VjdGlvbi10b3BcIj48L2Rpdj5cbiAgPGRpdiBjbGFzcz1cInNlY3Rpb24tY2VudGVyIGZsZXgtY2VudGVyXCI+XG4gICAgPHA+PCU9IGVycm9yID8gZXJyb3JNZXNzYWdlIDogd2FpdCAlPjwvcD5cbiAgPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWJvdHRvbVwiPjwvZGl2PlxuPCUgfSAlPmA7XG5cbmNvbnN0IGRlZmF1bHRWaWV3Q29udGVudCA9IHtcbiAgbGFiZWxQcmVmaXg6ICdHbyB0bycsXG4gIGxhYmVsUG9zdGZpeDogJ1RvdWNoIHRoZSBzY3JlZW48YnIgY2xhc3M9XCJwb3J0cmFpdC1vbmx5XCIgLz53aGVuIHlvdSBhcmUgcmVhZHkuJyxcbiAgZXJyb3I6IGZhbHNlLFxuICBlcnJvck1lc3NhZ2U6ICdTb3JyeSw8YnIvPm5vIHBsYWNlIGF2YWlsYWJsZScsXG4gIHdhaXQ6ICdQbGVhc2Ugd2FpdC4uLicsXG4gIGxhYmVsOiAnJyxcbn07XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgY2xpZW50IGAnY2hlY2tpbidgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGlzIG9uZSBvZiB0aGUgcHJvdmlkZWQgc2VydmljZXMgYWltZWQgYXQgaWRlbnRpZnlpbmcgY2xpZW50cyBpbnNpZGVcbiAqIHRoZSBleHBlcmllbmNlIGFsb25nIHdpdGggdGhlIFtgJ2xvY2F0b3InYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkxvY2F0b3J9XG4gKiBhbmQgW2AncGxhY2VyJ2Bde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGFjZXJ9IHNlcnZpY2VzLlxuICpcbiAqIFRoZSBgJ2NoZWNraW4nYCBzZXJ2aWNlIGlzIHRoZSBtb3N0IHNpbXBsZSBhbW9uZyB0aGVzZSBzZXJ2aWNlcyBhcyB0aGUgc2VydmVyXG4gKiBzaW1wbHkgYXNzaWducyBhIHRpY2tldCB0byB0aGUgY2xpZW50IGFtb25nIHRoZSBhdmFpbGFibGUgb25lcy4gVGhlIHRpY2tldCBjYW5cbiAqIG9wdGlvbmFsbHkgYmUgYXNzb2NpYXRlZCB3aXRoIGNvb3JkaW5hdGVzIG9yIGxhYmVscyBhY2NvcmRpbmcgdG8gdGhlIHNlcnZlclxuICogYHNldHVwYCBjb25maWd1cmF0aW9uLlxuICpcbiAqIFRoZSBzZXJ2aWNlIHJlcXVpcmVzIHRoZSBbJ3BsYXRmb3JtJ117QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYXRmb3JtfVxuICogc2VydmljZSwgYXMgaXQgaXMgY29uc2lkZXJlZCB0aGF0IGFuIGluZGV4IHNob3VsZCBiZSBnaXZlbiBvbmx5IHRvIGNsaWVudHMgd2hvXG4gKiBhY3RpdmVseSBlbnRlcmVkIHRoZSBhcHBsaWNhdGlvbi5cbiAqXG4gKiBfXypUaGUgc2VydmljZSBtdXN0IGJlIHVzZWQgd2l0aCBpdHMgW3NlcnZlci1zaWRlIGNvdW50ZXJwYXJ0XXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuQ2hlY2tpbn0qX19cbiAqXG4gKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuTG9jYXRvcn1cbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGFjZXJ9XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuc2hvd0RpYWxvZz1mYWxzZV0gLSBEZWZpbmUgaWYgdGhlIHNlcnZpY2Ugc2hvdWxkXG4gKiAgZGlzcGxheSBhIHZpZXcgaW5mb3JtaW5nIHRoZSBjbGllbnQgb2YgaXRzIHBvc2l0aW9uLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBleGFtcGxlXG4gKiAvLyBpbnNpZGUgdGhlIGV4cGVyaWVuY2UgY29uc3RydWN0b3JcbiAqIHRoaXMuY2hlY2tpbiA9IHRoaXMucmVxdWlyZSgnY2hlY2tpbicsIHsgc2hvd0RpYWxvZzogdHJ1ZSB9KTtcbiAqL1xuY2xhc3MgQ2hlY2tpbiBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIHRydWUpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBzaG93RGlhbG9nOiBmYWxzZSxcbiAgICAgIG9yZGVyOiAnYXNjZW5kaW5nJyxcbiAgICAgIHZpZXdDdG9yOiBTZWdtZW50ZWRWaWV3LFxuICAgICAgdmlld1ByaW9yaXR5OiA2LFxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICB0aGlzLl9kZWZhdWx0Vmlld1RlbXBsYXRlID0gZGVmYXVsdFZpZXdUZW1wbGF0ZTtcbiAgICB0aGlzLl9kZWZhdWx0Vmlld0NvbnRlbnQgPSBkZWZhdWx0Vmlld0NvbnRlbnQ7XG5cbiAgICB0aGlzLnJlcXVpcmUoJ3BsYXRmb3JtJywgeyBzaG93RGlhbG9nOiB0cnVlIH0pO1xuICAgIC8vIGJpbmQgY2FsbGJhY2tzIHRvIHRoZSBjdXJyZW50IGluc3RhbmNlXG4gICAgdGhpcy5fb25Qb3NpdGlvblJlc3BvbnNlID0gdGhpcy5fb25Qb3NpdGlvblJlc3BvbnNlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25VbmF2YWlsYWJsZVJlc3BvbnNlID0gdGhpcy5fb25VbmF2YWlsYWJsZVJlc3BvbnNlLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgaW5pdCgpIHtcbiAgICAvKipcbiAgICAgKiBJbmRleCBnaXZlbiBieSB0aGUgc2VydmVyLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5pbmRleCA9IC0xO1xuXG4gICAgLyoqXG4gICAgICogT3B0aW9ubmFsIGxhYmVsIGdpdmVuIGJ5IHRoZSBzZXJ2ZXIuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLmxhYmVsID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIE9wdGlvbm5hbCBjb29yZGluYXRlcyBnaXZlbiBieSB0aGUgc2VydmVyLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5jb29yZGluYXRlcyA9IG51bGw7XG5cbiAgICAvLyB2aWV3IHNob3VsZCBiZSBhbHdheXMgYmUgY3JlYXRlZCBpbiBjYXNlIG9mIHVuYXZhaWxhYmlsaXR5XG4gICAgdGhpcy52aWV3Q3RvciA9IHRoaXMub3B0aW9ucy52aWV3Q3RvcjtcbiAgICB0aGlzLnZpZXcgPSB0aGlzLmNyZWF0ZVZpZXcoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgaWYgKCF0aGlzLmhhc1N0YXJ0ZWQpXG4gICAgICB0aGlzLmluaXQoKTtcblxuICAgIHRoaXMuc2V0dXAgPSB0aGlzLl9zaGFyZWRDb25maWdTZXJ2aWNlXG4gICAgLy8gc2VuZCByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXJcbiAgICB0aGlzLnNlbmQoJ3JlcXVlc3QnLCB0aGlzLm9wdGlvbnMub3JkZXIpO1xuICAgIC8vIHNldHVwIGxpc3RlbmVycyBmb3IgdGhlIHNlcnZlcidzIHJlc3BvbnNlXG4gICAgdGhpcy5yZWNlaXZlKCdwb3NpdGlvbicsIHRoaXMuX29uUG9zaXRpb25SZXNwb25zZSk7XG4gICAgdGhpcy5yZWNlaXZlKCd1bmF2YWlsYWJsZScsIHRoaXMuX29uVW5hdmFpbGFibGVSZXNwb25zZSk7XG5cbiAgICB0aGlzLnNob3coKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdG9wKCkge1xuICAgIHN1cGVyLnN0b3AoKTtcbiAgICAvLyBSZW1vdmUgbGlzdGVuZXJzIGZvciB0aGUgc2VydmVyJ3MgcmVzcG9uc2VcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdwb3NpdGlvbicsIHRoaXMuX29uUG9zaXRpb25SZXNwb25zZSk7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcigndW5hdmFpbGFibGUnLCB0aGlzLl9vblVuYXZhaWxhYmxlUmVzcG9uc2UpO1xuXG4gICAgdGhpcy5oaWRlKCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uUG9zaXRpb25SZXNwb25zZShpbmRleCwgbGFiZWwsIGNvb3JkaW5hdGVzKSB7XG4gICAgY2xpZW50LmluZGV4ID0gdGhpcy5pbmRleCA9IGluZGV4O1xuICAgIGNsaWVudC5sYWJlbCA9IHRoaXMubGFiZWwgPSBsYWJlbDtcbiAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSB0aGlzLmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnNob3dEaWFsb2cpIHtcbiAgICAgIGNvbnN0IGRpc3BsYXlMYWJlbCA9IGxhYmVsIHx8IChpbmRleCArIDEpLnRvU3RyaW5nKCk7XG4gICAgICBjb25zdCBldmVudE5hbWUgPSBjbGllbnQucGxhdGZvcm0uaXNNb2JpbGUgPyAnY2xpY2snIDogJ3RvdWNoc3RhcnQnO1xuXG4gICAgICB0aGlzLnZpZXdDb250ZW50LmxhYmVsID0gZGlzcGxheUxhYmVsO1xuICAgICAgdGhpcy52aWV3Lmluc3RhbGxFdmVudHMoeyBbZXZlbnROYW1lXTogKCkgPT4gdGhpcy5yZWFkeSgpIH0pO1xuICAgICAgdGhpcy52aWV3LnJlbmRlcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlYWR5KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vblVuYXZhaWxhYmxlUmVzcG9uc2UoKSB7XG4gICAgdGhpcy52aWV3Q29udGVudC5lcnJvciA9IHRydWU7XG4gICAgdGhpcy52aWV3LnJlbmRlcigpO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIENoZWNraW4pO1xuXG5leHBvcnQgZGVmYXVsdCBDaGVja2luO1xuIl19