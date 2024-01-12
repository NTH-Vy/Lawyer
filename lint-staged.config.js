module.exports = {
  'src/pug/**/*.pug': (allFiles) => {
    return [`gulp lintHtml --stopOnError --file="${allFiles.join(', ')}"`];
  },
  'src/scss/**/*.scss': (allFiles) => {
    return [`gulp lintStyles --stopOnError --file="${allFiles.join(', ')}"`];
  },
  'src/js/**/.js': (allFiles) => {
    return [`gulp lintJs --stopOnError --file="${allFiles.join(', ')}"`];
  },
  'dist/**/*.html': (allFiles) => {
    return [`gulp spellCheck classCheck --stopOnError --file="${allFiles.join(', ')}"`];
  }
}
