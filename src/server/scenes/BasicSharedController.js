import Scene from '../core/Scene';

const SCENE_ID = 'basic-shared-controller';

export default class BasicSharedController extends Scene {
  constructor(clientType) {
    super(SCENE_ID, clientType);

    this._sharedParams = this.require('shared-params');
  }
}
