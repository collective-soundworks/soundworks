import template from 'lodash.template';
import viewport from './viewport';

/**
 * @todo - write doc
 */
export default class View {
  constructor(tmplStr, model = {}, events = {}, options = {}) {
    this.tmpl = template(tmplStr);
    this.model = model;
    this.events = events;
    this.options = Object.assign({
      el: 'div',
      id: null,
      className: null,
    }, options);

    // create container in memory
    this.$el = document.createElement(this.options.el);
    // listen viewport
    this.onResize = this.onResize.bind(this);
    viewport.on('resize', this.onResize);
  }

  /**
   * @return {DOMElement}
   */
  render() {
    const options = this.options;

    if (options.id) { this.$el.id = options.id; }

    if (options.className) {
      const classes = typeof options.className === 'string' ?
        [options.className] : options.className;

      classes.forEach((className) => { this.$el.classList.add(className); });
    }

    const html = this.tmpl(this.model);
    this.$el.innerHTML = html;

    this.onRender();
    this._delegateEvents();
    return this.$el;
  }

  // entry point when DOM is ready
  onRender() {}

  remove() {
    this._undelegateEvents();
    this.$el.parentNode.removeChild(this.$el);
  }

  onResize(orientation, width, height) {
    this.$el.classList.remove('portrait', 'landscape');
    this.$el.classList.add(orientation);
    this.$el.style.width = `${width}px`;
    this.$el.style.height = `${height}px`;
  }

  _delegateEvents() {
    for (let key in this.events) {
      const [event, selector] = key.split(/ +/);
      const callback = this.events[key];
      const $targets = !selector ? [this.$el] : this.$el.querySelectorAll(selector);

      Array.from($targets).forEach(($target) => {
        // don't add a listener twice, if render is called several times
        $target.removeEventListener(event, callback, false);
        $target.addEventListener(event, callback, false);
      });
    }
  }

  _undelegateEvents() {
    for (let key in this.events) {
      const [event, selector] = key.split(/ +/);
      const callback = this.events[key];
      const $targets = !selector ? [this.$el] : this.$el.querySelectorAll(selector);

      Array.from($targets).forEach(($target) => {
        $target.removeEventListener(event, callback, false);
      });
    }
  }
}