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
 *
 * The {@link Checkin} module always has a view and requires the SASS partial
 * `_77-checkin.scss`.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3NCQUFtQixVQUFVOzs7O3VCQUNWLFVBQVU7Ozs7QUFHN0IsU0FBUyxhQUFhLENBQUMsS0FBSyxFQUFFO0FBQzVCLFNBQU8sY0FBYyxHQUNuQiwyQ0FBMkMsR0FBRyxLQUFLLEdBQUcsZUFBZSxHQUNyRSxnRUFBZ0UsQ0FBQztDQUNwRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUE0Qm9CLE9BQU87WUFBUCxPQUFPOzs7Ozs7Ozs7Ozs7QUFVZixXQVZRLE9BQU8sR0FVQTtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBVkwsT0FBTzs7QUFXeEIsK0JBWGlCLE9BQU8sNkNBV2xCLE9BQU8sQ0FBQyxJQUFJLElBQUksU0FBUyxFQUFFLE9BQU8sQ0FBQyxPQUFPLElBQUksSUFBSSxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUU7Ozs7Ozs7QUFPekUsUUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQzs7Ozs7OztBQU9oQixRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQzs7QUFFbEIsUUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsVUFBVSxJQUFJLEtBQUssQ0FBQztBQUMvQyxRQUFJLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxZQUFZLElBQUksYUFBYSxDQUFDOztBQUUzRCxRQUFJLENBQUMsdUJBQXVCLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2RSxRQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMvRCxRQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUM1RDs7Ozs7Ozs7O2VBakNrQixPQUFPOztXQXlDckIsaUJBQUc7QUFDTixpQ0ExQ2lCLE9BQU8sdUNBMENWOzs7QUFHZCwwQkFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsQ0FBQzs7O0FBR3BDLDBCQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLGNBQWMsRUFBRSxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUN6RSwwQkFBTyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxjQUFjLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7S0FDdEU7Ozs7Ozs7Ozs7V0FRSSxpQkFBRztBQUNOLGlDQTNEaUIsT0FBTyx1Q0EyRFY7OztBQUdkLDBCQUFPLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLGNBQWMsRUFBRSxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUNoRiwwQkFBTyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxjQUFjLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7OztBQUc1RSxVQUFJLG9CQUFPLFFBQVEsQ0FBQyxRQUFRLEVBQzFCLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEtBRXBFLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUN6RTs7Ozs7Ozs7O1dBT00sbUJBQUc7QUFDUixpQ0E5RWlCLE9BQU8seUNBOEVSOzs7QUFHaEIsMEJBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxvQkFBTyxXQUFXLENBQUMsQ0FBQzs7QUFFaEYsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2I7OztXQUVzQixpQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRTtBQUNqRCxVQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzs7QUFFbkIsVUFBSSxXQUFXLEVBQ2Isb0JBQU8sV0FBVyxHQUFHLFdBQVcsQ0FBQzs7QUFFbkMsVUFBSSxLQUFLLEVBQUU7QUFDVCxZQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzs7QUFFbkIsWUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO0FBQ3BCLGNBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDNUMsY0FBSSxDQUFDLHNCQUFzQixDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUV6QyxjQUFJLG9CQUFPLFFBQVEsQ0FBQyxRQUFRLEVBQzFCLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEtBRWpFLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUN0RSxNQUFNO0FBQ0wsY0FBSSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ2I7T0FFRixNQUFNO0FBQ0wsWUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO09BQ2I7S0FDRjs7O1dBRWtCLCtCQUFHO0FBQ3BCLFVBQUksQ0FBQyxzQkFBc0IsQ0FBQyw0RkFBNEYsQ0FBQyxDQUFDO0tBQzNIOzs7V0FFZ0IsNkJBQUc7QUFDbEIsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2I7OztTQXRIa0IsT0FBTzs7O3FCQUFQLE9BQU8iLCJmaWxlIjoic3JjL2NsaWVudC9DaGVja2luLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgTW9kdWxlIGZyb20gJy4vTW9kdWxlJztcblxuXG5mdW5jdGlvbiBfaW5zdHJ1Y3Rpb25zKGxhYmVsKSB7XG4gIHJldHVybiBcIjxwPkdvIHRvPC9wPlwiICtcbiAgICBcIjxkaXYgY2xhc3M9J2NoZWNraW4tbGFiZWwgY2lyY2xlZCc+PHNwYW4+XCIgKyBsYWJlbCArIFwiPC9zcGFuPjwvZGl2PlwiICtcbiAgICBcIjxwPjxzbWFsbD5Ub3VjaCB0aGUgc2NyZWVuPGJyLz53aGVuIHlvdSBhcmUgcmVhZHkuPC9zbWFsbD48L3A+XCI7XG59XG5cbi8qKlxuICogVGhlIHtAbGluayBDaGVja2lufSBtb2R1bGUgYXNzaWducyBwbGFjZXMgYW1vbmcgYSBwcmVkZWZpbmVkIHtAbGluayBTZXR1cH0uXG4gKlxuICogVGhlIHtAbGluayBDaGVja2lufSBtb2R1bGUgYWx3YXlzIGhhcyBhIHZpZXcgYW5kIHJlcXVpcmVzIHRoZSBTQVNTIHBhcnRpYWxcbiAqIGBfNzctY2hlY2tpbi5zY3NzYC5cbiAqXG4gKiBAZXhhbXBsZSBpbXBvcnQgeyBjbGllbnQsIENoZWNraW4sIFNldHVwIH0gZnJvbSAnc291bmR3b3Jrcy9jbGllbnQnO1xuICpcbiAqIGNvbnN0IHNldHVwID0gbmV3IFNldHVwKCk7XG4gKiBjb25zdCBjaGVja2luID0gbmV3IENoZWNraW4oeyBzZXR1cDogc2V0dXAgfSk7XG4gKiAvLyAuLi4gaW5zdGFudGlhdGUgb3RoZXIgbW9kdWxlc1xuICpcbiAqIC8vIEluaXRpYWxpemUgdGhlIGNsaWVudCAoaW5kaWNhdGUgdGhlIGNsaWVudCB0eXBlKVxuICogY2xpZW50LmluaXQoJ2NsaWVudFR5cGUnKTtcbiAqXG4gKiAvLyBTdGFydCB0aGUgc2NlbmFyaW9cbiAqIGNsaWVudC5zdGFydCgoc2VyaWFsLCBwYXJhbGxlbCkgPT4ge1xuICogICAvLyBNYWtlIHN1cmUgdGhhdCB0aGUgYHNldHVwYCBpcyBpbml0aWFsaXplZCBiZWZvcmUgaXQgaXMgdXNlZCBieSB0aGVcbiAqICAgLy8gYGNoZWNraW5gIG1vZHVsZSAoPT4gd2UgdXNlIHRoZSBgc2VyaWFsYCBmdW5jdGlvbikuXG4gKiAgIHNlcmlhbChcbiAqICAgICBzZXR1cCxcbiAqICAgICBwbGFjZXIsXG4gKiAgICAgLy8gLi4uIG90aGVyIG1vZHVsZXNcbiAqICAgKVxuICogfSk7XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENoZWNraW4gZXh0ZW5kcyBNb2R1bGUge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nY2hlY2tpbiddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5oYXNWaWV3PXRydWVdIEluZGljYXRlcyB3aGV0aGVyIHRoZSBtb2R1bGUgaGFzIGEgdmlldyBvciBub3QuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nYmxhY2snXSBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBgdmlld2AuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuc2hvd0RpYWxvZz1mYWxzZV0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHZpZXcgZGlzcGxheXMgdGV4dCBvciBub3QuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb24obGFiZWw6U3RyaW5nKSA6IFN0cmluZ30gW29wdGlvbnMuaW5zdHJ1Y3Rpb25zXSBGdW5jdGlvbiB0byBkaXNwbGF5IHRoZSBpbnN0cnVjdGlvbnMuXG4gICAqIEB0b2RvIGRlZmF1bHQgYGluc3RydWN0aW9uc2AgdmFsdWVcbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnY2hlY2tpbicsIG9wdGlvbnMuaGFzVmlldyB8fCB0cnVlLCBvcHRpb25zLmNvbG9yKTtcblxuICAgIC8qKlxuICAgICAqIEluZGV4IGdpdmVuIGJ5IHRoZSBzZXJ2ZXJzaWRlIHtAbGluayBzcmMvc2VydmVyL0NoZWNraW4uanN+Q2hlY2tpbn1cbiAgICAgKiBtb2R1bGUuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmluZGV4ID0gLTE7XG5cbiAgICAvKipcbiAgICAgKiBMYWJlbCBvZiB0aGUgaW5kZXggYXNzaWduZWQgYnkgdGhlIHNlcnZlcnNpZGVcbiAgICAgKiB7QGxpbmsgc3JjL3NlcnZlci9DaGVja2luLmpzfkNoZWNraW59IG1vZHVsZSAoaWYgYW55KS5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMubGFiZWwgPSBudWxsO1xuXG4gICAgdGhpcy5fc2hvd0RpYWxvZyA9IG9wdGlvbnMuc2hvd0RpYWxvZyB8fCBmYWxzZTtcbiAgICB0aGlzLl9pbnN0cnVjdGlvbnMgPSBvcHRpb25zLmluc3RydWN0aW9ucyB8fCBfaW5zdHJ1Y3Rpb25zO1xuXG4gICAgdGhpcy5fYWNrbm93bGVkZ2VtZW50SGFuZGxlciA9IHRoaXMuX2Fja25vd2xlZGdlbWVudEhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICB0aGlzLl91bmF2YWlsYWJsZUhhbmRsZXIgPSB0aGlzLl91bmF2YWlsYWJsZUhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICB0aGlzLl92aWV3Q2xpY2tIYW5kbGVyID0gdGhpcy5fdmlld0NsaWNrSGFuZGxlci5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBtb2R1bGUuXG4gICAqXG4gICAqIFNlbmQgYSByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgYW5kIHNldHMgdXAgbGlzdGVuZXJzIGZvciB0aGUgc2VydmVyJ3MgcmVzcG9uc2UuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgLy8gU2VuZCByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXJcbiAgICBjbGllbnQuc2VuZCh0aGlzLm5hbWUgKyAnOnJlcXVlc3QnKTtcblxuICAgIC8vIFNldHVwIGxpc3RlbmVycyBmb3IgdGhlIHNlcnZlcidzIHJlc3BvbnNlXG4gICAgY2xpZW50LnJlY2VpdmUodGhpcy5uYW1lICsgJzphY2tub3dsZWRnZScsIHRoaXMuX2Fja25vd2xlZGdlbWVudEhhbmRsZXIpO1xuICAgIGNsaWVudC5yZWNlaXZlKHRoaXMubmFtZSArICc6dW5hdmFpbGFibGUnLCB0aGlzLl91bmF2YWlsYWJsZUhhbmRsZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IHRoZSBtb2R1bGUgdG8gZGVmYXVsdCBzdGF0ZS5cbiAgICpcbiAgICogUmVtb3ZlIFdlYlNvY2tldCBhbmQgY2xpY2sgLyB0b3VjaCBsaXN0ZW5lcnMuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXNldCgpIHtcbiAgICBzdXBlci5yZXNldCgpO1xuXG4gICAgLy8gUmVtb3ZlIGxpc3RlbmVycyBmb3IgdGhlIHNlcnZlcidzIHJlc3BvbnNlXG4gICAgY2xpZW50LnJlbW92ZUxpc3RlbmVyKHRoaXMubmFtZSArICc6YWNrbm93bGVkZ2UnLCB0aGlzLl9hY2tub3dsZWRnZW1lbnRIYW5kbGVyKTtcbiAgICBjbGllbnQucmVtb3ZlTGlzdGVuZXIodGhpcy5uYW1lICsgJzp1bmF2YWlsYWJsZScsIHRoaXMuX3VuYXZhaWxhYmxlSGFuZGxlcik7XG5cbiAgICAvLyBSZW1vdmUgdG91Y2ggLyBjbGljayBsaXN0ZW5lciBzZXQgdW4gaW4gdGhlIGBfYWNrbm93bGVkZ2VtZW50SGFuZGxlcmBcbiAgICBpZiAoY2xpZW50LnBsYXRmb3JtLmlzTW9iaWxlKVxuICAgICAgdGhpcy52aWV3LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl92aWV3Q2xpY2tIYW5kbGVyKTtcbiAgICBlbHNlXG4gICAgICB0aGlzLnZpZXcucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl92aWV3Q2xpY2tIYW5kbGVyLCBmYWxzZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVzdGFydHMgdGhlIG1vZHVsZS5cbiAgICogU2VuZHMgdGhlIGluZGV4LCBsYWJlbCBhbmQgY29vcmRpbmF0ZXMgdG8gdGhlIHNlcnZlci5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlc3RhcnQoKSB7XG4gICAgc3VwZXIucmVzdGFydCgpO1xuXG4gICAgLy8gU2VuZCBjdXJyZW50IGNoZWNraW4gaW5mb3JtYXRpb24gdG8gdGhlIHNlcnZlclxuICAgIGNsaWVudC5zZW5kKHRoaXMubmFtZSArICc6cmVzdGFydCcsIHRoaXMuaW5kZXgsIHRoaXMubGFiZWwsIGNsaWVudC5jb29yZGluYXRlcyk7XG5cbiAgICB0aGlzLmRvbmUoKTtcbiAgfVxuXG4gIF9hY2tub3dsZWRnZW1lbnRIYW5kbGVyKGluZGV4LCBsYWJlbCwgY29vcmRpbmF0ZXMpIHtcbiAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG5cbiAgICBpZiAoY29vcmRpbmF0ZXMpXG4gICAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcztcblxuICAgIGlmIChsYWJlbCkge1xuICAgICAgdGhpcy5sYWJlbCA9IGxhYmVsO1xuXG4gICAgICBpZiAodGhpcy5fc2hvd0RpYWxvZykge1xuICAgICAgICBsZXQgaHRtbENvbnRlbnQgPSB0aGlzLl9pbnN0cnVjdGlvbnMobGFiZWwpO1xuICAgICAgICB0aGlzLnNldENlbnRlcmVkVmlld0NvbnRlbnQoaHRtbENvbnRlbnQpO1xuXG4gICAgICAgIGlmIChjbGllbnQucGxhdGZvcm0uaXNNb2JpbGUpXG4gICAgICAgICAgdGhpcy52aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl92aWV3Q2xpY2tIYW5kbGVyKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHRoaXMudmlldy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX3ZpZXdDbGlja0hhbmRsZXIsIGZhbHNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZG9uZSgpO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZG9uZSgpO1xuICAgIH1cbiAgfVxuXG4gIF91bmF2YWlsYWJsZUhhbmRsZXIoKSB7XG4gICAgdGhpcy5zZXRDZW50ZXJlZFZpZXdDb250ZW50KFwiPHA+U29ycnksIHdlIGNhbm5vdCBhY2NlcHQgYW55IG1vcmUgY29ubmVjdGlvbnMgYXQgdGhlIG1vbWVudCwgcGxlYXNlIHRyeSBhZ2FpbiBsYXRlci48L3A+XCIpO1xuICB9XG5cbiAgX3ZpZXdDbGlja0hhbmRsZXIoKSB7XG4gICAgdGhpcy5kb25lKCk7XG4gIH1cbn1cbiJdfQ==