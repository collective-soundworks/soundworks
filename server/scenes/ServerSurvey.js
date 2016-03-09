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

var _ServerActivity2 = require('../core/ServerActivity');

var _ServerActivity3 = _interopRequireDefault(_ServerActivity2);

var _sqlite = require('sqlite3');

var _sqlite2 = _interopRequireDefault(_sqlite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sql = _sqlite2.default.verbose();
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

var ServerSurvey = function (_ServerActivity) {
  (0, _inherits3.default)(ServerSurvey, _ServerActivity);

  function ServerSurvey(clientType, surveyConfig) {
    (0, _classCallCheck3.default)(this, ServerSurvey);


    /**
     * Configuration of the survey.
     * @type {Object}
     */

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ServerSurvey).call(this, SCENE_ID));

    _this.surveyConfig = surveyConfig;

    /**
     * Pointer to the database connection.
     * @type {Object}
     */
    _this._db = null;

    _this.addClientType(clientType);

    var defaults = {
      directoryConfig: 'dbDirectory',
      dbName: 'survey.db',
      dropTables: true
    };

    _this.configure(defaults);

    _this._sharedConfigService = _this.require('shared-config');
    return _this;
  }

  (0, _createClass3.default)(ServerSurvey, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      var directoryConfig = this.options.directoryConfig;
      var dir = this._sharedConfigService.get(directoryConfig)[directoryConfig];
      dir = _path2.default.join(process.cwd(), dir);
      dir = _path2.default.normalize(dir); // @todo - check it does the job on windows
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
      (0, _get3.default)((0, _getPrototypeOf2.default)(ServerSurvey.prototype), 'connect', this).call(this, client);

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
  return ServerSurvey;
}(_ServerActivity3.default);

