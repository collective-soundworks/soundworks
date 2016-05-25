'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * The default view contents for the services. Each key correspond to the `id`
 * attribute of the activity it is associated to.
 *
 * Each content defines the variables that are used inside the corresponding
 * [`template`]{@link module soundworks/client.defaultViewTemplates}. A special
 * key `globals` is accessible among all templates and can then be used to share
 * variables among all the views of the application.
 *
 * These default content can be overriden by passing an object to the
 * [`client.setViewContentDefinitions`]{@link module:soundworks/client.client.setViewContentDefinitions}
 * method.
 *
 * @namespace
 * @memberof module:soundworks/client
 *
 * @see {@link module:soundworks/client.defaultViewTemplates}
 * @see {@link module:soundworks/client.client}
 */
var defaultViewContent = {
  /**
   * Special entry used to share variables among all the templates of the
   * application (for example the application name).
   * @type {Object}
   */
  'globals': {},

  /**
   * Default content for the `checkin` service
   * @type {Object}
   */
  'service:checkin': {
    labelPrefix: 'Go to',
    labelPostfix: 'Touch the screen<br class="portrait-only" />when you are ready.',
    error: false,
    errorMessage: 'Sorry,<br/>no place available',
    wait: 'Please wait...',
    label: ''
  },

  /**
   * Default content for the `loader` service
   * @type {Object}
   */
  'service:loader': {
    loading: 'Loading sounds…'
  },

  /**
   * Default content for the `locator` service
   * @type {Object}
   */
  'service:locator': {
    instructions: 'Define your position in the area',
    send: 'Send',
    showBtn: false
  },

  /**
   * Default content for the `placer` service
   * @type {Object}
   */
  'service:placer': {
    instructions: 'Select your position',
    send: 'Send',
    reject: 'Sorry, no place is available',
    showBtn: false,
    rejected: false
  },

  /**
   * Default content for the `platform` service
   * @type {Object}
   */
  'service:platform': {
    isCompatible: null,
    errorMessage: 'Sorry,<br />Your device is not compatible with the application.',
    intro: 'Welcome to',
    instructions: 'Touch the screen to join!'
  },

  /**
   * Default content for the `sync` service
   * @type {Object}
   */
  'service:sync': {
    wait: 'Clock syncing,<br />stand by&hellip;'
  },

  /** @private */
  'survey': {
    next: 'Next',
    validate: 'Validate',
    thanks: 'Thanks!',
    length: '-'
  }
};

