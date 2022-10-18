const { fork, exec } = require('node:child_process');
const path = require('node:path');
const assert = require('chai').assert;
const puppeteer = require('puppeteer');

// path of the soundworks app
const appPath = path.join(process.cwd(), 'tests', 'browser-integration');

describe('Browser client integration (install, build, start)', () => {
  it(`should install deps`, async function() {
    this.timeout(60 * 1000);

    // delete node modules first
    await new Promise(resolve => {
      exec(`rm -Rf node_modules`, { cwd: appPath }, (err, stdout, stderr) => {
        if (err) {
          console.log(err);
          assert.fail('"rm -Rf node-modules" error');
          return;
        }

        if (stderr.toString() !== '') {
          console.error(stderr);
          assert.fail('"rm -Rf node-modules" error');
        } else {
          assert.ok('"rm -Rf node-modules" success');
        }
        resolve();
      });
    });

    // delete node modules first
    await new Promise(resolve => {
      exec(`npm install`, { cwd: appPath }, (err, stdout, stderr) => {
        if (err) {
          console.log(err);
          assert.fail('"npm install" error');
          return;
        }

        if (stderr.toString() !== '') {
          console.error(stderr);
          assert.fail('"npm install" error');
        } else {
          assert.ok('"npm install" success');
        }

        resolve();
      });
    });
  });

  it('should build template derived application', async function() {
    this.timeout(60 * 1000);

    // delete node modules first
    await new Promise(resolve => {
      exec(`npm run build`, { cwd: appPath }, (err, stdout, stderr) => {
        if (err) {
          console.log(err);
          assert.fail('"npm run build" error');
          return;
        }

        if (stderr.toString() !== '') {
          console.error(stderr);
          assert.fail('"npm run build" error');
        } else {
          // console.log(stdout);
          assert.ok('"npm run build" success');
        }

        resolve();
      });
    });
  });

  it('should properly launch and start browser client', async function() {
    this.timeout(10 * 1000);

    // delete node modules first
    await new Promise(async (resolve, reject) => {
      const serverIndex = path.join(appPath, '.build', 'server', 'index.js');
      const forked = fork(serverIndex, { cwd: appPath });
      let browser;
      let page;

      forked.on('message', async msg => {
        if (msg === 'soundworks:started') {
          browser = await puppeteer.launch();
          page = await browser.newPage();
          await page.goto('http://127.0.0.1:8000');
        } else {
          try {
            const event = JSON.parse(msg);
            assert.deepEqual(event, { done: true });
          } catch(err) {
            assert.fail('received wrong message from client');
          }

          await browser.close();
          forked.kill();
          resolve();
        }
      });
    });
  });
});

