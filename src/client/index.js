import audio from 'waves-audio';

// core
import client from './core/client';
import serviceManager from './core/serviceManager';

// scenes
import Experience from './scenes/Experience';

// services
// import ClientModule from './ClientModule';
// import ClientCalibration from './ClientCalibration';
import ClientCheckin from './services/ClientCheckin';
import ClientControl from './services/ClientControl';
// import ClientFileList from './ClientFileList';
// import ClientLocator from './ClientLocator';
// import ClientPerformance from './ClientPerformance';
// import ClientPlacer from './ClientPlacer';
// import ClientSurvey from './ClientSurvey';
import ClientSync from './services/ClientSync';
import Loader from './services/Loader';
import Welcome from './services/Welcome';

import motionInput from 'motion-input';
// import Orientation from './Orientation';


// views
import View from './display/View';
import ButtonView from './display/ButtonView';
import CanvasView from './display/CanvasView';
import SegmentedView from './display/SegmentedView';
import SelectView from './display/SelectView';
import SpaceView from './display/SpaceView';
import SquaredView from './display/SquaredView';
import TouchSurface from './display/TouchSurface';
import defaultTemplates from './display/defaultTemplates';
import defaultTextContents from './display/defaultTextContents';
// drawing
import Renderer from './display/Renderer';
import RenderingGroup from './display/RenderingGroup';

// utils
import * as helpers from '../utils/helpers';
import * as math from '../utils/math';
import * as setup from '../utils/setup';

export default {
  /* external */
  audio,
  audioContext: audio.audioContext,
  /* core */
  client,
  serviceManager,

  /* scenes */
  Experience,

  /* services */
  // ClientCalibration,
  ClientCheckin,
  ClientControl,
  // ClientFileList,
  // ClientModule,
  // ClientLocator,
  // ClientPerformance,
  // ClientPlacer,
  // ClientSurvey,
  ClientSync,
  Loader,
  motionInput,
  // Orientation,
  Welcome,

  display: {
    View,
    ButtonView,
    CanvasView,
    SegmentedView,
    SelectView,
    SpaceView,
    SquaredView,
    TouchSurface,
    defaultTemplates,
    defaultTextContents,
    Renderer,
    RenderingGroup,
  },

  utils: {
    helpers,
    math,
    setup,
  },
};
