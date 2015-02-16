/**
 * @fileoverview Matrix client side exported modules and start function
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

module.exports = {
  client: require('./client'),
  input: require('./input'),
  Dialog: require('./ClientDialog'),
  Module: require('./ClientModule'),
  Parameters: require('./ClientParameters'),
  Placement: require('./ClientPlacement'),
  Sync: require('./ClientSync'),
  Topology: require('./ClientTopology'),
};