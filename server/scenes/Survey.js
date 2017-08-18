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
    var _this = (0, _possibleConstructorReturn3.default)(this, (Survey.__proto__ || (0, _getPrototypeOf2.default)(Survey)).call(this, SCENE_ID, clientType));

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
      (0, _get3.default)(Survey.prototype.__proto__ || (0, _getPrototypeOf2.default)(Survey.prototype), 'connect', this).call(this, client);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlN1cnZleS5qcyJdLCJuYW1lcyI6WyJzcWwiLCJ2ZXJib3NlIiwiU1FMX0NSRUFURSIsIlNRTF9EUk9QIiwiU1FMX0lOU0VSVCIsInF1ZXN0aW9uIiwib3B0aW9uIiwidXNlciIsImFuc3dlciIsIlNRTF9TRUxFQ1QiLCJ1c2VySWQiLCJTQ0VORV9JRCIsIlN1cnZleSIsImNsaWVudFR5cGUiLCJzdXJ2ZXlDb25maWciLCJfZGIiLCJkZWZhdWx0cyIsImNvbmZpZ0l0ZW0iLCJkYk5hbWUiLCJkcm9wVGFibGVzIiwiY29uZmlndXJlIiwiX3NoYXJlZENvbmZpZ1NlcnZpY2UiLCJyZXF1aXJlIiwib3B0aW9ucyIsImRpciIsImdldCIsImpvaW4iLCJwcm9jZXNzIiwiY3dkIiwiZW5zdXJlRGlyU3luYyIsImRiIiwiRGF0YWJhc2UiLCJzZXJpYWxpemUiLCJmb3JFYWNoIiwicXVlcnkiLCJydW4iLCJzdG10UXVlc3Rpb24iLCJwcmVwYXJlIiwic3RtdE9wdGlvbiIsImluZGV4IiwiaWQiLCJ0eXBlIiwibGFiZWwiLCJyZXF1aXJlZCIsImZpbmFsaXplIiwiY2xpZW50IiwicmVjZWl2ZSIsIl9vblJlcXVlc3QiLCJfb25BbnN3ZXJzIiwic2VuZCIsImFuc3dlcnMiLCJfcGVyc2lzdCIsImRhdGEiLCJ1dWlkIiwidXNlckFnZW50IiwidGltZXN0YW1wIiwiZXJyIiwicm93IiwiY29uc29sZSIsImVycm9yIiwic3RtdEFuc3dlciIsInF1ZXN0aW9uSWQiLCJyZXNwb25zZSIsIkFycmF5IiwiaXNBcnJheSIsImVsZW1lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxNQUFNLGlCQUFPQyxPQUFQLEVBQVo7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsSUFBTUMsYUFB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TixDQUFjRixRQUFkLENBQUosRUFDRUEsU0FBUzdCLE9BQVQsQ0FBaUIsVUFBQ2dDLE9BQUQ7QUFBQSxxQkFBYUwsV0FBV3pCLEdBQVgsQ0FBZXpCLE1BQWYsRUFBdUJtRCxVQUF2QixFQUFtQ0ksT0FBbkMsQ0FBYjtBQUFBLGFBQWpCLEVBREYsS0FHRUwsV0FBV3pCLEdBQVgsQ0FBZXpCLE1BQWYsRUFBdUJtRCxVQUF2QixFQUFtQ0MsUUFBbkM7QUFaa0M7O0FBTXRDLGVBQUssSUFBSUQsVUFBVCxJQUF1QlQsS0FBS0YsT0FBNUIsRUFBcUM7QUFBQSxrQkFBNUJXLFVBQTRCO0FBT3BDO0FBQ0YsU0FkRDs7QUFnQkEvQixXQUFHSyxHQUFILENBQU8sUUFBUCxFQXJCaUIsQ0FxQkM7QUFDbkIsT0F0QkQ7QUF1QkQ7Ozs7O2tCQWpIa0J2QixNIiwiZmlsZSI6IlN1cnZleS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmc2UgZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgU2NlbmUgZnJvbSAnLi4vY29yZS9TY2VuZSc7XG5pbXBvcnQgc3FsaXRlIGZyb20gJ3NxbGl0ZTMnO1xuXG5jb25zdCBzcWwgPSBzcWxpdGUudmVyYm9zZSgpO1xuXG4vLyB0ZXN0IHF1ZXJ5XG4vLyBjb25zdCBTUUxfVEVTVF9ERUZJTklUSU9OID0gYFxuLy8gU0VMRUNUXG4vLyAgIHEuaWQgQVMgcXVlc3Rpb25faWQsXG4vLyAgIHEudHlwZSxcbi8vICAgcS5yZXF1aXJlZCxcbi8vICAgcS5sYWJlbCBBUyBxdWVzdGlvbl9sYWJlbCxcbi8vICAgby5vcHRpb25faWQsXG4vLyAgIG8ubGFiZWwgQVMgb3B0aW9uX2xhYmVsXG4vLyBGUk9NIHF1ZXN0aW9ucyBBUyBxXG4vLyAgIElOTkVSIEpPSU4gb3B0aW9ucyBBUyBvXG4vLyAgIE9OIHEuaWQgPSBvLnF1ZXN0aW9uX2lkXG4vLyBgO1xuXG5jb25zdCBTUUxfQ1JFQVRFID0gW1xuICBgQ1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMgdXNlcnMgKFxuICAgIGlkIElOVEVHRVIgUFJJTUFSWSBLRVksXG4gICAgdXVpZCxcbiAgICB1c2VyX2FnZW50LFxuICAgIHRpbWVzdGFtcCxcbiAgICBVTklRVUUodXVpZCwgdXNlcl9hZ2VudClcbiAgKWAsXG4gIGBDUkVBVEUgVEFCTEUgSUYgTk9UIEVYSVNUUyBxdWVzdGlvbnMgKFxuICAgIGlkIElOVEVHRVIgUFJJTUFSWSBLRVksXG4gICAgdHlwZSxcbiAgICBsYWJlbCxcbiAgICByZXF1aXJlZFxuICApYCxcbiAgYENSRUFURSBUQUJMRSBJRiBOT1QgRVhJU1RTIG9wdGlvbnMgKFxuICAgIGlkIElOVEVHRVIgUFJJTUFSWSBLRVksXG4gICAgcXVlc3Rpb25faWQsXG4gICAgb3B0aW9uX2lkLFxuICAgIGxhYmVsLFxuICAgIFVOSVFVRSAocXVlc3Rpb25faWQsIG9wdGlvbl9pZClcbiAgICBGT1JFSUdOIEtFWSAocXVlc3Rpb25faWQpIFJFRkVSRU5DRVMgcXVlc3Rpb25zKGlkKVxuICApYCxcbiAgYENSRUFURSBUQUJMRSBJRiBOT1QgRVhJU1RTIGFuc3dlcnMgKFxuICAgIGlkIElOVEVSR0VSIFBSSU1BUlkgS0VZLFxuICAgIHVzZXJfaWQsXG4gICAgcXVlc3Rpb25faWQsXG4gICAgYW5zd2VyLFxuICAgIFVOSVFVRSAodXNlcl9pZCwgcXVlc3Rpb25faWQsIGFuc3dlciksXG4gICAgRk9SRUlHTiBLRVkgKHF1ZXN0aW9uX2lkKSBSRUZFUkVOQ0VTIHF1ZXN0aW9ucyhpZClcbiAgKWBcbl07XG5cbmNvbnN0IFNRTF9EUk9QID0gW1xuICAnRFJPUCBUQUJMRSBJRiBFWElTVFMgdXNlcnMnLFxuICAnRFJPUCBUQUJMRSBJRiBFWElTVFMgcXVlc3Rpb25zJyxcbiAgJ0RST1AgVEFCTEUgSUYgRVhJU1RTIG9wdGlvbnMnLFxuICAnRFJPUCBUQUJMRSBJRiBFWElTVFMgYW5zd2VycycsXG5dXG5cbmNvbnN0IFNRTF9JTlNFUlQgPSB7XG4gIHF1ZXN0aW9uOiBgSU5TRVJUIE9SIElHTk9SRSBJTlRPIHF1ZXN0aW9ucyAoaWQsIHR5cGUsIGxhYmVsLCByZXF1aXJlZCkgVkFMVUVTICg/LCA/LCA/LCA/KWAsXG4gIG9wdGlvbjogYElOU0VSVCBPUiBJR05PUkUgSU5UTyBvcHRpb25zIChxdWVzdGlvbl9pZCwgb3B0aW9uX2lkLCBsYWJlbCkgVkFMVUVTICg/LCA/LCA/KWAsXG4gIHVzZXI6IGBJTlNFUlQgT1IgSUdOT1JFIElOVE8gdXNlcnMgKHV1aWQsIHVzZXJfYWdlbnQsIHRpbWVzdGFtcCkgVkFMVUVTICg/LCA/LCA/KWAsXG4gIGFuc3dlcjogYElOU0VSVCBPUiBJR05PUkUgSU5UTyBhbnN3ZXJzICh1c2VyX2lkLCBxdWVzdGlvbl9pZCwgYW5zd2VyKSBWQUxVRVMgKD8sID8sID8pYCxcbn1cblxuY29uc3QgU1FMX1NFTEVDVCA9IHtcbiAgdXNlcklkOiBgU0VMRUNUIGxhc3RfaW5zZXJ0X3Jvd2lkKCkgQVMgaWQgRlJPTSB1c2Vyc2AsXG59XG5cblxuY29uc3QgU0NFTkVfSUQgPSAnc3VydmV5JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3VydmV5IGV4dGVuZHMgU2NlbmUge1xuICBjb25zdHJ1Y3RvcihjbGllbnRUeXBlLCBzdXJ2ZXlDb25maWcpIHtcbiAgICBzdXBlcihTQ0VORV9JRCwgY2xpZW50VHlwZSk7XG5cbiAgICAvKipcbiAgICAgKiBDb25maWd1cmF0aW9uIG9mIHRoZSBzdXJ2ZXkuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLnN1cnZleUNvbmZpZyA9IHN1cnZleUNvbmZpZztcblxuICAgIC8qKlxuICAgICAqIFBvaW50ZXIgdG8gdGhlIGRhdGFiYXNlIGNvbm5lY3Rpb24uXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLl9kYiA9IG51bGw7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGNvbmZpZ0l0ZW06ICdkYkRpcmVjdG9yeScsXG4gICAgICBkYk5hbWU6ICdzdXJ2ZXkuZGInLFxuICAgICAgZHJvcFRhYmxlczogdHJ1ZSxcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgdGhpcy5fc2hhcmVkQ29uZmlnU2VydmljZSA9IHRoaXMucmVxdWlyZSgnc2hhcmVkLWNvbmZpZycpO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgY29uc3QgY29uZmlnSXRlbSA9IHRoaXMub3B0aW9ucy5jb25maWdJdGVtO1xuICAgIGxldCBkaXIgPSB0aGlzLl9zaGFyZWRDb25maWdTZXJ2aWNlLmdldChjb25maWdJdGVtKTtcblxuICAgIGlmIChkaXIgPT09IG51bGwpXG4gICAgICBkaXIgPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ2RiJyk7XG5cbiAgICBmc2UuZW5zdXJlRGlyU3luYyhkaXIpOyAvLyBjcmVhdGUgZGlyZWN0b3J5IGlmIG5vdCBleGlzdHNcblxuICAgIC8vIGNyZWF0ZSB0aGUgZGF0YWJhc2UgaWYgbm90IGV4aXN0XG4gICAgY29uc3QgZGJOYW1lID0gcGF0aC5qb2luKGRpciwgdGhpcy5vcHRpb25zLmRiTmFtZSk7XG4gICAgY29uc3QgZGIgPSBuZXcgc3FsLkRhdGFiYXNlKGRiTmFtZSk7XG5cbiAgICAvLyBtYWtlIHN1cmUgcXVlcmllcyBhcmUgZXhlY3V0ZWQgc2VxdWVuY2lhbGx5XG4gICAgZGIuc2VyaWFsaXplKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuZHJvcFRhYmxlcyA9PT0gdHJ1ZSlcbiAgICAgICAgU1FMX0RST1AuZm9yRWFjaCgocXVlcnkpID0+IGRiLnJ1bihxdWVyeSkpO1xuXG4gICAgICAvLyBjcmVhdGUgdGFibGVzXG4gICAgICBTUUxfQ1JFQVRFLmZvckVhY2goKHF1ZXJ5KSA9PiBkYi5ydW4ocXVlcnkpKTtcblxuICAgICAgLy8gcG9wdWxhdGUgZGIgd2l0aCBzdXJ2ZXkgZGVmaW5pdGlvblxuICAgICAgY29uc3Qgc3RtdFF1ZXN0aW9uID0gZGIucHJlcGFyZShTUUxfSU5TRVJULnF1ZXN0aW9uKTtcbiAgICAgIGNvbnN0IHN0bXRPcHRpb24gPSBkYi5wcmVwYXJlKFNRTF9JTlNFUlQub3B0aW9uKTtcblxuICAgICAgdGhpcy5zdXJ2ZXlDb25maWcuZm9yRWFjaCgocXVlc3Rpb24sIGluZGV4KSA9PiB7XG4gICAgICAgIHF1ZXN0aW9uLmlkID0gaW5kZXg7XG4gICAgICAgIHN0bXRRdWVzdGlvbi5ydW4ocXVlc3Rpb24uaWQsIHF1ZXN0aW9uLnR5cGUsIHF1ZXN0aW9uLmxhYmVsLCBxdWVzdGlvbi5yZXF1aXJlZCk7XG5cbiAgICAgICAgaWYgKHF1ZXN0aW9uLm9wdGlvbnMpIHtcbiAgICAgICAgICBmb3IgKGxldCBpZCBpbiBxdWVzdGlvbi5vcHRpb25zKSB7XG4gICAgICAgICAgICBsZXQgbGFiZWwgPSBxdWVzdGlvbi5vcHRpb25zW2lkXTtcbiAgICAgICAgICAgIHN0bXRPcHRpb24ucnVuKGluZGV4LCBpZCwgbGFiZWwpO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBzdG10UXVlc3Rpb24uZmluYWxpemUoKTtcbiAgICAgIHN0bXRPcHRpb24uZmluYWxpemUoKTtcbiAgICAgIC8vIGRiLmVhY2goU1FMX1RFU1RfREVGSU5JVElPTiwgKGVyciwgcm93KSA9PiBjb25zb2xlLmxvZyhyb3cpKTtcbiAgICB9KTtcblxuICAgIHRoaXMuX2RiID0gZGI7XG4gIH1cblxuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXF1ZXN0JywgdGhpcy5fb25SZXF1ZXN0KGNsaWVudCkpO1xuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdhbnN3ZXJzJywgdGhpcy5fb25BbnN3ZXJzKGNsaWVudCkpO1xuICB9XG5cbiAgX29uUmVxdWVzdChjbGllbnQpIHtcbiAgICByZXR1cm4gKCkgPT4gdGhpcy5zZW5kKGNsaWVudCwgJ2NvbmZpZycsIHRoaXMuc3VydmV5Q29uZmlnKTtcbiAgfVxuXG4gIF9vbkFuc3dlcnMoY2xpZW50KSB7XG4gICAgcmV0dXJuIChhbnN3ZXJzKSA9PiB0aGlzLl9wZXJzaXN0KGNsaWVudCwgYW5zd2Vycyk7XG4gIH1cblxuICBfcGVyc2lzdChjbGllbnQsIGRhdGEpIHtcbiAgICBjb25zdCBkYiA9IHRoaXMuX2RiO1xuXG4gICAgZGIuc2VyaWFsaXplKCgpID0+IHtcbiAgICAgIC8vIGRvIGEgdHJhbnNhdGlvbiB0byByZXRyaWV2ZSB0aGUgZGIgdXNlciBpZFxuICAgICAgZGIucnVuKCdCRUdJTicpO1xuICAgICAgZGIucnVuKFNRTF9JTlNFUlQudXNlciwgY2xpZW50LnV1aWQsIGRhdGEudXNlckFnZW50LCBkYXRhLnRpbWVzdGFtcCk7XG5cbiAgICAgIGRiLmdldChTUUxfU0VMRUNULnVzZXJJZCwgKGVyciwgcm93KSA9PiB7XG4gICAgICAgIGlmIChlcnIpIGNvbnNvbGUuZXJyb3IoZXJyKTtcblxuICAgICAgICBjb25zdCB1c2VySWQgPSByb3cuaWQ7XG4gICAgICAgIGNvbnN0IHN0bXRBbnN3ZXIgPSBkYi5wcmVwYXJlKFNRTF9JTlNFUlQuYW5zd2VyKVxuXG4gICAgICAgIGZvciAobGV0IHF1ZXN0aW9uSWQgaW4gZGF0YS5hbnN3ZXJzKSB7XG4gICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBkYXRhLmFuc3dlcnNbcXVlc3Rpb25JZF07XG5cbiAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXNwb25zZSkpXG4gICAgICAgICAgICByZXNwb25zZS5mb3JFYWNoKChlbGVtZW50KSA9PiBzdG10QW5zd2VyLnJ1bih1c2VySWQsIHF1ZXN0aW9uSWQsIGVsZW1lbnQpKTtcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdG10QW5zd2VyLnJ1bih1c2VySWQsIHF1ZXN0aW9uSWQsIHJlc3BvbnNlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGRiLnJ1bignQ09NTUlUJyk7IC8vIHRoaXMgaXMgZXhlY3V0ZWQganVzdCBhZnRlciB0aGUgdXNlcklkIHNlbGVjdGlvblxuICAgIH0pO1xuICB9XG59XG4iXX0=