import Experience from '../core/Experience';

const Experience_ID = 'basic-shared-controller';

export default class BasicSharedController extends Experience {
  constructor(clientTypes, options = {}) {
    super(clientTypes);

    /**
     * Instance of the server-side `shared-params` service.
     * @type {module:soundworks/server.SharedParams}
     * @name sharedParams
     * @instance
     * @memberof module:soundworks/server.SharedParams
     */
    this.sharedParams = this.require('shared-params');

    if (options.auth)
      this.auth = this.require('auth');
  }
}
