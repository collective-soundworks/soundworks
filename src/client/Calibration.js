import client from './client';
import Module from './Module';
import CalibrationClient from 'calibration/client';

/**
 * @private
 */
export default class Calibration extends Module {
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
   * Called whenever the calibration changed. First to complete the
   * start, by calling done, and then each time the calibration is
   * restored from the server, because this is asynchronous.
   */
  constructor(params = {}) {
    super(params.name || 'calibration', true, params.color || 'black');
    const that = this;

    this.ready = false;
    this.started = false;

    // undefined is fine
    this.updateFunction = params.updateFunction;

    this.calibration = new CalibrationClient({
      sendFunction: client.send,
      receiveFunction: client.receive,
      updateFunction: () => { that._calibrationUpdated(); }
    });

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
    // load previous calibration on start.
    this.load();
    // done when actually loaded
  }

  /**
   * Save calibration locally, and on the server.
   *
   * @function ClientCalibration~save
   */
  save() {
    this.calibration.save();
  }

  /**
   * Load calibration locally, or from the server.
   *
   * The calibration is loaded from the server when no local
   * configuration is found. Note that loading from the server is
   * asynchronous. See {@linkcode ClientCalibration~updateFunction}
   * passed to the constructor.
   *
   * @function ClientCalibration~load
   */
  load() {
    this.calibration.load();
  }

  /**
   * Locally set the calibrated values.
   *
   * @function ClientCalibration~set
   * @param {calibration} params
   */
  set(params) {
    this.calibration.set(params);
  }

  /**
   * Locally get the calibrated values.
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

  _calibrationUpdated() {
    if(!this.started) {
      this.started = true;
      this.done();
    }
    if(typeof this.updateFunction !== 'undefined') {
      this.updateFunction();
    }
  }
}
