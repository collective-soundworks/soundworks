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

var _SegmentedView = require('../display/SegmentedView');

var _SegmentedView2 = _interopRequireDefault(_SegmentedView);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:checkin';

/**
 * Assign places among a set of predefined positions (i.e. labels and/or coordinates).
 * The module requests a position to the server and waits for the answer.
 *
 * The module finishes its initialization when it receives a positive answer from the server. Otherwise (*e.g.* no more positions available), the module stays in its state and never finishes its initialization.
 *
 * (See also {@link src/server/ServerCheckin.js~ServerCheckin} on the server side.)
 *
 * @example
 * const checkin = new ClientCheckin({ capacity: 100 });
 */

var ClientCheckin = function (_Service) {
  (0, _inherits3.default)(ClientCheckin, _Service);

  function ClientCheckin() {
    (0, _classCallCheck3.default)(this, ClientCheckin);


    /**
     * @param {Object} defaults - Default options.
     * @param {Boolean} [defaults.showDialog=false] - Indicates whether the view displays text or not.
     * @param {View} [defaults.viewCtor=SegmentedView] - The constructor to use in order to create the view.
     */

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ClientCheckin).call(this, SERVICE_ID, true));

    var defaults = {
      showDialog: false,
      viewCtor: _SegmentedView2.default,
      viewPriority: 6
    };

    _this.configure(defaults);

    _this.require('welcome');
    // bind callbacks to the current instance
    _this._onPositionResponse = _this._onPositionResponse.bind(_this);
    _this._onUnavailableResponse = _this._onUnavailableResponse.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(ClientCheckin, [{
    key: 'init',
    value: function init() {

      /**
       * Index given by the serverside {@link src/server/ServerCheckin.js~ServerCheckin} module.
       * @type {Number}
       */
      this.index = -1;

      /**
       * Label of the index assigned by the serverside {@link src/server/Checkin.js~Checkin} module (if any).
       * @type {String}
       */
      this.label = null;

      if (this.options.showDialog) {
        this.viewCtor = this.options.viewCtor;
        this.view = this.createView();
      }
    }

    /** private */

  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(ClientCheckin.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      this.setup = this._sharedConfigService;
      // send request to the server
      this.send('request');
      // setup listeners for the server's response
      this.receive('position', this._onPositionResponse);
      this.receive('unavailable', this._onUnavailableResponse);

      if (this.options.showDialog) this.show();
    }

    /** private */

  }, {
    key: 'stop',
    value: function stop() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(ClientCheckin.prototype), 'stop', this).call(this);
      // Remove listeners for the server's response
      this.removeListener('position', this._onPositionResponse);
      this.removeListener('unavailable', this._onUnavailableResponse);

      if (this.options.showDialog) this.hide();
    }
  }, {
    key: '_onPositionResponse',
    value: function _onPositionResponse(index, label, coordinates) {
      var _this2 = this;

      _client2.default.index = this.index = index;
      _client2.default.label = this.label = label;
      _client2.default.coordinates = coordinates;

      if (this.options.showDialog) {
        var displayLabel = label || (index + 1).toString();
        var eventName = _client2.default.platform.isMobile ? 'click' : 'touchstart';

        this.content.label = displayLabel;
        this.view.installEvents((0, _defineProperty3.default)({}, eventName, function () {
          return _this2.ready();
        }));
        this.view.render();
      } else {
        this.ready();
      }
    }
  }, {
    key: '_onUnavailableResponse',
    value: function _onUnavailableResponse() {
      this.content.error = true;
      this.view.render();
    }
  }]);
  return ClientCheckin;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, ClientCheckin);

