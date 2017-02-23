import { audioContext } from 'waves-audio';
import { SuperLoader } from 'waves-loaders';
import debug from 'debug';
import _path from 'path';
import SegmentedView from '../views/SegmentedView';
import Service from '../core/Service';
import serviceManager from '../core/serviceManager';

const SERVICE_ID = 'service:audio-buffer-manager';
const log = debug('soundworks:services:audio-buffer-manager');

const defaultViewTemplate = `
<div class="section-top flex-middle">
  <p><%= status %></p>
</div>
<div class="section-center flex-center">
  <% if (showProgress) { %>
  <div class="progress-wrap">
    <div class="progress-bar"></div>
  </div>
  <% } %>
</div>
<div class="section-bottom"></div>`;


const defaultViewContent = {
  status: null,
  loading: 'Loading sounds...',
  decoding: 'Decoding sounds...',
};

function flattenLists(a) {
  const ret = [];
  const fun = (val) => Array.isArray(val) ? val.forEach(fun) : ret.push(val);
  fun(a);
  return ret;
}

function clonePathObj(value) {
  if (typeof value === 'object') {
    const className = value.constructor.name;
    let clone = null;

    if (className === 'Object')
      clone = {};
    else if (className === 'Array')
      clone = [];
    else
      return value;

    for (let key in value)
      clone[key] = clonePathObj(value[key]);

    return clone;
  }

  return value;
}

const regexp = /\.[a-zA-Z0-9]{3,4}$/;

function isFilePath(str) {
  return (typeof str === 'string' && regexp.test(str));
}

function isDirSpec(obj) {
  return (typeof obj === 'object' && typeof obj.path === 'string');
}

function decomposePathObj(obj, pathList, refList, dirs = false) {
  for (let key in obj) {
    const value = obj[key];

    if ((!dirs && isFilePath(value)) || (dirs && isDirSpec(value))) {
      const ref = { obj, key };
      let index = -1;

      if (!dirs)
        index = pathList.indexOf(value);

      if (index === -1) {
        const length = pathList.push(value);

        index = length - 1;
        refList[index] = [];
      }

      refList[index].push(ref);

      obj[key] = null;
    } else if (typeof value === 'object') {
      decomposePathObj(value, pathList, refList, dirs);
    }
  }
}

function populateRefList(refList, loadedObjList) {
  const length = refList.length;

  if (length !== loadedObjList.length) {
    throw new Error(`[${SERVICE_ID}] Loaded Buffers do not match file definion`);
  }

  for (let i = 0; i < length; i++) {
    const refs = refList[i];

    for (let j = 0, l = refs.length; j < l; j++) {
      const ref = refs[j];
      const obj = ref.obj;
      const key = ref.key;

      obj[key] = loadedObjList[i];
    }
  }
}

function createObjFromPathList(pathList, commonPath) {
  let obj = [];

  for (let path of pathList) {
    let subPathIndex = path.indexOf(commonPath);

    if (subPathIndex >= 0) {
      subPathIndex += commonPath.length;

      if (path[subPathIndex] === '/')
        subPathIndex++;

      const subPath = path.substring(subPathIndex);
      const nodes = subPath.split('/');
      const depth = nodes.length;
      let ref = obj;
      let i;

      for (i = 0; i < depth - 1; i++) {
        const key = nodes[i];

        if (ref[key] === undefined)
          ref[key] = [];

        ref = ref[key];
      }

      ref.push(path);
    }

    // transform empty array to object
    if (obj.length === 0)
      obj = Object.assign({}, obj);
  }

  return obj;
}

function prefixPaths(pathList, prefix) {
  // test absolute urls (or protocol relative)
  const isAbsolute = /^https?:\/\/|^\/\//i;

  pathList = pathList.map((path) => {
    if (isAbsolute.test(path) || path[0] === '/')
      return path;
    else
      return prefix + path;
  });

  return pathList;
}

