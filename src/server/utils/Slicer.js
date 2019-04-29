import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import chalk from 'chalk';
import { Lame } from 'node-lame';
import { StringDecoder } from 'string_decoder';

/**
 * Load and slice WAV file from input path.
 *
 * @param {Object} options
 * @param {Number} [options.duration=4.] - Duration of each slices.
 * @param {Boolean} [options.compress=true] - Defines if slices should be encoded as `wav` or `mp3`.
 * @param {Number} [options.bitrate=192] - If compress is set to true, defines the bitrate of the resulting `mp3`.
 * @param {Number} [options.overlap=0.] - Overlap duration between each slices.
 */
class Slicer {
  constructor({
    duration = 4.,
    compress = true,
    bitrate = 192,
    overlap = 0.
  } = {}) {
    // chunk duration, in seconds
    this.chunkDuration = duration;
    // output chunk audio format
    this.compress = compress;
    this.bitrate = bitrate;
    // overlap duration, in seconds
    this.overlapDuration = overlap;
    // locals
    this.reader = new Reader();

    try {
      execSync(`which lame`);
    } catch(err) {
      console.log(`${chalk.cyan('[soundworks]')} ${chalk.yellow(`AudioStreamManager requires "lame" to be installed to work properly.
Please make sure that "lame" is installed on your system (see https://www.npmjs.com/package/node-lame for installation instructions).`)}`);
    }
  }

  /**
   * Slice input file into several files.
   *
   * Only support wav files for input, and mp3 or files for output.
   *
   * @param {String} inputPath
   * @param {Function} callback
   * @throws {Error} on error on reading or writing
   */
  slice(inputPath, callback) {
    const input = path.parse(inputPath);

    if (input.ext !== '.wav') {
      throw new Error(`File extension ${input.ext} not supported, please use only '.wav' files as input`);
    }

    // load audio file
    this.reader.loadBuffer(inputPath, (buffer) => {
      // buffer with associated format and description
      const metaBuffer = this.reader.interpretHeaders(buffer);
      // compress to mp3 if channels <= 2
      const outputExtension = this.compress && metaBuffer.numberOfChannels <= 2 ? 'mp3' : 'wav';
      const outputDir = path.join(input.dir, input.name);

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
      }

      // init slicing loop
      const totalDuration = metaBuffer.dataLength / metaBuffer.bytePerSecond;
      const chunkList = [];
      const encoderPromises = [];
      const baseChunkDuration = this.chunkDuration;
      const overlapDuration = this.overlapDuration;

      let chunkStart = 0;
      let chunkIndex = 0;
      // loop exit condition
      let overlapEnd;
      // at least one chunk
      do {
        // const actualChunkDuration = baseChunkDuration + (Math.random() * 0.5 - 0.25) * baseChunkDuration;
        const chunked = this.getChunk(metaBuffer, chunkStart, baseChunkDuration + overlapDuration);
        // chunk times rounded to actual samples: updated values
        chunkStart = chunked.chunkStart;
        const chunkDuration = chunked.chunkDuration;
        const chunkBuffer = chunked.chunkBuffer;

        const overlapStart = chunkStart > overlapDuration ? overlapDuration : 0;
        overlapEnd = chunkStart + chunkDuration + overlapDuration < totalDuration ? overlapDuration : 0;

        const filename = `${chunkIndex}-${input.name}.${outputExtension}`;
        const chunkPath = path.join(outputDir, filename);

        if (outputExtension === 'mp3') {
          // need to encode segmented wav buffer to mp3
          const encoder = new Lame({
            output: chunkPath,
            bitrate: this.bitrate,
          });

          encoder.setBuffer(chunkBuffer);
          // @todo - limit the number of processes
          const promise = encoder.encode().catch((error) => {
            console.error(`Error with lame ${error.message}`);
            throw error;
          });

          encoderPromises.push(promise);
        } else {
          // wav output
          fs.writeFile(chunkPath, chunkBuffer, (error) => {
            if (error) {
              console.error(`Error while saving WAV file: ${error}`);
              throw error;
            }
          });
        }

        chunkList.push({
          name:chunkPath,
          start:chunkStart,
          // logical duration
          duration: chunkDuration - overlapEnd,
          overlapStart: overlapStart,
          overlapEnd: overlapEnd,
        });

        // next
        chunkIndex += 1;
        chunkStart += baseChunkDuration;
      } while (overlapEnd > 0);

      Promise.all(encoderPromises).then(() => callback(chunkList));
    });
  }

  /**
   * @typedef {Slicer~getChunkReturn}
   * @property {Buffer} buffer extracted
   * @property {chunkStart} actual chunk start in seconds
   * @property {chunkDuration} actual chunk duration in seconds
   */

  /**
   * Extract a part of a buffer.
   *
   * @param {Object} metaBuffer is buffer with interpreted headers
   * @param {Number} chunkStart in seconds
   * @param {Number} chunkDuration in seconds
   * @returns {Slicer~getChunkReturn} is {buffer, chunkStart, chunkDuration}
   * @throws {Error} when extracted buffer is empty
   */
  getChunk(metaBuffer, chunkStart, chunkDuration) {
    // utils
    const dataStart = metaBuffer.dataStart;
    const dataLength = metaBuffer.dataLength;
    const inputBuffer = metaBuffer.buffer;

    // get head / tail buffers (unchanged), before and after data
    const headBuffer = inputBuffer.slice(0, dataStart);
    const tailBuffer = inputBuffer.slice(dataStart + dataLength);

    const bytePerSecond = metaBuffer.bytePerSecond;
    const chunkStartIndex = Math.round(bytePerSecond * chunkStart);
    // end index is exclusive: one more
    const chunkEndIndex = chunkStartIndex + Math.round(bytePerSecond * chunkDuration);
    const dataBuffer = inputBuffer.slice(dataStart + chunkStartIndex, dataStart + chunkEndIndex);
    const chunkLength = dataBuffer.length;

    if (chunkLength === 0.) {
      const msg = `ERROR: fetched empty buffer, for ${metaBuffer.outputDir}, `
                      + `starting at ${chunkStart}, duration ${chunkDuration}`;
      throw new Error(msg);
    }

    // update data length descriptor in head buffer (last 4 bytes in header)
    headBuffer.writeUIntLE(dataBuffer.length, headBuffer.length - 4, 4);
    // concatenate head / data / tail buffers
    const length = headBuffer.length + tailBuffer.length + dataBuffer.length;
    const chunkBuffer = Buffer.concat([headBuffer, dataBuffer, tailBuffer], length);

    return {
      chunkBuffer: chunkBuffer,
      chunkStart: chunkStartIndex / bytePerSecond,
      chunkDuration: chunkLength / bytePerSecond,
    };
  }
}

/**
 * Read WAV file and get associated data buffer, and format.
 *
 * @private
 */
class Reader {
  /**
   * Creates an instance of Reader and set all options
   * @param {Options} options
   */
  constructor() {
    this.wavFormatReader = new WavFormatReader();
  }

