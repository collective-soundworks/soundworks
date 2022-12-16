export default {
  numClients: {
    type: 'any',
    default: {},
  },
  // average latency computed from ping/pong (s)
  averageNetworkLatency: {
    type: 'float',
    default: 0,
  },
  // time window on which the average latency is computed (s)
  averageNetworkLatencyWindow: {
    type: 'float',
    default: 5,
  },
  // period on which the average latency is computed (s)
  averageNetworkLatencyPeriod: {
    type: 'float',
    default: 2,
  },
};
