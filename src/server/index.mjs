/**
 * Server-side entry point of the *soundworks* framework.
 *
 * @module soundworks/server
 * @example
 * import * as soundworks from 'soundworks/server';
 */

// export const version = '%version%';
import path from 'path';

/* core */
// export { default as Activity } from './core/Activity';
export { default as Experience } from './core/Experience';
export { default as Service } from './core/Service';
import serviceManager from './core/serviceManager';
import Client from './core/Client';
import server from './core/server';

/* services */
// import './services/AudioBufferManager';
// export { default as AudioStreamManager } from './services/AudioStreamManager';
// import './services/Auth';
// export { default as Osc } from './services/Osc';
// import './services/Checkin';
// import './services/ErrorReporter';
// export { default as FileSystem } from './services/FileSystem';
// export { default as Geolocation } from './services/Geolocation';
// export { default as Locator } from './services/Locator';
// export { default as MetricScheduler } from './services/MetricScheduler';
// export { default as Network } from './services/Network';
// export { default as Placer } from './services/Placer';
// export { default as RawSocket } from './services/RawSocket';
// export { default as SharedConfig } from './services/SharedConfig';
// export { default as SharedParams } from './services/SharedParams';
// export { default as SharedRecorder } from './services/SharedRecorder';
// import './services/Sync';
// export { default as SyncScheduler } from './services/SyncScheduler';

// import './services/___SharedParams';
// import './services/___SharedConfig';
// import './services/___FileSystem';

/* prefabs */
// export { default as ControllerExperience } from './prefabs/ControllerExperience';

const soundworks = {
  config: {},
  server,
  serviceManager,

  /**
   *
   * server config:
   *
   * @param {String} [options.defaultClient='player'] - Client that can access
   *   the application at its root url.
   * @param {String} [options.publicDirectory='public'] - The public directory
   *   to expose, for serving static assets.
   * @param {String} [options.port=8000] - Port on which the http(s) server will
   *   listen
   * @param {Object} [options.serveStaticOptions={}] - TBD
   * @param {Boolean} [options.useHttps=false] - Define wheter to use or not an
   *   an https server.
   * @param {Object} [options.httpsInfos=null] - if `useHttps` is `true`, object
   *   that give the path to `cert` and `key` files (`{ cert, key }`). If `null`
   *   an auto generated certificate will be generated, be aware that browsers
   *   will consider the application as not safe in the case.
   * @param {Object} [options.websocket={}] - TBD
   * @param {String} [options.env='development']
   * @param {String} [options.templateDirectory='src/server/tmpl'] - Folder in
   *   which the server will look for the `index.html` template.
   *
   * @param {Function} clientConfigFunction -
   */
  async init(config, clientConfigFunction) {
        // must be done this way to keep the instance shared
    this.config = config;

    if (this.config.port === undefined) {
       this.config.port = 8000;
    }

    if (this.config.publicDirectory === undefined) {
      this.config.publicDirectory = path.join(process.cwd(), 'public');
    }

    if (this.config.serveStaticOptions === undefined) {
      this.config.serveStaticOptions = {};
    }

    if (this.config.templateDirectory === undefined) {
      this.config.templateDirectory = path.join(process.cwd(), 'src', 'server', 'tmpl');
    }

    if (this.config.defaultClient === undefined) {
      this.config.defaultClient = 'player';
    }

    if (this.config.websockets === undefined) {
      this.config.websockets = {};
    }

    serviceManager.init();
    await server.init(config, clientConfigFunction);

    return Promise.resolve();
  },

  async start() {
    await server.serveStatic(); // create one for js files
    await server.initActivities(); // create one for js files
    await server.createHttpServer();
    await server.initRouting();
    await server.startSocketServer();
    await serviceManager.start();
    await server.listen();

    return Promise.resolve();
  },


}

export default soundworks;
