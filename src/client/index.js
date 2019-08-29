// import client from './client';
// import serviceManager from './serviceManager';
// import StateManager from './StateManager';
export { default as Experience } from './Experience';
export { default as Service } from './Service';
export { default as Client } from './Client';

// /**
//  * client-side part of *soundworks*
//  *
//  * @module @soundworks/core/client
//  *
//  * @example
//  * import soundworks from '@soundworks/core/client';
//  */
// const soundworks = {
//   // expose base classes for service plugins and application code
//   Experience,
//   Service,

//   // soundworks instance
//   // @todo - allow multiple instances (for client-side and thus for consistency)
//   config: {},
//   client,
//   serviceManager,
//   // stateManager,

//   async init(config) {
//     if (!('clientType' in config)) {
//       throw new Error('soundworks.init config object "must" define a `clientType`');
//     }
//     // init sockets
//     this.client.type = config.clientType;

//     // @todo - review that to adapt to ws options
//     const websockets = Object.assign({
//       url: '',
//       path: 'socket',
//       // pingInterval: 5 * 1000,
//     }, config.websockets);

//     // mix all other config and override with defined socket config
//     this.config = Object.assign({}, config, { websockets });

//     this.serviceManager.init();

//     await this.client.socket.init(this.client.type, this.config);

//     this.stateManager = new StateManager(this.client);

//     return Promise.resolve();
//   },

//   async start() {
//     this._ready = new Promise((resolve, reject) => {
//       const payload = {};

//       if (this.config.env !== 'production') {
//         Object.assign(payload, {
//           requiredServices: Object.keys(this.serviceManager.getValues()),
//         });
//       }

//       // wait for handshake response to mark client as `ready`
//       this.client.socket.addListener('s:client:start', ({ id, uuid }) => {
//         this.client.id = id;
//         this.client.uuid = uuid;

//         // everything is ready start service manager
//         this.serviceManager.start().then(() => resolve());
//       });

//       this.client.socket.addListener('s:client:error', (err) => {
//         switch (err.type) {
//           case 'services':
//             // can only append if env !== 'production'
//             const msg = `"${err.data.join(', ')}" required client-side but not server-side`;
//             throw new Error(msg);
//             break;
//         }

//         reject();
//       });

//       this.client.socket.send('s:client:handshake', payload);
//     });

//     return this._ready;
//   },

//   /**
//    * @example
//    * ```js
//    * soundworks.registerService(serviceFactory);  // do not document that, maybe remove
//    * // or
//    * soundworks.registerService('user-defined-name', serviceFactory);
//    * ```
//    */
//   registerService(nameOrFactory, factory = null, options, dependecies) {
//     let name;

//     if (factory === null) {
//       name = nameOrFactory.defaultName;
//       factory = nameOrFactory;
//     } else {
//       name = nameOrFactory;
//     }

//     const ctor = factory(this);
//     this.serviceManager.register(name, ctor, options, dependecies);
//   },
// };

// export default soundworks;

