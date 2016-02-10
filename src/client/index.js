import audio from 'waves-audio';

// core
import client from './core/client';
import Process from './core/Process';
import Service from './core/Service';
import serviceManager from './core/serviceManager';
import Signal from './core/Signal';
import SignalAll from './core/SignalAll';

// scenes
import Experience from './scenes/Experience';
// import ClientSurvey from './ClientSurvey';

// services
// import ClientCalibration from './ClientCalibration';
import ClientCheckin from './services/ClientCheckin';
// import ClientFileList from './ClientFileList';
import ClientLocator from './services/ClientLocator';
import ClientNetwork from './services/ClientNetwork';
// import ClientPlacer from './ClientPlacer';
import ClientSharedConfig from './services/ClientSharedConfig';
import ClientSharedParams from './services/ClientSharedParams';
import ClientSync from './services/ClientSync';
import Loader from './services/Loader';
import MotionInput from './services/MotionInput';
// import Orientation from './Orientation';
import Welcome from './services/Welcome';


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
  Process,
  Service,
  serviceManager,
  Signal,
  SignalAll,

  /* scenes */
  Experience,
  // ClientSurvey,

  /* services */
  // @todo - hide inside a namespace ?
  // ClientCalibration,
  ClientCheckin,
  // ClientFileList,
  ClientLocator,
  ClientNetwork,
  // ClientPlacer,
  ClientSharedConfig,
  ClientSharedParams,
  ClientSync,
  Loader,
  MotionInput,
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
