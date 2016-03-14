import View from './View';

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function convertName(name) {
  var a = name.split('_');
  var n = '';
  for (var i = 0; i < a.length; i++) {
    if (i === 0)
      n += toTitleCase(a[i]);
    else
      n += ' ' + a[i];
  }
  return n;
}

const defaultTemplate = `
  <% definitions.forEach((def, index) => { %>
    <button class="btn <%= def.state %>"
            data-index="<%= index %>"
            <%= def.state === 'disabled' ? 'disabled' : '' %>
    >
      <%= convertName(def.label) %>
    </button>
  <% }); %>
`;


/**
 * View to display a list of buttons.
 */
export default class ButtonView extends View {
  /**
   * @param {Array<Object>} definitions - An array of definitions for the buttons. Each definitions should contain a `label` and an optionnal `state` entry (valid values for `states` are `'selected'`, `'unselected'` or `'disabled'`).
   * @param {Function} onSelect - The callback to execute when a button is selected.
   * @param {Function} onUnselect - The callback to execute when a button is unselected.
   * @param {Object} options
   * @param {Object} [options.maxSelected=1] - The maximum possible selected buttons.
   * @param {Object} [options.defaultState='unselected'] - The state to apply when not defined in the buttons definitions.
   */
  constructor(definitions, onSelect, onUnselect, options) {
    const template = options.template || defaultTemplate;
    super(template, { definitions, convertName }, {}, { className: 'buttons' });

    this._definitions = definitions;
    this._maxSelected = options.maxSelected || 1;
    this._selected = [];

    this.onSelect = onSelect;
    this.onUnselect = onUnselect;

    const defaultState = options.defaultState || 'unselected';
    // populate `this._selected`
    this._definitions.forEach((def, index) => {
      if (def.state === undefined) { def.state === defaultState; }
      if (def.state === 'selected') { this._selected.push(index); }
    });

    this.toggle = this.toggle.bind(this);
    this.events = { 'click .btn': this.toggle }
  }

  onRender() {
    this.$el.style.width = '100%';
    this.$el.style.height = '100%';
  }

  /**
   * Sets a definition and its related button to `selected`.
   * @param {Number} index - Index of the definitions in the list of definitions.
   * @param {Element} $btn - The DOM element related to this definition.
   */
  _select(index, $btn) {
    const def = this._definitions[index];
    $btn.classList.remove('unselected', 'disabled');
    $btn.classList.add('selected');
    def.state = 'selected';

    this._selected.push(index);
    this.onSelect(index, def);
  }

  /**
   * Sets a definition and its related button to `unselected`.
   * @param {Number} index - Index of the definitions in the list of definitions.
   * @param {Element} $btn - The DOM element related to this definition.
   */
  _unselect(index, $btn) {
    const def = this._definitions[index];
    $btn.classList.remove('selected', 'disabled');
    $btn.classList.add('unselected');
    def.state = 'unselected';

    const selectedIndex = this._selected.indexOf(index);

    if (selectedIndex !== -1) {
      this._selected.splice(selectedIndex, 1);
      this.onUnselect(index, def);
    }
  }

  /**
   * Toggle the state of a definitions and its related button.
   * @param {Event} e - The event triggered by the user action (`click`).
   */
  toggle(e) {
    const $target = e.target;
    const index = parseInt($target.getAttribute('data-index'));
    const def = this._definitions[index];
    const currentState = def.state;
    const executeMethod = currentState === 'selected' ? '_unselect' : '_select';

    if (this._selected.length >= this._maxSelected && executeMethod === 'select') {
      return;
    }

    this[executeMethod](index, $target);
  }

  /**
   * Unable the interaction with a definition and its related button.
   * @param {Number} index - Index of the definitions in the list of definitions.
   */
  enable(index) {
    // set state 'unselected'
    const $target = this.$el.querySelector(`[data-index="${index}"]`);
    this._unselect(index, $target);

    $target.removeAttribute('disabled');
  }

  /**
   * Disable the interaction with a definition and its related button.
   * @param {Number} index - Index of the definitions in the list of definitions.
   */
  disable(index) {
    const $target = this.$el.querySelector(`[data-index="${index}"]`);
    this._unselect(index, $target);

    $target.classList.remove('unselected');
    $target.classList.add('disabled');
    $target.setAttribute('disabled', true);
  }
}
