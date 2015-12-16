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
// import Selector from './Selector';
// import Space from './Space';

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
  // Selector,
  // Space,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7MEJBQTZCLGFBQWE7O3NCQUN2QixVQUFVOzs7O3FCQUNYLFNBQVM7Ozs7aUNBRUcscUJBQXFCOzs7OzZCQUN6QixpQkFBaUI7Ozs7NkJBQ2pCLGlCQUFpQjs7Ozs4QkFDaEIsa0JBQWtCOzs7OzZCQUNuQixpQkFBaUI7Ozs7aUNBQ2IscUJBQXFCOzs7OzRCQUMxQixnQkFBZ0I7Ozs7NEJBQ2hCLGdCQUFnQjs7OzswQkFDbEIsY0FBYzs7OztzQkFFbEIsVUFBVTs7Ozs0QkFDSixnQkFBZ0I7Ozs7MkJBQ2pCLGVBQWU7Ozs7Ozs7O3VCQUluQixXQUFXOzs7OzJCQUVkLGdCQUFnQjs7OztvQ0FDUCx5QkFBeUI7Ozs7bUNBQzFCLHdCQUF3Qjs7OztnQ0FDM0IscUJBQXFCOzs7O2tDQUNuQix1QkFBdUI7Ozs7Ozs7cUJBS2hDO0FBQ2IsY0FBWSwwQkFBQTtBQUNaLFFBQU0scUJBQUE7QUFDTixPQUFLLG9CQUFBO0FBQ0wsbUJBQWlCLGdDQUFBO0FBQ2pCLGVBQWEsNEJBQUE7QUFDYixlQUFhLDRCQUFBO0FBQ2IsZ0JBQWMsNkJBQUE7QUFDZCxlQUFhLDRCQUFBO0FBQ2IsbUJBQWlCLGdDQUFBO0FBQ2pCLGNBQVksMkJBQUE7QUFDWixjQUFZLDJCQUFBO0FBQ1osWUFBVSx5QkFBQTs7QUFFVixRQUFNLHFCQUFBO0FBQ04sY0FBWSwyQkFBQTtBQUNaLGFBQVcsMEJBQUE7Ozs7QUFJWCxTQUFPLHNCQUFBOztBQUVQLFNBQU8sRUFBRTtBQUNQLFFBQUksMEJBQUE7QUFDSixpQkFBYSxtQ0FBQTtBQUNiLGdCQUFZLGtDQUFBO0FBQ1osYUFBUywrQkFBQTtBQUNULGVBQVcsaUNBQUE7R0FHWjtDQUNGIiwiZmlsZSI6InNyYy9jbGllbnQvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhdWRpb0NvbnRleHQgfSBmcm9tICd3YXZlcy1hdWRpbyc7XG5pbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCBpbnB1dCBmcm9tICcuL2lucHV0JztcblxuaW1wb3J0IENsaWVudENhbGlicmF0aW9uIGZyb20gJy4vQ2xpZW50Q2FsaWJyYXRpb24nO1xuaW1wb3J0IENsaWVudENoZWNraW4gZnJvbSAnLi9DbGllbnRDaGVja2luJztcbmltcG9ydCBDbGllbnRDb250cm9sIGZyb20gJy4vQ2xpZW50Q29udHJvbCc7XG5pbXBvcnQgQ2xpZW50RmlsZUxpc3QgZnJvbSAnLi9DbGllbnRGaWxlTGlzdCc7XG5pbXBvcnQgQ2xpZW50TG9jYXRvciBmcm9tICcuL0NsaWVudExvY2F0b3InO1xuaW1wb3J0IENsaWVudFBlcmZvcm1hbmNlIGZyb20gJy4vQ2xpZW50UGVyZm9ybWFuY2UnO1xuaW1wb3J0IENsaWVudFBsYWNlciBmcm9tICcuL0NsaWVudFBsYWNlcic7XG5pbXBvcnQgQ2xpZW50U3VydmV5IGZyb20gJy4vQ2xpZW50U3VydmV5JztcbmltcG9ydCBDbGllbnRTeW5jIGZyb20gJy4vQ2xpZW50U3luYyc7XG5cbmltcG9ydCBMb2FkZXIgZnJvbSAnLi9Mb2FkZXInO1xuaW1wb3J0IENsaWVudE1vZHVsZSBmcm9tICcuL0NsaWVudE1vZHVsZSc7XG5pbXBvcnQgT3JpZW50YXRpb24gZnJvbSAnLi9PcmllbnRhdGlvbic7XG4vLyBpbXBvcnQgUGxhdGZvcm0gZnJvbSAnLi9QbGF0Zm9ybSc7XG4vLyBpbXBvcnQgU2VsZWN0b3IgZnJvbSAnLi9TZWxlY3Rvcic7XG4vLyBpbXBvcnQgU3BhY2UgZnJvbSAnLi9TcGFjZSc7XG5pbXBvcnQgV2VsY29tZSBmcm9tICcuL1dlbGNvbWUnO1xuXG5pbXBvcnQgVmlldyBmcm9tICcuL2Rpc3BsYXkvVmlldyc7XG5pbXBvcnQgU2VnbWVudGVkVmlldyBmcm9tICcuL2Rpc3BsYXkvU2VnbWVudGVkVmlldyc7XG5pbXBvcnQgU2VsZWN0b3JWaWV3IGZyb20gJy4vZGlzcGxheS9TZWxlY3RvclZpZXcnO1xuaW1wb3J0IFNwYWNlVmlldyBmcm9tICcuL2Rpc3BsYXkvU3BhY2VWaWV3JztcbmltcG9ydCBTcXVhcmVkVmlldyBmcm9tICcuL2Rpc3BsYXkvU3F1YXJlZFZpZXcnO1xuLy8gaW1wb3J0IGRlZmF1bHRUZW1wbGF0ZXMgZnJvbSAnLi92aWV3cy9kZWZhdWx0VGVtcGxhdGVzJztcbi8vIGltcG9ydCBkZWZhdWx0VGV4dENvbnRlbnRzIGZyb20gJy4vdmlld3MvZGVmYXVsdFRleHRDb250ZW50cyc7XG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICBhdWRpb0NvbnRleHQsXG4gIGNsaWVudCxcbiAgaW5wdXQsXG4gIENsaWVudENhbGlicmF0aW9uLFxuICBDbGllbnRDaGVja2luLFxuICBDbGllbnRDb250cm9sLFxuICBDbGllbnRGaWxlTGlzdCxcbiAgQ2xpZW50TG9jYXRvcixcbiAgQ2xpZW50UGVyZm9ybWFuY2UsXG4gIENsaWVudFBsYWNlcixcbiAgQ2xpZW50U3VydmV5LFxuICBDbGllbnRTeW5jLFxuICAvLyBEaWFsb2csXG4gIExvYWRlcixcbiAgQ2xpZW50TW9kdWxlLFxuICBPcmllbnRhdGlvbixcbiAgLy8gUGxhdGZvcm0sXG4gIC8vIFNlbGVjdG9yLFxuICAvLyBTcGFjZSxcbiAgV2VsY29tZSxcblxuICBkaXNwbGF5OiB7XG4gICAgVmlldyxcbiAgICBTZWdtZW50ZWRWaWV3LFxuICAgIFNlbGVjdG9yVmlldyxcbiAgICBTcGFjZVZpZXcsXG4gICAgU3F1YXJlZFZpZXcsXG4gICAgLy8gZGVmYXVsdFRlbXBsYXRlcyxcbiAgICAvLyBkZWZhdWx0VGV4dENvbnRlbnRzLFxuICB9XG59O1xuIl19