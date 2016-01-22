/**
 * The default templates for the shipped modules. The templates are organized according to the `Module.name` property.
 * @type {Object}
 */
export default {
  /* `globals` is populated with server `appName` and shared between all templates */
  globals: {},
  checkin: {
    labelPrefix: 'Go to',
    labelPostfix: 'Touch the screen<br class="portrait-only" />when you are ready.',
    error: false,
    errorMessage: 'Sorry, we cannot accept any more connections at the moment, please try again later.',
    wait: 'Please wait...',
  },
  control: {
    title: 'Conductor',
  },
  loader: {
    loading: 'Loading sounds…',
  },
  locator: {
    instructions: 'Define your position in the area',
    send: 'Send',
    showBtn: false,
  },
  orientation: {
    instructions: 'Point the phone exactly in front of you, and validate.',
    errorMessage: `Sorry, your plone cannot support this application`,
    send: 'Send',
    error: false,
  },
  placer: {
    instructions: 'Select your position',
    send: 'Send',
    showBtn: false,
  },
  survey: {
    next: 'Next',
    validate: 'Validate',
    thanks: 'Thanks!',
  },
  sync: {
    wait: `Clock syncing,<br />stand by&hellip;`,
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
