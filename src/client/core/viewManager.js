import debug from 'debug';

const log = debug('soundworks:viewManager');
const _stack = new Set();
let _$container = null;

/**
 * Handle activities' (services and scenes) views according to their priorities.
 */
const viewManager = {
  _timeoutId: null,

  /**
   * Register a view into the stack of views to display. The fact that the view is
   * actually displayed is defined by its priority and activities lifecycle.
   * @param {View} view - A view to add to the stack.
   */
  register(view) {
    log(`register - id: "${view.options.id}" - priority: ${view.priority}`);

    _stack.add(view);
    view.hide();
    view.appendTo(_$container);

    // trigger `_updateView` only once when several view are registered at once.
    if (!this._timeoutId)
      this.timeoutId = setTimeout(() => { this._updateView(); }, 0);
  },

  /**
   * Remove view from the stack of views to display.
   * @param {View} view - A view to remove from the stack.
   */
  remove(view) {
    log(`remove - id: "${view.options.id}" - priority: ${view.priority}`);

    view.remove();
    _stack.delete(view);

    setTimeout(() => { this._updateView(); }, 0);
  },

  /**
   * Sets the container of the views for all `Activity` instances. Is called by
   * {@link src/client/core/client.js~client}) during application bootstrap.
   * @param {Element} $el - The element to use as a container for the view.
   * @private
   */
  setViewContainer($el) {
    _$container = $el;
  },

  /**
   * Defines if the view should be updated according to defined priorities.
   * @private
   */
  _updateView() {
    let visibleView;
    let priority = -Infinity;
    let nextView = null;

    _stack.forEach(function(view) {
      if (view.isVisible)
        visibleView = true;

      if (view.priority > priority) {
        priority = view.priority;
        nextView = view;
      }
    });

    if (nextView) {
      if (!visibleView) {
        log(`update view - id: "${nextView.options.id}" - priority: ${priority}`);

        nextView.show();
      } else if (visibleView.priority < nextView.priority) {
        log(`update view - id: "${nextView.options.id}" - priority: ${priority}`);

        visibleView.hide(); // hide but keep in stack
        nextView.show();
      }
    }

    this.timeoutId = null;
  },
};

export default viewManager;
