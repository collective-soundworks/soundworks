import client from './client';
import debug from 'debug';
import Signal from '../../utils/Signal';
import SignalAll from '../../utils/SignalAll';

const log = debug('soundworks:serviceManager');

const _instances = {};
const _ctors = {};

/**
 * Factory and initialisation manager for the services.
 * Lazy instanciate an instance of the given type and retrieve it on each call.
 */
const serviceManager = {
  _serviceInstanciationHook: null,

  /**
   * Initialize the manager.
   */
  init() {
    log('init');
    this._requiredSignals = new SignalAll();
    this._requiredSignals.addObserver(() => this.ready());

    this.signals = {};
    this.signals.start = new Signal();
    this.signals.ready = new Signal();
  },

  /**
   * Sends the signal required by all services to start.
   */
  start() {
    log('start');

    const networkedServices = [];

    this.signals.start.set(true);

    if (!this._requiredSignals.length)
      this.ready();
  },

  /**
   * Mark the services as ready. This signal is observed by {@link Experience}
   * instances and trigger their `start`.
   */
  ready() {
    log('ready');
    this.signals.ready.set(true);
  },

  /**
   * Returns an instance of a service with options to be applied to its constructor.
   * @param {String} id - The id of the service.
   * @param {Object} options - Options to pass to the service constructor.
   */
  require(id, options = {}) {
    id = 'service:' + id;

    if (!_ctors[id])
      throw new Error(`Service "${id}" is not defined`);

    let instance = _instances[id];

    if (!instance) {
      // throw an error if manager already started
      if (this.signals.start.get() === true)
        throw new Error(`Service "${id}" required after application start`);

      instance = new _ctors[id]();

      if (this._serviceInstanciationHook !== null)
        this._serviceInstanciationHook(id, instance);

      // add the instance ready signal as required for the manager
      this._requiredSignals.add(instance.signals.ready);
      // store instance
      _instances[id] = instance;
    }

    instance.configure(options);
    return instance;
  },

  /**
   * Register a function to be executed when a service is instanciated.
   *
   * @param {serviceManager~serviceInstanciationHook} func - Function to
   *  register has a hook to be execute when a service is created.
   */
  /**
   * @callback serviceManager~serviceInstanciationHook
   * @param {String} id - id of the instanciated service.
   * @param {Service} instance - instance of the service.
   */
  setServiceInstanciationHook(func) {
    this._serviceInstanciationHook = func;
  },

  /**
   * Register a service with a given id.
   * @param {String} id - The id of the service.
   * @param {Function} ctor - The constructor of the service.
   */
  register(id, ctor) {
    _ctors[id] = ctor;
  },


  getRequiredServices() {
    return Object.keys(_instances);
  },
};

export default serviceManager;

