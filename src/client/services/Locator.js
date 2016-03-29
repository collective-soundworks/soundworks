import client from '../core/client';
import Service from '../core/Service';
import serviceManager from '../core/serviceManager';
import SpaceView from '../views/SpaceView';
import SquaredView from '../views/SquaredView';
import TouchSurface from '../views/TouchSurface';


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


const SERVICE_ID = 'service:locator';

/**
 * Interface of the client `'locator'` service.
 *
 * This service is one of the provided services aimed at identifying clients inside
 * the experience along with the [`'placer'`]{@link module:soundworks/client.Placer}
 * and [`'checkin'`]{@link module:soundworks/client.Checkin} services.
 *
 * The `'locator'` service allows a client to give its approximate location inside
 * a graphical representation of the `area` as defined in the server's `setup`
 * configuration entry.
 *
 * __*The service must be used with its [server-side counterpart]{@link module:soundworks/server.Locator}*__
 *
 * @see {@link module:soundworks/client.Placer}
 * @see {@link module:soundworks/client.Checkin}
 *
 * @param {Object} options
 * @param {Boolean} [options.random=false] - If set to `true`, the location is
 *  setted randomly (mainly for development purposes).
 *
 * @memberof module:soundworks/client
 * @example
 * // inside the experience constructor
 * this.locator = this.require('locator');
 */
class Locator extends Service {
  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  constructor() {
    super(SERVICE_ID, true);

    const defaults = {
      random: false,
      viewCtor: _LocatorView,
    };

    this.configure(defaults);

    this._sharedConfig = this.require('shared-config');

    this._onAknowledgeResponse = this._onAknowledgeResponse.bind(this);
    this._sendCoordinates = this._sendCoordinates.bind(this);
  }

  /** @private */
  init() {
    this.viewCtor = this.options.viewCtor;
    this.view = this.createView();
  }

  /** @private */
  start() {
    super.start();

    if (!this.hasStarted)
      this.init();

    this.show();

    this.send('request');
    this.receive('aknowledge', this._onAknowledgeResponse);
  }

  /** @private */
  stop() {
    super.stop();
    this.removeListener('aknowledge', this._onAknowledgeResponse);

    this.hide();
  }

  /**
   * @private
   * @param {Object} areaConfigPath - Path to the area in the configuration.
   */
  _onAknowledgeResponse(areaConfigPath) {
    const area = this._sharedConfig.get(areaConfigPath);
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

serviceManager.register(SERVICE_ID, Locator);

export default Locator;
