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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlZmF1bHRFbnZDb25maWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQVdBLElBQU0sbUJBQW1COzs7Ozs7OztBQVF2QixnQkFBYyxFQUFkOzs7Ozs7Ozs7Ozs7QUFZQSxZQUFVLEtBQVY7Ozs7Ozs7Ozs7QUFVQSxjQUFZO0FBQ1YsU0FBSyxJQUFMO0FBQ0EsVUFBTSxJQUFOO0dBRkY7Ozs7Ozs7O0FBV0EsUUFBTSxJQUFOOzs7Ozs7Ozs7Ozs7Ozs7QUFlQSxPQUFLO0FBQ0gsb0JBQWdCLFdBQWhCO0FBQ0EsaUJBQWEsS0FBYjtBQUNBLGlCQUFhLFdBQWI7QUFDQSxjQUFVLEtBQVY7R0FKRjtDQXhESTs7a0JBZ0VTIiwiZmlsZSI6ImRlZmF1bHRFbnZDb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvbmZpZ3VyYXRpb24gcGFyYW1ldGVycyBvZiB0aGUgIGVudmlyb25uZW1lbnQsIHNlcGFyYXRlIGZpbGVzIGNvdWxkIGJlXG4gKiBkZWZpbmVkIGZvciBkZXZlbG9wbWVudCBhbmQgcHJvZHVjdGlvbiBwdXJwb3NlIGFuZCBwYXNzZWQgZHluYW1pY2FsbHlcbiAqIGFjY29yZGluZyB0byBhIGdpdmVuIGBwcm9jZXNzLmVudmAgdmFyaWFibGUuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlclxuICogQG5hbWVzcGFjZVxuICpcbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5kZWZhdWx0QXBwQ29uZmlnfVxuICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLmRlZmF1bHRGd0NvbmZpZ31cbiAqL1xuY29uc3QgZGVmYXVsdEVudkNvbmZpZyA9IHtcbiAgLyoqXG4gICAqIElmIGFzc2V0cyAoYmFzaWNhbGx5IHRoZSBjb250ZW50IG9mIHRoZSBgcHVibGljRm9sZGVyYCkgYXJlIGhvc3RlZCBvbiBhXG4gICAqIHNlcGFyYXRlIHNlcnZlciAoZS5nLiBuZ2lueCkgZm9yIHNjYWxhYmlsaXR5IGFuZCBwZXJmb3JtYW5jZSByZWFzb25zLFxuICAgKiByZWdpc3RlciBoZXJlIHRoZSBJUCBvciBVUkwgb2YgdGhpcyBzZXJ2ZXIuIEJ5IGRlZmF1bHQsIGFzc2V0cyBhcmUgc2VydmVkXG4gICAqIGJ5IHRoZSBub2RlLmpzIHNlcnZlci5cbiAgICogQHR5cGUge1N0cmluZ31cbiAgICovXG4gIGFzc2V0c0RvbWFpbjogJycsXG5cbiAgLyoqXG4gICAqIERlZmluZSBpZiB0aGUgSFRUUCBzZXJ2ZXIgc2hvdWxkIGJlIGxhdW5jaGVkIHVzaW5nIHNlY3VyZSBjb25uZWN0aW9ucy5cbiAgICogQ3VycmVudGx5IHdoZW4gc2V0IHRvIGB0cnVlYCAobmVlZGVkIHRvIGFjY2VzcyBzb21lIGJyb3dzZXJzIGZlYXR1cmVzIHN1Y2hcbiAgICogYXMgbWljcm9waG9uZSksIGEgY2VydGlmaWNhdGUgaXMgY3JlYXRlZCBvbiB0aGUgZmx5LCBtYWtpbmcgYnJvd3NlcnMgdG9cbiAgICogZGlzcGxheSBhIHNlY3VyaXR5IHdhcm5pbmcuXG4gICAqIFRoaXMgb3B0aW9ucyBpcyB0aGVuIG5vdCByZWFkeSBmb3IgcHJvZHVjdGlvbiB1c2VzLlxuICAgKiBAdG9kbyAtIERlZmluZXMgaG93IHRvIGNvbnN1bWUgcmVhbCBjZXJ0aWZpY2F0ZXNcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICB1c2VIdHRwczogZmFsc2UsXG5cbiAgLyoqXG4gICAqIFBhdGhzIHRvIHRoZSBrZXkgYW5kIGNlcnRpZmljYXRlIHRvIGJlIHVzZWQgaW4gb3JkZXIgdG8gbGF1bmNoIHRoZSBodHRwc1xuICAgKiBzZXJ2ZXIuIEJvdGggZW50cmllcyBtdXN0IGJlIGluZm9ybWVkIG90aGVyd2lzZSBhIHNlbGZTaWduZWQgY2VydGlmaWNhdGVcbiAgICogaXMgZ2VuZXJhdGVkICh0aGUgbGF0ZXIgY2FuIGJlIHVzZWZ1bGwgZm9yIGRldmVsb3BtZW50IHB1cnBvc2VzKS5cbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IGtleSAtIFBhdGggdG8gdGhlIGtleS5cbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IGNlcnQgLSBQYXRoIHRvIHRoZSBjZXJ0aWZpY2F0ZS5cbiAgICovXG4gIGh0dHBzSW5mb3M6IHtcbiAgICBrZXk6IG51bGwsXG4gICAgY2VydDogbnVsbCxcbiAgfSxcblxuICAvKipcbiAgICogRGVmYXVsdCBwb3J0IG9mIHRoZSBhcHBsaWNhdGlvbiwgaW4gcHJvZHVjdGlvbiB0aGlzIHZhbHVlIHNob3VsZCB0eXBpY2FsbHlcbiAgICogYmUgc2V0IHRvIDgwLlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKiBAZGVmYXVsdCA4MDAwXG4gICAqL1xuICBwb3J0OiA4MDAwLFxuXG4gIC8qKlxuICAgKiBDb25maWd1cmF0aW9uIG9mIHRoZSBbYE9zY2Bde0BsaW5rIG1vZHVsZTpzb3Vud29ya3Mvc2VydmVyLk9zY30gc2VydmljZS5cbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IFtyZWNlaXZlQWRkcmVzcz0nMTI3LjAuMC4xJyAtIElQIG9mIHRoZSBjdXJyZW50bHkgcnVubmluZ1xuICAgKiAgbm9kZSBzZXJ2ZXIuXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBbcmVjZWl2ZVBvcnQ9NTcxMjEgLSBQb3J0IHdoZXJlIHRvIGxpc3RlbiBpbmNvbW1pbmdcbiAgICogIG1lc3NhZ2VzXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBbc2VuZEFkZHJlc3M9JzEyNy4wLjAuMScgLSBJUCBvZiB0aGUgcmVtb3RlIGFwcGxpY2F0aW9uLlxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gW3NlbmRQb3J0PTU3MTIwIC0gUG9ydCB3aGVyZSB0aGUgcmVtb3RlIGFwcGxpY2F0aW9uIGlzXG4gICAqICBsaXN0ZW5pbmcgZm9yIG1lc3NhZ2VzLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bndvcmtzL3NlcnZlci5Pc2N9XG4gICAqL1xuICBvc2M6IHtcbiAgICByZWNlaXZlQWRkcmVzczogJzEyNy4wLjAuMScsXG4gICAgcmVjZWl2ZVBvcnQ6IDU3MTIxLFxuICAgIHNlbmRBZGRyZXNzOiAnMTI3LjAuMC4xJyxcbiAgICBzZW5kUG9ydDogNTcxMjAsXG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBkZWZhdWx0RW52Q29uZmlnO1xuIl19