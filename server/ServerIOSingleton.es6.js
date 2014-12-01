var IO = require('socket.io');

class ServerIOSingleton {
  
  constructor() {
    this.server = null;
    this.io = null;
  }

  initIO(server = null) {
    this.server = this.server || server;
    if (!this.server) return;
    
    this.io = new IO(this.server);
    return this.io;
  }

}

// Everyone will use this instance with the same instantiated IO.
module.exports = new ServerIOSingleton();