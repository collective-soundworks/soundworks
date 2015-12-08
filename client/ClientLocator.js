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

var _ClientModule2 = require('./ClientModule');

var _ClientModule3 = _interopRequireDefault(_ClientModule2);

/**
 * [client] Allow to indicate the approximate location of the client on a map.
 *
 * The module always has a view (that displays the map and a button to validate the location) and requires the SASS partial `_77-locator.scss`.
 *
 * The module finishes its initialization after the user confirms his / her approximate location by clicking on the “Validate” button.
 *
 * (See also {@link src/server/ServerLocator.js~ServerLocator} on the server side.)
 *
 * @example
 * const space = new Space();
 * const locator = new ClientLocator({ space: space });
 */

var ClientLocator = (function (_ClientModule) {
  _inherits(ClientLocator, _ClientModule);

  /**
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='locator'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   * @param {Space} [options.space=null] Space to graphically represent the space.
   * @param {Boolean} [options.showBackground=false] Indicates whether to show the space background image or not.
   */

  function ClientLocator() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ClientLocator);

    _get(Object.getPrototypeOf(ClientLocator.prototype), 'constructor', this).call(this, options.name || 'locator', true, options.color);

    /**
     * The view that graphically represents the space in which to indicate the approximate location.
     * @type {Space}
     */
    this.space = options.space || null;

    this._instructions = options.instructions || '<small>Indiquez votre position dans la salle</small>';
    this._showBackground = options.showBackground || false;
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

    // Construct DOM
    this._textDiv.appendChild(this._text);
    this._textDiv.appendChild(this._button);
    this._surfaceDiv.appendChild(this._positionDiv);

    // Method bindings
    this._touchStartHandler = this._touchStartHandler.bind(this);
    this._touchMoveHandler = this._touchMoveHandler.bind(this);
    this._touchEndHandler = this._touchEndHandler.bind(this);
    this._sendCoordinates = this._sendCoordinates.bind(this);
    this._surfaceHandler = this._surfaceHandler.bind(this);
    this._resize = this._resize.bind(this);
  }

  /**
   * Start the module.
   * @private
   */

  _createClass(ClientLocator, [{
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(ClientLocator.prototype), 'start', this).call(this);

      this.send('request');
      this.receive('space', this._surfaceHandler, false);

      window.addEventListener('resize', this._resize);
    }

    /**
     * Done method.
     * Remove the `'resize'` listener on the `window`.
     * @private
     */
  }, {
    key: 'done',
    value: function done() {
      window.removeEventListener('resize', this._resize);
      _get(Object.getPrototypeOf(ClientLocator.prototype), 'done', this).call(this);
    }

    /**
     * Reset the module to initial state.
     * @private
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
     * Restart the module.
     * @private
     */
  }, {
    key: 'restart',
    value: function restart() {
      _get(Object.getPrototypeOf(ClientLocator.prototype), 'restart', this).call(this);
      this.send('restart', _client2['default'].coordinates);
      this._button.removeEventListener('click', this._sendCoordinates, false);
      this.done();
    }
  }, {
    key: '_surfaceHandler',
    value: function _surfaceHandler(width, height, background) {
      var heightWidthRatio = height / width;
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

      this.space.display(this._surfaceDiv, {
        background: background
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
        this.send('coordinates', _client2['default'].coordinates);
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

  return ClientLocator;
})(_ClientModule3['default']);

exports['default'] = ClientLocator;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50TG9jYXRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3NCQUFtQixVQUFVOzs7OzZCQUNKLGdCQUFnQjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBZXBCLGFBQWE7WUFBYixhQUFhOzs7Ozs7Ozs7O0FBUXJCLFdBUlEsYUFBYSxHQVFOO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFSTCxhQUFhOztBQVM5QiwrQkFUaUIsYUFBYSw2Q0FTeEIsT0FBTyxDQUFDLElBQUksSUFBSSxTQUFTLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUU7Ozs7OztBQU10RCxRQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDOztBQUVuQyxRQUFJLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxZQUFZLElBQUksc0RBQXNELENBQUM7QUFDcEcsUUFBSSxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsY0FBYyxJQUFJLEtBQUssQ0FBQztBQUN2RCxRQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO0FBQ2hDLFFBQUksQ0FBQyxlQUFlLEdBQUcsRUFBRSxDQUFDOzs7QUFHMUIsUUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1QyxXQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNqQyxRQUFJLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZDLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztBQUNwQyxRQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztBQUN4QixRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQzs7O0FBR2xCLFFBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7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ZW50TG9jYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IENsaWVudE1vZHVsZSBmcm9tICcuL0NsaWVudE1vZHVsZSc7XG5cbi8qKlxuICogW2NsaWVudF0gQWxsb3cgdG8gaW5kaWNhdGUgdGhlIGFwcHJveGltYXRlIGxvY2F0aW9uIG9mIHRoZSBjbGllbnQgb24gYSBtYXAuXG4gKlxuICogVGhlIG1vZHVsZSBhbHdheXMgaGFzIGEgdmlldyAodGhhdCBkaXNwbGF5cyB0aGUgbWFwIGFuZCBhIGJ1dHRvbiB0byB2YWxpZGF0ZSB0aGUgbG9jYXRpb24pIGFuZCByZXF1aXJlcyB0aGUgU0FTUyBwYXJ0aWFsIGBfNzctbG9jYXRvci5zY3NzYC5cbiAqXG4gKiBUaGUgbW9kdWxlIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbiBhZnRlciB0aGUgdXNlciBjb25maXJtcyBoaXMgLyBoZXIgYXBwcm94aW1hdGUgbG9jYXRpb24gYnkgY2xpY2tpbmcgb24gdGhlIOKAnFZhbGlkYXRl4oCdIGJ1dHRvbi5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9zZXJ2ZXIvU2VydmVyTG9jYXRvci5qc35TZXJ2ZXJMb2NhdG9yfSBvbiB0aGUgc2VydmVyIHNpZGUuKVxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCBzcGFjZSA9IG5ldyBTcGFjZSgpO1xuICogY29uc3QgbG9jYXRvciA9IG5ldyBDbGllbnRMb2NhdG9yKHsgc3BhY2U6IHNwYWNlIH0pO1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnRMb2NhdG9yIGV4dGVuZHMgQ2xpZW50TW9kdWxlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm5hbWU9J2xvY2F0b3InXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nYmxhY2snXSBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBgdmlld2AuXG4gICAqIEBwYXJhbSB7U3BhY2V9IFtvcHRpb25zLnNwYWNlPW51bGxdIFNwYWNlIHRvIGdyYXBoaWNhbGx5IHJlcHJlc2VudCB0aGUgc3BhY2UuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuc2hvd0JhY2tncm91bmQ9ZmFsc2VdIEluZGljYXRlcyB3aGV0aGVyIHRvIHNob3cgdGhlIHNwYWNlIGJhY2tncm91bmQgaW1hZ2Ugb3Igbm90LlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdsb2NhdG9yJywgdHJ1ZSwgb3B0aW9ucy5jb2xvcik7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgdmlldyB0aGF0IGdyYXBoaWNhbGx5IHJlcHJlc2VudHMgdGhlIHNwYWNlIGluIHdoaWNoIHRvIGluZGljYXRlIHRoZSBhcHByb3hpbWF0ZSBsb2NhdGlvbi5cbiAgICAgKiBAdHlwZSB7U3BhY2V9XG4gICAgICovXG4gICAgdGhpcy5zcGFjZSA9IG9wdGlvbnMuc3BhY2UgfHwgbnVsbDtcblxuICAgIHRoaXMuX2luc3RydWN0aW9ucyA9IG9wdGlvbnMuaW5zdHJ1Y3Rpb25zIHx8ICc8c21hbGw+SW5kaXF1ZXogdm90cmUgcG9zaXRpb24gZGFucyBsYSBzYWxsZTwvc21hbGw+JztcbiAgICB0aGlzLl9zaG93QmFja2dyb3VuZCA9IG9wdGlvbnMuc2hvd0JhY2tncm91bmQgfHwgZmFsc2U7XG4gICAgdGhpcy5fY3VycmVudENvb3JkaW5hdGVzID0gbnVsbDtcbiAgICB0aGlzLl9wb3NpdGlvblJhZGl1cyA9IDIwO1xuXG4gICAgLy8gRXhwbGFuYXRvcnkgdGV4dFxuICAgIGxldCB0ZXh0RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGV4dERpdi5jbGFzc0xpc3QuYWRkKCdtZXNzYWdlJyk7XG4gICAgbGV0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgdGV4dC5pbm5lckhUTUwgPSB0aGlzLl9pbnN0cnVjdGlvbnM7XG4gICAgdGhpcy5fdGV4dERpdiA9IHRleHREaXY7XG4gICAgdGhpcy5fdGV4dCA9IHRleHQ7XG5cbiAgICAvLyBCdXR0b25cbiAgICBsZXQgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2J0bicpO1xuICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICBidXR0b24uaW5uZXJIVE1MID0gXCJWYWxpZGVyXCI7XG4gICAgdGhpcy5fYnV0dG9uID0gYnV0dG9uO1xuXG4gICAgLy8gUG9zaXRpb24gY2lyY2xlXG4gICAgbGV0IHBvc2l0aW9uRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcG9zaXRpb25EaXYuc2V0QXR0cmlidXRlKCdpZCcsICdwb3NpdGlvbicpO1xuICAgIHBvc2l0aW9uRGl2LmNsYXNzTGlzdC5hZGQoJ3Bvc2l0aW9uJyk7XG4gICAgcG9zaXRpb25EaXYuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgcG9zaXRpb25EaXYuc3R5bGUud2lkdGggPSB0aGlzLl9wb3NpdGlvblJhZGl1cyAqIDIgKyBcInB4XCI7XG4gICAgcG9zaXRpb25EaXYuc3R5bGUuaGVpZ2h0ID0gdGhpcy5fcG9zaXRpb25SYWRpdXMgKiAyICsgXCJweFwiO1xuICAgIHRoaXMuX3Bvc2l0aW9uRGl2ID0gcG9zaXRpb25EaXY7XG5cbiAgICAvLyBTdXJmYWNlIGRpdlxuICAgIGxldCBzdXJmYWNlRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgc3VyZmFjZURpdi5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3N1cmZhY2UnKTtcbiAgICBzdXJmYWNlRGl2LmNsYXNzTGlzdC5hZGQoJ3N1cmZhY2UnKTtcbiAgICB0aGlzLl9zdXJmYWNlRGl2ID0gc3VyZmFjZURpdjtcblxuICAgIC8vIENvbnN0cnVjdCBET01cbiAgICB0aGlzLl90ZXh0RGl2LmFwcGVuZENoaWxkKHRoaXMuX3RleHQpO1xuICAgIHRoaXMuX3RleHREaXYuYXBwZW5kQ2hpbGQodGhpcy5fYnV0dG9uKTtcbiAgICB0aGlzLl9zdXJmYWNlRGl2LmFwcGVuZENoaWxkKHRoaXMuX3Bvc2l0aW9uRGl2KTtcblxuICAgIC8vIE1ldGhvZCBiaW5kaW5nc1xuICAgIHRoaXMuX3RvdWNoU3RhcnRIYW5kbGVyID0gdGhpcy5fdG91Y2hTdGFydEhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICB0aGlzLl90b3VjaE1vdmVIYW5kbGVyID0gdGhpcy5fdG91Y2hNb3ZlSGFuZGxlci5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX3RvdWNoRW5kSGFuZGxlciA9IHRoaXMuX3RvdWNoRW5kSGFuZGxlci5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX3NlbmRDb29yZGluYXRlcyA9IHRoaXMuX3NlbmRDb29yZGluYXRlcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX3N1cmZhY2VIYW5kbGVyID0gdGhpcy5fc3VyZmFjZUhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9yZXNpemUgPSB0aGlzLl9yZXNpemUuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgbW9kdWxlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIHRoaXMuc2VuZCgncmVxdWVzdCcpO1xuICAgIHRoaXMucmVjZWl2ZSgnc3BhY2UnLCB0aGlzLl9zdXJmYWNlSGFuZGxlciwgZmFsc2UpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3Jlc2l6ZSk7XG4gIH1cblxuICAvKipcbiAgICogRG9uZSBtZXRob2QuXG4gICAqIFJlbW92ZSB0aGUgYCdyZXNpemUnYCBsaXN0ZW5lciBvbiB0aGUgYHdpbmRvd2AuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkb25lKCkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9yZXNpemUpO1xuICAgIHN1cGVyLmRvbmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldCB0aGUgbW9kdWxlIHRvIGluaXRpYWwgc3RhdGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXNldCgpIHtcbiAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBudWxsO1xuXG4gICAgdGhpcy5fcG9zaXRpb25EaXYuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgdGhpcy5fdGV4dC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICB0aGlzLl9idXR0b24uY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG5cbiAgICB0aGlzLl9idXR0b24ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl9zZW5kQ29vcmRpbmF0ZXMsIGZhbHNlKTtcbiAgICB0aGlzLl9zdXJmYWNlRGl2LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl90b3VjaFN0YXJ0SGFuZGxlciwgZmFsc2UpO1xuICAgIHRoaXMuX3N1cmZhY2VEaXYucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5fdG91Y2hNb3ZlSGFuZGxlciwgZmFsc2UpO1xuICAgIHRoaXMuX3N1cmZhY2VEaXYucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLl90b3VjaEVuZEhhbmRsZXIsIGZhbHNlKTtcblxuICAgIC8vIFRPRE86IGNsZWFuIHN1cmZhY2UgcHJvcGVybHlcbiAgICBpZiAodGhpcy5zcGFjZSlcbiAgICAgIHRoaXMuc3BhY2UucmVzZXQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN0YXJ0IHRoZSBtb2R1bGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXN0YXJ0KCkge1xuICAgIHN1cGVyLnJlc3RhcnQoKTtcbiAgICB0aGlzLnNlbmQoJ3Jlc3RhcnQnLCBjbGllbnQuY29vcmRpbmF0ZXMpO1xuICAgIHRoaXMuX2J1dHRvbi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX3NlbmRDb29yZGluYXRlcywgZmFsc2UpO1xuICAgIHRoaXMuZG9uZSgpO1xuICB9XG5cbiAgX3N1cmZhY2VIYW5kbGVyKHdpZHRoLCBoZWlnaHQsIGJhY2tncm91bmQpIHtcbiAgICBsZXQgaGVpZ2h0V2lkdGhSYXRpbyA9IGhlaWdodCAvIHdpZHRoO1xuICAgIGxldCBzY3JlZW5IZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgbGV0IHNjcmVlbldpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgbGV0IHNjcmVlblJhdGlvID0gc2NyZWVuSGVpZ2h0IC8gc2NyZWVuV2lkdGg7XG4gICAgbGV0IGhlaWdodFB4LCB3aWR0aFB4O1xuXG4gICAgaWYgKHNjcmVlblJhdGlvID4gaGVpZ2h0V2lkdGhSYXRpbykgeyAvLyBUT0RPOiByZWZpbmUgc2l6ZXMsIHdpdGggY29udGFpbmVyLCBldGMuXG4gICAgICBoZWlnaHRQeCA9IHNjcmVlbldpZHRoICogaGVpZ2h0V2lkdGhSYXRpbztcbiAgICAgIHdpZHRoUHggPSBzY3JlZW5XaWR0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgaGVpZ2h0UHggPSBzY3JlZW5IZWlnaHQ7XG4gICAgICB3aWR0aFB4ID0gc2NyZWVuSGVpZ2h0IC8gaGVpZ2h0V2lkdGhSYXRpbztcbiAgICB9XG5cbiAgICB0aGlzLnNwYWNlLmRpc3BsYXkodGhpcy5fc3VyZmFjZURpdiwge1xuICAgICAgYmFja2dyb3VuZDogYmFja2dyb3VuZFxuICAgIH0pO1xuXG4gICAgLy8gTGV0IHRoZSBwYXJ0aWNpcGFudCBzZWxlY3QgaGlzIG9yIGhlciBsb2NhdGlvblxuICAgIHRoaXMuX3N1cmZhY2VEaXYuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuX3RvdWNoU3RhcnRIYW5kbGVyLCBmYWxzZSk7XG4gICAgdGhpcy5fc3VyZmFjZURpdi5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLl90b3VjaE1vdmVIYW5kbGVyLCBmYWxzZSk7XG4gICAgdGhpcy5fc3VyZmFjZURpdi5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMuX3RvdWNoRW5kSGFuZGxlciwgZmFsc2UpO1xuXG4gICAgLy8gQnVpbGQgdGV4dCAmIGJ1dHRvbiBpbnRlcmZhY2UgYWZ0ZXIgcmVjZWl2aW5nIGFuZCBkaXNwbGF5aW5nIHRoZSBzdXJmYWNlXG4gICAgdGhpcy52aWV3LmFwcGVuZENoaWxkKHRoaXMuX3N1cmZhY2VEaXYpO1xuICAgIHRoaXMudmlldy5hcHBlbmRDaGlsZCh0aGlzLl90ZXh0RGl2KTtcblxuICAgIHRoaXMuX3Jlc2l6ZSgpO1xuICAgIC8vIFNlbmQgdGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBzZWxlY3RlZCBsb2NhdGlvbiB0byBzZXJ2ZXJcbiAgICB0aGlzLl9idXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl9zZW5kQ29vcmRpbmF0ZXMsIGZhbHNlKTtcbiAgfVxuXG4gIF9yZXNpemUoKSB7XG4gICAgY29uc3Qgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICBjb25zdCBoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cbiAgICBjb25zdCBvcmllbnRhdGlvbiA9IHdpZHRoID4gaGVpZ2h0ID8gJ2xhbmRzY2FwZScgOiAncG9ydHJhaXQnO1xuICAgIHRoaXMudmlldy5jbGFzc0xpc3QucmVtb3ZlKCdsYW5kc2NhcGUnLCAncG9ydHJhaXQnKTtcbiAgICB0aGlzLnZpZXcuY2xhc3NMaXN0LmFkZChvcmllbnRhdGlvbik7XG5cbiAgICBjb25zdCBtaW4gPSBNYXRoLm1pbih3aWR0aCwgaGVpZ2h0KTtcblxuICAgIHRoaXMuX3N1cmZhY2VEaXYuc3R5bGUud2lkdGggPSBgJHttaW59cHhgO1xuICAgIHRoaXMuX3N1cmZhY2VEaXYuc3R5bGUuaGVpZ2h0ID0gYCR7bWlufXB4YDtcblxuICAgIHN3aXRjaCAob3JpZW50YXRpb24pIHtcbiAgICAgIGNhc2UgJ2xhbmRzY2FwZScgOlxuICAgICAgICB0aGlzLl90ZXh0RGl2LnN0eWxlLmhlaWdodCA9IGAke2hlaWdodH1weGA7XG4gICAgICAgIHRoaXMuX3RleHREaXYuc3R5bGUud2lkdGggPSBgJHt3aWR0aCAtIGhlaWdodH1weGA7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncG9ydHJhaXQnOlxuICAgICAgICB0aGlzLl90ZXh0RGl2LnN0eWxlLmhlaWdodCA9IGAke2hlaWdodCAtIHdpZHRofXB4YDtcbiAgICAgICAgdGhpcy5fdGV4dERpdi5zdHlsZS53aWR0aCA9IGAke3dpZHRofXB4YDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgX3NlbmRDb29yZGluYXRlcygpIHtcbiAgICBpZiAodGhpcy5fY3VycmVudENvb3JkaW5hdGVzICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9idXR0b24uY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTtcbiAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IHRoaXMuX2N1cnJlbnRDb29yZGluYXRlcztcbiAgICAgIHRoaXMuc2VuZCgnY29vcmRpbmF0ZXMnLCBjbGllbnQuY29vcmRpbmF0ZXMpO1xuICAgICAgdGhpcy5kb25lKCk7XG4gICAgfVxuICB9XG5cbiAgX3RvdWNoU3RhcnRIYW5kbGVyKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBpZiAodGhpcy5fcG9zaXRpb25EaXYuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRkZW4nKSkge1xuICAgICAgdGhpcy5fcG9zaXRpb25EaXYuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gICAgICB0aGlzLl9idXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gICAgICB0aGlzLl90ZXh0LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgIH1cblxuICAgIC8vIFRPRE86IGhhbmRsZSBtaXJyb3JcbiAgICB0aGlzLl9wb3NpdGlvbkRpdi5zdHlsZS5sZWZ0ID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYIC0gdGhpcy5fcG9zaXRpb25SYWRpdXMgKyBcInB4XCI7XG4gICAgdGhpcy5fcG9zaXRpb25EaXYuc3R5bGUudG9wID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZIC0gdGhpcy5fcG9zaXRpb25SYWRpdXMgKyBcInB4XCI7XG4gIH1cblxuICBfdG91Y2hNb3ZlSGFuZGxlcihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgLy8gVE9ETzogaGFuZGxlIG1pcnJvclxuICAgIHRoaXMuX3Bvc2l0aW9uRGl2LnN0eWxlLmxlZnQgPSBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFggLSB0aGlzLl9wb3NpdGlvblJhZGl1cyArIFwicHhcIjtcbiAgICB0aGlzLl9wb3NpdGlvbkRpdi5zdHlsZS50b3AgPSBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFkgLSB0aGlzLl9wb3NpdGlvblJhZGl1cyArIFwicHhcIjtcblxuICAgIC8vIFRPRE86IGhhbmRsZSBvdXQtb2YtYm91bmRzXG4gIH1cblxuICBfdG91Y2hFbmRIYW5kbGVyKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAvLyBUT0RPOiBoYW5kbGUgbWlycm9yXG4gICAgdGhpcy5fcG9zaXRpb25EaXYuc3R5bGUubGVmdCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WCAtIHRoaXMuX3Bvc2l0aW9uUmFkaXVzICsgXCJweFwiO1xuICAgIHRoaXMuX3Bvc2l0aW9uRGl2LnN0eWxlLnRvcCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WSAtIHRoaXMuX3Bvc2l0aW9uUmFkaXVzICsgXCJweFwiO1xuXG4gICAgbGV0IHggPSAoZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYIC0gdGhpcy5fc3VyZmFjZURpdi5vZmZzZXRMZWZ0KSAvIHRoaXMuX3N1cmZhY2VEaXYub2Zmc2V0V2lkdGg7XG4gICAgbGV0IHkgPSAoZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZIC0gdGhpcy5fc3VyZmFjZURpdi5vZmZzZXRUb3ApIC8gdGhpcy5fc3VyZmFjZURpdi5vZmZzZXRIZWlnaHQ7XG5cbiAgICB0aGlzLl9jdXJyZW50Q29vcmRpbmF0ZXMgPSBbeCwgeV07XG5cbiAgICAvLyBUT0RPOiBoYW5kbGUgb3V0LW9mLWJvdW5kc1xuICB9XG59XG4iXX0=