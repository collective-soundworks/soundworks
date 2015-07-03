/**
 * @fileoverview Soundworks client side control module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ClientModule = require('./ClientModule');
var client = require('./client');

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
      var box = this.box = document.createElement('input');
      box.setAttribute('id', this.name + '-box');
      box.setAttribute('type', 'number');
      box.setAttribute('min', this.min);
      box.setAttribute('max', this.max);
      box.setAttribute('step', this.step);
      box.setAttribute('size', 16);

      box.onchange = (() => {
        var val = Number(box.value);
        this.set(val);
        this.send();
      });

      var incrButton = document.createElement('button');
      incrButton.setAttribute('id', this.name + '-incr');
      incrButton.setAttribute('width', '0.5em');
      incrButton.innerHTML = '>';
      incrButton.onclick = (() => {
        this.incr();
        this.send();
      });

      var decrButton = document.createElement('button');
      decrButton.setAttribute('id', this.name + '-descr');
      decrButton.style.width = '0.5em';
      decrButton.innerHTML = '<';
      decrButton.onclick = (() => {
        this.decr();
        this.send();
      });

      var label = document.createElement('span');
      label.innerHTML = this.label + ': ';

      var div = document.createElement('div');
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
    var steps = Math.floor(this.value / this.step + 0.5);
    this.set(this.step * (steps + 1));
  }

  decr() {
    var steps = Math.floor(this.value / this.step + 0.5);
    this.set(this.step * (steps - 1));
  }
}

class ControlSelect extends ControlEvent {
  constructor(init, view = null) {
    super('select', init.name, init.label);
    this.options = init.options;
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
        this.set(box.value);
        this.send();
      });

      var incrButton = document.createElement('button');
      incrButton.setAttribute('id', this.name + '-incr');
      incrButton.setAttribute('width', '0.5em');
      incrButton.innerHTML = '>';
      incrButton.onclick = (() => {
        this.incr();
        this.send();
      });

      var decrButton = document.createElement('button');
      decrButton.setAttribute('id', this.name + '-descr');
      decrButton.style.width = '0.5em';
      decrButton.innerHTML = '<';
      decrButton.onclick = (() => {
        this.decr();
        this.send();
      });

      var label = document.createElement('span');
      label.innerHTML = this.label + ': ';

      var div = document.createElement('div');
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
    var index = this.options.indexOf(val);

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
      var box = this.box = document.createElement('span');
      box.setAttribute('id', this.name + '-box');

      var label = document.createElement('span');
      label.innerHTML = this.label + ': ';

      var div = document.createElement('div');
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
      var div = document.createElement('div');
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

class ClientControl extends ClientModule {
  constructor(options = {}) {
    var hasGui = (options.gui === true);

    super(options.name || 'control', hasGui, options.color);

    this.hasGui = hasGui;
    this.events = {};

    var view = hasGui ? this.view : null;

    client.receive('control:init', (events) => {
      if (view) {
        var title = document.createElement('h1');
        title.innerHTML = 'Conductor';
        view.appendChild(title);
      }

      for (let key of Object.keys(events)) {
        var event = events[key];

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
      var event = this.events[name];

      if (event) {
        event.set(val);
        this.emit('control:event', name, val);
      }
      else
        console.log('client control: received unknown event "' + name + '"');
    });
  }

  start() {
    super.start();
    client.send('control:request');
  }

  restart() {
    super.restart();
    client.send('control:request'); 
  }
  
  set(name, val) {
    var event = this.events[name];

    if (event) {
      event.set(val);
      event.send();
    }
  }
}

module.exports = ClientControl;