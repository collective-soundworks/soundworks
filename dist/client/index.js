// @todo - should be handled with `babel-runtime`
// if (!window.Promise) {
//   window.Promise = require('es6-promise').Promise;
// }

'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _wavesAudio = require('waves-audio');

var _clientJs = require('./client.js');

var _clientJs2 = _interopRequireDefault(_clientJs);

var _inputJs = require('./input.js');

var _inputJs2 = _interopRequireDefault(_inputJs);

var _CalibrationJs = require('./Calibration.js');

var _CalibrationJs2 = _interopRequireDefault(_CalibrationJs);

var _CheckinJs = require('./Checkin.js');

var _CheckinJs2 = _interopRequireDefault(_CheckinJs);

var _ControlJs = require('./Control.js');

var _ControlJs2 = _interopRequireDefault(_ControlJs);

var _DialogJs = require('./Dialog.js');

var _DialogJs2 = _interopRequireDefault(_DialogJs);

var _FilelistJs = require('./Filelist.js');

var _FilelistJs2 = _interopRequireDefault(_FilelistJs);

var _LoaderJs = require('./Loader.js');

var _LoaderJs2 = _interopRequireDefault(_LoaderJs);

var _LocatorJs = require('./Locator.js');

var _LocatorJs2 = _interopRequireDefault(_LocatorJs);

var _ModuleJs = require('./Module.js');

var _ModuleJs2 = _interopRequireDefault(_ModuleJs);

var _OrientationJs = require('./Orientation.js');

var _OrientationJs2 = _interopRequireDefault(_OrientationJs);

var _PerformanceJs = require('./Performance.js');

var _PerformanceJs2 = _interopRequireDefault(_PerformanceJs);

var _PlacerJs = require('./Placer.js');

var _PlacerJs2 = _interopRequireDefault(_PlacerJs);

var _PlatformJs = require('./Platform.js');

var _PlatformJs2 = _interopRequireDefault(_PlatformJs);

var _SelectorJs = require('./Selector.js');

var _SelectorJs2 = _interopRequireDefault(_SelectorJs);

var _SetupJs = require('./Setup.js');

var _SetupJs2 = _interopRequireDefault(_SetupJs);

// to be removed

var _SpaceJs = require('./Space.js');

var _SpaceJs2 = _interopRequireDefault(_SpaceJs);

var _SurveyJs = require('./Survey.js');

var _SurveyJs2 = _interopRequireDefault(_SurveyJs);

var _SyncJs = require('./Sync.js');

var _SyncJs2 = _interopRequireDefault(_SyncJs);

