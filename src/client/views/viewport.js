/**
 * Service to track the viewport size and orientation.
 */
const viewport = {
  init() {
    /**
     * Width of the viewport.
     * @type {Number}
     */
    this.width = null;

    /**
     * Height of the viewport.
     * @type {Number}
     */
    this.height = null;

    /**
     * Orientation of the viewport ('portrait'|'landscape').
     * @type {String}
     */
    this.orientation = null;

    /**
     * List of the callback to trigger when `resize` is triggered by the window.
     */
    this._callbacks = new Set();

    // initialize service
    this._onResize = this._onResize.bind(this);
    // listen window events (is `DOMContentLoaded` usefull?)
    window.addEventListener('DOMContentLoaded', () => this._onResize());
    window.addEventListener('resize', this._onResize, false);
  },

  /**
   * Register a listener for the `window.resize` event. The callback is executed
   * with current values when registered.
   * @param {Function} callback - The callback to execute.
   */
  addResizeListener(callback) {
    this._callbacks.add(callback);
    // call immediatly with current values
    callback(this.width, this.height, this.orientation);
  },

  /**
   * Remove a listener for the `window.resize` event.
   * @param {Function} callback - The callback to remove.
   */
  removeResizeListener(callback) {
    this._callbacks.delete(callback);
  },

  _onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.orientation = this.width > this.height ? 'landscape' : 'portrait';

    this._callbacks.forEach((callback) => {
      callback(this.width, this.height, this.orientation);
    });
  },
};

/**
 * Singleton for the whole application to be used as a service.
 * @type {Viewport}
 */
viewport.init();

export default viewport;
