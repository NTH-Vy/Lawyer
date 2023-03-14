const { series } = require('gulp');
const browserSync = require('browser-sync');

const webServer = () => {
  browserSync.create().init({
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
  });
};

module.exports = {
  bs: series(webServer)
};
