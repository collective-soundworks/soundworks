'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var Calibration = require('calibration/server');
var ServerModule = require('./ServerModule');
// import ServerModule from './ServerModule.es6.js';

var ServerCalibration = (function (_ServerModule) {
  _inherits(ServerCalibration, _ServerModule);

  // export default class ServerCalibration extends ServerModule {
  /**
   * Constructor of the calibration server module.
   *
   * Note that the receive functions are registered by {@linkcode
   * ServerCalibration~connect}.
   *
   * @constructs ServerCalibration
   * @param {Object} [params]
   * @param {Object} [params.persistent]
   * @param {Object} [params.persistent.path='../../data'] where to
   * store the persistent file
   * @param {Object} [params.persistent.file='calibration.json'] name
   * of the persistent file
   */

  function ServerCalibration() {
    var params = arguments.length <= 0 || arguments[0] === undefined ? {
      persistent: {
        path: '../../data',
        file: 'calibration.json'
      } } : arguments[0];

    _classCallCheck(this, ServerCalibration);

    _get(Object.getPrototypeOf(ServerCalibration.prototype), 'constructor', this).call(this, params.name || 'calibration');
    this.calibration = new Calibration({ persistent: params.persistent });
  }

  // class ServerCalibration

  /**
   * Register the receive functions.
   *
   * @function ServerCalibration~connect
   * @param {ServerClient} client
   */

  _createClass(ServerCalibration, [{
    key: 'connect',
    value: function connect(client) {
      _get(Object.getPrototypeOf(ServerCalibration.prototype), 'connect', this).call(this, client);

      this.calibration.start(function (cmd) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        client.send.apply(client, [cmd].concat(args));
      }, function (cmd, callback) {
        client.receive(cmd, callback);
      });
    }
  }]);

  return ServerCalibration;
})(ServerModule);

