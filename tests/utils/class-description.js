export const a = {
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
};

export const aExpectedDescription = {
  "bool": {
    "default": false,
    "event": false,
    "filterChange": true,
    "immediate": false,
    "initValue": false,
    "metas": {},
    "nullable": false,
    "required": false,
    "type": "boolean",
  },
  "int": {
    "default": 0,
    "event": false,
    "filterChange": true,
    "immediate": false,
    "initValue": 0,
    "max": 100,
    "metas": {},
    "min": 0,
    "nullable": false,
    "required": false,
    "step": 1,
    "type": "integer",
  }
}

export const b = {
  bool: {
    type: 'boolean',
    default: true,
  },
  int: {
    type: 'integer',
    min: 0,
    max: 100,
    default: 20,
    step: 1,
  },
};
