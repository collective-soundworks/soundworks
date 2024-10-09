export default function(Plugin) {
  return class PluginDelayServer extends Plugin {
    static target = 'server';

    constructor(server, id, options) {
      super(server, id);

      const defaults = {
        delayTime: 1000, // in ms
        throwError: false,
      };

      for (let name in options) {
        if (!(name in defaults)) {
          throw new Error(`[soundworks:PluginDelay] Unknown option "${name}" (available options: ${Object.keys(defaults).join(', ')})`);
        }
      }

      this.options = Object.assign(defaults, options);
    }

    async start() {
      await super.start();
      await new Promise(resolve => setTimeout(resolve, this.options.delayTime));

      if (this.options.throwError) {
        throw new Error(`[soundworks.PluginDelay] Plugin delay error`);
      }
    }

    async addClient(client) {
      await super.addClient(client);
    }

    async removeClient(client) {
      await super.removeClient(client);
    }
  }
}
