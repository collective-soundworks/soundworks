import Module from './Module';

// @todo refactor

/**
 * @private
 */
class ControlEvent {
  constructor(type, parent, name, label) {
    this.type = type;
    this.name = name;
    this.label = label;
    this.parent = parent;
    this.value = undefined;
  }

  set(val) {

  }

  send() {
    this.parent.send('event', this.name, this.value);
  }
}

/**
 * @private
 */
class ControlNumber extends ControlEvent {
  constructor(parent, init, view = null) {
    super('number', parent, init.name, init.label);
    this.min = init.min;
    this.max = init.max;
    this.step = init.step;
    this.box = null;

    if (view) {
      let box = this.box = document.createElement('input');
      box.setAttribute('id', this.name + '-box');
      box.setAttribute('type', 'number');
      box.setAttribute('min', this.min);
      box.setAttribute('max', this.max);
      box.setAttribute('step', this.step);
      box.setAttribute('size', 16);

      box.onchange = (() => {
        let val = Number(box.value);
        this.set(val);
        this.send();
      });

      let incrButton = document.createElement('button');
      incrButton.setAttribute('id', this.name + '-incr');
      incrButton.setAttribute('width', '0.5em');
      incrButton.innerHTML = '>';
      incrButton.onclick = (() => {
        this.incr();
        this.send();
      });

      let decrButton = document.createElement('button');
      decrButton.setAttribute('id', this.name + '-descr');
      decrButton.style.width = '0.5em';
      decrButton.innerHTML = '<';
      decrButton.onclick = (() => {
        this.decr();
        this.send();
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

    this.set(init.value);
  }

  set(val, send = false) {
    this.value = Math.min(this.max, Math.max(this.min, val));

    if (this.box)
      this.box.value = val;
  }

  incr() {
    let steps = Math.floor(this.value / this.step + 0.5);
    this.set(this.step * (steps + 1));
  }

  decr() {
    let steps = Math.floor(this.value / this.step + 0.5);
    this.set(this.step * (steps - 1));
  }
}

class ControlSelect extends ControlEvent {
  constructor(parent, init, view = null) {
    super('select', parent, init.name, init.label);
    this.options = init.options;
    this.box = null;

    if (view) {
      let box = this.box = document.createElement('select');
      box.setAttribute('id', this.name + '-box');

      for (let option of this.options) {
        let optElem = document.createElement("option");
        optElem.value = option;
        optElem.text = option;
        box.appendChild(optElem);
      }

      box.onchange = (() => {
        this.set(box.value);
        this.send();
      });

      let incrButton = document.createElement('button');
      incrButton.setAttribute('id', this.name + '-incr');
      incrButton.setAttribute('width', '0.5em');
      incrButton.innerHTML = '>';
      incrButton.onclick = (() => {
        this.incr();
        this.send();
      });

      let decrButton = document.createElement('button');
      decrButton.setAttribute('id', this.name + '-descr');
      decrButton.style.width = '0.5em';
      decrButton.innerHTML = '<';
      decrButton.onclick = (() => {
        this.decr();
        this.send();
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

    this.set(init.value);
  }

  set(val, send = false) {
    let index = this.options.indexOf(val);

    if (index >= 0) {
      this.value = val;
      this.index = index;

      if (this.box)
        this.box.value = val;
    }
  }

  incr() {
    this.index = (this.index + 1) % this.options.length;
    this.set(this.options[this.index]);
  }

  decr() {
    this.index = (this.index + this.options.length - 1) % this.options.length;
    this.set(this.options[this.index]);
  }
}

class ControlInfo extends ControlEvent {
  constructor(parent, init, view = null) {
    super('info', parent, init.name, init.label);
    this.box = null;

    if (view) {
      let box = this.box = document.createElement('span');
      box.setAttribute('id', this.name + '-box');

      let label = document.createElement('span');
      label.innerHTML = this.label + ': ';

      let div = document.createElement('div');
      div.appendChild(label);
      div.appendChild(box);
      div.appendChild(document.createElement('br'));

      view.appendChild(div);
    }

    this.set(init.value);
  }

  set(val) {
    this.value = val;

    if (this.box)
      this.box.innerHTML = val;
  }
}

class ControlCommand extends ControlEvent {
  constructor(parent, init, view = null) {
    super('command', parent, init.name, init.label);

    if (view) {
      let div = document.createElement('div');
      div.setAttribute('id', this.name + '-btn');
      div.classList.add('command');
      div.innerHTML = this.label;

      div.onclick = (() => {
        this.send();
      });

      view.appendChild(div);
      view.appendChild(document.createElement('br'));
    }
  }
}

/**
 * [client] Manage the global `parameters`, `infos`, and `commands` across the whole scenario.
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
 * control.on('control:event', (name, value) => {
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
export default class ClientControl extends Module {
  /**
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='sync'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   * @param {Boolean} [options.gui=true] Indicates whether to create the graphical user interface to control the parameters or not.
   * @emits {'control:event'} when the server sends an update. The callback function takes `name:String` and `value:*` as arguments, where `name` is the name of the parameter / info / command, and `value` its new value.
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
   * Starts the module and requests the parameters to the server.
   */
  start() {
    super.start();

    let view = this._ownsView ? this.view : null;

    this.receive('init', (events) => {
      if (view) {
        let title = document.createElement('h1');
        title.innerHTML = 'Conductor';
        view.appendChild(title);
      }

      for (let key of Object.keys(events)) {
        let event = events[key];

        switch (event.type) {
          case 'number':
            this.events[key] = new ControlNumber(this, event, view);
            break;

          case 'select':
            this.events[key] = new ControlSelect(this, event, view);
            break;

          case 'info':
            this.events[key] = new ControlInfo(this, event, view);
            break;

          case 'command':
            this.events[key] = new ControlCommand(this, event, view);
            break;
        }
      }

      if (!view)
        this.done();
    });

    // listen to events
    this.receive('event', (name, val) => {
      const event = this.events[name];

      if (event) {
        event.set(val);
        this.emit(`${this.name}:event`, name, val);
      }
      else
        console.log('client control: received unknown event "' + name + '"');
    });

    super.send('request');
  }

  /**
   * Restarts the module and requests the parameters to the server.
   */
  restart() {
    super.restart();
    super.send('request');
  }

  /**
   * Sends a value or command to the server.
   * @param {String} name Name of the parameter or command to send.
   * @todo is this method useful?
   */
  // send(name) {
  //   const event = this.events[name];

  //   if (event) {
  //     event.send();
  //   }
  // }

  /**
   * Updates the value of a parameter.
   * @param {String} name Name of the parameter to update.
   * @param {(String|Number|Boolean)} val New value of the parameter.
   */
  update(name, val) {
    const event = this.events[name];

    if (event) {
      event.set(val);
      event.send();
    }
  }
}
