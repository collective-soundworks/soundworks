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
    errorMessage: 'Sorry, no place is available',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlZmF1bHRWaWV3Q29udGVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkEsSUFBTSxxQkFBcUI7Ozs7OztBQU16QixhQUFXLEVBQVg7Ozs7OztBQU1BLHFCQUFtQjtBQUNqQixpQkFBYSxPQUFiO0FBQ0Esa0JBQWMsaUVBQWQ7QUFDQSxXQUFPLEtBQVA7QUFDQSxrQkFBYyw4QkFBZDtBQUNBLFVBQU0sZ0JBQU47QUFDQSxXQUFPLEVBQVA7R0FORjs7Ozs7O0FBYUEsb0JBQWtCO0FBQ2hCLGFBQVMsaUJBQVQ7R0FERjs7Ozs7O0FBUUEscUJBQW1CO0FBQ2pCLGtCQUFjLGtDQUFkO0FBQ0EsVUFBTSxNQUFOO0FBQ0EsYUFBUyxLQUFUO0dBSEY7Ozs7OztBQVVBLG9CQUFrQjtBQUNoQixrQkFBYyxzQkFBZDtBQUNBLFVBQU0sTUFBTjtBQUNBLFlBQVEsOEJBQVI7QUFDQSxhQUFTLEtBQVQ7QUFDQSxjQUFVLEtBQVY7R0FMRjs7Ozs7O0FBWUEsc0JBQW9CO0FBQ2xCLGtCQUFjLElBQWQ7QUFDQSxrQkFBYyxpRUFBZDtBQUNBLFdBQU8sWUFBUDtBQUNBLGtCQUFjLDJCQUFkO0dBSkY7Ozs7OztBQVdBLGtCQUFnQjtBQUNkLGdEQURjO0dBQWhCOzs7QUFLQSxZQUFVO0FBQ1IsVUFBTSxNQUFOO0FBQ0EsY0FBVSxVQUFWO0FBQ0EsWUFBUSxTQUFSO0FBQ0EsWUFBUSxHQUFSO0dBSkY7Q0F2RUk7O2tCQStFUyIsImZpbGUiOiJkZWZhdWx0Vmlld0NvbnRlbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRoZSBkZWZhdWx0IHZpZXcgY29udGVudHMgZm9yIHRoZSBzZXJ2aWNlcy4gRWFjaCBrZXkgY29ycmVzcG9uZCB0byB0aGUgYGlkYFxuICogYXR0cmlidXRlIG9mIHRoZSBhY3Rpdml0eSBpdCBpcyBhc3NvY2lhdGVkIHRvLlxuICpcbiAqIEVhY2ggY29udGVudCBkZWZpbmVzIHRoZSB2YXJpYWJsZXMgdGhhdCBhcmUgdXNlZCBpbnNpZGUgdGhlIGNvcnJlc3BvbmRpbmdcbiAqIFtgdGVtcGxhdGVgXXtAbGluayBtb2R1bGUgc291bmR3b3Jrcy9jbGllbnQuZGVmYXVsdFZpZXdUZW1wbGF0ZXN9LiBBIHNwZWNpYWxcbiAqIGtleSBgZ2xvYmFsc2AgaXMgYWNjZXNzaWJsZSBhbW9uZyBhbGwgdGVtcGxhdGVzIGFuZCBjYW4gdGhlbiBiZSB1c2VkIHRvIHNoYXJlXG4gKiB2YXJpYWJsZXMgYW1vbmcgYWxsIHRoZSB2aWV3cyBvZiB0aGUgYXBwbGljYXRpb24uXG4gKlxuICogVGhlc2UgZGVmYXVsdCBjb250ZW50IGNhbiBiZSBvdmVycmlkZW4gYnkgcGFzc2luZyBhbiBvYmplY3QgdG8gdGhlXG4gKiBbYGNsaWVudC5zZXRWaWV3Q29udGVudERlZmluaXRpb25zYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LmNsaWVudC5zZXRWaWV3Q29udGVudERlZmluaXRpb25zfVxuICogbWV0aG9kLlxuICpcbiAqIEBuYW1lc3BhY2VcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqXG4gKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuZGVmYXVsdFZpZXdUZW1wbGF0ZXN9XG4gKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuY2xpZW50fVxuICovXG5jb25zdCBkZWZhdWx0Vmlld0NvbnRlbnQgPSB7XG4gIC8qKlxuICAgKiBTcGVjaWFsIGVudHJ5IHVzZWQgdG8gc2hhcmUgdmFyaWFibGVzIGFtb25nIGFsbCB0aGUgdGVtcGxhdGVzIG9mIHRoZVxuICAgKiBhcHBsaWNhdGlvbiAoZm9yIGV4YW1wbGUgdGhlIGFwcGxpY2F0aW9uIG5hbWUpLlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgJ2dsb2JhbHMnOiB7fSxcblxuICAvKipcbiAgICogRGVmYXVsdCBjb250ZW50IGZvciB0aGUgYGNoZWNraW5gIHNlcnZpY2VcbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG4gICdzZXJ2aWNlOmNoZWNraW4nOiB7XG4gICAgbGFiZWxQcmVmaXg6ICdHbyB0bycsXG4gICAgbGFiZWxQb3N0Zml4OiAnVG91Y2ggdGhlIHNjcmVlbjxiciBjbGFzcz1cInBvcnRyYWl0LW9ubHlcIiAvPndoZW4geW91IGFyZSByZWFkeS4nLFxuICAgIGVycm9yOiBmYWxzZSxcbiAgICBlcnJvck1lc3NhZ2U6ICdTb3JyeSwgbm8gcGxhY2UgaXMgYXZhaWxhYmxlJyxcbiAgICB3YWl0OiAnUGxlYXNlIHdhaXQuLi4nLFxuICAgIGxhYmVsOiAnJyxcbiAgfSxcblxuICAvKipcbiAgICogRGVmYXVsdCBjb250ZW50IGZvciB0aGUgYGxvYWRlcmAgc2VydmljZVxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgJ3NlcnZpY2U6bG9hZGVyJzoge1xuICAgIGxvYWRpbmc6ICdMb2FkaW5nIHNvdW5kc+KApicsXG4gIH0sXG5cbiAgLyoqXG4gICAqIERlZmF1bHQgY29udGVudCBmb3IgdGhlIGBsb2NhdG9yYCBzZXJ2aWNlXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xuICAnc2VydmljZTpsb2NhdG9yJzoge1xuICAgIGluc3RydWN0aW9uczogJ0RlZmluZSB5b3VyIHBvc2l0aW9uIGluIHRoZSBhcmVhJyxcbiAgICBzZW5kOiAnU2VuZCcsXG4gICAgc2hvd0J0bjogZmFsc2UsXG4gIH0sXG5cbiAgLyoqXG4gICAqIERlZmF1bHQgY29udGVudCBmb3IgdGhlIGBwbGFjZXJgIHNlcnZpY2VcbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG4gICdzZXJ2aWNlOnBsYWNlcic6IHtcbiAgICBpbnN0cnVjdGlvbnM6ICdTZWxlY3QgeW91ciBwb3NpdGlvbicsXG4gICAgc2VuZDogJ1NlbmQnLFxuICAgIHJlamVjdDogJ1NvcnJ5LCBubyBwbGFjZSBpcyBhdmFpbGFibGUnLFxuICAgIHNob3dCdG46IGZhbHNlLFxuICAgIHJlamVjdGVkOiBmYWxzZSxcbiAgfSxcblxuICAvKipcbiAgICogRGVmYXVsdCBjb250ZW50IGZvciB0aGUgYHBsYXRmb3JtYCBzZXJ2aWNlXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xuICAnc2VydmljZTpwbGF0Zm9ybSc6IHtcbiAgICBpc0NvbXBhdGlibGU6IG51bGwsXG4gICAgZXJyb3JNZXNzYWdlOiAnU29ycnksPGJyIC8+WW91ciBkZXZpY2UgaXMgbm90IGNvbXBhdGlibGUgd2l0aCB0aGUgYXBwbGljYXRpb24uJyxcbiAgICBpbnRybzogJ1dlbGNvbWUgdG8nLFxuICAgIGluc3RydWN0aW9uczogJ1RvdWNoIHRoZSBzY3JlZW4gdG8gam9pbiEnLFxuICB9LFxuXG4gIC8qKlxuICAgKiBEZWZhdWx0IGNvbnRlbnQgZm9yIHRoZSBgc3luY2Agc2VydmljZVxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgJ3NlcnZpY2U6c3luYyc6IHtcbiAgICB3YWl0OiBgQ2xvY2sgc3luY2luZyw8YnIgLz5zdGFuZCBieSZoZWxsaXA7YCxcbiAgfSxcblxuICAvKiogQHByaXZhdGUgKi9cbiAgJ3N1cnZleSc6IHtcbiAgICBuZXh0OiAnTmV4dCcsXG4gICAgdmFsaWRhdGU6ICdWYWxpZGF0ZScsXG4gICAgdGhhbmtzOiAnVGhhbmtzIScsXG4gICAgbGVuZ3RoOiAnLScsXG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBkZWZhdWx0Vmlld0NvbnRlbnQ7XG4iXX0=