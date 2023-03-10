const del = require('del');
const config = require('../config').base;

const clean = (cb) => {
  del([config.developDir, config.distributeDir]);
  cb();
};

module.exports = {
  clean
};
