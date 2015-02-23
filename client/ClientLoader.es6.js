/**
 * @fileoverview Soundworks client side module base class
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ClientModule = require('./ClientModule');
var client = require('./client');
var AudioBufferLoader = require('loaders').AudioBufferLoader;

class ClientLoader extends ClientModule {
  constructor(audioFiles) {
    super('loader', true);

    this.audioFiles = audioFiles;
    this.audioBuffers = null;
    this.fileProgress = [];
    this.progress = 0

    var contentDiv = document.createElement('div');
    contentDiv.classList.add('centered-content');
    this.displayDiv.appendChild(contentDiv);

    var loadingText = document.createElement('p');
    loadingText.classList.add('loading-text');
    loadingText.innerHTML = "Loading files…";
    contentDiv.appendChild(loadingText);

    var progressWrap = document.createElement('div');
    progressWrap.classList.add('progress-wrap');
    contentDiv.appendChild(progressWrap);

    var progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar');
    progressWrap.appendChild(progressBar);

    this.progressBar = progressBar;
  }

  start() {
    super.start();

    var loader = new AudioBufferLoader();
    loader.progressCallback = this.__progressCallback.bind(this);
    
    loader.load(this.audioFiles)
      .then(
        (audioBuffers) => {
          this.audioBuffers = audioBuffers;
          this.done();
        }, (error) => {
          console.log(error);
        }
      );
  }

  __progressCallback(obj) {
    var progress = 0;
    this.fileProgress[obj.index] = obj.value;

    for (let i = 0; i < this.fileProgress.length; i++) {
      progress += this.fileProgress[i] / this.audioFiles.length;
    }

    progress = Math.ceil(progress * 100);
    this.progressBar.style.width = progress + "%";
  }

}

module.exports = ClientLoader;