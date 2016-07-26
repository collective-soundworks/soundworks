import Scene from '../core/Scene';

const SCENE_ID = 'basic-shared-controller';

export default class BasicSharedController extends Scene {
  constructor(clientType) {
    super(SCENE_ID, clientType);

    this._errorReporter = this.require('error-reporter');

    /**
     * Instance of the server-side `shared-params` service.
     * @type {module:soundworks/server.SharedParams}
     * @name sharedParams
     * @instance
     * @memberof module:soundworks/server.SharedParams
     */
    this.sharedParams = this.require('shared-params');
  }
}
