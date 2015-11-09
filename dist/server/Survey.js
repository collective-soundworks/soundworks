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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU3VydmV5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7a0JBQWUsSUFBSTs7Ozt1QkFDQSxVQUFVOzs7O0FBRzdCLFNBQVMsT0FBTyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQ25DLEtBQUcsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ2YsU0FBTyxHQUFHLENBQUMsTUFBTSxHQUFHLE1BQU0sRUFBRTtBQUFFLE9BQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDO0dBQUU7QUFDbEQsU0FBTyxHQUFHLENBQUM7Q0FDWjs7SUFHb0IsTUFBTTtZQUFOLE1BQU07O0FBQ2QsV0FEUSxNQUFNLEdBQ0M7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQURMLE1BQU07O0FBRXZCLCtCQUZpQixNQUFNLDZDQUVqQixPQUFPLENBQUMsSUFBSSxJQUFJLFFBQVEsRUFBRTs7QUFFaEMsUUFBTSxHQUFHLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztBQUN2QixRQUFNLElBQUksR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM5QyxRQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDaEQsUUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDekMsUUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDM0MsUUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDaEQsUUFBTSxRQUFRLGVBQWEsSUFBSSxTQUFJLEtBQUssU0FBSSxHQUFHLFNBQUksSUFBSSxTQUFJLE9BQU8sQUFBRSxDQUFDOzs7QUFHckUsUUFBSSxDQUFDLFFBQVEsR0FBTSxPQUFPLENBQUMsR0FBRyxFQUFFLGlCQUFZLFFBQVEsQUFBRSxDQUFDO0FBQ3ZELFFBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDcEQ7O2VBZmtCLE1BQU07O1dBaUJsQixpQkFBQyxNQUFNLEVBQUU7QUFDZCxpQ0FsQmlCLE1BQU0seUNBa0JULE1BQU0sRUFBRTs7QUFFdEIsWUFBTSxDQUFDLE9BQU8sQ0FBSSxJQUFJLENBQUMsSUFBSSxlQUFZLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQTtLQUMzRDs7O1dBRVMsb0JBQUMsTUFBTSxFQUFFO0FBQ2pCLGlDQXhCaUIsTUFBTSw0Q0F3Qk4sTUFBTSxFQUFFO0tBQzFCOzs7V0FFWSx1QkFBQyxJQUFJLEVBQUU7OztBQUNsQixzQkFBRyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBSyxJQUFJLFNBQU0sVUFBQyxHQUFHLEVBQUs7QUFDakQsWUFBSSxHQUFHLEVBQUU7QUFBRSxpQkFBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7U0FBRTtBQUN4QyxlQUFPLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxlQUFlLEdBQUcsTUFBSyxRQUFRLENBQUMsQ0FBQztPQUNyRCxDQUFDLENBQUM7S0FDSjs7O1NBaENrQixNQUFNOzs7cUJBQU4sTUFBTSIsImZpbGUiOiJzcmMvc2VydmVyL1N1cnZleS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgTW9kdWxlIGZyb20gJy4vTW9kdWxlJztcblxuXG5mdW5jdGlvbiBwYWRMZWZ0KHN0ciwgdmFsdWUsIGxlbmd0aCkge1xuICBzdHIgPSBzdHIgKyAnJztcbiAgd2hpbGUgKHN0ci5sZW5ndGggPCBsZW5ndGgpIHsgc3RyID0gdmFsdWUgKyBzdHI7IH1cbiAgcmV0dXJuIHN0cjtcbn1cblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdXJ2ZXkgZXh0ZW5kcyBNb2R1bGUge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHzCoCdzdXJ2ZXknKTtcbiAgICAvLyBwcmVwYXJlIGZpbGUgbmFtZVxuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgeWVhciA9IHBhZExlZnQobm93LmdldEZ1bGxZZWFyKCksIDAsIDIpO1xuICAgIGNvbnN0IG1vbnRoID0gcGFkTGVmdChub3cuZ2V0TW9udGgoKSArIDEsIDAsIDIpO1xuICAgIGNvbnN0IGRheSA9IHBhZExlZnQobm93LmdldERhdGUoKSwgMCwgMik7XG4gICAgY29uc3QgaG91ciA9IHBhZExlZnQobm93LmdldEhvdXJzKCksIDAsIDIpO1xuICAgIGNvbnN0IG1pbnV0ZXMgPSBwYWRMZWZ0KG5vdy5nZXRNaW51dGVzKCksIDAsIDIpO1xuICAgIGNvbnN0IGZpbGVOYW1lID0gYHN1cnZleS0ke3llYXJ9LSR7bW9udGh9LSR7ZGF5fV8ke2hvdXJ9LSR7bWludXRlc31gO1xuXG4gICAgLy8gQFRPRE8gYWxsb3cgdG8gY2hhbmdlIGZvbGRlciBuYW1lIChha2EgYHN1cnZleXNgKVxuICAgIHRoaXMuZmlsZVBhdGggPSBgJHtwcm9jZXNzLmN3ZCgpfS9zdXJ2ZXlzLyR7ZmlsZU5hbWV9YDtcbiAgICB0aGlzLl9hcHBlbmRUb0ZpbGUgPSB0aGlzLl9hcHBlbmRUb0ZpbGUuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgY2xpZW50LnJlY2VpdmUoYCR7dGhpcy5uYW1lfTphbnN3ZXJzYCwgdGhpcy5fYXBwZW5kVG9GaWxlKVxuICB9XG5cbiAgZGlzY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5kaXNjb25uZWN0KGNsaWVudCk7XG4gIH1cblxuICBfYXBwZW5kVG9GaWxlKGpzb24pIHtcbiAgICBmcy5hcHBlbmRGaWxlKHRoaXMuZmlsZVBhdGgsIGAke2pzb259XFxuYCwgKGVycikgPT4ge1xuICAgICAgaWYgKGVycikgeyBjb25zb2xlLmVycm9yKGVyci5tZXNzYWdlKTsgfVxuICAgICAgY29uc29sZS5sb2coanNvbiArICcgYXBwZW5kZWQgdG8gJyArIHRoaXMuZmlsZVBhdGgpO1xuICAgIH0pO1xuICB9XG59XG5cbiJdfQ==