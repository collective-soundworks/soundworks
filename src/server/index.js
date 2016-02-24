/* core */
import Client from './core/Client';
import server from './core/server';
import ServerActivity from './core/ServerActivity';
import serverServiceManager from './core/serverServiceManager';
import sockets from './core/sockets';

/* scenes */
import ServerExperience from './scenes/ServerExperience';
import ServerSurvey from './scenes/ServerSurvey';

/* services */
// import ServerCalibration from './ServerCalibration';
import Osc from './services/Osc';
import ServerCheckin from './services/ServerCheckin';
import ServerErrorReporter from './services/ServerErrorReporter';
// import ServerFileList from './ServerFileList';
import ServerLocator from './services/ServerLocator';
import ServerNetwork from './services/ServerNetwork';
// import ServerPerformance from './ServerPerformance';
import ServerPlacer from './services/ServerPlacer';
import ServerSharedConfig from './services/ServerSharedConfig';
import ServerSharedParams from './services/ServerSharedParams';
import ServerSync from './services/ServerSync';

export default {
  /* core */
  server,
  Client,
  serverServiceManager, // @tbd - expose ?
  ServerActivity,

  /* scenes */
  ServerExperience,
  ServerSurvey,

  /* services */
  // @todo - move into a namespace ?
  Osc,
  // ServerCalibration,
  ServerCheckin,
  ServerErrorReporter,
  // ServerFileList,
  ServerLocator,
  ServerNetwork,
  // ServerPerformance,
  ServerPlacer,
  ServerSharedConfig,
  ServerSharedParams,
  ServerSync,

  utils: {
    helpers,
    math,
    setup,
  },
};
