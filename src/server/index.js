/* core */
import Client from './core/Client';
import server from './core/server';
import ServerActivity from './core/ServerActivity';
import serverServiceManager from './core/serverServiceManager';
import sockets from './core/sockets';

/* scenes */
import ServerExperience from './scenes/ServerExperience';
// import ServerSurvey from './ServerSurvey';

/* services */
// import ServerCalibration from './ServerCalibration';
import ServerCheckin from './services/ServerCheckin';
// import ServerFileList from './ServerFileList';
import ServerLocator from './services/ServerLocator';
import ServerNetwork from './services/ServerNetwork';
// import ServerPerformance from './ServerPerformance';
import ServerPlacer from './services/ServerPlacer';
import ServerSharedConfig from './services/ServerSharedConfig';
import ServerSharedParams from './services/ServerSharedParams';
import ServerSync from './services/ServerSync';

// utils
import * as helpers from '../utils/helpers';
import * as math from '../utils/math';
import * as setup from '../utils/setup';

export default {
  /* core */
  Client,
  server,
  serverServiceManager, // @tbd - expose ?
  ServerActivity,
  sockets,

  /* scenes */
  ServerExperience,
  // ServerSurvey,

  /* services */
  // @todo - move into a namespace ?
  // ServerCalibration,
  ServerCheckin,
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
