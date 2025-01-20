import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs';
import {
  X509Certificate,
  createPrivateKey,
} from 'node:crypto';

import pem from 'pem';
import equal from 'fast-deep-equal';

import logger from '../common/logger.js';

/**
 * @private
 * @return {HttpServer|HttpsServer}
 */
export async function createHttpServer(server) {
  const serverConfig = server.config;

  if (serverConfig.env.useHttps !== true) {
    return http.createServer();
  }

  // https is more tricky
  const httpsInfos = serverConfig.env.httpsInfos;
  let useSelfSigned = false;

  if (!httpsInfos || equal(httpsInfos, { cert: null, key: null })) {
    useSelfSigned = true;
  }

  let httpsCertsInfos = null;
  let httpsServer = null;

  if (!useSelfSigned) {
    try {
      // existence of file is checked in constructor
      let cert = fs.readFileSync(httpsInfos.cert);
      let key = fs.readFileSync(httpsInfos.key);

      let x509 = null;
      // this fails with self-signed certificates for whatever reason...
      try {
        x509 = new X509Certificate(cert);
      } catch {
        throw new Error(`[soundworks:Server] Invalid https cert file`);
      }

      try {
        const keyObj = createPrivateKey(key);

        if (!x509.checkPrivateKey(keyObj)) {
          throw new Error(`[soundworks:Server] Invalid https key file`);
        }
      } catch {
        throw new Error(`[soundworks:Server] Invalid https key file`);
      }

      // check is certificate is still valid
      const now = Date.now();
      const certExpire = Date.parse(x509.validTo);
      const isValid = now < certExpire;

      const diff = certExpire - now;
      const daysRemaining = Math.round(diff / 1000 / 60 / 60 / 24);

      httpsCertsInfos = {
        selfSigned: false,
        CN: x509.subject.split('=')[1],
        altNames: x509.subjectAltName.split(',').map(e => e.trim().split(':')[1]),
        validFrom: x509.validFrom,
        validTo: x509.validTo,
        isValid: isValid,
        daysRemaining: daysRemaining,
      };

      httpsServer = https.createServer({ key, cert });
    } catch (err) {
      logger.error(`
Invalid certificate files, please check your:
- key file: ${httpsInfos.key}
- cert file: ${httpsInfos.cert}
      `);

      throw err;
    }
  } else {
    // generate self signed certs or reused already existing ones
    let cert = await server.db.get('httpsCert');
    let key = await server.db.get('httpsKey');

    if (!cert || !key) {
      try {
        const result = await new Promise((resolve, reject) => {
          pem.createCertificate({ days: 1, selfSigned: true }, async (err, keys) => {
            if (err) {
              reject(err);
              return;
            }

            resolve({
              cert: keys.certificate,
              key: keys.serviceKey,
            });
          });
        });

        cert = result.cert;
        key = result.key;
        // store the generated certs to reuse on next start
        await server.db.set('httpsCert', cert);
        await server.db.set('httpsKey', key);
      } catch (err) {
        logger.error(err.stack);
        throw err;
      }
    }

    httpsCertsInfos = { selfSigned: true };
    httpsServer = https.createServer({ cert, key });
  }

  logger.httpsCertsInfos(httpsCertsInfos);

  return httpsServer;
}
