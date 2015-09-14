'use strict';

var client = require('./client');
var ClientModule = require('./ClientModule');

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function convertName(name) {
  var a = name.split("_");
  var n = "";
  for (var i = 0; i < a.length; i++) {
    if (i === 0)
      n += toTitleCase(a[i]);
    else
      n += " " + a[i];
  }
  return n;
}

class ClientSelector extends ClientModule {
  constructor(options = {}) {
    super(options.name || 'selector', !options.view);

    this.labels = options.labels || [];
    this.states = options.states || [];
    this.defaultState = options.defaultState || 'unselected';

    this.maxSelected = 1;
    this.selected = [];

    if (typeof options.maxSelected !== 'undefined')
      this.maxSelected = options.maxSelected;

    if(options.view) {
      this.view = options.view;
      this.isDone = undefined; // skip super.done()
    }

    this._buttons = [];
    this._listeners = [];
  }

  _setupButton(index, label, state) {
    let button = document.createElement('div');
    button.classList.add('btn');
    button.innerHTML = convertName(label);
    this._buttons[index] = button;

    switch (state) {
      case 'disabled':
        button.classList.add('disabled');
        break;

      case 'unselected':
        this.enable(index);
        break;

      case 'selected':
        this.enable(index);
        this.select(index);
        break;
    }

    this.view.appendChild(button);
  }

  start() {
    super.start();

    for (let i = 0; i < this._labels.length; i++) {
      let label = this._labels[i];
      let state = this.defaultState;

      if (i < this.states.length)
        state = this.states[i];

      this.states[i] = 'disabled';
      this._listeners[i] = null;
      this._setupButton(i, label, state);
    }
  }

  reset() {
    let buttons = this.view.querySelectorAll('.btn');
    for (let i = 0; i < buttons.length; i++)
      this.view.removeChild(buttons[i]);
     
    this.selected = [];
    this._buttons = [];
    this._listeners = []; 
  }

  restart() {
    // TODO
  }

  select(index) {
    let state = this.states[index];

    if (state === 'unselected') {
      // steal oldest selected
      if (this.selected.length === this.maxSelected)
        this.unselect(this.selected[0]);

      let button = this._buttons[index];

      button.classList.add('selected');
      this.states[index] = 'selected';

      // add to list of selected buttons
      this.selected.push(index);

      let label = this.labels[index];
      this.emit('selector:select', index, label);

      if (this.selected.length === this.maxSelected)
        this.done(); // TODO: beware, might cause problems with the launch thing

      return true;
    }

    return false;
  }

  unselect(index) {
    let state = this.states[index];

    if (state === 'selected') {
      let button = this._buttons[index];

      button.classList.remove('selected');
      this.states[index] = 'unselected';

      // unselect oldest selected button
      let selectedIndex = this.selected.indexOf(index);
      this.selected.splice(selectedIndex, 1);

      let label = this.labels[index];
      this.emit('selector:unselect', index, label);

      return false;
    }

    return true;
  }

  toggle(index) {
    return this.select(index) || this.unselect(index);
  }

  enable(index) {
    let state = this.states[index];

    if (state === 'disabled') {
      this.states[index] = 'unselected';

      let listener = (() => this.toggle(index));
      this._listeners[index] = listener;

      let button = this._buttons[index];
      button.classList.remove('disabled');
      if (client.platform.isMobile)
        button.addEventListener('touchstart', listener, false);  
      else
        button.addEventListener('click', listener, false);
    }
  }

  disable(index) {
    let state = this.states[index];

    if (state === 'selected')
      this.unselect(index);

    if (state === 'unselected') {
      this.states[index] = 'disabled';

      let button = this._buttons[index];
      let listener = this._listeners[index];
      button.classList.add('disabled');
      if (client.platform.isMobile)
        button.removeListener('touchstart', listener);
      else
        button.removeListener('click', listener);
    }
  }

  set labels(list) {
    this._labels = list;
  }

  get labels() {
    return this._labels;
  }
}

module.exports = ClientSelector;