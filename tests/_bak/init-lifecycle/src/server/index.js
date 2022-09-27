import '@babel/polyfill';
import 'source-map-support/register';

import soundworks from '@soundworks/core/server';
import serveStatic from 'serve-static';
import getConfig from './utils/getConfig';

import delayServiceFactory from '@soundworks/service-delay/server';

import PlayerExperience from './PlayerExperience';
import OtherExperience from './OtherExperience';

const ENV = process.env.ENV || 'default';
const { envConfig, appConfig } = getConfig(ENV);

console.log(`
-------------------------------------------------------
- running "${appConfig.name}" in "${ENV}" environment -
-------------------------------------------------------
`);

(async function launch() {
  try {
    // const soundworks = new Soundworks();
    soundworks.registerService('delay-1', delayServiceFactory);
    soundworks.registerService('delay-2', delayServiceFactory);
    soundworks.registerService('delay-3', delayServiceFactory);
    soundworks.registerService('delay-4', delayServiceFactory);

    await soundworks.init(envConfig, (clientType, config, httpRequest) => {
      return {
        clientType: clientType,
        appName: appConfig.name,
        env: envConfig.env,
        websockets: envConfig.websockets,
        defaultType: envConfig.defaultClient,
        assetsDomain: envConfig.assetsDomain,
      };
    });

    const playerExperience = new PlayerExperience(soundworks, 'player');
    const otherExperience = new OtherExperience(soundworks, 'other');

    // static files
    await soundworks.server.router.use(serveStatic('public'));
    await soundworks.server.router.use('build', serveStatic('.build/public'));

    await soundworks.start();
    playerExperience.start();
    otherExperience.start();

  } catch (err) {
    console.error(err.stack);
  }
})();

process.on('unhandledRejection', (reason, p) => {
  console.log('> Unhandled Promise Rejection');
  console.log(reason);
});
