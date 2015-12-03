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
 * The {@link ClientLocator} allows to indicate the approximate location of the client
 * on a map (that graphically represents a {@link Setup}) via a dialog.
 *
 * @example import { client, ClientLocator, Setup, Space } from 'soundworks/client';
 *
 * const setup = new Setup();
 * const space = new Space();
 * const locator = new ClientLocator({ setup: setup, space: space });
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

var ClientLocator = (function (_Module) {
  _inherits(ClientLocator, _Module);

  /**
   * Creates an instance of the class. Always has a view.
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='locator'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   * @param {Setup} [options.setup=null] Setup in which to indicate the approximate location.
   * @param {Space} [options.space=null] Space to graphically represent the setup.
   * @param {Boolean} [options.showBackground=false] Indicates whether to show the space background image or not.
   */

  function ClientLocator() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ClientLocator);

    _get(Object.getPrototypeOf(ClientLocator.prototype), 'constructor', this).call(this, options.name || 'locator', true, options.color);

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

  _createClass(ClientLocator, [{
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(ClientLocator.prototype), 'start', this).call(this);

      this.send('request');
      this.receive('surface', this._surfaceHandler, false);

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
      _get(Object.getPrototypeOf(ClientLocator.prototype), 'done', this).call(this);
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
      _get(Object.getPrototypeOf(ClientLocator.prototype), 'restart', this).call(this);
      this.send('restart', _client2['default'].coordinates);
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
})(_Module3['default']);

exports['default'] = ClientLocator;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50TG9jYXRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3NCQUFtQixVQUFVOzs7O3VCQUNWLFVBQVU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQTRCUixhQUFhO1lBQWIsYUFBYTs7Ozs7Ozs7Ozs7O0FBVXJCLFdBVlEsYUFBYSxHQVVOO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFWTCxhQUFhOztBQVc5QiwrQkFYaUIsYUFBYSw2Q0FXeEIsT0FBTyxDQUFDLElBQUksSUFBSSxTQUFTLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUU7Ozs7OztBQU10RCxRQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDOzs7Ozs7QUFNbkMsUUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQztBQUNuQyxRQUFJLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxZQUFZLElBQUksc0RBQXNELENBQUM7O0FBRXBHLFFBQUksQ0FBQyxlQUFlLEdBQUcsT0FBTyxDQUFDLGNBQWMsSUFBSSxLQUFLLENBQUM7O0FBRXZELFFBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdELFFBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzNELFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pELFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pELFFBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUs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QkFBbUIsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7O0tBR25DOzs7U0FyT2tCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6InNyYy9jbGllbnQvQ2xpZW50TG9jYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IE1vZHVsZSBmcm9tICcuL01vZHVsZSc7XG5cblxuLyoqXG4gKiBUaGUge0BsaW5rIENsaWVudExvY2F0b3J9IGFsbG93cyB0byBpbmRpY2F0ZSB0aGUgYXBwcm94aW1hdGUgbG9jYXRpb24gb2YgdGhlIGNsaWVudFxuICogb24gYSBtYXAgKHRoYXQgZ3JhcGhpY2FsbHkgcmVwcmVzZW50cyBhIHtAbGluayBTZXR1cH0pIHZpYSBhIGRpYWxvZy5cbiAqXG4gKiBAZXhhbXBsZSBpbXBvcnQgeyBjbGllbnQsIENsaWVudExvY2F0b3IsIFNldHVwLCBTcGFjZSB9IGZyb20gJ3NvdW5kd29ya3MvY2xpZW50JztcbiAqXG4gKiBjb25zdCBzZXR1cCA9IG5ldyBTZXR1cCgpO1xuICogY29uc3Qgc3BhY2UgPSBuZXcgU3BhY2UoKTtcbiAqIGNvbnN0IGxvY2F0b3IgPSBuZXcgQ2xpZW50TG9jYXRvcih7IHNldHVwOiBzZXR1cCwgc3BhY2U6IHNwYWNlIH0pO1xuICogLy8gLi4uIGluc3RhbnRpYXRlIG90aGVyIG1vZHVsZXNcbiAqXG4gKiAvLyBJbml0aWFsaXplIHRoZSBjbGllbnQgKGluZGljYXRlIHRoZSBjbGllbnQgdHlwZSlcbiAqIGNsaWVudC5pbml0KCdjbGllbnRUeXBlJyk7XG4gKlxuICogLy8gU3RhcnQgdGhlIHNjZW5hcmlvXG4gKiBjbGllbnQuc3RhcnQoKHNlcmlhbCwgcGFyYWxsZWwpID0+IHtcbiAqICAgLy8gTWFrZSBzdXJlIHRoYXQgdGhlIGBzZXR1cGAgYW5kIGBzcGFjZWAgYXJlIGluaXRpYWxpemVkIGJlZm9yZSB0aGV5IGFyZVxuICogICAvLyB1c2VkIGJ5IHRoZSBsb2NhdG9yICg9PiB3ZSB1c2UgdGhlIGBzZXJpYWxgIGZ1bmN0aW9uKS5cbiAqICAgc2VyaWFsKFxuICogICAgIHBhcmFsbGVsKHNldHVwLCBzcGFjZSksXG4gKiAgICAgbG9jYXRvcixcbiAqICAgICAvLyAuLi4gb3RoZXIgbW9kdWxlc1xuICogICApXG4gKiB9KTtcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50TG9jYXRvciBleHRlbmRzIE1vZHVsZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy4gQWx3YXlzIGhhcyBhIHZpZXcuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm5hbWU9J2xvY2F0b3InXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nYmxhY2snXSBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBgdmlld2AuXG4gICAqIEBwYXJhbSB7U2V0dXB9IFtvcHRpb25zLnNldHVwPW51bGxdIFNldHVwIGluIHdoaWNoIHRvIGluZGljYXRlIHRoZSBhcHByb3hpbWF0ZSBsb2NhdGlvbi5cbiAgICogQHBhcmFtIHtTcGFjZX0gW29wdGlvbnMuc3BhY2U9bnVsbF0gU3BhY2UgdG8gZ3JhcGhpY2FsbHkgcmVwcmVzZW50IHRoZSBzZXR1cC5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5zaG93QmFja2dyb3VuZD1mYWxzZV0gSW5kaWNhdGVzIHdoZXRoZXIgdG8gc2hvdyB0aGUgc3BhY2UgYmFja2dyb3VuZCBpbWFnZSBvciBub3QuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ2xvY2F0b3InLCB0cnVlLCBvcHRpb25zLmNvbG9yKTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBzcGFjZSBpbiB3aGljaCB0byBpbmRpY2F0ZSB0aGUgYXBwcm94aW1hdGUgbG9jYXRpb24uXG4gICAgICogQHR5cGUge0NsaWVudFNwYWNlfVxuICAgICAqL1xuICAgIHRoaXMuc3BhY2UgPSBvcHRpb25zLnNwYWNlIHx8IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgc2V0dXAgaW4gd2hpY2ggdG8gaW5kaWNhdGUgdGhlIGFwcHJveGltYXRlIGxvY2F0aW9uLlxuICAgICAqIEB0eXBlIHtDbGllbnRTZXR1cH1cbiAgICAgKi9cbiAgICB0aGlzLnNldHVwID0gb3B0aW9ucy5zZXR1cCB8fCBudWxsO1xuICAgIHRoaXMuX2luc3RydWN0aW9ucyA9IG9wdGlvbnMuaW5zdHJ1Y3Rpb25zIHx8ICc8c21hbGw+SW5kaXF1ZXogdm90cmUgcG9zaXRpb24gZGFucyBsYSBzYWxsZTwvc21hbGw+JztcblxuICAgIHRoaXMuX3Nob3dCYWNrZ3JvdW5kID0gb3B0aW9ucy5zaG93QmFja2dyb3VuZCB8fCBmYWxzZTtcblxuICAgIHRoaXMuX3RvdWNoU3RhcnRIYW5kbGVyID0gdGhpcy5fdG91Y2hTdGFydEhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICB0aGlzLl90b3VjaE1vdmVIYW5kbGVyID0gdGhpcy5fdG91Y2hNb3ZlSGFuZGxlci5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX3RvdWNoRW5kSGFuZGxlciA9IHRoaXMuX3RvdWNoRW5kSGFuZGxlci5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX3NlbmRDb29yZGluYXRlcyA9IHRoaXMuX3NlbmRDb29yZGluYXRlcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX3N1cmZhY2VIYW5kbGVyID0gdGhpcy5fc3VyZmFjZUhhbmRsZXIuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuX2N1cnJlbnRDb29yZGluYXRlcyA9IG51bGw7XG4gICAgdGhpcy5fcG9zaXRpb25SYWRpdXMgPSAyMDtcblxuICAgIC8vIEV4cGxhbmF0b3J5IHRleHRcbiAgICBsZXQgdGV4dERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRleHREaXYuY2xhc3NMaXN0LmFkZCgnbWVzc2FnZScpO1xuICAgIGxldCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIHRleHQuaW5uZXJIVE1MID0gdGhpcy5faW5zdHJ1Y3Rpb25zO1xuICAgIHRoaXMuX3RleHREaXYgPSB0ZXh0RGl2O1xuICAgIHRoaXMuX3RleHQgPSB0ZXh0O1xuXG4gICAgLy8gQnV0dG9uXG4gICAgbGV0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdidG4nKTtcbiAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgYnV0dG9uLmlubmVySFRNTCA9IFwiVmFsaWRlclwiO1xuICAgIHRoaXMuX2J1dHRvbiA9IGJ1dHRvbjtcblxuICAgIC8vIFBvc2l0aW9uIGNpcmNsZVxuICAgIGxldCBwb3NpdGlvbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHBvc2l0aW9uRGl2LnNldEF0dHJpYnV0ZSgnaWQnLCAncG9zaXRpb24nKTtcbiAgICBwb3NpdGlvbkRpdi5jbGFzc0xpc3QuYWRkKCdwb3NpdGlvbicpO1xuICAgIHBvc2l0aW9uRGl2LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgIHBvc2l0aW9uRGl2LnN0eWxlLndpZHRoID0gdGhpcy5fcG9zaXRpb25SYWRpdXMgKiAyICsgXCJweFwiO1xuICAgIHBvc2l0aW9uRGl2LnN0eWxlLmhlaWdodCA9IHRoaXMuX3Bvc2l0aW9uUmFkaXVzICogMiArIFwicHhcIjtcbiAgICB0aGlzLl9wb3NpdGlvbkRpdiA9IHBvc2l0aW9uRGl2O1xuXG4gICAgLy8gU3VyZmFjZSBkaXZcbiAgICBsZXQgc3VyZmFjZURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHN1cmZhY2VEaXYuc2V0QXR0cmlidXRlKCdpZCcsICdzdXJmYWNlJyk7XG4gICAgc3VyZmFjZURpdi5jbGFzc0xpc3QuYWRkKCdzdXJmYWNlJyk7XG4gICAgdGhpcy5fc3VyZmFjZURpdiA9IHN1cmZhY2VEaXY7XG5cbiAgICB0aGlzLl90ZXh0RGl2LmFwcGVuZENoaWxkKHRoaXMuX3RleHQpO1xuICAgIHRoaXMuX3RleHREaXYuYXBwZW5kQ2hpbGQodGhpcy5fYnV0dG9uKTtcbiAgICB0aGlzLl9zdXJmYWNlRGl2LmFwcGVuZENoaWxkKHRoaXMuX3Bvc2l0aW9uRGl2KTtcblxuICAgIHRoaXMuX3Jlc2l6ZSA9IHRoaXMuX3Jlc2l6ZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0cyB0aGUgbW9kdWxlLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIHRoaXMuc2VuZCgncmVxdWVzdCcpO1xuICAgIHRoaXMucmVjZWl2ZSgnc3VyZmFjZScsIHRoaXMuX3N1cmZhY2VIYW5kbGVyLCBmYWxzZSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fcmVzaXplKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEb25lIG1ldGhvZC5cbiAgICogUmVtb3ZlcyB0aGUgYCdyZXNpemUnYCBsaXN0ZW5lciBvbiB0aGUgYHdpbmRvd2AuXG4gICAqL1xuICBkb25lKCkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9yZXNpemUpO1xuICAgIHN1cGVyLmRvbmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldHMgdGhlIG1vZHVsZSB0byBpbml0aWFsIHN0YXRlLlxuICAgKi9cbiAgcmVzZXQoKSB7XG4gICAgY2xpZW50LmNvb3JkaW5hdGVzID0gbnVsbDtcblxuICAgIHRoaXMuX3Bvc2l0aW9uRGl2LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgIHRoaXMuX3RleHQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gICAgdGhpcy5fYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuXG4gICAgdGhpcy5fYnV0dG9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fc2VuZENvb3JkaW5hdGVzLCBmYWxzZSk7XG4gICAgdGhpcy5fc3VyZmFjZURpdi5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5fdG91Y2hTdGFydEhhbmRsZXIsIGZhbHNlKTtcbiAgICB0aGlzLl9zdXJmYWNlRGl2LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMuX3RvdWNoTW92ZUhhbmRsZXIsIGZhbHNlKTtcbiAgICB0aGlzLl9zdXJmYWNlRGl2LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5fdG91Y2hFbmRIYW5kbGVyLCBmYWxzZSk7XG5cbiAgICAvLyBUT0RPOiBjbGVhbiBzdXJmYWNlIHByb3Blcmx5XG4gICAgaWYgKHRoaXMuc3BhY2UpXG4gICAgICB0aGlzLnNwYWNlLnJlc2V0KCk7XG4gIH1cblxuICAvKipcbiAgICogUmVzdGFydHMgdGhlIG1vZHVsZS5cbiAgICovXG4gIHJlc3RhcnQoKSB7XG4gICAgc3VwZXIucmVzdGFydCgpO1xuICAgIHRoaXMuc2VuZCgncmVzdGFydCcsIGNsaWVudC5jb29yZGluYXRlcyk7XG4gICAgdGhpcy5fYnV0dG9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fc2VuZENvb3JkaW5hdGVzLCBmYWxzZSk7XG4gICAgdGhpcy5kb25lKCk7XG4gIH1cblxuICBfc3VyZmFjZUhhbmRsZXIoc3VyZmFjZSkge1xuICAgIGxldCBoZWlnaHRXaWR0aFJhdGlvID0gc3VyZmFjZS5oZWlnaHQgLyBzdXJmYWNlLndpZHRoO1xuICAgIGxldCBzY3JlZW5IZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgbGV0IHNjcmVlbldpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgbGV0IHNjcmVlblJhdGlvID0gc2NyZWVuSGVpZ2h0IC8gc2NyZWVuV2lkdGg7XG4gICAgbGV0IGhlaWdodFB4LCB3aWR0aFB4O1xuXG4gICAgaWYgKHNjcmVlblJhdGlvID4gaGVpZ2h0V2lkdGhSYXRpbykgeyAvLyBUT0RPOiByZWZpbmUgc2l6ZXMsIHdpdGggY29udGFpbmVyLCBldGMuXG4gICAgICBoZWlnaHRQeCA9IHNjcmVlbldpZHRoICogaGVpZ2h0V2lkdGhSYXRpbztcbiAgICAgIHdpZHRoUHggPSBzY3JlZW5XaWR0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgaGVpZ2h0UHggPSBzY3JlZW5IZWlnaHQ7XG4gICAgICB3aWR0aFB4ID0gc2NyZWVuSGVpZ2h0IC8gaGVpZ2h0V2lkdGhSYXRpbztcbiAgICB9XG5cbiAgICB0aGlzLnNwYWNlLmRpc3BsYXkodGhpcy5zZXR1cCwgdGhpcy5fc3VyZmFjZURpdiwge1xuICAgICAgc2hvd0JhY2tncm91bmQ6IHRoaXMuX3Nob3dCYWNrZ3JvdW5kXG4gICAgfSk7XG5cbiAgICAvLyBMZXQgdGhlIHBhcnRpY2lwYW50IHNlbGVjdCBoaXMgb3IgaGVyIGxvY2F0aW9uXG4gICAgdGhpcy5fc3VyZmFjZURpdi5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5fdG91Y2hTdGFydEhhbmRsZXIsIGZhbHNlKTtcbiAgICB0aGlzLl9zdXJmYWNlRGl2LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMuX3RvdWNoTW92ZUhhbmRsZXIsIGZhbHNlKTtcbiAgICB0aGlzLl9zdXJmYWNlRGl2LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5fdG91Y2hFbmRIYW5kbGVyLCBmYWxzZSk7XG5cbiAgICAvLyBCdWlsZCB0ZXh0ICYgYnV0dG9uIGludGVyZmFjZSBhZnRlciByZWNlaXZpbmcgYW5kIGRpc3BsYXlpbmcgdGhlIHN1cmZhY2VcbiAgICB0aGlzLnZpZXcuYXBwZW5kQ2hpbGQodGhpcy5fc3VyZmFjZURpdik7XG4gICAgdGhpcy52aWV3LmFwcGVuZENoaWxkKHRoaXMuX3RleHREaXYpO1xuXG4gICAgdGhpcy5fcmVzaXplKCk7XG4gICAgLy8gU2VuZCB0aGUgY29vcmRpbmF0ZXMgb2YgdGhlIHNlbGVjdGVkIGxvY2F0aW9uIHRvIHNlcnZlclxuICAgIHRoaXMuX2J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX3NlbmRDb29yZGluYXRlcywgZmFsc2UpO1xuICB9XG5cbiAgX3Jlc2l6ZSgpIHtcbiAgICBjb25zdCB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIGNvbnN0IGhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuICAgIGNvbnN0IG9yaWVudGF0aW9uID0gd2lkdGggPiBoZWlnaHQgPyAnbGFuZHNjYXBlJyA6ICdwb3J0cmFpdCc7XG4gICAgdGhpcy52aWV3LmNsYXNzTGlzdC5yZW1vdmUoJ2xhbmRzY2FwZScsICdwb3J0cmFpdCcpO1xuICAgIHRoaXMudmlldy5jbGFzc0xpc3QuYWRkKG9yaWVudGF0aW9uKTtcblxuICAgIGNvbnN0IG1pbiA9IE1hdGgubWluKHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgdGhpcy5fc3VyZmFjZURpdi5zdHlsZS53aWR0aCA9IGAke21pbn1weGA7XG4gICAgdGhpcy5fc3VyZmFjZURpdi5zdHlsZS5oZWlnaHQgPSBgJHttaW59cHhgO1xuXG4gICAgc3dpdGNoIChvcmllbnRhdGlvbikge1xuICAgICAgY2FzZSAnbGFuZHNjYXBlJyA6XG4gICAgICAgIHRoaXMuX3RleHREaXYuc3R5bGUuaGVpZ2h0ID0gYCR7aGVpZ2h0fXB4YDtcbiAgICAgICAgdGhpcy5fdGV4dERpdi5zdHlsZS53aWR0aCA9IGAke3dpZHRoIC0gaGVpZ2h0fXB4YDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdwb3J0cmFpdCc6XG4gICAgICAgIHRoaXMuX3RleHREaXYuc3R5bGUuaGVpZ2h0ID0gYCR7aGVpZ2h0IC0gd2lkdGh9cHhgO1xuICAgICAgICB0aGlzLl90ZXh0RGl2LnN0eWxlLndpZHRoID0gYCR7d2lkdGh9cHhgO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBfc2VuZENvb3JkaW5hdGVzKCkge1xuICAgIGlmICh0aGlzLl9jdXJyZW50Q29vcmRpbmF0ZXMgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuX2J1dHRvbi5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xuICAgICAgY2xpZW50LmNvb3JkaW5hdGVzID0gdGhpcy5fY3VycmVudENvb3JkaW5hdGVzO1xuICAgICAgdGhpcy5zZW5kKCdjb29yZGluYXRlcycsIGNsaWVudC5jb29yZGluYXRlcyk7XG4gICAgICB0aGlzLmRvbmUoKTtcbiAgICB9XG4gIH1cblxuICBfdG91Y2hTdGFydEhhbmRsZXIoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIGlmICh0aGlzLl9wb3NpdGlvbkRpdi5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZGRlbicpKSB7XG4gICAgICB0aGlzLl9wb3NpdGlvbkRpdi5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICAgIHRoaXMuX2J1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICAgIHRoaXMuX3RleHQuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgfVxuXG4gICAgLy8gVE9ETzogaGFuZGxlIG1pcnJvclxuICAgIHRoaXMuX3Bvc2l0aW9uRGl2LnN0eWxlLmxlZnQgPSBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFggLSB0aGlzLl9wb3NpdGlvblJhZGl1cyArIFwicHhcIjtcbiAgICB0aGlzLl9wb3NpdGlvbkRpdi5zdHlsZS50b3AgPSBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFkgLSB0aGlzLl9wb3NpdGlvblJhZGl1cyArIFwicHhcIjtcbiAgfVxuXG4gIF90b3VjaE1vdmVIYW5kbGVyKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAvLyBUT0RPOiBoYW5kbGUgbWlycm9yXG4gICAgdGhpcy5fcG9zaXRpb25EaXYuc3R5bGUubGVmdCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WCAtIHRoaXMuX3Bvc2l0aW9uUmFkaXVzICsgXCJweFwiO1xuICAgIHRoaXMuX3Bvc2l0aW9uRGl2LnN0eWxlLnRvcCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WSAtIHRoaXMuX3Bvc2l0aW9uUmFkaXVzICsgXCJweFwiO1xuXG4gICAgLy8gVE9ETzogaGFuZGxlIG91dC1vZi1ib3VuZHNcbiAgfVxuXG4gIF90b3VjaEVuZEhhbmRsZXIoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIC8vIFRPRE86IGhhbmRsZSBtaXJyb3JcbiAgICB0aGlzLl9wb3NpdGlvbkRpdi5zdHlsZS5sZWZ0ID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYIC0gdGhpcy5fcG9zaXRpb25SYWRpdXMgKyBcInB4XCI7XG4gICAgdGhpcy5fcG9zaXRpb25EaXYuc3R5bGUudG9wID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZIC0gdGhpcy5fcG9zaXRpb25SYWRpdXMgKyBcInB4XCI7XG5cbiAgICBsZXQgeCA9IChlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFggLSB0aGlzLl9zdXJmYWNlRGl2Lm9mZnNldExlZnQpIC8gdGhpcy5fc3VyZmFjZURpdi5vZmZzZXRXaWR0aDtcbiAgICBsZXQgeSA9IChlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFkgLSB0aGlzLl9zdXJmYWNlRGl2Lm9mZnNldFRvcCkgLyB0aGlzLl9zdXJmYWNlRGl2Lm9mZnNldEhlaWdodDtcblxuICAgIHRoaXMuX2N1cnJlbnRDb29yZGluYXRlcyA9IFt4LCB5XTtcblxuICAgIC8vIFRPRE86IGhhbmRsZSBvdXQtb2YtYm91bmRzXG4gIH1cbn1cbiJdfQ==