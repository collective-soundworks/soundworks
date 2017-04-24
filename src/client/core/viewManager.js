import debug from 'debug';

const log = debug('soundworks:viewManager');
const viewInfosMap = new Map();

let $container = null;

/**
 * Handle activities' (services and scenes) views according to their priorities.
 */
const viewManager = {
  _timeoutId: null,

  _visibleView: null,

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
  register(view, priority) {
    log(`register - id: "${view.options.id}" - priority: ${priority}`);

    const infos = {};
    infos.html = view.render();
    infos.priority = priority;
    const promise = new Promise((resolve, reject) => infos.promise = resolve);

    viewInfosMap.set(view, infos);

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
    log(`remove - id: "${view.options.id}"`);

    // clean dictionnary
    viewInfosMap.delete(view);

    if (this._visibleView === view) {
      this._visibleView.remove();
      this._visibleView = null;
    }

    if (!this._timeoutId)
      this._timeoutId = setTimeout(() => this._updateView(), 0);
  },

  /**
   * Defines whether the view should be updated according to defined priorities.
   * @private
   */
  _updateView() {
    const visibleView = this._visibleView;
    let nextViewPriority = -Infinity;
    let nextView = null;

    viewInfosMap.forEach((infos, view) => {
      if (infos.priority > nextViewPriority) {
        nextViewPriority = infos.priority;
        nextView = view;
      }
    });

    log(`update view - next: "${nextView.options.id}" - visible: "${visibleView ? visibleView.options.id : 'Ø'}"`);

    if (nextView) {
      if (visibleView === null) {
        const html = viewInfosMap.get(nextView).html;
        $container.appendChild(html);
        // resolve the promise created when the view were registered
        viewInfosMap.get(nextView).promise();
        this._visibleView = nextView;
      } else {
        const visibleViewPriority = viewInfosMap.get(this._visibleView).priority;

        if (visibleViewPriority < nextViewPriority) {
          visibleView.remove(); // hide but keep in stack

          const html = viewInfosMap.get(nextView).html;
          $container.appendChild(html);

          viewInfosMap.get(nextView).promise();
          this._visibleView = nextView;
        }
      }
    }

    this._timeoutId = null;
  },
};

export default viewManager;
