/**
 * Service to track the viewport size and orientation. All views are
 * automatically added as listeners of this helper via their
 * [`View#onResize`]{@link module:soundworks/client.View#onResize}
 *
 * @namespace
 * @memberof module:soundworks/client
 *
 * @see {@link module:soundworks/client.View#onResize}
 */
const viewport = {
  /**
   * Width of the viewport.
   * @type {Number}
   */
  width: null,

  /**
   * Height of the viewport.
   * @type {Number}
   */
  height: null,

  /**
   * Orientation of the viewport (`'portrait'|'landscape').
   * @type {String}
   */
  orientation: null,

  /**
   * List of the callback to trigger when `resize` is triggered by the window.
   * @type {Set}
   * @private
   */
  _callbacks: new Set(),

  /**
   * Initialize the service, is called in `client._initViews`.
   * @private
   */
  init() {
    this._onResize = this._onResize.bind(this);

    this._onResize();
    window.addEventListener('resize', this._onResize, false);
  },

  /**
   * @callback module:soundworks/client.viewport~resizeCallback
   * @param {Number} width - Width of the viewport.
   * @param {Number} height - Height of the viewport.
   * @param {String} orientation - Orientation of the viewport.
   */
  /**
   * Register a listener for the `window.resize` event. The callback is executed
   * with current values when registered.
   * @param {module:soundworks/client.viewport~resizeCallback} callback - Callback to execute.
   */
  addResizeListener(callback) {
    this._callbacks.add(callback);
    // execute immediatly with current values
    callback(this.width, this.height, this.orientation);
  },

  /**
   * Remove a listener for the `window.resize` event.
   * @param {module:soundworks/client.viewport~resizeCallback} callback - Callback to remove.
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
