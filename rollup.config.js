import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import assets from 'rollup-plugin-copy-assets';
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
    assets({
      assets: [
        './src/fonts',
        'src/index.html',
        'src/frequencies-sets.json'
      ]
    }),
    htmlTemplate({
      template: 'src/index.html',
      target: 'index.html',
    }),
    svelte({
      skipIntroByDefault: true,
      nestedTransitions: true,
      dev: !production,
      emitCss: false
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
