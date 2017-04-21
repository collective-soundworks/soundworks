import client from '../core/client';
import Service from '../core/Service';
import serviceManager from '../core/serviceManager';

/**
 * API of a compliant view for the `checkin` service.
 *
 * @memberof module:soundworks/client
 * @interface AbstractCheckinView
 * @extends module:soundworks/client.AbstractView
 * @abstract
 */
/**
 * Register the function that should be executed when the user is ready to
 * continue.
 *
 * @name setReadyCallback
 * @memberof module:soundworks/client.AbstractCheckinView
 * @function
 * @abstract
 * @instance
 *
 * @param {readyCallback} callback - Callback to execute when the user
 *  is ready to continue.
 */
/**
 * Update the label retrieved by the server.
 *
 * @name updateLabel
 * @memberof module:soundworks/client.AbstractCheckinView
 * @function
 * @abstract
 * @instance
 *
 * @param {String} label - Label to be displayed in the view.
 */
/**
 * Method executed when an error is received from the server (when no place is
 * is available in the experience).
 *
 * @name updateErrorStatus
 * @memberof module:soundworks/client.AbstractCheckinView
 * @function
 * @abstract
 * @instance
 *
 * @param {Boolean} value
 */

/**
 * Callback to execute when the user is ready to continue.
 *
 * @callback
 * @name readyCallback
 * @memberof module:soundworks/client.AbstractCheckinView
 */


const SERVICE_ID = 'service:checkin';

/**
 * Interface for the client `'checkin'` service.
 *
 * This service is one of the provided services aimed at identifying clients inside
 * the experience along with the [`'locator'`]{@link module:soundworks/client.Locator}
 * and [`'placer'`]{@link module:soundworks/client.Placer} services.
 *
 * The `'checkin'` service is the most simple among these services as the server
 * simply assigns a ticket to the client among the available ones. The ticket can
 * optionally be associated with coordinates or labels according to the server
 * `setup` configuration.
 *
 * The service requires the ['platform']{@link module:soundworks/client.Platform}
 * service, as it is considered that an index should be given only to clients who
 * actively entered the application.
 *
 * __*The service must be used with its [server-side counterpart]{@link module:soundworks/server.Checkin}*__
 *
 * @see {@link module:soundworks/client.Locator}
 * @see {@link module:soundworks/client.Placer}
 *
 * @param {Object} options
 * @param {Boolean} [options.showDialog=false] - Define if the service should
 *  display a view informing the client of its position.
 *
 * @memberof module:soundworks/client
 * @example
 * // inside the experience constructor
 * this.checkin = this.require('checkin', { showDialog: true });
 */
class Checkin extends Service {
  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  constructor() {
    super(SERVICE_ID, true);

    const defaults = {
      showDialog: false,
      order: 'ascending',
      viewPriority: 6,
    };

    this.configure(defaults);

    this.require('platform');

    /**
     * Index given by the server.
     * @type {Number}
     */
    this.index = -1;

    /**
     * Optionnal label given by the server.
     * @type {String}
     */
    this.label = null;

    /**
     * Optionnal coordinates given by the server.
     * @type {String}
     */
    this.coordinates = null;

    // bind callbacks to the current instance
    this._onPositionResponse = this._onPositionResponse.bind(this);
    this._onUnavailableResponse = this._onUnavailableResponse.bind(this);
  }

  /** @private */
  start() {
    super.start();

    this.setup = this._sharedConfigService;

    // send request to the server
    this.send('request', this.options.order);

    // setup listeners for the server's response
    this.receive('position', this._onPositionResponse);
    this.receive('unavailable', this._onUnavailableResponse);

    this.show();
  }

  /** @private */
  stop() {
    super.stop();
    // Remove listeners for the server's response
    this.removeListener('position', this._onPositionResponse);
    this.removeListener('unavailable', this._onUnavailableResponse);

    this.hide();
  }

  /** @private */
  _onPositionResponse(index, label, coordinates) {
    client.index = this.index = index;
    client.label = this.label = label;
    this.coordinates = coordinates;

    if (coordinates !== null && !client.coordinates)
      client.coordinates = coordinates;

    if (this.options.showDialog) {
      const displayLabel = label || (index + 1).toString();
      this.view.updateLabel(displayLabel);
      this.view.setReadyCallback(this.ready.bind(this));
    } else {
      this.ready();
    }
  }

  /** @private */
  _onUnavailableResponse() {
    this.view.updateErrorStatus(true);
  }
}

serviceManager.register(SERVICE_ID, Checkin);

export default Checkin;
