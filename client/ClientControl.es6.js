/**
 * @fileoverview Soundworks client side control module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ClientModule = require('./ClientModule');
var client = require('./client');

class ParameterNumber {
  constructor(parameter, view = null) {
    this.type = 'number';
    this.name = parameter.name;
    this.label = parameter.label;
    this.min = parameter.min;
    this.max = parameter.max;
    this.step = parameter.step;
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
        this.set(val, true);
      });

      var incrButton = document.createElement('button');
      incrButton.setAttribute('id', this.name + '-incr');
      incrButton.setAttribute('width', '0.5em');
      incrButton.innerHTML = '>';
      incrButton.onclick = incrButton.ontouchstart = (() => {
        this.incr(true);
      });

      var decrButton = document.createElement('button');
      decrButton.setAttribute('id', this.name + '-descr');
      decrButton.style.width = '0.5em';
      decrButton.innerHTML = '<';
      decrButton.onclick = decrButton.ontouchstart = (() => {
        this.decr(true);
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

    this.set(parameter.value);
  }

  set(val, send = false) {
    this.value = Math.min(this.max, Math.max(this.min, val));

    if (this.box)
      this.box.value = val;

    if (send)
      client.send('control:parameter', this.name, this.value);
  }

  incr(send = false) {
    var steps = Math.floor(this.value / this.step + 0.5);
    this.set(this.step * (steps + 1), send);
  }

  decr(send = false) {
    var steps = Math.floor(this.value / this.step + 0.5);
    this.set(this.step * (steps - 1), send);
  }
}

class ParameterSelect {
  constructor(parameter, view = null) {
    this.type = 'select';
    this.name = parameter.name;
    this.label = parameter.label;
    this.options = parameter.options;
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

      var incrButton = document.createElement('button');
      incrButton.setAttribute('id', this.name + '-incr');
      incrButton.setAttribute('width', '0.5em');
      incrButton.innerHTML = '>';
      incrButton.onclick = incrButton.ontouchstart = (() => {
        this.incr(true);
      });

      var decrButton = document.createElement('button');
      decrButton.setAttribute('id', this.name + '-descr');
      decrButton.style.width = '0.5em';
      decrButton.innerHTML = '<';
      decrButton.onclick = decrButton.ontouchstart = (() => {
        this.decr(true);
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

    this.set(parameter.value);
  }

  set(val, send = false) {
    var index = this.options.indexOf(val);

    if (index >= 0) {
      this.value = val;
      this.index = index;

      if (this.box)
        this.box.value = val;

      if (send)
        client.send('control:parameter', this.name, val);
    }
  }

  incr(send = false) {
    this.index = (this.index + 1) % this.options.length;
    this.set(this.options[this.index], send);
  }

  decr(send = false) {
    this.index = (this.index + this.options.length - 1) % this.options.length;
    this.set(this.options[this.index], send);
  }
}

class Info {
  constructor(info, view = null) {
    this.name = info.name;
    this.label = info.label;
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

    this.set(info.value);
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
      var div = document.createElement('div');
      div.setAttribute('id', this.name + '-btn');
      div.classList.add('command');
      div.innerHTML = this.label;

      div.onclick = div.ontouchstart = (() => {
        client.send('control:command', this.name);
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
    this.parameters = {};
    this.infos = {};
    this.commands = {};

    var view = hasGui ? this.view : null;

    client.receive('control:init', (parameters, infos, commands) => {
      if (view) {
        var title = document.createElement('h1');
        title.innerHTML = 'Conductor';
        view.appendChild(title);
      }

      for (let key of Object.keys(infos))
        this.infos[key] = new Info(infos[key], view);

      if (view)
        view.appendChild(document.createElement('hr'));

      for (let key of Object.keys(parameters)) {
        var parameter = parameters[key];

        switch (parameter.type) {
          case 'number':
            this.parameters[key] = new ParameterNumber(parameter, view);
            break;

          case 'select':
            this.parameters[key] = new ParameterSelect(parameter, view);
            break;
        }
      }

      if (view)
        view.appendChild(document.createElement('hr'));

      for (let key of Object.keys(commands))
        this.commands[key] = new Command(commands[key], view);

      if (!view)
        this.done();
    });

    // listen to parameter changes
    client.receive('control:parameter', (name, val) => {
      var parameter = this.parameters[name];

      if (parameter) {
        parameter.set(val);
        this.emit('control:parameter', name, val);
      } else
        console.log('received unknown control parameter: ', name);
    });

    // listen to info changes
    client.receive('control:info', (name, val) => {
      var info = this.infos[name];

      if (info) {
        info.set(val);
        this.emit('control:info', name, val);
      } else
        console.log('received unknown info parameter: ', name);
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
  
}

module.exports = ClientControl;