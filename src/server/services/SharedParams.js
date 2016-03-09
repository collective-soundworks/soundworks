import Activity from '../core/Activity';
import serviceManager from '../core/serviceManager';
import { EventEmitter } from 'events';

/** @private */
class _ControlItem extends EventEmitter {
  constructor(control, type, name, label, init = undefined, clientTypes = null) {
    super();

    this.control = control;
    this.clientTypes = clientTypes;

    this.data = {
      type: type,
      name: name,
      label: label,
      value: init,
    };

    control.items[name] = this;
    control._itemData.push(this.data);
  }

  set(val) {
    this.data.value = val;
  }

  update(val = undefined, excludeClient = null) {
    let control = this.control;
    let data = this.data;

    this.set(val); // set value
    this.emit(data.name, data.value); // call item listeners
    control.broadcast(this.clientTypes, excludeClient, 'update', data.name, data.value); // send to clients
    control.emit('update', data.name, data.value); // call control listeners
  }
}

/** @private */
class _BooleanItem extends _ControlItem {
  constructor(control, name, label, init, clientTypes = null) {
    super(control, 'boolean', name, label, init, clientType);
  }

  set(val) {
    this.data.value = val;
  }
}

/** @private */
class _EnumItem extends _ControlItem {
  constructor(control, name, label, options, init, clientTypes = null) {
    super(control, 'enum', name, label, init, clientTypes);

    this.data.options = options;
  }

  set(val) {
    let data = this.data;
    let index = data.options.indexOf(val);

    if (index >= 0) {
      data.value = val;
      data.index = index;
    }
  }
}

/** @private */
class _NumberItem extends _ControlItem {
  constructor(control, name, label, min, max, step, init, clientTypes = null) {
    super(control, 'number', name, label, init, clientTypes);

    let data = this.data;
    data.min = min;
    data.max = max;
    data.step = step;
  }

  set(val) {
    this.data.value = Math.min(this.data.max, Math.max(this.data.min, val));
  }
}

/** @private */
class _TextItem extends _ControlItem {
  constructor(control, name, label, init, clientTypes = null) {
    super(control, 'text', name, label, init, clientTypes);
  }

  set(val) {
    this.data.value = val;
  }
}

/** @private */
class _TriggerItem extends _ControlItem {
  constructor(control, name, label, clientTypes = null) {
    super(control, 'trigger', name, label, undefined, clientTypes);
  }
}


const SERVICE_ID = 'service:shared-params';

