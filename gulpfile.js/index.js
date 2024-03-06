const { series, parallel } = require('gulp');
const { clean } = require('./tasks/clean.js');
const { html, lintHtml, spellCheck, classCheck } = require('./tasks/html.js');
const { css, copyFonts, buildStyles, lintStyles, lintStylesFix, analyze } = require('./tasks/css.js');
const { js, lintJs } = require('./tasks/js.js');
const { imageMin, convertToWebp } = require('./tasks/image.js');
const { bs } = require('./tasks/browser_sync.js');
const { watch } = require('./tasks/watch.js');

const lint = series(lintHtml, lintStyles, lintJs, spellCheck, classCheck);
const lintFix = series(lintHtml, lintStylesFix, lintJs, spellCheck, classCheck);
const build = series(clean, parallel(html, css, js, imageMin, copyFonts, lint));
const develop = series(build, parallel(bs, watch));

module.exports = {
  default: process.env.NODE_ENV === 'production' ? build : develop,
  clean,
  bs,
  html,
  css,
  js,
  lintHtml,
  lintJs,
  imageMin,
  convertToWebp,
  lint,
  lintFix,
  spellCheck,
  classCheck,
  buildStyles,
  lintStyles,
  lintStylesFix,
  analyze
};
