import Module from './Module';


/**
 * [server] Allow to indicate the approximate location of the client on a map (that graphically represents a {@link Setup}) via a dialog.
 *
 * (See also {@link src/client/Locator.js~Locator} on the client side.)
 */
export default class Locator extends Module {
  /**
   * Creates an instance of the class.
   * @param {Object} [options={}] Options.
   * @param {Object} [options.name='locator'] Name of the module.
   * @param {Object} [options.setup] Setup used in the scenario, if any (cf. {@link ServerSetup}).
   */
  constructor(options = {}) {
    super(options.name || 'locator');

    /**
     * Setup used by the locator, if any.
     * @type {Setup}
     */
    this.setup = options.setup || null;
  }

  /**
   * @private
   */
  connect(client) {
    super.connect(client);

    client.receive(this.name + ':request', () => {
      if (this.setup) {
        let surface = this.setup.getSurface();
        client.send(this.name + ':surface', surface);
      } else {
        throw new Error("Locator requires a setup.");
      }
    });

    client.receive(this.name + ':coordinates', (coordinates) => {
      client.coordinates = coordinates;
    });

    client.receive(this.name + ':restart', (coordinates) => {
      client.coordinates = coordinates;
    });
  }
}
