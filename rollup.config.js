// adapted from https://github.com/rollup/rollup-starter-lib
import pkg from './package.json';
import babel from 'rollup-plugin-babel';
import nodeBuiltins from 'rollup-plugin-node-builtins';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'builtin-modules';

const inputFile = 'src/index.js';

export default [
  // CommonJS (for Node and browserify) and ES module (for bundlers) builds.

  // browser clients
  {
    input: 'src/client/index.js',
    external: Object.keys(pkg.dependencies),
    plugins: [
      // sourcemaps(),
      nodeBuiltins(),
      resolve(),
      commonjs(),
      babel({
        exclude: 'node_modules/**'
      })
    ],
    output: [
      { file: 'client/index.js', format: 'es', sourcemap: 'inline' },
    ]
  },

  {
    input: 'src/thing/index.js',
    external: Object.keys(pkg.dependencies),
    plugins: [
      // sourcemaps(),
      // resolve({
      //   preferBuiltins: true,
      // }),
      // commonjs(),
      babel({
        exclude: 'node_modules/**'
      })
    ],
    output: [
      { file: 'thing/index.js', format: 'cjs', sourcemap: 'inline' },
    ]
  },

  {
    input: 'src/server/index.js',
    external: Object.keys(pkg.dependencies).concat(builtins),
    plugins: [
      // sourcemaps(),
      // resolve({
      //   preferBuiltins: true,
      // }),
      // commonjs(),
      babel({
        exclude: 'node_modules/**'
      })
    ],
    output: [
      { file: 'server/index.js', format: 'cjs', sourcemap: 'inline' },
    ]
  }
];
