import { parentPort } from 'node:worker_threads';

import { getTime } from '@ircam/sc-gettime';

let stack = [];
let averageLatencyWindow = 5;
let averageLatencyPeriod = 2;

let intervalId = null;
let meanLatency = 0;

parentPort.on('message', msg => {
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
