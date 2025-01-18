import { fork } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { assert } from 'chai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('# server in child process', () => {
  it(`should receive lifecycle events`, () => {
    const pathname = path.join(__dirname, 'server.child-process.child.js')
    const child = fork(pathname, {
      cwd: process.cwd(),
    });

    const expected = [
      `soundworks:server:http-server-ready`,
      `soundworks:server:inited`,
      `soundworks:server:started`,
      `soundworks:server:stopped`,
    ];

    let index = 0;

    return new Promise(resolve => {
      child.on('message', msg => {
        assert.equal(msg, expected[index]);

        index += 1;

        if (index === expected.length) {
          child.kill(0);
          resolve();
        }
      });
    });
  });
});

