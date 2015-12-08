import ServerModule from './ServerModule';


/**
 * [server] Allow to indicate the approximate location of the client on a map.
 *
 * (See also {@link src/client/ClientLocator.js~ClientLocator} on the client side.)
 */
export default class ServerLocator extends ServerModule {
  /**
   * Creates an instance of the class.
   * @param {Object} [options={}] Options.
   * @param {Object} [options.name='locator'] Name of the module.
   * @param {Number} [options.width] Width of the space.
   * @param {Number} [options.height] Height of the space.
   */
  constructor(options = {}) {
    super(options.name || 'locator');

    /**
     * Width of the space.
     * @type {Number}
     */
    this.width = options.width || 10;

    /**
     * Height of the space.
     * @type {Number}
     */
    this.height = options.height || 10;
  }

  /**
   * @private
   */
  connect(client) {
    super.connect(client);

    this.receive(client, 'request', () => {
      this.send(client, 'surface', width, height, background);
    });

    this.receive(client, 'coordinates', (coordinates) => {
      client.coordinates = coordinates;
    });

    this.receive(client, 'restart', (coordinates) => {
      client.coordinates = coordinates;
    });
  }
}
