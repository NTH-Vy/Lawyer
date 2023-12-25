const { series, parallel } = require('gulp');
const { clean } = require('./tasks/clean.js');
const { html, lintHtml, spellCheck } = require('./tasks/html.js');
const { css, buildStyles, lintStyles, lintStylesFix } = require('./tasks/css.js');
const { js, lintJs } = require('./tasks/js.js');
const { image, imagemin } = require('./tasks/image.js');
const { bs } = require('./tasks/browser_sync.js');
const { watch } = require('./tasks/watch.js');

const build = series(clean, parallel(html, css, js, image));
const develop = series(build, parallel(bs, watch));
const lint = series(lintHtml, lintStyles, lintJs, spellCheck);
const lintFix = series(lintHtml, lintStylesFix, lintJs, spellCheck);

module.exports = {
  default: process.env.NODE_ENV === 'production' ? build : develop,
  clean,
  bs,
  html,
  css,
  js,
  lintJs,
  image,
  imagemin,
  lint,
  lintFix,
  spellCheck,
  buildStyles,
  lintStyles
};
