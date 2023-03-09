import { idGenerator } from '@ircam/sc-utils';

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
  const { reject } = requestPromises.get(reqId);
  requestPromises.delete(reqId);

  reject(data);
}
