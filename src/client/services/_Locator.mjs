import client from '../core/client';
import Service from '../core/Service';
import serviceManager from '../core/serviceManager';

/**
 * API of a compliant view for the `locator` service.
 *
 * @memberof module:soundworks/client
 * @interface AbstractLocatorView
 * @extends module:soundworks/client.AbstractView
 * @abstract
 */
/**
 * Set and display the `area` definition (as defined in server configuration).
 *
 * @name setArea
 * @memberof module:soundworks/client.AbstractLocatorView
 * @function
 * @abstract
 * @instance
 *
 * @param {Object} area - Area defintion as declared in server configuration.
 * @param {Number} area.width - With of the area.
 * @param {Number} area.height - Height of the area.
 * @param {Number} [area.labels=[]] - Labels of the position.
 * @param {Number} [area.coordinates=[]] - Coordinates of the area.
 */
/**
 * Register the callback to be executed when the user select a position.
 *
 * @name setSelectCallback
 * @memberof module:soundworks/client.AbstractLocatorView
 * @function
 * @abstract
 * @instance
 *
 * @param {selectCallback} callback - Callback to be executed
 *  when a position is selected. This callback should be called with the `index`,
 * `label` and `coordinates` of the requested position.
 */

/**
 * Callback to execute when the user select a position.
 *
 * @callback
 * @name selectCallback
 * @memberof module:soundworks/client.AbstractLocatorView
 * @param {Number} index - Index of the selected location.
 * @param {String} label - Label of the selected location if any.
 * @param {Array<Number>} coordinates - Coordinates (`[x, y]`) of the selected
 *  location if any.
 */

const SERVICE_ID = 'service:locator';

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
    super(SERVICE_ID);

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
