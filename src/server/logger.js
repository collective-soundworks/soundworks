const bunyan = require('bunyan');

// @TODO allow configuration
function socketSerializer(socket) {
  return { id: socket.id };
}

/**
 * @private
 */
const log = bunyan.createLogger({
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

export default log;
