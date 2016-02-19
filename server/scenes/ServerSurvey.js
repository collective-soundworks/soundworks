'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _coreServerActivity = require('../core/ServerActivity');

var _coreServerActivity2 = _interopRequireDefault(_coreServerActivity);

var _sqlite3 = require('sqlite3');

var _sqlite32 = _interopRequireDefault(_sqlite3);

var sql = _sqlite32['default'].verbose();
var SCENE_ID = 'survey';
var DATABASE_NAME = 'db/survey.db';

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

var ServerSurvey = (function (_ServerActivity) {
  _inherits(ServerSurvey, _ServerActivity);

  function ServerSurvey(clientType, surveyConfig) {
    _classCallCheck(this, ServerSurvey);

    _get(Object.getPrototypeOf(ServerSurvey.prototype), 'constructor', this).call(this, SCENE_ID);

    /**
     * Configuration of the survey.
     * @type {Object}
     */
    this.surveyConfig = surveyConfig;

    /**
     * Pointer to the database connection.
     * @type {Object}
     */
    this._db = null;

    this.addClientType(clientType);

    var defaults = {
      directoryConfig: 'dbDirectory',
      dbName: 'survey.db',
      dropTables: true
    };

    this.configure(defaults);

    this._sharedConfigService = this.require('shared-config');
  }

  _createClass(ServerSurvey, [{
    key: 'start',
    value: function start() {
      var _this = this;

      var directoryConfig = this.options.directoryConfig;
      var dir = this._sharedConfigService.get(directoryConfig)[directoryConfig];
      dir = _path2['default'].join(process.cwd(), dir);
      dir = _path2['default'].normalize(dir); // @todo - check it does the job on windows
      _fsExtra2['default'].ensureDirSync(dir); // create directory if not exists

      // create the database if not exist
      var dbName = _path2['default'].join(dir, this.options.dbName);
      var db = new sql.Database(dbName);

      // make sure queries are executed sequencially
      db.serialize(function () {
        if (_this.options.dropTables === true) SQL_DROP.forEach(function (query) {
          return db.run(query);
        });

        // create tables
        SQL_CREATE.forEach(function (query) {
          return db.run(query);
        });

        // populate db with survey definition
        var stmtQuestion = db.prepare(SQL_INSERT.question);
        var stmtOption = db.prepare(SQL_INSERT.option);

        _this.surveyConfig.forEach(function (question, index) {
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
      _get(Object.getPrototypeOf(ServerSurvey.prototype), 'connect', this).call(this, client);

      this.receive(client, 'request', this._onRequest(client));
      this.receive(client, 'answers', this._onAnswers(client));
    }
  }, {
    key: '_onRequest',
    value: function _onRequest(client) {
      var _this2 = this;

      return function () {
        return _this2.send(client, 'config', _this2.surveyConfig);
      };
    }
  }, {
    key: '_onAnswers',
    value: function _onAnswers(client) {
      var _this3 = this;

      return function (answers) {
        return _this3._persist(client, answers);
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

          var _loop = function (questionId) {
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

  return ServerSurvey;
})(_coreServerActivity2['default']);

exports['default'] = ServerSurvey;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9zZXJ2ZXIvc2NlbmVzL1NlcnZlclN1cnZleS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3VCQUFnQixVQUFVOzs7O29CQUNULE1BQU07Ozs7a0NBQ0ksd0JBQXdCOzs7O3VCQUNoQyxTQUFTOzs7O0FBRTVCLElBQU0sR0FBRyxHQUFHLHFCQUFPLE9BQU8sRUFBRSxDQUFDO0FBQzdCLElBQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQztBQUMxQixJQUFNLGFBQWEsR0FBRyxjQUFjLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQnJDLElBQU0sVUFBVSxHQUFHLG9yQkE4QmxCLENBQUM7O0FBRUYsSUFBTSxRQUFRLEdBQUcsQ0FDZiw0QkFBNEIsRUFDNUIsZ0NBQWdDLEVBQ2hDLDhCQUE4QixFQUM5Qiw4QkFBOEIsQ0FDL0IsQ0FBQTs7QUFFRCxJQUFNLFVBQVUsR0FBRztBQUNqQixVQUFRLG1GQUFtRjtBQUMzRixRQUFNLGtGQUFrRjtBQUN4RixNQUFJLDhFQUE4RTtBQUNsRixRQUFNLGlGQUFpRjtDQUN4RixDQUFBOztBQUVELElBQU0sVUFBVSxHQUFHO0FBQ2pCLFFBQU0sK0NBQStDO0NBQ3RELENBQUE7O0lBRW9CLFlBQVk7WUFBWixZQUFZOztBQUNwQixXQURRLFlBQVksQ0FDbkIsVUFBVSxFQUFFLFlBQVksRUFBRTswQkFEbkIsWUFBWTs7QUFFN0IsK0JBRmlCLFlBQVksNkNBRXZCLFFBQVEsRUFBRTs7Ozs7O0FBTWhCLFFBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDOzs7Ozs7QUFNakMsUUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7O0FBRWhCLFFBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7O0FBRS9CLFFBQU0sUUFBUSxHQUFHO0FBQ2YscUJBQWUsRUFBRSxhQUFhO0FBQzlCLFlBQU0sRUFBRSxXQUFXO0FB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QUMsQ0FBQyxLQUUzRSxVQUFVLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7OztBQU5qRCxlQUFLLElBQUksVUFBVSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7a0JBQTVCLFVBQVU7V0FPbEI7U0FDRixDQUFDLENBQUM7O0FBRUgsVUFBRSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztPQUNsQixDQUFDLENBQUM7S0FDSjs7O1NBakhrQixZQUFZOzs7cUJBQVosWUFBWSIsImZpbGUiOiIvVXNlcnMvbWF0dXN6ZXdza2kvZGV2L2Nvc2ltYS9saWIvc291bmR3b3Jrcy9zcmMvc2VydmVyL3NjZW5lcy9TZXJ2ZXJTdXJ2ZXkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZnNlIGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IFNlcnZlckFjdGl2aXR5IGZyb20gJy4uL2NvcmUvU2VydmVyQWN0aXZpdHknO1xuaW1wb3J0IHNxbGl0ZSBmcm9tICdzcWxpdGUzJztcblxuY29uc3Qgc3FsID0gc3FsaXRlLnZlcmJvc2UoKTtcbmNvbnN0IFNDRU5FX0lEID0gJ3N1cnZleSc7XG5jb25zdCBEQVRBQkFTRV9OQU1FID0gJ2RiL3N1cnZleS5kYic7XG5cbi8vIHRlc3QgcXVlcnlcbi8vIGNvbnN0IFNRTF9URVNUX0RFRklOSVRJT04gPSBgXG4vLyBTRUxFQ1Rcbi8vICAgcS5pZCBBUyBxdWVzdGlvbl9pZCxcbi8vICAgcS50eXBlLFxuLy8gICBxLnJlcXVpcmVkLFxuLy8gICBxLmxhYmVsIEFTIHF1ZXN0aW9uX2xhYmVsLFxuLy8gICBvLm9wdGlvbl9pZCxcbi8vICAgby5sYWJlbCBBUyBvcHRpb25fbGFiZWxcbi8vIEZST00gcXVlc3Rpb25zIEFTIHFcbi8vICAgSU5ORVIgSk9JTiBvcHRpb25zIEFTIG9cbi8vICAgT04gcS5pZCA9IG8ucXVlc3Rpb25faWRcbi8vIGA7XG5cbmNvbnN0IFNRTF9DUkVBVEUgPSBbXG4gIGBDUkVBVEUgVEFCTEUgSUYgTk9UIEVYSVNUUyB1c2VycyAoXG4gICAgaWQgSU5URUdFUiBQUklNQVJZIEtFWSxcbiAgICB1dWlkLFxuICAgIHVzZXJfYWdlbnQsXG4gICAgdGltZXN0YW1wLFxuICAgIFVOSVFVRSh1dWlkLCB1c2VyX2FnZW50KVxuICApYCxcbiAgYENSRUFURSBUQUJMRSBJRiBOT1QgRVhJU1RTIHF1ZXN0aW9ucyAoXG4gICAgaWQgSU5URUdFUiBQUklNQVJZIEtFWSxcbiAgICB0eXBlLFxuICAgIGxhYmVsLFxuICAgIHJlcXVpcmVkXG4gIClgLFxuICBgQ1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMgb3B0aW9ucyAoXG4gICAgaWQgSU5URUdFUiBQUklNQVJZIEtFWSxcbiAgICBxdWVzdGlvbl9pZCxcbiAgICBvcHRpb25faWQsXG4gICAgbGFiZWwsXG4gICAgVU5JUVVFIChxdWVzdGlvbl9pZCwgb3B0aW9uX2lkKVxuICAgIEZPUkVJR04gS0VZIChxdWVzdGlvbl9pZCkgUkVGRVJFTkNFUyBxdWVzdGlvbnMoaWQpXG4gIClgLFxuICBgQ1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMgYW5zd2VycyAoXG4gICAgaWQgSU5URVJHRVIgUFJJTUFSWSBLRVksXG4gICAgdXNlcl9pZCxcbiAgICBxdWVzdGlvbl9pZCxcbiAgICBhbnN3ZXIsXG4gICAgVU5JUVVFICh1c2VyX2lkLCBxdWVzdGlvbl9pZCwgYW5zd2VyKSxcbiAgICBGT1JFSUdOIEtFWSAocXVlc3Rpb25faWQpIFJFRkVSRU5DRVMgcXVlc3Rpb25zKGlkKVxuICApYFxuXTtcblxuY29uc3QgU1FMX0RST1AgPSBbXG4gICdEUk9QIFRBQkxFIElGIEVYSVNUUyB1c2VycycsXG4gICdEUk9QIFRBQkxFIElGIEVYSVNUUyBxdWVzdGlvbnMnLFxuICAnRFJPUCBUQUJMRSBJRiBFWElTVFMgb3B0aW9ucycsXG4gICdEUk9QIFRBQkxFIElGIEVYSVNUUyBhbnN3ZXJzJyxcbl1cblxuY29uc3QgU1FMX0lOU0VSVCA9IHtcbiAgcXVlc3Rpb246IGBJTlNFUlQgT1IgSUdOT1JFIElOVE8gcXVlc3Rpb25zIChpZCwgdHlwZSwgbGFiZWwsIHJlcXVpcmVkKSBWQUxVRVMgKD8sID8sID8sID8pYCxcbiAgb3B0aW9uOiBgSU5TRVJUIE9SIElHTk9SRSBJTlRPIG9wdGlvbnMgKHF1ZXN0aW9uX2lkLCBvcHRpb25faWQsIGxhYmVsKSBWQUxVRVMgKD8sID8sID8pYCxcbiAgdXNlcjogYElOU0VSVCBPUiBJR05PUkUgSU5UTyB1c2VycyAodXVpZCwgdXNlcl9hZ2VudCwgdGltZXN0YW1wKSBWQUxVRVMgKD8sID8sID8pYCxcbiAgYW5zd2VyOiBgSU5TRVJUIE9SIElHTk9SRSBJTlRPIGFuc3dlcnMgKHVzZXJfaWQsIHF1ZXN0aW9uX2lkLCBhbnN3ZXIpIFZBTFVFUyAoPywgPywgPylgLFxufVxuXG5jb25zdCBTUUxfU0VMRUNUID0ge1xuICB1c2VySWQ6IGBTRUxFQ1QgbGFzdF9pbnNlcnRfcm93aWQoKSBBUyBpZCBGUk9NIHVzZXJzYCxcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmVyU3VydmV5IGV4dGVuZHMgU2VydmVyQWN0aXZpdHkge1xuICBjb25zdHJ1Y3RvcihjbGllbnRUeXBlLCBzdXJ2ZXlDb25maWcpIHtcbiAgICBzdXBlcihTQ0VORV9JRCk7XG5cbiAgICAvKipcbiAgICAgKiBDb25maWd1cmF0aW9uIG9mIHRoZSBzdXJ2ZXkuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLnN1cnZleUNvbmZpZyA9IHN1cnZleUNvbmZpZztcblxuICAgIC8qKlxuICAgICAqIFBvaW50ZXIgdG8gdGhlIGRhdGFiYXNlIGNvbm5lY3Rpb24uXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLl9kYiA9IG51bGw7XG5cbiAgICB0aGlzLmFkZENsaWVudFR5cGUoY2xpZW50VHlwZSk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGRpcmVjdG9yeUNvbmZpZzogJ2RiRGlyZWN0b3J5JyxcbiAgICAgIGRiTmFtZTogJ3N1cnZleS5kYicsXG4gICAgICBkcm9wVGFibGVzOiB0cnVlLFxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICB0aGlzLl9zaGFyZWRDb25maWdTZXJ2aWNlID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtY29uZmlnJyk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBjb25zdCBkaXJlY3RvcnlDb25maWcgPSB0aGlzLm9wdGlvbnMuZGlyZWN0b3J5Q29uZmlnO1xuICAgIGxldCBkaXIgPSB0aGlzLl9zaGFyZWRDb25maWdTZXJ2aWNlLmdldChkaXJlY3RvcnlDb25maWcpW2RpcmVjdG9yeUNvbmZpZ107XG4gICAgZGlyID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIGRpcik7XG4gICAgZGlyID0gcGF0aC5ub3JtYWxpemUoZGlyKTsgLy8gQHRvZG8gLSBjaGVjayBpdCBkb2VzIHRoZSBqb2Igb24gd2luZG93c1xuICAgIGZzZS5lbnN1cmVEaXJTeW5jKGRpcik7IC8vIGNyZWF0ZSBkaXJlY3RvcnkgaWYgbm90IGV4aXN0c1xuXG4gICAgLy8gY3JlYXRlIHRoZSBkYXRhYmFzZSBpZiBub3QgZXhpc3RcbiAgICBjb25zdCBkYk5hbWUgPSBwYXRoLmpvaW4oZGlyLCB0aGlzLm9wdGlvbnMuZGJOYW1lKTtcbiAgICBjb25zdCBkYiA9IG5ldyBzcWwuRGF0YWJhc2UoZGJOYW1lKTtcblxuICAgIC8vIG1ha2Ugc3VyZSBxdWVyaWVzIGFyZSBleGVjdXRlZCBzZXF1ZW5jaWFsbHlcbiAgICBkYi5zZXJpYWxpemUoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5kcm9wVGFibGVzID09PSB0cnVlKVxuICAgICAgICBTUUxfRFJPUC5mb3JFYWNoKChxdWVyeSkgPT4gZGIucnVuKHF1ZXJ5KSk7XG5cbiAgICAgIC8vIGNyZWF0ZSB0YWJsZXNcbiAgICAgIFNRTF9DUkVBVEUuZm9yRWFjaCgocXVlcnkpID0+IGRiLnJ1bihxdWVyeSkpO1xuXG4gICAgICAvLyBwb3B1bGF0ZSBkYiB3aXRoIHN1cnZleSBkZWZpbml0aW9uXG4gICAgICBjb25zdCBzdG10UXVlc3Rpb24gPSBkYi5wcmVwYXJlKFNRTF9JTlNFUlQucXVlc3Rpb24pO1xuICAgICAgY29uc3Qgc3RtdE9wdGlvbiA9IGRiLnByZXBhcmUoU1FMX0lOU0VSVC5vcHRpb24pO1xuXG4gICAgICB0aGlzLnN1cnZleUNvbmZpZy5mb3JFYWNoKChxdWVzdGlvbiwgaW5kZXgpID0+IHtcbiAgICAgICAgcXVlc3Rpb24uaWQgPSBpbmRleDtcbiAgICAgICAgc3RtdFF1ZXN0aW9uLnJ1bihxdWVzdGlvbi5pZCwgcXVlc3Rpb24udHlwZSwgcXVlc3Rpb24ubGFiZWwsIHF1ZXN0aW9uLnJlcXVpcmVkKTtcblxuICAgICAgICBpZiAocXVlc3Rpb24ub3B0aW9ucykge1xuICAgICAgICAgIGZvciAobGV0IGlkIGluIHF1ZXN0aW9uLm9wdGlvbnMpIHtcbiAgICAgICAgICAgIGxldCBsYWJlbCA9IHF1ZXN0aW9uLm9wdGlvbnNbaWRdO1xuICAgICAgICAgICAgc3RtdE9wdGlvbi5ydW4oaW5kZXgsIGlkLCBsYWJlbCk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHN0bXRRdWVzdGlvbi5maW5hbGl6ZSgpO1xuICAgICAgc3RtdE9wdGlvbi5maW5hbGl6ZSgpO1xuICAgICAgLy8gZGIuZWFjaChTUUxfVEVTVF9ERUZJTklUSU9OLCAoZXJyLCByb3cpID0+IGNvbnNvbGUubG9nKHJvdykpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fZGIgPSBkYjtcbiAgfVxuXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3JlcXVlc3QnLCB0aGlzLl9vblJlcXVlc3QoY2xpZW50KSk7XG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ2Fuc3dlcnMnLCB0aGlzLl9vbkFuc3dlcnMoY2xpZW50KSk7XG4gIH1cblxuICBfb25SZXF1ZXN0KGNsaWVudCkge1xuICAgIHJldHVybiAoKSA9PiB0aGlzLnNlbmQoY2xpZW50LCAnY29uZmlnJywgdGhpcy5zdXJ2ZXlDb25maWcpO1xuICB9XG5cbiAgX29uQW5zd2VycyhjbGllbnQpIHtcbiAgICByZXR1cm4gKGFuc3dlcnMpID0+IHRoaXMuX3BlcnNpc3QoY2xpZW50LCBhbnN3ZXJzKTtcbiAgfVxuXG4gIF9wZXJzaXN0KGNsaWVudCwgZGF0YSkge1xuICAgIGNvbnN0IGRiID0gdGhpcy5fZGI7XG5cbiAgICBkYi5zZXJpYWxpemUoKCkgPT4ge1xuICAgICAgLy8gZG8gYSB0cmFuc2F0aW9uIHRvIHJldHJpZXZlIHRoZSBkYiB1c2VyIGlkXG4gICAgICBkYi5ydW4oJ0JFR0lOJyk7XG4gICAgICBkYi5ydW4oU1FMX0lOU0VSVC51c2VyLCBjbGllbnQudXVpZCwgZGF0YS51c2VyQWdlbnQsIGRhdGEudGltZXN0YW1wKTtcblxuICAgICAgZGIuZ2V0KFNRTF9TRUxFQ1QudXNlcklkLCAoZXJyLCByb3cpID0+IHtcbiAgICAgICAgaWYgKGVycikgY29uc29sZS5lcnJvcihlcnIpO1xuXG4gICAgICAgIGNvbnN0IHVzZXJJZCA9IHJvdy5pZDtcbiAgICAgICAgY29uc3Qgc3RtdEFuc3dlciA9IGRiLnByZXBhcmUoU1FMX0lOU0VSVC5hbnN3ZXIpXG5cbiAgICAgICAgZm9yIChsZXQgcXVlc3Rpb25JZCBpbiBkYXRhLmFuc3dlcnMpIHtcbiAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGRhdGEuYW5zd2Vyc1txdWVzdGlvbklkXTtcblxuICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHJlc3BvbnNlKSlcbiAgICAgICAgICAgIHJlc3BvbnNlLmZvckVhY2goKGVsZW1lbnQpID0+IHN0bXRBbnN3ZXIucnVuKHVzZXJJZCwgcXVlc3Rpb25JZCwgZWxlbWVudCkpO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHN0bXRBbnN3ZXIucnVuKHVzZXJJZCwgcXVlc3Rpb25JZCwgcmVzcG9uc2UpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgZGIucnVuKCdDT01NSVQnKTsgLy8gdGhpcyBpcyBleGVjdXRlZCBqdXN0IGFmdGVyIHRoZSB1c2VySWQgc2VsZWN0aW9uXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==