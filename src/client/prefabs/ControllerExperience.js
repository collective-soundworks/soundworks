import Experience from '../core/Experience';
import View from '../views/View';
import ControllerScene from './ControllerScene';


/**
 * Predefined experience to create a shared controller in 1 line
 *
 *
 */
class ControllerExperience extends Experience {
  constructor(options = {}) {
    super();

    this.sharedParams = this.require('shared-params');
    this.controllerScene = new ControllerScene(this, this.sharedParams);

    if (options.auth)
      this.auth = this.require('auth');
  }

  start() {
    super.start();

    this.view = new View();
    this.show();

    this.controllerScene.enter();
  }

  /**
   * Configure the GUI for a given parameter, this method only makes sens if
   * `options.hasGUI=true`.
   * @param {String} name - Name of the parameter to configure.
   * @param {Object} options - Options to configure the parameter GUI.
   * @param {String} options.type - Type of GUI to use. Each type of parameter can
   *  used with different GUI according to their type and comes with acceptable
   *  default values.
   * @param {Boolean} [options.show=true] - Display or not the GUI for this parameter.
   * @param {Boolean} [options.confirm=false] - Ask for confirmation when the value changes.
   */
  setGuiOptions(name, options) {
    this.controllerScene.setGuiOptions(name, options);
  }

  get container() {
    return this.view.$el;
  }
}

export default ControllerExperience;
