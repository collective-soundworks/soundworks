import fs from 'fs';
import JSON5 from 'json5';
import path from 'path';

function getConfig(ENV) {
  let envConfig = null;
  let appConfig = null;
  // parse env config
  try {
    const envConfigPath = path.join('config', 'env', `${ENV}.json`);
    envConfig = JSON5.parse(fs.readFileSync(envConfigPath, 'utf-8'));

    if (process.env.PORT) {
      envConfig.port = process.env.PORT;
    }
  } catch(err) {
    console.log(`Invalid "${ENV}" env config file`);
    process.exit(0);
  }
  // parse app config
  try {
    const appConfigPath = path.join('config', 'application.json');
    appConfig = JSON5.parse(fs.readFileSync(appConfigPath, 'utf-8'));
  } catch(err) {
    console.log(`Invalid app config file`);
    process.exit(0);
  }

  return { envConfig, appConfig };
}

export default getConfig;
