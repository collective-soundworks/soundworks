/* core */
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreClient = require('./core/Client');

var _coreClient2 = _interopRequireDefault(_coreClient);

var _coreServer = require('./core/server');

var _coreServer2 = _interopRequireDefault(_coreServer);

var _coreServerActivity = require('./core/ServerActivity');

var _coreServerActivity2 = _interopRequireDefault(_coreServerActivity);

var _coreServerServiceManager = require('./core/serverServiceManager');

var _coreServerServiceManager2 = _interopRequireDefault(_coreServerServiceManager);

var _coreSockets = require('./core/sockets');

var _coreSockets2 = _interopRequireDefault(_coreSockets);

/* scenes */

var _scenesServerExperience = require('./scenes/ServerExperience');

var _scenesServerExperience2 = _interopRequireDefault(_scenesServerExperience);

var _scenesServerSurvey = require('./scenes/ServerSurvey');

var _scenesServerSurvey2 = _interopRequireDefault(_scenesServerSurvey);

/* services */
// import ServerCalibration from './ServerCalibration';

var _servicesOsc = require('./services/Osc');

var _servicesOsc2 = _interopRequireDefault(_servicesOsc);

var _servicesServerCheckin = require('./services/ServerCheckin');

var _servicesServerCheckin2 = _interopRequireDefault(_servicesServerCheckin);

var _servicesServerErrorReporter = require('./services/ServerErrorReporter');

var _servicesServerErrorReporter2 = _interopRequireDefault(_servicesServerErrorReporter);

// import ServerFileList from './ServerFileList';

var _servicesServerLocator = require('./services/ServerLocator');

var _servicesServerLocator2 = _interopRequireDefault(_servicesServerLocator);

var _servicesServerNetwork = require('./services/ServerNetwork');

var _servicesServerNetwork2 = _interopRequireDefault(_servicesServerNetwork);

// import ServerPerformance from './ServerPerformance';

var _servicesServerPlacer = require('./services/ServerPlacer');

var _servicesServerPlacer2 = _interopRequireDefault(_servicesServerPlacer);

var _servicesServerSharedConfig = require('./services/ServerSharedConfig');

var _servicesServerSharedConfig2 = _interopRequireDefault(_servicesServerSharedConfig);

var _servicesServerSharedParams = require('./services/ServerSharedParams');

var _servicesServerSharedParams2 = _interopRequireDefault(_servicesServerSharedParams);

var _servicesServerSync = require('./services/ServerSync');

var _servicesServerSync2 = _interopRequireDefault(_servicesServerSync);

// utils

var _utilsHelpers = require('../utils/helpers');

var helpers = _interopRequireWildcard(_utilsHelpers);

var _utilsMath = require('../utils/math');

var math = _interopRequireWildcard(_utilsMath);

var _utilsSetup = require('../utils/setup');

var setup = _interopRequireWildcard(_utilsSetup);

