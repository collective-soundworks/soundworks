import input from './input';
import Module from './Module';


/**
 * [client] Calibrate the compass by setting an angle reference.
 *
 * The module always displays a view with an instruction text: the user is asked to tap the screen when the phone points at the desired direction for the calibration.
 * When the user taps the screen, the current compass value is set as the angle reference.
 *
 * The module finishes its initialization when the participant taps the screen (and the referance angle is saved).
 */
export default class Orientation extends Module {
  /**
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='dialog'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   * @param {String} [options.text='Point the phone exactly in front of you, and touch the screen.'] Text to be displayed in the `view`.
   * @todo Solve the space in default parameter problem.
   */
  constructor(options = {}) {
    super(options.name || 'orientation', true, options.color);

    /**
     * Value of the `alpha` angle (as in the [`deviceOrientation` HTML5 API](http://www.w3.org/TR/orientation-event/)) when the user touches the screen.
     * It serves as a calibration / reference of the compass.
     * @type {Number}
     */
    this.angleReference = 0;

    this._angle = 0;
    this._text = options.text || "Point the phone exactly in front of you, and touch the screen.";

    //TODO: use new input module
    input.enableDeviceOrientation();
    input.on('deviceorientation', (orientationData) => {
      this._angle = orientationData.alpha;
    });
  }

  /**
   * @private
   */
  start() {
    super.start();
    this.setCenteredViewContent('<p>' + this._text + '</p>');

    this.view.addEventListener('click', () => {
      this.angleReference = this._angle;
      this.done();
    });
  }
}
