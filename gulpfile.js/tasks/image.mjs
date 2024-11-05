import { src, dest } from 'gulp';
import changed from 'gulp-changed';
import imageMinify, { svgo, optipng, gifsicle } from 'gulp-imagemin';
import mozjpeg from 'imagemin-mozjpeg';
import pngquant from 'imagemin-pngquant';
import webp from 'gulp-webp';
import { image as config } from '../config/index.mjs';

const destDir = config.distribute.dir;

const imageMin = () => {
  return src(config.source.glob.concat(config.source.ignore), {encoding: false})
    .pipe(changed(destDir + '/img'))
    .pipe(imageMinify([
      pngquant({
        quality: [0.7, 0.8],
        speed: 1,
      }),
      mozjpeg({ progressive: true, quality: 70 }),
      svgo(),
      optipng(),
      gifsicle({ optimizationLevel: 3 }),
    ]))
    .pipe(dest(destDir + '/img'));
};

const convertToWebp = () => {
  return src(config.source.glob.concat(config.source.ignore), {encoding: false})
    .pipe(imageMinify([
      pngquant({
        quality: [0.7, 0.8],
        speed: 1,
      }),
      mozjpeg({ progressive: true, quality: 70 }),
      svgo(),
      optipng(),
      gifsicle({ optimizationLevel: 3 }),
    ]))
    .pipe(webp({
      quality: 80,
      method: 6
    }))
    .pipe(dest(destDir + '/img'));
};

export  {
  imageMin,
  convertToWebp
};
