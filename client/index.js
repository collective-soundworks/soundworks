'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SquaredView = exports.SpaceView = exports.SelectView = exports.ControllerExperience = exports.ControllerScene = exports.viewport = exports.View = exports.TouchSurface = exports.SegmentedView = exports.CanvasView = exports.CanvasRenderingGroup = exports.Canvas2dRenderer = exports.SyncScheduler = exports.Sync = exports.SharedRecorder = exports.SharedParams = exports.SharedConfig = exports.RawSocket = exports.Platform = exports.Placer = exports.Network = exports.MotionInput = exports.MetricScheduler = exports.Locator = exports.Language = exports.Geolocation = exports.FileSystem = exports.ErrorReporter = exports.Checkin = exports.Auth = exports.AudioScheduler = exports.AudioBufferManager = exports.Service = exports.Process = exports.Experience = exports.client = exports.Activity = exports.version = exports.audioContext = exports.audio = undefined;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImF1ZGlvQ29udGV4dCIsImRlZmF1bHQiLCJfYXVkaW8iLCJhdWRpbyIsInZlcnNpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFTQTs7Ozs7dUJBRVNBLFk7Ozs7Ozs7Ozs2Q0FNQUMsTzs7Ozs7Ozs7OzJDQUNBQSxPOzs7Ozs7Ozs7K0NBQ0FBLE87Ozs7Ozs7Ozs0Q0FDQUEsTzs7Ozs7Ozs7OzRDQUNBQSxPOzs7Ozs7Ozs7dURBR0FBLE87Ozs7Ozs7OzttREFDQUEsTzs7Ozs7Ozs7O3lDQUNBQSxPOzs7Ozs7Ozs7NENBQ0FBLE87Ozs7Ozs7OztrREFDQUEsTzs7Ozs7Ozs7OytDQUNBQSxPOzs7Ozs7Ozs7Z0RBQ0FBLE87Ozs7Ozs7Ozs2Q0FDQUEsTzs7Ozs7Ozs7OzRDQUNBQSxPOzs7Ozs7Ozs7b0RBQ0FBLE87Ozs7Ozs7OztnREFDQUEsTzs7Ozs7Ozs7OzRDQUNBQSxPOzs7Ozs7Ozs7MkNBQ0FBLE87Ozs7Ozs7Ozs2Q0FDQUEsTzs7Ozs7Ozs7OzhDQUNBQSxPOzs7Ozs7Ozs7aURBQ0FBLE87Ozs7Ozs7OztpREFDQUEsTzs7Ozs7Ozs7O21EQUNBQSxPOzs7Ozs7Ozs7eUNBQ0FBLE87Ozs7Ozs7OztrREFDQUEsTzs7Ozs7Ozs7O3FEQUdBQSxPOzs7Ozs7Ozs7eURBQ0FBLE87Ozs7Ozs7OzsrQ0FDQUEsTzs7Ozs7Ozs7O2tEQUNBQSxPOzs7Ozs7Ozs7aURBQ0FBLE87Ozs7Ozs7Ozt5Q0FDQUEsTzs7Ozs7Ozs7OzZDQUNBQSxPOzs7Ozs7Ozs7b0RBR0FBLE87Ozs7Ozs7Ozt5REFDQUEsTzs7Ozs7Ozs7OytDQUNBQSxPOzs7Ozs7Ozs7OENBQ0FBLE87Ozs7Ozs7OztnREFDQUEsTzs7OztJQWxER0MsTTs7Ozs7O0FBQ0wsSUFBTUMsd0JBQVFELE1BQWQsQyxDQVZQOzs7Ozs7OztBQVFBOzs7QUFLQTtBQUNPLElBQU1FLDRCQUFVLFdBQWhCOztBQUVQIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDbGllbnQtc2lkZSBlbnRyeSBwb2ludCBvZiB0aGUgKnNvdW5kd29ya3MqIGZyYW1ld29yay5cbiAqXG4gKiBAbW9kdWxlIHNvdW5kd29ya3MvY2xpZW50XG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgc291bmR3b3JrcyBmcm9tICdzb3VuZHdvcmtzL2NsaWVudCc7XG4gKi9cblxuLy8gZXhwb3J0ICogYXMgYXVkaW8gZnJvbSAnd2F2ZXMtYXVkaW8nO1xuaW1wb3J0ICogYXMgX2F1ZGlvIGZyb20gJ3dhdmVzLWF1ZGlvJztcbmV4cG9ydCBjb25zdCBhdWRpbyA9IF9hdWRpbztcbmV4cG9ydCB7IGF1ZGlvQ29udGV4dCB9IGZyb20gJ3dhdmVzLWF1ZGlvJztcblxuLy8gdmVyc2lvbiAoY2YuIGJpbi9qYXZhc2NyaXB0cylcbmV4cG9ydCBjb25zdCB2ZXJzaW9uID0gJyV2ZXJzaW9uJSc7XG5cbi8vIGNvcmVcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQWN0aXZpdHkgfSBmcm9tICcuL2NvcmUvQWN0aXZpdHknO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBjbGllbnQgfSBmcm9tICcuL2NvcmUvY2xpZW50JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgRXhwZXJpZW5jZSB9IGZyb20gJy4vY29yZS9FeHBlcmllbmNlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUHJvY2VzcyB9IGZyb20gJy4vY29yZS9Qcm9jZXNzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU2VydmljZSB9IGZyb20gJy4vY29yZS9TZXJ2aWNlJztcblxuLy8gc2VydmljZXNcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQXVkaW9CdWZmZXJNYW5hZ2VyIH0gZnJvbSAnLi9zZXJ2aWNlcy9BdWRpb0J1ZmZlck1hbmFnZXInO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBBdWRpb1NjaGVkdWxlciB9IGZyb20gJy4vc2VydmljZXMvQXVkaW9TY2hlZHVsZXInO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBBdXRoIH0gZnJvbSAnLi9zZXJ2aWNlcy9BdXRoJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQ2hlY2tpbiB9IGZyb20gJy4vc2VydmljZXMvQ2hlY2tpbic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEVycm9yUmVwb3J0ZXIgfSBmcm9tICcuL3NlcnZpY2VzL0Vycm9yUmVwb3J0ZXInO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBGaWxlU3lzdGVtIH0gZnJvbSAnLi9zZXJ2aWNlcy9GaWxlU3lzdGVtJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgR2VvbG9jYXRpb24gfSBmcm9tICcuL3NlcnZpY2VzL0dlb2xvY2F0aW9uJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgTGFuZ3VhZ2UgfSBmcm9tICcuL3NlcnZpY2VzL0xhbmd1YWdlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgTG9jYXRvciB9IGZyb20gJy4vc2VydmljZXMvTG9jYXRvcic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIE1ldHJpY1NjaGVkdWxlciB9IGZyb20gJy4vc2VydmljZXMvTWV0cmljU2NoZWR1bGVyJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgTW90aW9uSW5wdXQgfSBmcm9tICcuL3NlcnZpY2VzL01vdGlvbklucHV0JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgTmV0d29yayB9IGZyb20gJy4vc2VydmljZXMvTmV0d29yayc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFBsYWNlciB9IGZyb20gJy4vc2VydmljZXMvUGxhY2VyJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUGxhdGZvcm0gfSBmcm9tICcuL3NlcnZpY2VzL1BsYXRmb3JtJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUmF3U29ja2V0IH0gZnJvbSAnLi9zZXJ2aWNlcy9SYXdTb2NrZXQnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTaGFyZWRDb25maWcgfSBmcm9tICcuL3NlcnZpY2VzL1NoYXJlZENvbmZpZyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFNoYXJlZFBhcmFtcyB9IGZyb20gJy4vc2VydmljZXMvU2hhcmVkUGFyYW1zJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU2hhcmVkUmVjb3JkZXIgfSBmcm9tICcuL3NlcnZpY2VzL1NoYXJlZFJlY29yZGVyJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU3luYyB9IGZyb20gJy4vc2VydmljZXMvU3luYyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFN5bmNTY2hlZHVsZXIgfSBmcm9tICcuL3NlcnZpY2VzL1N5bmNTY2hlZHVsZXInO1xuXG4vLyB2aWV3c1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBDYW52YXMyZFJlbmRlcmVyIH0gZnJvbSAnLi92aWV3cy9DYW52YXMyZFJlbmRlcmVyJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQ2FudmFzUmVuZGVyaW5nR3JvdXAgfSBmcm9tICcuL3ZpZXdzL0NhbnZhc1JlbmRlcmluZ0dyb3VwJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQ2FudmFzVmlldyB9IGZyb20gJy4vdmlld3MvQ2FudmFzVmlldyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFNlZ21lbnRlZFZpZXcgfSBmcm9tICcuL3ZpZXdzL1NlZ21lbnRlZFZpZXcnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBUb3VjaFN1cmZhY2UgfSBmcm9tICcuL3ZpZXdzL1RvdWNoU3VyZmFjZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFZpZXcgfSBmcm9tICcuL3ZpZXdzL1ZpZXcnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB2aWV3cG9ydCB9IGZyb20gJy4vdmlld3Mvdmlld3BvcnQnO1xuXG4vLyBwcmVmYWJzXG5leHBvcnQgeyBkZWZhdWx0IGFzIENvbnRyb2xsZXJTY2VuZSB9IGZyb20gJy4vcHJlZmFicy9Db250cm9sbGVyU2NlbmUnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBDb250cm9sbGVyRXhwZXJpZW5jZSB9IGZyb20gJy4vcHJlZmFicy9Db250cm9sbGVyRXhwZXJpZW5jZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFNlbGVjdFZpZXcgfSBmcm9tICcuL3ByZWZhYnMvU2VsZWN0Vmlldyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFNwYWNlVmlldyB9IGZyb20gJy4vcHJlZmFicy9TcGFjZVZpZXcnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTcXVhcmVkVmlldyB9IGZyb20gJy4vcHJlZmFicy9TcXVhcmVkVmlldyc7XG4iXX0=