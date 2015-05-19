/**
 * @fileoverview Soundworks client side exported modules
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

module.exports = {
  audioContext: require('waves-audio').audioContext,
  client: require('./client'),
  input: require('./input'),
  Checkin: require('./ClientCheckin'),
  Control: require('./ClientControl'),
  Dialog: require('./ClientDialog'),
  Filelist: require('./ClientFilelist'),
  Loader: require('./ClientLoader'),
  Locator: require('./ClientLocator'),
  Module: require('./ClientModule'),
  Orientation: require('./ClientOrientation'),
  Performance: require('./ClientPerformance'),
  Platform: require('./ClientPlatform'),
  Selector: require('./ClientSelector'),
  Setup: require('./ClientSetup'),
  Sync: require('./ClientSync')
};