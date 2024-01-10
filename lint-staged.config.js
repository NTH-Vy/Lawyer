module.exports = {
  'src/pug/**/*.pug': (allFiles) => {
    return ['gulp lintHtml'];
  },
  'src/scss/**/*.scss': (allFiles) => {
    return ['gulp lintStyles'];
  },
  'src/js/**/.js': (allFiles) => {
    return ['gulp lintJs'];
  },
  'dist/**/*.html': (allFiles) => {
    return ['gulp spellCheck classCheck'];
  }
}
