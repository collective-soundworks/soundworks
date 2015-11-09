// import client from './client/index';
// import server from './server/index';

// export default { client, server };

export default function(side) {
  let mod;

  switch (side) {
    case 'server':
      mod = require('./server/index')
      break;
    case 'client':
      mod = require('./client/index');
      break;
  }

  return mod;
}