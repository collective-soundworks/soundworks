import client from './client';
import ClientModule from './ClientModule';

import View from './display/View';
import SquaredView from './display/SquaredView';
import SpaceView from './display/SpaceView';
import TouchSurface from './display/TouchSurface';


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
 * const locator = new ClientLocator();
 */
export default class ClientLocator extends ClientModule {
  /**
   * @param {Object} [options={}] - Options.
   * @param {String} [options.name='locator'] - Name of the module.
   * @param {Boolean} [options.showBackground=false] - Indicates whether to show the space background image or not.
   */
  constructor(options = {}) {
    super(options.name || 'locator', options);

    this._attachArea = this._attachArea.bind(this);
    this._onAreaTouchStart = this._onAreaTouchStart.bind(this);
    this._onAreaTouchMove = this._onAreaTouchMove.bind(this);
    this._sendCoordinates = this._sendCoordinates.bind(this);

    this.spaceCtor = options.spaceCtor || SpaceView;
    this.viewCtor = options.viewCtor || SquaredView;
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
    this.receive('area', this._attachArea, false);
  }

  /**
   * Done method.
   * Remove the `'resize'` listener on the `window`.
   * @private
   */
  done() {
    super.done();
  }

  /**
   * Create a SpaceView and display it in the square section of the view
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
    if (id !== 0) { return; }

    if (!this.position) {
      this._createPosition(normX, normY);

      this.content.activateBtn = true;
      this.view.render('.section-float');
      this.view.installEvents({
        'click .btn': this._sendCoordinates,
      })
    } else {
      this._updatePosition(normX, normY);
    }
  }

  _onAreaTouchMove(id, normX, normY) {
    if (id !== 0) { return; }
    this._updatePosition(normX, normY);
  }

  _createPosition(normX, normY) {
    this.position = {
      id: 'locator',
      x: normX * this.area.width,
      y: normY * this.area.height,
    }

    this.space.addPosition(this.position);
  }

  _updatePosition(normX, normY) {
    this.position.x = normX * this.area.width;
    this.position.y = normY * this.area.height;

    this.space.updatePosition(this.position);
  }

  _sendCoordinates() {
    const $btn = this.view.$el.querySelector('.btn');
    $btn.setAttribute('disabled', true);

    client.coordinates = this.position;
    this.send('coordinates', client.coordinates);
    this.done();
  }
}
