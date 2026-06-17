import coloredLogger from '#isomorphic/colored-logger.js';

/**
 * @private
 */
export default {
  // Note that setting verbose to false is mainly useful for tests
  verbose: true,

  title(msg) {
    if (this.verbose) {
      coloredLogger.title(msg);
    }
  },
  log(msg) {
    if (this.verbose) {
      coloredLogger.log(msg);
    }
  },
  warn(msg) {
    if (this.verbose) {
      coloredLogger.warn(msg);
    }
  },
  error(msg) {
    if (this.verbose) {
      coloredLogger.error(msg);
    }
  },
};
