'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _wavesAudio = require('waves-audio');

var _wavesAudio2 = _interopRequireDefault(_wavesAudio);

// core

var _coreClient = require('./core/client');

var _coreClient2 = _interopRequireDefault(_coreClient);

var _coreServiceManager = require('./core/serviceManager');

var _coreServiceManager2 = _interopRequireDefault(_coreServiceManager);

// scenes

var _scenesExperience = require('./scenes/Experience');

var _scenesExperience2 = _interopRequireDefault(_scenesExperience);

// import ClientSurvey from './ClientSurvey';

// services
// import ClientCalibration from './ClientCalibration';

var _servicesClientCheckin = require('./services/ClientCheckin');

var _servicesClientCheckin2 = _interopRequireDefault(_servicesClientCheckin);

// import ClientFileList from './ClientFileList';

var _servicesClientLocator = require('./services/ClientLocator');

var _servicesClientLocator2 = _interopRequireDefault(_servicesClientLocator);

// import ClientPlacer from './ClientPlacer';

var _servicesClientSharedConfig = require('./services/ClientSharedConfig');

var _servicesClientSharedConfig2 = _interopRequireDefault(_servicesClientSharedConfig);

var _servicesClientSharedParams = require('./services/ClientSharedParams');

var _servicesClientSharedParams2 = _interopRequireDefault(_servicesClientSharedParams);

var _servicesClientSync = require('./services/ClientSync');

var _servicesClientSync2 = _interopRequireDefault(_servicesClientSync);

var _servicesLoader = require('./services/Loader');

var _servicesLoader2 = _interopRequireDefault(_servicesLoader);

var _servicesMotionInput = require('./services/MotionInput');

var _servicesMotionInput2 = _interopRequireDefault(_servicesMotionInput);

// import Orientation from './Orientation';

var _servicesWelcome = require('./services/Welcome');

var _servicesWelcome2 = _interopRequireDefault(_servicesWelcome);

// views

var _displayView = require('./display/View');

var _displayView2 = _interopRequireDefault(_displayView);

var _displayButtonView = require('./display/ButtonView');

var _displayButtonView2 = _interopRequireDefault(_displayButtonView);

var _displayCanvasView = require('./display/CanvasView');

var _displayCanvasView2 = _interopRequireDefault(_displayCanvasView);

var _displaySegmentedView = require('./display/SegmentedView');

var _displaySegmentedView2 = _interopRequireDefault(_displaySegmentedView);

var _displaySelectView = require('./display/SelectView');

var _displaySelectView2 = _interopRequireDefault(_displaySelectView);

var _displaySpaceView = require('./display/SpaceView');

var _displaySpaceView2 = _interopRequireDefault(_displaySpaceView);

var _displaySquaredView = require('./display/SquaredView');

var _displaySquaredView2 = _interopRequireDefault(_displaySquaredView);

var _displayTouchSurface = require('./display/TouchSurface');

var _displayTouchSurface2 = _interopRequireDefault(_displayTouchSurface);

var _displayDefaultTemplates = require('./display/defaultTemplates');

var _displayDefaultTemplates2 = _interopRequireDefault(_displayDefaultTemplates);

var _displayDefaultTextContents = require('./display/defaultTextContents');

var _displayDefaultTextContents2 = _interopRequireDefault(_displayDefaultTextContents);

// drawing

var _displayRenderer = require('./display/Renderer');

var _displayRenderer2 = _interopRequireDefault(_displayRenderer);

var _displayRenderingGroup = require('./display/RenderingGroup');

var _displayRenderingGroup2 = _interopRequireDefault(_displayRenderingGroup);

// utils

var _utilsHelpers = require('../utils/helpers');

var helpers = _interopRequireWildcard(_utilsHelpers);

var _utilsMath = require('../utils/math');

var math = _interopRequireWildcard(_utilsMath);

var _utilsSetup = require('../utils/setup');

var setup = _interopRequireWildcard(_utilsSetup);

