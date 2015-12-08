import { SuperLoader } from 'waves-loaders';
import ClientModule from './ClientModule';
import View from './display/View';


/**
 * Default loader view
 */
class LoaderView extends View {
  onRender() {
    this.$progressBar = this.$el.querySelector('#progress-bar');
  }

  onProgress(percent) {
    if (!this.model.showProgress) { return; }
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
   * @param {String} [options.name='dialog'] - Name of the module.
   * @param {String[]} [options.files=null] - The audio files to load.
   * @param {String} [options.view=undefined] - If defined, the view to be used.
   * @param {Boolean} [options.showProgress=true] - Defines if the progress bar should be rendered. If set to true, the view should implement an `onProgress(percent)` method.
   */
  constructor(options = {}) {
    super(options.name || 'loader');

    /**
     * Audio buffers created from the audio files passed in the {@link Loader#constructor}.
     * @type {AudioBuffer[]}
     */
    this.buffers = [];
    this._files = options.files || null;
    this._fileProgress = null; // used to track files loading progress
    // this._numFilesLoaded = 0;

    if (options.view instanceof View) {
      this.view = options.view;
    } else {
      this.content.showProgress = (options.showProgress !== undefined) ?
        !!options.showProgress : true;

      this.view = this.createDefaultView();
    }
  }

  /**
   * @private
   */
  start() {
    super.start();
    this._load(this._files);
  }

  /**
   * @private
   */
  restart() {
    super.restart();
    this.done();
  }

  // _loadFile(index, file) {
  //   const loader = new SuperLoader();

  //   loader
  //     .load([file])
  //     .then((buffers) => {
  //       let buffer = buffers[0];

  //       this.buffers[index] = buffer;
  //       this.emit('loader:fileLoaded', index, file, buffer);

  //       this._numFilesLoaded++;

  //       if (this._numFilesLoaded >= this.buffers.length) {
  //         this.emit('loader:allFilesLoaded');
  //       }
  //     }, (error) => {
  //       console.log(error);
  //     });
  // }

  _load(fileList) {
    const loader = new SuperLoader();
    this._fileProgress = [];

    for (let i = 0; i < fileList.length; i++) {
      this._fileProgress[i] = 0;
    }

    loader.progressCallback = this._progressCallback.bind(this);
    loader.load(fileList)
      .then((buffers) => {
        this.buffers = buffers;
        // this.emit('loader:allFilesLoaded');
        this.emit('loader:completed')
        this.done();
      }, (error) => {
        console.log(error);
      });
  }

  _progressCallback(obj) {
    const fileIndex = obj.index;
    const fileProgress = obj.value;
    const length = this._fileProgress.length;
    this._fileProgress[fileIndex] = fileProgress;

    let progress = this._fileProgress.reduce((prev, current) => {
      return prev + current;
    }, 0);

    progress /= length;

    if (this.view && this.view.onProgress) {
      this.view.onProgress(progress * 100);
    }
  }
}
