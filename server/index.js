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

// import ServerSurvey from './ServerSurvey';

/* services */
// import ServerCalibration from './ServerCalibration';

var _servicesServerCheckin = require('./services/ServerCheckin');

var _servicesServerCheckin2 = _interopRequireDefault(_servicesServerCheckin);

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
  Client: _coreClient2['default'],
  server: _coreServer2['default'],
  serverServiceManager: _coreServerServiceManager2['default'], // @tbd - expose ?
  ServerActivity: _coreServerActivity2['default'],
  sockets: _coreSockets2['default'],

  /* scenes */
  ServerExperience: _scenesServerExperience2['default'],
  // ServerSurvey,

  /* services */
  // @todo - move into a namespace ?
  // ServerCalibration,
  ServerCheckin: _servicesServerCheckin2['default'],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7MEJBQ21CLGVBQWU7Ozs7MEJBQ2YsZUFBZTs7OztrQ0FDUCx1QkFBdUI7Ozs7d0NBQ2pCLDZCQUE2Qjs7OzsyQkFDMUMsZ0JBQWdCOzs7Ozs7c0NBR1AsMkJBQTJCOzs7Ozs7Ozs7cUNBSzlCLDBCQUEwQjs7Ozs7O3FDQUUxQiwwQkFBMEI7Ozs7cUNBQzFCLDBCQUEwQjs7Ozs7O29DQUUzQix5QkFBeUI7Ozs7MENBQ25CLCtCQUErQjs7OzswQ0FDL0IsK0JBQStCOzs7O2tDQUN2Qyx1QkFBdUI7Ozs7Ozs0QkFHckIsa0JBQWtCOztJQUEvQixPQUFPOzt5QkFDRyxlQUFlOztJQUF6QixJQUFJOzswQkFDTyxnQkFBZ0I7O0lBQTNCLEtBQUs7O3FCQUVGOztBQUViLFFBQU0seUJBQUE7QUFDTixRQUFNLHlCQUFBO0FBQ04sc0JBQW9CLHVDQUFBO0FBQ3BCLGdCQUFjLGlDQUFBO0FBQ2QsU0FBTywwQkFBQTs7O0FBR1Asa0JBQWdCLHFDQUFBOzs7Ozs7QUFNaEIsZUFBYSxvQ0FBQTs7QUFFYixlQUFhLG9DQUFBO0FBQ2IsZUFBYSxvQ0FBQTs7QUFFYixjQUFZLG1DQUFBO0FBQ1osb0JBQWtCLHlDQUFBO0FBQ2xCLG9CQUFrQix5Q0FBQTtBQUNsQixZQUFVLGlDQUFBOztBQUVWLE9BQUssRUFBRTtBQUNMLFdBQU8sRUFBUCxPQUFPO0FBQ1AsUUFBSSxFQUFKLElBQUk7QUFDSixTQUFLLEVBQUwsS0FBSztHQUNOO0NBQ0YiLCJmaWxlIjoic3JjL3NlcnZlci9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGNvcmUgKi9cbmltcG9ydCBDbGllbnQgZnJvbSAnLi9jb3JlL0NsaWVudCc7XG5pbXBvcnQgc2VydmVyIGZyb20gJy4vY29yZS9zZXJ2ZXInO1xuaW1wb3J0IFNlcnZlckFjdGl2aXR5IGZyb20gJy4vY29yZS9TZXJ2ZXJBY3Rpdml0eSc7XG5pbXBvcnQgc2VydmVyU2VydmljZU1hbmFnZXIgZnJvbSAnLi9jb3JlL3NlcnZlclNlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBzb2NrZXRzIGZyb20gJy4vY29yZS9zb2NrZXRzJztcblxuLyogc2NlbmVzICovXG5pbXBvcnQgU2VydmVyRXhwZXJpZW5jZSBmcm9tICcuL3NjZW5lcy9TZXJ2ZXJFeHBlcmllbmNlJztcbi8vIGltcG9ydCBTZXJ2ZXJTdXJ2ZXkgZnJvbSAnLi9TZXJ2ZXJTdXJ2ZXknO1xuXG4vKiBzZXJ2aWNlcyAqL1xuLy8gaW1wb3J0IFNlcnZlckNhbGlicmF0aW9uIGZyb20gJy4vU2VydmVyQ2FsaWJyYXRpb24nO1xuaW1wb3J0IFNlcnZlckNoZWNraW4gZnJvbSAnLi9zZXJ2aWNlcy9TZXJ2ZXJDaGVja2luJztcbi8vIGltcG9ydCBTZXJ2ZXJGaWxlTGlzdCBmcm9tICcuL1NlcnZlckZpbGVMaXN0JztcbmltcG9ydCBTZXJ2ZXJMb2NhdG9yIGZyb20gJy4vc2VydmljZXMvU2VydmVyTG9jYXRvcic7XG5pbXBvcnQgU2VydmVyTmV0d29yayBmcm9tICcuL3NlcnZpY2VzL1NlcnZlck5ldHdvcmsnO1xuLy8gaW1wb3J0IFNlcnZlclBlcmZvcm1hbmNlIGZyb20gJy4vU2VydmVyUGVyZm9ybWFuY2UnO1xuaW1wb3J0IFNlcnZlclBsYWNlciBmcm9tICcuL3NlcnZpY2VzL1NlcnZlclBsYWNlcic7XG5pbXBvcnQgU2VydmVyU2hhcmVkQ29uZmlnIGZyb20gJy4vc2VydmljZXMvU2VydmVyU2hhcmVkQ29uZmlnJztcbmltcG9ydCBTZXJ2ZXJTaGFyZWRQYXJhbXMgZnJvbSAnLi9zZXJ2aWNlcy9TZXJ2ZXJTaGFyZWRQYXJhbXMnO1xuaW1wb3J0IFNlcnZlclN5bmMgZnJvbSAnLi9zZXJ2aWNlcy9TZXJ2ZXJTeW5jJztcblxuLy8gdXRpbHNcbmltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnLi4vdXRpbHMvaGVscGVycyc7XG5pbXBvcnQgKiBhcyBtYXRoIGZyb20gJy4uL3V0aWxzL21hdGgnO1xuaW1wb3J0ICogYXMgc2V0dXAgZnJvbSAnLi4vdXRpbHMvc2V0dXAnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qIGNvcmUgKi9cbiAgQ2xpZW50LFxuICBzZXJ2ZXIsXG4gIHNlcnZlclNlcnZpY2VNYW5hZ2VyLCAvLyBAdGJkIC0gZXhwb3NlID9cbiAgU2VydmVyQWN0aXZpdHksXG4gIHNvY2tldHMsXG5cbiAgLyogc2NlbmVzICovXG4gIFNlcnZlckV4cGVyaWVuY2UsXG4gIC8vIFNlcnZlclN1cnZleSxcblxuICAvKiBzZXJ2aWNlcyAqL1xuICAvLyBAdG9kbyAtIG1vdmUgaW50byBhIG5hbWVzcGFjZSA/XG4gIC8vIFNlcnZlckNhbGlicmF0aW9uLFxuICBTZXJ2ZXJDaGVja2luLFxuICAvLyBTZXJ2ZXJGaWxlTGlzdCxcbiAgU2VydmVyTG9jYXRvcixcbiAgU2VydmVyTmV0d29yayxcbiAgLy8gU2VydmVyUGVyZm9ybWFuY2UsXG4gIFNlcnZlclBsYWNlcixcbiAgU2VydmVyU2hhcmVkQ29uZmlnLFxuICBTZXJ2ZXJTaGFyZWRQYXJhbXMsXG4gIFNlcnZlclN5bmMsXG5cbiAgdXRpbHM6IHtcbiAgICBoZWxwZXJzLFxuICAgIG1hdGgsXG4gICAgc2V0dXAsXG4gIH0sXG59O1xuIl19