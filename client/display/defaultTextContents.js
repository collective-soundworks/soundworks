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
    labelPrefix: 'Go to',
    labelPostfix: 'Touch the screen<br class="portrait-only" />when you are ready.',
    error: false,
    errorMessage: 'Sorry, we cannot accept any more connections at the moment, please try again later.',
    wait: 'Please wait...'
  },
  control: {
    title: 'Conductor'
  },
  loader: {
    loading: 'Loading sounds…'
  },
  locator: {
    instructions: 'Define your position in the area',
    send: 'Send',
    showBtn: false
  },
  orientation: {
    instructions: 'Point the phone exactly in front of you, and validate.',
    errorMessage: 'Sorry, your plone cannot support this application',
    send: 'Send',
    error: false
  },
  placer: {
    instructions: 'Select your position',
    send: 'Send',
    showBtn: false
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS9kZWZhdWx0VGV4dENvbnRlbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztxQkFJZTs7QUFFYixTQUFPLEVBQUUsRUFBRTtBQUNYLFNBQU8sRUFBRTtBQUNQLGVBQVcsRUFBRSxPQUFPO0FBQ3BCLGdCQUFZLEVBQUUsaUVBQWlFO0FBQy9FLFNBQUssRUFBRSxLQUFLO0FBQ1osZ0JBQVksRUFBRSxxRkFBcUY7QUFDbkcsUUFBSSxFQUFFLGdCQUFnQjtHQUN2QjtBQUNELFNBQU8sRUFBRTtBQUNQLFNBQUssRUFBRSxXQUFXO0dBQ25CO0FBQ0QsUUFBTSxFQUFFO0FBQ04sV0FBTyxFQUFFLGlCQUFpQjtHQUMzQjtBQUNELFNBQU8sRUFBRTtBQUNQLGdCQUFZLEVBQUUsa0NBQWtDO0FBQ2hELFFBQUksRUFBRSxNQUFNO0FBQ1osV0FBTyxFQUFFLEtBQUs7R0FDZjtBQUNELGFBQVcsRUFBRTtBQUNYLGdCQUFZLEVBQUUsd0RBQXdEO0FBQ3RFLGdCQUFZLHFEQUFxRDtBQUNqRSxRQUFJLEVBQUUsTUFBTTtBQUNaLFNBQUssRUFBRSxLQUFLO0dBQ2I7QUFDRCxRQUFNLEVBQUU7QUFDTixnQkFBWSxFQUFFLHNCQUFzQjtBQUNwQyxRQUFJLEVBQUUsTUFBTTtBQUNaLFdBQU8sRUFBRSxLQUFLO0dBQ2Y7QUFDRCxRQUFNLEVBQUU7QUFDTixRQUFJLEVBQUUsTUFBTTtBQUNaLFlBQVEsRUFBRSxVQUFVO0FBQ3BCLFVBQU0sRUFBRSxTQUFTO0dBQ2xCO0FBQ0QsTUFBSSxFQUFFO0FBQ0osUUFBSSx3Q0FBd0M7R0FDN0M7QUFDRCxTQUFPLEVBQUU7QUFDUCxXQUFPLEVBQUUsWUFBWTtBQUNyQixlQUFXLEVBQUUsMkJBQTJCO0FBQ3hDLG1CQUFlLEVBQUUsaUVBQWlFO0FBQ2xGLHVCQUFtQixFQUFFLDZEQUE2RDtBQUNsRixzQkFBa0IsRUFBRSxrRUFBa0U7QUFDdEYsZ0JBQVksRUFBRSw2REFBNkQ7R0FDNUU7Q0FDRiIsImZpbGUiOiJzcmMvY2xpZW50L2Rpc3BsYXkvZGVmYXVsdFRleHRDb250ZW50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGhlIGRlZmF1bHQgdGVtcGxhdGVzIGZvciB0aGUgc2hpcHBlZCBtb2R1bGVzLiBUaGUgdGVtcGxhdGVzIGFyZSBvcmdhbml6ZWQgYWNjb3JkaW5nIHRvIHRoZSBgTW9kdWxlLm5hbWVgIHByb3BlcnR5LlxuICogQHR5cGUge09iamVjdH1cbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuICAvKiBgZ2xvYmFsc2AgaXMgcG9wdWxhdGVkIHdpdGggc2VydmVyIGBhcHBOYW1lYCBhbmQgc2hhcmVkIGJldHdlZW4gYWxsIHRlbXBsYXRlcyAqL1xuICBnbG9iYWxzOiB7fSxcbiAgY2hlY2tpbjoge1xuICAgIGxhYmVsUHJlZml4OiAnR28gdG8nLFxuICAgIGxhYmVsUG9zdGZpeDogJ1RvdWNoIHRoZSBzY3JlZW48YnIgY2xhc3M9XCJwb3J0cmFpdC1vbmx5XCIgLz53aGVuIHlvdSBhcmUgcmVhZHkuJyxcbiAgICBlcnJvcjogZmFsc2UsXG4gICAgZXJyb3JNZXNzYWdlOiAnU29ycnksIHdlIGNhbm5vdCBhY2NlcHQgYW55IG1vcmUgY29ubmVjdGlvbnMgYXQgdGhlIG1vbWVudCwgcGxlYXNlIHRyeSBhZ2FpbiBsYXRlci4nLFxuICAgIHdhaXQ6ICdQbGVhc2Ugd2FpdC4uLicsXG4gIH0sXG4gIGNvbnRyb2w6IHtcbiAgICB0aXRsZTogJ0NvbmR1Y3RvcicsXG4gIH0sXG4gIGxvYWRlcjoge1xuICAgIGxvYWRpbmc6ICdMb2FkaW5nIHNvdW5kc+KApicsXG4gIH0sXG4gIGxvY2F0b3I6IHtcbiAgICBpbnN0cnVjdGlvbnM6ICdEZWZpbmUgeW91ciBwb3NpdGlvbiBpbiB0aGUgYXJlYScsXG4gICAgc2VuZDogJ1NlbmQnLFxuICAgIHNob3dCdG46IGZhbHNlLFxuICB9LFxuICBvcmllbnRhdGlvbjoge1xuICAgIGluc3RydWN0aW9uczogJ1BvaW50IHRoZSBwaG9uZSBleGFjdGx5IGluIGZyb250IG9mIHlvdSwgYW5kIHZhbGlkYXRlLicsXG4gICAgZXJyb3JNZXNzYWdlOiBgU29ycnksIHlvdXIgcGxvbmUgY2Fubm90IHN1cHBvcnQgdGhpcyBhcHBsaWNhdGlvbmAsXG4gICAgc2VuZDogJ1NlbmQnLFxuICAgIGVycm9yOiBmYWxzZSxcbiAgfSxcbiAgcGxhY2VyOiB7XG4gICAgaW5zdHJ1Y3Rpb25zOiAnU2VsZWN0IHlvdXIgcG9zaXRpb24nLFxuICAgIHNlbmQ6ICdTZW5kJyxcbiAgICBzaG93QnRuOiBmYWxzZSxcbiAgfSxcbiAgc3VydmV5OiB7XG4gICAgbmV4dDogJ05leHQnLFxuICAgIHZhbGlkYXRlOiAnVmFsaWRhdGUnLFxuICAgIHRoYW5rczogJ1RoYW5rcyEnLFxuICB9LFxuICBzeW5jOiB7XG4gICAgd2FpdDogYENsb2NrIHN5bmNpbmcsPGJyIC8+c3RhbmQgYnkmaGVsbGlwO2AsXG4gIH0sXG4gIHdlbGNvbWU6IHtcbiAgICB3ZWxjb21lOiAnV2VsY29tZSB0bycsXG4gICAgdG91Y2hTY3JlZW46ICdUb3VjaCB0aGUgc2NyZWVuIHRvIGpvaW4hJyxcbiAgICBlcnJvcklvc1ZlcnNpb246ICdUaGlzIGFwcGxpY2F0aW9uIHJlcXVpcmVzIGF0IGxlYXN0IGlPUyA3IHdpdGggU2FmYXJpIG9yIENocm9tZS4nLFxuICAgIGVycm9yQW5kcm9pZFZlcnNpb246ICdUaGlzIGFwcGxpY2F0aW9uIHJlcXVpcmVzIGF0IGxlYXN0IEFuZHJvaWQgNC4yIHdpdGggQ2hyb21lLicsXG4gICAgZXJyb3JSZXF1aXJlTW9iaWxlOiAnVGhpcyBhcHBsaWNhdGlvbiBpcyBkZXNpZ25lZCBmb3IgaU9TIGFuZCBBbmRyb2lkIG1vYmlsZSBkZXZpY2VzLicsXG4gICAgZXJyb3JEZWZhdWx0OiAnU29ycnksIHRoZSBhcHBsaWNhdGlvbiBjYW5ub3Qgd29yayBwcm9wZXJseSBvbiB5b3VyIGRldmljZS4nLFxuICB9LFxufTtcbiJdfQ==