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

// services
// import ClientModule from './ClientModule';
// import ClientCalibration from './ClientCalibration';

var _servicesClientCheckin = require('./services/ClientCheckin');

var _servicesClientCheckin2 = _interopRequireDefault(_servicesClientCheckin);

var _servicesClientControl = require('./services/ClientControl');

var _servicesClientControl2 = _interopRequireDefault(_servicesClientControl);

// import ClientFileList from './ClientFileList';
// import ClientLocator from './ClientLocator';
// import ClientPerformance from './ClientPerformance';
// import ClientPlacer from './ClientPlacer';
// import ClientSurvey from './ClientSurvey';

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

  /* services */
  // ClientCalibration,
  ClientCheckin: _servicesClientCheckin2['default'],
  ClientControl: _servicesClientControl2['default'],
  // ClientFileList,
  // ClientModule,
  // ClientLocator,
  // ClientPerformance,
  // ClientPlacer,
  // ClientSurvey,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OzswQkFBa0IsYUFBYTs7Ozs7OzBCQUdaLGVBQWU7Ozs7a0NBQ1AsdUJBQXVCOzs7Ozs7Z0NBRzNCLHFCQUFxQjs7Ozs7Ozs7cUNBS2xCLDBCQUEwQjs7OztxQ0FDMUIsMEJBQTBCOzs7Ozs7Ozs7O2tDQU03Qix1QkFBdUI7Ozs7OEJBQzNCLG1CQUFtQjs7OzttQ0FDZCx3QkFBd0I7Ozs7OzsrQkFFNUIsb0JBQW9COzs7Ozs7MkJBSXZCLGdCQUFnQjs7OztpQ0FDVixzQkFBc0I7Ozs7aUNBQ3RCLHNCQUFzQjs7OztvQ0FDbkIseUJBQXlCOzs7O2lDQUM1QixzQkFBc0I7Ozs7Z0NBQ3ZCLHFCQUFxQjs7OztrQ0FDbkIsdUJBQXVCOzs7O21DQUN0Qix3QkFBd0I7Ozs7dUNBQ3BCLDRCQUE0Qjs7OzswQ0FDekIsK0JBQStCOzs7Ozs7K0JBRTFDLG9CQUFvQjs7OztxQ0FDZCwwQkFBMEI7Ozs7Ozs0QkFHNUIsa0JBQWtCOztJQUEvQixPQUFPOzt5QkFDRyxlQUFlOztJQUF6QixJQUFJOzswQkFDTyxnQkFBZ0I7O0lBQTNCLEtBQUs7O3FCQUVGOztBQUViLE9BQUsseUJBQUE7QUFDTCxjQUFZLEVBQUUsd0JBQU0sWUFBWTs7QUFFaEMsUUFBTSx5QkFBQTtBQUNOLGdCQUFjLGlDQUFBOzs7QUFHZCxZQUFVLCtCQUFBOzs7O0FBSVYsZUFBYSxvQ0FBQTtBQUNiLGVBQWEsb0NBQUE7Ozs7Ozs7QUFPYixZQUFVLGlDQUFBO0FBQ1YsUUFBTSw2QkFBQTtBQUNOLGFBQVcsa0NBQUE7O0FBRVgsU0FBTyw4QkFBQTs7QUFFUCxTQUFPLEVBQUU7QUFDUCxRQUFJLDBCQUFBO0FBQ0osY0FBVSxnQ0FBQTtBQUNWLGNBQVUsZ0NBQUE7QUFDVixpQkFBYSxtQ0FBQTtBQUNiLGNBQVUsZ0NBQUE7QUFDVixhQUFTLCtCQUFBO0FBQ1QsZUFBVyxpQ0FBQTtBQUNYLGdCQUFZLGtDQUFBO0FBQ1osb0JBQWdCLHNDQUFBO0FBQ2hCLHVCQUFtQix5Q0FBQTtBQUNuQixZQUFRLDhCQUFBO0FBQ1Isa0JBQWMsb0NBQUE7R0FDZjs7QUFFRCxPQUFLLEVBQUU7QUFDTCxXQUFPLEVBQVAsT0FBTztBQUNQLFFBQUksRUFBSixJQUFJO0FBQ0osU0FBSyxFQUFMLEtBQUs7R0FDTjtDQUNGIiwiZmlsZSI6InNyYy9jbGllbnQvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXVkaW8gZnJvbSAnd2F2ZXMtYXVkaW8nO1xuXG4vLyBjb3JlXG5pbXBvcnQgY2xpZW50IGZyb20gJy4vY29yZS9jbGllbnQnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbi8vIHNjZW5lc1xuaW1wb3J0IEV4cGVyaWVuY2UgZnJvbSAnLi9zY2VuZXMvRXhwZXJpZW5jZSc7XG5cbi8vIHNlcnZpY2VzXG4vLyBpbXBvcnQgQ2xpZW50TW9kdWxlIGZyb20gJy4vQ2xpZW50TW9kdWxlJztcbi8vIGltcG9ydCBDbGllbnRDYWxpYnJhdGlvbiBmcm9tICcuL0NsaWVudENhbGlicmF0aW9uJztcbmltcG9ydCBDbGllbnRDaGVja2luIGZyb20gJy4vc2VydmljZXMvQ2xpZW50Q2hlY2tpbic7XG5pbXBvcnQgQ2xpZW50Q29udHJvbCBmcm9tICcuL3NlcnZpY2VzL0NsaWVudENvbnRyb2wnO1xuLy8gaW1wb3J0IENsaWVudEZpbGVMaXN0IGZyb20gJy4vQ2xpZW50RmlsZUxpc3QnO1xuLy8gaW1wb3J0IENsaWVudExvY2F0b3IgZnJvbSAnLi9DbGllbnRMb2NhdG9yJztcbi8vIGltcG9ydCBDbGllbnRQZXJmb3JtYW5jZSBmcm9tICcuL0NsaWVudFBlcmZvcm1hbmNlJztcbi8vIGltcG9ydCBDbGllbnRQbGFjZXIgZnJvbSAnLi9DbGllbnRQbGFjZXInO1xuLy8gaW1wb3J0IENsaWVudFN1cnZleSBmcm9tICcuL0NsaWVudFN1cnZleSc7XG5pbXBvcnQgQ2xpZW50U3luYyBmcm9tICcuL3NlcnZpY2VzL0NsaWVudFN5bmMnO1xuaW1wb3J0IExvYWRlciBmcm9tICcuL3NlcnZpY2VzL0xvYWRlcic7XG5pbXBvcnQgTW90aW9uSW5wdXQgZnJvbSAnLi9zZXJ2aWNlcy9Nb3Rpb25JbnB1dCc7XG4vLyBpbXBvcnQgT3JpZW50YXRpb24gZnJvbSAnLi9PcmllbnRhdGlvbic7XG5pbXBvcnQgV2VsY29tZSBmcm9tICcuL3NlcnZpY2VzL1dlbGNvbWUnO1xuXG5cbi8vIHZpZXdzXG5pbXBvcnQgVmlldyBmcm9tICcuL2Rpc3BsYXkvVmlldyc7XG5pbXBvcnQgQnV0dG9uVmlldyBmcm9tICcuL2Rpc3BsYXkvQnV0dG9uVmlldyc7XG5pbXBvcnQgQ2FudmFzVmlldyBmcm9tICcuL2Rpc3BsYXkvQ2FudmFzVmlldyc7XG5pbXBvcnQgU2VnbWVudGVkVmlldyBmcm9tICcuL2Rpc3BsYXkvU2VnbWVudGVkVmlldyc7XG5pbXBvcnQgU2VsZWN0VmlldyBmcm9tICcuL2Rpc3BsYXkvU2VsZWN0Vmlldyc7XG5pbXBvcnQgU3BhY2VWaWV3IGZyb20gJy4vZGlzcGxheS9TcGFjZVZpZXcnO1xuaW1wb3J0IFNxdWFyZWRWaWV3IGZyb20gJy4vZGlzcGxheS9TcXVhcmVkVmlldyc7XG5pbXBvcnQgVG91Y2hTdXJmYWNlIGZyb20gJy4vZGlzcGxheS9Ub3VjaFN1cmZhY2UnO1xuaW1wb3J0IGRlZmF1bHRUZW1wbGF0ZXMgZnJvbSAnLi9kaXNwbGF5L2RlZmF1bHRUZW1wbGF0ZXMnO1xuaW1wb3J0IGRlZmF1bHRUZXh0Q29udGVudHMgZnJvbSAnLi9kaXNwbGF5L2RlZmF1bHRUZXh0Q29udGVudHMnO1xuLy8gZHJhd2luZ1xuaW1wb3J0IFJlbmRlcmVyIGZyb20gJy4vZGlzcGxheS9SZW5kZXJlcic7XG5pbXBvcnQgUmVuZGVyaW5nR3JvdXAgZnJvbSAnLi9kaXNwbGF5L1JlbmRlcmluZ0dyb3VwJztcblxuLy8gdXRpbHNcbmltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnLi4vdXRpbHMvaGVscGVycyc7XG5pbXBvcnQgKiBhcyBtYXRoIGZyb20gJy4uL3V0aWxzL21hdGgnO1xuaW1wb3J0ICogYXMgc2V0dXAgZnJvbSAnLi4vdXRpbHMvc2V0dXAnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qIGV4dGVybmFsICovXG4gIGF1ZGlvLFxuICBhdWRpb0NvbnRleHQ6IGF1ZGlvLmF1ZGlvQ29udGV4dCxcbiAgLyogY29yZSAqL1xuICBjbGllbnQsXG4gIHNlcnZpY2VNYW5hZ2VyLFxuXG4gIC8qIHNjZW5lcyAqL1xuICBFeHBlcmllbmNlLFxuXG4gIC8qIHNlcnZpY2VzICovXG4gIC8vIENsaWVudENhbGlicmF0aW9uLFxuICBDbGllbnRDaGVja2luLFxuICBDbGllbnRDb250cm9sLFxuICAvLyBDbGllbnRGaWxlTGlzdCxcbiAgLy8gQ2xpZW50TW9kdWxlLFxuICAvLyBDbGllbnRMb2NhdG9yLFxuICAvLyBDbGllbnRQZXJmb3JtYW5jZSxcbiAgLy8gQ2xpZW50UGxhY2VyLFxuICAvLyBDbGllbnRTdXJ2ZXksXG4gIENsaWVudFN5bmMsXG4gIExvYWRlcixcbiAgTW90aW9uSW5wdXQsXG4gIC8vIE9yaWVudGF0aW9uLFxuICBXZWxjb21lLFxuXG4gIGRpc3BsYXk6IHtcbiAgICBWaWV3LFxuICAgIEJ1dHRvblZpZXcsXG4gICAgQ2FudmFzVmlldyxcbiAgICBTZWdtZW50ZWRWaWV3LFxuICAgIFNlbGVjdFZpZXcsXG4gICAgU3BhY2VWaWV3LFxuICAgIFNxdWFyZWRWaWV3LFxuICAgIFRvdWNoU3VyZmFjZSxcbiAgICBkZWZhdWx0VGVtcGxhdGVzLFxuICAgIGRlZmF1bHRUZXh0Q29udGVudHMsXG4gICAgUmVuZGVyZXIsXG4gICAgUmVuZGVyaW5nR3JvdXAsXG4gIH0sXG5cbiAgdXRpbHM6IHtcbiAgICBoZWxwZXJzLFxuICAgIG1hdGgsXG4gICAgc2V0dXAsXG4gIH0sXG59O1xuIl19