// id of the server when owner of a state
export const SERVER_ID = -1;

// shared states channels
export const CREATE_REQUEST = 's:c:req';
export const CREATE_RESPONSE = 's:c:res';
export const CREATE_ERROR = 's:c:err';

export const DELETE_REQUEST = 's:dl:req';
export const DELETE_RESPONSE = 's:dl:res';
export const DELETE_ERROR = 's:dl:err';
export const DELETE_NOTIFICATION = 's:dl:not';

export const ATTACH_REQUEST = 's:a:req';
export const ATTACH_RESPONSE = 's:a:res';
export const ATTACH_ERROR = 's:a:err';

export const DETACH_REQUEST = 's:dt:req';
export const DETACH_RESPONSE = 's:dt:res';
export const DETACH_ERROR = 's:dt:err';

export const OBSERVE_REQUEST = 's:o:req';
export const OBSERVE_RESPONSE = 's:o:res';
export const OBSERVE_NOTIFICATION = 's:o:not';

export const UNOBSERVE_NOTIFICATION = 's:uo:not';

export const UPDATE_REQUEST = 's:u:req';
export const UPDATE_RESPONSE = 's:u:res';
export const UPDATE_ABORT = 's:u:ab';
export const UPDATE_NOTIFICATION = 's:u:not';

export const DELETE_SCHEMA = 's:d:s';

// context channels
export const CONTEXT_ENTER_REQUEST = 'c:en:req';
export const CONTEXT_ENTER_RESPONSE = 'c:en:res';
export const CONTEXT_ENTER_ERROR = 'c:en:err';

export const CONTEXT_EXIT_REQUEST = 'c:ex:req';
export const CONTEXT_EXIT_RESPONSE = 'c:ex:res';
export const CONTEXT_EXIT_ERROR = 'c:ex:err';

// client handshake
export const CLIENT_HANDSHAKE_REQUEST = 'cl:h:req';
export const CLIENT_HANDSHAKE_RESPONSE = 'cl:h:res';
export const CLIENT_HANDSHAKE_ERROR = 'cl:h:err';

// audit state schema name
export const AUDIT_STATE_NAME = 's:c:audit';
export const PRIVATE_STATES = [AUDIT_STATE_NAME];
