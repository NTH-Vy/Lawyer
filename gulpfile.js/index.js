const { series, parallel } = require('gulp');
const { clean } = require('./tasks/clean.js');
const { html, lintHtml } = require('./tasks/html.js');
const { css, lintCss } = require('./tasks/css.js');
const { js, lintJs } = require('./tasks/js.js');
const { bs } = require('./tasks/browser_sync.js');
const { watch } = require('./tasks/watch.js');

const build = series(clean, parallel(html, css, js));
const develop = series(build, parallel(bs, watch));
const lint = series(lintHtml, lintCss, lintJs);

module.exports = {
  default: process.env.NODE_ENV === 'production' ? build : develop,
  clean,
  bs,
  lint,
  html,
  css,
  js
};
