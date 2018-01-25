import { audioContext } from 'waves-audio';
import SegmentedView from '../views/SegmentedView';
import Service from '../core/Service';
import serviceManager from '../core/serviceManager';
import SyncModule from 'sync/client';

const SERVICE_ID = 'service:sync';

/**
 * Interface for the client `'sync'` service.
 *
 * The `sync` service synchronizes the local audio clock of the client with the
 * clock of the server (master clock). It internally relies on the `WebAudio`
 * clock and then requires the `platform` service to access this feature.
 *
 * __*The service must be used with its
 * [server-side counterpart]{@link module:soundworks/server.Sync}*__
 *
 * _<span class="warning">__WARNING__</span> This class should never be
 * instanciated manually_
 *
 * _Note:_ the service is based on
 * [`github.com/collective-soundworks/sync`](https://github.com/collective-soundworks/sync).
 *
 * @memberof module:soundworks/client
 *
 * @example
 * // inside the experience constructor
 * this.sync = this.require('sync');
 * // when the experience has started, translate the sync time in local time
 * const syncTime = this.sync.getSyncTime();
 * const localTime = this.sync.getAudioTime(syncTime);
 */
class Sync extends Service {
  constructor() {
    super(SERVICE_ID, true);

    const defaults = {
      viewPriority: 3,
      useAudioTime: true,
      // @todo - add options to configure the sync service
    };

    this.configure(defaults);

    const getTime = this.options.useAudioTime ?
      () => audioContext.currentTime :
      () => (new Date().getTime() * 0.001);

    this._sync = new SyncModule(getTime);
    this._ready = false;

    this.require('platform', { features: 'web-audio' });

    this._syncStatusReport = this._syncStatusReport.bind(this);
    this._reportListeners = [];
  }

  /** @private */
  start() {
    super.start();
    this.show();

    this._sync.start(this.send, this.receive, this._syncStatusReport);
  }

  /** @private */
  stop() {
    this.hide();
    super.stop();
  }

  /**
   * Return the time in the local clock. If no arguments provided,
   * returns the current local time.
   * @param {Number} syncTime - Time from the sync clock (in _seconds_).
   * @return {Number} - Local time corresponding to the given
   *  `syncTime` (in _seconds_).
   */
  getAudioTime(syncTime) {
    return this._sync.getLocalTime(syncTime);
  }

  getLocalTime(syncTime) {
    return this._sync.getLocalTime(syncTime);
  }

  /**
   * Return the time in the sync clock. If no arguments provided,
   * returns the current sync time.
   * @param {Number} audioTime - Time from the local clock (in _seconds_).
   * @return {Number} - Sync time corresponding to the given
   *  `audioTime` (in _seconds_).
   */
  getSyncTime(audioTime) {
    return this._sync.getSyncTime(audioTime);
  }

  /**
   * Add a callback function to the synchronization reports from the server.
   * @param {Function} callback
   */
  addListener(callback) {
    this._reportListeners.push(callback);
  }

  _syncStatusReport(channel, report) {
    if (channel === 'sync:status') {
      if (report.status === 'training' || report.status === 'sync') {
        this._reportListeners.forEach((callback) =>  callback(report));

        if (!this._ready) {
          this._ready = true;
          this.ready();
        }
      }
    }
  }

}

serviceManager.register(SERVICE_ID, Sync);

export default Sync;
