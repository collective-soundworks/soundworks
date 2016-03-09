import { SuperLoader } from 'waves-loaders';
import SegmentedView from '../views/SegmentedView';
import Service from '../core/Service';
import serviceManager from '../core/serviceManager';


/**
 * Default loader view
 */
class LoaderView extends SegmentedView {
  onRender() {
    super.onRender();
    this.$progressBar = this.$el.querySelector('.progress-bar');
  }

  onProgress(percent) {
    if (!this.content.showProgress) { return; }
    this.$progressBar.style.width = `${percent}%`;
  }
}


const SERVICE_ID = 'service:loader';

/**
 * [client] Load audio files that can be used by other modules (*e.g.*, the {@link Performance}).
 *
 * The module always has a view (that displays a progress bar) and requires the SASS partial `_77-loader.scss`.
 *
 * The module finishes its initialization when all the files are loaded.
 *
 * @example
 * // Instantiate the module with the files to load
 * const loader = new Loader({ files: ['sounds/kick.mp3', 'sounds/snare.mp3'] });
 *
 * // Get the corresponding audio buffers
 * const kickBuffer = loader.audioBuffers[0];
 * const snareBuffer = loader.audioBuffers[1];
 */
class Loader extends Service {
  constructor() {
    super(SERVICE_ID, false);

    /**
     * @type {Object} default - Default options of the service.
     * @type {String[]} [default.files=[]] - The audio files to load.
     * @type {Boolean} [default.showProgress=true] - Defines if the progress bar is rendered. If set to true, the view should implement an `onProgress(percent)` method.
     * @type {String} [default.viewCtor=LoaderView] - Constructor for the module's view.
     */
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
     * Audio buffers created from the audio files passed in the {@link Loader#constructor}.
     * @type {Array<AudioBuffer>}
     */
    this.buffers = [];
    // to track files loading progress
    this._progress = [];
    this.options.files.forEach((file, index) => this._progress[index] = 0);

    // prepare view
    this.content.showProgress = this.options.showProgress;
    this.viewCtor = this.options.viewCtor;
    this.view = this.createView();
  }

  start() {
    super.start();

    if (!this.hasStarted)
      this.init();

    this._load(this.options.files);
    this.show();
  }

  stop() {
    this.hide();
    super.stop();
  }

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
