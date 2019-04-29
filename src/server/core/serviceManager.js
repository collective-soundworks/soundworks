import chalk from 'chalk';
import Signal from '../../utils/Signal';
import SignalAll from '../../utils/SignalAll';

const _ctors = {};
const _instances = {};

/**
 * Manager the services and their relations. Acts as a factory to ensure services
 * are instanciated only once.
 */
const serviceManager = {
  // add an init method
  /**
   *
   *
   */
  init() {
    this._ready = this._ready.bind(this);

    this.signals = {};
    this.signals.start = new Signal();
    this.signals.ready = new Signal();

    this._requiredSignals = new SignalAll();
    this._requiredSignals.addObserver(this._ready);
  },

  start() {
    console.log(chalk.yellow(`+ required services`));
    console.log(
      this.getRequiredServices()
        .sort()
        .map(s => `    ${s} ${chalk.yellow(' starting...')}`)
        .join('\n')
    );

    this.signals.start.set(true);

    if (this._requiredSignals.length === 0) {
      this._ready();
    }
  },

  _ready() {
    this.signals.ready.set(true);
  },

  /**
   * Retrieve a service according to the given id. If the service as not beeen
   * requested yet, it is instanciated.
   * @param {String} id - The id of the registered service
   * @param {Object} options - The options to configure the service.
   */
  require(id, options = {}) {
    id = 'service:' + id;

    if (!_ctors[id]) {
      throw new Error(`Service "${id}" is not defined`);
    }

    let instance = _instances[id];

    if (!instance) {
      instance = new _ctors[id];
      _instances[id] = instance;

      this._requiredSignals.add(instance.signals.ready);

      //
      instance.signals.ready.addObserver((state) => {
        console.log(`    ${id} ${chalk.green(' ready')}`);
      });
    }

    instance.configure(options);
    return instance;
  },

  /**
   * Regiter a service
   * @param {String} id - The id of the service, in order to retrieve it later.
   * @param {Function} ctor - The constructor of the service.
   */
  register(id, ctor) {
    _ctors[id] = ctor;
  },

  getRequiredServices(clientType = null) {
    const services = [];

    for (let id in _instances) {
      if (clientType !== null) {
        if (_instances[id].clientTypes.has(clientType)) {
          services.push(id);
        }
      } else {
        services.push(id);
      }
    }

    return services;
  },

  getServiceList() {
    return Object.keys(_ctors);
  },
};

export default serviceManager;
