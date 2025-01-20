import { ClientPlugin } from '../../src/client/index.js';

export default class ClientPluginDelay extends ClientPlugin {
  constructor(client, id, options) {
    super(client, id);

    const defaults = {
      delayTime: 1000, // in ms
      throwError: false,
    };

    for (let name in options) {
      if (!(name in defaults)) {
        throw new Error(`Cannot construct 'ClientPluginDelay': Unknown option "${name}" (available options: ${Object.keys(defaults).join(', ')})`);
      }
    }

    this.options = Object.assign(defaults, options);
  }

  async start() {
    await super.start();
    await new Promise(resolve => setTimeout(resolve, this.options.delayTime));

    if (this.options.throwError) {
      throw new Error(`Error in 'ClientPluginDelay', line 28`);
    }
  }
}
