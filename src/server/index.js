/* core */
import sockets from './core/sockets';
import server from './core/server';
import Client from './core/Client';
import Pier from './core/Pier';

/* scenes */
import Experience from './scenes/Experience';

/* services */
// import ServerCalibration from './ServerCalibration';
import ServerCheckin from './services/ServerCheckin';
import ServerControl from './services/ServerControl';
// import ServerFileList from './ServerFileList';
// import ServerLocator from './ServerLocator';
// import ServerPerformance from './ServerPerformance';
// import ServerPlacer from './ServerPlacer';
// import ServerSurvey from './ServerSurvey';
import ServerSync from './services/ServerSync';

// utils
import * as helpers from '../utils/helpers';
import * as math from '../utils/math';
import * as setup from '../utils/setup';

export default {
  /* core */
  sockets,
  server,
  Client,
  Pier,

  /* scenes */
  Experience,

  /* services */
  // ServerCalibration,
  ServerCheckin,
  ServerControl,
  // ServerFileList,
  // ServerLocator,
  // ServerPerformance,
  // ServerPlacer,
  // ServerSurvey,
  ServerSync,
  utils: {
    helpers,
    math,
    setup,
  },
};
