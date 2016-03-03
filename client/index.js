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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OzBCQUFrQixhQUFhOzs7Ozs7MEJBR1osZUFBZTs7OzsyQkFDZCxnQkFBZ0I7Ozs7MkJBQ2hCLGdCQUFnQjs7OztrQ0FDVCx1QkFBdUI7Ozs7MEJBQy9CLGVBQWU7Ozs7NkJBQ1osa0JBQWtCOzs7Ozs7Z0NBR2pCLHFCQUFxQjs7OztrQ0FDbkIsdUJBQXVCOzs7Ozs7cUNBR3RCLDBCQUEwQjs7Ozs7OzJDQUVwQixnQ0FBZ0M7Ozs7cUNBQ3RDLDBCQUEwQjs7OztxQ0FDMUIsMEJBQTBCOzs7O29DQUMzQix5QkFBeUI7Ozs7MENBQ25CLCtCQUErQjs7OzswQ0FDL0IsK0JBQStCOzs7O2tDQUN2Qyx1QkFBdUI7Ozs7OEJBQzNCLG1CQUFtQjs7OzttQ0FDZCx3QkFBd0I7Ozs7aUNBQzFCLHNCQUFzQjs7Ozs7OytCQUV4QixvQkFBb0I7Ozs7Ozt1Q0FHWCw0QkFBNEI7Ozs7MENBQ3pCLCtCQUErQjs7OztpQ0FDeEMsc0JBQXNCOzs7O2lDQUN0QixzQkFBc0I7Ozs7K0JBQ3hCLG9CQUFvQjs7OztxQ0FDZCwwQkFBMEI7Ozs7b0NBQzNCLHlCQUF5Qjs7OztpQ0FDNUIsc0JBQXNCOzs7O2dDQUN2QixxQkFBcUI7Ozs7a0NBQ25CLHVCQUF1Qjs7OzttQ0FDdEIsd0JBQXdCOzs7OzJCQUNoQyxnQkFBZ0I7Ozs7K0JBQ1osb0JBQW9COzs7O3FCQUUxQjs7QUFFYixPQUFLLHlCQUFBO0FBQ0wsY0FBWSxFQUFFLHdCQUFNLFlBQVk7OztBQUdoQyxRQUFNLHlCQUFBO0FBQ04sU0FBTywwQkFBQTtBQUNQLFNBQU8sMEJBQUE7QUFDUCxnQkFBYyxpQ0FBQTtBQUNkLFFBQU0seUJBQUE7QUFDTixXQUFTLDRCQUFBOzs7QUFHVCxZQUFVLCtCQUFBO0FBQ1YsY0FBWSxpQ0FBQTs7QUFFWixTQUFPLEVBQUU7QUFDUCxvQkFBZ0Isc0NBQUE7QUFDaEIsdUJBQW1CLHlDQUFBO0FBQ25CLGNBQVUsZ0NBQUE7QUFDVixjQUFVLGdDQUFBO0FBQ1YsWUFBUSw4QkFBQTtBQUNSLGtCQUFjLG9DQUFBO0FBQ2QsaUJBQWEsbUNBQUE7QUFDYixjQUFVLGdDQUFBO0FBQ1YsYUFBUywrQkFBQTtBQUNULGVBQVcsaUNBQUE7QUFDWCxnQkFBWSxrQ0FBQTtBQUNaLFFBQUksMEJBQUE7QUFDSixZQUFRLDhCQUFBO0dBQ1Q7Q0FDRiIsImZpbGUiOiIvVXNlcnMvc2NobmVsbC9EZXZlbG9wbWVudC93ZWIvY29sbGVjdGl2ZS1zb3VuZHdvcmtzL3NvdW5kd29ya3Mvc3JjL2NsaWVudC9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBhdWRpbyBmcm9tICd3YXZlcy1hdWRpbyc7XG5cbi8vIGNvcmVcbmltcG9ydCBjbGllbnQgZnJvbSAnLi9jb3JlL2NsaWVudCc7XG5pbXBvcnQgUHJvY2VzcyBmcm9tICcuL2NvcmUvUHJvY2Vzcyc7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBTaWduYWwgZnJvbSAnLi9jb3JlL1NpZ25hbCc7XG5pbXBvcnQgU2lnbmFsQWxsIGZyb20gJy4vY29yZS9TaWduYWxBbGwnO1xuXG4vLyBzY2VuZXNcbmltcG9ydCBFeHBlcmllbmNlIGZyb20gJy4vc2NlbmVzL0V4cGVyaWVuY2UnO1xuaW1wb3J0IENsaWVudFN1cnZleSBmcm9tICcuL3NjZW5lcy9DbGllbnRTdXJ2ZXknO1xuXG4vLyBzZXJ2aWNlc1xuaW1wb3J0IENsaWVudENoZWNraW4gZnJvbSAnLi9zZXJ2aWNlcy9DbGllbnRDaGVja2luJztcbi8vIGltcG9ydCBDbGllbnRGaWxlTGlzdCBmcm9tICcuL0NsaWVudEZpbGVMaXN0JztcbmltcG9ydCBDbGllbnRFcnJvclJlcG9ydGVyIGZyb20gJy4vc2VydmljZXMvQ2xpZW50RXJyb3JSZXBvcnRlcic7XG5pbXBvcnQgQ2xpZW50TG9jYXRvciBmcm9tICcuL3NlcnZpY2VzL0NsaWVudExvY2F0b3InO1xuaW1wb3J0IENsaWVudE5ldHdvcmsgZnJvbSAnLi9zZXJ2aWNlcy9DbGllbnROZXR3b3JrJztcbmltcG9ydCBDbGllbnRQbGFjZXIgZnJvbSAnLi9zZXJ2aWNlcy9DbGllbnRQbGFjZXInO1xuaW1wb3J0IENsaWVudFNoYXJlZENvbmZpZyBmcm9tICcuL3NlcnZpY2VzL0NsaWVudFNoYXJlZENvbmZpZyc7XG5pbXBvcnQgQ2xpZW50U2hhcmVkUGFyYW1zIGZyb20gJy4vc2VydmljZXMvQ2xpZW50U2hhcmVkUGFyYW1zJztcbmltcG9ydCBDbGllbnRTeW5jIGZyb20gJy4vc2VydmljZXMvQ2xpZW50U3luYyc7XG5pbXBvcnQgTG9hZGVyIGZyb20gJy4vc2VydmljZXMvTG9hZGVyJztcbmltcG9ydCBNb3Rpb25JbnB1dCBmcm9tICcuL3NlcnZpY2VzL01vdGlvbklucHV0JztcbmltcG9ydCBTY2hlZHVsZXIgZnJvbSAnLi9zZXJ2aWNlcy9TY2hlZHVsZXInO1xuLy8gaW1wb3J0IE9yaWVudGF0aW9uIGZyb20gJy4vT3JpZW50YXRpb24nO1xuaW1wb3J0IFdlbGNvbWUgZnJvbSAnLi9zZXJ2aWNlcy9XZWxjb21lJztcblxuLy8gdmlld3NcbmltcG9ydCBkZWZhdWx0VGVtcGxhdGVzIGZyb20gJy4vZGlzcGxheS9kZWZhdWx0VGVtcGxhdGVzJztcbmltcG9ydCBkZWZhdWx0VGV4dENvbnRlbnRzIGZyb20gJy4vZGlzcGxheS9kZWZhdWx0VGV4dENvbnRlbnRzJztcbmltcG9ydCBCdXR0b25WaWV3IGZyb20gJy4vZGlzcGxheS9CdXR0b25WaWV3JztcbmltcG9ydCBDYW52YXNWaWV3IGZyb20gJy4vZGlzcGxheS9DYW52YXNWaWV3JztcbmltcG9ydCBSZW5kZXJlciBmcm9tICcuL2Rpc3BsYXkvUmVuZGVyZXInO1xuaW1wb3J0IFJlbmRlcmluZ0dyb3VwIGZyb20gJy4vZGlzcGxheS9SZW5kZXJpbmdHcm91cCc7XG5pbXBvcnQgU2VnbWVudGVkVmlldyBmcm9tICcuL2Rpc3BsYXkvU2VnbWVudGVkVmlldyc7XG5pbXBvcnQgU2VsZWN0VmlldyBmcm9tICcuL2Rpc3BsYXkvU2VsZWN0Vmlldyc7XG5pbXBvcnQgU3BhY2VWaWV3IGZyb20gJy4vZGlzcGxheS9TcGFjZVZpZXcnO1xuaW1wb3J0IFNxdWFyZWRWaWV3IGZyb20gJy4vZGlzcGxheS9TcXVhcmVkVmlldyc7XG5pbXBvcnQgVG91Y2hTdXJmYWNlIGZyb20gJy4vZGlzcGxheS9Ub3VjaFN1cmZhY2UnO1xuaW1wb3J0IFZpZXcgZnJvbSAnLi9kaXNwbGF5L1ZpZXcnO1xuaW1wb3J0IHZpZXdwb3J0IGZyb20gJy4vZGlzcGxheS92aWV3cG9ydCc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgLyogZXh0ZXJuYWwgKi9cbiAgYXVkaW8sXG4gIGF1ZGlvQ29udGV4dDogYXVkaW8uYXVkaW9Db250ZXh0LFxuXG4gIC8qIGNvcmUgKi9cbiAgY2xpZW50LFxuICBQcm9jZXNzLFxuICBTZXJ2aWNlLFxuICBzZXJ2aWNlTWFuYWdlcixcbiAgU2lnbmFsLFxuICBTaWduYWxBbGwsXG5cbiAgLyogc2NlbmVzICovXG4gIEV4cGVyaWVuY2UsXG4gIENsaWVudFN1cnZleSxcblxuICBkaXNwbGF5OiB7XG4gICAgZGVmYXVsdFRlbXBsYXRlcyxcbiAgICBkZWZhdWx0VGV4dENvbnRlbnRzLFxuICAgIEJ1dHRvblZpZXcsXG4gICAgQ2FudmFzVmlldyxcbiAgICBSZW5kZXJlcixcbiAgICBSZW5kZXJpbmdHcm91cCxcbiAgICBTZWdtZW50ZWRWaWV3LFxuICAgIFNlbGVjdFZpZXcsXG4gICAgU3BhY2VWaWV3LFxuICAgIFNxdWFyZWRWaWV3LFxuICAgIFRvdWNoU3VyZmFjZSxcbiAgICBWaWV3LFxuICAgIHZpZXdwb3J0LFxuICB9LFxufTtcbiJdfQ==