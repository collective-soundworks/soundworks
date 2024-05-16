import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';

// Generates the `src/common/version.js` file, for checking that client and
// server use the same soundworks version

// testing: git reset --hard 67b505d8a0e7dbed5435c296e8db9d07d3a71fed && git tag -d v4.0.0-alpha.22

const newVersion = process.argv[2];
const pathname = path.join('src', 'common', 'version.js');
const code = `\
// [WARNING] This file is generated, do not edit
export default '${newVersion}';
`;

fs.writeFileSync(pathname, code);

console.log(chalk.green(`> [UPDATE VERSION] version.js updated to ${newVersion}`))
