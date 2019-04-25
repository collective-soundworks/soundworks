import Service from '../core/Service';
import serviceManager from '../core/serviceManager';


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
    super(SERVICE_ID);

    this._onError = this._onError.bind(this);
  }

  /** @private */
  start() {
    super.start();

    window.addEventListener('error', this._onError);
    window.addEventListener('unhandledrejection', this._onError);

    this.ready();
  }

  /** @private */
  _onError(e) {
    if (e instanceof PromiseRejectionEvent) {
      if (e.reason && e.reason.stack) {
        const stack = e.reason.stack;
        this.send('error', stack, navigator.userAgent);
      }
    } else if (e instanceof ErrorEvent) {
      this.send('error', e.stack, navigator.userAgent);
    }
  }
}

serviceManager.register(SERVICE_ID, ErrorReporter);

export default ErrorReporter;
