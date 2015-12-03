import Module from './Module';


/**
 * The {@link ServerLocator} module allows to store the coordinates of a client when the user enters an approximate location through the interfacte provided by the {@link ClientLocator}.
 */
export default class ServerLocator extends Module {
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
    });@

    this.receive(client, 'restart', (coordinates) => {
      client.coordinates = coordinates;
    });
  }
}
