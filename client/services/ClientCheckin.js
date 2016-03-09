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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNsaWVudENoZWNraW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNLGFBQWEsaUJBQWI7Ozs7Ozs7Ozs7Ozs7O0lBYUE7OztBQUNKLFdBREksYUFDSixHQUFjO3dDQURWLGVBQ1U7Ozs7Ozs7Ozs2RkFEViwwQkFFSSxZQUFZLE9BRE47O0FBUVosUUFBTSxXQUFXO0FBQ2Ysa0JBQVksS0FBWjtBQUNBLHVDQUZlO0FBR2Ysb0JBQWMsQ0FBZDtLQUhJLENBUk07O0FBY1osVUFBSyxTQUFMLENBQWUsUUFBZixFQWRZOztBQWdCWixVQUFLLE9BQUwsQ0FBYSxTQUFiOztBQWhCWSxTQWtCWixDQUFLLG1CQUFMLEdBQTJCLE1BQUssbUJBQUwsQ0FBeUIsSUFBekIsT0FBM0IsQ0FsQlk7QUFtQlosVUFBSyxzQkFBTCxHQUE4QixNQUFLLHNCQUFMLENBQTRCLElBQTVCLE9BQTlCLENBbkJZOztHQUFkOzs2QkFESTs7MkJBdUJHOzs7Ozs7QUFNTCxXQUFLLEtBQUwsR0FBYSxDQUFDLENBQUQ7Ozs7OztBQU5SLFVBWUwsQ0FBSyxLQUFMLEdBQWEsSUFBYixDQVpLOztBQWNMLFVBQUksS0FBSyxPQUFMLENBQWEsVUFBYixFQUF5QjtBQUMzQixhQUFLLFFBQUwsR0FBZ0IsS0FBSyxPQUFMLENBQWEsUUFBYixDQURXO0FBRTNCLGFBQUssSUFBTCxHQUFZLEtBQUssVUFBTCxFQUFaLENBRjJCO09BQTdCOzs7Ozs7OzRCQU9NO0FBQ04sdURBN0NFLG1EQTZDRixDQURNOztBQUdOLFVBQUksQ0FBQyxLQUFLLFVBQUwsRUFDSCxLQUFLLElBQUwsR0FERjs7QUFHQSxXQUFLLEtBQUwsR0FBYSxLQUFLLG9CQUFMOztBQU5QLFVBUU4sQ0FBSyxJQUFMLENBQVUsU0FBVjs7QUFSTSxVQVVOLENBQUssT0FBTCxDQUFhLFVBQWIsRUFBeUIsS0FBSyxtQkFBTCxDQUF6QixDQVZNO0FBV04sV0FBSyxPQUFMLENBQWEsYUFBYixFQUE0QixLQUFLLHNCQUFMLENBQTVCLENBWE07O0FBYU4sVUFBSSxLQUFLLE9BQUwsQ0FBYSxVQUFiLEVBQ0YsS0FBSyxJQUFMLEdBREY7Ozs7Ozs7MkJBS0s7QUFDTCx1REEvREUsa0RBK0RGOztBQURLLFVBR0wsQ0FBSyxjQUFMLENBQW9CLFVBQXBCLEVBQWdDLEtBQUssbUJBQUwsQ0FBaEMsQ0FISztBQUlMLFdBQUssY0FBTCxDQUFvQixhQUFwQixFQUFtQyxLQUFLLHNCQUFMLENBQW5DLENBSks7O0FBTUwsVUFBSSxLQUFLLE9BQUwsQ0FBYSxVQUFiLEVBQ0YsS0FBSyxJQUFMLEdBREY7Ozs7d0NBSWtCLE9BQU8sT0FBTyxhQUFhOzs7QUFDN0MsdUJBQU8sS0FBUCxHQUFlLEtBQUssS0FBTCxHQUFhLEtBQWIsQ0FEOEI7QUFFN0MsdUJBQU8sS0FBUCxHQUFlLEtBQUssS0FBTCxHQUFhLEtBQWIsQ0FGOEI7QUFHN0MsdUJBQU8sV0FBUCxHQUFxQixXQUFyQixDQUg2Qzs7QUFLN0MsVUFBSSxLQUFLLE9BQUwsQ0FBYSxVQUFiLEVBQXlCO0FBQzNCLFlBQU0sZUFBZSxTQUFTLENBQUMsUUFBUSxDQUFSLENBQUQsQ0FBWSxRQUFaLEVBQVQsQ0FETTtBQUUzQixZQUFNLFlBQVksaUJBQU8sUUFBUCxDQUFnQixRQUFoQixHQUEyQixPQUEzQixHQUFxQyxZQUFyQyxDQUZTOztBQUkzQixhQUFLLE9BQUwsQ0FBYSxLQUFiLEdBQXFCLFlBQXJCLENBSjJCO0FBSzNCLGFBQUssSUFBTCxDQUFVLGFBQVYsbUNBQTJCLFdBQVk7aUJBQU0sT0FBSyxLQUFMO1NBQU4sQ0FBdkMsRUFMMkI7QUFNM0IsYUFBSyxJQUFMLENBQVUsTUFBVixHQU4yQjtPQUE3QixNQU9PO0FBQ0wsYUFBSyxLQUFMLEdBREs7T0FQUDs7Ozs2Q0FZdUI7QUFDdkIsV0FBSyxPQUFMLENBQWEsS0FBYixHQUFxQixJQUFyQixDQUR1QjtBQUV2QixXQUFLLElBQUwsQ0FBVSxNQUFWLEdBRnVCOzs7U0F6RnJCOzs7QUErRk4seUJBQWUsUUFBZixDQUF3QixVQUF4QixFQUFvQyxhQUFwQzs7a0JBRWUiLCJmaWxlIjoiQ2xpZW50Q2hlY2tpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbGllbnQgZnJvbSAnLi4vY29yZS9jbGllbnQnO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBTZWdtZW50ZWRWaWV3IGZyb20gJy4uL3ZpZXdzL1NlZ21lbnRlZFZpZXcnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6Y2hlY2tpbic7XG5cbi8qKlxuICogQXNzaWduIHBsYWNlcyBhbW9uZyBhIHNldCBvZiBwcmVkZWZpbmVkIHBvc2l0aW9ucyAoaS5lLiBsYWJlbHMgYW5kL29yIGNvb3JkaW5hdGVzKS5cbiAqIFRoZSBtb2R1bGUgcmVxdWVzdHMgYSBwb3NpdGlvbiB0byB0aGUgc2VydmVyIGFuZCB3YWl0cyBmb3IgdGhlIGFuc3dlci5cbiAqXG4gKiBUaGUgbW9kdWxlIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbiB3aGVuIGl0IHJlY2VpdmVzIGEgcG9zaXRpdmUgYW5zd2VyIGZyb20gdGhlIHNlcnZlci4gT3RoZXJ3aXNlICgqZS5nLiogbm8gbW9yZSBwb3NpdGlvbnMgYXZhaWxhYmxlKSwgdGhlIG1vZHVsZSBzdGF5cyBpbiBpdHMgc3RhdGUgYW5kIG5ldmVyIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbi5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9zZXJ2ZXIvU2VydmVyQ2hlY2tpbi5qc35TZXJ2ZXJDaGVja2lufSBvbiB0aGUgc2VydmVyIHNpZGUuKVxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCBjaGVja2luID0gbmV3IENsaWVudENoZWNraW4oeyBjYXBhY2l0eTogMTAwIH0pO1xuICovXG5jbGFzcyBDbGllbnRDaGVja2luIGV4dGVuZHMgU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIHRydWUpO1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRlZmF1bHRzIC0gRGVmYXVsdCBvcHRpb25zLlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2RlZmF1bHRzLnNob3dEaWFsb2c9ZmFsc2VdIC0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHZpZXcgZGlzcGxheXMgdGV4dCBvciBub3QuXG4gICAgICogQHBhcmFtIHtWaWV3fSBbZGVmYXVsdHMudmlld0N0b3I9U2VnbWVudGVkVmlld10gLSBUaGUgY29uc3RydWN0b3IgdG8gdXNlIGluIG9yZGVyIHRvIGNyZWF0ZSB0aGUgdmlldy5cbiAgICAgKi9cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIHNob3dEaWFsb2c6IGZhbHNlLFxuICAgICAgdmlld0N0b3I6IFNlZ21lbnRlZFZpZXcsXG4gICAgICB2aWV3UHJpb3JpdHk6IDYsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIHRoaXMucmVxdWlyZSgnd2VsY29tZScpO1xuICAgIC8vIGJpbmQgY2FsbGJhY2tzIHRvIHRoZSBjdXJyZW50IGluc3RhbmNlXG4gICAgdGhpcy5fb25Qb3NpdGlvblJlc3BvbnNlID0gdGhpcy5fb25Qb3NpdGlvblJlc3BvbnNlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25VbmF2YWlsYWJsZVJlc3BvbnNlID0gdGhpcy5fb25VbmF2YWlsYWJsZVJlc3BvbnNlLmJpbmQodGhpcyk7XG4gIH1cblxuICBpbml0KCkge1xuXG4gICAgLyoqXG4gICAgICogSW5kZXggZ2l2ZW4gYnkgdGhlIHNlcnZlcnNpZGUge0BsaW5rIHNyYy9zZXJ2ZXIvU2VydmVyQ2hlY2tpbi5qc35TZXJ2ZXJDaGVja2lufSBtb2R1bGUuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmluZGV4ID0gLTE7XG5cbiAgICAvKipcbiAgICAgKiBMYWJlbCBvZiB0aGUgaW5kZXggYXNzaWduZWQgYnkgdGhlIHNlcnZlcnNpZGUge0BsaW5rIHNyYy9zZXJ2ZXIvQ2hlY2tpbi5qc35DaGVja2lufSBtb2R1bGUgKGlmIGFueSkuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLmxhYmVsID0gbnVsbDtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0RpYWxvZykge1xuICAgICAgdGhpcy52aWV3Q3RvciA9IHRoaXMub3B0aW9ucy52aWV3Q3RvcjtcbiAgICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlVmlldygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAoIXRoaXMuaGFzU3RhcnRlZClcbiAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgdGhpcy5zZXR1cCA9IHRoaXMuX3NoYXJlZENvbmZpZ1NlcnZpY2VcbiAgICAvLyBzZW5kIHJlcXVlc3QgdG8gdGhlIHNlcnZlclxuICAgIHRoaXMuc2VuZCgncmVxdWVzdCcpO1xuICAgIC8vIHNldHVwIGxpc3RlbmVycyBmb3IgdGhlIHNlcnZlcidzIHJlc3BvbnNlXG4gICAgdGhpcy5yZWNlaXZlKCdwb3NpdGlvbicsIHRoaXMuX29uUG9zaXRpb25SZXNwb25zZSk7XG4gICAgdGhpcy5yZWNlaXZlKCd1bmF2YWlsYWJsZScsIHRoaXMuX29uVW5hdmFpbGFibGVSZXNwb25zZSk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnNob3dEaWFsb2cpXG4gICAgICB0aGlzLnNob3coKTtcbiAgfVxuXG4gIC8qKiBwcml2YXRlICovXG4gIHN0b3AoKSB7XG4gICAgc3VwZXIuc3RvcCgpO1xuICAgIC8vIFJlbW92ZSBsaXN0ZW5lcnMgZm9yIHRoZSBzZXJ2ZXIncyByZXNwb25zZVxuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ3Bvc2l0aW9uJywgdGhpcy5fb25Qb3NpdGlvblJlc3BvbnNlKTtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCd1bmF2YWlsYWJsZScsIHRoaXMuX29uVW5hdmFpbGFibGVSZXNwb25zZSk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnNob3dEaWFsb2cpXG4gICAgICB0aGlzLmhpZGUoKTtcbiAgfVxuXG4gIF9vblBvc2l0aW9uUmVzcG9uc2UoaW5kZXgsIGxhYmVsLCBjb29yZGluYXRlcykge1xuICAgIGNsaWVudC5pbmRleCA9IHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICBjbGllbnQubGFiZWwgPSB0aGlzLmxhYmVsID0gbGFiZWw7XG4gICAgY2xpZW50LmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnNob3dEaWFsb2cpIHtcbiAgICAgIGNvbnN0IGRpc3BsYXlMYWJlbCA9IGxhYmVsIHx8IChpbmRleCArIDEpLnRvU3RyaW5nKCk7XG4gICAgICBjb25zdCBldmVudE5hbWUgPSBjbGllbnQucGxhdGZvcm0uaXNNb2JpbGUgPyAnY2xpY2snIDogJ3RvdWNoc3RhcnQnO1xuXG4gICAgICB0aGlzLmNvbnRlbnQubGFiZWwgPSBkaXNwbGF5TGFiZWw7XG4gICAgICB0aGlzLnZpZXcuaW5zdGFsbEV2ZW50cyh7IFtldmVudE5hbWVdOiAoKSA9PiB0aGlzLnJlYWR5KCkgfSk7XG4gICAgICB0aGlzLnZpZXcucmVuZGVyKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVhZHkoKTtcbiAgICB9XG4gIH1cblxuICBfb25VbmF2YWlsYWJsZVJlc3BvbnNlKCkge1xuICAgIHRoaXMuY29udGVudC5lcnJvciA9IHRydWU7XG4gICAgdGhpcy52aWV3LnJlbmRlcigpO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIENsaWVudENoZWNraW4pO1xuXG5leHBvcnQgZGVmYXVsdCBDbGllbnRDaGVja2luO1xuXG4iXX0=