import Service from '../core/Service';
import serviceManager from '../core/serviceManager';
import client from '../core/client';


const SERVICE_ID = 'service:geolocation';
const geolocation = navigator.geolocation;

function geopositionToJson(geoposition) {
  return {
    timestamp: geoposition.timestamp,
    coords: {
      accuracy: geoposition.coords.accuracy,
      altitude: geoposition.coords.altitude,
      altitudeAccuracy: geoposition.coords.altitudeAccuracy,
      heading: geoposition.coords.heading,
      latitude: geoposition.coords.latitude,
      longitude: geoposition.coords.longitude,
      speed: geoposition.coords.speed
    }
  }
}


/**
 * Interface for the client `'geolocation'` service.
 *
 * The `'geolocation'` service allows to retrieve the latitude and longitude
 * of the client using `gps`. The current values are store into the
 * `client.coordinates` member.
 *
 * __*The service must be used with its [server-side counterpart]{@link module:soundworks/server.Geolocation}*__
 *
 * @param {Object} options - Override default options.
 * @param {Number|'auto'} [options.refreshRate=0] - Interval (in milliseconds)
 *  at which a new call for location should be done (warning: as the underlying
 *  API is async, this value is indicative and subject to large jitter).
 *  - If 0, the current position is retrieved on service initialization and never
 *  refreshed.
 *  - If set to `auto`, the service relies on `watchPosition` default behavior.
 * @param {Boolean} [options.enableHighAccuracy=true] - Define if the application
 *  would like to receive the best possible results (cf. [https://dev.w3.org/geo/api/spec-source.html#high-accuracy](https://dev.w3.org/geo/api/spec-source.html#high-accuracy)).
 *
 * @memberof module:soundworks/client
 * @example
 */
class Geolocation extends Service {
  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  constructor() {
    super(SERVICE_ID, true);

    const defaults = {
      refreshRate: 0,
      enableHighAccuracy: true,
    };

    this.configure(defaults);

    this._onSuccess = this._onSuccess.bind(this);
    this._onError = this._onError.bind(this);
    this._auto = null;

    this.require('platform', { features: ['geolocation'] });
  }

  init() {}

  start() {
    super.start();

    if (!this.hasStarted)
      this.init();

    // refreshRate : 0, value in ms, 'auto'
    const refreshRate = this.options.refreshRate;
    this._auto = refreshRate === 'auto' ? true : false;

    this.resume();
  }

  /**
   * Pause the refresh of the position.
   */
  pause() {
    if (this._auto)
      navigator.clearWatch(this._watchId);
    else
      clearTimeout(this._watchId);
  }

  /**
   * Resume the refresh of the position.
   */
  resume() {
    const method = this._auto ? 'watchPosition' : 'getCurrentPosition';
    geolocation[method](this._onSuccess, this._onError, this.options);
  }

  _onSuccess(position) {
    const coords = position.coords;
    const refreshRate = this.options.refreshRate;

    if (!this.signals.ready.get())
      this.ready();

    client.coordinates = [coords.latitude, coords.longitude];
    client.geoposition = position;

    this.emit('position', position);
    this.send('position', geopositionToJson(position));

    if (refreshRate !== 'auto' && refreshRate > 0) {
      this._watchId = setTimeout(() => {
        geolocation.getCurrentPosition(this._onSuccess, this._onError, this.options);
      }, refreshRate);
    }
  }

  _onError(err) {
    console.error(err.stack);
  }
}

serviceManager.register(SERVICE_ID, Geolocation);

export default Geolocation;
