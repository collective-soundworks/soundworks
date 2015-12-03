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
      // console.log(attr, log[attr]);
      // this[attr] = log[attr].bind(log);
    }
  }
};

exports['default'] = logger;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvbG9nZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O3NCQUFtQixRQUFROzs7OztBQUczQixTQUFTLGdCQUFnQixDQUFDLE1BQU0sRUFBRTtBQUNoQyxTQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxFQUFFLEVBQUUsQ0FBQztDQUMxQjs7Ozs7QUFLRCxJQUFNLE1BQU0sR0FBRztBQUNiLFlBQVUsRUFBQSxvQkFBQyxNQUFNLEVBQUU7QUFDakIsVUFBTSxDQUFDLFdBQVcsR0FBRztBQUNuQixZQUFNLEVBQUUsZ0JBQWdCO0tBQ3pCLENBQUM7O0FBRUYsUUFBTSxHQUFHLEdBQUcsb0JBQU8sWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3hDLFNBQUssSUFBSSxJQUFJLElBQUksR0FBRyxFQUFFOzs7S0FHckI7R0FDRjtDQUNGLENBQUE7O3FCQUVjLE1BQU0iLCJmaWxlIjoic3JjL3NlcnZlci9sb2dnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYnVueWFuIGZyb20gJ2J1bnlhbic7XG5cbi8vIEBUT0RPIGFsbG93IGNvbmZpZ3VyYXRpb25cbmZ1bmN0aW9uIHNvY2tldFNlcmlhbGl6ZXIoc29ja2V0KSB7XG4gIHJldHVybiB7IGlkOiBzb2NrZXQuaWQgfTtcbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jb25zdCBsb2dnZXIgPSB7XG4gIGluaXRpYWxpemUoY29uZmlnKSB7XG4gICAgY29uZmlnLnNlcmlhbGl6ZXJzID0ge1xuICAgICAgc29ja2V0OiBzb2NrZXRTZXJpYWxpemVyXG4gICAgfTtcblxuICAgIGNvbnN0IGxvZyA9IGJ1bnlhbi5jcmVhdGVMb2dnZXIoY29uZmlnKTtcbiAgICBmb3IgKGxldCBhdHRyIGluIGxvZykge1xuICAgICAgLy8gY29uc29sZS5sb2coYXR0ciwgbG9nW2F0dHJdKTtcbiAgICAgIC8vIHRoaXNbYXR0cl0gPSBsb2dbYXR0cl0uYmluZChsb2cpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBsb2dnZXI7XG4iXX0=