export default function(Plugin) {
  return class PluginDelayClient extends Plugin {
    constructor(client, id, options) {
      super(client, id);

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
  }
}
