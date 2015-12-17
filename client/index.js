'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _wavesAudio = require('waves-audio');

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _input = require('./input');

var _input2 = _interopRequireDefault(_input);

var _ClientModule = require('./ClientModule');

var _ClientModule2 = _interopRequireDefault(_ClientModule);

var _ClientCalibration = require('./ClientCalibration');

var _ClientCalibration2 = _interopRequireDefault(_ClientCalibration);

var _ClientCheckin = require('./ClientCheckin');

var _ClientCheckin2 = _interopRequireDefault(_ClientCheckin);

var _ClientControl = require('./ClientControl');

var _ClientControl2 = _interopRequireDefault(_ClientControl);

var _ClientFileList = require('./ClientFileList');

var _ClientFileList2 = _interopRequireDefault(_ClientFileList);

var _ClientLocator = require('./ClientLocator');

var _ClientLocator2 = _interopRequireDefault(_ClientLocator);

var _ClientPerformance = require('./ClientPerformance');

var _ClientPerformance2 = _interopRequireDefault(_ClientPerformance);

var _ClientPlacer = require('./ClientPlacer');

var _ClientPlacer2 = _interopRequireDefault(_ClientPlacer);

var _ClientSurvey = require('./ClientSurvey');

var _ClientSurvey2 = _interopRequireDefault(_ClientSurvey);

var _ClientSync = require('./ClientSync');

var _ClientSync2 = _interopRequireDefault(_ClientSync);

var _Loader = require('./Loader');

var _Loader2 = _interopRequireDefault(_Loader);

var _Orientation = require('./Orientation');

var _Orientation2 = _interopRequireDefault(_Orientation);

var _Welcome = require('./Welcome');

var _Welcome2 = _interopRequireDefault(_Welcome);

var _displayView = require('./display/View');

var _displayView2 = _interopRequireDefault(_displayView);

var _displaySegmentedView = require('./display/SegmentedView');

var _displaySegmentedView2 = _interopRequireDefault(_displaySegmentedView);

var _displaySelectorView = require('./display/SelectorView');

var _displaySelectorView2 = _interopRequireDefault(_displaySelectorView);

var _displaySpaceView = require('./display/SpaceView');

var _displaySpaceView2 = _interopRequireDefault(_displaySpaceView);

var _displaySquaredView = require('./display/SquaredView');

var _displaySquaredView2 = _interopRequireDefault(_displaySquaredView);

