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

var _ClientSetup = require('./ClientSetup');

var _ClientSetup2 = _interopRequireDefault(_ClientSetup);

var _ClientSurvey = require('./ClientSurvey');

var _ClientSurvey2 = _interopRequireDefault(_ClientSurvey);

var _ClientSync = require('./ClientSync');

var _ClientSync2 = _interopRequireDefault(_ClientSync);

var _Dialog = require('./Dialog');

var _Dialog2 = _interopRequireDefault(_Dialog);

var _Loader = require('./Loader');

var _Loader2 = _interopRequireDefault(_Loader);

var _ClientModule = require('./ClientModule');

var _ClientModule2 = _interopRequireDefault(_ClientModule);

var _Orientation = require('./Orientation');

var _Orientation2 = _interopRequireDefault(_Orientation);

var _Platform = require('./Platform');

var _Platform2 = _interopRequireDefault(_Platform);

var _Selector = require('./Selector');

var _Selector2 = _interopRequireDefault(_Selector);

var _Space = require('./Space');

var _Space2 = _interopRequireDefault(_Space);

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
  ClientSetup: _ClientSetup2['default'],
  ClientSurvey: _ClientSurvey2['default'],
  ClientSync: _ClientSync2['default'],
  Dialog: _Dialog2['default'],
  Loader: _Loader2['default'],
  ClientModule: _ClientModule2['default'],
  Orientation: _Orientation2['default'],
  Platform: _Platform2['default'],
  Selector: _Selector2['default'],
  Space: _Space2['default']
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7MEJBQTZCLGFBQWE7O3NCQUN2QixVQUFVOzs7O3FCQUNYLFNBQVM7Ozs7aUNBRUcscUJBQXFCOzs7OzZCQUN6QixpQkFBaUI7Ozs7NkJBQ2pCLGlCQUFpQjs7Ozs4QkFDaEIsa0JBQWtCOzs7OzZCQUNuQixpQkFBaUI7Ozs7aUNBQ2IscUJBQXFCOzs7OzRCQUMxQixnQkFBZ0I7Ozs7MkJBQ2pCLGVBQWU7Ozs7NEJBQ2QsZ0JBQWdCOzs7OzBCQUNsQixjQUFjOzs7O3NCQUVsQixVQUFVOzs7O3NCQUNWLFVBQVU7Ozs7NEJBQ0osZ0JBQWdCOzs7OzJCQUNqQixlQUFlOzs7O3dCQUNsQixZQUFZOzs7O3dCQUNaLFlBQVk7Ozs7cUJBQ2YsU0FBUzs7OztxQkFFWjtBQUNiLGNBQVksMEJBQUE7QUFDWixRQUFNLHFCQUFBO0FBQ04sT0FBSyxvQkFBQTtBQUNMLG1CQUFpQixnQ0FBQTtBQUNqQixlQUFhLDRCQUFBO0FBQ2IsZUFBYSw0QkFBQTtBQUNiLGdCQUFjLDZCQUFBO0FBQ2QsZUFBYSw0QkFBQTtBQUNiLG1CQUFpQixnQ0FBQTtBQUNqQixjQUFZLDJCQUFBO0FBQ1osYUFBVywwQkFBQTtBQUNYLGNBQVksMkJBQUE7QUFDWixZQUFVLHlCQUFBO0FBQ1YsUUFBTSxxQkFBQTtBQUNOLFFBQU0scUJBQUE7QUFDTixjQUFZLDJCQUFBO0FBQ1osYUFBVywwQkFBQTtBQUNYLFVBQVEsdUJBQUE7QUFDUixVQUFRLHVCQUFBO0FBQ1IsT0FBSyxvQkFBQTtDQUNOIiwiZmlsZSI6InNyYy9jbGllbnQvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhdWRpb0NvbnRleHQgfSBmcm9tICd3YXZlcy1hdWRpbyc7XG5pbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCBpbnB1dCBmcm9tICcuL2lucHV0JztcblxuaW1wb3J0IENsaWVudENhbGlicmF0aW9uIGZyb20gJy4vQ2xpZW50Q2FsaWJyYXRpb24nO1xuaW1wb3J0IENsaWVudENoZWNraW4gZnJvbSAnLi9DbGllbnRDaGVja2luJztcbmltcG9ydCBDbGllbnRDb250cm9sIGZyb20gJy4vQ2xpZW50Q29udHJvbCc7XG5pbXBvcnQgQ2xpZW50RmlsZUxpc3QgZnJvbSAnLi9DbGllbnRGaWxlTGlzdCc7XG5pbXBvcnQgQ2xpZW50TG9jYXRvciBmcm9tICcuL0NsaWVudExvY2F0b3InO1xuaW1wb3J0IENsaWVudFBlcmZvcm1hbmNlIGZyb20gJy4vQ2xpZW50UGVyZm9ybWFuY2UnO1xuaW1wb3J0IENsaWVudFBsYWNlciBmcm9tICcuL0NsaWVudFBsYWNlcic7XG5pbXBvcnQgQ2xpZW50U2V0dXAgZnJvbSAnLi9DbGllbnRTZXR1cCc7XG5pbXBvcnQgQ2xpZW50U3VydmV5IGZyb20gJy4vQ2xpZW50U3VydmV5JztcbmltcG9ydCBDbGllbnRTeW5jIGZyb20gJy4vQ2xpZW50U3luYyc7XG5cbmltcG9ydCBEaWFsb2cgZnJvbSAnLi9EaWFsb2cnO1xuaW1wb3J0IExvYWRlciBmcm9tICcuL0xvYWRlcic7XG5pbXBvcnQgQ2xpZW50TW9kdWxlIGZyb20gJy4vQ2xpZW50TW9kdWxlJztcbmltcG9ydCBPcmllbnRhdGlvbiBmcm9tICcuL09yaWVudGF0aW9uJztcbmltcG9ydCBQbGF0Zm9ybSBmcm9tICcuL1BsYXRmb3JtJztcbmltcG9ydCBTZWxlY3RvciBmcm9tICcuL1NlbGVjdG9yJztcbmltcG9ydCBTcGFjZSBmcm9tICcuL1NwYWNlJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBhdWRpb0NvbnRleHQsXG4gIGNsaWVudCxcbiAgaW5wdXQsXG4gIENsaWVudENhbGlicmF0aW9uLFxuICBDbGllbnRDaGVja2luLFxuICBDbGllbnRDb250cm9sLFxuICBDbGllbnRGaWxlTGlzdCxcbiAgQ2xpZW50TG9jYXRvcixcbiAgQ2xpZW50UGVyZm9ybWFuY2UsXG4gIENsaWVudFBsYWNlcixcbiAgQ2xpZW50U2V0dXAsXG4gIENsaWVudFN1cnZleSxcbiAgQ2xpZW50U3luYyxcbiAgRGlhbG9nLFxuICBMb2FkZXIsXG4gIENsaWVudE1vZHVsZSxcbiAgT3JpZW50YXRpb24sXG4gIFBsYXRmb3JtLFxuICBTZWxlY3RvcixcbiAgU3BhY2UsXG59O1xuIl19