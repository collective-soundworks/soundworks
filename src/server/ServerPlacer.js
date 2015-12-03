import Module from './Module';


/**
 * [server] Allow to select an available position within a predefined {@link Setup}.
 *
 * (See also {@link src/client/ClientPlacer.js~ClientPlacer} on the client side.)
 */
export default class ServerPlacer extends Module {
  /**
   * Creates an instance of the class.
   * @param {Object} [options={}] Options.
   * @param {Object} [options.name='placer'] Name of the module.
   */
  constructor(options) {
    super(options.name || 'placer');
  }

  /**
   * @private
   */
  connect(client) {
    super.connect(client);

    this.receive(client, 'information', (index, label, coords) => {
      client.modules[this.name].index = index;
      client.modules[this.name].label = label;
      client.coordinates = coords;
    });
  }
}
