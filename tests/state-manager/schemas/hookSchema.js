module.exports = {
  name: {
    type: 'string',
    default: null,
    nullable: true,
  },
  // value will be updated according to name from hook
  value: {
    type: 'string',
    default: null,
    nullable: true,
  },
};
