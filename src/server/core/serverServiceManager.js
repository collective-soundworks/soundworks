const _ctors = {};
const _instances = {};

const serverServiceManager = {
  require(id, options = {}) {
    id = 'service:' + id;

    if (!_ctors[id])
      throw new Error(`Service "${id}" does not exists`);

    let instance = _instances[id];

    if (!instance) {
      instance = new _ctors[id];
      _instances[id] = instance;
    }

    instance.configure(options);
    return instance;
  },

  register(id, ctor) {
    _ctors[id] = ctor;
  },
};

export default serverServiceManager;
