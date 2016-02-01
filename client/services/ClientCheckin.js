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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvc2VydmljZXMvQ2xpZW50Q2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7MEJBQW1CLGdCQUFnQjs7OzsyQkFDZixpQkFBaUI7Ozs7b0NBQ1gsMEJBQTBCOzs7O2tDQUN6Qix3QkFBd0I7Ozs7QUFFbkQsSUFBTSxVQUFVLEdBQUcsaUJBQWlCLENBQUM7Ozs7Ozs7Ozs7Ozs7O0lBYS9CLGFBQWE7WUFBYixhQUFhOztBQUNOLFdBRFAsYUFBYSxHQUNIOzBCQURWLGFBQWE7O0FBRWYsK0JBRkUsYUFBYSw2Q0FFVCxVQUFVLEVBQUUsSUFBSSxFQUFFOzs7Ozs7O0FBT3hCLFFBQU0sUUFBUSxHQUFHO0FBQ2YsZ0JBQVUsRUFBRSxLQUFLO0FBQ2pCLGNBQVEsbUNBQWU7QUFDdkIsa0JBQVksRUFBRSxDQUFDO0tBQ2hCLENBQUM7O0FBRUYsUUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7O0FBR3pCLFFBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9ELFFBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQ3RFOztlQXBCRyxhQUFhOztXQXNCYixnQkFBRzs7Ozs7O0FBTUwsVUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQzs7Ozs7O0FBTWhCLFVBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDOztBQUVsQixVQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFO0FBQzNCLFlBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7QUFDdEMsWUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7T0FDL0I7S0FDRjs7Ozs7V0FHSSxpQkFBRztBQUNOLGlDQTVDRSxhQUFhLHVDQTRDRDs7QUFFZCxVQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFDbEIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDOztBQUVkLFVBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7O0FBRXJCLFVBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ25ELFVBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDOztBQUV6RCxVQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUN6QixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDZjs7Ozs7V0FHRyxnQkFBRztBQUNMLGlDQTVERSxhQUFhLHNDQTRERjs7QUFFYixVQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUMxRCxVQUFJLENBQUMsY0FBYyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQzs7QUFFaEUsVUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFDekIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2Y7OztXQUVrQiw2QkFBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRTs7O0FBQzdDLFVBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ25CLFVBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ25CLDhCQUFPLFdBQVcsR0FBRyxXQUFXLENBQUM7O0FBRWpDLFVBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUU7QUFDM0IsWUFBTSxZQUFZLEdBQUcsS0FBSyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQSxDQUFFLFFBQVEsRUFBRSxDQUFDO0FBQ3JELFlBQU0sU0FBUyxHQUFHLHdCQUFPLFFBQVEsQ0FBQyxRQUFRLEdBQUcsT0FBTyxHQUFHLFlBQVksQ0FBQzs7QUFFcEUsWUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsWUFBWSxDQUFDO0FBQ2xDLFlBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxxQkFBSSxTQUFTLEVBQUc7aUJBQU0sTUFBSyxLQUFLLEVBQUU7U0FBQSxFQUFHLENBQUM7QUFDN0QsWUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztPQUNwQixNQUFNO0FBQ0wsWUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO09BQ2Q7S0FDRjs7O1dBRXFCLGtDQUFHO0FBQ3ZCLFVBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUMxQixVQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQ3BCOzs7U0F6RkcsYUFBYTs7O0FBNEZuQixnQ0FBZSxRQUFRLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDOztxQkFFcEMsYUFBYSIsImZpbGUiOiJzcmMvY2xpZW50L3NlcnZpY2VzL0NsaWVudENoZWNraW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xpZW50IGZyb20gJy4uL2NvcmUvY2xpZW50JztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgU2VnbWVudGVkVmlldyBmcm9tICcuLi9kaXNwbGF5L1NlZ21lbnRlZFZpZXcnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6Y2hlY2tpbic7XG5cbi8qKlxuICogQXNzaWduIHBsYWNlcyBhbW9uZyBhIHNldCBvZiBwcmVkZWZpbmVkIHBvc2l0aW9ucyAoaS5lLiBsYWJlbHMgYW5kL29yIGNvb3JkaW5hdGVzKS5cbiAqIFRoZSBtb2R1bGUgcmVxdWVzdHMgYSBwb3NpdGlvbiB0byB0aGUgc2VydmVyIGFuZCB3YWl0cyBmb3IgdGhlIGFuc3dlci5cbiAqXG4gKiBUaGUgbW9kdWxlIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbiB3aGVuIGl0IHJlY2VpdmVzIGEgcG9zaXRpdmUgYW5zd2VyIGZyb20gdGhlIHNlcnZlci4gT3RoZXJ3aXNlICgqZS5nLiogbm8gbW9yZSBwb3NpdGlvbnMgYXZhaWxhYmxlKSwgdGhlIG1vZHVsZSBzdGF5cyBpbiBpdHMgc3RhdGUgYW5kIG5ldmVyIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbi5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9zZXJ2ZXIvU2VydmVyQ2hlY2tpbi5qc35TZXJ2ZXJDaGVja2lufSBvbiB0aGUgc2VydmVyIHNpZGUuKVxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCBjaGVja2luID0gbmV3IENsaWVudENoZWNraW4oeyBjYXBhY2l0eTogMTAwIH0pO1xuICovXG5jbGFzcyBDbGllbnRDaGVja2luIGV4dGVuZHMgU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIHRydWUpO1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRlZmF1bHRzIC0gRGVmYXVsdCBvcHRpb25zLlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2RlZmF1bHRzLnNob3dEaWFsb2c9ZmFsc2VdIC0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHZpZXcgZGlzcGxheXMgdGV4dCBvciBub3QuXG4gICAgICogQHBhcmFtIHtWaWV3fSBbZGVmYXVsdHMudmlld0N0b3I9U2VnbWVudGVkVmlld10gLSBUaGUgY29uc3RydWN0b3IgdG8gdXNlIGluIG9yZGVyIHRvIGNyZWF0ZSB0aGUgdmlldy5cbiAgICAgKi9cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIHNob3dEaWFsb2c6IGZhbHNlLFxuICAgICAgdmlld0N0b3I6IFNlZ21lbnRlZFZpZXcsXG4gICAgICB2aWV3UHJpb3JpdHk6IDYsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIC8vIGJpbmQgY2FsbGJhY2tzIHRvIHRoZSBjdXJyZW50IGluc3RhbmNlXG4gICAgdGhpcy5fb25Qb3NpdGlvblJlc3BvbnNlID0gdGhpcy5fb25Qb3NpdGlvblJlc3BvbnNlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25VbmF2YWlsYWJsZVJlc3BvbnNlID0gdGhpcy5fb25VbmF2YWlsYWJsZVJlc3BvbnNlLmJpbmQodGhpcyk7XG4gIH1cblxuICBpbml0KCkge1xuXG4gICAgLyoqXG4gICAgICogSW5kZXggZ2l2ZW4gYnkgdGhlIHNlcnZlcnNpZGUge0BsaW5rIHNyYy9zZXJ2ZXIvU2VydmVyQ2hlY2tpbi5qc35TZXJ2ZXJDaGVja2lufSBtb2R1bGUuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmluZGV4ID0gLTE7XG5cbiAgICAvKipcbiAgICAgKiBMYWJlbCBvZiB0aGUgaW5kZXggYXNzaWduZWQgYnkgdGhlIHNlcnZlcnNpZGUge0BsaW5rIHNyYy9zZXJ2ZXIvQ2hlY2tpbi5qc35DaGVja2lufSBtb2R1bGUgKGlmIGFueSkuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLmxhYmVsID0gbnVsbDtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0RpYWxvZykge1xuICAgICAgdGhpcy52aWV3Q3RvciA9IHRoaXMub3B0aW9ucy52aWV3Q3RvcjtcbiAgICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlVmlldygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAoIXRoaXMuaGFzU3RhcnRlZClcbiAgICAgIHRoaXMuaW5pdCgpO1xuICAgIC8vIHNlbmQgcmVxdWVzdCB0byB0aGUgc2VydmVyXG4gICAgdGhpcy5zZW5kKCdyZXF1ZXN0Jyk7XG4gICAgLy8gc2V0dXAgbGlzdGVuZXJzIGZvciB0aGUgc2VydmVyJ3MgcmVzcG9uc2VcbiAgICB0aGlzLnJlY2VpdmUoJ3Bvc2l0aW9uJywgdGhpcy5fb25Qb3NpdGlvblJlc3BvbnNlKTtcbiAgICB0aGlzLnJlY2VpdmUoJ3VuYXZhaWxhYmxlJywgdGhpcy5fb25VbmF2YWlsYWJsZVJlc3BvbnNlKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0RpYWxvZylcbiAgICAgIHRoaXMuc2hvdygpO1xuICB9XG5cbiAgLyoqIHByaXZhdGUgKi9cbiAgc3RvcCgpIHtcbiAgICBzdXBlci5zdG9wKCk7XG4gICAgLy8gUmVtb3ZlIGxpc3RlbmVycyBmb3IgdGhlIHNlcnZlcidzIHJlc3BvbnNlXG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcigncG9zaXRpb24nLCB0aGlzLl9vblBvc2l0aW9uUmVzcG9uc2UpO1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ3VuYXZhaWxhYmxlJywgdGhpcy5fb25VbmF2YWlsYWJsZVJlc3BvbnNlKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0RpYWxvZylcbiAgICAgIHRoaXMuaGlkZSgpO1xuICB9XG5cbiAgX29uUG9zaXRpb25SZXNwb25zZShpbmRleCwgbGFiZWwsIGNvb3JkaW5hdGVzKSB7XG4gICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgIHRoaXMubGFiZWwgPSBsYWJlbDtcbiAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcztcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0RpYWxvZykge1xuICAgICAgY29uc3QgZGlzcGxheUxhYmVsID0gbGFiZWwgfHwgKGluZGV4ICsgMSkudG9TdHJpbmcoKTtcbiAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IGNsaWVudC5wbGF0Zm9ybS5pc01vYmlsZSA/ICdjbGljaycgOiAndG91Y2hzdGFydCc7XG5cbiAgICAgIHRoaXMuY29udGVudC5sYWJlbCA9IGRpc3BsYXlMYWJlbDtcbiAgICAgIHRoaXMudmlldy5pbnN0YWxsRXZlbnRzKHsgW2V2ZW50TmFtZV06ICgpID0+IHRoaXMucmVhZHkoKSB9KTtcbiAgICAgIHRoaXMudmlldy5yZW5kZXIoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZWFkeSgpO1xuICAgIH1cbiAgfVxuXG4gIF9vblVuYXZhaWxhYmxlUmVzcG9uc2UoKSB7XG4gICAgdGhpcy5jb250ZW50LmVycm9yID0gdHJ1ZTtcbiAgICB0aGlzLnZpZXcucmVuZGVyKCk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgQ2xpZW50Q2hlY2tpbik7XG5cbmV4cG9ydCBkZWZhdWx0IENsaWVudENoZWNraW47XG5cbiJdfQ==