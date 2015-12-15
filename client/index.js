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

// import Platform from './Platform';

var _Selector = require('./Selector');

var _Selector2 = _interopRequireDefault(_Selector);

// import Space from './Space';

var _Welcome = require('./Welcome');

var _Welcome2 = _interopRequireDefault(_Welcome);

var _displayView = require('./display/View');

var _displayView2 = _interopRequireDefault(_displayView);

var _displaySegmentedView = require('./display/SegmentedView');

var _displaySegmentedView2 = _interopRequireDefault(_displaySegmentedView);

var _displaySpaceView = require('./display/SpaceView');

var _displaySpaceView2 = _interopRequireDefault(_displaySpaceView);

var _displaySquaredView = require('./display/SquaredView');

var _displaySquaredView2 = _interopRequireDefault(_displaySquaredView);

// import defaultTemplates from './views/defaultTemplates';
// import defaultTextContents from './views/defaultTextContents';

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
  // Dialog,
  Loader: _Loader2['default'],
  ClientModule: _ClientModule2['default'],
  Orientation: _Orientation2['default'],
  // Platform,
  Selector: _Selector2['default'],
  // Space,
  Welcome: _Welcome2['default'],

  display: {
    View: _displayView2['default'],
    SegmentedView: _displaySegmentedView2['default'],
    SpaceView: _displaySpaceView2['default'],
    SquaredView: _displaySquaredView2['default']
  }
};
module.exports = exports['default'];
// defaultTemplates,
// defaultTextContents,
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OzswQkFBNkIsYUFBYTs7c0JBQ3ZCLFVBQVU7Ozs7cUJBQ1gsU0FBUzs7OztpQ0FFRyxxQkFBcUI7Ozs7NkJBQ3pCLGlCQUFpQjs7Ozs2QkFDakIsaUJBQWlCOzs7OzhCQUNoQixrQkFBa0I7Ozs7NkJBQ25CLGlCQUFpQjs7OztpQ0FDYixxQkFBcUI7Ozs7NEJBQzFCLGdCQUFnQjs7Ozs0QkFDaEIsZ0JBQWdCOzs7OzBCQUNsQixjQUFjOzs7O3NCQUVsQixVQUFVOzs7OzRCQUNKLGdCQUFnQjs7OzsyQkFDakIsZUFBZTs7Ozs7O3dCQUVsQixZQUFZOzs7Ozs7dUJBRWIsV0FBVzs7OzsyQkFFZCxnQkFBZ0I7Ozs7b0NBQ1AseUJBQXlCOzs7O2dDQUM3QixxQkFBcUI7Ozs7a0NBQ25CLHVCQUF1Qjs7Ozs7OztxQkFLaEM7QUFDYixjQUFZLDBCQUFBO0FBQ1osUUFBTSxxQkFBQTtBQUNOLE9BQUssb0JBQUE7QUFDTCxtQkFBaUIsZ0NBQUE7QUFDakIsZUFBYSw0QkFBQTtBQUNiLGVBQWEsNEJBQUE7QUFDYixnQkFBYyw2QkFBQTtBQUNkLGVBQWEsNEJBQUE7QUFDYixtQkFBaUIsZ0NBQUE7QUFDakIsY0FBWSwyQkFBQTtBQUNaLGNBQVksMkJBQUE7QUFDWixZQUFVLHlCQUFBOztBQUVWLFFBQU0scUJBQUE7QUFDTixjQUFZLDJCQUFBO0FBQ1osYUFBVywwQkFBQTs7QUFFWCxVQUFRLHVCQUFBOztBQUVSLFNBQU8sc0JBQUE7O0FBRVAsU0FBTyxFQUFFO0FBQ1AsUUFBSSwwQkFBQTtBQUNKLGlCQUFhLG1DQUFBO0FBQ2IsYUFBUywrQkFBQTtBQUNULGVBQVcsaUNBQUE7R0FHWjtDQUNGIiwiZmlsZSI6InNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGF1ZGlvQ29udGV4dCB9IGZyb20gJ3dhdmVzLWF1ZGlvJztcbmltcG9ydCBjbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IGlucHV0IGZyb20gJy4vaW5wdXQnO1xuXG5pbXBvcnQgQ2xpZW50Q2FsaWJyYXRpb24gZnJvbSAnLi9DbGllbnRDYWxpYnJhdGlvbic7XG5pbXBvcnQgQ2xpZW50Q2hlY2tpbiBmcm9tICcuL0NsaWVudENoZWNraW4nO1xuaW1wb3J0IENsaWVudENvbnRyb2wgZnJvbSAnLi9DbGllbnRDb250cm9sJztcbmltcG9ydCBDbGllbnRGaWxlTGlzdCBmcm9tICcuL0NsaWVudEZpbGVMaXN0JztcbmltcG9ydCBDbGllbnRMb2NhdG9yIGZyb20gJy4vQ2xpZW50TG9jYXRvcic7XG5pbXBvcnQgQ2xpZW50UGVyZm9ybWFuY2UgZnJvbSAnLi9DbGllbnRQZXJmb3JtYW5jZSc7XG5pbXBvcnQgQ2xpZW50UGxhY2VyIGZyb20gJy4vQ2xpZW50UGxhY2VyJztcbmltcG9ydCBDbGllbnRTdXJ2ZXkgZnJvbSAnLi9DbGllbnRTdXJ2ZXknO1xuaW1wb3J0IENsaWVudFN5bmMgZnJvbSAnLi9DbGllbnRTeW5jJztcblxuaW1wb3J0IExvYWRlciBmcm9tICcuL0xvYWRlcic7XG5pbXBvcnQgQ2xpZW50TW9kdWxlIGZyb20gJy4vQ2xpZW50TW9kdWxlJztcbmltcG9ydCBPcmllbnRhdGlvbiBmcm9tICcuL09yaWVudGF0aW9uJztcbi8vIGltcG9ydCBQbGF0Zm9ybSBmcm9tICcuL1BsYXRmb3JtJztcbmltcG9ydCBTZWxlY3RvciBmcm9tICcuL1NlbGVjdG9yJztcbi8vIGltcG9ydCBTcGFjZSBmcm9tICcuL1NwYWNlJztcbmltcG9ydCBXZWxjb21lIGZyb20gJy4vV2VsY29tZSc7XG5cbmltcG9ydCBWaWV3IGZyb20gJy4vZGlzcGxheS9WaWV3JztcbmltcG9ydCBTZWdtZW50ZWRWaWV3IGZyb20gJy4vZGlzcGxheS9TZWdtZW50ZWRWaWV3JztcbmltcG9ydCBTcGFjZVZpZXcgZnJvbSAnLi9kaXNwbGF5L1NwYWNlVmlldyc7XG5pbXBvcnQgU3F1YXJlZFZpZXcgZnJvbSAnLi9kaXNwbGF5L1NxdWFyZWRWaWV3Jztcbi8vIGltcG9ydCBkZWZhdWx0VGVtcGxhdGVzIGZyb20gJy4vdmlld3MvZGVmYXVsdFRlbXBsYXRlcyc7XG4vLyBpbXBvcnQgZGVmYXVsdFRleHRDb250ZW50cyBmcm9tICcuL3ZpZXdzL2RlZmF1bHRUZXh0Q29udGVudHMnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgYXVkaW9Db250ZXh0LFxuICBjbGllbnQsXG4gIGlucHV0LFxuICBDbGllbnRDYWxpYnJhdGlvbixcbiAgQ2xpZW50Q2hlY2tpbixcbiAgQ2xpZW50Q29udHJvbCxcbiAgQ2xpZW50RmlsZUxpc3QsXG4gIENsaWVudExvY2F0b3IsXG4gIENsaWVudFBlcmZvcm1hbmNlLFxuICBDbGllbnRQbGFjZXIsXG4gIENsaWVudFN1cnZleSxcbiAgQ2xpZW50U3luYyxcbiAgLy8gRGlhbG9nLFxuICBMb2FkZXIsXG4gIENsaWVudE1vZHVsZSxcbiAgT3JpZW50YXRpb24sXG4gIC8vIFBsYXRmb3JtLFxuICBTZWxlY3RvcixcbiAgLy8gU3BhY2UsXG4gIFdlbGNvbWUsXG5cbiAgZGlzcGxheToge1xuICAgIFZpZXcsXG4gICAgU2VnbWVudGVkVmlldyxcbiAgICBTcGFjZVZpZXcsXG4gICAgU3F1YXJlZFZpZXcsXG4gICAgLy8gZGVmYXVsdFRlbXBsYXRlcyxcbiAgICAvLyBkZWZhdWx0VGV4dENvbnRlbnRzLFxuICB9XG59O1xuIl19