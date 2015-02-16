/**
 * @fileoverview Matrix client side conductor module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ClientModule = require('./ClientModule');
var client = require('./client');

class ControlNumber {
  constructor(control, view = null) {
    this.type = 'number';
    this.name = control.name;
    this.label = control.label;
    this.min = control.min;
    this.max = control.max;
    this.step = control.step;
    this.box = null;

    if (view) {
      var box = this.box = document.createElement('input');
      box.setAttribute('id', this.name + '-box');
      box.setAttribute('type', 'number');
      box.setAttribute('min', this.min);
      box.setAttribute('max', this.max);
      box.setAttribute('step', this.step);
      box.setAttribute('size', '4');

      box.onchange = (() => {
        var val = Number(box.value);
        this.set(val, true);
      });

      var decrButton = document.createElement('button');
      decrButton.setAttribute('id', this.name + '-descr');
      decrButton.style.width = '0.5em';
      decrButton.innerHTML = '<';
      decrButton.onclick = decrButton.ontouchstart = (() => {
        this.incr(-this.step, true);
      });

      var incrButton = document.createElement('button');
      incrButton.setAttribute('id', this.name + '-incr');
      incrButton.setAttribute('width', '0.5em');
      incrButton.innerHTML = '>';
      incrButton.onclick = incrButton.ontouchstart = (() => {
        this.incr(this.step, true);
      });

      var label = document.createElement('span');
      label.innerHTML = this.label + ': ';

      view.appendChild(label);
      view.appendChild(decrButton);
      view.appendChild(box);
      view.appendChild(incrButton);
      view.appendChild(document.createElement('br'));
    }

    this.set(control.value);
  }

  set(val, send = false) {
    this.value = Math.min(this.max, Math.max(this.min, val));

    if (this.box)
      this.box.value = val;

    if (send)
      client.socket.emit('conductor_control', this.name, this.value);
  }

  incr(val, send = false) {
    this.set(this.value + val, send);
  }
}

class ControlSelect {
  constructor(control, view = null) {
    this.type = 'select';
    this.name = control.name;
    this.label = control.label;
    this.options = control.options;
    this.box = null;

    if (view) {
      var box = this.box = document.createElement('select');
      box.setAttribute('id', this.name + '-box');

      for (let option of this.options) {
        var optElem = document.createElement("option");
        optElem.value = option;
        optElem.text = option;
        box.appendChild(optElem);
      }

      box.onchange = (() => {
        this.set(box.value, true);
      });

      var label = document.createElement('span');
      label.innerHTML = this.label + ': ';

      view.appendChild(label);
      view.appendChild(box);
      view.appendChild(document.createElement('br'));
    }

    this.set(control.value);
  }

  set(val, send = false) {
    var index = this.options.indexOf(val);

    if (index >= 0) {
      this.value = val;
      this.index = index;

      if (this.box)
        this.box.value = val;

      if (send)
        client.socket.emit('conductor_control', this.name, val);
    }
  }

  incr(val, send = false) {
    this.index = (this.index + 1) % this.options.length;
    this.set(this.options[this.index], send);
  }
}

class Display {
  constructor(display, view = null) {
    this.name = display.name;
    this.label = display.label;
    this.box = null;

    if (view) {
      var box = this.box = document.createElement('span');
      box.setAttribute('id', this.name + '-box');

      var label = document.createElement('span');
      label.innerHTML = this.label + ': ';

      view.appendChild(label);
      view.appendChild(box);
      view.appendChild(document.createElement('br'));
    }

    this.set(display.value);
  }

  set(val) {
    this.value = val;

    if (this.box)
      this.box.innerHTML = val;
  }
}

class Command {
  constructor(command, view = null) {
    this.name = command.name;
    this.label = command.label;

    if (view) {
      var button = document.createElement('div');
      button.setAttribute('id', this.name + '-btn');
      button.innerHTML = this.label;

      button.onclick = button.ontouchstart = (() => {
        client.socket.emit('conductor_command', this.name);
      });

      view.appendChild(button);
      view.appendChild(document.createElement('br'));
    }
  }
}

class ClientConductor extends ClientModule {
  constructor(params = {}) {
    super('conductor', params.gui);
    var view = null;

    if (params.gui)
      view = this.displayDiv;

    this.hasGui = params.gui;
    this.controls = {};
    this.displays = {};
    this.commands = {};

    client.socket.on('conductor_init', (controls, displays, commands) => {
      if (view) {
        var title = document.createElement('h1');
        title.innerHTML = 'Conductor';
        view.appendChild(title);
      }

      if (displays) {
        for (let key of Object.keys(displays)) {
          this.displays[key] = new Display(displays[key], view);
        }

        if (view)
          view.appendChild(document.createElement('hr'));
      }

      for (let key of Object.keys(controls)) {
        var control = controls[key];

        switch (control.type) {
          case 'number':
            this.controls[key] = new ControlNumber(control, view);
            break;

          case 'select':
            this.controls[key] = new ControlSelect(control, view);
            break;
        }
      }

      if (commands) {
        if (view)
          view.appendChild(document.createElement('hr'));

        for (let key of Object.keys(commands)) {
          this.commands[key] = new Command(commands[key], view);
        }
      }
    });

    // listen to control changes
    client.socket.on('conductor_control', (name, val) => {
      var control = this.controls[name];

      if (control) {
        control.set(val);
        this.emit('conductor_control', name, val);
      } else
        console.log('received unknown conductor control: ', name);
    });

    // listen to display changes
    client.socket.on('conductor_display', (name, val) => {
      var display = this.displays[name];

      if (display) {
        display.set(val);
        this.emit('conductor_display', name, val);
      } else
        console.log('received unknown conductor display: ', name);
    });
  }

  start() {
    super.start();

    if(!this.hasGui)
      this.done();
  }
}

module.exports = ClientConductor;