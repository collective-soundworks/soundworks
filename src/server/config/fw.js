import path from 'path';

/**
 * Configuration parameters of the Soundworks framework.
 * These parameters allow for configuring components of the framework such as Express and SocketIO.
 *
 * @todo - refactor
 * @param {Object} [appConfig={}] Application configuration options.
 * @attribute {String} [appConfig.publicFolder='./public'] Path to the public folder.
 * @attribute {Object} [appConfig.socketIO={}] socket.io options. The socket.io
 *  config object can have the following properties:
 *  - `transports:String`: communication transport (defaults to `'websocket'`);
 *  - `pingTimeout:Number`: timeout (in milliseconds) before trying to
 *     reestablish a connection between a lost client and a server (defautls to `60000`);
 *  - `pingInterval:Number`: time interval (in milliseconds) to send a ping to a
 *     client to check the connection (defaults to `50000`).
 */
export default {
  useHttps: false,
  publicFolder: path.join(process.cwd(), 'public'),
  templateFolder: path.join(process.cwd(), 'html'),
  defaultClient: 'player',
  assetsDomain: '', // override to download assets from a different serveur (nginx)
  socketIO: {
    url: '',
    transports: ['websocket'],
    pingTimeout: 60000, // configure client side too ?
    pingInterval: 50000, // configure client side too ?
    // @note: EngineIO defaults
    // pingTimeout: 3000,
    // pingInterval: 1000,
    // upgradeTimeout: 10000,
    // maxHttpBufferSize: 10E7,
  },
  errorReporterDirectory: 'logs/clients',
  dbDirectory: 'db',
};
