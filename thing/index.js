'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
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

var _Process = require('../client/core/Process');

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

var _serviceManager = require('../client/core/serviceManager');

Object.defineProperty(exports, 'serviceManager', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_serviceManager).default;
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Client-side entry point of the *soundworks* framework.
 *
 * @module soundworks/client
 * @example
 * import * as soundworks from 'soundworks/client';
 */

console.warn('[warning] this feature is experimental and subject to heavy changes');
// version (cf. bin/javascripts)
var version = exports.version = '2.2.0';

// core
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImRlZmF1bHQiLCJjb25zb2xlIiwid2FybiIsInZlcnNpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OzZDQWFTQSxPOzs7Ozs7Ozs7MkNBQ0FBLE87Ozs7Ozs7OzsrQ0FDQUEsTzs7Ozs7Ozs7OzRDQUNBQSxPOzs7Ozs7Ozs7NENBQ0FBLE87Ozs7Ozs7OzttREFDQUEsTzs7Ozs7Ozs7OzRDQUdBQSxPOzs7Ozs7Ozs7a0RBQ0FBLE87Ozs7Ozs7OztpREFDQUEsTzs7Ozs7Ozs7O3lDQUNBQSxPOzs7Ozs7QUF4QlQ7Ozs7Ozs7O0FBUUFDLFFBQVFDLElBQVIsQ0FBYSxxRUFBYjtBQUNBO0FBQ08sSUFBTUMsNEJBQVUsV0FBaEI7O0FBRVAiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENsaWVudC1zaWRlIGVudHJ5IHBvaW50IG9mIHRoZSAqc291bmR3b3JrcyogZnJhbWV3b3JrLlxuICpcbiAqIEBtb2R1bGUgc291bmR3b3Jrcy9jbGllbnRcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBzb3VuZHdvcmtzIGZyb20gJ3NvdW5kd29ya3MvY2xpZW50JztcbiAqL1xuXG5jb25zb2xlLndhcm4oJ1t3YXJuaW5nXSB0aGlzIGZlYXR1cmUgaXMgZXhwZXJpbWVudGFsIGFuZCBzdWJqZWN0IHRvIGhlYXZ5IGNoYW5nZXMnKTtcbi8vIHZlcnNpb24gKGNmLiBiaW4vamF2YXNjcmlwdHMpXG5leHBvcnQgY29uc3QgdmVyc2lvbiA9ICcldmVyc2lvbiUnO1xuXG4vLyBjb3JlXG5leHBvcnQgeyBkZWZhdWx0IGFzIEFjdGl2aXR5IH0gZnJvbSAnLi9jb3JlL0FjdGl2aXR5JzsgLy8gdGhpcyBvbmUgaXMgdGhlIG1haW4gcHJvYmxlbVxuZXhwb3J0IHsgZGVmYXVsdCBhcyBjbGllbnQgfSBmcm9tICcuL2NvcmUvY2xpZW50JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgRXhwZXJpZW5jZSB9IGZyb20gJy4vY29yZS9FeHBlcmllbmNlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUHJvY2VzcyB9IGZyb20gJy4uL2NsaWVudC9jb3JlL1Byb2Nlc3MnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTZXJ2aWNlIH0gZnJvbSAnLi9jb3JlL1NlcnZpY2UnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBzZXJ2aWNlTWFuYWdlciB9IGZyb20gJy4uL2NsaWVudC9jb3JlL3NlcnZpY2VNYW5hZ2VyJzsgIC8vIGZyb20gY2xpZW50XG5cbi8vIHNlcnZpY2VzXG5leHBvcnQgeyBkZWZhdWx0IGFzIENoZWNraW4gfSBmcm9tICcuL3NlcnZpY2VzL0NoZWNraW4nO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBFcnJvclJlcG9ydGVyIH0gZnJvbSAnLi9zZXJ2aWNlcy9FcnJvclJlcG9ydGVyJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU2hhcmVkUGFyYW1zIH0gZnJvbSAnLi9zZXJ2aWNlcy9TaGFyZWRQYXJhbXMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTeW5jIH0gZnJvbSAnLi9zZXJ2aWNlcy9TeW5jJztcbi8vIGV4cG9ydCB7IGRlZmF1bHQgYXMgU3luY1NjaGVkdWxlciB9IGZyb20gJy4vc2VydmljZXMvU3luY1NjaGVkdWxlcic7XG5cbiJdfQ==