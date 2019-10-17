import chalk from 'chalk';
import columnify from 'columnify';

/**
 * @private
 */
const logger = {
  title(msg) {
    console.log(chalk.cyan(`+ ${msg}`));
  },

  clientConfigAndRouting(routes, clientsConfig, serverIp) {
    const table = [];

    for (let clientType in clientsConfig) {
      const client = clientsConfig[clientType];

      if (client.target === 'node') {
        const line = {
          clientType: `${clientType}`,
          target: chalk.red(client.target),
          path: `server ip: ${chalk.green(serverIp)}`,
          default: undefined
        }

        table.push(line);
      } else if (client.target === 'browser') {
        const line = {
          clientType: `${clientType}`,
          target: chalk.red(client.target),
          path: routes.find(r => r.clientType === clientType) ?
            chalk.green(routes.find(r => r.clientType === clientType).path) :
            chalk.red('no route defined'),
          default: (client.default ? 'default' : undefined)
        }

        table.push(line);
      } else {
        console.log(`@warning: no target defined for client ${clientType}`);
      }
    }

    console.log(columnify(table, {
      showHeaders: false,
      minWidth: 14,
    }));

    // check if a route is defined but not in config
    const configClientTypes = Object.keys(clientsConfig);
    routes.forEach(r => {
      if (configClientTypes.indexOf(r.clientType) === -1) {
        console.log(`@warning: no client config found for route ${r.clientType}`);
      }
    });
  },

  ip(protocol, address, port) {
    console.log(`    ${protocol}://${address}:${chalk.green(port)}`);
  },

  // serviceStart(name) {
  //   console.log(`    ${name} ${chalk.cyan('start')}`);
  // },

  serviceStarted(name) {
    console.log(`    ${name} ${chalk.cyan('started...')}`);
  },

  serviceReady(name) {
    console.log(`    ${name} ${chalk.green('ready')}`);
  },
};

export default logger;
