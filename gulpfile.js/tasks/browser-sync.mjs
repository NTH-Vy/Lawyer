import { series } from 'gulp';
import { create } from 'browser-sync';
import { base as config } from '../config/index.mjs';

const webServer = () => {
  create().init(config.browserSync);
};

export const bs = series(webServer);
