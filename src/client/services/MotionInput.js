import motionInput from 'motion-input';
import Service from '../core/Service';
import serviceManager from '../core/serviceManager';

const SERVICE_ID = 'service:motion-input';

/*
... dans le constructor (ou la méthode init ?) :
  this.motionInput = this.require(‘motioninput', { descriptors: [‘accelerationIncludingGravity'] });

… dans le start/enter de l'experience:
  if (motionInput.isValid(‘accelerationIncludingGravity')) {
    motionInput.addListener('accelerationIncludingGravity', (data) => {
      // digest motion data
    });
  } else {
    // handle error
  }
*/

class MotionInput extends Service {
  constructor() {
    super(SERVICE_ID, false);

    const defaults = {
      descriptors: [],
      // showError: false, // @todo - how to handle if several descriptors are asked but only some passed ? showAnyError / showAllError
    };

    this.configure(defaults);
    // @todo - handle directly inside the motionInput
    this._descriptorsValidity = {}
  }

  // init() { /* nothing to do here... */ }

  configure(options) {
    if (this.options.descriptors)
      options.descriptors = this.options.descriptors.concat(options.descriptors);

    super.configure(options);
  }

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

  stop() {
    super.stop();
  }

  isValid(name) {
    return this._descriptorsValidity[name];
  }

  addListener(name, callback) {
    if (this._descriptorsValidity[name])
      motionInput.addListener(name, callback);
  }

  removeListener(name, callback) {
    if (this._descriptorsValidity[name])
      motionInput.removeListener(name, callback);
  }
}

serviceManager.register(SERVICE_ID, MotionInput);

export default MotionInput;
