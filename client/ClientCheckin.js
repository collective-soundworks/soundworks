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

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _ClientModule2 = require('./ClientModule');

var _ClientModule3 = _interopRequireDefault(_ClientModule2);

var _displaySegmentedView = require('./display/SegmentedView');

var _displaySegmentedView2 = _interopRequireDefault(_displaySegmentedView);

// function _instructions(label) {
//   return `
//     <p>Go to</p>
//     <div class="checkin-label circled"><span>${label}</span></div>
//     <p><small>Touch the screen<br/>when you are ready.</small></p>
//   `;
// }

/**
 * [client] Assign places among a set of predefined positions (i.e. labels and/or coordinates).
 * The module requests a position to the server and waits for the answer.
 *
 * The module finishes its initialization when it receives a positive answer from the server.
 * Otherwise (*e.g.* no more positions available), the module stays in its state and never finishes its initialization.
 *
 * The module always has a view and requires the SASS partial `_77-checkin.scss`.
 *
 * (See also {@link src/server/ServerCheckin.js~ServerCheckin} on the server side.)
 *
 * @example  * const checkin = new ClientCheckin({ capacity: 100 });
 */

var ClientCheckin = (function (_ClientModule) {
  _inherits(ClientCheckin, _ClientModule);

  /**
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

    /**
     * Index given by the serverside {@link src/server/ServerCheckin.js~ServerCheckin}
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

    var showDialog = options.showDialog || false;
    // this._instructions = options.instructions || _instructions;

    // bind callbacks to the current instance
    this._positionHandler = this._positionHandler.bind(this);
    this._unavailableHandler = this._unavailableHandler.bind(this);
    this._viewClickHandler = this._viewClickHandler.bind(this);

    // init()
    if (showDialog) {
      this.viewCtor = options.viewCtor || _displaySegmentedView2['default'];
      this.content.waiting = true;
      this.content.label = null;
      if (this.view) {
        this.view.remove();
      } // in `this.reset()`
      this.view = this.createDefaultView();
    }

    // this.init();
  }

  /**
   * Start the module.
   *
   * Send a request to the server and sets up listeners for the server's response.
   * @private
   */

  _createClass(ClientCheckin, [{
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(ClientCheckin.prototype), 'start', this).call(this);
      // Send request to the server
      this.send('request');

      // Setup listeners for the server's response
      this.receive('position', this._positionHandler);
      this.receive('unavailable', this._unavailableHandler);
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
      _get(Object.getPrototypeOf(ClientCheckin.prototype), 'reset', this).call(this);

      // Remove listeners for the server's response
      this.removeListener('position', this._positionHandler);
      this.removeListener('unavailable', this._unavailableHandler);

      if (this.view) {
        this.view.installEvents({}, true);
      }
    }

    /**
     * Restarts the module.
     * Sends the index, label and coordinates to the server.
     * @private
     */
  }, {
    key: 'restart',
    value: function restart() {
      _get(Object.getPrototypeOf(ClientCheckin.prototype), 'restart', this).call(this);
      // Send current checkin information to the server
      this.send('restart', this.index, this.label, _client2['default'].coordinates);
      this.done();
    }
  }, {
    key: '_positionHandler',
    value: function _positionHandler(index, label, coordinates) {
      this.index = index;
      this.label = label;
      _client2['default'].coordinates = coordinates;

      if (this.view) {
        var displayLabel = label || (index + 1).toString(); // ?
        var eventName = _client2['default'].platform.isMobile ? 'click' : 'touchstart';

        this.content.waiting = false;
        this.content.label = displayLabel;
        this.view.installEvents(_defineProperty({}, eventName, this._viewClickHandler));
        this.view.render();
      } else {
        this.done();
      }
    }
  }, {
    key: '_unavailableHandler',
    value: function _unavailableHandler() {
      this.content.waiting = false;
      this.view.render();
    }
  }, {
    key: '_viewClickHandler',
    value: function _viewClickHandler() {
      this.done();
    }
  }]);

  return ClientCheckin;
})(_ClientModule3['default']);

