import { nodeResolve } from '@rollup/plugin-node-resolve';
import ts from 'rollup-plugin-typescript2';
import typescript from 'typescript';
import styles from '@ironkinoko/rollup-plugin-styles';
import commonjs from '@rollup/plugin-commonjs';

export default [
  {
    input: ['src/main.ts'],
    output: {
      format: 'es',
      sourcemap: true,
      exports: 'named',
      dir: 'dist',
      assetFileNames: '[name][extname]'
    },
    plugins: [
      styles({
        mode: ['extract', './css/vanilla-js-spa.css'],
        url: false,
        minimize: true
      }),
      nodeResolve(),
      commonjs(),
      ts({
        useTsconfigDeclarationDir: true,
        sourceMap: false,
        typescript
      })
    ]
  }
];
