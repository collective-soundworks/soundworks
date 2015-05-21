/**
 * @fileoverview Soundworks server side calibration module
 * @author Jean-Philippe.Lambert@ircam.fr
 */
'use strict';

const ServerModule = require('./ServerModule');
const Calibration = require('calibration/server');

class ServerCalibration extends ServerModule {
  /**
   * Constructor of the calibration server module.
   *
   * Note that the receive functions are registered by {@linkcode
   * ServerCalibration~connect}.
   *
   * @constructs ServerCalibration
   * @param {Object} params
   * @param {Object} params.persistent
   * @param {Object} params.persistent.path where to store the
   * persistent file, '../../data' if undefined.
   * @param {Object} params.persistent.file name of the persistent
   * file, 'calibration.json' if undefined.
   */
  constructor(params = {
    persistent: {
      path: '../../data',
      file: 'calibration.json'
    } } ) {
      super(params.name || 'calibration');
      this.calibration = new Calibration( { persistent: params.persistent });
  }

  /**
   * Register the receive functions.
   *
   * @function ServerCalibration~connect
   * @param {Object} client
   */
  connect(client) {
    super.connect(client);

    // register receive functions
    client.receive('calibration:load', (params) => {
      const {calibration, distance} = this.calibration.load(params);
      if(distance < Infinity) {
        client.send('calibration:set', calibration);
      }
    });

    client.receive('calibration:save', (params) => {
      this.calibration.save(params);
    });
  }

} // class ServerCalibration

module.exports = ServerCalibration;
