import debug from 'debug';

const log = debug('soundworks:viewManager');
const stack = new Set();
let $container = null;

/**
 * Handle services' views according to their priorities.
 */
export default {
  /**
   * Sets the container of the views for all `Activity` instances.
   * @param {Element} $el - The element to use as a container for the module's view.
   */
  setViewContainer($el) {
    $container = $el;
  },

  /**
   * Register a view into the stack of views to display.
   */
  register(view) {
    log(`register - id: "${view.options.id}" - priority: ${view.priority}`);
    // add to the stack
    stack.add(view);

    view.hide();
    view.appendTo($container);

    setTimeout(() => { this._showNext(); }, 0);
  },

  /**
   * Remove view from the stack of views to display.
   */
  remove(view) {
    log(`remove - id: "${view.options.id}" - priority: ${view.priority}`);
    view.remove();
    stack.delete(view);

    setTimeout(() => { this._showNext(); }, 0);
  },

  /**
   * Show the view with the.
   */
  _showNext() {
    let hasVisibleView;
    let priority = -Infinity;
    let nextView = null;

    stack.forEach(function(view) {
      if (view.isVisible)
        hasVisibleView = true;

      if (view.priority > priority) {
        priority = view.priority;
        nextView = view;
      }
    });


    if (nextView && !hasVisibleView) {
      log(`nextView - id: "${nextView.options.id}" - priority: ${priority}`);
      nextView.show();
    }
  },
};
