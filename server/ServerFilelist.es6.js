'use strict';

var ServerModule = require('./ServerModule');
var fs = require('fs');

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

class ServerFilelist extends ServerModule {
  constructor(options = {}) {
    super(options.name || 'filelist');
  }

  connect(client) {
    super.connect(client);

    client.receive('filelist:request', (subfolder, extensions) => {
      let filesList = [];

      fs.readdir('./public/' + subfolder, (err, files) => {
        if (err) throw err;

        for (let file of files) {
          if (file[0] !== '.' && checkForExtensions(file, extensions))
            filesList.push(file);
        }

        client.send('filelist:files', filesList);
      });
    });
  }
}

module.exports = ServerFilelist;