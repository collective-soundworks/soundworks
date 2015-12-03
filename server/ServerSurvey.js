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

var ServerSurvey = (function (_Module) {
  _inherits(ServerSurvey, _Module);

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
})(_Module3['default']);

exports['default'] = ServerSurvey;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU2VydmVyU3VydmV5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7a0JBQWUsSUFBSTs7Ozt1QkFDQSxVQUFVOzs7O0FBRzdCLFNBQVMsT0FBTyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQ25DLEtBQUcsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ2YsU0FBTyxHQUFHLENBQUMsTUFBTSxHQUFHLE1BQU0sRUFBRTtBQUFFLE9BQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDO0dBQUU7QUFDbEQsU0FBTyxHQUFHLENBQUM7Q0FDWjs7Ozs7O0lBS29CLFlBQVk7WUFBWixZQUFZOztBQUNwQixXQURRLFlBQVksR0FDTDtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBREwsWUFBWTs7QUFFN0IsK0JBRmlCLFlBQVksNkNBRXZCLE9BQU8sQ0FBQyxJQUFJLElBQUksUUFBUSxFQUFFOztBQUVoQyxRQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO0FBQ3ZCLFFBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzlDLFFBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNoRCxRQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN6QyxRQUFNLElBQUksR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMzQyxRQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNoRCxRQUFNLFFBQVEsZUFBYSxJQUFJLFNBQUksS0FBSyxTQUFJLEdBQUcsU0FBSSxJQUFJLFNBQUksT0FBTyxBQUFFLENBQUM7OztBQUdyRSxRQUFJLENBQUMsUUFBUSxHQUFNLE9BQU8sQ0FBQyxHQUFHLEVBQUUsaUJBQVksUUFBUSxBQUFFLENBQUM7QUFDdkQsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUNwRDs7ZUFma0IsWUFBWTs7V0FpQnhCLGlCQUFDLE1BQU0sRUFBRTtBQUNkLGlDQWxCaUIsWUFBWSx5Q0FrQmYsTUFBTSxFQUFFOztBQUV0QixVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFBO0tBQ3BEOzs7V0FFUyxvQkFBQyxNQUFNLEVBQUU7QUFDakIsaUNBeEJpQixZQUFZLDRDQXdCWixNQUFNLEVBQUU7S0FDMUI7OztXQUVZLHVCQUFDLElBQUksRUFBRTs7O0FBQ2xCLHNCQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFLLElBQUksU0FBTSxVQUFDLEdBQUcsRUFBSztBQUNqRCxZQUFJLEdBQUcsRUFBRTtBQUFFLGlCQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUFFO0FBQ3hDLGVBQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLGVBQWUsR0FBRyxNQUFLLFFBQVEsQ0FBQyxDQUFDO09BQ3JELENBQUMsQ0FBQztLQUNKOzs7U0FoQ2tCLFlBQVk7OztxQkFBWixZQUFZIiwiZmlsZSI6InNyYy9zZXJ2ZXIvU2VydmVyU3VydmV5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBNb2R1bGUgZnJvbSAnLi9Nb2R1bGUnO1xuXG5cbmZ1bmN0aW9uIHBhZExlZnQoc3RyLCB2YWx1ZSwgbGVuZ3RoKSB7XG4gIHN0ciA9IHN0ciArICcnO1xuICB3aGlsZSAoc3RyLmxlbmd0aCA8IGxlbmd0aCkgeyBzdHIgPSB2YWx1ZSArIHN0cjsgfVxuICByZXR1cm4gc3RyO1xufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlcnZlclN1cnZleSBleHRlbmRzIE1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fMKgJ3N1cnZleScpO1xuICAgIC8vIHByZXBhcmUgZmlsZSBuYW1lXG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICBjb25zdCB5ZWFyID0gcGFkTGVmdChub3cuZ2V0RnVsbFllYXIoKSwgMCwgMik7XG4gICAgY29uc3QgbW9udGggPSBwYWRMZWZ0KG5vdy5nZXRNb250aCgpICsgMSwgMCwgMik7XG4gICAgY29uc3QgZGF5ID0gcGFkTGVmdChub3cuZ2V0RGF0ZSgpLCAwLCAyKTtcbiAgICBjb25zdCBob3VyID0gcGFkTGVmdChub3cuZ2V0SG91cnMoKSwgMCwgMik7XG4gICAgY29uc3QgbWludXRlcyA9IHBhZExlZnQobm93LmdldE1pbnV0ZXMoKSwgMCwgMik7XG4gICAgY29uc3QgZmlsZU5hbWUgPSBgc3VydmV5LSR7eWVhcn0tJHttb250aH0tJHtkYXl9XyR7aG91cn0tJHttaW51dGVzfWA7XG5cbiAgICAvLyBAVE9ETyBhbGxvdyB0byBjaGFuZ2UgZm9sZGVyIG5hbWUgKGFrYSBgc3VydmV5c2ApXG4gICAgdGhpcy5maWxlUGF0aCA9IGAke3Byb2Nlc3MuY3dkKCl9L3N1cnZleXMvJHtmaWxlTmFtZX1gO1xuICAgIHRoaXMuX2FwcGVuZFRvRmlsZSA9IHRoaXMuX2FwcGVuZFRvRmlsZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAnYW5zd2VycycsIHRoaXMuX2FwcGVuZFRvRmlsZSlcbiAgfVxuXG4gIGRpc2Nvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuZGlzY29ubmVjdChjbGllbnQpO1xuICB9XG5cbiAgX2FwcGVuZFRvRmlsZShqc29uKSB7XG4gICAgZnMuYXBwZW5kRmlsZSh0aGlzLmZpbGVQYXRoLCBgJHtqc29ufVxcbmAsIChlcnIpID0+IHtcbiAgICAgIGlmIChlcnIpIHsgY29uc29sZS5lcnJvcihlcnIubWVzc2FnZSk7IH1cbiAgICAgIGNvbnNvbGUubG9nKGpzb24gKyAnIGFwcGVuZGVkIHRvICcgKyB0aGlzLmZpbGVQYXRoKTtcbiAgICB9KTtcbiAgfVxufVxuIl19