exports['default'] = {
  audioContext: _wavesAudio.audioContext,
  client: _clientJs2['default'],
  input: _inputJs2['default'],
  Calibration: _CalibrationJs2['default'],
  Checkin: _CheckinJs2['default'],
  Control: _ControlJs2['default'],
  Dialog: _DialogJs2['default'],
  Filelist: _FilelistJs2['default'],
  Loader: _LoaderJs2['default'],
  Locator: _LocatorJs2['default'],
  Module: _ModuleJs2['default'],
  Orientation: _OrientationJs2['default'],
  Performance: _PerformanceJs2['default'],
  Placer: _PlacerJs2['default'],
  Platform: _PlatformJs2['default'],
  Selector: _SelectorJs2['default'],
  Setup: _SetupJs2['default'],
  Space: _SpaceJs2['default'],
  Survey: _SurveyJs2['default'],
  Sync: _SyncJs2['default']
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OzswQkFLNkIsYUFBYTs7d0JBQ3ZCLGFBQWE7Ozs7dUJBQ2QsWUFBWTs7Ozs2QkFDTixrQkFBa0I7Ozs7eUJBQ3RCLGNBQWM7Ozs7eUJBQ2QsY0FBYzs7Ozt3QkFDZixhQUFhOzs7OzBCQUNYLGVBQWU7Ozs7d0JBQ2pCLGFBQWE7Ozs7eUJBQ1osY0FBYzs7Ozt3QkFDZixhQUFhOzs7OzZCQUNSLGtCQUFrQjs7Ozs2QkFDbEIsa0JBQWtCOzs7O3dCQUN2QixhQUFhOzs7OzBCQUNYLGVBQWU7Ozs7MEJBQ2YsZUFBZTs7Ozt1QkFDbEIsWUFBWTs7Ozs7O3VCQUNaLFlBQVk7Ozs7d0JBQ1gsYUFBYTs7OztzQkFDZixXQUFXOzs7O3FCQUViO0FBQ2IsY0FBWSwwQkFBQTtBQUNaLFFBQU0sdUJBQUE7QUFDTixPQUFLLHNCQUFBO0FBQ0wsYUFBVyw0QkFBQTtBQUNYLFNBQU8sd0JBQUE7QUFDUCxTQUFPLHdCQUFBO0FBQ1AsUUFBTSx1QkFBQTtBQUNOLFVBQVEseUJBQUE7QUFDUixRQUFNLHVCQUFBO0FBQ04sU0FBTyx3QkFBQTtBQUNQLFFBQU0sdUJBQUE7QUFDTixhQUFXLDRCQUFBO0FBQ1gsYUFBVyw0QkFBQTtBQUNYLFFBQU0sdUJBQUE7QUFDTixVQUFRLHlCQUFBO0FBQ1IsVUFBUSx5QkFBQTtBQUNSLE9BQUssc0JBQUE7QUFDTCxPQUFLLHNCQUFBO0FBQ0wsUUFBTSx1QkFBQTtBQUNOLE1BQUkscUJBQUE7Q0FDTCIsImZpbGUiOiJzcmMvY2xpZW50L2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQHRvZG8gLSBzaG91bGQgYmUgaGFuZGxlZCB3aXRoIGBiYWJlbC1ydW50aW1lYFxuLy8gaWYgKCF3aW5kb3cuUHJvbWlzZSkge1xuLy8gICB3aW5kb3cuUHJvbWlzZSA9IHJlcXVpcmUoJ2VzNi1wcm9taXNlJykuUHJvbWlzZTtcbi8vIH1cblxuaW1wb3J0IHsgYXVkaW9Db250ZXh0IH0gZnJvbSAnd2F2ZXMtYXVkaW8nO1xuaW1wb3J0IGNsaWVudCBmcm9tICcuL2NsaWVudC5qcyc7XG5pbXBvcnQgaW5wdXQgZnJvbSAnLi9pbnB1dC5qcyc7XG5pbXBvcnQgQ2FsaWJyYXRpb24gZnJvbSAnLi9DYWxpYnJhdGlvbi5qcyc7XG5pbXBvcnQgQ2hlY2tpbiBmcm9tICcuL0NoZWNraW4uanMnO1xuaW1wb3J0IENvbnRyb2wgZnJvbSAnLi9Db250cm9sLmpzJztcbmltcG9ydCBEaWFsb2cgZnJvbSAnLi9EaWFsb2cuanMnO1xuaW1wb3J0IEZpbGVsaXN0IGZyb20gJy4vRmlsZWxpc3QuanMnO1xuaW1wb3J0IExvYWRlciBmcm9tICcuL0xvYWRlci5qcyc7XG5pbXBvcnQgTG9jYXRvciBmcm9tICcuL0xvY2F0b3IuanMnO1xuaW1wb3J0IE1vZHVsZSBmcm9tICcuL01vZHVsZS5qcyc7XG5pbXBvcnQgT3JpZW50YXRpb24gZnJvbSAnLi9PcmllbnRhdGlvbi5qcyc7XG5pbXBvcnQgUGVyZm9ybWFuY2UgZnJvbSAnLi9QZXJmb3JtYW5jZS5qcyc7XG5pbXBvcnQgUGxhY2VyIGZyb20gJy4vUGxhY2VyLmpzJztcbmltcG9ydCBQbGF0Zm9ybSBmcm9tICcuL1BsYXRmb3JtLmpzJztcbmltcG9ydCBTZWxlY3RvciBmcm9tICcuL1NlbGVjdG9yLmpzJztcbmltcG9ydCBTZXR1cCBmcm9tICcuL1NldHVwLmpzJzsgLy8gdG8gYmUgcmVtb3ZlZFxuaW1wb3J0IFNwYWNlIGZyb20gJy4vU3BhY2UuanMnO1xuaW1wb3J0IFN1cnZleSBmcm9tICcuL1N1cnZleS5qcyc7XG5pbXBvcnQgU3luYyBmcm9tICcuL1N5bmMuanMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGF1ZGlvQ29udGV4dCxcbiAgY2xpZW50LFxuICBpbnB1dCxcbiAgQ2FsaWJyYXRpb24sXG4gIENoZWNraW4sXG4gIENvbnRyb2wsXG4gIERpYWxvZyxcbiAgRmlsZWxpc3QsXG4gIExvYWRlcixcbiAgTG9jYXRvcixcbiAgTW9kdWxlLFxuICBPcmllbnRhdGlvbixcbiAgUGVyZm9ybWFuY2UsXG4gIFBsYWNlcixcbiAgUGxhdGZvcm0sXG4gIFNlbGVjdG9yLFxuICBTZXR1cCxcbiAgU3BhY2UsXG4gIFN1cnZleSxcbiAgU3luY1xufTtcbiJdfQ==