module.exports = ServerCalibration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvQ2FsaWJyYXRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7Ozs7Ozs7O0FBRWIsSUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDbEQsSUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7OztJQUd6QyxpQkFBaUI7WUFBakIsaUJBQWlCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQlYsV0FoQlAsaUJBQWlCLEdBb0JiO1FBSkksTUFBTSx5REFBRztBQUNuQixnQkFBVSxFQUFFO0FBQ1YsWUFBSSxFQUFFLFlBQVk7QUFDbEIsWUFBSSxFQUFFLGtCQUFrQjtPQUN6QixFQUFFOzswQkFwQkQsaUJBQWlCOztBQXFCakIsK0JBckJBLGlCQUFpQiw2Q0FxQlgsTUFBTSxDQUFDLElBQUksSUFBSSxhQUFhLEVBQUU7QUFDcEMsUUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLFdBQVcsQ0FBRSxFQUFFLFVBQVUsRUFBRSxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztHQUMxRTs7Ozs7Ozs7Ozs7ZUF2QkcsaUJBQWlCOztXQStCZCxpQkFBQyxNQUFNLEVBQUU7QUFDZCxpQ0FoQ0UsaUJBQWlCLHlDQWdDTCxNQUFNLEVBQUU7O0FBRXRCLFVBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFFLFVBQUMsR0FBRyxFQUFjOzBDQUFULElBQUk7QUFBSixjQUFJOzs7QUFBTyxjQUFNLENBQUMsSUFBSSxNQUFBLENBQVgsTUFBTSxHQUFNLEdBQUcsU0FBSyxJQUFJLEVBQUMsQ0FBQztPQUFFLEVBQ2hELFVBQUMsR0FBRyxFQUFFLFFBQVEsRUFBSztBQUFFLGNBQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO09BQUUsQ0FBRSxDQUFDO0tBQ2pGOzs7U0FwQ0csaUJBQWlCO0dBQVMsWUFBWTs7QUF3QzVDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsaUJBQWlCLENBQUMiLCJmaWxlIjoic3JjL3NlcnZlci9DYWxpYnJhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuY29uc3QgQ2FsaWJyYXRpb24gPSByZXF1aXJlKCdjYWxpYnJhdGlvbi9zZXJ2ZXInKTtcbmNvbnN0IFNlcnZlck1vZHVsZSA9IHJlcXVpcmUoJy4vU2VydmVyTW9kdWxlJyk7XG4vLyBpbXBvcnQgU2VydmVyTW9kdWxlIGZyb20gJy4vU2VydmVyTW9kdWxlLmVzNi5qcyc7XG5cbmNsYXNzIFNlcnZlckNhbGlicmF0aW9uIGV4dGVuZHMgU2VydmVyTW9kdWxlIHtcbi8vIGV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlcnZlckNhbGlicmF0aW9uIGV4dGVuZHMgU2VydmVyTW9kdWxlIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIG9mIHRoZSBjYWxpYnJhdGlvbiBzZXJ2ZXIgbW9kdWxlLlxuICAgKlxuICAgKiBOb3RlIHRoYXQgdGhlIHJlY2VpdmUgZnVuY3Rpb25zIGFyZSByZWdpc3RlcmVkIGJ5IHtAbGlua2NvZGVcbiAgICogU2VydmVyQ2FsaWJyYXRpb25+Y29ubmVjdH0uXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RzIFNlcnZlckNhbGlicmF0aW9uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbcGFyYW1zXVxuICAgKiBAcGFyYW0ge09iamVjdH0gW3BhcmFtcy5wZXJzaXN0ZW50XVxuICAgKiBAcGFyYW0ge09iamVjdH0gW3BhcmFtcy5wZXJzaXN0ZW50LnBhdGg9Jy4uLy4uL2RhdGEnXSB3aGVyZSB0b1xuICAgKiBzdG9yZSB0aGUgcGVyc2lzdGVudCBmaWxlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbcGFyYW1zLnBlcnNpc3RlbnQuZmlsZT0nY2FsaWJyYXRpb24uanNvbiddIG5hbWVcbiAgICogb2YgdGhlIHBlcnNpc3RlbnQgZmlsZVxuICAgKi9cbiAgY29uc3RydWN0b3IocGFyYW1zID0ge1xuICAgIHBlcnNpc3RlbnQ6IHtcbiAgICAgIHBhdGg6ICcuLi8uLi9kYXRhJyxcbiAgICAgIGZpbGU6ICdjYWxpYnJhdGlvbi5qc29uJ1xuICAgIH0gfSApIHtcbiAgICAgIHN1cGVyKHBhcmFtcy5uYW1lIHx8ICdjYWxpYnJhdGlvbicpO1xuICAgICAgdGhpcy5jYWxpYnJhdGlvbiA9IG5ldyBDYWxpYnJhdGlvbiggeyBwZXJzaXN0ZW50OiBwYXJhbXMucGVyc2lzdGVudCB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciB0aGUgcmVjZWl2ZSBmdW5jdGlvbnMuXG4gICAqXG4gICAqIEBmdW5jdGlvbiBTZXJ2ZXJDYWxpYnJhdGlvbn5jb25uZWN0XG4gICAqIEBwYXJhbSB7U2VydmVyQ2xpZW50fSBjbGllbnRcbiAgICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgdGhpcy5jYWxpYnJhdGlvbi5zdGFydCggKGNtZCwgLi4uYXJncykgPT4geyBjbGllbnQuc2VuZChjbWQsIC4uLmFyZ3MpOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjbWQsIGNhbGxiYWNrKSA9PiB7IGNsaWVudC5yZWNlaXZlKGNtZCwgY2FsbGJhY2spOyB9ICk7XG4gIH1cblxufSAvLyBjbGFzcyBTZXJ2ZXJDYWxpYnJhdGlvblxuXG5tb2R1bGUuZXhwb3J0cyA9IFNlcnZlckNhbGlicmF0aW9uO1xuIl19