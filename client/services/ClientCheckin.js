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
      viewCtor: _displaySegmentedView2['default'],
      viewPriority: 6
    };

    this.configure(defaults);

    this.require('welcome');
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

      _coreClient2['default'].index = this.index = index;
      _coreClient2['default'].label = this.label = label;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9jbGllbnQvc2VydmljZXMvQ2xpZW50Q2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7MEJBQW1CLGdCQUFnQjs7OzsyQkFDZixpQkFBaUI7Ozs7b0NBQ1gsMEJBQTBCOzs7O2tDQUN6Qix3QkFBd0I7Ozs7QUFFbkQsSUFBTSxVQUFVLEdBQUcsaUJBQWlCLENBQUM7Ozs7Ozs7Ozs7Ozs7O0lBYS9CLGFBQWE7WUFBYixhQUFhOztBQUNOLFdBRFAsYUFBYSxHQUNIOzBCQURWLGFBQWE7O0FBRWYsK0JBRkUsYUFBYSw2Q0FFVCxVQUFVLEVBQUUsSUFBSSxFQUFFOzs7Ozs7O0FBT3hCLFFBQU0sUUFBUSxHQUFHO0FBQ2YsZ0JBQVUsRUFBRSxLQUFLO0FBQ2pCLGNBQVEsbUNBQWU7QUFDdkIsa0JBQVksRUFBRSxDQUFDO0tBQ2hCLENBQUM7O0FBRUYsUUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFekIsUUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFeEIsUUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDL0QsUUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDdEU7O2VBckJHLGFBQWE7O1dBdUJiLGdCQUFHOzs7Ozs7QUFNTCxVQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDOzs7Ozs7QUFNaEIsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRWxCLFVBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUU7QUFDM0IsWUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztBQUN0QyxZQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztPQUMvQjtLQUNGOzs7OztXQUdJLGlCQUFHO0FBQ04saUNBN0NFLGFBQWEsdUNBNkNEOztBQUVkLFVBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUNsQixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRWQsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUE7O0FBRXRDLFVBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7O0FBRXJCLFVBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ25ELFVBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDOztBQUV6RCxVQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUN6QixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDZjs7Ozs7V0FHRyxnQkFBRztBQUNMLGlDQS9ERSxhQUFhLHNDQStERjs7QUFFYixVQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUMxRCxVQUFJLENBQUMsY0FBYyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQzs7QUFFaEUsVUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFDekIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2Y7OztXQUVrQiw2QkFBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRTs7O0FBQzdDLDhCQUFPLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNsQyw4QkFBTyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDbEMsOEJBQU8sV0FBVyxHQUFHLFdBQVcsQ0FBQzs7QUFFakMsVUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRTtBQUMzQixZQUFNLFlBQVksR0FBRyxLQUFLLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFBLENBQUUsUUFBUSxFQUFFLENBQUM7QUFDckQsWUFBTSxTQUFTLEdBQUcsd0JBQU8sUUFBUSxDQUFDLFFBQVEsR0FBRyxPQUFPLEdBQUcsWUFBWSxDQUFDOztBQUVwRSxZQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxZQUFZLENBQUM7QUFDbEMsWUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLHFCQUFJLFNBQVMsRUFBRztpQkFBTSxNQUFLLEtBQUssRUFBRTtTQUFBLEVBQUcsQ0FBQztBQUM3RCxZQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO09BQ3BCLE1BQU07QUFDTCxZQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7T0FDZDtLQUNGOzs7V0FFcUIsa0NBQUc7QUFDdkIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQzFCLFVBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDcEI7OztTQTVGRyxhQUFhOzs7QUErRm5CLGdDQUFlLFFBQVEsQ0FBQyxVQUFVLEVBQUUsYUFBYSxDQUFDLENBQUM7O3FCQUVwQyxhQUFhIiwiZmlsZSI6Ii9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9jbGllbnQvc2VydmljZXMvQ2xpZW50Q2hlY2tpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbGllbnQgZnJvbSAnLi4vY29yZS9jbGllbnQnO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBTZWdtZW50ZWRWaWV3IGZyb20gJy4uL2Rpc3BsYXkvU2VnbWVudGVkVmlldyc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpjaGVja2luJztcblxuLyoqXG4gKiBBc3NpZ24gcGxhY2VzIGFtb25nIGEgc2V0IG9mIHByZWRlZmluZWQgcG9zaXRpb25zIChpLmUuIGxhYmVscyBhbmQvb3IgY29vcmRpbmF0ZXMpLlxuICogVGhlIG1vZHVsZSByZXF1ZXN0cyBhIHBvc2l0aW9uIHRvIHRoZSBzZXJ2ZXIgYW5kIHdhaXRzIGZvciB0aGUgYW5zd2VyLlxuICpcbiAqIFRoZSBtb2R1bGUgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uIHdoZW4gaXQgcmVjZWl2ZXMgYSBwb3NpdGl2ZSBhbnN3ZXIgZnJvbSB0aGUgc2VydmVyLiBPdGhlcndpc2UgKCplLmcuKiBubyBtb3JlIHBvc2l0aW9ucyBhdmFpbGFibGUpLCB0aGUgbW9kdWxlIHN0YXlzIGluIGl0cyBzdGF0ZSBhbmQgbmV2ZXIgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL3NlcnZlci9TZXJ2ZXJDaGVja2luLmpzflNlcnZlckNoZWNraW59IG9uIHRoZSBzZXJ2ZXIgc2lkZS4pXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IGNoZWNraW4gPSBuZXcgQ2xpZW50Q2hlY2tpbih7IGNhcGFjaXR5OiAxMDAgfSk7XG4gKi9cbmNsYXNzIENsaWVudENoZWNraW4gZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgdHJ1ZSk7XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGVmYXVsdHMgLSBEZWZhdWx0IG9wdGlvbnMuXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbZGVmYXVsdHMuc2hvd0RpYWxvZz1mYWxzZV0gLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgdmlldyBkaXNwbGF5cyB0ZXh0IG9yIG5vdC5cbiAgICAgKiBAcGFyYW0ge1ZpZXd9IFtkZWZhdWx0cy52aWV3Q3Rvcj1TZWdtZW50ZWRWaWV3XSAtIFRoZSBjb25zdHJ1Y3RvciB0byB1c2UgaW4gb3JkZXIgdG8gY3JlYXRlIHRoZSB2aWV3LlxuICAgICAqL1xuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgc2hvd0RpYWxvZzogZmFsc2UsXG4gICAgICB2aWV3Q3RvcjogU2VnbWVudGVkVmlldyxcbiAgICAgIHZpZXdQcmlvcml0eTogNixcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgdGhpcy5yZXF1aXJlKCd3ZWxjb21lJyk7XG4gICAgLy8gYmluZCBjYWxsYmFja3MgdG8gdGhlIGN1cnJlbnQgaW5zdGFuY2VcbiAgICB0aGlzLl9vblBvc2l0aW9uUmVzcG9uc2UgPSB0aGlzLl9vblBvc2l0aW9uUmVzcG9uc2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vblVuYXZhaWxhYmxlUmVzcG9uc2UgPSB0aGlzLl9vblVuYXZhaWxhYmxlUmVzcG9uc2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGluaXQoKSB7XG5cbiAgICAvKipcbiAgICAgKiBJbmRleCBnaXZlbiBieSB0aGUgc2VydmVyc2lkZSB7QGxpbmsgc3JjL3NlcnZlci9TZXJ2ZXJDaGVja2luLmpzflNlcnZlckNoZWNraW59IG1vZHVsZS5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuaW5kZXggPSAtMTtcblxuICAgIC8qKlxuICAgICAqIExhYmVsIG9mIHRoZSBpbmRleCBhc3NpZ25lZCBieSB0aGUgc2VydmVyc2lkZSB7QGxpbmsgc3JjL3NlcnZlci9DaGVja2luLmpzfkNoZWNraW59IG1vZHVsZSAoaWYgYW55KS5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMubGFiZWwgPSBudWxsO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5zaG93RGlhbG9nKSB7XG4gICAgICB0aGlzLnZpZXdDdG9yID0gdGhpcy5vcHRpb25zLnZpZXdDdG9yO1xuICAgICAgdGhpcy52aWV3ID0gdGhpcy5jcmVhdGVWaWV3KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICghdGhpcy5oYXNTdGFydGVkKVxuICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB0aGlzLnNldHVwID0gdGhpcy5fc2hhcmVkQ29uZmlnU2VydmljZVxuICAgIC8vIHNlbmQgcmVxdWVzdCB0byB0aGUgc2VydmVyXG4gICAgdGhpcy5zZW5kKCdyZXF1ZXN0Jyk7XG4gICAgLy8gc2V0dXAgbGlzdGVuZXJzIGZvciB0aGUgc2VydmVyJ3MgcmVzcG9uc2VcbiAgICB0aGlzLnJlY2VpdmUoJ3Bvc2l0aW9uJywgdGhpcy5fb25Qb3NpdGlvblJlc3BvbnNlKTtcbiAgICB0aGlzLnJlY2VpdmUoJ3VuYXZhaWxhYmxlJywgdGhpcy5fb25VbmF2YWlsYWJsZVJlc3BvbnNlKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0RpYWxvZylcbiAgICAgIHRoaXMuc2hvdygpO1xuICB9XG5cbiAgLyoqIHByaXZhdGUgKi9cbiAgc3RvcCgpIHtcbiAgICBzdXBlci5zdG9wKCk7XG4gICAgLy8gUmVtb3ZlIGxpc3RlbmVycyBmb3IgdGhlIHNlcnZlcidzIHJlc3BvbnNlXG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcigncG9zaXRpb24nLCB0aGlzLl9vblBvc2l0aW9uUmVzcG9uc2UpO1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ3VuYXZhaWxhYmxlJywgdGhpcy5fb25VbmF2YWlsYWJsZVJlc3BvbnNlKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0RpYWxvZylcbiAgICAgIHRoaXMuaGlkZSgpO1xuICB9XG5cbiAgX29uUG9zaXRpb25SZXNwb25zZShpbmRleCwgbGFiZWwsIGNvb3JkaW5hdGVzKSB7XG4gICAgY2xpZW50LmluZGV4ID0gdGhpcy5pbmRleCA9IGluZGV4O1xuICAgIGNsaWVudC5sYWJlbCA9IHRoaXMubGFiZWwgPSBsYWJlbDtcbiAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcztcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0RpYWxvZykge1xuICAgICAgY29uc3QgZGlzcGxheUxhYmVsID0gbGFiZWwgfHwgKGluZGV4ICsgMSkudG9TdHJpbmcoKTtcbiAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IGNsaWVudC5wbGF0Zm9ybS5pc01vYmlsZSA/ICdjbGljaycgOiAndG91Y2hzdGFydCc7XG5cbiAgICAgIHRoaXMuY29udGVudC5sYWJlbCA9IGRpc3BsYXlMYWJlbDtcbiAgICAgIHRoaXMudmlldy5pbnN0YWxsRXZlbnRzKHsgW2V2ZW50TmFtZV06ICgpID0+IHRoaXMucmVhZHkoKSB9KTtcbiAgICAgIHRoaXMudmlldy5yZW5kZXIoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZWFkeSgpO1xuICAgIH1cbiAgfVxuXG4gIF9vblVuYXZhaWxhYmxlUmVzcG9uc2UoKSB7XG4gICAgdGhpcy5jb250ZW50LmVycm9yID0gdHJ1ZTtcbiAgICB0aGlzLnZpZXcucmVuZGVyKCk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgQ2xpZW50Q2hlY2tpbik7XG5cbmV4cG9ydCBkZWZhdWx0IENsaWVudENoZWNraW47XG5cbiJdfQ==