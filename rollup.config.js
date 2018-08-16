import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import copy from "rollup-copy-plugin";
import htmlTemplate from 'rollup-plugin-generate-html-template';
import scss from 'rollup-plugin-scss';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/index.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/bundle.js'
  },
  plugins: [
    copy({
      'src/index.html': 'public/index.html',
      'src/frequencies-sets.json': 'public/frequencies-sets.json'
    }),
    htmlTemplate({
      template: 'src/index.html',
      target: 'index.html',
    }),
    svelte({
      // opt in to v3 behaviour today
      skipIntroByDefault: true,
      nestedTransitions: true,

      // enable run-time checks when not in production
      dev: !production,
      emitCss: true
    }),

    scss({
      output: 'public/bundle.css'
    }),
    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration —
    // consult the documentation for details:
    // https://github.com/rollup/rollup-plugin-commonjs
    resolve(),
    commonjs(),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser()
  ]
};
