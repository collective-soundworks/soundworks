import Scene from '../core/Scene';
import Signal from '../core/Signal';
import SignalAll from '../core/SignalAll';
import client from '../core/client';

export default class Experience extends Scene {
  constructor(/* id = client.type, */ hasNetwork = true) {
    super('experience', hasNetwork);
    // if the experience has network, require errorReporter service by default
    if (hasNetwork)
      this._errorReporter = this.require('error-reporter');
  }

  init() {}

  createView() {
    if (this.viewOptions) {
      if (Array.isArray(this.viewOptions.className))
        this.viewOptions.clientType.push(client.type);
      else if (typeof this.viewOptions.className === 'string')
        this.viewOptions.className = [this.viewOptions.className, client.type];
      else
        this.viewOptions.className = client.type;
    }

    return super.createView();
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
