import { SuperLoader } from 'waves-loaders';
import client from './client';
import ClientModule from './ClientModule';


/**
 * [client] Load audio files that can be used by other modules (*e.g.*, the {@link Performance}).
 *
 * The module always has a view (that displays a progress bar) and requires the SASS partial `_77-loader.scss`.
 *
 * The module finishes its initialization when all the files are loaded.
 *
 * @example
 * // Instantiate the module with the files to load
 * const loader = new Loader(['sounds/kick.mp3', 'sounds/snare.mp3']);
 *
 * // Get the corresponding audio buffers
 * const kickBuffer = loader.audioBuffers[0];
 * const snareBuffer = loader.audioBuffers[1];
 */
export default class Loader extends ClientModule {
  /**
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='dialog'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   * @param {String[]} [options.files=null] The audio files to load.
   * @param {Boolean} [options.asynchronous=false] Indicates whether to load the files asynchronously or not.
   */
  constructor(options = {}) {
    super(options.name || 'loader', true, options.color);

    /**
     * Audio buffers created from the audio files passed in the {@link Loader#constructor}.
     * @type {AudioBuffer[]}
     */
    this.buffers = [];

    this._files = options.files || null;
    this._asynchronous = !!options.asynchronous; // @note bad name loading is always asynchronous as it is ajax
    this._fileProgress = null;
    this._progressBar = null;
    this._numFilesLoaded = 0;
    this._showProgress = (options.showProgress !== undefined) ?
      options.showProgress : true;

    if (!this._asynchronous && this._showProgress) {
      let viewContent = document.createElement('div');
      viewContent.classList.add('centered-content');
      viewContent.classList.add('soft-blink');
      this.view.appendChild(viewContent);

      let loadingText = document.createElement('p');
      loadingText.innerHTML = "Loading sounds…";
      viewContent.appendChild(loadingText);

      let progressWrap = document.createElement('div');
      progressWrap.classList.add('progress-wrap');
      viewContent.appendChild(progressWrap);

      let progressBar = document.createElement('div');
      progressBar.classList.add('progress-bar');
      progressWrap.appendChild(progressBar);

      this._progressBar = progressBar;
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

  _loadFile(index, file) {
    const loader = new SuperLoader();

    loader
      .load([file])
      .then((buffers) => {
        let buffer = buffers[0];

        this.buffers[index] = buffer;
        this.emit('loader:fileLoaded', index, file, buffer);

        this._numFilesLoaded++;
        if (this._numFilesLoaded >= this.buffers.length)
          this.emit('loader:allFilesLoaded');
      }, (error) => {
        console.log(error);
      });
  }

  _load(fileList) {
    if (this._asynchronous) {
      for (let i = 0; i < fileList.length; i++)
        this._loadFile(i, fileList[i]);

      this.done();
    } else {
      const loader = new SuperLoader();

      this._fileProgress = [];

      for(let i = 0; i < fileList.length; i++)
        this._fileProgress[i] = 0;

      loader.progressCallback = this._progressCallback.bind(this);
      loader.load(fileList)
        .then((buffers) => {
          this.buffers = buffers;
          this.emit('loader:allFilesLoaded');
          this.done();
        }, (error) => {
          console.log(error);
        });
    }
  }

  _progressCallback(obj) {
    const fileIndex = obj.index;
    const fileProgress = obj.value;
    let progress = 0;

    this._fileProgress[fileIndex] = fileProgress;

    for (let i = 0; i < this._fileProgress.length; i++) {
      progress += this._fileProgress[i] / this._fileProgress.length;
    }

    if (this._progressBar) {
      progress = Math.ceil(progress * 100);
      this._progressBar.style.width = progress + '%';
    }
  }
}
