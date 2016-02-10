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

var _coreProcess = require('./core/Process');

var _coreProcess2 = _interopRequireDefault(_coreProcess);

var _coreServiceManager = require('./core/serviceManager');

var _coreServiceManager2 = _interopRequireDefault(_coreServiceManager);

var _coreSignal = require('./core/Signal');

var _coreSignal2 = _interopRequireDefault(_coreSignal);

var _coreSignalAll = require('./core/SignalAll');

var _coreSignalAll2 = _interopRequireDefault(_coreSignalAll);

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

var _servicesClientNetwork = require('./services/ClientNetwork');

var _servicesClientNetwork2 = _interopRequireDefault(_servicesClientNetwork);

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
  Process: _coreProcess2['default'],
  serviceManager: _coreServiceManager2['default'],
  Signal: _coreSignal2['default'],
  SignalAll: _coreSignalAll2['default'],

  /* scenes */
  Experience: _scenesExperience2['default'],
  // ClientSurvey,

  /* services */
  // @todo - hide inside a namespace ?
  // ClientCalibration,
  ClientCheckin: _servicesClientCheckin2['default'],
  // ClientFileList,
  ClientLocator: _servicesClientLocator2['default'],
  ClientNetwork: _servicesClientNetwork2['default'],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OzswQkFBa0IsYUFBYTs7Ozs7OzBCQUdaLGVBQWU7Ozs7MkJBQ2QsZ0JBQWdCOzs7O2tDQUNULHVCQUF1Qjs7OzswQkFDL0IsZUFBZTs7Ozs2QkFDWixrQkFBa0I7Ozs7OztnQ0FHakIscUJBQXFCOzs7Ozs7Ozs7cUNBS2xCLDBCQUEwQjs7Ozs7O3FDQUUxQiwwQkFBMEI7Ozs7cUNBQzFCLDBCQUEwQjs7Ozs7OzBDQUVyQiwrQkFBK0I7Ozs7MENBQy9CLCtCQUErQjs7OztrQ0FDdkMsdUJBQXVCOzs7OzhCQUMzQixtQkFBbUI7Ozs7bUNBQ2Qsd0JBQXdCOzs7Ozs7K0JBRTVCLG9CQUFvQjs7Ozs7OzJCQUl2QixnQkFBZ0I7Ozs7aUNBQ1Ysc0JBQXNCOzs7O2lDQUN0QixzQkFBc0I7Ozs7b0NBQ25CLHlCQUF5Qjs7OztpQ0FDNUIsc0JBQXNCOzs7O2dDQUN2QixxQkFBcUI7Ozs7a0NBQ25CLHVCQUF1Qjs7OzttQ0FDdEIsd0JBQXdCOzs7O3VDQUNwQiw0QkFBNEI7Ozs7MENBQ3pCLCtCQUErQjs7Ozs7OytCQUUxQyxvQkFBb0I7Ozs7cUNBQ2QsMEJBQTBCOzs7Ozs7NEJBRzVCLGtCQUFrQjs7SUFBL0IsT0FBTzs7eUJBQ0csZUFBZTs7SUFBekIsSUFBSTs7MEJBQ08sZ0JBQWdCOztJQUEzQixLQUFLOztxQkFFRjs7QUFFYixPQUFLLHlCQUFBO0FBQ0wsY0FBWSxFQUFFLHdCQUFNLFlBQVk7O0FBRWhDLFFBQU0seUJBQUE7QUFDTixTQUFPLDBCQUFBO0FBQ1AsZ0JBQWMsaUNBQUE7QUFDZCxRQUFNLHlCQUFBO0FBQ04sV0FBUyw0QkFBQTs7O0FBR1QsWUFBVSwrQkFBQTs7Ozs7O0FBTVYsZUFBYSxvQ0FBQTs7QUFFYixlQUFhLG9DQUFBO0FBQ2IsZUFBYSxvQ0FBQTs7QUFFYixvQkFBa0IseUNBQUE7QUFDbEIsb0JBQWtCLHlDQUFBO0FBQ2xCLFlBQVUsaUNBQUE7QUFDVixRQUFNLDZCQUFBO0FBQ04sYUFBVyxrQ0FBQTs7QUFFWCxTQUFPLDhCQUFBOztBQUVQLFNBQU8sRUFBRTtBQUNQLFFBQUksMEJBQUE7QUFDSixjQUFVLGdDQUFBO0FBQ1YsY0FBVSxnQ0FBQTtBQUNWLGlCQUFhLG1DQUFBO0FBQ2IsY0FBVSxnQ0FBQTtBQUNWLGFBQVMsK0JBQUE7QUFDVCxlQUFXLGlDQUFBO0FBQ1gsZ0JBQVksa0NBQUE7QUFDWixvQkFBZ0Isc0NBQUE7QUFDaEIsdUJBQW1CLHlDQUFBO0FBQ25CLFlBQVEsOEJBQUE7QUFDUixrQkFBYyxvQ0FBQTtHQUNmOztBQUVELE9BQUssRUFBRTtBQUNMLFdBQU8sRUFBUCxPQUFPO0FBQ1AsUUFBSSxFQUFKLElBQUk7QUFDSixTQUFLLEVBQUwsS0FBSztHQUNOO0NBQ0YiLCJmaWxlIjoic3JjL2NsaWVudC9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBhdWRpbyBmcm9tICd3YXZlcy1hdWRpbyc7XG5cbi8vIGNvcmVcbmltcG9ydCBjbGllbnQgZnJvbSAnLi9jb3JlL2NsaWVudCc7XG5pbXBvcnQgUHJvY2VzcyBmcm9tICcuL2NvcmUvUHJvY2Vzcyc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBTaWduYWwgZnJvbSAnLi9jb3JlL1NpZ25hbCc7XG5pbXBvcnQgU2lnbmFsQWxsIGZyb20gJy4vY29yZS9TaWduYWxBbGwnO1xuXG4vLyBzY2VuZXNcbmltcG9ydCBFeHBlcmllbmNlIGZyb20gJy4vc2NlbmVzL0V4cGVyaWVuY2UnO1xuLy8gaW1wb3J0IENsaWVudFN1cnZleSBmcm9tICcuL0NsaWVudFN1cnZleSc7XG5cbi8vIHNlcnZpY2VzXG4vLyBpbXBvcnQgQ2xpZW50Q2FsaWJyYXRpb24gZnJvbSAnLi9DbGllbnRDYWxpYnJhdGlvbic7XG5pbXBvcnQgQ2xpZW50Q2hlY2tpbiBmcm9tICcuL3NlcnZpY2VzL0NsaWVudENoZWNraW4nO1xuLy8gaW1wb3J0IENsaWVudEZpbGVMaXN0IGZyb20gJy4vQ2xpZW50RmlsZUxpc3QnO1xuaW1wb3J0IENsaWVudExvY2F0b3IgZnJvbSAnLi9zZXJ2aWNlcy9DbGllbnRMb2NhdG9yJztcbmltcG9ydCBDbGllbnROZXR3b3JrIGZyb20gJy4vc2VydmljZXMvQ2xpZW50TmV0d29yayc7XG4vLyBpbXBvcnQgQ2xpZW50UGxhY2VyIGZyb20gJy4vQ2xpZW50UGxhY2VyJztcbmltcG9ydCBDbGllbnRTaGFyZWRDb25maWcgZnJvbSAnLi9zZXJ2aWNlcy9DbGllbnRTaGFyZWRDb25maWcnO1xuaW1wb3J0IENsaWVudFNoYXJlZFBhcmFtcyBmcm9tICcuL3NlcnZpY2VzL0NsaWVudFNoYXJlZFBhcmFtcyc7XG5pbXBvcnQgQ2xpZW50U3luYyBmcm9tICcuL3NlcnZpY2VzL0NsaWVudFN5bmMnO1xuaW1wb3J0IExvYWRlciBmcm9tICcuL3NlcnZpY2VzL0xvYWRlcic7XG5pbXBvcnQgTW90aW9uSW5wdXQgZnJvbSAnLi9zZXJ2aWNlcy9Nb3Rpb25JbnB1dCc7XG4vLyBpbXBvcnQgT3JpZW50YXRpb24gZnJvbSAnLi9PcmllbnRhdGlvbic7XG5pbXBvcnQgV2VsY29tZSBmcm9tICcuL3NlcnZpY2VzL1dlbGNvbWUnO1xuXG5cbi8vIHZpZXdzXG5pbXBvcnQgVmlldyBmcm9tICcuL2Rpc3BsYXkvVmlldyc7XG5pbXBvcnQgQnV0dG9uVmlldyBmcm9tICcuL2Rpc3BsYXkvQnV0dG9uVmlldyc7XG5pbXBvcnQgQ2FudmFzVmlldyBmcm9tICcuL2Rpc3BsYXkvQ2FudmFzVmlldyc7XG5pbXBvcnQgU2VnbWVudGVkVmlldyBmcm9tICcuL2Rpc3BsYXkvU2VnbWVudGVkVmlldyc7XG5pbXBvcnQgU2VsZWN0VmlldyBmcm9tICcuL2Rpc3BsYXkvU2VsZWN0Vmlldyc7XG5pbXBvcnQgU3BhY2VWaWV3IGZyb20gJy4vZGlzcGxheS9TcGFjZVZpZXcnO1xuaW1wb3J0IFNxdWFyZWRWaWV3IGZyb20gJy4vZGlzcGxheS9TcXVhcmVkVmlldyc7XG5pbXBvcnQgVG91Y2hTdXJmYWNlIGZyb20gJy4vZGlzcGxheS9Ub3VjaFN1cmZhY2UnO1xuaW1wb3J0IGRlZmF1bHRUZW1wbGF0ZXMgZnJvbSAnLi9kaXNwbGF5L2RlZmF1bHRUZW1wbGF0ZXMnO1xuaW1wb3J0IGRlZmF1bHRUZXh0Q29udGVudHMgZnJvbSAnLi9kaXNwbGF5L2RlZmF1bHRUZXh0Q29udGVudHMnO1xuLy8gZHJhd2luZ1xuaW1wb3J0IFJlbmRlcmVyIGZyb20gJy4vZGlzcGxheS9SZW5kZXJlcic7XG5pbXBvcnQgUmVuZGVyaW5nR3JvdXAgZnJvbSAnLi9kaXNwbGF5L1JlbmRlcmluZ0dyb3VwJztcblxuLy8gdXRpbHNcbmltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnLi4vdXRpbHMvaGVscGVycyc7XG5pbXBvcnQgKiBhcyBtYXRoIGZyb20gJy4uL3V0aWxzL21hdGgnO1xuaW1wb3J0ICogYXMgc2V0dXAgZnJvbSAnLi4vdXRpbHMvc2V0dXAnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qIGV4dGVybmFsICovXG4gIGF1ZGlvLFxuICBhdWRpb0NvbnRleHQ6IGF1ZGlvLmF1ZGlvQ29udGV4dCxcbiAgLyogY29yZSAqL1xuICBjbGllbnQsXG4gIFByb2Nlc3MsXG4gIHNlcnZpY2VNYW5hZ2VyLFxuICBTaWduYWwsXG4gIFNpZ25hbEFsbCxcblxuICAvKiBzY2VuZXMgKi9cbiAgRXhwZXJpZW5jZSxcbiAgLy8gQ2xpZW50U3VydmV5LFxuXG4gIC8qIHNlcnZpY2VzICovXG4gIC8vIEB0b2RvIC0gaGlkZSBpbnNpZGUgYSBuYW1lc3BhY2UgP1xuICAvLyBDbGllbnRDYWxpYnJhdGlvbixcbiAgQ2xpZW50Q2hlY2tpbixcbiAgLy8gQ2xpZW50RmlsZUxpc3QsXG4gIENsaWVudExvY2F0b3IsXG4gIENsaWVudE5ldHdvcmssXG4gIC8vIENsaWVudFBsYWNlcixcbiAgQ2xpZW50U2hhcmVkQ29uZmlnLFxuICBDbGllbnRTaGFyZWRQYXJhbXMsXG4gIENsaWVudFN5bmMsXG4gIExvYWRlcixcbiAgTW90aW9uSW5wdXQsXG4gIC8vIE9yaWVudGF0aW9uLFxuICBXZWxjb21lLFxuXG4gIGRpc3BsYXk6IHtcbiAgICBWaWV3LFxuICAgIEJ1dHRvblZpZXcsXG4gICAgQ2FudmFzVmlldyxcbiAgICBTZWdtZW50ZWRWaWV3LFxuICAgIFNlbGVjdFZpZXcsXG4gICAgU3BhY2VWaWV3LFxuICAgIFNxdWFyZWRWaWV3LFxuICAgIFRvdWNoU3VyZmFjZSxcbiAgICBkZWZhdWx0VGVtcGxhdGVzLFxuICAgIGRlZmF1bHRUZXh0Q29udGVudHMsXG4gICAgUmVuZGVyZXIsXG4gICAgUmVuZGVyaW5nR3JvdXAsXG4gIH0sXG5cbiAgdXRpbHM6IHtcbiAgICBoZWxwZXJzLFxuICAgIG1hdGgsXG4gICAgc2V0dXAsXG4gIH0sXG59O1xuIl19