'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @TODO allow configuration
function socketSerializer(socket) {
  return { id: socket.id };
}

/**
 * @private
 */
var logger = {
  initialize: function initialize(config) {
    if (!config.serializers) config.serializers = {};

    (0, _assign2.default)(config.serializers, {
      socket: socketSerializer
    });

    var log = _bunyan2.default.createLogger(config);

    for (var attr in log) {
      var method = log[attr];
      if (typeof method === 'function') {
        this[attr] = log[attr].bind(log);
      }
    }
  }
};

exports.default = logger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvZ2dlci5qcyJdLCJuYW1lcyI6WyJzb2NrZXRTZXJpYWxpemVyIiwic29ja2V0IiwiaWQiLCJsb2dnZXIiLCJpbml0aWFsaXplIiwiY29uZmlnIiwic2VyaWFsaXplcnMiLCJsb2ciLCJjcmVhdGVMb2dnZXIiLCJhdHRyIiwibWV0aG9kIiwiYmluZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFFQTtBQUNBLFNBQVNBLGdCQUFULENBQTBCQyxNQUExQixFQUFrQztBQUNoQyxTQUFPLEVBQUVDLElBQUlELE9BQU9DLEVBQWIsRUFBUDtBQUNEOztBQUVEOzs7QUFHQSxJQUFNQyxTQUFTO0FBQ2JDLFlBRGEsc0JBQ0ZDLE1BREUsRUFDTTtBQUNqQixRQUFJLENBQUNBLE9BQU9DLFdBQVosRUFDRUQsT0FBT0MsV0FBUCxHQUFxQixFQUFyQjs7QUFFRiwwQkFBY0QsT0FBT0MsV0FBckIsRUFBa0M7QUFDaENMLGNBQVFEO0FBRHdCLEtBQWxDOztBQUlBLFFBQU1PLE1BQU0saUJBQU9DLFlBQVAsQ0FBb0JILE1BQXBCLENBQVo7O0FBRUEsU0FBSyxJQUFJSSxJQUFULElBQWlCRixHQUFqQixFQUFzQjtBQUNwQixVQUFNRyxTQUFTSCxJQUFJRSxJQUFKLENBQWY7QUFDQSxVQUFJLE9BQU9DLE1BQVAsS0FBa0IsVUFBdEIsRUFBa0M7QUFDaEMsYUFBS0QsSUFBTCxJQUFhRixJQUFJRSxJQUFKLEVBQVVFLElBQVYsQ0FBZUosR0FBZixDQUFiO0FBQ0Q7QUFDRjtBQUNGO0FBakJZLENBQWY7O2tCQW9CZUosTSIsImZpbGUiOiJsb2dnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYnVueWFuIGZyb20gJ2J1bnlhbic7XG5cbi8vIEBUT0RPIGFsbG93IGNvbmZpZ3VyYXRpb25cbmZ1bmN0aW9uIHNvY2tldFNlcmlhbGl6ZXIoc29ja2V0KSB7XG4gIHJldHVybiB7IGlkOiBzb2NrZXQuaWQgfTtcbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jb25zdCBsb2dnZXIgPSB7XG4gIGluaXRpYWxpemUoY29uZmlnKSB7XG4gICAgaWYgKCFjb25maWcuc2VyaWFsaXplcnMpXG4gICAgICBjb25maWcuc2VyaWFsaXplcnMgPSB7fTtcblxuICAgIE9iamVjdC5hc3NpZ24oY29uZmlnLnNlcmlhbGl6ZXJzLCB7XG4gICAgICBzb2NrZXQ6IHNvY2tldFNlcmlhbGl6ZXJcbiAgICB9KTtcblxuICAgIGNvbnN0IGxvZyA9IGJ1bnlhbi5jcmVhdGVMb2dnZXIoY29uZmlnKTtcblxuICAgIGZvciAobGV0IGF0dHIgaW4gbG9nKSB7XG4gICAgICBjb25zdCBtZXRob2QgPSBsb2dbYXR0cl07XG4gICAgICBpZiAodHlwZW9mIG1ldGhvZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aGlzW2F0dHJdID0gbG9nW2F0dHJdLmJpbmQobG9nKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbG9nZ2VyO1xuIl19