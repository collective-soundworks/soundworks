'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _ServerModule2 = require('./ServerModule');

var _ServerModule3 = _interopRequireDefault(_ServerModule2);

function padLeft(str, value, length) {
  str = str + '';
  while (str.length < length) {
    str = value + str;
  }
  return str;
}

/**
 * @private
 */

var ServerSurvey = (function (_ServerModule) {
  _inherits(ServerSurvey, _ServerModule);

  function ServerSurvey() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ServerSurvey);

    _get(Object.getPrototypeOf(ServerSurvey.prototype), 'constructor', this).call(this, options.name || 'survey');
    // prepare file name
    var now = new Date();
    var year = padLeft(now.getFullYear(), 0, 2);
    var month = padLeft(now.getMonth() + 1, 0, 2);
    var day = padLeft(now.getDate(), 0, 2);
    var hour = padLeft(now.getHours(), 0, 2);
    var minutes = padLeft(now.getMinutes(), 0, 2);
    var fileName = 'survey-' + year + '-' + month + '-' + day + '_' + hour + '-' + minutes;

    // @TODO allow to change folder name (aka `surveys`)
    this.filePath = process.cwd() + '/surveys/' + fileName;
    this._appendToFile = this._appendToFile.bind(this);
  }

  _createClass(ServerSurvey, [{
    key: 'connect',
    value: function connect(client) {
      _get(Object.getPrototypeOf(ServerSurvey.prototype), 'connect', this).call(this, client);

      this.receive(client, 'answers', this._appendToFile);
    }
  }, {
    key: 'disconnect',
    value: function disconnect(client) {
      _get(Object.getPrototypeOf(ServerSurvey.prototype), 'disconnect', this).call(this, client);
    }
  }, {
    key: '_appendToFile',
    value: function _appendToFile(json) {
      var _this = this;

      _fs2['default'].appendFile(this.filePath, json + '\n', function (err) {
        if (err) {
          console.error(err.message);
        }
        console.log(json + ' appended to ' + _this.filePath);
      });
    }
  }]);

  return ServerSurvey;
})(_ServerModule3['default']);

