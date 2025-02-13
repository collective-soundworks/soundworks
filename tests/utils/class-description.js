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


export const aClassDescription = {
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
  required: {
    type: 'boolean',
    required: true,
  },
};

// class descriptions that are not linked to a real state do not contain init values
export const expectedFullClassDescription = {
  "bool": {
    "default": false,
    "event": false,
    "filterChange": true,
    "immediate": false,
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
    "max": 100,
    "metas": {},
    "min": 0,
    "nullable": false,
    "required": false,
    "step": 1,
    "type": "integer",
  },
  "required": {
    "default": null,
    "event": false,
    "filterChange": true,
    "immediate": false,
    "metas": {},
    "nullable": false,
    "required": true,
    "type": "boolean",
  },
};

// for real instances we have the init values in the description
export const expectedInstanceFullClassDescription = {
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
  },
  "required": {
    "default": true,
    "event": false,
    "filterChange": true,
    "immediate": false,
    "initValue": true,
    "metas": {},
    "nullable": false,
    "required": true,
    "type": "boolean",
  },
};
