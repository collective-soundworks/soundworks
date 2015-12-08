import { EventEmitter } from 'events';

// const emitter = new EventEmitter();

class Viewport extends EventEmitter {
  constructor() {
    super();
    console.log('viewport ctor');

    this._onResize();
    window.addEventListener('resize', this._onResize.bind(this));
  }

  on(channel, callback) {
    super.on(channel, callback);
    this._onResize();
  }

  _onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.orientation = this.width > this.height ? 'landscape' : 'portrait';

    this.emit('resize', this.orientation, this.width, this.height);
  }
};

const viewport = new Viewport();
console.log(viewport);
export default viewport;
