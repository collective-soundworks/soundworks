'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var ServerModule = require('./ServerModule');
// import ServerModule from './ServerModule.es6.js';

/**
 * The {@link ServerLocator} module allows to store the coordinates of a client when the user enters an approximate location through the interfacte provided by the {@link ClientLocator}.
 */

var ServerLocator = (function (_ServerModule) {
  _inherits(ServerLocator, _ServerModule);

  // export default class ServerLocator extends ServerModule {
  /**
   * Creates an instance of the class.
   * @param {Object} [options={}] Options.
   * @param {Object} [options.name='locator'] Name of the module.
   * @param {Object} [options.setup] Setup used in the scenario, if any (cf. {@link ServerSetup}).
   */

  function ServerLocator() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ServerLocator);

    _get(Object.getPrototypeOf(ServerLocator.prototype), 'constructor', this).call(this, options.name || 'locator');

    this.setup = options.setup || null;
  }

  /**
   * @private
   */

  _createClass(ServerLocator, [{
    key: 'connect',
    value: function connect(client) {
      var _this = this;

      _get(Object.getPrototypeOf(ServerLocator.prototype), 'connect', this).call(this, client);

      client.receive(this.name + ':request', function () {
        if (_this.setup) {
          var surface = _this.setup.getSurface();
          client.send(_this.name + ':surface', surface);
        } else {
          throw new Error("Locator requires a setup.");
        }
      });

      client.receive(this.name + ':coordinates', function (coordinates) {
        client.coordinates = coordinates;
      });

      client.receive(this.name + ':restart', function (coordinates) {
        client.coordinates = coordinates;
      });
    }
  }]);

  return ServerLocator;
})(ServerModule);

module.exports = ServerLocator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvTG9jYXRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7QUFFYixJQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7Ozs7OztJQU16QyxhQUFhO1lBQWIsYUFBYTs7Ozs7Ozs7OztBQVFOLFdBUlAsYUFBYSxHQVFTO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFScEIsYUFBYTs7QUFTZiwrQkFURSxhQUFhLDZDQVNULE9BQU8sQ0FBQyxJQUFJLElBQUksU0FBUyxFQUFFOztBQUVqQyxRQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDO0dBQ3BDOzs7Ozs7ZUFaRyxhQUFhOztXQWlCVixpQkFBQyxNQUFNLEVBQUU7OztBQUNkLGlDQWxCRSxhQUFhLHlDQWtCRCxNQUFNLEVBQUU7O0FBRXRCLFlBQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLEVBQUUsWUFBTTtBQUMzQyxZQUFJLE1BQUssS0FBSyxFQUFFO0FBQ2QsY0FBSSxPQUFPLEdBQUcsTUFBSyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDdEMsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsTUFBSyxJQUFJLEdBQUcsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQzlDLE1BQU07QUFDTCxnQkFBTSxJQUFJLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1NBQzlDO09BQ0YsQ0FBQyxDQUFDOztBQUVILFlBQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxjQUFjLEVBQUUsVUFBQyxXQUFXLEVBQUs7QUFDMUQsY0FBTSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7T0FDbEMsQ0FBQyxDQUFDOztBQUVILFlBQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLEVBQUUsVUFBQyxXQUFXLEVBQUs7QUFDdEQsY0FBTSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7T0FDbEMsQ0FBQyxDQUFDO0tBQ0o7OztTQXBDRyxhQUFhO0dBQVMsWUFBWTs7QUF1Q3hDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFDIiwiZmlsZSI6InNyYy9zZXJ2ZXIvTG9jYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuY29uc3QgU2VydmVyTW9kdWxlID0gcmVxdWlyZSgnLi9TZXJ2ZXJNb2R1bGUnKTtcbi8vIGltcG9ydCBTZXJ2ZXJNb2R1bGUgZnJvbSAnLi9TZXJ2ZXJNb2R1bGUuZXM2LmpzJztcblxuLyoqXG4gKiBUaGUge0BsaW5rIFNlcnZlckxvY2F0b3J9IG1vZHVsZSBhbGxvd3MgdG8gc3RvcmUgdGhlIGNvb3JkaW5hdGVzIG9mIGEgY2xpZW50IHdoZW4gdGhlIHVzZXIgZW50ZXJzIGFuIGFwcHJveGltYXRlIGxvY2F0aW9uIHRocm91Z2ggdGhlIGludGVyZmFjdGUgcHJvdmlkZWQgYnkgdGhlIHtAbGluayBDbGllbnRMb2NhdG9yfS5cbiAqL1xuY2xhc3MgU2VydmVyTG9jYXRvciBleHRlbmRzIFNlcnZlck1vZHVsZSB7XG4vLyBleHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2ZXJMb2NhdG9yIGV4dGVuZHMgU2VydmVyTW9kdWxlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5uYW1lPSdsb2NhdG9yJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMuc2V0dXBdIFNldHVwIHVzZWQgaW4gdGhlIHNjZW5hcmlvLCBpZiBhbnkgKGNmLiB7QGxpbmsgU2VydmVyU2V0dXB9KS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnbG9jYXRvcicpO1xuXG4gICAgdGhpcy5zZXR1cCA9IG9wdGlvbnMuc2V0dXAgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICBjbGllbnQucmVjZWl2ZSh0aGlzLm5hbWUgKyAnOnJlcXVlc3QnLCAoKSA9PiB7XG4gICAgICBpZiAodGhpcy5zZXR1cCkge1xuICAgICAgICBsZXQgc3VyZmFjZSA9IHRoaXMuc2V0dXAuZ2V0U3VyZmFjZSgpO1xuICAgICAgICBjbGllbnQuc2VuZCh0aGlzLm5hbWUgKyAnOnN1cmZhY2UnLCBzdXJmYWNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkxvY2F0b3IgcmVxdWlyZXMgYSBzZXR1cC5cIik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjbGllbnQucmVjZWl2ZSh0aGlzLm5hbWUgKyAnOmNvb3JkaW5hdGVzJywgKGNvb3JkaW5hdGVzKSA9PiB7XG4gICAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcztcbiAgICB9KTtcblxuICAgIGNsaWVudC5yZWNlaXZlKHRoaXMubmFtZSArICc6cmVzdGFydCcsIChjb29yZGluYXRlcykgPT4ge1xuICAgICAgY2xpZW50LmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XG4gICAgfSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZXJ2ZXJMb2NhdG9yO1xuIl19