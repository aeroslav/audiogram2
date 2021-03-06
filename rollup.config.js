import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import assets from 'rollup-plugin-copy-assets';
import htmlTemplate from 'rollup-plugin-generate-html-template';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';

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
        'src/frequencies-sets.json',
        'src/favicon.ico',
        'src/android-chrome-192x192.png',
        'src/android-chrome-256x256.png',
        'src/favicon-16x16.png',
        'src/favicon-32x32.png',
        'src/mstile-150x150.png',
        'src/safari-pinned-tab.svg',
        'src/site.webmanifest',
        'src/browserconfig.xml',
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
      emitCss: false,
      css: function (css) {
        css.write('public/styles.css', !production);
      }
    }),
    postcss({
      extract: 'public/base.css',
      plugins: [
        autoprefixer
      ]
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
