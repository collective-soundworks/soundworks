import chalk from 'chalk';

/**
 * @private
 */
const logger = {
  verbose: true,

  configure(verbose) {
    this.verbose = verbose;
  },

  title(msg) {
    if (!this.verbose) {
      return;
    }

    console.log(chalk.cyan(`+ ${msg}`));
  },

  log(msg) {
    if (!this.verbose) {
      return;
    }

    console.log(msg);
  },

  warn(msg) {
    if (!this.verbose) {
      return;
    }

    console.warn(chalk.yellow(msg));
  },

  error(msg) {
    if (!this.verbose) {
      return;
    }

    console.error(chalk.red(msg));
  },

  ip(protocol, address, port) {
    if (!this.verbose) {
      return;
    }

    console.log(`    ${protocol}://${address}:${chalk.green(port)}`);
  },

  pluginStart(name) {
    if (!this.verbose) {
      return;
    }

    console.log(`    ${name} ${chalk.yellow('start...')}`);
  },

  pluginStarted(name) {
    if (!this.verbose) {
      return;
    }

    console.log(`    ${name} ${chalk.cyan('started')}`);
  },

  pluginReady(name) {
    if (!this.verbose) {
      return;
    }

    console.log(`    ${name} ${chalk.green('ready')}`);
  },

  pluginErrored(name) {
    if (!this.verbose) {
      return;
    }

    console.log(`    ${name} ${chalk.red('errors')}`);
  },

  warnVersionDiscrepancies(clientRole, clientVersion, serverVersion) {
    console.warn(`
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

WARNING

Version discrepancies between server and "${clientRole}" client:
+ server: ${serverVersion} | client: ${clientVersion}

This might lead to unexpected behavior, you should consider to re-install your
dependencies on both your server and clients.

!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
  },

  deprecated(oldAPI, newAPI, lastSupportedVersion) {
    if (!lastSupportedVersion) {
      throw new Error(`Invalid 'logger.deprecated call: a deprecation version is required`);
    }

    const msg = `[Deprecation Warning] ${oldAPI} is deprecated (last supported version: ${lastSupportedVersion}) and will be removed in the next major revision, please use ${newAPI} instead.`;
    console.warn(chalk.yellow(msg));
  },

  removed(oldAPI, hint, lastSupportedVersion) {
    if (!lastSupportedVersion) {
      throw new Error(`Invalid 'logger.deprecated call: a deprecation version is required`);
    }

    const msg = `[Removed API] ${oldAPI} has been removed (last supported version: ${lastSupportedVersion}), please use ${hint} instead.`;
    throw new Error(msg);
  },
};

export default logger;
