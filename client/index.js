'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

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

var _coreService = require('./core/Service');

var _coreService2 = _interopRequireDefault(_coreService);

var _coreServiceManager = require('./core/serviceManager');

var _coreServiceManager2 = _interopRequireDefault(_coreServiceManager);

var _coreSignal = require('./core/Signal');

var _coreSignal2 = _interopRequireDefault(_coreSignal);

var _coreSignalAll = require('./core/SignalAll');

var _coreSignalAll2 = _interopRequireDefault(_coreSignalAll);

// scenes

var _scenesExperience = require('./scenes/Experience');

var _scenesExperience2 = _interopRequireDefault(_scenesExperience);

var _scenesClientSurvey = require('./scenes/ClientSurvey');

var _scenesClientSurvey2 = _interopRequireDefault(_scenesClientSurvey);

// services

var _servicesClientCheckin = require('./services/ClientCheckin');

var _servicesClientCheckin2 = _interopRequireDefault(_servicesClientCheckin);

// import ClientFileList from './ClientFileList';

var _servicesClientErrorReporter = require('./services/ClientErrorReporter');

var _servicesClientErrorReporter2 = _interopRequireDefault(_servicesClientErrorReporter);

var _servicesClientLocator = require('./services/ClientLocator');

var _servicesClientLocator2 = _interopRequireDefault(_servicesClientLocator);

var _servicesClientNetwork = require('./services/ClientNetwork');

var _servicesClientNetwork2 = _interopRequireDefault(_servicesClientNetwork);

var _servicesClientPlacer = require('./services/ClientPlacer');

var _servicesClientPlacer2 = _interopRequireDefault(_servicesClientPlacer);

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

var _servicesScheduler = require('./services/Scheduler');

var _servicesScheduler2 = _interopRequireDefault(_servicesScheduler);

// import Orientation from './Orientation';

var _servicesWelcome = require('./services/Welcome');

var _servicesWelcome2 = _interopRequireDefault(_servicesWelcome);

// views

var _displayDefaultTemplates = require('./display/defaultTemplates');

var _displayDefaultTemplates2 = _interopRequireDefault(_displayDefaultTemplates);

var _displayDefaultTextContents = require('./display/defaultTextContents');

var _displayDefaultTextContents2 = _interopRequireDefault(_displayDefaultTextContents);

var _displayButtonView = require('./display/ButtonView');

var _displayButtonView2 = _interopRequireDefault(_displayButtonView);

var _displayCanvasView = require('./display/CanvasView');

var _displayCanvasView2 = _interopRequireDefault(_displayCanvasView);

var _displayRenderer = require('./display/Renderer');

var _displayRenderer2 = _interopRequireDefault(_displayRenderer);

var _displayRenderingGroup = require('./display/RenderingGroup');

var _displayRenderingGroup2 = _interopRequireDefault(_displayRenderingGroup);

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

var _displayView = require('./display/View');

var _displayView2 = _interopRequireDefault(_displayView);

var _displayViewport = require('./display/viewport');

var _displayViewport2 = _interopRequireDefault(_displayViewport);

