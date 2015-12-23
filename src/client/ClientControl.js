import basicControllers from 'waves-basic-controllers';
import ClientModule from './ClientModule';
import { EventEmitter } from 'events';

basicControllers.setTheme('dark');


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

  propagate(sendToServer = true) {
    this.emit('update', this.value); // call event listeners

    if (sendToServer)
      this.control.send('update', this.name, this.value); // send to server

    this.control.emit('update', this.name, this.value); // call control listeners
  }

  update(val) {
    this.set(val);
    this.propagate();
  }
}

/** @private */
class _ControlNumber extends _ControlUnit {
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

  // is now handled from the GUI
  incr() {
    let steps = Math.floor(this.value / this.step + 0.5);
    this.value = this.step * (steps + 1);
  }

  decr() {
    let steps = Math.floor(this.value / this.step + 0.5);
    this.value = this.step * (steps - 1);
  }
}

/** @private */
class _ControlSelect extends _ControlUnit {
  constructor(control, name, label, options, init) {
    super(control, 'select', name, label);
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

  // is now handled from the GUI
  incr() {
    this.index = (this.index + 1) % this.options.length;
    this.value = this.options[this.index];
  }

  decr() {
    this.index = (this.index + this.options.length - 1) % this.options.length;
    this.value = this.options[this.index];
  }
}

/** @private */
class _ControlInfo extends _ControlUnit {
  constructor(control, name, label, init) {
    super(control, 'info', name, label);
    this.set(init);
  }

  set(val) {
    this.value = val;
  }
}

/** @private */
class _ControlCommand extends _ControlUnit {
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
  constructor(view, controlUnit, guiOptions) {
    const { label, min, max, step, value } = controlUnit;

    if (guiOptions.type === 'slider') {
      this.controller = new basicControllers.Slider(label, min, max, step, value, guiOptions.unit, guiOptions.size);
    } else {
      this.controller = new basicControllers.NumberBox(label, min, max, step, value);
    }

    view.$el.appendChild(this.controller.render());

    this.controller.on('change', (value) => {
      if (guiOptions.confirm) {
        const msg = `Are you sure you want to propagate "${controlUnit.name}:${value}"`;
        if (!window.confirm(msg)) { return; }
      }

      controlUnit.set(value);
      controlUnit.propagate();
    });
  }

  set(val) {
    this.controller.value = val;
  }
}

/** @private */
class _SelectGui {
  constructor(view, controlUnit, guiOptions) {
    const { label, options, value } = controlUnit;

    const ctor = guiOptions.type === 'buttons' ?
      basicControllers.SelectButtons : basicControllers.SelectList

    this.controller = new ctor(label, options, value);
    view.$el.appendChild(this.controller.render());

    this.controller.on('change', (value) => {
      if (guiOptions.confirm) {
        const msg = `Are you sure you want to propagate "${controlUnit.name}:${value}"`;
        if (!window.confirm(msg)) { return; }
      }

      controlUnit.set(value);
      controlUnit.propagate();
    });
  }

  set(val) {
    this.controller.value = val;
  }
}

/** @private */
class _CommandGui {
  constructor(view, controlUnit, guiOptions) {
    const { label } = controlUnit;

    this.controller = new basicControllers.Buttons('', [label]);
    view.$el.appendChild(this.controller.render());

    this.controller.on('change', () => {
      if (guiOptions.confirm) {
        const msg = `Are you sure you want to propagate "${controlUnit.name}"`;
        if (!window.confirm(msg)) { return; }
      }

      controlUnit.propagate()
    });
  }

  set(val) { /* nothing to set here */ }
}

/** @private */
class _InfoGui {
  constructor(view, controlUnit, guiOptions) {
    const { label, value } = controlUnit;

    this.controller = new basicControllers.Info(label, value);
    view.$el.appendChild(this.controller.render());
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
    this.controlUnits = {};

    /**
     * Flag whether client has control GUI.
     * @type {Boolean}
     */
    this.hasGui = options.hasGui;

    this._guiConfig = {};

    this.init();
  }

  init() {
    if (this.hasGui) {
      this.view = this.createDefaultView();
    }
  }

  /**
   * Adds a listener to a specific event (i.e. parameter, info or command).
   * @param {String} name Name of the event.
   * @param {Function} listener Listener callback.
   */
  addEventListener(name, listener) {
    const controlUnit = this.controlUnits[name];

    if (controlUnit) {
      controlUnit.addListener('update', listener);
    } else {
      console.log('unknown controlUnit "' + name + '"');
    }
  }

  /**
   * Removes a listener from a specific event (i.e. parameter, info or command).
   * @param {String} name Name of the event.
   * @param {Function} listener Listener callback.
   */
  removeEventListener(name, listener) {
    const controlUnit = this.controlUnits[name];

    if (controlUnit) {
      controlUnit.removeListener('update', listener);
    } else {
      console.log('unknown controlUnit "' + name + '"');
    }
  }

  getValue(name) {
    return this.controlUnits[name].value;
  }

  /**
   * Updates the value of a parameter.
   * @param {String} name Name of the parameter to update.
   * @param {(String|Number|Boolean)} val New value of the parameter.
   * @param {Boolean} [sendToServer=true] Flag whether the value is sent to the server.
   */
  update(name, val, sendToServer = true) {
    const controlUnit = this.controlUnits[name];

    if (controlUnit) {
      controlUnit.set(val);
      controlUnit.propagate(sendToServer);
    } else {
      console.log('unknown control controlUnit "' + name + '"');
    }
  }

  _createControlUnit(init) {
    let controlUnit = null;

    switch (init.type) {
      case 'number':
        controlUnit = new _ControlNumber(this, init.name, init.label, init.min, init.max, init.step, init.value);
        break;

      case 'select':
        controlUnit = new _ControlSelect(this, init.name, init.label, init.options, init.value);
        break;

      case 'info':
        controlUnit = new _ControlInfo(this, init.name, init.label, init.value);
        break;

      case 'command':
        controlUnit = new _ControlCommand(this, init.name, init.label);
        break;
    }

    return controlUnit;
  }

  configureGui(name, options) {
    this._guiConfig[name] = options;
  }

  _createGui(view, controlUnit) {
    let gui = null;
    const config = Object.assign({
      show: true,
      confirm: false,
    }, this._guiConfig[controlUnit.name]);

    if (config.show === false) {
      return null;
    }

    switch (controlUnit.type) {
      case 'number':
        // can be `NumberBox` or `Slider`
        gui = new _NumberGui(view, controlUnit, config);
        break;

      case 'select':
        // can be `SelectList` or `SelectButtons`
        gui = new _SelectGui(view, controlUnit, config);
        break;

      case 'command':
        // can be `Button` (or `Bang` @todo)
        gui = new _CommandGui(view, controlUnit, config);
        break;

      case 'info':
        // can be
        gui = new _InfoGui(view, controlUnit, config);
        break;

      // case 'toggle' ?
    }

    controlUnit.addListener('update', (val) => gui.set(val));

    return gui;
  }

  /**
   * Starts the module and requests the parameters to the server.
   */
  start() {
    super.start();

    this.send('request');

    let view = (this.hasGui) ? this.view : null;

    this.receive('init', (data) => {
      if (view) {
        // create a template
        let title = document.createElement('h1');
        title.innerHTML = 'Conductor';
        view.$el.appendChild(title);
      }

      for (let d of data) {
        let controlUnit = this._createControlUnit(d);
        this.controlUnits[controlUnit.name] = controlUnit;

        if (view)
          this._createGui(view, controlUnit);
      }

      if (!view)
        this.done();
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
