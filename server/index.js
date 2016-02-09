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

// import ServerPerformance from './ServerPerformance';
// import ServerPlacer from './ServerPlacer';

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
  // ServerCalibration,
  ServerCheckin: _servicesServerCheckin2['default'],
  // ServerFileList,
  ServerLocator: _servicesServerLocator2['default'],
  // ServerPerformance,
  // ServerPlacer,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7MEJBQ21CLGVBQWU7Ozs7MEJBQ2YsZUFBZTs7OztrQ0FDUCx1QkFBdUI7Ozs7d0NBQ2pCLDZCQUE2Qjs7OzsyQkFDMUMsZ0JBQWdCOzs7Ozs7c0NBR1AsMkJBQTJCOzs7Ozs7Ozs7cUNBSzlCLDBCQUEwQjs7Ozs7O3FDQUUxQiwwQkFBMEI7Ozs7Ozs7MENBR3JCLCtCQUErQjs7OzswQ0FDL0IsK0JBQStCOzs7O2tDQUN2Qyx1QkFBdUI7Ozs7Ozs0QkFHckIsa0JBQWtCOztJQUEvQixPQUFPOzt5QkFDRyxlQUFlOztJQUF6QixJQUFJOzswQkFDTyxnQkFBZ0I7O0lBQTNCLEtBQUs7O3FCQUVGOztBQUViLFFBQU0seUJBQUE7QUFDTixRQUFNLHlCQUFBO0FBQ04sc0JBQW9CLHVDQUFBO0FBQ3BCLGdCQUFjLGlDQUFBO0FBQ2QsU0FBTywwQkFBQTs7O0FBR1Asa0JBQWdCLHFDQUFBOzs7OztBQUtoQixlQUFhLG9DQUFBOztBQUViLGVBQWEsb0NBQUE7OztBQUdiLG9CQUFrQix5Q0FBQTtBQUNsQixvQkFBa0IseUNBQUE7QUFDbEIsWUFBVSxpQ0FBQTs7QUFFVixPQUFLLEVBQUU7QUFDTCxXQUFPLEVBQVAsT0FBTztBQUNQLFFBQUksRUFBSixJQUFJO0FBQ0osU0FBSyxFQUFMLEtBQUs7R0FDTjtDQUNGIiwiZmlsZSI6InNyYy9zZXJ2ZXIvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBjb3JlICovXG5pbXBvcnQgQ2xpZW50IGZyb20gJy4vY29yZS9DbGllbnQnO1xuaW1wb3J0IHNlcnZlciBmcm9tICcuL2NvcmUvc2VydmVyJztcbmltcG9ydCBTZXJ2ZXJBY3Rpdml0eSBmcm9tICcuL2NvcmUvU2VydmVyQWN0aXZpdHknO1xuaW1wb3J0IHNlcnZlclNlcnZpY2VNYW5hZ2VyIGZyb20gJy4vY29yZS9zZXJ2ZXJTZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgc29ja2V0cyBmcm9tICcuL2NvcmUvc29ja2V0cyc7XG5cbi8qIHNjZW5lcyAqL1xuaW1wb3J0IFNlcnZlckV4cGVyaWVuY2UgZnJvbSAnLi9zY2VuZXMvU2VydmVyRXhwZXJpZW5jZSc7XG4vLyBpbXBvcnQgU2VydmVyU3VydmV5IGZyb20gJy4vU2VydmVyU3VydmV5JztcblxuLyogc2VydmljZXMgKi9cbi8vIGltcG9ydCBTZXJ2ZXJDYWxpYnJhdGlvbiBmcm9tICcuL1NlcnZlckNhbGlicmF0aW9uJztcbmltcG9ydCBTZXJ2ZXJDaGVja2luIGZyb20gJy4vc2VydmljZXMvU2VydmVyQ2hlY2tpbic7XG4vLyBpbXBvcnQgU2VydmVyRmlsZUxpc3QgZnJvbSAnLi9TZXJ2ZXJGaWxlTGlzdCc7XG5pbXBvcnQgU2VydmVyTG9jYXRvciBmcm9tICcuL3NlcnZpY2VzL1NlcnZlckxvY2F0b3InO1xuLy8gaW1wb3J0IFNlcnZlclBlcmZvcm1hbmNlIGZyb20gJy4vU2VydmVyUGVyZm9ybWFuY2UnO1xuLy8gaW1wb3J0IFNlcnZlclBsYWNlciBmcm9tICcuL1NlcnZlclBsYWNlcic7XG5pbXBvcnQgU2VydmVyU2hhcmVkQ29uZmlnIGZyb20gJy4vc2VydmljZXMvU2VydmVyU2hhcmVkQ29uZmlnJztcbmltcG9ydCBTZXJ2ZXJTaGFyZWRQYXJhbXMgZnJvbSAnLi9zZXJ2aWNlcy9TZXJ2ZXJTaGFyZWRQYXJhbXMnO1xuaW1wb3J0IFNlcnZlclN5bmMgZnJvbSAnLi9zZXJ2aWNlcy9TZXJ2ZXJTeW5jJztcblxuLy8gdXRpbHNcbmltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnLi4vdXRpbHMvaGVscGVycyc7XG5pbXBvcnQgKiBhcyBtYXRoIGZyb20gJy4uL3V0aWxzL21hdGgnO1xuaW1wb3J0ICogYXMgc2V0dXAgZnJvbSAnLi4vdXRpbHMvc2V0dXAnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qIGNvcmUgKi9cbiAgQ2xpZW50LFxuICBzZXJ2ZXIsXG4gIHNlcnZlclNlcnZpY2VNYW5hZ2VyLCAvLyBAdGJkIC0gZXhwb3NlID9cbiAgU2VydmVyQWN0aXZpdHksXG4gIHNvY2tldHMsXG5cbiAgLyogc2NlbmVzICovXG4gIFNlcnZlckV4cGVyaWVuY2UsXG4gIC8vIFNlcnZlclN1cnZleSxcblxuICAvKiBzZXJ2aWNlcyAqL1xuICAvLyBTZXJ2ZXJDYWxpYnJhdGlvbixcbiAgU2VydmVyQ2hlY2tpbixcbiAgLy8gU2VydmVyRmlsZUxpc3QsXG4gIFNlcnZlckxvY2F0b3IsXG4gIC8vIFNlcnZlclBlcmZvcm1hbmNlLFxuICAvLyBTZXJ2ZXJQbGFjZXIsXG4gIFNlcnZlclNoYXJlZENvbmZpZyxcbiAgU2VydmVyU2hhcmVkUGFyYW1zLFxuICBTZXJ2ZXJTeW5jLFxuXG4gIHV0aWxzOiB7XG4gICAgaGVscGVycyxcbiAgICBtYXRoLFxuICAgIHNldHVwLFxuICB9LFxufTtcbiJdfQ==