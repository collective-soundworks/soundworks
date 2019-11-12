import Keyv from 'keyv';
import KeyvFile from 'keyv-file';
import path from 'path';
import fs from 'fs';

/**
 * Simple in file key / value database.
 * Do not expose for now, may not be the right way to go...
 *
 * @todo - implement options to change storage solution.
 * cf. https://github.com/lukechilds/keyv
 *
 * @memberof @soundworks/core/server
 */
/** @private */
class Db {
  constructor(options = {}) {
    const dbDirectory = path.join(process.cwd(), '.db');

    if (!fs.existsSync(dbDirectory)) {
      fs.mkdirSync(dbDirectory);
    }

    const filename = path.join(dbDirectory, 'keyv.db')

    this.keyv = new Keyv({
      namespace: 'soundworks',
      store: new KeyvFile({ filename }),
    });

    this.keyv.on('error', err => console.log('Connection Error', err));
  }

  async get(key) {
    const value = await this.keyv.get(key);
    return value;
  }

  async set(key, value, expireDelayMs = undefined) {
    await this.keyv.set(key, value, expireDelayMs);
  }

  async delete(key) {
    await this.keyv.delete(key);
  }

  async clear() {
    await this.keyv.clear();
  }
}

export default Db;

