import crypto from 'node:crypto';
import { v4 as uuidv4 } from 'uuid';

// adapted from https://dev.to/jobizil/encrypt-and-decrypt-data-in-nodejs-using-aes-256-cbc-2l6d
// generate a new key and init vector each time the server restart, we don't need
// any persistency here
const secretKey = uuidv4();
const secretIv = uuidv4();
const encryptionMethod = 'aes-256-cbc';

const key = crypto
  .createHash('sha512')
  .update(secretKey)
  .digest('hex')
  .substring(0, 32);

const encryptionIV = crypto
  .createHash('sha512')
  .update(secretIv)
  .digest('hex')
  .substring(0, 16);


export function encryptData(obj) {
  const data = JSON.stringify(obj);
  const cipher = crypto.createCipheriv(encryptionMethod, key, encryptionIV)
  return Buffer.from(
    cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
  ).toString('base64')
}

export function decryptData(encryptedData) {
  const buff = Buffer.from(encryptedData, 'base64')
  const decipher = crypto.createDecipheriv(encryptionMethod, key, encryptionIV)

  const decrypted = `${decipher.update(buff.toString('utf8'), 'hex', 'utf8')}${decipher.final('utf8')}`
  return JSON.parse(decrypted);
}
