const { src, lastRun, dest } = require('gulp');
const kraken = require('gulp-kraken');
const config = require('../config').image;

const destDir = config.distribute.dir;

const image = () => {
  return src(config.source.glob.concat(config.source.ignore))
    .pipe(dest(destDir + '/img'));
};

const imagemin = () => {
  return src(destDir + '/img/**/*.{png,jpg,gif,svg}')
    .pipe(kraken({
      key: '5b61b3c6bba11a2dbc7be9beb3ab11d5',
      secret: '07e8e703c93fa122dd6ff3aa95d555570d9b21eb',
      lossy: true,
      concurrency: 6
    }));
};

module.exports = {
  image,
  imagemin
};
