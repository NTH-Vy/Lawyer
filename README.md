# Getting started

This template is made by Gulp and Gulp's plugins that are installed and managed via npm, the Node.js package manager. It requires stable Node.js version 16

# Install the Gulp CLI for the first time of using

You’ll need to install Gulp’s command line interface (CLI) globally. You may need to use `sudo` (for OSX, \*nix, BSD etc) or run your command shell as `Administrator` (for Windows) to do this.

```sh
npm install -g gulp-cli
```

# Install npm dependencies

Just simply to use this command

```sh
npm install
```

# Start development mode

Build files and make them ready for your production environment. You will get the files in the `dist` folder.
Beside, it will automatically launch your default web browser to display the current coding, and watch for changes in the "src" folder

```sh
npm run dev
```

# Build files for production

Build files and make them ready for your production environment. You will get the files in the `dist` folder

```sh
npm run build
```

# Minify images

Use this command after done developing or whenever you want to compress all image files again:

```sh
npm run imagemin
```

Note: We use kraken.io service to minify images, you can update setting to your kraken.io account by updating the `krakenConfig` object in the `gulpfile.js/config/index.js` file

# Lint check

Use this command after done developing or whenever you want to check for lint problems again:

```sh
npm run lint
```

# List of npm dependencies

- **autoprefixer**: Add vendor prefixes to CSS rules using values from Can I Use
- **browser-sync**: Live CSS Reload & Browser Syncing
- **cross-env**: Set and use environment variables across platforms
- **cssnano**: A modular minifier, built on top of the PostCSS ecosystem
- **del**: Delete files and directories
- **gulp**: JavaScript task runner
- **gulp-eslint**: Gulp plugin for processing files with ESLint
- **gulp-kraken**: Gulp plugin to optimize all your images with the powerful Kraken.io API
- **gulp-postcss**: Gulp plugin for PostCSS
- **gulp-prettier**: Gulp plugin to format JS files with Prettier
- **gulp-pug**: Gulp plugin to compile Pug files
- **gulp-pug-linter**: Gulp plugin to lint Pug files
- **gulp-sass**: Gulp plugin for Sass
- **gulp-sourcemaps**: Gulp plugin for sourcemap support
- **sass**: A pure JavaScript implementation of Sass
- **spelling**: A spelling checker plugin
- **stylelint**: A mighty CSS linter that helps you avoid errors and enforce conventions
- **stylelint-config-property-sort-order-smacss**: Stylelint config for Property Sort Ordering based on the SMACSS methodology
- **stylelint-config-standard-scss**: The standard SCSS config for Stylelint

# Options

You can update the default options in the `gulpfile.js/config/index.js` file

| Module      | Option     | Description                                                                   | Default Value              |
| ----------- | ---------- | ----------------------------------------------------------------------------- | -------------------------- |
| base        | N/A        | Configuration for the base Gulp setup. Refer to the `baseConfig` object.      | N/A                        |
| kraken      | N/A        | Configuration for the Kraken Gulp setup. Refer to the `krakenConfig` object.  | N/A                        |
| browserSync | server     | Configuration for BrowserSync.                                                | See below                  |
|             | files      | Files to watch for changes.                                                   | `baseConfig.distributeDir` |
|             | ui         | Enable or disable BrowserSync UI.                                             | false                      |
|             | port       | Port on which BrowserSync runs.                                               | 3000                       |
|             | open       | Open BrowserSync in the specified mode (`local`, `external`, `ui`, `tunnel`). | 'local'                    |
| html        | source     | Configuration for HTML source files.                                          | See below                  |
|             | distribute | Configuration for HTML distribution files.                                    | See below                  |
| css         | source     | Configuration for CSS source files.                                           | See below                  |
|             | distribute | Configuration for CSS distribution files.                                     | See below                  |
|             | options    | Additional options for CSS distribution.                                      | `{ minify: true }`         |
| js          | source     | Configuration for JS source files.                                            | See below                  |
|             | distribute | Configuration for JS distribution files.                                      | See below                  |
| image       | source     | Configuration for image source files.                                         | See below                  |
|             | distribute | Configuration for image distribution files.                                   | See below                  |

**Default Values:**

- **browserSync.server:**

  - baseDir: `baseConfig.distributeDir`
  - logLevel: 'silent'
  - notify: false
  - reloadDelay: 1000
  - reloadDebounce: 1000

- **html.source:**

  - dir: `baseConfig.sourceDir + '/pug'`
  - glob: [`baseConfig.sourceDir + '/pug/**/*.pug'`]
  - ignore: `baseConfig.ignore`

- **html.distribute:**

  - dir: `baseConfig.distributeDir`

- **css.source:**

  - dir: `baseConfig.sourceDir`
  - glob: [`baseConfig.sourceDir + '/scss/**/*.scss'`]
  - ignore: `baseConfig.ignore`

- **css.distribute:**

  - dir: `baseConfig.distributeDir`
  - options:
    - minify: true

- **js.source:**

  - dir: `baseConfig.sourceDir`
  - glob: [`baseConfig.sourceDir + '/js/**/*.js'`]
  - ignore: `baseConfig.ignore`

- **js.distribute:**

  - dir: `baseConfig.distributeDir`

- **image.source:**

  - dir: `baseConfig.sourceDir + '/img'`
  - glob: [`baseConfig.sourceDir + '/img/**/*'`]
  - ignore: `baseConfig.ignore`

- **image.distribute:**
  - dir: `baseConfig.distributeDir`