exports['default'] = {
  /* external */
  audio: _wavesAudio2['default'],
  audioContext: _wavesAudio2['default'].audioContext,
  /* core */
  client: _coreClient2['default'],
  serviceManager: _coreServiceManager2['default'],

  /* scenes */
  Experience: _scenesExperience2['default'],
  // ClientSurvey,

  /* services */
  // ClientCalibration,
  ClientCheckin: _servicesClientCheckin2['default'],
  // ClientFileList,
  // ClientLocator,
  // ClientPlacer,
  ClientSharedConfig: _servicesClientSharedConfig2['default'],
  ClientSharedParams: _servicesClientSharedParams2['default'],
  ClientSync: _servicesClientSync2['default'],
  Loader: _servicesLoader2['default'],
  MotionInput: _servicesMotionInput2['default'],
  // Orientation,
  Welcome: _servicesWelcome2['default'],

  display: {
    View: _displayView2['default'],
    ButtonView: _displayButtonView2['default'],
    CanvasView: _displayCanvasView2['default'],
    SegmentedView: _displaySegmentedView2['default'],
    SelectView: _displaySelectView2['default'],
    SpaceView: _displaySpaceView2['default'],
    SquaredView: _displaySquaredView2['default'],
    TouchSurface: _displayTouchSurface2['default'],
    defaultTemplates: _displayDefaultTemplates2['default'],
    defaultTextContents: _displayDefaultTextContents2['default'],
    Renderer: _displayRenderer2['default'],
    RenderingGroup: _displayRenderingGroup2['default']
  },

  utils: {
    helpers: helpers,
    math: math,
    setup: setup
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OzswQkFBa0IsYUFBYTs7Ozs7OzBCQUdaLGVBQWU7Ozs7a0NBQ1AsdUJBQXVCOzs7Ozs7Z0NBRzNCLHFCQUFxQjs7Ozs7Ozs7O3FDQUtsQiwwQkFBMEI7Ozs7OztxQ0FFMUIsMEJBQTBCOzs7Ozs7MENBRXJCLCtCQUErQjs7OzswQ0FDL0IsK0JBQStCOzs7O2tDQUN2Qyx1QkFBdUI7Ozs7OEJBQzNCLG1CQUFtQjs7OzttQ0FDZCx3QkFBd0I7Ozs7OzsrQkFFNUIsb0JBQW9COzs7Ozs7MkJBSXZCLGdCQUFnQjs7OztpQ0FDVixzQkFBc0I7Ozs7aUNBQ3RCLHNCQUFzQjs7OztvQ0FDbkIseUJBQXlCOzs7O2lDQUM1QixzQkFBc0I7Ozs7Z0NBQ3ZCLHFCQUFxQjs7OztrQ0FDbkIsdUJBQXVCOzs7O21DQUN0Qix3QkFBd0I7Ozs7dUNBQ3BCLDRCQUE0Qjs7OzswQ0FDekIsK0JBQStCOzs7Ozs7K0JBRTFDLG9CQUFvQjs7OztxQ0FDZCwwQkFBMEI7Ozs7Ozs0QkFHNUIsa0JBQWtCOztJQUEvQixPQUFPOzt5QkFDRyxlQUFlOztJQUF6QixJQUFJOzswQkFDTyxnQkFBZ0I7O0lBQTNCLEtBQUs7O3FCQUVGOztBQUViLE9BQUsseUJBQUE7QUFDTCxjQUFZLEVBQUUsd0JBQU0sWUFBWTs7QUFFaEMsUUFBTSx5QkFBQTtBQUNOLGdCQUFjLGlDQUFBOzs7QUFHZCxZQUFVLCtCQUFBOzs7OztBQUtWLGVBQWEsb0NBQUE7Ozs7QUFJYixvQkFBa0IseUNBQUE7QUFDbEIsb0JBQWtCLHlDQUFBO0FBQ2xCLFlBQVUsaUNBQUE7QUFDVixRQUFNLDZCQUFBO0FBQ04sYUFBVyxrQ0FBQTs7QUFFWCxTQUFPLDhCQUFBOztBQUVQLFNBQU8sRUFBRTtBQUNQLFFBQUksMEJBQUE7QUFDSixjQUFVLGdDQUFBO0FBQ1YsY0FBVSxnQ0FBQTtBQUNWLGlCQUFhLG1DQUFBO0FBQ2IsY0FBVSxnQ0FBQTtBQUNWLGFBQVMsK0JBQUE7QUFDVCxlQUFXLGlDQUFBO0FBQ1gsZ0JBQVksa0NBQUE7QUFDWixvQkFBZ0Isc0NBQUE7QUFDaEIsdUJBQW1CLHlDQUFBO0FBQ25CLFlBQVEsOEJBQUE7QUFDUixrQkFBYyxvQ0FBQTtHQUNmOztBQUVELE9BQUssRUFBRTtBQUNMLFdBQU8sRUFBUCxPQUFPO0FBQ1AsUUFBSSxFQUFKLElBQUk7QUFDSixTQUFLLEVBQUwsS0FBSztHQUNOO0NBQ0YiLCJmaWxlIjoic3JjL2NsaWVudC9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBhdWRpbyBmcm9tICd3YXZlcy1hdWRpbyc7XG5cbi8vIGNvcmVcbmltcG9ydCBjbGllbnQgZnJvbSAnLi9jb3JlL2NsaWVudCc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuLy8gc2NlbmVzXG5pbXBvcnQgRXhwZXJpZW5jZSBmcm9tICcuL3NjZW5lcy9FeHBlcmllbmNlJztcbi8vIGltcG9ydCBDbGllbnRTdXJ2ZXkgZnJvbSAnLi9DbGllbnRTdXJ2ZXknO1xuXG4vLyBzZXJ2aWNlc1xuLy8gaW1wb3J0IENsaWVudENhbGlicmF0aW9uIGZyb20gJy4vQ2xpZW50Q2FsaWJyYXRpb24nO1xuaW1wb3J0IENsaWVudENoZWNraW4gZnJvbSAnLi9zZXJ2aWNlcy9DbGllbnRDaGVja2luJztcbi8vIGltcG9ydCBDbGllbnRGaWxlTGlzdCBmcm9tICcuL0NsaWVudEZpbGVMaXN0JztcbmltcG9ydCBDbGllbnRMb2NhdG9yIGZyb20gJy4vc2VydmljZXMvQ2xpZW50TG9jYXRvcic7XG4vLyBpbXBvcnQgQ2xpZW50UGxhY2VyIGZyb20gJy4vQ2xpZW50UGxhY2VyJztcbmltcG9ydCBDbGllbnRTaGFyZWRDb25maWcgZnJvbSAnLi9zZXJ2aWNlcy9DbGllbnRTaGFyZWRDb25maWcnO1xuaW1wb3J0IENsaWVudFNoYXJlZFBhcmFtcyBmcm9tICcuL3NlcnZpY2VzL0NsaWVudFNoYXJlZFBhcmFtcyc7XG5pbXBvcnQgQ2xpZW50U3luYyBmcm9tICcuL3NlcnZpY2VzL0NsaWVudFN5bmMnO1xuaW1wb3J0IExvYWRlciBmcm9tICcuL3NlcnZpY2VzL0xvYWRlcic7XG5pbXBvcnQgTW90aW9uSW5wdXQgZnJvbSAnLi9zZXJ2aWNlcy9Nb3Rpb25JbnB1dCc7XG4vLyBpbXBvcnQgT3JpZW50YXRpb24gZnJvbSAnLi9PcmllbnRhdGlvbic7XG5pbXBvcnQgV2VsY29tZSBmcm9tICcuL3NlcnZpY2VzL1dlbGNvbWUnO1xuXG5cbi8vIHZpZXdzXG5pbXBvcnQgVmlldyBmcm9tICcuL2Rpc3BsYXkvVmlldyc7XG5pbXBvcnQgQnV0dG9uVmlldyBmcm9tICcuL2Rpc3BsYXkvQnV0dG9uVmlldyc7XG5pbXBvcnQgQ2FudmFzVmlldyBmcm9tICcuL2Rpc3BsYXkvQ2FudmFzVmlldyc7XG5pbXBvcnQgU2VnbWVudGVkVmlldyBmcm9tICcuL2Rpc3BsYXkvU2VnbWVudGVkVmlldyc7XG5pbXBvcnQgU2VsZWN0VmlldyBmcm9tICcuL2Rpc3BsYXkvU2VsZWN0Vmlldyc7XG5pbXBvcnQgU3BhY2VWaWV3IGZyb20gJy4vZGlzcGxheS9TcGFjZVZpZXcnO1xuaW1wb3J0IFNxdWFyZWRWaWV3IGZyb20gJy4vZGlzcGxheS9TcXVhcmVkVmlldyc7XG5pbXBvcnQgVG91Y2hTdXJmYWNlIGZyb20gJy4vZGlzcGxheS9Ub3VjaFN1cmZhY2UnO1xuaW1wb3J0IGRlZmF1bHRUZW1wbGF0ZXMgZnJvbSAnLi9kaXNwbGF5L2RlZmF1bHRUZW1wbGF0ZXMnO1xuaW1wb3J0IGRlZmF1bHRUZXh0Q29udGVudHMgZnJvbSAnLi9kaXNwbGF5L2RlZmF1bHRUZXh0Q29udGVudHMnO1xuLy8gZHJhd2luZ1xuaW1wb3J0IFJlbmRlcmVyIGZyb20gJy4vZGlzcGxheS9SZW5kZXJlcic7XG5pbXBvcnQgUmVuZGVyaW5nR3JvdXAgZnJvbSAnLi9kaXNwbGF5L1JlbmRlcmluZ0dyb3VwJztcblxuLy8gdXRpbHNcbmltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnLi4vdXRpbHMvaGVscGVycyc7XG5pbXBvcnQgKiBhcyBtYXRoIGZyb20gJy4uL3V0aWxzL21hdGgnO1xuaW1wb3J0ICogYXMgc2V0dXAgZnJvbSAnLi4vdXRpbHMvc2V0dXAnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qIGV4dGVybmFsICovXG4gIGF1ZGlvLFxuICBhdWRpb0NvbnRleHQ6IGF1ZGlvLmF1ZGlvQ29udGV4dCxcbiAgLyogY29yZSAqL1xuICBjbGllbnQsXG4gIHNlcnZpY2VNYW5hZ2VyLFxuXG4gIC8qIHNjZW5lcyAqL1xuICBFeHBlcmllbmNlLFxuICAvLyBDbGllbnRTdXJ2ZXksXG5cbiAgLyogc2VydmljZXMgKi9cbiAgLy8gQ2xpZW50Q2FsaWJyYXRpb24sXG4gIENsaWVudENoZWNraW4sXG4gIC8vIENsaWVudEZpbGVMaXN0LFxuICAvLyBDbGllbnRMb2NhdG9yLFxuICAvLyBDbGllbnRQbGFjZXIsXG4gIENsaWVudFNoYXJlZENvbmZpZyxcbiAgQ2xpZW50U2hhcmVkUGFyYW1zLFxuICBDbGllbnRTeW5jLFxuICBMb2FkZXIsXG4gIE1vdGlvbklucHV0LFxuICAvLyBPcmllbnRhdGlvbixcbiAgV2VsY29tZSxcblxuICBkaXNwbGF5OiB7XG4gICAgVmlldyxcbiAgICBCdXR0b25WaWV3LFxuICAgIENhbnZhc1ZpZXcsXG4gICAgU2VnbWVudGVkVmlldyxcbiAgICBTZWxlY3RWaWV3LFxuICAgIFNwYWNlVmlldyxcbiAgICBTcXVhcmVkVmlldyxcbiAgICBUb3VjaFN1cmZhY2UsXG4gICAgZGVmYXVsdFRlbXBsYXRlcyxcbiAgICBkZWZhdWx0VGV4dENvbnRlbnRzLFxuICAgIFJlbmRlcmVyLFxuICAgIFJlbmRlcmluZ0dyb3VwLFxuICB9LFxuXG4gIHV0aWxzOiB7XG4gICAgaGVscGVycyxcbiAgICBtYXRoLFxuICAgIHNldHVwLFxuICB9LFxufTtcbiJdfQ==