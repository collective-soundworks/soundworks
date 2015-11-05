'use strict';

const ServerModule = require('./ServerModule');
// import ServerModule from './ServerModule.es6.js';

/**
 * The {@link ServerLocator} module allows to store the coordinates of a client when the user enters an approximate location through the interfacte provided by the {@link ClientLocator}.
 */
class ServerLocator extends ServerModule {
// export default class ServerLocator extends ServerModule {
  /**
   * Creates an instance of the class.
   * @param {Object} [options={}] Options.
   * @param {Object} [options.name='locator'] Name of the module.
   * @param {Object} [options.setup] Setup used in the scenario, if any (cf. {@link ServerSetup}).
   */
  constructor(options = {}) {
    super(options.name || 'locator');

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

module.exports = ServerLocator;
