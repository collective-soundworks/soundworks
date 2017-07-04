'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SquaredView = exports.SpaceView = exports.SelectView = exports.ControllerExperience = exports.ControllerScene = exports.viewport = exports.View = exports.TouchSurface = exports.SegmentedView = exports.CanvasView = exports.CanvasRenderingGroup = exports.Canvas2dRenderer = exports.SyncScheduler = exports.Sync = exports.SharedRecorder = exports.SharedParams = exports.SharedConfig = exports.RawSocket = exports.Platform = exports.Placer = exports.Network = exports.MotionInput = exports.MetricScheduler = exports.Locator = exports.Language = exports.Geolocation = exports.FileSystem = exports.ErrorReporter = exports.Checkin = exports.Auth = exports.AudioScheduler = exports.AudioStreamManager = exports.AudioBufferManager = exports.serviceManager = exports.Service = exports.Process = exports.Experience = exports.client = exports.Activity = exports.version = exports.audioContext = exports.audio = undefined;

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

var _AudioStreamManager = require('./services/AudioStreamManager');

Object.defineProperty(exports, 'AudioStreamManager', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_AudioStreamManager).default;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImF1ZGlvQ29udGV4dCIsImRlZmF1bHQiLCJfYXVkaW8iLCJhdWRpbyIsInZlcnNpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFTQTs7Ozs7dUJBRVNBLFk7Ozs7Ozs7Ozs2Q0FNQUMsTzs7Ozs7Ozs7OzJDQUNBQSxPOzs7Ozs7Ozs7K0NBQ0FBLE87Ozs7Ozs7Ozs0Q0FDQUEsTzs7Ozs7Ozs7OzRDQUNBQSxPOzs7Ozs7Ozs7bURBQ0FBLE87Ozs7Ozs7Ozt1REFHQUEsTzs7Ozs7Ozs7O3VEQUNBQSxPOzs7Ozs7Ozs7bURBQ0FBLE87Ozs7Ozs7Ozt5Q0FDQUEsTzs7Ozs7Ozs7OzRDQUNBQSxPOzs7Ozs7Ozs7a0RBQ0FBLE87Ozs7Ozs7OzsrQ0FDQUEsTzs7Ozs7Ozs7O2dEQUNBQSxPOzs7Ozs7Ozs7NkNBQ0FBLE87Ozs7Ozs7Ozs0Q0FDQUEsTzs7Ozs7Ozs7O29EQUNBQSxPOzs7Ozs7Ozs7Z0RBQ0FBLE87Ozs7Ozs7Ozs0Q0FDQUEsTzs7Ozs7Ozs7OzJDQUNBQSxPOzs7Ozs7Ozs7NkNBQ0FBLE87Ozs7Ozs7Ozs4Q0FDQUEsTzs7Ozs7Ozs7O2lEQUNBQSxPOzs7Ozs7Ozs7aURBQ0FBLE87Ozs7Ozs7OzttREFDQUEsTzs7Ozs7Ozs7O3lDQUNBQSxPOzs7Ozs7Ozs7a0RBQ0FBLE87Ozs7Ozs7OztxREFHQUEsTzs7Ozs7Ozs7O3lEQUNBQSxPOzs7Ozs7Ozs7K0NBQ0FBLE87Ozs7Ozs7OztrREFDQUEsTzs7Ozs7Ozs7O2lEQUNBQSxPOzs7Ozs7Ozs7eUNBQ0FBLE87Ozs7Ozs7Ozs2Q0FDQUEsTzs7Ozs7Ozs7O29EQUdBQSxPOzs7Ozs7Ozs7eURBQ0FBLE87Ozs7Ozs7OzsrQ0FDQUEsTzs7Ozs7Ozs7OzhDQUNBQSxPOzs7Ozs7Ozs7Z0RBQ0FBLE87Ozs7SUFwREdDLE07Ozs7OztBQUNMLElBQU1DLHdCQUFRRCxNQUFkLEMsQ0FWUDs7Ozs7Ozs7QUFRQTs7O0FBS0E7QUFDTyxJQUFNRSw0QkFBVSxXQUFoQjs7QUFFUCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ2xpZW50LXNpZGUgZW50cnkgcG9pbnQgb2YgdGhlICpzb3VuZHdvcmtzKiBmcmFtZXdvcmsuXG4gKlxuICogQG1vZHVsZSBzb3VuZHdvcmtzL2NsaWVudFxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIHNvdW5kd29ya3MgZnJvbSAnc291bmR3b3Jrcy9jbGllbnQnO1xuICovXG5cbi8vIGV4cG9ydCAqIGFzIGF1ZGlvIGZyb20gJ3dhdmVzLWF1ZGlvJztcbmltcG9ydCAqIGFzIF9hdWRpbyBmcm9tICd3YXZlcy1hdWRpbyc7XG5leHBvcnQgY29uc3QgYXVkaW8gPSBfYXVkaW87XG5leHBvcnQgeyBhdWRpb0NvbnRleHQgfSBmcm9tICd3YXZlcy1hdWRpbyc7XG5cbi8vIHZlcnNpb24gKGNmLiBiaW4vamF2YXNjcmlwdHMpXG5leHBvcnQgY29uc3QgdmVyc2lvbiA9ICcldmVyc2lvbiUnO1xuXG4vLyBjb3JlXG5leHBvcnQgeyBkZWZhdWx0IGFzIEFjdGl2aXR5IH0gZnJvbSAnLi9jb3JlL0FjdGl2aXR5JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgY2xpZW50IH0gZnJvbSAnLi9jb3JlL2NsaWVudCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEV4cGVyaWVuY2UgfSBmcm9tICcuL2NvcmUvRXhwZXJpZW5jZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFByb2Nlc3MgfSBmcm9tICcuL2NvcmUvUHJvY2Vzcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFNlcnZpY2UgfSBmcm9tICcuL2NvcmUvU2VydmljZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHNlcnZpY2VNYW5hZ2VyIH0gZnJvbSAnLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuLy8gc2VydmljZXNcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQXVkaW9CdWZmZXJNYW5hZ2VyIH0gZnJvbSAnLi9zZXJ2aWNlcy9BdWRpb0J1ZmZlck1hbmFnZXInO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBBdWRpb1N0cmVhbU1hbmFnZXIgfSBmcm9tICcuL3NlcnZpY2VzL0F1ZGlvU3RyZWFtTWFuYWdlcic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEF1ZGlvU2NoZWR1bGVyIH0gZnJvbSAnLi9zZXJ2aWNlcy9BdWRpb1NjaGVkdWxlcic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEF1dGggfSBmcm9tICcuL3NlcnZpY2VzL0F1dGgnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBDaGVja2luIH0gZnJvbSAnLi9zZXJ2aWNlcy9DaGVja2luJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgRXJyb3JSZXBvcnRlciB9IGZyb20gJy4vc2VydmljZXMvRXJyb3JSZXBvcnRlcic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEZpbGVTeXN0ZW0gfSBmcm9tICcuL3NlcnZpY2VzL0ZpbGVTeXN0ZW0nO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBHZW9sb2NhdGlvbiB9IGZyb20gJy4vc2VydmljZXMvR2VvbG9jYXRpb24nO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBMYW5ndWFnZSB9IGZyb20gJy4vc2VydmljZXMvTGFuZ3VhZ2UnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBMb2NhdG9yIH0gZnJvbSAnLi9zZXJ2aWNlcy9Mb2NhdG9yJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgTWV0cmljU2NoZWR1bGVyIH0gZnJvbSAnLi9zZXJ2aWNlcy9NZXRyaWNTY2hlZHVsZXInO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBNb3Rpb25JbnB1dCB9IGZyb20gJy4vc2VydmljZXMvTW90aW9uSW5wdXQnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBOZXR3b3JrIH0gZnJvbSAnLi9zZXJ2aWNlcy9OZXR3b3JrJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUGxhY2VyIH0gZnJvbSAnLi9zZXJ2aWNlcy9QbGFjZXInO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBQbGF0Zm9ybSB9IGZyb20gJy4vc2VydmljZXMvUGxhdGZvcm0nO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBSYXdTb2NrZXQgfSBmcm9tICcuL3NlcnZpY2VzL1Jhd1NvY2tldCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFNoYXJlZENvbmZpZyB9IGZyb20gJy4vc2VydmljZXMvU2hhcmVkQ29uZmlnJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU2hhcmVkUGFyYW1zIH0gZnJvbSAnLi9zZXJ2aWNlcy9TaGFyZWRQYXJhbXMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTaGFyZWRSZWNvcmRlciB9IGZyb20gJy4vc2VydmljZXMvU2hhcmVkUmVjb3JkZXInO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTeW5jIH0gZnJvbSAnLi9zZXJ2aWNlcy9TeW5jJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU3luY1NjaGVkdWxlciB9IGZyb20gJy4vc2VydmljZXMvU3luY1NjaGVkdWxlcic7XG5cbi8vIHZpZXdzXG5leHBvcnQgeyBkZWZhdWx0IGFzIENhbnZhczJkUmVuZGVyZXIgfSBmcm9tICcuL3ZpZXdzL0NhbnZhczJkUmVuZGVyZXInO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBDYW52YXNSZW5kZXJpbmdHcm91cCB9IGZyb20gJy4vdmlld3MvQ2FudmFzUmVuZGVyaW5nR3JvdXAnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBDYW52YXNWaWV3IH0gZnJvbSAnLi92aWV3cy9DYW52YXNWaWV3JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU2VnbWVudGVkVmlldyB9IGZyb20gJy4vdmlld3MvU2VnbWVudGVkVmlldyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFRvdWNoU3VyZmFjZSB9IGZyb20gJy4vdmlld3MvVG91Y2hTdXJmYWNlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVmlldyB9IGZyb20gJy4vdmlld3MvVmlldyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHZpZXdwb3J0IH0gZnJvbSAnLi92aWV3cy92aWV3cG9ydCc7XG5cbi8vIHByZWZhYnNcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQ29udHJvbGxlclNjZW5lIH0gZnJvbSAnLi9wcmVmYWJzL0NvbnRyb2xsZXJTY2VuZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIENvbnRyb2xsZXJFeHBlcmllbmNlIH0gZnJvbSAnLi9wcmVmYWJzL0NvbnRyb2xsZXJFeHBlcmllbmNlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU2VsZWN0VmlldyB9IGZyb20gJy4vcHJlZmFicy9TZWxlY3RWaWV3JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU3BhY2VWaWV3IH0gZnJvbSAnLi9wcmVmYWJzL1NwYWNlVmlldyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFNxdWFyZWRWaWV3IH0gZnJvbSAnLi9wcmVmYWJzL1NxdWFyZWRWaWV3JztcbiJdfQ==