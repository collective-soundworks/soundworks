import input from './input';
import Module from './Module';


/**
 * The {@link ClientOrientation} module allows for calibrating the compass by getting an angle reference.
 * It displays a view with an instruction text: the user is asked to tap the screen when the phone points at the desired direction for the calibration.
 * When that happens, the current compass value is set as the angle reference.
 * The {@link ClientOrientation} module calls its `done` method when the participant taps the screen.
 */
export default class Orientation extends Module {
  /**
   * Creates an instance of the class. Always has a view.
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='dialog'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   * @param {String} [options.text='Point the phone exactly in front of you, and touch the screen.'] Text to be displayed in the `view`.
   * @todo Solve the space in default parameter problem.
   */
  constructor(options = {}) {
    super(options.name || 'orientation', true, options.color);

    /**
     * Value of the `alpha` angle (as in the [`deviceOrientation` HTML5 API](http://www.w3.org/TR/orientation-event/)) when the user touches the screen while the `ClientOrientation` module is displayed.
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

  start() {
    super.start();
    this.setCenteredViewContent('<p>' + this._text + '</p>');

    this.view.addEventListener('click', () => {
      this.angleReference = this._angle;
      this.done();
    });
  }
}
