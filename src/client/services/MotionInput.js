import motionInput from 'motion-input';
import Service from '../core/Service';
import serviceManager from '../core/serviceManager';

const SERVICE_ID = 'service:motion-input';


/**
 * Wrapper for the motion-input module.
 *
 * @example
 * // in the experince constructor
 * this.motionInput = this.require(‘motioninput', {
 *   descriptors: [‘accelerationIncludingGravity']
 * });
 *
 * // in the experience start
 * if (this.motionInput.isAvailable(‘accelerationIncludingGravity')) {
 *   this.motionInput.addListener('accelerationIncludingGravity', (data) => {
 *     // digest motion data
 *   });
 * } else {
 *   // handle error
 * }
 */
class MotionInput extends Service {
  constructor() {
    super(SERVICE_ID, false);

    const defaults = {
      descriptors: [],
      // @todo - how to handle if only descriptors are invalid ?
      // showError: false,
    };

    this.configure(defaults);
    // @todo - should be handled directly inside the motionInput
    this._descriptorsValidity = {}
  }

  // init() { /* nothing to do here... */ }

  /**
   * Override default configure to add descriptors from multiple calls.
   * @param {Object} options - The options to apply to the service.
   */
  configure(options) {
    if (this.options.descriptors)
      options.descriptors = this.options.descriptors.concat(options.descriptors);

    super.configure(options);
  }

  /** @private */
  start() {
    super.start();

    motionInput
      .init(...this.options.descriptors)
      .then((modules) => {
        this.options.descriptors.forEach((name, index) => {
          this._descriptorsValidity[name] = modules[index].isValid;
        });

        // @tbd - maybe handle errors here...
        this.ready();
      });
  }

  /** @private */
  stop() {
    super.stop();
  }

  /**
   * Define if a given descriptor is available or not
   * @param {String} name - The descriptor name.
   * @returns {Boolean}
   */
  isAvailable(name) {
    return this._descriptorsValidity[name];
  }

  /**
   * Add a listener to a given descriptor.
   * @param {String} name - The descriptor name.
   * @param {Function} callback - The callback to register.
   */
  addListener(name, callback) {
    if (this._descriptorsValidity[name])
      motionInput.addListener(name, callback);
  }

  /**
   * Remove a listener from a given descriptor.
   * @param {String} name - The descriptor name.
   * @param {Function} callback - The callback to remove.
   */
  removeListener(name, callback) {
    if (this._descriptorsValidity[name])
      motionInput.removeListener(name, callback);
  }
}

serviceManager.register(SERVICE_ID, MotionInput);

export default MotionInput;
