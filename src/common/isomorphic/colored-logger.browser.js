/**
 * @private
 */
export default {
  title(msg) {
    console.log(`%c${msg}`, 'color: cyan');
  },
  log(msg) {
    console.log(msg);
  },
  warn(msg) {
    console.warn(`%c${msg}`, 'color: yellow');
  },
  error(msg) {
    console.error(`%c${msg}`, 'color: red');
  },
};
