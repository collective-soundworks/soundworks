import Activity from './Activity';
import Signal from './Signal';


export default class Scene extends Activity {
  constructor(id, hasNetwork) {
    super(id, hasNetwork);

    this.signals.done = new Signal();
  }
}
