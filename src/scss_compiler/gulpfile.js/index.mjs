import { series } from 'gulp';
import { css, lintStyles, lintStylesFix, copyFonts } from './tasks/css.mjs';
import { myWatch } from './tasks/watch.mjs';

const lint = lintStyles;
const lintFix = lintStylesFix;
const build = series(css, copyFonts, lint);
const develop = series(build, myWatch);

export {
  build,
  develop,
  lint,
  lintFix,
  css
};
