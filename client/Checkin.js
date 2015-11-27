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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3NCQUFtQixVQUFVOzs7O3VCQUNWLFVBQVU7Ozs7QUFHN0IsU0FBUyxhQUFhLENBQUMsS0FBSyxFQUFFO0FBQzVCLFNBQU8sY0FBYyxHQUNuQiwyQ0FBMkMsR0FBRyxLQUFLLEdBQUcsZUFBZSxHQUNyRSxnRUFBZ0UsQ0FBQztDQUNwRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWlDb0IsT0FBTztZQUFQLE9BQU87Ozs7Ozs7Ozs7OztBQVVmLFdBVlEsT0FBTyxHQVVBO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFWTCxPQUFPOztBQVd4QiwrQkFYaUIsT0FBTyw2Q0FXbEIsT0FBTyxDQUFDLElBQUksSUFBSSxTQUFTLEVBQUUsT0FBTyxDQUFDLE9BQU8sSUFBSSxJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBRTs7Ozs7OztBQU96RSxRQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDOzs7Ozs7O0FBT2hCLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDOztBQUVsQixRQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxVQUFVLElBQUksS0FBSyxDQUFDO0FBQy9DLFFBQUksQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFDLFlBQVksSUFBSSxhQUFhLENBQUM7O0FBRTNELFFBQUksQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZFLFFBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9ELFFBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQzVEOzs7Ozs7Ozs7ZUFqQ2tCLE9BQU87O1dBeUNyQixpQkFBRztBQUNOLGlDQTFDaUIsT0FBTyx1Q0EwQ1Y7OztBQUdkLDBCQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQyxDQUFDOzs7QUFHcEMsMEJBQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsY0FBYyxFQUFFLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ3pFLDBCQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLGNBQWMsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztLQUN0RTs7Ozs7Ozs7OztXQVFJLGlCQUFHO0FBQ04saUNBM0RpQixPQUFPLHVDQTJEVjs7O0FBR2QsMEJBQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsY0FBYyxFQUFFLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ2hGLDBCQUFPLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLGNBQWMsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQzs7O0FBRzVFLFVBQUksb0JBQU8sUUFBUSxDQUFDLFFBQVEsRUFDMUIsSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsS0FFcEUsSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQ3pFOzs7Ozs7Ozs7V0FPTSxtQkFBRztBQUNSLGlDQTlFaUIsT0FBTyx5Q0E4RVI7OztBQUdoQiwwQkFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLG9CQUFPLFdBQVcsQ0FBQyxDQUFDOztBQUVoRixVQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDYjs7O1dBRXNCLGlDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFO0FBQ2pELFVBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDOztBQUVuQixVQUFJLFdBQVcsRUFDYixvQkFBTyxXQUFXLEdBQUcsV0FBVyxDQUFDOztBQUVuQyxVQUFJLEtBQUssRUFBRTtBQUNULFlBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDOztBQUVuQixZQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDcEIsY0FBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1QyxjQUFJLENBQUMsc0JBQXNCLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRXpDLGNBQUksb0JBQU8sUUFBUSxDQUFDLFFBQVEsRUFDMUIsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsS0FFakUsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ3RFLE1BQU07QUFDTCxjQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDYjtPQUVGLE1BQU07QUFDTCxZQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7T0FDYjtLQUNGOzs7V0FFa0IsK0JBQUc7QUFDcEIsVUFBSSxDQUFDLHNCQUFzQixDQUFDLDRGQUE0RixDQUFDLENBQUM7S0FDM0g7OztXQUVnQiw2QkFBRztBQUNsQixVQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDYjs7O1NBdEhrQixPQUFPOzs7cUJBQVAsT0FBTyIsImZpbGUiOiJzcmMvY2xpZW50L0NoZWNraW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCBNb2R1bGUgZnJvbSAnLi9Nb2R1bGUnO1xuXG5cbmZ1bmN0aW9uIF9pbnN0cnVjdGlvbnMobGFiZWwpIHtcbiAgcmV0dXJuIFwiPHA+R28gdG88L3A+XCIgK1xuICAgIFwiPGRpdiBjbGFzcz0nY2hlY2tpbi1sYWJlbCBjaXJjbGVkJz48c3Bhbj5cIiArIGxhYmVsICsgXCI8L3NwYW4+PC9kaXY+XCIgK1xuICAgIFwiPHA+PHNtYWxsPlRvdWNoIHRoZSBzY3JlZW48YnIvPndoZW4geW91IGFyZSByZWFkeS48L3NtYWxsPjwvcD5cIjtcbn1cblxuLyoqXG4gKiBbY2xpZW50XSBBc3NpZ24gcGxhY2VzIGFtb25nIGEgcHJlZGVmaW5lZCB7QGxpbmsgU2V0dXB9LlxuICogVGhlIG1vZHVsZSByZXF1ZXN0cyBhIHBvc2l0aW9uIHRvIHRoZSBzZXJ2ZXIgYW5kIHdhaXRzIGZvciB0aGUgYW5zd2VyLlxuICpcbiAqIFRoZSBtb2R1bGUgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uIHdoZW4gaXQgcmVjZWl2ZXMgYSBwb3NpdGl2ZSBhbnN3ZXIgZnJvbSB0aGUgc2VydmVyLlxuICogT3RoZXJ3aXNlICgqZS5nLiogbm8gbW9yZSBwb3NpdGlvbnMgYXZhaWxhYmxlKSwgdGhlIG1vZHVsZSBzdGF5cyBpbiBpdHMgc3RhdGUgYW5kIG5ldmVyIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbi5cbiAqXG4gKiBUaGUgbW9kdWxlIGFsd2F5cyBoYXMgYSB2aWV3IGFuZCByZXF1aXJlcyB0aGUgU0FTUyBwYXJ0aWFsIGBfNzctY2hlY2tpbi5zY3NzYC5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9zZXJ2ZXIvQ2hlY2tpbi5qc35DaGVja2lufSBvbiB0aGUgc2VydmVyIHNpZGUuKVxuICpcbiAqIEBleGFtcGxlIGltcG9ydCB7IGNsaWVudCwgQ2hlY2tpbiwgU2V0dXAgfSBmcm9tICdzb3VuZHdvcmtzL2NsaWVudCc7XG4gKlxuICogY29uc3Qgc2V0dXAgPSBuZXcgU2V0dXAoKTtcbiAqIGNvbnN0IGNoZWNraW4gPSBuZXcgQ2hlY2tpbih7IHNldHVwOiBzZXR1cCB9KTtcbiAqIC8vIC4uLiBpbnN0YW50aWF0ZSBvdGhlciBtb2R1bGVzXG4gKlxuICogLy8gSW5pdGlhbGl6ZSB0aGUgY2xpZW50IChpbmRpY2F0ZSB0aGUgY2xpZW50IHR5cGUpXG4gKiBjbGllbnQuaW5pdCgnY2xpZW50VHlwZScpO1xuICpcbiAqIC8vIFN0YXJ0IHRoZSBzY2VuYXJpb1xuICogY2xpZW50LnN0YXJ0KChzZXJpYWwsIHBhcmFsbGVsKSA9PiB7XG4gKiAgIC8vIE1ha2Ugc3VyZSB0aGF0IHRoZSBgc2V0dXBgIGlzIGluaXRpYWxpemVkIGJlZm9yZSBpdCBpcyB1c2VkIGJ5IHRoZVxuICogICAvLyBgY2hlY2tpbmAgbW9kdWxlICg9PiB3ZSB1c2UgdGhlIGBzZXJpYWxgIGZ1bmN0aW9uKS5cbiAqICAgc2VyaWFsKFxuICogICAgIHNldHVwLFxuICogICAgIHBsYWNlcixcbiAqICAgICAvLyAuLi4gb3RoZXIgbW9kdWxlc1xuICogICApXG4gKiB9KTtcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hlY2tpbiBleHRlbmRzIE1vZHVsZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdjaGVja2luJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmhhc1ZpZXc9dHJ1ZV0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIG1vZHVsZSBoYXMgYSB2aWV3IG9yIG5vdC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yPSdibGFjayddIEJhY2tncm91bmQgY29sb3Igb2YgdGhlIGB2aWV3YC5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5zaG93RGlhbG9nPWZhbHNlXSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgdmlldyBkaXNwbGF5cyB0ZXh0IG9yIG5vdC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbihsYWJlbDpTdHJpbmcpIDogU3RyaW5nfSBbb3B0aW9ucy5pbnN0cnVjdGlvbnNdIEZ1bmN0aW9uIHRvIGRpc3BsYXkgdGhlIGluc3RydWN0aW9ucy5cbiAgICogQHRvZG8gZGVmYXVsdCBgaW5zdHJ1Y3Rpb25zYCB2YWx1ZVxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdjaGVja2luJywgb3B0aW9ucy5oYXNWaWV3IHx8IHRydWUsIG9wdGlvbnMuY29sb3IpO1xuXG4gICAgLyoqXG4gICAgICogSW5kZXggZ2l2ZW4gYnkgdGhlIHNlcnZlcnNpZGUge0BsaW5rIHNyYy9zZXJ2ZXIvQ2hlY2tpbi5qc35DaGVja2lufVxuICAgICAqIG1vZHVsZS5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuaW5kZXggPSAtMTtcblxuICAgIC8qKlxuICAgICAqIExhYmVsIG9mIHRoZSBpbmRleCBhc3NpZ25lZCBieSB0aGUgc2VydmVyc2lkZVxuICAgICAqIHtAbGluayBzcmMvc2VydmVyL0NoZWNraW4uanN+Q2hlY2tpbn0gbW9kdWxlIChpZiBhbnkpLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5sYWJlbCA9IG51bGw7XG5cbiAgICB0aGlzLl9zaG93RGlhbG9nID0gb3B0aW9ucy5zaG93RGlhbG9nIHx8IGZhbHNlO1xuICAgIHRoaXMuX2luc3RydWN0aW9ucyA9IG9wdGlvbnMuaW5zdHJ1Y3Rpb25zIHx8IF9pbnN0cnVjdGlvbnM7XG5cbiAgICB0aGlzLl9hY2tub3dsZWRnZW1lbnRIYW5kbGVyID0gdGhpcy5fYWNrbm93bGVkZ2VtZW50SGFuZGxlci5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX3VuYXZhaWxhYmxlSGFuZGxlciA9IHRoaXMuX3VuYXZhaWxhYmxlSGFuZGxlci5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX3ZpZXdDbGlja0hhbmRsZXIgPSB0aGlzLl92aWV3Q2xpY2tIYW5kbGVyLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgdGhlIG1vZHVsZS5cbiAgICpcbiAgICogU2VuZCBhIHJlcXVlc3QgdG8gdGhlIHNlcnZlciBhbmQgc2V0cyB1cCBsaXN0ZW5lcnMgZm9yIHRoZSBzZXJ2ZXIncyByZXNwb25zZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICAvLyBTZW5kIHJlcXVlc3QgdG8gdGhlIHNlcnZlclxuICAgIGNsaWVudC5zZW5kKHRoaXMubmFtZSArICc6cmVxdWVzdCcpO1xuXG4gICAgLy8gU2V0dXAgbGlzdGVuZXJzIGZvciB0aGUgc2VydmVyJ3MgcmVzcG9uc2VcbiAgICBjbGllbnQucmVjZWl2ZSh0aGlzLm5hbWUgKyAnOmFja25vd2xlZGdlJywgdGhpcy5fYWNrbm93bGVkZ2VtZW50SGFuZGxlcik7XG4gICAgY2xpZW50LnJlY2VpdmUodGhpcy5uYW1lICsgJzp1bmF2YWlsYWJsZScsIHRoaXMuX3VuYXZhaWxhYmxlSGFuZGxlcik7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXQgdGhlIG1vZHVsZSB0byBkZWZhdWx0IHN0YXRlLlxuICAgKlxuICAgKiBSZW1vdmUgV2ViU29ja2V0IGFuZCBjbGljayAvIHRvdWNoIGxpc3RlbmVycy5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlc2V0KCkge1xuICAgIHN1cGVyLnJlc2V0KCk7XG5cbiAgICAvLyBSZW1vdmUgbGlzdGVuZXJzIGZvciB0aGUgc2VydmVyJ3MgcmVzcG9uc2VcbiAgICBjbGllbnQucmVtb3ZlTGlzdGVuZXIodGhpcy5uYW1lICsgJzphY2tub3dsZWRnZScsIHRoaXMuX2Fja25vd2xlZGdlbWVudEhhbmRsZXIpO1xuICAgIGNsaWVudC5yZW1vdmVMaXN0ZW5lcih0aGlzLm5hbWUgKyAnOnVuYXZhaWxhYmxlJywgdGhpcy5fdW5hdmFpbGFibGVIYW5kbGVyKTtcblxuICAgIC8vIFJlbW92ZSB0b3VjaCAvIGNsaWNrIGxpc3RlbmVyIHNldCB1biBpbiB0aGUgYF9hY2tub3dsZWRnZW1lbnRIYW5kbGVyYFxuICAgIGlmIChjbGllbnQucGxhdGZvcm0uaXNNb2JpbGUpXG4gICAgICB0aGlzLnZpZXcucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuX3ZpZXdDbGlja0hhbmRsZXIpO1xuICAgIGVsc2VcbiAgICAgIHRoaXMudmlldy5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX3ZpZXdDbGlja0hhbmRsZXIsIGZhbHNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN0YXJ0cyB0aGUgbW9kdWxlLlxuICAgKiBTZW5kcyB0aGUgaW5kZXgsIGxhYmVsIGFuZCBjb29yZGluYXRlcyB0byB0aGUgc2VydmVyLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzdGFydCgpIHtcbiAgICBzdXBlci5yZXN0YXJ0KCk7XG5cbiAgICAvLyBTZW5kIGN1cnJlbnQgY2hlY2tpbiBpbmZvcm1hdGlvbiB0byB0aGUgc2VydmVyXG4gICAgY2xpZW50LnNlbmQodGhpcy5uYW1lICsgJzpyZXN0YXJ0JywgdGhpcy5pbmRleCwgdGhpcy5sYWJlbCwgY2xpZW50LmNvb3JkaW5hdGVzKTtcblxuICAgIHRoaXMuZG9uZSgpO1xuICB9XG5cbiAgX2Fja25vd2xlZGdlbWVudEhhbmRsZXIoaW5kZXgsIGxhYmVsLCBjb29yZGluYXRlcykge1xuICAgIHRoaXMuaW5kZXggPSBpbmRleDtcblxuICAgIGlmIChjb29yZGluYXRlcylcbiAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuXG4gICAgaWYgKGxhYmVsKSB7XG4gICAgICB0aGlzLmxhYmVsID0gbGFiZWw7XG5cbiAgICAgIGlmICh0aGlzLl9zaG93RGlhbG9nKSB7XG4gICAgICAgIGxldCBodG1sQ29udGVudCA9IHRoaXMuX2luc3RydWN0aW9ucyhsYWJlbCk7XG4gICAgICAgIHRoaXMuc2V0Q2VudGVyZWRWaWV3Q29udGVudChodG1sQ29udGVudCk7XG5cbiAgICAgICAgaWYgKGNsaWVudC5wbGF0Zm9ybS5pc01vYmlsZSlcbiAgICAgICAgICB0aGlzLnZpZXcuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuX3ZpZXdDbGlja0hhbmRsZXIpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgdGhpcy52aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fdmlld0NsaWNrSGFuZGxlciwgZmFsc2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kb25lKCk7XG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kb25lKCk7XG4gICAgfVxuICB9XG5cbiAgX3VuYXZhaWxhYmxlSGFuZGxlcigpIHtcbiAgICB0aGlzLnNldENlbnRlcmVkVmlld0NvbnRlbnQoXCI8cD5Tb3JyeSwgd2UgY2Fubm90IGFjY2VwdCBhbnkgbW9yZSBjb25uZWN0aW9ucyBhdCB0aGUgbW9tZW50LCBwbGVhc2UgdHJ5IGFnYWluIGxhdGVyLjwvcD5cIik7XG4gIH1cblxuICBfdmlld0NsaWNrSGFuZGxlcigpIHtcbiAgICB0aGlzLmRvbmUoKTtcbiAgfVxufVxuIl19