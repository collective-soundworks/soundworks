import Service from '../core/Service';
import serviceManager from '../core/serviceManager';

const SERVICE_ID = 'service:auth';

/**
 * Interface for the server `'auth'` service.
 *
 * This service allows to lock the application to specific users by adding a
 * simple logging page to the client.
 *
 * <span class="warning">__WARNING__</span>: This service shouldn't be considered
 * secure from a production prespective.
 *
 * __*The service must be used with its [client-side counterpart]{@link module:soundworks/client.Auth}*__
 *
 * @param {Object} options
 * @param {String} [password=''] - Password.
 *
 * @memberof module:soundworks/server
 * @example
 * this.auth = this.require('auth');
 */
class Auth extends Service {
  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  constructor() {
    super(SERVICE_ID);

    const defaults = {
      password: ''
    };

    this.configure(defaults);
  }

  /** @private */
  configure(options) {
    super.configure(options);
  }

  /** @private */
  start() {
    super.start();
    this.ready();
  }

  /** @private */
  connect(client) {
    client.socket.addListener(`${SERVICE_ID}:password`, password => {
      if (password !== this.options.password) {
        client.socket.send(`${SERVICE_ID}:refused`);
      } else {
        client.socket.send(`${SERVICE_ID}:granted`);
      }
    });
  }
}

serviceManager.register(SERVICE_ID, Auth);

export default Auth;
