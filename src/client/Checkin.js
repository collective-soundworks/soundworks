import client from './client';
import Module from './Module';


function _instructions(label) {
  return "<p>Go to</p>" +
    "<div class='checkin-label circled'><span>" + label + "</span></div>" +
    "<p><small>Touch the screen<br/>when you are ready.</small></p>";
}

/**
 * The {@link Checkin} module assigns places among a predefined {@link Setup}.
 * It calls its `done` method when the user is checked in.
 *
 * The {@link Checkin} module requires the SASS partial `_77-checkin.scss`.
 *
 * @example import { client, Checkin, Setup } from 'soundworks/client';
 *
 * const setup = new Setup();
 * const checkin = new Checkin({ setup: setup });
 * // ... instantiate other modules
 *
 * // Initialize the client (indicate the client type)
 * client.init('clientType');
 *
 * // Start the scenario
 * client.start((serial, parallel) => {
 *   // Make sure that the `setup` is initialized before it is used by the
 *   // `checkin` module (=> we use the `serial` function).
 *   serial(
 *     setup,
 *     placer,
 *     // ... other modules
 *   )
 * });
 */
export default class Checkin extends Module {
  /**
   * Creates an instance of the class. Always has a view.
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='checkin'] Name of the module.
   * @param {Boolean} [options.hasView=true] Indicates whether the module has a view or not.
   * @param {String} [options.color='black'] Background color of the `view`.
   * @param {Boolean} [options.showDialog=false] Indicates whether the view displays text or not.
   * @param {Function(label:String) : String} [options.instructions] Function to display the instructions.
   * @todo default `instructions` value
   */
  constructor(options = {}) {
    super(options.name || 'checkin', options.hasView || true, options.color);

    /**
     * Index given by the server module to the client.
     * @type {Number}
     */
    this.index = -1;

    /**
     * Label of the index assigned to the client (if any).
     * @type {String}
     */
    this.label = null;

    this._showDialog = options.showDialog || false;
    this._instructions = options.instructions || _instructions;

    this._acknowledgementHandler = this._acknowledgementHandler.bind(this);
    this._unavailableHandler = this._unavailableHandler.bind(this);
    this._viewClickHandler = this._viewClickHandler.bind(this);
  }

  /**
   * Starts the module.
   * Sends a request to the server and sets up listeners for the server's response.
   */
  start() {
    super.start();

    client.send(this.name + ':request');

    client.receive(this.name + ':acknowledge', this._acknowledgementHandler);
    client.receive(this.name + ':unavailable', this._unavailableHandler);
  }

  /**
   * Resets the module to default state.
   * Removes WebSocket and click / touch listeners.
   */
  reset() {
    super.reset();

    client.removeListener(this.name + ':acknowledge', this._acknowledgementHandler);
    client.removeListener(this.name + ':unavailable', this._unavailableHandler);

    if (client.platform.isMobile)
      this.view.removeEventListener('touchstart', this._viewClickHandler);
    else
      this.view.removeEventListener('click', this._viewClickHandler, false);
  }

  /**
   * Restarts the module.
   * Sends the index, label and coordinates to the server.
   */
  restart() {
    super.restart();

    client.send(this.name + ':restart', this.index, this.label, client.coordinates);
    this.done();
  }

  _acknowledgementHandler(index, label, coordinates) {
    this.index = index;

    if (coordinates)
      client.coordinates = coordinates;

    if (label) {
      this.label = label;

      if (this._showDialog) {
        let htmlContent = this._instructions(label);
        this.setCenteredViewContent(htmlContent);

        if (client.platform.isMobile)
          this.view.addEventListener('touchstart', this._viewClickHandler);
        else
          this.view.addEventListener('click', this._viewClickHandler, false);
      } else {
        this.done();
      }

    } else {
      this.done();
    }
  }

  _unavailableHandler() {
    this.setCenteredViewContent("<p>Sorry, we cannot accept any more connections at the moment, please try again later.</p>");
  }

  _viewClickHandler() {
    this.done();
  }
}
