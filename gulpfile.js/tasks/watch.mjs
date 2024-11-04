import { src, dest, watch, series } from 'gulp';
import * as del from 'del';
import { relative, resolve, parse, sep } from 'path';
import { base as _base, html, scss, js as _js, image } from '../config/index.mjs';
const destDir = _base.distributeDir;

const monitoring = () => {

  const pug = watch(['src/pug/**/*.pug'].concat(html.source.ignore), series('html'));
  pug.on('all', function (event, filepath) {
    console.log(`File ${filepath} was changed`);
    if (event === 'unlink') {
      const commonPartFolders = ['_layouts', '_mixins', '_parts'];
      const filePathFromSrc = relative(resolve(html.source.dir), filepath);
      const parsedPath = parse(filePathFromSrc);
      const dirName = parsedPath.dir;
      const containsPartFolder = commonPartFolders.some(folder => dirName.includes(folder));
      if (!containsPartFolder) {
        const distFilePath = resolve(html.distribute.dir, filePathFromSrc).replace(/(?:\\|\/)?pug(?:\\|\/)?/, sep).replace(/\.pug$/, '.html');
        del([distFilePath]);
      }
    }
  });

  const sass = watch(['src/scss/**/*.scss'].concat(html.source.ignore), series('css'));
  sass.on('all', function (event, filepath) {
    console.log(`File ${filepath} was changed`);
    if (event === 'unlink') {
      const filePathFromSrc = relative(resolve(html.source.dir), filepath);
      const distFilePath = resolve(scss.distribute.dir, filePathFromSrc).replace(/(?:\\|\/)?scss(?:\\|\/)?/, sep).replace(/\.scss$/, '.css');
      del([distFilePath]);
    }
  });

  const js = watch(['src/js/**/*.js'].concat(_js.source.ignore), series('js'));
  js.on('all', function (event, filepath) {
    if (event === 'unlink') {
      const regExpSrc = new RegExp(_js.source.dir);
      const distSrc = filepath.replace(regExpSrc, _js.distribute.dir);
      del([distSrc]);
    }
    console.log(`File ${filepath} was changed`);
  });

  const images = watch(['src/img/**/*.{png,jpg,gif,svg}'].concat(_base.ignore));
  images.on('all', (event, filepath) => {
    if (event === 'add' || event === 'change') {
      src(filepath, { base: image.source.dir })
        .pipe(dest(destDir + '/img'));
    } else if (event === 'unlink') {
      const filePathFromSrc = relative(resolve(_base.sourceDir), filepath);
      let distFilePath = resolve(_base.distributeDir, filePathFromSrc);
      del([distFilePath]);
    }
    console.log(`File ${filepath} was changed`);
  });

};

const watchTask = monitoring;

export const myWatch = watchTask;
