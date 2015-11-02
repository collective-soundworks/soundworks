'use strict';

module.exports = {
  server: require('./server'),
  Calibration: require('./ServerCalibration'),
  Checkin: require('./ServerCheckin'),
  Client: require('./ServerClient'),
  Control: require('./ServerControl'),
  Filelist: require('./ServerFilelist'),
  Locator: require('./ServerLocator'),
  Module: require('./ServerModule'),
  Performance: require('./ServerPerformance'),
  Placer: require('./ServerPlacer'),
  Setup: require('./ServerSetup'),
  Survey: require('./ServerSurvey'),
  Sync: require('./ServerSync')
};
