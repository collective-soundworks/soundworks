import client from '../core/client';
import Service from '../core/Service';
import serviceManager from '../core/serviceManager';

const SERVICE_ID = 'service:locator';

/**
 * Interface for the view of the `locator` service.
 *
 * @interface AbstractLocatorView
 * @extends module:soundworks/client.View
 */
/**
 * Register the `area` definition to the view.
 *
 * @function
 * @name AbstractLocatorView.setArea
 * @param {Object} area - Definition of the area.
 * @property {Number} area.width - With of the area.
 * @property {Number} area.height - Height of the area.
 * @property {Number} [area.labels=[]] - Labels of the position.
 * @property {Number} [area.coordinates=[]] - Coordinates of the area.
 */
/**
 * Register the callback to be applied when the user select a position.
 *
 * @function
 * @name AbstractLocatorView.onSelect
 * @param {Function} callback - Callback to be applied when a position is selected.
 *  This callback should be called with the `index`, `label` and `coordinates` of
 *  the requested position.
 */


/**
 * Interface for the client `'locator'` service.
 *
 * This service is one of the provided services aimed at identifying clients inside
 * the experience along with the [`'placer'`]{@link module:soundworks/client.Placer}
 * and [`'checkin'`]{@link module:soundworks/client.Checkin} services.
 *
 * The `'locator'` service allows a client to give its approximate location inside
 * a graphical representation of the `area` as defined in the server's `setup`
 * configuration member.
 *
 * __*The service must be used with its [server-side counterpart]{@link module:soundworks/server.Locator}*__
 *
 * @see {@link module:soundworks/client.Placer}
 * @see {@link module:soundworks/client.Checkin}
 *
 * @param {Object} options
 * @param {Boolean} [options.random=false] - Defines whether the location is
 *  set randomly (mainly for development purposes).
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
      viewPriority: 6,
    };

    this.configure(defaults);

    this._sharedConfig = this.require('shared-config');

    this._onAknowledgeResponse = this._onAknowledgeResponse.bind(this);
    this._sendCoordinates = this._sendCoordinates.bind(this);
  }

  /** @private */
  start() {
    super.start();
    this.show();

    this.send('request');
    this.receive('acknowledge', this._onAknowledgeResponse);
  }

  /** @private */
  stop() {
    super.stop();
    this.removeListener('acknowledge', this._onAknowledgeResponse);
    this.hide();
  }

  /**
   * @private
   * @param {Object} areaConfigPath - Path to the area in the configuration.
   */
  _onAknowledgeResponse(areaConfigPath) {
    if (this.options.random) {
      const x = Math.random() * area.width;
      const y = Math.random() * area.height;
      this._sendCoordinates(x, y);
    } else {
      const area = this._sharedConfig.get(areaConfigPath);
      this.view.setArea(area);
      this.view.setSelectCallback(this._sendCoordinates);
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