exports['default'] = {
  /* core */
  server: _coreServer2['default'],
  // @todo - move into namespace ?
  Client: _coreClient2['default'],
  serverServiceManager: _coreServerServiceManager2['default'], // @tbd - expose ?
  ServerActivity: _coreServerActivity2['default'],
  sockets: _coreSockets2['default'],

  /* scenes */
  ServerExperience: _scenesServerExperience2['default'],
  ServerSurvey: _scenesServerSurvey2['default'],

  /* services */
  // @todo - move into a namespace ?
  Osc: _servicesOsc2['default'],
  // ServerCalibration,
  ServerCheckin: _servicesServerCheckin2['default'],
  ServerErrorReporter: _servicesServerErrorReporter2['default'],
  // ServerFileList,
  ServerLocator: _servicesServerLocator2['default'],
  ServerNetwork: _servicesServerNetwork2['default'],
  // ServerPerformance,
  ServerPlacer: _servicesServerPlacer2['default'],
  ServerSharedConfig: _servicesServerSharedConfig2['default'],
  ServerSharedParams: _servicesServerSharedParams2['default'],
  ServerSync: _servicesServerSync2['default'],

  utils: {
    helpers: helpers,
    math: math,
    setup: setup
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9zZXJ2ZXIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7MEJBQ21CLGVBQWU7Ozs7MEJBQ2YsZUFBZTs7OztrQ0FDUCx1QkFBdUI7Ozs7d0NBQ2pCLDZCQUE2Qjs7OzsyQkFDMUMsZ0JBQWdCOzs7Ozs7c0NBR1AsMkJBQTJCOzs7O2tDQUMvQix1QkFBdUI7Ozs7Ozs7MkJBSWhDLGdCQUFnQjs7OztxQ0FDTiwwQkFBMEI7Ozs7MkNBQ3BCLGdDQUFnQzs7Ozs7O3FDQUV0QywwQkFBMEI7Ozs7cUNBQzFCLDBCQUEwQjs7Ozs7O29DQUUzQix5QkFBeUI7Ozs7MENBQ25CLCtCQUErQjs7OzswQ0FDL0IsK0JBQStCOzs7O2tDQUN2Qyx1QkFBdUI7Ozs7Ozs0QkFHckIsa0JBQWtCOztJQUEvQixPQUFPOzt5QkFDRyxlQUFlOztJQUF6QixJQUFJOzswQkFDTyxnQkFBZ0I7O0lBQTNCLEtBQUs7O3FCQUVGOztBQUViLFFBQU0seUJBQUE7O0FBRU4sUUFBTSx5QkFBQTtBQUNOLHNCQUFvQix1Q0FBQTtBQUNwQixnQkFBYyxpQ0FBQTtBQUNkLFNBQU8sMEJBQUE7OztBQUdQLGtCQUFnQixxQ0FBQTtBQUNoQixjQUFZLGlDQUFBOzs7O0FBSVosS0FBRywwQkFBQTs7QUFFSCxlQUFhLG9DQUFBO0FBQ2IscUJBQW1CLDBDQUFBOztBQUVuQixlQUFhLG9DQUFBO0FBQ2IsZUFBYSxvQ0FBQTs7QUFFYixjQUFZLG1DQUFBO0FBQ1osb0JBQWtCLHlDQUFBO0FBQ2xCLG9CQUFrQix5Q0FBQTtBQUNsQixZQUFVLGlDQUFBOztBQUVWLE9BQUssRUFBRTtBQUNMLFdBQU8sRUFBUCxPQUFPO0FBQ1AsUUFBSSxFQUFKLElBQUk7QUFDSixTQUFLLEVBQUwsS0FBSztHQUNOO0NBQ0YiLCJmaWxlIjoiL1VzZXJzL21hdHVzemV3c2tpL2Rldi9jb3NpbWEvbGliL3NvdW5kd29ya3Mvc3JjL3NlcnZlci9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGNvcmUgKi9cbmltcG9ydCBDbGllbnQgZnJvbSAnLi9jb3JlL0NsaWVudCc7XG5pbXBvcnQgc2VydmVyIGZyb20gJy4vY29yZS9zZXJ2ZXInO1xuaW1wb3J0IFNlcnZlckFjdGl2aXR5IGZyb20gJy4vY29yZS9TZXJ2ZXJBY3Rpdml0eSc7XG5pbXBvcnQgc2VydmVyU2VydmljZU1hbmFnZXIgZnJvbSAnLi9jb3JlL3NlcnZlclNlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBzb2NrZXRzIGZyb20gJy4vY29yZS9zb2NrZXRzJztcblxuLyogc2NlbmVzICovXG5pbXBvcnQgU2VydmVyRXhwZXJpZW5jZSBmcm9tICcuL3NjZW5lcy9TZXJ2ZXJFeHBlcmllbmNlJztcbmltcG9ydCBTZXJ2ZXJTdXJ2ZXkgZnJvbSAnLi9zY2VuZXMvU2VydmVyU3VydmV5JztcblxuLyogc2VydmljZXMgKi9cbi8vIGltcG9ydCBTZXJ2ZXJDYWxpYnJhdGlvbiBmcm9tICcuL1NlcnZlckNhbGlicmF0aW9uJztcbmltcG9ydCBPc2MgZnJvbSAnLi9zZXJ2aWNlcy9Pc2MnO1xuaW1wb3J0IFNlcnZlckNoZWNraW4gZnJvbSAnLi9zZXJ2aWNlcy9TZXJ2ZXJDaGVja2luJztcbmltcG9ydCBTZXJ2ZXJFcnJvclJlcG9ydGVyIGZyb20gJy4vc2VydmljZXMvU2VydmVyRXJyb3JSZXBvcnRlcic7XG4vLyBpbXBvcnQgU2VydmVyRmlsZUxpc3QgZnJvbSAnLi9TZXJ2ZXJGaWxlTGlzdCc7XG5pbXBvcnQgU2VydmVyTG9jYXRvciBmcm9tICcuL3NlcnZpY2VzL1NlcnZlckxvY2F0b3InO1xuaW1wb3J0IFNlcnZlck5ldHdvcmsgZnJvbSAnLi9zZXJ2aWNlcy9TZXJ2ZXJOZXR3b3JrJztcbi8vIGltcG9ydCBTZXJ2ZXJQZXJmb3JtYW5jZSBmcm9tICcuL1NlcnZlclBlcmZvcm1hbmNlJztcbmltcG9ydCBTZXJ2ZXJQbGFjZXIgZnJvbSAnLi9zZXJ2aWNlcy9TZXJ2ZXJQbGFjZXInO1xuaW1wb3J0IFNlcnZlclNoYXJlZENvbmZpZyBmcm9tICcuL3NlcnZpY2VzL1NlcnZlclNoYXJlZENvbmZpZyc7XG5pbXBvcnQgU2VydmVyU2hhcmVkUGFyYW1zIGZyb20gJy4vc2VydmljZXMvU2VydmVyU2hhcmVkUGFyYW1zJztcbmltcG9ydCBTZXJ2ZXJTeW5jIGZyb20gJy4vc2VydmljZXMvU2VydmVyU3luYyc7XG5cbi8vIHV0aWxzXG5pbXBvcnQgKiBhcyBoZWxwZXJzIGZyb20gJy4uL3V0aWxzL2hlbHBlcnMnO1xuaW1wb3J0ICogYXMgbWF0aCBmcm9tICcuLi91dGlscy9tYXRoJztcbmltcG9ydCAqIGFzIHNldHVwIGZyb20gJy4uL3V0aWxzL3NldHVwJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAvKiBjb3JlICovXG4gIHNlcnZlcixcbiAgLy8gQHRvZG8gLSBtb3ZlIGludG8gbmFtZXNwYWNlID9cbiAgQ2xpZW50LFxuICBzZXJ2ZXJTZXJ2aWNlTWFuYWdlciwgLy8gQHRiZCAtIGV4cG9zZSA/XG4gIFNlcnZlckFjdGl2aXR5LFxuICBzb2NrZXRzLFxuXG4gIC8qIHNjZW5lcyAqL1xuICBTZXJ2ZXJFeHBlcmllbmNlLFxuICBTZXJ2ZXJTdXJ2ZXksXG5cbiAgLyogc2VydmljZXMgKi9cbiAgLy8gQHRvZG8gLSBtb3ZlIGludG8gYSBuYW1lc3BhY2UgP1xuICBPc2MsXG4gIC8vIFNlcnZlckNhbGlicmF0aW9uLFxuICBTZXJ2ZXJDaGVja2luLFxuICBTZXJ2ZXJFcnJvclJlcG9ydGVyLFxuICAvLyBTZXJ2ZXJGaWxlTGlzdCxcbiAgU2VydmVyTG9jYXRvcixcbiAgU2VydmVyTmV0d29yayxcbiAgLy8gU2VydmVyUGVyZm9ybWFuY2UsXG4gIFNlcnZlclBsYWNlcixcbiAgU2VydmVyU2hhcmVkQ29uZmlnLFxuICBTZXJ2ZXJTaGFyZWRQYXJhbXMsXG4gIFNlcnZlclN5bmMsXG5cbiAgdXRpbHM6IHtcbiAgICBoZWxwZXJzLFxuICAgIG1hdGgsXG4gICAgc2V0dXAsXG4gIH0sXG59O1xuIl19