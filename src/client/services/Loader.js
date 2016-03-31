import { SuperLoader } from 'waves-loaders';
import SegmentedView from '../views/SegmentedView';
import Service from '../core/Service';
import serviceManager from '../core/serviceManager';


class LoaderView extends SegmentedView {
  onRender() {
    super.onRender();
    this.$progressBar = this.$el.querySelector('.progress-bar');
  }

  onProgress(percent) {
    if (this.content.showProgress)
      this.$progressBar.style.width = `${percent}%`;
  }
}


const SERVICE_ID = 'service:loader';

/**
 * Interface of the client `'loader'` service.
 *
 * This service allow to preload audio files and convert them into audio buffers
 * before the start of the experience.
 *
 * @param {Object} options
 * @param {Array<String>} options.files - List of files to load.
 * @param {Boolean} [options.showProgress=true] - Display the progress bar in the view.
 *
 * @memberof module:soundworks/client
 * @example
 * // inside the experience constructor
 * this.loader = this.require('loader', { files: ['kick.mp3', 'snare.mp3'] });
 * // get the corresponding audio buffers when experience has started
 * const kickBuffer = this.loader.audioBuffers[0];
 * const snareBuffer = this.loader.audioBuffers[1];
 */
class Loader extends Service {
  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  constructor() {
    super(SERVICE_ID, false);

    const defaults = {
      showProgress: true,
      files: [],
      viewCtor: LoaderView,
      viewPriority: 4,
    };

    this.configure(defaults);
  }

  /** @private */
  init() {
    /**
     * List of the audio buffers created from the audio files.
     * @type {Array<AudioBuffer>}
     */
    this.buffers = [];

    // track files loading progress
    this._progress = this.options.files.map(() => { return 0 });
    // prepare view
    this.viewContent.showProgress = this.options.showProgress;
    this.viewCtor = this.options.viewCtor;
    this.view = this.createView();
  }

  /** @private */
  start() {
    super.start();

    if (!this.hasStarted)
      this.init();

    this._load(this.options.files);
    this.show();
  }

  /** @private */
  stop() {
    this.hide();
    super.stop();
  }

  /** @private */
  _load(fileList) {
    const loader = new SuperLoader();

    loader.progressCallback = this._onProgress.bind(this);
    loader.load(fileList)
      .then((buffers) => {
        this.buffers = buffers;
        this.ready();
      }, (error) => {
        console.error(error);
      });
  }

  /** @private */
  _onProgress(e) {
    this._progress[e.index] = e.value;

    let progress = this._progress.reduce((prev, current) => prev + current, 0);
    progress /= this._progress.length;

    if (this.view && this.view.onProgress)
      this.view.onProgress(progress * 100);
  }
}

serviceManager.register(SERVICE_ID, Loader);

export default Loader;
