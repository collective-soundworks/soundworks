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

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _input = require('./input');

var _input2 = _interopRequireDefault(_input);

var _Calibration = require('./Calibration');

var _Calibration2 = _interopRequireDefault(_Calibration);

var _Checkin = require('./Checkin');

var _Checkin2 = _interopRequireDefault(_Checkin);

var _Control = require('./Control');

var _Control2 = _interopRequireDefault(_Control);

var _Dialog = require('./Dialog');

var _Dialog2 = _interopRequireDefault(_Dialog);

var _Filelist = require('./Filelist');

var _Filelist2 = _interopRequireDefault(_Filelist);

var _Loader = require('./Loader');

var _Loader2 = _interopRequireDefault(_Loader);

var _Locator = require('./Locator');

var _Locator2 = _interopRequireDefault(_Locator);

var _Module = require('./Module');

var _Module2 = _interopRequireDefault(_Module);

var _Orientation = require('./Orientation');

var _Orientation2 = _interopRequireDefault(_Orientation);

var _Performance = require('./Performance');

var _Performance2 = _interopRequireDefault(_Performance);

var _Placer = require('./Placer');

var _Placer2 = _interopRequireDefault(_Placer);

var _Platform = require('./Platform');

var _Platform2 = _interopRequireDefault(_Platform);

var _Selector = require('./Selector');

var _Selector2 = _interopRequireDefault(_Selector);

var _Setup = require('./Setup');

var _Setup2 = _interopRequireDefault(_Setup);

// to be removed

var _Space = require('./Space');

var _Space2 = _interopRequireDefault(_Space);

var _Survey = require('./Survey');

var _Survey2 = _interopRequireDefault(_Survey);

var _Sync = require('./Sync');

var _Sync2 = _interopRequireDefault(_Sync);

