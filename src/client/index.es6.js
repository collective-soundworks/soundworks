'use strict';

// fix some kind of bug with Traceur...
// should be retested and hopefully removed with Babel
if (!window.Promise) {
  window.Promise = require('es6-promise').Promise;
}

module.exports = {
  audioContext: require('waves-audio').audioContext,
  client: require('./client'),
  input: require('./input'),
  Calibration: require('./ClientCalibration'),
  Checkin: require('./ClientCheckin'),
  Control: require('./ClientControl'),
  Dialog: require('./ClientDialog'),
  Filelist: require('./ClientFilelist'),
  Loader: require('./ClientLoader'),
  Locator: require('./ClientLocator'),
  Module: require('./ClientModule'),
  Orientation: require('./ClientOrientation'),
  Performance: require('./ClientPerformance'),
  Placer: require('./ClientPlacer'),
  Platform: require('./ClientPlatform'),
  Selector: require('./ClientSelector'),
  Setup: require('./ClientSetup'), // to be removed
  Space: require('./ClientSpace'),
  Survey: require('./ClientSurvey'),
  Sync: require('./ClientSync')
};
