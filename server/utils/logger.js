'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
    config.serializers = {
      socket: socketSerializer
    };

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvZ2dlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7Ozs7OztBQUdBLFNBQVMsZ0JBQVQsQ0FBMEIsTUFBMUIsRUFBa0M7QUFDaEMsU0FBTyxFQUFFLElBQUksT0FBTyxFQUFQLEVBQWIsQ0FEZ0M7Q0FBbEM7Ozs7O0FBT0EsSUFBTSxTQUFTO0FBQ2Isa0NBQVcsUUFBUTtBQUNqQixXQUFPLFdBQVAsR0FBcUI7QUFDbkIsY0FBUSxnQkFBUjtLQURGLENBRGlCOztBQUtqQixRQUFNLE1BQU0saUJBQU8sWUFBUCxDQUFvQixNQUFwQixDQUFOLENBTFc7O0FBT2pCLFNBQUssSUFBSSxJQUFKLElBQVksR0FBakIsRUFBc0I7QUFDcEIsVUFBTSxTQUFTLElBQUksSUFBSixDQUFULENBRGM7QUFFcEIsVUFBSSxPQUFPLE1BQVAsS0FBa0IsVUFBbEIsRUFBOEI7QUFDaEMsYUFBSyxJQUFMLElBQWEsSUFBSSxJQUFKLEVBQVUsSUFBVixDQUFlLEdBQWYsQ0FBYixDQURnQztPQUFsQztLQUZGO0dBUlc7Q0FBVDs7a0JBaUJTIiwiZmlsZSI6ImxvZ2dlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBidW55YW4gZnJvbSAnYnVueWFuJztcblxuLy8gQFRPRE8gYWxsb3cgY29uZmlndXJhdGlvblxuZnVuY3Rpb24gc29ja2V0U2VyaWFsaXplcihzb2NrZXQpIHtcbiAgcmV0dXJuIHsgaWQ6IHNvY2tldC5pZCB9O1xufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmNvbnN0IGxvZ2dlciA9IHtcbiAgaW5pdGlhbGl6ZShjb25maWcpIHtcbiAgICBjb25maWcuc2VyaWFsaXplcnMgPSB7XG4gICAgICBzb2NrZXQ6IHNvY2tldFNlcmlhbGl6ZXJcbiAgICB9O1xuXG4gICAgY29uc3QgbG9nID0gYnVueWFuLmNyZWF0ZUxvZ2dlcihjb25maWcpO1xuXG4gICAgZm9yIChsZXQgYXR0ciBpbiBsb2cpIHtcbiAgICAgIGNvbnN0IG1ldGhvZCA9IGxvZ1thdHRyXTtcbiAgICAgIGlmICh0eXBlb2YgbWV0aG9kID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXNbYXR0cl0gPSBsb2dbYXR0cl0uYmluZChsb2cpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBsb2dnZXI7XG4iXX0=