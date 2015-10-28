const ServerModule = require('./ServerModule');


class ServerPlacer extends ServerModule {
  constructor(options) {
    super(options.name || 'placer');
  }

  connect(client) {
    super.connect(client);

    client.receive(`${this.name}:information`, (index, label, coords) => {
      client.modules[this.name].index = index;
      client.modules[this.name].label = label;
      client.coordinates = coords;
    });
  }

  disconnect(client) {
    super.disconnect(client);
  }
}

module.exports = ServerPlacer;