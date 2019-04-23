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

function getRandomGeoposition() {
  return {
    timestamp: new Date().getTime(),
    coords: {
      accuracy: 10,
      altitude: 10,
      altitudeAccuracy: 10,
      heading: 0,
      latitude: Math.random() * 180 - 90,
      longitude: Math.random() * 360 - 180,
      speed: 1,
    }
  };
}

// this is quite a large update...
function updateRandomGeoposition(geoposition) {
  geoposition.timestamp = new Date().getTime();
  geoposition.coords.latitude += (Math.random() * 1e-4) - (1e-4 / 2);
  geoposition.coords.longitude += (Math.random() * 1e-4) - (1e-4 / 2);
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
 * @param {'start'|'stop'} [options.state='start'] - Default state when the
 *  service is launched.
 * @param {Boolean} [options.enableHighAccuracy=true] - Define if the application
 *  would like to receive the best possible results (cf. [https://dev.w3.org/geo/api/spec-source.html#high-accuracy](https://dev.w3.org/geo/api/spec-source.html#high-accuracy)).
 *
 * @memberof module:soundworks/client
 */
class Geolocation extends Service {
  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  constructor() {
    super(SERVICE_ID);

    const defaults = {
      state: 'start',
      enableHighAccuracy: true,
      // bypass: false,
    };

    this.platform = this.require('platform');

    this._onSuccess = this._onSuccess.bind(this);
    this._onError = this._onError.bind(this);
    this._watchId = null;
    this.state = null;
  }

  configure(options) {
    const _options = Object.assign({}, this.defaults, options);

    if (!this.options.feature) {
      let feature = 'geolocation';

      if (options.bypass !== undefined && options.bypass === true)
        feature = 'geolocation-mock';

      this.options.feature = feature;
      this.platform.requireFeature(feature);
    }

    super.configure(options);
  }

  /** @private */
  start() {
    super.start();

    if (this.options.feature === 'geolocation-mock') {
      const geoposition = getRandomGeoposition();
      this._updateClient(geoposition);
    }

    // only sync values retrieved from `platform` with server before getting ready
    this.emit('geoposition', client.geoposition);
    this.send('geoposition', geopositionToJson(client.geoposition));
    this.ready();

    this.setState(this.options.state);
  }

  /**
   * Set the state of the service.
   *
   * @param {'start'|'stop'} String - New state of the service.
   */
  setState(state) {
    if (this.state !== state) {
      this.state = state;

      if (this.state === 'start')
        this._startWatch();
      else
        this._stopWatch();
    }
  }

  /**
   * Resume the refresh of the position.
   * @private
   */
  _startWatch() {
    if (this.options.debug === false) {
      this._watchId = geolocation.watchPosition(this._onSuccess, this._onError, this.options);
    } else {
      this._watchId = setInterval(() => {
        updateRandomGeoposition(client.geoposition);
        this._onSuccess(client.geoposition);
      }, 3000);
    }
  }

  /**
   * Pause the refresh of the position.
   * @private
   */
  _stopWatch() {
    if (this.options.debug === false)
      navigator.geolocation.clearWatch(this._watchId);
    else
      clearInterval(this._watchId);
  }

  /** @private */
  _onSuccess(geoposition) {
    this._updateClient(geoposition);
    this.emit('geoposition', geoposition);
    this.send('geoposition', geopositionToJson(geoposition));
  }

  /** @private */
  _updateClient(geoposition) {
    const coords = geoposition.coords;
    client.coordinates = [coords.latitude, coords.longitude];
    client.geoposition = geoposition;
  }

  /** @private */
  _onError(err) {
    console.error(err.stack);
  }
}

serviceManager.register(SERVICE_ID, Geolocation);

export default Geolocation;
