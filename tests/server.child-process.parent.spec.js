import { fork } from 'child_process';
import path from 'path';
import { assert } from 'chai';

// inited
// started
// stopped
// [errored] - @todo

describe('# server in child process', () => {
  it(`should receive lifecycle events`, () => {
    const pathname = path.join(process.cwd(), 'tests', 'server.child-process.child.js')
    const child = fork(pathname, {
      cwd: process.cwd(),
    });

    const expected = [
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