/**
 * Interface for the view of the `audio-buffer-manager` service.
 *
 * @interface AbstractAudioBufferManagerView
 * @extends module:soundworks/client.View
 */
/**
 * Method called when a new information about the currently loaded assets
 * is received.
 *
 * @function
 * @name AbstractAudioBufferManagerView.onProgress
 * @param {Number} percent - The purcentage of loaded assets.
 */
class AudioBufferManagerView extends SegmentedView {
  constructor(...args) {
    super(...args);

    this.content.status = this.content.loading;
  }

  onRender() {
    super.onRender();
    this.$progressBar = this.$el.querySelector('.progress-bar');
  }

  onProgress(percent) {
    if (percent === 100) {
      this.content.status = this.content.decoding;
      this.render('.section-top');
    }

    if (this.content.showProgress)
      this.$progressBar.style.width = `${percent}%`;
  }
}

/**
 * Interface for the client `'audio-buffer-manager'` service.
 *
 * This service allows to preload files and store them into buffers
 * before the beginning of the experience. Audio files will be converted and
 * stored into AudioBuffer objects.
 *
 * @param {Object} options
 * @param {Array<String>} options.assetsDomain - Prefix concatenated to all
 *  given paths.
 * @param {Object} options.files - Definition of files to load.
 * @param {Object} options.directories - Definition of directories to load.
 * @param {Array<String>} options.directories - List of directories to load.
 * @param {Boolean} [options.showProgress=true] - Display the progress bar
 *  in the view.
 * @param {String|module:soundworks/client.FileSystem~ListConfig} [options.directories=null] -
 *  Load all the files in particular directories. If setted this option relies
 *  on the {@link module:soundworks/client.FileSystem} which itself relies on
 *  its server counterpart, the audio-buffer-manager can then no longer be
 *  considered as a client-only service.
 *
 * @memberof module:soundworks/client
 * @example
 * // require and configure the `audio-buffer-manager` inside the experience
 * // constructor
 * // Defining a single array of audio files results in a single
 * // array of audio buffers associated to the identifier `default`.
 *
 * // There are two different ways to specify the files to be loaded and the
 * // data structure in which the loaded data objects are arranged:
 * //
 * // (1.) With the 'files' option, the files and structure are defined by an
 * // object of any depth that contains file paths. All specified files are
 * // loaded and the loaded data objects are stored into an object of the same
 * // structure as the definition object.
 *
 * this.audioBufferManager = this.require('audio-buffer-manager', { files: [
 *   'sounds/drums/kick.mp3',
 *   'sounds/drums/snare.mp3'
 * ]});
 *
 * this.audioBufferManager = this.require('audio-buffer-manager', { files: {
 *   kick: 'sounds/kick_44kHz.mp3',
 *   snare: 'sounds/808snare.mp3'
 * }});
 *
 * this.audioBufferManager = this.require('audio-buffer-manager', { files: {
 *   latin: {
 *     audio: 'loops/sheila-e-raspberry.mp3',
 *     markers: 'loops/sheila-e-raspberry-markers.json',
 *   },
 *   jazz: {
 *     audio: 'loops/nussbaum-shuffle.mp3',
 *     markers: 'loops/nussbaum-shuffle-markers.json',
 *   },
 * }});
 *
 * this.audioBufferManager = this.require('audio-buffer-manager', { files: {
 *   instruments: [
 *     'sounds/instruments/kick_44kHz.mp3',
 *     'sounds/instruments/808snare.mp3'],
 *   loops: [
 *     'sounds/loops/sheila-e-raspberry.mp3',
 *     'sounds/loops/nussbaum-shuffle.mp3'],
 * }});
 *
 * //(2.) The 'directories' option can be used to load the files of a
 * // given directory. Each directory is specified by an object that has a
 * // property 'path' with the directory path and optionally the keys
 * // 'recursive' (specifying whether the directory's sub-directories are
 * // considered) and a key 'match' (specifying a regexp to select the files
 * // in the given directory).
 *
 * // With the option 'recursive' set to false, all (matching) files
 * // in a given directoriy are loaded into an arrays of objects without
 * // considering sub-directories. The arrays of loaded data objects are
 * // arranged in the same data structure as the definition object.
 *
 * this.audioBufferManager = this.require('audio-buffer-manager', {
 *   directories: {
 *     instruments: { path: 'sounds/instruments', recursive: false },
 *     loops: { path: 'sounds/instruments', recursive: false },
 *   },
 * });
 *
 * // When 'recursive' is set to true, all (matching) files in the given
 * // directories and their sub-directories are loaded an array of objects
 * // stored in a data structure that reproduces the defined sub-directory
 * // tree. The resulting data structure corresponds to the structure of the
 * // definition object extended by the defined sub-directoriy trees.
 *
 * this.audioBufferManager = this.require('audio-buffer-manager', {
 *   directories: {
 *     path: 'sounds',
 *     recursive: true,
 *     match: /\.mp3/,
 *   },
 * });
 *
 * // The loaded objects can be retrieved according to their definition, as for example :
 * const kickBuffer = this.audioBufferManager.data.kick;
 * const audioBuffer = this.audioBufferManager.data.latin.audio;
 * const markerArray = this.audioBufferManager.data.jazz.markers;
 * const snareBuffer = this.audioBufferManager.data.instruments[1];
 * const nussbaumLoop = this.audioBufferManager.data.loops[1];
 */
