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
 * @param {String} [configItem='password'] - Path to the password in the server configuration.
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
      configItem: 'password'
    };

    this.configure(defaults);

    /**
     * @private
     * @type {String|Object}
     */
    this._password = null;
    this._sharedConfig = this.require('shared-config');
  }

  /** @private */
  configure(options) {
    super.configure(options);
  }

  /** @private */
  start() {
    super.start();

    this._password = this._sharedConfig.get(this.options.configItem);

    this.ready();
  }

  /** @private */
  connect(client) {
    this.receive(client, 'password', this._onAccessRequest(client));
  }

  /** @private */
  _onAccessRequest(client) {
    return (password) => {
      let match;

      if (typeof this._password === 'string')
        match = this._password;
      else
        match = this._password[client.type];

      if (password !== match)
        this.send(client, 'refused');
      else
        this.send(client, 'granted');
    };
  }
}

serviceManager.register(SERVICE_ID, Auth);

export default Auth;
