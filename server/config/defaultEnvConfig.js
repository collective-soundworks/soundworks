'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
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
var defaultEnvConfig = {
  /**
   * If assets (basically the content of the `publicFolder`) are hosted on a
   * separate server (e.g. nginx) for scalability and performance reasons,
   * register here the IP or URL of this server. By default, assets are served
   * by the node.js server.
   * @type {String}
   */
  assetsDomain: '/',

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
    cert: null
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
    sendPort: 57120
  }
};

exports.default = defaultEnvConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlZmF1bHRFbnZDb25maWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQVdBLElBQU0sbUJBQW1COzs7Ozs7OztBQVF2QixnQkFBYyxHQVJTOzs7Ozs7Ozs7Ozs7QUFvQnZCLFlBQVUsS0FwQmE7Ozs7Ozs7Ozs7QUE4QnZCLGNBQVk7QUFDVixTQUFLLElBREs7QUFFVixVQUFNO0FBRkksR0E5Qlc7Ozs7Ozs7O0FBeUN2QixRQUFNLElBekNpQjs7Ozs7Ozs7Ozs7Ozs7O0FBd0R2QixPQUFLO0FBQ0gsb0JBQWdCLFdBRGI7QUFFSCxpQkFBYSxLQUZWO0FBR0gsaUJBQWEsV0FIVjtBQUlILGNBQVU7QUFKUDtBQXhEa0IsQ0FBekI7O2tCQWdFZSxnQiIsImZpbGUiOiJkZWZhdWx0RW52Q29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb25maWd1cmF0aW9uIHBhcmFtZXRlcnMgb2YgdGhlICBlbnZpcm9ubmVtZW50LCBzZXBhcmF0ZSBmaWxlcyBjb3VsZCBiZVxuICogZGVmaW5lZCBmb3IgZGV2ZWxvcG1lbnQgYW5kIHByb2R1Y3Rpb24gcHVycG9zZSBhbmQgcGFzc2VkIGR5bmFtaWNhbGx5XG4gKiBhY2NvcmRpbmcgdG8gYSBnaXZlbiBgcHJvY2Vzcy5lbnZgIHZhcmlhYmxlLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXJcbiAqIEBuYW1lc3BhY2VcbiAqXG4gKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuZGVmYXVsdEFwcENvbmZpZ31cbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5kZWZhdWx0RndDb25maWd9XG4gKi9cbmNvbnN0IGRlZmF1bHRFbnZDb25maWcgPSB7XG4gIC8qKlxuICAgKiBJZiBhc3NldHMgKGJhc2ljYWxseSB0aGUgY29udGVudCBvZiB0aGUgYHB1YmxpY0ZvbGRlcmApIGFyZSBob3N0ZWQgb24gYVxuICAgKiBzZXBhcmF0ZSBzZXJ2ZXIgKGUuZy4gbmdpbngpIGZvciBzY2FsYWJpbGl0eSBhbmQgcGVyZm9ybWFuY2UgcmVhc29ucyxcbiAgICogcmVnaXN0ZXIgaGVyZSB0aGUgSVAgb3IgVVJMIG9mIHRoaXMgc2VydmVyLiBCeSBkZWZhdWx0LCBhc3NldHMgYXJlIHNlcnZlZFxuICAgKiBieSB0aGUgbm9kZS5qcyBzZXJ2ZXIuXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICBhc3NldHNEb21haW46ICcvJyxcblxuICAvKipcbiAgICogRGVmaW5lIGlmIHRoZSBIVFRQIHNlcnZlciBzaG91bGQgYmUgbGF1bmNoZWQgdXNpbmcgc2VjdXJlIGNvbm5lY3Rpb25zLlxuICAgKiBDdXJyZW50bHkgd2hlbiBzZXQgdG8gYHRydWVgIChuZWVkZWQgdG8gYWNjZXNzIHNvbWUgYnJvd3NlcnMgZmVhdHVyZXMgc3VjaFxuICAgKiBhcyBtaWNyb3Bob25lKSwgYSBjZXJ0aWZpY2F0ZSBpcyBjcmVhdGVkIG9uIHRoZSBmbHksIG1ha2luZyBicm93c2VycyB0b1xuICAgKiBkaXNwbGF5IGEgc2VjdXJpdHkgd2FybmluZy5cbiAgICogVGhpcyBvcHRpb25zIGlzIHRoZW4gbm90IHJlYWR5IGZvciBwcm9kdWN0aW9uIHVzZXMuXG4gICAqIEB0b2RvIC0gRGVmaW5lcyBob3cgdG8gY29uc3VtZSByZWFsIGNlcnRpZmljYXRlc1xuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHVzZUh0dHBzOiBmYWxzZSxcblxuICAvKipcbiAgICogUGF0aHMgdG8gdGhlIGtleSBhbmQgY2VydGlmaWNhdGUgdG8gYmUgdXNlZCBpbiBvcmRlciB0byBsYXVuY2ggdGhlIGh0dHBzXG4gICAqIHNlcnZlci4gQm90aCBlbnRyaWVzIG11c3QgYmUgaW5mb3JtZWQgb3RoZXJ3aXNlIGEgc2VsZlNpZ25lZCBjZXJ0aWZpY2F0ZVxuICAgKiBpcyBnZW5lcmF0ZWQgKHRoZSBsYXRlciBjYW4gYmUgdXNlZnVsbCBmb3IgZGV2ZWxvcG1lbnQgcHVycG9zZXMpLlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJvcGVydHkge1N0cmluZ30ga2V5IC0gUGF0aCB0byB0aGUga2V5LlxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gY2VydCAtIFBhdGggdG8gdGhlIGNlcnRpZmljYXRlLlxuICAgKi9cbiAgaHR0cHNJbmZvczoge1xuICAgIGtleTogbnVsbCxcbiAgICBjZXJ0OiBudWxsLFxuICB9LFxuXG4gIC8qKlxuICAgKiBEZWZhdWx0IHBvcnQgb2YgdGhlIGFwcGxpY2F0aW9uLCBpbiBwcm9kdWN0aW9uIHRoaXMgdmFsdWUgc2hvdWxkIHR5cGljYWxseVxuICAgKiBiZSBzZXQgdG8gODAuXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqIEBkZWZhdWx0IDgwMDBcbiAgICovXG4gIHBvcnQ6IDgwMDAsXG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyYXRpb24gb2YgdGhlIFtgT3NjYF17QGxpbmsgbW9kdWxlOnNvdW53b3Jrcy9zZXJ2ZXIuT3NjfSBzZXJ2aWNlLlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gW3JlY2VpdmVBZGRyZXNzPScxMjcuMC4wLjEnIC0gSVAgb2YgdGhlIGN1cnJlbnRseSBydW5uaW5nXG4gICAqICBub2RlIHNlcnZlci5cbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IFtyZWNlaXZlUG9ydD01NzEyMSAtIFBvcnQgd2hlcmUgdG8gbGlzdGVuIGluY29tbWluZ1xuICAgKiAgbWVzc2FnZXNcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IFtzZW5kQWRkcmVzcz0nMTI3LjAuMC4xJyAtIElQIG9mIHRoZSByZW1vdGUgYXBwbGljYXRpb24uXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBbc2VuZFBvcnQ9NTcxMjAgLSBQb3J0IHdoZXJlIHRoZSByZW1vdGUgYXBwbGljYXRpb24gaXNcbiAgICogIGxpc3RlbmluZyBmb3IgbWVzc2FnZXMuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3Vud29ya3Mvc2VydmVyLk9zY31cbiAgICovXG4gIG9zYzoge1xuICAgIHJlY2VpdmVBZGRyZXNzOiAnMTI3LjAuMC4xJyxcbiAgICByZWNlaXZlUG9ydDogNTcxMjEsXG4gICAgc2VuZEFkZHJlc3M6ICcxMjcuMC4wLjEnLFxuICAgIHNlbmRQb3J0OiA1NzEyMCxcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmF1bHRFbnZDb25maWc7XG4iXX0=