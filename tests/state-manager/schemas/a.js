module.exports = {
  bool: {
    type: 'boolean',
    default: false,
  },
  int: {
    type: 'integer',
    min: 0,
    max: 100,
    default: 0,
    step: 1,
  },
  event: {
    type: 'boolean',
    event: true,
  },
  doNotFilterChange: {
    type: 'boolean',
    default: true,
    filterChange: false,
  },
};
