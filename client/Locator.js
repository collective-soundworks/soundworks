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

/**
 * The {@link Locator} allows to indicate the approximate location of the client
 * on a map (that graphically represents a {@link Setup}) via a dialog.
 */

var Locator = (function (_Module) {
  _inherits(Locator, _Module);

  /**
   * Creates an instance of the class. Always has a view.
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='locator'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   * @param {ClientSpace} [options.space=null] Space in which to indicate the approximate location.
   * @param {Boolean} [options.showBackground=false] Indicates whether to show the space background image or not.
   */

  function Locator() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Locator);

    _get(Object.getPrototypeOf(Locator.prototype), 'constructor', this).call(this, options.name || 'locator', true, options.color);

    /**
     * The space in which to indicate the approximate location.
     * @type {ClientSpace}
     */
    this.space = options.space || null;

    /**
     * The setup in which to indicate the approximate location.
     * @type {ClientSetup}
     */
    this.setup = options.setup || null;
    this._instructions = options.instructions || '<small>Indiquez votre position dans la salle</small>';

    this._showBackground = options.showBackground || false;

    this._touchStartHandler = this._touchStartHandler.bind(this);
    this._touchMoveHandler = this._touchMoveHandler.bind(this);
    this._touchEndHandler = this._touchEndHandler.bind(this);
    this._sendCoordinates = this._sendCoordinates.bind(this);
    this._surfaceHandler = this._surfaceHandler.bind(this);

    this._currentCoordinates = null;
    this._positionRadius = 20;

    // Explanatory text
    var textDiv = document.createElement('div');
    textDiv.classList.add('message');
    var text = document.createElement('p');
    text.innerHTML = this._instructions;
    this._textDiv = textDiv;
    this._text = text;

    // Button
    var button = document.createElement('div');
    button.classList.add('btn');
    button.classList.add('hidden');
    button.innerHTML = "Valider";
    this._button = button;

    // Position circle
    var positionDiv = document.createElement('div');
    positionDiv.setAttribute('id', 'position');
    positionDiv.classList.add('position');
    positionDiv.classList.add('hidden');
    positionDiv.style.width = this._positionRadius * 2 + "px";
    positionDiv.style.height = this._positionRadius * 2 + "px";
    this._positionDiv = positionDiv;

    // Surface div
    var surfaceDiv = document.createElement('div');
    surfaceDiv.setAttribute('id', 'surface');
    surfaceDiv.classList.add('surface');
    this._surfaceDiv = surfaceDiv;

    this._textDiv.appendChild(this._text);
    this._textDiv.appendChild(this._button);
    this._surfaceDiv.appendChild(this._positionDiv);

    this._resize = this._resize.bind(this);
  }

  /**
   * Starts the module.
   */

  _createClass(Locator, [{
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(Locator.prototype), 'start', this).call(this);

      _client2['default'].send(this.name + ':request');
      _client2['default'].receive(this.name + ':surface', this._surfaceHandler, false);

      window.addEventListener('resize', this._resize);
    }

    /**
     * Done method.
     * Removes the `'resize'` listener on the `window`.
     */
  }, {
    key: 'done',
    value: function done() {
      window.removeEventListener('resize', this._resize);
      _get(Object.getPrototypeOf(Locator.prototype), 'done', this).call(this);
    }

    /**
     * Resets the module to initial state.
     */
  }, {
    key: 'reset',
    value: function reset() {
      _client2['default'].coordinates = null;

      this._positionDiv.classList.add('hidden');
      this._text.classList.remove('hidden');
      this._button.classList.add('hidden');

      this._button.removeEventListener('click', this._sendCoordinates, false);
      this._surfaceDiv.removeEventListener('touchstart', this._touchStartHandler, false);
      this._surfaceDiv.removeEventListener('touchmove', this._touchMoveHandler, false);
      this._surfaceDiv.removeEventListener('touchend', this._touchEndHandler, false);

      // TODO: clean surface properly
      if (this.space) this.space.reset();
    }

    /**
     * Restarts the module.
     */
  }, {
    key: 'restart',
    value: function restart() {
      _get(Object.getPrototypeOf(Locator.prototype), 'restart', this).call(this);
      _client2['default'].send(this.name + ':restart', _client2['default'].coordinates);
      this._button.removeEventListener('click', this._sendCoordinates, false);
      this.done();
    }
  }, {
    key: '_surfaceHandler',
    value: function _surfaceHandler(surface) {
      var heightWidthRatio = surface.height / surface.width;
      var screenHeight = window.innerHeight;
      var screenWidth = window.innerWidth;
      var screenRatio = screenHeight / screenWidth;
      var heightPx = undefined,
          widthPx = undefined;

      if (screenRatio > heightWidthRatio) {
        // TODO: refine sizes, with container, etc.
        heightPx = screenWidth * heightWidthRatio;
        widthPx = screenWidth;
      } else {
        heightPx = screenHeight;
        widthPx = screenHeight / heightWidthRatio;
      }

      this.space.display(this.setup, this._surfaceDiv, {
        showBackground: this._showBackground
      });

      // Let the participant select his or her location
      this._surfaceDiv.addEventListener('touchstart', this._touchStartHandler, false);
      this._surfaceDiv.addEventListener('touchmove', this._touchMoveHandler, false);
      this._surfaceDiv.addEventListener('touchend', this._touchEndHandler, false);

      // Build text & button interface after receiving and displaying the surface
      this.view.appendChild(this._surfaceDiv);
      this.view.appendChild(this._textDiv);

      this._resize();
      // Send the coordinates of the selected location to server
      this._button.addEventListener('click', this._sendCoordinates, false);
    }
  }, {
    key: '_resize',
    value: function _resize() {
      var width = window.innerWidth;
      var height = window.innerHeight;

      var orientation = width > height ? 'landscape' : 'portrait';
      this.view.classList.remove('landscape', 'portrait');
      this.view.classList.add(orientation);

      var min = Math.min(width, height);

      this._surfaceDiv.style.width = min + 'px';
      this._surfaceDiv.style.height = min + 'px';

      switch (orientation) {
        case 'landscape':
          this._textDiv.style.height = height + 'px';
          this._textDiv.style.width = width - height + 'px';
          break;
        case 'portrait':
          this._textDiv.style.height = height - width + 'px';
          this._textDiv.style.width = width + 'px';
          break;
      }
    }
  }, {
    key: '_sendCoordinates',
    value: function _sendCoordinates() {
      if (this._currentCoordinates !== null) {
        this._button.classList.add('selected');
        _client2['default'].coordinates = this._currentCoordinates;
        _client2['default'].send(this.name + ':coordinates', _client2['default'].coordinates);
        this.done();
      }
    }
  }, {
    key: '_touchStartHandler',
    value: function _touchStartHandler(e) {
      e.preventDefault();

      if (this._positionDiv.classList.contains('hidden')) {
        this._positionDiv.classList.remove('hidden');
        this._button.classList.remove('hidden');
        this._text.classList.add('hidden');
      }

      // TODO: handle mirror
      this._positionDiv.style.left = e.changedTouches[0].clientX - this._positionRadius + "px";
      this._positionDiv.style.top = e.changedTouches[0].clientY - this._positionRadius + "px";
    }
  }, {
    key: '_touchMoveHandler',
    value: function _touchMoveHandler(e) {
      e.preventDefault();

      // TODO: handle mirror
      this._positionDiv.style.left = e.changedTouches[0].clientX - this._positionRadius + "px";
      this._positionDiv.style.top = e.changedTouches[0].clientY - this._positionRadius + "px";

      // TODO: handle out-of-bounds
    }
  }, {
    key: '_touchEndHandler',
    value: function _touchEndHandler(e) {
      e.preventDefault();

      // TODO: handle mirror
      this._positionDiv.style.left = e.changedTouches[0].clientX - this._positionRadius + "px";
      this._positionDiv.style.top = e.changedTouches[0].clientY - this._positionRadius + "px";

      var x = (e.changedTouches[0].clientX - this._surfaceDiv.offsetLeft) / this._surfaceDiv.offsetWidth;
      var y = (e.changedTouches[0].clientY - this._surfaceDiv.offsetTop) / this._surfaceDiv.offsetHeight;

      this._currentCoordinates = [x, y];

      // TODO: handle out-of-bounds
    }
  }]);

  return Locator;
})(_Module3['default']);

