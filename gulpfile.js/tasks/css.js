const { src, dest, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const config = require('../config').css;
const fs = require('fs');

const destDir = config.distribute.dir;
const cssGlob = config.source.glob.concat(config.source.ignore);

const buildCss = () => {
  if (!fs.existsSync(config.source.dir + '/scss')) {
    return Promise.resolve();
  }
  return src(cssGlob)
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.identityMap())
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(postcss([
      require('stylelint')({
        configFile: '.stylelintrc.json',
        formatter: 'string',
        ignoreDisables: false,
        failOnError: true,
        outputFile: '',
        reportNeedlessDisables: false,
        fix: true,
        syntax: '',
        reporters: [
          { formatter: 'string', console: true }
        ]
      }),
      require('autoprefixer')({
        map: false,
        cascade: false
      })
    ]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(destDir + '/css'));
};

const lintCss = () => {
  return src(config.source.glob)
    .pipe(postcss([
      require('stylelint')({
        configFile: '.stylelintrc.json',
        formatter: 'string',
        ignoreDisables: false,
        failOnError: true,
        outputFile: '',
        reportNeedlessDisables: false,
        fix: false,
        syntax: '',
        reporters: [
          { formatter: 'string', console: true }
        ]
      }),
      (root, result) => {
        root.walkDecls((decl) => {
          if (decl.value.includes("'")) {
            result.warn(`Use double quotes in SCSS files. Property: ${decl.prop}`, {
              node: decl,
            });
          }
        });
      }
    ]))
    .pipe(dest(config.source.dir + '/scss'));
};

const css = series(buildCss);

module.exports = {
  lintCss,
  buildCss,
  css
};

