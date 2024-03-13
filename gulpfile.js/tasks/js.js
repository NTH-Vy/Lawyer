const { src, dest, series } = require('gulp');
const eslint = require('gulp-eslint-new');
const prettier = require('gulp-prettier');
const uglify = require('gulp-uglify');
const config = require('../config').js;
const fs = require('fs');
const argv = require('yargs').argv;

const destDir = config.distribute.dir;
const jsGlob = config.source.glob.concat(config.source.ignore);

const buildJs = () => {
  if (!fs.existsSync(config.source.dir + '/js')) {
    return Promise.resolve();
  }

  const stream = src(jsGlob);

  if (config.options.minify === true) {
    stream.pipe(uglify());
  }

  return stream.pipe(dest(destDir + '/js'));
};

const lintJs = () => {
  const stopOnError = argv.stopOnError || false;
  let filesToCheck = jsGlob;
  if (argv.file) {
    const targetFiles = argv.file.replace(/"/g, '').replace(/, /g, ',');
    filesToCheck = targetFiles.split(',');
  }
  const stream = src(filesToCheck)
    .pipe(prettier({
      singleQuote: true,
      proseWrap: 'never',
      endOfLine: 'lf',
      printWidth: 80,
      trailingComma: 'none'
    }))
    .pipe(eslint())
    .pipe(eslint.format());

  if (stopOnError) {
    stream.pipe(eslint.failAfterError());
  }
  return stream;
};

const js = series(lintJs, buildJs);

module.exports = {
  buildJs,
  lintJs,
  js
};

