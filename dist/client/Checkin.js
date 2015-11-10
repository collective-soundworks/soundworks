'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _Module2 = require('./Module');

var _Module3 = _interopRequireDefault(_Module2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
    _classCallCheck(this, ClientCheckin);

    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ClientCheckin).call(this, options.name || 'checkin', options.hasView || true, options.color));

    _this.index = -1;
    _this.label = null;

    _this._showDialog = options.showDialog || false;
    _this._instructions = options.instructions || _instructions;

    _this._acknowledgementHandler = _this._acknowledgementHandler.bind(_this);
    _this._unavailableHandler = _this._unavailableHandler.bind(_this);
    _this._viewClickHandler = _this._viewClickHandler.bind(_this);
    return _this;
  }

  /**
   * Starts the module.
   * Sends a request to the server and sets up listeners for the server's response.
   */

  _createClass(ClientCheckin, [{
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(ClientCheckin.prototype), 'start', this).call(this);

      _client2.default.send(this.name + ':request');

      _client2.default.receive(this.name + ':acknowledge', this._acknowledgementHandler);
      _client2.default.receive(this.name + ':unavailable', this._unavailableHandler);
    }

    /**
     * Resets the module to default state.
     * Removes WebSocket and click / touch listeners.
     */

  }, {
    key: 'reset',
    value: function reset() {
      _get(Object.getPrototypeOf(ClientCheckin.prototype), 'reset', this).call(this);

      _client2.default.removeListener(this.name + ':acknowledge', this._acknowledgementHandler);
      _client2.default.removeListener(this.name + ':unavailable', this._unavailableHandler);

      if (_client2.default.platform.isMobile) this.view.removeEventListener('touchstart', this._viewClickHandler);else this.view.removeEventListener('click', this._viewClickHandler, false);
    }

    /**
     * Restarts the module.
     * Sends the index, label and coordinates to the server.
     */

  }, {
    key: 'restart',
    value: function restart() {
      _get(Object.getPrototypeOf(ClientCheckin.prototype), 'restart', this).call(this);

      _client2.default.send(this.name + ':restart', this.index, this.label, _client2.default.coordinates);
      this.done();
    }
  }, {
    key: '_acknowledgementHandler',
    value: function _acknowledgementHandler(index, label, coordinates) {
      this.index = index;

      if (coordinates) _client2.default.coordinates = coordinates;

      if (label) {
        this.label = label;

        if (this._showDialog) {
          var htmlContent = this._instructions(label);
          this.setCenteredViewContent(htmlContent);

          if (_client2.default.platform.isMobile) this.view.addEventListener('touchstart', this._viewClickHandler);else this.view.addEventListener('click', this._viewClickHandler, false);
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
})(_Module3.default);

exports.default = ClientCheckin;
//# sourceMappingURL=data:application/json;base64,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SSxDQUFDLFdBQVcsRUFBRTtBQUNwQixjQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzVDLGNBQUksQ0FBQyxzQkFBc0IsQ0FBQyxXQUFXLENBQUMsQ0FBQzs7QUFFekMsY0FBSSxpQkFBTyxRQUFRLENBQUMsUUFBUSxFQUMxQixJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxLQUVqRSxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDdEUsTUFBTTtBQUNMLGNBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNiO09BRUYsTUFBTTtBQUNMLFlBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztPQUNiO0tBQ0Y7OzswQ0FFcUI7QUFDcEIsVUFBSSxDQUFDLHNCQUFzQixDQUFDLDRGQUE0RixDQUFDLENBQUM7S0FDM0g7Ozt3Q0FFbUI7QUFDbEIsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2I7OztTQWpHa0IsYUFBYTs7O2tCQUFiLGFBQWEiLCJmaWxlIjoiQ2hlY2tpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IE1vZHVsZSBmcm9tICcuL01vZHVsZSc7XG5cblxuZnVuY3Rpb24gX2luc3RydWN0aW9ucyhsYWJlbCkge1xuICByZXR1cm4gXCI8cD5HbyB0bzwvcD5cIiArXG4gICAgXCI8ZGl2IGNsYXNzPSdjaGVja2luLWxhYmVsIGNpcmNsZWQnPjxzcGFuPlwiICsgbGFiZWwgKyBcIjwvc3Bhbj48L2Rpdj5cIiArXG4gICAgXCI8cD48c21hbGw+VG91Y2ggdGhlIHNjcmVlbjxici8+d2hlbiB5b3UgYXJlIHJlYWR5Ljwvc21hbGw+PC9wPlwiO1xufVxuXG4vKipcbiAqIFRoZSBgQ2hlY2tpbmAgbW9kdWxlIGlzIHJlc3BvbnNpYmxlIGZvciBrZWVwaW5nIHRyYWNrIG9mIHRoZSBjb25uZWN0ZWQgY2xpZW50cyBieSBhc3NpZ25pbmcgdGhlbSBpbmRpY2VzLlxuICogSW4gY2FzZSB0aGF0IHRoZSBzY2VuYXJpbyBpcyBiYXNlZCBvbiBwcmVkZWZpbmVkIHBvc2l0aW9ucyAoKmkuZS4qIGEgYHNldHVwYCksIHRoZSBpbmRpY2VzIGNvcnJlc3BvbmQgdG8gdGhlIGluZGljZXMgb2YgcG9zaXRpb25zIHRoYXQgY2FuIGJlIGVpdGhlciBhc3NpZ25lZCBhdXRvbWF0aWNhbGx5IG9yIHNlbGVjdGVkIGJ5IHRoZSBwYXJ0aWNpcGFudHMuXG4gKlxuICogRm9yIGluc3RhbmNlLCBzYXkgdGhhdCB0aGUgc2NlbmFyaW8gcmVxdWlyZXMgMTIgcGFydGljaXBhbnRzIHdobyBzaXQgb24gYSBncmlkIG9mIDMg4qiJIDQgcHJlZGVmaW5lZCBwb3NpdGlvbnMuXG4gKiBXaGVuIGEgY2xpZW50IGNvbm5lY3RzIHRvIHRoZSBzZXJ2ZXIsIHRoZSBgQ2hlY2tpbmAgbW9kdWxlIGNvdWxkIGFzc2lnbiB0aGUgY2xpZW50IHRvIGEgcG9zaXRpb24gb24gdGhlIGdyaWQgdGhhdCBpcyBub3Qgb2NjdXBpZWQgeWV0LlxuICogVGhlIGFwcGxpY2F0aW9uIGNhbiBpbmRpY2F0ZSB0aGUgcGFydGljaXBhbnQgYSBsYWJlbCB0aGF0IGlzIGFzc29jaWF0ZWQgd2l0aCB0aGUgYXNzaWduZWQgcG9zaXRpb24uXG4gKiBTaW1pbGFybHksIGlmIHRoZSBzY2VuYXJpbyB0YWtlcyBwbGFjZSBpbiBhIHRoZWF0ZXIgd2l0aCBsYWJlbGVkIHNlYXRzLCB0aGUgYENoZWNraW5gIG1vZHVsZSB3b3VsZCBhbGxvdyB0aGUgcGFydGljaXBhbnRzIHRvIGluZGljYXRlIHRoZWlyIHNlYXQgYnkgaXRzIGxhYmVsICgqZS5nLiogYSByb3cgYW5kIGEgbnVtYmVyKS5cbiAqIElmIHRoZSBzY2VuYXJpbyBkb2VzIG5vdCByZXF1aXJlIHRoZSBwYXJ0aWNpcGFudHMgdG8gc2l0IGF0IHBhcnRpY3VsYXIgbG9jYXRpb25zLCB0aGUgYENoZWNraW5gIG1vZHVsZSB3b3VsZCBqdXN0IGFzc2lnbiB0aGVtIGFyYml0cmFyeSBpbmRpY2VzIHdpdGhpbiB0aGUgcmFuZ2Ugb2YgdG90YWwgbnVtYmVyIG9mIHVzZXJzIHRoZSBzY2VuYXJpbyBzdXBwb3J0cy5cbiAqXG4gKiBBbHRlcm5hdGl2ZWx5LCB3aGVuIGNvbmZpZ3VyaW5nIHRoZSBtb2R1bGUgYWRlcXVhdGVseSwgdGhlIG1vZHVsZSBjYW4gYXNzaWduIGFyYml0cmFyeSBpbmRpY2VzIHRvIHRoZSB0aGUgcGFydGljaXBhbnRzIGFuZCByZXF1ZXN0IHRoYXQgdGhleSBpbmRpY2F0ZSB0aGVpciBhcHByb3hpbWF0ZSBsb2NhdGlvbiBpbiB0aGUgcGVyZm9ybWFuY2Ugc3BhY2Ugb24gYSBtYXAuXG4gKlxuICogVGhlIHtAbGluayBDbGllbnRDaGVja2lufSBtb2R1bGUgdGFrZXMgY2FyZSBvZiB0aGUgY2hlY2staW4gb24gdGhlIGNsaWVudCBzaWRlLlxuICogVGhlIHtAbGluayBDbGllbnRDaGVja2lufSBtb2R1bGUgY2FsbHMgaXRzIGBkb25lYCBtZXRob2Qgd2hlbiB0aGUgdXNlciBpcyBjaGVja2VkIGluLlxuICpcbiAqIFRoZSB7QGxpbmsgQ2xpZW50Q2hlY2tpbn0gbW9kdWxlIHJlcXVpcmVzIHRoZSBTQVNTIHBhcnRpYWwgYF83Ny1jaGVja2luLnNjc3NgLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnRDaGVja2luIGV4dGVuZHMgTW9kdWxlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLiBBbHdheXMgaGFzIGEgdmlldy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nY2hlY2tpbiddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5oYXNWaWV3PXRydWVdIEluZGljYXRlcyB3aGV0aGVyIHRoZSBtb2R1bGUgaGFzIGEgdmlldyBvciBub3QuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nYmxhY2snXSBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBgdmlld2AuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuc2hvd0RpYWxvZz1mYWxzZV0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHZpZXcgZGlzcGxheXMgdGV4dCBvciBub3QuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb24obGFiZWw6U3RyaW5nKSA6IFN0cmluZ30gW29wdGlvbnMuaW5zdHJ1Y3Rpb25zXSBGdW5jdGlvbiB0byBkaXNwbGF5IHRoZSBpbnN0cnVjdGlvbnMuXG4gICAqIEB0b2RvIGRlZmF1bHQgYGluc3RydWN0aW9uc2AgdmFsdWVcbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnY2hlY2tpbicsIG9wdGlvbnMuaGFzVmlldyB8fCB0cnVlLCBvcHRpb25zLmNvbG9yKTtcblxuICAgIHRoaXMuaW5kZXggPSAtMTtcbiAgICB0aGlzLmxhYmVsID0gbnVsbDtcblxuICAgIHRoaXMuX3Nob3dEaWFsb2cgPSBvcHRpb25zLnNob3dEaWFsb2cgfHwgZmFsc2U7XG4gICAgdGhpcy5faW5zdHJ1Y3Rpb25zID0gb3B0aW9ucy5pbnN0cnVjdGlvbnMgfHwgX2luc3RydWN0aW9ucztcblxuICAgIHRoaXMuX2Fja25vd2xlZGdlbWVudEhhbmRsZXIgPSB0aGlzLl9hY2tub3dsZWRnZW1lbnRIYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fdW5hdmFpbGFibGVIYW5kbGVyID0gdGhpcy5fdW5hdmFpbGFibGVIYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fdmlld0NsaWNrSGFuZGxlciA9IHRoaXMuX3ZpZXdDbGlja0hhbmRsZXIuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydHMgdGhlIG1vZHVsZS5cbiAgICogU2VuZHMgYSByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgYW5kIHNldHMgdXAgbGlzdGVuZXJzIGZvciB0aGUgc2VydmVyJ3MgcmVzcG9uc2UuXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgY2xpZW50LnNlbmQodGhpcy5uYW1lICsgJzpyZXF1ZXN0Jyk7XG5cbiAgICBjbGllbnQucmVjZWl2ZSh0aGlzLm5hbWUgKyAnOmFja25vd2xlZGdlJywgdGhpcy5fYWNrbm93bGVkZ2VtZW50SGFuZGxlcik7XG4gICAgY2xpZW50LnJlY2VpdmUodGhpcy5uYW1lICsgJzp1bmF2YWlsYWJsZScsIHRoaXMuX3VuYXZhaWxhYmxlSGFuZGxlcik7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXRzIHRoZSBtb2R1bGUgdG8gZGVmYXVsdCBzdGF0ZS5cbiAgICogUmVtb3ZlcyBXZWJTb2NrZXQgYW5kIGNsaWNrIC8gdG91Y2ggbGlzdGVuZXJzLlxuICAgKi9cbiAgcmVzZXQoKSB7XG4gICAgc3VwZXIucmVzZXQoKTtcblxuICAgIGNsaWVudC5yZW1vdmVMaXN0ZW5lcih0aGlzLm5hbWUgKyAnOmFja25vd2xlZGdlJywgdGhpcy5fYWNrbm93bGVkZ2VtZW50SGFuZGxlcik7XG4gICAgY2xpZW50LnJlbW92ZUxpc3RlbmVyKHRoaXMubmFtZSArICc6dW5hdmFpbGFibGUnLCB0aGlzLl91bmF2YWlsYWJsZUhhbmRsZXIpO1xuXG4gICAgaWYgKGNsaWVudC5wbGF0Zm9ybS5pc01vYmlsZSlcbiAgICAgIHRoaXMudmlldy5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5fdmlld0NsaWNrSGFuZGxlcik7XG4gICAgZWxzZVxuICAgICAgdGhpcy52aWV3LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fdmlld0NsaWNrSGFuZGxlciwgZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc3RhcnRzIHRoZSBtb2R1bGUuXG4gICAqIFNlbmRzIHRoZSBpbmRleCwgbGFiZWwgYW5kIGNvb3JkaW5hdGVzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqL1xuICByZXN0YXJ0KCkge1xuICAgIHN1cGVyLnJlc3RhcnQoKTtcblxuICAgIGNsaWVudC5zZW5kKHRoaXMubmFtZSArICc6cmVzdGFydCcsIHRoaXMuaW5kZXgsIHRoaXMubGFiZWwsIGNsaWVudC5jb29yZGluYXRlcyk7XG4gICAgdGhpcy5kb25lKCk7XG4gIH1cblxuICBfYWNrbm93bGVkZ2VtZW50SGFuZGxlcihpbmRleCwgbGFiZWwsIGNvb3JkaW5hdGVzKSB7XG4gICAgdGhpcy5pbmRleCA9IGluZGV4O1xuXG4gICAgaWYgKGNvb3JkaW5hdGVzKVxuICAgICAgY2xpZW50LmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XG5cbiAgICBpZiAobGFiZWwpIHtcbiAgICAgIHRoaXMubGFiZWwgPSBsYWJlbDtcblxuICAgICAgaWYgKHRoaXMuX3Nob3dEaWFsb2cpIHtcbiAgICAgICAgbGV0IGh0bWxDb250ZW50ID0gdGhpcy5faW5zdHJ1Y3Rpb25zKGxhYmVsKTtcbiAgICAgICAgdGhpcy5zZXRDZW50ZXJlZFZpZXdDb250ZW50KGh0bWxDb250ZW50KTtcblxuICAgICAgICBpZiAoY2xpZW50LnBsYXRmb3JtLmlzTW9iaWxlKVxuICAgICAgICAgIHRoaXMudmlldy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5fdmlld0NsaWNrSGFuZGxlcik7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICB0aGlzLnZpZXcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl92aWV3Q2xpY2tIYW5kbGVyLCBmYWxzZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRvbmUoKTtcbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRvbmUoKTtcbiAgICB9XG4gIH1cblxuICBfdW5hdmFpbGFibGVIYW5kbGVyKCkge1xuICAgIHRoaXMuc2V0Q2VudGVyZWRWaWV3Q29udGVudChcIjxwPlNvcnJ5LCB3ZSBjYW5ub3QgYWNjZXB0IGFueSBtb3JlIGNvbm5lY3Rpb25zIGF0IHRoZSBtb21lbnQsIHBsZWFzZSB0cnkgYWdhaW4gbGF0ZXIuPC9wPlwiKTtcbiAgfVxuXG4gIF92aWV3Q2xpY2tIYW5kbGVyKCkge1xuICAgIHRoaXMuZG9uZSgpO1xuICB9XG59XG4iXX0=