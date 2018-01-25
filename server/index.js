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

var _AudioStreamManager = require('./services/AudioStreamManager');

Object.defineProperty(exports, 'AudioStreamManager', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_AudioStreamManager).default;
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

var version = exports.version = '2.1.1';

/* core */
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImRlZmF1bHQiLCJ2ZXJzaW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OzsyQ0FXU0EsTzs7Ozs7Ozs7OzZDQUNBQSxPOzs7Ozs7Ozs7K0NBQ0FBLE87Ozs7Ozs7OzsyQ0FDQUEsTzs7Ozs7Ozs7OzRDQUNBQSxPOzs7Ozs7Ozs7bURBQ0FBLE87Ozs7Ozs7Ozt1REFHQUEsTzs7Ozs7Ozs7O3VEQUNBQSxPOzs7Ozs7Ozs7eUNBQ0FBLE87Ozs7Ozs7Ozt3Q0FDQUEsTzs7Ozs7Ozs7OzRDQUNBQSxPOzs7Ozs7Ozs7a0RBQ0FBLE87Ozs7Ozs7OzsrQ0FDQUEsTzs7Ozs7Ozs7O2dEQUNBQSxPOzs7Ozs7Ozs7NENBQ0FBLE87Ozs7Ozs7OztvREFDQUEsTzs7Ozs7Ozs7OzRDQUNBQSxPOzs7Ozs7Ozs7MkNBQ0FBLE87Ozs7Ozs7Ozs4Q0FDQUEsTzs7Ozs7Ozs7O2lEQUNBQSxPOzs7Ozs7Ozs7aURBQ0FBLE87Ozs7Ozs7OzttREFDQUEsTzs7Ozs7Ozs7O3lDQUNBQSxPOzs7Ozs7Ozs7a0RBQ0FBLE87Ozs7Ozs7Ozt5REFHQUEsTzs7Ozs7O0FBdkNUOzs7Ozs7OztBQVFPLElBQU1DLDRCQUFVLFdBQWhCOztBQUVQIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTZXJ2ZXItc2lkZSBlbnRyeSBwb2ludCBvZiB0aGUgKnNvdW5kd29ya3MqIGZyYW1ld29yay5cbiAqXG4gKiBAbW9kdWxlIHNvdW5kd29ya3Mvc2VydmVyXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgc291bmR3b3JrcyBmcm9tICdzb3VuZHdvcmtzL3NlcnZlcic7XG4gKi9cblxuZXhwb3J0IGNvbnN0IHZlcnNpb24gPSAnJXZlcnNpb24lJztcblxuLyogY29yZSAqL1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBDbGllbnQgfSBmcm9tICcuL2NvcmUvQ2xpZW50JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQWN0aXZpdHkgfSBmcm9tICcuL2NvcmUvQWN0aXZpdHknO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBFeHBlcmllbmNlIH0gZnJvbSAnLi9jb3JlL0V4cGVyaWVuY2UnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBzZXJ2ZXIgfSBmcm9tICcuL2NvcmUvc2VydmVyJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU2VydmljZSB9IGZyb20gJy4vY29yZS9TZXJ2aWNlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgc2VydmljZU1hbmFnZXIgfSBmcm9tICcuL2NvcmUvc2VydmljZU1hbmFnZXInO1xuXG4vKiBzZXJ2aWNlcyAqL1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBBdWRpb0J1ZmZlck1hbmFnZXIgfSBmcm9tICcuL3NlcnZpY2VzL0F1ZGlvQnVmZmVyTWFuYWdlcic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEF1ZGlvU3RyZWFtTWFuYWdlciB9IGZyb20gJy4vc2VydmljZXMvQXVkaW9TdHJlYW1NYW5hZ2VyJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQXV0aCB9IGZyb20gJy4vc2VydmljZXMvQXV0aCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIE9zYyB9IGZyb20gJy4vc2VydmljZXMvT3NjJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQ2hlY2tpbiB9IGZyb20gJy4vc2VydmljZXMvQ2hlY2tpbic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEVycm9yUmVwb3J0ZXIgfSBmcm9tICcuL3NlcnZpY2VzL0Vycm9yUmVwb3J0ZXInO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBGaWxlU3lzdGVtIH0gZnJvbSAnLi9zZXJ2aWNlcy9GaWxlU3lzdGVtJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgR2VvbG9jYXRpb24gfSBmcm9tICcuL3NlcnZpY2VzL0dlb2xvY2F0aW9uJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgTG9jYXRvciB9IGZyb20gJy4vc2VydmljZXMvTG9jYXRvcic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIE1ldHJpY1NjaGVkdWxlciB9IGZyb20gJy4vc2VydmljZXMvTWV0cmljU2NoZWR1bGVyJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgTmV0d29yayB9IGZyb20gJy4vc2VydmljZXMvTmV0d29yayc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFBsYWNlciB9IGZyb20gJy4vc2VydmljZXMvUGxhY2VyJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUmF3U29ja2V0IH0gZnJvbSAnLi9zZXJ2aWNlcy9SYXdTb2NrZXQnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTaGFyZWRDb25maWcgfSBmcm9tICcuL3NlcnZpY2VzL1NoYXJlZENvbmZpZyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFNoYXJlZFBhcmFtcyB9IGZyb20gJy4vc2VydmljZXMvU2hhcmVkUGFyYW1zJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU2hhcmVkUmVjb3JkZXIgfSBmcm9tICcuL3NlcnZpY2VzL1NoYXJlZFJlY29yZGVyJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU3luYyB9IGZyb20gJy4vc2VydmljZXMvU3luYyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFN5bmNTY2hlZHVsZXIgfSBmcm9tICcuL3NlcnZpY2VzL1N5bmNTY2hlZHVsZXInO1xuXG4vKiBwcmVmYWJzICovXG5leHBvcnQgeyBkZWZhdWx0IGFzIENvbnRyb2xsZXJFeHBlcmllbmNlIH0gZnJvbSAnLi9wcmVmYWJzL0NvbnRyb2xsZXJFeHBlcmllbmNlJztcbiJdfQ==