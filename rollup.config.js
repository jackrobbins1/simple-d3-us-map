import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve'
import scss from 'rollup-plugin-scss'
import globals from 'rollup-plugin-node-globals';

export default {
    input: 'src/index.js',
    output: {
      file: 'dist/bundle.js',
      format: 'iife'
    },
    plugins: [
        json(),
        resolve({
            customResolveOptions: {
              moduleDirectory: 'node_modules'
            }
        }),
        scss({
            output: true
        }),
        globals()
    ]
};