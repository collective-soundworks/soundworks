'use strict';

import client from './client.es6.js';
import ClientModule from './ClientModule.es6.js';

class ControlEvent {
  constructor(type, name, label) {
    this.type = type;
    this.name = name;
    this.label = label;
    this.value = undefined;
  }

  set(val) {

  }

  send() {
    client.send('control:event', this.name, this.value);
  }
}

class ControlNumber extends ControlEvent {
  constructor(init, view = null) {
    super('number', init.name, init.label);
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
  constructor(init, view = null) {
    super('select', init.name, init.label);
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
  constructor(init, view = null) {
    super('info', init.name, init.label);
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
  constructor(init, view = null) {
    super('command', init.name, init.label);

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
 * The `ClientControl` module takes care of the global `parameters`, `infos`, and `commands` on the client side.
 * If the module is instantiated with the `gui` option set to `true`, it constructs the graphical control interface.
 * Otherwise it simply receives the values that are emitted by the server (usually by through the `performance` module).
 *
 * The `ClientModule` calls its `done` method:
 * - Immediately after having set up the controls if the GUI is disabled;
 * - Never if the GUI is enabled.
 */
export default class ClientControl extends ClientModule {
  /**
   * Creates an instance of the class.
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='sync'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   * @param {Boolean} [options.gui=true] Indicates whether to create the graphical user interface to control the parameters or not.
   * @emits {'control:event'} when the server sends an update.
   */
  constructor(options = {}) {
    super(options.name || 'control', (options.gui === true), options.color);

    /**
     * Dictionary of all the parameters and commands.
     * @type {Object}
     */
    this.events = {};

    let view = hasGui ? this.view : null;

    client.receive('control:init', (events) => {
      if (view) {
        let title = document.createElement('h1');
        title.innerHTML = 'Conductor';
        view.appendChild(title);
      }

      for (let key of Object.keys(events)) {
        let event = events[key];

        switch (event.type) {
          case 'number':
            this.events[key] = new ControlNumber(event, view);
            break;

          case 'select':
            this.events[key] = new ControlSelect(event, view);
            break;

          case 'info':
            this.events[key] = new ControlInfo(event, view);
            break;

          case 'command':
            this.events[key] = new ControlCommand(event, view);
            break;
        }
      }

      if (!view)
        this.done();
    });

    // listen to events
    client.receive('control:event', (name, val) => {
      let event = this.events[name];

      if (event) {
        event.set(val);
        this.emit('control:event', name, val);
      }
      else
        console.log('client control: received unknown event "' + name + '"');
    });
  }

  /**
   * Starts the module and requests the parameters to the server.
   */
  start() {
    super.start();
    client.send('control:request');
  }

  /**
   * Restarts the module and requests the parameters to the server.
   */
  restart() {
    super.restart();
    client.send('control:request');
  }

  /**
   * Sends a value or command to the server.
   * @param {String} name Name of the parameter or command to send.
   * @todo is this method useful?
   */
  send(name) {
    const event = this.events[name];

    if (event) {
      event.send();
    }
  }

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
