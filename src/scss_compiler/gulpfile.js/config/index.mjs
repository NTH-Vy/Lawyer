const baseConfig = {
  sourceDir: '..',
  distributeDir: '..',
  ignore: ['!**/.DS_Store', '!**/* copy.*']
};

export const base = baseConfig;
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
