import fs from 'fs';
import path from 'path';
import Service from '../core/Service';
import serviceManager from '../core/serviceManager';
import wavEncoder from 'wav-encoder';

const SERVICE_ID = 'service:shared-recorder';


class SharedRecorder extends Service {
  constructor() {
    super(SERVICE_ID);

    const defaults = {
      directory: 'public'
    };

    this.buffers = new Map();
    // this.stacks = {};

    this._rawSocket = this.require('raw-socket', {
      protocol: [
        { channel: 'shared-recorder:start-record', type: 'Uint8' },
        { channel: 'shared-recorder:stop-record', type: 'Uint8' },
        { channel: 'shared-recorder:new-block', type: 'Float32' },
      ],
    });
  }

  start() {
    super.start();

    this.ready();
  }

  connect(client) {
    // producer
    // @todo - define if the client is a producer in the handshake
    this.receive(client, 'create-buffer', this._createBuffer(client));

    this._rawSocket.receive(client, 'shared-recorder:start-record', this._startRecord(client));
    this._rawSocket.receive(client, 'shared-recorder:stop-record', this._stopRecord(client));
    this._rawSocket.receive(client, 'shared-recorder:new-block', this._recordBlock(client));
  }

  disconnect(client) {

  }

  // remove that...
  _getBufferInfos(client, index) {
    const bufferId = `${client.uuid}:${index}`;
    return this.buffers[bufferId];
  }

  _createBuffer(client) {
    const uuid = client.uuid;

    return (infos) => {
      // prepare the buffer
      infos.buffer = new Float32Array(infos.length);
      infos.chunkHop = infos.chunkPeriod * infos.sampleRate; // period in samples
      infos.chunkSize = infos.chunkDuration * infos.sampleRate;
      // initialize pointers
      infos.pointer = 0;
      infos.chunkIndex = 0;
      // console.log(infos, infos.chunkPeriod, infos.sampleRate);

      const bufferId = `${uuid}:${infos.index}`;
      this.buffers[bufferId] = infos;

      console.log('create buffer');
    };
  }

  _startRecord(client) {
    return (data) => {
      const index = data[0];
      const infos = this._getBufferInfos(client, index);
      infos.pointer = 0;
      infos.chunkIndex = 0;
      infos.full = false;
      console.log('start', index);
    }
  }

  _stopRecord(client) {
    return (data) => {
      const index = data[0];
      const infos = this._getBufferInfos(client, index);
      console.log('stop', index);

      // finalize current chunk with available data
      const start = infos.chunkIndex * infos.chunkHop;
      this._finalizeChunk(infos, start, infos.pointer);
    }
  }

  _finalizeChunk(infos, start, end) {
    // const startTime = start / infos.sampleRate;
    // const endTime = end / infos.sampleRate;
    // console.log('finalizeBuffer', infos.name, infos.chunkIndex, start, startTime + 's', end, endTime + 's');

    const { name, chunkIndex, buffer } = infos;
    let chunk;

    if (start < 0) {
      chunk = new Float32Array(end - start);
      chunk.set(buffer.subarray(start), 0);
      chunk.set(buffer.subarray(0, end), -start);
    } else {
      chunk = buffer.subarray(start, end);
    }

    wavEncoder.encode({
      sampleRate: infos.sampleRate,
      channelData: [chunk],
    }).then((buffer) => {
      const filename = `${infos.name}-${chunkIndex}.wav`;
      // @todo - remove hard coded path
      const clientPath = path.join('sounds', filename);
      const serverPath = path.join(process.cwd(), 'public', clientPath);
      // write encoded buffer into a file
      const stream = fs.createWriteStream(serverPath);
      stream.on('finish', () => this._notifyChunk(name, chunkIndex, clientPath));
      stream.write(new Buffer(buffer));
      stream.end();
    });
  }

  _notifyChunk(name, chunkIndex, path) {
    // @todo - should send only to consumers client types
    console.log(`notify "${name}" - chunkIndex: ${chunkIndex} - ${path}`);
    this.broadcast(null, null, 'available-file', name, chunkIndex, path);
    // emit for server side
    this.emit('available-file', name, chunkIndex, path);
  }

  // @fixme - this implementation assume that the block size cannot be larger
  // than the hop size, cannot have multiple output chunk in one incomming block
  _verifyChunk(infos, prevPointer, currentPointer) {
    const full = infos.full;
    const chunkIndex = infos.chunkIndex;
    const hop = infos.chunkHop;
    const size = infos.chunkSize;
    const length = infos.length;

    let end = chunkIndex * hop + size;

    if (end > length)
      end = end - length;

    const start = end - size;

    if (!full && start < 0)
      return;

    if (end > prevPointer && end <= currentPointer) {
      this._finalizeChunk(infos, start, end);
      infos.chunkIndex = (infos.chunkIndex + 1) % infos.numChunks;
    }
  }

  _recordBlock(client) {
    const uuid = client.uuid;

    return (data) => {
      const index = data[0];
      const buffer = data.subarray(1);
      const bufferId = `${uuid}:${index}`;
      const length = buffer.length;
      const infos = this.buffers[bufferId];
      const prevPointer = infos.pointer;

      const numLeft = infos.length - infos.pointer;
      const numCopy = Math.min(numLeft, length);
      const toCopy = buffer.subarray(0, numCopy);
      // @todo - handle the end of the buffer properly
      infos.buffer.set(toCopy, infos.pointer);
      infos.pointer += toCopy.length;
      // console.log(infos.pointer, toCopy.length, infos.length);

      this._verifyChunk(infos, prevPointer, infos.pointer);

      if (!infos.cyclic && infos.pointer === infos.length)
        console.log('end recording');

      // if cyclic buffer - reinit pointer and copy rest of the incomming buffer
      if (infos.cyclic && infos.pointer === infos.length) {
        infos.full = true;
        infos.pointer = 0;

        if (numCopy < length) {
          const toCopy = buffer.subarray(numCopy);
          infos.buffer.set(toCopy, 0);
          infos.pointer += toCopy.length;
        }

        this._verifyChunk(infos, prevPointer, infos.pointer);
      }
    }
  }
}

serviceManager.register(SERVICE_ID, SharedRecorder);

export default SharedRecorder;
