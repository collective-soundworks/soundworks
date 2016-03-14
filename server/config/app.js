'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Set of configuration parameters defined by a particular application.
 * These parameters typically inclusd a setup and control parameters values.
 */
exports.default = {
  appName: 'Soundworks', // title of the application (for <title> tag)
  version: '0.0.1', // version of the application (allow to bypass browser cache)
  /**
   * @param {Object} [setup={}] - Setup defining dimensions and predefined positions (labels and/or coordinates).
   * @attribute {Object} [setup.area=null] - The dimensions of the area.
   * @attribute {Number} [setup.area.height] - The height of the area.
   * @attribute {Number} [setup.area.width] - The width of the area.
   * @attribute {String} [setup.area.background] - The optionnal background (image) of the area.
   * @attribute {Array<String>} [setup.labels] - List of predefined labels.
   * @attribute {Array<Array>} [setup.coordinates] - List of predefined coordinates
   *  given as an array `[x:Number, y:Number]`.
   * @attribute {Number} [setup.capacity=Infinity] - Maximum number of places
   *  (may limit or be limited by the number of labels and/or coordinates defined by the setup).
   * @ttribute {Number} [setup.maxClientsPerPosition=1] - The maximum number of clients
   *  allowed in one position.
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
  controlParameters: {
    tempo: 120, // tempo in BPM
    volume: 0 }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7a0JBSWU7QUFDYixXQUFTLFlBQVQ7QUFDQSxXQUFTLE9BQVQ7Ozs7Ozs7Ozs7Ozs7OztBQWVBLFNBQU87QUFDTCxVQUFNO0FBQ0osYUFBTyxFQUFQO0FBQ0EsY0FBUSxFQUFSO0FBQ0Esa0JBQVksU0FBWjtLQUhGO0FBS0EsWUFBUSxTQUFSO0FBQ0EsaUJBQWEsU0FBYjtBQUNBLDJCQUF1QixDQUF2QjtBQUNBLGNBQVUsUUFBVjtHQVRGO0FBV0EscUJBQW1CO0FBQ2pCLFdBQU8sR0FBUDtBQUNBLFlBQVEsQ0FBUixFQUZGIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU2V0IG9mIGNvbmZpZ3VyYXRpb24gcGFyYW1ldGVycyBkZWZpbmVkIGJ5IGEgcGFydGljdWxhciBhcHBsaWNhdGlvbi5cbiAqIFRoZXNlIHBhcmFtZXRlcnMgdHlwaWNhbGx5IGluY2x1c2QgYSBzZXR1cCBhbmQgY29udHJvbCBwYXJhbWV0ZXJzIHZhbHVlcy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuICBhcHBOYW1lOiAnU291bmR3b3JrcycsIC8vIHRpdGxlIG9mIHRoZSBhcHBsaWNhdGlvbiAoZm9yIDx0aXRsZT4gdGFnKVxuICB2ZXJzaW9uOiAnMC4wLjEnLCAvLyB2ZXJzaW9uIG9mIHRoZSBhcHBsaWNhdGlvbiAoYWxsb3cgdG8gYnlwYXNzIGJyb3dzZXIgY2FjaGUpXG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW3NldHVwPXt9XSAtIFNldHVwIGRlZmluaW5nIGRpbWVuc2lvbnMgYW5kIHByZWRlZmluZWQgcG9zaXRpb25zIChsYWJlbHMgYW5kL29yIGNvb3JkaW5hdGVzKS5cbiAgICogQGF0dHJpYnV0ZSB7T2JqZWN0fSBbc2V0dXAuYXJlYT1udWxsXSAtIFRoZSBkaW1lbnNpb25zIG9mIHRoZSBhcmVhLlxuICAgKiBAYXR0cmlidXRlIHtOdW1iZXJ9IFtzZXR1cC5hcmVhLmhlaWdodF0gLSBUaGUgaGVpZ2h0IG9mIHRoZSBhcmVhLlxuICAgKiBAYXR0cmlidXRlIHtOdW1iZXJ9IFtzZXR1cC5hcmVhLndpZHRoXSAtIFRoZSB3aWR0aCBvZiB0aGUgYXJlYS5cbiAgICogQGF0dHJpYnV0ZSB7U3RyaW5nfSBbc2V0dXAuYXJlYS5iYWNrZ3JvdW5kXSAtIFRoZSBvcHRpb25uYWwgYmFja2dyb3VuZCAoaW1hZ2UpIG9mIHRoZSBhcmVhLlxuICAgKiBAYXR0cmlidXRlIHtBcnJheTxTdHJpbmc+fSBbc2V0dXAubGFiZWxzXSAtIExpc3Qgb2YgcHJlZGVmaW5lZCBsYWJlbHMuXG4gICAqIEBhdHRyaWJ1dGUge0FycmF5PEFycmF5Pn0gW3NldHVwLmNvb3JkaW5hdGVzXSAtIExpc3Qgb2YgcHJlZGVmaW5lZCBjb29yZGluYXRlc1xuICAgKiAgZ2l2ZW4gYXMgYW4gYXJyYXkgYFt4Ok51bWJlciwgeTpOdW1iZXJdYC5cbiAgICogQGF0dHJpYnV0ZSB7TnVtYmVyfSBbc2V0dXAuY2FwYWNpdHk9SW5maW5pdHldIC0gTWF4aW11bSBudW1iZXIgb2YgcGxhY2VzXG4gICAqICAobWF5IGxpbWl0IG9yIGJlIGxpbWl0ZWQgYnkgdGhlIG51bWJlciBvZiBsYWJlbHMgYW5kL29yIGNvb3JkaW5hdGVzIGRlZmluZWQgYnkgdGhlIHNldHVwKS5cbiAgICogQHR0cmlidXRlIHtOdW1iZXJ9IFtzZXR1cC5tYXhDbGllbnRzUGVyUG9zaXRpb249MV0gLSBUaGUgbWF4aW11bSBudW1iZXIgb2YgY2xpZW50c1xuICAgKiAgYWxsb3dlZCBpbiBvbmUgcG9zaXRpb24uXG4gICAqL1xuICBzZXR1cDoge1xuICAgIGFyZWE6IHtcbiAgICAgIHdpZHRoOiAxMCxcbiAgICAgIGhlaWdodDogMTAsXG4gICAgICBiYWNrZ3JvdW5kOiB1bmRlZmluZWQsXG4gICAgfSxcbiAgICBsYWJlbHM6IHVuZGVmaW5lZCxcbiAgICBjb29yZGluYXRlczogdW5kZWZpbmVkLFxuICAgIG1heENsaWVudHNQZXJQb3NpdGlvbjogMSxcbiAgICBjYXBhY2l0eTogSW5maW5pdHksXG4gIH0sXG4gIGNvbnRyb2xQYXJhbWV0ZXJzOiB7XG4gICAgdGVtcG86IDEyMCwgLy8gdGVtcG8gaW4gQlBNXG4gICAgdm9sdW1lOiAwLCAvLyBtYXN0ZXIgdm9sdW1lIGluIGRCXG4gIH0sXG59O1xuIl19