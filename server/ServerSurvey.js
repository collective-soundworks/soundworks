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
    this.filePath = options.folder || process.cwd() + '/surveys/' + fileName;
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

      console.log(json);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU2VydmVyU3VydmV5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7a0JBQWUsSUFBSTs7Ozs2QkFDTSxnQkFBZ0I7Ozs7QUFHekMsU0FBUyxPQUFPLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUU7QUFDbkMsS0FBRyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDZixTQUFPLEdBQUcsQ0FBQyxNQUFNLEdBQUcsTUFBTSxFQUFFO0FBQUUsT0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLENBQUM7R0FBRTtBQUNsRCxTQUFPLEdBQUcsQ0FBQztDQUNaOzs7Ozs7SUFLb0IsWUFBWTtZQUFaLFlBQVk7O0FBQ3BCLFdBRFEsWUFBWSxHQUNMO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFETCxZQUFZOztBQUU3QiwrQkFGaUIsWUFBWSw2Q0FFdkIsT0FBTyxDQUFDLElBQUksSUFBSSxRQUFRLEVBQUU7O0FBRWhDLFFBQU0sR0FBRyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7QUFDdkIsUUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDOUMsUUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2hELFFBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3pDLFFBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzNDLFFBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2hELFFBQU0sUUFBUSxlQUFhLElBQUksU0FBSSxLQUFLLFNBQUksR0FBRyxTQUFJLElBQUksU0FBSSxPQUFPLEFBQUUsQ0FBQzs7O0FBR3JFLFFBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBTyxPQUFPLENBQUMsR0FBRyxFQUFFLGlCQUFZLFFBQVEsQUFBRSxDQUFDO0FBQ3pFLFFBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDcEQ7O2VBZmtCLFlBQVk7O1dBaUJ4QixpQkFBQyxNQUFNLEVBQUU7QUFDZCxpQ0FsQmlCLFlBQVkseUNBa0JmLE1BQU0sRUFBRTtBQUN0QixVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFBO0tBQ3BEOzs7V0FFUyxvQkFBQyxNQUFNLEVBQUU7QUFDakIsaUNBdkJpQixZQUFZLDRDQXVCWixNQUFNLEVBQUU7S0FDMUI7OztXQUVZLHVCQUFDLElBQUksRUFBRTs7O0FBQ2xCLGFBQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRWxCLHNCQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFLLElBQUksU0FBTSxVQUFDLEdBQUcsRUFBSztBQUNqRCxZQUFJLEdBQUcsRUFBRTtBQUFFLGlCQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUFFO0FBQ3hDLGVBQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLGVBQWUsR0FBRyxNQUFLLFFBQVEsQ0FBQyxDQUFDO09BQ3JELENBQUMsQ0FBQztLQUNKOzs7U0FqQ2tCLFlBQVk7OztxQkFBWixZQUFZIiwiZmlsZSI6InNyYy9zZXJ2ZXIvU2VydmVyU3VydmV5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBTZXJ2ZXJNb2R1bGUgZnJvbSAnLi9TZXJ2ZXJNb2R1bGUnO1xuXG5cbmZ1bmN0aW9uIHBhZExlZnQoc3RyLCB2YWx1ZSwgbGVuZ3RoKSB7XG4gIHN0ciA9IHN0ciArICcnO1xuICB3aGlsZSAoc3RyLmxlbmd0aCA8IGxlbmd0aCkgeyBzdHIgPSB2YWx1ZSArIHN0cjsgfVxuICByZXR1cm4gc3RyO1xufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlcnZlclN1cnZleSBleHRlbmRzIFNlcnZlck1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fMKgJ3N1cnZleScpO1xuICAgIC8vIHByZXBhcmUgZmlsZSBuYW1lXG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICBjb25zdCB5ZWFyID0gcGFkTGVmdChub3cuZ2V0RnVsbFllYXIoKSwgMCwgMik7XG4gICAgY29uc3QgbW9udGggPSBwYWRMZWZ0KG5vdy5nZXRNb250aCgpICsgMSwgMCwgMik7XG4gICAgY29uc3QgZGF5ID0gcGFkTGVmdChub3cuZ2V0RGF0ZSgpLCAwLCAyKTtcbiAgICBjb25zdCBob3VyID0gcGFkTGVmdChub3cuZ2V0SG91cnMoKSwgMCwgMik7XG4gICAgY29uc3QgbWludXRlcyA9IHBhZExlZnQobm93LmdldE1pbnV0ZXMoKSwgMCwgMik7XG4gICAgY29uc3QgZmlsZU5hbWUgPSBgc3VydmV5LSR7eWVhcn0tJHttb250aH0tJHtkYXl9XyR7aG91cn0tJHttaW51dGVzfWA7XG5cbiAgICAvLyBAVE9ETyBhbGxvdyB0byBjaGFuZ2UgZm9sZGVyIG5hbWUgKGFrYSBgc3VydmV5c2ApXG4gICAgdGhpcy5maWxlUGF0aCA9IG9wdGlvbnMuZm9sZGVyIHx8wqBgJHtwcm9jZXNzLmN3ZCgpfS9zdXJ2ZXlzLyR7ZmlsZU5hbWV9YDtcbiAgICB0aGlzLl9hcHBlbmRUb0ZpbGUgPSB0aGlzLl9hcHBlbmRUb0ZpbGUuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdhbnN3ZXJzJywgdGhpcy5fYXBwZW5kVG9GaWxlKVxuICB9XG5cbiAgZGlzY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5kaXNjb25uZWN0KGNsaWVudCk7XG4gIH1cblxuICBfYXBwZW5kVG9GaWxlKGpzb24pIHtcbiAgICBjb25zb2xlLmxvZyhqc29uKTtcblxuICAgIGZzLmFwcGVuZEZpbGUodGhpcy5maWxlUGF0aCwgYCR7anNvbn1cXG5gLCAoZXJyKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7IGNvbnNvbGUuZXJyb3IoZXJyLm1lc3NhZ2UpOyB9XG4gICAgICBjb25zb2xlLmxvZyhqc29uICsgJyBhcHBlbmRlZCB0byAnICsgdGhpcy5maWxlUGF0aCk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==