'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * The default view templates for the provided services and scenes.
 * The view templates are organized according to the `Module.name` property.
 * @type {Object}
 */
var defaultViewContent = {
  /**
   * `globals` is populated with server `appName` and
   * shared between all view templates
   */
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
  'service:placer': {
    instructions: 'Select your position',
    send: 'Send',
    reject: 'Sorry, no place is available',
    showBtn: false,
    rejected: false
  },
  'service:platform': {
    errorMessage: 'Sorry,<br />Your device is not compatible with the application.'
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

exports.default = defaultViewContent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlZmF1bHRDb250ZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFLQSxJQUFNLHFCQUFxQjs7Ozs7QUFLekIsYUFBVyxFQUFYO0FBQ0EscUJBQW1CO0FBQ2pCLGlCQUFhLE9BQWI7QUFDQSxrQkFBYyxpRUFBZDtBQUNBLFdBQU8sS0FBUDtBQUNBLGtCQUFjLDhCQUFkO0FBQ0EsVUFBTSxnQkFBTjtBQUNBLFdBQU8sRUFBUDtHQU5GO0FBUUEscUJBQW1CO0FBQ2pCLFdBQU8sV0FBUDtHQURGO0FBR0Esb0JBQWtCO0FBQ2hCLGFBQVMsaUJBQVQ7R0FERjtBQUdBLHFCQUFtQjtBQUNqQixrQkFBYyxrQ0FBZDtBQUNBLFVBQU0sTUFBTjtBQUNBLGFBQVMsS0FBVDtHQUhGO0FBS0Esb0JBQWtCO0FBQ2hCLGtCQUFjLHNCQUFkO0FBQ0EsVUFBTSxNQUFOO0FBQ0EsWUFBUSw4QkFBUjtBQUNBLGFBQVMsS0FBVDtBQUNBLGNBQVUsS0FBVjtHQUxGO0FBT0Esc0JBQW9CO0FBQ2xCLGtCQUFjLGlFQUFkO0dBREY7QUFHQSxrQkFBZ0I7QUFDZCxnREFEYztHQUFoQjtBQUdBLHFCQUFtQjtBQUNqQixhQUFTLFlBQVQ7QUFDQSxpQkFBYSwyQkFBYjtBQUNBLHFCQUFpQixpRUFBakI7QUFDQSx5QkFBcUIsNkRBQXJCO0FBQ0Esd0JBQW9CLGtFQUFwQjtBQUNBLGtCQUFjLDZEQUFkO0dBTkY7O0FBU0EsWUFBVTtBQUNSLFVBQU0sTUFBTjtBQUNBLGNBQVUsVUFBVjtBQUNBLFlBQVEsU0FBUjtBQUNBLFlBQVEsR0FBUjtHQUpGO0NBL0NJOztrQkF1RFMiLCJmaWxlIjoiZGVmYXVsdENvbnRlbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRoZSBkZWZhdWx0IHZpZXcgdGVtcGxhdGVzIGZvciB0aGUgcHJvdmlkZWQgc2VydmljZXMgYW5kIHNjZW5lcy5cbiAqIFRoZSB2aWV3IHRlbXBsYXRlcyBhcmUgb3JnYW5pemVkIGFjY29yZGluZyB0byB0aGUgYE1vZHVsZS5uYW1lYCBwcm9wZXJ0eS5cbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbmNvbnN0IGRlZmF1bHRWaWV3Q29udGVudCA9IHtcbiAgLyoqXG4gICAqIGBnbG9iYWxzYCBpcyBwb3B1bGF0ZWQgd2l0aCBzZXJ2ZXIgYGFwcE5hbWVgIGFuZFxuICAgKiBzaGFyZWQgYmV0d2VlbiBhbGwgdmlldyB0ZW1wbGF0ZXNcbiAgICovXG4gICdnbG9iYWxzJzoge30sXG4gICdzZXJ2aWNlOmNoZWNraW4nOiB7XG4gICAgbGFiZWxQcmVmaXg6ICdHbyB0bycsXG4gICAgbGFiZWxQb3N0Zml4OiAnVG91Y2ggdGhlIHNjcmVlbjxiciBjbGFzcz1cInBvcnRyYWl0LW9ubHlcIiAvPndoZW4geW91IGFyZSByZWFkeS4nLFxuICAgIGVycm9yOiBmYWxzZSxcbiAgICBlcnJvck1lc3NhZ2U6ICdTb3JyeSwgbm8gcGxhY2UgaXMgYXZhaWxhYmxlJyxcbiAgICB3YWl0OiAnUGxlYXNlIHdhaXQuLi4nLFxuICAgIGxhYmVsOiAnJyxcbiAgfSxcbiAgJ3NlcnZpY2U6Y29udHJvbCc6IHtcbiAgICB0aXRsZTogJ0NvbmR1Y3RvcicsXG4gIH0sXG4gICdzZXJ2aWNlOmxvYWRlcic6IHtcbiAgICBsb2FkaW5nOiAnTG9hZGluZyBzb3VuZHPigKYnLFxuICB9LFxuICAnc2VydmljZTpsb2NhdG9yJzoge1xuICAgIGluc3RydWN0aW9uczogJ0RlZmluZSB5b3VyIHBvc2l0aW9uIGluIHRoZSBhcmVhJyxcbiAgICBzZW5kOiAnU2VuZCcsXG4gICAgc2hvd0J0bjogZmFsc2UsXG4gIH0sXG4gICdzZXJ2aWNlOnBsYWNlcic6IHtcbiAgICBpbnN0cnVjdGlvbnM6ICdTZWxlY3QgeW91ciBwb3NpdGlvbicsXG4gICAgc2VuZDogJ1NlbmQnLFxuICAgIHJlamVjdDogJ1NvcnJ5LCBubyBwbGFjZSBpcyBhdmFpbGFibGUnLFxuICAgIHNob3dCdG46IGZhbHNlLFxuICAgIHJlamVjdGVkOiBmYWxzZSxcbiAgfSxcbiAgJ3NlcnZpY2U6cGxhdGZvcm0nOiB7XG4gICAgZXJyb3JNZXNzYWdlOiAnU29ycnksPGJyIC8+WW91ciBkZXZpY2UgaXMgbm90IGNvbXBhdGlibGUgd2l0aCB0aGUgYXBwbGljYXRpb24uJyxcbiAgfSxcbiAgJ3NlcnZpY2U6c3luYyc6IHtcbiAgICB3YWl0OiBgQ2xvY2sgc3luY2luZyw8YnIgLz5zdGFuZCBieSZoZWxsaXA7YCxcbiAgfSxcbiAgJ3NlcnZpY2U6d2VsY29tZSc6IHtcbiAgICB3ZWxjb21lOiAnV2VsY29tZSB0bycsXG4gICAgdG91Y2hTY3JlZW46ICdUb3VjaCB0aGUgc2NyZWVuIHRvIGpvaW4hJyxcbiAgICBlcnJvcklvc1ZlcnNpb246ICdUaGlzIGFwcGxpY2F0aW9uIHJlcXVpcmVzIGF0IGxlYXN0IGlPUyA3IHdpdGggU2FmYXJpIG9yIENocm9tZS4nLFxuICAgIGVycm9yQW5kcm9pZFZlcnNpb246ICdUaGlzIGFwcGxpY2F0aW9uIHJlcXVpcmVzIGF0IGxlYXN0IEFuZHJvaWQgNC4yIHdpdGggQ2hyb21lLicsXG4gICAgZXJyb3JSZXF1aXJlTW9iaWxlOiAnVGhpcyBhcHBsaWNhdGlvbiBpcyBkZXNpZ25lZCBmb3IgaU9TIGFuZCBBbmRyb2lkIG1vYmlsZSBkZXZpY2VzLicsXG4gICAgZXJyb3JEZWZhdWx0OiAnU29ycnksIHRoZSBhcHBsaWNhdGlvbiBjYW5ub3Qgd29yayBwcm9wZXJseSBvbiB5b3VyIGRldmljZS4nLFxuICB9LFxuXG4gICdzdXJ2ZXknOiB7XG4gICAgbmV4dDogJ05leHQnLFxuICAgIHZhbGlkYXRlOiAnVmFsaWRhdGUnLFxuICAgIHRoYW5rczogJ1RoYW5rcyEnLFxuICAgIGxlbmd0aDogJy0nLFxuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmYXVsdFZpZXdDb250ZW50O1xuIl19