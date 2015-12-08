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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O2tCQUFlLElBQUk7Ozs7NkJBQ00sZ0JBQWdCOzs7O0FBR3pDLFNBQVMsT0FBTyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQ25DLEtBQUcsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ2YsU0FBTyxHQUFHLENBQUMsTUFBTSxHQUFHLE1BQU0sRUFBRTtBQUFFLE9BQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDO0dBQUU7QUFDbEQsU0FBTyxHQUFHLENBQUM7Q0FDWjs7Ozs7O0lBS29CLFlBQVk7WUFBWixZQUFZOztBQUNwQixXQURRLFlBQVksR0FDTDtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBREwsWUFBWTs7QUFFN0IsK0JBRmlCLFlBQVksNkNBRXZCLE9BQU8sQ0FBQyxJQUFJLElBQUksUUFBUSxFQUFFOztBQUVoQyxRQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO0FBQ3ZCLFFBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzlDLFFBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNoRCxRQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN6QyxRQUFNLElBQUksR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMzQyxRQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNoRCxRQUFNLFFBQVEsZUFBYSxJQUFJLFNBQUksS0FBSyxTQUFJLEdBQUcsU0FBSSxJQUFJLFNBQUksT0FBTyxBQUFFLENBQUM7OztBQUdyRSxRQUFJLENBQUMsUUFBUSxHQUFNLE9BQU8sQ0FBQyxHQUFHLEVBQUUsaUJBQVksUUFBUSxBQUFFLENBQUM7QUFDdkQsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUNwRDs7ZUFma0IsWUFBWTs7V0FpQnhCLGlCQUFDLE1BQU0sRUFBRTtBQUNkLGlDQWxCaUIsWUFBWSx5Q0FrQmYsTUFBTSxFQUFFOztBQUV0QixVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFBO0tBQ3BEOzs7V0FFUyxvQkFBQyxNQUFNLEVBQUU7QUFDakIsaUNBeEJpQixZQUFZLDRDQXdCWixNQUFNLEVBQUU7S0FDMUI7OztXQUVZLHVCQUFDLElBQUksRUFBRTs7O0FBQ2xCLHNCQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFLLElBQUksU0FBTSxVQUFDLEdBQUcsRUFBSztBQUNqRCxZQUFJLEdBQUcsRUFBRTtBQUFFLGlCQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUFFO0FBQ3hDLGVBQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLGVBQWUsR0FBRyxNQUFLLFFBQVEsQ0FBQyxDQUFDO09BQ3JELENBQUMsQ0FBQztLQUNKOzs7U0FoQ2tCLFlBQVk7OztxQkFBWixZQUFZIiwiZmlsZSI6InNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgU2VydmVyTW9kdWxlIGZyb20gJy4vU2VydmVyTW9kdWxlJztcblxuXG5mdW5jdGlvbiBwYWRMZWZ0KHN0ciwgdmFsdWUsIGxlbmd0aCkge1xuICBzdHIgPSBzdHIgKyAnJztcbiAgd2hpbGUgKHN0ci5sZW5ndGggPCBsZW5ndGgpIHsgc3RyID0gdmFsdWUgKyBzdHI7IH1cbiAgcmV0dXJuIHN0cjtcbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2ZXJTdXJ2ZXkgZXh0ZW5kcyBTZXJ2ZXJNb2R1bGUge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHzCoCdzdXJ2ZXknKTtcbiAgICAvLyBwcmVwYXJlIGZpbGUgbmFtZVxuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgeWVhciA9IHBhZExlZnQobm93LmdldEZ1bGxZZWFyKCksIDAsIDIpO1xuICAgIGNvbnN0IG1vbnRoID0gcGFkTGVmdChub3cuZ2V0TW9udGgoKSArIDEsIDAsIDIpO1xuICAgIGNvbnN0IGRheSA9IHBhZExlZnQobm93LmdldERhdGUoKSwgMCwgMik7XG4gICAgY29uc3QgaG91ciA9IHBhZExlZnQobm93LmdldEhvdXJzKCksIDAsIDIpO1xuICAgIGNvbnN0IG1pbnV0ZXMgPSBwYWRMZWZ0KG5vdy5nZXRNaW51dGVzKCksIDAsIDIpO1xuICAgIGNvbnN0IGZpbGVOYW1lID0gYHN1cnZleS0ke3llYXJ9LSR7bW9udGh9LSR7ZGF5fV8ke2hvdXJ9LSR7bWludXRlc31gO1xuXG4gICAgLy8gQFRPRE8gYWxsb3cgdG8gY2hhbmdlIGZvbGRlciBuYW1lIChha2EgYHN1cnZleXNgKVxuICAgIHRoaXMuZmlsZVBhdGggPSBgJHtwcm9jZXNzLmN3ZCgpfS9zdXJ2ZXlzLyR7ZmlsZU5hbWV9YDtcbiAgICB0aGlzLl9hcHBlbmRUb0ZpbGUgPSB0aGlzLl9hcHBlbmRUb0ZpbGUuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ2Fuc3dlcnMnLCB0aGlzLl9hcHBlbmRUb0ZpbGUpXG4gIH1cblxuICBkaXNjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmRpc2Nvbm5lY3QoY2xpZW50KTtcbiAgfVxuXG4gIF9hcHBlbmRUb0ZpbGUoanNvbikge1xuICAgIGZzLmFwcGVuZEZpbGUodGhpcy5maWxlUGF0aCwgYCR7anNvbn1cXG5gLCAoZXJyKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7IGNvbnNvbGUuZXJyb3IoZXJyLm1lc3NhZ2UpOyB9XG4gICAgICBjb25zb2xlLmxvZyhqc29uICsgJyBhcHBlbmRlZCB0byAnICsgdGhpcy5maWxlUGF0aCk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==