'use strict';

var client = require('./client');
var ClientModule = require('./ClientModule');

class Filelist extends ClientModule {
  constructor(options = {}) {
    super(options.name || 'filelist', false);

    this.folder = options.folder || '';
    this.extensions = options.extensions || undefined;
    this.files = null;
  }

  start() {
    super.start();

    client.send(this.name + ':request', this.folder, this.extensions);
    client.receive(this.name + ':files', (files) => {
      this.files = files;
      this.emit('filelist:files', files);
      this.done();
    }, this);
  }
}

module.exports = Filelist;