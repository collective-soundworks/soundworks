import Activity from './Activity';
import debug from 'debug';

const log = debug('soundworks:lifecycle');

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
  constructor(soundworks) {
    super();

    // @todo - check that it's a soundworks instance
    if (!soundworks) {
      throw new Error('Experience should receive `soundworks` instance as first argument');
    }

    this.soundworks = soundworks;
  }

  require(name, options = {}, dependencies = []) {
    return this.soundworks.serviceManager.get(name, options, dependencies);
  }

  /**
   * Start the experience. This lifecycle method is called when all the
   * required services are `ready` and thus the experience can begin with all
   * the necessary informations and services ready to be consumed.
   */
  start() {
    super.start();

    log(`> experience "${this.constructor.name}" start`);

    this.soundworks.client.socket.send('s:exp:enter');
  }
}

export default Experience;
