const { src, dest, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const gulpStylelint = require('gulp-stylelint');
const plumber = require('gulp-plumber');
const config = require('../config').css;

const destDir = process.env.NODE_ENV === 'production' ? config.distribute.dir : config.develop.dir;
const cssGlob = config.source.glob.concat(config.source.ignore);
const postCss = process.env.NODE_ENV !== 'development' ?
  [
    autoprefixer(config.distribute.options.autoprefixer)
    // stylelint()
  ] :
  [
    autoprefixer(config.develop.options.autoprefixer)
    // stylelint()
  ];

const buildCss = () => {
  return src(cssGlob)
    .pipe(plumber({
      errorHandler: (err) => {
        console.log(err.message);
      }
    }))
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(postcss(postCss))
    .pipe(dest(destDir + '/css'));
};


const lintCss = () => {
  return src([config.develop.dir + '/css/**/*.css'])
    .pipe(plumber({
      errorHandler: (err) => {
        console.log(err.message);
      }
    }))
    .pipe(gulpStylelint({
      fix: true,
      reporters: [
        { formatter: 'string', console: true }
      ]
    }));
};

const css = series(buildCss, lintCss);

module.exports = {
  buildCss,
  lintCss,
  css
};

