import client from './client';
import ClientModule from './ClientModule';


function _instructions(label) {
  return `
    <p>Go to</p>
    <div class="checkin-label circled"><span>${label}</span></div>
    <p><small>Touch the screen<br/>when you are ready.</small></p>
  `;
}

/**
 * [client] Assign places among a predefined {@link Setup}.
 * The module requests a position to the server and waits for the answer.
 *
 * The module finishes its initialization when it receives a positive answer from the server.
 * Otherwise (*e.g.* no more positions available), the module stays in its state and never finishes its initialization.
 *
 * The module always has a view and requires the SASS partial `_77-checkin.scss`.
 *
 * (See also {@link src/server/ServerCheckin.js~ServerCheckin} on the server side.)
 *
 * @example const setup = new ClientSetup();
 * const checkin = new ClientCheckin({ setup: setup });
 */
export default class ClientCheckin extends ClientModule {
  /**
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
     * Index given by the serverside {@link src/server/ServerCheckin.js~ServerCheckin}
     * module.
     * @type {Number}
     */
    this.index = -1;

    /**
     * Label of the index assigned by the serverside
     * {@link src/server/Checkin.js~Checkin} module (if any).
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
   * Start the module.
   *
   * Send a request to the server and sets up listeners for the server's response.
   * @private
   */
  start() {
    super.start();

    // Send request to the server
    // client.send(this.name + ':request');
    this.send('request');

    // Setup listeners for the server's response
    this.receive('acknowledge', this._acknowledgementHandler);
    this.receive('unavailable', this._unavailableHandler);
  }

  /**
   * Reset the module to default state.
   *
   * Remove WebSocket and click / touch listeners.
   * @private
   */
  reset() {
    super.reset();

    // Remove listeners for the server's response
    this.removeListener('acknowledge', this._acknowledgementHandler);
    this.removeListener('unavailable', this._unavailableHandler);

    // Remove touch / click listener set un in the `_acknowledgementHandler`
    if (client.platform.isMobile)
      this.view.removeEventListener('touchstart', this._viewClickHandler);
    else
      this.view.removeEventListener('click', this._viewClickHandler, false);
  }

  /**
   * Restarts the module.
   * Sends the index, label and coordinates to the server.
   * @private
   */
  restart() {
    super.restart();
    // Send current checkin information to the server
    this.send('restart', this.index, this.label, client.coordinates);
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
    this.setCenteredViewContent('<p>Sorry, we cannot accept any more connections at the moment, please try again later.</p>');
  }

  _viewClickHandler() {
    this.done();
  }
}
