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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvc2VydmVyL3NjZW5lcy9TZXJ2ZXJTdXJ2ZXkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozt1QkFBZ0IsVUFBVTs7OztvQkFDVCxNQUFNOzs7O2tDQUNJLHdCQUF3Qjs7Ozt1QkFDaEMsU0FBUzs7OztBQUU1QixJQUFNLEdBQUcsR0FBRyxxQkFBTyxPQUFPLEVBQUUsQ0FBQztBQUM3QixJQUFNLFFBQVEsR0FBRyxRQUFRLENBQUM7QUFDMUIsSUFBTSxhQUFhLEdBQUcsY0FBYyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JyQyxJQUFNLFVBQVUsR0FBRyxvckJBOEJsQixDQUFDOztBQUVGLElBQU0sUUFBUSxHQUFHLENBQ2YsNEJBQTRCLEVBQzVCLGdDQUFnQyxFQUNoQyw4QkFBOEIsRUFDOUIsOEJBQThCLENBQy9CLENBQUE7O0FBRUQsSUFBTSxVQUFVLEdBQUc7QUFDakIsVUFBUSxtRkFBbUY7QUFDM0YsUUFBTSxrRkFBa0Y7QUFDeEYsTUFBSSw4RUFBOEU7QUFDbEYsUUFBTSxpRkFBaUY7Q0FDeEYsQ0FBQTs7QUFFRCxJQUFNLFVBQVUsR0FBRztBQUNqQixRQUFNLCtDQUErQztDQUN0RCxDQUFBOztJQUVvQixZQUFZO1lBQVosWUFBWTs7QUFDcEIsV0FEUSxZQUFZLENBQ25CLFVBQVUsRUFBRSxZQUFZLEVBQUU7MEJBRG5CLFlBQVk7O0FBRTdCLCtCQUZpQixZQUFZLDZDQUV2QixRQUFRLEVBQUU7Ozs7OztBQU1oQixRQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQzs7Ozs7O0FBTWpDLFFBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDOztBQUVoQixRQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDOztBQUUvQixRQUFNLFFBQVEsR0FBRztBQUNmLHFCQUFlLEVBQUUsYUFBYTtBQUM5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RSxPQUFPLENBQUM7YUFBQSxDQUFDLENBQUMsS0FFM0UsVUFBVSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDOzs7QUFOakQsZUFBSyxJQUFJLFVBQVUsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO2tCQUE1QixVQUFVO1dBT2xCO1NBQ0YsQ0FBQyxDQUFDOztBQUVILFVBQUUsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7T0FDbEIsQ0FBQyxDQUFDO0tBQ0o7OztTQWpIa0IsWUFBWTs7O3FCQUFaLFlBQVkiLCJmaWxlIjoiL1VzZXJzL3NjaG5lbGwvRGV2ZWxvcG1lbnQvd2ViL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zb3VuZHdvcmtzL3NyYy9zZXJ2ZXIvc2NlbmVzL1NlcnZlclN1cnZleS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmc2UgZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgU2VydmVyQWN0aXZpdHkgZnJvbSAnLi4vY29yZS9TZXJ2ZXJBY3Rpdml0eSc7XG5pbXBvcnQgc3FsaXRlIGZyb20gJ3NxbGl0ZTMnO1xuXG5jb25zdCBzcWwgPSBzcWxpdGUudmVyYm9zZSgpO1xuY29uc3QgU0NFTkVfSUQgPSAnc3VydmV5JztcbmNvbnN0IERBVEFCQVNFX05BTUUgPSAnZGIvc3VydmV5LmRiJztcblxuLy8gdGVzdCBxdWVyeVxuLy8gY29uc3QgU1FMX1RFU1RfREVGSU5JVElPTiA9IGBcbi8vIFNFTEVDVFxuLy8gICBxLmlkIEFTIHF1ZXN0aW9uX2lkLFxuLy8gICBxLnR5cGUsXG4vLyAgIHEucmVxdWlyZWQsXG4vLyAgIHEubGFiZWwgQVMgcXVlc3Rpb25fbGFiZWwsXG4vLyAgIG8ub3B0aW9uX2lkLFxuLy8gICBvLmxhYmVsIEFTIG9wdGlvbl9sYWJlbFxuLy8gRlJPTSBxdWVzdGlvbnMgQVMgcVxuLy8gICBJTk5FUiBKT0lOIG9wdGlvbnMgQVMgb1xuLy8gICBPTiBxLmlkID0gby5xdWVzdGlvbl9pZFxuLy8gYDtcblxuY29uc3QgU1FMX0NSRUFURSA9IFtcbiAgYENSRUFURSBUQUJMRSBJRiBOT1QgRVhJU1RTIHVzZXJzIChcbiAgICBpZCBJTlRFR0VSIFBSSU1BUlkgS0VZLFxuICAgIHV1aWQsXG4gICAgdXNlcl9hZ2VudCxcbiAgICB0aW1lc3RhbXAsXG4gICAgVU5JUVVFKHV1aWQsIHVzZXJfYWdlbnQpXG4gIClgLFxuICBgQ1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMgcXVlc3Rpb25zIChcbiAgICBpZCBJTlRFR0VSIFBSSU1BUlkgS0VZLFxuICAgIHR5cGUsXG4gICAgbGFiZWwsXG4gICAgcmVxdWlyZWRcbiAgKWAsXG4gIGBDUkVBVEUgVEFCTEUgSUYgTk9UIEVYSVNUUyBvcHRpb25zIChcbiAgICBpZCBJTlRFR0VSIFBSSU1BUlkgS0VZLFxuICAgIHF1ZXN0aW9uX2lkLFxuICAgIG9wdGlvbl9pZCxcbiAgICBsYWJlbCxcbiAgICBVTklRVUUgKHF1ZXN0aW9uX2lkLCBvcHRpb25faWQpXG4gICAgRk9SRUlHTiBLRVkgKHF1ZXN0aW9uX2lkKSBSRUZFUkVOQ0VTIHF1ZXN0aW9ucyhpZClcbiAgKWAsXG4gIGBDUkVBVEUgVEFCTEUgSUYgTk9UIEVYSVNUUyBhbnN3ZXJzIChcbiAgICBpZCBJTlRFUkdFUiBQUklNQVJZIEtFWSxcbiAgICB1c2VyX2lkLFxuICAgIHF1ZXN0aW9uX2lkLFxuICAgIGFuc3dlcixcbiAgICBVTklRVUUgKHVzZXJfaWQsIHF1ZXN0aW9uX2lkLCBhbnN3ZXIpLFxuICAgIEZPUkVJR04gS0VZIChxdWVzdGlvbl9pZCkgUkVGRVJFTkNFUyBxdWVzdGlvbnMoaWQpXG4gIClgXG5dO1xuXG5jb25zdCBTUUxfRFJPUCA9IFtcbiAgJ0RST1AgVEFCTEUgSUYgRVhJU1RTIHVzZXJzJyxcbiAgJ0RST1AgVEFCTEUgSUYgRVhJU1RTIHF1ZXN0aW9ucycsXG4gICdEUk9QIFRBQkxFIElGIEVYSVNUUyBvcHRpb25zJyxcbiAgJ0RST1AgVEFCTEUgSUYgRVhJU1RTIGFuc3dlcnMnLFxuXVxuXG5jb25zdCBTUUxfSU5TRVJUID0ge1xuICBxdWVzdGlvbjogYElOU0VSVCBPUiBJR05PUkUgSU5UTyBxdWVzdGlvbnMgKGlkLCB0eXBlLCBsYWJlbCwgcmVxdWlyZWQpIFZBTFVFUyAoPywgPywgPywgPylgLFxuICBvcHRpb246IGBJTlNFUlQgT1IgSUdOT1JFIElOVE8gb3B0aW9ucyAocXVlc3Rpb25faWQsIG9wdGlvbl9pZCwgbGFiZWwpIFZBTFVFUyAoPywgPywgPylgLFxuICB1c2VyOiBgSU5TRVJUIE9SIElHTk9SRSBJTlRPIHVzZXJzICh1dWlkLCB1c2VyX2FnZW50LCB0aW1lc3RhbXApIFZBTFVFUyAoPywgPywgPylgLFxuICBhbnN3ZXI6IGBJTlNFUlQgT1IgSUdOT1JFIElOVE8gYW5zd2VycyAodXNlcl9pZCwgcXVlc3Rpb25faWQsIGFuc3dlcikgVkFMVUVTICg/LCA/LCA/KWAsXG59XG5cbmNvbnN0IFNRTF9TRUxFQ1QgPSB7XG4gIHVzZXJJZDogYFNFTEVDVCBsYXN0X2luc2VydF9yb3dpZCgpIEFTIGlkIEZST00gdXNlcnNgLFxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2ZXJTdXJ2ZXkgZXh0ZW5kcyBTZXJ2ZXJBY3Rpdml0eSB7XG4gIGNvbnN0cnVjdG9yKGNsaWVudFR5cGUsIHN1cnZleUNvbmZpZykge1xuICAgIHN1cGVyKFNDRU5FX0lEKTtcblxuICAgIC8qKlxuICAgICAqIENvbmZpZ3VyYXRpb24gb2YgdGhlIHN1cnZleS5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuc3VydmV5Q29uZmlnID0gc3VydmV5Q29uZmlnO1xuXG4gICAgLyoqXG4gICAgICogUG9pbnRlciB0byB0aGUgZGF0YWJhc2UgY29ubmVjdGlvbi5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuX2RiID0gbnVsbDtcblxuICAgIHRoaXMuYWRkQ2xpZW50VHlwZShjbGllbnRUeXBlKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgZGlyZWN0b3J5Q29uZmlnOiAnZGJEaXJlY3RvcnknLFxuICAgICAgZGJOYW1lOiAnc3VydmV5LmRiJyxcbiAgICAgIGRyb3BUYWJsZXM6IHRydWUsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIHRoaXMuX3NoYXJlZENvbmZpZ1NlcnZpY2UgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1jb25maWcnKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIGNvbnN0IGRpcmVjdG9yeUNvbmZpZyA9IHRoaXMub3B0aW9ucy5kaXJlY3RvcnlDb25maWc7XG4gICAgbGV0IGRpciA9IHRoaXMuX3NoYXJlZENvbmZpZ1NlcnZpY2UuZ2V0KGRpcmVjdG9yeUNvbmZpZylbZGlyZWN0b3J5Q29uZmlnXTtcbiAgICBkaXIgPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgZGlyKTtcbiAgICBkaXIgPSBwYXRoLm5vcm1hbGl6ZShkaXIpOyAvLyBAdG9kbyAtIGNoZWNrIGl0IGRvZXMgdGhlIGpvYiBvbiB3aW5kb3dzXG4gICAgZnNlLmVuc3VyZURpclN5bmMoZGlyKTsgLy8gY3JlYXRlIGRpcmVjdG9yeSBpZiBub3QgZXhpc3RzXG5cbiAgICAvLyBjcmVhdGUgdGhlIGRhdGFiYXNlIGlmIG5vdCBleGlzdFxuICAgIGNvbnN0IGRiTmFtZSA9IHBhdGguam9pbihkaXIsIHRoaXMub3B0aW9ucy5kYk5hbWUpO1xuICAgIGNvbnN0IGRiID0gbmV3IHNxbC5EYXRhYmFzZShkYk5hbWUpO1xuXG4gICAgLy8gbWFrZSBzdXJlIHF1ZXJpZXMgYXJlIGV4ZWN1dGVkIHNlcXVlbmNpYWxseVxuICAgIGRiLnNlcmlhbGl6ZSgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmRyb3BUYWJsZXMgPT09IHRydWUpXG4gICAgICAgIFNRTF9EUk9QLmZvckVhY2goKHF1ZXJ5KSA9PiBkYi5ydW4ocXVlcnkpKTtcblxuICAgICAgLy8gY3JlYXRlIHRhYmxlc1xuICAgICAgU1FMX0NSRUFURS5mb3JFYWNoKChxdWVyeSkgPT4gZGIucnVuKHF1ZXJ5KSk7XG5cbiAgICAgIC8vIHBvcHVsYXRlIGRiIHdpdGggc3VydmV5IGRlZmluaXRpb25cbiAgICAgIGNvbnN0IHN0bXRRdWVzdGlvbiA9IGRiLnByZXBhcmUoU1FMX0lOU0VSVC5xdWVzdGlvbik7XG4gICAgICBjb25zdCBzdG10T3B0aW9uID0gZGIucHJlcGFyZShTUUxfSU5TRVJULm9wdGlvbik7XG5cbiAgICAgIHRoaXMuc3VydmV5Q29uZmlnLmZvckVhY2goKHF1ZXN0aW9uLCBpbmRleCkgPT4ge1xuICAgICAgICBxdWVzdGlvbi5pZCA9IGluZGV4O1xuICAgICAgICBzdG10UXVlc3Rpb24ucnVuKHF1ZXN0aW9uLmlkLCBxdWVzdGlvbi50eXBlLCBxdWVzdGlvbi5sYWJlbCwgcXVlc3Rpb24ucmVxdWlyZWQpO1xuXG4gICAgICAgIGlmIChxdWVzdGlvbi5vcHRpb25zKSB7XG4gICAgICAgICAgZm9yIChsZXQgaWQgaW4gcXVlc3Rpb24ub3B0aW9ucykge1xuICAgICAgICAgICAgbGV0IGxhYmVsID0gcXVlc3Rpb24ub3B0aW9uc1tpZF07XG4gICAgICAgICAgICBzdG10T3B0aW9uLnJ1bihpbmRleCwgaWQsIGxhYmVsKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgc3RtdFF1ZXN0aW9uLmZpbmFsaXplKCk7XG4gICAgICBzdG10T3B0aW9uLmZpbmFsaXplKCk7XG4gICAgICAvLyBkYi5lYWNoKFNRTF9URVNUX0RFRklOSVRJT04sIChlcnIsIHJvdykgPT4gY29uc29sZS5sb2cocm93KSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9kYiA9IGRiO1xuICB9XG5cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncmVxdWVzdCcsIHRoaXMuX29uUmVxdWVzdChjbGllbnQpKTtcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAnYW5zd2VycycsIHRoaXMuX29uQW5zd2VycyhjbGllbnQpKTtcbiAgfVxuXG4gIF9vblJlcXVlc3QoY2xpZW50KSB7XG4gICAgcmV0dXJuICgpID0+IHRoaXMuc2VuZChjbGllbnQsICdjb25maWcnLCB0aGlzLnN1cnZleUNvbmZpZyk7XG4gIH1cblxuICBfb25BbnN3ZXJzKGNsaWVudCkge1xuICAgIHJldHVybiAoYW5zd2VycykgPT4gdGhpcy5fcGVyc2lzdChjbGllbnQsIGFuc3dlcnMpO1xuICB9XG5cbiAgX3BlcnNpc3QoY2xpZW50LCBkYXRhKSB7XG4gICAgY29uc3QgZGIgPSB0aGlzLl9kYjtcblxuICAgIGRiLnNlcmlhbGl6ZSgoKSA9PiB7XG4gICAgICAvLyBkbyBhIHRyYW5zYXRpb24gdG8gcmV0cmlldmUgdGhlIGRiIHVzZXIgaWRcbiAgICAgIGRiLnJ1bignQkVHSU4nKTtcbiAgICAgIGRiLnJ1bihTUUxfSU5TRVJULnVzZXIsIGNsaWVudC51dWlkLCBkYXRhLnVzZXJBZ2VudCwgZGF0YS50aW1lc3RhbXApO1xuXG4gICAgICBkYi5nZXQoU1FMX1NFTEVDVC51c2VySWQsIChlcnIsIHJvdykgPT4ge1xuICAgICAgICBpZiAoZXJyKSBjb25zb2xlLmVycm9yKGVycik7XG5cbiAgICAgICAgY29uc3QgdXNlcklkID0gcm93LmlkO1xuICAgICAgICBjb25zdCBzdG10QW5zd2VyID0gZGIucHJlcGFyZShTUUxfSU5TRVJULmFuc3dlcilcblxuICAgICAgICBmb3IgKGxldCBxdWVzdGlvbklkIGluIGRhdGEuYW5zd2Vycykge1xuICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gZGF0YS5hbnN3ZXJzW3F1ZXN0aW9uSWRdO1xuXG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVzcG9uc2UpKVxuICAgICAgICAgICAgcmVzcG9uc2UuZm9yRWFjaCgoZWxlbWVudCkgPT4gc3RtdEFuc3dlci5ydW4odXNlcklkLCBxdWVzdGlvbklkLCBlbGVtZW50KSk7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgc3RtdEFuc3dlci5ydW4odXNlcklkLCBxdWVzdGlvbklkLCByZXNwb25zZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBkYi5ydW4oJ0NPTU1JVCcpOyAvLyB0aGlzIGlzIGV4ZWN1dGVkIGp1c3QgYWZ0ZXIgdGhlIHVzZXJJZCBzZWxlY3Rpb25cbiAgICB9KTtcbiAgfVxufVxuIl19