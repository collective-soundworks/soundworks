/**
 * Client-side entry point of the *soundworks* framework.
 *
 * @module soundworks/client
 * @example
 * import * as soundworks from 'soundworks/client';
 */

// export * as audio from 'waves-audio';
// import * as _audio from 'waves-audio';
// export const audio = _audio;
// export { audioContext } from 'waves-audio';

// version (cf. bin/javascripts)
// export const version = '%version%';

// core
// export { default as Activity } from './core/Activity';
import client from './core/client';
import serviceManager from './core/serviceManager';
// export { default as Process } from './core/Process';
export { default as Experience } from './core/Experience';
export { default as Service } from './core/Service';

// load services (load only, do not export)
// import './services/AudioBufferManager';
// export { default as AudioStreamManager } from './services/AudioStreamManager';
// export { default as AudioScheduler } from './services/AudioScheduler';
// import './services/Auth';
// import './services/Checkin';
import'./services/ErrorReporter';
// export { default as FileSystem } from './services/FileSystem';
// export { default as Geolocation } from './services/Geolocation';
// export { default as Language } from './services/Language';
// export { default as Locator } from './services/Locator';
// export { default as MetricScheduler } from './services/MetricScheduler';
// export { default as MotionInput } from './services/MotionInput';
// export { default as Network } from './services/Network';
// export { default as Placer } from './services/Placer';
import './services/Platform';
// export { default as RawSocket } from './services/RawSocket';
// export { default as SharedConfig } from './services/SharedConfig';
// export { default as SharedRecorder } from './services/SharedRecorder';
// import './services/Sync';
// export { default as SyncScheduler } from './services/SyncScheduler';
// import './services/___SharedParams';
// import './services/___SharedConfig';
// import './services/___FileSystem';

// views
// export { default as Canvas2dRenderer } from './views/Canvas2dRenderer';
// export { default as CanvasRenderingGroup } from './views/CanvasRenderingGroup';
// export { default as CanvasView } from './views/CanvasView';
// export { default as SegmentedView } from './views/SegmentedView';
// export { default as TouchSurface } from './views/TouchSurface';
// export { default as View } from './views/View';
// import viewport from './views/viewport';
// import viewManager from './core/viewManager';

// prefabs
// export { default as ControllerScene } from './prefabs/ControllerScene';
// export { default as ControllerExperience } from './prefabs/ControllerExperience';

// export { default as SelectView } from './prefabs/SelectView';
// export { default as SpaceView } from './prefabs/SpaceView';
// export { default as SquaredView } from './prefabs/SquaredView';


const soundworks = {
  config: {},
  client,
  serviceManager,
  // stateManager,

  async init(config) {
    if (!('clientType' in config)) {
      throw new Error('soundworks.init config object "must" define a `clientType`');
    }
    // init sockets
    this.client.type = config.clientType;

    // @todo - review that to adapt to ws options
    const websockets = Object.assign({
      url: '',
      path: 'socket',
      // pingInterval: 5 * 1000,
    }, config.websockets);

    // mix all other config and override with defined socket config
    this.config = Object.assign({}, config, { websockets });

    serviceManager.init();

    await this.client.socket.init(this.client.type, this.config.websockets);
  },

  async start() {
    this._ready = new Promise((resolve, reject) => {
      const payload = {};

      if (this.config.env !== 'production') {
        Object.assign(payload, {
          requiredServices: Object.keys(serviceManager.getValues()),
        });
      }

      // wait for handshake response to mark client as `ready`
      this.client.socket.addListener('s:client:start', ({ id, uuid }) => {
        this.client.id = id;
        this.client.uuid = uuid;

        // everything is ready start service manager
        serviceManager.start().then(() => resolve());
      });

      this.client.socket.addListener('s:client:error', (err) => {
        switch (err.type) {
          case 'services':
            // can only append if env !== 'production'
            const msg = `"${err.data.join(', ')}" required client-side but not server-side`;
            throw new Error(msg);
            break;
        }

        reject();
      });

      this.client.socket.send('s:client:handshake', payload);
    });

    return this._ready;
  },

  // ready(callback) {
  //   this._ready.then(callback);
  // },
}

export default soundworks;

