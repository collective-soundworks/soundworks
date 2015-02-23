/**
 * @fileoverview Soundworks server side module export
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

module.exports = {
  server: require('./server'),
  Control: require('./ServerControl'),
  Client: require('./ServerClient'),
  Module: require('./ServerModule'),
  Placement: require('./ServerPlacement'),
  Topology: require('./ServerTopology'),
  Sync: require('./ServerSync'),
};
