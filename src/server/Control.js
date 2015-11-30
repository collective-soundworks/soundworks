import server from './server';
import Module from './Module';


/**
 * [server] Manage the global `parameters`, `infos`, and `commands` across the whole scenario.
 *
 * The module keeps track of:
 * - `parameters`: values that can be updated by the actions of the clients (*e.g.* the gain of a synth);
 * - `infos`: information about the state of the scenario (*e.g.* number of clients in the performance);
 * - `commands`: can trigger an action (*e.g.* reload the page),
 * and propagates these to different client types.
 *
 * To set up controls in a scenario, you should extend this class on the server side and declare the controls specific to that scenario with the appropriate methods.
 *
 * (See also {@link src/client/Control.js~Control} on the client side.)
 *
 * @example // Example 1: make a `'conductor'` client to manage the controls
 * class MyControl extends Control {
 *   constructor() {
 *     super();
 *
 *     // Parameter shared by all the client types
 *     this.addNumber('synth:gain', 'Synth gain', 0, 1, 0.1, 1);
 *     // Command propagated only to the `'player'` clients
 *     this.addCommand('reload', 'Reload the page', ['player']);
 *   }
 * }
 *
 * @example // Example 2: keep track of the number of `'player'` clients
 * class MyControl extends Control {
 *   constructor() {
 *     super();
 *     this.addInfo('numPlayers', 'Number of players', 0);
 *   }
 * }
 *
 * class MyPerformance extends Performance {
 *   constructor(control) {
 *     this._control = control;
 *   }
 *
 *   enter(client) {
 *     super.enter(client);
 *
 *     this._control.update('numPlayers', this.clients.length);
 *   }
 * }
 *
 * const control = new MyControl();
 * const performance = new MyPerformance(control);
 */
export default class Control extends Module {
  /**
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
      server.broadcast(clientType, 'control:event', event.name, event.value);

    this.emit('control:event', event.name, event.value);
  }

  /**
   * Sends an event to the clients.
   * @param {String} name Name of the event to send.
   * @emits 'control:event'
   */
  send(name) {
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
    client.receive('control:request', () => {
      client.send('control:init', this.events);
    });

    // listen to control parameters
    client.receive('control:event', (name, value) => {
      this.update(name, value);
    });
  }
}
