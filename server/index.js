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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImRlZmF1bHQiLCJ2ZXJzaW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OzsyQ0FXU0EsTzs7Ozs7Ozs7OzZDQUNBQSxPOzs7Ozs7Ozs7K0NBQ0FBLE87Ozs7Ozs7OzsyQ0FDQUEsTzs7Ozs7Ozs7OzRDQUNBQSxPOzs7Ozs7Ozs7dURBR0FBLE87Ozs7Ozs7Ozt5Q0FDQUEsTzs7Ozs7Ozs7O3dDQUNBQSxPOzs7Ozs7Ozs7NENBQ0FBLE87Ozs7Ozs7OztrREFDQUEsTzs7Ozs7Ozs7OytDQUNBQSxPOzs7Ozs7Ozs7Z0RBQ0FBLE87Ozs7Ozs7Ozs0Q0FDQUEsTzs7Ozs7Ozs7O29EQUNBQSxPOzs7Ozs7Ozs7NENBQ0FBLE87Ozs7Ozs7OzsyQ0FDQUEsTzs7Ozs7Ozs7OzhDQUNBQSxPOzs7Ozs7Ozs7aURBQ0FBLE87Ozs7Ozs7OztpREFDQUEsTzs7Ozs7Ozs7O21EQUNBQSxPOzs7Ozs7Ozs7eUNBQ0FBLE87Ozs7Ozs7OztrREFDQUEsTzs7Ozs7Ozs7O3lEQUdBQSxPOzs7Ozs7QUFyQ1Q7Ozs7Ozs7O0FBUU8sSUFBTUMsNEJBQVUsV0FBaEI7O0FBRVAiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFNlcnZlci1zaWRlIGVudHJ5IHBvaW50IG9mIHRoZSAqc291bmR3b3JrcyogZnJhbWV3b3JrLlxuICpcbiAqIEBtb2R1bGUgc291bmR3b3Jrcy9zZXJ2ZXJcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBzb3VuZHdvcmtzIGZyb20gJ3NvdW5kd29ya3Mvc2VydmVyJztcbiAqL1xuXG5leHBvcnQgY29uc3QgdmVyc2lvbiA9ICcldmVyc2lvbiUnO1xuXG4vKiBjb3JlICovXG5leHBvcnQgeyBkZWZhdWx0IGFzIENsaWVudCB9IGZyb20gJy4vY29yZS9DbGllbnQnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBBY3Rpdml0eSB9IGZyb20gJy4vY29yZS9BY3Rpdml0eSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEV4cGVyaWVuY2UgfSBmcm9tICcuL2NvcmUvRXhwZXJpZW5jZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHNlcnZlciB9IGZyb20gJy4vY29yZS9zZXJ2ZXInO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTZXJ2aWNlIH0gZnJvbSAnLi9jb3JlL1NlcnZpY2UnO1xuXG4vKiBzZXJ2aWNlcyAqL1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBBdWRpb0J1ZmZlck1hbmFnZXIgfSBmcm9tICcuL3NlcnZpY2VzL0F1ZGlvQnVmZmVyTWFuYWdlcic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEF1dGggfSBmcm9tICcuL3NlcnZpY2VzL0F1dGgnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBPc2MgfSBmcm9tICcuL3NlcnZpY2VzL09zYyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIENoZWNraW4gfSBmcm9tICcuL3NlcnZpY2VzL0NoZWNraW4nO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBFcnJvclJlcG9ydGVyIH0gZnJvbSAnLi9zZXJ2aWNlcy9FcnJvclJlcG9ydGVyJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgRmlsZVN5c3RlbSB9IGZyb20gJy4vc2VydmljZXMvRmlsZVN5c3RlbSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEdlb2xvY2F0aW9uIH0gZnJvbSAnLi9zZXJ2aWNlcy9HZW9sb2NhdGlvbic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIExvY2F0b3IgfSBmcm9tICcuL3NlcnZpY2VzL0xvY2F0b3InO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBNZXRyaWNTY2hlZHVsZXIgfSBmcm9tICcuL3NlcnZpY2VzL01ldHJpY1NjaGVkdWxlcic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIE5ldHdvcmsgfSBmcm9tICcuL3NlcnZpY2VzL05ldHdvcmsnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBQbGFjZXIgfSBmcm9tICcuL3NlcnZpY2VzL1BsYWNlcic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFJhd1NvY2tldCB9IGZyb20gJy4vc2VydmljZXMvUmF3U29ja2V0JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU2hhcmVkQ29uZmlnIH0gZnJvbSAnLi9zZXJ2aWNlcy9TaGFyZWRDb25maWcnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTaGFyZWRQYXJhbXMgfSBmcm9tICcuL3NlcnZpY2VzL1NoYXJlZFBhcmFtcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFNoYXJlZFJlY29yZGVyIH0gZnJvbSAnLi9zZXJ2aWNlcy9TaGFyZWRSZWNvcmRlcic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFN5bmMgfSBmcm9tICcuL3NlcnZpY2VzL1N5bmMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTeW5jU2NoZWR1bGVyIH0gZnJvbSAnLi9zZXJ2aWNlcy9TeW5jU2NoZWR1bGVyJztcblxuLyogcHJlZmFicyAqL1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBDb250cm9sbGVyRXhwZXJpZW5jZSB9IGZyb20gJy4vcHJlZmFicy9Db250cm9sbGVyRXhwZXJpZW5jZSc7XG4iXX0=