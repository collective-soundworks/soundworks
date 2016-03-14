/**
 * Service to track the viewport size and orientation.
 */
const viewport = {
  /**
   * Initialize the service, is called in `client._initViews`.
   * @private
   */
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

    this._onResize();
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

  /** @private */
  _onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.orientation = this.width > this.height ? 'landscape' : 'portrait';

    this._callbacks.forEach((callback) => {
      callback(this.width, this.height, this.orientation);
    });
  },
};

export default viewport;
