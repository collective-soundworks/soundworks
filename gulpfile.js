var gulp = require('gulp');
var es6 = require('gulp-es6-transpiler');
var rename = require('gulp-rename');
var watch = require('gulp-watch');

gulp.task('transpile', function() {
 gulp.src(['*/*.es6.js', '!node_modules/**/*.es6.js'])
    .pipe(es6({
      disallowUnknownReferences: false
    }))
    .pipe(rename(function(path) {
      path.basename = path.basename.replace('.es6', '');
    }))
    .on('error', function(err) {
      console.log(err.message);
      this.end();
    })
    .pipe(gulp.dest('.'));
});

gulp.task('watch', function() {
  gulp.watch('**/*.es6.js', ['transpile']);
});

gulp.task('default', ['transpile', 'watch']);
