'use strict';

import ServerModule from './ServerModule.es6.js';

/**
 * The {@link ServerPlacer} module allows to store the place of a client selected by the user through the interfacte provided by the {@link ClientPlacer}.
 */
export default class ServerPlacer extends ServerModule {
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

    client.receive(`${this.name}:information`, (index, label, coords) => {
      client.modules[this.name].index = index;
      client.modules[this.name].label = label;
      client.coordinates = coords;
    });
  }
}

module.exports = ServerPlacer;
