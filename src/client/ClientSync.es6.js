/**
 * @fileoverview Soundworks client side time syncronization module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

const Sync = require('sync/client');
const audioContext = require('waves-audio').audioContext;

import client from './client.es6.js';
import ClientModule from './ClientModule.es6.js';

/**
 * The `ClientSync` module takes care of the synchronization process on the client side.
 * It displays "Clock syncing, stand by…" until the very first synchronization process is done.
 * The `ClientSync` module calls its `done` method as soon as the client clock is in sync with the sync clock.
 * Then, the synchronization process keeps running in the background to resynchronize the clocks from times to times.
 * @example
 * // Require the Soundworks library (client side)
 * const clientSide = require('soundworks/client'); // TODO
 *
 * // Create Sync module
 * const sync = new clientSide.Sync();
 *
 * // Get times
 * const nowLocal = sync.getLocalTime(); // current time in local clock time
 * const nowSync = sync.getSyncTime(); // current time in sync clock time
 */
export default class ClientSync extends ClientModule {
  /**
   * Creates an instance of the class. Always has a view.
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='sync'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   */
  constructor(options = {}) {
    super(options.name || 'sync', true, options.color || 'black');

    this._ready = false;
    this._sync = new Sync(() => audioContext.currentTime);

    this.setCenteredViewContent('<p class="soft-blink">Clock syncing, stand by&hellip;</p>');
  }

  /**
   * Starts the synchronization process.
   */
  start() {
    super.start();
    this._sync.start(client.send, client.receive, (status, report) => {
      this._syncStatusReport(status, report);
    });
  }

  restart() {
    // TODO
  }

  /**
   * Returns the time in the local clock.
   * If no arguments are provided, returns the current local time (*i.e.* `audioContext.currentTime`).
   * @param {Number} syncTime Time in the sync clock (in seconds).
   * @return {Number} Time in the local clock corresponding to `syncTime` (in seconds).
   * @todo add optional argument?
   */
  getLocalTime(syncTime) {
    return this._sync.getLocalTime(syncTime);
  }

  /**
   * Returns the time in the sync clock.
   * If no arguments are provided, returns the current sync time.
   * @param {Number} localTime Time in the local clock (in seconds).
   * @return {Number} Time in the sync clock corresponding to `localTime` (in seconds)
   * @todo add optional argument?
   */
  getSyncTime(localTime) {
    return this._sync.getSyncTime(localTime);
  }

  _syncStatusReport(message, report) {
    if(message === 'sync:status') {
      if(report.status === 'training' || report.status === 'sync') {
        if(!this._ready) {
          this._ready = true;
          this.done();
        }
      }
      this.emit('sync:status', report);
    }
  }
}
