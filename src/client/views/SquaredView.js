import View from './View';


const defaultTemplate = `
  <div class="section-square flex-middle"></div>
  <div class="section-float flex-middle"></div>
`;

export default class SquaredView extends View {
  constructor(template, content = {}, events = {}, options = {}) {
    template = !template ? defaultTemplate : template;

    super(template, content, events, options);
  }

  onRender() {
    this.$square = this.$el.querySelector('.section-square');
    this.$float = this.$el.querySelector('.section-float');

    this.$square.style.float = 'left';
    this.$float.style.float = 'left';
  }

  onResize(viewportWidth, viewportHeight, orientation) {
    super.onResize(viewportWidth, viewportHeight, orientation);

    let size, floatHeight, floatWidth;

    if (orientation === 'portrait') {
      size = viewportWidth;
      floatHeight = viewportHeight - size;
      floatWidth = viewportWidth;
    } else {
      size = viewportHeight;
      floatHeight = viewportHeight;
      floatWidth = viewportWidth - size;
    }

    this.$square.style.width = `${size}px`;
    this.$square.style.height = `${size}px`;

    this.$float.style.width = `${floatWidth}px`;
    this.$float.style.height = `${floatHeight}px`;
  }
}
