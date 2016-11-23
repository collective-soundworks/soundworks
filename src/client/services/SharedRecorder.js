import Service from '../core/Service';
import serviceManager from '../core/serviceManager';
import { audioContext } from 'waves-audio';

const SERVICE_ID = 'service:shared-recorder';

// const filter = filename => true;

class SharedRecorder extends Service {
  constructor() {
    super(SERVICE_ID);

    const defaults = {
      recorder: false,
    };

    this.configure(defaults);

    this._rawSocket = this.require('raw-socket');
    this._audioBufferManager = this.require('audio-buffer-manager');
    this._platfform = null;

    this._gain = 1;

    this._listeners = new Map();
    this._streams = {};
    this._buffers = {};
    this._bufferNames = [];

    this._onAvailableFile = this._onAvailableFile.bind(this);
  }

  configure(options) {
    if (options.recorder === true) {
      this._platfform = this.require('platform', {
        features: ['audio-input', 'web-audio'],
      });
    }

    super.configure(options);
  }

  setGain(value) {
    this._gain = value;
  }

  init() {

  }

  start() {
    super.start();

    if (!this.hasStarted)
      this.init();

    this.receive('available-file', this._onAvailableFile);

    // @todo - implement a handshake to notify the server about who
    // is a consumer and who is a recorder.
    this.ready();
  }

  stop() {

  }

  /** Consumer interface */

  /**
   * Get notifications for new available files
   *
   * @param {String} name - Id of the buffer.
   * @param {Number} phase - If ring buffer, phase of the buffer.
   * @param {String} filename - Path of the file on the server.
   */
  _onAvailableFile(name, phase, filename) {
    const listener = this._listeners.get(name);

    if (listener) {
      const { filter, callback } = listener;

      if (filter.length === 0 || filter.indexOf(phase) !== -1) {
        const description = { [name]: { [phase]: filename } };

        this._audioBufferManager
          .loadFiles(description)
          .then(() => {
            const audioBuffer = this._audioBufferManager.get(name, phase);
            callback(audioBuffer, phase);
          })
          .catch((err) => console.error(err.stack));
      }
    }
  }

  /**
   *
   *
   */
  addListener(name, filter, callback) {
    this._listeners.set(name, { filter, callback });
  }

  removeListener(name) {
    this._listeners.delete(name);
  }


  /** Recorder interface */

  _getIndex(name) {
    let index = this._bufferNames.indexOf(name);

    if (index === -1) {
      index = this._bufferNames.length;
      this._bufferNames[index] = name;
    }

    return index;
  }

  /**
   * @param {String} name - Name of the record buffer.
   * @param {Number} chunkDuration - Duration of each chunk in second.
   * @param {Number} chunkPeriod - Period between each chunk.
   * @param {Number} numChunks - Number of chunk in the recording.
   * @param {Boolean} cyclic - Define if ring buffer or not.
   */
  createBuffer(name, chunkDuration, chunkPeriod, numChunks, cyclic = true) {
    // client specific index of the given name
    const index = this._getIndex(name);
    const infos = { index, name, chunkDuration, chunkPeriod, numChunks, cyclic };
    const sampleRate = audioContext.sampleRate;
    let length;

    if (!cyclic)
      length = chunkPeriod * (numChunks - 1) + chunkDuration;
    else
      length = chunkPeriod * numChunks;

    infos.length = length * sampleRate;
    infos.sampleRate = sampleRate;

    // keep a local copy of the informations
    this._buffers[name] = infos;
    this.send('create-buffer', infos);
  }

  startRecord(name) {
    console.log('start', name);
    const infos = this._buffers[name];
    const stream = this._streams[name];

    if (!infos)
      throw new Error(`Cannot start non existing buffer: "${name}"`);
    else if (stream)
      this._disconnectGraph(name);

    const index = infos.index;

    // if not cyclic to be able to stop the record
    if (infos.cyclic === false)
      infos.pointer = 0;

    // send start message (reinit buffer pointer)
    const msg = new Uint8Array(1);
    msg[0] = index;
    this._rawSocket.send('shared-recorder:start-record', msg);

    // start recording
    const bufferSize = 4096;
    const buffer = new Float32Array(bufferSize + 1);
    buffer[0] = index;

    navigator.getUserMedia({ audio: true }, (stream) => {
      const scriptProcessor = audioContext.createScriptProcessor(bufferSize, 1, 1);
      scriptProcessor.connect(audioContext.destination);
      scriptProcessor.onaudioprocess = (e) => {
        const data = e.inputBuffer.getChannelData(0);

        if (this._gain !== 1) {
          const gain = this._gain;
          const length = data.length;

          for (let i = 0; i < length; i++)
            data[i] *= gain;
        }

        buffer.set(data, 1);
        this._rawSocket.send('shared-recorder:new-block', buffer);

        // maintain a local pointer to trigger `stopRecord` at the end of the buffer
        if (infos.cyclic === false) {
          infos.pointer += bufferSize;

          if (infos.pointer >= infos.length)
            this._disconnectGraph(infos.name);
        }
      }

      const audioIn = audioContext.createMediaStreamSource(stream);
      audioIn.connect(scriptProcessor);

      this._streams[name] = { stream, audioIn, scriptProcessor };
    }, function(err) { console.error(err.stack); });
  }

  /**
   * @param {String} name - Name of the buffer.
   */
  stopRecord(name) {
    if (!this._streams[name]) return;

    // send stop message
    const index = this._getIndex(name);
    const msg = new Uint8Array(1);
    msg[0] = index;
    this._rawSocket.send('shared-recorder:stop-record', msg);

    this._disconnectGraph(name);
  }

  _disconnectGraph(name) {
    const { stream, audioIn, scriptProcessor } = this._streams[name];
    scriptProcessor.disconnect();
    audioIn.disconnect();

    stream.getTracks()[0].stop();
    delete this._streams[name];
  }
}

serviceManager.register(SERVICE_ID, SharedRecorder);

export default SharedRecorder;
