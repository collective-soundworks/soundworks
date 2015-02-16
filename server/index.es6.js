/**
 * @fileoverview Matrix server side module export and start function
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

module.exports = {
  server: require('./server'),
  Client: require('./ServerClient'),
  Module: require('./ServerModule'),
  Placement: require('./ServerPlacement'),
  Sync: require('./ServerSync'),
  Topology: require('./ServerTopology')
};