exports['default'] = {
  audioContext: _wavesAudio.audioContext,
  client: _client2['default'],
  input: _input2['default'],
  ClientCalibration: _ClientCalibration2['default'],
  ClientCheckin: _ClientCheckin2['default'],
  ClientControl: _ClientControl2['default'],
  ClientFileList: _ClientFileList2['default'],
  ClientLocator: _ClientLocator2['default'],
  ClientPerformance: _ClientPerformance2['default'],
  ClientPlacer: _ClientPlacer2['default'],
  ClientSurvey: _ClientSurvey2['default'],
  ClientSync: _ClientSync2['default'],
  Loader: _Loader2['default'],
  ClientModule: _ClientModule2['default'],
  Orientation: _Orientation2['default'],
  Welcome: _Welcome2['default'],
  display: {
    View: _displayView2['default'],
    SegmentedView: _displaySegmentedView2['default'],
    SelectorView: _displaySelectorView2['default'],
    SpaceView: _displaySpaceView2['default'],
    SquaredView: _displaySquaredView2['default']
  }
};
module.exports = exports['default'];
// defaultTemplates,
// defaultTextContents,
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7MEJBQTZCLGFBQWE7O3NCQUN2QixVQUFVOzs7O3FCQUNYLFNBQVM7Ozs7NEJBRUYsZ0JBQWdCOzs7O2lDQUNYLHFCQUFxQjs7Ozs2QkFDekIsaUJBQWlCOzs7OzZCQUNqQixpQkFBaUI7Ozs7OEJBQ2hCLGtCQUFrQjs7Ozs2QkFDbkIsaUJBQWlCOzs7O2lDQUNiLHFCQUFxQjs7Ozs0QkFDMUIsZ0JBQWdCOzs7OzRCQUNoQixnQkFBZ0I7Ozs7MEJBQ2xCLGNBQWM7Ozs7c0JBRWxCLFVBQVU7Ozs7MkJBQ0wsZUFBZTs7Ozt1QkFDbkIsV0FBVzs7OzsyQkFFZCxnQkFBZ0I7Ozs7b0NBQ1AseUJBQXlCOzs7O21DQUMxQix3QkFBd0I7Ozs7Z0NBQzNCLHFCQUFxQjs7OztrQ0FDbkIsdUJBQXVCOzs7O3FCQUdoQztBQUNiLGNBQVksMEJBQUE7QUFDWixRQUFNLHFCQUFBO0FBQ04sT0FBSyxvQkFBQTtBQUNMLG1CQUFpQixnQ0FBQTtBQUNqQixlQUFhLDRCQUFBO0FBQ2IsZUFBYSw0QkFBQTtBQUNiLGdCQUFjLDZCQUFBO0FBQ2QsZUFBYSw0QkFBQTtBQUNiLG1CQUFpQixnQ0FBQTtBQUNqQixjQUFZLDJCQUFBO0FBQ1osY0FBWSwyQkFBQTtBQUNaLFlBQVUseUJBQUE7QUFDVixRQUFNLHFCQUFBO0FBQ04sY0FBWSwyQkFBQTtBQUNaLGFBQVcsMEJBQUE7QUFDWCxTQUFPLHNCQUFBO0FBQ1AsU0FBTyxFQUFFO0FBQ1AsUUFBSSwwQkFBQTtBQUNKLGlCQUFhLG1DQUFBO0FBQ2IsZ0JBQVksa0NBQUE7QUFDWixhQUFTLCtCQUFBO0FBQ1QsZUFBVyxpQ0FBQTtHQUdaO0NBQ0YiLCJmaWxlIjoic3JjL2NsaWVudC9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGF1ZGlvQ29udGV4dCB9IGZyb20gJ3dhdmVzLWF1ZGlvJztcbmltcG9ydCBjbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IGlucHV0IGZyb20gJy4vaW5wdXQnO1xuXG5pbXBvcnQgQ2xpZW50TW9kdWxlIGZyb20gJy4vQ2xpZW50TW9kdWxlJztcbmltcG9ydCBDbGllbnRDYWxpYnJhdGlvbiBmcm9tICcuL0NsaWVudENhbGlicmF0aW9uJztcbmltcG9ydCBDbGllbnRDaGVja2luIGZyb20gJy4vQ2xpZW50Q2hlY2tpbic7XG5pbXBvcnQgQ2xpZW50Q29udHJvbCBmcm9tICcuL0NsaWVudENvbnRyb2wnO1xuaW1wb3J0IENsaWVudEZpbGVMaXN0IGZyb20gJy4vQ2xpZW50RmlsZUxpc3QnO1xuaW1wb3J0IENsaWVudExvY2F0b3IgZnJvbSAnLi9DbGllbnRMb2NhdG9yJztcbmltcG9ydCBDbGllbnRQZXJmb3JtYW5jZSBmcm9tICcuL0NsaWVudFBlcmZvcm1hbmNlJztcbmltcG9ydCBDbGllbnRQbGFjZXIgZnJvbSAnLi9DbGllbnRQbGFjZXInO1xuaW1wb3J0IENsaWVudFN1cnZleSBmcm9tICcuL0NsaWVudFN1cnZleSc7XG5pbXBvcnQgQ2xpZW50U3luYyBmcm9tICcuL0NsaWVudFN5bmMnO1xuXG5pbXBvcnQgTG9hZGVyIGZyb20gJy4vTG9hZGVyJztcbmltcG9ydCBPcmllbnRhdGlvbiBmcm9tICcuL09yaWVudGF0aW9uJztcbmltcG9ydCBXZWxjb21lIGZyb20gJy4vV2VsY29tZSc7XG5cbmltcG9ydCBWaWV3IGZyb20gJy4vZGlzcGxheS9WaWV3JztcbmltcG9ydCBTZWdtZW50ZWRWaWV3IGZyb20gJy4vZGlzcGxheS9TZWdtZW50ZWRWaWV3JztcbmltcG9ydCBTZWxlY3RvclZpZXcgZnJvbSAnLi9kaXNwbGF5L1NlbGVjdG9yVmlldyc7XG5pbXBvcnQgU3BhY2VWaWV3IGZyb20gJy4vZGlzcGxheS9TcGFjZVZpZXcnO1xuaW1wb3J0IFNxdWFyZWRWaWV3IGZyb20gJy4vZGlzcGxheS9TcXVhcmVkVmlldyc7XG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICBhdWRpb0NvbnRleHQsXG4gIGNsaWVudCxcbiAgaW5wdXQsXG4gIENsaWVudENhbGlicmF0aW9uLFxuICBDbGllbnRDaGVja2luLFxuICBDbGllbnRDb250cm9sLFxuICBDbGllbnRGaWxlTGlzdCxcbiAgQ2xpZW50TG9jYXRvcixcbiAgQ2xpZW50UGVyZm9ybWFuY2UsXG4gIENsaWVudFBsYWNlcixcbiAgQ2xpZW50U3VydmV5LFxuICBDbGllbnRTeW5jLFxuICBMb2FkZXIsXG4gIENsaWVudE1vZHVsZSxcbiAgT3JpZW50YXRpb24sXG4gIFdlbGNvbWUsXG4gIGRpc3BsYXk6IHtcbiAgICBWaWV3LFxuICAgIFNlZ21lbnRlZFZpZXcsXG4gICAgU2VsZWN0b3JWaWV3LFxuICAgIFNwYWNlVmlldyxcbiAgICBTcXVhcmVkVmlldyxcbiAgICAvLyBkZWZhdWx0VGVtcGxhdGVzLFxuICAgIC8vIGRlZmF1bHRUZXh0Q29udGVudHMsXG4gIH1cbn07XG4iXX0=