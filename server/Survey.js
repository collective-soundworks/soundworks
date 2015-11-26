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

var _Module2 = require('./Module');

var _Module3 = _interopRequireDefault(_Module2);

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

var Survey = (function (_Module) {
  _inherits(Survey, _Module);

  function Survey() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Survey);

    _get(Object.getPrototypeOf(Survey.prototype), 'constructor', this).call(this, options.name || 'survey');
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

  _createClass(Survey, [{
    key: 'connect',
    value: function connect(client) {
      _get(Object.getPrototypeOf(Survey.prototype), 'connect', this).call(this, client);

      client.receive(this.name + ':answers', this._appendToFile);
    }
  }, {
    key: 'disconnect',
    value: function disconnect(client) {
      _get(Object.getPrototypeOf(Survey.prototype), 'disconnect', this).call(this, client);
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

  return Survey;
})(_Module3['default']);

exports['default'] = Survey;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU3VydmV5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7a0JBQWUsSUFBSTs7Ozt1QkFDQSxVQUFVOzs7O0FBRzdCLFNBQVMsT0FBTyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQ25DLEtBQUcsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ2YsU0FBTyxHQUFHLENBQUMsTUFBTSxHQUFHLE1BQU0sRUFBRTtBQUFFLE9BQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDO0dBQUU7QUFDbEQsU0FBTyxHQUFHLENBQUM7Q0FDWjs7Ozs7O0lBS29CLE1BQU07WUFBTixNQUFNOztBQUNkLFdBRFEsTUFBTSxHQUNDO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFETCxNQUFNOztBQUV2QiwrQkFGaUIsTUFBTSw2Q0FFakIsT0FBTyxDQUFDLElBQUksSUFBSSxRQUFRLEVBQUU7O0FBRWhDLFFBQU0sR0FBRyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7QUFDdkIsUUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDOUMsUUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2hELFFBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3pDLFFBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzNDLFFBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2hELFFBQU0sUUFBUSxlQUFhLElBQUksU0FBSSxLQUFLLFNBQUksR0FBRyxTQUFJLElBQUksU0FBSSxPQUFPLEFBQUUsQ0FBQzs7O0FBR3JFLFFBQUksQ0FBQyxRQUFRLEdBQU0sT0FBTyxDQUFDLEdBQUcsRUFBRSxpQkFBWSxRQUFRLEFBQUUsQ0FBQztBQUN2RCxRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQ3BEOztlQWZrQixNQUFNOztXQWlCbEIsaUJBQUMsTUFBTSxFQUFFO0FBQ2QsaUNBbEJpQixNQUFNLHlDQWtCVCxNQUFNLEVBQUU7O0FBRXRCLFlBQU0sQ0FBQyxPQUFPLENBQUksSUFBSSxDQUFDLElBQUksZUFBWSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7S0FDM0Q7OztXQUVTLG9CQUFDLE1BQU0sRUFBRTtBQUNqQixpQ0F4QmlCLE1BQU0sNENBd0JOLE1BQU0sRUFBRTtLQUMxQjs7O1dBRVksdUJBQUMsSUFBSSxFQUFFOzs7QUFDbEIsc0JBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUssSUFBSSxTQUFNLFVBQUMsR0FBRyxFQUFLO0FBQ2pELFlBQUksR0FBRyxFQUFFO0FBQUUsaUJBQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQUU7QUFDeEMsZUFBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsZUFBZSxHQUFHLE1BQUssUUFBUSxDQUFDLENBQUM7T0FDckQsQ0FBQyxDQUFDO0tBQ0o7OztTQWhDa0IsTUFBTTs7O3FCQUFOLE1BQU0iLCJmaWxlIjoic3JjL3NlcnZlci9TdXJ2ZXkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IE1vZHVsZSBmcm9tICcuL01vZHVsZSc7XG5cblxuZnVuY3Rpb24gcGFkTGVmdChzdHIsIHZhbHVlLCBsZW5ndGgpIHtcbiAgc3RyID0gc3RyICsgJyc7XG4gIHdoaWxlIChzdHIubGVuZ3RoIDwgbGVuZ3RoKSB7IHN0ciA9IHZhbHVlICsgc3RyOyB9XG4gIHJldHVybiBzdHI7XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3VydmV5IGV4dGVuZHMgTW9kdWxlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8wqAnc3VydmV5Jyk7XG4gICAgLy8gcHJlcGFyZSBmaWxlIG5hbWVcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IHllYXIgPSBwYWRMZWZ0KG5vdy5nZXRGdWxsWWVhcigpLCAwLCAyKTtcbiAgICBjb25zdCBtb250aCA9IHBhZExlZnQobm93LmdldE1vbnRoKCkgKyAxLCAwLCAyKTtcbiAgICBjb25zdCBkYXkgPSBwYWRMZWZ0KG5vdy5nZXREYXRlKCksIDAsIDIpO1xuICAgIGNvbnN0IGhvdXIgPSBwYWRMZWZ0KG5vdy5nZXRIb3VycygpLCAwLCAyKTtcbiAgICBjb25zdCBtaW51dGVzID0gcGFkTGVmdChub3cuZ2V0TWludXRlcygpLCAwLCAyKTtcbiAgICBjb25zdCBmaWxlTmFtZSA9IGBzdXJ2ZXktJHt5ZWFyfS0ke21vbnRofS0ke2RheX1fJHtob3VyfS0ke21pbnV0ZXN9YDtcblxuICAgIC8vIEBUT0RPIGFsbG93IHRvIGNoYW5nZSBmb2xkZXIgbmFtZSAoYWthIGBzdXJ2ZXlzYClcbiAgICB0aGlzLmZpbGVQYXRoID0gYCR7cHJvY2Vzcy5jd2QoKX0vc3VydmV5cy8ke2ZpbGVOYW1lfWA7XG4gICAgdGhpcy5fYXBwZW5kVG9GaWxlID0gdGhpcy5fYXBwZW5kVG9GaWxlLmJpbmQodGhpcyk7XG4gIH1cblxuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIGNsaWVudC5yZWNlaXZlKGAke3RoaXMubmFtZX06YW5zd2Vyc2AsIHRoaXMuX2FwcGVuZFRvRmlsZSlcbiAgfVxuXG4gIGRpc2Nvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuZGlzY29ubmVjdChjbGllbnQpO1xuICB9XG5cbiAgX2FwcGVuZFRvRmlsZShqc29uKSB7XG4gICAgZnMuYXBwZW5kRmlsZSh0aGlzLmZpbGVQYXRoLCBgJHtqc29ufVxcbmAsIChlcnIpID0+IHtcbiAgICAgIGlmIChlcnIpIHsgY29uc29sZS5lcnJvcihlcnIubWVzc2FnZSk7IH1cbiAgICAgIGNvbnNvbGUubG9nKGpzb24gKyAnIGFwcGVuZGVkIHRvICcgKyB0aGlzLmZpbGVQYXRoKTtcbiAgICB9KTtcbiAgfVxufVxuIl19