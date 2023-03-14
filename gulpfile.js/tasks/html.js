const { src, dest, series, lastRun } = require('gulp');
const pug = require('gulp-pug');
const htmlhint = require('gulp-htmlhint');
const plumber = require('gulp-plumber');
const config = require('../config').html;
const fs = require('fs');

const destDir = process.env.NODE_ENV === 'production' ? config.distribute.dir : config.develop.dir;
const pugGlob = config.source.glob.concat(config.source.ignore);

const buildHtml = () => {
  if (!fs.existsSync(config.source.dir + '/pug')) {
    return Promise.resolve();
  }
  return src(pugGlob.concat(['!' + config.source.dir + '/pug/_*/**']), { since: lastRun(buildHtml) })
    .pipe(plumber({
      errorHandler: (err) => {
        console.log(err.message);
      }
    }))
    .pipe(
      pug({
        pretty: true
      })
    )
    .pipe(dest(destDir));
};

const lintHtml = () => {
  return src([config.develop.dir + '/**/*.html'], { since: lastRun(lintHtml) })
    .pipe(plumber({
      errorHandler: (err) => {
        console.log(err.message);
      }
    }))
    .pipe(htmlhint('.htmlhintrc'))
    .pipe(htmlhint.failReporter());
};

const html = series(buildHtml, lintHtml);

module.exports = {
  buildHtml,
  lintHtml,
  html
};

