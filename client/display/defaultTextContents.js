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
    thanks: 'Thanks!',
    length: '-'
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS9kZWZhdWx0VGV4dENvbnRlbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztxQkFJZTs7QUFFYixXQUFTLEVBQUUsRUFBRTtBQUNiLG1CQUFpQixFQUFFO0FBQ2pCLGVBQVcsRUFBRSxPQUFPO0FBQ3BCLGdCQUFZLEVBQUUsaUVBQWlFO0FBQy9FLFNBQUssRUFBRSxLQUFLO0FBQ1osZ0JBQVksRUFBRSw4QkFBOEI7QUFDNUMsUUFBSSxFQUFFLGdCQUFnQjtBQUN0QixTQUFLLEVBQUUsRUFBRTtHQUNWO0FBQ0QsbUJBQWlCLEVBQUU7QUFDakIsU0FBSyxFQUFFLFdBQVc7R0FDbkI7QUFDRCxrQkFBZ0IsRUFBRTtBQUNoQixXQUFPLEVBQUUsaUJBQWlCO0dBQzNCO0FBQ0QsbUJBQWlCLEVBQUU7QUFDakIsZ0JBQVksRUFBRSxrQ0FBa0M7QUFDaEQsUUFBSSxFQUFFLE1BQU07QUFDWixXQUFPLEVBQUUsS0FBSztHQUNmO0FBQ0QsdUJBQXFCLEVBQUU7QUFDckIsZ0JBQVksRUFBRSx3REFBd0Q7QUFDdEUsZ0JBQVkscURBQXFEO0FBQ2pFLFFBQUksRUFBRSxNQUFNO0FBQ1osU0FBSyxFQUFFLEtBQUs7R0FDYjtBQUNELGtCQUFnQixFQUFFO0FBQ2hCLGdCQUFZLEVBQUUsc0JBQXNCO0FBQ3BDLFFBQUksRUFBRSxNQUFNO0FBQ1osVUFBTSxFQUFFLDhCQUE4QjtBQUN0QyxXQUFPLEVBQUUsS0FBSztBQUNkLFlBQVEsRUFBRSxLQUFLO0dBQ2hCO0FBQ0QsZ0JBQWMsRUFBRTtBQUNkLFFBQUksd0NBQXdDO0dBQzdDO0FBQ0QsbUJBQWlCLEVBQUU7QUFDakIsV0FBTyxFQUFFLFlBQVk7QUFDckIsZUFBVyxFQUFFLDJCQUEyQjtBQUN4QyxtQkFBZSxFQUFFLGlFQUFpRTtBQUNsRix1QkFBbUIsRUFBRSw2REFBNkQ7QUFDbEYsc0JBQWtCLEVBQUUsa0VBQWtFO0FBQ3RGLGdCQUFZLEVBQUUsNkRBQTZEO0dBQzVFOztBQUVELFVBQVEsRUFBRTtBQUNSLFFBQUksRUFBRSxNQUFNO0FBQ1osWUFBUSxFQUFFLFVBQVU7QUFDcEIsVUFBTSxFQUFFLFNBQVM7QUFDakIsVUFBTSxFQUFFLEdBQUc7R0FDWjtDQUNGIiwiZmlsZSI6InNyYy9jbGllbnQvZGlzcGxheS9kZWZhdWx0VGV4dENvbnRlbnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGUgZGVmYXVsdCB0ZW1wbGF0ZXMgZm9yIHRoZSBzaGlwcGVkIG1vZHVsZXMuIFRoZSB0ZW1wbGF0ZXMgYXJlIG9yZ2FuaXplZCBhY2NvcmRpbmcgdG8gdGhlIGBNb2R1bGUubmFtZWAgcHJvcGVydHkuXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qIGBnbG9iYWxzYCBpcyBwb3B1bGF0ZWQgd2l0aCBzZXJ2ZXIgYGFwcE5hbWVgIGFuZCBzaGFyZWQgYmV0d2VlbiBhbGwgdGVtcGxhdGVzICovXG4gICdnbG9iYWxzJzoge30sXG4gICdzZXJ2aWNlOmNoZWNraW4nOiB7XG4gICAgbGFiZWxQcmVmaXg6ICdHbyB0bycsXG4gICAgbGFiZWxQb3N0Zml4OiAnVG91Y2ggdGhlIHNjcmVlbjxiciBjbGFzcz1cInBvcnRyYWl0LW9ubHlcIiAvPndoZW4geW91IGFyZSByZWFkeS4nLFxuICAgIGVycm9yOiBmYWxzZSxcbiAgICBlcnJvck1lc3NhZ2U6ICdTb3JyeSwgbm8gcGxhY2UgaXMgYXZhaWxhYmxlJyxcbiAgICB3YWl0OiAnUGxlYXNlIHdhaXQuLi4nLFxuICAgIGxhYmVsOiAnJyxcbiAgfSxcbiAgJ3NlcnZpY2U6Y29udHJvbCc6IHtcbiAgICB0aXRsZTogJ0NvbmR1Y3RvcicsXG4gIH0sXG4gICdzZXJ2aWNlOmxvYWRlcic6IHtcbiAgICBsb2FkaW5nOiAnTG9hZGluZyBzb3VuZHPigKYnLFxuICB9LFxuICAnc2VydmljZTpsb2NhdG9yJzoge1xuICAgIGluc3RydWN0aW9uczogJ0RlZmluZSB5b3VyIHBvc2l0aW9uIGluIHRoZSBhcmVhJyxcbiAgICBzZW5kOiAnU2VuZCcsXG4gICAgc2hvd0J0bjogZmFsc2UsXG4gIH0sXG4gICdzZXJ2aWNlOm9yaWVudGF0aW9uJzoge1xuICAgIGluc3RydWN0aW9uczogJ1BvaW50IHRoZSBwaG9uZSBleGFjdGx5IGluIGZyb250IG9mIHlvdSwgYW5kIHZhbGlkYXRlLicsXG4gICAgZXJyb3JNZXNzYWdlOiBgU29ycnksIHlvdXIgcGxvbmUgY2Fubm90IHN1cHBvcnQgdGhpcyBhcHBsaWNhdGlvbmAsXG4gICAgc2VuZDogJ1NlbmQnLFxuICAgIGVycm9yOiBmYWxzZSxcbiAgfSxcbiAgJ3NlcnZpY2U6cGxhY2VyJzoge1xuICAgIGluc3RydWN0aW9uczogJ1NlbGVjdCB5b3VyIHBvc2l0aW9uJyxcbiAgICBzZW5kOiAnU2VuZCcsXG4gICAgcmVqZWN0OiAnU29ycnksIG5vIHBsYWNlIGlzIGF2YWlsYWJsZScsXG4gICAgc2hvd0J0bjogZmFsc2UsXG4gICAgcmVqZWN0ZWQ6IGZhbHNlLFxuICB9LFxuICAnc2VydmljZTpzeW5jJzoge1xuICAgIHdhaXQ6IGBDbG9jayBzeW5jaW5nLDxiciAvPnN0YW5kIGJ5JmhlbGxpcDtgLFxuICB9LFxuICAnc2VydmljZTp3ZWxjb21lJzoge1xuICAgIHdlbGNvbWU6ICdXZWxjb21lIHRvJyxcbiAgICB0b3VjaFNjcmVlbjogJ1RvdWNoIHRoZSBzY3JlZW4gdG8gam9pbiEnLFxuICAgIGVycm9ySW9zVmVyc2lvbjogJ1RoaXMgYXBwbGljYXRpb24gcmVxdWlyZXMgYXQgbGVhc3QgaU9TIDcgd2l0aCBTYWZhcmkgb3IgQ2hyb21lLicsXG4gICAgZXJyb3JBbmRyb2lkVmVyc2lvbjogJ1RoaXMgYXBwbGljYXRpb24gcmVxdWlyZXMgYXQgbGVhc3QgQW5kcm9pZCA0LjIgd2l0aCBDaHJvbWUuJyxcbiAgICBlcnJvclJlcXVpcmVNb2JpbGU6ICdUaGlzIGFwcGxpY2F0aW9uIGlzIGRlc2lnbmVkIGZvciBpT1MgYW5kIEFuZHJvaWQgbW9iaWxlIGRldmljZXMuJyxcbiAgICBlcnJvckRlZmF1bHQ6ICdTb3JyeSwgdGhlIGFwcGxpY2F0aW9uIGNhbm5vdCB3b3JrIHByb3Blcmx5IG9uIHlvdXIgZGV2aWNlLicsXG4gIH0sXG5cbiAgJ3N1cnZleSc6IHtcbiAgICBuZXh0OiAnTmV4dCcsXG4gICAgdmFsaWRhdGU6ICdWYWxpZGF0ZScsXG4gICAgdGhhbmtzOiAnVGhhbmtzIScsXG4gICAgbGVuZ3RoOiAnLScsXG4gIH0sXG59O1xuIl19