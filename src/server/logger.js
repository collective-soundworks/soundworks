import bunyan from 'bunyan';

// @TODO allow configuration
function socketSerializer(socket) {
  return { id: socket.id };
}

/**
 * @private
 */
const logger = {
  initialize(config) {
    config.serializers = {
      socket: socketSerializer
    };

    const log = bunyan.createLogger(config);
    for (let attr in log) {
      // console.log(attr, log[attr]);
      // this[attr] = log[attr].bind(log);
    }
  }
}

export default logger;
