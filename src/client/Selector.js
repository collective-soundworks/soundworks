import client from './client';
import Module from './Module';


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

/**
 * The {@link ClientSelector} module allows to select one or several options among a list.
 */
export default class Selector extends Module {
  /**
   * Creates an instance of the class.
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='selector'] Name of the module.
   * @param {DOMElement} [options.view] The view in which to display the list.
   * @param {String} [options.color='black'] Background color of the `view`.
   * @param {String[]} [options.labels=[]] Labels of the list options.
   * @param {String[]} [options.states=[]] States of each list option. Authorized values are:
   * - '`disabled`': the option is disabled (unselectable)
   * - '`unselected`': the option is unselected.
   * - `'selected'`: the options is selected.
   * @param {String} [options.defaultState='unselected'] Default state of the list options. Authorized values are:
   * - '`disabled`': the option is disabled (unselectable)
   * - '`unselected`': the option is unselected.
   * - `'selected'`: the options is selected.
   */
  constructor(options = {}) {
    super(options.name || 'selector', !options.view, options.color || 'black');

    /**
     * Labels of the options.
     * @type {String[]}
     */
    this.labels = options.labels || [];

    /**
     * Current states of the options.
     * @type {String[]}
     */
    this.states = options.states || [];

    /**
     * Maximum number of simultaneously selected options.
     * @type {Number}
     */
    this.maxSelected = 1;

    /**
     * Currently selected options.
     * @type {String[]}
     */
    this.selected = [];

    if (typeof options.maxSelected !== 'undefined')
      this.maxSelected = options.maxSelected;

    if(options.view) {
      /**
       * View of the parent module
       * @type {DOMElement}
       */
      this.view = options.view;

      /**
       * @private
       */
      this.isDone = undefined; // skip super.done()
    }

    this._defaultState = options.defaultState || 'unselected';
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

  /**
   * Starts the module.
   * @private
   */
  start() {
    super.start();

    for (let i = 0; i < this._labels.length; i++) {
      let label = this._labels[i];
      let state = this._defaultState;

      if (i < this.states.length)
        state = this.states[i];

      this.states[i] = 'disabled';
      this._listeners[i] = null;
      this._setupButton(i, label, state);
    }
  }

  /**
   * Resets the module.
   * @private
   */
  reset() {
    let buttons = this.view.querySelectorAll('.btn');
    for (let i = 0; i < buttons.length; i++)
      this.view.removeChild(buttons[i]);

    this.selected = [];
    this._buttons = [];
    this._listeners = [];
  }

  /**
   * Restarts the module.
   * @private
   */
  restart() {
    // TODO
  }

  /**
   * Selects an option.
   * @param {Number} index The option index to select.
   * @emits {'selector:select', index:Number, label:String} The index and label of the selected option.
   * @return {Boolean} Indicates whether the option was successfully selected or not.
   */
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

  /**
   * Unselects an option.
   * @param {Number} index The option index to unselect.
   * @emits {'selector:unselect', index:Number, label:String} The index and label of the unselected option.
   * @return {Boolean} Indicates whether the option was successfully unselected or not.
   */
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

  /**
   * Toggles an option.
   * @param {Number} index The index of the option to toggle.
   * @return {Boolean} Indicates whether the option was successfully toggled or not.
   */
  toggle(index) {
    return this.select(index) || this.unselect(index);
  }

  /**
   * Enables an option (and sets it to `'unselected'`).
   * @param {Number} index The option index to enable.
   */
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

  /**
   * Disables an option (and unselects it before if needed).
   * @param {Number} index The option index to disable.
   */
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

  /**
   * Sets the labels of the options.
   * @param {String[]} list The list of options.
   */
  set labels(list) {
    this._labels = list;
  }

  /**
   * Gets the labels of the options.
   * @type {String[]}
   */
  get labels() {
    return this._labels;
  }
}
