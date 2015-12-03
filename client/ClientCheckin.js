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
 * (See also {@link src/server/ServerCheckin.js~ServerCheckin} on the server side.)
 *
 * @example const setup = new ClientSetup();
 * const checkin = new ClientCheckin({ setup: setup });
 */

var ClientCheckin = (function (_Module) {
  _inherits(ClientCheckin, _Module);

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

  _createClass(ClientCheckin, [{
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(ClientCheckin.prototype), 'start', this).call(this);

      // Send request to the server
      // client.send(this.name + ':request');
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
      _get(Object.getPrototypeOf(ClientCheckin.prototype), 'restart', this).call(this);
      // Send current checkin information to the server
      this.send('restart', this.index, this.label, _client2['default'].coordinates);
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
      this.setCenteredViewContent('<p>Sorry, we cannot accept any more connections at the moment, please try again later.</p>');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3NCQUFtQixVQUFVOzs7O3VCQUNWLFVBQVU7Ozs7QUFHN0IsU0FBUyxhQUFhLENBQUMsS0FBSyxFQUFFO0FBQzVCLCtFQUU2QyxLQUFLLDJGQUVoRDtDQUNIOzs7Ozs7Ozs7Ozs7Ozs7OztJQWdCb0IsYUFBYTtZQUFiLGFBQWE7Ozs7Ozs7Ozs7OztBQVVyQixXQVZRLGFBQWEsR0FVTjtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBVkwsYUFBYTs7QUFXOUIsK0JBWGlCLGFBQWEsNkNBV3hCLE9BQU8sQ0FBQyxJQUFJLElBQUksU0FBUyxFQUFFLE9BQU8sQ0FBQyxPQUFPLElBQUksSUFBSSxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUU7Ozs7Ozs7QUFPekUsUUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQzs7Ozs7OztBQU9oQixRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQzs7QUFFbEIsUUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsVUFBVSxJQUFJLEtBQUssQ0FBQztBQUMvQyxRQUFJLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxZQUFZLElBQUksYUFBYSxDQUFDOztBQUUzRCxRQUFJLENBQUMsdUJBQXVCLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2RSxRQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMvRCxRQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUM1RDs7Ozs7Ozs7O2VBakNrQixhQUFhOztXQXlDM0IsaUJBQUc7QUFDTixpQ0ExQ2lCLGFBQWEsdUNBMENoQjs7OztBQUlkLFVBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7OztBQUdyQixVQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUMxRCxVQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztLQUN2RDs7Ozs7Ozs7OztXQVFJLGlCQUFHO0FBQ04saUNBNURpQixhQUFhLHVDQTREaEI7OztBQUdkLFVBQUksQ0FBQyxjQUFjLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ2pFLFVBQUksQ0FBQyxjQUFjLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOzs7QUFHN0QsVUFBSSxvQkFBTyxRQUFRLENBQUMsUUFBUSxFQUMxQixJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxLQUVwRSxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDekU7Ozs7Ozs7OztXQU9NLG1CQUFHO0FBQ1IsaUNBL0VpQixhQUFhLHlDQStFZDs7QUFFaEIsVUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLG9CQUFPLFdBQVcsQ0FBQyxDQUFDO0FBQ2pFLFVBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNiOzs7V0FFc0IsaUNBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUU7QUFDakQsVUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7O0FBRW5CLFVBQUksV0FBVyxFQUNiLG9CQUFPLFdBQVcsR0FBRyxXQUFXLENBQUM7O0FBRW5DLFVBQUksS0FBSyxFQUFFO0FBQ1QsWUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7O0FBRW5CLFlBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtBQUNwQixjQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzVDLGNBQUksQ0FBQyxzQkFBc0IsQ0FBQyxXQUFXLENBQUMsQ0FBQzs7QUFFekMsY0FBSSxvQkFBTyxRQUFRLENBQUMsUUFBUSxFQUMxQixJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxLQUVqRSxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDdEUsTUFBTTtBQUNMLGNBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNiO09BRUYsTUFBTTtBQUNMLFlBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztPQUNiO0tBQ0Y7OztXQUVrQiwrQkFBRztBQUNwQixVQUFJLENBQUMsc0JBQXNCLENBQUMsNEZBQTRGLENBQUMsQ0FBQztLQUMzSDs7O1dBRWdCLDZCQUFHO0FBQ2xCLFVBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNiOzs7U0FySGtCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6InNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IE1vZHVsZSBmcm9tICcuL01vZHVsZSc7XG5cblxuZnVuY3Rpb24gX2luc3RydWN0aW9ucyhsYWJlbCkge1xuICByZXR1cm4gYFxuICAgIDxwPkdvIHRvPC9wPlxuICAgIDxkaXYgY2xhc3M9XCJjaGVja2luLWxhYmVsIGNpcmNsZWRcIj48c3Bhbj4ke2xhYmVsfTwvc3Bhbj48L2Rpdj5cbiAgICA8cD48c21hbGw+VG91Y2ggdGhlIHNjcmVlbjxici8+d2hlbiB5b3UgYXJlIHJlYWR5Ljwvc21hbGw+PC9wPlxuICBgO1xufVxuXG4vKipcbiAqIFtjbGllbnRdIEFzc2lnbiBwbGFjZXMgYW1vbmcgYSBwcmVkZWZpbmVkIHtAbGluayBTZXR1cH0uXG4gKiBUaGUgbW9kdWxlIHJlcXVlc3RzIGEgcG9zaXRpb24gdG8gdGhlIHNlcnZlciBhbmQgd2FpdHMgZm9yIHRoZSBhbnN3ZXIuXG4gKlxuICogVGhlIG1vZHVsZSBmaW5pc2hlcyBpdHMgaW5pdGlhbGl6YXRpb24gd2hlbiBpdCByZWNlaXZlcyBhIHBvc2l0aXZlIGFuc3dlciBmcm9tIHRoZSBzZXJ2ZXIuXG4gKiBPdGhlcndpc2UgKCplLmcuKiBubyBtb3JlIHBvc2l0aW9ucyBhdmFpbGFibGUpLCB0aGUgbW9kdWxlIHN0YXlzIGluIGl0cyBzdGF0ZSBhbmQgbmV2ZXIgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uLlxuICpcbiAqIFRoZSBtb2R1bGUgYWx3YXlzIGhhcyBhIHZpZXcgYW5kIHJlcXVpcmVzIHRoZSBTQVNTIHBhcnRpYWwgYF83Ny1jaGVja2luLnNjc3NgLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL3NlcnZlci9TZXJ2ZXJDaGVja2luLmpzflNlcnZlckNoZWNraW59IG9uIHRoZSBzZXJ2ZXIgc2lkZS4pXG4gKlxuICogQGV4YW1wbGUgY29uc3Qgc2V0dXAgPSBuZXcgQ2xpZW50U2V0dXAoKTtcbiAqIGNvbnN0IGNoZWNraW4gPSBuZXcgQ2xpZW50Q2hlY2tpbih7IHNldHVwOiBzZXR1cCB9KTtcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50Q2hlY2tpbiBleHRlbmRzIE1vZHVsZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdjaGVja2luJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmhhc1ZpZXc9dHJ1ZV0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIG1vZHVsZSBoYXMgYSB2aWV3IG9yIG5vdC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yPSdibGFjayddIEJhY2tncm91bmQgY29sb3Igb2YgdGhlIGB2aWV3YC5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5zaG93RGlhbG9nPWZhbHNlXSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgdmlldyBkaXNwbGF5cyB0ZXh0IG9yIG5vdC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbihsYWJlbDpTdHJpbmcpIDogU3RyaW5nfSBbb3B0aW9ucy5pbnN0cnVjdGlvbnNdIEZ1bmN0aW9uIHRvIGRpc3BsYXkgdGhlIGluc3RydWN0aW9ucy5cbiAgICogQHRvZG8gZGVmYXVsdCBgaW5zdHJ1Y3Rpb25zYCB2YWx1ZVxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdjaGVja2luJywgb3B0aW9ucy5oYXNWaWV3IHx8IHRydWUsIG9wdGlvbnMuY29sb3IpO1xuXG4gICAgLyoqXG4gICAgICogSW5kZXggZ2l2ZW4gYnkgdGhlIHNlcnZlcnNpZGUge0BsaW5rIHNyYy9zZXJ2ZXIvU2VydmVyQ2hlY2tpbi5qc35TZXJ2ZXJDaGVja2lufVxuICAgICAqIG1vZHVsZS5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuaW5kZXggPSAtMTtcblxuICAgIC8qKlxuICAgICAqIExhYmVsIG9mIHRoZSBpbmRleCBhc3NpZ25lZCBieSB0aGUgc2VydmVyc2lkZVxuICAgICAqIHtAbGluayBzcmMvc2VydmVyL0NoZWNraW4uanN+Q2hlY2tpbn0gbW9kdWxlIChpZiBhbnkpLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5sYWJlbCA9IG51bGw7XG5cbiAgICB0aGlzLl9zaG93RGlhbG9nID0gb3B0aW9ucy5zaG93RGlhbG9nIHx8IGZhbHNlO1xuICAgIHRoaXMuX2luc3RydWN0aW9ucyA9IG9wdGlvbnMuaW5zdHJ1Y3Rpb25zIHx8IF9pbnN0cnVjdGlvbnM7XG5cbiAgICB0aGlzLl9hY2tub3dsZWRnZW1lbnRIYW5kbGVyID0gdGhpcy5fYWNrbm93bGVkZ2VtZW50SGFuZGxlci5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX3VuYXZhaWxhYmxlSGFuZGxlciA9IHRoaXMuX3VuYXZhaWxhYmxlSGFuZGxlci5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX3ZpZXdDbGlja0hhbmRsZXIgPSB0aGlzLl92aWV3Q2xpY2tIYW5kbGVyLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgdGhlIG1vZHVsZS5cbiAgICpcbiAgICogU2VuZCBhIHJlcXVlc3QgdG8gdGhlIHNlcnZlciBhbmQgc2V0cyB1cCBsaXN0ZW5lcnMgZm9yIHRoZSBzZXJ2ZXIncyByZXNwb25zZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICAvLyBTZW5kIHJlcXVlc3QgdG8gdGhlIHNlcnZlclxuICAgIC8vIGNsaWVudC5zZW5kKHRoaXMubmFtZSArICc6cmVxdWVzdCcpO1xuICAgIHRoaXMuc2VuZCgncmVxdWVzdCcpO1xuXG4gICAgLy8gU2V0dXAgbGlzdGVuZXJzIGZvciB0aGUgc2VydmVyJ3MgcmVzcG9uc2VcbiAgICB0aGlzLnJlY2VpdmUoJ2Fja25vd2xlZGdlJywgdGhpcy5fYWNrbm93bGVkZ2VtZW50SGFuZGxlcik7XG4gICAgdGhpcy5yZWNlaXZlKCd1bmF2YWlsYWJsZScsIHRoaXMuX3VuYXZhaWxhYmxlSGFuZGxlcik7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXQgdGhlIG1vZHVsZSB0byBkZWZhdWx0IHN0YXRlLlxuICAgKlxuICAgKiBSZW1vdmUgV2ViU29ja2V0IGFuZCBjbGljayAvIHRvdWNoIGxpc3RlbmVycy5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlc2V0KCkge1xuICAgIHN1cGVyLnJlc2V0KCk7XG5cbiAgICAvLyBSZW1vdmUgbGlzdGVuZXJzIGZvciB0aGUgc2VydmVyJ3MgcmVzcG9uc2VcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdhY2tub3dsZWRnZScsIHRoaXMuX2Fja25vd2xlZGdlbWVudEhhbmRsZXIpO1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ3VuYXZhaWxhYmxlJywgdGhpcy5fdW5hdmFpbGFibGVIYW5kbGVyKTtcblxuICAgIC8vIFJlbW92ZSB0b3VjaCAvIGNsaWNrIGxpc3RlbmVyIHNldCB1biBpbiB0aGUgYF9hY2tub3dsZWRnZW1lbnRIYW5kbGVyYFxuICAgIGlmIChjbGllbnQucGxhdGZvcm0uaXNNb2JpbGUpXG4gICAgICB0aGlzLnZpZXcucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuX3ZpZXdDbGlja0hhbmRsZXIpO1xuICAgIGVsc2VcbiAgICAgIHRoaXMudmlldy5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX3ZpZXdDbGlja0hhbmRsZXIsIGZhbHNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN0YXJ0cyB0aGUgbW9kdWxlLlxuICAgKiBTZW5kcyB0aGUgaW5kZXgsIGxhYmVsIGFuZCBjb29yZGluYXRlcyB0byB0aGUgc2VydmVyLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzdGFydCgpIHtcbiAgICBzdXBlci5yZXN0YXJ0KCk7XG4gICAgLy8gU2VuZCBjdXJyZW50IGNoZWNraW4gaW5mb3JtYXRpb24gdG8gdGhlIHNlcnZlclxuICAgIHRoaXMuc2VuZCgncmVzdGFydCcsIHRoaXMuaW5kZXgsIHRoaXMubGFiZWwsIGNsaWVudC5jb29yZGluYXRlcyk7XG4gICAgdGhpcy5kb25lKCk7XG4gIH1cblxuICBfYWNrbm93bGVkZ2VtZW50SGFuZGxlcihpbmRleCwgbGFiZWwsIGNvb3JkaW5hdGVzKSB7XG4gICAgdGhpcy5pbmRleCA9IGluZGV4O1xuXG4gICAgaWYgKGNvb3JkaW5hdGVzKVxuICAgICAgY2xpZW50LmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XG5cbiAgICBpZiAobGFiZWwpIHtcbiAgICAgIHRoaXMubGFiZWwgPSBsYWJlbDtcblxuICAgICAgaWYgKHRoaXMuX3Nob3dEaWFsb2cpIHtcbiAgICAgICAgbGV0IGh0bWxDb250ZW50ID0gdGhpcy5faW5zdHJ1Y3Rpb25zKGxhYmVsKTtcbiAgICAgICAgdGhpcy5zZXRDZW50ZXJlZFZpZXdDb250ZW50KGh0bWxDb250ZW50KTtcblxuICAgICAgICBpZiAoY2xpZW50LnBsYXRmb3JtLmlzTW9iaWxlKVxuICAgICAgICAgIHRoaXMudmlldy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5fdmlld0NsaWNrSGFuZGxlcik7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICB0aGlzLnZpZXcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl92aWV3Q2xpY2tIYW5kbGVyLCBmYWxzZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRvbmUoKTtcbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRvbmUoKTtcbiAgICB9XG4gIH1cblxuICBfdW5hdmFpbGFibGVIYW5kbGVyKCkge1xuICAgIHRoaXMuc2V0Q2VudGVyZWRWaWV3Q29udGVudCgnPHA+U29ycnksIHdlIGNhbm5vdCBhY2NlcHQgYW55IG1vcmUgY29ubmVjdGlvbnMgYXQgdGhlIG1vbWVudCwgcGxlYXNlIHRyeSBhZ2FpbiBsYXRlci48L3A+Jyk7XG4gIH1cblxuICBfdmlld0NsaWNrSGFuZGxlcigpIHtcbiAgICB0aGlzLmRvbmUoKTtcbiAgfVxufVxuIl19