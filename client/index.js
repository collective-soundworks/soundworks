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

var _displayButtonView = require('./display/ButtonView');

var _displayButtonView2 = _interopRequireDefault(_displayButtonView);

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
    ButtonView: _displayButtonView2['default'],
    SegmentedView: _displaySegmentedView2['default'],
    SelectView: _displaySelectView2['default'],
    SpaceView: _displaySpaceView2['default'],
    SquaredView: _displaySquaredView2['default'],
    TouchSurface: _displayTouchSurface2['default'],
    defaultTemplates: _displayDefaultTemplates2['default'],
    defaultTextContents: _displayDefaultTextContents2['default']
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7MEJBQTZCLGFBQWE7O3NCQUN2QixVQUFVOzs7O3FCQUNYLFNBQVM7Ozs7NEJBRUYsZ0JBQWdCOzs7O2lDQUNYLHFCQUFxQjs7Ozs2QkFDekIsaUJBQWlCOzs7OzZCQUNqQixpQkFBaUI7Ozs7OEJBQ2hCLGtCQUFrQjs7Ozs2QkFDbkIsaUJBQWlCOzs7O2lDQUNiLHFCQUFxQjs7Ozs0QkFDMUIsZ0JBQWdCOzs7OzRCQUNoQixnQkFBZ0I7Ozs7MEJBQ2xCLGNBQWM7Ozs7c0JBRWxCLFVBQVU7Ozs7MkJBQ0wsZUFBZTs7Ozt1QkFDbkIsV0FBVzs7OzsyQkFFZCxnQkFBZ0I7Ozs7aUNBQ1Ysc0JBQXNCOzs7O29DQUNuQix5QkFBeUI7Ozs7aUNBQzVCLHNCQUFzQjs7OztnQ0FDdkIscUJBQXFCOzs7O2tDQUNuQix1QkFBdUI7Ozs7bUNBQ3RCLHdCQUF3Qjs7Ozt1Q0FDcEIsNEJBQTRCOzs7OzBDQUN6QiwrQkFBK0I7Ozs7cUJBRWhEO0FBQ2IsY0FBWSwwQkFBQTtBQUNaLFFBQU0scUJBQUE7QUFDTixPQUFLLG9CQUFBO0FBQ0wsbUJBQWlCLGdDQUFBO0FBQ2pCLGVBQWEsNEJBQUE7QUFDYixlQUFhLDRCQUFBO0FBQ2IsZ0JBQWMsNkJBQUE7QUFDZCxlQUFhLDRCQUFBO0FBQ2IsbUJBQWlCLGdDQUFBO0FBQ2pCLGNBQVksMkJBQUE7QUFDWixjQUFZLDJCQUFBO0FBQ1osWUFBVSx5QkFBQTtBQUNWLFFBQU0scUJBQUE7QUFDTixjQUFZLDJCQUFBO0FBQ1osYUFBVywwQkFBQTtBQUNYLFNBQU8sc0JBQUE7QUFDUCxTQUFPLEVBQUU7QUFDUCxRQUFJLDBCQUFBO0FBQ0osY0FBVSxnQ0FBQTtBQUNWLGlCQUFhLG1DQUFBO0FBQ2IsY0FBVSxnQ0FBQTtBQUNWLGFBQVMsK0JBQUE7QUFDVCxlQUFXLGlDQUFBO0FBQ1gsZ0JBQVksa0NBQUE7QUFDWixvQkFBZ0Isc0NBQUE7QUFDaEIsdUJBQW1CLHlDQUFBO0dBQ3BCO0NBQ0YiLCJmaWxlIjoic3JjL2NsaWVudC9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGF1ZGlvQ29udGV4dCB9IGZyb20gJ3dhdmVzLWF1ZGlvJztcbmltcG9ydCBjbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IGlucHV0IGZyb20gJy4vaW5wdXQnO1xuXG5pbXBvcnQgQ2xpZW50TW9kdWxlIGZyb20gJy4vQ2xpZW50TW9kdWxlJztcbmltcG9ydCBDbGllbnRDYWxpYnJhdGlvbiBmcm9tICcuL0NsaWVudENhbGlicmF0aW9uJztcbmltcG9ydCBDbGllbnRDaGVja2luIGZyb20gJy4vQ2xpZW50Q2hlY2tpbic7XG5pbXBvcnQgQ2xpZW50Q29udHJvbCBmcm9tICcuL0NsaWVudENvbnRyb2wnO1xuaW1wb3J0IENsaWVudEZpbGVMaXN0IGZyb20gJy4vQ2xpZW50RmlsZUxpc3QnO1xuaW1wb3J0IENsaWVudExvY2F0b3IgZnJvbSAnLi9DbGllbnRMb2NhdG9yJztcbmltcG9ydCBDbGllbnRQZXJmb3JtYW5jZSBmcm9tICcuL0NsaWVudFBlcmZvcm1hbmNlJztcbmltcG9ydCBDbGllbnRQbGFjZXIgZnJvbSAnLi9DbGllbnRQbGFjZXInO1xuaW1wb3J0IENsaWVudFN1cnZleSBmcm9tICcuL0NsaWVudFN1cnZleSc7XG5pbXBvcnQgQ2xpZW50U3luYyBmcm9tICcuL0NsaWVudFN5bmMnO1xuXG5pbXBvcnQgTG9hZGVyIGZyb20gJy4vTG9hZGVyJztcbmltcG9ydCBPcmllbnRhdGlvbiBmcm9tICcuL09yaWVudGF0aW9uJztcbmltcG9ydCBXZWxjb21lIGZyb20gJy4vV2VsY29tZSc7XG5cbmltcG9ydCBWaWV3IGZyb20gJy4vZGlzcGxheS9WaWV3JztcbmltcG9ydCBCdXR0b25WaWV3IGZyb20gJy4vZGlzcGxheS9CdXR0b25WaWV3JztcbmltcG9ydCBTZWdtZW50ZWRWaWV3IGZyb20gJy4vZGlzcGxheS9TZWdtZW50ZWRWaWV3JztcbmltcG9ydCBTZWxlY3RWaWV3IGZyb20gJy4vZGlzcGxheS9TZWxlY3RWaWV3JztcbmltcG9ydCBTcGFjZVZpZXcgZnJvbSAnLi9kaXNwbGF5L1NwYWNlVmlldyc7XG5pbXBvcnQgU3F1YXJlZFZpZXcgZnJvbSAnLi9kaXNwbGF5L1NxdWFyZWRWaWV3JztcbmltcG9ydCBUb3VjaFN1cmZhY2UgZnJvbSAnLi9kaXNwbGF5L1RvdWNoU3VyZmFjZSc7XG5pbXBvcnQgZGVmYXVsdFRlbXBsYXRlcyBmcm9tICcuL2Rpc3BsYXkvZGVmYXVsdFRlbXBsYXRlcyc7XG5pbXBvcnQgZGVmYXVsdFRleHRDb250ZW50cyBmcm9tICcuL2Rpc3BsYXkvZGVmYXVsdFRleHRDb250ZW50cyc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgYXVkaW9Db250ZXh0LFxuICBjbGllbnQsXG4gIGlucHV0LFxuICBDbGllbnRDYWxpYnJhdGlvbixcbiAgQ2xpZW50Q2hlY2tpbixcbiAgQ2xpZW50Q29udHJvbCxcbiAgQ2xpZW50RmlsZUxpc3QsXG4gIENsaWVudExvY2F0b3IsXG4gIENsaWVudFBlcmZvcm1hbmNlLFxuICBDbGllbnRQbGFjZXIsXG4gIENsaWVudFN1cnZleSxcbiAgQ2xpZW50U3luYyxcbiAgTG9hZGVyLFxuICBDbGllbnRNb2R1bGUsXG4gIE9yaWVudGF0aW9uLFxuICBXZWxjb21lLFxuICBkaXNwbGF5OiB7XG4gICAgVmlldyxcbiAgICBCdXR0b25WaWV3LFxuICAgIFNlZ21lbnRlZFZpZXcsXG4gICAgU2VsZWN0VmlldyxcbiAgICBTcGFjZVZpZXcsXG4gICAgU3F1YXJlZFZpZXcsXG4gICAgVG91Y2hTdXJmYWNlLFxuICAgIGRlZmF1bHRUZW1wbGF0ZXMsXG4gICAgZGVmYXVsdFRleHRDb250ZW50cyxcbiAgfVxufTtcbiJdfQ==