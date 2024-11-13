import { series, parallel } from 'gulp';
import { cleanResources } from './tasks/clean.mjs';
import { html, buildHtml, lintHtml } from './tasks/html.mjs';
import { css, buildStyles, lintStyles, lintStylesFix, copyFonts, analyze } from './tasks/css.mjs';
import { js, buildJs, lintJs, lintJsFix } from './tasks/js.mjs';
import { imageMin, convertToWebp } from './tasks/image.mjs';
import { bs } from './tasks/browser-sync.mjs';
import { myWatch } from './tasks/watch.mjs';

const lint = series(lintHtml, lintStyles, lintJs);
const lintFix = series(lintStylesFix, lintJsFix);
const build = series(cleanResources, buildHtml, buildStyles, buildJs, imageMin, copyFonts);
const develop = series(buildHtml, buildStyles, buildJs, lint, parallel(bs, myWatch));

export {
  build,
  develop,
  cleanResources,
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
  buildStyles,
  lintStyles,
  lintStylesFix,
  analyze
};
