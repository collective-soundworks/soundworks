import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '@webcomponents/webcomponentsjs/webcomponents-bundle.js';
import 'lit/polyfill-support.js';
import { render, html } from 'lit/html.js';

import { Client } from '../../../../../client.js';
import initQoS from '@soundworks/template-helpers/client/init-qos.js';

const config = window.soundworksConfig;

async function launch($container) {
  try {
    const client = new Client(config);

    await client.init();
    initQoS(client);

    // start all the things
    await client.start();

    document.body.classList.remove('loading');
    render(html`
      <div style="padding: 20px">
        <h1 style="margin: 20px 0">soundworks integration test</h1>
      </div>
    `, $container);

    const globals = await client.stateManager.attach('globals');
    globals.set({ done: true });

  } catch(err) {
    console.error(err);
  }
}

// -------------------------------------------------------------------
// bootstrapping
// -------------------------------------------------------------------

const $container = document.querySelector('#__soundworks-container');
launch($container);
