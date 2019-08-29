import chalk from 'chalk';
import columnify from 'columnify';

/**
 * @private
 */
const logger = {
  title(msg) {
    console.log(chalk.cyan(`+ ${msg}`));
  },

  routing(routes) {
    routes = routes.map(({ clientType, path }) => {
      return { clientType: `[${clientType}]`, path: chalk.green(path) };
    });

    console.log(columnify(routes, {
      showHeaders: false,
      config: {
        clientType: { align: 'right' },
      },
    }));
  },

  ip(protocol, address, port) {
    console.log(`    ${protocol}://${address}:${chalk.green(port)}`);
  },

  serviceStart(name) {
    console.log(`    ${name} ${chalk.cyan('starting...')}`);
  },

  serviceReady(name) {
    console.log(`    ${name} ${chalk.green('ready')}`);
  },
};

export default logger;
