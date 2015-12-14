/**
 * The default templates for the shipped modules. The templates are organized according to the `Module.name` property.
 * @type {Object}
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {
  _globals: {
    appName: 'Soundworks'
  },
  checkin: {
    wait: '...',
    labelPrefix: 'Go to',
    labelPostfix: 'Touch the screen<br class="portrait-only" />when you are ready.',
    error: 'Sorry, we cannot accept any more connections at the moment, please try again later.'
  },
  loader: {
    loading: 'Loading sounds…'
  },
  orientation: {
    instructions: 'Point the phone exactly in front of you, and touch the screen.'
  },
  welcome: {
    welcome: 'Welcome to',
    touchScreen: 'Touch the screen to join!',
    errorIosVersion: 'This application requires at least iOS 7 with Safari or Chrome.',
    errorAndroidVersion: 'This application requires at least Android 4.2 with Chrome.',
    errorRequireMobile: 'This application is designed for iOS and Android mobile devices.',
    errorDefault: 'Sorry, the application cannot work properly on your device.'
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS9kZWZhdWx0VGV4dENvbnRlbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztxQkFJZTtBQUNiLFVBQVEsRUFBRTtBQUNSLFdBQU8sRUFBRSxZQUFZO0dBQ3RCO0FBQ0QsU0FBTyxFQUFFO0FBQ1AsUUFBSSxFQUFFLEtBQUs7QUFDWCxlQUFXLEVBQUUsT0FBTztBQUNwQixnQkFBWSxFQUFFLGlFQUFpRTtBQUMvRSxTQUFLLEVBQUUscUZBQXFGO0dBQzdGO0FBQ0QsUUFBTSxFQUFFO0FBQ04sV0FBTyxFQUFFLGlCQUFpQjtHQUMzQjtBQUNELGFBQVcsRUFBRTtBQUNYLGdCQUFZLEVBQUUsZ0VBQWdFO0dBQy9FO0FBQ0QsU0FBTyxFQUFFO0FBQ1AsV0FBTyxFQUFFLFlBQVk7QUFDckIsZUFBVyxFQUFFLDJCQUEyQjtBQUN4QyxtQkFBZSxFQUFFLGlFQUFpRTtBQUNsRix1QkFBbUIsRUFBRSw2REFBNkQ7QUFDbEYsc0JBQWtCLEVBQUUsa0VBQWtFO0FBQ3RGLGdCQUFZLEVBQUUsNkRBQTZEO0dBQzVFO0NBQ0YiLCJmaWxlIjoic3JjL2NsaWVudC9kaXNwbGF5L2RlZmF1bHRUZXh0Q29udGVudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRoZSBkZWZhdWx0IHRlbXBsYXRlcyBmb3IgdGhlIHNoaXBwZWQgbW9kdWxlcy4gVGhlIHRlbXBsYXRlcyBhcmUgb3JnYW5pemVkIGFjY29yZGluZyB0byB0aGUgYE1vZHVsZS5uYW1lYCBwcm9wZXJ0eS5cbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IHtcbiAgX2dsb2JhbHM6IHtcbiAgICBhcHBOYW1lOiAnU291bmR3b3JrcycsXG4gIH0sXG4gIGNoZWNraW46IHtcbiAgICB3YWl0OiAnLi4uJyxcbiAgICBsYWJlbFByZWZpeDogJ0dvIHRvJyxcbiAgICBsYWJlbFBvc3RmaXg6ICdUb3VjaCB0aGUgc2NyZWVuPGJyIGNsYXNzPVwicG9ydHJhaXQtb25seVwiIC8+d2hlbiB5b3UgYXJlIHJlYWR5LicsXG4gICAgZXJyb3I6ICdTb3JyeSwgd2UgY2Fubm90IGFjY2VwdCBhbnkgbW9yZSBjb25uZWN0aW9ucyBhdCB0aGUgbW9tZW50LCBwbGVhc2UgdHJ5IGFnYWluIGxhdGVyLicsXG4gIH0sXG4gIGxvYWRlcjoge1xuICAgIGxvYWRpbmc6ICdMb2FkaW5nIHNvdW5kc+KApicsXG4gIH0sXG4gIG9yaWVudGF0aW9uOiB7XG4gICAgaW5zdHJ1Y3Rpb25zOiAnUG9pbnQgdGhlIHBob25lIGV4YWN0bHkgaW4gZnJvbnQgb2YgeW91LCBhbmQgdG91Y2ggdGhlIHNjcmVlbi4nLFxuICB9LFxuICB3ZWxjb21lOiB7XG4gICAgd2VsY29tZTogJ1dlbGNvbWUgdG8nLFxuICAgIHRvdWNoU2NyZWVuOiAnVG91Y2ggdGhlIHNjcmVlbiB0byBqb2luIScsXG4gICAgZXJyb3JJb3NWZXJzaW9uOiAnVGhpcyBhcHBsaWNhdGlvbiByZXF1aXJlcyBhdCBsZWFzdCBpT1MgNyB3aXRoIFNhZmFyaSBvciBDaHJvbWUuJyxcbiAgICBlcnJvckFuZHJvaWRWZXJzaW9uOiAnVGhpcyBhcHBsaWNhdGlvbiByZXF1aXJlcyBhdCBsZWFzdCBBbmRyb2lkIDQuMiB3aXRoIENocm9tZS4nLFxuICAgIGVycm9yUmVxdWlyZU1vYmlsZTogJ1RoaXMgYXBwbGljYXRpb24gaXMgZGVzaWduZWQgZm9yIGlPUyBhbmQgQW5kcm9pZCBtb2JpbGUgZGV2aWNlcy4nLFxuICAgIGVycm9yRGVmYXVsdDogJ1NvcnJ5LCB0aGUgYXBwbGljYXRpb24gY2Fubm90IHdvcmsgcHJvcGVybHkgb24geW91ciBkZXZpY2UuJyxcbiAgfSxcbn07Il19