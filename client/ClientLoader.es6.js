/**
 * @fileoverview Soundworks client side module base class
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ClientModule = require('./ClientModule');
var client = require('./client');
var AudioBufferLoader = require('loaders').AudioBufferLoader;

class ClientLoader extends ClientModule {
  constructor(audioFiles, options = {}) {
    super('loader', true, options.color || 'black');

    this.__audioFiles = audioFiles;
    this.__fileProgress = [];

    this.audioBuffers = null;

    this.__createViewContent();

    var loadingText = document.createElement('p');
    loadingText.classList.add('soft-blink');
    loadingText.innerHTML = "Loading files…";
    this.viewContent.appendChild(loadingText);

    var progressWrap = document.createElement('div');
    progressWrap.classList.add('progress-wrap');
    this.viewContent.appendChild(progressWrap);

    var progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar');
    progressWrap.appendChild(progressBar);

    this.progressBar = progressBar;
  }

  start() {
    super.start();

    var loader = new AudioBufferLoader();
    loader.progressCallback = this.__progressCallback.bind(this);
    
    loader.load(this.__audioFiles)
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
    this.__fileProgress[obj.index] = obj.value;

    for (let i = 0; i < this.__fileProgress.length; i++) {
      progress += this.__fileProgress[i] / this.__audioFiles.length;
    }

    progress = Math.ceil(progress * 100);
    this.progressBar.style.width = progress + "%";
  }

}

module.exports = ClientLoader;