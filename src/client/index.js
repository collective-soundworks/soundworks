// @todo - should be handled with `babel-runtime`
// if (!window.Promise) {
//   window.Promise = require('es6-promise').Promise;
// }

import { audioContext } from 'waves-audio';
import client from './client.js';
import input from './input.js';
import Calibration from './Calibration.js';
import Checkin from './Checkin.js';
import Control from './Control.js';
import Dialog from './Dialog.js';
import Filelist from './Filelist.js';
import Loader from './Loader.js';
import Locator from './Locator.js';
import Module from './Module.js';
import Orientation from './Orientation.js';
import Performance from './Performance.js';
import Placer from './Placer.js';
import Platform from './Platform.js';
import Selector from './Selector.js';
import Setup from './Setup.js'; // to be removed
import Space from './Space.js';
import Survey from './Survey.js';
import Sync from './Sync.js';

export default {
  audioContext,
  client,
  input,
  Calibration,
  Checkin,
  Control,
  Dialog,
  Filelist,
  Loader,
  Locator,
  Module,
  Orientation,
  Performance,
  Placer,
  Platform,
  Selector,
  Setup,
  Space,
  Survey,
  Sync
};
