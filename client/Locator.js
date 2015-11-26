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
 *
 * @example import { client, Locator, Setup, Space } from 'soundworks/client';
 *
 * const setup = new Setup();
 * const space = new Space();
 * const locator = new Locator({ setup: setup, space: space });
 * // ... instantiate other modules
 *
 * // Initialize the client (indicate the client type)
 * client.init('clientType');
 *
 * // Start the scenario
 * client.start((serial, parallel) => {
 *   // Make sure that the `setup` and `space` are initialized before they are
 *   // used by the locator (=> we use the `serial` function).
 *   serial(
 *     parallel(setup, space),
 *     locator,
 *     // ... other modules
 *   )
 * });
 */

var Locator = (function (_Module) {
  _inherits(Locator, _Module);

  /**
   * Creates an instance of the class. Always has a view.
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='locator'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   * @param {Setup} [options.setup=null] Setup in which to indicate the approximate location.
   * @param {Space} [options.space=null] Space to graphically represent the setup.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvTG9jYXRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3NCQUFtQixVQUFVOzs7O3VCQUNWLFVBQVU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQTRCUixPQUFPO1lBQVAsT0FBTzs7Ozs7Ozs7Ozs7O0FBVWYsV0FWUSxPQUFPLEdBVUE7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQVZMLE9BQU87O0FBV3hCLCtCQVhpQixPQUFPLDZDQVdsQixPQUFPLENBQUMsSUFBSSxJQUFJLFNBQVMsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBRTs7Ozs7O0FBTXRELFFBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUM7Ozs7OztBQU1uQyxRQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDO0FBQ25DLFFBQUksQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFDLFlBQVksSUFBSSxzREFBc0QsQ0FBQzs7QUFFcEcsUUFBSSxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsY0FBYyxJQUFJLEtBQUssQ0FBQzs7QUFFdkQsUUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDN0QsUUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDM0QsUUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekQsUUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekQsUUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLElB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QSxHQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDOztBQUVuRyxVQUFJLENBQUMsbUJBQW1CLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7OztLQUduQzs7O1NBck9rQixPQUFPOzs7cUJBQVAsT0FBTyIsImZpbGUiOiJzcmMvY2xpZW50L0xvY2F0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCBNb2R1bGUgZnJvbSAnLi9Nb2R1bGUnO1xuXG5cbi8qKlxuICogVGhlIHtAbGluayBMb2NhdG9yfSBhbGxvd3MgdG8gaW5kaWNhdGUgdGhlIGFwcHJveGltYXRlIGxvY2F0aW9uIG9mIHRoZSBjbGllbnRcbiAqIG9uIGEgbWFwICh0aGF0IGdyYXBoaWNhbGx5IHJlcHJlc2VudHMgYSB7QGxpbmsgU2V0dXB9KSB2aWEgYSBkaWFsb2cuXG4gKlxuICogQGV4YW1wbGUgaW1wb3J0IHsgY2xpZW50LCBMb2NhdG9yLCBTZXR1cCwgU3BhY2UgfSBmcm9tICdzb3VuZHdvcmtzL2NsaWVudCc7XG4gKlxuICogY29uc3Qgc2V0dXAgPSBuZXcgU2V0dXAoKTtcbiAqIGNvbnN0IHNwYWNlID0gbmV3IFNwYWNlKCk7XG4gKiBjb25zdCBsb2NhdG9yID0gbmV3IExvY2F0b3IoeyBzZXR1cDogc2V0dXAsIHNwYWNlOiBzcGFjZSB9KTtcbiAqIC8vIC4uLiBpbnN0YW50aWF0ZSBvdGhlciBtb2R1bGVzXG4gKlxuICogLy8gSW5pdGlhbGl6ZSB0aGUgY2xpZW50IChpbmRpY2F0ZSB0aGUgY2xpZW50IHR5cGUpXG4gKiBjbGllbnQuaW5pdCgnY2xpZW50VHlwZScpO1xuICpcbiAqIC8vIFN0YXJ0IHRoZSBzY2VuYXJpb1xuICogY2xpZW50LnN0YXJ0KChzZXJpYWwsIHBhcmFsbGVsKSA9PiB7XG4gKiAgIC8vIE1ha2Ugc3VyZSB0aGF0IHRoZSBgc2V0dXBgIGFuZCBgc3BhY2VgIGFyZSBpbml0aWFsaXplZCBiZWZvcmUgdGhleSBhcmVcbiAqICAgLy8gdXNlZCBieSB0aGUgbG9jYXRvciAoPT4gd2UgdXNlIHRoZSBgc2VyaWFsYCBmdW5jdGlvbikuXG4gKiAgIHNlcmlhbChcbiAqICAgICBwYXJhbGxlbChzZXR1cCwgc3BhY2UpLFxuICogICAgIGxvY2F0b3IsXG4gKiAgICAgLy8gLi4uIG90aGVyIG1vZHVsZXNcbiAqICAgKVxuICogfSk7XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvY2F0b3IgZXh0ZW5kcyBNb2R1bGUge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiB0aGUgY2xhc3MuIEFsd2F5cyBoYXMgYSB2aWV3LlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdsb2NhdG9yJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuY29sb3I9J2JsYWNrJ10gQmFja2dyb3VuZCBjb2xvciBvZiB0aGUgYHZpZXdgLlxuICAgKiBAcGFyYW0ge1NldHVwfSBbb3B0aW9ucy5zZXR1cD1udWxsXSBTZXR1cCBpbiB3aGljaCB0byBpbmRpY2F0ZSB0aGUgYXBwcm94aW1hdGUgbG9jYXRpb24uXG4gICAqIEBwYXJhbSB7U3BhY2V9IFtvcHRpb25zLnNwYWNlPW51bGxdIFNwYWNlIHRvIGdyYXBoaWNhbGx5IHJlcHJlc2VudCB0aGUgc2V0dXAuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuc2hvd0JhY2tncm91bmQ9ZmFsc2VdIEluZGljYXRlcyB3aGV0aGVyIHRvIHNob3cgdGhlIHNwYWNlIGJhY2tncm91bmQgaW1hZ2Ugb3Igbm90LlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdsb2NhdG9yJywgdHJ1ZSwgb3B0aW9ucy5jb2xvcik7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgc3BhY2UgaW4gd2hpY2ggdG8gaW5kaWNhdGUgdGhlIGFwcHJveGltYXRlIGxvY2F0aW9uLlxuICAgICAqIEB0eXBlIHtDbGllbnRTcGFjZX1cbiAgICAgKi9cbiAgICB0aGlzLnNwYWNlID0gb3B0aW9ucy5zcGFjZSB8fCBudWxsO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHNldHVwIGluIHdoaWNoIHRvIGluZGljYXRlIHRoZSBhcHByb3hpbWF0ZSBsb2NhdGlvbi5cbiAgICAgKiBAdHlwZSB7Q2xpZW50U2V0dXB9XG4gICAgICovXG4gICAgdGhpcy5zZXR1cCA9IG9wdGlvbnMuc2V0dXAgfHwgbnVsbDtcbiAgICB0aGlzLl9pbnN0cnVjdGlvbnMgPSBvcHRpb25zLmluc3RydWN0aW9ucyB8fCAnPHNtYWxsPkluZGlxdWV6IHZvdHJlIHBvc2l0aW9uIGRhbnMgbGEgc2FsbGU8L3NtYWxsPic7XG5cbiAgICB0aGlzLl9zaG93QmFja2dyb3VuZCA9IG9wdGlvbnMuc2hvd0JhY2tncm91bmQgfHwgZmFsc2U7XG5cbiAgICB0aGlzLl90b3VjaFN0YXJ0SGFuZGxlciA9IHRoaXMuX3RvdWNoU3RhcnRIYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fdG91Y2hNb3ZlSGFuZGxlciA9IHRoaXMuX3RvdWNoTW92ZUhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICB0aGlzLl90b3VjaEVuZEhhbmRsZXIgPSB0aGlzLl90b3VjaEVuZEhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9zZW5kQ29vcmRpbmF0ZXMgPSB0aGlzLl9zZW5kQ29vcmRpbmF0ZXMuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9zdXJmYWNlSGFuZGxlciA9IHRoaXMuX3N1cmZhY2VIYW5kbGVyLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLl9jdXJyZW50Q29vcmRpbmF0ZXMgPSBudWxsO1xuICAgIHRoaXMuX3Bvc2l0aW9uUmFkaXVzID0gMjA7XG5cbiAgICAvLyBFeHBsYW5hdG9yeSB0ZXh0XG4gICAgbGV0IHRleHREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0ZXh0RGl2LmNsYXNzTGlzdC5hZGQoJ21lc3NhZ2UnKTtcbiAgICBsZXQgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICB0ZXh0LmlubmVySFRNTCA9IHRoaXMuX2luc3RydWN0aW9ucztcbiAgICB0aGlzLl90ZXh0RGl2ID0gdGV4dERpdjtcbiAgICB0aGlzLl90ZXh0ID0gdGV4dDtcblxuICAgIC8vIEJ1dHRvblxuICAgIGxldCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnYnRuJyk7XG4gICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgIGJ1dHRvbi5pbm5lckhUTUwgPSBcIlZhbGlkZXJcIjtcbiAgICB0aGlzLl9idXR0b24gPSBidXR0b247XG5cbiAgICAvLyBQb3NpdGlvbiBjaXJjbGVcbiAgICBsZXQgcG9zaXRpb25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwb3NpdGlvbkRpdi5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3Bvc2l0aW9uJyk7XG4gICAgcG9zaXRpb25EaXYuY2xhc3NMaXN0LmFkZCgncG9zaXRpb24nKTtcbiAgICBwb3NpdGlvbkRpdi5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICBwb3NpdGlvbkRpdi5zdHlsZS53aWR0aCA9IHRoaXMuX3Bvc2l0aW9uUmFkaXVzICogMiArIFwicHhcIjtcbiAgICBwb3NpdGlvbkRpdi5zdHlsZS5oZWlnaHQgPSB0aGlzLl9wb3NpdGlvblJhZGl1cyAqIDIgKyBcInB4XCI7XG4gICAgdGhpcy5fcG9zaXRpb25EaXYgPSBwb3NpdGlvbkRpdjtcblxuICAgIC8vIFN1cmZhY2UgZGl2XG4gICAgbGV0IHN1cmZhY2VEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBzdXJmYWNlRGl2LnNldEF0dHJpYnV0ZSgnaWQnLCAnc3VyZmFjZScpO1xuICAgIHN1cmZhY2VEaXYuY2xhc3NMaXN0LmFkZCgnc3VyZmFjZScpO1xuICAgIHRoaXMuX3N1cmZhY2VEaXYgPSBzdXJmYWNlRGl2O1xuXG4gICAgdGhpcy5fdGV4dERpdi5hcHBlbmRDaGlsZCh0aGlzLl90ZXh0KTtcbiAgICB0aGlzLl90ZXh0RGl2LmFwcGVuZENoaWxkKHRoaXMuX2J1dHRvbik7XG4gICAgdGhpcy5fc3VyZmFjZURpdi5hcHBlbmRDaGlsZCh0aGlzLl9wb3NpdGlvbkRpdik7XG5cbiAgICB0aGlzLl9yZXNpemUgPSB0aGlzLl9yZXNpemUuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydHMgdGhlIG1vZHVsZS5cbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBjbGllbnQuc2VuZCh0aGlzLm5hbWUgKyAnOnJlcXVlc3QnKTtcbiAgICBjbGllbnQucmVjZWl2ZSh0aGlzLm5hbWUgKyAnOnN1cmZhY2UnLCB0aGlzLl9zdXJmYWNlSGFuZGxlciwgZmFsc2UpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3Jlc2l6ZSk7XG4gIH1cblxuICAvKipcbiAgICogRG9uZSBtZXRob2QuXG4gICAqIFJlbW92ZXMgdGhlIGAncmVzaXplJ2AgbGlzdGVuZXIgb24gdGhlIGB3aW5kb3dgLlxuICAgKi9cbiAgZG9uZSgpIHtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fcmVzaXplKTtcbiAgICBzdXBlci5kb25lKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXRzIHRoZSBtb2R1bGUgdG8gaW5pdGlhbCBzdGF0ZS5cbiAgICovXG4gIHJlc2V0KCkge1xuICAgIGNsaWVudC5jb29yZGluYXRlcyA9IG51bGw7XG5cbiAgICB0aGlzLl9wb3NpdGlvbkRpdi5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICB0aGlzLl90ZXh0LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgIHRoaXMuX2J1dHRvbi5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcblxuICAgIHRoaXMuX2J1dHRvbi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX3NlbmRDb29yZGluYXRlcywgZmFsc2UpO1xuICAgIHRoaXMuX3N1cmZhY2VEaXYucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuX3RvdWNoU3RhcnRIYW5kbGVyLCBmYWxzZSk7XG4gICAgdGhpcy5fc3VyZmFjZURpdi5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLl90b3VjaE1vdmVIYW5kbGVyLCBmYWxzZSk7XG4gICAgdGhpcy5fc3VyZmFjZURpdi5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMuX3RvdWNoRW5kSGFuZGxlciwgZmFsc2UpO1xuXG4gICAgLy8gVE9ETzogY2xlYW4gc3VyZmFjZSBwcm9wZXJseVxuICAgIGlmICh0aGlzLnNwYWNlKVxuICAgICAgdGhpcy5zcGFjZS5yZXNldCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc3RhcnRzIHRoZSBtb2R1bGUuXG4gICAqL1xuICByZXN0YXJ0KCkge1xuICAgIHN1cGVyLnJlc3RhcnQoKTtcbiAgICBjbGllbnQuc2VuZCh0aGlzLm5hbWUgKyAnOnJlc3RhcnQnLCBjbGllbnQuY29vcmRpbmF0ZXMpO1xuICAgIHRoaXMuX2J1dHRvbi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX3NlbmRDb29yZGluYXRlcywgZmFsc2UpO1xuICAgIHRoaXMuZG9uZSgpO1xuICB9XG5cbiAgX3N1cmZhY2VIYW5kbGVyKHN1cmZhY2UpIHtcbiAgICBsZXQgaGVpZ2h0V2lkdGhSYXRpbyA9IHN1cmZhY2UuaGVpZ2h0IC8gc3VyZmFjZS53aWR0aDtcbiAgICBsZXQgc2NyZWVuSGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIGxldCBzY3JlZW5XaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIGxldCBzY3JlZW5SYXRpbyA9IHNjcmVlbkhlaWdodCAvIHNjcmVlbldpZHRoO1xuICAgIGxldCBoZWlnaHRQeCwgd2lkdGhQeDtcblxuICAgIGlmIChzY3JlZW5SYXRpbyA+IGhlaWdodFdpZHRoUmF0aW8pIHsgLy8gVE9ETzogcmVmaW5lIHNpemVzLCB3aXRoIGNvbnRhaW5lciwgZXRjLlxuICAgICAgaGVpZ2h0UHggPSBzY3JlZW5XaWR0aCAqIGhlaWdodFdpZHRoUmF0aW87XG4gICAgICB3aWR0aFB4ID0gc2NyZWVuV2lkdGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhlaWdodFB4ID0gc2NyZWVuSGVpZ2h0O1xuICAgICAgd2lkdGhQeCA9IHNjcmVlbkhlaWdodCAvIGhlaWdodFdpZHRoUmF0aW87XG4gICAgfVxuXG4gICAgdGhpcy5zcGFjZS5kaXNwbGF5KHRoaXMuc2V0dXAsIHRoaXMuX3N1cmZhY2VEaXYsIHtcbiAgICAgIHNob3dCYWNrZ3JvdW5kOiB0aGlzLl9zaG93QmFja2dyb3VuZFxuICAgIH0pO1xuXG4gICAgLy8gTGV0IHRoZSBwYXJ0aWNpcGFudCBzZWxlY3QgaGlzIG9yIGhlciBsb2NhdGlvblxuICAgIHRoaXMuX3N1cmZhY2VEaXYuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuX3RvdWNoU3RhcnRIYW5kbGVyLCBmYWxzZSk7XG4gICAgdGhpcy5fc3VyZmFjZURpdi5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLl90b3VjaE1vdmVIYW5kbGVyLCBmYWxzZSk7XG4gICAgdGhpcy5fc3VyZmFjZURpdi5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMuX3RvdWNoRW5kSGFuZGxlciwgZmFsc2UpO1xuXG4gICAgLy8gQnVpbGQgdGV4dCAmIGJ1dHRvbiBpbnRlcmZhY2UgYWZ0ZXIgcmVjZWl2aW5nIGFuZCBkaXNwbGF5aW5nIHRoZSBzdXJmYWNlXG4gICAgdGhpcy52aWV3LmFwcGVuZENoaWxkKHRoaXMuX3N1cmZhY2VEaXYpO1xuICAgIHRoaXMudmlldy5hcHBlbmRDaGlsZCh0aGlzLl90ZXh0RGl2KTtcblxuICAgIHRoaXMuX3Jlc2l6ZSgpO1xuICAgIC8vIFNlbmQgdGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBzZWxlY3RlZCBsb2NhdGlvbiB0byBzZXJ2ZXJcbiAgICB0aGlzLl9idXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl9zZW5kQ29vcmRpbmF0ZXMsIGZhbHNlKTtcbiAgfVxuXG4gIF9yZXNpemUoKSB7XG4gICAgY29uc3Qgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICBjb25zdCBoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cbiAgICBjb25zdCBvcmllbnRhdGlvbiA9IHdpZHRoID4gaGVpZ2h0ID8gJ2xhbmRzY2FwZScgOiAncG9ydHJhaXQnO1xuICAgIHRoaXMudmlldy5jbGFzc0xpc3QucmVtb3ZlKCdsYW5kc2NhcGUnLCAncG9ydHJhaXQnKTtcbiAgICB0aGlzLnZpZXcuY2xhc3NMaXN0LmFkZChvcmllbnRhdGlvbik7XG5cbiAgICBjb25zdCBtaW4gPSBNYXRoLm1pbih3aWR0aCwgaGVpZ2h0KTtcblxuICAgIHRoaXMuX3N1cmZhY2VEaXYuc3R5bGUud2lkdGggPSBgJHttaW59cHhgO1xuICAgIHRoaXMuX3N1cmZhY2VEaXYuc3R5bGUuaGVpZ2h0ID0gYCR7bWlufXB4YDtcblxuICAgIHN3aXRjaCAob3JpZW50YXRpb24pIHtcbiAgICAgIGNhc2UgJ2xhbmRzY2FwZScgOlxuICAgICAgICB0aGlzLl90ZXh0RGl2LnN0eWxlLmhlaWdodCA9IGAke2hlaWdodH1weGA7XG4gICAgICAgIHRoaXMuX3RleHREaXYuc3R5bGUud2lkdGggPSBgJHt3aWR0aCAtIGhlaWdodH1weGA7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncG9ydHJhaXQnOlxuICAgICAgICB0aGlzLl90ZXh0RGl2LnN0eWxlLmhlaWdodCA9IGAke2hlaWdodCAtIHdpZHRofXB4YDtcbiAgICAgICAgdGhpcy5fdGV4dERpdi5zdHlsZS53aWR0aCA9IGAke3dpZHRofXB4YDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgX3NlbmRDb29yZGluYXRlcygpIHtcbiAgICBpZiAodGhpcy5fY3VycmVudENvb3JkaW5hdGVzICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9idXR0b24uY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTtcbiAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IHRoaXMuX2N1cnJlbnRDb29yZGluYXRlcztcbiAgICAgIGNsaWVudC5zZW5kKHRoaXMubmFtZSArICc6Y29vcmRpbmF0ZXMnLCBjbGllbnQuY29vcmRpbmF0ZXMpO1xuICAgICAgdGhpcy5kb25lKCk7XG4gICAgfVxuICB9XG5cbiAgX3RvdWNoU3RhcnRIYW5kbGVyKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBpZiAodGhpcy5fcG9zaXRpb25EaXYuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRkZW4nKSkge1xuICAgICAgdGhpcy5fcG9zaXRpb25EaXYuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gICAgICB0aGlzLl9idXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gICAgICB0aGlzLl90ZXh0LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgIH1cblxuICAgIC8vIFRPRE86IGhhbmRsZSBtaXJyb3JcbiAgICB0aGlzLl9wb3NpdGlvbkRpdi5zdHlsZS5sZWZ0ID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYIC0gdGhpcy5fcG9zaXRpb25SYWRpdXMgKyBcInB4XCI7XG4gICAgdGhpcy5fcG9zaXRpb25EaXYuc3R5bGUudG9wID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZIC0gdGhpcy5fcG9zaXRpb25SYWRpdXMgKyBcInB4XCI7XG4gIH1cblxuICBfdG91Y2hNb3ZlSGFuZGxlcihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgLy8gVE9ETzogaGFuZGxlIG1pcnJvclxuICAgIHRoaXMuX3Bvc2l0aW9uRGl2LnN0eWxlLmxlZnQgPSBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFggLSB0aGlzLl9wb3NpdGlvblJhZGl1cyArIFwicHhcIjtcbiAgICB0aGlzLl9wb3NpdGlvbkRpdi5zdHlsZS50b3AgPSBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFkgLSB0aGlzLl9wb3NpdGlvblJhZGl1cyArIFwicHhcIjtcblxuICAgIC8vIFRPRE86IGhhbmRsZSBvdXQtb2YtYm91bmRzXG4gIH1cblxuICBfdG91Y2hFbmRIYW5kbGVyKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAvLyBUT0RPOiBoYW5kbGUgbWlycm9yXG4gICAgdGhpcy5fcG9zaXRpb25EaXYuc3R5bGUubGVmdCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WCAtIHRoaXMuX3Bvc2l0aW9uUmFkaXVzICsgXCJweFwiO1xuICAgIHRoaXMuX3Bvc2l0aW9uRGl2LnN0eWxlLnRvcCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WSAtIHRoaXMuX3Bvc2l0aW9uUmFkaXVzICsgXCJweFwiO1xuXG4gICAgbGV0IHggPSAoZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYIC0gdGhpcy5fc3VyZmFjZURpdi5vZmZzZXRMZWZ0KSAvIHRoaXMuX3N1cmZhY2VEaXYub2Zmc2V0V2lkdGg7XG4gICAgbGV0IHkgPSAoZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZIC0gdGhpcy5fc3VyZmFjZURpdi5vZmZzZXRUb3ApIC8gdGhpcy5fc3VyZmFjZURpdi5vZmZzZXRIZWlnaHQ7XG5cbiAgICB0aGlzLl9jdXJyZW50Q29vcmRpbmF0ZXMgPSBbeCwgeV07XG5cbiAgICAvLyBUT0RPOiBoYW5kbGUgb3V0LW9mLWJvdW5kc1xuICB9XG59XG4iXX0=