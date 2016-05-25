'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.viewport = exports.View = exports.TouchSurface = exports.SquaredView = exports.SpaceView = exports.SelectView = exports.SegmentedView = exports.RenderingGroup = exports.Renderer = exports.CanvasView = exports.ButtonView = exports.defaultViewContent = exports.defaultViewTemplates = exports.Scheduler = exports.MotionInput = exports.Loader = exports.Sync = exports.SharedParams = exports.SharedConfig = exports.Platform = exports.Placer = exports.Network = exports.Locator = exports.ErrorReporter = exports.Checkin = exports.Survey = exports.Experience = exports.Conductor = exports.SignalAll = exports.Signal = exports.serviceManager = exports.Service = exports.Scene = exports.Process = exports.client = exports.Activity = exports.audioContext = exports.audio = undefined;

var _wavesAudio = require('waves-audio');

Object.defineProperty(exports, 'audioContext', {
  enumerable: true,
  get: function get() {
    return _wavesAudio.audioContext;
  }
});

var _Activity = require('./core/Activity');

Object.defineProperty(exports, 'Activity', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Activity).default;
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

var _Scene = require('./core/Scene');

Object.defineProperty(exports, 'Scene', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Scene).default;
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

var _Conductor = require('./scenes/Conductor');

Object.defineProperty(exports, 'Conductor', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Conductor).default;
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

var _defaultViewTemplates = require('./config/defaultViewTemplates');

Object.defineProperty(exports, 'defaultViewTemplates', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_defaultViewTemplates).default;
  }
});

var _defaultViewContent = require('./config/defaultViewContent');

Object.defineProperty(exports, 'defaultViewContent', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_defaultViewContent).default;
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

var audio = exports.audio = _audio; /**
                                     * Client-side entry point of the *soundworks* framework.
                                     *
                                     * @module soundworks/client
                                     * @example
                                     * import * as soundworks from 'soundworks/client';
                                     */

