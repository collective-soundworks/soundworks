import ServerModule from './ServerModule';


/**
 * [server] Allow to indicate the approximate location of the client on a map (that graphically represents a {@link Setup}) via a dialog.
 *
 * (See also {@link src/client/ClientLocator.js~ClientLocator} on the client side.)
 */
export default class ServerLocator extends ServerModule {
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

    this.receive(client, 'request', () => {
      if (this.setup) {
        const surface = this.setup.getSurface();
        this.send(client, 'surface', surface);
      } else {
        throw new Error('ServerLocator requires a setup.');
      }
    });

    this.receive(client, 'coordinates', (coordinates) => {
      client.coordinates = coordinates;
    });

    this.receive(client, 'restart', (coordinates) => {
      client.coordinates = coordinates;
    });
  }
}
