const { src, dest, series } = require('gulp');
const eslint = require('gulp-eslint');
const config = require('../config').js;
const fs = require('fs');

const destDir = process.env.NODE_ENV === 'production' ? config.distribute.dir : config.develop.dir;
const jsGlob = config.source.glob.concat(config.source.ignore);

const buildJs = () => {
  if (!fs.existsSync(config.source.dir + '/js')) {
    return Promise.resolve();
  }
  return src(jsGlob)
    .pipe(dest(destDir + '/js'));
};

const lintJs = () => {
  return src([config.develop.dir + '/js/**/*.js'])
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

