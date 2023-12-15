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
      key: config.options.kraken.key,
      secret: config.options.kraken.secret,
      lossy: true,
      concurrency: 6
    }));
};

module.exports = {
  image,
  imagemin
};
