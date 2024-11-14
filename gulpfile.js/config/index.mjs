const pathSource = './src';
const pathDestination = './dist';
const ignoreGlobal = ['!**/.DS_Store', '!**/* copy.*', '!./wp/**/*', '!./dist/wp/**/*'];
const cleanDirectory = ['./dist/css', './dist/img']; // Clean these directories before each time npm is building

const baseConfig = {
  pathSource: pathSource,
  pathDestination: pathDestination,
  cleanDirectory: cleanDirectory,
  ignore: ignoreGlobal,
  html: {
    path: {
      input: pathSource + '/pug',
      inputFiles: pathSource + '/pug/**/*.pug',
      output: pathDestination + '',
    },
    ignore: ['!./src/pug/_*/**'],
    options: {
      minify: false, // To Minify HTML files
    },
  },
  css: {
    path: {
      input: pathSource + '/scss',
      inputFiles: pathSource + '/scss/**/*.scss',
      output: pathDestination + '/css',
    },
    ignore: [],
    options: {
      minify: false, // To Minify CSS files
    },
  },
  js: {
    path: {
      input: pathSource + '/js',
      inputFiles: pathSource + '/js/**/*.js',
      output: pathDestination + '/js',
    },
    ignore: [],
    options: {
      minify: false, // To Minify JS files
    },
  },
  image: {
    path: {
      input: pathSource + '/img',
      inputFiles: pathSource + '/img/**/*',
      output: pathDestination + '/img',
    },
    ignore: [],
  },
  font: {
    path: {
      input: pathSource + '/font',
      inputFiles: pathSource + '/font/**/*',
      output: pathDestination + '/font',
    },
    ignore: [],
  },
  doc: {
    path: {
      input: pathSource + '/doc',
      inputFiles: pathSource + '/doc/**/*',
      output: pathDestination + '/doc',
    },
    ignore: [],
  },
  pdf: {
    path: {
      input: pathSource + '/pdf',
      inputFiles: pathSource + '/pdf/**/*',
      output: pathDestination + '/pdf',
    },
    ignore: [],
  },
  video: {
    path: {
      input: pathSource + '/video',
      inputFiles: pathSource + '/video/**/*',
      output: pathDestination + '/video',
    },
    ignore: [],
  },
  browserSync: {
    server: {
      baseDir: pathDestination,
      logLevel: 'silent',
      notify: false,
      reloadDelay: 1000,
      reloadDebounce: 1000,
    },
    files: pathDestination,
    ui: false,
    port: 3000,
    open: 'local',
  },
};

export const base = baseConfig;

