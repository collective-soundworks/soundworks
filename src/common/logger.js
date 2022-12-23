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
    if (!this.verbose) {
      return;
    }


    console.log(chalk.cyan(`+ ${msg}`));
  },

  clientConfigAndRouting(routes, config) {
    if (!this.verbose) {
      return;
    }


    const clientsConfig = config.app.clients;
    const serverAddress = config.env.serverAddress;
    const auth = config.env.auth;
    const table = [];

    for (let role in clientsConfig) {
      const client = clientsConfig[role];

      if (client.target === 'node') {
        const line = {
          role: `> ${role}`,
          target: chalk.red(client.target),
          path: `serverAddress: ${chalk.green(serverAddress)}`,
          default: undefined,
          auth: undefined,
        };

        table.push(line);
      } else if (client.target === 'browser') {
        const line = {
          role: `> ${role}`,
          target: chalk.red(client.target),
          path: routes.find(r => r.role === role) ?
            chalk.green(routes.find(r => r.role === role).path) :
            chalk.red('no route defined'),
          default: (client.default ? 'x' : undefined),
          auth: auth && auth.clients.indexOf(role) !== -1 ? 'x' : undefined,
        };

        table.push(line);
      } else {
        console.log(`@warning: no target defined for client ${role}`);
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
      },
    }));
    console.log(``);

    // check if a route is defined but not in config
    if (clientsConfig) {
      const configClientTypes = Object.keys(clientsConfig);
      routes.forEach(r => {
        if (configClientTypes.indexOf(r.role) === -1) {
          console.log(`@warning: no client config found for route ${r.role}`);
        }
      });
    } else {
      console.log(`@warning: no config found for clients`);
    }
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
};

export default logger;
