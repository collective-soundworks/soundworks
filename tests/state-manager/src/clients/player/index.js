import '@babel/polyfill';
import '@wessberg/pointer-events';
import { Client } from '@soundworks/core/client';
// import services
import initQoS from '../utils/qos';
// default views for services
import PlayerExperience from './PlayerExperience';
// initalize all clients at once for emulated clients
const platformServices = new Set();
const config = window.soundworksConfig;

async function init($container, index) {
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

    const playerExperience = new PlayerExperience(client, config, $container);
    // store platform service to be able to call all `onUserGesture` at once
    if (playerExperience.platform) {
      platformServices.add(playerExperience.platform);
    }
    // remove loader and init default views for the services
    document.body.classList.remove('loading');

    await client.start();
    playerExperience.start();

    return Promise.resolve();
  } catch(err) {
    console.error(err);
  }
}

window.addEventListener('load', async () => {
  // -------------------------------------------------------------------
  // bootstrapping
  // -------------------------------------------------------------------
  const $container = document.querySelector('#container');
  // this allows to emulate multiple clients in the same page
  // to facilitate development and testing
  // ...be careful in production...
  function getQueryVariable(variable) {
    const query = window.location.search.substring(1);
    const vars = query.split('&');

    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }

    return null;
  }

  const numClients = parseInt(getQueryVariable('emulate')) || 1;

  // special logic for emulated clients (1 click to rule them all)
  if (numClients > 1) {
    for (let i = 0; i < numClients; i++) {
      const $div = document.createElement('div');
      $div.classList.add('emulate');
      $container.appendChild($div);

      init($div, i);
    }

    const $initPlatform = document.createElement('div');
    $initPlatform.classList.add('init-platform');
    $initPlatform.textContent = 'resume all';

    function initPlatforms(e) {
      platformServices.forEach(service => service.onUserGesture(e));
      $initPlatform.remove();
    }

    $initPlatform.addEventListener('touchend', initPlatforms);
    $initPlatform.addEventListener('mouseup', initPlatforms);

    document.body.appendChild($initPlatform);
  } else {
    init($container, 0);
  }
});
