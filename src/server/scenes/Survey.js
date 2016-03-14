import fse from 'fs-extra';
import path from 'path';
import Activity from '../core/Activity';
import sqlite from 'sqlite3';

const sql = sqlite.verbose();
const SCENE_ID = 'survey';
const DATABASE_NAME = 'db/survey.db';

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

const SQL_CREATE = [
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    uuid,
    user_agent,
    timestamp,
    UNIQUE(uuid, user_agent)
  )`,
  `CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY,
    type,
    label,
    required
  )`,
  `CREATE TABLE IF NOT EXISTS options (
    id INTEGER PRIMARY KEY,
    question_id,
    option_id,
    label,
    UNIQUE (question_id, option_id)
    FOREIGN KEY (question_id) REFERENCES questions(id)
  )`,
  `CREATE TABLE IF NOT EXISTS answers (
    id INTERGER PRIMARY KEY,
    user_id,
    question_id,
    answer,
    UNIQUE (user_id, question_id, answer),
    FOREIGN KEY (question_id) REFERENCES questions(id)
  )`
];

const SQL_DROP = [
  'DROP TABLE IF EXISTS users',
  'DROP TABLE IF EXISTS questions',
  'DROP TABLE IF EXISTS options',
  'DROP TABLE IF EXISTS answers',
]

const SQL_INSERT = {
  question: `INSERT OR IGNORE INTO questions (id, type, label, required) VALUES (?, ?, ?, ?)`,
  option: `INSERT OR IGNORE INTO options (question_id, option_id, label) VALUES (?, ?, ?)`,
  user: `INSERT OR IGNORE INTO users (uuid, user_agent, timestamp) VALUES (?, ?, ?)`,
  answer: `INSERT OR IGNORE INTO answers (user_id, question_id, answer) VALUES (?, ?, ?)`,
}

const SQL_SELECT = {
  userId: `SELECT last_insert_rowid() AS id FROM users`,
}

export default class Survey extends Activity {
  constructor(clientType, surveyConfig) {
    super(SCENE_ID);

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

    const defaults = {
      directoryConfig: 'dbDirectory',
      dbName: 'survey.db',
      dropTables: true,
    };

    this.configure(defaults);

    this._sharedConfigService = this.require('shared-config');
  }

  start() {
    const directoryConfig = this.options.directoryConfig;
    let dir = this._sharedConfigService.get(directoryConfig)[directoryConfig];
    dir = path.join(process.cwd(), dir);
    dir = path.normalize(dir); // @todo - check it does the job on windows
    fse.ensureDirSync(dir); // create directory if not exists

    // create the database if not exist
    const dbName = path.join(dir, this.options.dbName);
    const db = new sql.Database(dbName);

    // make sure queries are executed sequencially
    db.serialize(() => {
      if (this.options.dropTables === true)
        SQL_DROP.forEach((query) => db.run(query));

      // create tables
      SQL_CREATE.forEach((query) => db.run(query));

      // populate db with survey definition
      const stmtQuestion = db.prepare(SQL_INSERT.question);
      const stmtOption = db.prepare(SQL_INSERT.option);

      this.surveyConfig.forEach((question, index) => {
        question.id = index;
        stmtQuestion.run(question.id, question.type, question.label, question.required);

        if (question.options) {
          for (let id in question.options) {
            let label = question.options[id];
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

  connect(client) {
    super.connect(client);

    this.receive(client, 'request', this._onRequest(client));
    this.receive(client, 'answers', this._onAnswers(client));
  }

  _onRequest(client) {
    return () => this.send(client, 'config', this.surveyConfig);
  }

  _onAnswers(client) {
    return (answers) => this._persist(client, answers);
  }

  _persist(client, data) {
    const db = this._db;

    db.serialize(() => {
      // do a transation to retrieve the db user id
      db.run('BEGIN');
      db.run(SQL_INSERT.user, client.uuid, data.userAgent, data.timestamp);

      db.get(SQL_SELECT.userId, (err, row) => {
        if (err) console.error(err);

        const userId = row.id;
        const stmtAnswer = db.prepare(SQL_INSERT.answer)

        for (let questionId in data.answers) {
          const response = data.answers[questionId];

          if (Array.isArray(response))
            response.forEach((element) => stmtAnswer.run(userId, questionId, element));
          else
            stmtAnswer.run(userId, questionId, response);
        }
      });

      db.run('COMMIT'); // this is executed just after the userId selection
    });
  }
}
