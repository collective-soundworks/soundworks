// import input from './input';
import Module from './Module';
// import client from './client';


/**
 * The {@link ClientPerformance} base class constitutes a basis on which to build a performance on the client side.
 */
export default class Performance extends Module {
  /**
   * Creates an instance of the class. Always has a view.
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='performance'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   */
  constructor(options = {}) {
    super(options.name || 'performance', true, options.color || 'black');
  }

  /**
   * Automatically called to start the module. // TODO
   * Sends a message to the server side module to indicate that the client entered the performance.
   */
  start() {
    super.start();
    // client.send(this.name + ':start');
    this.send('start')
  }

  /**
   * Can be called to terminate the performance.
   * Sends a message to the server side module to indicate that the client exited the performance.
   */
  done() {
    // client.send(this.name + ':done');
    this.send('done')
    super.done(); // TODO: check if needs to be called lastly
  }
}
