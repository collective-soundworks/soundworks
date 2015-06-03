/**
 * @fileoverview Soundworks client side module base class
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ClientModule = require('./ClientModule');
var client = require('./client');
var AudioBufferLoader = require('waves-loaders').AudioBufferLoader;

class ClientLoader extends ClientModule {
  constructor(options = {}) {
    super(options.name || 'loader', true, options.color);

    this.extensions = options.extensions ||  ['.wav', '.mp3'];

    this.files = options.files || null;
    this.buffers = [];

    this._asynchronous = !!options.asynchronous;

    this._fileProgress = null;
    this._progressBar = null;
    this._numFilesLoaded = 0;

    if (!this._asynchronous) {
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

  start() {
    super.start();
    this._load(this.files);
  }

  restart() {
    super.restart();
    this.done();
  }

  _loadFile(index, file) {
    let loader = new AudioBufferLoader();

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
      let loader = new AudioBufferLoader();

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
    let progress = 0;
    let fileIndex = obj.index;
    let fileProgress = obj.value;

    this._fileProgress[fileIndex] = fileProgress;

    for (let i = 0; i < this._fileProgress.length; i++) {
      progress += this._fileProgress[i] / this._fileProgress.length;
    }

    progress = Math.ceil(progress * 100);
    this._progressBar.style.width = progress + "%";
  }
}

module.exports = ClientLoader;