import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';

// Generates the `src/common/version.js` file, for checking that client and
// server use the same soundworks version

// testing: git reset --hard 679eea95a12e869b15f843b72c4b8905272de285 && git tag -d v4.0.0

const newVersion = process.argv[2];
const pathname = path.join('src', 'common', 'version.js');
const code = `\
// [WARNING] This file is generated, do not edit
export default '${newVersion}';
`;

fs.writeFileSync(pathname, code);

console.log(chalk.green(`> [UPDATE VERSION] version.js updated to ${newVersion}`))
