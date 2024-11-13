import { src, dest, watch, series } from 'gulp';
import * as del from 'del';
import { relative, resolve, parse, sep } from 'path';
import { base as _base, html, scss, js as _js, image } from '../config/index.mjs';

const monitoring = () => {

  const sass = watch(['src/scss/**/*.scss'].concat(html.source.ignore), series('css'));
  sass.on('all', function (event, filepath) {
    console.log(`File ${filepath} was changed`);
    if (event === 'unlink') {
      const filePathFromSrc = relative(resolve(html.source.dir), filepath);
      const distFilePath = resolve(scss.distribute.dir, filePathFromSrc).replace(/(?:\\|\/)?scss(?:\\|\/)?/, sep).replace(/\.scss$/, '.css');
      del([distFilePath]);
    }
  });

};

const watchTask = monitoring;

export const myWatch = watchTask;
