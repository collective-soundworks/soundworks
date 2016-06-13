'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _Scene2 = require('../core/Scene');

var _Scene3 = _interopRequireDefault(_Scene2);

var _sqlite = require('sqlite3');

var _sqlite2 = _interopRequireDefault(_sqlite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sql = _sqlite2.default.verbose();

// test query
// const SQL_TEST_DEFINITION = `
// SELECT
//   q.id AS question_id,
//   q.type,
//   q.required,
//   q.label AS question_label,
//   o.option_id,
//   o.label AS option_label
// FROM questions AS q
//   INNER JOIN options AS o
//   ON q.id = o.question_id
// `;

var SQL_CREATE = ['CREATE TABLE IF NOT EXISTS users (\n    id INTEGER PRIMARY KEY,\n    uuid,\n    user_agent,\n    timestamp,\n    UNIQUE(uuid, user_agent)\n  )', 'CREATE TABLE IF NOT EXISTS questions (\n    id INTEGER PRIMARY KEY,\n    type,\n    label,\n    required\n  )', 'CREATE TABLE IF NOT EXISTS options (\n    id INTEGER PRIMARY KEY,\n    question_id,\n    option_id,\n    label,\n    UNIQUE (question_id, option_id)\n    FOREIGN KEY (question_id) REFERENCES questions(id)\n  )', 'CREATE TABLE IF NOT EXISTS answers (\n    id INTERGER PRIMARY KEY,\n    user_id,\n    question_id,\n    answer,\n    UNIQUE (user_id, question_id, answer),\n    FOREIGN KEY (question_id) REFERENCES questions(id)\n  )'];

var SQL_DROP = ['DROP TABLE IF EXISTS users', 'DROP TABLE IF EXISTS questions', 'DROP TABLE IF EXISTS options', 'DROP TABLE IF EXISTS answers'];

var SQL_INSERT = {
  question: 'INSERT OR IGNORE INTO questions (id, type, label, required) VALUES (?, ?, ?, ?)',
  option: 'INSERT OR IGNORE INTO options (question_id, option_id, label) VALUES (?, ?, ?)',
  user: 'INSERT OR IGNORE INTO users (uuid, user_agent, timestamp) VALUES (?, ?, ?)',
  answer: 'INSERT OR IGNORE INTO answers (user_id, question_id, answer) VALUES (?, ?, ?)'
};

var SQL_SELECT = {
  userId: 'SELECT last_insert_rowid() AS id FROM users'
};

var SCENE_ID = 'survey';

var Survey = function (_Scene) {
  (0, _inherits3.default)(Survey, _Scene);

  function Survey(clientType, surveyConfig) {
    (0, _classCallCheck3.default)(this, Survey);


    /**
     * Configuration of the survey.
     * @type {Object}
     */

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Survey).call(this, SCENE_ID, clientType));

    _this.surveyConfig = surveyConfig;

    /**
     * Pointer to the database connection.
     * @type {Object}
     */
    _this._db = null;

    var defaults = {
      configItem: 'dbDirectory',
      dbName: 'survey.db',
      dropTables: true
    };

    _this.configure(defaults);

    _this._sharedConfigService = _this.require('shared-config');
    return _this;
  }

  (0, _createClass3.default)(Survey, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      var configItem = this.options.configItem;
      var dir = this._sharedConfigService.get(configItem);

      if (dir === null) dir = _path2.default.join(process.cwd(), 'db');

      _fsExtra2.default.ensureDirSync(dir); // create directory if not exists

      // create the database if not exist
      var dbName = _path2.default.join(dir, this.options.dbName);
      var db = new sql.Database(dbName);

      // make sure queries are executed sequencially
      db.serialize(function () {
        if (_this2.options.dropTables === true) SQL_DROP.forEach(function (query) {
          return db.run(query);
        });

        // create tables
        SQL_CREATE.forEach(function (query) {
          return db.run(query);
        });

        // populate db with survey definition
        var stmtQuestion = db.prepare(SQL_INSERT.question);
        var stmtOption = db.prepare(SQL_INSERT.option);

        _this2.surveyConfig.forEach(function (question, index) {
          question.id = index;
          stmtQuestion.run(question.id, question.type, question.label, question.required);

          if (question.options) {
            for (var id in question.options) {
              var label = question.options[id];
              stmtOption.run(index, id, label);
            };
          }
        });

        stmtQuestion.finalize();
        stmtOption.finalize();
        // db.each(SQL_TEST_DEFINITION, (err, row) => console.log(row));
      });

      this._db = db;
    }
  }, {
    key: 'connect',
    value: function connect(client) {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Survey.prototype), 'connect', this).call(this, client);

      this.receive(client, 'request', this._onRequest(client));
      this.receive(client, 'answers', this._onAnswers(client));
    }
  }, {
    key: '_onRequest',
    value: function _onRequest(client) {
      var _this3 = this;

      return function () {
        return _this3.send(client, 'config', _this3.surveyConfig);
      };
    }
  }, {
    key: '_onAnswers',
    value: function _onAnswers(client) {
      var _this4 = this;

      return function (answers) {
        return _this4._persist(client, answers);
      };
    }
  }, {
    key: '_persist',
    value: function _persist(client, data) {
      var db = this._db;

      db.serialize(function () {
        // do a transation to retrieve the db user id
        db.run('BEGIN');
        db.run(SQL_INSERT.user, client.uuid, data.userAgent, data.timestamp);

        db.get(SQL_SELECT.userId, function (err, row) {
          if (err) console.error(err);

          var userId = row.id;
          var stmtAnswer = db.prepare(SQL_INSERT.answer);

          var _loop = function _loop(questionId) {
            var response = data.answers[questionId];

            if (Array.isArray(response)) response.forEach(function (element) {
              return stmtAnswer.run(userId, questionId, element);
            });else stmtAnswer.run(userId, questionId, response);
          };

          for (var questionId in data.answers) {
            _loop(questionId);
          }
        });

        db.run('COMMIT'); // this is executed just after the userId selection
      });
    }
  }]);
  return Survey;
}(_Scene3.default);

