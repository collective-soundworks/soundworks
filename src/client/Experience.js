import debug from 'debug';

const log = debug('soundworks:lifecycle');

/**
 * Base class to be extended in order to create the client-side of a custom
 * experience.
 *
 * The user defined `Experience` is the main component of a soundworks application.
 *
 * @memberof @soundworks/core/client
 */
class Experience {
  constructor(soundworks) {
    // @todo - check that it's a soundworks instance
    if (!soundworks) {
      throw new Error('Experience should receive `soundworks` instance as first argument');
    }

    this.soundworks = soundworks;
  }

  /**
   * Require a registered service, all client types associated to the experience
   * will also be associated to the required service.
   * @param {String} name - Name of the service as given when registered
   */
  require(name) {
    return this.soundworks.serviceManager.get(name, true);
  }

  /**
   * Start the experience. This lifecycle method is called when all the
   * required services are `ready` and thus the experience can begin with all
   * the necessary informations and services ready to be consumed.
   */
  start() {
    log(`> experience "${this.constructor.name}" start`);

    this.soundworks.socket.send('s:exp:enter');
  }
}

export default Experience;
