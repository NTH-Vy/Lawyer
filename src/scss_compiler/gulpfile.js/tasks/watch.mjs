import { watch, series } from 'gulp';
import * as del from 'del';
import { relative, resolve, parse, sep } from 'path';
import { base as _base, scss} from '../config/index.mjs';

const monitoring = () => {

  const sass = watch(['../scss/**/*.scss'].concat(scss.source.ignore), series('css'));
  sass.on('all', function (event, filepath) {
    console.log(`File ${filepath} was changed`);
    if (event === 'unlink') {
      const filePathFromSrc = relative(resolve(scss.source.dir), filepath);
      const distFilePath = resolve(scss.distribute.dir, filePathFromSrc).replace(/(?:\\|\/)?scss(?:\\|\/)?/, sep).replace(/\.scss$/, '.css');
      del([distFilePath]);
    }
  });

};

const watchTask = monitoring;

export const myWatch = watchTask;
