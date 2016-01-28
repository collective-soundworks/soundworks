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
// import ClientSync from './ClientSync';

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
  // ClientSync,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OzswQkFBa0IsYUFBYTs7Ozs7OzBCQUdaLGVBQWU7Ozs7OztnQ0FHWCxxQkFBcUI7Ozs7Ozs7O3FDQUtsQiwwQkFBMEI7Ozs7Ozs7Ozs7Ozs4QkFRakMsbUJBQW1COzs7OytCQUNsQixvQkFBb0I7Ozs7MkJBRWhCLGNBQWM7Ozs7Ozs7OzJCQUtyQixnQkFBZ0I7Ozs7aUNBQ1Ysc0JBQXNCOzs7O2lDQUN0QixzQkFBc0I7Ozs7b0NBQ25CLHlCQUF5Qjs7OztpQ0FDNUIsc0JBQXNCOzs7O2dDQUN2QixxQkFBcUI7Ozs7a0NBQ25CLHVCQUF1Qjs7OzttQ0FDdEIsd0JBQXdCOzs7O3VDQUNwQiw0QkFBNEI7Ozs7MENBQ3pCLCtCQUErQjs7Ozs7OytCQUUxQyxvQkFBb0I7Ozs7cUNBQ2QsMEJBQTBCOzs7Ozs7NEJBRzVCLGtCQUFrQjs7SUFBL0IsT0FBTzs7eUJBQ0csZUFBZTs7SUFBekIsSUFBSTs7MEJBQ08sZ0JBQWdCOztJQUEzQixLQUFLOztxQkFFRjs7QUFFYixPQUFLLHlCQUFBO0FBQ0wsY0FBWSxFQUFFLHdCQUFNLFlBQVk7O0FBRWhDLFFBQU0seUJBQUE7OztBQUdOLFlBQVUsK0JBQUE7OztBQUdWLGVBQWEsb0NBQUE7Ozs7Ozs7OztBQVNiLFFBQU0sNkJBQUE7OztBQUdOLFNBQU8sOEJBQUE7O0FBRVAsU0FBTyxFQUFFO0FBQ1AsUUFBSSwwQkFBQTtBQUNKLGNBQVUsZ0NBQUE7QUFDVixjQUFVLGdDQUFBO0FBQ1YsaUJBQWEsbUNBQUE7QUFDYixjQUFVLGdDQUFBO0FBQ1YsYUFBUywrQkFBQTtBQUNULGVBQVcsaUNBQUE7QUFDWCxnQkFBWSxrQ0FBQTtBQUNaLG9CQUFnQixzQ0FBQTtBQUNoQix1QkFBbUIseUNBQUE7QUFDbkIsWUFBUSw4QkFBQTtBQUNSLGtCQUFjLG9DQUFBO0dBQ2Y7O0FBRUQsT0FBSyxFQUFFO0FBQ0wsV0FBTyxFQUFQLE9BQU87QUFDUCxRQUFJLEVBQUosSUFBSTtBQUNKLFNBQUssRUFBTCxLQUFLO0dBQ047Q0FDRiIsImZpbGUiOiJzcmMvY2xpZW50L2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGF1ZGlvIGZyb20gJ3dhdmVzLWF1ZGlvJztcblxuLy8gY29yZVxuaW1wb3J0IGNsaWVudCBmcm9tICcuL2NvcmUvY2xpZW50JztcblxuLy8gc2NlbmVzXG5pbXBvcnQgRXhwZXJpZW5jZSBmcm9tICcuL3NjZW5lcy9FeHBlcmllbmNlJztcblxuLy8gc2VydmljZXNcbi8vIGltcG9ydCBDbGllbnRNb2R1bGUgZnJvbSAnLi9DbGllbnRNb2R1bGUnO1xuLy8gaW1wb3J0IENsaWVudENhbGlicmF0aW9uIGZyb20gJy4vQ2xpZW50Q2FsaWJyYXRpb24nO1xuaW1wb3J0IENsaWVudENoZWNraW4gZnJvbSAnLi9zZXJ2aWNlcy9DbGllbnRDaGVja2luJztcbi8vIGltcG9ydCBDbGllbnRDb250cm9sIGZyb20gJy4vQ2xpZW50Q29udHJvbCc7XG4vLyBpbXBvcnQgQ2xpZW50RmlsZUxpc3QgZnJvbSAnLi9DbGllbnRGaWxlTGlzdCc7XG4vLyBpbXBvcnQgQ2xpZW50TG9jYXRvciBmcm9tICcuL0NsaWVudExvY2F0b3InO1xuLy8gaW1wb3J0IENsaWVudFBlcmZvcm1hbmNlIGZyb20gJy4vQ2xpZW50UGVyZm9ybWFuY2UnO1xuLy8gaW1wb3J0IENsaWVudFBsYWNlciBmcm9tICcuL0NsaWVudFBsYWNlcic7XG4vLyBpbXBvcnQgQ2xpZW50U3VydmV5IGZyb20gJy4vQ2xpZW50U3VydmV5Jztcbi8vIGltcG9ydCBDbGllbnRTeW5jIGZyb20gJy4vQ2xpZW50U3luYyc7XG5pbXBvcnQgTG9hZGVyIGZyb20gJy4vc2VydmljZXMvTG9hZGVyJztcbmltcG9ydCBXZWxjb21lIGZyb20gJy4vc2VydmljZXMvV2VsY29tZSc7XG5cbmltcG9ydCBtb3Rpb25JbnB1dCBmcm9tICdtb3Rpb24taW5wdXQnO1xuLy8gaW1wb3J0IE9yaWVudGF0aW9uIGZyb20gJy4vT3JpZW50YXRpb24nO1xuXG5cbi8vIHZpZXdzXG5pbXBvcnQgVmlldyBmcm9tICcuL2Rpc3BsYXkvVmlldyc7XG5pbXBvcnQgQnV0dG9uVmlldyBmcm9tICcuL2Rpc3BsYXkvQnV0dG9uVmlldyc7XG5pbXBvcnQgQ2FudmFzVmlldyBmcm9tICcuL2Rpc3BsYXkvQ2FudmFzVmlldyc7XG5pbXBvcnQgU2VnbWVudGVkVmlldyBmcm9tICcuL2Rpc3BsYXkvU2VnbWVudGVkVmlldyc7XG5pbXBvcnQgU2VsZWN0VmlldyBmcm9tICcuL2Rpc3BsYXkvU2VsZWN0Vmlldyc7XG5pbXBvcnQgU3BhY2VWaWV3IGZyb20gJy4vZGlzcGxheS9TcGFjZVZpZXcnO1xuaW1wb3J0IFNxdWFyZWRWaWV3IGZyb20gJy4vZGlzcGxheS9TcXVhcmVkVmlldyc7XG5pbXBvcnQgVG91Y2hTdXJmYWNlIGZyb20gJy4vZGlzcGxheS9Ub3VjaFN1cmZhY2UnO1xuaW1wb3J0IGRlZmF1bHRUZW1wbGF0ZXMgZnJvbSAnLi9kaXNwbGF5L2RlZmF1bHRUZW1wbGF0ZXMnO1xuaW1wb3J0IGRlZmF1bHRUZXh0Q29udGVudHMgZnJvbSAnLi9kaXNwbGF5L2RlZmF1bHRUZXh0Q29udGVudHMnO1xuLy8gZHJhd2luZ1xuaW1wb3J0IFJlbmRlcmVyIGZyb20gJy4vZGlzcGxheS9SZW5kZXJlcic7XG5pbXBvcnQgUmVuZGVyaW5nR3JvdXAgZnJvbSAnLi9kaXNwbGF5L1JlbmRlcmluZ0dyb3VwJztcblxuLy8gdXRpbHNcbmltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnLi4vdXRpbHMvaGVscGVycyc7XG5pbXBvcnQgKiBhcyBtYXRoIGZyb20gJy4uL3V0aWxzL21hdGgnO1xuaW1wb3J0ICogYXMgc2V0dXAgZnJvbSAnLi4vdXRpbHMvc2V0dXAnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qIGV4dGVybmFsICovXG4gIGF1ZGlvLFxuICBhdWRpb0NvbnRleHQ6IGF1ZGlvLmF1ZGlvQ29udGV4dCxcbiAgLyogY29yZSAqL1xuICBjbGllbnQsXG5cbiAgLyogc2NlbmVzICovXG4gIEV4cGVyaWVuY2UsXG4gIC8qIHNlcnZpY2VzICovXG4gIC8vIENsaWVudENhbGlicmF0aW9uLFxuICBDbGllbnRDaGVja2luLFxuICAvLyBDbGllbnRDb250cm9sLFxuICAvLyBDbGllbnRGaWxlTGlzdCxcbiAgLy8gQ2xpZW50TW9kdWxlLFxuICAvLyBDbGllbnRMb2NhdG9yLFxuICAvLyBDbGllbnRQZXJmb3JtYW5jZSxcbiAgLy8gQ2xpZW50UGxhY2VyLFxuICAvLyBDbGllbnRTdXJ2ZXksXG4gIC8vIENsaWVudFN5bmMsXG4gIExvYWRlcixcbiAgLy8gbW90aW9uSW5wdXQsXG4gIC8vIE9yaWVudGF0aW9uLFxuICBXZWxjb21lLFxuXG4gIGRpc3BsYXk6IHtcbiAgICBWaWV3LFxuICAgIEJ1dHRvblZpZXcsXG4gICAgQ2FudmFzVmlldyxcbiAgICBTZWdtZW50ZWRWaWV3LFxuICAgIFNlbGVjdFZpZXcsXG4gICAgU3BhY2VWaWV3LFxuICAgIFNxdWFyZWRWaWV3LFxuICAgIFRvdWNoU3VyZmFjZSxcbiAgICBkZWZhdWx0VGVtcGxhdGVzLFxuICAgIGRlZmF1bHRUZXh0Q29udGVudHMsXG4gICAgUmVuZGVyZXIsXG4gICAgUmVuZGVyaW5nR3JvdXAsXG4gIH0sXG5cbiAgdXRpbHM6IHtcbiAgICBoZWxwZXJzLFxuICAgIG1hdGgsXG4gICAgc2V0dXAsXG4gIH0sXG59O1xuIl19