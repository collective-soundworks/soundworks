/**
 * Configuration parameters of the  environnement, separate files could be
 * defined for development and production purpose and passed dynamically
 * according to a given `process.env` variable.
 *
 * @memberof module:soundworks/server
 * @namespace
 *
 * @see {@link module:soundworks/server.defaultAppConfig}
 * @see {@link module:soundworks/server.defaultFwConfig}
 */
const defaultEnvConfig = {
  /**
   * If assets (basically the content of the `publicFolder`) are hosted on a
   * separate server (e.g. nginx) for scalability and performance reasons,
   * register here the IP or URL of this server. By default, assets are served
   * by the node.js server.
   * @type {String}
   */
  assetsDomain: '',

  /**
   * Define if the HTTP server should be launched using secure connections.
   * Currently when set to `true` (needed to access some browsers features such
   * as microphone), a certificate is created on the fly, making browsers to
   * display a security warning.
   * This options is then not ready for production uses.
   * @todo - Defines how to consume real certificates
   * @type {Boolean}
   * @default false
   */
  useHttps: false,

  /**
   * Paths to the key and certificate to be used in order to launch the https
   * server. Both entries must be informed otherwise a selfSigned certificate
   * is generated (the later can be usefull for development purposes).
   * @type {Object}
   * @property {String} key - Path to the key.
   * @property {String} cert - Path to the certificate.
   */
  httpsInfos: {
    key: null,
    cert: null,
  },

  /**
   * Default port of the application, in production this value should typically
   * be set to 80.
   * @type {Number}
   * @default 8000
   */
  port: 8000,

  /**
   * Configuration of the [`Osc`]{@link module:sounworks/server.Osc} service.
   * @type {Object}
   * @property {String} [receiveAddress='127.0.0.1' - IP of the currently running
   *  node server.
   * @property {String} [receivePort=57121 - Port where to listen incomming
   *  messages
   * @property {String} [sendAddress='127.0.0.1' - IP of the remote application.
   * @property {String} [sendPort=57120 - Port where the remote application is
   *  listening for messages.
   *
   * @see {@link module:sounworks/server.Osc}
   */
  osc: {
    receiveAddress: '127.0.0.1',
    receivePort: 57121,
    sendAddress: '127.0.0.1',
    sendPort: 57120,
  },
};

export default defaultEnvConfig;
