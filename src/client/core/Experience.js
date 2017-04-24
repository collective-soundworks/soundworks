import Activity from './Activity';
import serviceManager from './serviceManager';


/**
 * Base class to be extended in order to create the client-side of a custom
 * experience.
 *
 * The user defined `Experience` is the main component of a soundworks application.
 *
 * @memberof module:soundworks/client
 * @extends module:soundworks/client.Activity
 */
class Experience extends Activity {
  /**
   * @param {Boolean} [hasNetwork=true] - Define if the experience requires a
   *  socket connection.
   */
  constructor(hasNetwork = true) {
    super('experience', hasNetwork);

    this.start = this.start.bind(this);

    this.requiredSignals.addObserver(this.start);
    this.waitFor(serviceManager.signals.ready);

    // if the experience has network, require errorReporter service by default
    if (hasNetwork)
      this._errorReporter = this.require('error-reporter');
  }

  /**
   * Returns a service configured with the given options.
   * @param {String} id - The identifier of the service.
   * @param {Object} options - The options to configure the service.
   */
  require(id, options) {
    return serviceManager.require(id, options);
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
  // done() {
  //   if (this.hasNetwork)
  //     this.send('exit');

  //   super.done();
  // }
}

export default Experience;
