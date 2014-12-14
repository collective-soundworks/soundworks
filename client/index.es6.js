/**
 * @fileoverview Matrix client side exported modules and start function
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

module.exports = {
  ioClient: require('./ioClient'),
  inputModule: require('./inputModule'),
  Manager: require('./ClientManager'),
  Topology: require('./ClientTopology'),
  TopologyGeneric: require('./ClientTopologyGeneric'),
  Setup: require('./ClientSetup'),
  SetupMulti: require('./ClientSetupMulti'),
  SetupSync: require('./ClientSetupSync'),
  SetupPlacement: require('./ClientSetupPlacement'),
  SetupPlacementAssigned: require('./ClientSetupPlacementAssigned'),
  Performance: require('./ClientPerformance'),
  PerformanceSoloists: require('./ClientPerformanceSoloists')
};