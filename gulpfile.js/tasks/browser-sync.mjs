import { series } from 'gulp';
import { create } from 'browser-sync';
import { browserSync as config } from '../config/index.mjs';

const webServer = () => {
  create().init(config);
};

export const bs = series(webServer);
