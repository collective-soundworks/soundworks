'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.viewport = exports.View = exports.TouchSurface = exports.SquaredView = exports.SpaceView = exports.SelectView = exports.SegmentedView = exports.RenderingGroup = exports.Renderer = exports.CanvasView = exports.ButtonView = exports.defaultViewContent = exports.defaultViewTemplates = exports.Scheduler = exports.MotionInput = exports.Loader = exports.Sync = exports.SharedParams = exports.SharedConfig = exports.Platform = exports.Placer = exports.Network = exports.Locator = exports.ErrorReporter = exports.Checkin = exports.Survey = exports.Experience = exports.SignalAll = exports.Signal = exports.serviceManager = exports.Service = exports.Process = exports.client = exports.audioContext = exports.audio = undefined;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFTQTs7Ozs7dUJBRVM7Ozs7Ozs7OzsyQ0FHQTs7Ozs7Ozs7OzRDQUNBOzs7Ozs7Ozs7NENBQ0E7Ozs7Ozs7OzttREFDQTs7Ozs7Ozs7OzJDQUNBOzs7Ozs7Ozs7OENBQ0E7Ozs7Ozs7OzsrQ0FHQTs7Ozs7Ozs7OzJDQUNBOzs7Ozs7Ozs7NENBR0E7Ozs7Ozs7OztrREFDQTs7Ozs7Ozs7OzRDQUNBOzs7Ozs7Ozs7NENBQ0E7Ozs7Ozs7OzsyQ0FDQTs7Ozs7Ozs7OzZDQUNBOzs7Ozs7Ozs7aURBQ0E7Ozs7Ozs7OztpREFDQTs7Ozs7Ozs7O3lDQUNBOzs7Ozs7Ozs7MkNBQ0E7Ozs7Ozs7OztnREFDQTs7Ozs7Ozs7OzhDQUNBOzs7Ozs7Ozs7eURBR0E7Ozs7Ozs7Ozt1REFDQTs7Ozs7Ozs7OytDQUVBOzs7Ozs7Ozs7K0NBQ0E7Ozs7Ozs7Ozs2Q0FDQTs7Ozs7Ozs7O21EQUNBOzs7Ozs7Ozs7a0RBQ0E7Ozs7Ozs7OzsrQ0FDQTs7Ozs7Ozs7OzhDQUNBOzs7Ozs7Ozs7Z0RBQ0E7Ozs7Ozs7OztpREFDQTs7Ozs7Ozs7O3lDQUNBOzs7Ozs7Ozs7NkNBQ0E7Ozs7SUE1Q0c7Ozs7OztBQUNMLElBQU0sd0JBQVEsTUFBUiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ2xpZW50LXNpZGUgZW50cnkgcG9pbnQgb2YgdGhlICpzb3VuZHdvcmtzKiBmcmFtZXdvcmsuXG4gKlxuICogQG1vZHVsZSBzb3VuZHdvcmtzL2NsaWVudFxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIHNvdW5kd29ya3MgZnJvbSAnc291bmR3b3Jrcy9jbGllbnQnO1xuICovXG5cbi8vIGV4cG9ydCAqIGFzIGF1ZGlvIGZyb20gJ3dhdmVzLWF1ZGlvJztcbmltcG9ydCAqIGFzIF9hdWRpbyBmcm9tICd3YXZlcy1hdWRpbyc7XG5leHBvcnQgY29uc3QgYXVkaW8gPSBfYXVkaW87XG5leHBvcnQgeyBhdWRpb0NvbnRleHQgfSBmcm9tICd3YXZlcy1hdWRpbyc7XG5cbi8vIGNvcmVcbmV4cG9ydCB7IGRlZmF1bHQgYXMgY2xpZW50IH0gZnJvbSAnLi9jb3JlL2NsaWVudCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFByb2Nlc3MgfSBmcm9tICcuL2NvcmUvUHJvY2Vzcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFNlcnZpY2UgfSBmcm9tICcuL2NvcmUvU2VydmljZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHNlcnZpY2VNYW5hZ2VyIH0gZnJvbSAnLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU2lnbmFsIH0gZnJvbSAnLi9jb3JlL1NpZ25hbCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFNpZ25hbEFsbCB9IGZyb20gJy4vY29yZS9TaWduYWxBbGwnO1xuXG4vLyBzY2VuZXNcbmV4cG9ydCB7IGRlZmF1bHQgYXMgRXhwZXJpZW5jZSB9IGZyb20gJy4vc2NlbmVzL0V4cGVyaWVuY2UnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTdXJ2ZXkgfSBmcm9tICcuL3NjZW5lcy9TdXJ2ZXknO1xuXG4vLyBzZXJ2aWNlc1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBDaGVja2luIH0gZnJvbSAnLi9zZXJ2aWNlcy9DaGVja2luJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgRXJyb3JSZXBvcnRlciB9IGZyb20gJy4vc2VydmljZXMvRXJyb3JSZXBvcnRlcic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIExvY2F0b3IgfSBmcm9tICcuL3NlcnZpY2VzL0xvY2F0b3InO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBOZXR3b3JrIH0gZnJvbSAnLi9zZXJ2aWNlcy9OZXR3b3JrJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUGxhY2VyIH0gZnJvbSAnLi9zZXJ2aWNlcy9QbGFjZXInO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBQbGF0Zm9ybSB9IGZyb20gJy4vc2VydmljZXMvUGxhdGZvcm0nO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTaGFyZWRDb25maWcgfSBmcm9tICcuL3NlcnZpY2VzL1NoYXJlZENvbmZpZyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFNoYXJlZFBhcmFtcyB9IGZyb20gJy4vc2VydmljZXMvU2hhcmVkUGFyYW1zJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU3luYyB9IGZyb20gJy4vc2VydmljZXMvU3luYyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIExvYWRlciB9IGZyb20gJy4vc2VydmljZXMvTG9hZGVyJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgTW90aW9uSW5wdXQgfSBmcm9tICcuL3NlcnZpY2VzL01vdGlvbklucHV0JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU2NoZWR1bGVyIH0gZnJvbSAnLi9zZXJ2aWNlcy9TY2hlZHVsZXInO1xuXG4vLyBjb25maWdcbmV4cG9ydCB7IGRlZmF1bHQgYXMgZGVmYXVsdFZpZXdUZW1wbGF0ZXMgfSBmcm9tICcuL2NvbmZpZy9kZWZhdWx0Vmlld1RlbXBsYXRlcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGRlZmF1bHRWaWV3Q29udGVudCB9IGZyb20gJy4vY29uZmlnL2RlZmF1bHRWaWV3Q29udGVudCc7XG4vLyB2aWV3c1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBCdXR0b25WaWV3IH0gZnJvbSAnLi92aWV3cy9CdXR0b25WaWV3JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQ2FudmFzVmlldyB9IGZyb20gJy4vdmlld3MvQ2FudmFzVmlldyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFJlbmRlcmVyIH0gZnJvbSAnLi92aWV3cy9SZW5kZXJlcic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFJlbmRlcmluZ0dyb3VwIH0gZnJvbSAnLi92aWV3cy9SZW5kZXJpbmdHcm91cCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFNlZ21lbnRlZFZpZXcgfSBmcm9tICcuL3ZpZXdzL1NlZ21lbnRlZFZpZXcnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTZWxlY3RWaWV3IH0gZnJvbSAnLi92aWV3cy9TZWxlY3RWaWV3JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU3BhY2VWaWV3IH0gZnJvbSAnLi92aWV3cy9TcGFjZVZpZXcnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTcXVhcmVkVmlldyB9IGZyb20gJy4vdmlld3MvU3F1YXJlZFZpZXcnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBUb3VjaFN1cmZhY2UgfSBmcm9tICcuL3ZpZXdzL1RvdWNoU3VyZmFjZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFZpZXcgfSBmcm9tICcuL3ZpZXdzL1ZpZXcnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB2aWV3cG9ydCB9IGZyb20gJy4vdmlld3Mvdmlld3BvcnQnO1xuIl19