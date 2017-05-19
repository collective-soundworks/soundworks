'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Client = require('./core/Client');

Object.defineProperty(exports, 'Client', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Client).default;
  }
});

var _Activity = require('./core/Activity');

Object.defineProperty(exports, 'Activity', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Activity).default;
  }
});

var _Experience = require('./core/Experience');

Object.defineProperty(exports, 'Experience', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Experience).default;
  }
});

var _server = require('./core/server');

Object.defineProperty(exports, 'server', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_server).default;
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

var _Auth = require('./services/Auth');

Object.defineProperty(exports, 'Auth', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Auth).default;
  }
});

var _Osc = require('./services/Osc');

Object.defineProperty(exports, 'Osc', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Osc).default;
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

var _ControllerExperience = require('./prefabs/ControllerExperience');

Object.defineProperty(exports, 'ControllerExperience', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_ControllerExperience).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Server-side entry point of the *soundworks* framework.
 *
 * @module soundworks/server
 * @example
 * import * as soundworks from 'soundworks/server';
 */

var version = exports.version = '2.0.0';

/* core */
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImRlZmF1bHQiLCJ2ZXJzaW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OzsyQ0FXU0EsTzs7Ozs7Ozs7OzZDQUNBQSxPOzs7Ozs7Ozs7K0NBQ0FBLE87Ozs7Ozs7OzsyQ0FDQUEsTzs7Ozs7Ozs7OzRDQUNBQSxPOzs7Ozs7Ozs7bURBQ0FBLE87Ozs7Ozs7Ozt1REFHQUEsTzs7Ozs7Ozs7O3lDQUNBQSxPOzs7Ozs7Ozs7d0NBQ0FBLE87Ozs7Ozs7Ozs0Q0FDQUEsTzs7Ozs7Ozs7O2tEQUNBQSxPOzs7Ozs7Ozs7K0NBQ0FBLE87Ozs7Ozs7OztnREFDQUEsTzs7Ozs7Ozs7OzRDQUNBQSxPOzs7Ozs7Ozs7b0RBQ0FBLE87Ozs7Ozs7Ozs0Q0FDQUEsTzs7Ozs7Ozs7OzJDQUNBQSxPOzs7Ozs7Ozs7OENBQ0FBLE87Ozs7Ozs7OztpREFDQUEsTzs7Ozs7Ozs7O2lEQUNBQSxPOzs7Ozs7Ozs7bURBQ0FBLE87Ozs7Ozs7Ozt5Q0FDQUEsTzs7Ozs7Ozs7O2tEQUNBQSxPOzs7Ozs7Ozs7eURBR0FBLE87Ozs7OztBQXRDVDs7Ozs7Ozs7QUFRTyxJQUFNQyw0QkFBVSxXQUFoQjs7QUFFUCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU2VydmVyLXNpZGUgZW50cnkgcG9pbnQgb2YgdGhlICpzb3VuZHdvcmtzKiBmcmFtZXdvcmsuXG4gKlxuICogQG1vZHVsZSBzb3VuZHdvcmtzL3NlcnZlclxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIHNvdW5kd29ya3MgZnJvbSAnc291bmR3b3Jrcy9zZXJ2ZXInO1xuICovXG5cbmV4cG9ydCBjb25zdCB2ZXJzaW9uID0gJyV2ZXJzaW9uJSc7XG5cbi8qIGNvcmUgKi9cbmV4cG9ydCB7IGRlZmF1bHQgYXMgQ2xpZW50IH0gZnJvbSAnLi9jb3JlL0NsaWVudCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEFjdGl2aXR5IH0gZnJvbSAnLi9jb3JlL0FjdGl2aXR5JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgRXhwZXJpZW5jZSB9IGZyb20gJy4vY29yZS9FeHBlcmllbmNlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgc2VydmVyIH0gZnJvbSAnLi9jb3JlL3NlcnZlcic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFNlcnZpY2UgfSBmcm9tICcuL2NvcmUvU2VydmljZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHNlcnZpY2VNYW5hZ2VyIH0gZnJvbSAnLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuLyogc2VydmljZXMgKi9cbmV4cG9ydCB7IGRlZmF1bHQgYXMgQXVkaW9CdWZmZXJNYW5hZ2VyIH0gZnJvbSAnLi9zZXJ2aWNlcy9BdWRpb0J1ZmZlck1hbmFnZXInO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBBdXRoIH0gZnJvbSAnLi9zZXJ2aWNlcy9BdXRoJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgT3NjIH0gZnJvbSAnLi9zZXJ2aWNlcy9Pc2MnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBDaGVja2luIH0gZnJvbSAnLi9zZXJ2aWNlcy9DaGVja2luJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgRXJyb3JSZXBvcnRlciB9IGZyb20gJy4vc2VydmljZXMvRXJyb3JSZXBvcnRlcic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEZpbGVTeXN0ZW0gfSBmcm9tICcuL3NlcnZpY2VzL0ZpbGVTeXN0ZW0nO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBHZW9sb2NhdGlvbiB9IGZyb20gJy4vc2VydmljZXMvR2VvbG9jYXRpb24nO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBMb2NhdG9yIH0gZnJvbSAnLi9zZXJ2aWNlcy9Mb2NhdG9yJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgTWV0cmljU2NoZWR1bGVyIH0gZnJvbSAnLi9zZXJ2aWNlcy9NZXRyaWNTY2hlZHVsZXInO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBOZXR3b3JrIH0gZnJvbSAnLi9zZXJ2aWNlcy9OZXR3b3JrJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUGxhY2VyIH0gZnJvbSAnLi9zZXJ2aWNlcy9QbGFjZXInO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBSYXdTb2NrZXQgfSBmcm9tICcuL3NlcnZpY2VzL1Jhd1NvY2tldCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFNoYXJlZENvbmZpZyB9IGZyb20gJy4vc2VydmljZXMvU2hhcmVkQ29uZmlnJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU2hhcmVkUGFyYW1zIH0gZnJvbSAnLi9zZXJ2aWNlcy9TaGFyZWRQYXJhbXMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTaGFyZWRSZWNvcmRlciB9IGZyb20gJy4vc2VydmljZXMvU2hhcmVkUmVjb3JkZXInO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTeW5jIH0gZnJvbSAnLi9zZXJ2aWNlcy9TeW5jJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU3luY1NjaGVkdWxlciB9IGZyb20gJy4vc2VydmljZXMvU3luY1NjaGVkdWxlcic7XG5cbi8qIHByZWZhYnMgKi9cbmV4cG9ydCB7IGRlZmF1bHQgYXMgQ29udHJvbGxlckV4cGVyaWVuY2UgfSBmcm9tICcuL3ByZWZhYnMvQ29udHJvbGxlckV4cGVyaWVuY2UnO1xuIl19