exports['default'] = ServerSurvey;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU2VydmVyU3VydmV5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7a0JBQWUsSUFBSTs7Ozs2QkFDTSxnQkFBZ0I7Ozs7QUFHekMsU0FBUyxPQUFPLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUU7QUFDbkMsS0FBRyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDZixTQUFPLEdBQUcsQ0FBQyxNQUFNLEdBQUcsTUFBTSxFQUFFO0FBQUUsT0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLENBQUM7R0FBRTtBQUNsRCxTQUFPLEdBQUcsQ0FBQztDQUNaOzs7Ozs7SUFLb0IsWUFBWTtZQUFaLFlBQVk7O0FBQ3BCLFdBRFEsWUFBWSxHQUNMO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFETCxZQUFZOztBQUU3QiwrQkFGaUIsWUFBWSw2Q0FFdkIsT0FBTyxDQUFDLElBQUksSUFBSSxRQUFRLEVBQUU7O0FBRWhDLFFBQU0sR0FBRyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7QUFDdkIsUUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDOUMsUUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2hELFFBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3pDLFFBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzNDLFFBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2hELFFBQU0sUUFBUSxlQUFhLElBQUksU0FBSSxLQUFLLFNBQUksR0FBRyxTQUFJLElBQUksU0FBSSxPQUFPLEFBQUUsQ0FBQzs7O0FBR3JFLFFBQUksQ0FBQyxRQUFRLEdBQU0sT0FBTyxDQUFDLEdBQUcsRUFBRSxpQkFBWSxRQUFRLEFBQUUsQ0FBQztBQUN2RCxRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQ3BEOztlQWZrQixZQUFZOztXQWlCeEIsaUJBQUMsTUFBTSxFQUFFO0FBQ2QsaUNBbEJpQixZQUFZLHlDQWtCZixNQUFNLEVBQUU7O0FBRXRCLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7S0FDcEQ7OztXQUVTLG9CQUFDLE1BQU0sRUFBRTtBQUNqQixpQ0F4QmlCLFlBQVksNENBd0JaLE1BQU0sRUFBRTtLQUMxQjs7O1dBRVksdUJBQUMsSUFBSSxFQUFFOzs7QUFDbEIsc0JBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUssSUFBSSxTQUFNLFVBQUMsR0FBRyxFQUFLO0FBQ2pELFlBQUksR0FBRyxFQUFFO0FBQUUsaUJBQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQUU7QUFDeEMsZUFBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsZUFBZSxHQUFHLE1BQUssUUFBUSxDQUFDLENBQUM7T0FDckQsQ0FBQyxDQUFDO0tBQ0o7OztTQWhDa0IsWUFBWTs7O3FCQUFaLFlBQVkiLCJmaWxlIjoic3JjL3NlcnZlci9TZXJ2ZXJTdXJ2ZXkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IFNlcnZlck1vZHVsZSBmcm9tICcuL1NlcnZlck1vZHVsZSc7XG5cblxuZnVuY3Rpb24gcGFkTGVmdChzdHIsIHZhbHVlLCBsZW5ndGgpIHtcbiAgc3RyID0gc3RyICsgJyc7XG4gIHdoaWxlIChzdHIubGVuZ3RoIDwgbGVuZ3RoKSB7IHN0ciA9IHZhbHVlICsgc3RyOyB9XG4gIHJldHVybiBzdHI7XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmVyU3VydmV5IGV4dGVuZHMgU2VydmVyTW9kdWxlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8wqAnc3VydmV5Jyk7XG4gICAgLy8gcHJlcGFyZSBmaWxlIG5hbWVcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IHllYXIgPSBwYWRMZWZ0KG5vdy5nZXRGdWxsWWVhcigpLCAwLCAyKTtcbiAgICBjb25zdCBtb250aCA9IHBhZExlZnQobm93LmdldE1vbnRoKCkgKyAxLCAwLCAyKTtcbiAgICBjb25zdCBkYXkgPSBwYWRMZWZ0KG5vdy5nZXREYXRlKCksIDAsIDIpO1xuICAgIGNvbnN0IGhvdXIgPSBwYWRMZWZ0KG5vdy5nZXRIb3VycygpLCAwLCAyKTtcbiAgICBjb25zdCBtaW51dGVzID0gcGFkTGVmdChub3cuZ2V0TWludXRlcygpLCAwLCAyKTtcbiAgICBjb25zdCBmaWxlTmFtZSA9IGBzdXJ2ZXktJHt5ZWFyfS0ke21vbnRofS0ke2RheX1fJHtob3VyfS0ke21pbnV0ZXN9YDtcblxuICAgIC8vIEBUT0RPIGFsbG93IHRvIGNoYW5nZSBmb2xkZXIgbmFtZSAoYWthIGBzdXJ2ZXlzYClcbiAgICB0aGlzLmZpbGVQYXRoID0gYCR7cHJvY2Vzcy5jd2QoKX0vc3VydmV5cy8ke2ZpbGVOYW1lfWA7XG4gICAgdGhpcy5fYXBwZW5kVG9GaWxlID0gdGhpcy5fYXBwZW5kVG9GaWxlLmJpbmQodGhpcyk7XG4gIH1cblxuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdhbnN3ZXJzJywgdGhpcy5fYXBwZW5kVG9GaWxlKVxuICB9XG5cbiAgZGlzY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5kaXNjb25uZWN0KGNsaWVudCk7XG4gIH1cblxuICBfYXBwZW5kVG9GaWxlKGpzb24pIHtcbiAgICBmcy5hcHBlbmRGaWxlKHRoaXMuZmlsZVBhdGgsIGAke2pzb259XFxuYCwgKGVycikgPT4ge1xuICAgICAgaWYgKGVycikgeyBjb25zb2xlLmVycm9yKGVyci5tZXNzYWdlKTsgfVxuICAgICAgY29uc29sZS5sb2coanNvbiArICcgYXBwZW5kZWQgdG8gJyArIHRoaXMuZmlsZVBhdGgpO1xuICAgIH0pO1xuICB9XG59XG4iXX0=