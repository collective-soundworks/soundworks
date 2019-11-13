import debug from 'debug';
import Signal from '../common/Signal';
import SignalAll from '../common/SignalAll';

const log = debug('soundworks:lifecycle');

/**
 * Component dedicated at instantiating and initializing services.
 * Except if you know what you are doing, this components should not be
 * accessed directly.
 *
 * An instance `ServiceManager` is automatically created by the `soundworks.Client`.
 *
 * @memberof @soundworks/core/client
 *
 * @example
 * import soundworks from '@soundworks/core/client';
 *
 * // create a new `soundworks.Client` instance
 * const client = new soundworks.Client();
 * console.log(client.serviceManager);
 */
class ServiceManager {
  constructor(client) {
    /** @private */
    this._instances = {};
    /** @private */
    this._registeredServices = {};
    /** @private */
    this._observers = new Set();
    /** @private */
    this._servicesStatus = {};
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
    const status = this.getValues();
    this._observers.forEach(observer => observer(status));
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
    return Object.assign({}, this._servicesStatus);
  }

  // end @unstable
  // ------------------


  /**
   * Register a service with a given name.
   * @param {String} name - The name of the service.
   * @param {Function} ctor - The constructor of the service.
   */
  register(name, ctor, options = {}, dependencies = []) {
    this._registeredServices[name] = { ctor, options, dependencies };
  }

  /**
   * Returns an instance of a service with options to be applied to its constructor.
   * @param {String} name - The name of the service.
   * @param {Object} [options=null] - Options for the service, may override
   *  previously given options.
   */
  get(name, _experienceRequired = false) {
    if (!this._registeredServices[name]) {
      throw new Error(`Cannot get or require service "${name}", service is not registered
> registered services are:
${Object.keys(this._registeredServices).map(n => `> - ${n}\n`).join('')}
`);
    }

    // throw an error if manager already started
    if (_experienceRequired && this.signals.start.value === true) {
      throw new Error(`Service "${name}" required after serviceManager start`);
    }

    if (!this._instances[name]) {
      const { ctor, options, dependencies } = this._registeredServices[name];
      const instance = new ctor(this._client, name, options);
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
      this._servicesStatus[name] = 'idle';
      let unsubscribe;

      const onServiceStarted = () => {
        this._servicesStatus[name] = 'started';

        /**
         * @fixme - relying on `instance.state` is very weak...
         * we should find a better solution, to declare that we want the
         * serviceManager to watch and propagate initialization steps.
         */
        if (instance.state) {
          unsubscribe = instance.state.subscribe(() => {
            this._emitChange();
          });
        }

        this._emitChange();
      }

      const onServiceErrored = () => {
        this._servicesStatus[name] = 'errored';
        this._emitChange();

        if (unsubscribe) {
          unsubscribe();
        }

        instance.signals.started.removeObserver(onServiceStarted);
        instance.signals.ready.removeObserver(onServiceReady);
        instance.signals.errored.removeObserver(onServiceErrored);
      }

      const onServiceReady = () => {
        this._servicesStatus[name] = 'ready';
        this._emitChange();

        if (unsubscribe) {
          unsubscribe();
        }

        instance.signals.started.removeObserver(onServiceStarted);
        instance.signals.ready.removeObserver(onServiceReady);
        instance.signals.errored.removeObserver(onServiceErrored);
      }

      instance.signals.started.addObserver(onServiceStarted);
      instance.signals.ready.addObserver(onServiceReady);
      instance.signals.errored.addObserver(onServiceErrored);

      // store instance
      this._instances[name] = instance;
    }

    // if instance exists and no other argument given, `get` acts a a pure getter
    const instance = this._instances[name];

    return instance;
  }
};

export default ServiceManager;

