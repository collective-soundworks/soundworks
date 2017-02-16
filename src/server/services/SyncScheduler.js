import Service from '../core/Service';
import { getOpt } from '../../utils/helpers';
import serviceManager from '../core/serviceManager';

const SERVICE_ID = 'service:sync-scheduler';


/**
 * Interface for the server `'sync-scheduler'` service.
 *
 * @memberof module:soundworks/server
 * @example
 * // inside the experience constructor
 * this.syncScheduler = this.require('sync-scheduler');
 */
class SyncScheduler extends Service {
  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  constructor() {
    super(SERVICE_ID);

    this._sync = this.require('sync');
  }

  /** @private */
  start() {
    super.start();
  }

  get currentTime() {
    return this._sync.getSyncTime();
  }

  /** @private */
  connect(client) {
    super.connect(client);
  }

  /** @private */
  disconnect(client) {
    super.disconnect(client);
  }
}

serviceManager.register(SERVICE_ID, SyncScheduler);

export default SyncScheduler;
