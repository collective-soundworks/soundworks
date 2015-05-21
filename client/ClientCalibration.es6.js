/**
 * @fileoverview Soundworks client side calibration module
 * @author Jean-Philippe.Lambert@ircam.fr
 */
'use strict';

const ClientModule = require('./ClientModule');
const Calibration = require('calibration/client');
const client = require('./client');

class ClientCalibration extends ClientModule {
  /**
   * Function called when an update happened.
   *
   * See {@linkcode ClientCalibration~load}.
   *
   * @callback ClientCalibration~updateFunction
   **/

  /**
   * Constructor of the calibration client module.
   *
   * Note that {@linkcode ClientCalibration~start} method must be
   * called to restore a previous calibration.
   *
   * @constructs ClientCalibration
   * @param {Object} [params]
   * @param {String} [params.name='calibration'] name of module
   * @param {String} [params.color='black'] background
   * @param {ClientCalibration~updateFunction} [params.updateFunction]
   * if defined, called whenever the calibration changed, which is
   * specially useful if the calibration is restored from the server,
   * because this is asynchronous, then.
   */
  constructor(params = {}) {
    super(params.name || 'calibration', true, params.color || 'black');

    this.ready = false;

    // undefined is fine
    this.updateFunction = params.updateFunction;

    this.calibration = new Calibration();

    this.setCenteredViewContent('<p class="soft-blink">Calibration, stand by…</p>');
  }

  /**
   * Register the receive functions, and restore the calibration from
   * local storage, or from the server.
   *
   * @function ClientCalibration~start
   */
  start() {
    super.start();

    client.receive('calibration:set', (params) => {
      this.set(params);
    });

    // load previous calibration on start.
    this.load();

    // we might still wait from the server response at this point
    // for the calibration to be restored.
    this.done();
  }

  /**
   * Save calibration locally, and on the server.
   *
   * @function ClientCalibration~save
   */
  save() {
    this.calibration.save();
    client.send('calibration:save', {
      id: this.calibration.getId(),
      calibration: this.calibration.get()
    });
  }

  /**
   * Load calibration locally, or from the server.
   *
   * The calibration is loaded from the server when no local
   * configuration is found. Note that the server answers is
   * asynchronous. See {@linkcode ClientCalibration~updateFunction}
   * passed to the constructor.
   *
   * @function ClientCalibration~load
   */
  load() {
    // local data to try first
    let calibration = this.calibration.load();

    if(calibration.hasOwnProperty('audio') ) {
      // restore from local
      this.set(calibration);
    } else {
      // restore from server
      client.send('calibration:load', { id: this.calibration.getId() } );
    }
  }

  /**
   * Locally set the calibrated values.
   *
   * @function ClientCalibration~set
   * @param {calibration} params
   */
  set(params) {
    this.calibration.set(params);
    if(typeof this.updateFunction !== 'undefined') {
      this.updateFunction();
    }
  }

  /**
   * Locally get the local calibrated values.
   *
   * Note that {@linkcode CalibrationClient~load} method must be
   * called to restore a previous calibration.
   *
   * @function ClientCalibration~get
   * @returns {calibration} or the empty object {} if no calibration
   * is available.
   */
  get() {
    return this.calibration.get();
  }
}

module.exports = ClientCalibration;
