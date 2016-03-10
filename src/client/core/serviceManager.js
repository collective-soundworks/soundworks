import client from './client';
import debug from 'debug';
import Signal from './Signal';
import SignalAll from './SignalAll';

const log = debug('soundworks:serviceManager');

const _instances = {};
const _ctors = {};

/**
 * Factory and initialisation manager for the services.
 * Lazy instanciate an instance of the given type and retrieve it on each call.
 */
const serviceManager = {
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

  // reset() {
  //   this.signals.start.set(false);
  //   this.signals.ready.set(false);
  // },

  /**
   * Returns an instance of a service with options to be applied to its constructor.
   * @param {String} id - The id of the service.
   * @param {Object} options - Options to pass to the service constructor.
   */
  require(id, options = {}) {
    id = 'service:' + id;

    if (!_ctors[id])
      throw new Error(`Service "${id}" does not exists`);

    let instance = _instances[id];

    if (!instance) {
      instance = new _ctors[id]();
      // add the instance ready signal as required for the manager
      this._requiredSignals.add(instance.signals.ready);
      // store instance
      _instances[id] = instance;
    }

    instance.configure(options);
    return instance;
  },

  /**
   * Register a service with a given id.
   * @param {String} id - The id of the service.
   * @param {Function} ctor - The constructor of the service.
   */
  register(id, ctor) {
    _ctors[id] = ctor;
  },
};

export default serviceManager;

