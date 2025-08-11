import { counter } from '@ircam/sc-utils';
// common js module...
import cancelable from 'cancelable-promise';
const { CancelablePromise } = cancelable;

/** @private */
export default class PromiseStore {
  constructor(name) {
    this.name = name;
    this.store = new Map();
    this.generateId = counter();
  }

  createPromise() {
    const id = this.generateId();
    let resolve, reject;

    const promise = new CancelablePromise((resolveFunc, rejectFunc) => {
      resolve = resolveFunc;
      reject = rejectFunc;
    });

    this.store.set(id, { promise, resolve, reject });

    return { id, promise };
  }

  // associate data to merge within the data given when calling `resolve`
  // cf. SharedState#set
  associateResolveData(id, associatedData) {
    const stored = this.store.get(id);
    stored.associatedData = associatedData;
  }

  resolve(id, data) {
    if (this.store.has(id)) {
      const { resolve, associatedData } = this.store.get(id);
      this.store.delete(id);

      // re-merge local params into network response
      if (associatedData !== undefined) {
        Object.assign(data, associatedData);
      }

      resolve(data);
    } else {
      throw new ReferenceError(`Cannot resolve request id (${id}): id does not exist`);
    }
  }

  reject(id, msg) {
    if (this.store.has(id)) {
      const { reject } = this.store.get(id);
      this.store.delete(id);

      reject(new Error(msg));
    } else {
      throw new ReferenceError(`Cannot resolve request id (${id}): id does not exist`);
    }
  }

  // cancel all pending request
  flush() {
    for (let [_id, entry] of this.store) {
      entry.promise.cancel();
    }

    this.store.clear();
  }
}
