import { SuperLoader } from 'waves-loaders';
import ClientModule from './ClientModule';
import SegmentedView from './display/SegmentedView';


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
export default class Loader extends ClientModule {
  /**
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='loader'] - The name of the module.
   * @param {Boolean} [options.showProgress=true] - Defines if the progress bar is rendered. If set to true, the view should implement an `onProgress(percent)` method.
   * @param {String[]} [options.files=null] - The audio files to load.
   * @param {String} [options.viewCtor=LoaderView] - Constructor for the module's view.
   */
  constructor(options = {}) {
    super(options.name || 'loader');

    this.options = Object.assign({
      showProgress: true,
      files: null,
      viewCtor: LoaderView,
    }, options);

    this.init();
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
    this._load(this.options.files);
  }

  /** @private */
  restart() {
    // As this module is client side only, nothing has to be done when restarting.
    this.done();
  }

  _load(fileList) {
    const loader = new SuperLoader();

    loader.progressCallback = this._onProgress.bind(this);
    loader.load(fileList)
      .then((buffers) => {
        this.buffers = buffers;
        this.emit('completed');
        this.done();
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