exports.default = Survey;
//# sourceMappingURL=data:application/json;base64,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LEVBQXVCLFVBQXZCLEVBQW1DLE9BQW5DLENBQWI7QUFBQSxhQUFqQixFQURGLEtBR0UsV0FBVyxHQUFYLENBQWUsTUFBZixFQUF1QixVQUF2QixFQUFtQyxRQUFuQztBQVprQzs7QUFNdEMsZUFBSyxJQUFJLFVBQVQsSUFBdUIsS0FBSyxPQUE1QixFQUFxQztBQUFBLGtCQUE1QixVQUE0QjtBQU9wQztBQUNGLFNBZEQ7O0FBZ0JBLFdBQUcsR0FBSCxDQUFPLFFBQVAsRTtBQUNELE9BdEJEO0FBdUJEOzs7OztrQkFqSGtCLE0iLCJmaWxlIjoiU3VydmV5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzZSBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBTY2VuZSBmcm9tICcuLi9jb3JlL1NjZW5lJztcbmltcG9ydCBzcWxpdGUgZnJvbSAnc3FsaXRlMyc7XG5cbmNvbnN0IHNxbCA9IHNxbGl0ZS52ZXJib3NlKCk7XG5cbi8vIHRlc3QgcXVlcnlcbi8vIGNvbnN0IFNRTF9URVNUX0RFRklOSVRJT04gPSBgXG4vLyBTRUxFQ1Rcbi8vICAgcS5pZCBBUyBxdWVzdGlvbl9pZCxcbi8vICAgcS50eXBlLFxuLy8gICBxLnJlcXVpcmVkLFxuLy8gICBxLmxhYmVsIEFTIHF1ZXN0aW9uX2xhYmVsLFxuLy8gICBvLm9wdGlvbl9pZCxcbi8vICAgby5sYWJlbCBBUyBvcHRpb25fbGFiZWxcbi8vIEZST00gcXVlc3Rpb25zIEFTIHFcbi8vICAgSU5ORVIgSk9JTiBvcHRpb25zIEFTIG9cbi8vICAgT04gcS5pZCA9IG8ucXVlc3Rpb25faWRcbi8vIGA7XG5cbmNvbnN0IFNRTF9DUkVBVEUgPSBbXG4gIGBDUkVBVEUgVEFCTEUgSUYgTk9UIEVYSVNUUyB1c2VycyAoXG4gICAgaWQgSU5URUdFUiBQUklNQVJZIEtFWSxcbiAgICB1dWlkLFxuICAgIHVzZXJfYWdlbnQsXG4gICAgdGltZXN0YW1wLFxuICAgIFVOSVFVRSh1dWlkLCB1c2VyX2FnZW50KVxuICApYCxcbiAgYENSRUFURSBUQUJMRSBJRiBOT1QgRVhJU1RTIHF1ZXN0aW9ucyAoXG4gICAgaWQgSU5URUdFUiBQUklNQVJZIEtFWSxcbiAgICB0eXBlLFxuICAgIGxhYmVsLFxuICAgIHJlcXVpcmVkXG4gIClgLFxuICBgQ1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMgb3B0aW9ucyAoXG4gICAgaWQgSU5URUdFUiBQUklNQVJZIEtFWSxcbiAgICBxdWVzdGlvbl9pZCxcbiAgICBvcHRpb25faWQsXG4gICAgbGFiZWwsXG4gICAgVU5JUVVFIChxdWVzdGlvbl9pZCwgb3B0aW9uX2lkKVxuICAgIEZPUkVJR04gS0VZIChxdWVzdGlvbl9pZCkgUkVGRVJFTkNFUyBxdWVzdGlvbnMoaWQpXG4gIClgLFxuICBgQ1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMgYW5zd2VycyAoXG4gICAgaWQgSU5URVJHRVIgUFJJTUFSWSBLRVksXG4gICAgdXNlcl9pZCxcbiAgICBxdWVzdGlvbl9pZCxcbiAgICBhbnN3ZXIsXG4gICAgVU5JUVVFICh1c2VyX2lkLCBxdWVzdGlvbl9pZCwgYW5zd2VyKSxcbiAgICBGT1JFSUdOIEtFWSAocXVlc3Rpb25faWQpIFJFRkVSRU5DRVMgcXVlc3Rpb25zKGlkKVxuICApYFxuXTtcblxuY29uc3QgU1FMX0RST1AgPSBbXG4gICdEUk9QIFRBQkxFIElGIEVYSVNUUyB1c2VycycsXG4gICdEUk9QIFRBQkxFIElGIEVYSVNUUyBxdWVzdGlvbnMnLFxuICAnRFJPUCBUQUJMRSBJRiBFWElTVFMgb3B0aW9ucycsXG4gICdEUk9QIFRBQkxFIElGIEVYSVNUUyBhbnN3ZXJzJyxcbl1cblxuY29uc3QgU1FMX0lOU0VSVCA9IHtcbiAgcXVlc3Rpb246IGBJTlNFUlQgT1IgSUdOT1JFIElOVE8gcXVlc3Rpb25zIChpZCwgdHlwZSwgbGFiZWwsIHJlcXVpcmVkKSBWQUxVRVMgKD8sID8sID8sID8pYCxcbiAgb3B0aW9uOiBgSU5TRVJUIE9SIElHTk9SRSBJTlRPIG9wdGlvbnMgKHF1ZXN0aW9uX2lkLCBvcHRpb25faWQsIGxhYmVsKSBWQUxVRVMgKD8sID8sID8pYCxcbiAgdXNlcjogYElOU0VSVCBPUiBJR05PUkUgSU5UTyB1c2VycyAodXVpZCwgdXNlcl9hZ2VudCwgdGltZXN0YW1wKSBWQUxVRVMgKD8sID8sID8pYCxcbiAgYW5zd2VyOiBgSU5TRVJUIE9SIElHTk9SRSBJTlRPIGFuc3dlcnMgKHVzZXJfaWQsIHF1ZXN0aW9uX2lkLCBhbnN3ZXIpIFZBTFVFUyAoPywgPywgPylgLFxufVxuXG5jb25zdCBTUUxfU0VMRUNUID0ge1xuICB1c2VySWQ6IGBTRUxFQ1QgbGFzdF9pbnNlcnRfcm93aWQoKSBBUyBpZCBGUk9NIHVzZXJzYCxcbn1cblxuXG5jb25zdCBTQ0VORV9JRCA9ICdzdXJ2ZXknO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdXJ2ZXkgZXh0ZW5kcyBTY2VuZSB7XG4gIGNvbnN0cnVjdG9yKGNsaWVudFR5cGUsIHN1cnZleUNvbmZpZykge1xuICAgIHN1cGVyKFNDRU5FX0lELCBjbGllbnRUeXBlKTtcblxuICAgIC8qKlxuICAgICAqIENvbmZpZ3VyYXRpb24gb2YgdGhlIHN1cnZleS5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuc3VydmV5Q29uZmlnID0gc3VydmV5Q29uZmlnO1xuXG4gICAgLyoqXG4gICAgICogUG9pbnRlciB0byB0aGUgZGF0YWJhc2UgY29ubmVjdGlvbi5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuX2RiID0gbnVsbDtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgY29uZmlnSXRlbTogJ2RiRGlyZWN0b3J5JyxcbiAgICAgIGRiTmFtZTogJ3N1cnZleS5kYicsXG4gICAgICBkcm9wVGFibGVzOiB0cnVlLFxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICB0aGlzLl9zaGFyZWRDb25maWdTZXJ2aWNlID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtY29uZmlnJyk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBjb25zdCBjb25maWdJdGVtID0gdGhpcy5vcHRpb25zLmNvbmZpZ0l0ZW07XG4gICAgbGV0IGRpciA9IHRoaXMuX3NoYXJlZENvbmZpZ1NlcnZpY2UuZ2V0KGNvbmZpZ0l0ZW0pO1xuXG4gICAgaWYgKGRpciA9PT0gbnVsbClcbiAgICAgIGRpciA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnZGInKTtcblxuICAgIGZzZS5lbnN1cmVEaXJTeW5jKGRpcik7IC8vIGNyZWF0ZSBkaXJlY3RvcnkgaWYgbm90IGV4aXN0c1xuXG4gICAgLy8gY3JlYXRlIHRoZSBkYXRhYmFzZSBpZiBub3QgZXhpc3RcbiAgICBjb25zdCBkYk5hbWUgPSBwYXRoLmpvaW4oZGlyLCB0aGlzLm9wdGlvbnMuZGJOYW1lKTtcbiAgICBjb25zdCBkYiA9IG5ldyBzcWwuRGF0YWJhc2UoZGJOYW1lKTtcblxuICAgIC8vIG1ha2Ugc3VyZSBxdWVyaWVzIGFyZSBleGVjdXRlZCBzZXF1ZW5jaWFsbHlcbiAgICBkYi5zZXJpYWxpemUoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5kcm9wVGFibGVzID09PSB0cnVlKVxuICAgICAgICBTUUxfRFJPUC5mb3JFYWNoKChxdWVyeSkgPT4gZGIucnVuKHF1ZXJ5KSk7XG5cbiAgICAgIC8vIGNyZWF0ZSB0YWJsZXNcbiAgICAgIFNRTF9DUkVBVEUuZm9yRWFjaCgocXVlcnkpID0+IGRiLnJ1bihxdWVyeSkpO1xuXG4gICAgICAvLyBwb3B1bGF0ZSBkYiB3aXRoIHN1cnZleSBkZWZpbml0aW9uXG4gICAgICBjb25zdCBzdG10UXVlc3Rpb24gPSBkYi5wcmVwYXJlKFNRTF9JTlNFUlQucXVlc3Rpb24pO1xuICAgICAgY29uc3Qgc3RtdE9wdGlvbiA9IGRiLnByZXBhcmUoU1FMX0lOU0VSVC5vcHRpb24pO1xuXG4gICAgICB0aGlzLnN1cnZleUNvbmZpZy5mb3JFYWNoKChxdWVzdGlvbiwgaW5kZXgpID0+IHtcbiAgICAgICAgcXVlc3Rpb24uaWQgPSBpbmRleDtcbiAgICAgICAgc3RtdFF1ZXN0aW9uLnJ1bihxdWVzdGlvbi5pZCwgcXVlc3Rpb24udHlwZSwgcXVlc3Rpb24ubGFiZWwsIHF1ZXN0aW9uLnJlcXVpcmVkKTtcblxuICAgICAgICBpZiAocXVlc3Rpb24ub3B0aW9ucykge1xuICAgICAgICAgIGZvciAobGV0IGlkIGluIHF1ZXN0aW9uLm9wdGlvbnMpIHtcbiAgICAgICAgICAgIGxldCBsYWJlbCA9IHF1ZXN0aW9uLm9wdGlvbnNbaWRdO1xuICAgICAgICAgICAgc3RtdE9wdGlvbi5ydW4oaW5kZXgsIGlkLCBsYWJlbCk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHN0bXRRdWVzdGlvbi5maW5hbGl6ZSgpO1xuICAgICAgc3RtdE9wdGlvbi5maW5hbGl6ZSgpO1xuICAgICAgLy8gZGIuZWFjaChTUUxfVEVTVF9ERUZJTklUSU9OLCAoZXJyLCByb3cpID0+IGNvbnNvbGUubG9nKHJvdykpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fZGIgPSBkYjtcbiAgfVxuXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3JlcXVlc3QnLCB0aGlzLl9vblJlcXVlc3QoY2xpZW50KSk7XG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ2Fuc3dlcnMnLCB0aGlzLl9vbkFuc3dlcnMoY2xpZW50KSk7XG4gIH1cblxuICBfb25SZXF1ZXN0KGNsaWVudCkge1xuICAgIHJldHVybiAoKSA9PiB0aGlzLnNlbmQoY2xpZW50LCAnY29uZmlnJywgdGhpcy5zdXJ2ZXlDb25maWcpO1xuICB9XG5cbiAgX29uQW5zd2VycyhjbGllbnQpIHtcbiAgICByZXR1cm4gKGFuc3dlcnMpID0+IHRoaXMuX3BlcnNpc3QoY2xpZW50LCBhbnN3ZXJzKTtcbiAgfVxuXG4gIF9wZXJzaXN0KGNsaWVudCwgZGF0YSkge1xuICAgIGNvbnN0IGRiID0gdGhpcy5fZGI7XG5cbiAgICBkYi5zZXJpYWxpemUoKCkgPT4ge1xuICAgICAgLy8gZG8gYSB0cmFuc2F0aW9uIHRvIHJldHJpZXZlIHRoZSBkYiB1c2VyIGlkXG4gICAgICBkYi5ydW4oJ0JFR0lOJyk7XG4gICAgICBkYi5ydW4oU1FMX0lOU0VSVC51c2VyLCBjbGllbnQudXVpZCwgZGF0YS51c2VyQWdlbnQsIGRhdGEudGltZXN0YW1wKTtcblxuICAgICAgZGIuZ2V0KFNRTF9TRUxFQ1QudXNlcklkLCAoZXJyLCByb3cpID0+IHtcbiAgICAgICAgaWYgKGVycikgY29uc29sZS5lcnJvcihlcnIpO1xuXG4gICAgICAgIGNvbnN0IHVzZXJJZCA9IHJvdy5pZDtcbiAgICAgICAgY29uc3Qgc3RtdEFuc3dlciA9IGRiLnByZXBhcmUoU1FMX0lOU0VSVC5hbnN3ZXIpXG5cbiAgICAgICAgZm9yIChsZXQgcXVlc3Rpb25JZCBpbiBkYXRhLmFuc3dlcnMpIHtcbiAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGRhdGEuYW5zd2Vyc1txdWVzdGlvbklkXTtcblxuICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHJlc3BvbnNlKSlcbiAgICAgICAgICAgIHJlc3BvbnNlLmZvckVhY2goKGVsZW1lbnQpID0+IHN0bXRBbnN3ZXIucnVuKHVzZXJJZCwgcXVlc3Rpb25JZCwgZWxlbWVudCkpO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHN0bXRBbnN3ZXIucnVuKHVzZXJJZCwgcXVlc3Rpb25JZCwgcmVzcG9uc2UpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgZGIucnVuKCdDT01NSVQnKTsgLy8gdGhpcyBpcyBleGVjdXRlZCBqdXN0IGFmdGVyIHRoZSB1c2VySWQgc2VsZWN0aW9uXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==