import { idGenerator } from '@ircam/sc-utils';

/** @private */
export default class PromiseStore {
  constructor(name) {
    this.name = name;
    this.store = new Map();
    this.generateRequestId = idGenerator();
  }

  add(resolve, reject, type, localParams) {
    const reqId = this.generateRequestId.next().value;
    this.store.set(reqId, { resolve, reject, type, localParams });

    return reqId;
  }

  resolve(reqId, data) {
    if (this.store.has(reqId)) {
      const { resolve, localParams } = this.store.get(reqId);
      this.store.delete(reqId);

      // re-merge local params into network response
      if (localParams !== undefined) {
        Object.assign(data, localParams);
      }

      resolve(data);
    } else {
      throw new Error(`[${this.name}] cannot resolve request id (${reqId}), id does not exist`);
    }
  }

  reject(reqId, msg) {
    if (this.store.has(reqId)) {
      const { reject } = this.store.get(reqId);
      this.store.delete(reqId);

      reject(new Error(msg));
    } else {
      throw new Error(`[${this.name}] cannot reject request id (${reqId}), id does not exist`);
    }
  }

  // reject all pending request
  flush() {
    for (let [_reqId, entry] of this.store) {
      const { reject, type } = entry;
      reject(new Error(`[${this.name}] Discard promise "${type}", cannot resolve`));
    }

    this.store.clear();
  }
}
