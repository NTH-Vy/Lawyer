const { src, dest, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const config = require('../config').css;
const fs = require('fs');

const destDir = process.env.NODE_ENV === 'production' ? config.distribute.dir : config.develop.dir;
const cssGlob = config.source.glob.concat(config.source.ignore);
const postCss = [
    require('postcss-discard-duplicates'),
    require('stylelint')({
      configFile: '.stylelintrc.json',
      formatter: 'string',
      ignoreDisables: false,
      failOnError: true,
      outputFile: '',
      reportNeedlessDisables: false,
      fix: true,
      syntax: ''
    }),
    require('autoprefixer')({
      map: false,
      cascade: false
    })
  ];

const buildCss = () => {
  if (!fs.existsSync(config.source.dir + '/sass')) {
    return Promise.resolve();
  }
  return src(cssGlob)
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.identityMap())
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(postcss(postCss))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(destDir + '/css'));
};

const lintCss = () => {
  return src([config.develop.dir + '/css/**/*.css'])
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

