import EventEmitter from '../../utils/EventEmitter';
import Service from '../core/Service';
import serviceManager from '../core/serviceManager';


/* --------------------------------------------------------- */
/* CONTROL UNITS
/* --------------------------------------------------------- */

/** @private */
class _Param extends EventEmitter {
  constructor(parent, type, name, label) {
    super();
    this.parent = parent;
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
      this.parent.send('update', this.name, this.value); // send to server

    this.parent.emit('update', this.name, this.value); // call parent listeners
  }

  update(val, sendToServer = true) {
    this.set(val);
    this._propagate(sendToServer);
  }
}


/** @private */
class _BooleanParam extends _Param {
  constructor(parent, name, label, init) {
    super(parent, 'boolean', name, label);
    this.set(init);
  }

  set(val) {
    this.value = val;
  }
}

/** @private */
class _EnumParam extends _Param {
  constructor(parent, name, label, options, init) {
    super(parent, 'enum', name, label);
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
  constructor(parent, name, label, min, max, step, init) {
    super(parent, 'number', name, label);
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
  constructor(parent, name, label, init) {
    super(parent, 'text', name, label);
    this.set(init);
  }

  set(val) {
    this.value = val;
  }
}

/** @private */
class _TriggerParam extends _Param {
  constructor(parent, name, label) {
    super(parent, 'trigger', name, label);
  }

  set(val) { /* nothing to set here */ }
}

const SERVICE_ID = 'service:shared-params';

/**
 * Interface for the client `'shared-params'` service.
 *
 * The `shared-params` service is used to maintain and update global parameters
 * used among all connected clients. Each defined parameter can be of the
 * following data types:
 * - boolean
 * - enum
 * - number
 * - text
 * - trigger
 *
 * The parameters are configured in the server side counterpart of the service.
 *
 * To create a control surface from the parameters definitions, a dedicated scene
 * [`BasicSharedController`]{@link module:soundworks/client.BasicSharedController}
 * is available.
 *
 * __*The service must be used along with its
 * [server-side counterpart]{@link module:soundworks/server.SharedParams}*__
 *
 * _<span class="warning">__WARNING__</span> This class should never be
 * instanciated manually_
 *
 * @memberof module:soundworks/client
 *
 * @example
 * // inside the experience constructor
 * this.sharedParams = this.require('shared-params');
 * // when the experience starts, listen for parameter updates
 * this.sharedParams.addParamListener('synth:gain', (value) => {
 *   this.synth.setGain(value);
 * });
 *
 * @see [`BasicSharedController` scene]{@link module:soundworks/client.BasicSharedController}
 */
class SharedParams extends Service {
  constructor() {
    super(SERVICE_ID, true);

    const defaults = {};
    this.configure(defaults);

    /**
     * Dictionary of all the parameters and commands.
     * @type {Object}
     * @name params
     * @instance
     * @memberof module:soundworks/client.SharedParams
     *
     * @private
     */
    this.params = {};

    this._onInitResponse = this._onInitResponse.bind(this);
    this._onUpdateResponse = this._onUpdateResponse.bind(this);
  }

  /** @private */
  start() {
    super.start();

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
    config.forEach((entry) => {
      const param = this._createParam(entry);
      this.params[param.name] = param;
    });

    this.ready();
  }

  /** @private */
  _onUpdateResponse(name, val) {
    // update, but don't send back to server
    this.update(name, val, false);
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
   * @callback module:soundworks/client.SharedParams~paramCallback
   * @param {Mixed} value - Updated value of the shared parameter.
   */

  /**
   * Add a listener to listen a specific parameter changes. The listener is
   * executed immediately when added with the parameter current value.
   *
   * @param {String} name - Name of the parameter.
   * @param {module:soundworks/client.SharedParams~paramCallback} listener -
   *  Listener to add.
   */
  addParamListener(name, listener) {
    const param = this.params[name];

    if (param) {
      param.addListener('update', listener);

      if (param.type !== 'trigger')
        listener(param.value);
    } else {
      console.log('unknown param "' + name + '"');
    }
  }

  /**
   * Remove a listener from listening a specific parameter changes.
   *
   * @param {String} name - Name of the parameter.
   * @param {module:soundworks/client.SharedParams~paramCallback} listener -
   *  Listener to remove.
   */
  removeParamListener(name, listener) {
    const param = this.params[name];

    if (param)
      param.removeListener('update', listener);
    else
      console.log('unknown param "' + name + '"');
  }

  /**
   * Get the value of a given parameter.
   *
   * @param {String} name - Name of the parameter.
   * @returns {Mixed} - Current value of the parameter.
   */
  getValue(name) {
    return this.params[name].value;
  }

  /**
   * Update the value of a parameter (used when `options.hasGUI=true`)
   *
   * @param {String} name - Name of the parameter.
   * @param {Mixed} val - New value of the parameter.
   * @param {Boolean} [sendToServer=true] - Flag whether the value should be
   *  propagated to the server.
   */
  update(name, val, sendToServer = true) {
    const param = this.params[name];

    if (param)
      param.update(val, sendToServer);
    else
      console.log('unknown shared parameter "' + name + '"');
  }
}

serviceManager.register(SERVICE_ID, SharedParams);

export default SharedParams;
