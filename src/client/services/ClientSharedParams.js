import basicControllers from 'waves-basic-controllers';
import { EventEmitter } from 'events';
import Service from '../core/Service';
import serviceManager from '../core/serviceManager';

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
class _BooleanUnit extends _ControlUnit {
  constructor(control, name, label, init) {
    super(control, 'boolean', name, label);
    this.set(init);
  }

  set(val) {
    this.value = val;
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
class _TextUnit extends _ControlUnit {
  constructor(control, name, label, init) {
    super(control, 'text', name, label);
    this.set(init);
  }

  set(val) {
    this.value = val;
  }
}

/** @private */
class _TriggerUnit extends _ControlUnit {
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
  constructor($container, unit, guiOptions) {
    const { label, value } = unit;

    this.controller = new basicControllers.Toggle(label, value);
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
class _NumberGui {
  constructor($container, unit, guiOptions) {
    const { label, min, max, step, value } = unit;

    if (guiOptions.type === 'slider')
      this.controller = new basicControllers.Slider(label, min, max, step, value, guiOptions.unit, guiOptions.size);
    else
      this.controller = new basicControllers.NumberBox(label, min, max, step, value);

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
class _TextGui {
  constructor($container, unit, guiOptions) {
    const { label, value } = unit;

    this.controller = new basicControllers.Text(label, value, guiOptions.readOnly);
    $container.appendChild(this.controller.render());
    this.controller.onRender();

    if (!guiOptions.readOnly) {
      this.controller.on('change', () => {
        if (guiOptions.confirm) {
          const msg = `Are you sure you want to propagate "${unit.name}"`;
          if (!window.confirm(msg)) { return; }
        }

        unit.update();
      });
    }
  }

  set(val) {
    this.controller.value = val;
  }
}

/** @private */
class _TriggerGui {
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


const SERVICE_ID = 'service:shared-params';

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
 * const control = new ClientSharedParams();
 *
 * // Initialize the client (indicate the client type)
 * client.init('conductor'); // accessible at the URL /conductor
 *
 * // Start the scenario
 * // For this client type (`'conductor'`), there is only one module
 * client.start(control);
 *
 * @example // Example 2: listen for parameter, infos & commands updates
 * const control = new ClientSharedParams({ gui: false });
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
class ClientSharedParams extends Service {
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
    this.units = {};

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
      const unit = this._createControlUnit(entry);
      this.units[unit.name] = unit;

      if (this.view)
        this._createGui(this.view, unit);
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
  addUnitListener(name, listener) {
    const unit = this.units[name];

    if (unit) {
      unit.addListener('update', listener);

      if (unit.type !== 'command')
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

  /**
   * Get the value of a given parameter.
   * @param {String} name - The name of the parameter.
   * @returns {Mixed} - The related value.
   */
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
      case 'boolean':
        unit = new _BooleanUnit(this, init.name, init.label, init.value);
        break;

      case 'enum':
        unit = new _EnumUnit(this, init.name, init.label, init.options, init.value);
        break;

      case 'number':
        unit = new _NumberUnit(this, init.name, init.label, init.min, init.max, init.step, init.value);
        break;

      case 'text':
        unit = new _TextUnit(this, init.name, init.label, init.value);
        break;

      case 'trigger':
        unit = new _TriggerUnit(this, init.name, init.label);
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

    if (config.show === false) return null;

    let gui = null;
    const $container = this.view.$el;

    switch (unit.type) {
      case 'boolean':
        gui = new _BooleanGui($container, unit, config); // `Toggle`
        break;
      case 'enum':
        gui = new _EnumGui($container, unit, config); // `SelectList` or `SelectButtons`
        break;
      case 'number':
        gui = new _NumberGui($container, unit, config); // `NumberBox` or `Slider`
        break;
      case 'text':
        gui = new _TextGui($container, unit, config); // `Text`
        break;
      case 'trigger':
        gui = new _TriggerGui($container, unit, config);
        break;
    }

    unit.addListener('update', (val) => gui.set(val));

    return gui;
  }
}

serviceManager.register(SERVICE_ID, ClientSharedParams);

export default ClientSharedParams;
