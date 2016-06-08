import Service from '../core/Service';
import serviceManager from '../core/serviceManager';

const SERVICE_ID = 'service:locator';


/**
 * Interface of the server `'locator'` service.
 *
 * This service is one of the provided services aimed at identifying clients inside
 * the experience along with the [`'placer'`]{@link module:soundworks/server.Placer}
 * and [`'checkin'`]{@link module:soundworks/server.Checkin} services.
 *
 * The `'locator'` service allows a client to give its approximate location inside
 * a graphical representation of the `area` as defined in the server's `setup`
 * configuration entry.
 *
 * __*The service must be used with its [client-side counterpart]{@link module:soundworks/client.Locator}*__
 *
 * @see {@link module:soundworks/server.Placer}
 * @see {@link module:soundworks/server.Checkin}
 *
 * @memberof module:soundworks/server
 * @example
 * // inside the experience constructor
 * this.locator = this.require('locator');
 */
class Locator extends Service {
  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  constructor() {
    super(SERVICE_ID);

    const defaults = {
      configItem: 'setup.area',
    };

    this.configure(defaults);

    this._area = null;
    this._sharedConfig = this.require('shared-config');
  }

  /** @private */
  start() {
    super.start();

    const configItem = this.options.configItem;

    if (this._sharedConfig.get(configItem) === null)
      throw new Error(`"service:locator": server.config.${configItem} is not defined`);

    this.clientTypes.forEach((clientType) => {
      this._sharedConfig.share(configItem, clientType);
    });
  }

  /** @private */
  connect(client) {
    super.connect(client);

    this.receive(client, 'request', this._onRequest(client));
    this.receive(client, 'coordinates', this._onCoordinates(client));
  }

  /** @private */
  _onRequest(client) {
    return () => this.send(client, 'aknowledge', this.options.configItem);
  }

  /** @private */
  _onCoordinates(client) {
    return (coordinates) => client.coordinates = coordinates;
  }
}

serviceManager.register(SERVICE_ID, Locator);

export default Locator;
