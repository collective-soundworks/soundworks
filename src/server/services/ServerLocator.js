import ServerActivity from '../core/ServerActivity';
import serverServiceManager from '../core/serverServiceManager';

const SERVICE_ID = 'service:locator';

/**
 * Allow to indicate the approximate location of the client on a map.
 *
 * (See also {@link src/client/services/ClientLocator.js~ClientLocator} on the client side.)
 */
class ServerLocator extends ServerActivity {
  constructor() {
    super(SERVICE_ID);
  }

  start() {
    super.start();
    /**
     * Setup defining dimensions and background.
     * @type {Object}
     * @property {Number} setup.width - Width of the setup.
     * @property {Number} setup.height - Height of the setup.
     * @property {String} setup.background - Optionnal background (image) of the setup.
     */
    this.setup = this.options.setup;
  }

  /**
   * @private
   */
  connect(client) {
    super.connect(client);

    this.receive(client, 'request', this._onRequest(client));
    this.receive(client, 'coordinates', this._onCoordinates(client));
  }

  _onRequest(client) {
    return () => {
      const setup = this.setup;
      let area = undefined;

      if (setup) {
        area = {
          width: setup.width,
          height: setup.height,
          background: setup.background,
        };
      }

      this.send(client, 'area', area);
    }
  }

  _onCoordinates(client) {
    return (coordinates) => client.coordinates = coordinates;
  }
}

serverServiceManager.register(SERVICE_ID, ServerLocator);

export default ServerLocator;