class AudioBufferManager extends Service {
  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  constructor() {
    super(SERVICE_ID, false);

    const defaults = {
      assetsDomain: '',
      showProgress: true,
      files: null,
      directories: null,
      audioWrapTail: 0,
      viewCtor: AudioBufferManagerView,
      viewPriority: 4,
    };

    this._defaultViewTemplate = defaultViewTemplate;
    this._defaultViewContent = defaultViewContent;

    this.configure(defaults);
  }

  /** @private */
  configure(options) {
    super.configure(options);

    const directories = this.options.directories;

    if (directories !== null) {
      this._fileSystem = this.require('file-system');
    }
  }

  /** @private */
  init() {
    /**
     * Data structure correponding to the structure of requested files.
     * @private
     */
    this.data = [];

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

    if (this.options.files || this.options.directories) {
      if (this.options.files)
        this.loadFiles(this.options.files, this.view);

      if (this.options.directories)
        this.loadDirectories(this.options.directories, this.view);
    } else {
      this.ready();
    }
  }

  /** @private */
  stop() {
    this.hide();
    super.stop();
  }

  /**
   * Load files defined as a set of file paths.
   * @param {Object} defObj - Definition of files to load
   * @returns {Promise} - Promise resolved with the resulting data structure
   */
  loadFiles(defObj, view = null) {
    const promise = new Promise((resolve, reject) => {
      let pathList = [];
      let refList = [];

      if (typeof defObj === 'string')
        defObj = [defObj];

      // create data object copying the strcuture of the file definion object
      const dataObj = clonePathObj(defObj);
      decomposePathObj(dataObj, pathList, refList, false);

      // prefix relative paths with assetsDomain
      pathList = prefixPaths(pathList, this.options.assetsDomain);

      log(pathList, refList);

      // load files
      if (pathList.length > 0) {
        const loader = new SuperLoader();
        loader.setAudioContext(audioContext);

        if (view && view.onProgress) {
          const progressPerFile = pathList.map(() => 0); // track files loading progress

          loader.progressCallback = (e) => {
            progressPerFile[e.index] = e.value;

            let totalProgress = 0;

            for (let i = 0; i < progressPerFile.length; i++)
              totalProgress += progressPerFile[i];

            totalProgress /= progressPerFile.length;

            view.onProgress(totalProgress * 100);
          };
        }

        loader
          .load(pathList, {
            wrapAroundExtention: this.options.audioWrapTail,
          })
          .then((loadedObjList) => {
            // place loaded objects (i.e. audio buffers and json files) into the structure of the file definition object
            populateRefList(refList, loadedObjList);

            // mix loaded objects into data
            Object.assign(this.data, dataObj);
            this.ready();
            resolve(dataObj);
          })
          .catch((error) => {
            reject(error);
            console.error(error);
          });
      } else {
        this.ready();
        resolve([]);
      }
    });

    return promise;
  }

