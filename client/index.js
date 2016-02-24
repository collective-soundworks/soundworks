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
    View: _displayView2['default']
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OzBCQUFrQixhQUFhOzs7Ozs7MEJBR1osZUFBZTs7OzsyQkFDZCxnQkFBZ0I7Ozs7MkJBQ2hCLGdCQUFnQjs7OztrQ0FDVCx1QkFBdUI7Ozs7MEJBQy9CLGVBQWU7Ozs7NkJBQ1osa0JBQWtCOzs7Ozs7Z0NBR2pCLHFCQUFxQjs7OztrQ0FDbkIsdUJBQXVCOzs7Ozs7cUNBR3RCLDBCQUEwQjs7Ozs7OzJDQUVwQixnQ0FBZ0M7Ozs7cUNBQ3RDLDBCQUEwQjs7OztxQ0FDMUIsMEJBQTBCOzs7O29DQUMzQix5QkFBeUI7Ozs7MENBQ25CLCtCQUErQjs7OzswQ0FDL0IsK0JBQStCOzs7O2tDQUN2Qyx1QkFBdUI7Ozs7OEJBQzNCLG1CQUFtQjs7OzttQ0FDZCx3QkFBd0I7Ozs7OzsrQkFFNUIsb0JBQW9COzs7Ozs7dUNBR1gsNEJBQTRCOzs7OzBDQUN6QiwrQkFBK0I7Ozs7aUNBQ3hDLHNCQUFzQjs7OztpQ0FDdEIsc0JBQXNCOzs7OytCQUN4QixvQkFBb0I7Ozs7cUNBQ2QsMEJBQTBCOzs7O29DQUMzQix5QkFBeUI7Ozs7aUNBQzVCLHNCQUFzQjs7OztnQ0FDdkIscUJBQXFCOzs7O2tDQUNuQix1QkFBdUI7Ozs7bUNBQ3RCLHdCQUF3Qjs7OzsyQkFDaEMsZ0JBQWdCOzs7O3FCQUVsQjs7QUFFYixPQUFLLHlCQUFBO0FBQ0wsY0FBWSxFQUFFLHdCQUFNLFlBQVk7OztBQUdoQyxRQUFNLHlCQUFBO0FBQ04sU0FBTywwQkFBQTtBQUNQLFNBQU8sMEJBQUE7QUFDUCxnQkFBYyxpQ0FBQTtBQUNkLFFBQU0seUJBQUE7QUFDTixXQUFTLDRCQUFBOzs7QUFHVCxZQUFVLCtCQUFBO0FBQ1YsY0FBWSxpQ0FBQTs7QUFFWixTQUFPLEVBQUU7QUFDUCxvQkFBZ0Isc0NBQUE7QUFDaEIsdUJBQW1CLHlDQUFBO0FBQ25CLGNBQVUsZ0NBQUE7QUFDVixjQUFVLGdDQUFBO0FBQ1YsWUFBUSw4QkFBQTtBQUNSLGtCQUFjLG9DQUFBO0FBQ2QsaUJBQWEsbUNBQUE7QUFDYixjQUFVLGdDQUFBO0FBQ1YsYUFBUywrQkFBQTtBQUNULGVBQVcsaUNBQUE7QUFDWCxnQkFBWSxrQ0FBQTtBQUNaLFFBQUksMEJBQUE7R0FDTDtDQUNGIiwiZmlsZSI6Ii9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGF1ZGlvIGZyb20gJ3dhdmVzLWF1ZGlvJztcblxuLy8gY29yZVxuaW1wb3J0IGNsaWVudCBmcm9tICcuL2NvcmUvY2xpZW50JztcbmltcG9ydCBQcm9jZXNzIGZyb20gJy4vY29yZS9Qcm9jZXNzJztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuL2NvcmUvc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IFNpZ25hbCBmcm9tICcuL2NvcmUvU2lnbmFsJztcbmltcG9ydCBTaWduYWxBbGwgZnJvbSAnLi9jb3JlL1NpZ25hbEFsbCc7XG5cbi8vIHNjZW5lc1xuaW1wb3J0IEV4cGVyaWVuY2UgZnJvbSAnLi9zY2VuZXMvRXhwZXJpZW5jZSc7XG5pbXBvcnQgQ2xpZW50U3VydmV5IGZyb20gJy4vc2NlbmVzL0NsaWVudFN1cnZleSc7XG5cbi8vIHNlcnZpY2VzXG5pbXBvcnQgQ2xpZW50Q2hlY2tpbiBmcm9tICcuL3NlcnZpY2VzL0NsaWVudENoZWNraW4nO1xuLy8gaW1wb3J0IENsaWVudEZpbGVMaXN0IGZyb20gJy4vQ2xpZW50RmlsZUxpc3QnO1xuaW1wb3J0IENsaWVudEVycm9yUmVwb3J0ZXIgZnJvbSAnLi9zZXJ2aWNlcy9DbGllbnRFcnJvclJlcG9ydGVyJztcbmltcG9ydCBDbGllbnRMb2NhdG9yIGZyb20gJy4vc2VydmljZXMvQ2xpZW50TG9jYXRvcic7XG5pbXBvcnQgQ2xpZW50TmV0d29yayBmcm9tICcuL3NlcnZpY2VzL0NsaWVudE5ldHdvcmsnO1xuaW1wb3J0IENsaWVudFBsYWNlciBmcm9tICcuL3NlcnZpY2VzL0NsaWVudFBsYWNlcic7XG5pbXBvcnQgQ2xpZW50U2hhcmVkQ29uZmlnIGZyb20gJy4vc2VydmljZXMvQ2xpZW50U2hhcmVkQ29uZmlnJztcbmltcG9ydCBDbGllbnRTaGFyZWRQYXJhbXMgZnJvbSAnLi9zZXJ2aWNlcy9DbGllbnRTaGFyZWRQYXJhbXMnO1xuaW1wb3J0IENsaWVudFN5bmMgZnJvbSAnLi9zZXJ2aWNlcy9DbGllbnRTeW5jJztcbmltcG9ydCBMb2FkZXIgZnJvbSAnLi9zZXJ2aWNlcy9Mb2FkZXInO1xuaW1wb3J0IE1vdGlvbklucHV0IGZyb20gJy4vc2VydmljZXMvTW90aW9uSW5wdXQnO1xuLy8gaW1wb3J0IE9yaWVudGF0aW9uIGZyb20gJy4vT3JpZW50YXRpb24nO1xuaW1wb3J0IFdlbGNvbWUgZnJvbSAnLi9zZXJ2aWNlcy9XZWxjb21lJztcblxuLy8gdmlld3NcbmltcG9ydCBkZWZhdWx0VGVtcGxhdGVzIGZyb20gJy4vZGlzcGxheS9kZWZhdWx0VGVtcGxhdGVzJztcbmltcG9ydCBkZWZhdWx0VGV4dENvbnRlbnRzIGZyb20gJy4vZGlzcGxheS9kZWZhdWx0VGV4dENvbnRlbnRzJztcbmltcG9ydCBCdXR0b25WaWV3IGZyb20gJy4vZGlzcGxheS9CdXR0b25WaWV3JztcbmltcG9ydCBDYW52YXNWaWV3IGZyb20gJy4vZGlzcGxheS9DYW52YXNWaWV3JztcbmltcG9ydCBSZW5kZXJlciBmcm9tICcuL2Rpc3BsYXkvUmVuZGVyZXInO1xuaW1wb3J0IFJlbmRlcmluZ0dyb3VwIGZyb20gJy4vZGlzcGxheS9SZW5kZXJpbmdHcm91cCc7XG5pbXBvcnQgU2VnbWVudGVkVmlldyBmcm9tICcuL2Rpc3BsYXkvU2VnbWVudGVkVmlldyc7XG5pbXBvcnQgU2VsZWN0VmlldyBmcm9tICcuL2Rpc3BsYXkvU2VsZWN0Vmlldyc7XG5pbXBvcnQgU3BhY2VWaWV3IGZyb20gJy4vZGlzcGxheS9TcGFjZVZpZXcnO1xuaW1wb3J0IFNxdWFyZWRWaWV3IGZyb20gJy4vZGlzcGxheS9TcXVhcmVkVmlldyc7XG5pbXBvcnQgVG91Y2hTdXJmYWNlIGZyb20gJy4vZGlzcGxheS9Ub3VjaFN1cmZhY2UnO1xuaW1wb3J0IFZpZXcgZnJvbSAnLi9kaXNwbGF5L1ZpZXcnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qIGV4dGVybmFsICovXG4gIGF1ZGlvLFxuICBhdWRpb0NvbnRleHQ6IGF1ZGlvLmF1ZGlvQ29udGV4dCxcblxuICAvKiBjb3JlICovXG4gIGNsaWVudCxcbiAgUHJvY2VzcyxcbiAgU2VydmljZSxcbiAgc2VydmljZU1hbmFnZXIsXG4gIFNpZ25hbCxcbiAgU2lnbmFsQWxsLFxuXG4gIC8qIHNjZW5lcyAqL1xuICBFeHBlcmllbmNlLFxuICBDbGllbnRTdXJ2ZXksXG5cbiAgZGlzcGxheToge1xuICAgIGRlZmF1bHRUZW1wbGF0ZXMsXG4gICAgZGVmYXVsdFRleHRDb250ZW50cyxcbiAgICBCdXR0b25WaWV3LFxuICAgIENhbnZhc1ZpZXcsXG4gICAgUmVuZGVyZXIsXG4gICAgUmVuZGVyaW5nR3JvdXAsXG4gICAgU2VnbWVudGVkVmlldyxcbiAgICBTZWxlY3RWaWV3LFxuICAgIFNwYWNlVmlldyxcbiAgICBTcXVhcmVkVmlldyxcbiAgICBUb3VjaFN1cmZhY2UsXG4gICAgVmlldyxcbiAgfSxcbn07XG4iXX0=