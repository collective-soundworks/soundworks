// import server from './server';
import Module from './Module';


/**
 * The `Control` module is used to control an application through a dedicated client (that we usually call `conductor`).
 * The module allows for declaring `parameters`, `infos`, and `commands`, through which the `conductor` can control and monitor the state of the application:
 * - `parameters` are values that are changed by a client, sent to the server, and propagated to the other connected clients (*e.g.* the tempo of a musical application);
 * - `infos` are values that are changed by the server and propagated to the connected clients, to inform about the current state of the application (*e.g.* the number of connected `player` clients);
 * - `commands` are messages (without arguments) that are send from the client to the server (*e.g.* `start`, `stop` or `clear` — whatever they would mean for a given application) which does the necessary upon reception.
 *
 * Optionally, the {@link ClientControl} module can automatically construct a simple interface from the list of declared controls that allows to change `parameters`, display `infos`, and send `commands` to the server.
 *
 * The controls of different types are declared on the server side and propagated to the client side when a client is set up.
 *
 * The {@link Control} takes care of the parameters and commands on the server side.
 * To set up controls in a scenario, you should extend this class on the server side and declare the controls specific to that scenario with the appropriate methods.
 * @example
 * class Control extends Control {
 *   constructor(nameArray) {
 *     super();
 *
 *     // Info corresponding to the number of players
 *     this.addInfo('numPlayers', 'Number of players', 0);
 *     // Number parameter corresponding to the output gain of the players
 *     this.addNumber('gain', 'Global gain', 0, 1, 0.1, 1);
 *     // Select parameter corresponding to the state of the performance
 *     this.addSelect('state', 'State', ['idle', 'playing'], 'idle');
 *     // Command to reload the page on all the clients
 *     this.addCommand('reload', 'Reload the page of all the clients');
 *   }
 * }
 *
 * const control = new Control(guiroNames, soundfieldNames);
 */
export default class Control extends Module {
  /**
   * Creates an instance of the class.
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='control'] Name of the module.
   */
  constructor(options = {}) {
    super(options.name || 'control');

    /**
     * Dictionary of all the events.
     * @type {Object}
     */
    this.events = {};

    this._clientTypes = [];
  }

  /**
   * Adds a number parameter.
   * @param {String} name Name of the parameter.
   * @param {String} label Label of the parameter (displayed on the control GUI on the client side).
   * @param {Number} min Minimum value of the parameter.
   * @param {Number} max Maximum value of the parameter.
   * @param {Number} step Step to increase or decrease the parameter value.
   * @param {Number} init Initial value of the parameter.
   * @param {String[]} [clientTypes=null] Array of the client types to send the parameter to. If not set, the parameter is sent to all the client types.
   */
  addNumber(name, label, min, max, step, init, clientTypes = null) {
    this.events[name] = {
      type: 'number',
      name: name,
      label: label,
      min: min,
      max: max,
      step: step,
      value: init,
      clientTypes: clientTypes
    };
  }

  /**
   * Adds a select parameter.
   * @param {String} name Name of the parameter.
   * @param {String} label Label of the parameter (displayed on the control GUI on the client side).
   * @param {String[]} options Array of the different values the parameter can take.
   * @param {Number} init Initial value of the parameter (has to be in the `options` array).
   * @param {String[]} [clientTypes=null] Array of the client types to send the parameter to. If not set, the parameter is sent to all the client types.
   */
  addSelect(name, label, options, init, clientTypes = null) {
    this.events[name] = {
      type: 'select',
      name: name,
      label: label,
      options: options,
      value: init,
      clientTypes: clientTypes
    };
  }

  /**
   * Adds an info parameter.
   * @param {String} name Name of the parameter.
   * @param {String} label Label of the parameter (displayed on the control GUI on the client side).
   * @param {Number} init Initial value of the parameter (has to be in the `options` array).
   * @param {String[]} [clientTypes=null] Array of the client types to send the parameter to. If not set, the parameter is sent to all the client types.
   */
  addInfo(name, label, init, clientTypes = null) {
    this.events[name] = {
      type: 'info',
      name: name,
      label: label,
      value: init,
      clientTypes: clientTypes
    };
  }

  /**
   * Adds a command.
   * @param {String} name Name of the command.
   * @param {String} label Label of the command (displayed on the control GUI on the client side).
   * @param {String[]} [clientTypes=null] Array of the client types to send the parameter to. If not set, the parameter is sent to all the client types.
   */
  addCommand(name, label, clientTypes = null) {
    this.events[name] = {
      type: 'command',
      name: name,
      label: label,
      value: undefined,
      clientTypes: clientTypes
    };
  }

  _broadcastEvent(event) {
    let clientTypes = event.clientTypes || this._clientTypes;

    // propagate parameter to clients
    for (let clientType of clientTypes)
      this.broadcast(clientType, 'event', event.name, event.value);

    this.emit(`${this.name}:event`, event.name, event.value);
  }

  /**
   * Sends an event to the clients.
   * @param {String} name Name of the event to send.
   * @emits 'control:event'
   */
  send(name) {
    console.dir(name);
    let event = this.events[name];

    if (event) {
      this._broadcastEvent(event);
    } else {
      console.log('server control: send unknown event "' + name + '"');
    }
  }

  /**
   * Updates the value of a parameter and sends it to the clients.
   * @param {String} name Name of the parameter to update.
   * @param {(String|Number|Boolean)} value New value of the parameter.
   */
  update(name, value) {
    let event = this.events[name];

    if (event) {
      event.value = value;
      this._broadcastEvent(event);
    } else {
      console.log('server control: update unknown event "' + name + '"');
    }
  }

  /**
   * @private
   */
  connect(client) {
    super.connect(client);

    let clientType = client.type;

    if (this._clientTypes.indexOf(clientType) < 0)
      this._clientTypes.push(clientType);

    // init control parameters, infos, and commands at client
    this.receive(client, 'request', () => {
      super.send(client, 'init', this.events);
    });

    // listen to control parameters
    this.receive(client, 'event', (name, value) => {
      console.log(name, value);
      this.update(name, value);
    });
  }
}
