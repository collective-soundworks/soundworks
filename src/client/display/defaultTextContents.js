/**
 * The default templates for the shipped modules. The templates are organized according to the `Module.name` property.
 * @type {Object}
 */
export default {
  _globals: {
    appName: 'Soundworks',
  },
  checkin: {
    wait: '...',
    labelPrefix: 'Go to',
    labelPostfix: 'Touch the screen<br class="portrait-only" />when you are ready.',
    error: 'Sorry, we cannot accept any more connections at the moment, please try again later.',
  },
  loader: {
    loading: 'Loading sounds…',
  },
  orientation: {
    instructions: 'Point the phone exactly in front of you, and touch the screen.',
  },
  welcome: {
    welcome: 'Welcome to',
    touchScreen: 'Touch the screen to join!',
    errorIosVersion: 'This application requires at least iOS 7 with Safari or Chrome.',
    errorAndroidVersion: 'This application requires at least Android 4.2 with Chrome.',
    errorRequireMobile: 'This application is designed for iOS and Android mobile devices.',
    errorDefault: 'Sorry, the application cannot work properly on your device.',
  },
};