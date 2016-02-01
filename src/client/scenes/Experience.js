// import CanvasView from '../display/CanvasView';
import Scene from '../core/Scene';
import serviceManager from '../core/serviceManager';
import Signal from '../core/Signal';
import SignalAll from '../core/SignalAll';


export default class Experience extends Scene {
  constructor(id = 'experience', hasNetwork = 'true') {
    super(id, hasNetwork);

    this._requiredSignals = new SignalAll();
    this._requiredSignals.addObserver((value) => {
      if (value) {
        this.start();
        this.hasStarted = true;
      } else {
        this.hold();
      }
    });

    this._requiredSignals.add(serviceManager.signals.ready);
  }

  init() {
    this.viewOptions = { className: ['module', 'performance'] };
  }

  require(id, options) {
    return serviceManager.require(id, options);
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
