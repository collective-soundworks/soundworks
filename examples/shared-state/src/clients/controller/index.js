import '@babel/polyfill';
import "@wessberg/pointer-events";
import { Client } from '@soundworks/core/client';
import ControllerExperience from './ControllerExperience';
import initQoS from '../utils/qos';

const config = window.soundworksConfig;

async function init() {
  try {
    const client = new Client();

    // -------------------------------------------------------------------
    // register services
    // -------------------------------------------------------------------

    // -------------------------------------------------------------------
    // launch application
    // -------------------------------------------------------------------

    await client.init(config);
    initQoS(client);

    const $container = document.querySelector('#container');
    const controllerExperience = new ControllerExperience(client, config, $container);

    document.body.classList.remove('loading');
    // start everything
    await client.start();
    controllerExperience.start();

  } catch(err) {
    console.error(err);
  }
}

init();
