// mixed config for server and client
module.exports = {
  app: {
    name: 'web-socket-connect-retry',
    clients: {
      test: { target: 'node' },
    },
  },
  env: {
    type: 'development',
    port: 8081,
    serverIp: '127.0.0.1',
    useHttps: false,
  },
};
