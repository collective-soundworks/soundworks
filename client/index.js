'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.viewport = exports.View = exports.TouchSurface = exports.SquaredView = exports.SpaceView = exports.SelectView = exports.SegmentedView = exports.RenderingGroup = exports.Renderer = exports.CanvasView = exports.ButtonView = exports.Scheduler = exports.MotionInput = exports.Loader = exports.Sync = exports.SharedParams = exports.SharedConfig = exports.Platform = exports.Placer = exports.Network = exports.Locator = exports.ErrorReporter = exports.Checkin = exports.Auth = exports.Survey = exports.Experience = exports.BasicSharedController = exports.SignalAll = exports.Signal = exports.serviceManager = exports.Service = exports.Scene = exports.Process = exports.client = exports.Activity = exports.audioContext = exports.audio = undefined;

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

var _BasicSharedController = require('./scenes/BasicSharedController');

Object.defineProperty(exports, 'BasicSharedController', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_BasicSharedController).default;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFTQTs7Ozs7dUJBRVMsWTs7Ozs7Ozs7OzZDQUdBLE87Ozs7Ozs7OzsyQ0FDQSxPOzs7Ozs7Ozs7NENBQ0EsTzs7Ozs7Ozs7OzBDQUNBLE87Ozs7Ozs7Ozs0Q0FDQSxPOzs7Ozs7Ozs7bURBQ0EsTzs7Ozs7Ozs7OzJDQUNBLE87Ozs7Ozs7Ozs4Q0FDQSxPOzs7Ozs7Ozs7MERBR0EsTzs7Ozs7Ozs7OytDQUNBLE87Ozs7Ozs7OzsyQ0FDQSxPOzs7Ozs7Ozs7eUNBR0EsTzs7Ozs7Ozs7OzRDQUNBLE87Ozs7Ozs7OztrREFDQSxPOzs7Ozs7Ozs7NENBQ0EsTzs7Ozs7Ozs7OzRDQUNBLE87Ozs7Ozs7OzsyQ0FDQSxPOzs7Ozs7Ozs7NkNBQ0EsTzs7Ozs7Ozs7O2lEQUNBLE87Ozs7Ozs7OztpREFDQSxPOzs7Ozs7Ozs7eUNBQ0EsTzs7Ozs7Ozs7OzJDQUNBLE87Ozs7Ozs7OztnREFDQSxPOzs7Ozs7Ozs7OENBQ0EsTzs7Ozs7Ozs7OytDQUdBLE87Ozs7Ozs7OzsrQ0FDQSxPOzs7Ozs7Ozs7NkNBQ0EsTzs7Ozs7Ozs7O21EQUNBLE87Ozs7Ozs7OztrREFDQSxPOzs7Ozs7Ozs7K0NBQ0EsTzs7Ozs7Ozs7OzhDQUNBLE87Ozs7Ozs7OztnREFDQSxPOzs7Ozs7Ozs7aURBQ0EsTzs7Ozs7Ozs7O3lDQUNBLE87Ozs7Ozs7Ozs2Q0FDQSxPOzs7O0lBN0NHLE07Ozs7OztBQUNMLElBQU0sd0JBQVEsTUFBZCxDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDbGllbnQtc2lkZSBlbnRyeSBwb2ludCBvZiB0aGUgKnNvdW5kd29ya3MqIGZyYW1ld29yay5cbiAqXG4gKiBAbW9kdWxlIHNvdW5kd29ya3MvY2xpZW50XG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgc291bmR3b3JrcyBmcm9tICdzb3VuZHdvcmtzL2NsaWVudCc7XG4gKi9cblxuLy8gZXhwb3J0ICogYXMgYXVkaW8gZnJvbSAnd2F2ZXMtYXVkaW8nO1xuaW1wb3J0ICogYXMgX2F1ZGlvIGZyb20gJ3dhdmVzLWF1ZGlvJztcbmV4cG9ydCBjb25zdCBhdWRpbyA9IF9hdWRpbztcbmV4cG9ydCB7IGF1ZGlvQ29udGV4dCB9IGZyb20gJ3dhdmVzLWF1ZGlvJztcblxuLy8gY29yZVxuZXhwb3J0IHsgZGVmYXVsdCBhcyBBY3Rpdml0eSB9IGZyb20gJy4vY29yZS9BY3Rpdml0eSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGNsaWVudCB9IGZyb20gJy4vY29yZS9jbGllbnQnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBQcm9jZXNzIH0gZnJvbSAnLi9jb3JlL1Byb2Nlc3MnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTY2VuZSB9IGZyb20gJy4vY29yZS9TY2VuZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFNlcnZpY2UgfSBmcm9tICcuL2NvcmUvU2VydmljZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHNlcnZpY2VNYW5hZ2VyIH0gZnJvbSAnLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU2lnbmFsIH0gZnJvbSAnLi9jb3JlL1NpZ25hbCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFNpZ25hbEFsbCB9IGZyb20gJy4vY29yZS9TaWduYWxBbGwnO1xuXG4vLyBzY2VuZXNcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQmFzaWNTaGFyZWRDb250cm9sbGVyIH0gZnJvbSAnLi9zY2VuZXMvQmFzaWNTaGFyZWRDb250cm9sbGVyJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgRXhwZXJpZW5jZSB9IGZyb20gJy4vc2NlbmVzL0V4cGVyaWVuY2UnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTdXJ2ZXkgfSBmcm9tICcuL3NjZW5lcy9TdXJ2ZXknO1xuXG4vLyBzZXJ2aWNlc1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBBdXRoIH0gZnJvbSAnLi9zZXJ2aWNlcy9BdXRoJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQ2hlY2tpbiB9IGZyb20gJy4vc2VydmljZXMvQ2hlY2tpbic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEVycm9yUmVwb3J0ZXIgfSBmcm9tICcuL3NlcnZpY2VzL0Vycm9yUmVwb3J0ZXInO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBMb2NhdG9yIH0gZnJvbSAnLi9zZXJ2aWNlcy9Mb2NhdG9yJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgTmV0d29yayB9IGZyb20gJy4vc2VydmljZXMvTmV0d29yayc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFBsYWNlciB9IGZyb20gJy4vc2VydmljZXMvUGxhY2VyJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUGxhdGZvcm0gfSBmcm9tICcuL3NlcnZpY2VzL1BsYXRmb3JtJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU2hhcmVkQ29uZmlnIH0gZnJvbSAnLi9zZXJ2aWNlcy9TaGFyZWRDb25maWcnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTaGFyZWRQYXJhbXMgfSBmcm9tICcuL3NlcnZpY2VzL1NoYXJlZFBhcmFtcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFN5bmMgfSBmcm9tICcuL3NlcnZpY2VzL1N5bmMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBMb2FkZXIgfSBmcm9tICcuL3NlcnZpY2VzL0xvYWRlcic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIE1vdGlvbklucHV0IH0gZnJvbSAnLi9zZXJ2aWNlcy9Nb3Rpb25JbnB1dCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFNjaGVkdWxlciB9IGZyb20gJy4vc2VydmljZXMvU2NoZWR1bGVyJztcblxuLy8gdmlld3NcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQnV0dG9uVmlldyB9IGZyb20gJy4vdmlld3MvQnV0dG9uVmlldyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIENhbnZhc1ZpZXcgfSBmcm9tICcuL3ZpZXdzL0NhbnZhc1ZpZXcnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBSZW5kZXJlciB9IGZyb20gJy4vdmlld3MvUmVuZGVyZXInO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBSZW5kZXJpbmdHcm91cCB9IGZyb20gJy4vdmlld3MvUmVuZGVyaW5nR3JvdXAnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTZWdtZW50ZWRWaWV3IH0gZnJvbSAnLi92aWV3cy9TZWdtZW50ZWRWaWV3JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU2VsZWN0VmlldyB9IGZyb20gJy4vdmlld3MvU2VsZWN0Vmlldyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFNwYWNlVmlldyB9IGZyb20gJy4vdmlld3MvU3BhY2VWaWV3JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU3F1YXJlZFZpZXcgfSBmcm9tICcuL3ZpZXdzL1NxdWFyZWRWaWV3JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVG91Y2hTdXJmYWNlIH0gZnJvbSAnLi92aWV3cy9Ub3VjaFN1cmZhY2UnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBWaWV3IH0gZnJvbSAnLi92aWV3cy9WaWV3JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgdmlld3BvcnQgfSBmcm9tICcuL3ZpZXdzL3ZpZXdwb3J0JztcbiJdfQ==