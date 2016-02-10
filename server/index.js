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
  // @todo - move into a namespace ?
  // ServerCalibration,
  ServerCheckin: _servicesServerCheckin2['default'],
  // ServerFileList,
  ServerLocator: _servicesServerLocator2['default'],
  ServerNetwork: _servicesServerNetwork2['default'],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7MEJBQ21CLGVBQWU7Ozs7MEJBQ2YsZUFBZTs7OztrQ0FDUCx1QkFBdUI7Ozs7d0NBQ2pCLDZCQUE2Qjs7OzsyQkFDMUMsZ0JBQWdCOzs7Ozs7c0NBR1AsMkJBQTJCOzs7Ozs7Ozs7cUNBSzlCLDBCQUEwQjs7Ozs7O3FDQUUxQiwwQkFBMEI7Ozs7cUNBQzFCLDBCQUEwQjs7Ozs7OzswQ0FHckIsK0JBQStCOzs7OzBDQUMvQiwrQkFBK0I7Ozs7a0NBQ3ZDLHVCQUF1Qjs7Ozs7OzRCQUdyQixrQkFBa0I7O0lBQS9CLE9BQU87O3lCQUNHLGVBQWU7O0lBQXpCLElBQUk7OzBCQUNPLGdCQUFnQjs7SUFBM0IsS0FBSzs7cUJBRUY7O0FBRWIsUUFBTSx5QkFBQTtBQUNOLFFBQU0seUJBQUE7QUFDTixzQkFBb0IsdUNBQUE7QUFDcEIsZ0JBQWMsaUNBQUE7QUFDZCxTQUFPLDBCQUFBOzs7QUFHUCxrQkFBZ0IscUNBQUE7Ozs7OztBQU1oQixlQUFhLG9DQUFBOztBQUViLGVBQWEsb0NBQUE7QUFDYixlQUFhLG9DQUFBOzs7QUFHYixvQkFBa0IseUNBQUE7QUFDbEIsb0JBQWtCLHlDQUFBO0FBQ2xCLFlBQVUsaUNBQUE7O0FBRVYsT0FBSyxFQUFFO0FBQ0wsV0FBTyxFQUFQLE9BQU87QUFDUCxRQUFJLEVBQUosSUFBSTtBQUNKLFNBQUssRUFBTCxLQUFLO0dBQ047Q0FDRiIsImZpbGUiOiJzcmMvc2VydmVyL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogY29yZSAqL1xuaW1wb3J0IENsaWVudCBmcm9tICcuL2NvcmUvQ2xpZW50JztcbmltcG9ydCBzZXJ2ZXIgZnJvbSAnLi9jb3JlL3NlcnZlcic7XG5pbXBvcnQgU2VydmVyQWN0aXZpdHkgZnJvbSAnLi9jb3JlL1NlcnZlckFjdGl2aXR5JztcbmltcG9ydCBzZXJ2ZXJTZXJ2aWNlTWFuYWdlciBmcm9tICcuL2NvcmUvc2VydmVyU2VydmljZU1hbmFnZXInO1xuaW1wb3J0IHNvY2tldHMgZnJvbSAnLi9jb3JlL3NvY2tldHMnO1xuXG4vKiBzY2VuZXMgKi9cbmltcG9ydCBTZXJ2ZXJFeHBlcmllbmNlIGZyb20gJy4vc2NlbmVzL1NlcnZlckV4cGVyaWVuY2UnO1xuLy8gaW1wb3J0IFNlcnZlclN1cnZleSBmcm9tICcuL1NlcnZlclN1cnZleSc7XG5cbi8qIHNlcnZpY2VzICovXG4vLyBpbXBvcnQgU2VydmVyQ2FsaWJyYXRpb24gZnJvbSAnLi9TZXJ2ZXJDYWxpYnJhdGlvbic7XG5pbXBvcnQgU2VydmVyQ2hlY2tpbiBmcm9tICcuL3NlcnZpY2VzL1NlcnZlckNoZWNraW4nO1xuLy8gaW1wb3J0IFNlcnZlckZpbGVMaXN0IGZyb20gJy4vU2VydmVyRmlsZUxpc3QnO1xuaW1wb3J0IFNlcnZlckxvY2F0b3IgZnJvbSAnLi9zZXJ2aWNlcy9TZXJ2ZXJMb2NhdG9yJztcbmltcG9ydCBTZXJ2ZXJOZXR3b3JrIGZyb20gJy4vc2VydmljZXMvU2VydmVyTmV0d29yayc7XG4vLyBpbXBvcnQgU2VydmVyUGVyZm9ybWFuY2UgZnJvbSAnLi9TZXJ2ZXJQZXJmb3JtYW5jZSc7XG4vLyBpbXBvcnQgU2VydmVyUGxhY2VyIGZyb20gJy4vU2VydmVyUGxhY2VyJztcbmltcG9ydCBTZXJ2ZXJTaGFyZWRDb25maWcgZnJvbSAnLi9zZXJ2aWNlcy9TZXJ2ZXJTaGFyZWRDb25maWcnO1xuaW1wb3J0IFNlcnZlclNoYXJlZFBhcmFtcyBmcm9tICcuL3NlcnZpY2VzL1NlcnZlclNoYXJlZFBhcmFtcyc7XG5pbXBvcnQgU2VydmVyU3luYyBmcm9tICcuL3NlcnZpY2VzL1NlcnZlclN5bmMnO1xuXG4vLyB1dGlsc1xuaW1wb3J0ICogYXMgaGVscGVycyBmcm9tICcuLi91dGlscy9oZWxwZXJzJztcbmltcG9ydCAqIGFzIG1hdGggZnJvbSAnLi4vdXRpbHMvbWF0aCc7XG5pbXBvcnQgKiBhcyBzZXR1cCBmcm9tICcuLi91dGlscy9zZXR1cCc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgLyogY29yZSAqL1xuICBDbGllbnQsXG4gIHNlcnZlcixcbiAgc2VydmVyU2VydmljZU1hbmFnZXIsIC8vIEB0YmQgLSBleHBvc2UgP1xuICBTZXJ2ZXJBY3Rpdml0eSxcbiAgc29ja2V0cyxcblxuICAvKiBzY2VuZXMgKi9cbiAgU2VydmVyRXhwZXJpZW5jZSxcbiAgLy8gU2VydmVyU3VydmV5LFxuXG4gIC8qIHNlcnZpY2VzICovXG4gIC8vIEB0b2RvIC0gbW92ZSBpbnRvIGEgbmFtZXNwYWNlID9cbiAgLy8gU2VydmVyQ2FsaWJyYXRpb24sXG4gIFNlcnZlckNoZWNraW4sXG4gIC8vIFNlcnZlckZpbGVMaXN0LFxuICBTZXJ2ZXJMb2NhdG9yLFxuICBTZXJ2ZXJOZXR3b3JrLFxuICAvLyBTZXJ2ZXJQZXJmb3JtYW5jZSxcbiAgLy8gU2VydmVyUGxhY2VyLFxuICBTZXJ2ZXJTaGFyZWRDb25maWcsXG4gIFNlcnZlclNoYXJlZFBhcmFtcyxcbiAgU2VydmVyU3luYyxcblxuICB1dGlsczoge1xuICAgIGhlbHBlcnMsXG4gICAgbWF0aCxcbiAgICBzZXR1cCxcbiAgfSxcbn07XG4iXX0=