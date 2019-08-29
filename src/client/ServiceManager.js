import debug from 'debug';
import Signal from '../common/Signal';
import SignalAll from '../common/SignalAll';

const log = debug('soundworks:lifecycle');

/**
 * Factory and initialisation manager for the services.
 * Lazy instanciate an instance of the given type and retrieve it on each call.
 */
class ServiceManager {
  constructor(client) {
    /** @private */
    this._instances = {};
    /** @private */
    this._registeredService = {};
    /** @private */
    this._observers = new Set();
    /** @private */
    this.servicesStatus = {};
    /** @private */
    this._client = client;

    log('> serviceManager init');

    this.signals = {
      start: new Signal(),
      ready: new SignalAll(),
    };

    this.ready = new Promise((resolve, reject) => {
      this._resolveReadyPromise = resolve;
    });
  }

  /**
   * Sends the signal required by all services to start.
   * @private
   */
  start() {
    log('> serviceManager start');

    this.signals.ready.addObserver(() => {
      log('> serviceManager ready');

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
  _emitChange() {
    this._observers.forEach(observer => observer());
  }

  /** @unstable */
  observe(observer) {
    this._observers.add(observer);

    return () => {
      this._observers.delete(observer);
    };
  }

  /** @unstable */
  getValues() {
    return Object.assign({}, this.servicesStatus);
  }

  // end @unstable
  // ------------------


  /**
   * Register a service with a given name.
   * @param {String} name - The name of the service.
   * @param {Function} ctor - The constructor of the service.
   */
  register(name, ctor, options = {}, dependencies = []) {
    this._registeredService[name] = { ctor, options, dependencies };
  }

  /**
   * Returns an instance of a service with options to be applied to its constructor.
   * @param {String} name - The name of the service.
   * @param {Object} [options=null] - Options for the service, may override
   *  previously given options.
   */
  get(name, _experienceRequired = false) {
    if (!this._registeredService[name]) {
      throw new Error(`Service "${name}" is not defined`);
    }

    // throw an error if manager already started
    if (_experienceRequired && this.signals.start.value === true) {
      throw new Error(`Service "${name}" required after serviceManager start`);
    }

    if (!this._instances[name]) {
      const { ctor, options, dependencies } = this._registeredService[name];
      // @todo - update that to `new ctor(name, options)`
      const instance = new ctor(this._client, name, options);
      instance.name = name;
      instance.configure(options);
      // wait, at least,  for the service manager start signal
      instance.signals.start.add(this.signals.start);
      // handle dependency tree
      this.signals.ready.add(instance.signals.ready);

      if (dependencies.length > 0) {
        dependencies.forEach(dependencyName => {
          if (!this._instances[dependencyName]) {
            this.get(dependencyName, _experienceRequired);
          }

          const dependency = this._instances[dependencyName];
          instance.signals.start.add(dependency.signals.ready);
        });
      }

      // handle service status for reporting
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
      // trigger updates on params update too
      // @note - this should be kept private for now
      // @todo - change this for a shared state, using `stateManager`
      if (instance.params && instance.params.addListener) {
        instance.params.addListener(() => this._emitChange());
      }

      // store instance
      this._instances[name] = instance;
    }

    // if instance exists and no other argument given, `get` acts a a pure getter
    const instance = this._instances[name];

    return instance;
  }
};

export default ServiceManager;

