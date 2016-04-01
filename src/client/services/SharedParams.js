import * as basicControllers from 'waves-basic-controllers';
import { EventEmitter } from 'events';
import Service from '../core/Service';
import serviceManager from '../core/serviceManager';


basicControllers.disableStyles();

/* --------------------------------------------------------- */
/* CONTROL UNITS
/* --------------------------------------------------------- */

/** @private */
class _Param extends EventEmitter {
  constructor(control, type, name, label) {
    super();
    this.control = control;
    this.type = type;
    this.name = name;
    this.label = label;
    this.value = undefined;
  }

  set(val) {
    this.value = value;
  }

  _propagate(sendToServer = true) {
    this.emit('update', this.value); // call event listeners

    if (sendToServer)
      this.control.send('update', this.name, this.value); // send to server

    this.control.emit('update', this.name, this.value); // call control listeners
  }

  update(val, sendToServer = true) {
    this.set(val);
    this._propagate(sendToServer);
  }
}


/** @private */
class _BooleanParam extends _Param {
  constructor(control, name, label, init) {
    super(control, 'boolean', name, label);
    this.set(init);
  }

  set(val) {
    this.value = val;
  }
}

/** @private */
class _EnumParam extends _Param {
  constructor(control, name, label, options, init) {
    super(control, 'enum', name, label);
    this.options = options;
    this.set(init);
  }

  set(val) {
    let index = this.options.indexOf(val);

    if (index >= 0) {
      this.index = index;
      this.value = val;
    }
  }
}

/** @private */
class _NumberParam extends _Param {
  constructor(control, name, label, min, max, step, init) {
    super(control, 'number', name, label);
    this.min = min;
    this.max = max;
    this.step = step;
    this.set(init);
  }

  set(val) {
    this.value = Math.min(this.max, Math.max(this.min, val));
  }
}

/** @private */
class _TextParam extends _Param {
  constructor(control, name, label, init) {
    super(control, 'text', name, label);
    this.set(init);
  }

  set(val) {
    this.value = val;
  }
}

/** @private */
class _TriggerParam extends _Param {
  constructor(control, name, label) {
    super(control, 'trigger', name, label);
  }

  set(val) { /* nothing to set here */ }
}

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
      this.controller.on('change', () => {
        if (guiOptions.confirm) {
          const msg = `Are you sure you want to propagate "${param.name}"`;
          if (!window.confirm(msg)) { return; }
        }

        param.update();
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


const SERVICE_ID = 'service:shared-params';

/**
 * Interface of the client `'shared-params'` service.
 *
 * This service is used to maintain and update global parameters used among
 * all connected clients. Each defined parameter can be of the following
 * data types:
 * - boolean
 * - enum
 * - number
 * - text
 * - trigger
 *
 * This type and specific attributes of an parameter is configured server side.
 * The service is espacially usefull if a special client is defined with the
 * `hasGUI` option set to true, allowing to create a special client aimed at
 * controlling the different parameters of the experience.
 *
 * __*The service must be used with its [server-side counterpart]{@link module:soundworks/server.SharedParams}*__
 *
 * @param {Object} options
 * @param {Boolean} [options.hasGui=true] - Defines whether the service should display
 *  a GUI. If set to `true`, the service never set its `ready` signal to true and
 *  the client application stay in this state forever. The option should then be
 *  used create special clients (sometimes called `conductor`) aimed at
 *  controlling application parameters in real time.
 *
 * @memberof module:soundworks/client
 * @example
 * // inside the experience constructor
 * this.control = this.require('shared-params');
 * // when the experience starts, listen for parameter updates
 * this.control.addParamListener('synth:gain', (value) => {
 *   this.synth.setGain(value);
 * });
 */
class SharedParams extends Service {
  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  constructor() {
    super(SERVICE_ID, true);

    const defaults = { hasGui: false };
    this.configure(defaults);

    /** @private */
    this._guiOptions = {};

    this._onInitResponse = this._onInitResponse.bind(this);
    this._onUpdateResponse = this._onUpdateResponse.bind(this);
  }

  /** @private */
  init() {
    /**
     * Dictionary of all the parameters and commands.
     * @type {Object}
     * @private
     */
    this.params = {};

    if (this.options.hasGui)
      this.view = this.createView();
  }

  /** @private */
  start() {
    super.start();

    if (!this.hasStarted)
      this.init();

    this.send('request');

    this.receive('init', this._onInitResponse);
    this.receive('update', this._onUpdateResponse);
  }

  /** @private */
  stop() {
    super.stop();
    // don't remove 'update' listener, as the control is runnig as a background process
    this.removeListener('init', this._onInitResponse);
  }

  /** @private */
  _onInitResponse(config) {
    this.show();

    config.forEach((entry) => {
      const param = this._createParam(entry);
      this.params[param.name] = param;

      if (this.view)
        this._createGui(this.view, param);
    });

    if (!this.options.hasGui)
      this.ready();
  }

  /** @private */
  _onUpdateResponse(name, val) {
    // update, but don't send back to server
    this.update(name, val, false);
  }

  /**
   * @callback module:soundworks/client.SharedParams~paramCallback
   * @param {Mixed} value - Updated value of the shared parameter.
   */
  /**
   * Add a listener to listen a specific parameter changes. The listener is called a first
   * time when added to retrieve the current value of the parameter.
   * @param {String} name - Name of the parameter.
   * @param {module:soundworks/client.SharedParams~paramCallback} listener - Callback
   *  that handle the event.
   */
  addParamListener(name, listener) {
    const param = this.params[name];

    if (param) {
      param.addListener('update', listener);

      if (param.type !== 'command')
        listener(param.value);
    } else {
      console.log('unknown param "' + name + '"');
    }
  }

  /**
   * Remove a listener from listening a specific parameter changes.
   * @param {String} name - Name of the parameter.
   * @param {module:soundworks/client.SharedParams~paramCallback} listener - The
   *  callback to remove.
   */
  removeParamListener(name, listener) {
    const param = this.params[name];

    if (param) {
      param.removeListener('update', listener);
    } else {
      console.log('unknown param "' + name + '"');
    }
  }

  /**
   * Get the value of a given parameter.
   * @param {String} name - The name of the parameter.
   * @returns {Mixed} - The current value of the parameter.
   */
  getValue(name) {
    return this.params[name].value;
  }

  /**
   * Update the value of a parameter (used when `options.hasGUI=true`)
   * @private
   * @param {String} name - Name of the parameter.
   * @param {Mixed} val - New value of the parameter.
   * @param {Boolean} [sendToServer=true] - Flag whether the value should be
   *  propagate to the server.
   */
  update(name, val, sendToServer = true) {
    const param = this.params[name];

    if (param) {
      param.update(val, sendToServer);
    } else {
      console.log('unknown shared parameter "' + name + '"');
    }
  }

  /** @private */
  _createParam(init) {
    let param = null;

    switch (init.type) {
      case 'boolean':
        param = new _BooleanParam(this, init.name, init.label, init.value);
        break;

      case 'enum':
        param = new _EnumParam(this, init.name, init.label, init.options, init.value);
        break;

      case 'number':
        param = new _NumberParam(this, init.name, init.label, init.min, init.max, init.step, init.value);
        break;

      case 'text':
        param = new _TextParam(this, init.name, init.label, init.value);
        break;

      case 'trigger':
        param = new _TriggerParam(this, init.name, init.label);
        break;
    }

    return param;
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
  _createGui(view, param) {
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

    return gui;
  }
}

serviceManager.register(SERVICE_ID, SharedParams);

export default SharedParams;
