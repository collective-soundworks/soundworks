'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SquaredView = exports.SpaceView = exports.SelectView = exports.ControllerExperience = exports.ControllerScene = exports.viewport = exports.View = exports.TouchSurface = exports.SegmentedView = exports.CanvasView = exports.CanvasRenderingGroup = exports.Canvas2dRenderer = exports.SyncScheduler = exports.Sync = exports.SharedRecorder = exports.SharedParams = exports.SharedConfig = exports.RawSocket = exports.Platform = exports.Placer = exports.Network = exports.MotionInput = exports.MetricScheduler = exports.Locator = exports.Language = exports.Geolocation = exports.FileSystem = exports.ErrorReporter = exports.Checkin = exports.Auth = exports.AudioScheduler = exports.AudioBufferManager = exports.serviceManager = exports.Service = exports.Process = exports.Experience = exports.client = exports.Activity = exports.version = exports.audioContext = exports.audio = undefined;

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

var _Experience = require('./core/Experience');

Object.defineProperty(exports, 'Experience', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Experience).default;
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

var _AudioBufferManager = require('./services/AudioBufferManager');

Object.defineProperty(exports, 'AudioBufferManager', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_AudioBufferManager).default;
  }
});

var _AudioScheduler = require('./services/AudioScheduler');

Object.defineProperty(exports, 'AudioScheduler', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_AudioScheduler).default;
  }
});

var _Auth = require('./services/Auth');

Object.defineProperty(exports, 'Auth', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Auth).default;
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

var _FileSystem = require('./services/FileSystem');

Object.defineProperty(exports, 'FileSystem', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_FileSystem).default;
  }
});

var _Geolocation = require('./services/Geolocation');

Object.defineProperty(exports, 'Geolocation', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Geolocation).default;
  }
});

var _Language = require('./services/Language');

Object.defineProperty(exports, 'Language', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Language).default;
  }
});

var _Locator = require('./services/Locator');

Object.defineProperty(exports, 'Locator', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Locator).default;
  }
});

var _MetricScheduler = require('./services/MetricScheduler');

Object.defineProperty(exports, 'MetricScheduler', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_MetricScheduler).default;
  }
});

var _MotionInput = require('./services/MotionInput');

Object.defineProperty(exports, 'MotionInput', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_MotionInput).default;
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

var _RawSocket = require('./services/RawSocket');

Object.defineProperty(exports, 'RawSocket', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_RawSocket).default;
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

var _SharedRecorder = require('./services/SharedRecorder');

Object.defineProperty(exports, 'SharedRecorder', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_SharedRecorder).default;
  }
});

var _Sync = require('./services/Sync');

Object.defineProperty(exports, 'Sync', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Sync).default;
  }
});

var _SyncScheduler = require('./services/SyncScheduler');

Object.defineProperty(exports, 'SyncScheduler', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_SyncScheduler).default;
  }
});

var _Canvas2dRenderer = require('./views/Canvas2dRenderer');

Object.defineProperty(exports, 'Canvas2dRenderer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Canvas2dRenderer).default;
  }
});

var _CanvasRenderingGroup = require('./views/CanvasRenderingGroup');

Object.defineProperty(exports, 'CanvasRenderingGroup', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_CanvasRenderingGroup).default;
  }
});

var _CanvasView = require('./views/CanvasView');

Object.defineProperty(exports, 'CanvasView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_CanvasView).default;
  }
});

var _SegmentedView = require('./views/SegmentedView');

Object.defineProperty(exports, 'SegmentedView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_SegmentedView).default;
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

var _ControllerScene = require('./prefabs/ControllerScene');

Object.defineProperty(exports, 'ControllerScene', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_ControllerScene).default;
  }
});

var _ControllerExperience = require('./prefabs/ControllerExperience');

Object.defineProperty(exports, 'ControllerExperience', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_ControllerExperience).default;
  }
});

var _SelectView = require('./prefabs/SelectView');

Object.defineProperty(exports, 'SelectView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_SelectView).default;
  }
});

var _SpaceView = require('./prefabs/SpaceView');

Object.defineProperty(exports, 'SpaceView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_SpaceView).default;
  }
});

var _SquaredView = require('./prefabs/SquaredView');

