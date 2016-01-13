/**
 * The default templates for the shipped modules. The templates are organized according to the `Module.name` property.
 * @type {Object}
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {
  /* `globals` is populated with server `appName` and shared between all templates */
  globals: {},
  checkin: {
    wait: '...',
    labelPrefix: 'Go to',
    labelPostfix: 'Touch the screen<br class="portrait-only" />when you are ready.',
    error: 'Sorry, we cannot accept any more connections at the moment, please try again later.'
  },
  control: {
    title: 'Conductor'
  },
  loader: {
    loading: 'Loading sounds…'
  },
  locator: {
    instructions: 'Define your position in the area',
    send: 'Send'
  },
  orientation: {
    instructions: 'Point the phone exactly in front of you, and validate.',
    errorMessage: 'Sorry, your plone cannot support this application',
    send: 'Send',
    error: false
  },
  placer: {
    instructions: 'Select your position',
    send: 'Send'
  },
  survey: {
    next: 'Next',
    validate: 'Validate',
    thanks: 'Thanks!'
  },
  sync: {
    wait: 'Clock syncing,<br />stand by&hellip;'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS9kZWZhdWx0VGV4dENvbnRlbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztxQkFJZTs7QUFFYixTQUFPLEVBQUUsRUFBRTtBQUNYLFNBQU8sRUFBRTtBQUNQLFFBQUksRUFBRSxLQUFLO0FBQ1gsZUFBVyxFQUFFLE9BQU87QUFDcEIsZ0JBQVksRUFBRSxpRUFBaUU7QUFDL0UsU0FBSyxFQUFFLHFGQUFxRjtHQUM3RjtBQUNELFNBQU8sRUFBRTtBQUNQLFNBQUssRUFBRSxXQUFXO0dBQ25CO0FBQ0QsUUFBTSxFQUFFO0FBQ04sV0FBTyxFQUFFLGlCQUFpQjtHQUMzQjtBQUNELFNBQU8sRUFBRTtBQUNQLGdCQUFZLEVBQUUsa0NBQWtDO0FBQ2hELFFBQUksRUFBRSxNQUFNO0dBQ2I7QUFDRCxhQUFXLEVBQUU7QUFDWCxnQkFBWSxFQUFFLHdEQUF3RDtBQUN0RSxnQkFBWSxxREFBcUQ7QUFDakUsUUFBSSxFQUFFLE1BQU07QUFDWixTQUFLLEVBQUUsS0FBSztHQUNiO0FBQ0QsUUFBTSxFQUFFO0FBQ04sZ0JBQVksRUFBRSxzQkFBc0I7QUFDcEMsUUFBSSxFQUFFLE1BQU07R0FDYjtBQUNELFFBQU0sRUFBRTtBQUNOLFFBQUksRUFBRSxNQUFNO0FBQ1osWUFBUSxFQUFFLFVBQVU7QUFDcEIsVUFBTSxFQUFFLFNBQVM7R0FDbEI7QUFDRCxNQUFJLEVBQUU7QUFDSixRQUFJLHdDQUF3QztHQUM3QztBQUNELFNBQU8sRUFBRTtBQUNQLFdBQU8sRUFBRSxZQUFZO0FBQ3JCLGVBQVcsRUFBRSwyQkFBMkI7QUFDeEMsbUJBQWUsRUFBRSxpRUFBaUU7QUFDbEYsdUJBQW1CLEVBQUUsNkRBQTZEO0FBQ2xGLHNCQUFrQixFQUFFLGtFQUFrRTtBQUN0RixnQkFBWSxFQUFFLDZEQUE2RDtHQUM1RTtDQUNGIiwiZmlsZSI6InNyYy9jbGllbnQvZGlzcGxheS9kZWZhdWx0VGV4dENvbnRlbnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGUgZGVmYXVsdCB0ZW1wbGF0ZXMgZm9yIHRoZSBzaGlwcGVkIG1vZHVsZXMuIFRoZSB0ZW1wbGF0ZXMgYXJlIG9yZ2FuaXplZCBhY2NvcmRpbmcgdG8gdGhlIGBNb2R1bGUubmFtZWAgcHJvcGVydHkuXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qIGBnbG9iYWxzYCBpcyBwb3B1bGF0ZWQgd2l0aCBzZXJ2ZXIgYGFwcE5hbWVgIGFuZCBzaGFyZWQgYmV0d2VlbiBhbGwgdGVtcGxhdGVzICovXG4gIGdsb2JhbHM6IHt9LFxuICBjaGVja2luOiB7XG4gICAgd2FpdDogJy4uLicsXG4gICAgbGFiZWxQcmVmaXg6ICdHbyB0bycsXG4gICAgbGFiZWxQb3N0Zml4OiAnVG91Y2ggdGhlIHNjcmVlbjxiciBjbGFzcz1cInBvcnRyYWl0LW9ubHlcIiAvPndoZW4geW91IGFyZSByZWFkeS4nLFxuICAgIGVycm9yOiAnU29ycnksIHdlIGNhbm5vdCBhY2NlcHQgYW55IG1vcmUgY29ubmVjdGlvbnMgYXQgdGhlIG1vbWVudCwgcGxlYXNlIHRyeSBhZ2FpbiBsYXRlci4nLFxuICB9LFxuICBjb250cm9sOiB7XG4gICAgdGl0bGU6ICdDb25kdWN0b3InLFxuICB9LFxuICBsb2FkZXI6IHtcbiAgICBsb2FkaW5nOiAnTG9hZGluZyBzb3VuZHPigKYnLFxuICB9LFxuICBsb2NhdG9yOiB7XG4gICAgaW5zdHJ1Y3Rpb25zOiAnRGVmaW5lIHlvdXIgcG9zaXRpb24gaW4gdGhlIGFyZWEnLFxuICAgIHNlbmQ6ICdTZW5kJyxcbiAgfSxcbiAgb3JpZW50YXRpb246IHtcbiAgICBpbnN0cnVjdGlvbnM6ICdQb2ludCB0aGUgcGhvbmUgZXhhY3RseSBpbiBmcm9udCBvZiB5b3UsIGFuZCB2YWxpZGF0ZS4nLFxuICAgIGVycm9yTWVzc2FnZTogYFNvcnJ5LCB5b3VyIHBsb25lIGNhbm5vdCBzdXBwb3J0IHRoaXMgYXBwbGljYXRpb25gLFxuICAgIHNlbmQ6ICdTZW5kJyxcbiAgICBlcnJvcjogZmFsc2UsXG4gIH0sXG4gIHBsYWNlcjoge1xuICAgIGluc3RydWN0aW9uczogJ1NlbGVjdCB5b3VyIHBvc2l0aW9uJyxcbiAgICBzZW5kOiAnU2VuZCcsXG4gIH0sXG4gIHN1cnZleToge1xuICAgIG5leHQ6ICdOZXh0JyxcbiAgICB2YWxpZGF0ZTogJ1ZhbGlkYXRlJyxcbiAgICB0aGFua3M6ICdUaGFua3MhJyxcbiAgfSxcbiAgc3luYzoge1xuICAgIHdhaXQ6IGBDbG9jayBzeW5jaW5nLDxiciAvPnN0YW5kIGJ5JmhlbGxpcDtgLFxuICB9LFxuICB3ZWxjb21lOiB7XG4gICAgd2VsY29tZTogJ1dlbGNvbWUgdG8nLFxuICAgIHRvdWNoU2NyZWVuOiAnVG91Y2ggdGhlIHNjcmVlbiB0byBqb2luIScsXG4gICAgZXJyb3JJb3NWZXJzaW9uOiAnVGhpcyBhcHBsaWNhdGlvbiByZXF1aXJlcyBhdCBsZWFzdCBpT1MgNyB3aXRoIFNhZmFyaSBvciBDaHJvbWUuJyxcbiAgICBlcnJvckFuZHJvaWRWZXJzaW9uOiAnVGhpcyBhcHBsaWNhdGlvbiByZXF1aXJlcyBhdCBsZWFzdCBBbmRyb2lkIDQuMiB3aXRoIENocm9tZS4nLFxuICAgIGVycm9yUmVxdWlyZU1vYmlsZTogJ1RoaXMgYXBwbGljYXRpb24gaXMgZGVzaWduZWQgZm9yIGlPUyBhbmQgQW5kcm9pZCBtb2JpbGUgZGV2aWNlcy4nLFxuICAgIGVycm9yRGVmYXVsdDogJ1NvcnJ5LCB0aGUgYXBwbGljYXRpb24gY2Fubm90IHdvcmsgcHJvcGVybHkgb24geW91ciBkZXZpY2UuJyxcbiAgfSxcbn07XG4iXX0=