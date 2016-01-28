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

var _coreClient = require('./core/Client');

var _coreClient2 = _interopRequireDefault(_coreClient);

var _corePier = require('./core/Pier');

var _corePier2 = _interopRequireDefault(_corePier);

/* scenes */

var _scenesExperience = require('./scenes/Experience');

var _scenesExperience2 = _interopRequireDefault(_scenesExperience);

/* services */
// import ServerCalibration from './ServerCalibration';

var _servicesServerCheckin = require('./services/ServerCheckin');

var _servicesServerCheckin2 = _interopRequireDefault(_servicesServerCheckin);

// import ServerControl from './ServerControl';
// import ServerFileList from './ServerFileList';
// import ServerLocator from './ServerLocator';
// import ServerPerformance from './ServerPerformance';
// import ServerPlacer from './ServerPlacer';
// import ServerSurvey from './ServerSurvey';
// import ServerSync from './ServerSync';

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
  Client: _coreClient2['default'],
  Pier: _corePier2['default'],

  /* scenes */
  Experience: _scenesExperience2['default'],

  /* services */
  // ServerCalibration,
  ServerCheckin: _servicesServerCheckin2['default'],
  // ServerControl,
  // ServerFileList,
  // ServerLocator,
  // ServerPerformance,
  // ServerPlacer,
  // ServerSurvey,
  // ServerSync,
  utils: {
    helpers: helpers,
    math: math,
    setup: setup
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7MkJBQ29CLGdCQUFnQjs7OzswQkFDakIsZUFBZTs7OzswQkFDZixlQUFlOzs7O3dCQUNqQixhQUFhOzs7Ozs7Z0NBR1AscUJBQXFCOzs7Ozs7O3FDQUlsQiwwQkFBMEI7Ozs7Ozs7Ozs7Ozs7OzRCQVUzQixrQkFBa0I7O0lBQS9CLE9BQU87O3lCQUNHLGVBQWU7O0lBQXpCLElBQUk7OzBCQUNPLGdCQUFnQjs7SUFBM0IsS0FBSzs7cUJBRUY7O0FBRWIsU0FBTywwQkFBQTtBQUNQLFFBQU0seUJBQUE7QUFDTixRQUFNLHlCQUFBO0FBQ04sTUFBSSx1QkFBQTs7O0FBR0osWUFBVSwrQkFBQTs7OztBQUlWLGVBQWEsb0NBQUE7Ozs7Ozs7O0FBUWIsT0FBSyxFQUFFO0FBQ0wsV0FBTyxFQUFQLE9BQU87QUFDUCxRQUFJLEVBQUosSUFBSTtBQUNKLFNBQUssRUFBTCxLQUFLO0dBQ047Q0FDRiIsImZpbGUiOiJzcmMvc2VydmVyL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogY29yZSAqL1xuaW1wb3J0IHNvY2tldHMgZnJvbSAnLi9jb3JlL3NvY2tldHMnO1xuaW1wb3J0IHNlcnZlciBmcm9tICcuL2NvcmUvc2VydmVyJztcbmltcG9ydCBDbGllbnQgZnJvbSAnLi9jb3JlL0NsaWVudCc7XG5pbXBvcnQgUGllciBmcm9tICcuL2NvcmUvUGllcic7XG5cbi8qIHNjZW5lcyAqL1xuaW1wb3J0IEV4cGVyaWVuY2UgZnJvbSAnLi9zY2VuZXMvRXhwZXJpZW5jZSc7XG5cbi8qIHNlcnZpY2VzICovXG4vLyBpbXBvcnQgU2VydmVyQ2FsaWJyYXRpb24gZnJvbSAnLi9TZXJ2ZXJDYWxpYnJhdGlvbic7XG5pbXBvcnQgU2VydmVyQ2hlY2tpbiBmcm9tICcuL3NlcnZpY2VzL1NlcnZlckNoZWNraW4nO1xuLy8gaW1wb3J0IFNlcnZlckNvbnRyb2wgZnJvbSAnLi9TZXJ2ZXJDb250cm9sJztcbi8vIGltcG9ydCBTZXJ2ZXJGaWxlTGlzdCBmcm9tICcuL1NlcnZlckZpbGVMaXN0Jztcbi8vIGltcG9ydCBTZXJ2ZXJMb2NhdG9yIGZyb20gJy4vU2VydmVyTG9jYXRvcic7XG4vLyBpbXBvcnQgU2VydmVyUGVyZm9ybWFuY2UgZnJvbSAnLi9TZXJ2ZXJQZXJmb3JtYW5jZSc7XG4vLyBpbXBvcnQgU2VydmVyUGxhY2VyIGZyb20gJy4vU2VydmVyUGxhY2VyJztcbi8vIGltcG9ydCBTZXJ2ZXJTdXJ2ZXkgZnJvbSAnLi9TZXJ2ZXJTdXJ2ZXknO1xuLy8gaW1wb3J0IFNlcnZlclN5bmMgZnJvbSAnLi9TZXJ2ZXJTeW5jJztcblxuLy8gdXRpbHNcbmltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnLi4vdXRpbHMvaGVscGVycyc7XG5pbXBvcnQgKiBhcyBtYXRoIGZyb20gJy4uL3V0aWxzL21hdGgnO1xuaW1wb3J0ICogYXMgc2V0dXAgZnJvbSAnLi4vdXRpbHMvc2V0dXAnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qIGNvcmUgKi9cbiAgc29ja2V0cyxcbiAgc2VydmVyLFxuICBDbGllbnQsXG4gIFBpZXIsXG5cbiAgLyogc2NlbmVzICovXG4gIEV4cGVyaWVuY2UsXG5cbiAgLyogc2VydmljZXMgKi9cbiAgLy8gU2VydmVyQ2FsaWJyYXRpb24sXG4gIFNlcnZlckNoZWNraW4sXG4gIC8vIFNlcnZlckNvbnRyb2wsXG4gIC8vIFNlcnZlckZpbGVMaXN0LFxuICAvLyBTZXJ2ZXJMb2NhdG9yLFxuICAvLyBTZXJ2ZXJQZXJmb3JtYW5jZSxcbiAgLy8gU2VydmVyUGxhY2VyLFxuICAvLyBTZXJ2ZXJTdXJ2ZXksXG4gIC8vIFNlcnZlclN5bmMsXG4gIHV0aWxzOiB7XG4gICAgaGVscGVycyxcbiAgICBtYXRoLFxuICAgIHNldHVwLFxuICB9LFxufTtcbiJdfQ==