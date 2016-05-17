import { SuperLoader } from 'waves-loaders';
import SegmentedView from '../views/SegmentedView';
import Service from '../core/Service';
import serviceManager from '../core/serviceManager';

const SERVICE_ID = 'service:loader';

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

function appendFileDescription(filePaths, fileDescriptions, fileDescr, id = undefined) {
  let descr = undefined;

  if(typeof fileDescr === 'string') {
    // fileDescr = { my-sound-id: 'assets/audio-file-name.wav' } --> { my-sound-id: { audio: <AudioBuffer> } }
    // fileDescr = 'assets/audio-file-name.wav' --> { audio-file-name: { audio: <AudioBuffer> } }
    const path = fileDescr;

    if(!id)
      id = getIdFromFilePath(path);

    const descr = { id, path };
    filePaths.push(path);
    fileDescriptions.push(descr);

  } else if(id && typeof fileDescr === 'object') {
    // fileDescr = { my-sound-id: { audio: 'assets/audio-file-name.wav', segmentation: 'assets/descriptor-file-name.json'] } --> { my-sound-id: { audio: <AudioBuffer>, segmentation: [<segments>] } }
    for(let key in fileDescr) {
      const path = fileDescr[key];

      if(typeof path === 'string') {
        const descr = { id, key, path };
        filePaths.push(path);
        fileDescriptions.push(descr);
      }
    }
  }
}

/**
 * Interface of the client `'loader'` service.
 *
 * This service allow to preload files and store them into buffers
 * before the start of the experience. Audio files will be converted and
 * stored into AudioBuffer objects.
 *
 * @param {Object} options
 * @param {Array<String>} options.files - List of files to load.
 * @param {Boolean} [options.showProgress=true] - Display the progress bar in the view.
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
      showProgress: true,
      files: [],
      audioWrapTail: 0,
      viewCtor: LoaderView,
      viewPriority: 4,
    };

    this.configure(defaults);
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

    // preload files
    this._loadFiles(this.options.files, this.view, true);
    this.show();
  }

  /** @private */
  stop() {
    this.hide();
    super.stop();
  }

  /** @private */
  _loadFiles(files, view = null, signalReady = false) {
    const promise = new Promise((resolve, reject) => {
      const filePaths = [];
      const fileDescriptions = [];

      if(Array.isArray(files)) {
        for(let file of files)
          appendFileDescription(filePaths, fileDescriptions, file);
      } else {
        for (let id in files)
          appendFileDescription(filePaths, fileDescriptions, files[id], id);
      }

      if (filePaths.length > 0 && fileDescriptions.length > 0) {
        const loader = new SuperLoader();

        if (view && view.onProgress) {
          const progressPerFile = filePaths.map(() => 0); // track files loading progress

          loader.progressCallback = (e) => {
            progressPerFile[e.index] = e.value;

            let totalProgress = progressPerFile.reduce((prev, current) => prev + current, 0);
            totalProgress /= progressPerFile.length;

            view.onProgress(totalProgress * 100);
          }
        };

        loader.load(filePaths, { wrapAroundExtention: this.options.audioWrapTail })
          .then((loadedObjects) => {
            for(let obj of loadedObjects)
              this.buffers.push(obj);

            for(let i = 0; i < loadedObjects.length; i++) {
              const obj = loadedObjects[i];
              const descr = fileDescriptions[i];
              const id = descr.id;
              let key = descr.key;

              if(obj instanceof AudioBuffer)
                this.audioBuffers[id] = obj;

              if(key) {
                let data = this.data[id];

                if(!data)
                  this.data[id] = data = {};

                data[key] = obj;
              } else {
                this.data[id] = obj;
              }
            }

            if (signalReady)
              this.ready();

            resolve();
          }, (error) => {
            reject(error);
            console.error(error);
          });
      } else {
        if (signalReady)
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
