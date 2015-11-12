'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var bunyan = require('bunyan');

// @TODO allow configuration
function socketSerializer(socket) {
  return { id: socket.id };
}

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvbG9nZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDOzs7QUFHakMsU0FBUyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUU7QUFDaEMsU0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUM7Q0FDMUI7O0FBRUQsSUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQztBQUM5QixNQUFJLEVBQUUsVUFBVTtBQUNoQixhQUFXLEVBQUU7QUFDWCxVQUFNLEVBQUUsZ0JBQWdCO0dBQ3pCO0FBQ0QsU0FBTyxFQUFFLENBQUM7QUFDUixTQUFLLEVBQUUsTUFBTTtBQUNiLFVBQU0sRUFBRSxPQUFPLENBQUMsTUFBTTtHQUN2QixFQUFFO0FBQ0QsU0FBSyxFQUFFLE1BQU07QUFDYixRQUFJLEVBQUUsNkJBQTZCO0dBQ3BDLENBQUM7Q0FDSCxDQUFDLENBQUM7O3FCQUVZLEdBQUciLCJmaWxlIjoic3JjL3NlcnZlci9sb2dnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBidW55YW4gPSByZXF1aXJlKCdidW55YW4nKTtcblxuLy8gQFRPRE8gYWxsb3cgY29uZmlndXJhdGlvblxuZnVuY3Rpb24gc29ja2V0U2VyaWFsaXplcihzb2NrZXQpIHtcbiAgcmV0dXJuIHsgaWQ6IHNvY2tldC5pZCB9O1xufVxuXG5jb25zdCBsb2cgPSBidW55YW4uY3JlYXRlTG9nZ2VyKHtcbiAgbmFtZTogJ3Rlc3QtYXBwJyxcbiAgc2VyaWFsaXplcnM6IHtcbiAgICBzb2NrZXQ6IHNvY2tldFNlcmlhbGl6ZXJcbiAgfSxcbiAgc3RyZWFtczogW3tcbiAgICBsZXZlbDogJ2luZm8nLFxuICAgIHN0cmVhbTogcHJvY2Vzcy5zdGRvdXRcbiAgfSwge1xuICAgIGxldmVsOiAnaW5mbycsXG4gICAgcGF0aDogJy92YXIvdG1wL3NvdW5kd29ya3MtYXBwLmxvZydcbiAgfV1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBsb2c7Il19