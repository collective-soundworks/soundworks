var gulp = require('gulp');
var es6 = require('gulp-es6-transpiler');
var rename = require('gulp-rename');
var watch = require('gulp-watch');

gulp.task('transpile', function() {
//  return gulp.src('**/*.es6.js')
  return gulp.src('server/ServerConnectionManager.es6.js')
    .pipe(es6({
      disallowUnknownReferences: false
    }))
    .pipe(rename(function(path) {
      path.basename = path.basename.replace('.es6', '');
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('watch', function() {
  return gulp.watch('**/*.es6.js', ['transpile']);
});

gulp.task('default', ['transpile', 'watch']);
