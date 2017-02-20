import Service from '../core/Service';
import { getOpt } from '../../utils/helpers';
import serviceManager from '../core/serviceManager';

const SERVICE_ID = 'service:metric-scheduler';

/**
 * Interface for the server `'metric-scheduler'` service.
 *
 * @memberof module:soundworks/server
 * @example
 * // inside the experience constructor
 * this.metricScheduler = this.require('metric-scheduler');
 */
class MetricScheduler extends Service {
  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  constructor() {
    super(SERVICE_ID);

    this._syncTime = 0;
    this._metricPosition = 0;
    this._tempo = 60; // tempo in beats per minute (BPM)
    this._tempoUnit = 0.25; // tempo unit expressed in fractions of a whole note

    this._nextSyncEvent = null;
    this._nextSyncTime = Infinity;

    this._syncScheduler = this.require('sync-scheduler');

    this._onRequest = this._onRequest.bind(this);
  }

  /** @private */
  configure(options) {
    if(options.tempo !== undefined)
      this._tempo = options.tempo;

    if(options.tempoUnit !== undefined)
      this._tempoUnit = options.tempoUnit;

    super.configure(options);
  }

  /** @private */
  start() {
    super.start();
  }

  /** @private */
  _resetSync() {
    this._nextSyncEvent = null;
    this._nextSyncTime = Infinity;
  }

  /** @private */
  _setSync(syncTime, metricPosition, tempo, tempoUnit, event) {
    this._resetSync();

    if (syncTime <= this.syncTime) {
      this._syncTime = syncTime;
      this._metricPosition = metricPosition;
      this._tempo = tempo;
      this._tempoUnit = tempoUnit;
    } else {
      this._nextSyncEvent = { syncTime, metricPosition, tempo, tempoUnit, event };
      this._nextSyncTime = syncTime;
    }

    this.broadcast(null, null, 'sync', syncTime, metricPosition, tempo, tempoUnit, event);
  }

  /** @private */
  _updateSync() {
    if (this.syncTime >= this._nextSyncTime) {
      const event = this._nextSyncEvent;
      this._syncTime = event.syncTime;
      this._metricPosition = event.metricPosition;
      this._tempo = event.tempo;
      this._tempoUnit = event.tempoUnit;
    }
  }

  /** @private */
  _onRequest(client) {
    return () => {
      this._updateSync();
      this.send(client, 'init', this._syncTime, this._metricPosition, this._tempo, this._tempoUnit);
    };
  }

  sync(syncTime, metricPosition, tempo = this._tempo, tempoUnit = this._tempoUnit, event = undefined) {
    this._setSync(syncTime, metricPosition, tempo, tempoUnit, event);
  }

  clear() {
    this.broadcast(null, null, 'clear');
  }

  get currentTime() {
    return this._syncScheduler.currentTime;
  }

  get syncTime() {
    return this._syncScheduler.currentTime;
  }

  get metricPosition() {
    return this._metricPosition + (this._syncScheduler.currentTime - this._syncTime) * this._metricSpeed;
  }

  /**
   * Get metric position corrsponding to a given sync time (regarding the current tempo).
   * @param  {Number} time - time
   * @return {Number} - metric position
   */
  getMetricPositionAtSyncTime(syncTime) {
    return this._metricPosition + (syncTime - this._syncTime) * this._metricSpeed;
  }

  /**
   * Get sync time corrsponding to a given metric position (regarding the current tempo).
   * @param  {Number} position - metric position
   * @return {Number} - time
   */
  getSyncTimeAtMetricPosition(metricPosition) {
    return this._syncTime + (metricPosition - this._metricPosition) / this._metricSpeed;
  }

  /** @private */
  connect(client) {
    super.connect(client);
    this.receive(client, 'request', this._onRequest(client));
  }

  /** @private */
  disconnect(client) {
    super.disconnect(client);
  }
}

serviceManager.register(SERVICE_ID, MetricScheduler);

export default MetricScheduler;
