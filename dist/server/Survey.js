'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var fs = require('fs');

var ServerModule = require('./ServerModule');
// import ServerModule from './ServerModule.es6.js';

function padLeft(str, value, length) {
  str = str + '';
  while (str.length < length) {
    str = value + str;
  }
  return str;
}

var ServerSurvey = (function (_ServerModule) {
  _inherits(ServerSurvey, _ServerModule);

  // export default class ServerSurvey extends ServerModule {
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

      client.receive(this.name + ':answers', this._appendToFile);
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

      fs.appendFile(this.filePath, json + '\n', function (err) {
        if (err) {
          console.error(err.message);
        }
        console.log(json + ' appended to ' + _this.filePath);
      });
    }
  }]);

  return ServerSurvey;
})(ServerModule);

module.exports = ServerSurvey;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU3VydmV5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXpCLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOzs7QUFHL0MsU0FBUyxPQUFPLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUU7QUFDbkMsS0FBRyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDZixTQUFPLEdBQUcsQ0FBQyxNQUFNLEdBQUcsTUFBTSxFQUFFO0FBQUUsT0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLENBQUM7R0FBRTtBQUNsRCxTQUFPLEdBQUcsQ0FBQztDQUNaOztJQUVLLFlBQVk7WUFBWixZQUFZOzs7QUFFTCxXQUZQLFlBQVksR0FFVTtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBRnBCLFlBQVk7O0FBR2QsK0JBSEUsWUFBWSw2Q0FHUixPQUFPLENBQUMsSUFBSSxJQUFJLFFBQVEsRUFBRTs7QUFFaEMsUUFBTSxHQUFHLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztBQUN2QixRQUFNLElBQUksR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM5QyxRQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDaEQsUUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDekMsUUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDM0MsUUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDaEQsUUFBTSxRQUFRLGVBQWEsSUFBSSxTQUFJLEtBQUssU0FBSSxHQUFHLFNBQUksSUFBSSxTQUFJLE9BQU8sQUFBRSxDQUFDOzs7QUFHckUsUUFBSSxDQUFDLFFBQVEsR0FBTSxPQUFPLENBQUMsR0FBRyxFQUFFLGlCQUFZLFFBQVEsQUFBRSxDQUFDO0FBQ3ZELFFBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDcEQ7O2VBaEJHLFlBQVk7O1dBa0JULGlCQUFDLE1BQU0sRUFBRTtBQUNkLGlDQW5CRSxZQUFZLHlDQW1CQSxNQUFNLEVBQUU7O0FBRXRCLFlBQU0sQ0FBQyxPQUFPLENBQUksSUFBSSxDQUFDLElBQUksZUFBWSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7S0FDM0Q7OztXQUVTLG9CQUFDLE1BQU0sRUFBRTtBQUNqQixpQ0F6QkUsWUFBWSw0Q0F5QkcsTUFBTSxFQUFFO0tBQzFCOzs7V0FFWSx1QkFBQyxJQUFJLEVBQUU7OztBQUNsQixRQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUssSUFBSSxTQUFNLFVBQUMsR0FBRyxFQUFLO0FBQ2pELFlBQUksR0FBRyxFQUFFO0FBQUUsaUJBQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQUU7QUFDeEMsZUFBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsZUFBZSxHQUFHLE1BQUssUUFBUSxDQUFDLENBQUM7T0FDckQsQ0FBQyxDQUFDO0tBQ0o7OztTQWpDRyxZQUFZO0dBQVMsWUFBWTs7QUFvQ3ZDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDIiwiZmlsZSI6InNyYy9zZXJ2ZXIvU3VydmV5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xuXG5jb25zdCBTZXJ2ZXJNb2R1bGUgPSByZXF1aXJlKCcuL1NlcnZlck1vZHVsZScpO1xuLy8gaW1wb3J0IFNlcnZlck1vZHVsZSBmcm9tICcuL1NlcnZlck1vZHVsZS5lczYuanMnO1xuXG5mdW5jdGlvbiBwYWRMZWZ0KHN0ciwgdmFsdWUsIGxlbmd0aCkge1xuICBzdHIgPSBzdHIgKyAnJztcbiAgd2hpbGUgKHN0ci5sZW5ndGggPCBsZW5ndGgpIHsgc3RyID0gdmFsdWUgKyBzdHI7IH1cbiAgcmV0dXJuIHN0cjtcbn1cblxuY2xhc3MgU2VydmVyU3VydmV5IGV4dGVuZHMgU2VydmVyTW9kdWxlIHtcbi8vIGV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlcnZlclN1cnZleSBleHRlbmRzIFNlcnZlck1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fMKgJ3N1cnZleScpO1xuICAgIC8vIHByZXBhcmUgZmlsZSBuYW1lXG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICBjb25zdCB5ZWFyID0gcGFkTGVmdChub3cuZ2V0RnVsbFllYXIoKSwgMCwgMik7XG4gICAgY29uc3QgbW9udGggPSBwYWRMZWZ0KG5vdy5nZXRNb250aCgpICsgMSwgMCwgMik7XG4gICAgY29uc3QgZGF5ID0gcGFkTGVmdChub3cuZ2V0RGF0ZSgpLCAwLCAyKTtcbiAgICBjb25zdCBob3VyID0gcGFkTGVmdChub3cuZ2V0SG91cnMoKSwgMCwgMik7XG4gICAgY29uc3QgbWludXRlcyA9IHBhZExlZnQobm93LmdldE1pbnV0ZXMoKSwgMCwgMik7XG4gICAgY29uc3QgZmlsZU5hbWUgPSBgc3VydmV5LSR7eWVhcn0tJHttb250aH0tJHtkYXl9XyR7aG91cn0tJHttaW51dGVzfWA7XG5cbiAgICAvLyBAVE9ETyBhbGxvdyB0byBjaGFuZ2UgZm9sZGVyIG5hbWUgKGFrYSBgc3VydmV5c2ApXG4gICAgdGhpcy5maWxlUGF0aCA9IGAke3Byb2Nlc3MuY3dkKCl9L3N1cnZleXMvJHtmaWxlTmFtZX1gO1xuICAgIHRoaXMuX2FwcGVuZFRvRmlsZSA9IHRoaXMuX2FwcGVuZFRvRmlsZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICBjbGllbnQucmVjZWl2ZShgJHt0aGlzLm5hbWV9OmFuc3dlcnNgLCB0aGlzLl9hcHBlbmRUb0ZpbGUpXG4gIH1cblxuICBkaXNjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmRpc2Nvbm5lY3QoY2xpZW50KTtcbiAgfVxuXG4gIF9hcHBlbmRUb0ZpbGUoanNvbikge1xuICAgIGZzLmFwcGVuZEZpbGUodGhpcy5maWxlUGF0aCwgYCR7anNvbn1cXG5gLCAoZXJyKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7IGNvbnNvbGUuZXJyb3IoZXJyLm1lc3NhZ2UpOyB9XG4gICAgICBjb25zb2xlLmxvZyhqc29uICsgJyBhcHBlbmRlZCB0byAnICsgdGhpcy5maWxlUGF0aCk7XG4gICAgfSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZXJ2ZXJTdXJ2ZXk7XG4iXX0=