import Scene from '../core/Scene';
import Signal from '../core/Signal';
import SignalAll from '../core/SignalAll';
import client from '../core/client';

/**
 * Base class to be extended in order to create the client-side of a custom
 * experience.
 *
 * The user defined `Experience` is the main component of a soundworks application.
 *
 * @memberof module:soundworks/client
 * @extends module:soundworks/client.Scene
 */
class Experience extends Scene {
  /**
   * @param {Boolean} [hasNetwork=true] - Define if the experience needs a
   *  socket connection or not.
   */
  constructor(hasNetwork = true) {
    super('experience', hasNetwork);
    // if the experience has network, require errorReporter service by default
    if (hasNetwork)
      this._errorReporter = this.require('error-reporter');
  }

  /**
   * Interface method to implement in each experience. This method is part of the
   * experience lifecycle and should be called when
   * [`Experience#start`]{@link module:soundworks/client.Experience#start}
   * is called for the first time.
   *
   * @example
   * // in MyExperience#start
   * if (this.hasStarted)
   *   this.init();
   */
  init() {}

  createView() {
    if (this.viewOptions) {
      if (Array.isArray(this.viewOptions.className))
        this.viewOptions.clientType.push(client.type);
      else if (typeof this.viewOptions.className === 'string')
        this.viewOptions.className = [this.viewOptions.className, client.type];
      else
        this.viewOptions.className = client.type;
    }

    return super.createView();
  }

  /**
   * Start the experience. This lifecycle method is called when all the
   * required services are `ready` and thus the experience can begin with all
   * the necessary informations and services ready to be consumed.
   */
  start() {
    super.start();

    if (this.hasNetwork)
      this.send('enter');
  }

  /** @private */
  done() {
    if (this.hasNetwork)
      this.send('exit');

    super.done();
  }
}

export default Experience;
