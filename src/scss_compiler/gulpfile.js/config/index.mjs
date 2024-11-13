const baseConfig = {
  sourceDir: './src',
  distributeDir: './dist',
  ignore: ['!**/.DS_Store', '!**/* copy.*', '!./wp/**/*', '!./dist/wp/**/*']
};

export const base = baseConfig;
export const browserSync = {
  server: {
    baseDir: baseConfig.distributeDir,
    logLevel: 'silent',
    notify: false,
    reloadDelay: 1000,
    reloadDebounce: 1000
  },
  files: baseConfig.distributeDir,
  ui: false,
  port: 3000,
  open: 'local',
};
export const html = {
  source: {
    dir: baseConfig.sourceDir + '/pug',
    glob: [baseConfig.sourceDir + '/pug/**/*.pug'],
    ignore: [].concat(baseConfig.ignore)
  },
  distribute: {
    dir: baseConfig.distributeDir
  },
  options: {
    minify: false
  }
};
export const scss = {
  source: {
    dir: baseConfig.sourceDir,
    glob: [baseConfig.sourceDir + '/scss/**/*.scss'],
    ignore: [].concat(baseConfig.ignore)
  },
  distribute: {
    dir: baseConfig.distributeDir
  },
  options: {
    minify: false
  }
};
export const js = {
  source: {
    dir: baseConfig.sourceDir,
    glob: [baseConfig.sourceDir + '/js/**/*.js'],
    ignore: [].concat(baseConfig.ignore)
  },
  distribute: {
    dir: baseConfig.distributeDir
  },
  options: {
    minify: false
  }
};
export const image = {
  source: {
    dir: baseConfig.sourceDir + '/img',
    glob: [baseConfig.sourceDir + '/img/**/*'],
    ignore: [].concat(baseConfig.ignore)
  },
  distribute: {
    dir: baseConfig.distributeDir
  },
  options: {}
};
