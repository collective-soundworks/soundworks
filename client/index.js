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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OzBCQUFrQixhQUFhOzs7Ozs7MEJBR1osZUFBZTs7OzsyQkFDZCxnQkFBZ0I7Ozs7MkJBQ2hCLGdCQUFnQjs7OztrQ0FDVCx1QkFBdUI7Ozs7MEJBQy9CLGVBQWU7Ozs7NkJBQ1osa0JBQWtCOzs7Ozs7Z0NBR2pCLHFCQUFxQjs7OztrQ0FDbkIsdUJBQXVCOzs7Ozs7cUNBR3RCLDBCQUEwQjs7Ozs7OzJDQUVwQixnQ0FBZ0M7Ozs7cUNBQ3RDLDBCQUEwQjs7OztxQ0FDMUIsMEJBQTBCOzs7O29DQUMzQix5QkFBeUI7Ozs7MENBQ25CLCtCQUErQjs7OzswQ0FDL0IsK0JBQStCOzs7O2tDQUN2Qyx1QkFBdUI7Ozs7OEJBQzNCLG1CQUFtQjs7OzttQ0FDZCx3QkFBd0I7Ozs7OzsrQkFFNUIsb0JBQW9COzs7Ozs7dUNBR1gsNEJBQTRCOzs7OzBDQUN6QiwrQkFBK0I7Ozs7aUNBQ3hDLHNCQUFzQjs7OztpQ0FDdEIsc0JBQXNCOzs7OytCQUN4QixvQkFBb0I7Ozs7cUNBQ2QsMEJBQTBCOzs7O29DQUMzQix5QkFBeUI7Ozs7aUNBQzVCLHNCQUFzQjs7OztnQ0FDdkIscUJBQXFCOzs7O2tDQUNuQix1QkFBdUI7Ozs7bUNBQ3RCLHdCQUF3Qjs7OzsyQkFDaEMsZ0JBQWdCOzs7OytCQUNaLG9CQUFvQjs7OztxQkFFMUI7O0FBRWIsT0FBSyx5QkFBQTtBQUNMLGNBQVksRUFBRSx3QkFBTSxZQUFZOzs7QUFHaEMsUUFBTSx5QkFBQTtBQUNOLFNBQU8sMEJBQUE7QUFDUCxTQUFPLDBCQUFBO0FBQ1AsZ0JBQWMsaUNBQUE7QUFDZCxRQUFNLHlCQUFBO0FBQ04sV0FBUyw0QkFBQTs7O0FBR1QsWUFBVSwrQkFBQTtBQUNWLGNBQVksaUNBQUE7O0FBRVosU0FBTyxFQUFFO0FBQ1Asb0JBQWdCLHNDQUFBO0FBQ2hCLHVCQUFtQix5Q0FBQTtBQUNuQixjQUFVLGdDQUFBO0FBQ1YsY0FBVSxnQ0FBQTtBQUNWLFlBQVEsOEJBQUE7QUFDUixrQkFBYyxvQ0FBQTtBQUNkLGlCQUFhLG1DQUFBO0FBQ2IsY0FBVSxnQ0FBQTtBQUNWLGFBQVMsK0JBQUE7QUFDVCxlQUFXLGlDQUFBO0FBQ1gsZ0JBQVksa0NBQUE7QUFDWixRQUFJLDBCQUFBO0FBQ0osWUFBUSw4QkFBQTtHQUNUO0NBQ0YiLCJmaWxlIjoiL1VzZXJzL3NjaG5lbGwvRGV2ZWxvcG1lbnQvd2ViL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zb3VuZHdvcmtzL3NyYy9jbGllbnQvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXVkaW8gZnJvbSAnd2F2ZXMtYXVkaW8nO1xuXG4vLyBjb3JlXG5pbXBvcnQgY2xpZW50IGZyb20gJy4vY29yZS9jbGllbnQnO1xuaW1wb3J0IFByb2Nlc3MgZnJvbSAnLi9jb3JlL1Byb2Nlc3MnO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgU2lnbmFsIGZyb20gJy4vY29yZS9TaWduYWwnO1xuaW1wb3J0IFNpZ25hbEFsbCBmcm9tICcuL2NvcmUvU2lnbmFsQWxsJztcblxuLy8gc2NlbmVzXG5pbXBvcnQgRXhwZXJpZW5jZSBmcm9tICcuL3NjZW5lcy9FeHBlcmllbmNlJztcbmltcG9ydCBDbGllbnRTdXJ2ZXkgZnJvbSAnLi9zY2VuZXMvQ2xpZW50U3VydmV5JztcblxuLy8gc2VydmljZXNcbmltcG9ydCBDbGllbnRDaGVja2luIGZyb20gJy4vc2VydmljZXMvQ2xpZW50Q2hlY2tpbic7XG4vLyBpbXBvcnQgQ2xpZW50RmlsZUxpc3QgZnJvbSAnLi9DbGllbnRGaWxlTGlzdCc7XG5pbXBvcnQgQ2xpZW50RXJyb3JSZXBvcnRlciBmcm9tICcuL3NlcnZpY2VzL0NsaWVudEVycm9yUmVwb3J0ZXInO1xuaW1wb3J0IENsaWVudExvY2F0b3IgZnJvbSAnLi9zZXJ2aWNlcy9DbGllbnRMb2NhdG9yJztcbmltcG9ydCBDbGllbnROZXR3b3JrIGZyb20gJy4vc2VydmljZXMvQ2xpZW50TmV0d29yayc7XG5pbXBvcnQgQ2xpZW50UGxhY2VyIGZyb20gJy4vc2VydmljZXMvQ2xpZW50UGxhY2VyJztcbmltcG9ydCBDbGllbnRTaGFyZWRDb25maWcgZnJvbSAnLi9zZXJ2aWNlcy9DbGllbnRTaGFyZWRDb25maWcnO1xuaW1wb3J0IENsaWVudFNoYXJlZFBhcmFtcyBmcm9tICcuL3NlcnZpY2VzL0NsaWVudFNoYXJlZFBhcmFtcyc7XG5pbXBvcnQgQ2xpZW50U3luYyBmcm9tICcuL3NlcnZpY2VzL0NsaWVudFN5bmMnO1xuaW1wb3J0IExvYWRlciBmcm9tICcuL3NlcnZpY2VzL0xvYWRlcic7XG5pbXBvcnQgTW90aW9uSW5wdXQgZnJvbSAnLi9zZXJ2aWNlcy9Nb3Rpb25JbnB1dCc7XG4vLyBpbXBvcnQgT3JpZW50YXRpb24gZnJvbSAnLi9PcmllbnRhdGlvbic7XG5pbXBvcnQgV2VsY29tZSBmcm9tICcuL3NlcnZpY2VzL1dlbGNvbWUnO1xuXG4vLyB2aWV3c1xuaW1wb3J0IGRlZmF1bHRUZW1wbGF0ZXMgZnJvbSAnLi9kaXNwbGF5L2RlZmF1bHRUZW1wbGF0ZXMnO1xuaW1wb3J0IGRlZmF1bHRUZXh0Q29udGVudHMgZnJvbSAnLi9kaXNwbGF5L2RlZmF1bHRUZXh0Q29udGVudHMnO1xuaW1wb3J0IEJ1dHRvblZpZXcgZnJvbSAnLi9kaXNwbGF5L0J1dHRvblZpZXcnO1xuaW1wb3J0IENhbnZhc1ZpZXcgZnJvbSAnLi9kaXNwbGF5L0NhbnZhc1ZpZXcnO1xuaW1wb3J0IFJlbmRlcmVyIGZyb20gJy4vZGlzcGxheS9SZW5kZXJlcic7XG5pbXBvcnQgUmVuZGVyaW5nR3JvdXAgZnJvbSAnLi9kaXNwbGF5L1JlbmRlcmluZ0dyb3VwJztcbmltcG9ydCBTZWdtZW50ZWRWaWV3IGZyb20gJy4vZGlzcGxheS9TZWdtZW50ZWRWaWV3JztcbmltcG9ydCBTZWxlY3RWaWV3IGZyb20gJy4vZGlzcGxheS9TZWxlY3RWaWV3JztcbmltcG9ydCBTcGFjZVZpZXcgZnJvbSAnLi9kaXNwbGF5L1NwYWNlVmlldyc7XG5pbXBvcnQgU3F1YXJlZFZpZXcgZnJvbSAnLi9kaXNwbGF5L1NxdWFyZWRWaWV3JztcbmltcG9ydCBUb3VjaFN1cmZhY2UgZnJvbSAnLi9kaXNwbGF5L1RvdWNoU3VyZmFjZSc7XG5pbXBvcnQgVmlldyBmcm9tICcuL2Rpc3BsYXkvVmlldyc7XG5pbXBvcnQgdmlld3BvcnQgZnJvbSAnLi9kaXNwbGF5L3ZpZXdwb3J0JztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAvKiBleHRlcm5hbCAqL1xuICBhdWRpbyxcbiAgYXVkaW9Db250ZXh0OiBhdWRpby5hdWRpb0NvbnRleHQsXG5cbiAgLyogY29yZSAqL1xuICBjbGllbnQsXG4gIFByb2Nlc3MsXG4gIFNlcnZpY2UsXG4gIHNlcnZpY2VNYW5hZ2VyLFxuICBTaWduYWwsXG4gIFNpZ25hbEFsbCxcblxuICAvKiBzY2VuZXMgKi9cbiAgRXhwZXJpZW5jZSxcbiAgQ2xpZW50U3VydmV5LFxuXG4gIGRpc3BsYXk6IHtcbiAgICBkZWZhdWx0VGVtcGxhdGVzLFxuICAgIGRlZmF1bHRUZXh0Q29udGVudHMsXG4gICAgQnV0dG9uVmlldyxcbiAgICBDYW52YXNWaWV3LFxuICAgIFJlbmRlcmVyLFxuICAgIFJlbmRlcmluZ0dyb3VwLFxuICAgIFNlZ21lbnRlZFZpZXcsXG4gICAgU2VsZWN0VmlldyxcbiAgICBTcGFjZVZpZXcsXG4gICAgU3F1YXJlZFZpZXcsXG4gICAgVG91Y2hTdXJmYWNlLFxuICAgIFZpZXcsXG4gICAgdmlld3BvcnQsXG4gIH0sXG59O1xuIl19