


const processManager = {
  _serviceCtors: new Map(),

  services: new Map(),

  ready() {
    let resolveStartPromise = null;
    // the start promise is maybe not completely needed but keep it as it
    // allows to have a really fine control of services' start
    const startPromise = new Promise((resolve, reject) => {
      resolveStartPromise = resolve;
    });

    // the manager needs at least to `start` to get `ready`
    const requiredPromises = [startPromise];

    for (let [id, service] of this.services) {
      // add readyPromise of the service as a requirement
      requiredPromises.push(service.ready);
      // add the start promise of the manager as a require
      service._requiredPromises.push(startPromise);

      Promise.all(service._requiredPromises).then(() => service.start());
    }

    console.log('> processManager.start', requiredPromises);
    resolveStartPromise();
    // return a Promise that resolves when all clients are ready
    return Promise.all(requiredPromises).then(() => {
      console.log('> processManager.ready');
      return Promise.resolve();
    })
  },

  require(id, caller = null) {
    if (!this.services.has(id)) {
      const ctor = this._serviceCtors.get(id);
      const service = new ctor(id);

      this.services.set(id, service);
    }

    const instance = this.services.get(id);
    // another process
    if (caller !== null) {
      caller._requiredPromises.push(instance.ready);
    }

    return instance;
  },

  register(id, ctor) {
    this._serviceCtors.set(id, ctor);
  },
}

class Service {
  constructor(id) {
  // constructor(id, client) { // client-side API
    this.id = id;

    this.ready = new Promise((resolve, reject) => {
      this._resolveReady = resolve;
    });

    this._requiredPromises = [];
  }

  /** public API */
  start() {
    console.log('start', this.id, this._requiredPromises);
    let timeout;

    if (this.id === 'a') {
      timeout = 1;
    } else {
      timeout = 2;
    }

    setTimeout(() => this.isReady(), timeout * 1000);
  }


  isReady() {
    console.log('ready', this.id);
    this._resolveReady();
  }

  // server-side API
  // connect(client) {}
  // disconnect(client) {}
}

// register services
processManager.register('a', Service);
processManager.register('b', Service);
processManager.register('c', Service);

// require some services
const b = processManager.require('b');
const a = processManager.require('a', b);
const c = processManager.require('c');

// start everything
processManager.ready().then(() => {
  console.log('> services ready, start experience');
});

// a -----> b -------------->
// c -------------->

// we should have
// time 1 - a ready
// time 2 - c ready
// time 3 - b ready


