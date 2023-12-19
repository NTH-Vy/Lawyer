const baseConfig = {
  sourceDir: './src',
  distributeDir: './dist',
  ignore: ['!**/.DS_Store', '!**/* copy.*']
};

module.exports = {
  base: baseConfig,
  browserSync: {
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
  },
  html: {
    source: {
      dir: baseConfig.sourceDir + '/pug',
      glob: [baseConfig.sourceDir + '/pug/**/*.pug'],
      ignore: [].concat(baseConfig.ignore)
    },
    distribute: {
      dir: baseConfig.distributeDir
    }
  },
  css: {
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
  },
  js: {
    source: {
      dir: baseConfig.sourceDir,
      glob: [baseConfig.sourceDir + '/js/**/*.js'],
      ignore: [].concat(baseConfig.ignore)
    },
    distribute: {
      dir: baseConfig.distributeDir
    }
  },
  image: {
    source: {
      dir: baseConfig.sourceDir + '/img',
      glob: [baseConfig.sourceDir + '/img/**/*'],
      ignore: [].concat(baseConfig.ignore)
    },
    distribute: {
      dir: baseConfig.distributeDir
    },
    options: {
      kraken: {
        key: '5b61b3c6bba11a2dbc7be9beb3ab11d5',
        secret: '07e8e703c93fa122dd6ff3aa95d555570d9b21eb'
      }
    }
  }
};
