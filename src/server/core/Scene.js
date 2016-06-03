import Activity from '../core/Activity';

export default class Scene extends Activity {
  constructor(id, clientType) {
    super(id);

    this.addClientType(clientType);
  }
}
