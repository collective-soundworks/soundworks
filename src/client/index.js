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