// export * as audio from 'waves-audio';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFTQTs7Ozs7dUJBRVMsWTs7Ozs7Ozs7OzZDQUdBLE87Ozs7Ozs7OzsyQ0FDQSxPOzs7Ozs7Ozs7NENBQ0EsTzs7Ozs7Ozs7OzBDQUNBLE87Ozs7Ozs7Ozs0Q0FDQSxPOzs7Ozs7Ozs7bURBQ0EsTzs7Ozs7Ozs7OzJDQUNBLE87Ozs7Ozs7Ozs4Q0FDQSxPOzs7Ozs7Ozs7OENBR0EsTzs7Ozs7Ozs7OytDQUNBLE87Ozs7Ozs7OzsyQ0FDQSxPOzs7Ozs7Ozs7NENBR0EsTzs7Ozs7Ozs7O2tEQUNBLE87Ozs7Ozs7Ozs0Q0FDQSxPOzs7Ozs7Ozs7NENBQ0EsTzs7Ozs7Ozs7OzJDQUNBLE87Ozs7Ozs7Ozs2Q0FDQSxPOzs7Ozs7Ozs7aURBQ0EsTzs7Ozs7Ozs7O2lEQUNBLE87Ozs7Ozs7Ozt5Q0FDQSxPOzs7Ozs7Ozs7MkNBQ0EsTzs7Ozs7Ozs7O2dEQUNBLE87Ozs7Ozs7Ozs4Q0FDQSxPOzs7Ozs7Ozs7eURBR0EsTzs7Ozs7Ozs7O3VEQUNBLE87Ozs7Ozs7OzsrQ0FFQSxPOzs7Ozs7Ozs7K0NBQ0EsTzs7Ozs7Ozs7OzZDQUNBLE87Ozs7Ozs7OzttREFDQSxPOzs7Ozs7Ozs7a0RBQ0EsTzs7Ozs7Ozs7OytDQUNBLE87Ozs7Ozs7Ozs4Q0FDQSxPOzs7Ozs7Ozs7Z0RBQ0EsTzs7Ozs7Ozs7O2lEQUNBLE87Ozs7Ozs7Ozt5Q0FDQSxPOzs7Ozs7Ozs7NkNBQ0EsTzs7OztJQS9DRyxNOzs7Ozs7QUFDTCxJQUFNLHdCQUFRLE1BQWQsQyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ2xpZW50LXNpZGUgZW50cnkgcG9pbnQgb2YgdGhlICpzb3VuZHdvcmtzKiBmcmFtZXdvcmsuXG4gKlxuICogQG1vZHVsZSBzb3VuZHdvcmtzL2NsaWVudFxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIHNvdW5kd29ya3MgZnJvbSAnc291bmR3b3Jrcy9jbGllbnQnO1xuICovXG5cbi8vIGV4cG9ydCAqIGFzIGF1ZGlvIGZyb20gJ3dhdmVzLWF1ZGlvJztcbmltcG9ydCAqIGFzIF9hdWRpbyBmcm9tICd3YXZlcy1hdWRpbyc7XG5leHBvcnQgY29uc3QgYXVkaW8gPSBfYXVkaW87XG5leHBvcnQgeyBhdWRpb0NvbnRleHQgfSBmcm9tICd3YXZlcy1hdWRpbyc7XG5cbi8vIGNvcmVcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQWN0aXZpdHkgfSBmcm9tICcuL2NvcmUvQWN0aXZpdHknO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBjbGllbnQgfSBmcm9tICcuL2NvcmUvY2xpZW50JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUHJvY2VzcyB9IGZyb20gJy4vY29yZS9Qcm9jZXNzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU2NlbmUgfSBmcm9tICcuL2NvcmUvU2NlbmUnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTZXJ2aWNlIH0gZnJvbSAnLi9jb3JlL1NlcnZpY2UnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBzZXJ2aWNlTWFuYWdlciB9IGZyb20gJy4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFNpZ25hbCB9IGZyb20gJy4vY29yZS9TaWduYWwnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTaWduYWxBbGwgfSBmcm9tICcuL2NvcmUvU2lnbmFsQWxsJztcblxuLy8gc2NlbmVzXG5leHBvcnQgeyBkZWZhdWx0IGFzIENvbmR1Y3RvciB9IGZyb20gJy4vc2NlbmVzL0NvbmR1Y3Rvcic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEV4cGVyaWVuY2UgfSBmcm9tICcuL3NjZW5lcy9FeHBlcmllbmNlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU3VydmV5IH0gZnJvbSAnLi9zY2VuZXMvU3VydmV5JztcblxuLy8gc2VydmljZXNcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQ2hlY2tpbiB9IGZyb20gJy4vc2VydmljZXMvQ2hlY2tpbic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEVycm9yUmVwb3J0ZXIgfSBmcm9tICcuL3NlcnZpY2VzL0Vycm9yUmVwb3J0ZXInO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBMb2NhdG9yIH0gZnJvbSAnLi9zZXJ2aWNlcy9Mb2NhdG9yJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgTmV0d29yayB9IGZyb20gJy4vc2VydmljZXMvTmV0d29yayc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFBsYWNlciB9IGZyb20gJy4vc2VydmljZXMvUGxhY2VyJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUGxhdGZvcm0gfSBmcm9tICcuL3NlcnZpY2VzL1BsYXRmb3JtJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU2hhcmVkQ29uZmlnIH0gZnJvbSAnLi9zZXJ2aWNlcy9TaGFyZWRDb25maWcnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTaGFyZWRQYXJhbXMgfSBmcm9tICcuL3NlcnZpY2VzL1NoYXJlZFBhcmFtcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFN5bmMgfSBmcm9tICcuL3NlcnZpY2VzL1N5bmMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBMb2FkZXIgfSBmcm9tICcuL3NlcnZpY2VzL0xvYWRlcic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIE1vdGlvbklucHV0IH0gZnJvbSAnLi9zZXJ2aWNlcy9Nb3Rpb25JbnB1dCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFNjaGVkdWxlciB9IGZyb20gJy4vc2VydmljZXMvU2NoZWR1bGVyJztcblxuLy8gY29uZmlnXG5leHBvcnQgeyBkZWZhdWx0IGFzIGRlZmF1bHRWaWV3VGVtcGxhdGVzIH0gZnJvbSAnLi9jb25maWcvZGVmYXVsdFZpZXdUZW1wbGF0ZXMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBkZWZhdWx0Vmlld0NvbnRlbnQgfSBmcm9tICcuL2NvbmZpZy9kZWZhdWx0Vmlld0NvbnRlbnQnO1xuLy8gdmlld3NcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQnV0dG9uVmlldyB9IGZyb20gJy4vdmlld3MvQnV0dG9uVmlldyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIENhbnZhc1ZpZXcgfSBmcm9tICcuL3ZpZXdzL0NhbnZhc1ZpZXcnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBSZW5kZXJlciB9IGZyb20gJy4vdmlld3MvUmVuZGVyZXInO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBSZW5kZXJpbmdHcm91cCB9IGZyb20gJy4vdmlld3MvUmVuZGVyaW5nR3JvdXAnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTZWdtZW50ZWRWaWV3IH0gZnJvbSAnLi92aWV3cy9TZWdtZW50ZWRWaWV3JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU2VsZWN0VmlldyB9IGZyb20gJy4vdmlld3MvU2VsZWN0Vmlldyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFNwYWNlVmlldyB9IGZyb20gJy4vdmlld3MvU3BhY2VWaWV3JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU3F1YXJlZFZpZXcgfSBmcm9tICcuL3ZpZXdzL1NxdWFyZWRWaWV3JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVG91Y2hTdXJmYWNlIH0gZnJvbSAnLi92aWV3cy9Ub3VjaFN1cmZhY2UnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBWaWV3IH0gZnJvbSAnLi92aWV3cy9WaWV3JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgdmlld3BvcnQgfSBmcm9tICcuL3ZpZXdzL3ZpZXdwb3J0JztcbiJdfQ==