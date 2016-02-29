/* core */
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

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

exports['default'] = {
  /* core */
  server: _coreServer2['default'],
  Client: _coreClient2['default'],
  serverServiceManager: _coreServerServiceManager2['default'], // @tbd - expose ?
  ServerActivity: _coreServerActivity2['default'],

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
  ServerSync: _servicesServerSync2['default']
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9zZXJ2ZXIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OzBCQUNtQixlQUFlOzs7OzBCQUNmLGVBQWU7Ozs7a0NBQ1AsdUJBQXVCOzs7O3dDQUNqQiw2QkFBNkI7Ozs7MkJBQzFDLGdCQUFnQjs7Ozs7O3NDQUdQLDJCQUEyQjs7OztrQ0FDL0IsdUJBQXVCOzs7Ozs7OzJCQUloQyxnQkFBZ0I7Ozs7cUNBQ04sMEJBQTBCOzs7OzJDQUNwQixnQ0FBZ0M7Ozs7OztxQ0FFdEMsMEJBQTBCOzs7O3FDQUMxQiwwQkFBMEI7Ozs7OztvQ0FFM0IseUJBQXlCOzs7OzBDQUNuQiwrQkFBK0I7Ozs7MENBQy9CLCtCQUErQjs7OztrQ0FDdkMsdUJBQXVCOzs7O3FCQUUvQjs7QUFFYixRQUFNLHlCQUFBO0FBQ04sUUFBTSx5QkFBQTtBQUNOLHNCQUFvQix1Q0FBQTtBQUNwQixnQkFBYyxpQ0FBQTs7O0FBR2Qsa0JBQWdCLHFDQUFBO0FBQ2hCLGNBQVksaUNBQUE7Ozs7QUFJWixLQUFHLDBCQUFBOztBQUVILGVBQWEsb0NBQUE7QUFDYixxQkFBbUIsMENBQUE7O0FBRW5CLGVBQWEsb0NBQUE7QUFDYixlQUFhLG9DQUFBOztBQUViLGNBQVksbUNBQUE7QUFDWixvQkFBa0IseUNBQUE7QUFDbEIsb0JBQWtCLHlDQUFBO0FBQ2xCLFlBQVUsaUNBQUE7Q0FDWCIsImZpbGUiOiIvVXNlcnMvbWF0dXN6ZXdza2kvZGV2L2Nvc2ltYS9saWIvc291bmR3b3Jrcy9zcmMvc2VydmVyL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogY29yZSAqL1xuaW1wb3J0IENsaWVudCBmcm9tICcuL2NvcmUvQ2xpZW50JztcbmltcG9ydCBzZXJ2ZXIgZnJvbSAnLi9jb3JlL3NlcnZlcic7XG5pbXBvcnQgU2VydmVyQWN0aXZpdHkgZnJvbSAnLi9jb3JlL1NlcnZlckFjdGl2aXR5JztcbmltcG9ydCBzZXJ2ZXJTZXJ2aWNlTWFuYWdlciBmcm9tICcuL2NvcmUvc2VydmVyU2VydmljZU1hbmFnZXInO1xuaW1wb3J0IHNvY2tldHMgZnJvbSAnLi9jb3JlL3NvY2tldHMnO1xuXG4vKiBzY2VuZXMgKi9cbmltcG9ydCBTZXJ2ZXJFeHBlcmllbmNlIGZyb20gJy4vc2NlbmVzL1NlcnZlckV4cGVyaWVuY2UnO1xuaW1wb3J0IFNlcnZlclN1cnZleSBmcm9tICcuL3NjZW5lcy9TZXJ2ZXJTdXJ2ZXknO1xuXG4vKiBzZXJ2aWNlcyAqL1xuLy8gaW1wb3J0IFNlcnZlckNhbGlicmF0aW9uIGZyb20gJy4vU2VydmVyQ2FsaWJyYXRpb24nO1xuaW1wb3J0IE9zYyBmcm9tICcuL3NlcnZpY2VzL09zYyc7XG5pbXBvcnQgU2VydmVyQ2hlY2tpbiBmcm9tICcuL3NlcnZpY2VzL1NlcnZlckNoZWNraW4nO1xuaW1wb3J0IFNlcnZlckVycm9yUmVwb3J0ZXIgZnJvbSAnLi9zZXJ2aWNlcy9TZXJ2ZXJFcnJvclJlcG9ydGVyJztcbi8vIGltcG9ydCBTZXJ2ZXJGaWxlTGlzdCBmcm9tICcuL1NlcnZlckZpbGVMaXN0JztcbmltcG9ydCBTZXJ2ZXJMb2NhdG9yIGZyb20gJy4vc2VydmljZXMvU2VydmVyTG9jYXRvcic7XG5pbXBvcnQgU2VydmVyTmV0d29yayBmcm9tICcuL3NlcnZpY2VzL1NlcnZlck5ldHdvcmsnO1xuLy8gaW1wb3J0IFNlcnZlclBlcmZvcm1hbmNlIGZyb20gJy4vU2VydmVyUGVyZm9ybWFuY2UnO1xuaW1wb3J0IFNlcnZlclBsYWNlciBmcm9tICcuL3NlcnZpY2VzL1NlcnZlclBsYWNlcic7XG5pbXBvcnQgU2VydmVyU2hhcmVkQ29uZmlnIGZyb20gJy4vc2VydmljZXMvU2VydmVyU2hhcmVkQ29uZmlnJztcbmltcG9ydCBTZXJ2ZXJTaGFyZWRQYXJhbXMgZnJvbSAnLi9zZXJ2aWNlcy9TZXJ2ZXJTaGFyZWRQYXJhbXMnO1xuaW1wb3J0IFNlcnZlclN5bmMgZnJvbSAnLi9zZXJ2aWNlcy9TZXJ2ZXJTeW5jJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAvKiBjb3JlICovXG4gIHNlcnZlcixcbiAgQ2xpZW50LFxuICBzZXJ2ZXJTZXJ2aWNlTWFuYWdlciwgLy8gQHRiZCAtIGV4cG9zZSA/XG4gIFNlcnZlckFjdGl2aXR5LFxuXG4gIC8qIHNjZW5lcyAqL1xuICBTZXJ2ZXJFeHBlcmllbmNlLFxuICBTZXJ2ZXJTdXJ2ZXksXG5cbiAgLyogc2VydmljZXMgKi9cbiAgLy8gQHRvZG8gLSBtb3ZlIGludG8gYSBuYW1lc3BhY2UgP1xuICBPc2MsXG4gIC8vIFNlcnZlckNhbGlicmF0aW9uLFxuICBTZXJ2ZXJDaGVja2luLFxuICBTZXJ2ZXJFcnJvclJlcG9ydGVyLFxuICAvLyBTZXJ2ZXJGaWxlTGlzdCxcbiAgU2VydmVyTG9jYXRvcixcbiAgU2VydmVyTmV0d29yayxcbiAgLy8gU2VydmVyUGVyZm9ybWFuY2UsXG4gIFNlcnZlclBsYWNlcixcbiAgU2VydmVyU2hhcmVkQ29uZmlnLFxuICBTZXJ2ZXJTaGFyZWRQYXJhbXMsXG4gIFNlcnZlclN5bmMsXG59O1xuIl19