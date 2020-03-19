import '@babel/polyfill';
import 'source-map-support/register';

import { Server } from '@soundworks/core/server';
import getConfig from './utils/getConfig';
import path from 'path';
import serveStatic from 'serve-static';
import compile from 'template-literal';

// import services
import PlayerExperience from './PlayerExperience';
import ControllerExperience from './ControllerExperience';

// import the schema definitions
import globalsSchema from './schemas/globals';
import playerSchema from './schemas/player';

const ENV = process.env.ENV || 'default';
const config = getConfig(ENV);

console.log(`
--------------------------------------------------------
- running "${config.app.name}" in "${ENV}" environment -
--------------------------------------------------------
`);

(async function launch() {
  try {
    const server = new Server();

    // -------------------------------------------------------------------
    // register services
    // -------------------------------------------------------------------



    // -------------------------------------------------------------------
    // launch application
    // -------------------------------------------------------------------

    await server.init(config, (clientType, config, httpRequest) => {
      return {
        clientType: clientType,
        app: {
          name: config.app.name,
          author: config.app.author,
        },
        env: {
          type: config.env.type,
          websockets: config.env.websockets,
          assetsDomain: config.env.assetsDomain,
        }
      };
    });

    // -------------------------------------------------------------------
    // register schemas in the shared state server
    // -------------------------------------------------------------------
    server.stateManager.registerSchema('globals', globalsSchema);
    server.stateManager.registerSchema('player', playerSchema);

    const globalsState = await server.stateManager.create('globals');
    console.log('globalsState:', globalsState.getValues());

    // html template and static files (in most case, this should not be modified)
    server.configureHtmlTemplates({ compile }, path.join('.build', 'server', 'tmpl'))
    server.router.use(serveStatic('public'));
    server.router.use('build', serveStatic(path.join('.build', 'public')));

    const playerExperience = new PlayerExperience(server, 'player');
    const controllerExperience = new ControllerExperience(server, 'controller');

    await server.start();
    playerExperience.start();
    controllerExperience.start();

  } catch (err) {
    console.error(err.stack);
  }
})();

process.on('unhandledRejection', (reason, p) => {
  console.log('> Unhandled Promise Rejection');
  console.log(reason);
});
