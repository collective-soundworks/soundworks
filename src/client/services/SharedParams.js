import basicControllers from 'waves-basic-controllers';
import { EventEmitter } from 'events';
import Service from '../core/Service';
import serviceManager from '../core/serviceManager';

basicControllers.disableStyles();

/* --------------------------------------------------------- */
/* CONTROL UNITS
/* --------------------------------------------------------- */

/** @private */
class _ControlItem extends EventEmitter {
  constructor(control, type, name, label) {
    super();
    this.control = control;
    this.type = type;
    this.name = name;
    this.label = label;
    this.value = undefined;
  }

  set(val) {
    this.value = value;
  }

  _propagate(sendToServer = true) {
    this.emit('update', this.value); // call event listeners

    if (sendToServer)
      this.control.send('update', this.name, this.value); // send to server

    this.control.emit('update', this.name, this.value); // call control listeners
  }

  update(val, sendToServer = true) {
    this.set(val);
    this._propagate(sendToServer);
  }
}


/** @private */
class _BooleanItem extends _ControlItem {
  constructor(control, name, label, init) {
    super(control, 'boolean', name, label);
    this.set(init);
  }

  set(val) {
    this.value = val;
  }
}

/** @private */
class _EnumItem extends _ControlItem {
  constructor(control, name, label, options, init) {
    super(control, 'enum', name, label);
    this.options = options;
    this.set(init);
  }

  set(val) {
    let index = this.options.indexOf(val);

    if (index >= 0) {
      this.index = index;
      this.value = val;
    }
  }
}

/** @private */
class _NumberItem extends _ControlItem {
  constructor(control, name, label, min, max, step, init) {
    super(control, 'number', name, label);
    this.min = min;
    this.max = max;
    this.step = step;
    this.set(init);
  }

  set(val) {
    this.value = Math.min(this.max, Math.max(this.min, val));
  }
}

/** @private */
class _TextItem extends _ControlItem {
  constructor(control, name, label, init) {
    super(control, 'text', name, label);
    this.set(init);
  }

  set(val) {
    this.value = val;
  }
}

/** @private */
class _TriggerItem extends _ControlItem {
  constructor(control, name, label) {
    super(control, 'trigger', name, label);
  }

  set(val) { /* nothing to set here */ }
}

/* --------------------------------------------------------- */
/* GUIs
/* --------------------------------------------------------- */

/** @private */
class _BooleanGui {
  constructor($container, item, guiOptions) {
    const { label, value } = item;

    this.controller = new basicControllers.Toggle(label, value);
    $container.appendChild(this.controller.render());
    this.controller.onRender();

    this.controller.on('change', (value) => {
      if (guiOptions.confirm) {
        const msg = `Are you sure you want to propagate "${item.name}:${value}"`;
        if (!window.confirm(msg)) { return; }
      }

      item.update(value);
    });
  }

  set(val) {
    this.controller.value = val;
  }
}

/** @private */
class _EnumGui {
  constructor($container, item, guiOptions) {
    const { label, options, value } = item;

    const ctor = guiOptions.type === 'buttons' ?
      basicControllers.SelectButtons : basicControllers.SelectList

    this.controller = new ctor(label, options, value);
    $container.appendChild(this.controller.render());
    this.controller.onRender();

    this.controller.on('change', (value) => {
      if (guiOptions.confirm) {
        const msg = `Are you sure you want to propagate "${item.name}:${value}"`;
        if (!window.confirm(msg)) { return; }
      }

      item.update(value);
    });
  }

  set(val) {
    this.controller.value = val;
  }
}

