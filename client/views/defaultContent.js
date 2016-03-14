'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * The default view templates for the provided services and scenes. The view templates are organized according to the `Module.name` property.
 * @type {Object}
 */
exports.default = {
  /* `globals` is populated with server `appName` and shared between all view templates */
  'globals': {},
  'service:checkin': {
    labelPrefix: 'Go to',
    labelPostfix: 'Touch the screen<br class="portrait-only" />when you are ready.',
    error: false,
    errorMessage: 'Sorry, no place is available',
    wait: 'Please wait...',
    label: ''
  },
  'service:control': {
    title: 'Conductor'
  },
  'service:loader': {
    loading: 'Loading sounds…'
  },
  'service:locator': {
    instructions: 'Define your position in the area',
    send: 'Send',
    showBtn: false
  },
  'service:orientation': {
    instructions: 'Point the phone exactly in front of you, and validate.',
    errorMessage: 'Sorry, your plone cannot support this application',
    send: 'Send',
    error: false
  },
  'service:placer': {
    instructions: 'Select your position',
    send: 'Send',
    reject: 'Sorry, no place is available',
    showBtn: false,
    rejected: false
  },
  'service:sync': {
    wait: 'Clock syncing,<br />stand by&hellip;'
  },
  'service:welcome': {
    welcome: 'Welcome to',
    touchScreen: 'Touch the screen to join!',
    errorIosVersion: 'This application requires at least iOS 7 with Safari or Chrome.',
    errorAndroidVersion: 'This application requires at least Android 4.2 with Chrome.',
    errorRequireMobile: 'This application is designed for iOS and Android mobile devices.',
    errorDefault: 'Sorry, the application cannot work properly on your device.'
  },

  'survey': {
    next: 'Next',
    validate: 'Validate',
    thanks: 'Thanks!',
    length: '-'
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlZmF1bHRDb250ZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztrQkFJZTs7QUFFYixhQUFXLEVBQVg7QUFDQSxxQkFBbUI7QUFDakIsaUJBQWEsT0FBYjtBQUNBLGtCQUFjLGlFQUFkO0FBQ0EsV0FBTyxLQUFQO0FBQ0Esa0JBQWMsOEJBQWQ7QUFDQSxVQUFNLGdCQUFOO0FBQ0EsV0FBTyxFQUFQO0dBTkY7QUFRQSxxQkFBbUI7QUFDakIsV0FBTyxXQUFQO0dBREY7QUFHQSxvQkFBa0I7QUFDaEIsYUFBUyxpQkFBVDtHQURGO0FBR0EscUJBQW1CO0FBQ2pCLGtCQUFjLGtDQUFkO0FBQ0EsVUFBTSxNQUFOO0FBQ0EsYUFBUyxLQUFUO0dBSEY7QUFLQSx5QkFBdUI7QUFDckIsa0JBQWMsd0RBQWQ7QUFDQSxxRUFGcUI7QUFHckIsVUFBTSxNQUFOO0FBQ0EsV0FBTyxLQUFQO0dBSkY7QUFNQSxvQkFBa0I7QUFDaEIsa0JBQWMsc0JBQWQ7QUFDQSxVQUFNLE1BQU47QUFDQSxZQUFRLDhCQUFSO0FBQ0EsYUFBUyxLQUFUO0FBQ0EsY0FBVSxLQUFWO0dBTEY7QUFPQSxrQkFBZ0I7QUFDZCxnREFEYztHQUFoQjtBQUdBLHFCQUFtQjtBQUNqQixhQUFTLFlBQVQ7QUFDQSxpQkFBYSwyQkFBYjtBQUNBLHFCQUFpQixpRUFBakI7QUFDQSx5QkFBcUIsNkRBQXJCO0FBQ0Esd0JBQW9CLGtFQUFwQjtBQUNBLGtCQUFjLDZEQUFkO0dBTkY7O0FBU0EsWUFBVTtBQUNSLFVBQU0sTUFBTjtBQUNBLGNBQVUsVUFBVjtBQUNBLFlBQVEsU0FBUjtBQUNBLFlBQVEsR0FBUjtHQUpGIiwiZmlsZSI6ImRlZmF1bHRDb250ZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGUgZGVmYXVsdCB2aWV3IHRlbXBsYXRlcyBmb3IgdGhlIHByb3ZpZGVkIHNlcnZpY2VzIGFuZCBzY2VuZXMuIFRoZSB2aWV3IHRlbXBsYXRlcyBhcmUgb3JnYW5pemVkIGFjY29yZGluZyB0byB0aGUgYE1vZHVsZS5uYW1lYCBwcm9wZXJ0eS5cbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IHtcbiAgLyogYGdsb2JhbHNgIGlzIHBvcHVsYXRlZCB3aXRoIHNlcnZlciBgYXBwTmFtZWAgYW5kIHNoYXJlZCBiZXR3ZWVuIGFsbCB2aWV3IHRlbXBsYXRlcyAqL1xuICAnZ2xvYmFscyc6IHt9LFxuICAnc2VydmljZTpjaGVja2luJzoge1xuICAgIGxhYmVsUHJlZml4OiAnR28gdG8nLFxuICAgIGxhYmVsUG9zdGZpeDogJ1RvdWNoIHRoZSBzY3JlZW48YnIgY2xhc3M9XCJwb3J0cmFpdC1vbmx5XCIgLz53aGVuIHlvdSBhcmUgcmVhZHkuJyxcbiAgICBlcnJvcjogZmFsc2UsXG4gICAgZXJyb3JNZXNzYWdlOiAnU29ycnksIG5vIHBsYWNlIGlzIGF2YWlsYWJsZScsXG4gICAgd2FpdDogJ1BsZWFzZSB3YWl0Li4uJyxcbiAgICBsYWJlbDogJycsXG4gIH0sXG4gICdzZXJ2aWNlOmNvbnRyb2wnOiB7XG4gICAgdGl0bGU6ICdDb25kdWN0b3InLFxuICB9LFxuICAnc2VydmljZTpsb2FkZXInOiB7XG4gICAgbG9hZGluZzogJ0xvYWRpbmcgc291bmRz4oCmJyxcbiAgfSxcbiAgJ3NlcnZpY2U6bG9jYXRvcic6IHtcbiAgICBpbnN0cnVjdGlvbnM6ICdEZWZpbmUgeW91ciBwb3NpdGlvbiBpbiB0aGUgYXJlYScsXG4gICAgc2VuZDogJ1NlbmQnLFxuICAgIHNob3dCdG46IGZhbHNlLFxuICB9LFxuICAnc2VydmljZTpvcmllbnRhdGlvbic6IHtcbiAgICBpbnN0cnVjdGlvbnM6ICdQb2ludCB0aGUgcGhvbmUgZXhhY3RseSBpbiBmcm9udCBvZiB5b3UsIGFuZCB2YWxpZGF0ZS4nLFxuICAgIGVycm9yTWVzc2FnZTogYFNvcnJ5LCB5b3VyIHBsb25lIGNhbm5vdCBzdXBwb3J0IHRoaXMgYXBwbGljYXRpb25gLFxuICAgIHNlbmQ6ICdTZW5kJyxcbiAgICBlcnJvcjogZmFsc2UsXG4gIH0sXG4gICdzZXJ2aWNlOnBsYWNlcic6IHtcbiAgICBpbnN0cnVjdGlvbnM6ICdTZWxlY3QgeW91ciBwb3NpdGlvbicsXG4gICAgc2VuZDogJ1NlbmQnLFxuICAgIHJlamVjdDogJ1NvcnJ5LCBubyBwbGFjZSBpcyBhdmFpbGFibGUnLFxuICAgIHNob3dCdG46IGZhbHNlLFxuICAgIHJlamVjdGVkOiBmYWxzZSxcbiAgfSxcbiAgJ3NlcnZpY2U6c3luYyc6IHtcbiAgICB3YWl0OiBgQ2xvY2sgc3luY2luZyw8YnIgLz5zdGFuZCBieSZoZWxsaXA7YCxcbiAgfSxcbiAgJ3NlcnZpY2U6d2VsY29tZSc6IHtcbiAgICB3ZWxjb21lOiAnV2VsY29tZSB0bycsXG4gICAgdG91Y2hTY3JlZW46ICdUb3VjaCB0aGUgc2NyZWVuIHRvIGpvaW4hJyxcbiAgICBlcnJvcklvc1ZlcnNpb246ICdUaGlzIGFwcGxpY2F0aW9uIHJlcXVpcmVzIGF0IGxlYXN0IGlPUyA3IHdpdGggU2FmYXJpIG9yIENocm9tZS4nLFxuICAgIGVycm9yQW5kcm9pZFZlcnNpb246ICdUaGlzIGFwcGxpY2F0aW9uIHJlcXVpcmVzIGF0IGxlYXN0IEFuZHJvaWQgNC4yIHdpdGggQ2hyb21lLicsXG4gICAgZXJyb3JSZXF1aXJlTW9iaWxlOiAnVGhpcyBhcHBsaWNhdGlvbiBpcyBkZXNpZ25lZCBmb3IgaU9TIGFuZCBBbmRyb2lkIG1vYmlsZSBkZXZpY2VzLicsXG4gICAgZXJyb3JEZWZhdWx0OiAnU29ycnksIHRoZSBhcHBsaWNhdGlvbiBjYW5ub3Qgd29yayBwcm9wZXJseSBvbiB5b3VyIGRldmljZS4nLFxuICB9LFxuXG4gICdzdXJ2ZXknOiB7XG4gICAgbmV4dDogJ05leHQnLFxuICAgIHZhbGlkYXRlOiAnVmFsaWRhdGUnLFxuICAgIHRoYW5rczogJ1RoYW5rcyEnLFxuICAgIGxlbmd0aDogJy0nLFxuICB9LFxufTtcbiJdfQ==