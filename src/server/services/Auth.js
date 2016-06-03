import Service from '../core/Service';
import { getOpt } from '../../utils/helpers';
import serviceManager from '../core/serviceManager';

const SERVICE_ID = 'service:auth';

/**
 * Interface of the server `'auth'` service.
 *
 * __*The service must be used with its [client-side counterpart]{@link module:soundworks/client.Checkin}*__
 */
class Auth extends Service {
  constructor() {
    super(SERVICE_ID);

    const defaults = {
      configItem: 'password'
    }

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
  }

  connect(client) {
    this.receive(client, 'password', this._onAccessRequest(client));
  }

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
    }
  }
}

serviceManager.register(SERVICE_ID, Auth);

export default Auth;
