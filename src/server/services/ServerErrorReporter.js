import ServerActivity from '../core/ServerActivity';
import serverServiceManager from '../core/serverServiceManager';
import fse  from 'fs-extra';
import path from 'path';

function padLeft(str, value, length) {
  str = str + '';
  while (str.length < length) { str = value + str; }
  return str;
}

const SERVICE_ID = 'service:error-reporter';

class ServerErrorReporter extends ServerActivity {
  constructor() {
    super(SERVICE_ID);

    const defaults = {
      configPath: 'errorReporterFolder',
    };

    this.configure(defaults);
    this._logError = this._logError.bind(this);

    this._sharedConfigService = this.require('shared-config');
  }

  start() {
    const configPath = this.options.configPath;
    const folderPath = this._sharedConfigService.get(configPath)[configPath];
    // @todo - test if it does the job on windows
    const dirPath = path.join(process.cwd(), folderPath);
    this.dirPath = path.normalize(dirPath);
    // create directory if not exists
    fse.ensureDirSync(dirPath);
  }

  get filePath() {
    const now = new Date();
    const year = padLeft(now.getFullYear(), 0, 4);
    const month = padLeft(now.getMonth() + 1, 0, 2);
    const day = padLeft(now.getDate(), 0, 2);
    const filename = `${year}${month}${day}.log`;

    return path.join(this.dirPath, filename);
  }

  connect(client) {
    super.connect(client);
    this.receive(client, `error`, this._logError);
  }

  disconnect(client) {
    super.disconnect(client);
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

  _logError(file, line, col, msg, userAgent) {
    let entry = `${this._getFormattedDate()}\t\t\t`;
    entry += `- ${file}:${line}:${col}\t"${msg}"\n\t${userAgent}\n\n`;

    fse.appendFile(this.filePath, entry, (err) => {
      if (err)
        console.error(err.message);
    });
  }
}

serverServiceManager.register(SERVICE_ID, ServerErrorReporter);

export default ServerErrorReporter;
