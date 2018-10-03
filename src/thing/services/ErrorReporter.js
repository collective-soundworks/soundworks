import Service from '../../client/core/Service';
import serviceManager from '../../client/core/serviceManager';


const SERVICE_ID = 'service:error-reporter';

/**
 * Interface for the client `'error-reporter'` service.
 *
 * This service allows to log javascript errors that could occur during the
 * application life cycle. Errors are caught and sent to the server in order
 * to be persisted in a file.
 * By default, the log files are located in the `logs/clients` directory inside
 * the application directory.
 *
 * *The service is automatically launched whenever the application detects the
 * use of a networked activity. It should never be required manually inside
 * an application.*
 *
 * __*The service must be used with its [server-side counterpart]{@link module:soundworks/server.ErrorReporter}*__
 *
 * @memberof module:soundworks/client
 */
class ErrorReporter extends Service {
  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  constructor() {
    super(SERVICE_ID, true);

    this._onError = this._onError.bind(this);
  }

  /** @private */
  start() {
    super.start();

    process.on('uncaughtException', this._onError);
    this.ready();
  }

  /** @private */
  _onError(e) {
    let stack;
    let file = e.filename;
    const line = e.lineno;
    const col = e.colno;
    const msg = e.message;

    this.send('error', file, line, col, msg);
  }
}

serviceManager.register(SERVICE_ID, ErrorReporter);

export default ErrorReporter;
