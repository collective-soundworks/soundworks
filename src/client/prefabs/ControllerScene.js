import * as controllers from 'basic-controllers';
import View from '../views/View';

controllers.setTheme('dark');

/* --------------------------------------------------------- */
/* GUIs
/* --------------------------------------------------------- */

/** @private */
class _BooleanGui {
  constructor($container, param, guiOptions) {
    const { label, value } = param;

    this.controller = new controllers.Toggle({
      label: label,
      default: value,
      container: $container,
      callback: (value) => {
        if (guiOptions.confirm) {
          const msg = `Are you sure you want to propagate "${param.name}:${value}"`;
          if (!window.confirm(msg)) { return; }
        }

        param.update(value);
      }
    });
  }

  set(val) {
    this.controller.value = val;
  }
}

/** @private */
class _EnumGui {
  constructor($container, param, guiOptions) {
    const { label, options, value } = param;

    const ctor = guiOptions.type === 'buttons' ?
      controllers.SelectButtons : controllers.SelectList

    this.controller = new ctor({
      label: label,
      options: options,
      default: value,
      container: $container,
      callback: (value) => {
        if (guiOptions.confirm) {
          const msg = `Are you sure you want to propagate "${param.name}:${value}"`;
          if (!window.confirm(msg)) { return; }
        }

        param.update(value);
      }
    });
  }

  set(val) {
    this.controller.value = val;
  }
}

/** @private */
class _NumberGui {
  constructor($container, param, guiOptions) {
    const { label, min, max, step, value } = param;

    if (guiOptions.type === 'slider') {
      this.controller = new controllers.Slider({
        label: label,
        min: min,
        max: max,
        step: step,
        default: value,
        unit: guiOptions.param ? guiOptions.param : '',
        size: guiOptions.size,
        container: $container,
      });
    } else {
      this.controller = new controllers.NumberBox({
        label: label,
        min: min,
        max: max,
        step: step,
        default: value,
        container: $container,
      });
    }

    this.controller.addListener((value) => {
      if (guiOptions.confirm) {
        const msg = `Are you sure you want to propagate "${param.name}:${value}"`;
        if (!window.confirm(msg)) { return; }
      }

      param.update(value);
    });
  }

  set(val) {
    this.controller.value = val;
  }
}

/** @private */
class _TextGui {
  constructor($container, param, guiOptions) {
    const { label, value } = param;

    this.controller = new controllers.Text({
      label: label,
      default: value,
      readonly: guiOptions.readonly,
      container: $container,
    });

    if (!guiOptions.readonly) {
      this.controller.addListener((value) => {
        if (guiOptions.confirm) {
          const msg = `Are you sure you want to propagate "${param.name}"`;
          if (!window.confirm(msg)) { return; }
        }

        param.update(value);
      });
    }
  }

  set(val) {
    this.controller.value = val;
  }
}

/** @private */
class _TriggerGui {
  constructor($container, param, guiOptions) {
    const { label } = param;

    this.controller = new controllers.TriggerButtons({
      options: [label],
      container: $container,
      callback: () => {
        if (guiOptions.confirm) {
          const msg = `Are you sure you want to propagate "${param.name}"`;
          if (!window.confirm(msg)) { return; }
        }

        param.update();
      }
    });
  }

  set(val) { /* nothing to set here */ }
}

const SCENE_ID = 'basic-shared-controller';

/**
 * The `ControllerScene` scene propose a simple / default way to create
 * a controller view for the `shared-params` service.
 *
 * Each controller comes with a set of options that can be passed to the
 * constructor.
 *
 * @memberof module:soundworks/client
 * @see [`shared-params` service]{@link module:soundworks/client.SharedParams}
 */
class ControllerScene {
  /**
   * _<span class="warning">__WARNING__</span> This API is unstable, and
   * subject to change in further versions.
   */
  constructor(experience, sharedParams) {
    if (!sharedParams)
      throw new Error('This service requires the "shared params" service');

    this._guiOptions = {};

    this.experience = experience;
    this.sharedParams = sharedParams;
  }

  enter() {
    this.view = new View();
    this.view.options.id = 'basic-shared-controller';

    this.view.render();
    this.view.appendTo(this.experience.container);

    for (let name in this.sharedParams.params) {
      const param = this.sharedParams.params[name];
      const gui = this._createGui(param);

      param.addListener('update', (val) => gui.set(val));
    }
  }

  exit() {
    for (let name in this.sharedParams.params) {
      const param = this.sharedParams.params[name];
      param.removeListener('update');
    }

    this.view.remove();
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
    this._guiOptions[name] = options;
  }

  /** @private */
  _createGui(param) {
    const config = Object.assign({
      show: true,
      confirm: false,
    }, this._guiOptions[param.name]);

    if (config.show === false) return null;

    let gui = null;
    const $container = this.view.$el;

    switch (param.type) {
      case 'boolean':
        gui = new _BooleanGui($container, param, config); // `Toggle`
        break;
      case 'enum':
        gui = new _EnumGui($container, param, config); // `SelectList` or `SelectButtons`
        break;
      case 'number':
        gui = new _NumberGui($container, param, config); // `NumberBox` or `Slider`
        break;
      case 'text':
        gui = new _TextGui($container, param, config); // `Text`
        break;
      case 'trigger':
        gui = new _TriggerGui($container, param, config);
        break;
    }

    return gui;
  }
}

export default ControllerScene;
