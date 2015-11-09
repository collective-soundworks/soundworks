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
 * The `Checkin` module is responsible for keeping track of the connected clients by assigning them indices.
 * In case that the scenario is based on predefined positions (*i.e.* a `setup`), the indices correspond to the indices of positions that can be either assigned automatically or selected by the participants.
 *
 * For instance, say that the scenario requires 12 participants who sit on a grid of 3 ⨉ 4 predefined positions.
 * When a client connects to the server, the `Checkin` module could assign the client to a position on the grid that is not occupied yet.
 * The application can indicate the participant a label that is associated with the assigned position.
 * Similarly, if the scenario takes place in a theater with labeled seats, the `Checkin` module would allow the participants to indicate their seat by its label (*e.g.* a row and a number).
 * If the scenario does not require the participants to sit at particular locations, the `Checkin` module would just assign them arbitrary indices within the range of total number of users the scenario supports.
 *
 * Alternatively, when configuring the module adequately, the module can assign arbitrary indices to the the participants and request that they indicate their approximate location in the performance space on a map.
 *
 * The {@link ClientCheckin} module takes care of the check-in on the client side.
 * The {@link ClientCheckin} module calls its `done` method when the user is checked in.
 *
 * The {@link ClientCheckin} module requires the SASS partial `_77-checkin.scss`.
 */

