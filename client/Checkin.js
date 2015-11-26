'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _Module2 = require('./Module');

var _Module3 = _interopRequireDefault(_Module2);

function _instructions(label) {
  return "<p>Go to</p>" + "<div class='checkin-label circled'><span>" + label + "</span></div>" + "<p><small>Touch the screen<br/>when you are ready.</small></p>";
}

/**
 * The {@link Checkin} module assigns places among a predefined {@link Setup}.
 * It calls its `done` method when the user is checked in.
 *
 * The {@link Checkin} module requires the SASS partial `_77-checkin.scss`.
 *
 * @example import { client, Checkin, Setup } from 'soundworks/client';
 *
 * const setup = new Setup();
 * const checkin = new Checkin({ setup: setup });
 * // ... instantiate other modules
 *
 * // Initialize the client (indicate the client type)
 * client.init('clientType');
 *
 * // Start the scenario
 * client.start((serial, parallel) => {
 *   // Make sure that the `setup` is initialized before it is used by the
 *   // `checkin` module (=> we use the `serial` function).
 *   serial(
 *     setup,
 *     placer,
 *     // ... other modules
 *   )
 * });
 */

var Checkin = (function (_Module) {
  _inherits(Checkin, _Module);

  /**
   * Creates an instance of the class. Always has a view.
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='checkin'] Name of the module.
   * @param {Boolean} [options.hasView=true] Indicates whether the module has a view or not.
   * @param {String} [options.color='black'] Background color of the `view`.
   * @param {Boolean} [options.showDialog=false] Indicates whether the view displays text or not.
   * @param {Function(label:String) : String} [options.instructions] Function to display the instructions.
   * @todo default `instructions` value
   */

  function Checkin() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Checkin);

    _get(Object.getPrototypeOf(Checkin.prototype), 'constructor', this).call(this, options.name || 'checkin', options.hasView || true, options.color);

    /**
     * Index given by the server module to the client.
     * @type {Number}
     */
    this.index = -1;

    /**
     * Label of the index assigned to the client (if any).
     * @type {String}
     */
    this.label = null;

    this._showDialog = options.showDialog || false;
    this._instructions = options.instructions || _instructions;

    this._acknowledgementHandler = this._acknowledgementHandler.bind(this);
    this._unavailableHandler = this._unavailableHandler.bind(this);
    this._viewClickHandler = this._viewClickHandler.bind(this);
  }

  /**
   * Starts the module.
   * Sends a request to the server and sets up listeners for the server's response.
   */

  _createClass(Checkin, [{
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(Checkin.prototype), 'start', this).call(this);

      _client2['default'].send(this.name + ':request');

      _client2['default'].receive(this.name + ':acknowledge', this._acknowledgementHandler);
      _client2['default'].receive(this.name + ':unavailable', this._unavailableHandler);
    }

    /**
     * Resets the module to default state.
     * Removes WebSocket and click / touch listeners.
     */
  }, {
    key: 'reset',
    value: function reset() {
      _get(Object.getPrototypeOf(Checkin.prototype), 'reset', this).call(this);

      _client2['default'].removeListener(this.name + ':acknowledge', this._acknowledgementHandler);
      _client2['default'].removeListener(this.name + ':unavailable', this._unavailableHandler);

      if (_client2['default'].platform.isMobile) this.view.removeEventListener('touchstart', this._viewClickHandler);else this.view.removeEventListener('click', this._viewClickHandler, false);
    }

    /**
     * Restarts the module.
     * Sends the index, label and coordinates to the server.
     */
  }, {
    key: 'restart',
    value: function restart() {
      _get(Object.getPrototypeOf(Checkin.prototype), 'restart', this).call(this);

      _client2['default'].send(this.name + ':restart', this.index, this.label, _client2['default'].coordinates);
      this.done();
    }
  }, {
    key: '_acknowledgementHandler',
    value: function _acknowledgementHandler(index, label, coordinates) {
      this.index = index;

      if (coordinates) _client2['default'].coordinates = coordinates;

      if (label) {
        this.label = label;

        if (this._showDialog) {
          var htmlContent = this._instructions(label);
          this.setCenteredViewContent(htmlContent);

          if (_client2['default'].platform.isMobile) this.view.addEventListener('touchstart', this._viewClickHandler);else this.view.addEventListener('click', this._viewClickHandler, false);
        } else {
          this.done();
        }
      } else {
        this.done();
      }
    }
  }, {
    key: '_unavailableHandler',
    value: function _unavailableHandler() {
      this.setCenteredViewContent("<p>Sorry, we cannot accept any more connections at the moment, please try again later.</p>");
    }
  }, {
    key: '_viewClickHandler',
    value: function _viewClickHandler() {
      this.done();
    }
  }]);

  return Checkin;
})(_Module3['default']);

