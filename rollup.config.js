/** @format */

// rollup.config.js

import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json' assert { type: 'json' };
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [
    // Browser build
    {
        input: 'src/index.ts',
        output: {
            file: pkg.main,
            format: 'esm',
            sourcemap: true,
        },
        plugins: [
            typescript({
                tsconfig: 'tsconfig.json',
            }),
            nodeResolve(),
            commonjs({ browser: true }),
        ],
    },
];
