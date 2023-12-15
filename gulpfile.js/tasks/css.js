const { src, dest, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const scssSyntax = require('postcss-scss');
const sourcemaps = require('gulp-sourcemaps');
const config = require('../config').css;
const fs = require('fs');

const destDir = config.distribute.dir;
const cssGlob = config.source.glob.concat(config.source.ignore);

const buildCss = () => {
  if (!fs.existsSync(config.source.dir + '/scss')) {
    return Promise.resolve();
  }

  const postCssOptions = [
    require('stylelint')({
      configFile: '.stylelintrc.json',
      formatter: 'string',
      ignoreDisables: false,
      failOnError: true,
      outputFile: '',
      reportNeedlessDisables: false,
      fix: true,
      syntax: 'scss',
      reporters: [
        { formatter: 'string', console: true }
      ]
    }),
    require('autoprefixer')({
      map: false,
      cascade: false
    })
  ];

  if (config.options.minify) {
    postCssOptions.push(require('cssnano')({
      preset: 'default'
    }));
  }

  return src(cssGlob)
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.identityMap())
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(postcss(postCssOptions, { syntax: scssSyntax }))
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
        syntax: 'scss',
        reporters: [
          { formatter: 'string', console: true }
        ]
      }),
      (root, result) => {
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
    ], { syntax: scssSyntax }))
    .pipe(dest(config.source.dir + '/scss'));
};

const css = series(buildCss);

module.exports = {
  lintCss,
  buildCss,
  css
};