  /**
   * Load files defined as a set of directory paths.
   * @param {Object} defObj - Definition of files to load
   * @returns {Promise} - Promise resolved with the resulting data structure
   */
  loadDirectories(defObj, view = null) {
    const promise = new Promise((resolve, reject) => {
      let dirDefList = [];
      let dirRefList = [];

      // for the case that just a directory object is given as definition,
      // we have to wrap it temporarily into a dummy object
      defObj = { def: defObj };

      let fileDefObj = clonePathObj(defObj); // clone definition object

      // decompose directory definition into list of directory paths (strings)
      decomposePathObj(fileDefObj, dirDefList, dirRefList, true);

      this._fileSystem.getList(dirDefList)
        .then((filePathListList) => {
          const subDirList = [];
          const length = filePathListList.length;

          // create sub directory file definitions (list of file paths structured into sub directory trees derived from file paths)
          if (length === dirDefList.length) {
            for (let i = 0; i < length; i++) {
              const dirPath = dirDefList[i].path;
              const pathList = filePathListList[i];
              const subDir = createObjFromPathList(pathList, dirPath);
              subDirList.push(subDir);
            }

            // replace directory paths in initial definition by sub directory file definitions
            // to create a complete file definition object
            populateRefList(dirRefList, subDirList);
          } else {
            throw new Error(`[${SERVICE_ID}] Cannot retrieve file paths from defined directories`);
          }

          // unwrap subDir from dummy object
          fileDefObj = fileDefObj.def;

          // load files
          this.loadFiles(fileDefObj, view)
            .then((data) => {
              this.ready();
              resolve(data);
            }).catch((error) => reject(error));
        }).catch((error) => reject(error));
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
    const inLength = inBuffer.length;
    const outLength = inLength + this.options.wrapAroundExtension * inBuffer.sampleRate;
    const outBuffer = audioContext.createBuffer(inBuffer.numberOfChannels, outLength, inBuffer.sampleRate);
    let arrayChData, arrayOutChData;

    for (let ch = 0; ch < inBuffer.numberOfChannels; ch++) {
      arrayChData = inBuffer.getChannelData(ch);
      arrayOutChData = outBuffer.getChannelData(ch);

      for (let i = 0; i < inLength; i++)
        arrayOutChData[i] = arrayChData[i];

      for (let i = inLength; i < outLength; i++)
        arrayOutChData[i] = arrayChData[i - inLength];
    }

    return outBuffer;
  }

  /** deprecated */
  load(files, view = null) {
    return this.loadFiles(files, view);
  }

  /**
   * Retrieve a loaded object.
   * @param {String} id - Object or group identifier.
   * @param {String} key - Member key in group.
   * @returns {Promise} - Returns the loaded object.
   */
  get(id, key = null) {
    const obj = this.data[id];

    if (obj && (key !== null))
      return obj[key];

    return obj;
  }

  /**
   * Retrieve a single audio buffer associated to a given id.
   * @param {String} id - Object identifier.
   * @param {Number} index - Audio buffer index (if array).
   * @returns {Promise} - Returns a single loaded audio buffer associated to the given id.
   */
  getAudioBuffer(id = 'default', index = 0) {
    return this.audioBuffers[id][index];
  }

  /**
   * Retrieve an array of audio buffers associated to a given id.
   * @param {String} id - Object identifier.
   * @returns {Promise} - Returns an array of loaded audio buffers associated to the given id.
   */
  getAudioBufferArray(id = 'default') {
    return this.audioBuffers[id];
  }
}

serviceManager.register(SERVICE_ID, AudioBufferManager);

export default AudioBufferManager;
