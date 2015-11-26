'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var bunyan = require('bunyan');

// @TODO allow configuration
function socketSerializer(socket) {
  return { id: socket.id };
}

/**
 * @private
 */
var log = bunyan.createLogger({
  name: 'test-app',
  serializers: {
    socket: socketSerializer
  },
  streams: [{
    level: 'info',
    stream: process.stdout
  }, {
    level: 'info',
    path: '/var/tmp/soundworks-app.log'
  }]
});

exports['default'] = log;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvbG9nZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDOzs7QUFHakMsU0FBUyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUU7QUFDaEMsU0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUM7Q0FDMUI7Ozs7O0FBS0QsSUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQztBQUM5QixNQUFJLEVBQUUsVUFBVTtBQUNoQixhQUFXLEVBQUU7QUFDWCxVQUFNLEVBQUUsZ0JBQWdCO0dBQ3pCO0FBQ0QsU0FBTyxFQUFFLENBQUM7QUFDUixTQUFLLEVBQUUsTUFBTTtBQUNiLFVBQU0sRUFBRSxPQUFPLENBQUMsTUFBTTtHQUN2QixFQUFFO0FBQ0QsU0FBSyxFQUFFLE1BQU07QUFDYixRQUFJLEVBQUUsNkJBQTZCO0dBQ3BDLENBQUM7Q0FDSCxDQUFDLENBQUM7O3FCQUVZLEdBQUciLCJmaWxlIjoic3JjL3NlcnZlci9sb2dnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBidW55YW4gPSByZXF1aXJlKCdidW55YW4nKTtcblxuLy8gQFRPRE8gYWxsb3cgY29uZmlndXJhdGlvblxuZnVuY3Rpb24gc29ja2V0U2VyaWFsaXplcihzb2NrZXQpIHtcbiAgcmV0dXJuIHsgaWQ6IHNvY2tldC5pZCB9O1xufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmNvbnN0IGxvZyA9IGJ1bnlhbi5jcmVhdGVMb2dnZXIoe1xuICBuYW1lOiAndGVzdC1hcHAnLFxuICBzZXJpYWxpemVyczoge1xuICAgIHNvY2tldDogc29ja2V0U2VyaWFsaXplclxuICB9LFxuICBzdHJlYW1zOiBbe1xuICAgIGxldmVsOiAnaW5mbycsXG4gICAgc3RyZWFtOiBwcm9jZXNzLnN0ZG91dFxuICB9LCB7XG4gICAgbGV2ZWw6ICdpbmZvJyxcbiAgICBwYXRoOiAnL3Zhci90bXAvc291bmR3b3Jrcy1hcHAubG9nJ1xuICB9XVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGxvZztcbiJdfQ==