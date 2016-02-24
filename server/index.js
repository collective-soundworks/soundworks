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
  ServerSync: _servicesServerSync2['default'],

  utils: {
    helpers: helpers,
    math: math,
    setup: setup
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvc2VydmVyL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OzswQkFDbUIsZUFBZTs7OzswQkFDZixlQUFlOzs7O2tDQUNQLHVCQUF1Qjs7Ozt3Q0FDakIsNkJBQTZCOzs7OzJCQUMxQyxnQkFBZ0I7Ozs7OztzQ0FHUCwyQkFBMkI7Ozs7a0NBQy9CLHVCQUF1Qjs7Ozs7OzsyQkFJaEMsZ0JBQWdCOzs7O3FDQUNOLDBCQUEwQjs7OzsyQ0FDcEIsZ0NBQWdDOzs7Ozs7cUNBRXRDLDBCQUEwQjs7OztxQ0FDMUIsMEJBQTBCOzs7Ozs7b0NBRTNCLHlCQUF5Qjs7OzswQ0FDbkIsK0JBQStCOzs7OzBDQUMvQiwrQkFBK0I7Ozs7a0NBQ3ZDLHVCQUF1Qjs7OztxQkFFL0I7O0FBRWIsUUFBTSx5QkFBQTtBQUNOLFFBQU0seUJBQUE7QUFDTixzQkFBb0IsdUNBQUE7QUFDcEIsZ0JBQWMsaUNBQUE7OztBQUdkLGtCQUFnQixxQ0FBQTtBQUNoQixjQUFZLGlDQUFBOzs7O0FBSVosS0FBRywwQkFBQTs7QUFFSCxlQUFhLG9DQUFBO0FBQ2IscUJBQW1CLDBDQUFBOztBQUVuQixlQUFhLG9DQUFBO0FBQ2IsZUFBYSxvQ0FBQTs7QUFFYixjQUFZLG1DQUFBO0FBQ1osb0JBQWtCLHlDQUFBO0FBQ2xCLG9CQUFrQix5Q0FBQTtBQUNsQixZQUFVLGlDQUFBOztBQUVWLE9BQUssRUFBRTtBQUNMLFdBQU8sRUFBUCxPQUFPO0FBQ1AsUUFBSSxFQUFKLElBQUk7QUFDSixTQUFLLEVBQUwsS0FBSztHQUNOO0NBQ0YiLCJmaWxlIjoiL1VzZXJzL3NjaG5lbGwvRGV2ZWxvcG1lbnQvd2ViL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zb3VuZHdvcmtzL3NyYy9zZXJ2ZXIvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBjb3JlICovXG5pbXBvcnQgQ2xpZW50IGZyb20gJy4vY29yZS9DbGllbnQnO1xuaW1wb3J0IHNlcnZlciBmcm9tICcuL2NvcmUvc2VydmVyJztcbmltcG9ydCBTZXJ2ZXJBY3Rpdml0eSBmcm9tICcuL2NvcmUvU2VydmVyQWN0aXZpdHknO1xuaW1wb3J0IHNlcnZlclNlcnZpY2VNYW5hZ2VyIGZyb20gJy4vY29yZS9zZXJ2ZXJTZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgc29ja2V0cyBmcm9tICcuL2NvcmUvc29ja2V0cyc7XG5cbi8qIHNjZW5lcyAqL1xuaW1wb3J0IFNlcnZlckV4cGVyaWVuY2UgZnJvbSAnLi9zY2VuZXMvU2VydmVyRXhwZXJpZW5jZSc7XG5pbXBvcnQgU2VydmVyU3VydmV5IGZyb20gJy4vc2NlbmVzL1NlcnZlclN1cnZleSc7XG5cbi8qIHNlcnZpY2VzICovXG4vLyBpbXBvcnQgU2VydmVyQ2FsaWJyYXRpb24gZnJvbSAnLi9TZXJ2ZXJDYWxpYnJhdGlvbic7XG5pbXBvcnQgT3NjIGZyb20gJy4vc2VydmljZXMvT3NjJztcbmltcG9ydCBTZXJ2ZXJDaGVja2luIGZyb20gJy4vc2VydmljZXMvU2VydmVyQ2hlY2tpbic7XG5pbXBvcnQgU2VydmVyRXJyb3JSZXBvcnRlciBmcm9tICcuL3NlcnZpY2VzL1NlcnZlckVycm9yUmVwb3J0ZXInO1xuLy8gaW1wb3J0IFNlcnZlckZpbGVMaXN0IGZyb20gJy4vU2VydmVyRmlsZUxpc3QnO1xuaW1wb3J0IFNlcnZlckxvY2F0b3IgZnJvbSAnLi9zZXJ2aWNlcy9TZXJ2ZXJMb2NhdG9yJztcbmltcG9ydCBTZXJ2ZXJOZXR3b3JrIGZyb20gJy4vc2VydmljZXMvU2VydmVyTmV0d29yayc7XG4vLyBpbXBvcnQgU2VydmVyUGVyZm9ybWFuY2UgZnJvbSAnLi9TZXJ2ZXJQZXJmb3JtYW5jZSc7XG5pbXBvcnQgU2VydmVyUGxhY2VyIGZyb20gJy4vc2VydmljZXMvU2VydmVyUGxhY2VyJztcbmltcG9ydCBTZXJ2ZXJTaGFyZWRDb25maWcgZnJvbSAnLi9zZXJ2aWNlcy9TZXJ2ZXJTaGFyZWRDb25maWcnO1xuaW1wb3J0IFNlcnZlclNoYXJlZFBhcmFtcyBmcm9tICcuL3NlcnZpY2VzL1NlcnZlclNoYXJlZFBhcmFtcyc7XG5pbXBvcnQgU2VydmVyU3luYyBmcm9tICcuL3NlcnZpY2VzL1NlcnZlclN5bmMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qIGNvcmUgKi9cbiAgc2VydmVyLFxuICBDbGllbnQsXG4gIHNlcnZlclNlcnZpY2VNYW5hZ2VyLCAvLyBAdGJkIC0gZXhwb3NlID9cbiAgU2VydmVyQWN0aXZpdHksXG5cbiAgLyogc2NlbmVzICovXG4gIFNlcnZlckV4cGVyaWVuY2UsXG4gIFNlcnZlclN1cnZleSxcblxuICAvKiBzZXJ2aWNlcyAqL1xuICAvLyBAdG9kbyAtIG1vdmUgaW50byBhIG5hbWVzcGFjZSA/XG4gIE9zYyxcbiAgLy8gU2VydmVyQ2FsaWJyYXRpb24sXG4gIFNlcnZlckNoZWNraW4sXG4gIFNlcnZlckVycm9yUmVwb3J0ZXIsXG4gIC8vIFNlcnZlckZpbGVMaXN0LFxuICBTZXJ2ZXJMb2NhdG9yLFxuICBTZXJ2ZXJOZXR3b3JrLFxuICAvLyBTZXJ2ZXJQZXJmb3JtYW5jZSxcbiAgU2VydmVyUGxhY2VyLFxuICBTZXJ2ZXJTaGFyZWRDb25maWcsXG4gIFNlcnZlclNoYXJlZFBhcmFtcyxcbiAgU2VydmVyU3luYyxcblxuICB1dGlsczoge1xuICAgIGhlbHBlcnMsXG4gICAgbWF0aCxcbiAgICBzZXR1cCxcbiAgfSxcbn07XG4iXX0=