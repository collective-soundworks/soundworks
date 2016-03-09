import client from '../core/client';
// import localStorage from './localStorage'; // @todo - rethink this with db
import Service from '../core/Service';
import serviceManager from '../core/serviceManager';
import SpaceView from '../views/SpaceView';
import SquaredView from '../views/SquaredView';
import TouchSurface from '../views/TouchSurface';

const SERVICE_ID = 'service:locator';

class _LocatorView extends SquaredView {
  constructor(template, content, events, options) {
    super(template, content, events, options);

    this.area = null;

    this._onAreaTouchStart = this._onAreaTouchStart.bind(this);
    this._onAreaTouchMove = this._onAreaTouchMove.bind(this);
  }

  /**
   * Sets the `area` definition.
   * @param {Object} area - Object containing the area definition.
   */
  setArea(area) {
    this._area = area;
    this._renderArea();
  }

  /**
   * Register the function to be called when the location is choosen.
   * @param {Function} callback
   */
  onSelect(callback) {
    this._onSelect = callback;
  }

  /** @inheritdoc */
  remove() {
    super.remove();

    this.surface.removeListener('touchstart', this._onAreaTouchStart);
    this.surface.removeListener('touchmove', this._onAreaTouchMove);
  }

  _renderArea() {
    this.selector = new SpaceView();
    this.selector.setArea(this._area);
    this.setViewComponent('.section-square', this.selector);
    this.render('.section-square');

    this.surface = new TouchSurface(this.selector.$svg);
    this.surface.addListener('touchstart', this._onAreaTouchStart);
    this.surface.addListener('touchmove', this._onAreaTouchMove);
  }

  /**
   * Callback of the `touchstart` event.
   */
  _onAreaTouchStart(id, normX, normY) {
    if (!this.position) {
      this._createPosition(normX, normY);

      this.content.showBtn = true;
      this.render('.section-float');
      this.installEvents({
        'click .btn': (e) => this._onSelect(this.position.x, this.position.y),
      });
    } else {
      this._updatePosition(normX, normY);
    }
  }

  /**
   * Callback of the `touchmove` event.
   */
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
      x: normX * this._area.width,
      y: normY * this._area.height,
    }

    this.selector.addPoint(this.position);
  }

  /**
   * Updates the position object according to normalized coordinates.
   * @param {Number} normX - The normalized coordinate in the x axis.
   * @param {Number} normY - The normalized coordinate in the y axis.
   */
  _updatePosition(normX, normY) {
    this.position.x = normX * this._area.width;
    this.position.y = normY * this._area.height;

    this.selector.updatePoint(this.position);
  }
}

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
class ClientLocator extends Service {
  constructor() {
    super(SERVICE_ID, true);

    /**
     * @param {Object} [defaults={}] - Defaults configuration of the service.
     * @param {Boolean} [defaults.random=false] - Send random position to the server
     *  and call `this.done()` (for development purpose)
     * @param {View} [defaults.viewCtor=_LocatorView] - The contructor of the view to be used.
     *  The view must implement the `AbstractLocatorView` interface
     */
    const defaults = {
      random: false,
      // persist: false, // @todo - re-think this with db
      viewCtor: _LocatorView,
    };

    this.configure(defaults);

    this._sharedConfigService = this.require('shared-config');

    this._onAknowledgeResponse = this._onAknowledgeResponse.bind(this);
    this._sendCoordinates = this._sendCoordinates.bind(this);
  }

  /** @inheritdoc */
  init() {
    this.viewCtor = this.options.viewCtor;
    // this.viewOptions
    this.view = this.createView();
  }

  /** @inheritdoc */
  start() {
    super.start();

    if (!this.hasStarted)
      this.init();

    this.show();

    this.send('request');
    this.receive('aknowledge', this._onAknowledgeResponse);
  }

  /** @inheritdoc */
  stop() {
    super.stop();
    this.removeListener('aknowledge', this._onAknowledgeResponse);

    this.hide();
  }

  /**
   * Bypass the locator according to module configuration options.
   * If `options.random` is set to true, create random coordinates and send it
   *  to the server (mainly for development purposes).
   * @private
   * @param {Object} area - The area as defined in server configuration.
   */
  _onAknowledgeResponse(areaConfigPath) {
    const area = this._sharedConfigService.get(areaConfigPath);
    this.view.setArea(area);
    this.view.onSelect(this._sendCoordinates);

    if (this.options.random) {
      const x = Math.random() * area.width;
      const y = Math.random() * area.height;
      this._sendCoordinates(x, y);
    }
  }

  /**
   * Send coordinates to the server.
   * @private
   * @param {Number} x - The `x` coordinate of the client.
   * @param {Number} y - The `y` coordinate of the client.
   */
  _sendCoordinates(x, y) {
    client.coordinates = [x, y];

    this.send('coordinates', client.coordinates);
    this.ready();
  }
}

serviceManager.register(SERVICE_ID, ClientLocator);

export default ClientLocator;
