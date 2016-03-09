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

class ErrorReporter extends Activity {
  constructor() {
    super(SERVICE_ID);

    const defaults = {
      directoryConfig: 'errorReporterDirectory',
    };

    this.configure(defaults);
    this._onError = this._onError.bind(this);

    this._sharedConfigService = this.require('shared-config');
  }

  start() {
    let dir = this._sharedConfigService.get(this.options.directoryConfig);
    dir = path.join(process.cwd(), dir);
    dir = path.normalize(dir); // @todo - check it does the job on windows
    fse.ensureDirSync(dir); // create directory if not exists

    this.dir = dir;
  }

  get filePath() {
    const now = new Date();
    const year = padLeft(now.getFullYear(), 0, 4);
    const month = padLeft(now.getMonth() + 1, 0, 2);
    const day = padLeft(now.getDate(), 0, 2);
    const filename = `${year}${month}${day}.log`;

    return path.join(this.dir, filename);
  }

  connect(client) {
    super.connect(client);
    this.receive(client, `error`, this._onError);
  }

  disconnect(client) {
    super.disconnect(client);
  }

  _onError(file, line, col, msg, userAgent) {
    let entry = `${this._getFormattedDate()}\t\t\t`;
    entry += `- ${file}:${line}:${col}\t"${msg}"\n\t${userAgent}\n\n`;

    fse.appendFile(this.filePath, entry, (err) => {
      if (err) console.error(err.message);
    });
  }

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
