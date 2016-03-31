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

    control.params[name] = this;
    control._paramData.push(this.data);
  }

  set(val) {
    this.data.value = val;
  }

  update(val = undefined, excludeClient = null) {
    let control = this.control;
    let data = this.data;

    this.set(val); // set value
    this.emit(data.name, data.value); // call param listeners
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
 * Interface of the server `'shared-params'` service.
 *
 * This service allow to create shared parameters among to distributed
 * application. Each shared parameter can be of the following
 * data types:
 * - boolean
 * - enum
 * - number
 * - text
 * - trigger,
 *
 * configured with specific attributes, and bounded to specific type of clients.
 *
 * __*The service must be used with its [client-side counterpart]{@link module:soundworks/client.SharedParams}*__
 *
 * @memberof module:soundworks/server
 * @example
 * // create a boolean shared parameter with default value to `false`,
 * // inside the server experience constructor
 * this.sharedParams = this.require('shared-params');
 * this.sharedParams.addBoolean('my:boolean', 'MyBoolean', false);
 */
class SharedParams extends Activity {
  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  constructor(options = {}) {
    super(SERVICE_ID);

    /**
     * Dictionary of all control parameters.
     * @type {Object}
     * @private
     */
    this.params = {};

    /**
     * Array of parameter data cells.
     * @type {Array}
     */
    this._paramData = [];
  }

  /**
   * Generic method to create shared parameters from an array of definitions.
   * A definition is an object with a 'type' property
   * ('boolean' | 'enum' | 'number' | 'text' | 'trigger') a set of properties
   * corresponding to the argument of the corresponding add<Type> method.
   * @see {@link SharedParams#addBoolean}
   * @see {@link SharedParams#addEnum}
   * @see {@link SharedParams#addNumber}
   * @see {@link SharedParams#addText}
   * @see {@link SharedParams#addTrigger}
   * @param {Array} definitions - An array of parameter definitions.
   */
  add(definitions) {
    for (let def of definitions) {
      let type = def.type || 'text';

      switch(type) {
        case 'boolean':
          this.addBoolean(def.name, def.label, def.value, def.clientTypes);
          break;
        case 'enum':
          this.addEnum(def.name, def.label, def.options, def.value, def.clientTypes);
          break;
        case 'number':
          this.addNumber(def.name, def.label, def.min, def.max, def.step, def.value, def.clientTypes);
          break;
        case 'text':
          this.addText(def.name, def.label, def.value, def.clientTypes);
          break;
        case 'trigger':
          this.addTrigger(def.name, def.label, def.clientTypes);
          break;
      }
    }
  }

  /**
   * Add a `boolean` parameter.
   * @param {String} name - Name of the parameter.
   * @param {String} label - Label of the parameter (displayed on the control
   *  GUI on the client side)
   * @param {Number} value - Initial value of the parameter (`true` or `false`).
   * @param {String[]} [clientTypes=null] - Array of the client types to send
   *  the parameter value to. If not set, the value is sent to all the client types.
   */
  addBoolean(name, label, value, clientTypes = null) {
    return new _BooleanItem(this, name, label, value, clientTypes);
  }

  /**
   * Add an `enum` parameter.
   * @param {String} name - Name of the parameter.
   * @param {String} label - Label of the parameter (displayed on the control
   *  GUI on the client side).
   * @param {String[]} options - Different possible values of the parameter.
   * @param {Number} value - Initial value of the parameter (must be defined in `options`).
   * @param {String[]} [clientTypes=null] - Array of the client types to send
   *  the parameter value to. If not set, the value is sent to all the client types.
   */
  addEnum(name, label, options, value, clientTypes = null) {
    return new _EnumItem(this, name, label, options, value, clientTypes);
  }

  /**
   * Add a `number` parameter.
   * @param {String} name - Name of the parameter.
   * @param {String} label - Label of the parameter (displayed on the control
   *  GUI on the client side).
   * @param {Number} min - Minimum value of the parameter.
   * @param {Number} max - Maximum value of the parameter.
   * @param {Number} step - Step by which the parameter value is increased or decreased.
   * @param {Number} value - Initial value of the parameter.
   * @param {String[]} [clientTypes=null] - Array of the client types to send
   *  the parameter value to. If not set, the value is sent to all the client types.
   */
  addNumber(name, label, min, max, step, value, clientTypes = null) {
    return new _NumberItem(this, name, label, min, max, step, value, clientTypes);
  }

  /**
   * Add a `text` parameter.
   * @param {String} name - Name of the parameter.
   * @param {String} label - Label of the parameter (displayed on the control
   *  GUI on the client side).
   * @param {Number} value - Initial value of the parameter.
   * @param {String[]} [clientTypes=null] - Array of the client types to send
   *  the parameter value to. If not set, the value is sent to all the client types.
   */
  addText(name, label, value, clientTypes = null) {
    return new _TextItem(this, name, label, value, clientTypes);
  }

  /**
   * Add a trigger (not really a parameter).
   * @param {String} name - Name of the trigger.
   * @param {String} label - Label of the trigger (displayed on the control
   *  GUI on the client side).
   * @param {String[]} [clientTypes=null] - Array of the client types to send
   *  the trigger to. If not set, the value is sent to all the client types.
   */
  addTrigger(name, label, clientTypes = null) {
    return new _TriggerItem(this, name, label, undefined, clientTypes);
  }

  /**
   * @callback module:soundworks/server.SharedParams~paramCallback
   * @param {Mixed} value - Updated value of the parameter.
   */
  /**
   * Add a listener to listen a specific parameter changes. The listener is called a first
   * time when added to retrieve the current value of the parameter.
   * @param {String} name - Name of the parameter.
   * @param {module:soundworks/server.SharedParams~paramCallback} listener - Callback
   *  that handle the event.
   */
  addParamListener(name, listener) {
    const param = this.params[name];

    if (param) {
      param.addListener(param.data.name, listener);
      listener(param.data.value);
    } else {
      console.log('unknown shared parameter "' + name + '"');
    }
  }

  /**
   * Remove a listener from listening a specific parameter changes.
   * @param {String} name - Name of the event.
   * @param {module:soundworks/client.SharedParams~paramCallback} listener - The
   *  callback to remove.
   */
  removeParamListener(name, listener) {
    const param = this.params[name];

    if (param)
      param.removeListener(param.data.name, listener);
    else
      console.log('unknown shared parameter "' + name + '"');
  }

  /**
   * Updates the value of a parameter and sends it to the clients.
   * @private
   * @param {String} name - Name of the parameter to update.
   * @param {Mixed} value - New value of the parameter.
   * @param {String} [excludeClient=null] - Exclude the given client from the
   *  clients to send the update to (generally the source of the update).
   */
  update(name, value, excludeClient = null) {
    const param = this.params[name];

    if (param)
      param.update(value, excludeClient);
    else
      console.log('unknown shared parameter  "' + name + '"');
  }

  /** @private */
  connect(client) {
    super.connect(client);

    this.receive(client, 'request', this._onRequest(client));
    this.receive(client, 'update', this._onUpdate(client));
  }

  /** @private */
  _onRequest(client) {
    return () => this.send(client, 'init', this._paramData);
  }

  /** @private */
  _onUpdate(client) {
    // update, but exclude client from broadcasting to other clients
    return (name, value) => this.update(name, value, client);
  }
}

serviceManager.register(SERVICE_ID, SharedParams);

export default SharedParams;
