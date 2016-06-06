import { audioContext } from 'waves-audio';
import { SuperLoader } from 'waves-loaders';
import debug from 'debug';
import SegmentedView from '../views/SegmentedView';
import Service from '../core/Service';
import serviceManager from '../core/serviceManager';

const SERVICE_ID = 'service:loader';
const log = debug('soundworks:services:loader');

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

function getIdFromFilePath(filePath) {
  const fileName = filePath.split('/').pop();
  return fileName.split('.')[0];
}

/**
 * Interface of the client `'loader'` service.
 *
 * This service allow to preload files and store them into buffers
 * before the start of the experience. Audio files will be converted and
 * stored into AudioBuffer objects.
 *
 * @param {Object} options
 * @param {Array<String>} options.assetsDomain - Prefix concatenated to all
 *  given paths.
 * @param {Array<String>} options.files - List of files to load.
 * @param {Boolean} [options.showProgress=true] - Display the progress bar
 *  in the view.
 *
 * @memberof module:soundworks/client
 * @example
 * // require and configure the loader inside the experience constructor,
 * // the files to load can be defined as an object with identifiers
 * this.loader = this.require('loader', { files: {
 *   kick: 'sounds/kick_44kHz.mp3',
 *   snare: 'sounds/808snare.mp3'
 * }});
 *
 * // ... or as a group of objets associating different files to different keys
 * this.loader = this.require('loader', { files: {
 *   latin: {
 *     audio: 'loops/sheila-e-raspberry.mp3',
 *     segments: 'loops/sheila-e-raspberry-markers.json',
 *   },
 *   jazz: {
 *     audio: 'loops/nussbaum-shuffle.mp3',
 *     segments: 'loops/nussbaum-shuffle-markers.json',
 *   },
 * }});
 *
 * // ... when defining the files to load as a simple array,
 * // the identifiers are derived as the file names without path and extension
 * this.loader = this.require('loader', { files: [
 *   'sounds/drums/kick.mp3',
 *   'sounds/drums/snare.mp3'
 * ]});
 *
 * // the loaded objects can be retrieved according to their definition
 * const kickBuffer = this.loader.get('kick');
 * const audioBuffer = this.loader.get('jazz', 'audio');
 * const segmentArray = this.loader.get('jazz', 'segments');
 *
 * // ... audio buffers an be retrieved through their identifier
 * const snareBuffer = this.loader.getAudioBuffer('snare');
 * const jazzBuffer = this.loader.getAudioBuffer('jazz');
 *
 * // ... the buffers property contains an array of all loaded objects
 * // in the order of their definition
 * const kickBuffer = this.loader.buffers[0];
 * const snareBuffer = this.loader.buffers[1];
 */
class Loader extends Service {
  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  constructor() {
    super(SERVICE_ID, false);

    const defaults = {
      assetsDomain: '',
      showProgress: true,
      files: [],
      audioWrapTail: 0,
      viewCtor: LoaderView,
      viewPriority: 4,
    };

    this.configure(defaults);
    this.require('platform', { features: ['web-audio'] });
  }

  /** @private */
  init() {
    /**
     * @private
     * List of all loaded buffers.
     */
    this.buffers = [];

    /**
    * @private
     * List of the loaded audio buffers created from the loaded audio files.
     */
    this.audioBuffers = {};

    /**
    * @private
     * Data structure correponding to the structure of requested files.
     */
    this.data = {};

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

    this.show();
    // preload files (must be called after show)
    this._loadFiles(this.options.files, this.view, true);
  }

  /** @private */
  stop() {
    this.hide();
    super.stop();
  }

  /** @private */
  _appendFileDescription(filePaths, fileDescriptions, fileDescr, id = undefined) {
    let descr = undefined;

    if (typeof fileDescr === 'string') {
      /**
       * fileDescr = {
       *   my-sound-id: 'assets/audio-file-name.wav'
       * }
       * // becomes
       * {
       *   my-sound-id: <AudioBuffer>
       * }
       * ... or
       * fileDescr = 'assets/audio-file-name.wav'
       * // becomes
       * {
       *   audio-file-name: <AudioBuffer>
       * }
       */
      const path = fileDescr;

      if (!id)
        id = getIdFromFilePath(path);

      const descr = { id, path };
      filePaths.push(path);
      fileDescriptions.push(descr);

    } else if (id && typeof fileDescr === 'object') {
      /**
       * fileDescr = {
       *   my-sound-id: {
       *     audio: 'assets/audio-file-name.wav',
       *     segmentation: 'assets/descriptor-file-name.json']
       * }
       * // becomes
       * {
       *   my-sound-id: {
       *     audio: <AudioBuffer>,
       *     segmentation: [<segments>]
       *   }
       * }
       */
      for (let key in fileDescr) {
        const path = fileDescr[key];

        if (typeof path === 'string') {
          const descr = { id, key, path };
          filePaths.push(path);
          fileDescriptions.push(descr);
        }
      }
    }
  }

