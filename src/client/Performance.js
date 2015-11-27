import input from './input';
import Module from './Module';
import client from './client';


/**
 * [client] Base class used to build a performance on the client side.
 *
 * The base class always has a view.
 */
export default class Performance extends Module {
  /**
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='performance'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   */
  constructor(options = {}) {
    super(options.name || 'performance', true, options.color || 'black');
  }

  /**
   * Start the module.
   *
   * Send a message to the server side module to indicate that the client entered the performance.
   *
   * **Note:** the method is called automatically when necessary, you should not call it manually.
   */
  start() {
    super.start();
    client.send(this.name + ':start');
  }

  /**
   * Can be called to terminate the performance.
   * Send a message to the server side module to indicate that the client exited the performance.
   */
  done() {
    client.send(this.name + ':done');
    super.done(); // TODO: check if needs to be called lastly
  }
}
