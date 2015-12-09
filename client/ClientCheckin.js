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
    this._acknowledgementHandler = this._acknowledgementHandler.bind(this);
    this._unavailableHandler = this._unavailableHandler.bind(this);
    this._viewClickHandler = this._viewClickHandler.bind(this);

    // init()
    if (showDialog) {
      this.content.waiting = true;
      this.content.label = null;
      if (this.view) {
        this.view.remove();
      } // in `this.reset()`
      this.view = this.createDefaultView();
    }

    this.init();
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
      this.receive('acknowledge', this._acknowledgementHandler);
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
      this.removeListener('acknowledge', this._acknowledgementHandler);
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
    key: '_acknowledgementHandler',
    value: function _acknowledgementHandler(index, label, coordinates) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBQW1CLFVBQVU7Ozs7NkJBQ0osZ0JBQWdCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXdCcEIsYUFBYTtZQUFiLGFBQWE7Ozs7Ozs7Ozs7OztBQVVyQixXQVZRLGFBQWEsR0FVTjtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBVkwsYUFBYTs7QUFXOUIsK0JBWGlCLGFBQWEsNkNBV3hCLE9BQU8sQ0FBQyxJQUFJLElBQUksU0FBUyxFQUFFLE9BQU8sQ0FBQyxPQUFPLElBQUksSUFBSSxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUU7Ozs7Ozs7QUFPekUsUUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQzs7Ozs7OztBQU9oQixRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQzs7QUFFbEIsUUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLFVBQVUsSUFBSSxLQUFLLENBQUM7Ozs7QUFJL0MsUUFBSSxDQUFDLHVCQUF1QixHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkUsUUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDL0QsUUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7OztBQUczRCxRQUFJLFVBQVUsRUFBRTtBQUNkLFVBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztBQUM1QixVQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDMUIsVUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQUUsWUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztPQUFFO0FBQ3RDLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7S0FDdEM7O0FBRUQsUUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0dBQ2I7Ozs7Ozs7OztlQTVDa0IsYUFBYTs7V0FvRDNCLGlCQUFHO0FBQ04saUNBckRpQixhQUFhLHVDQXFEaEI7O0FBRWQsVUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzs7O0FBR3JCLFVBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQzFELFVBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0tBQ3ZEOzs7Ozs7Ozs7O1dBUUksaUJBQUc7QUFDTixpQ0FyRWlCLGFBQWEsdUNBcUVoQjs7O0FBR2QsVUFBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDakUsVUFBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7O0FBRTdELFVBQUksSUFBSSxDQUFDLElBQUksRUFBRTtBQUFFLFlBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztPQUFFO0tBQ3REOzs7Ozs7Ozs7V0FPTSxtQkFBRztBQUNSLGlDQXBGaUIsYUFBYSx5Q0FvRmQ7O0FBRWhCLFVBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxvQkFBTyxXQUFXLENBQUMsQ0FBQztBQUNqRSxVQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDYjs7O1dBRXNCLGlDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFO0FBQ2pELFVBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ25CLFVBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ25CLDBCQUFPLFdBQVcsR0FBRyxXQUFXLENBQUM7O0FBRWpDLFVBQUksSUFBSSxDQUFDLElBQUksRUFBRTtBQUNiLFlBQU0sWUFBWSxHQUFHLEtBQUssSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUEsQ0FBRSxRQUFRLEVBQUUsQ0FBQztBQUNyRCxZQUFNLFNBQVMsR0FBRyxvQkFBTyxRQUFRLENBQUMsUUFBUSxHQUFHLE9BQU8sR0FBRyxZQUFZLENBQUM7O0FBRXBFLFlBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztBQUM3QixZQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxZQUFZLENBQUM7QUFDbEMsWUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLHFCQUFJLFNBQVMsRUFBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUcsQ0FBQztBQUNqRSxZQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO09BQ3BCLE1BQU07QUFDTCxZQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7T0FDYjtLQUNGOzs7V0FFa0IsK0JBQUc7QUFDcEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0FBQzdCLFVBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDcEI7OztXQUVnQiw2QkFBRztBQUNsQixVQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDYjs7O1NBbkhrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiJzcmMvY2xpZW50L0NsaWVudENoZWNraW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCBDbGllbnRNb2R1bGUgZnJvbSAnLi9DbGllbnRNb2R1bGUnO1xuXG5cbi8vIGZ1bmN0aW9uIF9pbnN0cnVjdGlvbnMobGFiZWwpIHtcbi8vICAgcmV0dXJuIGBcbi8vICAgICA8cD5HbyB0bzwvcD5cbi8vICAgICA8ZGl2IGNsYXNzPVwiY2hlY2tpbi1sYWJlbCBjaXJjbGVkXCI+PHNwYW4+JHtsYWJlbH08L3NwYW4+PC9kaXY+XG4vLyAgICAgPHA+PHNtYWxsPlRvdWNoIHRoZSBzY3JlZW48YnIvPndoZW4geW91IGFyZSByZWFkeS48L3NtYWxsPjwvcD5cbi8vICAgYDtcbi8vIH1cblxuLyoqXG4gKiBbY2xpZW50XSBBc3NpZ24gcGxhY2VzIGFtb25nIGEgc2V0IG9mIHByZWRlZmluZWQgcG9zaXRpb25zIChpLmUuIGxhYmVscyBhbmQvb3IgY29vcmRpbmF0ZXMpLlxuICogVGhlIG1vZHVsZSByZXF1ZXN0cyBhIHBvc2l0aW9uIHRvIHRoZSBzZXJ2ZXIgYW5kIHdhaXRzIGZvciB0aGUgYW5zd2VyLlxuICpcbiAqIFRoZSBtb2R1bGUgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uIHdoZW4gaXQgcmVjZWl2ZXMgYSBwb3NpdGl2ZSBhbnN3ZXIgZnJvbSB0aGUgc2VydmVyLlxuICogT3RoZXJ3aXNlICgqZS5nLiogbm8gbW9yZSBwb3NpdGlvbnMgYXZhaWxhYmxlKSwgdGhlIG1vZHVsZSBzdGF5cyBpbiBpdHMgc3RhdGUgYW5kIG5ldmVyIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbi5cbiAqXG4gKiBUaGUgbW9kdWxlIGFsd2F5cyBoYXMgYSB2aWV3IGFuZCByZXF1aXJlcyB0aGUgU0FTUyBwYXJ0aWFsIGBfNzctY2hlY2tpbi5zY3NzYC5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9zZXJ2ZXIvU2VydmVyQ2hlY2tpbi5qc35TZXJ2ZXJDaGVja2lufSBvbiB0aGUgc2VydmVyIHNpZGUuKVxuICpcbiAqIEBleGFtcGxlICAqIGNvbnN0IGNoZWNraW4gPSBuZXcgQ2xpZW50Q2hlY2tpbih7IGNhcGFjaXR5OiAxMDAgfSk7XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudENoZWNraW4gZXh0ZW5kcyBDbGllbnRNb2R1bGUge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nY2hlY2tpbiddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5oYXNWaWV3PXRydWVdIEluZGljYXRlcyB3aGV0aGVyIHRoZSBtb2R1bGUgaGFzIGEgdmlldyBvciBub3QuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nYmxhY2snXSBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBgdmlld2AuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuc2hvd0RpYWxvZz1mYWxzZV0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHZpZXcgZGlzcGxheXMgdGV4dCBvciBub3QuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb24obGFiZWw6U3RyaW5nKSA6IFN0cmluZ30gW29wdGlvbnMuaW5zdHJ1Y3Rpb25zXSBGdW5jdGlvbiB0byBkaXNwbGF5IHRoZSBpbnN0cnVjdGlvbnMuXG4gICAqIEB0b2RvIGRlZmF1bHQgYGluc3RydWN0aW9uc2AgdmFsdWVcbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnY2hlY2tpbicsIG9wdGlvbnMuaGFzVmlldyB8fCB0cnVlLCBvcHRpb25zLmNvbG9yKTtcblxuICAgIC8qKlxuICAgICAqIEluZGV4IGdpdmVuIGJ5IHRoZSBzZXJ2ZXJzaWRlIHtAbGluayBzcmMvc2VydmVyL1NlcnZlckNoZWNraW4uanN+U2VydmVyQ2hlY2tpbn1cbiAgICAgKiBtb2R1bGUuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmluZGV4ID0gLTE7XG5cbiAgICAvKipcbiAgICAgKiBMYWJlbCBvZiB0aGUgaW5kZXggYXNzaWduZWQgYnkgdGhlIHNlcnZlcnNpZGVcbiAgICAgKiB7QGxpbmsgc3JjL3NlcnZlci9DaGVja2luLmpzfkNoZWNraW59IG1vZHVsZSAoaWYgYW55KS5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMubGFiZWwgPSBudWxsO1xuXG4gICAgY29uc3Qgc2hvd0RpYWxvZyA9IG9wdGlvbnMuc2hvd0RpYWxvZyB8fCBmYWxzZTtcbiAgICAvLyB0aGlzLl9pbnN0cnVjdGlvbnMgPSBvcHRpb25zLmluc3RydWN0aW9ucyB8fCBfaW5zdHJ1Y3Rpb25zO1xuXG4gICAgLy8gYmluZCBjYWxsYmFja3MgdG8gdGhlIGN1cnJlbnQgaW5zdGFuY2VcbiAgICB0aGlzLl9hY2tub3dsZWRnZW1lbnRIYW5kbGVyID0gdGhpcy5fYWNrbm93bGVkZ2VtZW50SGFuZGxlci5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX3VuYXZhaWxhYmxlSGFuZGxlciA9IHRoaXMuX3VuYXZhaWxhYmxlSGFuZGxlci5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX3ZpZXdDbGlja0hhbmRsZXIgPSB0aGlzLl92aWV3Q2xpY2tIYW5kbGVyLmJpbmQodGhpcyk7XG5cbiAgICAvLyBpbml0KClcbiAgICBpZiAoc2hvd0RpYWxvZykge1xuICAgICAgdGhpcy5jb250ZW50LndhaXRpbmcgPSB0cnVlO1xuICAgICAgdGhpcy5jb250ZW50LmxhYmVsID0gbnVsbDtcbiAgICAgIGlmICh0aGlzLnZpZXcpIHsgdGhpcy52aWV3LnJlbW92ZSgpOyB9IC8vIGluIGB0aGlzLnJlc2V0KClgXG4gICAgICB0aGlzLnZpZXcgPSB0aGlzLmNyZWF0ZURlZmF1bHRWaWV3KCk7XG4gICAgfVxuXG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgdGhlIG1vZHVsZS5cbiAgICpcbiAgICogU2VuZCBhIHJlcXVlc3QgdG8gdGhlIHNlcnZlciBhbmQgc2V0cyB1cCBsaXN0ZW5lcnMgZm9yIHRoZSBzZXJ2ZXIncyByZXNwb25zZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG4gICAgLy8gU2VuZCByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXJcbiAgICB0aGlzLnNlbmQoJ3JlcXVlc3QnKTtcblxuICAgIC8vIFNldHVwIGxpc3RlbmVycyBmb3IgdGhlIHNlcnZlcidzIHJlc3BvbnNlXG4gICAgdGhpcy5yZWNlaXZlKCdhY2tub3dsZWRnZScsIHRoaXMuX2Fja25vd2xlZGdlbWVudEhhbmRsZXIpO1xuICAgIHRoaXMucmVjZWl2ZSgndW5hdmFpbGFibGUnLCB0aGlzLl91bmF2YWlsYWJsZUhhbmRsZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IHRoZSBtb2R1bGUgdG8gZGVmYXVsdCBzdGF0ZS5cbiAgICpcbiAgICogUmVtb3ZlIFdlYlNvY2tldCBhbmQgY2xpY2sgLyB0b3VjaCBsaXN0ZW5lcnMuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXNldCgpIHtcbiAgICBzdXBlci5yZXNldCgpO1xuXG4gICAgLy8gUmVtb3ZlIGxpc3RlbmVycyBmb3IgdGhlIHNlcnZlcidzIHJlc3BvbnNlXG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignYWNrbm93bGVkZ2UnLCB0aGlzLl9hY2tub3dsZWRnZW1lbnRIYW5kbGVyKTtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCd1bmF2YWlsYWJsZScsIHRoaXMuX3VuYXZhaWxhYmxlSGFuZGxlcik7XG5cbiAgICBpZiAodGhpcy52aWV3KSB7IHRoaXMudmlldy5pbnN0YWxsRXZlbnRzKHt9LCB0cnVlKTsgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlc3RhcnRzIHRoZSBtb2R1bGUuXG4gICAqIFNlbmRzIHRoZSBpbmRleCwgbGFiZWwgYW5kIGNvb3JkaW5hdGVzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXN0YXJ0KCkge1xuICAgIHN1cGVyLnJlc3RhcnQoKTtcbiAgICAvLyBTZW5kIGN1cnJlbnQgY2hlY2tpbiBpbmZvcm1hdGlvbiB0byB0aGUgc2VydmVyXG4gICAgdGhpcy5zZW5kKCdyZXN0YXJ0JywgdGhpcy5pbmRleCwgdGhpcy5sYWJlbCwgY2xpZW50LmNvb3JkaW5hdGVzKTtcbiAgICB0aGlzLmRvbmUoKTtcbiAgfVxuXG4gIF9hY2tub3dsZWRnZW1lbnRIYW5kbGVyKGluZGV4LCBsYWJlbCwgY29vcmRpbmF0ZXMpIHtcbiAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgdGhpcy5sYWJlbCA9IGxhYmVsO1xuICAgIGNsaWVudC5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuXG4gICAgaWYgKHRoaXMudmlldykge1xuICAgICAgY29uc3QgZGlzcGxheUxhYmVsID0gbGFiZWwgfHwgKGluZGV4ICsgMSkudG9TdHJpbmcoKTsgLy8gP1xuICAgICAgY29uc3QgZXZlbnROYW1lID0gY2xpZW50LnBsYXRmb3JtLmlzTW9iaWxlID8gJ2NsaWNrJyA6ICd0b3VjaHN0YXJ0JztcblxuICAgICAgdGhpcy5jb250ZW50LndhaXRpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMuY29udGVudC5sYWJlbCA9IGRpc3BsYXlMYWJlbDtcbiAgICAgIHRoaXMudmlldy5pbnN0YWxsRXZlbnRzKHsgW2V2ZW50TmFtZV06IHRoaXMuX3ZpZXdDbGlja0hhbmRsZXIgfSk7XG4gICAgICB0aGlzLnZpZXcucmVuZGVyKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZG9uZSgpO1xuICAgIH1cbiAgfVxuXG4gIF91bmF2YWlsYWJsZUhhbmRsZXIoKSB7XG4gICAgdGhpcy5jb250ZW50LndhaXRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLnZpZXcucmVuZGVyKCk7XG4gIH1cblxuICBfdmlld0NsaWNrSGFuZGxlcigpIHtcbiAgICB0aGlzLmRvbmUoKTtcbiAgfVxufVxuIl19