/** @private */
class _NumberGui {
  constructor($container, item, guiOptions) {
    const { label, min, max, step, value } = item;

    if (guiOptions.type === 'slider')
      this.controller = new basicControllers.Slider(label, min, max, step, value, guiOptions.item, guiOptions.size);
    else
      this.controller = new basicControllers.NumberBox(label, min, max, step, value);

    $container.appendChild(this.controller.render());
    this.controller.onRender();

    this.controller.on('change', (value) => {
      if (guiOptions.confirm) {
        const msg = `Are you sure you want to propagate "${item.name}:${value}"`;
        if (!window.confirm(msg)) { return; }
      }

      item.update(value);
    });
  }

  set(val) {
    this.controller.value = val;
  }
}

/** @private */
class _TextGui {
  constructor($container, item, guiOptions) {
    const { label, value } = item;

    this.controller = new basicControllers.Text(label, value, guiOptions.readOnly);
    $container.appendChild(this.controller.render());
    this.controller.onRender();

    if (!guiOptions.readOnly) {
      this.controller.on('change', () => {
        if (guiOptions.confirm) {
          const msg = `Are you sure you want to propagate "${item.name}"`;
          if (!window.confirm(msg)) { return; }
        }

        item.update();
      });
    }
  }

  set(val) {
    this.controller.value = val;
  }
}

/** @private */
class _TriggerGui {
  constructor($container, item, guiOptions) {
    const { label } = item;

    this.controller = new basicControllers.Buttons('', [label]);
    $container.appendChild(this.controller.render());
    this.controller.onRender();

    this.controller.on('change', () => {
      if (guiOptions.confirm) {
        const msg = `Are you sure you want to propagate "${item.name}"`;
        if (!window.confirm(msg)) { return; }
      }

      item.update();
    });
  }

  set(val) { /* nothing to set here */ }
}


const SERVICE_ID = 'service:shared-params';

/**
 * Interface of the client `'shared-params'` service.
 *
 * This service is used to maintain and update global parameters used among
 * all connected clients. Each defined parameter (`item`) can be of the following
 * data type:
 * - boolean
 * - enum
 * - number
 * - text
 * - trigger
 *
 * This type and specific attributes of an item is configured server side.
 * The service is espacially usefull if a special client is defined with the
 * `hasGUI` option setted to true, allowing to create a special client aimed at
 * controlling the different parameters of the experience.
 *
 * __*The service must be used with its [server-side counterpart]{@link module:soundworks/server.SharedParams}*__
 *
 * @param {Object} options
 * @param {Boolean} [options.hasGui=true] - Defines if the service should display
 *  a GUI. If set to `true`, the service never set its `ready` signal to true and
 *  the client application stay in this state forever. The option should then be
 *  used create special clients (sometimes called `conductor`) aimed at
 *  controlling application parameters in real time.
 *
 * @memberof module:soundworks/client
 * @example
 * // inside the experience constructor
 * this.control = this.require('shared-params');
 * // when the experience starts, listen for item updates
 * this.control.addItemListener('synth:gain', (value) => {
 *   this.synth.setGain(value);
 * });
 */
class SharedParams extends Service {
  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  constructor() {
    super(SERVICE_ID, true);

    const defaults = { hasGui: false };
    this.configure(defaults);

    /** @private */
    this._guiOptions = {};

    this._onInitResponse = this._onInitResponse.bind(this);
    this._onUpdateResponse = this._onUpdateResponse.bind(this);
  }

  /** @private */
  init() {
    /**
     * Dictionary of all the parameters and commands.
     * @type {Object}
     * @private
     */
    this.items = {};

    if (this.options.hasGui)
      this.view = this.createView();
  }

  /** @private */
  start() {
    super.start();

    if (!this.hasStarted)
      this.init();

    this.send('request');

    this.receive('init', this._onInitResponse);
    this.receive('update', this._onUpdateResponse);
  }

  /** @private */
  stop() {
    super.stop();
    // don't remove 'update' listener, as the control is runnig as a background process
    this.removeListener('init', this._onInitResponse);
  }

  /** @private */
  _onInitResponse(config) {
    this.show();

    config.forEach((entry) => {
      const item = this._createControlItem(entry);
      this.items[item.name] = item;

      if (this.view)
        this._createGui(this.view, item);
    });

    if (!this.options.hasGui)
      this.ready();
  }