exports['default'] = Locator;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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QUFDLFlBQVksQ0FBQzs7QUFFbkcsVUFBSSxDQUFDLG1CQUFtQixHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOzs7S0FHbkM7OztTQXBPa0IsT0FBTzs7O3FCQUFQLE9BQU8iLCJmaWxlIjoic3JjL2NsaWVudC9Mb2NhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgTW9kdWxlIGZyb20gJy4vTW9kdWxlJztcblxuXG4vKipcbiAqIFRoZSB7QGxpbmsgTG9jYXRvcn0gYWxsb3dzIHRvIGluZGljYXRlIHRoZSBhcHByb3hpbWF0ZSBsb2NhdGlvbiBvZiB0aGUgY2xpZW50XG4gKiBvbiBhIG1hcCAodGhhdCBncmFwaGljYWxseSByZXByZXNlbnRzIGEge0BsaW5rIFNldHVwfSkgdmlhIGEgZGlhbG9nLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2NhdG9yIGV4dGVuZHMgTW9kdWxlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLiBBbHdheXMgaGFzIGEgdmlldy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nbG9jYXRvciddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yPSdibGFjayddIEJhY2tncm91bmQgY29sb3Igb2YgdGhlIGB2aWV3YC5cbiAgICogQHBhcmFtIHtDbGllbnRTcGFjZX0gW29wdGlvbnMuc3BhY2U9bnVsbF0gU3BhY2UgaW4gd2hpY2ggdG8gaW5kaWNhdGUgdGhlIGFwcHJveGltYXRlIGxvY2F0aW9uLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnNob3dCYWNrZ3JvdW5kPWZhbHNlXSBJbmRpY2F0ZXMgd2hldGhlciB0byBzaG93IHRoZSBzcGFjZSBiYWNrZ3JvdW5kIGltYWdlIG9yIG5vdC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnbG9jYXRvcicsIHRydWUsIG9wdGlvbnMuY29sb3IpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHNwYWNlIGluIHdoaWNoIHRvIGluZGljYXRlIHRoZSBhcHByb3hpbWF0ZSBsb2NhdGlvbi5cbiAgICAgKiBAdHlwZSB7Q2xpZW50U3BhY2V9XG4gICAgICovXG4gICAgdGhpcy5zcGFjZSA9IG9wdGlvbnMuc3BhY2UgfHwgbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBzZXR1cCBpbiB3aGljaCB0byBpbmRpY2F0ZSB0aGUgYXBwcm94aW1hdGUgbG9jYXRpb24uXG4gICAgICogQHR5cGUge0NsaWVudFNldHVwfVxuICAgICAqL1xuICAgIHRoaXMuc2V0dXAgPSBvcHRpb25zLnNldHVwIHx8IG51bGw7XG4gICAgdGhpcy5faW5zdHJ1Y3Rpb25zID0gb3B0aW9ucy5pbnN0cnVjdGlvbnMgfHwgJzxzbWFsbD5JbmRpcXVleiB2b3RyZSBwb3NpdGlvbiBkYW5zIGxhIHNhbGxlPC9zbWFsbD4nO1xuXG4gICAgdGhpcy5fc2hvd0JhY2tncm91bmQgPSBvcHRpb25zLnNob3dCYWNrZ3JvdW5kIHx8IGZhbHNlO1xuXG4gICAgdGhpcy5fdG91Y2hTdGFydEhhbmRsZXIgPSB0aGlzLl90b3VjaFN0YXJ0SGFuZGxlci5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX3RvdWNoTW92ZUhhbmRsZXIgPSB0aGlzLl90b3VjaE1vdmVIYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fdG91Y2hFbmRIYW5kbGVyID0gdGhpcy5fdG91Y2hFbmRIYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fc2VuZENvb3JkaW5hdGVzID0gdGhpcy5fc2VuZENvb3JkaW5hdGVzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fc3VyZmFjZUhhbmRsZXIgPSB0aGlzLl9zdXJmYWNlSGFuZGxlci5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5fY3VycmVudENvb3JkaW5hdGVzID0gbnVsbDtcbiAgICB0aGlzLl9wb3NpdGlvblJhZGl1cyA9IDIwO1xuXG4gICAgLy8gRXhwbGFuYXRvcnkgdGV4dFxuICAgIGxldCB0ZXh0RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGV4dERpdi5jbGFzc0xpc3QuYWRkKCdtZXNzYWdlJyk7XG4gICAgbGV0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgdGV4dC5pbm5lckhUTUwgPSB0aGlzLl9pbnN0cnVjdGlvbnM7XG4gICAgdGhpcy5fdGV4dERpdiA9IHRleHREaXY7XG4gICAgdGhpcy5fdGV4dCA9IHRleHQ7XG5cbiAgICAvLyBCdXR0b25cbiAgICBsZXQgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2J0bicpO1xuICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICBidXR0b24uaW5uZXJIVE1MID0gXCJWYWxpZGVyXCI7XG4gICAgdGhpcy5fYnV0dG9uID0gYnV0dG9uO1xuXG4gICAgLy8gUG9zaXRpb24gY2lyY2xlXG4gICAgbGV0IHBvc2l0aW9uRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcG9zaXRpb25EaXYuc2V0QXR0cmlidXRlKCdpZCcsICdwb3NpdGlvbicpO1xuICAgIHBvc2l0aW9uRGl2LmNsYXNzTGlzdC5hZGQoJ3Bvc2l0aW9uJyk7XG4gICAgcG9zaXRpb25EaXYuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgcG9zaXRpb25EaXYuc3R5bGUud2lkdGggPSB0aGlzLl9wb3NpdGlvblJhZGl1cyAqIDIgKyBcInB4XCI7XG4gICAgcG9zaXRpb25EaXYuc3R5bGUuaGVpZ2h0ID0gdGhpcy5fcG9zaXRpb25SYWRpdXMgKiAyICsgXCJweFwiO1xuICAgIHRoaXMuX3Bvc2l0aW9uRGl2ID0gcG9zaXRpb25EaXY7XG5cbiAgICAvLyBTdXJmYWNlIGRpdlxuICAgIGxldCBzdXJmYWNlRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgc3VyZmFjZURpdi5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3N1cmZhY2UnKTtcbiAgICBzdXJmYWNlRGl2LmNsYXNzTGlzdC5hZGQoJ3N1cmZhY2UnKTtcbiAgICB0aGlzLl9zdXJmYWNlRGl2ID0gc3VyZmFjZURpdjtcblxuICAgIHRoaXMuX3RleHREaXYuYXBwZW5kQ2hpbGQodGhpcy5fdGV4dCk7XG4gICAgdGhpcy5fdGV4dERpdi5hcHBlbmRDaGlsZCh0aGlzLl9idXR0b24pO1xuICAgIHRoaXMuX3N1cmZhY2VEaXYuYXBwZW5kQ2hpbGQodGhpcy5fcG9zaXRpb25EaXYpO1xuXG4gICAgdGhpcy5fcmVzaXplID0gdGhpcy5fcmVzaXplLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnRzIHRoZSBtb2R1bGUuXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgY2xpZW50LnNlbmQodGhpcy5uYW1lICsgJzpyZXF1ZXN0Jyk7XG4gICAgY2xpZW50LnJlY2VpdmUodGhpcy5uYW1lICsgJzpzdXJmYWNlJywgdGhpcy5fc3VyZmFjZUhhbmRsZXIsIGZhbHNlKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9yZXNpemUpO1xuICB9XG5cbiAgLyoqXG4gICAqIERvbmUgbWV0aG9kLlxuICAgKiBSZW1vdmVzIHRoZSBgJ3Jlc2l6ZSdgIGxpc3RlbmVyIG9uIHRoZSBgd2luZG93YC5cbiAgICovXG4gIGRvbmUoKSB7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3Jlc2l6ZSk7XG4gICAgc3VwZXIuZG9uZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgbW9kdWxlIHRvIGluaXRpYWwgc3RhdGUuXG4gICAqL1xuICByZXNldCgpIHtcbiAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBudWxsO1xuXG4gICAgdGhpcy5fcG9zaXRpb25EaXYuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgdGhpcy5fdGV4dC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICB0aGlzLl9idXR0b24uY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG5cbiAgICB0aGlzLl9idXR0b24ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl9zZW5kQ29vcmRpbmF0ZXMsIGZhbHNlKTtcbiAgICB0aGlzLl9zdXJmYWNlRGl2LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl90b3VjaFN0YXJ0SGFuZGxlciwgZmFsc2UpO1xuICAgIHRoaXMuX3N1cmZhY2VEaXYucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5fdG91Y2hNb3ZlSGFuZGxlciwgZmFsc2UpO1xuICAgIHRoaXMuX3N1cmZhY2VEaXYucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLl90b3VjaEVuZEhhbmRsZXIsIGZhbHNlKTtcblxuICAgIC8vIFRPRE86IGNsZWFuIHN1cmZhY2UgcHJvcGVybHlcbiAgICBpZiAodGhpcy5zcGFjZSlcbiAgICAgIHRoaXMuc3BhY2UucmVzZXQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN0YXJ0cyB0aGUgbW9kdWxlLlxuICAgKi9cbiAgcmVzdGFydCgpIHtcbiAgICBzdXBlci5yZXN0YXJ0KCk7XG4gICAgY2xpZW50LnNlbmQodGhpcy5uYW1lICsgJzpyZXN0YXJ0JywgY2xpZW50LmNvb3JkaW5hdGVzKTtcbiAgICB0aGlzLl9idXR0b24ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl9zZW5kQ29vcmRpbmF0ZXMsIGZhbHNlKTtcbiAgICB0aGlzLmRvbmUoKTtcbiAgfVxuXG4gIF9zdXJmYWNlSGFuZGxlcihzdXJmYWNlKSB7XG4gICAgbGV0IGhlaWdodFdpZHRoUmF0aW8gPSBzdXJmYWNlLmhlaWdodCAvIHN1cmZhY2Uud2lkdGg7XG4gICAgbGV0IHNjcmVlbkhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICBsZXQgc2NyZWVuV2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICBsZXQgc2NyZWVuUmF0aW8gPSBzY3JlZW5IZWlnaHQgLyBzY3JlZW5XaWR0aDtcbiAgICBsZXQgaGVpZ2h0UHgsIHdpZHRoUHg7XG5cbiAgICBpZiAoc2NyZWVuUmF0aW8gPiBoZWlnaHRXaWR0aFJhdGlvKSB7IC8vIFRPRE86IHJlZmluZSBzaXplcywgd2l0aCBjb250YWluZXIsIGV0Yy5cbiAgICAgIGhlaWdodFB4ID0gc2NyZWVuV2lkdGggKiBoZWlnaHRXaWR0aFJhdGlvO1xuICAgICAgd2lkdGhQeCA9IHNjcmVlbldpZHRoO1xuICAgIH0gZWxzZSB7XG4gICAgICBoZWlnaHRQeCA9IHNjcmVlbkhlaWdodDtcbiAgICAgIHdpZHRoUHggPSBzY3JlZW5IZWlnaHQgLyBoZWlnaHRXaWR0aFJhdGlvO1xuICAgIH1cblxuICAgIHRoaXMuc3BhY2UuZGlzcGxheSh0aGlzLnNldHVwLCB0aGlzLl9zdXJmYWNlRGl2LCB7XG4gICAgICBzaG93QmFja2dyb3VuZDogdGhpcy5fc2hvd0JhY2tncm91bmRcbiAgICB9KTtcblxuICAgIC8vIExldCB0aGUgcGFydGljaXBhbnQgc2VsZWN0IGhpcyBvciBoZXIgbG9jYXRpb25cbiAgICB0aGlzLl9zdXJmYWNlRGl2LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl90b3VjaFN0YXJ0SGFuZGxlciwgZmFsc2UpO1xuICAgIHRoaXMuX3N1cmZhY2VEaXYuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5fdG91Y2hNb3ZlSGFuZGxlciwgZmFsc2UpO1xuICAgIHRoaXMuX3N1cmZhY2VEaXYuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLl90b3VjaEVuZEhhbmRsZXIsIGZhbHNlKTtcblxuICAgIC8vIEJ1aWxkIHRleHQgJiBidXR0b24gaW50ZXJmYWNlIGFmdGVyIHJlY2VpdmluZyBhbmQgZGlzcGxheWluZyB0aGUgc3VyZmFjZVxuICAgIHRoaXMudmlldy5hcHBlbmRDaGlsZCh0aGlzLl9zdXJmYWNlRGl2KTtcbiAgICB0aGlzLnZpZXcuYXBwZW5kQ2hpbGQodGhpcy5fdGV4dERpdik7XG5cbiAgICB0aGlzLl9yZXNpemUoKTtcbiAgICAvLyBTZW5kIHRoZSBjb29yZGluYXRlcyBvZiB0aGUgc2VsZWN0ZWQgbG9jYXRpb24gdG8gc2VydmVyXG4gICAgdGhpcy5fYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fc2VuZENvb3JkaW5hdGVzLCBmYWxzZSk7XG4gIH1cblxuICBfcmVzaXplKCkge1xuICAgIGNvbnN0IHdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgY29uc3QgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXG4gICAgY29uc3Qgb3JpZW50YXRpb24gPSB3aWR0aCA+IGhlaWdodCA/ICdsYW5kc2NhcGUnIDogJ3BvcnRyYWl0JztcbiAgICB0aGlzLnZpZXcuY2xhc3NMaXN0LnJlbW92ZSgnbGFuZHNjYXBlJywgJ3BvcnRyYWl0Jyk7XG4gICAgdGhpcy52aWV3LmNsYXNzTGlzdC5hZGQob3JpZW50YXRpb24pO1xuXG4gICAgY29uc3QgbWluID0gTWF0aC5taW4od2lkdGgsIGhlaWdodCk7XG5cbiAgICB0aGlzLl9zdXJmYWNlRGl2LnN0eWxlLndpZHRoID0gYCR7bWlufXB4YDtcbiAgICB0aGlzLl9zdXJmYWNlRGl2LnN0eWxlLmhlaWdodCA9IGAke21pbn1weGA7XG5cbiAgICBzd2l0Y2ggKG9yaWVudGF0aW9uKSB7XG4gICAgICBjYXNlICdsYW5kc2NhcGUnIDpcbiAgICAgICAgdGhpcy5fdGV4dERpdi5zdHlsZS5oZWlnaHQgPSBgJHtoZWlnaHR9cHhgO1xuICAgICAgICB0aGlzLl90ZXh0RGl2LnN0eWxlLndpZHRoID0gYCR7d2lkdGggLSBoZWlnaHR9cHhgO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3BvcnRyYWl0JzpcbiAgICAgICAgdGhpcy5fdGV4dERpdi5zdHlsZS5oZWlnaHQgPSBgJHtoZWlnaHQgLSB3aWR0aH1weGA7XG4gICAgICAgIHRoaXMuX3RleHREaXYuc3R5bGUud2lkdGggPSBgJHt3aWR0aH1weGA7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIF9zZW5kQ29vcmRpbmF0ZXMoKSB7XG4gICAgaWYgKHRoaXMuX2N1cnJlbnRDb29yZGluYXRlcyAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5fYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJyk7XG4gICAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSB0aGlzLl9jdXJyZW50Q29vcmRpbmF0ZXM7XG4gICAgICBjbGllbnQuc2VuZCh0aGlzLm5hbWUgKyAnOmNvb3JkaW5hdGVzJywgY2xpZW50LmNvb3JkaW5hdGVzKTtcbiAgICAgIHRoaXMuZG9uZSgpO1xuICAgIH1cbiAgfVxuXG4gIF90b3VjaFN0YXJ0SGFuZGxlcihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgaWYgKHRoaXMuX3Bvc2l0aW9uRGl2LmNsYXNzTGlzdC5jb250YWlucygnaGlkZGVuJykpIHtcbiAgICAgIHRoaXMuX3Bvc2l0aW9uRGl2LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgICAgdGhpcy5fYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgICAgdGhpcy5fdGV4dC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICB9XG5cbiAgICAvLyBUT0RPOiBoYW5kbGUgbWlycm9yXG4gICAgdGhpcy5fcG9zaXRpb25EaXYuc3R5bGUubGVmdCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WCAtIHRoaXMuX3Bvc2l0aW9uUmFkaXVzICsgXCJweFwiO1xuICAgIHRoaXMuX3Bvc2l0aW9uRGl2LnN0eWxlLnRvcCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WSAtIHRoaXMuX3Bvc2l0aW9uUmFkaXVzICsgXCJweFwiO1xuICB9XG5cbiAgX3RvdWNoTW92ZUhhbmRsZXIoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIC8vIFRPRE86IGhhbmRsZSBtaXJyb3JcbiAgICB0aGlzLl9wb3NpdGlvbkRpdi5zdHlsZS5sZWZ0ID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYIC0gdGhpcy5fcG9zaXRpb25SYWRpdXMgKyBcInB4XCI7XG4gICAgdGhpcy5fcG9zaXRpb25EaXYuc3R5bGUudG9wID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZIC0gdGhpcy5fcG9zaXRpb25SYWRpdXMgKyBcInB4XCI7XG5cbiAgICAvLyBUT0RPOiBoYW5kbGUgb3V0LW9mLWJvdW5kc1xuICB9XG5cbiAgX3RvdWNoRW5kSGFuZGxlcihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgLy8gVE9ETzogaGFuZGxlIG1pcnJvclxuICAgIHRoaXMuX3Bvc2l0aW9uRGl2LnN0eWxlLmxlZnQgPSBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFggLSB0aGlzLl9wb3NpdGlvblJhZGl1cyArIFwicHhcIjtcbiAgICB0aGlzLl9wb3NpdGlvbkRpdi5zdHlsZS50b3AgPSBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFkgLSB0aGlzLl9wb3NpdGlvblJhZGl1cyArIFwicHhcIjtcblxuICAgIGxldCB4ID0gKGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WCAtIHRoaXMuX3N1cmZhY2VEaXYub2Zmc2V0TGVmdCkgLyB0aGlzLl9zdXJmYWNlRGl2Lm9mZnNldFdpZHRoO1xuICAgIGxldCB5ID0gKGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WSAtIHRoaXMuX3N1cmZhY2VEaXYub2Zmc2V0VG9wKSAvIHRoaXMuX3N1cmZhY2VEaXYub2Zmc2V0SGVpZ2h0O1xuXG4gICAgdGhpcy5fY3VycmVudENvb3JkaW5hdGVzID0gW3gsIHldO1xuXG4gICAgLy8gVE9ETzogaGFuZGxlIG91dC1vZi1ib3VuZHNcbiAgfVxufVxuIl19