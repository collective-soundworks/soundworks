import ClientModule from './ClientModule';
import { EventEmitter } from 'events';

/**
 * @private
 */
class _ControlEvent extends EventEmitter {
  constructor(control, type, name, label) {
    this.control = control;
    this.type = type;
    this.name = name;
    this.label = label;
    this.value = undefined;
  }

  set(val) {
    this.value = value;
  }

  update(val, sendToServer = true) {
    this.set(val); // set value
    this.emit(this.name, this.value); // call event listeners

    if(sendToServer)
      this.control.send('update', name, val); // send to server

    this.control.emit('update', name, val); // call control listeners
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
      this.value = val;
      this.index = index;
    }
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
class _NumberGui extends EventEmitter {
  constructor(view) {
    let box = document.createElement('input');
    box.setAttribute('id', this.name + '-box');
    box.setAttribute('type', 'number');
    box.setAttribute('min', this.min);
    box.setAttribute('max', this.max);
    box.setAttribute('step', this.step);
    box.setAttribute('size', 16);

    box.onchange = (() => {
      let val = Number(box.value);
      this.emit('update', val);
    });

    this.box = box;

    let incrButton = document.createElement('button');
    incrButton.setAttribute('id', this.name + '-incr');
    incrButton.setAttribute('width', '0.5em');
    incrButton.innerHTML = '>';
    incrButton.onclick = (() => {
      let steps = Math.floor(this.value / this.step + 0.5);
      let val = this.step * (steps + 1);
      this.emit('update', val);
    });

    let decrButton = document.createElement('button');
    decrButton.setAttribute('id', this.name + '-descr');
    decrButton.style.width = '0.5em';
    decrButton.innerHTML = '<';
    decrButton.onclick = (() => {
      let steps = Math.floor(this.value / this.step + 0.5);
      let val = this.step * (steps - 1);
      this.emit('update', val);
    });

    let label = document.createElement('span');
    label.innerHTML = this.label + ': ';

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
class _SelectGui extends EventEmitter {
  constructor(view) {
    let box = document.createElement('select');
    box.setAttribute('id', this.name + '-box');

    for (let option of this.options) {
      let optElem = document.createElement("option");
      optElem.value = option;
      optElem.text = option;
      box.appendChild(optElem);
    }

    box.onchange = (() => {
      this.update(box.value);
    });

    this.box = box;

    let incrButton = document.createElement('button');
    incrButton.setAttribute('id', this.name + '-incr');
    incrButton.setAttribute('width', '0.5em');
    incrButton.innerHTML = '>';
    incrButton.onclick = (() => {
      this.index = (this.index + 1) % this.options.length;
      this.emit('update', this.options[this.index]);
    });

    let decrButton = document.createElement('button');
    decrButton.setAttribute('id', this.name + '-descr');
    decrButton.style.width = '0.5em';
    decrButton.innerHTML = '<';
    decrButton.onclick = (() => {
      this.index = (this.index + this.options.length - 1) % this.options.length;
      this.emit('update', this.options[this.index]);
    });

    let label = document.createElement('span');
    label.innerHTML = this.label + ': ';

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
class _InfoGui extends EventEmitter {
  constructor(view) {
    let box = document.createElement('span');
    box.setAttribute('id', this.name + '-box');

    let label = document.createElement('span');
    label.innerHTML = this.label + ': ';

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
class _CommandGui extends EventEmitter {
  constructor(view) {
    let div = document.createElement('div');
    div.setAttribute('id', this.name + '-btn');
    div.classList.add('command');
    div.innerHTML = this.label;

    div.onclick = (() => {
      this.emit('update');
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
    super(options.name || 'control', (options.gui === true), options.color);

    /**
     * Dictionary of all the parameters and commands.
     * @type {Object}
     */
    this.events = {};
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
   */
  update(name, val, sendToServer = true) {
    const event = this.events[name];

    if (event) {
      event.update(val, sendToServer);
    } else {
      console.log('unknown control event "' + name + '"');
    }
  }

  _createEvent(event) {
    let event = null;

    switch (event.type) {
      case 'number':
        event = new _ControlNumber(this, event.name, event.label, event.min, event.max, event.step, event.value);
        break;

      case 'select':
        event = new _ControlSelect(this, event.name, event.label, event.options, event.value);
        break;

      case 'info':
        event = new _ControlInfo(this, event.name, event.label, event.value);
        break;

      case 'command':
        event = new _ControlCommand(this, event.name, event.label);
        break;
    }

    return event;
  }

  _createGui(view, type) {
    let gui = null;

    switch (type) {
      case 'number':
        gui = new _NumberGui(view);
        break;

      case 'select':
        gui = new _SelectGui(view);
        break;

      case 'info':
        gui = new _InfoGui(view);
        break;

      case 'command':
        gui = new _CommandGui(view);
        break;
    }

    return gui;
  }

  /**
   * Starts the module and requests the parameters to the server.
   */
  start() {
    super.start();

    this.send('request');

    let view = this._ownsView ? this.view : null;

    this.receive('init', (initEvents) => {
      if (view) {
        let title = document.createElement('h1');
        title.innerHTML = 'Conductor';
        view.appendChild(title);
      }

      for (let key of Object.keys(initEvents)) {
        let init = initEvents[key];

        let event = this._createEvent(init);
        this.events[key] = event;

        if(view)
          this._createGui(view, event.type);
      }

      if (!view)
        this.done();
    });

    // listen to events
    this.receive('update', (name, val) => {
      const event = this.events[name];

      if (event)
        this.update(name, val, false); // update, but don't send to server
      else
        console.log('client control: received unknown event "' + name + '"');
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
