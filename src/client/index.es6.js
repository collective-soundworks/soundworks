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

// const audioContext = require('waves-audio').audioContext;
// import client from './client.es6.js';
// import input from './input.es6.js';
// import Calibration from './ClientCalibration.es6.js';
// import Checkin from './ClientCheckin.es6.js';
// import Control from './ClientControl.es6.js';
// import Dialog from './ClientDialog.es6.js';
// import Filelist from './ClientFilelist.es6.js';
// import Loader from './ClientLoader.es6.js';
// import Locator from './ClientLocator.es6.js';
// import Module from './ClientModule.es6.js';
// import Orientation from './ClientOrientation.es6.js';
// import Performance from './ClientPerformance.es6.js';
// import Placer from './ClientPlacer.es6.js';
// import Platform from './ClientPlatform.es6.js';
// import Selector from './ClientSelector.es6.js';
// import Setup from './ClientSetup.es6.js'; // to be removed
// import Space from './ClientSpace.es6.js';
// import Survey from './ClientSurvey.es6.js';
// import Sync from './ClientSync.es6.js');

// export default {
//   audioContext
  // client,
  // input,
  // Calibration,
  // Checkin,
  // Control,
  // Dialog,
  // Filelist,
  // Loader,
  // Locator,
  // Module,
  // Orientation,
  // Performance,
  // Placer,
  // Platform,
  // Selector,
  // Setup,
  // Space,
  // Survey,
  // Sync
// };
