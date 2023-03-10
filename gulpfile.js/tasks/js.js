const { src, dest, series } = require('gulp');
const eslint = require('gulp-eslint');
const plumber = require('gulp-plumber');
const config = require('../config').js;

const destDir = process.env.NODE_ENV === 'production' ? config.distribute.dir : config.develop.dir;
const jsGlob = config.source.glob.concat(config.source.ignore);

const buildJs = () => {
  return src(jsGlob)
    .pipe(plumber({
      errorHandler: (err) => {
        console.log(err.message);
      }
    }))
    .pipe(dest(destDir + '/js'));
};

const lintJs = () => {
  return src([config.develop.dir + '/js/**/*.js'])
    .pipe(plumber({
      errorHandler: (err) => {
        console.log(err.message);
      }
    }))
    .pipe(eslint({
      fix: true
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(dest(destDir + '/js'));
};

const js = series(buildJs, lintJs);

module.exports = {
  buildJs,
  lintJs,
  js
};

