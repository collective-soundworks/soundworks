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

/**
 * Assign places among a set of predefined positions (i.e. labels and/or coordinates).
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

    this._showDialog = options.showDialog || false;
    this.viewCtor = options.viewCtor || _displaySegmentedView2['default'];
    // bind callbacks to the current instance
    this._positionHandler = this._positionHandler.bind(this);
    this._unavailableHandler = this._unavailableHandler.bind(this);
    this._viewClickHandler = this._viewClickHandler.bind(this);

    this.init();
  }

  _createClass(ClientCheckin, [{
    key: 'init',
    value: function init() {

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

      if (this._showDialog) {
        this.content.waiting = true;
        this.content.label = null;
        this.view = this.createDefaultView();
      }
    }

    /**
     * Start the module.
     *
     * Send a request to the server and sets up listeners for the server's response.
     * @private
     */
  }, {
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
        var displayLabel = label || (index + 1).toString();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBQW1CLFVBQVU7Ozs7NkJBQ0osZ0JBQWdCOzs7O29DQUNmLHlCQUF5Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBZTlCLGFBQWE7WUFBYixhQUFhOzs7Ozs7Ozs7Ozs7QUFVckIsV0FWUSxhQUFhLEdBVU47UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQVZMLGFBQWE7O0FBVzlCLCtCQVhpQixhQUFhLDZDQVd4QixPQUFPLENBQUMsSUFBSSxJQUFJLFNBQVMsRUFBRSxPQUFPLENBQUMsT0FBTyxJQUFJLElBQUksRUFBRSxPQUFPLENBQUMsS0FBSyxFQUFFOztBQUV6RSxRQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxVQUFVLElBQUksS0FBSyxDQUFDO0FBQy9DLFFBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEscUNBQWlCLENBQUM7O0FBRWxELFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pELFFBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9ELFFBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUUzRCxRQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7R0FDYjs7ZUFyQmtCLGFBQWE7O1dBdUI1QixnQkFBRzs7Ozs7OztBQU9MLFVBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7QUFPaEIsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRWxCLFVBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtBQUNwQixZQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDNUIsWUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQzFCLFlBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7T0FDdEM7S0FDRjs7Ozs7Ozs7OztXQVFJLGlCQUFHO0FBQ04saUNBckRpQixhQUFhLHVDQXFEaEI7O0FBRWQsVUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFckIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDaEQsVUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7S0FDdkQ7Ozs7Ozs7Ozs7V0FRSSxpQkFBRztBQUNOLGlDQXBFaUIsYUFBYSx1Q0FvRWhCOztBQUVkLFVBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3ZELFVBQUksQ0FBQyxjQUFjLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOztBQUU3RCxVQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7QUFBRSxZQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7T0FBRTtLQUN0RDs7Ozs7Ozs7O1dBT00sbUJBQUc7QUFDUixpQ0FsRmlCLGFBQWEseUNBa0ZkOztBQUVoQixVQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsb0JBQU8sV0FBVyxDQUFDLENBQUM7QUFDakUsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2I7OztXQUVlLDBCQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFO0FBQzFDLFVBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ25CLFVBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ25CLDBCQUFPLFdBQVcsR0FBRyxXQUFXLENBQUM7O0FBRWpDLFVBQUksSUFBSSxDQUFDLElBQUksRUFBRTtBQUNiLFlBQU0sWUFBWSxHQUFHLEtBQUssSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUEsQ0FBRSxRQUFRLEVBQUUsQ0FBQztBQUNyRCxZQUFNLFNBQVMsR0FBRyxvQkFBTyxRQUFRLENBQUMsUUFBUSxHQUFHLE9BQU8sR0FBRyxZQUFZLENBQUM7O0FBRXBFLFlBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztBQUM3QixZQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxZQUFZLENBQUM7QUFDbEMsWUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLHFCQUFJLFNBQVMsRUFBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUcsQ0FBQztBQUNqRSxZQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO09BQ3BCLE1BQU07QUFDTCxZQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7T0FDYjtLQUNGOzs7V0FFa0IsK0JBQUc7QUFDcEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0FBQzdCLFVBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDcEI7OztXQUVnQiw2QkFBRztBQUNsQixVQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDYjs7O1NBakhrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiJzcmMvY2xpZW50L0NsaWVudENoZWNraW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCBDbGllbnRNb2R1bGUgZnJvbSAnLi9DbGllbnRNb2R1bGUnO1xuaW1wb3J0IFNlZ21lbnRlZFZpZXcgZnJvbSAnLi9kaXNwbGF5L1NlZ21lbnRlZFZpZXcnO1xuXG4vKipcbiAqIEFzc2lnbiBwbGFjZXMgYW1vbmcgYSBzZXQgb2YgcHJlZGVmaW5lZCBwb3NpdGlvbnMgKGkuZS4gbGFiZWxzIGFuZC9vciBjb29yZGluYXRlcykuXG4gKiBUaGUgbW9kdWxlIHJlcXVlc3RzIGEgcG9zaXRpb24gdG8gdGhlIHNlcnZlciBhbmQgd2FpdHMgZm9yIHRoZSBhbnN3ZXIuXG4gKlxuICogVGhlIG1vZHVsZSBmaW5pc2hlcyBpdHMgaW5pdGlhbGl6YXRpb24gd2hlbiBpdCByZWNlaXZlcyBhIHBvc2l0aXZlIGFuc3dlciBmcm9tIHRoZSBzZXJ2ZXIuXG4gKiBPdGhlcndpc2UgKCplLmcuKiBubyBtb3JlIHBvc2l0aW9ucyBhdmFpbGFibGUpLCB0aGUgbW9kdWxlIHN0YXlzIGluIGl0cyBzdGF0ZSBhbmQgbmV2ZXIgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uLlxuICpcbiAqIFRoZSBtb2R1bGUgYWx3YXlzIGhhcyBhIHZpZXcgYW5kIHJlcXVpcmVzIHRoZSBTQVNTIHBhcnRpYWwgYF83Ny1jaGVja2luLnNjc3NgLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL3NlcnZlci9TZXJ2ZXJDaGVja2luLmpzflNlcnZlckNoZWNraW59IG9uIHRoZSBzZXJ2ZXIgc2lkZS4pXG4gKlxuICogQGV4YW1wbGUgICogY29uc3QgY2hlY2tpbiA9IG5ldyBDbGllbnRDaGVja2luKHsgY2FwYWNpdHk6IDEwMCB9KTtcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50Q2hlY2tpbiBleHRlbmRzIENsaWVudE1vZHVsZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdjaGVja2luJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmhhc1ZpZXc9dHJ1ZV0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIG1vZHVsZSBoYXMgYSB2aWV3IG9yIG5vdC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yPSdibGFjayddIEJhY2tncm91bmQgY29sb3Igb2YgdGhlIGB2aWV3YC5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5zaG93RGlhbG9nPWZhbHNlXSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgdmlldyBkaXNwbGF5cyB0ZXh0IG9yIG5vdC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbihsYWJlbDpTdHJpbmcpIDogU3RyaW5nfSBbb3B0aW9ucy5pbnN0cnVjdGlvbnNdIEZ1bmN0aW9uIHRvIGRpc3BsYXkgdGhlIGluc3RydWN0aW9ucy5cbiAgICogQHRvZG8gZGVmYXVsdCBgaW5zdHJ1Y3Rpb25zYCB2YWx1ZVxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdjaGVja2luJywgb3B0aW9ucy5oYXNWaWV3IHx8IHRydWUsIG9wdGlvbnMuY29sb3IpO1xuXG4gICAgdGhpcy5fc2hvd0RpYWxvZyA9IG9wdGlvbnMuc2hvd0RpYWxvZyB8fCBmYWxzZTtcbiAgICB0aGlzLnZpZXdDdG9yID0gb3B0aW9ucy52aWV3Q3RvciB8fCBTZWdtZW50ZWRWaWV3O1xuICAgIC8vIGJpbmQgY2FsbGJhY2tzIHRvIHRoZSBjdXJyZW50IGluc3RhbmNlXG4gICAgdGhpcy5fcG9zaXRpb25IYW5kbGVyID0gdGhpcy5fcG9zaXRpb25IYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fdW5hdmFpbGFibGVIYW5kbGVyID0gdGhpcy5fdW5hdmFpbGFibGVIYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fdmlld0NsaWNrSGFuZGxlciA9IHRoaXMuX3ZpZXdDbGlja0hhbmRsZXIuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgaW5pdCgpIHtcblxuICAgIC8qKlxuICAgICAqIEluZGV4IGdpdmVuIGJ5IHRoZSBzZXJ2ZXJzaWRlIHtAbGluayBzcmMvc2VydmVyL1NlcnZlckNoZWNraW4uanN+U2VydmVyQ2hlY2tpbn1cbiAgICAgKiBtb2R1bGUuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmluZGV4ID0gLTE7XG5cbiAgICAvKipcbiAgICAgKiBMYWJlbCBvZiB0aGUgaW5kZXggYXNzaWduZWQgYnkgdGhlIHNlcnZlcnNpZGVcbiAgICAgKiB7QGxpbmsgc3JjL3NlcnZlci9DaGVja2luLmpzfkNoZWNraW59IG1vZHVsZSAoaWYgYW55KS5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMubGFiZWwgPSBudWxsO1xuXG4gICAgaWYgKHRoaXMuX3Nob3dEaWFsb2cpIHtcbiAgICAgIHRoaXMuY29udGVudC53YWl0aW5nID0gdHJ1ZTtcbiAgICAgIHRoaXMuY29udGVudC5sYWJlbCA9IG51bGw7XG4gICAgICB0aGlzLnZpZXcgPSB0aGlzLmNyZWF0ZURlZmF1bHRWaWV3KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBtb2R1bGUuXG4gICAqXG4gICAqIFNlbmQgYSByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgYW5kIHNldHMgdXAgbGlzdGVuZXJzIGZvciB0aGUgc2VydmVyJ3MgcmVzcG9uc2UuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuICAgIC8vIFNlbmQgcmVxdWVzdCB0byB0aGUgc2VydmVyXG4gICAgdGhpcy5zZW5kKCdyZXF1ZXN0Jyk7XG4gICAgLy8gU2V0dXAgbGlzdGVuZXJzIGZvciB0aGUgc2VydmVyJ3MgcmVzcG9uc2VcbiAgICB0aGlzLnJlY2VpdmUoJ3Bvc2l0aW9uJywgdGhpcy5fcG9zaXRpb25IYW5kbGVyKTtcbiAgICB0aGlzLnJlY2VpdmUoJ3VuYXZhaWxhYmxlJywgdGhpcy5fdW5hdmFpbGFibGVIYW5kbGVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldCB0aGUgbW9kdWxlIHRvIGRlZmF1bHQgc3RhdGUuXG4gICAqXG4gICAqIFJlbW92ZSBXZWJTb2NrZXQgYW5kIGNsaWNrIC8gdG91Y2ggbGlzdGVuZXJzLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzZXQoKSB7XG4gICAgc3VwZXIucmVzZXQoKTtcbiAgICAvLyBSZW1vdmUgbGlzdGVuZXJzIGZvciB0aGUgc2VydmVyJ3MgcmVzcG9uc2VcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdwb3NpdGlvbicsIHRoaXMuX3Bvc2l0aW9uSGFuZGxlcik7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcigndW5hdmFpbGFibGUnLCB0aGlzLl91bmF2YWlsYWJsZUhhbmRsZXIpO1xuXG4gICAgaWYgKHRoaXMudmlldykgeyB0aGlzLnZpZXcuaW5zdGFsbEV2ZW50cyh7fSwgdHJ1ZSk7IH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN0YXJ0cyB0aGUgbW9kdWxlLlxuICAgKiBTZW5kcyB0aGUgaW5kZXgsIGxhYmVsIGFuZCBjb29yZGluYXRlcyB0byB0aGUgc2VydmVyLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzdGFydCgpIHtcbiAgICBzdXBlci5yZXN0YXJ0KCk7XG4gICAgLy8gU2VuZCBjdXJyZW50IGNoZWNraW4gaW5mb3JtYXRpb24gdG8gdGhlIHNlcnZlclxuICAgIHRoaXMuc2VuZCgncmVzdGFydCcsIHRoaXMuaW5kZXgsIHRoaXMubGFiZWwsIGNsaWVudC5jb29yZGluYXRlcyk7XG4gICAgdGhpcy5kb25lKCk7XG4gIH1cblxuICBfcG9zaXRpb25IYW5kbGVyKGluZGV4LCBsYWJlbCwgY29vcmRpbmF0ZXMpIHtcbiAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgdGhpcy5sYWJlbCA9IGxhYmVsO1xuICAgIGNsaWVudC5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuXG4gICAgaWYgKHRoaXMudmlldykge1xuICAgICAgY29uc3QgZGlzcGxheUxhYmVsID0gbGFiZWwgfHwgKGluZGV4ICsgMSkudG9TdHJpbmcoKTtcbiAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IGNsaWVudC5wbGF0Zm9ybS5pc01vYmlsZSA/ICdjbGljaycgOiAndG91Y2hzdGFydCc7XG5cbiAgICAgIHRoaXMuY29udGVudC53YWl0aW5nID0gZmFsc2U7XG4gICAgICB0aGlzLmNvbnRlbnQubGFiZWwgPSBkaXNwbGF5TGFiZWw7XG4gICAgICB0aGlzLnZpZXcuaW5zdGFsbEV2ZW50cyh7IFtldmVudE5hbWVdOiB0aGlzLl92aWV3Q2xpY2tIYW5kbGVyIH0pO1xuICAgICAgdGhpcy52aWV3LnJlbmRlcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRvbmUoKTtcbiAgICB9XG4gIH1cblxuICBfdW5hdmFpbGFibGVIYW5kbGVyKCkge1xuICAgIHRoaXMuY29udGVudC53YWl0aW5nID0gZmFsc2U7XG4gICAgdGhpcy52aWV3LnJlbmRlcigpO1xuICB9XG5cbiAgX3ZpZXdDbGlja0hhbmRsZXIoKSB7XG4gICAgdGhpcy5kb25lKCk7XG4gIH1cbn1cbiJdfQ==