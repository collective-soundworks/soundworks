/* core */
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreSockets = require('./core/sockets');

var _coreSockets2 = _interopRequireDefault(_coreSockets);

var _coreServer = require('./core/server');

var _coreServer2 = _interopRequireDefault(_coreServer);

var _coreServerServiceManager = require('./core/serverServiceManager');

var _coreServerServiceManager2 = _interopRequireDefault(_coreServerServiceManager);

var _coreClient = require('./core/Client');

var _coreClient2 = _interopRequireDefault(_coreClient);

var _coreServerActivity = require('./core/ServerActivity');

var _coreServerActivity2 = _interopRequireDefault(_coreServerActivity);

/* scenes */

var _scenesServerExperience = require('./scenes/ServerExperience');

var _scenesServerExperience2 = _interopRequireDefault(_scenesServerExperience);

/* services */
// import ServerCalibration from './ServerCalibration';

var _servicesServerCheckin = require('./services/ServerCheckin');

var _servicesServerCheckin2 = _interopRequireDefault(_servicesServerCheckin);

var _servicesServerControl = require('./services/ServerControl');

var _servicesServerControl2 = _interopRequireDefault(_servicesServerControl);

// import ServerFileList from './ServerFileList';
// import ServerLocator from './ServerLocator';
// import ServerPerformance from './ServerPerformance';
// import ServerPlacer from './ServerPlacer';
// import ServerSurvey from './ServerSurvey';

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
  sockets: _coreSockets2['default'],
  server: _coreServer2['default'],
  serverServiceManager: _coreServerServiceManager2['default'],
  Client: _coreClient2['default'],
  ServerActivity: _coreServerActivity2['default'],

  /* scenes */
  ServerExperience: _scenesServerExperience2['default'],

  /* services */
  // ServerCalibration,
  ServerCheckin: _servicesServerCheckin2['default'],
  ServerControl: _servicesServerControl2['default'],
  // ServerFileList,
  // ServerLocator,
  // ServerPerformance,
  // ServerPlacer,
  // ServerSurvey,
  ServerSync: _servicesServerSync2['default'],
  utils: {
    helpers: helpers,
    math: math,
    setup: setup
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7MkJBQ29CLGdCQUFnQjs7OzswQkFDakIsZUFBZTs7Ozt3Q0FDRCw2QkFBNkI7Ozs7MEJBQzNDLGVBQWU7Ozs7a0NBQ1AsdUJBQXVCOzs7Ozs7c0NBR3JCLDJCQUEyQjs7Ozs7OztxQ0FJOUIsMEJBQTBCOzs7O3FDQUMxQiwwQkFBMEI7Ozs7Ozs7Ozs7a0NBTTdCLHVCQUF1Qjs7Ozs7OzRCQUdyQixrQkFBa0I7O0lBQS9CLE9BQU87O3lCQUNHLGVBQWU7O0lBQXpCLElBQUk7OzBCQUNPLGdCQUFnQjs7SUFBM0IsS0FBSzs7cUJBRUY7O0FBRWIsU0FBTywwQkFBQTtBQUNQLFFBQU0seUJBQUE7QUFDTixzQkFBb0IsdUNBQUE7QUFDcEIsUUFBTSx5QkFBQTtBQUNOLGdCQUFjLGlDQUFBOzs7QUFHZCxrQkFBZ0IscUNBQUE7Ozs7QUFJaEIsZUFBYSxvQ0FBQTtBQUNiLGVBQWEsb0NBQUE7Ozs7OztBQU1iLFlBQVUsaUNBQUE7QUFDVixPQUFLLEVBQUU7QUFDTCxXQUFPLEVBQVAsT0FBTztBQUNQLFFBQUksRUFBSixJQUFJO0FBQ0osU0FBSyxFQUFMLEtBQUs7R0FDTjtDQUNGIiwiZmlsZSI6InNyYy9zZXJ2ZXIvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBjb3JlICovXG5pbXBvcnQgc29ja2V0cyBmcm9tICcuL2NvcmUvc29ja2V0cyc7XG5pbXBvcnQgc2VydmVyIGZyb20gJy4vY29yZS9zZXJ2ZXInO1xuaW1wb3J0IHNlcnZlclNlcnZpY2VNYW5hZ2VyIGZyb20gJy4vY29yZS9zZXJ2ZXJTZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgQ2xpZW50IGZyb20gJy4vY29yZS9DbGllbnQnO1xuaW1wb3J0IFNlcnZlckFjdGl2aXR5IGZyb20gJy4vY29yZS9TZXJ2ZXJBY3Rpdml0eSc7XG5cbi8qIHNjZW5lcyAqL1xuaW1wb3J0IFNlcnZlckV4cGVyaWVuY2UgZnJvbSAnLi9zY2VuZXMvU2VydmVyRXhwZXJpZW5jZSc7XG5cbi8qIHNlcnZpY2VzICovXG4vLyBpbXBvcnQgU2VydmVyQ2FsaWJyYXRpb24gZnJvbSAnLi9TZXJ2ZXJDYWxpYnJhdGlvbic7XG5pbXBvcnQgU2VydmVyQ2hlY2tpbiBmcm9tICcuL3NlcnZpY2VzL1NlcnZlckNoZWNraW4nO1xuaW1wb3J0IFNlcnZlckNvbnRyb2wgZnJvbSAnLi9zZXJ2aWNlcy9TZXJ2ZXJDb250cm9sJztcbi8vIGltcG9ydCBTZXJ2ZXJGaWxlTGlzdCBmcm9tICcuL1NlcnZlckZpbGVMaXN0Jztcbi8vIGltcG9ydCBTZXJ2ZXJMb2NhdG9yIGZyb20gJy4vU2VydmVyTG9jYXRvcic7XG4vLyBpbXBvcnQgU2VydmVyUGVyZm9ybWFuY2UgZnJvbSAnLi9TZXJ2ZXJQZXJmb3JtYW5jZSc7XG4vLyBpbXBvcnQgU2VydmVyUGxhY2VyIGZyb20gJy4vU2VydmVyUGxhY2VyJztcbi8vIGltcG9ydCBTZXJ2ZXJTdXJ2ZXkgZnJvbSAnLi9TZXJ2ZXJTdXJ2ZXknO1xuaW1wb3J0IFNlcnZlclN5bmMgZnJvbSAnLi9zZXJ2aWNlcy9TZXJ2ZXJTeW5jJztcblxuLy8gdXRpbHNcbmltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnLi4vdXRpbHMvaGVscGVycyc7XG5pbXBvcnQgKiBhcyBtYXRoIGZyb20gJy4uL3V0aWxzL21hdGgnO1xuaW1wb3J0ICogYXMgc2V0dXAgZnJvbSAnLi4vdXRpbHMvc2V0dXAnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qIGNvcmUgKi9cbiAgc29ja2V0cyxcbiAgc2VydmVyLFxuICBzZXJ2ZXJTZXJ2aWNlTWFuYWdlcixcbiAgQ2xpZW50LFxuICBTZXJ2ZXJBY3Rpdml0eSxcblxuICAvKiBzY2VuZXMgKi9cbiAgU2VydmVyRXhwZXJpZW5jZSxcblxuICAvKiBzZXJ2aWNlcyAqL1xuICAvLyBTZXJ2ZXJDYWxpYnJhdGlvbixcbiAgU2VydmVyQ2hlY2tpbixcbiAgU2VydmVyQ29udHJvbCxcbiAgLy8gU2VydmVyRmlsZUxpc3QsXG4gIC8vIFNlcnZlckxvY2F0b3IsXG4gIC8vIFNlcnZlclBlcmZvcm1hbmNlLFxuICAvLyBTZXJ2ZXJQbGFjZXIsXG4gIC8vIFNlcnZlclN1cnZleSxcbiAgU2VydmVyU3luYyxcbiAgdXRpbHM6IHtcbiAgICBoZWxwZXJzLFxuICAgIG1hdGgsXG4gICAgc2V0dXAsXG4gIH0sXG59O1xuIl19