exports['default'] = {
  /* external */
  audio: _wavesAudio2['default'],
  audioContext: _wavesAudio2['default'].audioContext,

  /* core */
  client: _coreClient2['default'],
  Process: _coreProcess2['default'],
  Service: _coreService2['default'],
  serviceManager: _coreServiceManager2['default'],
  Signal: _coreSignal2['default'],
  SignalAll: _coreSignalAll2['default'],

  /* scenes */
  Experience: _scenesExperience2['default'],
  ClientSurvey: _scenesClientSurvey2['default'],

  display: {
    defaultTemplates: _displayDefaultTemplates2['default'],
    defaultTextContents: _displayDefaultTextContents2['default'],
    ButtonView: _displayButtonView2['default'],
    CanvasView: _displayCanvasView2['default'],
    Renderer: _displayRenderer2['default'],
    RenderingGroup: _displayRenderingGroup2['default'],
    SegmentedView: _displaySegmentedView2['default'],
    SelectView: _displaySelectView2['default'],
    SpaceView: _displaySpaceView2['default'],
    SquaredView: _displaySquaredView2['default'],
    TouchSurface: _displayTouchSurface2['default'],
    View: _displayView2['default'],
    viewport: _displayViewport2['default']
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9jbGllbnQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7MEJBQWtCLGFBQWE7Ozs7OzswQkFHWixlQUFlOzs7OzJCQUNkLGdCQUFnQjs7OzsyQkFDaEIsZ0JBQWdCOzs7O2tDQUNULHVCQUF1Qjs7OzswQkFDL0IsZUFBZTs7Ozs2QkFDWixrQkFBa0I7Ozs7OztnQ0FHakIscUJBQXFCOzs7O2tDQUNuQix1QkFBdUI7Ozs7OztxQ0FHdEIsMEJBQTBCOzs7Ozs7MkNBRXBCLGdDQUFnQzs7OztxQ0FDdEMsMEJBQTBCOzs7O3FDQUMxQiwwQkFBMEI7Ozs7b0NBQzNCLHlCQUF5Qjs7OzswQ0FDbkIsK0JBQStCOzs7OzBDQUMvQiwrQkFBK0I7Ozs7a0NBQ3ZDLHVCQUF1Qjs7Ozs4QkFDM0IsbUJBQW1COzs7O21DQUNkLHdCQUF3Qjs7OztpQ0FDMUIsc0JBQXNCOzs7Ozs7K0JBRXhCLG9CQUFvQjs7Ozs7O3VDQUdYLDRCQUE0Qjs7OzswQ0FDekIsK0JBQStCOzs7O2lDQUN4QyxzQkFBc0I7Ozs7aUNBQ3RCLHNCQUFzQjs7OzsrQkFDeEIsb0JBQW9COzs7O3FDQUNkLDBCQUEwQjs7OztvQ0FDM0IseUJBQXlCOzs7O2lDQUM1QixzQkFBc0I7Ozs7Z0NBQ3ZCLHFCQUFxQjs7OztrQ0FDbkIsdUJBQXVCOzs7O21DQUN0Qix3QkFBd0I7Ozs7MkJBQ2hDLGdCQUFnQjs7OzsrQkFDWixvQkFBb0I7Ozs7cUJBRTFCOztBQUViLE9BQUsseUJBQUE7QUFDTCxjQUFZLEVBQUUsd0JBQU0sWUFBWTs7O0FBR2hDLFFBQU0seUJBQUE7QUFDTixTQUFPLDBCQUFBO0FBQ1AsU0FBTywwQkFBQTtBQUNQLGdCQUFjLGlDQUFBO0FBQ2QsUUFBTSx5QkFBQTtBQUNOLFdBQVMsNEJBQUE7OztBQUdULFlBQVUsK0JBQUE7QUFDVixjQUFZLGlDQUFBOztBQUVaLFNBQU8sRUFBRTtBQUNQLG9CQUFnQixzQ0FBQTtBQUNoQix1QkFBbUIseUNBQUE7QUFDbkIsY0FBVSxnQ0FBQTtBQUNWLGNBQVUsZ0NBQUE7QUFDVixZQUFRLDhCQUFBO0FBQ1Isa0JBQWMsb0NBQUE7QUFDZCxpQkFBYSxtQ0FBQTtBQUNiLGNBQVUsZ0NBQUE7QUFDVixhQUFTLCtCQUFBO0FBQ1QsZUFBVyxpQ0FBQTtBQUNYLGdCQUFZLGtDQUFBO0FBQ1osUUFBSSwwQkFBQTtBQUNKLFlBQVEsOEJBQUE7R0FDVDtDQUNGIiwiZmlsZSI6Ii9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9jbGllbnQvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXVkaW8gZnJvbSAnd2F2ZXMtYXVkaW8nO1xuXG4vLyBjb3JlXG5pbXBvcnQgY2xpZW50IGZyb20gJy4vY29yZS9jbGllbnQnO1xuaW1wb3J0IFByb2Nlc3MgZnJvbSAnLi9jb3JlL1Byb2Nlc3MnO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgU2lnbmFsIGZyb20gJy4vY29yZS9TaWduYWwnO1xuaW1wb3J0IFNpZ25hbEFsbCBmcm9tICcuL2NvcmUvU2lnbmFsQWxsJztcblxuLy8gc2NlbmVzXG5pbXBvcnQgRXhwZXJpZW5jZSBmcm9tICcuL3NjZW5lcy9FeHBlcmllbmNlJztcbmltcG9ydCBDbGllbnRTdXJ2ZXkgZnJvbSAnLi9zY2VuZXMvQ2xpZW50U3VydmV5JztcblxuLy8gc2VydmljZXNcbmltcG9ydCBDbGllbnRDaGVja2luIGZyb20gJy4vc2VydmljZXMvQ2xpZW50Q2hlY2tpbic7XG4vLyBpbXBvcnQgQ2xpZW50RmlsZUxpc3QgZnJvbSAnLi9DbGllbnRGaWxlTGlzdCc7XG5pbXBvcnQgQ2xpZW50RXJyb3JSZXBvcnRlciBmcm9tICcuL3NlcnZpY2VzL0NsaWVudEVycm9yUmVwb3J0ZXInO1xuaW1wb3J0IENsaWVudExvY2F0b3IgZnJvbSAnLi9zZXJ2aWNlcy9DbGllbnRMb2NhdG9yJztcbmltcG9ydCBDbGllbnROZXR3b3JrIGZyb20gJy4vc2VydmljZXMvQ2xpZW50TmV0d29yayc7XG5pbXBvcnQgQ2xpZW50UGxhY2VyIGZyb20gJy4vc2VydmljZXMvQ2xpZW50UGxhY2VyJztcbmltcG9ydCBDbGllbnRTaGFyZWRDb25maWcgZnJvbSAnLi9zZXJ2aWNlcy9DbGllbnRTaGFyZWRDb25maWcnO1xuaW1wb3J0IENsaWVudFNoYXJlZFBhcmFtcyBmcm9tICcuL3NlcnZpY2VzL0NsaWVudFNoYXJlZFBhcmFtcyc7XG5pbXBvcnQgQ2xpZW50U3luYyBmcm9tICcuL3NlcnZpY2VzL0NsaWVudFN5bmMnO1xuaW1wb3J0IExvYWRlciBmcm9tICcuL3NlcnZpY2VzL0xvYWRlcic7XG5pbXBvcnQgTW90aW9uSW5wdXQgZnJvbSAnLi9zZXJ2aWNlcy9Nb3Rpb25JbnB1dCc7XG5pbXBvcnQgU2NoZWR1bGVyIGZyb20gJy4vc2VydmljZXMvU2NoZWR1bGVyJztcbi8vIGltcG9ydCBPcmllbnRhdGlvbiBmcm9tICcuL09yaWVudGF0aW9uJztcbmltcG9ydCBXZWxjb21lIGZyb20gJy4vc2VydmljZXMvV2VsY29tZSc7XG5cbi8vIHZpZXdzXG5pbXBvcnQgZGVmYXVsdFRlbXBsYXRlcyBmcm9tICcuL2Rpc3BsYXkvZGVmYXVsdFRlbXBsYXRlcyc7XG5pbXBvcnQgZGVmYXVsdFRleHRDb250ZW50cyBmcm9tICcuL2Rpc3BsYXkvZGVmYXVsdFRleHRDb250ZW50cyc7XG5pbXBvcnQgQnV0dG9uVmlldyBmcm9tICcuL2Rpc3BsYXkvQnV0dG9uVmlldyc7XG5pbXBvcnQgQ2FudmFzVmlldyBmcm9tICcuL2Rpc3BsYXkvQ2FudmFzVmlldyc7XG5pbXBvcnQgUmVuZGVyZXIgZnJvbSAnLi9kaXNwbGF5L1JlbmRlcmVyJztcbmltcG9ydCBSZW5kZXJpbmdHcm91cCBmcm9tICcuL2Rpc3BsYXkvUmVuZGVyaW5nR3JvdXAnO1xuaW1wb3J0IFNlZ21lbnRlZFZpZXcgZnJvbSAnLi9kaXNwbGF5L1NlZ21lbnRlZFZpZXcnO1xuaW1wb3J0IFNlbGVjdFZpZXcgZnJvbSAnLi9kaXNwbGF5L1NlbGVjdFZpZXcnO1xuaW1wb3J0IFNwYWNlVmlldyBmcm9tICcuL2Rpc3BsYXkvU3BhY2VWaWV3JztcbmltcG9ydCBTcXVhcmVkVmlldyBmcm9tICcuL2Rpc3BsYXkvU3F1YXJlZFZpZXcnO1xuaW1wb3J0IFRvdWNoU3VyZmFjZSBmcm9tICcuL2Rpc3BsYXkvVG91Y2hTdXJmYWNlJztcbmltcG9ydCBWaWV3IGZyb20gJy4vZGlzcGxheS9WaWV3JztcbmltcG9ydCB2aWV3cG9ydCBmcm9tICcuL2Rpc3BsYXkvdmlld3BvcnQnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qIGV4dGVybmFsICovXG4gIGF1ZGlvLFxuICBhdWRpb0NvbnRleHQ6IGF1ZGlvLmF1ZGlvQ29udGV4dCxcblxuICAvKiBjb3JlICovXG4gIGNsaWVudCxcbiAgUHJvY2VzcyxcbiAgU2VydmljZSxcbiAgc2VydmljZU1hbmFnZXIsXG4gIFNpZ25hbCxcbiAgU2lnbmFsQWxsLFxuXG4gIC8qIHNjZW5lcyAqL1xuICBFeHBlcmllbmNlLFxuICBDbGllbnRTdXJ2ZXksXG5cbiAgZGlzcGxheToge1xuICAgIGRlZmF1bHRUZW1wbGF0ZXMsXG4gICAgZGVmYXVsdFRleHRDb250ZW50cyxcbiAgICBCdXR0b25WaWV3LFxuICAgIENhbnZhc1ZpZXcsXG4gICAgUmVuZGVyZXIsXG4gICAgUmVuZGVyaW5nR3JvdXAsXG4gICAgU2VnbWVudGVkVmlldyxcbiAgICBTZWxlY3RWaWV3LFxuICAgIFNwYWNlVmlldyxcbiAgICBTcXVhcmVkVmlldyxcbiAgICBUb3VjaFN1cmZhY2UsXG4gICAgVmlldyxcbiAgICB2aWV3cG9ydCxcbiAgfSxcbn07XG4iXX0=