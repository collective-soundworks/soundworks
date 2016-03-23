/**
 * The default view contents for the services. Each key correspond to the `id`
 * attribute of the activity it is associated to.
 *
 * Each content defines the variables that are used inside the corresponding
 * [`template`]{@link module soundworks/client.defaultViewTemplates}. A special
 * key `globals` is accessible among all templates and can then be used to share
 * variables among all the views of the application.
 *
 * These default content can be overriden by passing an object to the
 * [`client.setViewContentDefinitions`]{@link module:soundworks/client.client.setViewContentDefinitions}
 * method.
 *
 * @namespace
 * @memberof module:soundworks/client
 *
 * @see {@link module:soundworks/client.defaultViewTemplates}
 * @see {@link module:soundworks/client.client}
 */
const defaultViewContent = {
  /**
   * Special entry used to share variables among all the templates of the
   * application (for example the application name).
   * @type {Object}
   */
  'globals': {},

  /**
   * Default content for the `checkin` service
   * @type {Object}
   */
  'service:checkin': {
    labelPrefix: 'Go to',
    labelPostfix: 'Touch the screen<br class="portrait-only" />when you are ready.',
    error: false,
    errorMessage: 'Sorry, no place is available',
    wait: 'Please wait...',
    label: '',
  },

  /**
   * Default content for the `loader` service
   * @type {Object}
   */
  'service:loader': {
    loading: 'Loading sounds…',
  },

  /**
   * Default content for the `locator` service
   * @type {Object}
   */
  'service:locator': {
    instructions: 'Define your position in the area',
    send: 'Send',
    showBtn: false,
  },

  /**
   * Default content for the `placer` service
   * @type {Object}
   */
  'service:placer': {
    instructions: 'Select your position',
    send: 'Send',
    reject: 'Sorry, no place is available',
    showBtn: false,
    rejected: false,
  },

  /**
   * Default content for the `platform` service
   * @type {Object}
   */
  'service:platform': {
    errorMessage: 'Sorry,<br />Your device is not compatible with the application.',
  },

  /**
   * Default content for the `sync` service
   * @type {Object}
   */
  'service:sync': {
    wait: `Clock syncing,<br />stand by&hellip;`,
  },

  /**
   * Default content for the `welcome` service
   * @type {Object}
   */
  'service:welcome': {
    welcome: 'Welcome to',
    touchScreen: 'Touch the screen to join!',
    errorIosVersion: 'This application requires at least iOS 7 with Safari or Chrome.',
    errorAndroidVersion: 'This application requires at least Android 4.2 with Chrome.',
    errorRequireMobile: 'This application is designed for iOS and Android mobile devices.',
    errorDefault: 'Sorry, the application cannot work properly on your device.',
  },

  /** @private */
  'survey': {
    next: 'Next',
    validate: 'Validate',
    thanks: 'Thanks!',
    length: '-',
  },
};

export default defaultViewContent;
