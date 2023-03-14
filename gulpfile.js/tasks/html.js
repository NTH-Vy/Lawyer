const gulp = require('gulp');
const { src, dest, series, lastRun } = gulp;
const pug = require('gulp-pug');
const htmlhint = require('gulp-htmlhint');
const config = require('../config').html;
const fs = require('fs');
const through = require('through2');
const spelling = require('spelling');
const dictionary = require('../../fclintdic.js');
const spellChecker = new spelling(dictionary);

const destDir = process.env.NODE_ENV === 'production' ? config.distribute.dir : config.develop.dir;
const pugGlob = config.source.glob.concat(config.source.ignore);

const buildHtml = () => {
  if (!fs.existsSync(config.source.dir)) {
    return Promise.resolve();
  }
  return src(pugGlob.concat(['!' + config.source.dir + '/_*/**']), { since: lastRun(buildHtml) })
    .pipe(
      pug({
        pretty: true
      })
    )
    .pipe(dest(destDir));
};

const lintHtml = () => {
  return src([config.develop.dir + '/**/*.html'])
    .pipe(htmlhint('.htmlhintrc'))
    .pipe(htmlhint.failReporter());
};

const spellcheck = () => {
  return src('dev/**/*.html')
    .pipe(through.obj((file, enc, cb) => {
      const content = file.contents.toString();
      const matches = content.match(/class="([^"]*)"/g);
      const classNames = matches
        .map(match => match.slice(7, -1).split(' '))
        .reduce((acc, val) => acc.concat(val), []);
      const uniqueWords = Array.from(new Set(classNames));
      const misspelled = uniqueWords.filter((word) => {
        const itemResult = spellChecker.lookup(word);
        return !itemResult.found;
      });
      console.log(`Spell check for ${file.path}`);
      if (misspelled.length) {
        console.log('NG: ' + misspelled.join(', '));
      } else {
        console.log('OK');
      }
      cb(null, file);
    }));
};

const html = series(buildHtml, lintHtml);

module.exports = {
  buildHtml,
  lintHtml,
  html,
  spellcheck
};

