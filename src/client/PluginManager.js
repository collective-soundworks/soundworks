import debug from 'debug';
import AbstractPlugin from './AbstractPlugin.js';
import Signal from '../common/Signal.js';
import SignalAll from '../common/SignalAll.js';

const log = debug('soundworks:lifecycle');

/**
 * Component dedicated at instantiating and initializing plugins.
 * Except if you know what you are doing, this components should not be
 * accessed directly.
 *
 * An instance of the `PluginManager` is automatically created by the
 * `soundworks.Client`.
 * @see {@link client.Client#pluginManager}
 *
 * @memberof client
 *
 * @example
 * import soundworks from '@soundworks/core/client';
 *
 * // create a new `soundworks.Client` instance
 * const client = new soundworks.Client();
 * console.log(client.pluginManager);
 */
class PluginManager {
  constructor(client) {
    /** @private */
    this._instances = {};
    /** @private */
    this._registeredPlugins = {};
    /** @private */
    this._observers = new Set();
    /** @private */
    this._pluginsStatus = {};
    /** @private */
    this._client = client;

    log('> pluginManager init');

    this.signals = {
      start: new Signal(),
      ready: new SignalAll(),
    };

    this.ready = new Promise((resolve, reject) => {
      this._resolveReadyPromise = resolve;
    });
  }

  /**
   * Sends the signal required by all plugins to start.
   * @private
   */
  start() {
    log('> pluginManager start');

    this.signals.ready.addObserver(() => {
      log('> pluginManager ready');

      this._resolveReadyPromise();
    });

    // start before ready, even if no deps
    this.signals.start.value = true;

    if (!this.signals.ready.length) {
      this.signals.ready.value = true;
    }

    return this.ready;
  }

  // ------------------
  // @unstable
  // mimic state manager API, so we can change this later...

  /** @private */
  _emitChange() {
    const status = this.getValues();
    this._observers.forEach(observer => observer(status));
  }

  /** @private */
  observe(observer) {
    this._observers.add(observer);

    return () => {
      this._observers.delete(observer);
    };
  }

  /** @private */
  getValues() {
    return Object.assign({}, this._pluginsStatus);
  }

  // end @unstable
  // ------------------

/** @private */

  /**
   * Register a plugin (client-side) into soundworks.
   *
   * _A plugin must be registered both client-side and server-side_
   * @see {@link server.PluginManager#registerPlugin}
   *
   * @param {String} name - Name of the plugin
   * @param {Function} factory - Factory function that return the plugin class
   * @param {Object} options - Options to configure the plugin
   * @param {Array} deps - List of plugins' names the plugin depends on
   *
   * @example
   * ```js
   * client.pluginManager.registerPlugin('user-defined-name', pluginFactory);
   * ```
   */
  registerPlugin(name, factory = null, options = {}, deps = []) {
    if (this._registeredPlugins[name]) {
      throw new Error(`Plugin "${name}" already registered`);
    }

    const ctor = factory(AbstractPlugin);
    this._registeredPlugins[name] = { ctor, options, deps };
  }

  /**
   * Returns an instance of a plugin with options to be applied to its constructor.
   *
   * @param {String} name - Name of the plugin.
   */
  get(name, _experienceRequired = false) {
    if (!this._registeredPlugins[name]) {
      throw new Error(`Cannot get or require plugin "${name}", plugin is not registered
> registered plugins are:
${Object.keys(this._registeredPlugins).map(n => `> - ${n}\n`).join('')}
`);
    }

    // throw an error if manager already started
    if (_experienceRequired && this.signals.start.value === true) {
      throw new Error(`Plugin "${name}" required after pluginManager start`);
    }

    if (!this._instances[name]) {
      const { ctor, options, deps } = this._registeredPlugins[name];
      const instance = new ctor(this._client, name, options);
      // wait, at least,  for the plugin manager start signal
      instance.signals.start.add(this.signals.start);
      // handle dependency tree
      this.signals.ready.add(instance.signals.ready);

      if (deps.length > 0) {
        deps.forEach(dependencyName => {
          if (!this._instances[dependencyName]) {
            this.get(dependencyName, _experienceRequired);
          }

          const dependency = this._instances[dependencyName];
          instance.signals.start.add(dependency.signals.ready);
        });
      }

      // handle plugin status for reporting
      this._pluginsStatus[name] = 'idle';
      let unsubscribe;

      const onPluginStarted = () => {
        this._pluginsStatus[name] = 'started';

        /**
         * @fixme - relying on `instance.state` is very weak...
         * we should find a better solution, to declare that we want the
         * pluginManager to watch and propagate initialization steps.
         */
        if (instance.state) {
          unsubscribe = instance.state.subscribe(() => {
            this._emitChange();
          });
        }

        this._emitChange();
      }

      const onPluginErrored = () => {
        this._pluginsStatus[name] = 'errored';
        this._emitChange();

        if (unsubscribe) {
          unsubscribe();
        }

        instance.signals.started.removeObserver(onPluginStarted);
        instance.signals.ready.removeObserver(onPluginReady);
        instance.signals.errored.removeObserver(onPluginErrored);
      }

      const onPluginReady = () => {
        this._pluginsStatus[name] = 'ready';
        this._emitChange();

        if (unsubscribe) {
          unsubscribe();
        }

        instance.signals.started.removeObserver(onPluginStarted);
        instance.signals.ready.removeObserver(onPluginReady);
        instance.signals.errored.removeObserver(onPluginErrored);
      }

      instance.signals.started.addObserver(onPluginStarted);
      instance.signals.ready.addObserver(onPluginReady);
      instance.signals.errored.addObserver(onPluginErrored);

      // store instance
      this._instances[name] = instance;
    }

    // if instance exists and no other argument given, `get` acts a a pure getter
    const instance = this._instances[name];

    return instance;
  }
};

export default PluginManager;

