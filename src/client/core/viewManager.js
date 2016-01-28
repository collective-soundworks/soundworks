// handle views according to their priority
// should throttle on start to wait for several module starting at the same time (ex parallel) to define the higher priority.
// should then displayviews according to their priority.

// should only deal with show and hide.

const stack = new Set();
let $container = null;

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
    console.log('==> viewManager:register', view.options.id);
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
    console.log('==> viewManager:remove', view.options.id);
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
      console.log('==> viewManager:nextView', nextView.options.id, priority);
      nextView.show();
    }
  },
};
