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
 * Manage the global control `parameters`, `infos`, and `commands` across the whole scenario.
 *
 * The service keeps track of:
 * - `parameters`: values that can be updated by the actions of the clients (*e.g.* the gain of a synth);
 * - `infos`: information about the state of the scenario (*e.g.* number of clients in the performance);
 * - `commands`: can trigger an action (*e.g.* reload the page).
 *
 * If the service is instantiated with the `gui` option set to `true`, it constructs a graphical interface to modify the parameters, view the infos, and trigger the commands.
 * Otherwise (`gui` option set to `false`) the service emits an event when it receives updated values from the server.
 *
 * When the GUI is disabled, the service finishes its initialization immediately after having set up the controls.
 * Otherwise (GUI enabled), the service remains in its state and never finishes its initialization.
 *
 * When the service a view (`gui` option set to `true`), it requires the SASS partial `_77-checkin.scss`.
 *
 * @example // Example 1: make a client that displays the control GUI
 * const control = new SharedParams();
 *
 * // Initialize the client (indicate the client type)
 * client.init('conductor'); // accessible at the URL /conductor
 *
 * // Start the scenario
 * // For this client type (`'conductor'`), there is only one service
 * client.start(control);
 *
 * @example // Example 2: listen for parameter, infos & commands updates
 * const control = new SharedParams({ gui: false });
 *
 * // Listen for parameter, infos or command updates
 * control.on('update', (name, value) => {
 *   switch(name) {
 *     case 'synth:gain':
 *       console.log(`Update the synth gain to value #{value}.`);
 *       break;
 *     case 'reload':
 *       window.location.reload(true);
 *       break;
 *   }
 * });
 *
 * // Get current value of a parameter or info
 * const currentSynthGainValue = control.event['synth:gain'].value;
 * const currentNumPlayersValue = control.event['numPlayers'].value;
 */
class SharedParams extends Service {
  /**
   * @emits {'update'} when the server sends an update. The callback function takes `name:String` and `value:*` as arguments, where `name` is the name of the parameter / info / command, and `value` its new value.
   */
  constructor() {
    super(SERVICE_ID, true);

    /**
     * @param {Object} [options={}] Options.
     * @param {Boolean} [options.hasGui=true] - Indicates whether to create the graphical user interface to control the parameters or not.
     */
    const defaults = { hasGui: false };
    this.configure(defaults);

    /** @private */
    this._guiOptions = {};

    this._onInitResponse = this._onInitResponse.bind(this);
    this._onUpdateResponse = this._onUpdateResponse.bind(this);
  }

  init() {
    /**
     * Dictionary of all the parameters and commands.
     * @type {Object}
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

    // this.show();
  }

  /** @private */
  stop() {
    super.stop();
    // don't remove 'update' listener, as the control is runnig as a background process
    this.removeListener('init', this._onInitResponse);
  }

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

  _onUpdateResponse(name, val) {
    // update, but don't send back to server
    this.update(name, val, false);
  }

  /**
   * Adds a listener to a specific event (i.e. parameter, info or command).
   * @param {String} name Name of the event.
   * @param {Function} listener Listener callback.
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
   * Removes a listener from a specific event (i.e. parameter, info or command).
   * @param {String} name Name of the event.
   * @param {Function} listener Listener callback.
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
   * Get the value of a given parameter.
   * @param {String} name - The name of the parameter.
   * @returns {Mixed} - The related value.
   */
  getValue(name) {
    return this.items[name].value;
  }

  /**
   * Updates the value of a parameter.
   * @param {String} name - Name of the parameter to update.
   * @param {(String|Number|Boolean)} val - New value of the parameter.
   * @param {Boolean} [sendToServer=true] - Flag whether the value is sent to the server.
   */
  update(name, val, sendToServer = true) {
    const item = this.items[name];

    if (item) {
      item.update(val, sendToServer);
    } else {
      console.log('unknown control item "' + name + '"');
    }
  }

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
   * Configure the GUI for a specific control item (e.g. if it should appear or not,
   * which type of GUI to use).
   * @param {String} name - The name of the `item` to configure.
   * @param {Object} options - The options to apply to configure the given `item`.
   * @param {String} options.type - The type of GUI to use.
   * @param {Boolean} [options.show=true] - Show the GUI for this `item` or not.
   * @param {Boolean} [options.confirm=false] - Ask for confirmation when the value changes.
   */
  setGuiOptions(name, options) {
    this._guiOptions[name] = options;
  }

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