exports['default'] = {
  audioContext: _wavesAudio.audioContext,
  client: _client2['default'],
  input: _input2['default'],
  Calibration: _Calibration2['default'],
  Checkin: _Checkin2['default'],
  Control: _Control2['default'],
  Dialog: _Dialog2['default'],
  Filelist: _Filelist2['default'],
  Loader: _Loader2['default'],
  Locator: _Locator2['default'],
  Module: _Module2['default'],
  Orientation: _Orientation2['default'],
  Performance: _Performance2['default'],
  Placer: _Placer2['default'],
  Platform: _Platform2['default'],
  Selector: _Selector2['default'],
  Setup: _Setup2['default'],
  Space: _Space2['default'],
  Survey: _Survey2['default'],
  Sync: _Sync2['default']
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OzswQkFLNkIsYUFBYTs7c0JBQ3ZCLFVBQVU7Ozs7cUJBQ1gsU0FBUzs7OzsyQkFDSCxlQUFlOzs7O3VCQUNuQixXQUFXOzs7O3VCQUNYLFdBQVc7Ozs7c0JBQ1osVUFBVTs7Ozt3QkFDUixZQUFZOzs7O3NCQUNkLFVBQVU7Ozs7dUJBQ1QsV0FBVzs7OztzQkFDWixVQUFVOzs7OzJCQUNMLGVBQWU7Ozs7MkJBQ2YsZUFBZTs7OztzQkFDcEIsVUFBVTs7Ozt3QkFDUixZQUFZOzs7O3dCQUNaLFlBQVk7Ozs7cUJBQ2YsU0FBUzs7Ozs7O3FCQUNULFNBQVM7Ozs7c0JBQ1IsVUFBVTs7OztvQkFDWixRQUFROzs7O3FCQUVWO0FBQ2IsY0FBWSwwQkFBQTtBQUNaLFFBQU0scUJBQUE7QUFDTixPQUFLLG9CQUFBO0FBQ0wsYUFBVywwQkFBQTtBQUNYLFNBQU8sc0JBQUE7QUFDUCxTQUFPLHNCQUFBO0FBQ1AsUUFBTSxxQkFBQTtBQUNOLFVBQVEsdUJBQUE7QUFDUixRQUFNLHFCQUFBO0FBQ04sU0FBTyxzQkFBQTtBQUNQLFFBQU0scUJBQUE7QUFDTixhQUFXLDBCQUFBO0FBQ1gsYUFBVywwQkFBQTtBQUNYLFFBQU0scUJBQUE7QUFDTixVQUFRLHVCQUFBO0FBQ1IsVUFBUSx1QkFBQTtBQUNSLE9BQUssb0JBQUE7QUFDTCxPQUFLLG9CQUFBO0FBQ0wsUUFBTSxxQkFBQTtBQUNOLE1BQUksbUJBQUE7Q0FDTCIsImZpbGUiOiJzcmMvY2xpZW50L2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQHRvZG8gLSBzaG91bGQgYmUgaGFuZGxlZCB3aXRoIGBiYWJlbC1ydW50aW1lYFxuLy8gaWYgKCF3aW5kb3cuUHJvbWlzZSkge1xuLy8gICB3aW5kb3cuUHJvbWlzZSA9IHJlcXVpcmUoJ2VzNi1wcm9taXNlJykuUHJvbWlzZTtcbi8vIH1cblxuaW1wb3J0IHsgYXVkaW9Db250ZXh0IH0gZnJvbSAnd2F2ZXMtYXVkaW8nO1xuaW1wb3J0IGNsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgaW5wdXQgZnJvbSAnLi9pbnB1dCc7XG5pbXBvcnQgQ2FsaWJyYXRpb24gZnJvbSAnLi9DYWxpYnJhdGlvbic7XG5pbXBvcnQgQ2hlY2tpbiBmcm9tICcuL0NoZWNraW4nO1xuaW1wb3J0IENvbnRyb2wgZnJvbSAnLi9Db250cm9sJztcbmltcG9ydCBEaWFsb2cgZnJvbSAnLi9EaWFsb2cnO1xuaW1wb3J0IEZpbGVsaXN0IGZyb20gJy4vRmlsZWxpc3QnO1xuaW1wb3J0IExvYWRlciBmcm9tICcuL0xvYWRlcic7XG5pbXBvcnQgTG9jYXRvciBmcm9tICcuL0xvY2F0b3InO1xuaW1wb3J0IE1vZHVsZSBmcm9tICcuL01vZHVsZSc7XG5pbXBvcnQgT3JpZW50YXRpb24gZnJvbSAnLi9PcmllbnRhdGlvbic7XG5pbXBvcnQgUGVyZm9ybWFuY2UgZnJvbSAnLi9QZXJmb3JtYW5jZSc7XG5pbXBvcnQgUGxhY2VyIGZyb20gJy4vUGxhY2VyJztcbmltcG9ydCBQbGF0Zm9ybSBmcm9tICcuL1BsYXRmb3JtJztcbmltcG9ydCBTZWxlY3RvciBmcm9tICcuL1NlbGVjdG9yJztcbmltcG9ydCBTZXR1cCBmcm9tICcuL1NldHVwJzsgLy8gdG8gYmUgcmVtb3ZlZFxuaW1wb3J0IFNwYWNlIGZyb20gJy4vU3BhY2UnO1xuaW1wb3J0IFN1cnZleSBmcm9tICcuL1N1cnZleSc7XG5pbXBvcnQgU3luYyBmcm9tICcuL1N5bmMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGF1ZGlvQ29udGV4dCxcbiAgY2xpZW50LFxuICBpbnB1dCxcbiAgQ2FsaWJyYXRpb24sXG4gIENoZWNraW4sXG4gIENvbnRyb2wsXG4gIERpYWxvZyxcbiAgRmlsZWxpc3QsXG4gIExvYWRlcixcbiAgTG9jYXRvcixcbiAgTW9kdWxlLFxuICBPcmllbnRhdGlvbixcbiAgUGVyZm9ybWFuY2UsXG4gIFBsYWNlcixcbiAgUGxhdGZvcm0sXG4gIFNlbGVjdG9yLFxuICBTZXR1cCxcbiAgU3BhY2UsXG4gIFN1cnZleSxcbiAgU3luY1xufTtcbiJdfQ==