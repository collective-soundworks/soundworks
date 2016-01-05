import input from './input';
import ClientModule from './ClientModule';
import SegmentedView from './display/SegmentedView';


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
   * @param {String} [options.name='dialog'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   * @param {String} [options.text='Point the phone exactly in front of you, and touch the screen.'] Text to be displayed in the `view`.
   * @todo Solve the space in default parameter problem.
   */
  constructor(options = {}) {
    super(options.name || 'orientation', options);

    // @todo - use new input module
    input.enableDeviceOrientation();
    // bind methods
    this._onOrientationChange = this._onOrientationChange.bind(this);
    this._onClick = this._onClick.bind(this);
    // configure view
    this.viewCtor = options.viewCtor || SegmentedView;
    this.events = { 'click': this._onClick };

    this.init();
  }

  init() {
    /**
     * Value of the `alpha` angle (as in the [`deviceOrientation` HTML5 API](http://www.w3.org/TR/orientation-event/)) when the user touches the screen.
     * It serves as a calibration / reference of the compass.
     * @type {Number}
     */
    this.angleReference = 0; // @todo - where is this value saved ?
    this._angle = 0; // @todo - is this really needed ?

    this.view = this.createView();
    console.log(this.view);
  }

  /**
   * @private
   */
  start() {
    super.start();
    input.on('deviceorientation', this._onOrientationChange);
  }

  _onOrientationChange(orientationData) {
    this._angle = orientationData.alpha;
  }

  _onClick() {
    this.angleReference = this._angle;
    // stop listening for device orientation when done
    input.removeListener('deviceorientation', this._onOrientationChange);
    this.done();
  }
}
