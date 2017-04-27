import View from '../views/View';

const defaultTemplate = `
  <div class="section-square flex-middle"></div>
  <div class="section-float flex-middle"></div>
`;

/**
 * A view that define a squared zone of maximum size on the top of the screen
 * in `portrait` orientation or on the left of the screen in 'landscape'
 * orientation.
 *
 * @param {String} template - Template of the view.
 * @param {Object} content - Object containing the variables used to populate
 *  the template. {@link module:soundworks/client.View#content}.
 * @param {Object} events - Listeners to install in the view
 *  {@link module:soundworks/client.View#events}.
 * @param {Object} options - Options of the view.
 *  {@link module:soundworks/client.View#options}.
 *
 * @memberof soundworks/client
 */
class SquaredView extends View {
  constructor(template, content = {}, events = {}, options = {}) {
    template = !template ? defaultTemplate : template;

    super(template, content, events, options);
  }

  /** @private */
  onRender() {
    this.$square = this.$el.querySelector('.section-square');
    this.$float = this.$el.querySelector('.section-float');

    this.$square.style.float = 'left';
    this.$float.style.float = 'left';
  }

  /** @private */
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

export default SquaredView;
