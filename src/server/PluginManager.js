import debug from 'debug';
import AbstractPlugin from './AbstractPlugin.js';
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
    this._registeredPlugins = {};
    /** @private */
    this._instances = {};
    /** @private */
    this._server = server;

    // @todo - move to Promise based logic
    this.signals = {
      start: new Signal(),
      ready: new SignalAll(),
    };

    this.ready = new Promise((resolve, reject) => {
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

    // start before ready, even if no deps
    this.signals.start.value = true;

    if (this.signals.ready.length === 0) {
      this.signals.ready.value = true;
    }

    return this.ready;
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
    if (this._registeredPlugins[name]) {
      const ctor = factory(AbstractPlugin);
      throw new Error(`[soundworks:core] plugin "${name}" of type "${ctor.name}" already registered`);
    }

    const ctor = factory(AbstractPlugin);
    this._registeredPlugins[name] = { ctor, options, deps };
  }

  /**
   * Retrieve an instance of a registered plugin according to its given name.
   * Except if you know what you are doing, prefer `Experience.require('my-plugin')`
   * @param {String} name - Name of the registered plugin
   */
  get(name, _experience = null) {
    if (!this._registeredPlugins[name]) {
      throw new Error(`Cannot get or require plugin "${name}", plugin is not registered
> registered plugins are:
${Object.keys(this._registeredPlugins).map(n => `> - ${n}\n`).join('')}
`);
    }

    // required by experience and manager already started
    if (_experience && this.signals.start.value === true) {
      throw new Error(`Plugin "${name}" required after pluginManager start`);
    }

    if (!this._instances[name]) {
      log(`> instanciating plugin "${name}"`);
      const { ctor, options, deps } = this._registeredPlugins[name];
      const instance = new ctor(this._server, name, options);

      this.signals.ready.add(instance.signals.ready);
      instance.signals.start.add(this.signals.start);

      if (deps.length > 0) {
        deps.forEach(dependencyName => {
          if (!this._instances[dependencyName]) {
            this.get(dependencyName, _experience); // propagate client types
          }

          const dependency = this._instances[dependencyName];
          instance.signals.start.add(dependency.signals.ready);
        });
      }

      this._instances[name] = instance;
    }

    const instance = this._instances[name];

    // if require by the experience, map client types
    if (_experience) {
      _experience.clientTypes.forEach((clientType) => {
        instance.clientTypes.add(clientType);
      });
    }

    return instance;
  }

  /** @private */
  getRequiredPlugins(clientType = null) {
    const plugins = [];

    for (let name in this._instances) {
      if (clientType !== null) {
        if (this._instances[name].clientTypes.has(clientType)) {
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
