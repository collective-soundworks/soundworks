import basicControllers from 'waves-basic-controllers';
import ClientModule from './ClientModule';
import { EventEmitter } from 'events';

basicControllers.disableStyles();

/* --------------------------------------------------------- */
/* CONTROL UNITS
/* --------------------------------------------------------- */

/** @private */
class _ControlUnit extends EventEmitter {
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
class _NumberUnit extends _ControlUnit {
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
class _EnumUnit extends _ControlUnit {
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
class _InfoUnit extends _ControlUnit {
  constructor(control, name, label, init) {
    super(control, 'info', name, label);
    this.set(init);
  }

  set(val) {
    this.value = val;
  }
}

/** @private */
class _CommandUnit extends _ControlUnit {
  constructor(control, name, label) {
    super(control, 'command', name, label);
  }

  set(val) {
    // nothing to set here
  }
}


/* --------------------------------------------------------- */
/* GUIs
/* --------------------------------------------------------- */

/** @private */
class _NumberGui {
  constructor($container, unit, guiOptions) {
    const { label, min, max, step, value } = unit;

    if (guiOptions.type === 'slider') {
      this.controller = new basicControllers.Slider(label, min, max, step, value, guiOptions.unit, guiOptions.size);
    } else {
      this.controller = new basicControllers.NumberBox(label, min, max, step, value);
    }

    $container.appendChild(this.controller.render());
    this.controller.onRender();

    this.controller.on('change', (value) => {
      if (guiOptions.confirm) {
        const msg = `Are you sure you want to propagate "${unit.name}:${value}"`;
        if (!window.confirm(msg)) { return; }
      }

      unit.update(value);
    });
  }

  set(val) {
    this.controller.value = val;
  }
}

/** @private */
class _EnumGui {
  constructor($container, unit, guiOptions) {
    const { label, options, value } = unit;

    const ctor = guiOptions.type === 'buttons' ?
      basicControllers.SelectButtons : basicControllers.SelectList

    this.controller = new ctor(label, options, value);
    $container.appendChild(this.controller.render());
    this.controller.onRender();

    this.controller.on('change', (value) => {
      if (guiOptions.confirm) {
        const msg = `Are you sure you want to propagate "${unit.name}:${value}"`;
        if (!window.confirm(msg)) { return; }
      }

      unit.update(value);
    });
  }

  set(val) {
    this.controller.value = val;
  }
}

/** @private */
class _CommandGui {
  constructor($container, unit, guiOptions) {
    const { label } = unit;

    this.controller = new basicControllers.Buttons('', [label]);
    $container.appendChild(this.controller.render());
    this.controller.onRender();

    this.controller.on('change', () => {
      if (guiOptions.confirm) {
        const msg = `Are you sure you want to propagate "${unit.name}"`;
        if (!window.confirm(msg)) { return; }
      }

      unit.update();
    });
  }

  set(val) { /* nothing to set here */ }
}

/** @private */
class _InfoGui {
  constructor($container, unit, guiOptions) {
    const { label, value } = unit;

    this.controller = new basicControllers.Info(label, value);
    $container.appendChild(this.controller.render());
    this.controller.onRender();
  }

  set(val) {
    this.controller.value = val;
  }
}

/**
 * Manage the global control `parameters`, `infos`, and `commands` across the whole scenario.
 *
 * The module keeps track of:
 * - `parameters`: values that can be updated by the actions of the clients (*e.g.* the gain of a synth);
 * - `infos`: information about the state of the scenario (*e.g.* number of clients in the performance);
 * - `commands`: can trigger an action (*e.g.* reload the page).
 *
 * If the module is instantiated with the `gui` option set to `true`, it constructs a graphical interface to modify the parameters, view the infos, and trigger the commands.
 * Otherwise (`gui` option set to `false`) the module emits an event when it receives updated values from the server.
 *
 * When the GUI is disabled, the module finishes its initialization immediately after having set up the controls.
 * Otherwise (GUI enabled), the modules remains in its state and never finishes its initialization.
 *
 * When the module a view (`gui` option set to `true`), it requires the SASS partial `_77-checkin.scss`.
 *
 * (See also {@link src/server/ServerControl.js~ServerControl} on the server side.)
 *
 * @example // Example 1: make a client that displays the control GUI
 * const control = new ClientControl();
 *
 * // Initialize the client (indicate the client type)
 * client.init('conductor'); // accessible at the URL /conductor
 *
 * // Start the scenario
 * // For this client type (`'conductor'`), there is only one module
 * client.start(control);
 *
 * @example // Example 2: listen for parameter, infos & commands updates
 * const control = new ClientControl({ gui: false });
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
export default class ClientControl extends ClientModule {
  /**
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='sync'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   * @param {Boolean} [options.gui=true] Indicates whether to create the graphical user interface to control the parameters or not.
   * @emits {'update'} when the server sends an update. The callback function takes `name:String` and `value:*` as arguments, where `name` is the name of the parameter / info / command, and `value` its new value.
   */
  constructor(options = {}) {
    super(options.name || 'control', options);

    /**
     * Dictionary of all the parameters and commands.
     * @type {Object}
     */
    this.units = {};

    /**
     * Flag whether client has control GUI.
     * @type {Boolean}
     */
    this.hasGui = options.hasGui;

    this._guiOptions = {};

    this.init();
  }

