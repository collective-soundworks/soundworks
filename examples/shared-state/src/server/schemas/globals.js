/**
 * This schema is created by the server, every client can `attach` to this state.
 * This is typically the way to represent global parameters of the application
 * (for example: master volume, mute).
 */
export default {
  // master volume in dB [-60, 6]
  master: {
    type: 'integer',
    min: -60,
    max: 6,
    step: 1,
    default: 0,
  },
  // mute [true, false]
  mute: {
    type: 'boolean',
    default: false,
  },
};