  /**
   * Populate the `audioBuffers` and `data` attribute according to the loader
   * response and the given file descriptions.
   * @private
   */
  _populateData(loadedObjects, fileDescriptions) {
    loadedObjects.forEach((obj, i) => {
      const descr = fileDescriptions[i];
      const id = descr.id;
      let key = descr.key;

      this.buffers.push(obj);

      if (obj instanceof AudioBuffer)
        this.audioBuffers[id] = obj;

      if (key) {
        let data = this.data[id];

        if(!data)
          this.data[id] = data = {};

        data[key] = obj;
      } else {
        this.data[id] = obj;
      }

      log(this.data[id]);
    });
  }

  /** @private */
  _loadFiles(files, view = null, triggerReady = false) {
    const promise = new Promise((resolve, reject) => {
      let filePaths = [];
      const fileDescriptions = [];

      // prepare the files descriptions
      if (Array.isArray(files)) {
        for (let file of files)
          this._appendFileDescription(filePaths, fileDescriptions, file);
      } else {
        for (let id in files)
          this._appendFileDescription(filePaths, fileDescriptions, files[id], id);
      }

      filePaths = filePaths.map((path) => this.options.assetsDomain + path);
      log(filePaths);

      // load files
      if (filePaths.length > 0 && fileDescriptions.length > 0) {
        const loader = new SuperLoader();
        loader.setAudioContext(audioContext);

        if (view && view.onProgress) {
          const progressPerFile = filePaths.map(() => 0); // track files loading progress

          loader.progressCallback = (e) => {
            progressPerFile[e.index] = e.value;

            let totalProgress = progressPerFile.reduce((prev, current) => prev + current, 0);
            totalProgress /= progressPerFile.length;

            view.onProgress(totalProgress * 100);
          }
        };

        loader
          .load(filePaths, { wrapAroundExtention: this.options.audioWrapTail })
          .then((loadedObjects) => {
            this._populateData(loadedObjects, fileDescriptions);

            if (triggerReady)
              this.ready();

            resolve();
          })
          .catch((error) => {
            reject(error);
            console.error(error);
          });

      } else {
        if (triggerReady)
          this.ready();

        resolve();
      }
    });

    return promise;
  }

  /**
   * wrapAround, copy the begining input buffer to the end of an output buffer
   * @private
   * @param {arraybuffer} inBuffer {arraybuffer} - The input buffer
   * @returns {arraybuffer} - The processed buffer (with frame copied from the begining to the end)
   */
  _wrapAround(inBuffer) {
    var length = inBuffer.length + this.options.wrapAroundExtension * inBuffer.sampleRate;

    var outBuffer = audioContext.createBuffer(inBuffer.numberOfChannels, length, inBuffer.sampleRate);
    var arrayChData, arrayOutChData;

    for (var channel = 0; channel < inBuffer.numberOfChannels; channel++) {
      arrayChData = inBuffer.getChannelData(channel);
      arrayOutChData = outBuffer.getChannelData(channel);

      arrayOutChData.forEach(function(sample, index) {
        if (index < inBuffer.length) arrayOutChData[index] = arrayChData[index];
        else arrayOutChData[index] = arrayChData[index - inBuffer.length];
      });
    }

    return outBuffer;
  }

  /**
   * Load a defined set of files.
   * @param {Object} files - Definition of files to load (same as require).
   * @returns {Promise} - A promise that is resolved when all files are loaded.
   */
  load(files) {
    return this._loadFiles(files);
  }

  /**
   * Retrieve a loaded object.
   * @param {String} id - Object or group identifier.
   * @param {String} key - Member key in group.
   * @returns {Promise} - Returns the loaded object.
   */
  get(id, key = undefined) {
    const obj = this.data[id];

    if (obj && key)
      return obj[key];

    return obj;
  }

  /**
   * Retrieve an audio buffer.
   * @param {String} id - Object identifier.
   * @returns {Promise} - Returns the loaded audio buffer.
   */
  getAudioBuffer(id) {
    return this.audioBuffers[id];
  }
}

serviceManager.register(SERVICE_ID, Loader);

export default Loader;
