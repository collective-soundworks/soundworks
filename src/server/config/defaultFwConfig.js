import path from 'path';

const cwd = process.cwd();
/**
 * Configuration parameters of the Soundworks framework.
 * These parameters allow for configuring server-side components of the
 * framework such as Express and SocketIO.
 *
 * _If the application is created using the provided
 * [`application template`]{@link https://github.com/collective-soundworks/soundworks-template},
 * most of these values should not be changed._
 *
 * @memberof module:soundworks/server
 * @namespace
 *
 * @see {@link module:soundworks/server.defaultAppConfig}
 * @see {@link module:soundworks/server.defaultEnvConfig}
 * @see {@link https://github.com/collective-soundworks/soundworks-template}
 */
const defaultFwConfig = {
  /**
   * The location of the public directory inside the application. This directory
   * should then host all the static assets of the application.
   * @type {String}
   * @default 'public'
   */
  publicFolder: path.join(cwd, 'public'),

  /**
   * The location of the directory where the server templating system should
   * find it's `ejs` templates.
   * @type {String}
   * @default 'html'
   */
  templateFolder: path.join(cwd, 'html'),

  /**
   * The name of the default client type, i.e. the client that can access the
   * application at its root URL.
   * @type {String}
   * @default 'player'
   */
  defaultClient: 'player',

  /**
   * Socket.io configuration.
   * @type {Object}
   * @property {Array} [transports=['websockets']] - The prefered way to create
   *  sockets. If the network is not controlled, this value should be reverted
   *  back to socket.io's default value.
   */
  socketIO: {
    // url: '',
    transports: ['websocket'],
    pingTimeout: 60000, // configure client side too ?
    pingInterval: 50000, // configure client side too ?
    // @note: EngineIO defaults
    // pingTimeout: 3000,
    // pingInterval: 1000,
    // upgradeTimeout: 10000,
    // maxHttpBufferSize: 10E7,
  },

  /**
   * Bunyan configuration
   */
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
  },

  /** @private */
  errorReporterDirectory: 'logs/clients',
  /** @private */
  dbDirectory: 'db',
};

export default defaultFwConfig;
