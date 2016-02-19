import Service from '../core/Service';
import serviceManager from '../core/serviceManager';


const SERVICE_ID = 'service:error-reporter';

/**
 * [client] This service listen for errors on the client side to report them
 * on the server. Is required by default by any {@link src/client/scene/Experience.js}
 * if its `hasNetwork` is set to `true`.
 */
class ClientErrorReporter extends Service {
  constructor() {
    super(SERVICE_ID, true);

    this._onError = this._onError.bind(this);
  }

  /** @inheritdoc */
  init() {
    window.addEventListener('error', this._onError);
  }

  /** @inheritdoc */
  start() {
    super.start();

    if (!this.hasStarted)
      this.init();

    this.ready();
  }

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

serviceManager.register(SERVICE_ID, ClientErrorReporter);

export default ClientErrorReporter;
