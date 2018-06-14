import fs from 'fs';
import path from 'path';

const cacheDir = path.join(process.cwd(), '.soundworks');

if (!fs.existsSync(cacheDir))
  fs.mkdirSync(cacheDir);

function getFilename(serviceId) {
  const filename = serviceId.replace(':', '_');
  return path.join(cacheDir, filename);
}

const cache = {
  write(serviceId, key, value) {
    // const storePath
    const filename = getFilename(serviceId);

    if (!fs.existsSync(filename))
      fs.writeFileSync(filename, JSON.stringify({}));

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
      return undefined;
    }
  },
};

export default cache;
