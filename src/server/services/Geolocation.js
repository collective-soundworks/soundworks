import Service from '../core/Service';
import serviceManager from '../core/serviceManager';
import client from '../core/client';


const SERVICE_ID = 'service:geolocation';


/**
 * Interface for the server `'geolocation'` service.
 *
 * The `'geolocation'` service allows to retrieve the latitude and longitude
 * of the client using `gps`. The current values are store into the
 * `client.coordinates` member.
 *
 * __*The service must be used with its [client-side counterpart]{@link module:soundworks/client.Geolocation}*__
 *
 * @memberof module:soundworks/server
 * @example
 */
class Geolocation extends Service {
  constructor() {
    super(SERVICE_ID);

    const defaults = {};
    this.configure(defaults);
  }

  start() {
    super.start();
  }

  connect(client) {
    this.receive(client, 'geoposition', this._onGeoposition(client));
  }

  _onGeoposition(client) {
    return (position) => {
      const coords = position.coords;
      client.coordinates = [coords.latitude, coords.longitude];
      client.geoposition = position;

      this.emit('geoposition', client, client.coordinates, client.geoposition);
    }
  }
}

serviceManager.register(SERVICE_ID, Geolocation);

export default Geolocation;
