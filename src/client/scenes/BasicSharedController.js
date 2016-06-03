import * as basicControllers from 'waves-basic-controllers';
import client from '../core/client';
import Scene from '../core/Scene';

basicControllers.disableStyles();

/* --------------------------------------------------------- */
/* GUIs
/* --------------------------------------------------------- */

/** @private */
class _BooleanGui {
  constructor($container, param, guiOptions) {
    const { label, value } = param;

    this.controller = new basicControllers.Toggle(label, value);
    $container.appendChild(this.controller.render());
    this.controller.onRender();

    this.controller.on('change', (value) => {
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
class _EnumGui {
  constructor($container, param, guiOptions) {
    const { label, options, value } = param;

    const ctor = guiOptions.type === 'buttons' ?
      basicControllers.SelectButtons : basicControllers.SelectList

    this.controller = new ctor(label, options, value);
    $container.appendChild(this.controller.render());
    this.controller.onRender();

    this.controller.on('change', (value) => {
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
class _NumberGui {
  constructor($container, param, guiOptions) {
    const { label, min, max, step, value } = param;

    if (guiOptions.type === 'slider')
      this.controller = new basicControllers.Slider(label, min, max, step, value, guiOptions.param, guiOptions.size);
    else
      this.controller = new basicControllers.NumberBox(label, min, max, step, value);

    $container.appendChild(this.controller.render());
    this.controller.onRender();

    this.controller.on('change', (value) => {
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

    this.controller = new basicControllers.Text(label, value, guiOptions.readOnly);
    $container.appendChild(this.controller.render());
    this.controller.onRender();

    if (!guiOptions.readOnly) {
      this.controller.on('change', (value) => {
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

    this.controller = new basicControllers.Buttons('', [label]);
    $container.appendChild(this.controller.render());
    this.controller.onRender();

    this.controller.on('change', () => {
      if (guiOptions.confirm) {
        const msg = `Are you sure you want to propagate "${param.name}"`;
        if (!window.confirm(msg)) { return; }
      }

      param.update();
    });
  }

  set(val) { /* nothing to set here */ }
}

const SCENE_ID = 'basic-shared-controller';

/**
 * Scene definition
 */
export default class BasicSharedController extends Scene {
  /**
   * _<span class="warning">__WARNING__</span> This API is unstable, and
   * subject to change in further versions.
   */
  constructor(guiOptions = {}) {
    super(SCENE_ID, true);

    this._guiOptions = guiOptions;

    this._errorReporter = this.require('error-reporter');
    this._sharedParams = this.require('shared-params');
  }

  init() {
    this.view = this.createView();
  }

  start() {
    super.start();

    if (!this.hasStarted)
      this.init();

    this.show();

    for (let name in this._sharedParams.params)
      this.createGui(this._sharedParams.params[name]);
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
  createGui(param) {
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

    param.addListener('update', (val) => gui.set(val));
  }
}
