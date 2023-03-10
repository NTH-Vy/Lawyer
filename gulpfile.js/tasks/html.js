const { src, dest, series } = require('gulp');
const pug = require('gulp-pug');
const htmlhint = require('gulp-htmlhint');
const plumber = require('gulp-plumber');
const config = require('../config').html;

const destDir = process.env.NODE_ENV === 'production' ? config.distribute.dir : config.develop.dir;
const pugGlob = config.source.glob.concat(config.source.ignore);

const buildHtml = () => {
  return src(pugGlob.concat(['!' + config.source.dir + '/pug/_*/**']))
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
  return src([config.develop.dir + '/**/*.html'])
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

