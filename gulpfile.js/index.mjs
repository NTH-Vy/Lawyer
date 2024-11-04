import { series, parallel } from 'gulp';
import { cleanResources } from './tasks/clean.mjs';
import { html, buildHtml, lintHtml, spellCheck, classCheck } from './tasks/html.mjs';
import { css, buildStyles, lintStyles, lintStylesFix, copyFonts, analyze } from './tasks/css.mjs';
import { js, buildJs, lintJs } from './tasks/js.mjs';
import { imageMin, convertToWebp } from './tasks/image.mjs';
import { bs } from './tasks/browser-sync.mjs';
import { myWatch } from './tasks/watch.mjs';

const lint = series(lintHtml, lintStyles, lintJs, spellCheck, classCheck);
const lintFix = series(lintHtml, lintStylesFix, lintJs, spellCheck, classCheck);
const build = series(cleanResources, buildHtml, buildStyles, buildJs, imageMin, copyFonts, lint);
const develop = series(cleanResources, buildHtml, buildStyles, buildJs, imageMin, copyFonts, parallel(bs, myWatch));

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
  spellCheck,
  classCheck,
  buildStyles,
  lintStyles,
  lintStylesFix,
  analyze
};