exports.default = ClientCheckin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNsaWVudENoZWNraW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNLGFBQWEsaUJBQWI7Ozs7Ozs7Ozs7Ozs7O0lBYUE7OztBQUNKLFdBREksYUFDSixHQUFjO3dDQURWLGVBQ1U7Ozs7Ozs7Ozs2RkFEViwwQkFFSSxZQUFZLE9BRE47O0FBUVosUUFBTSxXQUFXO0FBQ2Ysa0JBQVksS0FBWjtBQUNBLHVDQUZlO0FBR2Ysb0JBQWMsQ0FBZDtLQUhJLENBUk07O0FBY1osVUFBSyxTQUFMLENBQWUsUUFBZixFQWRZOztBQWdCWixVQUFLLE9BQUwsQ0FBYSxTQUFiOztBQWhCWSxTQWtCWixDQUFLLG1CQUFMLEdBQTJCLE1BQUssbUJBQUwsQ0FBeUIsSUFBekIsT0FBM0IsQ0FsQlk7QUFtQlosVUFBSyxzQkFBTCxHQUE4QixNQUFLLHNCQUFMLENBQTRCLElBQTVCLE9BQTlCLENBbkJZOztHQUFkOzs2QkFESTs7MkJBdUJHOzs7Ozs7QUFNTCxXQUFLLEtBQUwsR0FBYSxDQUFDLENBQUQ7Ozs7OztBQU5SLFVBWUwsQ0FBSyxLQUFMLEdBQWEsSUFBYixDQVpLOztBQWNMLFVBQUksS0FBSyxPQUFMLENBQWEsVUFBYixFQUF5QjtBQUMzQixhQUFLLFFBQUwsR0FBZ0IsS0FBSyxPQUFMLENBQWEsUUFBYixDQURXO0FBRTNCLGFBQUssSUFBTCxHQUFZLEtBQUssVUFBTCxFQUFaLENBRjJCO09BQTdCOzs7Ozs7OzRCQU9NO0FBQ04sdURBN0NFLG1EQTZDRixDQURNOztBQUdOLFVBQUksQ0FBQyxLQUFLLFVBQUwsRUFDSCxLQUFLLElBQUwsR0FERjs7QUFHQSxXQUFLLEtBQUwsR0FBYSxLQUFLLG9CQUFMOztBQU5QLFVBUU4sQ0FBSyxJQUFMLENBQVUsU0FBVjs7QUFSTSxVQVVOLENBQUssT0FBTCxDQUFhLFVBQWIsRUFBeUIsS0FBSyxtQkFBTCxDQUF6QixDQVZNO0FBV04sV0FBSyxPQUFMLENBQWEsYUFBYixFQUE0QixLQUFLLHNCQUFMLENBQTVCLENBWE07O0FBYU4sVUFBSSxLQUFLLE9BQUwsQ0FBYSxVQUFiLEVBQ0YsS0FBSyxJQUFMLEdBREY7Ozs7Ozs7MkJBS0s7QUFDTCx1REEvREUsa0RBK0RGOztBQURLLFVBR0wsQ0FBSyxjQUFMLENBQW9CLFVBQXBCLEVBQWdDLEtBQUssbUJBQUwsQ0FBaEMsQ0FISztBQUlMLFdBQUssY0FBTCxDQUFvQixhQUFwQixFQUFtQyxLQUFLLHNCQUFMLENBQW5DLENBSks7O0FBTUwsVUFBSSxLQUFLLE9BQUwsQ0FBYSxVQUFiLEVBQ0YsS0FBSyxJQUFMLEdBREY7Ozs7d0NBSWtCLE9BQU8sT0FBTyxhQUFhOzs7QUFDN0MsdUJBQU8sS0FBUCxHQUFlLEtBQUssS0FBTCxHQUFhLEtBQWIsQ0FEOEI7QUFFN0MsdUJBQU8sS0FBUCxHQUFlLEtBQUssS0FBTCxHQUFhLEtBQWIsQ0FGOEI7QUFHN0MsdUJBQU8sV0FBUCxHQUFxQixXQUFyQixDQUg2Qzs7QUFLN0MsVUFBSSxLQUFLLE9BQUwsQ0FBYSxVQUFiLEVBQXlCO0FBQzNCLFlBQU0sZUFBZSxTQUFTLENBQUMsUUFBUSxDQUFSLENBQUQsQ0FBWSxRQUFaLEVBQVQsQ0FETTtBQUUzQixZQUFNLFlBQVksaUJBQU8sUUFBUCxDQUFnQixRQUFoQixHQUEyQixPQUEzQixHQUFxQyxZQUFyQyxDQUZTOztBQUkzQixhQUFLLE9BQUwsQ0FBYSxLQUFiLEdBQXFCLFlBQXJCLENBSjJCO0FBSzNCLGFBQUssSUFBTCxDQUFVLGFBQVYsbUNBQTJCLFdBQVk7aUJBQU0sT0FBSyxLQUFMO1NBQU4sQ0FBdkMsRUFMMkI7QUFNM0IsYUFBSyxJQUFMLENBQVUsTUFBVixHQU4yQjtPQUE3QixNQU9PO0FBQ0wsYUFBSyxLQUFMLEdBREs7T0FQUDs7Ozs2Q0FZdUI7QUFDdkIsV0FBSyxPQUFMLENBQWEsS0FBYixHQUFxQixJQUFyQixDQUR1QjtBQUV2QixXQUFLLElBQUwsQ0FBVSxNQUFWLEdBRnVCOzs7U0F6RnJCOzs7QUErRk4seUJBQWUsUUFBZixDQUF3QixVQUF4QixFQUFvQyxhQUFwQzs7a0JBRWUiLCJmaWxlIjoiQ2xpZW50Q2hlY2tpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbGllbnQgZnJvbSAnLi4vY29yZS9jbGllbnQnO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBTZWdtZW50ZWRWaWV3IGZyb20gJy4uL2Rpc3BsYXkvU2VnbWVudGVkVmlldyc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpjaGVja2luJztcblxuLyoqXG4gKiBBc3NpZ24gcGxhY2VzIGFtb25nIGEgc2V0IG9mIHByZWRlZmluZWQgcG9zaXRpb25zIChpLmUuIGxhYmVscyBhbmQvb3IgY29vcmRpbmF0ZXMpLlxuICogVGhlIG1vZHVsZSByZXF1ZXN0cyBhIHBvc2l0aW9uIHRvIHRoZSBzZXJ2ZXIgYW5kIHdhaXRzIGZvciB0aGUgYW5zd2VyLlxuICpcbiAqIFRoZSBtb2R1bGUgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uIHdoZW4gaXQgcmVjZWl2ZXMgYSBwb3NpdGl2ZSBhbnN3ZXIgZnJvbSB0aGUgc2VydmVyLiBPdGhlcndpc2UgKCplLmcuKiBubyBtb3JlIHBvc2l0aW9ucyBhdmFpbGFibGUpLCB0aGUgbW9kdWxlIHN0YXlzIGluIGl0cyBzdGF0ZSBhbmQgbmV2ZXIgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL3NlcnZlci9TZXJ2ZXJDaGVja2luLmpzflNlcnZlckNoZWNraW59IG9uIHRoZSBzZXJ2ZXIgc2lkZS4pXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IGNoZWNraW4gPSBuZXcgQ2xpZW50Q2hlY2tpbih7IGNhcGFjaXR5OiAxMDAgfSk7XG4gKi9cbmNsYXNzIENsaWVudENoZWNraW4gZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgdHJ1ZSk7XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGVmYXVsdHMgLSBEZWZhdWx0IG9wdGlvbnMuXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbZGVmYXVsdHMuc2hvd0RpYWxvZz1mYWxzZV0gLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgdmlldyBkaXNwbGF5cyB0ZXh0IG9yIG5vdC5cbiAgICAgKiBAcGFyYW0ge1ZpZXd9IFtkZWZhdWx0cy52aWV3Q3Rvcj1TZWdtZW50ZWRWaWV3XSAtIFRoZSBjb25zdHJ1Y3RvciB0byB1c2UgaW4gb3JkZXIgdG8gY3JlYXRlIHRoZSB2aWV3LlxuICAgICAqL1xuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgc2hvd0RpYWxvZzogZmFsc2UsXG4gICAgICB2aWV3Q3RvcjogU2VnbWVudGVkVmlldyxcbiAgICAgIHZpZXdQcmlvcml0eTogNixcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgdGhpcy5yZXF1aXJlKCd3ZWxjb21lJyk7XG4gICAgLy8gYmluZCBjYWxsYmFja3MgdG8gdGhlIGN1cnJlbnQgaW5zdGFuY2VcbiAgICB0aGlzLl9vblBvc2l0aW9uUmVzcG9uc2UgPSB0aGlzLl9vblBvc2l0aW9uUmVzcG9uc2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vblVuYXZhaWxhYmxlUmVzcG9uc2UgPSB0aGlzLl9vblVuYXZhaWxhYmxlUmVzcG9uc2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGluaXQoKSB7XG5cbiAgICAvKipcbiAgICAgKiBJbmRleCBnaXZlbiBieSB0aGUgc2VydmVyc2lkZSB7QGxpbmsgc3JjL3NlcnZlci9TZXJ2ZXJDaGVja2luLmpzflNlcnZlckNoZWNraW59IG1vZHVsZS5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuaW5kZXggPSAtMTtcblxuICAgIC8qKlxuICAgICAqIExhYmVsIG9mIHRoZSBpbmRleCBhc3NpZ25lZCBieSB0aGUgc2VydmVyc2lkZSB7QGxpbmsgc3JjL3NlcnZlci9DaGVja2luLmpzfkNoZWNraW59IG1vZHVsZSAoaWYgYW55KS5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMubGFiZWwgPSBudWxsO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5zaG93RGlhbG9nKSB7XG4gICAgICB0aGlzLnZpZXdDdG9yID0gdGhpcy5vcHRpb25zLnZpZXdDdG9yO1xuICAgICAgdGhpcy52aWV3ID0gdGhpcy5jcmVhdGVWaWV3KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICghdGhpcy5oYXNTdGFydGVkKVxuICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB0aGlzLnNldHVwID0gdGhpcy5fc2hhcmVkQ29uZmlnU2VydmljZVxuICAgIC8vIHNlbmQgcmVxdWVzdCB0byB0aGUgc2VydmVyXG4gICAgdGhpcy5zZW5kKCdyZXF1ZXN0Jyk7XG4gICAgLy8gc2V0dXAgbGlzdGVuZXJzIGZvciB0aGUgc2VydmVyJ3MgcmVzcG9uc2VcbiAgICB0aGlzLnJlY2VpdmUoJ3Bvc2l0aW9uJywgdGhpcy5fb25Qb3NpdGlvblJlc3BvbnNlKTtcbiAgICB0aGlzLnJlY2VpdmUoJ3VuYXZhaWxhYmxlJywgdGhpcy5fb25VbmF2YWlsYWJsZVJlc3BvbnNlKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0RpYWxvZylcbiAgICAgIHRoaXMuc2hvdygpO1xuICB9XG5cbiAgLyoqIHByaXZhdGUgKi9cbiAgc3RvcCgpIHtcbiAgICBzdXBlci5zdG9wKCk7XG4gICAgLy8gUmVtb3ZlIGxpc3RlbmVycyBmb3IgdGhlIHNlcnZlcidzIHJlc3BvbnNlXG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcigncG9zaXRpb24nLCB0aGlzLl9vblBvc2l0aW9uUmVzcG9uc2UpO1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ3VuYXZhaWxhYmxlJywgdGhpcy5fb25VbmF2YWlsYWJsZVJlc3BvbnNlKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0RpYWxvZylcbiAgICAgIHRoaXMuaGlkZSgpO1xuICB9XG5cbiAgX29uUG9zaXRpb25SZXNwb25zZShpbmRleCwgbGFiZWwsIGNvb3JkaW5hdGVzKSB7XG4gICAgY2xpZW50LmluZGV4ID0gdGhpcy5pbmRleCA9IGluZGV4O1xuICAgIGNsaWVudC5sYWJlbCA9IHRoaXMubGFiZWwgPSBsYWJlbDtcbiAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcztcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0RpYWxvZykge1xuICAgICAgY29uc3QgZGlzcGxheUxhYmVsID0gbGFiZWwgfHwgKGluZGV4ICsgMSkudG9TdHJpbmcoKTtcbiAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IGNsaWVudC5wbGF0Zm9ybS5pc01vYmlsZSA/ICdjbGljaycgOiAndG91Y2hzdGFydCc7XG5cbiAgICAgIHRoaXMuY29udGVudC5sYWJlbCA9IGRpc3BsYXlMYWJlbDtcbiAgICAgIHRoaXMudmlldy5pbnN0YWxsRXZlbnRzKHsgW2V2ZW50TmFtZV06ICgpID0+IHRoaXMucmVhZHkoKSB9KTtcbiAgICAgIHRoaXMudmlldy5yZW5kZXIoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZWFkeSgpO1xuICAgIH1cbiAgfVxuXG4gIF9vblVuYXZhaWxhYmxlUmVzcG9uc2UoKSB7XG4gICAgdGhpcy5jb250ZW50LmVycm9yID0gdHJ1ZTtcbiAgICB0aGlzLnZpZXcucmVuZGVyKCk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgQ2xpZW50Q2hlY2tpbik7XG5cbmV4cG9ydCBkZWZhdWx0IENsaWVudENoZWNraW47XG5cbiJdfQ==