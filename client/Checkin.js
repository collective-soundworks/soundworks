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
  return '\n    <p>Go to</p>\n    <div class="checkin-label circled"><span>' + label + '</span></div>\n    <p><small>Touch the screen<br/>when you are ready.</small></p>\n  ';
}

/**
 * [client] Assign places among a predefined {@link Setup}.
 * The module requests a position to the server and waits for the answer.
 *
 * The module finishes its initialization when it receives a positive answer from the server.
 * Otherwise (*e.g.* no more positions available), the module stays in its state and never finishes its initialization.
 *
 * The module always has a view and requires the SASS partial `_77-checkin.scss`.
 *
 * (See also {@link src/server/Checkin.js~Checkin} on the server side.)
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
     * Index given by the serverside {@link src/server/Checkin.js~Checkin}
     * module.
     * @type {Number}
     */
    this.index = -1;

    /**
     * Label of the index assigned by the serverside
     * {@link src/server/Checkin.js~Checkin} module (if any).
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
   * Start the module.
   *
   * Send a request to the server and sets up listeners for the server's response.
   * @private
   */

  _createClass(Checkin, [{
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(Checkin.prototype), 'start', this).call(this);

      // Send request to the server
      _client2['default'].send(this.name + ':request');

      // Setup listeners for the server's response
      _client2['default'].receive(this.name + ':acknowledge', this._acknowledgementHandler);
      _client2['default'].receive(this.name + ':unavailable', this._unavailableHandler);
    }

    /**
     * Reset the module to default state.
     *
     * Remove WebSocket and click / touch listeners.
     * @private
     */
  }, {
    key: 'reset',
    value: function reset() {
      _get(Object.getPrototypeOf(Checkin.prototype), 'reset', this).call(this);

      // Remove listeners for the server's response
      _client2['default'].removeListener(this.name + ':acknowledge', this._acknowledgementHandler);
      _client2['default'].removeListener(this.name + ':unavailable', this._unavailableHandler);

      // Remove touch / click listener set un in the `_acknowledgementHandler`
      if (_client2['default'].platform.isMobile) this.view.removeEventListener('touchstart', this._viewClickHandler);else this.view.removeEventListener('click', this._viewClickHandler, false);
    }

    /**
     * Restarts the module.
     * Sends the index, label and coordinates to the server.
     * @private
     */
  }, {
    key: 'restart',
    value: function restart() {
      _get(Object.getPrototypeOf(Checkin.prototype), 'restart', this).call(this);

      // Send current checkin information to the server
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvUGxhdGZvcm0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztzQkFBbUIsVUFBVTs7Ozt1QkFDVixVQUFVOzs7O0FBRzdCLFNBQVMsYUFBYSxDQUFDLEtBQUssRUFBRTtBQUM1QiwrRUFFNkMsS0FBSywyRkFFaEQ7Q0FDSDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWlDb0IsT0FBTztZQUFQLE9BQU87Ozs7Ozs7Ozs7OztBQVVmLFdBVlEsT0FBTyxHQVVBO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFWTCxPQUFPOztBQVd4QiwrQkFYaUIsT0FBTyw2Q0FXbEIsT0FBTyxDQUFDLElBQUksSUFBSSxTQUFTLEVBQUUsT0FBTyxDQUFDLE9BQU8sSUFBSSxJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBRTs7Ozs7OztBQU96RSxRQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDOzs7Ozs7O0FBT2hCLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDOztBQUVsQixRQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxVQUFVLElBQUksS0FBSyxDQUFDO0FBQy9DLFFBQUksQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFDLFlBQVksSUFBSSxhQUFhLENBQUM7O0FBRTNELFFBQUksQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZFLFFBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9ELFFBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQzVEOzs7Ozs7Ozs7ZUFqQ2tCLE9BQU87O1dBeUNyQixpQkFBRztBQUNOLGlDQTFDaUIsT0FBTyx1Q0EwQ1Y7OztBQUdkLDBCQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQyxDQUFDOzs7QUFHcEMsMEJBQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsY0FBYyxFQUFFLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ3pFLDBCQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLGNBQWMsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztLQUN0RTs7Ozs7Ozs7OztXQVFJLGlCQUFHO0FBQ04saUNBM0RpQixPQUFPLHVDQTJEVjs7O0FBR2QsMEJBQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsY0FBYyxFQUFFLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ2hGLDBCQUFPLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLGNBQWMsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQzs7O0FBRzVFLFVBQUksb0JBQU8sUUFBUSxDQUFDLFFBQVEsRUFDMUIsSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsS0FFcEUsSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQ3pFOzs7Ozs7Ozs7V0FPTSxtQkFBRztBQUNSLGlDQTlFaUIsT0FBTyx5Q0E4RVI7OztBQUdoQiwwQkFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLG9CQUFPLFdBQVcsQ0FBQyxDQUFDOztBQUVoRixVQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDYjs7O1dBRXNCLGlDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFO0FBQ2pELFVBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDOztBQUVuQixVQUFJLFdBQVcsRUFDYixvQkFBTyxXQUFXLEdBQUcsV0FBVyxDQUFDOztBQUVuQyxVQUFJLEtBQUssRUFBRTtBQUNULFlBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDOztBQUVuQixZQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDcEIsY0FBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1QyxjQUFJLENBQUMsc0JBQXNCLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRXpDLGNBQUksb0JBQU8sUUFBUSxDQUFDLFFBQVEsRUFDMUIsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsS0FFakUsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ3RFLE1BQU07QUFDTCxjQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDYjtPQUVGLE1BQU07QUFDTCxZQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7T0FDYjtLQUNGOzs7V0FFa0IsK0JBQUc7QUFDcEIsVUFBSSxDQUFDLHNCQUFzQixDQUFDLDRGQUE0RixDQUFDLENBQUM7S0FDM0g7OztXQUVnQiw2QkFBRztBQUNsQixVQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDYjs7O1NBdEhrQixPQUFPOzs7cUJBQVAsT0FBTyIsImZpbGUiOiJzcmMvY2xpZW50L1BsYXRmb3JtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgTW9kdWxlIGZyb20gJy4vTW9kdWxlJztcblxuXG5mdW5jdGlvbiBfaW5zdHJ1Y3Rpb25zKGxhYmVsKSB7XG4gIHJldHVybiBgXG4gICAgPHA+R28gdG88L3A+XG4gICAgPGRpdiBjbGFzcz1cImNoZWNraW4tbGFiZWwgY2lyY2xlZFwiPjxzcGFuPiR7bGFiZWx9PC9zcGFuPjwvZGl2PlxuICAgIDxwPjxzbWFsbD5Ub3VjaCB0aGUgc2NyZWVuPGJyLz53aGVuIHlvdSBhcmUgcmVhZHkuPC9zbWFsbD48L3A+XG4gIGA7XG59XG5cbi8qKlxuICogW2NsaWVudF0gQXNzaWduIHBsYWNlcyBhbW9uZyBhIHByZWRlZmluZWQge0BsaW5rIFNldHVwfS5cbiAqIFRoZSBtb2R1bGUgcmVxdWVzdHMgYSBwb3NpdGlvbiB0byB0aGUgc2VydmVyIGFuZCB3YWl0cyBmb3IgdGhlIGFuc3dlci5cbiAqXG4gKiBUaGUgbW9kdWxlIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbiB3aGVuIGl0IHJlY2VpdmVzIGEgcG9zaXRpdmUgYW5zd2VyIGZyb20gdGhlIHNlcnZlci5cbiAqIE90aGVyd2lzZSAoKmUuZy4qIG5vIG1vcmUgcG9zaXRpb25zIGF2YWlsYWJsZSksIHRoZSBtb2R1bGUgc3RheXMgaW4gaXRzIHN0YXRlIGFuZCBuZXZlciBmaW5pc2hlcyBpdHMgaW5pdGlhbGl6YXRpb24uXG4gKlxuICogVGhlIG1vZHVsZSBhbHdheXMgaGFzIGEgdmlldyBhbmQgcmVxdWlyZXMgdGhlIFNBU1MgcGFydGlhbCBgXzc3LWNoZWNraW4uc2Nzc2AuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvc2VydmVyL0NoZWNraW4uanN+Q2hlY2tpbn0gb24gdGhlIHNlcnZlciBzaWRlLilcbiAqXG4gKiBAZXhhbXBsZSBpbXBvcnQgeyBjbGllbnQsIENoZWNraW4sIFNldHVwIH0gZnJvbSAnc291bmR3b3Jrcy9jbGllbnQnO1xuICpcbiAqIGNvbnN0IHNldHVwID0gbmV3IFNldHVwKCk7XG4gKiBjb25zdCBjaGVja2luID0gbmV3IENoZWNraW4oeyBzZXR1cDogc2V0dXAgfSk7XG4gKiAvLyAuLi4gaW5zdGFudGlhdGUgb3RoZXIgbW9kdWxlc1xuICpcbiAqIC8vIEluaXRpYWxpemUgdGhlIGNsaWVudCAoaW5kaWNhdGUgdGhlIGNsaWVudCB0eXBlKVxuICogY2xpZW50LmluaXQoJ2NsaWVudFR5cGUnKTtcbiAqXG4gKiAvLyBTdGFydCB0aGUgc2NlbmFyaW9cbiAqIGNsaWVudC5zdGFydCgoc2VyaWFsLCBwYXJhbGxlbCkgPT4ge1xuICogICAvLyBNYWtlIHN1cmUgdGhhdCB0aGUgYHNldHVwYCBpcyBpbml0aWFsaXplZCBiZWZvcmUgaXQgaXMgdXNlZCBieSB0aGVcbiAqICAgLy8gYGNoZWNraW5gIG1vZHVsZSAoPT4gd2UgdXNlIHRoZSBgc2VyaWFsYCBmdW5jdGlvbikuXG4gKiAgIHNlcmlhbChcbiAqICAgICBzZXR1cCxcbiAqICAgICBwbGFjZXIsXG4gKiAgICAgLy8gLi4uIG90aGVyIG1vZHVsZXNcbiAqICAgKVxuICogfSk7XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENoZWNraW4gZXh0ZW5kcyBNb2R1bGUge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nY2hlY2tpbiddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5oYXNWaWV3PXRydWVdIEluZGljYXRlcyB3aGV0aGVyIHRoZSBtb2R1bGUgaGFzIGEgdmlldyBvciBub3QuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nYmxhY2snXSBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBgdmlld2AuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuc2hvd0RpYWxvZz1mYWxzZV0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHZpZXcgZGlzcGxheXMgdGV4dCBvciBub3QuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb24obGFiZWw6U3RyaW5nKSA6IFN0cmluZ30gW29wdGlvbnMuaW5zdHJ1Y3Rpb25zXSBGdW5jdGlvbiB0byBkaXNwbGF5IHRoZSBpbnN0cnVjdGlvbnMuXG4gICAqIEB0b2RvIGRlZmF1bHQgYGluc3RydWN0aW9uc2AgdmFsdWVcbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnY2hlY2tpbicsIG9wdGlvbnMuaGFzVmlldyB8fCB0cnVlLCBvcHRpb25zLmNvbG9yKTtcblxuICAgIC8qKlxuICAgICAqIEluZGV4IGdpdmVuIGJ5IHRoZSBzZXJ2ZXJzaWRlIHtAbGluayBzcmMvc2VydmVyL0NoZWNraW4uanN+Q2hlY2tpbn1cbiAgICAgKiBtb2R1bGUuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmluZGV4ID0gLTE7XG5cbiAgICAvKipcbiAgICAgKiBMYWJlbCBvZiB0aGUgaW5kZXggYXNzaWduZWQgYnkgdGhlIHNlcnZlcnNpZGVcbiAgICAgKiB7QGxpbmsgc3JjL3NlcnZlci9DaGVja2luLmpzfkNoZWNraW59IG1vZHVsZSAoaWYgYW55KS5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMubGFiZWwgPSBudWxsO1xuXG4gICAgdGhpcy5fc2hvd0RpYWxvZyA9IG9wdGlvbnMuc2hvd0RpYWxvZyB8fCBmYWxzZTtcbiAgICB0aGlzLl9pbnN0cnVjdGlvbnMgPSBvcHRpb25zLmluc3RydWN0aW9ucyB8fCBfaW5zdHJ1Y3Rpb25zO1xuXG4gICAgdGhpcy5fYWNrbm93bGVkZ2VtZW50SGFuZGxlciA9IHRoaXMuX2Fja25vd2xlZGdlbWVudEhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICB0aGlzLl91bmF2YWlsYWJsZUhhbmRsZXIgPSB0aGlzLl91bmF2YWlsYWJsZUhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICB0aGlzLl92aWV3Q2xpY2tIYW5kbGVyID0gdGhpcy5fdmlld0NsaWNrSGFuZGxlci5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBtb2R1bGUuXG4gICAqXG4gICAqIFNlbmQgYSByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgYW5kIHNldHMgdXAgbGlzdGVuZXJzIGZvciB0aGUgc2VydmVyJ3MgcmVzcG9uc2UuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgLy8gU2VuZCByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXJcbiAgICBjbGllbnQuc2VuZCh0aGlzLm5hbWUgKyAnOnJlcXVlc3QnKTtcblxuICAgIC8vIFNldHVwIGxpc3RlbmVycyBmb3IgdGhlIHNlcnZlcidzIHJlc3BvbnNlXG4gICAgY2xpZW50LnJlY2VpdmUodGhpcy5uYW1lICsgJzphY2tub3dsZWRnZScsIHRoaXMuX2Fja25vd2xlZGdlbWVudEhhbmRsZXIpO1xuICAgIGNsaWVudC5yZWNlaXZlKHRoaXMubmFtZSArICc6dW5hdmFpbGFibGUnLCB0aGlzLl91bmF2YWlsYWJsZUhhbmRsZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IHRoZSBtb2R1bGUgdG8gZGVmYXVsdCBzdGF0ZS5cbiAgICpcbiAgICogUmVtb3ZlIFdlYlNvY2tldCBhbmQgY2xpY2sgLyB0b3VjaCBsaXN0ZW5lcnMuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXNldCgpIHtcbiAgICBzdXBlci5yZXNldCgpO1xuXG4gICAgLy8gUmVtb3ZlIGxpc3RlbmVycyBmb3IgdGhlIHNlcnZlcidzIHJlc3BvbnNlXG4gICAgY2xpZW50LnJlbW92ZUxpc3RlbmVyKHRoaXMubmFtZSArICc6YWNrbm93bGVkZ2UnLCB0aGlzLl9hY2tub3dsZWRnZW1lbnRIYW5kbGVyKTtcbiAgICBjbGllbnQucmVtb3ZlTGlzdGVuZXIodGhpcy5uYW1lICsgJzp1bmF2YWlsYWJsZScsIHRoaXMuX3VuYXZhaWxhYmxlSGFuZGxlcik7XG5cbiAgICAvLyBSZW1vdmUgdG91Y2ggLyBjbGljayBsaXN0ZW5lciBzZXQgdW4gaW4gdGhlIGBfYWNrbm93bGVkZ2VtZW50SGFuZGxlcmBcbiAgICBpZiAoY2xpZW50LnBsYXRmb3JtLmlzTW9iaWxlKVxuICAgICAgdGhpcy52aWV3LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl92aWV3Q2xpY2tIYW5kbGVyKTtcbiAgICBlbHNlXG4gICAgICB0aGlzLnZpZXcucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl92aWV3Q2xpY2tIYW5kbGVyLCBmYWxzZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVzdGFydHMgdGhlIG1vZHVsZS5cbiAgICogU2VuZHMgdGhlIGluZGV4LCBsYWJlbCBhbmQgY29vcmRpbmF0ZXMgdG8gdGhlIHNlcnZlci5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlc3RhcnQoKSB7XG4gICAgc3VwZXIucmVzdGFydCgpO1xuXG4gICAgLy8gU2VuZCBjdXJyZW50IGNoZWNraW4gaW5mb3JtYXRpb24gdG8gdGhlIHNlcnZlclxuICAgIGNsaWVudC5zZW5kKHRoaXMubmFtZSArICc6cmVzdGFydCcsIHRoaXMuaW5kZXgsIHRoaXMubGFiZWwsIGNsaWVudC5jb29yZGluYXRlcyk7XG5cbiAgICB0aGlzLmRvbmUoKTtcbiAgfVxuXG4gIF9hY2tub3dsZWRnZW1lbnRIYW5kbGVyKGluZGV4LCBsYWJlbCwgY29vcmRpbmF0ZXMpIHtcbiAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG5cbiAgICBpZiAoY29vcmRpbmF0ZXMpXG4gICAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcztcblxuICAgIGlmIChsYWJlbCkge1xuICAgICAgdGhpcy5sYWJlbCA9IGxhYmVsO1xuXG4gICAgICBpZiAodGhpcy5fc2hvd0RpYWxvZykge1xuICAgICAgICBsZXQgaHRtbENvbnRlbnQgPSB0aGlzLl9pbnN0cnVjdGlvbnMobGFiZWwpO1xuICAgICAgICB0aGlzLnNldENlbnRlcmVkVmlld0NvbnRlbnQoaHRtbENvbnRlbnQpO1xuXG4gICAgICAgIGlmIChjbGllbnQucGxhdGZvcm0uaXNNb2JpbGUpXG4gICAgICAgICAgdGhpcy52aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl92aWV3Q2xpY2tIYW5kbGVyKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHRoaXMudmlldy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX3ZpZXdDbGlja0hhbmRsZXIsIGZhbHNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZG9uZSgpO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZG9uZSgpO1xuICAgIH1cbiAgfVxuXG4gIF91bmF2YWlsYWJsZUhhbmRsZXIoKSB7XG4gICAgdGhpcy5zZXRDZW50ZXJlZFZpZXdDb250ZW50KFwiPHA+U29ycnksIHdlIGNhbm5vdCBhY2NlcHQgYW55IG1vcmUgY29ubmVjdGlvbnMgYXQgdGhlIG1vbWVudCwgcGxlYXNlIHRyeSBhZ2FpbiBsYXRlci48L3A+XCIpO1xuICB9XG5cbiAgX3ZpZXdDbGlja0hhbmRsZXIoKSB7XG4gICAgdGhpcy5kb25lKCk7XG4gIH1cbn1cbiJdfQ==