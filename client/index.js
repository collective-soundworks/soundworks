'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _wavesAudio = require('waves-audio');

var _wavesAudio2 = _interopRequireDefault(_wavesAudio);

var _client = require('./core/client');

var _client2 = _interopRequireDefault(_client);

var _Process = require('./core/Process');

var _Process2 = _interopRequireDefault(_Process);

var _Service = require('./core/Service');

var _Service2 = _interopRequireDefault(_Service);

var _serviceManager = require('./core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _Signal = require('./core/Signal');

var _Signal2 = _interopRequireDefault(_Signal);

var _SignalAll = require('./core/SignalAll');

var _SignalAll2 = _interopRequireDefault(_SignalAll);

var _Experience = require('./scenes/Experience');

var _Experience2 = _interopRequireDefault(_Experience);

var _ClientSurvey = require('./scenes/ClientSurvey');

var _ClientSurvey2 = _interopRequireDefault(_ClientSurvey);

var _ClientCheckin = require('./services/ClientCheckin');

var _ClientCheckin2 = _interopRequireDefault(_ClientCheckin);

var _ClientErrorReporter = require('./services/ClientErrorReporter');

var _ClientErrorReporter2 = _interopRequireDefault(_ClientErrorReporter);

var _ClientLocator = require('./services/ClientLocator');

var _ClientLocator2 = _interopRequireDefault(_ClientLocator);

var _ClientNetwork = require('./services/ClientNetwork');

var _ClientNetwork2 = _interopRequireDefault(_ClientNetwork);

var _ClientPlacer = require('./services/ClientPlacer');

var _ClientPlacer2 = _interopRequireDefault(_ClientPlacer);

var _ClientSharedConfig = require('./services/ClientSharedConfig');

var _ClientSharedConfig2 = _interopRequireDefault(_ClientSharedConfig);

var _ClientSharedParams = require('./services/ClientSharedParams');

var _ClientSharedParams2 = _interopRequireDefault(_ClientSharedParams);

var _ClientSync = require('./services/ClientSync');

var _ClientSync2 = _interopRequireDefault(_ClientSync);

var _Loader = require('./services/Loader');

var _Loader2 = _interopRequireDefault(_Loader);

var _MotionInput = require('./services/MotionInput');

var _MotionInput2 = _interopRequireDefault(_MotionInput);

var _Scheduler = require('./services/Scheduler');

var _Scheduler2 = _interopRequireDefault(_Scheduler);

var _Welcome = require('./services/Welcome');

var _Welcome2 = _interopRequireDefault(_Welcome);

var _defaultTemplates = require('./display/defaultTemplates');

var _defaultTemplates2 = _interopRequireDefault(_defaultTemplates);

var _defaultTextContents = require('./display/defaultTextContents');

var _defaultTextContents2 = _interopRequireDefault(_defaultTextContents);

var _ButtonView = require('./display/ButtonView');

var _ButtonView2 = _interopRequireDefault(_ButtonView);

var _CanvasView = require('./display/CanvasView');

var _CanvasView2 = _interopRequireDefault(_CanvasView);

var _Renderer = require('./display/Renderer');

var _Renderer2 = _interopRequireDefault(_Renderer);

var _RenderingGroup = require('./display/RenderingGroup');

var _RenderingGroup2 = _interopRequireDefault(_RenderingGroup);

var _SegmentedView = require('./display/SegmentedView');

var _SegmentedView2 = _interopRequireDefault(_SegmentedView);

var _SelectView = require('./display/SelectView');

var _SelectView2 = _interopRequireDefault(_SelectView);

var _SpaceView = require('./display/SpaceView');

var _SpaceView2 = _interopRequireDefault(_SpaceView);

var _SquaredView = require('./display/SquaredView');

var _SquaredView2 = _interopRequireDefault(_SquaredView);

var _TouchSurface = require('./display/TouchSurface');

var _TouchSurface2 = _interopRequireDefault(_TouchSurface);

var _View = require('./display/View');

var _View2 = _interopRequireDefault(_View);

var _viewport = require('./display/viewport');

var _viewport2 = _interopRequireDefault(_viewport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import Orientation from './Orientation';

// import ClientFileList from './ClientFileList';
exports.default = {
  /* external */
  audio: _wavesAudio2.default,
  audioContext: _wavesAudio2.default.audioContext,

  /* core */
  client: _client2.default,
  Process: _Process2.default,
  Service: _Service2.default,
  serviceManager: _serviceManager2.default,
  Signal: _Signal2.default,
  SignalAll: _SignalAll2.default,

  /* scenes */
  Experience: _Experience2.default,
  ClientSurvey: _ClientSurvey2.default,

  display: {
    defaultTemplates: _defaultTemplates2.default,
    defaultTextContents: _defaultTextContents2.default,
    ButtonView: _ButtonView2.default,
    CanvasView: _CanvasView2.default,
    Renderer: _Renderer2.default,
    RenderingGroup: _RenderingGroup2.default,
    SegmentedView: _SegmentedView2.default,
    SelectView: _SelectView2.default,
    SpaceView: _SpaceView2.default,
    SquaredView: _SquaredView2.default,
    TouchSurface: _TouchSurface2.default,
    View: _View2.default,
    viewport: _viewport2.default
  }
};

// views


// services


// scenes


// core
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBR0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBR0E7Ozs7QUFDQTs7OztBQUdBOzs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUdBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7a0JBRWU7O0FBRWIsNkJBRmE7QUFHYixnQkFBYyxxQkFBTSxZQUFOOzs7QUFHZCwwQkFOYTtBQU9iLDRCQVBhO0FBUWIsNEJBUmE7QUFTYiwwQ0FUYTtBQVViLDBCQVZhO0FBV2IsZ0NBWGE7OztBQWNiLGtDQWRhO0FBZWIsc0NBZmE7O0FBaUJiLFdBQVM7QUFDUCxnREFETztBQUVQLHNEQUZPO0FBR1Asb0NBSE87QUFJUCxvQ0FKTztBQUtQLGdDQUxPO0FBTVAsNENBTk87QUFPUCwwQ0FQTztBQVFQLG9DQVJPO0FBU1Asa0NBVE87QUFVUCxzQ0FWTztBQVdQLHdDQVhPO0FBWVAsd0JBWk87QUFhUCxnQ0FiTztHQUFUIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGF1ZGlvIGZyb20gJ3dhdmVzLWF1ZGlvJztcblxuLy8gY29yZVxuaW1wb3J0IGNsaWVudCBmcm9tICcuL2NvcmUvY2xpZW50JztcbmltcG9ydCBQcm9jZXNzIGZyb20gJy4vY29yZS9Qcm9jZXNzJztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuL2NvcmUvc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IFNpZ25hbCBmcm9tICcuL2NvcmUvU2lnbmFsJztcbmltcG9ydCBTaWduYWxBbGwgZnJvbSAnLi9jb3JlL1NpZ25hbEFsbCc7XG5cbi8vIHNjZW5lc1xuaW1wb3J0IEV4cGVyaWVuY2UgZnJvbSAnLi9zY2VuZXMvRXhwZXJpZW5jZSc7XG5pbXBvcnQgQ2xpZW50U3VydmV5IGZyb20gJy4vc2NlbmVzL0NsaWVudFN1cnZleSc7XG5cbi8vIHNlcnZpY2VzXG5pbXBvcnQgQ2xpZW50Q2hlY2tpbiBmcm9tICcuL3NlcnZpY2VzL0NsaWVudENoZWNraW4nO1xuLy8gaW1wb3J0IENsaWVudEZpbGVMaXN0IGZyb20gJy4vQ2xpZW50RmlsZUxpc3QnO1xuaW1wb3J0IENsaWVudEVycm9yUmVwb3J0ZXIgZnJvbSAnLi9zZXJ2aWNlcy9DbGllbnRFcnJvclJlcG9ydGVyJztcbmltcG9ydCBDbGllbnRMb2NhdG9yIGZyb20gJy4vc2VydmljZXMvQ2xpZW50TG9jYXRvcic7XG5pbXBvcnQgQ2xpZW50TmV0d29yayBmcm9tICcuL3NlcnZpY2VzL0NsaWVudE5ldHdvcmsnO1xuaW1wb3J0IENsaWVudFBsYWNlciBmcm9tICcuL3NlcnZpY2VzL0NsaWVudFBsYWNlcic7XG5pbXBvcnQgQ2xpZW50U2hhcmVkQ29uZmlnIGZyb20gJy4vc2VydmljZXMvQ2xpZW50U2hhcmVkQ29uZmlnJztcbmltcG9ydCBDbGllbnRTaGFyZWRQYXJhbXMgZnJvbSAnLi9zZXJ2aWNlcy9DbGllbnRTaGFyZWRQYXJhbXMnO1xuaW1wb3J0IENsaWVudFN5bmMgZnJvbSAnLi9zZXJ2aWNlcy9DbGllbnRTeW5jJztcbmltcG9ydCBMb2FkZXIgZnJvbSAnLi9zZXJ2aWNlcy9Mb2FkZXInO1xuaW1wb3J0IE1vdGlvbklucHV0IGZyb20gJy4vc2VydmljZXMvTW90aW9uSW5wdXQnO1xuaW1wb3J0IFNjaGVkdWxlciBmcm9tICcuL3NlcnZpY2VzL1NjaGVkdWxlcic7XG4vLyBpbXBvcnQgT3JpZW50YXRpb24gZnJvbSAnLi9PcmllbnRhdGlvbic7XG5pbXBvcnQgV2VsY29tZSBmcm9tICcuL3NlcnZpY2VzL1dlbGNvbWUnO1xuXG4vLyB2aWV3c1xuaW1wb3J0IGRlZmF1bHRUZW1wbGF0ZXMgZnJvbSAnLi9kaXNwbGF5L2RlZmF1bHRUZW1wbGF0ZXMnO1xuaW1wb3J0IGRlZmF1bHRUZXh0Q29udGVudHMgZnJvbSAnLi9kaXNwbGF5L2RlZmF1bHRUZXh0Q29udGVudHMnO1xuaW1wb3J0IEJ1dHRvblZpZXcgZnJvbSAnLi9kaXNwbGF5L0J1dHRvblZpZXcnO1xuaW1wb3J0IENhbnZhc1ZpZXcgZnJvbSAnLi9kaXNwbGF5L0NhbnZhc1ZpZXcnO1xuaW1wb3J0IFJlbmRlcmVyIGZyb20gJy4vZGlzcGxheS9SZW5kZXJlcic7XG5pbXBvcnQgUmVuZGVyaW5nR3JvdXAgZnJvbSAnLi9kaXNwbGF5L1JlbmRlcmluZ0dyb3VwJztcbmltcG9ydCBTZWdtZW50ZWRWaWV3IGZyb20gJy4vZGlzcGxheS9TZWdtZW50ZWRWaWV3JztcbmltcG9ydCBTZWxlY3RWaWV3IGZyb20gJy4vZGlzcGxheS9TZWxlY3RWaWV3JztcbmltcG9ydCBTcGFjZVZpZXcgZnJvbSAnLi9kaXNwbGF5L1NwYWNlVmlldyc7XG5pbXBvcnQgU3F1YXJlZFZpZXcgZnJvbSAnLi9kaXNwbGF5L1NxdWFyZWRWaWV3JztcbmltcG9ydCBUb3VjaFN1cmZhY2UgZnJvbSAnLi9kaXNwbGF5L1RvdWNoU3VyZmFjZSc7XG5pbXBvcnQgVmlldyBmcm9tICcuL2Rpc3BsYXkvVmlldyc7XG5pbXBvcnQgdmlld3BvcnQgZnJvbSAnLi9kaXNwbGF5L3ZpZXdwb3J0JztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAvKiBleHRlcm5hbCAqL1xuICBhdWRpbyxcbiAgYXVkaW9Db250ZXh0OiBhdWRpby5hdWRpb0NvbnRleHQsXG5cbiAgLyogY29yZSAqL1xuICBjbGllbnQsXG4gIFByb2Nlc3MsXG4gIFNlcnZpY2UsXG4gIHNlcnZpY2VNYW5hZ2VyLFxuICBTaWduYWwsXG4gIFNpZ25hbEFsbCxcblxuICAvKiBzY2VuZXMgKi9cbiAgRXhwZXJpZW5jZSxcbiAgQ2xpZW50U3VydmV5LFxuXG4gIGRpc3BsYXk6IHtcbiAgICBkZWZhdWx0VGVtcGxhdGVzLFxuICAgIGRlZmF1bHRUZXh0Q29udGVudHMsXG4gICAgQnV0dG9uVmlldyxcbiAgICBDYW52YXNWaWV3LFxuICAgIFJlbmRlcmVyLFxuICAgIFJlbmRlcmluZ0dyb3VwLFxuICAgIFNlZ21lbnRlZFZpZXcsXG4gICAgU2VsZWN0VmlldyxcbiAgICBTcGFjZVZpZXcsXG4gICAgU3F1YXJlZFZpZXcsXG4gICAgVG91Y2hTdXJmYWNlLFxuICAgIFZpZXcsXG4gICAgdmlld3BvcnQsXG4gIH0sXG59O1xuIl19