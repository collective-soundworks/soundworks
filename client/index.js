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

var _ClientModule = require('./ClientModule');

var _ClientModule2 = _interopRequireDefault(_ClientModule);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7MEJBQTZCLGFBQWE7O3NCQUN2QixVQUFVOzs7O3FCQUNYLFNBQVM7Ozs7aUNBRUcscUJBQXFCOzs7OzZCQUN6QixpQkFBaUI7Ozs7NkJBQ2pCLGlCQUFpQjs7Ozs4QkFDaEIsa0JBQWtCOzs7OzZCQUNuQixpQkFBaUI7Ozs7aUNBQ2IscUJBQXFCOzs7OzRCQUMxQixnQkFBZ0I7Ozs7NEJBQ2hCLGdCQUFnQjs7OzswQkFDbEIsY0FBYzs7OztzQkFFbEIsVUFBVTs7Ozs0QkFDSixnQkFBZ0I7Ozs7MkJBQ2pCLGVBQWU7Ozs7dUJBQ25CLFdBQVc7Ozs7MkJBRWQsZ0JBQWdCOzs7O2lDQUNWLHNCQUFzQjs7OztvQ0FDbkIseUJBQXlCOzs7O2lDQUM1QixzQkFBc0I7Ozs7Z0NBQ3ZCLHFCQUFxQjs7OztrQ0FDbkIsdUJBQXVCOzs7O21DQUN0Qix3QkFBd0I7Ozs7dUNBQ3BCLDRCQUE0Qjs7OzswQ0FDekIsK0JBQStCOzs7O3FCQUdoRDtBQUNiLGNBQVksMEJBQUE7QUFDWixRQUFNLHFCQUFBO0FBQ04sT0FBSyxvQkFBQTtBQUNMLG1CQUFpQixnQ0FBQTtBQUNqQixlQUFhLDRCQUFBO0FBQ2IsZUFBYSw0QkFBQTtBQUNiLGdCQUFjLDZCQUFBO0FBQ2QsZUFBYSw0QkFBQTtBQUNiLG1CQUFpQixnQ0FBQTtBQUNqQixjQUFZLDJCQUFBO0FBQ1osY0FBWSwyQkFBQTtBQUNaLFlBQVUseUJBQUE7O0FBRVYsUUFBTSxxQkFBQTtBQUNOLGNBQVksMkJBQUE7QUFDWixhQUFXLDBCQUFBO0FBQ1gsU0FBTyxzQkFBQTs7QUFFUCxTQUFPLEVBQUU7QUFDUCxRQUFJLDBCQUFBO0FBQ0osY0FBVSxnQ0FBQTtBQUNWLGlCQUFhLG1DQUFBO0FBQ2IsY0FBVSxnQ0FBQTtBQUNWLGFBQVMsK0JBQUE7QUFDVCxlQUFXLGlDQUFBO0FBQ1gsZ0JBQVksa0NBQUE7QUFDWixvQkFBZ0Isc0NBQUE7QUFDaEIsdUJBQW1CLHlDQUFBO0dBQ3BCO0NBQ0YiLCJmaWxlIjoic3JjL2NsaWVudC9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGF1ZGlvQ29udGV4dCB9IGZyb20gJ3dhdmVzLWF1ZGlvJztcbmltcG9ydCBjbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IGlucHV0IGZyb20gJy4vaW5wdXQnO1xuXG5pbXBvcnQgQ2xpZW50Q2FsaWJyYXRpb24gZnJvbSAnLi9DbGllbnRDYWxpYnJhdGlvbic7XG5pbXBvcnQgQ2xpZW50Q2hlY2tpbiBmcm9tICcuL0NsaWVudENoZWNraW4nO1xuaW1wb3J0IENsaWVudENvbnRyb2wgZnJvbSAnLi9DbGllbnRDb250cm9sJztcbmltcG9ydCBDbGllbnRGaWxlTGlzdCBmcm9tICcuL0NsaWVudEZpbGVMaXN0JztcbmltcG9ydCBDbGllbnRMb2NhdG9yIGZyb20gJy4vQ2xpZW50TG9jYXRvcic7XG5pbXBvcnQgQ2xpZW50UGVyZm9ybWFuY2UgZnJvbSAnLi9DbGllbnRQZXJmb3JtYW5jZSc7XG5pbXBvcnQgQ2xpZW50UGxhY2VyIGZyb20gJy4vQ2xpZW50UGxhY2VyJztcbmltcG9ydCBDbGllbnRTdXJ2ZXkgZnJvbSAnLi9DbGllbnRTdXJ2ZXknO1xuaW1wb3J0IENsaWVudFN5bmMgZnJvbSAnLi9DbGllbnRTeW5jJztcblxuaW1wb3J0IExvYWRlciBmcm9tICcuL0xvYWRlcic7XG5pbXBvcnQgQ2xpZW50TW9kdWxlIGZyb20gJy4vQ2xpZW50TW9kdWxlJztcbmltcG9ydCBPcmllbnRhdGlvbiBmcm9tICcuL09yaWVudGF0aW9uJztcbmltcG9ydCBXZWxjb21lIGZyb20gJy4vV2VsY29tZSc7XG5cbmltcG9ydCBWaWV3IGZyb20gJy4vZGlzcGxheS9WaWV3JztcbmltcG9ydCBCdXR0b25WaWV3IGZyb20gJy4vZGlzcGxheS9CdXR0b25WaWV3JztcbmltcG9ydCBTZWdtZW50ZWRWaWV3IGZyb20gJy4vZGlzcGxheS9TZWdtZW50ZWRWaWV3JztcbmltcG9ydCBTZWxlY3RWaWV3IGZyb20gJy4vZGlzcGxheS9TZWxlY3RWaWV3JztcbmltcG9ydCBTcGFjZVZpZXcgZnJvbSAnLi9kaXNwbGF5L1NwYWNlVmlldyc7XG5pbXBvcnQgU3F1YXJlZFZpZXcgZnJvbSAnLi9kaXNwbGF5L1NxdWFyZWRWaWV3JztcbmltcG9ydCBUb3VjaFN1cmZhY2UgZnJvbSAnLi9kaXNwbGF5L1RvdWNoU3VyZmFjZSc7XG5pbXBvcnQgZGVmYXVsdFRlbXBsYXRlcyBmcm9tICcuL2Rpc3BsYXkvZGVmYXVsdFRlbXBsYXRlcyc7XG5pbXBvcnQgZGVmYXVsdFRleHRDb250ZW50cyBmcm9tICcuL2Rpc3BsYXkvZGVmYXVsdFRleHRDb250ZW50cyc7XG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICBhdWRpb0NvbnRleHQsXG4gIGNsaWVudCxcbiAgaW5wdXQsXG4gIENsaWVudENhbGlicmF0aW9uLFxuICBDbGllbnRDaGVja2luLFxuICBDbGllbnRDb250cm9sLFxuICBDbGllbnRGaWxlTGlzdCxcbiAgQ2xpZW50TG9jYXRvcixcbiAgQ2xpZW50UGVyZm9ybWFuY2UsXG4gIENsaWVudFBsYWNlcixcbiAgQ2xpZW50U3VydmV5LFxuICBDbGllbnRTeW5jLFxuXG4gIExvYWRlcixcbiAgQ2xpZW50TW9kdWxlLFxuICBPcmllbnRhdGlvbixcbiAgV2VsY29tZSxcblxuICBkaXNwbGF5OiB7XG4gICAgVmlldyxcbiAgICBCdXR0b25WaWV3LFxuICAgIFNlZ21lbnRlZFZpZXcsXG4gICAgU2VsZWN0VmlldyxcbiAgICBTcGFjZVZpZXcsXG4gICAgU3F1YXJlZFZpZXcsXG4gICAgVG91Y2hTdXJmYWNlLFxuICAgIGRlZmF1bHRUZW1wbGF0ZXMsXG4gICAgZGVmYXVsdFRleHRDb250ZW50cyxcbiAgfVxufTtcbiJdfQ==