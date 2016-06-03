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
  }

  configure(options) {
    if (!options.password)
      throw new Error('`password` option is not defined');

    super.configure(options);
  }

  connect(client) {
    this.receive(client, 'password', this._onAccessRequest(client));
  }

  _onAccessRequest(client) {
    return (password) => {
      if (password !== this.options.password)
        this.send(client, 'refused');
      else
        this.send(client, 'granted');
    }
  }
}

serviceManager.register(SERVICE_ID, Auth);

export default Auth;
