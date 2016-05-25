'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Set of configuration parameters for a particular application.
 * These parameters typically inclusd a `setup` entry defining the place where
 * the experience take place.
 *
 * Other entries can be added (as long as their name doesn't conflict with
 * existing ones) to define global parameters of the application (for example:
 * BPM, synth parameters, etc.) that can then be shared easily among all clients
 * using the [`shared-config`]{@link module:soundworks/server.SharedConfig}
 * service.
 *
 * @memberof module:soundworks/server
 * @namespace
 *
 * @see {@link module:soundworks/server.defaultEnvConfig}
 * @see {@link module:soundworks/server.defaultFwConfig}
 * @see {@link module:soundworks/server.SharedConfig}
 * @see {@link https://github.com/collective-soundworks/soundworks-template}
 */
var defaultAppConfig = {
  /**
   * Title of the application, by default this value is used by the
   * [`platform`]{@link module:soundworks/client.Platform} service to populate
   * its view.
   * @type {String}
   */
  appName: 'Soundworks',
  /**
   * Version of the application. This value is used in the
   * [`application template`]{@link https://github.com/collective-soundworks/soundworks-template}
   * to change js and css files URLs and bypass browsers' cache.
   * @type {String}
   * @private
   */
  version: '0.0.1',
  /**
   * This entry is aimed to descibe the location where the experience takes
   * places. All values can be overriden to match the existing location and
   * experience setup but the structure of the object should be kept in order to
   * be consummed properly by services like
   * [`checkin`]{@link module:soundworks/client.Checkin},
   * [`locator`]{@link module:soundworks/client.Locator},
   * or [`placer`]{@link module:soundworks/client.Placer}.
   *
   * @type {Object}
   * @property {Object} [setup.area=null] - Dimensions of the area.
   * @property {Number} [setup.area.height=10] - Height of the area.
   * @property {Number} [setup.area.width=10] - Width of the area.
   * @property {Array<String>} [setup.labels] - List of predefined labels.
   * @property {Array<Array>} [setup.coordinates] - List of predefined coordinates
   *  given as an array of `[x:Number, y:Number]`.
   * @property {Number} [setup.capacity=Infinity] - Maximum number of places
   *  (may limit or be limited by the number of labels and/or coordinates).
   * @property {Number} [setup.maxClientsPerPosition=1] - The maximum number of
   *  clients allowed in a position.
   *
   * @see {@link module:soundworks/client.Checkin}
   * @see {@link module:soundworks/client.Locator}
   * @see {@link module:soundworks/client.Placer}
   */
  setup: {
    area: {
      width: 10,
      height: 10,
      background: undefined
    },
    labels: undefined,
    coordinates: undefined,
    maxClientsPerPosition: 1,
    capacity: Infinity
  },
  /** @private */
  controlParameters: {
    tempo: 120, // tempo in BPM
    volume: 0 }
};

// master volume in dB
exports.default = defaultAppConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlZmF1bHRBcHBDb25maWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBLElBQU0sbUJBQW1COzs7Ozs7O0FBT3ZCLFdBQVMsWUFQYzs7Ozs7Ozs7QUFldkIsV0FBUyxPQWZjOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlDdkIsU0FBTztBQUNMLFVBQU07QUFDSixhQUFPLEVBREg7QUFFSixjQUFRLEVBRko7QUFHSixrQkFBWTtBQUhSLEtBREQ7QUFNTCxZQUFRLFNBTkg7QUFPTCxpQkFBYSxTQVBSO0FBUUwsMkJBQXVCLENBUmxCO0FBU0wsY0FBVTtBQVRMLEdBekNnQjs7QUFxRHZCLHFCQUFtQjtBQUNqQixXQUFPLEdBRFUsRTtBQUVqQixZQUFRLENBRlM7QUFyREksQ0FBekI7OztrQkEyRGUsZ0IiLCJmaWxlIjoiZGVmYXVsdEFwcENvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU2V0IG9mIGNvbmZpZ3VyYXRpb24gcGFyYW1ldGVycyBmb3IgYSBwYXJ0aWN1bGFyIGFwcGxpY2F0aW9uLlxuICogVGhlc2UgcGFyYW1ldGVycyB0eXBpY2FsbHkgaW5jbHVzZCBhIGBzZXR1cGAgZW50cnkgZGVmaW5pbmcgdGhlIHBsYWNlIHdoZXJlXG4gKiB0aGUgZXhwZXJpZW5jZSB0YWtlIHBsYWNlLlxuICpcbiAqIE90aGVyIGVudHJpZXMgY2FuIGJlIGFkZGVkIChhcyBsb25nIGFzIHRoZWlyIG5hbWUgZG9lc24ndCBjb25mbGljdCB3aXRoXG4gKiBleGlzdGluZyBvbmVzKSB0byBkZWZpbmUgZ2xvYmFsIHBhcmFtZXRlcnMgb2YgdGhlIGFwcGxpY2F0aW9uIChmb3IgZXhhbXBsZTpcbiAqIEJQTSwgc3ludGggcGFyYW1ldGVycywgZXRjLikgdGhhdCBjYW4gdGhlbiBiZSBzaGFyZWQgZWFzaWx5IGFtb25nIGFsbCBjbGllbnRzXG4gKiB1c2luZyB0aGUgW2BzaGFyZWQtY29uZmlnYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLlNoYXJlZENvbmZpZ31cbiAqIHNlcnZpY2UuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlclxuICogQG5hbWVzcGFjZVxuICpcbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5kZWZhdWx0RW52Q29uZmlnfVxuICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLmRlZmF1bHRGd0NvbmZpZ31cbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5TaGFyZWRDb25maWd9XG4gKiBAc2VlIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vY29sbGVjdGl2ZS1zb3VuZHdvcmtzL3NvdW5kd29ya3MtdGVtcGxhdGV9XG4gKi9cbmNvbnN0IGRlZmF1bHRBcHBDb25maWcgPSB7XG4gIC8qKlxuICAgKiBUaXRsZSBvZiB0aGUgYXBwbGljYXRpb24sIGJ5IGRlZmF1bHQgdGhpcyB2YWx1ZSBpcyB1c2VkIGJ5IHRoZVxuICAgKiBbYHBsYXRmb3JtYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYXRmb3JtfSBzZXJ2aWNlIHRvIHBvcHVsYXRlXG4gICAqIGl0cyB2aWV3LlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgYXBwTmFtZTogJ1NvdW5kd29ya3MnLFxuICAvKipcbiAgICogVmVyc2lvbiBvZiB0aGUgYXBwbGljYXRpb24uIFRoaXMgdmFsdWUgaXMgdXNlZCBpbiB0aGVcbiAgICogW2BhcHBsaWNhdGlvbiB0ZW1wbGF0ZWBde0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy10ZW1wbGF0ZX1cbiAgICogdG8gY2hhbmdlIGpzIGFuZCBjc3MgZmlsZXMgVVJMcyBhbmQgYnlwYXNzIGJyb3dzZXJzJyBjYWNoZS5cbiAgICogQHR5cGUge1N0cmluZ31cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHZlcnNpb246ICcwLjAuMScsXG4gIC8qKlxuICAgKiBUaGlzIGVudHJ5IGlzIGFpbWVkIHRvIGRlc2NpYmUgdGhlIGxvY2F0aW9uIHdoZXJlIHRoZSBleHBlcmllbmNlIHRha2VzXG4gICAqIHBsYWNlcy4gQWxsIHZhbHVlcyBjYW4gYmUgb3ZlcnJpZGVuIHRvIG1hdGNoIHRoZSBleGlzdGluZyBsb2NhdGlvbiBhbmRcbiAgICogZXhwZXJpZW5jZSBzZXR1cCBidXQgdGhlIHN0cnVjdHVyZSBvZiB0aGUgb2JqZWN0IHNob3VsZCBiZSBrZXB0IGluIG9yZGVyIHRvXG4gICAqIGJlIGNvbnN1bW1lZCBwcm9wZXJseSBieSBzZXJ2aWNlcyBsaWtlXG4gICAqIFtgY2hlY2tpbmBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DaGVja2lufSxcbiAgICogW2Bsb2NhdG9yYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkxvY2F0b3J9LFxuICAgKiBvciBbYHBsYWNlcmBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGFjZXJ9LlxuICAgKlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJvcGVydHkge09iamVjdH0gW3NldHVwLmFyZWE9bnVsbF0gLSBEaW1lbnNpb25zIG9mIHRoZSBhcmVhLlxuICAgKiBAcHJvcGVydHkge051bWJlcn0gW3NldHVwLmFyZWEuaGVpZ2h0PTEwXSAtIEhlaWdodCBvZiB0aGUgYXJlYS5cbiAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFtzZXR1cC5hcmVhLndpZHRoPTEwXSAtIFdpZHRoIG9mIHRoZSBhcmVhLlxuICAgKiBAcHJvcGVydHkge0FycmF5PFN0cmluZz59IFtzZXR1cC5sYWJlbHNdIC0gTGlzdCBvZiBwcmVkZWZpbmVkIGxhYmVscy5cbiAgICogQHByb3BlcnR5IHtBcnJheTxBcnJheT59IFtzZXR1cC5jb29yZGluYXRlc10gLSBMaXN0IG9mIHByZWRlZmluZWQgY29vcmRpbmF0ZXNcbiAgICogIGdpdmVuIGFzIGFuIGFycmF5IG9mIGBbeDpOdW1iZXIsIHk6TnVtYmVyXWAuXG4gICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBbc2V0dXAuY2FwYWNpdHk9SW5maW5pdHldIC0gTWF4aW11bSBudW1iZXIgb2YgcGxhY2VzXG4gICAqICAobWF5IGxpbWl0IG9yIGJlIGxpbWl0ZWQgYnkgdGhlIG51bWJlciBvZiBsYWJlbHMgYW5kL29yIGNvb3JkaW5hdGVzKS5cbiAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFtzZXR1cC5tYXhDbGllbnRzUGVyUG9zaXRpb249MV0gLSBUaGUgbWF4aW11bSBudW1iZXIgb2ZcbiAgICogIGNsaWVudHMgYWxsb3dlZCBpbiBhIHBvc2l0aW9uLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2hlY2tpbn1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkxvY2F0b3J9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGFjZXJ9XG4gICAqL1xuICBzZXR1cDoge1xuICAgIGFyZWE6IHtcbiAgICAgIHdpZHRoOiAxMCxcbiAgICAgIGhlaWdodDogMTAsXG4gICAgICBiYWNrZ3JvdW5kOiB1bmRlZmluZWQsXG4gICAgfSxcbiAgICBsYWJlbHM6IHVuZGVmaW5lZCxcbiAgICBjb29yZGluYXRlczogdW5kZWZpbmVkLFxuICAgIG1heENsaWVudHNQZXJQb3NpdGlvbjogMSxcbiAgICBjYXBhY2l0eTogSW5maW5pdHksXG4gIH0sXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBjb250cm9sUGFyYW1ldGVyczoge1xuICAgIHRlbXBvOiAxMjAsIC8vIHRlbXBvIGluIEJQTVxuICAgIHZvbHVtZTogMCwgLy8gbWFzdGVyIHZvbHVtZSBpbiBkQlxuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmYXVsdEFwcENvbmZpZztcbiJdfQ==