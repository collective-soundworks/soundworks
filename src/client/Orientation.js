// import input from './input';
import motionInput from 'motion-input';
import ClientModule from './ClientModule';
import SegmentedView from './display/SegmentedView';

// https://sites.google.com/a/chromium.org/dev/Home/chromium-security/deprecating-powerful-features-on-insecure-origins

/**
 * [client] Calibrate the compass by setting an angle reference.
 *
 * The module always displays a view with an instruction text: the user is asked to tap the screen when the phone points at the desired direction for the calibration.
 * When the user taps the screen, the current compass value is set as the angle reference.
 *
 * The module finishes its initialization when the participant taps the screen (and the referance angle is saved).
 */
export default class Orientation extends ClientModule {
  /**
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='orientation'] Name of the module.
   * @todo Solve the space in default parameter problem. (??)
   */
  constructor(options = {}) {
    super(options.name || 'orientation', options);

    this.bypass = options.bypass || false;
    // @todo - use new input module
    // input.enableDeviceOrientation();
    // bind methods
    this._onOrientationChange = this._onOrientationChange.bind(this);
    this._onClick = this._onClick.bind(this);
    // configure view
    this.viewCtor = options.viewCtor || SegmentedView;
    this.events = { 'click': this._onClick };

    this.init();
  }

  init() {
    if (this.bypass) {
      this.angleReference = 0;
      this.done();
    }

    /**
     * Value of the `alpha` angle (as in the [`deviceOrientation` HTML5 API](http://www.w3.org/TR/orientation-event/)) when the user touches the screen.
     * It serves as a calibration / reference of the compass.
     * @type {Number}
     */
    this.angleReference = 0; // @todo - where is this value saved ?
    this._angle = 0; // @todo - is this really needed ?

    motionInput
      .init('orientation')
      .then((modules) => {
        const [orientation] = modules;

        if (!orientation.isValid) {
          this.content.error = true;
        }

        this.view = this.createView();
      });
  }

  /**
   * @private
   */
  start() {
    super.start();
    // input.on('deviceorientation', this._onOrientationChange);
    if (!this.content.error) {
      motionInput.addListener('orientation', this._onOrientationChange);
    }
  }

  _onOrientationChange(orientationData) {
    this._angle = orientationData.alpha;
  }

  _onClick() {
    this.angleReference = this._angle;
    console.log(this.angleReference);
    // stop listening for device orientation when done
    motionInput.removeListener('orientation', this._onOrientationChange);
    this.done();
  }
}