  /** @private */
  _onUpdateResponse(name, val) {
    // update, but don't send back to server
    this.update(name, val, false);
  }

  /**
   * @callback module:soundworks/client.SharedParams~itemCallback
   * @param {Mixed} value - Updated value of the item.
   */
  /**
   * Add a listener to listen a specific item changes. The listener is called a first
   * time when added to retrieve the current value of the item.
   * @param {String} name - Name of the item.
   * @param {module:soundworks/client.SharedParams~itemCallback} listener - Callback
   *  that handle the event.
   */
  addItemListener(name, listener) {
    const item = this.items[name];

    if (item) {
      item.addListener('update', listener);

      if (item.type !== 'command')
        listener(item.value);
    } else {
      console.log('unknown item "' + name + '"');
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

    if (item) {
      item.removeListener('update', listener);
    } else {
      console.log('unknown item "' + name + '"');
    }
  }

  /**
   * Get the value of a given item.
   * @param {String} name - The name of the item.
   * @returns {Mixed} - The current value of the item.
   */
  getValue(name) {
    return this.items[name].value;
  }

  /**
   * Update the value of an item (used when `options.hasGUI=true`)
   * @private
   * @param {String} name - Name of the item.
   * @param {Mixed} val - New value of the item.
   * @param {Boolean} [sendToServer=true] - Flag whether the value should be
   *  propagate to the server.
   */
  update(name, val, sendToServer = true) {
    const item = this.items[name];

    if (item) {
      item.update(val, sendToServer);
    } else {
      console.log('unknown control item "' + name + '"');
    }
  }

  /** @private */
  _createControlItem(init) {
    let item = null;

    switch (init.type) {
      case 'boolean':
        item = new _BooleanItem(this, init.name, init.label, init.value);
        break;

      case 'enum':
        item = new _EnumItem(this, init.name, init.label, init.options, init.value);
        break;

      case 'number':
        item = new _NumberItem(this, init.name, init.label, init.min, init.max, init.step, init.value);
        break;

      case 'text':
        item = new _TextItem(this, init.name, init.label, init.value);
        break;

      case 'trigger':
        item = new _TriggerItem(this, init.name, init.label);
        break;
    }

    return item;
  }

  /**
   * Configure the GUI for a specific item, this method only makes sens if
   * `options.hasGUI=true`.
   * @param {String} name - Name of the item to configure.
   * @param {Object} options - Options to configure the item GUI.
   * @param {String} options.type - Type of GUI to use. Each type of item can
   *  used with different GUI according to their type and comes with acceptable
   *  default values.
   * @param {Boolean} [options.show=true] - Display or not the GUI for this item.
   * @param {Boolean} [options.confirm=false] - Ask for confirmation when the value changes.
   */
  setGuiOptions(name, options) {
    this._guiOptions[name] = options;
  }

  /** @private */
  _createGui(view, item) {
    const config = Object.assign({
      show: true,
      confirm: false,
    }, this._guiOptions[item.name]);

    if (config.show === false) return null;

    let gui = null;
    const $container = this.view.$el;

    switch (item.type) {
      case 'boolean':
        gui = new _BooleanGui($container, item, config); // `Toggle`
        break;
      case 'enum':
        gui = new _EnumGui($container, item, config); // `SelectList` or `SelectButtons`
        break;
      case 'number':
        gui = new _NumberGui($container, item, config); // `NumberBox` or `Slider`
        break;
      case 'text':
        gui = new _TextGui($container, item, config); // `Text`
        break;
      case 'trigger':
        gui = new _TriggerGui($container, item, config);
        break;
    }

    item.addListener('update', (val) => gui.set(val));

    return gui;
  }
}

serviceManager.register(SERVICE_ID, SharedParams);

export default SharedParams;
