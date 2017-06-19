import Experience from '../core/Experience';

/**
 * Server-side experience to create 1 liner controllers
 *
 * @memberof module:soundworks/server
 */
class ControllerExperience extends Experience {
  constructor(clientTypes, options = {}) {
    super(clientTypes);

    /**
     * Instance of the server-side `shared-params` service.
     * @type {module:soundworks/server.SharedParams}
     * @name sharedParams
     * @instance
     * @memberof module:soundworks/server.ControllerExperience
     */
    this.sharedParams = this.require('shared-params');

    if (options.auth)
      this.auth = this.require('auth');
  }
}

export default ControllerExperience
