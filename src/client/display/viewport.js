import { EventEmitter } from 'events';

/**
 * Service to track the viewport size and orientation.
 */
class Viewport extends EventEmitter {
  constructor() {
    super();

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

    this._onResize = this._onResize.bind(this);
    window.addEventListener('resize', this._onResize, false);
    //
    this._onResize();

    this.cb;
  }

  /**
   * Middleware for the `EventEmitter` method which applies the callback with the current values.
   * @private
   */
  addListener(channel, callback) {
    super.removeListener(channel, callback);
    super.addListener(channel, callback);
    callback(this.orientation, this.width, this.height);
  }

  on(channel, callback) {
    this.addListener(channel, callback);
  }

  _onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.orientation = this.width > this.height ? 'landscape' : 'portrait';

    this.emit('resize', this.orientation, this.width, this.height);
  }
};

/**
 * Singleton for the whole application to be used as a service.
 * @type {Viewport}
 */
const viewport = new Viewport();
export default viewport;
