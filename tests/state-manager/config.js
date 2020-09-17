// mixed config for server and client
module.exports = {
  app: {
    name: 'test-state-manager',
    clients: {
      test: { target: 'node' },
    },
  },
  env: {
    type: 'development',
    port: 8081,
    assetsDomain: '',
    serverIp: '127.0.0.1',
    websockets: { path: 'socket', url: '', pingInterval: 5000
    },
    useHttps: false,
    httpsInfos: { key: null, cert: null },
  },

  // client only config
  clientType: 'test',
};
