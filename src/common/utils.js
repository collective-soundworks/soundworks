// https://stackoverflow.com/questions/17575790/environment-detection-node-js-or-browser
export const isBrowser = new Function('try {return this===window;}catch(e){ return false;}');

export function* idGenerator() {
  for (let i = 0; true; i++) {
    if (i === Number.MAX_SAFE_INTEGER) {
      i = 0;
    }

    yield i;
  }
}

export function isString(val) {
  return (typeof val === 'string' || val instanceof String);
}
