import client from '../core/client';
import Service from '../core/Service';
import SegmentedView from '../views/SegmentedView';
import serviceManager from '../core/serviceManager';


const SERVICE_ID = 'service:checkin';

/**
 * Interface of the client `'checkin'` service.
 *
 * This service is one of the provided services aimed at identifying clients inside
 * the experience along with the [`'locator'`]{@link module:soundworks/client.Locator}
 * and [`'placer'`]{@link module:soundworks/client.Placer} services.
 *
 * The `'checkin'` service is the more simple among these services as the server
 * simply assign a ticket to the client among the available ones. The ticket can
 * optionnaly be associated with coordinates or label according to the server
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
 *  display a view informaing the client of it's position.
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
      viewCtor: SegmentedView,
      viewPriority: 6,
    };

    this.configure(defaults);

    this.require('platform', { showDialog: true });
    // bind callbacks to the current instance
    this._onPositionResponse = this._onPositionResponse.bind(this);
    this._onUnavailableResponse = this._onUnavailableResponse.bind(this);
  }

  /** @private */
  init() {
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

    if (this.options.showDialog) {
      this.viewCtor = this.options.viewCtor;
      this.view = this.createView();
    }
  }

  /** @private */
  start() {
    super.start();

    if (!this.hasStarted)
      this.init();

    this.setup = this._sharedConfigService
    // send request to the server
    this.send('request');
    // setup listeners for the server's response
    this.receive('position', this._onPositionResponse);
    this.receive('unavailable', this._onUnavailableResponse);

    if (this.options.showDialog)
      this.show();
  }

  /** @private */
  stop() {
    super.stop();
    // Remove listeners for the server's response
    this.removeListener('position', this._onPositionResponse);
    this.removeListener('unavailable', this._onUnavailableResponse);

    if (this.options.showDialog)
      this.hide();
  }

  /** @private */
  _onPositionResponse(index, label, coordinates) {
    client.index = this.index = index;
    client.label = this.label = label;
    client.coordinates = this.coordinates = coordinates;

    if (this.options.showDialog) {
      const displayLabel = label || (index + 1).toString();
      const eventName = client.platform.isMobile ? 'click' : 'touchstart';

      this.viewContent.label = displayLabel;
      this.view.installEvents({ [eventName]: () => this.ready() });
      this.view.render();
    } else {
      this.ready();
    }
  }

  /** @private */
  _onUnavailableResponse() {
    this.viewContent.error = true;
    this.view.render();
  }
}

serviceManager.register(SERVICE_ID, Checkin);

export default Checkin;
