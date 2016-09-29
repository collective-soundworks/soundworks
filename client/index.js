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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImF1ZGlvQ29udGV4dCIsImRlZmF1bHQiLCJfYXVkaW8iLCJhdWRpbyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQVNBOzs7Ozt1QkFFU0EsWTs7Ozs7Ozs7OzZDQUdBQyxPOzs7Ozs7Ozs7MkNBQ0FBLE87Ozs7Ozs7Ozs0Q0FDQUEsTzs7Ozs7Ozs7OzBDQUNBQSxPOzs7Ozs7Ozs7NENBQ0FBLE87Ozs7Ozs7OzttREFDQUEsTzs7Ozs7Ozs7OzJDQUNBQSxPOzs7Ozs7Ozs7OENBQ0FBLE87Ozs7Ozs7OzswREFHQUEsTzs7Ozs7Ozs7OytDQUNBQSxPOzs7Ozs7Ozs7MkNBQ0FBLE87Ozs7Ozs7Ozt5Q0FHQUEsTzs7Ozs7Ozs7OzRDQUNBQSxPOzs7Ozs7Ozs7a0RBQ0FBLE87Ozs7Ozs7Ozs0Q0FDQUEsTzs7Ozs7Ozs7OzRDQUNBQSxPOzs7Ozs7Ozs7MkNBQ0FBLE87Ozs7Ozs7Ozs2Q0FDQUEsTzs7Ozs7Ozs7O2lEQUNBQSxPOzs7Ozs7Ozs7aURBQ0FBLE87Ozs7Ozs7Ozt5Q0FDQUEsTzs7Ozs7Ozs7OzJDQUNBQSxPOzs7Ozs7Ozs7Z0RBQ0FBLE87Ozs7Ozs7Ozs4Q0FDQUEsTzs7Ozs7Ozs7OytDQUdBQSxPOzs7Ozs7Ozs7K0NBQ0FBLE87Ozs7Ozs7Ozs2Q0FDQUEsTzs7Ozs7Ozs7O21EQUNBQSxPOzs7Ozs7Ozs7a0RBQ0FBLE87Ozs7Ozs7OzsrQ0FDQUEsTzs7Ozs7Ozs7OzhDQUNBQSxPOzs7Ozs7Ozs7Z0RBQ0FBLE87Ozs7Ozs7OztpREFDQUEsTzs7Ozs7Ozs7O3lDQUNBQSxPOzs7Ozs7Ozs7NkNBQ0FBLE87Ozs7SUE3Q0dDLE07Ozs7OztBQUNMLElBQU1DLHdCQUFRRCxNQUFkLEMsQ0FWUDs7Ozs7Ozs7QUFRQSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ2xpZW50LXNpZGUgZW50cnkgcG9pbnQgb2YgdGhlICpzb3VuZHdvcmtzKiBmcmFtZXdvcmsuXG4gKlxuICogQG1vZHVsZSBzb3VuZHdvcmtzL2NsaWVudFxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIHNvdW5kd29ya3MgZnJvbSAnc291bmR3b3Jrcy9jbGllbnQnO1xuICovXG5cbi8vIGV4cG9ydCAqIGFzIGF1ZGlvIGZyb20gJ3dhdmVzLWF1ZGlvJztcbmltcG9ydCAqIGFzIF9hdWRpbyBmcm9tICd3YXZlcy1hdWRpbyc7XG5leHBvcnQgY29uc3QgYXVkaW8gPSBfYXVkaW87XG5leHBvcnQgeyBhdWRpb0NvbnRleHQgfSBmcm9tICd3YXZlcy1hdWRpbyc7XG5cbi8vIGNvcmVcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQWN0aXZpdHkgfSBmcm9tICcuL2NvcmUvQWN0aXZpdHknO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBjbGllbnQgfSBmcm9tICcuL2NvcmUvY2xpZW50JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUHJvY2VzcyB9IGZyb20gJy4vY29yZS9Qcm9jZXNzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU2NlbmUgfSBmcm9tICcuL2NvcmUvU2NlbmUnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTZXJ2aWNlIH0gZnJvbSAnLi9jb3JlL1NlcnZpY2UnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBzZXJ2aWNlTWFuYWdlciB9IGZyb20gJy4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFNpZ25hbCB9IGZyb20gJy4vY29yZS9TaWduYWwnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTaWduYWxBbGwgfSBmcm9tICcuL2NvcmUvU2lnbmFsQWxsJztcblxuLy8gc2NlbmVzXG5leHBvcnQgeyBkZWZhdWx0IGFzIEJhc2ljU2hhcmVkQ29udHJvbGxlciB9IGZyb20gJy4vc2NlbmVzL0Jhc2ljU2hhcmVkQ29udHJvbGxlcic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEV4cGVyaWVuY2UgfSBmcm9tICcuL3NjZW5lcy9FeHBlcmllbmNlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU3VydmV5IH0gZnJvbSAnLi9zY2VuZXMvU3VydmV5JztcblxuLy8gc2VydmljZXNcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQXV0aCB9IGZyb20gJy4vc2VydmljZXMvQXV0aCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIENoZWNraW4gfSBmcm9tICcuL3NlcnZpY2VzL0NoZWNraW4nO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBFcnJvclJlcG9ydGVyIH0gZnJvbSAnLi9zZXJ2aWNlcy9FcnJvclJlcG9ydGVyJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgTG9jYXRvciB9IGZyb20gJy4vc2VydmljZXMvTG9jYXRvcic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIE5ldHdvcmsgfSBmcm9tICcuL3NlcnZpY2VzL05ldHdvcmsnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBQbGFjZXIgfSBmcm9tICcuL3NlcnZpY2VzL1BsYWNlcic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFBsYXRmb3JtIH0gZnJvbSAnLi9zZXJ2aWNlcy9QbGF0Zm9ybSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFNoYXJlZENvbmZpZyB9IGZyb20gJy4vc2VydmljZXMvU2hhcmVkQ29uZmlnJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU2hhcmVkUGFyYW1zIH0gZnJvbSAnLi9zZXJ2aWNlcy9TaGFyZWRQYXJhbXMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTeW5jIH0gZnJvbSAnLi9zZXJ2aWNlcy9TeW5jJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgTG9hZGVyIH0gZnJvbSAnLi9zZXJ2aWNlcy9Mb2FkZXInO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBNb3Rpb25JbnB1dCB9IGZyb20gJy4vc2VydmljZXMvTW90aW9uSW5wdXQnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTY2hlZHVsZXIgfSBmcm9tICcuL3NlcnZpY2VzL1NjaGVkdWxlcic7XG5cbi8vIHZpZXdzXG5leHBvcnQgeyBkZWZhdWx0IGFzIEJ1dHRvblZpZXcgfSBmcm9tICcuL3ZpZXdzL0J1dHRvblZpZXcnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBDYW52YXNWaWV3IH0gZnJvbSAnLi92aWV3cy9DYW52YXNWaWV3JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUmVuZGVyZXIgfSBmcm9tICcuL3ZpZXdzL1JlbmRlcmVyJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUmVuZGVyaW5nR3JvdXAgfSBmcm9tICcuL3ZpZXdzL1JlbmRlcmluZ0dyb3VwJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU2VnbWVudGVkVmlldyB9IGZyb20gJy4vdmlld3MvU2VnbWVudGVkVmlldyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFNlbGVjdFZpZXcgfSBmcm9tICcuL3ZpZXdzL1NlbGVjdFZpZXcnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTcGFjZVZpZXcgfSBmcm9tICcuL3ZpZXdzL1NwYWNlVmlldyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFNxdWFyZWRWaWV3IH0gZnJvbSAnLi92aWV3cy9TcXVhcmVkVmlldyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFRvdWNoU3VyZmFjZSB9IGZyb20gJy4vdmlld3MvVG91Y2hTdXJmYWNlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVmlldyB9IGZyb20gJy4vdmlld3MvVmlldyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHZpZXdwb3J0IH0gZnJvbSAnLi92aWV3cy92aWV3cG9ydCc7XG4iXX0=