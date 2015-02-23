/**
 * @fileoverview Soundworks client side exported modules
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

module.exports = {
  client: require('./client'),
  input: require('./input'),
  Control: require('./ClientControl'),
  Dialog: require('./ClientDialog'),
  Module: require('./ClientModule'),
  Loader: require('./ClientLoader'),
  Placement: require('./ClientPlacement'),
  Platform: require('./ClientPlatform'),
  Sync: require('./ClientSync'),
  Topology: require('./ClientTopology')
};