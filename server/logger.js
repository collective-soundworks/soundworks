'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

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

    var log = _bunyan2['default'].createLogger(config);

    for (var attr in log) {
      var method = log[attr];
      if (typeof method === 'function') {
        this[attr] = log[attr].bind(log);
      }
    }
  }
};

exports['default'] = logger;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvbG9nZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O3NCQUFtQixRQUFROzs7OztBQUczQixTQUFTLGdCQUFnQixDQUFDLE1BQU0sRUFBRTtBQUNoQyxTQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxFQUFFLEVBQUUsQ0FBQztDQUMxQjs7Ozs7QUFLRCxJQUFNLE1BQU0sR0FBRztBQUNiLFlBQVUsRUFBQSxvQkFBQyxNQUFNLEVBQUU7QUFDakIsVUFBTSxDQUFDLFdBQVcsR0FBRztBQUNuQixZQUFNLEVBQUUsZ0JBQWdCO0tBQ3pCLENBQUM7O0FBRUYsUUFBTSxHQUFHLEdBQUcsb0JBQU8sWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUV4QyxTQUFLLElBQUksSUFBSSxJQUFJLEdBQUcsRUFBRTtBQUNwQixVQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekIsVUFBSSxPQUFPLE1BQU0sS0FBSyxVQUFVLEVBQUU7QUFDaEMsWUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7T0FDbEM7S0FDRjtHQUNGO0NBQ0YsQ0FBQTs7cUJBRWMsTUFBTSIsImZpbGUiOiJzcmMvc2VydmVyL2xvZ2dlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBidW55YW4gZnJvbSAnYnVueWFuJztcblxuLy8gQFRPRE8gYWxsb3cgY29uZmlndXJhdGlvblxuZnVuY3Rpb24gc29ja2V0U2VyaWFsaXplcihzb2NrZXQpIHtcbiAgcmV0dXJuIHsgaWQ6IHNvY2tldC5pZCB9O1xufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmNvbnN0IGxvZ2dlciA9IHtcbiAgaW5pdGlhbGl6ZShjb25maWcpIHtcbiAgICBjb25maWcuc2VyaWFsaXplcnMgPSB7XG4gICAgICBzb2NrZXQ6IHNvY2tldFNlcmlhbGl6ZXJcbiAgICB9O1xuXG4gICAgY29uc3QgbG9nID0gYnVueWFuLmNyZWF0ZUxvZ2dlcihjb25maWcpO1xuXG4gICAgZm9yIChsZXQgYXR0ciBpbiBsb2cpIHtcbiAgICAgIGNvbnN0IG1ldGhvZCA9IGxvZ1thdHRyXTtcbiAgICAgIGlmICh0eXBlb2YgbWV0aG9kID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXNbYXR0cl0gPSBsb2dbYXR0cl0uYmluZChsb2cpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBsb2dnZXI7XG4iXX0=