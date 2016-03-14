import client from '../core/client';
import Service from '../core/Service';
import SegmentedView from '../views/SegmentedView';
import serviceManager from '../core/serviceManager';


const SERVICE_ID = 'service:checkin';

/**
 * Assign places among a set of predefined positions (i.e. labels and/or coordinates).
 * The service requests a position to the server and waits for the answer.
 *
 * The service finishes its initialization when it receives a positive answer from the server. Otherwise (*e.g.* no more positions available), the service stays in its state and never finishes its initialization.
 *
 * @example
 * const checkin = new Checkin({ capacity: 100 });
 */
class Checkin extends Service {
  constructor() {
    super(SERVICE_ID, true);

    /**
     * @param {Object} defaults - Default options.
     * @param {Boolean} [defaults.showDialog=false] - Indicates whether the view displays text or not.
     * @param {View} [defaults.viewCtor=SegmentedView] - The constructor to use in order to create the view.
     */
    const defaults = {
      showDialog: false,
      viewCtor: SegmentedView,
      viewPriority: 6,
    };

    this.configure(defaults);

    this.require('welcome');
    // bind callbacks to the current instance
    this._onPositionResponse = this._onPositionResponse.bind(this);
    this._onUnavailableResponse = this._onUnavailableResponse.bind(this);
  }

  init() {

    /**
     * Index given by the server side service.
     * @type {Number}
     */
    this.index = -1;

    /**
     * Label of the index assigned by the serverside {@link src/server/Checkin.js~Checkin} service (if any).
     * @type {String}
     */
    this.label = null;

    if (this.options.showDialog) {
      this.viewCtor = this.options.viewCtor;
      this.view = this.createView();
    }
  }

  /** private */
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

  /** private */
  stop() {
    super.stop();
    // Remove listeners for the server's response
    this.removeListener('position', this._onPositionResponse);
    this.removeListener('unavailable', this._onUnavailableResponse);

    if (this.options.showDialog)
      this.hide();
  }

  _onPositionResponse(index, label, coordinates) {
    client.index = this.index = index;
    client.label = this.label = label;
    client.coordinates = coordinates;

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

  _onUnavailableResponse() {
    this.viewContent.error = true;
    this.view.render();
  }
}

serviceManager.register(SERVICE_ID, Checkin);

export default Checkin;
