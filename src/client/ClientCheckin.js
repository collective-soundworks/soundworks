import client from './client';
import ClientModule from './ClientModule';
import SegmentedView from './display/SegmentedView';

/**
 * Assign places among a set of predefined positions (i.e. labels and/or coordinates).
 * The module requests a position to the server and waits for the answer.
 *
 * The module finishes its initialization when it receives a positive answer from the server. Otherwise (*e.g.* no more positions available), the module stays in its state and never finishes its initialization.
 *
 * (See also {@link src/server/ServerCheckin.js~ServerCheckin} on the server side.)
 *
 * @example
 * const checkin = new ClientCheckin({ capacity: 100 });
 */
export default class ClientCheckin extends ClientModule {
  /**
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='checkin'] - Name of the module.
   * @param {Boolean} [options.showDialog=false] - Indicates whether the view displays text or not.
   * @param {View} [options.viewCtor=SegmentedView] - The constructor to use in order to create the view.
   */
  constructor(options = {}) {
    super(options.name || 'checkin', options);

    this.options = Object.assign({
      showDialog: false,
      viewCtor: SegmentedView,
    }, options);

    // bind callbacks to the current instance
    this._onPositionResponse = this._onPositionResponse.bind(this);
    this._onUnavailableResponse = this._onUnavailableResponse.bind(this);

    this.init();
  }

  init() {

    /**
     * Index given by the serverside {@link src/server/ServerCheckin.js~ServerCheckin} module.
     * @type {Number}
     */
    this.index = -1;

    /**
     * Label of the index assigned by the serverside {@link src/server/Checkin.js~Checkin} module (if any).
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
    // send request to the server
    this.send('request');
    // setup listeners for the server's response
    this.receive('position', this._onPositionResponse);
    this.receive('unavailable', this._onUnavailableResponse);
  }

  /** private */
  stop() {
    super.stop();
    // Remove listeners for the server's response
    this.removeListener('position', this._onPositionResponse);
    this.removeListener('unavailable', this._onUnavailableResponse);
  }

  /**
   * @todo - should be moved to `start` when db installed
   *
   * Resynchronize the module with the server after a disconnection.
   * Sends the index, label and coordinates.
   * @private
   */
  restart() {
    // super.restart();
    // Send current checkin information to the server
    this.send('restart', this.index, this.label, client.coordinates);
    this.done();
  }

  _onPositionResponse(index, label, coordinates) {
    this.index = index;
    this.label = label;
    client.coordinates = coordinates;

    if (this.view) {
      const displayLabel = label || (index + 1).toString();
      const eventName = client.platform.isMobile ? 'click' : 'touchstart';

      this.content.label = displayLabel;
      this.view.installEvents({ [eventName]: () => this.done() });
      this.view.render();
    } else {
      this.done();
    }
  }

  _onUnavailableResponse() {
    this.content.error = true;
    this.view.render();
  }
}