exports.default = defaultViewContent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlZmF1bHRWaWV3Q29udGVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkEsSUFBTSxxQkFBcUI7Ozs7OztBQU16QixhQUFXLEVBTmM7Ozs7OztBQVl6QixxQkFBbUI7QUFDakIsaUJBQWEsT0FESTtBQUVqQixrQkFBYyxpRUFGRztBQUdqQixXQUFPLEtBSFU7QUFJakIsa0JBQWMsK0JBSkc7QUFLakIsVUFBTSxnQkFMVztBQU1qQixXQUFPO0FBTlUsR0FaTTs7Ozs7O0FBeUJ6QixvQkFBa0I7QUFDaEIsYUFBUztBQURPLEdBekJPOzs7Ozs7QUFpQ3pCLHFCQUFtQjtBQUNqQixrQkFBYyxrQ0FERztBQUVqQixVQUFNLE1BRlc7QUFHakIsYUFBUztBQUhRLEdBakNNOzs7Ozs7QUEyQ3pCLG9CQUFrQjtBQUNoQixrQkFBYyxzQkFERTtBQUVoQixVQUFNLE1BRlU7QUFHaEIsWUFBUSw4QkFIUTtBQUloQixhQUFTLEtBSk87QUFLaEIsY0FBVTtBQUxNLEdBM0NPOzs7Ozs7QUF1RHpCLHNCQUFvQjtBQUNsQixrQkFBYyxJQURJO0FBRWxCLGtCQUFjLGlFQUZJO0FBR2xCLFdBQU8sWUFIVztBQUlsQixrQkFBYztBQUpJLEdBdkRLOzs7Ozs7QUFrRXpCLGtCQUFnQjtBQUNkO0FBRGMsR0FsRVM7OztBQXVFekIsWUFBVTtBQUNSLFVBQU0sTUFERTtBQUVSLGNBQVUsVUFGRjtBQUdSLFlBQVEsU0FIQTtBQUlSLFlBQVE7QUFKQTtBQXZFZSxDQUEzQjs7a0JBK0VlLGtCIiwiZmlsZSI6ImRlZmF1bHRWaWV3Q29udGVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGhlIGRlZmF1bHQgdmlldyBjb250ZW50cyBmb3IgdGhlIHNlcnZpY2VzLiBFYWNoIGtleSBjb3JyZXNwb25kIHRvIHRoZSBgaWRgXG4gKiBhdHRyaWJ1dGUgb2YgdGhlIGFjdGl2aXR5IGl0IGlzIGFzc29jaWF0ZWQgdG8uXG4gKlxuICogRWFjaCBjb250ZW50IGRlZmluZXMgdGhlIHZhcmlhYmxlcyB0aGF0IGFyZSB1c2VkIGluc2lkZSB0aGUgY29ycmVzcG9uZGluZ1xuICogW2B0ZW1wbGF0ZWBde0BsaW5rIG1vZHVsZSBzb3VuZHdvcmtzL2NsaWVudC5kZWZhdWx0Vmlld1RlbXBsYXRlc30uIEEgc3BlY2lhbFxuICoga2V5IGBnbG9iYWxzYCBpcyBhY2Nlc3NpYmxlIGFtb25nIGFsbCB0ZW1wbGF0ZXMgYW5kIGNhbiB0aGVuIGJlIHVzZWQgdG8gc2hhcmVcbiAqIHZhcmlhYmxlcyBhbW9uZyBhbGwgdGhlIHZpZXdzIG9mIHRoZSBhcHBsaWNhdGlvbi5cbiAqXG4gKiBUaGVzZSBkZWZhdWx0IGNvbnRlbnQgY2FuIGJlIG92ZXJyaWRlbiBieSBwYXNzaW5nIGFuIG9iamVjdCB0byB0aGVcbiAqIFtgY2xpZW50LnNldFZpZXdDb250ZW50RGVmaW5pdGlvbnNgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuY2xpZW50LnNldFZpZXdDb250ZW50RGVmaW5pdGlvbnN9XG4gKiBtZXRob2QuXG4gKlxuICogQG5hbWVzcGFjZVxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICpcbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5kZWZhdWx0Vmlld1RlbXBsYXRlc31cbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5jbGllbnR9XG4gKi9cbmNvbnN0IGRlZmF1bHRWaWV3Q29udGVudCA9IHtcbiAgLyoqXG4gICAqIFNwZWNpYWwgZW50cnkgdXNlZCB0byBzaGFyZSB2YXJpYWJsZXMgYW1vbmcgYWxsIHRoZSB0ZW1wbGF0ZXMgb2YgdGhlXG4gICAqIGFwcGxpY2F0aW9uIChmb3IgZXhhbXBsZSB0aGUgYXBwbGljYXRpb24gbmFtZSkuXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xuICAnZ2xvYmFscyc6IHt9LFxuXG4gIC8qKlxuICAgKiBEZWZhdWx0IGNvbnRlbnQgZm9yIHRoZSBgY2hlY2tpbmAgc2VydmljZVxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgJ3NlcnZpY2U6Y2hlY2tpbic6IHtcbiAgICBsYWJlbFByZWZpeDogJ0dvIHRvJyxcbiAgICBsYWJlbFBvc3RmaXg6ICdUb3VjaCB0aGUgc2NyZWVuPGJyIGNsYXNzPVwicG9ydHJhaXQtb25seVwiIC8+d2hlbiB5b3UgYXJlIHJlYWR5LicsXG4gICAgZXJyb3I6IGZhbHNlLFxuICAgIGVycm9yTWVzc2FnZTogJ1NvcnJ5LDxici8+bm8gcGxhY2UgYXZhaWxhYmxlJyxcbiAgICB3YWl0OiAnUGxlYXNlIHdhaXQuLi4nLFxuICAgIGxhYmVsOiAnJyxcbiAgfSxcblxuICAvKipcbiAgICogRGVmYXVsdCBjb250ZW50IGZvciB0aGUgYGxvYWRlcmAgc2VydmljZVxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgJ3NlcnZpY2U6bG9hZGVyJzoge1xuICAgIGxvYWRpbmc6ICdMb2FkaW5nIHNvdW5kc+KApicsXG4gIH0sXG5cbiAgLyoqXG4gICAqIERlZmF1bHQgY29udGVudCBmb3IgdGhlIGBsb2NhdG9yYCBzZXJ2aWNlXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xuICAnc2VydmljZTpsb2NhdG9yJzoge1xuICAgIGluc3RydWN0aW9uczogJ0RlZmluZSB5b3VyIHBvc2l0aW9uIGluIHRoZSBhcmVhJyxcbiAgICBzZW5kOiAnU2VuZCcsXG4gICAgc2hvd0J0bjogZmFsc2UsXG4gIH0sXG5cbiAgLyoqXG4gICAqIERlZmF1bHQgY29udGVudCBmb3IgdGhlIGBwbGFjZXJgIHNlcnZpY2VcbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG4gICdzZXJ2aWNlOnBsYWNlcic6IHtcbiAgICBpbnN0cnVjdGlvbnM6ICdTZWxlY3QgeW91ciBwb3NpdGlvbicsXG4gICAgc2VuZDogJ1NlbmQnLFxuICAgIHJlamVjdDogJ1NvcnJ5LCBubyBwbGFjZSBpcyBhdmFpbGFibGUnLFxuICAgIHNob3dCdG46IGZhbHNlLFxuICAgIHJlamVjdGVkOiBmYWxzZSxcbiAgfSxcblxuICAvKipcbiAgICogRGVmYXVsdCBjb250ZW50IGZvciB0aGUgYHBsYXRmb3JtYCBzZXJ2aWNlXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xuICAnc2VydmljZTpwbGF0Zm9ybSc6IHtcbiAgICBpc0NvbXBhdGlibGU6IG51bGwsXG4gICAgZXJyb3JNZXNzYWdlOiAnU29ycnksPGJyIC8+WW91ciBkZXZpY2UgaXMgbm90IGNvbXBhdGlibGUgd2l0aCB0aGUgYXBwbGljYXRpb24uJyxcbiAgICBpbnRybzogJ1dlbGNvbWUgdG8nLFxuICAgIGluc3RydWN0aW9uczogJ1RvdWNoIHRoZSBzY3JlZW4gdG8gam9pbiEnLFxuICB9LFxuXG4gIC8qKlxuICAgKiBEZWZhdWx0IGNvbnRlbnQgZm9yIHRoZSBgc3luY2Agc2VydmljZVxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgJ3NlcnZpY2U6c3luYyc6IHtcbiAgICB3YWl0OiBgQ2xvY2sgc3luY2luZyw8YnIgLz5zdGFuZCBieSZoZWxsaXA7YCxcbiAgfSxcblxuICAvKiogQHByaXZhdGUgKi9cbiAgJ3N1cnZleSc6IHtcbiAgICBuZXh0OiAnTmV4dCcsXG4gICAgdmFsaWRhdGU6ICdWYWxpZGF0ZScsXG4gICAgdGhhbmtzOiAnVGhhbmtzIScsXG4gICAgbGVuZ3RoOiAnLScsXG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBkZWZhdWx0Vmlld0NvbnRlbnQ7XG4iXX0=