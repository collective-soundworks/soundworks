/**
 * @fileoverview Matrix server side module export and start function
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

module.exports = {
  ioServer: require('./ioServer'),
  Client: require('./ServerClient'),
  Player: require('./ServerPLayer'),
  Manager: require('./ServerManager'),
  ManagerPlayers: require('./ServerManagerPlayers'),
  Topology: require('./ServerTopology'),
  TopologyMatrix: require('./ServerTopologyMatrix'),
  Setup: require('./ServerSetup'),
  SetupMulti: require('./ServerSetupMulti'),
  SetupSync: require('./ServerSetupSync'),
  SetupPlacement: require('./ServerSetupPlacement'),
  SetupPlacementAssigned: require('./ServerSetupPlacementAssigned'),
  Performance: require('./ServerPerformance'),
  PerformanceSoloists: require('./ServerPerformanceSoloists')
};
