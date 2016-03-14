'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.viewport = exports.View = exports.TouchSurface = exports.SquaredView = exports.SpaceView = exports.SelectView = exports.SegmentedView = exports.RenderingGroup = exports.Renderer = exports.CanvasView = exports.ButtonView = exports.defaultContent = exports.defaultTemplates = exports.Welcome = exports.Scheduler = exports.MotionInput = exports.Loader = exports.Sync = exports.SharedParams = exports.SharedConfig = exports.Platform = exports.Placer = exports.Network = exports.Locator = exports.ErrorReporter = exports.Checkin = exports.Survey = exports.Experience = exports.SignalAll = exports.Signal = exports.serviceManager = exports.Service = exports.Process = exports.client = exports.audioContext = exports.audio = undefined;

var _wavesAudio = require('waves-audio');

Object.defineProperty(exports, 'audioContext', {
  enumerable: true,
  get: function get() {
    return _wavesAudio.audioContext;
  }
});

var _client = require('./core/client');

Object.defineProperty(exports, 'client', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_client).default;
  }
});

var _Process = require('./core/Process');

Object.defineProperty(exports, 'Process', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Process).default;
  }
});

var _Service = require('./core/Service');

Object.defineProperty(exports, 'Service', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Service).default;
  }
});

var _serviceManager = require('./core/serviceManager');

Object.defineProperty(exports, 'serviceManager', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_serviceManager).default;
  }
});

var _Signal = require('./core/Signal');

Object.defineProperty(exports, 'Signal', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Signal).default;
  }
});

var _SignalAll = require('./core/SignalAll');

Object.defineProperty(exports, 'SignalAll', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_SignalAll).default;
  }
});

var _Experience = require('./scenes/Experience');

Object.defineProperty(exports, 'Experience', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Experience).default;
  }
});

var _Survey = require('./scenes/Survey');

Object.defineProperty(exports, 'Survey', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Survey).default;
  }
});

var _Checkin = require('./services/Checkin');

Object.defineProperty(exports, 'Checkin', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Checkin).default;
  }
});

var _ErrorReporter = require('./services/ErrorReporter');

Object.defineProperty(exports, 'ErrorReporter', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_ErrorReporter).default;
  }
});

var _Locator = require('./services/Locator');

Object.defineProperty(exports, 'Locator', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Locator).default;
  }
});

var _Network = require('./services/Network');

Object.defineProperty(exports, 'Network', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Network).default;
  }
});

var _Placer = require('./services/Placer');

Object.defineProperty(exports, 'Placer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Placer).default;
  }
});

var _Platform = require('./services/Platform');

Object.defineProperty(exports, 'Platform', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Platform).default;
  }
});

var _SharedConfig = require('./services/SharedConfig');

Object.defineProperty(exports, 'SharedConfig', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_SharedConfig).default;
  }
});

var _SharedParams = require('./services/SharedParams');

Object.defineProperty(exports, 'SharedParams', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_SharedParams).default;
  }
});

var _Sync = require('./services/Sync');

Object.defineProperty(exports, 'Sync', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Sync).default;
  }
});

var _Loader = require('./services/Loader');

Object.defineProperty(exports, 'Loader', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Loader).default;
  }
});

var _MotionInput = require('./services/MotionInput');

Object.defineProperty(exports, 'MotionInput', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_MotionInput).default;
  }
});

var _Scheduler = require('./services/Scheduler');

Object.defineProperty(exports, 'Scheduler', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Scheduler).default;
  }
});

var _Welcome = require('./services/Welcome');

Object.defineProperty(exports, 'Welcome', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Welcome).default;
  }
});

var _defaultTemplates = require('./config/defaultTemplates');

Object.defineProperty(exports, 'defaultTemplates', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_defaultTemplates).default;
  }
});

var _defaultContent = require('./config/defaultContent');

Object.defineProperty(exports, 'defaultContent', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_defaultContent).default;
  }
});

var _ButtonView = require('./views/ButtonView');

Object.defineProperty(exports, 'ButtonView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_ButtonView).default;
  }
});

var _CanvasView = require('./views/CanvasView');

Object.defineProperty(exports, 'CanvasView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_CanvasView).default;
  }
});

var _Renderer = require('./views/Renderer');

