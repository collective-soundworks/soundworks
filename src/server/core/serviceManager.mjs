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
  /** @private */
  _servicesOptions: {},

  /** @private */
  init() {
    this.signals = {};
    this.signals.start = new Signal();
    this.signals.ready = new Signal();

    this._requiredSignals = new SignalAll();
    this._requiredSignals.addObserver(() => {
      this.signals.ready.set(true);
    });

    this.ready = new Promise((resolve, reject) => {
      this._resolveReadyPromise = resolve;
    });
  },

  /** @private */
  start() {
    console.log(chalk.yellow(`+ required services`));
    console.log(
      this.getRequiredServices()
        .sort()
        .map(s => `    ${s} ${chalk.yellow(' starting...')}`)
        .join('\n')
    );

    this.signals.ready.addObserver(() => {
      this._resolveReadyPromise();
    });

    this.signals.start.set(true);

    if (this._requiredSignals.length === 0) {
      this.signals.ready.set(true);
    }

    return this.ready;
  },

  /**
   * Retrieve a service according to the given id. If the service as not beeen
   * requested yet, it is instanciated.
   * @param {String} id - The id of the registered service
   * @param {Object} options - The options to configure the service. If an
   *  option for the required service has been given using `serviceManager.configure()`
   *  the present object takes precedence.
   */
  require(id, options = {}) {
    const ctorId = `service:${id}`;

    if (!_ctors[ctorId]) {
      throw new Error(`Service "${ctorId}" is not defined`);
    }

    let instance = _instances[ctorId];

    if (!instance) {
      instance = new _ctors[ctorId];
      _instances[ctorId] = instance;

      this._requiredSignals.add(instance.signals.ready);

      // log service readiness
      instance.signals.ready.addObserver((state) => {
        console.log(`    ${ctorId} ${chalk.green(' ready')}`);
      });
    }

    // @todo - let's assume configuration could be passed after 1rst
    //   instanciation, try to review t make it cleaner
    const config = this._servicesOptions[id] || {};
    Object.assign(config, options);

    instance.configure(config);

    return instance;
  },

  /**
   * Configure all required service at once.
   * @param {Object} servicesOptions - Object containing configuration options
   *  for multiple services. The keys must correspond to the `id` of an required
   *  service, values are the corresponding config objects.
   *
   * @example
   * serviceManager.configure({
   *   auth: {
   *     password: '123456'
   *   },
   *   checkin: {
   *     // ...
   *   },
   * });
   */
  configure(servicesOptions) {
    this._servicesOptions = Object.assign(this._servicesOptions, servicesOptions);
  },

  /**
   * Regiter a new service
   *
   * @param {String} id - The id of the service, in order to retrieve it later.
   * @param {Function} ctor - The constructor of the service.
   */
  register(id, ctor) {
    _ctors[id] = ctor;
  },

  /** @private */
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

  /** @private */
  getServiceList() {
    return Object.keys(_ctors);
  },
};

export default serviceManager;
