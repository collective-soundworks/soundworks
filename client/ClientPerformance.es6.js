'use strict';

import client from './client';
import ClientModule from './ClientModule';

/**
 * The `ClientPerformance` base class constitutes a basis on which to build a performance on the client side.
 */
export default class ClientPerformance extends ClientModule {
  /**
   * Creates an instance of the class.
   * - The `name` of the module defaults to `'performance'`
   * - The module always has a `view`
   * - The background color of the `view` defaults to black.
   * @param {Object} [options = {}] The options.
   * @param {string} [options.name = 'performance'] The name of the module.
   * @param {string} [options.color = 'black'] The background color of the `view`.
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
    client.send(this.name + ':start');
  }

  /**
   * Can be called to terminate the performance.
   * Sends a message to the server side module to indicate that the client exited the performance.
   */
  done() {
    client.send(this.name + ':done');
    super.done(); // TODO: check if needs to be called lastly
  }
}
