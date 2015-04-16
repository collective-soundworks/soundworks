/**
 * @fileoverview Soundworks server side loader module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ServerModule = require("./ServerModule");
var fs = require('fs');

class ServerLoader extends ServerModule {
  constructor(options = {}) {
    super(options.name || 'loader');

    this.fileNames = [];
  }

  connect(client) {
    super.connect(client);

    client.receive('loader:request', (subfolder) => {
      fs.readdir('./public/' + subfolder, (err, files) => {
        if (err) throw err;

        files.forEach((file) => {
          this.fileNames.push(file);
        });

        client.send('loader:files', this.fileNames);
      });

    });
  }
}

module.exports = ServerLoader;