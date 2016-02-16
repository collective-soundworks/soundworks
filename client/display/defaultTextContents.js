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
    thanks: 'Thanks!'
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS9kZWZhdWx0VGV4dENvbnRlbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztxQkFJZTs7QUFFYixXQUFTLEVBQUUsRUFBRTtBQUNiLG1CQUFpQixFQUFFO0FBQ2pCLGVBQVcsRUFBRSxPQUFPO0FBQ3BCLGdCQUFZLEVBQUUsaUVBQWlFO0FBQy9FLFNBQUssRUFBRSxLQUFLO0FBQ1osZ0JBQVksRUFBRSw4QkFBOEI7QUFDNUMsUUFBSSxFQUFFLGdCQUFnQjtBQUN0QixTQUFLLEVBQUUsRUFBRTtHQUNWO0FBQ0QsbUJBQWlCLEVBQUU7QUFDakIsU0FBSyxFQUFFLFdBQVc7R0FDbkI7QUFDRCxrQkFBZ0IsRUFBRTtBQUNoQixXQUFPLEVBQUUsaUJBQWlCO0dBQzNCO0FBQ0QsbUJBQWlCLEVBQUU7QUFDakIsZ0JBQVksRUFBRSxrQ0FBa0M7QUFDaEQsUUFBSSxFQUFFLE1BQU07QUFDWixXQUFPLEVBQUUsS0FBSztHQUNmO0FBQ0QsdUJBQXFCLEVBQUU7QUFDckIsZ0JBQVksRUFBRSx3REFBd0Q7QUFDdEUsZ0JBQVkscURBQXFEO0FBQ2pFLFFBQUksRUFBRSxNQUFNO0FBQ1osU0FBSyxFQUFFLEtBQUs7R0FDYjtBQUNELGtCQUFnQixFQUFFO0FBQ2hCLGdCQUFZLEVBQUUsc0JBQXNCO0FBQ3BDLFFBQUksRUFBRSxNQUFNO0FBQ1osVUFBTSxFQUFFLDhCQUE4QjtBQUN0QyxXQUFPLEVBQUUsS0FBSztBQUNkLFlBQVEsRUFBRSxLQUFLO0dBQ2hCO0FBQ0QsZ0JBQWMsRUFBRTtBQUNkLFFBQUksd0NBQXdDO0dBQzdDO0FBQ0QsbUJBQWlCLEVBQUU7QUFDakIsV0FBTyxFQUFFLFlBQVk7QUFDckIsZUFBVyxFQUFFLDJCQUEyQjtBQUN4QyxtQkFBZSxFQUFFLGlFQUFpRTtBQUNsRix1QkFBbUIsRUFBRSw2REFBNkQ7QUFDbEYsc0JBQWtCLEVBQUUsa0VBQWtFO0FBQ3RGLGdCQUFZLEVBQUUsNkRBQTZEO0dBQzVFOztBQUVELFVBQVEsRUFBRTtBQUNSLFFBQUksRUFBRSxNQUFNO0FBQ1osWUFBUSxFQUFFLFVBQVU7QUFDcEIsVUFBTSxFQUFFLFNBQVM7R0FDbEI7Q0FDRiIsImZpbGUiOiJzcmMvY2xpZW50L2Rpc3BsYXkvZGVmYXVsdFRleHRDb250ZW50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGhlIGRlZmF1bHQgdGVtcGxhdGVzIGZvciB0aGUgc2hpcHBlZCBtb2R1bGVzLiBUaGUgdGVtcGxhdGVzIGFyZSBvcmdhbml6ZWQgYWNjb3JkaW5nIHRvIHRoZSBgTW9kdWxlLm5hbWVgIHByb3BlcnR5LlxuICogQHR5cGUge09iamVjdH1cbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuICAvKiBgZ2xvYmFsc2AgaXMgcG9wdWxhdGVkIHdpdGggc2VydmVyIGBhcHBOYW1lYCBhbmQgc2hhcmVkIGJldHdlZW4gYWxsIHRlbXBsYXRlcyAqL1xuICAnZ2xvYmFscyc6IHt9LFxuICAnc2VydmljZTpjaGVja2luJzoge1xuICAgIGxhYmVsUHJlZml4OiAnR28gdG8nLFxuICAgIGxhYmVsUG9zdGZpeDogJ1RvdWNoIHRoZSBzY3JlZW48YnIgY2xhc3M9XCJwb3J0cmFpdC1vbmx5XCIgLz53aGVuIHlvdSBhcmUgcmVhZHkuJyxcbiAgICBlcnJvcjogZmFsc2UsXG4gICAgZXJyb3JNZXNzYWdlOiAnU29ycnksIG5vIHBsYWNlIGlzIGF2YWlsYWJsZScsXG4gICAgd2FpdDogJ1BsZWFzZSB3YWl0Li4uJyxcbiAgICBsYWJlbDogJycsXG4gIH0sXG4gICdzZXJ2aWNlOmNvbnRyb2wnOiB7XG4gICAgdGl0bGU6ICdDb25kdWN0b3InLFxuICB9LFxuICAnc2VydmljZTpsb2FkZXInOiB7XG4gICAgbG9hZGluZzogJ0xvYWRpbmcgc291bmRz4oCmJyxcbiAgfSxcbiAgJ3NlcnZpY2U6bG9jYXRvcic6IHtcbiAgICBpbnN0cnVjdGlvbnM6ICdEZWZpbmUgeW91ciBwb3NpdGlvbiBpbiB0aGUgYXJlYScsXG4gICAgc2VuZDogJ1NlbmQnLFxuICAgIHNob3dCdG46IGZhbHNlLFxuICB9LFxuICAnc2VydmljZTpvcmllbnRhdGlvbic6IHtcbiAgICBpbnN0cnVjdGlvbnM6ICdQb2ludCB0aGUgcGhvbmUgZXhhY3RseSBpbiBmcm9udCBvZiB5b3UsIGFuZCB2YWxpZGF0ZS4nLFxuICAgIGVycm9yTWVzc2FnZTogYFNvcnJ5LCB5b3VyIHBsb25lIGNhbm5vdCBzdXBwb3J0IHRoaXMgYXBwbGljYXRpb25gLFxuICAgIHNlbmQ6ICdTZW5kJyxcbiAgICBlcnJvcjogZmFsc2UsXG4gIH0sXG4gICdzZXJ2aWNlOnBsYWNlcic6IHtcbiAgICBpbnN0cnVjdGlvbnM6ICdTZWxlY3QgeW91ciBwb3NpdGlvbicsXG4gICAgc2VuZDogJ1NlbmQnLFxuICAgIHJlamVjdDogJ1NvcnJ5LCBubyBwbGFjZSBpcyBhdmFpbGFibGUnLFxuICAgIHNob3dCdG46IGZhbHNlLFxuICAgIHJlamVjdGVkOiBmYWxzZSxcbiAgfSxcbiAgJ3NlcnZpY2U6c3luYyc6IHtcbiAgICB3YWl0OiBgQ2xvY2sgc3luY2luZyw8YnIgLz5zdGFuZCBieSZoZWxsaXA7YCxcbiAgfSxcbiAgJ3NlcnZpY2U6d2VsY29tZSc6IHtcbiAgICB3ZWxjb21lOiAnV2VsY29tZSB0bycsXG4gICAgdG91Y2hTY3JlZW46ICdUb3VjaCB0aGUgc2NyZWVuIHRvIGpvaW4hJyxcbiAgICBlcnJvcklvc1ZlcnNpb246ICdUaGlzIGFwcGxpY2F0aW9uIHJlcXVpcmVzIGF0IGxlYXN0IGlPUyA3IHdpdGggU2FmYXJpIG9yIENocm9tZS4nLFxuICAgIGVycm9yQW5kcm9pZFZlcnNpb246ICdUaGlzIGFwcGxpY2F0aW9uIHJlcXVpcmVzIGF0IGxlYXN0IEFuZHJvaWQgNC4yIHdpdGggQ2hyb21lLicsXG4gICAgZXJyb3JSZXF1aXJlTW9iaWxlOiAnVGhpcyBhcHBsaWNhdGlvbiBpcyBkZXNpZ25lZCBmb3IgaU9TIGFuZCBBbmRyb2lkIG1vYmlsZSBkZXZpY2VzLicsXG4gICAgZXJyb3JEZWZhdWx0OiAnU29ycnksIHRoZSBhcHBsaWNhdGlvbiBjYW5ub3Qgd29yayBwcm9wZXJseSBvbiB5b3VyIGRldmljZS4nLFxuICB9LFxuXG4gICdzdXJ2ZXknOiB7XG4gICAgbmV4dDogJ05leHQnLFxuICAgIHZhbGlkYXRlOiAnVmFsaWRhdGUnLFxuICAgIHRoYW5rczogJ1RoYW5rcyEnLFxuICB9LFxufTtcbiJdfQ==