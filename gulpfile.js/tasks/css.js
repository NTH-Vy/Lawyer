const { src, dest, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const scssSyntax = require('postcss-scss');
const sourcemaps = require('gulp-sourcemaps');
const config = require('../config').css;
const fs = require('fs');
const argv = require('yargs').argv;

const destDir = config.distribute.dir;
const cssGlob = config.source.glob.concat(config.source.ignore);

const customLint = (root, result) => {
  root.walk((node) => {
    if (node.type === 'atrule') {
      if ((node.name === 'media' || node.name === 'include') && node.parent.type === 'root') {
        if (node.params !== 'print') {
          result.warn(`Do not use @media or @include in root-level. Found: @${node.name}`, {
            node: node,
          });
        }
      }
    } else if (node.type === 'decl') {
      if (node.value.indexOf('\'') !== -1) {
        result.warn(`Use double quotes instead of single quotes in SCSS files. Property: ${node.prop}`, {
          node: node,
        });
      }
      if (/-\d+(\.\d+)?/g.test(node.value)) {
        result.warn(`Avoid using negative values. Property: ${node.prop}`, {
          node: node,
        });
      }
    } else if (node.type === 'rule') {
      const selectors = node.selector.split(',');
      selectors.forEach((selector) => {
        if (selector.includes(':not')) {
          result.warn(`Avoid using :not() selector in SCSS. Selector: ${selector}`, {
            node: node,
          });
        }
      });
    }
  });
};

const lintStyles = (fix = false) => {
  const stopOnError = argv.stopOnError || false;
  const isFix = (typeof fix === 'boolean' && fix === true) ? true : false;
  let filesToCheck = config.source.glob;
  if (argv.file) {
    const targetFiles = argv.file.replace(/"/g, '').replace(/, /g, ',');
    filesToCheck = targetFiles.split(',');
  }
  return src(filesToCheck)
    .pipe(postcss([
      require('stylelint')({
        configFile: '.stylelintrc.json',
        formatter: 'string',
        ignoreDisables: false,
        failOnError: true,
        outputFile: '',
        reportNeedlessDisables: false,
        quietDeprecationWarnings: true,
        fix: isFix,
        syntax: 'scss'
      }),
      customLint,
      require('postcss-reporter')({
        noIcon: true,
        noPlugin: true,
        throwError: stopOnError
      })
    ], { syntax: scssSyntax })
    );
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

const copyFonts = () => {
  if (!fs.existsSync(config.source.dir + '/scss/fonts')) {
    return Promise.resolve();
  }
  return src(config.source.dir + '/scss/fonts/**/*')
    .pipe(dest(destDir + '/css/fonts'));
}

const extractColor = (value) => {
  const match = value.match(/#(?:[0-9a-fA-F]{3}){1,2}|rgba?\([^)]*\)|hsla?\([^)]*\)/i);
  return match ? match[0] : null;
};

const extractFontSize = (value) => {
  const match = value.match(/\b\d+(?:\.\d+)?(?:px|em|rem|%)?\b/i);
  return match ? match[0] : null;
};

const analyzeStyles = (done) => {
  const variableMap = new Map();
  const mediaRules = [];
  const importantUsages = [];
  const colorValues = [];
  const fontsizeValues = [];
  const fontweightValues = [];
  const lineheightValues = [];

  const textshadowValues = [];
  const boxshadowValues = [];

  const widthValues = [];
  const heightValues = [];

  const marginValues = [];
  const paddingValues = [];
  const borderValues = [];

  const topValues = [];
  const rightValues = [];
  const bottomValues = [];
  const leftValues = [];

  // const propertyInfoMap = new Map();

  return src(config.source.glob)
    .pipe(postcss([
      (root, result) => {
        const fileName = root.source.input.file;
        root.walk((node) => {
          if (node.type === 'atrule') {
            // if ((node.name === 'media' || node.name === 'include') && node.parent.type === 'root') {
            //   if (node.params !== 'print') {
            //     result.warn(`Do not use @media or @include in root-level. Found: @${node.name}`, {
            //       node: node,
            //     });
            //   }
            // }

            if (node.name === 'media') {
              // mediaRules.push(node.params);
            }

          } else if (node.type === 'decl') {

            // Get defined variables
            if (node.prop.startsWith('$')) {
              variableMap.set(node.prop, node.value);
            }

            // Get the usage of !important
            if (node.important) {
              importantUsages.push({
                fileName,
                line: node.source.start.line,
                column: node.source.start.column,
                selector: node.parent.selector,
                property: node.prop,
                value: node.value,
              });
            }

            // Get colors
            if (/#|rgba?|hsla?/i.test(node.value)) {
              if (!node.prop.startsWith('$')) {
                const extractedColor = extractColor(node.value);
                if (extractedColor !== null) {
                  colorValues.push({
                    fileName: root.source.input.file,
                    line: node.source.start.line,
                    column: node.source.start.column,
                    selector: node.parent.selector,
                    property: node.prop,
                    value: node.value,
                    extractedColor
                  });
                }
              }
            }

            // Get line-height
            if (node.prop === 'line-height') {
              lineheightValues.push({
                fileName: root.source.input.file,
                line: node.source.start.line,
                column: node.source.start.column,
                selector: node.parent.selector,
                property: node.prop,
                value: node.value,
              });
            }

            // Get font-weight
            if (node.prop === 'font-weight') {
              fontweightValues.push({
                fileName: root.source.input.file,
                line: node.source.start.line,
                column: node.source.start.column,
                selector: node.parent.selector,
                property: node.prop,
                value: node.value,
              });
            }

            // Get font-size
            if (node.prop === 'font-size') {
              if (!node.prop.startsWith('$')) {
                const extractedFontSize = extractFontSize(node.value);
                if (extractedFontSize !== null) {
                  fontsizeValues.push({
                    fileName: root.source.input.file,
                    line: node.source.start.line,
                    column: node.source.start.column,
                    selector: node.parent.selector,
                    property: node.prop,
                    value: node.value,
                    extractedFontSize,
                  });
                }
              }
            }

            // Get text-shadow
            if (node.prop === 'text-shadow') {
              textshadowValues.push({
                fileName: root.source.input.file,
                line: node.source.start.line,
                column: node.source.start.column,
                selector: node.parent.selector,
                property: node.prop,
                value: node.value,
              });
            }

            // Get box-shadow
            if (node.prop === 'box-shadow') {
              boxshadowValues.push({
                fileName: root.source.input.file,
                line: node.source.start.line,
                column: node.source.start.column,
                selector: node.parent.selector,
                property: node.prop,
                value: node.value,
              });
            }

            // Get width
            if (/width/i.test(node.prop)) {
              widthValues.push({
                fileName: root.source.input.file,
                line: node.source.start.line,
                column: node.source.start.column,
                selector: node.parent.selector,
                property: node.prop,
                value: node.value,
              });
            }

            // Get height
            if (/height/i.test(node.prop)) {
              heightValues.push({
                fileName: root.source.input.file,
                line: node.source.start.line,
                column: node.source.start.column,
                selector: node.parent.selector,
                property: node.prop,
                value: node.value,
              });
            }

            // Get margin
            if (/margin/i.test(node.prop)) {
              marginValues.push({
                fileName: root.source.input.file,
                line: node.source.start.line,
                column: node.source.start.column,
                selector: node.parent.selector,
                property: node.prop,
                value: node.value,
              });
            }

            // Get padding
            if (/padding/i.test(node.prop)) {
              paddingValues.push({
                fileName: root.source.input.file,
                line: node.source.start.line,
                column: node.source.start.column,
                selector: node.parent.selector,
                property: node.prop,
                value: node.value,
              });
            }

            if (node.prop.startsWith('border')) {
              borderValues.push({
                fileName: root.source.input.file,
                line: node.source.start.line,
                column: node.source.start.column,
                selector: node.parent.selector,
                property: node.prop,
                value: node.value,
              });
            }

            // Get top
            if (node.prop === 'top') {
              topValues.push({
                fileName: root.source.input.file,
                line: node.source.start.line,
                column: node.source.start.column,
                selector: node.parent.selector,
                property: node.prop,
                value: node.value,
              });
            }

            // Get right
            if (node.prop === 'right') {
              rightValues.push({
                fileName: root.source.input.file,
                line: node.source.start.line,
                column: node.source.start.column,
                selector: node.parent.selector,
                property: node.prop,
                value: node.value,
              });
            }

            // Get bottom
            if (node.prop === 'bottom') {
              bottomValues.push({
                fileName: root.source.input.file,
                line: node.source.start.line,
                column: node.source.start.column,
                selector: node.parent.selector,
                property: node.prop,
                value: node.value,
              });
            }

            // Get left
            if (node.prop === 'left') {
              leftValues.push({
                fileName: root.source.input.file,
                line: node.source.start.line,
                column: node.source.start.column,
                selector: node.parent.selector,
                property: node.prop,
                value: node.value,
              });
            }

            // if (node.value.indexOf('\'') !== -1) {
            //   result.warn(`Use double quotes instead of single quotes in SCSS files. Property: ${node.prop}`, {
            //     node: node,
            //   });
            // }
            // if (/-\d+(\.\d+)?/g.test(node.value)) {
            //   result.warn(`Avoid using negative values. Property: ${node.prop}`, {
            //     node: node,
            //   });
            // }
          } else if (node.type === 'rule') {
            const selectors = node.selector.split(',');
            selectors.forEach((selector) => {
              // if (selector.includes(':not')) {
              //   result.warn(`Avoid using :not() selector in SCSS. Selector: ${selector}`, {
              //     node: node,
              //   });
              // }
            });
          }
        })
      }
    ], { syntax: scssSyntax }
    ))
    .on('error', function (error) {
      console.log(error.toString());
      this.emit('end');
    })
    .on('end', function () {
      // console.log(variableMap);
      // console.log(mediaRules);
      // console.log(importantUsages);
      // console.log(colorValues);
      // console.log(fontsizeValues);
      // console.log(marginValues);
      // console.log(paddingValues);

      // console.log(fontweightValues);
      console.log(lineheightValues);

      const dataObject = {
        analyzedTime: new Date(),
        // variableMap: Array.from(variableMap),
        // mediaRules,
        // importantUsages,
        // colorValues,
        // fontsizeValues,
        marginValues,
        paddingValues
      };
      fs.writeFileSync('scss-analyze-report.json', JSON.stringify(dataObject, null, 2));
      done();
    });
};

const css = series(lintStyles, buildStyles);

module.exports = {
  lintStyles,
  lintStylesFix,
  buildStyles,
  analyzeStyles,
  copyFonts,
  css
};
