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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlZmF1bHRBcHBDb25maWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBLElBQU0sbUJBQW1COzs7Ozs7O0FBT3ZCLFdBQVMsWUFBVDs7Ozs7Ozs7QUFRQSxXQUFTLE9BQVQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBLFNBQU87QUFDTCxVQUFNO0FBQ0osYUFBTyxFQUFQO0FBQ0EsY0FBUSxFQUFSO0FBQ0Esa0JBQVksU0FBWjtLQUhGO0FBS0EsWUFBUSxTQUFSO0FBQ0EsaUJBQWEsU0FBYjtBQUNBLDJCQUF1QixDQUF2QjtBQUNBLGNBQVUsUUFBVjtHQVRGOztBQVlBLHFCQUFtQjtBQUNqQixXQUFPLEdBQVA7QUFDQSxZQUFRLENBQVIsRUFGRjtDQXJESTs7O2tCQTJEUyIsImZpbGUiOiJkZWZhdWx0QXBwQ29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTZXQgb2YgY29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzIGZvciBhIHBhcnRpY3VsYXIgYXBwbGljYXRpb24uXG4gKiBUaGVzZSBwYXJhbWV0ZXJzIHR5cGljYWxseSBpbmNsdXNkIGEgYHNldHVwYCBlbnRyeSBkZWZpbmluZyB0aGUgcGxhY2Ugd2hlcmVcbiAqIHRoZSBleHBlcmllbmNlIHRha2UgcGxhY2UuXG4gKlxuICogT3RoZXIgZW50cmllcyBjYW4gYmUgYWRkZWQgKGFzIGxvbmcgYXMgdGhlaXIgbmFtZSBkb2Vzbid0IGNvbmZsaWN0IHdpdGhcbiAqIGV4aXN0aW5nIG9uZXMpIHRvIGRlZmluZSBnbG9iYWwgcGFyYW1ldGVycyBvZiB0aGUgYXBwbGljYXRpb24gKGZvciBleGFtcGxlOlxuICogQlBNLCBzeW50aCBwYXJhbWV0ZXJzLCBldGMuKSB0aGF0IGNhbiB0aGVuIGJlIHNoYXJlZCBlYXNpbHkgYW1vbmcgYWxsIGNsaWVudHNcbiAqIHVzaW5nIHRoZSBbYHNoYXJlZC1jb25maWdgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuU2hhcmVkQ29uZmlnfVxuICogc2VydmljZS5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyXG4gKiBAbmFtZXNwYWNlXG4gKlxuICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLmRlZmF1bHRFbnZDb25maWd9XG4gKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuZGVmYXVsdEZ3Q29uZmlnfVxuICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLlNoYXJlZENvbmZpZ31cbiAqIEBzZWUge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy10ZW1wbGF0ZX1cbiAqL1xuY29uc3QgZGVmYXVsdEFwcENvbmZpZyA9IHtcbiAgLyoqXG4gICAqIFRpdGxlIG9mIHRoZSBhcHBsaWNhdGlvbiwgYnkgZGVmYXVsdCB0aGlzIHZhbHVlIGlzIHVzZWQgYnkgdGhlXG4gICAqIFtgcGxhdGZvcm1gXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhdGZvcm19IHNlcnZpY2UgdG8gcG9wdWxhdGVcbiAgICogaXRzIHZpZXcuXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICBhcHBOYW1lOiAnU291bmR3b3JrcycsXG4gIC8qKlxuICAgKiBWZXJzaW9uIG9mIHRoZSBhcHBsaWNhdGlvbi4gVGhpcyB2YWx1ZSBpcyB1c2VkIGluIHRoZVxuICAgKiBbYGFwcGxpY2F0aW9uIHRlbXBsYXRlYF17QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zb3VuZHdvcmtzLXRlbXBsYXRlfVxuICAgKiB0byBjaGFuZ2UganMgYW5kIGNzcyBmaWxlcyBVUkxzIGFuZCBieXBhc3MgYnJvd3NlcnMnIGNhY2hlLlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgdmVyc2lvbjogJzAuMC4xJyxcbiAgLyoqXG4gICAqIFRoaXMgZW50cnkgaXMgYWltZWQgdG8gZGVzY2liZSB0aGUgbG9jYXRpb24gd2hlcmUgdGhlIGV4cGVyaWVuY2UgdGFrZXNcbiAgICogcGxhY2VzLiBBbGwgdmFsdWVzIGNhbiBiZSBvdmVycmlkZW4gdG8gbWF0Y2ggdGhlIGV4aXN0aW5nIGxvY2F0aW9uIGFuZFxuICAgKiBleHBlcmllbmNlIHNldHVwIGJ1dCB0aGUgc3RydWN0dXJlIG9mIHRoZSBvYmplY3Qgc2hvdWxkIGJlIGtlcHQgaW4gb3JkZXIgdG9cbiAgICogYmUgY29uc3VtbWVkIHByb3Blcmx5IGJ5IHNlcnZpY2VzIGxpa2VcbiAgICogW2BjaGVja2luYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNoZWNraW59LFxuICAgKiBbYGxvY2F0b3JgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuTG9jYXRvcn0sXG4gICAqIG9yIFtgcGxhY2VyYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYWNlcn0uXG4gICAqXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBbc2V0dXAuYXJlYT1udWxsXSAtIERpbWVuc2lvbnMgb2YgdGhlIGFyZWEuXG4gICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBbc2V0dXAuYXJlYS5oZWlnaHQ9MTBdIC0gSGVpZ2h0IG9mIHRoZSBhcmVhLlxuICAgKiBAcHJvcGVydHkge051bWJlcn0gW3NldHVwLmFyZWEud2lkdGg9MTBdIC0gV2lkdGggb2YgdGhlIGFyZWEuXG4gICAqIEBwcm9wZXJ0eSB7QXJyYXk8U3RyaW5nPn0gW3NldHVwLmxhYmVsc10gLSBMaXN0IG9mIHByZWRlZmluZWQgbGFiZWxzLlxuICAgKiBAcHJvcGVydHkge0FycmF5PEFycmF5Pn0gW3NldHVwLmNvb3JkaW5hdGVzXSAtIExpc3Qgb2YgcHJlZGVmaW5lZCBjb29yZGluYXRlc1xuICAgKiAgZ2l2ZW4gYXMgYW4gYXJyYXkgb2YgYFt4Ok51bWJlciwgeTpOdW1iZXJdYC5cbiAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFtzZXR1cC5jYXBhY2l0eT1JbmZpbml0eV0gLSBNYXhpbXVtIG51bWJlciBvZiBwbGFjZXNcbiAgICogIChtYXkgbGltaXQgb3IgYmUgbGltaXRlZCBieSB0aGUgbnVtYmVyIG9mIGxhYmVscyBhbmQvb3IgY29vcmRpbmF0ZXMpLlxuICAgKiBAcHJvcGVydHkge051bWJlcn0gW3NldHVwLm1heENsaWVudHNQZXJQb3NpdGlvbj0xXSAtIFRoZSBtYXhpbXVtIG51bWJlciBvZlxuICAgKiAgY2xpZW50cyBhbGxvd2VkIGluIGEgcG9zaXRpb24uXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DaGVja2lufVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuTG9jYXRvcn1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYWNlcn1cbiAgICovXG4gIHNldHVwOiB7XG4gICAgYXJlYToge1xuICAgICAgd2lkdGg6IDEwLFxuICAgICAgaGVpZ2h0OiAxMCxcbiAgICAgIGJhY2tncm91bmQ6IHVuZGVmaW5lZCxcbiAgICB9LFxuICAgIGxhYmVsczogdW5kZWZpbmVkLFxuICAgIGNvb3JkaW5hdGVzOiB1bmRlZmluZWQsXG4gICAgbWF4Q2xpZW50c1BlclBvc2l0aW9uOiAxLFxuICAgIGNhcGFjaXR5OiBJbmZpbml0eSxcbiAgfSxcbiAgLyoqIEBwcml2YXRlICovXG4gIGNvbnRyb2xQYXJhbWV0ZXJzOiB7XG4gICAgdGVtcG86IDEyMCwgLy8gdGVtcG8gaW4gQlBNXG4gICAgdm9sdW1lOiAwLCAvLyBtYXN0ZXIgdm9sdW1lIGluIGRCXG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBkZWZhdWx0QXBwQ29uZmlnO1xuIl19