import client from './client';
import Module from './Module';


function _instructions(label) {
  return "<p>Go to</p>" +
    "<div class='checkin-label circled'><span>" + label + "</span></div>" +
    "<p><small>Touch the screen<br/>when you are ready.</small></p>";
}

/**
 * The `Checkin` module is responsible for keeping track of the connected clients by assigning them indices.
 * In case that the scenario is based on predefined positions (*i.e.* a `setup`), the indices correspond to the indices of positions that can be either assigned automatically or selected by the participants.
 *
 * For instance, say that the scenario requires 12 participants who sit on a grid of 3 ⨉ 4 predefined positions.
 * When a client connects to the server, the `Checkin` module could assign the client to a position on the grid that is not occupied yet.
 * The application can indicate the participant a label that is associated with the assigned position.
 * Similarly, if the scenario takes place in a theater with labeled seats, the `Checkin` module would allow the participants to indicate their seat by its label (*e.g.* a row and a number).
 * If the scenario does not require the participants to sit at particular locations, the `Checkin` module would just assign them arbitrary indices within the range of total number of users the scenario supports.
 *
 * Alternatively, when configuring the module adequately, the module can assign arbitrary indices to the the participants and request that they indicate their approximate location in the performance space on a map.
 *
 * The {@link ClientCheckin} module takes care of the check-in on the client side.
 * The {@link ClientCheckin} module calls its `done` method when the user is checked in.
 *
 * The {@link ClientCheckin} module requires the SASS partial `_77-checkin.scss`.
 */
export default class ClientCheckin extends Module {
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

    this.index = -1;
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
