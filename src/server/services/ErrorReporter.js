import fse  from 'fs-extra';
import path from 'path';
import Service from '../core/Service';
import serviceManager from '../core/serviceManager';
import retrace from 'retrace';

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
 * application life cycle. Errors are caught and sent to the server in order
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
class ErrorReporter extends Service {
  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  constructor() {
    super(SERVICE_ID);

    const defaults = {};

    this.configure(defaults);
    this._onClientError = this._onClientError.bind(this);

    const clientDirectory = path.join(process.cwd(), 'logs', 'clients');
    fse.ensureDirSync(clientDirectory); // create directory if not exists

    const serverDirectory = path.join(process.cwd(), 'logs', 'server');
    fse.ensureDirSync(serverDirectory); // create directory if not exists

    this.clientDir = clientDirectory;
    this.serverDir = serverDirectory;

    process
      .on('unhandledRejection', (reason, p) => this._onServerError(reason.stack))
      .on('uncaughtException', err => this._onServerError(err.stack));
  }

  /** @private */
  start() {
    super.start();
    this.ready();
  }

  /** @private */
  filePath(dir) {
    const now = new Date();
    const year = padLeft(now.getFullYear(), 0, 4);
    const month = padLeft(now.getMonth() + 1, 0, 2);
    const day = padLeft(now.getDate(), 0, 2);
    const filename = `${year}${month}${day}.log`;

    return path.join(dir, filename);
  }

  /** @private */
  connect(client) {
    super.connect(client);
    this.receive(client, `error`, this._onClientError);
  }

  /** @private */
  _onClientError(stack, userAgent) {
    retrace.map(stack).then(stack => {
      // keep this for backward compatibility
      // @todo - remove in v3
      this.emit('error', stack, '', '', '', userAgent);
      this.emit('stack', stack, userAgent);

      const log = `${this._getFormattedDate()}\t${userAgent}\n${stack}\n\n`;

      fse.appendFile(this.filePath(this.clientDir), log, err => {
        if (err) {
          console.error(err.message);
        }
      });
    });
  }

  _onServerError(stack) {
    console.error('here ?', stack);
    // keep this for backward compatibility
    // @todo - remove in v3
    this.emit('error', stack, '', '', '', 'server');
    this.emit('stack', stack, 'server');

    const log = `${this._getFormattedDate()}\n${stack}\n\n`;

    fse.appendFile(this.filePath(this.serverDir), log, err => {
      if (err) {
        console.error(err.message);
      }
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
