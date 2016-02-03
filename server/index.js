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
  sockets: _coreSockets2['default'],
  server: _coreServer2['default'],
  serverServiceManager: _coreServerServiceManager2['default'], // @tbd - expose ?
  Client: _coreClient2['default'],
  ServerActivity: _coreServerActivity2['default'],

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7MkJBQ29CLGdCQUFnQjs7OzswQkFDakIsZUFBZTs7Ozt3Q0FDRCw2QkFBNkI7Ozs7MEJBQzNDLGVBQWU7Ozs7a0NBQ1AsdUJBQXVCOzs7Ozs7c0NBR3JCLDJCQUEyQjs7Ozs7Ozs7O3FDQUs5QiwwQkFBMEI7Ozs7OztxQ0FFMUIsMEJBQTBCOzs7Ozs7OzBDQUdyQiwrQkFBK0I7Ozs7MENBQy9CLCtCQUErQjs7OztrQ0FDdkMsdUJBQXVCOzs7Ozs7NEJBR3JCLGtCQUFrQjs7SUFBL0IsT0FBTzs7eUJBQ0csZUFBZTs7SUFBekIsSUFBSTs7MEJBQ08sZ0JBQWdCOztJQUEzQixLQUFLOztxQkFFRjs7QUFFYixTQUFPLDBCQUFBO0FBQ1AsUUFBTSx5QkFBQTtBQUNOLHNCQUFvQix1Q0FBQTtBQUNwQixRQUFNLHlCQUFBO0FBQ04sZ0JBQWMsaUNBQUE7OztBQUdkLGtCQUFnQixxQ0FBQTs7Ozs7QUFLaEIsZUFBYSxvQ0FBQTs7QUFFYixlQUFhLG9DQUFBOzs7QUFHYixvQkFBa0IseUNBQUE7QUFDbEIsb0JBQWtCLHlDQUFBO0FBQ2xCLFlBQVUsaUNBQUE7O0FBRVYsT0FBSyxFQUFFO0FBQ0wsV0FBTyxFQUFQLE9BQU87QUFDUCxRQUFJLEVBQUosSUFBSTtBQUNKLFNBQUssRUFBTCxLQUFLO0dBQ047Q0FDRiIsImZpbGUiOiJzcmMvc2VydmVyL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogY29yZSAqL1xuaW1wb3J0IHNvY2tldHMgZnJvbSAnLi9jb3JlL3NvY2tldHMnO1xuaW1wb3J0IHNlcnZlciBmcm9tICcuL2NvcmUvc2VydmVyJztcbmltcG9ydCBzZXJ2ZXJTZXJ2aWNlTWFuYWdlciBmcm9tICcuL2NvcmUvc2VydmVyU2VydmljZU1hbmFnZXInO1xuaW1wb3J0IENsaWVudCBmcm9tICcuL2NvcmUvQ2xpZW50JztcbmltcG9ydCBTZXJ2ZXJBY3Rpdml0eSBmcm9tICcuL2NvcmUvU2VydmVyQWN0aXZpdHknO1xuXG4vKiBzY2VuZXMgKi9cbmltcG9ydCBTZXJ2ZXJFeHBlcmllbmNlIGZyb20gJy4vc2NlbmVzL1NlcnZlckV4cGVyaWVuY2UnO1xuLy8gaW1wb3J0IFNlcnZlclN1cnZleSBmcm9tICcuL1NlcnZlclN1cnZleSc7XG5cbi8qIHNlcnZpY2VzICovXG4vLyBpbXBvcnQgU2VydmVyQ2FsaWJyYXRpb24gZnJvbSAnLi9TZXJ2ZXJDYWxpYnJhdGlvbic7XG5pbXBvcnQgU2VydmVyQ2hlY2tpbiBmcm9tICcuL3NlcnZpY2VzL1NlcnZlckNoZWNraW4nO1xuLy8gaW1wb3J0IFNlcnZlckZpbGVMaXN0IGZyb20gJy4vU2VydmVyRmlsZUxpc3QnO1xuaW1wb3J0IFNlcnZlckxvY2F0b3IgZnJvbSAnLi9zZXJ2aWNlcy9TZXJ2ZXJMb2NhdG9yJztcbi8vIGltcG9ydCBTZXJ2ZXJQZXJmb3JtYW5jZSBmcm9tICcuL1NlcnZlclBlcmZvcm1hbmNlJztcbi8vIGltcG9ydCBTZXJ2ZXJQbGFjZXIgZnJvbSAnLi9TZXJ2ZXJQbGFjZXInO1xuaW1wb3J0IFNlcnZlclNoYXJlZENvbmZpZyBmcm9tICcuL3NlcnZpY2VzL1NlcnZlclNoYXJlZENvbmZpZyc7XG5pbXBvcnQgU2VydmVyU2hhcmVkUGFyYW1zIGZyb20gJy4vc2VydmljZXMvU2VydmVyU2hhcmVkUGFyYW1zJztcbmltcG9ydCBTZXJ2ZXJTeW5jIGZyb20gJy4vc2VydmljZXMvU2VydmVyU3luYyc7XG5cbi8vIHV0aWxzXG5pbXBvcnQgKiBhcyBoZWxwZXJzIGZyb20gJy4uL3V0aWxzL2hlbHBlcnMnO1xuaW1wb3J0ICogYXMgbWF0aCBmcm9tICcuLi91dGlscy9tYXRoJztcbmltcG9ydCAqIGFzIHNldHVwIGZyb20gJy4uL3V0aWxzL3NldHVwJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAvKiBjb3JlICovXG4gIHNvY2tldHMsXG4gIHNlcnZlcixcbiAgc2VydmVyU2VydmljZU1hbmFnZXIsIC8vIEB0YmQgLSBleHBvc2UgP1xuICBDbGllbnQsXG4gIFNlcnZlckFjdGl2aXR5LFxuXG4gIC8qIHNjZW5lcyAqL1xuICBTZXJ2ZXJFeHBlcmllbmNlLFxuICAvLyBTZXJ2ZXJTdXJ2ZXksXG5cbiAgLyogc2VydmljZXMgKi9cbiAgLy8gU2VydmVyQ2FsaWJyYXRpb24sXG4gIFNlcnZlckNoZWNraW4sXG4gIC8vIFNlcnZlckZpbGVMaXN0LFxuICBTZXJ2ZXJMb2NhdG9yLFxuICAvLyBTZXJ2ZXJQZXJmb3JtYW5jZSxcbiAgLy8gU2VydmVyUGxhY2VyLFxuICBTZXJ2ZXJTaGFyZWRDb25maWcsXG4gIFNlcnZlclNoYXJlZFBhcmFtcyxcbiAgU2VydmVyU3luYyxcblxuICB1dGlsczoge1xuICAgIGhlbHBlcnMsXG4gICAgbWF0aCxcbiAgICBzZXR1cCxcbiAgfSxcbn07XG4iXX0=