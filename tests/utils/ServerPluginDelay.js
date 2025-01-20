import { ServerPlugin } from '../../src/server/index.js';

export default class ServerPluginDelay extends ServerPlugin {
  constructor(server, id, options) {
    super(server, id);

    const defaults = {
      delayTime: 1000, // in ms
      throwError: false,
    };

    for (let name in options) {
      if (!(name in defaults)) {
        throw new Error(`Cannot construct 'ServerPluginDelay': Unknown option "${name}" (available options: ${Object.keys(defaults).join(', ')})`);
      }
    }

    this.options = Object.assign(defaults, options);
  }

  async start() {
    await super.start();
    await new Promise(resolve => setTimeout(resolve, this.options.delayTime));

    if (this.options.throwError) {
      throw new Error(`Error in 'ClientPluginDelay', line 26`);
    }
  }
}
