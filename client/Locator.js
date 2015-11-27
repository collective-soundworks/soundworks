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
 * [client] Allow to indicate the approximate location of the client on a map (that graphically represents a {@link Setup}) via a dialog.
 *
 * The module always has a view (that displays the map and a button to validate the location) and requires the SASS partial `_77-locator.scss`.
 *
 * The module finishes its initialization after the user confirms his / her approximate location by clicking on the “Validate” button.
 *
 * @example const setup = new Setup();
 * const space = new Space();
 * const locator = new Locator({ setup: setup, space: space });
 */

var Locator = (function (_Module) {
  _inherits(Locator, _Module);

  /**
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
     * The space that graphically represents the setup in which to indicate the approximate location.
     * @type {Space}
     */
    this.space = options.space || null;

    /**
     * The setup in which to indicate the approximate location.
     * @type {Setup}
     */
    this.setup = options.setup || null;

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
     * Remove the `'resize'` listener on the `window`.
     * @private
     */
  }, {
    key: 'done',
    value: function done() {
      window.removeEventListener('resize', this._resize);
      _get(Object.getPrototypeOf(Locator.prototype), 'done', this).call(this);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvTG9jYXRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3NCQUFtQixVQUFVOzs7O3VCQUNWLFVBQVU7Ozs7Ozs7Ozs7Ozs7Ozs7SUFjUixPQUFPO1lBQVAsT0FBTzs7Ozs7Ozs7Ozs7QUFTZixXQVRRLE9BQU8sR0FTQTtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBVEwsT0FBTzs7QUFVeEIsK0JBVmlCLE9BQU8sNkNBVWxCLE9BQU8sQ0FBQyxJQUFJLElBQUksU0FBUyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsS0FBSyxFQUFFOzs7Ozs7QUFNdEQsUUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQzs7Ozs7O0FBTW5DLFFBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUM7O0FBRW5DLFFBQUksQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFDLFlBQVksSUFBSSxzREFBc0QsQ0FBQztBQUNwRyxRQUFJLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQyxjQUFjLElBQUksS0FBSyxDQUFDO0FBQ3ZELFFBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7QUFDaEMsUUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUM7OztBQUcxQixRQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzVDLFdBQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2pDLFFBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdkMsUUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO0FBQ3BDLFFBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO0FBQ3hCLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDOzs7QUFHbEIsUUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMzQyxVQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1QixVQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixVQUFNLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztBQUM3QixRQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQzs7O0FBR3RCLFFBQUksV0FBVyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDaEQsZUFBVyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDM0MsZUFBVyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDdEMsZUFBVyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDcEMsZUFBVyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQzFELGVBQVcsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUMzRCxRQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQzs7O0FBR2hDLFFBQUksVUFBVSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDL0MsY0FBVSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDekMsY0FBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDcEMsUUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7OztBQUc5QixRQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdEMsUUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3hDLFFBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQzs7O0FBR2hELFFBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdELFFBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzNELFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pELFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pELFFBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkQsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUN4Qzs7Ozs7OztlQXZFa0IsT0FBTzs7V0E2RXJCLGlCQUFHO0FBQ04saUNBOUVpQixPQUFPLHVDQThFVjs7QUFFZCwwQkFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsQ0FBQztBQUNwQywwQkFBTyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFcEUsWUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDakQ7Ozs7Ozs7OztXQU9HLGdCQUFHO0FBQ0wsWUFBTSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDbkQsaUNBN0ZpQixPQUFPLHNDQTZGWDtLQUNkOzs7Ozs7OztXQU1JLGlCQUFHO0FBQ04sMEJBQU8sV0FBVyxHQUFHLElBQUksQ0FBQzs7QUFFMUIsVUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzFDLFVBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN0QyxVQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRXJDLFVBQUksQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUN4RSxVQUFJLENBQUMsV0FBVyxDQUFDLG1CQUFtQixDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsa0JBQWtCLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDbkYsVUFBSSxDQUFDLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2pGLFVBQUksQ0FBQyxXQUFXLENBQUMsbUJBQW1CLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsQ0FBQzs7O0FBRy9FLFVBQUksSUFBSSxDQUFDLEtBQUssRUFDWixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ3RCOzs7Ozs7OztXQU1NLG1CQUFHO0FBQ1IsaUNBMUhpQixPQUFPLHlDQTBIUjtBQUNoQiwwQkFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLEVBQUUsb0JBQU8sV0FBVyxDQUFDLENBQUM7QUFDeEQsVUFBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3hFLFVBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNiOzs7V0FFYyx5QkFBQyxPQUFPLEVBQUU7QUFDdkIsVUFBSSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7QUFDdEQsVUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQztBQUN0QyxVQUFJLFdBQVcsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO0FBQ3BDLFVBQUksV0FBVyxHQUFHLFlBQVksR0FBRyxXQUFXLENBQUM7QUFDN0MsVUFBSSxRQUFRLFlBQUE7VUFBRSxPQUFPLFlBQUEsQ0FBQzs7QUFFdEIsVUFBSSxXQUFXLEdBQUcsZ0JBQWdCLEVBQUU7O0FBQ2xDLGdCQUFRLEdBQUcsV0FBVyxHQUFHLGdCQUFnQixDQUFDO0FBQzFDLGVBQU8sR0FBRyxXQUFXLENBQUM7T0FDdkIsTUFBTTtBQUNMLGdCQUFRLEdBQUcsWUFBWSxDQUFDO0FBQ3hCLGVBQU8sR0FBRyxZQUFZLEdBQUcsZ0JBQWdCLENBQUM7T0FDM0M7O0FBRUQsVUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFO0FBQy9DLHNCQUFjLEVBQUUsSUFBSSxDQUFDLGVBQWU7T0FDckMsQ0FBQyxDQUFDOzs7QUFHSCxVQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsa0JBQWtCLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDaEYsVUFBSSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzlFLFVBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsQ0FBQzs7O0FBRzVFLFVBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUN4QyxVQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRXJDLFVBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7QUFFZixVQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDdEU7OztXQUVNLG1CQUFHO0FBQ1IsVUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztBQUNoQyxVQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDOztBQUVsQyxVQUFNLFdBQVcsR0FBRyxLQUFLLEdBQUcsTUFBTSxHQUFHLFdBQVcsR0FBRyxVQUFVLENBQUM7QUFDOUQsVUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNwRCxVQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRXJDLFVBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDOztBQUVwQyxVQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQU0sR0FBRyxPQUFJLENBQUM7QUFDMUMsVUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFNLEdBQUcsT0FBSSxDQUFDOztBQUUzQyxjQUFRLFdBQVc7QUFDakIsYUFBSyxXQUFXO0FBQ2QsY0FBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFNLE1BQU0sT0FBSSxDQUFDO0FBQzNDLGNBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBTSxLQUFLLEdBQUcsTUFBTSxPQUFJLENBQUM7QUFDbEQsZ0JBQU07QUFBQSxBQUNSLGFBQUssVUFBVTtBQUNiLGNBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBTSxNQUFNLEdBQUcsS0FBSyxPQUFJLENBQUM7QUFDbkQsY0FBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFNLEtBQUssT0FBSSxDQUFDO0FBQ3pDLGdCQUFNO0FBQUEsT0FDVDtLQUNGOzs7V0FFZSw0QkFBRztBQUNqQixVQUFJLElBQUksQ0FBQyxtQkFBbUIsS0FBSyxJQUFJLEVBQUU7QUFDckMsWUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZDLDRCQUFPLFdBQVcsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUM7QUFDOUMsNEJBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsY0FBYyxFQUFFLG9CQUFPLFdBQVcsQ0FBQyxDQUFDO0FBQzVELFlBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztPQUNiO0tBQ0Y7OztXQUVpQiw0QkFBQyxDQUFDLEVBQUU7QUFDcEIsT0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDOztBQUVuQixVQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUNsRCxZQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDN0MsWUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3hDLFlBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztPQUNwQzs7O0FBR0QsVUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO0FBQ3pGLFVBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztLQUN6Rjs7O1dBRWdCLDJCQUFDLENBQUMsRUFBRTtBQUNuQixPQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7OztBQUduQixVQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7QUFDekYsVUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDOzs7S0FHekY7OztXQUVlLDBCQUFDLENBQUMsRUFBRTtBQUNsQixPQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7OztBQUduQixVQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7QUFDekYsVUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDOztBQUV4RixVQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFBLEdBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUM7QUFDbkcsVUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQSxHQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDOztBQUVuRyxVQUFJLENBQUMsbUJBQW1CLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7OztLQUduQzs7O1NBeE9rQixPQUFPOzs7cUJBQVAsT0FBTyIsImZpbGUiOiJzcmMvY2xpZW50L0xvY2F0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCBNb2R1bGUgZnJvbSAnLi9Nb2R1bGUnO1xuXG5cbi8qKlxuICogW2NsaWVudF0gQWxsb3cgdG8gaW5kaWNhdGUgdGhlIGFwcHJveGltYXRlIGxvY2F0aW9uIG9mIHRoZSBjbGllbnQgb24gYSBtYXAgKHRoYXQgZ3JhcGhpY2FsbHkgcmVwcmVzZW50cyBhIHtAbGluayBTZXR1cH0pIHZpYSBhIGRpYWxvZy5cbiAqXG4gKiBUaGUgbW9kdWxlIGFsd2F5cyBoYXMgYSB2aWV3ICh0aGF0IGRpc3BsYXlzIHRoZSBtYXAgYW5kIGEgYnV0dG9uIHRvIHZhbGlkYXRlIHRoZSBsb2NhdGlvbikgYW5kIHJlcXVpcmVzIHRoZSBTQVNTIHBhcnRpYWwgYF83Ny1sb2NhdG9yLnNjc3NgLlxuICpcbiAqIFRoZSBtb2R1bGUgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uIGFmdGVyIHRoZSB1c2VyIGNvbmZpcm1zIGhpcyAvIGhlciBhcHByb3hpbWF0ZSBsb2NhdGlvbiBieSBjbGlja2luZyBvbiB0aGUg4oCcVmFsaWRhdGXigJ0gYnV0dG9uLlxuICpcbiAqIEBleGFtcGxlIGNvbnN0IHNldHVwID0gbmV3IFNldHVwKCk7XG4gKiBjb25zdCBzcGFjZSA9IG5ldyBTcGFjZSgpO1xuICogY29uc3QgbG9jYXRvciA9IG5ldyBMb2NhdG9yKHsgc2V0dXA6IHNldHVwLCBzcGFjZTogc3BhY2UgfSk7XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvY2F0b3IgZXh0ZW5kcyBNb2R1bGUge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nbG9jYXRvciddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yPSdibGFjayddIEJhY2tncm91bmQgY29sb3Igb2YgdGhlIGB2aWV3YC5cbiAgICogQHBhcmFtIHtTZXR1cH0gW29wdGlvbnMuc2V0dXA9bnVsbF0gU2V0dXAgaW4gd2hpY2ggdG8gaW5kaWNhdGUgdGhlIGFwcHJveGltYXRlIGxvY2F0aW9uLlxuICAgKiBAcGFyYW0ge1NwYWNlfSBbb3B0aW9ucy5zcGFjZT1udWxsXSBTcGFjZSB0byBncmFwaGljYWxseSByZXByZXNlbnQgdGhlIHNldHVwLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnNob3dCYWNrZ3JvdW5kPWZhbHNlXSBJbmRpY2F0ZXMgd2hldGhlciB0byBzaG93IHRoZSBzcGFjZSBiYWNrZ3JvdW5kIGltYWdlIG9yIG5vdC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnbG9jYXRvcicsIHRydWUsIG9wdGlvbnMuY29sb3IpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHNwYWNlIHRoYXQgZ3JhcGhpY2FsbHkgcmVwcmVzZW50cyB0aGUgc2V0dXAgaW4gd2hpY2ggdG8gaW5kaWNhdGUgdGhlIGFwcHJveGltYXRlIGxvY2F0aW9uLlxuICAgICAqIEB0eXBlIHtTcGFjZX1cbiAgICAgKi9cbiAgICB0aGlzLnNwYWNlID0gb3B0aW9ucy5zcGFjZSB8fCBudWxsO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHNldHVwIGluIHdoaWNoIHRvIGluZGljYXRlIHRoZSBhcHByb3hpbWF0ZSBsb2NhdGlvbi5cbiAgICAgKiBAdHlwZSB7U2V0dXB9XG4gICAgICovXG4gICAgdGhpcy5zZXR1cCA9IG9wdGlvbnMuc2V0dXAgfHwgbnVsbDtcblxuICAgIHRoaXMuX2luc3RydWN0aW9ucyA9IG9wdGlvbnMuaW5zdHJ1Y3Rpb25zIHx8ICc8c21hbGw+SW5kaXF1ZXogdm90cmUgcG9zaXRpb24gZGFucyBsYSBzYWxsZTwvc21hbGw+JztcbiAgICB0aGlzLl9zaG93QmFja2dyb3VuZCA9IG9wdGlvbnMuc2hvd0JhY2tncm91bmQgfHwgZmFsc2U7XG4gICAgdGhpcy5fY3VycmVudENvb3JkaW5hdGVzID0gbnVsbDtcbiAgICB0aGlzLl9wb3NpdGlvblJhZGl1cyA9IDIwO1xuXG4gICAgLy8gRXhwbGFuYXRvcnkgdGV4dFxuICAgIGxldCB0ZXh0RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGV4dERpdi5jbGFzc0xpc3QuYWRkKCdtZXNzYWdlJyk7XG4gICAgbGV0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgdGV4dC5pbm5lckhUTUwgPSB0aGlzLl9pbnN0cnVjdGlvbnM7XG4gICAgdGhpcy5fdGV4dERpdiA9IHRleHREaXY7XG4gICAgdGhpcy5fdGV4dCA9IHRleHQ7XG5cbiAgICAvLyBCdXR0b25cbiAgICBsZXQgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2J0bicpO1xuICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICBidXR0b24uaW5uZXJIVE1MID0gXCJWYWxpZGVyXCI7XG4gICAgdGhpcy5fYnV0dG9uID0gYnV0dG9uO1xuXG4gICAgLy8gUG9zaXRpb24gY2lyY2xlXG4gICAgbGV0IHBvc2l0aW9uRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcG9zaXRpb25EaXYuc2V0QXR0cmlidXRlKCdpZCcsICdwb3NpdGlvbicpO1xuICAgIHBvc2l0aW9uRGl2LmNsYXNzTGlzdC5hZGQoJ3Bvc2l0aW9uJyk7XG4gICAgcG9zaXRpb25EaXYuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgcG9zaXRpb25EaXYuc3R5bGUud2lkdGggPSB0aGlzLl9wb3NpdGlvblJhZGl1cyAqIDIgKyBcInB4XCI7XG4gICAgcG9zaXRpb25EaXYuc3R5bGUuaGVpZ2h0ID0gdGhpcy5fcG9zaXRpb25SYWRpdXMgKiAyICsgXCJweFwiO1xuICAgIHRoaXMuX3Bvc2l0aW9uRGl2ID0gcG9zaXRpb25EaXY7XG5cbiAgICAvLyBTdXJmYWNlIGRpdlxuICAgIGxldCBzdXJmYWNlRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgc3VyZmFjZURpdi5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3N1cmZhY2UnKTtcbiAgICBzdXJmYWNlRGl2LmNsYXNzTGlzdC5hZGQoJ3N1cmZhY2UnKTtcbiAgICB0aGlzLl9zdXJmYWNlRGl2ID0gc3VyZmFjZURpdjtcblxuICAgIC8vIENvbnN0cnVjdCBET01cbiAgICB0aGlzLl90ZXh0RGl2LmFwcGVuZENoaWxkKHRoaXMuX3RleHQpO1xuICAgIHRoaXMuX3RleHREaXYuYXBwZW5kQ2hpbGQodGhpcy5fYnV0dG9uKTtcbiAgICB0aGlzLl9zdXJmYWNlRGl2LmFwcGVuZENoaWxkKHRoaXMuX3Bvc2l0aW9uRGl2KTtcblxuICAgIC8vIE1ldGhvZCBiaW5kaW5nc1xuICAgIHRoaXMuX3RvdWNoU3RhcnRIYW5kbGVyID0gdGhpcy5fdG91Y2hTdGFydEhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICB0aGlzLl90b3VjaE1vdmVIYW5kbGVyID0gdGhpcy5fdG91Y2hNb3ZlSGFuZGxlci5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX3RvdWNoRW5kSGFuZGxlciA9IHRoaXMuX3RvdWNoRW5kSGFuZGxlci5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX3NlbmRDb29yZGluYXRlcyA9IHRoaXMuX3NlbmRDb29yZGluYXRlcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX3N1cmZhY2VIYW5kbGVyID0gdGhpcy5fc3VyZmFjZUhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9yZXNpemUgPSB0aGlzLl9yZXNpemUuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgbW9kdWxlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGNsaWVudC5zZW5kKHRoaXMubmFtZSArICc6cmVxdWVzdCcpO1xuICAgIGNsaWVudC5yZWNlaXZlKHRoaXMubmFtZSArICc6c3VyZmFjZScsIHRoaXMuX3N1cmZhY2VIYW5kbGVyLCBmYWxzZSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fcmVzaXplKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEb25lIG1ldGhvZC5cbiAgICogUmVtb3ZlIHRoZSBgJ3Jlc2l6ZSdgIGxpc3RlbmVyIG9uIHRoZSBgd2luZG93YC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRvbmUoKSB7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3Jlc2l6ZSk7XG4gICAgc3VwZXIuZG9uZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IHRoZSBtb2R1bGUgdG8gaW5pdGlhbCBzdGF0ZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlc2V0KCkge1xuICAgIGNsaWVudC5jb29yZGluYXRlcyA9IG51bGw7XG5cbiAgICB0aGlzLl9wb3NpdGlvbkRpdi5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICB0aGlzLl90ZXh0LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgIHRoaXMuX2J1dHRvbi5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcblxuICAgIHRoaXMuX2J1dHRvbi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX3NlbmRDb29yZGluYXRlcywgZmFsc2UpO1xuICAgIHRoaXMuX3N1cmZhY2VEaXYucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuX3RvdWNoU3RhcnRIYW5kbGVyLCBmYWxzZSk7XG4gICAgdGhpcy5fc3VyZmFjZURpdi5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLl90b3VjaE1vdmVIYW5kbGVyLCBmYWxzZSk7XG4gICAgdGhpcy5fc3VyZmFjZURpdi5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMuX3RvdWNoRW5kSGFuZGxlciwgZmFsc2UpO1xuXG4gICAgLy8gVE9ETzogY2xlYW4gc3VyZmFjZSBwcm9wZXJseVxuICAgIGlmICh0aGlzLnNwYWNlKVxuICAgICAgdGhpcy5zcGFjZS5yZXNldCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc3RhcnQgdGhlIG1vZHVsZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlc3RhcnQoKSB7XG4gICAgc3VwZXIucmVzdGFydCgpO1xuICAgIGNsaWVudC5zZW5kKHRoaXMubmFtZSArICc6cmVzdGFydCcsIGNsaWVudC5jb29yZGluYXRlcyk7XG4gICAgdGhpcy5fYnV0dG9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fc2VuZENvb3JkaW5hdGVzLCBmYWxzZSk7XG4gICAgdGhpcy5kb25lKCk7XG4gIH1cblxuICBfc3VyZmFjZUhhbmRsZXIoc3VyZmFjZSkge1xuICAgIGxldCBoZWlnaHRXaWR0aFJhdGlvID0gc3VyZmFjZS5oZWlnaHQgLyBzdXJmYWNlLndpZHRoO1xuICAgIGxldCBzY3JlZW5IZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgbGV0IHNjcmVlbldpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgbGV0IHNjcmVlblJhdGlvID0gc2NyZWVuSGVpZ2h0IC8gc2NyZWVuV2lkdGg7XG4gICAgbGV0IGhlaWdodFB4LCB3aWR0aFB4O1xuXG4gICAgaWYgKHNjcmVlblJhdGlvID4gaGVpZ2h0V2lkdGhSYXRpbykgeyAvLyBUT0RPOiByZWZpbmUgc2l6ZXMsIHdpdGggY29udGFpbmVyLCBldGMuXG4gICAgICBoZWlnaHRQeCA9IHNjcmVlbldpZHRoICogaGVpZ2h0V2lkdGhSYXRpbztcbiAgICAgIHdpZHRoUHggPSBzY3JlZW5XaWR0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgaGVpZ2h0UHggPSBzY3JlZW5IZWlnaHQ7XG4gICAgICB3aWR0aFB4ID0gc2NyZWVuSGVpZ2h0IC8gaGVpZ2h0V2lkdGhSYXRpbztcbiAgICB9XG5cbiAgICB0aGlzLnNwYWNlLmRpc3BsYXkodGhpcy5zZXR1cCwgdGhpcy5fc3VyZmFjZURpdiwge1xuICAgICAgc2hvd0JhY2tncm91bmQ6IHRoaXMuX3Nob3dCYWNrZ3JvdW5kXG4gICAgfSk7XG5cbiAgICAvLyBMZXQgdGhlIHBhcnRpY2lwYW50IHNlbGVjdCBoaXMgb3IgaGVyIGxvY2F0aW9uXG4gICAgdGhpcy5fc3VyZmFjZURpdi5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5fdG91Y2hTdGFydEhhbmRsZXIsIGZhbHNlKTtcbiAgICB0aGlzLl9zdXJmYWNlRGl2LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMuX3RvdWNoTW92ZUhhbmRsZXIsIGZhbHNlKTtcbiAgICB0aGlzLl9zdXJmYWNlRGl2LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5fdG91Y2hFbmRIYW5kbGVyLCBmYWxzZSk7XG5cbiAgICAvLyBCdWlsZCB0ZXh0ICYgYnV0dG9uIGludGVyZmFjZSBhZnRlciByZWNlaXZpbmcgYW5kIGRpc3BsYXlpbmcgdGhlIHN1cmZhY2VcbiAgICB0aGlzLnZpZXcuYXBwZW5kQ2hpbGQodGhpcy5fc3VyZmFjZURpdik7XG4gICAgdGhpcy52aWV3LmFwcGVuZENoaWxkKHRoaXMuX3RleHREaXYpO1xuXG4gICAgdGhpcy5fcmVzaXplKCk7XG4gICAgLy8gU2VuZCB0aGUgY29vcmRpbmF0ZXMgb2YgdGhlIHNlbGVjdGVkIGxvY2F0aW9uIHRvIHNlcnZlclxuICAgIHRoaXMuX2J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX3NlbmRDb29yZGluYXRlcywgZmFsc2UpO1xuICB9XG5cbiAgX3Jlc2l6ZSgpIHtcbiAgICBjb25zdCB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIGNvbnN0IGhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuICAgIGNvbnN0IG9yaWVudGF0aW9uID0gd2lkdGggPiBoZWlnaHQgPyAnbGFuZHNjYXBlJyA6ICdwb3J0cmFpdCc7XG4gICAgdGhpcy52aWV3LmNsYXNzTGlzdC5yZW1vdmUoJ2xhbmRzY2FwZScsICdwb3J0cmFpdCcpO1xuICAgIHRoaXMudmlldy5jbGFzc0xpc3QuYWRkKG9yaWVudGF0aW9uKTtcblxuICAgIGNvbnN0IG1pbiA9IE1hdGgubWluKHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgdGhpcy5fc3VyZmFjZURpdi5zdHlsZS53aWR0aCA9IGAke21pbn1weGA7XG4gICAgdGhpcy5fc3VyZmFjZURpdi5zdHlsZS5oZWlnaHQgPSBgJHttaW59cHhgO1xuXG4gICAgc3dpdGNoIChvcmllbnRhdGlvbikge1xuICAgICAgY2FzZSAnbGFuZHNjYXBlJyA6XG4gICAgICAgIHRoaXMuX3RleHREaXYuc3R5bGUuaGVpZ2h0ID0gYCR7aGVpZ2h0fXB4YDtcbiAgICAgICAgdGhpcy5fdGV4dERpdi5zdHlsZS53aWR0aCA9IGAke3dpZHRoIC0gaGVpZ2h0fXB4YDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdwb3J0cmFpdCc6XG4gICAgICAgIHRoaXMuX3RleHREaXYuc3R5bGUuaGVpZ2h0ID0gYCR7aGVpZ2h0IC0gd2lkdGh9cHhgO1xuICAgICAgICB0aGlzLl90ZXh0RGl2LnN0eWxlLndpZHRoID0gYCR7d2lkdGh9cHhgO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBfc2VuZENvb3JkaW5hdGVzKCkge1xuICAgIGlmICh0aGlzLl9jdXJyZW50Q29vcmRpbmF0ZXMgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuX2J1dHRvbi5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xuICAgICAgY2xpZW50LmNvb3JkaW5hdGVzID0gdGhpcy5fY3VycmVudENvb3JkaW5hdGVzO1xuICAgICAgY2xpZW50LnNlbmQodGhpcy5uYW1lICsgJzpjb29yZGluYXRlcycsIGNsaWVudC5jb29yZGluYXRlcyk7XG4gICAgICB0aGlzLmRvbmUoKTtcbiAgICB9XG4gIH1cblxuICBfdG91Y2hTdGFydEhhbmRsZXIoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIGlmICh0aGlzLl9wb3NpdGlvbkRpdi5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZGRlbicpKSB7XG4gICAgICB0aGlzLl9wb3NpdGlvbkRpdi5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICAgIHRoaXMuX2J1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICAgIHRoaXMuX3RleHQuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgfVxuXG4gICAgLy8gVE9ETzogaGFuZGxlIG1pcnJvclxuICAgIHRoaXMuX3Bvc2l0aW9uRGl2LnN0eWxlLmxlZnQgPSBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFggLSB0aGlzLl9wb3NpdGlvblJhZGl1cyArIFwicHhcIjtcbiAgICB0aGlzLl9wb3NpdGlvbkRpdi5zdHlsZS50b3AgPSBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFkgLSB0aGlzLl9wb3NpdGlvblJhZGl1cyArIFwicHhcIjtcbiAgfVxuXG4gIF90b3VjaE1vdmVIYW5kbGVyKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAvLyBUT0RPOiBoYW5kbGUgbWlycm9yXG4gICAgdGhpcy5fcG9zaXRpb25EaXYuc3R5bGUubGVmdCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WCAtIHRoaXMuX3Bvc2l0aW9uUmFkaXVzICsgXCJweFwiO1xuICAgIHRoaXMuX3Bvc2l0aW9uRGl2LnN0eWxlLnRvcCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WSAtIHRoaXMuX3Bvc2l0aW9uUmFkaXVzICsgXCJweFwiO1xuXG4gICAgLy8gVE9ETzogaGFuZGxlIG91dC1vZi1ib3VuZHNcbiAgfVxuXG4gIF90b3VjaEVuZEhhbmRsZXIoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIC8vIFRPRE86IGhhbmRsZSBtaXJyb3JcbiAgICB0aGlzLl9wb3NpdGlvbkRpdi5zdHlsZS5sZWZ0ID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYIC0gdGhpcy5fcG9zaXRpb25SYWRpdXMgKyBcInB4XCI7XG4gICAgdGhpcy5fcG9zaXRpb25EaXYuc3R5bGUudG9wID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZIC0gdGhpcy5fcG9zaXRpb25SYWRpdXMgKyBcInB4XCI7XG5cbiAgICBsZXQgeCA9IChlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFggLSB0aGlzLl9zdXJmYWNlRGl2Lm9mZnNldExlZnQpIC8gdGhpcy5fc3VyZmFjZURpdi5vZmZzZXRXaWR0aDtcbiAgICBsZXQgeSA9IChlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFkgLSB0aGlzLl9zdXJmYWNlRGl2Lm9mZnNldFRvcCkgLyB0aGlzLl9zdXJmYWNlRGl2Lm9mZnNldEhlaWdodDtcblxuICAgIHRoaXMuX2N1cnJlbnRDb29yZGluYXRlcyA9IFt4LCB5XTtcblxuICAgIC8vIFRPRE86IGhhbmRsZSBvdXQtb2YtYm91bmRzXG4gIH1cbn1cbiJdfQ==