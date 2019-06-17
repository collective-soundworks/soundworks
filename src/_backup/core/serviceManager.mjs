import debug from 'debug';
import Signal from '../../utils/Signal';
import SignalAll from '../../utils/SignalAll';

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
    console.log('serviceManager:ready');
    this._resolveReadyPromise();
    this.signals.ready.set(true);
  },

  /**
   * Returns an instance of a service with options to be applied to its constructor.
   * @param {String} id - The id of the service.
   * @param {Object} options - Options to pass to the service constructor.
   */
  require(id, options = {}) {
    if (!this._ctors[id]) {
      throw new Error(`Service "${id}" is not defined`);
    }

    if (!this._instances[id]) {
      // throw an error if manager already started
      if (this.signals.start.get() === true) {
        throw new Error(`Service "${id}" required after serviceManager start`);
      }

      const instance = new this._ctors[id]();
      // add the instance ready signal as required for the manager
      this._requiredReadySignals.add(instance.signals.ready);

      // handle service statuses for views
      this.servicesStatus[id] = 'idle';

      const onServiceStart = () => {
        this.servicesStatus[id] = 'started';
        this._emitChange();
      }

      const onServiceReady = () => {
        this.servicesStatus[id] = 'ready';
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
      this._instances[id] = instance;
    }

    const instance = this._instances[id];
    instance.configure(options);

    return instance;
  },

  /**
   * Register a service with a given id.
   * @param {String} id - The id of the service.
   * @param {Function} ctor - The constructor of the service.
   */
  register(id, ctor) {
    this._ctors[id] = ctor;
  },

  get(id) {
    if (this._instances[id]) {
      return this._instances[id];
    } else {
      throw new Error(`Cannot get service ${id}, does not exists`);
    }
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

