import gulp, { src, dest, series } from 'gulp';
import eslint, { fix as _fix, format, failAfterError } from 'gulp-eslint-new';
import prettier from 'gulp-prettier';
import uglify from 'gulp-uglify';
import { base as config } from '../config/index.mjs';
import { existsSync } from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import ts from 'gulp-typescript';
const argv = yargs(hideBin(process.argv)).argv;
let isFixing = false;

const lintJs = () => {
  const stopOnError = argv.stopOnError || false;
  let filesToCheck = [config.js.path.outputFiles];
  if (config.useTypescript) {
    filesToCheck = [config.ts.path.inputFiles];
  }
  if (argv.file) {
    const targetFiles = argv.file.replace(/"/g, '').replace(/, /g, ',');
    filesToCheck = targetFiles.split(',');
  }
  const stream = src(filesToCheck)
    .pipe(eslint({ fix: false, ...(config.useTypescript ? { overrideConfigFile: '.eslintrc-ts.json'} : {}) }))
    .pipe(format());
  if (stopOnError) {
    stream.pipe(failAfterError());
  }
  return stream.pipe(dest(config.js.path.output));
};

const lintJsFix = () => {
  const stopOnError = argv.stopOnError || false;
  let filesToCheck = [config.js.path.outputFiles];
  if (config.useTypescript) {
    if (isFixing) {
      isFixing = false;
      return;
    }
    isFixing = true;
    filesToCheck = [config.ts.path.inputFiles];
  }
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
    .pipe(eslint({ fix: true, ...(config.useTypescript ? { overrideConfigFile: '.eslintrc-ts.json'} : {}) }))
    .pipe(_fix())
    .pipe(format());
  if (stopOnError) {
    stream.pipe(failAfterError());
  }
  return stream.pipe(dest(config.js.path.output));
};

const buildTs = () => {
  if (!existsSync(config.ts.path.input)) {
    return Promise.resolve();
  }
  const tsProject = ts.createProject('tsconfig.json');
  const stream = tsProject.src().pipe(tsProject()).js;
  if (config.ts.options.minify) {
    stream.pipe(uglify());
  }
  return stream.pipe(dest(config.js.path.output));
};

const buildJs = () => {
  if (config.useTypescript) {
    return buildTs();
  }
  if (!existsSync(config.js.path.input)) {
    return Promise.resolve();
  }
  const stream = src([config.js.path.inputFiles].concat(config.ignore).concat(config.js.ignore));
  if (config.js.options.minify) {
    stream.pipe(uglify());
  }
  return stream.pipe(dest(config.js.path.output));
};

const js = series(buildJs, lintJs, lintJsFix);

export {
  buildJs,
  buildTs,
  lintJs,
  lintJsFix,
  js
};

