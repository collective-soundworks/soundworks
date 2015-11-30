import fs from 'fs';
import Module from './Module';

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
 * [server] Retrieve a list of files on the server in the `/public` folder upon request of the client.
 *
 * (See also {@link src/client/Filelist.js~Filelist} on the client side.)
 */
export default class FileList extends Module {
  /**
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
