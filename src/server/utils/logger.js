import chalk from 'chalk';
import columnify from 'columnify';

/**
 * @private
 */
const logger = {
  verbose: true,

  configure(verbose) {
    this.verbose = verbose;
  },

  title(msg) {
    if (!this.verbose) { return }

    console.log(chalk.cyan(`+ ${msg}`));
  },

  clientConfigAndRouting(routes, config) {
    if (!this.verbose) { return }

    const clientsConfig = config.app.clients;
    const serverIp = config.env.serverIp;
    const auth = config.env.auth;
    const table = [];

    for (let clientType in clientsConfig) {
      const client = clientsConfig[clientType];

      if (client.target === 'node') {
        const line = {
          client_type: `> ${clientType}`,
          target: chalk.red(client.target),
          path: `server ip: ${chalk.green(serverIp)}`,
          default: undefined,
          auth: undefined,
        }

        table.push(line);
      } else if (client.target === 'browser') {
        const line = {
          client_type: `> ${clientType}`,
          target: chalk.red(client.target),
          path: routes.find(r => r.clientType === clientType) ?
            chalk.green(routes.find(r => r.clientType === clientType).path) :
            chalk.red('no route defined'),
          default: (client.default ? 'x' : undefined),
          auth: auth && auth.clients.indexOf(clientType) !== -1 ? 'x' : undefined,
        }

        table.push(line);
      } else {
        console.log(`@warning: no target defined for client ${clientType}`);
      }
    }

    console.log(``);
    console.log(columnify(table, {
      showHeaders: true,
      minWidth: 6,
      columnSplitter: ' | ',
      config: {
        default: { align: 'center' },
        auth: { align: 'center' },
      }
    }));
    console.log(``);

    // check if a route is defined but not in config
    if (clientsConfig) {
      const configClientTypes = Object.keys(clientsConfig);
      routes.forEach(r => {
        if (configClientTypes.indexOf(r.clientType) === -1) {
          console.log(`@warning: no client config found for route ${r.clientType}`);
        }
      });
    } else {
      console.log(`@warning: no config found for clients`);
    }
  },

  ip(protocol, address, port) {
    if (!this.verbose) { return }

    console.log(`    ${protocol}://${address}:${chalk.green(port)}`);
  },

  pluginStart(name) {
    if (!this.verbose) { return }

    console.log(`    ${name} ${chalk.yellow('start...')}`);
  },

  pluginStarted(name) {
    if (!this.verbose) { return }

    console.log(`    ${name} ${chalk.cyan('started')}`);
  },

  pluginReady(name) {
    if (!this.verbose) { return }

    console.log(`    ${name} ${chalk.green('ready')}`);
  },

  pluginErrored(name) {
    if (!this.verbose) { return }

    console.log(`    ${name} ${chalk.red('errors')}`);
  },
};

export default logger;
