const { src, dest, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const scssSyntax = require('postcss-scss');
const sourcemaps = require('gulp-sourcemaps');
const config = require('../config').css;
const fs = require('fs');
const path = require('path');
const argv = require('yargs').argv;
const beautify = require('js-beautify').css;

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
  const mediaQueries = new Set;
  const definedVariables = [];
  const importantUsages = [];
  const colorValues = [];
  const fontfamilyValues = [];
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

  const convertArrayToCSS = (arr) => {
    let cssCode = '';
    for (let i = 0; i < arr.length - 1; i++) {
      cssCode += arr[i] + ' {';
    }
    cssCode += arr[arr.length - 1] + ' {}';
    for (let i = arr.length - 2; i >= 0; i--) {
      cssCode += '}';
    }
    return beautify(cssCode, { indent_size: 2, newline_between_rules: false });
  }

  return src(config.source.glob)
    .pipe(postcss([
      (root, result) => {
        const filePath = root.source.input.file;
        const fileName = path.relative(process.cwd(), filePath).replace(/\\/g, '/');

        root.walk((node) => {

          const selectorPath = [];
          let currentNode = node.parent;
          let mediaQuery = null;
          while (currentNode) {
            if (currentNode.type === 'rule') {
              const ruleSelector = currentNode.selector.trim();
              if (ruleSelector) {
                selectorPath.unshift(ruleSelector);
              }
            } else if (currentNode.type === 'atrule') {
              if (currentNode.name === 'media') {
                mediaQueries.add(`@media ${currentNode.params}`);
                if (!mediaQuery) {
                  mediaQuery = `@media ${currentNode.params}`;
                }
              } else if (currentNode.name === 'include') {
                mediaQueries.add(`@include ${currentNode.params}`);
                if (!mediaQuery) {
                  mediaQuery = `@include ${currentNode.params}`;
                }
              }
            }
            currentNode = currentNode.parent;
          }
          const selectorClasses = convertArrayToCSS(selectorPath);

          if (node.type === 'atrule') {

          } else if (node.type === 'decl') {

            // Get defined variables
            if (node.prop.startsWith('$')) {
              definedVariables.push({
                name: node.prop,
                value: node.value
              });
            }

            // Get the usage of !important
            if (node.important) {
              importantUsages.push({
                fileName,
                filePath,
                line: node.source.start.line,
                column: node.source.start.column,
                selector: node.parent.selector,
                selectorClasses,
                mediaQuery,
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
                    fileName,
                    filePath,
                    line: node.source.start.line,
                    column: node.source.start.column,
                    selector: node.parent.selector,
                    selectorClasses,
                    mediaQuery,
                    property: node.prop,
                    value: node.value,
                    extractedColor
                  });
                }
              }
            }

            // Get font-family
            if (node.prop === 'font-family') {
              if (!node.prop.startsWith('$')) {
                fontfamilyValues.push({
                  fileName,
                  filePath,
                  line: node.source.start.line,
                  column: node.source.start.column,
                  selector: node.parent.selector,
                  property: node.prop,
                  selectorClasses,
                  mediaQuery,
                  value: node.value,
                });
              }
            }

            // Get font-size
            if (node.prop === 'font-size') {
              if (!node.prop.startsWith('$')) {
                const extractedFontSize = extractFontSize(node.value);
                if (extractedFontSize !== null) {
                  fontsizeValues.push({
                    fileName,
                    filePath,
                    line: node.source.start.line,
                    column: node.source.start.column,
                    selector: node.parent.selector,
                    property: node.prop,
                    selectorClasses,
                    mediaQuery,
                    value: node.value,
                    extractedFontSize,
                  });
                }
              }
            }

            // Get line-height
            if (node.prop === 'line-height') {
              lineheightValues.push({
                fileName,
                filePath,
                line: node.source.start.line,
                column: node.source.start.column,
                selector: node.parent.selector,
                property: node.prop,
                selectorClasses,
                mediaQuery,
                value: node.value,
              });
            }

            // Get font-weight
            if (node.prop === 'font-weight') {
              fontweightValues.push({
                fileName,
                filePath,
                line: node.source.start.line,
                column: node.source.start.column,
                selector: node.parent.selector,
                property: node.prop,
                selectorClasses,
                mediaQuery,
                value: node.value,
              });
            }

            // Get text-shadow
            if (node.prop === 'text-shadow') {
              textshadowValues.push({
                fileName,
                filePath,
                line: node.source.start.line,
                column: node.source.start.column,
                selector: node.parent.selector,
                property: node.prop,
                selectorClasses,
                mediaQuery,
                value: node.value,
              });
            }

            // Get box-shadow
            if (node.prop === 'box-shadow') {
              boxshadowValues.push({
                fileName,
                filePath,
                line: node.source.start.line,
                column: node.source.start.column,
                selector: node.parent.selector,
                property: node.prop,
                selectorClasses,
                mediaQuery,
                value: node.value,
              });
            }

            // Get width
            if (/width/i.test(node.prop)) {
              widthValues.push({
                fileName,
                filePath,
                line: node.source.start.line,
                column: node.source.start.column,
                selector: node.parent.selector,
                property: node.prop,
                selectorClasses,
                mediaQuery,
                value: node.value,
              });
            }

            // Get height
            if (/height/i.test(node.prop)) {
              heightValues.push({
                fileName,
                filePath,
                line: node.source.start.line,
                column: node.source.start.column,
                selector: node.parent.selector,
                property: node.prop,
                selectorClasses,
                mediaQuery,
                value: node.value,
              });
            }

            // Get margin
            if (/margin/i.test(node.prop)) {
              marginValues.push({
                fileName,
                filePath,
                line: node.source.start.line,
                column: node.source.start.column,
                selector: node.parent.selector,
                property: node.prop,
                selectorClasses,
                mediaQuery,
                value: node.value,
              });
            }

            // Get padding
            if (/padding/i.test(node.prop)) {
              paddingValues.push({
                fileName,
                filePath,
                line: node.source.start.line,
                column: node.source.start.column,
                selector: node.parent.selector,
                property: node.prop,
                selectorClasses,
                mediaQuery,
                value: node.value,
              });
            }

            if (node.prop.startsWith('border')) {
              borderValues.push({
                fileName,
                filePath,
                line: node.source.start.line,
                column: node.source.start.column,
                selector: node.parent.selector,
                property: node.prop,
                selectorClasses,
                mediaQuery,
                value: node.value,
              });
            }

            // Get top
            if (node.prop === 'top') {
              topValues.push({
                fileName,
                filePath,
                line: node.source.start.line,
                column: node.source.start.column,
                selector: node.parent.selector,
                property: node.prop,
                selectorClasses,
                mediaQuery,
                value: node.value,
              });
            }

            // Get right
            if (node.prop === 'right') {
              rightValues.push({
                fileName,
                filePath,
                line: node.source.start.line,
                column: node.source.start.column,
                selector: node.parent.selector,
                property: node.prop,
                selectorClasses,
                mediaQuery,
                value: node.value,
              });
            }

            // Get bottom
            if (node.prop === 'bottom') {
              bottomValues.push({
                fileName,
                filePath,
                line: node.source.start.line,
                column: node.source.start.column,
                selector: node.parent.selector,
                property: node.prop,
                selectorClasses,
                mediaQuery,
                value: node.value,
              });
            }

            // Get left
            if (node.prop === 'left') {
              leftValues.push({
                fileName,
                filePath,
                line: node.source.start.line,
                column: node.source.start.column,
                selector: node.parent.selector,
                property: node.prop,
                selectorClasses,
                mediaQuery,
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
      const dataObject = {
        analyzedTime: new Date(),
        mediaQueries: Array.from(mediaQueries).sort(),
        definedVariables,
        importantUsages,
        colorValues,
        fontfamilyValues,
        fontsizeValues,
        fontweightValues,
        lineheightValues,
        widthValues,
        heightValues,
        marginValues,
        paddingValues,
        textshadowValues,
        boxshadowValues,
        topValues,
        rightValues,
        bottomValues,
        leftValues
      };
      const templatePath = 'scss-analyze-report.tpl';
      const templateContent = fs.readFileSync(templatePath, 'utf-8');
      const htmlContent = templateContent.replace('{/* DATA_PLACEHOLDER */}', JSON.stringify(dataObject, null, 2));
      const outputFilePath = 'scss-analyze-report.html';
      fs.writeFileSync(outputFilePath, htmlContent);
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