exports.default = ServerSurvey;
//# sourceMappingURL=data:application/json;base64,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U0FBUyxJQUFJLEVBQUosQ0FIdUI7QUFJdEMsY0FBTSxhQUFhLEdBQUcsT0FBSCxDQUFXLFdBQVcsTUFBWCxDQUF4QixDQUpnQzs7cUNBTTdCO0FBQ1AsZ0JBQU0sV0FBVyxLQUFLLE9BQUwsQ0FBYSxVQUFiLENBQVg7O0FBRU4sZ0JBQUksTUFBTSxPQUFOLENBQWMsUUFBZCxDQUFKLEVBQ0UsU0FBUyxPQUFULENBQWlCLFVBQUMsT0FBRDtxQkFBYSxXQUFXLEdBQVgsQ0FBZSxNQUFmLEVBQXVCLFVBQXZCLEVBQW1DLE9BQW5DO2FBQWIsQ0FBakIsQ0FERixLQUdFLFdBQVcsR0FBWCxDQUFlLE1BQWYsRUFBdUIsVUFBdkIsRUFBbUMsUUFBbkMsRUFIRjtZQVRvQzs7QUFNdEMsZUFBSyxJQUFJLFVBQUosSUFBa0IsS0FBSyxPQUFMLEVBQWM7a0JBQTVCLFlBQTRCO1dBQXJDO1NBTndCLENBQTFCLENBTGlCOztBQXFCakIsV0FBRyxHQUFILENBQU8sUUFBUDtBQXJCaUIsT0FBTixDQUFiLENBSHFCOzs7U0F2RkoiLCJmaWxlIjoiU2VydmVyU3VydmV5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzZSBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBTZXJ2ZXJBY3Rpdml0eSBmcm9tICcuLi9jb3JlL1NlcnZlckFjdGl2aXR5JztcbmltcG9ydCBzcWxpdGUgZnJvbSAnc3FsaXRlMyc7XG5cbmNvbnN0IHNxbCA9IHNxbGl0ZS52ZXJib3NlKCk7XG5jb25zdCBTQ0VORV9JRCA9ICdzdXJ2ZXknO1xuY29uc3QgREFUQUJBU0VfTkFNRSA9ICdkYi9zdXJ2ZXkuZGInO1xuXG4vLyB0ZXN0IHF1ZXJ5XG4vLyBjb25zdCBTUUxfVEVTVF9ERUZJTklUSU9OID0gYFxuLy8gU0VMRUNUXG4vLyAgIHEuaWQgQVMgcXVlc3Rpb25faWQsXG4vLyAgIHEudHlwZSxcbi8vICAgcS5yZXF1aXJlZCxcbi8vICAgcS5sYWJlbCBBUyBxdWVzdGlvbl9sYWJlbCxcbi8vICAgby5vcHRpb25faWQsXG4vLyAgIG8ubGFiZWwgQVMgb3B0aW9uX2xhYmVsXG4vLyBGUk9NIHF1ZXN0aW9ucyBBUyBxXG4vLyAgIElOTkVSIEpPSU4gb3B0aW9ucyBBUyBvXG4vLyAgIE9OIHEuaWQgPSBvLnF1ZXN0aW9uX2lkXG4vLyBgO1xuXG5jb25zdCBTUUxfQ1JFQVRFID0gW1xuICBgQ1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMgdXNlcnMgKFxuICAgIGlkIElOVEVHRVIgUFJJTUFSWSBLRVksXG4gICAgdXVpZCxcbiAgICB1c2VyX2FnZW50LFxuICAgIHRpbWVzdGFtcCxcbiAgICBVTklRVUUodXVpZCwgdXNlcl9hZ2VudClcbiAgKWAsXG4gIGBDUkVBVEUgVEFCTEUgSUYgTk9UIEVYSVNUUyBxdWVzdGlvbnMgKFxuICAgIGlkIElOVEVHRVIgUFJJTUFSWSBLRVksXG4gICAgdHlwZSxcbiAgICBsYWJlbCxcbiAgICByZXF1aXJlZFxuICApYCxcbiAgYENSRUFURSBUQUJMRSBJRiBOT1QgRVhJU1RTIG9wdGlvbnMgKFxuICAgIGlkIElOVEVHRVIgUFJJTUFSWSBLRVksXG4gICAgcXVlc3Rpb25faWQsXG4gICAgb3B0aW9uX2lkLFxuICAgIGxhYmVsLFxuICAgIFVOSVFVRSAocXVlc3Rpb25faWQsIG9wdGlvbl9pZClcbiAgICBGT1JFSUdOIEtFWSAocXVlc3Rpb25faWQpIFJFRkVSRU5DRVMgcXVlc3Rpb25zKGlkKVxuICApYCxcbiAgYENSRUFURSBUQUJMRSBJRiBOT1QgRVhJU1RTIGFuc3dlcnMgKFxuICAgIGlkIElOVEVSR0VSIFBSSU1BUlkgS0VZLFxuICAgIHVzZXJfaWQsXG4gICAgcXVlc3Rpb25faWQsXG4gICAgYW5zd2VyLFxuICAgIFVOSVFVRSAodXNlcl9pZCwgcXVlc3Rpb25faWQsIGFuc3dlciksXG4gICAgRk9SRUlHTiBLRVkgKHF1ZXN0aW9uX2lkKSBSRUZFUkVOQ0VTIHF1ZXN0aW9ucyhpZClcbiAgKWBcbl07XG5cbmNvbnN0IFNRTF9EUk9QID0gW1xuICAnRFJPUCBUQUJMRSBJRiBFWElTVFMgdXNlcnMnLFxuICAnRFJPUCBUQUJMRSBJRiBFWElTVFMgcXVlc3Rpb25zJyxcbiAgJ0RST1AgVEFCTEUgSUYgRVhJU1RTIG9wdGlvbnMnLFxuICAnRFJPUCBUQUJMRSBJRiBFWElTVFMgYW5zd2VycycsXG5dXG5cbmNvbnN0IFNRTF9JTlNFUlQgPSB7XG4gIHF1ZXN0aW9uOiBgSU5TRVJUIE9SIElHTk9SRSBJTlRPIHF1ZXN0aW9ucyAoaWQsIHR5cGUsIGxhYmVsLCByZXF1aXJlZCkgVkFMVUVTICg/LCA/LCA/LCA/KWAsXG4gIG9wdGlvbjogYElOU0VSVCBPUiBJR05PUkUgSU5UTyBvcHRpb25zIChxdWVzdGlvbl9pZCwgb3B0aW9uX2lkLCBsYWJlbCkgVkFMVUVTICg/LCA/LCA/KWAsXG4gIHVzZXI6IGBJTlNFUlQgT1IgSUdOT1JFIElOVE8gdXNlcnMgKHV1aWQsIHVzZXJfYWdlbnQsIHRpbWVzdGFtcCkgVkFMVUVTICg/LCA/LCA/KWAsXG4gIGFuc3dlcjogYElOU0VSVCBPUiBJR05PUkUgSU5UTyBhbnN3ZXJzICh1c2VyX2lkLCBxdWVzdGlvbl9pZCwgYW5zd2VyKSBWQUxVRVMgKD8sID8sID8pYCxcbn1cblxuY29uc3QgU1FMX1NFTEVDVCA9IHtcbiAgdXNlcklkOiBgU0VMRUNUIGxhc3RfaW5zZXJ0X3Jvd2lkKCkgQVMgaWQgRlJPTSB1c2Vyc2AsXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlcnZlclN1cnZleSBleHRlbmRzIFNlcnZlckFjdGl2aXR5IHtcbiAgY29uc3RydWN0b3IoY2xpZW50VHlwZSwgc3VydmV5Q29uZmlnKSB7XG4gICAgc3VwZXIoU0NFTkVfSUQpO1xuXG4gICAgLyoqXG4gICAgICogQ29uZmlndXJhdGlvbiBvZiB0aGUgc3VydmV5LlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5zdXJ2ZXlDb25maWcgPSBzdXJ2ZXlDb25maWc7XG5cbiAgICAvKipcbiAgICAgKiBQb2ludGVyIHRvIHRoZSBkYXRhYmFzZSBjb25uZWN0aW9uLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5fZGIgPSBudWxsO1xuXG4gICAgdGhpcy5hZGRDbGllbnRUeXBlKGNsaWVudFR5cGUpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBkaXJlY3RvcnlDb25maWc6ICdkYkRpcmVjdG9yeScsXG4gICAgICBkYk5hbWU6ICdzdXJ2ZXkuZGInLFxuICAgICAgZHJvcFRhYmxlczogdHJ1ZSxcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgdGhpcy5fc2hhcmVkQ29uZmlnU2VydmljZSA9IHRoaXMucmVxdWlyZSgnc2hhcmVkLWNvbmZpZycpO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgY29uc3QgZGlyZWN0b3J5Q29uZmlnID0gdGhpcy5vcHRpb25zLmRpcmVjdG9yeUNvbmZpZztcbiAgICBsZXQgZGlyID0gdGhpcy5fc2hhcmVkQ29uZmlnU2VydmljZS5nZXQoZGlyZWN0b3J5Q29uZmlnKVtkaXJlY3RvcnlDb25maWddO1xuICAgIGRpciA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBkaXIpO1xuICAgIGRpciA9IHBhdGgubm9ybWFsaXplKGRpcik7IC8vIEB0b2RvIC0gY2hlY2sgaXQgZG9lcyB0aGUgam9iIG9uIHdpbmRvd3NcbiAgICBmc2UuZW5zdXJlRGlyU3luYyhkaXIpOyAvLyBjcmVhdGUgZGlyZWN0b3J5IGlmIG5vdCBleGlzdHNcblxuICAgIC8vIGNyZWF0ZSB0aGUgZGF0YWJhc2UgaWYgbm90IGV4aXN0XG4gICAgY29uc3QgZGJOYW1lID0gcGF0aC5qb2luKGRpciwgdGhpcy5vcHRpb25zLmRiTmFtZSk7XG4gICAgY29uc3QgZGIgPSBuZXcgc3FsLkRhdGFiYXNlKGRiTmFtZSk7XG5cbiAgICAvLyBtYWtlIHN1cmUgcXVlcmllcyBhcmUgZXhlY3V0ZWQgc2VxdWVuY2lhbGx5XG4gICAgZGIuc2VyaWFsaXplKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuZHJvcFRhYmxlcyA9PT0gdHJ1ZSlcbiAgICAgICAgU1FMX0RST1AuZm9yRWFjaCgocXVlcnkpID0+IGRiLnJ1bihxdWVyeSkpO1xuXG4gICAgICAvLyBjcmVhdGUgdGFibGVzXG4gICAgICBTUUxfQ1JFQVRFLmZvckVhY2goKHF1ZXJ5KSA9PiBkYi5ydW4ocXVlcnkpKTtcblxuICAgICAgLy8gcG9wdWxhdGUgZGIgd2l0aCBzdXJ2ZXkgZGVmaW5pdGlvblxuICAgICAgY29uc3Qgc3RtdFF1ZXN0aW9uID0gZGIucHJlcGFyZShTUUxfSU5TRVJULnF1ZXN0aW9uKTtcbiAgICAgIGNvbnN0IHN0bXRPcHRpb24gPSBkYi5wcmVwYXJlKFNRTF9JTlNFUlQub3B0aW9uKTtcblxuICAgICAgdGhpcy5zdXJ2ZXlDb25maWcuZm9yRWFjaCgocXVlc3Rpb24sIGluZGV4KSA9PiB7XG4gICAgICAgIHF1ZXN0aW9uLmlkID0gaW5kZXg7XG4gICAgICAgIHN0bXRRdWVzdGlvbi5ydW4ocXVlc3Rpb24uaWQsIHF1ZXN0aW9uLnR5cGUsIHF1ZXN0aW9uLmxhYmVsLCBxdWVzdGlvbi5yZXF1aXJlZCk7XG5cbiAgICAgICAgaWYgKHF1ZXN0aW9uLm9wdGlvbnMpIHtcbiAgICAgICAgICBmb3IgKGxldCBpZCBpbiBxdWVzdGlvbi5vcHRpb25zKSB7XG4gICAgICAgICAgICBsZXQgbGFiZWwgPSBxdWVzdGlvbi5vcHRpb25zW2lkXTtcbiAgICAgICAgICAgIHN0bXRPcHRpb24ucnVuKGluZGV4LCBpZCwgbGFiZWwpO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBzdG10UXVlc3Rpb24uZmluYWxpemUoKTtcbiAgICAgIHN0bXRPcHRpb24uZmluYWxpemUoKTtcbiAgICAgIC8vIGRiLmVhY2goU1FMX1RFU1RfREVGSU5JVElPTiwgKGVyciwgcm93KSA9PiBjb25zb2xlLmxvZyhyb3cpKTtcbiAgICB9KTtcblxuICAgIHRoaXMuX2RiID0gZGI7XG4gIH1cblxuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXF1ZXN0JywgdGhpcy5fb25SZXF1ZXN0KGNsaWVudCkpO1xuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdhbnN3ZXJzJywgdGhpcy5fb25BbnN3ZXJzKGNsaWVudCkpO1xuICB9XG5cbiAgX29uUmVxdWVzdChjbGllbnQpIHtcbiAgICByZXR1cm4gKCkgPT4gdGhpcy5zZW5kKGNsaWVudCwgJ2NvbmZpZycsIHRoaXMuc3VydmV5Q29uZmlnKTtcbiAgfVxuXG4gIF9vbkFuc3dlcnMoY2xpZW50KSB7XG4gICAgcmV0dXJuIChhbnN3ZXJzKSA9PiB0aGlzLl9wZXJzaXN0KGNsaWVudCwgYW5zd2Vycyk7XG4gIH1cblxuICBfcGVyc2lzdChjbGllbnQsIGRhdGEpIHtcbiAgICBjb25zdCBkYiA9IHRoaXMuX2RiO1xuXG4gICAgZGIuc2VyaWFsaXplKCgpID0+IHtcbiAgICAgIC8vIGRvIGEgdHJhbnNhdGlvbiB0byByZXRyaWV2ZSB0aGUgZGIgdXNlciBpZFxuICAgICAgZGIucnVuKCdCRUdJTicpO1xuICAgICAgZGIucnVuKFNRTF9JTlNFUlQudXNlciwgY2xpZW50LnV1aWQsIGRhdGEudXNlckFnZW50LCBkYXRhLnRpbWVzdGFtcCk7XG5cbiAgICAgIGRiLmdldChTUUxfU0VMRUNULnVzZXJJZCwgKGVyciwgcm93KSA9PiB7XG4gICAgICAgIGlmIChlcnIpIGNvbnNvbGUuZXJyb3IoZXJyKTtcblxuICAgICAgICBjb25zdCB1c2VySWQgPSByb3cuaWQ7XG4gICAgICAgIGNvbnN0IHN0bXRBbnN3ZXIgPSBkYi5wcmVwYXJlKFNRTF9JTlNFUlQuYW5zd2VyKVxuXG4gICAgICAgIGZvciAobGV0IHF1ZXN0aW9uSWQgaW4gZGF0YS5hbnN3ZXJzKSB7XG4gICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBkYXRhLmFuc3dlcnNbcXVlc3Rpb25JZF07XG5cbiAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXNwb25zZSkpXG4gICAgICAgICAgICByZXNwb25zZS5mb3JFYWNoKChlbGVtZW50KSA9PiBzdG10QW5zd2VyLnJ1bih1c2VySWQsIHF1ZXN0aW9uSWQsIGVsZW1lbnQpKTtcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdG10QW5zd2VyLnJ1bih1c2VySWQsIHF1ZXN0aW9uSWQsIHJlc3BvbnNlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGRiLnJ1bignQ09NTUlUJyk7IC8vIHRoaXMgaXMgZXhlY3V0ZWQganVzdCBhZnRlciB0aGUgdXNlcklkIHNlbGVjdGlvblxuICAgIH0pO1xuICB9XG59XG4iXX0=