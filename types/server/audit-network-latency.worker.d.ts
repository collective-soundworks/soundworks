declare const _default: "\nconst { parentPort } = require('node:worker_threads');\nconst { hrtime } =  require('node:process');\n\nlet stack = [];\nlet averageLatencyWindow = 5;\nlet averageLatencyPeriod = 2;\n\nlet intervalId = null;\nlet meanLatency = 0;\n\n// workaround that sc-utils is pure emascript module\n// 2024/09/06 - Just copy getTime implementation so that we don't even need the node_modules\nconst start = hrtime.bigint();\n\nfunction getTime() {\n  const now = hrtime.bigint();\n  const delta = now - start;\n  return Number(delta) * 1e-9;\n}\n\nparentPort.on('message', async msg => {\n  switch (msg.type) {\n    case 'config': {\n      averageLatencyWindow = msg.value.averageLatencyWindow;\n      averageLatencyPeriod = msg.value.averageLatencyPeriod;\n\n      // launch compute in its own loop so that the number of computation is\n      // decoupled from the number of connected clients\n      clearInterval(intervalId);\n      intervalId = setInterval(computeAverageLatency, averageLatencyPeriod * 1000);\n      break;\n    }\n    case 'add-measurement': {\n      // compute latency considering ping and pong time are equal\n      const entry = msg.value;\n      entry.latency = (entry.pong - entry.ping) / 2;\n      // add new measure to the stack\n      stack.push(entry);\n    }\n  }\n});\n\nfunction computeAverageLatency() {\n  const now = getTime();\n  // remove old measurements from stack\n  stack = stack.filter(entry => entry.pong >= now - averageLatencyWindow);\n\n  // prevent dividing by zero, just return last computed value\n  if (stack.length === 0) {\n    parentPort.postMessage({\n      type: 'computed-average-latency',\n      value: meanLatency,\n    });\n  } else {\n    // compute mean\n    let sum = 0;\n    stack.forEach(entry => sum += entry.latency);\n\n    meanLatency = sum / stack.length;\n    // send result to main thread\n    parentPort.postMessage({\n      type: 'computed-average-latency',\n      value: meanLatency,\n    });\n  }\n}\n";
export default _default;
