import { src, dest, series } from 'gulp';
import eslint, { fix as _fix, format, failAfterError } from 'gulp-eslint-new';
import prettier from 'gulp-prettier';
import uglify from 'gulp-uglify';
import { js as config } from '../config/index.mjs';
import { existsSync } from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
const argv = yargs(hideBin(process.argv)).argv;

const destDir = config.distribute.dir;
const jsGlob = config.source.glob.concat(config.source.ignore);

const buildJs = () => {
  if (!existsSync(config.source.dir + '/js')) {
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
  let filesToCheck = [destDir + '/js/**/*.js'];
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
    .pipe(eslint({ fix: true }))
    .pipe(_fix())
    .pipe(format());

  if (stopOnError) {
    stream.pipe(failAfterError());
  }
  return stream.pipe(dest(destDir + '/js'));
};

const js = series(buildJs, lintJs);

export  {
  buildJs,
  lintJs,
  js
};

