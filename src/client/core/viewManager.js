import debug from 'debug';

const log = debug('soundworks:viewManager');
const stack = new Set();
const viewPromiseMap = new Map();
let $container = null;

/**
 * Handle activities' (services and scenes) views according to their priorities.
 */
const viewManager = {
  _timeoutId: null,

  /**
   * Sets the container of the views for all `Activity` instances. Is called by
   * {@link src/client/core/client.js~client}) during application bootstrap.
   * @param {Element} $el - The element to use as a container for the view.
   * @private
   */
  setAppContainer($el) {
    $container = $el;
  },

  /**
   * Register a view into the stack of views to display. The fact that the view is
   * actually displayed is defined by its priority and activities lifecycle.
   * @param {View} view - A view to add to the stack.
   */
  register(view) {
    log(`register - id: "${view.options.id}" - priority: ${view.priority}`);

    stack.add(view);
    view.hide();
    view.appendTo($container);

    const promise = new Promise((resolve, reject) => {
      viewPromiseMap.set(view, resolve);
    });
    // trigger `_updateView` only once when several view are registered at once.
    if (!this._timeoutId)
      this._timeoutId = setTimeout(() => this._updateView(), 0);

    return promise;
  },

  /**
   * Remove view from the stack of views to display.
   * @param {View} view - A view to remove from the stack.
   */
  remove(view) {
    log(`remove - id: "${view.options.id}" - priority: ${view.priority}`);

    view.remove();
    // clean dictionnaries
    stack.delete(view);
    viewPromiseMap.delete(view);

    if (!this._timeoutId)
      this._timeoutId = setTimeout(() => this._updateView(), 0);
  },

  /**
   * Defines whether the view should be updated according to defined priorities.
   * @private
   */
  _updateView() {
    let visibleView = null;
    let priority = -Infinity;
    let nextView = null;

    stack.forEach(function(view) {
      if (view.isVisible)
        visibleView = view;

      if (view.priority > priority) {
        priority = view.priority;
        nextView = view;
      }
    });

    log(`update view - next: "${nextView.options.id}" - visible: "${visibleView ? visibleView.options.id : 'Ø'}"`);

    if (nextView) {
      if (visibleView === null) {
        log(`show view - id: "${nextView.options.id}" - priority: ${priority}`);
        nextView.show();
        // resolve the promise created when the view were registered
        viewPromiseMap.get(nextView)();
      } else if (visibleView.priority < nextView.priority) {
        log(`show view - id: "${nextView.options.id}" - priority: ${priority}`);
        visibleView.hide(); // hide but keep in stack
        nextView.show();
        // resolve the promise created when the view were registered
        viewPromiseMap.get(nextView)();
      }
    }

    this._timeoutId = null;
  },
};

export default viewManager;
