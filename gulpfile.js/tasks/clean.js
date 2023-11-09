const del = require('del');
const config = require('../config').base;

const clean = () => {
  return del([config.distributeDir]);
};

module.exports = {
  clean
};
