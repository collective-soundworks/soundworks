import { audioContext } from 'waves-audio';
import client from './client';
import input from './input';

import ClientCalibration from './ClientCalibration';
import ClientCheckin from './ClientCheckin';
import ClientControl from './ClientControl';
import ClientFileList from './ClientFileList';
import ClientLocator from './ClientLocator';
import ClientPerformance from './ClientPerformance';
import ClientPlacer from './ClientPlacer';
import ClientSurvey from './ClientSurvey';
import ClientSync from './ClientSync';

import Loader from './Loader';
import ClientModule from './ClientModule';
import Orientation from './Orientation';
// import Platform from './Platform';
import Selector from './Selector';
// import Space from './Space';
import Welcome from './Welcome';

import View from './display/View';
import SegmentedView from './display/SegmentedView';
import SpaceView from './display/SpaceView';
import SquaredView from './display/SquaredView';
// import defaultTemplates from './views/defaultTemplates';
// import defaultTextContents from './views/defaultTextContents';


export default {
  audioContext,
  client,
  input,
  ClientCalibration,
  ClientCheckin,
  ClientControl,
  ClientFileList,
  ClientLocator,
  ClientPerformance,
  ClientPlacer,
  ClientSurvey,
  ClientSync,
  // Dialog,
  Loader,
  ClientModule,
  Orientation,
  // Platform,
  Selector,
  // Space,
  Welcome,

  display: {
    View,
    SegmentedView,
    SpaceView,
    SquaredView,
    // defaultTemplates,
    // defaultTextContents,
  }
};
