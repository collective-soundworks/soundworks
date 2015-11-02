'use strict';

const fs = require('fs');

import ServerModule from './ServerModule.es6.js';

function checkForExtensions(file, extensions) {
  if(!extensions || extensions.length === 0)
    return true;

  for (let extension of extensions) {
    let extensionIndex = file.length - extension.length;

    if(extensionIndex >= 0 && file.substring(extensionIndex, extensionIndex + extension.length) === extension)
      return true;
  }

  return false;
}

/**
 * The {@link ServerFilelist} module allows to dynamically send a list of files stored on the server to the clients.
 */
export default class ServerFilelist extends ServerModule {
  /**
   * Creates an instance of the class.
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='filelist'] Name of the module.
   */
  constructor(options = {}) {
    super(options.name || 'filelist');
  }

  /**
   * @private
   */
  connect(client) {
    super.connect(client);

    client.receive(this.name + ':request', (subfolder, extensions) => {
      let filesList = [];

      fs.readdir('./public/' + subfolder, (err, files) => {
        if (err) throw err;

        for (let file of files) {
          if (file[0] !== '.' && checkForExtensions(file, extensions))
            filesList.push(file);
        }

        client.send(this.name + ':files', filesList);
      });
    });
  }
}

module.exports = ServerFilelist;
