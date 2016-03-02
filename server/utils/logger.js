'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

// @TODO allow configuration
function socketSerializer(socket) {
  return { id: socket.id };
}

/**
 * @private
 */
var logger = {
  initialize: function initialize(config) {
    config.serializers = {
      socket: socketSerializer
    };

    var log = _bunyan2['default'].createLogger(config);

    for (var attr in log) {
      var method = log[attr];
      if (typeof method === 'function') {
        this[attr] = log[attr].bind(log);
      }
    }
  }
};

exports['default'] = logger;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvc2VydmVyL3V0aWxzL2xvZ2dlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztzQkFBbUIsUUFBUTs7Ozs7QUFHM0IsU0FBUyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUU7QUFDaEMsU0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUM7Q0FDMUI7Ozs7O0FBS0QsSUFBTSxNQUFNLEdBQUc7QUFDYixZQUFVLEVBQUEsb0JBQUMsTUFBTSxFQUFFO0FBQ2pCLFVBQU0sQ0FBQyxXQUFXLEdBQUc7QUFDbkIsWUFBTSxFQUFFLGdCQUFnQjtLQUN6QixDQUFDOztBQUVGLFFBQU0sR0FBRyxHQUFHLG9CQUFPLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFeEMsU0FBSyxJQUFJLElBQUksSUFBSSxHQUFHLEVBQUU7QUFDcEIsVUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pCLFVBQUksT0FBTyxNQUFNLEtBQUssVUFBVSxFQUFFO0FBQ2hDLFlBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQ2xDO0tBQ0Y7R0FDRjtDQUNGLENBQUE7O3FCQUVjLE1BQU0iLCJmaWxlIjoiL1VzZXJzL3NjaG5lbGwvRGV2ZWxvcG1lbnQvd2ViL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zb3VuZHdvcmtzL3NyYy9zZXJ2ZXIvdXRpbHMvbG9nZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJ1bnlhbiBmcm9tICdidW55YW4nO1xuXG4vLyBAVE9ETyBhbGxvdyBjb25maWd1cmF0aW9uXG5mdW5jdGlvbiBzb2NrZXRTZXJpYWxpemVyKHNvY2tldCkge1xuICByZXR1cm4geyBpZDogc29ja2V0LmlkIH07XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuY29uc3QgbG9nZ2VyID0ge1xuICBpbml0aWFsaXplKGNvbmZpZykge1xuICAgIGNvbmZpZy5zZXJpYWxpemVycyA9IHtcbiAgICAgIHNvY2tldDogc29ja2V0U2VyaWFsaXplclxuICAgIH07XG5cbiAgICBjb25zdCBsb2cgPSBidW55YW4uY3JlYXRlTG9nZ2VyKGNvbmZpZyk7XG5cbiAgICBmb3IgKGxldCBhdHRyIGluIGxvZykge1xuICAgICAgY29uc3QgbWV0aG9kID0gbG9nW2F0dHJdO1xuICAgICAgaWYgKHR5cGVvZiBtZXRob2QgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpc1thdHRyXSA9IGxvZ1thdHRyXS5iaW5kKGxvZyk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGxvZ2dlcjtcbiJdfQ==