import ClientModule from './ClientModule';
import { EventEmitter } from 'events';

/**
 * @private
 */
class _ControlEvent extends EventEmitter {
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

    if(sendToServer)
      this.control.send('update', this.name, this.value); // send to server

    this.control.emit('update', this.name, this.value); // call control listeners
  }

  update(val) {
    this.set(val);
    this.propagate();
  }
}

/**
 * @private
 */
class _ControlNumber extends _ControlEvent {
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

  incr() {
    let steps = Math.floor(this.value / this.step + 0.5);
    this.value = this.step * (steps + 1);
  }

  decr() {
    let steps = Math.floor(this.value / this.step + 0.5);
    this.value = this.step * (steps - 1);
  }
}

class _ControlSelect extends _ControlEvent {
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

  incr() {
    this.index = (this.index + 1) % this.options.length;
    this.value = this.options[this.index];
  }

  decr() {
    this.index = (this.index + this.options.length - 1) % this.options.length;
    this.value = this.options[this.index];
  }
}

class _ControlInfo extends _ControlEvent {
  constructor(control, name, label, init) {
    super(control, 'info', name, label);
    this.set(init);
  }

  set(val) {
    this.value = val;
  }
}

class _ControlCommand extends _ControlEvent {
  constructor(control, name, label) {
    super(control, 'command', name, label);
  }

  set(val) {
    // nothing to set here
  }
}

/**
 * @private
 */
class _NumberGui {
  constructor(view, event) {
    let box = document.createElement('input');
    box.setAttribute('id', event.name + '-box');
    box.setAttribute('type', 'number');
    box.setAttribute('min', event.min);
    box.setAttribute('max', event.max);
    box.setAttribute('step', event.step);
    box.setAttribute('value', event.value);
    box.setAttribute('size', 16);

    box.onchange = (() => {
      let val = Number(box.value);
      event.set(val);
      event.propagate();
    });

    this.box = box;

    let incrButton = document.createElement('button');
    incrButton.setAttribute('id', event.name + '-incr');
    incrButton.setAttribute('width', '0.5em');
    incrButton.innerHTML = '>';
    incrButton.onclick = (() => {
      event.incr();
      event.propagate();
    });

    let decrButton = document.createElement('button');
    decrButton.setAttribute('id', event.name + '-decr');
    decrButton.style.width = '0.5em';
    decrButton.innerHTML = '<';
    decrButton.onclick = (() => {
      event.decr();
      event.propagate();
    });

    let label = document.createElement('span');
    label.innerHTML = event.label + ': ';

    let div = document.createElement('div');
    div.appendChild(label);
    div.appendChild(decrButton);
    div.appendChild(box);
    div.appendChild(incrButton);
    div.appendChild(document.createElement('br'));

    view.appendChild(div);
  }

  set(val) {
    this.box.value = val;
  }
}

/**
 * @private
 */
class _SelectGui {
  constructor(view, event) {
    let box = document.createElement('select');
    box.setAttribute('id', event.name + '-box');

    for (let option of event.options) {
      let optElem = document.createElement("option");
      optElem.value = option;
      optElem.text = option;
      box.appendChild(optElem);
    }

    box.onchange = (() => {
      event.set(box.value);
      event.propagate();
    });

    this.box = box;

    let incrButton = document.createElement('button');
    incrButton.setAttribute('id', event.name + '-incr');
    incrButton.setAttribute('width', '0.5em');
    incrButton.innerHTML = '>';
    incrButton.onclick = (() => {
      event.incr();
      event.propagate();
    });

    let decrButton = document.createElement('button');
    decrButton.setAttribute('id', event.name + '-decr');
    decrButton.style.width = '0.5em';
    decrButton.innerHTML = '<';
    decrButton.onclick = (() => {
      event.decr();
      event.propagate();
    });

    let label = document.createElement('span');
    label.innerHTML = event.label + ': ';

    let div = document.createElement('div');
    div.appendChild(label);
    div.appendChild(decrButton);
    div.appendChild(box);
    div.appendChild(incrButton);
    div.appendChild(document.createElement('br'));

    view.appendChild(div);
  }

  set(val) {
    this.box.value = val;
  }
}

/**
 * @private
 */
class _InfoGui {
  constructor(view, event) {
    let box = document.createElement('span');
    box.setAttribute('id', event.name + '-box');

    let label = document.createElement('span');
    label.innerHTML = event.label + ': ';

    let div = document.createElement('div');
    div.appendChild(label);
    div.appendChild(box);
    div.appendChild(document.createElement('br'));

    view.appendChild(div);

    this.box = box;
  }

  set(val) {
    this.box.innerHTML = val;
  }
}

/**
 * @private
 */
class _CommandGui {
  constructor(view, event) {
    let div = document.createElement('div');
    div.setAttribute('id', event.name + '-btn');
    div.classList.add('command');
    div.innerHTML = event.label;

    div.onclick = (() => {
      event.propagate();
    });

    view.appendChild(div);
    view.appendChild(document.createElement('br'));
  }

  set(val) {
    // nothing to set here
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
    super(options.name || 'control', (options.hasGui === true), options.color);

    /**
     * Dictionary of all the parameters and commands.
     * @type {Object}
     */
    this.events = {};

    /**
     * Flag whether client has control GUI.
     * @type {Boolean}
     */
    this.hasGui = options.hasGui;
  }

  /**
   * Adds a listener to a specific event (i.e. parameter, info or command).
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
   * Removes a listener from a specific event (i.e. parameter, info or command).
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
   * Updates the value of a parameter.
   * @param {String} name Name of the parameter to update.
   * @param {(String|Number|Boolean)} val New value of the parameter.
   * @param {Boolean} [sendToServer=true] Flag whether the value is sent to the server.
   */
  update(name, val, sendToServer = true) {
    const event = this.events[name];

    if (event) {
      event.set(val);
      event.propagate(sendToServer);
    } else {
      console.log('unknown control event "' + name + '"');
    }
  }

  _createEvent(init) {
    let event = null;

    switch (init.type) {
      case 'number':
        event = new _ControlNumber(this, init.name, init.label, init.min, init.max, init.step, init.value);
        break;

      case 'select':
        event = new _ControlSelect(this, init.name, init.label, init.options, init.value);
        break;

      case 'info':
        event = new _ControlInfo(this, init.name, init.label, init.value);
        break;

      case 'command':
        event = new _ControlCommand(this, init.name, init.label);
        break;
    }

    return event;
  }

  _createGui(view, event) {
    let gui = null;

    switch (event.type) {
      case 'number':
        gui = new _NumberGui(view, event);
        break;

      case 'select':
        gui = new _SelectGui(view, event);
        break;

      case 'info':
        gui = new _InfoGui(view, event);
        break;

      case 'command':
        gui = new _CommandGui(view, event);
        break;
    }

    event.addListener('update', (val) => gui.set(val));

    return gui;
  }

  /**
   * Starts the module and requests the parameters to the server.
   */
  start() {
    super.start();

    this.send('request');

    let view = (this.hasGui)? this.$container: null;

    this.receive('init', (data) => {
      if (view) {
        let title = document.createElement('h1');
        title.innerHTML = 'Conductor';
        view.appendChild(title);
      }

      for (let d of data) {
        let event = this._createEvent(d);
        this.events[event.name] = event;

        if(view)
          this._createGui(view, event);
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
