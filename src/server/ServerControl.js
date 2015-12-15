import ServerModule from './ServerModule';
import { EventEmitter } from 'events';

/**
 * @private
 */
class _ControlEvent extends EventEmitter {
  constructor(control, type, name, label, init = undefined, clientTypes = null) {
    super();
    this.control = control;
    this.type = type;
    this.name = name;
    this.label = label;
    this.value = init;
  }

  set(val) {
    this.value = value;
  }

  update(val = undefined, excludeClient = null) {
    if(val === undefined)
      this.set(val); // set value

    this.emit(this.name, this.value);

    for (let clientType of event.clientTypes) {
      if(excludeClient && clientType === excludeClient.type)
        this.control.sendPeers(excludeClient, 'update', this.name, this.value);
      else
        this.control.broadcast(event.clientTypes, 'update', this.name, this.value);
    }

    this.emit(this.name, this.value)
  }
}

/**
 * @private
 */
class _ControlNumber extends _ControlEvent {
  constructor(control, name, label, min, max, step, init, clientTypes = null) {
    super(control, 'number', name, label, init, clientTypes);

    this.min = min;
    this.max = max;
    this.step = step;
  }

  set(val) {
    this.value = Math.min(this.max, Math.max(this.min, val));
  }
}

/**
 * @private
 */
class _ControlSelect extends _ControlEvent {
  constructor(control, name, label, options, init, clientTypes = null) {
    super(control, 'select', name, label, init, clientTypes);

    this.options = options;
  }

  set(val) {
    let index = this.options.indexOf(val);

    if (index >= 0) {
      this.value = val;
      this.index = index;
    }
  }
}

/**
 * @private
 */
class _ControlInfo extends _ControlEvent {
  constructor(control, name, label, init, clientTypes = null) {
    super(control, 'info', name, label, init, clientTypes);
  }

  set(val) {
    this.value = val;
  }
}

/**
 * @private
 */
class _ControlCommand extends _ControlEvent {
  constructor(control, name, label, clientTypes = null) {
    super(control, 'command', name, label, undefined, clientTypes);
  }
}

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
 * (See also {@link src/client/ClientControl.js~ClientControl} on the client side.)
 *
 * @example // Example 1: make a `'conductor'` client to manage the controls
 * class MyControl extends ServerControl {
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
export default class ServerControl extends ServerModule {
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
    this.events[name] = new _ControlNumber(this, name, label, min, max, step, init, clientTypes);
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
    this.events[name] = new _ControlSelect(this, name, label, options, init, clientTypes);
  }

  /**
   * Adds an info parameter.
   * @param {String} name Name of the parameter.
   * @param {String} label Label of the parameter (displayed on the control GUI on the client side).
   * @param {Number} init Initial value of the parameter (has to be in the `options` array).
   * @param {String[]} [clientTypes=null] Array of the client types to send the parameter to. If not set, the parameter is sent to all the client types.
   */
  addInfo(name, label, init, clientTypes = null) {
    this.events[name] = new _ControlInfo(this, name, label, init, clientTypes);
  }

  /**
   * Adds a command.
   * @param {String} name Name of the command.
   * @param {String} label Label of the command (displayed on the control GUI on the client side).
   * @param {String[]} [clientTypes=null] Array of the client types to send the parameter to. If not set, the parameter is sent to all the client types.
   */
  addCommand(name, label, clientTypes = null) {
    this.events[name] = new _ControlCommand(this, name, label, undefined, clientTypes);
  }

  /**
   * Add listener to an event (i.e. parameter, info or command).
   * @param {String} name Name of the event.
   * @param {Function} listener Listener callback.
   */
  addEventListener(name, listener) {
    const event = this.events[name];

    if (event)
      event.addListener(listener);
    else
      console.log('unknown control event "' + name + '"');
  }

  /**
   * Remove listener from an event (i.e. parameter, info or command).
   * @param {String} name Name of the event.
   * @param {Function} listener Listener callback.
   */
  removeEventListener(name, listener) {
    const event = this.events[name];

    if (event)
      event.removeListener(listener);
    else
      console.log('unknown control event "' + name + '"');
  }

  /**
   * Updates the value of a parameter and sends it to the clients.
   * @param {String} name Name of the parameter to update.
   * @param {(String|Number|Boolean)} value New value of the parameter.
   */
  update(name, value, excludeClient = null) {
    let event = this.events[name];

    if (event) {
      event.update(value, excludeClient);
    } else {
      console.log('unknown control event "' + name + '"');
    }
  }

  /**
   * @private
   */
  connect(client) {
    super.connect(client);

    // init control parameters, infos, and commands at client
    this.receive(client, 'request', () => {
      super.send(client, 'init', this.events);
    });

    // listen to control parameters
    this.receive(client, 'update', (name, value) => {
      this.update(name, value, client); // update, but exclude client from broadcasting to clients
    });
  }
}
