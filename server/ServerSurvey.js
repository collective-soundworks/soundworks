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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvY29tbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O2tCQUFlLElBQUk7Ozs7NkJBQ00sZ0JBQWdCOzs7O0FBR3pDLFNBQVMsT0FBTyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQ25DLEtBQUcsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ2YsU0FBTyxHQUFHLENBQUMsTUFBTSxHQUFHLE1BQU0sRUFBRTtBQUFFLE9BQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDO0dBQUU7QUFDbEQsU0FBTyxHQUFHLENBQUM7Q0FDWjs7Ozs7O0lBS29CLFlBQVk7WUFBWixZQUFZOztBQUNwQixXQURRLFlBQVksR0FDTDtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBREwsWUFBWTs7QUFFN0IsK0JBRmlCLFlBQVksNkNBRXZCLE9BQU8sQ0FBQyxJQUFJLElBQUksUUFBUSxFQUFFOztBQUVoQyxRQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO0FBQ3ZCLFFBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzlDLFFBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNoRCxRQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN6QyxRQUFNLElBQUksR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMzQyxRQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNoRCxRQUFNLFFBQVEsZUFBYSxJQUFJLFNBQUksS0FBSyxTQUFJLEdBQUcsU0FBSSxJQUFJLFNBQUksT0FBTyxBQUFFLENBQUM7OztBQUdyRSxRQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQU8sT0FBTyxDQUFDLEdBQUcsRUFBRSxpQkFBWSxRQUFRLEFBQUUsQ0FBQztBQUN6RSxRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQ3BEOztlQWZrQixZQUFZOztXQWlCeEIsaUJBQUMsTUFBTSxFQUFFO0FBQ2QsaUNBbEJpQixZQUFZLHlDQWtCZixNQUFNLEVBQUU7QUFDdEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQTtLQUNwRDs7O1dBRVMsb0JBQUMsTUFBTSxFQUFFO0FBQ2pCLGlDQXZCaUIsWUFBWSw0Q0F1QlosTUFBTSxFQUFFO0tBQzFCOzs7V0FFWSx1QkFBQyxJQUFJLEVBQUU7OztBQUNsQixhQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVsQixzQkFBRyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBSyxJQUFJLFNBQU0sVUFBQyxHQUFHLEVBQUs7QUFDakQsWUFBSSxHQUFHLEVBQUU7QUFBRSxpQkFBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7U0FBRTtBQUN4QyxlQUFPLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxlQUFlLEdBQUcsTUFBSyxRQUFRLENBQUMsQ0FBQztPQUNyRCxDQUFDLENBQUM7S0FDSjs7O1NBakNrQixZQUFZOzs7cUJBQVosWUFBWSIsImZpbGUiOiJzcmMvc2VydmVyL2NvbW0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IFNlcnZlck1vZHVsZSBmcm9tICcuL1NlcnZlck1vZHVsZSc7XG5cblxuZnVuY3Rpb24gcGFkTGVmdChzdHIsIHZhbHVlLCBsZW5ndGgpIHtcbiAgc3RyID0gc3RyICsgJyc7XG4gIHdoaWxlIChzdHIubGVuZ3RoIDwgbGVuZ3RoKSB7IHN0ciA9IHZhbHVlICsgc3RyOyB9XG4gIHJldHVybiBzdHI7XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmVyU3VydmV5IGV4dGVuZHMgU2VydmVyTW9kdWxlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8wqAnc3VydmV5Jyk7XG4gICAgLy8gcHJlcGFyZSBmaWxlIG5hbWVcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IHllYXIgPSBwYWRMZWZ0KG5vdy5nZXRGdWxsWWVhcigpLCAwLCAyKTtcbiAgICBjb25zdCBtb250aCA9IHBhZExlZnQobm93LmdldE1vbnRoKCkgKyAxLCAwLCAyKTtcbiAgICBjb25zdCBkYXkgPSBwYWRMZWZ0KG5vdy5nZXREYXRlKCksIDAsIDIpO1xuICAgIGNvbnN0IGhvdXIgPSBwYWRMZWZ0KG5vdy5nZXRIb3VycygpLCAwLCAyKTtcbiAgICBjb25zdCBtaW51dGVzID0gcGFkTGVmdChub3cuZ2V0TWludXRlcygpLCAwLCAyKTtcbiAgICBjb25zdCBmaWxlTmFtZSA9IGBzdXJ2ZXktJHt5ZWFyfS0ke21vbnRofS0ke2RheX1fJHtob3VyfS0ke21pbnV0ZXN9YDtcblxuICAgIC8vIEBUT0RPIGFsbG93IHRvIGNoYW5nZSBmb2xkZXIgbmFtZSAoYWthIGBzdXJ2ZXlzYClcbiAgICB0aGlzLmZpbGVQYXRoID0gb3B0aW9ucy5mb2xkZXIgfHzCoGAke3Byb2Nlc3MuY3dkKCl9L3N1cnZleXMvJHtmaWxlTmFtZX1gO1xuICAgIHRoaXMuX2FwcGVuZFRvRmlsZSA9IHRoaXMuX2FwcGVuZFRvRmlsZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ2Fuc3dlcnMnLCB0aGlzLl9hcHBlbmRUb0ZpbGUpXG4gIH1cblxuICBkaXNjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmRpc2Nvbm5lY3QoY2xpZW50KTtcbiAgfVxuXG4gIF9hcHBlbmRUb0ZpbGUoanNvbikge1xuICAgIGNvbnNvbGUubG9nKGpzb24pO1xuXG4gICAgZnMuYXBwZW5kRmlsZSh0aGlzLmZpbGVQYXRoLCBgJHtqc29ufVxcbmAsIChlcnIpID0+IHtcbiAgICAgIGlmIChlcnIpIHsgY29uc29sZS5lcnJvcihlcnIubWVzc2FnZSk7IH1cbiAgICAgIGNvbnNvbGUubG9nKGpzb24gKyAnIGFwcGVuZGVkIHRvICcgKyB0aGlzLmZpbGVQYXRoKTtcbiAgICB9KTtcbiAgfVxufVxuIl19