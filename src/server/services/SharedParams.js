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
 * Interface of the server `'shared-params'` service.
 *
 * This service allow to create shared parameter items among to distributed
 * application. Each defined parameter (`item`) can be of the following
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
     * Dictionary of all control items.
     * @type {Object}
     * @private
     */
    this.items = {};

    /**
     * Array of item data cells.
     * @type {Array}
     */
    this._itemData = [];
  }

  /**
   * Generic method to create items. The first argument defines the type of item,
   * the corresponding method (for example `addBoolean`) is called when the
   * remaining arguments.
   * @param {String} type - Type of item to create.
   * @param {...Mixed} args - Arguments to pass to the specific add method.
   */
  addItem(type, ...args) {
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
   * @todo - remove `labels` and define them client side in guiOptions.
   */

  /**
   * Add a `boolean` parameter item.
   * @param {String} name - Name of the item.
   * @param {String} label - Label of the item (displayed on the control
   *  GUI on the client side)
   * @param {Number} init - Initial value of the item (`true` or `false`).
   * @param {String[]} [clientTypes=null] - Array of the client types to send
   *  the item value to. If not set, the value is sent to all the client types.
   */
  addBoolean(name, label, init, clientTypes = null) {
    return new _BooleanItem(this, name, label, init, clientTypes);
  }

  /**
   * Add an `enum` parameter item.
   * @param {String} name - Name of the item.
   * @param {String} label - Label of the item (displayed on the control
   *  GUI on the client side).
   * @param {String[]} options - Different possible values of the item.
   * @param {Number} init - Initial value of the item (must be defined in `options`).
   * @param {String[]} [clientTypes=null] - Array of the client types to send
   *  the item value to. If not set, the value is sent to all the client types.
   */
  addEnum(name, label, options, init, clientTypes = null) {
    return new _EnumItem(this, name, label, options, init, clientTypes);
  }

  /**
   * Add a `number` parameter item.
   * @param {String} name - Name of the item.
   * @param {String} label - Label of the item (displayed on the control
   *  GUI on the client side).
   * @param {Number} min - Minimum value of the item.
   * @param {Number} max - Maximum value of the item.
   * @param {Number} step - Step by which the item value is increased or decreased.
   * @param {Number} init - Initial value of the item.
   * @param {String[]} [clientTypes=null] - Array of the client types to send
   *  the item value to. If not set, the value is sent to all the client types.
   */
  addNumber(name, label, min, max, step, init, clientTypes = null) {
    return new _NumberItem(this, name, label, min, max, step, init, clientTypes);
  }

  /**
   * Add a `text` parameter item.
   * @param {String} name - Name of the item.
   * @param {String} label - Label of the item (displayed on the control
   *  GUI on the client side).
   * @param {Number} init - Initial value of the item.
   * @param {String[]} [clientTypes=null] - Array of the client types to send
   *  the item value to. If not set, the value is sent to all the client types.
   */
  addText(name, label, init, clientTypes = null) {
    return new _TextItem(this, name, label, init, clientTypes);
  }

  /**
   * Add a trigger item.
   * @param {String} name - Name of the item.
   * @param {String} label - Label of the item (displayed on the control
   *  GUI on the client side).
   * @param {String[]} [clientTypes=null] - Array of the client types to send
   *  the item value to. If not set, the value is sent to all the client types.
   */
  addTrigger(name, label, clientTypes = null) {
    return new _TriggerItem(this, name, label, undefined, clientTypes);
  }

  /**
   * @callback module:soundworks/server.SharedParams~itemCallback
   * @param {Mixed} value - Updated value of the item.
   */
  /**
   * Add a listener to listen a specific item changes. The listener is called a first
   * time when added to retrieve the current value of the item.
   * @param {String} name - Name of the item.
   * @param {module:soundworks/server.SharedParams~itemCallback} listener - Callback
   *  that handle the event.
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
   * Remove a listener from listening a specific item changes.
   * @param {String} name - Name of the event.
   * @param {module:soundworks/client.SharedParams~itemCallback} listener - The
   *  callback to remove.
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
   * @private
   * @param {String} name - Name of the parameter to update.
   * @param {Mixed} value - New value of the parameter.
   * @param {String} [excludeClient=null] - Exclude the given client from the
   *  clients to send the update to (generally the source of the update).
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

    this.receive(client, 'request', this._onRequest(client));
    this.receive(client, 'update', this._onUpdate(client));
  }

  /** @private */
  _onRequest(client) {
    return () => this.send(client, 'init', this._itemData);
  }

  /** @private */
  _onUpdate(client) {
    // update, but exclude client from broadcasting to other clients
    return (name, value) => this.update(name, value, client);
  }
}

serviceManager.register(SERVICE_ID, SharedParams);

export default SharedParams;
