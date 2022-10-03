import debug from 'debug';
import AbstractPlugin from './AbstractPlugin.js';
import AbstractExperience from './AbstractExperience.js';
import Signal from '../common/Signal.js';
import SignalAll from '../common/SignalAll.js';
import logger from './utils/logger.js';

const log = debug('soundworks:lifecycle');

/**
 * Manager the plugins and their relations. Acts as a factory to ensure plugins
 * are instanciated only once.
 *
 * @memberof server
 */
class PluginManager {
  constructor(server) {
    /** @private */
    this._server = server;
    /** @private */
    this._registeredPlugins = new Map();
    /** @private */
    this._instances = new Map();
    /** @private */
    this._observers = new Set();
    /** @private */
    this._pluginsStatuses = {};

    // @todo - move to Promise based logic
    this.signals = {
      start: new Signal(),
      ready: new SignalAll(),
    };

    this.ready = new Promise(resolve => {
      this._resolveReadyPromise = resolve;
    });
  }

  /** @private */
  start() {
    log('> pluginManager start');
    logger.title('initializing plugins');

    this.signals.ready.addObserver(() => {
      log('> pluginManager ready');
      this._resolveReadyPromise();
    });

    // propagate all 'idle' statuses before start
    this._propagateStatusChange();
    // start before ready, even if no deps
    this.signals.start.value = true;

    if (this.signals.ready.length === 0) {
      this.signals.ready.value = true;
    }

    return this.ready;
  }

  /** @private */
  _propagateStatusChange(name = null, status = null) {
    if (name != null && status != null) {
      this._pluginsStatuses[name] = status;

      const statuses = this.getStatuses();
      this._observers.forEach(observer => observer(statuses, { [name]: status }));
    } else {
      const statuses = this.getStatuses();
      this._observers.forEach(observer => observer(statuses, {}));
    }
  }

  /** @private */
  observe(observer) {
    this._observers.add(observer);

    return () => {
      this._observers.delete(observer);
    };
  }

  /** @private */
  // @todo rename to `getStatuses`
  getStatuses() {
    return Object.assign({}, this._pluginsStatuses);
  }

  /**
   * Register a plugin (server-side) into soundworks.
   *
   * _A plugin must be registered both client-side and server-side_
   * @see {@link client.PluginManager#register}
   *
   * @param {String} name - Name of the plugin
   * @param {Function} factory - Factory function that return the plugin class
   * @param {Object} options - Options to configure the plugin
   * @param {Array} deps - List of plugins' names the plugin depends on
   *
   * @example
   * ```js
   * server.pluginManager.register('user-defined-name', pluginFactory);
   * ```
   */
  register(name, factory = null, options = {}, deps = []) {
    if (this._registeredPlugins.has(name)) {
      const ctor = factory(AbstractPlugin);
      throw new Error(`[soundworks:core] Plugin "${name}" of type "${ctor.name}" already registered`);
    }

    const ctor = factory(AbstractPlugin);
    this._registeredPlugins.set(name, { ctor, options, deps });
  }

  /**
   * Retrieve an instance of a registered plugin according to its given name.
   * Except if you know what you are doing, prefer `Experience.require('my-plugin')`
   *
   * @param {String} name - Name of the registered plugin
   */
  get(name, _experience = null) {
    if (!(_experience instanceof AbstractExperience)) {
      throw new Error(`[soundworks:core] pluginManager.get(name, _experience): Invalid argument _experience should be an instance of AbstractExperience`);
    }

    if (!this._registeredPlugins.has(name)) {
      let msg = `[soundworks:core] Cannot get or require plugin "${name}", plugin is not registered`

      if (this._registeredPlugins.size > 0) {
        msg += `
> registered plugins are:
${Array.from(this._registeredPlugins.keys()).map(name => `> - ${name}\n`).join('')}`
      } else {
        msg += `
> no plugin registered`
      }

      throw new Error(msg);
    }

    // required by experience and manager already started
    if (_experience instanceof AbstractExperience && this.signals.start.value === true) {
      throw new Error(`[soundworks:core] Cannot require plugin ("${name}") after server.start()`);
    }

    if (!this._instances.has(name)) {
      this._createInstance(name);
    }

    const instance = this._instances.get(name);

    // if require by the experience, map client types
    if (_experience instanceof AbstractExperience) {
      _experience.clientTypes.forEach((clientType) => {
        instance.clientTypes.add(clientType);
      });
    }

    return instance;
  }

  /** @private */
  _createInstance(name) {
    log(`> instantiating plugin "${name}"`);

    const { ctor, options, deps } = this._registeredPlugins.get(name);
    const instance = new ctor(this._server, name, options);

    this.signals.ready.add(instance.signals.ready);
    instance.signals.start.add(this.signals.start);

    if (deps.length > 0) {
      deps.forEach(dependencyName => {
        if (!this._instances.has(dependencyName)) {
          this.get(dependencyName, _experience); // propagate client types
        }

        const dependency = this._instances.get(dependencyName);
        instance.signals.start.add(dependency.signals.ready);
      });
    }

    // handle plugin status reporting
    this._pluginsStatuses[name] = 'idle';

    const onPluginStarted = () => {
      this._propagateStatusChange(name, 'started');
    };

    const onPluginErrored = () => {
      this._propagateStatusChange(name, 'errored');

      instance.signals.started.removeObserver(onPluginStarted);
      instance.signals.ready.removeObserver(onPluginReady);
      instance.signals.errored.removeObserver(onPluginErrored);
    };

    const onPluginReady = () => {
      this._propagateStatusChange(name, 'ready');

      instance.signals.started.removeObserver(onPluginStarted);
      instance.signals.ready.removeObserver(onPluginReady);
      instance.signals.errored.removeObserver(onPluginErrored);
    };

    // listen the signals
    instance.signals.started.addObserver(onPluginStarted);
    instance.signals.ready.addObserver(onPluginReady);
    instance.signals.errored.addObserver(onPluginErrored);

    this._instances.set(name, instance);
  }

  /**
   * @private
   * This method is protected (semi-private), only used by server to check
   * consistency between client and server experiences requirements.
   */
  getRequiredPlugins(clientType = null) {
    const plugins = [];

    for (let name of this._instances.keys()) {
      if (clientType !== null) {
        if (this._instances.get(name).clientTypes.has(clientType)) {
          plugins.push(name);
        }
      } else {
        plugins.push(name);
      }
    }

    return plugins;
  }
}

export default PluginManager;
