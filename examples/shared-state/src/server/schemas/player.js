/**
 * The schema represent the state of a given player (for example: local volume,
 * parameters of a synthesizer), meaning that each player client creates its own
 * instance of the schema.
 *
 * Other clients (typically a controller) can attach to the player's state to
 * monitor and remotely control the client.
 */
export default {
  // dummy params
  param1: {
    type: 'integer',
    min: -60,
    max: 6,
    step: 1,
    default: 0,
  },
  param2: {
    type: 'float',
    min: -1,
    max: 1,
    step: 0.001,
    default: 0.3,
  }
}
