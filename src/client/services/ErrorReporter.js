import Service from '../core/Service';
import serviceManager from '../core/serviceManager';


const SERVICE_ID = 'service:error-reporter';

/**
 * Interface for the client `'error-reporter'` service.
 *
 * This service allows to log javascript errors that could occur during the
 * application life cycle. Errors are catch and send to the server in order
 * to be persisted in a file.
 * By default, the log file are located in the `logs/clients` directory inside
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
  init() {
    window.addEventListener('error', this._onError);
  }

  /** @private */
  start() {
    super.start();

    if (!this.hasStarted)
      this.init();

    this.ready();
  }

  /** @private */
  _onError(e) {
    let stack;
    let file = e.filename;
    file = file.replace(window.location.origin, '');
    const line = e.lineno;
    const col = e.colno;
    const msg = e.message;
    const userAgent = navigator.userAgent;

    this.send('error', file, line, col, msg, userAgent);
  }
}

serviceManager.register(SERVICE_ID, ErrorReporter);

export default ErrorReporter;