/**
 * [server] Manage the global `parameters`, `infos`, and `commands` across the whole scenario.
 *
 * The service keeps track of:
 * - `parameters`: values that can be updated by the actions of the clients (*e.g.* the gain of a synth);
 * - `infos`: information about the state of the scenario (*e.g.* number of clients in the performance);
 * - `commands`: can trigger an action (*e.g.* reload the page),
 * and propagates these to different client types.
 *
 * To set up controls in a scenario, you should extend this class on the server side and declare the controls specific to that scenario with the appropriate methods.
 *
 * (See also {@link src/client/ClientSharedParams.js~ClientSharedParams} on the client side.)
 *
 * @example // Example 1: make a `'conductor'` client to manage the controls
 * class MyControl extends SharedParams {
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
class SharedParams extends Activity {
  constructor(options = {}) {
    super(SERVICE_ID);

    /**
     * Dictionary of all control items.
     * @type {Object}
     */
    this.items = {};

    /**
     * Array of item data cells.
     * @type {Array}
     */
    this._itemData = [];
  }

  addItem() {
    const args = Array.from(arguments);
    const type = args.shift();
    let item;

    switch(type) {
      case 'boolean':
        item = this.addBool(...args);
        break;
      case 'enum':
        item = this.addEnum(...args);
        break;
      case 'number':
        item = this.addNumber(...args);
        break;
      case 'text':
        item = this.addText(...args);
        break;
      case 'trigger':
        item = this.addTrigger(...args);
        break;
    }

    return item;
  }

  /**
   * Adds a `boolean` parameter.
   * @param {String} name - Name of the parameter.
   * @param {String} label - Label of the parameter (displayed on the control GUI on the client side).
   * @param {Number} init - Initial value of the parameter (`true` or `false`).
   * @param {String[]} [clientTypes=null] - Array of the client types to send the parameter to. If not set, the parameter is sent to all the client types.
   */
  addBoolean(name, label, init, clientTypes = null) {
    return new _BooleanItem(this, name, label, init, clientTypes);
  }

  /**
   * Adds an `enum` parameter.
   * @param {String} name - Name of the parameter.
   * @param {String} label - Label of the parameter (displayed on the control GUI on the client side).
   * @param {String[]} options - Array of the different values the parameter can take.
   * @param {Number} init - Initial value of the parameter (has to be in the `options` array).
   * @param {String[]} [clientTypes=null] - Array of the client types to send the parameter to. If not set, the parameter is sent to all the client types.
   */
  addEnum(name, label, options, init, clientTypes = null) {
    return new _EnumItem(this, name, label, options, init, clientTypes);
  }

  /**
   * Adds a `number` parameter.
   * @param {String} name Name of the parameter.
   * @param {String} label Label of the parameter (displayed on the control GUI on the client side).
   * @param {Number} min - Minimum value of the parameter.
   * @param {Number} max - Maximum value of the parameter.
   * @param {Number} step - Step to increase or decrease the parameter value.
   * @param {Number} init - Initial value of the parameter.
   * @param {String[]} [clientTypes=null] - Array of the client types to send the parameter to. If not set, the parameter is sent to all the client types.
   */
  addNumber(name, label, min, max, step, init, clientTypes = null) {
    return new _NumberItem(this, name, label, min, max, step, init, clientTypes);
  }

  /**
   * Adds a `text` parameter.
   * @param {String} name - Name of the parameter.
   * @param {String} label - Label of the parameter (displayed on the control GUI on the client side).
   * @param {Number} init - Initial value of the parameter (has to be in the `options` array).
   * @param {String[]} [clientTypes=null] - Array of the client types to send the parameter to. If not set, the parameter is sent to all the client types.
   */
  addText(name, label, init, clientTypes = null) {
    return new _TextItem(this, name, label, init, clientTypes);
  }

  /**
   * Adds a trigger.
   * @param {String} name - Name of the command.
   * @param {String} label - Label of the command (displayed on the control GUI on the client side).
   * @param {String[]} [clientTypes=null] - Array of the client types to send the parameter to. If not set, the parameter is sent to all the client types.
   */
  addTrigger(name, label, clientTypes = null) {
    return new _TriggerItem(this, name, label, undefined, clientTypes);
  }

  /**
   * Add listener to a control item (i.e. parameter, info or command).
   * The given listener is fired immediately with the item current value.
   * @param {String} name - Name of the item.
   * @param {Function} listener - Listener callback.
   */
  addItemListener(name, listener) {
    const item = this.items[name];

    if (item) {
      item.addListener(item.data.name, listener);
      listener(item.data.value);
    } else {
      console.log('unknown shared parameter "' + name + '"');
    }
  }

  /**
   * Remove listener from a control item (i.e. parameter, info or command).
   * @param {String} name - Name of the item.
   * @param {Function} listener - Listener callback.
   */
  removeItemListener(name, listener) {
    const item = this.items[name];

    if (item)
      item.removeListener(item.data.name, listener);
    else
      console.log('unknown shared parameter "' + name + '"');
  }

  /**
   * Updates the value of a parameter and sends it to the clients.
   * @param {String} name - Name of the parameter to update.
   * @param {(String|Number|Boolean)} value - New value of the parameter.
   */
  update(name, value, excludeClient = null) {
    const item = this.items[name];

    if (item)
      item.update(value, excludeClient);
    else
      console.log('unknown shared parameter  "' + name + '"');
  }

  /** @private */
  connect(client) {
    super.connect(client);

    // init control parameters, infos, and commands at client
    this.receive(client, 'request', this._onRequest(client));
    this.receive(client, 'update', this._onUpdate(client));
  }

  _onRequest(client) {
    return () => this.send(client, 'init', this._itemData);
  }

  _onUpdate(client) {
    // update, but exclude client from broadcasting to other clients
    return (name, value) => this.update(name, value, client);
  }
}

serviceManager.register(SERVICE_ID, SharedParams);

export default SharedParams;
