"use strict"

class SocketIoClient {
  constructor() {
    this.socket = null;
  }

  init(namespace) {
    this.socket = io(namespace);
  }
}

module.exports = new SocketIoClient();