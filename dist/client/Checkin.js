'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var input = require('./input');
var client = require('./client');
var ClientModule = require('./ClientModule');
// import client from './client.es6.js';
// import ClientModule from './ClientModule.es6.js';

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

var ClientCheckin = (function (_ClientModule) {
  _inherits(ClientCheckin, _ClientModule);

  // export default class ClientCheckin extends ClientModule {
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

      client.send(this.name + ':request');

      client.receive(this.name + ':acknowledge', this._acknowledgementHandler);
      client.receive(this.name + ':unavailable', this._unavailableHandler);
    }

    /**
     * Resets the module to default state.
     * Removes WebSocket and click / touch listeners.
     */
  }, {
    key: 'reset',
    value: function reset() {
      _get(Object.getPrototypeOf(ClientCheckin.prototype), 'reset', this).call(this);

      client.removeListener(this.name + ':acknowledge', this._acknowledgementHandler);
      client.removeListener(this.name + ':unavailable', this._unavailableHandler);

      if (client.platform.isMobile) this.view.removeEventListener('touchstart', this._viewClickHandler);else this.view.removeEventListener('click', this._viewClickHandler, false);
    }

    /**
     * Restarts the module.
     * Sends the index, label and coordinates to the server.
     */
  }, {
    key: 'restart',
    value: function restart() {
      _get(Object.getPrototypeOf(ClientCheckin.prototype), 'restart', this).call(this);

      client.send(this.name + ':restart', this.index, this.label, client.coordinates);
      this.done();
    }
  }, {
    key: '_acknowledgementHandler',
    value: function _acknowledgementHandler(index, label, coordinates) {
      this.index = index;

      if (coordinates) client.coordinates = coordinates;

      if (label) {
        this.label = label;

        if (this._showDialog) {
          var htmlContent = this._instructions(label);
          this.setCenteredViewContent(htmlContent);

          if (client.platform.isMobile) this.view.addEventListener('touchstart', this._viewClickHandler);else this.view.addEventListener('click', this._viewClickHandler, false);
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
})(ClientModule);

module.exports = ClientCheckin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7QUFFYixJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDakMsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ25DLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOzs7O0FBSy9DLFNBQVMsYUFBYSxDQUFDLEtBQUssRUFBRTtBQUM1QixTQUFPLGNBQWMsR0FDbkIsMkNBQTJDLEdBQUcsS0FBSyxHQUFHLGVBQWUsR0FDckUsZ0VBQWdFLENBQUM7Q0FDcEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBbUJLLGFBQWE7WUFBYixhQUFhOzs7Ozs7Ozs7Ozs7OztBQVlOLFdBWlAsYUFBYSxHQVlTO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFacEIsYUFBYTs7QUFhZiwrQkFiRSxhQUFhLDZDQWFULE9BQU8sQ0FBQyxJQUFJLElBQUksU0FBUyxFQUFFLE9BQU8sQ0FBQyxPQUFPLElBQUksSUFBSSxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUU7O0FBRXpFLFFBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDaEIsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRWxCLFFBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLFVBQVUsSUFBSSxLQUFLLENBQUM7QUFDL0MsUUFBSSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUMsWUFBWSxJQUFJLGFBQWEsQ0FBQzs7QUFFM0QsUUFBSSxDQUFDLHVCQUF1QixHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkUsUUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDL0Qs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Y2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGlucHV0ID0gcmVxdWlyZSgnLi9pbnB1dCcpO1xuY29uc3QgY2xpZW50ID0gcmVxdWlyZSgnLi9jbGllbnQnKTtcbmNvbnN0IENsaWVudE1vZHVsZSA9IHJlcXVpcmUoJy4vQ2xpZW50TW9kdWxlJyk7XG4vLyBpbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50LmVzNi5qcyc7XG4vLyBpbXBvcnQgQ2xpZW50TW9kdWxlIGZyb20gJy4vQ2xpZW50TW9kdWxlLmVzNi5qcyc7XG5cblxuZnVuY3Rpb24gX2luc3RydWN0aW9ucyhsYWJlbCkge1xuICByZXR1cm4gXCI8cD5HbyB0bzwvcD5cIiArXG4gICAgXCI8ZGl2IGNsYXNzPSdjaGVja2luLWxhYmVsIGNpcmNsZWQnPjxzcGFuPlwiICsgbGFiZWwgKyBcIjwvc3Bhbj48L2Rpdj5cIiArXG4gICAgXCI8cD48c21hbGw+VG91Y2ggdGhlIHNjcmVlbjxici8+d2hlbiB5b3UgYXJlIHJlYWR5Ljwvc21hbGw+PC9wPlwiO1xufVxuXG4vKipcbiAqIFRoZSBgQ2hlY2tpbmAgbW9kdWxlIGlzIHJlc3BvbnNpYmxlIGZvciBrZWVwaW5nIHRyYWNrIG9mIHRoZSBjb25uZWN0ZWQgY2xpZW50cyBieSBhc3NpZ25pbmcgdGhlbSBpbmRpY2VzLlxuICogSW4gY2FzZSB0aGF0IHRoZSBzY2VuYXJpbyBpcyBiYXNlZCBvbiBwcmVkZWZpbmVkIHBvc2l0aW9ucyAoKmkuZS4qIGEgYHNldHVwYCksIHRoZSBpbmRpY2VzIGNvcnJlc3BvbmQgdG8gdGhlIGluZGljZXMgb2YgcG9zaXRpb25zIHRoYXQgY2FuIGJlIGVpdGhlciBhc3NpZ25lZCBhdXRvbWF0aWNhbGx5IG9yIHNlbGVjdGVkIGJ5IHRoZSBwYXJ0aWNpcGFudHMuXG4gKlxuICogRm9yIGluc3RhbmNlLCBzYXkgdGhhdCB0aGUgc2NlbmFyaW8gcmVxdWlyZXMgMTIgcGFydGljaXBhbnRzIHdobyBzaXQgb24gYSBncmlkIG9mIDMg4qiJIDQgcHJlZGVmaW5lZCBwb3NpdGlvbnMuXG4gKiBXaGVuIGEgY2xpZW50IGNvbm5lY3RzIHRvIHRoZSBzZXJ2ZXIsIHRoZSBgQ2hlY2tpbmAgbW9kdWxlIGNvdWxkIGFzc2lnbiB0aGUgY2xpZW50IHRvIGEgcG9zaXRpb24gb24gdGhlIGdyaWQgdGhhdCBpcyBub3Qgb2NjdXBpZWQgeWV0LlxuICogVGhlIGFwcGxpY2F0aW9uIGNhbiBpbmRpY2F0ZSB0aGUgcGFydGljaXBhbnQgYSBsYWJlbCB0aGF0IGlzIGFzc29jaWF0ZWQgd2l0aCB0aGUgYXNzaWduZWQgcG9zaXRpb24uXG4gKiBTaW1pbGFybHksIGlmIHRoZSBzY2VuYXJpbyB0YWtlcyBwbGFjZSBpbiBhIHRoZWF0ZXIgd2l0aCBsYWJlbGVkIHNlYXRzLCB0aGUgYENoZWNraW5gIG1vZHVsZSB3b3VsZCBhbGxvdyB0aGUgcGFydGljaXBhbnRzIHRvIGluZGljYXRlIHRoZWlyIHNlYXQgYnkgaXRzIGxhYmVsICgqZS5nLiogYSByb3cgYW5kIGEgbnVtYmVyKS5cbiAqIElmIHRoZSBzY2VuYXJpbyBkb2VzIG5vdCByZXF1aXJlIHRoZSBwYXJ0aWNpcGFudHMgdG8gc2l0IGF0IHBhcnRpY3VsYXIgbG9jYXRpb25zLCB0aGUgYENoZWNraW5gIG1vZHVsZSB3b3VsZCBqdXN0IGFzc2lnbiB0aGVtIGFyYml0cmFyeSBpbmRpY2VzIHdpdGhpbiB0aGUgcmFuZ2Ugb2YgdG90YWwgbnVtYmVyIG9mIHVzZXJzIHRoZSBzY2VuYXJpbyBzdXBwb3J0cy5cbiAqXG4gKiBBbHRlcm5hdGl2ZWx5LCB3aGVuIGNvbmZpZ3VyaW5nIHRoZSBtb2R1bGUgYWRlcXVhdGVseSwgdGhlIG1vZHVsZSBjYW4gYXNzaWduIGFyYml0cmFyeSBpbmRpY2VzIHRvIHRoZSB0aGUgcGFydGljaXBhbnRzIGFuZCByZXF1ZXN0IHRoYXQgdGhleSBpbmRpY2F0ZSB0aGVpciBhcHByb3hpbWF0ZSBsb2NhdGlvbiBpbiB0aGUgcGVyZm9ybWFuY2Ugc3BhY2Ugb24gYSBtYXAuXG4gKlxuICogVGhlIHtAbGluayBDbGllbnRDaGVja2lufSBtb2R1bGUgdGFrZXMgY2FyZSBvZiB0aGUgY2hlY2staW4gb24gdGhlIGNsaWVudCBzaWRlLlxuICogVGhlIHtAbGluayBDbGllbnRDaGVja2lufSBtb2R1bGUgY2FsbHMgaXRzIGBkb25lYCBtZXRob2Qgd2hlbiB0aGUgdXNlciBpcyBjaGVja2VkIGluLlxuICpcbiAqIFRoZSB7QGxpbmsgQ2xpZW50Q2hlY2tpbn0gbW9kdWxlIHJlcXVpcmVzIHRoZSBTQVNTIHBhcnRpYWwgYF83Ny1jaGVja2luLnNjc3NgLlxuICovXG5jbGFzcyBDbGllbnRDaGVja2luIGV4dGVuZHMgQ2xpZW50TW9kdWxlIHtcbi8vIGV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudENoZWNraW4gZXh0ZW5kcyBDbGllbnRNb2R1bGUge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiB0aGUgY2xhc3MuIEFsd2F5cyBoYXMgYSB2aWV3LlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdjaGVja2luJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmhhc1ZpZXc9dHJ1ZV0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIG1vZHVsZSBoYXMgYSB2aWV3IG9yIG5vdC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yPSdibGFjayddIEJhY2tncm91bmQgY29sb3Igb2YgdGhlIGB2aWV3YC5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5zaG93RGlhbG9nPWZhbHNlXSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgdmlldyBkaXNwbGF5cyB0ZXh0IG9yIG5vdC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbihsYWJlbDpTdHJpbmcpIDogU3RyaW5nfSBbb3B0aW9ucy5pbnN0cnVjdGlvbnNdIEZ1bmN0aW9uIHRvIGRpc3BsYXkgdGhlIGluc3RydWN0aW9ucy5cbiAgICogQHRvZG8gZGVmYXVsdCBgaW5zdHJ1Y3Rpb25zYCB2YWx1ZVxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdjaGVja2luJywgb3B0aW9ucy5oYXNWaWV3IHx8IHRydWUsIG9wdGlvbnMuY29sb3IpO1xuXG4gICAgdGhpcy5pbmRleCA9IC0xO1xuICAgIHRoaXMubGFiZWwgPSBudWxsO1xuXG4gICAgdGhpcy5fc2hvd0RpYWxvZyA9IG9wdGlvbnMuc2hvd0RpYWxvZyB8fCBmYWxzZTtcbiAgICB0aGlzLl9pbnN0cnVjdGlvbnMgPSBvcHRpb25zLmluc3RydWN0aW9ucyB8fCBfaW5zdHJ1Y3Rpb25zO1xuXG4gICAgdGhpcy5fYWNrbm93bGVkZ2VtZW50SGFuZGxlciA9IHRoaXMuX2Fja25vd2xlZGdlbWVudEhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICB0aGlzLl91bmF2YWlsYWJsZUhhbmRsZXIgPSB0aGlzLl91bmF2YWlsYWJsZUhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICB0aGlzLl92aWV3Q2xpY2tIYW5kbGVyID0gdGhpcy5fdmlld0NsaWNrSGFuZGxlci5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0cyB0aGUgbW9kdWxlLlxuICAgKiBTZW5kcyBhIHJlcXVlc3QgdG8gdGhlIHNlcnZlciBhbmQgc2V0cyB1cCBsaXN0ZW5lcnMgZm9yIHRoZSBzZXJ2ZXIncyByZXNwb25zZS5cbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBjbGllbnQuc2VuZCh0aGlzLm5hbWUgKyAnOnJlcXVlc3QnKTtcblxuICAgIGNsaWVudC5yZWNlaXZlKHRoaXMubmFtZSArICc6YWNrbm93bGVkZ2UnLCB0aGlzLl9hY2tub3dsZWRnZW1lbnRIYW5kbGVyKTtcbiAgICBjbGllbnQucmVjZWl2ZSh0aGlzLm5hbWUgKyAnOnVuYXZhaWxhYmxlJywgdGhpcy5fdW5hdmFpbGFibGVIYW5kbGVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldHMgdGhlIG1vZHVsZSB0byBkZWZhdWx0IHN0YXRlLlxuICAgKiBSZW1vdmVzIFdlYlNvY2tldCBhbmQgY2xpY2sgLyB0b3VjaCBsaXN0ZW5lcnMuXG4gICAqL1xuICByZXNldCgpIHtcbiAgICBzdXBlci5yZXNldCgpO1xuXG4gICAgY2xpZW50LnJlbW92ZUxpc3RlbmVyKHRoaXMubmFtZSArICc6YWNrbm93bGVkZ2UnLCB0aGlzLl9hY2tub3dsZWRnZW1lbnRIYW5kbGVyKTtcbiAgICBjbGllbnQucmVtb3ZlTGlzdGVuZXIodGhpcy5uYW1lICsgJzp1bmF2YWlsYWJsZScsIHRoaXMuX3VuYXZhaWxhYmxlSGFuZGxlcik7XG5cbiAgICBpZiAoY2xpZW50LnBsYXRmb3JtLmlzTW9iaWxlKVxuICAgICAgdGhpcy52aWV3LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl92aWV3Q2xpY2tIYW5kbGVyKTtcbiAgICBlbHNlXG4gICAgICB0aGlzLnZpZXcucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl92aWV3Q2xpY2tIYW5kbGVyLCBmYWxzZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVzdGFydHMgdGhlIG1vZHVsZS5cbiAgICogU2VuZHMgdGhlIGluZGV4LCBsYWJlbCBhbmQgY29vcmRpbmF0ZXMgdG8gdGhlIHNlcnZlci5cbiAgICovXG4gIHJlc3RhcnQoKSB7XG4gICAgc3VwZXIucmVzdGFydCgpO1xuXG4gICAgY2xpZW50LnNlbmQodGhpcy5uYW1lICsgJzpyZXN0YXJ0JywgdGhpcy5pbmRleCwgdGhpcy5sYWJlbCwgY2xpZW50LmNvb3JkaW5hdGVzKTtcbiAgICB0aGlzLmRvbmUoKTtcbiAgfVxuXG4gIF9hY2tub3dsZWRnZW1lbnRIYW5kbGVyKGluZGV4LCBsYWJlbCwgY29vcmRpbmF0ZXMpIHtcbiAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG5cbiAgICBpZiAoY29vcmRpbmF0ZXMpXG4gICAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcztcblxuICAgIGlmIChsYWJlbCkge1xuICAgICAgdGhpcy5sYWJlbCA9IGxhYmVsO1xuXG4gICAgICBpZiAodGhpcy5fc2hvd0RpYWxvZykge1xuICAgICAgICBsZXQgaHRtbENvbnRlbnQgPSB0aGlzLl9pbnN0cnVjdGlvbnMobGFiZWwpO1xuICAgICAgICB0aGlzLnNldENlbnRlcmVkVmlld0NvbnRlbnQoaHRtbENvbnRlbnQpO1xuXG4gICAgICAgIGlmIChjbGllbnQucGxhdGZvcm0uaXNNb2JpbGUpXG4gICAgICAgICAgdGhpcy52aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl92aWV3Q2xpY2tIYW5kbGVyKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHRoaXMudmlldy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX3ZpZXdDbGlja0hhbmRsZXIsIGZhbHNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZG9uZSgpO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZG9uZSgpO1xuICAgIH1cbiAgfVxuXG4gIF91bmF2YWlsYWJsZUhhbmRsZXIoKSB7XG4gICAgdGhpcy5zZXRDZW50ZXJlZFZpZXdDb250ZW50KFwiPHA+U29ycnksIHdlIGNhbm5vdCBhY2NlcHQgYW55IG1vcmUgY29ubmVjdGlvbnMgYXQgdGhlIG1vbWVudCwgcGxlYXNlIHRyeSBhZ2FpbiBsYXRlci48L3A+XCIpO1xuICB9XG5cbiAgX3ZpZXdDbGlja0hhbmRsZXIoKSB7XG4gICAgdGhpcy5kb25lKCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDbGllbnRDaGVja2luO1xuIl19