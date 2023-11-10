const { src, lastRun, dest } = require('gulp');
const kraken = require('gulp-kraken');
const config = require('../config');
const imageConfig = config.image;
const krakenConfig = config.kraken;

const destDir = imageConfig.distribute.dir;

const image = () => {
  return src(imageConfig.source.glob.concat(imageConfig.source.ignore))
    .pipe(dest(destDir + '/img'));
};

const imagemin = () => {
  return src(destDir + '/img/**/*.{png,jpg,gif,svg}')
    .pipe(kraken({
      key: krakenConfig.key,
      secret: krakenConfig.secret,
      lossy: true,
      concurrency: 6
    }));
};

module.exports = {
  image,
  imagemin
};
