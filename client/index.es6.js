/**
 * @fileoverview Soundworks client side exported modules
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

module.exports = {
  client: require('./client'),
  input: require('./input'),
  Checkin: require('./ClientCheckin'),
  Control: require('./ClientControl'),
  Dialog: require('./ClientDialog'),
  Loader: require('./ClientLoader'),
  Module: require('./ClientModule'),
  Orientation: require('./ClientOrientation'),
  Performance: require('./ClientPerformance'),
  Platform: require('./ClientPlatform'),
  Seatmap: require('./ClientSeatmap'),
  Sync: require('./ClientSync')
};