Object.defineProperty(exports, 'SquaredView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_SquaredView).default;
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


// version (cf. bin/javascripts)
var version = exports.version = '2.0.0';

// core
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImF1ZGlvQ29udGV4dCIsImRlZmF1bHQiLCJfYXVkaW8iLCJhdWRpbyIsInZlcnNpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFTQTs7Ozs7dUJBRVNBLFk7Ozs7Ozs7Ozs2Q0FNQUMsTzs7Ozs7Ozs7OzJDQUNBQSxPOzs7Ozs7Ozs7K0NBQ0FBLE87Ozs7Ozs7Ozs0Q0FDQUEsTzs7Ozs7Ozs7OzRDQUNBQSxPOzs7Ozs7Ozs7bURBQ0FBLE87Ozs7Ozs7Ozt1REFHQUEsTzs7Ozs7Ozs7O21EQUNBQSxPOzs7Ozs7Ozs7eUNBQ0FBLE87Ozs7Ozs7Ozs0Q0FDQUEsTzs7Ozs7Ozs7O2tEQUNBQSxPOzs7Ozs7Ozs7K0NBQ0FBLE87Ozs7Ozs7OztnREFDQUEsTzs7Ozs7Ozs7OzZDQUNBQSxPOzs7Ozs7Ozs7NENBQ0FBLE87Ozs7Ozs7OztvREFDQUEsTzs7Ozs7Ozs7O2dEQUNBQSxPOzs7Ozs7Ozs7NENBQ0FBLE87Ozs7Ozs7OzsyQ0FDQUEsTzs7Ozs7Ozs7OzZDQUNBQSxPOzs7Ozs7Ozs7OENBQ0FBLE87Ozs7Ozs7OztpREFDQUEsTzs7Ozs7Ozs7O2lEQUNBQSxPOzs7Ozs7Ozs7bURBQ0FBLE87Ozs7Ozs7Ozt5Q0FDQUEsTzs7Ozs7Ozs7O2tEQUNBQSxPOzs7Ozs7Ozs7cURBR0FBLE87Ozs7Ozs7Ozt5REFDQUEsTzs7Ozs7Ozs7OytDQUNBQSxPOzs7Ozs7Ozs7a0RBQ0FBLE87Ozs7Ozs7OztpREFDQUEsTzs7Ozs7Ozs7O3lDQUNBQSxPOzs7Ozs7Ozs7NkNBQ0FBLE87Ozs7Ozs7OztvREFHQUEsTzs7Ozs7Ozs7O3lEQUNBQSxPOzs7Ozs7Ozs7K0NBQ0FBLE87Ozs7Ozs7Ozs4Q0FDQUEsTzs7Ozs7Ozs7O2dEQUNBQSxPOzs7O0lBbkRHQyxNOzs7Ozs7QUFDTCxJQUFNQyx3QkFBUUQsTUFBZCxDLENBVlA7Ozs7Ozs7O0FBUUE7OztBQUtBO0FBQ08sSUFBTUUsNEJBQVUsV0FBaEI7O0FBRVAiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENsaWVudC1zaWRlIGVudHJ5IHBvaW50IG9mIHRoZSAqc291bmR3b3JrcyogZnJhbWV3b3JrLlxuICpcbiAqIEBtb2R1bGUgc291bmR3b3Jrcy9jbGllbnRcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBzb3VuZHdvcmtzIGZyb20gJ3NvdW5kd29ya3MvY2xpZW50JztcbiAqL1xuXG4vLyBleHBvcnQgKiBhcyBhdWRpbyBmcm9tICd3YXZlcy1hdWRpbyc7XG5pbXBvcnQgKiBhcyBfYXVkaW8gZnJvbSAnd2F2ZXMtYXVkaW8nO1xuZXhwb3J0IGNvbnN0IGF1ZGlvID0gX2F1ZGlvO1xuZXhwb3J0IHsgYXVkaW9Db250ZXh0IH0gZnJvbSAnd2F2ZXMtYXVkaW8nO1xuXG4vLyB2ZXJzaW9uIChjZi4gYmluL2phdmFzY3JpcHRzKVxuZXhwb3J0IGNvbnN0IHZlcnNpb24gPSAnJXZlcnNpb24lJztcblxuLy8gY29yZVxuZXhwb3J0IHsgZGVmYXVsdCBhcyBBY3Rpdml0eSB9IGZyb20gJy4vY29yZS9BY3Rpdml0eSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGNsaWVudCB9IGZyb20gJy4vY29yZS9jbGllbnQnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBFeHBlcmllbmNlIH0gZnJvbSAnLi9jb3JlL0V4cGVyaWVuY2UnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBQcm9jZXNzIH0gZnJvbSAnLi9jb3JlL1Byb2Nlc3MnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTZXJ2aWNlIH0gZnJvbSAnLi9jb3JlL1NlcnZpY2UnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBzZXJ2aWNlTWFuYWdlciB9IGZyb20gJy4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbi8vIHNlcnZpY2VzXG5leHBvcnQgeyBkZWZhdWx0IGFzIEF1ZGlvQnVmZmVyTWFuYWdlciB9IGZyb20gJy4vc2VydmljZXMvQXVkaW9CdWZmZXJNYW5hZ2VyJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQXVkaW9TY2hlZHVsZXIgfSBmcm9tICcuL3NlcnZpY2VzL0F1ZGlvU2NoZWR1bGVyJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQXV0aCB9IGZyb20gJy4vc2VydmljZXMvQXV0aCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIENoZWNraW4gfSBmcm9tICcuL3NlcnZpY2VzL0NoZWNraW4nO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBFcnJvclJlcG9ydGVyIH0gZnJvbSAnLi9zZXJ2aWNlcy9FcnJvclJlcG9ydGVyJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgRmlsZVN5c3RlbSB9IGZyb20gJy4vc2VydmljZXMvRmlsZVN5c3RlbSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEdlb2xvY2F0aW9uIH0gZnJvbSAnLi9zZXJ2aWNlcy9HZW9sb2NhdGlvbic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIExhbmd1YWdlIH0gZnJvbSAnLi9zZXJ2aWNlcy9MYW5ndWFnZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIExvY2F0b3IgfSBmcm9tICcuL3NlcnZpY2VzL0xvY2F0b3InO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBNZXRyaWNTY2hlZHVsZXIgfSBmcm9tICcuL3NlcnZpY2VzL01ldHJpY1NjaGVkdWxlcic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIE1vdGlvbklucHV0IH0gZnJvbSAnLi9zZXJ2aWNlcy9Nb3Rpb25JbnB1dCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIE5ldHdvcmsgfSBmcm9tICcuL3NlcnZpY2VzL05ldHdvcmsnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBQbGFjZXIgfSBmcm9tICcuL3NlcnZpY2VzL1BsYWNlcic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFBsYXRmb3JtIH0gZnJvbSAnLi9zZXJ2aWNlcy9QbGF0Zm9ybSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFJhd1NvY2tldCB9IGZyb20gJy4vc2VydmljZXMvUmF3U29ja2V0JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU2hhcmVkQ29uZmlnIH0gZnJvbSAnLi9zZXJ2aWNlcy9TaGFyZWRDb25maWcnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTaGFyZWRQYXJhbXMgfSBmcm9tICcuL3NlcnZpY2VzL1NoYXJlZFBhcmFtcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFNoYXJlZFJlY29yZGVyIH0gZnJvbSAnLi9zZXJ2aWNlcy9TaGFyZWRSZWNvcmRlcic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFN5bmMgfSBmcm9tICcuL3NlcnZpY2VzL1N5bmMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTeW5jU2NoZWR1bGVyIH0gZnJvbSAnLi9zZXJ2aWNlcy9TeW5jU2NoZWR1bGVyJztcblxuLy8gdmlld3NcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQ2FudmFzMmRSZW5kZXJlciB9IGZyb20gJy4vdmlld3MvQ2FudmFzMmRSZW5kZXJlcic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIENhbnZhc1JlbmRlcmluZ0dyb3VwIH0gZnJvbSAnLi92aWV3cy9DYW52YXNSZW5kZXJpbmdHcm91cCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIENhbnZhc1ZpZXcgfSBmcm9tICcuL3ZpZXdzL0NhbnZhc1ZpZXcnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTZWdtZW50ZWRWaWV3IH0gZnJvbSAnLi92aWV3cy9TZWdtZW50ZWRWaWV3JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVG91Y2hTdXJmYWNlIH0gZnJvbSAnLi92aWV3cy9Ub3VjaFN1cmZhY2UnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBWaWV3IH0gZnJvbSAnLi92aWV3cy9WaWV3JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgdmlld3BvcnQgfSBmcm9tICcuL3ZpZXdzL3ZpZXdwb3J0JztcblxuLy8gcHJlZmFic1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBDb250cm9sbGVyU2NlbmUgfSBmcm9tICcuL3ByZWZhYnMvQ29udHJvbGxlclNjZW5lJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQ29udHJvbGxlckV4cGVyaWVuY2UgfSBmcm9tICcuL3ByZWZhYnMvQ29udHJvbGxlckV4cGVyaWVuY2UnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTZWxlY3RWaWV3IH0gZnJvbSAnLi9wcmVmYWJzL1NlbGVjdFZpZXcnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTcGFjZVZpZXcgfSBmcm9tICcuL3ByZWZhYnMvU3BhY2VWaWV3JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU3F1YXJlZFZpZXcgfSBmcm9tICcuL3ByZWZhYnMvU3F1YXJlZFZpZXcnO1xuIl19