import { audioContext } from 'waves-audio';
import client from './client';
import input from './input';

import ClientModule from './ClientModule';
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
import Orientation from './Orientation';
import Welcome from './Welcome';

import View from './display/View';
import SegmentedView from './display/SegmentedView';
import SelectorView from './display/SelectorView';
import SpaceView from './display/SpaceView';
import SquaredView from './display/SquaredView';


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
  Loader,
  ClientModule,
  Orientation,
  Welcome,

  display: {
    View,
    SegmentedView,
    SelectorView,
    SpaceView,
    SquaredView,
    // defaultTemplates,
    // defaultTextContents,
  }
};
