// @todo - should be handled with `babel-runtime`
// if (!window.Promise) {
//   window.Promise = require('es6-promise').Promise;
// }

import { audioContext } from 'waves-audio';
import client from './client';
import input from './input';
import Calibration from './Calibration';
import Checkin from './Checkin';
import Control from './Control';
import Dialog from './Dialog';
import Filelist from './Filelist';
import Loader from './Loader';
import Locator from './Locator';
import Module from './Module';
import Orientation from './Orientation';
import Performance from './Performance';
import Placer from './Placer';
import Platform from './Platform';
import Selector from './Selector';
import Setup from './Setup'; // to be removed
import Space from './Space';
import Survey from './Survey';
import Sync from './Sync';

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
