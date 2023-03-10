const { src, watch, series } = require('gulp');
const config = require('../config');

const monitoring = () => {

  const pug = watch(['src/pug/**/*.pug'].concat(config.html.source.ignore), series('html'));
  pug.on('all', function (event, path) {
    if (event === 'unlink') {
      if (!/^_/.test(path.split('/')[path.split('/').length - 1])) {
        // TODO: Delete file
      }
    }
    console.log(`File ${path} was changed`);
  });

  const sass = watch(['src/sass/**/*.s*ss'].concat(config.html.source.ignore), series('css'));
  sass.on('all', function (event, path) {
    if (event === 'unlink') {
      if (!/^_/.test(path.split('/')[path.split('/').length - 1])) {
        // TODO: Delete file
      }
    }
    console.log(`File ${path} was changed`);
  });

  const js = watch(['src/js/**/*.js'].concat(config.js.source.ignore), series('js'));
  js.on('all', function (event, path) {
    if (event === 'unlink') {
      if (!/^_/.test(path.split('/')[path.split('/').length - 1])) {
        // TODO: Delete file
      }
    }
    console.log(`File ${path} was changed`);
  });

};


const watchTask = monitoring;

module.exports = {
  watch: watchTask
};
