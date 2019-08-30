import fs from 'fs';
import path from 'path';


// const Keyv = require('keyv')
// const KeyvFile = require('keyv-file')

// const keyv = new Keyv({
//   store: new KeyvFile()
// });
// // More options with default value:
// const customKeyv = new Keyv({
//   store: new KeyvFile({
//     filename: `${os.tmpdir()}/keyv-file/default-rnd-${Math.random().toString(36).slice(2)}.json`, // the file path to store the data
//     expiredCheckDelay: 24 * 3600 * 1000, // ms, check and remove expired data in each ms
//     writeDelay: 100, // ms, batch write to disk in a specific duration, enhance write performance.
//     encode: JSON.stringify, // serialize function
//     decode: JSON.parse // deserialize function
//   })
// })

// // Simple Map API
// kv.someField.get(1) // empty return default value 1
// kv.someField.set(2) // set value 2
// kv.someField.get() // return saved value 2
// kv.someField.delete() // delete field

const cacheDir = path.join(process.cwd(), '.soundworks');

if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir);
}

function getFilename(serviceId) {
  const filename = serviceId.replace(':', '_');
  return path.join(cacheDir, filename);
}

const cache = {
  write(serviceId, key, value) {
    // const storePath
    const filename = getFilename(serviceId);

    if (!fs.existsSync(filename)) {
      fs.writeFileSync(filename, JSON.stringify({}));
    }

    const store = JSON.parse(fs.readFileSync(filename));
    store[key] = value;

    fs.writeFileSync(filename, JSON.stringify(store));
  },

  read(serviceId, key) {
    const filename = getFilename(serviceId);

    if (fs.existsSync(filename)) {
      const store = JSON.parse(fs.readFileSync(filename));
      return store[key];
    } else {
      return null;
    }
  },
};

export default cache;
