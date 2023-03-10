const { src, watch, series } = require('gulp');
const config = require('../config');

const Monitoring = () => {

  const pug = watch(['src/pug/**/*.pug'].concat(config.html.source.ignore), series('html'));
  pug.on('all', function (event, path) {
    if (event === 'unlink') {
      if (!/^_/.test(path.split('/')[path.split('/').length - 1])) {
        // var regExpSrc = new RegExp(config.html.source.dir),
        //   devSrc = path.replace(regExpSrc, config.html.develop.dir).replace(/\.ejs/, '.html'),
        //   distSrc = path.replace(regExpSrc, config.html.distribute.dir).replace(/\.ejs/, '.html');
        // del([devSrc, distSrc]);
      }
    }
    console.log(`File ${path} was changed`);
  });

};


const watchTask = Monitoring;

module.exports = {
  watch: watchTask
};
