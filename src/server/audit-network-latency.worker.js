// @note - We use this common js syntax so that the server can be bundled to cjs
// which allows to build a server that can be accepted by Max `node.script`
//
// Should move back to regular esm module once Max has fixed its loader
export default `
const { parentPort } = require('node:worker_threads');
const { hrtime } =  require('node:process');

let stack = [];
let averageLatencyWindow = 5;
let averageLatencyPeriod = 2;

let intervalId = null;
let meanLatency = 0;

// workaround that sc-utils is pure ecmascript module
// 2024/09/06 - Just copy getTime implementation so that we don't even need the node_modules
const start = hrtime.bigint();

function getTime() {
  const now = hrtime.bigint();
  const delta = now - start;
  return Number(delta) * 1e-9;
}

parentPort.on('message', async msg => {
  switch (msg.type) {
    case 'config': {
      averageLatencyWindow = msg.value.averageLatencyWindow;
      averageLatencyPeriod = msg.value.averageLatencyPeriod;

      // launch compute in its own loop so that the number of computation is
      // decoupled from the number of connected clients
      clearInterval(intervalId);
      intervalId = setInterval(computeAverageLatency, averageLatencyPeriod * 1000);
      break;
    }
    case 'add-measurement': {
      // compute latency considering ping and pong time are equal
      const entry = msg.value;
      entry.latency = (entry.pong - entry.ping) / 2;
      // add new measure to the stack
      stack.push(entry);
    }
  }
});

function computeAverageLatency() {
  const now = getTime();
  // remove old measurements from stack
  stack = stack.filter(entry => entry.pong >= now - averageLatencyWindow);

  // prevent dividing by zero, just return last computed value
  if (stack.length === 0) {
    parentPort.postMessage({
      type: 'computed-average-latency',
      value: meanLatency,
    });
  } else {
    // compute mean
    let sum = 0;
    stack.forEach(entry => sum += entry.latency);

    meanLatency = sum / stack.length;
    // send result to main thread
    parentPort.postMessage({
      type: 'computed-average-latency',
      value: meanLatency,
    });
  }
}
`;
