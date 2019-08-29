import Signal from '../common/Signal';
import SignalAll from '../common/SignalAll';
import debug from 'debug';
import logger from './utils/logger';

const log = debug('soundworks:lifecycle');

/**
 * Manager the services and their relations. Acts as a factory to ensure services
 * are instanciated only once.
 */
const serviceManager = {
  /** @private */
  _registeredServices: {},
  /** @private */
  _instances: {},

  /** @private */
  init() {
    log('> serviceManager init');

    this.signals = {
      start: new Signal(),
      ready: new SignalAll(),
    };

    this.ready = new Promise((resolve, reject) => {
      this._resolveReadyPromise = resolve;
    });
  },

  /** @private */
  start() {
    log('> serviceManager start');
    logger.title('initializing services');

    this.signals.ready.addObserver(() => {
      log('> serviceManager ready');
      this._resolveReadyPromise();
    });

    // start before ready, even if no dependencies
    this.signals.start.value = true;

    if (this.signals.ready.length === 0) {
      this.signals.ready.value = true;
    }

    return this.ready;
  },

  /**
   * Register a service
   * @private
   *
   * @param {String} name - Name of the service
   * @param {Function} ctor - Constructor of the service
   * @param {Object} options - Options to configure the service
   * @param {Array} dependencies - List of services' names the service depends on
   */
  register(name, ctor, options = {}, dependencies = []) {
    if (this._registeredServices[name]) {
      throw new Error(`Service "${name}" already registered`);
    }

    this._registeredServices[name] = { ctor, options, dependencies };
  },

  /**
   * Retrieve an instance of a registered service according to its given name.
   * Except if you know what you are doing, prefer `Experience.require('my-service')`
   * @param {String} name - Name of the registered service
   */
  get(name, _experience = null) {
    if (!this._registeredServices[name]) {
      throw new Error(`Service "${name}" is not defined`);
    }

    // required by experience and manager already started
    if (_experience && this.signals.start.value === true) {
      throw new Error(`Service "${name}" required after serviceManager start`);
    }

    if (!this._instances[name]) {
      log(`> instanciating service "${name}"`);
      const { ctor, options, dependencies } = this._registeredServices[name];
      // @todo - update that to `new ctor(name, options)`
      const instance = new ctor();
      instance.name = name;
      instance.configure(options);

      this.signals.ready.add(instance.signals.ready);

      if (dependencies.length > 0) {
        dependencies.forEach(dependencyName => {
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
      instance._addClientTypes(_experience.clientTypes);
    }

    return instance;
  },

  /** @private */
  getRequiredServices(clientType = null) {
    const services = [];

    for (let name in this._instances) {
      if (clientType !== null) {
        if (this._instances[name].clientTypes.has(clientType)) {
          services.push(name);
        }
      } else {
        services.push(name);
      }
    }

    return services;
  },
};

export default serviceManager;
