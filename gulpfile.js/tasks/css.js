const { src, dest, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const scssSyntax = require('postcss-scss');
const sourcemaps = require('gulp-sourcemaps');
const config = require('../config').css;
const fs = require('fs');

const destDir = config.distribute.dir;
const cssGlob = config.source.glob.concat(config.source.ignore);

const stylelintConfig = {
  configFile: '.stylelintrc.json',
  formatter: 'string',
  ignoreDisables: false,
  failOnError: true,
  outputFile: '',
  reportNeedlessDisables: false,
  quietDeprecationWarnings: true,
  fix: false,
  syntax: 'scss',
  reporters: [
    { formatter: 'string', console: true }
  ]
};

const customLint = (root, result) => {
  root.walkDecls((decl) => {
    if (decl.value.includes('\'')) {
      result.warn(`Use double quotes instead of single quotes in SCSS files. Property: ${decl.prop}`, {
        node: decl,
      });
    }
    if (/-\d+(\.\d+)?/g.test(decl.value)) {
      result.warn(`Avoid using negative values. Property: ${decl.prop}`, {
        node: decl,
      });
    }
  });
  root.walkRules((rule) => {
    const selectors = rule.selector.split(',');
    selectors.forEach((selector) => {
      if (selector.includes(':not')) {
        result.warn(`Avoid using :not() selector in SCSS. Selector: ${selector}`, {
          node: rule,
        });
      }
    });
  });
}

const lintStyles = (fix = false) => {
  return src(config.source.glob)
    .pipe(postcss([
      require('stylelint')({
        ...stylelintConfig,
        fix
      }),
      customLint
    ], { syntax: scssSyntax }));
};

const lintStylesFix = () => {
  return lintStyles(true).pipe(dest(config.source.dir + '/scss'));
};

const buildStyles = () => {
  if (!fs.existsSync(config.source.dir + '/scss')) {
    return Promise.resolve();
  }

  const transpileOptions = [
    require('autoprefixer')({
      map: false,
      cascade: false
    })
  ];

  if (config.options.minify) {
    transpileOptions.push(require('cssnano')({
      preset: 'default'
    }));
  }

  return src(cssGlob)
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.identityMap())
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(postcss(transpileOptions, { syntax: scssSyntax }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(destDir + '/css'));
};

const css = series(lintStyles, buildStyles);

module.exports = {
  lintStyles,
  lintStylesFix,
  buildStyles,
  css
};
