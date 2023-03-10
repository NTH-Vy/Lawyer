const baseConfig = {
  sourceDir: 'src',
  developDir: 'dev',
  distributeDir: 'dist',
  ignore: ['!**/.DS_Store', '!**/* copy.*']
};

module.exports = {
  browserSync: {
    server: {
      baseDir: baseConfig.developDir,
      directory: true,
      logLevel: 'silent',
      notify: false,
      reloadDelay: 1000,
      reloadDebounce: 1000
    },
    port: 3000,
    open: 'local',
    startPath: 'index.html'
  },
  html: {
    source: {
			dir: baseConfig.sourceDir,
      glob: [baseConfig.sourceDir + '/ejs/**/*.pug'],
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
