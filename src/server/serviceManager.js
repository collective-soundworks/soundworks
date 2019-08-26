import chalk from 'chalk';
import Signal from '../common/Signal';
import SignalAll from '../common/SignalAll';

/**
 * Manager the services and their relations. Acts as a factory to ensure services
 * are instanciated only once.
 */
const serviceManager = {
  /** @private */
  _servicesOptions: {},
  /** @private */
  _ctors: {},
  /** @private */
  _instances: {},

  /** @private */
  init() {
    this.signals = {};
    this.signals.start = new Signal();
    this.signals.ready = new Signal();

    this._requiredReadySignals = new SignalAll();
    this._requiredReadySignals.addObserver(() => {
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

    if (this._requiredReadySignals.length === 0) {
      this.signals.ready.set(true);
    }

    return this.ready;
  },

  /**
   * Configure all required service at once.
   * @param {Object} servicesOptions - Object containing configuration options
   *  for multiple services. The keys must correspond to the `name` of an required
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
   * @param {String} name - The name of the service, in order to retrieve it later.
   * @param {Function} ctor - The constructor of the service.
   */
  register(name, ctor) {
    if (this._ctors[name]) {
      throw new Error(`Service "${name}" already registered`);
    }

    this._ctors[name] = ctor;
  },

  /**
   * Retrieve a service according to the given name. If the service as not beeen
   * requested yet, it is instanciated.
   * @param {String} name - The name of the registered service
   * @param {Object} [options=null] - Options for the service, may
   *  override previously given options. Such as the ones given using
   *  `serviceManager.configure()`.
   */
  get(name, options = null, dependencies = [], experience = null) {
    if (!this._ctors[name]) {
      throw new Error(`Service "${name}" is not defined`);
    }

    if (!this._instances[name]) {
      const instance = new this._ctors[name]();
      instance.name = name;
      // initialize with globals options passed with configure
      instance.configure(this._servicesOptions[name]);

      this._instances[name] = instance;

      this._requiredReadySignals.add(instance.signals.ready);

      // log service readiness
      instance.signals.ready.addObserver((state) => {
        console.log(`    ${name} ${chalk.green(' ready')}`);
      });
    }

    // if instance exists and no other argument given, `get` acts a a pure getter
    const instance = this._instances[name];
    // if new options given override defaults from `configure`
    if (options !== null) {
      instance.configure(options);
    }

    if (experience) {
      instance._addClientTypes(experience.clientTypes);
    }

    if (dependencies.length > 0) {
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
