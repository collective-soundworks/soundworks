import '@babel/polyfill';
import soundworks from '@soundworks/core/client';
import delayServiceFactory from '@soundworks/service-delay/client';
import PlayerExperience from './PlayerExperience';

async function init() {
  try {
    const config = window.soundworksConfig;

    soundworks.registerService('delay-1', delayServiceFactory);
    soundworks.registerService('delay-2', delayServiceFactory);

    await soundworks.init(config);
    const playerExperience = new PlayerExperience(soundworks, config);

    document.body.classList.remove('loading');

    await soundworks.start();
    playerExperience.start();

    // QoS
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        window.location.reload(true);
      }
    }, false);

    soundworks.client.socket.addListener('close', () => {
      setTimeout(() => window.location.reload(true), 2000);
    });
  } catch(err) {
    console.error(err);
  }
}

window.addEventListener('load', init);
