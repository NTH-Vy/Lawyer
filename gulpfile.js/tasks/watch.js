const { src, watch, series } = require('gulp');
const del = require('del');
const config = require('../config');

const monitoring = () => {

  const pug = watch(['src/pug/**/*.pug'].concat(config.html.source.ignore), series('html'));
  pug.on('all', function (event, path) {
    if (event === 'unlink') {
      if (!/^_/.test(path.split('/')[path.split('/').length - 1])) {
        var regExpSrc = new RegExp(config.html.source.dir),
          devSrc = path.replace(regExpSrc, config.html.develop.dir).replace(/\.pug/, '.html'),
          distSrc = path.replace(regExpSrc, config.html.distribute.dir).replace(/\.pug/, '.html');
        del([devSrc, distSrc]);
      }
    }
    console.log(`File ${path} was changed`);
  });

  const sass = watch(['src/sass/**/*.s*ss'].concat(config.html.source.ignore), series('css'));
  sass.on('all', function (event, path) {
    if (event === 'unlink') {
      if (!/^_/.test(path.split('/')[path.split('/').length - 1])) {
        var regExpSrc = new RegExp(config.css.source.dir),
          devSrc = path.replace(regExpSrc, config.css.develop.dir).replace(/\.sass/, '.css'),
          distSrc = path.replace(regExpSrc, config.css.distribute.dir).replace(/\.sass/, '.css');
        del([devSrc, distSrc]);
      }
    }
    console.log(`File ${path} was changed`);
  });

  const js = watch(['src/js/**/*.js'].concat(config.js.source.ignore), series('js'));
  js.on('all', function (event, path) {
    if (event === 'unlink') {
      var regExpSrc = new RegExp(config.js.source.dir),
        devSrc = path.replace(regExpSrc, config.js.develop.dir),
        distSrc = path.replace(regExpSrc, config.js.distribute.dir);
      del([devSrc, distSrc]);
    }
    console.log(`File ${path} was changed`);
  });

  let images = watch(['src/img/**/*'].concat(config.base.ignore), series('imagemin'));
  images.on('all', (event, path) => {
    if (event === 'unlink') {
      var regExpSrc = new RegExp(config.image.source.dir),
        devSrc = path.replace(regExpSrc, config.image.develop.dir),
        distSrc = path.replace(regExpSrc, config.image.distribute.dir);
      del([devSrc, distSrc]);
    }
    console.log(`File ${path} was changed`);
  });

};


const watchTask = monitoring;

module.exports = {
  watch: watchTask
};
