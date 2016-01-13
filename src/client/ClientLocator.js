import client from './client';
import localStorage from './localStorage';
import ClientModule from './ClientModule';
import SquaredView from './display/SquaredView';
import SpaceView from './display/SpaceView';
import TouchSurface from './display/TouchSurface';


/**
 * [client] Allow to indicate the approximate location of the client on a map.
 *
 * The module always has a view that displays the map and a button to validate the location.
 *
 * The module finishes its initialization after the user confirms his / her approximate location by clicking on the “Validate” button. For development purposes it can be configured to send random coordinates or retrieving previously stored location (see `options.random` and `options.persist`.
 *
 * (See also {@link src/server/ServerLocator.js~ServerLocator} on the server side.)
 *
 * @example
 * const locator = new ClientLocator();
 */
export default class ClientLocator extends ClientModule {
  /**
   * @param {Object} [options={}] - Options.
   * @param {String} [options.name='locator'] - The name of the module.
   * @param {Boolean} [options.random=false] - Send random position to the server and call `this.done()` (for development purpose)
   * @param {Boolean} [options.persist=false] - If set to `true`, store the normalized coordinates in `localStorage` and retrieve them in subsequent calls. Delete the stored position when set to `false`. (for development purpose)
   */
  constructor(options = {}) {
    super(options.name || 'locator', options);

    this._random = options.random || false;
    this._persist = options.persist || false;
    this._positionRadius = options.positionRadius || 0.3;
    this.spaceCtor = options.spaceCtor || SpaceView;
    this.viewCtor = options.viewCtor || SquaredView;

    // The namespace where coordinates are stored when `options.persist = true`.
    this._localStorageNamespace = `soundworks:${this.name}`;

    this._onAreaTouchStart = this._onAreaTouchStart.bind(this);
    this._onAreaTouchMove = this._onAreaTouchMove.bind(this);

    this.init();
  }

  init() {
    this.content.activateBtn = false;
    this.view = this.createView();
  }

  /**
   * Start the module.
   * @private
   */
  start() {
    super.start();

    this.send('request');

    if (!this._persist)
      localStorage.delete(this._localStorageNamespace);

    this.receive('area', (area) => {
      this._attachArea(area);

      // Bypass the locator according to module configuration options.
      // If `options.random` is set to true, use random coordinates.
      // If `options.persist` is set to true use coordinates stored in local storage,
      // do nothing when no coordinates are stored yet.
      if (this._random || this._persist) {
        let coords;

        if (this._random) {
          coords = { normX: Math.random(), normY: Math.random() };
        } else if (this._persist) {
          coords = JSON.parse(localStorage.get(this._localStorageNamespace));
        }

        if (coords !== null) {
          this._createPosition(coords.normX, coords.normY);
          this._sendCoordinates();
        }
      }
    });
  }

  /**
   * Create a `SpaceView` and display it in the square section of the view
   */
  _attachArea(area) {
    this.area = area;
    this.space = new this.spaceCtor(area, {}, { isSubView: true });
    // @todo - find a way to remove these hardcoded selectors
    this.view.setViewComponent('.section-square', this.space);
    this.view.render('.section-square');
    // touchSurface on $svg
    this.surface = new TouchSurface(this.space.$svg);
    this.surface.addListener('touchstart', this._onAreaTouchStart);
    this.surface.addListener('touchmove', this._onAreaTouchMove);
  }

  _onAreaTouchStart(id, normX, normY) {
    if (!this.position) {
      this._createPosition(normX, normY);

      this.content.activateBtn = true;
      this.view.render('.section-float');
      this.view.installEvents({
        'click .btn': (e) => {
          e.target.setAttribute('disabled', true);
          this._sendCoordinates();
        },
      });
    } else {
      this._updatePosition(normX, normY);
    }
  }

  _onAreaTouchMove(id, normX, normY) {
    this._updatePosition(normX, normY);
  }

  /**
   * Creates the position object according to normalized coordinates.
   * @param {Number} normX - The normalized coordinate in the x axis.
   * @param {Number} normY - The normalized coordinate in the y axis.
   */
  _createPosition(normX, normY) {
    this.position = {
      id: 'locator',
      x: normX * this.area.width,
      y: normY * this.area.height,
      radius: this._positionRadius,
    }

    this.space.addPoint(this.position);
  }

  /**
   * Updates the position object according to normalized coordinates.
   * @param {Number} normX - The normalized coordinate in the x axis.
   * @param {Number} normY - The normalized coordinate in the y axis.
   */
  _updatePosition(normX, normY) {
    this.position.x = normX * this.area.width;
    this.position.y = normY * this.area.height;

    this.space.updatePoint(this.position);
  }

  /**
   * Send coordinates to the server.
   */
  _sendCoordinates() {
    if (this._persist) { // store normalized coordinates
      const normX = this.position.x / this.area.width;
      const normY = this.position.y / this.area.height;
      localStorage.set(this._localStorageNamespace, JSON.stringify({ normX, normY }));
    }

    client.coordinates = this.position;
    this.send('coordinates', client.coordinates);
    this.done();
  }
}
