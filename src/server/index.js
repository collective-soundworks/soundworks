/* core */
import sockets from './core/sockets';
import server from './core/server';
import serverServiceManager from './core/serverServiceManager';
import Client from './core/Client';
import ServerActivity from './core/ServerActivity';

/* scenes */
import ServerExperience from './scenes/ServerExperience';
// import ServerSurvey from './ServerSurvey';

/* services */
// import ServerCalibration from './ServerCalibration';
import ServerCheckin from './services/ServerCheckin';
// import ServerFileList from './ServerFileList';
import ServerLocator from './services/ServerLocator';
// import ServerPerformance from './ServerPerformance';
// import ServerPlacer from './ServerPlacer';
import ServerSharedConfig from './services/ServerSharedConfig';
import ServerSharedParams from './services/ServerSharedParams';
import ServerSync from './services/ServerSync';

// utils
import * as helpers from '../utils/helpers';
import * as math from '../utils/math';
import * as setup from '../utils/setup';

export default {
  /* core */
  sockets,
  server,
  serverServiceManager, // @tbd - expose ?
  Client,
  ServerActivity,

  /* scenes */
  ServerExperience,
  // ServerSurvey,

  /* services */
  // ServerCalibration,
  ServerCheckin,
  // ServerFileList,
  ServerLocator,
  // ServerPerformance,
  // ServerPlacer,
  ServerSharedConfig,
  ServerSharedParams,
  ServerSync,

  utils: {
    helpers,
    math,
    setup,
  },
};
