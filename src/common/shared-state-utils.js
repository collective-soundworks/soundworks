// id of the server when owner of a state
export const SERVER_ID = -1;

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
export const DETACH_ERROR = 's:dt:err'; // usefull

export const OBSERVE_REQUEST = 's:o:req';
export const OBSERVE_RESPONSE = 's:o:res';
export const OBSERVE_NOTIFICATION = 's:o:not';

export const UPDATE_REQUEST = 's:u:req';
export const UPDATE_RESPONSE = 's:u:res';
export const UPDATE_ABORT = 's:u:ab';
export const UPDATE_NOTIFICATION = 's:u:not';

export function* idGenerator() {
  for (let i = 0; true; i++) {
    yield i;
  }
}

const generateRequestId = idGenerator();
const requestPromises = new Map();

export function storeRequestPromise(resolve, reject) {
  const reqId = generateRequestId.next().value;
  requestPromises.set(reqId, { resolve, reject });

  return reqId;
}

export function resolveRequest(reqId, data) {
  const { resolve } = requestPromises.get(reqId);
  requestPromises.delete(reqId);

  resolve(data);
}

export function rejectRequest(reqId, data) {
  const { resolve, reject } = requestPromises.get(reqId);
  requestPromises.delete(reqId);

  reject(data);
}
