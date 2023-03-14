const { src, lastRun, dest, series } = require('gulp');
const kraken = require('gulp-kraken');
const config = require('../config').image;

const destDir = process.env.NODE_ENV === 'production' ? config.distribute.dir : config.develop.dir;

const copyImage = () => {
  return src(config.source.glob.concat(config.source.ignore))
    .pipe(dest(destDir + '/img'));
};

const compressImage = () => {
  return src(destDir + '/img/**/*', {
    since: lastRun(compressImage)
  })
    .pipe(kraken({
      key: '5b61b3c6bba11a2dbc7be9beb3ab11d5',
      secret: '07e8e703c93fa122dd6ff3aa95d555570d9b21eb',
      lossy: true,
      concurrency: 6
    }));
};

// const imagemin = series(copyImage, compressImage);
const imagemin = series(copyImage);

module.exports = {
  imagemin
};
