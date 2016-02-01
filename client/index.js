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

// scenes

var _scenesExperience = require('./scenes/Experience');

var _scenesExperience2 = _interopRequireDefault(_scenesExperience);

// services
// import ClientModule from './ClientModule';
// import ClientCalibration from './ClientCalibration';

var _servicesClientCheckin = require('./services/ClientCheckin');

var _servicesClientCheckin2 = _interopRequireDefault(_servicesClientCheckin);

// import ClientControl from './ClientControl';
// import ClientFileList from './ClientFileList';
// import ClientLocator from './ClientLocator';
// import ClientPerformance from './ClientPerformance';
// import ClientPlacer from './ClientPlacer';
// import ClientSurvey from './ClientSurvey';

var _servicesClientSync = require('./services/ClientSync');

var _servicesClientSync2 = _interopRequireDefault(_servicesClientSync);

var _servicesLoader = require('./services/Loader');

var _servicesLoader2 = _interopRequireDefault(_servicesLoader);

var _servicesWelcome = require('./services/Welcome');

var _servicesWelcome2 = _interopRequireDefault(_servicesWelcome);

var _motionInput = require('motion-input');

var _motionInput2 = _interopRequireDefault(_motionInput);

// import Orientation from './Orientation';

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

  /* scenes */
  Experience: _scenesExperience2['default'],
  /* services */
  // ClientCalibration,
  ClientCheckin: _servicesClientCheckin2['default'],
  // ClientControl,
  // ClientFileList,
  // ClientModule,
  // ClientLocator,
  // ClientPerformance,
  // ClientPlacer,
  // ClientSurvey,
  ClientSync: _servicesClientSync2['default'],
  Loader: _servicesLoader2['default'],
  // motionInput,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OzswQkFBa0IsYUFBYTs7Ozs7OzBCQUdaLGVBQWU7Ozs7OztnQ0FHWCxxQkFBcUI7Ozs7Ozs7O3FDQUtsQiwwQkFBMEI7Ozs7Ozs7Ozs7O2tDQU83Qix1QkFBdUI7Ozs7OEJBQzNCLG1CQUFtQjs7OzsrQkFDbEIsb0JBQW9COzs7OzJCQUVoQixjQUFjOzs7Ozs7OzsyQkFLckIsZ0JBQWdCOzs7O2lDQUNWLHNCQUFzQjs7OztpQ0FDdEIsc0JBQXNCOzs7O29DQUNuQix5QkFBeUI7Ozs7aUNBQzVCLHNCQUFzQjs7OztnQ0FDdkIscUJBQXFCOzs7O2tDQUNuQix1QkFBdUI7Ozs7bUNBQ3RCLHdCQUF3Qjs7Ozt1Q0FDcEIsNEJBQTRCOzs7OzBDQUN6QiwrQkFBK0I7Ozs7OzsrQkFFMUMsb0JBQW9COzs7O3FDQUNkLDBCQUEwQjs7Ozs7OzRCQUc1QixrQkFBa0I7O0lBQS9CLE9BQU87O3lCQUNHLGVBQWU7O0lBQXpCLElBQUk7OzBCQUNPLGdCQUFnQjs7SUFBM0IsS0FBSzs7cUJBRUY7O0FBRWIsT0FBSyx5QkFBQTtBQUNMLGNBQVksRUFBRSx3QkFBTSxZQUFZOztBQUVoQyxRQUFNLHlCQUFBOzs7QUFHTixZQUFVLCtCQUFBOzs7QUFHVixlQUFhLG9DQUFBOzs7Ozs7OztBQVFiLFlBQVUsaUNBQUE7QUFDVixRQUFNLDZCQUFBOzs7QUFHTixTQUFPLDhCQUFBOztBQUVQLFNBQU8sRUFBRTtBQUNQLFFBQUksMEJBQUE7QUFDSixjQUFVLGdDQUFBO0FBQ1YsY0FBVSxnQ0FBQTtBQUNWLGlCQUFhLG1DQUFBO0FBQ2IsY0FBVSxnQ0FBQTtBQUNWLGFBQVMsK0JBQUE7QUFDVCxlQUFXLGlDQUFBO0FBQ1gsZ0JBQVksa0NBQUE7QUFDWixvQkFBZ0Isc0NBQUE7QUFDaEIsdUJBQW1CLHlDQUFBO0FBQ25CLFlBQVEsOEJBQUE7QUFDUixrQkFBYyxvQ0FBQTtHQUNmOztBQUVELE9BQUssRUFBRTtBQUNMLFdBQU8sRUFBUCxPQUFPO0FBQ1AsUUFBSSxFQUFKLElBQUk7QUFDSixTQUFLLEVBQUwsS0FBSztHQUNOO0NBQ0YiLCJmaWxlIjoic3JjL2NsaWVudC9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBhdWRpbyBmcm9tICd3YXZlcy1hdWRpbyc7XG5cbi8vIGNvcmVcbmltcG9ydCBjbGllbnQgZnJvbSAnLi9jb3JlL2NsaWVudCc7XG5cbi8vIHNjZW5lc1xuaW1wb3J0IEV4cGVyaWVuY2UgZnJvbSAnLi9zY2VuZXMvRXhwZXJpZW5jZSc7XG5cbi8vIHNlcnZpY2VzXG4vLyBpbXBvcnQgQ2xpZW50TW9kdWxlIGZyb20gJy4vQ2xpZW50TW9kdWxlJztcbi8vIGltcG9ydCBDbGllbnRDYWxpYnJhdGlvbiBmcm9tICcuL0NsaWVudENhbGlicmF0aW9uJztcbmltcG9ydCBDbGllbnRDaGVja2luIGZyb20gJy4vc2VydmljZXMvQ2xpZW50Q2hlY2tpbic7XG4vLyBpbXBvcnQgQ2xpZW50Q29udHJvbCBmcm9tICcuL0NsaWVudENvbnRyb2wnO1xuLy8gaW1wb3J0IENsaWVudEZpbGVMaXN0IGZyb20gJy4vQ2xpZW50RmlsZUxpc3QnO1xuLy8gaW1wb3J0IENsaWVudExvY2F0b3IgZnJvbSAnLi9DbGllbnRMb2NhdG9yJztcbi8vIGltcG9ydCBDbGllbnRQZXJmb3JtYW5jZSBmcm9tICcuL0NsaWVudFBlcmZvcm1hbmNlJztcbi8vIGltcG9ydCBDbGllbnRQbGFjZXIgZnJvbSAnLi9DbGllbnRQbGFjZXInO1xuLy8gaW1wb3J0IENsaWVudFN1cnZleSBmcm9tICcuL0NsaWVudFN1cnZleSc7XG5pbXBvcnQgQ2xpZW50U3luYyBmcm9tICcuL3NlcnZpY2VzL0NsaWVudFN5bmMnO1xuaW1wb3J0IExvYWRlciBmcm9tICcuL3NlcnZpY2VzL0xvYWRlcic7XG5pbXBvcnQgV2VsY29tZSBmcm9tICcuL3NlcnZpY2VzL1dlbGNvbWUnO1xuXG5pbXBvcnQgbW90aW9uSW5wdXQgZnJvbSAnbW90aW9uLWlucHV0Jztcbi8vIGltcG9ydCBPcmllbnRhdGlvbiBmcm9tICcuL09yaWVudGF0aW9uJztcblxuXG4vLyB2aWV3c1xuaW1wb3J0IFZpZXcgZnJvbSAnLi9kaXNwbGF5L1ZpZXcnO1xuaW1wb3J0IEJ1dHRvblZpZXcgZnJvbSAnLi9kaXNwbGF5L0J1dHRvblZpZXcnO1xuaW1wb3J0IENhbnZhc1ZpZXcgZnJvbSAnLi9kaXNwbGF5L0NhbnZhc1ZpZXcnO1xuaW1wb3J0IFNlZ21lbnRlZFZpZXcgZnJvbSAnLi9kaXNwbGF5L1NlZ21lbnRlZFZpZXcnO1xuaW1wb3J0IFNlbGVjdFZpZXcgZnJvbSAnLi9kaXNwbGF5L1NlbGVjdFZpZXcnO1xuaW1wb3J0IFNwYWNlVmlldyBmcm9tICcuL2Rpc3BsYXkvU3BhY2VWaWV3JztcbmltcG9ydCBTcXVhcmVkVmlldyBmcm9tICcuL2Rpc3BsYXkvU3F1YXJlZFZpZXcnO1xuaW1wb3J0IFRvdWNoU3VyZmFjZSBmcm9tICcuL2Rpc3BsYXkvVG91Y2hTdXJmYWNlJztcbmltcG9ydCBkZWZhdWx0VGVtcGxhdGVzIGZyb20gJy4vZGlzcGxheS9kZWZhdWx0VGVtcGxhdGVzJztcbmltcG9ydCBkZWZhdWx0VGV4dENvbnRlbnRzIGZyb20gJy4vZGlzcGxheS9kZWZhdWx0VGV4dENvbnRlbnRzJztcbi8vIGRyYXdpbmdcbmltcG9ydCBSZW5kZXJlciBmcm9tICcuL2Rpc3BsYXkvUmVuZGVyZXInO1xuaW1wb3J0IFJlbmRlcmluZ0dyb3VwIGZyb20gJy4vZGlzcGxheS9SZW5kZXJpbmdHcm91cCc7XG5cbi8vIHV0aWxzXG5pbXBvcnQgKiBhcyBoZWxwZXJzIGZyb20gJy4uL3V0aWxzL2hlbHBlcnMnO1xuaW1wb3J0ICogYXMgbWF0aCBmcm9tICcuLi91dGlscy9tYXRoJztcbmltcG9ydCAqIGFzIHNldHVwIGZyb20gJy4uL3V0aWxzL3NldHVwJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAvKiBleHRlcm5hbCAqL1xuICBhdWRpbyxcbiAgYXVkaW9Db250ZXh0OiBhdWRpby5hdWRpb0NvbnRleHQsXG4gIC8qIGNvcmUgKi9cbiAgY2xpZW50LFxuXG4gIC8qIHNjZW5lcyAqL1xuICBFeHBlcmllbmNlLFxuICAvKiBzZXJ2aWNlcyAqL1xuICAvLyBDbGllbnRDYWxpYnJhdGlvbixcbiAgQ2xpZW50Q2hlY2tpbixcbiAgLy8gQ2xpZW50Q29udHJvbCxcbiAgLy8gQ2xpZW50RmlsZUxpc3QsXG4gIC8vIENsaWVudE1vZHVsZSxcbiAgLy8gQ2xpZW50TG9jYXRvcixcbiAgLy8gQ2xpZW50UGVyZm9ybWFuY2UsXG4gIC8vIENsaWVudFBsYWNlcixcbiAgLy8gQ2xpZW50U3VydmV5LFxuICBDbGllbnRTeW5jLFxuICBMb2FkZXIsXG4gIC8vIG1vdGlvbklucHV0LFxuICAvLyBPcmllbnRhdGlvbixcbiAgV2VsY29tZSxcblxuICBkaXNwbGF5OiB7XG4gICAgVmlldyxcbiAgICBCdXR0b25WaWV3LFxuICAgIENhbnZhc1ZpZXcsXG4gICAgU2VnbWVudGVkVmlldyxcbiAgICBTZWxlY3RWaWV3LFxuICAgIFNwYWNlVmlldyxcbiAgICBTcXVhcmVkVmlldyxcbiAgICBUb3VjaFN1cmZhY2UsXG4gICAgZGVmYXVsdFRlbXBsYXRlcyxcbiAgICBkZWZhdWx0VGV4dENvbnRlbnRzLFxuICAgIFJlbmRlcmVyLFxuICAgIFJlbmRlcmluZ0dyb3VwLFxuICB9LFxuXG4gIHV0aWxzOiB7XG4gICAgaGVscGVycyxcbiAgICBtYXRoLFxuICAgIHNldHVwLFxuICB9LFxufTtcbiJdfQ==