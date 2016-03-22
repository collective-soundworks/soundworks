/**
 * Configuration parameters of the Soundworks framework.
 * These parameters allow for configuring components of the framework such as Express and SocketIO.
 *
 *
 * @todo - refactor
 * @param {Object} [envConfig={}] Environment configuration options.
 * @attribute {Number} [envConfig.port=8000] Port of the HTTP server.
 * @attribute {Object} [envConfig.osc={}] OSC options. The OSC config object can have the following properties:
 * - `localAddress:String`: address of the local machine to receive OSC messages (defaults to `'127.0.0.1'`);
 * - `localPort:Number`: port of the local machine to receive OSC messages (defaults to `57121`);
 * - `remoteAddress:String`: address of the device to send default OSC messages to (defaults to `'127.0.0.1'`);
 * - `remotePort:Number`: port of the device to send default OSC messages to (defaults to `57120`).
 */
export default {
  port: 8000,
  osc: {
    receiveAddress: '127.0.0.1',
    receivePort: 57121,
    sendAddress: '127.0.0.1',
    sendPort: 57120,
  },
  logger: {
    name: 'soundworks',
    level: 'info',
    streams: [{
      level: 'info',
      stream: process.stdout,
    }, /*{
      level: 'info',
      path: path.join(process.cwd(), 'logs', 'soundworks.log'),
    }*/]
  }
};
