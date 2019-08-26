import debug from 'debug';
import Signal from '../common/Signal';
import SignalAll from '../common/SignalAll';

const log = debug('soundworks:serviceManager');

/**
 * Factory and initialisation manager for the services.
 * Lazy instanciate an instance of the given type and retrieve it on each call.
 */
const serviceManager = {
  /** @private */
  _serviceInstanciationHook: null,
  /** @private */
  _instances: {},
  /** @private */
  _ctors: {},
  /** @private */
  _observers: new Set(),
  /** @ */
  servicesStatus: {},

  /**
   * Initialize the manager.
   * @private
   */
  init() {
    log('init');
    this._requiredReadySignals = new SignalAll();
    this._requiredReadySignals.addObserver(() => this._ready());

    this.signals = {};
    this.signals.start = new Signal();
    this.signals.ready = new Signal();

    this.ready = new Promise((resolve, reject) => {
      this._resolveReadyPromise = resolve;
    });
  },

  /**
   * Sends the signal required by all services to start.
   * @private
   */
  start() {
    const networkedServices = [];

    this.signals.start.set(true);

    if (!this._requiredReadySignals.length) {
      this._resolveReadyPromise();
    }

    return this.ready;
  },

  /**
   * Mark the services as ready. This signal is observed by {@link Experience}
   * instances and trigger their `start`.
   * @private
   */
  _ready() {
    this._resolveReadyPromise();
    this.signals.ready.set(true);
  },

  /**
   * Returns an instance of a service with options to be applied to its constructor.
   * @param {String} name - The name of the service.
   * @param {Object} [options=null] - Options for the service, may override
   *  previously given options.
   */
  get(name, options = null, dependencies = []) {
    if (!this._ctors[name]) {
      throw new Error(`Service "${name}" is not defined`);
    }

    if (!this._instances[name]) {
      // throw an error if manager already started
      if (this.signals.start.get() === true) {
        throw new Error(`Service "${name}" required after serviceManager start`);
      }

      const instance = new this._ctors[name]();
      instance.name = name;
      // add the instance ready signal as required for the manager
      this._requiredReadySignals.add(instance.signals.ready);

      // handle service statuses for views
      this.servicesStatus[name] = 'idle';

      const onServiceStart = () => {
        this.servicesStatus[name] = 'started';
        this._emitChange();
      }

      const onServiceReady = () => {
        this.servicesStatus[name] = 'ready';
        this._emitChange();

        instance.signals.start.removeObserver(onServiceStart)
        instance.signals.ready.removeObserver(onServiceReady)
      }

      instance.signals.start.addObserver(onServiceStart);
      instance.signals.ready.addObserver(onServiceReady);
      // trigger updates for params update too
      instance.params.addListener(() => {
        this._emitChange();
      });

      // store instance
      this._instances[name] = instance;
    }

    // if instance exists and no other argument given, `get` acts a a pure getter
    const instance = this._instances[name];

    if (options !== null) {
      instance.configure(options);
    }

    if (dependencies.length) {
      dependencies.forEach(dependencyName => {
        if (!this._instances[dependencyName]) {
          throw new Error(`"${name}" cannot depend on "${dependencyName}",
            ${dependencyName} has not been required`);
        }

        const dependency = this._instances[dependencyName];
        instance.requiredStartSignals.add(dependency.signals.ready);
      });
    }

    return instance;
  },

  /**
   * Register a service with a given name.
   * @param {String} name - The name of the service.
   * @param {Function} ctor - The constructor of the service.
   */
  register(name, ctor) {
    this._ctors[name] = ctor;
  },

  // @note - mimic state Manager API so we can change this later
  _emitChange() {
    this._observers.forEach(observer => observer());
  },

  observe(observer) {
    this._observers.add(observer);

    return () => {
      this._observers.delete(observer);
    };
  },

  getValues() {
    return Object.assign({}, this.servicesStatus);
  }
};

export default serviceManager;

