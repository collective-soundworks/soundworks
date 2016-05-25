'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cwd = process.cwd();
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
var defaultFwConfig = {
  /**
   * The location of the public directory inside the application. This directory
   * should then host all the static assets of the application.
   * @type {String}
   * @default 'public'
   */
  publicFolder: _path2.default.join(cwd, 'public'),

  /**
   * The location of the directory where the server templating system should
   * find it's `ejs` templates.
   * @type {String}
   * @default 'html'
   */
  templateDirectory: _path2.default.join(cwd, 'html'),

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
    pingInterval: 50000 },

  // configure client side too ?
  // @note: EngineIO defaults
  // pingTimeout: 3000,
  // pingInterval: 1000,
  // upgradeTimeout: 10000,
  // maxHttpBufferSize: 10E7,
  /**
   * Bunyan configuration
   */
  logger: {
    name: 'soundworks',
    level: 'info',
    streams: [{
      level: 'info',
      stream: process.stdout
    }]
  },

  /*{
  level: 'info',
  path: path.join(process.cwd(), 'logs', 'soundworks.log'),
  }*/ /** @private */
  errorReporterDirectory: 'logs/clients',
  /** @private */
  dbDirectory: 'db'
};

exports.default = defaultFwConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlZmF1bHRGd0NvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7Ozs7O0FBRUEsSUFBTSxNQUFNLFFBQVEsR0FBUixFQUFaOzs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxJQUFNLGtCQUFrQjs7Ozs7OztBQU90QixnQkFBYyxlQUFLLElBQUwsQ0FBVSxHQUFWLEVBQWUsUUFBZixDQVBROzs7Ozs7OztBQWV0QixxQkFBbUIsZUFBSyxJQUFMLENBQVUsR0FBVixFQUFlLE1BQWYsQ0FmRzs7Ozs7Ozs7QUF1QnRCLGlCQUFlLFFBdkJPOzs7Ozs7Ozs7QUFnQ3RCLFlBQVU7O0FBRVIsZ0JBQVksQ0FBQyxXQUFELENBRko7QUFHUixpQkFBYSxLQUhMLEU7QUFJUixrQkFBYyxLQUpOLEVBaENZOzs7Ozs7Ozs7OztBQStDdEIsVUFBUTtBQUNOLFVBQU0sWUFEQTtBQUVOLFdBQU8sTUFGRDtBQUdOLGFBQVMsQ0FBQztBQUNSLGFBQU8sTUFEQztBQUVSLGNBQVEsUUFBUTtBQUZSLEtBQUQ7QUFISCxHQS9DYzs7Ozs7O0FBNER0QiwwQkFBd0IsY0E1REY7O0FBOER0QixlQUFhO0FBOURTLENBQXhCOztrQkFpRWUsZSIsImZpbGUiOiJkZWZhdWx0RndDb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuY29uc3QgY3dkID0gcHJvY2Vzcy5jd2QoKTtcbi8qKlxuICogQ29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzIG9mIHRoZSBTb3VuZHdvcmtzIGZyYW1ld29yay5cbiAqIFRoZXNlIHBhcmFtZXRlcnMgYWxsb3cgZm9yIGNvbmZpZ3VyaW5nIHNlcnZlci1zaWRlIGNvbXBvbmVudHMgb2YgdGhlXG4gKiBmcmFtZXdvcmsgc3VjaCBhcyBFeHByZXNzIGFuZCBTb2NrZXRJTy5cbiAqXG4gKiBfSWYgdGhlIGFwcGxpY2F0aW9uIGlzIGNyZWF0ZWQgdXNpbmcgdGhlIHByb3ZpZGVkXG4gKiBbYGFwcGxpY2F0aW9uIHRlbXBsYXRlYF17QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zb3VuZHdvcmtzLXRlbXBsYXRlfSxcbiAqIG1vc3Qgb2YgdGhlc2UgdmFsdWVzIHNob3VsZCBub3QgYmUgY2hhbmdlZC5fXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlclxuICogQG5hbWVzcGFjZVxuICpcbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5kZWZhdWx0QXBwQ29uZmlnfVxuICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLmRlZmF1bHRFbnZDb25maWd9XG4gKiBAc2VlIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vY29sbGVjdGl2ZS1zb3VuZHdvcmtzL3NvdW5kd29ya3MtdGVtcGxhdGV9XG4gKi9cbmNvbnN0IGRlZmF1bHRGd0NvbmZpZyA9IHtcbiAgLyoqXG4gICAqIFRoZSBsb2NhdGlvbiBvZiB0aGUgcHVibGljIGRpcmVjdG9yeSBpbnNpZGUgdGhlIGFwcGxpY2F0aW9uLiBUaGlzIGRpcmVjdG9yeVxuICAgKiBzaG91bGQgdGhlbiBob3N0IGFsbCB0aGUgc3RhdGljIGFzc2V0cyBvZiB0aGUgYXBwbGljYXRpb24uXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqIEBkZWZhdWx0ICdwdWJsaWMnXG4gICAqL1xuICBwdWJsaWNGb2xkZXI6IHBhdGguam9pbihjd2QsICdwdWJsaWMnKSxcblxuICAvKipcbiAgICogVGhlIGxvY2F0aW9uIG9mIHRoZSBkaXJlY3Rvcnkgd2hlcmUgdGhlIHNlcnZlciB0ZW1wbGF0aW5nIHN5c3RlbSBzaG91bGRcbiAgICogZmluZCBpdCdzIGBlanNgIHRlbXBsYXRlcy5cbiAgICogQHR5cGUge1N0cmluZ31cbiAgICogQGRlZmF1bHQgJ2h0bWwnXG4gICAqL1xuICB0ZW1wbGF0ZURpcmVjdG9yeTogcGF0aC5qb2luKGN3ZCwgJ2h0bWwnKSxcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIGRlZmF1bHQgY2xpZW50IHR5cGUsIGkuZS4gdGhlIGNsaWVudCB0aGF0IGNhbiBhY2Nlc3MgdGhlXG4gICAqIGFwcGxpY2F0aW9uIGF0IGl0cyByb290IFVSTC5cbiAgICogQHR5cGUge1N0cmluZ31cbiAgICogQGRlZmF1bHQgJ3BsYXllcidcbiAgICovXG4gIGRlZmF1bHRDbGllbnQ6ICdwbGF5ZXInLFxuXG4gIC8qKlxuICAgKiBTb2NrZXQuaW8gY29uZmlndXJhdGlvbi5cbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtBcnJheX0gW3RyYW5zcG9ydHM9Wyd3ZWJzb2NrZXRzJ11dIC0gVGhlIHByZWZlcmVkIHdheSB0byBjcmVhdGVcbiAgICogIHNvY2tldHMuIElmIHRoZSBuZXR3b3JrIGlzIG5vdCBjb250cm9sbGVkLCB0aGlzIHZhbHVlIHNob3VsZCBiZSByZXZlcnRlZFxuICAgKiAgYmFjayB0byBzb2NrZXQuaW8ncyBkZWZhdWx0IHZhbHVlLlxuICAgKi9cbiAgc29ja2V0SU86IHtcbiAgICAvLyB1cmw6ICcnLFxuICAgIHRyYW5zcG9ydHM6IFsnd2Vic29ja2V0J10sXG4gICAgcGluZ1RpbWVvdXQ6IDYwMDAwLCAvLyBjb25maWd1cmUgY2xpZW50IHNpZGUgdG9vID9cbiAgICBwaW5nSW50ZXJ2YWw6IDUwMDAwLCAvLyBjb25maWd1cmUgY2xpZW50IHNpZGUgdG9vID9cbiAgICAvLyBAbm90ZTogRW5naW5lSU8gZGVmYXVsdHNcbiAgICAvLyBwaW5nVGltZW91dDogMzAwMCxcbiAgICAvLyBwaW5nSW50ZXJ2YWw6IDEwMDAsXG4gICAgLy8gdXBncmFkZVRpbWVvdXQ6IDEwMDAwLFxuICAgIC8vIG1heEh0dHBCdWZmZXJTaXplOiAxMEU3LFxuICB9LFxuXG4gIC8qKlxuICAgKiBCdW55YW4gY29uZmlndXJhdGlvblxuICAgKi9cbiAgbG9nZ2VyOiB7XG4gICAgbmFtZTogJ3NvdW5kd29ya3MnLFxuICAgIGxldmVsOiAnaW5mbycsXG4gICAgc3RyZWFtczogW3tcbiAgICAgIGxldmVsOiAnaW5mbycsXG4gICAgICBzdHJlYW06IHByb2Nlc3Muc3Rkb3V0LFxuICAgIH0sIC8qe1xuICAgICAgbGV2ZWw6ICdpbmZvJyxcbiAgICAgIHBhdGg6IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnbG9ncycsICdzb3VuZHdvcmtzLmxvZycpLFxuICAgIH0qL11cbiAgfSxcblxuICAvKiogQHByaXZhdGUgKi9cbiAgZXJyb3JSZXBvcnRlckRpcmVjdG9yeTogJ2xvZ3MvY2xpZW50cycsXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBkYkRpcmVjdG9yeTogJ2RiJyxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmF1bHRGd0NvbmZpZztcbiJdfQ==