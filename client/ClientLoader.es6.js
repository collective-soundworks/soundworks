/**
 * @fileoverview Soundworks client side module base class
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ClientModule = require('./ClientModule');
var client = require('./client');
var AudioBufferLoader = require('waves-loaders').AudioBufferLoader;

class ClientLoader extends ClientModule {
  constructor(audioFiles, options = {}) {
    super(options.name || 'loader', true, options.color);

    this._audioFiles = audioFiles;
    this._fileProgress = [];

    this.audioBuffers = null;

    var viewContent = document.createElement('div');
    viewContent.classList.add(['centered-content', 'soft-blink']);
    this.view.appendChild(viewContent);

    var loadingText = document.createElement('p');
    loadingText.innerHTML = "Loading sounds…";
    viewContent.appendChild(loadingText);

    var progressWrap = document.createElement('div');
    progressWrap.classList.add('progress-wrap');
    viewContent.appendChild(progressWrap);

    var progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar');
    progressWrap.appendChild(progressBar);

    this.progressBar = progressBar;
  }

  start() {
    super.start();

    var loader = new AudioBufferLoader();
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
    var progress = 0;
    this._fileProgress[obj.index] = obj.value;

    for (let i = 0; i < this._fileProgress.length; i++) {
      progress += this._fileProgress[i] / this._audioFiles.length;
    }

    progress = Math.ceil(progress * 100);
    this.progressBar.style.width = progress + "%";
  }

}

module.exports = ClientLoader;