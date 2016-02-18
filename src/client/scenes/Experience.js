import Scene from '../core/Scene';
import Signal from '../core/Signal';
import SignalAll from '../core/SignalAll';
import client from '../core/client';

export default class Experience extends Scene {
  constructor(id = client.type, hasNetwork = true) {
    super(id, hasNetwork);

    // if the experience has network, require errorReporter service by default
    if (hasNetwork)
      this._errorReporter = this.require('error-reporter');
  }

  init() {
    this.viewOptions = { className: ['activity', 'experience'] };
  }

  start() {
    super.start();

    if (this.hasNetwork)
      this.send('enter');
  }

  // hold() {}

  done() {
    if (this.hasNetwork)
      this.send('exit');

    super.done();
  }
}
