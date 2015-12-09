import client from './client';
import ClientModule from './ClientModule';


// function _instructions(label) {
//   return `
//     <p>Go to</p>
//     <div class="checkin-label circled"><span>${label}</span></div>
//     <p><small>Touch the screen<br/>when you are ready.</small></p>
//   `;
// }

/**
 * [client] Assign places among a set of predefined positions (i.e. labels and/or coordinates).
 * The module requests a position to the server and waits for the answer.
 *
 * The module finishes its initialization when it receives a positive answer from the server.
 * Otherwise (*e.g.* no more positions available), the module stays in its state and never finishes its initialization.
 *
 * The module always has a view and requires the SASS partial `_77-checkin.scss`.
 *
 * (See also {@link src/server/ServerCheckin.js~ServerCheckin} on the server side.)
 *
 * @example  * const checkin = new ClientCheckin({ capacity: 100 });
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

    const showDialog = options.showDialog || false;
    // this._instructions = options.instructions || _instructions;

    // bind callbacks to the current instance
    this._positionHandler = this._positionHandler.bind(this);
    this._unavailableHandler = this._unavailableHandler.bind(this);
    this._viewClickHandler = this._viewClickHandler.bind(this);

    // init()
    if (showDialog) {
      this.content.waiting = true;
      this.content.label = null;
      if (this.view) { this.view.remove(); } // in `this.reset()`
      this.view = this.createDefaultView();
    }

    this.init();
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
    this.send('request');

    // Setup listeners for the server's response
    this.receive('acknowledge', this._positionHandler);
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
    this.removeListener('position', this._positionHandler);
    this.removeListener('unavailable', this._unavailableHandler);

    if (this.view) { this.view.installEvents({}, true); }
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

  _positionHandler(index, label, coordinates) {
    this.index = index;
    this.label = label;
    client.coordinates = coordinates;

    if (this.view) {
      const displayLabel = label || (index + 1).toString(); // ?
      const eventName = client.platform.isMobile ? 'click' : 'touchstart';

      this.content.waiting = false;
      this.content.label = displayLabel;
      this.view.installEvents({ [eventName]: this._viewClickHandler });
      this.view.render();
    } else {
      this.done();
    }
  }

  _unavailableHandler() {
    this.content.waiting = false;
    this.view.render();
  }

  _viewClickHandler() {
    this.done();
  }
}
