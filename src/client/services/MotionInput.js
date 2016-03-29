import motionInput from 'motion-input';
import Service from '../core/Service';
import serviceManager from '../core/serviceManager';

const SERVICE_ID = 'service:motion-input';


/**
 * Interface of the client `'motion-input'` service.
 *
 * This service provides a wrapper for the
 * [`motionInput`]{@link https://github.com/collective-soundworks/motion-input}
 * external module.
 *
 * @memberof module:soundworks/client
 * @example
 * // in the experince constructor
 * this.motionInput = this.require('motioninput', { descriptors: ['energy'] });
 * // when the experience has started
 * if (this.motionInput.isAvailable('energy')) {
 *   this.motionInput.addListener('energy', (data) => {
 *     // digest motion data
 *   });
 * } else {
 *   // handle error
 * }
 */
class MotionInput extends Service {
  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  constructor() {
    super(SERVICE_ID, false);

    const defaults = {
      descriptors: [],
      // @todo - how to handle if only some descriptors are invalid ?
      // showError: false,
    };

    this.configure(defaults);
    // @todo - should be handled directly inside the motionInput
    this._descriptorsValidity = {}
  }

  /**
   * Override default configure to add descriptors from multiple calls.
   * @private
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

        this.ready();
      });
  }

  /** @private */
  stop() {
    super.stop();
  }

  /**
   * Define if a given descriptor is available or not
   * @param {String} name - Descriptor name.
   * @returns {Boolean} - Returns `true` if available, `false` otherwise.
   */
  isAvailable(name) {
    return this._descriptorsValidity[name];
  }

  /**
   * Add a listener to a given descriptor.
   * @param {String} name - Descriptor name.
   * @param {Function} callback - Callback to register.
   */
  addListener(name, callback) {
    if (this._descriptorsValidity[name])
      motionInput.addListener(name, callback);
  }

  /**
   * Remove a listener from a given descriptor.
   * @param {String} name - Descriptor name.
   * @param {Function} callback - Callback to remove.
   */
  removeListener(name, callback) {
    if (this._descriptorsValidity[name])
      motionInput.removeListener(name, callback);
  }
}

serviceManager.register(SERVICE_ID, MotionInput);

export default MotionInput;
