import Scene from '../core/Scene';
import Signal from '../core/Signal';
import SignalAll from '../core/SignalAll';


export default class Experience extends Scene {
  constructor(id = 'experience', hasNetwork = 'true') {
    super(id, hasNetwork);

    this.requiredSignals.addObserver((value) => {
      if (value) {
        this.start();
        this.hasStarted = true;
      } else {
        this.hold();
      }
    });
  }

  init() {
    this.viewOptions = { className: ['module', 'performance'] };
  }

  done() {
    this.stop();
    this.signals.done.set(true);
  }

  start() {
    super.start();
    this.send('start');
  }

  hold() {

  }

  stop() {
    this.send('stop');
    super.stop();
  }
}