exports['default'] = ClientCheckin;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBQW1CLFVBQVU7Ozs7NkJBQ0osZ0JBQWdCOzs7O29DQUNmLHlCQUF5Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUF3QjlCLGFBQWE7WUFBYixhQUFhOzs7Ozs7Ozs7Ozs7QUFVckIsV0FWUSxhQUFhLEdBVU47UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQVZMLGFBQWE7O0FBVzlCLCtCQVhpQixhQUFhLDZDQVd4QixPQUFPLENBQUMsSUFBSSxJQUFJLFNBQVMsRUFBRSxPQUFPLENBQUMsT0FBTyxJQUFJLElBQUksRUFBRSxPQUFPLENBQUMsS0FBSyxFQUFFOzs7Ozs7O0FBT3pFLFFBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7QUFPaEIsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRWxCLFFBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLElBQUksS0FBSyxDQUFDOzs7O0FBSS9DLFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pELFFBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9ELFFBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOzs7QUFHM0QsUUFBSSxVQUFVLEVBQUU7QUFDZCxVQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLHFDQUFpQixDQUFDO0FBQ2xELFVBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztBQUM1QixVQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDMUIsVUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQUUsWUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztPQUFFO0FBQ3RDLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7S0FDdEM7OztHQUdGOzs7Ozs7Ozs7ZUE3Q2tCLGFBQWE7O1dBcUQzQixpQkFBRztBQUNOLGlDQXREaUIsYUFBYSx1Q0FzRGhCOztBQUVkLFVBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7OztBQUdyQixVQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUNoRCxVQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztLQUN2RDs7Ozs7Ozs7OztXQVFJLGlCQUFHO0FBQ04saUNBdEVpQixhQUFhLHVDQXNFaEI7OztBQUdkLFVBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3ZELFVBQUksQ0FBQyxjQUFjLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOztBQUU3RCxVQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7QUFBRSxZQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7T0FBRTtLQUN0RDs7Ozs7Ozs7O1dBT00sbUJBQUc7QUFDUixpQ0FyRmlCLGFBQWEseUNBcUZkOztBQUVoQixVQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsb0JBQU8sV0FBVyxDQUFDLENBQUM7QUFDakUsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2I7OztXQUVlLDBCQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFO0FBQzFDLFVBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ25CLFVBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ25CLDBCQUFPLFdBQVcsR0FBRyxXQUFXLENBQUM7O0FBRWpDLFVBQUksSUFBSSxDQUFDLElBQUksRUFBRTtBQUNiLFlBQU0sWUFBWSxHQUFHLEtBQUssSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUEsQ0FBRSxRQUFRLEVBQUUsQ0FBQztBQUNyRCxZQUFNLFNBQVMsR0FBRyxvQkFBTyxRQUFRLENBQUMsUUFBUSxHQUFHLE9BQU8sR0FBRyxZQUFZLENBQUM7O0FBRXBFLFlBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztBQUM3QixZQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxZQUFZLENBQUM7QUFDbEMsWUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLHFCQUFJLFNBQVMsRUFBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUcsQ0FBQztBQUNqRSxZQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO09BQ3BCLE1BQU07QUFDTCxZQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7T0FDYjtLQUNGOzs7V0FFa0IsK0JBQUc7QUFDcEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0FBQzdCLFVBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDcEI7OztXQUVnQiw2QkFBRztBQUNsQixVQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDYjs7O1NBcEhrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiJzcmMvY2xpZW50L0NsaWVudENoZWNraW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCBDbGllbnRNb2R1bGUgZnJvbSAnLi9DbGllbnRNb2R1bGUnO1xuaW1wb3J0IFNlZ21lbnRlZFZpZXcgZnJvbSAnLi9kaXNwbGF5L1NlZ21lbnRlZFZpZXcnO1xuXG5cbi8vIGZ1bmN0aW9uIF9pbnN0cnVjdGlvbnMobGFiZWwpIHtcbi8vICAgcmV0dXJuIGBcbi8vICAgICA8cD5HbyB0bzwvcD5cbi8vICAgICA8ZGl2IGNsYXNzPVwiY2hlY2tpbi1sYWJlbCBjaXJjbGVkXCI+PHNwYW4+JHtsYWJlbH08L3NwYW4+PC9kaXY+XG4vLyAgICAgPHA+PHNtYWxsPlRvdWNoIHRoZSBzY3JlZW48YnIvPndoZW4geW91IGFyZSByZWFkeS48L3NtYWxsPjwvcD5cbi8vICAgYDtcbi8vIH1cblxuLyoqXG4gKiBbY2xpZW50XSBBc3NpZ24gcGxhY2VzIGFtb25nIGEgc2V0IG9mIHByZWRlZmluZWQgcG9zaXRpb25zIChpLmUuIGxhYmVscyBhbmQvb3IgY29vcmRpbmF0ZXMpLlxuICogVGhlIG1vZHVsZSByZXF1ZXN0cyBhIHBvc2l0aW9uIHRvIHRoZSBzZXJ2ZXIgYW5kIHdhaXRzIGZvciB0aGUgYW5zd2VyLlxuICpcbiAqIFRoZSBtb2R1bGUgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uIHdoZW4gaXQgcmVjZWl2ZXMgYSBwb3NpdGl2ZSBhbnN3ZXIgZnJvbSB0aGUgc2VydmVyLlxuICogT3RoZXJ3aXNlICgqZS5nLiogbm8gbW9yZSBwb3NpdGlvbnMgYXZhaWxhYmxlKSwgdGhlIG1vZHVsZSBzdGF5cyBpbiBpdHMgc3RhdGUgYW5kIG5ldmVyIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbi5cbiAqXG4gKiBUaGUgbW9kdWxlIGFsd2F5cyBoYXMgYSB2aWV3IGFuZCByZXF1aXJlcyB0aGUgU0FTUyBwYXJ0aWFsIGBfNzctY2hlY2tpbi5zY3NzYC5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9zZXJ2ZXIvU2VydmVyQ2hlY2tpbi5qc35TZXJ2ZXJDaGVja2lufSBvbiB0aGUgc2VydmVyIHNpZGUuKVxuICpcbiAqIEBleGFtcGxlICAqIGNvbnN0IGNoZWNraW4gPSBuZXcgQ2xpZW50Q2hlY2tpbih7IGNhcGFjaXR5OiAxMDAgfSk7XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudENoZWNraW4gZXh0ZW5kcyBDbGllbnRNb2R1bGUge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nY2hlY2tpbiddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5oYXNWaWV3PXRydWVdIEluZGljYXRlcyB3aGV0aGVyIHRoZSBtb2R1bGUgaGFzIGEgdmlldyBvciBub3QuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nYmxhY2snXSBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBgdmlld2AuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuc2hvd0RpYWxvZz1mYWxzZV0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHZpZXcgZGlzcGxheXMgdGV4dCBvciBub3QuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb24obGFiZWw6U3RyaW5nKSA6IFN0cmluZ30gW29wdGlvbnMuaW5zdHJ1Y3Rpb25zXSBGdW5jdGlvbiB0byBkaXNwbGF5IHRoZSBpbnN0cnVjdGlvbnMuXG4gICAqIEB0b2RvIGRlZmF1bHQgYGluc3RydWN0aW9uc2AgdmFsdWVcbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnY2hlY2tpbicsIG9wdGlvbnMuaGFzVmlldyB8fCB0cnVlLCBvcHRpb25zLmNvbG9yKTtcblxuICAgIC8qKlxuICAgICAqIEluZGV4IGdpdmVuIGJ5IHRoZSBzZXJ2ZXJzaWRlIHtAbGluayBzcmMvc2VydmVyL1NlcnZlckNoZWNraW4uanN+U2VydmVyQ2hlY2tpbn1cbiAgICAgKiBtb2R1bGUuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmluZGV4ID0gLTE7XG5cbiAgICAvKipcbiAgICAgKiBMYWJlbCBvZiB0aGUgaW5kZXggYXNzaWduZWQgYnkgdGhlIHNlcnZlcnNpZGVcbiAgICAgKiB7QGxpbmsgc3JjL3NlcnZlci9DaGVja2luLmpzfkNoZWNraW59IG1vZHVsZSAoaWYgYW55KS5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMubGFiZWwgPSBudWxsO1xuXG4gICAgY29uc3Qgc2hvd0RpYWxvZyA9IG9wdGlvbnMuc2hvd0RpYWxvZyB8fCBmYWxzZTtcbiAgICAvLyB0aGlzLl9pbnN0cnVjdGlvbnMgPSBvcHRpb25zLmluc3RydWN0aW9ucyB8fCBfaW5zdHJ1Y3Rpb25zO1xuXG4gICAgLy8gYmluZCBjYWxsYmFja3MgdG8gdGhlIGN1cnJlbnQgaW5zdGFuY2VcbiAgICB0aGlzLl9wb3NpdGlvbkhhbmRsZXIgPSB0aGlzLl9wb3NpdGlvbkhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICB0aGlzLl91bmF2YWlsYWJsZUhhbmRsZXIgPSB0aGlzLl91bmF2YWlsYWJsZUhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICB0aGlzLl92aWV3Q2xpY2tIYW5kbGVyID0gdGhpcy5fdmlld0NsaWNrSGFuZGxlci5iaW5kKHRoaXMpO1xuXG4gICAgLy8gaW5pdCgpXG4gICAgaWYgKHNob3dEaWFsb2cpIHtcbiAgICAgIHRoaXMudmlld0N0b3IgPSBvcHRpb25zLnZpZXdDdG9yIHx8IFNlZ21lbnRlZFZpZXc7XG4gICAgICB0aGlzLmNvbnRlbnQud2FpdGluZyA9IHRydWU7XG4gICAgICB0aGlzLmNvbnRlbnQubGFiZWwgPSBudWxsO1xuICAgICAgaWYgKHRoaXMudmlldykgeyB0aGlzLnZpZXcucmVtb3ZlKCk7IH0gLy8gaW4gYHRoaXMucmVzZXQoKWBcbiAgICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlRGVmYXVsdFZpZXcoKTtcbiAgICB9XG5cbiAgICAvLyB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgbW9kdWxlLlxuICAgKlxuICAgKiBTZW5kIGEgcmVxdWVzdCB0byB0aGUgc2VydmVyIGFuZCBzZXRzIHVwIGxpc3RlbmVycyBmb3IgdGhlIHNlcnZlcidzIHJlc3BvbnNlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgICAvLyBTZW5kIHJlcXVlc3QgdG8gdGhlIHNlcnZlclxuICAgIHRoaXMuc2VuZCgncmVxdWVzdCcpO1xuXG4gICAgLy8gU2V0dXAgbGlzdGVuZXJzIGZvciB0aGUgc2VydmVyJ3MgcmVzcG9uc2VcbiAgICB0aGlzLnJlY2VpdmUoJ3Bvc2l0aW9uJywgdGhpcy5fcG9zaXRpb25IYW5kbGVyKTtcbiAgICB0aGlzLnJlY2VpdmUoJ3VuYXZhaWxhYmxlJywgdGhpcy5fdW5hdmFpbGFibGVIYW5kbGVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldCB0aGUgbW9kdWxlIHRvIGRlZmF1bHQgc3RhdGUuXG4gICAqXG4gICAqIFJlbW92ZSBXZWJTb2NrZXQgYW5kIGNsaWNrIC8gdG91Y2ggbGlzdGVuZXJzLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzZXQoKSB7XG4gICAgc3VwZXIucmVzZXQoKTtcblxuICAgIC8vIFJlbW92ZSBsaXN0ZW5lcnMgZm9yIHRoZSBzZXJ2ZXIncyByZXNwb25zZVxuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ3Bvc2l0aW9uJywgdGhpcy5fcG9zaXRpb25IYW5kbGVyKTtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCd1bmF2YWlsYWJsZScsIHRoaXMuX3VuYXZhaWxhYmxlSGFuZGxlcik7XG5cbiAgICBpZiAodGhpcy52aWV3KSB7IHRoaXMudmlldy5pbnN0YWxsRXZlbnRzKHt9LCB0cnVlKTsgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlc3RhcnRzIHRoZSBtb2R1bGUuXG4gICAqIFNlbmRzIHRoZSBpbmRleCwgbGFiZWwgYW5kIGNvb3JkaW5hdGVzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXN0YXJ0KCkge1xuICAgIHN1cGVyLnJlc3RhcnQoKTtcbiAgICAvLyBTZW5kIGN1cnJlbnQgY2hlY2tpbiBpbmZvcm1hdGlvbiB0byB0aGUgc2VydmVyXG4gICAgdGhpcy5zZW5kKCdyZXN0YXJ0JywgdGhpcy5pbmRleCwgdGhpcy5sYWJlbCwgY2xpZW50LmNvb3JkaW5hdGVzKTtcbiAgICB0aGlzLmRvbmUoKTtcbiAgfVxuXG4gIF9wb3NpdGlvbkhhbmRsZXIoaW5kZXgsIGxhYmVsLCBjb29yZGluYXRlcykge1xuICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICB0aGlzLmxhYmVsID0gbGFiZWw7XG4gICAgY2xpZW50LmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XG5cbiAgICBpZiAodGhpcy52aWV3KSB7XG4gICAgICBjb25zdCBkaXNwbGF5TGFiZWwgPSBsYWJlbCB8fCAoaW5kZXggKyAxKS50b1N0cmluZygpOyAvLyA/XG4gICAgICBjb25zdCBldmVudE5hbWUgPSBjbGllbnQucGxhdGZvcm0uaXNNb2JpbGUgPyAnY2xpY2snIDogJ3RvdWNoc3RhcnQnO1xuXG4gICAgICB0aGlzLmNvbnRlbnQud2FpdGluZyA9IGZhbHNlO1xuICAgICAgdGhpcy5jb250ZW50LmxhYmVsID0gZGlzcGxheUxhYmVsO1xuICAgICAgdGhpcy52aWV3Lmluc3RhbGxFdmVudHMoeyBbZXZlbnROYW1lXTogdGhpcy5fdmlld0NsaWNrSGFuZGxlciB9KTtcbiAgICAgIHRoaXMudmlldy5yZW5kZXIoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kb25lKCk7XG4gICAgfVxuICB9XG5cbiAgX3VuYXZhaWxhYmxlSGFuZGxlcigpIHtcbiAgICB0aGlzLmNvbnRlbnQud2FpdGluZyA9IGZhbHNlO1xuICAgIHRoaXMudmlldy5yZW5kZXIoKTtcbiAgfVxuXG4gIF92aWV3Q2xpY2tIYW5kbGVyKCkge1xuICAgIHRoaXMuZG9uZSgpO1xuICB9XG59XG4iXX0=