  init() {
    if (this.hasGui) {
      this.view = this.createView();
    }
  }

  /**
   * Adds a listener to a specific event (i.e. parameter, info or command).
   * @param {String} name Name of the event.
   * @param {Function} listener Listener callback.
   */
  addUnitListener(name, listener) {
    const unit = this.units[name];

    if (unit) {
      unit.addListener('update', listener);
      listener(unit.value);
    } else {
      console.log('unknown unit "' + name + '"');
    }
  }

  /**
   * Removes a listener from a specific event (i.e. parameter, info or command).
   * @param {String} name Name of the event.
   * @param {Function} listener Listener callback.
   */
  removeUnitListener(name, listener) {
    const unit = this.units[name];

    if (unit) {
      unit.removeListener('update', listener);
    } else {
      console.log('unknown unit "' + name + '"');
    }
  }

  getValue(name) {
    return this.units[name].value;
  }

  /**
   * Updates the value of a parameter.
   * @param {String} name - Name of the parameter to update.
   * @param {(String|Number|Boolean)} val - New value of the parameter.
   * @param {Boolean} [sendToServer=true] - Flag whether the value is sent to the server.
   */
  update(name, val, sendToServer = true) {
    const unit = this.units[name];

    if (unit) {
      unit.update(val, sendToServer);
    } else {
      console.log('unknown control unit "' + name + '"');
    }
  }

  _createControlUnit(init) {
    let unit = null;

    switch (init.type) {
      case 'number':
        unit = new _NumberUnit(this, init.name, init.label, init.min, init.max, init.step, init.value);
        break;

      case 'enum':
        unit = new _EnumUnit(this, init.name, init.label, init.options, init.value);
        break;

      case 'info':
        unit = new _InfoUnit(this, init.name, init.label, init.value);
        break;

      case 'command':
        unit = new _CommandUnit(this, init.name, init.label);
        break;
    }

    return unit;
  }

  /**
   * Configure the GUI for a specific control unit (e.g. if it should appear or not,
   * which type of GUI to use).
   * @param {String} name - The name of the `unit` to configure.
   * @param {Object} options - The options to apply to configure the given `unit`.
   * @param {String} options.type - The type of GUI to use.
   * @param {Boolean} [options.show=true] - Show the GUI for this `unit` or not.
   * @param {Boolean} [options.confirm=false] - Ask for confirmation when the value changes.
   */
  setGuiOptions(name, options) {
    this._guiOptions[name] = options;
  }

  _createGui(view, unit) {
    const config = Object.assign({
      show: true,
      confirm: false,
    }, this._guiOptions[unit.name]);

    if (config.show === false) {
      return null;
    }

    let gui = null;
    const $container = this.view.$el;

    switch (unit.type) {
      case 'number':
        // `NumberBox` or `Slider`
        gui = new _NumberGui($container, unit, config);
        break;

      case 'enum':
        // `SelectList` or `SelectButtons`
        gui = new _EnumGui($container, unit, config);
        break;

      case 'command':
        // `Button`
        gui = new _CommandGui($container, unit, config);
        break;

      case 'info':
        // `Info`
        gui = new _InfoGui($container, unit, config);
        break;

      // case 'toggle'
    }

    unit.addListener('update', (val) => gui.set(val));

    return gui;
  }

  /**
   * Starts the module and requests the parameters to the server.
   */
  start() {
    super.start();
    this.send('request');

    const view = (this.hasGui) ? this.view : null;

    this.receive('init', (config) => {
      config.forEach((entry) => {
        const unit = this._createControlUnit(entry);
        this.units[unit.name] = unit;

        if (view) { this._createGui(view, unit); }
      });

      if (!view) { this.done(); }
    });

    // listen to events
    this.receive('update', (name, val) => {
      this.update(name, val, false); // update, but don't send to server
    });
  }

  /**
   * Restarts the module and requests the parameters to the server.
   */
  restart() {
    super.restart();
    this.send('request');
  }
}