Object.defineProperty(exports, 'Renderer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Renderer).default;
  }
});

var _RenderingGroup = require('./views/RenderingGroup');

Object.defineProperty(exports, 'RenderingGroup', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_RenderingGroup).default;
  }
});

var _SegmentedView = require('./views/SegmentedView');

Object.defineProperty(exports, 'SegmentedView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_SegmentedView).default;
  }
});

var _SelectView = require('./views/SelectView');

Object.defineProperty(exports, 'SelectView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_SelectView).default;
  }
});

var _SpaceView = require('./views/SpaceView');

Object.defineProperty(exports, 'SpaceView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_SpaceView).default;
  }
});

var _SquaredView = require('./views/SquaredView');

Object.defineProperty(exports, 'SquaredView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_SquaredView).default;
  }
});

var _TouchSurface = require('./views/TouchSurface');

Object.defineProperty(exports, 'TouchSurface', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_TouchSurface).default;
  }
});

var _View = require('./views/View');

Object.defineProperty(exports, 'View', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_View).default;
  }
});

var _viewport = require('./views/viewport');

Object.defineProperty(exports, 'viewport', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_viewport).default;
  }
});

var _audio = _interopRequireWildcard(_wavesAudio);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var audio = exports.audio = _audio; // export * as audio from 'waves-audio';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7Ozs7dUJBRVM7Ozs7Ozs7OzsyQ0FHQTs7Ozs7Ozs7OzRDQUNBOzs7Ozs7Ozs7NENBQ0E7Ozs7Ozs7OzttREFDQTs7Ozs7Ozs7OzJDQUNBOzs7Ozs7Ozs7OENBQ0E7Ozs7Ozs7OzsrQ0FHQTs7Ozs7Ozs7OzJDQUNBOzs7Ozs7Ozs7NENBR0E7Ozs7Ozs7OztrREFDQTs7Ozs7Ozs7OzRDQUNBOzs7Ozs7Ozs7NENBQ0E7Ozs7Ozs7OzsyQ0FDQTs7Ozs7Ozs7OzZDQUNBOzs7Ozs7Ozs7aURBQ0E7Ozs7Ozs7OztpREFDQTs7Ozs7Ozs7O3lDQUNBOzs7Ozs7Ozs7MkNBQ0E7Ozs7Ozs7OztnREFDQTs7Ozs7Ozs7OzhDQUNBOzs7Ozs7Ozs7NENBQ0E7Ozs7Ozs7OztxREFHQTs7Ozs7Ozs7O21EQUNBOzs7Ozs7Ozs7K0NBRUE7Ozs7Ozs7OzsrQ0FDQTs7Ozs7Ozs7OzZDQUNBOzs7Ozs7Ozs7bURBQ0E7Ozs7Ozs7OztrREFDQTs7Ozs7Ozs7OytDQUNBOzs7Ozs7Ozs7OENBQ0E7Ozs7Ozs7OztnREFDQTs7Ozs7Ozs7O2lEQUNBOzs7Ozs7Ozs7eUNBQ0E7Ozs7Ozs7Ozs2Q0FDQTs7OztJQTdDRzs7Ozs7O0FBQ0wsSUFBTSx3QkFBUSxNQUFSIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZXhwb3J0ICogYXMgYXVkaW8gZnJvbSAnd2F2ZXMtYXVkaW8nO1xuaW1wb3J0ICogYXMgX2F1ZGlvIGZyb20gJ3dhdmVzLWF1ZGlvJztcbmV4cG9ydCBjb25zdCBhdWRpbyA9IF9hdWRpbztcbmV4cG9ydCB7IGF1ZGlvQ29udGV4dCB9IGZyb20gJ3dhdmVzLWF1ZGlvJztcblxuLy8gY29yZVxuZXhwb3J0IHsgZGVmYXVsdCBhcyBjbGllbnQgfSBmcm9tICcuL2NvcmUvY2xpZW50JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUHJvY2VzcyB9IGZyb20gJy4vY29yZS9Qcm9jZXNzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU2VydmljZSB9IGZyb20gJy4vY29yZS9TZXJ2aWNlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgc2VydmljZU1hbmFnZXIgfSBmcm9tICcuL2NvcmUvc2VydmljZU1hbmFnZXInO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTaWduYWwgfSBmcm9tICcuL2NvcmUvU2lnbmFsJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU2lnbmFsQWxsIH0gZnJvbSAnLi9jb3JlL1NpZ25hbEFsbCc7XG5cbi8vIHNjZW5lc1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBFeHBlcmllbmNlIH0gZnJvbSAnLi9zY2VuZXMvRXhwZXJpZW5jZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFN1cnZleSB9IGZyb20gJy4vc2NlbmVzL1N1cnZleSc7XG5cbi8vIHNlcnZpY2VzXG5leHBvcnQgeyBkZWZhdWx0IGFzIENoZWNraW4gfSBmcm9tICcuL3NlcnZpY2VzL0NoZWNraW4nO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBFcnJvclJlcG9ydGVyIH0gZnJvbSAnLi9zZXJ2aWNlcy9FcnJvclJlcG9ydGVyJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgTG9jYXRvciB9IGZyb20gJy4vc2VydmljZXMvTG9jYXRvcic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIE5ldHdvcmsgfSBmcm9tICcuL3NlcnZpY2VzL05ldHdvcmsnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBQbGFjZXIgfSBmcm9tICcuL3NlcnZpY2VzL1BsYWNlcic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFBsYXRmb3JtIH0gZnJvbSAnLi9zZXJ2aWNlcy9QbGF0Zm9ybSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFNoYXJlZENvbmZpZyB9IGZyb20gJy4vc2VydmljZXMvU2hhcmVkQ29uZmlnJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU2hhcmVkUGFyYW1zIH0gZnJvbSAnLi9zZXJ2aWNlcy9TaGFyZWRQYXJhbXMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTeW5jIH0gZnJvbSAnLi9zZXJ2aWNlcy9TeW5jJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgTG9hZGVyIH0gZnJvbSAnLi9zZXJ2aWNlcy9Mb2FkZXInO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBNb3Rpb25JbnB1dCB9IGZyb20gJy4vc2VydmljZXMvTW90aW9uSW5wdXQnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTY2hlZHVsZXIgfSBmcm9tICcuL3NlcnZpY2VzL1NjaGVkdWxlcic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFdlbGNvbWUgfSBmcm9tICcuL3NlcnZpY2VzL1dlbGNvbWUnO1xuXG4vLyBjb25maWdcbmV4cG9ydCB7IGRlZmF1bHQgYXMgZGVmYXVsdFRlbXBsYXRlcyB9IGZyb20gJy4vY29uZmlnL2RlZmF1bHRUZW1wbGF0ZXMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBkZWZhdWx0Q29udGVudCB9IGZyb20gJy4vY29uZmlnL2RlZmF1bHRDb250ZW50Jztcbi8vIHZpZXdzXG5leHBvcnQgeyBkZWZhdWx0IGFzIEJ1dHRvblZpZXcgfSBmcm9tICcuL3ZpZXdzL0J1dHRvblZpZXcnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBDYW52YXNWaWV3IH0gZnJvbSAnLi92aWV3cy9DYW52YXNWaWV3JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUmVuZGVyZXIgfSBmcm9tICcuL3ZpZXdzL1JlbmRlcmVyJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUmVuZGVyaW5nR3JvdXAgfSBmcm9tICcuL3ZpZXdzL1JlbmRlcmluZ0dyb3VwJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU2VnbWVudGVkVmlldyB9IGZyb20gJy4vdmlld3MvU2VnbWVudGVkVmlldyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFNlbGVjdFZpZXcgfSBmcm9tICcuL3ZpZXdzL1NlbGVjdFZpZXcnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTcGFjZVZpZXcgfSBmcm9tICcuL3ZpZXdzL1NwYWNlVmlldyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFNxdWFyZWRWaWV3IH0gZnJvbSAnLi92aWV3cy9TcXVhcmVkVmlldyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFRvdWNoU3VyZmFjZSB9IGZyb20gJy4vdmlld3MvVG91Y2hTdXJmYWNlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVmlldyB9IGZyb20gJy4vdmlld3MvVmlldyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHZpZXdwb3J0IH0gZnJvbSAnLi92aWV3cy92aWV3cG9ydCc7XG4iXX0=