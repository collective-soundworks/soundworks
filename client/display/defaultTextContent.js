'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * The default templates for the shipped modules. The templates are organized according to the `Module.name` property.
 * @type {Object}
 */
exports.default = {
  /* `globals` is populated with server `appName` and shared between all templates */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlZmF1bHRUZXh0Q29udGVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7a0JBSWU7O0FBRWIsYUFBVyxFQUFYO0FBQ0EscUJBQW1CO0FBQ2pCLGlCQUFhLE9BQWI7QUFDQSxrQkFBYyxpRUFBZDtBQUNBLFdBQU8sS0FBUDtBQUNBLGtCQUFjLDhCQUFkO0FBQ0EsVUFBTSxnQkFBTjtBQUNBLFdBQU8sRUFBUDtHQU5GO0FBUUEscUJBQW1CO0FBQ2pCLFdBQU8sV0FBUDtHQURGO0FBR0Esb0JBQWtCO0FBQ2hCLGFBQVMsaUJBQVQ7R0FERjtBQUdBLHFCQUFtQjtBQUNqQixrQkFBYyxrQ0FBZDtBQUNBLFVBQU0sTUFBTjtBQUNBLGFBQVMsS0FBVDtHQUhGO0FBS0EseUJBQXVCO0FBQ3JCLGtCQUFjLHdEQUFkO0FBQ0EscUVBRnFCO0FBR3JCLFVBQU0sTUFBTjtBQUNBLFdBQU8sS0FBUDtHQUpGO0FBTUEsb0JBQWtCO0FBQ2hCLGtCQUFjLHNCQUFkO0FBQ0EsVUFBTSxNQUFOO0FBQ0EsWUFBUSw4QkFBUjtBQUNBLGFBQVMsS0FBVDtBQUNBLGNBQVUsS0FBVjtHQUxGO0FBT0Esa0JBQWdCO0FBQ2QsZ0RBRGM7R0FBaEI7QUFHQSxxQkFBbUI7QUFDakIsYUFBUyxZQUFUO0FBQ0EsaUJBQWEsMkJBQWI7QUFDQSxxQkFBaUIsaUVBQWpCO0FBQ0EseUJBQXFCLDZEQUFyQjtBQUNBLHdCQUFvQixrRUFBcEI7QUFDQSxrQkFBYyw2REFBZDtHQU5GOztBQVNBLFlBQVU7QUFDUixVQUFNLE1BQU47QUFDQSxjQUFVLFVBQVY7QUFDQSxZQUFRLFNBQVI7QUFDQSxZQUFRLEdBQVI7R0FKRiIsImZpbGUiOiJkZWZhdWx0VGV4dENvbnRlbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRoZSBkZWZhdWx0IHRlbXBsYXRlcyBmb3IgdGhlIHNoaXBwZWQgbW9kdWxlcy4gVGhlIHRlbXBsYXRlcyBhcmUgb3JnYW5pemVkIGFjY29yZGluZyB0byB0aGUgYE1vZHVsZS5uYW1lYCBwcm9wZXJ0eS5cbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IHtcbiAgLyogYGdsb2JhbHNgIGlzIHBvcHVsYXRlZCB3aXRoIHNlcnZlciBgYXBwTmFtZWAgYW5kIHNoYXJlZCBiZXR3ZWVuIGFsbCB0ZW1wbGF0ZXMgKi9cbiAgJ2dsb2JhbHMnOiB7fSxcbiAgJ3NlcnZpY2U6Y2hlY2tpbic6IHtcbiAgICBsYWJlbFByZWZpeDogJ0dvIHRvJyxcbiAgICBsYWJlbFBvc3RmaXg6ICdUb3VjaCB0aGUgc2NyZWVuPGJyIGNsYXNzPVwicG9ydHJhaXQtb25seVwiIC8+d2hlbiB5b3UgYXJlIHJlYWR5LicsXG4gICAgZXJyb3I6IGZhbHNlLFxuICAgIGVycm9yTWVzc2FnZTogJ1NvcnJ5LCBubyBwbGFjZSBpcyBhdmFpbGFibGUnLFxuICAgIHdhaXQ6ICdQbGVhc2Ugd2FpdC4uLicsXG4gICAgbGFiZWw6ICcnLFxuICB9LFxuICAnc2VydmljZTpjb250cm9sJzoge1xuICAgIHRpdGxlOiAnQ29uZHVjdG9yJyxcbiAgfSxcbiAgJ3NlcnZpY2U6bG9hZGVyJzoge1xuICAgIGxvYWRpbmc6ICdMb2FkaW5nIHNvdW5kc+KApicsXG4gIH0sXG4gICdzZXJ2aWNlOmxvY2F0b3InOiB7XG4gICAgaW5zdHJ1Y3Rpb25zOiAnRGVmaW5lIHlvdXIgcG9zaXRpb24gaW4gdGhlIGFyZWEnLFxuICAgIHNlbmQ6ICdTZW5kJyxcbiAgICBzaG93QnRuOiBmYWxzZSxcbiAgfSxcbiAgJ3NlcnZpY2U6b3JpZW50YXRpb24nOiB7XG4gICAgaW5zdHJ1Y3Rpb25zOiAnUG9pbnQgdGhlIHBob25lIGV4YWN0bHkgaW4gZnJvbnQgb2YgeW91LCBhbmQgdmFsaWRhdGUuJyxcbiAgICBlcnJvck1lc3NhZ2U6IGBTb3JyeSwgeW91ciBwbG9uZSBjYW5ub3Qgc3VwcG9ydCB0aGlzIGFwcGxpY2F0aW9uYCxcbiAgICBzZW5kOiAnU2VuZCcsXG4gICAgZXJyb3I6IGZhbHNlLFxuICB9LFxuICAnc2VydmljZTpwbGFjZXInOiB7XG4gICAgaW5zdHJ1Y3Rpb25zOiAnU2VsZWN0IHlvdXIgcG9zaXRpb24nLFxuICAgIHNlbmQ6ICdTZW5kJyxcbiAgICByZWplY3Q6ICdTb3JyeSwgbm8gcGxhY2UgaXMgYXZhaWxhYmxlJyxcbiAgICBzaG93QnRuOiBmYWxzZSxcbiAgICByZWplY3RlZDogZmFsc2UsXG4gIH0sXG4gICdzZXJ2aWNlOnN5bmMnOiB7XG4gICAgd2FpdDogYENsb2NrIHN5bmNpbmcsPGJyIC8+c3RhbmQgYnkmaGVsbGlwO2AsXG4gIH0sXG4gICdzZXJ2aWNlOndlbGNvbWUnOiB7XG4gICAgd2VsY29tZTogJ1dlbGNvbWUgdG8nLFxuICAgIHRvdWNoU2NyZWVuOiAnVG91Y2ggdGhlIHNjcmVlbiB0byBqb2luIScsXG4gICAgZXJyb3JJb3NWZXJzaW9uOiAnVGhpcyBhcHBsaWNhdGlvbiByZXF1aXJlcyBhdCBsZWFzdCBpT1MgNyB3aXRoIFNhZmFyaSBvciBDaHJvbWUuJyxcbiAgICBlcnJvckFuZHJvaWRWZXJzaW9uOiAnVGhpcyBhcHBsaWNhdGlvbiByZXF1aXJlcyBhdCBsZWFzdCBBbmRyb2lkIDQuMiB3aXRoIENocm9tZS4nLFxuICAgIGVycm9yUmVxdWlyZU1vYmlsZTogJ1RoaXMgYXBwbGljYXRpb24gaXMgZGVzaWduZWQgZm9yIGlPUyBhbmQgQW5kcm9pZCBtb2JpbGUgZGV2aWNlcy4nLFxuICAgIGVycm9yRGVmYXVsdDogJ1NvcnJ5LCB0aGUgYXBwbGljYXRpb24gY2Fubm90IHdvcmsgcHJvcGVybHkgb24geW91ciBkZXZpY2UuJyxcbiAgfSxcblxuICAnc3VydmV5Jzoge1xuICAgIG5leHQ6ICdOZXh0JyxcbiAgICB2YWxpZGF0ZTogJ1ZhbGlkYXRlJyxcbiAgICB0aGFua3M6ICdUaGFua3MhJyxcbiAgICBsZW5ndGg6ICctJyxcbiAgfSxcbn07XG4iXX0=