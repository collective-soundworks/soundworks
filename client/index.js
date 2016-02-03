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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OzswQkFBa0IsYUFBYTs7Ozs7OzBCQUdaLGVBQWU7Ozs7a0NBQ1AsdUJBQXVCOzs7Ozs7Z0NBRzNCLHFCQUFxQjs7Ozs7Ozs7O3FDQUtsQiwwQkFBMEI7Ozs7OztxQ0FFMUIsMEJBQTBCOzs7Ozs7MENBRXJCLCtCQUErQjs7OztrQ0FDdkMsdUJBQXVCOzs7OzhCQUMzQixtQkFBbUI7Ozs7bUNBQ2Qsd0JBQXdCOzs7Ozs7K0JBRTVCLG9CQUFvQjs7Ozs7OzJCQUl2QixnQkFBZ0I7Ozs7aUNBQ1Ysc0JBQXNCOzs7O2lDQUN0QixzQkFBc0I7Ozs7b0NBQ25CLHlCQUF5Qjs7OztpQ0FDNUIsc0JBQXNCOzs7O2dDQUN2QixxQkFBcUI7Ozs7a0NBQ25CLHVCQUF1Qjs7OzttQ0FDdEIsd0JBQXdCOzs7O3VDQUNwQiw0QkFBNEI7Ozs7MENBQ3pCLCtCQUErQjs7Ozs7OytCQUUxQyxvQkFBb0I7Ozs7cUNBQ2QsMEJBQTBCOzs7Ozs7NEJBRzVCLGtCQUFrQjs7SUFBL0IsT0FBTzs7eUJBQ0csZUFBZTs7SUFBekIsSUFBSTs7MEJBQ08sZ0JBQWdCOztJQUEzQixLQUFLOztxQkFFRjs7QUFFYixPQUFLLHlCQUFBO0FBQ0wsY0FBWSxFQUFFLHdCQUFNLFlBQVk7O0FBRWhDLFFBQU0seUJBQUE7QUFDTixnQkFBYyxpQ0FBQTs7O0FBR2QsWUFBVSwrQkFBQTs7Ozs7QUFLVixlQUFhLG9DQUFBOzs7O0FBSWIsb0JBQWtCLHlDQUFBO0FBQ2xCLFlBQVUsaUNBQUE7QUFDVixRQUFNLDZCQUFBO0FBQ04sYUFBVyxrQ0FBQTs7QUFFWCxTQUFPLDhCQUFBOztBQUVQLFNBQU8sRUFBRTtBQUNQLFFBQUksMEJBQUE7QUFDSixjQUFVLGdDQUFBO0FBQ1YsY0FBVSxnQ0FBQTtBQUNWLGlCQUFhLG1DQUFBO0FBQ2IsY0FBVSxnQ0FBQTtBQUNWLGFBQVMsK0JBQUE7QUFDVCxlQUFXLGlDQUFBO0FBQ1gsZ0JBQVksa0NBQUE7QUFDWixvQkFBZ0Isc0NBQUE7QUFDaEIsdUJBQW1CLHlDQUFBO0FBQ25CLFlBQVEsOEJBQUE7QUFDUixrQkFBYyxvQ0FBQTtHQUNmOztBQUVELE9BQUssRUFBRTtBQUNMLFdBQU8sRUFBUCxPQUFPO0FBQ1AsUUFBSSxFQUFKLElBQUk7QUFDSixTQUFLLEVBQUwsS0FBSztHQUNOO0NBQ0YiLCJmaWxlIjoic3JjL2NsaWVudC9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBhdWRpbyBmcm9tICd3YXZlcy1hdWRpbyc7XG5cbi8vIGNvcmVcbmltcG9ydCBjbGllbnQgZnJvbSAnLi9jb3JlL2NsaWVudCc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuLy8gc2NlbmVzXG5pbXBvcnQgRXhwZXJpZW5jZSBmcm9tICcuL3NjZW5lcy9FeHBlcmllbmNlJztcbi8vIGltcG9ydCBDbGllbnRTdXJ2ZXkgZnJvbSAnLi9DbGllbnRTdXJ2ZXknO1xuXG4vLyBzZXJ2aWNlc1xuLy8gaW1wb3J0IENsaWVudENhbGlicmF0aW9uIGZyb20gJy4vQ2xpZW50Q2FsaWJyYXRpb24nO1xuaW1wb3J0IENsaWVudENoZWNraW4gZnJvbSAnLi9zZXJ2aWNlcy9DbGllbnRDaGVja2luJztcbi8vIGltcG9ydCBDbGllbnRGaWxlTGlzdCBmcm9tICcuL0NsaWVudEZpbGVMaXN0JztcbmltcG9ydCBDbGllbnRMb2NhdG9yIGZyb20gJy4vc2VydmljZXMvQ2xpZW50TG9jYXRvcic7XG4vLyBpbXBvcnQgQ2xpZW50UGxhY2VyIGZyb20gJy4vQ2xpZW50UGxhY2VyJztcbmltcG9ydCBDbGllbnRTaGFyZWRQYXJhbXMgZnJvbSAnLi9zZXJ2aWNlcy9DbGllbnRTaGFyZWRQYXJhbXMnO1xuaW1wb3J0IENsaWVudFN5bmMgZnJvbSAnLi9zZXJ2aWNlcy9DbGllbnRTeW5jJztcbmltcG9ydCBMb2FkZXIgZnJvbSAnLi9zZXJ2aWNlcy9Mb2FkZXInO1xuaW1wb3J0IE1vdGlvbklucHV0IGZyb20gJy4vc2VydmljZXMvTW90aW9uSW5wdXQnO1xuLy8gaW1wb3J0IE9yaWVudGF0aW9uIGZyb20gJy4vT3JpZW50YXRpb24nO1xuaW1wb3J0IFdlbGNvbWUgZnJvbSAnLi9zZXJ2aWNlcy9XZWxjb21lJztcblxuXG4vLyB2aWV3c1xuaW1wb3J0IFZpZXcgZnJvbSAnLi9kaXNwbGF5L1ZpZXcnO1xuaW1wb3J0IEJ1dHRvblZpZXcgZnJvbSAnLi9kaXNwbGF5L0J1dHRvblZpZXcnO1xuaW1wb3J0IENhbnZhc1ZpZXcgZnJvbSAnLi9kaXNwbGF5L0NhbnZhc1ZpZXcnO1xuaW1wb3J0IFNlZ21lbnRlZFZpZXcgZnJvbSAnLi9kaXNwbGF5L1NlZ21lbnRlZFZpZXcnO1xuaW1wb3J0IFNlbGVjdFZpZXcgZnJvbSAnLi9kaXNwbGF5L1NlbGVjdFZpZXcnO1xuaW1wb3J0IFNwYWNlVmlldyBmcm9tICcuL2Rpc3BsYXkvU3BhY2VWaWV3JztcbmltcG9ydCBTcXVhcmVkVmlldyBmcm9tICcuL2Rpc3BsYXkvU3F1YXJlZFZpZXcnO1xuaW1wb3J0IFRvdWNoU3VyZmFjZSBmcm9tICcuL2Rpc3BsYXkvVG91Y2hTdXJmYWNlJztcbmltcG9ydCBkZWZhdWx0VGVtcGxhdGVzIGZyb20gJy4vZGlzcGxheS9kZWZhdWx0VGVtcGxhdGVzJztcbmltcG9ydCBkZWZhdWx0VGV4dENvbnRlbnRzIGZyb20gJy4vZGlzcGxheS9kZWZhdWx0VGV4dENvbnRlbnRzJztcbi8vIGRyYXdpbmdcbmltcG9ydCBSZW5kZXJlciBmcm9tICcuL2Rpc3BsYXkvUmVuZGVyZXInO1xuaW1wb3J0IFJlbmRlcmluZ0dyb3VwIGZyb20gJy4vZGlzcGxheS9SZW5kZXJpbmdHcm91cCc7XG5cbi8vIHV0aWxzXG5pbXBvcnQgKiBhcyBoZWxwZXJzIGZyb20gJy4uL3V0aWxzL2hlbHBlcnMnO1xuaW1wb3J0ICogYXMgbWF0aCBmcm9tICcuLi91dGlscy9tYXRoJztcbmltcG9ydCAqIGFzIHNldHVwIGZyb20gJy4uL3V0aWxzL3NldHVwJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAvKiBleHRlcm5hbCAqL1xuICBhdWRpbyxcbiAgYXVkaW9Db250ZXh0OiBhdWRpby5hdWRpb0NvbnRleHQsXG4gIC8qIGNvcmUgKi9cbiAgY2xpZW50LFxuICBzZXJ2aWNlTWFuYWdlcixcblxuICAvKiBzY2VuZXMgKi9cbiAgRXhwZXJpZW5jZSxcbiAgLy8gQ2xpZW50U3VydmV5LFxuXG4gIC8qIHNlcnZpY2VzICovXG4gIC8vIENsaWVudENhbGlicmF0aW9uLFxuICBDbGllbnRDaGVja2luLFxuICAvLyBDbGllbnRGaWxlTGlzdCxcbiAgLy8gQ2xpZW50TG9jYXRvcixcbiAgLy8gQ2xpZW50UGxhY2VyLFxuICBDbGllbnRTaGFyZWRQYXJhbXMsXG4gIENsaWVudFN5bmMsXG4gIExvYWRlcixcbiAgTW90aW9uSW5wdXQsXG4gIC8vIE9yaWVudGF0aW9uLFxuICBXZWxjb21lLFxuXG4gIGRpc3BsYXk6IHtcbiAgICBWaWV3LFxuICAgIEJ1dHRvblZpZXcsXG4gICAgQ2FudmFzVmlldyxcbiAgICBTZWdtZW50ZWRWaWV3LFxuICAgIFNlbGVjdFZpZXcsXG4gICAgU3BhY2VWaWV3LFxuICAgIFNxdWFyZWRWaWV3LFxuICAgIFRvdWNoU3VyZmFjZSxcbiAgICBkZWZhdWx0VGVtcGxhdGVzLFxuICAgIGRlZmF1bHRUZXh0Q29udGVudHMsXG4gICAgUmVuZGVyZXIsXG4gICAgUmVuZGVyaW5nR3JvdXAsXG4gIH0sXG5cbiAgdXRpbHM6IHtcbiAgICBoZWxwZXJzLFxuICAgIG1hdGgsXG4gICAgc2V0dXAsXG4gIH0sXG59O1xuIl19