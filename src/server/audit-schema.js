/**
 * Internal schema used to audit the application.
 */
export default {
  /**
   * Number of connected clients by role.
   *
   * @example
   * {
   *   player: 12,
   *   controller: 1,
   * }
   */
  numClients: {
    type: 'any',
    default: {},
  },

  /**
   * Average latency in seconds computed from ping/pong.
   */
  averageNetworkLatency: {
    type: 'float',
    default: 0,
  },

  /**
   * Time window in second used to compute the average latency. Defaults to 5
   */
  averageNetworkLatencyWindow: {
    type: 'float',
    default: 5,
  },

  /**
   * Period in second at which the average latency is computed. Defaults to 2
   */
  averageNetworkLatencyPeriod: {
    type: 'float',
    default: 2,
  },
};
