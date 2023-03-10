const { registry, series, parallel } = require('gulp');
const { clean } = require('./tasks/clean.js');
const { html } = require('./tasks/html.js');
const { bs } = require('./tasks/browser_sync.js');
const { watch } = require('./tasks/watch.js');

// // const develop = series(clean, parallel(bs, watch));
// // const build = series(copy, cssInline, html, parallel(css, images, javascript));
// const build = series(clean);

// if (process.env.NODE_ENV === 'production') {
//   exports.build = clean;
// } else {
//   exports.build = clean;
// }

const develop = series(clean, parallel(bs, watch));
const build = clean;

module.exports = {
  default: process.env.NODE_ENV === 'production' ? build : develop,
  bs,
  html,
  clean,
  // parallel(
  //   cssTranspile,
  //   series(jsTranspile, jsBundle)
  // ),
  // parallel(cssMinify, jsMinify),
  // publish,
}
