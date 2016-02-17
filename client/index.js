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

// import ClientSurvey from './ClientSurvey';

// services
// import ClientCalibration from './ClientCalibration';

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
  Service: _coreService2['default'],
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
  ClientErrorReporter: _servicesClientErrorReporter2['default'],
  // ClientFileList,
  ClientLocator: _servicesClientLocator2['default'],
  ClientNetwork: _servicesClientNetwork2['default'],
  ClientPlacer: _servicesClientPlacer2['default'],
  ClientSharedConfig: _servicesClientSharedConfig2['default'],
  ClientSharedParams: _servicesClientSharedParams2['default'],
  ClientSync: _servicesClientSync2['default'],
  Loader: _servicesLoader2['default'],
  MotionInput: _servicesMotionInput2['default'],
  // Orientation,
  Welcome: _servicesWelcome2['default'],

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
  },

  utils: {
    helpers: helpers,
    math: math,
    setup: setup
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OzswQkFBa0IsYUFBYTs7Ozs7OzBCQUdaLGVBQWU7Ozs7MkJBQ2QsZ0JBQWdCOzs7OzJCQUNoQixnQkFBZ0I7Ozs7a0NBQ1QsdUJBQXVCOzs7OzBCQUMvQixlQUFlOzs7OzZCQUNaLGtCQUFrQjs7Ozs7O2dDQUdqQixxQkFBcUI7Ozs7Ozs7OztxQ0FLbEIsMEJBQTBCOzs7Ozs7MkNBRXBCLGdDQUFnQzs7OztxQ0FDdEMsMEJBQTBCOzs7O3FDQUMxQiwwQkFBMEI7Ozs7b0NBQzNCLHlCQUF5Qjs7OzswQ0FDbkIsK0JBQStCOzs7OzBDQUMvQiwrQkFBK0I7Ozs7a0NBQ3ZDLHVCQUF1Qjs7Ozs4QkFDM0IsbUJBQW1COzs7O21DQUNkLHdCQUF3Qjs7Ozs7OytCQUU1QixvQkFBb0I7Ozs7Ozt1Q0FHWCw0QkFBNEI7Ozs7MENBQ3pCLCtCQUErQjs7OztpQ0FDeEMsc0JBQXNCOzs7O2lDQUN0QixzQkFBc0I7Ozs7K0JBQ3hCLG9CQUFvQjs7OztxQ0FDZCwwQkFBMEI7Ozs7b0NBQzNCLHlCQUF5Qjs7OztpQ0FDNUIsc0JBQXNCOzs7O2dDQUN2QixxQkFBcUI7Ozs7a0NBQ25CLHVCQUF1Qjs7OzttQ0FDdEIsd0JBQXdCOzs7OzJCQUNoQyxnQkFBZ0I7Ozs7Ozs0QkFHUixrQkFBa0I7O0lBQS9CLE9BQU87O3lCQUNHLGVBQWU7O0lBQXpCLElBQUk7OzBCQUNPLGdCQUFnQjs7SUFBM0IsS0FBSzs7cUJBRUY7O0FBRWIsT0FBSyx5QkFBQTtBQUNMLGNBQVksRUFBRSx3QkFBTSxZQUFZOztBQUVoQyxRQUFNLHlCQUFBO0FBQ04sU0FBTywwQkFBQTtBQUNQLFNBQU8sMEJBQUE7QUFDUCxnQkFBYyxpQ0FBQTtBQUNkLFFBQU0seUJBQUE7QUFDTixXQUFTLDRCQUFBOzs7QUFHVCxZQUFVLCtCQUFBOzs7Ozs7QUFNVixlQUFhLG9DQUFBO0FBQ2IscUJBQW1CLDBDQUFBOztBQUVuQixlQUFhLG9DQUFBO0FBQ2IsZUFBYSxvQ0FBQTtBQUNiLGNBQVksbUNBQUE7QUFDWixvQkFBa0IseUNBQUE7QUFDbEIsb0JBQWtCLHlDQUFBO0FBQ2xCLFlBQVUsaUNBQUE7QUFDVixRQUFNLDZCQUFBO0FBQ04sYUFBVyxrQ0FBQTs7QUFFWCxTQUFPLDhCQUFBOztBQUVQLFNBQU8sRUFBRTtBQUNQLG9CQUFnQixzQ0FBQTtBQUNoQix1QkFBbUIseUNBQUE7QUFDbkIsY0FBVSxnQ0FBQTtBQUNWLGNBQVUsZ0NBQUE7QUFDVixZQUFRLDhCQUFBO0FBQ1Isa0JBQWMsb0NBQUE7QUFDZCxpQkFBYSxtQ0FBQTtBQUNiLGNBQVUsZ0NBQUE7QUFDVixhQUFTLCtCQUFBO0FBQ1QsZUFBVyxpQ0FBQTtBQUNYLGdCQUFZLGtDQUFBO0FBQ1osUUFBSSwwQkFBQTtHQUNMOztBQUVELE9BQUssRUFBRTtBQUNMLFdBQU8sRUFBUCxPQUFPO0FBQ1AsUUFBSSxFQUFKLElBQUk7QUFDSixTQUFLLEVBQUwsS0FBSztHQUNOO0NBQ0YiLCJmaWxlIjoic3JjL2NsaWVudC9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBhdWRpbyBmcm9tICd3YXZlcy1hdWRpbyc7XG5cbi8vIGNvcmVcbmltcG9ydCBjbGllbnQgZnJvbSAnLi9jb3JlL2NsaWVudCc7XG5pbXBvcnQgUHJvY2VzcyBmcm9tICcuL2NvcmUvUHJvY2Vzcyc7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBTaWduYWwgZnJvbSAnLi9jb3JlL1NpZ25hbCc7XG5pbXBvcnQgU2lnbmFsQWxsIGZyb20gJy4vY29yZS9TaWduYWxBbGwnO1xuXG4vLyBzY2VuZXNcbmltcG9ydCBFeHBlcmllbmNlIGZyb20gJy4vc2NlbmVzL0V4cGVyaWVuY2UnO1xuLy8gaW1wb3J0IENsaWVudFN1cnZleSBmcm9tICcuL0NsaWVudFN1cnZleSc7XG5cbi8vIHNlcnZpY2VzXG4vLyBpbXBvcnQgQ2xpZW50Q2FsaWJyYXRpb24gZnJvbSAnLi9DbGllbnRDYWxpYnJhdGlvbic7XG5pbXBvcnQgQ2xpZW50Q2hlY2tpbiBmcm9tICcuL3NlcnZpY2VzL0NsaWVudENoZWNraW4nO1xuLy8gaW1wb3J0IENsaWVudEZpbGVMaXN0IGZyb20gJy4vQ2xpZW50RmlsZUxpc3QnO1xuaW1wb3J0IENsaWVudEVycm9yUmVwb3J0ZXIgZnJvbSAnLi9zZXJ2aWNlcy9DbGllbnRFcnJvclJlcG9ydGVyJztcbmltcG9ydCBDbGllbnRMb2NhdG9yIGZyb20gJy4vc2VydmljZXMvQ2xpZW50TG9jYXRvcic7XG5pbXBvcnQgQ2xpZW50TmV0d29yayBmcm9tICcuL3NlcnZpY2VzL0NsaWVudE5ldHdvcmsnO1xuaW1wb3J0IENsaWVudFBsYWNlciBmcm9tICcuL3NlcnZpY2VzL0NsaWVudFBsYWNlcic7XG5pbXBvcnQgQ2xpZW50U2hhcmVkQ29uZmlnIGZyb20gJy4vc2VydmljZXMvQ2xpZW50U2hhcmVkQ29uZmlnJztcbmltcG9ydCBDbGllbnRTaGFyZWRQYXJhbXMgZnJvbSAnLi9zZXJ2aWNlcy9DbGllbnRTaGFyZWRQYXJhbXMnO1xuaW1wb3J0IENsaWVudFN5bmMgZnJvbSAnLi9zZXJ2aWNlcy9DbGllbnRTeW5jJztcbmltcG9ydCBMb2FkZXIgZnJvbSAnLi9zZXJ2aWNlcy9Mb2FkZXInO1xuaW1wb3J0IE1vdGlvbklucHV0IGZyb20gJy4vc2VydmljZXMvTW90aW9uSW5wdXQnO1xuLy8gaW1wb3J0IE9yaWVudGF0aW9uIGZyb20gJy4vT3JpZW50YXRpb24nO1xuaW1wb3J0IFdlbGNvbWUgZnJvbSAnLi9zZXJ2aWNlcy9XZWxjb21lJztcblxuLy8gdmlld3NcbmltcG9ydCBkZWZhdWx0VGVtcGxhdGVzIGZyb20gJy4vZGlzcGxheS9kZWZhdWx0VGVtcGxhdGVzJztcbmltcG9ydCBkZWZhdWx0VGV4dENvbnRlbnRzIGZyb20gJy4vZGlzcGxheS9kZWZhdWx0VGV4dENvbnRlbnRzJztcbmltcG9ydCBCdXR0b25WaWV3IGZyb20gJy4vZGlzcGxheS9CdXR0b25WaWV3JztcbmltcG9ydCBDYW52YXNWaWV3IGZyb20gJy4vZGlzcGxheS9DYW52YXNWaWV3JztcbmltcG9ydCBSZW5kZXJlciBmcm9tICcuL2Rpc3BsYXkvUmVuZGVyZXInO1xuaW1wb3J0IFJlbmRlcmluZ0dyb3VwIGZyb20gJy4vZGlzcGxheS9SZW5kZXJpbmdHcm91cCc7XG5pbXBvcnQgU2VnbWVudGVkVmlldyBmcm9tICcuL2Rpc3BsYXkvU2VnbWVudGVkVmlldyc7XG5pbXBvcnQgU2VsZWN0VmlldyBmcm9tICcuL2Rpc3BsYXkvU2VsZWN0Vmlldyc7XG5pbXBvcnQgU3BhY2VWaWV3IGZyb20gJy4vZGlzcGxheS9TcGFjZVZpZXcnO1xuaW1wb3J0IFNxdWFyZWRWaWV3IGZyb20gJy4vZGlzcGxheS9TcXVhcmVkVmlldyc7XG5pbXBvcnQgVG91Y2hTdXJmYWNlIGZyb20gJy4vZGlzcGxheS9Ub3VjaFN1cmZhY2UnO1xuaW1wb3J0IFZpZXcgZnJvbSAnLi9kaXNwbGF5L1ZpZXcnO1xuXG4vLyB1dGlsc1xuaW1wb3J0ICogYXMgaGVscGVycyBmcm9tICcuLi91dGlscy9oZWxwZXJzJztcbmltcG9ydCAqIGFzIG1hdGggZnJvbSAnLi4vdXRpbHMvbWF0aCc7XG5pbXBvcnQgKiBhcyBzZXR1cCBmcm9tICcuLi91dGlscy9zZXR1cCc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgLyogZXh0ZXJuYWwgKi9cbiAgYXVkaW8sXG4gIGF1ZGlvQ29udGV4dDogYXVkaW8uYXVkaW9Db250ZXh0LFxuICAvKiBjb3JlICovXG4gIGNsaWVudCxcbiAgUHJvY2VzcyxcbiAgU2VydmljZSxcbiAgc2VydmljZU1hbmFnZXIsXG4gIFNpZ25hbCxcbiAgU2lnbmFsQWxsLFxuXG4gIC8qIHNjZW5lcyAqL1xuICBFeHBlcmllbmNlLFxuICAvLyBDbGllbnRTdXJ2ZXksXG5cbiAgLyogc2VydmljZXMgKi9cbiAgLy8gQHRvZG8gLSBoaWRlIGluc2lkZSBhIG5hbWVzcGFjZSA/XG4gIC8vIENsaWVudENhbGlicmF0aW9uLFxuICBDbGllbnRDaGVja2luLFxuICBDbGllbnRFcnJvclJlcG9ydGVyLFxuICAvLyBDbGllbnRGaWxlTGlzdCxcbiAgQ2xpZW50TG9jYXRvcixcbiAgQ2xpZW50TmV0d29yayxcbiAgQ2xpZW50UGxhY2VyLFxuICBDbGllbnRTaGFyZWRDb25maWcsXG4gIENsaWVudFNoYXJlZFBhcmFtcyxcbiAgQ2xpZW50U3luYyxcbiAgTG9hZGVyLFxuICBNb3Rpb25JbnB1dCxcbiAgLy8gT3JpZW50YXRpb24sXG4gIFdlbGNvbWUsXG5cbiAgZGlzcGxheToge1xuICAgIGRlZmF1bHRUZW1wbGF0ZXMsXG4gICAgZGVmYXVsdFRleHRDb250ZW50cyxcbiAgICBCdXR0b25WaWV3LFxuICAgIENhbnZhc1ZpZXcsXG4gICAgUmVuZGVyZXIsXG4gICAgUmVuZGVyaW5nR3JvdXAsXG4gICAgU2VnbWVudGVkVmlldyxcbiAgICBTZWxlY3RWaWV3LFxuICAgIFNwYWNlVmlldyxcbiAgICBTcXVhcmVkVmlldyxcbiAgICBUb3VjaFN1cmZhY2UsXG4gICAgVmlldyxcbiAgfSxcblxuICB1dGlsczoge1xuICAgIGhlbHBlcnMsXG4gICAgbWF0aCxcbiAgICBzZXR1cCxcbiAgfSxcbn07XG4iXX0=