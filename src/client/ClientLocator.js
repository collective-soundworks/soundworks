import client from './client';
import Module from './Module';


/**
 * [client] Allow to indicate the approximate location of the client on a map (that graphically represents a {@link Setup}) via a dialog.
 *
 * The module always has a view (that displays the map and a button to validate the location) and requires the SASS partial `_77-locator.scss`.
 *
 * The module finishes its initialization after the user confirms his / her approximate location by clicking on the “Validate” button.
 *
 * (See also {@link src/server/ServerLocator.js~ServerLocator} on the server side.)
 *
 * @example
 * const setup = new ClientSetup();
 * const space = new Space();
 * const locator = new ClientLocator({ setup: setup, space: space });
 */
export default class ClientLocator extends Module {
  /**
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='locator'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   * @param {Setup} [options.setup=null] Setup in which to indicate the approximate location.
   * @param {Space} [options.space=null] Space to graphically represent the setup.
   * @param {Boolean} [options.showBackground=false] Indicates whether to show the space background image or not.
   */
  constructor(options = {}) {
    super(options.name || 'locator', true, options.color);

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
    let textDiv = document.createElement('div');
    textDiv.classList.add('message');
    let text = document.createElement('p');
    text.innerHTML = this._instructions;
    this._textDiv = textDiv;
    this._text = text;

    // Button
    let button = document.createElement('div');
    button.classList.add('btn');
    button.classList.add('hidden');
    button.innerHTML = "Valider";
    this._button = button;

    // Position circle
    let positionDiv = document.createElement('div');
    positionDiv.setAttribute('id', 'position');
    positionDiv.classList.add('position');
    positionDiv.classList.add('hidden');
    positionDiv.style.width = this._positionRadius * 2 + "px";
    positionDiv.style.height = this._positionRadius * 2 + "px";
    this._positionDiv = positionDiv;

    // Surface div
    let surfaceDiv = document.createElement('div');
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
  start() {
    super.start();

    this.send('request');
    this.receive('surface', this._surfaceHandler, false);

    window.addEventListener('resize', this._resize);
  }

  /**
   * Done method.
   * Remove the `'resize'` listener on the `window`.
   * @private
   */
  done() {
    window.removeEventListener('resize', this._resize);
    super.done();
  }

  /**
   * Reset the module to initial state.
   * @private
   */
  reset() {
    client.coordinates = null;

    this._positionDiv.classList.add('hidden');
    this._text.classList.remove('hidden');
    this._button.classList.add('hidden');

    this._button.removeEventListener('click', this._sendCoordinates, false);
    this._surfaceDiv.removeEventListener('touchstart', this._touchStartHandler, false);
    this._surfaceDiv.removeEventListener('touchmove', this._touchMoveHandler, false);
    this._surfaceDiv.removeEventListener('touchend', this._touchEndHandler, false);

    // TODO: clean surface properly
    if (this.space)
      this.space.reset();
  }

  /**
   * Restart the module.
   * @private
   */
  restart() {
    super.restart();
    this.send('restart', client.coordinates);
    this._button.removeEventListener('click', this._sendCoordinates, false);
    this.done();
  }

  _surfaceHandler(surface) {
    let heightWidthRatio = surface.height / surface.width;
    let screenHeight = window.innerHeight;
    let screenWidth = window.innerWidth;
    let screenRatio = screenHeight / screenWidth;
    let heightPx, widthPx;

    if (screenRatio > heightWidthRatio) { // TODO: refine sizes, with container, etc.
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

  _resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const orientation = width > height ? 'landscape' : 'portrait';
    this.view.classList.remove('landscape', 'portrait');
    this.view.classList.add(orientation);

    const min = Math.min(width, height);

    this._surfaceDiv.style.width = `${min}px`;
    this._surfaceDiv.style.height = `${min}px`;

    switch (orientation) {
      case 'landscape' :
        this._textDiv.style.height = `${height}px`;
        this._textDiv.style.width = `${width - height}px`;
        break;
      case 'portrait':
        this._textDiv.style.height = `${height - width}px`;
        this._textDiv.style.width = `${width}px`;
        break;
    }
  }

  _sendCoordinates() {
    if (this._currentCoordinates !== null) {
      this._button.classList.add('selected');
      client.coordinates = this._currentCoordinates;
      this.send('coordinates', client.coordinates);
      this.done();
    }
  }

  _touchStartHandler(e) {
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

  _touchMoveHandler(e) {
    e.preventDefault();

    // TODO: handle mirror
    this._positionDiv.style.left = e.changedTouches[0].clientX - this._positionRadius + "px";
    this._positionDiv.style.top = e.changedTouches[0].clientY - this._positionRadius + "px";

    // TODO: handle out-of-bounds
  }

  _touchEndHandler(e) {
    e.preventDefault();

    // TODO: handle mirror
    this._positionDiv.style.left = e.changedTouches[0].clientX - this._positionRadius + "px";
    this._positionDiv.style.top = e.changedTouches[0].clientY - this._positionRadius + "px";

    let x = (e.changedTouches[0].clientX - this._surfaceDiv.offsetLeft) / this._surfaceDiv.offsetWidth;
    let y = (e.changedTouches[0].clientY - this._surfaceDiv.offsetTop) / this._surfaceDiv.offsetHeight;

    this._currentCoordinates = [x, y];

    // TODO: handle out-of-bounds
  }
}