var ClientCheckin = (function (_Module) {
  _inherits(ClientCheckin, _Module);

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

  function ClientCheckin() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ClientCheckin);

    _get(Object.getPrototypeOf(ClientCheckin.prototype), 'constructor', this).call(this, options.name || 'checkin', options.hasView || true, options.color);

    this.index = -1;
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

  _createClass(ClientCheckin, [{
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(ClientCheckin.prototype), 'start', this).call(this);

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
      _get(Object.getPrototypeOf(ClientCheckin.prototype), 'reset', this).call(this);

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
      _get(Object.getPrototypeOf(ClientCheckin.prototype), 'restart', this).call(this);

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

  return ClientCheckin;
})(_Module3['default']);

exports['default'] = ClientCheckin;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3NCQUFtQixVQUFVOzs7O3VCQUNWLFVBQVU7Ozs7QUFHN0IsU0FBUyxhQUFhLENBQUMsS0FBSyxFQUFFO0FBQzVCLFNBQU8sY0FBYyxHQUNuQiwyQ0FBMkMsR0FBRyxLQUFLLEdBQUcsZUFBZSxHQUNyRSxnRUFBZ0UsQ0FBQztDQUNwRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFtQm9CLGFBQWE7WUFBYixhQUFhOzs7Ozs7Ozs7Ozs7O0FBV3JCLFdBWFEsYUFBYSxHQVdOO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFYTCxhQUFhOztBQVk5QiwrQkFaaUIsYUFBYSw2Q0FZeEIsT0FBTyxDQUFDLElBQUksSUFBSSxTQUFTLEVBQUUsT0FBTyxDQUFDLE9BQU8sSUFBSSxJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBRTs7QUFFekUsUUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNoQixRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQzs7QUFFbEIsUUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsVUFBVSxJQUFJLEtBQUssQ0FBQztBQUMvQyxRQUFJLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxZQUFZLElBQUksYUFBYSxDQUFDOztBQUUzRCxRQUFJLENBQUMsdUJBQXVCLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2RSxRQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMvRCxRQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUM1RDs7Ozs7OztlQXZCa0IsYUFBYTs7V0E2QjNCLGlCQUFHO0FBQ04saUNBOUJpQixhQUFhLHVDQThCaEI7O0FBRWQsMEJBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDLENBQUM7O0FBRXBDLDBCQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLGNBQWMsRUFBRSxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUN6RSwwQkFBTyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxjQUFjLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7S0FDdEU7Ozs7Ozs7O1dBTUksaUJBQUc7QUFDTixpQ0EzQ2lCLGFBQWEsdUNBMkNoQjs7QUFFZCwwQkFBTyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxjQUFjLEVBQUUsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDaEYsMEJBQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsY0FBYyxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOztBQUU1RSxVQUFJLG9CQUFPLFFBQVEsQ0FBQyxRQUFRLEVBQzFCLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEtBRXBFLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUN6RTs7Ozs7Ozs7V0FNTSxtQkFBRztBQUNSLGlDQTNEaUIsYUFBYSx5Q0EyRGQ7O0FBRWhCLDBCQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsb0JBQU8sV0FBVyxDQUFDLENBQUM7QUFDaEYsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2I7OztXQUVzQixpQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRTtBQUNqRCxVQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzs7QUFFbkIsVUFBSSxXQUFXLEVBQ2Isb0JBQU8sV0FBVyxHQUFHLFdBQVcsQ0FBQzs7QUFFbkMsVUFBSSxLQUFLLEVBQUU7QUFDVCxZQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzs7QUFFbkIsWUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO0FBQ3BCLGNBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDNUMsY0FBSSxDQUFDLHNCQUFzQixDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUV6QyxjQUFJLG9CQUFPLFFBQVEsQ0FBQyxRQUFRLEVBQzFCLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEtBRWpFLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUN0RSxNQUFNO0FBQ0wsY0FBSSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ2I7T0FFRixNQUFNO0FBQ0wsWUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO09BQ2I7S0FDRjs7O1dBRWtCLCtCQUFHO0FBQ3BCLFVBQUksQ0FBQyxzQkFBc0IsQ0FBQyw0RkFBNEYsQ0FBQyxDQUFDO0tBQzNIOzs7V0FFZ0IsNkJBQUc7QUFDbEIsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2I7OztTQWpHa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoic3JjL2NsaWVudC9DaGVja2luLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgTW9kdWxlIGZyb20gJy4vTW9kdWxlJztcblxuXG5mdW5jdGlvbiBfaW5zdHJ1Y3Rpb25zKGxhYmVsKSB7XG4gIHJldHVybiBcIjxwPkdvIHRvPC9wPlwiICtcbiAgICBcIjxkaXYgY2xhc3M9J2NoZWNraW4tbGFiZWwgY2lyY2xlZCc+PHNwYW4+XCIgKyBsYWJlbCArIFwiPC9zcGFuPjwvZGl2PlwiICtcbiAgICBcIjxwPjxzbWFsbD5Ub3VjaCB0aGUgc2NyZWVuPGJyLz53aGVuIHlvdSBhcmUgcmVhZHkuPC9zbWFsbD48L3A+XCI7XG59XG5cbi8qKlxuICogVGhlIGBDaGVja2luYCBtb2R1bGUgaXMgcmVzcG9uc2libGUgZm9yIGtlZXBpbmcgdHJhY2sgb2YgdGhlIGNvbm5lY3RlZCBjbGllbnRzIGJ5IGFzc2lnbmluZyB0aGVtIGluZGljZXMuXG4gKiBJbiBjYXNlIHRoYXQgdGhlIHNjZW5hcmlvIGlzIGJhc2VkIG9uIHByZWRlZmluZWQgcG9zaXRpb25zICgqaS5lLiogYSBgc2V0dXBgKSwgdGhlIGluZGljZXMgY29ycmVzcG9uZCB0byB0aGUgaW5kaWNlcyBvZiBwb3NpdGlvbnMgdGhhdCBjYW4gYmUgZWl0aGVyIGFzc2lnbmVkIGF1dG9tYXRpY2FsbHkgb3Igc2VsZWN0ZWQgYnkgdGhlIHBhcnRpY2lwYW50cy5cbiAqXG4gKiBGb3IgaW5zdGFuY2UsIHNheSB0aGF0IHRoZSBzY2VuYXJpbyByZXF1aXJlcyAxMiBwYXJ0aWNpcGFudHMgd2hvIHNpdCBvbiBhIGdyaWQgb2YgMyDiqIkgNCBwcmVkZWZpbmVkIHBvc2l0aW9ucy5cbiAqIFdoZW4gYSBjbGllbnQgY29ubmVjdHMgdG8gdGhlIHNlcnZlciwgdGhlIGBDaGVja2luYCBtb2R1bGUgY291bGQgYXNzaWduIHRoZSBjbGllbnQgdG8gYSBwb3NpdGlvbiBvbiB0aGUgZ3JpZCB0aGF0IGlzIG5vdCBvY2N1cGllZCB5ZXQuXG4gKiBUaGUgYXBwbGljYXRpb24gY2FuIGluZGljYXRlIHRoZSBwYXJ0aWNpcGFudCBhIGxhYmVsIHRoYXQgaXMgYXNzb2NpYXRlZCB3aXRoIHRoZSBhc3NpZ25lZCBwb3NpdGlvbi5cbiAqIFNpbWlsYXJseSwgaWYgdGhlIHNjZW5hcmlvIHRha2VzIHBsYWNlIGluIGEgdGhlYXRlciB3aXRoIGxhYmVsZWQgc2VhdHMsIHRoZSBgQ2hlY2tpbmAgbW9kdWxlIHdvdWxkIGFsbG93IHRoZSBwYXJ0aWNpcGFudHMgdG8gaW5kaWNhdGUgdGhlaXIgc2VhdCBieSBpdHMgbGFiZWwgKCplLmcuKiBhIHJvdyBhbmQgYSBudW1iZXIpLlxuICogSWYgdGhlIHNjZW5hcmlvIGRvZXMgbm90IHJlcXVpcmUgdGhlIHBhcnRpY2lwYW50cyB0byBzaXQgYXQgcGFydGljdWxhciBsb2NhdGlvbnMsIHRoZSBgQ2hlY2tpbmAgbW9kdWxlIHdvdWxkIGp1c3QgYXNzaWduIHRoZW0gYXJiaXRyYXJ5IGluZGljZXMgd2l0aGluIHRoZSByYW5nZSBvZiB0b3RhbCBudW1iZXIgb2YgdXNlcnMgdGhlIHNjZW5hcmlvIHN1cHBvcnRzLlxuICpcbiAqIEFsdGVybmF0aXZlbHksIHdoZW4gY29uZmlndXJpbmcgdGhlIG1vZHVsZSBhZGVxdWF0ZWx5LCB0aGUgbW9kdWxlIGNhbiBhc3NpZ24gYXJiaXRyYXJ5IGluZGljZXMgdG8gdGhlIHRoZSBwYXJ0aWNpcGFudHMgYW5kIHJlcXVlc3QgdGhhdCB0aGV5IGluZGljYXRlIHRoZWlyIGFwcHJveGltYXRlIGxvY2F0aW9uIGluIHRoZSBwZXJmb3JtYW5jZSBzcGFjZSBvbiBhIG1hcC5cbiAqXG4gKiBUaGUge0BsaW5rIENsaWVudENoZWNraW59IG1vZHVsZSB0YWtlcyBjYXJlIG9mIHRoZSBjaGVjay1pbiBvbiB0aGUgY2xpZW50IHNpZGUuXG4gKiBUaGUge0BsaW5rIENsaWVudENoZWNraW59IG1vZHVsZSBjYWxscyBpdHMgYGRvbmVgIG1ldGhvZCB3aGVuIHRoZSB1c2VyIGlzIGNoZWNrZWQgaW4uXG4gKlxuICogVGhlIHtAbGluayBDbGllbnRDaGVja2lufSBtb2R1bGUgcmVxdWlyZXMgdGhlIFNBU1MgcGFydGlhbCBgXzc3LWNoZWNraW4uc2Nzc2AuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudENoZWNraW4gZXh0ZW5kcyBNb2R1bGUge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiB0aGUgY2xhc3MuIEFsd2F5cyBoYXMgYSB2aWV3LlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdjaGVja2luJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmhhc1ZpZXc9dHJ1ZV0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIG1vZHVsZSBoYXMgYSB2aWV3IG9yIG5vdC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yPSdibGFjayddIEJhY2tncm91bmQgY29sb3Igb2YgdGhlIGB2aWV3YC5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5zaG93RGlhbG9nPWZhbHNlXSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgdmlldyBkaXNwbGF5cyB0ZXh0IG9yIG5vdC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbihsYWJlbDpTdHJpbmcpIDogU3RyaW5nfSBbb3B0aW9ucy5pbnN0cnVjdGlvbnNdIEZ1bmN0aW9uIHRvIGRpc3BsYXkgdGhlIGluc3RydWN0aW9ucy5cbiAgICogQHRvZG8gZGVmYXVsdCBgaW5zdHJ1Y3Rpb25zYCB2YWx1ZVxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdjaGVja2luJywgb3B0aW9ucy5oYXNWaWV3IHx8IHRydWUsIG9wdGlvbnMuY29sb3IpO1xuXG4gICAgdGhpcy5pbmRleCA9IC0xO1xuICAgIHRoaXMubGFiZWwgPSBudWxsO1xuXG4gICAgdGhpcy5fc2hvd0RpYWxvZyA9IG9wdGlvbnMuc2hvd0RpYWxvZyB8fCBmYWxzZTtcbiAgICB0aGlzLl9pbnN0cnVjdGlvbnMgPSBvcHRpb25zLmluc3RydWN0aW9ucyB8fCBfaW5zdHJ1Y3Rpb25zO1xuXG4gICAgdGhpcy5fYWNrbm93bGVkZ2VtZW50SGFuZGxlciA9IHRoaXMuX2Fja25vd2xlZGdlbWVudEhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICB0aGlzLl91bmF2YWlsYWJsZUhhbmRsZXIgPSB0aGlzLl91bmF2YWlsYWJsZUhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICB0aGlzLl92aWV3Q2xpY2tIYW5kbGVyID0gdGhpcy5fdmlld0NsaWNrSGFuZGxlci5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0cyB0aGUgbW9kdWxlLlxuICAgKiBTZW5kcyBhIHJlcXVlc3QgdG8gdGhlIHNlcnZlciBhbmQgc2V0cyB1cCBsaXN0ZW5lcnMgZm9yIHRoZSBzZXJ2ZXIncyByZXNwb25zZS5cbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBjbGllbnQuc2VuZCh0aGlzLm5hbWUgKyAnOnJlcXVlc3QnKTtcblxuICAgIGNsaWVudC5yZWNlaXZlKHRoaXMubmFtZSArICc6YWNrbm93bGVkZ2UnLCB0aGlzLl9hY2tub3dsZWRnZW1lbnRIYW5kbGVyKTtcbiAgICBjbGllbnQucmVjZWl2ZSh0aGlzLm5hbWUgKyAnOnVuYXZhaWxhYmxlJywgdGhpcy5fdW5hdmFpbGFibGVIYW5kbGVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldHMgdGhlIG1vZHVsZSB0byBkZWZhdWx0IHN0YXRlLlxuICAgKiBSZW1vdmVzIFdlYlNvY2tldCBhbmQgY2xpY2sgLyB0b3VjaCBsaXN0ZW5lcnMuXG4gICAqL1xuICByZXNldCgpIHtcbiAgICBzdXBlci5yZXNldCgpO1xuXG4gICAgY2xpZW50LnJlbW92ZUxpc3RlbmVyKHRoaXMubmFtZSArICc6YWNrbm93bGVkZ2UnLCB0aGlzLl9hY2tub3dsZWRnZW1lbnRIYW5kbGVyKTtcbiAgICBjbGllbnQucmVtb3ZlTGlzdGVuZXIodGhpcy5uYW1lICsgJzp1bmF2YWlsYWJsZScsIHRoaXMuX3VuYXZhaWxhYmxlSGFuZGxlcik7XG5cbiAgICBpZiAoY2xpZW50LnBsYXRmb3JtLmlzTW9iaWxlKVxuICAgICAgdGhpcy52aWV3LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl92aWV3Q2xpY2tIYW5kbGVyKTtcbiAgICBlbHNlXG4gICAgICB0aGlzLnZpZXcucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl92aWV3Q2xpY2tIYW5kbGVyLCBmYWxzZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVzdGFydHMgdGhlIG1vZHVsZS5cbiAgICogU2VuZHMgdGhlIGluZGV4LCBsYWJlbCBhbmQgY29vcmRpbmF0ZXMgdG8gdGhlIHNlcnZlci5cbiAgICovXG4gIHJlc3RhcnQoKSB7XG4gICAgc3VwZXIucmVzdGFydCgpO1xuXG4gICAgY2xpZW50LnNlbmQodGhpcy5uYW1lICsgJzpyZXN0YXJ0JywgdGhpcy5pbmRleCwgdGhpcy5sYWJlbCwgY2xpZW50LmNvb3JkaW5hdGVzKTtcbiAgICB0aGlzLmRvbmUoKTtcbiAgfVxuXG4gIF9hY2tub3dsZWRnZW1lbnRIYW5kbGVyKGluZGV4LCBsYWJlbCwgY29vcmRpbmF0ZXMpIHtcbiAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG5cbiAgICBpZiAoY29vcmRpbmF0ZXMpXG4gICAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcztcblxuICAgIGlmIChsYWJlbCkge1xuICAgICAgdGhpcy5sYWJlbCA9IGxhYmVsO1xuXG4gICAgICBpZiAodGhpcy5fc2hvd0RpYWxvZykge1xuICAgICAgICBsZXQgaHRtbENvbnRlbnQgPSB0aGlzLl9pbnN0cnVjdGlvbnMobGFiZWwpO1xuICAgICAgICB0aGlzLnNldENlbnRlcmVkVmlld0NvbnRlbnQoaHRtbENvbnRlbnQpO1xuXG4gICAgICAgIGlmIChjbGllbnQucGxhdGZvcm0uaXNNb2JpbGUpXG4gICAgICAgICAgdGhpcy52aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl92aWV3Q2xpY2tIYW5kbGVyKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHRoaXMudmlldy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX3ZpZXdDbGlja0hhbmRsZXIsIGZhbHNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZG9uZSgpO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZG9uZSgpO1xuICAgIH1cbiAgfVxuXG4gIF91bmF2YWlsYWJsZUhhbmRsZXIoKSB7XG4gICAgdGhpcy5zZXRDZW50ZXJlZFZpZXdDb250ZW50KFwiPHA+U29ycnksIHdlIGNhbm5vdCBhY2NlcHQgYW55IG1vcmUgY29ubmVjdGlvbnMgYXQgdGhlIG1vbWVudCwgcGxlYXNlIHRyeSBhZ2FpbiBsYXRlci48L3A+XCIpO1xuICB9XG5cbiAgX3ZpZXdDbGlja0hhbmRsZXIoKSB7XG4gICAgdGhpcy5kb25lKCk7XG4gIH1cbn1cbiJdfQ==