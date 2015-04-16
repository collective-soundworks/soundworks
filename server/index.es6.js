/**
 * @fileoverview Soundworks server side module export
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

module.exports = {
  server: require('./server'),
  Checkin: require('./ServerCheckin'),
  Client: require('./ServerClient'),
  Control: require('./ServerControl'),
  Loader: require('./ServerLoader'),
  Module: require('./ServerModule'),
  Performance: require('./ServerPerformance'),
  Setup: require('./ServerSetup'),
  Sync: require('./ServerSync')
};
