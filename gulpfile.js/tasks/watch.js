const { src, dest, watch, series } = require('gulp');
const del = require('del');
const path = require('path');
const config = require('../config');

const destDir = process.env.NODE_ENV === 'production' ? config.base.distributeDir : config.base.developDir;

const monitoring = () => {

  const pug = watch(['src/pug/**/*.pug'].concat(config.html.source.ignore), series('html'));
  pug.on('all', function (event, filepath) {
    console.log(`File ${filepath} was changed`);
    if (event === 'unlink') {
      const commonPugDirectories = ['_layouts', '_mixins', '_parts'];
      const filePathFromSrc = path.relative(path.resolve(config.html.source.dir), filepath);
      const parsedPath = path.parse(filePathFromSrc);
      const dirName = parsedPath.dir;
      const containsFolder = commonPugDirectories.some(folder => dirName.includes(folder));
      if (!containsFolder) {
        const devFilePath = path.resolve(config.html.develop.dir, filePathFromSrc).replace(/(?:\\|\/)?pug(?:\\|\/)?/, path.sep).replace(/\.pug$/, '.html');
        const distFilePath = path.resolve(config.html.distribute.dir, filePathFromSrc).replace(/(?:\\|\/)?pug(?:\\|\/)?/, path.sep).replace(/\.pug$/, '.html');
        del([devFilePath, distFilePath]);
      }
    }
  });

  const sass = watch(['src/sass/**/*.sass'].concat(config.html.source.ignore), series('css'));
  sass.on('all', function (event, filepath) {
    console.log(`File ${filepath} was changed`);
    if (event === 'unlink') {
      const filePathFromSrc = path.relative(path.resolve(config.html.source.dir), filepath);
      const devFilePath = path.resolve(config.css.develop.dir, filePathFromSrc).replace(/(?:\\|\/)?sass(?:\\|\/)?/, path.sep).replace(/\.sass$/, '.css');
      const distFilePath = path.resolve(config.css.distribute.dir, filePathFromSrc).replace(/(?:\\|\/)?sass(?:\\|\/)?/, path.sep).replace(/\.sass$/, '.css');
      del([devFilePath, distFilePath]);
    }
  });

  const js = watch(['src/js/**/*.js'].concat(config.js.source.ignore), series('js'));
  js.on('all', function (event, filepath) {
    if (event === 'unlink') {
      const regExpSrc = new RegExp(config.js.source.dir),
        devSrc = filepath.replace(regExpSrc, config.js.develop.dir),
        distSrc = filepath.replace(regExpSrc, config.js.distribute.dir);
      del([devSrc, distSrc]);
    }
    console.log(`File ${path} was changed`);
  });

  const images = watch(['src/img/**/*.{png,jpg,gif,svg}'].concat(config.base.ignore));
  images.on('all', (event, filepath) => {
    if (event === 'add' || event === 'change') {
      src(filepath, { base: config.image.source.dir })
        .pipe(dest(destDir + '/img'));
    } else if (event === 'unlink') {
      const filePathFromSrc = path.relative(path.resolve(config.base.sourceDir), filepath);
      let devFilePath = path.resolve(config.base.developDir, filePathFromSrc);
      let distFilePath = path.resolve(config.base.distributeDir, filePathFromSrc);
      del([devFilePath, distFilePath]);
    }
    console.log(`File ${filepath} was changed`);
  });

};

const watchTask = monitoring;

module.exports = {
  watch: watchTask
};
