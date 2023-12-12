import { idGenerator } from '@ircam/sc-utils';

const generateRequestId = idGenerator();

export default class PromiseStore {
  constructor(name) {
    this.name = name;
    this.store = new Map();
  }

  add(resolve, reject, type) {
    const reqId = generateRequestId.next().value;
    this.store.set(reqId, { resolve, reject, type });

    return reqId;
  }

  resolve(reqId, data) {
    const { resolve } = this.store.get(reqId);
    this.store.delete(reqId);

    resolve(data);
  }

  reject(reqId, msg) {
    const { reject } = this.store.get(reqId);
    this.store.delete(reqId);

    reject(new Error(msg));
  }

  // reject all pendeing request
  flush() {
    for (let [_reqId, entry] of this.store) {
      const { reject, type } = entry;
      reject(new Error(`[${this.name}] Discard promise "${type}", cannot resolve`));
    }

    this.store.clear();
  }
}
