/**
 * Track the viewport size and orientation.
 * All views add their {@link module:soundworks/client.View#onResize} method as
 * listener of this helper.
 *
 * @namespace
 * @memberof module:soundworks/client
 *
 * @see {@link module:soundworks/client.View#onResize}
 */
const viewport = {
  /**
   * Width of the viewport.
   *
   * @type {Number}
   */
  width: null,

  /**
   * Height of the viewport.
   *
   * @type {Number}
   */
  height: null,

  /**
   * Orientation of the viewport (`'portrait'|'landscape'`).
   *
   * @type {String}
   */
  orientation: null,

  /**
   * List of callbacks to execute on each `resize` event.
   *
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

  /** @private */
  _onResize() {
    this.width = document.documentElement.clientWidth || window.innerWidth;
    this.height = document.documentElement.clientHeight || window.innerHeight;
    this.orientation = this.width > this.height ? 'landscape' : 'portrait';

    this._callbacks.forEach((callback) => {
      callback(this.width, this.height, this.orientation);
    });
  },

  /**
   * Callback to execute on a `resize` event.
   *
   * @callback module:soundworks/client.viewport~resizeCallback
   * @param {Number} width - Width of the viewport.
   * @param {Number} height - Height of the viewport.
   * @param {String} orientation - Orientation of the viewport.
   */

  /**
   * Add a listener to the `resize` event. The callback is immediately
   * invoked with the current `width`, `height` and `orientation` values.
   *
   * @param {module:soundworks/client.viewport~resizeCallback} callback -
   *  Callback to add to listeners.
   */
  addResizeListener(callback) {
    this._callbacks.add(callback);
    // execute immediatly with current values
    callback(this.width, this.height, this.orientation);
  },

  /**
   * Remove a listener from the `resize` event.
   *
   * @param {module:soundworks/client.viewport~resizeCallback} callback -
   *  Callback to remove from listeners.
   */
  removeResizeListener(callback) {
    this._callbacks.delete(callback);
  },
};

export default viewport;
