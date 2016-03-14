'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Configuration parameters of the Soundworks framework.
 * These parameters allow for configuring components of the framework such as Express and SocketIO.
 */
exports.default = {
  useHttps: false,
  publicFolder: _path2.default.join(process.cwd(), 'public'),
  templateFolder: _path2.default.join(process.cwd(), 'html'),
  defaultClient: 'player',
  assetsDomain: '', // override to download assets from a different serveur (nginx)
  socketIO: {
    url: '',
    transports: ['websocket'],
    pingTimeout: 60000, // configure client side too ?
    pingInterval: 50000 },
  // configure client side too ?
  // @note: EngineIO defaults
  // pingTimeout: 3000,
  // pingInterval: 1000,
  // upgradeTimeout: 10000,
  // maxHttpBufferSize: 10E7,
  errorReporterDirectory: 'logs/clients',
  dbDirectory: 'db'
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZ3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7Ozs7Ozs7O2tCQU1lO0FBQ2IsWUFBVSxLQUFWO0FBQ0EsZ0JBQWMsZUFBSyxJQUFMLENBQVUsUUFBUSxHQUFSLEVBQVYsRUFBeUIsUUFBekIsQ0FBZDtBQUNBLGtCQUFnQixlQUFLLElBQUwsQ0FBVSxRQUFRLEdBQVIsRUFBVixFQUF5QixNQUF6QixDQUFoQjtBQUNBLGlCQUFlLFFBQWY7QUFDQSxnQkFBYyxFQUFkO0FBQ0EsWUFBVTtBQUNSLFNBQUssRUFBTDtBQUNBLGdCQUFZLENBQUMsV0FBRCxDQUFaO0FBQ0EsaUJBQWEsS0FBYjtBQUNBLGtCQUFjLEtBQWQsRUFKRjs7Ozs7OztBQVdBLDBCQUF3QixjQUF4QjtBQUNBLGVBQWEsSUFBYiIsImZpbGUiOiJmdy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gcGFyYW1ldGVycyBvZiB0aGUgU291bmR3b3JrcyBmcmFtZXdvcmsuXG4gKiBUaGVzZSBwYXJhbWV0ZXJzIGFsbG93IGZvciBjb25maWd1cmluZyBjb21wb25lbnRzIG9mIHRoZSBmcmFtZXdvcmsgc3VjaCBhcyBFeHByZXNzIGFuZCBTb2NrZXRJTy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuICB1c2VIdHRwczogZmFsc2UsXG4gIHB1YmxpY0ZvbGRlcjogcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdwdWJsaWMnKSxcbiAgdGVtcGxhdGVGb2xkZXI6IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnaHRtbCcpLFxuICBkZWZhdWx0Q2xpZW50OiAncGxheWVyJyxcbiAgYXNzZXRzRG9tYWluOiAnJywgLy8gb3ZlcnJpZGUgdG8gZG93bmxvYWQgYXNzZXRzIGZyb20gYSBkaWZmZXJlbnQgc2VydmV1ciAobmdpbngpXG4gIHNvY2tldElPOiB7XG4gICAgdXJsOiAnJyxcbiAgICB0cmFuc3BvcnRzOiBbJ3dlYnNvY2tldCddLFxuICAgIHBpbmdUaW1lb3V0OiA2MDAwMCwgLy8gY29uZmlndXJlIGNsaWVudCBzaWRlIHRvbyA/XG4gICAgcGluZ0ludGVydmFsOiA1MDAwMCwgLy8gY29uZmlndXJlIGNsaWVudCBzaWRlIHRvbyA/XG4gICAgLy8gQG5vdGU6IEVuZ2luZUlPIGRlZmF1bHRzXG4gICAgLy8gcGluZ1RpbWVvdXQ6IDMwMDAsXG4gICAgLy8gcGluZ0ludGVydmFsOiAxMDAwLFxuICAgIC8vIHVwZ3JhZGVUaW1lb3V0OiAxMDAwMCxcbiAgICAvLyBtYXhIdHRwQnVmZmVyU2l6ZTogMTBFNyxcbiAgfSxcbiAgZXJyb3JSZXBvcnRlckRpcmVjdG9yeTogJ2xvZ3MvY2xpZW50cycsXG4gIGRiRGlyZWN0b3J5OiAnZGInLFxufTtcbiJdfQ==