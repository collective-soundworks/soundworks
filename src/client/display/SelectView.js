import View from './View';

const defaultTemplate = `
  <option class="small"><%= instructions %></option>
  <% entries.forEach((entry) => { %>
    <option value="<%= entry.index %>">
      <%= entry.label %>
    </option>
  <% }) %>
`;

export default class SelectView extends View {
  constructor(content, events = {}, options = {}) {
    options = Object.assign({ el: 'select', className: 'select' }, options);
    super(defaultTemplate, content, events, options);

    this.entries = content.entries;
  }

  onResize() {}

  get value() {
    const index = parseInt(this.$el.value);
    const entry = this.entries.find(entry => entry.index === index);
    return entry || null;
  }
}
