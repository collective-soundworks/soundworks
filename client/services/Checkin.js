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
 * The service requests a position to the server and waits for the answer.
 *
 * The service finishes its initialization when it receives a positive answer from the server. Otherwise (*e.g.* no more positions available), the service stays in its state and never finishes its initialization.
 *
 * @example
 * const checkin = new Checkin({ capacity: 100 });
 */

var Checkin = function (_Service) {
  (0, _inherits3.default)(Checkin, _Service);

  function Checkin() {
    (0, _classCallCheck3.default)(this, Checkin);


    /**
     * @param {Object} defaults - Default options.
     * @param {Boolean} [defaults.showDialog=false] - Indicates whether the view displays text or not.
     * @param {View} [defaults.viewCtor=SegmentedView] - The constructor to use in order to create the view.
     */

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Checkin).call(this, SERVICE_ID, true));

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

  (0, _createClass3.default)(Checkin, [{
    key: 'init',
    value: function init() {

      /**
       * Index given by the server side service.
       * @type {Number}
       */
      this.index = -1;

      /**
       * Label of the index assigned by the serverside {@link src/server/Checkin.js~Checkin} service (if any).
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
      (0, _get3.default)((0, _getPrototypeOf2.default)(Checkin.prototype), 'start', this).call(this);

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
      (0, _get3.default)((0, _getPrototypeOf2.default)(Checkin.prototype), 'stop', this).call(this);
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

        this.viewContent.label = displayLabel;
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
      this.viewContent.error = true;
      this.view.render();
    }
  }]);
  return Checkin;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, Checkin);

exports.default = Checkin;
//# sourceMappingURL=data:application/json;base64,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LE1BQVYsR0FGdUI7OztTQXpGckI7OztBQStGTix5QkFBZSxRQUFmLENBQXdCLFVBQXhCLEVBQW9DLE9BQXBDOztrQkFFZSIsImZpbGUiOiJDaGVja2luLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsaWVudCBmcm9tICcuLi9jb3JlL2NsaWVudCc7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IFNlZ21lbnRlZFZpZXcgZnJvbSAnLi4vdmlld3MvU2VnbWVudGVkVmlldyc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOmNoZWNraW4nO1xuXG4vKipcbiAqIEFzc2lnbiBwbGFjZXMgYW1vbmcgYSBzZXQgb2YgcHJlZGVmaW5lZCBwb3NpdGlvbnMgKGkuZS4gbGFiZWxzIGFuZC9vciBjb29yZGluYXRlcykuXG4gKiBUaGUgc2VydmljZSByZXF1ZXN0cyBhIHBvc2l0aW9uIHRvIHRoZSBzZXJ2ZXIgYW5kIHdhaXRzIGZvciB0aGUgYW5zd2VyLlxuICpcbiAqIFRoZSBzZXJ2aWNlIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbiB3aGVuIGl0IHJlY2VpdmVzIGEgcG9zaXRpdmUgYW5zd2VyIGZyb20gdGhlIHNlcnZlci4gT3RoZXJ3aXNlICgqZS5nLiogbm8gbW9yZSBwb3NpdGlvbnMgYXZhaWxhYmxlKSwgdGhlIHNlcnZpY2Ugc3RheXMgaW4gaXRzIHN0YXRlIGFuZCBuZXZlciBmaW5pc2hlcyBpdHMgaW5pdGlhbGl6YXRpb24uXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IGNoZWNraW4gPSBuZXcgQ2hlY2tpbih7IGNhcGFjaXR5OiAxMDAgfSk7XG4gKi9cbmNsYXNzIENoZWNraW4gZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgdHJ1ZSk7XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGVmYXVsdHMgLSBEZWZhdWx0IG9wdGlvbnMuXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbZGVmYXVsdHMuc2hvd0RpYWxvZz1mYWxzZV0gLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgdmlldyBkaXNwbGF5cyB0ZXh0IG9yIG5vdC5cbiAgICAgKiBAcGFyYW0ge1ZpZXd9IFtkZWZhdWx0cy52aWV3Q3Rvcj1TZWdtZW50ZWRWaWV3XSAtIFRoZSBjb25zdHJ1Y3RvciB0byB1c2UgaW4gb3JkZXIgdG8gY3JlYXRlIHRoZSB2aWV3LlxuICAgICAqL1xuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgc2hvd0RpYWxvZzogZmFsc2UsXG4gICAgICB2aWV3Q3RvcjogU2VnbWVudGVkVmlldyxcbiAgICAgIHZpZXdQcmlvcml0eTogNixcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgdGhpcy5yZXF1aXJlKCd3ZWxjb21lJyk7XG4gICAgLy8gYmluZCBjYWxsYmFja3MgdG8gdGhlIGN1cnJlbnQgaW5zdGFuY2VcbiAgICB0aGlzLl9vblBvc2l0aW9uUmVzcG9uc2UgPSB0aGlzLl9vblBvc2l0aW9uUmVzcG9uc2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vblVuYXZhaWxhYmxlUmVzcG9uc2UgPSB0aGlzLl9vblVuYXZhaWxhYmxlUmVzcG9uc2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGluaXQoKSB7XG5cbiAgICAvKipcbiAgICAgKiBJbmRleCBnaXZlbiBieSB0aGUgc2VydmVyIHNpZGUgc2VydmljZS5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuaW5kZXggPSAtMTtcblxuICAgIC8qKlxuICAgICAqIExhYmVsIG9mIHRoZSBpbmRleCBhc3NpZ25lZCBieSB0aGUgc2VydmVyc2lkZSB7QGxpbmsgc3JjL3NlcnZlci9DaGVja2luLmpzfkNoZWNraW59IHNlcnZpY2UgKGlmIGFueSkuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLmxhYmVsID0gbnVsbDtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0RpYWxvZykge1xuICAgICAgdGhpcy52aWV3Q3RvciA9IHRoaXMub3B0aW9ucy52aWV3Q3RvcjtcbiAgICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlVmlldygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAoIXRoaXMuaGFzU3RhcnRlZClcbiAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgdGhpcy5zZXR1cCA9IHRoaXMuX3NoYXJlZENvbmZpZ1NlcnZpY2VcbiAgICAvLyBzZW5kIHJlcXVlc3QgdG8gdGhlIHNlcnZlclxuICAgIHRoaXMuc2VuZCgncmVxdWVzdCcpO1xuICAgIC8vIHNldHVwIGxpc3RlbmVycyBmb3IgdGhlIHNlcnZlcidzIHJlc3BvbnNlXG4gICAgdGhpcy5yZWNlaXZlKCdwb3NpdGlvbicsIHRoaXMuX29uUG9zaXRpb25SZXNwb25zZSk7XG4gICAgdGhpcy5yZWNlaXZlKCd1bmF2YWlsYWJsZScsIHRoaXMuX29uVW5hdmFpbGFibGVSZXNwb25zZSk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnNob3dEaWFsb2cpXG4gICAgICB0aGlzLnNob3coKTtcbiAgfVxuXG4gIC8qKiBwcml2YXRlICovXG4gIHN0b3AoKSB7XG4gICAgc3VwZXIuc3RvcCgpO1xuICAgIC8vIFJlbW92ZSBsaXN0ZW5lcnMgZm9yIHRoZSBzZXJ2ZXIncyByZXNwb25zZVxuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ3Bvc2l0aW9uJywgdGhpcy5fb25Qb3NpdGlvblJlc3BvbnNlKTtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCd1bmF2YWlsYWJsZScsIHRoaXMuX29uVW5hdmFpbGFibGVSZXNwb25zZSk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnNob3dEaWFsb2cpXG4gICAgICB0aGlzLmhpZGUoKTtcbiAgfVxuXG4gIF9vblBvc2l0aW9uUmVzcG9uc2UoaW5kZXgsIGxhYmVsLCBjb29yZGluYXRlcykge1xuICAgIGNsaWVudC5pbmRleCA9IHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICBjbGllbnQubGFiZWwgPSB0aGlzLmxhYmVsID0gbGFiZWw7XG4gICAgY2xpZW50LmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnNob3dEaWFsb2cpIHtcbiAgICAgIGNvbnN0IGRpc3BsYXlMYWJlbCA9IGxhYmVsIHx8IChpbmRleCArIDEpLnRvU3RyaW5nKCk7XG4gICAgICBjb25zdCBldmVudE5hbWUgPSBjbGllbnQucGxhdGZvcm0uaXNNb2JpbGUgPyAnY2xpY2snIDogJ3RvdWNoc3RhcnQnO1xuXG4gICAgICB0aGlzLnZpZXdDb250ZW50LmxhYmVsID0gZGlzcGxheUxhYmVsO1xuICAgICAgdGhpcy52aWV3Lmluc3RhbGxFdmVudHMoeyBbZXZlbnROYW1lXTogKCkgPT4gdGhpcy5yZWFkeSgpIH0pO1xuICAgICAgdGhpcy52aWV3LnJlbmRlcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlYWR5KCk7XG4gICAgfVxuICB9XG5cbiAgX29uVW5hdmFpbGFibGVSZXNwb25zZSgpIHtcbiAgICB0aGlzLnZpZXdDb250ZW50LmVycm9yID0gdHJ1ZTtcbiAgICB0aGlzLnZpZXcucmVuZGVyKCk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgQ2hlY2tpbik7XG5cbmV4cG9ydCBkZWZhdWx0IENoZWNraW47XG4iXX0=