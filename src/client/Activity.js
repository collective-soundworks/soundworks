import Signal from '../common/Signal';
import SignalAll from '../common/SignalAll';

/**
 * Internal base class for services and scenes. Basically a process with view
 * and network abilities.
 *
 * @memberof module:soundworks/client
 * @extends module:soundworks/client.Process
 */
class Activity {
  constructor() {}

  /**
   * Logic to perform when an `Activity` (`Service` or `Experience`) starts.
   * i.e. when all the activities it relies on (`require`) are `ready`
   */
  start() {}
}

export default Activity;
