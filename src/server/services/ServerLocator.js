import ServerActivity from '../core/ServerActivity';
import serverServiceManager from '../core/serverServiceManager';

const SERVICE_ID = 'service:locator';

/**
 * [server] This service allows to indicate the approximate location of the client on a map.
 *
 * (See also {@link src/client/services/ClientLocator.js~ClientLocator} on the client side.)
 */
class ServerLocator extends ServerActivity {
  constructor() {
    super(SERVICE_ID);

    /**
     * @type {Object} defaults - Defaults options of the service
     * @attribute {String} [defaults.areaConfigPath='setup.area'] - The path to the server's area
     *  configuration entry (see {@link src/server/core/server.js~appConfig} for details).
     */
    const defaults = {
      areaConfigPath: 'setup.area',
    };

    this.configure(defaults);

    this._area = null;
    this._sharedConfigService = this.require('shared-config');
  }

  /** @inheritdoc */
  start() {
    super.start();

    this._area = this._sharedConfigService.get(this.options.areaConfigPath);
  }

  /** @inheritdoc */
  connect(client) {
    super.connect(client);

    this.receive(client, 'request', this._onRequest(client));
    this.receive(client, 'coordinates', this._onCoordinates(client));
  }

  /** @private */
  _onRequest(client) {
    return () => this.send(client, 'aknowledge', this._area);
  }

  /** @private */
  _onCoordinates(client) {
    return (coordinates) => client.coordinates = coordinates;
  }
}

serverServiceManager.register(SERVICE_ID, ServerLocator);

export default ServerLocator;
