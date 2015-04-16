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

    this._requestServer = options.server || false;
    this._subfolder = options.subfolder || '';
    this._audioFiles = options.audioFiles || null;
    this._fileProgress = [];

    this.audioBuffers = null;

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

    this.progressBar = progressBar;
  }

  start() {
    super.start();

    if (this._requestServer) {
      client.send('loader:request', this._subfolder);

      client.receive('loader:files', (files) => {
        let filePaths = [];

        for (let i = 0; i < files.length; i++)
          filePaths.push(this._subfolder + '/' + files[i]);
        
        this._audioFiles = filePaths;
        this._load();
      });
    } else {
      this._load();
    }
  }

  _load() {
    let loader = new AudioBufferLoader();
    loader.progressCallback = this._progressCallback.bind(this);

    loader.load(this._audioFiles)
      .then(
        (audioBuffers) => {
          this.audioBuffers = audioBuffers;
          this.done();
        }, (error) => {
          console.log(error);
        }
      );
  }

  _progressCallback(obj) {
    let progress = 0;
    this._fileProgress[obj.index] = obj.value;

    for (let i = 0; i < this._fileProgress.length; i++) {
      progress += this._fileProgress[i] / this._audioFiles.length;
    }

    progress = Math.ceil(progress * 100);
    this.progressBar.style.width = progress + "%";
  }

}

module.exports = ClientLoader;