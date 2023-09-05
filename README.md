# Getting started
This template is made by Gulp and Gulp's plugins that are installed and managed via npm, the Node.js package manager. It requires stable Node.js version 16

# Install the Gulp CLI for the first time of using
You’ll need to install Gulp’s command line interface (CLI) globally. You may need to use sudo (for OSX, *nix, BSD etc) or run your command shell as Administrator (for Windows) to do this.

```sh
npm install -g gulp-cli
```

# Install npm dependencies
Just simply to use this command
```sh
npm install
```

# Start development mode
This command will automatically launch your default web browser to display your current coding, and it will watch for changes in the "src" folder
```sh
npm run dev
```
Note: It will automatically create a "dev" folder, which is intended solely for the development environment and is not suitable for production use. To build for the production environment, please refer to the instructions below

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
Note: We use kraken.io service to minify images, you can update setting to your kraken.io account by updating the `key` and `secret` properties in the `gulpfile.js/tasks/image.js` file

# Lint check
Use this command after done developing or whenever you want to check for lint problems again:
```sh
npm run lint
```
