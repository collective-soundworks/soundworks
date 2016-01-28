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
  'globals': {},
  'service:checkin': {
    labelPrefix: 'Go to',
    labelPostfix: 'Touch the screen<br class="portrait-only" />when you are ready.',
    error: false,
    errorMessage: 'Sorry, we cannot accept any more connections at the moment, please try again later.',
    wait: 'Please wait...'
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
    showBtn: false
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
    thanks: 'Thanks!'
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS9kZWZhdWx0VGV4dENvbnRlbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztxQkFJZTs7QUFFYixXQUFTLEVBQUUsRUFBRTtBQUNiLG1CQUFpQixFQUFFO0FBQ2pCLGVBQVcsRUFBRSxPQUFPO0FBQ3BCLGdCQUFZLEVBQUUsaUVBQWlFO0FBQy9FLFNBQUssRUFBRSxLQUFLO0FBQ1osZ0JBQVksRUFBRSxxRkFBcUY7QUFDbkcsUUFBSSxFQUFFLGdCQUFnQjtHQUN2QjtBQUNELG1CQUFpQixFQUFFO0FBQ2pCLFNBQUssRUFBRSxXQUFXO0dBQ25CO0FBQ0Qsa0JBQWdCLEVBQUU7QUFDaEIsV0FBTyxFQUFFLGlCQUFpQjtHQUMzQjtBQUNELG1CQUFpQixFQUFFO0FBQ2pCLGdCQUFZLEVBQUUsa0NBQWtDO0FBQ2hELFFBQUksRUFBRSxNQUFNO0FBQ1osV0FBTyxFQUFFLEtBQUs7R0FDZjtBQUNELHVCQUFxQixFQUFFO0FBQ3JCLGdCQUFZLEVBQUUsd0RBQXdEO0FBQ3RFLGdCQUFZLHFEQUFxRDtBQUNqRSxRQUFJLEVBQUUsTUFBTTtBQUNaLFNBQUssRUFBRSxLQUFLO0dBQ2I7QUFDRCxrQkFBZ0IsRUFBRTtBQUNoQixnQkFBWSxFQUFFLHNCQUFzQjtBQUNwQyxRQUFJLEVBQUUsTUFBTTtBQUNaLFdBQU8sRUFBRSxLQUFLO0dBQ2Y7QUFDRCxnQkFBYyxFQUFFO0FBQ2QsUUFBSSx3Q0FBd0M7R0FDN0M7QUFDRCxtQkFBaUIsRUFBRTtBQUNqQixXQUFPLEVBQUUsWUFBWTtBQUNyQixlQUFXLEVBQUUsMkJBQTJCO0FBQ3hDLG1CQUFlLEVBQUUsaUVBQWlFO0FBQ2xGLHVCQUFtQixFQUFFLDZEQUE2RDtBQUNsRixzQkFBa0IsRUFBRSxrRUFBa0U7QUFDdEYsZ0JBQVksRUFBRSw2REFBNkQ7R0FDNUU7O0FBRUQsVUFBUSxFQUFFO0FBQ1IsUUFBSSxFQUFFLE1BQU07QUFDWixZQUFRLEVBQUUsVUFBVTtBQUNwQixVQUFNLEVBQUUsU0FBUztHQUNsQjtDQUNGIiwiZmlsZSI6InNyYy9jbGllbnQvZGlzcGxheS9kZWZhdWx0VGV4dENvbnRlbnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGUgZGVmYXVsdCB0ZW1wbGF0ZXMgZm9yIHRoZSBzaGlwcGVkIG1vZHVsZXMuIFRoZSB0ZW1wbGF0ZXMgYXJlIG9yZ2FuaXplZCBhY2NvcmRpbmcgdG8gdGhlIGBNb2R1bGUubmFtZWAgcHJvcGVydHkuXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qIGBnbG9iYWxzYCBpcyBwb3B1bGF0ZWQgd2l0aCBzZXJ2ZXIgYGFwcE5hbWVgIGFuZCBzaGFyZWQgYmV0d2VlbiBhbGwgdGVtcGxhdGVzICovXG4gICdnbG9iYWxzJzoge30sXG4gICdzZXJ2aWNlOmNoZWNraW4nOiB7XG4gICAgbGFiZWxQcmVmaXg6ICdHbyB0bycsXG4gICAgbGFiZWxQb3N0Zml4OiAnVG91Y2ggdGhlIHNjcmVlbjxiciBjbGFzcz1cInBvcnRyYWl0LW9ubHlcIiAvPndoZW4geW91IGFyZSByZWFkeS4nLFxuICAgIGVycm9yOiBmYWxzZSxcbiAgICBlcnJvck1lc3NhZ2U6ICdTb3JyeSwgd2UgY2Fubm90IGFjY2VwdCBhbnkgbW9yZSBjb25uZWN0aW9ucyBhdCB0aGUgbW9tZW50LCBwbGVhc2UgdHJ5IGFnYWluIGxhdGVyLicsXG4gICAgd2FpdDogJ1BsZWFzZSB3YWl0Li4uJyxcbiAgfSxcbiAgJ3NlcnZpY2U6Y29udHJvbCc6IHtcbiAgICB0aXRsZTogJ0NvbmR1Y3RvcicsXG4gIH0sXG4gICdzZXJ2aWNlOmxvYWRlcic6IHtcbiAgICBsb2FkaW5nOiAnTG9hZGluZyBzb3VuZHPigKYnLFxuICB9LFxuICAnc2VydmljZTpsb2NhdG9yJzoge1xuICAgIGluc3RydWN0aW9uczogJ0RlZmluZSB5b3VyIHBvc2l0aW9uIGluIHRoZSBhcmVhJyxcbiAgICBzZW5kOiAnU2VuZCcsXG4gICAgc2hvd0J0bjogZmFsc2UsXG4gIH0sXG4gICdzZXJ2aWNlOm9yaWVudGF0aW9uJzoge1xuICAgIGluc3RydWN0aW9uczogJ1BvaW50IHRoZSBwaG9uZSBleGFjdGx5IGluIGZyb250IG9mIHlvdSwgYW5kIHZhbGlkYXRlLicsXG4gICAgZXJyb3JNZXNzYWdlOiBgU29ycnksIHlvdXIgcGxvbmUgY2Fubm90IHN1cHBvcnQgdGhpcyBhcHBsaWNhdGlvbmAsXG4gICAgc2VuZDogJ1NlbmQnLFxuICAgIGVycm9yOiBmYWxzZSxcbiAgfSxcbiAgJ3NlcnZpY2U6cGxhY2VyJzoge1xuICAgIGluc3RydWN0aW9uczogJ1NlbGVjdCB5b3VyIHBvc2l0aW9uJyxcbiAgICBzZW5kOiAnU2VuZCcsXG4gICAgc2hvd0J0bjogZmFsc2UsXG4gIH0sXG4gICdzZXJ2aWNlOnN5bmMnOiB7XG4gICAgd2FpdDogYENsb2NrIHN5bmNpbmcsPGJyIC8+c3RhbmQgYnkmaGVsbGlwO2AsXG4gIH0sXG4gICdzZXJ2aWNlOndlbGNvbWUnOiB7XG4gICAgd2VsY29tZTogJ1dlbGNvbWUgdG8nLFxuICAgIHRvdWNoU2NyZWVuOiAnVG91Y2ggdGhlIHNjcmVlbiB0byBqb2luIScsXG4gICAgZXJyb3JJb3NWZXJzaW9uOiAnVGhpcyBhcHBsaWNhdGlvbiByZXF1aXJlcyBhdCBsZWFzdCBpT1MgNyB3aXRoIFNhZmFyaSBvciBDaHJvbWUuJyxcbiAgICBlcnJvckFuZHJvaWRWZXJzaW9uOiAnVGhpcyBhcHBsaWNhdGlvbiByZXF1aXJlcyBhdCBsZWFzdCBBbmRyb2lkIDQuMiB3aXRoIENocm9tZS4nLFxuICAgIGVycm9yUmVxdWlyZU1vYmlsZTogJ1RoaXMgYXBwbGljYXRpb24gaXMgZGVzaWduZWQgZm9yIGlPUyBhbmQgQW5kcm9pZCBtb2JpbGUgZGV2aWNlcy4nLFxuICAgIGVycm9yRGVmYXVsdDogJ1NvcnJ5LCB0aGUgYXBwbGljYXRpb24gY2Fubm90IHdvcmsgcHJvcGVybHkgb24geW91ciBkZXZpY2UuJyxcbiAgfSxcblxuICAnc3VydmV5Jzoge1xuICAgIG5leHQ6ICdOZXh0JyxcbiAgICB2YWxpZGF0ZTogJ1ZhbGlkYXRlJyxcbiAgICB0aGFua3M6ICdUaGFua3MhJyxcbiAgfSxcbn07XG4iXX0=