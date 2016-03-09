const _ctors = {};
const _instances = {};


/**
 * Manager the services and their relations. Acts as a factory to ensure services
 * are instanciated only once.
 */
const serviceManager = {
  /**
   * Retrieve a service according to the given id. If the service as not beeen
   * requested yet, it is instanciated.
   * @param {String} id - The id of the registered service
   * @param {Activity} consumer - The activity instance requering the service.
   * @param {Object} options - The options to configure the service.
   */
  require(id, consumer = null, options = {}) {
    id = 'service:' + id;

    if (!_ctors[id])
      throw new Error(`Service "${id}" does not exists`);

    let instance = _instances[id];

    if (!instance) {
      instance = new _ctors[id];
      _instances[id] = instance;
    }

    if (consumer !== null) {
      consumer.addRequiredActivity(instance);
      instance.addClientType(consumer.clientTypes);
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
};

export default serviceManager;
