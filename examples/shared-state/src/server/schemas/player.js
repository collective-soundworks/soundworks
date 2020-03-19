/**
 * The schema represent the state of a given player (for example: local volume,
 * parameters of a synthesizer), meaning that each player client creates its own
 * instance of the schema.
 *
 * Other clients (typically a controller) can attach to the player's state to
 * monitor and remotely control the client.
 */
export default {
  // dummy oscillator params
  type: {
    type: 'enum',
    list: ['sine', 'square', 'sawtooth', 'triangle'],
    default: 'sine',
  },
  frequency: {
    type: 'integer',
    min: 50,
    max: 1000,
    default: 440,
  }
}
