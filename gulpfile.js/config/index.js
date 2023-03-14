const baseConfig = {
  sourceDir: './src',
  developDir: './dev',
  distributeDir: './dist',
  ignore: ['!**/.DS_Store', '!**/* copy.*']
};

module.exports = {
  base: baseConfig,
  browserSync: {
    server: {
      baseDir: baseConfig.developDir,
      logLevel: 'silent',
      notify: false,
      reloadDelay: 1000,
      reloadDebounce: 1000
    },
    files: baseConfig.developDir,
    ui: false,
    port: 3000,
    open: 'local',
  },
  html: {
    source: {
      dir: baseConfig.sourceDir,
      glob: [baseConfig.sourceDir + '/pug/**/*.pug'],
      ignore: [].concat(baseConfig.ignore)
    },
    develop: {
      dir: baseConfig.developDir
    },
    distribute: {
      dir: baseConfig.distributeDir
    }
  },
  css: {
    source: {
      dir: baseConfig.sourceDir,
      glob: [baseConfig.sourceDir + '/sass/**/*.s*ss'],
      ignore: [].concat(baseConfig.ignore)
    },
    develop: {
      dir: baseConfig.developDir,
      options: {
        autoprefixer: { map: false, cascade: false }
      }
    },
    distribute: {
      dir: baseConfig.distributeDir,
      options: {
        autoprefixer: { map: false, cascade: false }
      }
    }
  },
  js: {
    source: {
      dir: baseConfig.sourceDir,
      glob: [baseConfig.sourceDir + '/js/**/*.js'],
      ignore: [].concat(baseConfig.ignore)
    },
    develop: {
      dir: baseConfig.developDir
    },
    distribute: {
      dir: baseConfig.distributeDir
    }
  },
  image: {
    source: {
      dir: baseConfig.sourceDir + '/img/',
      glob: [baseConfig.sourceDir + '/img/**/*'],
      ignore: [].concat(baseConfig.ignore)
    },
    develop: {
      dir: baseConfig.developDir
    },
    distribute: {
      dir: baseConfig.distributeDir
    }
  }
};
