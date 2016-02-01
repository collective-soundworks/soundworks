'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _defineProperty = require('babel-runtime/helpers/define-property')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreClient = require('../core/client');

var _coreClient2 = _interopRequireDefault(_coreClient);

var _coreService = require('../core/Service');

var _coreService2 = _interopRequireDefault(_coreService);

var _displaySegmentedView = require('../display/SegmentedView');

var _displaySegmentedView2 = _interopRequireDefault(_displaySegmentedView);

var _coreServiceManager = require('../core/serviceManager');

var _coreServiceManager2 = _interopRequireDefault(_coreServiceManager);

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

var ClientCheckin = (function (_Service) {
  _inherits(ClientCheckin, _Service);

  function ClientCheckin() {
    _classCallCheck(this, ClientCheckin);

    _get(Object.getPrototypeOf(ClientCheckin.prototype), 'constructor', this).call(this, SERVICE_ID, true);

    /**
     * @param {Object} defaults - Default options.
     * @param {Boolean} [defaults.showDialog=false] - Indicates whether the view displays text or not.
     * @param {View} [defaults.viewCtor=SegmentedView] - The constructor to use in order to create the view.
     */
    var defaults = {
      showDialog: false,
      viewCtor: _displaySegmentedView2['default']
    };

    this.configure(defaults);

    // bind callbacks to the current instance
    this._onPositionResponse = this._onPositionResponse.bind(this);
    this._onUnavailableResponse = this._onUnavailableResponse.bind(this);
  }

  _createClass(ClientCheckin, [{
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
      _get(Object.getPrototypeOf(ClientCheckin.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();
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
      _get(Object.getPrototypeOf(ClientCheckin.prototype), 'stop', this).call(this);
      // Remove listeners for the server's response
      this.removeListener('position', this._onPositionResponse);
      this.removeListener('unavailable', this._onUnavailableResponse);

      if (this.options.showDialog) this.hide();
    }
  }, {
    key: '_onPositionResponse',
    value: function _onPositionResponse(index, label, coordinates) {
      var _this = this;

      this.index = index;
      this.label = label;
      _coreClient2['default'].coordinates = coordinates;

      if (this.options.showDialog) {
        var displayLabel = label || (index + 1).toString();
        var eventName = _coreClient2['default'].platform.isMobile ? 'click' : 'touchstart';

        this.content.label = displayLabel;
        this.view.installEvents(_defineProperty({}, eventName, function () {
          return _this.ready();
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
})(_coreService2['default']);

_coreServiceManager2['default'].register(SERVICE_ID, ClientCheckin);

exports['default'] = ClientCheckin;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvc2VydmljZXMvQ2xpZW50Q2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7MEJBQW1CLGdCQUFnQjs7OzsyQkFDZixpQkFBaUI7Ozs7b0NBQ1gsMEJBQTBCOzs7O2tDQUN6Qix3QkFBd0I7Ozs7QUFFbkQsSUFBTSxVQUFVLEdBQUcsaUJBQWlCLENBQUM7Ozs7Ozs7Ozs7Ozs7O0lBYS9CLGFBQWE7WUFBYixhQUFhOztBQUNOLFdBRFAsYUFBYSxHQUNIOzBCQURWLGFBQWE7O0FBRWYsK0JBRkUsYUFBYSw2Q0FFVCxVQUFVLEVBQUUsSUFBSSxFQUFFOzs7Ozs7O0FBT3hCLFFBQU0sUUFBUSxHQUFHO0FBQ2YsZ0JBQVUsRUFBRSxLQUFLO0FBQ2pCLGNBQVEsbUNBQWU7S0FDeEIsQ0FBQzs7QUFFRixRQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDOzs7QUFHekIsUUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDL0QsUUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDdEU7O2VBbkJHLGFBQWE7O1dBcUJiLGdCQUFHOzs7Ozs7QUFNTCxVQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDOzs7Ozs7QUFNaEIsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRWxCLFVBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUU7QUFDM0IsWUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztBQUN0QyxZQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztPQUMvQjtLQUNGOzs7OztXQUdJLGlCQUFHO0FBQ04saUNBM0NFLGFBQWEsdUNBMkNEOztBQUVkLFVBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUNsQixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRWQsVUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFckIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDbkQsVUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7O0FBRXpELFVBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQ3pCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNmOzs7OztXQUdHLGdCQUFHO0FBQ0wsaUNBM0RFLGFBQWEsc0NBMkRGOztBQUViLFVBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQzFELFVBQUksQ0FBQyxjQUFjLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDOztBQUVoRSxVQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUN6QixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDZjs7O1dBRWtCLDZCQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFOzs7QUFDN0MsVUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDbkIsVUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDbkIsOEJBQU8sV0FBVyxHQUFHLFdBQVcsQ0FBQzs7QUFFakMsVUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRTtBQUMzQixZQUFNLFlBQVksR0FBRyxLQUFLLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFBLENBQUUsUUFBUSxFQUFFLENBQUM7QUFDckQsWUFBTSxTQUFTLEdBQUcsd0JBQU8sUUFBUSxDQUFDLFFBQVEsR0FBRyxPQUFPLEdBQUcsWUFBWSxDQUFDOztBQUVwRSxZQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxZQUFZLENBQUM7QUFDbEMsWUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLHFCQUFJLFNBQVMsRUFBRztpQkFBTSxNQUFLLEtBQUssRUFBRTtTQUFBLEVBQUcsQ0FBQztBQUM3RCxZQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO09BQ3BCLE1BQU07QUFDTCxZQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7T0FDZDtLQUNGOzs7V0FFcUIsa0NBQUc7QUFDdkIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQzFCLFVBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDcEI7OztTQXhGRyxhQUFhOzs7QUEyRm5CLGdDQUFlLFFBQVEsQ0FBQyxVQUFVLEVBQUUsYUFBYSxDQUFDLENBQUM7O3FCQUVwQyxhQUFhIiwiZmlsZSI6InNyYy9jbGllbnQvc2VydmljZXMvQ2xpZW50Q2hlY2tpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbGllbnQgZnJvbSAnLi4vY29yZS9jbGllbnQnO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBTZWdtZW50ZWRWaWV3IGZyb20gJy4uL2Rpc3BsYXkvU2VnbWVudGVkVmlldyc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpjaGVja2luJztcblxuLyoqXG4gKiBBc3NpZ24gcGxhY2VzIGFtb25nIGEgc2V0IG9mIHByZWRlZmluZWQgcG9zaXRpb25zIChpLmUuIGxhYmVscyBhbmQvb3IgY29vcmRpbmF0ZXMpLlxuICogVGhlIG1vZHVsZSByZXF1ZXN0cyBhIHBvc2l0aW9uIHRvIHRoZSBzZXJ2ZXIgYW5kIHdhaXRzIGZvciB0aGUgYW5zd2VyLlxuICpcbiAqIFRoZSBtb2R1bGUgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uIHdoZW4gaXQgcmVjZWl2ZXMgYSBwb3NpdGl2ZSBhbnN3ZXIgZnJvbSB0aGUgc2VydmVyLiBPdGhlcndpc2UgKCplLmcuKiBubyBtb3JlIHBvc2l0aW9ucyBhdmFpbGFibGUpLCB0aGUgbW9kdWxlIHN0YXlzIGluIGl0cyBzdGF0ZSBhbmQgbmV2ZXIgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL3NlcnZlci9TZXJ2ZXJDaGVja2luLmpzflNlcnZlckNoZWNraW59IG9uIHRoZSBzZXJ2ZXIgc2lkZS4pXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IGNoZWNraW4gPSBuZXcgQ2xpZW50Q2hlY2tpbih7IGNhcGFjaXR5OiAxMDAgfSk7XG4gKi9cbmNsYXNzIENsaWVudENoZWNraW4gZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgdHJ1ZSk7XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGVmYXVsdHMgLSBEZWZhdWx0IG9wdGlvbnMuXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbZGVmYXVsdHMuc2hvd0RpYWxvZz1mYWxzZV0gLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgdmlldyBkaXNwbGF5cyB0ZXh0IG9yIG5vdC5cbiAgICAgKiBAcGFyYW0ge1ZpZXd9IFtkZWZhdWx0cy52aWV3Q3Rvcj1TZWdtZW50ZWRWaWV3XSAtIFRoZSBjb25zdHJ1Y3RvciB0byB1c2UgaW4gb3JkZXIgdG8gY3JlYXRlIHRoZSB2aWV3LlxuICAgICAqL1xuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgc2hvd0RpYWxvZzogZmFsc2UsXG4gICAgICB2aWV3Q3RvcjogU2VnbWVudGVkVmlldyxcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgLy8gYmluZCBjYWxsYmFja3MgdG8gdGhlIGN1cnJlbnQgaW5zdGFuY2VcbiAgICB0aGlzLl9vblBvc2l0aW9uUmVzcG9uc2UgPSB0aGlzLl9vblBvc2l0aW9uUmVzcG9uc2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vblVuYXZhaWxhYmxlUmVzcG9uc2UgPSB0aGlzLl9vblVuYXZhaWxhYmxlUmVzcG9uc2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGluaXQoKSB7XG5cbiAgICAvKipcbiAgICAgKiBJbmRleCBnaXZlbiBieSB0aGUgc2VydmVyc2lkZSB7QGxpbmsgc3JjL3NlcnZlci9TZXJ2ZXJDaGVja2luLmpzflNlcnZlckNoZWNraW59IG1vZHVsZS5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuaW5kZXggPSAtMTtcblxuICAgIC8qKlxuICAgICAqIExhYmVsIG9mIHRoZSBpbmRleCBhc3NpZ25lZCBieSB0aGUgc2VydmVyc2lkZSB7QGxpbmsgc3JjL3NlcnZlci9DaGVja2luLmpzfkNoZWNraW59IG1vZHVsZSAoaWYgYW55KS5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMubGFiZWwgPSBudWxsO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5zaG93RGlhbG9nKSB7XG4gICAgICB0aGlzLnZpZXdDdG9yID0gdGhpcy5vcHRpb25zLnZpZXdDdG9yO1xuICAgICAgdGhpcy52aWV3ID0gdGhpcy5jcmVhdGVWaWV3KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICghdGhpcy5oYXNTdGFydGVkKVxuICAgICAgdGhpcy5pbml0KCk7XG4gICAgLy8gc2VuZCByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXJcbiAgICB0aGlzLnNlbmQoJ3JlcXVlc3QnKTtcbiAgICAvLyBzZXR1cCBsaXN0ZW5lcnMgZm9yIHRoZSBzZXJ2ZXIncyByZXNwb25zZVxuICAgIHRoaXMucmVjZWl2ZSgncG9zaXRpb24nLCB0aGlzLl9vblBvc2l0aW9uUmVzcG9uc2UpO1xuICAgIHRoaXMucmVjZWl2ZSgndW5hdmFpbGFibGUnLCB0aGlzLl9vblVuYXZhaWxhYmxlUmVzcG9uc2UpO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5zaG93RGlhbG9nKVxuICAgICAgdGhpcy5zaG93KCk7XG4gIH1cblxuICAvKiogcHJpdmF0ZSAqL1xuICBzdG9wKCkge1xuICAgIHN1cGVyLnN0b3AoKTtcbiAgICAvLyBSZW1vdmUgbGlzdGVuZXJzIGZvciB0aGUgc2VydmVyJ3MgcmVzcG9uc2VcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdwb3NpdGlvbicsIHRoaXMuX29uUG9zaXRpb25SZXNwb25zZSk7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcigndW5hdmFpbGFibGUnLCB0aGlzLl9vblVuYXZhaWxhYmxlUmVzcG9uc2UpO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5zaG93RGlhbG9nKVxuICAgICAgdGhpcy5oaWRlKCk7XG4gIH1cblxuICBfb25Qb3NpdGlvblJlc3BvbnNlKGluZGV4LCBsYWJlbCwgY29vcmRpbmF0ZXMpIHtcbiAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgdGhpcy5sYWJlbCA9IGxhYmVsO1xuICAgIGNsaWVudC5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5zaG93RGlhbG9nKSB7XG4gICAgICBjb25zdCBkaXNwbGF5TGFiZWwgPSBsYWJlbCB8fCAoaW5kZXggKyAxKS50b1N0cmluZygpO1xuICAgICAgY29uc3QgZXZlbnROYW1lID0gY2xpZW50LnBsYXRmb3JtLmlzTW9iaWxlID8gJ2NsaWNrJyA6ICd0b3VjaHN0YXJ0JztcblxuICAgICAgdGhpcy5jb250ZW50LmxhYmVsID0gZGlzcGxheUxhYmVsO1xuICAgICAgdGhpcy52aWV3Lmluc3RhbGxFdmVudHMoeyBbZXZlbnROYW1lXTogKCkgPT4gdGhpcy5yZWFkeSgpIH0pO1xuICAgICAgdGhpcy52aWV3LnJlbmRlcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlYWR5KCk7XG4gICAgfVxuICB9XG5cbiAgX29uVW5hdmFpbGFibGVSZXNwb25zZSgpIHtcbiAgICB0aGlzLmNvbnRlbnQuZXJyb3IgPSB0cnVlO1xuICAgIHRoaXMudmlldy5yZW5kZXIoKTtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBDbGllbnRDaGVja2luKTtcblxuZXhwb3J0IGRlZmF1bHQgQ2xpZW50Q2hlY2tpbjtcblxuIl19