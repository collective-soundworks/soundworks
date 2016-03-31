import Activity from '../core/Activity';
import serviceManager from '../core/serviceManager';
import fse  from 'fs-extra';
import path from 'path';

function padLeft(str, value, length) {
  str = str + '';
  while (str.length < length) { str = value + str; }
  return str;
}

const SERVICE_ID = 'service:error-reporter';

/**
 * Interface for the server `'error-reporter'` service.
 *
 * This service allows to log javascript errors that could occur during the
 * application life cycle. Errors are catch and send to the server in order
 * to be persisted in a file.
 * By default, the log file are located in the `logs/clients` directory inside
 * the application directory. This location can be changed by modifying the
 * `errorReporterDirectory` entry of the server configuration.
 *
 * *The service is automatically launched whenever the application detects the
 * use of a networked activity. It should never be required manually inside
 * an application.*
 *
 * __*The service must be used with its [client-side counterpart]{@link module:soundworks/client.ErrorReporter}*__
 *
 * @memberof module:soundworks/server
 */
class ErrorReporter extends Activity {
  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  constructor() {
    super(SERVICE_ID);

    const defaults = {
      directoryConfig: 'errorReporterDirectory',
    };

    this.configure(defaults);
    this._onError = this._onError.bind(this);

    this._sharedConfigService = this.require('shared-config');
  }

  /** @private */
  start() {
    let dir = this._sharedConfigService.get(this.options.directoryConfig);
    dir = path.join(process.cwd(), dir);
    dir = path.normalize(dir); // @todo - check it does the job on windows
    fse.ensureDirSync(dir); // create directory if not exists

    this.dir = dir;
  }

  /** @private */
  get filePath() {
    const now = new Date();
    const year = padLeft(now.getFullYear(), 0, 4);
    const month = padLeft(now.getMonth() + 1, 0, 2);
    const day = padLeft(now.getDate(), 0, 2);
    const filename = `${year}${month}${day}.log`;

    return path.join(this.dir, filename);
  }

  /** @private */
  connect(client) {
    super.connect(client);
    this.receive(client, `error`, this._onError);
  }

  /** @private */
  _onError(file, line, col, msg, userAgent) {
    let entry = `${this._getFormattedDate()}\t\t\t`;
    entry += `- ${file}:${line}:${col}\t"${msg}"\n\t${userAgent}\n\n`;

    fse.appendFile(this.filePath, entry, (err) => {
      if (err) console.error(err.message);
    });
  }

  /** @private */
  _getFormattedDate() {
    const now = new Date();
    const year = padLeft(now.getFullYear(), 0, 4);
    const month = padLeft(now.getMonth() + 1, 0, 2);
    const day = padLeft(now.getDate(), 0, 2);
    const hour = padLeft(now.getHours(), 0, 2);
    const minutes = padLeft(now.getMinutes(), 0, 2);
    const seconds = padLeft(now.getSeconds(), 0, 2);
    // prepare file name
    return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
  }
}

serviceManager.register(SERVICE_ID, ErrorReporter);

export default ErrorReporter;
