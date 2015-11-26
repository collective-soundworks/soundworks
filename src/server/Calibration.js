import CalibrationServer from 'calibration/server';
import Module from './Module';

/**
 * @private
 */
export default class Calibration extends Module {
  /**
   * Constructor of the calibration server module.
   *
   * Note that the receive functions are registered by {@linkcode
   * Calibration~connect}.
   *
   * @constructs Calibration
   * @param {Object} [params]
   * @param {Object} [params.persistent]
   * @param {Object} [params.persistent.path='../../data'] where to
   * store the persistent file
   * @param {Object} [params.persistent.file='calibration.json'] name
   * of the persistent file
   */
  constructor(params = {
    persistent: {
      path: '../../data',
      file: 'calibration.json'
    } } ) {
      super(params.name || 'calibration');
      this.calibration = new CalibrationServer({ persistent: params.persistent });
  }

  /**
   * Register the receive functions.
   *
   * @function Calibration~connect
   * @param {ServerClient} client
   */
  connect(client) {
    super.connect(client);

    const sendCallback = (cmd, ...args) => { client.send(cmd, ...args); };
    const receiveCallback = (cmd, callback) => { client.receive(cmd, callback); };
    this.calibration.start(sendCallback, receiveCallback);
  }

}