  /**
   * Load file and return Node Buffer and extracted meta data.
   *
   * @param {string} inputPath
   * @param {Function} callback after file is loaded
   */
  loadBuffer(inputPath, callback) {
    try {
      let buffer = fs.readFileSync(inputPath);
      callback(buffer);
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  interpretHeaders(buffer) {
    const wavInfo = this.wavFormatReader.getWavInfos(buffer);
    // extract relevant info only
    const metaBuffer = {
      buffer,
      dataStart: wavInfo.descriptors.get('data').start,
      dataLength: wavInfo.descriptors.get('data').length,
      numberOfChannels: wavInfo.format.numberOfChannels,
      sampleRate: wavInfo.format.sampleRate,
      bytePerSecond: wavInfo.format.bytePerSecond,
      bitPerSample: wavInfo.format.bitPerSample,
    };

    return metaBuffer;
  }

}

/**
 * Get format and description of WAV file.
 *
 * @private
 */
class WavFormatReader {
  constructor() {
    this.stringDecoder = new StringDecoder('utf8');
  }

  getWavInfos(buffer) {
    const descriptors = this.getWavDescriptors(buffer);
    const format = this.getWavFormat(descriptors, buffer);
    return {descriptors, format};
  }

  /**
   * Format of WAV file.
   *
   * @see {@link http://www.topherlee.com/software/pcm-tut-wavformat.html}
   *
   * @typedef {WavFormatReader~format}
   * @property {Number} type 1 is PCM
   * @property {Number} numberOfChannels
   * @property {Number} sampleRate
   * @property {Number} bytePerSecond sampleRate * bitsPerSample * numberOfChannels / 8.
   * @property {Number} bitsPerSample
   */

  /**
   * Get format of a WAV file, according to its descriptors.
   *
   * @see @link WavFormatReader~getWavDescriptors}
   *
   * @param {WavFormatReader~descritors} descriptors
   * @param {Buffer} buffer
   * @returns {avFormatReader~format}
   */
  getWavFormat(descriptors, buffer) {
    // yes, it is 'fmt ' with a space at the end (4 chars)
    // (as each descriptor is 4 byte length)
    const fmt = descriptors.get('fmt ');
    const format = {
      type: buffer.readUIntLE(fmt.start, 2),
      numberOfChannels: buffer.readUIntLE(fmt.start + 2, 2),
      sampleRate: buffer.readUIntLE(fmt.start + 4, 4),
      bytePerSecond: buffer.readUIntLE(fmt.start + 8, 4),
      bitsPerSample: buffer.readUIntLE(fmt.start + 14, 2)
    };
    return format;
  }

  /**
   * Descriptors of WAV file.
   *
   * @see {@link http://www.topherlee.com/software/pcm-tut-wavformat.html}
   *
   * @typedef {WavFormatReaded~descritors}
   * @property {Object} 'fmt ' (with a space) is the format
   * @property {Object} data contains the data
   */

  /**
   * Get descriptors of a WAV file.
   *
   * @param {Buffer} buffer
   * @returns {WavFormatReader~descritors} descriptors
   */
  getWavDescriptors(buffer) {
    const descriptorLength = 4; // 4 bytes

    let index = 0;
    let descriptor = '';
    let chunkLength = 0;
    let descriptors = new Map();

    // search for buffer descriptors
    while (index < buffer.length) {

      // read chunk descriptor
      let bytes = buffer.slice(index, index + descriptorLength);
      descriptor = this.stringDecoder.write(bytes);

      if (descriptor === 'RIFF') {
        // RIFF descriptor's length is always 12 bytes
        chunkLength = 12;
        descriptors.set(descriptor, {
          start:index + descriptorLength,
          length: chunkLength
        });
        // first subchunk is after header
        index += chunkLength;
      } else {
        // account for descriptor length
        index += descriptorLength;

        chunkLength = buffer.readUIntLE(index, descriptorLength);

        descriptors.set(descriptor, {
          start:index + descriptorLength,
          length: chunkLength,
        });

        index += chunkLength + descriptorLength;
      }
    }

    return descriptors;
  }

}

export default Slicer;

