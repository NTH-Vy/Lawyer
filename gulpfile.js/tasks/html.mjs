import gulp from 'gulp';
const { src, dest, series, lastRun } = gulp;
import pug from 'gulp-pug';
import pugLinter from 'gulp-pug-linter';
import htmlnano from 'gulp-htmlnano';
import { html as config } from '../config/index.mjs';
import { existsSync } from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
const argv = yargs(hideBin(process.argv)).argv;

const destDir = config.distribute.dir;
const pugGlob = config.source.glob.concat(config.source.ignore);

const buildHtml = () => {
  if (!existsSync(config.source.dir)) {
    return Promise.resolve();
  }

  const stream = src(pugGlob.concat(['!' + config.source.dir + '/_*/**']), { since: lastRun(buildHtml) })
    .pipe(
      pug({
        pretty: true
      })
    );

  if (config.options.minify === true) {
    stream.pipe(htmlnano({
      removeComments: false
    }));
  }

  return stream.pipe(dest(destDir));
};

const lintHtml = () => {
  const stopOnError = argv.stopOnError || false;
  let filesToCheck = [config.source.dir + '/**/*.pug'];
  if (argv.file) {
    const targetFiles = argv.file.replace(/"/g, '').replace(/, /g, ',');
    filesToCheck = targetFiles.split(',');
  }
  return src(filesToCheck)
    .pipe(pugLinter({
      reporter: 'default',
      failAfterError: stopOnError
    }));
};

const html = series(buildHtml, lintHtml);

export {
  buildHtml,
  lintHtml,
  html
};

