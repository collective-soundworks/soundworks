import ServerModule from './ServerModule';

/**
 * Allow to indicate the approximate location of the client on a map.
 *
 * (See also {@link src/client/ClientLocator.js~ClientLocator} on the client side.)
 */
export default class ServerLocator extends ServerModule {
  /**
   * Creates an instance of the class.
   * @param {Object} [options={}] Options.
   * @param {Object} [options.name='locator'] Name of the module.
   * @param {Object} [options.setup] Setup defining dimensions and background.
   * @param {String[]} [options.setup.width] Width of the setup.
   * @param {String[]} [options.setup.height] Height of the setup.
   * @param {String[]} [options.setup.background] Background (image) of the setup.
   */
  constructor(options = {}) {
    super(options.name || 'locator');

    /**
     * Setup defining dimensions and background.
     * @type {Object}
     */
    this.setup = options.setup;
  }

  /**
   * @private
   */
  connect(client) {
    super.connect(client);

    this.receive(client, 'request', () => {
      let area = undefined;
      let setup = this.setup;

      if(setup) {
        area = {
          width: setup.width;
          height: setup.height;
          background: setup.background;
        };
      }

      this.send(client, 'area', area);
    });

    this.receive(client, 'coordinates', (coordinates) => {
      client.coordinates = coordinates;
    });

    this.receive(client, 'restart', (coordinates) => {
      client.coordinates = coordinates;
    });
  }
}
