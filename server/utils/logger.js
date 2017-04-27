'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @TODO allow configuration
function socketSerializer(socket) {
  return { id: socket.id };
}

/**
 * @private
 */
var logger = {
  init: function init(config) {
    if (!config.serializers) config.serializers = {};

    (0, _assign2.default)(config.serializers, {
      socket: socketSerializer
    });

    var log = _bunyan2.default.createLogger(config);

    for (var attr in log) {
      var method = log[attr];
      if (typeof method === 'function') {
        this[attr] = log[attr].bind(log);
      }
    }
  }
};

exports.default = logger;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvZ2dlci5qcyJdLCJuYW1lcyI6WyJzb2NrZXRTZXJpYWxpemVyIiwic29ja2V0IiwiaWQiLCJsb2dnZXIiLCJpbml0IiwiY29uZmlnIiwic2VyaWFsaXplcnMiLCJsb2ciLCJjcmVhdGVMb2dnZXIiLCJhdHRyIiwibWV0aG9kIiwiYmluZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFFQTtBQUNBLFNBQVNBLGdCQUFULENBQTBCQyxNQUExQixFQUFrQztBQUNoQyxTQUFPLEVBQUVDLElBQUlELE9BQU9DLEVBQWIsRUFBUDtBQUNEOztBQUVEOzs7QUFHQSxJQUFNQyxTQUFTO0FBQ2JDLE1BRGEsZ0JBQ1JDLE1BRFEsRUFDQTtBQUNYLFFBQUksQ0FBQ0EsT0FBT0MsV0FBWixFQUNFRCxPQUFPQyxXQUFQLEdBQXFCLEVBQXJCOztBQUVGLDBCQUFjRCxPQUFPQyxXQUFyQixFQUFrQztBQUNoQ0wsY0FBUUQ7QUFEd0IsS0FBbEM7O0FBSUEsUUFBTU8sTUFBTSxpQkFBT0MsWUFBUCxDQUFvQkgsTUFBcEIsQ0FBWjs7QUFFQSxTQUFLLElBQUlJLElBQVQsSUFBaUJGLEdBQWpCLEVBQXNCO0FBQ3BCLFVBQU1HLFNBQVNILElBQUlFLElBQUosQ0FBZjtBQUNBLFVBQUksT0FBT0MsTUFBUCxLQUFrQixVQUF0QixFQUFrQztBQUNoQyxhQUFLRCxJQUFMLElBQWFGLElBQUlFLElBQUosRUFBVUUsSUFBVixDQUFlSixHQUFmLENBQWI7QUFDRDtBQUNGO0FBQ0Y7QUFqQlksQ0FBZjs7a0JBb0JlSixNIiwiZmlsZSI6ImxvZ2dlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBidW55YW4gZnJvbSAnYnVueWFuJztcblxuLy8gQFRPRE8gYWxsb3cgY29uZmlndXJhdGlvblxuZnVuY3Rpb24gc29ja2V0U2VyaWFsaXplcihzb2NrZXQpIHtcbiAgcmV0dXJuIHsgaWQ6IHNvY2tldC5pZCB9O1xufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmNvbnN0IGxvZ2dlciA9IHtcbiAgaW5pdChjb25maWcpIHtcbiAgICBpZiAoIWNvbmZpZy5zZXJpYWxpemVycylcbiAgICAgIGNvbmZpZy5zZXJpYWxpemVycyA9IHt9O1xuXG4gICAgT2JqZWN0LmFzc2lnbihjb25maWcuc2VyaWFsaXplcnMsIHtcbiAgICAgIHNvY2tldDogc29ja2V0U2VyaWFsaXplclxuICAgIH0pO1xuXG4gICAgY29uc3QgbG9nID0gYnVueWFuLmNyZWF0ZUxvZ2dlcihjb25maWcpO1xuXG4gICAgZm9yIChsZXQgYXR0ciBpbiBsb2cpIHtcbiAgICAgIGNvbnN0IG1ldGhvZCA9IGxvZ1thdHRyXTtcbiAgICAgIGlmICh0eXBlb2YgbWV0aG9kID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXNbYXR0cl0gPSBsb2dbYXR0cl0uYmluZChsb2cpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBsb2dnZXI7XG4iXX0=