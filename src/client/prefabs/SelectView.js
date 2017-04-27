import View from '../views/View';

const defaultTemplate = `
  <option class="small"><%= instructions %></option>
  <% entries.forEach(function(entry) { %>
    <option value="<%= entry.index %>"><%= entry.label %></option>
  <% }); %>
`;


/**
 * View with a drop down list.
 *
 * @memberof module:soundworks/client
 *
 * @todo - Review API, non standard
 */
class SelectView extends View {
  constructor(content, events = {}, options = {}) {
    options = Object.assign({ el: 'select', className: 'select' }, options);
    super(defaultTemplate, content, events, options);

    this.entries = content.entries;
  }

  /**
   * why noop ?
   * @private
   */
  onResize() {}

  /**
   * Return the entry corresponding to the selected item.
   */
  get value() {
    const index = parseInt(this.$el.value);
    const entry = this.entries.find(entry => entry.index === index);
    return entry || null;
  }

  /**
   * Enable selection of a specific item.
   *
   * @param {Number} index - Index of the entry.
   */
  enableIndex(index) {
    const $option = this.$el.querySelector(`option[value="${index}"]`);
    if ($option)
      $option.removeAttribute('disabled');
  }

  /**
   * Disable selection of a specific item.
   *
   * @param {Number} index - Index of the entry.
   */
  disableIndex(index) {
    const $option = this.$el.querySelector(`option[value="${index}"]`);
    if ($option)
      $option.setAttribute('disabled', 'disabled');
  }
}

export default SelectView;
