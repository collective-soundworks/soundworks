import {
  X509Certificate,
  createPrivateKey,
} from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import os from 'node:os';
import {
  styleText,
} from 'node:util';

import selfsigned from 'selfsigned';

async function createHttpsServer(server) {
  // https is more tricky
  const httpsInfos = server.config.env.httpsInfos;
  let useSelfSigned = false;

  if (!httpsInfos
    || !fs.existsSync(httpsInfos.cert)
    || !fs.existsSync(httpsInfos.key)
  ) {
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
        throw new TypeError(`Cannot create https.Server: Invalid https cert file`);
      }

      try {
        const keyObj = createPrivateKey(key);

        if (!x509.checkPrivateKey(keyObj)) {
          throw new TypeError(`Cannot create https.Server: Invalid https key file`);
        }
      } catch {
        throw new TypeError(`Cannot create https.Server: Invalid https key file`);
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
      console.error(`
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
        const result = await selfsigned.generate(null);

        cert = result.cert;
        key = result.private;

        // store the generated certs to reuse on next start
        await server.db.set('httpsCert', cert); // -----BEGIN CERTIFICATE-----
        await server.db.set('httpsKey', key); // -----BEGIN RSA PRIVATE KEY-----
      } catch (err) {
        console.error(err.stack);
        throw err;
      }
    }

    httpsCertsInfos = { selfSigned: true };
    httpsServer = https.createServer({ cert, key });
  }

  // Log certificate information, just be verbose
  console.log(styleText('cyan', `https certificates infos`));

  if (httpsCertsInfos.selfSigned) {
    console.warn(styleText('yellow', `    -------------------------------------------`));
    console.warn(styleText('yellow', `    > USING SELF-SIGNED CERTIFICATE.           `));
    console.warn(styleText('yellow', `    users will face a unsafe web page warning  `));
    console.warn(styleText('yellow', `    -------------------------------------------`));
  } else {
    console.log(`    valid from: ${httpsCertsInfos.validFrom}`);
    console.log(`    valid to:   ${httpsCertsInfos.validTo}`);

    if (!httpsCertsInfos.isValid) {
      console.error(styleText('red', `    -------------------------------------------`));
      console.error(styleText('red', `    > INVALID CERTIFICATE                      `));
      console.error(styleText('red', `    i.e. you pretend to be safe but you are not`));
      console.error(styleText('red', `    -------------------------------------------`));
    } else {
      if (httpsCertsInfos.daysRemaining < 5) {
        console.log(styleText('red', `    > CERTIFICATE IS VALID... BUT ONLY ${httpsCertsInfos.daysRemaining} DAYS LEFT, PLEASE CONSIDER UPDATING YOUR CERTS!`));
      } else if (httpsCertsInfos.daysRemaining < 15) {
        console.log(styleText('yellow', `    > CERTIFICATE IS VALID - only ${httpsCertsInfos.daysRemaining} days left, be careful...`));
      } else {
        console.log(styleText('green', `    > CERTIFICATE IS VALID (${httpsCertsInfos.daysRemaining} days left)`));
      }
    }
  }

  return httpsServer;
}

/**
 * @private
 * @return {HttpServer|HttpsServer}
 */
export async function createHttpServer(server) {
  const serverConfig = server.config;

  const httpServer = serverConfig.env.useHttps !== true
    ? http.createServer()
    : await createHttpsServer(server);

  return httpServer;
}

export function logServerInfos(envConfig) {
  const protocol = envConfig.useHttps ? 'https' : 'http';
  const port = envConfig.port;
  const interfaces = os.networkInterfaces();

  console.log(styleText('cyan', `${protocol} server listening on`));

  Object.keys(interfaces).forEach(dev => {
    interfaces[dev].forEach(details => {
      if (details.family === 'IPv4') {
        console.log(`    ${protocol}://${details.address}:${styleText('green', `${port}`)}`);
      }
    });
  });

  console.log(`\n> press "${styleText('bold', 'Ctrl + C')}" to exit`);
}