exports['default'] = Checkin;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3NCQUFtQixVQUFVOzs7O3VCQUNWLFVBQVU7Ozs7QUFHN0IsU0FBUyxhQUFhLENBQUMsS0FBSyxFQUFFO0FBQzVCLFNBQU8sY0FBYyxHQUNuQiwyQ0FBMkMsR0FBRyxLQUFLLEdBQUcsZUFBZSxHQUNyRSxnRUFBZ0UsQ0FBQztDQUNwRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUE0Qm9CLE9BQU87WUFBUCxPQUFPOzs7Ozs7Ozs7Ozs7O0FBV2YsV0FYUSxPQUFPLEdBV0E7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQVhMLE9BQU87O0FBWXhCLCtCQVppQixPQUFPLDZDQVlsQixPQUFPLENBQUMsSUFBSSxJQUFJLFNBQVMsRUFBRSxPQUFPLENBQUMsT0FBTyxJQUFJLElBQUksRUFBRSxPQUFPLENBQUMsS0FBSyxFQUFFOzs7Ozs7QUFNekUsUUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQzs7Ozs7O0FBTWhCLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDOztBQUVsQixRQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxVQUFVLElBQUksS0FBSyxDQUFDO0FBQy9DLFFBQUksQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFDLFlBQVksSUFBSSxhQUFhLENBQUM7O0FBRTNELFFBQUksQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZFLFFBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9ELFFBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQzVEOzs7Ozs7O2VBaENrQixPQUFPOztXQXNDckIsaUJBQUc7QUFDTixpQ0F2Q2lCLE9BQU8sdUNBdUNWOztBQUVkLDBCQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQyxDQUFDOztBQUVwQywwQkFBTyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxjQUFjLEVBQUUsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDekUsMEJBQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsY0FBYyxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0tBQ3RFOzs7Ozs7OztXQU1JLGlCQUFHO0FBQ04saUNBcERpQixPQUFPLHVDQW9EVjs7QUFFZCwwQkFBTyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxjQUFjLEVBQUUsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDaEYsMEJBQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsY0FBYyxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOztBQUU1RSxVQUFJLG9CQUFPLFFBQVEsQ0FBQyxRQUFRLEVBQzFCLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEtBRXBFLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUN6RTs7Ozs7Ozs7V0FNTSxtQkFBRztBQUNSLGlDQXBFaUIsT0FBTyx5Q0FvRVI7O0FBRWhCLDBCQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsb0JBQU8sV0FBVyxDQUFDLENBQUM7QUFDaEYsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2I7OztXQUVzQixpQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRTtBQUNqRCxVQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzs7QUFFbkIsVUFBSSxXQUFXLEVBQ2Isb0JBQU8sV0FBVyxHQUFHLFdBQVcsQ0FBQzs7QUFFbkMsVUFBSSxLQUFLLEVBQUU7QUFDVCxZQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzs7QUFFbkIsWUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO0FBQ3BCLGNBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDNUMsY0FBSSxDQUFDLHNCQUFzQixDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUV6QyxjQUFJLG9CQUFPLFFBQVEsQ0FBQyxRQUFRLEVBQzFCLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEtBRWpFLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUN0RSxNQUFNO0FBQ0wsY0FBSSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ2I7T0FFRixNQUFNO0FBQ0wsWUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO09BQ2I7S0FDRjs7O1dBRWtCLCtCQUFHO0FBQ3BCLFVBQUksQ0FBQyxzQkFBc0IsQ0FBQyw0RkFBNEYsQ0FBQyxDQUFDO0tBQzNIOzs7V0FFZ0IsNkJBQUc7QUFDbEIsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2I7OztTQTFHa0IsT0FBTzs7O3FCQUFQLE9BQU8iLCJmaWxlIjoic3JjL2NsaWVudC9DaGVja2luLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgTW9kdWxlIGZyb20gJy4vTW9kdWxlJztcblxuXG5mdW5jdGlvbiBfaW5zdHJ1Y3Rpb25zKGxhYmVsKSB7XG4gIHJldHVybiBcIjxwPkdvIHRvPC9wPlwiICtcbiAgICBcIjxkaXYgY2xhc3M9J2NoZWNraW4tbGFiZWwgY2lyY2xlZCc+PHNwYW4+XCIgKyBsYWJlbCArIFwiPC9zcGFuPjwvZGl2PlwiICtcbiAgICBcIjxwPjxzbWFsbD5Ub3VjaCB0aGUgc2NyZWVuPGJyLz53aGVuIHlvdSBhcmUgcmVhZHkuPC9zbWFsbD48L3A+XCI7XG59XG5cbi8qKlxuICogVGhlIHtAbGluayBDaGVja2lufSBtb2R1bGUgYXNzaWducyBwbGFjZXMgYW1vbmcgYSBwcmVkZWZpbmVkIHtAbGluayBTZXR1cH0uXG4gKiBJdCBjYWxscyBpdHMgYGRvbmVgIG1ldGhvZCB3aGVuIHRoZSB1c2VyIGlzIGNoZWNrZWQgaW4uXG4gKlxuICogVGhlIHtAbGluayBDaGVja2lufSBtb2R1bGUgcmVxdWlyZXMgdGhlIFNBU1MgcGFydGlhbCBgXzc3LWNoZWNraW4uc2Nzc2AuXG4gKlxuICogQGV4YW1wbGUgaW1wb3J0IHsgY2xpZW50LCBDaGVja2luLCBTZXR1cCB9IGZyb20gJ3NvdW5kd29ya3MvY2xpZW50JztcbiAqXG4gKiBjb25zdCBzZXR1cCA9IG5ldyBTZXR1cCgpO1xuICogY29uc3QgY2hlY2tpbiA9IG5ldyBDaGVja2luKHsgc2V0dXA6IHNldHVwIH0pO1xuICogLy8gLi4uIGluc3RhbnRpYXRlIG90aGVyIG1vZHVsZXNcbiAqXG4gKiAvLyBJbml0aWFsaXplIHRoZSBjbGllbnQgKGluZGljYXRlIHRoZSBjbGllbnQgdHlwZSlcbiAqIGNsaWVudC5pbml0KCdjbGllbnRUeXBlJyk7XG4gKlxuICogLy8gU3RhcnQgdGhlIHNjZW5hcmlvXG4gKiBjbGllbnQuc3RhcnQoKHNlcmlhbCwgcGFyYWxsZWwpID0+IHtcbiAqICAgLy8gTWFrZSBzdXJlIHRoYXQgdGhlIGBzZXR1cGAgaXMgaW5pdGlhbGl6ZWQgYmVmb3JlIGl0IGlzIHVzZWQgYnkgdGhlXG4gKiAgIC8vIGBjaGVja2luYCBtb2R1bGUgKD0+IHdlIHVzZSB0aGUgYHNlcmlhbGAgZnVuY3Rpb24pLlxuICogICBzZXJpYWwoXG4gKiAgICAgc2V0dXAsXG4gKiAgICAgcGxhY2VyLFxuICogICAgIC8vIC4uLiBvdGhlciBtb2R1bGVzXG4gKiAgIClcbiAqIH0pO1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaGVja2luIGV4dGVuZHMgTW9kdWxlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLiBBbHdheXMgaGFzIGEgdmlldy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nY2hlY2tpbiddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5oYXNWaWV3PXRydWVdIEluZGljYXRlcyB3aGV0aGVyIHRoZSBtb2R1bGUgaGFzIGEgdmlldyBvciBub3QuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nYmxhY2snXSBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBgdmlld2AuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuc2hvd0RpYWxvZz1mYWxzZV0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHZpZXcgZGlzcGxheXMgdGV4dCBvciBub3QuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb24obGFiZWw6U3RyaW5nKSA6IFN0cmluZ30gW29wdGlvbnMuaW5zdHJ1Y3Rpb25zXSBGdW5jdGlvbiB0byBkaXNwbGF5IHRoZSBpbnN0cnVjdGlvbnMuXG4gICAqIEB0b2RvIGRlZmF1bHQgYGluc3RydWN0aW9uc2AgdmFsdWVcbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnY2hlY2tpbicsIG9wdGlvbnMuaGFzVmlldyB8fCB0cnVlLCBvcHRpb25zLmNvbG9yKTtcblxuICAgIC8qKlxuICAgICAqIEluZGV4IGdpdmVuIGJ5IHRoZSBzZXJ2ZXIgbW9kdWxlIHRvIHRoZSBjbGllbnQuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmluZGV4ID0gLTE7XG5cbiAgICAvKipcbiAgICAgKiBMYWJlbCBvZiB0aGUgaW5kZXggYXNzaWduZWQgdG8gdGhlIGNsaWVudCAoaWYgYW55KS5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMubGFiZWwgPSBudWxsO1xuXG4gICAgdGhpcy5fc2hvd0RpYWxvZyA9IG9wdGlvbnMuc2hvd0RpYWxvZyB8fCBmYWxzZTtcbiAgICB0aGlzLl9pbnN0cnVjdGlvbnMgPSBvcHRpb25zLmluc3RydWN0aW9ucyB8fCBfaW5zdHJ1Y3Rpb25zO1xuXG4gICAgdGhpcy5fYWNrbm93bGVkZ2VtZW50SGFuZGxlciA9IHRoaXMuX2Fja25vd2xlZGdlbWVudEhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICB0aGlzLl91bmF2YWlsYWJsZUhhbmRsZXIgPSB0aGlzLl91bmF2YWlsYWJsZUhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICB0aGlzLl92aWV3Q2xpY2tIYW5kbGVyID0gdGhpcy5fdmlld0NsaWNrSGFuZGxlci5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0cyB0aGUgbW9kdWxlLlxuICAgKiBTZW5kcyBhIHJlcXVlc3QgdG8gdGhlIHNlcnZlciBhbmQgc2V0cyB1cCBsaXN0ZW5lcnMgZm9yIHRoZSBzZXJ2ZXIncyByZXNwb25zZS5cbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBjbGllbnQuc2VuZCh0aGlzLm5hbWUgKyAnOnJlcXVlc3QnKTtcblxuICAgIGNsaWVudC5yZWNlaXZlKHRoaXMubmFtZSArICc6YWNrbm93bGVkZ2UnLCB0aGlzLl9hY2tub3dsZWRnZW1lbnRIYW5kbGVyKTtcbiAgICBjbGllbnQucmVjZWl2ZSh0aGlzLm5hbWUgKyAnOnVuYXZhaWxhYmxlJywgdGhpcy5fdW5hdmFpbGFibGVIYW5kbGVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldHMgdGhlIG1vZHVsZSB0byBkZWZhdWx0IHN0YXRlLlxuICAgKiBSZW1vdmVzIFdlYlNvY2tldCBhbmQgY2xpY2sgLyB0b3VjaCBsaXN0ZW5lcnMuXG4gICAqL1xuICByZXNldCgpIHtcbiAgICBzdXBlci5yZXNldCgpO1xuXG4gICAgY2xpZW50LnJlbW92ZUxpc3RlbmVyKHRoaXMubmFtZSArICc6YWNrbm93bGVkZ2UnLCB0aGlzLl9hY2tub3dsZWRnZW1lbnRIYW5kbGVyKTtcbiAgICBjbGllbnQucmVtb3ZlTGlzdGVuZXIodGhpcy5uYW1lICsgJzp1bmF2YWlsYWJsZScsIHRoaXMuX3VuYXZhaWxhYmxlSGFuZGxlcik7XG5cbiAgICBpZiAoY2xpZW50LnBsYXRmb3JtLmlzTW9iaWxlKVxuICAgICAgdGhpcy52aWV3LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl92aWV3Q2xpY2tIYW5kbGVyKTtcbiAgICBlbHNlXG4gICAgICB0aGlzLnZpZXcucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl92aWV3Q2xpY2tIYW5kbGVyLCBmYWxzZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVzdGFydHMgdGhlIG1vZHVsZS5cbiAgICogU2VuZHMgdGhlIGluZGV4LCBsYWJlbCBhbmQgY29vcmRpbmF0ZXMgdG8gdGhlIHNlcnZlci5cbiAgICovXG4gIHJlc3RhcnQoKSB7XG4gICAgc3VwZXIucmVzdGFydCgpO1xuXG4gICAgY2xpZW50LnNlbmQodGhpcy5uYW1lICsgJzpyZXN0YXJ0JywgdGhpcy5pbmRleCwgdGhpcy5sYWJlbCwgY2xpZW50LmNvb3JkaW5hdGVzKTtcbiAgICB0aGlzLmRvbmUoKTtcbiAgfVxuXG4gIF9hY2tub3dsZWRnZW1lbnRIYW5kbGVyKGluZGV4LCBsYWJlbCwgY29vcmRpbmF0ZXMpIHtcbiAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG5cbiAgICBpZiAoY29vcmRpbmF0ZXMpXG4gICAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcztcblxuICAgIGlmIChsYWJlbCkge1xuICAgICAgdGhpcy5sYWJlbCA9IGxhYmVsO1xuXG4gICAgICBpZiAodGhpcy5fc2hvd0RpYWxvZykge1xuICAgICAgICBsZXQgaHRtbENvbnRlbnQgPSB0aGlzLl9pbnN0cnVjdGlvbnMobGFiZWwpO1xuICAgICAgICB0aGlzLnNldENlbnRlcmVkVmlld0NvbnRlbnQoaHRtbENvbnRlbnQpO1xuXG4gICAgICAgIGlmIChjbGllbnQucGxhdGZvcm0uaXNNb2JpbGUpXG4gICAgICAgICAgdGhpcy52aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl92aWV3Q2xpY2tIYW5kbGVyKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHRoaXMudmlldy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX3ZpZXdDbGlja0hhbmRsZXIsIGZhbHNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZG9uZSgpO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZG9uZSgpO1xuICAgIH1cbiAgfVxuXG4gIF91bmF2YWlsYWJsZUhhbmRsZXIoKSB7XG4gICAgdGhpcy5zZXRDZW50ZXJlZFZpZXdDb250ZW50KFwiPHA+U29ycnksIHdlIGNhbm5vdCBhY2NlcHQgYW55IG1vcmUgY29ubmVjdGlvbnMgYXQgdGhlIG1vbWVudCwgcGxlYXNlIHRyeSBhZ2FpbiBsYXRlci48L3A+XCIpO1xuICB9XG5cbiAgX3ZpZXdDbGlja0hhbmRsZXIoKSB7XG4gICAgdGhpcy5kb25lKCk7XG4gIH1cbn1cbiJdfQ==