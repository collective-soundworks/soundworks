var IO = require('socket.io');

class SocketIoServer {
  
  constructor() {
    this.server = null;
    this.io = null;
  }

  init(server = null) {
    this.server = this.server || server;
    if (!this.server) return;
    
    this.io = new IO(this.server);
    return this.io;
  }

}

// Everyone will use this instance with the same instantiated IO.
module.exports = new SocketIoServer();