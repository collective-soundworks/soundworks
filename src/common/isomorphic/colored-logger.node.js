import { styleText } from 'node:util';

/**
 * @private
 */
export default {
  title(msg) {
    console.log(styleText('cyan', msg));
  },
  log(msg) {
    console.log(msg);
  },
  warn(msg) {
    console.warn(styleText('yellow', msg));
  },
  error(msg) {
    console.error(styleText('red', msg));
  },
};
